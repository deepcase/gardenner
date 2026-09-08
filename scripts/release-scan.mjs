import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { writeFile } from './fs-retry.mjs';

const root = resolve(import.meta.dirname, '..');
const name = process.argv[2];
if (!['css', 'vue', 'react', 'angularjs', 'blazor'].includes(name)) throw new Error('Pass a package name');
const cwd = resolve(root, 'packages', name);
const manifest = JSON.parse(await readFile(resolve(cwd, 'package.json'), 'utf8'));
const out = resolve(root, 'docs/release-2.2');
await mkdir(out, { recursive: true });
const npm = process.env.npm_execpath || resolve(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
const expand = step => name === 'css' && step === 'test:e2e'
  ? manifest.scripts[step].split(' && ').map(command => command.replace(/^npm run /, ''))
  : [step];
const steps = manifest.scripts.test.split(' && ').map(command => command.replace(/^npm run /, '')).flatMap(expand);
if (name === 'blazor') steps.push('test:net11');
const requested = process.argv.slice(3);
const selected = requested.length ? requested.flatMap(expand) : steps;
let report = { version: manifest.version, package: name, checks: [] };
if (requested.length) {
  try { report = JSON.parse(await readFile(resolve(out, `${name}-checks.json`), 'utf8')); } catch {}
  if (report.version !== manifest.version) throw new Error('Cannot reuse evidence from another version');
}
for (const step of selected) {
  if (!manifest.scripts[step]) throw new Error(`Unknown script ${step}`);
  const started = Date.now(), log = `${name}-${step.replaceAll(':', '-')}.log`;
  const stream = createWriteStream(resolve(out, log));
  console.log(`${name}: ${step} started`);
  const child = spawn(process.execPath, [npm, 'run', step], { cwd, windowsHide: true, env: { ...process.env, GARDENER_REQUIRE_FIREFOX: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.pipe(stream, { end: false }); child.stderr.pipe(stream, { end: false });
  const exitCode = await new Promise((accept, reject) => { child.on('error', reject); child.on('close', accept); });
  await new Promise(accept => stream.end(accept));
  const result = { step, exitCode, seconds: Math.round((Date.now() - started) / 1000), log, finishedAt: new Date().toISOString() };
  report.checks = report.checks.filter(check => check.step !== step).concat(result);
  report.passed = steps.every(step => report.checks.some(check => check.step === step && check.exitCode === 0));
  await writeFile(resolve(out, `${name}-checks.json`), JSON.stringify(report, null, 2) + '\n');
  console.log(`${name}: ${step} ${exitCode === 0 ? 'passed' : 'FAILED'} (${result.seconds}s)`);
}
if (!report.passed) process.exitCode = 1;
