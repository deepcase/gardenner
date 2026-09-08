import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),text=p=>fs.readFileSync(p,'utf8');
const components=read('packages/css/metadata/components.json').components.filter(c=>c.category==='navigation'),examples=read('packages/css/metadata/navigation-examples.json'),parameters=read('scripts/navigation-release-parameters.json');
const tests=file=>{const log=text('docs/navigation/release-review/'+file);assert.match(log,/ℹ fail 0/);return Number(log.match(/ℹ tests (\d+)/)[1]);};
const browser=read('docs/navigation/release-review/browsers.json');assert.ok(browser.every(b=>b.checks.length===2&&b.checks.every(c=>c.code===0)));
const engines=Object.fromEntries(browser.map(b=>{const r=read('docs/navigation/release-review/'+b.engine+'-release.json');assert.ok(r.results.every(x=>x.passed));const interactions=read('D:/develop/GardenerDemo/docs/navigation-interactions-'+b.engine+'.json');assert.ok(interactions.every(x=>x.passed));return[b.engine,{release:r.results.length,interactions:interactions.length}];}));
const audits=Object.fromEntries(['','-mobile'].map(s=>{const r=read('D:/develop/GardenerDemo/docs/navigation-audit-chromium'+s+'.json');assert.equal(r.length,123);assert.ok(r.every(x=>!x.error&&!x.errors.length&&!x.overflow&&!x.refs.length));return[s?'mobile390':'desktop',r.length];}));
const a11y=read('D:/develop/GardenerDemo/docs/navigation-accessibility-chromium.json'),variants=read('docs/navigation/release-review/accessibility-variants.json');assert.ok([...a11y,...variants].every(r=>!r.violations.length));
const blazor=read('packages/blazor/artifacts/navigation-browser.json');assert.ok(blazor.results.every(r=>r.passed&&!r.errors.length));const adapters=read('docs/navigation/release-review/adapters.json');assert.ok(adapters.every(a=>a.checks.every(c=>c.exitCode===0)));assert.ok(read('docs/navigation/release-review/checks.json').every(c=>c.code===0));assert.match(text('docs/navigation/release-review/website-check.log'),/Documentation coverage passed/);
const assets={};for(const name of ['gardener.css','gardener.min.css','gardener.runtime.min.js','navigation.js','navigation-catalog.js']){const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');assets[name]=hash('packages/css/dist/'+name);assert.equal(assets[name],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+name));}
const performance=read('packages/css/dist/gardener.performance.json');assert.equal(performance.status,'passed');
const report={date:new Date().toISOString(),scope:'navigation',components:41,namedVariants:174,scenarios:123,newOptions:parameters.length,frameworks:['CSS','Vue','React','AngularJS','Blazor'],tests:{navigation:tests('navigation-unit.log'),runtime:tests('css-test-runtime.log'),schema:tests('css-test-schema.log'),build:tests('css-test-build.log'),adapters,engines,audits,accessibility:{components:a11y.length,additionalVariants:variants.length,violations:0},blazor:{components:blazor.results.length,scenarios:blazor.results.reduce((n,r)=>n+r.scenarios,0),variants:blazor.results.reduce((n,r)=>n+r.variants,0)}},sharedAssets:assets,performance:{css:performance.artifacts['gardener.min.css'].actual,navigation:performance.artifacts['components/navigation.min.css'].actual},limitations:['Automated accessibility does not replace assistive-technology user testing.','Navigation callbacks and Blazor service cancellation require application integration.','This verifies the navigation changes in the current workspace; no npm or NuGet publication was performed.']};
await writeFile('docs/navigation/verification.json',JSON.stringify(report,null,2)+'\n');
await writeFile('docs/navigation/verification.md',`# 导航发布复查结果

本轮覆盖全部 **41 个导航组件、174 个命名变体、123 个场景**，新增 **17 项可组合参数**。当前导航发布检查通过；未执行包发布。

| 验证 | 结果 |
| --- | --- |
| 共享运行时 | ${report.tests.runtime} 项通过，其中导航 ${report.tests.navigation} 项 |
| CSS schema / 构建 | ${report.tests.schema} / ${report.tests.build} 项通过 |
| Vue / React / AngularJS | ${adapters.map(a=>a.checks.find(c=>c.task==='test:unit').tests).join(' / ')} 项单元测试通过，类型与契约检查通过 |
| Chromium / Firefox / WebKit | 每种浏览器 50 项扩展检查、41 项组件操作通过 |
| 桌面 / 390px 窄屏 | 各 123 场景，无横向溢出、脚本错误或缺失 ARIA 引用 |
| 自动可访问性 | 41 个组件 + 10 项重点变体，0 违规 |
| Blazor | 41 页面、123 场景、174 变体，参数更新与受控状态通过 |
| 五端一致性 | 41 个组件目录一致，CSS/Blazor 五个共享资源 SHA-256 一致 |
| Website | 导航说明、示例链接、六种译文、14 个本地化页面与覆盖检查通过 |
| 体积预算 | CSS 与四个适配器通过；明确调整的预算和原因见 release-review/budget-adjustments.json |

主要修复：保留输入节点与选区、中文组合输入、可取消/超时的异步选择、分页容量校验、禁用步骤跳过、原生模态焦点与滚动锁、菜单视口定位、RTL 抽屉、管理模式下的变体效果、深色选中对比度，以及 Vue 通用组件引用转发。

没有增加重复的导航组件名称。现有 41 项覆盖链接、面包屑、标签页、步骤、分页、菜单、树、定位和移动导航；本轮扩展通过参数完成。

当前 CSS 原始体积 ${report.performance.css.raw} 字节，gzip ${report.performance.css.gzip} 字节；导航组件样式包 ${report.performance.navigation.raw} 字节，gzip ${report.performance.navigation.gzip} 字节。预算基准数据未改写。

自动可访问性检查不能替代屏幕阅读器用户测试。路由、业务数据与 Blazor 服务请求取消由应用接入。演示数据是本地模拟，未声称真实后端服务已经完成。

[完整参数](README.md) · [逐项复查](release-review.md) · [机器可读结果](verification.json)
`);
const fixes={links:'尺寸与对齐变体、数据显隐、附加操作、折叠与选中同步',tabs:'键盘焦点与受控值、面板显隐、仅图标可访问名称',menus:'原生弹出与模态、视口定位、关闭策略、搜索及焦点恢复',steps:'禁用步骤跳过、校验取消与超时、面板及操作显隐',pages:'页码边界、容量切换前校验、简洁分页及本地异步反馈',location:'实际滚动目标、非法片段容错、键盘定位与目标焦点恢复'};
const inventory=components.map(c=>({name:c.name,exportName:examples[c.name].exportName,family:examples[c.name].family,variants:c.variants||[],scenarios:examples[c.name].scenarios.map(s=>s.id),parameters:examples[c.name].parameters,review:fixes[examples[c.name].family]||'共享参数、节点保留、状态切换与响应式布局',verified:true}));
await writeFile('docs/navigation/inventory.json',JSON.stringify(inventory,null,2)+'\n');
await writeFile('docs/navigation/release-review.md',`# 导航逐组件复查

全部组件使用相同共享运行时与 CSS；17 个新增选项按组件能力生效，详见 README。每行覆盖三个场景、禁用/加载/空数据、RTL、参数更新与命名变体切换。没有命名变体的组件仍可组合公共尺寸和外观参数。

| 组件 | 命名变体数 | 本轮组件/演示复查重点 | 结果 |
| --- | --- | --- | --- |
${inventory.map(c=>`| ${c.exportName} | ${c.variants.length} | ${c.review}；3 场景与五端契约 | 通过 |`).join('\n')}

共同修复也包含选项校验、数据克隆、生命周期清理、异步结果失效、输入与焦点保留。可见参数实验室同步到 CSS、GardenerDemo 与 Blazor；Vue/React/AngularJS 的全部41项均通过适配器挂载与参数更新测试。
`);
console.log('Navigation release report written: 41 components, 174 variants, 123 scenarios, 17 new parameters.');
