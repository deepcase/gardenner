import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the Vue example has no automated WCAG A/AA violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("keyboard focus enters the dialog and returns to the trigger", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "打开对话框" });
  await trigger.focus();
  await trigger.press("Enter");
  await expect(page.getByRole("button", { name: "完成" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-g-dialog]")).toBeHidden({ timeout: 1500 });
  await expect(trigger).toBeFocused();
});
