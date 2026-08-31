import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readdir, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const artifacts = resolve(root, "artifacts");
await mkdir(artifacts, { recursive: true });
execFileSync("dotnet", ["pack", "src/Gardenerim.Blazor/Gardenerim.Blazor.csproj", "-c", "Release", "--no-build", "--nologo", "-o", artifacts], { cwd: root, stdio: "inherit" });
const workspace = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const packageName = (await readdir(artifacts)).find((name) => name === `Gardenerim.Blazor.${workspace.version}.nupkg`);
if (!packageName) throw new Error("Gardenerim.Blazor.2.0.0.nupkg was not created.");
const packagePath = resolve(artifacts, packageName);
const entries = execFileSync("tar", ["-tf", packagePath], { encoding: "utf8" }).split(/\r?\n/u).filter(Boolean).map((entry) => entry.replaceAll("\\", "/"));
const required = ["lib/net10.0/Gardenerim.Blazor.dll", "README.md", "LICENSE", "metadata/public-api.json", "metadata/compatibility.json", "metadata/components.json", "metadata/components.schema.json", "metadata/performance-budgets.schema.json", "staticwebassets/gardener.min.css.map", "staticwebassets/gardener.runtime.min.js.map"];
for (const item of required) if (!entries.some((entry) => entry.endsWith(item))) throw new Error(`NuGet entry missing: ${item}`);
if (!entries.some((entry) => entry === "build/Gardenerim.Blazor.props") || !entries.some((entry) => entry.startsWith("staticwebassets/") && entry.endsWith("gardener.blazor.js"))) throw new Error("NuGet static web asset wiring/assets missing.");
if (entries.some((entry) => entry.includes("lib/net11.0"))) throw new Error("Stable package must not ship preview net11 assets.");
if (entries.some((entry) => /(^|\/)(bin|obj|node_modules)\//u.test(entry) || entry.endsWith(".cs"))) throw new Error("NuGet contains build/source debris.");
const budgets = JSON.parse(await readFile(resolve(root, "config", "performance-budgets.json"), "utf8"));
const size = (await stat(packagePath)).size;
if (size > budgets.package.bytes || entries.length > budgets.package.files) throw new Error(`NuGet budget exceeded: ${size} bytes, ${entries.length} files.`);
const temporary = await mkdtemp(resolve(tmpdir(), "gardener-blazor-package-consumer-"));
try {
  execFileSync("dotnet", ["publish", "tests/Gardenerim.Blazor.PackageConsumer/Gardenerim.Blazor.PackageConsumer.csproj", "-c", "Release", "--nologo", "--artifacts-path", resolve(temporary, "artifacts"), "-o", resolve(temporary, "publish"), "-p:RestoreNoCache=true"], { cwd: root, env: { ...process.env, NUGET_PACKAGES: resolve(temporary, "packages") }, stdio: "inherit" });
  const find = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map((entry) => entry.isDirectory() ? find(resolve(directory, entry.name)) : [resolve(directory, entry.name)]))).flat();
  const consumerFiles = await find(temporary);
  const endpointManifest = consumerFiles.find((path) => path.endsWith("Gardenerim.Blazor.PackageConsumer.staticwebassets.endpoints.json"));
  if (!endpointManifest || !(await readFile(endpointManifest, "utf8")).includes("_content/Gardenerim.Blazor/gardener.blazor.js")) throw new Error("Package consumer did not receive Gardenerim static web assets.");
  const consumerProject = await readFile(resolve(root, "tests/Gardenerim.Blazor.PackageConsumer/Gardenerim.Blazor.PackageConsumer.csproj"), "utf8");
  if (consumerProject.includes("ProjectReference") || !consumerProject.includes("PackageReference")) throw new Error("Package consumer must reference the produced NuGet, not source.");
  if (!consumerProject.includes(`Version="${workspace.version}"`)) throw new Error("Package consumer version differs from the produced NuGet.");
} finally {
  await rm(temporary, { recursive: true, force: true });
}
console.log(`NuGet verified and consumed: ${packageName}, ${size} bytes, ${entries.length} entries, net10 stable assets.`);
