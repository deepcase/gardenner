import fs from 'node:fs';const p='packages/css/src/js/auth.js';let s=fs.readFileSync(p,'utf8');s=s.replace("if(!controlled)state=value;errors={};", "if(!controlled){if(['email','phone','username','domain','choice','method','step'].some(k=>state[k]!==value[k]))clearSecrets();state=value;}errors={};");s=s.replace("box.append(button(L(visible?'hide':'show'),'toggle-password'));", "{const toggle=button(L(visible?'hide':'show'),'toggle-password');toggle.setAttribute('aria-pressed',String(visible));box.append(toggle);}");fs.writeFileSync(p,s);
const css='packages/css/src/components/auth-enhanced.css';s=fs.readFileSync(css,'utf8');s=s.replace(' @media(prefers-reduced-motion:reduce)',` [data-g-auth-density=small] :is(.g-au-button,input:not([type=checkbox]):not([type=radio])) {min-block-size:28px;padding-block:4px}
 [data-g-auth-density=large] :is(.g-au-button,input:not([type=checkbox]):not([type=radio])) {min-block-size:40px;padding-block:8px}
 .g-password-strength[data-g-auth-mode=meter] .g-au-rules p {display:none}
 .g-password-reset[data-g-auth-mode=default] .g-au-rules {display:none}
 .g-recovery-codes[data-g-auth-mode=hidden] .g-au-codes {grid-template-columns:minmax(0,1fr)}
 .g-auth-consent[data-g-auth-mode=scopes] .g-au-check {padding:12px;border:1px solid var(--g-color-border);border-radius:4px}
 .g-trusted-device[data-g-auth-mode=card] .g-au-frame {max-inline-size:440px;box-shadow:0 4px 20px #0000000a}
 .g-security-alert[data-g-auth-mode=error] .g-au-frame {border-inline-start:3px solid var(--g-color-danger,#c62828)}
 .g-security-alert[data-g-auth-mode=warning] .g-au-frame {border-inline-start:3px solid var(--g-color-warning,#b77900)}
 @media(prefers-reduced-motion:reduce)`);fs.writeFileSync(css,s);
