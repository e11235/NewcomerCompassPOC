import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CONTENT, RESULT_STATES } from '../../../content/content-data';
import type { Question } from '../../../content/types';
import { sourceUrl, stepLinks } from '../../../engine/links';
import { simplerWords } from '../../../engine/roadmap-document';
import { prerequisitesOf, type HandoffNote, type Journey, type JourneyStep } from '../../../engine/rules';
import { I18n } from '../../../i18n/i18n';
import { ChannelLinks } from '../../../layout/channel-links';
import { Icon } from '../../../shared/icon';
import type { IconName } from '../../../shared/icon-paths';
import { JourneyStore } from '../../../state/journey-store';

/** One labelled block inside a step's details ("WHY THIS STEP?", "WHAT YOU'LL NEED", …). */
@Component({
  selector: 'app-detail-block',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid grid-cols-[1.75rem_1fr] gap-x-2' },
  template: `
    <app-icon [name]="icon()" class="mt-0.5 size-5 text-[#26374a]" />
    <div class="min-w-0">
      <h4 class="text-sm font-bold tracking-wide uppercase">{{ heading() }}</h4>
      <div class="mt-1"><ng-content /></div>
    </div>
  `,
})
export class DetailBlock {
  readonly icon = input.required<IconName>();
  readonly heading = input.required<string>();
}

/** Everything about one step: why, documents, what to do, where to go, official info, help. */
@Component({
  selector: 'app-step-details',
  imports: [ChannelLinks, DetailBlock, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-5 text-base' },
  template: `
    @let p = step().program;
    @let r = step().result;
    <app-detail-block icon="circle-question-mark" [heading]="t().dWhyStep">
      <p>{{ i18n.pick(r.explanation) }}</p>
      @if (r.state === 'needs_info' && missing().length) {
        <p class="mt-1 text-sm">{{ t().dMissing(missingText()) }}</p>
      }
    </app-detail-block>

    <app-detail-block icon="file-text" [heading]="t().dNeed">
      <ul class="list-disc space-y-0.5 ps-5">
        @for (d of p.documents.slice(0, 3); track d.en) {
          <li>{{ i18n.pick(d) }}</li>
        }
      </ul>
    </app-detail-block>

    <app-detail-block icon="target" [heading]="t().dWhatToDo">
      <p>{{ i18n.pick(p.action) }}</p>
      <p class="mt-1 text-sm text-muted-foreground">{{ t().dAfter }}: {{ i18n.pick(p.nextStep) }}</p>
    </app-detail-block>

    @if (prereqs().length || (step().section === 'first' && p.whyFirst) || unlocks().length) {
      <app-detail-block icon="list-ordered" [heading]="t().dWhyFirst">
        @if (prereqs().length) {
          <p>{{ t().dFirstDo(titles(prereqs())) }}</p>
        } @else if (p.whyFirst) {
          <p>{{ i18n.pick(p.whyFirst) }}</p>
        }
        @if (r.state === 'not_yet') {
          <p class="mt-1 text-sm">{{ t().notYetDiff }}</p>
        }
        @if (unlocks().length) {
          <p class="mt-1">{{ t().dUnlocks(titles(unlocks())) }}</p>
        }
      </app-detail-block>
    }

    <app-detail-block icon="building-2" [heading]="t().dWhere">
      <p class="font-semibold">{{ i18n.pick(org()?.name) }}</p>
      <div class="mt-2"><app-channel-links [links]="links()" /></div>
      @if (handoff(); as h) {
        <div class="mt-3 rounded-xl border border-dashed p-3 text-sm">
          <p class="flex items-center gap-1.5 font-semibold">
            <app-icon name="repeat-2" class="size-4" />{{ t().handoffFromTo(i18n.pick(h.handoff.fromLabel), i18n.pick(h.handoff.toLabel)) }}
          </p>
          <p class="mt-1"><span class="font-semibold">{{ t().handoffWhy }}:</span> {{ i18n.pick(h.handoff.why) }}</p>
          <p class="mt-1"><span class="font-semibold">{{ t().handoffBring }}:</span> {{ bringText() }}</p>
        </div>
      }
    </app-detail-block>

    <app-detail-block icon="book-open" [heading]="t().dOfficial">
      @if (officialUrl(); as href) {
        <a [href]="href" target="_blank" rel="noopener noreferrer" class="inline-flex items-start gap-1 font-semibold text-blue-800 underline underline-offset-4">
          <span>{{ i18n.pick(source()?.title) }}</span>
          <app-icon name="external-link" class="mt-1 size-3.5" />
          <span class="sr-only"> ({{ t().opensNewTab }})</span>
        </a>
      } @else {
        <p class="text-sm">{{ i18n.pick(source()?.placeholder) }}</p>
      }
      <p class="mt-1 text-sm text-muted-foreground">{{ t().dCheckOfficial }}</p>
    </app-detail-block>

    <app-detail-block icon="life-buoy" [heading]="t().dHelp">
      <p>{{ i18n.pick(p.humanHelp) }}</p>
      <button type="button" class="btn btn-outline btn-sm mt-2" (click)="store.helpOpen.set(true)">
        <app-icon name="life-buoy" />{{ t().helpThisStepCta }}
      </button>
    </app-detail-block>

    <div>
      <button type="button" class="btn btn-ghost btn-sm underline underline-offset-4" [attr.aria-expanded]="simpler()" (click)="simpler.set(!simpler())">
        {{ simpler() ? t().hideSimpler : t().simpler }}
      </button>
      @if (simpler()) {
        <div class="mt-2 rounded-xl bg-muted p-3" aria-live="polite">
          @for (line of simplerLines(); track line.en) {
            <p class="mt-1 first:mt-0">{{ i18n.pick(line) }}</p>
          }
          <p class="mt-2 text-xs text-muted-foreground">{{ t().simplerProvenance }}</p>
        </div>
      }
    </div>

    <div>
      <button
        type="button"
        class="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
        [attr.aria-expanded]="technical()"
        (click)="technical.set(!technical())"
      >
        <app-icon name="chevron-down" class="size-4 transition-transform" [class.rotate-180]="technical()" />{{ t().dTechnical }}
      </button>
      @if (technical()) {
        <div class="mt-2 rounded-xl border p-3 text-sm">
          <dl class="grid gap-x-4 gap-y-1 sm:grid-cols-2">
            <div><dt class="inline font-semibold">{{ t().rule }}: </dt><dd class="inline">{{ r.ruleId }}</dd></div>
            <div><dt class="inline font-semibold">{{ t().dResult }}: </dt><dd class="inline">{{ i18n.pick(stateInfo()?.label) }}</dd></div>
            <div>
              <dt class="inline font-semibold">{{ t().lastReviewed }}: </dt><dd class="inline">{{ r.lastReviewed }} ({{ t().mock }})</dd>
            </div>
            <div><dt class="inline font-semibold">{{ t().ruleOwner }}: </dt><dd class="inline">{{ r.owner }}</dd></div>
          </dl>
          <p class="mt-2 text-xs">{{ t().disclaimer }}</p>
        </div>
      }
    </div>
  `,
})
export class StepDetails {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);
  readonly step = input.required<JourneyStep>();
  readonly journey = input.required<Journey>();
  readonly handoff = input<HandoffNote | undefined>(undefined);

  protected readonly simpler = signal(false);
  protected readonly technical = signal(false);

  protected readonly org = computed(() => CONTENT.organizations.find((o) => o.id === this.step().program.orgId));
  protected readonly source = computed(() => CONTENT.sources.find((s) => s.id === this.step().result.sourceId));
  protected readonly officialUrl = computed(() => sourceUrl(this.source(), this.i18n.lang()));
  protected readonly stateInfo = computed(() => RESULT_STATES.find((s) => s.id === this.step().result.state));
  protected readonly prereqs = computed(() => prerequisitesOf(this.step(), this.journey()));
  protected readonly unlocks = computed(() => this.journey().steps.filter((s) => this.step().unlocksIds.includes(s.program.id)));
  protected readonly missing = computed(() =>
    this.step()
      .result.missingQuestionIds.map((id) => CONTENT.questions.find((q) => q.id === id))
      .filter((q): q is Question => !!q),
  );
  protected readonly missingText = computed(() => this.missing().map((q) => this.i18n.pick(q.summaryLabel)).join(', '));
  protected readonly links = computed(() => stepLinks(this.step().program, this.i18n.lang()));
  protected readonly bringText = computed(() => (this.handoff()?.handoff.bring ?? []).map((b) => this.i18n.pick(b)).join(' · '));
  protected readonly simplerLines = computed(() => simplerWords(this.step()));

  protected titles(steps: JourneyStep[]): string {
    return steps.map((s) => this.i18n.pick(s.program.shortTitle)).join(' · ');
  }
}
