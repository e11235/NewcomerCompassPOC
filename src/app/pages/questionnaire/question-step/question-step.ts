import { Component, computed, inject, input, signal } from '@angular/core';
import { I18n } from '../../../i18n/i18n';
import { AnswersStore } from '../../../state/answers-store';
import { AnswerValue, isVisible, Question, QuestionId, Step } from '../questionnaire-config';

/** Matches a full Canadian postal code (A1A 1A1), which we never keep. */
const FULL_POSTAL_CODE = /^\s*[a-z]\d[a-z][\s-]*\d[a-z]\d\s*$/i;

/** The questions of one step. Answers go straight into the AnswersStore. */
@Component({
  selector: 'app-question-step',
  templateUrl: './question-step.html',
  styleUrl: './question-step.scss',
})
export class QuestionStep {
  readonly step = input.required<Step>();

  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  private readonly store = inject(AnswersStore);

  protected readonly answers = computed(() => this.store.answers().values);
  protected readonly questions = computed(() =>
    this.step().questions.filter((q) => isVisible(q, this.answers())),
  );
  protected readonly postalTrimmed = signal(false);

  protected value(id: QuestionId): AnswerValue | undefined {
    return this.answers()[id];
  }

  protected isChecked(id: QuestionId, option: string): boolean {
    const value = this.value(id);
    return Array.isArray(value) && value.includes(option);
  }

  protected setValue(id: QuestionId, value: AnswerValue): void {
    this.store.setAnswer(id, value);
    // Drop answers to questions that are now hidden, so they aren't kept by mistake.
    for (const q of this.step().questions) {
      if (!isVisible(q, this.store.answers().values)) {
        this.store.clearAnswer(q.id);
      }
    }
  }

  protected toggle(id: QuestionId, option: string, checked: boolean): void {
    const current = this.value(id);
    const list = Array.isArray(current) ? current : [];
    this.setValue(id, checked ? [...list, option] : list.filter((v) => v !== option));
  }

  protected onText(id: QuestionId, input: HTMLInputElement): void {
    let text = input.value;
    const trimmed = FULL_POSTAL_CODE.test(text);
    if (trimmed) {
      text = text.trim().slice(0, 3).toUpperCase();
      input.value = text;
    }
    this.postalTrimmed.set(trimmed);
    this.setValue(id, text);
  }

  protected describedBy(question: Question): string | null {
    const ids = [];
    if (question.helper) {
      ids.push(`${question.id}-helper`);
    }
    if (question.kind === 'text' && this.postalTrimmed()) {
      ids.push(`${question.id}-notice`);
    }
    return ids.length ? ids.join(' ') : null;
  }
}
