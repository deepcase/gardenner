import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { byteMetrics, compression } from "./lib/build-tools.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const budget = JSON.parse(await readFile(join(root, "config/performance-budgets.json"), "utf8"));
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const errors = [];
const artifacts = {};
const artifactRegressions = {};

const growthPercent = (actual, baseline) => ((actual - baseline) / baseline) * 100;

if (budget.version !== pkg.version) errors.push(`budget version ${budget.version} must equal package version ${pkg.version}`);
if (JSON.stringify(budget.compression) !== JSON.stringify(compression)) errors.push("performance budget compression settings must match the build metrics implementation");
if (budget.baseline.version === pkg.version) errors.push("performance baseline must describe a previous release, not the current package version");
for (const file of Object.keys(budget.artifacts)) {
  const baselineFile = budget.baseline.artifactAliases[file] || file;
  if (!budget.baseline.artifacts[baselineFile]) errors.push(`performance baseline is missing ${file} (resolved as ${baselineFile})`);
}
for (const [file, baselineFile] of Object.entries(budget.baseline.artifactAliases)) {
  if (!budget.artifacts[file]) errors.push(`performance baseline alias references unknown current artifact: ${file}`);
  if (!budget.baseline.artifacts[baselineFile]) errors.push(`performance baseline alias references unknown baseline artifact: ${baselineFile}`);
}
const resolvedBaselineArtifacts = new Set(Object.keys(budget.artifacts).map((file) => budget.baseline.artifactAliases[file] || file));
for (const file of Object.keys(budget.baseline.artifacts)) {
  if (!resolvedBaselineArtifacts.has(file)) errors.push(`performance baseline contains an unused artifact: ${file}`);
}
if (pkg.version === "2.1.0" && budget.baseline.version !== "2.0.0") errors.push("2.1.0 performance budgets must use the released 2.0.0 measurements as the adjacent baseline");
if (pkg.version === "2.1.0" && Object.keys(budget.baseline.artifactAliases).length) errors.push("2.1.0 requires direct 2.0.0 baselines for every formal artifact");
for (const [file, limits] of Object.entries(budget.artifacts)) {
  const metrics = byteMetrics(await readFile(join(dist, file)), budget.compression);
  artifacts[file] = { limits, actual: metrics, pass: true };
  for (const encoding of ["raw", "gzip", "brotli"]) {
    if (metrics[encoding] > limits[encoding]) {
      artifacts[file].pass = false;
      errors.push(`${file} ${encoding}: ${metrics[encoding]} > ${limits[encoding]}`);
    }
  }
  const baselineArtifact = budget.baseline.artifactAliases[file] || file;
  const baseline = budget.baseline.artifacts[baselineArtifact];
  if (!baseline) continue;
  const growth = Object.fromEntries(["raw", "gzip", "brotli"].map((encoding) => [encoding, growthPercent(metrics[encoding], baseline[encoding])]));
  const growthLimits = budget.baseline.maxGrowthPercent.artifactOverrides?.[file] || budget.baseline.maxGrowthPercent.artifacts;
  const regressionPass = Object.entries(growth).map(([encoding, actual]) => {
    const pass = actual <= growthLimits[encoding];
    if (!pass) errors.push(`${file} ${encoding} regression: ${actual.toFixed(3)}% > ${growthLimits[encoding]}%`);
    return pass;
  }).every(Boolean);
  artifactRegressions[file] = {
    baselineArtifact,
    baseline,
    actual: metrics,
    growthPercent: growth,
    limits: growthLimits,
    pass: regressionPass,
  };
}

const ratios = {};
for (const [file, rule] of Object.entries(budget.ratios)) {
  const minifiedBytes = (await readFile(join(dist, file))).byteLength;
  const sourceBytes = (await readFile(join(dist, rule.source))).byteLength;
  const actual = minifiedBytes / sourceBytes;
  ratios[file] = { ...rule, actual, pass: actual <= rule.max };
  if (actual > rule.max) errors.push(`${file} ratio: ${actual.toFixed(4)} > ${rule.max}`);
}

const npmCommand = process.platform === "win32" ? (process.env.ComSpec || process.env.COMSPEC || "cmd.exe") : "npm";
const npmArgs = process.platform === "win32"
  ? ["/d", "/s", "/c", "npm pack --dry-run --json"]
  : ["pack", "--dry-run", "--json"];
function packageMetrics() {
  const pack = JSON.parse(execFileSync(npmCommand, npmArgs, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  }))[0];
  return { packed: pack.size, unpacked: pack.unpackedSize, files: pack.entryCount };
}

const generatedAt = new Date().toISOString();
const packageUpperBound = (metrics) => ({
  packed: Math.ceil(metrics.packed / budget.packageMeasurement.packedQuantum) * budget.packageMeasurement.packedQuantum,
  unpacked: Math.ceil(metrics.unpacked / budget.packageMeasurement.unpackedQuantum) * budget.packageMeasurement.unpackedQuantum,
  files: metrics.files,
});
const covers = (upper, observed) => upper.packed >= observed.packed
  && upper.unpacked >= observed.unpacked
  && upper.files === observed.files;
const createReport = (packageActual) => {
  const packageErrors = [];
  const packagePass = Object.entries(budget.package).every(([name, limit]) => {
    if (packageActual[name] <= limit) return true;
    packageErrors.push(`package ${name}: ${packageActual[name]} > ${limit}`);
    return false;
  });
  const packageGrowth = Object.fromEntries(["packed", "unpacked", "files"].map((name) => [name, growthPercent(packageActual[name], budget.baseline.package[name])]));
  const packageRegressionPass = Object.entries(packageGrowth).every(([name, actual]) => {
    const pass = actual <= budget.baseline.maxGrowthPercent.package[name];
    if (!pass) packageErrors.push(`package ${name} regression: ${actual.toFixed(3)}% > ${budget.baseline.maxGrowthPercent.package[name]}%`);
    return pass;
  });
  const regressionPass = Object.values(artifactRegressions).every(({ pass }) => pass) && packageRegressionPass;
  const finalErrors = [...errors, ...packageErrors];
  return {
    finalErrors,
    report: {
    $schema: "../metadata/performance-report.schema.json",
    schemaVersion: 1,
    version: pkg.version,
    generatedAt,
    status: finalErrors.length ? "failed" : "passed",
    compression: budget.compression,
    artifacts,
    ratios,
    package: { measurement: "self-report-conservative-upper-bound", rounding: budget.packageMeasurement, limits: budget.package, actual: packageActual, pass: packagePass },
    regressions: {
      baselineVersion: budget.baseline.version,
      artifacts: artifactRegressions,
      package: {
        baseline: budget.baseline.package,
        actual: packageActual,
        growthPercent: packageGrowth,
        limits: budget.baseline.maxGrowthPercent.package,
        pass: packageRegressionPass,
      },
      pass: regressionPass,
    },
    },
  };
};

let packageActual = packageUpperBound(packageMetrics());
let report;
let finalErrors = [];
let stable = false;
for (let attempt = 0; attempt < 3; attempt += 1) {
  ({ report, finalErrors } = createReport(packageActual));
  await writeFile(join(dist, "gardener.performance.json"), `${JSON.stringify(report, null, 2)}\n`);
  const observed = packageMetrics();
  if (covers(packageActual, observed)) {
    stable = true;
    break;
  }
  packageActual = packageUpperBound({
    packed: Math.max(packageActual.packed, observed.packed),
    unpacked: Math.max(packageActual.unpacked, observed.unpacked),
    files: observed.files,
  });
}
if (!stable) {
  finalErrors.push("npm package metrics exceeded the deterministic conservative upper bound");
  report.status = "failed";
  await writeFile(join(dist, "gardener.performance.json"), `${JSON.stringify(report, null, 2)}\n`);
}
if (finalErrors.length) throw new Error(`Performance budget failed:\n- ${finalErrors.join("\n- ")}`);
console.log(`Performance budget passed: ${Object.keys(artifacts).length} artifacts; package ${packageActual.packed} packed / ${packageActual.unpacked} unpacked bytes.`);
