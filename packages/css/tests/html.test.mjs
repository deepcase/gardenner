import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exampleRoot = join(projectRoot, "examples");
const websiteRoot = resolve(projectRoot, "../../website");
const exampleFiles = (await readdir(exampleRoot)).filter((name) => name.endsWith(".html")).sort();
const pages = [
  ...exampleFiles.map((name) => ({ label: `examples/${name}`, path: join(exampleRoot, name) })),
  { label: "website/index.html", path: join(websiteRoot, "index.html") },
  { label: "website/docs.html", path: join(websiteRoot, "docs.html") }
];

for (const page of pages) {
  test(`${page.label} has conforming HTML structure and references`, async () => {
    const html = await readFile(page.path, "utf8");
    const parseErrors = [];
    parse(html, { onParseError: (error) => parseErrors.push(`${error.code} at ${error.startLine}:${error.startCol}`) });

    const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const references = [...html.matchAll(/\b(?:aria-controls|aria-labelledby|aria-describedby)=["']([^"']+)["']/gi)]
      .flatMap((match) => match[1].trim().split(/\s+/));
    const missingReferences = [...new Set(references.filter((id) => !ids.includes(id)))];

    assert.deepEqual(parseErrors, [], `HTML parser errors in ${page.label}`);
    assert.deepEqual(duplicates, [], `Duplicate IDs in ${page.label}`);
    assert.deepEqual(missingReferences, [], `Missing ARIA references in ${page.label}`);
    assert.match(html, /<html\b[^>]*\blang=["'][^"']+["']/i, `${page.label} needs a document language`);
    assert.match(html, /<title>\s*[^<]+\s*<\/title>/i, `${page.label} needs a non-empty title`);
    assert.match(html, /<meta\b[^>]*\bname=["']viewport["']/i, `${page.label} needs a viewport declaration`);
    assert.doesNotMatch(html, /<button\b(?![^>]*\btype=)[^>]*>/i, `${page.label} buttons need an explicit type`);
  });
}

test("HTML release inventory covers every example and both documentation pages", () => {
  assert.equal(exampleFiles.length, 21);
  assert.equal(pages.length, 23);
});
