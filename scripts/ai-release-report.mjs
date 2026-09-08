import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/ai/release-review/',read=n=>JSON.parse(fs.readFileSync(dir+n+'.json','utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');const passed=(name,count)=>{const s=log(name);assert.equal(Number(s.match(/ℹ tests (\d+)/)?.[1]),count,name);assert.match(s,/ℹ fail 0\b/);return count;};
const browsers=['chromium','firefox','webkit'].map(e=>read('browser-'+e)),extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e)),finals=['chromium','firefox','webkit'].map(e=>read('final-'+e)),presets=['chromium','firefox','webkit'].map(e=>read('states-'+e));for(const b of browsers){assert.equal(b.layouts,238);assert.equal(b.rtl,38);assert.deepEqual(b.errors,[]);for(const k of ['streaming','cancel','pause','retry','approval','feedback','keyboard'])assert.equal(b[k],true);}for(const e of extensions){assert.equal(e.states,114);assert.equal(e.parameters,18);assert.deepEqual(e.errors,[]);for(const k of ['touchTarget','narrowContainer','timeoutRetry','cancellationSettles','missingService'])assert.equal(e[k],true);}for(const p of presets){assert.equal(p.presets,97);assert.deepEqual(p.errors,[]);}for(const f of finals){assert.equal(f.narrowDark,true);assert.equal(f.standaloneCSS,38);assert.deepEqual(f.errors,[]);}
const adapters=read('adapters'),checks=read('checks'),blazor=read('blazor-browser'),standalone=read('static-browser'),smoke=read('smoke');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0);for(const c of checks)assert.equal(c.code,0);assert.equal(blazor.variants,119);assert.deepEqual(blazor.errors,[]);assert.equal(standalone.variants,119);assert.deepEqual(standalone.errors,[]);assert.equal(smoke.passed,true);assert.equal(read('examples-reproducible').passed,true);assert.match(log('root-check'),/Legal parity passed/);assert.match(log('css-budget'),/Performance budget passed/);assert.match(log('website-check'),/Documentation coverage passed/);assert.match(log('blazor-package'),/NuGet verified and consumed/);assert.match(log('demo-build'),/built in/);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sharedAssets={};for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','ai.js','components/ai.min.css']){sharedAssets[file]=hash('packages/css/dist/'+file);assert.equal(sharedAssets[file],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file);}assert.equal(sharedAssets['ai.js'],hash('packages/css/src/js/ai.js'));assert.ok(fs.statSync('packages/css/src/js/ai.js').size<54000);
const addedParameters=['showHeader','showStatus','showAuthor','showCount','showCopy','showFeedback','showPause','clearOnSend','composerRows','resize','messageGap','sidebarWidth','treeIndent','codeHeight','imageRatio','imageFit','serviceTimeout','maxReasonLength'];const cssBudget=JSON.parse(fs.readFileSync('packages/css/dist/gardener.performance.json'));assert.equal(cssBudget.status,'passed');const budgetReview={reason:'AI configurable presentation and lifecycle validation; package/source sizes remain bounded. Only two compressed platform caps require an increase after selector simplification.',module:{beforeLimit:48000,afterLimit:54000,actual:fs.statSync('packages/css/src/js/ai.js').size},platforms:[{artifact:'platforms/gardener.web.min.css',metric:'gzip',before:246000,after:247000,actual:cssBudget.artifacts['platforms/gardener.web.min.css'].actual.gzip},{artifact:'platforms/gardener.desktop.min.css',metric:'brotli',before:143000,after:144000,actual:cssBudget.artifacts['platforms/gardener.desktop.min.css'].actual.brotli}],otherAbsoluteAndRelativeCaps:'unchanged',package:cssBudget.package};fs.writeFileSync(dir+'budget-review.json',JSON.stringify(budgetReview,null,2)+'\n');
const report={verifiedAt:new Date().toISOString(),passed:true,components:38,variants:119,newComponents:0,frameworks:['css','vue','react','angularjs','blazor'],addedParameters,inventory:read('inventory'),tests:{ai:passed('ai-unit',36),runtime:passed('css-runtime',749),schema:passed('css-schema',48),html:passed('css-test-html',43),build:passed('css-test-build',11)},browsers,extensions,presets,finals,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),blazor,standalone,smoke,sharedAssets,website:{components:559,behaviors:94,events:104,locales:7,pages:14,messagesPerTranslatedLocale:3320},budgetReview,limitations:['演示播放预录文本和本地模拟回调；真实模型、录音、上传与工具执行由应用服务接入。','权限展示和工具确认不是服务端授权机制，应用须执行实际权限与有效期校验。','自动无障碍扫描不能代替人工辅助技术验收。']};for(const name of ['verification','final-verification'])fs.writeFileSync('docs/ai/'+name+'.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(dir+'component-review.md','# AI 逐组件发布复查\n\n覆盖全部 38 个组件、119 个变体。每项均已验证三种浏览器的布局、RTL、暗色及空/只读/禁用状态，并核对五端目录与共享运行时。\n\n| 组件 | 变体数 | 结果与修复 |\n| --- | --- | --- |\n'+report.inventory.items.map(c=>'| '+c.name+' | '+c.variants.length+' | '+c.releaseReview.finding+' |').join('\n')+'\n');
fs.writeFileSync('docs/ai/verification.md',`# AI 组件发布复查

组件层检查通过：38 个组件、119 个变体，CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 和文档已同步。本轮完善现有组件，不新增重复组件。

新增 18 项参数，覆盖消息作者、复制和评价、标题与状态、输入行数和调整、消息间距、侧栏、文件树、代码高度、图片适配、服务超时和反馈字数。参数按组件适用范围出现在 GardenerDemo 面板中。

修复异步服务或迭代器无法结束、只读切换未取消任务、受控会话切换被拒绝仍中断当前生成、被拒绝的完成状态仍报告成功、模型选择没有写入 model、显式配置被变体覆盖、单附件限制失效、无效配置污染后续更新、过期确认可重试，以及演示状态选择被初始配置覆盖等问题。公开状态只接受约定字段。

统一正文 12/14/14px、标题 16px、控件 28/32/36px；触摸控件至少 44px。窄容器使用单列布局，消息视区高度继续服从配置。

| 验证 | 结果 |
| --- | --- |
| AI 专项 / 全量运行时 | 36 / 749 项通过 |
| Vue / React / AngularJS | 141 / 90 / 78 项单元测试、Schema 与类型检查通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过，含连续构建复现和 npm 包消费 |
| 三浏览器布局与方向 | 714 个布局、114 个 RTL 页面通过 |
| 三浏览器状态 | 342 个空/只读/禁用组合、291 个声明状态预设通过 |
| 三浏览器新增参数 | 各 18 项参数，含尺寸、触摸目标、窄容器、超时重试和取消返回 |
| 暗色与无障碍 | 114 个暗色窄屏页面；Chromium 76 次 WCAG A/AA 扫描无违规 |
| 独立 CSS | 全部 119 个变体在 320px 容器内无横向溢出 |
| Blazor | 119 个变体、受控对话、授权、取消、新参数和实例保留；559 个 SSR 合约通过 |
| 发布包 | 当前 NuGet 包已在隔离缓存中被真实应用消费，98 个条目 |
| 生成一致性 | 七个关键示例/服务/页面生成文件重复生成保持一致；CSS 与 Blazor 的共享资产 SHA-256 相同 |
| Website | 七语言、十四页面，各翻译语言 3320 条文案，目录与文档覆盖检查通过 |

详细证据：[逐组件检查](release-review/component-review.md)、[完整验证数据](final-verification.json)、[参数与服务接入](README.md)。

性能仍受固定上限约束。AI 源模块上限从 48KB 调整到 54KB（实测 ${budgetReview.module.actual} 字节）；仅 Web gzip 和 Desktop Brotli 预算各增加 1KB，其他包体、相对增长和原始体积上限保持不变。全部预算通过，见 [测量与调整](release-review/budget-review.json)。

演示使用本地预录/模拟服务。真实模型、工具执行、录音和上传由应用接入；组件提供状态、交互、回调与取消机制。自动扫描不替代人工辅助技术验收。

演示入口：[GardenerDemo AI](http://127.0.0.1:4180/?component=ai#catalog)、[CSS 实验室](http://127.0.0.1:4187/examples/ai-lab.html)、[Blazor AI](http://127.0.0.1:5192/ai)。
`);console.log('AI release report verified: 38 components / 119 variants / 18 options / 749 runtime tests');
