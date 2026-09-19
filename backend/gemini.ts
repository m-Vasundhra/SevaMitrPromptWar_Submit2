import { GoogleGenAI, Type } from "@google/genai";
import { PrivacyFirewall } from "./privacyFirewall.ts";
import { AssistantResponse, ScamAnalysisResult, Language } from "../shared/types.ts";

// Resilient Model Ladder
const MODEL_LADDER = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.7-flash"
];

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

/**
 * Resilient content generation helper that cascades through fallback models with strict per-attempt timeouts.
 */
export async function generateWithFallback(
  contents: any,
  config: any = {}
): Promise<string> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  let lastError: any = null;

  for (const model of MODEL_LADDER) {
    try {
      // Timeout promise to ensure fast failure and non-blocking Express threads
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Model ${model} request timed out after 7000ms`)), 7000);
      });

      const generationPromise = ai.models.generateContent({
        model,
        contents,
        config: {
          ...config,
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        }
      });

      const response = await Promise.race([generationPromise, timeoutPromise]);

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini Fallback Ladder] Model ${model} encountered error:`, err?.message || err);
      lastError = err;
      // Continue to next fallback in ladder
    }
  }

  throw lastError || new Error("All Gemini fallback models exhausted.");
}

/**
 * Generates senior companion guidance given voice/text query, screen context, and task state.
 */
export async function generateCompanionGuidance(params: {
  userQuery: string;
  language: Language;
  domain: string;
  pageContext: string;
  activeStepName?: string;
  riskLevel: string;
  completedSteps: string[];
}): Promise<AssistantResponse> {
  // 1. Redact any sensitive information through privacy firewall
  const { cleanedText: sanitizedQuery } = PrivacyFirewall.redactSensitiveData(params.userQuery);
  const { cleanedText: sanitizedContext } = PrivacyFirewall.redactSensitiveData(params.pageContext);

  const lang = params.language === 'hi' ? 'Hindi (natural, respectful, simple conversational Hindi for senior citizens)' : 'English (clear, patient, simple)';

  const systemInstruction = `You are SevaMitr, a patient, warm, and highly respectful AI digital companion designed specifically for senior citizens.
Your philosophy is: "Don't replace the senior. Empower the senior."
Rules:
1. Explain only ONE next step at a time simply. Never give a 10-step list.
2. If language is Hindi, speak in natural, respectful Hindi using familiar terms like 'पासवर्ड', 'OTP', 'पेमेंट', 'टिकट', 'फ्लाइट' rather than difficult translations.
3. NEVER ask for passwords, OTPs, PINs, or CVVs.
4. If this is a high-risk action (like sending money or payment), include a gentle reminder for the senior to verify details.
5. Return your response as a valid JSON object matching the requested schema.`;

  const prompt = `User Request: "${sanitizedQuery}"
Language: ${lang}
Current Website/Domain: ${params.domain}
Screen / Form Context: ${sanitizedContext}
Active Step: ${params.activeStepName || 'Initial exploration'}
Completed Steps: ${params.completedSteps.join(', ') || 'None'}
Risk Level: ${params.riskLevel}

Respond with a structured JSON object with:
- intent: string (e.g. 'book_train', 'book_flight', 'net_banking', 'scam_check', 'help')
- current_step: string
- message: string (short, warm, one-step instruction)
- spoken_message: string (audio-friendly short version)
- next_action: 'highlight_element' | 'wait_for_user' | 'show_warning' | 'task_complete'
- target: string (CSS selector or element name like '#input-origin')
- risk_level: 'low' | 'medium' | 'high'
- requires_confirmation: boolean
- explanation: string (optional gentle explanation of digital terms if relevant)
- suggested_chips: array of 2-3 short quick question options for the senior (in ${params.language === 'hi' ? 'Hindi' : 'English'})`;

  try {
    const rawText = await generateWithFallback(prompt, {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.3
    });

    const parsed = JSON.parse(rawText);
    return {
      intent: parsed.intent || 'general_help',
      current_step: parsed.current_step || params.activeStepName || 'step_1',
      message: parsed.message || (params.language === 'hi' ? 'मैं आपकी सहायता के लिए तैयार हूँ।' : 'I am here to guide you.'),
      spoken_message: parsed.spoken_message || parsed.message,
      next_action: parsed.next_action || 'highlight_element',
      target: parsed.target || '#input-origin',
      risk_level: parsed.risk_level || 'low',
      requires_confirmation: Boolean(parsed.requires_confirmation),
      explanation: parsed.explanation,
      suggested_chips: parsed.suggested_chips || (params.language === 'hi' ? ['अगला कदम क्या है?', 'क्या यह सुरक्षित है?'] : ['What is next step?', 'Is this safe?'])
    };
  } catch (error) {
    console.warn("Using offline rule-based fallback for companion guidance:", error);
    if (params.language === 'hi') {
      return {
        intent: 'general_guidance',
        current_step: params.activeStepName || 'origin',
        message: "मैं आपके साथ हूँ। सबसे पहले हाइलाइट किए गए बॉक्स में जानकारी भरें।",
        spoken_message: "सबसे पहले हाइलाइट किए गए बॉक्स में जानकारी भरें।",
        next_action: 'highlight_element',
        target: '#input-origin',
        risk_level: 'low',
        requires_confirmation: false,
        suggested_chips: ['मुझे रास्ता दिखाएँ', 'क्या यह सुरक्षित है?']
      };
    } else {
      return {
        intent: 'general_guidance',
        current_step: params.activeStepName || 'origin',
        message: "I am right here with you. Please enter the required details in the highlighted box.",
        spoken_message: "Please enter the required details in the highlighted box.",
        next_action: 'highlight_element',
        target: '#input-origin',
        risk_level: 'low',
        requires_confirmation: false,
        suggested_chips: ['Guide me', 'Is this safe?']
      };
    }
  }
}

/**
 * Analyzes suspicious messages (SMS, WhatsApp, lottery, electric bills) for scam indicators.
 */
export async function analyzeScamMessage(params: {
  text: string;
  sourceType: string;
  language: Language;
}): Promise<ScamAnalysisResult> {
  const { cleanedText, redactedCount, redactedTypes } = PrivacyFirewall.redactSensitiveData(params.text);

  const systemInstruction = `You are SevaMitr Cyber Safety Analyzer for senior citizens.
Analyze the provided message/SMS/WhatsApp alert for fraud and scam characteristics (urgency, threats of electricity cutoff, lottery claims, requests for OTP/PIN, unknown APK downloads, suspicious links).
Important Guidelines:
1. Do not present the judgment with absolute aggressive panic; explain calmly with phrases like "Possible scam indicators detected" or "Be careful".
2. Clearly explain WHY with non-technical, simple reasons.
3. Recommend safe actions (e.g. "Do not click link or share OTP. Contact your bank or official electricity board office directly.").
4. Return JSON only matching the schema.`;

  const prompt = `Language: ${params.language}
Source Type: ${params.sourceType}
Message Content (Shielded): "${cleanedText}"

Return JSON:
{
  "risk": "high" | "medium" | "low",
  "confidence": "high" | "medium" | "low",
  "summary": string,
  "indicators": string[],
  "recommended_action": string,
  "why_explanation": string
}`;

  try {
    const rawText = await generateWithFallback(prompt, {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const parsed = JSON.parse(rawText);
    const riskVal = (parsed.risk || parsed.risk_level || 'high') as 'low' | 'medium' | 'high';
    return {
      risk_level: riskVal,
      risk: riskVal,
      confidence_score: typeof parsed.confidence_score === 'number' ? parsed.confidence_score : 92,
      confidence: (parsed.confidence || 'high') as 'high' | 'medium' | 'low',
      category: parsed.category || 'Urgent Scam Warning',
      summary: parsed.summary || (params.language === 'hi' ? 'इस संदेश में संदिग्ध धोखाधड़ी के लक्षण पाए गए हैं।' : 'Suspicious scam characteristics detected.'),
      indicators: parsed.indicators || [
        params.language === 'hi' ? 'तत्काल बिजली कटने या खाते ब्लॉक होने की झूठी जल्दीबाज़ी' : 'Artificial urgency or threats of disconnection',
        params.language === 'hi' ? 'अपरिचित नंबर या अनजान लिंक पर क्लिक करने का दबाव' : 'Pressure to click unverified links or call personal numbers'
      ],
      recommended_action: parsed.recommended_action || (params.language === 'hi' ? 'लिंक पर क्लिक न करें और किसी को कोई OTP या पैसे न भेजें।' : 'Do not click the link and never share OTP or PIN.'),
      why_explanation: parsed.why_explanation || (params.language === 'hi' ? 'असली सरकारी या बैंक संस्थाएं इस तरह व्यक्तिगत नंबरों से धमकी भरे संदेश नहीं भेजती हैं।' : 'Official departments never send threatening messages from personal numbers requesting immediate action.'),
      redacted_preview: cleanedText
    };
  } catch (err) {
    // Intelligent rule-based fallback if AI is unreachable
    const isHighRisk = /(bill|cutoff|lottery|winner|kyc|block|apk|link|urgent|otp|pin|congratulations|prize)/i.test(params.text);
    const riskLevelVal: 'high' | 'low' = isHighRisk ? 'high' : 'low';
    if (params.language === 'hi') {
      return {
        risk_level: riskLevelVal,
        risk: riskLevelVal,
        confidence_score: isHighRisk ? 90 : 75,
        confidence: 'medium',
        category: isHighRisk ? 'संदिग्ध वित्तीय चेतावनी' : 'सामान्य संदेश',
        summary: isHighRisk ? 'संभावित धोखा: इस संदेश में डर दिखाने और तुरंत पैसे ऐंठने के लक्षण हैं।' : 'संदेश सामान्य प्रतीत होता है, फिर भी सावधानी रखें।',
        indicators: isHighRisk ? [
          'तुरंत बिजली कटने या लॉटरी जीतने का लालच/धमकी',
          'अपरिचित मोबाइल नंबर पर कॉल करने का दबाव',
          'सरकारी अधिकारी होने का झूठा दावा'
        ] : ['कोई स्पष्ट संदिग्ध लिंक नहीं मिला'],
        recommended_action: isHighRisk ? 'इस नंबर पर कॉल न करें और न ही कोई लिंक खोलें।' : 'हमेशा आधिकारिक वेबसाइट से ही पुष्टि करें।',
        why_explanation: isHighRisk ? 'धोखेबाज अक्सर डर पैदा करके जल्दबाजी में पैसे या ओटीपी मांगते हैं।' : 'संदेश सुरक्षित लग रहा है।',
        redacted_preview: cleanedText
      };
    } else {
      return {
        risk_level: riskLevelVal,
        risk: riskLevelVal,
        confidence_score: isHighRisk ? 90 : 75,
        confidence: 'medium',
        category: isHighRisk ? 'Suspicious Urgency / Phishing' : 'General Communication',
        summary: isHighRisk ? 'Potential scam indicators detected. The message creates artificial urgency.' : 'Message appears relatively safe, but always remain vigilant.',
        indicators: isHighRisk ? [
          'Threatening disconnection or claiming unrealistic lottery prize',
          'Urging contact on unofficial personal phone numbers',
          'Suspicious urgency designed to cause panic'
        ] : ['No blatant phishing markers detected'],
        recommended_action: isHighRisk ? 'Do not click links or call the phone number in the SMS.' : 'Always verify directly with official customer service.',
        why_explanation: isHighRisk ? 'Scammers routinely exploit panic to pressure seniors into transferring money or downloading remote access apps.' : 'Clean context.',
        redacted_preview: cleanedText
      };
    }
  }
}
