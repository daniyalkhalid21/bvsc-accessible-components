# Week 3 review and what Week 4 targets

**Week 3 project:** Multi-Language / Localization-Ready Website for a Boutique Dairy Supplier.

## What I did well
- **Multi-language content and language switching worked.** The site could present its content in more than one language and let the visitor switch between them, which was the core requirement of the Week 3 brief.

## Gaps
- **Little or no automated testing.** I checked the Week 3 site by hand. That finds problems only when I happen to look for them, and nothing would warn me if a later change broke the language switching or the content in another language.

## New skill for Week 4
Week 4 deliberately targets that gap with a different kind of problem: accessibility engineering for UI components. The skill is building components to the WAI-ARIA Authoring Practices and proving they work with automated checks instead of only by eye:
- 135 automated tests (keyboard behaviour, ARIA wiring, and an axe check for every story),
- a real-browser axe-core audit of all 30 stories, run in CI on every push,
- a contrast script covering 31 colour pairs.

The topic, tool (Storybook and axe-core) and method are different from Week 3: no part of the Week 3 code, files or data is reused.
