import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const requiredFiles = [
  ".editorconfig",
  ".gitattributes",
  ".gitignore",
  ".nvmrc",
  "CHANGELOG.md",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "LICENSE",
  "NOTICE",
  "README.md",
  "README.zh-CN.md",
  "SECURITY.md",
  "SUPPORT.md",
  "package.json",
  "docs/architecture.md",
  "docs/releasing.md",
  ".github/dependabot.yml",
  ".github/workflows/ci.yml",
  ".github/workflows/blazor.yml",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/pull_request_template.md",
];
const packages = new Map([
  ["packages/css", "@gardenerim/css"],
  ["packages/vue", "@gardenerim/vue"],
  ["packages/react", "@gardenerim/react"],
  ["packages/angularjs", "@gardenerim/angularjs"],
  ["packages/blazor", "@gardenerim/blazor-workspace"],
]);

for (const file of requiredFiles) {
  await access(resolve(root, file)).catch(() => errors.push(`Missing repository file: ${file}`));
}

for (const legacy of ["css", "vue", "react", "angular", "blazor", "home"]) {
  await access(resolve(root, legacy)).then(
    () => errors.push(`Legacy root directory still exists: ${legacy}/`),
    () => {},
  );
}

for (const [directory, expectedName] of packages) {
  try {
    const manifest = JSON.parse(await readFile(resolve(root, directory, "package.json"), "utf8"));
    if (manifest.name !== expectedName) errors.push(`${directory}/package.json has package name ${manifest.name}`);
    if (manifest.version !== "1.0.0") errors.push(`${expectedName} is not at version 1.0.0`);
    if (manifest.license !== "MIT") errors.push(`${expectedName} does not declare the repository MIT license`);
    await access(resolve(root, directory, "LICENSE")).catch(() => errors.push(`${expectedName} is missing a package-local LICENSE`));
  } catch (error) {
    errors.push(`Cannot read ${directory}/package.json: ${error.message}`);
  }
}

const ignoredDirectories = new Set([
  ".git",
  ".idea",
  ".test-results",
  ".vs",
  ".vscode",
  "artifacts",
  "bin",
  "coverage",
  "dist",
  "node_modules",
  "obj",
  "playwright-report",
  "test-results",
]);
const sourceExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".mjs", ".razor", ".ts", ".tsx", ".vue", ".yml", ".yaml"]);

async function listSourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listSourceFiles(path));
    else if (entry.isFile() && sourceExtensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const stalePatterns = [
  [/\.\.\/home\//g, "../home/"],
  [/\bhome\/docs\.html/g, "home/docs.html"],
  [/\bhome\/index\.html/g, "home/index.html"],
  [/resolve\(project, "(?:css|vue|react|angular|blazor)(?:\/|"\))/g, "legacy project-root package path"],
  [/href="\.\.\/(?:css|vue|react|angular|blazor)\//g, "legacy website link"],
];

for (const file of await listSourceFiles(root)) {
  if (fileURLToPath(import.meta.url) === file) continue;
  const content = await readFile(file, "utf8");
  for (const [pattern, label] of stalePatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) errors.push(`${relative(root, file).replaceAll("\\", "/")}: ${label}`);
  }
}

if (errors.length) {
  console.error(`Repository check failed with ${errors.length} error(s):\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`Repository check passed: ${requiredFiles.length} root contracts and ${packages.size} packages.`);
}
