import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ChatSidePanel } from '../../chat/chat-side-panel/chat-side-panel';
import { GcFooter, GcHeader } from '../../gc-layout/gc-layout';
import { I18n } from '../../i18n/i18n';
import { AnswersStore } from '../../state/answers-store';
import { AnswerSummary } from './answer-summary/answer-summary';
import { QuestionStep } from './question-step/question-step';
import {
  isAnswered,
  isStepComplete,
  isVisible,
  SITUATIONS,
  SituationId,
  STEPS,
} from './questionnaire-config';
import { SituationPicker } from './situation-picker/situation-picker';

/**
 * First page: pick a situation, then answer one step of questions at a time,
 * then review. Everything happens on this one route, with the answers so far in
 * a pane beside the questions; answers live in AnswersStore.
 */
@Component({
  selector: 'app-questionnaire',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    AnswerSummary,
    ChatSidePanel,
    GcFooter,
    GcHeader,
    QuestionStep,
    SituationPicker,
  ],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.scss',
})
export class Questionnaire {
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(AnswersStore);
  protected readonly totalSteps = STEPS.length;

  /** The situation grid shows until a situation is chosen, and again after "Change". */
  protected readonly pickerOpen = signal(this.store.answers().situation === null);

  protected readonly situation = computed(() =>
    SITUATIONS.find((s) => s.id === this.store.answers().situation),
  );
  protected readonly stepIndex = this.store.step;
  protected readonly finished = this.store.finished;
  /** The current step in a one-item list, so the step's content re-renders (and fades in) on change. */
  protected readonly currentStep = computed(() => (this.finished() ? [] : [STEPS[this.stepIndex()]]));
  protected readonly stepComplete = computed(() => {
    const [step] = this.currentStep();
    return step ? isStepComplete(step, this.store.answers().values) : false;
  });

  /**
   * Visible questions still without an answer. Optional questions stop counting
   * once the person has moved past their step.
   */
  protected readonly questionsLeft = computed(() => {
    const values = this.store.answers().values;
    const current = this.stepIndex();
    return STEPS.reduce(
      (count, step, index) =>
        count +
        step.questions.filter(
          (q) => isVisible(q, values) && !isAnswered(values[q.id]) && (!q.optional || index >= current),
        ).length,
      0,
    );
  });
  protected readonly progress = computed(() => {
    const values = this.store.answers().values;
    const total = STEPS.flatMap((step) => step.questions.filter((q) => isVisible(q, values))).length;
    return total ? ((total - this.questionsLeft()) / total) * 100 : 0;
  });

  /** Read out by screen readers when the screen changes. */
  protected readonly announcement = signal('');

  private readonly pageHeading = viewChild<ElementRef<HTMLElement>>('pageHeading');
  private readonly stepHeading = viewChild<ElementRef<HTMLElement>>('stepHeading');

  protected chooseSituation(id: SituationId): void {
    this.store.setSituation(id);
    this.pickerOpen.set(false);
    this.showStep(this.stepIndex());
  }

  protected changeSituation(): void {
    this.pickerOpen.set(true);
    this.announcement.set(this.t().questionnaire.title);
    this.focusAfterRender(() => this.pageHeading());
  }

  protected back(): void {
    if (this.stepIndex() === 0) {
      this.changeSituation();
    } else {
      this.showStep(this.stepIndex() - 1);
    }
  }

  protected continue(): void {
    if (this.stepComplete()) {
      this.showStep(this.stepIndex() + 1);
    }
  }

  /** From the answers pane: go back to a step, closing the situation picker if it's open. */
  protected editStep(index: number): void {
    if (this.store.answers().situation !== null) {
      this.pickerOpen.set(false);
    }
    this.showStep(index);
  }

  /** Go to a step (or, past the last one, the review) and move focus to its heading. */
  protected showStep(index: number): void {
    this.stepIndex.set(index);
    const t = this.t().questionnaire;
    this.announcement.set(
      index >= this.totalSteps
        ? t.reviewHeading
        : `${STEPS[index].title[this.i18n.lang()]}. ${t.questionsLeft(this.questionsLeft())}`,
    );
    this.focusAfterRender(() => this.stepHeading());
  }

  protected submit(): void {
    this.router.navigate(['/results']);
  }

  private focusAfterRender(target: () => ElementRef<HTMLElement> | undefined): void {
    afterNextRender(() => target()?.nativeElement.focus(), { injector: this.injector });
  }
}
