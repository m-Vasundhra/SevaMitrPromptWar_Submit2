import { TaskDefinition, WorkflowType, TaskStep } from '../shared/types.ts';

export const WORKFLOWS: Record<WorkflowType, TaskDefinition> = {
  train_booking: {
    id: 'train_booking',
    title: {
      en: 'Train Ticket Booking (IRCTC Demo)',
      hi: 'ट्रेन टिकट बुकिंग (IRCTC डेमो)'
    },
    description: {
      en: 'Learn to search trains, select sleeper or AC coaches, and verify bookings calmly.',
      hi: 'ट्रेन खोजना, स्लीपर या एसी कोच चुनना और सुरक्षित बुकिंग करना सीखें।'
    },
    domain: 'irctc.co.in',
    steps: [
      {
        id: 'origin',
        stepNumber: 1,
        name: 'origin',
        title: {
          en: 'Departure Station',
          hi: 'यात्रा शुरू करने का स्टेशन'
        },
        instruction: {
          en: "First, click the 'Form' box and enter your starting city, for example 'New Delhi'.",
          hi: "सबसे पहले 'Form' वाले बॉक्स में अपने शहर का नाम लिखें, जैसे 'New Delhi'।"
        },
        spokenPrompt: {
          en: "First, please enter your starting departure station in the Form field.",
          hi: "सबसे पहले 'Form' वाले बॉक्स में अपने शहर का नाम लिखें।"
        },
        targetElementSelector: '#input-origin',
        targetElementName: {
          en: 'Form (Departure Station)',
          hi: 'Form (रवानगी स्टेशन)'
        },
        expectedAction: 'input',
        expectedField: 'origin',
        expectedValue: 'New Delhi',
        riskLevel: 'low',
        explanationTerms: [
          {
            term: 'Form / Origin',
            meaning: {
              en: 'The railway station where you will board the train.',
              hi: 'वह रेलवे स्टेशन जहाँ से आप ट्रेन में बैठेंगे।'
            }
          }
        ]
      },
      {
        id: 'destination',
        stepNumber: 2,
        name: 'destination',
        title: {
          en: 'Destination Station',
          hi: 'गंतव्य स्टेशन'
        },
        instruction: {
          en: "Very good! Now click the 'To' box and enter your destination, for example 'Jaipur'.",
          hi: "बहुत अच्छा! अब 'To' वाले बॉक्स में उस शहर का नाम लिखें जहाँ जाना है, जैसे 'Jaipur'।"
        },
        spokenPrompt: {
          en: "Great job! Now enter your destination city in the To box.",
          hi: "बहुत अच्छा! अब 'To' वाले बॉक्स में Jaipur लिखें।"
        },
        targetElementSelector: '#input-destination',
        targetElementName: {
          en: 'To (Destination)',
          hi: 'To (गंतव्य स्टेशन)'
        },
        expectedAction: 'input',
        expectedField: 'destination',
        expectedValue: 'Jaipur',
        riskLevel: 'low'
      },
      {
        id: 'travel_date',
        stepNumber: 3,
        name: 'travel_date',
        title: {
          en: 'Travel Date',
          hi: 'यात्रा की तारीख'
        },
        instruction: {
          en: "Now select the date you want to travel from the calendar.",
          hi: "अब कैलेंडर से वह तारीख चुनें जिस दिन आप यात्रा करना चाहते हैं।"
        },
        spokenPrompt: {
          en: "Now select your date of travel.",
          hi: "अब यात्रा की तारीख चुनें।"
        },
        targetElementSelector: '#input-date',
        targetElementName: {
          en: 'Travel Date Calendar',
          hi: 'तारीख चयन'
        },
        expectedAction: 'select',
        expectedField: 'travel_date',
        riskLevel: 'low'
      },
      {
        id: 'search',
        stepNumber: 4,
        name: 'search',
        title: {
          en: 'Search Trains',
          hi: 'ट्रेन खोजें'
        },
        instruction: {
          en: "Click the blue 'Search Trains' button to see all available trains.",
          hi: "उपलब्ध सभी ट्रेनों की सूची देखने के लिए नीले 'Search Trains' बटन पर क्लिक करें।"
        },
        spokenPrompt: {
          en: "Click on Search Trains to view the train schedule.",
          hi: "ट्रेन खोजने के लिए Search Trains बटन दबाएँ।"
        },
        targetElementSelector: '#btn-search-trains',
        targetElementName: {
          en: 'Search Trains Button',
          hi: 'Search Trains बटन'
        },
        expectedAction: 'click',
        riskLevel: 'low'
      },
      {
        id: 'select_train',
        stepNumber: 5,
        name: 'select_train',
        title: {
          en: 'Select Preferred Train',
          hi: 'ट्रेन का चुनाव करें'
        },
        instruction: {
          en: "Choose the train that suits your preferred timing (e.g. 'Ajmer Shatabdi' or 'Ashram Express').",
          hi: "अपने पसंदीदा समय की ट्रेन चुनें (जैसे 'Ajmer Shatabdi' या 'Ashram Express')।"
        },
        spokenPrompt: {
          en: "Choose a train from the search results.",
          hi: "सूची में से अपनी पसंदीदा ट्रेन चुनें।"
        },
        targetElementSelector: '#train-card-12015',
        targetElementName: {
          en: 'Ajmer Shatabdi Express',
          hi: 'अजमेर शताब्दी एक्सप्रेस'
        },
        expectedAction: 'click',
        riskLevel: 'low'
      },
      {
        id: 'select_class',
        stepNumber: 6,
        name: 'select_class',
        title: {
          en: 'Select Coach Class',
          hi: 'क्लास चुनें (Sleeper / AC)'
        },
        instruction: {
          en: "Select your coach type: AC Chair Car (CC), AC 3 Tier (3A), or Sleeper (SL). Check the availability badge.",
          hi: "अपनी पसंद का डिब्बा चुनें: चेयर कार (CC), एसी 3 टियर (3A), या स्लीपर (SL)।"
        },
        spokenPrompt: {
          en: "Select your coach class. We will explain WL or RAC if shown.",
          hi: "अपनी पसंद की क्लास चुनें।"
        },
        targetElementSelector: '#class-btn-cc',
        targetElementName: {
          en: 'AC Chair Car (CC) / Available',
          hi: 'एसी चेयर कार (CC)'
        },
        expectedAction: 'select',
        riskLevel: 'low',
        explanationTerms: [
          {
            term: 'Available (AVL)',
            meaning: {
              en: 'Confirmed seat is guaranteed immediately upon booking.',
              hi: 'टिकट बुक करते ही कन्फ़र्म सीट मिल जाएगी।'
            }
          },
          {
            term: 'RAC (Reservation Against Cancellation)',
            meaning: {
              en: 'Guarantees travel on the train with a shared sitting berth, with chance to get full berth if someone cancels.',
              hi: 'ट्रेन में बैठने की जगह पक्की है, किसी के रद्द करने पर पूरी सीट मिल सकती है।'
            }
          },
          {
            term: 'WL (Waiting List)',
            meaning: {
              en: 'No seat allotted yet. You only travel if enough passengers cancel.',
              hi: 'सीट अभी पक्की नहीं है। टिकट कन्फ़र्म होने पर ही यात्रा की जा सकती है।'
            }
          }
        ]
      },
      {
        id: 'passenger_details',
        stepNumber: 7,
        name: 'passenger_details',
        title: {
          en: 'Senior Passenger Details',
          hi: 'यात्री का नाम व आयु'
        },
        instruction: {
          en: "Enter the passenger name and age. You can select 'Senior Citizen Lower Berth Preference' if desired.",
          hi: "यात्री का नाम और आयु लिखें। आप 'सीनियर सिटीजन लोअर बर्थ' चुन सकते हैं।"
        },
        spokenPrompt: {
          en: "Enter passenger name and age.",
          hi: "यात्री का नाम और उम्र भरें।"
        },
        targetElementSelector: '#input-passenger-name',
        targetElementName: {
          en: 'Passenger Name & Age',
          hi: 'यात्री का नाम और उम्र'
        },
        expectedAction: 'input',
        expectedField: 'passenger_name',
        riskLevel: 'low'
      },
      {
        id: 'review',
        stepNumber: 8,
        name: 'review',
        title: {
          en: 'Review Travel Summary',
          hi: 'यात्रा विवरण की समीक्षा'
        },
        instruction: {
          en: "Check the train number, departure time, and passenger name carefully before proceeding to payment.",
          hi: "पेमेंट करने से पहले ट्रेन का नाम, समय और यात्री का नाम ध्यान से जाँच लें।"
        },
        spokenPrompt: {
          en: "Please review the booking summary details carefully.",
          hi: "कृपया बुकिंग की सभी जानकारियों को ध्यान से जांच लें।"
        },
        targetElementSelector: '#btn-proceed-review',
        targetElementName: {
          en: 'Proceed to Payment Button',
          hi: 'आगे बढ़ें बटन'
        },
        expectedAction: 'click',
        riskLevel: 'low'
      },
      {
        id: 'payment',
        stepNumber: 9,
        name: 'payment',
        title: {
          en: 'Payment Safety Check',
          hi: 'पेमेंट सुरक्षा जांच'
        },
        instruction: {
          en: "This is the final payment step. In real life, never share your UPI PIN or OTP with anyone. In this demo, click 'Simulate Safe Payment'.",
          hi: "यह अंतिम पेमेंट कदम है। वास्तविक जीवन में अपना UPI PIN या OTP कभी किसी को न बताएं। इस डेमो में 'Simulate Safe Payment' दबाएँ।"
        },
        spokenPrompt: {
          en: "High risk step. Never share your OTP or PIN with anyone.",
          hi: "सावधानी: कभी भी अपना OTP या UPI पिन किसी के साथ साझा न करें।"
        },
        targetElementSelector: '#btn-safe-payment-demo',
        targetElementName: {
          en: 'Simulate Safe Payment',
          hi: 'सुरक्षित पेमेंट डेमो'
        },
        expectedAction: 'confirm',
        riskLevel: 'high',
        requiresConfirmation: true
      }
    ]
  },

  flight_booking: {
    id: 'flight_booking',
    title: {
      en: 'Flight Ticket Booking (AirSky Demo)',
      hi: 'हवाई जहाज़ टिकट बुकिंग (AirSky डेमो)'
    },
    description: {
      en: 'Understand non-stop vs layover flights, cabin baggage weight limits, and pricing.',
      hi: 'नॉन-स्टॉप फ्लाइट, लेओवर, और केबिन बैगेज के नियमों को आसानी से समझें।'
    },
    domain: 'airsky-flights.demo',
    steps: [
      {
        id: 'flight_origin',
        stepNumber: 1,
        name: 'origin',
        title: {
          en: 'Form City (Airport)',
          hi: 'रवानगी शहर (हवाई अड्डा)'
        },
        instruction: {
          en: "Click 'Form' and choose your departure airport (e.g. 'Delhi - DEL').",
          hi: "'Form' पर क्लिक करें और अपना शहर चुनें (जैसे 'Delhi - DEL')।"
        },
        spokenPrompt: {
          en: "Select departure airport in Form.",
          hi: "'Form' में अपना शहर चुनें।"
        },
        targetElementSelector: '#flight-input-origin',
        targetElementName: { en: 'Form Airport', hi: 'Form हवाई अड्डा' },
        expectedAction: 'input',
        expectedField: 'origin',
        riskLevel: 'low'
      },
      {
        id: 'flight_destination',
        stepNumber: 2,
        name: 'destination',
        title: {
          en: 'To City (Destination)',
          hi: 'पहुंचने का शहर (गंतव्य)'
        },
        instruction: {
          en: "Click 'To' and choose your destination airport (e.g. 'Bengaluru - BLR').",
          hi: "'To' पर क्लिक करें और गंतव्य हवाई अड्डा चुनें (जैसे 'Bengaluru - BLR')।"
        },
        spokenPrompt: {
          en: "Select your destination airport.",
          hi: "'To' में गंतव्य हवाई अड्डा चुनें।"
        },
        targetElementSelector: '#flight-input-dest',
        targetElementName: { en: 'To Airport', hi: 'To हवाई अड्डा' },
        expectedAction: 'input',
        expectedField: 'destination',
        riskLevel: 'low'
      },
      {
        id: 'flight_date',
        stepNumber: 3,
        name: 'date',
        title: {
          en: 'Departure Date',
          hi: 'उड़ान की तारीख'
        },
        instruction: {
          en: "Pick your travel date.",
          hi: "यात्रा की तारीख चुनें।"
        },
        spokenPrompt: {
          en: "Choose your travel date.",
          hi: "यात्रा की तारीख चुनें।"
        },
        targetElementSelector: '#flight-input-date',
        targetElementName: { en: 'Departure Date', hi: 'उड़ान की तारीख' },
        expectedAction: 'select',
        riskLevel: 'low'
      },
      {
        id: 'flight_search',
        stepNumber: 4,
        name: 'search',
        title: {
          en: 'Search Available Flights',
          hi: 'उड़ानें खोजें'
        },
        instruction: {
          en: "Click the 'Search Flights' button to compare airlines.",
          hi: "उड़ानों की सूची देखने के लिए 'Search Flights' बटन दबाएँ।"
        },
        spokenPrompt: {
          en: "Click Search Flights.",
          hi: "Search Flights बटन दबाएँ।"
        },
        targetElementSelector: '#flight-btn-search',
        targetElementName: { en: 'Search Flights', hi: 'Search Flights बटन' },
        expectedAction: 'click',
        riskLevel: 'low'
      },
      {
        id: 'compare_flights',
        stepNumber: 5,
        name: 'select_flight',
        title: {
          en: 'Compare & Select Flight',
          hi: 'उड़ान का चुनाव करें'
        },
        instruction: {
          en: "Look for 'Non-Stop' flights if you prefer direct travel without changing planes at other airports.",
          hi: "अगर आप बिना विमान बदले सीधे जाना चाहते हैं, तो 'Non-Stop' वाली उड़ान चुनें।"
        },
        spokenPrompt: {
          en: "Select a non-stop flight for comfortable direct travel.",
          hi: "सीधी और आरामदायक यात्रा के लिए नॉन-स्टॉप फ्लाइट चुनें।"
        },
        targetElementSelector: '#flight-card-6e214',
        targetElementName: { en: 'IndiSky 6E-214 (Non-Stop)', hi: 'इंडिस्काई 6E-214 (नॉन-स्टॉप)' },
        expectedAction: 'click',
        riskLevel: 'low',
        explanationTerms: [
          {
            term: 'Non-Stop',
            meaning: {
              en: 'Direct flight that flies straight to destination without landing anywhere in between.',
              hi: 'सीधी उड़ान जो बिना कहीं रुके सीधे गंतव्य पर पहुँचाती है।'
            }
          },
          {
            term: 'Layover / 1-Stop',
            meaning: {
              en: 'The airplane will land at an intermediate city where you may need to wait or switch planes.',
              hi: 'रास्ते में किसी दूसरे शहर में रुकना पड़ेगा और दूसरा विमान लेना पड़ सकता है।'
            }
          },
          {
            term: 'Cabin Baggage (7 Kg)',
            meaning: {
              en: 'Small hand bag or backpack you can carry with you inside the aircraft cabin.',
              hi: 'छोटा बैग जो आप अपने साथ ऊपर विमान के अंदर ले जा सकते हैं।'
            }
          }
        ]
      },
      {
        id: 'flight_passenger',
        stepNumber: 6,
        name: 'passenger_details',
        title: {
          en: 'Passenger Details',
          hi: 'यात्री का नाम व पहचान'
        },
        instruction: {
          en: "Enter your Name exactly as written on your Govt Photo ID (Aadhaar / Voter ID / Passport).",
          hi: "अपना नाम ठीक वैसा ही लिखें जैसा आपके सरकारी पहचान पत्र (आधार या वोटर आईडी) पर लिखा है।"
        },
        spokenPrompt: {
          en: "Enter passenger name exactly matching your ID card.",
          hi: "अपना नाम सरकारी पहचान पत्र के अनुसार लिखें।"
        },
        targetElementSelector: '#flight-input-name',
        targetElementName: { en: 'Passenger Full Name', hi: 'यात्री का पूरा नाम' },
        expectedAction: 'input',
        riskLevel: 'low'
      },
      {
        id: 'flight_review',
        stepNumber: 7,
        name: 'review',
        title: {
          en: 'Fare Breakdown & Baggage Review',
          hi: 'किराया व बैगेज की जाँच'
        },
        instruction: {
          en: "Review the base fare, taxes, and free check-in baggage allowance (15 kg).",
          hi: "बेस किराया, टैक्स और 15 किलो मुफ़्त चेक-इन बैगेज की जाँच कर लें।"
        },
        spokenPrompt: {
          en: "Please review baggage rules and fare details.",
          hi: "किराया और बैगेज के नियमों की जाँच करें।"
        },
        targetElementSelector: '#flight-btn-review',
        targetElementName: { en: 'Proceed to Payment', hi: 'पेमेंट के लिए आगे बढ़ें' },
        expectedAction: 'click',
        riskLevel: 'low'
      },
      {
        id: 'flight_payment',
        stepNumber: 8,
        name: 'payment',
        title: {
          en: 'Payment & Safety Confirmation',
          hi: 'सुरक्षित पेमेंट'
        },
        instruction: {
          en: "Final confirmation. Always ensure the total price has no unwanted add-ons (like extra insurance or paid meals) unless you specifically selected them.",
          hi: "अंतिम पुष्टि। हमेशा जांच लें कि कुल बिल में कोई अनचाहा अतिरिक्त शुल्क न जुड़ा हो।"
        },
        spokenPrompt: {
          en: "High risk step. Please review all charges before simulated completion.",
          hi: "सावधानी: सभी शुल्कों की पुष्टि के बाद ही आगे बढ़ें।"
        },
        targetElementSelector: '#flight-btn-pay-demo',
        targetElementName: { en: 'Simulate Safe Flight Booking', hi: 'सुरक्षित फ्लाइट बुकिंग डेमो' },
        expectedAction: 'confirm',
        riskLevel: 'high',
        requiresConfirmation: true
      }
    ]
  },

  net_banking: {
    id: 'net_banking',
    title: {
      en: 'Senior Banking Safety (SafeBank Demo)',
      hi: 'वरिष्ठ नागरिक बैंकिंग सुरक्षा (SafeBank डेमो)'
    },
    description: {
      en: 'Learn how to check your account balance safely and transfer funds with high-risk safeguards.',
      hi: 'खाते का बैलेंस देखना और सुरक्षा चेतावनियों के साथ सुरक्षित पैसे भेजने का अभ्यास करें।'
    },
    domain: 'safebank-online.demo',
    steps: [
      {
        id: 'view_balance',
        stepNumber: 1,
        name: 'balance',
        title: {
          en: 'View Account Balance (Low Risk)',
          hi: 'खाता बैलेंस देखना (कम जोखिम)'
        },
        instruction: {
          en: "Viewing your balance is safe. Click the 'Show Balance' eye icon on your Savings Account card.",
          hi: "बैलेंस देखना पूरी तरह सुरक्षित है। अपने बचत खाते पर बने 'Show Balance' आँख वाले निशान पर क्लिक करें।"
        },
        spokenPrompt: {
          en: "Viewing balance is completely safe. Click Show Balance.",
          hi: "बैलेंस देखना सुरक्षित है। Show Balance पर क्लिक करें।"
        },
        targetElementSelector: '#bank-btn-show-balance',
        targetElementName: { en: 'Show Balance Button', hi: 'Show Balance बटन' },
        expectedAction: 'click',
        riskLevel: 'low'
      },
      {
        id: 'select_transfer',
        stepNumber: 2,
        name: 'initiate_transfer',
        title: {
          en: 'Initiate Money Transfer',
          hi: 'पैसे भेजने की शुरुआत'
        },
        instruction: {
          en: "Click 'Send Money / Pay Beneficiary' to practice a safe domestic transfer.",
          hi: "'Send Money / Pay' बटन पर क्लिक करके पैसे भेजने का अभ्यास करें।"
        },
        spokenPrompt: {
          en: "Click on Send Money to practice a safe transfer.",
          hi: "पैसे भेजने के लिए Send Money दबाएँ।"
        },
        targetElementSelector: '#bank-btn-send-money',
        targetElementName: { en: 'Send Money Button', hi: 'Send Money बटन' },
        expectedAction: 'click',
        riskLevel: 'medium'
      },
      {
        id: 'select_beneficiary',
        stepNumber: 3,
        name: 'beneficiary',
        title: {
          en: 'Select Registered Beneficiary',
          hi: 'प्राप्तकर्ता (Beneficiary) का चुनाव'
        },
        instruction: {
          en: "Choose a pre-registered contact (e.g. 'Ramesh Sharma - Son') to ensure money goes to the right person.",
          hi: "हमेशा पहले से जुड़े हुए परिचित व्यक्ति (जैसे 'Ramesh Sharma - बेटा') को ही चुनें।"
        },
        spokenPrompt: {
          en: "Select a known beneficiary.",
          hi: "सूची से परिचित प्राप्तकर्ता चुनें।"
        },
        targetElementSelector: '#bank-beneficiary-1',
        targetElementName: { en: 'Ramesh Sharma (Beneficiary)', hi: 'रमेश शर्मा (बेटा)' },
        expectedAction: 'select',
        riskLevel: 'medium',
        explanationTerms: [
          {
            term: 'Beneficiary',
            meaning: {
              en: 'The trusted person or business whose bank account will receive your money.',
              hi: 'वह भरोसेमंद व्यक्ति या खाता जिसमें आपके पैसे पहुँचेंगे।'
            }
          }
        ]
      },
      {
        id: 'enter_amount',
        stepNumber: 4,
        name: 'amount',
        title: {
          en: 'Enter Transfer Amount',
          hi: 'रुपये की राशि भरें'
        },
        instruction: {
          en: "Enter demo amount (e.g. '5000'). Always double-check zeroes so you don't enter extra amount.",
          hi: "डेमो राशि भरें (जैसे '5000')। हमेशा शून्य (0) ध्यान से गिनें ताकि गलती से ज़्यादा राशि न चली जाए।"
        },
        spokenPrompt: {
          en: "Enter the transfer amount and double-check zeroes.",
          hi: "राशि भरें और शून्य को ध्यान से जांचें।"
        },
        targetElementSelector: '#bank-input-amount',
        targetElementName: { en: 'Amount (₹)', hi: 'राशि (₹)' },
        expectedAction: 'input',
        expectedField: 'amount',
        expectedValue: '5000',
        riskLevel: 'medium'
      },
      {
        id: 'high_risk_gate',
        stepNumber: 5,
        name: 'risk_warning',
        title: {
          en: 'High Risk Safety Authorization Gate',
          hi: 'उच्च जोखिम सुरक्षा समीक्षा'
        },
        instruction: {
          en: "HIGH RISK ALERT: You are transferring ₹5,000 to Ramesh Sharma. The AI assistant will NEVER ask for your UPI PIN, Password, or OTP. Verify the details yourself on screen.",
          hi: "सावधानी: आप ₹5,000 रमेश शर्मा को भेजने जा रहे हैं। AI साथी आपसे कभी PIN या OTP नहीं मांगेगा। खुद विवरण की जांच करें।"
        },
        spokenPrompt: {
          en: "High risk action. Please verify recipient and amount yourself. Never share your PIN or OTP.",
          hi: "उच्च जोखिम: कृपया प्राप्तकर्ता और ₹5,000 राशि की जानकारी स्वयं जांच लें।"
        },
        targetElementSelector: '#bank-btn-confirm-transfer',
        targetElementName: { en: 'Verify & Authorize Transfer', hi: 'जांचें और अनुमति दें' },
        expectedAction: 'confirm',
        riskLevel: 'high',
        requiresConfirmation: true
      }
    ]
  },

  scam_check: {
    id: 'scam_check',
    title: {
      en: 'Scam & Suspicious Message Inspector',
      hi: 'संदिग्ध संदेश व स्कैम जांच केंद्र'
    },
    description: {
      en: 'Paste any WhatsApp message, lottery SMS, or electricity bill notice to check for fraud indicators with privacy shielding.',
      hi: 'किसी भी WhatsApp मैसेज, लॉटरी SMS या बिजली कटने की धमकी की सुरक्षित जांच करें।'
    },
    domain: 'cyber-safety.demo',
    steps: [
      {
        id: 'select_sample_scam',
        stepNumber: 1,
        name: 'sample_message',
        title: {
          en: 'Select or Paste Message',
          hi: 'संदेश चुनें या पेस्ट करें'
        },
        instruction: {
          en: "Select a sample scam message below (like Electricity Bill Cutoff or WhatsApp Lottery) or paste your own message.",
          hi: "नीचे दिए गए उदाहरणों में से कोई संदेश चुनें (जैसे बिजली बिल कटने की धमकी या लॉटरी) या अपना संदेश पेस्ट करें।"
        },
        spokenPrompt: {
          en: "Select a sample suspicious message to analyze.",
          hi: "जांचने के लिए कोई संदिग्ध संदेश चुनें।"
        },
        targetElementSelector: '#scam-sample-electricity',
        targetElementName: { en: 'Sample: Electricity Bill Threat', hi: 'उदाहरण: बिजली बिल धमकी SMS' },
        expectedAction: 'click',
        riskLevel: 'low'
      },
      {
        id: 'inspect_privacy_shield',
        stepNumber: 2,
        name: 'privacy_shield',
        title: {
          en: 'Inspect Privacy Shield',
          hi: 'प्राइवेसी शील्ड (निजी जानकारी सुरक्षा)'
        },
        instruction: {
          en: "Notice how our Privacy Firewall automatically masks phone numbers, account digits, and private data before AI inspection.",
          hi: "देखें कि कैसे हमारा प्राइवेसी फ़ायरवॉल AI जांच से पहले फ़ोन नंबर और निजी विवरण को छिपा देता है।"
        },
        spokenPrompt: {
          en: "Notice how private data is shielded before analysis.",
          hi: "देखें कि आपकी निजी जानकारी को कैसे सुरक्षित छिपाया गया है।"
        },
        targetElementSelector: '#privacy-shield-badge',
        targetElementName: { en: 'Privacy Shield Indicator', hi: 'प्राइवेसी शील्ड' },
        expectedAction: 'inspect',
        riskLevel: 'low'
      },
      {
        id: 'run_scam_analysis',
        stepNumber: 3,
        name: 'analyze',
        title: {
          en: 'Run Safety Analysis',
          hi: 'सुरक्षा जांच शुरू करें'
        },
        instruction: {
          en: "Click 'Analyze Message' to examine urgency triggers, suspicious links, and impersonation indicators.",
          hi: "धोखे के संकेतों (जैसे जल्दबाजी, अनजान लिंक) की जांच के लिए 'Analyze Message' पर क्लिक करें।"
        },
        spokenPrompt: {
          en: "Click Analyze Message to detect suspicious characteristics.",
          hi: "जांच के लिए Analyze Message बटन दबाएँ।"
        },
        targetElementSelector: '#btn-run-scam-analysis',
        targetElementName: { en: 'Analyze Message Button', hi: 'Analyze Message बटन' },
        expectedAction: 'click',
        riskLevel: 'low'
      },
      {
        id: 'review_indicators',
        stepNumber: 4,
        name: 'advice',
        title: {
          en: 'Read Companion Advice & Indicators',
          hi: 'साथी की सलाह और कारण समझें'
        },
        instruction: {
          en: "Read the clear, non-alarmist explanation of why this message is suspicious and what safe action to take (e.g., never call the number in the SMS).",
          hi: "सारथी की समझाइश पढ़ें कि यह संदेश क्यों संदिग्ध है और क्या सुरक्षित कदम उठाना चाहिए (जैसे SMS में दिए नंबर पर कॉल न करना)।"
        },
        spokenPrompt: {
          en: "Here are the detected scam indicators and recommended safety steps.",
          hi: "यहाँ स्कैम के मुख्य लक्षण और सुरक्षित रहने के उपाय दिए गए हैं।"
        },
        targetElementSelector: '#scam-result-card',
        targetElementName: { en: 'Safety Analysis & Advice Card', hi: 'सुरक्षा रिपोर्ट कार्ड' },
        expectedAction: 'inspect',
        riskLevel: 'low'
      }
    ]
  },

  custom: {
    id: 'custom',
    title: {
      en: 'Custom Web Task Guide',
      hi: 'अन्य वेबसाइट मार्गदर्शन'
    },
    description: {
      en: 'Ask SevaMitr to guide you on any digital portal or webpage.',
      hi: 'किसी भी डिजिटल सेवा या वेबसाइट पर सेवामित्र से मार्गदर्शन लें।'
    },
    domain: 'general.web',
    steps: [
      {
        id: 'custom_input',
        stepNumber: 1,
        name: 'custom_query',
        title: { en: 'Your Question or Task', hi: 'आपका प्रश्न या कार्य' },
        instruction: {
          en: "Type or speak what you would like to accomplish on this page.",
          hi: "आप इस पेज पर क्या करना चाहते हैं, बोलकर या लिखकर बताएं।"
        },
        spokenPrompt: {
          en: "How can I help guide you on this page?",
          hi: "मैं इस पेज पर आपकी क्या मदद कर सकता हूँ?"
        },
        targetElementSelector: '#custom-query-input',
        targetElementName: { en: 'Voice/Text Input', hi: 'आवाज़ / टेक्स्ट बॉक्स' },
        expectedAction: 'input',
        riskLevel: 'low'
      }
    ]
  }
};
