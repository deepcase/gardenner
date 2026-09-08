# 认证验证记录

范围：33 个组件、99 个变体；CSS / Vue / React / AngularJS / Blazor。

| 检查 | 结果 |
| --- | --- |
| 五端构建、GardenerDemo 构建 | 通过；Blazor 0 警告、0 错误 |
| 根目录 npm run check | 通过；含包、网站、导出与各已扩展分类一致性检查 |
| CSS 全部运行时 | 380 项通过；最终身份切换清理补丁另有 16 项认证专项回归通过 |
| CSS Schema / 类型 / HTML / 构建 | 48 / 类型检查 / 35 / 11 项通过 |
| Vue / React / AngularJS 单元 | 131 / 80 / 68 项通过，含每个认证组件的受控更新和实例保留 |
| 三适配器 Schema / 类型 | 每端 3 项 Schema 及类型检查通过 |
| Chromium / Firefox / WebKit | 每引擎 198 次宽窄屏变体检查，共 594 次；各 33 次 RTL 与关键交互通过 |
| 无障碍 | Chromium 33 项浅色和 33 项暗色 RTL，WCAG 2 A/AA 与 2.1 AA 自动扫描无违规 |
| 原生 WebAuthn | Chromium 虚拟认证器创建与读取真实浏览器 Credential 成功；等待宿主确认，不泄露到事件 |
| Blazor SSR / 契约 | 527 个组件渲染、85 个行为、103 个事件及框架契约通过 |
| Blazor 认证浏览器 | 33 个组件、99 个变体，注册私有输入保留、受控账号选择、撤销确认通过 |
| CSS 独立示例 | 33 组件挂载；桌面/触屏发布检查 2 项通过 |
| 性能预算 / 包装 / 可复现性 | 五端固定预算通过；CSS 构建回归包含 npm 包安装和连续构建字节一致性 |

[清单](inventory.json) · [一致性](parity.json) · [检查结果](checks.json) · [三端测试](adapters.json) · [Chromium](browser-chromium.json) · [Firefox](browser-firefox.json) · [WebKit](browser-webkit.json) · [原生凭据与无障碍](final-browser.json) · [Blazor](blazor-browser.json) · [预算依据](budget-review.json)。

演示使用本地模拟服务；真实账号、短信邮件、SSO、二维码会话、MFA 密钥签发和服务器会话不在 UI 库中伪造。原生通行密钥测试使用虚拟认证器，尚未覆盖所有实体安全密钥及操作系统设备组合。自动无障碍扫描不替代人工辅助技术验收。Demo 仍有既有全量目录 bundle 大于 500 kB 的提示，构建成功；按需组件与共享运行时预算已单独检查。
