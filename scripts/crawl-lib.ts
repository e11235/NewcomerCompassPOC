/**
 * Pure helpers for scripts/crawl.ts: turn a canada.ca page into plain text, and decide whether
 * a new snapshot looks safe to commit. No I/O here, so it can be unit tested.
 */
import { createHash } from 'node:crypto';
import * as cheerio from 'cheerio';
import type { AnyNode, Element } from 'domhandler';

/** Elements whose content is never part of the page's main text. */
const REMOVE_SELECTOR = [
  'script',
  'style',
  'noscript',
  'template',
  'nav',
  'header',
  'footer',
  'aside',
  'iframe',
  'svg',
  'form',
  // canada.ca "Report a problem / Share / Date modified" block at the end of <main>.
  '.pagedetails',
  '[hidden]',
  '[aria-hidden="true"]',
].join(',');

const HEADING = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const BLOCK = new Set([
  'address', 'article', 'blockquote', 'br', 'dd', 'details', 'div', 'dl', 'dt', 'figcaption', 'figure',
  'hr', 'li', 'ol', 'p', 'pre', 'section', 'summary', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
]);

function hasInlineDisplayNone(el: Element): boolean {
  const style = el.attribs?.['style'];
  return !!style && /(^|;)\s*display\s*:\s*none\s*(!important\s*)?(;|$)/i.test(style);
}

/**
 * Removes in-page navigation that is not content:
 * - language pickers: a list where every item is just one link and most items carry a `lang`
 *   attribute (the current language is an <a aria-current="page">), plus its "Language selection" label
 * - "On this page" tables of contents: that heading and the following list, if every link in it
 *   points to an anchor on the same page
 */
function removeNavLists($: cheerio.CheerioAPI, main: cheerio.Cheerio<Element>): void {
  main.find('ul, ol').each((_, list) => {
    const items = $(list).children('li');
    if (items.length < 2) return;
    const allSingleLinks = items.toArray().every((li) => {
      const $li = $(li);
      return $li.find('a').length === 1 && $li.text().trim() === $li.find('a').text().trim();
    });
    const withLang = items.filter((_, li) => $(li).is('[lang]') || $(li).find('[lang]').length > 0).length;
    if (allSingleLinks && withLang >= items.length / 2) $(list).remove();
  });
  main.find('.wb-inv').each((_, el) => {
    if (/^\s*language selection:?\s*$/i.test($(el).text())) $(el).remove();
  });

  main.find('h2, h3').each((_, h) => {
    if (!/^\s*on this page\s*$/i.test($(h).text())) return;
    const list = $(h).nextAll().first();
    if (!list.is('ul, ol')) return;
    const links = list.find('a').toArray();
    if (links.length && links.every((a) => ($(a).attr('href') ?? '').startsWith('#'))) {
      list.remove();
      $(h).remove();
    }
  });
}

export interface Extracted {
  title: string;
  text: string;
}

/** Extracts the visible text of <main>, with headings and blocks on their own lines. */
export function extractMainText(html: string): Extracted {
  const $ = cheerio.load(html);
  const main = $('main').first();
  if (main.length === 0) throw new Error('No <main> element found');

  main.find(REMOVE_SELECTOR).remove();
  main.find('[style]').each((_, el) => {
    if (hasInlineDisplayNone(el as Element)) $(el).remove();
  });
  removeNavLists($, main);

  const out: string[] = [];
  const walk = (node: AnyNode): void => {
    if (node.type === 'text') {
      out.push((node as unknown as { data: string }).data.replace(/\s+/g, ' '));
      return;
    }
    if (node.type !== 'tag') return;
    const el = node as Element;
    const name = el.name.toLowerCase();
    const heading = HEADING.has(name);
    const block = heading || BLOCK.has(name);
    if (heading) out.push('\n\n');
    else if (block) out.push('\n');
    for (const child of el.children) walk(child);
    if (heading) out.push('\n\n');
    else if (block) out.push('\n');
  };
  for (const child of main.get(0)!.children) walk(child);

  const text = normalizeText(out.join(''));
  const title = (main.find('h1').first().text() || $('title').first().text()).replace(/\s+/g, ' ').trim();
  return { title, text };
}

/** Trims every line, collapses runs of spaces, and allows at most one blank line in a row. */
export function normalizeText(text: string): string {
  return text
    .replace(/ /g, ' ')
    .split('\n')
    .map((line) => line.replace(/[ \t\f\v\r]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function sha256(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Share of the page that changed, from 0 (identical) to 1 (nothing in common), measured by
 * the longest common subsequence of words: 1 - LCS / max(old words, new words).
 */
export function changeRatio(oldText: string, newText: string): number {
  const a = oldText.split(/\s+/).filter(Boolean);
  const b = newText.split(/\s+/).filter(Boolean);
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 0;
  let prev = new Uint32Array(b.length + 1);
  let cur = new Uint32Array(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    }
    [prev, cur] = [cur, prev];
  }
  return 1 - prev[b.length] / longest;
}

/** Phrases that suggest someone is trying to talk to an LLM through the page text. */
const SUSPICIOUS: readonly RegExp[] = [
  /ignore\s+(all\s+|any\s+)?(the\s+)?(previous|prior|above|earlier|preceding)\s+(instructions|prompts?|rules)/i,
  /disregard\s+(all\s+|any\s+)?(the\s+)?(previous|prior|above|earlier|preceding)\s+(instructions|prompts?|rules)/i,
  /system\s+prompt/i,
  /\b(you\s+are\s+now|act\s+as)\s+(an?\s+)?(ai|assistant|chatbot|language\s+model)/i,
  /<\/?\s*(source|sources|system|instructions?)\s*>/i,
];

/** Returns the suspicious phrases found in the text (empty when it looks clean). */
export function findSuspiciousPhrases(text: string): string[] {
  return SUSPICIOUS.flatMap((re) => {
    const m = text.match(re);
    return m ? [m[0]] : [];
  });
}
