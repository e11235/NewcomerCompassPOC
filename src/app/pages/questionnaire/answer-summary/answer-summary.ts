import { Component, computed, inject, input, output, signal } from '@angular/core';
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

/**
 * The person's answers so far. `pane` is the narrow running summary beside the
 * questions (a collapsible block above them on small screens); `list` is the full
 * review after the last step. Either way, choosing an answer asks the parent to
 * go back to its step.
 */
@Component({
  selector: 'app-answer-summary',
  imports: [MatIconModule],
  templateUrl: './answer-summary.html',
  styleUrl: './answer-summary.scss',
})
export class AnswerSummary {
  readonly variant = input<'pane' | 'list'>('pane');
  readonly edit = output<number>();

  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(AnswersStore);

  /** Every visible question grouped by step, including skipped optional ones (review list). */
  protected readonly groups = computed(() => {
    const items = this.buildItems();
    return STEPS.map((step, stepIndex) => ({
      step,
      stepIndex,
      items: items.filter((item) => item.stepIndex === stepIndex),
    }));
  });

  /** Only the answered questions, and only steps that have some (pane). */
  protected readonly answeredGroups = computed(() =>
    this.groups()
      .map((group) => ({ ...group, items: group.items.filter((item) => item.value !== null) }))
      .filter((group) => group.items.length),
  );

  protected readonly answeredCount = computed(() =>
    this.answeredGroups().reduce((n, group) => n + group.items.length, 0),
  );

  /** Small screens only: whether the pane's list is shown. */
  protected readonly expanded = signal(false);

  protected choose(stepIndex: number): void {
    this.expanded.set(false);
    this.edit.emit(stepIndex);
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
}
