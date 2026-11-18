/**
 * Fetches the three allowlisted canada.ca pages and writes corpus/pages.json.
 *
 * This is the only code in the project that fetches external pages. It takes no arguments and
 * reads no input: the URLs are hardcoded below. It exits non-zero, without writing anything, when:
 *   - a fetch fails, is not HTTPS, or is redirected anywhere other than https://www.canada.ca
 *   - a page has no <main> or almost no text
 *   - a page's text changed by more than MAX_CHANGE since the last snapshot
 *   - a page's text contains phrases aimed at an LLM ("ignore previous instructions", …)
 * so the scheduled workflow fails and a person reviews the change.
 *
 * pages.json is rewritten only when at least one page's text hash changed. Pages whose text is
 * unchanged keep their previous entry (including fetchedAt, i.e. when that text was captured).
 *
 * Run: npm run crawl
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { changeRatio, extractMainText, findSuspiciousPhrases, sha256 } from './crawl-lib.ts';
/** The entire corpus (hardcoded, shared with api/chat.ts). No other URL is ever fetched. */
import { SOURCES } from '../api/_lib/sources.ts';

const ALLOWED_HOST = 'www.canada.ca';
const MAX_REDIRECTS = 5;
const MAX_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 30_000;
const MIN_TEXT_CHARS = 200;
/** Above this share of changed words, a person must review the update. */
const MAX_CHANGE = 0.3;

const OUT_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../corpus/pages.json');

export interface Page {
  id: string;
  title: string;
  url: string;
  text: string;
  fetchedAt: string;
  hash: string;
}

function assertAllowed(url: URL): void {
  if (url.protocol !== 'https:') throw new Error(`Refusing non-HTTPS URL: ${url.href}`);
  if (url.hostname !== ALLOWED_HOST) throw new Error(`Refusing URL outside ${ALLOWED_HOST}: ${url.href}`);
  if (url.username || url.password || url.port) throw new Error(`Refusing URL with credentials or port: ${url.href}`);
}

/** Fetches a page, following redirects by hand only while they stay on https://www.canada.ca. */
async function fetchHtml(startUrl: string): Promise<string> {
  let url = new URL(startUrl);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    assertAllowed(url);
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': 'corpus-crawler/1.0', Accept: 'text/html' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) throw new Error(`Redirect without Location from ${url.href}`);
      const next = new URL(location, url);
      assertAllowed(next); // fails if the redirect leaves www.canada.ca
      console.log(`  redirect ${res.status}: ${url.href} -> ${next.href}`);
      url = next;
      continue;
    }
    if (res.status !== 200) throw new Error(`HTTP ${res.status} from ${url.href}`);
    const type = res.headers.get('content-type') ?? '';
    if (!type.includes('text/html')) throw new Error(`Unexpected content-type "${type}" from ${url.href}`);
    const body = await res.text();
    if (body.length > MAX_BYTES) throw new Error(`Response too large from ${url.href}`);
    return body;
  }
  throw new Error(`Too many redirects from ${startUrl}`);
}

async function readPrevious(): Promise<Map<string, Page>> {
  try {
    const pages = JSON.parse(await readFile(OUT_FILE, 'utf8')) as Page[];
    return new Map(pages.map((p) => [p.id, p]));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return new Map();
    throw e;
  }
}

async function main(): Promise<void> {
  const previous = await readPrevious();
  const fetchedAt = new Date().toISOString();
  const problems: string[] = [];
  const pages: Page[] = [];
  let changed = previous.size !== SOURCES.length;

  for (const source of SOURCES) {
    console.log(`Fetching ${source.id}`);
    const { title, text } = extractMainText(await fetchHtml(source.url));
    if (text.length < MIN_TEXT_CHARS) throw new Error(`${source.id}: only ${text.length} characters of text extracted`);
    const hash = sha256(text);
    const old = previous.get(source.id);

    if (old && old.hash === hash && old.url === source.url) {
      console.log(`  unchanged (${text.length} chars)`);
      pages.push(old);
      continue;
    }
    changed = true;

    const suspicious = findSuspiciousPhrases(text);
    if (suspicious.length) problems.push(`${source.id}: suspicious phrases ${JSON.stringify(suspicious)}`);
    if (old) {
      const ratio = changeRatio(old.text, text);
      console.log(`  changed: ${(ratio * 100).toFixed(1)}% of words (${old.text.length} -> ${text.length} chars)`);
      if (ratio > MAX_CHANGE) {
        problems.push(`${source.id}: ${(ratio * 100).toFixed(1)}% changed (limit ${MAX_CHANGE * 100}%)`);
      }
    } else {
      console.log(`  new (${text.length} chars)`);
    }
    pages.push({ id: source.id, title, url: source.url, text, fetchedAt, hash });
  }

  if (problems.length) {
    console.error('\nNot writing corpus/pages.json. Review these changes manually:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  if (!changed) {
    console.log('\nNo changes; corpus/pages.json left as is.');
    return;
  }
  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(pages, null, 2) + '\n', 'utf8');
  console.log(`\nWrote ${OUT_FILE}`);
}

main().catch((e: unknown) => {
  console.error(`Crawl failed: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});
