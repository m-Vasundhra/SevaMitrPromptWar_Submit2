import React, { useState } from 'react';
import { Language, TaskStep } from '../../shared/types.ts';
import { 
  Plane, 
  Search, 
  ShieldCheck, 
  Clock, 
  Luggage, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface FlightBookingViewProps {
  language: Language;
  currentStep: TaskStep | null;
  onFieldChange: (field: string, value: any) => void;
  onCompleteStep: (fields: Record<string, any>) => void;
  formData: Record<string, any>;
  onTriggerHighRiskGate: (details: { title: string; warning: string; actionLabel: string; onConfirm: () => void }) => void;
}

export const FlightBookingView: React.FC<FlightBookingViewProps> = ({
  language,
  currentStep,
  onFieldChange,
  onCompleteStep,
  formData,
  onTriggerHighRiskGate
}) => {
  const [origin, setOrigin] = useState(formData.origin || '');
  const [dest, setDest] = useState(formData.destination || '');
  const [date, setDate] = useState(formData.date || '2026-10-12');
  const [hasSearched, setHasSearched] = useState(Boolean(formData.hasSearched));
  const [selectedFlight, setSelectedFlight] = useState(formData.selectedFlight || '');
  const [passengerName, setPassengerName] = useState(formData.passenger_name || '');
  const [isReviewed, setIsReviewed] = useState(Boolean(formData.isReviewed));
  const [isConfirmed, setIsConfirmed] = useState(false);

  const activeSelector = currentStep?.targetElementSelector;

  const handleOriginChange = (val: string) => {
    setOrigin(val);
    onFieldChange('origin', val);
    if (currentStep?.id === 'flight_origin' && val.trim().length >= 3) {
      onCompleteStep({ origin: val });
    }
  };

  const handleDestChange = (val: string) => {
    setDest(val);
    onFieldChange('destination', val);
    if (currentStep?.id === 'flight_destination' && val.trim().length >= 3) {
      onCompleteStep({ destination: val });
    }
  };

  const handleDateSelect = (val: string) => {
    setDate(val);
    onFieldChange('date', val);
    if (currentStep?.id === 'flight_date') {
      onCompleteStep({ date: val });
    }
  };

  const handleSearch = () => {
    setHasSearched(true);
    onFieldChange('hasSearched', true);
    if (currentStep?.id === 'flight_search') {
      onCompleteStep({ hasSearched: true });
    }
  };

  const handleSelectFlight = (flightCode: string) => {
    setSelectedFlight(flightCode);
    onFieldChange('selectedFlight', flightCode);
    if (currentStep?.id === 'compare_flights') {
      onCompleteStep({ selectedFlight: flightCode });
    }
  };

  const handlePassengerChange = (val: string) => {
    setPassengerName(val);
    onFieldChange('passenger_name', val);
    if (currentStep?.id === 'flight_passenger' && val.trim().length >= 3) {
      onCompleteStep({ passenger_name: val });
    }
  };

  const handleReview = () => {
    setIsReviewed(true);
    onFieldChange('isReviewed', true);
    if (currentStep?.id === 'flight_review') {
      onCompleteStep({ isReviewed: true });
    }
  };

  const handlePayment = () => {
    onTriggerHighRiskGate({
      title: language === 'hi' ? 'हवाई टिकट पेमेंट समीक्षा' : 'Flight Booking Authorization Gate',
      warning: language === 'hi'
        ? 'आप दिल्ली से बेंगलुरु (IndiSky 6E-214) के लिए ₹4,850 का टिकट बुक कर रहे हैं। बिना आपकी स्वयं जांच के कोई भुगतान न करें। कभी OTP या पासवर्ड न दें।'
        : 'You are booking Delhi → Bengaluru (IndiSky 6E-214) for ₹4,850. Please review fare rules. Never share your OTP, PIN, or Password.',
      actionLabel: language === 'hi' ? 'सुरक्षित टिकट बुक करें (डेमो)' : 'Confirm & Book Flight (Demo)',
      onConfirm: () => {
        setIsConfirmed(true);
        if (currentStep?.id === 'flight_payment') {
          onCompleteStep({ isPaid: true });
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden text-stone-900">
      {/* AirSky Portal Header */}
      <div className="bg-sky-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-sky-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-black flex items-center justify-center text-xl shadow">
            ✈️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wide">AirSky Domestic Travel</span>
              <span className="bg-sky-400 text-sky-950 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">DEMO SIMULATION</span>
            </div>
            <p className="text-xs text-sky-200">Flight comparisons, baggage guidance, and transparent pricing</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-sky-200 bg-sky-950/60 px-3 py-1.5 rounded-lg border border-sky-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>IATA Verified Airline Demo Engine</span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {isConfirmed ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-emerald-900">
              {language === 'hi' ? 'हवाई टिकट सफलतापूर्वक बुक हो गई!' : 'Flight Ticket Confirmed!'}
            </h3>
            <div className="max-w-md mx-auto bg-white rounded-xl p-4 border border-emerald-200 text-left text-sm space-y-2 shadow-sm font-mono">
              <p><strong>Booking Ref / PNR:</strong> AS-749210</p>
              <p><strong>Flight:</strong> IndiSky 6E-214 (Non-Stop)</p>
              <p><strong>Route:</strong> New Delhi (DEL) ➔ Bengaluru (BLR)</p>
              <p><strong>Baggage:</strong> 7 Kg Cabin + 15 Kg Check-in Included</p>
              <p><strong>Passenger:</strong> {passengerName || 'Senior Traveler'}</p>
              <p><strong>Total Fare:</strong> ₹4,850.00 (Demo Paid)</p>
            </div>
          </div>
        ) : (
          <>
            {/* Step 1-4: Search Flights */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h4 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-sky-600" />
                  <span>{language === 'hi' ? 'उड़ान खोजें' : 'Search Flights'}</span>
                </h4>
                <span className="text-xs text-stone-500 font-medium">Economy Class</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Form Input */}
                <div className="space-y-1.5">
                  <label htmlFor="flight-input-origin" className="block text-xs font-bold text-stone-700">
                    {language === 'hi' ? 'रवानगी हवाई अड्डा (Form):' : 'Form (Departure):'}
                  </label>
                  <input
                    id="flight-input-origin"
                    type="text"
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    placeholder="e.g. Delhi (DEL)"
                    className={`w-full bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none ${
                      activeSelector === '#flight-input-origin'
                        ? 'saarthi-highlight-pulse border-amber-500'
                        : 'border-stone-300 focus:border-sky-600'
                    }`}
                  />
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOriginChange('Delhi (DEL)')}
                      className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 hover:bg-amber-100 text-stone-800"
                    >
                      + Delhi (DEL)
                    </button>
                  </div>
                </div>

                {/* To Input */}
                <div className="space-y-1.5">
                  <label htmlFor="flight-input-dest" className="block text-xs font-bold text-stone-700">
                    {language === 'hi' ? 'गंतव्य हवाई अड्डा (To):' : 'To (Destination):'}
                  </label>
                  <input
                    id="flight-input-dest"
                    type="text"
                    value={dest}
                    onChange={(e) => handleDestChange(e.target.value)}
                    placeholder="e.g. Bengaluru (BLR)"
                    className={`w-full bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none ${
                      activeSelector === '#flight-input-dest'
                        ? 'saarthi-highlight-pulse border-amber-500'
                        : 'border-stone-300 focus:border-sky-600'
                    }`}
                  />
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleDestChange('Bengaluru (BLR)')}
                      className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 hover:bg-amber-100 text-stone-800"
                    >
                      + Bengaluru (BLR)
                    </button>
                  </div>
                </div>

                {/* Date Input */}
                <div className="space-y-1.5">
                  <label htmlFor="flight-input-date" className="block text-xs font-bold text-stone-700">
                    {language === 'hi' ? 'उड़ान की तारीख:' : 'Date:'}
                  </label>
                  <input
                    id="flight-input-date"
                    type="date"
                    value={date}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none ${
                      activeSelector === '#flight-input-date'
                        ? 'saarthi-highlight-pulse border-amber-500'
                        : 'border-stone-300 focus:border-sky-600'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  id="flight-btn-search"
                  type="button"
                  onClick={handleSearch}
                  className={`px-6 py-3 rounded-xl font-extrabold text-sm text-white shadow-md transition-all flex items-center gap-2 ${
                    activeSelector === '#flight-btn-search'
                      ? 'saarthi-highlight-pulse bg-amber-600 ring-4 ring-amber-300'
                      : 'bg-sky-800 hover:bg-sky-900'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>{language === 'hi' ? 'उड़ानें खोजें (Search Flights)' : 'Search Flights'}</span>
                </button>
              </div>
            </div>

            {/* Flight Results Comparison */}
            {hasSearched && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-stone-900">
                    {language === 'hi' ? 'उपलब्ध उड़ानें (Delhi ➔ Bengaluru)' : 'Available Flights (Delhi ➔ Bengaluru)'}
                  </h4>
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {language === 'hi' ? 'नॉन-स्टॉप उड़ानें सबसे आरामदायक हैं' : 'Non-Stop Recommended'}
                  </span>
                </div>

                {/* Flight 1: Non-stop */}
                <div
                  id="flight-card-6e214"
                  onClick={() => handleSelectFlight('6E-214')}
                  className={`border-2 rounded-2xl p-5 transition cursor-pointer ${
                    selectedFlight === '6E-214'
                      ? 'border-sky-600 bg-sky-50/40 shadow-md'
                      : activeSelector === '#flight-card-6e214'
                      ? 'saarthi-highlight-pulse border-amber-500 bg-amber-50/30'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center">
                        6E
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-stone-900">IndiSky 6E-214</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Non-Stop (सीधी उड़ान)
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 font-medium">08:30 AM (DEL) ➔ 11:15 AM (BLR) • 2h 45m</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-sky-900">₹4,850</span>
                      <span className="text-[10px] text-stone-500 block">Includes Taxes &amp; Free 15kg Bag</span>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 font-semibold">
                        <Luggage className="w-3.5 h-3.5 text-sky-700" />
                        <span>Cabin: 7 Kg + Check-in: 15 Kg</span>
                      </span>
                      <span className="text-emerald-700 font-bold">✓ Free Meal Choice</span>
                    </div>
                    <span className="font-bold text-sky-800">
                      {selectedFlight === '6E-214' ? '✓ Selected' : 'Click to Select'}
                    </span>
                  </div>
                </div>

                {/* Flight 2: 1-Stop Layover comparison */}
                <div
                  onClick={() => handleSelectFlight('AI-508')}
                  className="border-2 border-stone-200 rounded-2xl p-5 bg-stone-50/50 hover:bg-stone-100/60 transition cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 font-black flex items-center justify-center">
                        AI
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-stone-900">AirBharat AI-508</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            1-Stop Layover in Mumbai (1h 45m)
                          </span>
                        </div>
                        <p className="text-xs text-stone-600">07:00 AM (DEL) ➔ 12:45 PM (BLR) • 5h 45m total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-stone-800">₹4,420</span>
                      <span className="text-[10px] text-stone-500 block">Slightly cheaper but longer wait</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Passenger Details & Review */}
            {selectedFlight && !isReviewed && (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-base text-stone-900">
                  {language === 'hi' ? 'यात्री का विवरण (सरकारी पहचान पत्र के अनुसार)' : 'Passenger Name (Matching Govt Photo ID)'}
                </h4>

                <div className="space-y-1.5">
                  <label htmlFor="flight-input-name" className="block text-xs font-bold text-stone-700">
                    {language === 'hi' ? 'यात्री का पूरा नाम:' : 'Full Name:'}
                  </label>
                  <input
                    id="flight-input-name"
                    type="text"
                    value={passengerName}
                    onChange={(e) => handlePassengerChange(e.target.value)}
                    placeholder="e.g. Smt. Sharda Devi"
                    className={`w-full bg-white border-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none ${
                      activeSelector === '#flight-input-name'
                        ? 'saarthi-highlight-pulse border-amber-500'
                        : 'border-stone-300 focus:border-sky-600'
                    }`}
                  />
                  <p className="text-[11px] text-stone-500">
                    {language === 'hi' ? 'हवाई अड्डे पर सुरक्षा जांच के लिए आधार या पासपोर्ट से नाम मिलना ज़रूरी है।' : 'Name must match your Aadhaar, Passport, or Voter ID for airport security gate entry.'}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="flight-btn-review"
                    type="button"
                    onClick={handleReview}
                    className={`px-6 py-3 rounded-xl font-extrabold text-sm text-white shadow-md transition-all flex items-center gap-2 ${
                      activeSelector === '#flight-btn-review'
                        ? 'saarthi-highlight-pulse bg-amber-600 ring-4 ring-amber-300'
                        : 'bg-sky-800 hover:bg-sky-900'
                    }`}
                  >
                    <span>{language === 'hi' ? 'समीक्षा करें व पेमेंट (Review & Pay)' : 'Review & Proceed'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Flight Final Payment Gate */}
            {isReviewed && (
              <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-6 space-y-6">
                <div className="border-b border-sky-200 pb-3">
                  <h4 className="font-black text-lg text-stone-900">
                    {language === 'hi' ? 'उड़ान व किराये की अंतिम समीक्षा' : 'Fare Breakdown & Final Confirmation'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-xl p-3.5 border border-sky-200 space-y-1">
                    <span className="text-xs font-bold text-stone-500 block">Flight &amp; Sector</span>
                    <p className="font-extrabold text-stone-900">IndiSky 6E-214 (Non-Stop)</p>
                    <p className="text-xs text-stone-600 font-medium">New Delhi (DEL) ➔ Bengaluru (BLR)</p>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-sky-200 space-y-1">
                    <span className="text-xs font-bold text-stone-500 block">Passenger</span>
                    <p className="font-extrabold text-stone-900">{passengerName || 'Sharda Devi'}</p>
                    <p className="text-xs text-stone-600 font-medium">15 Kg Baggage Included</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-sky-300 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 font-semibold block">Total Amount</span>
                    <span className="text-2xl font-black text-stone-900">₹4,850.00</span>
                  </div>
                  <div className="text-right text-xs text-stone-600">
                    <p>Base Fare: ₹4,100</p>
                    <p>Airport Fees &amp; GST: ₹750</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    id="flight-btn-pay-demo"
                    onClick={handlePayment}
                    className={`px-8 py-3.5 rounded-xl font-extrabold text-base text-white shadow-lg transition-all flex items-center gap-2 ${
                      activeSelector === '#flight-btn-pay-demo'
                        ? 'saarthi-highlight-pulse bg-emerald-600 ring-4 ring-emerald-300'
                        : 'bg-emerald-700 hover:bg-emerald-800'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>{language === 'hi' ? 'सुरक्षित फ्लाइट बुकिंग डेमो (₹4,850)' : 'Simulate Safe Flight Booking (₹4,850)'}</span>
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
