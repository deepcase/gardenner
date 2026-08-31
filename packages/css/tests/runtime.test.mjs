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

await Promise.resolve();
Object.defineProperty(globalThis, "MutationObserver", { configurable: true, writable: true, value: NativeMutationObserver });
mountBehaviorFixtures();

test("runtime catalog exposes the complete current package contract", () => {
  assert.equal(runtime.Gardenerim.version, pkg.version);
  assert.equal(publicApi.contractVersion, pkg.version);
  assert.equal(publicApi.javascript.behaviorContracts.length, 66);
  assert.deepEqual([...runtime.Gardenerim.behaviors], publicApi.javascript.behaviors);
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

after(async () => {
  runtime.destroy(document);
  await browserWindow.happyDOM.abort();
  browserWindow.close();
});
