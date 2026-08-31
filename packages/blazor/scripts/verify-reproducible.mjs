import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const temporary = await mkdtemp(resolve(tmpdir(), "gardener-blazor-repro-"));
const first = resolve(temporary, "first");
const second = resolve(temporary, "second");
const project = resolve(root, "src", "Gardenerim.Blazor", "Gardenerim.Blazor.csproj");
const run = (output) => execFileSync("dotnet", ["build", project, "-c", "Release", "--nologo", "--no-restore", "-o", output, `-p:ContinuousIntegrationBuild=true`], { cwd: root, stdio: "pipe" });
const digest = async (path) => createHash("sha256").update(await readFile(path)).digest("hex");
try {
  run(first); run(second);
  for (const name of ["Gardenerim.Blazor.dll", "Gardenerim.Blazor.xml"]) {
    const [a, b] = await Promise.all([digest(resolve(first, name)), digest(resolve(second, name))]);
    if (a !== b) throw new Error(`Non-reproducible output: ${name}`);
  }
  console.log("Reproducible build passed for DLL and XML documentation.");
} finally {
  await rm(temporary, { recursive: true, force: true });
}
