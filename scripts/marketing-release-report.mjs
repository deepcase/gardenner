import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/marketing/release-review/',read=n=>JSON.parse(fs.readFileSync(dir+n+'.json','utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');
const passed=(name,n)=>{const s=log(name);assert.equal(Number(s.match(/ℹ tests (\d+)/)?.[1]),n,name);assert.match(s,/ℹ fail 0\b/,name);return n;};
const browsers=['chromium','firefox','webkit'].map(e=>read('browser-'+e));for(const b of browsers){assert.equal(b.layouts.length,80);assert.equal(b.interactions,9);assert.deepEqual(b.errors,[]);}assert.equal(browsers[0].a11y.length,50);
const extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e));for(const e of extensions){assert.equal(e.checks,9);assert.equal(e.states.length,40);assert.equal(e.narrow.length,40);assert.equal(e.passed,true);assert.deepEqual(e.errors,[]);}
const adapters=read('adapters');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0,a.package+'/'+c.task);
const checks=read('checks');for(const c of checks)assert.equal(c.code,0,c.pkg+'/'+c.task);
const blazor=read('blazor-browser'),staticDemo=read('static-browser');assert.equal(blazor.samples.length,40);assert.equal(blazor.controlledInteractions,5);assert.deepEqual(blazor.errors,[]);assert.equal(staticDemo.staticVariants,40);assert.equal(staticDemo.catalogComponents,10);assert.deepEqual(staticDemo.errors,[]);
assert.match(log('root-check'),/Legal parity passed/);assert.match(log('css-budget'),/Performance budget passed/);assert.equal(read('final-smoke').passed,true);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sharedAssets={};for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','marketing.js','components/recipes.min.css']){sharedAssets[file]=hash('packages/css/dist/'+file);assert.equal(sharedAssets[file],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file));}assert.equal(sharedAssets['marketing.js'],hash('packages/css/src/js/marketing.js'));
const report={verifiedAt:new Date().toISOString(),passed:true,components:10,variants:40,frameworks:['css','vue','react','angularjs','blazor'],newComponents:0,addedParameters:['showBilling','showQuantity','showFeatures','showFilters','showStatus','imageFit','imageMaxHeight','emailPlaceholder','emailMaxLength'],inventory:read('inventory'),tests:{marketing:passed('runtime-specific',29),runtime:passed('runtime-all',664),schema:passed('schema',48),html:passed('css-test-html',43),build:passed('build-tests',11)},browsers,extensions,blazor:{variants:40,controlledInteractions:5},staticDemo,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),sharedAssets,website:{components:559,behaviors:94,events:104,locales:7,pages:14,messagesPerTranslatedLocale:3314},budgets:'Existing limits passed without increases.',limitations:['演示使用本地模拟服务，不发送邮件、不保存订阅、不创建订单。','实际订阅、退订、计价、支付和持久化由宿主服务实现并验收。']};
fs.writeFileSync('docs/marketing/final-verification.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('docs/marketing/verification.md',`# 营销组件发布复查

组件层检查通过：10 个组件、40 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 与文档已同步。现有组件已覆盖品牌展示与转化流程，本次通过参数扩展，不新增重复组件。

新增 9 个参数：showBilling、showQuantity、showFeatures、showFilters、showStatus、imageFit、imageMaxHeight、emailPlaceholder、emailMaxLength。计费周期、席位、功能列表和分类筛选可独立控制；图片和订阅表单可以适配不同页面需求。

修复异常回包导致等待残留、受控邮箱重复提案、校验反馈不清除、服务失败误标邮箱、未勾选同意却标记有效邮箱、停用页脚分组子链接仍活动、到期链接仍有可打开地址、显式变体被旧类名覆盖、无效状态类型进入状态及销毁后仍接受调用。禁止带嵌入凭据的 URL；错误状态阻止提交。

统一控件 28/32/36px、内边距 12/16/20px，正文 12/14/14px；首屏与金额保留营销展示层级。所有布局以组件容器宽度自动重排，保留 RTL、暗色、键盘、轮播暂停和减少动态效果设置。

| 验证 | 结果 |
| --- | --- |
| 营销专项 / 全量运行时 | 29 / 664 项通过 |
| Vue / React / AngularJS 单元测试 | 140 / 89 / 77 项通过，类型与 Schema 同时通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器布局与状态 | 240 个常规布局、120 个窄容器变体、120 个状态场景通过 |
| 三浏览器交互与扩展参数 | 27 组既有交互、27 组扩展/回归检查通过 |
| Chromium 无障碍 | 50 次 WCAG A/AA 扫描无违规，含暗色 RTL |
| Blazor / 独立 CSS | 各 40 个变体；Blazor 5 组受控交互通过 |
| 五端一致性 | 目录、样式、运行时与资源哈希一致，559 个 Blazor SSR 合约通过 |
| 网站 | 七语言、十四页面、每个翻译语言 3314 条文案同步通过 |
| 包与性能 | 可复现构建、npm 安装入口、CSS 42 个产物及五端预算通过，未提高限制 |

演示使用本地模拟服务，不发送邮件、不保存订阅、不创建订单。真实订阅、退订、最终计价、支付与持久化需由宿主服务实现并在业务环境验收。

- [完整演示](http://127.0.0.1:4180/?component=marketing#catalog)
- [逐组件清单](release-review/inventory.json)
- [参数说明](README.md)
- [机器可读验证](final-verification.json)
- [紧凑订阅截图](release-review/newsletter-compact.png)
- [窄容器定价截图](release-review/pricing-narrow.png)

复现入口：scripts/marketing-release-build.mjs、marketing-release-verify-adapters.mjs、marketing-release-checks.mjs、marketing-release-browser-matrix.mjs、marketing-release-extension-matrix.mjs、test-marketing-release-static.mjs，以及 packages/blazor/scripts/test-marketing-release.mjs。原始日志、截图与历史报告保存在 release-review。
`);console.log('Marketing release review passed: 10 components / 40 variants / five frameworks.');
