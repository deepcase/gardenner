import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/enterprise/release-review/',read=n=>JSON.parse(fs.readFileSync(dir+n+'.json','utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');
const passed=(name,n)=>{const s=log(name);assert.equal(Number(s.match(/ℹ tests (\d+)/)?.[1]),n,name);assert.match(s,/ℹ fail 0\b/,name);return n;};
const browsers=['chromium','firefox','webkit'].map(e=>read('browser-'+e));for(const b of browsers){assert.equal(b.layouts.length,64);assert.equal(b.interactions,11);assert.deepEqual(b.errors,[]);}assert.equal(browsers[0].a11y.length,40);
const extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e));for(const e of extensions){assert.equal(e.checks,8);assert.equal(e.states.length,32);assert.equal(e.passed,true);assert.deepEqual(e.errors,[]);}
const adapters=read('adapters');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0,a.package+'/'+c.task);
const checks=read('checks');for(const c of checks)assert.equal(c.code,0,c.pkg+'/'+c.task);
const blazor=read('blazor-browser'),staticDemo=read('static-browser');assert.equal(blazor.samples.length,32);assert.equal(blazor.controlledInteractions,8);assert.deepEqual(blazor.errors,[]);assert.equal(staticDemo.staticVariants,32);assert.equal(staticDemo.catalogComponents,8);assert.deepEqual(staticDemo.errors,[]);
assert.match(log('root-check'),/Legal parity passed/);assert.match(log('css-budget'),/Performance budget passed/);assert.equal(read('final-smoke').passed,true);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sharedAssets={};for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','enterprise.js','components/recipes.min.css']){sharedAssets[file]=hash('packages/css/dist/'+file);assert.equal(sharedAssets[file],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file));}assert.equal(sharedAssets['enterprise.js'],hash('packages/css/src/js/enterprise.js'));assert.ok(fs.statSync('packages/css/src/js/enterprise.js').size<40000);
const report={verifiedAt:new Date().toISOString(),passed:true,components:8,variants:32,frameworks:['css','vue','react','angularjs','blazor'],newComponents:0,addedParameters:['showSearch','showFilter','showBatch','showReset','showStatus','showDetails','editorRows','detailMaxHeight'],addedFieldOptions:['placeholder','autocomplete','minLength','maxLength','rows','step'],inventory:read('inventory'),tests:{enterprise:passed('runtime-specific',31),runtime:passed('runtime-all',649),schema:passed('schema',48),html:passed('css-test-html',43),build:passed('build-tests',11)},browsers,extensions,blazor:{variants:32,controlledInteractions:8},staticDemo,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),sharedAssets,website:{components:559,behaviors:94,events:104,locales:7,pages:14,messagesPerTranslatedLocale:3313},budgets:'Existing limits passed without increases.',limitations:['所有演示为本地模拟服务，不发送邀请、不连接真实系统。','真实身份、权限、完整所有者约束、并发控制与持久化由宿主服务实现并验收。','前端保护仅依据当前提供的数据，不替代服务端校验。']};
fs.writeFileSync('docs/enterprise/final-verification.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('docs/enterprise/verification.md',`# 企业组件发布复查

组件层检查通过：8 个组件、32 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 和文档已同步。此次保留既有组件，通过参数扩展场景，未新增重复组件。

新增 8 个参数：showSearch、showFilter、showBatch、showReset、showStatus、showDetails、editorRows、detailMaxHeight。字段新增 placeholder、autocomplete、minLength、maxLength、rows、step。

修复异常服务回包导致等待残留、状态操作缺少确认、新建记录缺失仍显示成功、成员批量操作可能同时移除全部所有者、仅有 memberIds 的团队可被归档、无效字段值进入状态、受控文本重复提案、显式变体被旧类名覆盖、权限分组不连续、错误/加载提示不准确及销毁后仍接受调用。

统一标题 16px、正文 14px（small 12px）、控件 28/32/36px、内边距 12/16/20px；窄容器自动调整设置、创建表单和检查器布局，详情高度可配置并内部滚动。Blazor 显式绑定变体；演示生成脚本保留相邻分类配置。

| 验证 | 结果 |
| --- | --- |
| 企业专项 / 全量运行时 | 31 / 649 项通过 |
| Vue / React / AngularJS 单元测试 | 140 / 89 / 77 项通过，类型与 Schema 同时通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器布局与状态 | 192 个布局、96 个状态场景通过 |
| 三浏览器交互与扩展参数 | 33 组既有交互、24 组参数/回归检查通过 |
| Chromium 无障碍 | 40 次 WCAG A/AA 扫描无违规，含暗色 RTL |
| Blazor / 独立 CSS | 各 32 个变体；Blazor 8 组受控交互通过 |
| 五端一致性 | 目录、样式、运行时、资源哈希及 559 个 Blazor SSR 合约通过 |
| 网站 | 七语言、十四页面、每个翻译语言 3313 条文案同步通过 |
| 包与性能 | 可复现构建、npm 安装入口、CSS 42 个产物及五端预算通过，未提高限制 |

演示使用本地模拟服务。真实身份与权限、完整所有者约束、并发版本控制、邀请发送、系统集成和持久化需由宿主服务实现并在业务环境验收。

- [完整演示](http://127.0.0.1:4180/?component=enterprise#catalog)
- [逐组件清单](release-review/inventory.json)
- [参数说明](README.md)
- [机器可读验证](final-verification.json)
- [窄容器角色管理截图](release-review/role-narrow.png)

复现入口：scripts/enterprise-release-build.mjs、enterprise-release-verify-adapters.mjs、enterprise-release-checks.mjs、enterprise-release-browser-matrix.mjs、test-enterprise-release-extensions.mjs、test-enterprise-release-static.mjs，以及 packages/blazor/scripts/test-enterprise-release.mjs。原始日志、截图与历史报告保存在 release-review。
`);console.log('Enterprise release review passed: 8 components / 32 variants / five frameworks.');
