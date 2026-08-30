# Repository architecture

Gardener separates the canonical interface contract from framework rendering. `packages/css` owns tokens, themes, utilities, semantic class contracts, runtime behaviors, events, recipes, compatibility inventories, and JSON Schemas. Every adapter consumes that package's machine-readable component metadata and generates framework-native surfaces without redefining component semantics.

```text
packages/css metadata + runtime
          │
          ├── packages/vue
          ├── packages/react
          ├── packages/angularjs
          ├── packages/blazor
          └── website searchable catalogs
```

## Source-of-truth rules

1. A public CSS component is canonical only when present in `packages/css/metadata/components.json`.
2. Public runtime behavior, event, entry point, theme, recipe, and platform contracts are listed in the corresponding metadata and closed Schema.
3. Framework adapters generate their complete catalogs from CSS metadata and add only framework-specific lifecycle and typing contracts.
4. The website reads package metadata and generated catalogs. It must not maintain a smaller hand-written inventory.
5. Compatibility manifests permit additive 1.x changes and reject unplanned deletion or renaming of stable contracts.

## Package boundaries

Each package has an independent manifest, lockfile, changelog, license copy, tests, performance budget, package-content verification, and release gate. Local development dependencies use `file:../css`, which keeps adapters linked to the adjacent canonical package. The root package is private and coordinates commands; it is intentionally not an npm workspace so nested lockfiles remain authoritative for published artifacts.

Blazor follows the same metadata contract but publishes through NuGet. Its source targets .NET 10, its generated Razor components and static assets are packaged together, and a preview .NET 11 consumer check detects forward-compatibility problems early.

## Platform model

The CSS package provides explicit Web, Mobile, Desktop, Tauri, and Electron builds. Platform entry points narrow payload and host behavior without forking component names. Desktop bridges are opt-in and require a least-privilege host adapter; browser code never receives unrestricted native APIs.

## Quality model

Release verification is layered: schema and contract validation, generation reproducibility, types, unit/DOM lifecycle tests, HTML checks, multi-engine browser tests, mobile viewports, accessibility audits, package-consumer tests, tree-shaking checks, and performance budgets. Repository checks additionally protect layout, governance files, and cross-project paths.

