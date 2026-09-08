import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium,firefox,webkit,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import AxeBuilder from '../packages/css/node_modules/@axe-core/playwright/dist/index.mjs';
import {writeFile} from './fs-retry.mjs';
const engine=process.env.INTERACTION_BROWSER||'chromium',browser=await ({chromium,firefox,webkit})[engine].launch(),context=await browser.newContext({viewport:{width:1080,height:900}}),page=await context.newPage(),errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
const components=JSON.parse(fs.readFileSync('packages/css/metadata/components.json')).components.filter(c=>c.category==='interaction');
const goto=async(name,parameters={})=>{await page.goto('http://127.0.0.1:4180/preview.html?'+new URLSearchParams({component:name,...parameters}));await page.waitForSelector('html[data-demo-ready=true]');await expect(page.locator('[data-demo-component]')).toBeVisible();};
try{
 for(const width of [360,1080])for(const c of components)for(const variant of ['',...c.variants]){await page.setViewportSize({width,height:900});await goto(c.name,{variant,mode:width===360?'dark':'light'});const info=await page.evaluate(()=>{const e=document.querySelector('[data-demo-component]');return {overflow:document.documentElement.scrollWidth>innerWidth+1,left:e.getBoundingClientRect().left,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,text:e.textContent,ready:window.__demoAudit.statuses.every(s=>s.initialized),padding:getComputedStyle(e).paddingTop};});assert.ok(info.ready,c.name);assert.ok(!info.overflow&&info.left>=0,c.name+'/'+variant+'/'+width+' '+JSON.stringify(info));assert.ok(info.width>250&&info.height>30,c.name);assert.ok(info.text.length>8,c.name);if(variant==='compact')assert.equal(info.padding,'12px',c.name);if(variant==='comfortable')assert.equal(info.padding,'20px',c.name);results.push({component:c.name,variant:variant||'default',width,passed:true});}
 await page.setViewportSize({width:1080,height:900});
 for(const c of components){for(const state of ['empty','loading','error','disabled','readonly']){await goto(c.name,{state});if(['empty','loading','error'].includes(state))await expect(page.locator('[data-demo-component] [role='+ (state==='error'?'alert':'status')+']').first()).toBeVisible();if(['disabled','readonly'].includes(state))assert.equal(await page.locator('[data-demo-component] button:not(:disabled)').count(),0,c.name);}}
 await goto('entity-picker',{'interaction-controlled':'true'});await page.getByRole('button',{name:'官方网站',exact:true}).click();await expect(page.locator('#demo-result')).toContainText('web');await expect(page.getByRole('button',{name:'官方网站',exact:true})).toHaveAttribute('aria-pressed','true');
 await goto('dual-list');await page.getByRole('button',{name:'设计系统',exact:true}).click();await page.getByRole('button',{name:'移入 →'}).click();await expect(page.locator('.g-interaction-pane').last()).toContainText('设计系统');
 await goto('sort-builder');await page.getByRole('button',{name:'添加规则'}).click();await expect(page.locator('.g-interaction-rule')).toHaveCount(2);
 await goto('date-range-picker-composition');await page.getByRole('button',{name:'九月',exact:true}).click();await expect(page.getByLabel('结束',{exact:true})).toHaveValue('2026-09-30');
 await goto('undo-history');await page.getByRole('button',{name:'撤销',exact:true}).click();await expect(page.locator('.g-interaction-snapshot')).toContainText('draft');await page.getByRole('button',{name:'重做',exact:true}).click();await expect(page.locator('.g-interaction-snapshot')).toContainText('review');
 await goto('infinite-scroll');await page.getByRole('button',{name:'加载更多'}).click();await expect(page.locator('.g-interaction-list li')).toHaveCount(5);
 await goto('pull-refresh');await page.getByRole('button',{name:'刷新',exact:true}).click();await expect(page.locator('.g-interaction-list li')).toHaveCount(3);
 await goto('bulk-progress');await page.getByRole('button',{name:'开始处理'}).click();await expect(page.locator('.g-interaction-status')).toContainText('3 / 3');
 await goto('bulk-confirmation');await page.getByRole('checkbox').check();await page.getByRole('button',{name:'确认操作'}).click();await expect(page.locator('#demo-result')).toContainText('confirm');
 await goto('split-pane');await page.getByRole('separator').focus();await page.keyboard.press('End');await expect(page.getByRole('separator')).toHaveAttribute('aria-valuenow','80');
 await goto('drag-sort');await page.getByRole('button',{name:'下移',exact:true}).first().click();await expect(page.locator('[data-g-interaction-row]').first()).toHaveAttribute('data-g-interaction-row','web');
 if(engine==='chromium'){
  await context.grantPermissions(['clipboard-read','clipboard-write']);await goto('copy-action');await page.getByRole('button',{name:'复制',exact:true}).click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'https://example.com/projects/design-system');
  await goto('fullscreen-action');await page.getByRole('button',{name:'进入全屏',exact:true}).click();await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(true);await page.getByRole('button',{name:'退出全屏',exact:true}).click();await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(false);
 }
 if(engine==='chromium')for(const c of components){await goto(c.name);const audit=await new AxeBuilder({page}).include('[data-demo-component]').analyze();assert.deepEqual(audit.violations,[],c.name+' accessibility');}
 assert.deepEqual(errors,[]);await writeFile('docs/interaction/browser-'+engine+'.json',JSON.stringify({components:35,layouts:results.length,states:175,interactions:engine==='chromium'?13:11,accessibility:engine==='chromium'?35:0,errors,results},null,2));console.log(engine+': '+results.length+' layouts, 175 states, 11 interactions passed');
 await goto('transfer-list');await page.screenshot({path:'docs/interaction/'+engine+'-transfer.png'});
}finally{await browser.close();}
