import React from 'react';
import { WorkflowType, Language, TaskStep } from '../../shared/types.ts';
import { TrainBookingView } from './TrainBookingView.tsx';
import { FlightBookingView } from './FlightBookingView.tsx';
import { BankingPortalView } from './BankingPortalView.tsx';
import { ScamInspectorView } from './ScamInspectorView.tsx';
import { 
  Lock, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  ExternalLink 
} from 'lucide-react';

interface SimulatedWebEnvironmentProps {
  workflowId: WorkflowType;
  language: Language;
  currentStep: TaskStep | null;
  onFieldChange: (field: string, value: any) => void;
  onCompleteStep: (fields: Record<string, any>) => void;
  formData: Record<string, any>;
  onTriggerHighRiskGate: (details: { title: string; warning: string; actionLabel: string; onConfirm: () => void }) => void;
  onAnalyzeScamMessage: (text: string, source: 'sms' | 'whatsapp' | 'email' | 'url') => Promise<any>;
}

export const SimulatedWebEnvironment: React.FC<SimulatedWebEnvironmentProps> = ({
  workflowId,
  language,
  currentStep,
  onFieldChange,
  onCompleteStep,
  formData,
  onTriggerHighRiskGate,
  onAnalyzeScamMessage
}) => {
  const getUrl = () => {
    switch (workflowId) {
      case 'train_booking':
        return 'https://www.irctc.co.in/nget/train-search';
      case 'flight_booking':
        return 'https://flights.airsky.travel/search';
      case 'net_banking':
        return 'https://netbanking.safebank.demo/personal/transfers';
      case 'scam_check':
        return 'https://safety.saarthi.ai/scam-inspector';
      default:
        return 'https://services.demo.in';
    }
  };

  const getPageTitle = () => {
    switch (workflowId) {
      case 'train_booking':
        return 'IRCTC Official eTicketing Portal';
      case 'flight_booking':
        return 'AirSky Flight Booking';
      case 'net_banking':
        return 'SafeBank Senior NetBanking Portal';
      case 'scam_check':
        return 'Saarthi Scam & Fraud Shield';
      default:
        return 'Digital Service Portal';
    }
  };

  return (
    <div className="bg-stone-200/80 rounded-3xl p-3 sm:p-4 border-2 border-stone-300 shadow-xl space-y-3">
      {/* Browser Chrome Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        {/* Window controls */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold text-stone-600 ml-2 font-mono hidden sm:inline">
            {getPageTitle()}
          </span>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-1.5 shadow-inner text-xs font-mono text-stone-700">
          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate flex-1">{getUrl()}</span>
          <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded font-sans font-semibold">
            SIMULATED SANDBOX
          </span>
        </div>

        <div className="flex items-center gap-1 text-stone-500">
          <button className="p-1 rounded hover:bg-stone-300 transition" title="Back">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-stone-300 transition" title="Forward">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-stone-300 transition" title="Reload">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Webpage Content Viewport */}
      <div id="simulated-browser-viewport" className="rounded-2xl overflow-hidden shadow-inner">
        {workflowId === 'train_booking' && (
          <TrainBookingView
            language={language}
            currentStep={currentStep}
            onFieldChange={onFieldChange}
            onCompleteStep={onCompleteStep}
            formData={formData}
            onTriggerHighRiskGate={onTriggerHighRiskGate}
          />
        )}

        {workflowId === 'flight_booking' && (
          <FlightBookingView
            language={language}
            currentStep={currentStep}
            onFieldChange={onFieldChange}
            onCompleteStep={onCompleteStep}
            formData={formData}
            onTriggerHighRiskGate={onTriggerHighRiskGate}
          />
        )}

        {workflowId === 'net_banking' && (
          <BankingPortalView
            language={language}
            currentStep={currentStep}
            onFieldChange={onFieldChange}
            onCompleteStep={onCompleteStep}
            formData={formData}
            onTriggerHighRiskGate={onTriggerHighRiskGate}
          />
        )}

        {workflowId === 'scam_check' && (
          <ScamInspectorView
            language={language}
            onAnalyzeMessage={onAnalyzeScamMessage}
          />
        )}
      </div>
    </div>
  );
};
