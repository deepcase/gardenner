# Release process

Gardener packages are versioned independently but the 1.0.0 repository currently aligns all official packages on the same release line. A release is complete only when source, generated output, metadata, docs, and package-manager artifacts agree.

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

1. Publish `@gardener/css`.
2. Publish Vue, React, and AngularJS adapters after their peer range accepts the released CSS version.
3. Pack and publish `Gardener.Blazor`.
4. Build and deploy the website from the exact released package state.
5. Create a signed repository tag and release notes that link package changelogs and call out migrations or deprecations.

Registry credentials and signing keys must come from protected CI environments, never committed files. Test publication in a temporary consumer before promoting a release tag. The repository does not assume a registry organization or hosting URL; set package `repository`, `homepage`, and `bugs` fields to the final public URLs before the first external publication.

