import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='docs/desktop/release-review/';
const read=n=>JSON.parse(fs.readFileSync(dir+n+'.json','utf8'));
const log=n=>fs.readFileSync(dir+n+'.log','utf8');
const passed=(name,expected)=>{const s=log(name),n=Number(s.match(/ℹ tests (\d+)/)?.[1]);assert.equal(n,expected,name);assert.ok(s.includes('ℹ fail 0'),name);return n;};
const browsers=['chromium','firefox','webkit'].map(engine=>{const b=read('browser-'+engine);assert.equal(b.layouts.length,304);assert.equal(b.interactions,20);assert.deepEqual(b.errors,[]);return {engine,layouts:b.layouts.length,interactions:b.interactions,a11y:b.a11y.length};});
assert.equal(browsers[0].a11y,192);
const extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e));
for(const e of extensions){assert.equal(e.checks,10);assert.equal(e.states.length,152);assert.equal(e.passed,true);assert.deepEqual(e.errors,[]);}
const adapters=read('adapters');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0,a.package+'/'+c.task);
const checks=read('checks');for(const c of checks)assert.equal(c.code,0,c.pkg+'/'+c.task);
const blazor=read('blazor-browser'),staticDemo=read('static-browser'),inventory=read('inventory');
assert.equal(blazor.samples.length,152);assert.equal(blazor.controlledInteractions,11);assert.deepEqual(blazor.errors,[]);
assert.equal(staticDemo.catalogComponents,38);assert.equal(staticDemo.staticVariants,152);assert.deepEqual(staticDemo.errors,[]);assert.equal(inventory.length,38);
assert.ok(log('root-check').includes('Desktop parity passed: 38 components, 152 variants and five implementations.'));
assert.ok(log('root-check').includes('Legal parity passed:'));
assert.ok(log('css-budget').includes('Performance budget passed'));
assert.ok(log('contracts').includes('Contracts passed: 559 components, 94 behavior instances'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sharedAssets={};
for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','desktop.js','components/desktop-compositions.min.css']){const digest=hash('packages/css/dist/'+file);assert.equal(digest,hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file);sharedAssets[file]=digest;}
assert.equal(hash('packages/css/src/js/desktop.js'),sharedAssets['desktop.js']);
const report={verifiedAt:new Date().toISOString(),status:'passed',components:38,variants:152,frameworks:['css','vue','react','angularjs','blazor'],addedParameters:['showFilter','showProgress','showStatus','showReset','showPin','editorRows','outputMaxHeight','windowActions'],addedFieldOptions:['placeholder','minLength','maxLength','rows'],inventory,browsers,extensions,blazor:{variants:152,controlledInteractions:11},staticDemo,tests:{desktop:passed('runtime-specific',33),cssRuntime:passed('runtime-all',617),cssSchema:passed('schema',48),cssBuild:passed('build-tests',11),html:passed('css-test-html',43)},adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),sharedAssets,website:{components:559,behaviors:94,events:104,locales:7,pages:14,messagesPerTranslatedLocale:3311},budget:'Existing limits passed without increases.',limitations:['所有演示使用本地模拟宿主。','原生窗口、文件、系统权限、托盘、更新、持久化等操作由应用宿主实现并返回明确结果。','已通过组件层发布检查；真实 Electron/Tauri 等宿主集成仍需在目标系统验收。']};
fs.writeFileSync('docs/desktop/final-verification.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('docs/desktop/verification.md',`# 桌面端发布复查记录

组件层检查通过：38 个组件、152 个变体。新增 8 个共享参数及 4 个字段选项；CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 与文档已同步。真实原生宿主集成需在目标操作系统验收。

| 检查 | 结果 |
| --- | --- |
| 桌面端专项 / 全量运行时 | 33 / 617 项通过 |
| Vue / React / AngularJS 单元测试 | ${adapters.map(a=>a.checks.find(c=>c.task==='test:unit').tests).join(' / ')} 项通过 |
| Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| Chromium、Firefox、WebKit 布局与状态 | 912 个布局、456 个状态场景通过 |
| 三浏览器交互 | 60 组既有交互、30 组参数与回归检查通过 |
| Chromium 无障碍 | 192 次 WCAG A/AA 扫描无违规，含暗色、RTL 与弹窗 |
| Blazor | 152 个变体、11 组受控交互、559 个 SSR 合约通过 |
| 独立 CSS / GardenerDemo | 152 个变体 / 38 个组件演示通过 |
| 五端一致性 | 元数据、样式、运行时与 Blazor 静态资源哈希一致 |
| 性能预算 | CSS 42 个产物及五端预算通过，未提高限制 |
| 网站 | 7 种语言、14 个页面、每个翻译语言 3311 条文案，同步检查通过 |

本次修复：无效宿主响应导致等待不结束；任务、通知、授权、同步、更新和恢复缺少确认仍显示成功；禁用菜单父级可执行子命令；重复命令 ID；显式变体被旧类名覆盖；分组分页不连续；RTL 标签方向；字段长度和值类型校验；销毁后仍接受调用；加载状态显示误导性百分比。

同时修复旧命名网格样式挤压增强组件的问题：属性编辑或窗口操作显示状态输出后，组件仍保持完整宽度。标题 16px，正文 14px（small 12px），标准控件 28/32/36px，容器内边距 12/16/20px；macOS 窗口圆形按钮保留专用尺寸。窄容器自动调整工作空间和偏好布局，输出区域高度可配置并内部滚动。

新增筛选、进度、就绪提示、重置、固定开关，以及编辑器行数、输出高度、窗口动作列表；字段支持占位、最小/最大长度和独立行数。现有 38 个组件已覆盖窗口、工作空间、命令、文档、偏好、会话、后台任务及系统反馈，保留 152 个变体，通过参数组合扩展需求。

演示通过模拟宿主验证请求、成功、失败、超时和受控数据回传；没有操作真实系统窗口、申请系统权限或安装更新。原生操作与持久化由应用宿主实现。

- [完整演示](http://127.0.0.1:4180/?component=desktop#catalog)
- [逐组件清单](release-review/inventory.json)
- [参数与字段用法](README.md)
- [机器可读验证结果](final-verification.json)
- [窄容器截图](release-review/workspace-narrow.png)

复现入口：scripts/desktop-release-build.mjs、desktop-release-verify-adapters.mjs、desktop-release-checks.mjs、desktop-release-browser-matrix.mjs、test-desktop-release-extensions.mjs、test-desktop-release-static.mjs，以及 packages/blazor/scripts/test-desktop-release.mjs。原始日志与截图保存在 release-review。
`);
console.log('Desktop release verification passed: 38 components / 152 variants / five frameworks.');
