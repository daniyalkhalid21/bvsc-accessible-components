import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from './SkipLink';
const meta: Meta<typeof SkipLink> = { title: 'Components/SkipLink', component: SkipLink };
export default meta;
export const Default: StoryObj<typeof SkipLink> = {
  render: () => (<><SkipLink targetId="sl-main" /><p>Press Tab once to reveal the link.</p><main id="sl-main" tabIndex={-1}><h1>Catalogue</h1></main></>),
};
