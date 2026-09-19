import { en } from './en.ts';
import { hi } from './hi.ts';
import { Language } from '../types.ts';

export const translations = {
  en,
  hi,
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}
