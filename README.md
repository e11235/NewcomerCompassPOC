# NewcomerCompassPOC

Front-end proof of concept for **Newcomer Compass**: a tool that helps newcomers to Canada work
out what to do first, what comes next and where to go. There is no backend or AI. The content is
synthetic demonstration data, and links and phone numbers must be confirmed against official
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

## Pages

| Route      | What it shows                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `/`        | Choose a language (English, Français, العربية), with the Newcomer Compass mark among greetings in many languages |
| `/compass` | The journey on one page: **1 Your situation** → **2 Questions** (step-by-step form or guided chat, then a review) → **3 Your roadmap** (what to do, a schematic map of where to go, places that can help, print and download) |

The language can be changed at any time from the header. Arabic is shown right to left and is
machine translated.

## Structure

```
src/app/
  content/        Synthetic content (situations, questions, programs, rules, places) and its types
  engine/         Deterministic rules engine, roadmap builder, map/places logic, chat answer matching,
                  printable/downloadable roadmap document
  i18n/           UI strings (en/fr/ar) and the I18n service
  state/          JourneyStore: the current screen, answers and completed steps (signals)
  layout/         Header, footer, "Get help from a person" sheet
  pages/welcome/  Language page
  pages/compass/  Situation picker, mode choice, question form, guided chat, review, roadmap/
  shared/         Icons, the logo mark and lockup, media-query signals
```

Answers are kept in memory only: they are never logged, stored in the browser or sent anywhere.
Only the chosen language is remembered (in `localStorage`).
