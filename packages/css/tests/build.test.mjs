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

test("2.0.0 build catalog covers every platform, pack, component, and integrity record", async () => {
  const catalog = await readJson("dist/gardener.builds.json");
  const components = await readJson("metadata/components.json");
  const pkg = await readJson("package.json");
  assert.equal(catalog.version, "2.0.0");
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
  const runtime = await import(`${pathToFileURL(resolve(root, "dist/gardener.runtime.min.js"))}?test=2.0.0`);
  assert.equal(runtime.Gardenerim.version, "2.0.0");
  assert.equal(Object.keys(runtime).length, 9);
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
  assert.deepEqual(fallbackOnly, ["copy-action", "fullscreen-action"]);
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
  assert.equal(report.version, "2.0.0");
  assert.equal(report.status, "passed");
  assert.equal(Object.keys(report.artifacts).length, 42);
  assert.deepEqual(report.compression, { gzipLevel: 9, brotliQuality: 11 });
  assert.ok(Object.values(report.artifacts).every(({ pass }) => pass));
  assert.ok(Object.values(report.ratios).every(({ pass }) => pass));
  assert.equal(report.package.pass, true);
  assert.deepEqual(report.package.rounding, { packedQuantum: 4096, unpackedQuantum: 65536 });
  assert.equal(report.regressions.baselineVersion, "0.9.0");
  assert.equal(budget.baseline.version, "0.9.0");
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
  assert.equal(pkg.version, "2.0.0");
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
  assert.equal(compatibility.version, "2.0.0");
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
    await writeFile(resolve(temporary, "smoke.mjs"), `const runtime = await import("@gardenerim/css");\nif (runtime.Gardenerim.version !== "2.0.0") throw new Error("runtime version mismatch");\nfor (const specifier of ${JSON.stringify(specifiers)}) import.meta.resolve(specifier);\nconsole.log("resolved ${specifiers.length} entrypoints");\n`);
    const smoke = spawnSync(process.execPath, ["smoke.mjs"], { cwd: temporary, encoding: "utf8", windowsHide: true });
    assert.equal(smoke.status, 0, smoke.stderr);
    assert.match(smoke.stdout, new RegExp(`resolved ${specifiers.length} entrypoints`));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
