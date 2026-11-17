import { computed, Injectable, signal } from '@angular/core';
import { CONTENT } from '../content/content-data';
import type { AnswerValue, Answers } from '../content/types';
import {
  allAnswered,
  askedQuestions,
  buildHandoffs,
  buildJourney,
  buildRoadmap,
  eligibilityAnswers,
  evaluate,
  relevantAnswers,
  withAnswer,
} from '../engine/rules';

export type Screen = 'situation' | 'questions' | 'roadmap';
export const SCREENS: Screen[] = ['situation', 'questions', 'roadmap'];
/** Within the questions screen: choose how to answer, the form, the chat, or the review. */
export type QuestionsView = 'choose' | 'form' | 'chat' | 'review';

/**
 * Everything about the person's journey through Newcomer Compass. Answers live
 * in memory only: never logged, stored in the browser or sent anywhere.
 */
@Injectable({ providedIn: 'root' })
export class JourneyStore {
  readonly screen = signal<Screen>('situation');
  readonly situationId = signal<string | null>(null);
  readonly answers = signal<Answers>({});
  readonly view = signal<QuestionsView>('choose');
  /** The last way of answering used, so "Back" from the review returns there. */
  readonly lastMode = signal<'form' | 'chat'>('form');
  /** The chat question being changed, if any. */
  readonly editing = signal<string | null>(null);
  /** Index of the question shown in the form. */
  readonly formIndex = signal(0);
  readonly roadmapReady = signal(false);
  /** Program ids the person has ticked off on the roadmap. */
  readonly completed = signal<ReadonlySet<string>>(new Set());
  readonly sampleActive = signal(false);
  readonly helpOpen = signal(false);

  readonly situation = computed(() => CONTENT.scenario.situations.find((s) => s.id === this.situationId()));
  readonly asked = computed(() => {
    const id = this.situationId();
    return id ? askedQuestions(id, this.answers()) : [];
  });
  private readonly eligibility = computed(() => {
    const id = this.situationId();
    return id ? eligibilityAnswers(id, this.answers()) : {};
  });
  private readonly results = computed(() => (this.roadmapReady() ? evaluate(this.eligibility()) : null));
  readonly journey = computed(() => {
    const results = this.results();
    return results ? buildJourney(results) : null;
  });
  readonly handoffs = computed(() => {
    const journey = this.journey();
    const results = this.results();
    return journey && results ? buildHandoffs(journey, results, this.eligibility()) : [];
  });
  readonly roadmap = computed(() => {
    const journey = this.journey();
    return journey ? buildRoadmap(journey, new Set(this.completed())) : null;
  });

  /** Whether the progress step can be opened. */
  canOpen(screen: Screen): boolean {
    return screen === 'situation' || (screen === 'questions' && !!this.situationId()) || this.roadmapReady();
  }

  isPast(screen: Screen): boolean {
    return SCREENS.indexOf(screen) < SCREENS.indexOf(this.screen()) && this.canOpen(screen);
  }

  pickSituation(id: string): void {
    if (id !== this.situationId()) this.answers.set({});
    this.situationId.set(id);
    this.formIndex.set(0);
    this.editing.set(null);
    this.view.set('choose');
    this.roadmapReady.set(false);
    this.sampleActive.set(false);
    this.screen.set('questions');
  }

  answer(questionId: string, value: AnswerValue): void {
    const id = this.situationId();
    if (!id) return;
    this.answers.update((a) => withAnswer(id, a, questionId, value));
    this.sampleActive.set(false);
  }

  /** The first unanswered question (or the last one). */
  private firstOpenIndex(): number {
    const asked = this.asked();
    const i = asked.findIndex((a) => this.answers()[a.question.id] === undefined);
    return i < 0 ? Math.max(asked.length - 1, 0) : i;
  }

  startForm(index = this.firstOpenIndex()): void {
    this.formIndex.set(index);
    this.lastMode.set('form');
    this.view.set('form');
  }

  startChat(editing: string | null = null): void {
    this.editing.set(editing);
    this.lastMode.set('chat');
    this.view.set('chat');
  }

  editAnswer(questionId: string): void {
    if (this.lastMode() === 'chat') {
      this.startChat(questionId);
    } else {
      this.startForm(Math.max(this.asked().findIndex((a) => a.question.id === questionId), 0));
    }
  }

  review(): void {
    this.view.set('review');
    this.screen.set('questions');
  }

  backFromReview(): void {
    if (this.lastMode() === 'chat') this.startChat();
    else this.startForm(Math.max(this.asked().length - 1, 0));
  }

  switchFromReview(): void {
    if (this.lastMode() === 'chat') this.startForm();
    else this.startChat();
  }

  continueToRoadmap(): void {
    const id = this.situationId();
    if (!id) return;
    if (!allAnswered(id, this.answers())) {
      this.backFromReview();
      return;
    }
    this.roadmapReady.set(true);
    this.screen.set('roadmap');
  }

  /** Jumps straight to a made-up person's roadmap. */
  showSample(): void {
    const sample = CONTENT.scenario.sampleJourney;
    if (!sample) return;
    this.situationId.set(sample.situationId);
    this.answers.set(relevantAnswers(sample.situationId, sample.answers));
    this.view.set('review');
    this.completed.set(new Set());
    this.roadmapReady.set(true);
    this.sampleActive.set(true);
    this.screen.set('roadmap');
  }

  toggleComplete(programId: string): void {
    this.completed.update((set) => {
      const next = new Set(set);
      if (next.has(programId)) next.delete(programId);
      else next.add(programId);
      return next;
    });
  }

  startOver(): void {
    this.answers.set({});
    this.situationId.set(null);
    this.formIndex.set(0);
    this.view.set('choose');
    this.editing.set(null);
    this.roadmapReady.set(false);
    this.completed.set(new Set());
    this.sampleActive.set(false);
    this.screen.set('situation');
  }
}
