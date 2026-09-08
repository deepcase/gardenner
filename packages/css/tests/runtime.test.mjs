import assert from "node:assert/strict";
import { after, test } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { NativeMutationObserver, accordionFixture, browserWindow, mountBehaviorFixtures, settleMutations } from "./runtime-fixtures.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf8"));
const publicApi = JSON.parse(readFileSync(resolve(projectRoot, "metadata/public-api.json"), "utf8"));
const runtime = await import("../src/js/index.js");
const localeCatalog = await import("../src/js/locales.js");

await Promise.resolve();
Object.defineProperty(globalThis, "MutationObserver", { configurable: true, writable: true, value: NativeMutationObserver });
mountBehaviorFixtures();

test("runtime catalog exposes the complete current package contract", () => {
  assert.equal(runtime.Gardenerim.version, pkg.version);
  assert.equal(publicApi.contractVersion, pkg.version);
  assert.equal(publicApi.javascript.behaviorContracts.length, 96);
  assert.deepEqual([...runtime.Gardenerim.behaviors], publicApi.javascript.behaviors);
});

test("runtime locale catalogs are complete and unsupported locales fall back to English", () => {
  const expectedKeys = Object.keys(localeCatalog.gardenerimLocales.en).sort();
  assert.deepEqual([...runtime.supportedLocales], ["en", "zh-CN", "ja", "ko", "es", "fr", "de"]);
  for (const [locale, messages] of Object.entries(localeCatalog.gardenerimLocales)) {
    assert.deepEqual(Object.keys(messages).sort(), expectedKeys, `${locale} message keys differ from English`);
  }
  const root = document.createElement("div");
  root.dataset.gPasswordToggle = "";
  root.innerHTML = '<input type="password"><button type="button" data-g-password-button></button>';
  document.body.append(root);
  runtime.configure({ locale: "unsupported", root });
  assert.equal(runtime.Gardenerim.locale, "en");
  assert.equal(root.querySelector("button").getAttribute("aria-label"), "Show password");
  runtime.configure({ locale: "zh-CN", root });
  assert.equal(root.querySelector("button").getAttribute("aria-label"), "显示密码");
  runtime.configure({ locale: "en", messages: { "password.show": "Reveal secret" }, root });
  assert.equal(root.querySelector("button").getAttribute("aria-label"), "Reveal secret");
  runtime.configure({ locale: "en", messages: {}, root });
  root.remove();
});

test("runtime source keeps user-facing copy in locale catalogs", () => {
  const source = readFileSync(resolve(projectRoot, "src/js/index.js"), "utf8");
  assert.doesNotMatch(source, /[\u3400-\u9fff]/u);
});

test("auto-resize textarea respects minimum and maximum row boundaries", () => {
  const textarea = document.createElement("textarea");
  textarea.className = "g-textarea g-textarea-auto-size";
  textarea.dataset.gAutoResize = "";
  textarea.dataset.gMinRows = "2";
  textarea.dataset.gMaxRows = "3";
  textarea.rows = 2;
  let scrollHeight = 500;
  Object.defineProperty(textarea, "scrollHeight", { configurable: true, get: () => scrollHeight });
  document.body.append(textarea);
  runtime.init(textarea);
  const instance = runtime.getInstance(textarea, "auto-resize");
  assert.ok(instance);
  assert.equal(textarea.classList.contains("is-max-rows"), true);
  assert.equal(textarea.style.overflowY, "auto");
  assert.ok(Number.parseFloat(textarea.style.height) > 0);
  scrollHeight = 1;
  textarea.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(textarea.classList.contains("is-max-rows"), false);
  assert.equal(textarea.style.overflowY, "hidden");
  assert.ok(Number.parseFloat(textarea.style.height) > scrollHeight);
  runtime.destroy(textarea);
  textarea.remove();
});

test("character counter tracks graphemes, remaining mode, dynamic limits, and hard truncation", async () => {
  const root = document.createElement("div");
  root.dataset.gCharacterCount = "4";
  root.dataset.gCharacterWarning = ".5";
  root.innerHTML = '<textarea>👨‍👩‍👧‍👦a</textarea><output class="g-character-count" aria-live="polite"></output>';
  document.body.append(root);
  const input = root.querySelector("textarea");
  const output = root.querySelector("output");
  const events = [];
  root.addEventListener("gardener:count", (event) => events.push(event.detail));

  runtime.init(root);
  const instance = runtime.getInstance(root, "character-count");
  assert.ok(instance);
  assert.equal(output.textContent, "2 / 4");
  assert.equal(root.classList.contains("is-near-limit"), true);
  assert.equal(events.at(-1).count, 2);

  root.dataset.gCharacterMode = "remaining";
  await settleMutations();
  assert.equal(output.textContent, "2");
  assert.equal(output.dataset.gCharacterRemaining, "2");

  input.value = "abcde";
  input.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(root.classList.contains("is-over-limit"), true);
  assert.equal(input.getAttribute("aria-invalid"), "true");

  root.dataset.gCharacterHardLimit = "";
  input.value = "👨‍👩‍👧‍👦abcde";
  input.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(input.value, "👨‍👩‍👧‍👦abc");
  assert.equal(output.textContent, "0");
  assert.equal(root.classList.contains("is-at-limit"), true);
  assert.equal(input.hasAttribute("aria-invalid"), false);
  assert.equal(events.at(-1).reason, "input");
  assert.equal(events.at(-1).atLimit, true);

  root.dataset.gCharacterCount = "2";
  await settleMutations();
  assert.equal(input.value, "👨‍👩‍👧‍👦a");
  assert.equal(output.dataset.gCharacterCurrent, "2");
  runtime.destroy(root);
  root.remove();
});

test("autosave status handles dirty, asynchronous save, timestamp, failure, retry, and disabled lifecycles", async () => {
  const form = document.createElement("form");
  form.id = "autosave-runtime-scope";
  form.innerHTML = `
    <input name="title" value="Draft">
    <div class="g-autosave-status" data-g-autosave data-g-autosave-scope="#autosave-runtime-scope" data-g-autosave-delay="150" data-g-autosave-state="saved">
      <span class="g-autosave-status-indicator" aria-hidden="true"></span>
      <span class="g-autosave-status-label" data-g-autosave-label></span>
      <time class="g-autosave-status-time" data-g-autosave-time></time>
      <button type="button" class="g-autosave-status-retry" data-g-autosave-retry>Retry</button>
    </div>`;
  document.body.append(form);
  const status = form.querySelector(".g-autosave-status");
  const input = form.querySelector("input");
  const stateEvents = [];
  let resolveRequest;
  status.addEventListener("gardener:autosavestate", (event) => stateEvents.push(event.detail));
  status.addEventListener("gardener:autosaverequest", (event) => {
    event.detail.respondWith(new Promise((resolve) => { resolveRequest = resolve; }));
  });

  runtime.init(status);
  const instance = runtime.getInstance(status, "autosave");
  assert.ok(instance);
  assert.equal(instance.state(), "saved");
  assert.ok(status.classList.contains("is-saved"));
  assert.ok(status.querySelector("time").getAttribute("datetime"));
  assert.equal(status.querySelector("[data-g-autosave-label]").getAttribute("role"), "status");

  input.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(instance.state(), "dirty");
  assert.ok(status.classList.contains("is-dirty"));
  await new Promise((resolve) => setTimeout(resolve, 180));
  assert.equal(instance.state(), "saving");
  assert.equal(status.getAttribute("aria-busy"), "true");
  resolveRequest();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(instance.state(), "saved");
  assert.equal(status.getAttribute("aria-busy"), "false");

  instance.fail();
  assert.equal(instance.state(), "error");
  assert.ok(status.classList.contains("is-error"));
  assert.equal(status.querySelector("[data-g-autosave-retry]").disabled, false);
  instance.offline();
  assert.equal(instance.state(), "offline");
  assert.equal(status.querySelector("[data-g-autosave-retry]").disabled, true);
  instance.disable();
  assert.equal(status.getAttribute("aria-disabled"), "true");
  instance.enable();
  assert.equal(instance.state(), "idle");
  assert.equal(status.hasAttribute("aria-disabled"), false);
  assert.ok(stateEvents.some(({ state }) => state === "dirty"));
  assert.ok(stateEvents.some(({ state }) => state === "saving"));
  assert.ok(stateEvents.some(({ state }) => state === "error"));
  runtime.destroy(status);
  form.remove();
});

test("conditional fields resolve scoped controllers, synchronize states, and protect hidden form values", async () => {
  const outside = document.createElement("form");
  outside.innerHTML = '<select class="delivery-method"><option value="pickup" selected>Pickup</option></select>';
  const form = document.createElement("form");
  form.innerHTML = `
    <select class="delivery-method" aria-controls="existing-help">
      <option value="pickup">Pickup</option>
      <option value="shipping" selected>Shipping</option>
    </select>
    <div class="g-conditional-field" data-g-conditional-field data-g-controller=".delivery-method" data-g-show-when="shipping">
      <input name="address" required>
      <input name="locked" disabled>
    </div>
  `;
  document.body.append(outside, form);
  const controller = form.querySelector("select");
  const field = form.querySelector("[data-g-conditional-field]");
  const [address, locked] = field.querySelectorAll("input");
  const changes = [];
  field.addEventListener("gardener:change", (event) => changes.push(event.detail));

  runtime.init(field);
  const instance = runtime.getInstance(field, "conditional-field");
  assert.ok(instance);
  assert.equal(instance.isResolved(), true);
  assert.equal(instance.isVisible(), true);
  assert.equal(instance.value(), "shipping");
  assert.deepEqual(instance.values(), ["shipping"]);
  assert.deepEqual(instance.controllers(), [controller]);
  assert.equal(field.dataset.gState, "visible");
  assert.equal(field.classList.contains("is-visible"), true);
  assert.equal(controller.getAttribute("aria-controls"), `existing-help ${field.id}`);
  assert.equal(address.disabled, false);
  assert.equal(changes.at(-1).reason, "init");

  controller.value = "pickup";
  controller.dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(field.hidden, true);
  assert.equal(field.hasAttribute("inert"), true);
  assert.equal(field.getAttribute("aria-hidden"), "true");
  assert.equal(field.dataset.gState, "hidden");
  assert.equal(address.disabled, true);
  assert.equal(locked.disabled, true);
  assert.equal(changes.at(-1).reason, "change");

  controller.value = "shipping";
  controller.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(field.hidden, false);
  assert.equal(field.hasAttribute("inert"), false);
  assert.equal(address.disabled, false);
  assert.equal(locked.disabled, true);
  assert.equal(changes.at(-1).reason, "input");

  controller.value = "pickup";
  controller.dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(field.hidden, true);
  form.reset();
  await Promise.resolve();
  assert.equal(controller.value, "shipping");
  assert.equal(field.hidden, false);
  assert.equal(changes.at(-1).reason, "reset");

  runtime.destroy(field);
  assert.equal(field.hasAttribute("id"), false);
  assert.equal(field.hasAttribute("data-g-state"), false);
  assert.equal(field.hasAttribute("aria-hidden"), false);
  assert.equal(field.classList.contains("is-visible"), false);
  assert.equal(controller.getAttribute("aria-controls"), "existing-help");
  outside.remove();
  form.remove();
});

test("conditional fields handle unresolved configuration, radio groups, and multi-value matching", () => {
  const unresolved = document.createElement("div");
  unresolved.dataset.gConditionalField = "";
  unresolved.hidden = true;
  document.body.append(unresolved);
  runtime.init(unresolved);
  const unresolvedInstance = runtime.getInstance(unresolved, "conditional-field");
  assert.ok(unresolvedInstance);
  assert.equal(unresolvedInstance.isResolved(), false);
  assert.equal(unresolved.hidden, false);
  assert.equal(unresolved.dataset.gState, "unresolved");
  assert.equal(unresolved.classList.contains("is-unresolved"), true);

  const root = document.createElement("div");
  root.dataset.gConditionalScope = "";
  root.innerHTML = `
    <input type="radio" name="audience" value="personal">
    <input type="radio" name="audience" value="business">
    <div data-g-conditional-field data-g-controller="[name='audience']" data-g-show-when="business"><input name="company"></div>
    <label><input class="channel" type="checkbox" value="email" checked>Email</label>
    <label><input class="channel" type="checkbox" value="sms">SMS</label>
    <div data-g-conditional-field data-g-controller=".channel" data-g-show-when="email,sms" data-g-match="all"><input name="phone"></div>
  `;
  document.body.append(root);
  runtime.init(root);
  const [radioField, checkboxField] = root.querySelectorAll("[data-g-conditional-field]");
  assert.equal(radioField.hidden, true, "an unchecked radio group must not use the first option value");
  assert.equal(checkboxField.hidden, true);
  root.querySelector("[value='business']").checked = true;
  root.querySelector("[value='business']").dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(radioField.hidden, false);
  root.querySelector("[value='sms']").checked = true;
  root.querySelector("[value='sms']").dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(checkboxField.hidden, false);
  assert.deepEqual(runtime.getInstance(checkboxField, "conditional-field").values(), ["email", "sms"]);

  runtime.destroy(unresolved);
  assert.equal(unresolved.hidden, true);
  runtime.destroy(root);
  unresolved.remove();
  root.remove();
});

test("checkbox groups reuse row selection for select-all, indeterminate, counts, disabled options, and events", () => {
  const root = document.createElement("fieldset");
  root.dataset.gRowSelect = "";
  root.className = "g-check-group";
  root.innerHTML = `
    <label><input type="checkbox" data-g-select-all>All</label>
    <label data-g-selectable-row><input type="checkbox" data-g-select-row value="read" checked>Read</label>
    <label data-g-selectable-row><input type="checkbox" data-g-select-row value="edit">Edit</label>
    <label data-g-selectable-row><input type="checkbox" data-g-select-row value="admin" checked disabled>Admin</label>
    <output data-g-selection-count></output>
  `;
  document.body.append(root);
  const events = [];
  root.addEventListener("gardener:selectionchange", (event) => events.push(event.detail));
  runtime.init(root);
  const master = root.querySelector("[data-g-select-all]");
  const enabled = [...root.querySelectorAll("[data-g-select-row]")].filter((item) => !item.disabled);
  assert.equal(master.checked, false);
  assert.equal(master.indeterminate, true);
  assert.equal(root.querySelector("[data-g-selection-count]").textContent, "1");
  master.checked = true;
  master.dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(enabled.every((item) => item.checked), true);
  assert.deepEqual(events.at(-1).selected, ["read", "edit"]);
  assert.equal(events.at(-1).reason, "all");
  assert.equal(root.querySelector("[data-g-selection-count]").textContent, "2");
  runtime.destroy(root);
  root.remove();
});

test("password field manages visibility, selection, escape, blur, caps lock, and accessibility", () => {
  const root = document.createElement("div");
  root.dataset.gPasswordToggle = "";
  root.dataset.gDefaultVisible = "";
  root.dataset.gHideOnBlur = "";
  root.innerHTML = `
    <input id="account-password" type="password" value="secret value">
    <button type="button" data-g-password-button></button>
    <span data-g-caps-lock hidden>Caps Lock</span>
  `;
  document.body.append(root);
  const input = root.querySelector("input");
  const button = root.querySelector("button");
  const caps = root.querySelector("[data-g-caps-lock]");
  const changes = [];
  root.addEventListener("gardener:visibilitychange", (event) => changes.push(event.detail));

  runtime.init(root);
  assert.equal(input.type, "text");
  assert.equal(root.classList.contains("is-visible"), true);
  assert.equal(button.getAttribute("aria-pressed"), "true");
  assert.equal(button.getAttribute("aria-controls"), input.id);
  assert.equal(caps.hidden, true);

  input.focus();
  input.setSelectionRange(2, 6);
  button.click();
  assert.equal(input.type, "password");
  assert.equal(document.activeElement, input);
  assert.equal(input.selectionStart, 2);
  assert.equal(input.selectionEnd, 6);
  assert.equal(changes.at(-1).visible, false);

  button.click();
  input.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  assert.equal(input.type, "password");
  assert.equal(changes.at(-1).reason, "escape");

  const capsEvent = new browserWindow.KeyboardEvent("keyup", { key: "A", bubbles: true });
  Object.defineProperty(capsEvent, "getModifierState", { value: (key) => key === "CapsLock" });
  input.dispatchEvent(capsEvent);
  assert.equal(root.classList.contains("is-caps-lock"), true);
  assert.equal(caps.hidden, false);

  button.click();
  root.dispatchEvent(new browserWindow.FocusEvent("focusout", { bubbles: true, relatedTarget: document.body }));
  assert.equal(input.type, "password");
  assert.equal(changes.at(-1).reason, "blur");

  runtime.destroy(root);
  root.remove();
});

test("pin input normalizes, advances, pastes, navigates, completes, clears, and resets", async () => {
  const form = document.createElement("form");
  form.innerHTML = `
    <div class="g-pin-input g-pin-input-boxed" data-g-otp-input data-g-pin-input-mode="numeric">
      <span class="g-pin-input-label">Verification code</span>
      <div class="g-pin-input-cells">
        ${Array.from({ length: 6 }, () => '<input class="g-pin-input-cell" data-g-pin-input-cell>').join("")}
      </div>
      <input type="hidden" name="code" data-g-pin-input-output>
      <span class="g-pin-input-status" data-g-pin-input-status role="status"></span>
      <button class="g-pin-input-clear" data-g-pin-input-clear>Clear</button>
    </div>
  `;
  document.body.append(form);
  const root = form.querySelector(".g-pin-input");
  const cells = [...root.querySelectorAll("[data-g-pin-input-cell]")];
  const changes = [];
  const completions = [];
  root.addEventListener("gardener:otpchange", (event) => changes.push(event.detail));
  root.addEventListener("gardener:otpcomplete", (event) => completions.push(event.detail));
  runtime.init(root);
  const instance = runtime.getInstance(root, "otp-input");

  assert.ok(instance);
  assert.equal(root.getAttribute("role"), "group");
  assert.ok(root.classList.contains("is-empty"));
  assert.equal(cells[0].autocomplete, "one-time-code");
  assert.equal(cells[1].autocomplete, "off");
  assert.equal(cells.every((cell) => cell.maxLength === 1 && cell.inputMode === "numeric"), true);
  assert.equal(root.querySelector("[data-g-pin-input-clear]").disabled, true);

  cells[0].value = "１２";
  cells[0].dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  await new Promise((resolve) => queueMicrotask(resolve));
  assert.equal(cells[0].value, "1");
  assert.equal(cells[1].value, "2");
  assert.equal(document.activeElement, cells[2]);
  assert.equal(instance.value(), "12");
  assert.equal(root.dataset.gFilled, "2");
  assert.ok(root.classList.contains("is-partial"));
  assert.match(root.querySelector("[data-g-pin-input-status]").textContent, /2.*6/u);

  const paste = new browserWindow.Event("paste", { bubbles: true, cancelable: true });
  Object.defineProperty(paste, "clipboardData", { value: { getData: () => "34-56" } });
  cells[2].dispatchEvent(paste);
  assert.equal(instance.value(), "123456");
  assert.equal(root.querySelector("[data-g-pin-input-output]").value, "123456");
  assert.ok(root.classList.contains("is-complete"));
  assert.equal(completions.length, 1);
  instance.value();
  assert.equal(completions.length, 1, "reading the value must not emit completion again");

  cells[5].dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Delete", bubbles: true, cancelable: true }));
  assert.equal(instance.value(), "12345");
  assert.ok(root.classList.contains("is-partial"));
  cells[5].dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true }));
  assert.equal(instance.value(), "1234");
  assert.equal(document.activeElement, cells[4]);
  cells[4].dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, cells[0]);
  cells[0].dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, cells[5]);

  root.querySelector("[data-g-pin-input-clear]").click();
  assert.equal(instance.value(), "");
  assert.ok(root.classList.contains("is-empty"));
  instance.fill("987654");
  form.reset();
  await new Promise((resolve) => queueMicrotask(resolve));
  assert.equal(instance.value(), "");
  assert.equal(changes.at(-1).reason, "reset");

  runtime.destroy(root);
  form.remove();
});

test("pin input supports alphanumeric codes and guards read-only controls", () => {
  const root = document.createElement("div");
  root.className = "g-pin-input is-read-only";
  root.dataset.gOtpInput = "";
  root.dataset.gPinInputMode = "alphanumeric";
  root.dataset.gPinInputCase = "upper";
  root.innerHTML = `${Array.from({ length: 4 }, () => '<input class="g-pin-input-cell" data-g-pin-input-cell readonly>').join("")}<button data-g-pin-input-clear>Clear</button>`;
  document.body.append(root);
  runtime.init(root);
  const instance = runtime.getInstance(root, "otp-input");
  assert.equal(instance.fill("a-2文!"), "A2文");
  assert.equal(instance.value(), "A2文");
  assert.equal(root.hasAttribute("aria-readonly"), false);
  assert.ok([...root.querySelectorAll("input")].every(cell => cell.readOnly));
  assert.equal(root.querySelector("button").disabled, true);
  root.querySelector("button").click();
  assert.equal(instance.value(), "A2文");
  runtime.destroy(root);
  root.remove();
});

test("rating supports half-star pointer selection, keyboard control, clear, output, and form reset", async () => {
  const form = document.createElement("form");
  form.innerHTML = `<div class="g-rating g-rating-half g-rating-clearable" data-g-rating data-g-rating-value="2.5" data-g-rating-step="0.5" data-g-rating-allow-clear aria-label="Experience rating">
    <div class="g-rating-items">${Array.from({ length: 5 }, (_, index) => `<button class="g-rating-item" data-g-rating-item data-g-value="${index + 1}"></button>`).join("")}</div>
    <input type="hidden" data-g-rating-output name="rating"><span data-g-rating-status role="status"></span><span data-g-rating-value-label></span><button type="button" data-g-rating-clear>Clear</button>
  </div>`;
  document.body.append(form);
  const root = form.querySelector("[data-g-rating]");
  const changes = [];
  root.addEventListener("gardener:ratingchange", (event) => changes.push(event.detail));
  runtime.init(root);
  const instance = runtime.getInstance(root, "rating");
  const items = [...root.querySelectorAll("[data-g-rating-item]")];
  items.forEach((item) => { item.getBoundingClientRect = () => ({ left: 0, right: 40, top: 0, bottom: 40, width: 40, height: 40, x: 0, y: 0, toJSON() {} }); });

  assert.equal(root.getAttribute("role"), "radiogroup");
  assert.equal(instance.value(), 2.5);
  assert.equal(root.querySelector("[data-g-rating-output]").value, "2.5");
  assert.equal(items.filter((item) => item.classList.contains("is-filled")).length, 2);
  assert.equal(items[2].classList.contains("is-half"), true);
  assert.equal(items[2].getAttribute("aria-checked"), "true");
  assert.equal(items[2].tabIndex, 0);
  assert.ok(items[0].getAttribute("aria-label"));

  items[3].dispatchEvent(new browserWindow.PointerEvent("pointermove", { bubbles: true, clientX: 10 }));
  assert.equal(root.classList.contains("is-previewing"), true);
  assert.equal(root.dataset.gRatingPreview, "3.5");
  items[3].dispatchEvent(new browserWindow.MouseEvent("click", { bubbles: true, clientX: 10 }));
  assert.equal(instance.value(), 3.5);
  assert.equal(changes.at(-1).reason, "pointer");
  assert.equal(root.querySelector("[data-g-rating-value-label]").textContent, "3.5 / 5");

  items[3].focus();
  items[3].dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  assert.equal(instance.value(), 4);
  items[3].dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
  assert.equal(instance.value(), 5);
  assert.equal(root.classList.contains("is-complete"), true);
  items[4].dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
  assert.equal(instance.value(), 0);
  assert.equal(root.classList.contains("is-empty"), true);

  instance.setValue(4.5);
  root.querySelector("[data-g-rating-clear]").click();
  assert.equal(instance.value(), 0);
  instance.setValue(1.5);
  form.reset();
  await new Promise((resolve) => queueMicrotask(resolve));
  assert.equal(instance.value(), 2.5);
  assert.equal(changes.at(-1).reason, "reset");

  root.setAttribute("aria-readonly", "true");
  instance.refresh();
  items[4].click();
  assert.equal(instance.value(), 2.5);
  assert.equal(root.querySelector("[data-g-rating-clear]").disabled, true);
  runtime.destroy(root);
  form.remove();
});

test("validation summary collects native and custom errors, updates live, blocks submit, and focuses fields", async () => {
  const form = document.createElement("form");
  form.innerHTML = `<aside class="g-validation-summary" data-g-validation-summary data-g-validation-mode="live">
    <span class="g-validation-summary-icon"></span><div class="g-validation-summary-content"><strong class="g-validation-summary-title" data-g-validation-title-auto></strong><span data-g-validation-count></span><ul data-g-validation-list></ul><span data-g-validation-status></span></div>
  </aside>
  <label for="summary-project">Project name</label><input id="summary-project" name="project" required data-g-validation-message="Enter a project name">
  <label for="summary-email">Email</label><input id="summary-email" name="email" type="email" value="invalid" required aria-errormessage="summary-email-error">
  <span id="summary-email-error" data-g-validation-for="summary-email">Enter a valid email address</span>
  <div id="summary-agreement-group" aria-invalid="true" aria-label="Agreement"><label><input id="summary-agreement" type="checkbox" required data-g-validation-message="Accept the agreement">Agreement</label></div>
  <button type="submit">Submit</button>`;
  document.body.append(form);
  const root = form.querySelector("[data-g-validation-summary]");
  const changes = [];
  const navigations = [];
  let blocked = 0;
  root.addEventListener("gardener:validationchange", (event) => changes.push(event.detail));
  root.addEventListener("gardener:validationnavigate", (event) => navigations.push(event.detail));
  root.addEventListener("gardener:validationblocked", () => { blocked += 1; });
  runtime.init(root);
  const instance = runtime.getInstance(root, "validation-summary");

  assert.ok(instance);
  assert.equal(instance.errors().length, 3);
  assert.equal(root.dataset.gValidationCount, "3");
  assert.equal(root.classList.contains("is-invalid"), true);
  assert.equal(root.getAttribute("role"), "alert");
  assert.equal(root.querySelectorAll(".g-validation-summary-item").length, 3);
  assert.match(root.querySelector(".g-validation-summary-title").textContent, /3/u);
  assert.equal(root.querySelectorAll("[data-g-validation-target='summary-agreement']").length, 1);

  root.querySelector("[data-g-validation-target='summary-email']").click();
  assert.equal(document.activeElement.id, "summary-email");
  assert.equal(navigations.at(-1).targetId, "summary-email");

  const submit = new browserWindow.SubmitEvent("submit", { bubbles: true, cancelable: true });
  assert.equal(form.dispatchEvent(submit), false);
  await Promise.resolve();
  assert.equal(blocked, 1);
  assert.equal(document.activeElement, root);
  assert.equal(root.getAttribute("aria-live"), "assertive");

  const project = form.querySelector("#summary-project");
  const email = form.querySelector("#summary-email");
  project.value = "Gardenerim";
  project.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  email.value = "team@gardener.im";
  form.querySelector("[data-g-validation-for]").hidden = true;
  email.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  const agreement = form.querySelector("#summary-agreement");
  agreement.checked = true;
  form.querySelector("#summary-agreement-group").setAttribute("aria-invalid", "false");
  agreement.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(instance.errors().length, 0);
  assert.equal(root.hidden, true);
  assert.equal(root.classList.contains("is-valid"), true);
  assert.equal(project.hasAttribute("data-g-validation-summary-invalid"), false);
  assert.equal(changes.at(-1).valid, true);

  runtime.destroy(root);
  form.remove();
});

test("clearable field synchronizes value state, native events, focus, escape, and select values", () => {
  const root = document.createElement("div");
  root.dataset.gClearInput = "";
  root.dataset.gClearOnEscape = "";
  root.innerHTML = '<input id="clearable-name" value="Garden"><button data-g-clear-button></button>';
  document.body.append(root);
  const input = root.querySelector("input");
  const button = root.querySelector("button");
  const events = [];
  input.addEventListener("input", () => events.push("input"));
  input.addEventListener("change", () => events.push("change"));
  root.addEventListener("gardener:clear", (event) => events.push(event.detail));

  runtime.init(root);
  const instance = runtime.getInstance(root, "clear-input");
  assert.ok(instance);
  assert.equal(root.classList.contains("has-value"), true);
  assert.equal(button.hidden, false);
  assert.equal(button.type, "button");
  assert.equal(button.getAttribute("aria-controls"), input.id);
  assert.ok(button.getAttribute("aria-label"));

  input.focus();
  input.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  assert.equal(input.value, "");
  assert.equal(document.activeElement, input);
  assert.equal(root.classList.contains("is-empty"), true);
  assert.equal(button.hidden, true);
  assert.deepEqual(events.slice(0, 2), ["input", "change"]);
  assert.equal(events.at(-1).previousValue, "Garden");
  assert.equal(events.at(-1).reason, "escape");

  input.value = "Restored";
  input.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(button.hidden, false);
  button.click();
  assert.equal(input.value, "");
  assert.equal(events.at(-1).reason, "button");

  runtime.destroy(root);
  root.remove();

  const selectRoot = document.createElement("div");
  selectRoot.dataset.gClearInput = "";
  selectRoot.innerHTML = '<select id="clearable-select" multiple><option value="a" selected>A</option><option value="b" selected>B</option></select><button data-g-clear-button></button>';
  document.body.append(selectRoot);
  runtime.init(selectRoot);
  assert.deepEqual([...selectRoot.querySelector("select").selectedOptions].map(({ value }) => value), ["a", "b"]);
  selectRoot.querySelector("button").click();
  assert.deepEqual([...selectRoot.querySelector("select").selectedOptions], []);
  runtime.destroy(selectRoot);
  selectRoot.remove();
});

test("dropzone validates type, size, count, drag state, programmatic files, and clear", () => {
  const root = document.createElement("div");
  root.dataset.gDropzone = "";
  root.dataset.gAccept = ".png,image/jpeg";
  root.dataset.gMaxSize = "1000";
  root.dataset.gMaxFiles = "2";
  root.innerHTML = '<input type="file" multiple><button type="button" data-g-file-browse>Browse</button>';
  document.body.append(root);
  const events = [];
  root.addEventListener("gardener:files", (event) => events.push(event.detail));

  runtime.init(root);
  const instance = runtime.getInstance(root, "dropzone");
  assert.ok(instance);
  assert.equal(root.getAttribute("role"), "group");
  assert.equal(root.tabIndex, 0);
  assert.equal(typeof instance.open, "function");
  assert.equal(typeof instance.files, "function");
  assert.equal(typeof instance.clear, "function");

  const valid = { name: "cover.png", type: "image/png", size: 500 };
  const large = { name: "large.jpg", type: "image/jpeg", size: 2000 };
  const wrong = { name: "notes.txt", type: "text/plain", size: 200 };
  const result = instance.files([valid, large, wrong]);
  assert.deepEqual(result.acceptedFiles, [valid]);
  assert.deepEqual(result.rejectedFiles.map(({ reasons }) => reasons), [["size"], ["count", "type"]]);
  assert.equal(events.at(-1).source, "api");
  assert.equal(root.classList.contains("has-files"), true);
  assert.equal(root.classList.contains("is-rejected"), true);
  assert.equal(root.getAttribute("aria-invalid"), "true");

  const enter = new browserWindow.Event("dragenter", { bubbles: true, cancelable: true });
  root.dispatchEvent(enter);
  assert.equal(root.classList.contains("is-dragging"), true);
  assert.equal(root.dataset.gState, "dragging");
  const leave = new browserWindow.Event("dragleave", { bubbles: true, cancelable: true });
  root.dispatchEvent(leave);
  assert.equal(root.classList.contains("is-dragging"), false);

  instance.clear();
  assert.equal(root.classList.contains("has-files"), false);
  assert.equal(root.classList.contains("is-rejected"), false);
  assert.equal(root.hasAttribute("aria-invalid"), false);
  runtime.destroy(root);
  root.remove();
});

test("combobox filters rich options, exposes active descendant navigation, creates, selects, and clears", () => {
  const root = document.createElement("div");
  root.className = "g-combobox g-combobox-clearable";
  root.dataset.gCombobox = "";
  root.innerHTML = `
    <div class="g-combobox-control"><input class="g-combobox-input"><button type="button" data-g-combobox-clear>Clear</button></div>
    <span data-g-combobox-status data-g-result-label="results"></span>
    <div class="g-combobox-list">
      <section class="g-combobox-group"><div class="g-combobox-group-label">People</div><div class="g-combobox-option" data-g-value="ada" data-g-label="Ada Lovelace" data-g-keywords="math">Ada Lovelace</div><div class="g-combobox-option" data-g-value="grace" data-g-label="Grace Hopper" data-g-keywords="compiler">Grace Hopper</div></section>
      <div class="g-combobox-option" data-g-value="locked" aria-disabled="true">Locked</div>
      <div class="g-combobox-option g-combobox-create" data-g-combobox-create hidden>Create <span data-g-combobox-create-value></span></div>
      <div class="g-combobox-empty" data-g-combobox-empty hidden>No results</div>
    </div>`;
  document.body.append(root);
  const searches = [];
  const changes = [];
  root.addEventListener("gardener:filter", (event) => searches.push(event.detail));
  root.addEventListener("gardener:change", (event) => changes.push(event.detail));
  runtime.init(root);
  const instance = runtime.getInstance(root, "combobox");
  const input = root.querySelector("input");
  assert.deepEqual(Object.keys(instance), ["open", "close", "choose", "clear", "search", "destroy"]);
  assert.equal(input.getAttribute("aria-autocomplete"), "list");
  assert.equal(input.getAttribute("aria-haspopup"), "listbox");

  input.value = "comp";
  input.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(root.querySelector("[data-g-value='grace']").hidden, false);
  assert.equal(root.querySelector("[data-g-value='ada']").hidden, true);
  assert.equal(root.querySelector("[data-g-combobox-create]").hidden, false);
  assert.equal(searches.at(-1).query, "comp");
  assert.equal(input.getAttribute("aria-expanded"), "true");
  assert.ok(input.getAttribute("aria-activedescendant"));

  input.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
  input.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
  assert.equal(input.value, "comp");
  assert.equal(changes.at(-1).label.includes("comp"), true);
  assert.equal(input.getAttribute("aria-expanded"), "false");

  instance.search("math");
  root.querySelector("[data-g-value='ada']").dispatchEvent(new browserWindow.Event("pointerdown", { bubbles: true, cancelable: true }));
  assert.equal(input.value, "ada");
  assert.equal(root.querySelector("[data-g-value='ada']").getAttribute("aria-selected"), "true");
  root.querySelector("[data-g-combobox-clear]").click();
  assert.equal(input.value, "");
  assert.equal(root.classList.contains("has-value"), false);
  assert.equal(root.querySelector("[data-g-combobox-clear]").hidden, true);
  runtime.destroy(root);
  root.remove();
});

test("toast content and upload filenames are rendered as text", () => {
  const payload = '<img src=x onerror="globalThis.__gardenerXss=1"><script>globalThis.__gardenerXss=1</script>';
  globalThis.__gardenerXss = 0;
  const toast = runtime.toast({ title: payload, message: payload, timeout: 0 });
  assert.equal(toast.querySelectorAll("img,script").length, 0);
  assert.equal(toast.querySelector(".g-toast-title").textContent, payload);

  const upload = document.createElement("div");
  upload.dataset.gUploadManager = "";
  document.body.append(upload);
  runtime.init(upload);
  runtime.getInstance(upload, "upload-manager").addFile({ name: payload, size: 1 });
  assert.equal(upload.querySelectorAll("img,script").length, 0);
  assert.equal(upload.querySelector(".g-file-name").textContent, payload);
  assert.equal(globalThis.__gardenerXss, 0);
  toast.remove();
  const errorToast = runtime.toast({ message: "Failed", tone: "error", timeout: 0 });
  assert.equal(errorToast.classList.contains("g-toast-error"), true);
  assert.equal(errorToast.getAttribute("role"), "alert");
  assert.equal(errorToast.closest(".g-toast-region").getAttribute("aria-live"), "polite");
  errorToast.remove();
  runtime.destroy(upload);
  upload.remove();
  delete globalThis.__gardenerXss;
});

test("upload queue manages files, aggregate state, progress, actions, dropzone events, and accessibility", () => {
  const root = document.createElement("section");
  root.className = "g-upload-queue";
  root.dataset.gUploadManager = "";
  root.setAttribute("aria-labelledby", "queue-title");
  root.innerHTML = `
    <header class="g-upload-queue-header">
      <strong id="queue-title" class="g-upload-queue-title">Uploads</strong>
      <span class="g-upload-summary"><b data-g-upload-count="total"></b><b data-g-upload-count="active"></b></span>
      <input class="g-upload-input" type="file" multiple data-g-upload-input>
      <button type="button" data-g-upload-action="clear">Clear</button>
    </header>
    <span data-g-upload-live></span>
    <div class="g-upload-list" data-g-upload-list>
      <div class="g-upload-empty" data-g-upload-empty>Nothing queued</div>
      <div class="g-upload-item" data-g-upload-item data-g-upload-id="report" data-g-status="uploading" data-g-progress="40">
        <span class="g-file-icon">PDF</span>
        <span class="g-file-main"><strong class="g-file-name">report.pdf</strong><span class="g-file-meta">2 MB</span><span data-g-upload-status></span></span>
        <span class="g-upload-progress" data-g-upload-progress><i class="g-upload-progress-bar"></i></span>
        <span class="g-upload-actions"><button type="button" data-g-upload-action="pause">Pause</button><button type="button" data-g-upload-action="retry">Retry</button><button type="button" data-g-upload-action="remove">Remove</button></span>
      </div>
    </div>`;
  const reasons = [];
  root.addEventListener("gardener:uploadchange", event => reasons.push(event.detail.reason));
  document.body.append(root);
  runtime.init(root);
  const instance = runtime.getInstance(root, "upload-manager");
  const initial = instance.items()[0];
  const progress = initial.querySelector("[data-g-upload-progress]");
  assert.deepEqual(Object.keys(instance), ["sync", "addFile", "addFiles", "update", "remove", "clear", "items", "destroy"]);
  assert.equal(root.dataset.gState, "uploading");
  assert.equal(root.getAttribute("aria-busy"), "true");
  assert.equal(root.querySelector("[data-g-upload-list]").getAttribute("role"), "list");
  assert.equal(initial.getAttribute("role"), "listitem");
  assert.equal(progress.getAttribute("role"), "progressbar");
  assert.equal(progress.getAttribute("aria-valuenow"), "40");
  assert.match(progress.getAttribute("aria-valuetext"), /40%/u);
  assert.equal(root.querySelector("[data-g-upload-empty]").hidden, true);
  assert.equal(initial.querySelector("[data-g-upload-action='retry']").hidden, true);

  initial.querySelector("[data-g-upload-action='pause']").click();
  assert.equal(initial.dataset.gStatus, "paused");
  assert.equal(root.dataset.gState, "paused");
  assert.equal(initial.querySelector("[data-g-upload-action='pause']").textContent, "Continue");
  assert.match(progress.getAttribute("aria-label"), /Paused/u);
  instance.update("report", { status: "uploading", progress: 75 });
  assert.equal(progress.getAttribute("aria-valuenow"), "75");
  instance.update("report", { progress: 100 });
  assert.equal(initial.dataset.gStatus, "success");
  assert.equal(root.dataset.gState, "success");
  assert.equal(root.getAttribute("aria-busy"), "false");

  const failed = instance.addFile({ name: "broken.mov", size: 4096 }, { id: "broken", status: "error", progress: 20 });
  assert.equal(root.dataset.gState, "mixed");
  assert.equal(failed.querySelector("[data-g-upload-action='retry']").hidden, false);
  failed.querySelector("[data-g-upload-action='retry']").click();
  assert.equal(failed.dataset.gStatus, "queued");
  assert.equal(failed.dataset.gProgress, "0");
  assert.equal(root.querySelector("[data-g-upload-count='total']").textContent, "2");

  const dropTarget = document.createElement("div");
  root.append(dropTarget);
  dropTarget.dispatchEvent(new browserWindow.CustomEvent("gardener:files", { bubbles: true, detail: { acceptedFiles: [{ name: "dropped.png", size: 1024 }] } }));
  assert.equal(instance.items().length, 3);
  assert.equal(instance.items().at(-1).querySelector(".g-file-icon").textContent, "png");
  assert.match(root.querySelector("[data-g-upload-live]").textContent, /3 files/u);

  assert.equal(instance.remove("broken"), true);
  assert.equal(instance.clear(), 2);
  assert.equal(root.dataset.gState, "empty");
  assert.equal(root.querySelector("[data-g-upload-empty]").hidden, false);
  assert.ok(reasons.includes("update"));
  assert.ok(reasons.includes("remove"));
  assert.ok(reasons.includes("clear"));
  runtime.destroy(root);
  root.remove();
});

test("toast runtime supports configuration, bounded queues, id updates, actions, and clearing", () => {
  runtime.toast.clear();
  const defaults = runtime.toast.config({ timeout: 0, maxCount: 2, position: "top", closable: true, showIcon: true });
  assert.equal(defaults.maxCount, 2);

  const loading = runtime.toast({ id: "sync", tone: "loading", message: "Syncing", timeout: 0 });
  const updated = runtime.toast({ id: "sync", tone: "success", message: "Synced", timeout: 0 });
  assert.equal(updated, loading);
  assert.equal(updated.classList.contains("g-toast-success"), true);
  assert.equal(updated.querySelector(".g-toast-message").textContent, "Synced");
  assert.equal(updated.hasAttribute("aria-busy"), false);

  runtime.toast({ message: "Second", timeout: 0 });
  runtime.toast({ message: "Third", timeout: 0 });
  const region = document.querySelector('.g-toast-region[data-g-position="top"]');
  assert.equal(region.querySelectorAll(":scope > .g-toast").length, 2);

  let acted = false;
  const actionable = runtime.toast({ message: "Archived", actionLabel: "Undo", actionClose: true, onAction: () => { acted = true; }, timeout: 0 });
  actionable.querySelector("[data-g-toast-action]").click();
  assert.equal(acted, true);
  runtime.toast.clear();
  assert.equal(document.querySelectorAll(".g-toast-region .g-toast").length, 0);
  runtime.toast.config({ timeout: 5000, maxCount: 5, position: "top", closable: true, showIcon: true });
});

test("managed DataGrid filters, sorts, pages, selects and edits without mutating source rows", () => {
  const root = document.createElement("div"); root.setAttribute("data-g-data-grid", ""); document.body.append(root);
  runtime.init(root); const grid = runtime.getInstance(root, "data-grid");
  const rows = Array.from({ length: 35 }, (_, i) => ({ id: i, name: `客户 ${i}`, amount: i }));
  const changes = [];
  grid.setOptions({ columns: [{ field: "name", title: "姓名" }, { field: "amount", type: "number", editable: true }], rows, pageSize: 10, selectable: true, onChange: change => changes.push(change) });
  assert.equal(root.querySelectorAll("tbody tr").length, 10);
  grid.setSort("amount", "desc"); assert.match(root.querySelector("tbody").textContent, /客户 34/u);
  grid.setPage(2); assert.equal(grid.getState().page, 2);
  grid.select(34); grid.setPage(3); assert.deepEqual(grid.getState().selectedKeys, [34]);
  grid.setFilter("客户 3"); assert.equal(grid.getState().page, 1); assert.equal(grid.getState().total, 6);
  assert.equal(changes.at(-1).total, 6);
  const checkbox = root.querySelector('input[type="checkbox"]'); checkbox.focus();
  checkbox.checked = true; checkbox.dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(document.activeElement?.getAttribute("aria-label"), checkbox.getAttribute("aria-label"));
  grid.updateCell(34, "amount", 100); assert.equal(rows[34].amount, 34); assert.equal(changes.at(-1).reason, "edit");
  assert.throws(() => grid.updateCell(34, "__proto__", {}), /not editable/u);
  assert.throws(() => grid.setRows([{ id: 1 }, { id: 1 }]), /unique/u);
  runtime.destroy(root); root.remove();
});

test("managed DataGrid virtual mode bounds rendered rows and restores original markup on dispose", () => {
  const root = document.createElement("div"); root.setAttribute("data-g-data-grid", "");
  const original = document.createElement("p"); original.textContent = "original"; root.append(original); document.body.append(root);
  runtime.init(root); const grid = runtime.getInstance(root, "data-grid");
  grid.setOptions({ columns: [{ field: "name" }], rows: Array.from({ length: 10000 }, (_, id) => ({ id, name: `<script>${id}</script>` })), pageSize: 10000, virtual: true, rowHeight: 40, height: 320 });
  assert.ok(root.querySelectorAll("tbody tr").length < 25); assert.equal(root.querySelectorAll("script").length, 0);
  const viewport = root.querySelector("[data-g-grid-viewport]"); viewport.scrollTop = 20000;
  viewport.dispatchEvent(new browserWindow.Event("scroll"));
  assert.ok(root.querySelectorAll("tbody tr").length < 25); assert.match(root.querySelector("tbody").textContent, /497/u);
  runtime.destroy(root); assert.equal(root.firstChild, original); root.remove();
});

test("managed DataGrid ignores stale server responses and aborts pending work on disposal", async () => {
  const root = document.createElement("div"); root.setAttribute("data-g-data-grid", ""); document.body.append(root); runtime.init(root);
  const grid = runtime.getInstance(root, "data-grid"), requests = [];
  grid.setOptions({ columns: [{ field: "name" }], mode: "server", pageSize: 10, total: 100,
    load: query => new Promise(resolve => requests.push({ query, resolve })),
  });
  const next = grid.setPage(2); assert.equal(requests[0].query.signal.aborted, true); assert.equal(requests[1].query.page, 2);
  requests[1].resolve({ rows: [{ id: 20, name: "new" }], total: 100 }); await next;
  requests[0].resolve({ rows: [{ id: 1, name: "stale" }], total: 100 }); await Promise.resolve();
  assert.match(root.textContent, /new/u); assert.doesNotMatch(root.textContent, /stale/u);
  grid.setFilter("pending"); runtime.destroy(root); assert.equal(requests[2].query.signal.aborted, true);
  requests[2].resolve({ rows: [], total: 0 }); await Promise.resolve(); root.remove();
});

test("responsive table tracks horizontal overflow so sticky edge columns expose the correct shadow", () => {
  const root = document.createElement("div"); root.className = "g-responsive-table is-sticky-columns"; root.dataset.gTableScroll = "";
  root.innerHTML = "<table class='g-table'><thead><tr><th>First</th><th>Middle</th><th>Last</th></tr></thead></table>";
  Object.defineProperty(root, "clientWidth", { configurable: true, value: 320 });
  Object.defineProperty(root, "scrollWidth", { configurable: true, value: 800 });
  Object.defineProperty(root, "scrollLeft", { configurable: true, writable: true, value: 0 });
  document.body.append(root); runtime.init(root);
  const scrolling = runtime.getInstance(root, "table-scroll");
  assert.deepEqual(scrolling.state(), { overflow: true, atStart: true, atEnd: false, canScrollStart: false, canScrollEnd: true });
  assert.equal(root.classList.contains("can-scroll-end"), true);
  root.scrollLeft = 200; scrolling.update();
  assert.equal(root.classList.contains("can-scroll-start"), true); assert.equal(root.classList.contains("can-scroll-end"), true);
  root.scrollLeft = 480; scrolling.update();
  assert.deepEqual(scrolling.state(), { overflow: true, atStart: false, atEnd: true, canScrollStart: true, canScrollEnd: false });
  root.scrollLeft = 0; root.focus();
  const right = new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
  root.dispatchEvent(right); assert.equal(right.defaultPrevented, true); assert.equal(root.scrollLeft, 48);
  const end = new browserWindow.KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true });
  root.dispatchEvent(end); assert.equal(root.scrollLeft, 480);

  root.style.direction = "rtl"; root.scrollLeft = 0; scrolling.update();
  assert.deepEqual(scrolling.state(), { overflow: true, atStart: true, atEnd: false, canScrollStart: false, canScrollEnd: true });
  const left = new browserWindow.KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true });
  root.dispatchEvent(left); assert.equal(left.defaultPrevented, true); assert.equal(root.scrollLeft, -48);
  runtime.destroy(root); assert.equal(root.classList.contains("is-scrollable"), false); root.remove();
});

test("table density and filter summary controls perform their advertised small interactions", async () => {
  const scope = document.createElement("section"); scope.dataset.gTableScope = "";
  scope.innerHTML = '<input type="search" data-g-filter-input><div class="g-table-density" data-g-table-density><button data-g-value="standard" aria-pressed="true">Standard</button><button data-g-value="compact">Compact</button></div><table class="g-table"></table><div class="g-filter-summary" data-g-filter-summary><span class="g-filter-summary-chip">Active</span><button class="g-filter-summary-clear">Clear</button></div>';
  document.body.append(scope); runtime.init(scope);
  const densityRoot = scope.querySelector("[data-g-table-density]"), summary = scope.querySelector("[data-g-filter-summary]"), table = scope.querySelector("table");
  const density = runtime.getInstance(densityRoot, "table-density"); density.set("compact");
  assert.equal(table.classList.contains("g-table-compact"), true); assert.equal(density.value(), "compact");
  scope.querySelector("[data-g-value='standard']").click(); assert.equal(table.classList.contains("g-table-compact"), false);
  scope.querySelector(".g-filter-summary-clear").click(); await Promise.resolve();
  assert.equal(summary.hidden, true); assert.equal(document.activeElement, scope.querySelector("[data-g-filter-input]"));
  runtime.destroy(scope); scope.remove();
});

test("collapsible navigation manages its integrated trigger, panel, events, close hooks and focus", async () => {
  const root = document.createElement("aside");
  root.className = "g-collapsible-nav";
  root.setAttribute("data-g-nav-toggle", "");
  root.innerHTML = `
    <header class="g-collapsible-nav-header"><strong class="g-collapsible-nav-title">Projects</strong><button class="g-collapsible-nav-trigger" type="button" data-g-collapsible-trigger data-g-open-label="Expand projects" data-g-close-label="Collapse projects">Toggle</button></header>
    <div class="g-collapsible-nav-body"><nav aria-label="Projects"><a class="g-collapsible-nav-link" href="#one">One</a><button type="button" data-g-nav-close>Done</button></nav></div>`;
  document.body.append(root);
  const events = []; root.addEventListener("gardener:open", () => events.push("open")); root.addEventListener("gardener:close", event => events.push(event.detail.reason));
  runtime.init(root);
  const trigger = root.querySelector(".g-collapsible-nav-trigger"), panel = root.querySelector(".g-collapsible-nav-body"), link = root.querySelector(".g-collapsible-nav-link"), instance = runtime.getInstance(root, "nav-toggle");
  assert.equal(instance.isOpen(), true); assert.equal(root.dataset.gNavOpen, "true"); assert.equal(trigger.getAttribute("aria-controls"), panel.id); assert.equal(trigger.getAttribute("aria-expanded"), "true"); assert.equal(panel.getAttribute("role"), "region"); assert.equal(panel.hidden, false);
  trigger.click(); assert.equal(instance.isOpen(), false); assert.equal(panel.hidden, true); assert.equal(trigger.getAttribute("aria-label"), "Expand projects");
  instance.open(); assert.equal(events[0], "toggle"); assert.equal(events[1], "open"); assert.equal(panel.hidden, false);
  link.focus(); link.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(instance.isOpen(), false); assert.equal(document.activeElement, trigger); assert.equal(events.at(-1), "escape");
  instance.open(); root.querySelector("[data-g-nav-close]").click(); assert.equal(instance.isOpen(), false); assert.equal(events.at(-1), "navigate");
  const cancelOpen = event => event.preventDefault(); root.addEventListener("gardener:beforeopen", cancelOpen); instance.open(); assert.equal(instance.isOpen(), false); root.removeEventListener("gardener:beforeopen", cancelOpen);
  root.setAttribute("aria-disabled", "true"); trigger.click(); assert.equal(instance.isOpen(), false); root.removeAttribute("aria-disabled");
  instance.open(); const cancelClose = event => event.preventDefault(); root.addEventListener("gardener:beforeclose", cancelClose); instance.close(); assert.equal(instance.isOpen(), true); root.removeEventListener("gardener:beforeclose", cancelClose); instance.close();
  runtime.destroy(root); root.remove();
});

test("navigation rail defaults to vertical roving focus and never selects disabled destinations", () => {
  const root = document.createElement("nav");
  root.className = "g-nav-rail";
  root.setAttribute("data-g-roving-nav", "");
  root.innerHTML = `<ul class="g-nav-rail-list">
    <li><a class="g-nav-rail-item" href="#overview" aria-current="page">Overview</a></li>
    <li><a class="g-nav-rail-item" href="#projects">Projects</a></li>
    <li><a class="g-nav-rail-item" href="#admin" aria-disabled="true" tabindex="-1">Admin</a></li>
    <li><a class="g-nav-rail-item" href="#reports">Reports</a></li>
  </ul>`;
  document.body.append(root); runtime.init(root);
  const [overview, projects, disabled, reports] = root.querySelectorAll(".g-nav-rail-item"); const instance = runtime.getInstance(root, "roving-nav");
  assert.equal(overview.tabIndex, 0); assert.equal(projects.tabIndex, -1); assert.equal(disabled.tabIndex, -1); assert.equal(reports.tabIndex, -1);
  overview.focus(); overview.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, projects);
  projects.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, reports);
  reports.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true })); assert.equal(document.activeElement, overview);
  disabled.click(); assert.equal(overview.tabIndex, 0); assert.equal(instance.select(disabled, true), null); assert.equal(document.activeElement, overview);
  assert.equal(instance.select(reports, true), reports); assert.equal(document.activeElement, reports); assert.equal(reports.tabIndex, 0);
  runtime.destroy(root); root.remove();
});

test("activity bar defaults to vertical roving focus across primary and utility groups", () => {
  const root = document.createElement("nav");
  root.className = "g-activitybar";
  root.setAttribute("data-g-roving-nav", "");
  root.innerHTML = `<div class="g-activitybar-group"><ul class="g-activitybar-list">
    <li><a class="g-activitybar-item" href="#explorer" aria-current="page">Explorer</a></li>
    <li><a class="g-activitybar-item" href="#search">Search</a></li>
    <li><a class="g-activitybar-item" href="#remote" aria-disabled="true" tabindex="-1">Remote</a></li>
    <li><a class="g-activitybar-item" href="#source">Source</a></li>
  </ul></div><footer class="g-activitybar-footer"><a class="g-activitybar-action" href="#account">Account</a></footer>`;
  document.body.append(root); runtime.init(root);
  const [explorer, search, disabled, source, account] = root.querySelectorAll(".g-activitybar-item, .g-activitybar-action"); const instance = runtime.getInstance(root, "roving-nav");
  assert.equal(explorer.tabIndex, 0); assert.equal(search.tabIndex, -1); assert.equal(disabled.tabIndex, -1); assert.equal(source.tabIndex, -1); assert.equal(account.tabIndex, -1);
  explorer.focus(); explorer.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, search);
  search.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, source);
  source.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true })); assert.equal(document.activeElement, account);
  account.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true })); assert.equal(document.activeElement, explorer);
  assert.equal(instance.select(disabled, true), null); assert.equal(document.activeElement, explorer); assert.equal(instance.select(account, true), account); assert.equal(document.activeElement, account);
  runtime.destroy(root); root.remove();
});

test("menu bar roves top-level commands, opens menus, and switches an open menu with horizontal arrows", async () => {
  const root = document.createElement("nav");
  root.className = "g-menubar";
  root.setAttribute("data-g-roving-nav", "");
  root.innerHTML = `<ul class="g-menubar-list" role="none">
    <li role="none"><div class="g-menubar-menu" data-g-dropdown><button class="g-menubar-item" type="button" role="menuitem" data-g-dropdown-trigger>File</button><ul class="g-menubar-menu-panel" data-g-dropdown-menu hidden><li role="none"><button class="g-menubar-menu-item" role="menuitem" type="button">New</button></li><li role="none"><button class="g-menubar-menu-item" role="menuitem" type="button">Open</button></li></ul></div></li>
    <li role="none"><div class="g-menubar-menu" data-g-dropdown><button class="g-menubar-item" type="button" role="menuitem" data-g-dropdown-trigger>Edit</button><ul class="g-menubar-menu-panel" data-g-dropdown-menu hidden><li role="none"><button class="g-menubar-menu-item" role="menuitem" type="button">Undo</button></li><li role="none"><button class="g-menubar-menu-item" role="menuitem" type="button">Redo</button></li></ul></div></li>
    <li role="none"><button class="g-menubar-item" type="button" role="menuitem" aria-disabled="true">Admin</button></li>
    <li role="none"><button class="g-menubar-item" type="button" role="menuitem">Help</button></li>
  </ul>`;
  document.body.append(root); runtime.init(root);
  const [file, edit, disabled, help] = root.querySelectorAll(".g-menubar-item"); const [fileMenu, editMenu] = root.querySelectorAll(".g-menubar-menu-panel"); const roving = runtime.getInstance(root, "roving-nav");
  assert.equal(root.getAttribute("role"), "menubar"); assert.equal(root.getAttribute("aria-orientation"), "horizontal"); assert.equal(file.tabIndex, 0); assert.equal(edit.tabIndex, -1); assert.equal(disabled.tabIndex, -1); assert.equal(help.tabIndex, -1); assert.ok(roving);
  file.focus(); file.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })); assert.equal(document.activeElement, edit);
  edit.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })); assert.equal(document.activeElement, help);
  help.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true })); assert.equal(document.activeElement, file);
  file.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); await Promise.resolve();
  assert.equal(fileMenu.hidden, false); assert.equal(file.getAttribute("aria-expanded"), "true"); assert.equal(document.activeElement.textContent, "New");
  document.activeElement.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })); await Promise.resolve();
  assert.equal(fileMenu.hidden, true); assert.equal(editMenu.hidden, false); assert.equal(edit.getAttribute("aria-expanded"), "true"); assert.equal(document.activeElement.textContent, "Undo");
  document.activeElement.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(editMenu.hidden, true); assert.equal(document.activeElement, edit);
  runtime.destroy(root); root.remove();
});

test("context menu normalizes semantics, clamps positioning, manages rich items, and restores focus", () => {
  const root = document.createElement("div");
  root.className = "g-context-menu g-context-menu-bordered";
  root.setAttribute("data-g-context-menu", "");
  root.innerHTML = `<div class="g-context-menu-target" data-g-context-target>Document.pdf</div>
    <ul class="g-context-menu-panel" data-g-context-menu-panel hidden>
      <li><button class="g-context-menu-item" type="button" data-g-value="open">Open</button></li>
      <li><button class="g-context-menu-item" type="button" role="menuitemcheckbox" aria-checked="true" data-g-value="favorite" data-g-keep-open="true">Favorite</button></li>
      <li><button class="g-context-menu-item" type="button" aria-disabled="true">Archive</button></li>
      <li><button class="g-context-menu-item is-danger" type="button" data-g-value="remove">Remove</button></li>
    </ul>`;
  document.body.append(root);
  const target = root.querySelector("[data-g-context-target]"); const menu = root.querySelector("[data-g-context-menu-panel]"); const [openItem, favorite, disabled, remove] = root.querySelectorAll(".g-context-menu-item");
  target.getBoundingClientRect = () => ({ left: 20, right: 320, top: 20, bottom: 120, width: 300, height: 100, x: 20, y: 20, toJSON() {} });
  menu.getBoundingClientRect = () => ({ left: 0, right: 220, top: 0, bottom: 180, width: 220, height: 180, x: 0, y: 0, toJSON() {} });
  runtime.init(root);
  const instance = runtime.getInstance(root, "context-menu");
  assert.ok(instance); assert.equal(target.tabIndex, 0); assert.equal(target.getAttribute("aria-haspopup"), "menu"); assert.equal(target.getAttribute("aria-controls"), menu.id); assert.equal(target.getAttribute("aria-expanded"), "false"); assert.equal(menu.getAttribute("role"), "menu"); assert.equal(menu.getAttribute("aria-labelledby"), target.id); assert.equal(openItem.getAttribute("role"), "menuitem"); assert.equal(disabled.tabIndex, -1);
  target.focus(); target.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "F10", shiftKey: true, bubbles: true, cancelable: true }));
  assert.equal(menu.hidden, false);
  assert.equal(target.getAttribute("aria-expanded"), "true");
  assert.equal(root.classList.contains("is-open"), true);
  openItem.focus();
  assert.equal(document.activeElement === openItem, true);
  assert.ok(Number.parseFloat(menu.style.left) >= 8, menu.style.cssText);
  assert.ok(Number.parseFloat(menu.style.top) >= 8, menu.style.cssText);
  openItem.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement === favorite, true);
  favorite.click(); assert.equal(favorite.getAttribute("aria-checked"), "false"); assert.equal(menu.hidden, false);
  favorite.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement === remove, true);
  remove.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "o", bubbles: true, cancelable: true })); assert.equal(document.activeElement === openItem, true);
  openItem.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(menu.hidden, true); assert.equal(target.getAttribute("aria-expanded"), "false"); assert.equal(document.activeElement === target, true);
  target.dispatchEvent(new browserWindow.MouseEvent("contextmenu", { clientX: browserWindow.innerWidth - 2, clientY: browserWindow.innerHeight - 2, bubbles: true, cancelable: true }));
  assert.equal(menu.hidden, false); assert.ok(Number.parseFloat(menu.style.left) <= browserWindow.innerWidth - 220 - 8); assert.ok(Number.parseFloat(menu.style.top) <= browserWindow.innerHeight - 180 - 8);
  document.body.dispatchEvent(new browserWindow.PointerEvent("pointerdown", { bubbles: true })); assert.equal(menu.hidden, true);
  instance.open(24, 32, target); assert.equal(instance.isOpen(), true); instance.close("api", true); assert.equal(instance.isOpen(), false); assert.equal(document.activeElement === target, true);
  runtime.destroy(root); root.remove();
});

test("navbar mobile disclosure and roving navigation preserve state, focus and keyboard order", async () => {
  const root = document.createElement("header");
  root.className = "g-navbar";
  root.innerHTML = `
    <a class="g-navbar-brand" href="#home">Garden</a>
    <nav data-g-roving-nav aria-label="Primary">
      <a class="g-nav-link" href="#overview" aria-current="page">Overview</a>
      <a class="g-nav-link" href="#settings">Settings</a>
      <div hidden><a class="g-nav-link" href="#hidden">Hidden</a></div>
    </nav>
    <button type="button" data-g-nav-toggle="mobile-navbar" data-g-focus-first="true" data-g-open-label="Open navigation" data-g-close-label="Close navigation">Menu</button>
    <nav id="mobile-navbar" class="g-navbar-mobile-panel" hidden aria-label="Mobile">
      <a class="g-nav-link" href="#overview" data-g-nav-close>Overview</a>
      <a class="g-nav-link" href="#settings" data-g-nav-close>Settings</a>
    </nav>`;
  document.body.append(root); runtime.init(root);
  const [overview, settings] = root.querySelectorAll("nav[data-g-roving-nav] .g-nav-link");
  assert.equal(overview.tabIndex, 0); assert.equal(settings.tabIndex, -1);
  overview.focus(); overview.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, settings);

  const trigger = root.querySelector("[data-g-nav-toggle]"); const panel = root.querySelector("#mobile-navbar");
  trigger.click(); await new Promise((resolvePromise) => requestAnimationFrame(resolvePromise));
  assert.equal(panel.hidden, false); assert.equal(panel.classList.contains("is-open"), true);
  assert.equal(trigger.getAttribute("aria-expanded"), "true"); assert.equal(trigger.getAttribute("aria-label"), "Close navigation");
  assert.equal(document.activeElement, panel.querySelector("a"));
  panel.querySelector("[data-g-nav-close]").click();
  assert.equal(panel.dataset.gNavOpen, "false"); assert.equal(panel.getAttribute("aria-hidden"), "true");
  assert.equal(trigger.getAttribute("aria-expanded"), "false"); assert.equal(trigger.getAttribute("aria-label"), "Open navigation");
  assert.equal(document.activeElement, trigger);
  runtime.destroy(root); root.remove();
});

test("sidebar drawer restores navigation state, vertical keyboard order and opener focus", async () => {
  const host = document.createElement("div");
  host.innerHTML = `
    <button type="button" data-g-nav-toggle="runtime-sidebar" data-g-focus-first="true" data-g-open-label="Open workspace navigation" data-g-close-label="Close workspace navigation">Menu</button>
    <aside id="runtime-sidebar" class="g-sidebar g-sidebar-drawer" data-g-roving-nav data-g-orientation="vertical" hidden aria-label="Workspace navigation">
      <nav class="g-sidebar-nav">
        <a class="g-sidebar-link" href="#overview" aria-current="page" data-g-nav-close>Overview</a>
        <a class="g-sidebar-link" href="#projects" data-g-nav-close>Projects</a>
        <a class="g-sidebar-link" href="#disabled" aria-disabled="true">Disabled</a>
        <a class="g-sidebar-link" href="#settings" data-g-nav-close>Settings</a>
      </nav>
    </aside>`;
  document.body.append(host); runtime.init(host);
  const trigger = host.querySelector("[data-g-nav-toggle]"); const sidebar = host.querySelector(".g-sidebar");
  trigger.click(); await new Promise((resolvePromise) => requestAnimationFrame(resolvePromise));
  const [overview, projects, disabled, settings] = sidebar.querySelectorAll(".g-sidebar-link");
  assert.equal(sidebar.hidden, false); assert.equal(sidebar.classList.contains("is-open"), true);
  assert.equal(sidebar.getAttribute("aria-hidden"), "false"); assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.equal(document.activeElement, overview); assert.equal(overview.tabIndex, 0); assert.equal(projects.tabIndex, -1); assert.equal(settings.tabIndex, -1);
  overview.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, projects);
  projects.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, settings); assert.notEqual(document.activeElement, disabled);
  settings.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, overview);
  projects.click();
  assert.equal(sidebar.dataset.gNavOpen, "false"); assert.equal(trigger.getAttribute("aria-expanded"), "false"); assert.equal(document.activeElement, trigger);
  runtime.destroy(host); host.remove();
});

test("tabs support inferred semantics, manual activation, disabled skipping, RTL and nested isolation", () => {
  const host = document.createElement("section");
  host.innerHTML = `
    <div id="outer-tabs" class="g-tabs g-tabs-contained g-tabs-vertical" data-g-tabs data-g-activation="manual">
      <div class="g-tab-list" aria-label="Workspace views">
        <button id="outer-overview" class="g-tab" type="button" aria-controls="outer-overview-panel" aria-selected="true">Overview</button>
        <button class="g-tab" type="button" aria-disabled="true">Disabled</button>
        <button id="outer-activity" class="g-tab" type="button" aria-controls="outer-activity-panel">Activity</button>
      </div>
      <div class="g-tab-panels">
        <section id="outer-overview-panel" class="g-tab-panel">Overview panel</section>
        <section class="g-tab-panel" hidden>Disabled panel</section>
        <section id="outer-activity-panel" class="g-tab-panel" hidden>
          Activity panel
          <div id="inner-tabs" class="g-tabs" data-g-tabs>
            <div class="g-tab-list"><button id="inner-tab" class="g-tab" type="button" aria-selected="true">Inner</button></div>
            <div id="inner-panel" class="g-tab-panel">Inner panel</div>
          </div>
        </section>
      </div>
    </div>`;
  document.body.append(host); const changes = []; const outer = host.querySelector("#outer-tabs");
  outer.addEventListener("gardener:change", event => { if (event.target === outer) changes.push(event.detail); });
  runtime.init(host);
  const list = outer.querySelector(":scope > .g-tab-list"); const [overview, disabled, activity] = list.querySelectorAll(".g-tab");
  const [overviewPanel, disabledPanel, activityPanel] = outer.querySelector(":scope > .g-tab-panels").querySelectorAll(":scope > .g-tab-panel");
  assert.equal(list.getAttribute("role"), "tablist"); assert.equal(list.getAttribute("aria-orientation"), "vertical"); assert.equal(overview.getAttribute("role"), "tab"); assert.equal(activityPanel.getAttribute("role"), "tabpanel");
  assert.equal(overviewPanel.hidden, false); assert.equal(disabledPanel.hidden, true); assert.equal(activityPanel.hidden, true);
  overview.focus(); overview.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, activity); assert.equal(overview.getAttribute("aria-selected"), "true"); assert.equal(activity.getAttribute("aria-selected"), "false");
  activity.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
  assert.equal(activity.getAttribute("aria-selected"), "true"); assert.equal(activityPanel.hidden, false); assert.equal(overviewPanel.hidden, true);
  outer.dataset.gActivation = "automatic"; outer.classList.remove("g-tabs-vertical"); list.removeAttribute("aria-orientation"); outer.setAttribute("dir", "rtl");
  activity.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, overview); assert.equal(overview.getAttribute("aria-selected"), "true");
  const instance = runtime.getInstance(outer, "tabs"); instance.select("outer-activity-panel");
  assert.equal(activity.getAttribute("aria-selected"), "true"); assert.equal(host.querySelector("#inner-tab").getAttribute("aria-selected"), "true");
  assert.equal(host.querySelector("#inner-panel").hidden, false); assert.equal(disabled.getAttribute("aria-selected"), "false"); assert.ok(changes.length >= 3);
  runtime.destroy(host); host.remove();
});

test("segmented controls synchronize selection, form values, panels, disabled items, RTL and keyboard focus", () => {
  const host = document.createElement("section");
  host.innerHTML = `
    <div id="layout-control" class="g-segmented g-segmented-block" data-g-data-view data-g-current-view="list" dir="rtl" aria-label="Layout">
      <button class="g-segmented-item" type="button" data-g-view="list" aria-checked="true">List</button>
      <button class="g-segmented-item" type="button" data-g-view="board" aria-disabled="true">Board</button>
      <button class="g-segmented-item" type="button" data-g-view="grid">Grid</button>
      <input class="g-segmented-input" data-g-segmented-input name="layout">
      <section data-g-view-panel="list">List panel</section>
      <section data-g-view-panel="board">Board panel</section>
      <section data-g-view-panel="grid">Grid panel</section>
    </div>`;
  document.body.append(host); const root = host.querySelector("#layout-control"); const changes = [];
  root.addEventListener("gardener:viewchange", event => changes.push(event.detail)); runtime.init(host);
  const [list, board, grid] = root.querySelectorAll(".g-segmented-item"); const input = root.querySelector("[data-g-segmented-input]");
  const [listPanel, boardPanel, gridPanel] = root.querySelectorAll("[data-g-view-panel]");
  assert.equal(root.getAttribute("role"), "radiogroup"); assert.equal(list.getAttribute("role"), "radio"); assert.equal(list.getAttribute("aria-checked"), "true");
  assert.equal(list.tabIndex, 0); assert.equal(board.tabIndex, -1); assert.equal(grid.tabIndex, -1); assert.equal(input.value, "list");
  assert.equal(listPanel.hidden, false); assert.equal(boardPanel.hidden, true); assert.equal(gridPanel.hidden, true);
  grid.click(); assert.equal(grid.getAttribute("aria-checked"), "true"); assert.equal(input.value, "grid"); assert.equal(gridPanel.hidden, false); assert.equal(listPanel.hidden, true);
  grid.focus(); grid.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, list); assert.equal(list.getAttribute("aria-checked"), "true"); assert.equal(board.getAttribute("aria-checked"), "false");
  root.classList.add("g-segmented-vertical"); root.setAttribute("aria-orientation", "vertical");
  list.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, grid); assert.equal(grid.getAttribute("aria-checked"), "true");
  const instance = runtime.getInstance(root, "data-view"); assert.equal(instance.value(), "grid"); instance.select("list"); assert.equal(instance.value(), "list");
  assert.ok(changes.length >= 4); runtime.destroy(host); host.remove();
});

test("small form, range, media, choice and builder controls keep their visible state in sync", () => {
  const host = document.createElement("section");
  host.innerHTML = `
    <div data-g-field-sync><input type="range" value="88"><output data-g-field-output data-g-suffix="%"></output></div>
    <div data-g-field-sync data-g-empty-label="No file"><input type="file"><span data-g-field-output></span></div>
    <div data-g-range-picker><input type="date"><input type="date"><button type="button" data-g-range-preset="last-7-days">Last 7 days</button><button type="button" data-g-range-apply>Apply</button></div>
    <div data-g-media-player data-g-duration="210"><button type="button" data-g-media-toggle data-g-play-label="Play" data-g-pause-label="Pause"><span data-g-media-icon>▶</span></button><input type="range" value="18" data-g-media-timeline><span data-g-media-time></span></div>
    <div data-g-saved-choice><button type="button" data-g-saved-choice-item data-g-value="yes" data-g-confirmation="Thanks">Yes</button><button type="button" data-g-saved-choice-item data-g-value="no">No</button><div role="button" data-g-saved-choice-item data-g-value="later">Later</div><span data-g-saved-choice-output></span></div>
    <div data-g-builder-list><div data-g-builder-items><div data-g-builder-item><button type="button" data-g-builder-up>Up</button><button type="button" data-g-builder-down>Down</button><button type="button" data-g-builder-remove>Remove</button></div></div><button type="button" data-g-builder-add>Add</button></div>`;
  document.body.append(host); runtime.init(host);

  const rangeField = host.querySelectorAll("[data-g-field-sync]")[0];
  const rangeInput = rangeField.querySelector("input");
  rangeInput.value = "65"; rangeInput.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(rangeField.querySelector("output").textContent, "65%");

  const fileField = host.querySelectorAll("[data-g-field-sync]")[1];
  const fileInput = fileField.querySelector("input");
  Object.defineProperty(fileInput, "files", { configurable: true, value: [{ name: "logo.svg" }] });
  fileInput.dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(fileField.querySelector("[data-g-field-output]").textContent, "logo.svg");

  const picker = host.querySelector("[data-g-range-picker]");
  picker.querySelector("[data-g-range-preset]").click();
  const dates = [...picker.querySelectorAll("input")].map((input) => input.value);
  assert.ok(dates.every(Boolean)); assert.ok(dates[0] <= dates[1]);
  picker.querySelector("[data-g-range-apply]").click(); assert.equal(picker.classList.contains("is-applied"), true);
  runtime.getInstance(picker, "range-picker").set("2026-09-02", "2026-09-01");
  assert.equal(picker.classList.contains("is-invalid"), true); assert.equal(picker.classList.contains("is-applied"), false);
  assert.equal(picker.querySelector("[data-g-range-apply]").disabled, true); assert.equal(picker.querySelectorAll("input")[1].min, "2026-09-02");
  runtime.getInstance(picker, "range-picker").clear();
  assert.equal(picker.querySelector("[data-g-range-apply]").disabled, false); assert.equal(picker.querySelectorAll("input")[1].hasAttribute("min"), false);

  const player = host.querySelector("[data-g-media-player]");
  player.querySelector("[data-g-media-toggle]").click();
  assert.equal(player.dataset.gPlaying, "true"); assert.equal(player.querySelector("[data-g-media-time]").textContent, "0:18 / 3:30");
  const timeline = player.querySelector("[data-g-media-timeline]"); timeline.value = "75"; timeline.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(player.querySelector("[data-g-media-time]").textContent, "1:15 / 3:30");

  const choice = host.querySelector("[data-g-saved-choice]"); choice.querySelector("[data-g-saved-choice-item]").click();
  assert.equal(choice.querySelector("[data-g-saved-choice-output]").textContent, "Thanks");
  choice.querySelector("[data-g-saved-choice-item]").dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert.equal(choice.querySelectorAll("[data-g-saved-choice-item]")[1].getAttribute("aria-pressed"), "true");
  const later = choice.querySelector("[data-g-value='later']"); later.focus();
  later.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }));
  assert.equal(later.getAttribute("aria-pressed"), "true");

  const builder = host.querySelector("[data-g-builder-list]");
  assert.equal(builder.querySelector("[data-g-builder-up]").disabled, true); assert.equal(builder.querySelector("[data-g-builder-down]").disabled, true);
  builder.querySelector("[data-g-builder-remove]").click();
  assert.equal(builder.querySelectorAll("[data-g-builder-item]").length, 0); assert.equal(document.activeElement, builder.querySelector("[data-g-builder-add]"));
  runtime.destroy(host); host.remove();
});

test("form builder creates, selects, edits, reorders, duplicates, serializes and loads fields", () => {
  const root = document.createElement("section");
  root.className = "g-form-builder";
  root.dataset.gBuilderList = "";
  root.dataset.gBuilderStatusTemplate = "{count} fields";
  root.innerHTML = `
    <button type="button" data-g-builder-add data-g-builder-type="email" data-g-builder-label="Email address">Add email</button>
    <span data-g-builder-status></span><span data-g-builder-count></span>
    <div data-g-builder-items>
      <section data-g-builder-item data-g-builder-id="full-name" data-g-builder-type="text" data-g-builder-label="Full name" data-g-builder-name="fullName">
        <span data-g-builder-bind="type"></span><button type="button" data-g-builder-up>Up</button><button type="button" data-g-builder-down>Down</button><button type="button" data-g-builder-duplicate>Duplicate</button><button type="button" data-g-builder-remove>Remove</button>
        <label data-g-builder-bind="label"></label><input data-g-builder-control>
      </section>
      <div data-g-builder-empty hidden>Empty</div>
    </div>
    <div data-g-builder-inspector-empty>Choose a field</div>
    <div data-g-builder-inspector-body><input data-g-builder-property="label"><input data-g-builder-property="name"><input type="checkbox" data-g-builder-property="required"></div>
    <textarea data-g-builder-output></textarea>`;
  const changes = [];
  root.addEventListener("gardener:builderchange", (event) => changes.push(event.detail));
  document.body.append(root); runtime.init(root);
  const builder = runtime.getInstance(root, "builder-list");

  assert.equal(builder.items().length, 1);
  assert.deepEqual(builder.selected(), { id: "full-name", type: "text", label: "Full name", name: "fullName", placeholder: "", help: "", required: false });
  assert.equal(root.querySelector("[data-g-builder-status]").textContent, "1 fields");
  root.querySelector("[data-g-builder-add]").click();
  assert.equal(builder.items().length, 2);
  assert.equal(builder.selected().type, "email");
  assert.equal(builder.selected().label, "Email address");

  const label = root.querySelector("[data-g-builder-property='label']");
  label.value = "Work email";
  label.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(builder.selected().label, "Work email");
  assert.equal(root.querySelector("[aria-current='true'] [data-g-builder-bind='label']").textContent, "Work email");
  const required = root.querySelector("[data-g-builder-property='required']");
  required.checked = true;
  required.dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(root.querySelector("[aria-current='true'] [data-g-builder-control]").required, true);

  const originalId = builder.selected().id;
  builder.duplicate();
  assert.equal(builder.items().length, 3);
  assert.notEqual(builder.selected().id, originalId);
  builder.move(builder.selected().id, "up");
  assert.equal(builder.items()[1].id, builder.selected().id);
  builder.remove();
  assert.equal(builder.items().length, 2);

  const serialized = builder.schema();
  assert.equal(serialized.version, 1);
  assert.deepEqual(JSON.parse(root.querySelector("[data-g-builder-output]").value), serialized);
  builder.load({ version: 1, fields: [{ id: "notes", type: "textarea", label: "Notes", name: "notes", placeholder: "Optional", help: "Keep it short", required: false }] });
  assert.deepEqual(builder.items(), [{ id: "notes", type: "textarea", label: "Notes", name: "notes", placeholder: "Optional", help: "Keep it short", required: false }]);
  assert.equal(root.querySelector("textarea[data-g-builder-control]").placeholder, "Optional");
  root.dataset.gReadonly = "";
  assert.equal(builder.add("text"), false);
  assert.equal(builder.update(undefined, { label: "Blocked" }), false);
  assert.equal(builder.remove(), false);
  assert.equal(builder.items()[0].label, "Notes");
  assert.ok(changes.some(({ reason, count }) => reason === "add" && count === 2));
  assert.ok(changes.some(({ reason, count }) => reason === "load" && count === 1));
  runtime.destroy(root); root.remove();
});

test("date picker renders a constrained calendar and synchronizes pointer, preset, navigation, and keyboard selection", async () => {
  const root = document.createElement("div");
  root.className = "g-date-picker g-date-picker-with-presets g-date-picker-with-footer";
  root.dataset.gPicker = "";
  root.dataset.gDatePickerValue = "2026-09-12";
  root.dataset.gDatePickerMin = "2026-09-01";
  root.dataset.gDatePickerMax = "2026-10-31";
  root.dataset.gDatePickerFirstDay = "1";
  root.innerHTML = `
    <div class="g-date-picker-presets"><button type="button" data-g-date-picker-preset="tomorrow">Tomorrow</button></div>
    <header class="g-date-picker-header"><button type="button" data-g-date-picker-previous>Previous</button><h3 class="g-date-picker-title" data-g-date-picker-title>Month</h3><button type="button" data-g-date-picker-next>Next</button></header>
    <div class="g-calendar-grid"><span data-original>Fallback</span></div>
    <input type="hidden" data-g-date-picker-output>
    <footer class="g-date-picker-footer"><span class="g-date-picker-status" data-g-date-picker-status>Empty</span><button type="button" data-g-date-picker-clear>Clear</button><button type="button" data-g-date-picker-today>Today</button></footer>`;
  const changes = [];
  root.addEventListener("gardener:pickerchange", (event) => changes.push(event.detail));
  document.body.append(root);
  runtime.init(root);
  const picker = runtime.getInstance(root, "picker");
  assert.ok(picker);
  assert.equal(root.querySelectorAll(".g-calendar-weekday").length, 7);
  assert.equal(root.querySelectorAll(".g-calendar-day").length, 42);
  assert.match(root.querySelector(".g-date-picker-title").textContent, /2026/u);
  assert.equal(root.querySelector("[data-g-date-picker-output]").value, "2026-09-12");
  assert.equal(root.querySelector('.g-calendar-day[aria-selected="true"]').dataset.gDate, "2026-09-12");
  assert.ok([...root.querySelectorAll(".g-calendar-day.is-outside")].some((day) => day.disabled));

  const selected = root.querySelector('[data-g-date="2026-09-12"]');
  selected.focus();
  selected.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  await Promise.resolve();
  assert.equal(document.activeElement?.dataset.gDate, "2026-09-13");
  assert.equal(root.querySelector("[data-g-date-picker-output]").value, "2026-09-12");

  root.querySelector('[data-g-date="2026-09-15"]').click();
  assert.equal(root.querySelector("[data-g-date-picker-output]").value, "2026-09-15");
  assert.equal(changes.at(-1).value, "2026-09-15");
  assert.equal(changes.at(-1).reason, "day");
  root.querySelector("[data-g-date-picker-next]").click();
  assert.match(root.querySelector(".g-date-picker-title").textContent, /10|Oct/u);
  assert.equal(changes.at(-1).reason, "next-month");
  picker.choose("2026-10-20", "api");
  assert.equal(root.querySelector("[data-g-date-picker-output]").value, "2026-10-20");
  picker.clear();
  assert.equal(root.classList.contains("is-empty"), true);
  assert.equal(root.querySelector("[data-g-date-picker-output]").value, "");
  runtime.destroy(root);
  assert.equal(root.querySelector("[data-original]").textContent, "Fallback");
  root.remove();
});

test("date picker range mode orders endpoints and exposes partial and complete states", () => {
  const root = document.createElement("div");
  root.className = "g-date-picker";
  root.dataset.gPicker = "";
  root.dataset.gDatePickerMode = "range";
  root.dataset.gDatePickerValue = "2026-09-10";
  root.innerHTML = '<h3 class="g-date-picker-title" data-g-date-picker-title>Month</h3><div class="g-calendar-grid"></div><input type="hidden" data-g-date-picker-output><span class="g-date-picker-status" data-g-date-picker-status></span>';
  document.body.append(root);
  runtime.init(root);
  const picker = runtime.getInstance(root, "picker");
  assert.equal(root.classList.contains("is-partial"), true);
  root.querySelector('[data-g-date="2026-09-05"]').click();
  assert.equal(root.querySelector("[data-g-date-picker-output]").value, "2026-09-05/2026-09-10");
  assert.equal(root.classList.contains("is-complete"), true);
  assert.equal(root.querySelectorAll('.g-calendar-day[aria-selected="true"]').length, 2);
  assert.ok(root.querySelectorAll(".g-calendar-day.is-in-range").length > 0);
  runtime.destroy(root);
  root.remove();
});

test("time picker synchronizes typed values, constrained columns, pointer choices, keyboard steps, and clearing", async () => {
  const root = document.createElement("div");
  root.className = "g-time-picker g-time-picker-inline g-time-picker-with-presets g-time-picker-with-footer";
  root.dataset.gWheelPicker = "";
  root.dataset.gTimePickerValue = "13:30";
  root.dataset.gTimePickerMin = "09:00";
  root.dataset.gTimePickerMax = "18:00";
  root.innerHTML = `
    <div class="g-time-picker-control" data-g-time-picker-trigger><span class="g-time-picker-icon"></span><input class="g-time-picker-input" data-g-time-picker-input><button type="button" data-g-time-picker-clear>Clear</button></div>
    <div class="g-time-picker-panel"><div class="g-time-picker-presets"><button type="button" data-g-time-picker-preset="morning">Morning</button></div><div class="g-time-picker-columns"><span data-original>Fallback</span></div><footer class="g-time-picker-footer"><span data-g-time-picker-status>Empty</span><button type="button" data-g-time-picker-now>Now</button><button type="button" data-g-time-picker-apply>Apply</button></footer></div>
    <input type="hidden" data-g-time-picker-output>`;
  const changes = [];
  root.addEventListener("gardener:wheelchange", (event) => changes.push(event.detail));
  document.body.append(root);
  runtime.init(root);
  const picker = runtime.getInstance(root, "wheel-picker");
  assert.ok(picker);
  assert.equal(root.querySelectorAll("[data-g-wheel-column]").length, 2);
  assert.deepEqual(picker.values(), ["13", "30"]);
  assert.equal(root.querySelector("[data-g-time-picker-output]").value, "13:30");
  assert.equal(root.querySelector("[data-g-time-picker-input]").value, "13:30");
  assert.equal(root.querySelector('[data-g-time-part="hour"][data-g-value="08"]').disabled, true);
  assert.equal(root.querySelector('[data-g-time-part="hour"][data-g-value="18"]').disabled, false);

  root.querySelector('[data-g-time-part="hour"][data-g-value="14"]').click();
  assert.equal(root.querySelector("[data-g-time-picker-output]").value, "14:30");
  assert.equal(changes.at(-1).value, "14:30");
  const minute = root.querySelector('[data-g-time-part="minute"][data-g-value="30"]');
  minute.focus();
  minute.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
  await Promise.resolve();
  assert.equal(root.querySelector("[data-g-time-picker-output]").value, "14:31");
  assert.equal(changes.at(-1).reason, "keyboard");

  const input = root.querySelector("[data-g-time-picker-input]");
  input.value = "08:00";
  input.dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(root.classList.contains("is-invalid"), true);
  assert.equal(root.querySelector("[data-g-time-picker-output]").value, "14:31");
  input.value = "17:45";
  input.dispatchEvent(new browserWindow.Event("change", { bubbles: true }));
  assert.equal(root.querySelector("[data-g-time-picker-output]").value, "17:45");
  root.querySelector("[data-g-time-picker-clear]").click();
  assert.equal(root.classList.contains("is-empty"), true);
  assert.equal(root.querySelector("[data-g-time-picker-output]").value, "");
  runtime.destroy(root);
  assert.equal(root.querySelector("[data-original]").textContent, "Fallback");
  root.remove();
});

test("time picker supports second precision and twelve-hour period selection", () => {
  const root = document.createElement("div");
  root.className = "g-time-picker g-time-picker-inline g-time-picker-with-seconds g-time-picker-twelve-hour";
  root.dataset.gWheelPicker = "";
  root.dataset.gTimePickerValue = "23:15:30";
  root.dataset.gTimePickerMinuteStep = "15";
  root.dataset.gTimePickerSecondStep = "30";
  root.innerHTML = '<div class="g-time-picker-control"><input class="g-time-picker-input" data-g-time-picker-input></div><div class="g-time-picker-panel"><div class="g-time-picker-columns"></div><span data-g-time-picker-status></span></div><input type="hidden" data-g-time-picker-output>';
  document.body.append(root);
  runtime.init(root);
  assert.equal(root.querySelectorAll("[data-g-wheel-column]").length, 4);
  assert.equal(root.querySelector('[data-g-time-part="hour"][aria-selected="true"]').textContent, "11");
  assert.equal(root.querySelector('[data-g-time-part="period"][aria-selected="true"]').textContent, "PM");
  assert.equal(root.querySelectorAll('[data-g-time-part="minute"] [role="option"]').length, 4);
  root.querySelector('[data-g-time-part="period"][data-g-value="AM"]').click();
  assert.equal(root.querySelector("[data-g-time-picker-output]").value, "11:15:30");
  runtime.destroy(root);
  root.remove();
});

test("disabled composite options stay inert and multi-choice initialization preserves every selection", () => {
  const host = document.createElement("section");
  host.innerHTML = `
    <div data-g-dropdown><button type="button" data-g-dropdown-trigger>Menu</button><div data-g-dropdown-menu hidden><button type="button" role="menuitem" aria-disabled="true">Locked</button><button type="button" role="menuitem">Open</button></div></div>
    <div data-g-combobox><input><div role="listbox"><button type="button" role="option" data-g-value="locked" aria-disabled="true">Locked</button><button type="button" role="option" data-g-value="open">Open</button></div></div>
    <div data-g-picker><button type="button" data-g-picker-trigger>Pick</button><div data-g-picker-panel><button type="button" data-g-picker-option data-g-value="locked" aria-disabled="true">Locked</button><button type="button" data-g-picker-option data-g-value="open">Open</button></div><input data-g-picker-output></div>
    <div data-g-saved-choice data-g-multiple><button type="button" data-g-saved-choice-item data-g-value="one" aria-pressed="true">One</button><button type="button" data-g-saved-choice-item data-g-value="two" aria-pressed="true">Two</button><button type="button" data-g-saved-choice-item data-g-value="locked" aria-disabled="true">Locked</button></div>
    <div data-g-transfer><div data-g-transfer-source><div data-g-transfer-option data-g-value="locked" aria-disabled="true">Locked</div><div data-g-transfer-option data-g-value="open">Open</div></div><button type="button" data-g-transfer-move="all-to-target">Move all</button><div data-g-transfer-target></div></div>`;
  document.body.append(host); runtime.init(host);

  const dropdown = host.querySelector("[data-g-dropdown]");
  runtime.getInstance(dropdown, "dropdown").open();
  dropdown.querySelector("[aria-disabled='true']").click();
  assert.equal(dropdown.querySelector("[data-g-dropdown-menu]").hidden, false);

  const combobox = host.querySelector("[data-g-combobox]");
  combobox.querySelector("[aria-disabled='true']").dispatchEvent(new browserWindow.Event("pointerdown", { bubbles: true }));
  assert.equal(combobox.querySelector("input").value, "");

  const picker = host.querySelector("[data-g-picker]");
  picker.querySelector("[aria-disabled='true']").click();
  assert.equal(picker.querySelector("[data-g-picker-output]").value, "");

  const choices = host.querySelector("[data-g-saved-choice]");
  assert.deepEqual([...choices.querySelectorAll("[aria-pressed='true']")].map((item) => item.dataset.gValue), ["one", "two"]);
  choices.querySelector("[aria-disabled='true']").click();
  assert.equal(choices.querySelector("[aria-disabled='true']").getAttribute("aria-pressed"), "false");

  const transfer = host.querySelector("[data-g-transfer]");
  transfer.querySelector("[data-g-transfer-move]").click();
  assert.deepEqual([...transfer.querySelectorAll("[data-g-transfer-target] [data-g-transfer-option]")].map((item) => item.dataset.gValue), ["open"]);
  assert.equal(transfer.querySelector("[data-g-transfer-source] [data-g-transfer-option]").dataset.gValue, "locked");

  runtime.destroy(host); host.remove();
});

test("dropdown normalizes menu semantics, supports full keyboard dismissal, checked items, and nested isolation", async () => {
  const host = document.createElement("section");
  host.style.overflow = "hidden";
  host.innerHTML = `
    <button id="dropdown-outside" type="button">Outside</button>
    <div class="g-dropdown" data-g-dropdown>
      <button type="button" data-g-dropdown-trigger>Actions</button>
      <ul class="g-menu g-dropdown-menu" data-g-dropdown-menu hidden>
        <li><button class="g-menu-item" type="button" aria-disabled="true">Locked</button></li>
        <li><button class="g-menu-item" type="button" data-g-value="rename">Rename</button></li>
        <li><button class="g-menu-item" type="button" role="menuitemcheckbox" aria-checked="false" data-g-value="hidden" data-g-keep-open="true">Hidden files</button></li>
        <li class="g-menu-submenu g-dropdown" data-g-dropdown>
          <button class="g-menu-item" type="button" data-g-dropdown-trigger aria-haspopup="menu">Export</button>
          <ul class="g-menu g-dropdown-menu g-submenu-menu" data-g-dropdown-menu hidden><li><button class="g-menu-item" type="button" data-g-value="pdf">PDF</button></li></ul>
        </li>
        <li><button class="g-menu-item" type="button" data-g-value="delete">Delete</button></li>
      </ul>
    </div>`;
  document.body.append(host); runtime.init(host);
  const root = host.querySelector("[data-g-dropdown]"); const trigger = root.querySelector(":scope > [data-g-dropdown-trigger]"); const menu = root.querySelector(":scope > [data-g-dropdown-menu]");
  const instance = runtime.getInstance(root, "dropdown"); const changes = [];
  root.addEventListener("gardener:change", (event) => changes.push(event.detail.value));
  assert.equal(trigger.getAttribute("aria-haspopup"), "menu"); assert.equal(trigger.getAttribute("aria-controls"), menu.id); assert.equal(menu.getAttribute("aria-labelledby"), trigger.id);
  assert.equal(menu.getAttribute("role"), "menu"); assert.ok([...menu.querySelectorAll(":scope > li > .g-menu-item")].every((item) => item.getAttribute("role")?.startsWith("menuitem")));
  trigger.focus(); trigger.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); await Promise.resolve();
  assert.equal(instance.isOpen(), true); assert.equal(menu.hidden, false); assert.equal(document.activeElement.textContent, "Rename");
  assert.equal(host.classList.contains("g-dropdown-open-ancestor"), true);
  document.activeElement.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true })); assert.equal(document.activeElement.textContent, "Delete");
  document.activeElement.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "h", bubbles: true, cancelable: true })); assert.equal(document.activeElement.textContent, "Hidden files");
  document.activeElement.click(); assert.equal(document.activeElement.getAttribute("aria-checked"), "true"); assert.equal(menu.hidden, false); assert.deepEqual(changes, ["hidden"]);
  document.activeElement.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(menu.hidden, true); assert.equal(document.activeElement, trigger);
  assert.equal(host.classList.contains("g-dropdown-open-ancestor"), false);
  trigger.click(); await Promise.resolve(); const nested = root.querySelector(".g-menu-submenu"); const nestedTrigger = nested.querySelector(":scope > [data-g-dropdown-trigger]"); const nestedMenu = nested.querySelector(":scope > [data-g-dropdown-menu]");
  nestedTrigger.click(); await Promise.resolve(); assert.equal(menu.hidden, false); assert.equal(nestedMenu.hidden, false);
  nestedMenu.querySelector(".g-menu-item").click(); assert.equal(nestedMenu.hidden, true); assert.equal(menu.hidden, false); assert.deepEqual(changes, ["hidden", "pdf"]);
  assert.equal(document.activeElement, nestedTrigger);
  nestedTrigger.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(menu.hidden, true); assert.equal(document.activeElement, trigger);
  trigger.click(); await Promise.resolve(); document.activeElement.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Tab", bubbles: true })); assert.equal(menu.hidden, true);
  trigger.click(); await Promise.resolve(); host.querySelector("#dropdown-outside").dispatchEvent(new browserWindow.Event("pointerdown", { bubbles: true })); assert.equal(menu.hidden, true);
  runtime.destroy(host); host.remove();
});

test("command palette filters grouped commands, navigates active descendants, selects, clears, and restores focus", () => {
  const host = document.createElement("section");
  host.innerHTML = `
    <button id="command-trigger" type="button" data-g-command-trigger="test-command">Commands</button>
    <div id="test-command" class="g-command-palette-overlay" data-g-command-palette data-g-shortcut="mod+k" hidden aria-label="Project commands">
      <section class="g-command-palette">
        <div class="g-command-search"><input class="g-command-input" aria-label="Search commands"><button class="g-command-clear" type="button">Clear</button></div>
        <div class="g-command-results">
          <section class="g-command-group"><h2 class="g-command-group-label">Create</h2><div class="g-command-list">
            <button class="g-command-item" type="button" data-g-value="new" data-g-keywords="add document"><span class="g-command-item-title">New page</span></button>
            <button class="g-command-item" type="button" data-g-value="locked" disabled><span class="g-command-item-title">Locked action</span></button>
          </div></section>
          <section class="g-command-group"><h2 class="g-command-group-label">Navigate</h2><div class="g-command-list">
            <button class="g-command-item" type="button" data-g-value="settings" data-g-keywords="preferences"><span class="g-command-item-title">Open settings</span></button>
          </div></section>
          <div class="g-command-empty" hidden>No commands</div>
        </div>
        <footer class="g-command-footer"><span class="g-command-count"></span></footer>
      </section>
    </div>`;
  document.body.append(host); runtime.init(host);
  const root = host.querySelector("[data-g-command-palette]"); const trigger = host.querySelector("[data-g-command-trigger]"); const input = root.querySelector(".g-command-input"); const clear = root.querySelector(".g-command-clear"); const commands = [...root.querySelectorAll(".g-command-item")];
  const instance = runtime.getInstance(root, "command-palette"); const selections = []; const filters = [];
  root.addEventListener("gardener:commandselect", (event) => selections.push(event.detail));
  root.addEventListener("gardener:filter", (event) => filters.push(event.detail));
  assert.equal(root.getAttribute("role"), "dialog"); assert.equal(root.getAttribute("aria-modal"), "true"); assert.equal(root.querySelector(".g-command-results").getAttribute("role"), "listbox");
  assert.ok(commands.every((command) => command.getAttribute("role") === "option")); assert.equal(commands[1].getAttribute("aria-disabled"), "true");
  trigger.click(); assert.equal(instance.isOpen(), true); assert.equal(root.hidden, false); assert.equal(document.activeElement, input); assert.equal(trigger.getAttribute("aria-expanded"), "true");
  input.value = "pref"; input.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.deepEqual(commands.map((command) => command.hidden), [true, true, false]); assert.equal(instance.active(), commands[2]); assert.equal(input.getAttribute("aria-activedescendant"), commands[2].id); assert.equal(root.querySelector(".g-command-count").textContent, "1");
  clear.click(); assert.equal(input.value, ""); assert.deepEqual(commands.map((command) => command.hidden), [false, false, false]); assert.equal(instance.active(), commands[0]);
  input.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(instance.active(), commands[2]);
  input.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true })); assert.equal(instance.isOpen(), false); assert.equal(document.activeElement, trigger); assert.equal(selections.at(-1).value, "settings"); assert.equal(selections.at(-1).reason, "keyboard");
  instance.open(trigger); instance.query("missing"); assert.equal(root.classList.contains("is-empty"), true); assert.equal(root.querySelector(".g-command-empty").hidden, false); assert.equal(instance.active(), null);
  instance.query(""); assert.equal(instance.select("locked"), null); assert.equal(instance.select("settings"), commands[2]); assert.equal(instance.isOpen(), false);
  trigger.focus(); document.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true })); assert.equal(instance.isOpen(), true);
  document.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(instance.isOpen(), false); assert.equal(document.activeElement, trigger); assert.ok(filters.length >= 4);
  root.setAttribute("aria-disabled", "true"); trigger.click(); assert.equal(instance.isOpen(), false); assert.equal(root.hidden, true);
  runtime.destroy(host); host.remove();
});

test("stepper normalizes current state, navigates available steps, completes progress, and exposes an API", () => {
  const host = document.createElement("section");
  host.innerHTML = `
    <ol class="g-stepper g-stepper-navigation" data-g-stepper data-g-auto-complete="true" aria-label="Setup progress">
      <li class="g-step is-complete" data-g-value="account"><button class="g-step-action" type="button"><span class="g-step-indicator">✓</span><span class="g-step-title">Account</span></button></li>
      <li class="g-step is-active" data-g-value="profile"><button class="g-step-action" type="button"><span class="g-step-indicator">2</span><span class="g-step-title">Profile</span></button></li>
      <li class="g-step is-disabled" data-g-value="billing"><button class="g-step-action" type="button"><span class="g-step-indicator">3</span><span class="g-step-title">Billing</span></button></li>
      <li class="g-step" data-g-value="review"><button class="g-step-action" type="button"><span class="g-step-indicator">4</span><span class="g-step-title">Review</span></button></li>
    </ol>`;
  document.body.append(host); runtime.init(host);
  const root = host.querySelector("[data-g-stepper]"); const items = [...root.querySelectorAll(".g-step")]; const actions = items.map((step) => step.querySelector(".g-step-action"));
  const instance = runtime.getInstance(root, "stepper"); const changes = [];
  root.addEventListener("gardener:stepchange", (event) => changes.push(event.detail));
  assert.equal(instance.current(), items[1]);
  assert.equal(items[1].getAttribute("aria-current"), "step"); assert.deepEqual(actions.map((action) => action.tabIndex), [-1, 0, -1, -1]);
  actions[1].focus(); actions[1].dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, actions[3]); assert.equal(instance.current(), items[1]);
  actions[3].click(); assert.equal(instance.current(), items[3]); assert.equal(items[3].getAttribute("aria-current"), "step");
  assert.equal(items[0].classList.contains("is-complete"), true); assert.equal(items[1].classList.contains("is-complete"), true); assert.equal(items[2].classList.contains("is-complete"), false);
  assert.equal(changes.at(-1).value, "review"); assert.equal(changes.at(-1).previousIndex, 1); assert.equal(changes.at(-1).reason, "pointer");
  assert.equal(instance.previous(false), items[1]); assert.equal(instance.current(), items[1]); assert.equal(instance.next(false), items[3]);
  root.setAttribute("dir", "rtl"); actions[3].focus(); actions[3].dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })); assert.equal(document.activeElement, actions[1]);
  assert.equal(instance.select("billing"), null); assert.equal(instance.refresh(), items[3]);
  runtime.destroy(host); host.remove();
});

test("tree select expands, searches, cascades, reports indeterminate parents, emits leaf values, and clears", () => {
  const host = document.createElement("section");
  host.innerHTML = `
    <div class="g-tree-select" data-g-picker data-g-picker-tree data-g-picker-multiple data-g-picker-cascade>
      <div class="g-picker-control" data-g-picker-trigger tabindex="0"><span data-g-picker-values></span><input data-g-picker-input><button type="button" data-g-picker-clear>Clear</button></div>
      <div data-g-picker-panel hidden>
        <div role="tree">
          <div role="treeitem" data-g-picker-option data-g-value="engineering" data-g-label="Engineering" aria-expanded="true">
            <button type="button" data-g-tree-toggle>Toggle</button><span class="g-tree-node-label">Engineering</span>
            <div role="group">
              <div role="treeitem" data-g-picker-option data-g-value="frontend" data-g-label="Frontend"><span class="g-tree-node-label">Frontend</span></div>
              <div role="treeitem" data-g-picker-option data-g-value="api" data-g-label="API"><span class="g-tree-node-label">API</span></div>
            </div>
          </div>
          <div role="treeitem" data-g-picker-option data-g-value="finance" data-g-label="Finance"><span class="g-tree-node-label">Finance</span></div>
        </div>
        <span data-g-picker-empty hidden>No results</span>
      </div>
      <input data-g-picker-output>
    </div>`;
  document.body.append(host); runtime.init(host);
  const root = host.querySelector(".g-tree-select");
  const parent = root.querySelector('[data-g-value="engineering"]');
  const frontend = root.querySelector('[data-g-value="frontend"]');
  const api = root.querySelector('[data-g-value="api"]');
  const output = root.querySelector("[data-g-picker-output]");
  const changes = [];
  root.addEventListener("gardener:pickerchange", (event) => changes.push(event.detail));

  frontend.click();
  assert.equal(frontend.getAttribute("aria-checked"), "true");
  assert.equal(parent.getAttribute("aria-checked"), "mixed");
  assert.equal(output.value, "frontend");
  api.click();
  assert.equal(parent.getAttribute("aria-checked"), "true");
  assert.equal(output.value, "frontend,api");

  root.querySelector("[data-g-tree-toggle]").click();
  assert.equal(parent.getAttribute("aria-expanded"), "false");
  assert.equal(parent.querySelector(":scope > [role='group']").hidden, true);
  parent.focus();
  parent.dispatchEvent(new browserWindow.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  assert.equal(parent.getAttribute("aria-expanded"), "true");

  const search = root.querySelector("[data-g-picker-input]");
  search.value = "API";
  search.dispatchEvent(new browserWindow.Event("input", { bubbles: true }));
  assert.equal(api.hidden, false);
  assert.equal(frontend.hidden, true);
  assert.equal(parent.hidden, false);

  root.querySelector("[data-g-picker-clear]").click();
  assert.equal(output.value, "");
  assert.equal(parent.getAttribute("aria-checked"), "false");
  assert.equal(frontend.getAttribute("aria-selected"), "false");
  assert.equal(changes.at(-1).reason, "clear");
  runtime.destroy(host); host.remove();
});

test("dismissed surfaces restore focus to the next useful control", async () => {
  const host = document.createElement("section");
  host.innerHTML = '<button type="button">Before</button><aside data-g-dismissible><button type="button" data-g-dismiss>Close</button></aside><button type="button" id="dismiss-next">After</button>';
  document.body.append(host); runtime.start(document, { observe: false });
  const close = host.querySelector("[data-g-dismiss]"); close.focus(); close.click(); await Promise.resolve();
  assert.equal(host.querySelector("[data-g-dismissible]"), null); assert.equal(document.activeElement, host.querySelector("#dismiss-next"));
  host.remove();
});

for (const contract of publicApi.javascript.behaviorContracts) {
  test(`behavior unit: ${contract.name} initializes, is idempotent, destroys, and reinitializes`, () => {
    const selector = contract.name === "carousel" ? "[data-g-carousel]:not([data-g-media-options]):not([data-g-mobile-options]):not([data-g-commerce-options])" : `[data-g-${contract.name}]`;
    const root = document.querySelector(selector);
    assert.ok(root, `missing DOM fixture for ${contract.name}`);

    runtime.destroy(root);
    assert.equal(runtime.getInstance(root, contract.name), null);

    runtime.init(root);
    const first = runtime.getInstance(root, contract.name);
    assert.ok(first, `${contract.name} factory returned no instance`);
    assert.deepEqual(Object.keys(first), contract.instanceMembers, `${contract.name} has undocumented or missing instance members`);
    for (const member of contract.instanceMembers) assert.ok(member in first, `${contract.name} is missing ${member}`);

    runtime.init(root);
    assert.strictEqual(runtime.getInstance(root, contract.name), first, `${contract.name} initialization is not idempotent`);

    runtime.destroy(root);
    assert.equal(runtime.getInstance(root, contract.name), null, `${contract.name} was not removed from the instance store`);

    runtime.init(root);
    const second = runtime.getInstance(root, contract.name);
    assert.ok(second, `${contract.name} did not reinitialize after destroy`);
    assert.notStrictEqual(second, first, `${contract.name} reused a destroyed instance`);
  });
}

test("DOM lifecycle: added behavior roots initialize automatically", async () => {
  runtime.destroy(document);
  document.body.replaceChildren();
  runtime.observe();
  const root = accordionFixture();
  document.body.append(root);
  await settleMutations();
  assert.ok(runtime.getInstance(root, "accordion"));
});

test("DOM lifecycle: adding and removing a behavior attribute initializes and destroys", async () => {
  const root = accordionFixture(false);
  document.body.append(root);
  await settleMutations();
  assert.equal(runtime.getInstance(root, "accordion"), null);

  root.dataset.gAccordion = "";
  await settleMutations();
  assert.ok(runtime.getInstance(root, "accordion"));

  delete root.dataset.gAccordion;
  await settleMutations();
  assert.equal(runtime.getInstance(root, "accordion"), null);
  root.remove();
});

test("DOM lifecycle: removing a subtree destroys its stored instances", async () => {
  const root = accordionFixture();
  document.body.append(root);
  await settleMutations();
  assert.ok(runtime.getInstance(root, "accordion"));
  root.remove();
  await settleMutations();
  assert.equal(runtime.getInstance(root, "accordion"), null);
});

test("DOM lifecycle: scoped destroy leaves sibling instances intact", async () => {
  const first = accordionFixture();
  const second = accordionFixture();
  document.body.append(first, second);
  await settleMutations();
  runtime.destroy(first);
  assert.equal(runtime.getInstance(first, "accordion"), null);
  assert.ok(runtime.getInstance(second, "accordion"));
  first.remove();
  second.remove();
});

test("DOM lifecycle: one element can own multiple behavior instances", async () => {
  const element = document.createElement("button");
  element.dataset.gCopy = "";
  element.dataset.gCopyValue = "Gardenerim";
  element.dataset.gScrollTop = "";
  document.body.append(element);
  await settleMutations();
  const instances = runtime.getInstance(element);
  assert.deepEqual(Object.keys(instances).sort(), ["copy", "scroll-top"]);
  runtime.destroy(element);
  assert.equal(runtime.getInstance(element), null);
  element.remove();
});

test("DOM lifecycle: initialization emits a bubbling contract event", async () => {
  const host = document.createElement("div");
  const root = accordionFixture();
  let detail;
  host.addEventListener("gardener:init", (event) => { detail = event.detail; }, { once: true });
  host.append(root);
  document.body.append(host);
  await settleMutations();
  assert.equal(detail?.name, "accordion");
  assert.strictEqual(detail?.instance, runtime.getInstance(root, "accordion"));
  host.remove();
});

test("DOM lifecycle: public destroy clears every instance in a document", async () => {
  const roots = [accordionFixture(), accordionFixture()];
  document.body.append(...roots);
  await settleMutations();
  runtime.destroy(document);
  for (const root of roots) assert.equal(runtime.getInstance(root, "accordion"), null);
});

test("scoped observer initializes a large batch and disconnects cleanly", async () => {
  runtime.disconnect();
  const root = document.createElement("section");
  document.body.append(root);
  const binding = runtime.observe(root);
  const fragment = document.createDocumentFragment();
  const nodes = Array.from({ length: 1000 }, () => accordionFixture());
  fragment.append(...nodes);
  const startedAt = performance.now();
  root.append(fragment);
  await settleMutations();
  assert.ok(runtime.getInstance(nodes[0], "accordion"));
  assert.ok(runtime.getInstance(nodes.at(-1), "accordion"));
  assert.ok(performance.now() - startedAt < 2500, "1000-node observer batch exceeded 2.5 seconds");
  binding.disconnect();
  const disconnected = accordionFixture();
  root.append(disconnected);
  await settleMutations();
  assert.equal(runtime.getInstance(disconnected, "accordion"), null);
  runtime.destroy(root);
  root.remove();
  runtime.start(document);
});

after(async () => {
  runtime.destroy(document);
  await browserWindow.happyDOM.abort();
  browserWindow.close();
});
