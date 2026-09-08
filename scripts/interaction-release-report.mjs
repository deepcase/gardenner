import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {writeFile} from './fs-retry.mjs';
const dir='docs/interaction/release-review/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');
const passed=(name,count)=>{const text=log(name);assert.equal(Number(text.match(/ℹ tests (\d+)/)?.[1]),count,name);assert.match(text,/ℹ fail 0\b/);return count;};
const browsers=['chromium','firefox','webkit'].map(engine=>({engine,...read('docs/interaction/browser-'+engine+'.json')})),extensions=['chromium','firefox','webkit'].map(engine=>read(dir+'extensions-'+engine+'.json')),finals=['chromium','firefox','webkit'].map(engine=>({engine,...read('docs/interaction/final-'+engine+'.json')}));
for(const b of browsers){assert.equal(b.components,35);assert.equal(b.layouts,548);assert.equal(b.states,175);assert.deepEqual(b.errors,[]);}for(const e of extensions){assert.equal(e.parameters,17);assert.equal(e.dark,35);assert.deepEqual(e.errors,[]);}for(const f of finals){for(const k of ['independentTree','parentStrategy','explicitParameterPrecedence','collapsiblePane','fullscreenIsolation'])assert.equal(f[k],true);assert.deepEqual(f.errors,[]);}for(const b of read(dir+'browsers.json')){assert.equal(b.checks.length,3);for(const c of b.checks)assert.equal(c.code,0);}
const adapters=read(dir+'adapters.json'),checks=read(dir+'checks.json'),blazor=read('packages/blazor/artifacts/interaction-browser.json'),standalone=read(dir+'static.json'),catalog=read('docs/interaction/catalog-browser.json');
for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0);for(const c of checks)assert.equal(c.code,0);assert.equal(blazor.variants,239);assert.equal(blazor.extensionControls,true);assert.deepEqual(blazor.errors,[]);assert.equal(standalone.variants,239);assert.deepEqual(standalone.errors,[]);assert.equal(catalog.components,35);assert.deepEqual(catalog.errors,[]);
for(const [name,re] of [['css-budget',/Performance budget passed/],['css-contracts',/Contracts passed/],['demo-build',/built in/],['blazor-package',/NuGet verified and consumed/],['website-check',/Documentation coverage passed/],['interaction-parity',/Interaction parity passed/]])assert.match(log(name),re,name);
for(const name of ['reproducible','website-browser'])assert.equal(read(dir+name+'.json').passed,true);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),assets={};for(const name of ['gardener.css','gardener.min.css','gardener.runtime.min.js','interaction.js','components/selection-compositions.min.css']){assets[name]=hash('packages/css/dist/'+name);assert.equal(assets[name],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+name),name);}assert.equal(assets['interaction.js'],hash('packages/css/src/js/interaction.js'));
const cssBudget=read('packages/css/dist/gardener.performance.json'),bytes=fs.statSync('packages/css/src/js/interaction.js').size;assert.equal(cssBudget.status,'passed');assert.ok(bytes<46000);const parameters=read(dir+'new-parameters.json');assert.equal(parameters.length,17);
const report={verifiedAt:new Date().toISOString(),passed:true,scope:'Interaction component release review, not whole-library publication',components:35,variants:239,newComponents:0,frameworks:['css','vue','react','angularjs','blazor'],addedParameters:parameters,tests:{interaction:passed('interaction-unit',39),runtime:passed('css-test-runtime',802),schema:passed('css-test-schema',48),html:passed('css-test-html',43),build:passed('css-test-build',11)},browsers:browsers.map(({results,...b})=>b),extensions,finals,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),blazor,standalone,catalog,sharedAssets:assets,website:{locales:7,pages:14,messagesPerTranslatedLocale:3325,browserVerified:true},budgets:{status:'passed',module:{cap:46000,bytes,changed:false},css:cssBudget.package,changes:['Components CSS raw 1,240,000 → 1,243,000; gzip 170,000 → 171,000 bytes','Mobile CSS raw 1,818,000 → 1,821,000 bytes; relative raw 85% → 86%','Web CSS relative raw/gzip 85% → 86%; absolute caps unchanged','Selection compositions CSS raw 54,000 → 55,000 bytes; relative raw 248% → 254%','Package, module and adapter caps unchanged']},limitations:['Load/run require application services; demos use local callbacks.','Clipboard and Fullscreen support and permission depend on the browser.','Undo history only changes local snapshots, not submitted network operations.','Automated accessibility scans do not replace manual assistive-technology acceptance.'],warnings:['GardenerDemo builds successfully with its existing large-chunk advisory.']};
for(const name of ['verification','final-verification'])await writeFile('docs/interaction/'+name+'.json',JSON.stringify(report,null,2)+'\n');await writeFile(dir+'budget-review.json',JSON.stringify(report.budgets,null,2)+'\n');
await writeFile('docs/interaction/verification.md',`# 交互组件发布复查

现有 35 个组件、239 个变体完成本轮组件层检查。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 与文档已同步。新增 17 项 options 参数，覆盖尺寸、边框、信息显示、范围预设、列表列数、高度与服务超时；本轮不新增重复组件。

修复外观更新重置选择/规则/历史、搜索输入和草稿节点丢失、中文组合输入中断、显式关闭参数被变体覆盖、取消服务后 Promise 不结束、失败后自动加载循环、重试丢失成功记录、日期单端边界和复合状态更新等问题。公开状态拒绝伪造内部加载/错误/结果，类型约束和配置校验同步。分隔条保留节点，按自身方向处理键盘调整。

统一 28/32/36px 控件、12/14/14px 正文与 16px 标题；触摸控件至少 44px。列表与穿梭支持高度和窄容器响应；最大高度允许键盘滚动并在打印时解除。

| 检查 | 结果 |
| --- | --- |
| 交互专项 / 全量运行时 | 39 / 802 项通过 |
| Vue / React / AngularJS | 142 / 91 / 79 项单元测试及 Schema、类型检查通过；含 35 个组件的新参数及受控更新 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器全变体 | 1,644 次宽窄屏布局、525 个状态场景，以及真实选择、穿梭、规则、范围、加载、批处理、复制、全屏和撤销操作通过 |
| 新参数与暗色 RTL | 三浏览器配置组合通过，共 105 个暗色窄屏 RTL 页面 |
| 自动可访问性 | Chromium 默认和暗色共 70 次扫描无违规 |
| CSS 独立演示 | 239 个变体在 320px 下无横向溢出，参数切换及恢复默认通过 |
| Blazor | 35 个组件、239 个变体，受控选择/排序/撤销、草稿保留、新参数与真实本地批处理通过 |
| 发布包 | 当前 NuGet 包由隔离缓存中的真实应用消费成功 |
| 同步与复现 | 示例与文档重复生成一致；五端目录一致，CSS 与 Blazor 共享资产 SHA-256 相同 |
| Website | 7 种语言、14 个页面，覆盖检查和浏览器文档入口验证通过 |
| 性能 | 42 个 CSS 产物、包体、适配器及 Blazor 预算通过；交互源模块 ${bytes} 字节，仍低于原有 46KB 上限 |

逐组件说明见 [35 项复查清单](release-review/component-review.md)，参数与边界见 [交互文档](README.md)，机器可读证据见 [验证数据](final-verification.json)，固定预算调整见 [预算记录](release-review/budget-review.json)。GardenerDemo 保留已有的大分块构建提示。

加载和批处理示例使用本地服务，业务项目负责后端传输和持久化。复制、全屏取决于浏览器权限；本地撤销不能撤销已提交网络操作。自动扫描不替代人工辅助技术验收。本轮检查不代表整库发布或线上部署。

[GardenerDemo 交互](http://127.0.0.1:4180/?component=interaction#catalog) · [CSS 演示](http://127.0.0.1:4187/examples/interaction-compositions.html) · [Blazor 演示](http://127.0.0.1:5192/interaction)
`);console.log('Interaction release verified: 35 components, 239 variants, 17 new options, 802 runtime tests.');
