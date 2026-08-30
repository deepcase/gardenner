import "angular/angular.js";
import type angular from "angular";
import { componentCatalog, createGardenerAngularJS } from "@gardenerim/angularjs";
import "@gardenerim/angularjs/style.css";

declare global {
  interface Window {
    angular: angular.IAngularStatic;
    __GARDENER_ANGULARJS_EXAMPLE__: { ready: boolean; components: number; clicks: number; valueEvents: number; selectEvents: number; angularVersion: string };
  }
}

const ng = window.angular;
const moduleName = createGardenerAngularJS(ng);
const status = window.__GARDENER_ANGULARJS_EXAMPLE__ = { ready: false, components: componentCatalog.length, clicks: 0, valueEvents: 0, selectEvents: 0, angularVersion: ng.version.full };

class AppController {
  keyword = "Gardener";
  channels = ["email"];
  clicks = 0;
  increment(): void { this.clicks += 1; status.clicks = this.clicks; }
  onValueChange(): void { status.valueEvents += 1; }
  onSelectChange(): void { status.selectEvents += 1; }
}

ng.module("gardener.example", [moduleName]).controller("AppController", AppController);
ng.bootstrap(document, ["gardener.example"], { strictDi: true });
status.ready = true;
