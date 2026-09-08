import { expect, test } from "@playwright/test";
import { collectPageFailures, contentMediaFailures, exampleUrl, releasePages } from "./pages.mjs";
import AxeBuilder from "@axe-core/playwright";

test('content-lab.html serves real PDF and media bytes with correct MIME and ranges',async({request})=>{
  for(const base of ['http://127.0.0.1:4187/examples/','http://127.0.0.1:4188/packages/css/examples/']){
    const pdf=await request.get(base+'content-assets/sample.pdf',{headers:{Range:'bytes=0-3'}});
    expect(pdf.status()).toBe(206);expect(pdf.headers()['content-type']).toBe('application/pdf');expect(pdf.headers()['content-range']).toMatch(/^bytes 0-3\/\d+$/);expect(await pdf.text()).toBe('%PDF');
    const media=await request.get(base+'content-assets/sample.mp4',{headers:{Range:'bytes=0-11'}});
    expect(media.status()).toBe(206);expect(media.headers()['content-type']).toBe('video/mp4');expect((await media.body()).subarray(4,8).toString()).toBe('ftyp');
    const invalid=await request.get(base+'content-assets/sample.pdf',{headers:{Range:'bytes=999999-'}});expect(invalid.status()).toBe(416);
  }
});

test("spinner-skeleton provides sized indicators, overlays, templates, and reduced-motion fallbacks", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    const fixture = document.createElement("section");
    fixture.id = "spinner-skeleton-fixture";
    fixture.style.width = "min(600px, 100%)";
    fixture.innerHTML = `
      <div class="g-spinner g-spinner-large is-loading" role="status" aria-label="Loading"></div>
      <div class="g-spinner g-spinner-dots g-spinner-medium is-loading" role="status" aria-label="Generating"><span class="g-spinner-dot"></span><span class="g-spinner-dot"></span><span class="g-spinner-dot"></span></div>
      <div class="g-spinner g-spinner-overlay g-spinner-large is-loading" role="status" aria-label="Refreshing" aria-busy="true"><div class="g-spinner-content"><button class="g-btn">Unavailable action</button></div><span class="g-spinner-description">Refreshing</span></div>
      <div class="g-spinner g-spinner-skeleton g-spinner-with-avatar g-spinner-active is-loading" role="status" aria-label="Profile loading" aria-busy="true"><div class="g-skeleton-header" aria-hidden="true"><span class="g-skeleton-avatar"></span></div><div class="g-skeleton-content" aria-hidden="true"><span class="g-skeleton-title"></span><div class="g-skeleton-paragraph"><span class="g-skeleton-row"></span><span class="g-skeleton-row" style="--g-skeleton-width:70%"></span></div></div></div>
      <div class="g-spinner g-spinner-skeleton g-spinner-static is-loading" role="status" aria-label="Static placeholder" aria-busy="true"><span class="g-skeleton-image" aria-hidden="true"></span></div>`;
    main.prepend(fixture);
  });

  const fixture = page.locator("#spinner-skeleton-fixture");
  const ring = fixture.locator(".g-spinner-large").first();
  const ringMetrics = await ring.evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height,
    animation: getComputedStyle(element, "::before").animationName,
  }));
  expect(ringMetrics).toEqual({ width: 32, height: 32, animation: "g-spin" });
  await expect(fixture.locator(".g-spinner-dot")).toHaveCount(3);
  const overlay = fixture.locator(".g-spinner-overlay");
  await expect(overlay.locator(".g-spinner-content")).toHaveCSS("opacity", "0.35");
  await expect(overlay.locator(".g-spinner-description")).toBeVisible();
  expect(await fixture.locator(".g-spinner-with-avatar").evaluate((element) => getComputedStyle(element).gridTemplateColumns)).toMatch(/^48px\s/u);
  await expect(fixture.locator(".g-spinner-active .g-skeleton-row").first()).toHaveCSS("animation-name", "g-shimmer");
  await expect(fixture.locator(".g-spinner-static .g-skeleton-image")).toHaveCSS("animation-name", "none");
  const accessibility = await new AxeBuilder({ page }).include("#spinner-skeleton-fixture").analyze();
  expect(accessibility.violations).toEqual([]);

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await ring.evaluate((element) => getComputedStyle(element, "::before").animationName)).toBe("none");
  await expect(fixture.locator(".g-spinner-active .g-skeleton-row").first()).toHaveCSS("animation-name", "none");
});

test("progress-meter and empty-state render complete responsive and semantic structures", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    const fixture = document.createElement("section");
    fixture.id = "progress-empty-fixture";
    fixture.style.width = "min(600px, 100%)";
    fixture.innerHTML = `
      <div class="g-progress" role="progressbar" aria-label="Upload" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" style="--g-progress-value:60%"><span class="g-progress-bar"></span></div>
      <div class="g-progress g-progress-circle" role="progressbar" aria-label="Build" aria-valuemin="0" aria-valuemax="100" aria-valuenow="68" style="--g-progress-value:68%"><span class="g-progress-text">68%</span></div>
      <div class="g-progress g-progress-meter" role="meter" aria-label="Storage" aria-valuemin="0" aria-valuemax="100" aria-valuenow="70"><span class="g-meter-segment" style="--g-meter-value:40%"></span><span class="g-meter-segment" style="--g-meter-value:30%"></span><span class="g-meter-marker" style="--g-meter-marker:85%"></span></div>
      <section class="g-empty g-empty-card g-empty-compact is-no-results" role="status" aria-labelledby="fixture-empty-title" aria-describedby="fixture-empty-description"><div class="g-empty-visual" aria-hidden="true"><span class="g-empty-icon"></span></div><div class="g-empty-content"><h2 id="fixture-empty-title" class="g-empty-title">No results</h2><p id="fixture-empty-description" class="g-empty-description">Try another keyword.</p><div class="g-empty-actions"><button class="g-btn g-btn-primary">Clear filters</button></div></div></section>`;
    main.prepend(fixture);
  });

  const fixture = page.locator("#progress-empty-fixture");
  const line = fixture.locator(".g-progress[role=progressbar]").first();
  const lineWidths = await line.evaluate((root) => ({ root: root.getBoundingClientRect().width, bar: root.querySelector(".g-progress-bar").getBoundingClientRect().width }));
  expect(lineWidths.root).toBe(600);
  expect(Math.abs(lineWidths.bar - 360)).toBeLessThan(1);
  await expect(fixture.locator(".g-progress-circle")).toHaveCSS("width", "64px");
  const circleBackground = await fixture.locator(".g-progress-circle").evaluate((element) => getComputedStyle(element, "::after").backgroundImage);
  expect(circleBackground).toContain("conic-gradient");
  const segmentWidths = await fixture.locator(".g-progress-meter .g-meter-segment").evaluateAll((segments) => segments.map((segment) => segment.getBoundingClientRect().width));
  expect(Math.abs(segmentWidths[0] - 240)).toBeLessThan(1);
  expect(Math.abs(segmentWidths[1] - 180)).toBeLessThan(1);
  await expect(fixture.locator(".g-empty-title")).toHaveText("No results");
  await expect(fixture.locator(".g-empty-actions .g-btn")).toBeVisible();
  const accessibility = await new AxeBuilder({ page }).include("#progress-empty-fixture").analyze();
  expect(accessibility.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileBounds = await fixture.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { left: box.left, right: box.right, viewport: innerWidth };
  });
  expect(mobileBounds.left).toBeGreaterThanOrEqual(0);
  expect(mobileBounds.right).toBeLessThanOrEqual(mobileBounds.viewport + 1);
});

test("badge, tag, and chip keep distinct structures, states, and keyboard focus", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    const fixture = document.createElement("section");
    fixture.id = "label-primitives-fixture";
    fixture.innerHTML = `
      <span class="g-badge g-badge-attached is-danger" aria-label="12 条未读消息">
        <span class="g-avatar">A</span><span class="g-badge-indicator">12</span>
      </span>
      <span class="g-badge g-badge-status is-info is-processing"><span class="g-badge-dot"></span><span class="g-badge-status-text">处理中</span></span>
      <span class="g-tag g-tag-solid is-success">已完成</span>
      <button class="g-tag g-tag-checkable" type="button" aria-pressed="false">可选择</button>
      <span class="g-chip"><span class="g-chip-avatar">林</span><span class="g-chip-label">林默</span><button class="g-chip-remove" type="button" aria-label="移除林默">×</button></span>
      <button class="g-chip g-chip-selectable" type="button" aria-pressed="true">已选择</button>`;
    fixture.querySelector(".g-tag-checkable").addEventListener("click", (event) => event.currentTarget.setAttribute("aria-pressed", "true"));
    main.prepend(fixture);
  });

  const fixture = page.locator("#label-primitives-fixture");
  await expect(fixture.locator(".g-badge-indicator")).toHaveCSS("position", "absolute");
  await expect(fixture.locator(".g-tag-solid")).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(fixture.locator(".g-chip-selectable")).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(fixture.locator("button button")).toHaveCount(0);
  const tag = fixture.getByRole("button", { name: "可选择", exact: true });
  await tag.focus();
  await expect(tag).toBeFocused();
  await tag.press("Enter");
  await expect(tag).toHaveAttribute("aria-pressed", "true");
});

test("avatar supports content, fit, presence, fallback, interaction, and independent groups", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    const fixture = document.createElement("section");
    fixture.id = "avatar-fixture";
    fixture.innerHTML = `
      <span id="avatar-text" class="g-avatar g-avatar-xl g-avatar-rounded"><span class="g-avatar-text">林默</span></span>
      <span id="avatar-image" class="g-avatar g-avatar-xl g-avatar-square g-avatar-fit-contain"><img alt="林默" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='40'%3E%3Crect width='20' height='40' fill='%23165dff'/%3E%3C/svg%3E"></span>
      <span id="avatar-online" class="g-avatar g-avatar-status is-online" role="img" aria-label="林默，在线"><span class="g-avatar-text">林</span></span>
      <button id="avatar-action" class="g-avatar g-avatar-interactive" type="button" aria-label="选择林默"><span class="g-avatar-text">林</span></button>
      <span id="avatar-loading" class="g-avatar g-avatar-loading" aria-label="头像加载中" aria-busy="true"><span class="g-avatar-text">林</span></span>
      <div id="avatar-group" class="g-avatar-group" role="group" aria-label="项目成员"><span class="g-avatar">林</span><span class="g-avatar">周</span><span class="g-avatar">苏</span><span class="g-avatar g-avatar-overflow" aria-label="另有 5 人">+5</span></div>`;
    main.prepend(fixture);
  });

  const textAvatar = page.locator("#avatar-text");
  const textBox = await textAvatar.boundingBox();
  expect(textBox?.width).toBe(80);
  expect(textBox?.height).toBe(80);
  await expect(textAvatar).toHaveCSS("border-radius", "6px");
  await expect(page.locator("#avatar-image img")).toHaveCSS("object-fit", "contain");
  await expect(page.locator("#avatar-online")).toHaveCSS("overflow", "visible");
  const statusColors = await page.locator("#avatar-online").evaluate((node) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--g-color-success)";
    node.append(probe);
    const result = { dot: getComputedStyle(node, "::after").backgroundColor, token: getComputedStyle(probe).color };
    probe.remove();
    return result;
  });
  expect(statusColors.dot).toBe(statusColors.token);

  const action = page.locator("#avatar-action");
  await action.focus();
  await expect(action).toBeFocused();
  await action.press("Enter");
  await expect(page.locator("#avatar-loading")).toHaveAttribute("aria-busy", "true");

  const group = page.locator("#avatar-group");
  const groupBox = await group.boundingBox();
  expect(groupBox?.width).toBeLessThan(160);
  await expect(group).not.toHaveClass(/g-avatar\s/);
  expect((await new AxeBuilder({ page }).include("#avatar-fixture").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("divider supports full lines, titled positions, line styles, spacing, and vertical separators", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    const fixture = document.createElement("section");
    fixture.id = "divider-fixture";
    fixture.style.cssText = "width:640px;max-width:90vw";
    fixture.innerHTML = `
      <div id="divider-empty" class="g-divider" role="separator" aria-orientation="horizontal"></div>
      <div id="divider-start" class="g-divider g-divider-start g-divider-dashed" role="separator" aria-labelledby="divider-title"><span id="divider-title" class="g-divider-text">Section title</span></div>
      <div id="divider-double" class="g-divider g-divider-double g-divider-large" aria-hidden="true"></div>
      <div style="display:flex;align-items:center;height:40px">Overview<div id="divider-vertical" class="g-divider g-divider-vertical g-divider-stretch" role="separator" aria-orientation="vertical"></div>Settings</div>`;
    main.prepend(fixture);
  });

  const empty = page.locator("#divider-empty");
  const start = page.locator("#divider-start");
  const double = page.locator("#divider-double");
  const vertical = page.locator("#divider-vertical");
  expect((await empty.boundingBox())?.width).toBeGreaterThan(600);
  expect(await empty.evaluate((node) => getComputedStyle(node, "::after").display)).toBe("none");
  expect(await start.evaluate((node) => getComputedStyle(node, "::before").borderTopStyle)).toBe("dashed");
  const rails = await start.evaluate((node) => ({
    before: getComputedStyle(node, "::before").flexBasis,
    after: getComputedStyle(node, "::after").flexBasis,
  }));
  expect(rails.before).not.toBe(rails.after);
  expect(await double.evaluate((node) => getComputedStyle(node, "::before").borderTopStyle)).toBe("double");
  expect(parseFloat(await double.evaluate((node) => getComputedStyle(node).marginTop))).toBeGreaterThan(20);
  const verticalBox = await vertical.boundingBox();
  expect(verticalBox?.width).toBeLessThanOrEqual(2);
  expect(verticalBox?.height).toBeGreaterThanOrEqual(38);
  expect(await vertical.textContent()).toBe("");
  expect((await new AxeBuilder({ page }).include("#divider-fixture").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("alert keeps full-width structured content, semantic colors, actions, banners, and loading feedback", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    const fixture = document.createElement("section");
    fixture.id = "alert-fixture";
    fixture.style.cssText = "width:640px;max-width:90vw;display:grid;gap:12px";
    fixture.innerHTML = `
      <div id="alert-info" class="g-alert is-info" role="status" aria-live="polite"><div class="g-alert-body"><p class="g-alert-content">System maintenance tonight.</p></div></div>
      <div id="alert-title" class="g-alert g-alert-with-title is-warning" role="status" aria-labelledby="alert-fixture-title" aria-describedby="alert-fixture-content"><div class="g-alert-body"><strong id="alert-fixture-title" class="g-alert-title">Storage almost full</strong><p id="alert-fixture-content" class="g-alert-description">Uploads will pause at the limit.</p></div><div class="g-alert-actions"><button type="button">Upgrade</button></div><button class="g-alert-close" type="button" aria-label="Close storage warning">×</button></div>
      <div id="alert-filled" class="g-alert g-alert-filled is-success" role="status"><div class="g-alert-body"><p class="g-alert-content">Saved successfully.</p></div></div>
      <div id="alert-banner" class="g-alert g-alert-banner is-info" role="status"><div class="g-alert-body"><p class="g-alert-content">Service announcement.</p></div></div>
      <div id="alert-loading" class="g-alert is-loading" role="status" aria-live="polite" aria-busy="true"><div class="g-alert-body"><p class="g-alert-content">Validating files.</p></div></div>`;
    main.prepend(fixture);
  });

  const info = page.locator("#alert-info");
  const titleAlert = page.locator("#alert-title");
  const filled = page.locator("#alert-filled");
  const banner = page.locator("#alert-banner");
  const loading = page.locator("#alert-loading");
  expect((await info.boundingBox())?.width).toBeGreaterThan(600);
  const semanticColors = await info.evaluate((node) => ({
    icon: getComputedStyle(node, "::before").backgroundColor,
    content: getComputedStyle(node.querySelector(".g-alert-content")).color,
  }));
  expect(semanticColors.icon).not.toBe(semanticColors.content);
  const titleColors = await titleAlert.evaluate((node) => ({
    title: getComputedStyle(node.querySelector(".g-alert-title")).color,
    content: getComputedStyle(node.querySelector(".g-alert-content, .g-alert-description")).color,
  }));
  expect(titleColors.title).not.toBe(titleColors.content);
  await expect(filled.locator(".g-alert-content")).toHaveCSS("color", "rgba(255, 255, 255, 0.88)");
  await expect(banner).toHaveCSS("border-radius", "0px");
  await expect(banner).toHaveCSS("border-top-width", "0px");
  const close = titleAlert.getByRole("button", { name: "Close storage warning" });
  await close.focus();
  await expect(close).toBeFocused();
  expect(await loading.evaluate((node) => getComputedStyle(node, "::before").animationName)).toBe("g-spin");
  await expect(loading).toHaveAttribute("aria-busy", "true");
  expect((await new AxeBuilder({ page }).include("#alert-fixture").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

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

test("status bar supports application groups, semantic items, progress, density, and responsive overflow", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="/dist/gardener.css"></head><body>
    <div style="width:720px;position:relative">
      <div class="g-status-bar g-status-bar-primary g-status-bar-comfortable g-status-bar-responsive" role="toolbar" aria-label="Workspace status">
        <span class="g-status-bar-progress" style="--g-status-bar-progress:68%" aria-hidden="true"></span>
        <div class="g-status-bar-section is-start">
          <button class="g-status-bar-item is-current" aria-current="true"><span class="g-status-bar-icon">⑂</span><span class="g-status-bar-label">main</span></button>
          <button class="g-status-bar-item is-danger" aria-label="2 errors"><span class="g-status-bar-value">2</span></button>
        </div>
        <div class="g-status-bar-section is-center"><span class="g-status-bar-item g-status-bar-secondary">Checks passed</span></div>
        <div class="g-status-bar-section is-end"><button class="g-status-bar-item g-status-bar-secondary">Ln 18, Col 24</button><button class="g-status-bar-item">UTF-8</button></div>
      </div>
      <div class="g-status-bar g-status-bar-bordered is-loading" role="status" aria-live="polite" aria-busy="true"><span class="g-status-bar-item is-loading"><span class="g-status-bar-icon">↻</span><span>Indexing</span></span></div>
    </div></body></html>`);
  const primary = page.locator(".g-status-bar-primary");
  const layout = await primary.evaluate((element) => {
    const style = getComputedStyle(element);
    const start = element.querySelector(".is-start").getBoundingClientRect();
    const end = element.querySelector(".is-end").getBoundingClientRect();
    const progress = getComputedStyle(element.querySelector(".g-status-bar-progress"), "::after");
    return { display: style.display, height: element.getBoundingClientRect().height, startLeft: start.left, endRight: end.right, rootRight: element.getBoundingClientRect().right, progressWidth: parseFloat(progress.width) };
  });
  expect(layout.display).toBe("flex");
  expect(layout.height).toBeGreaterThanOrEqual(39);
  expect(Math.abs(layout.endRight - layout.rootRight)).toBeLessThanOrEqual(9);
  expect(layout.progressWidth).toBeGreaterThan(450);
  await expect(primary.locator(".is-danger")).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(page.locator(".g-status-bar.is-loading")).toHaveAttribute("aria-busy", "true");

  await page.setViewportSize({ width: 390, height: 700 });
  await expect(primary.locator(".g-status-bar-secondary").first()).toBeHidden();
  const accessibility = await new AxeBuilder({ page }).include(".g-status-bar").analyze();
  expect(accessibility.violations).toEqual([]);
});

test("context bar supports structured messages, semantic icons, actionable reflow, progress, and contrast", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="/dist/gardener.css"></head><body>
    <main class="g-page-component-container" style="width:720px;max-width:100%">
      <div class="g-context-bar g-context-bar-soft g-context-bar-with-title is-warning" role="region" aria-labelledby="ctx-title" aria-describedby="ctx-description">
        <div class="g-context-bar-body"><strong id="ctx-title" class="g-context-bar-title">Storage almost full</strong><span id="ctx-description" class="g-context-bar-description">Only eight percent remains. Large uploads may fail unless unused assets are removed.</span></div>
        <div class="g-context-bar-actions"><button class="g-context-bar-action">Manage storage</button><a class="g-context-bar-link" href="#details">Learn more</a></div>
        <button class="g-context-bar-close" aria-label="Close message">×</button>
      </div>
      <div class="g-context-bar g-context-bar-filled is-error" role="alert"><div class="g-context-bar-body"><strong class="g-context-bar-title">Connection lost</strong></div><div class="g-context-bar-actions"><button class="g-context-bar-action">Retry</button></div></div>
      <div class="g-context-bar g-context-bar-soft is-loading" role="status" aria-live="polite" aria-busy="true" style="--g-context-progress:64%"><div class="g-context-bar-body"><span class="g-context-bar-description">Applying filters</span></div><span class="g-context-bar-progress" aria-hidden="true"></span></div>
    </main></body></html>`);
  const warning = page.locator(".g-context-bar.is-warning");
  const desktop = await warning.evaluate((element) => {
    const root = element.getBoundingClientRect();
    const actions = element.querySelector(".g-context-bar-actions").getBoundingClientRect();
    const icon = getComputedStyle(element, "::before");
    return { display: getComputedStyle(element).display, width: root.width, actionTop: actions.top, rootTop: root.top, iconMask: icon.maskImage || icon.webkitMaskImage, overflow: element.scrollWidth - element.clientWidth };
  });
  expect(desktop.display).toBe("grid");
  expect(desktop.width).toBeGreaterThan(690);
  expect(desktop.iconMask).not.toBe("none");
  expect(desktop.overflow).toBeLessThanOrEqual(0);
  await expect(page.locator(".g-context-bar-filled")).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(page.locator(".g-context-bar.is-loading")).toHaveAttribute("aria-busy", "true");
  const progressWidth = await page.locator(".g-context-bar-progress").evaluate((element) => parseFloat(getComputedStyle(element, "::after").width));
  expect(progressWidth).toBeGreaterThan(430);

  await page.setViewportSize({ width: 390, height: 700 });
  const mobile = await warning.evaluate((element) => {
    const body = element.querySelector(".g-context-bar-body").getBoundingClientRect();
    const actions = element.querySelector(".g-context-bar-actions").getBoundingClientRect();
    return { bodyBottom: body.bottom, actionsTop: actions.top, overflow: element.scrollWidth - element.clientWidth };
  });
  expect(mobile.actionsTop).toBeGreaterThanOrEqual(mobile.bodyBottom);
  expect(mobile.overflow).toBeLessThanOrEqual(0);
  const accessibility = await new AxeBuilder({ page }).include(".g-context-bar").analyze();
  expect(accessibility.violations).toEqual([]);
});

test("page loading supports page, overlay, determinate progress, lifecycle states, motion preferences, and mobile reflow", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="/dist/gardener.css"></head><body>
    <main style="width:720px;max-width:100%;padding:16px">
      <div class="g-page-loading g-page-loading-contained g-page-loading-large is-determinate" role="status" aria-live="polite" aria-busy="true" aria-labelledby="loading-title" style="--g-page-loading-progress:64%">
        <div class="g-page-loading-content"><strong id="loading-title" class="g-page-loading-title">Importing customers</strong><span class="g-page-loading-description">Validating fields and writing records.</span>
          <div class="g-page-loading-progress-wrap"><div class="g-page-loading-progress-header"><span>640 of 1000</span><strong class="g-page-loading-progress-value">64%</strong></div><div class="g-page-loading-progress" role="progressbar" aria-label="Import progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64"></div></div>
          <ol class="g-page-loading-steps"><li class="g-page-loading-step is-complete">Upload</li><li class="g-page-loading-step is-current" aria-current="step">Validate</li><li class="g-page-loading-step">Write</li></ol>
          <div class="g-page-loading-actions"><button class="g-page-loading-action">Pause</button><button class="g-page-loading-action">Cancel</button></div>
        </div>
      </div>
      <div class="g-page-loading-host" style="height:220px;margin-top:16px"><div class="g-page-loading-container"><button>Underlying action</button><p>Existing page content</p></div><div class="g-page-loading g-page-loading-overlay is-loading" role="status" aria-label="Refreshing orders" aria-busy="true"><div class="g-page-loading-content"><strong class="g-page-loading-title">Refreshing orders</strong></div></div></div>
      <div class="g-page-loading g-page-loading-compact g-page-loading-small is-success" role="status" aria-label="Loading complete"><div class="g-page-loading-content"><strong class="g-page-loading-title">Complete</strong></div></div>
    </main></body></html>`);
  const determinate = page.locator(".g-page-loading.is-determinate");
  await expect(determinate).toHaveCSS("display", "grid");
  await expect(determinate).toHaveAttribute("aria-busy", "true");
  const layout = await determinate.evaluate((element) => {
    const progress = element.querySelector(".g-page-loading-progress");
    const root = element.getBoundingClientRect();
    return {
      overflow: element.scrollWidth - element.clientWidth,
      progressWidth: parseFloat(getComputedStyle(progress, "::after").width),
      trackWidth: progress.getBoundingClientRect().width,
      indicatorAnimation: getComputedStyle(element.querySelector(".g-page-loading-content"), "::before").animationName,
      height: root.height,
    };
  });
  expect(layout.progressWidth / layout.trackWidth).toBeGreaterThan(.61);
  expect(layout.progressWidth / layout.trackWidth).toBeLessThan(.67);
  expect(layout.indicatorAnimation).toContain("g-page-loading-spin");
  expect(layout.height).toBeGreaterThan(260);
  expect(layout.overflow).toBeLessThanOrEqual(0);
  await expect(page.locator(".g-page-loading-host > .g-page-loading-container")).toHaveCSS("pointer-events", "none");
  const overlay = await page.locator(".g-page-loading-overlay").evaluate((element) => ({ position: getComputedStyle(element).position, inset: [getComputedStyle(element).top, getComputedStyle(element).right, getComputedStyle(element).bottom, getComputedStyle(element).left], height: element.getBoundingClientRect().height }));
  expect(overlay.position).toBe("absolute");
  expect(overlay.inset).toEqual(["0px", "0px", "0px", "0px"]);
  expect(overlay.height).toBeGreaterThan(210);
  const successIcon = await page.locator(".g-page-loading.is-success .g-page-loading-content").evaluate((element) => getComputedStyle(element, "::before").maskImage || getComputedStyle(element, "::before").webkitMaskImage);
  expect(successIcon).not.toBe("none");

  await page.setViewportSize({ width: 390, height: 700 });
  const mobile = await determinate.evaluate((element) => ({ overflow: element.scrollWidth - element.clientWidth, actionWidth: element.querySelector(".g-page-loading-action").getBoundingClientRect().width }));
  expect(mobile.overflow).toBeLessThanOrEqual(0);
  expect(mobile.actionWidth).toBeGreaterThan(100);
  const accessibility = await new AxeBuilder({ page }).include("main").analyze();
  expect(accessibility.violations).toEqual([]);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reduced = await determinate.evaluate((element) => ({ spinner: getComputedStyle(element.querySelector(".g-page-loading-content"), "::before").animationName, transition: getComputedStyle(element.querySelector(".g-page-loading-progress"), "::after").transitionDuration }));
  expect(reduced.spinner).toBe("none");
  expect(parseFloat(reduced.transition)).toBeLessThanOrEqual(.001);
});

test("page state system supports generated scenario classes, semantic visuals, recovery content, responsive layouts, and accessibility", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="/dist/gardener.css"></head><body>
    <main class="g-page-component-container" style="width:760px;max-width:100%;padding:16px">
      <div class="g-page-state g-page-state-success g-page-state-card g-page-state-compact is-success" role="status" aria-live="polite"><div class="g-page-state-content"><div class="g-page-state-visual" aria-hidden="true"></div><div class="g-page-state-body"><h2 class="g-page-state-title">Published successfully</h2><p class="g-page-state-description">Version 2.1 is available.</p><div class="g-page-state-actions"><button class="g-page-state-action g-page-state-primary-action">View version</button></div></div></div></div>
      <div class="g-page-state g-page-state-403 g-page-state-split g-page-state-card is-forbidden" role="region" aria-labelledby="forbidden-title" aria-describedby="forbidden-description"><div class="g-page-state-content"><div class="g-page-state-visual" aria-hidden="true"></div><div class="g-page-state-body"><span class="g-page-state-eyebrow">Access restricted</span><strong class="g-page-state-code">403</strong><h2 id="forbidden-title" class="g-page-state-title">You do not have access</h2><p id="forbidden-description" class="g-page-state-description">Request permission or return to your workspace.</p><div class="g-page-state-actions"><button class="g-page-state-action g-page-state-primary-action">Request access</button><button class="g-page-state-action">Go back</button></div></div></div></div>
      <div class="g-page-state g-page-state-404 g-page-state-card is-not-found" role="region" aria-label="Page not found"><div class="g-page-state-content"><div class="g-page-state-visual" aria-hidden="true"></div><strong class="g-page-state-code">404</strong><h2 class="g-page-state-title">Page not found</h2><ul class="g-page-state-suggestions"><li><a class="g-page-state-suggestion" href="#projects"><strong>Projects</strong><small>Browse recent projects</small></a></li><li><a class="g-page-state-suggestion" href="#help"><strong>Help center</strong><small>Search documentation</small></a></li></ul></div></div>
      <div class="g-page-state g-page-state-500 g-page-state-card is-server-error" role="alert" aria-labelledby="server-title"><div class="g-page-state-content"><div class="g-page-state-visual" aria-hidden="true"></div><h2 id="server-title" class="g-page-state-title">Server unavailable</h2><div class="g-page-state-metadata"><span class="g-page-state-request-id">req_7F2A91</span></div><details class="g-page-state-details"><summary class="g-page-state-detail-summary">Technical details</summary><div class="g-page-state-detail-body">HTTP 500 · gateway unavailable</div></details></div></div>
      <div class="g-page-state g-page-state-no-results g-page-state-inline" role="status"><div class="g-page-state-content"><div class="g-page-state-visual" aria-hidden="true"></div><div class="g-page-state-body"><h2 class="g-page-state-title">No matching results</h2><p class="g-page-state-description">Clear filters and try again.</p></div><div class="g-page-state-actions"><button class="g-page-state-action">Clear filters</button></div></div></div>
      <a id="global-link-contract" class="g-underline" href="#contract">Global link contract</a>
    </main></body></html>`);
  const forbidden = page.locator(".g-page-state-403");
  const desktop = await forbidden.evaluate((element) => {
    const content = element.querySelector(".g-page-state-content");
    const visual = element.querySelector(".g-page-state-visual");
    return { columns: getComputedStyle(content).gridTemplateColumns.split(" ").length, overflow: element.scrollWidth - element.clientWidth, mask: getComputedStyle(visual, "::before").maskImage || getComputedStyle(visual, "::before").webkitMaskImage, radius: getComputedStyle(visual).borderRadius };
  });
  expect(desktop.columns).toBe(2);
  expect(desktop.overflow).toBeLessThanOrEqual(0);
  expect(desktop.mask).not.toBe("none");
  expect(desktop.radius).toBe("50%");
  const errorMask = await page.locator(".g-page-state-500 .g-page-state-visual").evaluate((element) => getComputedStyle(element, "::before").maskImage || getComputedStyle(element, "::before").webkitMaskImage);
  expect(errorMask).not.toBe(desktop.mask);
  const notFoundMask = await page.locator(".g-page-state-404 .g-page-state-visual").evaluate((element) => getComputedStyle(element, "::before").maskImage || getComputedStyle(element, "::before").webkitMaskImage);
  expect(notFoundMask).not.toBe(errorMask);
  expect(decodeURIComponent(notFoundMask)).toContain("M16 17a4.5 4.5 0 0 1 8.5 2c.8 3.7-4.5 4.4-4.5 7.5V28m0 3v.5");
  await expect(page.locator(".g-page-state-primary-action").first()).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.locator(".g-page-state-detail-summary").click();
  await expect(page.locator(".g-page-state-details")).toHaveAttribute("open", "");
  const requestIdSelection = await page.locator(".g-page-state-request-id").evaluate((element) => {
    const styles = getComputedStyle(element);
    return [styles.userSelect, styles.getPropertyValue("-webkit-user-select")];
  });
  expect(requestIdSelection).toContain("all");
  await expect(page.locator(".g-page-state-suggestion").first()).toHaveCSS("text-decoration-line", "none");
  await expect(page.locator("#global-link-contract")).toHaveCSS("text-decoration-line", "none");
  const inline = await page.locator(".g-page-state-inline").evaluate((element) => ({ minHeight: getComputedStyle(element).minHeight, columns: getComputedStyle(element.querySelector(".g-page-state-content")).gridTemplateColumns.split(" ").length }));
  expect(inline.minHeight).toBe("0px");
  expect(inline.columns).toBe(3);

  await page.setViewportSize({ width: 390, height: 780 });
  const mobile = await forbidden.evaluate((element) => ({ columns: getComputedStyle(element.querySelector(".g-page-state-content")).gridTemplateColumns.split(" ").length, overflow: element.scrollWidth - element.clientWidth }));
  expect(mobile.columns).toBe(1);
  expect(mobile.overflow).toBeLessThanOrEqual(0);
  const inlineMobile = await page.locator(".g-page-state-inline").evaluate((element) => ({ columns: getComputedStyle(element.querySelector(".g-page-state-content")).gridTemplateColumns.split(" ").length, overflow: element.scrollWidth - element.clientWidth }));
  expect(inlineMobile.columns).toBe(2);
  expect(inlineMobile.overflow).toBeLessThanOrEqual(0);
  const accessibility = await new AxeBuilder({ page }).include("main").analyze();
  expect(accessibility.violations).toEqual([]);
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

test("toast runtime supports loading, bottom placement, id updates, actions, queues, and reduced motion", async ({ page }) => {
  await page.goto(exampleUrl("runtime-lab.html"), { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const runtime = await import("/dist/gardener.runtime.js");
    runtime.toast.clear();
    runtime.toast.config({ timeout: 0, maxCount: 3, closable: true, showIcon: true });
    runtime.toast({ id: "sync", tone: "loading", message: "Syncing", position: "bottom", timeout: 0 });
    runtime.toast({ message: "One", maxCount: 2, timeout: 0 });
    runtime.toast({ message: "Two", maxCount: 2, timeout: 0 });
    runtime.toast({ message: "Three", maxCount: 2, timeout: 0 });
  });
  const bottom = page.locator('.g-toast-region[data-g-position="bottom"]');
  const loading = bottom.locator(".g-toast-loading");
  await expect(loading).toBeVisible();
  await expect(loading).toHaveAttribute("aria-busy", "true");
  await expect(loading).toHaveCSS("position", "relative");
  expect(await loading.evaluate((element) => getComputedStyle(element, "::before").animationName)).toBe("g-toast-spin");
  const bottomPlacement = await bottom.evaluate((element) => ({ top: element.getBoundingClientRect().top, height: element.getBoundingClientRect().height, viewport: innerHeight }));
  expect(bottomPlacement.top + bottomPlacement.height).toBeLessThan(bottomPlacement.viewport);
  await expect(page.locator('.g-toast-region[data-g-position="top"] > .g-toast')).toHaveCount(2);

  await page.evaluate(async () => {
    const runtime = await import("/dist/gardener.runtime.js");
    const before = document.querySelector('[data-g-toast-id="sync"]');
    const after = runtime.toast({ id: "sync", tone: "success", message: "Synced", position: "bottom", timeout: 0 });
    after.dataset.sameNode = String(before === after);
    runtime.toast({ message: "Archived", actionLabel: "Undo", actionClose: true, timeout: 0, onAction: () => { document.body.dataset.toastAction = "done"; } });
  });
  const updated = bottom.locator('[data-g-toast-id="sync"]');
  await expect(updated).toHaveAttribute("data-same-node", "true");
  await expect(updated).toHaveClass(/g-toast-success/u);
  await expect(updated).not.toHaveAttribute("aria-busy", "true");
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-toast-action", "done");
  const accessibility = await new AxeBuilder({ page }).include(".g-toast-region").analyze();
  expect(accessibility.violations).toEqual([]);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(async () => {
    const runtime = await import("/dist/gardener.runtime.js");
    runtime.toast({ tone: "loading", message: "Reduced motion", timeout: 0 });
  });
  expect(await page.locator('.g-toast-loading').last().evaluate((element) => getComputedStyle(element, "::before").animationName)).toBe("none");
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

test("button choice groups keep Chinese labels horizontal and preserve intrinsic width", async ({ page }) => {
  await page.goto(exampleUrl("form-compositions.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    const fixture = document.createElement("section");
    fixture.id = "button-choice-group-fixture";
    fixture.style.width = "min(720px, 100%)";
    fixture.innerHTML = `
      <fieldset class="g-check-group g-check-group-buttons">
        <legend class="g-choice-group-legend">可见列</legend>
        <label class="g-check"><input type="checkbox" checked>列表</label>
        <label class="g-check"><input type="checkbox">看板</label>
        <label class="g-check"><input type="checkbox">时间线</label>
      </fieldset>`;
    main.prepend(fixture);
  });

  const metrics = await page.locator("#button-choice-group-fixture .g-check-group-buttons").evaluate((group) => {
    const labels = [...group.querySelectorAll(".g-check")];
    return {
      viewportWidth: innerWidth,
      groupWidth: group.getBoundingClientRect().width,
      labels: labels.map((label) => {
        const bounds = label.getBoundingClientRect();
        const style = getComputedStyle(label);
        return { width: bounds.width, height: bounds.height, top: Math.round(bounds.top), whiteSpace: style.whiteSpace, wordBreak: style.wordBreak };
      }),
    };
  });
  expect(metrics.groupWidth).toBeGreaterThan(160);
  if (metrics.viewportWidth > 578) expect(new Set(metrics.labels.map(({ top }) => top)).size).toBe(1);
  expect(metrics.labels.every(({ width, height, whiteSpace, wordBreak }) => width > 40 && height <= 36 && whiteSpace === "nowrap" && wordBreak === "keep-all")).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  const narrowMetrics = await page.locator("#button-choice-group-fixture .g-check-group-buttons").evaluate((group) => ({
    groupWidth: group.getBoundingClientRect().width,
    labels: [...group.querySelectorAll(".g-check")].map((label) => {
      const bounds = label.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    }),
  }));
  expect(narrowMetrics.groupWidth).toBeGreaterThan(300);
  expect(narrowMetrics.labels.every(({ width, height }) => width > 120 && height <= 44)).toBe(true);
});

test("switch rows fill constrained parents without collapsing Chinese content", async ({ page }) => {
  await page.goto(exampleUrl("form-compositions.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    const fixture = document.createElement("section");
    fixture.id = "switch-row-width-fixture";
    fixture.style.cssText = "display:grid;justify-items:start;width:min(720px,100%)";
    fixture.innerHTML = `
      <div class="g-switch-row">
        <div class="g-switch-row-content">
          <strong class="g-switch-row-title">自动保存</strong>
          <span class="g-switch-row-description">编辑时每 30 秒保存一次草稿</span>
        </div>
        <label class="g-switch"><input type="checkbox" checked aria-label="自动保存"><span class="g-switch-track"></span></label>
      </div>
      <div class="g-switch-row">
        <div class="g-switch-row-content">
          <strong class="g-switch-row-title">桌面通知</strong>
          <span class="g-switch-row-description">仅发送系统权限、正常评审和发布结果</span>
        </div>
        <label class="g-switch"><input type="checkbox" aria-label="桌面通知"><span class="g-switch-track"></span></label>
      </div>`;
    main.prepend(fixture);
  });

  const measure = () => page.locator("#switch-row-width-fixture").evaluate((fixture) => {
    const fixtureWidth = fixture.getBoundingClientRect().width;
    return [...fixture.querySelectorAll(".g-switch-row")].map((row) => {
      const content = row.querySelector(".g-switch-row-content");
      const title = row.querySelector(".g-switch-row-title");
      const description = row.querySelector(".g-switch-row-description");
      const toggle = row.querySelector(".g-switch");
      return {
        fixtureWidth,
        rowWidth: row.getBoundingClientRect().width,
        contentWidth: content.getBoundingClientRect().width,
        titleHeight: title.getBoundingClientRect().height,
        descriptionHeight: description.getBoundingClientRect().height,
        toggleRight: toggle.getBoundingClientRect().right,
        rowRight: row.getBoundingClientRect().right,
      };
    });
  });

  let metrics = await measure();
  expect(metrics.every(({ fixtureWidth, rowWidth, contentWidth, titleHeight, descriptionHeight, toggleRight, rowRight }) => rowWidth >= fixtureWidth - 1 && contentWidth > 300 && titleHeight < 24 && descriptionHeight < 24 && Math.abs(toggleRight - rowRight) < 1.5)).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  metrics = await measure();
  expect(metrics.every(({ fixtureWidth, rowWidth, contentWidth, titleHeight, descriptionHeight, toggleRight, rowRight }) => rowWidth >= fixtureWidth - 1 && contentWidth > 220 && titleHeight < 24 && descriptionHeight < 44 && Math.abs(toggleRight - rowRight) < 1.5)).toBe(true);
});

test("input provides filled defaults, exact sizing, validation, affixes, groups, and actions", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate((main) => {
    const fixture = document.createElement("section");
    fixture.id = "input-fixture";
    fixture.style.width = "min(720px, 100%)";
    fixture.innerHTML = `
      <label>Default<input class="g-input" aria-label="Default input" placeholder="Type here"></label>
      <label>Outlined<input class="g-input g-input-outlined" aria-label="Outlined input" value="Outlined"></label>
      <div id="input-sizes"><input class="g-input g-input-mini" aria-label="Mini input"><input class="g-input g-input-small" aria-label="Small input"><input class="g-input g-input-medium" aria-label="Medium input"><input class="g-input g-input-large" aria-label="Large input"></div>
      <label>Error<input class="g-input is-error" aria-label="Error input" aria-invalid="true" aria-describedby="input-error"><span id="input-error">Name already exists</span></label>
      <label>Affix<span class="g-input-affix"><span class="g-input-prefix" aria-hidden="true">@</span><input class="g-input" aria-label="Affix input"><button id="clear-input" class="g-input-clear" type="button" aria-label="Clear input">×</button></span></label>
      <label>Loading<span class="g-input-affix is-loading" aria-busy="true"><input class="g-input" aria-label="Loading input" value="Checking" readonly><span class="g-input-spinner" aria-hidden="true"></span></span></label>
      <label>Website<span class="g-input-group g-input-group-block"><span class="g-input-prepend">https://</span><input class="g-input" aria-label="Website"><span class="g-input-append">.dev</span></span></label>
      <label>Budget<span class="g-money-control"><input class="g-input" aria-label="Budget" value="12,800"><span class="g-money-symbol">CNY</span></span></label>
      <form class="g-search-field g-search-field-button" role="search"><span class="g-search-field-icon" aria-hidden="true">⌕</span><input class="g-input" type="search" aria-label="Search"><button class="g-search-field-action" type="submit">Search</button></form>`;
    fixture.querySelector("#clear-input").addEventListener("click", ({ currentTarget }) => {
      const input = currentTarget.parentElement.querySelector("input");
      input.value = "";
      input.focus();
    });
    fixture.querySelector(".g-input-affix input").value = "Clear me";
    main.prepend(fixture);
  });

  const fixture = page.locator("#input-fixture");
  const defaultInput = fixture.getByRole("textbox", { name: "Default input" });
  const defaultStyle = await defaultInput.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    background: getComputedStyle(element).backgroundColor,
    border: getComputedStyle(element).borderTopColor,
  }));
  expect(defaultStyle.height).toBe(32);
  expect(defaultStyle.background).not.toBe("rgba(0, 0, 0, 0)");
  expect(defaultStyle.border).toBe("rgba(0, 0, 0, 0)");
  const heights = await fixture.locator("#input-sizes .g-input").evaluateAll((inputs) => inputs.map((input) => input.getBoundingClientRect().height));
  expect(heights).toEqual([24, 28, 32, 36]);

  await defaultInput.focus();
  expect(await defaultInput.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  await expect(fixture.locator(".g-input.is-error")).toHaveAttribute("aria-invalid", "true");
  await expect(fixture.locator(".g-input-spinner")).toHaveCSS("animation-name", "g-spin");
  await expect(fixture.locator(".g-input-group")).toHaveCSS("display", "flex");
  const inputGroupHeights = await fixture.locator(".g-input-group").evaluate((group) => ({
    input: group.querySelector(".g-input").getBoundingClientRect().height,
    addon: group.querySelector(".g-input-prepend").getBoundingClientRect().height,
  }));
  expect(inputGroupHeights.addon).toBeLessThanOrEqual(inputGroupHeights.input);
  const moneyHeights = await fixture.locator(".g-money-control").evaluate((control) => ({
    input: control.querySelector(".g-input").getBoundingClientRect().height,
    addon: control.querySelector(".g-money-symbol").getBoundingClientRect().height,
  }));
  expect(moneyHeights.addon).toBeLessThanOrEqual(moneyHeights.input);
  await expect(fixture.locator(".g-search-field-action")).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(fixture.locator(".g-search-field-icon")).toHaveCSS("width", "20px");
  await expect(fixture.locator(".g-search-field-icon")).toHaveCSS("height", "20px");
  await expect(fixture.locator(".g-search-field-icon")).toHaveCSS("font-size", "0px");
  const searchInput = fixture.getByRole("searchbox", { name: "Search" });
  await searchInput.focus();
  await expect(searchInput).toHaveCSS("box-shadow", "none");
  await expect(fixture.locator(".g-search-field-action")).toHaveCSS("font-size", "12px");
  await expect(fixture.locator(".g-search-field-action")).toHaveCSS("white-space", "nowrap");
  const searchIconLayout = await fixture.locator(".g-search-field").evaluate((field) => {
    const icon = field.querySelector(".g-search-field-icon").getBoundingClientRect();
    const input = field.querySelector(".g-input").getBoundingClientRect();
    return { iconCenter: icon.left + icon.width / 2, inputLeft: input.left, inputRight: input.right };
  });
  expect(searchIconLayout.iconCenter).toBeGreaterThan(searchIconLayout.inputLeft);
  expect(searchIconLayout.iconCenter).toBeLessThan(searchIconLayout.inputRight);
  const searchButtonBox = await fixture.locator(".g-search-field-action").evaluate((element) => ({ height: element.getBoundingClientRect().height, scrollHeight: element.scrollHeight }));
  expect(searchButtonBox.scrollHeight).toBeLessThanOrEqual(searchButtonBox.height);

  const clear = fixture.locator("#clear-input");
  await clear.click();
  await expect(fixture.getByRole("textbox", { name: "Affix input" })).toHaveValue("");
  await expect(fixture.getByRole("textbox", { name: "Affix input" })).toBeFocused();

  const accessibility = await new AxeBuilder({ page }).include("#input-fixture").analyze();
  expect(accessibility.violations).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await fixture.locator(".g-input-group").evaluate((element) => element.classList.add("g-input-group-responsive"));
  const overflow = await fixture.evaluate((element) => element.scrollWidth > element.clientWidth + 1);
  expect(overflow).toBe(false);
});

test("password field provides visibility, sizing, validation, clearing, caps lock, and secure defaults", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate(async (main) => {
    const runtime = await import("/dist/gardener.runtime.js");
    const fixture = document.createElement("section");
    fixture.id = "password-field-fixture";
    fixture.style.width = "min(720px, 100%)";
    fixture.innerHTML = `
      <label>Default<div class="g-password-field" data-g-password-toggle><input id="password-default" class="g-input" type="password" autocomplete="current-password" aria-label="Default password" value="Secret value"><button class="g-password-field-action g-password-toggle" type="button" data-g-password-button></button><span class="g-password-field-caps" data-g-caps-lock hidden>Caps Lock is on</span></div></label>
      <label>Outlined<div class="g-password-field g-password-field-outlined" data-g-password-toggle><input id="password-outlined" class="g-input" type="password" autocomplete="current-password" aria-label="Outlined password"><button class="g-password-field-action g-password-toggle" type="button" data-g-password-button></button></div></label>
      <div id="password-sizes"><div class="g-password-field g-password-field-mini"><input class="g-input" type="password" aria-label="Mini password"><button class="g-password-toggle" type="button" aria-label="Show mini password"></button></div><div class="g-password-field g-password-field-small"><input class="g-input" type="password" aria-label="Small password"><button class="g-password-toggle" type="button" aria-label="Show small password"></button></div><div class="g-password-field g-password-field-medium"><input class="g-input" type="password" aria-label="Medium password"><button class="g-password-toggle" type="button" aria-label="Show medium password"></button></div><div class="g-password-field g-password-field-large"><input class="g-input" type="password" aria-label="Large password"><button class="g-password-toggle" type="button" aria-label="Show large password"></button></div></div>
      <label>Error<div class="g-password-field is-error"><input class="g-input" type="password" aria-label="Error password" aria-invalid="true" aria-describedby="password-error"></div><span id="password-error">Password is too weak</span></label>
      <label>Read only<div class="g-password-field is-read-only"><input class="g-input" type="password" aria-label="Read only password" value="secret" readonly></div></label>
      <label>Disabled<div class="g-password-field is-disabled" data-g-password-toggle><input class="g-input" type="password" aria-label="Disabled password" disabled><button class="g-password-field-action g-password-toggle" type="button" data-g-password-button></button></div></label>
      <label>Clearable<div class="g-password-field g-password-field-clearable" data-g-password-toggle data-g-clear-input><input id="password-clearable" class="g-input" type="password" aria-label="Clearable password" value="Clear me"><button class="g-password-field-action g-password-clear" type="button" data-g-clear-button aria-label="Clear password">×</button><button class="g-password-field-action g-password-toggle" type="button" data-g-password-button></button></div></label>
      <label>Hide on blur<div class="g-password-field g-password-field-hide-on-blur" data-g-password-toggle data-g-hide-on-blur="true"><input id="password-blur" class="g-input" type="password" aria-label="Blur password" value="secret"><button class="g-password-field-action g-password-toggle" type="button" data-g-password-button></button></div></label>
      <button id="password-outside" type="button">Outside</button>`;
    main.prepend(fixture);
    runtime.init(fixture);
  });

  const fixture = page.locator("#password-field-fixture");
  const defaultRoot = fixture.locator(".g-password-field").first();
  const defaultInput = fixture.getByLabel("Default password");
  const defaultToggle = defaultRoot.locator("[data-g-password-button]");
  const defaultStyle = await defaultRoot.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    background: getComputedStyle(element).backgroundColor,
    border: getComputedStyle(element).borderTopColor,
  }));
  expect(defaultStyle.height).toBe(32);
  expect(defaultStyle.background).not.toBe("rgba(0, 0, 0, 0)");
  expect(defaultStyle.border).toBe("rgba(0, 0, 0, 0)");
  expect(await defaultInput.evaluate((element) => getComputedStyle(element).boxShadow)).toBe("none");

  await defaultInput.focus();
  await defaultInput.evaluate((input) => input.setSelectionRange(2, 6));
  await defaultToggle.click();
  await expect(defaultInput).toHaveAttribute("type", "text");
  await expect(defaultRoot).toHaveClass(/is-visible/u);
  await expect(defaultToggle).toHaveAttribute("aria-pressed", "true");
  await expect(defaultToggle).toHaveAttribute("aria-controls", "password-default");
  await expect(defaultInput).toBeFocused();
  expect(await defaultInput.evaluate((input) => [input.selectionStart, input.selectionEnd])).toEqual([2, 6]);
  await defaultInput.press("Escape");
  await expect(defaultInput).toHaveAttribute("type", "password");

  await defaultInput.evaluate((input) => {
    const event = new KeyboardEvent("keyup", { key: "A", bubbles: true });
    Object.defineProperty(event, "getModifierState", { value: (key) => key === "CapsLock" });
    input.dispatchEvent(event);
  });
  await expect(defaultRoot).toHaveClass(/is-caps-lock/u);
  await expect(defaultRoot.locator("[data-g-caps-lock]")).toBeVisible();

  const heights = await fixture.locator("#password-sizes .g-password-field").evaluateAll((roots) => roots.map((root) => root.getBoundingClientRect().height));
  expect(heights).toEqual([24, 28, 32, 36]);
  await expect(fixture.getByLabel("Error password")).toHaveAttribute("aria-invalid", "true");
  await expect(fixture.locator(".is-disabled [data-g-password-button]")).toBeDisabled();

  await fixture.getByRole("button", { name: "Clear password" }).click();
  await expect(fixture.getByLabel("Clearable password")).toHaveValue("");
  await expect(fixture.getByLabel("Clearable password")).toBeFocused();
  await expect(fixture.getByRole("button", { name: "Clear password" })).toBeHidden();

  const blurRoot = fixture.locator(".g-password-field-hide-on-blur");
  const blurInput = fixture.getByLabel("Blur password");
  await blurRoot.locator("[data-g-password-button]").click();
  await expect(blurInput).toHaveAttribute("type", "text");
  await fixture.locator("#password-outside").click();
  await expect(blurInput).toHaveAttribute("type", "password");

  const accessibility = await new AxeBuilder({ page }).include("#password-field-fixture").analyze();
  expect(accessibility.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await fixture.evaluate((element) => element.scrollWidth > element.clientWidth + 1)).toBe(false);
});

test("clearable field supports appearances, sizes, visibility strategies, keyboard, textarea, and select", async ({ page }) => {
  await page.goto(exampleUrl("form-compositions.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate(async (main) => {
    const runtime = await import("/dist/gardener.runtime.js");
    const fixture = document.createElement("section");
    fixture.id = "clearable-field-fixture";
    fixture.style.width = "min(720px, 100%)";
    fixture.innerHTML = `
      <div class="g-clearable-field" data-g-clear-input><input id="clearable-default" class="g-input" aria-label="Default clearable" value="Garden"><button class="g-clearable-field-action" data-g-clear-button></button></div>
      <div class="g-clearable-field g-clearable-field-outlined" data-g-clear-input><input id="clearable-outlined" class="g-input" aria-label="Outlined clearable" value="Outlined"><button class="g-clearable-field-action" data-g-clear-button></button></div>
      <div id="clearable-sizes"><div class="g-clearable-field g-clearable-field-mini" data-g-clear-input><input class="g-input" aria-label="Mini clearable" value="mini"><button class="g-clearable-field-action" data-g-clear-button></button></div><div class="g-clearable-field g-clearable-field-small" data-g-clear-input><input class="g-input" aria-label="Small clearable" value="small"><button class="g-clearable-field-action" data-g-clear-button></button></div><div class="g-clearable-field g-clearable-field-medium" data-g-clear-input><input class="g-input" aria-label="Medium clearable" value="medium"><button class="g-clearable-field-action" data-g-clear-button></button></div><div class="g-clearable-field g-clearable-field-large" data-g-clear-input><input class="g-input" aria-label="Large clearable" value="large"><button class="g-clearable-field-action" data-g-clear-button></button></div></div>
      <div class="g-clearable-field g-clearable-field-interaction" data-g-clear-input><input id="clearable-interaction" class="g-input" aria-label="Interaction clearable" value="Focus me"><button class="g-clearable-field-action" data-g-clear-button></button></div>
      <div class="g-clearable-field g-clearable-field-always-visible" data-g-clear-input data-g-clear-visibility="always"><input class="g-input" aria-label="Always visible clearable" value=""><button class="g-clearable-field-action" data-g-clear-button></button></div>
      <div class="g-clearable-field g-clearable-field-clear-on-escape" data-g-clear-input data-g-clear-on-escape><input id="clearable-escape" class="g-input" aria-label="Escape clearable" value="Escape me"><button class="g-clearable-field-action" data-g-clear-button></button></div>
      <div class="g-clearable-field g-clearable-field-outlined" data-g-clear-input><select id="clearable-select" class="g-select" aria-label="Clearable select"><option value="">Choose</option><option value="ready" selected>Ready</option></select><button class="g-clearable-field-action" data-g-clear-button></button></div>
      <div class="g-clearable-field g-clearable-field-outlined" data-g-clear-input><textarea id="clearable-textarea" class="g-textarea" aria-label="Clearable textarea" rows="3">Multiple lines</textarea><button class="g-clearable-field-action g-textarea-clear" data-g-clear-button></button></div>
      <div class="g-clearable-field is-error" data-g-clear-input aria-invalid="true"><input class="g-input" aria-label="Error clearable" value="Invalid"><button class="g-clearable-field-action" data-g-clear-button></button></div>
      <div class="g-clearable-field" data-g-clear-input><input class="g-input" aria-label="Disabled clearable" value="Disabled" disabled><button class="g-clearable-field-action" data-g-clear-button></button></div>
      <div class="g-clearable-field" data-g-clear-input><input class="g-input" aria-label="Readonly clearable" value="Readonly" readonly><button class="g-clearable-field-action" data-g-clear-button></button></div>`;
    fixture.addEventListener("gardener:clear", (event) => { fixture.dataset.lastClearReason = event.detail.reason; });
    main.prepend(fixture);
    runtime.init(fixture);
  });

  const fixture = page.locator("#clearable-field-fixture");
  const defaultRoot = fixture.locator(".g-clearable-field").first();
  const defaultInput = fixture.getByLabel("Default clearable");
  const defaultButton = defaultRoot.locator("[data-g-clear-button]");
  const defaultStyle = await defaultRoot.evaluate((element) => ({ height: element.getBoundingClientRect().height, background: getComputedStyle(element).backgroundColor, border: getComputedStyle(element).borderTopColor }));
  expect(defaultStyle.height).toBe(32);
  expect(defaultStyle.background).not.toBe("rgba(0, 0, 0, 0)");
  expect(defaultStyle.border).toBe("rgba(0, 0, 0, 0)");
  await expect(defaultRoot).toHaveClass(/has-value/u);
  await expect(defaultButton).toHaveAttribute("aria-controls", "clearable-default");
  await expect(defaultButton).toHaveAttribute("aria-label", /.+/u);
  await expect(defaultButton).not.toBeHidden();

  const heights = await fixture.locator("#clearable-sizes .g-clearable-field").evaluateAll((roots) => roots.map((root) => root.getBoundingClientRect().height));
  expect(heights).toEqual([24, 28, 32, 36]);
  await expect(fixture.locator(".g-clearable-field-outlined").first()).toHaveCSS("background-color", "rgb(255, 255, 255)");

  const interaction = fixture.locator(".g-clearable-field-interaction");
  await expect(interaction.locator("[data-g-clear-button]")).toHaveCSS("opacity", "0");
  await fixture.getByLabel("Interaction clearable").focus();
  await expect(interaction.locator("[data-g-clear-button]")).toHaveCSS("opacity", "1");
  const alwaysButton = fixture.getByLabel("Always visible clearable").locator("..").locator("[data-g-clear-button]");
  await expect(alwaysButton).toBeVisible();
  await expect(alwaysButton).toBeDisabled();

  await defaultButton.click();
  await expect(defaultInput).toHaveValue("");
  await expect(defaultInput).toBeFocused();
  await expect(defaultRoot).toHaveClass(/is-empty/u);
  await expect(defaultButton).toBeHidden();
  await expect(fixture).toHaveAttribute("data-last-clear-reason", "button");

  const escapeInput = fixture.getByLabel("Escape clearable");
  await escapeInput.focus();
  await escapeInput.press("Escape");
  await expect(escapeInput).toHaveValue("");
  await expect(fixture).toHaveAttribute("data-last-clear-reason", "escape");

  await fixture.getByLabel("Clearable select").locator("..").locator("[data-g-clear-button]").click();
  await expect(fixture.getByLabel("Clearable select")).toHaveValue("");
  const selectArrow = await fixture.getByLabel("Clearable select").evaluate((element) => ({
    image: getComputedStyle(element).backgroundImage,
    size: getComputedStyle(element).backgroundSize,
  }));
  expect(selectArrow.image).toContain("svg");
  expect(selectArrow.size.split(" ")[0]).toBe("16px");
  const textareaRoot = fixture.getByLabel("Clearable textarea").locator("..");
  await expect(textareaRoot.locator("[data-g-clear-button]")).toHaveCSS("position", "absolute");
  await textareaRoot.locator("[data-g-clear-button]").click();
  await expect(fixture.getByLabel("Clearable textarea")).toHaveValue("");
  await expect(fixture.getByLabel("Disabled clearable").locator("..").locator("[data-g-clear-button]")).toBeHidden();
  await expect(fixture.getByLabel("Readonly clearable").locator("..").locator("[data-g-clear-button]")).toBeHidden();
  await expect(fixture.getByLabel("Error clearable").locator("..")).toHaveAttribute("aria-invalid", "true");

  const accessibility = await new AxeBuilder({ page }).include("#clearable-field-fixture").analyze();
  expect(accessibility.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await fixture.evaluate((element) => element.scrollWidth > element.clientWidth + 1)).toBe(false);
});

test("textarea provides filled defaults, validation, limits, clearing, and bounded auto growth", async ({ page }) => {
  await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  await page.locator("main").first().evaluate(async (main) => {
    const runtime = await import("/dist/gardener.runtime.js");
    const fixture = document.createElement("section");
    fixture.id = "textarea-fixture";
    fixture.style.width = "min(720px, 100%)";
    fixture.innerHTML = `
      <label>Default<textarea class="g-textarea" aria-label="Default textarea" rows="3" placeholder="Type details"></textarea></label>
      <label>Outlined<textarea class="g-textarea g-textarea-outlined" aria-label="Outlined textarea" rows="3">Outlined</textarea></label>
      <label>Error<textarea class="g-textarea is-error" aria-label="Error textarea" rows="3" aria-invalid="true" aria-describedby="textarea-error">Invalid</textarea><span id="textarea-error">Please revise</span></label>
      <label>Read only<textarea class="g-textarea" aria-label="Read only textarea" rows="3" readonly>Copyable</textarea></label>
      <label>Disabled<textarea class="g-textarea" aria-label="Disabled textarea" rows="3" disabled>Unavailable</textarea></label>
      <label>Clearable<span class="g-clearable-field" data-g-clear-input><textarea class="g-textarea" aria-label="Clearable textarea" rows="3">Clear me</textarea><button class="g-clearable-field-action g-textarea-clear" type="button" data-g-clear-button aria-label="Clear textarea">×</button></span></label>
      <label>Counted<span class="g-character-field" data-g-character-count="12"><textarea class="g-textarea" aria-label="Counted textarea" rows="3">Garden</textarea><output class="g-character-count" data-g-character-output aria-live="polite"></output></span></label>
      <label>Auto growing<textarea class="g-textarea g-textarea-auto-size" data-g-auto-resize data-g-min-rows="2" data-g-max-rows="4" rows="2" aria-label="Auto growing textarea">First line</textarea></label>
      <div id="textarea-resize"><textarea aria-label="No resize" class="g-textarea g-textarea-resize-none"></textarea><textarea aria-label="Both resize" class="g-textarea g-textarea-resize-both"></textarea></div>`;
    main.prepend(fixture);
    runtime.init(fixture);
  });

  const fixture = page.locator("#textarea-fixture");
  const defaultTextarea = fixture.getByRole("textbox", { name: "Default textarea" });
  const defaultStyle = await defaultTextarea.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    background: getComputedStyle(element).backgroundColor,
    border: getComputedStyle(element).borderTopColor,
    resize: getComputedStyle(element).resize,
  }));
  expect(defaultStyle.height).toBeGreaterThan(70);
  expect(defaultStyle.background).not.toBe("rgba(0, 0, 0, 0)");
  expect(defaultStyle.border).toBe("rgba(0, 0, 0, 0)");
  expect(defaultStyle.resize).toBe("vertical");
  await defaultTextarea.focus();
  expect(await defaultTextarea.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  await expect(fixture.getByRole("textbox", { name: "Error textarea" })).toHaveAttribute("aria-invalid", "true");
  expect(await fixture.getByRole("textbox", { name: "Read only textarea" }).evaluate((element) => getComputedStyle(element).cursor)).toBe("default");
  expect(await fixture.getByRole("textbox", { name: "Disabled textarea" }).evaluate((element) => getComputedStyle(element).resize)).toBe("none");

  await fixture.getByRole("button", { name: "Clear textarea" }).click();
  await expect(fixture.getByRole("textbox", { name: "Clearable textarea" })).toHaveValue("");
  await expect(fixture.getByRole("textbox", { name: "Clearable textarea" })).toBeFocused();
  const counted = fixture.getByRole("textbox", { name: "Counted textarea" });
  const counter = fixture.locator("[data-g-character-output]");
  await expect(counter).toHaveText("6 / 12");
  const counterLayout = await counter.evaluate((output) => {
    const outputBox = output.getBoundingClientRect();
    const textareaBox = output.parentElement.querySelector(".g-textarea").getBoundingClientRect();
    return {
      background: getComputedStyle(output).backgroundColor,
      bottomGap: textareaBox.bottom - outputBox.bottom,
      rightGap: textareaBox.right - outputBox.right,
    };
  });
  expect(counterLayout.background).toBe("rgba(0, 0, 0, 0)");
  expect(counterLayout.bottomGap).toBeGreaterThanOrEqual(0);
  expect(counterLayout.bottomGap).toBeLessThanOrEqual(12);
  expect(counterLayout.rightGap).toBeGreaterThanOrEqual(0);
  expect(counterLayout.rightGap).toBeLessThanOrEqual(12);
  await counted.fill("GardenerimUI");
  await expect(counter).toHaveText("12 / 12");
  await expect(counter).toHaveClass(/is-at-limit/u);

  const auto = fixture.getByRole("textbox", { name: "Auto growing textarea" });
  const initialHeight = await auto.evaluate((element) => element.getBoundingClientRect().height);
  await auto.fill("One\nTwo\nThree\nFour\nFive\nSix");
  const grown = await auto.evaluate((element) => ({ height: element.getBoundingClientRect().height, overflow: getComputedStyle(element).overflowY, capped: element.classList.contains("is-max-rows") }));
  expect(grown.height).toBeGreaterThan(initialHeight);
  expect(grown.capped).toBe(true);
  expect(grown.overflow).toBe("auto");
  await expect(fixture.getByRole("textbox", { name: "No resize" })).toHaveCSS("resize", "none");
  await expect(fixture.getByRole("textbox", { name: "Both resize" })).toHaveCSS("resize", "both");

  const accessibility = await new AxeBuilder({ page }).include("#textarea-fixture").analyze();
  expect(accessibility.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await fixture.evaluate((element) => element.scrollWidth > element.clientWidth + 1)).toBe(false);
});

test("destructive micro-interactions keep keyboard focus in a useful place", async ({ page }) => {
  await page.goto(exampleUrl("data-compositions.html"), { waitUntil: "networkidle" });
  const summary = page.locator("[data-g-filter-summary]");
  await summary.locator("[data-g-clear-selection], .g-filter-summary-clear").click();
  await expect(summary).toBeHidden();
  await expect(page.locator('#demo-filter-summary input[type="search"]')).toBeFocused();

  const query = page.locator('#demo-query-builder [data-g-data-display]');
  const remove = query.locator('[data-g-data-action="remove-rule"]').first();
  await remove.click();
  await expect(query.locator('.g-data-query-rule')).toHaveCount(0);
  await expect(query.locator('[data-g-data-action="add-rule"]')).toBeFocused();
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

test("conditional fields expose a complete interactive form contract", async ({ page }) => {
  await page.goto(exampleUrl("form-compositions.html"), { waitUntil: "networkidle" });
  const form = page.locator("#conditional-field-demo");
  const controller = form.locator("#delivery-method");
  const field = form.locator("#shipping-fields");
  const address = form.locator("#shipping-address");

  await expect(field).toBeVisible();
  await expect(field).toHaveAttribute("data-g-state", "visible");
  await expect(field).toHaveAttribute("aria-hidden", "false");
  await expect(controller).toHaveAttribute("aria-controls", /(?:^|\s)shipping-fields(?:\s|$)/u);
  await expect(address).toBeEnabled();
  await address.fill("上海市徐汇区");
  expect(await form.evaluate((node) => Object.fromEntries(new FormData(node))).then((data) => data.shippingAddress)).toBe("上海市徐汇区");

  const style = await field.evaluate((node) => {
    const computed = getComputedStyle(node);
    return {
      width: node.getBoundingClientRect().width,
      background: computed.backgroundColor,
      border: computed.borderTopWidth,
      radius: computed.borderTopLeftRadius,
    };
  });
  expect(style.width).toBeGreaterThan(240);
  expect(style.background).not.toBe("rgba(0, 0, 0, 0)");
  expect(style.border).toBe("1px");
  expect(style.radius).not.toBe("0px");

  await controller.selectOption("pickup");
  await expect(field).toBeHidden();
  await expect(field).toHaveAttribute("data-g-state", "hidden");
  await expect(field).toHaveAttribute("inert", "");
  await expect(address).toBeDisabled();
  expect(await form.evaluate((node) => Object.fromEntries(new FormData(node))).then((data) => data.shippingAddress)).toBeUndefined();

  await controller.selectOption("shipping");
  await expect(field).toBeVisible();
  await expect(address).toBeEnabled();
  await expect(address).toHaveValue("上海市徐汇区");
});

for (const { name, url } of releasePages) {
  test(`${name} loads without browser or layout failures`, async ({ page, browserName }) => {
    if (name === "website/docs.html") test.setTimeout(90_000);
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
        href && /\/gardener(?:\.min)?\.css(?:[?#]|$)/.test(href),
      ),
      hasHorizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    }));

    expect(documentState.title).not.toBe("");
    expect(documentState.language).not.toBe("");
    expect(documentState.hasGardenerimStylesheet).toBe(true);
    expect(documentState.hasHorizontalOverflow).toBe(false);
    expect(['examples/content-lab.html','examples/media-lab.html'].includes(name) ? await contentMediaFailures(page, failures, browserName) : failures).toEqual([]);
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
test('dashboard filters update real metrics and charts keep readable SVG text after resizing',async({page})=>{
 const failures=collectPageFailures(page);
 await page.goto(exampleUrl('dashboard-compositions.html'));
 const filter=page.locator('#dashboard-linked-filter'),kpi=page.locator('#dashboard-linked-kpi .g-kpi-value'),chart=page.locator('#dashboard-linked-chart');
 await expect(kpi).toContainText('128,650.75');await filter.locator('[data-g-dashboard-field=period]').selectOption('week');await filter.locator('[data-g-dashboard-action=apply]').click();await expect(kpi).toContainText('32,162.69');
 await filter.locator('[data-g-dashboard-field=keyword]').fill('成本');await filter.locator('[data-g-dashboard-action=apply]').click();await expect(chart.locator('[data-g-dashboard-action=series]')).toHaveCount(1);await expect(chart.locator('[data-g-dashboard-action=series]')).toContainText('成本');
 await filter.locator('[data-g-dashboard-field=keyword]').fill('不存在的系列');await filter.locator('[data-g-dashboard-action=apply]').click();await expect(kpi).toContainText('0.00');await expect(chart.locator('[role=status]')).toBeVisible();await filter.locator('[data-g-dashboard-action=reset]').click();await expect(chart.locator('[data-g-dashboard-action=series]')).toHaveCount(2);
 await page.setViewportSize({width:360,height:800});await expect.poll(()=>chart.locator('svg text').first().evaluate(n=>n.getScreenCTM().a)).toBeGreaterThan(.95);await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 await page.setViewportSize({width:1080,height:900});await expect.poll(()=>chart.locator('svg text').first().evaluate(n=>n.getScreenCTM().a)).toBeGreaterThan(.95);expect(failures).toEqual([]);
});
