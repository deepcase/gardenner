import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const baseline = JSON.parse(await readFile(new URL('compatibility/npm-1.0.0.json', root), 'utf8'));
const modern = name => name.replace(/Gardener(?!im)/g, 'Gardenerim').replace(/gardener(?!im)/g, 'gardenerim').replace('GARDENER_', 'GARDENERIM_');
let count = 0;
for (const [name, api] of Object.entries(baseline.packages)) {
  const pkg = JSON.parse(await readFile(new URL(`packages/${name}/package.json`,root),'utf8'));
  const entry = name === 'css' ? 'dist/gardener.runtime.js' : 'dist/index.js';
  const module = await import(new URL(`packages/${name}/${entry}`,root));
  for (const key of api.moduleExports) {
    if (!(modern(key) in module)) throw new Error(`Missing renamed export: ${name}.${modern(key)}`);
  }
  for (const [subpath, target] of Object.entries(pkg.exports)) {
    if (typeof target !== 'object' || !target.import || !target.import.endsWith('.js')) continue;
    const exports = await import(new URL(`packages/${name}/${target.import}`,root));
    for (const key of Object.keys(exports)) {
      if (/Gardener(?!im)|gardener(?!im)|GARDENER_/.test(key)) throw new Error(`Old export remains: ${name}${subpath}.${key}`);
      count++;
    }
    if (target.types) {
      const types = await readFile(new URL(`packages/${name}/${target.types}`,root),'utf8');
      if (/\b(?:Gardener(?!im)[\w$]*|GARDENER_[\w$]*)\b/.test(types)) throw new Error(`Old type remains: ${name}${subpath}`);
    }
  }
}
console.log(`Verified ${count} public exports across all JavaScript entrypoints: Gardenerim branding only.`);
