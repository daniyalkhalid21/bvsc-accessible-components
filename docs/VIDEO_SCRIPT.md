# Video script outline (5 to 10 minutes)

Outline only. Put this in your own words.

## 1. Intro (0:30)
- Who the client is: Boutique Veterinary Supply Company, a small online vet supply shop
- The brief: accessible component library, WCAG 2.2 AA, for clinic staff, farmers and pet owners

## 2. What I built (1:30)
- The 8 components: Button, FormField set, Accordion, Tabs, Table, Modal, Menu, Toast (plus SkipLink)
- Show the Storybook: introduction page, one component docs page, the demo catalogue page
- Design tokens and the contrast report

## 3. Tools and process (1:30)
- Vite, React, TypeScript, Storybook with the a11y addon, Vitest, vitest-axe, axe-core
- Used an AI coding assistant to build in phases; how I checked its output (tests, audit, my own manual testing)
- Scope document written before any code

## 4. Problems found and solved (1:30)
- The real axe finding: aria-required / aria-invalid not allowed on a fieldset (RadioGroup) and how it was fixed
- Storybook indexing helper exports as stories, fixed with excludeStories
- Playwright browser could not run in the build environment: fallback to jsdom axe, and what that cannot check (colour contrast)
- Any issues from my own NVDA / VoiceOver pass (fill in)

## 5. Keyboard-only demo (2:00)
- Modal: Tab to Review order, open, focus inside, Tab cycle, Escape, focus returns
- Menu: Enter / Arrow Down to open, arrows, type-ahead, Escape, focus returns
- Mention skip link first

## 6. Results and limitations (1:00)
- Real numbers from README: tests, stories, contrast pairs, axe results
- Limitations: jsdom scan, manual screen reader results, no real-browser Playwright run yet

## 7. Wrap-up (0:30)
- What I would do next
