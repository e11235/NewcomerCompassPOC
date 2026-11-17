import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import type { LanguageCode, Localized } from '../content/types';
import { EXTRA_STRINGS } from './extra-strings';
import { UI_STRINGS } from './ui-strings';

const STORAGE_KEY = 'nc-language';

/** Languages offered, each labelled in its own language. */
export const LANGUAGES: readonly { code: LanguageCode; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

/** BCP 47 locale for number and date formatting. */
export const LOCALES: Record<LanguageCode, string> = { en: 'en-CA', fr: 'fr-CA', ar: 'ar' };

/** The current language, its direction, and its strings. Remembered across reloads. */
@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<LanguageCode>(this.loadSaved() ?? 'en');
  /** True once someone has picked a language (now or on an earlier visit). */
  readonly chosen = signal(this.loadSaved() !== null);
  readonly dir = computed(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly t = computed(() => ({ ...UI_STRINGS[this.lang()], ...EXTRA_STRINGS[this.lang()] }));

  constructor() {
    effect(() => {
      const html = this.document.documentElement;
      html.lang = this.lang();
      html.dir = this.dir();
    });
  }

  setLang(lang: LanguageCode): void {
    this.lang.set(lang);
    this.chosen.set(true);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage unavailable (e.g. private mode): the choice just won't persist.
    }
  }

  /** Picks the current language's text. */
  pick(text: Localized | undefined | null): string {
    return text ? text[this.lang()] : '';
  }

  private loadSaved(): LanguageCode | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return LANGUAGES.some((l) => l.code === saved) ? (saved as LanguageCode) : null;
    } catch {
      return null;
    }
  }
}
