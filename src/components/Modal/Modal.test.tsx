import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import * as stories from './Modal.stories';
const { lines, ...ex } = stories as any; const all = composeStories(ex) as Record<string, any>;
const { Default, ConfirmOrder } = all;
describe('Modal', () => {
  it('opens with an accessible name and description, and moves focus inside', async () => {
    render(<Default />); await userEvent.click(screen.getByRole('button', { name: 'Delivery details' }));
    const d = await screen.findByRole('dialog', { name: 'Delivery details' }); expect(d).toHaveAccessibleDescription(/ship the same day/i);
    expect(d.contains(document.activeElement)).toBe(true);
  });
  it('locks body scroll while open and releases on close', async () => {
    render(<Default />); await userEvent.click(screen.getByRole('button', { name: 'Delivery details' })); expect(document.body.style.overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}'); expect(document.body.style.overflow).toBe('');
  });
  it('Escape closes and focus returns to the trigger', async () => {
    render(<Default />); const t = screen.getByRole('button', { name: 'Delivery details' }); await userEvent.click(t);
    await screen.findByRole('dialog'); await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(t).toHaveFocus();
  });
  it('close button closes and returns focus', async () => {
    render(<Default />); const t = screen.getByRole('button', { name: 'Delivery details' }); await userEvent.click(t);
    await userEvent.click(await screen.findByRole('button', { name: 'Close dialog' })); expect(t).toHaveFocus();
  });
  it('traps focus: Tab and Shift+Tab wrap inside the dialog', async () => {
    render(<Default />); await userEvent.click(screen.getByRole('button', { name: 'Delivery details' })); const d = await screen.findByRole('dialog');
    for (let i = 0; i < 6; i++) { await userEvent.tab(); expect(d.contains(document.activeElement)).toBe(true); }
    for (let i = 0; i < 6; i++) { await userEvent.tab({ shift: true }); expect(d.contains(document.activeElement)).toBe(true); }
  });
  it('Confirm order: initial focus on the safe action (Back to basket), shows total', async () => {
    render(<ConfirmOrder />); await userEvent.click(screen.getByRole('button', { name: 'Review order' }));
    const d = await screen.findByRole('dialog', { name: 'Confirm your order' });
    expect(screen.getByRole('button', { name: 'Back to basket' })).toHaveFocus(); expect(d).toHaveTextContent('$69.00');
  });
  it('Confirm order: Place order shows busy state then closes', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true }); render(<ConfirmOrder />);
    await userEvent.click(screen.getByRole('button', { name: 'Review order' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Place order' }));
    expect(screen.getByRole('button', { name: /place order, placing order/i })).toHaveAttribute('aria-busy', 'true');
    await vi.advanceTimersByTimeAsync(1300); expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); vi.useRealTimers();
  });
  describe.each(Object.entries(all))('axe: %s', (_n, Story: any) => { it('has no violations', async () => { const { container } = render(<Story />); expect(await axe(container)).toHaveNoViolations(); }); });
  it('axe: open default modal', async () => { const { container } = render(<Default />); await userEvent.click(screen.getByRole('button', { name: 'Delivery details' })); await screen.findByRole('dialog'); expect(await axe(container)).toHaveNoViolations(); });
});
