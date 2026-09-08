import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, mkdir, unlink } from 'node:fs/promises';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFile, writeFile } from '../../scripts/fs-retry.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const source = resolve(process.env.GARDENER_DEMO_DIR || resolve(root, '../GardenerDemo'));
const output = resolve(root, 'website/showcase');
const version = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).version;
const componentCount = JSON.parse(await readFile(resolve(root, 'packages/css/metadata/components.json'), 'utf8')).components.length;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function inventory(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await inventory(resolve(directory, entry.name), path + '/'));
    else files.push(path);
  }
  return files.sort();
}
if (process.argv.includes('--check')) {
  const manifest = JSON.parse(await readFile(resolve(output, 'manifest.json'), 'utf8'));
  if (manifest.version !== version || manifest.components !== componentCount || !manifest.files.some(file => file.path === 'embed.html')) throw new Error('Website showcase manifest is stale');
  for (const file of manifest.files) {
    const path = resolve(output, file.path);
    if (!path.startsWith(output + sep) || hash(await readFile(path)) !== file.sha256) throw new Error(`Website showcase asset mismatch: ${file.path}`);
  }
  const categories = JSON.parse(await readFile(resolve(output, 'categories.json'), 'utf8'));
  const components = JSON.parse(await readFile(resolve(root, 'packages/css/metadata/components.json'), 'utf8')).components;
  if (new Set(categories.map(item => item.id)).size !== categories.length || components.some(item => !categories.some(category => category.id === item.category))) throw new Error('Demo categories and component catalog differ');
  console.log(`Website showcase verified: ${manifest.components} components, ${manifest.files.length} assets, ${version}.`);
} else {
  if (JSON.parse(await readFile(resolve(source, 'package.json'), 'utf8')).version !== version) throw new Error('Demo and website package versions must match');
  if (!process.argv.includes('--skip-build')) {
    const npm = process.env.npm_execpath || resolve(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
    execFileSync(process.execPath, [npm, '--prefix', source, 'run', 'build'], { stdio: 'inherit', windowsHide: true });
  }
  const dist = resolve(source, 'dist');
  const files = [];
  const previous = await inventory(output).catch(() => []);
  for (const path of await inventory(dist)) {
    const destination = resolve(output, path);
    if (!destination.startsWith(output + sep)) throw new Error('Asset path escaped website showcase directory');
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(resolve(dist, path), destination);
    const bytes = await readFile(destination);
    files.push({ path, bytes: bytes.length, sha256: hash(bytes) });
  }
  for (const path of ['categories.json', 'presentation.json']) {
    const bytes = await readFile(resolve(source, 'src/data/' + path));
    await writeFile(resolve(output, path), bytes);
    files.push({ path, bytes: bytes.length, sha256: hash(bytes) });
  }
  // Remove only previously generated files inside the verified output directory.
  for (const stale of previous.filter(path => path !== 'manifest.json' && !files.some(file => file.path === path))) {
    const path = resolve(output, stale);
    if (!path.startsWith(output + sep)) throw new Error('Stale asset path escaped website showcase directory');
    await unlink(path);
  }
  const registry = await readFile(resolve(source, 'src/showcaseRegistry.ts'), 'utf8');
  await writeFile(resolve(output, 'manifest.json'), JSON.stringify({ version, components: componentCount, source: relative(root, source).replaceAll('\\', '/'), registrySha256: hash(registry), files }, null, 2) + '\n');
  console.log(`Embedded GardenerDemo ${version}: ${files.length} portable assets copied to website/showcase.`);
}
