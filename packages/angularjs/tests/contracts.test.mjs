import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import * as components from "../dist/generated/components.js";
import * as rootModule from "../dist/index.js";
import { componentCatalog } from "../dist/generated/catalog.js";

const root = resolve(import.meta.dirname, "..");
const api = JSON.parse(await readFile(resolve(root, "metadata/public-api.json"), "utf8"));
const cssApi = JSON.parse(await readFile(resolve(root, "../css/metadata/public-api.json"), "utf8"));

test("all 575 CSS components have unique AngularJS directive contracts", () => {
  assert.equal(componentCatalog.length, 575);
  for (const key of ["name", "exportName", "directiveName", "elementName"]) assert.equal(new Set(componentCatalog.map((item) => item[key])).size, 575, key);
  assert.equal(Object.keys(components.gardenerimDirectives).length, 575);
  for (const definition of componentCatalog) {
    assert.equal(typeof components[definition.exportName], "function", definition.exportName);
    assert.equal(components.gardenerimDirectives[definition.directiveName], components[definition.exportName]);
    const directive = components[definition.exportName]();
    assert.equal(directive.restrict, "EA");
    assert.equal(directive.require, "?ngModel");
    assert.equal(typeof directive.link, "function");
  }
});

test("component behaviors are covered by the 96-behavior runtime", () => {
  assert.equal(cssApi.javascript.behaviors.length, 96);
  for (const definition of componentCatalog) for (const behavior of definition.behaviors) assert.ok(cssApi.javascript.behaviors.includes(behavior), `${definition.name}/${behavior}`);
});

test("badge, tag, and chip keep separate directive metadata", () => {
  const badge = componentCatalog.find((item) => item.name === "badge");
  const tag = componentCatalog.find((item) => item.name === "tag");
  const chip = componentCatalog.find((item) => item.name === "chip");
  assert.deepEqual([badge.elementName, tag.elementName, chip.elementName], ["g-badge", "g-tag", "g-chip"]);
  assert.deepEqual([badge.tag, tag.tag, chip.tag], ["span", "span", "span"]);
  assert.ok(badge.parts.includes("g-badge-indicator"));
  assert.ok(tag.variants.includes("checkable"));
  assert.ok(chip.parts.includes("g-chip-remove"));
});

test("avatar and avatar-group keep separate directive metadata", () => {
  const avatar = componentCatalog.find((item) => item.name === "avatar");
  const group = componentCatalog.find((item) => item.name === "avatar-group");
  assert.deepEqual([avatar.elementName, group.elementName], ["g-avatar", "g-avatar-group"]);
  assert.deepEqual([avatar.directiveName, group.directiveName], ["gAvatar", "gAvatarGroup"]);
  assert.ok(avatar.variants.includes("fit-scale-down"));
  assert.ok(avatar.states.includes("online"));
  assert.ok(group.parts.includes("g-avatar-overflow"));
});

test("divider directive metadata covers content, orientation, line, and spacing variants", () => {
  const divider = componentCatalog.find((item) => item.name === "divider-with-text");
  assert.equal(divider.directiveName, "gDividerWithText");
  assert.ok(["horizontal", "vertical", "start", "center", "end", "dashed", "dotted", "double", "plain", "heading", "small", "large", "inset", "strong", "stretch"].every((item) => divider.variants.includes(item)));
  assert.ok(divider.parts.includes("g-divider-text"));
});

test("alert directive metadata covers structured content, status, and responsive appearances", () => {
  const alert = componentCatalog.find((item) => item.name === "alert");
  assert.ok(["soft", "outlined", "filled", "banner", "center", "compact", "spacious", "with-title", "closable", "no-icon", "stacked"].every((item) => alert.variants.includes(item)));
  assert.ok(["normal", "info", "success", "warning", "danger", "error", "loading"].every((item) => alert.states.includes(item)));
  assert.ok(["g-alert-icon", "g-alert-body", "g-alert-title", "g-alert-content", "g-alert-actions", "g-alert-close"].every((item) => alert.parts.includes(item)));
});

test("checkbox and radio directive metadata covers native choice and responsive group patterns", () => {
  const choice = componentCatalog.find((item) => item.name === "checkbox-radio");
  const checkboxGroup = componentCatalog.find((item) => item.name === "checkbox-group");
  const radioGroup = componentCatalog.find((item) => item.name === "radio-group");
  assert.equal(choice.directiveName, "gCheckboxRadio");
  assert.ok(["checkbox", "radio", "indeterminate"].every((item) => [...choice.variants, ...choice.states].includes(item)));
  assert.ok(["g-choice-content", "g-choice-label", "g-choice-description"].every((item) => choice.parts.includes(item)));
  assert.ok([checkboxGroup, radioGroup].every((group) => ["inline", "grid", "buttons", "cards"].every((item) => group.variants.includes(item))));
  assert.equal(checkboxGroup.tag, "fieldset");
  assert.deepEqual(checkboxGroup.behaviors, ["row-select"]);
  assert.ok(["default", "stacked", "inline", "grid", "two", "three", "four", "buttons", "cards", "compact", "block", "small", "medium", "large"].every((item) => checkboxGroup.variants.includes(item)));
  assert.ok(["default", "normal", "empty", "partial", "selected", "max", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => checkboxGroup.states.includes(item)));
  assert.ok(["g-choice-group-legend", "g-choice-group-options", "g-choice-group-option", "g-choice-group-select-all", "g-choice-group-count", "g-choice-group-help", "g-choice-group-feedback", "g-choice-group-status"].every((item) => checkboxGroup.parts.includes(item)));
  assert.equal(radioGroup.tag, "fieldset");
  assert.ok(["default", "stacked", "inline", "grid", "two", "three", "four", "buttons", "cards", "compact", "block", "small", "medium", "large"].every((item) => radioGroup.variants.includes(item)));
  assert.ok(["default", "normal", "empty", "selected", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => radioGroup.states.includes(item)));
  assert.ok(["g-choice-group-legend", "g-choice-group-options", "g-choice-group-option", "g-choice-group-option-content", "g-choice-group-help", "g-choice-group-feedback", "g-choice-group-status"].every((item) => radioGroup.parts.includes(item)));
});

test("switch directive metadata covers immediate toggles, content, loading, and setting rows", () => {
  const toggle = componentCatalog.find((item) => item.name === "switch");
  const row = componentCatalog.find((item) => item.name === "switch-row");
  assert.equal(toggle.directiveName, "gSwitch");
  assert.ok(["mini", "small", "medium", "large", "wide", "inline-prompt", "square", "bordered", "card"].every((item) => toggle.variants.includes(item)));
  assert.ok(["checked", "loading", "disabled", "invalid"].every((item) => toggle.states.includes(item)));
  assert.ok(["g-switch-track", "g-switch-handle", "g-switch-checked-content", "g-switch-unchecked-content", "g-switch-label", "g-switch-description"].every((item) => toggle.parts.includes(item)));
  assert.ok(["compact", "spacious", "reverse", "bordered", "card"].every((item) => row.variants.includes(item)));
  assert.equal(row.tag, "label");
  assert.ok(["default", "plain", "compact", "spacious", "reverse", "bordered", "card", "block"].every((item) => row.variants.includes(item)));
  assert.ok(["default", "normal", "unchecked", "checked", "success", "warning", "disabled", "loading", "read-only", "error", "invalid"].every((item) => row.states.includes(item)));
  assert.ok(["g-switch-row-content", "g-switch-row-title", "g-switch-row-description", "g-switch-row-meta", "g-switch-row-control", "g-switch-row-extra", "g-switch-row-status"].every((item) => row.parts.includes(item)));
});

test("choice-card-group directive metadata covers semantic rich-card selection", () => {
  const group = componentCatalog.find((item) => item.name === "choice-card-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "grid", "two", "three", "four", "single", "multiple", "compact", "spacious", "horizontal", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "empty", "selected", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-choice-group-legend", "g-choice-group-options", "g-choice-card", "g-choice-card-input", "g-choice-card-header", "g-choice-card-title", "g-choice-card-description", "g-choice-card-meta", "g-choice-card-price", "g-choice-group-feedback", "g-choice-group-status"].every((item) => group.parts.includes(item)));
});

test("name-group directive metadata covers international semantic name collection", () => {
  const group = componentCatalog.find((item) => item.name === "name-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "western", "eastern", "full", "compact", "spacious", "two", "three", "four", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-name-group-legend", "g-name-field", "g-name-given", "g-name-middle", "g-name-family", "g-name-phonetic", "g-name-preferred", "g-name-display", "g-name-group-feedback", "g-name-group-status"].every((item) => group.parts.includes(item)));
});

test("address-group directive metadata covers international semantic address collection", () => {
  const group = componentCatalog.find((item) => item.name === "address-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "domestic", "international", "stacked", "card", "compact", "spacious", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-address-group-legend", "g-address-field", "g-address-recipient", "g-address-line-1", "g-address-line-2", "g-address-country", "g-address-city", "g-address-region", "g-address-district", "g-address-postal", "g-address-group-feedback", "g-address-group-status"].every((item) => group.parts.includes(item)));
});

test("phone-group directive metadata covers international semantic telephone collection", () => {
  const group = componentCatalog.find((item) => item.name === "phone-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "domestic", "international", "stacked", "card", "compact", "spacious", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-phone-group-legend", "g-phone-field", "g-phone-country", "g-phone-country-code", "g-phone-national", "g-phone-extension", "g-phone-type", "g-phone-group-feedback", "g-phone-group-status", "g-phone-preview"].every((item) => group.parts.includes(item)));
});

test("money-group directive metadata covers localized semantic monetary collection", () => {
  const group = componentCatalog.find((item) => item.name === "money-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "domestic", "international", "accounting", "stacked", "card", "compact", "spacious", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-money-group-legend", "g-money-field", "g-money-currency", "g-money-amount", "g-money-control", "g-money-symbol", "g-money-tax", "g-money-exchange-rate", "g-money-converted", "g-money-group-feedback", "g-money-group-status"].every((item) => group.parts.includes(item)));
});

test("date-range-group directive metadata covers constrained semantic date ranges", () => {
  const group = componentCatalog.find((item) => item.name === "date-range-group");
  assert.equal(group.tag, "fieldset");
  assert.ok(["default", "date", "datetime", "inclusive", "exclusive", "stacked", "card", "compact", "spacious", "block"].every((item) => group.variants.includes(item)));
  assert.ok(["default", "normal", "partial", "complete", "success", "warning", "disabled", "read-only", "invalid", "error"].every((item) => group.states.includes(item)));
  assert.ok(["g-date-range-legend", "g-date-range-field", "g-date-range-start", "g-date-range-end", "g-range-separator", "g-date-range-presets", "g-date-range-duration", "g-date-range-feedback", "g-date-range-status"].every((item) => group.parts.includes(item)));
});

test("range-color directive metadata covers sliders, dual ranges, values, colors, and presets", () => {
  const control = componentCatalog.find((item) => item.name === "range-color");
  assert.equal(control.directiveName, "gRangeColor");
  assert.ok(["range", "color", "vertical", "mini", "small", "medium", "large", "show-stops", "with-input", "dual", "circle", "presets"].every((item) => control.variants.includes(item)));
  assert.ok(["error", "invalid", "disabled", "read-only"].every((item) => control.states.includes(item)));
  assert.ok(["g-range-field", "g-range-control", "g-range-marks", "g-range-dual-fill", "g-color-field", "g-color-input", "g-color-presets"].every((item) => control.parts.includes(item)));
});

test("file-drop directive metadata covers selection, validation, queues, and retries", () => {
  const upload = componentCatalog.find((item) => item.name === "file-drop");
  assert.equal(upload.directiveName, "gFileDrop");
  assert.deepEqual(upload.behaviors, ["dropzone"]);
  assert.ok(["dragger", "button", "compact", "picture-card", "avatar", "multiple", "directory", "manual", "with-list", "picture-list"].every((item) => upload.variants.includes(item)));
  assert.ok(["dragging", "validating", "uploading", "success", "error", "rejected", "disabled"].every((item) => upload.states.includes(item)));
  assert.ok(["g-file-drop-input", "g-file-drop-content", "g-file-drop-feedback", "g-file-drop-list", "g-file-drop-item", "g-file-drop-progress-bar", "g-file-drop-remove", "g-file-drop-retry"].every((item) => upload.parts.includes(item)));
});

test("upload-queue directive metadata covers progress, queue actions, and runtime management", () => {
  const upload = componentCatalog.find((item) => item.name === "upload-queue");
  assert.equal(upload.directiveName, "gUploadQueue");
  assert.equal(upload.type, "interactive");
  assert.deepEqual(upload.behaviors, ["upload-manager"]);
  assert.ok(["compact", "spacious", "bordered", "flat"].every((item) => upload.variants.includes(item)));
  assert.ok(["empty", "queued", "uploading", "paused", "success", "error", "mixed", "disabled"].every((item) => upload.states.includes(item)));
  assert.ok(["g-upload-queue-header", "g-upload-summary", "g-upload-input", "g-upload-list", "g-upload-empty", "g-upload-item", "g-upload-progress", "g-upload-actions"].every((item) => upload.parts.includes(item)));
});

test("combobox directive metadata covers editable, grouped, remote, creatable, and accessible suggestions", () => {
  const combo = componentCatalog.find((item) => item.name === "combobox");
  assert.equal(combo.directiveName, "gCombobox");
  assert.deepEqual(combo.behaviors, ["combobox"]);
  assert.ok(["filled", "outlined", "borderless", "underlined", "clearable", "grouped", "remote", "allow-create", "mini", "small", "medium", "large"].every((item) => combo.variants.includes(item)));
  assert.ok(["open", "searching", "loading", "empty", "has-value", "error", "disabled", "read-only"].every((item) => combo.states.includes(item)));
  assert.ok(["g-combobox-control", "g-combobox-input", "g-combobox-clear", "g-combobox-spinner", "g-combobox-status", "g-combobox-list", "g-combobox-group", "g-combobox-option", "g-combobox-create", "g-combobox-empty"].every((item) => combo.parts.includes(item)));
});

test("toast directive metadata covers message types, positions, actions, and lifecycle states", () => {
  const toast = componentCatalog.find((item) => item.name === "toast");
  assert.equal(toast.directiveName, "gToast");
  assert.ok(["top", "bottom", "compact", "spacious", "with-title", "closable", "with-action", "no-icon"].every((item) => toast.variants.includes(item)));
  assert.ok(["normal", "info", "success", "warning", "danger", "error", "loading", "paused", "leaving"].every((item) => toast.states.includes(item)));
  assert.ok(["g-toast-icon", "g-toast-content", "g-toast-title", "g-toast-message", "g-toast-action", "g-toast-close"].every((item) => toast.parts.includes(item)));
});

test("progress-meter directive metadata covers linear, radial, segmented, and measurement use", () => {
  const progress = componentCatalog.find((item) => item.name === "progress-meter");
  assert.equal(progress.directiveName, "gProgressMeter");
  assert.ok(["line", "circle", "dashboard", "steps", "meter", "mini", "large", "inside", "striped", "animated", "buffered", "with-success"].every((item) => progress.variants.includes(item)));
  assert.ok(["determinate", "indeterminate", "active", "success", "warning", "error", "paused", "disabled"].every((item) => progress.states.includes(item)));
  assert.ok(["g-progress-bar", "g-progress-buffer", "g-progress-success", "g-progress-step", "g-meter-segment"].every((item) => progress.parts.includes(item)));
});

test("empty-state directive metadata covers content, responsive layouts, and recovery scenarios", () => {
  const empty = componentCatalog.find((item) => item.name === "empty-state");
  assert.equal(empty.directiveName, "gEmptyState");
  assert.ok(["simple", "compact", "inline", "card", "full-page", "no-image"].every((item) => empty.variants.includes(item)));
  assert.ok(["no-data", "no-results", "first-use", "success", "error", "offline", "forbidden"].every((item) => empty.states.includes(item)));
  assert.ok(["g-empty-visual", "g-empty-content", "g-empty-title", "g-empty-description", "g-empty-actions"].every((item) => empty.parts.includes(item)));
});

test("spinner-skeleton directive metadata covers loading indicators and structural placeholders", () => {
  const loader = componentCatalog.find((item) => item.name === "spinner-skeleton");
  assert.equal(loader.directiveName, "gSpinnerSkeleton");
  assert.ok(["spinner", "dots", "pulse", "inline", "tip", "overlay", "fullscreen", "small", "large", "skeleton", "avatar", "button", "input", "image", "active", "static", "with-avatar", "card", "list"].every((item) => loader.variants.includes(item)));
  assert.ok(["loading", "paused", "loaded", "disabled"].every((item) => loader.states.includes(item)));
  assert.ok(["g-spinner-indicator", "g-spinner-dot", "g-spinner-content", "g-skeleton-avatar", "g-skeleton-title", "g-skeleton-row", "g-skeleton-list-item"].every((item) => loader.parts.includes(item)));
});

test("input directive metadata covers appearances, compositions, validation, and native semantics", () => {
  const input = componentCatalog.find((item) => item.name === "input");
  assert.equal(input.directiveName, "gInput");
  assert.ok(["filled", "outlined", "borderless", "underlined", "clearable", "prefix", "suffix", "prepend", "append", "group", "search", "search-button", "password", "word-limit", "mini", "small", "medium", "large"].every((item) => input.variants.includes(item)));
  assert.ok(["success", "warning", "error", "loading", "disabled", "read-only"].every((item) => input.states.includes(item)));
  assert.ok(["g-input-control", "g-input-clear", "g-input-spinner", "g-input-prepend", "g-input-append", "g-password-toggle", "g-character-count"].every((item) => input.parts.includes(item)));
});

test("textarea directive metadata covers appearances, limits, growth, resizing, and validation", () => {
  const textarea = componentCatalog.find((item) => item.name === "textarea");
  assert.equal(textarea.directiveName, "gTextarea");
  assert.ok(["filled", "outlined", "borderless", "underlined", "clearable", "word-limit", "auto-size", "resize-none", "resize-vertical", "resize-horizontal", "resize-both", "mini", "small", "medium", "large"].every((item) => textarea.variants.includes(item)));
  assert.ok(["success", "warning", "error", "invalid", "disabled", "read-only", "near-limit", "over-limit", "max-rows"].every((item) => textarea.states.includes(item)));
  assert.ok(["g-textarea-control", "g-textarea-clear", "g-character-count"].every((item) => textarea.parts.includes(item)));
});

test("select directive metadata covers native modes, composition, validation, and sizing", () => {
  const select = componentCatalog.find((item) => item.name === "select");
  assert.equal(select.directiveName, "gSelect");
  assert.equal(select.tag, "select");
  assert.ok(["filled", "outlined", "borderless", "underlined", "placeholder", "clearable", "with-prefix", "with-suffix", "multiple", "option-group", "auto-width", "block", "mini", "small", "medium", "large"].every((item) => select.variants.includes(item)));
  assert.ok(["default", "hover", "focus", "success", "warning", "error", "invalid", "disabled", "loading"].every((item) => select.states.includes(item)));
  assert.ok(["g-select-control", "g-select-prefix", "g-select-suffix", "g-select-arrow", "g-select-spinner", "g-select-clear"].every((item) => select.parts.includes(item)));
});

test("tree-select directive metadata covers hierarchy, searching, checked selection, and keyboard access", () => {
  const treeSelect = componentCatalog.find((item) => item.name === "tree-select");
  assert.equal(treeSelect.directiveName, "gTreeSelect");
  assert.ok(["filled", "outlined", "borderless", "underlined", "single", "multiple", "checkable", "searchable", "clearable", "cascade", "leaf-only", "parent-value", "with-header", "with-footer", "mini", "small", "medium", "large"].every((item) => treeSelect.variants.includes(item)));
  assert.ok(["default", "open", "searching", "empty", "success", "warning", "error", "invalid", "loading", "disabled"].every((item) => treeSelect.states.includes(item)));
  assert.ok(["g-picker-control", "g-picker-values", "g-picker-input", "g-picker-clear", "g-picker-arrow", "g-picker-panel", "g-tree-list", "g-tree-node", "g-tree-toggle", "g-tree-checkbox", "g-tree-node-label"].every((item) => treeSelect.parts.includes(item)));
  assert.deepEqual(treeSelect.behaviors, ["picker", "interaction"]);
});

test("password field directive metadata covers visibility, composition, validation, and secure-input needs", () => {
  const password = componentCatalog.find((item) => item.name === "password-field");
  assert.equal(password.directiveName, "gPasswordField");
  assert.ok(["filled", "outlined", "borderless", "underlined", "clearable", "no-toggle", "hide-on-blur", "with-prefix", "with-strength", "block", "mini", "small", "medium", "large"].every((item) => password.variants.includes(item)));
  assert.ok(["default", "hidden", "visible", "hover", "focus", "success", "warning", "error", "invalid", "disabled", "read-only", "caps-lock"].every((item) => password.states.includes(item)));
  assert.ok(["g-password-field-prefix", "g-password-field-input", "g-password-field-suffix", "g-password-field-action", "g-password-toggle", "g-password-toggle-icon", "g-password-clear", "g-password-field-caps"].every((item) => password.parts.includes(item)));
});

test("clearable field directive metadata covers field types, visibility, keyboard, validation, and sizing", () => {
  const clearable = componentCatalog.find((item) => item.name === "clearable-field");
  assert.equal(clearable.directiveName, "gClearableField");
  assert.ok(["filled", "outlined", "borderless", "underlined", "interaction", "always-visible", "clear-on-escape", "with-prefix", "with-suffix", "textarea", "select", "block", "mini", "small", "medium", "large"].every((item) => clearable.variants.includes(item)));
  assert.ok(["default", "empty", "has-value", "hover", "focus", "clearing", "cleared", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => clearable.states.includes(item)));
  assert.ok(["g-clearable-field-prefix", "g-clearable-field-control", "g-clearable-field-input", "g-clearable-field-suffix", "g-clearable-field-action", "g-clearable-field-icon", "g-input-clear", "g-textarea-clear"].every((item) => clearable.parts.includes(item)));
});

test("status-bar directive metadata covers shell layout, status, density, and positioning", () => {
  const statusBar = componentCatalog.find((item) => item.name === "status-bar");
  assert.equal(statusBar.directiveName, "gStatusBar");
  assert.ok(["primary", "subtle", "bordered", "elevated", "compact", "comfortable", "responsive", "scrollable", "sticky", "fixed", "contained"].every((item) => statusBar.variants.includes(item)));
  assert.ok(["normal", "info", "success", "warning", "danger", "error", "loading", "offline", "disabled"].every((item) => statusBar.states.includes(item)));
  assert.ok(["g-status-bar-section", "g-status-bar-item", "g-status-bar-icon", "g-status-bar-label", "g-status-bar-value", "g-status-bar-progress", "g-status-bar-live"].every((item) => statusBar.parts.includes(item)));
});

test("context-bar directive metadata covers content, actions, appearances, reflow, and feedback states", () => {
  const contextBar = componentCatalog.find((item) => item.name === "context-bar");
  assert.equal(contextBar.directiveName, "gContextBar");
  assert.ok(["soft", "outlined", "filled", "banner", "borderless", "center", "compact", "spacious", "stacked", "sticky", "dismissible", "no-icon", "with-title"].every((item) => contextBar.variants.includes(item)));
  assert.ok(["normal", "info", "success", "warning", "danger", "error", "loading", "disabled"].every((item) => contextBar.states.includes(item)));
  assert.ok(["g-context-bar-icon", "g-context-bar-body", "g-context-bar-title", "g-context-bar-description", "g-context-bar-actions", "g-context-bar-action", "g-context-bar-close", "g-context-bar-progress"].every((item) => contextBar.parts.includes(item)));
});

test("page-loading directive metadata covers page overlays, measurable progress, lifecycle, and recovery", () => {
  const loading = componentCatalog.find((item) => item.name === "page-loading");
  assert.equal(loading.directiveName, "gPageLoading");
  assert.ok(["inline", "contained", "card", "full", "overlay", "fullscreen", "dimmed", "compact", "small", "medium", "large", "delayed", "no-indicator"].every((item) => loading.variants.includes(item)));
  assert.ok(["loading", "determinate", "indeterminate", "paused", "stalled", "success", "error", "cancelled", "disabled", "hidden"].every((item) => loading.states.includes(item)));
  assert.ok(["g-page-loading-indicator", "g-page-loading-title", "g-page-loading-description", "g-page-loading-progress", "g-page-loading-step", "g-page-loading-actions", "g-page-loading-host", "g-page-loading-container"].every((item) => loading.parts.includes(item)));
});

test("page-state-system directive metadata covers results, exceptions, recovery, and responsive layouts", () => {
  const pageState = componentCatalog.find((item) => item.name === "page-state-system");
  assert.equal(pageState.directiveName, "gPageStateSystem");
  assert.ok(["empty", "no-results", "first-use", "success", "info", "warning", "error", "403", "404", "500", "offline", "maintenance", "browser-unsupported", "compact", "inline", "card", "full-page", "split", "left", "no-visual"].every((item) => pageState.variants.includes(item)));
  assert.ok(["normal", "success", "info", "warning", "error", "forbidden", "not-found", "server-error", "offline", "maintenance", "disabled"].every((item) => pageState.states.includes(item)));
  assert.ok(["g-page-state-body", "g-page-state-visual", "g-page-state-code", "g-page-state-title", "g-page-state-metadata", "g-page-state-details", "g-page-state-detail-summary", "g-page-state-actions", "g-page-state-primary-action", "g-page-state-suggestions"].every((item) => pageState.parts.includes(item)));
});

test("stable metadata records every root runtime and TypeScript contract", () => {
  assert.deepEqual(Object.keys(rootModule).sort(), api.moduleExports);
  assert.equal(api.moduleExports.length, 611);
  assert.equal(api.typeExports.length, 34);
  for(const type of ['GardenerimNavigationItem','GardenerimNavigationOptions','GardenerimNavigationChange','GardenerimNavigationInstance'])assert.ok(api.typeExports.includes(type));
  assert.equal(api.componentAttributes.length, 11);
  assert.ok(api.componentAttributes.includes('gardenerNavigation'));
  assert.equal(api.componentHandleMembers.length, 4);
  assert.equal(api.themeAxes.length, 10);
});

test("package root is SSR-safe and does not require global AngularJS", () => {
  const result = spawnSync(process.execPath, ["--input-type=module", "--eval", `import(${JSON.stringify(new URL("../dist/index.js", import.meta.url).href)}).then((m)=>console.log(m.GARDENERIM_ANGULARJS_MODULE))`], { encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /gardener/u);
});

test("AngularJS 1.8.2 and 1.8.3 execute the same compile contract", () => {
  for (const [packageName, version] of [["angular-1-8-2", "1.8.2"], ["angular", "1.8.3"]]) {
    const result = spawnSync(process.execPath, [resolve(root, "tests/angular-version-runner.mjs"), packageName], { cwd: root, encoding: "utf8", windowsHide: true });
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout.trim().split(/\r?\n/u).at(-1));
    assert.equal(output.version, version);
    assert.match(output.buttonClass, /g-btn-primary/u);
    assert.equal(output.value, "ready");
  }
});

test("form directive metadata covers semantic validation, responsive layouts, and field feedback", () => {
  const form = componentCatalog.find((item) => item.name === "form");
  const field = componentCatalog.find((item) => item.name === "field");
  const fieldset = componentCatalog.find((item) => item.name === "fieldset");
  assert.equal(form.directiveName, "gForm");
  assert.equal(form.tag, "form");
  assert.ok(["bordered", "vertical", "horizontal", "inline", "compact", "spacious"].every((item) => form.variants.includes(item)));
  assert.ok(["submitting", "validated", "success", "error", "disabled", "read-only"].every((item) => form.states.includes(item)));
  assert.ok(["g-form-header", "g-form-title", "g-form-body", "g-form-summary", "g-form-status", "g-form-actions"].every((item) => form.parts.includes(item)));
  assert.ok(["vertical", "horizontal", "inline", "compact", "spacious", "label-hidden", "required-mark", "optional-mark", "block"].every((item) => field.variants.includes(item)));
  assert.ok(["pristine", "dirty", "touched", "validating", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => field.states.includes(item)));
  assert.ok(["g-field-label-content", "g-field-label", "g-field-control", "g-field-prefix", "g-field-suffix", "g-field-actions", "g-field-action", "g-field-messages", "g-field-help", "g-field-feedback", "g-field-counter", "g-field-status"].every((item) => field.parts.includes(item)));
  assert.equal(fieldset.tag, "fieldset");
  assert.ok(["bordered", "subtle", "card", "plain", "compact", "spacious", "inline", "grid", "two-columns", "three-columns", "choice-cards", "block"].every((item) => fieldset.variants.includes(item)));
  assert.ok(["focus", "active", "complete", "success", "warning", "invalid", "error", "disabled", "read-only"].every((item) => fieldset.states.includes(item)));
  assert.ok(["g-fieldset-legend", "g-fieldset-legend-content", "g-fieldset-title", "g-fieldset-description", "g-fieldset-meta", "g-fieldset-badge", "g-fieldset-content", "g-fieldset-actions", "g-fieldset-help", "g-fieldset-feedback", "g-fieldset-status"].every((item) => fieldset.parts.includes(item)));
  const formRow = componentCatalog.find((item) => item.name === "form-row");
  assert.ok(["auto", "one", "two", "three", "four", "split", "sidebar-start", "sidebar-end", "compact", "spacious", "align-start", "align-center", "align-end", "align-baseline", "stretch", "dense", "block"].every((item) => formRow.variants.includes(item)));
  assert.ok(["invalid", "error", "disabled", "read-only"].every((item) => formRow.states.includes(item)));
  assert.ok(["g-form-row-item", "g-form-row-main", "g-form-row-aside", "g-form-row-actions", "g-form-row-divider", "g-form-row-span-2", "g-form-row-span-3", "g-form-row-span-full", "g-form-row-start-2", "g-form-row-start-3"].every((item) => formRow.parts.includes(item)));
  const formGrid = componentCatalog.find((item) => item.name === "form-grid");
  assert.ok(["auto", "one", "two", "three", "four", "six", "twelve", "compact", "spacious", "dense", "align-start", "align-center", "align-end", "stretch", "full-span", "block"].every((item) => formGrid.variants.includes(item)));
  assert.ok(["invalid", "error", "disabled", "read-only"].every((item) => formGrid.states.includes(item)));
  assert.ok(["g-form-grid-item", "g-form-grid-section", "g-form-grid-actions", "g-form-grid-divider", "g-form-grid-span-2", "g-form-grid-span-3", "g-form-grid-span-4", "g-form-grid-span-6", "g-form-grid-span-full", "g-form-grid-row-span-2", "g-form-grid-row-span-3", "g-form-grid-start-2", "g-form-grid-start-3", "g-form-grid-start-4"].every((item) => formGrid.parts.includes(item)));
  const horizontalForm = componentCatalog.find((item) => item.name === "horizontal-form");
  assert.equal(horizontalForm.directiveName, "gHorizontalForm");
  assert.ok(["label-sm", "label-md", "label-lg", "compact", "spacious", "label-start", "label-center", "label-end", "stacked", "bordered", "block"].every((item) => horizontalForm.variants.includes(item)));
  assert.ok(["invalid", "error", "success", "disabled", "read-only", "busy"].every((item) => horizontalForm.states.includes(item)));
  assert.ok(["g-form-horizontal-header", "g-form-horizontal-body", "g-form-horizontal-row", "g-form-horizontal-label", "g-form-horizontal-content", "g-form-horizontal-control", "g-form-horizontal-help", "g-form-horizontal-feedback", "g-form-horizontal-actions", "g-form-horizontal-divider"].every((item) => horizontalForm.parts.includes(item)));
  const inlineForm = componentCatalog.find((item) => item.name === "inline-form");
  assert.equal(inlineForm.directiveName, "gInlineForm");
  assert.ok(["wrap", "nowrap", "compact", "spacious", "align-start", "align-center", "align-end", "stretch", "field-sm", "field-md", "field-lg", "stacked", "bordered", "block"].every((item) => inlineForm.variants.includes(item)));
  assert.ok(["invalid", "error", "success", "disabled", "read-only", "busy", "submitted"].every((item) => inlineForm.states.includes(item)));
  assert.ok(["g-form-inline-field", "g-form-inline-field-grow", "g-form-inline-field-fixed", "g-form-inline-label", "g-form-inline-control", "g-form-inline-help", "g-form-inline-feedback", "g-form-inline-actions", "g-form-inline-status", "g-form-inline-divider"].every((item) => inlineForm.parts.includes(item)));
  const compactForm = componentCatalog.find((item) => item.name === "compact-form");
  assert.equal(compactForm.directiveName, "gCompactForm");
  assert.equal(compactForm.tag, "form");
  assert.ok(["vertical", "inline", "joined", "two-columns", "three-columns", "tight", "comfortable", "bordered", "subtle", "block"].every((item) => compactForm.variants.includes(item)));
  assert.ok(["invalid", "error", "success", "disabled", "read-only", "busy", "submitted"].every((item) => compactForm.states.includes(item)));
  assert.ok(["g-compact-form-header", "g-compact-form-body", "g-compact-form-field", "g-compact-form-label", "g-compact-form-control", "g-compact-form-help", "g-compact-form-feedback", "g-compact-form-actions", "g-compact-form-status", "g-compact-form-divider", "g-compact-form-span-full"].every((item) => compactForm.parts.includes(item)));
  const inputGroup = componentCatalog.find((item) => item.name === "input-group");
  assert.equal(inputGroup.directiveName, "gInputGroup");
  assert.ok(["joined", "separated", "stacked", "block", "compact", "responsive", "mini", "small", "medium", "large", "filled", "outlined", "borderless"].every((item) => inputGroup.variants.includes(item)));
  assert.ok(["focus", "success", "warning", "error", "invalid", "disabled", "read-only", "loading"].every((item) => inputGroup.states.includes(item)));
  assert.ok(["g-input-group-label", "g-input-group-control", "g-input-addon", "g-input-prepend", "g-input-append", "g-input-search-button", "g-input-group-divider", "g-input-group-help", "g-input-group-feedback", "g-input-group-status"].every((item) => inputGroup.parts.includes(item)));
  const inputAffix = componentCatalog.find((item) => item.name === "input-affix");
  assert.equal(inputAffix.directiveName, "gInputAffix");
  assert.ok(["default", "filled", "outlined", "borderless", "underlined", "block", "compact", "mini", "small", "medium", "large", "prefix", "suffix", "clearable", "loading"].every((item) => inputAffix.variants.includes(item)));
  assert.ok(["default", "hover", "focus", "success", "warning", "error", "invalid", "loading", "disabled", "read-only"].every((item) => inputAffix.states.includes(item)));
  assert.ok(["g-input-affix-label", "g-input-affix-control", "g-input-affix-start", "g-input-affix-end", "g-input-prefix", "g-input-suffix", "g-input-affix-action", "g-input-clear", "g-input-spinner", "g-input-affix-help", "g-input-affix-feedback", "g-input-affix-status"].every((item) => inputAffix.parts.includes(item)));
  const searchField = componentCatalog.find((item) => item.name === "search-field");
  assert.equal(searchField.directiveName, "gSearchField");
  assert.ok(["default", "icon", "button", "custom-button", "clearable", "responsive", "block", "compact", "filled", "outlined", "borderless", "underlined", "mini", "small", "medium", "large"].every((item) => searchField.variants.includes(item)));
  assert.ok(["default", "hover", "focus", "searching", "loading", "empty", "results", "success", "warning", "error", "invalid", "disabled", "read-only"].every((item) => searchField.states.includes(item)));
  assert.ok(["g-search-field-label", "g-search-field-control", "g-search-field-input-wrap", "g-search-field-icon", "g-search-field-input", "g-search-field-clear", "g-search-field-action", "g-search-field-spinner", "g-search-field-shortcut", "g-search-field-help", "g-search-field-feedback", "g-search-field-status", "g-search-field-result-count"].every((item) => searchField.parts.includes(item)));
  const characterCounter = componentCatalog.find((item) => item.name === "character-counter");
  assert.equal(characterCounter.directiveName, "gCharacterCounter");
  assert.deepEqual(characterCounter.behaviors, ["character-count"]);
  assert.ok(["default", "textarea", "input", "inline", "block", "compact", "count", "remaining", "soft-limit", "hard-limit", "mini", "small", "medium", "large"].every((item) => characterCounter.variants.includes(item)));
  assert.ok(["default", "empty", "typing", "near-limit", "at-limit", "over-limit", "invalid", "disabled", "read-only"].every((item) => characterCounter.states.includes(item)));
  assert.ok(["g-character-field-label", "g-character-field-control", "g-character-field-input", "g-character-count", "g-character-count-current", "g-character-count-separator", "g-character-count-maximum", "g-character-field-help", "g-character-field-feedback", "g-character-field-status"].every((item) => characterCounter.parts.includes(item)));
  const validationState = componentCatalog.find((item) => item.name === "validation-state");
  assert.equal(validationState.directiveName, "gValidationState");
  assert.ok(["default", "block", "inline", "with-icon", "reserve-message", "compact", "mini", "small", "medium", "large"].every((item) => validationState.variants.includes(item)));
  assert.ok(["default", "focus", "success", "warning", "danger", "error", "invalid", "validating", "disabled", "read-only"].every((item) => validationState.states.includes(item)));
  assert.ok(["g-validation-label", "g-validation-required", "g-validation-control", "g-validation-input", "g-validation-icon", "g-validation-message", "g-validation-help", "g-validation-status"].every((item) => validationState.parts.includes(item)));
});

test("form-section directive metadata covers grouping, native disclosure, status, nesting, and validation", () => {
  const section = componentCatalog.find((item) => item.name === "form-section");
  assert.equal(section.directiveName, "gFormSection");
  assert.ok(["divided", "bordered", "card", "subtle", "compact", "spacious", "numbered", "nested", "collapsible", "no-divider"].every((item) => section.variants.includes(item)));
  assert.ok(["active", "complete", "error", "invalid", "disabled", "collapsed", "expanded"].every((item) => section.states.includes(item)));
  assert.ok(["g-form-section-header", "g-form-section-heading", "g-form-section-number", "g-form-section-title", "g-form-section-actions", "g-form-section-toggle", "g-form-section-body", "g-form-section-summary", "g-form-section-footer"].every((item) => section.parts.includes(item)));
});
