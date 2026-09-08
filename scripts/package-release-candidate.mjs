import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { copyFile, writeFile } from './fs-retry.mjs';

const root = resolve(import.meta.dirname, '..');
const json = async path => JSON.parse((await readFile(resolve(root, path), 'utf8')).replace(/^\uFEFF/, ''));
const { version } = await json('package.json');
const evidence = `docs/release-${version.split('.').slice(0, 2).join('.')}`;
for (const name of ['css', 'vue', 'react', 'angularjs', 'blazor']) {
  const checks = await json(`${evidence}/${name}-checks.json`);
  assert.equal(checks.version, version);
  assert.equal(checks.passed, true, `${name} release checks must pass before packaging`);
}
assert.equal((await json(`${evidence}/repository-result.json`)).exitCode, 0);
assert.equal((await json(`${evidence}/compatibility.json`)).passed, true);
const output = resolve(root, 'artifacts', `release-${version}`);
await mkdir(output, { recursive: true });
const npm = process.env.npm_execpath || resolve(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
const artifacts = [];
async function record(path) {
  const bytes = await readFile(path);
  artifacts.push({ path: path.replaceAll('\\', '/'), bytes: (await stat(path)).size, sha256: createHash('sha256').update(bytes).digest('hex') });
}
for (const name of ['css', 'vue', 'react', 'angularjs']) {
  const result = spawnSync(process.execPath, [npm, 'pack', '--ignore-scripts', '--json', '--pack-destination', output], { cwd: resolve(root, 'packages', name), encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 0, result.stderr || `${name} npm pack failed`);
  const [packed] = JSON.parse(result.stdout);
  assert.equal(packed.version, version);
  await record(resolve(output, packed.filename));
}
for (const extension of ['nupkg', 'snupkg']) {
  const name = `Gardenerim.Blazor.${version}.${extension}`;
  await copyFile(resolve(root, 'packages/blazor/artifacts', name), resolve(output, name));
  await record(resolve(output, name));
}
await writeFile(resolve(root, evidence, 'artifacts.json'), JSON.stringify({ version, createdAt: new Date().toISOString(), published: false, artifacts }, null, 2) + '\n');
console.log(`Packaged ${artifacts.length} local release artifacts for ${version}; no registry upload performed.`);
