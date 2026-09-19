import React, { useState } from 'react';
import { Language, TaskStep } from '../../shared/types.ts';
import { 
  Train, 
  Calendar, 
  Search, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface TrainBookingViewProps {
  language: Language;
  currentStep: TaskStep | null;
  onFieldChange: (field: string, value: any) => void;
  onCompleteStep: (fields: Record<string, any>) => void;
  formData: Record<string, any>;
  onTriggerHighRiskGate: (details: { title: string; warning: string; actionLabel: string; onConfirm: () => void }) => void;
}

export const TrainBookingView: React.FC<TrainBookingViewProps> = ({
  language,
  currentStep,
  onFieldChange,
  onCompleteStep,
  formData,
  onTriggerHighRiskGate
}) => {
  const [origin, setOrigin] = useState(formData.origin || '');
  const [destination, setDestination] = useState(formData.destination || '');
  const [date, setDate] = useState(formData.travel_date || '2026-09-25');
  const [hasSearched, setHasSearched] = useState(Boolean(formData.hasSearched));
  const [selectedTrain, setSelectedTrain] = useState(formData.selectedTrain || '');
  const [selectedClass, setSelectedClass] = useState(formData.selectedClass || '');
  const [passengerName, setPassengerName] = useState(formData.passenger_name || '');
  const [passengerAge, setPassengerAge] = useState(formData.passenger_age || '68');
  const [isLowerBerthPreferred, setIsLowerBerthPreferred] = useState(true);
  const [isReviewed, setIsReviewed] = useState(Boolean(formData.isReviewed));
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  const activeSelector = currentStep?.targetElementSelector;

  const handleOriginSubmit = (val: string) => {
    setOrigin(val);
    onFieldChange('origin', val);
    if (currentStep?.id === 'origin' && val.trim().length >= 3) {
      onCompleteStep({ origin: val });
    }
  };

  const handleDestinationSubmit = (val: string) => {
    setDestination(val);
    onFieldChange('destination', val);
    if (currentStep?.id === 'destination' && val.trim().length >= 3) {
      onCompleteStep({ destination: val });
    }
  };

  const handleDateSelect = (val: string) => {
    setDate(val);
    onFieldChange('travel_date', val);
    if (currentStep?.id === 'travel_date') {
      onCompleteStep({ travel_date: val });
    }
  };

  const handleSearchTrains = () => {
    setHasSearched(true);
    onFieldChange('hasSearched', true);
    if (currentStep?.id === 'search') {
      onCompleteStep({ hasSearched: true });
    }
  };

  const handleSelectTrain = (trainId: string) => {
    setSelectedTrain(trainId);
    onFieldChange('selectedTrain', trainId);
    if (currentStep?.id === 'select_train') {
      onCompleteStep({ selectedTrain: trainId });
    }
  };

  const handleSelectClass = (cls: string) => {
    setSelectedClass(cls);
    onFieldChange('selectedClass', cls);
    if (currentStep?.id === 'select_class') {
      onCompleteStep({ selectedClass: cls });
    }
  };

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim()) return;
    onFieldChange('passenger_name', passengerName);
    onFieldChange('passenger_age', passengerAge);
    if (currentStep?.id === 'passenger_details') {
      onCompleteStep({ passenger_name: passengerName, passenger_age: passengerAge });
    }
  };

  const handleProceedReview = () => {
    setIsReviewed(true);
    onFieldChange('isReviewed', true);
    if (currentStep?.id === 'review') {
      onCompleteStep({ isReviewed: true });
    }
  };

  const handleFinalPayment = () => {
    onTriggerHighRiskGate({
      title: language === 'hi' ? 'ट्रेन टिकट पेमेंट पुष्टि' : 'Train Ticket Payment Verification',
      warning: language === 'hi'
        ? 'आप नई दिल्ली से जयपुर (अजमेर शताब्दी CC) के लिए ₹890 का सुरक्षित टिकट बुक कर रहे हैं। सेवामित्र आपसे कभी OTP या PIN नहीं मांगता। स्वयं विवरण की पुष्टि करें।'
        : 'You are booking ticket for New Delhi → Jaipur (Ajmer Shatabdi CC) for ₹890. SevaMitr AI will never ask for your OTP, PIN, or Password. Please verify details yourself.',
      actionLabel: language === 'hi' ? 'सुरक्षित टिकट बुक करें (डेमो)' : 'Confirm & Book Ticket (Demo)',
      onConfirm: () => {
        setIsBookingConfirmed(true);
        if (currentStep?.id === 'payment') {
          onCompleteStep({ isPaid: true });
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden text-stone-900">
      {/* IRCTC Demo Portal Header */}
      <div className="bg-blue-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-blue-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-blue-950 font-black flex items-center justify-center text-xl shadow">
            🚆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wide">IRCTC eTicketing System</span>
              <span className="bg-amber-400 text-blue-950 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">DEMO PORTAL</span>
            </div>
            <p className="text-xs text-blue-200">Indian Railways Catering and Tourism Corporation</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official 256-Bit SSL Demo Sandbox</span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Booking Successful Screen */}
        {isBookingConfirmed ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-emerald-900">
              {language === 'hi' ? 'टिकट सफलतापूर्वक बुक हो गया!' : 'Ticket Successfully Booked!'}
            </h3>
            <div className="max-w-md mx-auto bg-white rounded-xl p-4 border border-emerald-200 text-left text-sm space-y-2 shadow-sm font-mono">
              <p><strong>PNR:</strong> 284-9182741 (CONFIRMED)</p>
              <p><strong>Train:</strong> 12015 Ajmer Shatabdi Express</p>
              <p><strong>Route:</strong> New Delhi (NDLS) → Jaipur (JP)</p>
              <p><strong>Passenger:</strong> {passengerName || 'Senior Citizen'}, Age: {passengerAge} (Lower Berth C2-14)</p>
              <p><strong>Fare:</strong> ₹890.00 (Paid via Demo Gateway)</p>
            </div>
            <p className="text-xs text-stone-600">
              {language === 'hi' ? 'बधाई हो! आपने स्वतंत्र रूप से टिकट बुकिंग प्रक्रिया को पूरा कर लिया है।' : 'Congratulations! You have independently completed the ticket booking practice.'}
            </p>
          </div>
        ) : (
          <>
            {/* Step 1-4: Search Form */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h4 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-600" />
                  <span>{language === 'hi' ? 'ट्रेन खोजें' : 'Search Trains'}</span>
                </h4>
                <span className="text-xs text-stone-500 font-medium">Standard Railway Reservation</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Form / Origin Input */}
                <div className="space-y-1.5">
                  <label htmlFor="input-origin" className="block text-xs font-bold text-stone-700">
                    {language === 'hi' ? 'रवानगी स्टेशन (Form):' : 'Form (Departure):'}
                  </label>
                  <div className="relative">
                    <input
                      id="input-origin"
                      type="text"
                      value={origin}
                      onChange={(e) => handleOriginSubmit(e.target.value)}
                      placeholder="e.g. New Delhi"
                      className={`w-full bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none ${
                        activeSelector === '#input-origin'
                          ? 'saarthi-highlight-pulse border-amber-500'
                          : 'border-stone-300 focus:border-blue-600'
                      }`}
                    />
                  </div>
                  {/* Quick Select Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOriginSubmit('New Delhi')}
                      className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 hover:bg-amber-100 text-stone-800 transition"
                    >
                      + New Delhi (NDLS)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOriginSubmit('Mumbai Central')}
                      className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 hover:bg-amber-100 text-stone-800 transition"
                    >
                      + Mumbai
                    </button>
                  </div>
                </div>

                {/* To / Destination Input */}
                <div className="space-y-1.5">
                  <label htmlFor="input-destination" className="block text-xs font-bold text-stone-700">
                    {language === 'hi' ? 'गंतव्य स्टेशन (To):' : 'To (Destination):'}
                  </label>
                  <input
                    id="input-destination"
                    type="text"
                    value={destination}
                    onChange={(e) => handleDestinationSubmit(e.target.value)}
                    placeholder="e.g. Jaipur"
                    className={`w-full bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none ${
                      activeSelector === '#input-destination'
                        ? 'saarthi-highlight-pulse border-amber-500'
                        : 'border-stone-300 focus:border-blue-600'
                    }`}
                  />
                  {/* Quick Select Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleDestinationSubmit('Jaipur')}
                      className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 hover:bg-amber-100 text-stone-800 transition"
                    >
                      + Jaipur (JP)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDestinationSubmit('Varanasi')}
                      className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 hover:bg-amber-100 text-stone-800 transition"
                    >
                      + Varanasi
                    </button>
                  </div>
                </div>

                {/* Travel Date */}
                <div className="space-y-1.5">
                  <label htmlFor="input-date" className="block text-xs font-bold text-stone-700">
                    {language === 'hi' ? 'यात्रा की तारीख (Date):' : 'Date of Travel:'}
                  </label>
                  <input
                    id="input-date"
                    type="date"
                    value={date}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none ${
                      activeSelector === '#input-date'
                        ? 'saarthi-highlight-pulse border-amber-500'
                        : 'border-stone-300 focus:border-blue-600'
                    }`}
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="pt-2 flex justify-end">
                <button
                  id="btn-search-trains"
                  type="button"
                  onClick={handleSearchTrains}
                  className={`px-6 py-3 rounded-xl font-extrabold text-sm text-white shadow-md transition-all flex items-center gap-2 ${
                    activeSelector === '#btn-search-trains'
                      ? 'saarthi-highlight-pulse bg-amber-600 ring-4 ring-amber-300'
                      : 'bg-blue-800 hover:bg-blue-900'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>{language === 'hi' ? 'Search Trains (ट्रेन खोजें)' : 'Search Trains'}</span>
                </button>
              </div>
            </div>

            {/* Step 5-6: Train Search Results */}
            {hasSearched && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-stone-900">
                    {language === 'hi' ? 'उपलब्ध ट्रेनें (New Delhi ➔ Jaipur)' : 'Available Trains (New Delhi ➔ Jaipur)'}
                  </h4>
                  <span className="text-xs text-stone-500">2 Trains Found for 25 Sep</span>
                </div>

                {/* Train Card 1: 12015 Ajmer Shatabdi */}
                <div
                  id="train-card-12015"
                  onClick={() => handleSelectTrain('12015')}
                  className={`border-2 rounded-2xl p-5 transition cursor-pointer ${
                    selectedTrain === '12015'
                      ? 'border-blue-600 bg-blue-50/40 shadow-md'
                      : activeSelector === '#train-card-12015'
                      ? 'saarthi-highlight-pulse border-amber-500 bg-amber-50/30'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg text-stone-900">12015 AJMER SHATABDI</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Runs Daily
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 font-medium">New Delhi (06:10 AM) ➔ Jaipur (10:40 AM) • 4h 30m</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-500 block">Starting from</span>
                      <span className="font-extrabold text-lg text-blue-900">₹890</span>
                    </div>
                  </div>

                  {/* Class Selection Buttons */}
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* AC Chair Car (CC) */}
                    <button
                      type="button"
                      id="class-btn-cc"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTrain('12015');
                        handleSelectClass('CC');
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition ${
                        selectedClass === 'CC'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : activeSelector === '#class-btn-cc'
                          ? 'saarthi-highlight-pulse border-amber-500 bg-amber-50'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>AC Chair Car (CC)</span>
                        <span className="text-emerald-700 font-extrabold">₹890</span>
                      </div>
                      <div className="text-xs font-black text-emerald-600 flex items-center gap-1">
                        <span>AVAILABLE - 42</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Confirmed seat guaranteed</span>
                    </button>

                    {/* Executive Class (EC) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTrain('12015');
                        handleSelectClass('EC');
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition ${
                        selectedClass === 'EC'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>Exec. Class (EC)</span>
                        <span className="text-emerald-700 font-extrabold">₹1,640</span>
                      </div>
                      <div className="text-xs font-black text-amber-600">
                        <span>RAC - 08</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Sitting berth guaranteed</span>
                    </button>

                    {/* 3rd AC Demo WL */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTrain('12015');
                        handleSelectClass('3A');
                      }}
                      className="p-3 rounded-xl border-2 text-left border-stone-200 bg-stone-50 hover:bg-stone-100"
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>Sleeper / 3A</span>
                        <span className="text-stone-700 font-bold">₹540</span>
                      </div>
                      <div className="text-xs font-bold text-rose-600">
                        <span>WL - 24</span>
                      </div>
                      <span className="text-[10px] text-stone-500">Waiting list (not confirmed)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Passenger Details Form */}
            {selectedClass && !isReviewed && (
              <form onSubmit={handlePassengerSubmit} className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h4 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>{language === 'hi' ? 'यात्री का विवरण' : 'Passenger Information'}</span>
                  </h4>
                  <span className="text-xs text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-bold">
                    Senior Citizen Quota
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="input-passenger-name" className="block text-xs font-bold text-stone-700">
                      {language === 'hi' ? 'यात्री का पूरा नाम:' : 'Passenger Full Name:'}
                    </label>
                    <input
                      id="input-passenger-name"
                      type="text"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra Sharma"
                      className={`w-full bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none ${
                        activeSelector === '#input-passenger-name'
                          ? 'saarthi-highlight-pulse border-amber-500'
                          : 'border-stone-300 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="input-passenger-age" className="block text-xs font-bold text-stone-700">
                      {language === 'hi' ? 'आयु (Age):' : 'Age:'}
                    </label>
                    <input
                      id="input-passenger-age"
                      type="number"
                      value={passengerAge}
                      onChange={(e) => setPassengerAge(e.target.value)}
                      className="w-full bg-white border-2 border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="chk-lower-berth"
                    checked={isLowerBerthPreferred}
                    onChange={(e) => setIsLowerBerthPreferred(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                  />
                  <label htmlFor="chk-lower-berth" className="text-xs font-bold text-stone-800">
                    {language === 'hi' ? 'निचली बर्थ प्राथमिकता (Senior Citizen Lower Berth Preference)' : 'Prefer Lower Berth for Senior Citizen'}
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    id="btn-proceed-review"
                    onClick={handleProceedReview}
                    className={`px-6 py-3 rounded-xl font-extrabold text-sm text-white shadow-md transition-all flex items-center gap-2 ${
                      activeSelector === '#btn-proceed-review'
                        ? 'saarthi-highlight-pulse bg-amber-600 ring-4 ring-amber-300'
                        : 'bg-blue-800 hover:bg-blue-900'
                    }`}
                  >
                    <span>{language === 'hi' ? 'विवरण जांचें व आगे बढ़ें' : 'Review & Proceed'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 8-9: Booking Review & Payment Gate */}
            {isReviewed && (
              <div className="bg-amber-50/60 border-2 border-amber-300 rounded-2xl p-6 space-y-6">
                <div className="border-b border-amber-200 pb-3">
                  <h4 className="font-black text-lg text-stone-900">
                    {language === 'hi' ? 'यात्रा विवरण की समीक्षा (Review)' : 'Travel & Fare Review Summary'}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {language === 'hi' ? 'कृपया पेमेंट करने से पहले सभी विवरण ध्यानपूर्वक जांच लें।' : 'Please check all journey and passenger details carefully before payment.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-xl p-3.5 border border-amber-200 space-y-1">
                    <span className="text-xs font-bold text-stone-500 block">Train &amp; Route</span>
                    <p className="font-extrabold text-stone-900">12015 Ajmer Shatabdi (CC)</p>
                    <p className="text-xs text-stone-600 font-medium">New Delhi (NDLS) ➔ Jaipur (JP) | 25 Sep</p>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-amber-200 space-y-1">
                    <span className="text-xs font-bold text-stone-500 block">Passenger &amp; Berth</span>
                    <p className="font-extrabold text-stone-900">{passengerName || 'Ramesh Sharma'} ({passengerAge} yrs)</p>
                    <p className="text-xs text-stone-600 font-medium">Senior Lower Berth Choice Assigned</p>
                  </div>
                </div>

                {/* Total Fare Breakdown */}
                <div className="bg-white rounded-xl p-4 border border-amber-300 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 font-semibold block">Total Demo Amount</span>
                    <span className="text-2xl font-black text-stone-900">₹890.00</span>
                  </div>
                  <div className="text-right text-xs text-stone-600">
                    <p>Base Fare: ₹785</p>
                    <p>IRCTC Fee &amp; GST: ₹105</p>
                  </div>
                </div>

                {/* High Risk Payment Gate Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{language === 'hi' ? 'सुरक्षा: हम कभी आपका UPI पिन या OTP नहीं मांगते।' : 'Safety: We will never request your UPI PIN or OTP.'}</span>
                  </div>

                  <button
                    type="button"
                    id="btn-safe-payment-demo"
                    onClick={handleFinalPayment}
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                      activeSelector === '#btn-safe-payment-demo'
                        ? 'saarthi-highlight-pulse bg-emerald-600 ring-4 ring-emerald-300'
                        : 'bg-emerald-700 hover:bg-emerald-800'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>{language === 'hi' ? 'सुरक्षित पेमेंट डेमो करें (₹890)' : 'Simulate Safe Payment (₹890)'}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
