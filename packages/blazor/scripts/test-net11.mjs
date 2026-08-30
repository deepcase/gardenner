import { execFileSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const temporary = await mkdtemp(resolve(tmpdir(), "gardener-blazor-net11-"));
try {
  execFileSync("dotnet", ["run", "--project", "tests/Gardener.Blazor.Net11Consumer/Gardener.Blazor.Net11Consumer.csproj", "-c", "Release", "-p:RestoreNoCache=true"], { cwd: root, env: { ...process.env, NUGET_PACKAGES: resolve(temporary, "packages") }, stdio: "inherit" });
} finally {
  await rm(temporary, { recursive: true, force: true });
}
