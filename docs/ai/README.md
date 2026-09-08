# AI 组件

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
| chat | default、compact、bubbles、readonly | 组件能力和演示均需补齐；从静态消息补齐受控会话、流式生成、滚动位置与草稿保留 |
| message | assistant、user、system、compact、plain | 组件能力和演示均需补齐；补齐角色、Markdown / 纯文本、复制与反馈请求 |
| prompt-composer | default、compact、multiline、attachments | 组件能力和演示均需补齐；补齐中文输入法、快捷提交、附件限制和生成生命周期 |
| attachment | default、compact、list | 组件能力和演示均需补齐；补齐文件信息、预览、下载和移除请求 |
| thinking | default、expanded、compact | 组件能力和演示均需补齐；可展开的公开执行摘要、进度与状态；不展示模型私有推理 |
| tool-call | default、expanded、compact | 组件能力和演示均需补齐；参数与结果可展开，执行状态由应用提供 |
| tool-approval | default、detailed、compact | 组件能力和演示均需补齐；补齐允许 / 拒绝 / 取消、权限范围、过期和异步确认 |
| agent-status | default、compact、detailed | 组件能力和演示均需补齐；状态徽标与执行明细 |
| agent-plan | default、compact、checkable | 组件能力和演示均需补齐；任务状态与可勾选计划 |
| sources-citations | default、list、compact | 组件能力和演示均需补齐；来源检索、引用摘要与安全链接 |
| artifact-panel | default、code、markdown、compact | 组件能力和演示均需补齐；可键盘切换的代码 / Markdown 产物面板 |
| model-selector | default、detailed、compact | 组件能力和演示均需补齐；模型描述、禁用选项与受控选择 |
| context-meter | default、compact、detailed | 组件能力和演示均需补齐；实际占用、容量、比例与超限提醒 |
| voice-state | default、compact、transcript | 组件能力和演示均需补齐；转录、音量级别与录音请求；媒体权限由应用处理 |
| generation-placeholder | default、compact、progress | 组件能力和演示均需补齐；内容占位、进度与状态 |
| ai-workspace | default、compact、sidebar | 组件能力和演示均需补齐；侧栏会话切换、消息、草稿和流式生成 |
| prompt-starter | default、list、compact | 组件能力和演示均需补齐；提示选择与提示正文 |
| ai-command-menu | default、grouped、compact | 组件能力和演示均需补齐；分组搜索、命令选择和禁用项 |
| streaming-response | default、compact、plain | 组件能力和演示均需补齐；真实异步迭代、暂停、继续、取消、重试和复制 |
| multi-agent-board | default、list、compact | 组件能力和演示均需补齐；多代理工作状态与列表 / 网格 |
| agent-handoff | default、detailed、compact | 组件能力和演示均需补齐；交接上下文、接受和拒绝 |
| artifact-workspace | default、code、compact | 组件能力和演示均需补齐；产物选择、预览与复制 |
| generation-gallery | default、list、compact | 组件能力和演示均需补齐；图片预览、状态、网格和列表 |
| ai-context-manager | default、compact、readonly | 组件能力和演示均需补齐；检索、勾选、移除请求和 token 总量 |
| ai-usage-panel | default、compact、detailed | 组件能力和演示均需补齐；实际调用用量、成本和明细 |
| ai-safety-notice | default、compact、dismissible | 组件能力和演示均需补齐；提示内容、状态、可关闭与操作请求 |
| ai-feedback | default、detailed、compact | 组件能力和演示均需补齐；评价、原因、服务提交、失败与重试 |
| conversation-list | default、grouped、compact | 组件能力和演示均需补齐；分组、检索、分页和会话选择 |
| prompt-library | default、grouped、compact | 组件能力和演示均需补齐；分类、检索、提示选择和分页 |
| mention-slash-command | default、mentions、commands | 组件能力和演示均需补齐；提及与命令过滤、选择和禁用 |
| generation-card | default、compact、progress | 组件能力和演示均需补齐；产物内容、进度与操作 |
| file-tree | default、expanded、compact | 组件能力和演示均需补齐；父子关系、展开与选择、代码预览，拒绝循环树 |
| version-history | default、compact、detailed | 组件能力和演示均需补齐；版本选择与详情 |
| permission-scope | default、checkable、compact | 组件能力和演示均需补齐；权限说明、勾选与只读 |
| cost-rate-limit | default、compact、detailed | 组件能力和演示均需补齐；明确单位的成本、速率及额度 |
| privacy-notice | default、compact、dismissible | 组件能力和演示均需补齐；隐私说明、链接与关闭 |
| ai-run-timeline | default、compact、detailed | 缺少独立组件；新增：跨工具与代理的公开运行步骤和时间线 |
| ai-structured-output | default、tree、compact | 缺少独立组件；新增：JSON 校验、格式化与有界树形展示 |

## 演示

- [GardenerDemo AI 目录](http://127.0.0.1:4180/?component=ai#catalog)
- [CSS 全部演示](../../packages/css/examples/ai-lab.html)
- Blazor 示例路径 /ai，使用真实 Razor 组件与受控状态。
- [验证记录](verification.md)，[五端一致性报告](parity.json)。

## 发布复查：参数与行为

本轮逐项复查现有 38 个组件、119 个变体。组件范围已覆盖输入、会话、运行、授权、产物、上下文和反馈；此次扩展现有接口，不新增功能重复的组件。

新增 18 项 aiOptions，CSS、Vue、React、AngularJS、Blazor 使用同一套运行时和类型合同：

| 参数 | 默认值与范围 | 适用场景 |
| --- | --- | --- |
| showHeader / showStatus | true | 全部组件的标题说明和顶层状态徽标；工具确认的决定状态始终可见 |
| showAuthor | true | 对话、工作区和消息的作者 |
| showCopy / showFeedback | true | 复制入口、对话消息评价；showActions=false 同时隐藏辅助操作 |
| showCount / showPause | true | 输入字数统计、流式回复暂停入口 |
| clearOnSend | true | 发送后清空草稿；false 保留输入；不自动移除附件 |
| composerRows / resize | 2（multiline 为 4）/ vertical | 输入 1–12 行；resize 支持 none、vertical |
| messageGap / sidebarWidth | 16 / 180 | 消息间距 0–48px；工作区侧栏 120–320px |
| treeIndent / codeHeight | 16 / 400 | 文件树每级缩进 8–32px；代码区最大高度 80–1200px |
| imageRatio / imageFit | 16/9 / cover | 生成图片预览支持 16/9、4/3、1/1、auto；cover、contain |
| serviceTimeout | 60000 | 每次服务等待或流读取的无响应上限，0–600000ms；0 关闭超时；暂停期间已发出的读取仍受上限约束 |
| maxReasonLength | 2000 | 反馈说明长度 1–10000；状态写入与输入控件共同校验 |

显式 mode、size、format、status 优先于变体默认值；aiSize 等显式根属性仍优先。small / medium / large 使用 12 / 14 / 14px 正文、28 / 32 / 36px 操作控件，触摸指针下最小 44px。标题为 16px；网格和侧栏按容器宽度收拢，窄屏不覆盖 height 参数。

### 修复的接入边界

- 生成、工具确认、反馈和语音回调都能在取消、销毁、服务替换或超时后结束返回的 Promise；过期结果不会触发完成事件。
- 只读切换取消进行中的任务；被 beforechange 拒绝的会话切换不取消当前任务；被拒绝的最终状态不报告成功。
- 模型选择同时更新 selected 和 model；保留新草稿与消息节点身份，避免流更新丢失焦点。
- 校验消息角色、附件开关、单文件限制、条目字段、孤立/循环目录、反馈长度与显示参数；无效 setOptions 保留此前配置。状态对象仅接收公开字段。
- 未作决定或已过期的工具确认不能借重试调用服务；URL 拒绝凭据和危险协议；只读输入和按钮外观与行为一致。

### 演示与边界

GardenerDemo 提供按组件适用范围显示的参数控件，预览支持 ai-参数名 查询串。CSS 的 ai-lab.html 覆盖全部变体；Blazor /ai 使用真实 Razor 组件、动态参数和受控状态。生成服务播放预录文本，确认、反馈及语音用本地模拟回调；“仅发送事件”展示未接服务状态。应用须注入真实服务、执行权限检查和上传处理；演示不代表后端服务已接通。

本轮扩展使 AI 源模块从约 45.6KB 增至约 49.8KB，固定模块上限从 48KB 调整到 54KB。平台压缩包预算仅增加 Web gzip 和 Desktop Brotli 各 1KB；原始体积和整包上限保持不变。实际产物、测试结果与逐项复查见 [验证报告](verification.md)。
