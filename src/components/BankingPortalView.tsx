import React, { useState } from 'react';
import { Language, TaskStep } from '../../shared/types.ts';
import { 
  Building2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface BankingPortalViewProps {
  language: Language;
  currentStep: TaskStep | null;
  onFieldChange: (field: string, value: any) => void;
  onCompleteStep: (fields: Record<string, any>) => void;
  formData: Record<string, any>;
  onTriggerHighRiskGate: (details: { title: string; warning: string; actionLabel: string; onConfirm: () => void }) => void;
}

export const BankingPortalView: React.FC<BankingPortalViewProps> = ({
  language,
  currentStep,
  onFieldChange,
  onCompleteStep,
  formData,
  onTriggerHighRiskGate
}) => {
  const [showBalance, setShowBalance] = useState(Boolean(formData.showBalance));
  const [isTransferMode, setIsTransferMode] = useState(Boolean(formData.isTransferMode));
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(formData.beneficiary || '');
  const [amount, setAmount] = useState(formData.amount || '5000');
  const [isTransferSuccess, setIsTransferSuccess] = useState(false);

  const activeSelector = currentStep?.targetElementSelector;

  const handleToggleBalance = () => {
    const next = !showBalance;
    setShowBalance(next);
    onFieldChange('showBalance', next);
    if (currentStep?.id === 'view_balance') {
      onCompleteStep({ showBalance: next });
    }
  };

  const handleOpenTransfer = () => {
    setIsTransferMode(true);
    onFieldChange('isTransferMode', true);
    if (currentStep?.id === 'send_money_click') {
      onCompleteStep({ isTransferMode: true });
    }
  };

  const handleSelectBeneficiary = (beneficiaryName: string) => {
    setSelectedBeneficiary(beneficiaryName);
    onFieldChange('beneficiary', beneficiaryName);
    if (currentStep?.id === 'select_beneficiary') {
      onCompleteStep({ beneficiary: beneficiaryName });
    }
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    onFieldChange('amount', val);
    if (currentStep?.id === 'enter_amount' && Number(val) > 0) {
      onCompleteStep({ amount: val });
    }
  };

  const handleConfirmTransfer = () => {
    onTriggerHighRiskGate({
      title: language === 'hi' ? 'वित्तीय सुरक्षा पुष्टि (High-Risk Financial Action)' : 'Financial Security Authorization Gate',
      warning: language === 'hi'
        ? `आप ₹${amount} रमेश शर्मा (पुत्र) के खाते में ट्रांसफर करने जा रहे हैं। कृपया स्क्रीन पर नाम और राशि स्वयं जांचें। सारथी कभी भी आपका पासवर्ड, UPI पिन या बैंक OTP नहीं पूछता।`
        : `You are about to transfer ₹${amount} to Ramesh Sharma (Son). Please verify the recipient name and amount directly on screen. Saarthi AI will never ask for your password, PIN, or OTP.`,
      actionLabel: language === 'hi' ? 'पुष्टि करें व सुरक्षित ट्रांसफर करें (डेमो)' : 'Authorize Safe Demo Transfer',
      onConfirm: () => {
        setIsTransferSuccess(true);
        if (currentStep?.id === 'confirm_transfer') {
          onCompleteStep({ isTransferConfirmed: true, amount });
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden text-stone-900">
      {/* SafeBank Header */}
      <div className="bg-emerald-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 font-black flex items-center justify-center text-xl shadow">
            🏦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wide">SafeBank Senior NetBanking</span>
              <span className="bg-emerald-400 text-emerald-950 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">SIMULATED DEMO</span>
            </div>
            <p className="text-xs text-emerald-200">RBI Protected Senior Savings Account Demo Sandbox</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Encrypted Session • Masked Credentials</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {isTransferSuccess ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-emerald-900">
              {language === 'hi' ? 'धनराशि सफलतापूर्वक ट्रांसफर हो गई!' : 'Transfer Successful!'}
            </h3>
            <div className="max-w-md mx-auto bg-white rounded-xl p-4 border border-emerald-200 text-left text-sm space-y-2 shadow-sm font-mono">
              <p><strong>Ref / UTR:</strong> SB-81920492819</p>
              <p><strong>Amount:</strong> ₹{amount}.00</p>
              <p><strong>Beneficiary:</strong> Ramesh Sharma (Son - A/c ...4819)</p>
              <p><strong>Status:</strong> Completed safely via Demo Gate</p>
            </div>
          </div>
        ) : (
          <>
            {/* Account Balance Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Senior Savings Account</span>
                <p className="font-extrabold text-stone-900 text-sm">A/c No: •••••••• 8291 (SBI Senior Citizen Scheme)</p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-2xl font-black text-emerald-900">
                    {showBalance ? '₹1,45,280.00' : '₹ ••••••••••'}
                  </span>
                  <button
                    id="bank-btn-show-balance"
                    type="button"
                    onClick={handleToggleBalance}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      activeSelector === '#bank-btn-show-balance'
                        ? 'saarthi-highlight-pulse bg-amber-500 text-white ring-4 ring-amber-300'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
                    }`}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showBalance ? (language === 'hi' ? 'बैलेंस छुपाएं' : 'Hide Balance') : (language === 'hi' ? 'बैलेंस देखें' : 'View Balance')}</span>
                  </button>
                </div>
              </div>

              {!isTransferMode && (
                <button
                  id="bank-btn-send-money"
                  type="button"
                  onClick={handleOpenTransfer}
                  className={`px-6 py-3 rounded-xl font-extrabold text-sm text-white shadow-md transition-all flex items-center gap-2 ${
                    activeSelector === '#bank-btn-send-money'
                      ? 'saarthi-highlight-pulse bg-amber-600 ring-4 ring-amber-300'
                      : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'hi' ? 'पैसे भेजें (Send Money)' : 'Send Money (Transfer)'}</span>
                </button>
              )}
            </div>

            {/* Money Transfer Flow */}
            {isTransferMode && (
              <div className="bg-emerald-50/40 border-2 border-emerald-200 rounded-2xl p-6 space-y-5">
                <div className="border-b border-emerald-200 pb-3 flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-700" />
                    <span>{language === 'hi' ? 'विश्वसनीय लाभार्थी चुनें' : 'Select Verified Beneficiary'}</span>
                  </h4>
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Pre-Registered Only
                  </span>
                </div>

                {/* Beneficiary Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    id="bank-beneficiary-1"
                    onClick={() => handleSelectBeneficiary('Ramesh Sharma (Son)')}
                    className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                      selectedBeneficiary === 'Ramesh Sharma (Son)'
                        ? 'border-emerald-600 bg-white shadow-md'
                        : activeSelector === '#bank-beneficiary-1'
                        ? 'saarthi-highlight-pulse border-amber-500 bg-amber-50'
                        : 'border-stone-200 bg-white/80 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span className="text-stone-900">Ramesh Sharma</span>
                      <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Son</span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono mt-1">A/c: •••••••• 4819 (HDFC Bank)</p>
                  </div>

                  <div
                    onClick={() => handleSelectBeneficiary('Sunita Devi (Daughter)')}
                    className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                      selectedBeneficiary === 'Sunita Devi (Daughter)'
                        ? 'border-emerald-600 bg-white shadow-md'
                        : 'border-stone-200 bg-white/80 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span className="text-stone-900">Sunita Devi</span>
                      <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Daughter</span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono mt-1">A/c: •••••••• 9920 (ICICI Bank)</p>
                  </div>
                </div>

                {/* Amount Input */}
                {selectedBeneficiary && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label htmlFor="bank-input-amount" className="block text-xs font-bold text-stone-700">
                        {language === 'hi' ? 'रकम लिखें (Amount in ₹):' : 'Amount to Transfer (₹):'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-2.5 font-bold text-lg text-stone-500">₹</span>
                        <input
                          id="bank-input-amount"
                          type="number"
                          value={amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          className={`w-full bg-white border-2 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold transition focus:outline-none ${
                            activeSelector === '#bank-input-amount'
                              ? 'saarthi-highlight-pulse border-amber-500'
                              : 'border-stone-300 focus:border-emerald-600'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{language === 'hi' ? 'सुरक्षा नियम: किसी अनजान व्यक्ति के कहने पर कभी पैसे ट्रांसफर न करें।' : 'Security Rule: Never transfer money under pressure or upon instructions from unknown callers.'}</span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        id="bank-btn-confirm-transfer"
                        type="button"
                        onClick={handleConfirmTransfer}
                        className={`px-8 py-3.5 rounded-xl font-extrabold text-base text-white shadow-lg transition-all flex items-center gap-2 ${
                          activeSelector === '#bank-btn-confirm-transfer'
                            ? 'saarthi-highlight-pulse bg-emerald-600 ring-4 ring-emerald-300'
                            : 'bg-emerald-700 hover:bg-emerald-800'
                        }`}
                      >
                        <ShieldCheck className="w-5 h-5" />
                        <span>{language === 'hi' ? `₹${amount} भेजने की पुष्टि करें (डेमो)` : `Confirm & Authorize ₹${amount} Transfer`}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
