import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { LanguageCode } from '../../content/types';
import { EXTRA_STRINGS } from '../../i18n/extra-strings';
import { I18n } from '../../i18n/i18n';
import { LogoMark } from '../../shared/logo';

interface Greeting {
  text: string;
  lang: string;
  /** Position on wide screens, in % of the stage around the logo. */
  x: number;
  y: number;
  /** Font size on wide screens, in rem. */
  size: number;
  rotate: number;
  color: string;
  /** Set on the greetings that pick a site language when clicked. */
  choose?: LanguageCode;
  /** Hug the logo: sit beside it, a fixed distance from its edge, whatever the screen width (replaces x). */
  beside?: 'left' | 'right';
}

const NAVY = '#062748';
const ORANGE = '#d9590f';
const TEAL = '#0d706a';
const BLUE = '#1969a3';
const PLUM = '#8b1d5e';
const GREEN = '#1f6b3a';

/**
 * "Hello" in languages spoken by many newcomers to Canada, laid out around the
 * logo. Hello, Bonjour and مرحبا are the biggest and sit right beside the logo;
 * they (and السلام عليكم) are buttons that pick the site language.
 */
const GREETINGS: Greeting[] = [
  { text: 'Hello', lang: 'en', x: 0, beside: 'left', y: 49, size: 3.8, rotate: -4, color: NAVY, choose: 'en' },
  { text: 'Bonjour', lang: 'fr', x: 0, beside: 'right', y: 49, size: 3.6, rotate: 3, color: PLUM, choose: 'fr' },
  { text: 'مرحبا', lang: 'ar', x: 50, y: 82, size: 3.6, rotate: -2, color: TEAL, choose: 'ar' },
  { text: '你好', lang: 'zh', x: 14, y: 14, size: 2.6, rotate: -4, color: ORANGE },
  { text: 'Hola', lang: 'es', x: 32, y: 19, size: 2.5, rotate: -8, color: TEAL },
  { text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', lang: 'pa', x: 50, y: 9, size: 1.9, rotate: -2, color: GREEN },
  { text: 'Cześć', lang: 'pl', x: 68, y: 19, size: 1.9, rotate: -3, color: TEAL },
  { text: 'Hallo', lang: 'de', x: 86, y: 14, size: 2.4, rotate: -4, color: ORANGE },
  { text: 'नमस्ते', lang: 'hi', x: 8, y: 38, size: 2.2, rotate: 3, color: GREEN },
  { text: 'નમસ્તે', lang: 'gu', x: 9, y: 62, size: 2.0, rotate: -5, color: PLUM },
  { text: '안녕하세요', lang: 'ko', x: 27, y: 70, size: 1.7, rotate: -3, color: BLUE },
  { text: 'سلام', lang: 'fa', x: 93, y: 37, size: 2.3, rotate: -5, color: GREEN },
  { text: 'Ciao', lang: 'it', x: 93, y: 62, size: 2.2, rotate: -5, color: PLUM },
  { text: 'வணக்கம்', lang: 'ta', x: 73, y: 71, size: 1.7, rotate: 2, color: PLUM },
  { text: 'Xin chào', lang: 'vi', x: 13, y: 87, size: 1.8, rotate: -6, color: ORANGE },
  { text: 'Olá', lang: 'pt', x: 30, y: 91, size: 2.2, rotate: -3, color: TEAL },
  { text: 'السلام عليكم', lang: 'ar', x: 50, y: 97, size: 1.7, rotate: -3, color: PLUM, choose: 'ar' },
  { text: 'Kumusta', lang: 'tl', x: 70, y: 91, size: 1.8, rotate: -4, color: BLUE },
  { text: 'Здравствуйте', lang: 'ru', x: 87, y: 85, size: 1.6, rotate: -3, color: NAVY },
];

/** Shared look for one greeting; buttons add a pointer and a focus ring. */
const WORD =
  'inline-block rounded-2xl px-3 py-1 font-extrabold whitespace-nowrap transition-[scale,background-color,box-shadow] duration-200';
const BUTTON = 'cursor-pointer focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring';
/** The highlighted greeting: English to start with, then whichever one is hovered or focused. */
const ACTIVE = 'scale-115 bg-white shadow-lg';

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
          (mouseenter)="active.set(g)"
          (focus)="active.set(g)"
          (blur)="resetHighlight()"
          [class]="classFor(g) + ' ' + button"
          [style.color]="g.color"
          [style.font-size.rem]="g.size * scale"
        >
          {{ g.text }}
        </button>
      } @else {
        <span
          aria-hidden="true"
          [attr.lang]="g.lang"
          (mouseenter)="active.set(g)"
          [class]="classFor(g)"
          [style.color]="g.color"
          [style.font-size.rem]="g.size * scale"
        >
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
      <div class="flex flex-col items-center gap-4 px-4 py-8 lg:hidden" (mouseleave)="resetHighlight()">
        <ul class="flex max-w-xl flex-wrap items-center justify-center gap-x-1 gap-y-2">
          @for (g of topBand; track g.text) {
            <li>
              <ng-container *ngTemplateOutlet="greeting; context: { $implicit: g, scale: g.choose ? 0.65 : 0.55 }" />
            </li>
          }
        </ul>
        <app-logo-mark label="Newcomer Compass" class="size-36 animate-[nc-float_6s_ease-in-out_infinite] sm:size-44" />
        <ul class="flex max-w-xl flex-wrap items-center justify-center gap-x-1 gap-y-2">
          @for (g of bottomBand; track g.text) {
            <li>
              <ng-container *ngTemplateOutlet="greeting; context: { $implicit: g, scale: 0.55 }" />
            </li>
          }
        </ul>
      </div>

      <!-- Wide screens: a tight ring of greetings around the logo, which sits dead centre. -->
      <div class="hidden py-6 lg:block">
        <div class="relative mx-auto h-[42rem] w-full max-w-6xl" (mouseleave)="resetHighlight()">
          <div class="absolute top-1/2 left-1/2 isolate -translate-x-1/2 -translate-y-1/2">
            <span class="absolute inset-0 -z-10 scale-125 rounded-full bg-white blur-2xl" aria-hidden="true"></span>
            <app-logo-mark label="Newcomer Compass" class="relative size-64 animate-[nc-float_6s_ease-in-out_infinite]" />
          </div>
          <ul>
            @for (g of greetings; track g.text; let i = $index) {
              <li
                class="absolute -translate-y-1/2 animate-[nc-fade-in_700ms_ease-out_both]"
                [class.-translate-x-1/2]="!g.beside"
                [class.-translate-x-full]="g.beside === 'left'"
                [class.z-10]="g === active()"
                [style.left]="leftFor(g)"
                [style.top.%]="g.y"
                [style.rotate]="g.rotate + 'deg'"
                [style.animation-delay]="i * 45 + 'ms'"
              >
                <ng-container *ngTemplateOutlet="greeting; context: { $implicit: g, scale: 1 }" />
              </li>
            }
          </ul>
        </div>
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
  protected readonly button = BUTTON;
  /** Starts on Hello so people can see the greetings are what to click. */
  protected readonly active = signal<Greeting>(GREETINGS[0]);
  protected readonly continueIn: Record<LanguageCode, string> = {
    en: EXTRA_STRINGS.en.continueIn,
    fr: EXTRA_STRINGS.fr.continueIn,
    ar: EXTRA_STRINGS.ar.continueIn,
  };

  protected classFor(g: Greeting): string {
    return g === this.active() ? `${WORD} ${ACTIVE}` : WORD;
  }

  /** The logo is 16rem across; greetings beside it keep a 1.5rem gap from its edge. */
  protected leftFor(g: Greeting): string {
    if (g.beside === 'left') return 'calc(50% - 9.5rem)';
    if (g.beside === 'right') return 'calc(50% + 9.5rem)';
    return `${g.x}%`;
  }

  protected resetHighlight(): void {
    this.active.set(GREETINGS[0]);
  }

  protected labelFor(g: Greeting): string | null {
    return g.choose ? this.continueIn[g.choose] : null;
  }

  choose(lang: LanguageCode): void {
    this.i18n.setLang(lang);
    void this.router.navigateByUrl('/compass');
  }
}
