import { expect, test } from "@playwright/test";

test("React example loads all contracts without console or layout failures", async ({ page }) => {
  const failures = [];
  page.on("console", (message) => { if (message.type() === "error") failures.push(message.text()); });
  page.on("pageerror", (error) => failures.push(error.message));
  const response = await page.goto("/", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole("heading", { name: "Gardener React" })).toBeVisible();
  await expect(page.getByTestId("catalog-count")).toHaveText("506 components");
  const state = await page.evaluate(() => ({
    mode: document.querySelector("[data-g-mode]")?.getAttribute("data-g-mode"),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  expect(state).toEqual({ mode: "light", overflow: false });
  expect(failures).toEqual([]);
});

test("controlled React input and button events remain operable", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const input = page.getByLabel("名称");
  await input.fill("React CMS");
  await expect(page.getByTestId("value")).toHaveText("React CMS");
  await page.getByRole("button", { name: "保存" }).click();
  await expect(page.getByTestId("value")).toHaveText("已保存");
});

test("one native edit produces one value callback", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const input = page.getByLabel("名称");
  await input.focus();
  await input.press("End");
  await input.press("X");
  await expect(page.getByTestId("value-events")).toHaveText("1");
});
