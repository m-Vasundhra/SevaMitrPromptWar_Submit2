import express, { Request, Response } from 'express';
import { generateCompanionGuidance, analyzeScamMessage } from './gemini.ts';
import { PrivacyFirewall } from './privacyFirewall.ts';
import { TaskEngine } from '../task-engine/engine.ts';
import { WorkflowType, Language } from '../shared/types.ts';
import { WORKFLOWS } from '../task-engine/workflows.ts';
import { ALL_TEST_SCENARIOS, ScenarioRunner, TestScenario } from '../src/testing/index.ts';

export const apiRouter = express.Router();

// ---------------------------------------------------------------------------
// 1. High-Performance LRU/TTL Response Cache
// ---------------------------------------------------------------------------
class SimpleResponseCache {
  private cache = new Map<string, { data: any; expiry: number }>();
  private maxEntries: number;
  private defaultTTLMs: number;

  constructor(maxEntries = 300, defaultTTLMs = 10 * 60 * 1000) {
    this.maxEntries = maxEntries;
    this.defaultTTLMs = defaultTTLMs;
  }

  public get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  public set(key: string, data: any, ttlMs = this.defaultTTLMs): void {
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, { data, expiry: Date.now() + ttlMs });
  }

  public clear(): void {
    this.cache.clear();
  }
}

const assistantCache = new SimpleResponseCache(200, 5 * 60 * 1000); // 5 min
const scamCache = new SimpleResponseCache(200, 15 * 60 * 1000); // 15 min

// Memory store for active sessions (temporary session state)
const activeSessions: Map<string, TaskEngine> = new Map();

function getOrCreateSession(sessionId: string, workflowId: WorkflowType = 'train_booking'): TaskEngine {
  if (!activeSessions.has(sessionId)) {
    activeSessions.set(sessionId, new TaskEngine(workflowId));
  }
  return activeSessions.get(sessionId)!;
}

// ---------------------------------------------------------------------------
// 2. Assistant Guidance Endpoint (with deduplication cache)
// ---------------------------------------------------------------------------
apiRouter.post('/assistant', async (req: Request, res: Response) => {
  try {
    const data = (req.body && typeof req.body === 'object') ? req.body : {};
    const {
      userQuery = '',
      language = 'en',
      domain = 'irctc.co.in',
      pageContext = '',
      activeStepName = '',
      riskLevel = 'low',
      completedSteps = []
    } = data;

    // Cache key based on normalized inputs
    const cacheKey = `asst_${language}_${activeStepName}_${riskLevel}_${userQuery.trim().toLowerCase()}`;
    const cached = assistantCache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, fromCache: true });
    }

    const guidance = await generateCompanionGuidance({
      userQuery,
      language: (language === 'hi' ? 'hi' : 'en') as Language,
      domain,
      pageContext,
      activeStepName,
      riskLevel,
      completedSteps: Array.isArray(completedSteps) ? completedSteps : []
    });

    assistantCache.set(cacheKey, guidance);
    res.json({ success: true, data: guidance });
  } catch (error: any) {
    console.error('[API /api/assistant] Error:', error?.message || error);
    res.status(500).json({
      success: false,
      error: 'Unable to process assistant request. Falling back to rule-based guide.'
    });
  }
});

// ---------------------------------------------------------------------------
// 3. Screen Analysis Endpoint
// ---------------------------------------------------------------------------
apiRouter.post('/screen-analysis', (req: Request, res: Response) => {
  try {
    const data = (req.body && typeof req.body === 'object') ? req.body : {};
    const {
      url = 'https://irctc.co.in/nget/train-search',
      domain = 'irctc.co.in',
      title = 'Train Ticket Search',
      domSummary = [],
      language = 'en'
    } = data;

    // Sanitize DOM elements through Privacy Firewall
    const sanitizedElements = PrivacyFirewall.sanitizeDomElements(domSummary);
    
    // Check for high-risk elements
    const highRiskElements = sanitizedElements.filter(el => 
      /(payment|pay|transfer|send-money|confirm-payment)/i.test(`${el.selector} ${el.text || ''}`)
    );

    const result = {
      website: domain,
      page_type: domain.includes('bank') ? 'Banking & Account Portal' : domain.includes('flight') ? 'Airline Flight Portal' : 'Railway Reservation Portal',
      visible_controls_count: sanitizedElements.length,
      identified_fields: sanitizedElements.map(el => ({
        selector: el.selector,
        label: el.text || el.placeholder || el.selector,
        purpose: 'Form Input / Action',
        risk_level: /(pay|transfer|card|password)/i.test(el.selector) ? 'high' : 'low'
      })),
      current_workflow_stage: highRiskElements.length > 0 ? 'checkout_or_payment' : 'form_filling',
      privacy_fields_shielded: ['password', 'pin', 'cvv', 'card_number', 'aadhaar'],
      safety_warnings: highRiskElements.length > 0 ? [
        language === 'hi'
          ? 'सावधानी: यह वित्तीय कदम है। कृपया राशि और प्राप्तकर्ता की स्वयं जांच करें।'
          : 'Notice: This is a financial step. Please verify the amount and recipient yourself.'
      ] : []
    };

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[API /api/screen-analysis] Error:', error?.message || error);
    res.status(500).json({ success: false, error: 'Screen analysis failed.' });
  }
});

// ---------------------------------------------------------------------------
// 4. Task State Machine Operations Endpoint
// ---------------------------------------------------------------------------
apiRouter.post('/task', (req: Request, res: Response) => {
  try {
    const data = (req.body && typeof req.body === 'object') ? req.body : {};
    const {
      sessionId = 'default-session',
      action = 'get_state',
      workflowId = 'train_booking',
      fieldValues = {},
      recoveryType = 'go_back'
    } = data;

    const engine = getOrCreateSession(sessionId, workflowId);

    if (action === 'set_workflow') {
      engine.setWorkflow(workflowId as WorkflowType);
      return res.json({
        success: true,
        state: engine.getState(),
        currentStep: engine.getCurrentStep(),
        workflow: WORKFLOWS[workflowId as WorkflowType]
      });
    }

    if (action === 'complete_step') {
      const result = engine.verifyAndCompleteStep(fieldValues);
      return res.json({
        success: true,
        result,
        state: engine.getState(),
        currentStep: engine.getCurrentStep()
      });
    }

    if (action === 'recover') {
      const recoveryResult = engine.recover(recoveryType);
      return res.json({
        success: true,
        recovery: recoveryResult,
        state: engine.getState(),
        currentStep: engine.getCurrentStep()
      });
    }

    // Default: get current state
    res.json({
      success: true,
      state: engine.getState(),
      currentStep: engine.getCurrentStep(),
      workflow: WORKFLOWS[engine.getWorkflow()]
    });
  } catch (error: any) {
    console.error('[API /api/task] Error:', error?.message || error);
    res.status(500).json({ success: false, error: 'Task operation error' });
  }
});

// ---------------------------------------------------------------------------
// 5. Scam Analysis Endpoint (with deduplication cache)
// ---------------------------------------------------------------------------
apiRouter.post('/scam-analysis', async (req: Request, res: Response) => {
  try {
    const data = (req.body && typeof req.body === 'object') ? req.body : {};
    const {
      text = '',
      sourceType = 'sms',
      language = 'en'
    } = data;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide message text to analyze.'
      });
    }

    // Cache key based on message text hash/prefix
    const cacheKey = `scam_${language}_${sourceType}_${text.trim().toLowerCase()}`;
    const cached = scamCache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, fromCache: true });
    }

    const result = await analyzeScamMessage({
      text,
      sourceType,
      language: (language === 'hi' ? 'hi' : 'en') as Language
    });

    scamCache.set(cacheKey, result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[API /api/scam-analysis] Error:', error?.message || error);
    res.status(500).json({
      success: false,
      error: 'Unable to analyze message at this time.'
    });
  }
});

// ---------------------------------------------------------------------------
// 6. Safety & Privacy Firewall Endpoint
// ---------------------------------------------------------------------------
apiRouter.post('/safety/redact', (req: Request, res: Response) => {
  try {
    const data = (req.body && typeof req.body === 'object') ? req.body : {};
    const { text = '' } = data;
    const result = PrivacyFirewall.redactSensitiveData(text);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Redaction failed' });
  }
});

// ---------------------------------------------------------------------------
// 7. Backend-Only Testing Endpoints (Scenarios & Automated Regression Suite)
// ---------------------------------------------------------------------------
apiRouter.get('/test/scenarios', (_req: Request, res: Response) => {
  try {
    const scenarioList = ALL_TEST_SCENARIOS.map((s: TestScenario) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      category: s.category,
      mode: s.mode,
      language: s.language,
      totalEvents: s.events.length,
      totalAssertions: s.expectedResults.length
    }));
    res.json({ success: true, scenarios: scenarioList, total: scenarioList.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to list test scenarios' });
  }
});

apiRouter.post('/test/run', async (req: Request, res: Response) => {
  try {
    const { scenarioId } = (req.body && typeof req.body === 'object') ? req.body : {};
    if (!scenarioId) {
      return res.status(400).json({ success: false, error: 'scenarioId parameter is required' });
    }

    const scenario = ALL_TEST_SCENARIOS.find((s: TestScenario) => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ success: false, error: `Scenario with id '${scenarioId}' not found` });
    }

    const runner = new ScenarioRunner();
    const result = await runner.runScenario(scenario);

    res.json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Scenario execution failed' });
  }
});

apiRouter.post('/test/run-all', async (_req: Request, res: Response) => {
  try {
    const runner = new ScenarioRunner();
    const suite = await runner.runAll();
    res.json({ success: true, suite });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Test suite execution failed' });
  }
});
