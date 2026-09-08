import assert from 'node:assert/strict';
import { chromium, firefox, webkit, expect } from '../../packages/css/node_modules/@playwright/test/index.mjs';
import { writeFile } from '../../scripts/fs-retry.mjs';
const base=process.env.WEBSITE_URL || 'http://127.0.0.1:4188/website'; const results=[];
for(const [name,type] of Object.entries({chromium,firefox,webkit})){
 const browser=await type.launch(name==='firefox'&&process.platform==='win32'?{executablePath:process.env.GARDENER_FIREFOX_EXECUTABLE||'D:/develop/Gardener/.disclosure-firefox/firefox-1538/firefox/firefox.exe'}:{});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}); page.setDefaultTimeout(90000);
 const errors=[],failures=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base)) failures.push(r.url());});
 await page.goto(base+'/zh-CN/docs.html?demo=table#component-demos');
 await page.waitForFunction(()=>['vue','react','angular','blazor'].every(id=>document.querySelector('#'+id+'-component-catalog')?.childElementCount===575));
 await expect(page.locator('[data-demo-picker] option')).toHaveCount(575);
 await page.locator('#component-demos').scrollIntoViewIfNeeded();
 async function frameReady(component){
  await expect(page.locator('[data-demo-stage] iframe')).toHaveAttribute('data-component',component);
  const frame=await (await page.locator('[data-demo-stage] iframe').elementHandle()).contentFrame();
  await frame.waitForFunction(()=>document.documentElement.dataset.showcaseReady==='true'); return frame;
 }
 let frame=await frameReady('table');
 await frame.locator('.table-controls select').first().selectOption('mini');
 await expect(frame.locator('[data-table-size="mini"]').first()).toBeVisible();
 await frame.locator('.table-controls input[type="checkbox"]').first().check();
 await expect(frame.locator('[data-table-stripe="true"]').first()).toBeVisible();
 await frame.locator('.embedded-source summary').click();
 await expect(frame.locator('.embedded-source code')).toContainText('GardenerimTableOptions');
 await page.locator('[data-demo-width]').selectOption('390');
 await expect.poll(()=>page.locator('[data-demo-stage]').evaluate(el=>Math.round(el.getBoundingClientRect().width)),{timeout:30000}).toBe(390);
 await expect.poll(()=>frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),{timeout:30000}).toBe(true);
 await page.locator('[data-demo-reset]').click(); frame=await frameReady('table');
 await expect(frame.locator('.table-controls select').first()).toHaveValue('large');
 await page.locator('[data-demo-search]').fill('zzzznoresult');
 await expect(page.locator('[data-demo-picker]')).toBeDisabled(); await expect(page.locator('[data-demo-stage] iframe')).toHaveCount(0);
 await page.locator('[data-demo-search]').fill(''); await expect(page.locator('[data-demo-picker] option')).toHaveCount(575);
 await page.locator('[data-demo-category]').selectOption('media');
 assert.ok(await page.locator('[data-demo-picker] option').count()<575);
 await page.locator('[data-demo-picker]').selectOption('carousel'); frame=await frameReady('carousel');
 await expect.poll(()=>frame.locator('img').evaluateAll(imgs=>imgs.some(img=>img.complete&&img.naturalWidth>0)),{timeout:30000}).toBe(true);
 assert.equal(new URL(await page.locator('[data-demo-external]').getAttribute('href')).pathname,'/website/showcase/embed.html');
 await page.locator('[data-demo-width]').selectOption('auto');
 for(const id of ['','vue-','react-','angular-','blazor-']){
  await page.locator('#'+id+'component-search').fill('button');
  const action=page.locator('#'+id+'component-catalog [data-component-demo="button"]');
  await action.locator('xpath=ancestor::details').locator('summary').click();
  await action.click(); await frameReady('button');
  await expect(page).toHaveURL(/demo=button#component-demos$/);
 }
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),{timeout:30000}).toBe(true);
 }
 await page.locator('#component-demos').evaluate(el=>el.scrollIntoView({block:'start'}));
 if(name==='chromium') await page.screenshot({path:'docs/release-2.2/website-demo-integration/gallery-mobile.png'});
 assert.deepEqual(errors,[]); assert.deepEqual(failures,[]);
 results.push({engine:name,passed:true,components:575,parameterControls:true,source:true,reset:true,filters:true,fiveCatalogLinks:true,portableMedia:true,widths:[1440,768,390,320]}); console.log(name+': demo interactions passed');
 }finally{await browser.close();}
}
await writeFile('docs/release-2.2/website-demo-integration/interactions.json',JSON.stringify(results,null,2)+'\n');
