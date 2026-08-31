# Changelog

## [2.0.0] - Unreleased

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
