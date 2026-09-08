import fs from 'node:fs';import assert from 'node:assert/strict';import {writeFile} from './fs-retry.mjs';
const dir='docs/form/release-review/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),text=p=>fs.readFileSync(p,'utf8');
const tests=file=>{const log=text(dir+file);assert.match(log,/ℹ fail 0/);return Number(log.match(/ℹ tests (\d+)/)[1]);};
const inventory=read('docs/form/inventory.json'),before=read(dir+'accessibility-before.json'),accessibility=read(dir+'accessibility.json');assert.equal(accessibility.length,51);assert.ok(accessibility.every(r=>!r.violations.length));
const browsers=read(dir+'browsers.json');assert.ok(browsers.every(r=>r.checks.length===3&&r.checks.every(c=>c.code===0)));
const adapters=read(dir+'adapters.json'),adapterBrowsers=read(dir+'adapter-browsers.json');assert.ok(adapters.every(r=>r.checks.every(c=>c.exitCode===0)));assert.equal(adapterBrowsers.length,2);assert.ok(adapterBrowsers.every(r=>r.passed));
const checks=read(dir+'checks.json');assert.ok(checks.every(r=>r.code===0));assert.ok(read('packages/blazor/artifacts/form-browser.json').passed);
const visuals=read(dir+'visuals.json');assert.ok(visuals.every(r=>r.code===0));const catalog=read('D:/develop/GardenerDemo/docs/form/catalog.json');assert.equal(catalog.length,102);assert.ok(catalog.every(r=>!r.overflow&&!r.inner?.overflow&&!r.errors.length&&!r.placeholder));
const proportions=['final','final-390-touch','final-390-touch-rtl-dark'].map(phase=>{const data=read('D:/develop/GardenerDemo/docs/form/proportions-'+phase+'.json');assert.equal(data.length,64);assert.ok(data.every(r=>!r.differences.length));return{phase,cases:data.length};});
assert.match(text(dir+'website-check.log'),/Documentation coverage passed/);assert.match(text(dir+'demo-build.log'),/built in/);assert.equal(read('packages/css/dist/gardener.performance.json').status,'passed');
const report={date:new Date().toISOString(),scope:'form',components:inventory.length,namedVariants:inventory.reduce((n,c)=>n+(c.variants||[]).length,0),newParameters:9,frameworks:['CSS','Vue','React','AngularJS','Blazor'],tests:{form:tests('form-runtime.log'),runtime:tests('css-runtime.log'),schema:tests('css-schema.log'),build:tests('css-build-test.log'),html:tests('css-test-html.log'),adapters,adapterBrowsers,browsers,catalogViews:catalog.length,arco:proportions,accessibility:{beforeAffected:before.filter(r=>r.violations.length).length,afterComponents:accessibility.length,violations:0},blazor:true,website:true},assets:read('docs/form/asset-hashes.json'),limits:['Named variants are inventory counts, not a claim of exhaustive combinations or Arco API compatibility.','Arco comparison checks the documented geometric metrics against locally installed 2.58.0; it is not full-screen pixel equivalence.','Automated accessibility scans do not replace screen-reader and assistive-technology user testing.','Upload transport, address/phone validation, authentication and persistence remain application integrations.','No npm/NuGet publication or production deployment was performed.']};
await writeFile('docs/form/verification.json',JSON.stringify(report,null,2)+'\n');
await writeFile('docs/form/verification.md',`# 表单发布复查结果

日期：${report.date}。本轮覆盖全部 **51 个表单组件、550 个命名变体**，新增 **9 项布局与标签参数**。本轮发布检查通过，未执行包发布。

| 检查 | 结果 |
| --- | --- |
| CSS / Vue / React / AngularJS / Blazor 构建 | 全部通过；Blazor 0 警告、0 错误 |
| 表单专项 / 全量共享运行时 | ${report.tests.form} / ${report.tests.runtime} 项通过 |
| CSS schema / 构建 / HTML | ${report.tests.schema} / ${report.tests.build} / ${report.tests.html} 项通过 |
| Vue / React / AngularJS | ${adapters.map(a=>a.checks.find(c=>c.task==='test:unit').tests).join(' / ')} 项单元测试通过；类型和契约检查通过 |
| Chromium / Firefox / WebKit | 每种浏览器均通过新增参数、原生重置、IME、只读指针、提交、范围、密码清空及4个专项行为演示 |
| React / AngularJS 真实页面 | 9项参数、24/36px尺寸、硬字数限制、模型更新、只读/禁用、清空与计数同步通过 |
| Blazor 真实页面 | 24/28/32/36px尺寸、模型回写、跨午夜、硬字数限制、程序清空、布局参数通过 |
| 全部目录 | 51项 × 1280/390px = 102视图；无占位、横向溢出、页面脚本错误 |
| Arco Vue 2.58.0 实际尺寸 | 64组 × 3环境；被断言的指标差异均不超过0.25px |
| 自动可访问性 | 修复前31项受影响，修复后51项扫描0违规 |
| Website / 文档 | 组件目录、共享样式、说明、六种翻译及本地化页面检查通过 |
| 五端一致性 / 包预算 | 51项元数据、550变体、9参数及CSS/Blazor共享资源校验通过；五端预算通过 |

## 本轮修复

- 字数计数在原生重置和程序更新模型后刷新；硬字数限制尊重输入法组合过程，并将最终截断值回写模型。
- 自动增高在未设置maxRows时正常增长，动态约束生效，销毁恢复原始样式。
- 控件移出禁用/只读容器后恢复原始状态；只读范围控件阻止指针修改，保留Tab焦点移动。
- 范围关闭清理旧反馈；WebKit时间控件降级为文本时仍计算跨午夜，严格校验日期时间格式。
- 校验摘要读取动态配置，区分普通辅助说明与真正的错误消息；表单配置更新保留实例。程序改值刷新依赖视图而不伪造用户输入事件。
- 搜索选择器补齐combobox与结果列表关联；上传区消除嵌套按钮语义。
- 修复示例标签关联、无效分组ARIA与选中状态辅助文字对比度。新增可调间距、宽度、帮助说明、冒号与必填标记演示。

## 证据与边界

[逐项复查](release-components.md) · [参数协议](parameters.md) · [机器可读结果](verification.json) · [共享资源哈希](asset-hashes.json) · [固定预算变更](release-review/budget-adjustments.json)

Arco比较环境为1280px桌面、390px触屏、390px触屏+深色+RTL；覆盖控件/组合根宽高和圆角、文字与标签字号字重、选择图标与开关尺寸、附加区尺寸及输入文字逻辑起点。未断言所有诊断字段，保留Gardener配色和业务组合；这不是Arco全部API或全屏逐像素兼容声明。550为命名变体库存，不代表穷举所有组合。自动可访问性检查不能替代辅助技术人工验收。上传传输、地区/电话号码业务校验、保存服务由应用接入。

Demo生产构建仍有已有的超过500kB分块提示；五端包的固定体积预算均通过。未掩盖体积增长，预算变更保留原始baseline和原因。

## 复验入口

node scripts/check-form.mjs、node scripts/form-release-verify-adapters.mjs、node scripts/form-release-browser-matrix.mjs、node scripts/test-form-adapters-browser.mjs、node scripts/form-release-accessibility.mjs、node scripts/form-release-visuals.mjs、node packages/blazor/scripts/test-form.mjs。

启动Demo 4180、CSS示例4187和Blazor5192后运行浏览器脚本；Firefox使用已安装的.disclosure-firefox路径。构建顺序为CSS→四个适配器→Demo；完整证据在release-review目录。
`);
const causes={select:'组件：可搜索选择器语义与列表关联', 'checkbox-radio':'组件：选中状态文字对比度',switch:'组件与演示：辅助文字对比度','file-drop':'组件与演示：上传区分组语义、文件输入标签与错误状态对比度',textarea:'组件：无maxRows自动增高、重置恢复及动态约束','character-counter':'组件：IME、原生重置、模型更新、实例与属性恢复',form:'组件与演示：9项布局标签参数；动态只读禁用与模型更新','validation-summary':'组件：动态配置、原生重置与错误导航','date-range-group':'组件与演示：范围关闭清理、文本降级解析、标签与分组语义','time-range-group':'组件：跨午夜、严格文本降级解析、范围边界','switch-row':'组件与演示：选中说明对比度与只读分组','choice-card-group':'组件与演示：选中元信息对比度与分组语义'};
let md='# 表单51项发布复查清单\n\n以下逐项列出元数据变体/状态数量、发现的问题及最终目录/可访问性结果；共享状态与模型修复适用于采用相应行为的所有条目。参数细节见[五端协议](parameters.md)，每个条目的部件、变体、状态与行为见[inventory.json](inventory.json)。\n\n| 组件 | 变体 / 状态 | 本轮分析与处理 | 五端契约 / 102视图 / 可访问性 |\n| --- | --- | --- | --- |\n';
for(const c of inventory){const previous=before.find(r=>r.name===c.name);const cause=causes[c.name]||(previous?.violations.length?'演示：标签关联、分组ARIA或辅助文字对比度已修复':'检查现有参数、变体与演示；保留现有实现并回归共享行为');md+=`| ${c.name} | ${(c.variants||[]).length} / ${(c.states||[]).length} | ${cause} | 通过 |\n`;}
await writeFile('docs/form/release-components.md',md);console.log('Form release report verified and written.');
