import fs from 'node:fs';import assert from 'node:assert/strict';import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),engines=['chromium','firefox','webkit'],adapters=read('docs/ai/adapters.json');
const browser=engines.map(engine=>({engine,...read('docs/ai/browser-'+engine+'.json'),final:read('docs/ai/final-'+engine+'.json'),finalInteractions:read('docs/ai/interactions-'+engine+'.json')}));for(const b of browser){assert.equal(b.layouts,238);assert.deepEqual(b.errors,[]);assert.deepEqual(b.final.errors,[]);assert.deepEqual(b.finalInteractions.errors,[]);}for(const p of adapters)assert.ok(p.checks.every(c=>c.exitCode===0));
const data={date:'2026-09-07',scope:'ai',components:38,originalComponents:36,newComponents:['ai-run-timeline','ai-structured-output'],variants:119,frameworks:['css','vue','react','angularjs','blazor'],tests:{cssRuntimeSuite:330,finalAIUnit:24,schema:48,html:32,buildAndInstall:11,blazorSsr:525,blazorAIVariants:119},adapters,browser,limitations:['生成、工具执行、语音和反馈持久化由应用注入服务；演示使用本地预录文本。','本记录验证 AI 分类及相关构建回归，不代表全部 525 个组件的完整发布认证。']};await writeFile('docs/ai/verification.json',JSON.stringify(data,null,2)+'\n');
await writeFile('docs/ai/verification.md',`# AI 分类验证记录

2026-09-07。完善原有 36 个组件，新增运行时间线和结构化输出，共 38 个组件、119 个变体。

| 检查 | 结果 |
| --- | --- |
| CSS 运行时回归 | 330 项通过；最后的 AI 专项 24 项通过，包含新增取消守卫和文件约束 |
| Vue / React / AngularJS | 128 / 77 / 65 项单元测试通过，各遍历 38 个 AI 组件的配置更新、显式 false、受控值和实例保留；类型及 Schema 通过 |
| CSS Schema / HTML / 类型 | 48 / 32 项通过，TypeScript 声明通过 |
| 构建与安装 | 11 项通过，包括按需组件打包、大小预算、连续构建一致性和 npm 安装 |
| Blazor | 525 个 SSR 合约通过；AI 38 个组件、119 个变体及受控会话、尺寸更新、工具确认、取消通过 |
| Chromium / Firefox / WebKit | 每种 238 组变体 / 尺寸检查，共 714 组；每种另有 38 组 RTL、38 组深色窄屏检查 |
| 无障碍 | Chromium Axe：38 个默认及 38 个深色状态，无 WCAG 2 A/AA、2.1 AA 违规 |
| 交互 | 三种浏览器均通过流式生成、暂停、继续、停止、失败重试、工具确认、反馈、产物键盘切换、会话切换、附件添加 / 移除及上下文用量联动 |
| GardenerDemo | 38 项目录、尺寸和受控配置、会话生成通过，生产构建完成 |
| CSS 独立演示 | 38 个组件初始化与工具拒绝操作通过 |
| 五端一致性 | 38 个合同及 119 个变体一致；Blazor 的共享 CSS、运行时入口、AI 模块 SHA-256 一致 |
| 文档与网站 | AI 参数表、逐项原因及修复、服务接入，14 个页面 / 7 个语言版本；仓库总目录 525、行为 82、事件 103、公开导出 5119 校验通过 |

专项测试覆盖真实 AsyncIterable 输出、取消后晚到结果、禁用 / 更换服务取消、受控回写、中文输入法、输入光标与按钮节点保留、输出和历史长度上限、文件类型 / 大小 / 数量限制、过期授权、JSON / Markdown 安全呈现、循环树校验、复制、只读和显式 false。

- [逐项检查和参数](README.md)
- [五端一致性](parity.json)
- [完整验证记录](verification.json)
- [适配器校验](adapters.json)
- [Blazor 演示记录](blazor-browser.json)
- [目录验证](catalog-browser.json)
- [固定预算与测量](budget-review.json)

演示的生成内容为本地预录文本；真实模型、权限执行、反馈存储与语音服务由业务应用接入。未进行真实模型服务或计费链路测试。
`);
const p='docs/ai/budget-review.json',b=read(p);b.moduleRawBytes=fs.statSync('packages/css/dist/ai.js').size;b.packageRelativeGrowthCaps={packed:86,unpacked:70,files:12};b.packageMeasured=read('packages/css/dist/gardener.performance.json').package;await writeFile(p,JSON.stringify(b,null,2)+'\n');
