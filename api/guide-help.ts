/**
 * POST /api/guide-help: explains what one of the guided chat's scripted questions means, using
 * ONLY guide/explanations.json (bundled at deploy time). It never records answers or gives
 * eligibility, benefit, legal or immigration advice; anything out of scope gets a fixed message
 * written here, not by the model.
 *
 * Request:  { "questionId": "income", "message": "..." }   (message 1-500 characters)
 * Response: { "type": "explain" | "redirect", "answer": "..." }
 *       or  { "error": { "code", "message" } }  with status 400/405/413/500/502
 *
 * The only network call is to the LLM provider (same client and env vars as api/chat.ts,
 * no tools). Messages and answers are never logged.
 */
import explanationsJson from '../guide/explanations.json' with { type: 'json' };
import {
  buildHelpResponse,
  buildHelpSystemPrompt,
  helpSchema,
  loadExplanations,
  parseModelHelp,
  validateHelpRequest,
} from './_lib/guide-help.js';
import { completeJson, readLlmConfig } from './_lib/llm.js';

const MAX_BODY_BYTES = 4 * 1024;
const MAX_REPLY_TOKENS = 600;
const PROVIDER_TIMEOUT_MS = 20_000;

// Checked once at cold start: a malformed explanations file fails every request.
const ENTRIES = loadExplanations(explanationsJson);
const SCHEMA = helpSchema(ENTRIES);

type HelpErrorCode = 'method_not_allowed' | 'bad_request' | 'payload_too_large' | 'not_configured' | 'upstream_error';

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

function fail(status: number, code: HelpErrorCode, message: string, headers?: Record<string, string>): Response {
  return json(status, { error: { code, message } }, headers);
}

const UPSTREAM_FAILED = (): Response =>
  fail(502, 'upstream_error', 'The help service is temporarily unavailable. Please try again later.');

export async function handleGuideHelp(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return fail(405, 'method_not_allowed', 'Only POST is allowed.', { Allow: 'POST' });
  }

  const config = readLlmConfig();
  if ('missing' in config) {
    console.error(`[api/guide-help] Missing environment variables: ${config.missing.join(', ')}`);
    return fail(500, 'not_configured', 'The help service is not configured.');
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
  const checked = validateHelpRequest(body, ENTRIES);
  if ('error' in checked) return fail(400, 'bad_request', checked.error);

  const content = await completeJson(
    config,
    {
      system: buildHelpSystemPrompt(ENTRIES, checked.questionId),
      user: checked.message,
      schemaName: 'guide_help',
      schema: SCHEMA,
      maxTokens: MAX_REPLY_TOKENS,
      timeoutMs: PROVIDER_TIMEOUT_MS,
    },
    'api/guide-help',
  );
  if (content === null) return UPSTREAM_FAILED();

  const model = parseModelHelp(content);
  if (!model) {
    console.error('[api/guide-help] Provider reply was not the expected JSON');
    return UPSTREAM_FAILED();
  }
  return json(200, buildHelpResponse(model, ENTRIES, checked));
}

/** Vercel Node.js runtime entry point (Web-standard fetch handler). */
export default { fetch: handleGuideHelp };
