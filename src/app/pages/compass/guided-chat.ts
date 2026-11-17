import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { AnswerValue, Question } from '../../content/types';
import { answerText, checkCity, interpretTyped, type IdentifierKind } from '../../engine/chat-matcher';
import { I18n } from '../../i18n/i18n';
import { Icon } from '../../shared/icon';
import { LogoMark } from '../../shared/logo';
import { JourneyStore } from '../../state/journey-store';
import { ProgressBar } from './progress-bar';

/** A message from the guide, with the logo mark as its avatar. */
@Component({
  selector: 'app-guide-says',
  imports: [LogoMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex items-start gap-3' },
  template: `
    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-white p-0.5 ring-1 ring-border">
      <app-logo-mark class="size-7" />
    </span>
    <div
      class="max-w-[85%] rounded-2xl rounded-ss-sm px-4 py-3"
      [class]="tone() === 'warn' ? 'border-2 border-amber-500 bg-amber-50 text-amber-950' : 'bg-muted'"
    >
      <ng-content />
    </div>
  `,
})
export class GuideSays {
  readonly tone = input<'warn' | undefined>(undefined);
}

const pillClass = (pressed: boolean) =>
  `inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 py-1.5 text-start text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
    pressed ? 'border-[#26374a] bg-[#26374a] text-white' : 'border-[#26374a]/40 bg-background hover:border-[#26374a] hover:bg-accent'
  }`;

type Reply =
  | { kind: 'identifier'; what: IdentifierKind }
  | { kind: 'cityError'; message: string }
  | { kind: 'unclear'; foreignTax?: boolean }
  | { kind: 'why' }
  | { kind: 'confirm'; value: string };

/** The current question in the chat: answer buttons, plus a box to type a short answer. */
@Component({
  selector: 'app-chat-question',
  imports: [GuideSays, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mt-4 block space-y-3', 'aria-live': 'polite' },
  template: `
    @let q = question();
    <app-guide-says>
      <p #prompt tabindex="-1" id="chat-current" class="text-lg font-semibold outline-none">{{ i18n.pick(q.label) }}</p>
      @if (q.hint) {
        <p class="mt-1 text-sm text-muted-foreground">{{ i18n.pick(q.hint) }}</p>
      }
    </app-guide-says>

    @switch (reply()?.kind) {
      @case ('identifier') {
        <app-guide-says tone="warn"><p>{{ identifierWhat() === 'sin' ? t().piiSin : t().piiGeneric }}</p></app-guide-says>
      }
      @case ('cityError') {
        <app-guide-says tone="warn"><p>{{ cityErrorText() }}</p></app-guide-says>
      }
      @case ('unclear') {
        <app-guide-says><p>{{ foreignTax() ? t().chatForeignTax : t().chatUnclear }}</p></app-guide-says>
      }
      @case ('why') {
        @if (q.why) {
          <app-guide-says><p class="text-sm">{{ i18n.pick(q.why) }}</p></app-guide-says>
        }
      }
      @case ('confirm') {
        <app-guide-says>
          <p>{{ t().chatUnderstood(confirmText()) }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" class="btn btn-primary btn-sm" (click)="commit.emit(confirmValue())">
              <app-icon name="check" />{{ t().chatYesRight }}
            </button>
            <button type="button" class="btn btn-outline btn-sm" (click)="reply.set(null)">{{ t().chatChooseAgain }}</button>
          </div>
        </app-guide-says>
      }
    }

    <div role="group" aria-labelledby="chat-current" class="flex flex-wrap gap-2 ps-0 sm:ps-11">
      @for (o of q.options ?? []; track o.value) {
        <button type="button" [attr.aria-pressed]="value() === o.value" (click)="commit.emit(o.value)" [class]="pill(value() === o.value)">
          {{ i18n.pick(o.label) }}
        </button>
      }
      @if (q.kind === 'text' && !q.required) {
        <button type="button" [attr.aria-pressed]="value() === ''" (click)="commit.emit('')" [class]="pill(value() === '')">
          {{ t().skipQuestion }}
        </button>
      }
    </div>

    <div class="flex flex-wrap gap-x-4 gap-y-1 ps-0 text-sm sm:ps-11">
      @if (q.why) {
        <button type="button" class="link min-h-10" (click)="reply.set({ kind: 'why' })">{{ t().whatDoesThisMean }}</button>
      }
      <button type="button" class="link inline-flex min-h-10 items-center gap-1" (click)="store.helpOpen.set(true)">
        <app-icon name="life-buoy" class="size-4" />{{ t().talkPerson }}
      </button>
    </div>

    <form class="flex gap-2 border-t pt-4" (submit)="$event.preventDefault(); send()">
      <label for="chat-text" class="sr-only">{{ t().chatTypeLabel }}</label>
      <input
        id="chat-text"
        class="text-input h-11 flex-1 rounded-full text-base md:text-base"
        [value]="typed()"
        (input)="typed.set($any($event.target).value)"
        [placeholder]="q.kind === 'text' ? t().cityExample : t().chatTypePlaceholder"
        autocomplete="off"
        maxlength="120"
        aria-describedby="chat-text-hint"
      />
      <button type="submit" class="btn btn-primary btn-icon size-11 rounded-full" [attr.aria-label]="t().send" [disabled]="!typed().trim()">
        <app-icon name="send-horizontal" class="flip-rtl" />
      </button>
    </form>
    <p id="chat-text-hint" class="text-xs text-muted-foreground">{{ q.kind === 'text' ? t().chatCityHint : t().chatTypeHint }}</p>
  `,
})
export class ChatQuestion {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);
  readonly question = input.required<Question>();
  readonly value = input<AnswerValue | undefined>(undefined);
  readonly focusOnMount = input(false);
  readonly commit = output<string>();

  protected readonly reply = signal<Reply | null>(null);
  protected readonly typed = signal('');
  private readonly prompt = viewChild.required<ElementRef<HTMLElement>>('prompt');
  protected readonly pill = pillClass;

  protected readonly identifierWhat = computed(() => {
    const r = this.reply();
    return r?.kind === 'identifier' ? r.what : null;
  });
  protected readonly cityErrorText = computed(() => {
    const r = this.reply();
    return r?.kind === 'cityError' ? r.message : '';
  });
  protected readonly foreignTax = computed(() => {
    const r = this.reply();
    return r?.kind === 'unclear' && !!r.foreignTax;
  });
  protected readonly confirmValue = computed(() => {
    const r = this.reply();
    return r?.kind === 'confirm' ? r.value : '';
  });
  protected readonly confirmText = computed(() =>
    answerText(this.question(), this.confirmValue(), this.i18n.lang(), this.t().noneOfThese, this.t().notAnswered),
  );

  constructor() {
    effect(() => {
      if (this.focusOnMount()) requestAnimationFrame(() => this.prompt().nativeElement.focus());
    });
  }

  protected send(): void {
    const text = this.typed();
    if (!text.trim()) return;
    const q = this.question();
    const result = interpretTyped(q, text);
    // Nothing typed is kept: only the matching choice is.
    this.typed.set('');
    if (q.kind === 'text' && result.kind !== 'identifier' && result.kind !== 'why' && result.kind !== 'help') {
      const city = checkCity(text);
      if (city.ok) this.reply.set({ kind: 'confirm', value: city.value });
      else if (city.reason === 'identifier') this.reply.set({ kind: 'identifier', what: city.what });
      else if (city.reason !== 'empty') {
        this.reply.set({ kind: 'cityError', message: city.reason === 'tooPrecise' ? this.t().cityErrTooPrecise : this.t().cityErrTooLong });
      }
      return;
    }
    switch (result.kind) {
      case 'identifier':
        this.reply.set({ kind: 'identifier', what: result.what });
        break;
      case 'match':
        this.reply.set({ kind: 'confirm', value: result.value });
        break;
      case 'why':
        this.reply.set({ kind: 'why' });
        break;
      case 'help':
        this.store.helpOpen.set(true);
        break;
      default:
        this.reply.set({ kind: 'unclear', foreignTax: result.foreignTax });
    }
  }
}

/** Option 2: the same questions as a guided conversation. */
@Component({
  selector: 'app-guided-chat',
  imports: [ChatQuestion, GuideSays, Icon, ProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <app-progress-bar
          [current]="Math.min(answeredCount() + 1, questions().length)"
          [done]="answeredCount()"
          [total]="questions().length"
          [label]="current() ? t().questionOf(questions().indexOf(current()!) + 1, questions().length) : t().allAnswered"
        />
        <button type="button" class="btn btn-ghost btn-sm underline underline-offset-4" (click)="store.startForm()">
          <app-icon name="list-checks" />{{ t().switchToForm }}
        </button>
      </div>

      <section [attr.aria-label]="t().chatTitle" class="mt-6 rounded-2xl border bg-card p-4 sm:p-6">
        <app-guide-says>
          <p class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{{ t().guideName }}</p>
          <p class="mt-1 font-semibold">{{ t().chatIntro }}</p>
          <p class="mt-2 flex items-start gap-2 text-sm">
            <app-icon name="shield-check" class="mt-0.5 size-4 text-green-800" />{{ t().chatPrivacy }}
          </p>
        </app-guide-says>

        <ol class="mt-4 space-y-4" [attr.aria-label]="t().chatHistory">
          @for (q of history(); track q.id) {
            <li class="space-y-2">
              <app-guide-says><p>{{ i18n.pick(q.label) }}</p></app-guide-says>
              <div class="flex justify-end">
                <p class="max-w-[85%] rounded-2xl rounded-se-sm bg-[#26374a] px-4 py-3 text-white">
                  <span>{{ answerFor(q) }}</span>
                  <button
                    type="button"
                    (click)="store.editing.set(q.id)"
                    class="ms-3 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    [attr.aria-label]="t().change + ': ' + i18n.pick(q.summaryLabel)"
                  >
                    <app-icon name="pencil" class="size-3.5" />{{ t().changeShort }}
                  </button>
                </p>
              </div>
              @if (store.answers()[q.id] === 'unsure') {
                <app-guide-says><p class="text-sm">{{ t().unsureOk }}</p></app-guide-says>
              }
            </li>
          }
        </ol>

        @if (current()) {
          <!-- Keyed by question, so each question starts with a fresh reply and input. -->
          @for (q of currentList(); track q.id) {
            <app-chat-question
              [question]="q"
              [value]="store.answers()[q.id]"
              [focusOnMount]="answeredHere() || !!store.editing()"
              (commit)="commit(q, $event)"
            />
          }
        } @else {
          <div class="mt-4 space-y-3">
            <app-guide-says><p class="font-semibold">{{ t().chatComplete }}</p></app-guide-says>
            <div class="ps-0 sm:ps-11">
              <button type="button" class="btn btn-primary btn-lg" (click)="store.review()">{{ t().reviewAnswersCta }}</button>
            </div>
          </div>
        }
      </section>
    </div>
  `,
})
export class GuidedChat {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);
  protected readonly Math = Math;

  protected readonly questions = computed(() => this.store.asked().map((a) => a.question));
  protected readonly current = computed(() => {
    const editing = this.store.editing();
    const answers = this.store.answers();
    return editing
      ? this.questions().find((q) => q.id === editing)
      : this.questions().find((q) => answers[q.id] === undefined);
  });
  protected readonly currentList = computed(() => {
    const q = this.current();
    return q ? [q] : [];
  });
  protected readonly answeredCount = computed(() => this.questions().filter((q) => this.store.answers()[q.id] !== undefined).length);
  protected readonly history = computed(() => {
    const qs = this.questions();
    const current = this.current();
    return (current ? qs.slice(0, qs.indexOf(current)) : qs).filter((q) => this.store.answers()[q.id] !== undefined);
  });
  /** Once someone has answered in the chat, each new question takes focus. */
  protected readonly answeredHere = signal(false);

  protected answerFor(q: Question): string {
    return answerText(q, this.store.answers()[q.id], this.i18n.lang(), this.t().noneOfThese, this.t().notAnswered);
  }

  protected commit(q: Question, value: string): void {
    this.answeredHere.set(true);
    this.store.answer(q.id, value);
    this.store.editing.set(null);
  }
}
