import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
export const productTabs = [
  { id: 'desc', label: 'Description', content: <p>Sterile 5 ml luer-lock syringes, individually packed. Suitable for cattle, sheep and horses.</p> },
  { id: 'dose', label: 'Dosage', content: <p>Use as directed by your veterinarian. Discard after a single use.</p> },
  { id: 'storage', label: 'Storage', content: <p>Store below 25 degrees Celsius, away from direct sunlight.</p> },
];
const meta: Meta<typeof Tabs> = { title: 'Components/Tabs', component: Tabs, excludeStories: /^(productTabs)$/, args: { tabs: productTabs, label: 'Product information' } };
export default meta;
type S = StoryObj<typeof Tabs>;
export const Default: S = {};
export const SecondTabSelected: S = { args: { defaultTab: 'dose' } };
