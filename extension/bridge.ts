import { PrivacyFirewall } from '../backend/privacyFirewall.ts';
import { AssistantResponse, RiskLevel } from '../shared/types.ts';

export interface ExtensionMessage {
  type: 'DOM_EXTRACT' | 'HIGHLIGHT_ELEMENT' | 'REMOVE_HIGHLIGHT' | 'SHOW_GUIDE_OVERLAY' | 'VERIFY_USER_ACTION';
  payload?: any;
}

export class BrowserExtensionBridge {
  /**
   * Content Script Inspector: Extracts DOM elements while filtering password/credential fields.
   */
  public static extractSafePageContext(containerDocument: Document = document) {
    const inputs = Array.from(containerDocument.querySelectorAll('input, select, textarea, button, [role="button"]'));
    
    const elements = inputs.map((el, idx) => {
      const htmlEl = el as HTMLElement;
      const inputEl = el as HTMLInputElement;
      const tag = htmlEl.tagName.toLowerCase();
      const selector = htmlEl.id ? `#${htmlEl.id}` : (htmlEl.getAttribute('name') ? `[name="${htmlEl.getAttribute('name')}"]` : `${tag}:nth-of-type(${idx+1})`);
      
      const type = inputEl.type || '';
      const isPassword = type === 'password';
      const placeholder = inputEl.placeholder || '';
      const text = htmlEl.innerText || htmlEl.textContent || '';
      const value = isPassword ? '••••••••' : (inputEl.value || '');

      return {
        selector,
        tag,
        type,
        placeholder,
        text: text.slice(0, 100),
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
  public static highlightElement(selector: string, message: string): boolean {
    // Clear existing highlights
    this.removeHighlight();

    const target = document.querySelector(selector) as HTMLElement;
    if (!target) {
      console.warn(`[Extension Bridge] Target element not found: ${selector}`);
      return false;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('saarthi-highlight-pulse');
    target.setAttribute('aria-current', 'step');

    return true;
  }

  public static removeHighlight() {
    const prev = document.querySelectorAll('.saarthi-highlight-pulse');
    prev.forEach(el => {
      el.classList.remove('saarthi-highlight-pulse');
      el.removeAttribute('aria-current');
    });
  }
}
