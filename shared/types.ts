export type Language = 'en' | 'hi';

export type WorkflowType = 'train_booking' | 'flight_booking' | 'net_banking' | 'scam_check' | 'custom';

export type RiskLevel = 'low' | 'medium' | 'high';

export type AssistantVoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface TaskStep {
  id: string;
  stepNumber: number;
  name: string;
  title: {
    en: string;
    hi: string;
  };
  instruction: {
    en: string;
    hi: string;
  };
  spokenPrompt: {
    en: string;
    hi: string;
  };
  targetElementSelector: string;
  targetElementName: {
    en: string;
    hi: string;
  };
  expectedAction: 'input' | 'click' | 'select' | 'confirm' | 'inspect';
  expectedField?: string;
  expectedValue?: string;
  riskLevel: RiskLevel;
  requiresConfirmation?: boolean;
  explanationTerms?: Array<{
    term: string;
    meaning: {
      en: string;
      hi: string;
    };
  }>;
}

export interface TaskDefinition {
  id: WorkflowType;
  title: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  domain: string;
  steps: TaskStep[];
}

export interface TaskState {
  workflowId: WorkflowType;
  currentStepIndex: number;
  completedStepIds: string[];
  failedStepId?: string;
  formData: Record<string, any>;
  isCompleted: boolean;
  history: Array<{
    stepId: string;
    timestamp: number;
    action: string;
    value?: any;
  }>;
}

export interface AssistantResponse {
  intent: string;
  current_step: string;
  message: string;
  spoken_message?: string;
  next_action: 'highlight_element' | 'wait_for_user' | 'show_warning' | 'verify_step' | 'task_complete' | 'general_advice';
  target: string;
  risk_level: RiskLevel;
  requires_confirmation: boolean;
  confirmation_details?: {
    title: string;
    warning: string;
    actionLabel: string;
  };
  explanation?: string;
  suggested_chips?: string[];
}

export interface ScreenAnalysisInput {
  url: string;
  domain: string;
  title: string;
  domSummary: Array<{
    selector: string;
    tag: string;
    type?: string;
    name?: string;
    placeholder?: string;
    text?: string;
    value?: string;
    disabled?: boolean;
    isVisible?: boolean;
  }>;
  currentInputValue?: Record<string, string>;
  activeStep?: string;
  language: Language;
}

export interface ScreenAnalysisResult {
  website: string;
  page_type: string;
  visible_controls_count: number;
  identified_fields: Array<{
    selector: string;
    label: string;
    purpose: string;
    risk_level: RiskLevel;
  }>;
  current_workflow_stage: string;
  privacy_fields_shielded: string[];
  safety_warnings: string[];
}

export interface ScamAnalysisInput {
  text: string;
  sourceType: 'sms' | 'email' | 'whatsapp' | 'url' | 'website';
  url?: string;
  language: Language;
}

export interface RedactionResult {
  cleanedText: string;
  cleanText?: string;
  hasRedactions: boolean;
  redactedCount: number;
  redactedTypes: string[];
}

export interface ScamAnalysisResult {
  risk_level: 'low' | 'medium' | 'high';
  risk?: 'low' | 'medium' | 'high';
  confidence_score: number;
  confidence?: 'high' | 'medium' | 'low';
  category?: string;
  summary: {
    en: string;
    hi: string;
  } | string;
  indicators: string[];
  recommended_action: {
    en: string;
    hi: string;
  } | string;
  why_explanation?: string;
  redacted_preview?: string;
}

export interface UserSession {
  sessionId: string;
  language: Language;
  fontSize: 'normal' | 'large' | 'extra-large';
  voiceEnabled: boolean;
  currentWorkflow?: WorkflowType;
}
