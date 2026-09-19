import React, { useState, useEffect } from 'react';
import { 
  Language, 
  TaskStep, 
  AssistantVoiceState, 
  RiskLevel 
} from '../../shared/types.ts';
import { getTranslation } from '../../shared/locales/index.ts';
import { CompanionAvatar } from './CompanionAvatar.tsx';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  RotateCcw, 
  HelpCircle, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  BookOpen,
  Send,
  AlertTriangle
} from 'lucide-react';

interface CompanionBarProps {
  language: Language;
  currentStep: TaskStep | null;
  stepIndex: number;
  totalSteps: number;
  voiceState: AssistantVoiceState;
  onVoiceStateChange: (state: AssistantVoiceState) => void;
  onRecovery: (type: 'go_back' | 'retry_step' | 'start_over') => void;
  onAskCustomQuery: (query: string) => void;
  onOpenGlossary: () => void;
  onOpenPrivacyShield: () => void;
  customAssistantMessage?: string;
  isVerifying?: boolean;
  stepJustCompleted?: boolean;
}

export const CompanionBar: React.FC<CompanionBarProps> = ({
  language,
  currentStep,
  stepIndex,
  totalSteps,
  voiceState,
  onVoiceStateChange,
  onRecovery,
  onAskCustomQuery,
  onOpenGlossary,
  onOpenPrivacyShield,
  customAssistantMessage,
  isVerifying = false,
  stepJustCompleted = false
}) => {
  const t = getTranslation(language);
  const [inputText, setInputText] = useState('');
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [showMistakeMenu, setShowMistakeMenu] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const displayInstruction = customAssistantMessage || (currentStep ? currentStep.instruction[language] : t.waitingForUser);
  const spokenPrompt = currentStep ? currentStep.spokenPrompt[language] : displayInstruction;

  // Speak prompt whenever step changes or custom message updates if not muted
  useEffect(() => {
    if (isVoiceMuted || !spokenPrompt) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenPrompt);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9; // Slightly slower for seniors
      utterance.pitch = 1.0;

      utterance.onstart = () => onVoiceStateChange('speaking');
      utterance.onend = () => onVoiceStateChange('idle');
      utterance.onerror = () => {
        onVoiceStateChange('idle');
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
      }
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [spokenPrompt, language, isVoiceMuted]);

  // Handle Voice Input (Speech Recognition)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(t.voiceUnavailable);
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (voiceState === 'listening') {
      onVoiceStateChange('idle');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setSpeechError(null);
        onVoiceStateChange('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          onVoiceStateChange('processing');
          onAskCustomQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        onVoiceStateChange('idle');
        setSpeechError(t.voiceUnavailable);
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        onVoiceStateChange('idle');
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      onVoiceStateChange('idle');
      setSpeechError(t.voiceUnavailable);
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAskCustomQuery(inputText.trim());
    setInputText('');
  };

  const isHighRisk = currentStep?.riskLevel === 'high';

  return (
    <aside 
      aria-label={language === 'hi' ? 'सेवामित्र डिजिटल सहायक' : 'SevaMitr Digital Companion Assistant'} 
      className="bg-white/95 backdrop-blur-md border-2 border-amber-400/90 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 transition-all"
    >
      {/* Top Bar: Avatar, Title & Privacy Shield */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-3">
          <CompanionAvatar state={voiceState} isHighRisk={isHighRisk} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg sm:text-xl text-stone-900 leading-none">
                {t.appName}
              </h2>
              {isHighRisk && (
                <span 
                  role="status"
                  aria-label="High financial risk step"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700" aria-hidden="true" />
                  <span>{language === 'hi' ? 'उच्च जोखिम (High Risk)' : 'High Risk'}</span>
                </span>
              )}
            </div>
            
            {/* Non-color-only Voice Status Indicator */}
            <div 
              role="status" 
              aria-live="polite" 
              className="text-xs text-stone-700 font-semibold flex items-center gap-1.5 mt-0.5"
            >
              <span className={`w-2 h-2 rounded-full ${voiceState === 'listening' ? 'bg-rose-600' : voiceState === 'speaking' ? 'bg-amber-600' : voiceState === 'processing' ? 'bg-blue-600' : 'bg-emerald-600'}`} aria-hidden="true" />
              <span>
                {voiceState === 'listening' 
                  ? `${t.listening} (Listening...)` 
                  : voiceState === 'speaking' 
                  ? `${t.speaking} (Speaking...)` 
                  : voiceState === 'processing' 
                  ? `${t.processing} (Processing...)` 
                  : (language === 'hi' ? 'सदा आपके साथ (Ready)' : 'Patient Senior Companion (Ready)')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Privacy Firewall Badge Button */}
          <button
            id="btn-privacy-shield"
            type="button"
            onClick={onOpenPrivacyShield}
            aria-label={language === 'hi' ? 'गोपनीयता सुरक्षा शील्ड विवरण खोलें' : 'Open Privacy Shield security details'}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            title="View Privacy Firewall details"
          >
            <span aria-hidden="true">🔒</span>
            <span>{language === 'hi' ? 'सुरक्षा शील्ड' : 'Privacy Shield'}</span>
          </button>

          {/* Voice Mute Toggle */}
          <button
            id="btn-toggle-tts"
            type="button"
            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
            aria-label={isVoiceMuted ? (language === 'hi' ? 'आवाज़ चालू करें' : 'Unmute companion voice') : (language === 'hi' ? 'आवाज़ बंद करें' : 'Mute companion voice')}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border-2 transition flex items-center justify-center ${
              isVoiceMuted 
                ? 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200' 
                : 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
            }`}
            title={isVoiceMuted ? 'Unmute companion voice' : 'Mute companion voice'}
          >
            {isVoiceMuted ? <VolumeX className="w-5 h-5" aria-hidden="true" /> : <Volume2 className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Step Progress Tracker */}
      {currentStep && (
        <div 
          role="region" 
          aria-label={language === 'hi' ? 'वर्तमान कदम प्रगति' : 'Current Step Progress'}
          className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2.5">
            <span 
              className="w-8 h-8 rounded-xl bg-amber-700 text-white font-black text-sm flex items-center justify-center shadow-sm"
              aria-hidden="true"
            >
              {stepIndex + 1}
            </span>
            <div>
              <span className="text-xs font-bold text-amber-950 block">
                {t.currentStepLabel} ({stepIndex + 1} / {totalSteps})
              </span>
              <span 
                lang={language === 'hi' ? 'hi' : 'en'} 
                className="text-sm sm:text-base font-extrabold text-stone-900"
              >
                {currentStep.title[language]}
              </span>
            </div>
          </div>

          {currentStep.explanationTerms && currentStep.explanationTerms.length > 0 && (
            <button
              id="btn-open-terms-guide"
              type="button"
              onClick={onOpenGlossary}
              aria-label={language === 'hi' ? 'कठिन शब्दों की सरल व्याख्या देखें' : 'Explain technical and booking terms simply'}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold text-amber-950 bg-white border-2 border-amber-300 hover:bg-amber-100 transition shadow-sm flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-amber-800" aria-hidden="true" />
              <span>{language === 'hi' ? 'शब्द समझें' : 'Explain Terms'}</span>
            </button>
          )}
        </div>
      )}

      {/* Main Single-Step Large Instruction Card with ARIA Live */}
      <div 
        role="status"
        aria-live="polite"
        aria-atomic="true"
        lang={language === 'hi' ? 'hi' : 'en'}
        className="bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1" aria-hidden="true">
            {stepJustCompleted ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0" />
            ) : isVerifying ? (
              <Sparkles className="w-7 h-7 text-amber-700 animate-spin shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-amber-600 block mt-1" />
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-base sm:text-lg font-extrabold text-stone-900 leading-snug">
              {displayInstruction}
            </p>

            {isVerifying && (
              <p className="text-xs text-amber-900 font-bold mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 inline" aria-hidden="true" />
                <span>{t.verifyingInput}</span>
              </p>
            )}

            {stepJustCompleted && (
              <p className="text-xs text-emerald-800 font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 inline" aria-hidden="true" />
                <span>{t.stepCompletedGreat}</span>
              </p>
            )}
          </div>
        </div>

        {/* Target Element Guidance Chip */}
        {currentStep && (
          <div className="pt-2.5 border-t border-amber-200 flex items-center justify-between text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1.5 text-amber-950">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-700" aria-hidden="true" />
              <span>
                {t.targetElementHighlight}: <strong className="text-stone-950 underline decoration-amber-500 decoration-2">{currentStep.targetElementName[language]}</strong>
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Speech Error Banner if Mic unavailable */}
      {speechError && (
        <div 
          role="alert" 
          aria-live="assertive"
          className="bg-rose-50 border-2 border-rose-300 text-rose-950 text-xs p-3 rounded-xl flex items-center gap-2 font-semibold"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Voice & Text Ask Bar */}
      <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
        <button
          type="button"
          id="btn-voice-mic"
          onClick={handleToggleVoiceInput}
          aria-label={voiceState === 'listening' ? (language === 'hi' ? 'सुनना बंद करें' : 'Stop voice recording') : (language === 'hi' ? 'सेवामित्र से बोलकर पूछें' : 'Speak to SevaMitr assistant')}
          className={`min-h-[48px] px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-all ${
            voiceState === 'listening'
              ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300'
              : 'bg-amber-700 hover:bg-amber-800 text-white'
          }`}
          title={language === 'hi' ? 'सेवामित्र से बोलकर पूछें' : 'Speak to SevaMitr'}
        >
          {voiceState === 'listening' ? <MicOff className="w-5 h-5" aria-hidden="true" /> : <Mic className="w-5 h-5" aria-hidden="true" />}
          <span className="hidden sm:inline">
            {voiceState === 'listening' ? t.listening : (language === 'hi' ? 'बोलकर पूछें' : 'Speak')}
          </span>
        </button>

        <div className="relative flex-1">
          <label htmlFor="companion-chat-input" className="sr-only">
            {language === 'hi' ? 'सेवामित्र से प्रश्न पूछें' : 'Ask SevaMitr assistant a question'}
          </label>
          <input
            id="companion-chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={language === 'hi' ? 'यहाँ लिखकर पूछें (उदा: अगला कदम क्या है?)...' : 'Type your question (e.g., How to proceed?)...'}
            className="w-full min-h-[48px] bg-stone-50 border-2 border-stone-300 focus:border-amber-600 rounded-2xl px-4 py-3 text-sm text-stone-950 placeholder:text-stone-500 focus:bg-white focus:outline-none transition shadow-inner font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            aria-label={language === 'hi' ? 'संदेश भेजें' : 'Send question to assistant'}
            className="absolute right-1.5 top-1.5 min-h-[40px] min-w-[40px] p-2 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white transition shadow-sm flex items-center justify-center"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>

      {/* Recovery Section: "I made a mistake" Menu */}
      <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="relative">
          <button
            id="btn-mistake-recovery"
            type="button"
            onClick={() => setShowMistakeMenu(!showMistakeMenu)}
            aria-expanded={showMistakeMenu}
            aria-haspopup="true"
            aria-label={language === 'hi' ? 'गलती सुधारें मेनू खोलें' : 'Open mistake recovery options menu'}
            className="min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 text-stone-900 text-xs font-bold transition shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-amber-800" aria-hidden="true" />
            <span>{t.iMadeMistake}</span>
          </button>

          {/* Popover Recovery Options */}
          {showMistakeMenu && (
            <div 
              role="menu"
              aria-label={t.mistakeHelp}
              className="absolute left-0 bottom-full mb-2 w-68 bg-white border-2 border-amber-300 rounded-2xl p-2 shadow-2xl z-30 space-y-1.5"
            >
              <p className="text-xs font-bold text-amber-950 px-2 py-1">
                {t.mistakeHelp}
              </p>
              <button
                id="btn-recovery-back"
                role="menuitem"
                type="button"
                onClick={() => {
                  onRecovery('go_back');
                  setShowMistakeMenu(false);
                }}
                className="w-full min-h-[44px] text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-amber-100 hover:text-amber-950 flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4 text-amber-800" aria-hidden="true" />
                <span>{t.goBack}</span>
              </button>
              <button
                id="btn-recovery-retry"
                role="menuitem"
                type="button"
                onClick={() => {
                  onRecovery('retry_step');
                  setShowMistakeMenu(false);
                }}
                className="w-full min-h-[44px] text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-amber-100 hover:text-amber-950 flex items-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4 text-amber-800" aria-hidden="true" />
                <span>{t.retryStep}</span>
              </button>
              <button
                id="btn-recovery-restart"
                role="menuitem"
                type="button"
                onClick={() => {
                  onRecovery('start_over');
                  setShowMistakeMenu(false);
                }}
                className="w-full min-h-[44px] text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-800 hover:bg-rose-50 hover:text-rose-950 flex items-center gap-2 transition"
              >
                <span aria-hidden="true">🔄</span>
                <span>{t.startOver}</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Question Chips for Senior */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="chip-is-safe"
            type="button"
            onClick={() => onAskCustomQuery(language === 'hi' ? 'क्या यह कदम सुरक्षित है?' : 'Is this step safe?')}
            aria-label={language === 'hi' ? 'पूछें: क्या यह कदम सुरक्षित है?' : 'Ask: Is this step safe?'}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 text-xs font-bold transition shadow-sm"
          >
            {t.isThisSafe}
          </button>
          <button
            id="chip-explain-this"
            type="button"
            onClick={() => onAskCustomQuery(language === 'hi' ? 'इसे आसान शब्दों में समझाएँ' : 'Explain this simply')}
            aria-label={language === 'hi' ? 'पूछें: इसे आसान शब्दों में समझाएँ' : 'Ask: Explain this step simply'}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 text-stone-900 text-xs font-bold transition shadow-sm"
          >
            {t.explainThis}
          </button>
        </div>
      </div>
    </aside>
  );
};
