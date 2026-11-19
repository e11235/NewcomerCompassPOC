/**
 * POST /api/chat: answers a question about the Temporary Foreign Worker Program using ONLY the
 * three allowlisted canada.ca pages in corpus/pages.json (bundled at deploy time, refreshed by
 * the crawl workflow). Every citation is checked against the page text here, on the server, and
 * every link is built from the allowlist; nothing the model writes becomes a URL.
 *
 * Request:  { "question": "..." }   (1-1000 characters)
 * Response: { "answer": "...", "citations": [{ "title", "quote", "link" }] }
 *       or  { "answer": null, "sources": [{ "title", "url" }] }        (not found in the pages)
 *       or  { "error": { "code", "message" } }  with status 400/405/413/500/502
 *
 * The only network call is to the LLM provider (OpenAI-compatible endpoint, no tools).
 * Questions and answers are never logged.
 *
 * Environment: LLM_BASE_URL (e.g. https://generativelanguage.googleapis.com/v1beta/openai),
 * LLM_API_KEY, LLM_MODEL.
 */
import corpusJson from '../corpus/pages.json' with { type: 'json' };
import {
  answerSchema,
  buildChatResponse,
  buildSystemPrompt,
  loadCorpus,
  parseModelAnswer,
} from './_lib/grounding.js';
import { completeJson, readLlmConfig } from './_lib/llm.js';

const MAX_QUESTION_CHARS = 1000;
const MAX_BODY_BYTES = 16 * 1024;
const MAX_REPLY_TOKENS = 2048;
const PROVIDER_TIMEOUT_MS = 25_000;

// Checked once at cold start: a corpus that does not match the allowlist fails every request.
const PAGES = loadCorpus(corpusJson);
const SYSTEM_PROMPT = buildSystemPrompt(PAGES);
const ANSWER_SCHEMA = answerSchema();

export type ChatErrorCode = 'method_not_allowed' | 'bad_request' | 'payload_too_large' | 'not_configured' | 'upstream_error';

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

function fail(status: number, code: ChatErrorCode, message: string, headers?: Record<string, string>): Response {
  return json(status, { error: { code, message } }, headers);
}

const UPSTREAM_FAILED = (): Response =>
  fail(502, 'upstream_error', 'The answer service is temporarily unavailable. Please try again later.');

/** Returns the trimmed question, or an error message for a 400. */
export function validateQuestion(body: unknown): { question: string } | { error: string } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { error: 'Body must be a JSON object with a "question" string.' };
  }
  const { question } = body as { question?: unknown };
  if (typeof question !== 'string') return { error: '"question" must be a string.' };
  const trimmed = question.trim();
  if (!trimmed) return { error: 'Please type a question.' };
  if (trimmed.length > MAX_QUESTION_CHARS) {
    return { error: `Questions can be at most ${MAX_QUESTION_CHARS} characters long.` };
  }
  return { question: trimmed };
}

export async function handleChat(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return fail(405, 'method_not_allowed', 'Only POST is allowed.', { Allow: 'POST' });
  }

  const config = readLlmConfig();
  if ('missing' in config) {
    console.error(`[api/chat] Missing environment variables: ${config.missing.join(', ')}`);
    return fail(500, 'not_configured', 'The chat service is not configured.');
  }

  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return fail(413, 'payload_too_large', 'Request body is too large.');
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return fail(413, 'payload_too_large', 'Request body is too large.');

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, 'bad_request', 'Body must be valid JSON.');
  }
  const checked = validateQuestion(body);
  if ('error' in checked) return fail(400, 'bad_request', checked.error);

  const content = await completeJson(
    config,
    {
      system: SYSTEM_PROMPT,
      user: checked.question,
      schemaName: 'grounded_answer',
      schema: ANSWER_SCHEMA,
      maxTokens: MAX_REPLY_TOKENS,
      timeoutMs: PROVIDER_TIMEOUT_MS,
    },
    'api/chat',
  );
  if (content === null) return UPSTREAM_FAILED();

  // A reply that is not the expected JSON, or whose citations all fail verification, becomes the
  // "not found in the official pages" fallback rather than an error.
  return json(200, buildChatResponse(parseModelAnswer(content), PAGES));
}

/** Vercel Node.js runtime entry point (Web-standard fetch handler). */
export default { fetch: handleChat };
