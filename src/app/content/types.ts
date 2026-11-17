/**
 * Shapes of the synthetic demonstration content (situations, questions,
 * programs, rules, organizations and demo places). The data itself lives in
 * `content-data.ts`, copied from the Newcomer Compass click-through prototype.
 */

export type LanguageCode = 'en' | 'fr' | 'ar';

/** A piece of text in every supported language. */
export type Localized = Record<LanguageCode, string>;

/** An answer: one option value, free text, or (in principle) several values. */
export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue | undefined>;

export type ResultState = 'action_required' | 'likely' | 'maybe' | 'not_yet' | 'needs_info' | 'done' | 'unlikely';
export type Section = 'first' | 'next' | 'explore';
export type Channel = 'online' | 'phone' | 'in_person' | 'worker';

/** A rule condition. Exactly one of the shapes applies. */
export interface Condition {
  always?: boolean;
  all?: Condition[];
  any?: Condition[];
  not?: Condition;
  result?: string;
  resultIn?: ResultState[];
  q?: string;
  op?: 'missing' | 'present' | 'eq' | 'in' | 'notIn' | 'includes';
  value?: string | string[];
}

export interface Situation {
  id: string;
  icon: string;
  label: Localized;
  description: Localized;
  available: boolean;
}

export interface SampleJourney {
  situationId: string;
  label: Localized;
  answers: Answers;
}

export interface Scenario {
  scenarioId: string;
  scenarioLabel: Localized;
  scenarioStatus: Localized;
  defaultCity: string;
  primarySituationId: string;
  situations: Situation[];
  sampleJourney: SampleJourney | null;
  questionOrder: string[];
}

export interface QuestionOption {
  value: string;
  label: Localized;
}

export interface Question {
  id: string;
  kind: 'single' | 'text';
  required: boolean;
  label: Localized;
  summaryLabel: Localized;
  hint?: Localized;
  why?: Localized;
  options?: QuestionOption[];
  showIf?: Condition;
  purpose?: 'navigation';
}

export interface Program {
  id: string;
  section: Section;
  priority: number;
  orgId: string;
  name: Localized;
  shortTitle: Localized;
  oneLiner: Localized;
  icon: string;
  action: Localized;
  summary: Localized;
  plain: Localized;
  whyFirst?: Localized;
  unlocks?: Localized;
  nextStep: Localized;
  channels: Channel[];
  completableOnline: boolean;
  documents: Localized[];
  sourceId: string;
  glossary: string[];
  whyShown: Localized;
  humanHelp: Localized;
  trigger?: Condition;
}

export interface Rule {
  ruleId: string;
  programId: string;
  resultState: ResultState;
  dependencyIds: string[];
  conditions: Condition;
  explanation: Localized;
  sourceId: string;
  lastReviewed: string;
  owner: string;
  missingQuestionIds?: string[];
}

export interface Organization {
  id: string;
  name: Localized;
  level: Localized;
  role: Localized;
  contact: {
    onlineUrl?: string | null;
    onlineUrlFr?: string | null;
    inPersonUrl?: string | null;
    inPersonUrlFr?: string | null;
    phone?: string | null;
  };
}

export interface Source {
  id: string;
  title: Localized;
  placeholder: Localized;
  lastReviewed: string;
  owner: string;
  url: string | null;
  urlFr: string | null;
  phone?: string;
  /** Reviewer note about when the link was last checked. */
  linkCheck?: string;
}

export interface Handoff {
  id: string;
  /** null when the person comes straight to this step (no earlier step hands them over). */
  fromProgramId: string | null;
  toProgramId: string;
  fromLabel: Localized;
  toLabel: Localized;
  conditions: Condition;
  why: Localized;
  canHelp: Localized[];
  bring: Localized[];
  sharedQuestionIds: string[];
  next: Localized;
  sourceId: string;
  lastReviewed: string;
  owner: string;
}

export interface ResultStateInfo {
  id: ResultState;
  label: Localized;
  description: Localized;
}

export interface GlossaryEntry {
  id: string;
  term: Localized;
  plain: Localized;
}

export type ServiceType = 'service_canada' | 'tax_clinic' | 'settlement' | 'library' | 'prov_office';

export interface VerifiedDetails {
  address?: string;
  hours?: Localized;
  appointment?: Localized;
  accessibility?: Localized;
  languages?: string[];
  phone?: string;
  sourceUrl?: string;
  checked?: string;
}

export interface DemoLocation {
  id: string;
  isDemo: boolean;
  serviceType: ServiceType;
  areaId: string;
  displayName: Localized;
  orgId: string;
  relatedActionIds: string[];
  helpsWith: Localized;
  demonstrationAddress?: string;
  latitude: number;
  longitude: number;
  verified?: VerifiedDetails;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Area {
  id: string;
  province: string;
  name: Localized;
  aliases: string[];
  center: LatLng;
  bounds: { north: number; south: number; west: number; east: number };
  showDemoLocations: boolean;
}

/** Everything the rules engine reads. */
export interface ContentModel {
  scenario: Scenario;
  questions: Question[];
  programs: Program[];
  rules: Rule[];
  organizations: Organization[];
  sources: Source[];
  handoffs: Handoff[];
}
