import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';import {authModes} from '../packages/css/src/js/auth.js';import {authNames} from './auth-examples.mjs';
const inventory=JSON.parse(fs.readFileSync('docs/auth/inventory.json')),before=JSON.parse(fs.readFileSync('docs/auth/before.json'));
for(const c of inventory.items){c.before=before.find(v=>v.name===c.name);c.finding=(c.before.type==='css'?'原来主要提供静态布局。':'原来仅提供局部交互。')+'本次补齐参数、数据、三种变体、受控状态、异步请求与完整演示。';}
await writeFile('docs/auth/inventory.json',JSON.stringify(inventory,null,2)+'\n');
await writeFile('docs/auth/README.md',`# 认证与账户安全

现有 33 个组件已覆盖认证、账户选择、组织切换、验证与安全管理。本次完善全部组件，提供 99 个变体；通行密钥注册/管理、多因素设置/恢复、设备会话撤销并入现有组件，没有新增重复名称。原有静态类和作者 DOM 继续可用。

## 五端接入

CSS 使用 data-g-auth 和 data-g-auth-options；Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 使用 authOptions、authValue、authSize、authBordered、authDisabled。Options / Value 为 JSON 字符串，false 会保留。五端共享 auth.js 和认证 CSS。数据模式下子树由运行时管理，销毁时恢复作者节点；框架子内容不要同时修改这一子树。

~~~js
const config = {
 authOptions: JSON.stringify({kind:'sign-in-composition',mode:'password',
   title:'登录工作空间',size:'medium',showRemember:true}),
 authValue: JSON.stringify({email:'demo@example.com'}), authDisabled:false
};
function writeBack(value) { config.authValue = JSON.stringify(value); }
// Vue: <GSignInComposition :config="config" @update:model-value="writeBack" />
// React: <GSignInComposition config={config} onValueChange={writeBack} />
// AngularJS: <div g-sign-in-composition gardener-config="config" gardener-on-value-change="writeBack($value)"></div>
// Blazor: <GSignInComposition Config="Config" ValueChanged="WriteBack" />
~~~

完整 CSS 已含认证扩展，按需加载 core.css + component/auth-compositions.css，行为加载 runtime。示例中的组件导出名以各端 catalog 为准。

## 参数

| 参数 | 默认 / 范围 | 作用 |
| --- | --- | --- |
| kind / mode | kind 必需 / 首个变体 | 完整清单如下。显式 JSON mode 优先；未指定时使用框架 variant；setOptions({mode}) 可切换业务状态 |
| title / description / brand / message / labels | 中文控件文案，可覆盖 | 文案以文本渲染；labels 覆盖控件标签 |
| size / bordered / direction | medium / true / ltr | small、medium、large；12/14/14px 正文、16px 标题，12/16/20px 内距，28/32/36px 控件；触摸指针环境至少 44px；RTL、窄容器与暗色 |
| disabled / readonly | false | 禁止请求和状态变更；只读输入可阅读 |
| flow | sign-in | 认证壳可配置 sign-in、register、recover、reset、profile、mfa |
| identifier | email | email 或 username；手机找回使用 phone 变体 |
| minLength / maxLength | 15 / 128 | 新密码可配置 1–256 / 1–1024，min 不超过 max；允许空格、粘贴与 Unicode |
| confirmPassword / requireTerms | true | 注册/重置确认密码、注册条款校验 |
| codeLength / codeType | 6 / numeric | 长度 4–12；numeric 或 alphanumeric；一次性验证码自动填充，全角输入规范化 |
| showRemember / showTrust | true | 登录记住账号、多因素验证信任设备 |
| items / providers / scopes | []，最多 500 项 | 唯一字符串 id；禁用项目不可选择，required 权限不可取消 |
| recoveryCodes | []，最多 100 条 | 服务端生成的恢复码，默认遮蔽；明确显示后才允许导出 |
| accountLabel / deviceLabel / avatar | 可选 | 账户与设备说明，头像 URL |
| destination / qrSrc / qrAlt | 可选 | 脱敏投递地址、宿主生成的二维码图片和替代说明 |
| expiresAt / resendDelay | 无 / 60 秒 | Unix 毫秒有效期；服务确认重发后开始倒计时，后台标签页仍按实际时间计算 |
| requestTimeout | 30000 毫秒，1–300000 | 当前请求超时后清理私有凭据并拒绝迟到结果 |
| confirmActions / allowCurrentDevice | true / false | 撤销/解绑等操作二次确认；当前会话默认禁止撤销 |
| status | idle | loading、pending、success、error、expired、scanned；服务状态由宿主提供 |
| defaultValue / authValue | 空 / 可选受控 JSON | 只存公开表单状态，不存密码、验证码、令牌 |

items 支持 id、title、description、avatar、date、status、disabled、current、connected。providers 支持 id、title、description、disabled；scopes 支持 id、title、required。公开 value 为 email、phone、username、name、domain、choice、method、remember、trust、terms、scopes、filter、step、open。额外字段会被丢弃。受控模式的 change 是提案，由宿主回写；条款/记住账号回写保留正在输入的密码，账号或业务配置变更会清理私有输入。

## 请求与凭据

~~~js
const api = Gardenerim.getInstance(root, 'auth');
root.addEventListener('gardener:action', async event => {
 const d = event.detail;
 if (event.target !== root || d.behavior !== 'auth' || !d.requestId || d.phase === 'result') return;
 const credentials = api.takeCredentials(d.requestId); // 仅可读取一次
 try {
   // 自己的后端执行密码、验证码、权限和会话校验。不要记录 credentials。
   const result = await submitToYourService(d.action, d.value, credentials);
   api.resolve(d.requestId, result); // {status:'success'|'error'|'pending',message:'...'}
 } catch {
   api.resolve(d.requestId, {status:'error',message:'验证未完成，请重试'});
 } finally {
   if (credentials) for (const key of Object.keys(credentials)) credentials[key] = '';
 }
});
~~~

实例提供 refresh、setOptions、setValue、getState、request、resolve、takeCredentials、runPasskey、exportRecoveryCodes、cancel、destroy。密码、确认密码、验证码与单个恢复码仅在原生 input.value 和运行时私有存储中短暂存在，不写 value 属性、公开 state 或事件。提交后清空输入；取消、业务变更、超时与销毁清理未读取凭据。宿主拿到凭据后的网络请求及内存生命周期由宿主管理。密码仍是浏览器内存中的字符串，不能承诺物理内存安全擦除。批量恢复码属于宿主提供的数据，不要把真实恢复码作为静态 HTML 演示内容。

beforechange 可取消，action 提供请求编号；resolve 只接受当前请求，不接收任意 token 字段。complete/error 表示服务返回的 UI 结果，不会自行创建账号或登录会话。首次设置的每个步骤等待服务确认才推进。密码规则组件只检查配置长度，不把长度等同于真实密码强度；权威校验、密码泄露名单、MFA 限流与会话安全由后端负责。

通行密钥支持真实原生桥接：收到 passkey-register 请求后调用 runPasskey(id, serverCreationOptions, 'create')；passkey-sign-in 调用 runPasskey(id, serverRequestOptions, 'get')。challenge 和 user.id 使用服务端返回并解码的字节数据，返回的 Credential 交由服务端验证后才 resolve。取消和超时使用 AbortSignal 中断原生提示。API 要求安全上下文，详见 [MDN credentials.get](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get) 与 [credentials.create](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create)。SSO、二维码轮询、邮件投递与短信均通过宿主服务接入。

## 发布复查扩展参数

| 参数 | 默认 / 范围 | 用途 |
| --- | --- | --- |
| showHeader / showBrand | true | 标题说明 / 品牌文字；表单仍有可访问名称 |
| showStatus | true | false 仅隐藏视觉状态文本，保留辅助技术播报 |
| showPasswordToggle | true | 密码可见性切换入口 |
| showPasswordRules | null | null 跟随变体；true/false 显示/隐藏规则，不关闭校验 |
| showSearch | true | 账号、组织、身份切换与设备列表搜索框 |
| showAvatars | true | 列表头像；个人资料和锁屏头像仍由其变体控制 |
| showProviderDescriptions | true | 第三方身份提供者的说明 |
| showOtherAccount | true | 账号、组织、身份切换中的其他账号入口 |
| formMaxWidth | 440，240–1200px | 表单、身份提供者与设备信任卡最大宽度，受容器约束 |
| qrSize | 200，96–400px | 二维码尺寸，不超过容器 |
| listMaxHeight | null 或 100–2000px | 原生列表最大高度，null 不限制；表格保持独立滚动 |

12 个新增参数改变展示时保留输入节点与正在等待的请求。public input / compositionend 提交公开字段，change 仅处理单选/复选；失焦不重复发出提案，Enter 等待受控值回写。密码、验证码和恢复码不进入公开状态。身份切换清空旧凭据与原目标的重发倒计时；等待期间公开授权状态改变会使旧请求失效。

异常回包（非对象、无效 status、非字符串 message）结束等待，清理未领取凭据，触发 error，resolve 返回 false；可以重新输入并重试。过期验证、邀请和链接请求不能被迟到成功结果确认。无效状态/参数拒绝更新，销毁后 API 不再修改 DOM。勾选条款错误关联到对应控件，禁用权限不可切换。

现有 33 个组件已覆盖登录、注册、验证、恢复、凭据、组织、授权与设备管理。本次深化参数和边界行为，不增加重复组件。最新逐项清单和证据见 [发布复查](verification.md)。

## 全部组件与变体

| 组件 | 中文 | 变体 |
| --- | --- | --- |
${Object.entries(authModes).map(([k,v])=>'| '+k+' | '+authNames[k]+' | '+v.join(' / ')+' |').join('\n')}

## 演示

- [GardenerDemo 认证目录](http://127.0.0.1:4180/?component=auth#catalog)：33 个组件、99 个变体，尺寸、方向、边框、验证码长度与格式、密码规则、受控状态、只读、空数据、加载失败、模拟服务成功/失败/超时。
- [CSS 完整演示](../../packages/css/examples/auth-lab.html)，Blazor 样例 /auth。
- 演示使用明确标记的本地模拟服务；不会创建真实账号、发送短信或建立认证会话。二维码实际只编码 DEMO 说明文本，恢复码也为演示数据。
- [逐项清单](inventory.json) · [五端一致性](parity.json) · [验证记录](verification.md)。
`);
for(const pkg of ['css','vue','react','angularjs','blazor']){const p='packages/'+pkg+'/README.md';let s=fs.readFileSync(p,'utf8');if(!s.includes('## 认证组件扩展'))s+='\n## 认证组件扩展\n\n33 个组件、99 个变体，统一 authOptions / authValue；密码、验证码、通行密钥、组织选择、授权及账户安全。参阅 [五端参数与逐项清单](../../docs/auth/README.md)。\n';await writeFile(p,s);}
const keys=['认证与账户安全','33 个组件提供 99 个变体，覆盖登录、注册、找回、验证码、通行密钥、组织选择、授权及设备管理。','五端共用 authOptions、authValue 与认证运行时；支持受控状态、私有凭据传递、过期与异步结果。演示使用本地模拟服务。','完整认证演示','认证五端参数与逐项检查'];
const p='website/docs.html';let s=fs.readFileSync(p,'utf8');if(!s.includes('id="auth-enhancements"'))s=s.replace('<section id="commerce-enhancements"',`<section id="auth-enhancements" class="docs-section"><h2>${keys[0]}</h2><p>${keys[1]}</p><p>${keys[2]}</p><p><a href="../packages/css/examples/auth-lab.html">${keys[3]}</a></p><p><a href="../docs/auth/README.md">${keys[4]}</a></p></section>\n<section id="commerce-enhancements"`);await writeFile(p,s);
const translations={
 en:['Authentication and account security','33 components offer 99 variants for sign-in, registration, recovery, verification codes, passkeys, organization selection, consent and device management.','All five implementations share authOptions, authValue and the authentication runtime, with controlled state, private credential transfer, expiry and asynchronous results. Examples use a local mock service.','Complete authentication examples','Authentication parameters and audit for five implementations'],
 ja:['認証とアカウントの安全性','33 コンポーネントと 99 バリアントで、ログイン、登録、復旧、確認コード、パスキー、組織選択、同意、端末管理に対応。','5 実装で authOptions、authValue と認証機能を共有。制御状態、非公開の認証情報の受け渡し、有効期限、非同期結果に対応。サンプルはローカルの模擬サービスを使用します。','認証の全サンプル','5 実装の認証パラメーターと検査'],
 ko:['인증 및 계정 보안','컴포넌트 33개와 변형 99개로 로그인, 등록, 복구, 인증 코드, 패스키, 조직 선택, 동의 및 기기 관리를 지원합니다.','다섯 구현이 authOptions, authValue와 인증 런타임을 공유하며 제어 상태, 비공개 자격 증명 전달, 만료 및 비동기 결과를 지원합니다. 예제는 로컬 모의 서비스를 사용합니다.','전체 인증 예제','다섯 구현의 인증 매개변수와 검사'],
 es:['Autenticación y seguridad de la cuenta','33 componentes ofrecen 99 variantes para acceso, registro, recuperación, códigos de verificación, claves de acceso, selección de organización, consentimiento y gestión de dispositivos.','Las cinco implementaciones comparten authOptions, authValue y las funciones de autenticación, con estado controlado, transferencia privada de credenciales, caducidad y resultados asíncronos. Los ejemplos usan un servicio simulado local.','Ejemplos completos de autenticación','Parámetros y revisión de autenticación para cinco implementaciones'],
 fr:['Authentification et sécurité du compte','33 composants proposent 99 variantes pour la connexion, inscription, récupération, codes de vérification, clés d’accès, choix d’organisation, consentement et gestion des appareils.','Les cinq implémentations partagent authOptions, authValue et les fonctions d’authentification, avec état contrôlé, transmission privée des identifiants, expiration et résultats asynchrones. Les exemples utilisent un service simulé local.','Exemples complets d’authentification','Paramètres et audit d’authentification pour cinq implémentations'],
 de:['Authentifizierung und Kontosicherheit','33 Komponenten bieten 99 Varianten für Anmeldung, Registrierung, Wiederherstellung, Bestätigungscodes, Passkeys, Organisationsauswahl, Zustimmung und Geräteverwaltung.','Alle fünf Implementierungen teilen authOptions, authValue und die Authentifizierungsfunktionen mit gesteuertem Zustand, privater Anmeldedatenübergabe, Ablauf und asynchronen Ergebnissen. Beispiele nutzen einen lokalen simulierten Dienst.','Vollständige Authentifizierungsbeispiele','Authentifizierungsparameter und Prüfung für fünf Implementierungen']};
for(const [locale,strings]of Object.entries(translations)){const p='website/assets/i18n/'+locale+'.json',d=JSON.parse(fs.readFileSync(p));keys.forEach((k,i)=>d[k]=strings[i]);await writeFile(p,JSON.stringify(d,null,2)+'\n');}
let sync=fs.readFileSync('scripts/sync-website-inventory.mjs','utf8').replace('79|80|81|82|83)','79|80|81|82|83|84)').replace("g,'84'","g,'85'").replace('51|52|53|54|55)','51|52|53|54|55|56)').replace("g,'56'","g,'57'");await writeFile('scripts/sync-website-inventory.mjs',sync);
