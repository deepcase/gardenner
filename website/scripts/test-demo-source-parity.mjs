import assert from 'node:assert/strict';
import{readFile}from'node:fs/promises';import{createHash}from'node:crypto';import{resolve}from'node:path';
import{writeFile}from'../../scripts/fs-retry.mjs';
const root=resolve(import.meta.dirname,'../..'),demo=resolve(process.env.GARDENER_DEMO_DIR||resolve(root,'../GardenerDemo'));
const json=async path=>JSON.parse(await readFile(resolve(root,path),'utf8'));const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const manifest=await json('website/showcase/manifest.json'),css=(await json('packages/css/metadata/components.json')).components;
for(const file of manifest.files){const source=resolve(demo,['categories.json','presentation.json'].includes(file.path)?'src/data/'+file.path:'dist/'+file.path);assert.equal(hash(await readFile(source)),file.sha256,'Demo source differs from website: '+file.path);}
assert.equal(hash(await readFile(resolve(demo,'src/showcaseRegistry.ts'))),manifest.registrySha256);
const frameworks=['vue','react','angularjs','blazor'];const results=[];
for(const framework of frameworks){const catalog=(await json('packages/'+framework+(framework==='blazor'?'/metadata/components.json':'/dist/catalog.json'))).components;assert.equal(catalog.length,css.length);
 for(const definition of css){const entry=catalog.find(item=>item.name===definition.name);assert.ok(entry,framework+'/'+definition.name);
  for(const key of ['category','variants','states','platforms'])assert.deepEqual(entry[key]??[],definition[key]??[],framework+'/'+definition.name+'/'+key);
 }
 results.push({framework,components:catalog.length,variants:catalog.reduce((sum,item)=>sum+(item.variants?.length||0),0),passed:true});
}
const report={passed:true,version:manifest.version,components:css.length,variants:css.reduce((sum,item)=>sum+(item.variants?.length||0),0),identicalDemoAssets:manifest.files.length,sharedCategories:true,sharedPresentation:true,sharedRegistry:true,frameworks:results};
await writeFile(resolve(root,'docs/release-2.2/website-demo-integration/source-parity.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
