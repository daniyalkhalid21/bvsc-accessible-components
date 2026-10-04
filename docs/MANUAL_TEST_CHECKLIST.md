# Manual test checklist

**Status: the NVDA and VoiceOver tables below have NOT been completed. No screen reader testing has been done for this project.** The keyboard-only tables can be completed from the keyboard recording.

Fill in the **Result** (Pass / Fail / Partial), **Issues** and **Fix** columns yourself while testing. Nothing here has been tested by a screen reader: no results are pre-filled.

**Setup:** run `npm run storybook` (or open the deployed Storybook). Suggested pairings: NVDA + Firefox or Chrome on Windows; VoiceOver + Safari on macOS or iOS. Record the versions you used.

| Tester | Date | OS | Browser | Screen reader + version |
|---|---|---|---|---|
| | | | | |


## Button

### Keyboard only

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| K1 | Tab reaches each button in a logical order; focus ring clearly visible | | | |
| K2 | Enter and Space activate the button | | | |
| K3 | Loading button stays focusable and does nothing when activated | | | |
| K4 | Disabled button is skipped by Tab | | | |

### NVDA

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| N1 | Name and role announced ("Add to basket, button") | | | |
| N2 | Loading state announces the label plus loading text | | | |
| N3 | Icon-only button announces its accessible name | | | |
| N4 | Disabled state is announced | | | |

### VoiceOver

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| V1 | Name and role announced ("Add to basket, button") | | | |
| V2 | Loading state announces the label plus loading text | | | |
| V3 | Icon-only button announces its accessible name | | | |
| V4 | Disabled state is announced | | | |

## FormField set

### Keyboard only

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| K1 | Tab visits every control in reading order | | | |
| K2 | Space toggles checkbox; arrow keys change radio and select value | | | |
| K3 | Submit empty Order enquiry form: focus moves to the error summary | | | |
| K4 | Enter on an error summary link moves focus to the invalid field | | | |

### NVDA

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| N1 | Each control announces label, required state and hint | | | |
| N2 | Invalid field announces "Error: ..." text with its label | | | |
| N3 | Radio group announces legend and group | | | |
| N4 | Error summary heading and count are announced when it receives focus | | | |
| N5 | Success message is announced after a valid submit | | | |

### VoiceOver

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| V1 | Each control announces label, required state and hint | | | |
| V2 | Invalid field announces "Error: ..." text with its label | | | |
| V3 | Radio group announces legend and group | | | |
| V4 | Error summary heading and count are announced when it receives focus | | | |
| V5 | Success message is announced after a valid submit | | | |

## Accordion

### Keyboard only

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| K1 | Tab reaches each header; Enter/Space toggles | | | |
| K2 | Arrow Down/Up move between headers and wrap | | | |
| K3 | Home/End jump to first/last header | | | |
| K4 | Tab from an open header enters the panel content | | | |

### NVDA

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| N1 | Header announced with collapsed/expanded state | | | |
| N2 | Opened panel is announced as a region with the header name | | | |
| N3 | Collapsed content is not read | | | |

### VoiceOver

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| V1 | Header announced with collapsed/expanded state | | | |
| V2 | Opened panel is announced as a region with the header name | | | |
| V3 | Collapsed content is not read | | | |

## Tabs

### Keyboard only

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| K1 | Tab enters the tablist on the selected tab only | | | |
| K2 | Arrow Right/Left move and activate tabs, wrapping | | | |
| K3 | Home/End jump to first/last tab | | | |
| K4 | Tab from the tablist moves to the panel, then onward | | | |

### NVDA

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| N1 | Tab announced with "selected" and position (n of m) | | | |
| N2 | Tablist name is announced | | | |
| N3 | Panel is announced with the tab name | | | |

### VoiceOver

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| V1 | Tab announced with "selected" and position (n of m) | | | |
| V2 | Tablist name is announced | | | |
| V3 | Panel is announced with the tab name | | | |

## Table

### Keyboard only

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| K1 | Tab reaches the scroll region, then each sort button | | | |
| K2 | Enter/Space on a sort button sorts; repeat reverses | | | |
| K3 | Arrow keys scroll the focused region horizontally at narrow width | | | |
| K4 | Add buttons in the demo page are reachable and operable | | | |

### NVDA

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| N1 | Caption announced when entering the table | | | |
| N2 | Column and row headers are announced while moving by cell | | | |
| N3 | Sort state announced via aria-sort and the status message ("Sorted by Price, ascending") | | | |
| N4 | Out of stock and low stock are announced as text | | | |

### VoiceOver

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| V1 | Caption announced when entering the table | | | |
| V2 | Column and row headers are announced while moving by cell | | | |
| V3 | Sort state announced via aria-sort and the status message ("Sorted by Price, ascending") | | | |
| V4 | Out of stock and low stock are announced as text | | | |

## Modal

### Keyboard only

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| K1 | Open with Enter on the trigger; focus moves into the dialog (Back to basket) | | | |
| K2 | Tab and Shift+Tab stay inside the dialog | | | |
| K3 | Escape closes and focus returns to the trigger | | | |
| K4 | Background page cannot be scrolled or tabbed to while open | | | |
| K5 | Place order shows busy state | | | |

### NVDA

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| N1 | Dialog name and description announced on open | | | |
| N2 | Background content is not reachable with the virtual cursor | | | |
| N3 | Total and order lines are readable | | | |
| N4 | Focus return to trigger is announced | | | |

### VoiceOver

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| V1 | Dialog name and description announced on open | | | |
| V2 | Background content is not reachable with the virtual cursor | | | |
| V3 | Total and order lines are readable | | | |
| V4 | Focus return to trigger is announced | | | |

## Menu

### Keyboard only

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| K1 | Enter, Space and Arrow Down open the menu with first item focused; Arrow Up opens at last item | | | |
| K2 | Arrow keys, Home and End move; disabled item is skipped | | | |
| K3 | Type-ahead: type "c" to reach "Clinic price list" | | | |
| K4 | Escape closes and returns focus to the button; Tab closes the menu | | | |

### NVDA

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| N1 | Button announced as menu button with expanded state | | | |
| N2 | Items announced as menu items with position | | | |
| N3 | Disabled item announced as unavailable | | | |
| N4 | Selected action result is announced (toast) without moving focus | | | |

### VoiceOver

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| V1 | Button announced as menu button with expanded state | | | |
| V2 | Items announced as menu items with position | | | |
| V3 | Disabled item announced as unavailable | | | |
| V4 | Selected action result is announced (toast) without moving focus | | | |

## Toast

### Keyboard only

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| K1 | Adding to basket shows a toast but keeps focus on the button | | | |
| K2 | Tab reaches the dismiss button; Enter dismisses | | | |
| K3 | Escape inside a toast dismisses it | | | |
| K4 | Error toasts stay until dismissed; info toasts pause while hovered or focused | | | |

### NVDA

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| N1 | Success toast text is announced politely without interrupting | | | |
| N2 | Error toast is announced assertively with "Error:" prefix | | | |
| N3 | Dismiss button name includes the message | | | |
| N4 | Live region does not repeat announcements | | | |

### VoiceOver

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| V1 | Success toast text is announced politely without interrupting | | | |
| V2 | Error toast is announced assertively with "Error:" prefix | | | |
| V3 | Dismiss button name includes the message | | | |
| V4 | Live region does not repeat announcements | | | |

## SkipLink and Demo page

### Keyboard only

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| K1 | First Tab on the page reveals "Skip to main content" | | | |
| K2 | Enter moves focus to main content; next Tab goes to the first control inside main | | | |
| K3 | Full flow by keyboard only: menu, tabs, table, add, review order, confirm, enquiry form | | | |

### NVDA

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| N1 | Landmarks (banner, navigation, main) are listed by the screen reader | | | |
| N2 | Skip link is announced as a link | | | |
| N3 | Heading structure is logical (h1, then tab content) | | | |

### VoiceOver

| # | Check | Result | Issues | Fix |
|---|---|---|---|---|
| V1 | Landmarks (banner, navigation, main) are listed by the screen reader | | | |
| V2 | Skip link is announced as a link | | | |
| V3 | Heading structure is logical (h1, then tab content) | | | |
