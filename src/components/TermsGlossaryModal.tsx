import React from 'react';
import { Language } from '../../shared/types.ts';
import { X, BookOpen, Search } from 'lucide-react';

interface TermsGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TermsGlossaryModal: React.FC<TermsGlossaryModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const glossaryTerms = [
    {
      term: 'WL (Waiting List / वेटिंग लिस्ट)',
      category: 'Train',
      en: 'Your seat is not confirmed yet. If other passengers cancel their tickets before chart preparation, your ticket may move to RAC or Confirmed.',
      hi: 'सीट अभी पक्की नहीं है। यदि अन्य लोग टिकट रद्द करते हैं, तो आपकी सीट पक्की हो सकती है। चार्ट बनने तक प्रतीक्षा करनी होती है।'
    },
    {
      term: 'RAC (Reservation Against Cancellation / आरएसी)',
      category: 'Train',
      en: 'You are guaranteed to board the train! You get a sitting berth (shared with one co-passenger). If a full berth cancels, you get a full sleeping berth.',
      hi: 'आपको ट्रेन में बैठने की सीट पक्की मिलती है! यदि कोई अन्य सीट रद्द होती है, तो आपको पूरी सोने की बर्थ मिल जाती है।'
    },
    {
      term: 'PNR (Passenger Name Record / पीएनआर नंबर)',
      category: 'Train & Flight',
      en: 'A unique 10-digit number for your ticket. You can use it anytime to check current train confirmation status or coach number.',
      hi: 'आपके टिकट का 10 अंकों का विशेष नंबर। इससे आप कभी भी पता कर सकते हैं कि आपकी सीट किस डिब्बे में है।'
    },
    {
      term: 'Non-Stop vs Layover (सीधी उड़ान बनाम रुककर जाने वाली)',
      category: 'Flight',
      en: 'Non-stop flights take you directly to your destination without landing anywhere. Layover means you wait at an intermediate airport to change planes.',
      hi: 'नॉन-स्टॉप उड़ान सीधे आपको गंतव्य तक पहुंचाती है। ले-ओवर में बीच के किसी शहर के हवाई अड्डे पर रुकना पड़ता है।'
    },
    {
      term: 'Cabin Baggage vs Check-in Baggage (हाथ का थैला बनाम मुख्य बैग)',
      category: 'Flight',
      en: 'Cabin baggage (up to 7kg) stays with you inside the aircraft. Check-in baggage (up to 15kg) is deposited at the airline counter and collected at the destination conveyor belt.',
      hi: 'केबिन बैग (7 किलो तक) आप अपने साथ हवाई जहाज में ले जाते हैं। चेक-इन बैग (15 किलो तक) काउंटर पर जमा होता है और उतरने पर मिलता है।'
    },
    {
      term: 'Beneficiary (लाभार्थी / खाताधारक)',
      category: 'Banking',
      en: 'The person or account you want to send money to. Banks verify the account number and IFSC code before transferring money safely.',
      hi: 'वह व्यक्ति जिसे आप पैसे भेजना चाहते हैं। बैंक उनके खाता नंबर और IFSC कोड की जांच करके सुरक्षित पैसे भेजता है।'
    },
    {
      term: 'OTP & PIN (ओटीपी और पिन)',
      category: 'Security',
      en: 'Your secret keys for authorizing payments. NEVER share your OTP or UPI PIN with anyone over the phone, SMS, or WhatsApp. Official banks never ask for them.',
      hi: 'आपकी गुप्त चाबी। कभी भी किसी भी फोन कॉल, SMS या व्हाट्सएप पर अपना OTP या PIN न बताएं। बैंक अधिकारी भी इसे कभी नहीं मांगते।'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border-2 border-amber-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-stone-900">
                {language === 'hi' ? 'तकनीकी शब्दों की सरल डिक्शनरी' : 'Plain Language Terms Glossary'}
              </h3>
              <p className="text-xs text-stone-600">
                {language === 'hi' ? 'कठिन डिजिटल व यात्रा शब्दों का सरल हिंदी और अंग्रेजी में अर्थ' : 'Clear explanations of common digital, travel, and banking terms'}
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

        {/* List of Terms */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {glossaryTerms.map((item, idx) => (
            <div key={idx} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-stone-900">
                  {item.term}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 uppercase">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {language === 'hi' ? item.hi : item.en}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition"
          >
            {language === 'hi' ? 'समझ गया / बंद करें' : 'Got it / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
