import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("AngularJS example has no automated WCAG A/AA violations", async ({ page }) => {
  await page.goto("/examples/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});
