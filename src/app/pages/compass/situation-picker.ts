import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CONTENT } from '../../content/content-data';
import { I18n } from '../../i18n/i18n';
import { Icon } from '../../shared/icon';
import type { IconName } from '../../shared/icon-paths';
import { JourneyStore } from '../../state/journey-store';

const SITUATION_ICONS: Record<string, IconName> = {
  briefcase: 'briefcase',
  wallet: 'wallet',
  baby: 'baby',
  plane: 'plane',
  search: 'search',
  heart: 'heart',
  home: 'house',
  compass: 'compass',
};

/** Step 1: "What do you need help with today?" */
@Component({
  selector: 'app-situation-picker',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      @for (s of situations; track s.id) {
        <li class="flex">
          @if (s.available) {
            <button
              type="button"
              (click)="store.pickSituation(s.id)"
              class="group flex min-h-40 w-full flex-col items-start gap-3 rounded-2xl border-2 border-border bg-card p-5 text-start transition-colors hover:border-[#26374a] hover:bg-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span class="flex w-full items-start justify-between">
                <span class="flex size-12 items-center justify-center rounded-2xl bg-[#26374a]/8 text-[#26374a]">
                  <app-icon [name]="icon(s.icon)" class="size-6" />
                </span>
                <app-icon name="chevron-right" class="size-5 text-muted-foreground group-hover:text-foreground flip-rtl" />
              </span>
              <span class="text-lg leading-snug font-semibold">{{ i18n.pick(s.label) }}</span>
              <span class="text-sm text-muted-foreground">{{ i18n.pick(s.description) }}</span>
            </button>
          } @else {
            <div
              class="flex min-h-40 w-full cursor-not-allowed flex-col items-start gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/60 p-5 text-start text-muted-foreground select-none"
            >
              <span class="flex size-12 items-center justify-center rounded-2xl bg-foreground/5 opacity-70">
                <app-icon [name]="icon(s.icon)" class="size-6" />
              </span>
              <span class="text-lg leading-snug font-semibold">{{ i18n.pick(s.label) }}</span>
              <span class="text-sm">{{ i18n.pick(s.description) }}</span>
              <span
                class="mt-auto inline-flex items-center gap-1.5 rounded-sm border border-muted-foreground/40 bg-background px-2 py-0.5 text-sm font-semibold text-foreground/80"
              >
                <app-icon name="lock" class="size-3.5" />{{ t().notInPrototype }}
              </span>
            </div>
          }
        </li>
      }
    </ul>

    @if (sample) {
      <section aria-labelledby="sample-title" class="mt-10 max-w-3xl rounded-2xl border border-dashed border-foreground/30 p-4">
        <h2 id="sample-title" class="text-lg font-semibold">{{ t().sampleTitle }}</h2>
        <p class="mt-1">{{ t().sampleBody }}</p>
        <p class="mt-1 text-sm text-muted-foreground">{{ i18n.pick(sample.label) }}</p>
        <button
          type="button"
          (click)="store.showSample()"
          class="mt-3 inline-flex items-center gap-1.5 rounded-md border-2 border-[#26374a] px-3 py-1.5 font-semibold text-[#26374a] hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {{ t().sampleButton }}<app-icon name="chevron-right" class="size-4 flip-rtl" />
        </button>
      </section>
    }
  `,
})
export class SituationPicker {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);
  protected readonly situations = CONTENT.scenario.situations;
  protected readonly sample = CONTENT.scenario.sampleJourney;
  protected icon(name: string): IconName {
    return SITUATION_ICONS[name] ?? 'compass';
  }
}
