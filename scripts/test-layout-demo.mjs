import assert from 'node:assert/strict';
import {chromium,firefox,webkit,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import AxeBuilder from '../packages/css/node_modules/@axe-core/playwright/dist/index.mjs';
import {layoutModes} from '../packages/css/src/js/layout.js';
import {writeFile} from './fs-retry.mjs';
const engine=process.env.LAYOUT_BROWSER||'chromium',browser=await ({chromium,firefox,webkit})[engine].launch(),context=await browser.newContext(),page=await context.newPage(),errors=[],results=[];
page.on('pageerror',error=>errors.push(error.message));
try {
 page.setDefaultTimeout(60000);
 for(const [kind,modes] of Object.entries(layoutModes))for(const mode of modes)for(const width of [360,1100]){
  if(mode===modes[0]&&width===360)console.log(engine+': checking '+kind);
  await page.setViewportSize({width,height:850});await page.goto('http://127.0.0.1:4180/preview.html?'+new URLSearchParams({component:kind,variant:mode}));await page.waitForSelector('html[data-demo-ready=true]');
  const root=page.locator('[data-demo-component]');await expect(root).toHaveAttribute('data-g-layout-mode',mode);
  const info=await root.evaluate(element=>({children:element.children.length,width:element.getBoundingClientRect().width,left:element.getBoundingClientRect().left,right:element.getBoundingClientRect().right,overflow:document.documentElement.scrollWidth>innerWidth+1,columns:getComputedStyle(element).gridTemplateColumns}));
  assert.ok(info.children>0,kind+'/'+mode+' missing content');assert.equal(info.overflow,false,kind+'/'+mode+'/'+width+' overflow');
  assert.ok(info.left>=-1&&info.right<=width+1,kind+'/'+mode+'/'+width+' outside the viewport');results.push({kind,mode,width,passed:true});
 }
 const a11y=[];
 for(const kind of Object.keys(layoutModes)){
  await page.goto('http://127.0.0.1:4180/preview.html?component='+kind+'&layout-direction=rtl&layout-gap=24');await page.waitForSelector('html[data-demo-ready=true]');
  await expect(page.locator('[data-demo-component]')).toHaveAttribute('dir','rtl');
  if(engine==='chromium'){const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],kind+' accessibility');a11y.push(kind);}
 }
 await page.goto('http://127.0.0.1:4180/preview.html?component=app-shell&layout-controlled=true');await page.waitForSelector('[data-g-layout-mode]');await page.getByLabel('工作备注').fill('保留的草稿');await page.getByRole('button',{name:'侧栏',exact:true}).click();await expect(page.locator('[data-g-layout-panel]')).toBeHidden();await expect(page.locator('#demo-result')).toContainText('true');await page.getByRole('button',{name:'侧栏',exact:true}).click();await expect(page.getByLabel('工作备注')).toHaveValue('保留的草稿');
 await page.locator('[data-demo-component]').evaluate(root=>{window.layoutSavedChild=root.querySelector('input');root.dataset.gLayoutOptions=JSON.stringify({...JSON.parse(root.dataset.gLayoutOptions),gap:32});});await expect(page.locator('[data-demo-component]')).toHaveCSS('row-gap','32px');assert.equal(await page.evaluate(()=>window.layoutSavedChild===document.querySelector('[data-demo-component] input')),true);
 await page.emulateMedia({media:'print'});await expect(page.locator('[data-demo-component]')).toHaveCSS('display','block');await page.emulateMedia({media:'screen',reducedMotion:'reduce'});
 await page.screenshot({path:'docs/layout/'+engine+'-shell.png',fullPage:true});
 assert.deepEqual(errors,[]);await writeFile('docs/layout/browser-'+engine+'.json',JSON.stringify({components:11,modes:Object.values(layoutModes).flat().length,layouts:results.length,rtl:11,a11y,controlledCollapse:true,preservedChild:true,print:true,results,errors},null,2));console.log(engine+': '+results.length+' layout checks, 11 RTL cases, controlled collapse and print passed');
} finally {await browser.close();}
