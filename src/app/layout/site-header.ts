import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n, LANGUAGES } from '../i18n/i18n';
import { Icon } from '../shared/icon';
import { LogoMark } from '../shared/logo';
import { JourneyStore } from '../state/journey-store';

/** Canada flag, as in the prototype's header. */
const FLAG_PATH =
  'M201 232l-13.3 4.4 61.4 54c4.7 13.7-1.6 17.8-5.6 25l66.6-8.4-1.6 67 13.9-.3-3.1-66.6 66.7 8c-4.1-8.7-7.8-13.3-4-27.2l61.3-51-10.7-4c-8.8-6.8 3.8-32.6 5.6-48.9 0 0-35.7 12.3-38 5.8l-9.2-17.5-32.6 35.8c-3.5.9-5-.5-5.9-3.5l15-74.8-23.8 13.4q-3.2 1.3-5.2-2.2l-23-46-23.6 47.8q-2.8 2.5-5 .7L264 130.8l13.7 74.1c-1.1 3-3.7 3.8-6.7 2.2l-31.2-35.3c-4 6.5-6.8 17.1-12.2 19.5s-23.5-4.5-35.6-7c4.2 14.8 17 39.6 9 47.7z';

@Component({
  selector: 'app-site-header',
  imports: [Icon, LogoMark, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="#content"
      class="sr-only z-50 rounded-md bg-background px-4 py-2 font-semibold underline focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus-visible:outline-2 focus-visible:outline-ring"
      >{{ t().skip }}</a
    >
    <header class="no-print border-t-4 border-red-700">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-2.5">
            <svg viewBox="-160 0 960 480" class="h-5 w-10 shrink-0 ring-1 ring-border" aria-hidden="true" focusable="false">
              <rect x="-160" y="0" width="960" height="480" fill="#fff" />
              <rect x="-160" y="0" width="240" height="480" fill="#d52b1e" />
              <rect x="560" y="0" width="240" height="480" fill="#d52b1e" />
              <path fill="#d52b1e" [attr.d]="flagPath" />
            </svg>
            <span class="text-[15px] leading-tight font-semibold text-[#26374a]">
              @if (i18n.lang() === 'fr') {
                <span lang="fr" class="block">Gouvernement du Canada</span>
                <span lang="en" class="block">Government of Canada</span>
              } @else {
                <span lang="en" class="block">Government of Canada</span>
                <span lang="fr" class="block">Gouvernement du Canada</span>
              }
            </span>
          </span>
          <span aria-hidden="true" class="hidden h-8 w-px bg-border sm:block"></span>
          <span class="text-sm leading-tight">
            <span lang="en" class="block">Prototype service</span>
            <span lang="fr" class="block">Service prototype</span>
          </span>
        </div>
        @if (showLanguages()) {
          <div role="group" [attr.aria-label]="t().languageLabel" class="flex items-center gap-1">
            <app-icon name="languages" class="me-1 size-4 text-muted-foreground" />
            @for (l of languages; track l.code) {
              <button
                type="button"
                [attr.lang]="l.code"
                [attr.dir]="l.dir"
                [attr.aria-pressed]="i18n.lang() === l.code"
                (click)="i18n.setLang(l.code)"
                class="min-h-10 rounded-full px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                [class]="
                  i18n.lang() === l.code
                    ? 'bg-[#26374a] text-white'
                    : 'text-blue-800 underline-offset-4 hover:bg-accent hover:underline'
                "
              >
                {{ l.label }}
              </button>
            }
          </div>
        }
      </div>

      <div class="bg-[#26374a] text-white">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <a
            routerLink="/"
            class="group inline-flex items-center gap-3 rounded-md text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            [attr.aria-label]="t().homeLink"
          >
            <span class="flex size-10 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-2 ring-white/30 transition-transform group-hover:scale-105">
              <app-logo-mark class="size-8" />
            </span>
            <span class="text-xl font-bold tracking-tight">{{ t().appName }}</span>
          </a>
          <button
            type="button"
            (click)="store.helpOpen.set(true)"
            class="inline-flex items-center gap-2 rounded-md px-2 py-1 font-semibold text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <app-icon name="life-buoy" />{{ t().getHelp }}
          </button>
        </div>
      </div>

      <div
        role="note"
        [attr.aria-label]="t().prototypeNoticeLabel"
        class="border-b border-amber-300 bg-amber-50 text-amber-950"
      >
        <div class="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2 text-sm">
          <app-icon name="info" class="mt-0.5 size-4" />
          <p><strong>{{ t().prototypeLabel }} </strong>{{ t().prototypeNotice }}</p>
        </div>
      </div>

      @if (i18n.lang() === 'ar') {
        <p role="note" class="border-b bg-muted/60">
          <span class="mx-auto block max-w-6xl px-4 py-1.5 text-sm">
            {{ t().machineTranslated }}
            <span lang="en" dir="ltr" class="text-muted-foreground"
              >(Arabic content is machine translated and not yet validated.)</span
            >
          </span>
        </p>
      }
    </header>
  `,
})
export class SiteHeader {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);
  protected readonly languages = LANGUAGES;
  protected readonly flagPath = FLAG_PATH;
  /** The welcome page is itself the language choice, so it hides the switcher. */
  readonly showLanguages = input(true);
}
