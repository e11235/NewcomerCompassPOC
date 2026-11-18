import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CONTENT } from '../../content/content-data';
import type { Question } from '../../content/types';
import { checkCity } from '../../engine/chat-matcher';
import { I18n } from '../../i18n/i18n';
import { Icon } from '../../shared/icon';
import { JourneyStore } from '../../state/journey-store';
import { ProgressBar } from './progress-bar';

/** Questions with more options than this use a dropdown in the form (buttons in the chat). */
export const MAX_RADIO_OPTIONS = 5;

/** Option 1: one question at a time, with Back / Continue. */
@Component({
  selector: 'app-question-form',
  imports: [Icon, ProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (question(); as q) {
      <div class="mx-auto max-w-2xl">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <app-progress-bar [current]="index() + 1" [total]="asked().length" [label]="t().questionOf(index() + 1, asked().length)" />
          <button type="button" class="btn btn-ghost btn-sm no-print underline underline-offset-4" (click)="store.startChat()">
            <app-icon name="messages-square" />{{ t().switchToChat }}
          </button>
        </div>
        <p class="mt-2 text-xs text-muted-foreground">{{ t().onlyNeeded }}</p>

        @if (error(); as message) {
          <div
            #errorBox
            tabindex="-1"
            role="alert"
            class="mt-6 rounded-xl border-2 border-red-700 p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <p class="flex items-center gap-2 font-bold"><app-icon name="circle-alert" class="size-5 text-red-700" />{{ message }}</p>
          </div>
        }

        <form class="mt-6" novalidate (submit)="$event.preventDefault(); submit()">
          <fieldset class="space-y-4" [class]="error() ? 'border-s-4 border-red-700 ps-4' : ''" [attr.aria-describedby]="q.hint ? hintId() : null">
            <legend #legend [id]="labelId()" tabindex="-1" class="text-2xl leading-snug font-bold outline-none">{{ i18n.pick(q.label) }}</legend>
            @if (q.hint) {
              <p [id]="hintId()" class="text-muted-foreground">{{ i18n.pick(q.hint) }}</p>
            }

            @if (q.kind === 'text') {
              <div class="max-w-md">
                <input
                  [id]="'q-' + q.id"
                  class="field-input h-14 rounded-xl border-2 bg-card px-4 text-base md:text-base"
                  [value]="textValue()"
                  (input)="draft.set({ id: q.id, text: $any($event.target).value }); error.set(null)"
                  [attr.aria-labelledby]="labelId()"
                  [attr.aria-describedby]="(q.hint ? hintId() + ' ' : '') + 'q-' + q.id + '-example'"
                  [attr.aria-invalid]="!!error()"
                  autocomplete="address-level2"
                  maxlength="80"
                />
                <p [id]="'q-' + q.id + '-example'" class="mt-1.5 text-sm text-muted-foreground">{{ t().cityExample }}</p>
              </div>
            } @else if ((q.options?.length ?? 0) > maxRadio) {
              <div class="max-w-md">
                <label [for]="'q-' + q.id" class="sr-only">{{ i18n.pick(q.label) }}</label>
                <select
                  [id]="'q-' + q.id"
                  (change)="choose(q, $any($event.target).value)"
                  [attr.aria-invalid]="!!error()"
                  [attr.aria-describedby]="q.hint ? hintId() : null"
                  class="h-14 w-full rounded-xl border-2 border-input bg-card px-4 text-base focus-visible:border-[#26374a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <option value="" disabled [selected]="!selected()">{{ t().selectPlaceholder }}</option>
                  @for (o of q.options; track o.value) {
                    <option [value]="o.value" [selected]="selected() === o.value">{{ i18n.pick(o.label) }}</option>
                  }
                </select>
              </div>
            } @else {
              <div role="radiogroup" class="grid gap-2" [attr.aria-labelledby]="labelId()" [attr.aria-invalid]="!!error()">
                @for (o of q.options; track o.value) {
                  <label
                    class="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 bg-card px-4 py-3 text-base transition-colors hover:border-[#26374a]/50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
                    [class]="selected() === o.value ? 'border-[#26374a] bg-[#26374a]/5' : 'border-border'"
                  >
                    <input
                      type="radio"
                      class="peer sr-only"
                      [name]="'q-' + q.id"
                      [value]="o.value"
                      [checked]="selected() === o.value"
                      (change)="choose(q, o.value)"
                    />
                    <span
                      class="flex size-4 shrink-0 items-center justify-center rounded-full border shadow-xs"
                      [class]="selected() === o.value ? 'border-primary' : 'border-input'"
                      aria-hidden="true"
                    >
                      @if (selected() === o.value) {
                        <span class="size-2 rounded-full bg-primary"></span>
                      }
                    </span>
                    <span class="flex-1">{{ i18n.pick(o.label) }}</span>
                    <app-icon name="check" class="size-5 text-[#26374a]" [class.opacity-0]="selected() !== o.value" />
                  </label>
                }
              </div>
            }

            @if (q.why) {
              <div>
                <button
                  type="button"
                  class="group inline-flex min-h-10 items-center gap-1.5 rounded-sm text-sm font-semibold text-blue-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  [attr.aria-expanded]="whyOpen()"
                  [attr.aria-controls]="'why-' + q.id"
                  (click)="whyOpen.set(!whyOpen())"
                >
                  <app-icon name="chevron-down" class="size-4 transition-transform" [class.rotate-180]="whyOpen()" />{{ t().whyAsk }}
                </button>
                @if (whyOpen()) {
                  <div [id]="'why-' + q.id" class="mt-1 rounded-xl bg-muted p-3 text-sm">
                    <p>{{ i18n.pick(q.why) }}</p>
                  </div>
                }
              </div>
            }
          </fieldset>

          <div class="mt-10 flex flex-wrap gap-3 border-t pt-6">
            <button type="button" class="btn btn-outline btn-lg" (click)="back()">{{ t().back }}</button>
            <button type="submit" class="btn btn-primary btn-lg min-w-40">{{ isLast() ? t().reviewAnswersCta : t().continue }}</button>
            @if (q.kind === 'text' && !q.required) {
              <button type="button" class="btn btn-ghost btn-lg underline underline-offset-4" (click)="skip(q)">{{ t().skipQuestion }}</button>
            }
          </div>
        </form>

        <!-- Demo tools for reviewers -->
        <div class="no-print mt-12 rounded-xl border border-dashed border-foreground/30 p-4">
          <button
            type="button"
            class="group inline-flex items-center gap-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            [attr.aria-expanded]="toolsOpen()"
            aria-controls="demo-tools"
            (click)="toolsOpen.set(!toolsOpen())"
          >
            <app-icon name="chevron-down" class="size-4 transition-transform" [class.rotate-180]="toolsOpen()" />{{ t().reviewTitle }}
          </button>
          @if (toolsOpen()) {
            <div id="demo-tools" class="mt-3 space-y-3 text-sm">
              <p>{{ t().reviewBody }}</p>
              <nav [attr.aria-label]="t().reviewStepsNav">
                <ol class="flex flex-wrap gap-2">
                  @for (a of asked(); track a.question.id; let i = $index) {
                    <li>
                      <button
                        type="button"
                        [attr.aria-current]="i === index() ? 'step' : null"
                        (click)="store.formIndex.set(i)"
                        class="rounded-full border px-3 py-1 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        [class]="i === index() ? 'border-[#26374a] bg-[#26374a] text-white' : 'hover:bg-accent'"
                      >
                        {{ i + 1 }}. {{ i18n.pick(a.question.summaryLabel) }}
                      </button>
                    </li>
                  }
                </ol>
              </nav>
              @if (hasSample) {
                <button type="button" class="btn btn-outline btn-sm" (click)="store.showSample()">{{ t().reviewSkipToSample }}</button>
              }
              <div>
                <button
                  type="button"
                  class="group inline-flex items-center gap-1.5 font-semibold text-blue-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
                  [attr.aria-expanded]="allOpen()"
                  aria-controls="all-questions"
                  (click)="allOpen.set(!allOpen())"
                >
                  <app-icon name="chevron-down" class="size-4 transition-transform" [class.rotate-180]="allOpen()" />{{
                    t().reviewAllToggle
                  }}
                </button>
                @if (allOpen()) {
                  <ol id="all-questions" class="mt-3 list-decimal space-y-2 ps-6">
                    @for (row of allQuestions(); track row.id) {
                      <li>
                        {{ row.label }}
                        <span class="block text-muted-foreground">{{ row.note }}</span>
                      </li>
                    }
                  </ol>
                }
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class QuestionForm {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);
  protected readonly maxRadio = MAX_RADIO_OPTIONS;
  protected readonly hasSample = !!CONTENT.scenario.sampleJourney;

  protected readonly asked = this.store.asked;
  protected readonly index = computed(() => Math.min(this.store.formIndex(), this.asked().length - 1));
  protected readonly question = computed(() => this.asked()[this.index()]?.question);
  protected readonly isLast = computed(() => this.index() === this.asked().length - 1);
  protected readonly labelId = computed(() => `q-${this.question()?.id}-label`);
  protected readonly hintId = computed(() => `q-${this.question()?.id}-hint`);
  protected readonly selected = computed(() => {
    const q = this.question();
    const v = q ? this.store.answers()[q.id] : undefined;
    return typeof v === 'string' ? v : '';
  });
  /** The city being typed, before it is checked and saved. */
  protected readonly draft = signal<{ id: string; text: string } | null>(null);
  protected readonly textValue = computed(() => {
    const d = this.draft();
    return d && d.id === this.question()?.id ? d.text : this.selected();
  });

  protected readonly error = signal<string | null>(null);
  protected readonly whyOpen = signal(false);
  protected readonly toolsOpen = signal(false);
  protected readonly allOpen = signal(false);

  private readonly legend = viewChild<ElementRef<HTMLElement>>('legend');
  private readonly errorBox = viewChild<ElementRef<HTMLElement>>('errorBox');

  protected readonly allQuestions = computed(() => {
    const t = this.t();
    const askedIds = new Set(this.asked().map((a) => a.question.id));
    const byId = new Map(CONTENT.questions.map((q) => [q.id, q]));
    return CONTENT.scenario.questionOrder
      .map((id) => byId.get(id))
      .filter((q): q is Question => !!q)
      .map((q) => {
        const parent = q.showIf?.q ? byId.get(q.showIf.q) : undefined;
        const purpose =
          q.purpose === 'navigation'
            ? t.reviewNavigationOnly
            : askedIds.has(q.id)
              ? t.askedNow
              : parent
                ? t.reviewFollowUp(this.i18n.pick(parent.summaryLabel))
                : t.notAskedNoRule;
        const control =
          q.kind === 'text' ? t.controlText : (q.options?.length ?? 0) > MAX_RADIO_OPTIONS ? t.controlDropdown : t.controlButtons;
        return { id: q.id, label: this.i18n.pick(q.label), note: `${purpose} · ${control}` };
      });
  });

  constructor() {
    // A new question: clear the error, close "Why we ask this", and move focus to the question.
    let first = true;
    effect(() => {
      this.index();
      this.error.set(null);
      this.whyOpen.set(false);
      if (first) {
        first = false;
        return;
      }
      requestAnimationFrame(() => this.legend()?.nativeElement.focus());
    });
  }

  protected choose(q: Question, value: string): void {
    this.store.answer(q.id, value);
    this.error.set(null);
  }

  private showError(message: string): void {
    this.error.set(message);
    requestAnimationFrame(() => this.errorBox()?.nativeElement.focus());
  }

  private advance(questionId: string): void {
    const asked = this.store.asked();
    const i = asked.findIndex((a) => a.question.id === questionId);
    if (i === asked.length - 1) this.store.review();
    else this.store.formIndex.set(i + 1);
  }

  protected submit(): void {
    const q = this.question();
    if (!q) return;
    if (q.kind === 'text') {
      const check = checkCity(this.textValue());
      if (!check.ok && check.reason !== 'empty') {
        if (check.reason === 'identifier') this.draft.set({ id: q.id, text: '' });
        const t = this.t();
        this.showError(
          check.reason === 'identifier' ? t.cityErrIdentifier : check.reason === 'tooPrecise' ? t.cityErrTooPrecise : t.cityErrTooLong,
        );
        return;
      }
      this.store.answer(q.id, check.ok ? check.value : '');
      this.advance(q.id);
      return;
    }
    if (!this.selected()) {
      this.showError(this.t().chooseAnswer);
      return;
    }
    this.advance(q.id);
  }

  protected skip(q: Question): void {
    this.draft.set({ id: q.id, text: '' });
    this.store.answer(q.id, '');
    this.advance(q.id);
  }

  protected back(): void {
    if (this.index() === 0) this.store.view.set('choose');
    else this.store.formIndex.set(this.index() - 1);
  }
}
