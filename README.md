# NewcomerCompassPOC

Front-end proof of concept for **Newcomer Compass**: a tool that helps newcomers to Canada work
out what to do first, what comes next and where to go. The roadmap itself is built by deterministic
rules, with no AI; only the optional chat window on the roadmap page asks an LLM, through a small
serverless function, and it answers only from three official canada.ca pages (see
[Roadmap chat](#roadmap-chat-grounded-llm)). The content is synthetic demonstration data, and links and phone numbers must be confirmed against official
sources before use.

This branch (`feature/compass-click-through`) follows the click-through prototype
(`ref/Newcomer-Compass-click-through.html`) as closely as possible, rebuilt in Angular 20
(standalone components, signals, zoneless) with Tailwind CSS v4 and the Geist font.

## Run it

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm start          # opens http://localhost:4200
npm run lint       # ESLint, including Angular template accessibility rules
npm run test:api   # unit tests for citation verification and link building
npm run crawl      # refresh corpus/pages.json from the three canada.ca pages
```

`npm start` runs the Angular app only. The roadmap chat then says it is not set up, because
`/api/chat` is not running. To run the chat as well, see [Run locally](#run-locally).

## Roadmap chat (grounded LLM)

The chat window on the roadmap page answers questions about Canada's Temporary Foreign Worker
Program **only** from these three pages (the whole corpus; no other URL is ever fetched or linked):

| id                 | Page |
| ------------------ | ---- |
| `tfw-program`      | https://www.canada.ca/en/employment-social-development/programs/temporary-foreign-worker.html |
| `report-abuse`     | https://www.canada.ca/en/employment-social-development/services/foreign-workers/report-abuse.html |
| `protected-rights` | https://www.canada.ca/en/employment-social-development/services/foreign-workers/protected-rights.html |

How it fits together:

1. **Crawler** (`scripts/crawl.ts`, `npm run crawl`): the only code that fetches external pages.
   It fetches the hardcoded allowlist (`api/_lib/sources.ts`) over HTTPS with `redirect: 'manual'`,
   fails if a redirect leaves `https://www.canada.ca`, keeps only the visible text of `<main>`
   (no scripts, styles, nav, header, footer, aside, hidden elements, language picker or
   "On this page" list), and writes `corpus/pages.json` (`id, title, url, text, fetchedAt, hash`)
   only when a sha256 hash changed. It exits non-zero without writing if a page's text changed by
   more than 30% (by words) or contains phrases aimed at an LLM ("ignore previous instructions",
   "system prompt", …), so a person reviews the change.
2. **Workflow** (`.github/workflows/crawl.yml`): runs the crawler every 6 hours and on demand, and
   commits `chore: update corpus snapshot` when `corpus/` changed. That push redeploys on Vercel.
3. **Function** (`api/chat.ts`, `POST /api/chat`, body `{ "question": "..." }`, 1–1000 characters):
   imports `corpus/pages.json` at build time (no runtime fetches) and sends all three pages,
   wrapped in `<source>` tags as reference material, to the LLM with structured JSON output and
   temperature 0. The model gets no tools. Every citation is verified on the server
   (`api/_lib/grounding.ts`): the quote must appear in that page's text, ignoring case, whitespace
   and typographic quotes/dashes, and be 15–300 characters long. Failing citations are dropped, and
   the quote shown is the page's own wording. Links are the allowlisted URL plus a
   `#:~:text=` fragment; nothing the model writes becomes a URL. Responses:
   - `{ "answer": "...", "citations": [{ "title", "quote", "link" }] }`
   - `{ "answer": null, "sources": [{ "title", "url" }] }` when the pages do not answer the question,
     the reply was malformed, or no citation survived
   - `{ "error": { "code", "message" } }` with 400 (empty/too long/bad JSON), 405, 413, 500 (not
     configured) or 502 (any LLM failure; generic message)

   Questions and answers are never logged.
4. **UI** (`src/app/pages/compass/roadmap/roadmap-chat.ts`): renders answers as plain text
   (`{{ }}` only, never `innerHTML`), each verified quote as a blockquote with the page title linked
   (new tab, `rel="noopener noreferrer"`), or "I couldn't find that in the official pages" with the
   three links. Each question is answered on its own.

The LLM is configured only through environment variables (any OpenAI-compatible endpoint that
supports `response_format: json_schema`; currently Google Gemini):

| Variable       | Example                                                     |
| -------------- | ----------------------------------------------------------- |
| `LLM_BASE_URL` | `https://generativelanguage.googleapis.com/v1beta/openai`   |
| `LLM_API_KEY`  | The provider's secret key                                   |
| `LLM_MODEL`    | e.g. `gemini-flash-lite-latest`                             |

### Run locally

`vercel dev` serves only the `/api` functions (its `devCommand` in `vercel.json` is a placeholder);
`ng serve` serves the app and forwards `/api` to it (`proxy.conf.json`).

```bash
npm install -g vercel   # once
vercel link             # once: connect this folder to your Vercel project
vercel env pull .env.local   # or: cp .env.example .env.local and fill in the three variables

vercel dev --listen 3000     # terminal 1: /api/chat on http://localhost:3000
npm start                    # terminal 2: the app on http://localhost:4200, /api proxied to :3000
```

`.env*` files (apart from `.env.example`) are git-ignored; never commit a real key, and never put
it in Angular code. For deployments, set the variables under **Project Settings → Environment
Variables**. To type-check: `npx tsc -p api` and `npx tsc -p scripts`.

### Security headers

`vercel.json` sends a Content-Security-Policy on every response: `default-src 'self'`,
`script-src 'self'`, `connect-src 'self'`, `img-src 'self' data:`, `font-src 'self'`,
`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, and
`style-src 'self' 'unsafe-inline'` (Angular injects component styles as inline `<style>` elements).
`ng serve` does not apply these headers; they take effect on Vercel deployments.

## Pages

| Route      | What it shows                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `/`        | Choose a language (English, Français, العربية), with the Newcomer Compass mark among greetings in many languages |
| `/compass` | The journey on one page: **1 Your situation** → **2 Questions** (step-by-step form or guided chat, then a review) → **3 Your roadmap** (what to do, a schematic map of where to go, places that can help, print and download) |

The language can be changed at any time from the header. Arabic is shown right to left and is
machine translated.

## Structure

```
api/              Vercel function /api/chat (grounded answers); api/_lib: allowlist, citation checks, tests
corpus/           pages.json: the committed snapshot of the three canada.ca pages
scripts/          crawl.ts: the crawler that refreshes corpus/pages.json
src/app/
  content/        Synthetic content (situations, questions, programs, rules, places) and its types
  engine/         Deterministic rules engine, roadmap builder, map/places logic, chat answer matching,
                  printable/downloadable roadmap document
  i18n/           UI strings (en/fr/ar) and the I18n service
  services/       ChatApi: posts a question to /api/chat with HttpClient
  state/          JourneyStore: the current screen, answers and completed steps (signals)
  layout/         Header, footer, "Get help from a person" sheet
  pages/welcome/  Language page
  pages/compass/  Situation picker, mode choice, question form, guided chat, review, roadmap/
  shared/         Icons, the logo mark and lockup, media-query signals
```

Answers are kept in memory only: they are never logged, stored in the browser or sent anywhere.
Only the chosen language is remembered (in `localStorage`). Questions typed into the roadmap chat
are sent to the configured LLM provider (not the answers given earlier), but neither questions nor
answers are logged by the function. The chat refuses to send messages that contain personal identifiers such as phone
numbers or email addresses.
