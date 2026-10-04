import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { SkipLink } from './SkipLink';
const Page = () => (<><SkipLink targetId="m" /><main id="m" tabIndex={-1}><h1>Catalogue</h1></main></>);
describe('SkipLink', () => {
  it('is the first tab stop and links to main', async () => {
    render(<Page />); await userEvent.tab();
    expect(screen.getByRole('link', { name: /skip to main/i })).toHaveFocus();
    expect(screen.getByRole('link')).toHaveAttribute('href', '#m');
  });
  it('has no axe violations', async () => { const { container } = render(<Page />); expect(await axe(container)).toHaveNoViolations(); });
});
