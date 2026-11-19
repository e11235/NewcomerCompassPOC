import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import explanations from '../../../guide/explanations.json';

/** Matches the server's limit (api/_lib/guide-help.ts). */
export const MAX_HELP_CHARS = 500;

/** What /api/guide-help returns. `answer` is plain text: render it with interpolation only. */
export interface GuideHelpResult {
  type: 'explain' | 'redirect';
  answer: string;
}

/** The static "what does this mean?" text for a scripted question, from guide/explanations.json. */
export function staticMeaning(questionId: string): string | null {
  return (explanations as { id: string; meaning: string }[]).find((e) => e.id === questionId)?.meaning ?? null;
}

/**
 * Asks the app's own /api/guide-help function to explain a question of the guided chat.
 * Only clarification questions go here, never answers.
 */
@Injectable({ providedIn: 'root' })
export class GuideHelpApi {
  private readonly http = inject(HttpClient);

  ask(questionId: string, message: string): Observable<GuideHelpResult> {
    return this.http.post<GuideHelpResult>('/api/guide-help', { questionId, message });
  }
}
