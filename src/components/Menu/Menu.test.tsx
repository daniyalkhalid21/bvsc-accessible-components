import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import { Menu } from './Menu';
import * as stories from './Menu.stories';
const { accountItems, ...ex } = stories as any; const all = composeStories(ex);
const btn = () => screen.getByRole('button', { name: 'Account' });
const item = (n: RegExp) => screen.getByRole('menuitem', { name: n });
describe('Menu', () => {
  it('menu button exposes haspopup and expanded state', async () => {
    render(<Menu label="Account" items={accountItems} />); expect(btn()).toHaveAttribute('aria-haspopup', 'menu'); expect(btn()).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn()); expect(btn()).toHaveAttribute('aria-expanded', 'true'); expect(screen.getByRole('menu', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(5);
  });
  it('Enter opens (focus on first item); Enter on item selects, closes, returns focus', async () => {
    const fn = vi.fn(); render(<Menu label="Account" items={[{ id: 'a', label: 'Alpha', onSelect: fn }, { id: 'b', label: 'Beta' }]} />);
    btn().focus(); await userEvent.keyboard('{ArrowDown}'); expect(item(/alpha/i)).toHaveFocus();
    await userEvent.keyboard('{Enter}'); expect(fn).toHaveBeenCalled(); expect(screen.queryByRole('menu')).not.toBeInTheDocument(); expect(btn()).toHaveFocus();
  });
  it('Enter and Space on the button open the menu with the first item focused', async () => {
    render(<Menu label="Account" items={accountItems} />); btn().focus(); await userEvent.keyboard('{Enter}'); expect(item(/my orders/i)).toHaveFocus();
    await userEvent.keyboard('{Escape}'); expect(btn()).toHaveFocus(); await userEvent.keyboard(' '); expect(item(/my orders/i)).toHaveFocus();
  });
  it('ArrowUp on the button opens with last item focused', async () => { render(<Menu label="Account" items={accountItems} />); btn().focus(); await userEvent.keyboard('{ArrowUp}'); expect(item(/sign out/i)).toHaveFocus(); });
  it('arrows wrap, Home/End jump, disabled items are skipped', async () => {
    render(<Menu label="Account" items={accountItems} />); btn().focus(); await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{End}'); expect(item(/sign out/i)).toHaveFocus(); await userEvent.keyboard('{ArrowDown}'); expect(item(/my orders/i)).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}'); expect(item(/sign out/i)).toHaveFocus(); await userEvent.keyboard('{ArrowUp}'); expect(item(/clinic price list/i)).toHaveFocus();
    await userEvent.keyboard('{Home}'); expect(item(/my orders/i)).toHaveFocus();
  });
  it('type-ahead moves to the matching item', async () => {
    render(<Menu label="Account" items={accountItems} />); btn().focus(); await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('c'); expect(item(/clinic price list/i)).toHaveFocus(); await userEvent.keyboard('{Home}'); await new Promise(r => setTimeout(r, 800)); await userEvent.keyboard('r'); expect(item(/reorder/i)).toHaveFocus();
  });
  it('Escape closes and returns focus to the button', async () => {
    render(<Menu label="Account" items={accountItems} />); btn().focus(); await userEvent.keyboard('{ArrowDown}{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument(); expect(btn()).toHaveFocus();
  });
  it('Tab closes the menu', async () => { render(<Menu label="Account" items={accountItems} />); btn().focus(); await userEvent.keyboard('{ArrowDown}{Tab}'); expect(screen.queryByRole('menu')).not.toBeInTheDocument(); });
  it('disabled item does not fire', async () => { const fn = vi.fn(); render(<Menu label="Account" items={[{ id: 'a', label: 'Alpha' }, { id: 'd', label: 'Dis', disabled: true, onSelect: fn }]} />); await userEvent.click(btn()); await userEvent.click(item(/dis/i)); expect(fn).not.toHaveBeenCalled(); });
  it('click outside closes', async () => { render(<><Menu label="Account" items={accountItems} /><p>outside</p></>); await userEvent.click(btn()); await userEvent.click(screen.getByText('outside')); expect(screen.queryByRole('menu')).not.toBeInTheDocument(); });
  describe.each(Object.entries(all))('axe: %s', (_n, Story: any) => { it('has no violations', async () => { const { container } = render(<Story />); expect(await axe(container)).toHaveNoViolations(); }); });
  it('axe: open menu', async () => { const { container } = render(<Menu label="Account" items={accountItems} />); await userEvent.click(btn()); expect(await axe(container)).toHaveNoViolations(); });
});
