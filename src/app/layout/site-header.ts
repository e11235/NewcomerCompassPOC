import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n, LANGUAGES } from '../i18n/i18n';
import { Icon } from '../shared/icon';
import { GcSignature } from '../shared/gc-signature';
import { LogoMark } from '../shared/logo';
import { JourneyStore } from '../state/journey-store';

@Component({
  selector: 'app-site-header',
  imports: [GcSignature, Icon, LogoMark, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="#content"
      class="sr-only z-50 rounded-md bg-background px-4 py-2 font-semibold underline focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus-visible:outline-2 focus-visible:outline-ring"
      >{{ t().skip }}</a
    >
    <header class="no-print">
      <div class="bg-[#26374a] text-white">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3">
          <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
            <app-gc-signature class="w-64 sm:w-72" [frenchFirst]="i18n.lang() === 'fr'" />
            <span aria-hidden="true" class="hidden h-9 w-px bg-white/30 md:block"></span>
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
          </div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            @if (showLanguages()) {
              <div role="group" [attr.aria-label]="t().languageLabel" class="flex items-center gap-1">
                <app-icon name="languages" class="me-1 size-4 text-white/80" />
                @for (l of languages; track l.code) {
                  <button
                    type="button"
                    [attr.lang]="l.code"
                    [attr.dir]="l.dir"
                    [attr.aria-pressed]="i18n.lang() === l.code"
                    (click)="i18n.setLang(l.code)"
                    class="min-h-10 rounded-full px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    [class]="
                      i18n.lang() === l.code
                        ? 'bg-white text-[#26374a]'
                        : 'text-white underline-offset-4 hover:bg-white/10 hover:underline'
                    "
                  >
                    {{ l.label }}
                  </button>
                }
              </div>
            }
            <button
              type="button"
              (click)="store.helpOpen.set(true)"
              class="inline-flex min-h-10 items-center gap-2 rounded-md px-2 py-1 font-semibold text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <app-icon name="life-buoy" />{{ t().getHelp }}
            </button>
          </div>
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
  /** The welcome page is itself the language choice, so it hides the switcher. */
  readonly showLanguages = input(true);
}
