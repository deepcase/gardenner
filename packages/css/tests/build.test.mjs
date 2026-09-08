import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { build as buildWithEsbuild } from "esbuild";
import { contentIntegrity } from "../scripts/lib/build-tools.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (file) => JSON.parse(await readFile(resolve(root, file), "utf8"));

test("2.2.0 build catalog covers every platform, pack, component, and integrity record", async () => {
  const catalog = await readJson("dist/gardener.builds.json");
  const components = await readJson("metadata/components.json");
  const pkg = await readJson("package.json");
  assert.equal(catalog.version, "2.2.0");
  assert.deepEqual(catalog.platforms.map(({ name }) => name), ["web", "mobile", "desktop", "tauri", "electron"]);
  assert.equal(catalog.componentPacks.length, 28);
  assert.equal(Object.keys(catalog.componentOwnership).length, components.components.length);
  assert.equal(Object.keys(catalog.componentSignatures).length, components.components.length);
  assert.equal(Object.keys(catalog.artifacts).length, 42);
  assert.deepEqual(Object.keys(catalog.artifactIntegrity), Object.keys(catalog.artifacts));
  assert.deepEqual(catalog.reproducibility, { deterministic: true, integrityAlgorithm: "sha256", verificationCommand: "npm run verify:reproducible" });
  for (const [file, integrity] of Object.entries(catalog.artifactIntegrity)) {
    assert.deepEqual(integrity, contentIntegrity(await readFile(resolve(root, "dist", file))), `${file} integrity must match its bytes`);
  }
  assert.ok(Object.values(catalog.componentOwnership).every((packs) => packs.length > 0));
  assert.deepEqual(catalog.componentOwnership.alert, ["basic"]);
  assert.deepEqual(catalog.componentOwnership.dialog, ["feedback"]);
  assert.deepEqual(catalog.componentOwnership["page-header"], ["page"]);
  assert.deepEqual(catalog.componentOwnership["date-picker"], ["extended"]);
  for (const profile of catalog.platforms) {
    assert.equal(profile.minCss, `platforms/gardener.${profile.name}.min.css`);
    assert.deepEqual(profile.cssDependencies, ["tauri", "electron"].includes(profile.name) ? ["platforms/gardener.desktop.min.css"] : []);
    const expected = components.components
      .filter(({ name }) => catalog.componentOwnership[name].some((pack) => profile.packs.includes(pack)))
      .map(({ name }) => name);
    assert.deepEqual(profile.components, expected, `${profile.name} component inventory must describe its emitted packs`);
  }
  assert.ok(pkg.sideEffects.includes("dist/**/*.css"));
  assert.match(import.meta.resolve("@gardenerim/css/component/basic"), /dist\/components\/basic\.min\.css$/u);
  assert.match(import.meta.resolve("@gardenerim/css/component/basic.css"), /dist\/components\/basic\.min\.css$/u);
  assert.match(import.meta.resolve("@gardenerim/css/platform/tauri.css"), /dist\/platforms\/gardener\.tauri\.min\.css$/u);
  assert.match(import.meta.resolve("@gardenerim/css/platform/electron.css"), /dist\/platforms\/gardener\.electron\.min\.css$/u);
  assert.match(import.meta.resolve("@gardenerim/css/builds"), /dist\/gardener\.builds\.json$/u);
});

test("formal CSS and JavaScript minification emits smaller parseable artifacts and source maps", async () => {
  for (const [source, minified] of [
    ["dist/gardener.css", "dist/gardener.min.css"],
    ["dist/gardener.runtime.js", "dist/gardener.runtime.min.js"],
  ]) {
    const sourceBytes = (await readFile(resolve(root, source))).byteLength;
    const minifiedBytes = (await readFile(resolve(root, minified))).byteLength;
    assert.ok(minifiedBytes < sourceBytes, `${minified} must be smaller than ${source}`);
    if (minified.endsWith(".css")) {
      assert.match(await readFile(resolve(root, minified), "utf8"), /^\/\*! Gardenerim \| MIT License \*\//u);
    }
    const map = JSON.parse(await readFile(resolve(root, `${minified}.map`), "utf8"));
    assert.equal(map.version, 3);
    assert.ok(map.sources.length > 0);
  }
  const runtime = await import(`${pathToFileURL(resolve(root, "dist/gardener.runtime.min.js"))}?test=2.2.0`);
  assert.equal(runtime.Gardenerim.version, "2.2.0");
  assert.deepEqual(Object.keys(runtime).sort(), ["Gardenerim", "configure", "createTable", "createNavigation", "navigationDefaults", "default", "destroy", "disconnect", "emit", "getConfiguration", "getInstance", "init", "observe", "refresh", "register", "start", "stop", "supportedLocales", "toast"].sort());
});

test("platform builds preserve platform boundaries", async () => {
  const web = await readFile(resolve(root, "dist/platforms/gardener.web.min.css"), "utf8");
  const mobile = await readFile(resolve(root, "dist/platforms/gardener.mobile.min.css"), "utf8");
  const desktop = await readFile(resolve(root, "dist/platforms/gardener.desktop.min.css"), "utf8");
  const tauri = await readFile(resolve(root, "dist/platforms/gardener.tauri.min.css"), "utf8");
  const electron = await readFile(resolve(root, "dist/platforms/gardener.electron.min.css"), "utf8");
  assert.equal(web.includes(".g-mobile-app-bar"), false);
  assert.equal(web.includes(".g-titlebar"), false);
  assert.equal(mobile.includes(".g-mobile-app-bar"), true);
  assert.equal(mobile.includes(".g-titlebar"), false);
  assert.equal(desktop.includes(".g-mobile-app-bar"), false);
  assert.equal(desktop.includes(".g-titlebar"), true);
  assert.match(tauri, /@import[\s\"]+\.\/gardener\.desktop\.min\.css/);
  assert.match(electron, /@import[\s\"]+\.\/gardener\.desktop\.min\.css/);
});

test("default component density follows the compact scale and alerts use contextual styling", async () => {
  const themes = await readFile(resolve(root, "dist/gardener.themes.css"), "utf8");
  const components = await readFile(resolve(root, "dist/gardener.components.css"), "utf8");
  const full = await readFile(resolve(root, "dist/gardener.css"), "utf8");
  assert.match(full, /a,\s*a:any-link\s*\{[^}]*text-decoration:\s*none\s*!important;/u);
  assert.match(full, /a:is\(:hover,\s*:focus-visible,\s*:active,\s*:visited\)\s*\{[^}]*text-decoration:\s*none\s*!important;/u);
  assert.match(themes, /--g-space-control-x:\s*var\(--g-space-3\);[\s\S]*--g-space-control-y:\s*var\(--g-space-1\);/u);
  assert.match(themes, /--g-control-height-sm:\s*1\.75rem;[\s\S]*--g-control-height-md:\s*2rem;[\s\S]*--g-control-height-lg:\s*2\.25rem;[\s\S]*--g-touch-target:\s*2rem;/u);
  assert.match(themes, /--g-select-arrow-size:\s*1rem;[\s\S]*--g-select-arrow-image:\s*url\("data:image\/svg\+xml,[^;]+;[\s\S]*--g-select-arrow-mask:\s*url\("data:image\/svg\+xml,/u);
  assert.match(themes, /--g-component-padding:\s*var\(--g-space-4\);[\s\S]*--g-component-padding-sm:\s*var\(--g-space-3\);[\s\S]*--g-state-min-height:\s*10rem;/u);
  assert.match(themes, /\[data-g-density="compact"\][\s\S]*--g-control-height-sm:\s*1\.5rem;[\s\S]*--g-control-height-md:\s*1\.75rem;[\s\S]*--g-control-height-lg:\s*2rem;/u);
  assert.match(themes, /\[data-g-density="compact"\][\s\S]*--g-component-padding:\s*var\(--g-space-3\);[\s\S]*--g-state-min-height:\s*8rem;/u);
  assert.match(components, /\.g-btn\s*\{[\s\S]*font-size:\s*var\(--g-font-size-sm\);/u);
  assert.match(components, /\.g-btn-primary,\s*\.g-btn-group-primary\s*>\s*\.g-btn\)\s*\{[^}]*--g-btn-bg:\s*var\(--g-btn-solid\);[^}]*--g-btn-color:\s*var\(--g-btn-on-accent\);/u);
  assert.match(components, /\.g-btn-dashed,\s*\.g-btn-group-dashed\s*>\s*\.g-btn\)\s*\{[^}]*border-style:\s*dashed;/u);
  assert.match(components, /\.g-form-summary\s*\{[^}]*border:\s*1px solid var\(--g-color-danger\);/u);
  assert.match(components, /\.g-form\.g-form-horizontal\s*>\s*\.g-field[^}]*grid-template-columns:/u);
  assert.match(components, /\.g-form:is\(\.is-validated,\s*\.was-validated\)\s*\.g-field:has\(:is\(input,\s*textarea,\s*select\):invalid\)/u);
  assert.match(components, /\.g-field\.is-validating\s*\.g-field-feedback::before/u);
  assert.match(components, /\.g-field-horizontal\s*\{[^}]*grid-template-columns:/u);
  assert.match(components, /\.g-field-messages\s*\{[^}]*display:\s*grid;/u);
  assert.match(components, /\.g-field-label-hidden\s*>\s*:is\(\.g-field-header,\s*\.g-field-label\)[^}]*clip-path:\s*inset\(50%\);/u);
  assert.match(components, /\.g-field:is\(\.is-error,\s*\.is-invalid\)\s*\.g-field-messages\s*>\s*\.g-field-help:not\(\.is-persistent\)[^}]*display:\s*none;/u);
  assert.match(components, /\.g-form-section-numbered\s*>\s*\.g-form-section-header[^}]*grid-template-columns:/u);
  assert.match(components, /details\.g-form-section\s*>\s*summary\.g-form-section-header[^}]*list-style:\s*none;/u);
  assert.match(components, /\.g-form-section:is\(\.is-error,\s*\.is-invalid,\s*\[aria-invalid="true"\]\)\s*\.g-form-section-summary/u);
  assert.match(components, /\.g-fieldset-choice-cards\s*>\s*\.g-fieldset-content\s*>\s*:is\(\.g-check,\s*\.g-radio\):has\(input:checked\)[^}]*border-color:\s*var\(--g-color-primary\);/u);
  assert.match(components, /\.g-fieldset-two-columns\s*\{[^}]*--g-fieldset-columns:\s*2;/u);
  assert.match(components, /\.g-fieldset:is\(:disabled,\s*\.is-disabled,\s*\[aria-disabled="true"\]\)[^}]*cursor:\s*not-allowed;/u);
  assert.match(components, /\.g-fieldset\s*>\s*\.g-fieldset\s*\{[^}]*border-style:\s*dashed;/u);
  assert.match(components, /\.g-form-row-three\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/u);
  assert.match(components, /\.g-form-row-split\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*2fr\)\s*minmax\(12rem,\s*1fr\);/u);
  assert.match(components, /\.g-form-row-span-full\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;/u);
  assert.match(components, /@container gardener-form[^}]*[\s\S]*:is\(\.g-form-row-two,\s*\.g-form-row-three,\s*\.g-form-row-four,/u);
  assert.match(components, /\.g-form-grid-three,\s*\.g-form-grid\.is-three\s*\{[^}]*--g-form-columns:\s*3;/u);
  assert.match(components, /\.g-form-grid-twelve\s*\{[^}]*--g-form-columns:\s*12;/u);
  assert.match(components, /\.g-form-grid-span-full\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;/u);
  assert.match(components, /\.g-form-grid-row-span-2\s*\{[^}]*grid-row:\s*span\s*2;/u);
  assert.match(components, /@container gardener-form \(max-width:\s*1023\.98px\)[\s\S]*\.g-form-grid-twelve/u);
  assert.match(components, /\.g-form-horizontal-label-lg\s*\{[^}]*--g-horizontal-label-width:\s*17rem;/u);
  assert.match(components, /\.g-form-horizontal-row\s*\{[^}]*grid-template-columns:\s*minmax\(8rem,\s*var\(--g-horizontal-label-width\)\)\s*minmax\(0,\s*1fr\);/u);
  assert.match(components, /\.g-form-horizontal-actions\s*\{[^}]*grid-column:\s*2;/u);
  assert.match(components, /@container gardener-form \(max-width:\s*767\.98px\)[\s\S]*\.g-form-horizontal-row/u);
  assert.match(components, /\.g-form-inline-field-lg\s*\{[^}]*--g-inline-field-min:\s*18rem;/u);
  assert.match(components, /\.g-form-inline-field-grow\s*\{[^}]*flex-grow:\s*2;/u);
  assert.match(components, /\.g-form-inline-nowrap\s*>\s*:is\(\.g-field,\s*\.g-form-inline-field,\s*\.g-form-inline-control\)\s*\{[^}]*flex-shrink:\s*0;/u);
  assert.match(components, /\.g-form-inline-actions,[^}]*\.g-form-inline\s*>\s*\.g-form-actions\s*\{[^}]*flex:\s*0\s*0\s*auto;/u);
  assert.match(components, /@container gardener-form \(max-width:\s*639\.98px\)[\s\S]*\.g-form-inline\s*>\s*:is\(\.g-field,\s*\.g-form-inline-field/u);
  assert.match(components, /\.g-form-compact-three-columns\s*\{[^}]*--g-compact-columns:\s*3;/u);
  assert.match(components, /\.g-form-compact-tight\s*\{[^}]*--g-compact-control-height:\s*1\.75rem;/u);
  assert.match(components, /\.g-form-compact-inline,[^}]*\.g-form-compact-inline\s*>\s*\.g-compact-form-body\s*\{[^}]*display:\s*flex;/u);
  assert.match(components, /\.g-compact-form-actions,[^}]*\.g-form-compact\s*>\s*\.g-form-actions\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;/u);
  assert.match(components, /\.g-form-actions\s*\{[^}]*--g-form-actions-gap:\s*var\(--g-space-2\);[^}]*display:\s*flex;[^}]*min-inline-size:\s*0;[^}]*flex-wrap:\s*wrap;/u);
  assert.match(components, /\.g-form-actions-main,\s*\.g-form-actions-secondary\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;/u);
  assert.match(components, /\.g-form-actions:is\(\.is-between,\s*\.g-form-actions-between\)\s*\{[^}]*justify-content:\s*space-between;/u);
  assert.match(components, /\.g-form-actions:is\(\.is-sticky,\s*\.g-form-actions-sticky,\s*\.g-form-actions-sticky-bleed\)\s*\{[^}]*position:\s*sticky;[^}]*max\(var\(--g-space-3\),\s*env\(safe-area-inset-bottom\)\);/u);
  assert.match(components, /\.g-form-actions:is\(\.is-busy,\s*\[aria-busy="true"\]\)\s*\.g-form-actions-status::before\s*\{[^}]*animation:\s*g-form-spin/u);
  assert.match(components, /\.g-form-actions\s*>\s*:is\(\.g-form-actions-main,\s*\.g-form-actions-secondary,\s*\.g-form-actions-meta\)\s*\{[^}]*inline-size:\s*100%;[^}]*flex-basis:\s*100%;/u);
  assert.match(components, /\.g-autosave-status\s*\{[^}]*--g-autosave-color:\s*var\(--g-color-text-muted\);[^}]*min-block-size:\s*var\(--g-control-height-sm\);/u);
  assert.match(components, /\.g-autosave-status:is\(\.is-saving,\s*\[data-g-autosave-state="saving"\],\s*\[aria-busy="true"\]\)::before[^}]*animation:\s*g-form-spin/u);
  assert.match(components, /\.g-autosave-status:is\(\.is-saved,\s*\[data-g-autosave-state="saved"\]\)::before[^}]*mask:\s*var\(--g-autosave-saved-icon\)/u);
  assert.match(components, /\.g-autosave-status:is\(\.is-error,\s*\[data-g-autosave-state="error"\]\)\s*\.g-autosave-status-retry\s*\{[^}]*display:\s*inline-flex;/u);
  assert.match(components, /\.g-form-progress\s*\{[^}]*--g-form-progress-value-size:\s*0%;[^}]*container-type:\s*inline-size;[^}]*display:\s*grid;/u);
  assert.match(components, /\.g-form-progress-value\s*\{[^}]*inline-size:\s*clamp\(0%,\s*var\(--g-form-progress,/u);
  assert.match(components, /\.g-form-progress-step:is\(\.is-active,[^}]*\[aria-current="step"\]\)\s*\.g-form-progress-step-marker\s*\{[^}]*box-shadow:/u);
  assert.match(components, /\.g-form-progress:not\(\.g-form-progress-with-steps,\s*\.g-form-progress-vertical-steps\)\s*>\s*\.g-form-progress-steps\s*\{[^}]*display:\s*none;/u);
  assert.match(components, /@container\s*\(max-width:\s*31rem\)[\s\S]*\.g-form-progress-steps\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);/u);
  assert.match(components, /\.g-form-review\s*\{[^}]*--g-form-review-label-width:\s*9rem;[^}]*container:\s*gardener-review\s*\/\s*inline-size;[^}]*display:\s*grid;/u);
  assert.match(components, /\.g-form-review-row\s*\{[^}]*grid-template-columns:\s*minmax\(6rem,\s*var\(--g-form-review-label-width\)\)\s*minmax\(0,\s*1fr\)\s*auto;/u);
  assert.match(components, /\.g-form-review-row:is\(\.is-changed,\s*\[data-g-state="changed"\]\)\s*\{[^}]*border-inline-start:[^}]*background:\s*var\(--g-color-warning-soft\);/u);
  assert.match(components, /\.g-form-review:is\(\.is-read-only,\s*\.g-form-review-read-only\)\s*:is\(\.g-form-review-actions,\s*\.g-form-review-action\)\s*\{[^}]*display:\s*none;/u);
  assert.match(components, /@container gardener-review\s*\(max-width:\s*36rem\)[\s\S]*\.g-form-review-row\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*auto;/u);
  assert.match(components, /\.g-consent-group\s*\{[^}]*container:\s*gardener-consent\s*\/\s*inline-size;[^}]*display:\s*grid;/u);
  assert.match(components, /\.g-consent-group-item\s*\{(?=[^}]*min-block-size:\s*var\(--g-touch-target\);)(?=[^}]*grid-template-columns:\s*auto\s*minmax\(0,\s*1fr\)\s*auto;)[^}]*\}/u);
  assert.match(components, /\.g-consent-group-item:has\(>\s*input:checked\)\s*\{[^}]*border-color:[^}]*background:/u);
  assert.match(components, /\.g-consent-group:is\([^}]*\[aria-invalid="true"\]\)\s+\.g-consent-group-item:has\(>\s*input:required:not\(:checked\)\)\s*\{[^}]*border-color:\s*var\(--g-color-danger\);/u);
  assert.match(components, /\.g-consent-group:is\(\.is-read-only,\s*\.g-consent-group-read-only\)\s+\.g-consent-group-item\s*\{[^}]*pointer-events:\s*none;/u);
  assert.match(components, /@container gardener-consent\s*\(max-width:\s*36rem\)[\s\S]*\.g-consent-group-inline\s+\.g-consent-group-items\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);/u);
  assert.match(components, /\.g-date-picker\s*\{[^}]*container:\s*gardener-date-picker\s*\/\s*inline-size;[^}]*display:\s*grid;[^}]*inline-size:\s*min\(21rem,\s*100%\);/u);
  assert.match(components, /\.g-calendar-grid\s*\{[^}]*grid-template-columns:\s*repeat\(7,\s*minmax\(0,\s*1fr\)\);/u);
  assert.match(components, /\.g-calendar-day:is\(\[aria-selected="true"\],[^}]*background:\s*var\(--g-color-primary\);[^}]*color:\s*var\(--g-color-on-primary\);/u);
  assert.match(components, /\.g-calendar-day:focus-visible\s*\{[^}]*box-shadow:\s*0 0 0 var\(--g-focus-ring-width\) var\(--g-focus-ring\);/u);
  assert.match(components, /@container gardener-date-picker\s*\(max-width:\s*20rem\)[\s\S]*\.g-date-picker-footer\s*\{[^}]*flex-wrap:\s*wrap;/u);
  assert.match(components, /\.g-time-picker\s*\{[^}]*position:\s*relative;[^}]*display:\s*inline-grid;[^}]*container:\s*gardener-time-picker\s*\/\s*inline-size;/u);
  assert.match(components, /\.g-time-picker-control\s*\{[^}]*min-block-size:\s*var\(--g-control-height-md\);[^}]*border:\s*1px solid var\(--g-color-border\);/u);
  assert.match(components, /\.g-time-picker-columns\s*\{[^}]*grid-template-columns:\s*repeat\(var\(--g-time-columns,\s*2\),\s*minmax\(0,\s*1fr\)\);/u);
  assert.match(components, /\.g-time-picker-option:is\(\[aria-selected="true"\],\s*\.is-selected\)\s*\{[^}]*background:\s*var\(--g-color-primary-soft\);[^}]*font-weight:\s*650;/u);
  assert.match(components, /\.g-time-picker-option:focus-visible\s*\{[^}]*box-shadow:\s*inset 0 0 0 var\(--g-focus-ring-width\) var\(--g-color-primary\);/u);
  assert.match(components, /@container gardener-time-picker\s*\(max-width:\s*18rem\)[\s\S]*\.g-time-picker-footer\s*\{[^}]*flex-direction:\s*column;/u);
  assert.match(components, /\.g-pin-input\s*\{[^}]*container:\s*gardener-pin-input\s*\/\s*inline-size;[^}]*display:\s*grid;[^}]*inline-size:\s*min\(22rem,\s*100%\);/u);
  assert.match(components, /\.g-pin-input-cell,[^}]*\.g-pin-input\s*>\s*\.g-input[^}]*\{(?=[^}]*inline-size:\s*var\(--g-pin-input-cell-size\);)(?=[^}]*block-size:\s*var\(--g-pin-input-cell-size\);)(?=[^}]*text-align:\s*center;)[^}]*\}/u);
  assert.match(components, /\.g-pin-input-cell:focus-visible,[^}]*\{[^}]*box-shadow:\s*0 0 0 var\(--g-focus-ring-width\) var\(--g-focus-ring\);/u);
  assert.match(components, /\.g-pin-input\.is-complete\s+:is\([^}]*\)\s*\{[^}]*border-color:\s*var\(--g-color-success\);/u);
  assert.match(components, /@container gardener-pin-input\s*\(max-width:\s*19rem\)[\s\S]*\.g-pin-input-footer\s*\{[^}]*flex-direction:\s*column;/u);
  assert.match(components, /\.g-rating\s*\{[^}]*container:\s*gardener-rating;[^}]*display:\s*inline-grid;/u);
  assert.match(components, /\.g-rating-item::before,\s*\.g-rating-item::after\s*\{[^}]*mask:\s*var\(--g-rating-star\) center \/ contain no-repeat;/u);
  assert.match(components, /\.g-rating-item::after\s*\{[^}]*clip-path:\s*inset\(0 calc\(100% - var\(--g-rating-fill\)\) 0 0\);/u);
  assert.match(components, /@media \(pointer:\s*coarse\)\s*\{\s*\.g-rating-item\s*\{[^}]*var\(--g-touch-target\)/u);
  assert.match(components, /\.g-form-compact\s+\.g-input-group\s*>\s*:where\([^}]*\)\s*\+\s*:where\([^}]*\)\s*\{[^}]*margin-inline-start:\s*-1px;/u);
  assert.match(components, /@container gardener-form \(max-width:\s*639\.98px\)[\s\S]*\.g-form-compact:is\(\.g-form-compact-two-columns,\s*\.g-form-compact-three-columns\)/u);
  assert.match(components, /\.g-btn-round\s*\{[^}]*border-radius:\s*calc\(var\(--g-btn-height\) \/ 2\);/u);
  assert.match(components, /\.g-btn-circle\s*\{[^}]*inline-size:\s*var\(--g-btn-height\);[^}]*border-radius:\s*50%;/u);
  assert.match(components, /\.g-btn-mini,\s*\.g-btn-group-mini\s*>\s*\.g-btn\)\s*\{[^}]*--g-btn-height:\s*1\.5rem;/u);
  assert.match(components, /\.g-btn-medium,\s*\.g-btn-group-medium\s*>\s*\.g-btn\)\s*\{[^}]*--g-btn-height:\s*2rem;/u);
  assert.match(components, /\.g-btn-group\.is-warning\s*>\s*\.g-btn\)\s*\{[^}]*--g-btn-accent:\s*var\(--g-color-warning\);/u);
  assert.match(components, /\.g-btn-group-vertical\s*\{[^}]*flex-direction:\s*column;/u);
  assert.match(components, /\.g-btn-group-block,[^}]*\.g-btn-group-justified[^}]*\)\s*\{[^}]*inline-size:\s*100%;/u);
  assert.match(components, /\.g-btn-group-split\s*>[^}]*\.g-btn-group-trigger[^}]*\{[^}]*inline-size:\s*var\(--g-btn-height\);/u);
  assert.match(components, /\.g-btn-group-toggle\s*>\s*\.g-btn:is\(\[aria-pressed="true"\][^}]*--g-btn-color:\s*var\(--g-btn-on-accent\);/u);
  assert.match(components, /\.g-btn-toolbar\s*\{[^}]*flex-wrap:\s*wrap;[^}]*gap:\s*var\(--g-space-2\);/u);
  assert.match(components, /\.g-input,\s*\.g-textarea,\s*\.g-select\s*\{[\s\S]*font-size:\s*var\(--g-font-size-sm\);/u);
  assert.match(components, /\.g-input-filled,[^}]*\.g-select-filled\)[^}]*background-color:\s*var\(--g-color-surface-subtle\);/u);
  assert.match(components, /\.g-input-underlined,[^}]*\.g-select-underlined\)[^}]*border-width:\s*0 0 var\(--g-border-width\);/u);
  assert.match(components, /\.g-input-mini,[^}]*\.g-select-mini\)[^}]*block-size:\s*var\(--g-control-height-xs\);[^}]*min-block-size:\s*var\(--g-control-height-xs\);/u);
  assert.match(components, /\.g-input-affix\s*\{[^}]*display:\s*flex;[^}]*border:\s*var\(--g-border-width\) solid var\(--g-color-border-strong\);/u);
  assert.match(components, /\.g-input\s*\{[^}]*--g-input-height:\s*var\(--g-control-height-md\);[^}]*border-color:\s*transparent;[^}]*background:\s*var\(--g-color-surface-subtle\);/u);
  assert.match(components, /\.g-input:focus,[^}]*border-color:\s*var\(--g-color-primary\);[^}]*box-shadow:\s*0 0 0 var\(--g-focus-ring-width\) var\(--g-focus-ring\);/u);
  assert.match(components, /\.g-input-mini\s*\{[^}]*--g-input-height:\s*var\(--g-control-height-xs\);/u);
  assert.match(components, /:is\(\.g-input-control,\s*\.g-input-affix\)\s*\{[^}]*background:\s*var\(--g-color-surface-subtle\);/u);
  assert.match(components, /\.g-input-affix:has\(>\s*\.g-input-affix-control\)\s*\{[^}]*display:\s*grid;[^}]*background:\s*transparent;/u);
  assert.match(components, /\.g-input-affix-outlined\s*\{[^}]*--g-input-affix-border:\s*var\(--g-color-border-strong\);/u);
  assert.match(components, /\.g-input-affix-mini\s*\{[^}]*--g-input-affix-height:\s*var\(--g-control-height-xs\);/u);
  assert.match(components, /\.g-input-affix:is\(\.is-error,\s*\.is-invalid,[^}]*--g-input-affix-state:\s*var\(--g-color-danger\);/u);
  assert.match(components, /\.g-search-field-input-wrap\s*\{[^}]*display:\s*flex;[^}]*--g-search-field-border\);/u);
  assert.match(components, /\.g-input-affix-start,\s*\.g-input-affix-end,\s*\.g-search-field\s*>\s*\.g-search-field-icon\s*\{[^}]*position:\s*absolute;[^}]*transform:\s*translateY\(-50%\);/u);
  assert.doesNotMatch(components, /\.g-search-field\s*>\s*\.g-search-field-icon,[^}]*\{[^}]*position:\s*static;/u);
  assert.match(components, /\.g-search-field\s*\{[^}]*--g-search-field-icon-size:\s*1\.25rem;[^}]*--g-search-field-icon-image:\s*url\("data:image\/svg\+xml,/u);
  assert.match(components, /:is\(\.g-search-field\s*>\s*\.g-search-field-icon,[^}]*:not\(:has\(svg\)\)::before\s*\{[^}]*background:\s*currentColor;[^}]*mask:\s*var\(--g-search-field-icon-image\)/u);
  assert.match(components, /\.g-search-field\s*>\s*\.g-search-field-action,[^}]*\{[^}]*font-size:\s*var\(--g-font-size-xs\);/u);
  assert.match(components, /\.g-search-field-button\s*>\s*\.g-input:is\(:focus,\s*:focus-visible\),[^}]*\.g-search-field-input-wrap:focus-within\s*\{[^}]*box-shadow:\s*none;/u);
  assert.match(components, /\.g-search-field-mini\s*\{[^}]*--g-search-field-height:\s*var\(--g-control-height-xs\);/u);
  assert.match(components, /\.g-search-field:is\(\.is-error,\s*\.is-invalid,[^}]*--g-search-field-state:\s*var\(--g-color-danger\);/u);
  assert.match(components, /@container gardener-search-field \(max-width:\s*26rem\)[^{]*\{[^}]*\.g-search-field-responsive\s*>\s*\.g-search-field-control/u);
  assert.match(components, /\.g-character-field\s*\{[^}]*--g-character-control-height:\s*var\(--g-control-height-md\);[^}]*display:\s*grid;/u);
  assert.match(components, /:is\(\.g-character-field,\s*\.g-character-field-control\):has\(>\s*\.g-textarea\)\s*>\s*\.g-character-count\s*\{[^}]*inset-block-start:\s*auto;[^}]*inset-inline-end:\s*var\(--g-space-2\);[^}]*background:\s*transparent;[^}]*transform:\s*none;/u);
  assert.match(components, /\.g-character-field:is\(\.is-over-limit,\s*\.is-invalid,[^}]*--g-character-color:\s*var\(--g-color-danger\);/u);
  assert.match(components, /\.g-validation-state\s*\{[^}]*--g-validation-control-height:\s*var\(--g-control-height-md\);[^}]*display:\s*grid;/u);
  assert.match(components, /\.g-validation-state:where\(\.is-danger,\s*\.is-error,\s*\.is-invalid,[^}]*--g-validation-color:\s*var\(--g-color-danger\);/u);
  assert.match(components, /\.g-validation-state:where\(\.is-validating,[^}]*\.g-validation-icon\s*\{[^}]*animation:\s*g-form-spin \.8s linear infinite;/u);
  assert.match(components, /\.g-check-group\s*\{[^}]*container:\s*gardener-checkbox-group \/ inline-size;/u);
  assert.match(components, /\.g-choice-group-select-all\s*\{[^}]*display:\s*flex;[^}]*border-block-end:\s*1px solid var\(--g-color-border\);/u);
  assert.match(components, /@container gardener-checkbox-group \(max-width:\s*34rem\)[^{]*\{[^}]*\.g-check-group:is\(/u);
  assert.match(components, /\.g-radio-group\s*\{[^}]*container:\s*gardener-radio-group \/ inline-size;/u);
  assert.match(components, /\.g-radio-group-block\s*\{[^}]*inline-size:\s*100%;/u);
  assert.match(components, /@container gardener-radio-group \(max-width:\s*34rem\)[^{]*\{[^}]*\.g-radio-group:is\(/u);
  assert.match(components, /\.g-input-search-button\s*\{[^}]*flex:\s*0 0 auto;[^}]*background:\s*var\(--g-primary-800\);[^}]*color:\s*#fff;[^}]*white-space:\s*nowrap;/u);
  assert.match(components, /\.g-input-group-responsive,[^}]*\.g-input-group-responsive\s*>\s*\.g-input-group-control\s*\{[^}]*flex-wrap:\s*wrap;/u);
  assert.match(components, /\.g-input-group-mini\s*\{[^}]*--g-input-group-height:\s*var\(--g-control-height-xs\);/u);
  assert.match(components, /:is\(\.g-input-addon,\s*\.g-input-prepend,\s*\.g-input-append\)\s*\{[^}]*block-size:\s*var\(--g-input-group-height,[^}]*max-block-size:\s*var\(--g-input-group-height,[^}]*align-self:\s*center;/u);
  assert.match(components, /\.g-input-group\s*>\s*:is\([^}]*\.g-input-search-button\)[^}]*\.g-input-group-control\s*>\s*:is\([^}]*\.g-input-search-button\)\s*\{[^}]*margin-inline-start:\s*-1px;[^}]*border-radius:\s*0;/u);
  assert.match(components, /\.g-input-group-separated,[^}]*\.g-input-group-separated\s*>\s*\.g-input-group-control\s*\{[^}]*gap:\s*var\(--g-space-2\);/u);
  assert.match(components, /\.g-input-group:is\(\.is-error,\s*\.is-invalid,\s*\[aria-invalid="true"\]\)\s*\{[^}]*--g-state-color:\s*var\(--g-color-danger\);/u);
  assert.match(components, /\.g-password-field\s*\{[^}]*display:\s*flex;[^}]*min-block-size:\s*var\(--g-password-field-height\);[^}]*background:\s*var\(--g-color-surface-subtle\);/u);
  assert.match(components, /\.g-password-field\s*>\s*\.g-input\s*\{[^}]*flex:\s*1 1 auto;[^}]*border:\s*0;[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;/u);
  assert.match(components, /\.g-password-field-outlined\s*\{[^}]*border-color:\s*var\(--g-color-border-strong\);[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(components, /\.g-password-field-mini\s*\{[^}]*--g-password-field-height:\s*var\(--g-control-height-xs\);/u);
  assert.match(components, /\.g-password-field-caps\s*\{[^}]*position:\s*absolute;[^}]*background:\s*var\(--g-color-warning-soft\);/u);
  assert.match(components, /\.g-clearable-field\s*\{[^}]*display:\s*flex;[^}]*min-block-size:\s*var\(--g-clearable-field-height\);[^}]*background:\s*var\(--g-color-surface-subtle\);/u);
  assert.match(components, /\.g-clearable-field\s*>\s*:is\(\.g-input,\s*\.g-select\)\s*\{[^}]*flex:\s*1 1 auto;[^}]*border:\s*0;[^}]*background-color:\s*transparent;[^}]*box-shadow:\s*none;/u);
  assert.match(components, /\.g-clearable-field-outlined\s*\{[^}]*border-color:\s*var\(--g-color-border-strong\);[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(components, /\.g-clearable-field-mini\s*\{[^}]*--g-clearable-field-height:\s*var\(--g-control-height-xs\);/u);
  assert.match(components, /\.g-clearable-field-interaction[^}]*opacity:\s*0;[^}]*pointer-events:\s*none;/u);
  assert.match(components, /\.g-clearable-field:has\(> \.g-textarea\)[^}]*display:\s*block;[^}]*border:\s*0;[^}]*background:\s*transparent;/u);
  assert.match(components, /\.g-textarea\s*\{[^}]*--g-textarea-min-rows:\s*3;[^}]*border-color:\s*transparent;[^}]*background:\s*var\(--g-color-surface-subtle\);[^}]*resize:\s*vertical;/u);
  assert.match(components, /\.g-textarea-outlined\s*\{[^}]*border-color:\s*var\(--g-color-border-strong\);[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(components, /\.g-textarea-auto-size,[^}]*\[data-g-auto-resize\][^}]*\{[^}]*overflow-y:\s*hidden;[^}]*field-sizing:\s*content;/u);
  assert.match(components, /\.g-textarea-resize-none,[^}]*resize:\s*none;/u);
  assert.match(components, /\.g-clearable-field:has\(> \.g-textarea\)[^}]*position:\s*relative;[^}]*display:\s*block;/u);
  assert.match(components, /\.g-select\s*\{[^}]*--g-select-height:\s*var\(--g-control-height-md\);[^}]*border-color:\s*transparent;[^}]*background-color:\s*var\(--g-color-surface-subtle\);[^}]*cursor:\s*pointer;/u);
  assert.match(components, /\.g-select\s*\{[^}]*background-image:\s*var\(--g-select-arrow-image\);[^}]*background-position:\s*right var\(--g-control-padding-md\) center;[^}]*background-size:\s*var\(--g-select-arrow-size\);/u);
  assert.match(components, /\.g-select-arrow:empty::before\s*\{[^}]*inline-size:\s*var\(--g-select-arrow-size\);[^}]*mask:\s*var\(--g-select-arrow-mask\) center \/ contain no-repeat;/u);
  assert.match(components, /\.g-select-outlined\s*\{[^}]*border-color:\s*var\(--g-color-border-strong\);[^}]*background-color:\s*var\(--g-color-surface\);/u);
  assert.match(components, /\.g-select-mini\s*\{[^}]*--g-select-height:\s*var\(--g-control-height-xs\);/u);
  assert.match(components, /\.g-select\[multiple\],[^}]*\.g-select\[size\]:not\(\[size="1"\]\)[^}]*min-block-size:\s*8rem;[^}]*background-image:\s*none;/u);
  assert.match(components, /\.g-select-control\s*\{[^}]*display:\s*flex;[^}]*min-block-size:\s*var\(--g-select-control-height\);[^}]*background:\s*var\(--g-color-surface-subtle\);/u);
  assert.match(components, /\.g-select-control\s*>\s*\.g-select\s*\{[^}]*flex:\s*1 1 auto;[^}]*border:\s*0;[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;/u);
  assert.match(components, /\.g-select-spinner\s*\{[^}]*border-block-start-color:\s*var\(--g-color-primary\);[^}]*animation:\s*g-spin/u);
  assert.match(components, /\.g-tree-select\s*>\s*\.g-picker-control\s*\{[^}]*background:\s*var\(--g-color-surface-subtle\);/u);
  assert.match(components, /\.g-picker-arrow:empty::before\s*\{[^}]*inline-size:\s*var\(--g-select-arrow-size\);[^}]*mask:\s*var\(--g-select-arrow-mask\) center \/ contain no-repeat;/u);
  assert.match(components, /\.g-tree-select\s+\.g-tree-node-row\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*1\.5rem 1\.25rem minmax\(0,\s*1fr\) auto;/u);
  assert.match(components, /\.g-tree-select\s+\.g-tree-node\[aria-checked="mixed"\]\s*>\s*\.g-tree-node-row\s+\.g-tree-checkbox::before/u);
  assert.match(components, /\.g-tree-select\s*>\s*\.g-picker-panel\s*\{[^}]*inline-size:\s*max\(100%,\s*min\(28rem,\s*calc\(100vw - 2rem\)\)\);/u);
  assert.match(components, /\.g-check\s*>\s*input,[^}]*\.g-radio\s*>\s*input\s*\{[^}]*appearance:\s*none;[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(components, /\.g-check\s*>\s*input:not\(\[type="radio"\]\):checked::after\s*\{[^}]*border-width:\s*0 2px 2px 0;/u);
  assert.match(components, /\.g-radio\s*>\s*input\):checked::after\s*\{[^}]*border-radius:\s*50%;[^}]*background:\s*currentColor;/u);
  assert.match(components, /\.g-check\s*>\s*input:indeterminate::after,[^}]*aria-checked="mixed"[^}]*inline-size:\s*56%;/u);
  assert.match(components, /:is\(\.g-choice-group-buttons,\s*\.g-check-group-buttons,\s*\.g-radio-group-buttons\)\s*>\s*:is\(\.g-check,\s*\.g-radio\):has\(input:checked\)\s*\{[^}]*background:\s*var\(--g-color-primary-soft\);[^}]*color:\s*var\(--g-color-primary-text\);/u);
  assert.match(components, /:is\(\.g-check-group,\s*\.g-radio-group\):is\(\.g-choice-group-buttons,\s*\.g-check-group-buttons,\s*\.g-radio-group-buttons\)\s*\{[^}]*inline-size:\s*auto;[^}]*flex-wrap:\s*nowrap;[^}]*container-type:\s*normal;/u);
  assert.match(components, /:is\(\.g-choice-group-buttons,\s*\.g-check-group-buttons,\s*\.g-radio-group-buttons\)\s*>\s*:is\(\.g-check,\s*\.g-radio\)\s*\{[^}]*min-inline-size:\s*max-content;[^}]*flex:\s*0 0 auto;[^}]*white-space:\s*nowrap;[^}]*word-break:\s*keep-all;/u);
  assert.match(components, /:is\(\.g-check-group,\s*\.g-radio-group\):is\(\.g-choice-group-grid,\s*\.g-check-group-grid,\s*\.g-radio-group-grid\)\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fit/u);
  assert.match(components, /\.g-switch\s*\{[^}]*--g-switch-track-width:\s*2\.5rem;[^}]*--g-switch-track-height:\s*1\.375rem;[^}]*--g-switch-handle-size:/u);
  assert.match(components, /\.g-switch-track\s*\{[^}]*inline-size:\s*var\(--g-switch-track-width\);[^}]*overflow:\s*hidden;[^}]*border-radius:\s*var\(--g-radius-full\);/u);
  assert.match(components, /\.g-switch\s*>\s*input:checked\s*\+\s*\.g-switch-track\s*\{[^}]*background:\s*var\(--g-switch-on-bg\);[^}]*color:\s*#fff;/u);
  assert.match(components, /\.g-switch\s*>\s*input:focus-visible\s*\+\s*\.g-switch-track\s*\{[^}]*box-shadow:\s*0 0 0 var\(--g-focus-ring-width\) var\(--g-focus-ring\);/u);
  assert.match(components, /\.g-switch-mini\s*\{[^}]*--g-switch-track-width:\s*1\.5rem;[^}]*--g-switch-track-height:\s*\.875rem;/u);
  assert.match(components, /\.g-switch-checked-content,[^}]*\.g-switch-unchecked-content\s*\{[^}]*text-overflow:\s*ellipsis;/u);
  assert.match(components, /\.g-switch\.is-loading\s+\.g-switch-track::before,[^}]*aria-busy="true"[^}]*animation:\s*g-spin/u);
  assert.match(components, /\.g-range\s*\{[^}]*--g-range-track-size:\s*2px;[^}]*--g-range-thumb-size:\s*12px;[^}]*touch-action:\s*pan-y;/u);
  assert.match(components, /\.g-range::-webkit-slider-runnable-track\s*\{[^}]*linear-gradient\(to right,[^}]*var\(--g-range-percent\)/u);
  assert.match(components, /\.g-range::-webkit-slider-thumb\s*\{[^}]*appearance:\s*none;[^}]*border:\s*2px solid var\(--g-range-fill\);/u);
  assert.match(components, /\.g-range-vertical\s*\{[^}]*writing-mode:\s*vertical-lr;[^}]*touch-action:\s*pan-x;/u);
  assert.match(components, /\.g-range-dual\s*\{[^}]*position:\s*relative;[^}]*min-block-size:/u);
  assert.match(components, /\.g-color-input\s*\{[^}]*--g-color-input-size:\s*var\(--g-control-height-md\);[^}]*appearance:\s*none;/u);
  assert.match(components, /\.g-color-preset\s*\{[^}]*background:\s*var\(--g-color-preset,\s*currentColor\);[^}]*cursor:\s*pointer;/u);
  assert.match(components, /\.g-card\s*\{[^}]*--g-card-padding:\s*1rem;[^}]*overflow:\s*hidden;[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(components, /\.g-card-header,\s*\.g-card-body,\s*\.g-card-footer\s*\{[^}]*padding:\s*var\(--g-card-padding\);/u);
  assert.match(components, /\.g-card-extra\s*\{[^}]*text-decoration:\s*none;[^}]*cursor:\s*pointer;/u);
  assert.match(components, /:is\(\.g-card-hoverable,\s*\.g-card-interactive,\s*\.g-card-selectable\):is\(:hover,\s*:focus-within\)[^}]*transform:\s*none;/u);
  assert.match(components, /\.g-card-grid\s*\{[^}]*grid-template-columns:\s*repeat\(var\(--g-card-grid-columns,\s*4\),\s*minmax\(0,\s*1fr\)\);/u);
  assert.match(components, /\.g-card-horizontal\s*\{[^}]*grid-template-columns:/u);
  assert.match(components, /\.g-card:is\(\.is-loading,\s*\[aria-busy="true"\]\)::before\s*\{[^}]*animation:\s*g-spin/u);
  assert.doesNotMatch(components, /\.g-card\s*\{[^}]*box-shadow:/u);
  assert.doesNotMatch(components, /\.g-card-interactive:hover\s*\{[^}]*transform:/u);
  assert.doesNotMatch(components, /\.g-btn:active[^}]*transform:/u);
  assert.match(components, /\.g-empty\s*\{[^}]*min-block-size:\s*0;/u);
  assert.match(components, /\.g-file-drop\s*\{[^}]*min-height:\s*var\(--g-file-drop-min-height,\s*var\(--g-state-min-height\)\);/u);
  assert.doesNotMatch(components, /\.g-file-drop\s*\{[^}]*min-height:\s*(?:9|10|14)rem;/u);
  assert.match(components, /\.g-file-drop-input\s*\{[^}]*position:\s*absolute;[^}]*inline-size:\s*1px;/u);
  assert.match(components, /\.g-file-drop:is\(\.is-dragging,\s*\[data-g-state="dragging"\]\)/u);
  assert.match(components, /\.g-file-drop-compact\s*\{[^}]*grid-template-columns:\s*auto\s+minmax\(0,\s*1fr\)\s+auto;/u);
  assert.match(components, /\.g-file-drop-list\s*\{[^}]*display:\s*grid;/u);
  assert.match(components, /\.g-file-drop-item\s*\{[^}]*grid-template-columns:\s*auto\s+minmax\(0,\s*1fr\)\s+auto;/u);
  assert.match(components, /\.g-file-drop-progress-bar\s*\{[^}]*inline-size:\s*var\(--g-file-progress,\s*var\(--g-progress,\s*0%\)\);/u);
  assert.match(components, /\.g-combobox\s*\{[^}]*--g-combobox-height:\s*var\(--g-control-height-md\);[^}]*inline-size:\s*var\(--g-combobox-width,\s*100%\);/u);
  assert.match(components, /\.g-combobox-control\s*\{[^}]*min-block-size:\s*var\(--g-combobox-height\);[^}]*background:\s*var\(--g-color-surface-subtle\);/u);
  assert.match(components, /\.g-combobox-input\s*\{[^}]*flex:\s*1 1 auto;[^}]*border:\s*0;/u);
  assert.match(components, /\.g-combobox-toggle::before\s*\{[^}]*inline-size:\s*var\(--g-select-arrow-size\);[^}]*mask:\s*var\(--g-select-arrow-mask\) center \/ contain no-repeat;/u);
  assert.match(components, /\.g-combobox-list\s*\{[^}]*max-block-size:\s*var\(--g-combobox-list-max-height,\s*18rem\);[^}]*overscroll-behavior:\s*contain;/u);
  assert.match(components, /\.g-combobox-option:is\(:hover,\s*\.is-active\)\s*\{[^}]*background:\s*var\(--g-color-surface-hover\);/u);
  assert.match(components, /\.g-combobox-option\[aria-selected="true"\]::after\s*\{[^}]*transform:[^}]*rotate\(45deg\);/u);
  assert.match(components, /\.g-combobox:is\(\.is-loading,\s*\[aria-busy="true"\],\s*\[data-g-loading="true"\]\)/u);
  assert.match(components, /\.g-alert\s*\{[^}]*border:\s*1px solid var\(--g-alert-border\);[^}]*background:\s*var\(--g-alert-background\);[^}]*color:\s*var\(--g-alert-content-color\);/u);
  assert.match(components, /\.g-alert:not\(:has\(> \.g-alert-icon\)\)::before\s*\{[^}]*mask:\s*var\(--g-alert-icon-image\)/u);
  assert.match(components, /:is\(\.g-alert-info,\s*\.g-alert\.is-info\)/u);
  assert.match(components, /\.g-toast-region\s*\{[^}]*inset-inline:\s*0;[^}]*align-items:\s*center;[^}]*text-align:\s*center;/u);
  assert.match(components, /\.g-toast\s*\{[^}]*display:\s*inline-flex;[^}]*border:\s*1px solid var\(--g-color-border\);[^}]*background:\s*var\(--g-color-surface-raised\);[^}]*box-shadow:\s*var\(--g-shadow-md\);/u);
  assert.match(components, /\.g-toast:not\(\.g-toast-no-icon\):not\(:has\(> \.g-toast-icon\)\)::before\s*\{[^}]*mask:\s*var\(--g-toast-icon-image\)/u);
  assert.match(components, /:is\(\.g-toast-danger,\s*\.g-toast-error,/u);
  assert.doesNotMatch(components, /\.g-toast\s*\{[^}]*border-inline-start:/u);
  assert.match(components, /\.g-toast-region-bottom\s*\{[^}]*inset-block-end:/u);
  assert.match(components, /\.g-toast-loading[^}]*g-toast-spin/u);
  assert.match(components, /\.g-toast-action\s*\{/u);
  assert.match(components, /\.g-tip\s*\{[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(components, /\.g-callout,\s*\.g-note\s*\{[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(components, /\.g-switch-row\s*\{[^}]*inline-size:\s*100%;[^}]*max-inline-size:\s*100%;[^}]*min-block-size:\s*calc\(var\(--g-control-height-lg\) \+ var\(--g-space-3\)\);[^}]*padding-block:\s*var\(--g-space-3\);/u);
  assert.match(components, /\.g-switch-row-card\s*\{[^}]*min-block-size:\s*5\.5rem;[^}]*box-shadow:\s*var\(--g-shadow-xs\);/u);
  assert.match(components, /\.g-switch-row-control\s*\{[^}]*display:\s*inline-flex;[^}]*min-inline-size:\s*max-content;[^}]*align-items:\s*center;/u);
  assert.match(components, /@container gardener-switch-row \(max-width:\s*24rem\)[^{]*\{[^}]*\.g-switch-row-meta/u);
  assert.match(components, /\.g-choice-card:has\(input:checked\)\s*\{[^}]*border-color:\s*var\(--g-color-primary\);[^}]*background:\s*var\(--g-color-primary-soft\);/u);
  assert.match(components, /\.g-choice-group\s*\{[^}]*container:\s*gardener-choice-group \/ inline-size;/u);
  assert.match(components, /\.g-choice-card:has\(input:focus-visible\)\s*\{[^}]*box-shadow:\s*0 0 0 var\(--g-focus-ring-width\) var\(--g-focus-ring\);/u);
  assert.match(components, /@container gardener-choice-group \(max-width:\s*28rem\)[^{]*\{[^}]*\.g-choice-group:is\(/u);
  assert.match(components, /\.g-name-group\s*\{[^}]*container:\s*gardener-name-group \/ inline-size;/u);
  assert.match(components, /\.g-name-display,\s*\.g-name-phonetic,\s*\.g-name-preferred\s*\{[^}]*grid-column:\s*1 \/ -1;/u);
  assert.match(components, /@container gardener-name-group \(max-width:\s*34rem\)[^{]*\{[^}]*\.g-name-group/u);
  assert.match(components, /\.g-address-group\s*\{[^}]*container:\s*gardener-address-group \/ inline-size;/u);
  assert.match(components, /\.g-address-city\s*\{[^}]*grid-column:\s*span 5;/u);
  assert.match(components, /@container gardener-address-group \(max-width:\s*30rem\)[^{]*\{[^}]*\.g-address-group/u);
  assert.match(components, /\.g-phone-group\s*\{[^}]*container:\s*gardener-phone-group \/ inline-size;/u);
  assert.match(components, /\.g-phone-national\s*\{[^}]*grid-column:\s*span 5;/u);
  assert.match(components, /@container gardener-phone-group \(max-width:\s*26rem\)[^{]*\{[^}]*\.g-phone-group/u);
  assert.match(components, /\.g-money-group\s*\{[^}]*container:\s*gardener-money-group \/ inline-size;/u);
  assert.match(components, /\.g-money-control\s*\{[^}]*display:\s*flex;/u);
  assert.match(components, /\.g-money-symbol\s*\{[^}]*block-size:\s*var\(--g-control-height-md\);[^}]*max-block-size:\s*var\(--g-control-height-md\);[^}]*align-self:\s*center;/u);
  assert.match(components, /@container gardener-money-group \(max-width:\s*24rem\)[^{]*\{[^}]*\.g-money-group/u);
  assert.match(components, /\.g-date-range-group\s*\{[^}]*container:\s*gardener-date-range \/ inline-size;/u);
  assert.match(components, /\.g-date-range-duration\s*\{[^}]*font-variant-numeric:\s*tabular-nums;/u);
  assert.match(components, /@container gardener-date-range \(max-width:\s*30rem\)[^{]*\{[^}]*\.g-date-range-group/u);
  assert.match(components, /\.g-page-header-title\s*\{[^}]*var\(--g-font-size-3xl\)/u);
  assert.match(components, /\.g-context-bar\s*\{[^}]*--g-context-bg:\s*var\(--g-color-surface\);[^}]*background:\s*var\(--g-context-bg\);/u);
  assert.match(full, /\.g-auth-notice\s*\{[^}]*border-inline-start:\s*4px solid var\(--g-auth-notice-accent\);[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.doesNotMatch(full, /\.g-auth-choice\[aria-selected="true"\][^}]*box-shadow:/u);
  assert.match(full, /\.g-security-alert\s*\{[^}]*border:\s*1px solid color-mix\([^}]*background:\s*var\(--g-color-warning-soft\);[^}]*color:\s*var\(--g-color-warning\);/u);
  assert.match(full, /\.g-security-alert:not\(:has\(> \.g-security-alert-icon\)\)::before\s*\{[^}]*mask:\s*var\(--g-security-alert-icon\)/u);
  assert.match(full, /\.g-validation-summary\s*\{[^}]*container:\s*gardener-validation-summary \/ inline-size;[^}]*border-inline-start:\s*4px solid var\(--g-color-danger\);/u);
  assert.match(full, /\.g-validation-summary-link\s*\{[^}]*grid-template-columns:\s*minmax\(6rem,\s*\.34fr\) minmax\(0,\s*1fr\);/u);
  assert.match(full, /@container gardener-validation-summary \(max-width:\s*32rem\)[^{]*\{[^}]*\.g-validation-summary/u);
  assert.match(full, /@media \(forced-colors:\s*active\)[^{]*\{[^}]*\.g-validation-summary/u);
  assert.match(full, /\.g-selection-summary\s*\{[^}]*border-inline-start:\s*3px solid var\(--g-color-primary\);[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(full, /\.g-bulk-confirmation\s*\{[^}]*border-inline-start:\s*4px solid var\(--g-color-warning\);[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(full, /\.g-approval\s*\{[^}]*border-inline-start:\s*4px solid var\(--g-color-warning\);[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(full, /\.g-feature-hint\s*\{[^}]*border-inline-start:\s*4px solid var\(--g-color-primary\);[^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(full, /\.g-industry-alert\s*\{[^}]*border:\s*1px solid color-mix\([^}]*background:\s*var\(--g-color-warning-soft\);[^}]*color:\s*var\(--g-color-warning\);/u);
  assert.match(full, /\.g-industry-alert:not\(:has\(> \.g-industry-alert-icon\)\)::before\s*\{[^}]*mask:\s*var\(--g-industry-alert-icon\)/u);
  assert.match(components, /:is\(\.g-page-state,[^}]*\)\s*\{[^}]*min-block-size:\s*var\(--g-page-state-min,\s*0\);/u);
  assert.match(components, /\.g-tabs-card\s+\.g-tab\[aria-selected="true"\][^}]*background:\s*var\(--g-color-surface\);/u);
  assert.match(components, /\.g-table-bordered th,\s*\.g-table-bordered td[^}]*border-inline-end:\s*1px solid var\(--g-color-border\);/u);
  assert.match(components, /\.g-table-responsive-stack td::before[^}]*content:\s*attr\(data-label\);/u);
  assert.match(components, /\.g-dialog-fullscreen[^}]*height:\s*100dvh;[^}]*border-radius:\s*0;/u);
  assert.match(components, /\.g-accordion-card[^}]*border:\s*1px solid var\(--g-color-border\);/u);
  assert.match(components, /\.g-calendar-day\.is-today[^}]*box-shadow:\s*inset 0 0 0 1px var\(--g-color-primary\);/u);
  assert.match(components, /\.g-carousel:is\(:hover,\s*:focus-within\) \.g-carousel-control[^}]*opacity:\s*1;/u);
  assert.match(components, /Shared component language/u);
  assert.match(components, /\.g-page-state-visual\s*\{[^}]*var\(--g-page-state-visual-size,\s*45px\)/u);
  assert.match(components, /\.g-page-state-404,[^}]*--g-page-state-icon:\s*url\("data:image\/svg\+xml,[^}]*%3Ccircle cx='20' cy='20' r='12'[^}]*M16 17a4\.5 4\.5 0 0 1 8\.5 2c\.8 3\.7-4\.5 4\.4-4\.5 7\.5V28m0 3v\.5/u);
  assert.match(components, /\.is-sticky-columns[^}]*:first-child\s*\{[^}]*position:\s*sticky;[^}]*inset-inline-start:\s*0;/u);
  assert.match(components, /\.is-sticky-columns[^}]*:last-child\s*\{[^}]*position:\s*sticky;[^}]*inset-inline-end:\s*0;/u);
  assert.match(components, /\.is-sticky-columns[^}]*\.can-scroll-start[^}]*:first-child\s*\{[^}]*box-shadow:/u);
  assert.match(components, /\.is-sticky-columns[^}]*\.can-scroll-end[^}]*:last-child\s*\{[^}]*box-shadow:/u);
  assert.doesNotMatch(components, /\.g-(?:page-header|form-actions|sticky-actions)\.is-sticky\s*\{[^}]*backdrop-filter:/u);
});

test("every component pack artifact exists and stays within its recorded budget metrics", async () => {
  const catalog = await readJson("dist/gardener.builds.json");
  const sources = {};
  for (const pack of catalog.componentPacks) {
    const bytes = (await readFile(resolve(root, "dist", pack.minCss))).byteLength;
    assert.equal(bytes, pack.metrics.raw, `${pack.name} raw metric must match its artifact`);
    assert.ok(bytes > 0);
    sources[pack.name] = (await Promise.all(pack.files.map((file) => readFile(resolve(root, "src", file), "utf8")))).join("\n");
  }
  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hasSignature = (source, signature) => signature.startsWith(".")
    ? new RegExp(`${escapeRegex(signature)}(?![A-Za-z0-9_-])`, "u").test(source)
    : new RegExp(`\\[${escapeRegex(signature.slice(1, -1))}(?![A-Za-z0-9-])`, "u").test(source);
  const fallbackOnly = [];
  for (const [component, signatures] of Object.entries(catalog.componentSignatures)) {
    const directPacks = Object.keys(sources).filter((pack) => signatures.some((signature) => hasSignature(sources[pack], signature)));
    if (directPacks.length) assert.deepEqual(catalog.componentOwnership[component], directPacks, `${component} ownership must follow its implemented selector signatures`);
    else fallbackOnly.push(component);
  }
  assert.deepEqual(fallbackOnly, []);
});

test("custom component and platform builds resolve ownership, adapters, and schema", async () => {
  const pkg = await readJson("package.json");
  const temporary = await mkdtemp(join(tmpdir(), "gardener-build-"));
  try {
    const output = join(temporary, "account-ui");
    const result = spawnSync(process.execPath, ["scripts/build-custom.mjs", "--components", "alert,alert,dialog,page-header,date-picker", "--out", output], {
      cwd: root,
      encoding: "utf8",
      windowsHide: true,
    });
    assert.equal(result.status, 0, result.stderr);
    const manifest = JSON.parse(await readFile(`${output}.json`, "utf8"));
    const css = await readFile(`${output}.css`, "utf8");
    const minCss = await readFile(`${output}.min.css`, "utf8");
    assert.deepEqual(manifest.requestedComponents, ["alert", "dialog", "page-header", "date-picker"]);
    assert.ok(manifest.resolvedPacks.includes("basic"));
    assert.ok(manifest.resolvedPacks.includes("feedback"));
    assert.ok(manifest.resolvedPacks.includes("page"));
    assert.ok(manifest.resolvedPacks.includes("extended"));
    assert.equal(manifest.includeUtilities, false);
    assert.ok(css.includes(".g-alert"));
    assert.ok(css.includes(".g-dialog"));
    assert.ok(css.includes(".g-page-header"));
    assert.ok(css.includes(".g-date-picker"));
    assert.ok(minCss.length < css.length);
    assert.equal(manifest.sourceMap, "account-ui.min.css.map");
    assert.equal(JSON.parse(await readFile(`${output}.min.css.map`, "utf8")).version, 3);
    for (const [file, integrity] of Object.entries(manifest.outputIntegrity)) {
      assert.deepEqual(integrity, contentIntegrity(await readFile(resolve(temporary, file))), `${file} custom integrity must match its bytes`);
    }

    const ajv = new Ajv2020({ strict: true, allErrors: true });
    ajv.addSchema(await readJson("metadata/builds.schema.json"));
    const schema = await readJson("metadata/custom-build.schema.json");
    const validate = ajv.compile(schema);
    assert.equal(validate(manifest), true, ajv.errorsText(validate.errors));

    const platformExpectations = {
      web: { include: ".g-btn", exclude: [".g-mobile-app-bar", ".g-titlebar"], adapters: [] },
      mobile: { include: ".g-mobile-app-bar", exclude: [".g-titlebar"], adapters: [] },
      desktop: { include: ".g-titlebar", exclude: [".g-mobile-app-bar"], adapters: [] },
      tauri: { include: ".g-titlebar", exclude: [".g-mobile-app-bar"], adapters: ["gardener.tauri.min.js"] },
      electron: { include: ".g-titlebar", exclude: [".g-mobile-app-bar"], adapters: ["gardener.electron.min.js"] },
    };
    for (const [platform, expectation] of Object.entries(platformExpectations)) {
      const platformOutput = join(temporary, `${platform}-app`);
      const platformResult = spawnSync(process.execPath, ["scripts/build-custom.mjs", "--platform", platform, "--no-utilities", "--out", platformOutput], {
        cwd: root,
        encoding: "utf8",
        windowsHide: true,
      });
      assert.equal(platformResult.status, 0, platformResult.stderr);
      const platformManifest = JSON.parse(await readFile(`${platformOutput}.json`, "utf8"));
      const platformCss = await readFile(`${platformOutput}.css`, "utf8");
      assert.equal(platformManifest.kind, "platform");
      assert.equal(platformManifest.platform, platform);
      assert.equal(platformManifest.includeUtilities, false);
      assert.deepEqual(platformManifest.adapters, expectation.adapters);
      assert.equal(validate(platformManifest), true, ajv.errorsText(validate.errors));
      assert.ok(platformCss.includes(expectation.include), `${platform} custom build must include its platform styles`);
      for (const selector of expectation.exclude) assert.equal(platformCss.includes(selector), false, `${platform} custom build leaks ${selector}`);
      assert.equal(JSON.parse(await readFile(`${platformOutput}.min.css.map`, "utf8")).version, 3);
      for (const adapter of expectation.adapters) assert.ok((await readFile(join(temporary, adapter), "utf8")).includes(`Gardenerim v${pkg.version}`));
      for (const [file, integrity] of Object.entries(platformManifest.outputIntegrity)) {
        assert.deepEqual(integrity, contentIntegrity(await readFile(resolve(temporary, file))), `${platform}/${file} integrity must match its bytes`);
      }
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("custom builds reject unknown components without emitting output", () => {
  for (const [args, message] of [
    [["--components", "missing-component"], /Unknown component: missing-component/],
    [["--components"], /Missing value for --components/],
    [["--components", "button", "--utilities", "--no-utilities"], /Use either --utilities or --no-utilities/],
    [["--components", "button", "--unexpected"], /Unknown option: --unexpected/],
  ]) {
    const result = spawnSync(process.execPath, ["scripts/build-custom.mjs", ...args], {
      cwd: root,
      encoding: "utf8",
      windowsHide: true,
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
  }
});

test("published raw, gzip, brotli, ratio, and package budgets all pass", async () => {
  const report = await readJson("dist/gardener.performance.json");
  const budget = await readJson("config/performance-budgets.json");
  assert.equal(report.version, "2.2.0");
  assert.equal(report.status, "passed");
  assert.equal(Object.keys(report.artifacts).length, 42);
  assert.deepEqual(report.compression, { gzipLevel: 9, brotliQuality: 11 });
  assert.ok(Object.values(report.artifacts).every(({ pass }) => pass));
  assert.ok(Object.values(report.ratios).every(({ pass }) => pass));
  assert.equal(report.package.pass, true);
  assert.deepEqual(report.package.rounding, { packedQuantum: 4096, unpackedQuantum: 65536 });
  assert.equal(report.regressions.baselineVersion, "2.0.0");
  assert.equal(budget.baseline.version, "2.0.0");
  assert.deepEqual(budget.baseline.artifactAliases, {});
  assert.deepEqual(Object.keys(budget.baseline.artifacts), Object.keys(report.artifacts));
  assert.equal(report.regressions.pass, true);
  assert.equal(Object.keys(report.regressions.artifacts).length, 42);
  assert.equal(report.regressions.artifacts["platforms/gardener.tauri.min.css"].baselineArtifact, "platforms/gardener.tauri.min.css");
  assert.equal(report.regressions.artifacts["platforms/gardener.electron.min.css"].baselineArtifact, "platforms/gardener.electron.min.css");
  assert.ok(Object.entries(report.regressions.artifacts).every(([name, regression]) => regression.baselineArtifact === name));
  assert.ok(Object.values(report.regressions.artifacts).every(({ pass }) => pass));
  assert.equal(report.regressions.package.pass, true);
});

test("consecutive formal builds are byte-for-byte reproducible", () => {
  const result = spawnSync(process.execPath, ["scripts/verify-reproducible.mjs"], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Reproducible build passed:/);
});

test("release metadata, declarations, support policy, and compatibility baseline are complete", async () => {
  const pkg = await readJson("package.json");
  const publicApi = await readJson("metadata/public-api.json");
  const compatibility = await readJson("dist/gardener.compatibility.json");
  const runtimeTypes = await readFile(resolve(root, "dist/gardener.d.ts"), "utf8");
  assert.equal(pkg.version, "2.2.0");
  assert.equal(publicApi.status, "stable");
  const declaredEntrypoints = new Set([
    ...publicApi.css.entrypoints,
    ...publicApi.metadata.entrypoints,
    ...publicApi.metadata.schemaEntrypoints,
    ...publicApi.build.entrypoints,
    ...publicApi.javascript.adapters.map(({ entrypoint }) => entrypoint),
    publicApi.build.componentPackPattern,
    publicApi.compatibility.baselineEntrypoint,
    publicApi.compatibility.schemaEntrypoint,
  ]);
  assert.deepEqual([...declaredEntrypoints].sort(), Object.keys(pkg.exports).sort());
  assert.equal(pkg.types, "./dist/gardener.d.ts");
  assert.equal(pkg.style, "./dist/gardener.css");
  assert.equal(pkg.engines.node, ">=18.18");
  assert.equal(pkg.publishConfig.provenance, true);
  assert.ok(pkg.sideEffects.includes("dist/gardener.runtime.js"));
  assert.equal(compatibility.version, "2.2.0");
  assert.equal(compatibility.baselineVersion, "0.9.0");
  assert.equal(compatibility.policy.stage, "stable");
  assert.equal(Object.values(compatibility.baseline).reduce((sum, values) => sum + values.length, 0), 1145);
  assert.deepEqual(compatibility.baseline.packageEntrypoints, Object.keys(pkg.exports));
  assert.ok(compatibility.baseline.componentNames.length >= 506);
  assert.match(runtimeTypes, /export type GardenerimBehaviorName/);
  assert.ok(runtimeTypes.includes(`readonly version: "${pkg.version}"`));
  assert.ok((await readFile(resolve(root, "dist/gardener.tauri.d.ts"), "utf8")).includes("bindTauriWindowControls"));
  assert.ok((await readFile(resolve(root, "dist/gardener.electron.d.ts"), "utf8")).includes("bindElectronWindowControls"));
});

test("the packed npm artifact installs and resolves every targeted public entrypoint", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "gardener-consumer-"));
  try {
    const npmCommand = process.platform === "win32" ? (process.env.ComSpec || process.env.COMSPEC || "cmd.exe") : "npm";
    const quoteCmd = (argument) => /[\s"&|<>^]/u.test(argument) ? `"${argument.replaceAll('"', '""')}"` : argument;
    const runNpm = (npmArguments, cwd = root) => spawnSync(npmCommand, process.platform === "win32"
      ? ["/d", "/c", `npm ${npmArguments.map(quoteCmd).join(" ")}`]
      : npmArguments, {
      cwd,
      encoding: "utf8",
      windowsHide: true,
    });
    const packed = runNpm(["pack", "--json", "--pack-destination", temporary]);
    assert.equal(packed.status, 0, `${packed.stderr}\n${packed.stdout}`);
    const tarball = resolve(temporary, JSON.parse(packed.stdout)[0].filename);
    await writeFile(resolve(temporary, "package.json"), `${JSON.stringify({ private: true, type: "module" })}\n`);
    const installed = runNpm(["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball], temporary);
    assert.equal(installed.status, 0, installed.stderr);
    const catalog = await readJson("dist/gardener.builds.json");
    const platformExpectations = {
      web: { include: ".g-btn", exclude: [".g-mobile-app-bar", ".g-titlebar"] },
      mobile: { include: ".g-mobile-app-bar", exclude: [".g-titlebar"] },
      desktop: { include: ".g-titlebar", exclude: [".g-mobile-app-bar"] },
      tauri: { include: ".g-titlebar", exclude: [".g-mobile-app-bar"] },
      electron: { include: ".g-titlebar", exclude: [".g-mobile-app-bar"] },
    };
    for (const [platform, expectation] of Object.entries(platformExpectations)) {
      const entry = resolve(temporary, `${platform}.css`);
      const output = resolve(temporary, `${platform}.bundle.css`);
      await writeFile(entry, `@import "@gardenerim/css/platform/${platform}.css";\n`);
      await buildWithEsbuild({ absWorkingDir: temporary, entryPoints: [entry], bundle: true, outfile: output, logLevel: "silent" });
      const css = await readFile(output, "utf8");
      assert.ok(css.includes(expectation.include), `${platform} package CSS must bundle its platform styles`);
      for (const selector of expectation.exclude) assert.equal(css.includes(selector), false, `${platform} package CSS leaks ${selector}`);
      assert.equal(/@import\s/u.test(css), false, `${platform} package CSS must resolve nested imports`);
    }
    const componentEntry = resolve(temporary, "auth-component.css");
    const componentOutput = resolve(temporary, "auth-component.bundle.css");
    await writeFile(componentEntry, '@import "@gardenerim/css/component/auth-compositions.css";\n');
    await buildWithEsbuild({ absWorkingDir: temporary, entryPoints: [componentEntry], bundle: true, outfile: componentOutput, logLevel: "silent" });
    const componentCss = await readFile(componentOutput, "utf8");
    assert.ok(componentCss.includes(".g-sign-in"));
    assert.equal(componentCss.includes(".g-titlebar"), false);
    assert.equal(componentCss.includes(".g-mobile-app-bar"), false);
    const specifiers = [
      "@gardenerim/css",
      ...catalog.componentPacks.flatMap(({ name }) => [`@gardenerim/css/component/${name}`, `@gardenerim/css/component/${name}.css`]),
      ...["web", "mobile", "desktop", "tauri", "electron"].map((name) => `@gardenerim/css/platform/${name}.css`),
      "@gardenerim/css/builds",
      "@gardenerim/css/performance",
      "@gardenerim/css/compatibility",
      "@gardenerim/css/schema/compatibility",
      "@gardenerim/css/package.json",
      "@gardenerim/css/runtime",
      "@gardenerim/css/runtime.js",
      "@gardenerim/css/runtime.min.js",
      "@gardenerim/css/tauri.min.js",
      "@gardenerim/css/electron.min.js",
    ];
    await writeFile(resolve(temporary, "smoke.mjs"), `const runtime = await import("@gardenerim/css");\nif (runtime.Gardenerim.version !== "2.2.0") throw new Error("runtime version mismatch");\nfor (const specifier of ${JSON.stringify(specifiers)}) import.meta.resolve(specifier);\nconsole.log("resolved ${specifiers.length} entrypoints");\n`);
    const smoke = spawnSync(process.execPath, ["smoke.mjs"], { cwd: temporary, encoding: "utf8", windowsHide: true });
    assert.equal(smoke.status, 0, smoke.stderr);
    assert.match(smoke.stdout, new RegExp(`resolved ${specifiers.length} entrypoints`));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
