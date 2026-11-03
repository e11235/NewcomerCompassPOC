import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { LANGUAGES, LanguageCode, PageKey, TRANSLATIONS } from './translations';

const STORAGE_KEY = 'nc-language';

/**
 * The app's current language. Lives at the root, so the choice made on the
 * questionnaire carries over to the results page (and is remembered across reloads).
 */
@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly document = inject(DOCUMENT);

  readonly languages = LANGUAGES;
  readonly lang = signal<LanguageCode>(this.loadSaved());
  readonly dir = computed(() => LANGUAGES.find((l) => l.code === this.lang())!.dir);
  /** Strings for the current language: `t().questionnaire.title`, etc. */
  readonly t = computed(() => TRANSLATIONS[this.lang()]);

  constructor() {
    effect(() => {
      const html = this.document.documentElement;
      html.lang = this.lang();
      html.dir = this.dir();
      try {
        localStorage.setItem(STORAGE_KEY, this.lang());
      } catch {
        // Storage unavailable (e.g. private mode): the choice just won't persist.
      }
    });
  }

  private loadSaved(): LanguageCode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGUAGES.some((l) => l.code === saved)) {
        return saved as LanguageCode;
      }
    } catch {
      // Fall through to the default.
    }
    return 'en';
  }
}

/**
 * Route `title`s are page keys; this turns them into translated browser-tab
 * titles and re-applies them when the language changes.
 */
@Injectable({ providedIn: 'root' })
export class I18nTitleStrategy extends TitleStrategy {
  private readonly i18n = inject(I18n);
  private readonly title = inject(Title);
  private readonly page = signal<PageKey | undefined>(undefined);

  constructor() {
    super();
    effect(() => {
      const page = this.page();
      const t = this.i18n.t();
      this.title.setTitle(page ? `${t.brand} – ${t.pageTitles[page]}` : t.brand);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.page.set(this.buildTitle(snapshot) as PageKey | undefined);
  }
}
