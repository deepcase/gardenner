# Release process

Gardenerim packages are versioned independently. Version 2.1.0 is the current release line: all four npm packages and the NuGet package are published and publicly verified. The [2.1.0 publication receipt](release-2.1-publication.json) records artifact hashes and registry verification. A release is complete only when source, generated output, metadata, docs, and package-manager artifacts agree.

The 2.1.0 release state passed the complete local release matrix. Results and measured artifacts are recorded in the [2.1.0 verification report](release-2.1-verification.md); registry publication details remain in the separate publication receipt.

## Brand and API rename

The requested removal of old Gardener exports was released as 2.0.0 following explicit user authorization. See [migration guide](migration-2.0.md). All JavaScript entrypoints are checked by `npm run verify:exports`; no old brand alias is retained. The frozen 1.0.0 export snapshot is retained for rename mapping, while generated adapter compatibility manifests establish the new 2.0.0 baseline. Future releases still require explicit authorization.

The DataGrid data engine adds runtime code. Its measured initial increase over the existing 0.9 baseline is about 7.5% raw and 11.1% Brotli; only this artifact receives a documented 10% raw / 13% compressed growth allowance and 110 KB raw / 30 KB gzip / 26 KB Brotli absolute limits. CSS and other artifact budgets remain unchanged. Re-measure after any edits; do not silently rebaseline generated metrics.

The Vue packed-file limit is 102 (previously 100): `/contracts` contributes exactly four generated files to the previous 98-file package. Packed/unpacked byte ceilings are unchanged. The public NuGet README now names bundled documentation paths as plain text because the configured public GitHub documentation URL returned 404; publishing a public documentation site is a separate action, not something this local repair claims to have done.

The working tree now uses the Gardenerim brand, including public API names such as `createGardenerimVue`, `GardenerimProvider`, and the `Gardenerim.Blazor` NuGet package and namespace. The npm scope remains `@gardenerim`.

The four npm packages at version 1.0.0 have already been published and must not be overwritten or republished from this changed working tree. Renamed public exports are a breaking change, released with the approved 2.0.0 versions, CSS peer dependency range `>=2.0.0 <3.0.0`, release guards, and changelogs updated together. Do not deploy examples of renamed APIs against the already-published npm 1.0.0 artifacts. The separately named `Gardenerim.Blazor` package was submitted to NuGet at version 1.0.0 on 2026-08-31; do not resubmit or overwrite that version.

## 2.1.0 publication record

- Published on 2026-09-02: `@gardenerim/css`, `@gardenerim/vue`, `@gardenerim/react`, and `@gardenerim/angularjs`, all version 2.1.0 under MIT.
- All four npm `latest` tags point to 2.1.0, and the downloaded public tarballs match the recorded release hashes.
- `Gardenerim.Blazor` 2.1.0 main and symbol packages were accepted by NuGet; the indexed main package passed repository-signature, payload, isolated-consumer, Razor/DI, SSR, and static-asset HTTP verification.
- The complete verification matrix, artifact measurements, public-consumer results, and package hashes are recorded in the [verification report](release-2.1-verification.md) and [publication receipt](release-2.1-publication.json).
- Source tagging, pushing, and website deployment remain separate release actions and are not implied by package publication.

## 2.0.0 publication record

- Published on 2026-08-31: `@gardenerim/css`, `@gardenerim/vue`, `@gardenerim/react`, `@gardenerim/angularjs`, and `Gardenerim.Blazor`, all version 2.0.0 under MIT.
- All four npm `latest` tags point to 2.0.0. Downloaded public tarballs match the frozen release artifacts by byte length, SHA-1, and SHA-512.
- A fresh public-source npm consumer passed all 326 entrypoint resolutions, 4,864 export-name checks, Vue/React SSR, AngularJS compilation/model binding, DataGrid virtualized sorting/selection/editing, and TypeScript contract positive/negative tests.
- npm publication used the existing CLI account with user-completed browser 2FA. Local publication used `--provenance=false`; this release does not claim GitHub Actions provenance or a CI attestation. The repository's CI publishing configuration was not changed.
- NuGet accepted both the main package and symbols. The public main package passed repository-signature and payload verification, isolated-cache restore/publish, 506-component SSR and Razor/DI checks, and HTTP checks for all 44 static assets.
- The complete local release gate passed with Firefox required; an additional .NET 11 Preview consumer build passed. Detailed results are recorded in the [verification report](release-2.0-verification.md) and [publication receipt](release-2.0-publication.json).
- This publication did not push source changes, create a Git tag/release, or deploy the documentation website. Those actions are separate from publishing the package registries.

## NuGet 1.0.0 publication record

- Package: `Gardenerim.Blazor` 1.0.0, owned by `gardenerim`, MIT license, targeting .NET 10.
- NuGet accepted both the `.nupkg` and `.snupkg` uploads on 2026-08-31 with `Created` responses; the push command exited successfully.
- Submitted `.nupkg` SHA-256: `D4701D30A333CFEDA59DA4A68800552E4FBE7898349B63C57AEAF05FAE9DFBCD`.
- Registry page: <https://www.nuget.org/packages/Gardenerim.Blazor/1.0.0>.
- NuGet validation and indexing completed on 2026-08-31. The anonymous package page returns HTTP 200 and the public flat-container index lists 1.0.0.
- A fresh consumer restored exclusively from `https://api.nuget.org/v3/index.json` into an isolated package cache, then built and published successfully on .NET SDK 10.0.400.
- The downloaded package passed `dotnet nuget verify --all` with the NuGet.org repository signature. All 75 submitted payload entries match; NuGet added only `.signature.p7s`.
- Consumer validation passed: 506 component SSR renders, 66 behaviors, 75 events, 7 event guards, 42 themes, Razor compilation and dependency injection, HTTP Razor rendering, and all 43 static CSS/JS assets served with matching payload hashes.
- The scoped publishing key was supplied only to the publishing process environment, not saved to repository files or NuGet configuration.
- Follow-up for a future package version: the NuGet README renderer does not resolve the relative `docs/*.md` links. The documentation files are included in the package, but public README links need verified absolute URLs. Do not overwrite 1.0.0 to change them.

## Prepare

1. Confirm the intended semantic-version impact and update the affected package changelogs.
2. Update package versions and cross-package peer dependency ranges together.
3. Regenerate CSS manifests and every affected adapter catalog.
4. Update website documentation and translated source catalogs for all public contracts.
5. Review compatibility manifests for additions, deprecations, or approved major-version removals.

## Verify

From a clean checkout with Node.js 24 and the .NET 10 SDK:

```sh
npm run bootstrap
npm run build
npm run check
npm run release:verify
```

The release gate must pass without increasing a performance budget merely to hide an unexplained regression. Review packed file inventories, source maps, licenses, README rendering, generated checksums, browser artifacts, and NuGet/npm consumer tests.

## Publish order

1. Publish `@gardenerim/css`.
2. Publish Vue, React, and AngularJS adapters after their peer range accepts the released CSS version.
3. Pack and publish `Gardenerim.Blazor`.
4. Build and deploy the website from the exact released package state.
5. Create a signed `v<version>` repository tag and release notes that link package changelogs and call out migrations or deprecations.

Registry credentials and signing keys must come from protected CI environments, never committed files. Test publication in a temporary consumer before promoting a release tag. The official npm scope is `@gardenerim`, the NuGet package ID is `Gardenerim.Blazor`, and release metadata points to `https://github.com/deepcase/gardenner`.

Configure each npm package's trusted publisher for repository `deepcase/gardenner`, workflow `publish.yml`, and environment `release`. The workflow publishes with GitHub OIDC and provenance; it must not receive `NPM_TOKEN` or `NODE_AUTH_TOKEN`.

Configure the NuGet trusted-publishing policy for owner `deepcase`, repository `gardenner`, workflow `publish.yml`, and environment `release` under the `gardenerim` NuGet account. The workflow exchanges its GitHub OIDC identity for a temporary NuGet API key immediately before upload.
