import assert from 'node:assert/strict';
import {chromium,firefox,webkit,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import AxeBuilder from '../packages/css/node_modules/@axe-core/playwright/dist/index.mjs';
import {layoutModes} from '../packages/css/src/js/layout.js';
import {writeFile} from './fs-retry.mjs';
const engine=process.env.LAYOUT_BROWSER||'chromium',browser=await ({chromium,firefox,webkit})[engine].launch(),context=await browser.newContext({viewport:{width:1100,height:850}}),page=await context.newPage(),errors=[],checks=[],a11y=[];
page.on('pageerror',e=>errors.push(e.message));
let themeMode='light';
const open=async(kind,mode,params={})=>{await page.goto('http://127.0.0.1:4180/preview.html?'+new URLSearchParams({component:kind,variant:mode,mode:themeMode,...Object.fromEntries(Object.entries(params).map(([k,v])=>['layout-'+k,String(v)]))}));await page.waitForSelector('html[data-demo-ready=true]');return page.locator('[data-demo-component]');};
const change=async(root,patch)=>{await root.evaluate((el,patch)=>{el.dataset.gLayoutOptions=JSON.stringify({...JSON.parse(el.dataset.gLayoutOptions),...patch});},patch);};
const columns=async root=>(await root.evaluate(el=>getComputedStyle(el).gridTemplateColumns)).split(' ').length;
try{
  let root=await open('app-shell','sidebar');assert.equal(await columns(root),2,'shell has no phantom track');
  await change(root,{mode:'double-sidebar'});await expect(root).toHaveAttribute('data-g-layout-mode','double-sidebar');assert.equal(await columns(root),3);
  await page.getByLabel('工作备注').fill('preserved layout draft');await change(root,{paddingBlock:4,paddingInline:12,maxHeight:240});
  await expect(root.locator('.g-app-shell-main')).toHaveCSS('padding-top','4px');await expect(root.locator('.g-app-shell-main')).toHaveCSS('padding-left','12px');await expect(root).toHaveCSS('max-height','240px');assert.ok(await root.evaluate(el=>el.clientHeight<=240));await expect(root).toHaveAttribute('tabindex','0');
  await expect(page.getByLabel('工作备注')).toHaveValue('preserved layout draft');
  await change(root,{collapsible:false});await expect(root.locator('[data-g-layout-toggle]')).toBeDisabled();
  await change(root,{collapsible:true,closeOnEscape:false});const link=root.locator('[data-g-layout-panel] a').first();await link.focus();await page.keyboard.press('Escape');await expect(root.locator('[data-g-layout-panel]')).toBeVisible();
  await change(root,{closeOnEscape:true});await page.keyboard.press('Escape');await expect(root.locator('[data-g-layout-panel]')).toBeHidden();await expect(root.locator('[data-g-layout-toggle]')).toBeFocused();checks.push('shell tracks, logical padding, bounded scroll, preserved draft, collapse and focus policies');
  root=await open('dashboard','four-column',{columns:5,autoRows:120,align:'stretch',justifyItems:'end',alignContent:'center'});assert.equal(await columns(root),5);await expect(root).toHaveCSS('grid-auto-rows','120px');await expect(root).toHaveCSS('justify-items','end');await expect(root).toHaveCSS('align-content','center');
  await page.setViewportSize({width:320,height:850});await change(root,{narrowColumns:2});await expect(root).toHaveAttribute('data-g-layout-narrow','true');await expect.poll(()=>columns(root)).toBe(2);assert.equal(await root.evaluate(el=>el.scrollWidth>el.clientWidth+1),false);checks.push('explicit columns, row height, alignment and narrow columns');
  root=await open('classic-layout-primitives','bento');assert.equal(await columns(root),1);await change(root,{narrowColumns:2});assert.equal(await columns(root),2);assert.equal(await root.evaluate(el=>el.scrollWidth>el.clientWidth+1),false);checks.push('Bento has no leftover narrow tracks');
  root=await open('page-header','compact');await expect(root).toHaveCSS('padding-top','8px');await expect(root).toHaveCSS('padding-left','12px');await change(root,{padding:24,justify:'end'});await expect(root).toHaveCSS('padding-top','24px');await expect(root).toHaveCSS('justify-content','end');checks.push('compact defaults and explicit padding');
  await page.setViewportSize({width:1100,height:850});root=await open('responsive-container','reading',{maxWidth:640});await expect(root).toHaveCSS('max-width','640px');checks.push('reading width override');
  root=await open('grid-system','rtl',{direction:'ltr'});await expect(root).toHaveCSS('direction','ltr');checks.push('explicit direction overrides RTL default');
  themeMode='dark';
  for(const kind of Object.keys(layoutModes)){
    await page.setViewportSize({width:320,height:850});root=await open(kind,layoutModes[kind][0],{direction:'rtl'});await expect(page.locator('html')).toHaveAttribute('data-g-mode','dark');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,kind+' dark RTL overflow');
    if(engine==='chromium'){const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],kind+' dark accessibility');a11y.push(kind);}
  }
  await page.screenshot({path:'docs/layout/release-review/'+engine+'-dark.png',fullPage:true});
  await page.setViewportSize({width:1100,height:850});root=await open('app-shell','double-sidebar',{maxHeight:240});await page.emulateMedia({media:'print'});await expect(root).toHaveCSS('max-height','none');await expect(root).toHaveCSS('display','block');checks.push('printing releases the bounded height');
  assert.deepEqual(errors,[]);await writeFile('docs/layout/release-review/extensions-'+engine+'.json',JSON.stringify({engine,newParameters:10,checks,darkRtl:11,a11y,errors},null,2));console.log(engine+': layout release extensions passed');
}finally{await browser.close();}
