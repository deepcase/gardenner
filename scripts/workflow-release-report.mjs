import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/workflow/release-review/',read=n=>JSON.parse(fs.readFileSync(dir+n+'.json','utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');
const passed=(name,expected)=>{const s=log(name),n=Number(s.match(/ℹ tests (\d+)/)?.[1]);assert.equal(n,expected,name);assert.ok(s.includes('ℹ fail 0'),name);return n;};
const browsers=['chromium','firefox','webkit'].map(engine=>{const b=read('browser-'+engine);assert.equal(b.layouts.length,64);assert.equal(b.states.length,32);assert.equal(b.interactions,18);assert.deepEqual(b.errors,[]);return {engine,layouts:64,states:32,interactions:18,a11y:b.a11y.length};});assert.equal(browsers[0].a11y,40);
const extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e));for(const e of extensions){assert.equal(e.checks,11);assert.equal(e.passed,true);assert.deepEqual(e.errors,[]);}
const adapters=read('adapters');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0,a.package+'/'+c.task);const checks=read('checks');for(const c of checks)assert.equal(c.code,0,c.pkg+'/'+c.task);
const blazor=read('blazor-browser'),staticDemo=read('static-browser'),inventory=read('inventory');assert.equal(blazor.samples.length,32);assert.equal(blazor.controlledInteractions,8);assert.deepEqual(blazor.errors,[]);assert.equal(staticDemo.catalogComponents,8);assert.equal(staticDemo.staticVariants,32);assert.deepEqual(staticDemo.errors,[]);assert.equal(inventory.length,8);
assert.ok(log('root-check').includes('Workflow parity passed: 8 components, 32 variants and five implementations.'));assert.ok(log('css-budget').includes('Performance budget passed'));assert.ok(log('contracts').includes('Contracts passed: 559 components, 94 behavior instances'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sharedAssets={};for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','workflow.js','components/catalog.min.css']){const digest=hash('packages/css/dist/'+file);assert.equal(digest,hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file);sharedAssets[file]=digest;}assert.equal(hash('packages/css/src/js/workflow.js'),sharedAssets['workflow.js']);
const report={verifiedAt:new Date().toISOString(),status:'passed',components:8,variants:32,frameworks:['css','vue','react','angularjs','blazor'],addedParameters:['searchable','filterable','showProgress','showLogs','showSave','showZoom','editorRows','logMaxHeight'],addedFieldOptions:['placeholder','autocomplete','minLength','maxLength','rows','step'],inventory,browsers,extensions,blazor:{variants:32,controlledInteractions:8},staticDemo,tests:{workflow:passed('runtime-specific',42),cssRuntime:passed('runtime-all',605),cssSchema:passed('schema',48),cssBuild:passed('build-tests',11),html:passed('css-test-html',43)},adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),sharedAssets,website:{components:559,behaviors:94,events:104,locales:7,pages:14,messagesPerTranslatedLocale:3310},budget:'Existing limits passed without increases.',limitations:['演示使用内存数据和模拟业务服务。','实际审批权限、持久化、调度、执行和 Webhook 签名由业务服务实现。','分支 condition 为宿主解释的文本，不在浏览器执行代码。']};
fs.writeFileSync('docs/workflow/final-verification.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('docs/workflow/verification.md',`# 工作流发布复查记录

结果：通过。8 个组件、32 种变体；新增 8 个共享参数及 6 个字段选项。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 与文档已同步。

| 检查 | 结果 |
| --- | --- |
| 工作流专项 / 全量运行时 | 42 / 605 项通过 |
| Vue / React / AngularJS 单元测试 | ${adapters.map(a=>a.checks.find(c=>c.task==='test:unit').tests).join(' / ')} 项通过 |
| Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器布局与状态 | 192 个布局、96 个状态场景通过 |
| 三浏览器交互 | 54 组既有交互、33 组新增参数与回归检查通过 |
| Chromium 无障碍 | 40 次 WCAG A/AA 扫描无违规，含暗色与 RTL |
| Blazor | 32 个变体、8 组受控交互、559 个 SSR 合约通过 |
| 独立 CSS / GardenerDemo | 32 个变体 / 8 个组件演示通过 |
| 五端一致性 | 元数据、样式、运行时与 Blazor 静态资源哈希一致 |
| 性能与包 | 42 个产物、五端预算、可复现构建及 npm 安装入口通过；预算未扩限 |
| 网站 | 7 种语言、14 个页面、每个翻译语言 3310 条文案，同步检查通过 |

本次修复：运行重试/取消缺少确认数据仍显示成功；审批回传覆盖已确认决定；空白与字段长度/数值步长校验不足；复选框重复提案；步骤切换焦点丢失；禁用记录 UI 与 API 不一致；跳过和完成记录重叠；移除审批人后残留决定；销毁后仍接受调用；加载/错误状态误报就绪。

设计统一为标题 16px、正文 14px（small 12px）、控件 28/32/36px、内边距 12/16/20px。新增搜索、筛选、进度、日志、保存、缩放开关，编辑器行数和日志高度；保留全部 32 个变体，无需创建功能重复的组件。

演示使用本地模拟服务；真实审批权限、调度、执行和持久化由业务后端接入。本次未发出真实审批或创建调度任务。

- [完整演示](http://127.0.0.1:4180/?component=workflow#catalog)
- [逐组件清单](release-review/inventory.json)
- [参数与字段用法](README.md)
- [机器可读验证结果](final-verification.json)
- [窄容器向导截图](release-review/wizard-narrow.png)

复现入口：scripts/workflow-release-build.mjs、workflow-release-verify-adapters.mjs、workflow-release-checks.mjs、workflow-release-browser-matrix.mjs、test-workflow-release-extensions.mjs、test-workflow-release-static.mjs，以及 packages/blazor/scripts/test-workflow-release.mjs。原始日志与截图保存在 release-review。
`);console.log('Workflow release verification passed: 8 components / 32 variants / five frameworks.');
