import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import { Tabs } from './Tabs';
import * as stories from './Tabs.stories';
const { productTabs, ...ex } = stories as any; const all = composeStories(ex);
const tab = (n: RegExp) => screen.getByRole('tab', { name: n });
describe('Tabs', () => {
  it('has tablist with label, tabs wired to panels', () => {
    render(<Tabs tabs={productTabs} label="Product information" />);
    expect(screen.getByRole('tablist', { name: 'Product information' })).toBeInTheDocument();
    const panel = screen.getByRole('tabpanel', { name: /description/i });
    expect(tab(/description/i).getAttribute('aria-controls')).toBe(panel.id); expect(tab(/description/i)).toHaveAttribute('aria-selected', 'true');
  });
  it('roving tabindex: only selected tab is in the tab order', () => {
    render(<Tabs tabs={productTabs} label="x" />);
    expect(tab(/description/i)).toHaveAttribute('tabindex', '0'); expect(tab(/dosage/i)).toHaveAttribute('tabindex', '-1');
  });
  it('Tab key goes tablist -> panel (skipping other tabs)', async () => {
    render(<Tabs tabs={productTabs} label="x" />); await userEvent.tab(); expect(tab(/description/i)).toHaveFocus();
    await userEvent.tab(); expect(screen.getByRole('tabpanel')).toHaveFocus();
  });
  it('Arrow keys move focus and activate (automatic activation), wrapping', async () => {
    render(<Tabs tabs={productTabs} label="x" />); tab(/description/i).focus();
    await userEvent.keyboard('{ArrowRight}'); expect(tab(/dosage/i)).toHaveFocus(); expect(tab(/dosage/i)).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /dosage/i })).toBeVisible();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}'); expect(tab(/storage/i)).toHaveFocus();
  });
  it('Home and End jump to first and last', async () => {
    render(<Tabs tabs={productTabs} label="x" />); tab(/description/i).focus();
    await userEvent.keyboard('{End}'); expect(tab(/storage/i)).toHaveFocus(); await userEvent.keyboard('{Home}'); expect(tab(/description/i)).toHaveFocus();
  });
  it('click selects a tab', async () => { render(<Tabs tabs={productTabs} label="x" />); await userEvent.click(tab(/storage/i)); expect(screen.getByRole('tabpanel', { name: /storage/i })).toBeVisible(); });
  it('controlled mode: follows value and reports changes', async () => {
    const fn = vi.fn(); const { rerender } = render(<Tabs tabs={productTabs} label="x" value="dose" onChange={fn} />);
    expect(tab(/dosage/i)).toHaveAttribute('aria-selected', 'true'); await userEvent.click(tab(/storage/i)); expect(fn).toHaveBeenCalledWith('storage');
    rerender(<Tabs tabs={productTabs} label="x" value="storage" onChange={fn} />); expect(screen.getByRole('tabpanel', { name: /storage/i })).toBeVisible();
  });
  describe.each(Object.entries(all))('axe: %s', (_n, Story: any) => { it('has no violations', async () => { const { container } = render(<Story />); expect(await axe(container)).toHaveNoViolations(); }); });
});
