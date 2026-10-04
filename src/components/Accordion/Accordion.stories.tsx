import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';
export const faqItems = [
  { id: 'delivery', title: 'How fast is delivery?', content: <p>Standard delivery takes 3 to 5 working days. Cold-chain items such as vaccines ship next day.</p> },
  { id: 'returns', title: 'Can I return opened products?', content: <p>Sealed products can be returned within 30 days. Opened syringes and medicines cannot be returned for safety reasons.</p> },
  { id: 'bulk', title: 'Do you offer clinic bulk pricing?', content: <p>Yes. Orders over 50 units of any consumable get 10% off. Contact us for a standing order.</p> },
];
const meta: Meta<typeof Accordion> = { title: 'Components/Accordion', component: Accordion, excludeStories: /^(faqItems)$/, args: { items: faqItems } };
export default meta;
type S = StoryObj<typeof Accordion>;
export const Default: S = {};
export const SingleOpen: S = { args: { allowMultiple: false, defaultOpen: ['delivery'] } };
export const AllOpen: S = { args: { defaultOpen: ['delivery', 'returns', 'bulk'] } };
