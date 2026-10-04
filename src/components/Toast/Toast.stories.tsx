import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../Button/Button';
function Buttons() {
  const { show } = useToast();
  return (<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <Button onClick={() => show('success', 'Added to basket: Luer-lock syringe 5 ml')}>Add to basket</Button>
    <Button variant="secondary" onClick={() => show('info', 'Prices include VAT.')}>Show info</Button>
    <Button variant="danger" onClick={() => show('error', 'We could not place your order. Check your connection and try again.')}>Trigger error</Button>
  </div>);
}
const meta: Meta = { title: 'Components/Toast', decorators: [(S) => <ToastProvider><S /></ToastProvider>] };
export default meta;
type S = StoryObj;
export const Triggers: S = { render: () => <Buttons /> };
export const EmptyRegions: S = { render: () => <p>The live regions are mounted but empty until a toast is shown.</p> };
