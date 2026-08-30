import { defineConfig, devices } from "@playwright/test";

const desktopTest = /cross-browser\.spec\.mjs/;
const mobileTest = /mobile\.spec\.mjs/;
const accessibilityTest = /accessibility\.spec\.mjs/;

export default defineConfig({
  testDir: "./tests/browser",
  outputDir: ".test-results",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  // Keep browser engines sequential: Windows can reject concurrent Firefox
  // process creation even when each engine launches correctly on its own.
  workers: 1,
  reporter: [["line"]],
  expect: { timeout: 5_000 },
  use: {
    baseURL: "http://127.0.0.1:4187",
    colorScheme: "light",
    locale: "zh-CN",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "node scripts/serve.mjs",
      port: 4187,
      reuseExistingServer: true,
      timeout: 30_000,
      env: { GARDENER_PORT: "4187" },
    },
    {
      command: "node ../../website/scripts/serve.mjs",
      port: 4188,
      reuseExistingServer: true,
      timeout: 30_000,
      env: { GARDENER_WEBSITE_PORT: "4188" },
    },
  ],
  projects: [
    {
      name: "desktop-chromium",
      testMatch: desktopTest,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "desktop-firefox",
      testMatch: desktopTest,
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "desktop-webkit",
      testMatch: desktopTest,
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile-chromium",
      testMatch: mobileTest,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-webkit",
      testMatch: mobileTest,
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "accessibility-chromium",
      testMatch: accessibilityTest,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
      },
    },
  ],
});
