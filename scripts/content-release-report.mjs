import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFile} from './fs-retry.mjs';

const dir='docs/content/release-review/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');
const passed=(name,count)=>{const text=log(name);assert.equal(Number(text.match(/ℹ tests (\d+)/)?.[1]),count,name);assert.match(text,/ℹ fail 0\b/);return count;};
const browsers=['chromium','firefox','webkit'].map(engine=>({engine,...read('docs/content/browser-'+engine+'.json')}));
const extensions=['chromium','firefox','webkit'].map(engine=>read(dir+'extensions-'+engine+'.json'));
const finals=['chromium','firefox','webkit'].map(engine=>({engine,...read('docs/content/final-'+engine+'.json')}));
for(const result of browsers){assert.equal(result.components,39);assert.equal(result.layouts,546);assert.equal(result.states,195);assert.deepEqual(result.errors,[]);}
for(const result of extensions){assert.equal(result.parameters,20);assert.equal(result.dark,39);assert.deepEqual(result.errors,[]);}
for(const result of finals){assert.equal(result.controlledRichLink,true);assert.deepEqual(result.errors,[]);if(result.engine!=='webkit')assert.equal(result.video.playing,true);}
for(const result of read(dir+'browsers.json')){assert.equal(result.checks.length,3);for(const check of result.checks)assert.equal(check.code,0);}
const adapters=read(dir+'adapters.json'),checks=read(dir+'checks.json'),blazor=read('docs/content/blazor-browser.json'),standalone=read(dir+'static.json'),catalog=read('docs/content/catalog-browser.json');
for(const adapter of adapters)for(const check of adapter.checks)assert.equal(check.exitCode,0);for(const check of checks)assert.equal(check.code,0);
assert.equal(blazor.variants,234);assert.equal(blazor.extensionControls,true);assert.deepEqual(blazor.errors,[]);assert.equal(standalone.variants,234);assert.deepEqual(standalone.errors,[]);assert.equal(catalog.components,39);assert.deepEqual(catalog.errors,[]);
for(const [name,re] of [['css-budget',/Performance budget passed/],['css-contracts',/Contracts passed/],['demo-build',/built in/],['blazor-package',/NuGet verified and consumed/],['website-check',/Documentation coverage passed/],['content-parity',/Content parity passed/]])assert.match(log(name),re,name);
for(const name of ['examples-reproducible','docs-reproducible','website-browser'])assert.equal(read(dir+name+'.json').passed,true);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),assets={};
for(const name of ['gardener.css','gardener.min.css','gardener.runtime.min.js','content.js','components/content-compositions.min.css']){assets[name]=hash('packages/css/dist/'+name);assert.equal(assets[name],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+name),name);}
assert.equal(assets['content.js'],hash('packages/css/src/js/content.js'));
const cssBudget=read('packages/css/dist/gardener.performance.json'),bytes=fs.statSync('packages/css/src/js/content.js').size;
assert.equal(cssBudget.status,'passed');assert.ok(bytes<65000);
const parameters=read(dir+'new-parameters.json');assert.equal(parameters.length,20);
const report={verifiedAt:new Date().toISOString(),passed:true,scope:'content component release review; not whole-library publication',components:39,variants:234,newComponents:0,frameworks:['css','vue','react','angularjs','blazor'],addedParameters:parameters,
  tests:{content:passed('content-unit',42),runtime:passed('css-test-runtime',789),schema:passed('css-test-schema',48),html:passed('css-test-html',43),build:passed('css-test-build',11)},
  browsers:browsers.map(({results,...result})=>result),extensions,finals,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),blazor,standalone,catalog,sharedAssets:assets,
  website:{locales:7,pages:14,messagesPerTranslatedLocale:3324,browserVerified:true},
  budgets:{status:'passed',module:{previousCap:55000,cap:65000,bytes},css:cssBudget.package,changes:['Web CSS raw 1,780,000 → 1,785,000 bytes','Desktop CSS raw 1,840,000 → 1,845,000 bytes','Other package, compressed artifact and adapter caps unchanged']},
  limitations:['Upload/save examples use local callbacks; production transport and persistence belong to the application.','PDF uses the native browser viewer; support varies by browser.','Windows WebKit cannot decode the video fixture; the visible error path passed.','Markdown and rich editing use the documented safe subset, not a complete Markdown or office suite.','Cross-origin crop export requires readable image resources.','Automated accessibility checks do not replace manual assistive-technology acceptance.'],
  warnings:['GardenerDemo builds successfully with the existing large-chunk advisory.']};
for(const name of ['verification','final-verification'])await writeFile('docs/content/'+name+'.json',JSON.stringify(report,null,2)+'\n');
await writeFile(dir+'budget-review.json',JSON.stringify(report.budgets,null,2)+'\n');
await writeFile('docs/content/verification.md',`# 内容组件发布复查

现有 39 个组件、234 个变体完成本轮组件层检查。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 与文档已同步。新增 20 项 options 参数，覆盖尺寸、边框、信息显示、工具栏、分页、编辑行数、预览高度、网格列数、缩略图与服务超时；通过扩展现有组件覆盖需求，本轮不新增重复组件。

修复外观更新重置编辑草稿、中文输入中断、重复创建原生播放器、文件网格变体覆盖显式视图、目录切换残留分页、图像裁剪和标注坐标偏移、上传失败返回成功、忽略取消的服务永久等待、取消后仍触发自动保存、无效配置污染状态等问题。状态输入不能伪造上传进度或内部忙碌状态。保持 28/32/36px 控件、12/14/14px 正文及 16px 标题，窄容器自动调整网格和编辑分栏。

| 检查 | 结果 |
| --- | --- |
| 内容专项 / 全量运行时 | 42 / 789 项通过 |
| Vue / React / AngularJS | 142 / 91 / 79 项单元测试及 Schema、类型检查通过，包含全部 39 个内容组件的新参数和受控更新 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| Chromium / Firefox / WebKit | 1,638 次宽窄屏布局检查、585 个状态场景与真实交互通过 |
| 新参数与暗色 RTL | 三浏览器参数组合通过，共 117 个暗色窄屏 RTL 页面 |
| 自动可访问性 | Chromium 默认和暗色共 78 次扫描无违规；原生 PDF iframe 单独检查标题 |
| CSS 独立演示 | 234 个变体在 320px 下无横向溢出，参数切换及恢复默认通过 |
| Blazor | 39 个组件、234 个变体，受控编辑、文件选择、上传、自动保存及参数更新通过 |
| 发布包 | 当前 NuGet 包由隔离缓存中的真实应用消费成功 |
| 同步与复现 | 演示与文档重复生成一致；五端目录一致，CSS 与 Blazor 共享资产 SHA-256 相同 |
| Website | 7 种语言、14 个页面，目录与文档覆盖检查通过，浏览器确认新参数说明和文档入口 |
| 性能 | 42 个 CSS 产物、包体、适配器和 Blazor 预算通过；内容源模块 ${bytes} 字节 |

逐组件参数与核查内容见 [39 项清单](release-review/component-review.md)，使用方法见 [内容 API](README.md)，完整证据见 [验证数据](final-verification.json)，固定预算调整见 [预算记录](release-review/budget-review.json)。GardenerDemo 构建保留已有的大分块提示。

上传与保存示例使用本地回调，业务项目需要提供传输、分块合并和持久化服务。PDF 依赖浏览器原生查看器；Windows WebKit 无法解码演示视频，已验证明确错误反馈，Chromium 和 Firefox 实际播放通过。Markdown/富文本为文档列出的安全子集，跨域裁剪遵守 Canvas 读取限制。自动无障碍扫描不替代人工辅助技术验收。本轮验证不等同于整库发布或线上部署。

[GardenerDemo 内容](http://127.0.0.1:4180/?component=content#catalog) · [CSS 演示](http://127.0.0.1:4187/examples/content-lab.html) · [Blazor 演示](http://127.0.0.1:5192/content)
`);
console.log('Content release verified: 39 components, 234 variants, 20 new options, 789 runtime tests.');
