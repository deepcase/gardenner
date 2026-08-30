import type angular from "angular";
import {
  GButtonDirective,
  GInputDirective,
  componentByDirectiveName,
  createGardenerAngularJS,
  type GardenerAngularJSOptions,
  type GardenerAngularJSComponentExportName,
  type GardenerComponentHandle,
  type GardenerThemeState,
} from "@gardenerim/angularjs";

declare const ng: angular.IAngularStatic;
const options: GardenerAngularJSOptions = { components: ["button", "gInput"], initialize: true };
const exportName: GardenerAngularJSComponentExportName = "GButtonDirective";
// @ts-expect-error unknown component selectors must fail at compile time
const invalidOptions: GardenerAngularJSOptions = { components: ["not-a-component"] };
const moduleName: string = createGardenerAngularJS(ng, options);
ng.module("consumer", [moduleName]).directive("customButton", GButtonDirective).directive("customInput", GInputDirective);
const definition = componentByDirectiveName.get("gButton");
const handle = null as GardenerComponentHandle | null;
const theme: GardenerThemeState = { theme: "garden", mode: "light", shape: "small" };
void [definition, handle, theme, exportName, invalidOptions];
