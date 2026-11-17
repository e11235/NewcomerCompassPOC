/**
 * Understands short typed answers in the guided chat, and refuses personal
 * identifiers. Ported from the click-through prototype. Nothing typed is kept:
 * only the matching option is recorded.
 */
import type { AnswerValue, LanguageCode, Question } from '../content/types';
import { FOREIGN_TAX_PHRASES, HELP_PHRASES, PHRASES, WHY_PHRASES } from './chat-phrases';

/** Lower-cases, strips accents and Arabic diacritics, and collapses spaces. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}'$,.\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const hasArabic = (s: string) => /[؀-ۿ]/.test(s);
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whole-word phrase match (substring match for longer Arabic phrases). */
function containsPhrase(normalizedText: string, phrase: string): boolean {
  const p = normalize(phrase);
  if (!p) return false;
  if (hasArabic(p) && p.length > 3) return normalizedText.includes(p);
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(p)}($|[^\\p{L}\\p{N}])`, 'u').test(normalizedText);
}

export type IdentifierKind = 'email' | 'sin' | 'phone' | 'uci' | 'postal' | 'dob' | 'name' | 'document' | 'address' | 'number';

/** Detects personal identifiers (SIN, phone, email, address, …) in typed text. */
export function detectIdentifier(text: string): IdentifierKind | null {
  const t = text.toLowerCase();
  const digits = t.replace(/[^0-9]/g, '');
  if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/.test(t)) return 'email';
  if (/\bsin\b.*\d{3}|\d{3}[\s-]?\d{3}[\s-]?\d{3}(?!\d)/.test(t) && !/\$/.test(t)) {
    return /\b\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b/.test(t) || /\(\d{3}\)/.test(t) ? 'phone' : 'sin';
  }
  if (/\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b/.test(t)) return 'phone';
  if ((/\buci\b|\bidentificateur unique\b|رقم العميل/.test(t) && /\d/.test(t)) || /\b\d{2}-?\d{4}-?\d{4}\b/.test(t)) {
    return 'uci';
  }
  if (/\b[a-z]\d[a-z][\s-]?\d[a-z]\d\b/.test(t)) return 'postal';
  if (
    /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b|\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b|date of birth|born on|\bdob\b|date de naissance|ne le |née le |تاريخ الميلاد|مواليد/.test(
      t,
    )
  ) {
    return 'dob';
  }
  if (/my name is|i am called|call me |je m'appelle|mon nom est|اسمي/.test(t)) return 'name';
  if (
    /passport|passeport|جواز|permit number|numero de permis|numéro de permis|document number|numéro de document|\b[a-z]{1,2}\d{6,9}\b/.test(
      t,
    )
  ) {
    return 'document';
  }
  if (/\b\d+\s+[a-z]+(\s[a-z]+)?\s(street|st|avenue|ave|road|rd|blvd|boulevard|drive|dr|crescent|cres|rue|chemin)\b/.test(t)) {
    return 'address';
  }
  if (digits.length >= 7 && !/\$/.test(t)) return 'number';
  return null;
}

export type CityCheck =
  | { ok: true; value: string }
  | { ok: false; reason: 'empty' | 'tooPrecise' | 'tooLong' }
  | { ok: false; reason: 'identifier'; what: IdentifierKind };

/** A city name must be just a name: no numbers, addresses or other identifiers. */
export function checkCity(text: string): CityCheck {
  const value = text.replace(/\s+/g, ' ').trim();
  if (!value) return { ok: false, reason: 'empty' };
  const id = detectIdentifier(value);
  if (id) return { ok: false, reason: 'identifier', what: id };
  if (/\d/.test(value)) return { ok: false, reason: 'tooPrecise' };
  if (value.length > 60) return { ok: false, reason: 'tooLong' };
  return { ok: true, value };
}

function phrasesFor(question: Question, value: string): string[] {
  const specific = PHRASES[question.id]?.[value] ?? [];
  const generic = PHRASES['_generic']?.[value] ?? [];
  const label = question.options?.find((o) => o.value === value)?.label;
  return [...specific, ...generic, ...(label ? [label.en, label.fr, label.ar] : [])];
}

function incomeRange(text: string): string | null {
  const m = text.match(/\$?\s?(\d{1,3}(?:[,\s]\d{3})+|\d+(?:\.\d+)?)\s?(k|thousand|mille|الف|ألف)?/);
  if (!m) return null;
  let amount = Number(m[1].replace(/[,\s]/g, ''));
  if (m[2]) amount *= 1000;
  if (!Number.isFinite(amount) || amount < 100) return null;
  return amount < 20000 ? 'under20' : amount < 40000 ? '20to40' : amount < 60000 ? '40to60' : 'over60';
}

function childCount(text: string): string | null {
  const numbers = text.match(/\b\d+\b/g);
  if (!numbers || numbers.length !== 1) return null;
  const n = Number(numbers[0]);
  return n === 0 ? '0' : n === 1 ? '1' : n === 2 ? '2' : n >= 3 && n < 20 ? '3plus' : null;
}

export type TypedAnswer =
  | { kind: 'identifier'; what: IdentifierKind }
  | { kind: 'match'; value: string }
  | { kind: 'unclear'; candidates: string[]; foreignTax?: boolean }
  | { kind: 'help' }
  | { kind: 'why' };

/** Maps a typed answer to one option of the question, if it clearly means one. */
export function interpretTyped(question: Question, typed: string): TypedAnswer {
  const id = detectIdentifier(typed);
  if (id) return { kind: 'identifier', what: id };
  const text = normalize(typed);
  if (!text) return { kind: 'unclear', candidates: [] };
  if (question.id === 'filedTax' && FOREIGN_TAX_PHRASES.some((p) => containsPhrase(text, p))) {
    return { kind: 'unclear', candidates: [], foreignTax: true };
  }
  if (question.id === 'income') {
    const range = incomeRange(text);
    if (range) return { kind: 'match', value: range };
  }
  if (question.id === 'children') {
    const count = childCount(text);
    if (count) return { kind: 'match', value: count };
  }
  if (question.id === 'province') {
    const code = question.options?.find((o) => o.value.toLowerCase() === text && o.value !== 'unsure');
    if (code) return { kind: 'match', value: code.value };
  }
  const values = (question.options ?? []).map((o) => o.value);
  const hits: { value: string; phrase: string }[] = [];
  for (const value of values) {
    const best = phrasesFor(question, value)
      .filter((p) => containsPhrase(text, p))
      .sort((a, b) => normalize(b).length - normalize(a).length)[0];
    if (best) hits.push({ value, phrase: normalize(best) });
  }
  if (hits.length === 1) return { kind: 'match', value: hits[0].value };
  if (hits.length > 1) {
    if (
      hits.some((h) => h.value === 'unsure') &&
      values.includes('unsure') &&
      PHRASES['_generic']['unsure'].some((p) => containsPhrase(text, p))
    ) {
      return { kind: 'match', value: 'unsure' };
    }
    const [longest, ...rest] = [...hits].sort((a, b) => b.phrase.length - a.phrase.length);
    return rest.every((h) => longest.phrase.includes(h.phrase) && longest.phrase !== h.phrase)
      ? { kind: 'match', value: longest.value }
      : { kind: 'unclear', candidates: hits.map((h) => h.value) };
  }
  if (HELP_PHRASES.some((p) => containsPhrase(text, p))) return { kind: 'help' };
  if (WHY_PHRASES.some((p) => containsPhrase(text, p))) return { kind: 'why' };
  return { kind: 'unclear', candidates: [] };
}

/** An answer in words, e.g. "Ontario", or the fallback when there is none. */
export function answerText(
  question: Question,
  value: AnswerValue | undefined,
  lang: LanguageCode,
  noneText: string,
  notAnsweredText: string,
): string {
  if (value === undefined || value === '') return notAnsweredText;
  const values = Array.isArray(value) ? value : [value];
  if (!values.length) return noneText;
  return values.map((v) => question.options?.find((o) => o.value === v)?.label[lang] ?? v).join(lang === 'ar' ? '، ' : ', ');
}
