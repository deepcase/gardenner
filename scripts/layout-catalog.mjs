import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
import {layoutModes} from '../packages/css/src/js/layout.js';
const path='packages/css/metadata/components.json',catalog=JSON.parse(fs.readFileSync(path,'utf8'));
if(!catalog.components.some(c=>c.name==='responsive-container'))catalog.components.push({name:'responsive-container',category:'layout',type:'interactive',selector:'.g-responsive-container',parts:[],platforms:['web','mobile','desktop','print']});
for(const c of catalog.components.filter(c=>c.category==='layout')){c.cssSelector=c.selector;if(c.name==='responsive-container')c.parts=['g-responsive-container-content'];c.behaviors=[...new Set([...(c.behaviors||[]),'layout'])];c.variants=layoutModes[c.name];c.states=['disabled'];c.status='runtime-ready';c.type='interactive';c.features=[...new Set([...(c.features||[]),'slot-preservation','container-responsive','logical-directions','controlled-collapse','parameter-update','explicit-option-precedence','logical-padding','narrow-column-count','grid-alignment','bounded-scroll','configurable-collapse-policy'])];}
await writeFile(path,JSON.stringify(catalog,null,2)+'\n');
fs.mkdirSync('docs/layout',{recursive:true});
await writeFile('docs/layout/inventory.json',JSON.stringify({originalComponents:10,newComponents:1,components:11,variants:Object.values(layoutModes).reduce((n,a)=>n+a.length,0),items:catalog.components.filter(c=>c.category==='layout').map(c=>({name:c.name,selector:c.selector,variants:c.variants,finding:c.name==='responsive-container'?'新增独立内容容器：流式、阅读宽度、宽屏、窄屏及满高。':['grid-system','region-layout-system','classic-layout-primitives'].includes(c.name)?'原有多模式 CSS 已存在，补齐统一参数、每种模式的真实演示、容器响应式和五端接入。':'原有静态样式，补齐紧凑比例、可配置尺寸、受控侧栏和容器内演示。'}))},null,2)+'\n');
// Each variant is an author-facing hook. The shared controller resolves it to
// data-g-layout-mode; the original CSS-only primitive classes remain available.
await writeFile('packages/css/src/layouts/variants.css','@layer gardener.components {\n'+catalog.components.filter(c=>c.category==='layout').flatMap(c=>c.variants.map(v=>`${c.selector}-${v}{--g-layout-variant:${v}}`)).join('\n')+'\n}\n');
