import fs from 'node:fs';import {cmsModes} from '../packages/css/src/js/cms.js';const before=JSON.parse(fs.readFileSync('docs/cms/before.json')),items=JSON.parse(fs.readFileSync('packages/css/metadata/components.json')).components.filter(c=>c.category==='cms');const findings={'cms-shell':'静态三栏高度强制占满视口，移动端隐藏信息且无内容操作。改为响应式表格/卡片/紧凑/检查器，支持搜索、分页、选择和元数据保存。','visual-builder':'原来只有点阵画布，没有构建行为。新增结构化区块的编辑、排序、复制、删除、撤销/重做与三种设备预览。','rich-editor':'原来只有编辑器外壳。新增标题/段落/引用/图片，粗体斜体、预览、SEO 字段及历史版本恢复请求。','media-library':'原来只有静态网格。新增单/多选、文件限制、上传请求、替代文本、列表与检查器。','content-workflow':'原来只有流程列。新增审核状态机、按权限禁用操作、审核意见、定时发布、版本冲突与异步确认。','localization-grid':'原来只有固定宽度网格。新增可编辑语言列、必填语言、语言只读、缺失过滤和逐语言方向。'};fs.writeFileSync('docs/cms/inventory.json',JSON.stringify({originalComponents:6,newComponents:0,components:6,variants:24,decision:'文件上传和版本对比已有独立组件；本次把 SEO、标签、审核、语言和资源选择纳入现有 CMS 组合的参数与区域，避免新增重复名称。',items:items.map(c=>({...c,before:before.find(v=>v.name===c.name),finding:findings[c.name]}))},null,2)+'\n');
const table=items.map(c=>'| '+c.name+' | '+c.variants.join(' / ')+' | '+findings[c.name]+' |').join('\n');
fs.writeFileSync('docs/cms/README.md',`# CMS 组件扩展

6 个组件，24 个可操作变体。统一 CSS 与共享 CMS 控制器由 Vue、React、AngularJS、Blazor 适配器使用。

| 组件 | 变体 | 检查与修复 |
| --- | --- | --- |
${table}

## 使用

CSS 根节点同时提供原组件类名、data-g-cms 和 data-g-cms-options。Vue/React 使用 config.cmsOptions，AngularJS 使用 gardener-config，Blazor 使用 Config；复杂参数传 JSON 字符串。data-g-cms-value / config.cmsValue 开启受控模式：change 事件给出候选 value，宿主回写后生效。无受控值时组件管理状态。已有静态 HTML 用法保持兼容。

~~~js
const options = {
  kind: 'content-workflow', mode: 'approval', title: '内容审核',
  requireApproval: true, permissions: ['edit', 'review', 'publish'],
  items: [{ id: 'post', title: '设计指南', status: 'review', version: 3 }],
  defaultValue: { title: '设计指南', selected: ['post'], status: 'review', version: 3 }
};
// Vue: <GContentWorkflow :config="{ cmsOptions: JSON.stringify(options) }" />
// React: <GContentWorkflow config={{ cmsOptions: JSON.stringify(options) }} />
// AngularJS: <div g-content-workflow gardener-config="{cmsOptions: optionsJson}"></div>
// Blazor: <GContentWorkflow Config="optionsDictionary" />
~~~

## 参数

| 参数 | 默认值与用途 |
| --- | --- |
| kind / mode | 组件名称 / 表中第一个变体 |
| size | small / medium / large；28 / 32 / 36 px 控件；内边距 12 / 16 / 20 px，正文 12 / 14 / 14 px |
| direction / bordered | ltr / true；支持 rtl、无边框 |
| title / description / labels | 标题、说明、全部操作文案覆盖 |
| disabled / readonly | false；禁止修改与请求，加载中的请求仍可取消 |
| status | ready / loading / error；数据加载状态 |
| items | 具有唯一 id 的内容/媒体/翻译条目，最多 2000 项 |
| pageSize | 5；内容列表和资源库分页，1–100 |
| multiple / maxSelected | false / 100；multiple 变体默认多选 |
| maxBlocks / maxLength | 100 / 10000；区块数量和文本长度上限 |
| showPreview | true；显示安全结构化预览 |
| permissions | edit、upload、review、publish；宿主可裁剪 UI 权限 |
| requireApproval | false；开启后发布和排期要求审核通过 |
| locales | 唯一 id、label、direction、required、readonly |
| revisions | id、title 和宿主保管的历史 value |
| accept / maxFileSize | image/* / 10 MiB；类型及大小限制 |
| requestTimeout | 30000 ms；超时返回错误，可重试 |
| defaultValue | 初始状态；之后通过 setValue 或受控值修改 |

公开状态包括 query、filter、page、selected、title、slug、tags、description、note、scheduledAt、status、blocks、translations、alt、device、missing、version。scheduledAt 使用浏览器本地时间的 datetime-local 值，宿主负责转换为带时区的服务器时间。

## 发布复查参数

| 参数 | 默认值与用途 |
| --- | --- |
| showSearch / showFilter | true / true；独立控制搜索、状态筛选与未翻译筛选入口 |
| showMetadata | true；控制标题、路径、标签和 SEO 摘要区域 |
| showHistory | true；控制撤销、重做和版本恢复入口 |
| showUpload / showChooser | true / true；资源库上传入口与选择确认按钮 |
| showStatus | true；关闭可视反馈时仍为辅助技术保留状态/错误通知 |
| editorRows | 3；多行编辑器的初始行数，1–30，可手动调整高度 |
| previewMaxHeight | 480；预览高度上限，80–2000 px，超出内容内部滚动 |
| thumbnailFit | contain；资源缩略图支持 cover / fill / none / scale-down |
| blockTypes | heading、paragraph、quote、image；限制可新增的区块类型；空数组禁用新增，已有区块仍完整显示 |

隐藏入口只调整界面，权限由 permissions 控制。审核意见使用 review 权限，媒体替代文本保存使用 edit 权限。readonly、disabled、loading、error 状态阻止修改请求；加载和错误状态不再显示误导的“就绪”。

所有布局按组件容器宽度重排；关闭预览时编辑器使用完整宽度，不残留空列。明确的 mode 优先于旧 CSS 类名。状态文本、数值、布尔、翻译字典与区块字段严格校验；非法 setValue/setOptions 抛出 TypeError，并保留当前内容。图片 URL 不接受嵌入凭据。销毁后 API 不再修改节点，并恢复原始样式。

本次保留 6 个 CMS 组合。文件上传、版本对比、标签、树与其它基础组件已在库中提供，通过配置组合满足需求，不新增重复名称。逐组件结论和最新证据见 [发布复查](verification.md) 与 release-review/inventory.json。

## 行为与异步协议

getInstance(element, 'cms') 提供 refresh、setOptions、setValue、getState、request、resolve、cancel、takeFiles、destroy。beforechange 可取消用户变更与请求；change 提供完整候选状态；action 提供 requestId、action、value、version；complete/error 返回结果。

保存、上传、恢复版本、审核和发布由宿主处理 action。只有 resolve(requestId, {status:'success', value, version}) 后才确认；失败保留原内容，取消、超时、配置切换、销毁后的过期响应均被忽略。除 choose 外，成功回包必须提供大于请求版本的安全整数 version；choose 无内容修改时可省略版本。版本恢复必须返回非空 value；审核回包若指定 status，必须与请求对应的目标状态一致。异常结构、无效版本、无效区块或不匹配状态会结束等待并触发 error，resolve 返回 false，可重新提交。版本恢复的 value 由服务返回；不会把任意 HTML 当成可信富文本执行。

requireApproval 开启时：draft/rejected → submit → review → approve → approved → publish/schedule。退回需要审核意见；定时发布必须是未来时间。UI 权限用于交互约束，服务器仍须校验登录权限、工作流、乐观锁和媒体内容，不由组件模拟后端授权。

上传 File 不进入 JSON 状态或公共事件。宿主使用 takeFiles(requestId) 一次性获取并上传；服务保存成功后更新 items。区块和图片替代文本以文本渲染，预览不执行 HTML。文件大小及 MIME 筛选是前端体验校验。

撤销/重做保存最近 50 次内部编辑，只恢复编辑字段，不回退已确认的服务器版本、发布状态或选择；切换内容记录和恢复版本后清空本地历史。受控文本只在 input / compositionend 提交，失焦 change 不重复发出提案。受控模式由宿主负责历史，组件内撤销按钮禁用。Ctrl/Cmd+S 保存，Escape 取消正在执行的请求；中文输入法合成期间不重绘。

## 演示

- GardenerDemo：http://127.0.0.1:4180/?component=cms#catalog
- CSS：http://127.0.0.1:4187/examples/cms-lab.html
- Blazor：http://127.0.0.1:5192/cms

目录页可调整尺寸、方向、边框、只读、多选、预览、审核要求、角色、数据状态、服务成功/失败/超时、外部受控。演示服务只在本地确认请求，不会修改真实 CMS。
`);
for(const name of ['css','vue','react','angularjs','blazor']){const p='packages/'+name+'/README.md';let s=fs.readFileSync(p,'utf8');if(!s.includes('../../docs/cms/README.md'))s+='\n## CMS\n\n6 个 CMS 组件、24 种变体，支持结构化编辑、媒体选择、审核发布与多语言；五端共用样式和行为。[完整参数与演示](../../docs/cms/README.md)。\n';fs.writeFileSync(p,s);}

