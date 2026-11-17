import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { Question } from '../../content/types';
import { answerText } from '../../engine/chat-matcher';
import { I18n } from '../../i18n/i18n';
import { Icon } from '../../shared/icon';
import { JourneyStore } from '../../state/journey-store';

/** "Review your answers", before the roadmap. */
@Component({
  selector: 'app-review-answers',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="review-h" class="mx-auto max-w-2xl">
      <h2 id="review-h" class="text-2xl font-bold">{{ t().reviewAnswersTitle }}</h2>
      <p class="mt-1 text-muted-foreground">{{ t().reviewAnswersLead }}</p>
      <div class="mt-6 rounded-2xl border bg-card">
        <div class="border-b px-5 py-4">
          <p class="text-sm text-muted-foreground">{{ t().screens.situation }}</p>
          <p class="font-semibold">{{ i18n.pick(store.situation()?.label) }}</p>
        </div>
        <dl class="divide-y px-5">
          @for (a of store.asked(); track a.question.id) {
            <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
              <div class="min-w-0">
                <dt class="text-sm">{{ i18n.pick(a.question.summaryLabel) }}</dt>
                <dd class="font-semibold">{{ answerFor(a.question) }}</dd>
              </div>
              <button
                type="button"
                class="btn btn-ghost btn-sm underline underline-offset-4"
                (click)="store.editAnswer(a.question.id)"
                [attr.aria-label]="t().edit + ': ' + i18n.pick(a.question.summaryLabel)"
              >
                <app-icon name="pencil" />{{ t().edit }}
              </button>
            </div>
          }
        </dl>
      </div>
      <p class="mt-4 text-sm text-muted-foreground">{{ t().reviewPrivacy }}</p>
      <button type="button" class="btn btn-ghost btn-sm mt-2 underline underline-offset-4" (click)="store.switchFromReview()">
        @if (store.lastMode() === 'chat') {
          <app-icon name="list-checks" />{{ t().switchToForm }}
        } @else {
          <app-icon name="messages-square" />{{ t().switchToChat }}
        }
      </button>
      <div class="mt-6 flex flex-wrap justify-between gap-3">
        <button type="button" class="btn btn-outline btn-lg" (click)="store.backFromReview()">
          <app-icon name="arrow-left" class="flip-rtl" />{{ t().back }}
        </button>
        <button type="button" class="btn btn-primary btn-lg" (click)="store.continueToRoadmap()">
          {{ t().continueToRoadmap }}<app-icon name="arrow-right" class="flip-rtl" />
        </button>
      </div>
    </section>
  `,
})
export class ReviewAnswers {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);

  protected answerFor(q: Question): string {
    return answerText(q, this.store.answers()[q.id], this.i18n.lang(), this.t().noneOfThese, this.t().notAnswered);
  }
}
