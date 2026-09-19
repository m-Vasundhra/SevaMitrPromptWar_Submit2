import React from 'react';
import { Language, WorkflowType } from '../../shared/types.ts';
import { getTranslation } from '../../shared/locales/index.ts';
import { 
  Train, 
  Plane, 
  Building2, 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  ShieldCheck, 
  ArrowRight,
  HeartHandshake,
  Languages
} from 'lucide-react';

interface FirstPageProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onStartWorkflow: (workflow: WorkflowType) => void;
  fontSize: 'normal' | 'large' | 'extra-large';
  onChangeFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  onOpenArchitecture: () => void;
}

export const FirstPage: React.FC<FirstPageProps> = ({
  language,
  onSelectLanguage,
  onStartWorkflow,
  fontSize,
  onChangeFontSize,
  onOpenArchitecture
}) => {
  const t = getTranslation(language);

  const workflowsList: Array<{
    id: WorkflowType;
    icon: React.ReactNode;
    title: string;
    description: string;
    tag: string;
    color: string;
  }> = [
    {
      id: 'train_booking',
      icon: <Train className="w-8 h-8 text-amber-700" />,
      title: t.trainBooking,
      description: t.trainBookingDesc,
      tag: language === 'hi' ? 'IRCTC सीखें' : 'IRCTC Railway',
      color: 'bg-amber-100/80 border-amber-300 hover:border-amber-500'
    },
    {
      id: 'flight_booking',
      icon: <Plane className="w-8 h-8 text-blue-700" />,
      title: t.flightBooking,
      description: t.flightBookingDesc,
      tag: language === 'hi' ? 'उड़ानें व बैगेज' : 'Flights & Baggage',
      color: 'bg-blue-50/80 border-blue-200 hover:border-blue-400'
    },
    {
      id: 'net_banking',
      icon: <Building2 className="w-8 h-8 text-emerald-700" />,
      title: t.netBanking,
      description: t.netBankingDesc,
      tag: language === 'hi' ? 'सुरक्षित लेन-देन' : 'Safe Banking Gate',
      color: 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-400'
    },
    {
      id: 'scam_check',
      icon: <ShieldAlert className="w-8 h-8 text-rose-700" />,
      title: t.scamCheck,
      description: t.scamCheckDesc,
      tag: language === 'hi' ? 'संदिग्ध SMS / फ्रॉड जांच' : 'SMS / WhatsApp Scam Shield',
      color: 'bg-rose-50/80 border-rose-200 hover:border-rose-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-stone-50 to-amber-50/40 text-stone-900 pb-20">
      {/* Top Controls Header */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-amber-200/60">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md font-bold text-2xl tracking-tight">
            से
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
              {t.appName}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-semibold uppercase tracking-wider">
                Senior Companion
              </span>
            </h1>
            <p className="text-xs text-stone-600 font-medium">Empowering Independence in the Digital Age</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Text Size Control */}
          <div className="flex items-center bg-white/90 border border-stone-200 rounded-xl p-1 shadow-sm text-xs font-semibold text-stone-700">
            <button
              id="font-size-normal"
              onClick={() => onChangeFontSize('normal')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${fontSize === 'normal' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-100'}`}
              title="Standard text size"
            >
              A
            </button>
            <button
              id="font-size-large"
              onClick={() => onChangeFontSize('large')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors text-sm ${fontSize === 'large' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-100'}`}
              title="Large readable text size"
            >
              A+
            </button>
            <button
              id="font-size-xlarge"
              onClick={() => onChangeFontSize('extra-large')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors text-base ${fontSize === 'extra-large' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-100'}`}
              title="Extra large text size for seniors"
            >
              A++
            </button>
          </div>

          {/* Architecture Inspector Modal Trigger */}
          <button
            id="btn-open-arch"
            onClick={onOpenArchitecture}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-xs font-semibold text-stone-700 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Architecture &amp; Security</span>
          </button>
        </div>
      </header>

      {/* Hero Welcome Card */}
      <main className="max-w-5xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xl relative overflow-hidden">
          {/* Subtle warm decorative aura */}
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-sm font-semibold border border-amber-300/60">
                <HeartHandshake className="w-4 h-4 text-amber-700" />
                <span>{t.philosophy}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
                {t.tagline}
              </h2>

              <p className="text-stone-700 text-base sm:text-lg max-w-2xl leading-relaxed">
                {language === 'hi' 
                  ? 'सेवामित्र आपको ट्रेन टिकट बुक करने, उड़ानों को समझने, सुरक्षित बैंकिंग करने और फर्जी संदेशों से बचने में एक-एक कदम करके धैर्यपूर्वक मदद करता है।'
                  : 'SevaMitr guides you one step at a time through train reservations, flight bookings, safe banking, and detecting suspicious scam messages with complete peace of mind.'}
              </p>

              {/* Language Selection Bar (Mandatory First-Screen Requirement) */}
              <div className="pt-2">
                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center justify-center md:justify-start gap-1.5">
                  <Languages className="w-4 h-4 text-amber-700" />
                  <span>{t.languageSelection}</span>
                </label>
                <div className="inline-flex p-1.5 bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-inner gap-2">
                  <button
                    id="btn-lang-en"
                    onClick={() => onSelectLanguage('en')}
                    className={`px-6 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 ${
                      language === 'en'
                        ? 'bg-amber-600 text-white shadow-md scale-102'
                        : 'text-stone-700 hover:bg-amber-200/50'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button
                    id="btn-lang-hi"
                    onClick={() => onSelectLanguage('hi')}
                    className={`px-6 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 ${
                      language === 'hi'
                        ? 'bg-amber-600 text-white shadow-md scale-102'
                        : 'text-stone-700 hover:bg-amber-200/50'
                    }`}
                  >
                    <span>🇮🇳</span>
                    <span>हिन्दी</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Safety Highlights Card */}
            <div className="w-full md:w-80 bg-stone-50 border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm border-b border-stone-200 pb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{language === 'hi' ? 'सुरक्षा व गोपनीयता वादे' : 'Safety & Privacy Shield'}</span>
              </div>
              
              <ul className="text-xs sm:text-sm text-stone-700 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{language === 'hi' ? 'कभी पासवर्ड या OTP नहीं मांगते' : 'Never requests OTP, PIN, or Passwords'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{language === 'hi' ? 'एक बार में केवल एक ही कदम समझाते हैं' : 'One step at a time — no confusing lists'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{language === 'hi' ? 'गलती होने पर आसानी से वापस लौट सकते हैं' : 'Gentle mistake recovery & patient guidance'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{language === 'hi' ? 'आवाज़ और टेक्स्ट दोनों में उपलब्ध' : 'Speaks & listens in English and Hindi'}</span>
                </li>
              </ul>

              <div className="bg-amber-100/80 rounded-xl p-2.5 text-[11px] text-amber-900 font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t.privacyShieldActive}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Environments Grid */}
        <section className="mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-2xl font-bold text-stone-900">{t.tryDemoTitle}</h3>
              <p className="text-sm text-stone-600">
                {language === 'hi' ? 'अभ्यास के लिए कोई भी सेवा चुनें:' : 'Select any simulated portal to experience step-by-step guidance:'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {workflowsList.map((item) => (
              <div
                key={item.id}
                id={`card-workflow-${item.id}`}
                onClick={() => onStartWorkflow(item.id)}
                className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-white ${item.color} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-stone-200/60">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-stone-700 border border-stone-200">
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/50 flex items-center justify-between text-sm font-bold text-amber-800">
                  <span>{t.guideMe}</span>
                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Demo Disclaimer */}
      <footer className="max-w-5xl mx-auto px-4 mt-16 text-center text-xs text-stone-500">
        <p>{t.demoDisclaimer}</p>
      </footer>
    </div>
  );
};
