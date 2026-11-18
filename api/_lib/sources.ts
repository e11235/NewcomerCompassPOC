/**
 * The allowlist: the only pages the crawler fetches and the only URLs the chat ever links to.
 * scripts/crawl.ts imports this list; api/chat.ts builds every link from it.
 * (It lives under api/_lib so Vercel loads it as an ES module; files starting with _ are not routes.)
 */
export const SOURCES = [
  {
    id: 'tfw-program',
    url: 'https://www.canada.ca/en/employment-social-development/programs/temporary-foreign-worker.html',
  },
  {
    id: 'report-abuse',
    url: 'https://www.canada.ca/en/employment-social-development/services/foreign-workers/report-abuse.html',
  },
  {
    id: 'protected-rights',
    url: 'https://www.canada.ca/en/employment-social-development/services/foreign-workers/protected-rights.html',
  },
] as const;

export type SourceId = (typeof SOURCES)[number]['id'];
export const SOURCE_IDS: readonly SourceId[] = SOURCES.map((s) => s.id);
