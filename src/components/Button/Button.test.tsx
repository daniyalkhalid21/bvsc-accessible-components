import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import { Button } from './Button';
import * as stories from './Button.stories';
const all = composeStories(stories);
describe('Button', () => {
  it('fires onClick via mouse and keyboard', async () => {
    const fn = vi.fn(); render(<Button onClick={fn}>Go</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    screen.getByRole('button').focus(); await userEvent.keyboard('{Enter}'); await userEvent.keyboard(' ');
    expect(fn).toHaveBeenCalledTimes(3);
  });
  it('loading: aria-busy, text alternative, ignores clicks, stays focusable', async () => {
    const fn = vi.fn(); render(<Button loading loadingText="Saving" onClick={fn}>Save</Button>);
    const b = screen.getByRole('button', { name: /save, saving/i });
    expect(b).toHaveAttribute('aria-busy', 'true'); await userEvent.click(b); expect(fn).not.toHaveBeenCalled();
    expect(b).toHaveFocus(); // click focused it and it was not disabled
    b.blur(); await userEvent.tab(); expect(b).toHaveFocus();
  });
  it('disabled is skipped by tab and does not fire', async () => {
    const fn = vi.fn(); render(<Button disabled onClick={fn}>No</Button>);
    await userEvent.tab(); expect(screen.getByRole('button')).not.toHaveFocus();
    await userEvent.click(screen.getByRole('button')); expect(fn).not.toHaveBeenCalled();
  });
  it('icon-only exposes accessible name', () => { render(<all.IconOnly />); expect(screen.getByRole('button', { name: 'Open basket' })).toBeInTheDocument(); });
  it('defaults to type=button', () => { render(<Button>X</Button>); expect(screen.getByRole('button')).toHaveAttribute('type', 'button'); });
  describe.each(Object.entries(all))('axe: %s', (name, Story) => {
    it('has no violations', async () => { const { container } = render(<Story />); expect(await axe(container)).toHaveNoViolations(); });
  });
});
