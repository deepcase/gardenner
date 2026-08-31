import { spawn } from "node:child_process";
import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const url = "http://127.0.0.1:5187";
let temporaryBrowserCache = null;
let localFirefoxExecutable = null;

// Firefox can fail Windows side-by-side activation when launched directly
// from the shared Playwright cache. The adapter packages already isolate that
// cache for their Firefox release gate; keep Blazor on the same verified path.
if (process.platform === "win32" && !process.env.PLAYWRIGHT_BROWSERS_PATH && process.env.LOCALAPPDATA) {
  const catalog = JSON.parse(await readFile(resolve(root, "node_modules", "playwright-core", "browsers.json"), "utf8"));
  const revision = catalog.browsers.find(({ name }) => name === "firefox")?.revision;
  const source = revision ? resolve(process.env.LOCALAPPDATA, "ms-playwright", `firefox-${revision}`) : null;
  temporaryBrowserCache = resolve(root, ".tmp-playwright");
  if (!temporaryBrowserCache.startsWith(`${root}${sep}`)) throw new Error(`Unsafe browser cache: ${temporaryBrowserCache}`);
  if (source && existsSync(source)) {
    await rm(temporaryBrowserCache, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    await mkdir(temporaryBrowserCache, { recursive: true });
    const isolated = resolve(temporaryBrowserCache, `firefox-${revision}`);
    await cp(source, isolated, { recursive: true, force: true });
    localFirefoxExecutable = resolve(isolated, "firefox", "firefox.exe");
  } else temporaryBrowserCache = null;
}
const server = spawn("dotnet", ["run", "--project", "samples/Gardenerim.Blazor.Demo/Gardenerim.Blazor.Demo.csproj", "-c", "Release", "--no-build", "--no-launch-profile"], {
  cwd: root,
  env: { ...process.env, ASPNETCORE_URLS: url, ASPNETCORE_ENVIRONMENT: "Development" },
  stdio: ["ignore", "pipe", "pipe"]
});
let output = "";
server.stdout.on("data", (chunk) => { output += chunk; });
server.stderr.on("data", (chunk) => { output += chunk; });
const waitForServer = async () => {
  for (let attempt = 0; attempt < 80; attempt++) {
    try { if ((await fetch(url)).ok) return; } catch {}
    await new Promise((accept) => setTimeout(accept, 250));
  }
  throw new Error(`Demo server did not start.\n${output}`);
};

const running = [];
try {
  await waitForServer();
  const ssr = await fetch(url);
  const initialHtml = await ssr.text();
  if (!ssr.ok || !initialHtml.includes("完整、稳定、直接可用") || !initialHtml.includes("g-app-shell")) throw new Error("Static SSR response is incomplete before Blazor starts.");

  for (const [engine, browserType] of [["chromium", chromium], ["firefox", firefox], ["webkit", webkit]]) {
    let browser;
    try {
      browser = await browserType.launch({
        headless: true,
        ...(engine === "firefox" && localFirefoxExecutable
          ? { executablePath: localFirefoxExecutable }
          : {}),
      });
    } catch (error) {
      if (engine === "firefox" && process.env.GARDENER_REQUIRE_FIREFOX !== "1") {
        console.warn(`Firefox skipped on this host (${error.message.split("\n")[0]}); CI keeps it mandatory.`);
        continue;
      }
      throw error;
    }
    running.push(browser);
    const viewports = engine === "firefox" ? [{ width: 1440, height: 900 }] : [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      page.on("console", (message) => { if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) errors.push(message.text()); });
      page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(url, { waitUntil: "networkidle" });
      await page.getByRole("heading", { level: 1 }).waitFor();
      const grid = page.getByRole("grid", { name: "示例数据网格" });
      await grid.getByRole("textbox", { name: "客户 1", exact: true }).waitFor();
      if (await grid.locator("tbody tr").count() >= 25) throw new Error(`${engine}: DataGrid virtualization did not bound DOM rows.`);
      await grid.getByRole("checkbox", { name: "选择 1", exact: true }).check();
      if (!await grid.getByRole("checkbox", { name: "选择 1", exact: true }).isChecked()) throw new Error(`${engine}: DataGrid selection failed.`);
      if (await page.locator("html").getAttribute("data-g-mode") === "dark") throw new Error(`${engine}: demo must default to light mode.`);
      if (await page.locator("[data-g-shape=small]").count() < 1) throw new Error(`${engine}: small-radius provider missing.`);
      await page.getByRole("button", { name: /已操作/u }).click();
      await page.getByRole("button", { name: /已操作 1 次/u }).waitFor();
      await page.getByLabel("项目名称").focus();
      await page.keyboard.press("Tab");
      if (!await page.evaluate(() => document.activeElement?.tagName === "BUTTON")) throw new Error(`${engine}: keyboard focus order failed.`);

      if (engine === "chromium" && viewport.width === 1440) {
        const target = page.locator("[data-testid=runtime-event-target]");
        await target.evaluate((element) => {
          const detail = { value: "updated", trigger: element, callback: () => {} };
          detail.cyclic = detail;
          element.dispatchEvent(new CustomEvent("gardener:selectionchange", { bubbles: true, cancelable: true, detail }));
        });
        await page.locator("#runtime-value").getByText("updated", { exact: true }).waitFor();
        const allowed = await target.evaluate((element) => element.dispatchEvent(new CustomEvent("gardener:beforeopen", { bubbles: true, cancelable: true, detail: { source: element } })));
        if (allowed) throw new Error("Guard event was not synchronously prevented.");
        await page.locator("#runtime-event").getByText("gardener:beforeopen:True", { exact: true }).waitFor();
        const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        if (accessibility.violations.length) throw new Error(`Accessibility violations: ${accessibility.violations.map((item) => item.id).join(", ")}`);
      }
      if (errors.length) throw new Error(`${engine} console/network errors: ${errors.join(" | ")}`);
      await context.close();
    }

    if (engine === "chromium") {
      const page = await browser.newPage();
      await page.goto(`${url}/catalog`, { waitUntil: "networkidle" });
      if ((await page.locator(".demo-catalog-item").count()) !== 506) throw new Error("Catalog does not render all 506 components.");
      await page.getByLabel("筛选组件").fill("button");
      if ((await page.locator(".demo-catalog-item").count()) < 1) throw new Error("Interactive catalog filtering failed.");
      await page.close();
    }
    await browser.close();
    running.splice(running.indexOf(browser), 1);
  }
  console.log("Browser checks passed: SSR, Chromium, WebKit, mobile, keyboard, WCAG A/AA, safe custom events, guards, 506-item catalog; Firefox is mandatory in CI.");
} finally {
  await Promise.allSettled(running.map((browser) => browser.close()));
  server.kill();
  if (temporaryBrowserCache)
    await rm(temporaryBrowserCache, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
