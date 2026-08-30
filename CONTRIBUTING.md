# Contributing to Gardener

Thank you for helping improve Gardener. Contributions should preserve its central promise: a stable, complete, accessible interface system that works for both human-authored and AI-authored products.

## Before opening a change

- Search existing issues and pull requests before starting duplicate work.
- Use an issue for large public API changes, new component families, breaking behavior, or a new runtime dependency.
- Security vulnerabilities must follow [SECURITY.md](SECURITY.md), not a public issue.
- Keep changes focused. Unrelated formatting or generated-file churn makes compatibility review harder.

## Local setup

Use Node.js 18.18 or newer. CI uses Node.js 24. Blazor work also requires the .NET 10 SDK; .NET 11 compatibility is checked separately.

```sh
npm run bootstrap
npm run build
npm run check
npm test
```

Individual packages keep independent lockfiles. Install and run a single package with npm's `--prefix` option:

```sh
npm --prefix packages/css ci
npm --prefix packages/css run check
npm --prefix packages/react test
```

The documentation site has no separate dependency installation. Build package outputs first, then run:

```sh
npm run check:website
npm run serve
```

## Change requirements

Public additions or changes should include all applicable items:

- source implementation and generated distribution output;
- canonical metadata and a closed JSON Schema;
- public API and compatibility inventory updates;
- types for JavaScript/TypeScript and typed adapters;
- keyboard, focus, ARIA, RTL, reduced-motion, forced-colors, print, mobile, and container behavior;
- unit, DOM lifecycle, browser, mobile, and accessibility tests;
- performance-budget and package-content verification;
- package README and the complete website catalog/documentation;
- a changelog entry using Added, Changed, Deprecated, Removed, Fixed, or Security.

Components must not appear only in a showcase. If a contract is public, it must be represented in canonical metadata and therefore be discoverable by the website and AI tooling.

## Compatibility and naming

- Follow existing `g-` CSS, `data-g-*` behavior, and adapter naming conventions.
- Do not remove or rename a stable 1.x API without an approved deprecation and migration path.
- Deprecations remain available for at least two minor releases and removals wait for the next major version.
- Keep default styling light, broadly applicable, and small-radius. Specialized visual styles belong in opt-in themes or variants.
- Runtime features remain dependency-free unless maintainers explicitly accept a dependency and its size/security trade-off.

## Commits and pull requests

Use clear imperative commit subjects such as `Add command palette focus restoration`. A pull request should explain the user problem, affected packages, public API impact, tests performed, screenshots for visible changes, and migration notes where relevant.

By contributing, you agree that your contribution is licensed under the repository's [MIT License](LICENSE) and that you will follow the [Code of Conduct](CODE_OF_CONDUCT.md).

