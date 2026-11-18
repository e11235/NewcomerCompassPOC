import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

/** One turn of a conversation, in the shape /api/chat accepts. */
export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

/** Matches the server's limit (api/chat.ts): only the most recent turns are sent. */
export const MAX_CHAT_TURNS = 20;

/** What went wrong, in terms the chat window can explain to the person. */
export type ChatFailure = 'busy' | 'unavailable';

/**
 * Talks to the app's own /api/chat serverless function, which holds the LLM API key
 * and forwards the conversation to the provider. No key or provider details live here.
 */
@Injectable({ providedIn: 'root' })
export class ChatApi {
  private readonly http = inject(HttpClient);

  /** Sends the conversation (ending with the person's latest message) and emits the reply text. */
  reply(turns: readonly ChatTurn[]): Observable<string> {
    return this.http
      .post<{ reply: string }>('/api/chat', { messages: turns.slice(-MAX_CHAT_TURNS) })
      .pipe(map((res) => res.reply));
  }
}

/** Sorts an error from {@link ChatApi.reply} into a kind of message for the person. */
export function chatFailure(error: unknown): ChatFailure {
  return error instanceof HttpErrorResponse && error.status === 429 ? 'busy' : 'unavailable';
}
