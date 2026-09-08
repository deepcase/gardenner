import { expect, test } from "@playwright/test";
import {
  collectPageFailures,
  contentMediaFailures,
  exampleUrl,
  websitePages,
  mobilePages,
} from "./pages.mjs";

test("interactive tags, chips, and avatars provide touch-sized targets", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    main.insertAdjacentHTML("afterbegin", '<button id="touch-tag" class="g-tag g-tag-checkable" type="button">标签</button><button id="touch-chip" class="g-chip g-chip-selectable" type="button">筛选</button><button id="touch-avatar" class="g-avatar g-avatar-xs g-avatar-interactive" type="button" aria-label="选择林默">林</button>');
  });
  for (const selector of ["#touch-tag", "#touch-chip", "#touch-avatar"]) {
    const box = await page.locator(selector).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

for (const name of mobilePages) {
  test(`${name} reflows in a touch viewport`, async ({ page, browserName }) => {
    const failures = collectPageFailures(page);
    await page.goto(exampleUrl(name), { waitUntil: "networkidle" });

    const state = await page.evaluate(() => ({
      hasViewportMeta:
        document
          .querySelector('meta[name="viewport"]')
          ?.content.includes("width=device-width") === true,
      hasHorizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      viewport: { width: innerWidth, height: innerHeight },
    }));

    expect(state.hasViewportMeta).toBe(true);
    expect(state.hasHorizontalOverflow).toBe(false);
    expect(state.viewport.width).toBeLessThanOrEqual(430);
    expect(['content-lab.html','media-lab.html'].includes(name) ? await contentMediaFailures(page, failures, browserName) : failures).toEqual([]);
  });
}

for (const { name, url } of websitePages) {
  test(`${name} reflows in a touch viewport`, async ({ page }) => {
    const failures = collectPageFailures(page);
    await page.goto(url, { waitUntil: "networkidle" });
    const file = name.endsWith("docs.html") ? "docs.html" : "index.html";
    await page.waitForURL(
      ({ pathname }) => pathname === `/website/en/${file}`,
      { waitUntil: "networkidle" },
    );
    const state = await page.evaluate(() => ({
      hasViewportMeta:
        document
          .querySelector('meta[name="viewport"]')
          ?.content.includes("width=device-width") === true,
      hasHorizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      lightByDefault: document.documentElement.dataset.gMode === "light",
    }));
    expect(state).toEqual({
      hasViewportMeta: true,
      hasHorizontalOverflow: false,
      lightByDefault: true,
    });
    expect(failures).toEqual([]);
  });
}

test("mobile controls expose touch-sized targets", async ({ page }) => {
  await page.goto(exampleUrl("mobile-compositions.html"), {
    waitUntil: "networkidle",
  });
  const targets = page.locator(
    ".g-mobile-app-bar button:visible, .g-mobile-bottom-navigation-item:visible",
  );
  const count = await targets.count();
  expect(count).toBeGreaterThanOrEqual(5);

  for (let index = 0; index < count; index += 1) {
    const box = await targets.nth(index).boundingBox();
    expect(box, `touch target ${index} must have a layout box`).not.toBeNull();
    expect(box.width, `touch target ${index} width`).toBeGreaterThanOrEqual(44);
    expect(box.height, `touch target ${index} height`).toBeGreaterThanOrEqual(
      44,
    );
  }

  const compactActions = page.locator(".g-btn-sm:visible");
  for (let index = 0; index < await compactActions.count(); index += 1) {
    const box = await compactActions.nth(index).boundingBox();
    expect(box, `compact touch action ${index} must have a layout box`).not.toBeNull();
    expect(box.height, `compact touch action ${index} height`).toBeGreaterThanOrEqual(36);
  }
});

test("mobile sheet opens, traps an operable surface, closes, and restores focus", async ({
  page,
}) => {
  const failures = collectPageFailures(page);
  await page.goto(exampleUrl("mobile-compositions.html"), {
    waitUntil: "networkidle",
  });
  const trigger = page.locator('[data-g-mobile-sheet-open="mobile-filter"]');
  const sheet = page.locator("#mobile-filter");

  await trigger.click();
  await expect(sheet).toBeVisible();
  await expect(sheet.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(failures).toEqual([]);
});

test("narrow portrait and mobile landscape remain contained", async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(exampleUrl("mobile-compositions.html"), {
      waitUntil: "networkidle",
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(
      overflow,
      `${viewport.width}x${viewport.height} must not overflow the page`,
    ).toBe(false);
  }
});
