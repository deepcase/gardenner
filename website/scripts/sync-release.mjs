import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { writeFile } from '../../scripts/fs-retry.mjs';
const root = new URL('../../', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const assets = {
  '../packages/css/dist/gardener.css': 'packages/css/dist/gardener.css',
  './assets/site.css': 'website/assets/site.css',
  './assets/site.js': 'website/assets/site.js',
  './assets/docs-gallery.css': 'website/assets/docs-gallery.css',
};
const hashes = Object.fromEntries(await Promise.all(Object.entries(assets).map(async ([url, path]) => [url, createHash('sha256').update(await readFile(new URL(path, root))).digest('hex').slice(0, 10)])));
for (const page of ['index', 'docs', 'components']) {
  const path = new URL(`website/${page}.html`, root);
  const source = await readFile(path, 'utf8');
  let html = source;
  const meta = `<meta name="gardenerim-version" content="${version}" />`;
  html = /<meta name="gardenerim-version"[^>]*>/.test(html) ? html.replace(/<meta name="gardenerim-version"[^>]*>/, meta) : html.replace('<head>', `<head>\n    ${meta}`);
  html = html.replace(/(<span[^>]*data-site-version[^>]*>)[^<]*(<\/span>)/g, `$1v${version}$2`);
  for (const [url, hash] of Object.entries(hashes)) {
    html = html.replaceAll(new RegExp(`((?:href|src)=")${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\?[^"<>]*)?"`, 'g'), `$1${url}?v=${version}-${hash}"`);
  }
  if (process.argv.includes('--check')) {
    if (source !== html) throw new Error(`${page}.html release version or asset hashes are stale; run node website/scripts/sync-release.mjs`);
  } else await writeFile(path, html);
}
console.log(`Website ${version}: release labels and content-addressed assets ${process.argv.includes('--check') ? 'verified' : 'synchronized'}.`);
