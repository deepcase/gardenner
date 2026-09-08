# GCarousel verification

Reference: Arco Design Vue Carousel 2.58.0.

- CSS, Vue, React, AngularJS and Blazor builds and package checks passed.
- Shared runtime: 916 tests passed, including 35 media tests; 7 new carousel regressions cover controlled current, defaults, indicator configuration, vertical/RTL keys, hover, validation and swipes.
- CSS HTML: 47 passed. CSS build: 11 passed, including reproducible output and packed package installation.
- Vue 147, React 95 and AngularJS 83 unit tests passed; all three adapter integrations exercised in Chromium, Firefox and WebKit.
- GardenerDemo: 10 scenes, 1440/768/390 widths, light/dark accessibility checks passed. Fixed narrow fixed-height viewport overflow and WebKit inherited text color updates.
- Actual transition, hover pause/resume, controlled autoplay and destruction timer cleanup passed.
- Arco comparison: arrows 24×24, dots 6×6, lines 12×4 and three-item slider segment 16×4 agree. Gardener retains its theme/frame treatment; this is not a whole-component pixel-identity claim.
- Live Blazor controlled changes, website iframe interaction and byte identity of source/dist/Blazor media runtime and CSS passed.
- Seven website locales and 14 localized pages validated.

See [API and compatibility boundaries](../carousel.md), [machine-readable evidence](verification.json) and [budget adjustment rationale](budget-change.json).
