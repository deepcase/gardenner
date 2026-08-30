import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  retries: 0,
  timeout: 30000,
  use: { baseURL: "http://127.0.0.1:4182", trace: "retain-on-failure" },
  webServer: { command: "npm run dev -- --host 127.0.0.1 --port 4182", url: "http://127.0.0.1:4182/examples/", reuseExistingServer: true, timeout: 30000 },
  projects: [
    { name: "desktop-chromium", testMatch: /integration\.spec\.mjs/u, use: { ...devices["Desktop Chrome"] } },
    { name: "desktop-webkit", testMatch: /integration\.spec\.mjs/u, use: { ...devices["Desktop Safari"] } },
    { name: "desktop-firefox", testMatch: /integration\.spec\.mjs/u, use: { ...devices["Desktop Firefox"] } },
    { name: "mobile-chromium", testMatch: /integration\.spec\.mjs/u, use: { ...devices["Pixel 7"] } },
    { name: "mobile-webkit", testMatch: /integration\.spec\.mjs/u, use: { ...devices["iPhone 13"] } },
    { name: "accessibility-chromium", testMatch: /accessibility\.spec\.mjs/u, use: { ...devices["Desktop Chrome"] } },
  ],
});
