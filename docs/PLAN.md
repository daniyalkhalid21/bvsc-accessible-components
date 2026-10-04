# Plan and measurable target (Week 4)

**Written retrospectively on 2026-10-04.** The scope statement and the success target below were first written in `docs/SCOPE.md` before any component code; this page restates them as the five-line plan and records the outcome.

**New skill this week:** accessibility engineering for UI components (ARIA patterns, focus management, automated and manual accessibility testing), using Storybook and axe-core.

## Five-line plan
1. Read the WAI-ARIA Authoring Practices pattern for each component before building it, and write the scope for the Boutique Veterinary Supply Company first.
2. Define colour, spacing and focus tokens and check every colour pair for contrast with a script.
3. Build the eight components (button, form fields, accordion, tabs, table, modal, menu, toast) with a story, documentation and keyboard tests each, and an axe test for every story.
4. Run a real-browser axe audit over every story, fix serious and critical violations, and log what was found and fixed.
5. Document, publish Storybook, and record a keyboard-only walkthrough and a narrated video.

## Measurable success target
8 components, 40+ automated tests, 0 serious or critical axe violations on every story, and AA contrast on every token pair.

## Outcome (from real runs)
| Target | Result |
|---|---|
| Components | 8 (plus a skip link and a demo page) |
| Automated tests | 135 passing |
| Axe, serious/critical | 0 across all 30 stories, in a real Chromium scan (`docs/AUDIT_LOG.md`) |
| Contrast | 31 of 31 pairs pass (`docs/contrast-report.md`) |
| Manual keyboard pass | Demonstrated in the video for the skip link, menu and modal |
| Manual screen reader pass | **Not done** (NVDA / VoiceOver); stated as a limitation in the README |
