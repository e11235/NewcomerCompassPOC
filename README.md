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
```

## Pages

| Route      | What it shows                                                                 |
| ---------- | ----------------------------------------------------------------------------- |
| `/`        | "Tell me about yourself" questionnaire, **Submit** button, "Questions?" chat |
| `/results` | Benefits list and how to access them (≈70% width) with a full-height chat panel (≈30%) |

## Structure

```
src/app/
  chat/                 Reusable chat window (inline on page 1, side panel on page 2)
  pages/questionnaire/  Entry page
  pages/results/        Results page
  state/                Signal-based stores for questionnaire answers and chat history
```

Sending a chat message only adds it to the history. Nothing replies yet. The history is
shared between both pages.
