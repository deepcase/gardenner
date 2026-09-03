# 2.0.0 → 2.1.0

Gardenerim 2.1.0 is an additive minor release. Existing component names, CSS classes, `data-g-*` behavior attributes, DOM events, theme names, and 2.x framework integrations remain compatible.

## Runtime localization

Runtime-generated labels now use one catalog shared by CSS, Vue, React, AngularJS, and Blazor. Built-in locales are `en`, `zh-CN`, `ja`, `ko`, `es`, `fr`, and `de`; unsupported locales fall back to English.

```ts
import { configure } from "@gardenerim/css/runtime";

configure({
  locale: [localStorage.getItem("locale") ?? "", ...navigator.languages],
  messages: { "toast.close": "Dismiss notification" },
});
```

`configure`, `getConfiguration`, and `supportedLocales` are also re-exported by the Vue, React, and AngularJS adapters. Vue and React providers accept `locale` and `messages`; Blazor provides `GardenerimLocalizationService`.

## Runtime lifecycle

Automatic startup remains enabled for compatibility. Applications that own their DOM lifecycle can set `globalThis.GardenerimAutoStart = false` before importing the runtime, or add `data-g-runtime="manual"` to `<html>`, then call `start(root)` themselves. `observe(root)` is scoped, returns a disconnect handle, batches DOM mutations, and watches behavior attributes only. Use `stop()` or `disconnect()` during application teardown.

## AngularJS

`@gardenerim/angularjs` is now explicitly a legacy migration adapter. AngularJS is end-of-life and has unresolved upstream security advisories. Existing users should avoid untrusted templates, enforce a strict content security policy, and plan migration. The 2.1.0 CI exception accepts only advisories directly reported against `angular` when no fix exists; any other vulnerable dependency fails the release gate.

## Release and supply chain

Repository metadata now points to the canonical `deepcase/gardenner` repository. npm publishing uses GitHub OIDC with provenance and no long-lived registry token. Security CI adds dependency review, CodeQL, npm/NuGet audits, package-signature verification, CycloneDX SBOMs, and secret scanning. Future release tags use `v<version>`.

For admin applications, continue using component packs or `build:custom` rather than the one-megabyte full catalog. The custom builder resolves component ownership and dependencies and emits a machine-readable integrity manifest.
