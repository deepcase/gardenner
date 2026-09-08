import assert from 'node:assert/strict';
import{readFile}from'node:fs/promises';import{chromium}from'../../packages/css/node_modules/@playwright/test/index.mjs';import{writeFile}from'../../scripts/fs-retry.mjs';
const components=JSON.parse(await readFile(new URL('../../packages/css/metadata/components.json',import.meta.url),'utf8')).components;
const browser=await chromium.launch();const page=await browser.newPage();page.setDefaultTimeout(90000);
try{
 await page.goto((process.env.WEBSITE_URL||'http://127.0.0.1:4188/website')+'/zh-CN/docs.html');
 await page.waitForFunction(()=>['vue','react','angular','blazor'].every(id=>document.querySelector('#'+id+'-component-catalog')?.childElementCount===575));
 const catalogs=await page.evaluate(()=>['','vue-','react-','angular-','blazor-'].map(prefix=>({prefix,rows:[...document.querySelectorAll('#'+prefix+'component-catalog > details')].map(card=>{
  const fields=Object.fromEntries([...card.querySelectorAll('.docs-metadata-row')].map(row=>[row.querySelector('dt').textContent,row.querySelector('dd').textContent]));
  const style=getComputedStyle(card.querySelector('.docs-metadata-row'));const code=getComputedStyle(card.querySelector('.docs-metadata code'));
  return {component:card.querySelector('[data-component-demo]').dataset.componentDemo,variants:fields.variants||'',states:fields.states||'',style:{font:style.fontFamily,fontSize:style.fontSize,color:style.color,lineHeight:style.lineHeight,codeFont:code.fontFamily,codeSize:code.fontSize}};
 })})));
 const reference=catalogs[0].rows[0].style;
 for(const catalog of catalogs){assert.equal(catalog.rows.length,components.length);for(const row of catalog.rows){const definition=components.find(item=>item.name===row.component);assert.ok(definition);assert.equal(row.variants,(definition.variants||[]).join(' · '));assert.equal(row.states,(definition.states||[]).join(' · '));assert.deepEqual(row.style,reference,catalog.prefix+row.component+' API table styles');}}
 await writeFile(new URL('../../docs/release-2.2/website-demo-integration/api-presentation.json',import.meta.url),JSON.stringify({passed:true,catalogs:5,components:components.length,variantDefinitions:components.reduce((sum,item)=>sum+(item.variants?.length||0),0),cards:catalogs.reduce((sum,item)=>sum+item.rows.length,0),sharedStyle:reference},null,2)+'\n');
 console.log('API presentation parity: 2875 cards and all component variant/state declarations match.');
}finally{await browser.close();}
