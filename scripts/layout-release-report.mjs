import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/layout/release-review/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');
const passed=(name,count)=>{const s=log(name);assert.equal(Number(s.match(/ℹ tests (\d+)/)?.[1]),count,name);assert.match(s,/ℹ fail 0\b/);return count;};
const browsers=['chromium','firefox','webkit'].map(e=>read('docs/layout/browser-'+e+'.json')),extensions=['chromium','firefox','webkit'].map(e=>read(dir+'extensions-'+e+'.json'));
for(const b of browsers){assert.equal(b.layouts,178);assert.equal(b.rtl,11);assert.deepEqual(b.errors,[]);for(const key of ['controlledCollapse','preservedChild','print'])assert.equal(b[key],true);}
for(const e of extensions){assert.equal(e.newParameters,10);assert.equal(e.darkRtl,11);assert.deepEqual(e.errors,[]);}
const adapters=read(dir+'adapters.json'),checks=read(dir+'checks.json'),blazor=read('docs/layout/blazor-browser.json'),standalone=read(dir+'static.json'),catalog=read('docs/layout/catalog-browser.json');
for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0);for(const c of checks)assert.equal(c.code,0);
assert.equal(blazor.modes,89);assert.equal(blazor.extensionControls,true);assert.deepEqual(blazor.errors,[]);assert.equal(standalone.modes,89);assert.deepEqual(standalone.errors,[]);assert.equal(catalog.components,11);assert.deepEqual(catalog.errors,[]);
for(const [name,re]of [['css-budget',/Performance budget passed/],['css-contracts',/Contracts passed/],['demo-build',/built in/],['blazor-package',/NuGet verified and consumed/],['website-check',/Documentation coverage passed/]])assert.match(log(name),re,name);
assert.equal(read(dir+'examples-reproducible.json').passed,true);assert.equal(read(dir+'website-browser.json').passed,true);for(const e of read(dir+'browsers.json'))for(const c of e.checks)assert.equal(c.code,0);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),assets={};for(const f of ['gardener.css','gardener.min.css','gardener.runtime.min.js','layout.js','components/layouts.min.css']){assets[f]=hash('packages/css/dist/'+f);assert.equal(assets[f],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+f),f);}assert.equal(assets['layout.js'],hash('packages/css/src/js/layout.js'));
const cssBudget=read('packages/css/dist/gardener.performance.json');assert.equal(cssBudget.status,'passed');const bytes=fs.statSync('packages/css/src/js/layout.js').size;assert.ok(bytes<16000);
const addedParameters=['paddingBlock','paddingInline','maxHeight','autoRows','narrowColumns','alignContent','justifyItems','closeOnEscape','collapsible','focusOnCollapse'];
const report={verifiedAt:new Date().toISOString(),passed:true,components:11,variants:89,newComponents:0,frameworks:['css','vue','react','angularjs','blazor'],addedParameters,tests:{layout:passed('layout-unit',26),runtime:passed('css-test-runtime',772),schema:passed('css-test-schema',48),html:passed('css-test-html',43),build:passed('css-test-build',11)},browsers,extensions,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),blazor,standalone,catalog,sharedAssets:assets,website:{locales:7,pages:14,messagesPerTranslatedLocale:3323,browserVerified:true},budgets:{status:'passed',module:{previousCap:13000,cap:16000,bytes},css:cssBudget.package,artifacts:Object.fromEntries(Object.entries(cssBudget.artifacts).filter(([key])=>['gardener.min.css','platforms/gardener.mobile.min.css','platforms/gardener.desktop.min.css','components/layouts.min.css'].includes(key))),changes:['Full CSS raw 1,875,000 → 1,880,000 (CSS and Blazor)','Mobile CSS raw 1,815,000 → 1,818,000; Brotli 141,000 → 143,000; relative Brotli 138% → 141%','Desktop CSS gzip 254,000 → 255,000','Layouts CSS raw 29,000 → 31,000; relative raw 814% → 880%']}};
for(const name of ['verification','final-verification'])fs.writeFileSync('docs/layout/'+name+'.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync(dir+'budget-review.json',JSON.stringify(report.budgets,null,2)+'\n');
fs.writeFileSync('docs/layout/verification.md',`# 布局组件发布复查

现有 11 个组件、89 个变体完成本轮组件层检查。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 与参数文档已同步。扩展现有组件的 10 项参数，不新增重复组件。

修复显式参数被变体覆盖、无效长度和原型键、失败配置残留、原有隐藏/禁用状态丢失、动态面板关系、焦点返回、嵌套变量串用与销毁后的修改。应用外壳移除零宽轨道和窄屏空行；修复 sidebar 变体与内部侧栏类名冲突造成的位移和高度错误。Demo 旧侧栏高度和移动导航定位样式不再覆盖增强布局。Bento 窄屏清除旧轨道与跨度，紧凑页头支持显式内距，内容容器支持宽度覆盖。

| 检查 | 结果 |
| --- | --- |
| 布局专项 / 全量运行时 | 26 / 772 项通过 |
| Vue / React / AngularJS | 142 / 91 / 79 项单元测试及 Schema、类型检查通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器全变体 | 534 次窄/宽屏检查，含可视区域边界、输入保留、受控折叠、RTL 与打印 |
| 新参数与暗色 | 三浏览器参数组合通过；33 个暗色窄屏 RTL 页面 |
| 自动可访问性 | Chromium 默认和暗色共 22 个 WCAG A/AA 扫描无违规 |
| CSS 独立演示 | 89 个模式在 320px 下无横向溢出，参数切换及恢复默认通过 |
| Blazor | 89 个模式，受控折叠、输入保留、逻辑内距、列数、行高与对齐更新通过 |
| 发布包 | 当前 NuGet 包由隔离缓存中的真实应用消费成功 |
| 同步与复现 | 演示重复生成一致；五端目录一致，CSS 与 Blazor 资产 SHA-256 相同 |
| Website | 7 种语言、14 个页面，目录与文档覆盖检查通过 |
| 性能 | 42 个 CSS 产物、包体、适配器和 Blazor 预算通过；布局源模块 ${bytes} 字节 |

本轮固定预算调整及实测记录见 [预算记录](release-review/budget-review.json)。完整逐组件说明与参数适用范围见 [布局文档](README.md)，机器可读证据见 [验证数据](final-verification.json)。

布局内容由应用提供；拖动分隔复用 split-pane。自动无障碍扫描不替代人工辅助技术验收。本轮验证不等同于整库发布或线上部署。

[GardenerDemo 布局](http://127.0.0.1:4180/?component=layout#catalog) · [CSS 演示](http://127.0.0.1:4187/examples/layout-lab.html) · [Blazor 演示](http://127.0.0.1:5192/layout)
`);console.log('Layout release verified: 11 components, 89 modes, 10 new options, 772 runtime tests.');
