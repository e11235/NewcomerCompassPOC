import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import type { StepPlaces } from '../../../engine/places';
import { nodeSteps, statusForState, type HandoffNote, type Journey, type JourneyStep, type RoadmapNode } from '../../../engine/rules';
import { I18n } from '../../../i18n/i18n';
import { Icon } from '../../../shared/icon';
import type { IconName } from '../../../shared/icon-paths';
import { PinBadge, StatusBadge } from './badges';
import { StepDetails } from './step-details';

/** The "mark as done" checkbox at the start of a step. */
@Component({
  selector: 'app-done-checkbox',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [for]="'done-' + id()" class="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg hover:bg-accent">
      <input
        type="checkbox"
        [id]="'done-' + id()"
        class="peer sr-only"
        [checked]="checked()"
        (change)="toggled.emit()"
        [attr.aria-label]="t().markDoneFor(title())"
      />
      <span
        aria-hidden="true"
        class="grid size-5 place-content-center rounded-[4px] border-2 shadow-xs peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
        [class]="checked() ? 'border-primary bg-primary text-primary-foreground' : 'border-input'"
      >
        @if (checked()) {
          <app-icon name="check" class="size-3.5" />
        }
      </span>
    </label>
  `,
})
export class DoneCheckbox {
  protected readonly t = inject(I18n).t;
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly checked = input.required<boolean>();
  readonly toggled = output();
}

const PROGRAM_ICONS: Record<string, IconName> = {
  'id-card': 'id-card',
  receipt: 'receipt',
  briefcase: 'briefcase',
  search: 'search',
  phone: 'phone',
  users: 'users',
  wallet: 'wallet',
  coins: 'coins',
  baby: 'baby',
  home: 'house',
  smile: 'smile',
};

/** One support inside the "Check other supports" group. */
@Component({
  selector: 'app-group-item',
  imports: [DoneCheckbox, Icon, StatusBadge, StepDetails],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block rounded-xl border' },
  template: `
    @let p = step().program;
    <div class="flex items-start gap-1 p-1">
      <app-done-checkbox [id]="p.id" [title]="i18n.pick(p.shortTitle)" [checked]="done()" (toggled)="toggleDone.emit(p.id)" />
      <button
        type="button"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="'grp-' + p.id"
        (click)="open.set(!open())"
        class="flex min-w-0 flex-1 items-start gap-3 rounded-lg p-2 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <app-icon [name]="icon()" class="mt-0.5 size-5" />
        <span class="min-w-0 flex-1">
          <span class="block font-semibold" [class]="done() ? 'text-muted-foreground line-through' : ''">{{ i18n.pick(p.shortTitle) }}</span>
          <span class="mt-1 block"><app-status-badge [status]="status()" /></span>
          <span class="mt-1 block text-sm text-muted-foreground">{{ i18n.pick(p.oneLiner) }}</span>
        </span>
        <app-icon name="chevron-down" class="mt-1 size-5 transition-transform" [class.rotate-180]="open()" />
        <span class="sr-only">{{ open() ? t().hideDetails : t().showDetails }}</span>
      </button>
    </div>
    @if (open()) {
      <div [id]="'grp-' + p.id" class="border-t p-3"><app-step-details [step]="step()" [journey]="journey()" /></div>
    }
  `,
})
export class GroupItem {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  readonly step = input.required<JourneyStep>();
  readonly journey = input.required<Journey>();
  readonly completed = input.required<ReadonlySet<string>>();
  readonly toggleDone = output<string>();
  protected readonly open = signal(false);
  protected readonly done = computed(() => this.completed().has(this.step().program.id));
  protected readonly status = computed(() => (this.done() ? 'done' : statusForState(this.step().result.state)));
  protected readonly icon = computed(() => PROGRAM_ICONS[this.step().program.icon] ?? 'compass');
}

/** A numbered step on the roadmap, with its status, a "View on map" chip, and expandable details. */
@Component({
  selector: 'app-roadmap-row',
  imports: [DoneCheckbox, GroupItem, Icon, PinBadge, StatusBadge, StepDetails],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid scroll-mt-4 grid-cols-[2.75rem_1fr] gap-x-2 pb-3',
    '[id]': "'row-' + node().key",
    '[attr.aria-current]': "isCurrent() ? 'step' : null",
  },
  template: `
    @let n = node();
    <div class="relative flex justify-center">
      <span class="z-10 flex size-11 items-center justify-center rounded-full border-2 text-lg font-bold" [class]="circleClass()">
        @if (isDone()) {
          <app-icon name="check" class="size-5" />
        } @else {
          {{ n.position }}
        }
      </span>
      @if (!isLast()) {
        <span class="absolute top-11 bottom-0 w-0 border-s-2 border-border"></span>
      }
    </div>

    <div class="min-w-0 rounded-xl border-2 bg-card transition-shadow" [class]="cardClass()">
      <div class="flex items-start">
        <app-done-checkbox [id]="n.key" [title]="title()" [checked]="allDone()" (toggled)="toggleAll()" />
        <h3 class="min-w-0 flex-1">
          <button
            type="button"
            [id]="'toggle-' + n.key"
            [attr.aria-expanded]="open()"
            [attr.aria-controls]="'node-' + n.key"
            (click)="toggleOpen.emit()"
            class="flex min-h-11 w-full items-start gap-2 rounded-lg py-2 pe-2 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span class="min-w-0 flex-1">
              <span class="sr-only">{{ t().stepLabel(n.position) }}: </span>
              <span class="block leading-snug font-bold" [class]="isDone() ? 'text-muted-foreground line-through decoration-2' : ''">{{
                title()
              }}</span>
              <span class="mt-0.5 block text-sm leading-snug text-muted-foreground">{{ subtitle() }}</span>
            </span>
            <app-icon name="chevron-down" class="mt-0.5 size-5 transition-transform" [class.rotate-180]="open()" />
            <span class="sr-only">{{ open() ? t().hideDetails : t().showDetails }}</span>
          </button>
        </h3>
      </div>
      <div class="flex flex-wrap items-center gap-x-2 gap-y-1 ps-11 pe-2 pb-2">
        <app-status-badge [status]="n.status" />
        @if (places(); as pl) {
          @if (pl.kind !== 'remote') {
            <button
              type="button"
              (click)="showOnMap.emit()"
              [attr.aria-pressed]="highlighted()"
              aria-controls="where-to-go"
              class="ms-auto inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 ps-1.5 pe-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              [class]="highlighted() ? 'border-red-700 bg-red-50 text-red-950' : 'border-transparent hover:border-border hover:bg-accent'"
            >
              @if (pl.kind === 'places') {
                <app-pin-badge [label]="'' + n.position" [tone]="pinTone()" size="sm" />
              } @else {
                <app-icon name="map-pin" class="ms-1 size-4 text-red-700" />
              }
              <span>{{ pl.kind === 'places' ? (highlighted() ? t().shownOnMap : t().viewOnMap) : t().findLocationChip }}</span>
              <span class="sr-only">: {{ title() }}</span>
            </button>
          }
        }
      </div>
      @if (open()) {
        <div [id]="'node-' + n.key" class="space-y-3 border-t px-3 pt-3 pb-3">
          @if (n.kind === 'step') {
            @if (isBlocked() && !isDone()) {
              <div class="rounded-xl border-2 border-dashed border-sky-800/60 bg-sky-50 p-3 text-sm">
                <p class="flex items-center gap-1.5 font-bold"><app-icon name="lock" class="size-4" />{{ t().roadmapStatus.not_yet }}</p>
                <p class="mt-1"><span class="font-semibold">{{ t().doThisFirst }}:</span> {{ prereqTitles() }}</p>
                <app-icon name="arrow-down" class="my-1 ms-2 size-4" />
                <p><span class="font-semibold">{{ t().thenLabel }}:</span> {{ title() }}</p>
                <p class="mt-1 text-muted-foreground">{{ t().notYetDiff }}</p>
              </div>
            }
            <app-step-details [step]="n.step" [journey]="journey()" [handoff]="handoff()" />
          } @else {
            <ul class="space-y-3">
              @for (s of n.steps; track s.program.id) {
                <li><app-group-item [step]="s" [journey]="journey()" [completed]="completed()" (toggleDone)="toggleDone.emit($event)" /></li>
              }
            </ul>
          }
        </div>
      }
    </div>
  `,
})
export class RoadmapRow {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  readonly node = input.required<RoadmapNode>();
  readonly journey = input.required<Journey>();
  readonly handoff = input<HandoffNote | undefined>(undefined);
  readonly isCurrent = input(false);
  readonly isLast = input(false);
  readonly open = input(false);
  readonly completed = input.required<ReadonlySet<string>>();
  readonly places = input<StepPlaces | undefined>(undefined);
  readonly highlighted = input(false);
  readonly toggleOpen = output();
  readonly toggleDone = output<string>();
  readonly showOnMap = output();

  protected readonly isDone = computed(() => this.node().status === 'done');
  protected readonly isBlocked = computed(() => {
    const n = this.node();
    return n.kind === 'step' && n.status === 'not_yet' && n.prereqs.length > 0;
  });
  protected readonly title = computed(() => {
    const n = this.node();
    return n.kind === 'step' ? this.i18n.pick(n.step.program.shortTitle) : this.t().otherSupportsTitle;
  });
  protected readonly prereqTitles = computed(() => {
    const n = this.node();
    return n.kind === 'step' ? n.prereqs.map((p) => this.i18n.pick(p.program.shortTitle)).join(' · ') : '';
  });
  protected readonly subtitle = computed(() => {
    const n = this.node();
    if (n.kind === 'group') return this.t().otherSupportsLine(n.steps.length);
    return this.isBlocked() ? this.t().afterStep(this.prereqTitles()) : this.i18n.pick(n.step.program.oneLiner);
  });
  private readonly programIds = computed(() => nodeSteps(this.node()).map((s) => s.program.id));
  protected readonly allDone = computed(() => this.programIds().every((id) => this.completed().has(id)));
  protected readonly pinTone = computed(() => (this.isDone() ? 'done' : this.isCurrent() ? 'here' : 'later'));
  protected readonly circleClass = computed(() =>
    this.isDone()
      ? 'border-green-800 bg-green-800 text-white'
      : this.isCurrent()
        ? 'border-[#26374a] bg-[#26374a] text-white ring-4 ring-[#26374a]/15'
        : this.node().status === 'not_yet'
          ? 'border-dashed border-sky-800 bg-background text-foreground'
          : 'border-[#26374a] bg-background text-foreground',
  );
  protected readonly cardClass = computed(() => {
    const base = this.isCurrent() ? 'border-[#26374a] shadow-sm' : this.isDone() ? 'border-green-800/40 bg-muted/40' : 'border-border';
    return this.highlighted() ? `${base} outline-4 outline-offset-2 outline-red-700/60` : base;
  });

  protected toggleAll(): void {
    const n = this.node();
    if (n.kind === 'step') {
      this.toggleDone.emit(n.step.program.id);
      return;
    }
    const allDone = this.allDone();
    this.programIds()
      .filter((id) => this.completed().has(id) === allDone)
      .forEach((id) => this.toggleDone.emit(id));
  }
}
