import type { Preview } from '@storybook/react';
import '../src/tokens.css';
const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    // Page-level rules do not apply to a component rendered alone; the Pages/* story turns them back on.
    a11y: { config: { rules: [{ id: 'landmark-one-main', enabled: false }, { id: 'page-has-heading-one', enabled: false }, { id: 'region', enabled: false }] } },
  },
};
export default preview;
