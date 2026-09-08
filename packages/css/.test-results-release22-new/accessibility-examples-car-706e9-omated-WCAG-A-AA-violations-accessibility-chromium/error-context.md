# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.mjs >> examples/carousel.html has no automated WCAG A/AA violations
- Location: tests\browser\accessibility.spec.mjs:9:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 120

- Array []
+ Array [
+   Object {
+     "id": "target-size",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (179px by 22px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 22px instead of at least 24px.",
+         "html": "<a href=\"#basic\">Slide and parameter controls</a>",
+         "target": "a[href$=\"#basic\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (31.9px by 22px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 22px instead of at least 24px.",
+         "html": "<a href=\"#fade\">Fade</a>",
+         "target": "a[href$=\"#fade\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (30.4px by 22px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 22px instead of at least 24px.",
+         "html": "<a href=\"#card\">Card</a>",
+         "target": "a[href$=\"#card\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (72.4px by 22px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 22px instead of at least 24px.",
+         "html": "<a href=\"#thumbnails\">Thumbnails</a>",
+         "target": "a[href$=\"#thumbnails\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"0\" aria-label=\"Slide 1\" aria-current=\"true\"></button>",
+         "target": "div[aria-label=\"Slide and parameter controls\"] > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"0\"][aria-label=\"Slide 1\"][aria-current=\"true\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"1\" aria-label=\"Slide 2\" aria-current=\"false\"></button>",
+         "target": "div[aria-label=\"Slide and parameter controls\"] > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"1\"][aria-label=\"Slide 2\"][aria-current=\"false\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"2\" aria-label=\"Slide 3\" aria-current=\"false\"></button>",
+         "target": "div[aria-label=\"Slide and parameter controls\"] > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"2\"][aria-label=\"Slide 3\"][aria-current=\"false\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"0\" aria-label=\"Slide 1\" aria-current=\"true\"></button>",
+         "target": ".g-media-composition > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"0\"][aria-label=\"Slide 1\"][aria-current=\"true\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"1\" aria-label=\"Slide 2\" aria-current=\"false\"></button>",
+         "target": ".g-media-composition > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"1\"][aria-label=\"Slide 2\"][aria-current=\"false\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"2\" aria-label=\"Slide 3\" aria-current=\"false\"></button>",
+         "target": ".g-media-composition > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"2\"][aria-label=\"Slide 3\"][aria-current=\"false\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"0\" aria-label=\"Slide 1\" aria-current=\"true\"></button>",
+         "target": "div[aria-label=\"Autoplay\"] > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"0\"][aria-label=\"Slide 1\"][aria-current=\"true\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"1\" aria-label=\"Slide 2\" aria-current=\"false\"></button>",
+         "target": "div[aria-label=\"Autoplay\"] > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"1\"][aria-label=\"Slide 2\"][aria-current=\"false\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"2\" aria-label=\"Slide 3\" aria-current=\"false\"></button>",
+         "target": "div[aria-label=\"Autoplay\"] > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"2\"][aria-label=\"Slide 3\"][aria-current=\"false\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"0\" aria-label=\"Slide 1\" aria-current=\"false\"></button>",
+         "target": "button[data-media-key=\"0\"][aria-label=\"Slide 1\"][aria-current=\"false\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"1\" aria-label=\"Slide 2\" aria-current=\"true\"></button>",
+         "target": "button[data-media-key=\"1\"][aria-label=\"Slide 2\"][aria-current=\"true\"]",
+       },
+       Object {
+         "failureSummary": "Fix any of the following:
+   Target has insufficient size (18px by 24px, should be at least 24px by 24px)
+   Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 20px instead of at least 24px.",
+         "html": "<button class=\"g-media-button\" type=\"button\" data-media-action=\"go\" data-media-key=\"2\" aria-label=\"Slide 3\" aria-current=\"false\"></button>",
+         "target": "div[aria-label=\"Controlled current\"] > .g-media-carousel-indicators[data-indicator-type=\"dot\"][aria-label=\"Choose slide\"] > button[data-media-key=\"2\"][aria-label=\"Slide 3\"][aria-current=\"false\"]",
+       },
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- main [ref=e2]:
  - heading "GCarousel" [level=1] [ref=e3]
  - paragraph [ref=e4]: Shared CSS, Vue, React, AngularJS and Blazor carousel.
  - navigation [ref=e5]:
    - link "Slide and parameter controls" [ref=e6] [cursor=pointer]:
      - /url: "#basic"
    - link "Fade" [ref=e7] [cursor=pointer]:
      - /url: "#fade"
    - link "Card" [ref=e8] [cursor=pointer]:
      - /url: "#card"
    - link "Vertical" [ref=e9] [cursor=pointer]:
      - /url: "#vertical"
    - link "Thumbnails" [ref=e10] [cursor=pointer]:
      - /url: "#thumbnails"
    - link "Autoplay" [ref=e11] [cursor=pointer]:
      - /url: "#auto"
    - link "Controlled current" [ref=e12] [cursor=pointer]:
      - /url: "#controlled"
    - link "Empty" [ref=e13] [cursor=pointer]:
      - /url: "#empty"
  - generic [ref=e14]:
    - generic [ref=e15]:
      - text: Animation
      - combobox "Animation" [ref=e16]:
        - option "slide" [selected]
        - option "fade"
        - option "card"
    - generic [ref=e17]:
      - text: Indicator
      - combobox "Indicator" [ref=e18]:
        - option "dot" [selected]
        - option "line"
        - option "slider"
        - option "never"
    - generic [ref=e19]:
      - text: Position
      - combobox "Position" [ref=e20]:
        - option "bottom" [selected]
        - option "top"
        - option "left"
        - option "right"
        - option "outer"
    - generic [ref=e21]:
      - checkbox "Dark" [ref=e22]
      - text: Dark
  - generic [ref=e23]:
    - heading "Slide and parameter controls" [level=2] [ref=e24]
    - generic [ref=e26]:
      - strong [ref=e27]: Slide and parameter controls
      - region "Slide and parameter controls" [ref=e28]:
        - generic [ref=e29]:
          - group "1 / 3" [ref=e30]:
            - figure [ref=e31]:
              - img "mountain" [ref=e32]
          - group [ref=e33]:
            - figure [ref=e34]
          - group [ref=e36]:
            - figure [ref=e37]
        - button "Previous slide" [ref=e39] [cursor=pointer]: ‹
        - button "Next slide" [ref=e40] [cursor=pointer]: ›
        - group "Choose slide" [ref=e41]:
          - button "Slide 1" [ref=e42] [cursor=pointer]
          - button "Slide 2" [ref=e43] [cursor=pointer]
          - button "Slide 3" [ref=e44] [cursor=pointer]
      - status
  - generic [ref=e45]:
    - heading "Fade" [level=2] [ref=e46]
    - generic [ref=e48]:
      - strong [ref=e49]: Fade
      - region "Fade" [ref=e50]:
        - generic [ref=e51]:
          - group "1 / 3" [ref=e52]:
            - figure [ref=e53]:
              - img "mountain" [ref=e54]
          - group [ref=e55]:
            - figure [ref=e56]
          - group [ref=e58]:
            - figure [ref=e59]
        - button "Previous slide": ‹
        - button "Next slide": ›
        - group "Choose slide" [ref=e61]:
          - button "Slide 1" [ref=e62] [cursor=pointer]
          - button "Slide 2" [ref=e63] [cursor=pointer]
          - button "Slide 3" [ref=e64] [cursor=pointer]
      - status
  - generic [ref=e65]:
    - heading "Card" [level=2] [ref=e66]
    - generic [ref=e68]:
      - strong [ref=e69]: Card
      - region "Card" [ref=e70]:
        - generic [ref=e71]:
          - group "1 / 3" [ref=e72]:
            - figure [ref=e73]:
              - img "mountain" [ref=e74]
          - group [ref=e75]:
            - figure [ref=e76]
          - group [ref=e78]:
            - figure [ref=e79]
        - button "Previous slide" [ref=e81] [cursor=pointer]: ‹
        - button "Next slide" [ref=e82] [cursor=pointer]: ›
      - group "Choose slide" [ref=e83]:
        - button "Slide 1" [ref=e84] [cursor=pointer]
        - button "Slide 2" [ref=e85] [cursor=pointer]
        - button "Slide 3" [ref=e86] [cursor=pointer]
      - status
  - generic [ref=e87]:
    - heading "Vertical" [level=2] [ref=e88]
    - generic [ref=e90]:
      - strong [ref=e91]: Vertical
      - region "Vertical" [ref=e92]:
        - generic [ref=e93]:
          - group "1 / 3" [ref=e94]:
            - figure [ref=e95]:
              - img "mountain" [ref=e96]
          - group [ref=e97]:
            - figure [ref=e98]
          - group [ref=e100]:
            - figure [ref=e101]
        - button "Previous slide" [ref=e103] [cursor=pointer]: ⌃
        - button "Next slide" [ref=e104] [cursor=pointer]: ⌄
        - group "Choose slide" [ref=e105]:
          - button "Slide 1" [ref=e106] [cursor=pointer]
          - button "Slide 2" [ref=e107] [cursor=pointer]
          - button "Slide 3" [ref=e108] [cursor=pointer]
      - status
  - generic [ref=e109]:
    - heading "Thumbnails" [level=2] [ref=e110]
    - generic [ref=e112]:
      - strong [ref=e113]: Thumbnails
      - region "Thumbnails" [ref=e114]:
        - generic [ref=e115]:
          - group "1 / 3" [ref=e116]:
            - figure [ref=e117]:
              - img "mountain" [ref=e118]
          - group [ref=e119]:
            - figure [ref=e120]
          - group [ref=e122]:
            - figure [ref=e123]
        - button "Previous slide" [ref=e125] [cursor=pointer]: ‹
        - button "Next slide" [ref=e126] [cursor=pointer]: ›
      - group "Choose slide" [ref=e127]:
        - button "Slide 1" [ref=e128] [cursor=pointer]:
          - figure [ref=e129]:
            - img "mountain" [ref=e130]
          - text: "1"
        - button "Slide 2" [ref=e131] [cursor=pointer]:
          - figure [ref=e132]:
            - img "sea" [ref=e133]
          - text: "2"
        - button "Slide 3" [ref=e134] [cursor=pointer]:
          - figure [ref=e135]:
            - img "sunset" [ref=e136]
          - text: "3"
      - status
  - generic [ref=e137]:
    - heading "Autoplay" [level=2] [ref=e138]
    - generic [ref=e140]:
      - strong [ref=e141]: Autoplay
      - region "Autoplay" [ref=e142]:
        - generic [ref=e143]:
          - group "1 / 3" [ref=e144]:
            - figure [ref=e145]:
              - img "mountain" [ref=e146]
          - group [ref=e147]:
            - figure [ref=e148]
          - group [ref=e150]:
            - figure [ref=e151]
        - button "Previous slide" [ref=e153] [cursor=pointer]: ‹
        - button "Next slide" [ref=e154] [cursor=pointer]: ›
        - group "Choose slide" [ref=e155]:
          - button "Slide 1" [ref=e156] [cursor=pointer]
          - button "Slide 2" [ref=e157] [cursor=pointer]
          - button "Slide 3" [ref=e158] [cursor=pointer]
      - button "Stop automatic rotation" [ref=e160] [cursor=pointer]
      - status
  - generic [ref=e161]:
    - heading "Controlled current" [level=2] [ref=e162]
    - generic [ref=e164]:
      - strong [ref=e165]: Controlled current
      - region "Controlled current" [ref=e166]:
        - generic [ref=e167]:
          - group [ref=e168]:
            - figure [ref=e169]:
              - generic: Loading
          - group "2 / 3" [ref=e171]:
            - figure [ref=e172]:
              - generic: Loading
              - img "sea" [ref=e173]
          - group [ref=e174]:
            - figure [ref=e175]:
              - generic: Loading
        - button "Previous slide" [ref=e177] [cursor=pointer]: ‹
        - button "Next slide" [ref=e178] [cursor=pointer]: ›
        - group "Choose slide" [ref=e179]:
          - button "Slide 1" [ref=e180] [cursor=pointer]
          - button "Slide 2" [ref=e181] [cursor=pointer]
          - button "Slide 3" [ref=e182] [cursor=pointer]
      - status
  - generic [ref=e183]:
    - heading "Empty" [level=2] [ref=e184]
    - generic [ref=e186]:
      - strong [ref=e187]: Empty
      - region "Empty" [ref=e188]:
        - paragraph [ref=e190]: No media
      - status
  - status [ref=e191]: Use arrows or swipe to select a slide.
  - paragraph [ref=e192]:
    - link "Options and framework examples" [ref=e193] [cursor=pointer]:
      - /url: ../../../docs/carousel.md
    - text: ·
    - link "Arco reference" [ref=e194] [cursor=pointer]:
      - /url: https://arco.design/vue/component/carousel
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