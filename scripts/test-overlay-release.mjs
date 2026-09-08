import fs from 'node:fs';
import {chromium,firefox,webkit,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import AxeBuilder from '../packages/css/node_modules/@axe-core/playwright/dist/index.mjs';
import {writeFile} from './fs-retry.mjs';
const engine=process.env.AUDIT_ENGINE||'chromium',catalog=JSON.parse(fs.readFileSync('packages/css/metadata/components.json')).components.filter(c=>c.category==='overlay');
const browser=await ({chromium,firefox,webkit}[engine]).launch(),context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],results=[];
page.on('console',m=>{if(m.text().startsWith('BAD RECT'))console.log(m.text());});page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(8000);
const inViewport=async panel=>{await expect.poll(()=>panel.evaluate(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0&&r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1;})).toBeTruthy().catch(async error=>{console.log(await panel.evaluate(n=>({rect:n.getBoundingClientRect().toJSON(),style:n.getAttribute("style"),html:n.outerHTML.slice(0,300)})));throw error;});};
try{
 for(const width of [390,1280]){
 await page.setViewportSize({width,height:900});
 await page.goto('http://127.0.0.1:4187/examples/overlay-compositions.html');await page.waitForSelector('html[data-overlay-ready=true]');
 for(const component of catalog){const root=page.locator('#overlay-css-'+(component.name==='confirm-dialog'?'confirm':component.name));const floating=['popover','tooltip','popconfirm'].includes(component.name);const panel=floating?root.locator('[data-g-'+(component.name==='tooltip'?'tooltip':'popover')+'-content]'):root.locator(component.name==='drawer'?'.g-drawer':'.g-dialog');
 for(const variant of component.variants){console.log("CSS",component.name,variant,width);await page.getByLabel(component.name+' 变体',{exact:true}).selectOption(variant);await page.locator('[data-overlay-open="'+component.name+'"]').click();await expect(panel).toBeVisible();await inViewport(panel);await page.keyboard.press('Escape');await expect(panel).toBeHidden();results.push({surface:'css',component:component.name,variant,width});}
 }
 }
 await page.setViewportSize({width:390,height:900});
 for(const component of catalog){console.log("DEMO",component.name);
 await page.goto('http://127.0.0.1:4180/preview.html?component='+component.name);await page.waitForSelector('html[data-demo-ready=true]');const demo=page.locator('[data-overlay-demo]'),floating=['popover','tooltip','popconfirm'].includes(component.name),panel=floating?demo.locator('[data-g-'+(component.name==='tooltip'?'tooltip':'popover')+'-content]'):demo.locator(component.name==='drawer'?'[data-g-drawer] > .g-drawer':'[data-g-dialog] > .g-dialog').first();
 if(floating)await page.getByLabel('触发方式',{exact:true}).selectOption('click');
 for(const variant of component.variants){await page.getByLabel('组件变体',{exact:true}).selectOption(variant);await demo.locator('.overlay-launch').first().click();await expect(panel).toBeVisible();await inViewport(panel);await page.keyboard.press('Escape');await expect(panel).toBeHidden();results.push({surface:'demo',component:component.name,variant,width:390});}
 await page.getByLabel('组件变体',{exact:true}).selectOption('');await page.getByLabel('自定义高度',{exact:true}).fill('400');await page.getByLabel('最大高度',{exact:true}).fill('320');if(component.name!=='tooltip')await page.getByLabel('内容密度',{exact:true}).selectOption('compact');await page.getByLabel('长内容',{exact:true}).check();await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.dataset.gMode='dark';});await demo.locator('.overlay-launch').first().click();await expect(panel).toBeVisible();await inViewport(panel);expect(await panel.evaluate(n=>n.getBoundingClientRect().height)).toBeLessThanOrEqual(321);
 if(engine==='chromium'){const violations=(await new AxeBuilder({page}).include('[data-overlay-demo]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations;expect(violations).toEqual([]);await page.screenshot({path:'docs/overlay/release-review/'+component.name+'-390.png'});}
 await page.keyboard.press('Escape');await expect(panel).toBeHidden();
 }
 expect(errors).toEqual([]);await writeFile('docs/overlay/release-review/browser-'+engine+'.json',JSON.stringify({engine,results,variants:28,components:6,dimensionsAndDarkRtl:6,errors},null,2));console.log(engine+': '+results.length+' variant checks, six dimension/dark/RTL checks passed');
}finally{await browser.close();}
