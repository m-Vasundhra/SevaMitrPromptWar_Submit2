import { RedactionResult } from '../shared/types.ts';

// Pre-compiled regex patterns to avoid recompiling on every invocation
const OTP_REGEX = /\b(?:otp|one[-\s]?time[-\s]?password|code|verification[-\s]?code)\s*[:=is-]*\s*([0-9]{4,8})\b/gi;
const PIN_REGEX = /\b(?:pin|upi[-\s]?pin|mpin|secret[-\s]?pin)\s*[:=is-]*\s*([0-9]{4,6})\b/gi;
const CVV_REGEX = /\b(?:cvv|cvc|security[-\s]?code)\s*[:=is-]*\s*([0-9]{3,4})\b/gi;
const CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
const AADHAAR_REGEX = /\b\d{4}\s\d{4}\s\d{4}\b/g;
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
const AC_REGEX = /\b(?:a\/c|acc|account|acct)\s*(?:no\.?|num|number)?\s*[:=is-]*\s*([0-9]{9,18})\b/gi;
const PWD_REGEX = /\b(?:password|passwd|pwd)\s*[:=is-]*\s*(\S+)/gi;
const SENSITIVE_FIELD_REGEX = /(password|pin|cvv|otp|card|account|aadhaar|pan)/i;

export class PrivacyFirewall {
  /**
   * Fast, secure redaction of sensitive personal and financial data.
   */
  public static redactSensitiveData(input: string): RedactionResult {
    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return { cleanedText: '', cleanText: '', hasRedactions: false, redactedCount: 0, redactedTypes: [] };
    }

    let cleaned = input;
    const typesFound = new Set<string>();
    let count = 0;

    // 1. Redact OTPs
    cleaned = cleaned.replace(OTP_REGEX, (match) => {
      typesFound.add('OTP');
      count++;
      return match.replace(/[0-9]{4,8}/, '••••••');
    });

    // 2. Redact PINs
    cleaned = cleaned.replace(PIN_REGEX, (match) => {
      typesFound.add('PIN');
      count++;
      return match.replace(/[0-9]{4,6}/, '••••');
    });

    // 3. Redact CVV / CVC
    cleaned = cleaned.replace(CVV_REGEX, (match) => {
      typesFound.add('CVV');
      count++;
      return match.replace(/[0-9]{3,4}/, '•••');
    });

    // 4. Redact 16-digit Card numbers
    cleaned = cleaned.replace(CARD_REGEX, (match) => {
      const digits = match.replace(/[-\s]/g, '');
      if (digits.length === 16) {
        typesFound.add('Card Number');
        count++;
        return `•••• •••• •••• ${digits.slice(12)}`;
      }
      return match;
    });

    // 5. Redact Indian Aadhaar Number
    cleaned = cleaned.replace(AADHAAR_REGEX, () => {
      typesFound.add('Aadhaar ID');
      count++;
      return 'XXXX-XXXX-XXXX';
    });

    // 6. Redact Indian PAN Card format
    cleaned = cleaned.replace(PAN_REGEX, () => {
      typesFound.add('PAN');
      count++;
      return 'XXXXX••••X';
    });

    // 7. Redact Bank Account numbers
    cleaned = cleaned.replace(AC_REGEX, (match, digits) => {
      typesFound.add('Bank Account');
      count++;
      const last4 = digits.slice(-4);
      return match.replace(digits, `••••••••${last4}`);
    });

    // 8. Redact Passwords
    cleaned = cleaned.replace(PWD_REGEX, (match, pwd) => {
      typesFound.add('Password');
      count++;
      return match.replace(pwd, '••••••••');
    });

    return {
      cleanedText: cleaned,
      cleanText: cleaned,
      hasRedactions: count > 0,
      redactedCount: count,
      redactedTypes: Array.from(typesFound)
    };
  }

  /**
   * Sanitizes DOM tree or field metadata before passing to screen analysis.
   */
  public static sanitizeDomElements(elements: Array<{ selector: string; text?: string; placeholder?: string; value?: string; name?: string }>) {
    if (!Array.isArray(elements) || elements.length === 0) {
      return [];
    }

    return elements.map(el => {
      const isSensitiveField = SENSITIVE_FIELD_REGEX.test(
        `${el.selector} ${el.name || ''} ${el.placeholder || ''}`
      );

      return {
        ...el,
        value: isSensitiveField ? '••••••••' : (el.value ? this.redactSensitiveData(el.value).cleanedText : undefined),
        text: el.text ? this.redactSensitiveData(el.text).cleanedText : undefined,
        placeholder: el.placeholder ? this.redactSensitiveData(el.placeholder).cleanedText : undefined
      };
    });
  }
}
