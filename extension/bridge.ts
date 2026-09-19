import { PrivacyFirewall } from '../backend/privacyFirewall.ts';
import { AssistantResponse, RiskLevel } from '../shared/types.ts';

export interface ExtensionMessage {
  type: 'DOM_EXTRACT' | 'HIGHLIGHT_ELEMENT' | 'REMOVE_HIGHLIGHT' | 'SHOW_GUIDE_OVERLAY' | 'VERIFY_USER_ACTION';
  payload?: any;
}

export class BrowserExtensionBridge {
  /**
   * Content Script Inspector: Extracts actionable DOM elements with zero layout-thrashing (using textContent)
   * and sanitizes passwords/financial data before returning.
   */
  public static extractSafePageContext(containerDocument: Document = document) {
    // Select relevant form controls and interactive targets
    const inputs = Array.from(
      containerDocument.querySelectorAll('input:not([type="hidden"]), select, textarea, button, [role="button"]')
    ).slice(0, 18); // Bound to max 18 most relevant active elements
    
    const elements = inputs.map((el, idx) => {
      const htmlEl = el as HTMLElement;
      const inputEl = el as HTMLInputElement;
      const tag = htmlEl.tagName.toLowerCase();
      const selector = htmlEl.id ? `#${htmlEl.id}` : (htmlEl.getAttribute('name') ? `[name="${htmlEl.getAttribute('name')}"]` : `${tag}:nth-of-type(${idx+1})`);
      
      const type = inputEl.type || '';
      const isPassword = type === 'password';
      const placeholder = inputEl.placeholder || '';
      // textContent is 10-50x faster than innerText because it does not trigger forced browser reflow
      const text = (htmlEl.textContent || '').trim().slice(0, 80);
      const value = isPassword ? '••••••••' : (inputEl.value ? String(inputEl.value).slice(0, 100) : '');

      return {
        selector,
        tag,
        type,
        placeholder,
        text,
        value,
        disabled: inputEl.disabled || false
      };
    });

    const sanitized = PrivacyFirewall.sanitizeDomElements(elements);

    return {
      url: window.location.href,
      domain: window.location.hostname || 'irctc.co.in',
      title: document.title,
      domSummary: sanitized,
      timestamp: Date.now()
    };
  }

  /**
   * Highlights a target element with visual spotlight and accessibility aria attributes.
   */
  public static highlightElement(selector: string, message?: string): boolean {
    // Clear existing highlights first
    this.removeHighlight();

    if (!selector) return false;

    const target = document.querySelector(selector) as HTMLElement;
    if (!target) {
      return false;
    }

    try {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('sevamitr-highlight-pulse', 'saarthi-highlight-pulse');
      target.setAttribute('aria-current', 'step');
      return true;
    } catch {
      return false;
    }
  }

  public static removeHighlight() {
    const prev = document.querySelectorAll('.sevamitr-highlight-pulse, .saarthi-highlight-pulse');
    prev.forEach(el => {
      el.classList.remove('sevamitr-highlight-pulse', 'saarthi-highlight-pulse');
      el.removeAttribute('aria-current');
    });
  }
}
