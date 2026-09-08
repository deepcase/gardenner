import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';import {helpVariants,helpExamples,helpDemoCss} from './help-examples.mjs';
const edit=async(p,fn)=>{const s=fs.readFileSync(p,'utf8');await writeFile(p,fn(s));};const json=JSON.stringify(helpVariants);
for(const p of ['../GardenerDemo/src/data/help-examples.json','packages/css/examples/help-examples.json'])await writeFile(p,json+'\n');
for(const p of ['../GardenerDemo/src/help-demo.css','packages/css/examples/help-demo.css','packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot/help-demo.css'])await writeFile(p,helpDemoCss+'\n');
await edit('../GardenerDemo/scripts/build-examples.mjs',s=>s.includes('import { helpExamples }')?s:"import { helpExamples } from '../../Gardener/scripts/help-examples.mjs';\n"+s.replace('Object.assign(overrides, layoutExamples);','Object.assign(overrides, layoutExamples);\nObject.assign(overrides, helpExamples);'));
await edit('../GardenerDemo/src/preview.ts',s=>{if(!s.includes('import helpVariants'))s="import helpVariants from './data/help-examples.json';\nimport './help-demo.css';\n"+s;if(!s.includes("definition?.category==='help'"))s=s.replace('document.title =',"if(definition?.category==='help'){const variants=(helpVariants as Record<string,Record<string,{html:string}>>)[name];fixture=variants?.[params.get('variant')||'']||Object.values(variants||{})[0]||fixture;}\ndocument.title =");if(!s.includes("if(definition!.category==='help')"))s=s.replace("if(definition!.category==='layout'){",`if(definition!.category==='help'){
        const options=JSON.parse(String(attrs['data-g-help-options']));
        for(const key of ['size','direction','placement']){const value=params.get('help-'+key);if(value)options[key]=value;}
        for(const key of ['multiple','searchable','bordered']){const value=params.get('help-'+key);if(value)options[key]=value==='true';}
        for(const key of ['columns','limit','width']){const value=params.get('help-'+key);if(value)options[key]=Number(value);}
        if(state==='disabled')attrs['data-g-help-disabled']='true';attrs['data-g-help-options']=JSON.stringify(options);
        if(params.get('help-controlled')==='true')attrs['data-g-help-value']=JSON.stringify(options.defaultValue||{});
      }
      if(definition!.category==='layout'){
`);if(!s.includes("if(definition.category==='help')"))s=s.replace("if(definition.category==='layout')",`if(definition.category==='help'){
    selected.addEventListener('gardener:change',((event:CustomEvent)=>{if(event.target!==selected)return;if(event.detail.controlled)selected.setAttribute('data-g-help-value',JSON.stringify(event.detail.value));result.hidden=false;result.textContent='当前帮助状态：'+JSON.stringify(event.detail.value);}) as EventListener);
    selected.addEventListener('gardener:action',((event:CustomEvent)=>{if(event.target!==selected)return;result.hidden=false;result.textContent='应用收到操作：'+JSON.stringify(event.detail)+'（演示不发送外部请求）';}) as EventListener);
  }
  if(definition.category==='layout')`);return s.replace("['interaction','content'].includes(definition.category)","['interaction','content','layout','help'].includes(definition.category)");});
await edit('../GardenerDemo/src/App.vue',s=>s.includes("normalizedQuery.value === 'help'")?s:s.replace("if (normalizedQuery.value === 'layout'","if (normalizedQuery.value === 'help' || normalizedQuery.value === '帮助') return component.category === 'help';\n  if (normalizedQuery.value === 'layout'"));
await edit('../GardenerDemo/src/components/ComponentShowcase.vue',s=>{if(!s.includes('const help=ref'))s=s.replace('const layout=ref',"const help=ref({size:'medium',bordered:'true',direction:'ltr',multiple:'',searchable:'',columns:'',limit:'50',width:'320',controlled:'false'});\nconst layout=ref");if(!s.includes("props.definition.category==='help'?"))s=s.replace("props.definition.category==='layout'?","props.definition.category==='help'?Object.fromEntries(Object.entries(help.value).map(([k,v])=>['help-'+k,v])):props.definition.category==='layout'?");if(!s.includes('v-model="help.size"'))s=s.replace('<div class="specimen-controls">',`<div class="specimen-controls">
    <template v-if="definition.category==='help'">
      <label>尺寸<select v-model="help.size" aria-label="帮助尺寸"><option value="small">紧凑</option><option value="medium">标准</option><option value="large">宽松</option></select></label>
      <label>边框<select v-model="help.bordered" aria-label="帮助边框"><option value="true">显示</option><option value="false">隐藏</option></select></label>
      <label>方向<select v-model="help.direction" aria-label="帮助方向"><option value="ltr">从左到右</option><option value="rtl">从右到左</option></select></label>
      <label v-if="definition.name==='faq'">多项展开<select v-model="help.multiple" aria-label="多项展开"><option value="">跟随变体</option><option value="true">允许</option><option value="false">单项</option></select></label>
      <label v-if="['faq','help-center','help-topics','help-search','help-glossary','shortcut-list'].includes(definition.name)">检索<select v-model="help.searchable" aria-label="帮助检索"><option value="">跟随变体</option><option value="true">启用</option><option value="false">关闭</option></select></label>
      <label v-if="['help-center','help-topics','help-search','help-glossary'].includes(definition.name)">列数<select v-model="help.columns" aria-label="帮助列数"><option value="">跟随变体</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
      <label>状态管理<select v-model="help.controlled" aria-label="帮助状态管理"><option value="false">组件管理</option><option value="true">外部受控</option></select></label>
    </template>`);if(!s.includes('五端帮助参数'))s=s.replace('<details class="specimen-source"><summary>查看完整示例结构',`<details v-if="definition.category==='help'" class="specimen-source"><summary>五端帮助参数</summary><p>helpOptions 提供 kind、mode、title、description、items、actions、size、tone、bordered、columns、limit、searchable、multiple、readonly、dismissible、width、placement、direction、labels。helpValue 控制 query、category、expanded、completed、step、open、dismissed、feedback；change 返回下一状态，beforechange 可取消。</p><p>CSS 使用 data-g-help-*；Vue / React 使用 config；AngularJS 使用 gardener-config；Blazor 使用 Config。远程检索和反馈提交通过实例 setOptions({load, submit}) 注入真实服务，支持 AbortSignal、错误重试和取消。此处操作事件仅供演示，不会发送外部请求。</p></details>
   <details class="specimen-source"><summary>查看完整示例结构`);return s;});
const sections=Object.entries(helpExamples).map(([name,html])=>`<section data-example="${name}"><h2>${name}</h2><label>变体 <select aria-label="${name} 变体">${Object.keys(helpVariants[name]).map(mode=>`<option>${mode}</option>`).join('')}</select></label><div data-stage>${html}</div></section>`).join('\n');
await writeFile('packages/css/examples/help-lab.html',`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>帮助组件 · 完整演示</title><link rel="stylesheet" href="../dist/gardener.css"><link rel="stylesheet" href="./help-demo.css"><style>body{background:var(--g-color-canvas);color:var(--g-color-text)}main{max-width:1000px;margin:24px auto;padding:16px}section{margin-block:32px;min-width:0}h1{font-size:28px}h2{font-size:20px}</style></head><body><main id="help-intro"><h1>帮助组件 · 完整演示</h1><p>29 个组件。切换变体、检索内容、操作清单或启动引导。反馈仅触发应用事件，不发送外部请求。</p>${sections}<output id="help-result" aria-live="polite"></output></main><script type="module">import {installHelpDemo} from './help-demo-services.js';import {init,destroy,getInstance} from '../dist/gardener.runtime.js';const examples=await fetch('./help-examples.json').then(r=>r.json());const service=document.createElement('select');service.setAttribute('aria-label','服务演示');service.innerHTML='<option value=none>仅事件</option><option value=success>本地成功</option><option value=error>失败后重试</option>';document.querySelector('main').prepend(service);function mount(scope){init(scope);for(const root of scope.querySelectorAll('[data-g-help]'))installHelpDemo(root,getInstance(root,'help'),service.value);}mount(document);service.addEventListener('change',()=>{for(const section of document.querySelectorAll('[data-example]'))section.querySelector('select').dispatchEvent(new Event('change'));});for(const section of document.querySelectorAll('[data-example]'))section.querySelector('select').addEventListener('change',event=>{const stage=section.querySelector('[data-stage]');destroy(stage);stage.innerHTML=examples[section.dataset.example][event.target.value].html;mount(stage);});for(const name of ['change','action','complete'])document.addEventListener('gardener:'+name,event=>document.querySelector('#help-result').textContent=JSON.stringify(event.detail));</script></body></html>`);
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/HelpLab.razor',`@page "/help"
@using System.Text.Json
@using Microsoft.JSInterop
@inject IJSRuntime JS
@implements IAsyncDisposable
<PageTitle>帮助组件 · Blazor</PageTitle>
<link rel="stylesheet" href="help-demo.css" />
<h1 id="help-intro">帮助组件 · Blazor</h1>
<label>组件<select id="help-kind" @bind="Name" @bind:after="Reset">@foreach(var name in Names){<option>@name</option>}</select></label>
<label>变体<select id="help-mode" @bind="Mode" @bind:after="ResetState">@foreach(var mode in Examples.RootElement.GetProperty(Name).EnumerateObject()){<option>@mode.Name</option>}</select></label>
<label>服务演示<select id="help-service" @bind="Service"><option value="none">仅事件</option><option value="success">本地成功</option><option value="error">失败后重试</option></select></label>
<button class="g-btn" id="help-size" @onclick="ToggleSize">切换尺寸</button>
<div class="help-demo-host"><div class="help-demo-targets"><button data-help-demo-target="@(Name+"-create")">创建项目</button><button data-help-demo-target="@(Name+"-team")">成员管理</button><button data-help-demo-target="@(Name+"-export")">导出</button></div>
<GardenerimComponent @key="Name+Mode+Service" Name="@Name" Variant="@Mode" Config="Options" EventNames="@(new[]{"change","action","complete","error"})" OnEvent="Changed" id="help-root" />
<details><summary>项目操作指南</summary><p id="@("help-guide-"+Name)">邀请成员：在项目设置中选择成员管理，创建邀请链接并配置权限。导出：在项目菜单中选择 CSV 或 JSON。恢复：预览历史快照，确认后生成新的恢复版本，旧历史仍保留。</p></details>
<output class="help-demo-result" id="help-state">@State</output></div>
@code {
private static readonly JsonDocument Examples=JsonDocument.Parse("""
${json}
""");
private static readonly string[] Names=Examples.RootElement.EnumerateObject().Select(p=>p.Name).ToArray();
private string Service{get;set;}="none";private IJSObjectReference? Module;
protected override async Task OnAfterRenderAsync(bool firstRender){Module??=await JS.InvokeAsync<IJSObjectReference>("import","./help-demo.js");await Module.InvokeVoidAsync("install","help-root",Service);}
public async ValueTask DisposeAsync(){if(Module is not null){try{await Module.DisposeAsync();}catch(JSDisconnectedException){}}}
private string Name{get;set;}="faq";private string Mode{get;set;}="default";private string State="{}";private string Size="";
private IReadOnlyDictionary<string,object?> Options {get {var options=JsonSerializer.Deserialize<Dictionary<string,object?>>(Examples.RootElement.GetProperty(Name).GetProperty(Mode).GetProperty("options").GetRawText())!;if(Size!="")options["size"]=Size;return new Dictionary<string,object?>{["helpOptions"]=JsonSerializer.Serialize(options),["helpValue"]=State,["helpDisabled"]=false};}}
private void ToggleSize(){Size=Size=="small"?"medium":"small";}
private void Reset(){Mode=Examples.RootElement.GetProperty(Name).EnumerateObject().First().Name;ResetState();}
private void ResetState(){Size="";var options=Examples.RootElement.GetProperty(Name).GetProperty(Mode).GetProperty("options");State=options.TryGetProperty("defaultValue",out var value)?value.GetRawText():"{}";}
private void Changed(Gardenerim.Blazor.Models.GardenerimEventArgs args){if(args.EventName=="gardener:change"&&args.Detail is IReadOnlyDictionary<string,object?> values&&values.TryGetValue("value",out var value))State=JsonSerializer.Serialize(value);}
}
`);
