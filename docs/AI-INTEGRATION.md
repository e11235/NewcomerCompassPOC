# How Newcomer Compass uses AI

## The core idea

Most of the app uses no AI. The personalized roadmap ("what to do first, what comes next, where to go") comes from a deterministic rules engine running in the browser. A large language model (LLM) is used in only two small, optional places. In both, the model can only rephrase and explain material we give it. It cannot search the web, call tools, or produce links.

## Which API and model

- **Provider:** Google Gemini (currently `gemini-flash-lite-latest`), called through Gemini's OpenAI-compatible Chat Completions endpoint. The code isn't tied to Gemini. Any OpenAI-compatible provider that supports JSON-schema output can be swapped in using three environment variables: `LLM_BASE_URL`, `LLM_API_KEY` and `LLM_MODEL`.
- **Where it's called from:** two Vercel serverless functions, `/api/chat` and `/api/guide-help`. They share one small client (`api/_lib/llm.ts`). The API key lives only in Vercel's server-side environment variables and never reaches the browser.
- **How it's called:**
  - Temperature is 0, for the most consistent answers possible.
  - The reply must match a strict JSON schema.
  - The model gets no tools or function calling, so it can only return that JSON.
  - Each request has a token cap and a timeout.
  - Every question is a single exchange with no conversation memory.

## Feature 1: Roadmap chat (`/api/chat`)

People can ask about Canada's Temporary Foreign Worker (TFW) Program. Answers come only from three official canada.ca pages:

- TFW Program overview
- Report abuse
- Protected rights

**How the source material is collected (GitHub Actions crawler):**

1. A hardcoded allowlist of the three URLs (`api/_lib/sources.ts`) is the whole knowledge base.
2. A scheduled GitHub Actions workflow runs the crawler every 6 hours, and can also be run by hand.
   - It fetches only those URLs, over HTTPS.
   - It fails if a redirect leads anywhere outside `www.canada.ca`.
   - It keeps only the visible main text of each page, dropping scripts, navigation, headers, footers and hidden elements.
3. It saves a snapshot to `corpus/pages.json`, with a SHA-256 hash and timestamp for each page.
4. Two checks stop the run so a person can review the change before anything is committed:
   - a page's text changed by more than 30%;
   - a page contains text aimed at an AI, such as "ignore previous instructions" or "system prompt". This guards against a tampered page being used to inject instructions into the model.
5. A changed snapshot is committed to the repo, which triggers a Vercel redeploy. The deployed function bundles the snapshot at build time and never fetches web pages while running.

**How answers are kept to the source material:**

- All three pages go to the model inside `<source>` tags, labelled as reference material only. The rules say to answer only from those sources, cite every claim, and report "not answerable" when the pages don't clearly answer the question.
- The model must return each citation as an exact quote plus a source ID. The schema only allows the three known source IDs.
- **The server checks every citation** (`api/_lib/grounding.ts`):
  - The quote must actually appear in that page's text. Case, spacing and curly quotes or dashes are ignored when comparing.
  - The quote must be 15–300 characters long.
  - Citations that fail are dropped, and the quote shown to the user is the page's own wording.
  - If no citation survives, or the reply is malformed, the user sees "I couldn't find that in the official pages" with links to the three pages. The unverified answer is never shown.
- The model never creates a link. Each link is built by the server from the allowlisted URL plus a `#:~:text=` fragment that jumps to the quoted passage.

## Feature 2: Guided-chat help (`/api/guide-help`)

While answering the intake questions, people can ask what a question means.

- The model sees only `guide/explanations.json`, a set of explanations we wrote and reviewed. Each entry has the question's meaning, why we ask it, examples, and a list of topics it does *not* cover.
- It may rephrase in plain language (grade 6–8 reading level) but must add no new facts.
- Questions about eligibility, benefits, amounts, legal or immigration matters, or anything outside the entries get a fixed redirect message written by our code, not by the model.
- The server checks every reply. It replaces the answer with the fixed redirect if:
  - the answer doesn't reference a real entry;
  - it is too long;
  - it contains a link or web address.
- If the answer repeats a number the person typed, such as their income, the server shows that question's pre-written explanation instead.

## Privacy and other safeguards

- **No logging:** questions and answers are never logged. Errors are logged only by type (for example "HTTP 502"), never with their content.
- **Personal details:** the roadmap chat won't send a message that looks like it contains a phone number or email address. The person is asked to remove it first. Answers given in the intake questions are never sent to the LLM.
- **Input limits:** requests are capped in size (1,000 characters for chat questions, 500 for help questions). Requests that are too large, malformed, or use the wrong HTTP method are rejected. Provider failures return a generic message.
- **Safe display:** answers are shown as plain text, never rendered as HTML. Links open in a new tab with `rel="noopener noreferrer"`.
- **Content Security Policy:** set in `vercel.json`. The browser can only load scripts from, and send requests to, the app's own domain (`'self'`), and the app can't be embedded in other sites.
- **Startup checks:** if the bundled snapshot doesn't match the allowlisted URLs, or the explanations file is malformed, the functions refuse to serve answers at all.

## Main files

- `api/_lib/llm.ts`: the LLM client
- `api/chat.ts`, `api/_lib/grounding.ts`: roadmap chat and citation checks
- `api/guide-help.ts`, `api/_lib/guide-help.ts`: guided-chat help
- `scripts/crawl-lib.ts`, `scripts/crawl.ts`, `.github/workflows/crawl.yml`: the crawler and its schedule
