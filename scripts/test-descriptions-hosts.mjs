import {chromium,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import AxeBuilder from '../packages/css/node_modules/@axe-core/playwright/dist/index.mjs';
import {readFileSync} from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const browser=await chromium.launch(),context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto('http://127.0.0.1:5192/descriptions');const root=page.locator('.g-descriptions');await expect(root.locator('.g-desc-value')).toHaveCount(4);
 await page.getByLabel('布局').selectOption('vertical');await expect(root).toHaveClass(/g-desc-vertical/);await expect(root.locator('tr')).toHaveCount(4);
 await page.getByLabel('尺寸').selectOption('mini');await expect(root.locator('th').first()).toHaveCSS('font-size','12px');await page.getByLabel('边框').uncheck();await expect(root).not.toHaveClass(/g-desc-bordered/);
 await page.setViewportSize({width:390,height:800});await expect(root.locator('tr')).toHaveCount(8);expect((await new AxeBuilder({page}).include('.g-descriptions').analyze()).violations).toEqual([]);
 await page.goto('http://127.0.0.1:4188/website/docs.html#descriptions-data-mode');await page.locator('#descriptions-data-mode').scrollIntoViewIfNeeded();const frame=page.frameLocator('#descriptions-data-mode iframe');await expect(frame.locator('#basic .g-desc-value')).toHaveCount(6);await frame.locator('#layout').selectOption('inline-vertical');await expect(frame.locator('#basic .g-descriptions')).toHaveClass(/g-desc-inline-vertical/);await frame.getByLabel('边框',{exact:true}).check();await expect(frame.locator('#basic .g-descriptions')).toHaveClass(/g-desc-bordered/);
 expect(errors).toEqual([]);for(const name of ['gardener.runtime.min.js','gardener.min.css','data-display.js','descriptions.js'])expect(readFileSync('packages/css/dist/'+name).equals(readFileSync('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+name))).toBe(true);
 await writeFile('docs/descriptions/hosts.json',JSON.stringify({blazor:true,website:true,staticAssetIdentity:true,errors},null,2));console.log('Descriptions Blazor, website and static assets passed');
}finally{await browser.close();}
