# Scope: Boutique Veterinary Supply Company (BVSC) accessible component library

## Client background
BVSC is a small online shop selling vet supplies: syringes, feed supplements, grooming tools and pet health products. They need a reusable, WCAG 2.2 AA component set for their catalogue and ordering flow.

## Target users
- **Clinic staff**: repeat bulk orders, fast keyboard use, often on shared desktop PCs.
- **Farmers**: phones outdoors, glare, gloves, so large targets and strong contrast matter.
- **Pet owners**: occasional buyers, less technical, need clear errors and confirmation.
- Includes keyboard-only users and screen reader users (NVDA, VoiceOver).

## The 8 components and why
| Component | Client need |
|---|---|
| Button | Add to basket, place order, remove item (danger), icon-only basket button |
| FormField set (TextInput, Select, Checkbox, RadioGroup, Textarea) | Order enquiry form with clear validation |
| Accordion | Product FAQs, delivery and returns info |
| Tabs | Product details: Description / Dosage / Storage |
| Table | Price list: name, category, size, price, stock; sortable |
| Modal | Confirm order before payment |
| Menu | Account / catalogue shortcuts menu button |
| Toast | "Added to basket", order errors, without stealing focus |

Also: SkipLink, visually-hidden utility, shared focus style.

## In scope
Components, tokens, stories, docs, unit and axe tests, contrast report, story-level audit, Storybook static build.

## Out of scope
Real checkout/payment, backend, routing, dark mode, i18n, pagination/filtering of the table, mobile native testing.

## Assumptions
- Modal uses native `<dialog>` with `showModal()` (built-in focus trap, inert background, Escape). jsdom lacks it, so tests polyfill `showModal`/`close`.
- Tabs use **automatic activation** (focus selects) as panels are static and cheap to render.
- Accordion allows multiple panels open.
- Toast container is mounted once and persistent so live regions are announced reliably.
- Font stack falls back to system fonts (no webfont loading, works offline).
- Minimum target size is 44px (above the 24px WCAG 2.2 minimum).
- Screen reader results are NOT claimed; the manual checklist is left blank for the owner.

## Success target
8 components, 40+ automated tests, 0 serious/critical axe violations on every story, AA contrast on all token pairs.
