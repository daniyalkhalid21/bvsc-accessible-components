import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { axe } from 'vitest-axe';
import { TextInput, Select, Checkbox, RadioGroup, Textarea } from './FormField';
import * as stories from './FormField.stories';
const { OrderEnquiryForm, ...storyExports } = stories as any;
const all = composeStories(storyExports);
describe('FormField set', () => {
  it('TextInput: label, hint and error wired via aria-describedby; aria-invalid', () => {
    render(<TextInput label="Email" hint="Receipt goes here" error="Bad email" required />);
    const i = screen.getByLabelText(/email/i);
    expect(i).toHaveAccessibleDescription(/receipt goes here.*error: bad email/i);
    expect(i).toHaveAttribute('aria-invalid', 'true'); expect(i).toBeRequired();
  });
  it('error is text, not colour only (visually-hidden "Error:" prefix + icon)', () => {
    render(<TextInput label="X" error="Nope" />); expect(screen.getByText(/error:/i)).toBeInTheDocument();
  });
  it('no aria-invalid when valid', () => { render(<TextInput label="X" />); expect(screen.getByLabelText('X')).not.toHaveAttribute('aria-invalid'); });
  it('Textarea is labelled and typeable', async () => { render(<Textarea label="Msg" />); await userEvent.type(screen.getByLabelText('Msg'), 'hello'); expect(screen.getByLabelText('Msg')).toHaveValue('hello'); });
  it('Select is operable by keyboard', async () => {
    render(<Select label="Cat" options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />);
    await userEvent.selectOptions(screen.getByLabelText('Cat'), 'b'); expect(screen.getByLabelText('Cat')).toHaveValue('b');
  });
  it('Checkbox toggles with Space', async () => { render(<Checkbox label="Remind me" />); await userEvent.tab(); await userEvent.keyboard(' '); expect(screen.getByRole('checkbox', { name: 'Remind me' })).toBeChecked(); });
  it('RadioGroup uses fieldset/legend, arrow keys move selection', async () => {
    render(<RadioGroup legend="Speed" name="s" hint="Hint" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />);
    const g = screen.getByRole('group', { name: 'Speed' }); expect(g).toHaveAccessibleDescription('Hint');
    await userEvent.tab(); await userEvent.keyboard('{ArrowDown}');
    expect(within(g).getByRole('radio', { name: 'B' })).toBeChecked();
  });
  describe('Order enquiry form', () => {
    it('shows summary, focuses it, marks fields invalid and links to them', async () => {
      render(<OrderEnquiryForm />); await userEvent.click(screen.getByRole('button', { name: /send enquiry/i }));
      const summary = await screen.findByRole('group', { name: /5 problems/i });
      await vi.waitFor(() => expect(summary).toHaveFocus());
      expect(screen.getByLabelText(/your name/i)).toHaveAttribute('aria-invalid', 'true');
      expect(within(summary).getByRole('link', { name: /enter your name/i })).toHaveAttribute('href', '#enq-name');
    });
    it('submits successfully when valid and announces via status', async () => {
      render(<OrderEnquiryForm />); const u = userEvent.setup();
      await u.type(screen.getByLabelText(/your name/i), 'Sam Lee'); await u.type(screen.getByLabelText(/^email/i), 'sam@clinic.org');
      await u.selectOptions(screen.getByLabelText(/product category/i), 'feed'); await u.click(screen.getByRole('radio', { name: /express/i }));
      await u.type(screen.getByLabelText(/message/i), 'Need 20 bags of electrolyte feed.');
      await u.click(screen.getByRole('button', { name: /send enquiry/i }));
      expect(await screen.findByRole('status')).toHaveTextContent(/thank you/i);
    });
  });
  describe.each([...Object.entries(all), ['OrderEnquiryForm', () => <OrderEnquiryForm />] as any])('axe: %s', (_n, Story: any) => {
    it('has no violations', async () => { const { container } = render(<Story />); expect(await axe(container)).toHaveNoViolations(); });
  });
  it('axe: order form in error state', async () => {
    const { container } = render(<OrderEnquiryForm />); await userEvent.click(screen.getByRole('button', { name: /send enquiry/i }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
