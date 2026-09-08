import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';const inventory=JSON.parse(fs.readFileSync('docs/help/inventory.json'));
await writeFile('docs/help/README.md',`# 帮助组件

完善原有 27 个组件，新增 help-search 与 help-glossary，共 29 个组件、${inventory.variants} 个变体。搜索可独立嵌入页面，术语表提供概念检索；文章阅读复用内容分类，浮层定位复用既有浮层运行时，避免重复创建同类基础设施。

## 五端接入

CSS 使用 data-g-help 与 data-g-help-options。Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 使用 helpOptions、helpValue、helpDisabled、helpSize、helpBordered。Options 和 Value 是 JSON 字符串，显式布尔 false 在五端保留。只有传入 helpOptions 才启用数据组合模式；不传时保留原有 CSS 类和作者提供的 DOM 用法。

数据模式由运行时生成内容，业务文本、项目和操作均通过参数提供，不应同时把框架插槽当作数据模式的子视图。销毁会恢复初始化前的子节点。样式入口为 @gardenerim/css/component/help.css，搭配 core.css；完整 style.css 已包含。

~~~js
const config = {
  helpOptions: JSON.stringify({kind:'faq', title:'常见问题', searchable:true, multiple:true,
    items:[{id:'export',title:'如何导出？',answer:'在项目菜单选择 CSV 或 JSON。'}]}),
  helpValue: JSON.stringify({expanded:[]}),
  helpDisabled: false
};
// Vue: <GFaq :config="config" @update:model-value="writeBack" />
// React: <GFaq config={config} onValueChange={writeBack} />
// AngularJS: <div g-faq gardener-config="config" gardener-on-value-change="writeBack($value)"></div>
// Blazor: <GFaq Config="Config" ValueChanged="WriteBack" />
function writeBack(value) { config.helpValue = JSON.stringify(value); }
~~~

## 参数

| 参数 | 默认 / 范围 | 用途 |
| --- | --- | --- |
| kind / mode | kind 必需；mode 为 default | 组件与下表变体；显式 mode 优先，其次框架 variant 默认值 |
| title / description | 空 | 标题与多行纯文本说明，文本不会作为 HTML 执行 |
| items | [] | 项目 id 必须唯一，按类型提供 title、description、answer、term、keys、category、keywords、date、target、actions、href |
| actions | [] | label、id、href；链接只允许 http、https、mailto、tel，相对链接按文档地址解析 |
| size | medium；small / medium / large | 12 / 14 / 14px 字号和 12 / 16 / 20px 内距；compact 在未显式配置 size 时选择 small |
| bordered / tone | true / neutral | 边框及 info、success、warning、danger 提示色 |
| columns / limit | 1 / 50；1–4 / 1–200 | 列数与结果上限；640px 以下排列为一列 |
| searchable | 帮助中心、搜索、术语表默认 true | FAQ、快捷键等也可以启用检索 |
| multiple | false | FAQ 多项展开 |
| readonly | false | 禁止用户勾选清单 |
| dismissible | 引导默认 true | 提示关闭按钮；引导跳过与 Escape 关闭 |
| width / placement | 320 / bottom-start | 浮层宽度 160–960px，受视口约束；支持四方向及 start/end 对齐 |
| direction | 继承 | ltr / rtl，使用逻辑边距和边框 |
| trigger | tooltip 为 hover focus，其他 click | 触发方式，可用空格组合 hover、focus、click、contextmenu |
| triggerLabel / placeholder | 内置中文 | 浮动提示触发文本与检索占位 |
| keys / do / dont / doLabel / dontLabel | 视组件而定 | 快捷键与正反例内容 |
| labels | 内置中文词典 | 可覆盖 search、empty、loading、retry、clear、close、start、previous、next、finish、skip、yes、no、reason、submit、thanks、pending、error、cancel、missing、progress、all、read、results |
| defaultValue | 空状态 | 非受控初始状态 |
| debounce | 150；0–2000ms | 远程检索防抖 |
| load / submit | 未配置 | 通过实例 setOptions 注入的异步服务回调，JSON 中不支持函数 |

## 状态与事件

helpValue 控制 query、category、expanded、completed、step、open、dismissed、feedback。数组存储项目 ID，步骤从 0 开始；feedback 为 yes、no 或 null。传入该属性后，组件发出下一状态，由应用回写，不会自行冒充已接受的状态。

beforechange 可取消，change.detail 包含 value、previousValue（仅 beforechange）、reason、controlled。action 提供操作 ID 或反馈内容；complete 只在异步服务成功或用户完成步骤时触发；error 提供 configuration、load 或 submit 原因及消息。没有 submit 服务时，只产生反馈操作事件并显示已选择，绝不声称已发送。

getInstance(root,'help') 提供 refresh、setOptions、getState、setValue、search、open、close、go、submit、cancel、destroy。动态更换服务、取消、销毁和输入新查询都会使旧请求失效；回调应尊重 signal，组件也会阻止晚到结果覆盖新状态。

~~~js
const help = getInstance(root, 'help');
help.setOptions({
  load: async ({query, category, signal}) => {
    const response = await fetch('/api/help?' + new URLSearchParams({query, category}), {signal});
    if (!response.ok) throw new Error('帮助内容暂时不可用');
    return response.json(); // [{id, title, description, ...}]
  }
});
// 反馈组件：setOptions({submit: async ({feedback, reason, signal}) => { ... }})
// Vue / React 可通过暴露的根元素取得实例，AngularJS / Blazor 使用相同运行时实例。
~~~

FAQ 使用原生按钮、aria-expanded / aria-controls 和独立回答区域，支持上下箭头、Home / End；清单使用原生 checkbox。富提示随焦点或鼠标进入展示，交互浮层支持 Escape 和外部点击。引导是非模态 dialog，保持目标可操作；缺失、隐藏或非法目标使用居中说明，不会抛出异常。关闭后返回触发位置。固定浮层限制高度并允许内部滚动；打印隐藏引导，展开 FAQ 回答。默认不播放持续动画。

## 逐项清单

| 组件 | 变体 | 检查与修复 |
| --- | --- | --- |
${inventory.items.map(c=>`| ${c.name} | ${c.variants.join('、')} | ${c.finding} |`).join('\n')}

## 演示和验证

- [GardenerDemo 帮助目录](http://127.0.0.1:4180/?component=help#catalog)：全部组件、变体、尺寸、方向、边框与受控切换。
- [CSS 完整演示](../../packages/css/examples/help-lab.html)：全部组件与真实操作。
- Blazor 示例 /help：使用真实 Razor 组件，切换全部组件、变体及受控状态。
- [验证记录](verification.md)。

演示中的反馈和“联系管理员”仅展示应用事件，不发送消息或伪造服务响应。真实检索、反馈存储和联系方式由应用提供。颜色继续使用 Gardenerim 主题变量，尺寸采用紧凑的 32px 操作高度与 40px FAQ 行高；没有声明跨设计系统像素级一致。
`);
const section=`<section id="help-enhancements" class="docs-section"><h2>帮助扩展：检索、提示与操作引导</h2><p>29 个组件提供 ${inventory.variants} 个变体，覆盖说明、FAQ、快捷键、帮助中心、术语表、清单、反馈和分步引导。</p><p>五端共享 helpOptions、helpValue 与异步服务接口，支持紧凑尺寸、受控状态、键盘操作、错误重试和取消。</p><p><a href="../packages/css/examples/help-lab.html">完整帮助演示</a></p><p><a href="../docs/help/README.md">五端帮助参数和逐项检查</a></p></section>`;
let p='website/docs.html',s=fs.readFileSync(p,'utf8');s=s.includes('id="help-enhancements"')?s.replace(/<section id="help-enhancements"[\s\S]*?<\/section>/,section):s.replace('<section id="layout-enhancements"',section+'\n<section id="layout-enhancements"');await writeFile(p,s);
for(const pkg of ['css','vue','react','angularjs','blazor']){p='packages/'+pkg+'/README.md';s=fs.readFileSync(p,'utf8');if(!s.includes('docs/help/README.md'))s+='\n## 帮助扩展\n\n29 个组件、'+inventory.variants+' 个变体；五端共享检索、受控状态、反馈服务和操作引导。详见 [帮助参数与演示](../../docs/help/README.md)。\n';await writeFile(p,s);}
