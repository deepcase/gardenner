import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { writeFile } from './fs-retry.mjs';

const root = resolve(import.meta.dirname, '..');
const json = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const baseline = await json('docs/release-2.2/published-2.1-contracts.json');
const version = (await json('package.json')).version;
const errors = [], packages = {};
// Published arrays are additive contracts. Object records are matched by identity;
// descriptions, examples, counts and versions may change in a minor release.
function preserved(before, after, path) {
  if (Array.isArray(before)) {
    for (const item of before) {
      if (typeof item === 'string') {
        if (!after?.includes(item)) errors.push(`${path}: removed ${item}`);
      } else if (item && typeof item === 'object') {
        const key = ['name', 'export', 'id'].find(key => typeof item[key] === 'string');
        if (!key) continue;
        const match = after?.find(value => value[key] === item[key]);
        if (!match) errors.push(`${path}: removed ${item[key]}`);
        else preserved(item, match, `${path}.${item[key]}`);
      }
    }
  } else if (before && typeof before === 'object') {
    for (const [key, value] of Object.entries(before)) {
      if (Array.isArray(value) || (value && typeof value === 'object')) preserved(value, after?.[key], `${path}.${key}`);
    }
  }
}
for (const [name, published] of Object.entries(baseline.packages)) {
  const manifest = await json(`packages/${name}/package.json`);
  const api = await json(`packages/${name}/metadata/public-api.json`);
  assert.equal(manifest.version, version, `${name} package version`);
  assert.equal(api.version ?? api.contractVersion, version, `${name} API version`);
  if (name === 'css') {
    // Attribute grouping is documentation taxonomy, not a public DOM contract.
    // An attribute may move between configuration and author-facing groups.
    const oldApi = structuredClone(published.api), newApi = structuredClone(api);
    oldApi.javascript.dataAttributes = Object.values(oldApi.javascript.dataAttributes).flat();
    newApi.javascript.dataAttributes = Object.values(newApi.javascript.dataAttributes).flat();
    preserved(oldApi, newApi, name);
  } else preserved(published.api, api, name);
  for (const entry of Object.keys(published.manifest.exports || {})) {
    if (!Object.hasOwn(manifest.exports || {}, entry)) errors.push(`${name}: removed package entry ${entry}`);
  }
  if (['vue', 'react', 'angularjs'].includes(name)) assert.equal(manifest.peerDependencies['@gardenerim/css'], `>=${version} <3.0.0`);
  const lock = await json(`packages/${name}/package-lock.json`);
  assert.equal(lock.version, version, `${name} lockfile version`);
  packages[name] = { version, publishedEntries: Object.keys(published.manifest.exports || {}).length };
}
const report = { version, baseline: baseline.source, baselineCommit: baseline.commit, packages, errors, passed: !errors.length };
await writeFile(resolve(root, 'docs/release-2.2/compatibility.json'), JSON.stringify(report, null, 2) + '\n');
assert.deepEqual(errors, [], 'Published 2.1.0 public contracts must survive the 2.2.0 minor upgrade');
console.log(`Release compatibility passed: ${Object.keys(packages).length} synchronized packages preserve ${baseline.source}.`);
