import assert from 'node:assert/strict';
import{chromium,firefox,webkit,expect}from'../../packages/css/node_modules/@playwright/test/index.mjs';
import{writeFile}from'../../scripts/fs-retry.mjs';
const base=process.env.WEBSITE_URL||'http://127.0.0.1:4188/website';const results=[];
for(const[engine,type]of Object.entries({chromium,firefox,webkit})){
 const browser=await type.launch(engine==='firefox'&&process.platform==='win32'?{executablePath:'D:/develop/Gardener/.disclosure-firefox/firefox-1538/firefox/firefox.exe'}:{});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.setDefaultTimeout(90000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/zh-CN/index.html');await page.locator('#site-menu > a[href="./components.html"]').click();
  await expect(page).toHaveURL(/zh-CN\/components.html$/);await expect(page.locator('[data-demo-picker] option')).toHaveCount(575,{timeout:30000});
  await expect(page.locator('[data-demo-category-link]')).toHaveCount(25);await expect(page.locator('h1')).toHaveText('组件');
  await expect(page.locator('[data-component-api] h3')).toHaveText('GTable');
  for(const framework of ['vue','react','angularjs','blazor','css']){
   await page.locator('[data-component-api-framework]').selectOption(framework);
   await expect.poll(()=>page.locator('[data-component-api-docs]').getAttribute('href')).toContain('#'+({css:'components',angularjs:'angular'}[framework]||framework));
   await expect(page.locator('[data-component-api]')).toContainText('striped');
  }
  await page.locator('[data-demo-category-link="form"]').click();await expect(page.locator('[data-demo-picker] option')).toHaveCount(54);
  await page.locator('[data-demo-picker]').selectOption('input');await expect(page.locator('[data-component-api] h3')).toHaveText('GInput');
  await page.locator('[data-demo-search]').fill('zzzzzz-notfound');await expect(page.locator('[data-demo-picker]')).toBeDisabled();await expect(page.locator('[data-component-api]')).toBeEmpty();
  await page.locator('[data-demo-search]').fill('');await expect(page.locator('[data-demo-picker] option')).toHaveCount(54);
  await page.locator('[data-demo-picker]').selectOption('input');
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:1000});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),{timeout:30000}).toBe(true);
  }
  await page.locator('[data-site-menu]').click();await expect(page.locator('#site-menu > a[href="./components.html"]')).toBeVisible();await page.locator('[data-site-menu]').click();
  await page.locator('[data-site-language]').selectOption('en');await page.waitForURL(/en\/components.html/);await expect(page.locator('h1')).toHaveText('Component');
  await expect(page.locator('[data-demo-category]')).toHaveValue('form',{timeout:30000});await expect(page.locator('[data-demo-picker]')).toHaveValue('input');
  if(engine==='chromium'){await page.screenshot({path:'docs/release-2.2/website-demo-integration/components-mobile.png'});await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/zh-CN/components.html?category=form&demo=input');await page.locator('[data-demo-stage] iframe').waitFor();const frame=await(await page.locator('[data-demo-stage] iframe').elementHandle()).contentFrame();await frame.waitForFunction(()=>document.documentElement.dataset.showcaseReady==='true');await page.screenshot({path:'docs/release-2.2/website-demo-integration/components-desktop.png'});}
  assert.deepEqual(errors,[]);results.push({engine,passed:true,topLevelMenu:true,categories:25,components:575,fiveApis:true,languageSwitch:true,widths:[1440,768,390,320]});console.log(engine+': independent component page passed');
 }finally{await browser.close();}
}
await writeFile('docs/release-2.2/website-demo-integration/components-page.json',JSON.stringify(results,null,2)+'\n');
