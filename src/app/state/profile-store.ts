import { Injectable, signal } from '@angular/core';

export const MARITAL_STATUSES = ['Married', 'Single'] as const;

export const NEWCOMER_GROUPS = [
  'Permanent residents',
  'Resettled refugees and protected persons',
  'Asylum claimants',
  'Temporary residents on work permit',
  'Temporary residents on study permit',
] as const;

/** Questionnaire answers, kept in memory so they survive navigating between pages. */
@Injectable({ providedIn: 'root' })
export class ProfileStore {
  readonly age = signal<number | null>(null);
  readonly maritalStatus = signal<string | null>(null);
  readonly children = signal<number | null>(null);
  readonly group = signal<string | null>(null);
  readonly yearsInCanada = signal<number | null>(null);
}
