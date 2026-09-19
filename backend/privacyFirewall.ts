import { RedactionResult } from '../shared/types.ts';

export class PrivacyFirewall {
  /**
   * Redacts sensitive personal and financial data from user text, screen extracts, and DOM trees.
   */
  public static redactSensitiveData(input: string): RedactionResult {
    if (!input || typeof input !== 'string') {
      return { cleanedText: '', cleanText: '', hasRedactions: false, redactedCount: 0, redactedTypes: [] };
    }

    let cleaned = input;
    const typesFound = new Set<string>();
    let count = 0;

    // 1. Redact OTPs (e.g. OTP: 489201, otp is 1234, code 592819)
    const otpRegex = /\b(?:otp|one[-\s]?time[-\s]?password|code|verification[-\s]?code)\s*[:=is-]*\s*([0-9]{4,8})\b/gi;
    cleaned = cleaned.replace(otpRegex, (match) => {
      typesFound.add('OTP');
      count++;
      return match.replace(/[0-9]{4,8}/, '••••••');
    });

    // 2. Redact PINs & UPI PINs
    const pinRegex = /\b(?:pin|upi[-\s]?pin|mpin|secret[-\s]?pin)\s*[:=is-]*\s*([0-9]{4,6})\b/gi;
    cleaned = cleaned.replace(pinRegex, (match) => {
      typesFound.add('PIN');
      count++;
      return match.replace(/[0-9]{4,6}/, '••••');
    });

    // 3. Redact CVV / CVC
    const cvvRegex = /\b(?:cvv|cvc|security[-\s]?code)\s*[:=is-]*\s*([0-9]{3,4})\b/gi;
    cleaned = cleaned.replace(cvvRegex, (match) => {
      typesFound.add('CVV');
      count++;
      return match.replace(/[0-9]{3,4}/, '•••');
    });

    // 4. Redact 16-digit Credit/Debit card numbers (with or without dashes/spaces)
    const cardRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
    cleaned = cleaned.replace(cardRegex, (match) => {
      // Keep only last 4 digits for senior verification
      const digits = match.replace(/[-\s]/g, '');
      if (digits.length === 16) {
        typesFound.add('Card Number');
        count++;
        return `•••• •••• •••• ${digits.slice(12)}`;
      }
      return match;
    });

    // 5. Redact Indian Aadhaar Number (12 digits in groups of 4: 1234 5678 9012)
    const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/g;
    cleaned = cleaned.replace(aadhaarRegex, (match) => {
      typesFound.add('Aadhaar ID');
      count++;
      return 'XXXX-XXXX-XXXX';
    });

    // 6. Redact Indian PAN Card format (5 uppercase letters, 4 digits, 1 letter)
    const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
    cleaned = cleaned.replace(panRegex, () => {
      typesFound.add('PAN');
      count++;
      return 'XXXXX••••X';
    });

    // 7. Redact Bank Account numbers (9 to 18 digits preceded by account/a/c)
    const acRegex = /\b(?:a\/c|acc|account|acct)\s*(?:no\.?|num|number)?\s*[:=is-]*\s*([0-9]{9,18})\b/gi;
    cleaned = cleaned.replace(acRegex, (match, digits) => {
      typesFound.add('Bank Account');
      count++;
      const last4 = digits.slice(-4);
      return match.replace(digits, `••••••••${last4}`);
    });

    // 8. Redact Passwords / Passcodes
    const pwdRegex = /\b(?:password|passwd|pwd)\s*[:=is-]*\s*(\S+)/gi;
    cleaned = cleaned.replace(pwdRegex, (match, pwd) => {
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
    return elements.map(el => {
      const isSensitiveField = /(password|pin|cvv|otp|card|account|aadhaar|pan)/i.test(
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
