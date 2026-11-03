import { Injectable, signal } from '@angular/core';

// Answers are stored as language-neutral keys; their labels live in the translations.
export const MARITAL_STATUSES = ['married', 'single'] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];

export const NEWCOMER_GROUPS = [
  'permanentResidents',
  'resettledRefugees',
  'asylumClaimants',
  'workPermit',
  'studyPermit',
] as const;
export type NewcomerGroup = (typeof NEWCOMER_GROUPS)[number];

// Placeholder content: this proof of concept doesn't calculate eligibility.
export const BENEFIT_IDS = [
  'sin',
  'childBenefit',
  'groceriesBenefit',
  'workersBenefit',
  'dentalCare',
  'learningBond',
] as const;
export type BenefitId = (typeof BENEFIT_IDS)[number];

/** Questionnaire answers, kept in memory so they survive navigating between pages. */
@Injectable({ providedIn: 'root' })
export class ProfileStore {
  readonly age = signal<number | null>(null);
  readonly maritalStatus = signal<MaritalStatus | null>(null);
  readonly children = signal<number | null>(null);
  readonly group = signal<NewcomerGroup | null>(null);
  readonly yearsInCanada = signal<number | null>(null);
}
