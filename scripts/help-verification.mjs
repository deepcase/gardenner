import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));const engines=['chromium','firefox','webkit'];
const data={date:'2026-09-07',scope:'help',components:29,originalComponents:27,newComponents:['help-search','help-glossary'],variants:99,frameworks:['css','vue','react','angularjs','blazor'],tests:{cssRuntimeSuite:307,finalHelpRuntime:16,vueUnit:127,reactUnit:76,angularjsUnit:64,schema:48,html:31,buildAndInstall:11,blazorSsr:523,blazorHelpVariants:99,cssStandalone:29},browser:engines.map(engine=>({engine,layouts:read('docs/help/browser-'+engine+'.json').layouts,...read('docs/help/final-'+engine+'.json')})),limitations:['远程检索、反馈持久化和联系管理员由应用注入服务；默认演示不发送外部请求。','本记录针对帮助分类；不宣称全部 523 个组件已逐一达到发布标准。']};
await writeFile('docs/help/verification.json',JSON.stringify(data,null,2)+'\n');
await writeFile('docs/help/verification.md',`# 帮助分类验证记录

2026-09-07。范围为 29 个帮助组件、99 个变体，包含新增帮助搜索与术语表。

| 检查 | 结果 |
| --- | --- |
| CSS 共用运行时回归 | 307 项通过；最终帮助专属回归 16 项通过 |
| Vue / React / AngularJS 单元测试 | 127 / 76 / 64 项通过，分别遍历 29 个帮助组件的配置、布尔值、受控状态及实例保持 |
| CSS Schema / HTML / 类型 | 48 / 31 项通过，TypeScript 声明通过 |
| 构建与安装包 | 11 项通过，包括组件按需打包、产物大小、连续构建一致性及 npm 安装 |
| Blazor | 523 个 SSR 合约通过；帮助 29 个组件、99 个变体及受控 FAQ、检索、引导焦点通过 |
| Chromium / Firefox / WebKit | 每种浏览器 198 项尺寸/变体检查，另有 29 项 RTL、29 项暗色窄屏及语义状态、指南跳转检查 |
| 可访问性 | Chromium Axe：29 个默认状态、29 个暗色状态以及 5 个已打开浮层，无 WCAG 2 A/AA、2.1 AA 违规 |
| GardenerDemo | 29 个目录项、参数控制、受控 FAQ 与操作指南跳转通过 |
| CSS 独立示例 | 29 个组件初始化、FAQ 和目标引导操作通过 |
| 五端一致性 | 29 个目录合同和 99 个变体一致，Blazor 共享 CSS、运行时入口、帮助模块的 SHA-256 一致 |
| 网站与文档 | 同步目录、帮助参数、逐项分析；14 个页面、7 个语言版本 |

覆盖空结果、非法配置与目标、纯文本/安全链接、异步旧请求退出、取消后晚到结果、失败重试、受控值回写、反馈原因保留、FAQ 键盘导航、焦点返回、清单只读与禁用。

- [逐项检查与参数](README.md)
- [五端资源校验](parity.json)
- [完整机器记录](verification.json)
- [Chromium](browser-chromium.json) / [Firefox](browser-firefox.json) / [WebKit](browser-webkit.json)
- [最终暗色和状态检查](final-chromium.json)
- [Blazor 演示记录](blazor-browser.json)
- [目录参数记录](catalog-browser.json)
- [固定预算说明](budget-review.json)

默认反馈仅产生应用事件；真实检索、反馈存储和联系入口由应用提供服务。这是帮助分类的验证记录，不等同于全部 523 个组件的发布认证。
`);
