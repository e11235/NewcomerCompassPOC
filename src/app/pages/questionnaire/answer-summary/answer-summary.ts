import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { I18n } from '../../../i18n/i18n';
import { AnswersStore } from '../../../state/answers-store';
import { formatAnswer, isAnswered, isVisible, Question, STEPS } from '../questionnaire-config';

interface SummaryItem {
  stepIndex: number;
  question: Question;
  label: string;
  /** Null when an optional question was skipped. */
  value: string | null;
}

/** Rows of chips the compact summary shows before "Show all answers". */
const MAX_ROWS = 2;

/**
 * The person's answers so far. `chips` is the compact running summary above the
 * questions; `list` is the full review after the last step. Either way, choosing
 * an answer asks the parent to go back to its step.
 */
@Component({
  selector: 'app-answer-summary',
  imports: [MatIconModule],
  templateUrl: './answer-summary.html',
  styleUrl: './answer-summary.scss',
})
export class AnswerSummary {
  readonly variant = input<'chips' | 'list'>('chips');
  readonly edit = output<number>();

  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  private readonly store = inject(AnswersStore);
  private readonly injector = inject(Injector);

  /** Answered questions, in order (chips). */
  protected readonly items = computed(() => this.buildItems().filter((item) => item.value !== null));

  /** Every visible question grouped by step, including skipped optional ones (review list). */
  protected readonly groups = computed(() =>
    STEPS.map((step, stepIndex) => ({
      step,
      stepIndex,
      items: this.buildItems().filter((item) => item.stepIndex === stepIndex),
    })),
  );

  protected readonly expanded = signal(false);
  /** Index of the first chip past the second row, or null if they all fit. */
  protected readonly hiddenFrom = signal<number | null>(null);
  protected readonly collapsedHeight = signal<number | null>(null);
  protected readonly hiddenCount = computed(() => {
    const from = this.hiddenFrom();
    return from === null ? 0 : this.items().length - from;
  });

  private readonly list = viewChild<ElementRef<HTMLElement>>('list');

  constructor() {
    // Re-measure after the chips change and whenever the list is resized.
    effect(() => {
      this.items();
      this.i18n.lang();
      afterNextRender(() => this.measure(), { injector: this.injector });
    });

    const observer = new ResizeObserver(() => this.measure());
    effect(() => {
      const el = this.list()?.nativeElement;
      observer.disconnect();
      if (el) {
        observer.observe(el);
      }
    });
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }

  protected isHidden(index: number): boolean {
    const from = this.hiddenFrom();
    return !this.expanded() && from !== null && index >= from;
  }

  private buildItems(): SummaryItem[] {
    const lang = this.i18n.lang();
    const values = this.store.answers().values;
    return STEPS.flatMap((step, stepIndex) =>
      step.questions
        .filter((q) => isVisible(q, values))
        .map((question) => {
          const value = values[question.id];
          return {
            stepIndex,
            question,
            label: question.shortLabel[lang],
            value: value !== undefined && isAnswered(value) ? formatAnswer(question, value, lang) : null,
          };
        }),
    );
  }

  /**
   * Work out which chips wrap past the second row. Chips past it stay laid out
   * (so their positions can be measured) but are hidden and removed from the tab order.
   */
  private measure(): void {
    const el = this.list()?.nativeElement;
    if (!el) {
      return;
    }
    const chips = Array.from(el.children) as HTMLElement[];
    const rowTops = [...new Set(chips.map((c) => c.offsetTop))].sort((a, b) => a - b);
    if (rowTops.length <= MAX_ROWS) {
      this.hiddenFrom.set(null);
      this.collapsedHeight.set(null);
      return;
    }
    const cutoff = rowTops[MAX_ROWS];
    this.hiddenFrom.set(chips.findIndex((c) => c.offsetTop >= cutoff));
    const visible = chips.filter((c) => c.offsetTop < cutoff);
    const bottom = Math.max(...visible.map((c) => c.offsetTop + c.offsetHeight));
    // The list is border-box, so add its bottom padding back.
    this.collapsedHeight.set(bottom + parseFloat(getComputedStyle(el).paddingBottom));
  }
}
