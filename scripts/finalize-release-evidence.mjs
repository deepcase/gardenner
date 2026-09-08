import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { writeFile } from './fs-retry.mjs';

const root = resolve(import.meta.dirname, '..');
const json = async path => JSON.parse((await readFile(resolve(root, path), 'utf8')).replace(/^\uFEFF/, ''));
const { version } = await json('package.json');
const directory = `docs/release-${version.split('.').slice(0, 2).join('.')}`;
const report = { version, completedAt: new Date().toISOString(), status: 'local-release-candidate', published: false, sourceHead: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), includesUncommittedChanges: true, packages: {} };
for (const name of ['css', 'vue', 'react', 'angularjs', 'blazor']) {
  const checks = await json(`${directory}/${name}-checks.json`);
  assert.equal(checks.version, version);
  assert.equal(checks.passed, true, `${name} checks`);
  report.packages[name] = { passed: true, steps: checks.checks.length, evidence: `${name}-checks.json` };
}
const repository = await json(`${directory}/repository-result.json`);
assert.equal(repository.version, version);
assert.equal(repository.exitCode, 0);
assert.equal((await json(`${directory}/compatibility.json`)).passed, true);
assert.equal((await json(`${directory}/diff-result.json`)).exitCode, 0);
report.repository = repository;
const inventory = await json('packages/css/metadata/components.json');
const browserCounts = await json(`${directory}/browser-counts.json`);
const expectedBrowserTests = Object.values(browserCounts).reduce((sum, count) => sum + count, 0);
const browserLog = (await Promise.all(['test-browser', 'test-browser-firefox', 'test-mobile', 'test-a11y'].map(step => readFile(resolve(root, directory, `css-${step}.log`), 'utf8')))).join('\n');
const actualBrowserTests = [...browserLog.matchAll(/\b(\d+) passed \(/g)].reduce((sum, match) => sum + Number(match[1]), 0);
assert.equal(actualBrowserTests, expectedBrowserTests, 'Full CSS browser matrix must run, without omitted projects');
report.cssBrowser = { passed: true, tests: actualBrowserTests, projects: browserCounts };
const demo = await json(`${directory}/demo-catalog.json`);
assert.equal(demo.version, version);
assert.equal(demo.components, inventory.components.length);
assert.equal(demo.checks, demo.components * demo.viewports.length);
assert.equal(demo.passed, true);
assert.equal((await json(`${directory}/demo-version.json`)).passed, true);
report.demo = { passed: true, components: demo.components, checks: demo.checks, widths: demo.viewports, scope: 'catalog and first preview; not every business scenario' };
report.arco = {};
for (const engine of ['chromium', 'firefox', 'webkit']) {
  const checks = await json(`${directory}/arco-${engine}.json`);
  assert.equal(checks.length, 4);
  assert.ok(checks.every(row => row.axe === true));
  report.arco[engine] = { passed: true, evidence: `arco-${engine}.json` };
}
const hosts = await json(`${directory}/arco-hosts.json`);
assert.deepEqual(hosts.errors, []);
assert.equal(hosts.staticAssetIdentity, true);
report.arco.hosts = { passed: true, evidence: 'arco-hosts.json' };
report.regressions = {};
for (const name of ['cms-window-targets', 'website-link-targets']) {
  const checks = await json(`${directory}/${name}.json`);
  assert.equal(checks.version, version);
  assert.equal(checks.passed, true);
  assert.equal(checks.results.length, 6);
  report.regressions[name] = { passed: true, checks: 6, evidence: `${name}.json` };
}
const websiteA11y = await readFile(resolve(root, directory, 'website-final-a11y.log'), 'utf8');
assert.match(websiteA11y, /\b2 passed \(/);
assert.doesNotMatch(websiteA11y, /\b\d+ failed\b/);
report.regressions.websiteAccessibility = { passed: true, checks: 2, evidence: 'website-final-a11y.log' };
const artifacts = await json(`${directory}/artifacts.json`);
assert.equal(artifacts.version, version);
assert.equal(artifacts.published, false);
for (const artifact of artifacts.artifacts) assert.equal(createHash('sha256').update(await readFile(artifact.path)).digest('hex'), artifact.sha256, artifact.path);
report.artifacts = { verified: true, count: artifacts.artifacts.length, evidence: 'artifacts.json' };
report.limitations = ['AngularJS upstream security advisories remain; exact advisory allowlist enforced.', 'Component evidence audit retains medium/small findings; automated passing checks do not certify every variant or subjective visual quality.', '.NET 11 consumption verified with preview SDK; .NET 10 is the stable build target.'];
report.passed = true;
await writeFile(resolve(root, directory, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`${version}: all recorded gates and ${artifacts.artifacts.length} artifact hashes verified.`);
