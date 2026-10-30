import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatStore } from '../state/chat-store';

let nextChatId = 0;

/**
 * Chat window: history on top, text entry at the bottom.
 * `inline` sits inside a page section; `panel` fills its container top to bottom
 * like a browser side-panel assistant.
 */
@Component({
  selector: 'app-chat',
  imports: [FormsModule, TextFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  host: {
    '[class.panel]': "variant() === 'panel'",
  },
})
export class Chat {
  readonly variant = input<'inline' | 'panel'>('inline');
  readonly heading = input('Questions?');

  protected readonly store = inject(ChatStore);
  protected readonly draft = signal('');
  private readonly uid = nextChatId++;
  protected readonly inputId = `chat-input-${this.uid}`;
  protected readonly headingId = `chat-heading-${this.uid}`;

  private readonly historyEl = viewChild.required<ElementRef<HTMLElement>>('history');

  protected send(): void {
    const text = this.draft().trim();
    if (!text) {
      return;
    }
    this.store.send(text);
    this.draft.set('');
    // Wait for the new message to render, then bring it into view.
    setTimeout(() => {
      const el = this.historyEl().nativeElement;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
