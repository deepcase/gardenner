import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const catalog = await import("../dist/generated/catalog.js");
const components = await import("../dist/generated/components.js");
const api = JSON.parse(await readFile(new URL("../metadata/public-api.json", import.meta.url), "utf8"));
const css = JSON.parse(await readFile(new URL("../../css/metadata/components.json", import.meta.url), "utf8"));
const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");

test("all 575 Gardenerim CSS components have unique React exports", () => {
  assert.equal(catalog.componentCatalog.length, 575);
  assert.equal(Object.keys(components.gardenerimComponents).length, 575);
  assert.equal(new Set(catalog.componentCatalog.map(({ name }) => name)).size, 575);
  assert.equal(new Set(catalog.componentCatalog.map(({ exportName }) => exportName)).size, 575);
  assert.deepEqual(catalog.componentCatalog.map(({ name }) => name), css.components.map(({ name }) => name));
});

test("component behaviors are covered by the 96-behavior runtime", async () => {
  const runtime = JSON.parse(await readFile(new URL("../../css/metadata/public-api.json", import.meta.url), "utf8"));
  const behaviorSet = new Set(runtime.javascript.behaviors);
  for (const component of catalog.componentCatalog) for (const behavior of component.behaviors) assert.ok(behaviorSet.has(behavior), `${component.name}/${behavior}`);
  assert.equal(api.behaviors, 96);
});

test("the stable API records every root runtime and TypeScript contract", async () => {
  const module = await import("../dist/index.js");
  assert.equal(api.status, "stable");
  assert.deepEqual(api.componentExports, catalog.componentCatalog.map(({ exportName }) => exportName));
  assert.deepEqual(api.moduleExports, Object.keys(module).sort());
  assert.equal(api.moduleExports.length, 615);
  assert.equal(api.typeExports.length, 32);
  for(const type of ['GardenerimNavigationItem','GardenerimNavigationOptions','GardenerimNavigationChange','GardenerimNavigationInstance'])assert.ok(api.typeExports.includes(type));
  assert.equal(api.hooks.length, 8);
  assert.deepEqual(api.componentProps, ["as", "variant", "state", "config", "initialize", "value", "defaultValue", "valueEvent", "valueKey", "onValueChange", "navigation", "items", "table", "columns", "data"]);
  assert.equal(api.themeAxes.length, 10);
});

test("behavior-only selectors retain required visual root classes", () => {
  const expected = { combobox: "g-combobox", tabs: "g-tabs", dialog: "g-dialog-backdrop", drawer: "g-drawer-backdrop", popover: "g-popover", toast: "g-toast", accordion: "g-accordion", "data-grid": "g-data-grid", tree: "g-tree", carousel: "g-carousel", "split-pane": "g-split-pane" };
  for (const [name, className] of Object.entries(expected)) assert.equal(catalog.componentByName.get(name).className, className);
});

test("all 575 generated components render valid SSR roots", () => {
  for (const definition of catalog.componentCatalog) {
    const Component = components.gardenerimComponents[definition.exportName];
    const html = renderToStaticMarkup(createElement(Component));
    assert.match(html, /^<[^>]+/u, definition.exportName);
    if (definition.className) assert.match(html, new RegExp(`class="[^"]*${definition.className}`, "u"), definition.exportName);
  }
});

test("badge, tag, and chip render independent semantic roots", () => {
  for (const [name, exportName, rootClass] of [["badge", "GBadge", "g-badge"], ["tag", "GTag", "g-tag"], ["chip", "GChip", "g-chip"]]) {
    const definition = catalog.componentByName.get(name);
    const html = renderToStaticMarkup(createElement(components[exportName], { variant: "solid", state: "success" }, name));
    assert.equal(definition.tag, "span");
    assert.match(html, new RegExp(`<span[^>]* class="[^"]*${rootClass}[^"]*${rootClass}-solid[^"]*is-success`, "u"));
  }
});

test("avatar-group is a dedicated SSR component instead of avatar content", () => {
  const avatar = renderToStaticMarkup(createElement(components.GAvatar, { variant: ["xl", "rounded", "status"], state: "online", "aria-label": "Lin, online" }, "L"));
  const group = renderToStaticMarkup(createElement(components.GAvatarGroup, { variant: ["large", "spaced"], role: "group", "aria-label": "Team" }, avatar));
  assert.match(avatar, /class="g-avatar g-avatar-xl g-avatar-rounded g-avatar-status is-online"/u);
  assert.match(group, /class="g-avatar-group g-avatar-group-large g-avatar-group-spaced"/u);
  assert.doesNotMatch(group, />group</u);
});

test("divider variants compose into a semantic SSR root", () => {
  const html = renderToStaticMarkup(createElement(components.GDividerWithText, {
    variant: ["start", "dashed", "large"],
    role: "separator",
    "aria-orientation": "horizontal",
  }, createElement("span", { className: "g-divider-text" }, "Section")));
  assert.match(html, /class="g-divider g-divider-start g-divider-dashed g-divider-large"/u);
  assert.match(html, /role="separator"/u);
  assert.match(html, /aria-orientation="horizontal"/u);
});

test("alert variants and states compose into a semantic SSR root", () => {
  const html = renderToStaticMarkup(createElement(components.GAlert, {
    variant: ["with-title", "outlined", "closable"],
    state: "error",
    role: "alert",
    "aria-live": "assertive",
  }, createElement("div", { className: "g-alert-body" },
    createElement("strong", { className: "g-alert-title" }, "Publish failed"),
    createElement("span", { className: "g-alert-content" }, "Try again"))));
  assert.match(html, /class="g-alert g-alert-with-title g-alert-outlined g-alert-closable is-error"/u);
  assert.match(html, /role="alert"/u);
  assert.match(html, /aria-live="assertive"/u);
});

test("input variants and validation state compose into a native SSR control", () => {
  const html = renderToStaticMarkup(createElement(components.GInput, {
    variant: ["outlined", "large"],
    state: "error",
    type: "search",
    defaultValue: "Gardenerim",
    "aria-label": "Search components",
    "aria-invalid": true,
  }));
  assert.match(html, /^<input/u);
  assert.match(html, /class="g-input g-input-outlined g-input-large is-error"/u);
  assert.match(html, /type="search"/u);
  assert.match(html, /aria-invalid="true"/u);
});

test("checkbox and radio compose rich native labels and mixed-state contracts in SSR", () => {
  const checkbox = renderToStaticMarkup(createElement(components.GCheckboxRadio, {
    as: "label",
    variant: ["card", "large"],
    state: "error",
    "aria-invalid": true,
  }, createElement("input", { type: "checkbox", defaultChecked: true, "aria-checked": "mixed" }),
  createElement("span", { className: "g-choice-content" }, createElement("strong", { className: "g-choice-label" }, "Export"), createElement("small", { className: "g-choice-description" }, "Allow export"))));
  assert.match(checkbox, /^<label/u);
  assert.match(checkbox, /class="g-check g-check-card g-check-large is-error"/u);
  assert.match(checkbox, /type="checkbox"/u);
  assert.match(checkbox, /aria-checked="mixed"/u);
  assert.match(checkbox, /g-choice-description/u);
});

test("checkbox-group composes a semantic selectable fieldset with group feedback in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GCheckboxGroup, {
    variant: ["grid", "two", "cards", "block"],
    state: "partial",
    "aria-describedby": "permissions-status",
  },
  createElement("legend", { className: "g-choice-group-legend" }, "Permissions"),
  createElement("label", { className: "g-choice-group-select-all" }, createElement("input", { type: "checkbox", "data-g-select-all": "" }), "All"),
  createElement("div", { className: "g-choice-group-options" },
    createElement("label", { className: "g-check g-choice-group-option", "data-g-selectable-row": "" }, createElement("input", { type: "checkbox", value: "read", "data-g-select-row": "", defaultChecked: true }), createElement("span", { className: "g-choice-group-option-content" }, "Read"))),
  createElement("output", { className: "g-choice-group-count", "data-g-selection-count": "" }, "1"),
  createElement("small", { id: "permissions-status", className: "g-choice-group-status", role: "status" }, "1 selected")));
  assert.match(html, /^<fieldset/u);
  assert.match(html, /class="g-check-group g-check-group-grid g-check-group-two g-check-group-cards g-check-group-block is-partial"/u);
  assert.match(html, /data-g-row-select=""/u);
  assert.match(html, /data-g-select-all=""/u);
  assert.match(html, /data-g-select-row=""/u);
  assert.match(html, /role="status"/u);
});

test("radio-group composes an exclusive semantic fieldset with validation feedback in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GRadioGroup, {
    variant: ["cards", "three", "block"],
    state: "selected",
    "aria-describedby": "plan-help plan-status",
    "aria-required": true,
  },
  createElement("legend", { className: "g-choice-group-legend" }, "Plan"),
  createElement("p", { id: "plan-help", className: "g-choice-group-description" }, "Choose one plan"),
  createElement("div", { className: "g-choice-group-options" },
    createElement("label", { className: "g-radio g-choice-group-option" }, createElement("input", { type: "radio", name: "plan", value: "starter", required: true, defaultChecked: true }), createElement("span", { className: "g-choice-group-option-content" }, "Starter")),
    createElement("label", { className: "g-radio g-choice-group-option" }, createElement("input", { type: "radio", name: "plan", value: "team" }), createElement("span", { className: "g-choice-group-option-content" }, "Team"))),
  createElement("small", { id: "plan-status", className: "g-choice-group-status", role: "status" }, "Starter selected")));
  assert.match(html, /^<fieldset/u);
  assert.match(html, /class="g-radio-group g-radio-group-cards g-radio-group-three g-radio-group-block is-selected"/u);
  assert.match(html, /aria-required="true"/u);
  assert.match(html, /type="radio"/u);
  assert.match(html, /name="plan"/u);
  assert.match(html, /role="status"/u);
});

test("switch composes native boolean input, inline content, loading, and card styling in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GSwitch, {
    as: "label",
    variant: ["wide", "inline-prompt", "card"],
    state: "loading",
    "aria-busy": true,
  }, createElement("input", { type: "checkbox", role: "switch", defaultChecked: true, name: "sync" }),
  createElement("span", { className: "g-switch-track", "aria-hidden": true }, createElement("span", { className: "g-switch-checked-content" }, "ON"), createElement("span", { className: "g-switch-unchecked-content" }, "OFF")),
  createElement("span", { className: "g-switch-content" }, createElement("strong", { className: "g-switch-label" }, "Cloud sync"))));
  assert.match(html, /^<label/u);
  assert.match(html, /class="g-switch g-switch-wide g-switch-inline-prompt g-switch-card is-loading"/u);
  assert.match(html, /type="checkbox"/u);
  assert.match(html, /role="switch"/u);
  assert.match(html, /aria-busy="true"/u);
  assert.match(html, /g-switch-checked-content/u);
});

test("switch-row composes a whole-row native label with status and switch control in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GSwitchRow, {
    variant: ["card", "block"],
    state: "checked",
    "aria-describedby": "autosave-description autosave-status",
  },
  createElement("span", { className: "g-switch-row-content" },
    createElement("strong", { className: "g-switch-row-title" }, "Autosave"),
    createElement("small", { id: "autosave-description", className: "g-switch-row-description" }, "Save every 30 seconds")),
  createElement("span", { className: "g-switch-row-control" },
    createElement("small", { id: "autosave-status", className: "g-switch-row-status", role: "status" }, "On"),
    createElement("span", { className: "g-switch" }, createElement("input", { type: "checkbox", role: "switch", defaultChecked: true }), createElement("span", { className: "g-switch-track", "aria-hidden": true })))));
  assert.match(html, /^<label/u);
  assert.match(html, /class="g-switch-row g-switch-row-card g-switch-row-block is-checked"/u);
  assert.match(html, /class="g-switch-row-control"/u);
  assert.match(html, /role="switch"/u);
  assert.match(html, /role="status"/u);
});

test("choice-card-group composes semantic responsive cards with native selection in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GChoiceCardGroup, {
    variant: ["grid", "three", "single", "block"],
    state: "selected",
    "aria-required": true,
    "aria-describedby": "tier-help tier-status",
  },
  createElement("legend", { className: "g-choice-group-legend" }, "Tier"),
  createElement("p", { id: "tier-help", className: "g-choice-group-description" }, "Choose one tier"),
  createElement("div", { className: "g-choice-group-options" },
    createElement("label", { className: "g-choice-card" }, createElement("input", { type: "radio", name: "tier", value: "team", defaultChecked: true }), createElement("span", { className: "g-choice-card-header" }, createElement("strong", { className: "g-choice-card-title" }, "Team")), createElement("span", { className: "g-choice-card-description" }, "For collaborators"), createElement("span", { className: "g-choice-card-price" }, "$49"))),
  createElement("small", { id: "tier-status", className: "g-choice-group-status", role: "status" }, "Team selected")));
  assert.match(html, /^<fieldset/u);
  assert.match(html, /class="g-choice-group g-choice-group-grid g-choice-group-three g-choice-group-single g-choice-group-block is-selected"/u);
  assert.match(html, /class="g-choice-card"/u);
  assert.match(html, /type="radio"/u);
  assert.match(html, /role="status"/u);
});

test("name-group composes international native name fields in semantic SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GNameGroup, {
    variant: ["western", "three", "block"],
    state: "success",
    "aria-describedby": "name-help name-status",
  },
  createElement("legend", { className: "g-name-group-legend" }, "Legal name"),
  createElement("p", { id: "name-help", className: "g-name-group-description" }, "As shown on ID"),
  createElement("div", { className: "g-name-field g-name-given" }, createElement("label", { htmlFor: "given" }, "Given"), createElement("input", { id: "given", autoComplete: "given-name", value: "Ada", readOnly: true })),
  createElement("div", { className: "g-name-field g-name-family" }, createElement("label", { htmlFor: "family" }, "Family"), createElement("input", { id: "family", autoComplete: "family-name", value: "Lovelace", readOnly: true })),
  createElement("small", { id: "name-status", className: "g-name-group-status", role: "status" }, "Complete")));
  assert.match(html, /^<fieldset/u);
  assert.match(html, /class="g-name-group g-name-group-western g-name-group-three g-name-group-block is-success"/u);
  assert.match(html, /autoComplete="given-name"/u);
  assert.match(html, /autoComplete="family-name"/u);
  assert.match(html, /role="status"/u);
});

test("address-group composes international native address fields in semantic SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GAddressGroup, {
    variant: ["international", "card", "block"],
    state: "success",
    "aria-describedby": "address-help address-status",
  },
  createElement("legend", { className: "g-address-group-legend" }, "Shipping address"),
  createElement("p", { id: "address-help", className: "g-address-group-description" }, "Use the delivery address"),
  createElement("div", { className: "g-address-field g-address-line-1" }, createElement("label", { htmlFor: "street" }, "Street"), createElement("input", { id: "street", autoComplete: "address-line1", value: "12 Garden Road", readOnly: true })),
  createElement("div", { className: "g-address-field g-address-city" }, createElement("label", { htmlFor: "city" }, "City"), createElement("input", { id: "city", autoComplete: "address-level2", value: "London", readOnly: true })),
  createElement("div", { className: "g-address-field g-address-postal" }, createElement("label", { htmlFor: "postal" }, "Postal code"), createElement("input", { id: "postal", autoComplete: "postal-code", value: "SW1A 1AA", readOnly: true })),
  createElement("small", { id: "address-status", className: "g-address-group-status", role: "status" }, "Complete")));
  assert.match(html, /^<fieldset/u);
  assert.match(html, /class="g-address-group g-address-group-international g-address-group-card g-address-group-block is-success"/u);
  assert.match(html, /autoComplete="address-line1"/u);
  assert.match(html, /role="status"/u);
});

test("phone-group composes native international telephone fields in semantic SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GPhoneGroup, {
    variant: ["international", "card", "block"],
    state: "success",
    "aria-describedby": "phone-help phone-status",
  },
  createElement("legend", { className: "g-phone-group-legend" }, "Phone number"),
  createElement("p", { id: "phone-help", className: "g-phone-group-description" }, "Include a country calling code"),
  createElement("div", { className: "g-phone-field g-phone-country-code" }, createElement("label", { htmlFor: "calling-code" }, "Calling code"), createElement("input", { id: "calling-code", autoComplete: "tel-country-code", value: "+44", readOnly: true })),
  createElement("div", { className: "g-phone-field g-phone-national" }, createElement("label", { htmlFor: "number" }, "Number"), createElement("input", { id: "number", type: "tel", inputMode: "tel", autoComplete: "tel-national", value: "20 7946 0958", readOnly: true })),
  createElement("div", { className: "g-phone-preview" }, createElement("strong", null, "E.164"), " +442079460958"),
  createElement("small", { id: "phone-status", className: "g-phone-group-status", role: "status" }, "Valid")));
  assert.match(html, /^<fieldset/u);
  assert.match(html, /class="g-phone-group g-phone-group-international g-phone-group-card g-phone-group-block is-success"/u);
  assert.match(html, /autoComplete="tel-national"/u);
  assert.match(html, /inputMode="tel"/u);
  assert.match(html, /role="status"/u);
});

test("money-group composes native currency and amount fields in semantic SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GMoneyGroup, {
    variant: ["international", "accounting", "card", "block"],
    state: "success",
    "aria-describedby": "money-help money-status",
  },
  createElement("legend", { className: "g-money-group-legend" }, "Invoice amount"),
  createElement("p", { id: "money-help", className: "g-money-group-description" }, "Choose a transaction currency"),
  createElement("div", { className: "g-money-field g-money-currency" }, createElement("label", { htmlFor: "currency" }, "Currency"), createElement("select", { id: "currency", autoComplete: "transaction-currency", defaultValue: "USD" }, createElement("option", null, "USD"))),
  createElement("div", { className: "g-money-field g-money-amount" }, createElement("label", { htmlFor: "amount" }, "Amount"), createElement("div", { className: "g-money-control" }, createElement("span", { className: "g-money-symbol", "aria-hidden": true }, "$"), createElement("input", { id: "amount", inputMode: "decimal", autoComplete: "transaction-amount", value: "1280.50", readOnly: true }))),
  createElement("div", { className: "g-money-converted" }, createElement("strong", null, "Formatted"), " $1,280.50"),
  createElement("small", { id: "money-status", className: "g-money-group-status", role: "status" }, "Valid")));
  assert.match(html, /^<fieldset/u);
  assert.match(html, /class="g-money-group g-money-group-international g-money-group-accounting g-money-group-card g-money-group-block is-success"/u);
  assert.match(html, /autoComplete="transaction-amount"/u);
  assert.match(html, /inputMode="decimal"/u);
  assert.match(html, /role="status"/u);
});

test("date-range-group composes constrained native dates in semantic SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GDateRangeGroup, {
    variant: ["date", "inclusive", "card", "block"],
    state: "complete",
    "aria-describedby": "range-help range-status",
  },
  createElement("legend", { className: "g-date-range-legend" }, "Travel dates"),
  createElement("p", { id: "range-help", className: "g-date-range-description" }, "Choose an inclusive range"),
  createElement("div", { className: "g-date-range-field g-date-range-start" }, createElement("label", { htmlFor: "start" }, "Start"), createElement("input", { id: "start", type: "date", min: "2026-09-01", max: "2026-12-31", value: "2026-09-05", readOnly: true })),
  createElement("span", { className: "g-range-separator", "aria-hidden": true }, "to"),
  createElement("div", { className: "g-date-range-field g-date-range-end" }, createElement("label", { htmlFor: "end" }, "End"), createElement("input", { id: "end", type: "date", min: "2026-09-05", max: "2026-12-31", value: "2026-09-08", readOnly: true })),
  createElement("div", { className: "g-date-range-duration" }, createElement("strong", null, "4 days")),
  createElement("small", { id: "range-status", className: "g-date-range-status", role: "status" }, "Complete")));
  assert.match(html, /^<fieldset/u);
  assert.match(html, /class="g-date-range-group g-date-range-group-date g-date-range-group-inclusive g-date-range-group-card g-date-range-group-block is-complete"/u);
  assert.match(html, /type="date"/u);
  assert.match(html, /min="2026-09-05"/u);
  assert.match(html, /role="status"/u);
});

test("range-color composes native range and color inputs with rich structure in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GRangeColor, {
    variant: ["range", "dual", "with-value"],
    state: "invalid",
    "aria-invalid": true,
  }, createElement("div", { className: "g-range-header" },
    createElement("label", { className: "g-range-label", htmlFor: "budget" }, "Budget"),
    createElement("output", { className: "g-range-value", htmlFor: "budget" }, "20–87")),
  createElement("div", { className: "g-range-dual" },
    createElement("span", { className: "g-range-dual-rail", "aria-hidden": true }),
    createElement("span", { className: "g-range-dual-fill", "aria-hidden": true }),
    createElement("input", { id: "budget", className: "g-range", type: "range", min: 0, max: 100, defaultValue: 20, "aria-label": "Minimum budget" }),
    createElement("input", { className: "g-range", type: "range", min: 0, max: 100, defaultValue: 87, "aria-label": "Maximum budget" }))));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-range-color g-range-color-range g-range-color-dual g-range-color-with-value is-invalid"/u);
  assert.match(html, /type="range"/u);
  assert.match(html, /aria-label="Minimum budget"/u);
  assert.match(html, /g-range-dual-fill/u);
});

test("file-drop composes a validated drop target and upload queue in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GFileDrop, {
    variant: ["dragger", "with-list"],
    state: "uploading",
    "data-g-accept": "image/png,application/pdf",
    "data-g-max-size": 5242880,
    "data-g-max-files": 5,
    "data-g-paste": "",
    "aria-busy": true,
  }, createElement("input", { className: "g-file-drop-input", type: "file", accept: "image/png,application/pdf", multiple: true }),
  createElement("span", { className: "g-file-drop-content" },
    createElement("strong", { className: "g-file-drop-title" }, "Drop files here"),
    createElement("span", { className: "g-file-drop-description" }, "or browse"))));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-file-drop g-file-drop-dragger g-file-drop-with-list is-uploading"/u);
  assert.match(html, /data-g-dropzone=""/u);
  assert.match(html, /data-g-max-size="5242880"/u);
  assert.match(html, /aria-busy="true"/u);
  assert.match(html, /class="g-file-drop-input"/u);
  assert.match(html, /multiple=""/u);
});

test("upload queue composes a runtime-managed, accessible progress list in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GUploadQueue, {
    variant: ["compact", "bordered"],
    "aria-labelledby": "upload-title",
  },
  createElement("header", { className: "g-upload-queue-header" },
    createElement("strong", { id: "upload-title", className: "g-upload-queue-title" }, "Upload queue"),
    createElement("span", { className: "g-upload-summary" }, createElement("b", { "data-g-upload-count": "total" }, "1")),
    createElement("input", { className: "g-upload-input", type: "file", multiple: true, "data-g-upload-input": "" })),
  createElement("span", { "data-g-upload-live": "" }),
  createElement("div", { className: "g-upload-list", role: "list", "data-g-upload-list": "" },
    createElement("div", { className: "g-upload-item", role: "listitem", "data-g-upload-item": "", "data-g-status": "uploading", "data-g-progress": "45" },
      createElement("span", { className: "g-file-icon", "aria-hidden": true }, "PDF"),
      createElement("span", { className: "g-file-main" }, createElement("strong", { className: "g-file-name" }, "guide.pdf"), createElement("span", { className: "g-upload-status", "data-g-upload-status": "" })),
      createElement("span", { className: "g-upload-progress", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 45, "data-g-upload-progress": "" }, createElement("i", { className: "g-upload-progress-bar" })),
      createElement("span", { className: "g-upload-actions" }, createElement("button", { type: "button", "data-g-upload-action": "pause" }, "Pause"))))));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-upload-queue g-upload-queue-compact g-upload-queue-bordered"/u);
  assert.match(html, /data-g-upload-manager=""/u);
  assert.match(html, /role="progressbar"/u);
  assert.match(html, /aria-valuenow="45"/u);
  assert.match(html, /multiple=""/u);
});

test("combobox composes editable input, rich grouped suggestions, clear, loading, and creation in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GCombobox, {
    variant: ["outlined", "clearable", "grouped", "allow-create"],
    state: "open",
    "data-g-filter": "starts-with",
  }, createElement("div", { className: "g-combobox-control" },
    createElement("span", { className: "g-combobox-prefix" }, "@"),
    createElement("input", { className: "g-combobox-input", defaultValue: "ad", "aria-label": "Assignee" }),
    createElement("button", { className: "g-combobox-clear", type: "button", "data-g-combobox-clear": "" }, "Clear"),
    createElement("span", { className: "g-combobox-toggle", "aria-hidden": true })),
  createElement("span", { className: "g-combobox-status", "aria-live": "polite" }),
  createElement("div", { className: "g-combobox-list", role: "listbox" },
    createElement("section", { className: "g-combobox-group", role: "group" },
      createElement("div", { className: "g-combobox-group-label" }, "People"),
      createElement("div", { className: "g-combobox-option", role: "option", "data-g-value": "ada", "data-g-label": "Ada Lovelace" }, createElement("span", { className: "g-combobox-option-title" }, "Ada Lovelace"))),
    createElement("div", { className: "g-combobox-create", role: "option", "data-g-combobox-create": "" }, "Create"))));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-combobox g-combobox-outlined g-combobox-clearable g-combobox-grouped g-combobox-allow-create is-open"/u);
  assert.match(html, /data-g-combobox=""/u);
  assert.match(html, /data-g-filter="starts-with"/u);
  assert.match(html, /class="g-combobox-input"/u);
  assert.match(html, /role="listbox"/u);
  assert.match(html, /data-g-value="ada"/u);
});

test("textarea variants, state, rows, limits, and auto-resize compose into native SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GTextarea, {
    variant: ["outlined", "auto-size"],
    state: "error",
    defaultValue: "Review copy",
    rows: 2,
    maxLength: 87,
    config: { autoResize: true, minRows: 2, maxRows: 5 },
    "aria-label": "Review note",
    "aria-invalid": true,
  }));
  assert.match(html, /^<textarea/u);
  assert.match(html, /class="g-textarea g-textarea-outlined g-textarea-auto-size is-error"/u);
  assert.match(html, /data-g-auto-resize=""/u);
  assert.match(html, /data-g-min-rows="2"/u);
  assert.match(html, /data-g-max-rows="5"/u);
  assert.match(html, /rows="2"/u);
  assert.match(html, /maxLength="87"/u);
  assert.match(html, /aria-invalid="true"/u);
});

test("select composes native multiple values, appearance, validation, and disabled options into SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GSelect, {
    variant: ["outlined", "large", "multiple"],
    state: "warning",
    name: "reviewers",
    multiple: true,
    defaultValue: ["ava"],
    "aria-describedby": "reviewer-help",
  },
  createElement("option", { value: "ava" }, "Ava"),
  createElement("option", { value: "lin", disabled: true }, "Lin")));
  assert.match(html, /^<select/u);
  assert.match(html, /class="g-select g-select-outlined g-select-large g-select-multiple is-warning"/u);
  assert.match(html, /multiple=""/u);
  assert.match(html, /name="reviewers"/u);
  assert.match(html, /value="lin" disabled=""/u);
});

test("tree-select composes searchable checkable hierarchy and picker behavior into SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GTreeSelect, {
    variant: ["outlined", "multiple", "searchable", "clearable"],
    state: "open",
    config: { pickerTree: true, pickerMultiple: true, pickerCascade: true, treeValueStrategy: "leaf" },
    role: "group",
    "aria-label": "Organization tree",
  }, createElement("div", { className: "g-picker-control", "data-g-picker-trigger": "" }, "Select teams")));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-tree-select g-tree-select-outlined g-tree-select-multiple g-tree-select-searchable g-tree-select-clearable is-open"/u);
  assert.match(html, /data-g-picker=""/u);
  assert.match(html, /data-g-picker-tree=""/u);
  assert.match(html, /data-g-picker-multiple=""/u);
  assert.match(html, /data-g-picker-cascade=""/u);
  assert.match(html, /data-g-tree-value-strategy="leaf"/u);
});

test("password field variants, behavior configuration, and native controls compose into SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GPasswordField, {
    variant: ["outlined", "large", "hide-on-blur"],
    state: "error",
    config: { defaultVisible: true, hideOnBlur: true },
    role: "group",
    "aria-label": "Account password",
  },
  createElement(components.GInput, {
    id: "account-password",
    type: "password",
    autoComplete: "current-password",
    defaultValue: "secret",
  }),
  createElement("button", { type: "button", "data-g-password-button": "" }, "Show")));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-password-field g-password-field-outlined g-password-field-large g-password-field-hide-on-blur is-error"/u);
  assert.match(html, /data-g-password-toggle=""/u);
  assert.match(html, /data-g-default-visible=""/u);
  assert.match(html, /data-g-hide-on-blur=""/u);
  assert.match(html, /type="password"/u);
  assert.match(html, /autoComplete="current-password"/u);
  assert.match(html, /data-g-password-button=""/u);
});

test("clearable field composes appearance, state, behavior configuration, and native controls into SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GClearableField, {
    variant: ["outlined", "large", "clear-on-escape"],
    state: "error",
    config: { clearOnEscape: "true", clearVisibility: "always" },
    role: "group",
    "aria-label": "Clearable search",
  },
  createElement(components.GInput, { id: "clearable-search", type: "search", defaultValue: "Garden" }),
  createElement("button", { type: "button", "data-g-clear-button": "" }, "Clear")));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-clearable-field g-clearable-field-outlined g-clearable-field-large g-clearable-field-clear-on-escape is-error"/u);
  assert.match(html, /data-g-clear-input=""/u);
  assert.match(html, /data-g-clear-on-escape="true"/u);
  assert.match(html, /data-g-clear-visibility="always"/u);
  assert.match(html, /type="search"/u);
  assert.match(html, /data-g-clear-button=""/u);
});

test("toast variants and states compose into a semantic SSR message", () => {
  const html = renderToStaticMarkup(createElement(components.GToast, {
    variant: ["with-title", "closable", "with-action"], state: "success", role: "status", "aria-atomic": true,
  }, createElement("div", { className: "g-toast-content" },
    createElement("strong", { className: "g-toast-title" }, "Published"),
    createElement("span", { className: "g-toast-message" }, "The release is live"))));
  assert.match(html, /class="g-toast g-toast-with-title g-toast-closable g-toast-with-action is-success"/u);
  assert.match(html, /role="status"/u);
  assert.match(html, /aria-atomic="true"/u);
});

test("progress and meter variants compose into semantic SSR roots", () => {
  const progress = renderToStaticMarkup(createElement(components.GProgressMeter, {
    variant: ["circle", "large", "striped"], state: "active", role: "progressbar",
    "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 68,
  }, createElement("span", { className: "g-progress-text" }, "68%")));
  const meter = renderToStaticMarkup(createElement(components.GProgressMeter, {
    variant: "meter", role: "meter", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 72,
  }, createElement("span", { className: "g-meter-segment" })));
  assert.match(progress, /class="g-progress g-progress-circle g-progress-large g-progress-striped is-active"/u);
  assert.match(progress, /role="progressbar"/u);
  assert.match(progress, /aria-valuenow="68"/u);
  assert.match(meter, /class="g-progress g-progress-meter"/u);
  assert.match(meter, /role="meter"/u);
});

test("empty-state layouts and scenarios compose into a semantic SSR root", () => {
  const html = renderToStaticMarkup(createElement(components.GEmptyState, {
    variant: ["card", "compact"], state: "no-results", role: "status", "aria-labelledby": "empty-title",
  }, createElement("div", { className: "g-empty-content" },
    createElement("strong", { id: "empty-title", className: "g-empty-title" }, "No results"),
    createElement("p", { className: "g-empty-description" }, "Try another keyword"))));
  assert.match(html, /class="g-empty g-empty-card g-empty-compact is-no-results"/u);
  assert.match(html, /role="status"/u);
  assert.match(html, /aria-labelledby="empty-title"/u);
});

test("spinner and skeleton modes compose into accessible SSR roots", () => {
  const spinner = renderToStaticMarkup(createElement(components.GSpinnerSkeleton, {
    variant: ["dots", "large"], state: "loading", role: "status", "aria-label": "Loading",
  }, [1, 2, 3].map((key) => createElement("span", { key, className: "g-spinner-dot" }))));
  const skeleton = renderToStaticMarkup(createElement(components.GSpinnerSkeleton, {
    variant: ["skeleton", "with-avatar", "active"], state: "loading", role: "status", "aria-label": "Profile loading", "aria-busy": true,
  }, createElement("span", { className: "g-skeleton-avatar", "aria-hidden": true })));
  assert.match(spinner, /class="g-spinner g-spinner-dots g-spinner-large is-loading"/u);
  assert.match(spinner, /role="status"/u);
  assert.equal((spinner.match(/class="g-spinner-dot"/gu) || []).length, 3);
  assert.match(skeleton, /class="g-spinner g-spinner-skeleton g-spinner-with-avatar g-spinner-active is-loading"/u);
  assert.match(skeleton, /aria-busy="true"/u);
});

test("status-bar variants compose into an accessible application status surface", () => {
  const html = renderToStaticMarkup(createElement(components.GStatusBar, {
    variant: ["primary", "compact", "responsive"], state: "loading", role: "toolbar", "aria-label": "Workspace status", "aria-busy": true,
  }, createElement("div", { className: "g-status-bar-section is-start" },
    createElement("button", { className: "g-status-bar-item is-current", "aria-current": true }, "main"))));
  assert.match(html, /class="g-status-bar g-status-bar-primary g-status-bar-compact g-status-bar-responsive is-loading"/u);
  assert.match(html, /role="toolbar"/u);
  assert.match(html, /aria-busy="true"/u);
  assert.match(html, /g-status-bar-item is-current/u);
});

test("context-bar variants compose into an accessible actionable contextual message", () => {
  const html = renderToStaticMarkup(createElement(components.GContextBar, {
    variant: ["soft", "with-title", "dismissible"], state: "warning", role: "region", "aria-labelledby": "context-title",
  }, createElement("div", { className: "g-context-bar-body" },
    createElement("strong", { id: "context-title", className: "g-context-bar-title" }, "Storage almost full"),
    createElement("span", { className: "g-context-bar-description" }, "8% remaining")),
  createElement("div", { className: "g-context-bar-actions" }, createElement("button", { className: "g-context-bar-action" }, "Manage"))));
  assert.match(html, /class="g-context-bar g-context-bar-soft g-context-bar-with-title g-context-bar-dismissible is-warning"/u);
  assert.match(html, /role="region"/u);
  assert.match(html, /aria-labelledby="context-title"/u);
  assert.match(html, /g-context-bar-action/u);
});

test("page-loading composes a measurable, accessible page task with recovery content", () => {
  const html = renderToStaticMarkup(createElement(components.GPageLoading, {
    variant: ["contained", "large"], state: "determinate", role: "status", "aria-live": "polite", "aria-busy": true,
    "aria-labelledby": "loading-title", style: { "--g-page-loading-progress": "64%" },
  }, createElement("div", { className: "g-page-loading-content" },
  createElement("strong", { id: "loading-title", className: "g-page-loading-title" }, "Importing customers"),
  createElement("div", { className: "g-page-loading-progress", role: "progressbar", "aria-label": "Import progress", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 64 }),
  createElement("div", { className: "g-page-loading-actions" }, createElement("button", { className: "g-page-loading-action" }, "Cancel")))));
  assert.match(html, /class="g-page-loading g-page-loading-contained g-page-loading-large is-determinate"/u);
  assert.match(html, /aria-busy="true"/u);
  assert.match(html, /role="progressbar"/u);
  assert.match(html, /aria-valuenow="64"/u);
  assert.match(html, /g-page-loading-action/u);
});

test("page-state-system composes an accessible exception with diagnostics and recovery actions", () => {
  const html = renderToStaticMarkup(createElement(components.GPageStateSystem, {
    variant: ["500", "split", "card"], state: "server-error", role: "region", "aria-labelledby": "state-title", "aria-describedby": "state-description",
  }, createElement("div", { className: "g-page-state-content" },
  createElement("div", { className: "g-page-state-visual", "aria-hidden": true }),
  createElement("div", { className: "g-page-state-body" },
    createElement("strong", { className: "g-page-state-code" }, "500"),
    createElement("h2", { id: "state-title", className: "g-page-state-title" }, "Server unavailable"),
    createElement("p", { id: "state-description", className: "g-page-state-description" }, "Your data is safe."),
    createElement("span", { className: "g-page-state-request-id" }, "req_7F2A91"),
    createElement("div", { className: "g-page-state-actions" }, createElement("button", { className: "g-page-state-action g-page-state-primary-action" }, "Retry"))))));
  assert.match(html, /class="g-page-state g-page-state-500 g-page-state-split g-page-state-card is-server-error"/u);
  assert.match(html, /role="region"/u);
  assert.match(html, /aria-labelledby="state-title"/u);
  assert.match(html, /g-page-state-request-id/u);
  assert.match(html, /g-page-state-primary-action/u);
});

test("form composes semantic submission, layout, validation summary, and field feedback in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GForm, {
    variant: ["bordered", "horizontal", "spacious"],
    state: ["validated", "error"],
    "aria-labelledby": "profile-title",
    "aria-busy": false,
    noValidate: true,
  },
  createElement("header", { className: "g-form-header" }, createElement("h2", { id: "profile-title", className: "g-form-title" }, "Profile")),
  createElement("div", { className: "g-form-summary", role: "alert" }, "Fix one field"),
  createElement("label", { className: "g-field is-error" }, createElement("span", { className: "g-field-label" }, "Email"), createElement("input", { className: "g-input", type: "email", required: true, "aria-invalid": true }), createElement("small", { className: "g-field-feedback" }, "Enter an email")),
  createElement("div", { className: "g-form-actions" }, createElement("button", { type: "submit" }, "Save"))));
  assert.match(html, /^<form/u);
  assert.match(html, /class="g-form g-form-bordered g-form-horizontal g-form-spacious is-validated is-error"/u);
  assert.match(html, /noValidate=""/u);
  assert.match(html, /role="alert"/u);
  assert.match(html, /type="email"/u);
  assert.match(html, /required=""/u);
  assert.match(html, /aria-invalid="true"/u);
  const fieldset = renderToStaticMarkup(createElement(components.GFieldset, {
    variant: ["card", "choice-cards", "two-columns"], state: "error", disabled: true, "aria-describedby": "plan-error", "aria-invalid": true,
  }, createElement("legend", { className: "g-fieldset-legend" }, createElement("span", { className: "g-fieldset-title" }, "Options")), createElement("div", { className: "g-fieldset-content" }, createElement("label", { className: "g-radio" }, createElement("input", { type: "radio", name: "plan" }), "Starter")), createElement("p", { id: "plan-error", className: "g-fieldset-feedback", role: "alert" }, "Choose a plan")));
  assert.match(fieldset, /^<fieldset/u);
  assert.match(fieldset, /disabled=""/u);
  assert.match(fieldset, /class="g-fieldset g-fieldset-card g-fieldset-choice-cards g-fieldset-two-columns is-error"/u);
  assert.match(fieldset, /aria-invalid="true"/u);
  assert.match(fieldset, /<legend/u);
  assert.match(fieldset, /role="alert"/u);
});

test("field composes responsive layout, validation lifecycle, messages, and actions in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GField, {
    variant: ["horizontal", "required-mark", "block"],
    state: ["dirty", "touched", "error"],
    role: "group",
    "aria-labelledby": "field-label",
    "aria-busy": false,
  },
  createElement("div", { className: "g-field-header" }, createElement("label", { id: "field-label", className: "g-field-label", htmlFor: "field-input" }, "Account")),
  createElement("div", { className: "g-field-control" }, createElement("span", { className: "g-field-prefix" }, "@"), createElement("input", { id: "field-input", className: "g-input", required: true, "aria-invalid": true, "aria-describedby": "field-help field-error", "aria-errormessage": "field-error" }), createElement("button", { className: "g-field-action", type: "button" }, "Clear")),
  createElement("div", { className: "g-field-messages" }, createElement("small", { id: "field-help", className: "g-field-help is-persistent" }, "Use four characters"), createElement("small", { id: "field-error", className: "g-field-feedback", role: "alert" }, "Too short")),
  createElement("span", { className: "g-field-counter" }, "3 / 20")));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-field g-field-horizontal g-field-required-mark g-field-block is-dirty is-touched is-error"/u);
  assert.match(html, /role="group"/u);
  assert.match(html, /for="field-input"/u);
  assert.match(html, /aria-errormessage="field-error"/u);
  assert.match(html, /g-field-messages/u);
  assert.match(html, /g-field-action/u);
});

test("form-row composes explicit columns, asymmetric layouts, spanning, alignment, and state in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GFormRow, {
    variant: ["three", "compact", "align-end", "dense"], state: "error", role: "group", "aria-labelledby": "row-title", "aria-invalid": true,
  }, createElement("span", { id: "row-title" }, "Address"), createElement("input", { className: "g-form-row-item", value: "Shanghai", readOnly: true }), createElement("input", { className: "g-form-row-span-2", value: "Garden Road", readOnly: true }), createElement("div", { className: "g-form-row-actions" }, createElement("button", { type: "button" }, "Save"))));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-form-row g-form-row-three g-form-row-compact g-form-row-align-end g-form-row-dense is-error"/u);
  assert.match(html, /role="group"/u);
  assert.match(html, /aria-invalid="true"/u);
  assert.match(html, /g-form-row-span-2/u);
  assert.match(html, /g-form-row-actions/u);
});

test("form-grid composes column systems, item and row spans, density, and contextual state in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GFormGrid, {
    variant: ["twelve", "compact", "dense", "align-start"], state: "error", role: "group", "aria-labelledby": "grid-title", "aria-invalid": true,
  }, createElement("span", { id: "grid-title", className: "g-form-grid-section" }, "Company profile"), createElement("input", { className: "g-form-grid-span-6", value: "Gardener", readOnly: true }), createElement("input", { className: "g-form-grid-span-3 g-form-grid-row-span-2", value: "Design", readOnly: true }), createElement("div", { className: "g-form-grid-actions" }, createElement("button", { type: "button" }, "Save"))));
  assert.match(html, /^<div/u);
  assert.match(html, /class="g-form-grid g-form-grid-twelve g-form-grid-compact g-form-grid-dense g-form-grid-align-start is-error"/u);
  assert.match(html, /role="group"/u);
  assert.match(html, /aria-invalid="true"/u);
  assert.match(html, /g-form-grid-span-6/u);
  assert.match(html, /g-form-grid-row-span-2/u);
  assert.match(html, /g-form-grid-actions/u);
});

test("horizontal-form composes aligned rows, content feedback, actions, and state in semantic SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GHorizontalForm, {
    as: "form", variant: ["label-lg", "label-end", "spacious", "bordered"], state: ["error", "busy"], "aria-labelledby": "profile-title", "aria-invalid": true, "aria-busy": true, noValidate: true,
  }, createElement("header", { className: "g-form-horizontal-header" }, createElement("h2", { id: "profile-title", className: "g-form-horizontal-title" }, "Profile")), createElement("div", { className: "g-form-horizontal-row" }, createElement("label", { className: "g-form-horizontal-label", htmlFor: "team-name" }, "Team"), createElement("div", { className: "g-form-horizontal-content" }, createElement("input", { id: "team-name", required: true, "aria-invalid": true }), createElement("small", { className: "g-form-horizontal-feedback", role: "alert" }, "Required"))), createElement("div", { className: "g-form-horizontal-actions" }, createElement("button", { type: "submit" }, "Save"))));
  assert.match(html, /^<form/u);
  assert.match(html, /class="g-form-horizontal g-form-horizontal-label-lg g-form-horizontal-label-end g-form-horizontal-spacious g-form-horizontal-bordered is-error is-busy"/u);
  assert.match(html, /aria-invalid="true"/u);
  assert.match(html, /aria-busy="true"/u);
  assert.match(html, /g-form-horizontal-row/u);
  assert.match(html, /g-form-horizontal-feedback/u);
  assert.match(html, /g-form-horizontal-actions/u);
});

test("inline-form composes flexible fields, validation feedback, actions, and semantic SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GInlineForm, {
    as: "form", variant: ["wrap", "field-lg", "compact", "align-end", "bordered"], state: ["error", "busy"], "aria-label": "Search", "aria-invalid": true, "aria-busy": true, noValidate: true,
  }, createElement("div", { className: "g-form-inline-field g-form-inline-field-grow" }, createElement("label", { className: "g-form-inline-label", htmlFor: "query" }, "Query"), createElement("input", { id: "query", "aria-invalid": true }), createElement("small", { className: "g-form-inline-feedback", role: "alert" }, "Required")), createElement("div", { className: "g-form-inline-field g-form-inline-field-fixed" }, createElement("select", null, createElement("option", null, "All"))), createElement("div", { className: "g-form-inline-actions" }, createElement("button", { type: "submit" }, "Search")), createElement("div", { className: "g-form-inline-status", role: "status" }, "0 results")));
  assert.match(html, /^<form/u);
  assert.match(html, /class="g-form-inline g-form-inline-wrap g-form-inline-field-lg g-form-inline-compact g-form-inline-align-end g-form-inline-bordered is-error is-busy"/u);
  assert.match(html, /aria-invalid="true"/u);
  assert.match(html, /g-form-inline-field-grow/u);
  assert.match(html, /g-form-inline-field-fixed/u);
  assert.match(html, /g-form-inline-feedback/u);
  assert.match(html, /g-form-inline-actions/u);
  assert.match(html, /g-form-inline-status/u);
});

test("compact-form composes density, columns, joined controls, feedback, and semantic SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GCompactForm, {
    as: "form", variant: ["three-columns", "tight", "bordered", "block"], state: ["error", "busy"], "aria-label": "Quick settings", "aria-invalid": true, "aria-busy": true, noValidate: true,
  }, createElement("header", { className: "g-compact-form-header" }, createElement("h2", { className: "g-compact-form-title" }, "Settings")), createElement("div", { className: "g-compact-form-field" }, createElement("label", { className: "g-compact-form-label", htmlFor: "slug" }, "Slug"), createElement("div", { className: "g-input-group" }, createElement("input", { id: "slug" }), createElement("button", { type: "button" }, "Check")), createElement("small", { className: "g-compact-form-feedback", role: "alert" }, "Unavailable")), createElement("div", { className: "g-compact-form-actions" }, createElement("button", { type: "submit" }, "Save")), createElement("div", { className: "g-compact-form-status", role: "status" }, "Needs attention")));
  assert.match(html, /^<form/u);
  assert.match(html, /class="g-form-compact g-form-compact-three-columns g-form-compact-tight g-form-compact-bordered g-form-compact-block is-error is-busy"/u);
  assert.match(html, /aria-invalid="true"/u);
  assert.match(html, /g-compact-form-header/u);
  assert.match(html, /g-input-group/u);
  assert.match(html, /g-compact-form-feedback/u);
  assert.match(html, /g-compact-form-actions/u);
  assert.match(html, /g-compact-form-status/u);
});

test("input-group composes labels, mixed controls, sizing, feedback, and accessible SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GInputGroup, {
    variant: ["joined", "large", "outlined", "block"], state: ["error", "loading"], role: "group", "aria-labelledby": "domain-label", "aria-invalid": true, "aria-busy": true,
  }, createElement("label", { id: "domain-label", className: "g-input-group-label", htmlFor: "domain" }, "Domain"), createElement("div", { className: "g-input-group-control" }, createElement("span", { className: "g-input-prepend" }, "https://"), createElement("input", { id: "domain", className: "g-input" }), createElement("select", { className: "g-select" }, createElement("option", null, ".dev")), createElement("button", { className: "g-input-search-button", type: "button" }, "Check")), createElement("small", { className: "g-input-group-feedback", role: "alert" }, "Unavailable"), createElement("span", { className: "g-input-group-status", role: "status" }, "Checking")));
  assert.match(html, /class="g-input-group g-input-group-joined g-input-group-large g-input-group-outlined g-input-group-block is-error is-loading"/u);
  assert.match(html, /aria-invalid="true"/u);
  assert.match(html, /g-input-group-label/u);
  assert.match(html, /g-input-group-control/u);
  assert.match(html, /g-input-prepend/u);
  assert.match(html, /g-input-search-button/u);
  assert.match(html, /g-input-group-feedback/u);
  assert.match(html, /g-input-group-status/u);
});

test("input-affix composes semantic affixes, actions, sizing, and feedback in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GInputAffix, {
    variant: ["outlined", "large", "prefix", "suffix", "clearable", "block"], state: ["error", "loading"], role: "group", "aria-labelledby": "handle-label", "aria-describedby": "handle-feedback", "aria-invalid": true, "aria-busy": true,
  }, createElement("label", { id: "handle-label", className: "g-input-affix-label", htmlFor: "handle" }, "Handle"), createElement("div", { className: "g-input-affix-control" }, createElement("span", { className: "g-input-affix-start", "aria-hidden": true }, "@"), createElement("input", { id: "handle", className: "g-input" }), createElement("span", { className: "g-input-affix-end" }, ".team"), createElement("button", { className: "g-input-affix-action", type: "button", "aria-label": "Clear" }, "×"), createElement("span", { className: "g-input-spinner", "aria-hidden": true })), createElement("small", { id: "handle-feedback", className: "g-input-affix-feedback", role: "alert" }, "Unavailable"), createElement("span", { className: "g-input-affix-status", role: "status" }, "Checking")));
  assert.match(html, /class="g-input-affix g-input-affix-outlined g-input-affix-large g-input-affix-prefix g-input-affix-suffix g-input-affix-clearable g-input-affix-block is-error is-loading"/u);
  assert.match(html, /aria-invalid="true"/u);
  assert.match(html, /g-input-affix-label/u);
  assert.match(html, /g-input-affix-control/u);
  assert.match(html, /g-input-affix-start/u);
  assert.match(html, /g-input-affix-action/u);
  assert.match(html, /g-input-affix-feedback/u);
  assert.match(html, /g-input-affix-status/u);
});

test("search-field composes a native search form, clear action, loading, and result feedback in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GSearchField, {
    as: "form", variant: ["icon", "button", "clearable", "responsive", "outlined", "large", "block"], state: ["searching", "results"], role: "search", "aria-labelledby": "search-label", "aria-describedby": "search-status", "aria-busy": true,
  }, createElement("label", { id: "search-label", className: "g-search-field-label", htmlFor: "site-search" }, "Search docs"), createElement("div", { className: "g-search-field-control" }, createElement("div", { className: "g-search-field-input-wrap" }, createElement("span", { className: "g-search-field-icon", "aria-hidden": true }, "⌕"), createElement("input", { id: "site-search", className: "g-input g-search-field-input", type: "search" }), createElement("button", { className: "g-search-field-clear", type: "button", "aria-label": "Clear" }, "×"), createElement("span", { className: "g-search-field-spinner", "aria-hidden": true })), createElement("button", { className: "g-search-field-action", type: "submit" }, "Search")), createElement("small", { id: "search-status", className: "g-search-field-status", role: "status" }, createElement("span", { className: "g-search-field-result-count" }, "12"), " results")));
  assert.match(html, /^<form/u);
  assert.match(html, /class="g-search-field g-search-field-icon g-search-field-button g-search-field-clearable g-search-field-responsive g-search-field-outlined g-search-field-large g-search-field-block is-searching is-results"/u);
  assert.match(html, /role="search"/u);
  assert.match(html, /g-search-field-input-wrap/u);
  assert.match(html, /g-search-field-clear/u);
  assert.match(html, /g-search-field-spinner/u);
  assert.match(html, /g-search-field-result-count/u);
});

test("character-counter composes live limits, remaining mode, and structured feedback in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GCharacterCounter, {
    variant: ["textarea", "remaining", "soft-limit", "large", "block"], state: ["near-limit", "typing"], "data-g-character-count": "120", "data-g-character-warning": ".8", "data-g-character-mode": "remaining", "aria-describedby": "bio-count bio-help",
  }, createElement("label", { className: "g-character-field-label", htmlFor: "bio" }, "Bio"), createElement("div", { className: "g-character-field-control" }, createElement("textarea", { id: "bio", className: "g-textarea g-character-field-input" }), createElement("output", { id: "bio-count", className: "g-character-count", "aria-live": "polite", "aria-atomic": true }, createElement("span", { className: "g-character-count-current" }, "24"), createElement("span", { className: "g-character-count-separator" }, "/"), createElement("span", { className: "g-character-count-maximum" }, "120"))), createElement("small", { id: "bio-help", className: "g-character-field-help" }, "Keep it concise"), createElement("small", { className: "g-character-field-status", role: "status" }, "96 remaining")));
  assert.match(html, /class="g-character-field g-character-field-textarea g-character-field-remaining g-character-field-soft-limit g-character-field-large g-character-field-block is-near-limit is-typing"/u);
  assert.match(html, /data-g-character-count="120"/u);
  assert.match(html, /g-character-count-current/u);
  assert.match(html, /aria-live="polite"/u);
  assert.match(html, /g-character-field-status/u);
});

test("validation-state composes semantic feedback, async status, and native field attributes in SSR", () => {
  const html = renderToStaticMarkup(createElement(components.GValidationState, {
    variant: ["inline", "with-icon", "reserve-message", "large"],
    state: ["invalid", "validating"],
    "aria-busy": true,
  },
  createElement("label", { className: "g-validation-label", htmlFor: "email" }, "Email", createElement("span", { className: "g-validation-required", "aria-hidden": true }, "*")),
  createElement("div", { className: "g-validation-control" },
    createElement("input", { id: "email", className: "g-input g-validation-input", "aria-invalid": true, "aria-describedby": "email-error" }),
    createElement("span", { className: "g-validation-icon", "aria-hidden": true })),
  createElement("small", { id: "email-error", className: "g-validation-message", role: "alert", "aria-live": "polite" }, "Enter a valid email")));
  assert.match(html, /class="g-validation-state g-validation-state-inline g-validation-state-with-icon g-validation-state-reserve-message g-validation-state-large is-invalid is-validating"/u);
  assert.match(html, /aria-busy="true"/u);
  assert.match(html, /aria-invalid="true"/u);
  assert.match(html, /role="alert"/u);
  assert.match(html, /g-validation-icon/u);
});

test("form-section composes semantic task sections and native disclosure in SSR", () => {
  const section = renderToStaticMarkup(createElement(components.GFormSection, {
    as: "section",
    variant: ["numbered", "card", "spacious"],
    state: "error",
    "aria-labelledby": "security-title",
    "aria-invalid": true,
  }, createElement("header", { className: "g-form-section-header" },
    createElement("span", { className: "g-form-section-number" }, "3"),
    createElement("div", { className: "g-form-section-heading" }, createElement("h3", { id: "security-title", className: "g-form-section-title" }, "Security"))),
  createElement("div", { className: "g-form-section-summary", role: "alert" }, "Recovery method required")));
  assert.match(section, /^<section/u);
  assert.match(section, /class="g-form-section g-form-section-numbered g-form-section-card g-form-section-spacious is-error"/u);
  assert.match(section, /aria-invalid="true"/u);
  assert.match(section, /role="alert"/u);
  const disclosure = renderToStaticMarkup(createElement(components.GFormSection, { as: "details", variant: ["bordered", "collapsible"], open: true }, createElement("summary", { className: "g-form-section-header" }, "Advanced"), createElement("div", { className: "g-form-section-body" }, "Fields")));
  assert.match(disclosure, /^<details/u);
  assert.match(disclosure, /open=""/u);
  assert.match(disclosure, /<summary/u);
});
