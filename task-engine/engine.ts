import { TaskState, WorkflowType, TaskStep, RiskLevel } from '../shared/types.ts';
import { WORKFLOWS } from './workflows.ts';

export class TaskEngine {
  private state: TaskState;

  constructor(workflowId: WorkflowType = 'train_booking') {
    this.state = {
      workflowId,
      currentStepIndex: 0,
      completedStepIds: [],
      formData: {},
      isCompleted: false,
      history: []
    };
  }

  public getWorkflow(): WorkflowType {
    return this.state.workflowId;
  }

  public setWorkflow(workflowId: WorkflowType) {
    if (!WORKFLOWS[workflowId]) {
      workflowId = 'train_booking';
    }
    this.state = {
      workflowId,
      currentStepIndex: 0,
      completedStepIds: [],
      formData: {},
      isCompleted: false,
      history: []
    };
  }

  public getState(): TaskState {
    return { ...this.state };
  }

  public getCurrentStep(): TaskStep | null {
    const workflow = WORKFLOWS[this.state.workflowId];
    if (!workflow || this.state.currentStepIndex >= workflow.steps.length) {
      return null;
    }
    return workflow.steps[this.state.currentStepIndex];
  }

  public getStepCount(): number {
    const workflow = WORKFLOWS[this.state.workflowId];
    return workflow ? workflow.steps.length : 0;
  }

  public getTotalSteps(): number {
    return this.getStepCount();
  }

  public verifyAndCompleteStep(fieldValues: Record<string, any> = {}): {
    success: boolean;
    nextStep: TaskStep | null;
    isFinished: boolean;
    message?: string;
  } {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      return { success: false, nextStep: null, isFinished: true, message: 'Workflow already completed.' };
    }

    // Merge incoming field values into state formData
    this.state.formData = {
      ...this.state.formData,
      ...fieldValues
    };

    // Mark current step complete
    if (!this.state.completedStepIds.includes(currentStep.id)) {
      this.state.completedStepIds.push(currentStep.id);
    }

    this.state.history.push({
      stepId: currentStep.id,
      timestamp: Date.now(),
      action: currentStep.expectedAction,
      value: currentStep.expectedField ? this.state.formData[currentStep.expectedField] : undefined
    });

    const workflow = WORKFLOWS[this.state.workflowId];
    const nextIndex = this.state.currentStepIndex + 1;

    if (nextIndex < workflow.steps.length) {
      this.state.currentStepIndex = nextIndex;
      return {
        success: true,
        nextStep: workflow.steps[nextIndex],
        isFinished: false
      };
    } else {
      this.state.isCompleted = true;
      return {
        success: true,
        nextStep: null,
        isFinished: true
      };
    }
  }

  // Recovery mechanisms: "I made a mistake"
  public recover(action: 'go_back' | 'retry_step' | 'start_over'): {
    currentStep: TaskStep | null;
    message: { en: string; hi: string };
  } {
    const workflow = WORKFLOWS[this.state.workflowId];

    if (action === 'go_back') {
      if (this.state.currentStepIndex > 0) {
        this.state.currentStepIndex -= 1;
        const previousStep = workflow.steps[this.state.currentStepIndex];
        this.state.completedStepIds = this.state.completedStepIds.filter(id => id !== previousStep.id);
        this.state.isCompleted = false;
        return {
          currentStep: previousStep,
          message: {
            en: `No problem at all! We've moved back to '${previousStep.title.en}'. Take your time.`,
            hi: `कोई बात नहीं! हम एक कदम पीछे '${previousStep.title.hi}' पर आ गए हैं। आराम से करें।`
          }
        };
      }
    } else if (action === 'retry_step') {
      const currentStep = this.getCurrentStep();
      return {
        currentStep,
        message: {
          en: `Let's try this step again calmly. I am highlighting the field for you.`,
          hi: `आइए इस कदम को फिर से आराम से करते हैं। मैं आपके लिए बॉक्स को दोबारा दिखा रहा हूँ।`
        }
      };
    } else if (action === 'start_over') {
      this.state.currentStepIndex = 0;
      this.state.completedStepIds = [];
      this.state.isCompleted = false;
      return {
        currentStep: workflow.steps[0],
        message: {
          en: `We have restarted the task from step 1. Let's do it together!`,
          hi: `हमने पहले कदम से शुरुआत की है। आइए मिलकर करते हैं!`
        }
      };
    }

    return {
      currentStep: this.getCurrentStep(),
      message: {
        en: "I am right here with you.",
        hi: "मैं आपके साथ यहीं हूँ।"
      }
    };
  }

  public getRiskLevel(): RiskLevel {
    const currentStep = this.getCurrentStep();
    return currentStep ? currentStep.riskLevel : 'low';
  }
}
