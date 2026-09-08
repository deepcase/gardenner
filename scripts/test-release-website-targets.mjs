import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from '../packages/css/node_modules/@playwright/test/index.mjs';
import { writeFile } from './fs-retry.mjs';
const results = [];
for (const [engine, type] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await type.launch(engine === 'firefox' && process.platform === 'win32'
    ? { executablePath: process.env.GARDENER_FIREFOX_EXECUTABLE || fileURLToPath(new URL('../.disclosure-firefox/firefox-1538/firefox/firefox.exe', import.meta.url)) }
    : {});
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    page.setDefaultNavigationTimeout(90_000);
    for (const viewportWidth of [1280, 390]) {
      await page.setViewportSize({ width: viewportWidth, height: 900 });
      // The complete catalog is large: inspect loaded styles and fonts, not the
      // transient DOMContentLoaded layout while stylesheets are still arriving.
      await page.goto(`${process.env.WEBSITE_URL || 'http://127.0.0.1:4188/website'}/en/docs.html`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => ['vue', 'react', 'angular', 'blazor'].every(id => document.querySelector(`#${id}-component-catalog`)?.childElementCount >= 575), null, { timeout: 90_000 });
      const link = page.locator('#interaction-components > a').first();
      await link.evaluate(a => a.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.ok(!(await page.locator('#angular-component-catalog summary code').first().innerText()).includes('&quot;'), 'Import snippets must escape quotes exactly once');
      const state = await link.evaluate(a => {
        const rect = a.getBoundingClientRect();
        return { targetHeight: rect.height, targetWidth: rect.width, scrollWidth: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth + 2 };
      });
      const result = { engine, viewportWidth, ...state, passed: state.targetHeight >= 24 && !state.overflow };
      results.push(result);
      console.log(JSON.stringify(result));
    }
  } finally { await browser.close(); }
}
await writeFile(new URL('../docs/release-2.2/website-link-targets.json', import.meta.url), JSON.stringify({ version: '2.2.0', passed: results.every(row => row.passed), results }, null, 2) + '\n');
assert.ok(results.every(row => row.passed), 'Loaded documentation links must have usable targets and remain within the viewport');
