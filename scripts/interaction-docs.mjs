import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const inventory=JSON.parse(fs.readFileSync('docs/interaction/inventory.json'));
await writeFile('docs/interaction/README.md',`# 交互组件

34 个既有组件已补齐数据配置与操作演示，新增 undo-history，共 35 个组件、239 个可组合变体。复用已有 command-palette、shortcut-list、shortcut-recorder，不重复创建快捷键、命令入口或持久化版本历史。

## 参数和尺寸

| 参数 | 类型 / 默认 | 用途 |
| --- | --- | --- |
| interactionOptions | JSON 字符串；必需 | 启用新数据模式，kind 指定组件名 |
| interactionValue | JSON 字符串；省略时非受控 | 完整或部分状态对象；change 返回 value 后由应用写回 |
| interactionSize | small / medium / large；medium | 控件高度 28 / 32 / 36px，文字 12 / 14 / 14px |
| interactionBordered | true / false；true | 显式边框开关，false 不丢失 |
| interactionDisabled | true / false；false | 禁止 UI 和 API 修改；HTML 空属性也表示禁用 |
| interactionOrientation | horizontal / vertical | 穿梭和分栏布局方向 |
| interactionLimit | 正整数；100 | 选择和穿梭容量 |

compact / comfortable 调整内距为 12 / 20px；默认 16px。显式尺寸优先于密度变体。全部使用共享设计变量，支持主题、深色、RTL 与窄屏；分栏在窄屏仍可键盘调整。

## 数据模型

options.items 接受 {key, label, description?, disabled?, children?, avatar?, icon?, color?}；key 在整棵树内唯一。标签按文本渲染，不解释 HTML。选择类支持 multiple、searchable、clearable、leafOnly、cascade、limit、labels 和只读 readOnly。树选择支持 checkedStrategy（all / parent / leaf，默认 all）及 cascade（默认 true）；multiple:false 或 cascade:false 为独立选择。树选择保留旧 DOM 模式；新模式支持动态数据、展开收起、搜索和父子选择。级联按父路径显示后续列。

| 组件族 | 专用参数 | 状态 / 操作 |
| --- | --- | --- |
| 保存视图、筛选及各类选择器 | items、multiple、searchable、clearable、editable、leafOnly、cascade | keys；select、清空、键盘移动；editable 视图可本地创建 |
| 选择控制、批量操作条 | actions[{key,label,tone,disabled,requiresSelection}] | keys；全选与部分选中；action 交给应用处理 |
| dual-list / transfer-list | items、limit、方向 | targetKeys；move(keys, add/remove)；搜索后仅操作勾选项 |
| sort-builder / group-builder | fields[{key,label}]、maxRules | rules[{field,direction}]；添加、移除、更换字段与顺序方向 |
| 日期 / 时间范围 | min、max、presets[{label,start,end}] | range{start,end}；拒绝非法日期、越界和倒序 |
| split-pane | panels[文本,文本]、minRatio、maxRatio、step、orientation | ratio；鼠标、触摸、方向键、Home / End |
| drag-sort | items | order；拖放或上移 / 下移按钮 |
| bulk-confirmation | description、confirmLabel、items | agreed；确认勾选后才发出可取消的确认操作 |
| bulk-progress | items、concurrency(1–8)、run | results；并发处理、取消、逐项错误和失败重试 |
| infinite-scroll / pull-refresh | load、hasMore、automatic、gesture、threshold | 可取消异步加载；手动 / 自动加载，按钮 / 手势刷新 |
| copy-action / fullscreen-action | text / description | 真实 Clipboard / Fullscreen API；失败发出 error，不显示虚假成功 |
| undo-history | historyLimit(默认30)、editable | history[{label,value}]、cursor；commit、undo、redo，分支编辑截断旧重做记录 |

共用 loading、empty、error、disabled、readonly 状态；options.labels 可替换界面文案。新模式通过 data-g-interaction-options 显式启用，旧 DOM 行为仍兼容。框架更新参数保留新控制器；旧选择器配置仍按原生命周期更新。

## 五种用法

CSS：给组件根添加 data-g-interaction 和 data-g-interaction-options，调用 init(root)。按需样式包为 @gardenerim/css/component/selection-compositions.css，并配合 core.css。

Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 使用相同参数名。JSON 数据先序列化；布尔配置直接传布尔值。

\`\`\`js
const config = {
  interactionOptions: JSON.stringify({kind:'user-picker', multiple:true,
    items:[{key:'lin',label:'林晓'},{key:'chen',label:'陈嘉'}]}),
  interactionSize:'medium', interactionBordered:true, interactionDisabled:false,
  interactionValue: JSON.stringify({keys:[]})
};
// Vue: <GUserPicker :config="config" @update:model-value="writeBack" />
// React: <GUserPicker config={config} onValueChange={writeBack} />
// AngularJS: <div g-user-picker gardener-config="config" gardener-on-value-change="writeBack($value)"></div>
// Blazor: <GUserPicker Config="Config" ValueChanged="WriteBack" />
function writeBack(value) { config.interactionValue = JSON.stringify(value); }
\`\`\`

事件：beforechange 可 preventDefault；change.detail.value 是下一状态，controlled 表示需应用回写；action 表示业务意图 / 外部操作结果；error 包含 reason、message。只订阅根事件，避免嵌套组件污染模型。

运行时 getInstance(root,'interaction') 提供 setOptions、getState、refresh、setValue、select、move、reorder、addRule、removeRule、setRange、load、run、cancel、commit、undo、redo、copy、toggleFullscreen、destroy。函数配置经 setOptions 传入，不能塞进 JSON 属性。

\`\`\`js
api.setOptions({load: async ({signal,offset,query,reset}) => {
  const response = await fetch('/api/items?offset='+offset+'&q='+encodeURIComponent(query), {signal});
  if (!response.ok) throw new Error('Load failed');
  return response.json(); // {items: [{key,label}], hasMore: boolean}
}, run: async (item,{signal}) => {
  const response = await fetch('/api/process/'+encodeURIComponent(item.key), {method:'POST',signal});
  if (!response.ok) throw new Error('Processing failed');
}});
\`\`\`

取消 / 销毁会中止 signal，并忽略迟到结果。复制和全屏取决于浏览器权限。演示异步服务使用本地数据，不请求业务后端。撤销仅管理应用提供的本地快照，不能撤销已发送的网络请求。


## 发布复查：参数与行为扩展

本轮复查现有 35 个组件、239 个变体；不新增重复组件。Options 新增 17 项配置，五端通过同名 JSON 接口传递。

| 参数 | 默认 / 范围 | 用途 |
| --- | --- | --- |
| size / bordered | medium / true | Options 可直接指定密度和边框，interactionSize/interactionBordered 根属性优先 |
| showHeader / showCount | true | 标题和选择结果统计 |
| showDescriptions / showIcons / showAvatars | true | 选择项描述、图标和头像 |
| showPresets / showReset | true | 日期/时间预设与重置入口 |
| showResults / showSnapshot | true | 批处理明细、历史快照正文 |
| listHeight | 320；80–2400px | 选择/穿梭/动态列表最大高度 |
| maxHeight | 不限；80–2400px | 根容器高度上限与键盘可聚焦滚动；打印解除限制 |
| columns | 随变体；1–12 | 列表网格列数；小于 480px 的容器恢复单列 |
| columnWidth | 160；80–800px | 级联选择列宽 |
| splitHeight | 横向180/纵向320；120–2400px | 分栏高度 |
| serviceTimeout | 60000；0–600000ms | 加载和每项批处理的等待上限；0 不限时，超时触发 AbortSignal |

显式 searchable、clearable、editable、leafOnly、checkedStrategy、collapsible、automatic、gesture 优先于变体默认行为。删除 JSON 属性中的配置恢复默认，同时保留通过 setOptions 注册的函数。外观变化及相同初始 value 不再重置用户选择、排序规则或撤销游标；搜索框、快照草稿和分隔条保留节点，中文组合输入期间延迟重绘。

load 和 run 缺少服务时显示真实错误；取消、销毁和超时能够结束等待，即使回调忽略 AbortSignal。只读或禁用后仍可通过 cancel 中止已启动任务。加载开始可由 beforechange 取消；批处理重试保留前次成功记录，超时后未处理项标为取消。日期/时间的单端边界也被校验，setValue 的范围和其他字段可同时提交。公开状态拒绝伪造 loading、error 和 results；无效配置保留上一有效配置。

新增 GardenerimInteractionOptions、State、Snapshot、Result、Item、Instance 公开类型及 getInstance(root,'interaction') 重载。分栏分隔条只响应对应方向键，并保留焦点节点。28/32/36px 控件与 12/14/14px 正文、16px 标题使用统一比例；触摸控件至少 44px。

GardenerDemo、CSS 和 Blazor 提供参数切换及全部变体。加载和批处理的成功、失败重试、超时、未接入场景通过本地回调演示；不连接真实业务后端。复制和全屏仍遵循浏览器权限，撤销只管理应用提供的本地快照。

逐组件验收与预算调整见 [发布复查报告](verification.md)。

## 完整演示与逐项检查

- [CSS 完整示例](../../packages/css/examples/interaction-compositions.html)
- GardenerDemo：/?component=interaction#catalog，每项提供变体、状态、尺寸与受控开关；搜索、方向、容量和其他专用参数按组件能力显示。
- Blazor 示例：/interaction，35 个真实 Razor 组件及受控回写。
- [逐项检查清单](inventory.json)，[五端一致性](parity.json)，[验收记录](verification.md)。

| 组件 | 原问题 / 修复范围 | 变体数量 |
| --- | --- | --- |
${inventory.items.map(c=>'| '+c.name+' | '+c.finding+' | '+c.variants.length+' |').join('\n')}
`);
const p='website/docs.html';let s=fs.readFileSync(p,'utf8');if(!s.includes('id="interaction-components"'))s=s.replace('<section id="dashboard-components"', '<section id="interaction-components"><h2>交互组件：参数、状态与五端一致性</h2><p>35 个组件，239 个变体。选择、穿梭、规则、范围、分栏、批处理、复制、全屏和撤销重做采用同一套数据与样式契约。</p><p>共同参数：interactionOptions、interactionValue、interactionSize、interactionBordered、interactionDisabled、interactionOrientation、interactionLimit。尺寸 28 / 32 / 36px；支持受控状态、可取消事件、异步取消和错误反馈。</p><a href="../packages/css/examples/interaction-compositions.html">交互完整演示</a><a href="../docs/interaction/README.md">五端参数与逐项检查</a></section>\n<section id="dashboard-components"');await writeFile(p,s);
