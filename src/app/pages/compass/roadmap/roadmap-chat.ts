import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { detectIdentifier } from '../../../engine/chat-matcher';
import type { ExtraStrings } from '../../../i18n/extra-strings';
import { I18n } from '../../../i18n/i18n';
import { HttpErrorResponse } from '@angular/common/http';
import {
  canRetry,
  ChatApi,
  chatFailure,
  isOfficialLink,
  MAX_QUESTION_CHARS,
  type ChatFailure,
  type ChatResult,
} from '../../../services/chat-api';
import { Icon } from '../../../shared/icon';
import { GuideSays } from '../guided-chat';

/**
 * True when a question contains an actual personal identifier. Unlike the guided chat, merely
 * naming a document ("How do I renew my passport?") is fine here, so keyword-only matches
 * need digits to count, except for email addresses and "my name is …".
 */
function sharesIdentifier(text: string): boolean {
  const kind = detectIdentifier(text);
  return kind === 'email' || kind === 'name' || (kind !== null && /\d/.test(text));
}

/** The message shown for each kind of failure. */
const FAILURE_MESSAGES: Record<ChatFailure, keyof ExtraStrings> = {
  offline: 'roadmapChatOffline',
  unreachable: 'roadmapChatUnreachable',
  busy: 'roadmapChatBusy',
  timeout: 'roadmapChatTimeout',
  rejected: 'roadmapChatRejected',
  not_set_up: 'roadmapChatNotSetUp',
  unavailable: 'roadmapChatUnavailable',
};

/** Logs the technical reason for developers; the person sees a plain-language message instead. */
function logFailure(err: unknown): void {
  if (!(err instanceof HttpErrorResponse)) {
    console.error('[roadmap-chat] Chat request failed:', err);
    return;
  }
  const body = err.error as { error?: { code?: string; message?: string } } | null;
  const detail = body?.error ? `${body.error.code}: ${body.error.message}` : err.message;
  console.error(`[roadmap-chat] /api/chat failed (${err.status}) ${detail}`);
}

/** One question and what came back. Each question is answered on its own, without the earlier ones. */
interface Exchange {
  question: string;
  result: ChatResult;
}

/** Drops any link that is not on www.canada.ca (the server only builds those; this is a second check). */
function safeResult(result: ChatResult): ChatResult {
  if (result.answer === null) return { answer: null, sources: result.sources.filter((s) => isOfficialLink(s.url)) };
  return { answer: result.answer, citations: result.citations.filter((c) => isOfficialLink(c.link)) };
}

/**
 * A pop-out chat window on the roadmap page that answers questions about the Temporary Foreign
 * Worker Program from three official canada.ca pages, through the app's /api/chat function.
 * Answers are plain text ({{ }} interpolation only, never innerHTML) followed by the verified
 * quotes they rest on; links come from the server's allowlist. Messages that look like personal
 * identifiers are not sent. The conversation is kept in memory only, for as long as the page is open.
 */
@Component({
  selector: 'app-roadmap-chat',
  imports: [GuideSays, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'no-print', '(document:keydown.escape)': 'close()' },
  template: `
    @if (open()) {
      <section
        role="dialog"
        aria-labelledby="roadmap-chat-title"
        class="fixed inset-x-0 bottom-0 z-40 flex h-[min(32rem,85dvh)] flex-col overflow-hidden rounded-t-2xl border bg-background shadow-2xl animate-[nc-fade-in_200ms_ease-out] sm:inset-x-auto sm:end-6 sm:bottom-24 sm:w-96 sm:rounded-2xl"
      >
        <header class="flex items-center justify-between gap-2 bg-[#26374a] px-4 py-3 text-white">
          <h2 id="roadmap-chat-title" class="flex items-center gap-2 font-semibold">
            <app-icon name="messages-square" class="size-5" />{{ t().guideName }}
          </h2>
          <button
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-md hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
            (click)="close()"
          >
            <app-icon name="x" />
            <span class="sr-only">{{ t().close }}</span>
          </button>
        </header>

        <div #log class="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-live="polite">
          <app-guide-says>
            <p class="text-sm">{{ t().roadmapChatGreeting }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ t().roadmapChatNotice }}</p>
          </app-guide-says>
          @for (x of exchanges(); track $index) {
            <div class="flex justify-end">
              <p class="max-w-[85%] rounded-2xl rounded-se-sm bg-[#26374a] px-4 py-2 text-sm break-words whitespace-pre-wrap text-white">{{ x.question }}</p>
            </div>
            <app-guide-says>
              @if (x.result.answer !== null) {
                <p class="text-sm break-words whitespace-pre-wrap">{{ x.result.answer }}</p>
                @for (c of x.result.citations; track $index) {
                  <figure class="mt-3">
                    <blockquote class="border-s-4 border-[#26374a]/40 ps-3 text-sm break-words italic" lang="en" dir="ltr">“{{ c.quote }}”</blockquote>
                    <figcaption class="mt-1 ps-3 text-xs">
                      <a class="underline underline-offset-2 break-words" [href]="c.link" target="_blank" rel="noopener noreferrer"
                        >{{ c.title }}<span class="sr-only"> {{ t().roadmapChatNewTab }}</span></a
                      >
                    </figcaption>
                  </figure>
                }
              } @else {
                <p class="text-sm">{{ t().roadmapChatNotFound }}</p>
                <ul class="mt-2 list-disc space-y-1 ps-5 text-sm">
                  @for (s of x.result.sources; track s.url) {
                    <li>
                      <a class="underline underline-offset-2 break-words" [href]="s.url" target="_blank" rel="noopener noreferrer"
                        >{{ s.title }}<span class="sr-only"> {{ t().roadmapChatNewTab }}</span></a
                      >
                    </li>
                  }
                </ul>
              }
              <p class="mt-3 text-xs text-muted-foreground">{{ t().roadmapChatDisclaimer }}</p>
            </app-guide-says>
          }
          @if (pending()) {
            <app-guide-says>
              <span class="flex h-5 items-center gap-1" aria-hidden="true">
                <span class="size-1.5 animate-bounce rounded-full bg-muted-foreground"></span>
                <span class="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]"></span>
                <span class="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]"></span>
              </span>
              <span class="sr-only">{{ t().roadmapChatThinking }}</span>
            </app-guide-says>
          }
          @if (failure(); as f) {
            <app-guide-says tone="warn">
              <p class="text-sm">{{ failureMessage() }}</p>
              @if (canRetry(f) && lastQuestion()) {
                <button type="button" class="btn btn-secondary mt-2 h-9 text-sm" (click)="ask(lastQuestion()!)">{{ t().roadmapChatRetry }}</button>
              }
            </app-guide-says>
          }
          @if (personalInfo()) {
            <app-guide-says tone="warn"><p class="text-sm">{{ t().roadmapChatPersonalInfo }}</p></app-guide-says>
          }
        </div>

        <form class="flex gap-2 border-t p-3" (submit)="$event.preventDefault(); send()">
          <label for="roadmap-chat-text" class="sr-only">{{ t().roadmapChatPlaceholder }}</label>
          <input
            #input
            id="roadmap-chat-text"
            class="field-input h-11 flex-1 rounded-full text-base md:text-base"
            [value]="typed()"
            (input)="typed.set($any($event.target).value)"
            [placeholder]="t().roadmapChatPlaceholder"
            autocomplete="off"
            [attr.maxlength]="maxChars"
          />
          <button
            type="submit"
            class="btn btn-primary btn-icon size-11 rounded-full"
            [attr.aria-label]="t().send"
            [disabled]="!typed().trim() || pending()"
          >
            <app-icon name="send-horizontal" class="flip-rtl" />
          </button>
        </form>
      </section>
    }

    <button
      #launcher
      type="button"
      class="fixed end-6 bottom-6 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#26374a] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      [class.max-sm:hidden]="open()"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="open() ? t().close : t().roadmapChatOpen"
      (click)="open() ? close() : show()"
    >
      <app-icon [name]="open() ? 'x' : 'messages-square'" class="size-6" />
    </button>
  `,
})
export class RoadmapChat {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  private readonly chatApi = inject(ChatApi);
  protected readonly maxChars = MAX_QUESTION_CHARS;

  protected readonly open = signal(false);
  protected readonly typed = signal('');
  protected readonly exchanges = signal<Exchange[]>([]);
  protected readonly pending = signal(false);
  /** The question that failed, kept so "Try again" can resend it. */
  protected readonly lastQuestion = signal<string | null>(null);
  protected readonly failure = signal<ChatFailure | null>(null);
  protected readonly canRetry = canRetry;
  protected readonly failureMessage = computed(() => {
    const f = this.failure();
    return f ? this.t()[FAILURE_MESSAGES[f]] : '';
  });
  protected readonly personalInfo = signal(false);

  private readonly log = viewChild<ElementRef<HTMLElement>>('log');
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly launcher = viewChild.required<ElementRef<HTMLButtonElement>>('launcher');

  protected show(): void {
    this.open.set(true);
    requestAnimationFrame(() => this.input()?.nativeElement.focus());
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    // The launcher is hidden on small screens while the window is open, so focus it after it reappears.
    requestAnimationFrame(() => this.launcher().nativeElement.focus());
  }

  protected send(): void {
    const text = this.typed().trim();
    if (!text || this.pending()) return;
    // Keep the text in the box so the person can remove the personal details and send again.
    this.personalInfo.set(sharesIdentifier(text));
    if (this.personalInfo()) {
      this.scrollToEnd();
      return;
    }
    this.typed.set('');
    // Clear the box directly too: the [value] binding may not see a change if it never rendered the typed text.
    const input = this.input()?.nativeElement;
    if (input) input.value = '';
    this.ask(text);
  }

  /** Sends one question; also used to retry after an error. */
  protected ask(question: string): void {
    if (this.pending()) return;
    this.pending.set(true);
    this.failure.set(null);
    this.lastQuestion.set(question);
    this.scrollToEnd();
    this.chatApi.ask(question).subscribe({
      next: (result) => {
        this.exchanges.update((list) => [...list, { question, result: safeResult(result) }]);
        this.lastQuestion.set(null);
        this.pending.set(false);
        this.scrollToEnd();
      },
      error: (err: unknown) => {
        logFailure(err);
        this.failure.set(chatFailure(err));
        this.pending.set(false);
        this.scrollToEnd();
      },
    });
  }

  private scrollToEnd(): void {
    requestAnimationFrame(() => {
      const el = this.log()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
