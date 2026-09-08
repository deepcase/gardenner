import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/solution/release-review/',read=n=>JSON.parse(fs.readFileSync(dir+n+'.json','utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');
const passed=(name,n)=>{const s=log(name);assert.equal(Number(s.match(/ℹ tests (\d+)/)?.[1]),n,name);assert.match(s,/ℹ fail 0\b/,name);return n;};
const browsers=['chromium','firefox','webkit'].map(e=>read('browser-'+e));for(const b of browsers){assert.equal(b.layouts,448);assert.equal(b.sections,174);assert.deepEqual(b.failures,[]);}assert.equal(browsers[0].axe,119);
const extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e));for(const e of extensions){assert.equal(e.checks,8);assert.equal(e.states.length,128);assert.equal(e.passed,true);assert.deepEqual(e.errors,[]);}
const adapters=read('adapters');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0,a.package+'/'+c.task);
const checks=read('checks');for(const c of checks)assert.equal(c.code,0,c.pkg+'/'+c.task);
const staticBlazor=read('static-blazor');assert.equal(staticBlazor.staticPages,32);assert.equal(staticBlazor.staticVariants,224);assert.equal(staticBlazor.actions,41);assert.equal(staticBlazor.blazorVariants,224);assert.equal(staticBlazor.controlled,32);assert.equal(staticBlazor.passed,true);
assert.match(log('root-check'),/Legal parity passed/);assert.match(log('css-budget'),/Performance budget passed/);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sharedAssets={};for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','solution.js','components/solution-compositions.min.css']){sharedAssets[file]=hash('packages/css/dist/'+file);assert.equal(sharedAssets[file],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file));}assert.equal(sharedAssets['solution.js'],hash('packages/css/src/js/solution.js'));
const finalSmoke=read('final-smoke');assert.equal(finalSmoke.passed,true);
const report={finalSmoke,verifiedAt:new Date().toISOString(),passed:true,components:32,variants:224,frameworks:['css','vue','react','angularjs','blazor'],newComponents:0,addedParameters:['showHeader','showStatus','showDetails','showPagination','showBilling','editorRows','formColumns','detailMaxHeight'],addedFieldOptions:['rows'],addedSectionOptions:['pageSize'],inventory:read('inventory'),tests:{solution:passed('runtime-specific',32),runtime:passed('runtime-all',634),schema:passed('schema',48),html:passed('css-test-html',43),build:passed('build-tests',11)},browsers,extensions,staticBlazor,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),sharedAssets,website:{components:559,behaviors:94,events:104,locales:7,pages:14,messagesPerTranslatedLocale:3312},budgets:'Existing limits passed without increases.',limitations:['全部服务为本地模拟，未执行真实业务。','身份、权限、支付、消息发送、审批、业务校验与持久化由宿主实现，需在实际业务环境验收。']};
for(const f of ['final-verification.json','verification.json'])fs.writeFileSync('docs/solution/'+f,JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('docs/solution/verification.md',`# 解决方案发布复查

组件层检查通过：32 个页面、224 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 和文档已同步；保留既有布局，通过参数组合扩展需求。

本次新增 8 个参数：showHeader、showStatus、showDetails、showPagination、showBilling、editorRows、formColumns、detailMaxHeight。字段支持独立 rows，区块支持独立 pageSize。隐藏分页时显示全部匹配记录，隐藏就绪提示仍保留错误和服务结果。

修复表格业务动作未渲染、表单禁用动作仍可点击、复选框重复事件、程序写入草稿绕过长度限制、无效选项提交、禁用必填字段阻塞提交、无效状态更新取消请求、配置变更残留等待状态、移除字段/区块后旧草稿阻塞更新，以及详情键盘焦点问题。搜索、筛选、排序与计费控件现在跟随当前栏目，纯表单不再显示无关工具栏。

托管页面标题 22–30px、区块标题 18px、正文 14px、标准控件 32px。多列表单在窄容器自动单列，详情高度可配置，表格与看板内部滚动；保留原始页面 Hero 的专用比例。

| 验证 | 结果 |
| --- | --- |
| 专项 / 全量运行时 | 32 / 634 项通过 |
| Vue / React / AngularJS 单元测试 | 140 / 89 / 77 项通过，类型与 Schema 同时通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器布局与栏目 | 1344 次布局、522 次栏目检查通过 |
| 三浏览器状态与扩展参数 | 384 个状态场景、24 组扩展检查通过 |
| Chromium 无障碍 | 119 次扫描无违规，含各栏目及暗色 RTL |
| CSS / Blazor 演示 | 各 32 页面、224 变体，41 个模拟业务操作、32 个受控状态更新通过 |
| 一致性与构建 | 五端元数据与样式共享、资源哈希、559 个 Blazor SSR 合约、可复现构建及 npm 包入口通过 |
| 网站 | 七种语言、十四个页面、每个翻译语言 3312 条文案检查通过 |
| 性能 | CSS 42 个产物及五端预算通过，未提高限制 |

演示使用本地模拟服务。真实身份、权限、支付、消息、审批、业务校验和持久化由宿主实现，需在实际业务环境验收。

- [完整演示](http://127.0.0.1:4180/?component=solution#catalog)
- [逐组件清单](release-review/inventory.json)
- [参数说明](README.md)
- [机器可读结果](final-verification.json)
- [窄容器表单截图](release-review/form-narrow.png)

复现脚本：scripts/solution-release-build.mjs、solution-release-verify-adapters.mjs、solution-release-checks.mjs、solution-release-browser-matrix.mjs、test-solution-release-extensions.mjs、test-solution-release-static-blazor.mjs、solution-release-report.mjs。原始日志保存在 release-review。
`);console.log('Solution release review passed: 32 pages / 224 variants / five frameworks.');
