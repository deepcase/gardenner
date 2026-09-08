# 认证组件发布复查

组件层检查通过：33 个组件、99 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 与文档已同步。现有组件覆盖登录、注册、恢复、验证、凭据、授权、组织和设备管理，本次深化参数和边界行为，不新增重复条目。

新增 12 个参数：showHeader、showBrand、showStatus、showPasswordToggle、showPasswordRules、showSearch、showAvatars、showProviderDescriptions、showOtherAccount、formMaxWidth、qrSize、listMaxHeight。目录页可直接切换并查看真实变化；CSS 和 Blazor 独立演示提供全部变体。

修复普通字段依赖失焦更新、受控 Enter 提交旧值、中文合成输入处理不完整、重复无变化提案、异常回包残留等待与未领取凭据、过期成功回包仍确认、授权状态改变仍接收旧结果、身份切换保留旧重发倒计时、显式模式被旧类覆盖、未知操作进入宿主、错误状态允许业务请求、条款错误缺少控件关联、禁用权限可切换、销毁后配置更新仍返回成功等问题。隐藏密码切换按钮会恢复密码掩码，显示参数更新保留请求与输入节点；图片 URL 拒绝嵌入账号密码。

统一标题 16px、正文 12/14/14px、内距 12/16/20px、控件 28/32/36px；触摸指针环境至少 44px。表单、二维码、列表可独立控制尺寸；窄容器重排，列表可限制高度并内部滚动。隐藏密码规则不关闭校验，隐藏状态文本保留辅助技术播报。

| 验证 | 结果 |
| --- | --- |
| 认证专项 / 全量运行时 | 30 / 708 项通过 |
| Vue / React / AngularJS | 140 / 89 / 77 项单元测试通过，Schema 与类型通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过，含可复现构建与安装入口 |
| 三浏览器布局 | 594 个常规布局、297 个 320px 窄容器变体通过 |
| 三浏览器状态 | 396 个空/加载/失败/只读场景通过 |
| 新参数与交互回归 | 39 组扩展检查通过；登录注册、OTP、失败/超时、撤销、选择、二维码、恢复码下载、首次设置通过 |
| 无障碍 | Chromium 66 次 WCAG A/AA 扫描无违规，含暗色 RTL |
| WebAuthn | 虚拟认证器原生创建/读取通过，等待宿主确认，凭据未进入公开事件 |
| CSS / Blazor | 各 99 个变体；Blazor 注册私有输入/实例保留、受控选择、撤销确认通过 |
| 五端一致性 | 目录、样式、运行时和资源哈希一致，559 个 Blazor SSR 合约通过 |
| Website | 七语言、十四页面、每个翻译语言 3317 条文案通过 |
| 性能 | 42 个 CSS 产物、整体包体、适配器、Blazor 及 45 kB 认证源码限制通过，未提高预算 |

接口收紧：已取消、过期或状态切换后的旧请求不能被确认；异常结果结束等待并触发 error，resolve 返回 false；public input / compositionend 提交字段，失焦不重复触发。密码、确认密码、验证码、单个恢复码和 WebAuthn 结果不进入公开 value/事件；宿主通过一次性 takeCredentials 或 runPasskey 获取凭据，验证后再确认。

演示只使用本地模拟服务，不创建真实账户、会话或发送短信邮件。WebAuthn 测试使用 Chromium 虚拟认证器，实体安全密钥、操作系统、真实身份提供者和后端验证仍需目标项目验收。自动无障碍扫描不替代人工辅助技术测试。

- [完整演示](http://127.0.0.1:4180/?component=auth#catalog)
- [逐组件检查清单](release-review/inventory.json)
- [全部参数与服务协议](README.md)
- [机器可读验证](final-verification.json)
- [窄屏登录截图](release-review/sign-in-narrow.png)
- [验证码截图](release-review/otp-visual.png)

复现：scripts/build-auth-examples.mjs、auth-release-build.mjs、auth-release-verify-adapters.mjs、auth-release-checks.mjs、auth-release-browser-matrix.mjs、auth-release-extension-matrix.mjs、test-auth-release-final.mjs、test-auth-release-static.mjs、test-auth-release-smoke.mjs、auth-release-report.mjs，以及 packages/blazor/scripts/test-auth-release.mjs。历史报告与原始日志保存在 release-review。
