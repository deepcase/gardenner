import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';
const findings={chat:'从静态消息补齐受控会话、流式生成、滚动位置与草稿保留',message:'补齐角色、Markdown / 纯文本、复制与反馈请求', 'prompt-composer':'补齐中文输入法、快捷提交、附件限制和生成生命周期',attachment:'补齐文件信息、预览、下载和移除请求',thinking:'可展开的公开执行摘要、进度与状态；不展示模型私有推理','tool-call':'参数与结果可展开，执行状态由应用提供','tool-approval':'补齐允许 / 拒绝 / 取消、权限范围、过期和异步确认','agent-status':'状态徽标与执行明细','agent-plan':'任务状态与可勾选计划','sources-citations':'来源检索、引用摘要与安全链接','artifact-panel':'可键盘切换的代码 / Markdown 产物面板','model-selector':'模型描述、禁用选项与受控选择','context-meter':'实际占用、容量、比例与超限提醒','voice-state':'转录、音量级别与录音请求；媒体权限由应用处理','generation-placeholder':'内容占位、进度与状态','ai-workspace':'侧栏会话切换、消息、草稿和流式生成','prompt-starter':'提示选择与提示正文','ai-command-menu':'分组搜索、命令选择和禁用项','streaming-response':'真实异步迭代、暂停、继续、取消、重试和复制','multi-agent-board':'多代理工作状态与列表 / 网格','agent-handoff':'交接上下文、接受和拒绝','artifact-workspace':'产物选择、预览与复制','generation-gallery':'图片预览、状态、网格和列表','ai-context-manager':'检索、勾选、移除请求和 token 总量','ai-usage-panel':'实际调用用量、成本和明细','ai-safety-notice':'提示内容、状态、可关闭与操作请求','ai-feedback':'评价、原因、服务提交、失败与重试','conversation-list':'分组、检索、分页和会话选择','prompt-library':'分类、检索、提示选择和分页','mention-slash-command':'提及与命令过滤、选择和禁用','generation-card':'产物内容、进度与操作','file-tree':'父子关系、展开与选择、代码预览，拒绝循环树','version-history':'版本选择与详情','permission-scope':'权限说明、勾选与只读','cost-rate-limit':'明确单位的成本、速率及额度','privacy-notice':'隐私说明、链接与关闭','ai-run-timeline':'新增：跨工具与代理的公开运行步骤和时间线','ai-structured-output':'新增：JSON 校验、格式化与有界树形展示'};
const ip='docs/ai/inventory.json',inv=JSON.parse(fs.readFileSync(ip));for(const c of inv.items){c.finding=findings[c.name];c.diagnosis=c.name in {'ai-run-timeline':1,'ai-structured-output':1}?'缺少独立组件':'组件能力和演示均需补齐';}await writeFile(ip,JSON.stringify(inv,null,2)+'\n');
const doc=`# AI 组件

完善原有 36 个组件，新增运行时间线和结构化输出，共 38 个组件、119 个变体。新增组件覆盖跨工具执行记录和 JSON 结果检查；不重复新增编辑器、上传服务或模型 SDK。

## 五端一致接入

CSS 使用 data-g-ai 和 data-g-ai-options。Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 使用 aiOptions、aiValue、aiSize、aiBordered、aiDisabled；Options 与 Value 为 JSON 字符串，显式 false 保留。只有提供 aiOptions 才启用数据模式，原有 CSS 类及手工 DOM 用法继续可用。数据模式由共享运行时生成内容，不应同时使用框架插槽管理同一子树；销毁恢复原始子节点。

完整样式已包含所有 AI 样式。按需加载使用 core.css 和 ai.css / ai.min.css（包含 AI、AI 扩展和组合）；component/ai.css 仅为基础 AI 包，共用 runtime 会加载 ai.js。

~~~js
const config = {
  aiOptions: JSON.stringify({kind:'chat', size:'medium', height:360,
    messages:[{id:'welcome',role:'assistant',content:'你好，有什么可以帮助你？'}]}),
  aiValue: JSON.stringify({draft:'',messages:[]}),
  aiDisabled: false
};
// Vue: <GChat :config="config" @update:model-value="writeBack" />
// React: <GChat config={config} onValueChange={writeBack} />
// AngularJS: <div g-chat gardener-config="config" gardener-on-value-change="writeBack($value)"></div>
// Blazor: <GChat Config="Config" ValueChanged="WriteBack" />
function writeBack(value) { config.aiValue = JSON.stringify(value); }
~~~

## 配置参数

| 参数 | 默认 / 范围 | 用途 |
| --- | --- | --- |
| kind / mode | kind 必需；首个变体 | 组件类型与下表变体，显式 mode 优先，其次框架 variant 类 |
| title / description / content | 空 | 标题、说明与正文；HTML 不作为脚本执行 |
| items / messages | []，最多各 1000 项 | 唯一字符串 id；项目支持 title、description、content、status、category、href、src、parent、tokens、date、disabled 等；消息支持 role、author、content |
| size / bordered | medium / true | small、medium、large：12 / 14 / 14px 字号，12 / 16 / 20px 内距；compact 未显式指定 size 时为 small；按钮 28 / 32 / 36px，触屏最小 44px |
| direction / columns | 继承 / 1 | ltr、rtl；1–4 列，窄屏收为单列 |
| height / pageSize | 360 / 20 | 会话高度 120–1200px，分页 1–100 项 |
| format / showActions | markdown / true | markdown、plain、code、json；操作行显示开关 |
| disabled / readonly | false | 禁用或禁止编辑；readonly 仍可展开和复制 |
| searchable / checkable | 按组件及变体 | 搜索过滤、计划或权限勾选 |
| submitKey / autoscroll | enter / true | enter 或 ctrl-enter，Shift+Enter 换行；输入法组字不提交；阅读旧消息时保持滚动位置 |
| maxLength / maxOutput | 4000 / 200000 | 输入和生成字符上限；历史达到 1000 条时提示应用归档 |
| accept / maxFiles / maxFileSize | 任意 / 5 / 20971520 | 扩展名或 MIME 类型；附件不自动上传 |
| model / prompt | 空 | 应用的模型 ID 和生成输入 |
| used / limit / cost / rate | 0 / 32000 / 0 / 0 | 真实数据由应用提供；currency、rateUnit 指定单位 |
| details / actions / labels | 空 / [] / 中文词典 | 明细记录、按钮或安全链接、自定义本地化词典 |
| scope / expiresAt | 空 | 授权范围说明及 ISO 到期时间，UI 不能代替服务端鉴权 |
| transcript / levels | 空 / [] | 语音转录及波形数据，录音由应用提供 |
| defaultValue | 初始空状态 | 非受控初始状态；messages 与 status 默认来自 options |
| generate / approve / submitFeedback / record | 未接入 | 仅通过实例 setOptions 注入服务函数 |

完整接口：[AI 类型定义](../../packages/css/src/types/ai.d.ts)。

## 状态与异步服务

aiValue 控制 draft、query、selected、model、expanded、checked、messages、output、status、decision、rating、reason、page、dismissed。提供 aiValue 后，change 提议下一完整状态，应用负责回写；未提供则组件内部管理。beforechange 可取消；action 为发送、选择、文件与工具请求，complete 仅在接入的服务成功后发出，error 提供配置、服务或限制错误。工具 decision 表示用户的权限选择，服务成功与否应检查 complete / error，服务端必须独立验证权限。

~~~js
const ai = getInstance(root, 'ai');
ai.setOptions({
  generate: async ({prompt, model, messages, context, files, signal}) => {
    const response = await fetch('/api/assistant', {
      method:'POST', signal, headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt,model,messages,context})
    });
    if (!response.ok) throw new Error('生成服务暂不可用');
    const result = await response.json();
    return result.text;
  }
});
// generate 也可返回 AsyncIterable<string>，组件按增量追加。
// setOptions({approve: async ({decision,scope,signal}) => {...}})
// setOptions({submitFeedback: async ({rating,reason,signal}) => {...}})
~~~

实例支持 refresh、setOptions、setValue、getState、generate、stop、pause、resume、retry、decide、submitFeedback、destroy。取消、销毁、禁用和更换服务使旧请求失效并触发 AbortSignal；服务应响应 signal，晚到数据不会覆盖当前内容。暂停保留进行中的迭代，下一个增量等待继续。受控模式要及时回写以显示状态。

无服务时只发出请求，不伪造模型回复、反馈保存或工具执行。所有演示生成均使用明确标注的本地预录文本，可切换失败后重试；没有网络模型、计费、真实文件写入或自动麦克风访问。thinking 仅显示公开执行摘要。

## 逐项检查

| 组件 | 变体 | 原因与修复 |
| --- | --- | --- |
${inv.items.map(c=>'| '+c.name+' | '+c.variants.join('、')+' | '+c.diagnosis+'；'+c.finding+' |').join('\n')}

## 演示

- [GardenerDemo AI 目录](http://127.0.0.1:4180/?component=ai#catalog)
- [CSS 全部演示](../../packages/css/examples/ai-lab.html)
- Blazor 示例路径 /ai，使用真实 Razor 组件与受控状态。
- [验证记录](verification.md)，[五端一致性报告](parity.json)。
`;
await writeFile('docs/ai/README.md',doc);
for(const pkg of ['css','vue','react','angularjs','blazor']){const p=`packages/${pkg}/README.md`;let s=fs.readFileSync(p,'utf8');if(!s.includes('## AI 组件扩展'))s+='\n## AI 组件扩展\n\n38 个 AI 组件、119 个变体，统一 aiOptions / aiValue 和共享异步运行时。参数、服务接入、逐项修复及演示见 [AI 文档](../../docs/ai/README.md)。\n';await writeFile(p,s);}
const p='website/docs.html';let s=fs.readFileSync(p,'utf8');if(!s.includes('id="ai-enhancements"'))s=s.replace('<section id="help-enhancements"',`<section id="ai-enhancements" class="docs-section"><h2>AI：对话、工具协作与生成产物</h2><p>38 个组件提供 119 个变体，覆盖消息、输入、流式生成、工具确认、上下文、用量、产物、运行时间线与结构化输出。</p><p>五端共用 aiOptions、aiValue 和异步服务，支持紧凑尺寸、受控状态、键盘操作、暂停、取消和重试。演示使用本地预录文本。</p><p><a href="../packages/css/examples/ai-lab.html">完整 AI 演示</a></p><p><a href="../docs/ai/README.md">AI 五端参数与逐项检查</a></p></section>\n<section id="help-enhancements"`);await writeFile(p,s);
