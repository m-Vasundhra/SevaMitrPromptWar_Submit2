import React from 'react';
import { Language } from '../../shared/types.ts';
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  FolderTree, 
  Globe, 
  Server, 
  Check, 
  X,
  Lock
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const modules = [
    {
      dir: '/frontend',
      title: 'Frontend Client (SPA & Design System)',
      desc: 'React 18 + Tailwind CSS. Houses FirstPage experience, dynamic typography scaling (A/A+/A++), Companion Avatar with emotional states, speech synthesis & recognition.',
      badge: 'Client UI'
    },
    {
      dir: '/extension',
      title: 'Browser Extension Bridge',
      desc: 'Decoupled content script logic to safely inspect DOM elements, highlight targets with pulsing rings, and bridge page events without exposing secrets.',
      badge: 'Extension Ready'
    },
    {
      dir: '/task-engine',
      title: 'Task Engine State Machine',
      desc: 'Workflow-agnostic state machine managing active steps, completed steps, input verification, and recovery actions (go_back, retry_step, start_over).',
      badge: 'Core Logic'
    },
    {
      dir: '/backend',
      title: 'Express API Server & Privacy Firewall',
      desc: 'Server-side API routes (/api/assistant, /api/scam-analysis, /api/screen-analysis) with pre-AI regex sanitization shielding Aadhaar, OTP, PIN, & Cards.',
      badge: 'Secure Gateway'
    },
    {
      dir: '/ai',
      title: 'Gemini GenAI Resilience Ladder',
      desc: 'Cascading AI model fallback (gemini-3.8-flash ➔ gemini-3.1-flash-lite ➔ gemini-flash-latest) providing structured, senior-friendly step guidance and scam detection.',
      badge: 'GenAI SDK'
    },
    {
      dir: '/shared',
      title: 'Shared Schemas & Locales',
      desc: 'Strict TypeScript interfaces, i18n dictionaries (English & Hindi), and declarative workflow definitions for railways, airlines, and banking.',
      badge: 'Type Safety'
    },
    {
      dir: '/testing',
      title: 'Testing & Scenario Engine',
      desc: '30+ reusable test scenarios exercising real Task Engine, Privacy Firewall, Official Portal Resolvers, and Prompt-Injection Defenses without fake product logic.',
      badge: 'Test Suite'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border-2 border-amber-300 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-stone-900">
                System Architecture &amp; Security Review
              </h3>
              <p className="text-xs text-stone-600">
                Decoupled modular architecture built for safety, browser extension readiness, and resilience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modular Grid */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modules.map((mod, idx) => (
              <div key={idx} className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                    {mod.dir}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                    {mod.badge}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-stone-900">
                  {mod.title}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {mod.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Security & Threat Countermeasure Summary */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 space-y-2 mt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security &amp; Threat Model Countermeasures</span>
            </h4>
            <div className="text-xs text-stone-700 space-y-1">
              <p>• <strong>Zero Credential Exposer:</strong> AI prompts never receive raw passwords or OTPs due to strict regex redaction in PrivacyFirewall.</p>
              <p>• <strong>Server-Side Secret Isolation:</strong> Gemini API keys are consumed exclusively in server runtime (never exposed to client bundle).</p>
              <p>• <strong>High-Risk Human Gate:</strong> Financial transactions require intentional senior confirmation with explicit warning modals.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
