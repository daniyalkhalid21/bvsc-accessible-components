import type { Meta, StoryObj } from '@storybook/react';
import { DemoPage } from './DemoPage';
const meta: Meta<typeof DemoPage> = { title: 'Pages/Demo catalogue page', component: DemoPage, parameters: { layout: 'fullscreen', a11y: { config: { rules: [{ id: 'landmark-one-main', enabled: true }, { id: 'page-has-heading-one', enabled: true }, { id: 'region', enabled: true }] } } } };
export default meta;
export const Catalogue: StoryObj<typeof DemoPage> = {};
