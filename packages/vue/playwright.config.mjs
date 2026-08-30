import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30000,
  expect: { timeout: 5000 },
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4191",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4191",
    url: "http://127.0.0.1:4191",
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [
    { name: "desktop-chromium", testMatch: /integration\.spec\.mjs/u, use: { ...devices["Desktop Chrome"] } },
    { name: "desktop-webkit", testMatch: /integration\.spec\.mjs/u, use: { ...devices["Desktop Safari"] } },
    { name: "desktop-firefox", testMatch: /integration\.spec\.mjs/u, use: { ...devices["Desktop Firefox"] } },
    { name: "mobile-chromium", testMatch: /integration\.spec\.mjs/u, use: { ...devices["Pixel 7"] } },
    { name: "accessibility-chromium", testMatch: /accessibility\.spec\.mjs/u, use: { ...devices["Desktop Chrome"] } },
  ],
});
