import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const inventory=JSON.parse(fs.readFileSync('docs/content/inventory.json','utf8'));
await writeFile('docs/content/README.md',`# 内容组件

完善原有 38 个内容组件，新增 markdown-viewer，共 39 个组件、234 个可组合变体。已有大纲、文件属性、评论、版本历史和撤销组件足以覆盖相邻场景，本次不重复创建同类组件。

## 五端共同契约

| 参数 | 类型 / 默认 | 说明 |
| --- | --- | --- |
| contentOptions | JSON 字符串；必需 | 显式启用数据模式；kind 为下表组件名 |
| contentValue | JSON 字符串；省略时非受控 | 状态对象；change 返回下一状态，应用回写 |
| contentSize | small / medium / large；medium | 控件高度 28 / 32 / 36px，字体 12 / 14 / 14px |
| contentBordered | boolean；true | 显式边框开关，优先于变体，false 不被丢弃 |
| contentDisabled | boolean；false | 禁止 API 和界面操作 |

options 共用 title、text、labels、loading、empty、error、disabled、readOnly。compact / comfortable 内距为 12 / 20px，默认 16px；bordered / borderless 控制边框。支持深色、RTL、窄屏和打印。只读允许阅读、搜索和翻页，禁止修改、提交和恢复。

CSS 使用 data-g-content 与 data-g-content-options，配合 init(root)。样式按需入口为 @gardenerim/css/component/content-compositions.css，需同时引入 core.css。Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 接受同名参数；对象先 JSON 序列化，布尔值直接传 boolean。

\`\`\`js
const config = {
  contentOptions: JSON.stringify({kind:'markdown-editor', text:'# 标题', preview:true}),
  contentValue: JSON.stringify({text:'# 标题'}),
  contentSize:'medium', contentBordered:true, contentDisabled:false
};
// Vue: <GMarkdownEditor :config="config" @update:model-value="writeBack" />
// React: <GMarkdownEditor config={config} onValueChange={writeBack} />
// AngularJS: <div g-markdown-editor gardener-config="config" gardener-on-value-change="writeBack($value)"></div>
// Blazor: <GMarkdownEditor Config="Config" ValueChanged="WriteBack" />
function writeBack(value) { config.contentValue=JSON.stringify(value); }
\`\`\`

beforechange 可 preventDefault；change.detail.value 是下一状态，controlled 指示是否需回写；action 表示业务操作或异步结果；error 含 reason / message。只订阅组件根事件，避免嵌套组件污染模型。旧 DOM 模式继续保留，data-g-content-options 是新模式的显式开关。

## 专用参数与实际行为

| 组件族 | options 参数 | 状态 / 操作 |
| --- | --- | --- |
| 代码、终端、差异 | text、language、lineNumbers、before、after | 复制真实文本；行号；插入 / 删除差异；并排或统一视图；大型文档使用有界逐行比较 |
| 文章 / Markdown 阅读 | text、author、date | 安全文本解析：标题、列表、引用、围栏代码、行内代码、粗体、斜体、HTTP(S) 链接；HTML 不执行 |
| 搜索结果 | items[{key,label,description,url}]、pageSize | query、page；真实过滤与分页 |
| 报表 / 发票 | items[{key,label,quantity,price}]、currency、locale、discount、taxRate | 逐行金额、折扣、税费和合计；展示组合，不代替财务记账系统 |
| 内容大纲 | sections[{id,title,level}]、smooth | 定位到当前文档的目标 ID，action 返回 found |
| 文件、目录、媒体集合 | items[{key,label,parent,type,size,modified,description,src,disabled,properties}]、multiple、maxSelection、searchable | keys、folder、query、sort、view；过滤、排序、目录导航、选择；拒绝重复键和循环目录 |
| 文件属性 / 存储计量 | items、total、used | 属性列表；按总量约束存储占用及百分比 |
| 上传与失败队列 | accept、multiple、maxFiles(10)、maxSize(10MiB)、chunkSize、concurrency(1–6)、upload | 真实 File 校验，分块切片，异步进度，暂停、取消，按已完成分块重试；不配置服务不会假装成功 |
| 文档 / 文件预览 | pages[文本或{text}]、thumbnails、type、src | page、zoom(.25–4)；文本翻页、缩放、缩略入口；图片预览 |
| PDF | src、pageCount | 原生浏览器 PDF iframe，页码和缩放地址参数，独立打开入口；渲染支持取决于浏览器 PDF 查看器 |
| 图像裁剪 | src、alt | crop{x,y,width,height} 为百分比；校验边界，Canvas 导出真实 PNG Blob |
| 图像标注 | src、alt、annotations[{x,y,text}] | 点击定位、中心添加、文本标注、选择、删除；坐标为百分比 |
| 音视频 | src、sources[{src,type}]、poster、preload、loop、muted、volume(0–1)、playbackRate(.25–4) | 原生媒体控制、播放速率、play / pause / seek；事件来自真实媒体状态 |
| 代码 / Markdown / 富文本编辑 | text、preview、spellcheck、wrap、maxLength、actions、linkUrl | text；编辑、格式操作、预览和字符统计；富文本采用安全 Markdown 状态并按纯文本粘贴 |
| 块编辑 | blocks[{text}] | blocks；新增、修改、上下移动、删除 |
| 查找替换 | text、findReplace、caseSensitive | 按字面文本查找下一处、替换当前或全部；替换文本不解释正则或 $ 占位符 |
| 评论 | comments[{author,text,date,resolved}]、author、maxLength | comments；新增评论、解决、重新打开 |
| 版本历史 | versions[{key,label,author,date,text}] | version；查看快照，恢复发出可取消的业务请求，由应用执行 |
| 自动保存 | text、saveDelay(900ms)、save | saveStatus；待保存、保存中、成功、失败；可取消、重试和销毁清理 |

## 异步接入

getInstance(root,'content') 提供 setOptions、getState、refresh、setValue、select、addFiles、upload、pauseUpload、cancel、save、copy、exportCrop、play、pause、seek、format、findNext、replace、destroy。

\`\`\`js
api.setOptions({
  chunkSize: 1024 * 1024,
  upload: async (file,{chunk,index,total,offset,signal,onProgress}) => {
    const body=new FormData();
    body.append('file',chunk,file.name);body.append('index',String(index));
    body.append('total',String(total));body.append('offset',String(offset));
    const response=await fetch('/api/upload',{method:'POST',body,signal});
    if(!response.ok)throw new Error('上传失败');
    onProgress(1); // 比例 0–1；仅在真实进度已知时报告
  },
  save: async (text,{signal}) => {
    const response=await fetch('/api/draft',{method:'PUT',body:text,signal});
    if(!response.ok)throw new Error('保存失败');
  }
});
\`\`\`

分块会提供原始 File、当前 Blob、索引、总数及偏移；服务端负责分块标识、合并和持久化。取消和销毁会触发 AbortSignal，并忽略迟到结果。演示 upload / save 使用本地延迟服务；PDF、音视频使用仓库内真实资源。跨域图像导出需要源允许 Canvas 读取，失败会显示错误；组件不绕过浏览器限制。


## 发布复查：扩展参数与行为

本轮复查 39 个组件、234 个变体，不新增重复组件。通过扩展现有接口覆盖阅读、编辑、文件、上传、预览和审阅需求。

| 新增 options 参数 | 默认 / 范围 | 适用能力 |
| --- | --- | --- |
| size / bordered | medium / true | Options 内可直接配置密度和边框；显式 contentSize/contentBordered 根属性优先 |
| showHeader / showToolbar | true | 标题与工具栏；隐藏工具栏会同时隐藏其内的搜索、分页、格式等操作 |
| showCount | true | 编辑字符数、文件选择统计 |
| showPagination | true | 搜索、文件列表与文档的分页入口 |
| showMetadata / showDescriptions | true | 文章作者日期、文件元数据；文件和搜索结果描述 |
| showSort / showViewSwitcher | true | 文件排序和列表/网格切换，独立于 searchable |
| showUploadHints / showChunkDetails | true | 上传限制说明与分块预览；分块可视项最多 100，余量显示统计，实际上传不截断 |
| showCopy | true | 代码和差异的复制入口 |
| editorRows | 8；2–40 | 编辑器、自动保存文本区的行数；块编辑区同样应用 rows |
| maxHeight | 不限；80–2400px | 根容器限高、可聚焦滚动；打印解除上限 |
| previewHeight | 按组件；80–2400px | 文档/PDF/图片/编辑预览高度 |
| columns | 3；1–12 | 文件网格列数；窄容器下自动降低列数 |
| thumbnailSize | 48；24–160px | 文件行缩略图宽度，高度按 3/4 比例 |
| serviceTimeout | 60000；0–600000ms | 每次上传分块或保存的等待上限，0 不限时；超时触发 AbortSignal |
| resize | vertical；none/vertical/both | 编辑器拉伸方式 |

共新增 20 项 Options 配置。原有 pageSize 现在也可用于文件集合；删除配置恢复默认。view、preview、wrap、thumbnails 的显式参数和当前状态优先于变体默认值。尺寸为 28/32/36px 控件与 12/14/14px 正文；触摸控件至少 44px，标题 16px，compact/comfortable 内距仍为 12/20px。

新增 GardenerimContentOptions、State、Snapshot、Upload、Instance 等公开类型，getInstance(root,'content') 具有精确重载。状态输入只接受业务字段，不能伪造 uploads、busy、error、saveStatus。对组件名、数组结构、枚举、数值范围、文本长度、CSS 尺寸和服务函数进行校验；失败配置保持上一有效状态。

外观参数更新不会把用户草稿重置成初始 text。编辑框、检索框、评论草稿及原生播放器保留节点；IME 组合输入期间延迟重绘，受控回写不会反复创建编辑节点。Markdown 正确切换有序/无序列表，拒绝带凭据的链接；支持的语法仍是上文所述安全子集。

取消、暂停、销毁和超时会结束等待，即使服务忽略 AbortSignal 也不会让调用永久悬挂。保存与开始上传均经过 beforechange 守卫；cancel 同时撤销尚未触发的自动保存。部分上传失败返回 false，保留已完成分块供重试，不能作为成功处理。

图像裁剪框与标注针放在实际图像坐标层内，一起缩放；空白预览区不再进入裁剪坐标。真实 PDF 仍由浏览器查看器处理。音视频使用原生播放，外观更新不会重置播放节点。

GardenerDemo 提供按能力显示的参数面板；CSS 独立演示与 Blazor /content 可切换全部 234 个变体和新参数。上传/保存有本地成功、首次失败重试、超时及未接入服务示例；数据不会发送到外部服务。业务项目负责真实上传、合并与持久化。

本轮内容源模块固定上限从 55KB 调整为 65KB；Web/桌面 CSS 原始体积上限分别为 1,785,000/1,845,000 字节，其余预算保持不变。逐项结果见 [验证报告](verification.md)。

本轮逐组件参数与核查内容见 [39 项复查清单](release-review/component-review.md)。

## 初次完善清单

| 组件 | 检查与修复 | 变体 |
| --- | --- | --- |
${inventory.items.map(c=>'| '+c.name+' | '+c.finding+' | '+c.variants.join('、')+' |').join('\n')}

## 演示与验证

- GardenerDemo：/?component=content#catalog；39 个真实示例，按组件能力提供参数。
- [CSS 独立完整演示](../../packages/css/examples/content-lab.html)
- Blazor Demo：/content；39 个真实组件、受控回写和本地异步服务。
- [五端一致性](parity.json)、[浏览器验收](verification.md)。
`);
const p='website/docs.html';let s=fs.readFileSync(p,'utf8');if(!s.includes('id="content-components"'))s=s.replace('<section id="interaction-components"','<section id="content-components"><h2>内容组件：编辑、文件与阅读</h2><p>39 个组件、234 个变体，覆盖代码、文章、文件、上传、预览、媒体、编辑、评论与版本记录。</p><p>共同参数：contentOptions、contentValue、contentSize、contentBordered、contentDisabled。五端共享受控状态、可取消事件和异步服务接口。</p><p>内容发布复查新增 20 项参数，支持内容显示、尺寸、分页、图片预览和服务超时；修复草稿重置、中文输入、异步取消及图像坐标，39 个组件与 234 个变体的五端实现和演示同步。</p><a href="../packages/css/examples/content-lab.html">内容完整演示</a><a href="../docs/content/README.md">五端内容参数与逐项检查</a></section>\n<section id="interaction-components"');await writeFile(p,s);
for(const p of ['README.md',...['css','vue','react','angularjs','blazor'].map(n=>'packages/'+n+'/README.md')]){let s=fs.readFileSync(p,'utf8').replace(/\b519\b/g,'520').replace(/\b78(?=\s*(?:种 Gardenerim|种 DOM|个 DOM|种行为|个行为|behaviors))/g,'79');const link=p==='README.md'?'docs/content/README.md':'../../docs/content/README.md';if(!s.includes('39 个内容组件'))s+='\n\n## 内容组件\n\n39 个内容组件、234 个变体采用一致的数据参数、受控状态和共享行为，新增 Markdown 阅读器。详见 [内容参数与完整演示]('+link+')。\n';await writeFile(p,s);}
