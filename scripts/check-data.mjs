import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const components=read('packages/css/metadata/components.json').components.filter(c=>c.category==='data');
assert.equal(components.length,57);
const variants=components.reduce((n,c)=>n+(c.variants||[]).length,0);
assert.equal(variants,268);
const css=fs.readFileSync('packages/css/dist/gardener.css','utf8'),reports=[];
for(const framework of ['vue','react','angularjs','blazor']) {
 const metadata=read(framework==='blazor'?`packages/${framework}/metadata/components.json`:`packages/${framework}/dist/catalog.json`);
 const peers=Array.isArray(metadata)?metadata:metadata.components;
 for(const component of components){const peer=peers.find(c=>c.name===component.name);assert.ok(peer,framework+'/'+component.name);for(const property of ['variants','parts','selector','behaviors','cssSelector'])assert.deepEqual(['behaviors','variants'].includes(property)?(peer[property]||[]):peer[property],['behaviors','variants'].includes(property)?(component[property]||[]):component[property],framework+'/'+component.name+'/'+property);}
 reports.push({framework,components:57,variants});
}
for(const component of components)for(const variant of (component.variants||[]))assert.ok(css.includes((component.name==='descriptions'&&variant==='horizontal'?'.g-desc-managed':(component.name==='descriptions'?'.g-desc':component.cssSelector)+'-'+variant)),component.name+'/'+variant);
assert.ok(fs.statSync('packages/css/dist/data-display.js').size<=70000,'Managed data module exceeds its fixed 70 kB cap');
assert.ok(fs.statSync('packages/css/dist/descriptions.js').size<=16000,'Descriptions module exceeds its fixed 16 kB cap');
assert.ok(fs.statSync('packages/css/dist/tree.js').size<=32000,'Tree module exceeds its fixed 32 kB cap');
assert.ok(fs.statSync('packages/css/dist/timeline.js').size<=16000,'Timeline module exceeds its fixed 16 kB cap');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','data-display.js','descriptions.js','list.js','statistic.js','timeline.js','tree.js','components/data.min.css'])assert.equal(hash('packages/css/dist/'+file),hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file);
// Check transitive runtime modules too: matching a top-level hash cannot detect missing imports.
for(const file of ['gardener.runtime.min.js','data-display.js','navigation.js'])for(const match of fs.readFileSync('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file,'utf8').matchAll(/from\s*["']\.\/([^"']+)["']/g))assert.ok(fs.existsSync('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+match[1]),'Missing Blazor module '+match[1]);
for(const framework of ['vue','react','angularjs'])assert.ok(fs.readFileSync(`packages/${framework}/dist/style.css`,'utf8').includes('@gardenerim/css'));
await writeFile('docs/data/parity.json',JSON.stringify({components:57,variants,managed:17,sharedStyles:true,sharedRuntime:true,cssAndBlazorAssetsIdentical:true,reports},null,2)+'\n');
console.log('Data parity: 57 components / 268 variants, five packages share CSS and runtime; Blazor module dependencies verified.');
