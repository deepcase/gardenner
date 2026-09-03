import { access, readFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const home = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const project = resolve(home, "..");
const css = await readFile(resolve(project, "packages/css/dist/gardener.css"), "utf8");
const manifest = JSON.parse(await readFile(resolve(project, "packages/css/dist/gardener.manifest.json"), "utf8"));
const utilities = JSON.parse(await readFile(resolve(project, "packages/css/dist/gardener.utilities.json"), "utf8"));
const vuePublicApi = JSON.parse(await readFile(resolve(project, "packages/vue/metadata/public-api.json"), "utf8"));
const vueCatalog = JSON.parse(await readFile(resolve(project, "packages/vue/dist/catalog.json"), "utf8"));
const reactPublicApi = JSON.parse(await readFile(resolve(project, "packages/react/metadata/public-api.json"), "utf8"));
const reactCatalog = JSON.parse(await readFile(resolve(project, "packages/react/dist/catalog.json"), "utf8"));
const angularPublicApi = JSON.parse(await readFile(resolve(project, "packages/angularjs/metadata/public-api.json"), "utf8"));
const angularCatalog = JSON.parse(await readFile(resolve(project, "packages/angularjs/dist/catalog.json"), "utf8"));
const blazorPublicApi = JSON.parse(await readFile(resolve(project, "packages/blazor/metadata/public-api.json"), "utf8"));
const blazorCatalog = JSON.parse(await readFile(resolve(project, "packages/blazor/metadata/components.json"), "utf8"));
const knownClasses = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((match) => match[1]));
const pages = ["index.html", "docs.html"];
const errors = [];

const exists = async (path) => access(path).then(() => true, () => false);
const localTarget = (page, value) => {
  const clean = value.split("#")[0].split("?")[0];
  if (!clean || /^(?:[a-z]+:|\/\/)/i.test(clean)) return null;
  return resolve(dirname(resolve(home, page)), clean);
};

for (const page of pages) {
  const html = await readFile(resolve(home, page), "utf8");
  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) errors.push(`${page}: missing html lang`);
  if (!/<html\b[^>]*\bdata-g-mode=["']light["']/i.test(html)) errors.push(`${page}: public site must default to light mode`);
  if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(html)) errors.push(`${page}: missing viewport meta`);
  if (!/<meta\b[^>]*\bname=["']description["']/i.test(html)) errors.push(`${page}: missing description meta`);
  if (!/<meta\b[^>]*\bname=["']theme-color["'][^>]*\bcontent=["']#ffffff["']/i.test(html)) errors.push(`${page}: theme-color must remain white`);
  if (/<(?:html|body)\b[^>]*data-g-mode=["']dark["']/i.test(html)) errors.push(`${page}: dark mode is not allowed`);
  for (const locale of ["zh-CN", "en", "ja", "ko", "es", "fr", "de", "x-default"]) {
    if (!new RegExp(`<link\\b[^>]*\\brel=["']alternate["'][^>]*\\bhreflang=["']${locale}["']`, "i").test(html)) errors.push(`${page}: missing hreflang ${locale}`);
  }
  for (const locale of ["zh-CN", "en", "ja", "ko", "es", "fr", "de"]) {
    if (!new RegExp(`<option\\b[^>]*\\bvalue=["']${locale}["']`, "i").test(html)) errors.push(`${page}: language switcher missing ${locale}`);
  }
  if (!html.includes("data-site-language")) errors.push(`${page}: missing language switcher`);

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const id of new Set(ids)) if (ids.filter((value) => value === id).length > 1) errors.push(`${page}: duplicate id #${id}`);

  for (const attribute of html.matchAll(/class=["']([^"']+)["']/g)) {
    for (const className of attribute[1].split(/\s+/).filter((name) => name.startsWith("g-"))) {
      if (!knownClasses.has(className)) errors.push(`${page}: unknown Gardenerim class .${className}`);
    }
  }
  for (const image of html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)) errors.push(`${page}: image missing alt: ${image[0].slice(0, 60)}`);

  for (const match of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    const tag = match[0];
    if (/\btype=["']hidden["']/i.test(tag) || /\baria-label(?:ledby)?=["'][^"']+["']/i.test(tag)) continue;
    const id = tag.match(/\bid=["']([^"']+)["']/i)?.[1];
    const explicit = id && new RegExp(`<label\\b[^>]*\\bfor=["']${id}["']`, "i").test(html);
    const wrapped = html.lastIndexOf("<label", match.index) > html.lastIndexOf("</label", match.index);
    if (!explicit && !wrapped) errors.push(`${page}: form control needs an accessible label: ${tag.slice(0, 80)}`);
  }

  const linkSource = html.replace(/\bdata-g-copy-value=(?:"[^"]*"|'[^']*')/gi, "");
  for (const match of linkSource.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const [, hash = ""] = match[1].split("#");
    if (!match[1].split("#")[0] && hash && !ids.includes(decodeURIComponent(hash))) errors.push(`${page}: missing local anchor #${hash}`);
    const target = localTarget(page, match[1]);
    if (target && !(await exists(target))) errors.push(`${page}: missing local target ${match[1]}`);
    else if (target && hash && extname(target) === ".html") {
      const targetHtml = await readFile(target, "utf8");
      if (!new RegExp(`\\bid=["']${decodeURIComponent(hash).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(targetHtml)) errors.push(`${page}: missing anchor ${match[1]}`);
    }
  }
}

const index = await readFile(resolve(home, "index.html"), "utf8");
for (const [value, label] of [[manifest.themes.length, "themes"], [manifest.components.length, "components"], [utilities.count, "utilities"], [manifest.recipes.length, "recipes"]]) {
  if (!index.includes(`data-count="${value}"`)) errors.push(`index.html: displayed ${label} count is not synchronized (${value})`);
}

const docs = await readFile(resolve(home, "docs.html"), "utf8");
for (const section of ["quick-start", "installation", "vue", "react", "angular", "blazor", "principles", "themes", "tokens", "css-api", "utilities", "layouts", "grid-system", "region-layouts", "layout-primitives", "page-components", "help-system", "form-compositions", "navigation-compositions", "data-compositions", "selection-compositions", "content-compositions", "auth-compositions", "commerce-compositions", "mobile-compositions", "desktop-compositions", "ai-compositions", "solution-compositions", "public-api", "components", "runtime", "recipes", "ai-generation", "desktop", "accessibility", "print", "customization"]) {
  if (!docs.includes(`id="${section}"`)) errors.push(`docs.html: missing required section #${section}`);
}

if (vuePublicApi.version !== "2.1.0" || vuePublicApi.status !== "stable") errors.push("Vue public API must document 2.1.0 stable");
if (vuePublicApi.components !== vueCatalog.components.length || vuePublicApi.componentExports.length !== vueCatalog.components.length) errors.push("Vue component catalog and public API are not synchronized");
if (vuePublicApi.componentExports.length !== new Set(vuePublicApi.componentExports).size) errors.push("Vue component export names must be unique");
for (const marker of ["@gardenerim/vue", "506 个 CSS", "546 个根运行时导出", "30 个包入口", "28 个组件 CSS 包代理", "GardenerimProvider", "v-gardenerim", "useTauriWindowControls", "useElectronWindowControls", "vue-component-catalog", "npm run release:verify"]) {
  if (!docs.includes(marker)) errors.push(`docs.html: missing Vue documentation marker: ${marker}`);
}
for (const marker of ["@gardenerim/vue", "506 个组件", "546 runtime exports", "30 entrypoints", "28 CSS packs", "Vue 3.4+"]) {
  if (!index.includes(marker)) errors.push(`index.html: missing Vue introduction marker: ${marker}`);
}

if (reactPublicApi.version !== "2.1.0" || reactPublicApi.status !== "stable") errors.push("React public API must document 2.1.0 stable");
if (reactPublicApi.components !== reactCatalog.components.length || reactPublicApi.componentExports.length !== reactCatalog.components.length) errors.push("React component catalog and public API are not synchronized");
if (reactPublicApi.componentExports.length !== new Set(reactPublicApi.componentExports).size) errors.push("React component export names must be unique");
for (const marker of ["@gardenerim/react", "506 个 CSS", "546 个根运行时导出", "22 个 TypeScript 类型导出", "30 个公共包入口", "28 个组件 CSS 包代理", "GardenerimProvider", "onValueChange", "useTauriWindowControls", "useElectronWindowControls", "react-component-catalog", "npm run release:verify"]) {
  if (!docs.includes(marker)) errors.push(`docs.html: missing React documentation marker: ${marker}`);
}
for (const marker of ["@gardenerim/react", "506 个 CSS", "546 runtime exports", "30 entrypoints", "28 CSS packs", "React 18.3–19.x"]) {
  if (!index.includes(marker)) errors.push(`index.html: missing React introduction marker: ${marker}`);
}

if (angularPublicApi.version !== "2.1.0" || angularPublicApi.status !== "stable" || angularPublicApi.angularjs !== ">=1.8.2 <1.9.0") errors.push("AngularJS public API must document the verified 2.1.0 stable range");
if (angularPublicApi.components !== angularCatalog.components.length || angularPublicApi.componentExports.length !== angularCatalog.components.length) errors.push("AngularJS component catalog and public API are not synchronized");
if (angularPublicApi.componentExports.length !== new Set(angularPublicApi.componentExports).size) errors.push("AngularJS component export names must be unique");
for (const marker of ["@gardenerim/angularjs", "506 个 CSS", "542 个根运行时导出", "24 个 TypeScript 类型导出", "30 个公共包入口", "28 个组件 CSS 包代理", "createGardenerimAngularJS", "gardenerProvider", "gGardenerim", "ngModel", "GardenerimRuntime", "GardenerimTheme", "GardenerimToast", "AngularJS 安全基线", "angular-component-catalog", "npm run release:verify"]) {
  if (!docs.includes(marker)) errors.push(`docs.html: missing AngularJS documentation marker: ${marker}`);
}
for (const marker of ["@gardenerim/angularjs", "506 个 CSS", "542 runtime exports", "30 entrypoints", "28 CSS packs", "AngularJS 1.8.2–1.8.3"]) {
  if (!index.includes(marker)) errors.push(`index.html: missing AngularJS introduction marker: ${marker}`);
}

if (blazorPublicApi.version !== "2.1.0" || blazorPublicApi.status !== "stable" || blazorPublicApi.targetFramework !== "net10.0" || !blazorPublicApi.compatibleFrameworks.includes("net11.0")) errors.push("Blazor public API must document the verified 2.1.0 .NET 10/11 contract");
if (blazorPublicApi.components !== blazorCatalog.components.length || blazorPublicApi.componentTypes.length !== blazorCatalog.components.length) errors.push("Blazor component catalog and public API are not synchronized");
if (blazorPublicApi.componentTypes.length !== new Set(blazorPublicApi.componentTypes).size) errors.push("Blazor component type names must be unique");
for (const marker of ["Gardenerim.Blazor", "506 个 CSS", "72 个行为", "79 个事件", "31 个框架类型", "20 个参数", "6 个实例成员", "45 个静态资源", "GardenerimProvider", "GardenerimField&lt;TValue&gt;", "GardenerimRuntimeCatalog", "Blazor Public API", "blazor-component-catalog", "npm run release:verify", "npm run test:net11"]) {
  if (!docs.includes(marker)) errors.push(`docs.html: missing Blazor documentation marker: ${marker}`);
}
for (const marker of ["Official Blazor RCL", "Gardenerim.Blazor", "506 个 CSS", "72 种 DOM", "79 种事件", "506 components", "72 behaviors", "79 events", "45 static assets", ".NET 10 / 11"]) {
  if (!index.includes(marker)) errors.push(`index.html: missing Blazor introduction marker: ${marker}`);
}

const siteCss = await readFile(resolve(home, "assets/site.css"), "utf8");
const openBraces = [...siteCss].filter((character) => character === "{").length;
const closeBraces = [...siteCss].filter((character) => character === "}").length;
if (openBraces !== closeBraces) errors.push(`site.css: unbalanced braces (${openBraces}/${closeBraces})`);
if (!/body\s*\{[^}]*background:\s*#fff/i.test(siteCss)) errors.push("site.css: body must explicitly use a white background");
if (/color-scheme\s*:\s*dark|background\s*:\s*#(?:000|0[0-9a-f]{2}|1[0-9a-f]{2})\b/i.test(siteCss)) errors.push("site.css: dark surface detected");

for (const file of ["assets/site.css", "assets/site.js", "assets/i18n.js", "assets/file-i18n.js", "assets/i18n/manifest.json", "assets/i18n/en.json", "assets/i18n/ja.json", "assets/i18n/ko.json", "assets/i18n/es.json", "assets/i18n/fr.json", "assets/i18n/de.json", "assets/css-catalog.json", "assets/favicon.svg", "scripts/build-i18n.mjs", "scripts/build-localized-pages.mjs", "scripts/build-css-catalog.mjs", "scripts/check-coverage.mjs", "scripts/serve.mjs", "README.md", "robots.txt"]) {
  if (!(await exists(resolve(home, file)))) errors.push(`Missing required website file: ${file}`);
}

await import("./build-i18n.mjs");

if (errors.length) throw new Error(`Gardenerim website check failed:\n- ${[...new Set(errors)].join("\n- ")}`);
console.log(`Website check passed: ${pages.length} pages, ${manifest.components.length} components, ${utilities.count} utilities, ${manifest.recipes.length} recipes.`);
