# Release process

Gardenerim packages are versioned independently; this workspace prepares all official packages on the 2.0.0 release line. This is not a publication record. A release is complete only when source, generated output, metadata, docs, and package-manager artifacts agree.

## Brand and API rename

The requested removal of old Gardener exports is prepared as 2.0.0. See [migration guide](migration-2.0.md). All JavaScript entrypoints are checked by `npm run verify:exports`; no old brand alias is retained. The frozen 1.0.0 export snapshot is retained for rename mapping, while generated adapter compatibility manifests establish the new 2.0.0 baseline. Publishing still requires a separate explicit request.

The DataGrid data engine adds runtime code. Its measured initial increase over the existing 0.9 baseline is about 7.5% raw and 11.1% Brotli; only this artifact receives a documented 10% raw / 13% compressed growth allowance and 110 KB raw / 30 KB gzip / 26 KB Brotli absolute limits. CSS and other artifact budgets remain unchanged. Re-measure after any edits; do not silently rebaseline generated metrics.

The Vue packed-file limit is 102 (previously 100): `/contracts` contributes exactly four generated files to the previous 98-file package. Packed/unpacked byte ceilings are unchanged. The public NuGet README now names bundled documentation paths as plain text because the configured public GitHub documentation URL returned 404; publishing a public documentation site is a separate action, not something this local repair claims to have done.

The working tree now uses the Gardenerim brand, including public API names such as `createGardenerimVue`, `GardenerimProvider`, and the `Gardenerim.Blazor` NuGet package and namespace. The npm scope remains `@gardenerim`.

The four npm packages at version 1.0.0 have already been published and must not be overwritten or republished from this changed working tree. Renamed public exports are a breaking change: obtain approval for the next major version and update package versions, CSS peer dependency lower bounds, release guards, and changelogs together before publishing the renamed npm packages. Do not deploy examples of renamed APIs against the already-published npm 1.0.0 artifacts. The separately named `Gardenerim.Blazor` package was submitted to NuGet at version 1.0.0 on 2026-08-31; do not resubmit or overwrite that version.

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
5. Create a signed repository tag and release notes that link package changelogs and call out migrations or deprecations.

Registry credentials and signing keys must come from protected CI environments, never committed files. Test publication in a temporary consumer before promoting a release tag. The official npm scope is `@gardenerim`, the NuGet package ID is `Gardenerim.Blazor`, and release metadata points to `https://github.com/deecase/gardener`.

The first npm release uses a short-lived granular access token stored as the
`NPM_TOKEN` GitHub Actions secret. Grant it read/write access to the
`@gardenerim` scope, enable bypass 2FA only for this bootstrap run, and revoke
it immediately after all four packages exist. Then configure each package's
trusted publisher for repository `deecase/gardener`, workflow `publish.yml`,
environment `release`, and the `npm publish` action. Future releases use OIDC
and require no npm token.

Before the first NuGet release, create a pending trusted-publishing policy for
owner `deecase`, repository `gardener`, workflow `publish.yml`, and environment
`release` under the `gardenerim` NuGet account. The workflow exchanges its
GitHub OIDC identity for a one-hour NuGet API key immediately before upload.
