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
