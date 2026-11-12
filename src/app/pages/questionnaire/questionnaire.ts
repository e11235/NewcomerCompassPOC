import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChildren,
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
import { QuestionSet } from './question-set/question-set';
import { isStepComplete, SITUATIONS, SituationId, STEPS } from './questionnaire-config';
import { SituationPicker } from './situation-picker/situation-picker';

/**
 * First page: pick a situation, then answer three parts of dropdown questions.
 * Each part appears below the one before it; earlier parts stay on screen,
 * faded and locked. Answers live in AnswersStore.
 */
@Component({
  selector: 'app-questionnaire',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    ChatSidePanel,
    GcFooter,
    GcHeader,
    QuestionSet,
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
  /** The parts on screen: every part up to and including the current one. */
  protected readonly shownSteps = computed(() => STEPS.slice(0, this.stepIndex() + 1));
  protected readonly isLastStep = computed(() => this.stepIndex() === this.totalSteps - 1);
  protected readonly stepComplete = computed(() =>
    isStepComplete(STEPS[this.stepIndex()], this.store.answers().values),
  );

  /** Read out by screen readers when the screen changes. */
  protected readonly announcement = signal('');

  private readonly pageHeading = viewChild<ElementRef<HTMLElement>>('pageHeading');
  private readonly stepHeadings = viewChildren<ElementRef<HTMLElement>>('stepHeading');

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

  /** Back to the previous part (its answers are kept), or to the situations from the first. */
  protected back(): void {
    if (this.stepIndex() === 0) {
      this.changeSituation();
    } else {
      this.showStep(this.stepIndex() - 1);
    }
  }

  protected next(): void {
    if (!this.stepComplete()) {
      return;
    }
    if (this.isLastStep()) {
      this.router.navigate(['/results']);
    } else {
      this.showStep(this.stepIndex() + 1);
    }
  }

  /** Make a part the current one and move focus to its heading. */
  private showStep(index: number): void {
    this.stepIndex.set(index);
    const step = STEPS[index];
    this.announcement.set(
      `${this.t().questionnaire.partOf(index + 1, this.totalSteps)}: ${step.title[this.i18n.lang()]}`,
    );
    this.focusAfterRender(() => this.stepHeadings()[index]);
  }

  private focusAfterRender(target: () => ElementRef<HTMLElement> | undefined): void {
    afterNextRender(() => target()?.nativeElement.focus(), { injector: this.injector });
  }
}
