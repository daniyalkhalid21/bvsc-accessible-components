# Summary: approach and decisions

**Brief.** Build a WCAG 2.2 AA component library for Boutique Veterinary Supply Company, a small shop selling vet supplies, aimed at clinic staff, farmers and pet owners, including keyboard and screen reader users.

**Approach.** I wrote the scope first (`docs/SCOPE.md`), then design tokens with a script that calculates contrast for 31 colour pairs, then eight components. Each component follows the WAI-ARIA Authoring Practices pattern, prefers native HTML, and ships with stories, MDX documentation and user-event tests that check real keyboard behaviour and run axe on every story. A demo catalogue page combines skip link, menu, tabs, price table, order modal, enquiry form and toasts to show them working together.

**What the tools found.** Real runs caught: a critical axe finding (`aria-required` and `aria-invalid` are not allowed on a `<fieldset>`, used by the RadioGroup), an accessible description that read "Error:Bad email" because a space was trimmed, and Storybook indexing seven helper exports as broken stories. All were fixed and are logged in `CHANGELOG.md` and `docs/AUDIT_LOG.md`. Several early test failures were mistakes in my tests, not in components; those are logged too.

**Decisions.** Native `<dialog>` for the modal; automatic activation for tabs; safe default focus on "Back to basket" in the order confirmation; two always-mounted live regions for toasts, with errors that persist; 44px targets; errors as text plus icon; a 3px focus ring with at least 3:1 contrast.

**Honest limits.** The audit scans each story in isolation at one viewport, and axe finds only part of the possible WCAG issues. **No NVDA or VoiceOver testing was performed**, so screen reader behaviour is verified only through ARIA patterns, automated axe checks and tests of the accessibility tree; a manual screen reader pass is the main remaining gap. Final numbers: 8 components, 30 stories, 135 passing tests, 0 serious/critical axe violations, 0 failing contrast pairs.
