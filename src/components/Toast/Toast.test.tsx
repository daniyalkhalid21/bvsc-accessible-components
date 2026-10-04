import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import * as stories from './Toast.stories';
const all = composeStories(stories as any) as any; const { Triggers } = all;
const setup = () => { vi.useFakeTimers(); (globalThis as any).jest = { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) }; return userEvent.setup({ delay: null }); };
afterEach(() => { vi.useRealTimers(); delete (globalThis as any).jest; });
describe('Toast', () => {
  it('live regions exist before any toast (status and alert)', () => { render(<Triggers />); expect(screen.getByRole('status')).toBeInTheDocument(); expect(screen.getByRole('alert')).toBeInTheDocument(); });
  it('success goes in role=status, errors in role=alert', async () => {
    render(<Triggers />); const u = userEvent.setup();
    await u.click(screen.getByRole('button', { name: 'Add to basket' })); expect(screen.getByRole('status')).toHaveTextContent(/added to basket/i);
    await u.click(screen.getByRole('button', { name: 'Trigger error' })); expect(screen.getByRole('alert')).toHaveTextContent(/could not place your order/i);
  });
  it('never steals focus', async () => { render(<Triggers />); const b = screen.getByRole('button', { name: 'Trigger error' }); await userEvent.click(b); expect(b).toHaveFocus(); });
  it('non-error toasts auto-dismiss after the duration', async () => {
    const u = setup(); render(<Triggers />); await u.click(screen.getByRole('button', { name: 'Show info' }));
    expect(screen.getByText(/prices include/i)).toBeInTheDocument(); await act(async () => { await vi.advanceTimersByTimeAsync(6100); });
    expect(screen.queryByText(/prices include/i)).not.toBeInTheDocument();
  });
  it('errors do not auto-dismiss', async () => {
    const u = setup(); render(<Triggers />); await u.click(screen.getByRole('button', { name: 'Trigger error' }));
    await act(async () => { await vi.advanceTimersByTimeAsync(60000); }); expect(screen.getByText(/could not place/i)).toBeInTheDocument();
  });
  it('pauses on hover and resumes after leaving', async () => {
    const u = setup(); render(<Triggers />); await u.click(screen.getByRole('button', { name: 'Show info' }));
    const t = screen.getByText(/prices include/i); await u.hover(t); await act(async () => { await vi.advanceTimersByTimeAsync(20000); });
    expect(screen.getByText(/prices include/i)).toBeInTheDocument(); await u.unhover(t); await act(async () => { await vi.advanceTimersByTimeAsync(6100); });
    expect(screen.queryByText(/prices include/i)).not.toBeInTheDocument();
  });
  it('pauses while keyboard focus is inside the toast', async () => {
    const u = setup(); render(<Triggers />); await u.click(screen.getByRole('button', { name: 'Show info' }));
    screen.getByRole('button', { name: /dismiss notification/i }).focus(); await act(async () => { await vi.advanceTimersByTimeAsync(20000); });
    expect(screen.getByText(/prices include/i)).toBeInTheDocument();
  });
  it('dismiss button and Escape (when focus is in the toast) remove it', async () => {
    render(<Triggers />); const u = userEvent.setup(); await u.click(screen.getByRole('button', { name: 'Trigger error' }));
    await u.click(screen.getByRole('button', { name: /dismiss notification/i })); expect(screen.queryByText(/could not place/i)).not.toBeInTheDocument();
    await u.click(screen.getByRole('button', { name: 'Trigger error' })); screen.getByRole('button', { name: /dismiss notification/i }).focus(); await u.keyboard('{Escape}');
    expect(screen.queryByText(/could not place/i)).not.toBeInTheDocument();
  });
  it('errors are announced with a text prefix, not colour alone', async () => { render(<Triggers />); await userEvent.click(screen.getByRole('button', { name: 'Trigger error' })); expect(screen.getByRole('alert')).toHaveTextContent(/^Error:/); });
  describe.each(Object.entries(all))('axe: %s', (_n, Story: any) => { it('has no violations', async () => { const { container } = render(<Story />); expect(await axe(container)).toHaveNoViolations(); }); });
  it('axe: with toasts showing', async () => {
    const { container } = render(<Triggers />); const u = userEvent.setup();
    await u.click(screen.getByRole('button', { name: 'Add to basket' })); await u.click(screen.getByRole('button', { name: 'Trigger error' }));
    expect(await axe(document.body)).toHaveNoViolations(); void container;
  });
});
