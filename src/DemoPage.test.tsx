import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { DemoPage } from './DemoPage';
const add = (u: ReturnType<typeof userEvent.setup>, name: RegExp) => u.click(screen.getByRole('button', { name }));
const openBasket = (u: ReturnType<typeof userEvent.setup>) => u.click(screen.getByRole('button', { name: /^basket \(/i }));
const menu = async (u: ReturnType<typeof userEvent.setup>, item: RegExp) => { await u.click(screen.getByRole('button', { name: 'Account' })); await u.click(screen.getByRole('menuitem', { name: item })); };
describe('Demo catalogue page', () => {
  it('skip link is the first tab stop', async () => { render(<DemoPage />); await userEvent.tab(); expect(screen.getByRole('link', { name: /skip to main/i })).toHaveFocus(); });
  it('add to basket announces a toast and updates the basket count in header and tab', async () => {
    render(<DemoPage />); const u = userEvent.setup(); await add(u, /add luer-lock syringe, sterile, 5 ml/i);
    expect(screen.getAllByRole('status').some(n => /added to basket/i.test(n.textContent ?? ''))).toBe(true);
    expect(screen.getByRole('button', { name: 'Basket (1)' })).toBeInTheDocument(); expect(screen.getByRole('tab', { name: 'Basket (1)' })).toBeInTheDocument();
  });
  it('cannot add more than the stock level (error toast)', async () => {
    render(<DemoPage />); const u = userEvent.setup();
    for (let i = 0; i < 4; i++) await add(u, /add ear cleaning solution/i);
    expect(screen.getByRole('alert')).toHaveTextContent(/only 3 of ear cleaning solution/i); expect(screen.getByRole('button', { name: 'Basket (3)' })).toBeInTheDocument();
  });
  it('basket: empty state, change quantity, remove, clear', async () => {
    render(<DemoPage />); const u = userEvent.setup(); await openBasket(u);
    expect(screen.getByText('Your basket is empty.')).toBeInTheDocument(); await u.click(screen.getByRole('button', { name: 'Browse products' }));
    expect(screen.getByRole('tab', { name: /^products/i })).toHaveAttribute('aria-selected', 'true');
    await add(u, /add slicker brush/i); await add(u, /add professional clippers/i); await openBasket(u);
    await u.click(screen.getByRole('button', { name: /increase quantity of slicker brush/i })); expect(screen.getByRole('button', { name: 'Basket (3)' })).toBeInTheDocument();
    await u.click(screen.getByRole('button', { name: /decrease quantity of slicker brush/i })); expect(screen.getByRole('button', { name: 'Basket (2)' })).toBeInTheDocument();
    await u.click(screen.getByRole('button', { name: /decrease quantity of slicker brush/i })); expect(screen.getByRole('button', { name: 'Basket (2)' })).toBeInTheDocument(); // clamped at 1
    await u.click(screen.getByRole('button', { name: /remove professional clippers/i })); expect(screen.getByRole('button', { name: 'Basket (1)' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Your basket' })).toHaveFocus());
    await u.click(screen.getByRole('button', { name: 'Clear basket' })); expect(screen.getByText('Your basket is empty.')).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Basket (0)' })).toBeInTheDocument();
  });
  it('place order: Escape returns focus to Place order; confirming creates the order and empties the basket', async () => {
    render(<DemoPage />); const u = userEvent.setup(); await add(u, /add slicker brush/i); await openBasket(u);
    const trigger = screen.getByRole('button', { name: 'Place order' }); await u.click(trigger);
    const d = await screen.findByRole('dialog', { name: 'Confirm your order' }); expect(within(d).getByText(/slicker brush/i)).toBeInTheDocument();
    await u.keyboard('{Escape}'); expect(trigger).toHaveFocus();
    await u.click(trigger); await u.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Place order' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Your orders' })).toHaveFocus(), { timeout: 3000 });
    const t = screen.getByRole('table', { name: 'Order history' }); expect(within(t).getByText('BV-1001')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Basket (0)' })).toBeInTheDocument();
  });
  it('account menu: My orders opens the orders tab and moves focus to its heading', async () => {
    render(<DemoPage />); const u = userEvent.setup(); await menu(u, /my orders/i);
    expect(screen.getByRole('tab', { name: 'My orders' })).toHaveAttribute('aria-selected', 'true'); await waitFor(() => expect(screen.getByRole('heading', { name: 'Your orders' })).toHaveFocus());
  });
  it('reorder and latest invoice: errors/info with no orders; work after an order exists', async () => {
    render(<DemoPage />); const u = userEvent.setup();
    await menu(u, /reorder last order/i); expect(screen.getByRole('alert')).toHaveTextContent(/no earlier orders/i);
    await menu(u, /latest invoice/i); expect(screen.getAllByRole('status').some(n => /no invoices yet/i.test(n.textContent ?? ''))).toBe(true);
    await add(u, /add slicker brush/i); await openBasket(u); await u.click(screen.getByRole('button', { name: 'Place order' }));
    await u.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Place order' })); await screen.findByRole('table', { name: 'Order history' }, { timeout: 3000 });
    await menu(u, /latest invoice/i); const inv = await screen.findByRole('dialog', { name: 'Invoice INV-1001' }); expect(inv).toHaveAccessibleDescription(/order BV-1001/i);
    await u.keyboard('{Escape}'); await menu(u, /reorder last order/i); expect(screen.getByRole('button', { name: 'Basket (1)' })).toBeInTheDocument();
  });
  it('sign out hides orders behind a sign-in prompt, and Sign in restores access', async () => {
    render(<DemoPage />); const u = userEvent.setup(); await menu(u, /sign out/i);
    expect(screen.getByText('Not signed in')).toBeInTheDocument(); await u.click(screen.getByRole('tab', { name: 'My orders' }));
    expect(screen.getByText('Sign in to see your orders.')).toBeInTheDocument();
    await u.click(screen.getByRole('button', { name: 'Account' })); expect(screen.getAllByRole('menuitem')).toHaveLength(1);
    await u.click(screen.getByRole('menuitem', { name: 'Sign in' })); expect(screen.getByText('Dr. Sam Lee')).toBeInTheDocument();
  });
  it('placing an order while signed out shows an error instead', async () => {
    render(<DemoPage />); const u = userEvent.setup(); await add(u, /add slicker brush/i); await menu(u, /sign out/i); await openBasket(u);
    await u.click(screen.getByRole('button', { name: 'Place order' })); await u.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Place order' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/sign in to place/i);
  });
  it('tabs switch to the enquiry form and validation works inside the page', async () => {
    render(<DemoPage />); const u = userEvent.setup(); await u.click(screen.getByRole('tab', { name: 'Order enquiry' }));
    await u.click(screen.getByRole('button', { name: /send enquiry/i })); expect(await screen.findByRole('group', { name: /problems/i })).toBeInTheDocument();
  });
  it('has no axe violations: products, basket with items, orders with an order, open modal', async () => {
    const { container } = render(<DemoPage />); expect(await axe(container)).toHaveNoViolations();
    const u = userEvent.setup(); await add(u, /add slicker brush/i); await openBasket(u); expect(await axe(container)).toHaveNoViolations();
    await u.click(screen.getByRole('button', { name: 'Place order' })); await screen.findByRole('dialog'); expect(await axe(document.body)).toHaveNoViolations();
    await u.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Place order' })); await screen.findByRole('table', { name: 'Order history' }, { timeout: 3000 });
    expect(await axe(container)).toHaveNoViolations();
  });
});
