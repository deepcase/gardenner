import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const catalog=read('packages/css/metadata/components.json').components;
const components=catalog.filter(c=>c.category==='disclosure');
assert.deepEqual(components.map(c=>c.name),['accordion','collapse','read-more']);
assert.equal(components.reduce((sum,c)=>sum+c.variants.length,0),19);
const stylesheet=fs.readFileSync('packages/css/dist/gardener.css','utf8'),reports=[];
for(const framework of ['vue','react','angularjs','blazor']) {
  const data=read(framework==='blazor'?`packages/${framework}/metadata/components.json`:`packages/${framework}/dist/catalog.json`);
  const entries=Array.isArray(data)?data:data.components;
  for(const component of components) {
    const peer=entries.find(entry=>entry.name===component.name);
    assert.ok(peer,`${framework}/${component.name}`);
    for(const key of ['variants','parts','selector','behaviors']) assert.deepEqual(peer[key],component[key],`${framework}/${component.name}/${key}`);
  }
  reports.push({framework,components:components.length,variants:19});
}
for(const component of components) {
  assert.deepEqual(component.behaviors,['accordion']);
  for(const variant of component.variants) assert.ok(stylesheet.includes(`${component.cssSelector}-${variant}`),`${component.name}/${variant}`);
}
assert.equal(components.find(c=>c.name==='collapse').cssSelector,'.g-collapse-panel');
const hash=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','components/feedback.min.css']) assert.equal(hash('packages/css/dist/'+file),hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file);
for(const framework of ['vue','react','angularjs']) assert.ok(fs.readFileSync(`packages/${framework}/dist/style.css`,'utf8').includes('@gardenerim/css'));
fs.writeFileSync('docs/disclosure/parity.json',JSON.stringify({components:3,variants:19,cssAndBlazorAssetsIdentical:true,adaptersUseSharedStyles:true,reports},null,2)+'\n');
console.log('Disclosure parity: 3 components / 19 variants, shared behaviors and identical CSS across five packages.');
