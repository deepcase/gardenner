import fs from 'node:fs';import {writeFile,copyFile} from './fs-retry.mjs';import {mobileVariants,mobileExamples,mobileDemoCss,mobileDemoService} from './mobile-examples.mjs';
const edit=async(p,fn)=>writeFile(p,fn(fs.readFileSync(p,'utf8')));
for(const p of ['../GardenerDemo/src/data/mobile-examples.json','packages/css/examples/mobile-examples.json'])await writeFile(p,JSON.stringify(mobileVariants)+'\n');
for(const root of ['../GardenerDemo/public','packages/css/examples','packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot']){fs.mkdirSync(root+'/commerce-assets',{recursive:true});if(root!=='packages/css/examples')for(const name of ['cup.svg','bag.svg','lamp.svg'])await copyFile('packages/css/examples/commerce-assets/'+name,root+'/commerce-assets/'+name);}
for(const p of ['../GardenerDemo/src/mobile-demo.css','packages/css/examples/mobile-demo.css','packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot/mobile-demo.css'])await writeFile(p,mobileDemoCss);
await writeFile('packages/css/examples/mobile-demo-services.js',mobileDemoService);
await writeFile('../GardenerDemo/src/mobile-demo-services.ts','// @ts-nocheck -- shared demonstration-only service; public runtime types are checked separately.\n'+mobileDemoService);
await edit('../GardenerDemo/scripts/build-examples.mjs',s=>s.includes('import { mobileExamples }')?s:"import { mobileExamples } from '../../Gardener/scripts/mobile-examples.mjs';\n"+s.replace('Object.assign(overrides, commerceExamples);','Object.assign(overrides, commerceExamples);\nObject.assign(overrides, mobileExamples);'));
await edit('../GardenerDemo/src/preview.ts',s=>{
 if(!s.includes('import mobileVariants'))s="import mobileVariants from './data/mobile-examples.json';\nimport {installMobileDemo} from './mobile-demo-services';\nimport './mobile-demo.css';\n"+s;
 if(!s.includes("definition?.category==='mobile'"))s=s.replace('document.title =',"if(definition?.category==='mobile'){const variants=(mobileVariants as Record<string,Record<string,{html:string}>>)[name];fixture=variants?.[params.get('variant')||'']||Object.values(variants||{})[0]||fixture;}\ndocument.title =");
 if(!s.includes("if(definition!.category==='mobile')"))s=s.replace("if(definition!.category==='commerce'){",`if(definition!.category==='mobile'){
 const options=JSON.parse(String(attrs['data-g-mobile-options']));for(const key of ['size','direction','position']){const value=params.get('mobile-'+key);if(value)options[key]=value;}for(const key of ['bordered','readonly','multiple','safeArea','loop','allowSwipe','closeOnBackdrop','confirmActions']){const value=params.get('mobile-'+key);if(value)options[key]=value==='true';}for(const key of ['threshold','maxSelected','duration']){const value=params.get('mobile-'+key);if(value)options[key]=Number(value);}if(params.get('mobile-service')==='timeout')options.requestTimeout=1500;const data=params.get('mobile-data');if(data==='empty'){options.items=[];options.actions=[];options.columns=[];}if(data==='loading'||data==='error')options.status=data;if(state==='disabled')attrs['data-g-mobile-disabled']='true';attrs['data-g-mobile-options']=JSON.stringify(options);if(params.get('mobile-controlled')==='true')attrs['data-g-mobile-value']=JSON.stringify(options.defaultValue||{});
 }
 if(definition!.category==='commerce'){`);
 if(!s.includes("if(definition.category==='mobile')"))s=s.replace("if(definition.category==='commerce'){",`if(definition.category==='mobile'){
 installMobileDemo(selected,getInstance,params.get('mobile-service')||'success');selected.addEventListener('gardener:change',((event:CustomEvent)=>{if(event.target!==selected||!event.detail.value)return;if(event.detail.controlled)selected.setAttribute('data-g-mobile-value',JSON.stringify(event.detail.value));result.hidden=false;result.textContent='公开状态：'+JSON.stringify(event.detail.value);}) as EventListener);
 }
 if(definition.category==='commerce'){`);
 return s.replace("'media','commerce'].includes(definition.category)","'media','commerce','mobile'].includes(definition.category)");
});
await edit('../GardenerDemo/src/preview-actions.ts',s=>s.includes('[data-g-mobile-options]')?s:s.replace('[data-g-commerce-options]','[data-g-commerce-options],[data-g-mobile-options]'));
await edit('../GardenerDemo/src/App.vue',s=>s.includes("normalizedQuery.value === 'mobile'")?s:s.replace("if (normalizedQuery.value === 'commerce'","if (normalizedQuery.value === 'mobile' || normalizedQuery.value === '移动端') return component.category === 'mobile';\n  if (normalizedQuery.value === 'commerce'"));
await edit('../GardenerDemo/src/components/ComponentShowcase.vue',s=>{
 if(!s.includes('const mobile=ref'))s=s.replace('const commerce=ref',"const mobile=ref({size:'',direction:'ltr',bordered:'true',readonly:'false',position:'inline',safeArea:'true',multiple:'',threshold:'64',maxSelected:'',loop:'false',allowSwipe:'true',data:'ready',service:'success',controlled:'false'});\nconst commerce=ref");
 if(!s.includes("props.definition.category==='mobile'?"))s=s.replace("props.definition.category==='commerce'?","props.definition.category==='mobile'?Object.fromEntries(Object.entries(mobile.value).map(([k,v])=>['mobile-'+k,v])):props.definition.category==='commerce'?");
 if(!s.includes('v-model="mobile.size"'))s=s.replace('<div class="specimen-controls">',`<div class="specimen-controls">
<template v-if="definition.category==='mobile'">
<label>数据<select v-model="mobile.data" aria-label="移动端数据"><option value="ready">正常</option><option value="empty">空内容</option><option value="loading">加载中</option><option value="error">加载失败</option></select></label>
<label>尺寸<select v-model="mobile.size" aria-label="移动端尺寸"><option value="">跟随变体</option><option value="small">紧凑</option><option value="medium">标准</option><option value="large">宽松</option></select></label>
<label>边框<select v-model="mobile.bordered" aria-label="移动端边框"><option value="true">显示</option><option value="false">隐藏</option></select></label>
<label>方向<select v-model="mobile.direction" aria-label="移动端方向"><option>ltr</option><option>rtl</option></select></label>
<label>只读<select v-model="mobile.readonly" aria-label="移动端只读"><option value="false">关闭</option><option value="true">开启</option></select></label>
<label>安全区<select v-model="mobile.safeArea" aria-label="移动端安全区"><option value="true">开启</option><option value="false">关闭</option></select></label>
<label>多选<select v-model="mobile.multiple" aria-label="移动端多选"><option value="">跟随变体</option><option value="true">开启</option><option value="false">关闭</option></select></label>
<label>滑动手势<select v-model="mobile.allowSwipe" aria-label="移动端手势"><option value="true">开启</option><option value="false">关闭</option></select></label>
<label>循环切换<select v-model="mobile.loop" aria-label="移动端循环"><option value="true">开启</option><option value="false">关闭</option></select></label>
<label>手势阈值<select v-model="mobile.threshold" aria-label="移动端手势阈值"><option>40</option><option>64</option><option>96</option></select></label>
<label>服务结果<select v-model="mobile.service" aria-label="移动端服务"><option value="success">模拟确认</option><option value="error">模拟失败</option><option value="timeout">模拟超时</option></select></label>
<label>状态管理<select v-model="mobile.controlled" aria-label="移动端状态管理"><option value="false">组件管理</option><option value="true">外部受控</option></select></label>
</template>`);return s;
});
const sections=Object.entries(mobileVariants).map(([kind,modes])=>'<section data-example="'+kind+'"><h2>'+kind+'</h2><label>变体<select aria-label="'+kind+' 变体">'+Object.keys(modes).map(m=>'<option>'+m+'</option>').join('')+'</select></label><div data-stage>'+Object.values(modes)[0].html+'</div></section>').join('\n');
await writeFile('packages/css/examples/mobile-lab.html','<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>移动端组件完整演示</title><link rel="stylesheet" href="../dist/gardener.css"><link rel="stylesheet" href="mobile-demo.css"></head><body><main style="max-width:1100px;margin:auto;padding:24px"><h1>移动端组件 · 33 个组件 / 99 个变体</h1><p>手势、按钮与键盘操作；数据更新由本地模拟服务返回。</p>'+sections+'</main><script type="module">import {init,destroy,getInstance} from "../dist/gardener.runtime.js";import {installMobileDemo} from "./mobile-demo-services.js";const examples=await fetch("./mobile-examples.json").then(r=>r.json());function mount(scope){init(scope);for(const root of scope.querySelectorAll("[data-g-mobile]"))installMobileDemo(root,getInstance);}mount(document);for(const section of document.querySelectorAll("[data-example]"))section.querySelector("select").addEventListener("change",e=>{const stage=section.querySelector("[data-stage]");destroy(stage);stage.innerHTML=examples[section.dataset.example][e.target.value].html;mount(stage);});</script></body></html>');
let razor=fs.readFileSync('packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/MediaLab.razor','utf8');razor=razor.replace(/private static readonly JsonDocument Examples=JsonDocument.Parse\("""[\s\S]*?"""\);/,'private static readonly JsonDocument Examples=JsonDocument.Parse("""\n'+JSON.stringify(mobileVariants)+'\n""");').replaceAll('媒体','移动端').replaceAll('media','mobile').replace('Name{get;set;}="carousel"','Name{get;set;}="mobile-picker"').replace('Mode{get;set;}="default"','Mode{get;set;}="single"').replace('本地图片、音视频与文档；可实际翻页、预览、播放和导出裁剪。','本地模拟移动端服务；不会执行真实交易或请求系统权限。');
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/MobileLab.razor',razor.replace('Name="@Name" Config=', 'Name="@Name" Variant="@Mode" Config=').replaceAll('mobile-mobile-viewer','mobile-media-viewer'));
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot/mobile-demo.js',"import {init,getInstance} from './_content/Gardenerim.Blazor/gardener.runtime.min.js';\n"+mobileDemoService+'\nexport function install(id){const root=document.getElementById(id);if(root){init(root);installMobileDemo(root,getInstance);}}\n');

await edit('../GardenerDemo/src/preview.css',s=>s.replace('.preview-content .g-mobile-fab {','.preview-content .g-mobile-fab:not([data-g-mobile-options]) {'));

await import('./mobile-demo-params.mjs');
