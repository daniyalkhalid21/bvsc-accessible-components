// Fallback story scanner: renders EVERY story in jsdom and runs axe-core. Writes docs/.audit-results.json.
// Used by scripts/audit-stories.mjs when Playwright/Chromium is unavailable.
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { writeFileSync } from 'node:fs';
import { axe } from 'vitest-axe';

const mods = import.meta.glob('/src/**/*.stories.tsx', { eager: true }) as Record<string, any>;
const results: any[] = [];
const rows: [string, string, any][] = [];
for (const [path, mod] of Object.entries(mods)) {
  const storyOnly: Record<string, any> = { default: mod.default };
  for (const [k, v] of Object.entries(mod)) if (k !== 'default' && v && typeof v === 'object' && !Array.isArray(v)) storyOnly[k] = v;
  const composed = composeStories(storyOnly as any) as Record<string, any>;
  const component = mod.default.title.replace(/^(Components|Pages)\//, '');
  for (const [name, Story] of Object.entries(composed)) rows.push([component, name, Story]);
}
describe('story scan (all stories)', () => {
  it.each(rows.map(r => [r[0], r[1], r[2]]))('%s / %s', async (component, story, Story: any) => {
    const { container, unmount } = render(<Story />);
    const r = await axe(document.body, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }, rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
    results.push({ component, story, violations: r.violations.map(v => ({ id: v.id, impact: v.impact, description: v.help, nodes: v.nodes.length })) });
    void container; unmount();
    expect(r.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
  });
  afterAll(() => writeFileSync('docs/.audit-results.json', JSON.stringify({ mode: 'vitest-axe (jsdom)', stories: results }, null, 1)));
});
