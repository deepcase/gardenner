import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Window } from "happy-dom";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const examplesRoot = join(projectRoot, "examples");

export const browserWindow = new Window({
  url: "http://gardener.test/",
  width: 1280,
  height: 800
});

const globalNames = [
  "document", "navigator", "location", "history", "Element", "HTMLElement", "Node",
  "CustomEvent", "Event", "KeyboardEvent", "MouseEvent", "PointerEvent",
  "IntersectionObserver", "ResizeObserver", "CSS"
];

for (const name of globalNames) {
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value: browserWindow[name] });
}

for (const [name, value] of Object.entries({
  window: browserWindow,
  getComputedStyle: browserWindow.getComputedStyle.bind(browserWindow),
  requestAnimationFrame: browserWindow.requestAnimationFrame.bind(browserWindow),
  cancelAnimationFrame: browserWindow.cancelAnimationFrame.bind(browserWindow),
  matchMedia: browserWindow.matchMedia.bind(browserWindow)
})) {
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
}

export const NativeMutationObserver = browserWindow.MutationObserver;
Object.defineProperty(globalThis, "MutationObserver", { configurable: true, writable: true, value: undefined });

function bodyOf(html) {
  return html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]?.replace(/<script[\s\S]*?<\/script>/gi, "") || "";
}

export function mountBehaviorFixtures() {
  for (const file of readdirSync(examplesRoot).filter((name) => name.endsWith(".html")).sort()) {
    const wrapper = document.createElement("section");
    wrapper.dataset.gTestSource = file;
    wrapper.innerHTML = bodyOf(readFileSync(join(examplesRoot, file), "utf8"));
    document.body.append(wrapper);
  }

  document.body.insertAdjacentHTML("beforeend", `
    <section data-g-test-source="supplemental-runtime-fixtures">
      <div data-g-drawer hidden><aside class="g-drawer"><button type="button" data-g-close>Close</button></aside></div>
      <div data-g-pull-refresh><span data-g-pull-indicator></span><div class="g-mobile-pull-refresh-content"></div><button type="button" data-g-refresh>Refresh</button></div>
      <div data-g-wheel-picker><div data-g-wheel-column><button type="button" data-g-wheel-option data-g-value="a">A</button></div><input data-g-wheel-output></div>
      <div class="g-toast" data-g-toast data-g-timeout="0"><button type="button" data-g-dismiss>Dismiss</button></div>
    </section>
  `);
}

export function accordionFixture(withBehavior = true) {
  const root = document.createElement("div");
  if (withBehavior) root.dataset.gAccordion = "";
  root.innerHTML = '<button type="button" aria-expanded="false">Section</button><div hidden>Content</div>';
  return root;
}

export const settleMutations = () => new Promise((resolvePromise) => browserWindow.setTimeout(resolvePromise, 0));
