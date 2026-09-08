import { chromium } from '../../packages/css/node_modules/@playwright/test/index.mjs';
import { readFile, mkdir } from 'node:fs/promises';
import { writeFile } from '../../scripts/fs-retry.mjs';
const definitions=JSON.parse(await readFile(new URL('../../packages/css/metadata/components.json',import.meta.url),'utf8')).components;
const base=process.env.WEBSITE_URL || 'http://127.0.0.1:4188/website';
const standalone=process.argv.includes('--standalone');
const styles=process.argv.includes('--styles');
const retry=process.argv.includes('--retry-failed');
const output=new URL('../../docs/release-2.2/website-demo-integration/',import.meta.url);
const previous=retry?JSON.parse(await readFile(new URL(styles?'styles.json':standalone?'standalone.json':'catalog.json',output),'utf8')):null;
const args=retry?[...new Set(previous.results.filter(row=>!row.passed).map(row=>row.name))]:process.argv.slice(2).filter(arg=>!['--standalone','--styles'].includes(arg));
const names=retry?args:args.length?args:definitions.map(item=>item.name);
for(const name of names) if(!definitions.some(item=>item.name===name)) throw new Error('Unknown catalog component: '+name);
const queue=names.flatMap(name=>[1280,390].map(width=>({name,width})));
const browser=await chromium.launch(); const results=[]; let next=0;
async function measureStyle(frame){return frame.evaluate(()=>{
 const root=document.documentElement,main=document.querySelector('main')||document.body,css=getComputedStyle(root);
 const probe=document.createElement('button');probe.type='button';probe.className='g-btn';probe.textContent='样式';probe.style.position='absolute';probe.style.visibility='hidden';document.body.append(probe);
 const color=value=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');ctx.fillStyle=value;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
 const control=getComputedStyle(probe);const button={display:control.display,height:control.height,borderRadius:control.borderRadius,fontSize:control.fontSize,background:control.backgroundColor};probe.remove();
 return {path:location.pathname,font:css.getPropertyValue('--g-font-sans').trim(),fontFamily:getComputedStyle(main).fontFamily,primary:color(css.getPropertyValue('--g-color-primary').trim()),border:color(css.getPropertyValue('--g-color-border').trim()),sheets:document.styleSheets.length,button,scaled:[root,document.body,main].some(e=>getComputedStyle(e).transform!=='none'||!['1','normal'].includes(getComputedStyle(e).zoom)),headings:[...document.querySelectorAll('.component-doc__header h2')].map(e=>parseFloat(getComputedStyle(e).fontSize))};
 });}
let reference;
if(styles){const referencePage=await browser.newPage();await referencePage.goto(base+'/zh-CN/docs.html');reference=await measureStyle(referencePage);await referencePage.close();}
async function worker(){
 const context=await browser.newContext({reducedMotion:'reduce'}); const page=await context.newPage(); page.setDefaultTimeout(20000);
 let errors=[], failedAssets=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400 && r.url().startsWith(base+'/showcase/')) failedAssets.push(r.url()+': '+r.status());});
 while(next<queue.length){
  const item=queue[next++]; errors=[]; failedAssets=[];
  try{
   await page.setViewportSize({width:item.width,height:900});
   await page.goto(base+'/showcase/'+(standalone?'index.html':'embed.html')+'?component='+item.name+'#component-'+item.name,{waitUntil:'domcontentloaded'});
   if(!standalone) await page.waitForFunction(()=>document.documentElement.dataset.showcaseReady==='true');
   await page.locator('#component-'+item.name).waitFor({state:'visible'});
   const section=page.locator('#component-'+item.name);
   const nested=section.locator('iframe[src*="preview.html"]');
   if(await nested.count()){
    await nested.first().scrollIntoViewIfNeeded(); const frame=await (await nested.first().elementHandle()).contentFrame();
    await frame.waitForFunction(()=>document.documentElement.dataset.demoReady==='true');
    const audit=await frame.evaluate(()=>window.__demoAudit);
    if(audit?.statuses?.some(s=>!s.initialized&&!s.delegatedTo)) throw new Error('Uninitialized preview: '+JSON.stringify(audit.statuses));
   }
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const expectedAssets=[];
   if(item.name==='image'){
    await page.waitForFunction(()=>{const img=document.querySelector('[data-image-demo=\"fallback\"] img');return img?.complete&&img.naturalWidth>0&&!img.src.includes('missing-image');});
    for(const asset of failedAssets) if(asset===base+'/showcase/media-assets/missing-image.svg: 404') expectedAssets.push(asset);
    failedAssets=failedAssets.filter(asset=>!expectedAssets.includes(asset));
   }
   const state=await section.evaluate(el=>({text:el.textContent.trim().length,placeholders:el.querySelectorAll('.default-placeholder,.part-placeholder').length,overflow:document.documentElement.scrollWidth>innerWidth+2,height:document.querySelector('main').getBoundingClientRect().height}));
   const computedStyles=[];
   if(styles){
    for(const nestedFrame of page.frames()){
     if(!nestedFrame.url().includes('/showcase/')) continue;
     const measured=await measureStyle(nestedFrame);computedStyles.push(measured);
     for(const key of ['font','primary','border','button']) if(JSON.stringify(measured[key])!==JSON.stringify(reference[key])) throw new Error('Style mismatch '+key+': '+JSON.stringify({expected:reference[key],actual:measured[key],path:measured.path}));
     if(measured.sheets<2||measured.scaled||measured.headings.some(size=>size>28)) throw new Error('Missing stylesheet or oversized/scaled documentation: '+JSON.stringify(measured));
    }
   }
   results.push({...item,...state,computedStyles:styles?computedStyles:undefined,expectedAssets,errors:[...errors],failedAssets:[...failedAssets],passed:state.text>30&&!state.placeholders&&!state.overflow&&!errors.length&&!failedAssets.length});
  }catch(e){results.push({...item,passed:false,error:e.message,errors:[...errors],failedAssets:[...failedAssets]});}
  if(!results.at(-1).passed) console.log('FAIL',JSON.stringify(results.at(-1)));
  if(results.length%50===0) console.log('Embedded catalog '+results.length+'/'+queue.length);
 }
 await context.close();
}
try{await Promise.all([worker(),worker()]);}finally{await browser.close();}
await mkdir(output,{recursive:true});
const reportResults=retry?previous.results.map(row=>results.find(check=>check.name===row.name&&check.width===row.width)||row):results;
await writeFile(new URL(styles?'styles.json':standalone?'standalone.json':retry||names.length===definitions.length?'catalog.json':'catalog-targeted.json',output),JSON.stringify({version:'2.2.0',styleReference:reference,components:retry?previous.components:names.length,checks:reportResults.length,retried:retry?names:undefined,passed:reportResults.every(r=>r.passed),results:reportResults},null,2)+'\n');
console.log(results.length+' checks, '+results.filter(r=>!r.passed).length+' failures');
process.exitCode=reportResults.every(r=>r.passed)?0:1;
