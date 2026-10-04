import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
export const accountItems = [
  { id: 'orders', label: 'My orders' }, { id: 'reorder', label: 'Reorder last basket' }, { id: 'prices', label: 'Clinic price list' },
  { id: 'invoices', label: 'Invoices', disabled: true }, { id: 'signout', label: 'Sign out' },
];
const meta: Meta<typeof Menu> = { title: 'Components/Menu', component: Menu, excludeStories: /^(accountItems)$/, args: { label: 'Account', items: accountItems } };
export default meta;
type S = StoryObj<typeof Menu>;
export const Default: S = {};
export const ShortMenu: S = { args: { label: 'Sort products', items: [{ id: 'n', label: 'Name' }, { id: 'p', label: 'Price' }] } };
