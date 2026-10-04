// Scans every story with axe-core and writes docs/AUDIT_LOG.md.
// Mode 1 (preferred): Playwright + @axe-core/playwright against storybook-static.
// Mode 2 (fallback, used when Chromium cannot launch, e.g. sandboxes): vitest-axe in jsdom via src/audit/stories-axe.test.tsx.
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url)); // works on Windows too
const today = new Date().toISOString().slice(0, 10);
// Page-level best-practice rules only make sense for a whole page. A story renders one component in isolation, so they are
// disabled for 'Components/*' stories and kept ON for 'Pages/*' stories (the demo catalogue page).
const PAGE_RULES = ['landmark-one-main', 'page-has-heading-one', 'region'];
let mode = ''; let stories = []; let note = '';

async function viaPlaywright() {
  const { chromium } = await import('playwright'); const { default: AxeBuilder } = await import('@axe-core/playwright');
  const dir = join(root, 'storybook-static'); if (!existsSync(dir)) throw new Error('Run npm run build-storybook first');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
  const srv = createServer((q, s) => { let p = join(dir, normalize(q.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' }); s.end(readFileSync(p)); }).listen(6107);
  const browser = await chromium.launch(); const index = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8'));
  const context = await browser.newContext(); const page = await context.newPage(); const out = []; // AxeBuilder requires a page from newContext()
  for (const e of Object.values(index.entries).filter(e => e.type === 'story')) {
    await page.goto(`http://localhost:6107/iframe.html?id=${e.id}&viewMode=story`, { waitUntil: 'networkidle' });
    let b = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']);
    if (!e.title.startsWith('Pages/')) b = b.disableRules(PAGE_RULES);
    const r = await b.analyze();
    out.push({ component: e.title.replace(/^(Components|Pages)\//, ''), story: e.name, violations: r.violations.map(v => ({ id: v.id, impact: v.impact, description: v.help, nodes: v.nodes.length, element: (v.nodes[0]?.html ?? '').slice(0, 90) })) });
  }
  await browser.close(); srv.close(); return out;
}
function viaVitest() {
  const r = spawnSync('npx', ['vitest', 'run', 'src/audit/stories-axe.test.tsx'], { cwd: root, encoding: 'utf8', shell: true });
  if (!existsSync(join(root, 'docs/.audit-results.json'))) { console.error(r.stdout + r.stderr); throw new Error('fallback scan produced no results'); }
  return JSON.parse(readFileSync(join(root, 'docs/.audit-results.json'), 'utf8')).stories;
}
try { stories = await viaPlaywright(); mode = 'Playwright + @axe-core/playwright (real Chromium, built Storybook)'; }
catch (e) {
  if (process.env.REQUIRE_BROWSER) { console.error('REQUIRE_BROWSER is set but the browser scan failed:', e); process.exit(2); }
  console.warn('Playwright unavailable, falling back to vitest-axe:', String(e.message).split('\n')[0]);
  stories = viaVitest(); mode = 'vitest-axe in jsdom (fallback)';
  note = 'Playwright could not launch Chromium in this environment, so stories were scanned in jsdom. jsdom has no layout engine: the axe **color-contrast** rule, target-size and real focus visibility are NOT evaluated. Contrast is covered by `scripts/contrast-check.mjs` on the design tokens instead. Re-run `npm run build-storybook && npm run audit` on a machine where Chromium installs (for example locally) for the full browser scan.';
}
const baseline = existsSync(join(root, 'docs/audit-baseline.json')) ? JSON.parse(readFileSync(join(root, 'docs/audit-baseline.json'), 'utf8')) : null;
const history = JSON.parse(readFileSync(join(root, 'docs/audit-history.json'), 'utf8'));
const after = stories.flatMap(s => s.violations.map(v => ({ ...s, ...v })));
const sc = (v) => v.filter(x => x.impact === 'serious' || x.impact === 'critical').length;
const rowsHist = history.map(h => `| ${h.date} | ${h.component} | ${h.story} | ${h.rule} | ${h.impact} | ${h.description} | ${h.element ?? '-'} | ${h.status} | ${h.fix} |`);
const rowsNow = after.map(v => `| ${today} | ${v.component} | ${v.story} | ${v.id} | ${v.impact} | ${v.description} | \`${String(v.element ?? '-').replace(/\|/g, '/')}\` | found (open) | none yet |`);
const comps = [...new Set(stories.map(s => s.component))];
const beforeBy = (c) => history.filter(h => h.component === c).reduce((n, h) => n + (h.before_failing_stories ?? 0), 0);
const summary = comps.map(c => { const ss = stories.filter(s => s.component === c); return `| ${c} | ${ss.length} | ${beforeBy(c)} | ${sc(ss.flatMap(s => s.violations))} | ${ss.flatMap(s => s.violations).length} |`; });
const beforeTotal = history.reduce((n, h) => n + (h.before_failing_stories ?? 0), 0);
const md = `# Axe audit log\n\nGenerated ${today} by \`scripts/audit-stories.mjs\`.\n\n**Scan mode:** ${mode}\n\n${note ? `> **Limitation:** ${note}\n\n` : ''}## Result\n\n- Stories scanned: **${stories.length}** across **${comps.length}** component groups\n- BEFORE (first jsdom scan during development): **${beforeTotal}** stories with serious/critical violations (recorded in \`docs/audit-history.json\`)\n${baseline ? `- BEFORE (first real-browser scan, ${baseline.date}): **${baseline.serious_critical}** serious/critical, **${baseline.any}** of any impact (${baseline.note})\n` : ''}- AFTER (this run): **${sc(after)}** serious/critical violations, **${after.length}** violations of any impact\n\n## Rule scoping\n\nThe page-level rules \`landmark-one-main\`, \`page-has-heading-one\` and \`region\` are disabled for isolated component stories (a story is a fragment, not a page) and stay enabled for the Demo catalogue page.\n\n## Findings\n\n| Date | Component | Story | Rule ID | Impact | Description | Element | Status | Fix made |\n|---|---|---|---|---|---|---|---|---|\n${[...rowsHist, ...rowsNow].join('\n')}\n\n## Before vs after per component\n\n| Component | Stories | Stories failing BEFORE | Serious/critical AFTER | All violations AFTER |\n|---|---|---|---|---|\n${summary.join('\n')}\n`;
writeFileSync(join(root, 'docs/AUDIT_LOG.md'), md);
console.log(`mode: ${mode}\nstories: ${stories.length}, serious/critical after: ${sc(after)}, all after: ${after.length}`);
process.exit(sc(after) ? 1 : 0);
