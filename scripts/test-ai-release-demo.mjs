import assert from 'node:assert/strict';
import {chromium,firefox,webkit,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import AxeBuilder from '../packages/css/node_modules/@axe-core/playwright/dist/index.mjs';
import {aiModes} from '../packages/css/src/js/ai.js';import {writeFile} from './fs-retry.mjs';
const engine=process.env.AI_BROWSER||'chromium',browser=await ({chromium,firefox,webkit})[engine].launch(),context=await browser.newContext(),page=await context.newPage(),errors=[],results=[],a11y=[];
page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
const goto=async(kind,extra={})=>{await page.goto('http://127.0.0.1:4180/preview.html?'+new URLSearchParams({component:kind,...extra}));await page.waitForSelector('html[data-demo-ready=true]');};
try{
 if(!process.env.AI_INTERACTIONS_ONLY)for(const [kind,modes]of Object.entries(aiModes)){
  console.log(engine+': '+kind);
  for(const mode of modes)for(const width of [360,1100]){await page.setViewportSize({width,height:850});await goto(kind,{variant:mode});const root=page.locator('[data-demo-component]');await expect(root).toHaveAttribute('data-g-ai-mode',mode);assert.ok((await root.innerText()).trim(),kind+'/'+mode);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,kind+'/'+mode+' overflow');const audit=await page.evaluate(()=>window.__demoAudit);assert.ok(audit.statuses.every(s=>s.initialized),kind+' initialization');results.push({kind,mode,width});}
  await goto(kind,{'ai-direction':'rtl'});await expect(page.locator('[data-g-ai-kind]')).toHaveAttribute('dir','rtl');
  if(engine==='chromium'){const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],kind+' accessibility');a11y.push(kind);}
 }

 await goto('chat',{'ai-controlled':'true'});await page.locator('[data-ai-field=draft]').fill('请总结配置');await page.locator('[data-ai-action=send]').click();await expect(page.locator('[data-g-ai-kind]')).toHaveAttribute('data-g-ai-status','complete');await expect(page.locator('.g-ai-messages')).toContainText('预录的演示回复');
 await goto('streaming-response',{'ai-controlled':'true'});await page.locator('[data-ai-action=generate]').click();await page.locator('[data-ai-action=pause]').click();await expect(page.locator('[data-g-ai-kind]')).toHaveAttribute('data-g-ai-status','paused');await page.locator('[data-ai-action=resume]').click();await page.locator('[data-ai-action=stop]').click();await expect(page.locator('[data-g-ai-kind]')).toHaveAttribute('data-g-ai-status','stopped');
 await goto('streaming-response',{'ai-service':'error'});await page.locator('[data-ai-action=generate]').click();await expect(page.getByRole('alert')).toContainText('模拟');await page.locator('[data-ai-action=retry]').click();await expect(page.locator('[data-g-ai-kind]')).toHaveAttribute('data-g-ai-status','complete');
 await goto('tool-approval',{'ai-controlled':'true'});await page.locator('[data-ai-key=approved]').click();await expect(page.locator('.g-ai-notice')).toContainText('已完成');await expect(page.locator('[data-ai-key=approved]')).toHaveCount(0);
 await goto('ai-feedback',{variant:'detailed','ai-controlled':'true'});await page.locator('[data-ai-key=dislike]').click();await page.locator('[data-ai-field=reason]').fill('需要更多示例');await page.locator('[data-ai-action=feedback]').click();await expect(page.locator('.g-ai-notice')).toContainText('反馈已保存');
 await goto('artifact-panel');await page.locator('[role=tab]').first().press('End');await expect(page.locator('[role=tab]').last()).toBeFocused();
 await goto('ai-workspace',{variant:'sidebar'});await page.locator('[data-ai-key=new]').click();await expect(page.locator('.g-ai-messages')).toContainText('暂无内容');await page.setViewportSize({width:1100,height:850});await page.screenshot({path:'docs/ai/release-review/'+engine+'-workspace.png',fullPage:true});
 assert.deepEqual(errors,[]);await writeFile('docs/ai/release-review/'+(process.env.AI_INTERACTIONS_ONLY?'interactions-':'browser-')+engine+'.json',JSON.stringify({components:38,variants:119,layouts:results.length,rtl:process.env.AI_INTERACTIONS_ONLY?0:38,a11y,streaming:true,cancel:true,pause:true,retry:true,approval:true,feedback:true,keyboard:true,errors,results},null,2));console.log(engine+': '+results.length+' layouts and AI interactions passed');
}finally{await browser.close();}
