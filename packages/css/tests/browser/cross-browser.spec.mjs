import { expect, test } from "@playwright/test";
import { collectPageFailures, exampleUrl, releasePages } from "./pages.mjs";

for (const { name, url } of releasePages) {
  test(`${name} loads without browser or layout failures`, async ({ page }) => {
    const failures = collectPageFailures(page);
    const response = await page.goto(url, { waitUntil: "networkidle" });

    expect(
      response?.ok(),
      `${name} must return a successful document response`,
    ).toBe(true);
    if (name.startsWith("website/")) {
      const file = name.endsWith("docs.html") ? "docs.html" : "index.html";
      await page.waitForURL(
        ({ pathname }) => pathname === `/website/en/${file}`,
        { waitUntil: "networkidle" },
      );
    }
    await expect(page.locator("body")).toBeVisible();

    const documentState = await page.evaluate(() => ({
      title: document.title.trim(),
      language: document.documentElement.lang,
      hasGardenerStylesheet: [...document.styleSheets].some(({ href }) =>
        href?.includes("gardener.css"),
      ),
      hasHorizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    }));

    expect(documentState.title).not.toBe("");
    expect(documentState.language).not.toBe("");
    expect(documentState.hasGardenerStylesheet).toBe(true);
    expect(documentState.hasHorizontalOverflow).toBe(false);
    expect(failures).toEqual([]);
  });
}

test("dialog keyboard lifecycle works in the native browser", async ({
  page,
}) => {
  const failures = collectPageFailures(page);
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });

  const trigger = page.locator('[data-g-dialog-open="demo-dialog"]');
  const dialog = page.locator("#demo-dialog");
  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(":focus")).toHaveCount(1);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(failures).toEqual([]);
});
