import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const cli = resolve(root, "node_modules", "@playwright", "test", "cli.js");
const environment = { ...process.env };
let temporary = null;

// Firefox can fail Windows Side-by-Side activation from Playwright's shared
// cache. A package-local cache avoids that host-specific launch failure while
// still running the same pinned browser revision used by Playwright.
if (process.platform === "win32" && !environment.PLAYWRIGHT_BROWSERS_PATH && environment.LOCALAPPDATA) {
  const catalog = JSON.parse(await readFile(resolve(root, "node_modules", "playwright-core", "browsers.json"), "utf8"));
  const revision = catalog.browsers.find(({ name }) => name === "firefox")?.revision;
  const source = revision ? resolve(environment.LOCALAPPDATA, "ms-playwright", `firefox-${revision}`) : null;
  temporary = resolve(root, ".tmp-playwright");
  if (!temporary.startsWith(`${root}${sep}`)) throw new Error(`Unsafe browser cache: ${temporary}`);
  if (source && existsSync(source)) {
    await rm(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    await mkdir(temporary, { recursive: true });
    await cp(source, resolve(temporary, `firefox-${revision}`), { recursive: true, force: true });
    environment.PLAYWRIGHT_BROWSERS_PATH = temporary;
  } else temporary = null;
}

try {
  const result = spawnSync(process.execPath, [cli, "test", "--project=desktop-firefox"], {
    cwd: root,
    env: environment,
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.status !== 0) throw new Error(result.error?.message || `Firefox tests failed with status ${result.status}`);
} finally {
  if (temporary) await rm(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
