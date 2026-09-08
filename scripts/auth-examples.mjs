import {authModes,authClasses} from '../packages/css/src/js/auth.js';
export const authNames={'authentication-shell':'认证页面','auth-centered':'居中认证','auth-split':'分栏认证','sign-in-composition':'登录','registration-composition':'注册','password-recovery':'找回账户','password-reset':'重置密码','email-verification':'邮箱验证','phone-verification':'手机验证','mfa-challenge':'多因素验证','otp-input':'一次性验证码','passkey-composition':'通行密钥','sso-composition':'单点登录','qr-login':'扫码登录','magic-link':'免密链接','invitation-composition':'邀请加入','first-time-setup':'首次设置','lock-screen':'锁屏解锁','session-expired':'会话过期','account-chooser':'选择账号','tenant-chooser':'选择组织','identity-switcher':'切换身份','profile-setup':'个人资料','account-security':'账户安全','device-management':'设备与会话','login-activity':'登录活动','security-alert':'安全提醒','recovery-codes':'恢复码','trusted-device':'信任设备','connected-accounts':'关联账户','password-strength':'密码规则检查','auth-consent':'授权确认','auth-result':'认证结果'};
export function authFixture(kind,mode=authModes[kind][0]){
 const o={kind,mode,title:authNames[kind],brand:'Gardenerim',description:'本地模拟认证服务；不会创建真实账号或发送短信。',defaultValue:{email:'demo@example.com',phone:'+86 13800000000',name:'示例用户',username:'demo',domain:'example.test'},resendDelay:5,minLength:15,maxLength:128,items:[],providers:[],scopes:[]};
 const people=[{id:'personal',title:'林同学',description:'个人账号 · demo@example.com'},{id:'work',title:'产品设计团队',description:'工作组织 · design.example.test'},{id:'disabled',title:'历史组织',description:'当前不可用',disabled:true}];
 const providers=[{id:'github',title:'GitHub',description:'开发者账户（模拟）'},{id:'enterprise',title:'企业 SSO',description:'组织身份提供方（模拟）'}];
 if(['sign-in-composition','sso-composition'].includes(kind))o.providers=providers;
 if(['account-chooser','tenant-chooser','identity-switcher'].includes(kind))o.items=people;
 if(['phone-verification','email-verification','mfa-challenge'].includes(kind))o.destination=kind==='phone-verification'?'+86 138 **** 0000':'demo@example.com';
 if(kind==='qr-login'||kind==='mfa-challenge'&&mode==='setup'){o.qrSrc='auth-assets/demo-qr.svg';o.qrAlt='仅编码演示文字的二维码，不能用于真实认证';o.description='演示二维码仅包含示例说明；扫码状态由模拟服务返回。';}
 if(kind==='invitation-composition')o.items=[{id:'invite',title:'加入产品设计团队',description:'邀请人：示例管理员 · 角色：成员'}];
 if(kind==='account-security')o.items=[{id:'password',title:'登录密码',description:'定期检查账户安全设置',status:'已设置'},{id:'mfa',title:'多因素认证',description:'为账户添加第二种验证方式',status:'未开启'},{id:'passkey',title:'通行密钥',description:'设备上的身份凭证',status:'已创建 1 个'}];
 if(kind==='device-management'||kind==='passkey-composition'&&mode==='manage')o.items=[{id:'current',title:'Windows · 当前浏览器',description:'示例设备 · 当前会话',date:'2026-09-07 10:20',current:true},{id:'mobile',title:'移动设备',description:'示例设备 · 最近使用',date:'2026-09-06 18:30'}];
 if(kind==='connected-accounts')o.items=[{id:'github',title:'GitHub',description:'demo-user',connected:true},{id:'enterprise',title:'企业账号',description:'尚未关联',connected:false}];
 if(kind==='login-activity')o.items=[{id:'today',title:'浏览器登录',description:'示例位置 · 当前设备',date:'2026-09-07 10:20',status:'成功'},{id:'yesterday',title:'移动设备登录',description:'示例位置 · 新设备',date:'2026-09-06 18:30',status:'已验证'}];
 if(kind==='recovery-codes')o.recoveryCodes=['DEMO-12AB-34CD','DEMO-56EF-78GH','DEMO-90JK-12LM','DEMO-34NP-56QR'];
 if(kind==='auth-consent')o.scopes=[{id:'profile',title:'读取基本资料',required:true},{id:'email',title:'读取邮箱地址'},{id:'workspace',title:'访问所选工作空间'}];
 if(kind==='security-alert')o.message='检测到新的登录设备。请核对活动记录，必要时更新验证方式。';
 if(kind==='session-expired')o.description='继续操作前重新验证身份；输入内容的保留由宿主应用管理。';
 if(kind==='password-strength')o.description='检查可配置的长度规则；允许粘贴、空格和 Unicode，不将规则检查结果等同于密码强度评估。';
 const json=JSON.stringify(o).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');return {options:o,html:'<div class="auth-demo-host"><div class="'+(authClasses[kind]||'g-'+kind)+'" data-demo-component data-g-auth data-g-auth-options="'+json+'"></div><output class="auth-demo-result"></output></div>'};
}
export const authVariants=Object.fromEntries(Object.entries(authModes).map(([kind,modes])=>[kind,Object.fromEntries(modes.map(mode=>[mode,authFixture(kind,mode)]))]));
export const authExamples=Object.fromEntries(Object.keys(authModes).map(kind=>[kind,authFixture(kind).html]));
export const authDemoCss='.auth-demo-host{padding:16px;min-width:0;max-width:100%;font:14px/1.6 var(--g-font-sans,system-ui)}.auth-demo-result{display:block;margin-top:12px;font-size:12px;overflow-wrap:anywhere}';
export const authDemoService=`export function installAuthDemo(root,getInstance,service='success'){
 const api=getInstance(root,'auth');if(!api||root.dataset.authDemoInstalled)return;root.dataset.authDemoInstalled='true';root.__authApi=api;
 const options=JSON.parse(root.getAttribute('data-g-auth-options')||'{}');
 for(const input of root.querySelectorAll('[data-au-field]')){const key=input.dataset.auField;if(['password','confirmPassword'].includes(key))input.value='Demo passphrase 2026!';else if(key==='code')input.value=((options.codeType|| (options.mode==='alphanumeric'?'alphanumeric':'numeric'))==='alphanumeric'?'AB12CD34EF56':'123456789012').slice(0,options.codeLength||6);else if(key==='recoveryCode')input.value='DEMO-12AB-34CD';else continue;input.dispatchEvent(new Event('input',{bubbles:true}));}
 root.addEventListener('gardener:action',e=>{const d=e.detail;if(e.target!==root||d.behavior!=='auth'||d.phase==='result'||!d.requestId)return;const credential=api.takeCredentials(d.requestId);const valid=service!=='error'&&(!credential?.password||credential.password==='Demo passphrase 2026!')&&(!credential?.code||credential.code===((options.codeType||(options.mode==='alphanumeric'?'alphanumeric':'numeric'))==='alphanumeric'?'AB12CD34EF56':'123456789012').slice(0,options.codeLength||6));if(credential)for(const key of Object.keys(credential))credential[key]='';
 if(service==='timeout')return;setTimeout(()=>{if(!root.isConnected)return;const accepted=api.resolve(d.requestId,{status:valid?'success':'error',message:valid?'本地模拟服务已确认（未建立真实认证会话）':'本地模拟验证失败，请重试'});if(!accepted||!valid)return;
 if(['revoke','unlink'].includes(d.action)){const items=options.items.filter(i=>i.id!==d.key);options.items=items;api.setOptions({items});}
 if(d.action==='link'){options.items=options.items.map(i=>i.id===d.key?{...i,connected:true}:i);api.setOptions({items:options.items});}
 if(d.action==='refresh'&&['qr-login','invitation-composition'].includes(options.kind))api.setOptions({mode:options.kind==='qr-login'?'waiting':'default',status:'idle',expiresAt:Date.now()+30000});
 },250);});
}`;
