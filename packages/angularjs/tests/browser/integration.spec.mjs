import { test, expect } from "@playwright/test";

test("AngularJS example loads all contracts without console or layout failures", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/examples/");
  await expect(page.getByRole("heading", { name: "Gardener AngularJS" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__GARDENER_ANGULARJS_EXAMPLE__?.ready)).toBe(true);
  expect(await page.evaluate(() => window.__GARDENER_ANGULARJS_EXAMPLE__.components)).toBe(506);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("ngModel, generated button directive, and AngularJS expressions remain operable", async ({ page }) => {
  await page.goto("/examples/");
  const input = page.getByLabel("关键词");
  await input.fill("AngularJS");
  await expect(page.locator("#value-output")).toContainText("AngularJS");
  await page.locator("#action-button").click();
  await expect(page.locator("#click-output")).toHaveText("1");
  expect(await page.evaluate(() => window.__GARDENER_ANGULARJS_EXAMPLE__.clicks)).toBe(1);
});

test("one native edit produces one Gardener value callback", async ({ page }) => {
  await page.goto("/examples/");
  await page.getByLabel("关键词").fill("single-event");
  expect(await page.evaluate(() => window.__GARDENER_ANGULARJS_EXAMPLE__.valueEvents)).toBe(1);
});

test("multiple select preserves AngularJS array model and one callback", async ({ page }) => {
  await page.goto("/examples/");
  await page.getByLabel("通知渠道（可多选）").selectOption(["email", "sms"]);
  await expect(page.locator("#channels-output")).toContainText("email, sms");
  expect(await page.evaluate(() => window.__GARDENER_ANGULARJS_EXAMPLE__.selectEvents)).toBe(1);
});
