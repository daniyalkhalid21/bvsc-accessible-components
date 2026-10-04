import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import { Accordion } from './Accordion';
import * as stories from './Accordion.stories';
const { faqItems, ...ex } = stories as any; const all = composeStories(ex);
const q = (n: RegExp) => screen.getByRole('button', { name: n });
describe('Accordion', () => {
  it('toggles with Enter and Space, updating aria-expanded', async () => {
    render(<Accordion items={faqItems} />); const b = q(/how fast/i);
    expect(b).toHaveAttribute('aria-expanded', 'false'); b.focus();
    await userEvent.keyboard('{Enter}'); expect(b).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' '); expect(b).toHaveAttribute('aria-expanded', 'false');
  });
  it('aria-controls points to a region labelled by the button', async () => {
    render(<Accordion items={faqItems} defaultOpen={['delivery']} />);
    const b = q(/how fast/i); const region = screen.getByRole('region', { name: /how fast/i });
    expect(b.getAttribute('aria-controls')).toBe(region.id); expect(region).toBeVisible();
  });
  it('collapsed panels are hidden from the accessibility tree', () => { render(<Accordion items={faqItems} />); expect(screen.queryAllByRole('region')).toHaveLength(0); });
  it('Arrow Down/Up wrap, Home/End jump', async () => {
    render(<Accordion items={faqItems} />); q(/how fast/i).focus();
    await userEvent.keyboard('{ArrowDown}'); expect(q(/return/i)).toHaveFocus();
    await userEvent.keyboard('{End}'); expect(q(/bulk/i)).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}'); expect(q(/how fast/i)).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}'); expect(q(/bulk/i)).toHaveFocus();
    await userEvent.keyboard('{Home}'); expect(q(/how fast/i)).toHaveFocus();
  });
  it('allowMultiple=false closes the other panel', async () => {
    render(<Accordion items={faqItems} allowMultiple={false} defaultOpen={['delivery']} />);
    await userEvent.click(q(/return/i)); expect(q(/how fast/i)).toHaveAttribute('aria-expanded', 'false'); expect(q(/return/i)).toHaveAttribute('aria-expanded', 'true');
  });
  it('with more than 6 panels, open panels are not regions (landmark clutter)', () => {
    const many = Array.from({ length: 7 }, (_, i) => ({ id: `i${i}`, title: `Item ${i}`, content: <p>Body {i}</p> }));
    render(<Accordion items={many} defaultOpen={many.map(m => m.id)} />); expect(screen.queryAllByRole('region')).toHaveLength(0); expect(screen.getByText('Body 6')).toBeVisible();
  });
  it('headings use the requested level', () => { render(<Accordion items={faqItems} headingLevel={2} />); expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3); });
  describe.each(Object.entries(all))('axe: %s', (_n, Story: any) => { it('has no violations', async () => { const { container } = render(<Story />); expect(await axe(container)).toHaveNoViolations(); }); });
});
