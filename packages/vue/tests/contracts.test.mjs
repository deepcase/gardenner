import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const catalog = await import("../dist/generated/catalog.js");
const components = await import("../dist/generated/components.js");
const api = JSON.parse(await readFile(new URL("../metadata/public-api.json", import.meta.url), "utf8"));
const css = JSON.parse(await readFile(new URL("../../css/metadata/components.json", import.meta.url), "utf8"));

test("all 575 Gardenerim CSS components have unique Vue exports", () => {
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

test("the stable API contains every component export", () => {
  assert.equal(api.status, "stable");
  assert.deepEqual(api.componentExports, catalog.componentCatalog.map(({ exportName }) => exportName));
});

test("the stable API records every root runtime and TypeScript contract", async () => {
  const module = await import("../dist/index.js");
  assert.deepEqual(api.moduleExports, Object.keys(module).sort());
  assert.equal(api.moduleExports.length, 615);
  assert.equal(api.typeExports.length, 31);
  for(const type of ['GardenerimNavigationItem','GardenerimNavigationOptions','GardenerimNavigationChange','GardenerimNavigationInstance'])assert.ok(api.typeExports.includes(type));
  assert.deepEqual(api.componentProps, ["as", "variant", "state", "config", "initialize", "modelValue", "modelEvent", "modelKey", "navigation", "items", "table", "columns", "data"]);
  assert.equal(api.themeAxes.length, 10);
});

test("behavior-only selectors retain their required visual root classes", () => {
  const expected = {
    combobox: "g-combobox", tabs: "g-tabs", dialog: "g-dialog-backdrop", drawer: "g-drawer-backdrop",
    popover: "g-popover", toast: "g-toast", accordion: "g-accordion", "data-grid": "g-data-grid",
    tree: "g-tree", carousel: "g-carousel", "split-pane": "g-split-pane",
  };
  for (const [name, className] of Object.entries(expected)) assert.equal(catalog.componentByName.get(name).className, className);
  assert.equal(catalog.componentByName.get("copy-action").className, "g-copy-action");
  assert.equal(catalog.componentByName.get("fullscreen-action").className, "g-fullscreen-action");
});

test("badge, tag, and chip expose distinct semantic contracts", () => {
  const badge = catalog.componentByName.get("badge");
  const tag = catalog.componentByName.get("tag");
  const chip = catalog.componentByName.get("chip");
  assert.deepEqual([badge.tag, tag.tag, chip.tag], ["span", "span", "span"]);
  assert.ok(["attached", "dot", "status", "ribbon"].every((item) => badge.variants.includes(item)));
  assert.ok(["g-tag-icon", "g-tag-label", "g-tag-close"].every((item) => tag.parts.includes(item)));
  assert.ok(["clickable", "selectable", "removable", "multiline"].every((item) => chip.variants.includes(item)));
});

test("avatar and avatar-group expose complete independent contracts", () => {
  const avatar = catalog.componentByName.get("avatar");
  const group = catalog.componentByName.get("avatar-group");
  assert.equal(avatar.exportName, "GAvatar");
  assert.equal(group.exportName, "GAvatarGroup");
  assert.ok(["xs", "2xl", "rounded", "fit-contain", "status", "loading"].every((item) => avatar.variants.includes(item)));
  assert.ok(["online", "away", "busy", "offline", "disabled"].every((item) => avatar.states.includes(item)));
  assert.ok(["overlap", "spaced", "compact", "square"].every((item) => group.variants.includes(item)));
  assert.ok(group.parts.includes("g-avatar-overflow"));
});

test("divider exposes complete orientation, title, line, spacing, and accessibility contracts", () => {
  const divider = catalog.componentByName.get("divider-with-text");
  assert.equal(divider.exportName, "GDividerWithText");
  assert.ok(["horizontal", "vertical", "start", "center", "end", "solid", "dashed", "dotted", "double", "plain", "heading", "small", "medium", "large", "inset", "strong", "stretch"].every((item) => divider.variants.includes(item)));
  assert.ok(divider.parts.includes("g-divider-text"));
  const source = css.components.find((item) => item.name === "divider-with-text");
  assert.ok(source.accessibility.roles.includes("separator"));
  assert.ok(source.accessibility.attributes.includes("aria-orientation"));
});

test("alert exposes complete content, appearance, status, and live-region contracts", () => {
  const alert = catalog.componentByName.get("alert");
  assert.ok(["soft", "outlined", "filled", "banner", "center", "compact", "spacious", "borderless", "accent", "with-title", "closable", "no-icon", "stacked"].every((item) => alert.variants.includes(item)));
  assert.ok(["normal", "info", "success", "warning", "danger", "error", "loading"].every((item) => alert.states.includes(item)));
  assert.ok(["g-alert-icon", "g-alert-body", "g-alert-title", "g-alert-content", "g-alert-actions", "g-alert-close"].every((item) => alert.parts.includes(item)));
  const source = css.components.find((item) => item.name === "alert");
  assert.ok(["alert", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-live", "aria-atomic", "aria-busy"].every((item) => source.accessibility.attributes.includes(item)));
});

test("checkbox and radio expose native controls, mixed state, rich content, and group layouts", () => {
  const choice = catalog.componentByName.get("checkbox-radio");
  const checkboxGroup = catalog.componentByName.get("checkbox-group");
  const radioGroup = catalog.componentByName.get("radio-group");
  assert.equal(choice.className, "g-check");
  assert.ok(["checkbox", "radio", "mini", "small", "medium", "large", "block", "bordered", "card", "reverse", "with-description"].every((item) => choice.variants.includes(item)));
  assert.ok(["checked", "indeterminate", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => choice.states.includes(item)));
  assert.ok(["g-choice-content", "g-choice-label", "g-choice-description", "g-choice-extra"].every((item) => choice.parts.includes(item)));
  assert.ok([checkboxGroup, radioGroup].every((group) => ["inline", "grid", "two", "three", "four", "buttons", "cards"].every((item) => group.variants.includes(item))));
  assert.equal(checkboxGroup.tag, "fieldset");
  assert.deepEqual(checkboxGroup.behaviors, ["row-select"]);
  assert.ok(["default", "stacked", "inline", "grid", "two", "three", "four", "buttons", "cards", "compact", "block", "small", "medium", "large"].every((item) => checkboxGroup.variants.includes(item)));
  assert.ok(["default", "normal", "empty", "partial", "selected", "max", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => checkboxGroup.states.includes(item)));
  assert.ok(["g-choice-group-legend", "g-choice-group-label", "g-choice-group-title", "g-choice-group-description", "g-choice-group-options", "g-choice-group-option", "g-choice-group-option-content", "g-choice-group-select-all", "g-choice-group-count", "g-choice-group-help", "g-choice-group-feedback", "g-choice-group-status"].every((item) => checkboxGroup.parts.includes(item)));
  const source = css.components.find((item) => item.name === "checkbox-radio");
  assert.ok(["checkbox", "radio"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-checked", "aria-invalid", "aria-describedby"].every((item) => source.accessibility.attributes.includes(item)));
  const checkboxGroupSource = css.components.find((item) => item.name === "checkbox-group");
  assert.ok(["native-checkbox-grouping", "select-all-and-indeterminate", "selection-count", "disabled-option-exclusion", "selection-change-event", "responsive-grid", "button-and-card-options", "fieldset-legend-semantics", "validation-feedback"].every((item) => checkboxGroupSource.features.includes(item)));
  assert.ok(["group", "status", "alert"].every((item) => checkboxGroupSource.accessibility.roles.includes(item)));
  assert.equal(radioGroup.tag, "fieldset");
  assert.ok(["default", "stacked", "inline", "grid", "two", "three", "four", "buttons", "cards", "compact", "block", "small", "medium", "large"].every((item) => radioGroup.variants.includes(item)));
  assert.ok(["default", "normal", "empty", "selected", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => radioGroup.states.includes(item)));
  assert.ok(["g-choice-group-legend", "g-choice-group-options", "g-choice-group-option", "g-choice-group-option-content", "g-choice-group-help", "g-choice-group-feedback", "g-choice-group-status"].every((item) => radioGroup.parts.includes(item)));
  const radioGroupSource = css.components.find((item) => item.name === "radio-group");
  assert.ok(["native-exclusive-selection", "shared-name-grouping", "required-selection", "native-change-event", "responsive-grid", "button-and-card-options", "keyboard-navigation", "fieldset-legend-semantics", "validation-feedback"].every((item) => radioGroupSource.features.includes(item)));
  assert.ok(["group", "radiogroup", "status", "alert"].every((item) => radioGroupSource.accessibility.roles.includes(item)));
});

test("switch exposes immediate boolean, content, loading, sizing, and settings-row contracts", () => {
  const toggle = catalog.componentByName.get("switch");
  const row = catalog.componentByName.get("switch-row");
  assert.ok(["mini", "small", "medium", "large", "wide", "inline-prompt", "square", "with-label", "block", "reverse", "bordered", "card"].every((item) => toggle.variants.includes(item)));
  assert.ok(["unchecked", "checked", "hover", "focus", "active", "disabled", "loading", "success", "warning", "danger", "error", "invalid", "read-only"].every((item) => toggle.states.includes(item)));
  assert.ok(["g-switch-track", "g-switch-handle", "g-switch-checked-content", "g-switch-unchecked-content", "g-switch-content", "g-switch-label", "g-switch-description", "g-switch-extra"].every((item) => toggle.parts.includes(item)));
  assert.ok(["plain", "compact", "spacious", "reverse", "bordered", "card"].every((item) => row.variants.includes(item)));
  assert.equal(row.tag, "label");
  assert.ok(["default", "plain", "compact", "spacious", "reverse", "bordered", "card", "block"].every((item) => row.variants.includes(item)));
  assert.ok(["default", "normal", "unchecked", "checked", "success", "warning", "disabled", "loading", "read-only", "error", "invalid"].every((item) => row.states.includes(item)));
  assert.ok(["g-switch-row-content", "g-switch-row-title", "g-switch-row-description", "g-switch-row-meta", "g-switch-row-control", "g-switch-row-extra", "g-switch-row-status"].every((item) => row.parts.includes(item)));
  const source = css.components.find((item) => item.name === "switch");
  assert.ok(["switch", "checkbox"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-checked", "aria-busy", "aria-invalid", "aria-describedby"].every((item) => source.accessibility.attributes.includes(item)));
});

test("choice-card-group exposes semantic single and multiple rich-card selection", () => {
  const group = catalog.componentByName.get("choice-card-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "grid", "two", "three", "four", "single", "multiple", "compact", "spacious", "horizontal", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "empty", "selected", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-choice-group-legend", "g-choice-group-description", "g-choice-group-options", "g-choice-card", "g-choice-card-input", "g-choice-card-header", "g-choice-card-icon", "g-choice-card-title", "g-choice-card-description", "g-choice-card-meta", "g-choice-card-badge", "g-choice-card-price", "g-choice-card-footer", "g-choice-card-check", "g-choice-group-help", "g-choice-group-feedback", "g-choice-group-status"].every((item) => group.parts.includes(item)));
  const source = css.components.find((item) => item.name === "choice-card-group");
  assert.ok(["native-radio-and-checkbox-inputs", "single-and-multiple-selection", "whole-card-label-target", "responsive-card-grid", "selected-card-surface", "rich-card-content", "disabled-card-state", "validation-feedback", "fieldset-legend-semantics"].every((item) => source.features.includes(item)));
  assert.ok(["group", "radiogroup", "status", "alert"].every((item) => source.accessibility.roles.includes(item)));
});

test("name-group exposes international semantic name collection", () => {
  const group = catalog.componentByName.get("name-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "western", "eastern", "full", "compact", "spacious", "two", "three", "four", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-name-group-legend", "g-name-group-description", "g-name-field", "g-name-prefix", "g-name-given", "g-name-middle", "g-name-family", "g-name-suffix", "g-name-phonetic", "g-name-preferred", "g-name-display", "g-name-group-help", "g-name-group-feedback", "g-name-group-status"].every((item) => group.parts.includes(item)));
});

test("address-group exposes international semantic address collection", () => {
  const group = catalog.componentByName.get("address-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "domestic", "international", "stacked", "card", "compact", "spacious", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-address-group-legend", "g-address-group-description", "g-address-field", "g-address-recipient", "g-address-organization", "g-address-line-1", "g-address-line-2", "g-address-country", "g-address-city", "g-address-region", "g-address-district", "g-address-dependent-locality", "g-address-postal", "g-address-sorting-code", "g-address-group-help", "g-address-group-feedback", "g-address-group-status"].every((item) => group.parts.includes(item)));
  const source = css.components.find((item) => item.name === "address-group");
  assert.ok(["international-address-order", "multi-line-street-address", "country-and-administrative-area-fields", "native-address-autocomplete", "responsive-field-layout", "validation-feedback", "fieldset-legend-semantics"].every((item) => source.features.includes(item)));
  assert.ok(["group", "status", "alert"].every((item) => source.accessibility.roles.includes(item)));
});

test("phone-group exposes international semantic telephone collection", () => {
  const group = catalog.componentByName.get("phone-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "domestic", "international", "stacked", "card", "compact", "spacious", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-phone-group-legend", "g-phone-group-description", "g-phone-field", "g-phone-country", "g-phone-country-code", "g-phone-national", "g-phone-extension", "g-phone-type", "g-phone-group-help", "g-phone-group-feedback", "g-phone-group-status", "g-phone-preview"].every((item) => group.parts.includes(item)));
  const source = css.components.find((item) => item.name === "phone-group");
  assert.ok(["country-calling-code", "national-number-and-extension", "e164-preview", "native-telephone-autocomplete", "telephone-input-mode", "responsive-field-layout", "validation-feedback", "fieldset-legend-semantics"].every((item) => source.features.includes(item)));
  assert.ok(["group", "status", "alert"].every((item) => source.accessibility.roles.includes(item)));
});

test("money-group exposes localized semantic monetary collection", () => {
  const group = catalog.componentByName.get("money-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "domestic", "international", "accounting", "stacked", "card", "compact", "spacious", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-money-group-legend", "g-money-group-description", "g-money-field", "g-money-currency", "g-money-amount", "g-money-control", "g-money-symbol", "g-money-minor-unit", "g-money-tax", "g-money-exchange-rate", "g-money-converted", "g-money-group-help", "g-money-group-feedback", "g-money-group-status"].every((item) => group.parts.includes(item)));
  const source = css.components.find((item) => item.name === "money-group");
  assert.ok(["currency-and-amount-fields", "currency-symbol-affix", "decimal-input-mode", "transaction-autocomplete", "localized-money-preview", "responsive-field-layout", "validation-feedback", "fieldset-legend-semantics"].every((item) => source.features.includes(item)));
  assert.ok(["group", "status", "alert"].every((item) => source.accessibility.roles.includes(item)));
});

test("date-range-group exposes constrained semantic date ranges", () => {
  const group = catalog.componentByName.get("date-range-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "date", "datetime", "inclusive", "exclusive", "stacked", "card", "compact", "spacious", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "partial", "complete", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-date-range-legend", "g-date-range-description", "g-date-range-field", "g-date-range-start", "g-date-range-end", "g-range-separator", "g-date-range-presets", "g-date-range-preset", "g-date-range-duration", "g-date-range-help", "g-date-range-feedback", "g-date-range-status"].every((item) => group.parts.includes(item)));
  const source = css.components.find((item) => item.name === "date-range-group");
  assert.ok(["native-date-and-datetime-inputs", "minimum-and-maximum-constraints", "chronological-range-validation", "range-presets", "duration-summary", "responsive-field-layout", "validation-feedback", "fieldset-legend-semantics"].every((item) => source.features.includes(item)));
});

test("range-color exposes native sliders, dual ranges, values, marks, colors, and presets", () => {
  const control = catalog.componentByName.get("range-color");
  assert.ok(["range", "color", "horizontal", "vertical", "reverse", "mini", "small", "medium", "large", "show-stops", "with-value", "with-input", "dual", "block", "circle", "with-label", "presets"].every((item) => control.variants.includes(item)));
  assert.ok(["active", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => control.states.includes(item)));
  assert.ok(["g-range-field", "g-range-value", "g-range-marks", "g-range-dual", "g-range-dual-fill", "g-color-field", "g-color-input", "g-color-value", "g-color-presets", "g-color-preset"].every((item) => control.parts.includes(item)));
  const source = css.components.find((item) => item.name === "range-color");
  assert.ok(["slider", "group"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["min", "max", "step", "aria-valuetext", "aria-orientation", "aria-invalid"].every((item) => source.accessibility.attributes.includes(item)));
});

test("file-drop exposes a complete picker, validation, queue, and accessibility contract", () => {
  const upload = catalog.componentByName.get("file-drop");
  assert.ok(["dragger", "button", "compact", "spacious", "block", "picture-card", "avatar", "multiple", "directory", "manual", "with-list", "picture-list"].every((item) => upload.variants.includes(item)));
  assert.ok(["default", "hover", "focus", "dragging", "validating", "uploading", "success", "error", "rejected", "disabled"].every((item) => upload.states.includes(item)));
  assert.ok(["g-file-drop-input", "g-file-drop-content", "g-file-drop-icon", "g-file-drop-title", "g-file-drop-description", "g-file-drop-rules", "g-file-drop-browse", "g-file-drop-feedback", "g-file-drop-list", "g-file-drop-item", "g-file-drop-progress-bar", "g-file-drop-remove", "g-file-drop-retry"].every((item) => upload.parts.includes(item)));
  const source = css.components.find((item) => item.name === "file-drop");
  assert.deepEqual(source.behaviors, ["dropzone"]);
  assert.ok(["button", "group", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["accept", "multiple", "capture", "webkitdirectory", "aria-invalid", "data-g-max-size", "data-g-max-files", "data-g-paste"].every((item) => source.accessibility.attributes.includes(item)));
});

test("upload-queue exposes a complete progress lifecycle, action, API, and accessibility contract", () => {
  const upload = catalog.componentByName.get("upload-queue");
  assert.equal(upload.type, "interactive");
  assert.deepEqual(upload.behaviors, ["upload-manager"]);
  assert.ok(["default", "compact", "spacious", "bordered", "flat"].every((item) => upload.variants.includes(item)));
  assert.ok(["empty", "queued", "uploading", "paused", "success", "error", "mixed", "disabled"].every((item) => upload.states.includes(item)));
  assert.ok(["g-upload-queue-header", "g-upload-queue-title", "g-upload-summary", "g-upload-input", "g-upload-list", "g-upload-empty", "g-upload-item", "g-file-name", "g-upload-status", "g-upload-progress", "g-upload-progress-bar", "g-upload-actions"].every((item) => upload.parts.includes(item)));
  const source = css.components.find((item) => item.name === "upload-queue");
  assert.ok(["determinate-progress", "pause-resume-retry-remove-clear-actions", "programmatic-item-updates", "focus-recovery-after-removal"].every((item) => source.features.includes(item)));
  assert.ok(["region", "list", "listitem", "progressbar", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-busy", "aria-live", "aria-valuenow", "aria-valuetext"].every((item) => source.accessibility.attributes.includes(item)));
});

test("form-builder exposes a complete authoring, schema, responsive, and accessibility contract", () => {
  const builder = catalog.componentByName.get("form-builder");
  assert.equal(builder.type, "interactive");
  assert.deepEqual(builder.behaviors, ["builder-list"]);
  assert.ok(["default", "compact", "spacious", "bordered", "flat", "preview"].every((item) => builder.variants.includes(item)));
  assert.ok(["empty", "editing", "dirty", "valid", "invalid", "disabled", "read-only"].every((item) => builder.states.includes(item)));
  assert.ok(["g-form-builder-header", "g-form-builder-palette", "g-form-builder-palette-item", "g-form-builder-canvas", "g-form-builder-fields", "g-form-builder-field", "g-form-builder-field-actions", "g-form-builder-inspector", "g-form-builder-inspector-body", "g-form-builder-output"].every((item) => builder.parts.includes(item)));
  const source = css.components.find((item) => item.name === "form-builder");
  assert.ok(["palette-field-creation", "property-inspector-synchronization", "move-duplicate-remove-actions", "schema-serialization-and-loading", "focus-recovery-after-removal", "responsive-three-panel-layout"].every((item) => source.features.includes(item)));
  assert.ok(["region", "toolbar", "list", "listitem", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-selected", "aria-disabled", "aria-live"].every((item) => source.accessibility.attributes.includes(item)));
});

test("navbar exposes complete brand, navigation, action, mobile and accessibility contracts", () => {
  const navbar = catalog.componentByName.get("navbar");
  assert.ok(["default", "bordered", "transparent", "floating", "dark", "compact", "spacious", "centered", "sticky"].every((item) => navbar.variants.includes(item)));
  assert.ok(["normal", "open", "scrolled", "disabled"].every((item) => navbar.states.includes(item)));
  assert.ok(["g-navbar-inner", "g-navbar-start", "g-navbar-center", "g-navbar-end", "g-navbar-brand", "g-navbar-brand-mark", "g-navbar-nav", "g-navbar-item", "g-nav-link", "g-navbar-actions", "g-navbar-toggle", "g-navbar-mobile-panel", "g-navbar-mobile-body", "g-navbar-mobile-footer"].every((item) => navbar.parts.includes(item)));
  const source = css.components.find((item) => item.name === "navbar");
  assert.ok(["brand-primary-navigation-and-actions", "current-page-and-disabled-link-states", "nav-toggle-powered-mobile-panel", "outside-and-escape-dismissal", "focus-recovery-after-mobile-close", "responsive-action-prioritization", "safe-area-aware-mobile-panel"].every((item) => source.features.includes(item)));
  assert.deepEqual(source.accessibility.roles, ["navigation"]);
  assert.ok(["aria-current", "aria-controls", "aria-expanded", "aria-hidden"].every((item) => source.accessibility.attributes.includes(item)));
});

test("sidebar exposes complete navigation hierarchy, rail, drawer and accessibility contracts", () => {
  const sidebar = catalog.componentByName.get("sidebar");
  assert.ok(["default", "bordered", "elevated", "floating", "compact", "spacious", "collapsed", "drawer", "sticky", "dark"].every((item) => sidebar.variants.includes(item)));
  assert.ok(["normal", "open", "collapsed", "disabled"].every((item) => sidebar.states.includes(item)));
  assert.ok(["g-sidebar-surface", "g-sidebar-header", "g-sidebar-brand", "g-sidebar-toggle", "g-sidebar-search", "g-sidebar-body", "g-sidebar-nav", "g-sidebar-group", "g-sidebar-list", "g-sidebar-item", "g-sidebar-link", "g-sidebar-icon", "g-sidebar-label", "g-sidebar-badge", "g-sidebar-subnav", "g-sidebar-footer", "g-sidebar-account"].every((item) => sidebar.parts.includes(item)));
  const source = css.components.find((item) => item.name === "sidebar");
  assert.ok(["grouped-and-nested-navigation", "current-and-disabled-links", "compact-and-collapsed-rails", "mobile-drawer-disclosure", "outside-and-escape-dismissal", "focus-entry-and-restoration", "safe-area-aware-drawer"].every((item) => source.features.includes(item)));
  assert.ok(["complementary", "navigation"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["ArrowUp", "ArrowDown", "Home", "End", "Escape"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-current", "aria-controls", "aria-expanded", "aria-hidden"].every((item) => source.accessibility.attributes.includes(item)));
});

test("breadcrumb exposes semantic hierarchy, overflow, responsive and accessibility contracts", () => {
  const breadcrumb = catalog.componentByName.get("breadcrumb");
  assert.ok(["default", "compact", "spacious", "contained", "subtle", "inverse", "wrap", "scroll", "collapsed", "chevron", "dot"].every((item) => breadcrumb.variants.includes(item)));
  assert.ok(["normal", "current", "overflow", "disabled"].every((item) => breadcrumb.states.includes(item)));
  assert.ok(["g-breadcrumb-list", "g-breadcrumb-item", "g-breadcrumb-link", "g-breadcrumb-home", "g-breadcrumb-icon", "g-breadcrumb-label", "g-breadcrumb-separator", "g-breadcrumb-overflow", "g-breadcrumb-ellipsis", "g-breadcrumb-menu", "g-breadcrumb-current"].every((item) => breadcrumb.parts.includes(item)));
  const source = css.components.find((item) => item.name === "breadcrumb");
  assert.ok(["semantic-ordered-page-hierarchy", "current-page-and-disabled-states", "native-overflow-disclosure", "wrapping-scrolling-and-collapsed-overflow", "long-title-truncation", "logical-properties-and-rtl", "print-friendly"].every((item) => source.features.includes(item)));
  assert.ok(["navigation", "list"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "Enter", "Space"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-current", "aria-disabled"].every((item) => source.accessibility.attributes.includes(item)));
});

test("tabs exposes complete structure, layouts, interaction modes and accessibility contracts", () => {
  const tabs = catalog.componentByName.get("tabs");
  assert.ok(["line", "card", "pill", "contained", "compact", "spacious", "block", "centered", "vertical", "scrollable"].every((item) => tabs.variants.includes(item)));
  assert.ok(["normal", "active", "disabled", "loading", "empty"].every((item) => tabs.states.includes(item)));
  assert.ok(["g-tabs-header", "g-tab-list", "g-tab-item", "g-tab", "g-tab-icon", "g-tab-label", "g-tab-badge", "g-tab-close", "g-tabs-actions", "g-tab-panels", "g-tab-panel", "g-tab-panel-header", "g-tab-panel-body", "g-tab-empty"].every((item) => tabs.parts.includes(item)));
  const source = css.components.find((item) => item.name === "tabs");
  assert.deepEqual(source.behaviors, ["tabs"]);
  assert.ok(["automatic-and-manual-activation", "horizontal-and-vertical-orientation", "rtl-aware-arrow-navigation", "disabled-tab-skipping", "controlled-panel-visibility", "nested-instance-isolation", "icon-badge-and-close-affordances", "scrollable-mobile-tab-list", "focus-visible-feedback", "forced-colors", "print-friendly"].every((item) => source.features.includes(item)));
  assert.ok(["tablist", "tab", "tabpanel"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", "Space"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-orientation", "aria-selected", "aria-controls", "aria-disabled", "aria-busy", "tabindex", "hidden", "data-g-activation"].every((item) => source.accessibility.attributes.includes(item)));
});

test("segmented control exposes rich options, layouts, shared selection behavior and accessibility contracts", () => {
  const segmented = catalog.componentByName.get("segmented-control");
  assert.equal(segmented.type, "interactive");
  assert.ok(["default", "outlined", "solid", "small", "medium", "large", "compact", "spacious", "block", "responsive", "equal", "vertical", "icon-only"].every((item) => segmented.variants.includes(item)));
  assert.ok(["normal", "selected", "disabled", "loading"].every((item) => segmented.states.includes(item)));
  assert.ok(["g-segmented-item", "g-segmented-icon", "g-segmented-content", "g-segmented-label", "g-segmented-description", "g-segmented-badge", "g-segmented-input"].every((item) => segmented.parts.includes(item)));
  const source = css.components.find((item) => item.name === "segmented-control");
  assert.deepEqual(source.behaviors, ["data-view"]);
  assert.ok(["single-selection", "pointer-and-keyboard-selection", "horizontal-and-vertical-orientation", "rtl-aware-arrow-navigation", "disabled-item-skipping", "controlled-panel-visibility", "hidden-input-form-value", "nested-instance-isolation", "responsive-full-width-layout", "focus-visible-feedback", "forced-colors", "reduced-motion"].every((item) => source.features.includes(item)));
  assert.ok(["radiogroup", "radio"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Space"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-orientation", "aria-checked", "aria-disabled", "aria-busy", "tabindex", "data-g-view", "data-g-current-view"].every((item) => source.accessibility.attributes.includes(item)));
});

test("pagination exposes complete native navigation, density, layout and accessibility contracts", () => {
  const pagination = catalog.componentByName.get("pagination");
  assert.equal(pagination.tag, "nav");
  assert.equal(pagination.type, "css");
  assert.ok(["default", "compact", "spacious", "mini", "simple", "bordered", "borderless", "rounded", "circle", "block", "centered", "end", "responsive"].every((item) => pagination.variants.includes(item)));
  assert.ok(["normal", "current", "disabled", "loading"].every((item) => pagination.states.includes(item)));
  assert.ok(["g-pagination-total", "g-pagination-list", "g-pagination-item", "g-page-link", "g-page-previous", "g-page-next", "g-page-number", "g-page-ellipsis", "g-page-icon", "g-page-label", "g-pagination-size-label", "g-pagination-size", "g-pagination-jumper", "g-pagination-jumper-label", "g-page-jumper", "g-pagination-submit", "g-pagination-status"].every((item) => pagination.parts.includes(item)));
  const source = css.components.find((item) => item.name === "pagination");
  assert.ok(["semantic-pagination-navigation", "previous-next-and-numbered-links", "current-disabled-and-loading-states", "ellipsis-for-truncated-ranges", "total-count-and-page-size-control", "native-page-jump-form", "simple-and-responsive-pagination", "link-and-button-support", "logical-properties-and-rtl", "focus-visible-feedback", "forced-colors", "print-friendly"].every((item) => source.features.includes(item)));
  assert.ok(["navigation", "list", "listitem", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "Enter", "Space"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-current", "aria-disabled", "aria-busy", "aria-live"].every((item) => source.accessibility.attributes.includes(item)));
});

test("menu dropdown exposes complete menu-button structure, interaction and accessibility contracts", () => {
  const dropdown = catalog.componentByName.get("menu-dropdown");
  assert.equal(dropdown.type, "interactive"); assert.deepEqual(dropdown.behaviors, ["dropdown"]);
  assert.ok(["default", "compact", "spacious", "bordered", "borderless", "shadowless", "start", "end", "top", "block", "scrollable"].every((item) => dropdown.variants.includes(item)));
  assert.ok(["closed", "open", "selected", "checked", "disabled", "loading", "empty"].every((item) => dropdown.states.includes(item)));
  assert.ok(["g-dropdown-trigger", "g-dropdown-trigger-label", "g-dropdown-trigger-icon", "g-dropdown-menu", "g-dropdown-header", "g-dropdown-title", "g-dropdown-description", "g-menu", "g-menu-group", "g-menu-label", "g-menu-item", "g-menu-item-icon", "g-menu-item-content", "g-menu-item-label", "g-menu-item-description", "g-menu-item-check", "g-menu-badge", "g-menu-shortcut", "g-menu-divider", "g-menu-submenu", "g-submenu-menu", "g-dropdown-empty", "g-dropdown-footer"].every((item) => dropdown.parts.includes(item)));
  const source = css.components.find((item) => item.name === "menu-dropdown");
  assert.ok(["menu-button-trigger-and-popup", "pointer-and-keyboard-opening", "roving-focus-and-disabled-item-skipping", "home-end-and-typeahead-navigation", "escape-tab-and-outside-dismissal", "focus-restoration", "checkbox-and-radio-menu-items", "nested-instance-isolation", "start-end-top-and-viewport-aware-placement", "danger-loading-empty-and-disabled-states", "logical-properties-and-rtl", "forced-colors", "reduced-motion"].every((item) => source.features.includes(item)));
  assert.ok(["menu", "menuitem", "menuitemcheckbox", "menuitemradio", "group", "separator"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "Enter", "Space", "Escape", "Tab", "Typeahead"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-haspopup", "aria-controls", "aria-expanded", "aria-labelledby", "aria-checked", "aria-disabled", "aria-busy", "hidden", "tabindex", "data-g-align", "data-g-side", "data-g-value", "data-g-keep-open"].every((item) => source.accessibility.attributes.includes(item)));
});

test("command palette exposes complete search, grouped results, keyboard execution, and dialog contracts", () => {
  const palette = catalog.componentByName.get("command-palette");
  assert.equal(palette.type, "interactive"); assert.deepEqual(palette.behaviors, ["command-palette"]); assert.equal(palette.className, "g-command-palette-overlay");
  assert.ok(["default", "compact", "spacious", "small", "wide", "top", "centered", "responsive"].every((item) => palette.variants.includes(item)));
  assert.ok(["closed", "open", "loading", "empty", "filtered", "disabled"].every((item) => palette.states.includes(item)));
  assert.ok(["g-command-palette", "g-command-header", "g-command-search", "g-command-search-icon", "g-command-input", "g-command-clear", "g-command-results", "g-command-group", "g-command-group-label", "g-command-list", "g-command-item", "g-command-item-icon", "g-command-item-content", "g-command-item-title", "g-command-item-description", "g-command-item-shortcut", "g-command-empty", "g-command-footer", "g-command-hint", "g-command-count"].every((item) => palette.parts.includes(item)));
  const source = css.components.find((item) => item.name === "command-palette");
  assert.ok(["modal-command-search", "grouped-command-results", "case-insensitive-label-and-keyword-filtering", "active-descendant-keyboard-navigation", "disabled-command-skipping", "pointer-and-enter-command-selection", "global-mod-k-shortcut", "clear-query-action", "empty-loading-and-result-count-states", "focus-trap-and-trigger-restoration", "programmatic-open-close-query-select-and-refresh-api", "responsive-mobile-layout", "reduced-motion", "forced-colors"].every((item) => source.features.includes(item)));
  assert.ok(["dialog", "combobox", "listbox", "option", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Control+K", "Meta+K", "Escape", "Tab", "ArrowDown", "ArrowUp", "Home", "End", "Enter"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-modal", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-selected", "aria-disabled", "aria-busy", "aria-live", "data-g-value", "data-g-keywords", "data-g-shortcut"].every((item) => source.accessibility.attributes.includes(item)));
});

test("primary navigation exposes complete semantic structure, appearances, overflow, and accessibility contracts", () => {
  const navigation = catalog.componentByName.get("primary-navigation");
  assert.equal(navigation.type, "css"); assert.equal(navigation.className, "g-primary-nav"); assert.deepEqual(navigation.behaviors, []);
  assert.ok(["default", "horizontal", "vertical", "compact", "spacious", "pill", "underline", "contained", "centered", "end", "block", "scrollable", "responsive"].every((item) => navigation.variants.includes(item)));
  assert.ok(["normal", "current", "disabled", "loading"].every((item) => navigation.states.includes(item)));
  assert.ok(["g-primary-nav-list", "g-primary-nav-item", "g-primary-nav-link", "g-primary-nav-icon", "g-primary-nav-content", "g-primary-nav-label", "g-primary-nav-description", "g-primary-nav-badge", "g-primary-nav-indicator", "g-primary-nav-actions"].every((item) => navigation.parts.includes(item)));
  const source = css.components.find((item) => item.name === "primary-navigation");
  assert.ok(["semantic-primary-navigation-landmark", "native-link-and-button-actions", "current-page-and-current-section-states", "icon-label-description-and-badge-content", "horizontal-and-vertical-layouts", "compact-and-spacious-density", "pill-underline-and-contained-appearances", "center-end-and-block-alignment", "scrollable-and-responsive-overflow", "disabled-and-loading-states", "standalone-mobile-visibility", "logical-properties-and-rtl", "focus-visible-feedback", "forced-colors"].every((item) => source.features.includes(item)));
  assert.ok(["navigation", "list", "listitem"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "Enter", "Space"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-current", "aria-disabled", "aria-busy"].every((item) => source.accessibility.attributes.includes(item)));
});

test("utility navigation exposes complete semantic structure, secondary actions, responsive overflow, and accessibility contracts", () => {
  const navigation = catalog.componentByName.get("utility-navigation");
  assert.equal(navigation.type, "css"); assert.deepEqual(navigation.behaviors, []);
  assert.ok(["default", "horizontal", "vertical", "compact", "spacious", "pill", "divided", "contained", "centered", "end", "scrollable", "responsive"].every((item) => navigation.variants.includes(item)));
  assert.ok(["normal", "current", "disabled", "loading"].every((item) => navigation.states.includes(item)));
  assert.ok(["g-utility-nav-list", "g-utility-nav-item", "g-utility-nav-link", "g-utility-nav-icon", "g-utility-nav-label", "g-utility-nav-description", "g-utility-nav-badge", "g-utility-nav-shortcut", "g-utility-nav-separator", "g-utility-nav-actions"].every((item) => navigation.parts.includes(item)));
  const source = css.components.find((item) => item.name === "utility-navigation");
  assert.ok(["semantic-utility-navigation-landmark", "native-link-and-button-actions", "current-page-and-current-section-states", "icon-label-description-badge-and-shortcut-content", "horizontal-and-vertical-layouts", "compact-and-spacious-density", "pill-divided-and-contained-appearances", "center-and-end-alignment", "scrollable-and-responsive-overflow", "disabled-and-loading-states", "standalone-mobile-visibility", "logical-properties-and-rtl", "focus-visible-feedback", "forced-colors"].every((item) => source.features.includes(item)));
  assert.ok(["navigation", "list", "listitem"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "Enter", "Space"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-current", "aria-disabled", "aria-busy"].every((item) => source.accessibility.attributes.includes(item)));
});

test("sub navigation exposes complete contextual structure, appearances, overflow, and accessibility contracts", () => {
  const navigation = catalog.componentByName.get("sub-navigation");
  assert.equal(navigation.type, "css"); assert.deepEqual(navigation.behaviors, []);
  assert.ok(["default", "horizontal", "vertical", "compact", "spacious", "underline", "pill", "contained", "borderless", "centered", "end", "block", "scrollable", "responsive", "sticky"].every((item) => navigation.variants.includes(item)));
  assert.ok(["normal", "current", "disabled", "loading"].every((item) => navigation.states.includes(item)));
  assert.ok(["g-subnav-list", "g-subnav-item", "g-subnav-link", "g-subnav-icon", "g-subnav-content", "g-subnav-label", "g-subnav-description", "g-subnav-badge", "g-subnav-indicator", "g-subnav-actions"].every((item) => navigation.parts.includes(item)));
  const source = css.components.find((item) => item.name === "sub-navigation");
  assert.ok(["semantic-contextual-navigation-landmark", "native-link-and-button-actions", "current-page-and-current-section-states", "icon-label-description-and-badge-content", "horizontal-and-vertical-layouts", "compact-and-spacious-density", "underline-pill-contained-and-borderless-appearances", "center-end-and-block-alignment", "scrollable-and-responsive-overflow", "optional-sticky-positioning", "disabled-and-loading-states", "logical-properties-and-rtl", "focus-visible-feedback", "forced-colors", "print-hidden"].every((item) => source.features.includes(item)));
  assert.ok(["navigation", "list", "listitem"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "Enter", "Space"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-current", "aria-disabled", "aria-busy"].every((item) => source.accessibility.attributes.includes(item)));
});

test("collapsible navigation exposes a complete integrated disclosure, navigation, and runtime contract", () => {
  const navigation = catalog.componentByName.get("collapsible-navigation");
  assert.equal(navigation.type, "interactive"); assert.deepEqual(navigation.behaviors, ["nav-toggle"]); assert.equal(navigation.selector, "[data-g-nav-toggle].g-collapsible-nav");
  assert.ok(["default", "bordered", "elevated", "compact", "spacious", "flush", "inset", "nested", "responsive"].every((item) => navigation.variants.includes(item)));
  assert.ok(["expanded", "collapsed", "current", "disabled", "loading"].every((item) => navigation.states.includes(item)));
  assert.ok(["g-collapsible-nav-header", "g-collapsible-nav-heading", "g-collapsible-nav-title", "g-collapsible-nav-description", "g-collapsible-nav-trigger", "g-collapsible-nav-trigger-label", "g-collapsible-nav-trigger-icon", "g-collapsible-nav-body", "g-collapsible-nav-group", "g-collapsible-nav-list", "g-collapsible-nav-item", "g-collapsible-nav-link", "g-collapsible-nav-icon", "g-collapsible-nav-label", "g-collapsible-nav-link-description", "g-collapsible-nav-badge", "g-collapsible-nav-footer", "g-collapsible-nav-status"].every((item) => navigation.parts.includes(item)));
  const source = css.components.find((item) => item.name === "collapsible-navigation");
  assert.ok(["integrated-header-trigger-and-controlled-panel", "expanded-and-collapsed-state-synchronization", "nested-semantic-navigation-groups", "current-disabled-and-loading-link-states", "icon-label-description-and-badge-content", "bordered-elevated-flush-inset-and-nested-appearances", "compact-and-spacious-density", "escape-collapse-and-focus-recovery", "optional-first-item-focus-on-expand", "close-on-navigation-hooks", "cancelable-beforeopen-and-beforeclose-events", "programmatic-open-close-toggle-and-is-open-api", "logical-properties-and-rtl", "responsive-layout", "reduced-motion", "forced-colors", "print-hidden"].every((item) => source.features.includes(item)));
  assert.ok(["navigation", "region", "list", "listitem", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "Enter", "Space", "Escape"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-controls", "aria-expanded", "aria-hidden", "aria-current", "aria-disabled", "aria-busy", "aria-label", "aria-labelledby", "hidden", "data-g-nav-toggle", "data-g-collapsible-trigger", "data-g-nav-close", "data-g-focus-first"].every((item) => source.accessibility.attributes.includes(item)));
});

test("navigation rail exposes semantic structure, destination states, layouts, and vertical roving focus", () => {
  const rail = catalog.componentByName.get("navigation-rail");
  assert.equal(rail.type, "interactive"); assert.deepEqual(rail.behaviors, ["roving-nav"]); assert.equal(rail.selector, "[data-g-roving-nav].g-nav-rail"); assert.equal(rail.tag, "nav");
  assert.ok(["default", "compact", "expanded", "bordered", "elevated", "floating", "dark", "responsive"].every((item) => rail.variants.includes(item)));
  assert.ok(["normal", "current", "disabled", "loading"].every((item) => rail.states.includes(item)));
  assert.ok(["g-nav-rail-header", "g-nav-rail-brand", "g-nav-rail-brand-mark", "g-nav-rail-primary-action", "g-nav-rail-list", "g-nav-rail-group", "g-nav-rail-group-label", "g-nav-rail-item", "g-nav-rail-icon", "g-nav-rail-label", "g-nav-rail-description", "g-nav-rail-badge", "g-nav-rail-indicator", "g-nav-rail-divider", "g-nav-rail-spacer", "g-nav-rail-footer", "g-nav-rail-action"].every((item) => rail.parts.includes(item)));
  const source = css.components.find((item) => item.name === "navigation-rail");
  assert.ok(["semantic-vertical-navigation-landmark", "brand-primary-action-and-utility-footer", "grouped-navigation-destinations", "icon-label-description-and-badge-content", "current-page-indicator", "roving-focus-with-disabled-item-skipping", "arrow-home-and-end-keyboard-navigation", "optional-selection-state-and-change-event", "programmatic-select-and-refresh-api", "compact-and-expanded-layouts", "bordered-elevated-floating-and-dark-appearances", "responsive-bottom-bar-layout", "logical-properties-and-rtl", "focus-visible-feedback", "reduced-motion", "forced-colors", "print-hidden"].every((item) => source.features.includes(item)));
  assert.ok(["navigation", "list", "listitem", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "Enter", "Space", "ArrowUp", "ArrowDown", "Home", "End"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-current", "aria-disabled", "aria-busy", "aria-selected", "data-g-roving-nav", "data-g-orientation", "data-g-selection"].every((item) => source.accessibility.attributes.includes(item)));
});

test("activity bar exposes a desktop workbench structure, activity states, and vertical roving focus", () => {
  const bar = catalog.componentByName.get("activity-bar");
  assert.equal(bar.type, "interactive"); assert.deepEqual(bar.behaviors, ["roving-nav"]); assert.equal(bar.selector, "[data-g-roving-nav].g-activitybar"); assert.equal(bar.tag, "nav");
  assert.ok(["default", "compact", "spacious", "bordered", "floating", "dark"].every((item) => bar.variants.includes(item)));
  assert.ok(["normal", "current", "disabled", "loading", "notification"].every((item) => bar.states.includes(item)));
  assert.ok(["g-activitybar-header", "g-activitybar-brand", "g-activitybar-list", "g-activitybar-group", "g-activitybar-item", "g-activitybar-icon", "g-activitybar-label", "g-activitybar-badge", "g-activitybar-indicator", "g-activitybar-spacer", "g-activitybar-divider", "g-activitybar-footer", "g-activitybar-action", "g-activitybar-status"].every((item) => bar.parts.includes(item)));
  const source = css.components.find((item) => item.name === "activity-bar");
  assert.ok(["semantic-desktop-activity-navigation-landmark", "brand-primary-and-utility-action-groups", "icon-first-destination-and-command-layout", "accessible-label-and-notification-badge-content", "current-activity-indicator", "roving-focus-with-disabled-item-skipping", "vertical-arrow-home-and-end-keyboard-navigation", "programmatic-select-and-refresh-api", "compact-and-spacious-density", "bordered-floating-and-dark-appearances", "loading-disabled-and-notification-states", "logical-properties-and-rtl", "focus-visible-feedback", "reduced-motion", "forced-colors", "print-hidden"].every((item) => source.features.includes(item)));
  assert.ok(["navigation", "list", "listitem", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "Enter", "Space", "ArrowUp", "ArrowDown", "Home", "End"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-current", "aria-disabled", "aria-busy", "aria-live", "data-g-roving-nav", "data-g-orientation"].every((item) => source.accessibility.attributes.includes(item)));
});

test("menu bar exposes application commands, popup menus, rich item states, and desktop keyboard behavior", () => {
  const bar = catalog.componentByName.get("menu-bar");
  assert.equal(bar.type, "interactive"); assert.deepEqual(bar.behaviors, ["roving-nav"]); assert.equal(bar.selector, "[data-g-roving-nav].g-menubar"); assert.equal(bar.tag, "nav");
  assert.ok(["default", "compact", "spacious", "bordered", "elevated", "floating", "dark", "integrated"].every((item) => bar.variants.includes(item)));
  assert.ok(["normal", "open", "disabled", "loading"].every((item) => bar.states.includes(item)));
  assert.ok(["g-menubar-start", "g-menubar-brand", "g-menubar-list", "g-menubar-menu", "g-menubar-item", "g-menubar-item-label", "g-menubar-item-caret", "g-menubar-menu-panel", "g-menubar-menu-group", "g-menubar-menu-group-label", "g-menubar-menu-item", "g-menubar-menu-item-icon", "g-menubar-menu-item-label", "g-menubar-menu-item-shortcut", "g-menubar-menu-item-check", "g-menubar-separator", "g-menubar-end", "g-menubar-status"].every((item) => bar.parts.includes(item)));
  const source = css.components.find((item) => item.name === "menu-bar");
  assert.ok(["semantic-application-menubar", "brand-start-and-status-end-regions", "top-level-command-and-popup-menu-items", "grouped-menu-items-icons-checks-and-shortcuts", "checked-disabled-danger-and-loading-states", "nested-dropdown-behavior-composition", "horizontal-roving-focus-with-disabled-item-skipping", "arrow-home-and-end-top-level-navigation", "arrow-down-and-up-menu-opening", "open-menu-switching-with-horizontal-arrows", "escape-tab-outside-and-selection-dismissal", "programmatic-select-and-refresh-api", "compact-and-spacious-density", "bordered-elevated-floating-dark-and-integrated-appearances", "logical-properties-and-rtl", "focus-visible-feedback", "reduced-motion", "forced-colors", "print-hidden"].every((item) => source.features.includes(item)));
  assert.ok(["menubar", "menu", "menuitem", "menuitemcheckbox", "group", "separator", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "Enter", "Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Escape"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-haspopup", "aria-controls", "aria-expanded", "aria-checked", "aria-disabled", "aria-busy", "data-g-roving-nav", "data-g-dropdown", "data-g-dropdown-trigger", "data-g-dropdown-menu"].every((item) => source.accessibility.attributes.includes(item)));
});

test("context menu exposes a distinct target, rich command panel, adaptive positioning, and complete input paths", () => {
  const menu = catalog.componentByName.get("context-menu");
  assert.equal(menu.type, "interactive"); assert.deepEqual(menu.behaviors, ["context-menu"]); assert.equal(menu.selector, "[data-g-context-menu].g-context-menu");
  assert.ok(["default", "compact", "spacious", "bordered", "elevated", "dark"].every((item) => menu.variants.includes(item)));
  assert.ok(["normal", "open", "disabled", "loading"].every((item) => menu.states.includes(item)));
  assert.ok(["g-context-menu-target", "g-context-menu-target-icon", "g-context-menu-target-content", "g-context-menu-target-title", "g-context-menu-target-description", "g-context-menu-target-meta", "g-context-menu-panel", "g-context-menu-group", "g-context-menu-group-label", "g-context-menu-item", "g-context-menu-item-icon", "g-context-menu-item-label", "g-context-menu-item-shortcut", "g-context-menu-item-check", "g-context-menu-separator", "g-context-menu-status"].every((item) => menu.parts.includes(item)));
  const source = css.components.find((item) => item.name === "context-menu");
  assert.ok(["distinct-trigger-surface-and-floating-menu-panel", "pointer-contextmenu-keyboard-menu-key-and-shift-f10-invocation", "touch-long-press-invocation", "viewport-aware-fixed-positioning", "automatic-menu-and-controller-semantics", "arrow-home-end-and-typeahead-navigation", "disabled-item-skipping", "checkbox-and-radio-menu-items", "keep-open-selection", "tab-escape-outside-and-selection-dismissal", "focus-restoration", "cancellable-open-and-close-events", "programmatic-open-close-and-refresh-api", "compact-and-spacious-density", "bordered-elevated-and-dark-appearances", "logical-properties-and-rtl", "focus-visible-feedback", "reduced-motion", "forced-colors"].every((item) => source.features.includes(item)));
  assert.ok(["menu", "menuitem", "menuitemcheckbox", "menuitemradio", "group", "separator", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Shift+F10", "ContextMenu", "ArrowUp", "ArrowDown", "Home", "End", "Enter", "Space", "Tab", "Escape"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-haspopup", "aria-controls", "aria-hidden", "aria-checked", "aria-disabled", "aria-busy", "data-g-context-menu", "data-g-context-target", "data-g-context-menu-panel", "data-g-long-press", "data-g-long-press-delay", "data-g-keep-open", "data-g-value"].every((item) => source.accessibility.attributes.includes(item)));
});

test("stepper exposes complete process structure, navigation runtime, states, and accessibility contracts", () => {
  const stepper = catalog.componentByName.get("stepper");
  assert.equal(stepper.type, "interactive"); assert.deepEqual(stepper.behaviors, ["stepper"]);
  assert.ok(["default", "horizontal", "vertical", "compact", "spacious", "navigation", "responsive", "contained", "label-start"].every((item) => stepper.variants.includes(item)));
  assert.ok(["pending", "active", "complete", "error", "disabled", "loading"].every((item) => stepper.states.includes(item)));
  assert.ok(["g-step", "g-step-action", "g-step-indicator", "g-step-icon", "g-step-content", "g-step-title", "g-step-label", "g-step-description", "g-step-status", "g-stepper-summary", "g-stepper-actions"].every((item) => stepper.parts.includes(item)));
  const source = css.components.find((item) => item.name === "stepper");
  assert.ok(["semantic-ordered-process", "current-complete-pending-error-and-disabled-states", "pointer-and-keyboard-step-selection", "roving-focus-and-disabled-step-skipping", "horizontal-and-vertical-orientation", "rtl-aware-arrow-navigation", "automatic-completion-of-previous-steps", "responsive-vertical-reflow", "programmatic-current-next-previous-and-refresh-api", "logical-properties-and-rtl", "focus-visible-feedback", "forced-colors", "reduced-motion", "print-friendly"].every((item) => source.features.includes(item)));
  assert.ok(["list", "listitem", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", "Space"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-current", "aria-disabled", "aria-busy", "aria-live", "tabindex", "data-g-value", "data-g-auto-complete"].every((item) => source.accessibility.attributes.includes(item)));
});

test("combobox exposes editable suggestions, rich options, async states, creation, and active-descendant navigation", () => {
  const combo = catalog.componentByName.get("combobox");
  assert.ok(["filled", "outlined", "borderless", "underlined", "inline", "block", "clearable", "with-prefix", "grouped", "remote", "allow-create", "mini", "small", "medium", "large"].every((item) => combo.variants.includes(item)));
  assert.ok(["default", "open", "searching", "loading", "empty", "has-value", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => combo.states.includes(item)));
  assert.ok(["g-combobox-control", "g-combobox-input", "g-combobox-clear", "g-combobox-toggle", "g-combobox-spinner", "g-combobox-status", "g-combobox-list", "g-combobox-group", "g-combobox-group-label", "g-combobox-option", "g-combobox-option-title", "g-combobox-option-description", "g-combobox-create", "g-combobox-empty", "g-combobox-loading"].every((item) => combo.parts.includes(item)));
  const source = css.components.find((item) => item.name === "combobox");
  assert.deepEqual(source.behaviors, ["combobox"]);
  assert.ok(["combobox", "listbox", "option", "group", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-controls", "aria-expanded", "aria-activedescendant", "aria-selected", "data-g-filter", "data-g-open-on-focus", "data-g-loop-navigation", "data-g-select-on-tab"].every((item) => source.accessibility.attributes.includes(item)));
});

test("toast exposes Arco-style message, queue, action, position, and accessibility contracts", () => {
  const toast = catalog.componentByName.get("toast");
  assert.ok(["top", "bottom", "compact", "spacious", "with-title", "closable", "with-action", "no-icon"].every((item) => toast.variants.includes(item)));
  assert.ok(["normal", "info", "success", "warning", "danger", "error", "loading", "paused", "leaving"].every((item) => toast.states.includes(item)));
  assert.ok(["g-toast-icon", "g-toast-content", "g-toast-title", "g-toast-message", "g-toast-action", "g-toast-close"].every((item) => toast.parts.includes(item)));
  const source = css.components.find((item) => item.name === "toast");
  assert.ok(["status", "alert"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-live", "aria-atomic", "aria-busy"].every((item) => source.accessibility.attributes.includes(item)));
});

test("progress-meter exposes continuous, radial, segmented, measurement, and accessible contracts", () => {
  const progress = catalog.componentByName.get("progress-meter");
  assert.ok(["line", "circle", "dashboard", "steps", "meter", "mini", "small", "medium", "large", "inside", "striped", "animated", "buffered", "with-success"].every((item) => progress.variants.includes(item)));
  assert.ok(["normal", "determinate", "indeterminate", "active", "success", "warning", "danger", "error", "paused", "disabled"].every((item) => progress.states.includes(item)));
  assert.ok(["g-progress-bar", "g-progress-buffer", "g-progress-success", "g-progress-text", "g-progress-step", "g-meter-segment", "g-meter-marker"].every((item) => progress.parts.includes(item)));
  const source = css.components.find((item) => item.name === "progress-meter");
  assert.ok(["progressbar", "meter"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-valuemin", "aria-valuemax", "aria-valuenow", "aria-valuetext", "aria-busy"].every((item) => source.accessibility.attributes.includes(item)));
});

test("empty-state exposes complete layout, scenario, content, and accessibility contracts", () => {
  const empty = catalog.componentByName.get("empty-state");
  assert.ok(["default", "simple", "compact", "small", "medium", "large", "inline", "card", "full-page", "no-image"].every((item) => empty.variants.includes(item)));
  assert.ok(["normal", "no-data", "no-results", "first-use", "success", "error", "offline", "forbidden", "disabled"].every((item) => empty.states.includes(item)));
  assert.ok(["g-empty-visual", "g-empty-image", "g-empty-icon", "g-empty-content", "g-empty-title", "g-empty-description", "g-empty-actions", "g-empty-help"].every((item) => empty.parts.includes(item)));
  const source = css.components.find((item) => item.name === "empty-state");
  assert.ok(source.accessibility.roles.includes("status"));
  assert.ok(["aria-labelledby", "aria-describedby", "aria-live"].every((item) => source.accessibility.attributes.includes(item)));
});

test("spinner-skeleton exposes complete indicator, overlay, placeholder, and motion contracts", () => {
  const loader = catalog.componentByName.get("spinner-skeleton");
  assert.ok(["spinner", "dots", "pulse", "inline", "tip", "overlay", "fullscreen", "xs", "small", "medium", "large", "xl", "skeleton", "text", "title", "paragraph", "avatar", "button", "input", "image", "circle", "round", "active", "static", "with-avatar", "card", "list"].every((item) => loader.variants.includes(item)));
  assert.ok(["loading", "paused", "loaded", "disabled"].every((item) => loader.states.includes(item)));
  assert.ok(["g-spinner-indicator", "g-spinner-dot", "g-spinner-description", "g-spinner-content", "g-skeleton-avatar", "g-skeleton-title", "g-skeleton-row", "g-skeleton-image", "g-skeleton-button", "g-skeleton-input", "g-skeleton-list-item"].every((item) => loader.parts.includes(item)));
  const source = css.components.find((item) => item.name === "spinner-skeleton");
  assert.ok(["status", "progressbar"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-label", "aria-live", "aria-busy", "aria-hidden"].every((item) => source.accessibility.attributes.includes(item)));
});

test("input exposes Arco-style appearances, compositions, states, and accessibility contracts", () => {
  const input = catalog.componentByName.get("input");
  assert.equal(input.exportName, "GInput");
  assert.equal(input.tag, "input");
  assert.ok(["outlined", "filled", "borderless", "underlined", "clearable", "prefix", "suffix", "prepend", "append", "group", "search", "search-button", "password", "word-limit", "block", "mini", "small", "medium", "large"].every((item) => input.variants.includes(item)));
  assert.ok(["normal", "focus", "success", "warning", "error", "invalid", "loading", "disabled", "read-only"].every((item) => input.states.includes(item)));
  assert.ok(["g-input-control", "g-input-prefix", "g-input-suffix", "g-input-clear", "g-input-spinner", "g-input-prepend", "g-input-append", "g-input-search-button", "g-password-toggle", "g-character-count"].every((item) => input.parts.includes(item)));
  const source = css.components.find((item) => item.name === "input");
  assert.ok(["textbox", "searchbox"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-describedby", "aria-invalid", "aria-busy", "autocomplete", "inputmode", "readonly", "disabled"].every((item) => source.accessibility.attributes.includes(item)));
});

test("textarea exposes Arco-style appearances, growth, limits, validation, and native semantics", () => {
  const textarea = catalog.componentByName.get("textarea");
  assert.equal(textarea.exportName, "GTextarea");
  assert.equal(textarea.tag, "textarea");
  assert.ok(["filled", "outlined", "borderless", "underlined", "clearable", "word-limit", "auto-size", "resize-none", "resize-vertical", "resize-horizontal", "resize-both", "mini", "small", "medium", "large"].every((item) => textarea.variants.includes(item)));
  assert.ok(["normal", "focus", "success", "warning", "error", "invalid", "disabled", "read-only", "near-limit", "over-limit", "max-rows"].every((item) => textarea.states.includes(item)));
  assert.ok(["g-textarea-control", "g-textarea-clear", "g-character-count"].every((item) => textarea.parts.includes(item)));
  const source = css.components.find((item) => item.name === "textarea");
  assert.ok(["clearable", "character-count", "max-length", "auto-resize", "min-rows", "max-rows", "unicode-count"].every((item) => source.features.includes(item)));
  assert.ok(["aria-describedby", "aria-invalid", "maxlength", "rows", "wrap", "spellcheck", "readonly", "disabled", "data-g-auto-resize"].every((item) => source.accessibility.attributes.includes(item)));
});

test("select exposes native single and multiple semantics, compositions, validation, and sizing", () => {
  const select = catalog.componentByName.get("select");
  assert.equal(select.exportName, "GSelect");
  assert.equal(select.tag, "select");
  assert.ok(["filled", "outlined", "borderless", "underlined", "placeholder", "clearable", "with-prefix", "with-suffix", "multiple", "option-group", "auto-width", "block", "mini", "small", "medium", "large"].every((item) => select.variants.includes(item)));
  assert.ok(["default", "hover", "focus", "success", "warning", "error", "invalid", "disabled", "loading"].every((item) => select.states.includes(item)));
  assert.ok(["g-select-control", "g-select-prefix", "g-select-suffix", "g-select-arrow", "g-select-spinner", "g-select-clear"].every((item) => select.parts.includes(item)));
  const source = css.components.find((item) => item.name === "select");
  assert.ok(["native-single-select", "native-multiple-select", "controlled-value", "placeholder-option", "disabled-option", "option-groups", "clearable-composition", "prefix-suffix-composition", "loading-indicator", "form-validation"].every((item) => source.features.includes(item)));
  assert.ok(["combobox", "listbox"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-describedby", "aria-invalid", "aria-required", "aria-busy", "disabled", "required", "multiple", "size", "name"].every((item) => source.accessibility.attributes.includes(item)));
});

test("tree-select exposes hierarchical search, checked selection, value strategies, and keyboard contracts", () => {
  const treeSelect = catalog.componentByName.get("tree-select");
  assert.equal(treeSelect.exportName, "GTreeSelect");
  assert.equal(treeSelect.tag, "div");
  assert.ok(["filled", "outlined", "borderless", "underlined", "single", "multiple", "checkable", "searchable", "clearable", "cascade", "leaf-only", "parent-value", "with-header", "with-footer", "mini", "small", "medium", "large"].every((item) => treeSelect.variants.includes(item)));
  assert.ok(["default", "open", "searching", "empty", "success", "warning", "error", "invalid", "loading", "disabled"].every((item) => treeSelect.states.includes(item)));
  assert.ok(["g-picker-control", "g-picker-values", "g-picker-input", "g-picker-clear", "g-picker-arrow", "g-picker-panel", "g-tree-list", "g-tree-node", "g-tree-toggle", "g-tree-checkbox", "g-tree-node-label"].every((item) => treeSelect.parts.includes(item)));
  assert.deepEqual(treeSelect.behaviors, ["picker", "interaction"]);
  const source = css.components.find((item) => item.name === "tree-select");
  assert.ok(["single-select", "multiple-select", "checkable-tree", "cascade-selection", "indeterminate-parent", "search-filter", "clear-all", "removable-tags", "value-strategy", "expand-collapse"].every((item) => source.features.includes(item)));
  assert.ok(["combobox", "tree", "treeitem", "group"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "Enter", "Space", "Escape"].every((item) => source.accessibility.keyboard.includes(item)));
});

test("password field exposes complete visibility, composition, validation, and accessibility contracts", () => {
  const password = catalog.componentByName.get("password-field");
  assert.equal(password.exportName, "GPasswordField");
  assert.equal(password.tag, "div");
  assert.ok(["filled", "outlined", "borderless", "underlined", "clearable", "no-toggle", "hide-on-blur", "with-prefix", "with-strength", "block", "mini", "small", "medium", "large"].every((item) => password.variants.includes(item)));
  assert.ok(["default", "hidden", "visible", "hover", "focus", "success", "warning", "error", "invalid", "disabled", "read-only", "caps-lock"].every((item) => password.states.includes(item)));
  assert.ok(["g-password-field-prefix", "g-password-field-input", "g-password-field-suffix", "g-password-field-action", "g-password-toggle", "g-password-toggle-icon", "g-password-clear", "g-password-field-caps"].every((item) => password.parts.includes(item)));
  const source = css.components.find((item) => item.name === "password-field");
  assert.ok(["controlled-visibility", "default-visibility", "selection-preservation", "escape-to-hide", "hide-on-blur", "clearable", "caps-lock-warning", "password-strength", "password-manager-autofill"].every((item) => source.features.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-disabled", "aria-readonly", "aria-pressed", "aria-controls", "autocomplete", "data-g-default-visible", "data-g-visibility", "data-g-hide-on-blur"].every((item) => source.accessibility.attributes.includes(item)));
});

test("clearable field exposes complete content, visibility, keyboard, state, and accessibility contracts", () => {
  const clearable = catalog.componentByName.get("clearable-field");
  assert.equal(clearable.exportName, "GClearableField");
  assert.equal(clearable.tag, "div");
  assert.ok(["filled", "outlined", "borderless", "underlined", "interaction", "always-visible", "clear-on-escape", "with-prefix", "with-suffix", "textarea", "select", "block", "mini", "small", "medium", "large"].every((item) => clearable.variants.includes(item)));
  assert.ok(["default", "empty", "has-value", "hover", "focus", "clearing", "cleared", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => clearable.states.includes(item)));
  assert.ok(["g-clearable-field-prefix", "g-clearable-field-control", "g-clearable-field-input", "g-clearable-field-suffix", "g-clearable-field-action", "g-clearable-field-icon", "g-input-clear", "g-textarea-clear"].every((item) => clearable.parts.includes(item)));
  const source = css.components.find((item) => item.name === "clearable-field");
  assert.ok(["input-clear", "textarea-clear", "select-clear", "controlled-value", "dynamic-clear-visibility", "always-visible-action", "focus-restoration", "input-change-events", "programmatic-clear", "clear-on-escape", "custom-clear-icon"].every((item) => source.features.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-disabled", "aria-readonly", "aria-controls", "disabled", "readonly", "data-g-clear-visibility", "data-g-clear-on-escape"].every((item) => source.accessibility.attributes.includes(item)));
});

test("status-bar exposes application-shell layout, feedback, positioning, and accessibility contracts", () => {
  const statusBar = catalog.componentByName.get("status-bar");
  assert.ok(["primary", "subtle", "bordered", "elevated", "compact", "comfortable", "responsive", "scrollable", "sticky", "fixed", "contained"].every((item) => statusBar.variants.includes(item)));
  assert.ok(["normal", "info", "success", "warning", "danger", "error", "loading", "offline", "disabled"].every((item) => statusBar.states.includes(item)));
  assert.ok(["g-status-bar-section", "g-status-bar-item", "g-status-bar-icon", "g-status-bar-label", "g-status-bar-value", "g-status-bar-progress", "g-status-bar-live"].every((item) => statusBar.parts.includes(item)));
  const source = css.components.find((item) => item.name === "status-bar");
  assert.ok(["status", "toolbar", "contentinfo"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-live", "aria-atomic", "aria-busy", "aria-current", "aria-pressed"].every((item) => source.accessibility.attributes.includes(item)));
});

test("context-bar exposes complete contextual message, action, reflow, and accessibility contracts", () => {
  const contextBar = catalog.componentByName.get("context-bar");
  assert.ok(["soft", "outlined", "filled", "banner", "borderless", "center", "compact", "spacious", "stacked", "sticky", "dismissible", "no-icon", "with-title"].every((item) => contextBar.variants.includes(item)));
  assert.ok(["normal", "info", "success", "warning", "danger", "error", "loading", "disabled"].every((item) => contextBar.states.includes(item)));
  assert.ok(["g-context-bar-icon", "g-context-bar-body", "g-context-bar-title", "g-context-bar-description", "g-context-bar-meta", "g-context-bar-actions", "g-context-bar-action", "g-context-bar-close", "g-context-bar-progress"].every((item) => contextBar.parts.includes(item)));
  const source = css.components.find((item) => item.name === "context-bar");
  assert.ok(["status", "alert", "region"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-labelledby", "aria-describedby", "aria-live", "aria-atomic", "aria-busy"].every((item) => source.accessibility.attributes.includes(item)));
});

test("page-loading exposes page, overlay, progress, lifecycle, recovery, and accessibility contracts", () => {
  const loading = catalog.componentByName.get("page-loading");
  assert.ok(["inline", "contained", "card", "full", "overlay", "fullscreen", "dimmed", "compact", "small", "medium", "large", "delayed", "no-indicator"].every((item) => loading.variants.includes(item)));
  assert.ok(["loading", "determinate", "indeterminate", "paused", "stalled", "success", "error", "cancelled", "disabled", "hidden"].every((item) => loading.states.includes(item)));
  assert.ok(["g-page-loading-indicator", "g-page-loading-title", "g-page-loading-description", "g-page-loading-status", "g-page-loading-progress", "g-page-loading-step", "g-page-loading-actions", "g-page-loading-host", "g-page-loading-container"].every((item) => loading.parts.includes(item)));
  const source = css.components.find((item) => item.name === "page-loading");
  assert.ok(["status", "progressbar", "alert"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-labelledby", "aria-describedby", "aria-live", "aria-busy", "aria-valuenow", "aria-valuetext"].every((item) => source.accessibility.attributes.includes(item)));
});

test("page-state-system exposes result, exception, recovery, responsive, and accessibility contracts", () => {
  const pageState = catalog.componentByName.get("page-state-system");
  assert.ok(["empty", "no-results", "first-use", "success", "info", "warning", "error", "403", "404", "500", "offline", "maintenance", "browser-unsupported", "compact", "inline", "card", "full-page", "split", "left", "no-visual"].every((item) => pageState.variants.includes(item)));
  assert.ok(["normal", "success", "info", "warning", "error", "forbidden", "not-found", "server-error", "offline", "maintenance", "disabled"].every((item) => pageState.states.includes(item)));
  assert.ok(["g-page-state-body", "g-page-state-visual", "g-page-state-eyebrow", "g-page-state-code", "g-page-state-title", "g-page-state-metadata", "g-page-state-request-id", "g-page-state-details", "g-page-state-detail-summary", "g-page-state-actions", "g-page-state-primary-action", "g-page-state-help", "g-page-state-suggestions", "g-page-state-suggestion"].every((item) => pageState.parts.includes(item)));
  const source = css.components.find((item) => item.name === "page-state-system");
  assert.ok(["status", "alert", "region"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-labelledby", "aria-describedby", "aria-live", "aria-atomic", "aria-disabled"].every((item) => source.accessibility.attributes.includes(item)));
});

test("form exposes complete native validation, layout, feedback, and accessibility contracts", () => {
  const form = catalog.componentByName.get("form");
  assert.equal(form.tag, "form");
  assert.ok(["default", "bordered", "vertical", "horizontal", "inline", "compact", "spacious"].every((item) => form.variants.includes(item)));
  assert.ok(["default", "submitting", "validated", "success", "error", "disabled", "read-only"].every((item) => form.states.includes(item)));
  assert.ok(["g-form-header", "g-form-title", "g-form-description", "g-form-body", "g-form-summary", "g-form-status", "g-form-actions"].every((item) => form.parts.includes(item)));
  const source = css.components.find((item) => item.name === "form");
  assert.ok(["native-submit-reset", "native-constraint-validation", "responsive-grid", "field-feedback", "fieldset-grouping"].every((item) => source.features.includes(item)));
  assert.ok(["form", "group", "alert", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-labelledby", "aria-describedby", "aria-busy", "aria-live", "novalidate"].every((item) => source.accessibility.attributes.includes(item)));
  const field = catalog.componentByName.get("field");
  assert.ok(["vertical", "horizontal", "inline", "compact", "spacious", "label-start", "label-end", "label-hidden", "required-mark", "optional-mark", "block"].every((item) => field.variants.includes(item)));
  assert.ok(["pristine", "dirty", "touched", "validating", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => field.states.includes(item)));
  assert.ok(["g-field-label-content", "g-field-label", "g-field-control", "g-field-prefix", "g-field-suffix", "g-field-actions", "g-field-action", "g-field-messages", "g-field-message", "g-field-help", "g-field-feedback", "g-field-counter", "g-field-status"].every((item) => field.parts.includes(item)));
  const fieldSource = css.components.find((item) => item.name === "field");
  assert.ok(["native-label-association", "native-constraint-validation", "responsive-horizontal-layout", "prefix-suffix-actions", "help-feedback-priority", "character-counter", "validation-lifecycle", "screen-reader-label"].every((item) => fieldSource.features.includes(item)));
  assert.ok(["group", "status", "alert"].every((item) => fieldSource.accessibility.roles.includes(item)));
  assert.ok(["for", "required", "aria-required", "aria-describedby", "aria-errormessage", "aria-invalid", "aria-busy", "aria-live", "aria-disabled", "aria-readonly"].every((item) => fieldSource.accessibility.attributes.includes(item)));
  const fieldset = catalog.componentByName.get("fieldset");
  assert.equal(fieldset.tag, "fieldset");
  assert.ok(["bordered", "subtle", "card", "plain", "compact", "spacious", "inline", "grid", "two-columns", "three-columns", "choice-cards", "block"].every((item) => fieldset.variants.includes(item)));
  assert.ok(["focus", "active", "complete", "success", "warning", "invalid", "error", "disabled", "read-only"].every((item) => fieldset.states.includes(item)));
  assert.ok(["g-fieldset-legend", "g-fieldset-legend-content", "g-fieldset-title", "g-fieldset-description", "g-fieldset-meta", "g-fieldset-badge", "g-fieldset-content", "g-fieldset-actions", "g-fieldset-help", "g-fieldset-feedback", "g-fieldset-status"].every((item) => fieldset.parts.includes(item)));
  const fieldsetSource = css.components.find((item) => item.name === "fieldset");
  assert.ok(["semantic-fieldset", "native-disabled-cascade", "legend-description-association", "grouped-choices", "responsive-grid", "validation-feedback", "nested-fieldsets", "print-safe"].every((item) => fieldsetSource.features.includes(item)));
  assert.ok(["group", "radiogroup", "status", "alert"].every((item) => fieldsetSource.accessibility.roles.includes(item)));
  assert.ok(["disabled", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-disabled", "aria-readonly", "aria-live"].every((item) => fieldsetSource.accessibility.attributes.includes(item)));
  const formRow = catalog.componentByName.get("form-row");
  assert.ok(["auto", "one", "two", "three", "four", "split", "sidebar-start", "sidebar-end", "compact", "spacious", "align-start", "align-center", "align-end", "align-baseline", "stretch", "dense", "block"].every((item) => formRow.variants.includes(item)));
  assert.ok(["invalid", "error", "disabled", "read-only"].every((item) => formRow.states.includes(item)));
  assert.ok(["g-form-row-item", "g-form-row-main", "g-form-row-aside", "g-form-row-actions", "g-form-row-divider", "g-form-row-span-2", "g-form-row-span-3", "g-form-row-span-full", "g-form-row-start-2", "g-form-row-start-3"].every((item) => formRow.parts.includes(item)));
  const formRowSource = css.components.find((item) => item.name === "form-row");
  assert.ok(["responsive-auto-fit", "explicit-columns", "asymmetric-layouts", "item-spanning", "column-placement", "cross-axis-alignment", "nested-rows", "container-query-collapse", "print-stack"].every((item) => formRowSource.features.includes(item)));
  assert.ok(formRowSource.accessibility.roles.includes("group"));
  const formGrid = catalog.componentByName.get("form-grid");
  assert.ok(["auto", "one", "two", "three", "four", "six", "twelve", "compact", "spacious", "dense", "align-start", "align-center", "align-end", "stretch", "full-span", "block"].every((item) => formGrid.variants.includes(item)));
  assert.ok(["invalid", "error", "disabled", "read-only"].every((item) => formGrid.states.includes(item)));
  assert.ok(["g-form-grid-item", "g-form-grid-section", "g-form-grid-actions", "g-form-grid-divider", "g-form-grid-span-2", "g-form-grid-span-3", "g-form-grid-span-4", "g-form-grid-span-6", "g-form-grid-span-full", "g-form-grid-row-span-2", "g-form-grid-row-span-3", "g-form-grid-start-2", "g-form-grid-start-3", "g-form-grid-start-4"].every((item) => formGrid.parts.includes(item)));
  const formGridSource = css.components.find((item) => item.name === "form-grid");
  assert.ok(["responsive-auto-fit", "explicit-columns", "item-spanning", "row-spanning", "column-placement", "dense-packing", "nested-grids", "container-query-breakpoints", "print-stack", "legacy-is-class-aliases"].every((item) => formGridSource.features.includes(item)));
  assert.ok(formGridSource.accessibility.roles.includes("group"));
  const horizontalForm = catalog.componentByName.get("horizontal-form");
  assert.ok(["label-sm", "label-md", "label-lg", "compact", "spacious", "label-start", "label-center", "label-end", "stacked", "bordered", "block"].every((item) => horizontalForm.variants.includes(item)));
  assert.ok(["invalid", "error", "success", "disabled", "read-only", "busy"].every((item) => horizontalForm.states.includes(item)));
  assert.ok(["g-form-horizontal-header", "g-form-horizontal-body", "g-form-horizontal-row", "g-form-horizontal-label", "g-form-horizontal-content", "g-form-horizontal-control", "g-form-horizontal-help", "g-form-horizontal-feedback", "g-form-horizontal-actions", "g-form-horizontal-divider"].every((item) => horizontalForm.parts.includes(item)));
  const horizontalFormSource = css.components.find((item) => item.name === "horizontal-form");
  assert.ok(["aligned-label-column", "configurable-label-width", "wrapped-field-rows", "direct-label-control-pairs", "content-column-feedback", "action-column-offset", "container-query-collapse", "mobile-stack", "print-stack"].every((item) => horizontalFormSource.features.includes(item)));
  assert.ok(["form", "group", "alert", "status"].every((item) => horizontalFormSource.accessibility.roles.includes(item)));
  const inlineForm = catalog.componentByName.get("inline-form");
  assert.ok(["wrap", "nowrap", "compact", "spacious", "align-start", "align-center", "align-end", "stretch", "field-sm", "field-md", "field-lg", "stacked", "bordered", "block"].every((item) => inlineForm.variants.includes(item)));
  assert.ok(["invalid", "error", "success", "disabled", "read-only", "busy", "submitted"].every((item) => inlineForm.states.includes(item)));
  assert.ok(["g-form-inline-field", "g-form-inline-field-grow", "g-form-inline-field-fixed", "g-form-inline-label", "g-form-inline-control", "g-form-inline-help", "g-form-inline-feedback", "g-form-inline-actions", "g-form-inline-status", "g-form-inline-divider"].every((item) => inlineForm.parts.includes(item)));
  const inlineFormSource = css.components.find((item) => item.name === "inline-form");
  assert.ok(["flexible-field-widths", "wrapping-and-nowrap", "aligned-controls", "inline-feedback", "action-cluster", "semantic-form-override", "container-query-stack", "mobile-stack", "print-stack"].every((item) => inlineFormSource.features.includes(item)));
  assert.ok(["form", "group", "alert", "status"].every((item) => inlineFormSource.accessibility.roles.includes(item)));
  const compactForm = catalog.componentByName.get("compact-form");
  assert.equal(compactForm.tag, "form");
  assert.ok(["vertical", "inline", "joined", "two-columns", "three-columns", "tight", "comfortable", "bordered", "subtle", "block"].every((item) => compactForm.variants.includes(item)));
  assert.ok(["invalid", "error", "success", "disabled", "read-only", "busy", "submitted"].every((item) => compactForm.states.includes(item)));
  assert.ok(["g-compact-form-header", "g-compact-form-body", "g-compact-form-field", "g-compact-form-label", "g-compact-form-control", "g-compact-form-help", "g-compact-form-feedback", "g-compact-form-actions", "g-compact-form-status", "g-compact-form-divider", "g-compact-form-span-full"].every((item) => compactForm.parts.includes(item)));
  const compactFormSource = css.components.find((item) => item.name === "compact-form");
  assert.ok(["compact-control-scale", "vertical-inline-joined-layouts", "responsive-grid-columns", "joined-control-groups", "field-feedback", "action-cluster", "semantic-form-override", "container-query-collapse", "mobile-stack", "print-stack"].every((item) => compactFormSource.features.includes(item)));
  assert.ok(["form", "group", "alert", "status"].every((item) => compactFormSource.accessibility.roles.includes(item)));
  const inputGroup = catalog.componentByName.get("input-group");
  assert.ok(["joined", "separated", "stacked", "block", "compact", "responsive", "mini", "small", "medium", "large", "filled", "outlined", "borderless"].every((item) => inputGroup.variants.includes(item)));
  assert.ok(["focus", "success", "warning", "error", "invalid", "disabled", "read-only", "loading"].every((item) => inputGroup.states.includes(item)));
  assert.ok(["g-input-group-label", "g-input-group-control", "g-input-addon", "g-input-prepend", "g-input-append", "g-input-search-button", "g-input-group-divider", "g-input-group-help", "g-input-group-feedback", "g-input-group-status"].every((item) => inputGroup.parts.includes(item)));
  const inputGroupSource = css.components.find((item) => item.name === "input-group");
  assert.ok(["continuous-boundaries", "addon-composition", "mixed-control-composition", "size-propagation", "appearance-propagation", "focus-layering", "responsive-wrapping", "accessible-feedback", "rtl-logical-layout", "mobile-touch-targets"].every((item) => inputGroupSource.features.includes(item)));
  assert.ok(["group", "search", "status", "alert"].every((item) => inputGroupSource.accessibility.roles.includes(item)));
  const inputAffix = catalog.componentByName.get("input-affix");
  assert.ok(["default", "filled", "outlined", "borderless", "underlined", "block", "compact", "mini", "small", "medium", "large", "prefix", "suffix", "clearable", "loading"].every((item) => inputAffix.variants.includes(item)));
  assert.ok(["default", "hover", "focus", "success", "warning", "error", "invalid", "loading", "disabled", "read-only"].every((item) => inputAffix.states.includes(item)));
  assert.ok(["g-input-affix-label", "g-input-affix-control", "g-input-affix-start", "g-input-affix-end", "g-input-prefix", "g-input-suffix", "g-input-affix-action", "g-input-clear", "g-input-spinner", "g-input-affix-help", "g-input-affix-feedback", "g-input-affix-status"].every((item) => inputAffix.parts.includes(item)));
  const inputAffixSource = css.components.find((item) => item.name === "input-affix");
  assert.ok(["embedded-prefix-suffix", "structured-field-layout", "control-size-propagation", "appearance-propagation", "focus-within-ring", "interactive-affix-actions", "validation-feedback", "clearable-content", "loading-indicator", "rtl-logical-layout", "mobile-touch-targets"].every((item) => inputAffixSource.features.includes(item)));
  assert.ok(["group", "status", "alert"].every((item) => inputAffixSource.accessibility.roles.includes(item)));
  const searchField = catalog.componentByName.get("search-field");
  assert.ok(["default", "icon", "button", "custom-button", "clearable", "responsive", "block", "compact", "filled", "outlined", "borderless", "underlined", "mini", "small", "medium", "large"].every((item) => searchField.variants.includes(item)));
  assert.ok(["default", "hover", "focus", "searching", "loading", "empty", "results", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => searchField.states.includes(item)));
  assert.ok(["g-search-field-label", "g-search-field-control", "g-search-field-input-wrap", "g-search-field-icon", "g-search-field-input", "g-search-field-clear", "g-search-field-action", "g-search-field-spinner", "g-search-field-shortcut", "g-search-field-help", "g-search-field-feedback", "g-search-field-status", "g-search-field-result-count"].every((item) => searchField.parts.includes(item)));
  const searchFieldSource = css.components.find((item) => item.name === "search-field");
  assert.ok(["native-search-submit", "embedded-search-icon", "action-button", "custom-action", "clearable-query", "keyboard-submit", "loading-indicator", "result-feedback", "size-propagation", "appearance-propagation", "responsive-action-layout", "accessible-search-region", "mobile-touch-targets"].every((item) => searchFieldSource.features.includes(item)));
  assert.ok(["search", "status", "alert"].every((item) => searchFieldSource.accessibility.roles.includes(item)));
  const characterCounter = catalog.componentByName.get("character-counter");
  assert.ok(["default", "textarea", "input", "inline", "block", "compact", "count", "remaining", "soft-limit", "hard-limit", "mini", "small", "medium", "large"].every((item) => characterCounter.variants.includes(item)));
  assert.ok(["default", "empty", "typing", "near-limit", "at-limit", "over-limit", "invalid", "disabled", "read-only"].every((item) => characterCounter.states.includes(item)));
  assert.ok(["g-character-field-label", "g-character-field-control", "g-character-field-input", "g-character-count", "g-character-count-current", "g-character-count-separator", "g-character-count-maximum", "g-character-field-help", "g-character-field-feedback", "g-character-field-status"].every((item) => characterCounter.parts.includes(item)));
  const characterCounterSource = css.components.find((item) => item.name === "character-counter");
  assert.ok(["unicode-grapheme-count", "input-textarea-support", "native-maxlength", "soft-limit", "hard-limit", "configurable-warning-threshold", "remaining-count", "live-runtime-update", "dynamic-constraint-sync", "count-event-detail", "validation-feedback"].every((item) => characterCounterSource.features.includes(item)));
  assert.ok(["status", "alert"].every((item) => characterCounterSource.accessibility.roles.includes(item)));
  const validationState = catalog.componentByName.get("validation-state");
  assert.ok(["default", "block", "inline", "with-icon", "reserve-message", "compact", "mini", "small", "medium", "large"].every((item) => validationState.variants.includes(item)));
  assert.ok(["default", "focus", "success", "warning", "danger", "error", "invalid", "validating", "disabled", "read-only"].every((item) => validationState.states.includes(item)));
  assert.ok(["g-validation-label", "g-validation-required", "g-validation-control", "g-validation-input", "g-validation-icon", "g-validation-message", "g-validation-help", "g-validation-status"].every((item) => validationState.parts.includes(item)));
  const validationStateSource = css.components.find((item) => item.name === "validation-state");
  assert.ok(["input-textarea-select-composition", "help-and-feedback-messages", "reserved-message-space", "status-icon", "async-validation-state", "native-invalid-propagation", "responsive-inline-layout"].every((item) => validationStateSource.features.includes(item)));
  assert.ok(["status", "alert"].every((item) => validationStateSource.accessibility.roles.includes(item)));
});

test("form-actions exposes grouped commands, status, responsive, sticky, and accessibility contracts", () => {
  const actions = catalog.componentByName.get("form-actions");
  assert.ok(["end", "start", "center", "between", "stacked", "block", "compact", "spacious", "bordered", "subtle", "sticky", "sticky-bleed"].every((item) => actions.variants.includes(item)));
  assert.ok(["default", "busy", "success", "warning", "error", "disabled"].every((item) => actions.states.includes(item)));
  assert.ok(["g-form-actions-main", "g-form-actions-secondary", "g-form-actions-meta", "g-form-actions-status"].every((item) => actions.parts.includes(item)));
  const source = css.components.find((item) => item.name === "form-actions");
  assert.ok(["primary-secondary-groups", "submission-status", "responsive-wrapping", "mobile-full-width-actions", "sticky-safe-area", "logical-alignment", "legacy-is-class-aliases", "print-hidden"].every((item) => source.features.includes(item)));
  assert.ok(["group", "status", "alert"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-describedby", "aria-busy", "aria-disabled", "aria-live"].every((item) => source.accessibility.attributes.includes(item)));
});

test("autosave-status exposes persistence lifecycle, recovery, timestamp, and live-region contracts", () => {
  const autosave = catalog.componentByName.get("autosave-status");
  assert.deepEqual(autosave.behaviors, ["autosave"]);
  assert.ok(["default", "compact", "badge", "subtle", "block"].every((item) => autosave.variants.includes(item)));
  assert.ok(["idle", "dirty", "saving", "saved", "error", "offline", "disabled"].every((item) => autosave.states.includes(item)));
  assert.ok(["g-autosave-status-indicator", "g-autosave-status-label", "g-autosave-status-time", "g-autosave-status-detail", "g-autosave-status-actions", "g-autosave-status-retry"].every((item) => autosave.parts.includes(item)));
  const source = css.components.find((item) => item.name === "autosave-status");
  assert.equal(source.status, "runtime-ready");
  assert.ok(["debounced-save-lifecycle", "async-save-request", "success-timestamp", "error-recovery", "localized-status-labels", "live-state-announcements", "reduced-motion", "forced-colors", "print-safe"].every((item) => source.features.includes(item)));
  assert.ok(["status", "alert"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-live", "aria-atomic", "aria-busy", "aria-disabled", "aria-label", "datetime"].every((item) => source.accessibility.attributes.includes(item)));
});

test("form-progress exposes completion, step, responsive, and accessibility contracts", () => {
  const progress = catalog.componentByName.get("form-progress");
  assert.ok(["default", "compact", "spacious", "card", "subtle", "rounded", "square", "segmented", "with-steps", "vertical-steps"].every((item) => progress.variants.includes(item)));
  assert.ok(["default", "empty", "active", "partial", "complete", "success", "warning", "error", "disabled"].every((item) => progress.states.includes(item)));
  assert.ok(["g-form-progress-header", "g-form-progress-meta", "g-form-progress-heading", "g-form-progress-label", "g-form-progress-description", "g-form-progress-count", "g-form-progress-percentage", "g-form-progress-track", "g-form-progress-value", "g-form-progress-steps", "g-form-progress-step", "g-form-progress-step-marker", "g-form-progress-step-content", "g-form-progress-step-title", "g-form-progress-step-description", "g-form-progress-status"].every((item) => progress.parts.includes(item)));
  const source = css.components.find((item) => item.name === "form-progress");
  assert.ok(["determinate-form-completion", "completed-and-total-summary", "optional-step-breakdown", "current-complete-and-invalid-steps", "responsive-step-layout", "logical-properties", "legacy-state-class-aliases", "reduced-motion", "forced-colors", "print-safe"].every((item) => source.features.includes(item)));
  assert.ok(["progressbar", "list", "listitem", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-describedby", "aria-valuemin", "aria-valuemax", "aria-valuenow", "aria-valuetext", "aria-current", "aria-invalid", "aria-disabled"].every((item) => source.accessibility.attributes.includes(item)));
});

test("form-review exposes grouped values, edit navigation, validation, privacy, and accessibility contracts", () => {
  const review = catalog.componentByName.get("form-review");
  assert.ok(["default", "compact", "spacious", "bordered", "card", "subtle", "divided", "striped", "vertical", "two-column", "editable"].every((item) => review.variants.includes(item)));
  assert.ok(["default", "complete", "changed", "warning", "error", "invalid", "disabled", "empty", "read-only"].every((item) => review.states.includes(item)));
  assert.ok(["g-form-review-header", "g-form-review-heading", "g-form-review-title", "g-form-review-description", "g-form-review-summary", "g-form-review-actions", "g-form-review-section", "g-form-review-section-header", "g-form-review-section-title", "g-form-review-section-description", "g-form-review-list", "g-form-review-row", "g-form-review-label", "g-form-review-value", "g-form-review-value-primary", "g-form-review-value-secondary", "g-form-review-action", "g-form-review-empty", "g-form-review-note", "g-form-review-footer", "g-form-review-status"].every((item) => review.parts.includes(item)));
  const source = css.components.find((item) => item.name === "form-review");
  assert.ok(["semantic-review-summary", "definition-list-rows", "grouped-review-sections", "field-edit-navigation", "missing-value-presentation", "changed-value-highlighting", "sensitive-value-redaction", "validation-state-presentation", "responsive-row-stacking", "logical-properties", "legacy-state-class-aliases", "forced-colors", "print-safe"].every((item) => source.features.includes(item)));
  assert.ok(["region", "group", "status", "alert"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-describedby", "aria-live", "aria-current", "aria-invalid", "aria-disabled"].every((item) => source.accessibility.attributes.includes(item)));
});

test("consent-group exposes independent opt-ins, aggregate state, legal metadata, and validation contracts", () => {
  const consent = catalog.componentByName.get("consent-group");
  assert.ok(["default", "plain", "bordered", "card", "subtle", "compact", "spacious", "divided", "inline", "legal"].every((item) => consent.variants.includes(item)));
  assert.ok(["default", "unchecked", "partial", "accepted", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => consent.states.includes(item)));
  assert.ok(["g-consent-group-header", "g-consent-group-title", "g-consent-group-required", "g-consent-group-description", "g-consent-group-summary", "g-consent-group-items", "g-consent-group-item", "g-consent-group-control", "g-consent-group-content", "g-consent-group-label", "g-consent-group-item-description", "g-consent-group-links", "g-consent-group-link", "g-consent-group-meta", "g-consent-group-version", "g-consent-group-timestamp", "g-consent-group-feedback", "g-consent-group-footer", "g-consent-group-status"].every((item) => consent.parts.includes(item)));
  const source = css.components.find((item) => item.name === "consent-group");
  assert.ok(["native-checkbox-semantics", "explicit-opt-in", "required-and-optional-consents", "multiple-independent-consents", "aggregate-partial-state", "terms-and-policy-links", "consent-version-metadata", "validation-feedback", "responsive-item-layout", "logical-properties", "legacy-state-class-aliases", "forced-colors", "print-safe"].every((item) => source.features.includes(item)));
  assert.ok(["group", "checkbox", "status", "alert"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["required", "checked", "aria-required", "aria-checked", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-disabled", "aria-live"].every((item) => source.accessibility.attributes.includes(item)));
});

test("date-picker exposes a real calendar, date constraints, keyboard navigation, and runtime selection", () => {
  const datePicker = catalog.componentByName.get("date-picker");
  assert.equal(datePicker.type, "interactive");
  assert.deepEqual(datePicker.behaviors, ["picker"]);
  assert.ok(["default", "flat", "bordered", "elevated", "inline", "compact", "spacious", "full-width", "with-presets", "with-footer"].every((item) => datePicker.variants.includes(item)));
  assert.ok(["default", "empty", "single", "range", "partial", "complete", "invalid", "disabled", "read-only"].every((item) => datePicker.states.includes(item)));
  assert.ok(["g-date-picker-header", "g-date-picker-navigation", "g-date-picker-previous", "g-date-picker-next", "g-date-picker-title", "g-date-picker-body", "g-calendar-grid", "g-calendar-row", "g-calendar-weekday", "g-calendar-day", "g-date-picker-presets", "g-date-picker-preset", "g-date-picker-footer", "g-date-picker-selection", "g-date-picker-status", "g-date-picker-actions", "g-date-picker-output"].every((item) => datePicker.parts.includes(item)));
  const source = css.components.find((item) => item.name === "date-picker");
  assert.equal(source.status, "runtime-ready");
  assert.ok(["calendar-month-rendering", "single-date-selection", "date-range-selection", "previous-and-next-month-navigation", "today-and-relative-presets", "minimum-and-maximum-date-constraints", "native-hidden-value-output", "localized-month-weekday-and-date-labels", "roving-tabindex-grid-keyboard-navigation", "outside-month-days", "weekend-and-today-presentation", "selection-status-announcement", "responsive-calendar-layout", "logical-properties", "reduced-motion", "forced-colors", "print-safe"].every((item) => source.features.includes(item)));
  assert.ok(["group", "grid", "row", "columnheader", "gridcell", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-describedby", "aria-selected", "aria-current", "aria-disabled", "aria-live", "aria-invalid", "aria-readonly"].every((item) => source.accessibility.attributes.includes(item)));
});

test("time-picker exposes typed, stepped, constrained, keyboard-accessible time selection", () => {
  const timePicker = catalog.componentByName.get("time-picker");
  assert.equal(timePicker.type, "interactive");
  assert.deepEqual(timePicker.behaviors, ["wheel-picker"]);
  assert.ok(["default", "inline", "bordered", "elevated", "compact", "spacious", "full-width", "with-seconds", "twelve-hour", "with-presets", "with-footer"].every((item) => timePicker.variants.includes(item)));
  assert.ok(["default", "empty", "active", "open", "selected", "invalid", "disabled", "read-only"].every((item) => timePicker.states.includes(item)));
  assert.ok(["g-time-picker-control", "g-time-picker-input", "g-time-picker-icon", "g-time-picker-clear", "g-time-picker-panel", "g-time-picker-presets", "g-time-picker-preset", "g-time-picker-columns", "g-time-picker-column", "g-time-picker-column-header", "g-time-picker-option", "g-time-picker-footer", "g-time-picker-status", "g-time-picker-actions", "g-time-picker-output"].every((item) => timePicker.parts.includes(item)));
  const source = css.components.find((item) => item.name === "time-picker");
  assert.equal(source.status, "runtime-ready");
  assert.ok(["typed-time-input", "hour-minute-and-optional-second-columns", "twelve-and-twenty-four-hour-formats", "configurable-unit-steps", "minimum-and-maximum-time-constraints", "now-and-day-period-presets", "clear-and-confirm-actions", "native-hidden-value-output", "localized-time-status", "roving-option-keyboard-navigation", "responsive-column-layout", "logical-properties", "reduced-motion", "forced-colors", "print-safe"].every((item) => source.features.includes(item)));
  assert.ok(["group", "listbox", "option", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-describedby", "aria-expanded", "aria-controls", "aria-selected", "aria-disabled", "aria-invalid", "aria-readonly", "aria-live"].every((item) => source.accessibility.attributes.includes(item)));
});

test("pin-input exposes a complete multi-cell code entry and OTP runtime contract", () => {
  const pinInput = catalog.componentByName.get("pin-input");
  assert.equal(pinInput.type, "interactive");
  assert.deepEqual(pinInput.behaviors, ["otp-input"]);
  assert.ok(["default", "boxed", "underlined", "compact", "spacious", "grouped", "masked", "full-width"].every((item) => pinInput.variants.includes(item)));
  assert.ok(["empty", "partial", "complete", "invalid", "disabled", "read-only"].every((item) => pinInput.states.includes(item)));
  assert.ok(["g-pin-input-label", "g-pin-input-cells", "g-pin-input-cell", "g-pin-input-separator", "g-pin-input-output", "g-pin-input-footer", "g-pin-input-status", "g-pin-input-help", "g-pin-input-actions", "g-pin-input-clear"].every((item) => pinInput.parts.includes(item)));
  const source = css.components.find((item) => item.name === "pin-input");
  assert.equal(source.status, "runtime-ready");
  assert.ok(["numeric-and-alphanumeric-modes", "single-character-cell-normalization", "automatic-focus-advance", "backspace-delete-and-arrow-navigation", "whole-code-paste-distribution", "one-time-code-autocomplete", "native-hidden-value-output", "clear-action", "completion-event", "localized-cell-and-status-labels", "responsive-cell-sizing", "logical-properties", "reduced-motion", "forced-colors", "print-safe"].every((item) => source.features.includes(item)));
  assert.ok(["group", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["ArrowLeft", "ArrowRight", "Home", "End", "Backspace", "Delete", "Paste"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-disabled", "aria-readonly", "aria-live"].every((item) => source.accessibility.attributes.includes(item)));
});

test("rating exposes fractional selection, form output, keyboard, and accessible state contracts", () => {
  const rating = catalog.componentByName.get("rating");
  assert.equal(rating.type, "interactive");
  assert.deepEqual(rating.behaviors, ["rating"]);
  assert.ok(["default", "small", "medium", "large", "compact", "spacious", "half", "clearable", "with-label", "with-value"].every((item) => rating.variants.includes(item)));
  assert.ok(["empty", "rated", "previewing", "complete", "invalid", "disabled", "read-only", "loading"].every((item) => rating.states.includes(item)));
  assert.ok(["g-rating-label", "g-rating-items", "g-rating-item", "g-rating-icon", "g-rating-footer", "g-rating-value", "g-rating-status", "g-rating-help", "g-rating-actions", "g-rating-clear", "g-rating-output"].every((item) => rating.parts.includes(item)));
  const source = css.components.find((item) => item.name === "rating");
  assert.equal(source.status, "runtime-ready");
  assert.ok(["single-value-rating", "integer-and-half-step-values", "pointer-position-preview", "arrow-home-end-keyboard-control", "optional-reselect-to-clear", "native-hidden-value-output", "form-reset-restoration", "localized-option-and-status-labels", "responsive-touch-targets", "logical-properties", "reduced-motion", "forced-colors", "print-safe"].every((item) => source.features.includes(item)));
  assert.ok(["radiogroup", "radio", "status"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Space", "Enter"].every((item) => source.accessibility.keyboard.includes(item)));
  assert.ok(["aria-label", "aria-labelledby", "aria-describedby", "aria-checked", "aria-disabled", "aria-readonly", "aria-invalid", "aria-live"].every((item) => source.accessibility.attributes.includes(item)));
});

test("validation summary exposes form error collection, navigation, live updates, and accessibility contracts", () => {
  const summary = catalog.componentByName.get("validation-summary");
  assert.equal(summary.type, "interactive");
  assert.deepEqual(summary.behaviors, ["validation-summary"]);
  assert.ok(["default", "compact", "spacious", "subtle", "banner"].every((item) => summary.variants.includes(item)));
  assert.ok(["empty", "valid", "invalid", "updating", "disabled"].every((item) => summary.states.includes(item)));
  assert.ok(["g-validation-summary-icon", "g-validation-summary-content", "g-validation-summary-header", "g-validation-summary-title", "g-validation-summary-count", "g-validation-summary-description", "g-validation-summary-list", "g-validation-summary-item", "g-validation-summary-label", "g-validation-summary-link", "g-validation-summary-message", "g-validation-summary-actions", "g-validation-summary-status"].every((item) => summary.parts.includes(item)));
  const source = css.components.find((item) => item.name === "validation-summary");
  assert.ok(["native-constraint-validation", "aria-invalid-collection", "custom-error-sources", "form-scope-targeting", "dynamic-error-refresh", "error-count", "invalid-submit-blocking", "summary-focus-on-submit", "field-focus-navigation", "live-region-announcement", "mutation-observer", "localized-messages", "responsive-layout", "logical-properties", "reduced-motion", "forced-colors", "print-friendly"].every((item) => source.features.includes(item)));
  assert.ok(["alert", "status", "list"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-labelledby", "aria-describedby", "aria-live", "aria-atomic", "aria-invalid", "aria-hidden", "hidden"].every((item) => source.accessibility.attributes.includes(item)));
});

test("form-section exposes task grouping, disclosure, status, nesting, and accessibility contracts", () => {
  const section = catalog.componentByName.get("form-section");
  assert.ok(["default", "divided", "bordered", "card", "subtle", "compact", "spacious", "numbered", "nested", "collapsible", "no-divider"].every((item) => section.variants.includes(item)));
  assert.ok(["default", "active", "complete", "error", "invalid", "disabled", "collapsed", "expanded"].every((item) => section.states.includes(item)));
  assert.ok(["g-form-section-header", "g-form-section-heading", "g-form-section-eyebrow", "g-form-section-number", "g-form-section-title", "g-form-section-description", "g-form-section-meta", "g-form-section-actions", "g-form-section-toggle", "g-form-section-body", "g-form-section-content", "g-form-section-status", "g-form-section-summary", "g-form-section-footer"].every((item) => section.parts.includes(item)));
  const source = css.components.find((item) => item.name === "form-section");
  assert.ok(["semantic-region", "native-details-disclosure", "section-status", "validation-summary", "responsive-actions", "nested-sections", "print-expanded"].every((item) => source.features.includes(item)));
  assert.ok(["region", "group", "status", "alert"].every((item) => source.accessibility.roles.includes(item)));
  assert.ok(["aria-labelledby", "aria-describedby", "aria-expanded", "aria-controls", "aria-current", "aria-invalid", "aria-disabled", "open"].every((item) => source.accessibility.attributes.includes(item)));
});

test("conditional-field exposes controller logic, visual structures, and accessibility states", () => {
  const conditionalField = catalog.componentByName.get("conditional-field");
  assert.deepEqual(conditionalField.variants, ["panel", "accent", "compact"]);
  assert.deepEqual(conditionalField.states, ["visible", "hidden", "unresolved"]);
  assert.ok(["g-conditional-field-header", "g-conditional-field-title", "g-conditional-field-description", "g-conditional-field-status", "g-conditional-field-content"].every((item) => conditionalField.parts.includes(item)));
  assert.deepEqual(conditionalField.behaviors, ["conditional-field"]);
  const source = css.components.find((item) => item.name === "conditional-field");
  assert.ok(["scoped-controller", "multi-value-matching", "hidden-control-disabling", "dynamic-controller-resolution"].every((item) => source.features.includes(item)));
  assert.ok(["aria-controls", "aria-hidden", "hidden", "inert"].every((item) => source.accessibility.attributes.includes(item)));
});
