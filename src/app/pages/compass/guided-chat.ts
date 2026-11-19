import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { AnswerValue, Question } from '../../content/types';
import { answerText, checkCity, interpretTyped, sharesIdentifier, type IdentifierKind } from '../../engine/chat-matcher';
import { I18n } from '../../i18n/i18n';
import { chatFailure, FAILURE_MESSAGES } from '../../services/chat-api';
import { GuideHelpApi, MAX_HELP_CHARS, staticMeaning } from '../../services/guide-help-api';
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

/** "What does this mean?": outlined, so it is never mistaken for an answer. */
const helpPillClass =
  'inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-dashed border-[#26374a]/60 bg-transparent px-4 py-1.5 text-start text-base font-medium text-[#26374a] transition-colors hover:border-[#26374a] hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

type Reply =
  | { kind: 'identifier'; what: IdentifierKind }
  | { kind: 'cityError'; message: string }
  | { kind: 'unclear'; foreignTax?: boolean }
  | { kind: 'confirm'; value: string };

/**
 * One message in the "What does this mean?" thread. Explanations are plain text, shown with
 * interpolation only. `lang` marks the English-only static text when the page is in another language.
 */
type HelpMessage =
  | { from: 'person'; text: string }
  | { from: 'guide'; text: string; lang?: string; warn?: boolean };

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

    @for (m of help(); track $index) {
      @if (m.from === 'person') {
        <div class="flex justify-end">
          <p class="max-w-[85%] rounded-2xl rounded-se-sm border bg-background px-4 py-3">
            <span class="sr-only">{{ t().guideHelpYouAsked }}: </span>{{ m.text }}
          </p>
        </div>
      } @else {
        <app-guide-says [tone]="m.warn ? 'warn' : undefined"><p class="text-sm" [attr.lang]="m.lang">{{ m.text }}</p></app-guide-says>
      }
    }
    @if (helpPending()) {
      <app-guide-says>
        <span class="flex h-5 items-center gap-1" aria-hidden="true">
          <span class="size-1.5 animate-bounce rounded-full bg-muted-foreground"></span>
          <span class="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]"></span>
          <span class="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]"></span>
        </span>
        <span class="sr-only">{{ t().roadmapChatThinking }}</span>
      </app-guide-says>
    }

    <div #pills role="group" aria-labelledby="chat-current" class="flex scroll-mb-40 flex-wrap gap-2 ps-0 sm:ps-11">
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

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 ps-0 text-sm sm:ps-11">
      @if (meaning()) {
        <button type="button" [class]="helpPill" [attr.aria-expanded]="helpOpen()" aria-controls="chat-help" (click)="showMeaning()">
          <app-icon name="circle-question-mark" class="size-4" />{{ t().whatDoesThisMean }}
        </button>
      }
      <button type="button" class="link inline-flex min-h-10 items-center gap-1" (click)="store.helpOpen.set(true)">
        <app-icon name="life-buoy" class="size-4" />{{ t().talkPerson }}
      </button>
    </div>

    @if (helpOpen()) {
      <form
        id="chat-help"
        class="ms-0 space-y-2 rounded-2xl border-2 border-dashed border-[#26374a]/30 p-3 sm:ms-11"
        (submit)="$event.preventDefault(); askHelp()"
      >
        <label for="chat-help-text" class="block text-sm font-semibold">{{ t().guideHelpLabel }}</label>
        <div class="flex gap-2">
          <input
            #helpInput
            id="chat-help-text"
            class="field-input h-11 flex-1 rounded-full text-base md:text-base"
            [value]="helpTyped()"
            (input)="helpTyped.set($any($event.target).value)"
            [disabled]="helpPending()"
            autocomplete="off"
            [attr.maxlength]="maxHelpChars"
            aria-describedby="chat-help-notice"
          />
          <button
            type="submit"
            class="btn btn-primary btn-icon size-11 rounded-full"
            [attr.aria-label]="t().send"
            [disabled]="!helpTyped().trim() || helpPending()"
          >
            <app-icon name="send-horizontal" class="flip-rtl" />
          </button>
        </div>
        <p id="chat-help-notice" class="flex items-start gap-1.5 text-xs text-muted-foreground">
          <app-icon name="shield-check" class="mt-px size-3.5 shrink-0" />{{ t().guideHelpNotice }}
        </p>
      </form>
    }

    <form class="flex gap-2 border-t pt-4" (submit)="$event.preventDefault(); send()">
      <label for="chat-text" class="sr-only">{{ t().chatTypeLabel }}</label>
      <input
        id="chat-text"
        class="field-input h-11 flex-1 rounded-full text-base md:text-base"
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
  private readonly pills = viewChild.required<ElementRef<HTMLElement>>('pills');
  private readonly helpInput = viewChild<ElementRef<HTMLInputElement>>('helpInput');
  protected readonly pill = pillClass;
  protected readonly helpPill = helpPillClass;

  private readonly helpApi = inject(GuideHelpApi);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly maxHelpChars = MAX_HELP_CHARS;
  /** The static explanation of this question (guide/explanations.json). */
  protected readonly meaning = computed(() => staticMeaning(this.question().id));
  /** The "Still unclear?" box: shown after "What does this mean?", gone once the question is answered. */
  protected readonly helpOpen = signal(false);
  protected readonly help = signal<HelpMessage[]>([]);
  protected readonly helpTyped = signal('');
  protected readonly helpPending = signal(false);

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
        this.showMeaning();
        break;
      case 'help':
        this.store.helpOpen.set(true);
        break;
      default:
        this.reply.set({ kind: 'unclear', foreignTax: result.foreignTax });
    }
  }

  /** "What does this mean?": the static explanation (no network call), then the help box and the pills again. */
  protected showMeaning(): void {
    const text = this.meaning();
    if (!text) return;
    this.reply.set(null);
    const alreadyShown = this.help().some((m) => m.from === 'guide' && m.text === text);
    if (!alreadyShown) {
      // The explanations are written in English only for now.
      this.help.update((list) => [...list, { from: 'guide', text, lang: this.i18n.lang() === 'en' ? undefined : 'en' }]);
    }
    this.helpOpen.set(true);
    this.revealPills(true);
  }

  /** Sends a clarification question to /api/guide-help. Never an answer: answers are only ever pill taps. */
  protected askHelp(): void {
    const text = this.helpTyped().trim();
    if (!text || this.helpPending()) return;
    if (sharesIdentifier(text)) {
      // Not sent. The text stays in the box so the person can remove the details.
      this.help.update((list) => [...list, { from: 'guide', text: this.t().roadmapChatPersonalInfo, warn: true }]);
      this.revealPills(true);
      return;
    }
    this.helpTyped.set('');
    const input = this.helpInput()?.nativeElement;
    if (input) input.value = '';
    this.help.update((list) => [...list, { from: 'person', text }]);
    this.helpPending.set(true);
    this.revealPills(false);
    this.helpApi
      .ask(this.question().id, text)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          const answer = typeof result?.answer === 'string' ? result.answer : '';
          this.help.update((list) => [
            ...list,
            answer ? { from: 'guide', text: answer } : { from: 'guide', text: this.t().roadmapChatUnavailable, warn: true },
          ]);
          this.helpPending.set(false);
          this.revealPills(true);
        },
        error: (err: unknown) => {
          this.help.update((list) => [...list, { from: 'guide', text: this.t()[FAILURE_MESSAGES[chatFailure(err)]], warn: true }]);
          this.helpPending.set(false);
          this.revealPills(true);
        },
      });
  }

  /** Brings the answer pills (and the help box under them) back into view after an explanation. */
  private revealPills(focusHelp: boolean): void {
    requestAnimationFrame(() => {
      if (focusHelp) this.helpInput()?.nativeElement.focus({ preventScroll: true });
      this.pills().nativeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
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
