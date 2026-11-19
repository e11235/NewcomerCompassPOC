/**
 * Keeps guide/explanations.json in step with the scripted chat questions: every question
 * the chat can ask has an entry, and each entry lists exactly that question's answer pills.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CONTENT } from '../src/app/content/content-data.ts';
import type { Question } from '../src/app/content/types.ts';
import { UI_STRINGS } from '../src/app/i18n/ui-strings.ts';
import explanations from './explanations.json' with { type: 'json' };

interface Explanation {
  id: string;
  question: string;
  options: string[];
  meaning: string;
  whyWeAsk: string;
  examples: string[];
  notCovered: string[];
}

const ENTRIES = explanations as Explanation[];

/** The English pill labels the guided chat shows for a question (see ChatQuestion in guided-chat.ts). */
function pillLabels(q: Question): string[] {
  const labels = (q.options ?? []).map((o) => o.label.en);
  if (q.kind === 'text' && !q.required) labels.push(UI_STRINGS.en.skipQuestion);
  return labels;
}

const scriptedIds = [...new Set([...CONTENT.scenario.questionOrder, ...CONTENT.questions.map((q) => q.id)])];

describe('guide/explanations.json', () => {
  it('has an entry for every scripted question', () => {
    const ids = new Set(ENTRIES.map((e) => e.id));
    const missing = scriptedIds.filter((id) => !ids.has(id));
    assert.deepEqual(missing, [], `No explanation for: ${missing.join(', ')}`);
  });

  it('has no entries for questions that do not exist, and no duplicates', () => {
    const ids = ENTRIES.map((e) => e.id);
    assert.deepEqual(ids.filter((id) => !scriptedIds.includes(id)), []);
    assert.equal(new Set(ids).size, ids.length);
  });

  for (const q of CONTENT.questions) {
    it(`"${q.id}" matches the question text and its pills`, () => {
      const entry = ENTRIES.find((e) => e.id === q.id);
      assert.ok(entry, `No explanation for ${q.id}`);
      assert.equal(entry.question, q.label.en);
      assert.deepEqual(entry.options, pillLabels(q));
    });
  }

  it('fills in every field', () => {
    for (const e of ENTRIES) {
      for (const key of ['question', 'meaning', 'whyWeAsk'] as const) {
        assert.ok(typeof e[key] === 'string' && e[key].trim(), `${e.id}.${key} is empty`);
      }
      for (const key of ['examples', 'notCovered'] as const) {
        assert.ok(Array.isArray(e[key]) && e[key].length > 0, `${e.id}.${key} is empty`);
        assert.ok(e[key].every((s) => typeof s === 'string' && s.trim()), `${e.id}.${key} has an empty item`);
      }
    }
  });
});
