import {build} from '../packages/css/node_modules/esbuild/lib/main.js';
import {chromium,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import {readFileSync} from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const data=[{label:'Project',value:'Gardener'},{label:'Owner',value:'Alex'},{label:'Status',value:'Active'},{label:'Details',value:'Shared description layout',span:3}];
const contents=`import{createApp,h,ref}from'vue';import Descriptions from'@arco-design/web-vue/es/descriptions/index.js';const o=ref({data:${JSON.stringify(data)}});window.setArcoOptions=v=>o.value={...o.value,...v};createApp({setup(){return()=>h(Descriptions,o.value)}}).mount('#arco');`;
const bundle=await build({stdin:{contents,resolveDir:'D:/develop/GardenerDemo'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"','__VUE_OPTIONS_API__':'true','__VUE_PROD_DEVTOOLS__':'false','__VUE_PROD_HYDRATION_MISMATCH_DETAILS__':'false'}});
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1000,height:900}}),measurements=[];
try{
 await page.route('**/arco.css',r=>r.fulfill({contentType:'text/css',body:readFileSync('D:/develop/GardenerDemo/node_modules/@arco-design/web-vue/dist/arco.css','utf8')}));
 await page.route('**/descriptions-reference.html',r=>r.fulfill({contentType:'text/html',body:`<!doctype html><html lang="en"><head><title>Descriptions comparison</title><link rel="stylesheet" href="/arco.css"><link rel="stylesheet" href="/dist/gardener.css"></head><body style="padding:24px"><main style="width:700px"><h1>Arco / Gardener</h1><div id="arco"></div><div id="gardener" class="g-descriptions" data-g-data-display></div></main><script>${bundle.outputFiles[0].text.replaceAll('</script','<\/script')}</script><script type="module">import{init,getInstance}from'/dist/gardener.runtime.js';const root=document.getElementById('gardener');root.dataset.gDataOptions=JSON.stringify({data:${JSON.stringify(data)}});init(root);window.setOptions=p=>getInstance(root,'data-display').setOptions(p);</script></body></html>`}));
 await page.goto('http://127.0.0.1:4187/descriptions-reference.html');await page.locator('.g-desc-table').waitFor();
 for(const layout of ['horizontal','vertical','inline-horizontal','inline-vertical'])for(const size of ['mini','small','medium','large'])for(const bordered of [false,true]){
  const options={layout,size,bordered,title:'Project details'};await page.evaluate(o=>{window.setArcoOptions(o);window.setOptions(o)},options);await page.waitForTimeout(25);
  const a=await page.evaluate(({root,label,value})=>{const get=s=>{const n=document.querySelector(s),r=n.getBoundingClientRect(),c=getComputedStyle(n);return{height:r.height,font:c.fontSize,paddingTop:c.paddingTop,paddingBottom:c.paddingBottom,paddingRight:c.paddingRight}};return{root:get(root),label:get(label),value:get(value)}},{root:'.arco-descriptions',label:'.arco-descriptions-item-label',value:'.arco-descriptions-item-value'});
  await page.evaluate(()=>document.querySelector('link[href="/arco.css"]').disabled=true);
  const g=await page.evaluate(()=>{const get=s=>{const n=document.querySelector(s),r=n.getBoundingClientRect(),c=getComputedStyle(n);return{height:r.height,font:c.fontSize,paddingTop:c.paddingTop,paddingBottom:c.paddingBottom,paddingRight:c.paddingRight}};return{root:get('#gardener'),label:get('.g-desc-label'),value:get('.g-desc-value')}});
  measurements.push({options,a,g});expect(Math.abs(g.root.height-a.root.height),JSON.stringify({options,a,g})).toBeLessThan(1);expect(g.label.font).toBe(a.label.font);
  if(layout==='horizontal'&&size==='medium'&&bordered)await page.locator('#gardener').screenshot({path:'docs/descriptions/gardener-reference.png'});
  await page.evaluate(()=>document.querySelector('link[href="/arco.css"]').disabled=false);
 }
 await writeFile('docs/descriptions/arco-measurements.json',JSON.stringify(measurements,null,2));console.log('32 Arco size/layout/border comparisons passed');
}finally{await browser.close();}
