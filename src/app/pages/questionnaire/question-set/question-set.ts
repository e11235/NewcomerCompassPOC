import { Component, computed, inject, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { I18n } from '../../../i18n/i18n';
import { AnswersStore } from '../../../state/answers-store';
import { AnswerValue, isVisible, Question, Step } from '../questionnaire-config';

/**
 * One part of the questionnaire: a row of dropdowns. Answers go straight into
 * the AnswersStore. Once the person moves on, the part is `locked`: it stays on
 * screen, faded, with its dropdowns disabled.
 */
@Component({
  selector: 'app-question-set',
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './question-set.html',
  styleUrl: './question-set.scss',
})
export class QuestionSet {
  readonly step = input.required<Step>();
  readonly locked = input(false);

  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  private readonly store = inject(AnswersStore);

  protected readonly questions = computed(() =>
    this.step().questions.filter((q) => isVisible(q, this.store.answers().values)),
  );

  /** The current answer in the shape mat-select expects (a list for multi-select). */
  protected value(question: Question): AnswerValue | null {
    const value = this.store.answers().values[question.id];
    return question.multiple ? (value ?? []) : (value ?? null);
  }

  protected setValue(question: Question, value: AnswerValue): void {
    this.store.setAnswer(question.id, value);
    // Drop answers to questions that are now hidden, so they aren't kept by mistake.
    for (const q of this.step().questions) {
      if (!isVisible(q, this.store.answers().values)) {
        this.store.clearAnswer(q.id);
      }
    }
  }
}
