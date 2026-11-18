/**
 * POST /api/chat: forwards a chat conversation to an OpenAI-compatible LLM endpoint
 * and returns the assistant's reply. Runs as a Vercel serverless function so the
 * API key stays on the server.
 *
 * Settings come only from environment variables, so the provider (Gemini, Groq,
 * OpenRouter, …) can change without code changes:
 *   LLM_BASE_URL  e.g. https://api.groq.com/openai/v1  (no trailing /chat/completions)
 *   LLM_API_KEY   the provider's secret key
 *   LLM_MODEL     the model id at that provider
 *
 * Request:  { "messages": [{ "role": "user" | "assistant", "content": "..." }] }
 * Response: { "reply": "..." }  or  { "error": { "code": "...", "message": "..." } }
 *
 * Message text is never logged.
 */

/** Abuse limits. The chat input in the app allows 500 characters per message. */
const MAX_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 2000;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_REPLY_TOKENS = 1024;
const PROVIDER_TIMEOUT_MS = 25_000;

/** Only user and assistant turns are accepted from the browser, so callers cannot inject system prompts. */
const ALLOWED_ROLES = new Set(['user', 'assistant']);

export type ChatRole = 'user' | 'assistant';
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type ChatErrorCode =
  | 'method_not_allowed'
  | 'bad_request'
  | 'payload_too_large'
  | 'not_configured'
  | 'rate_limited'
  | 'provider_config'
  | 'provider_error'
  | 'provider_timeout';

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

function fail(status: number, code: ChatErrorCode, message: string, headers?: Record<string, string>): Response {
  return json(status, { error: { code, message } }, headers);
}

/** Checks the request body shape and limits. Returns the messages, or an error message. */
export function validateMessages(body: unknown): ChatMessage[] | string {
  if (typeof body !== 'object' || body === null || !('messages' in body)) {
    return 'Body must be a JSON object with a "messages" array.';
  }
  const { messages } = body as { messages: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return '"messages" must be a non-empty array.';
  if (messages.length > MAX_MESSAGES) return `Too many messages: at most ${MAX_MESSAGES} are allowed.`;

  const clean: ChatMessage[] = [];
  for (const [i, m] of messages.entries()) {
    if (typeof m !== 'object' || m === null) return `messages[${i}] must be an object.`;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (typeof role !== 'string' || !ALLOWED_ROLES.has(role)) {
      return `messages[${i}].role must be "user" or "assistant".`;
    }
    if (typeof content !== 'string' || !content.trim()) return `messages[${i}].content must be a non-empty string.`;
    if (content.length > MAX_CHARS_PER_MESSAGE) {
      return `messages[${i}].content is too long: at most ${MAX_CHARS_PER_MESSAGE} characters are allowed.`;
    }
    clean.push({ role: role as ChatRole, content });
  }
  if (clean[clean.length - 1].role !== 'user') return 'The last message must come from the user.';
  return clean;
}

/** Pulls a readable message out of a provider's error body (OpenAI-style or otherwise). */
function providerMessage(body: unknown): string | undefined {
  const b = Array.isArray(body) ? body[0] : body;
  if (typeof b !== 'object' || b === null) return undefined;
  const err = (b as { error?: unknown }).error;
  const msg =
    typeof err === 'string' ? err : typeof err === 'object' && err !== null ? (err as { message?: unknown }).message : undefined;
  return typeof msg === 'string' ? msg.slice(0, 300) : undefined;
}

async function readJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function handleChat(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return fail(405, 'method_not_allowed', 'Only POST is allowed.', { Allow: 'POST' });
  }

  const baseUrl = process.env['LLM_BASE_URL']?.trim();
  const apiKey = process.env['LLM_API_KEY']?.trim();
  const model = process.env['LLM_MODEL']?.trim();
  const missing = [!baseUrl && 'LLM_BASE_URL', !apiKey && 'LLM_API_KEY', !model && 'LLM_MODEL'].filter(Boolean);
  if (missing.length) {
    console.error(`[api/chat] Missing environment variables: ${missing.join(', ')}`);
    return fail(500, 'not_configured', `The chat service is not configured. Missing: ${missing.join(', ')}.`);
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return fail(413, 'payload_too_large', 'Request body is too large.');
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return fail(413, 'payload_too_large', 'Request body is too large.');

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, 'bad_request', 'Body must be valid JSON.');
  }
  const messages = validateMessages(body);
  if (typeof messages === 'string') return fail(400, 'bad_request', messages);

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl!.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, max_tokens: MAX_REPLY_TOKENS }),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
  } catch (e) {
    if (e instanceof Error && e.name === 'TimeoutError') {
      console.error('[api/chat] Provider timed out');
      return fail(504, 'provider_timeout', 'The language model took too long to answer. Please try again.');
    }
    console.error('[api/chat] Could not reach provider:', e instanceof Error ? e.message : e);
    return fail(502, 'provider_error', 'Could not reach the language model provider.');
  }

  const data = await readJson(upstream);

  if (upstream.status === 429) {
    const retryAfter = upstream.headers.get('retry-after');
    console.error('[api/chat] Provider rate limit reached');
    return fail(
      429,
      'rate_limited',
      'The language model is receiving too many requests. Please wait a moment and try again.',
      retryAfter ? { 'Retry-After': retryAfter } : undefined,
    );
  }

  if (!upstream.ok) {
    const detail = providerMessage(data);
    console.error(`[api/chat] Provider error ${upstream.status}${detail ? `: ${detail}` : ''}`);
    // 401/403/404 from the provider means our key, base URL or model is wrong: a server problem, not the caller's.
    const code: ChatErrorCode = [401, 403, 404].includes(upstream.status) ? 'provider_config' : 'provider_error';
    return fail(502, code, `The language model provider returned an error (${upstream.status})${detail ? `: ${detail}` : '.'}`);
  }

  const reply = (data as { choices?: { message?: { content?: unknown } }[] } | undefined)?.choices?.[0]?.message?.content;
  if (typeof reply !== 'string' || !reply.trim()) {
    console.error('[api/chat] Provider response had no reply text');
    return fail(502, 'provider_error', 'The language model returned an empty or unexpected response.');
  }

  return json(200, { reply: reply.trim() });
}

/** Vercel Node.js runtime entry point (Web-standard fetch handler). */
export default { fetch: handleChat };
