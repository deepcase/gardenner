import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { exampleUrl, releasePages } from "./pages.mjs";

for (const { name, url } of releasePages) {
  test(`${name} has no automated WCAG A/AA violations`, async ({ page }) => {
    // The documentation renders the complete 506-component catalog. Keep the
    // full-document Axe scan instead of weakening its rules or excluding the
    // generated catalog, but allow enough time for slower CI/browser hosts.
    if (name === "website/docs.html") test.setTimeout(120_000);
    await page.goto(url, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        nodes: nodes.map(({ failureSummary, html, target }) => ({
          failureSummary,
          html,
          target: target.join(" "),
        })),
      }));

    expect(blocking).toEqual([]);
  });
}

test("keyboard focus is visible and dialog focus returns to its trigger", async ({
  page,
}) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const active = document.activeElement;
    const style = getComputedStyle(active);
    return {
      tag: active?.tagName,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
    };
  });
  expect(focus.tag).not.toBe("BODY");
  expect(
    focus.outlineStyle !== "none" ||
      focus.outlineWidth !== "0px" ||
      focus.boxShadow !== "none",
  ).toBe(true);

  const trigger = page.locator('[data-g-dialog-open="demo-dialog"]');
  await trigger.click();
  await expect(page.locator("#demo-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("reduced motion, forced colors, RTL, and narrow reflow stay operable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.evaluate(() => (document.documentElement.dir = "rtl"));
  await page.keyboard.press("Tab");

  const state = await page.evaluate(() => {
    const button = document.querySelector(".g-btn");
    const style = getComputedStyle(button);
    const durations = `${style.animationDuration},${style.transitionDuration}`
      .split(",")
      .map((value) => value.trim())
      .map((value) =>
        value.endsWith("ms")
          ? Number.parseFloat(value)
          : Number.parseFloat(value) * 1000,
      );
    return {
      direction: getComputedStyle(document.documentElement).direction,
      hasHorizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      focused: document.activeElement !== document.body,
      maximumMotionMs: Math.max(...durations.filter(Number.isFinite), 0),
    };
  });

  expect(state.direction).toBe("rtl");
  expect(state.hasHorizontalOverflow).toBe(false);
  expect(state.focused).toBe(true);
  expect(state.maximumMotionMs).toBeLessThanOrEqual(1);
});
