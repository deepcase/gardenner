import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),components=read('packages/css/metadata/components.json').components.filter(c=>c.category==='interaction');
assert.equal(components.length,35);assert.equal(components.reduce((n,c)=>n+c.variants.length,0),239);
for(const name of ['vue','react','angularjs','blazor']){const catalog=read('packages/'+name+(name==='blazor'?'/metadata/components.json':'/dist/catalog.json'));const list=Array.isArray(catalog)?catalog:catalog.components;for(const component of components){const c=list.find(c=>c.name===component.name);assert.ok(c,component.name+' '+name);for(const key of ['selector','cssSelector','variants','states','parts','behaviors'])assert.deepEqual(c[key],component[key],name+'/'+component.name+'/'+key);}}
const blazor=read('packages/blazor/metadata/public-api.json');for(const c of components)assert.ok(blazor.componentNames.includes(c.name));
const css=fs.readFileSync('packages/css/dist/components/selection-compositions.min.css','utf8');for(const c of components)for(const v of c.variants)assert.ok(css.includes(c.cssSelector+'-'+v),c.name+'/'+v);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','interaction.js','components/selection-compositions.min.css'])assert.equal(hash('packages/css/dist/'+file),hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file);
assert.ok(fs.statSync('packages/css/dist/interaction.js').size<46000,'Interaction module fixed 46 kB cap');
await writeFile('docs/interaction/parity.json',JSON.stringify({components:35,variants:239,frameworks:['css','vue','react','angularjs','blazor'],sharedCss:true,sharedRuntime:true,identicalBlazorAssets:true},null,2)+'\n');console.log('Interaction parity passed: 35 components, 239 variants and five implementations.');
