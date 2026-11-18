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

/**
 * What went wrong, in terms the chat window can explain to the person:
 * - offline:     the browser has no internet connection
 * - unreachable: the request never got a response (network problem, or the server is down)
 * - busy:        too many requests (rate limit)
 * - timeout:     the language model took too long to answer
 * - rejected:    the server refused the question itself (too long, malformed)
 * - not_set_up:  the chat service is missing or misconfigured on this site (retrying will not help)
 * - unavailable: anything else (the language model provider failed)
 */
export type ChatFailure = 'offline' | 'unreachable' | 'busy' | 'timeout' | 'rejected' | 'not_set_up' | 'unavailable';

/** Failures where trying the same question again cannot succeed until something else changes. */
const NOT_RETRYABLE: ReadonlySet<ChatFailure> = new Set(['rejected', 'not_set_up']);

export function canRetry(failure: ChatFailure): boolean {
  return !NOT_RETRYABLE.has(failure);
}

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

/** The error code /api/chat put in its JSON body, if any. */
function serverCode(error: HttpErrorResponse): string | undefined {
  const body: unknown = error.error;
  if (typeof body !== 'object' || body === null) return undefined;
  const code = (body as { error?: { code?: unknown } }).error?.code;
  return typeof code === 'string' ? code : undefined;
}

/** Sorts an error from {@link ChatApi.reply} into a kind of message for the person. */
export function chatFailure(error: unknown): ChatFailure {
  if (!(error instanceof HttpErrorResponse)) return 'unavailable';
  if (error.status === 0) return navigator.onLine === false ? 'offline' : 'unreachable';

  switch (serverCode(error)) {
    case 'rate_limited':
      return 'busy';
    case 'provider_timeout':
      return 'timeout';
    case 'bad_request':
    case 'payload_too_large':
      return 'rejected';
    case 'not_configured':
    case 'provider_config':
    case 'method_not_allowed':
      return 'not_set_up';
    case 'provider_error':
      return 'unavailable';
  }

  // No code from our function: judge by status (e.g. a hosting-level error page).
  switch (error.status) {
    case 429:
      return 'busy';
    case 504:
    case 408:
      return 'timeout';
    case 400:
    case 413:
      return 'rejected';
    // 404: /api/chat does not exist here (e.g. running `ng serve` instead of `vercel dev`).
    case 404:
    case 405:
      return 'not_set_up';
    default:
      return 'unavailable';
  }
}
