import express, { Request, Response } from 'express';
import { generateCompanionGuidance, analyzeScamMessage } from './gemini.ts';
import { PrivacyFirewall } from './privacyFirewall.ts';
import { TaskEngine } from '../task-engine/engine.ts';
import { WorkflowType, Language } from '../shared/types.ts';
import { WORKFLOWS } from '../task-engine/workflows.ts';

export const apiRouter = express.Router();

// Memory store for active sessions (temporary session state)
const activeSessions: Map<string, TaskEngine> = new Map();

function getOrCreateSession(sessionId: string, workflowId: WorkflowType = 'train_booking'): TaskEngine {
  if (!activeSessions.has(sessionId)) {
    activeSessions.set(sessionId, new TaskEngine(workflowId));
  }
  return activeSessions.get(sessionId)!;
}

// 1. Assistant Guidance Endpoint
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

    const guidance = await generateCompanionGuidance({
      userQuery,
      language: (language === 'hi' ? 'hi' : 'en') as Language,
      domain,
      pageContext,
      activeStepName,
      riskLevel,
      completedSteps: Array.isArray(completedSteps) ? completedSteps : []
    });

    res.json({ success: true, data: guidance });
  } catch (error: any) {
    console.error('[API /api/assistant] Error:', error?.message || error);
    res.status(500).json({
      success: false,
      error: 'Unable to process assistant request. Falling back to rule-based guide.'
    });
  }
});

// 2. Screen Analysis Endpoint
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

// 3. Task State Machine Operations Endpoint
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

// 4. Scam Analysis Endpoint
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

    const result = await analyzeScamMessage({
      text,
      sourceType,
      language: (language === 'hi' ? 'hi' : 'en') as Language
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[API /api/scam-analysis] Error:', error?.message || error);
    res.status(500).json({
      success: false,
      error: 'Unable to analyze message at this time.'
    });
  }
});

// 5. Safety & Privacy Firewall Endpoint
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
