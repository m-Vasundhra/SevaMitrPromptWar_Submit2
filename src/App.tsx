import React, { useState, useEffect, useRef } from 'react';
import { 
  Language, 
  WorkflowType, 
  TaskStep, 
  TaskState, 
  AssistantVoiceState, 
  ScamAnalysisResult 
} from '../shared/types.ts';
import { getTranslation } from '../shared/locales/index.ts';
import { WORKFLOWS } from '../task-engine/workflows.ts';
import { TaskEngine } from '../task-engine/engine.ts';
import { BrowserExtensionBridge } from '../extension/bridge.ts';
import { FirstPage } from './components/FirstPage.tsx';
import { CompanionBar } from './components/CompanionBar.tsx';
import { SimulatedWebEnvironment } from './components/SimulatedWebEnvironment.tsx';
import { TermsGlossaryModal } from './components/TermsGlossaryModal.tsx';
import { RiskConfirmationModal } from './components/RiskConfirmationModal.tsx';
import { PrivacyShieldModal } from './components/PrivacyShieldModal.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { TestScenarioDashboardModal } from './components/testing/TestScenarioDashboardModal.tsx';
import { 
  ArrowLeft, 
  Languages, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Layers,
  HeartHandshake,
  FlaskConical
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('sevamitr_language') as Language) || (localStorage.getItem('sevemitr_language') as Language) || (localStorage.getItem('saarthi_language') as Language) || 'hi';
  });
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('large');
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowType | null>(null);

  // 2. Task Engine & Step State
  const engineRef = useRef<TaskEngine | null>(null);
  const [currentStep, setCurrentStep] = useState<TaskStep | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [stepJustCompleted, setStepJustCompleted] = useState(false);

  // 3. Companion Voice & Message State
  const [voiceState, setVoiceState] = useState<AssistantVoiceState>('idle');
  const [customAssistantMessage, setCustomAssistantMessage] = useState<string | undefined>(undefined);

  // 4. Modals State
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isPrivacyShieldOpen, setIsPrivacyShieldOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isTestingOpen, setIsTestingOpen] = useState(() => {
    return window.location.pathname.includes('test') || window.location.hash.includes('test');
  });
  const [riskModalData, setRiskModalData] = useState<{
    title: string;
    warning: string;
    actionLabel: string;
    onConfirm: () => void;
  } | null>(null);

  const t = getTranslation(language);

  // Sync language change
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('sevamitr_language', lang);
  };

  // Start workflow
  const handleStartWorkflow = (workflowId: WorkflowType) => {
    const engine = new TaskEngine(workflowId);
    engineRef.current = engine;
    setActiveWorkflow(workflowId);
    setFormData({});
    setCustomAssistantMessage(undefined);
    setStepJustCompleted(false);

    const step = engine.getCurrentStep();
    setCurrentStep(step);
    setStepIndex(0);
    setTotalSteps(engine.getTotalSteps());

    // Highlight target element if present
    if (step && step.targetElementSelector) {
      setTimeout(() => {
        BrowserExtensionBridge.highlightElement(step.targetElementSelector, step.instruction[language]);
      }, 300);
    }
  };

  // Back to First Page
  const handleBackToHome = () => {
    BrowserExtensionBridge.removeHighlight();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveWorkflow(null);
    engineRef.current = null;
    setCurrentStep(null);
    setFormData({});
  };

  // Highlight synchronization on step changes
  useEffect(() => {
    if (currentStep && currentStep.targetElementSelector) {
      const timer = setTimeout(() => {
        BrowserExtensionBridge.highlightElement(
          currentStep.targetElementSelector,
          currentStep.instruction[language]
        );
      }, 350);
      return () => clearTimeout(timer);
    } else {
      BrowserExtensionBridge.removeHighlight();
    }
  }, [currentStep, language]);

  // Field change handler in simulation
  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Complete Step in State Machine
  const handleCompleteStep = (fields: Record<string, any>) => {
    if (!engineRef.current) return;

    setIsVerifying(true);
    const updatedForm = { ...formData, ...fields };
    setFormData(updatedForm);

    setTimeout(() => {
      if (!engineRef.current) return;
      const result = engineRef.current.verifyAndCompleteStep(updatedForm);
      setIsVerifying(false);

      if (result.success) {
        setStepJustCompleted(true);
        const nextStep = engineRef.current.getCurrentStep();
        const state = engineRef.current.getState();
        setStepIndex(state.currentStepIndex);
        setCurrentStep(nextStep);
        setCustomAssistantMessage(undefined);

        setTimeout(() => setStepJustCompleted(false), 2500);
      } else {
        setCustomAssistantMessage(
          language === 'hi'
            ? `कृपया जांचें: ${result.message || 'कदम पूरा नहीं हुआ'}`
            : `Please check: ${result.message || 'Step could not be completed'}`
        );
      }
    }, 400);
  };

  // Recovery handling (I made a mistake)
  const handleRecovery = (type: 'go_back' | 'retry_step' | 'start_over') => {
    if (!engineRef.current) return;

    const result = engineRef.current.recover(type);
    const step = engineRef.current.getCurrentStep();
    const state = engineRef.current.getState();

    setCurrentStep(step);
    setStepIndex(state.currentStepIndex);
    setCustomAssistantMessage(result.message[language]);

    if (type === 'start_over') {
      setFormData({});
    }
  };

  // Ask custom query to GenAI backend (/api/assistant)
  const handleAskCustomQuery = async (query: string) => {
    setVoiceState('processing');
    setCustomAssistantMessage(language === 'hi' ? 'सेवामित्र सोच रहा है...' : 'SevaMitr is thinking...');

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: query,
          language,
          domain: activeWorkflow === 'train_booking' ? 'irctc.co.in' : activeWorkflow === 'flight_booking' ? 'airsky.travel' : 'safebank.demo',
          activeStepName: currentStep?.title[language] || '',
          riskLevel: currentStep?.riskLevel || 'low',
          completedSteps: engineRef.current?.getState().completedStepIds || []
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        const text = json.data.guidance_text || json.data.step_action_explanation || t.waitingForUser;
        setCustomAssistantMessage(text);
      } else {
        setCustomAssistantMessage(
          language === 'hi'
            ? 'अगले कदम के लिए कृपया स्क्रीन पर चमकीले पीले घेरे वाले बॉक्स को देखें।'
            : 'For the next step, please look at the highlighted golden box on screen.'
        );
      }
    } catch (err) {
      console.warn('Custom assistant query error:', err);
      setCustomAssistantMessage(
        language === 'hi'
          ? 'मैं आपकी मदद के लिए यहाँ हूँ। कृपया स्क्रीन पर दिए गए कदम को पूरा करें।'
          : 'I am here to help you. Please complete the highlighted step on the screen.'
      );
    } finally {
      setVoiceState('idle');
    }
  };

  // Analyze scam message via API (/api/scam-analysis)
  const handleAnalyzeScamMessage = async (
    text: string,
    source: 'sms' | 'whatsapp' | 'email' | 'url'
  ): Promise<ScamAnalysisResult | null> => {
    try {
      const response = await fetch('/api/scam-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceType: source,
          language
        })
      });
      const json = await response.json();
      if (json.success && json.data) {
        return json.data;
      }
      return null;
    } catch (err) {
      console.error('Scam analysis error:', err);
      return null;
    }
  };

  // High risk confirmation gate trigger
  const handleTriggerHighRiskGate = (details: {
    title: string;
    warning: string;
    actionLabel: string;
    onConfirm: () => void;
  }) => {
    setRiskModalData(details);
  };

  // Dynamic font size classes for senior readability
  const fontClass = fontSize === 'extra-large' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div className={`min-h-screen bg-stone-100 text-stone-900 ${fontClass}`}>
      {/* 1. If no active workflow, show FIRST PAGE EXPERIENCE directly */}
      {!activeWorkflow ? (
        <FirstPage
          language={language}
          onSelectLanguage={handleSelectLanguage}
          onStartWorkflow={handleStartWorkflow}
          fontSize={fontSize}
          onChangeFontSize={setFontSize}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onOpenTesting={() => setIsTestingOpen(true)}
        />
      ) : (
        /* 2. Active Digital Companion Experience Layout */
        <div className="min-h-screen flex flex-col">
          {/* Top Companion Header Bar */}
          <header className="bg-white border-b-2 border-amber-200/80 sticky top-0 z-30 px-4 py-3 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              {/* Back to Workflows */}
              <div className="flex items-center gap-3">
                <button
                  id="btn-back-home"
                  onClick={handleBackToHome}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition border border-stone-300"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-700" />
                  <span>{t.backToWorkflows}</span>
                </button>

                <div className="h-6 w-px bg-stone-300 hidden sm:block" />

                <div>
                  <h1 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2 leading-none">
                    <span>{t.appName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                      {activeWorkflow === 'train_booking'
                        ? t.trainBooking
                        : activeWorkflow === 'flight_booking'
                        ? t.flightBooking
                        : activeWorkflow === 'net_banking'
                        ? t.netBanking
                        : t.scamCheck}
                    </span>
                  </h1>
                </div>
              </div>

              {/* Global Utility Controls */}
              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div className="flex items-center bg-amber-50 border border-amber-300 rounded-xl p-0.5 text-xs font-bold">
                  <button
                    onClick={() => handleSelectLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      language === 'en' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleSelectLanguage('hi')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      language === 'hi' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-700'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>

                {/* Text Size Scale */}
                <div className="flex items-center bg-stone-100 border border-stone-300 rounded-xl p-0.5 text-xs font-bold">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-1 rounded-lg transition ${fontSize === 'normal' ? 'bg-amber-200 text-amber-900 font-black' : 'text-stone-700'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-1 rounded-lg text-sm transition ${fontSize === 'large' ? 'bg-amber-200 text-amber-900 font-black' : 'text-stone-700'}`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('extra-large')}
                    className={`px-2 py-1 rounded-lg text-base transition ${fontSize === 'extra-large' ? 'bg-amber-200 text-amber-900 font-black' : 'text-stone-700'}`}
                  >
                    A++
                  </button>
                </div>

                {/* Testing Engine Trigger */}
                <button
                  id="btn-nav-testing"
                  onClick={() => setIsTestingOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  title="Scenario Testing Engine"
                >
                  <FlaskConical className="w-4 h-4 text-amber-800" />
                  <span className="hidden md:inline">Tests</span>
                </button>

                {/* Glossary & Privacy Trigger */}
                <button
                  id="btn-nav-glossary"
                  onClick={() => setIsGlossaryOpen(true)}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition"
                  title="Plain-language glossary"
                >
                  <BookOpen className="w-4 h-4" />
                </button>

                <button
                  id="btn-nav-arch"
                  onClick={() => setIsArchitectureOpen(true)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 text-xs font-bold transition"
                  title="Architecture review"
                >
                  <Layers className="w-4 h-4 text-amber-700" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Companion Studio Layout */}
          <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Top: Companion Assistant Dock (Col 12 on mobile, Col 5 on large screen) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
              <CompanionBar
                language={language}
                currentStep={currentStep}
                stepIndex={stepIndex}
                totalSteps={totalSteps}
                voiceState={voiceState}
                onVoiceStateChange={setVoiceState}
                onRecovery={handleRecovery}
                onAskCustomQuery={handleAskCustomQuery}
                onOpenGlossary={() => setIsGlossaryOpen(true)}
                onOpenPrivacyShield={() => setIsPrivacyShieldOpen(true)}
                customAssistantMessage={customAssistantMessage}
                isVerifying={isVerifying}
                stepJustCompleted={stepJustCompleted}
              />
            </div>

            {/* Right: Simulated Browser Sandbox (Col 12 on mobile, Col 7 on large screen) */}
            <div className="lg:col-span-7">
              <SimulatedWebEnvironment
                workflowId={activeWorkflow}
                language={language}
                currentStep={currentStep}
                onFieldChange={handleFieldChange}
                onCompleteStep={handleCompleteStep}
                formData={formData}
                onTriggerHighRiskGate={handleTriggerHighRiskGate}
                onAnalyzeScamMessage={handleAnalyzeScamMessage}
              />
            </div>
          </main>
        </div>
      )}

      {/* Interactive Modals */}
      <TermsGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        language={language}
      />

      <PrivacyShieldModal
        isOpen={isPrivacyShieldOpen}
        onClose={() => setIsPrivacyShieldOpen(false)}
        language={language}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
        language={language}
      />

      <TestScenarioDashboardModal
        isOpen={isTestingOpen}
        onClose={() => setIsTestingOpen(false)}
      />

      {riskModalData && (
        <RiskConfirmationModal
          isOpen={Boolean(riskModalData)}
          onClose={() => setRiskModalData(null)}
          title={riskModalData.title}
          warning={riskModalData.warning}
          actionLabel={riskModalData.actionLabel}
          onConfirm={riskModalData.onConfirm}
          language={language}
        />
      )}
    </div>
  );
}
