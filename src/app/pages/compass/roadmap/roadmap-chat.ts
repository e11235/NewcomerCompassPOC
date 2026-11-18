import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { detectIdentifier } from '../../../engine/chat-matcher';
import { I18n } from '../../../i18n/i18n';
import { ChatApi, chatFailure, type ChatFailure, type ChatTurn } from '../../../services/chat-api';
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

/**
 * A pop-out chat window on the roadmap page. Questions go to an LLM through the app's
 * /api/chat function. Messages that look like personal identifiers are not sent.
 * The conversation is kept in memory only, for as long as the page is open.
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
          @for (m of turns(); track $index) {
            @if (m.role === 'user') {
              <div class="flex justify-end">
                <p class="max-w-[85%] rounded-2xl rounded-se-sm bg-[#26374a] px-4 py-2 text-sm break-words whitespace-pre-wrap text-white">{{ m.content }}</p>
              </div>
            } @else {
              <app-guide-says><p class="text-sm break-words whitespace-pre-wrap">{{ m.content }}</p></app-guide-says>
            }
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
              <p class="text-sm">{{ f === 'busy' ? t().roadmapChatBusy : t().roadmapChatUnavailable }}</p>
              <button type="button" class="btn btn-secondary mt-2 h-9 text-sm" (click)="ask()">{{ t().roadmapChatRetry }}</button>
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
            maxlength="500"
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

  protected readonly open = signal(false);
  protected readonly typed = signal('');
  protected readonly turns = signal<ChatTurn[]>([]);
  protected readonly pending = signal(false);
  protected readonly failure = signal<ChatFailure | null>(null);
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
    this.turns.update((m) => [...m, { role: 'user', content: text }]);
    this.typed.set('');
    // Clear the box directly too: the [value] binding may not see a change if it never rendered the typed text.
    const input = this.input()?.nativeElement;
    if (input) input.value = '';
    this.ask();
  }

  /** Asks for a reply to the conversation so far; also used to retry after an error. */
  protected ask(): void {
    if (this.pending() || this.turns().at(-1)?.role !== 'user') return;
    this.pending.set(true);
    this.failure.set(null);
    this.scrollToEnd();
    this.chatApi.reply(this.turns()).subscribe({
      next: (reply) => {
        this.turns.update((m) => [...m, { role: 'assistant', content: reply }]);
        this.pending.set(false);
        this.scrollToEnd();
      },
      error: (err: unknown) => {
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
