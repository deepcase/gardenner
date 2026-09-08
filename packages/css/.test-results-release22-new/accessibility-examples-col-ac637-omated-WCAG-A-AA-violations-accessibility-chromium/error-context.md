# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.mjs >> examples/collapse.html has no automated WCAG A/AA violations
- Location: tests\browser\accessibility.spec.mjs:9:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 22

- Array []
+ Array [
+   Object {
+     "id": "target-size",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (62.3px by 22px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 22px instead of at least 24px.",
+         "html": "<a href=\"#accordion\">Accordion</a>",
+         "target": "a[href$=\"#accordion\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (137px by 22px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 22px instead of at least 24px.",
+         "html": "<a href=\"#controlled\">Controlled active keys</a>",
+         "target": "a[href$=\"#controlled\"]",
+       },
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- main [ref=e2]:
  - heading "GCollapse" [level=1] [ref=e3]
  - navigation [ref=e4]:
    - link "Multiple panels" [ref=e5] [cursor=pointer]:
      - /url: "#basic"
    - link "Accordion" [ref=e6] [cursor=pointer]:
      - /url: "#accordion"
    - link "Controlled active keys" [ref=e7] [cursor=pointer]:
      - /url: "#controlled"
    - link "Borderless" [ref=e8] [cursor=pointer]:
      - /url: "#borderless"
    - link "Custom icons" [ref=e9] [cursor=pointer]:
      - /url: "#icons"
    - link "Extra actions" [ref=e10] [cursor=pointer]:
      - /url: "#extra"
    - link "Nested panels" [ref=e11] [cursor=pointer]:
      - /url: "#nested"
    - link "Destroy on hide" [ref=e12] [cursor=pointer]:
      - /url: "#destroy"
  - generic [ref=e13]:
    - generic [ref=e14]:
      - text: Icon position
      - combobox "Icon position" [ref=e15]:
        - option "left" [selected]
        - option "right"
    - generic [ref=e16]:
      - text: Size
      - combobox "Size" [ref=e17]:
        - option "medium" [selected]
        - option "small"
        - option "large"
    - generic [ref=e18]:
      - checkbox "Border" [checked] [ref=e19]
      - text: Border
    - generic [ref=e20]:
      - checkbox "Dark" [ref=e21]
      - text: Dark
  - generic [ref=e22]:
    - heading "Multiple panels" [level=2] [ref=e23]
    - generic [ref=e24]:
      - button "Project overview" [ref=e27] [cursor=pointer]:
        - generic [ref=e28]: ›
      - button "Advanced settings" [ref=e32] [cursor=pointer]:
        - generic [ref=e33]: ›
      - button "Organization policy" [disabled] [ref=e37]:
        - generic [ref=e38]: ›
  - generic [ref=e40]:
    - heading "Accordion" [level=2] [ref=e41]
    - generic [ref=e42]:
      - generic [ref=e43]:
        - button "Project overview" [expanded] [ref=e45] [cursor=pointer]:
          - generic [ref=e46]: ›
        - region "Accordion · Project overview" [ref=e48]:
          - generic [ref=e49]: Keep project context, resources and milestones together.
      - button "Advanced settings" [ref=e53] [cursor=pointer]:
        - generic [ref=e54]: ›
      - button "Organization policy" [disabled] [ref=e58]:
        - generic [ref=e59]: ›
  - generic [ref=e61]:
    - heading "Controlled active keys" [level=2] [ref=e62]
    - generic [ref=e63]:
      - generic [ref=e64]:
        - button "Project overview" [expanded] [ref=e66] [cursor=pointer]:
          - generic [ref=e67]: ›
        - region "Controlled active keys · Project overview" [ref=e69]:
          - generic [ref=e70]: Keep project context, resources and milestones together.
      - button "Advanced settings" [ref=e74] [cursor=pointer]:
        - generic [ref=e75]: ›
      - button "Organization policy" [disabled] [ref=e79]:
        - generic [ref=e80]: ›
  - generic [ref=e82]:
    - heading "Borderless" [level=2] [ref=e83]
    - generic [ref=e84]:
      - generic [ref=e85]:
        - button "Project overview" [expanded] [ref=e87] [cursor=pointer]:
          - generic [ref=e88]: ›
        - region "Borderless · Project overview" [ref=e90]:
          - generic [ref=e91]: Keep project context, resources and milestones together.
      - button "Advanced settings" [ref=e95] [cursor=pointer]:
        - generic [ref=e96]: ›
      - button "Organization policy" [disabled] [ref=e100]:
        - generic [ref=e101]: ›
  - generic [ref=e103]:
    - heading "Custom icons" [level=2] [ref=e104]
    - generic [ref=e105]:
      - button "Project overview" [ref=e108] [cursor=pointer]:
        - generic [ref=e109]: +
      - button "Advanced settings" [ref=e113] [cursor=pointer]:
        - generic [ref=e114]: +
      - button "Organization policy" [disabled] [ref=e118]:
        - generic [ref=e119]: +
  - generic [ref=e121]:
    - heading "Extra actions" [level=2] [ref=e122]
    - generic [ref=e125]:
      - button "Project overview" [ref=e126] [cursor=pointer]:
        - generic [ref=e127]: ›
      - button "Edit" [ref=e130] [cursor=pointer]
  - generic [ref=e131]:
    - heading "Nested panels" [level=2] [ref=e132]
    - generic [ref=e134]:
      - button "Notification settings" [expanded] [ref=e136] [cursor=pointer]:
        - generic [ref=e137]: ›
      - region "Nested panels · Notification settings" [ref=e139]:
        - button "Notification rules" [ref=e144] [cursor=pointer]:
          - generic [ref=e145]: ›
  - generic [ref=e147]:
    - heading "Destroy on hide" [level=2] [ref=e148]
    - generic [ref=e150]:
      - button "Project form" [expanded] [ref=e152] [cursor=pointer]:
        - generic [ref=e153]: ›
      - region "Destroy on hide · Project form" [ref=e155]:
        - generic [ref=e156]:
          - generic [ref=e157]:
            - text: Project name
            - textbox "Project name" [ref=e158]: Garden studio
          - paragraph [ref=e159]: Edit, close and reopen to test reset.
  - status [ref=e160]: Expand a panel or choose an extra action.
```

# Test source

```ts
  1   | import AxeBuilder from "@axe-core/playwright";
  2   | import { expect, test } from "@playwright/test";
  3   | import { exampleUrl, releasePages } from "./pages.mjs";
  4   | import { readFile } from "node:fs/promises";
  5   | 
  6   | const manifest = JSON.parse(await readFile(new URL("../../dist/gardener.manifest.json", import.meta.url), "utf8"));
  7   | 
  8   | for (const { name, url } of releasePages) {
  9   |   test(`${name} has no automated WCAG A/AA violations`, async ({ page }) => {
  10  |     // The documentation renders the complete 506-component catalog. Keep the
  11  |     // full-document Axe scan instead of weakening its rules or excluding the
  12  |     // generated catalog, but allow enough time for slower CI/browser hosts.
  13  |     if (name === "website/docs.html") test.setTimeout(240_000);
  14  |     await page.goto(url, { waitUntil: "networkidle" });
  15  |     if (name.startsWith("website/")) {
  16  |       const file = name.endsWith("docs.html") ? "docs.html" : "index.html";
  17  |       await page.waitForURL(
  18  |         ({ pathname }) => pathname === `/website/en/${file}`,
  19  |         { waitUntil: "networkidle" },
  20  |       );
  21  |     }
  22  |     const results = await new AxeBuilder({ page })
  23  |       .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
  24  |       .analyze();
  25  |     const blocking = results.violations.map(({ id, impact, nodes }) => ({
  26  |         id,
  27  |         impact,
  28  |         nodes: nodes.map(({ failureSummary, html, target }) => ({
  29  |           failureSummary,
  30  |           html,
  31  |           target: target.join(" "),
  32  |         })),
  33  |       }));
  34  | 
> 35  |     expect(blocking).toEqual([]);
      |                      ^ Error: expect(received).toEqual(expected) // deep equality
  36  |   });
  37  | }
  38  | 
  39  | test("keyboard focus is visible and dialog focus returns to its trigger", async ({
  40  |   page,
  41  | }) => {
  42  |   await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  43  |   await page.keyboard.press("Tab");
  44  |   const focus = await page.evaluate(() => {
  45  |     const active = document.activeElement;
  46  |     const style = getComputedStyle(active);
  47  |     return {
  48  |       tag: active?.tagName,
  49  |       outlineStyle: style.outlineStyle,
  50  |       outlineWidth: style.outlineWidth,
  51  |       boxShadow: style.boxShadow,
  52  |     };
  53  |   });
  54  |   expect(focus.tag).not.toBe("BODY");
  55  |   expect(
  56  |     focus.outlineStyle !== "none" ||
  57  |       focus.outlineWidth !== "0px" ||
  58  |       focus.boxShadow !== "none",
  59  |   ).toBe(true);
  60  | 
  61  |   const trigger = page.locator('[data-g-dialog-open="demo-dialog"]');
  62  |   await trigger.click();
  63  |   await expect(page.locator("#demo-dialog")).toBeVisible();
  64  |   await page.keyboard.press("Escape");
  65  |   await expect(trigger).toBeFocused();
  66  | });
  67  | 
  68  | test("reduced motion, forced colors, RTL, and narrow reflow stay operable", async ({
  69  |   page,
  70  | }) => {
  71  |   await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  72  |   await page.setViewportSize({ width: 320, height: 800 });
  73  |   await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  74  |   await page.evaluate(() => (document.documentElement.dir = "rtl"));
  75  |   await page.keyboard.press("Tab");
  76  | 
  77  |   const state = await page.evaluate(() => {
  78  |     const button = document.querySelector(".g-btn");
  79  |     const style = getComputedStyle(button);
  80  |     const durations = `${style.animationDuration},${style.transitionDuration}`
  81  |       .split(",")
  82  |       .map((value) => value.trim())
  83  |       .map((value) =>
  84  |         value.endsWith("ms")
  85  |           ? Number.parseFloat(value)
  86  |           : Number.parseFloat(value) * 1000,
  87  |       );
  88  |     return {
  89  |       direction: getComputedStyle(document.documentElement).direction,
  90  |       hasHorizontalOverflow:
  91  |         document.documentElement.scrollWidth >
  92  |         document.documentElement.clientWidth + 1,
  93  |       focused: document.activeElement !== document.body,
  94  |       maximumMotionMs: Math.max(...durations.filter(Number.isFinite), 0),
  95  |     };
  96  |   });
  97  | 
  98  |   expect(state.direction).toBe("rtl");
  99  |   expect(state.hasHorizontalOverflow).toBe(false);
  100 |   expect(state.focused).toBe(true);
  101 |   expect(state.maximumMotionMs).toBeLessThanOrEqual(1);
  102 | });
  103 | 
  104 | test("all 42 themes pass WCAG AA color contrast in light and dark modes", async ({ page }) => {
  105 |   test.setTimeout(240_000);
  106 |   await page.emulateMedia({ reducedMotion: "reduce" });
  107 |   await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  108 |   const failures = [];
  109 |   for (const theme of manifest.themes) {
  110 |     for (const mode of ["light", "dark"]) {
  111 |       await page.evaluate(({ theme, mode }) => {
  112 |         document.documentElement.dataset.gTheme = theme;
  113 |         document.documentElement.dataset.gMode = mode;
  114 |       }, { theme, mode });
  115 |       await page.evaluate(() => new Promise((accept) =>
  116 |         requestAnimationFrame(() => requestAnimationFrame(accept)),
  117 |       ));
  118 |       const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  119 |       if (results.violations.length) failures.push({
  120 |         theme,
  121 |         mode,
  122 |         violations: results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target.join(" ")) })),
  123 |       });
  124 |     }
  125 |   }
  126 |   expect(failures).toEqual([]);
  127 | });
  128 | 
```