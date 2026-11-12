# NewcomerCompassPOC

Front-end proof of concept for **Newcomer Compass**: a tool that helps newcomers to Canada
find government benefits they may be eligible for. There is no backend or AI yet. The data is
placeholder content, provided only so the layout and navigation can be reviewed.

Built with Angular 20 (standalone components, signals, zoneless), Angular Material and SCSS.

## Run it

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm start          # opens http://localhost:4200
npm run lint       # ESLint, including Angular template accessibility rules
```

## Pages

| Route      | What it shows                                                                 |
| ---------- | ----------------------------------------------------------------------------- |
| `/`        | "What do you need help with today?": pick a situation tile, then answer three parts of dropdowns, one part at a time (answered parts stay on screen, faded and locked), then **See benefits**. Chat in a side panel, closed until the user opens it (overlay below 900px) |
| `/results` | Benefits list and how to access them (≈70% width) with a full-height chat panel (≈30%) |

## Structure

```
src/app/
  chat/                 Reusable chat window, and the collapsible side panel used on page 1
  pages/questionnaire/  Entry page: situation picker and the three parts of dropdown questions
    questionnaire-config.ts   All situations, questions and options (English, French, Arabic)
  pages/results/        Results page
  state/                Signal-based stores for questionnaire answers and chat history
```

To change the questionnaire's wording, questions or options, edit
`src/app/pages/questionnaire/questionnaire-config.ts`. Answers are kept in memory only: they are
never logged, stored in the browser or sent anywhere.

Sending a chat message only adds it to the history. Nothing replies yet. The history is
shared between both pages.
