import { readFile } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const css = await readFile(join(root, "dist/gardener.css"), "utf8");
const recipes = JSON.parse(await readFile(join(root, "metadata/recipes.json"), "utf8"));
const known = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((match) => match[1]));
const errors = [];

for (const recipe of recipes.recipes) {
  const rootClass = recipe.root.startsWith(".") ? recipe.root.slice(1) : null;
  if (rootClass && !known.has(rootClass)) errors.push(`Recipe ${recipe.id}: missing root ${recipe.root}`);
  for (const part of recipe.parts) if (!known.has(part)) errors.push(`Recipe ${recipe.id}: missing part .${part}`);
}

for (const input of process.argv.slice(2)) {
  const file = resolve(root, input);
  const html = await readFile(file, "utf8");
  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) errors.push(`${input}: html element needs a lang attribute`);
  if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(html)) errors.push(`${input}: responsive example needs a viewport meta tag`);
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const id of new Set(ids)) if (ids.filter((value) => value === id).length > 1) errors.push(`${input}: duplicate id #${id}`);
  for (const attribute of html.matchAll(/class=["']([^"']+)["']/g)) {
    for (const className of attribute[1].split(/\s+/).filter((name) => name.startsWith("g-"))) {
      if (!known.has(className)) errors.push(`${input}: unknown class .${className}`);
    }
  }
  if (/<[a-z][^>]*\bdata-g-dialog(?:\s|=|>)/i.test(html) && !/role=["']dialog["']/.test(html)) errors.push(`${input}: data-g-dialog needs a role="dialog" descendant`);
  for (const match of html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)) errors.push(`${input}: image missing alt attribute: ${match[0].slice(0, 60)}`);
  for (const match of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    const tag = match[0];
    if (/\btype=["']hidden["']/i.test(tag) || /\baria-label(?:ledby)?=["'][^"']+["']/i.test(tag)) continue;
    const id = tag.match(/\bid=["']([^"']+)["']/i)?.[1];
    const escapedId = id?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const explicitLabel = escapedId && new RegExp(`<label\\b[^>]*\\bfor=["']${escapedId}["']`, "i").test(html);
    const insideLabel = html.lastIndexOf("<label", match.index) > html.lastIndexOf("</label", match.index);
    if (!explicitLabel && !insideLabel) errors.push(`${input}: form control needs an accessible label: ${tag.slice(0, 80)}`);
  }
}

if (errors.length) throw new Error(`Gardenerim validation failed:\n- ${errors.join("\n- ")}`);
console.log(`Validation passed: ${recipes.recipes.length} recipes${process.argv.length > 2 ? ` and ${process.argv.length - 2} HTML file(s)` : ""}.`);
