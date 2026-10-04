# WCAG 2.2 conformance map

An honest map of what each criterion relies on and how far it has been verified. **No claim of full AA conformance is made**: no manual screen reader testing was performed (the NVDA/VoiceOver tables in `MANUAL_TEST_CHECKLIST.md` are blank).

Evidence key: **Unit** = Vitest/user-event assertion, **Axe-jsdom** = axe on every story in jsdom, **Axe-browser** = Playwright scan in CI (see `AUDIT_LOG.md`), **Token** = `contrast-check.mjs`, **Manual** = to be recorded by a person.

| Criterion | How it is met | Evidence | Status |
|---|---|---|---|
| 1.1.1 Non-text content | Decorative SVGs `aria-hidden`; icon-only buttons have `aria-label` | Unit, Axe-jsdom | Automated pass |
| 1.3.1 Info and relationships | Native table, `th scope`, `caption`, `fieldset/legend`, label/for, headings | Unit, Axe-jsdom | Automated pass |
| 1.3.5 Identify input purpose | `autocomplete` on name and email in the enquiry form | Unit | Partial (demo form only) |
| 1.4.1 Use of colour | Errors have icon + "Error:" text; stock level is text; selected tab has an underline | Unit | Automated pass |
| 1.4.3 Contrast (minimum) | All token text pairs ≥ 4.5:1 | Token (31 pairs) | Pass at token level and in the real-browser scan |
| 1.4.11 Non-text contrast | Borders and focus ring ≥ 3:1 | Token | Pass at token level |
| 1.4.4 / 1.4.10 Resize, reflow | Relative units, table scrolls inside its own region | Manual | Not verified |
| 1.4.12 Text spacing | No fixed-height text containers | Manual | Not verified |
| 2.1.1 Keyboard | All components operable by keyboard | Unit (every component) | Automated pass |
| 2.1.2 No keyboard trap | Modal traps by design and Escape exits; menu closes on Tab | Unit | Automated pass (jsdom) |
| 2.2.1 Timing adjustable | Info toasts pause on hover/focus and can be dismissed; errors persist | Unit | Partial: auto-dismiss still exists for non-errors |
| 2.3.3 / reduced motion | `prefers-reduced-motion` rule in tokens.css | Manual | Not verified |
| 2.4.1 Bypass blocks | SkipLink, landmarks | Unit | Automated pass |
| 2.4.3 Focus order | DOM order; modal returns focus to trigger | Unit | Automated pass (jsdom) |
| 2.4.6 Headings and labels | Descriptive labels, one h1 on demo | Manual | Not verified |
| 2.4.7 / 2.4.11 / 2.4.13 Focus visible, not obscured, appearance | 3px ring, 2px offset, not clipped; dark header uses a light ring | Token, Manual | Ring contrast passes; visibility needs Manual |
| 2.5.8 Target size (minimum) | 44px minimum for controls | Axe-browser (target-size) | Automated pass in the real-browser scan |
| 3.2.2 On input | No context change on input | Unit | Automated pass |
| 3.3.1 / 3.3.3 Error identification and suggestion | Inline messages + summary with links, plain-language suggestions | Unit | Automated pass |
| 3.3.2 Labels or instructions | Visible labels, hints, "(required)" | Unit | Automated pass |
| 4.1.2 Name, role, value | APG roles/states for tabs, menu, accordion, dialog, sort | Unit, Axe-jsdom | Automated pass; screen reader check Manual |
| 4.1.3 Status messages | Toast live regions, sort status, form success | Unit | Automated pass; announcement check Manual |

Known deviations: Accordion drops `role=region` above six panels (APG advice). Disabled controls have 4.15:1 text, exempt under 1.4.3.
