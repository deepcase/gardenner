import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
import {dashboardOptions} from './dashboard-examples.mjs';
import {dashboardDemoServices} from './dashboard-demo-services.mjs';
const params=JSON.parse(fs.readFileSync('scripts/dashboard-release-parameters.json'));
const variants=Object.fromEntries(JSON.parse(fs.readFileSync('packages/css/metadata/components.json')).components.filter(c=>c.category==='dashboard').map(c=>[c.name,c.variants]));
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/DashboardLab.razor',`@page "/dashboard"
@using System.Text.Json
@using Microsoft.JSInterop
@implements IAsyncDisposable
@inject IJSRuntime JS
<PageTitle>仪表盘 · Blazor</PageTitle>
<h1>仪表盘 · Blazor</h1>
<div style="max-width:900px;display:grid;gap:16px">
<label>组件<select id="dashboard-kind" @bind="Name" @bind:after="Reset">@foreach(var name in Names){<option>@name</option>}</select></label>
<label>变体<select id="dashboard-variant" @bind="Mode"><option value="">默认</option>@foreach(var v in Variants.RootElement.GetProperty(Name).EnumerateArray()){<option>@v.GetString()</option>}</select></label>
<label>本地服务<select id="dashboard-service" @bind="Service" @bind:after="ResetState"><option value="success">成功</option><option value="retry">失败后重试</option><option value="timeout">超时</option><option value="none">未接入</option></select></label>
<details><summary>参数组合</summary><div style="display:flex;flex-wrap:wrap;gap:12px">
${params.map(([k,l,vs])=>`<label>${l}<select id="dashboard-${k}" value="@Parameters.GetValueOrDefault("${k}","")" @onchange='e=>ParameterChanged("${k}",e)'><option value="">默认</option>${vs.map(v=>`<option>${v}</option>`).join('')}</select></label>`).join('\n')}
</div></details>
<button id="dashboard-resize" class="g-btn" @onclick="ToggleSize">切换尺寸</button>
<GardenerimComponent @key="@(Name+Service)" Name="@Name" Variant="@Mode" Config="Options" data-demo-dashboard-service="@Service" EventNames="@(new[]{"change","error"})" OnEvent="Changed" id="dashboard-root"><label>交接备注<input class="g-input" value="保留草稿" /></label></GardenerimComponent>
<output id="dashboard-state" style="overflow-wrap:anywhere">@Result</output>
<p>7 个组件、39 个变体共用数据和样式。配置更新保留草稿；本地加载可成功、重试、超时或取消。业务数据由宿主服务提供。</p>
</div>
@code {
private static readonly JsonDocument Examples=JsonDocument.Parse("""
${JSON.stringify(dashboardOptions)}
""");
private static readonly JsonDocument Variants=JsonDocument.Parse("""
${JSON.stringify(variants)}
""");
private static readonly string[] Names=Examples.RootElement.EnumerateObject().Select(p=>p.Name).ToArray();
private string Name {get;set;}="kpi-stat";
private string Mode="",Service="success",Size="",State="{}",Result="";
private Dictionary<string,string> Parameters=new();
private IJSObjectReference? Module;
private void ParameterChanged(string key,ChangeEventArgs args){Parameters[key]=args.Value?.ToString()??"";if(key=="size")Size="";}
private IReadOnlyDictionary<string,object?> Options {get{var data=JsonSerializer.Deserialize<Dictionary<string,object?>>(Examples.RootElement.GetProperty(Name).GetRawText())!;foreach(var pair in Parameters){if(pair.Value=="")continue;data[pair.Key]=bool.TryParse(pair.Value,out var flag)?(object)flag:int.TryParse(pair.Value,out var number)?(object)number:pair.Value;}return new Dictionary<string,object?>{["dashboardOptions"]=JsonSerializer.Serialize(data),["dashboardValue"]=State,["dashboardSize"]=(Parameters.GetValueOrDefault("size","")==""?Size:Parameters["size"]),["dashboardBordered"]=Parameters.GetValueOrDefault("bordered","")==""?(object?)null:Parameters["bordered"]=="true",["dashboardDisabled"]=false};}}
private void ToggleSize(){Size=Size=="small"?"large":"small";}
private void Reset(){Mode="";Size="";Parameters.Clear();ResetState();}
private void ResetState(){State="{}";Result="";}
private void Changed(Gardenerim.Blazor.Models.GardenerimEventArgs args){Result=JsonSerializer.Serialize(args.Detail);if(args.EventName=="gardener:change" && args.Detail is IReadOnlyDictionary<string,object?> values && values.TryGetValue("value",out var value))State=JsonSerializer.Serialize(value);}
protected override async Task OnAfterRenderAsync(bool firstRender){Module??=await JS.InvokeAsync<IJSObjectReference>("import","./dashboard-demo.js");await Module.InvokeVoidAsync("install","dashboard-root");}
public async ValueTask DisposeAsync(){if(Module is not null){try{await Module.DisposeAsync();}catch(JSDisconnectedException){}}}
}
`);
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot/dashboard-demo.js','import {getInstance} from "./_content/Gardenerim.Blazor/gardener.runtime.min.js";\n'+dashboardDemoServices+'\nconst installed=new WeakMap();export function install(id){const root=document.getElementById(id);if(!root)return;const api=getInstance(root,"dashboard");if(api&&installed.get(root)!==api){for(const controls of document.querySelectorAll("[data-dashboard-service-controls]"))controls.remove();installDashboardDemo(root,api);installed.set(root,api);}}');
