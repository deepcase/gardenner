import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("React example has no automated WCAG A/AA violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length }))).toEqual([]);
});
