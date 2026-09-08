import fs from 'node:fs';import {Window} from '../packages/css/node_modules/happy-dom/lib/index.js';import {dataExamples} from './data-examples.mjs';import {dataDemoServices} from './data-demo-services.mjs';import {writeFile} from './fs-retry.mjs';
const window=new Window(),catalog=JSON.parse(fs.readFileSync('packages/css/metadata/components.json')).components.filter(c=>c.category==='data'),params=JSON.parse(fs.readFileSync('scripts/data-release-parameters.json'));
const fixtures={};for(const c of catalog){const wrapper=window.document.createElement('div');wrapper.innerHTML=dataExamples[c.name];const convert=n=>n.nodeType===3?{text:n.textContent}:n.nodeType===1?{tag:n.localName,attrs:Object.fromEntries([...n.attributes].map(a=>[a.name,a.value])),target:n.hasAttribute('data-demo-component'),html:n.innerHTML,children:n.hasAttribute('data-demo-component')?[]:[...n.childNodes].map(convert).filter(Boolean)}:null;const target=wrapper.querySelector('[data-demo-component]');fixtures[c.name]={nodes:[...wrapper.childNodes].map(convert).filter(Boolean),data:JSON.parse(target.getAttribute('data-g-data-options')||'null'),grid:JSON.parse(target.getAttribute('data-g-grid-options')||'null')};}
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/DataLab.razor',`@page "/data"
@using System.Text.Json
@using Microsoft.JSInterop
@using Microsoft.AspNetCore.Components.Rendering
@implements IAsyncDisposable
@inject IJSRuntime JS
<PageTitle>数据展示 · Blazor</PageTitle>
<h1>数据展示 · Blazor</h1>
<div style="max-width:1000px;display:grid;gap:16px">
<label>组件<select id="data-kind" @bind="Name" @bind:after="Reset">@foreach(var name in Names){<option>@name</option>}</select></label>
<label>变体<select id="data-variant" @bind="Mode"><option value="">默认</option>@foreach(var v in Variants.RootElement.GetProperty(Name).EnumerateArray()){<option>@v.GetString()</option>}</select></label>
<label>本地服务<select id="data-service" @bind="Service" @bind:after="ResetKeys"><option>success</option><option>retry</option><option>timeout</option><option>none</option></select></label>
<details><summary>参数组合</summary><div style="display:flex;flex-wrap:wrap;gap:12px">
${params.map(([k,l,vs])=>`<label>${l}<select id="data-${k}" value="@Parameters.GetValueOrDefault("${k}","")" @onchange='e=>ParameterChanged("${k}",e)'><option value="">默认</option>${vs.map(v=>'<option>'+v+'</option>').join('')}</select></label>`).join('\n')}
</div></details>
<button id="data-resize" class="g-btn" @onclick="ToggleSize">切换尺寸</button>
<div id="data-scope" @key="@(Name+Service)" style="min-width:0">@Fixture</div>
<output id="data-state" style="overflow-wrap:anywhere">@Result</output>
<p>全部 52 个组件及 252 个变体。静态结构通过 ChildContent，网格通过 gridOptions，13 个托管组件通过 dataOptions 配置；本地服务仅作演示。</p>
</div>
@code {
private static readonly JsonDocument Examples=JsonDocument.Parse("""
${JSON.stringify(fixtures)}
""");
private static readonly JsonDocument Variants=JsonDocument.Parse("""
${JSON.stringify(Object.fromEntries(catalog.map(c=>[c.name,c.variants])))}
""");
private static readonly string[] Names=Examples.RootElement.EnumerateObject().Select(p=>p.Name).ToArray();
private string Name {get;set;}="virtual-list";
private string Mode="",Size="",Service="success",Keys="[]",Result="";
private Dictionary<string,string> Parameters=new();private IJSObjectReference? Module;
private void Reset(){Mode="";Size="";Parameters.Clear();ResetKeys();}
private void ResetKeys(){Keys="[]";Result="";}
private void ParameterChanged(string key,ChangeEventArgs args){Parameters[key]=args.Value?.ToString()??"";if(key=="size")Size="";}
private void ToggleSize(){Size=Size=="small"?"large":"small";}
private IReadOnlyDictionary<string,object?> Options {get{var sample=Examples.RootElement.GetProperty(Name);var options=new Dictionary<string,object?>{["dataSize"]=Parameters.GetValueOrDefault("size","")==""?Size:Parameters["size"],["dataDisabled"]=false,["dataValue"]=Keys};foreach(var k in new[]{"bordered","layout"})if(Parameters.GetValueOrDefault(k,"")!="")options["data"+char.ToUpper(k[0])+k.Substring(1)]=Parameters[k];if(sample.GetProperty("data").ValueKind!=JsonValueKind.Null){var data=JsonSerializer.Deserialize<Dictionary<string,object?>>(sample.GetProperty("data").GetRawText())!;foreach(var pair in Parameters){if(pair.Value=="")continue;data[pair.Key]=bool.TryParse(pair.Value,out var flag)?(object)flag:int.TryParse(pair.Value,out var number)?(object)number:pair.Value;}options["dataOptions"]=JsonSerializer.Serialize(data);}if(sample.GetProperty("grid").ValueKind!=JsonValueKind.Null)options["gridOptions"]=sample.GetProperty("grid").GetRawText();return options;}}
private RenderFragment Fixture=>builder=>{foreach(var node in Examples.RootElement.GetProperty(Name).GetProperty("nodes").EnumerateArray())RenderNode(builder,node);};
private void RenderNode(RenderTreeBuilder builder,JsonElement node){if(node.TryGetProperty("text",out var text)){builder.AddContent(0,text.GetString());return;}var attrs=node.GetProperty("attrs");if(node.GetProperty("target").GetBoolean()){var additional=attrs.EnumerateObject().Where(p=>!new[]{"class","data-demo-component","data-g-data-options","data-g-grid-options"}.Contains(p.Name)).ToDictionary(p=>p.Name,p=>(object)p.Value.GetString()!);additional["id"]="data-root";additional["data-demo-data-service"]=Service;builder.OpenComponent<GardenerimComponent>(1);builder.AddAttribute(2,"Name",Name);builder.AddAttribute(3,"As",node.GetProperty("tag").GetString());builder.AddAttribute(4,"Variant",Mode);builder.AddAttribute(5,"Config",Options);builder.AddAttribute(6,"AdditionalAttributes",additional);builder.AddAttribute(7,"EventNames",new[]{"change","error"});builder.AddAttribute(8,"OnEvent",EventCallback.Factory.Create<Gardenerim.Blazor.Models.GardenerimEventArgs>(this,Changed));builder.AddAttribute(9,"ChildContent",(RenderFragment)(b=>b.AddMarkupContent(0,node.GetProperty("html").GetString())));builder.AddAttribute(10,"Class",attrs.TryGetProperty("class",out var className)?className.GetString():null);builder.CloseComponent();}else{builder.OpenElement(10,node.GetProperty("tag").GetString()!);builder.AddMultipleAttributes(11,attrs.EnumerateObject().Select(p=>new KeyValuePair<string,object>(p.Name,p.Value.GetString()!)));foreach(var child in node.GetProperty("children").EnumerateArray())RenderNode(builder,child);builder.CloseElement();}}
private void Changed(Gardenerim.Blazor.Models.GardenerimEventArgs args){Result=JsonSerializer.Serialize(args.Detail);if(args.Detail is IReadOnlyDictionary<string,object?> values && values.TryGetValue("keys",out var value)&&value is not null)Keys=JsonSerializer.Serialize(value);}
protected override async Task OnAfterRenderAsync(bool firstRender){Module??=await JS.InvokeAsync<IJSObjectReference>("import","./data-demo.js");await Module.InvokeVoidAsync("install");}
public async ValueTask DisposeAsync(){if(Module is not null){try{await Module.InvokeVoidAsync("dispose");await Module.DisposeAsync();}catch(JSDisconnectedException){}}}
}
`);
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot/data-demo.js','import {init,getInstance,destroy} from "./_content/Gardenerim.Blazor/gardener.runtime.min.js";\n'+dataDemoServices+'\nconst installed=new WeakMap();let previous;export function dispose(){if(previous)destroy(previous);previous=null;}export function install(){const scope=document.getElementById("data-scope"),root=document.getElementById("data-root");if(!scope||!root)return;if(previous!==scope){if(previous)destroy(previous);previous=scope;}init(scope);const api=getInstance(root,"data-display");if(api&&installed.get(root)!==api){for(const controls of scope.querySelectorAll("[data-data-service-controls]"))controls.remove();installDataDemo(root,api);installed.set(root,api);}}');
window.happyDOM.abort();
