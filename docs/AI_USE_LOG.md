# AI use log

An AI assistant (Claude) was used heavily on this project for planning, writing code, tests and documentation, and for debugging. This log records what it was used for, what was checked by running the project, and where its output was wrong and had to be corrected.

## What AI was used for
- Planning the scope and component list, and choosing the stack.
- Writing the components, stories, tests, documentation pages and scripts (contrast check, story audit, screenshots).
- Restyling the demo page and rebuilding the demo flow (basket, orders, sign in and out, invoices).
- Setting up GitHub Actions for CI and for deploying Storybook.
- Explaining errors I pasted back from my own machine.

## What I checked by running it myself
- `npm test` on my machine (135 tests; one demo test first timed out at the default 5 second limit on my slower machine).
- `npm run audit`, which ran in a real Chromium browser with Playwright and axe-core, and `npm run screenshots`.
- The Storybook interface and the demo page in the browser, which led me to report that the first demo felt unfinished.
- Pushing to GitHub and checking that CI passed and Pages deployed.

## Where the AI output was wrong or incomplete, and what changed
| # | Problem | How it was found | Fix |
|---|---|---|---|
| 1 | RadioGroup used `aria-required` and `aria-invalid` on a `<fieldset>`, which is not allowed (axe: `aria-allowed-attr`, critical) | axe test during development | Removed both attributes; the error stays in `aria-describedby` and "required" is in the legend text |
| 2 | Error message read as "Error:Bad email" because a space was trimmed in a hidden span | Test failure | Moved the space outside the span |
| 3 | Storybook listed helper exports (such as the product data) as broken stories | Storybook index showed 37 entries for 30 real stories | Added `excludeStories` |
| 4 | Several early test failures were mistakes in the tests, not in the components (type-ahead timing, fake timers) | Failing tests | Corrected the tests and recorded this in the changelog |
| 5 | The first demo had stubs: the basket was only a counter, "My orders" said "not part of this demo", Sign out and Invoices did nothing | I tried the demo and reported it | Rebuilt as a working simulated flow with tests |
| 6 | The first browser audit reported 66 moderate page-level findings | `npm run audit` on my machine | Scoped page-level rules to the demo page and documented why; the one real finding (skip link outside a landmark) was fixed |
| 7 | Scripts failed on Windows (file paths, starting `npx`) and the audit needed `browser.newContext()` | Errors I pasted from my own run | Fixed in `scripts/audit-stories.mjs` and `scripts/screenshots.mjs` |
| 8 | The screenshot script still pointed at a button that no longer existed after the demo rewrite | Script timed out on my machine | Updated the script |
| 9 | A count in the first audit explanation was wrong (it said 14 stories where the log showed 11) | I supplied the real log and it was re-checked against it | Corrected in `docs/audit-baseline.json` |

## Limits of the AI's work that I was told about
- The AI could not run a browser in its own environment, so it could not see the design or run the real-browser audit; those results come from my machine.
- No screen reader testing (NVDA or VoiceOver) was done by me or by the AI, and no results were invented for it.

## What I learned
- How the WAI-ARIA patterns for dialog, tabs, menu button, accordion and sortable table work, including roving tabindex and focus return.
- Automated tools like axe find only part of the problems; they can say an attribute is allowed but not whether the experience makes sense.
- Page-level rules should be scoped to pages, not to isolated components, and that decision should be documented.
- Honest logging (what failed, what changed) is more useful than a clean story.
