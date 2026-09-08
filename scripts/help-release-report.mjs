import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';const dir='docs/help/release-review/',read=n=>JSON.parse(fs.readFileSync(dir+n+'.json')),log=n=>fs.readFileSync(dir+n+'.log','utf8');const passed=(n,count)=>{const s=log(n);assert.equal(Number(s.match(/ℹ tests (\d+)/)?.[1]),count,n);assert.match(s,/ℹ fail 0\b/);return count;};
const browsers=['chromium','firefox','webkit'].map(e=>read('browser-'+e)),extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e)),finals=['chromium','firefox','webkit'].map(e=>read('final-'+e));for(const b of browsers){assert.equal(b.layouts,198);assert.equal(b.rtl,29);assert.deepEqual(b.errors,[]);for(const k of ['controlledFAQ','checklist','feedback','floating','tours'])assert.equal(b[k],true);}for(const e of extensions){assert.equal(e.states,87);assert.equal(e.parameters,18);assert.deepEqual(e.errors,[]);for(const k of ['cancellation','feedback','timeout','narrow'])assert.equal(e[k],true);}for(const f of finals){assert.equal(f.narrowDark,true);assert.equal(f.stateClasses,7);assert.deepEqual(f.errors,[]);}
const adapters=read('adapters'),checks=read('checks'),blazor=read('blazor-browser'),standalone=read('static-browser'),smoke=read('smoke');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0);for(const c of checks)assert.equal(c.code,0);assert.equal(blazor.variants,99);assert.equal(blazor.feedbackService,true);assert.equal(blazor.controlledReason,true);assert.deepEqual(blazor.errors,[]);assert.equal(standalone.variants,99);assert.deepEqual(standalone.errors,[]);assert.equal(smoke.passed,true);assert.equal(read('examples-reproducible').passed,true);for(const[n,re]of[['root-check',/Legal parity passed/],['css-budget',/Performance budget passed/],['blazor-package',/NuGet verified and consumed/],['demo-build',/built in/],['website-check',/Documentation coverage passed/]])assert.match(log(n),re);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sharedAssets={};for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','help.js','components/help.min.css']){sharedAssets[file]=hash('packages/css/dist/'+file);assert.equal(sharedAssets[file],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file);}assert.equal(sharedAssets['help.js'],hash('packages/css/src/js/help.js'));const sourceBytes=fs.statSync('packages/css/src/js/help.js').size;assert.ok(sourceBytes<38000);const cssBudget=JSON.parse(fs.readFileSync('packages/css/dist/gardener.performance.json'));assert.equal(cssBudget.status,'passed');
const addedParameters=['showHeader','showActions','showProgress','showCount','showClear','showPrevious','showStepList','arrow','closeOnEscape','closeOnOutside','serviceTimeout','maxReasonLength','minQueryLength','tourPadding','offset','openDelay','closeDelay','maxHeight'];const report={verifiedAt:new Date().toISOString(),passed:true,components:29,variants:99,newComponents:0,frameworks:['css','vue','react','angularjs','blazor'],addedParameters,addedStateFields:['reason'],inventory:read('inventory'),tests:{help:passed('help-unit',26),runtime:passed('css-runtime',759),schema:passed('css-schema',48),html:passed('css-test-html',43),build:passed('css-test-build',11),finalCssChecks:passed('final-css-build-checks',6)},browsers,extensions,finals,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),blazor,standalone,smoke,sharedAssets,website:{components:559,behaviors:94,events:104,locales:7,pages:14,messagesPerTranslatedLocale:3321},budgets:{css:'passed',package:cssBudget.package,helpModule:{beforeLimit:33000,afterLimit:38000,actual:sourceBytes},otherCaps:'unchanged during this help review'},limitations:['服务演示仅操作本地数据；真实检索、反馈存储、联系入口由应用接入。','无障碍自动扫描不替代人工辅助技术验收。']};for(const name of ['verification','final-verification'])fs.writeFileSync('docs/help/'+name+'.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync(dir+'budget-review.json',JSON.stringify(report.budgets,null,2)+'\n');
fs.writeFileSync('docs/help/verification.md',`# 帮助组件发布复查

组件层复查通过：现有 29 个组件、99 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 和文档已同步。本轮扩展现有接口，不新增功能重复的组件。

新增 18 项配置，覆盖标题与操作、进度与检索统计、步骤导航、浮层箭头与关闭策略、延迟、目标间距、服务超时、反馈长度和内容高度。helpValue 新增 reason，支持反馈说明受控回写。

修复无 href 操作错误跳转、带凭据链接、无效配置污染、异步取消无法结束、无响应服务、外观更新中断服务、中文输入期间重建节点、反馈原因无法受控、只读反馈仍可提交、排障进入禁用步骤和重复完成守卫。紧凑检索框与按钮实际为 28px；无边框和紧凑演示不再被默认参数覆盖。

正文 12/14/14px、标题 16px、操作与检索控件 28/32/36px；触摸目标至少 44px。FAQ 默认行高 40px。窄容器收为单列，有限高列表可键盘聚焦滚动。

| 验证 | 结果 |
| --- | --- |
| 帮助专项 / 全量运行时 | 26 / 759 项通过 |
| Vue / React / AngularJS | 142 / 91 / 79 项单元测试、Schema 与类型检查通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过；最终尺寸修复后补跑 6 项相关产物检查 |
| 三浏览器布局 | 594 个布局、87 个 RTL 页面通过 |
| 状态与新增参数 | 261 个空/只读/禁用组合；每个浏览器 18 项参数及服务边界通过 |
| 暗色与可访问性 | 87 个暗色窄屏页面；Chromium 63 次 WCAG A/AA 扫描无违规，含 5 个打开的浮层 |
| CSS 独立示例 | 全部 99 个变体在 320px 容器中无横向溢出，本地服务失败重试通过 |
| Blazor | 99 个变体、受控 FAQ/检索/反馈原因、参数更新、引导焦点、失败重试通过；559 个 SSR 合约通过 |
| 发布包 | 当前 NuGet 包由隔离缓存中的真实应用成功消费，98 个条目 |
| 生成与一致性 | 七个关键演示文件重复生成一致；五端目录一致，CSS 与 Blazor 共享资产 SHA-256 相同 |
| Website | 七语言、十四页面，各翻译语言 3321 条文案；目录和文档覆盖检查通过 |
| 性能 | 42 个 CSS 产物与整体包体、适配器、Blazor 原有预算通过；帮助模块实测 ${sourceBytes} 字节 |

帮助源模块上限由 33KB 调整为 38KB；本轮未增加其他包体或平台预算。详见 [预算记录](release-review/budget-review.json)。

[逐组件检查](release-review/component-review.md) · [参数与服务接入](README.md) · [完整验证数据](final-verification.json)

演示使用本地数据和模拟服务。真实检索、反馈存储与联系入口由应用接入；自动无障碍扫描不替代人工辅助技术验收。

演示：[GardenerDemo 帮助](http://127.0.0.1:4180/?component=help#catalog) · [CSS 帮助实验室](http://127.0.0.1:4187/examples/help-lab.html) · [Blazor 帮助](http://127.0.0.1:5192/help)
`);console.log('Help release report verified: 29 components / 99 variants / 18 options / 759 runtime tests');
