import { test, expect } from "@playwright/test";

test("the Vue example mounts, stays contained, and completes the dialog lifecycle", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");

  const provider = page.locator("[data-g-theme='garden'][data-g-mode='light']");
  await expect(provider).toBeVisible();
  await expect(page.getByRole("heading", { name: "Gardenerim Vue" })).toBeVisible();
  const contained = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  expect(contained).toBe(true);

  const dialogRoot = page.locator("[data-g-dialog]");
  await expect(dialogRoot).toBeHidden();
  await page.getByRole("button", { name: "打开对话框" }).click();
  await expect(dialogRoot).toBeVisible();
  await expect(dialogRoot).toHaveClass(/is-open/u);
  await expect(page.getByRole("dialog", { name: "Gardenerim Vue 对话框" })).toBeVisible();
  await page.getByRole("button", { name: "完成" }).click();
  await expect(dialogRoot).toBeHidden({ timeout: 1500 });
  expect(errors).toEqual([]);
});
