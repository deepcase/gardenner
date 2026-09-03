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
  assert.equal(publicApi.javascript.behaviorContracts.length, 72);
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

test("small form, range, media, choice and builder controls keep their visible state in sync", () => {
  const host = document.createElement("section");
  host.innerHTML = `
    <div data-g-field-sync><input type="range" value="82"><output data-g-field-output data-g-suffix="%"></output></div>
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
    const root = document.querySelector(`[data-g-${contract.name}]`);
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
