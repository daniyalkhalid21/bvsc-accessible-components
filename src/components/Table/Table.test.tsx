import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import { Table } from './Table';
import * as stories from './Table.stories';
import { products, columns } from './Table.stories';
const { products: _p, columns: _c, ...ex } = stories as any; const all = composeStories(ex);
const setup = () => render(<Table caption="Price list" columns={columns} rows={products} rowKey={r => r.sku} />);
const firstCells = () => screen.getAllByRole('rowheader').map(c => c.textContent);
describe('Table', () => {
  it('has caption, column headers with scope=col and row headers', () => {
    setup(); expect(screen.getByRole('table', { name: 'Price list' })).toBeInTheDocument();
    screen.getAllByRole('columnheader').forEach(h => expect(h).toHaveAttribute('scope', 'col'));
    expect(screen.getAllByRole('rowheader')).toHaveLength(products.length);
  });
  it('scroll wrapper is a labelled, keyboard-focusable region', async () => {
    setup(); const r = screen.getByRole('region', { name: 'Price list' }); expect(r).toHaveAttribute('tabindex', '0');
    await userEvent.tab(); expect(r).toHaveFocus();
  });
  it('sortable headers contain buttons; aria-sort reflects state, only one column sorted', async () => {
    setup(); const price = screen.getByRole('columnheader', { name: /price/i }); expect(price).toHaveAttribute('aria-sort', 'none');
    expect(screen.getByRole('columnheader', { name: /size/i })).not.toHaveAttribute('aria-sort');
    await userEvent.click(within(price).getByRole('button')); expect(price).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(within(price).getByRole('button')); expect(price).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getByRole('columnheader', { name: /product/i })).toHaveAttribute('aria-sort', 'none');
  });
  it('actually sorts numerically (price ascending puts the cheapest first)', async () => {
    setup(); await userEvent.click(screen.getByRole('button', { name: /price/i }));
    const rows = screen.getAllByRole('row').slice(1); expect(rows[0]).toHaveTextContent('Ear cleaning solution');
    await userEvent.click(screen.getByRole('button', { name: /price/i })); expect(screen.getAllByRole('row')[1]).toHaveTextContent('Professional clippers');
  });
  it('sorts text with the keyboard and announces the change', async () => {
    setup(); screen.getByRole('button', { name: /category/i }).focus(); await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Sorted by Category, ascending'); expect(firstCells().length).toBe(products.length);
  });
  it('shows out-of-stock and low-stock as text, not colour', () => { setup(); expect(screen.getByText('Out of stock')).toBeInTheDocument(); expect(screen.getByText(/3 \(low\)/)).toBeInTheDocument(); });
  describe.each(Object.entries(all))('axe: %s', (_n, Story: any) => { it('has no violations', async () => { const { container } = render(<Story />); expect(await axe(container)).toHaveNoViolations(); }); });
});
