import React, { useState } from 'react';
import { Language, ScamAnalysisResult } from '../../shared/types.ts';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Copy, 
  Check, 
  PhoneCall, 
  Globe, 
  Lock,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { PrivacyFirewall } from '../../backend/privacyFirewall.ts';

interface ScamInspectorViewProps {
  language: Language;
  onAnalyzeMessage: (text: string, source: 'sms' | 'whatsapp' | 'email' | 'url') => Promise<ScamAnalysisResult | null>;
}

export const ScamInspectorView: React.FC<ScamInspectorViewProps> = ({
  language,
  onAnalyzeMessage
}) => {
  const [sourceType, setSourceType] = useState<'sms' | 'whatsapp' | 'email' | 'url'>('sms');
  const [messageText, setMessageText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);

  const sampleMessages: Array<{
    title: string;
    text: string;
    source: 'sms' | 'whatsapp' | 'email' | 'url';
    tag: string;
  }> = [
    {
      title: language === 'hi' ? '⚡ बिजली कटने की धमकी वाला SMS' : '⚡ Electricity Disconnection Threat SMS',
      text: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from the main office because your previous month bill was not updated. Please immediately contact our electricity officer Mr. Verma at 98765-43210 to avoid penalty.',
      source: 'sms',
      tag: 'Urgent Threat'
    },
    {
      title: language === 'hi' ? '🎁 KBC ₹25 लाख लॉटरी व्हाट्सएप फ्रॉड' : '🎁 KBC ₹25 Lakh WhatsApp Lottery Scam',
      text: 'CONGRATULATIONS!! Your mobile number has won ₹25,00,000 cash in KBC All India Lucky Draw! To claim your prize money in your bank account, send Aadhaar copy and pay ₹1,500 registration charge immediately at link: http://kbc-lucky-winner-claim.xyz',
      source: 'whatsapp',
      tag: 'Greed / Fake Prize'
    },
    {
      title: language === 'hi' ? '🏦 बैंक खाता ब्लॉक / APK डाउनलोड SMS' : '🏦 Bank Account Blocked / Fake APK SMS',
      text: 'Dear Customer, your State Bank account will be blocked within 24 hours due to pending PAN card KYC. Immediately download and install the official update app from http://sbi-secure-pan-update.apk to reactivate.',
      source: 'sms',
      tag: 'Malicious App (APK)'
    }
  ];

  const handleSelectSample = (sample: typeof sampleMessages[0]) => {
    setMessageText(sample.text);
    setSourceType(sample.source);
    setAnalysisResult(null);
  };

  const handleRunAnalysis = async () => {
    if (!messageText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await onAnalyzeMessage(messageText, sourceType);
      if (result) {
        setAnalysisResult(result);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Preview what the Privacy Firewall redacts before sending to AI
  const firewallPreview = PrivacyFirewall.redactSensitiveData(messageText);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden text-stone-900">
      {/* Header */}
      <div className="bg-rose-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-rose-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-xl shadow">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wide">
                {language === 'hi' ? 'सारथी सुरक्षा व फ्रॉड चेकर' : 'Saarthi Scam & Fraud Shield'}
              </span>
              <span className="bg-rose-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">AI ANALYSIS</span>
            </div>
            <p className="text-xs text-rose-200">
              {language === 'hi' ? 'संदिग्ध SMS, व्हाट्सएप संदेश या लिंक की तुरंत जांच करें' : 'Analyze suspicious SMS, WhatsApp forwards, or urgent messages'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-rose-200 bg-rose-900/60 px-3 py-1.5 rounded-lg border border-rose-800">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Privacy Redaction Active</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Sample Messages Quick Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
            {language === 'hi' ? 'उदाहरण के लिए कोई सामान्य फ्रॉड संदेश चुनें:' : 'Try a common real-world scam scenario:'}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sampleMessages.map((sample, idx) => (
              <button
                key={idx}
                id={`sample-scam-${idx}`}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-300 text-left transition space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-900 group-hover:text-rose-900">
                    {sample.title}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                    {sample.tag}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 line-clamp-2 italic">
                  "{sample.text}"
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
            <span className="text-xs font-bold text-stone-700">
              {language === 'hi' ? 'संदेश का माध्यम (Source Type):' : 'Message Source:'}
            </span>
            <div className="flex items-center gap-2">
              {(['sms', 'whatsapp', 'email', 'url'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSourceType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
                    sourceType === type
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="input-scam-text" className="block text-xs font-bold text-stone-700">
              {language === 'hi' ? 'संदेश यहाँ पेस्ट करें या लिखें:' : 'Paste or type suspicious message text:'}
            </label>
            <textarea
              id="input-scam-text"
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={language === 'hi' ? 'यहाँ SMS या व्हाट्सएप संदेश पेस्ट करें...' : 'Paste WhatsApp, SMS or email text here to check...'}
              className="w-full bg-white border-2 border-stone-300 focus:border-rose-600 rounded-xl p-3 text-sm text-stone-900 focus:outline-none transition shadow-inner font-mono"
            />
          </div>

          {/* Privacy Redaction Live Demonstration */}
          {firewallPreview.hasRedactions && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy Firewall: {firewallPreview.redactedTypes.join(', ')} safely redacted before AI analysis</span>
              </span>
              <p className="font-mono text-[11px] text-emerald-800 bg-white/70 p-2 rounded border border-emerald-200">
                {firewallPreview.cleanText}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              id="btn-run-scam-analysis"
              type="button"
              disabled={isAnalyzing || !messageText.trim()}
              onClick={handleRunAnalysis}
              className="px-8 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:bg-stone-300 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{language === 'hi' ? 'जांच हो रही है...' : 'Analyzing with AI...'}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>{language === 'hi' ? 'संदेश की जांच करें' : 'Analyze Message for Scam'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Scam Report Card */}
        {analysisResult && (
          <div className={`border-2 rounded-2xl p-6 shadow-md space-y-5 transition-all ${
            analysisResult.risk_level === 'high'
              ? 'bg-rose-50/70 border-rose-300'
              : analysisResult.risk_level === 'medium'
              ? 'bg-amber-50/70 border-amber-300'
              : 'bg-emerald-50/70 border-emerald-300'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow ${
                  analysisResult.risk_level === 'high' ? 'bg-rose-600' : analysisResult.risk_level === 'medium' ? 'bg-amber-600' : 'bg-emerald-600'
                }`}>
                  {analysisResult.risk_level === 'high' ? <ShieldAlert className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-black text-stone-900">
                      {analysisResult.risk_level === 'high'
                        ? (language === 'hi' ? 'खतरनाक फ्रॉड संदेश! (HIGH RISK)' : 'High Risk Scam Detected!')
                        : analysisResult.risk_level === 'medium'
                        ? (language === 'hi' ? 'सावधानी बरतें (SUSPICIOUS)' : 'Suspicious Message (Medium Risk)')
                        : (language === 'hi' ? 'सुरक्षित संदेश (SAFE)' : 'Appears Safe (Low Risk)')}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 font-medium">Confidence Score: {analysisResult.confidence_score}%</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                analysisResult.risk_level === 'high' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
              }`}>
                {analysisResult.category}
              </span>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-4 border border-stone-200/90 space-y-1">
              <span className="text-xs font-bold text-stone-500 block uppercase">Companion Summary</span>
              <p className="text-base font-extrabold text-stone-900 leading-snug">
                {typeof analysisResult.summary === 'string'
                  ? analysisResult.summary
                  : (analysisResult.summary[language] || analysisResult.summary.en)}
              </p>
            </div>

            {/* Red Flags / Indicators */}
            {analysisResult.indicators && analysisResult.indicators.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                  {language === 'hi' ? 'संदिग्ध संकेत (Red Flags):' : 'Identified Scam Indicators:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysisResult.indicators.map((ind, i) => (
                    <div key={i} className="bg-white/90 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-xs font-semibold text-stone-800">
                      <span className="text-rose-600 font-bold">⚠️</span>
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What Senior Should Do */}
            <div className="bg-white rounded-xl p-4 border-2 border-emerald-300 space-y-2">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wider block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'सारथी की सलाह: आपको क्या करना चाहिए?' : 'Saarthi Recommendation: What should you do?'}</span>
              </span>
              <p className="text-sm font-bold text-stone-900 leading-relaxed">
                {typeof analysisResult.recommended_action === 'string'
                  ? analysisResult.recommended_action
                  : (analysisResult.recommended_action[language] || analysisResult.recommended_action.en)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
