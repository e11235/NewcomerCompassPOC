import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import type { LanguageCode } from '../../content/types';
import { EXTRA_STRINGS } from '../../i18n/extra-strings';
import { I18n } from '../../i18n/i18n';
import { LogoMark } from '../../shared/logo';

interface Greeting {
  text: string;
  lang: string;
  /** Position on wide screens, in % of the stage. */
  x: number;
  y: number;
  size: number;
  rotate: number;
  color: string;
  /** Set on the greetings that pick a site language when clicked. */
  choose?: LanguageCode;
}

const NAVY = '#062748';
const ORANGE = '#d9590f';
const TEAL = '#0d706a';
const BLUE = '#1969a3';
const PLUM = '#8b1d5e';
const GREEN = '#1f6b3a';

/**
 * "Hello" in languages spoken by many newcomers to Canada, laid out around the
 * logo as in ref/language 1.png. Every greeting highlights on hover; only the
 * English, French and Arabic ones are buttons that pick the site language.
 */
const GREETINGS: Greeting[] = [
  { text: 'Hello', lang: 'en', x: 9, y: 8, size: 2.4, rotate: -6, color: NAVY, choose: 'en' },
  { text: 'Bonjour', lang: 'fr', x: 28, y: 6, size: 2.1, rotate: 4, color: PLUM, choose: 'fr' },
  { text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', lang: 'pa', x: 50, y: 4, size: 1.7, rotate: -2, color: GREEN },
  { text: '你好', lang: 'zh', x: 70, y: 7, size: 2.3, rotate: -4, color: ORANGE },
  { text: 'Hola', lang: 'es', x: 89, y: 8, size: 2.5, rotate: -8, color: TEAL },
  { text: 'Cześć', lang: 'pl', x: 8, y: 25, size: 1.5, rotate: -3, color: TEAL },
  { text: 'નમસ્તે', lang: 'gu', x: 10, y: 39, size: 1.8, rotate: -5, color: PLUM },
  { text: 'नमस्ते', lang: 'hi', x: 9, y: 53, size: 1.9, rotate: 3, color: GREEN },
  { text: 'Xin chào', lang: 'vi', x: 10, y: 67, size: 1.6, rotate: -6, color: ORANGE },
  { text: '안녕하세요', lang: 'ko', x: 11, y: 81, size: 1.6, rotate: -3, color: BLUE },
  { text: 'مرحبا', lang: 'ar', x: 90, y: 24, size: 2.1, rotate: 4, color: PLUM, choose: 'ar' },
  { text: 'Kumusta', lang: 'tl', x: 89, y: 38, size: 1.6, rotate: -4, color: BLUE },
  { text: 'வணக்கம்', lang: 'ta', x: 89, y: 52, size: 1.5, rotate: 2, color: PLUM },
  { text: 'سلام', lang: 'fa', x: 91, y: 66, size: 2.1, rotate: -5, color: GREEN },
  { text: 'Hallo', lang: 'de', x: 89, y: 80, size: 2.2, rotate: -4, color: ORANGE },
  { text: 'السلام عليكم', lang: 'ar', x: 23, y: 94, size: 1.6, rotate: -7, color: PLUM, choose: 'ar' },
  { text: 'Olá', lang: 'pt', x: 42, y: 95, size: 2.1, rotate: -3, color: TEAL },
  { text: 'Ciao', lang: 'it', x: 59, y: 95, size: 2.0, rotate: -5, color: PLUM },
  { text: 'Здравствуйте', lang: 'ru', x: 79, y: 94, size: 1.6, rotate: -3, color: NAVY },
];

/** Shared look for one greeting; buttons add a pointer and a focus ring. */
const WORD =
  'inline-block rounded-2xl px-3 py-1 font-extrabold whitespace-nowrap transition-[scale,background-color,box-shadow] duration-200 hover:scale-115 hover:bg-white hover:shadow-lg';
const BUTTON =
  'cursor-pointer focus-visible:scale-115 focus-visible:bg-white focus-visible:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring';

/**
 * First page: choose a language. The logo mark sits in the middle of a ring of
 * greetings; clicking the English, French or Arabic greeting picks that language.
 */
@Component({
  selector: 'app-welcome',
  imports: [NgTemplateOutlet, LogoMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #greeting let-g let-scale="scale">
      @if (g.choose) {
        <button
          type="button"
          [attr.lang]="g.lang"
          [attr.dir]="g.lang === 'ar' ? 'rtl' : null"
          [attr.aria-label]="labelFor(g)"
          (click)="choose(g.choose)"
          [class]="word + ' ' + button"
          [style.color]="g.color"
          [style.font-size.rem]="g.size * scale"
        >
          {{ g.text }}
        </button>
      } @else {
        <span aria-hidden="true" [attr.lang]="g.lang" [class]="word" [style.color]="g.color" [style.font-size.rem]="g.size * scale">
          {{ g.text }}
        </span>
      }
    </ng-template>

    <section
      aria-labelledby="welcome-title"
      class="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_#ffffff_38%,_#f4f6f9_100%)]"
    >
      <h1 id="welcome-title" class="sr-only">Newcomer Compass</h1>

      <!-- Small screens: greetings wrap above and below the logo. -->
      <div class="flex flex-col items-center gap-6 px-4 py-8 lg:hidden">
        <ul class="flex max-w-xl flex-wrap items-center justify-center gap-x-1 gap-y-1">
          @for (g of topBand; track g.text) {
            <li><ng-container *ngTemplateOutlet="greeting; context: { $implicit: g, scale: 0.75 }" /></li>
          }
        </ul>
        <app-logo-mark label="Newcomer Compass" class="size-32 animate-[nc-float_6s_ease-in-out_infinite] sm:size-40" />
        <ul class="flex max-w-xl flex-wrap items-center justify-center gap-x-1 gap-y-1">
          @for (g of bottomBand; track g.text) {
            <li><ng-container *ngTemplateOutlet="greeting; context: { $implicit: g, scale: 0.75 }" /></li>
          }
        </ul>
      </div>

      <!-- Wide screens: a ring of greetings around the logo, which sits dead centre. -->
      <div class="relative hidden min-h-[46rem] lg:block">
        <div class="absolute top-1/2 left-1/2 isolate -translate-x-1/2 -translate-y-1/2">
          <span class="absolute inset-0 -z-10 scale-125 rounded-full bg-white blur-2xl" aria-hidden="true"></span>
          <app-logo-mark label="Newcomer Compass" class="relative size-48 animate-[nc-float_6s_ease-in-out_infinite]" />
        </div>
        <ul>
          @for (g of greetings; track g.text; let i = $index) {
            <li
              class="absolute -translate-x-1/2 -translate-y-1/2 animate-[nc-fade-in_700ms_ease-out_both]"
              [style.left.%]="g.x"
              [style.top.%]="g.y"
              [style.rotate]="g.rotate + 'deg'"
              [style.animation-delay]="i * 45 + 'ms'"
            >
              <ng-container *ngTemplateOutlet="greeting; context: { $implicit: g, scale: 1.35 }" />
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class Welcome {
  protected readonly i18n = inject(I18n);
  private readonly router = inject(Router);
  protected readonly greetings = GREETINGS;
  /** Small screens: split so the logo sits in the middle, with all three choosable greetings near the top. */
  protected readonly topBand = GREETINGS.filter((g) => g.choose).concat(GREETINGS.filter((g) => !g.choose).slice(0, 6));
  protected readonly bottomBand = GREETINGS.filter((g) => !g.choose).slice(6);
  protected readonly word = WORD;
  protected readonly button = BUTTON;
  protected readonly continueIn: Record<LanguageCode, string> = {
    en: EXTRA_STRINGS.en.continueIn,
    fr: EXTRA_STRINGS.fr.continueIn,
    ar: EXTRA_STRINGS.ar.continueIn,
  };

  protected labelFor(g: Greeting): string | null {
    return g.choose ? this.continueIn[g.choose] : null;
  }

  choose(lang: LanguageCode): void {
    this.i18n.setLang(lang);
    void this.router.navigateByUrl('/compass');
  }
}
