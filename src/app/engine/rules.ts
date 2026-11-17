/**
 * The deterministic rules engine, ported from the click-through prototype.
 *
 * - `askedQuestions` decides which questions to ask (only those a rule still needs).
 * - `evaluate` runs every program's rules against the answers.
 * - `buildJourney` orders the results into steps; `buildRoadmap` adds statuses
 *   such as "You are here", "Next" and "Not yet".
 */
import { CONTENT, MAX_EXPLORE_STEPS } from '../content/content-data';
import type {
  AnswerValue,
  Answers,
  Condition,
  ContentModel,
  Handoff,
  Localized,
  Program,
  Question,
  ResultState,
  Rule,
  Section,
} from '../content/types';

const EMPTY_VALUES = ['', 'unsure'];

/** True when there is no usable answer ("I'm not sure" counts as missing). */
export function isMissing(value: AnswerValue | undefined): boolean {
  if (value === undefined) return true;
  return Array.isArray(value) ? value.length === 0 : EMPTY_VALUES.includes(value.trim());
}

function asList(value: AnswerValue | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export interface ProgramResult {
  programId: string;
  state: ResultState;
  ruleId: string;
  explanation: Localized;
  dependencyIds: string[];
  missingQuestionIds: string[];
  sourceId: string;
  lastReviewed: string;
  owner: string;
}
export type Results = Record<string, ProgramResult>;

/** Evaluates a condition against the answers and the results computed so far. */
export function matches(condition: Condition, answers: Answers, results: Results = {}): boolean {
  if (condition.always) return true;
  if (condition.all) return condition.all.every((c) => matches(c, answers, results));
  if (condition.any) return condition.any.some((c) => matches(c, answers, results));
  if (condition.not) return !matches(condition.not, answers, results);
  if (condition.result) {
    const result = results[condition.result];
    return result ? (condition.resultIn ?? []).includes(result.state) : false;
  }
  if (condition.q) {
    const answer = answers[condition.q];
    const values = asList(condition.value);
    switch (condition.op) {
      case 'missing':
        return isMissing(answer);
      case 'present':
        return !isMissing(answer);
      case 'eq':
        return typeof answer === 'string' && answer === values[0];
      case 'in':
        return typeof answer === 'string' && values.includes(answer);
      case 'notIn':
        return typeof answer === 'string' ? !values.includes(answer) : true;
      case 'includes':
        return asList(answer).some((v) => values.includes(v));
      default:
        return false;
    }
  }
  return false;
}

/** Program ids that a condition reads results from. */
function resultRefs(condition: Condition, into = new Set<string>()): Set<string> {
  if (condition.result) into.add(condition.result);
  condition.all?.forEach((c) => resultRefs(c, into));
  condition.any?.forEach((c) => resultRefs(c, into));
  if (condition.not) resultRefs(condition.not, into);
  return into;
}

/** Programs ordered so that every program comes after the programs its rules depend on. */
function dependencyOrder(programs: Program[], rules: Rule[]): Program[] {
  const deps = new Map<string, Set<string>>();
  for (const p of programs) deps.set(p.id, new Set());
  for (const rule of rules) {
    const set = deps.get(rule.programId);
    if (!set) continue;
    rule.dependencyIds.forEach((d) => set.add(d));
    resultRefs(rule.conditions).forEach((d) => set.add(d));
  }
  const ordered: Program[] = [];
  const state = new Map<string, 'visiting' | 'done'>();
  const byId = new Map(programs.map((p) => [p.id, p]));
  const visit = (id: string, path: string[]) => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') throw new Error(`Dependency cycle: ${[...path, id].join(' -> ')}`);
    state.set(id, 'visiting');
    [...(deps.get(id) ?? [])].sort().forEach((d) => byId.has(d) && visit(d, [...path, id]));
    state.set(id, 'done');
    const program = byId.get(id);
    if (program) ordered.push(program);
  };
  [...programs].sort((a, b) => a.priority - b.priority).forEach((p) => visit(p.id, []));
  return ordered;
}

/** Runs every program's rules; the first matching rule decides the program's state. */
export function evaluate(answers: Answers, model: ContentModel = CONTENT): Results {
  const results: Results = {};
  for (const program of dependencyOrder(model.programs, model.rules)) {
    if (program.trigger && !matches(program.trigger, answers, results)) continue;
    const rule = model.rules.filter((r) => r.programId === program.id).find((r) => matches(r.conditions, answers, results));
    if (!rule) throw new Error(`No rule matched for ${program.id}; add an "always" fallback rule.`);
    results[program.id] = {
      programId: program.id,
      state: rule.resultState,
      ruleId: rule.ruleId,
      explanation: rule.explanation,
      dependencyIds: rule.dependencyIds,
      missingQuestionIds: (rule.missingQuestionIds ?? []).filter((q) => isMissing(answers[q])),
      sourceId: rule.sourceId,
      lastReviewed: rule.lastReviewed,
      owner: rule.owner,
    };
  }
  return results;
}

const STEP_STATES: ResultState[] = ['action_required', 'likely', 'maybe', 'not_yet', 'needs_info'];
const SECTION_ORDER: Record<Section, number> = { first: 0, next: 1, explore: 2 };

export interface JourneyStep {
  number: number;
  section: Section;
  program: Program;
  result: ProgramResult;
  /** Step numbers that must happen before this one. */
  waitsOn: number[];
  /** Program ids of later steps that this one helps unlock. */
  unlocksIds: string[];
}

export interface Journey {
  steps: JourneyStep[];
  done: ProgramResult[];
  unlikely: ProgramResult[];
}

/** Orders the results into numbered steps: first, then next, then explore. */
export function buildJourney(results: Results, model: ContentModel = CONTENT): Journey {
  const programs = new Map(model.programs.map((p) => [p.id, p]));
  const program = (id: string) => programs.get(id)!;
  const shown = Object.values(results).filter((r) => STEP_STATES.includes(r.state));
  const sectionOf = (r: ProgramResult): Section => (r.state === 'action_required' ? 'first' : program(r.programId).section);
  const shownIds = new Set(shown.map((r) => r.programId));
  const depthCache = new Map<string, number>();
  const depth = (id: string): number => {
    const cached = depthCache.get(id);
    if (cached !== undefined) return cached;
    const result = results[id];
    const sameSectionDeps = (result?.dependencyIds ?? []).filter(
      (d) => shownIds.has(d) && sectionOf(results[d]) === sectionOf(result),
    );
    const value = sameSectionDeps.length ? 1 + Math.max(...sameSectionDeps.map(depth)) : 0;
    depthCache.set(id, value);
    return value;
  };
  shown.sort((a, b) => {
    const bySection = SECTION_ORDER[sectionOf(a)] - SECTION_ORDER[sectionOf(b)];
    if (bySection !== 0) return bySection;
    const byDepth = depth(a.programId) - depth(b.programId);
    return byDepth !== 0 ? byDepth : program(a.programId).priority - program(b.programId).priority;
  });
  const numberOf = new Map(shown.map((r, i) => [r.programId, i + 1]));
  return {
    steps: shown.map((r, i) => ({
      number: i + 1,
      section: sectionOf(r),
      program: program(r.programId),
      result: r,
      waitsOn: r.dependencyIds.map((d) => numberOf.get(d)).filter((n): n is number => n !== undefined && n < i + 1),
      unlocksIds: shown.filter((s) => s.dependencyIds.includes(r.programId)).map((s) => s.programId),
    })),
    done: Object.values(results).filter((r) => r.state === 'done'),
    unlikely: Object.values(results).filter((r) => r.state === 'unlikely'),
  };
}

export interface AnswerSummary {
  questionId: string;
  label: Localized;
  value: Localized;
}

/** Answers in plain words, for the hand-off notes. */
function summarizeAnswers(answers: Answers, model: ContentModel, onlyIds?: string[]): AnswerSummary[] {
  const out: AnswerSummary[] = [];
  for (const q of model.questions) {
    if (onlyIds && !onlyIds.includes(q.id)) continue;
    const value = answers[q.id];
    if (value === undefined || (Array.isArray(value) ? value.length === 0 : value === '')) continue;
    const labelOf = (v: string): Localized => q.options?.find((o) => o.value === v)?.label ?? { en: v, fr: v, ar: v };
    const labels = asList(value).map(labelOf);
    out.push({
      questionId: q.id,
      label: q.summaryLabel,
      value: {
        en: labels.map((l) => l.en).join(', '),
        fr: labels.map((l) => l.fr).join(', '),
        ar: labels.map((l) => l.ar).join('، '),
      },
    });
  }
  return out;
}

export interface HandoffNote {
  handoff: Handoff;
  fromStep?: number;
  toStep: number;
  unlocks: { number: number; name: Localized }[];
  shared: AnswerSummary[];
}

/** "From Service Canada to the CRA" notes attached to the step you are handed to. */
export function buildHandoffs(journey: Journey, results: Results, answers: Answers, model: ContentModel = CONTENT): HandoffNote[] {
  const stepFor = (id: string | null | undefined) => (id ? journey.steps.find((s) => s.program.id === id) : undefined);
  return model.handoffs
    .filter((h) => matches(h.conditions, answers, results) && stepFor(h.toProgramId))
    .map((h) => ({
      handoff: h,
      fromStep: stepFor(h.fromProgramId)?.number,
      toStep: stepFor(h.toProgramId)!.number,
      unlocks: journey.steps
        .filter((s) => s.result.dependencyIds.includes(h.toProgramId))
        .map((s) => ({ number: s.number, name: s.program.name })),
      shared: summarizeAnswers(answers, model, h.sharedQuestionIds),
    }))
    .sort((a, b) => a.toStep - b.toStep);
}

// ---------------------------------------------------------------------------
// Which questions to ask

interface RuleTrace {
  ruleIds: Set<string>;
  /** Questions (still unanswered) that could change which rule applies. */
  deps: Set<string>;
}

/**
 * Three-valued evaluation: true, false, or null ("depends on a question not yet
 * answered"). Unanswered questions that matter are collected in `needed`.
 */
function evaluatePartial(
  condition: Condition,
  answers: Answers,
  pending: Set<string>,
  traces: Record<string, RuleTrace>,
  rulesById: Map<string, Rule>,
  needed: Set<string>,
): boolean | null {
  if (condition.always) return true;
  if (condition.all) {
    const local = new Set<string>();
    let unknown = false;
    for (const c of condition.all) {
      const v = evaluatePartial(c, answers, pending, traces, rulesById, local);
      if (v === false) return false;
      if (v === null) unknown = true;
    }
    if (unknown) local.forEach((q) => needed.add(q));
    return unknown ? null : true;
  }
  if (condition.any) {
    const local = new Set<string>();
    let unknown = false;
    for (const c of condition.any) {
      const v = evaluatePartial(c, answers, pending, traces, rulesById, local);
      if (v === true) return true;
      if (v === null) unknown = true;
    }
    if (unknown) local.forEach((q) => needed.add(q));
    return unknown ? null : false;
  }
  if (condition.not) {
    const v = evaluatePartial(condition.not, answers, pending, traces, rulesById, needed);
    return v === null ? null : !v;
  }
  if (condition.result) {
    const trace = traces[condition.result];
    if (!trace) return false;
    const states = [...trace.ruleIds].map((id) => (id ? rulesById.get(id)!.resultState : null));
    const hits = states.filter((s) => s !== null && (condition.resultIn ?? []).includes(s)).length;
    if (hits === 0) return false;
    if (hits === states.length) return true;
    trace.deps.forEach((q) => needed.add(q));
    return null;
  }
  if (condition.q && condition.q !== 'situation' && pending.has(condition.q)) {
    needed.add(condition.q);
    return null;
  }
  return matches(condition, answers);
}

function traceRules(answers: Answers, pending: Set<string>, model: ContentModel): Record<string, RuleTrace> {
  const rulesById = new Map(model.rules.map((r) => [r.ruleId, r]));
  const traces: Record<string, RuleTrace> = {};
  for (const program of dependencyOrder(model.programs, model.rules)) {
    const needed = new Set<string>();
    const possible = new Set<string>();
    const triggered = program.trigger
      ? evaluatePartial(program.trigger, answers, pending, traces, rulesById, needed)
      : true;
    if (triggered === false) continue;
    if (triggered === null) possible.add('');
    for (const rule of model.rules.filter((r) => r.programId === program.id)) {
      const v = evaluatePartial(rule.conditions, answers, pending, traces, rulesById, needed);
      if (v === false) continue;
      possible.add(rule.ruleId);
      if (v === true) break;
    }
    traces[program.id] = { ruleIds: possible, deps: possible.size > 1 ? needed : new Set() };
  }
  return traces;
}

export interface AskedQuestion {
  question: Question;
  purpose: 'eligibility' | 'navigation';
  /** Rule ids that read this answer. */
  usedBy: string[];
}

/**
 * The questions to ask for a situation, in order. A question is asked only if
 * some rule's outcome still depends on it, given the earlier answers.
 */
export function askedQuestions(situationId: string, answers: Answers, model: ContentModel = CONTENT): AskedQuestion[] {
  const byId = new Map(model.questions.map((q) => [q.id, q]));
  const order = model.scenario.questionOrder.filter((id) => byId.has(id));
  const known: Answers = { situation: situationId };
  const asked: AskedQuestion[] = [];
  for (let i = 0; i < order.length; i++) {
    const question = byId.get(order[i])!;
    if (question.showIf && !matches(question.showIf, known)) continue;
    const traces = traceRules(known, new Set(order.slice(i)), model);
    if (question.purpose === 'navigation') {
      if (model.programs.some((p) => traces[p.id] && p.channels.includes('in_person'))) {
        asked.push({ question, purpose: 'navigation', usedBy: [] });
      }
      continue;
    }
    const usedBy = Object.values(traces)
      .filter((t) => t.deps.has(question.id))
      .flatMap((t) => [...t.ruleIds].filter(Boolean));
    if (usedBy.length) {
      asked.push({ question, purpose: 'eligibility', usedBy });
      if (answers[question.id] !== undefined) known[question.id] = answers[question.id];
    }
  }
  return asked;
}

/** The answers to questions that are still asked (plus the situation). */
export function relevantAnswers(situationId: string, answers: Answers, model: ContentModel = CONTENT): Answers {
  const out: Answers = { situation: situationId };
  for (const { question } of askedQuestions(situationId, answers, model)) {
    if (answers[question.id] !== undefined) out[question.id] = answers[question.id];
  }
  return out;
}

/** Like `relevantAnswers`, but only answers that rules read (not the city). */
export function eligibilityAnswers(situationId: string, answers: Answers, model: ContentModel = CONTENT): Answers {
  const out: Answers = { situation: situationId };
  for (const { question, purpose } of askedQuestions(situationId, answers, model)) {
    if (purpose === 'eligibility' && answers[question.id] !== undefined) out[question.id] = answers[question.id];
  }
  return out;
}

/** Records an answer and drops answers to questions that no longer apply. */
export function withAnswer(
  situationId: string,
  answers: Answers,
  questionId: string,
  value: AnswerValue,
  model: ContentModel = CONTENT,
): Answers {
  const next = { ...answers, [questionId]: value };
  const stillAsked = new Set(askedQuestions(situationId, next, model).map((a) => a.question.id));
  return Object.fromEntries(Object.entries(next).filter(([id]) => stillAsked.has(id)));
}

export function allAnswered(situationId: string, answers: Answers, model: ContentModel = CONTENT): boolean {
  return askedQuestions(situationId, answers, model).every((a) => answers[a.question.id] !== undefined);
}

// ---------------------------------------------------------------------------
// Roadmap statuses

export type RoadmapStatus =
  | 'you_are_here'
  | 'next'
  | 'not_yet'
  | 'may_apply'
  | 'check_this'
  | 'get_help'
  | 'coming_up'
  | 'done';

export function statusForState(state: ResultState): RoadmapStatus {
  switch (state) {
    case 'likely':
      return 'may_apply';
    case 'maybe':
      return 'check_this';
    case 'not_yet':
      return 'not_yet';
    case 'needs_info':
      return 'get_help';
    default:
      return 'coming_up';
  }
}

interface NodeBase {
  key: string;
  position: number;
  status: RoadmapStatus;
}
export interface StepNode extends NodeBase {
  kind: 'step';
  step: JourneyStep;
  prereqs: JourneyStep[];
}
/** "Check other supports": the extra explore steps, grouped. */
export interface GroupNode extends NodeBase {
  kind: 'group';
  steps: JourneyStep[];
}
export type RoadmapNode = StepNode | GroupNode;

export interface Roadmap {
  nodes: RoadmapNode[];
  currentIndex: number;
  doneCount: number;
}

export const prerequisitesOf = (step: JourneyStep, journey: Journey) =>
  journey.steps.filter((s) => step.waitsOn.includes(s.number));

export const nodeSteps = (node: RoadmapNode): JourneyStep[] => (node.kind === 'step' ? [node.step] : node.steps);

/** Turns the journey into roadmap rows with a status each. `completed` holds program ids ticked off. */
export function buildRoadmap(journey: Journey, completed: Set<string>): Roadmap {
  const main = journey.steps.filter((s) => s.section !== 'explore');
  const explore = journey.steps.filter((s) => s.section === 'explore');
  const promoted: JourneyStep[] = [];
  const grouped: JourneyStep[] = [];
  for (const s of explore) {
    if ((s.result.state === 'likely' || s.result.state === 'not_yet') && promoted.length < MAX_EXPLORE_STEPS) {
      promoted.push(s);
    } else {
      grouped.push(s);
    }
  }
  const nodes: RoadmapNode[] = [];
  for (const step of [...main, ...promoted]) {
    const prereqs = prerequisitesOf(step, journey);
    const unblocked =
      step.result.state === 'not_yet' && prereqs.length > 0 && prereqs.every((p) => completed.has(p.program.id));
    nodes.push({
      kind: 'step',
      key: step.program.id,
      position: nodes.length + 1,
      status: completed.has(step.program.id) ? 'done' : unblocked ? 'check_this' : statusForState(step.result.state),
      step,
      prereqs,
    });
  }
  if (grouped.length) {
    nodes.push({
      kind: 'group',
      key: 'group-explore',
      position: nodes.length + 1,
      status: grouped.every((s) => completed.has(s.program.id)) ? 'done' : 'coming_up',
      steps: grouped,
    });
  }
  const actionable = (n: RoadmapNode) =>
    n.status !== 'done' &&
    n.status !== 'not_yet' &&
    (n.kind === 'group' || n.step.result.state !== 'not_yet' || n.status === 'check_this');
  const current = nodes.findIndex(actionable);
  if (current >= 0) {
    nodes[current].status = 'you_are_here';
    const next = nodes.findIndex((n, i) => i > current && actionable(n));
    if (next >= 0 && nodes[next].status !== 'get_help') nodes[next].status = 'next';
  }
  return { nodes, currentIndex: current, doneCount: nodes.filter((n) => n.status === 'done').length };
}
