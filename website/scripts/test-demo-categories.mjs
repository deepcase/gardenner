import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium,expect} from '../../packages/css/node_modules/@playwright/test/index.mjs';
import {writeFile} from '../../scripts/fs-retry.mjs';
const root=new URL('../../',import.meta.url),base=process.env.WEBSITE_URL||'http://127.0.0.1:4188/website';
const categories=JSON.parse(await readFile(new URL('website/showcase/categories.json',root),'utf8'));
const components=JSON.parse(await readFile(new URL('packages/css/metadata/components.json',root),'utf8')).components;
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(90000);const rows=[];
try{
 await page.goto(base+'/zh-CN/docs.html?category=form#component-demos');
 await page.waitForFunction(()=>['vue','react','angular','blazor'].every(id=>document.querySelector('#'+id+'-component-catalog')?.childElementCount===575));
 const expected=categories.map(item=>({value:item.id,label:item.label}));
 for(const selector of ['[data-demo-category]',...['','vue-','react-','angular-','blazor-'].map(id=>'#'+id+'component-category')]){
  const actual=await page.locator(selector+' option').evaluateAll(options=>options.filter(option=>option.value).map(option=>({value:option.value,label:option.textContent})));
  assert.deepEqual(actual,expected,selector+' must match Demo category labels and order');
 }
 assert.equal(await page.locator('[data-demo-category-link]').count(),categories.length);
 for(const category of categories){
  const count=components.filter(item=>item.category===category.id).length;
  for(const prefix of ['','vue-','react-','angular-','blazor-']){
   await page.locator('#'+prefix+'component-category').selectOption(category.id);
   await expect(page.locator('#'+prefix+'component-catalog > details')).toHaveCount(count);
  }
  const nav=page.locator('[data-demo-category-link="'+category.id+'"]');await expect(nav.locator('small')).toHaveText(String(count));
  rows.push({category:category.id,label:category.label,components:count,passed:true});
 }
 await page.locator('[data-demo-category-link="media"]').click();
 await expect(page.locator('[data-demo-category]')).toHaveValue('media');
 await expect(page).toHaveURL(/category=media/);
 const selected=await page.locator('[data-demo-picker]').inputValue();assert.equal(components.find(item=>item.name===selected).category,'media');
 await page.reload();await page.waitForFunction(()=>document.querySelector('[data-demo-category]')?.options.length===26);await expect(page.locator('[data-demo-category]')).toHaveValue('media');
 await page.locator('[data-demo-search]').fill('GCarousel');await expect(page.locator('[data-demo-picker]')).toHaveValue('carousel');
 await page.locator('[data-demo-category-link="form"]').click();
 await page.locator('#component-demos').evaluate(el=>el.scrollIntoView({block:'start'}));
 await page.screenshot({path:new URL('docs/release-2.2/website-demo-integration/categories-desktop.png',root).pathname.replace(/^\/([A-Z]:)/,'$1')});
 await page.setViewportSize({width:390,height:1000});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
 await page.locator('[data-demo-category]').selectOption('disclosure');await expect(page.locator('[data-demo-picker] option')).toHaveCount(components.filter(item=>item.category==='disclosure').length);
 await writeFile(new URL('docs/release-2.2/website-demo-integration/categories.json',root),JSON.stringify({passed:true,categories:categories.length,components:components.length,selectors:6,deepLinks:true,narrowScreen:true,results:rows},null,2)+'\n');
 console.log('Demo categories synchronized: '+categories.length+' groups, 575 components, six filters, sidebar and deep links.');
}finally{await browser.close();}
