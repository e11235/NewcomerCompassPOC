import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import type { LanguageCode } from '../../content/types';
import { EXTRA_STRINGS } from '../../i18n/extra-strings';
import { I18n, LANGUAGES } from '../../i18n/i18n';
import { Icon } from '../../shared/icon';
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
}

const NAVY = '#062748';
const ORANGE = '#d9590f';
const TEAL = '#0d706a';
const BLUE = '#1969a3';
const PLUM = '#8b1d5e';
const GREEN = '#1f6b3a';

/**
 * "Hello" in languages spoken by many newcomers to Canada, laid out around the
 * logo as in ref/language 1.png. Decorative only: hidden from screen readers.
 */
const GREETINGS: Greeting[] = [
  { text: 'Hello', lang: 'en', x: 9, y: 8, size: 2.4, rotate: -6, color: NAVY },
  { text: 'Bonjour', lang: 'fr', x: 28, y: 6, size: 2.1, rotate: 4, color: PLUM },
  { text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', lang: 'pa', x: 50, y: 4, size: 1.7, rotate: -2, color: GREEN },
  { text: '你好', lang: 'zh', x: 70, y: 7, size: 2.3, rotate: -4, color: ORANGE },
  { text: 'Hola', lang: 'es', x: 89, y: 8, size: 2.5, rotate: -8, color: TEAL },
  { text: 'Cześć', lang: 'pl', x: 8, y: 25, size: 1.5, rotate: -3, color: TEAL },
  { text: 'નમસ્તે', lang: 'gu', x: 10, y: 39, size: 1.8, rotate: -5, color: PLUM },
  { text: 'नमस्ते', lang: 'hi', x: 9, y: 53, size: 1.9, rotate: 3, color: GREEN },
  { text: 'Xin chào', lang: 'vi', x: 10, y: 67, size: 1.6, rotate: -6, color: ORANGE },
  { text: '안녕하세요', lang: 'ko', x: 11, y: 81, size: 1.6, rotate: -3, color: BLUE },
  { text: 'مرحبا', lang: 'ar', x: 90, y: 24, size: 2.1, rotate: 4, color: PLUM },
  { text: 'Kumusta', lang: 'tl', x: 89, y: 38, size: 1.6, rotate: -4, color: BLUE },
  { text: 'வணக்கம்', lang: 'ta', x: 89, y: 52, size: 1.5, rotate: 2, color: PLUM },
  { text: 'سلام', lang: 'fa', x: 91, y: 66, size: 2.1, rotate: -5, color: GREEN },
  { text: 'Hallo', lang: 'de', x: 89, y: 80, size: 2.2, rotate: -4, color: ORANGE },
  { text: 'السلام عليكم', lang: 'ar', x: 23, y: 94, size: 1.6, rotate: -7, color: PLUM },
  { text: 'Olá', lang: 'pt', x: 42, y: 95, size: 2.1, rotate: -3, color: TEAL },
  { text: 'Ciao', lang: 'it', x: 59, y: 95, size: 2.0, rotate: -5, color: PLUM },
  { text: 'Здравствуйте', lang: 'ru', x: 79, y: 94, size: 1.6, rotate: -3, color: NAVY },
];

/** First page: choose a language. The logo mark sits in the middle of a ring of greetings. */
@Component({
  selector: 'app-welcome',
  imports: [Icon, LogoMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      aria-labelledby="welcome-title"
      class="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_#ffffff_38%,_#f4f6f9_100%)]"
    >
      <!-- Greetings: a wrapping band on small screens, a ring around the logo on wide ones. -->
      <ul aria-hidden="true" class="mx-auto flex max-w-xl flex-wrap justify-center gap-x-4 gap-y-1 px-4 pt-6 lg:hidden">
        @for (g of greetings.slice(0, 10); track g.text) {
          <li [attr.lang]="g.lang" class="font-extrabold" [style.color]="g.color" [style.font-size.rem]="g.size * 0.55">
            {{ g.text }}
          </li>
        }
      </ul>
      <ul aria-hidden="true" class="pointer-events-none absolute inset-0 hidden lg:block">
        @for (g of greetings; track g.text; let i = $index) {
          <li
            [attr.lang]="g.lang"
            class="absolute -translate-x-1/2 -translate-y-1/2 font-extrabold whitespace-nowrap animate-[nc-fade-in_700ms_ease-out_both]"
            [style.left.%]="g.x"
            [style.top.%]="g.y"
            [style.font-size.rem]="g.size"
            [style.color]="g.color"
            [style.rotate]="g.rotate + 'deg'"
            [style.animation-delay]="i * 45 + 'ms'"
          >
            {{ g.text }}
          </li>
        }
      </ul>

      <div class="relative mx-auto flex max-w-2xl flex-col items-center px-4 pt-6 pb-10 text-center lg:min-h-[44rem] lg:justify-center lg:py-24">
        <div class="relative isolate">
          <span class="absolute inset-0 -z-10 scale-125 rounded-full bg-white blur-2xl" aria-hidden="true"></span>
          <app-logo-mark label="Newcomer Compass" class="relative size-32 animate-[nc-float_6s_ease-in-out_infinite] sm:size-40" />
        </div>

        <h1 id="welcome-title" class="relative mt-6 text-3xl leading-tight font-bold sm:text-4xl">
          <span lang="en" class="block">Choose your language</span>
          <span class="mt-1 block text-lg font-semibold text-muted-foreground sm:text-xl">
            <span lang="fr">Choisissez votre langue</span>
            <span aria-hidden="true" class="mx-2">·</span>
            <span lang="ar" dir="rtl">اختر لغتك</span>
          </span>
        </h1>

        <ul class="relative mt-8 grid w-full gap-3 sm:grid-cols-3">
          @for (l of languages; track l.code) {
            <li class="flex">
              <button
                type="button"
                [attr.lang]="l.code"
                [attr.dir]="l.dir"
                (click)="choose(l.code)"
                class="group flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-border bg-card/95 px-4 py-5 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#26374a] hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span class="text-2xl font-bold text-[#26374a]">{{ l.label }}</span>
                <span class="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground">
                  {{ continueIn[l.code] }}
                  <app-icon name="arrow-right" class="size-4 flip-rtl" />
                </span>
              </button>
            </li>
          }
        </ul>

        <p class="relative mt-6 max-w-md text-sm text-muted-foreground">
          <span lang="en">{{ changeLater.en }}</span>
          <span lang="fr" class="block">{{ changeLater.fr }}</span>
        </p>
      </div>
    </section>
  `,
})
export class Welcome {
  protected readonly i18n = inject(I18n);
  private readonly router = inject(Router);
  protected readonly languages = LANGUAGES;
  protected readonly greetings = GREETINGS;
  protected readonly continueIn = {
    en: EXTRA_STRINGS.en.continueIn,
    fr: EXTRA_STRINGS.fr.continueIn,
    ar: EXTRA_STRINGS.ar.continueIn,
  };
  protected readonly changeLater = {
    en: EXTRA_STRINGS.en.welcomeChangeLater,
    fr: EXTRA_STRINGS.fr.welcomeChangeLater,
  };

  choose(lang: LanguageCode): void {
    this.i18n.setLang(lang);
    void this.router.navigateByUrl('/compass');
  }
}
