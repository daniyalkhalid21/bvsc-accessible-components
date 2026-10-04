# Axe audit log

Generated 2026-10-04 by `scripts/audit-stories.mjs`.

**Scan mode:** Playwright + @axe-core/playwright (real Chromium, built Storybook)

## Result

- Stories scanned: **30** across **10** component groups
- BEFORE (first jsdom scan during development): **2** stories with serious/critical violations (recorded in `docs/audit-history.json`)
- BEFORE (first real-browser scan, 2026-10-04): **0** serious/critical, **66** of any impact (all moderate: landmark-one-main and page-has-heading-one on 27 component stories each, region on 11 component stories plus the demo page; page-level rules are not applicable to isolated components)
- AFTER (this run): **0** serious/critical violations, **0** violations of any impact

## Rule scoping

The page-level rules `landmark-one-main`, `page-has-heading-one` and `region` are disabled for isolated component stories (a story is a fragment, not a page) and stay enabled for the Demo catalogue page.

## Findings

| Date | Component | Story | Rule ID | Impact | Description | Element | Status | Fix made |
|---|---|---|---|---|---|---|---|---|
| 2026-10-03 | FormField | RadioGroupError, OrderEnquiry (also the standalone order form test render in its error state) | aria-allowed-attr | critical | aria-required / aria-invalid are not allowed on <fieldset> (RadioGroup) | - | fixed | Removed both attributes from the fieldset; the error is still exposed through aria-describedby and 'required' is stated in the legend text |
| 2026-10-04 | All component stories | 27 component stories (first real-browser scan) | landmark-one-main, page-has-heading-one, region | moderate | Page-level rules reported on isolated components, which are not pages | - | scoped out | Rules disabled for Components/* stories in the audit script and Storybook a11y addon; still enforced on the Demo page |

## Before vs after per component

| Component | Stories | Stories failing BEFORE | Serious/critical AFTER | All violations AFTER |
|---|---|---|---|---|
| Demo catalogue page | 1 | 0 | 0 | 0 |
| Accordion | 3 | 0 | 0 | 0 |
| Button | 6 | 0 | 0 | 0 |
| FormField | 8 | 2 | 0 | 0 |
| Menu | 2 | 0 | 0 | 0 |
| Modal | 3 | 0 | 0 | 0 |
| SkipLink | 1 | 0 | 0 | 0 |
| Table | 2 | 0 | 0 | 0 |
| Tabs | 2 | 0 | 0 | 0 |
| Toast | 2 | 0 | 0 | 0 |
