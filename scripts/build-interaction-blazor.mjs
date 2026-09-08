import {interactionOptions,interactionDemoServices} from './interaction-examples.mjs';
import {writeFile} from './fs-retry.mjs';
await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/InteractionLab.razor',`@page "/interaction"
@using System.Text.Json
@using Microsoft.JSInterop
@implements IAsyncDisposable
@inject IJSRuntime JS
<PageTitle>交互组件 · Blazor</PageTitle>
<h1>交互组件 · Blazor</h1>
<div style="max-width:900px;display:grid;gap:16px">
 <label>组件<select id="interaction-kind" class="g-select" @bind="Name" @bind:after="Reset">@foreach(var name in Names){<option>@name</option>}</select></label>
 <label>变体<select id="interaction-variant" @bind="Mode"><option value="">默认</option>@foreach(var v in Variants.RootElement.GetProperty(Name).EnumerateArray()){<option>@v.GetString()</option>}</select></label>
 <label>本地服务<select id="interaction-service" @bind="Service" @bind:after="ResetState"><option value="success">成功</option><option value="retry">失败重试</option><option value="timeout">超时</option><option value="none">未接入</option></select></label>
 <label>标题<select id="interaction-showHeader" value="@Parameters.GetValueOrDefault("showHeader","")" @onchange='e=>ParameterChanged("showHeader",e)'><option value="">默认</option><option>true</option><option>false</option></select></label>
<label>选择统计<select id="interaction-showCount" value="@Parameters.GetValueOrDefault("showCount","")" @onchange='e=>ParameterChanged("showCount",e)'><option value="">默认</option><option>true</option><option>false</option></select></label>
<label>描述<select id="interaction-showDescriptions" value="@Parameters.GetValueOrDefault("showDescriptions","")" @onchange='e=>ParameterChanged("showDescriptions",e)'><option value="">默认</option><option>true</option><option>false</option></select></label>
<label>图标<select id="interaction-showIcons" value="@Parameters.GetValueOrDefault("showIcons","")" @onchange='e=>ParameterChanged("showIcons",e)'><option value="">默认</option><option>true</option><option>false</option></select></label>
<label>头像<select id="interaction-showAvatars" value="@Parameters.GetValueOrDefault("showAvatars","")" @onchange='e=>ParameterChanged("showAvatars",e)'><option value="">默认</option><option>true</option><option>false</option></select></label>
<label>范围预设<select id="interaction-showPresets" value="@Parameters.GetValueOrDefault("showPresets","")" @onchange='e=>ParameterChanged("showPresets",e)'><option value="">默认</option><option>true</option><option>false</option></select></label>
<label>范围重置<select id="interaction-showReset" value="@Parameters.GetValueOrDefault("showReset","")" @onchange='e=>ParameterChanged("showReset",e)'><option value="">默认</option><option>true</option><option>false</option></select></label>
<label>批处理明细<select id="interaction-showResults" value="@Parameters.GetValueOrDefault("showResults","")" @onchange='e=>ParameterChanged("showResults",e)'><option value="">默认</option><option>true</option><option>false</option></select></label>
<label>快照内容<select id="interaction-showSnapshot" value="@Parameters.GetValueOrDefault("showSnapshot","")" @onchange='e=>ParameterChanged("showSnapshot",e)'><option value="">默认</option><option>true</option><option>false</option></select></label>
<label>列表高度<select id="interaction-listHeight" value="@Parameters.GetValueOrDefault("listHeight","")" @onchange='e=>ParameterChanged("listHeight",e)'><option value="">默认</option><option>160</option><option>240</option><option>480</option></select></label>
<label>最大高度<select id="interaction-maxHeight" value="@Parameters.GetValueOrDefault("maxHeight","")" @onchange='e=>ParameterChanged("maxHeight",e)'><option value="">默认</option><option>320</option><option>480</option><option>640</option></select></label>
<label>列表列数<select id="interaction-columns" value="@Parameters.GetValueOrDefault("columns","")" @onchange='e=>ParameterChanged("columns",e)'><option value="">默认</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
<label>级联列宽<select id="interaction-columnWidth" value="@Parameters.GetValueOrDefault("columnWidth","")" @onchange='e=>ParameterChanged("columnWidth",e)'><option value="">默认</option><option>120</option><option>160</option><option>240</option></select></label>
<label>分栏高度<select id="interaction-splitHeight" value="@Parameters.GetValueOrDefault("splitHeight","")" @onchange='e=>ParameterChanged("splitHeight",e)'><option value="">默认</option><option>240</option><option>360</option><option>480</option></select></label>
<label>服务超时<select id="interaction-serviceTimeout" value="@Parameters.GetValueOrDefault("serviceTimeout","")" @onchange='e=>ParameterChanged("serviceTimeout",e)'><option value="">默认</option><option>200</option><option>1000</option><option>60000</option></select></label>
 <button id="interaction-resize" class="g-btn" @onclick="ToggleSize">切换尺寸</button>
 <GardenerimComponent @key="@(Name+Service)" Name="@Name" Variant="@Mode" data-demo-interaction-service="@Service" Config="Options" EventNames="@(new[]{"change","action","error"})" OnEvent="Changed" id="interaction-root" />
 <output id="interaction-state" style="overflow-wrap:anywhere">@Result</output>
 <p>异步加载和批处理会发出 action 事件，应用可通过运行时 setOptions 注册 load / run 服务。此页使用真实 Blazor 受控状态回写。</p>
</div>
@code {
 private static readonly JsonDocument Examples=JsonDocument.Parse("""
${JSON.stringify(interactionOptions)}
""");
 private static readonly string[] Names=Examples.RootElement.EnumerateObject().Select(p=>p.Name).ToArray();
 private string Name {get;set;}="saved-views";
 private static readonly JsonDocument Variants=JsonDocument.Parse("""
{"saved-views":["compact","comfortable","bordered","borderless","pills","vertical","editable"],"sort-builder":["compact","comfortable","bordered","borderless","inline","stacked"],"selection-controls":["compact","comfortable","bordered","borderless","list","cards"],"batch-toolbar":["compact","comfortable","bordered","borderless","inline","sticky"],"dual-list":["compact","comfortable","bordered","borderless","horizontal","vertical"],"tree-select":["filled","outlined","borderless","underlined","single","multiple","checkable","searchable","clearable","cascade","leaf-only","parent-value","with-header","with-footer","mini","small","medium","large","block","compact","comfortable","bordered"],"cascader":["compact","comfortable","bordered","borderless","compact-columns","wide-columns"],"mention-picker":["compact","comfortable","bordered","borderless","avatar","compact-list"],"user-picker":["compact","comfortable","bordered","borderless","avatar","compact-list"],"organization-picker":["compact","comfortable","bordered","borderless","hierarchical","compact-list"],"resource-picker":["compact","comfortable","bordered","borderless","detailed","compact-list"],"media-picker":["compact","comfortable","bordered","borderless","grid","list"],"icon-picker":["compact","comfortable","bordered","borderless","grid","list"],"color-picker-composition":["compact","comfortable","bordered","borderless","swatches","list"],"date-range-picker-composition":["compact","comfortable","bordered","borderless","inline","stacked"],"time-range-picker-composition":["compact","comfortable","bordered","borderless","inline","stacked"],"saved-filters":["compact","comfortable","bordered","borderless","pills","vertical","editable"],"group-builder":["compact","comfortable","bordered","borderless","inline","stacked"],"entity-picker":["compact","comfortable","bordered","borderless","detailed","compact-list"],"tag-picker":["compact","comfortable","bordered","borderless","pills","list"],"relation-picker":["compact","comfortable","bordered","borderless","detailed","compact-list"],"bulk-confirmation":["compact","comfortable","bordered","borderless","danger","warning"],"bulk-progress":["compact","comfortable","bordered","borderless","detailed","summary"],"action-bar":["default","surface","compact","comfortable","bordered","borderless","wrap","compact-actions"],"bulk-action-bar":["compact","comfortable","bordered","borderless","inline","sticky"],"floating-action-bar":["center","end","contained","compact","comfortable","bordered","borderless","compact-actions"],"sticky-actions":["compact","comfortable","bordered","borderless","top","bottom"],"transfer-list":["compact","comfortable","bordered","borderless","horizontal","vertical"],"split-pane":["compact","comfortable","bordered","borderless","horizontal","vertical","collapsible"],"drag-sort":["compact","comfortable","bordered","borderless","list","cards"],"infinite-scroll":["inline","block","compact","comfortable","bordered","borderless","manual","automatic"],"pull-refresh":["compact","comfortable","bordered","borderless","button","gesture"],"copy-action":["button","icon","text","compact","comfortable","bordered","borderless","with-value"],"fullscreen-action":["button","icon","text","compact","comfortable","bordered","borderless","contained"],"undo-history":["compact","comfortable","bordered","borderless","list","compact-list"]}
""");
 private Dictionary<string,string> Parameters=new();
 private IJSObjectReference? Module;
 private string Mode="",Service="success";
 private void ParameterChanged(string key,ChangeEventArgs args){Parameters[key]=args.Value?.ToString()??"";}
 private string Size="small",State=Examples.RootElement.GetProperty("saved-views").GetProperty("value").GetRawText(),Result="";
 private IReadOnlyDictionary<string,object?> Options {get{var options=JsonSerializer.Deserialize<Dictionary<string,object?>>(Examples.RootElement.GetProperty(Name).GetRawText())!;foreach(var pair in Parameters){if(pair.Value=="")continue;options[pair.Key]=bool.TryParse(pair.Value,out var flag)?(object)flag:int.TryParse(pair.Value,out var number)?(object)number:pair.Value;}return new Dictionary<string,object?>{["interactionOptions"]=JsonSerializer.Serialize(options),["interactionValue"]=State,["interactionSize"]=Size,["interactionDisabled"]=false};}}
 private void ToggleSize(){Size=Size=="small"?"large":"small";}
 private void Reset(){Mode="";Parameters.Clear();ResetState();}
 private void ResetState(){State=Examples.RootElement.GetProperty(Name).TryGetProperty("value",out var value)?value.GetRawText():"{}";Result="";}
 private void Changed(Gardenerim.Blazor.Models.GardenerimEventArgs args){Result=JsonSerializer.Serialize(args.Detail);if(args.EventName=="gardener:change" && args.Detail is IReadOnlyDictionary<string,object?> values && values.TryGetValue("value",out var value))State=JsonSerializer.Serialize(value);}
 protected override async Task OnAfterRenderAsync(bool firstRender){Module??=await JS.InvokeAsync<IJSObjectReference>("import","./interaction-demo.js");await Module.InvokeVoidAsync("install","interaction-root");}
 public async ValueTask DisposeAsync(){if(Module is not null){try{await Module.DisposeAsync();}catch(JSDisconnectedException){}}}
}
`);

await writeFile('packages/blazor/samples/Gardenerim.Blazor.Demo/wwwroot/interaction-demo.js','import {getInstance} from "./_content/Gardenerim.Blazor/gardener.runtime.min.js";\n'+interactionDemoServices+'\nconst installed=new WeakMap();export function install(id){const root=document.getElementById(id);if(!root)return;const api=getInstance(root,"interaction");if(api&&installed.get(root)!==api){installed.set(root,api);installInteractionDemo(root,api);}}\n');
