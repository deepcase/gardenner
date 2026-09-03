# Changelog

## [2.1.0] - 2026-09-01

- Align CSS, Vue, React, AngularJS, and Blazor controls with Arco Design Vue's 28/32/36px scale and 14px control typography; compact mode uses 24/28/32px while mobile and touch targets remain larger.
- Add a seven-locale runtime catalog with English fallback, message overrides, and shared configuration across CSS, Vue, React, AngularJS, and Blazor.
- Scope and batch mutation observation, add explicit start/stop/disconnect controls, and verify a 1,000-node initialization batch within the performance gate.
- Add XSS regression coverage, a 42-theme light/dark contrast matrix, modular admin-build guidance, and AngularJS legacy-risk enforcement.
- Correct canonical repository metadata and harden releases with immutable Actions, OIDC provenance, dependency and code scanning, SBOMs, signature checks, and secret scanning.

## [2.0.0] - 2026-08-31

- Breaking: use Gardenerim-branded public exports only; remove Gardener aliases and update migration examples.
- Fix Vue radio, multiple-select, checkbox-array and IME model semantics, and React multiple-select values.
- Add opt-in DataGrid data mode with paging, filtering, sorting, selection, editing, fixed-height virtualization and cancellable server loading.
- Add generated strict component/DataGrid type contracts, executable Blazor examples and lightweight CSS guidance.
- Expand regression and package checks; keep existing published 1.0.0 artifacts unchanged.

All notable repository-level changes are documented here. Package-level API changes remain in each package's own changelog.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and Gardenerim uses semantic versioning for its stable public packages.

## [1.0.0] - 2026-08-28

### Added

- Stable CSS/runtime, Vue 3, React, AngularJS 1.x, and Blazor package families at version 1.0.0.
- Complete seven-language landing page and documentation catalogs.
- Repository-wide contribution, security, support, conduct, licensing, release, and architecture documentation.
- Central CI, dependency-update configuration, issue forms, pull-request template, and repository integrity checks.

### Changed

- Organized publishable projects under `packages/` and moved the documentation site to `website/`.
- Renamed the adapter directory from `angular/` to the unambiguous `packages/angularjs/`.
- Centralized package automation under `.github/` while retaining independent package release boundaries.
