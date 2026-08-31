import { Window } from "happy-dom";

const packageName = process.argv[2];
if (!packageName) throw new Error("AngularJS package alias is required");
const window = new Window({ url: "http://localhost/" });
for (const [name, value] of Object.entries({
  window, document: window.document, Node: window.Node, Element: window.Element, HTMLElement: window.HTMLElement,
  HTMLInputElement: window.HTMLInputElement, HTMLTextAreaElement: window.HTMLTextAreaElement, HTMLSelectElement: window.HTMLSelectElement,
  HTMLButtonElement: window.HTMLButtonElement, CustomEvent: window.CustomEvent, Event: window.Event, MutationObserver: window.MutationObserver,
})) Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
await import(`${packageName}/angular.js`);
const angular = window.angular;
const library = await import("../dist/index.js");
const moduleName = library.createGardenerimAngularJS(angular, { moduleName: `gardener.version.${angular.version.full}`, components: ["button", "input"] });
const injector = angular.injector(["ng", moduleName]);
const scope = injector.get("$rootScope").$new();
scope.model = { value: "ready" };
const element = injector.get("$compile")('<section><button g-button gardener-variant="primary">Save</button><input g-input ng-model="model.value"></section>')(scope);
document.body.append(element[0]);
scope.$digest();
const result = { version: angular.version.full, buttonClass: element[0].querySelector("button").className, value: element[0].querySelector("input").value };
scope.$destroy(); element.remove();
console.log(JSON.stringify(result));
