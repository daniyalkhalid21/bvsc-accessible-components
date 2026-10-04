import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextInput, Select, Checkbox, RadioGroup, Textarea } from './FormField';
import { Button } from '../Button/Button';

const meta: Meta = { title: 'Components/FormField', excludeStories: /^(OrderEnquiryForm)$/, };
export default meta;
type S = StoryObj;

export const TextInputDefault: S = { render: () => <TextInput label="Clinic name" hint="As it appears on your account" /> };
export const TextInputError: S = { render: () => <TextInput label="Email" type="email" required defaultValue="sam@" error="Enter an email address like name@example.com." hint="We send the order receipt here" /> };
export const SelectDefault: S = { render: () => <Select label="Product category" placeholder="Choose a category" options={[{ value: 'syringes', label: 'Syringes and needles' }, { value: 'feed', label: 'Feed supplements' }, { value: 'grooming', label: 'Grooming tools' }, { value: 'health', label: 'Pet health' }]} /> };
export const CheckboxDefault: S = { render: () => <Checkbox label="Send me restock reminders" hint="At most one email a month" /> };
export const RadioGroupDefault: S = { render: () => { const [v, setV] = useState('standard'); return <RadioGroup legend="Delivery speed" name="delivery" hint="Cold-chain items ship express only" value={v} onChange={setV} options={[{ value: 'standard', label: 'Standard (3 to 5 days)' }, { value: 'express', label: 'Express (next day)' }]} />; } };
export const RadioGroupError: S = { render: () => <RadioGroup legend="Delivery speed" name="delivery2" required error="Choose a delivery speed." options={[{ value: 'standard', label: 'Standard (3 to 5 days)' }, { value: 'express', label: 'Express (next day)' }]} /> };
export const TextareaDefault: S = { render: () => <Textarea label="Message" hint="Include animal species and weight if relevant" /> };

type Errors = Partial<Record<'name' | 'email' | 'category' | 'delivery' | 'message', string>>;
export function OrderEnquiryForm({ onValid }: { onValid?: () => void }) {
  const [errors, setErrors] = useState<Errors>({}); const [sent, setSent] = useState(false);
  const [delivery, setDelivery] = useState(''); const summaryRef = React.useRef<HTMLDivElement>(null);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const d = new FormData(e.currentTarget); const next: Errors = {};
    if (!String(d.get('name') || '').trim()) next.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(String(d.get('email') || ''))) next.email = 'Enter an email address like name@example.com.';
    if (!d.get('category')) next.category = 'Choose a product category.';
    if (!delivery) next.delivery = 'Choose a delivery speed.';
    if (String(d.get('message') || '').trim().length < 10) next.message = 'Tell us a little more (at least 10 characters).';
    setErrors(next); setSent(false);
    if (Object.keys(next).length) setTimeout(() => summaryRef.current?.focus(), 0); else { setSent(true); onValid?.(); }
  };
  const ids: Record<string, string> = { name: 'enq-name', email: 'enq-email', category: 'enq-category', message: 'enq-message' };
  return (
    <form noValidate onSubmit={submit} aria-labelledby="enq-title" style={{ maxWidth: '36rem' }}>
      <h2 id="enq-title">Order enquiry</h2>
      {Object.keys(errors).length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="group" aria-labelledby="enq-sum" className="bv-summary">
          <h3 id="enq-sum">There are {Object.keys(errors).length} problems with your enquiry</h3>
          <ul>{Object.entries(errors).map(([k, m]) => <li key={k}>{ids[k] ? <a href={`#${ids[k]}`}>{m}</a> : m}</li>)}</ul>
        </div>
      )}
      {sent && <p role="status" className="bv-summary bv-summary--ok">Thank you. We will reply within one working day.</p>}
      <TextInput id="enq-name" name="name" label="Your name" required autoComplete="name" error={errors.name} />
      <TextInput id="enq-email" name="email" type="email" label="Email" required autoComplete="email" hint="We send the reply here" error={errors.email} />
      <Select id="enq-category" name="category" label="Product category" required placeholder="Choose a category" error={errors.category} options={[{ value: 'syringes', label: 'Syringes and needles' }, { value: 'feed', label: 'Feed supplements' }, { value: 'grooming', label: 'Grooming tools' }, { value: 'health', label: 'Pet health' }]} />
      <RadioGroup legend="Delivery speed" name="delivery" required value={delivery} onChange={setDelivery} error={errors.delivery} options={[{ value: 'standard', label: 'Standard (3 to 5 days)' }, { value: 'express', label: 'Express (next day)' }]} />
      <Textarea id="enq-message" name="message" label="Message" required hint="Include quantities and animal species" error={errors.message} />
      <Checkbox label="Send me restock reminders" name="reminders" />
      <Button type="submit">Send enquiry</Button>
    </form>
  );
}
export const OrderEnquiry: S = { render: () => <OrderEnquiryForm /> };
