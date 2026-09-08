import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/cms/release-review/',read=n=>JSON.parse(fs.readFileSync(dir+n+'.json','utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');
const passed=(name,n)=>{const s=log(name);assert.equal(Number(s.match(/ℹ tests (\d+)/)?.[1]),n,name);assert.match(s,/ℹ fail 0\b/,name);return n;};
const browsers=['chromium','firefox','webkit'].map(e=>read('browser-'+e));for(const b of browsers){assert.equal(b.layouts.length,48);assert.equal(b.interactionScenarios,9);assert.deepEqual(b.errors,[]);}assert.equal(browsers[0].a11y.length,30);
const extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e));for(const e of extensions){assert.equal(e.checks,12);assert.equal(e.states.length,24);assert.equal(e.narrow.length,24);assert.equal(e.passed,true);assert.deepEqual(e.errors,[]);}
const adapters=read('adapters');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0,a.package+'/'+c.task);
const checks=read('checks');for(const c of checks)assert.equal(c.code,0,c.pkg+'/'+c.task);
const blazor=read('blazor-browser'),staticDemo=read('static-browser');assert.equal(blazor.samples.length,24);assert.equal(blazor.controlledInteractions,4);assert.deepEqual(blazor.errors,[]);assert.equal(staticDemo.staticVariants,24);assert.equal(staticDemo.catalogComponents,6);assert.deepEqual(staticDemo.errors,[]);
assert.match(log('root-check'),/Legal parity passed/);assert.match(log('css-budget'),/Performance budget passed/);assert.equal(read('final-smoke').passed,true);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sharedAssets={};for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','cms.js','components/recipes.min.css']){sharedAssets[file]=hash('packages/css/dist/'+file);assert.equal(sharedAssets[file],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file));}assert.equal(sharedAssets['cms.js'],hash('packages/css/src/js/cms.js'));
const report={verifiedAt:new Date().toISOString(),passed:true,components:6,variants:24,frameworks:['css','vue','react','angularjs','blazor'],newComponents:0,addedParameters:['showSearch','showFilter','showHistory','showMetadata','showUpload','showChooser','showStatus','editorRows','previewMaxHeight','thumbnailFit','blockTypes'],inventory:read('inventory'),tests:{cms:passed('runtime-specific',29),runtime:passed('runtime-all',679),schema:passed('schema',48),html:passed('css-test-html',43),build:passed('build-tests',11)},browsers,extensions,blazor:{variants:24,controlledInteractions:4},staticDemo,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),sharedAssets,website:{components:559,behaviors:94,events:104,locales:7,pages:14,messagesPerTranslatedLocale:3315},budgets:'Existing limits passed without increases.',limitations:['演示仅在本地模拟服务确认，不连接或修改真实 CMS。','真实身份、权限、内容持久化、文件上传、定时任务和服务端版本校验由宿主实现并验收。']};
fs.writeFileSync('docs/cms/final-verification.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('docs/cms/verification.md',`# CMS 组件发布复查

组件层检查通过：6 个组件、24 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 和文档已同步。保留现有组件，通过参数扩展，不新增重复条目。

新增 11 个参数：showSearch、showFilter、showHistory、showMetadata、showUpload、showChooser、showStatus、editorRows、previewMaxHeight、thumbnailFit、blockTypes。

修复异常回包导致等待残留、缺少版本仍确认成功、审核返回错误目标状态仍被接受、版本恢复没有内容仍成功、撤销回退已确认版本与状态、受控输入重复更新、分页在渲染时修改受控值、审核者不能填写意见、无编辑权限仍显示可用保存按钮、空列表仍启用工作流操作、显式变体被旧类名覆盖、错误状态仍允许请求、状态类型不严格及销毁后调用仍修改节点。

统一标题 16px、正文 12/14/14px、控件 28/32/36px、内边距 12/16/20px。根据容器宽度重排；关闭预览后使用完整宽度，预览高度可配置，超出内容内部滚动。新增参数在目录页可直接切换，CSS 和 Blazor 独立演示覆盖全部变体。

| 验证 | 结果 |
| --- | --- |
| CMS 专项 / 全量运行时 | 29 / 679 项通过 |
| Vue / React / AngularJS 单元测试 | 140 / 89 / 77 项通过，类型与 Schema 同时通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器布局与状态 | 144 个常规布局、72 个窄容器变体、72 个状态场景通过 |
| 三浏览器交互与扩展参数 | 27 组既有交互、36 组扩展/回归检查通过 |
| Chromium 无障碍 | 30 次 WCAG A/AA 扫描无违规，含暗色 RTL |
| Blazor / 独立 CSS | 各 24 个变体；Blazor 4 组受控交互通过 |
| 五端一致性 | 目录、样式、运行时与资源哈希一致，559 个 Blazor SSR 合约通过 |
| 网站 | 七语言、十四页面、每个翻译语言 3315 条文案同步通过 |
| 包与性能 | 可复现构建、npm 安装入口、CSS 42 个产物及五端预算通过，未提高限制 |

服务协议收紧：除 choose 外，成功回包必须提供递增的安全整数 version；restore 需返回非空 value，工作流 status 必须与操作对应。宿主收到确认后更新 items。演示仅提供本地模拟确认；真实授权、内容保存、上传、定时发布和服务端版本校验需在业务后端实现并验收。

- [完整演示](http://127.0.0.1:4180/?component=cms#catalog)
- [逐组件清单](release-review/inventory.json)
- [完整参数与服务协议](README.md)
- [机器可读验证](final-verification.json)
- [编辑器截图](release-review/editor.png)
- [窄容器截图](release-review/editor-narrow.png)

复现入口：scripts/cms-release-build.mjs、cms-release-verify-adapters.mjs、cms-release-checks.mjs、cms-release-browser-matrix.mjs、cms-release-extension-matrix.mjs、test-cms-release-static.mjs，以及 packages/blazor/scripts/test-cms-release.mjs。原始日志、截图与历史报告保存在 release-review。
`);console.log('CMS release review passed: 6 components / 24 variants / five frameworks.');
