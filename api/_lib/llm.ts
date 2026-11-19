/**
 * The one LLM client used by the /api functions: an OpenAI-compatible chat completions call
 * with a JSON-schema response format and no tools. Nothing sent or received is logged; only
 * the kind of failure is.
 *
 * Environment: LLM_BASE_URL (e.g. https://generativelanguage.googleapis.com/v1beta/openai),
 * LLM_API_KEY, LLM_MODEL.
 */

export interface LlmConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

/** Reads the LLM settings, or names the missing variables. */
export function readLlmConfig(env: NodeJS.ProcessEnv = process.env): LlmConfig | { missing: string[] } {
  const baseUrl = env['LLM_BASE_URL']?.trim();
  const apiKey = env['LLM_API_KEY']?.trim();
  const model = env['LLM_MODEL']?.trim();
  if (!baseUrl || !apiKey || !model) {
    return { missing: [!baseUrl && 'LLM_BASE_URL', !apiKey && 'LLM_API_KEY', !model && 'LLM_MODEL'].filter((v): v is string => !!v) };
  }
  return { baseUrl, apiKey, model };
}

export interface LlmRequest {
  system: string;
  user: string;
  schemaName: string;
  schema: object;
  maxTokens: number;
  timeoutMs: number;
}

/**
 * Sends one system + user message at temperature 0 and returns the reply's text content,
 * or null if the provider failed or returned nothing. `logTag` prefixes the error log line.
 */
export async function completeJson(config: LlmConfig, req: LlmRequest, logTag: string): Promise<string | null> {
  let upstream: Response;
  try {
    upstream = await fetch(`${config.baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
      // No tools / function calling: the model can only return the JSON answer.
      body: JSON.stringify({
        model: config.model,
        temperature: 0,
        max_tokens: req.maxTokens,
        response_format: { type: 'json_schema', json_schema: { name: req.schemaName, strict: true, schema: req.schema } },
        messages: [
          { role: 'system', content: req.system },
          { role: 'user', content: req.user },
        ],
      }),
      signal: AbortSignal.timeout(req.timeoutMs),
    });
  } catch (e) {
    // Only the error kind is logged: never the message or the provider's response body.
    console.error(`[${logTag}] Provider request failed: ${e instanceof Error ? e.name : 'unknown'}`);
    return null;
  }

  if (!upstream.ok) {
    console.error(`[${logTag}] Provider returned HTTP ${upstream.status}`);
    return null;
  }

  let content: unknown;
  try {
    const data = (await upstream.json()) as { choices?: { message?: { content?: unknown } }[] };
    content = data.choices?.[0]?.message?.content;
  } catch {
    content = undefined;
  }
  if (typeof content !== 'string' || !content.trim()) {
    console.error(`[${logTag}] Provider response had no content`);
    return null;
  }
  return content;
}
