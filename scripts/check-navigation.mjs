import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),json=p=>JSON.parse(read(p));
const names=json('packages/css/metadata/components.json').components.filter(x=>x.category==='navigation').map(x=>x.name);
const examples=json('packages/css/metadata/navigation-examples.json');assert.equal(names.length,41);assert.deepEqual(Object.keys(examples),names);
for(const name of names)assert.equal(examples[name].scenarios.length,3,name);
for(const framework of ['vue','react','angularjs','blazor']){
 const metadata=framework==='blazor'?json(`packages/${framework}/metadata/components.json`):await import(new URL(`packages/${framework}/dist/generated/catalog.js`,root));const rows=Array.isArray(metadata)?metadata:metadata.components||metadata.componentCatalog;
 assert.deepEqual(rows.filter(x=>x.category==='navigation').map(x=>x.name),names,framework);
}
const parameters=json('scripts/navigation-release-parameters.json');
for(const [key]of parameters){assert.ok(read('packages/css/src/types/navigation.d.ts').includes(key+'?:'),key+' TypeScript');assert.ok(read('packages/blazor/src/Gardenerim.Blazor/Models/GardenerimNavigationOptions.cs').includes(key[0].toUpperCase()+key.slice(1)+' {'),key+' Blazor');for(const name of names)assert.ok(examples[name].parameters.includes(key),name+'/'+key);}
assert.deepEqual(json('packages/css/metadata/navigation-release-parameters.json'),parameters);
assert.equal(json('packages/css/metadata/components.json').components.filter(c=>c.category==='navigation').reduce((n,c)=>n+(c.variants||[]).length,0),174);
const digest=p=>createHash('sha256').update(read(p)).digest('hex');
for(const file of ['navigation.js','navigation-catalog.js']){
 assert.equal(digest(`packages/css/src/js/${file}`),digest(`packages/css/dist/${file}`),`${file}: source/dist`);
 assert.equal(digest(`packages/css/dist/${file}`),digest(`packages/blazor/src/Gardenerim.Blazor/wwwroot/${file}`),`${file}: CSS/Blazor`);
}
const demo=new URL('../GardenerDemo/src/data/navigation-examples.json',root);if(fs.existsSync(demo))assert.deepEqual(JSON.parse(fs.readFileSync(demo)),examples,'Demo contracts');
console.log('Navigation consistency passed: 41 components, 123 scenarios, 5 project catalogs, shared runtime assets.');

for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js'])assert.equal(digest('packages/css/dist/'+file),digest('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file+' shared styles');
