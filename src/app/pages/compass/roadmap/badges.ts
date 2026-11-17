import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { PinTone } from '../../../engine/places';
import type { RoadmapStatus } from '../../../engine/rules';
import { I18n } from '../../../i18n/i18n';
import { Icon } from '../../../shared/icon';
import type { IconName } from '../../../shared/icon-paths';

const STATUS_STYLES: Record<RoadmapStatus, { icon: IconName; cls: string }> = {
  you_are_here: { icon: 'map-pin', cls: 'border-[#26374a] bg-[#26374a] text-white' },
  next: { icon: 'arrow-down', cls: 'border-[#26374a] text-[#26374a]' },
  not_yet: { icon: 'lock', cls: 'border-dashed border-sky-800 text-sky-900' },
  may_apply: { icon: 'lightbulb', cls: 'border-emerald-700 text-emerald-900' },
  check_this: { icon: 'search', cls: 'border-amber-600 text-amber-900' },
  get_help: { icon: 'life-buoy', cls: 'border-violet-700 text-violet-900' },
  coming_up: { icon: 'clock', cls: 'border-stone-500 text-stone-700' },
  done: { icon: 'check', cls: 'border-green-800 bg-green-800 text-white' },
};

/** "YOU ARE HERE", "NEXT", "NOT YET", … */
@Component({
  selector: 'app-status-badge',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase"
      [class]="style().cls"
    >
      <app-icon [name]="style().icon" class="size-3.5" />{{ t().roadmapStatus[status()] }}
    </span>
  `,
})
export class StatusBadge {
  protected readonly t = inject(I18n).t;
  readonly status = input.required<RoadmapStatus>();
  protected readonly style = computed(() => STATUS_STYLES[this.status()]);
}

const PIN_PATH = 'M12 29C10 24 2 19 2 11a10 10 0 0 1 20 0c0 8-8 13-10 18z';
const PIN_FILL: Record<PinTone, string> = {
  here: 'fill-[#26374a] stroke-white',
  later: 'fill-white stroke-[#26374a]',
  done: 'fill-green-800 stroke-white',
  help: 'fill-red-700 stroke-white',
};

/** A small map pin with the step number, matching the pins on the map. */
@Component({
  selector: 'app-pin-badge',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative inline-flex shrink-0 justify-center', '[class]': "size() === 'sm' ? 'h-7 w-6' : 'h-11 w-9'" },
  template: `
    <svg viewBox="0 0 24 30" class="absolute inset-0 size-full" aria-hidden="true">
      <path [attr.d]="pinPath" stroke-width="2" [attr.class]="pinFill()" />
    </svg>
    <span
      class="relative font-bold"
      [class]="(tone() === 'later' ? 'text-[#26374a] ' : 'text-white ') + (size() === 'sm' ? 'pt-[3px] text-[11px]' : 'pt-1.5 text-sm')"
    >
      @switch (tone()) {
        @case ('help') {
          <app-icon name="life-buoy" [class]="size() === 'sm' ? 'mt-px size-3' : 'size-4'" />
        }
        @case ('done') {
          ✓
        }
        @default {
          {{ label() }}
        }
      }
    </span>
  `,
})
export class PinBadge {
  readonly label = input('');
  readonly tone = input.required<PinTone>();
  readonly size = input<'sm' | 'md'>('md');
  protected readonly pinPath = PIN_PATH;
  protected readonly pinFill = computed(() => PIN_FILL[this.tone()]);
}

/** Legend pin. */
@Component({
  selector: 'app-legend-pin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg viewBox="0 0 24 30" class="h-5 w-4 shrink-0" aria-hidden="true">
    <path [attr.d]="pinPath" stroke-width="2.5" [attr.class]="fill().includes('stroke-') ? fill() : fill() + ' stroke-white'" />
  </svg>`,
})
export class LegendPin {
  readonly fill = input.required<string>();
  protected readonly pinPath = PIN_PATH;
}

/** "Demo location" tag. */
@Component({
  selector: 'app-demo-badge',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1 rounded-full border border-dashed border-amber-700/70 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-950"
    >
      <app-icon name="flask-conical" class="size-3.5" />{{ t().demoBadge }}
    </span>
  `,
})
export class DemoBadge {
  protected readonly t = inject(I18n).t;
}
