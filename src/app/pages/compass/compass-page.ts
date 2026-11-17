import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { CONTENT } from '../../content/content-data';
import { I18n } from '../../i18n/i18n';
import { Icon } from '../../shared/icon';
import { LogoLockup } from '../../shared/logo';
import { JourneyStore, SCREENS, type Screen } from '../../state/journey-store';
import { GuidedChat } from './guided-chat';
import { ModeChoice } from './mode-choice';
import { QuestionForm } from './question-form';
import { ReviewAnswers } from './review-answers';
import { RoadmapView } from './roadmap/roadmap';
import { SituationPicker } from './situation-picker';

/**
 * The Newcomer Compass journey on one page, as in the click-through prototype:
 * 1 Your situation → 2 Questions → 3 Your roadmap.
 */
@Component({
  selector: 'app-compass-page',
  imports: [GuidedChat, Icon, LogoLockup, ModeChoice, QuestionForm, ReviewAnswers, RoadmapView, SituationPicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      <nav [attr.aria-label]="t().progressNav" class="no-print mb-8">
        <ol class="flex gap-1 overflow-x-auto pb-1 text-sm">
          @for (s of screens; track s; let i = $index, last = $last) {
            <li class="flex shrink-0 items-center gap-1">
              <button
                type="button"
                [disabled]="!store.canOpen(s)"
                [attr.aria-current]="s === store.screen() ? 'step' : null"
                (click)="store.screen.set(s)"
                class="inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-1.5 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
                [class]="s === store.screen() ? 'bg-[#26374a] text-white' : store.canOpen(s) ? 'hover:bg-accent' : ''"
              >
                <span
                  aria-hidden="true"
                  class="flex size-6 items-center justify-center rounded-full border-2 text-xs font-bold"
                  [class]="s === store.screen() ? 'border-white' : store.isPast(s) ? 'border-green-800 bg-green-800 text-white' : 'border-current'"
                >
                  @if (store.isPast(s)) {
                    <app-icon name="check" class="size-3.5" />
                  } @else {
                    {{ i + 1 }}
                  }
                </span>
                {{ t().screens[s] }}
                @if (store.isPast(s)) {
                  <span class="sr-only"> ({{ t().roadmapStatus.done }})</span>
                }
              </button>
              @if (!last) {
                <span aria-hidden="true" class="h-px w-6 bg-border"></span>
              }
            </li>
          }
        </ol>
      </nav>

      <div id="content" tabindex="-1" class="outline-none">
        @if (store.screen() === 'situation') {
          <!-- Main page: the full Newcomer Compass logo beside the question. -->
          <div class="no-print flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="max-w-3xl">
              <h1 #heading tabindex="-1" class="text-3xl leading-tight font-bold outline-none sm:text-4xl">{{ t().situationTitle }}</h1>
              <p class="mt-4 text-lg">{{ t().noProgramNeeded }}</p>
              @if (someUnavailable) {
                <p class="mt-2 text-base text-muted-foreground">{{ t().prototypeScope }}</p>
              }
            </div>
            <app-logo-lockup class="shrink-0 [--mark-size:4.5rem] [--word-size:1.15rem] sm:[--mark-size:6.5rem] sm:[--word-size:1.5rem]" />
          </div>
          <app-situation-picker />
        } @else {
          <div class="no-print mb-6 flex flex-wrap items-end justify-between gap-3">
            <h1 #heading tabindex="-1" class="max-w-4xl text-3xl leading-tight font-bold outline-none sm:text-4xl">{{ title() }}</h1>
            <button type="button" class="btn btn-ghost underline underline-offset-4" (click)="store.startOver()">
              <app-icon name="rotate-ccw" />{{ t().startOver }}
            </button>
          </div>
        }

        @if (store.screen() === 'questions' && store.situationId()) {
          @switch (store.view()) {
            @case ('choose') {
              <app-mode-choice />
            }
            @case ('form') {
              <app-question-form />
            }
            @case ('chat') {
              <app-guided-chat />
            }
            @case ('review') {
              <app-review-answers />
            }
          }
        }

        @if (store.screen() === 'roadmap') {
          @if (store.sampleActive() && sample) {
            <p class="no-print mb-6 max-w-3xl rounded-xl border border-dashed border-foreground/40 p-3 text-sm">
              <strong>{{ i18n.pick(sample.label) }}</strong> {{ t().sampleActiveNotice }}
            </p>
          }
          <app-roadmap />
        }
      </div>
    </div>
  `,
})
export class CompassPage {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);
  protected readonly screens = SCREENS;
  protected readonly sample = CONTENT.scenario.sampleJourney;
  protected readonly someUnavailable = CONTENT.scenario.situations.some((s) => !s.available);
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');

  protected readonly title = computed(() => {
    const titles: Record<Screen, string> = {
      situation: this.t().situationTitle,
      questions: this.i18n.pick(this.store.situation()?.label) || this.t().screens.questions,
      roadmap: this.t().roadmapTitle,
    };
    return titles[this.store.screen()];
  });

  constructor() {
    // Each new screen starts at the top, with focus on its heading.
    let first = true;
    effect(() => {
      this.store.screen();
      this.store.view();
      if (first) {
        first = false;
        return;
      }
      requestAnimationFrame(() => {
        this.heading()?.nativeElement.focus();
        window.scrollTo({ top: 0 });
      });
    });
  }
}
