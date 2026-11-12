// Placeholder content: this proof of concept doesn't calculate eligibility.
// Questionnaire answers live in AnswersStore (answers-store.ts).
export const BENEFIT_IDS = [
  'sin',
  'childBenefit',
  'groceriesBenefit',
  'workersBenefit',
  'dentalCare',
  'learningBond',
] as const;
export type BenefitId = (typeof BENEFIT_IDS)[number];
