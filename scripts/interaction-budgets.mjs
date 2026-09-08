import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>writeFile(p,JSON.stringify(v,null,2)+'\n');
const caps={
 'gardener.runtime.min.js':{raw:244000,gzip:69000,brotli:60000},
 'gardener.min.css':{raw:1655000,gzip:229000,brotli:124000},
 'gardener.components.min.css':{raw:1035000,gzip:141000,brotli:102000},
 'platforms/gardener.web.min.css':{raw:1600000,gzip:221000,brotli:120000},
 'platforms/gardener.mobile.min.css':{raw:1620000,gzip:223000,brotli:122000},
 'platforms/gardener.desktop.min.css':{raw:1635000,gzip:225000,brotli:124000},
 'components/selection-compositions.min.css':{raw:54000,gzip:8000,brotli:7000}
};
const growth={
 'gardener.min.css':{raw:65,gzip:65,brotli:104},
 'gardener.components.min.css':{raw:168,gzip:170,brotli:166},
 'platforms/gardener.web.min.css':{raw:67,gzip:66,brotli:113},
 'platforms/gardener.mobile.min.css':{raw:66,gzip:65,brotli:111},
 'platforms/gardener.desktop.min.css':{raw:66,gzip:65,brotli:111},
 'components/selection-compositions.min.css':{raw:248,gzip:195,brotli:195}
};
const p='packages/css/config/performance-budgets.json',css=read(p);for(const [name,limits]of Object.entries(caps))Object.assign(css.artifacts[name],limits);for(const [name,limits]of Object.entries(growth))Object.assign(css.baseline.maxGrowthPercent.artifactOverrides[name],limits);css.package.packed=3430000;css.package.unpacked=24900000;css.package.files=100;css.baseline.maxGrowthPercent.package.packed=79;css.baseline.maxGrowthPercent.package.unpacked=63;await write(p,css);
const r='packages/react/config/performance-budgets.json',react=read(r);react.bundle.raw=460000;react.bundle.gzip=73000;react.bundle.brotli=37000;await write(r,react);
const a='packages/angularjs/config/performance-budgets.json',angular=read(a);angular.limits={raw:540000,gzip:82000,brotli:40000};await write(a,angular);
const b='packages/blazor/config/performance-budgets.json',blazor=read(b);blazor.staticAssets.bytes=13800000;blazor.entrypoints.css.bytes=1655000;blazor.entrypoints.css.gzipBytes=229000;blazor.entrypoints.runtime.bytes=244000;await write(b,blazor);
await write('docs/interaction/budget-review.json',{reason:'35 data-driven interaction compositions, 239 variants and one new component add shared CSS, a separate runtime module and catalog metadata. The measured pre-review CSS was 1,645,135 raw / 226,570 gzip / 121,380 Brotli bytes; selection pack 49,681 / 6,811 / 6,011 bytes. Fixed caps include room for tested layout repairs. The 2.0.0 baseline and default growth policy are unchanged.',fixedCaps:caps,fixedGrowthExceptions:growth,reactBundle:react.bundle,angularBundle:angular.limits,blazorStaticAssets:blazor.staticAssets.bytes});
const html='packages/css/tests/html.test.mjs';await writeFile(html,fs.readFileSync(html,'utf8').replace('exampleFiles.length, 24','exampleFiles.length, 25'));
const pages='packages/css/tests/browser/pages.mjs';let s=fs.readFileSync(pages,'utf8');if(!s.includes('"interaction-compositions.html"'))s=s.replace('"dashboard-compositions.html",','"dashboard-compositions.html",\n  "interaction-compositions.html",');await writeFile(pages,s);
const schema='packages/blazor/metadata/public-api.schema.json';await writeFile(schema,fs.readFileSync(schema,'utf8').replace('"minItems": 49, "maxItems": 49','"minItems": 50, "maxItems": 50'));
const root='package.json',pkg=read(root);pkg.scripts['check:interaction']='node scripts/check-interaction.mjs';if(!pkg.scripts.check.includes('check:interaction'))pkg.scripts.check+=' && npm run check:interaction';await write(root,pkg);
