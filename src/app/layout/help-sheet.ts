import { A11yModule } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { CONTENT } from '../content/content-data';
import { findOrg, localizedUrl, orgLinks, telHref } from '../engine/links';
import { I18n } from '../i18n/i18n';
import { Icon } from '../shared/icon';
import { LogoMark } from '../shared/logo';
import { JourneyStore } from '../state/journey-store';
import { ChannelLinks } from './channel-links';

/** "Get help from a person": a side panel with settlement workers, 211, tax clinics and phone numbers. */
@Component({
  selector: 'app-help-sheet',
  imports: [A11yModule, ChannelLinks, Icon, LogoMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
  template: `
    @if (store.helpOpen()) {
      <div class="fixed inset-0 z-50 bg-black/50 animate-[nc-fade-in_200ms_ease-out]" (click)="close()" aria-hidden="true"></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        aria-describedby="help-lead"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        class="fixed inset-y-0 end-0 z-50 flex h-full w-full flex-col gap-4 overflow-y-auto border-s bg-background shadow-lg sm:max-w-md"
        [class]="i18n.dir() === 'rtl' ? 'animate-[nc-slide-in-start_300ms_ease-out]' : 'animate-[nc-slide-in-end_300ms_ease-out]'"
      >
        <div class="flex items-start gap-3 p-4 pe-14">
          <app-logo-mark class="size-10" />
          <div class="flex flex-col gap-1.5">
            <h2 id="help-title" class="text-xl font-semibold break-words text-foreground">{{ t().helpTitle }}</h2>
            <p id="help-lead" class="text-sm break-words text-foreground">{{ t().helpLead }}</p>
          </div>
        </div>
        <button
          type="button"
          class="absolute end-4 top-4 inline-flex size-9 items-center justify-center rounded-md opacity-70 transition-opacity hover:bg-accent hover:opacity-100 focus-visible:outline-2 focus-visible:outline-ring"
          (click)="close()"
        >
          <app-icon name="x" />
          <span class="sr-only">{{ t().close }}</span>
        </button>

        <div class="space-y-6 px-4 pb-6">
          <section aria-labelledby="help-worker" class="rounded-xl border p-4">
            <h3 id="help-worker" class="flex items-center gap-2 font-semibold">
              <app-icon name="users" />{{ t().helpWorker }}
            </h3>
            <p class="mt-1 text-sm">{{ t().helpWorkerBody }}</p>
            <div class="mt-3"><app-channel-links [links]="workerLinks()" /></div>
          </section>

          <section aria-labelledby="help-211" class="rounded-xl border p-4">
            <h3 id="help-211" class="flex items-center gap-2 font-semibold">
              <app-icon name="message-square" />{{ t().help211Title }}
            </h3>
            <p class="mt-1 text-sm">{{ t().help211Body }}</p>
            <div class="mt-3"><app-channel-links [links]="links211()" /></div>
          </section>

          @if (taxClinicUrl(); as href) {
            <section aria-labelledby="help-tax" class="rounded-xl border p-4">
              <h3 id="help-tax" class="flex items-center gap-2 font-semibold">
                <app-icon name="receipt" />{{ t().helpTaxTitle }}
              </h3>
              <p class="mt-1 text-sm">{{ t().helpTaxBody }}</p>
              <div class="mt-3"><app-channel-links [links]="[{ channel: 'in_person', href }]" /></div>
            </section>
          }

          <section aria-labelledby="help-phone">
            <h3 id="help-phone" class="flex items-center gap-2 font-semibold">
              <app-icon name="phone" />{{ t().helpByPhone }}
            </h3>
            <ul class="mt-2 divide-y rounded-xl border text-sm">
              @for (org of phoneOrgs; track org.id) {
                <li class="flex flex-wrap items-center justify-between gap-2 p-3">
                  <span class="font-medium">{{ i18n.pick(org.name) }}</span>
                  <a [href]="tel(org.contact.phone!)" dir="ltr" class="font-semibold text-blue-800 underline underline-offset-4">{{
                    org.contact.phone
                  }}</a>
                </li>
              }
            </ul>
          </section>

          <p class="text-xs">{{ t().disclaimer }}</p>
        </div>
      </div>
    }
  `,
})
export class HelpSheet {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);
  private readonly document = inject(DOCUMENT);
  private returnFocus: HTMLElement | null = null;

  protected readonly phoneOrgs = CONTENT.organizations.filter((o) => o.contact.phone && o.id !== 'org_211');
  protected readonly workerLinks = computed(() => orgLinks(findOrg('org_ircc')!, this.i18n.lang()));
  protected readonly links211 = computed(() => orgLinks(findOrg('org_211')!, this.i18n.lang()));
  protected readonly taxClinicUrl = computed(() => {
    const cra = findOrg('org_cra');
    return cra ? localizedUrl(cra.contact.inPersonUrl, cra.contact.inPersonUrlFr, this.i18n.lang()) : null;
  });
  protected readonly tel = telHref;

  constructor() {
    effect(() => {
      if (this.store.helpOpen()) {
        this.returnFocus = this.document.activeElement as HTMLElement | null;
        this.document.body.style.overflow = 'hidden';
      } else {
        this.document.body.style.overflow = '';
        this.returnFocus?.focus();
        this.returnFocus = null;
      }
    });
  }

  close(): void {
    if (this.store.helpOpen()) this.store.helpOpen.set(false);
  }
}
