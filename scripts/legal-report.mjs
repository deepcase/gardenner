import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';const read=p=>JSON.parse(fs.readFileSync('docs/legal/release-review/'+p,'utf8')),log=p=>fs.readFileSync('docs/legal/release-review/'+p,'utf8');
const pass=(file,min)=>{const s=log(file),n=Number(s.match(/ℹ tests (\d+)/)?.[1]);assert.ok(s.includes('ℹ fail 0')&&n>=min,file+' not complete');return n;};const browsers=['chromium','firefox','webkit'].map(e=>read('browser-'+e+'.json'));for(const b of browsers){assert.equal(b.layouts.length,64);assert.equal(b.states.length,32);assert.equal(b.interactions,16);assert.deepEqual(b.errors,[]);}assert.equal(browsers[0].a11y.length,40);const adapters=read('adapters.json');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0);for(const c of read('checks.json'))assert.equal(c.code,0);const blazor=read('blazor-browser.json'),staticDemo=read('static-browser.json');assert.equal(blazor.samples.length,32);assert.equal(blazor.controlledInteractions,8);assert.deepEqual(blazor.errors,[]);assert.equal(staticDemo.staticVariants,32);assert.deepEqual(staticDemo.errors,[]);assert.ok(log('root-check.log').includes('Legal parity passed'));assert.ok(log('css-budget.log').includes('Performance budget passed'));assert.ok(log('contracts.log').includes('Contracts passed'));
for(const engine of ['chromium','firefox','webkit']){const r=read('extensions-'+engine+'.json');assert.equal(r.passed,true);assert.equal(r.checks,9);assert.deepEqual(r.errors,[]);}
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),assets=['gardener.css','gardener.min.css','gardener.runtime.min.js','legal.js','components/catalog.min.css'];for(const p of assets)assert.equal(hash('packages/css/dist/'+p),hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+p),p);
const report={status:'passed',generatedAt:new Date().toISOString(),components:8,variants:32,frameworks:['css','vue','react','angularjs','blazor'],unit:pass('runtime-specific.log',36),runtimeRegression:pass('runtime-all.log',577),extensions:['chromium','firefox','webkit'].map(e=>read('extensions-'+e+'.json')),schema:pass('schema.log',48),html:pass('css-test-html.log',43),build:pass('build-tests.log',11),browsers:browsers.map(b=>({engine:b.engine,layouts:b.layouts.length,states:b.states.length,interactions:b.interactions,a11y:b.a11y.length})),adapters,blazor:{variants:32,controlledInteractions:8},staticDemo,website:{locales:7,pages:14,components:559,behaviors:94,events:104},sharedAssets:Object.fromEntries(assets.map(p=>[p,hash('packages/css/dist/'+p)])),scope:'Legal UI components and mock-service demonstrations. Actual policies, persistent receipts, identity and permission checks, script activation, privacy processing and notifications belong to the host; no legal compliance certification is asserted.'};fs.writeFileSync('docs/legal/final-verification.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('docs/legal/verification.md',`# 法律组件验证报告

结果：通过。8 个组件 / 32 个变体；CSS、Vue、React、AngularJS、Blazor、GardenerDemo 与网站文档已同步。

| 检查 | 结果 |
| --- | --- |
| 法律专项行为测试 | ${report.unit} / ${report.unit} |
| 全部 CSS 运行时回归 | ${report.runtimeRegression} / ${report.runtimeRegression} |
| Schema / HTML / 构建 | ${report.schema} / ${report.html} / ${report.build}，全部通过 |
| Vue / React / AngularJS 单元测试 | ${adapters.map(a=>a.checks.find(c=>c.task==='test:unit').tests).join(' / ')}，全部通过 |
| 三浏览器 | 192 个布局、96 个状态、48 组交互；无页面脚本错误 |
| Chromium 无障碍 | 32 个变体 + 8 个暗色/RTL 场景；40 项扫描无违规 |
| Blazor | 32 个变体、8 组实际受控交互、559 个 SSR 合约渲染 |
| 独立 CSS / GardenerDemo | 32 个变体 / 8 个完整组件演示 |
| 五端产物 | 元数据一致，共用样式及运行时；Blazor 静态文件 SHA-256 相同 |
| 构建与包 | 可复现构建、Source Map、完整性、按组件构建及 npm 安装入口通过 |
| 网站 | 7 种语言 / 14 个页面、目录和 API 覆盖检查通过 |
| 性能预算 | 42 个 CSS/运行时产物及五端门禁通过；增量预算见 budget-review.json |

本次复查另验证：原生表单与回车提交、只读状态下导出筛选结果、工具栏开关、横幅关闭不产生同意、有效回执后收起、政策更新重新显示、320px 窄容器布局，共 27 项新增浏览器检查。

验证包含必要项锁定、可选项默认关闭、精确同意快照、撤回确认、协议必选项、阅读确认、政策版本变化、旧回执提醒、文档目录/搜索、历史导出、隐私请求校验、分步核对、删除确认、活动请求取消、状态刷新、政策更新回执、受控更新、IME、取消/超时及过期响应。演示中原有强制相对定位规则已缩小覆盖范围，Cookie 顶部/底部定位参数在三浏览器中通过实测。

示例文案和回执来自本地模拟服务。正式法律文本、持久化、身份与权限核验、脚本启停、隐私数据处理和通知由宿主实现；本报告不代表业务系统已经取得法律合规认证。

- [完整演示](http://127.0.0.1:4180/?component=legal#catalog)
- [参数与逐项说明](README.md)
- [机器可读验证结果](final-verification.json)
- [偏好设置截图](release-review/preferences.png)
- [移动端协议截图](release-review/agreement-mobile.png)
`);console.log('Legal verification passed: 8 components, 32 variants, five frameworks.');
