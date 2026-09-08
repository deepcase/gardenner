import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>writeFile(p,JSON.stringify(v,null,2)+'\n');
const caps={
 'gardener.min.css':{raw:1690000,gzip:233000,brotli:127000},
 'gardener.components.min.css':{raw:1065000,gzip:145000,brotli:105000},
 'gardener.runtime.min.js':{raw:246000,gzip:70500,brotli:60000},
 'platforms/gardener.web.min.css':{raw:1630000,gzip:225000,brotli:122000},
 'platforms/gardener.mobile.min.css':{raw:1650000,gzip:228000,brotli:124000},
 'platforms/gardener.desktop.min.css':{raw:1670000,gzip:230000,brotli:126000},
 'components/content-compositions.min.css':{raw:58000,gzip:8800,brotli:7800}
};
const growth={
 'gardener.min.css':{raw:68,gzip:68,brotli:109},
 'gardener.components.min.css':{raw:175,gzip:177,brotli:174},
 'gardener.runtime.min.js':{raw:133,gzip:142,brotli:140},
 'platforms/gardener.web.min.css':{raw:70,gzip:69,brotli:116},
 'platforms/gardener.mobile.min.css':{raw:69,gzip:68,brotli:114},
 'platforms/gardener.desktop.min.css':{raw:70,gzip:69,brotli:113},
 'components/content-compositions.min.css':{raw:139,gzip:113,brotli:113}
};
const p='packages/css/config/performance-budgets.json',css=read(p);for(const [name,limits]of Object.entries(caps))Object.assign(css.artifacts[name],limits);for(const [name,limits]of Object.entries(growth))Object.assign(css.baseline.maxGrowthPercent.artifactOverrides[name],limits);Object.assign(css.package,{packed:3500000,unpacked:25300000,files:101});Object.assign(css.baseline.maxGrowthPercent.package,{packed:83,unpacked:67});await write(p,css);
const r='packages/react/config/performance-budgets.json',react=read(r);Object.assign(react.bundle,{raw:486000,gzip:75000,brotli:39000});await write(r,react);
const a='packages/angularjs/config/performance-budgets.json',angular=read(a);Object.assign(angular.limits,{raw:565000,gzip:85000,brotli:42000});await write(a,angular);
const b='packages/blazor/config/performance-budgets.json',blazor=read(b);blazor.staticAssets.bytes=14300000;Object.assign(blazor.entrypoints.css,{bytes:1690000,gzipBytes:233000});Object.assign(blazor.entrypoints.runtime,{bytes:246000,gzipBytes:70500});await write(b,blazor);
await write('docs/content/budget-review.json',{reason:'39 content compositions, 234 variants and a shared content module. Before review: CSS 1672319 raw / 230177 gzip / 124855 brotli; content pack 54625 / 7934 / 6949; runtime entry 243345 / 68939 / 57951. Fixed caps add bounded room for accessibility and browser fixes. The original 2.0 baseline and unrelated artifact exceptions are preserved.',fixedCaps:caps,fixedGrowthExceptions:growth,contentModuleCap:55000,reactBundle:react.bundle,angularBundle:angular.limits,blazorStaticCap:blazor.staticAssets.bytes});
