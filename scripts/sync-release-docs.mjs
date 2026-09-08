import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { writeFile } from './fs-retry.mjs';
const root = resolve(import.meta.dirname, '..');
execFileSync(process.execPath, ['scripts/sync-website-inventory.mjs'], { cwd: root, stdio: 'inherit' });
const html = (await Promise.all(['docs', 'index'].map(name => readFile(resolve(root, `website/${name}.html`), 'utf8')))).join('\n');
const texts = [...html.matchAll(/>([^<>]+)</g)].map(match => match[1].replace(/\s+/g, ' ').trim()).filter(text => text.length > 40);
const numbers = /\d[\d,]*(?:\.\d+)*/g;
const shape = text => text.replace(numbers, '#');
for (const locale of ['en', 'ja', 'ko', 'es', 'fr', 'de']) {
  const path = resolve(root, `website/assets/i18n/${locale}.json`);
  const dictionary = JSON.parse(await readFile(path, 'utf8'));
  for (const text of texts) {
    if (dictionary[text]) continue;
    const previous = Object.keys(dictionary).find(key => shape(key) === shape(text));
    if (!previous) continue;
    const before = [...previous.matchAll(numbers)].map(match => match[0]);
    const after = [...text.matchAll(numbers)].map(match => match[0]);
    const replacements = new Map();
    let ambiguous = false;
    before.forEach((value, index) => {
      if (replacements.has(value) && replacements.get(value) !== after[index]) ambiguous = true;
      replacements.set(value, after[index]);
    });
    if (!ambiguous) dictionary[text] = dictionary[previous].replace(numbers, value => replacements.get(value) ?? value);
  }
  await writeFile(path, JSON.stringify(dictionary, null, 2) + '\n');
}
for (const args of [['website/scripts/sync-release.mjs'], ['website/scripts/build-i18n.mjs', '--repair'], ['website/scripts/build-localized-pages.mjs'], ['website/scripts/build-css-catalog.mjs']]) {
  execFileSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
}
