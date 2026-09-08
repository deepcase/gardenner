import {chromium,firefox,webkit,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import {writeFile} from './fs-retry.mjs';
const engine=process.env.INTERACTION_BROWSER||'chromium',browser=await ({chromium,firefox,webkit})[engine].launch(),context=await browser.newContext(),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const goto=async(name,params={})=>{await page.goto('http://127.0.0.1:4180/preview.html?'+new URLSearchParams({component:name,...params}));await page.waitForSelector('html[data-demo-ready=true]');};
try{
 for(const params of [{'interaction-cascade':'false'},{'interaction-multiple':'false'}]){await goto('tree-select',params);await page.getByRole('button',{name:'华东团队',exact:true}).click();await expect(page.getByRole('button',{name:'上海研发中心',exact:true})).toHaveAttribute('aria-pressed','false');}
 await goto('tree-select',{variant:'parent-value'});await page.getByRole('button',{name:'华东团队',exact:true}).click();await expect(page.locator('#demo-result')).toContainText('"keys":["east"]');await page.getByRole('button',{name:'上海研发中心',exact:true}).click();await expect(page.getByRole('button',{name:'华东团队',exact:true})).toHaveAttribute('aria-pressed','mixed');
 await goto('split-pane',{variant:'vertical','interaction-orientation':'horizontal'});await expect(page.locator('.g-interaction-split')).toHaveAttribute('data-orientation','horizontal');
 await goto('dual-list',{variant:'compact','interaction-size':'large'});await expect(page.locator('[data-demo-component]')).toHaveCSS('padding-top','20px');
 await goto('dual-list',{variant:'borderless','interaction-bordered':'true'});await expect(page.locator('[data-demo-component]')).toHaveCSS('border-top-width','1px');
 await goto('split-pane',{variant:'collapsible'});await page.getByRole('button',{name:'收起面板'}).click();await expect(page.getByRole('separator')).toHaveCount(0);await page.getByRole('button',{name:'展开面板'}).click();await expect(page.getByRole('separator')).toBeVisible();
 await page.goto('http://127.0.0.1:4187/examples/interaction-compositions.html');const input=page.locator('#undo-history input');await input.fill('保留未提交快照');await page.evaluate(()=>document.dispatchEvent(new Event('fullscreenchange')));await expect(input).toHaveValue('保留未提交快照');
 if(engine==='chromium'){await page.getByRole('button',{name:'进入全屏',exact:true}).click();await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(true);await page.getByRole('button',{name:'退出全屏',exact:true}).click();await expect(input).toHaveValue('保留未提交快照');}
 expect(errors).toEqual([]);await writeFile('docs/interaction/final-'+engine+'.json',JSON.stringify({independentTree:true,parentStrategy:true,explicitParameterPrecedence:true,collapsiblePane:true,fullscreenIsolation:true,errors},null,2));console.log(engine+': final tree, parameter precedence, collapse and fullscreen isolation passed');
}finally{await browser.close();}
