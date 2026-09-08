import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const components=read('packages/css/metadata/components.json').components.filter(c=>c.category==='dashboard');
assert.equal(components.length,7);const variants=components.reduce((n,c)=>n+c.variants.length,0);assert.equal(variants,39);
const css=fs.readFileSync('packages/css/dist/gardener.css','utf8');
for(const framework of ['vue','react','angularjs','blazor']){const metadata=read(framework==='blazor'?`packages/${framework}/metadata/components.json`:`packages/${framework}/dist/catalog.json`);const peers=Array.isArray(metadata)?metadata:metadata.components;for(const c of components){const peer=peers.find(p=>p.name===c.name);assert.ok(peer,framework+'/'+c.name);for(const key of ['selector','cssSelector','variants','states','parts','behaviors'])assert.deepEqual(peer[key],c[key],framework+'/'+c.name+'/'+key);}}
for(const c of components)for(const v of c.variants)assert.ok(css.includes(c.cssSelector+'-'+v));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','dashboard.js','components/data.min.css'])assert.equal(hash('packages/css/dist/'+file),hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file);
assert.ok(fs.statSync('packages/css/dist/dashboard.js').size<40000,'Dashboard module fixed 40 kB limit');
await writeFile('docs/dashboard/parity.json',JSON.stringify({components:7,variants:39,frameworks:['css','vue','react','angularjs','blazor'],sharedCss:true,sharedRuntime:true,identicalBlazorAssets:true},null,2)+'\n');
console.log('Dashboard parity: 7 components, 39 variants, five implementations and identical Blazor assets.');
