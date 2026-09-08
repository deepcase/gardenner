import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';import {aiVariants,aiExamples,aiDemoCss,aiDemoServices,aiPreviewSvg} from './ai-examples.mjs';
const edit=async(p,fn)=>{const s=fs.readFileSync(p,'utf8');await writeFile(p,fn(s));};const json=JSON.stringify(aiVariants);
for(const p of ['../GardenerDemo/src/data/ai-examples.json','packages/css/examples/ai-examples.json'])await writeFile(p,json+'\n');
for(const p of ['../GardenerDemo/src/ai-demo.css','packages/css/examples/ai-demo.css','packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot/ai-demo.css'])await writeFile(p,aiDemoCss+'\n');
for(const p of ['../GardenerDemo/public/ai-preview.svg','packages/css/examples/ai-preview.svg','packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot/ai-preview.svg'])await writeFile(p,aiPreviewSvg+'\n');
await writeFile('packages/css/examples/ai-demo-services.js',aiDemoServices);
const ts=aiDemoServices.replace("root,api,mode='recorded'","root: HTMLElement,api: any,mode='recorded'").replace('delay=(signal,ms=160)','delay=(signal: AbortSignal,ms=160)').replace('new Promise((resolve,reject)=>','new Promise<void>((resolve,reject)=>').replaceAll('async({signal})','async({signal}: {signal:AbortSignal})').replaceAll('function*({signal})','function*({signal}: {signal:AbortSignal})').replace("root.addEventListener('gardener:action',event=>", "root.addEventListener('gardener:action',((event: CustomEvent)=>").replaceAll('filter(item=>','filter((item:any)=>').replace("api.setOptions({items:original.items});}});","api.setOptions({items:original.items});}}) as EventListener);");await writeFile('../GardenerDemo/src/ai-demo-services.ts',ts);
await edit('../GardenerDemo/scripts/build-examples.mjs',s=>s.includes('import { aiExamples }')?s:"import { aiExamples } from '../../Gardener/scripts/ai-examples.mjs';\n"+s.replace('Object.assign(overrides, helpExamples);','Object.assign(overrides, helpExamples);\nObject.assign(overrides, aiExamples);'));
await edit('../GardenerDemo/src/preview.ts',s=>{if(!s.includes('import aiVariants'))s="import aiVariants from './data/ai-examples.json';\nimport {installAIDemo} from './ai-demo-services';\nimport './ai-demo.css';\n"+s;if(!s.includes("definition?.category==='ai'"))s=s.replace('document.title =',"if(definition?.category==='ai'){const variants=(aiVariants as Record<string,Record<string,{html:string}>>)[name];fixture=variants?.[params.get('variant')||'']||Object.values(variants||{})[0]||fixture;}\ndocument.title =");if(!s.includes("if(definition!.category==='ai')"))s=s.replace("if(definition!.category==='help'){",`if(definition!.category==='ai'){
        const options=JSON.parse(String(attrs['data-g-ai-options']));
        for(const key of ['size','direction','format','submitKey']){const value=params.get('ai-'+key);if(value)options[key]=value;}
        for(const key of ['bordered','readonly','searchable','autoscroll','showActions']){const value=params.get('ai-'+key);if(value)options[key]=value==='true';}
        for(const key of ['columns','height','pageSize','maxLength','used','limit']){const value=params.get('ai-'+key);if(value)options[key]=Number(value);}
        if(state==='disabled')attrs['data-g-ai-disabled']='true';attrs['data-g-ai-options']=JSON.stringify(options);
        if(params.get('ai-controlled')==='true')attrs['data-g-ai-value']=JSON.stringify({messages:options.messages||[],status:options.status||'idle',...(options.defaultValue||{})});
      }
      if(definition!.category==='help'){`);if(!s.includes("if(definition.category==='ai')"))s=s.replace("if(definition.category==='help'){",`if(definition.category==='ai'){
    installAIDemo(selected,getInstance(selected,'ai'),params.get('ai-service')||'recorded');
    selected.addEventListener('gardener:change',((event:CustomEvent)=>{if(event.target!==selected)return;if(event.detail.controlled)selected.setAttribute('data-g-ai-value',JSON.stringify(event.detail.value));result.hidden=false;result.textContent='当前状态：'+JSON.stringify(event.detail.value);}) as EventListener);
    for(const name of ['action','complete','error'])selected.addEventListener('gardener:'+name,((event:CustomEvent)=>{if(event.target!==selected)return;result.hidden=false;result.textContent='本地演示事件：'+JSON.stringify(event.detail);}) as EventListener);
  }
  if(definition.category==='help'){`);return s.replace("['interaction','content','layout','help'].includes(definition.category)","['interaction','content','layout','help','ai'].includes(definition.category)");});
await edit('../GardenerDemo/src/preview-actions.ts',s=>s.includes('[data-g-ai-options]')?s:s.replace("[data-g-help-options]')","[data-g-help-options],[data-g-ai-options]')"));
await edit('../GardenerDemo/src/App.vue',s=>s.includes("normalizedQuery.value === 'ai'")?s:s.replace("if (normalizedQuery.value === 'help'","if (normalizedQuery.value === 'ai' || normalizedQuery.value === '人工智能') return component.category === 'ai';\n  if (normalizedQuery.value === 'help'"));
await edit('../GardenerDemo/src/components/ComponentShowcase.vue',s=>{if(!s.includes('const ai=ref'))s=s.replace('const help=ref',"const ai=ref({size:'medium',bordered:'true',direction:'ltr',format:'',readonly:'',searchable:'',columns:'',height:'360',pageSize:'20',maxLength:'4000',autoscroll:'true',showActions:'true',submitKey:'enter',controlled:'false',service:'recorded'});\nconst help=ref");if(!s.includes("props.definition.category==='ai'?"))s=s.replace("props.definition.category==='help'?","props.definition.category==='ai'?Object.fromEntries(Object.entries(ai.value).map(([k,v])=>['ai-'+k,v])):props.definition.category==='help'?");if(!s.includes('v-model="ai.size"'))s=s.replace('<div class="specimen-controls">',`<div class="specimen-controls">
    <template v-if="definition.category==='ai'">
      <label>尺寸<select v-model="ai.size" aria-label="AI 尺寸"><option value="small">紧凑</option><option value="medium">标准</option><option value="large">宽松</option></select></label>
      <label>边框<select v-model="ai.bordered" aria-label="AI 边框"><option value="true">显示</option><option value="false">隐藏</option></select></label>
      <label>方向<select v-model="ai.direction" aria-label="AI 方向"><option value="ltr">从左到右</option><option value="rtl">从右到左</option></select></label>
      <label>只读<select v-model="ai.readonly" aria-label="AI 只读"><option value="">跟随变体</option><option value="true">启用</option><option value="false">关闭</option></select></label>
      <label v-if="['chat','message','ai-workspace','streaming-response','artifact-panel','artifact-workspace'].includes(definition.name)">内容格式<select v-model="ai.format" aria-label="AI 内容格式"><option value="">跟随变体</option><option value="markdown">Markdown</option><option value="plain">纯文本</option><option value="code">代码</option></select></label>
      <label v-if="['chat','ai-workspace','prompt-composer'].includes(definition.name)">发送按键<select v-model="ai.submitKey" aria-label="AI 发送按键"><option value="enter">Enter</option><option value="ctrl-enter">Ctrl / ⌘ + Enter</option></select></label>
      <label v-if="['chat','ai-workspace','prompt-composer','streaming-response','tool-approval','ai-feedback'].includes(definition.name)">服务演示<select v-model="ai.service" aria-label="AI 服务演示"><option value="recorded">预录内容 / 本地成功</option><option value="error">本地失败后重试</option></select></label>
      <label>状态管理<select v-model="ai.controlled" aria-label="AI 状态管理"><option value="false">组件管理</option><option value="true">外部受控</option></select></label>
    </template>`);if(!s.includes('五端 AI 参数'))s=s.replace('<details class="specimen-source"><summary>查看完整示例结构',`<details v-if="definition.category==='ai'" class="specimen-source"><summary>五端 AI 参数</summary><p>aiOptions 配置 kind、mode、title、description、items、messages、format、size、bordered、columns、readonly、searchable、height、submitKey、maxLength、maxOutput、maxFiles、maxFileSize、used、limit、scope、expiresAt 与 labels。aiValue 控制 draft、selected、model、messages、output、status、expanded、checked、decision、rating 和 reason。</p><p>实例 setOptions 注入 generate、approve、submitFeedback 或 record。generate 接收 AbortSignal 并返回文本或 AsyncIterable；支持取消、暂停、继续和错误重试。演示服务只播放预录数据，不连接模型、不发送文件、不执行工具。</p></details>
   <details class="specimen-source"><summary>查看完整示例结构`);return s;});
const sections=Object.entries(aiExamples).map(([name,html])=>`<section data-example="${name}"><h2>${name}</h2><label>变体<select aria-label="${name} 变体">${Object.keys(aiVariants[name]).map(mode=>`<option>${mode}</option>`).join('')}</select></label><div data-stage>${html}</div></section>`).join('\n');
await writeFile('packages/css/examples/ai-lab.html',`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI 组件 · 完整演示</title><link rel="stylesheet" href="../dist/gardener.css"><link rel="stylesheet" href="./ai-demo.css"><style>body{background:var(--g-color-canvas);color:var(--g-color-text)}main{max-width:1100px;margin:24px auto;padding:16px}section{margin-block:32px;min-width:0}h1{font-size:28px}h2{font-size:20px}</style></head><body><main><h1>AI 组件 · 完整演示</h1><p>38 个组件、119 个变体。生成播放预录文本，服务调用在本地模拟，不连接模型或执行工具。</p>${sections}<output id="ai-result" aria-live="polite"></output></main><script type="module">import {init,destroy,getInstance} from '../dist/gardener.runtime.js';import {installAIDemo} from './ai-demo-services.js';const examples=await fetch('./ai-examples.json').then(r=>r.json());function mount(scope){init(scope);for(const root of scope.querySelectorAll('[data-g-ai]'))installAIDemo(root,getInstance(root,'ai'));}mount(document);for(const section of document.querySelectorAll('[data-example]'))section.querySelector('select').addEventListener('change',event=>{const stage=section.querySelector('[data-stage]');destroy(stage);stage.innerHTML=examples[section.dataset.example][event.target.value].html;mount(stage);});for(const name of ['change','action','complete','error'])document.addEventListener('gardener:'+name,event=>document.querySelector('#ai-result').textContent=JSON.stringify(event.detail));</script></body></html>`);
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot/ai-demo.js',"import {init,getInstance} from './_content/Gardenerim.Blazor/gardener.runtime.min.js';\n"+aiDemoServices+"\nconst installed=new WeakMap();export function install(id,mode){const root=document.getElementById(id);if(!root)return;init(root);const api=getInstance(root,'ai');if(api&&installed.get(root)!==api){installed.set(root,api);installAIDemo(root,api,mode);}}\n");
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/AILab.razor',`@page "/ai"
@using System.Text.Json
@using Microsoft.JSInterop
@inject IJSRuntime JS
@implements IAsyncDisposable
<PageTitle>AI 组件 · Blazor</PageTitle>
<link rel="stylesheet" href="ai-demo.css" />
<h1>AI 组件 · Blazor</h1>
<p>本地模拟服务，生成使用预录文本；不连接模型，不执行真实工具。</p>
<label>组件<select id="ai-kind" @bind="Name" @bind:after="Reset">@foreach(var name in Names){<option>@name</option>}</select></label>
<label>变体<select id="ai-mode" @bind="Mode" @bind:after="ResetState">@foreach(var mode in Examples.RootElement.GetProperty(Name).EnumerateObject()){<option>@mode.Name</option>}</select></label>
<label>服务演示<select id="ai-service" @bind="Service" @bind:after="ResetState"><option value="recorded">本地成功</option><option value="error">失败后重试</option></select></label>
<button class="g-btn" id="ai-size" @onclick="ToggleSize">切换尺寸</button>
<div class="ai-demo-host"><GardenerimComponent @key="Name+Mode+Service" Name="@Name" Variant="@Mode" Config="Options" EventNames="@(new[]{"change","action","complete","error"})" OnEvent="Changed" id="ai-root" /><output id="ai-state">@Result</output></div>
@code {
private static readonly JsonDocument Examples=JsonDocument.Parse("""
${json}
""");
private static readonly string[] Names=Examples.RootElement.EnumerateObject().Select(p=>p.Name).ToArray();
private string Name{get;set;}="chat";private string Mode{get;set;}="default";private string Service{get;set;}="recorded";private string State="{}";private string Result="";private string Size="medium";private IJSObjectReference? Module;
private JsonElement Fixture=>Examples.RootElement.GetProperty(Name).GetProperty(Mode).GetProperty("options");
private IReadOnlyDictionary<string,object?> Options=>new Dictionary<string,object?>{["aiOptions"]=Fixture.GetRawText(),["aiValue"]=State,["aiSize"]=Size,["aiDisabled"]=false};
protected override void OnInitialized(){ResetState();}
private void ToggleSize(){Size=Size=="medium"?"small":"medium";}
private void Reset(){Mode=Examples.RootElement.GetProperty(Name).EnumerateObject().First().Name;ResetState();}
private void ResetState(){var initial=new Dictionary<string,object?>();if(Fixture.TryGetProperty("messages",out var messages))initial["messages"]=messages;if(Fixture.TryGetProperty("status",out var status))initial["status"]=status;if(Fixture.TryGetProperty("defaultValue",out var value))foreach(var property in value.EnumerateObject())initial[property.Name]=property.Value;State=JsonSerializer.Serialize(initial);Result="";}
private void Changed(Gardenerim.Blazor.Models.GardenerimEventArgs args){Result=JsonSerializer.Serialize(args.Detail);if(args.EventName=="gardener:change"&&args.Detail is IReadOnlyDictionary<string,object?> values&&values.TryGetValue("value",out var value))State=JsonSerializer.Serialize(value);}
protected override async Task OnAfterRenderAsync(bool firstRender){Module??=await JS.InvokeAsync<IJSObjectReference>("import","./ai-demo.js");await Module.InvokeVoidAsync("install","ai-root",Service);}
public async ValueTask DisposeAsync(){if(Module is not null){try{await Module.DisposeAsync();}catch(JSDisconnectedException){}}}
}
`);
