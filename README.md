# NewcomerCompassPOC

Front-end proof of concept for **Newcomer Compass**: a tool that helps newcomers to Canada work
out what to do first, what comes next and where to go. The roadmap itself is built by deterministic
rules, with no AI; only the optional chat window on the roadmap page asks an LLM, through a small
serverless function (see [Roadmap chat](#roadmap-chat-llm)). The content is synthetic demonstration data, and links and phone numbers must be confirmed against official
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
```

`npm start` runs the Angular app only. The roadmap chat then shows an error because `/api/chat`
does not exist. To run the chat as well, use `vercel dev` (see below).

## Roadmap chat (LLM)

The chat window on the roadmap page sends the conversation to `/api/chat`
(`api/chat.ts`), a Vercel serverless function. The function adds the API key and forwards the
messages to any OpenAI-compatible `/chat/completions` endpoint, so the key never reaches the
browser. It is configured only through environment variables:

| Variable       | Example                                                                      |
| -------------- | ---------------------------------------------------------------------------- |
| `LLM_BASE_URL` | `https://api.groq.com/openai/v1`, `https://openrouter.ai/api/v1`, `https://generativelanguage.googleapis.com/v1beta/openai` |
| `LLM_API_KEY`  | The provider's secret key                                                    |
| `LLM_MODEL`    | A model id offered by that provider                                          |

To switch providers, change the three variables; no code changes are needed.

### Run locally with `vercel dev`

```bash
npm install -g vercel   # once
vercel link             # once: connect this folder to your Vercel project
cp .env.example .env.local
# edit .env.local and fill in LLM_BASE_URL, LLM_API_KEY and LLM_MODEL
vercel dev              # serves the Angular app and /api/chat together, usually on http://localhost:3000
```

If the variables are already set in the Vercel project, `vercel env pull .env.local` downloads them
instead. `.env*` files (apart from `.env.example`) are git-ignored; never commit a real key, and
never put it in Angular code or `environment.ts`. For deployments, set the variables under
**Project Settings → Environment Variables**.

The function accepts `POST` only, at most 20 messages of up to 2,000 characters each, and only
`user` and `assistant` roles. It returns `{ "reply": "..." }`, or `{ "error": { "code", "message" } }`
with status 400/405/413 (bad request), 429 (provider rate limit), 500 (missing variables) or
502/504 (provider error or timeout). `vercel.json` sends every path except `/api/*` to the Angular
app. To type-check the function, run `npx tsc -p api`.

## Pages

| Route      | What it shows                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `/`        | Choose a language (English, Français, العربية), with the Newcomer Compass mark among greetings in many languages |
| `/compass` | The journey on one page: **1 Your situation** → **2 Questions** (step-by-step form or guided chat, then a review) → **3 Your roadmap** (what to do, a schematic map of where to go, places that can help, print and download) |

The language can be changed at any time from the header. Arabic is shown right to left and is
machine translated.

## Structure

```
api/              Vercel serverless function: /api/chat (LLM proxy)
src/app/
  content/        Synthetic content (situations, questions, programs, rules, places) and its types
  engine/         Deterministic rules engine, roadmap builder, map/places logic, chat answer matching,
                  printable/downloadable roadmap document
  i18n/           UI strings (en/fr/ar) and the I18n service
  services/       ChatApi: calls /api/chat with HttpClient
  state/          JourneyStore: the current screen, answers and completed steps (signals)
  layout/         Header, footer, "Get help from a person" sheet
  pages/welcome/  Language page
  pages/compass/  Situation picker, mode choice, question form, guided chat, review, roadmap/
  shared/         Icons, the logo mark and lockup, media-query signals
```

Answers are kept in memory only: they are never logged, stored in the browser or sent anywhere.
Only the chosen language is remembered (in `localStorage`). Questions typed into the roadmap chat
are sent to the configured LLM provider (not the answers given earlier), but they are not logged by
the function. The chat refuses to send messages that contain personal identifiers such as phone
numbers or email addresses.
