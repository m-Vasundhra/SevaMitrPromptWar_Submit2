import React from 'react';
import { Language } from '../../shared/types.ts';
import { ShieldAlert, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface RiskConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  warning: string;
  actionLabel: string;
  onConfirm: () => void;
  language: Language;
}

export const RiskConfirmationModal: React.FC<RiskConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  warning,
  actionLabel,
  onConfirm,
  language
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border-2 border-rose-400 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-inner">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 leading-tight">
                {title}
              </h3>
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                {language === 'hi' ? 'उच्च-जोखिम सुरक्षा जांच' : 'High-Risk Safety Check'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Text */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{language === 'hi' ? 'कृपया स्वयं जांचें (User Self-Verification Required)' : 'User Self-Verification Required'}</span>
          </div>
          <p className="text-sm font-bold text-stone-800 leading-relaxed">
            {warning}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
          <p className="font-semibold">
            {language === 'hi'
              ? '💡 सारथी का सुरक्षा नियम: यह एक वित्तीय कदम है। हमेशा प्राप्तकर्ता, खाता विवरण और धनराशि की खुद पुष्टि करें।'
              : '💡 Saarthi Rule: This is a financial action. Always personally verify the recipient, account, and exact amount.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition"
          >
            {language === 'hi' ? 'रद्द करें (Cancel)' : 'Cancel & Review'}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
