export type TestMode = 'LIVE' | 'DEMO' | 'SIMULATION';

export type ScenarioCategory = 
  | 'task' 
  | 'safety' 
  | 'scam' 
  | 'language' 
  | 'failure' 
  | 'behavior' 
  | 'realtime' 
  | 'security';

export type ScenarioEventType =
  | 'USER_MESSAGE'
  | 'OPEN_URL'
  | 'PAGE_LOADED'
  | 'USER_CLICK'
  | 'USER_INPUT'
  | 'PAGE_CHANGED'
  | 'NETWORK_FAILURE'
  | 'AI_FAILURE'
  | 'MICROPHONE_FAILURE'
  | 'USER_MADE_MISTAKE'
  | 'RISK_DETECTED';

export interface ScenarioEvent {
  type: ScenarioEventType;
  target?: string;
  value?: string;
  url?: string;
  dom?: any;
  changes?: any;
  level?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export type ExpectedResultType =
  | 'EXPECT_ASSISTANT_MESSAGE'
  | 'EXPECT_TASK_CREATED'
  | 'EXPECT_CURRENT_STEP'
  | 'EXPECT_STEP_COMPLETED'
  | 'EXPECT_STEP_NOT_COMPLETED'
  | 'EXPECT_ELEMENT_HIGHLIGHTED'
  | 'EXPECT_OFFICIAL_WEBSITE'
  | 'EXPECT_EXTERNAL_LINK'
  | 'EXPECT_RISK_LEVEL'
  | 'EXPECT_CONFIRMATION_REQUIRED'
  | 'EXPECT_SENSITIVE_DATA_REDACTED'
  | 'EXPECT_NO_CREDENTIAL_REQUEST'
  | 'EXPECT_LANGUAGE'
  | 'EXPECT_VOICE_LANGUAGE'
  | 'EXPECT_ERROR_STATE'
  | 'EXPECT_DEMO_LABEL'
  | 'EXPECT_LIVE_DATA_LABEL'
  | 'EXPECT_PROMPT_INJECTION_DEFENSE';

export interface ExpectedResult {
  type: ExpectedResultType;
  contains?: string;
  notContains?: string;
  task?: string;
  step?: string;
  selector?: string;
  level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'low' | 'medium' | 'high';
  required?: boolean;
  verified?: boolean;
  language?: 'en' | 'hi';
  forbiddenStrings?: string[];
  expected?: boolean;
  safeMessageOnly?: boolean;
  description?: string;
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  category: ScenarioCategory;
  mode: TestMode;
  language: 'en' | 'hi';
  userInput: string;
  initialState: {
    url?: string;
    domain?: string;
    task?: string;
    currentStep?: string;
    pageContext?: unknown;
  };
  events: ScenarioEvent[];
  expectedResults: ExpectedResult[];
}

export interface AssertionResult {
  type: ExpectedResultType;
  passed: boolean;
  message: string;
  expected?: any;
  actual?: any;
}

export interface ScenarioRunReport {
  scenarioId: string;
  name: string;
  category: ScenarioCategory;
  mode: TestMode;
  status: 'PASS' | 'FAIL' | 'SKIPPED';
  durationMs: number;
  assertionResults: AssertionResult[];
  logs: string[];
  errorMessage?: string;
}
