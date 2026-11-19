import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ExtraStrings } from '../i18n/extra-strings';

/** Matches the server's limit (api/chat.ts). */
export const MAX_QUESTION_CHARS = 1000;

/** A verified quote from one of the official pages. `link` is built by the server from its allowlist. */
export interface Citation {
  title: string;
  quote: string;
  link: string;
}

/** What /api/chat returns: an answer with citations, or "not found" with the official pages. */
export type ChatResult =
  | { answer: string; citations: Citation[] }
  | { answer: null; sources: { title: string; url: string }[] };

/**
 * What went wrong, in terms the chat window can explain to the person:
 * - offline:     the browser has no internet connection
 * - unreachable: the request never got a response (network problem, or the server is down)
 * - busy:        too many requests (rate limit)
 * - timeout:     the request took too long
 * - rejected:    the server refused the question itself (empty, too long, malformed)
 * - not_set_up:  the chat service is missing or misconfigured on this site (retrying will not help)
 * - unavailable: anything else (the language model provider failed)
 */
export type ChatFailure = 'offline' | 'unreachable' | 'busy' | 'timeout' | 'rejected' | 'not_set_up' | 'unavailable';

/** The message shown for each kind of failure. */
export const FAILURE_MESSAGES: Record<ChatFailure, keyof ExtraStrings> = {
  offline: 'roadmapChatOffline',
  unreachable: 'roadmapChatUnreachable',
  busy: 'roadmapChatBusy',
  timeout: 'roadmapChatTimeout',
  rejected: 'roadmapChatRejected',
  not_set_up: 'roadmapChatNotSetUp',
  unavailable: 'roadmapChatUnavailable',
};

/** Failures where asking the same question again cannot succeed until something else changes. */
const NOT_RETRYABLE: ReadonlySet<ChatFailure> = new Set(['rejected', 'not_set_up']);

export function canRetry(failure: ChatFailure): boolean {
  return !NOT_RETRYABLE.has(failure);
}

/** Links are only ever shown for the official pages; anything else is dropped (defence in depth). */
export function isOfficialLink(url: string): boolean {
  return url.startsWith('https://www.canada.ca/');
}

/**
 * Talks to the app's own /api/chat function, which answers from three official canada.ca pages
 * and verifies every quote. No key or provider details live here.
 */
@Injectable({ providedIn: 'root' })
export class ChatApi {
  private readonly http = inject(HttpClient);

  ask(question: string): Observable<ChatResult> {
    return this.http.post<ChatResult>('/api/chat', { question });
  }
}

/** The error code /api/chat put in its JSON body, if any. */
function serverCode(error: HttpErrorResponse): string | undefined {
  const body: unknown = error.error;
  if (typeof body !== 'object' || body === null) return undefined;
  const code = (body as { error?: { code?: unknown } }).error?.code;
  return typeof code === 'string' ? code : undefined;
}

/** Sorts an error from {@link ChatApi.ask} into a kind of message for the person. */
export function chatFailure(error: unknown): ChatFailure {
  if (!(error instanceof HttpErrorResponse)) return 'unavailable';
  if (error.status === 0) return navigator.onLine === false ? 'offline' : 'unreachable';

  switch (serverCode(error)) {
    case 'bad_request':
    case 'payload_too_large':
      return 'rejected';
    case 'not_configured':
    case 'method_not_allowed':
      return 'not_set_up';
    case 'upstream_error':
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
    // 404: /api/chat does not exist here (e.g. running `ng serve` without `vercel dev`).
    case 404:
    case 405:
      return 'not_set_up';
    default:
      return 'unavailable';
  }
}
