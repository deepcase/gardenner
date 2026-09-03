import { expect, test } from "@playwright/test";
import { collectPageFailures, exampleUrl, releasePages } from "./pages.mjs";
import AxeBuilder from "@axe-core/playwright";

test("managed DataGrid virtual rows, selection, editing and accessibility", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), {waitUntil:"networkidle"});
  await page.evaluate(async () => {
    const runtime=await import('/dist/gardener.runtime.js');
    const host=document.createElement('div'); host.id='managed-grid'; host.dataset.gDataGrid='';
    host.setAttribute('aria-label','客户列表'); document.querySelector('main').prepend(host);
    runtime.init(host); const grid=runtime.getInstance(host,'data-grid');
    grid.setOptions({columns:[{field:'name',title:'姓名',editable:true}],rows:Array.from({length:10000},(_,id)=>({id,name:`客户 ${id}`})),pageSize:10000,selectable:true,virtual:true,rowHeight:40,height:320});
  });
  const host=page.locator('#managed-grid');
  expect(await host.locator('tbody tr').count()).toBeLessThan(25);
  const select=host.getByRole('checkbox',{name:'选择 0',exact:true});
  await select.focus(); await select.press('Space'); await expect(select).toBeChecked(); await expect(select).toBeFocused();
  const input=host.getByRole('textbox',{name:'姓名 0',exact:true});
  await input.fill('已编辑'); await input.press('Tab'); await expect(input).toHaveValue('已编辑');
  const violations=(await new AxeBuilder({page}).include('#managed-grid').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations;
  expect(violations.map(item=>item.id)).toEqual([]);
  await host.locator('[data-g-grid-viewport]').evaluate(node=>{node.scrollTop=20000;});
  await expect.poll(()=>host.locator('tbody tr[aria-rowindex]').first().getAttribute('aria-rowindex')).not.toBe('2');
  expect(await host.locator('tbody tr').count()).toBeLessThan(25);
});

test("overflow table keeps the first and last columns fixed while middle columns scroll", async ({ page }) => {
  await page.goto(exampleUrl("data-compositions.html"), { waitUntil: "networkidle" });
  const wrapper = page.locator("[data-g-table-scroll]").first();
  await wrapper.evaluate((element) => { element.style.width = "35rem"; });
  await expect(wrapper).toHaveClass(/is-scrollable/);
  await expect(wrapper).toHaveClass(/can-scroll-end/);

  await wrapper.focus();
  await wrapper.press("ArrowRight");
  await expect.poll(() => wrapper.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await wrapper.press("End");
  await expect.poll(() => wrapper.evaluate((element) => Math.abs((element.scrollWidth - element.clientWidth) - element.scrollLeft))).toBeLessThan(2);
  await wrapper.evaluate((element) => { element.dir = "rtl"; element.scrollLeft = 0; element.dispatchEvent(new Event("scroll")); });
  await expect(wrapper).toHaveClass(/can-scroll-end/);
  await wrapper.press("ArrowLeft");
  await expect.poll(() => wrapper.evaluate((element) => element.scrollLeft)).toBeLessThan(0);
  await wrapper.evaluate((element) => { element.dir = "ltr"; element.scrollLeft = 0; });

  const positions = await wrapper.evaluate(async (element) => {
    const row = element.querySelector("tbody tr:not([data-g-detail-row])");
    const first = row.children[0];
    const middle = row.children[2];
    const last = row.children[row.children.length - 1];
    const read = () => ({
      first: first.getBoundingClientRect().left,
      middle: middle.getBoundingClientRect().left,
      last: last.getBoundingClientRect().right,
    });
    const before = read();
    element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
    element.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return { before, after: read(), classes: [...element.classList] };
  });

  expect(Math.abs(positions.after.first - positions.before.first)).toBeLessThan(1.5);
  expect(Math.abs(positions.after.last - positions.before.last)).toBeLessThan(1.5);
  expect(positions.after.middle).toBeLessThan(positions.before.middle - 20);
  expect(positions.classes).toEqual(expect.arrayContaining(["can-scroll-start", "can-scroll-end"]));
});

test("common components keep compact desktop density and complete their small interactions", async ({ page }) => {
  const height = async (selector) => page.locator(selector).first().evaluate((element) => element.getBoundingClientRect().height);

  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  expect(await height(".g-alert")).toBeLessThanOrEqual(65);
  expect(await height(".g-composer-input")).toBeLessThanOrEqual(56);

  await page.goto(exampleUrl("help-system.html"), { waitUntil: "networkidle" });
  expect(await height(".g-faq-question")).toBeLessThanOrEqual(46);
  const feedback = page.locator("[data-g-saved-choice].g-help-feedback");
  await feedback.getByRole("button", { name: "有帮助", exact: true }).click();
  await expect(feedback.locator("[data-g-saved-choice-output]")).toHaveText("感谢反馈");

  await page.goto(exampleUrl("auth-compositions.html"), { waitUntil: "networkidle" });
  expect(await height(".g-auth-choice")).toBeLessThanOrEqual(60);

  await page.goto(exampleUrl("selection-compositions.html"), { waitUntil: "networkidle" });
  const dateRange = page.locator("[data-g-range-picker].g-date-range-picker");
  await dateRange.getByRole("button", { name: "最近 7 天", exact: true }).click();
  const values = await dateRange.locator("input[type=date]").evaluateAll((inputs) => inputs.map((input) => input.value));
  expect(values.every(Boolean)).toBe(true);
  expect(values[0] <= values[1]).toBe(true);

  await page.goto(exampleUrl("content-compositions.html"), { waitUntil: "networkidle" });
  const video = page.locator("[data-g-media-player].g-video-player");
  await video.locator("[data-g-media-toggle]").click();
  await expect(video.locator("[data-g-media-toggle]")).toHaveAttribute("aria-pressed", "true");
  await video.locator("[data-g-media-timeline]").fill("75");
  await expect(video.locator("[data-g-media-time]")).toHaveText("1:15 / 4:20");
});

test("toast feedback uses an Arco-style top-centered message layout", async ({ page }) => {
  await page.goto(exampleUrl("runtime-lab.html"), { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const runtime = await import("/dist/gardener.runtime.js");
    document.querySelector(".g-toast-region")?.replaceChildren();
    runtime.toast({ message: "操作成功", tone: "success", timeout: 0 });
  });
  const toast = page.locator(".g-toast-success");
  await expect(toast).toBeVisible();
  const placement = await toast.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const icon = getComputedStyle(element, "::before");
    return {
      centerOffset: Math.abs((box.left + box.width / 2) - innerWidth / 2),
      top: box.top,
      borderInlineStartWidth: style.borderInlineStartWidth,
      display: style.display,
      iconMask: icon.maskImage || icon.webkitMaskImage,
    };
  });
  expect(placement.centerOffset).toBeLessThan(1);
  expect(placement.top).toBeGreaterThanOrEqual(39);
  expect(placement.display).toBe("flex");
  expect(placement.borderInlineStartWidth).toBe("1px");
  expect(placement.iconMask).not.toBe("none");
});

test("popover keeps viewport placement inside a fixed containing block", async ({ page }) => {
  await page.goto(exampleUrl("runtime-lab.html"), { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const runtime = await import("/dist/gardener.runtime.js");
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;inset:0 0 auto 15rem;height:3.5rem;transform:translateZ(0);backdrop-filter:blur(1px)";
    const trigger = document.createElement("button");
    trigger.id = "fixed-popover-trigger";
    trigger.textContent = "Open";
    trigger.style.cssText = "position:absolute;inset:.5rem .5rem auto auto";
    const panel = document.createElement("div");
    panel.id = "fixed-popover";
    panel.className = "g-popover";
    panel.dataset.gPopover = "";
    panel.dataset.gPlacement = "bottom-end";
    panel.hidden = true;
    panel.style.width = "20rem";
    panel.textContent = "Viewport-safe content";
    host.append(trigger, panel);
    document.body.append(host);
    runtime.init(panel);
    trigger.click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  const bounds = await page.locator("#fixed-popover").evaluate((element) => {
    const panel = element.getBoundingClientRect();
    const trigger = document.querySelector("#fixed-popover-trigger").getBoundingClientRect();
    return { panel: { left: panel.left, right: panel.right }, triggerRight: trigger.right, viewportWidth: innerWidth };
  });
  expect(bounds.panel.left).toBeGreaterThanOrEqual(7.5);
  expect(bounds.panel.right).toBeLessThanOrEqual(bounds.viewportWidth - 7.5);
  expect(Math.abs(bounds.panel.right - bounds.triggerRight)).toBeLessThan(1.5);
});

test("destructive micro-interactions keep keyboard focus in a useful place", async ({ page }) => {
  await page.goto(exampleUrl("data-compositions.html"), { waitUntil: "networkidle" });
  const summary = page.locator("[data-g-filter-summary]");
  await summary.locator("[data-g-clear-selection], .g-filter-summary-clear").click();
  await expect(summary).toBeHidden();
  await expect(page.locator("[data-g-data-view] [data-g-view]").first()).toBeFocused();

  const remove = page.locator("[data-g-builder-list] [data-g-builder-remove]").first();
  await remove.click();
  await expect(page.locator("[data-g-builder-list] [data-g-builder-item]")).toHaveCount(0);
  await expect(page.locator(".g-export-panel input").first()).toBeFocused();
});

test("compact split handles keep a forgiving pointer target and full keyboard control", async ({ page }) => {
  await page.goto(exampleUrl("runtime-lab.html"), { waitUntil: "networkidle" });
  const handle = page.locator(".g-split-handle").first();
  const hitTargetWidth = await handle.evaluate((element) => element.getBoundingClientRect().width);
  expect(hitTargetWidth).toBeGreaterThanOrEqual(17);
  await handle.focus();
  const before = Number(await handle.getAttribute("aria-valuenow"));
  await handle.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", String(before + 2));
  await expect(handle).toBeFocused();
});

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
      hasGardenerimStylesheet: [...document.styleSheets].some(({ href }) =>
        href?.includes("gardener.css"),
      ),
      hasHorizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    }));

    expect(documentState.title).not.toBe("");
    expect(documentState.language).not.toBe("");
    expect(documentState.hasGardenerimStylesheet).toBe(true);
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
