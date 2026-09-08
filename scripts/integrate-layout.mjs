import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';
async function edit(path,fn){const source=fs.readFileSync(path,'utf8'),result=fn(source);if(result!==source)await writeFile(path,result);}
await edit('packages/css/src/js/index.js',s=>s.includes("import {createLayoutController}")?s:"import {createLayoutController} from './layout.js';\n"+s);
await edit('packages/css/src/js/index.js',s=>s.includes('function createLayout(element)')?s:s.replace('function createContent(element)',`function createLayout(element) {
  if(!element.hasAttribute('data-g-layout-options')) return null;
  const controller=createLayoutController(element,{emit});
  return {refresh:controller.refresh,setOptions:controller.setOptions,getState:controller.getState,setValue:controller.setValue,toggle:controller.toggle,destroy:controller.destroy};
}

function createContent(element)`));
await edit('packages/css/src/js/index.js',s=>s.includes('["layout", createLayout]')?s:s.replace('["content", createContent]','["content", createContent], ["layout", createLayout]'));
await edit('packages/css/src/js/index.js',s=>s.includes('const managedLayout=')?s:s.replace('const managedContent=',`const managedLayout=instanceStores.get(element)?.get('layout');
    if(managedLayout&&!element.hasAttribute('data-g-layout-options')){managedLayout.destroy();instanceStores.get(element).delete('layout');}
    const managedContent=`));
await edit('packages/css/src/gardener.css',s=>s.includes('./layouts/enhanced.css')?s:s+'\n@import "./layouts/enhanced.css";\n@import "./layouts/variants.css";\n');
await edit('packages/css/config/builds.mjs',s=>s.includes('layouts/enhanced.css')?s:s.replace('layouts: ["layouts/layouts.css"]','layouts: ["layouts/layouts.css", "layouts/enhanced.css", "layouts/variants.css"]'));
await edit('packages/css/scripts/build.mjs',s=>s.includes('"js/layout.js"')?s:s.replace('await copyFile(join(sourceRoot, "js/content.js")','await copyFile(join(sourceRoot, "js/layout.js"), join(distRoot, "layout.js"));\nawait copyFile(join(sourceRoot, "js/content.js")'));
await edit('packages/css/scripts/contracts.mjs',s=>s.includes('"src/js/layout.js"')?s:s.replace('const runtime = ','const runtime = readFileSync(join(root, "src/js/layout.js"), "utf8") + "\\n" + '));
for(const path of ['packages/vue/src/component.ts','packages/react/src/component.tsx','packages/angularjs/src/directives.ts'])await edit(path,s=>s.includes('startsWith("layout-")')?s:s.replaceAll('!kebab(name).startsWith("content-")','!kebab(name).startsWith("content-") && !kebab(name).startsWith("layout-")').replaceAll('"interaction", "content"','"interaction", "content", "layout"'));
await edit('packages/blazor/src/Gardenerim.Blazor/Components/GardenerimComponentBase.cs',s=>s.includes('StartsWith("data-g-layout-"')?s:s.replaceAll('!DataAttributeName(pair.Key).StartsWith("data-g-content-", StringComparison.Ordinal)','!DataAttributeName(pair.Key).StartsWith("data-g-content-", StringComparison.Ordinal) && !DataAttributeName(pair.Key).StartsWith("data-g-layout-", StringComparison.Ordinal)'));
await edit('packages/blazor/src/Gardenerim.Blazor/wwwroot/gardener.blazor.js',s=>s.includes('[data-g-layout-options]')?s:s.replaceAll('[data-g-content-options]','[data-g-content-options],[data-g-layout-options]'));
await edit('packages/blazor/scripts/generate.mjs',s=>s.includes("'layout.js'")?s:s.replace("staticAssets.push('content.js'","staticAssets.push('layout.js','content.js'").replace("['dist/content.js','content.js']","['dist/layout.js','layout.js'],['dist/content.js','content.js']"));
