import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit, expect } from '../../packages/css/node_modules/@playwright/test/index.mjs';
import { writeFile } from '../../scripts/fs-retry.mjs';
const base = process.env.WEBSITE_URL || 'http://127.0.0.1:4188/website';
const results = [];
for (const [engine, type] of Object.entries({ chromium, firefox, webkit })) {
  if (process.argv.length > 2 && !process.argv.slice(2).includes(engine)) continue;
  const browser = await type.launch(engine === 'firefox' && process.platform === 'win32'
    ? { executablePath: process.env.GARDENER_FIREFOX_EXECUTABLE || fileURLToPath(new URL('../../.disclosure-firefox/firefox-1538/firefox/firefox.exe', import.meta.url)) } : {});
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(90_000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const name of ['docs', 'index']) {
      await page.goto(`${base}/en/${name}.html`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('meta[name="gardenerim-version"]').getAttribute('content'), '2.2.0');
      await expect(page.locator('[data-site-version]')).toHaveText('v2.2.0');
      if (name === 'docs') await page.waitForFunction(() => ['vue', 'react', 'angular', 'blazor'].every(id => document.querySelector(`#${id}-component-catalog`)?.childElementCount === 575));
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        // WebKit may spend several seconds reflowing all four complete API catalogs.
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), { timeout: 30_000 }).toBe(true).catch(async error => {
          console.error('Overflow', engine, name, width, await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, elements: [...document.querySelectorAll('body *')].filter(e => {
            if (e.getBoundingClientRect().right <= innerWidth + 2) return false;
            for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(a).overflowX)) return false;
            return true;
          }).slice(0, 8).map(e => ({ element: e.tagName + '.' + e.className, text: e.textContent.slice(0, 40), right: e.getBoundingClientRect().right })) })));
          throw error;
        });
        const layout = await page.evaluate(() => {
          const header = document.querySelector('.site-nav');
          return { scrollWidth: document.documentElement.scrollWidth, headerWidth: header.clientWidth, headerScrollWidth: header.scrollWidth };
        });
        assert.ok(layout.headerScrollWidth <= layout.headerWidth + 2, JSON.stringify({ engine, name, width, layout }));
        results.push({ engine, page: name, width, ...layout, passed: true });
      }
      if (name === 'docs') {
        await page.locator('#docs-jump').selectOption('#vue');
        await expect.poll(() => page.evaluate(() => location.hash)).toBe('#vue');
        await expect.poll(() => page.locator('#vue').evaluate(element => element.getBoundingClientRect().top >= document.querySelector('.docs-sidebar').getBoundingClientRect().bottom - 2)).toBe(true);
        await page.locator('#vue-component-search').fill('GButton');
        await expect.poll(() => page.locator('#vue-component-catalog > details').count()).toBeLessThan(575);
        assert.ok(await page.locator('#vue-component-catalog > details').count());
        await page.locator('#vue-component-catalog summary').first().click();
        await expect(page.locator('#vue-component-catalog > details').first()).toHaveAttribute('open', '');
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.locator('.docs-sidebar-link[href="#quick-start"]').click();
        await expect(page.locator('.docs-sidebar-link[href="#quick-start"]')).toHaveAttribute('aria-current', 'location');
        results.push({ engine, page: name, navigation: true, filter: true, expansion: true, passed: true });
      }
      assert.deepEqual(errors, []);
      console.log(`${engine}: ${name} version, five widths${name === 'docs' ? ', navigation, filter and expansion' : ''} passed.`);
    }
  } finally { await browser.close(); }
}
await writeFile(new URL(`../../docs/release-2.2/website-gallery/results${process.argv.length > 2 ? '-' + process.argv.slice(2).join('-') : ''}.json`, import.meta.url), JSON.stringify({ version: '2.2.0', passed: true, results }, null, 2) + '\n');
