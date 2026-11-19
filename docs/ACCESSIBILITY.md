# Newcomer Compass accessibility review

As of 2026-11-19

## Summary

Accessibility is strong for a prototype. An automated WCAG 2.2 AA scan found **1 violation** across 6 screens, at desktop and phone widths, and the 320 px reflow check passed. The biggest real problem doesn't show up in the scan. At mid widths, including any laptop zoomed to 200%, the roadmap chat opens on top of the roadmap and hides it.

Top three fixes: keep the chat closed until the page has room for it, name the guided chat's progress bar, and make the chat modal on phones. None of this has been tested with real screen readers yet, so that is the main gap before a pilot.

## What's working well

Accessibility was built in from the start, not added later. The main strengths, with where they live in the code:

| Area | What the app does | Where |
| --- | --- | --- |
| Linting | Angular's template accessibility rules run with `npm run lint`, so missing labels, bad ARIA and click-only handlers fail the build | `eslint.config.js` |
| Page structure | One `<main>` landmark, a skip link to it, one `h1` per screen and an ordered heading outline (h2 → h4) | `app.ts`, `site-header.ts`, `compass-page.ts` |
| Focus on screen change | Each new step moves focus to its `h1` and scrolls to the top, and the tab title names the step ("Questions – Newcomer Compass") | `compass-page.ts`, `app.ts` |
| Forms | Visible `<label>`s, `aria-describedby` hints, `aria-invalid` with a `role="alert"` error summary, `autocomplete` on text fields | `question-form.ts`, `guided-chat.ts` |
| Custom controls | Answer options as a radiogroup; toggles use `aria-pressed`, disclosures use `aria-expanded` + `aria-controls`; progress is a `progressbar` with readable `aria-valuetext` | `question-form.ts`, `roadmap-row.ts`, `progress-bar.ts` |
| Dialogs | "Get help from a person" is a modal `role="dialog"` with `aria-modal`, a label and focus trapped inside | `help-sheet.ts` |
| Live updates | Chat replies are announced through `role="log"` / `aria-live`; roadmap changes through `role="status"` | `roadmap-chat.ts`, `guided-chat.ts`, `roadmap.ts` |
| Languages | `lang` and `dir` are set on `<html>` per language; Arabic is fully right to left with an Arabic font; mixed-language snippets carry their own `lang` | `i18n.ts`, `styles.css` |
| Keyboard focus | Every interactive element has a visible 2px focus outline (`focus-visible`) | `styles.css` and components |
| Touch targets | Primary step controls use `min-h-11` (44px) | `compass-page.ts` |
| Motion | The map respects `prefers-reduced-motion` | `city-map.ts` |
| Safe text | Chat answers render as plain text, never HTML, so screen readers get clean content | `roadmap-chat.ts` |

## Areas for improvement

Two issues fail WCAG 2.2 AA today; the rest are risks or polish. Ordered by severity.

| # | Issue | Who it affects | WCAG | Severity | Where |
| --- | --- | --- | --- | --- | --- |
| 1 | The roadmap chat opens by default at 640 px and wider, but the page only makes room for it from about 1,280 px. In between it covers the right part of the roadmap: at 640 px the 384 px panel hides most of the page, cutting off the title and step cards. This is also what a 1,280 px laptop shows at 200% zoom. | Low-vision users who zoom; small laptops and tablets | 1.4.10 Reflow, 2.4.11 Focus Not Obscured | High | `roadmap-chat.ts`, `compass-page.ts` |
| 2 | The guided chat's progress bar has no accessible name, so screen readers announce an unnamed "progress bar" (axe: `aria-progressbar-name`, serious). The step-by-step form uses the same component with a label. | Screen reader users | 4.1.2 Name, Role, Value | High | `guided-chat.ts` (the `app-progress-bar` near line 363), `progress-bar.ts` |
| 3 | The chat panel is `role="dialog"` but not modal. On phones it fills the screen, yet Tab can still reach the hidden page behind it, and nothing tells assistive tech the page is covered. When docked beside the roadmap on desktop, a `complementary` region (or a non-modal dialog that doesn't cover content) fits better. | Keyboard and screen reader users on phones | 2.4.3 Focus Order, 1.3.1 | Medium | `roadmap-chat.ts` |
| 4 | Escape closes the chat from anywhere on the page (`document:keydown.escape`), even while focus is in another dialog, such as "Get help from a person". One key press can close both. | Keyboard users | 3.2.2 (unexpected change) | Low | `roadmap-chat.ts` |
| 5 | The Arabic interface is machine translated and hasn't been checked by a fluent reader. Plain-language quality in French has not been reviewed either. | Arabic and French speakers, including screen reader users | 3.1 Readable | Medium | `i18n/ui-strings.ts`, `extra-strings.ts` |
| 6 | Small text: 16 places use `text-xs` (12 px) for hints and fine print, such as the chat's "Do not share personal information" note. Contrast passes, but it is hard to read for older users. | Low-vision and older users | Best practice (1.4.4 is met) | Low | Various components |
| 7 | Buttons are 36 px tall (`h-9`; `btn-sm` 32 px). They pass the 24 px minimum (2.5.8), but fall short of the 44 px best practice used elsewhere in the app. | Users with tremors or limited dexterity | 2.5.8 is met; best practice 44 px | Low | `styles.css` `.btn` |
| 8 | Nothing has been tested with real assistive technology (NVDA, JAWS, VoiceOver, TalkBack), and no testing has been done with newcomers who have disabilities. The automated scan catches only about a third of WCAG issues. | Everyone | Process | Medium | — |

## Recommended next steps

Fix the two AA failures first. Both are small code changes. Then test with real assistive technology before any pilot.

- [ ] Only open the chat by default when the page reserves room for it (about 1,280 px wide). Below that, start it closed, as on phones.
- [ ] Pass a `label` to the guided chat's progress bar, matching the step-by-step form ("Question 3 of 9").
- [ ] On narrow screens, where the chat covers the page, make it modal: `aria-modal`, trapped focus, page behind marked `inert`. On wide screens, where it sits beside the page, make it a labelled `complementary` region.
- [ ] Only let Escape close the chat while focus is inside it.
- [ ] Add an automated axe check (for example `@axe-core/playwright`) to CI for the welcome, situation, questions, guided chat and roadmap screens, at phone and desktop widths, in all three languages.
- [ ] Run manual checks: keyboard-only walkthrough, NVDA + Firefox, VoiceOver on iOS, TalkBack on Android, 200% and 400% zoom, Windows high-contrast mode.
- [ ] Have fluent speakers review the Arabic and French text, including how screen readers pronounce it.
- [ ] Consider raising body hint text from 12 px to 14 px, and buttons to 44 px tall on touch screens.
- [ ] Include newcomers with disabilities, and settlement workers who support them, in usability testing.

Method: axe-core 4.10 (WCAG 2.0–2.2 A/AA + best practices) in headless Chromium at 1,280 px and 390 px, plus checks for keyboard order, 320 px reflow and target size, and a code review of the components. Run on the dev build on 2026-11-19.
