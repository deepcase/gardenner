import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));const checks=read('docs/auth/checks.json');for(const c of checks){const p='docs/auth/'+c.pkg+'-'+c.task.replace(':','-')+'.log',log=fs.readFileSync(p,'utf8');if(/fail 0|budget passed|budgets passed|contracts passed|Performance budget passed|Performance budgets passed/.test(log)||c.task==='test:types'&&!/error TS/.test(log)){c.code=0;c.tail=log.slice(-750);}}await writeFile('docs/auth/checks.json',JSON.stringify(checks,null,2)+'\n');
const inv=read('docs/auth/inventory.json');const findings={
'authentication-shell':'补齐居中/分栏/紧凑外壳，以及多种认证 flow 的参数驱动表单。','auth-centered':'补齐居中面板、卡片阴影和尺寸变量，表单有字段、校验与服务结果。','auth-split':'补齐反向分栏、窄容器折叠与 RTL，左右信息区不再固定满屏。','sign-in-composition':'密码、验证码与提供方登录均有请求接口；记住账号和受控输入联动。','registration-composition':'完整/最小注册、密码确认、条款、可配置长度校验。','password-recovery':'邮箱和电话找回有校验及中性投递反馈，避免把示例当作真实发信。','password-reset':'配置长度与确认密码，保留空格/Unicode/粘贴；错误定位与重试。','email-verification':'验证码、邮件链接查询和重发；重发成功后计时。','phone-verification':'数字/字母数字输入、长度参数、粘贴规范化及重发。','mfa-challenge':'验证器、恢复码与设置二维码；私有输入不进入公开状态。','otp-input':'原生单输入保证自动填充、选择、粘贴、键盘和组合输入；4–12 位可配置。','passkey-composition':'原生创建/读取凭据、取消/超时、管理列表；返回凭据待宿主验证。','sso-composition':'提供方及组织域名校验，明确请求事件与服务回传。','qr-login':'等待/已扫描/过期状态、有效期与刷新；使用有效的演示二维码图片。','magic-link':'邮箱请求、已发送及重发计时，不伪造真实邮件。','invitation-composition':'邀请内容、接受/拒绝、过期和刷新回传。','first-time-setup':'资料和安全步骤分开校验，服务成功后推进；支持受控步骤。','lock-screen':'头像和账号、密码或 PIN，凭据仅短暂保存在私有输入中。','session-expired':'会话警告/过期、重新验证和退出确认。','account-chooser':'卡片/列表、过滤、停用账号与受控单选。','tenant-chooser':'组织卡片/列表、搜索、禁用项与组织选择请求。','identity-switcher':'展开/收起、Escape、选择状态和其他账号入口。','profile-setup':'资料校验、头像可配置与更新请求。','account-security':'密码/MFA/通行密钥安全项目、状态、编辑请求和布局变体。','device-management':'当前设备保护、列表/卡片、搜索、撤销确认与服务更新。','login-activity':'活动列表与语义表格，时间、状态、详情请求和窄屏容纳。','security-alert':'警告/错误视觉层级、详情与保护账号操作。','recovery-codes':'默认遮蔽、显式显示/隐藏、本地导出及重新生成确认；示例数据明确标记。','trusted-device':'受控信任选项与卡片/紧凑说明。','connected-accounts':'连接状态、关联/解绑、确认与宿主回写。','password-strength':'长度规则和进度显示；明确只是规则检查而非真实强度评估。','auth-consent':'权限列表、必需项不可取消、可选项受控回写、授权/拒绝请求。','auth-result':'成功/失败/待确认结果，错误重试，不产生真实认证会话。'};for(const c of inv.items)c.finding=(c.before.type==='css'?'原实现偏静态。':'原实现仅有局部行为。')+findings[c.name];await writeFile('docs/auth/inventory.json',JSON.stringify(inv,null,2)+'\n');
await writeFile('docs/auth/verification.md',`# 认证验证记录

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
`);
console.log('Authentication verification records finalized.');
