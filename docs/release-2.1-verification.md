# Gardenerim 2.1.0 verification

Status: **locally verified; four npm packages and the NuGet package were published and publicly verified on 2026-09-02. Source was not tagged, pushed, or deployed by this task**.

## Release gates

- `npm run check` passed repository, package, website, localization, and all 4,940 JavaScript export checks.
- `@gardenerim/css` passed 48 Schema tests, 1,145 compatibility contracts, 92 runtime tests, 24 HTML tests, deterministic builds, custom admin-build and package budgets, 58 Chromium/WebKit tests, 29 Firefox tests, 52 Pixel 7/iPhone 13 tests, and 26 Axe tests.
- The accessibility gate checks all 42 themes in both light and dark modes. All 84 combinations pass WCAG AA color contrast after the dark soft-background calculation was corrected.
- Vue passed 19 unit/SSR tests and its Chromium, WebKit, Firefox, mobile, Axe, tree-shaking, reproducibility, and package-consumer gates.
- React passed 15 unit/SSR/Hydration tests and its Chromium, WebKit, Firefox, mobile, Axe, tree-shaking, reproducibility, and package-consumer gates.
- AngularJS passed 17 unit/contract tests and its AngularJS 1.8.2/1.8.3, Chromium, WebKit, Firefox, mobile, Axe, tree-shaking, reproducibility, and package-consumer gates.
- Blazor built with zero warnings and zero errors, rendered all 506 components through SSR, passed browser/Axe checks, verified deterministic DLL/XML output, and installed its generated NuGet package into an isolated consumer.
- The website contains 3,182 translated messages and 14 generated pages across `zh-CN`, `en`, `ja`, `ko`, `es`, `fr`, and `de`.

## Security and supply chain

- npm reports zero vulnerabilities for CSS, Vue, React, and the Blazor workspace. NuGet reports no vulnerable direct or transitive packages.
- Registry signatures were verified for 308 installed npm packages across the five workspaces.
- AngularJS has 10 upstream advisories and no available fix. The release gate accepts only unfixable findings directly attributed to the end-of-life `angular` package and fails for any additional or newly fixable dependency.
- CI uses immutable action SHAs, dependency review, CodeQL, npm/NuGet audits, package-signature checks, CycloneDX SBOM generation, and secret scanning.
- npm publication is configured for GitHub OIDC trusted publishing with provenance and no long-lived npm token.

## Measured artifacts

- Full CSS: 1,011,973 B raw / 140,386 B gzip / 61,530 B Brotli. Representative admin custom build: 37,049 B gzip, 26.4% of the full CSS gzip size.
- Runtime: 118,843 B raw / 33,149 B gzip / 28,484 B Brotli. Blazor embeds this byte-identical runtime and therefore uses the same 34,000 B gzip ceiling as the CSS package.
- Vue bundle: 330,691 B raw / 52,236 B gzip / 27,220 B Brotli.
- React bundle: 328,129 B raw / 50,581 B gzip / 26,733 B Brotli.
- AngularJS bundle: 405,932 B raw / 59,850 B gzip / 30,016 B Brotli.
- Blazor: 350,208 B assembly, 7,820,065 B across 45 static assets, and a 1,336,259 B submitted NuGet package.

The four npm packages were published after explicit authorization and passed isolated public-registry consumer verification; see [the publication receipt](release-2.1-publication.json). NuGet indexed and repository-signed the main package, accepted its symbols, and passed isolated public-source restore/publish, Razor/DI, SSR, and byte-for-byte HTTP checks for all 45 static assets. Deploying the website and creating a signed `v2.1.0` tag remain separate actions.
