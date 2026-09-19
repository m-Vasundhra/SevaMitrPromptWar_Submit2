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
    <aside aria-label="Digital Companion Assistant" className="bg-white/95 backdrop-blur-md border-2 border-amber-300 rounded-3xl p-5 shadow-2xl space-y-4 transition-all">
      {/* Top Bar: Avatar, Title & Privacy Shield */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-3">
          <CompanionAvatar state={voiceState} isHighRisk={isHighRisk} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-stone-900 leading-none">
                {t.appName}
              </h3>
              {isHighRisk && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'सावधानी' : 'High Risk'}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {voiceState === 'listening' ? t.listening : voiceState === 'speaking' ? t.speaking : voiceState === 'processing' ? t.processing : (language === 'hi' ? 'सदा आपके साथ' : 'Patient Senior Companion')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Privacy Firewall Badge Button */}
          <button
            id="btn-privacy-shield"
            onClick={onOpenPrivacyShield}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition shadow-sm"
            title="View Privacy Firewall details"
          >
            <span>🔒</span>
            <span className="hidden sm:inline">{language === 'hi' ? 'सुरक्षा शील्ड' : 'Privacy Shield'}</span>
          </button>

          {/* Voice Mute Toggle */}
          <button
            id="btn-toggle-tts"
            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
            className={`p-2 rounded-xl border transition ${
              isVoiceMuted 
                ? 'bg-stone-100 text-stone-500 border-stone-300' 
                : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
            }`}
            title={isVoiceMuted ? 'Unmute companion voice' : 'Mute companion voice'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Step Progress Tracker */}
      {currentStep && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
              {stepIndex + 1}
            </span>
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                {t.currentStepLabel} ({stepIndex + 1} / {totalSteps})
              </span>
              <span className="text-sm font-extrabold text-stone-800">
                {currentStep.title[language]}
              </span>
            </div>
          </div>

          {currentStep.explanationTerms && currentStep.explanationTerms.length > 0 && (
            <button
              id="btn-open-terms-guide"
              onClick={onOpenGlossary}
              className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-white px-2.5 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-100 transition shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'hi' ? 'शब्द समझें' : 'Explain Terms'}</span>
            </button>
          )}
        </div>
      )}

      {/* Main Single-Step Large Instruction Card */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {stepJustCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : isVerifying ? (
              <Sparkles className="w-6 h-6 text-amber-600 animate-spin shrink-0" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping mt-1" />
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
              {displayInstruction}
            </p>

            {isVerifying && (
              <p className="text-xs text-amber-800 font-semibold mt-1">
                {t.verifyingInput}
              </p>
            )}

            {stepJustCompleted && (
              <p className="text-xs text-emerald-700 font-bold mt-1">
                {t.stepCompletedGreat}
              </p>
            )}
          </div>
        </div>

        {/* Target Element Guidance Chip */}
        {currentStep && (
          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold text-stone-600">
            <span className="flex items-center gap-1 text-amber-900">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-600" />
              <span>{t.targetElementHighlight}: <strong className="text-stone-900">{currentStep.targetElementName[language]}</strong></span>
            </span>
          </div>
        )}
      </div>

      {/* Speech Error Banner if Mic unavailable */}
      {speechError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Voice & Text Ask Bar */}
      <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
        <button
          type="button"
          id="btn-voice-mic"
          onClick={handleToggleVoiceInput}
          className={`px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-all ${
            voiceState === 'listening'
              ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
          title={language === 'hi' ? 'सेवामित्र से बोलकर पूछें' : 'Speak to SevaMitr'}
        >
          {voiceState === 'listening' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span className="hidden sm:inline">
            {voiceState === 'listening' ? t.listening : (language === 'hi' ? 'बोलकर पूछें' : 'Speak')}
          </span>
        </button>

        <div className="relative flex-1">
          <input
            id="companion-chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={language === 'hi' ? 'यहाँ लिखकर पूछें (उदा: अगला कदम क्या है?)...' : 'Type your question (e.g., How to proceed?)...'}
            className="w-full bg-stone-50 border-2 border-stone-300 focus:border-amber-500 rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none transition shadow-inner font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2 top-2 p-1.5 rounded-xl bg-amber-600 disabled:bg-stone-300 text-white transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Recovery Section: "I made a mistake" Menu */}
      <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="relative">
          <button
            id="btn-mistake-recovery"
            onClick={() => setShowMistakeMenu(!showMistakeMenu)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.iMadeMistake}</span>
          </button>

          {/* Popover Recovery Options */}
          {showMistakeMenu && (
            <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border-2 border-amber-300 rounded-2xl p-2.5 shadow-2xl z-30 space-y-1">
              <p className="text-[11px] font-bold text-amber-900 px-2 py-1">
                {t.mistakeHelp}
              </p>
              <button
                id="btn-recovery-back"
                onClick={() => {
                  onRecovery('go_back');
                  setShowMistakeMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-amber-100 hover:text-amber-900 flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.goBack}</span>
              </button>
              <button
                id="btn-recovery-retry"
                onClick={() => {
                  onRecovery('retry_step');
                  setShowMistakeMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-amber-100 hover:text-amber-900 flex items-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.retryStep}</span>
              </button>
              <button
                id="btn-recovery-restart"
                onClick={() => {
                  onRecovery('start_over');
                  setShowMistakeMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition"
              >
                <span>🔄</span>
                <span>{t.startOver}</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Question Chips for Senior */}
        <div className="flex items-center gap-2">
          <button
            id="chip-is-safe"
            onClick={() => onAskCustomQuery(language === 'hi' ? 'क्या यह कदम सुरक्षित है?' : 'Is this step safe?')}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold transition"
          >
            {t.isThisSafe}
          </button>
          <button
            id="chip-explain-this"
            onClick={() => onAskCustomQuery(language === 'hi' ? 'इसे आसान शब्दों में समझाएँ' : 'Explain this simply')}
            className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-semibold transition"
          >
            {t.explainThis}
          </button>
        </div>
      </div>
    </aside>
  );
};
