import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { I18n } from '../../../i18n/i18n';
import { Icon } from '../../../shared/icon';
import { GuideSays } from '../guided-chat';

/**
 * A pop-out chat window on the roadmap page. For now it only echoes what the person
 * types into the conversation; nothing answers yet.
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
          <app-guide-says><p class="text-sm">{{ t().roadmapChatGreeting }}</p></app-guide-says>
          @for (m of messages(); track $index) {
            <div class="flex justify-end">
              <p class="max-w-[85%] rounded-2xl rounded-se-sm bg-[#26374a] px-4 py-2 text-sm break-words whitespace-pre-wrap text-white">{{ m }}</p>
            </div>
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
          <button type="submit" class="btn btn-primary btn-icon size-11 rounded-full" [attr.aria-label]="t().send" [disabled]="!typed().trim()">
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

  protected readonly open = signal(false);
  protected readonly typed = signal('');
  protected readonly messages = signal<string[]>([]);

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
    if (!text) return;
    this.messages.update((m) => [...m, text]);
    this.typed.set('');
    // Clear the box directly too: the [value] binding may not see a change if it never rendered the typed text.
    const input = this.input()?.nativeElement;
    if (input) input.value = '';
    requestAnimationFrame(() => {
      const el = this.log()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
