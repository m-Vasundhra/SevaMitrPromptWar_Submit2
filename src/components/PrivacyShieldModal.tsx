import React, { useState } from 'react';
import { Language } from '../../shared/types.ts';
import { ShieldCheck, Lock, Eye, Check, X } from 'lucide-react';
import { PrivacyFirewall } from '../../backend/privacyFirewall.ts';

interface PrivacyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PrivacyShieldModal: React.FC<PrivacyShieldModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const [testInput, setTestInput] = useState(
    'My Aadhaar is 4829 1928 3849, debit card is 4532 8192 3847 1920 with CVV 492 and password Secret@123. Please book my ticket.'
  );

  const redaction = PrivacyFirewall.redactSensitiveData(testInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border-2 border-emerald-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-stone-900">
                {language === 'hi' ? 'सारथी प्राइवेसी फ़ायरवॉल (Privacy Shield)' : 'Saarthi Privacy & Data Shield'}
              </h3>
              <p className="text-xs text-stone-600">
                {language === 'hi' ? 'निजी व वित्तीय डेटा AI मॉडल तक पहुँचने से पहले ही शून्य कर दिया जाता है' : 'Sensitive and credential data is masked before touching any GenAI model'}
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

        {/* Real-time Interactive Test Area */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? 'लाइव फ़ायरवॉल सैनिटाइजेशन टेस्ट' : 'Live Redaction Demonstration'}</span>
            </h4>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                {language === 'hi' ? 'मूल इनपुट (Unsanitized Input):' : 'Raw User Input (Contains PII/Financial):'}
              </label>
              <textarea
                rows={2}
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-900">
                {language === 'hi' ? 'AI को भेजा जाने वाला सुरक्षित इनपुट (Sanitized Output):' : 'Sanitized Payload Received by AI Backend:'}
              </label>
              <div className="bg-white border-2 border-emerald-300 rounded-xl p-3 text-xs text-stone-900 font-mono shadow-inner">
                {redaction.cleanText}
              </div>
            </div>

            {redaction.hasRedactions && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-stone-600">Shielded Entities:</span>
                {redaction.redactedTypes.map((type, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ {type}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Guarantees */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600">
              {language === 'hi' ? 'सारथी के 4 सुरक्षा स्तम्भ:' : 'Core Privacy Principles:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-1">
                <strong className="text-stone-900 block">1. Zero Hardcoded Credentials</strong>
                <p className="text-stone-600">API keys are kept strictly server-side using Google Cloud Secret Manager / environment variables.</p>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-1">
                <strong className="text-stone-900 block">2. DOM Shielding</strong>
                <p className="text-stone-600">Password fields, CVVs, and OTP input boxes are systematically excluded from DOM summaries.</p>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-1">
                <strong className="text-stone-900 block">3. Multi-Model Ladder</strong>
                <p className="text-stone-600">Gemini models cascade smoothly (3.8-flash → 3.1-flash-lite) to prevent service interruptions.</p>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-1">
                <strong className="text-stone-900 block">4. Empowerment, Not Replacement</strong>
                <p className="text-stone-600">The companion never executes payments autonomously; it guides the senior to verify and authorize.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition"
          >
            {language === 'hi' ? 'वापस जाएँ' : 'Close Privacy Inspector'}
          </button>
        </div>
      </div>
    </div>
  );
};
