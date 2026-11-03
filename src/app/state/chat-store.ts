import { Injectable, signal } from '@angular/core';

export interface ChatMessage {
  id: number;
  from: 'user' | 'assistant';
  text: string;
}

/**
 * Shared chat history for both pages. There is no backend yet: sent questions
 * are only added to the history so the layout can be reviewed. The greeting
 * isn't stored here; the chat renders it in the current language.
 */
@Injectable({ providedIn: 'root' })
export class ChatStore {
  private nextId = 1;
  private readonly history = signal<ChatMessage[]>([]);

  readonly messages = this.history.asReadonly();

  send(text: string): void {
    this.history.update((list) => [...list, { id: this.nextId++, from: 'user', text }]);
  }
}
