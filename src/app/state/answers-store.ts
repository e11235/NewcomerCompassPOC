import { Injectable, signal } from '@angular/core';
import {
  AnswerValue,
  AnswerValues,
  isAnswered,
  QuestionId,
  SituationId,
} from '../pages/questionnaire/questionnaire-config';

/** Everything the person has told us, in one object. */
export interface QuestionnaireAnswers {
  situation: SituationId | null;
  values: AnswerValues;
}

/**
 * Questionnaire answers and progress, kept in memory only: they survive moving
 * between pages but are never logged, stored in the browser or sent anywhere.
 */
@Injectable({ providedIn: 'root' })
export class AnswersStore {
  private readonly state = signal<QuestionnaireAnswers>({ situation: null, values: {} });

  /** The answers object, read by the questionnaire and available to the results page. */
  readonly answers = this.state.asReadonly();

  /** Index into STEPS of the part being answered; earlier parts stay on screen, locked. */
  readonly step = signal(0);

  setSituation(situation: SituationId): void {
    this.state.update((s) => ({ ...s, situation }));
  }

  setAnswer(id: QuestionId, value: AnswerValue): void {
    this.state.update((s) => {
      const values = { ...s.values };
      if (isAnswered(value)) {
        values[id] = value;
      } else {
        delete values[id];
      }
      return { ...s, values };
    });
  }

  clearAnswer(id: QuestionId): void {
    this.setAnswer(id, '');
  }
}
