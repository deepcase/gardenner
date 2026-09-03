import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const home = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const project = resolve(home, "..");
const cssRoot = resolve(project, "packages/css");
const vueRoot = resolve(project, "packages/vue");
const reactRoot = resolve(project, "packages/react");
const angularRoot = resolve(project, "packages/angularjs");
const blazorRoot = resolve(project, "packages/blazor");
const sourceRoot = resolve(cssRoot, "src");
const errors = [];
const bytes = (value) => Number(value).toLocaleString("en-US");

async function listCss(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listCss(path));
    else if (entry.isFile() && entry.name.endsWith(".css")) files.push(path);
  }
  return files.sort();
}

const normalizeClass = (name) => name.replaceAll("\\/", "/").replaceAll("\\:", ":");
const cssClasses = (text) => new Set([...text.matchAll(/\.((?:\\.|[\w-])+)/g)].map((match) => normalizeClass(match[1])).filter((name) => name.startsWith("g-")));
const difference = (left, right) => [...left].filter((item) => !right.has(item));
const reportDifference = (label, left, right) => {
  const missing = difference(left, right);
  if (missing.length) errors.push(`${label}: ${missing.length} missing (${missing.slice(0, 12).join(", ")}${missing.length > 12 ? ", …" : ""})`);
};

const [catalog, utilities, manifest, recipes, publicApi, builds, performance, compatibility, packageManifest, docs, homePage, homeReadme, siteJs, distCss, vuePublicApi, vueCatalog, vuePerformance, vueCompatibility, vuePackageManifest, reactPublicApi, reactCatalog, reactPerformance, reactCompatibility, reactPackageManifest, angularPublicApi, angularCatalog, angularPerformance, angularCompatibility, angularPackageManifest, blazorPublicApi, blazorCatalog, blazorPerformance, blazorCompatibility] = await Promise.all([
  readFile(resolve(home, "assets/css-catalog.json"), "utf8").then(JSON.parse),
  readFile(resolve(cssRoot, "dist/gardener.utilities.json"), "utf8").then(JSON.parse),
  readFile(resolve(cssRoot, "dist/gardener.manifest.json"), "utf8").then(JSON.parse),
  readFile(resolve(cssRoot, "dist/gardener.recipes.json"), "utf8").then(JSON.parse),
  readFile(resolve(cssRoot, "dist/gardener.public-api.json"), "utf8").then(JSON.parse),
  readFile(resolve(cssRoot, "dist/gardener.builds.json"), "utf8").then(JSON.parse),
  readFile(resolve(cssRoot, "dist/gardener.performance.json"), "utf8").then(JSON.parse),
  readFile(resolve(cssRoot, "dist/gardener.compatibility.json"), "utf8").then(JSON.parse),
  readFile(resolve(cssRoot, "package.json"), "utf8").then(JSON.parse),
  readFile(resolve(home, "docs.html"), "utf8"),
  readFile(resolve(home, "index.html"), "utf8"),
  readFile(resolve(home, "README.md"), "utf8"),
  readFile(resolve(home, "assets/site.js"), "utf8"),
  readFile(resolve(cssRoot, "dist/gardener.css"), "utf8"),
  readFile(resolve(vueRoot, "metadata/public-api.json"), "utf8").then(JSON.parse),
  readFile(resolve(vueRoot, "dist/catalog.json"), "utf8").then(JSON.parse),
  readFile(resolve(vueRoot, "dist/gardener-vue.performance.json"), "utf8").then(JSON.parse),
  readFile(resolve(vueRoot, "metadata/compatibility.json"), "utf8").then(JSON.parse),
  readFile(resolve(vueRoot, "package.json"), "utf8").then(JSON.parse),
  readFile(resolve(reactRoot, "metadata/public-api.json"), "utf8").then(JSON.parse),
  readFile(resolve(reactRoot, "dist/catalog.json"), "utf8").then(JSON.parse),
  readFile(resolve(reactRoot, "dist/gardener-react.performance.json"), "utf8").then(JSON.parse),
  readFile(resolve(reactRoot, "metadata/compatibility.json"), "utf8").then(JSON.parse),
  readFile(resolve(reactRoot, "package.json"), "utf8").then(JSON.parse),
  readFile(resolve(angularRoot, "metadata/public-api.json"), "utf8").then(JSON.parse),
  readFile(resolve(angularRoot, "dist/catalog.json"), "utf8").then(JSON.parse),
  readFile(resolve(angularRoot, "dist/gardener-angularjs.performance.json"), "utf8").then(JSON.parse),
  readFile(resolve(angularRoot, "metadata/compatibility.json"), "utf8").then(JSON.parse),
  readFile(resolve(angularRoot, "package.json"), "utf8").then(JSON.parse),
  readFile(resolve(blazorRoot, "metadata/public-api.json"), "utf8").then(JSON.parse),
  readFile(resolve(blazorRoot, "metadata/components.json"), "utf8").then(JSON.parse),
  readFile(resolve(blazorRoot, "artifacts/gardener-blazor.performance.json"), "utf8").then(JSON.parse),
  readFile(resolve(blazorRoot, "metadata/compatibility.json"), "utf8").then(JSON.parse)
]);

const sourceFiles = await listCss(sourceRoot);
const docsText = docs.replace(/\s+/g, " ");
const moduleMap = new Map(catalog.modules.map((module) => [module.file, module]));
if (moduleMap.size !== sourceFiles.length) errors.push(`CSS module count mismatch: ${moduleMap.size}/${sourceFiles.length}`);

const allSourceClasses = new Set();
const allTokens = new Set();
const allStates = new Set();
const allDataAttributes = new Set();
const allKeyframes = new Set();
for (const file of sourceFiles) {
  const source = relative(cssRoot, file).replaceAll("\\", "/");
  const raw = await readFile(file, "utf8");
  const module = moduleMap.get(source);
  if (!module) { errors.push(`CSS source missing from catalog: ${source}`); continue; }
  const digest = createHash("sha256").update(raw).digest("hex");
  if (module.sha256 !== digest) errors.push(`Stale CSS catalog module: ${source}`);
  cssClasses(raw).forEach((name) => allSourceClasses.add(name));
  for (const match of raw.matchAll(/(--g-[a-z0-9-]+)\s*:/gi)) allTokens.add(match[1]);
  for (const match of raw.matchAll(/\.((?:is|has)-[\w-]+)/g)) allStates.add(match[1]);
  for (const match of raw.matchAll(/\[(data-g-[a-z0-9-]+)/gi)) allDataAttributes.add(match[1]);
  for (const match of raw.matchAll(/@(?:-\w+-)?keyframes\s+([\w-]+)/gi)) allKeyframes.add(match[1]);
}

const utilityClasses = new Set(utilities.utilities.map((utility) => utility.class));
const generatedUtilityCss = await readFile(resolve(sourceRoot, "generated/utilities.css"), "utf8");
const generatedUtilityClasses = cssClasses(generatedUtilityCss);
reportDifference("Utility CSS classes absent from utility manifest", generatedUtilityClasses, utilityClasses);
reportDifference("Utility manifest classes absent from utility CSS", utilityClasses, generatedUtilityClasses);
if (utilities.count !== utilityClasses.size || catalog.totals.utilityClasses !== utilityClasses.size) errors.push("Utility counts are not synchronized");

const semanticClasses = new Set(catalog.classes.map((item) => item.name));
const documentedClasses = new Set([...semanticClasses, ...utilityClasses]);
reportDifference("CSS classes absent from documentation catalogs", allSourceClasses, documentedClasses);
reportDifference("Documented classes absent from CSS source", documentedClasses, allSourceClasses);
reportDifference("CSS tokens absent from documentation catalog", allTokens, new Set(catalog.customProperties.map((item) => item.name)));
reportDifference("CSS states absent from documentation catalog", allStates, new Set(catalog.stateHooks.map((item) => item.name)));
reportDifference("CSS data attributes absent from documentation catalog", allDataAttributes, new Set(catalog.dataAttributes.map((item) => item.name)));
reportDifference("CSS keyframes absent from documentation catalog", allKeyframes, new Set(catalog.keyframes.map((item) => item.name)));

const distClasses = cssClasses(distCss);
for (const component of manifest.components) {
  const selectors = [component.selector, component.cssSelector].filter(Boolean).join(" ");
  for (const match of selectors.matchAll(/\.([\w-]+)/g)) if (!distClasses.has(match[1])) errors.push(`Component ${component.name} references missing .${match[1]}`);
}
for (const recipe of recipes.recipes) {
  for (const className of [recipe.root.replace(/^\./, ""), ...recipe.parts]) if (!distClasses.has(className)) errors.push(`Recipe ${recipe.id} references missing .${className}`);
}

for (const id of ["css-api-catalog", "css-module-catalog", "utility-catalog", "component-catalog", "runtime-grid", "recipe-catalog"]) {
  if (!docs.includes(`id="${id}"`)) errors.push(`docs.html missing complete catalog host #${id}`);
}
if (!docs.includes('id="grid-system"')) errors.push("docs.html missing dedicated complete grid documentation #grid-system");
for (const marker of ["g-grid-24", "g-grid-12", "g-col-24", "g-col-fill-from-", "g-md-col-", "g-offset-", "g-grid-container", "g-cq-md-col-", "g-print-col-"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing grid documentation marker: ${marker}`);
}
if (!docs.includes('id="region-layouts"')) errors.push("docs.html missing dedicated traditional region layout documentation #region-layouts");
for (const marker of ["g-region-stack", "g-region-inline", "g-region-frame", "g-holy-grail", "g-sidebar-shell", "g-double-sidebar-layout", "g-master-detail", "g-list-detail-inspector", "g-sticky-footer-layout", "g-fixed-header-layout", "g-fixed-sidebar-layout", "g-sticky-aside-layout", "g-dock-layout", "g-split-view", "g-fullscreen-workspace", "g-mobile-layout"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing region layout documentation marker: ${marker}`);
}
if (!docs.includes('id="layout-primitives"')) errors.push("docs.html missing dedicated classic layout primitives documentation #layout-primitives");
for (const marker of ["g-stack", "g-cluster", "g-center", "g-sidebar-layout", "g-switcher", "g-cover", "g-reel", "g-frame", "g-media-object", "g-grid-auto-fit", "g-grid-auto-fill", "g-bleed", "g-repel", "g-imposter", "g-overlay-layout", "g-masonry", "g-bento", "g-aspect-ratio", "g-scroll-area", "g-scroll-snap", "g-safe-area", "g-sticky-region", "g-layout-container"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing classic layout primitive marker: ${marker}`);
}
if (!docs.includes('id="page-components"')) errors.push("docs.html missing dedicated page-level component documentation #page-components");
for (const marker of ["g-page-header", "g-section-header", "g-subheader", "g-toolbar", "g-action-bar", "g-status-bar", "g-command-bar", "g-context-bar", "g-filter-bar", "g-bulk-action-bar", "g-footer-bar", "g-floating-action-bar", "g-back-to-top", "g-divider", "g-sticky-actions", "g-page-loading", "g-page-state", "g-page-empty", "g-page-error", "g-page-forbidden", "g-page-not-found", "g-page-server-error", "g-page-offline", "g-page-maintenance", "g-page-component-container"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing page-level component marker: ${marker}`);
}
if (!docs.includes('id="help-system"')) errors.push("docs.html missing dedicated Tip and help system documentation #help-system");
for (const marker of ["g-tip", "g-inline-hint", "g-help-text", "g-help-trigger", "g-tooltip", "g-tooltip-rich", "g-help-popover", "g-definition", "g-callout", "g-note", "g-guidance-pair", "g-key-hint", "g-shortcut-list", "g-help-card", "g-help-panel", "g-help-center", "g-help-topics", "g-faq", "g-contextual-help", "g-coach-mark", "g-tour", "g-spotlight", "g-hotspot", "g-feature-hint", "g-whats-new", "g-help-checklist", "g-troubleshooting", "g-help-feedback", "data-g-tour-open", "data-g-tour-next"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing Tip and help system marker: ${marker}`);
}
if (!docs.includes('id="form-compositions"')) errors.push("docs.html missing dedicated traditional form composition documentation #form-compositions");
for (const marker of ["g-form", "g-form-section", "g-field", "g-fieldset", "g-form-row", "g-form-grid", "g-form-horizontal", "g-form-inline", "g-form-compact", "g-input-group", "g-input-affix", "g-search-field", "g-password-field", "g-clearable-field", "g-character-field", "g-validation-state", "g-validation-summary", "g-check-group", "g-radio-group", "g-switch-row", "g-choice-group", "g-name-group", "g-address-group", "g-phone-group", "g-money-group", "g-date-range-group", "g-time-range-group", "g-unit-field", "g-range-field", "g-file-field", "g-repeatable-field", "g-conditional-field", "g-form-actions", "g-autosave-status", "g-form-progress", "g-form-review", "g-consent-group", "g-form-container", "data-g-password-toggle", "data-g-clear-input", "data-g-character-count", "data-g-conditional-field", "data-g-repeatable-field"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing traditional form composition marker: ${marker}`);
}
if (!docs.includes('id="navigation-compositions"')) errors.push("docs.html missing dedicated traditional navigation composition documentation #navigation-compositions");
for (const marker of ["g-navbar", "g-primary-nav", "g-utility-nav", "g-subnav", "g-sidebar", "g-collapsible-nav", "g-nav-rail", "g-activitybar", "g-menubar", "g-mega-menu", "g-dropdown", "g-context-menu", "g-tree-nav", "g-breadcrumb", "g-tabs", "g-vertical-tabs", "g-segmented", "g-pill-nav", "g-anchor-nav", "g-scrollspy-nav", "g-pagination", "g-cursor-pagination", "g-load-more-nav", "g-stepper", "g-wizard-nav", "g-back-nav", "g-prev-next-nav", "g-skip-nav", "g-mobile-top-nav", "g-bottom-nav", "g-mobile-tab-bar", "g-drawer-nav", "g-command-palette", "g-command-nav", "g-jump-nav", "g-quick-nav", "g-locale-nav", "g-account-nav", "g-nav-container", "data-g-nav-toggle", "data-g-roving-nav", "data-g-context-menu", "data-g-scrollspy", "data-g-jump-nav"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing traditional navigation composition marker: ${marker}`);
}
if (!docs.includes('id="data-compositions"')) errors.push("docs.html missing dedicated data display and operation documentation #data-compositions");
for (const marker of ["g-table", "g-responsive-table", "g-data-grid", "g-editable-grid", "g-tree-table", "g-grouped-table", "g-expandable-table", "g-comparison-table", "g-pivot", "g-description-list", "g-key-value", "g-record-detail", "g-list-group", "g-media-list", "g-dense-list", "g-virtual-list", "g-tree", "g-timeline", "g-activity-feed", "g-audit-log", "g-kpi", "g-stat-list", "g-metric-card", "g-sparkline", "g-progress-stats", "g-chart", "g-data-legend", "g-ranking", "g-status-summary", "g-calendar", "g-agenda", "g-kanban", "g-gantt", "g-org-chart", "g-map-shell", "g-data-matrix", "g-heatmap", "g-data-toolbar", "g-column-chooser", "g-saved-views", "g-export-panel", "g-data-state", "g-data-view-switcher", "g-selection-summary", "g-table-density", "g-filter-summary", "g-sort-builder", "g-data-inspector", "g-data-container", "data-g-table-sort", "data-g-row-select", "data-g-row-disclosure", "data-g-column-toggle", "data-g-data-filter", "data-g-data-view"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing data display and operation marker: ${marker}`);
}
if (!docs.includes('id="selection-compositions"')) errors.push("docs.html missing dedicated selection and batch-operation documentation #selection-compositions");
for (const marker of ["g-selection-control", "g-select-all-control", "g-invert-selection-control", "g-range-selection-control", "g-batch-toolbar", "g-selection-scope", "g-transfer", "g-dual-list", "g-tree-select", "g-cascader", "g-mention-picker", "g-user-picker", "g-organization-picker", "g-resource-picker", "g-media-picker", "g-icon-picker", "g-color-picker", "g-date-range-picker", "g-time-range-picker", "g-saved-filters", "g-saved-views", "g-column-chooser", "g-sort-builder", "g-group-builder", "g-entity-picker", "g-tag-picker", "g-relation-picker", "g-bulk-confirmation", "g-bulk-progress", "g-picker-panel", "g-picker-summary", "g-selection-summary", "g-selection-container", "data-g-transfer", "data-g-picker", "data-g-cascader", "data-g-saved-choice", "data-g-builder-list", "data-g-invert-selection", "data-g-batch-toolbar"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing selection and batch-operation marker: ${marker}`);
}
if (!docs.includes('id="content-compositions"')) errors.push("docs.html missing dedicated file and content system documentation #content-compositions");
for (const marker of ["g-file-drop", "g-file-list", "g-upload-queue", "g-chunk-upload", "g-upload-progress", "g-failed-upload", "g-file-card", "g-folder-tree", "g-file-browser", "g-file-preview", "g-media-library", "g-media-grid", "g-media-details", "g-image-crop", "g-image-annotation", "g-document-viewer", "g-pdf-viewer", "g-video-player", "g-audio-player", "g-code-editor", "g-rich-text-editor", "g-markdown-editor", "g-block-editor", "g-revision-compare", "g-autosave-indicator", "g-content-outline", "g-editor-toolbar", "g-find-replace", "g-comment-thread", "g-version-history", "g-file-properties", "g-storage-meter", "g-content-container", "data-g-dropzone", "data-g-upload-manager", "data-g-file-browser", "data-g-editor-shell", "data-g-revision-compare", "data-g-autosave"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing file and content system marker: ${marker}`);
}
if (!docs.includes('id="auth-compositions"')) errors.push("docs.html missing dedicated authentication and account documentation #auth-compositions");
for (const marker of ["g-auth-centered", "g-auth-split", "g-sign-in", "g-registration", "g-password-recovery", "g-password-reset", "g-email-verification", "g-phone-verification", "g-mfa-challenge", "g-otp-input", "g-passkey", "g-sso", "g-qr-login", "g-magic-link", "g-invitation", "g-first-time-setup", "g-lock-screen", "g-session-expired", "g-account-chooser", "g-tenant-chooser", "g-identity-switcher", "g-profile-setup", "g-account-security", "g-device-management", "g-login-activity", "g-security-alert", "g-recovery-codes", "g-trusted-device", "g-connected-accounts", "g-password-strength", "g-auth-consent", "g-auth-result", "g-auth-container", "g-auth-panel", "g-auth-choice", "g-otp-cell", "g-password-rule", "g-auth-timer", "g-qr-code", "g-device-item", "g-login-event", "g-recovery-code", "data-g-password-toggle", "data-g-otp-input", "data-g-password-strength", "data-g-auth-timer", "data-g-saved-choice", "data-g-dropdown", "data-g-copy", "data-g-dialog"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing authentication and account marker: ${marker}`);
}
if (!docs.includes('id="commerce-compositions"')) errors.push("docs.html missing dedicated commerce and payment documentation #commerce-compositions");
for (const marker of ["g-commerce-product-card", "g-commerce-product-list", "g-commerce-product-detail", "g-commerce-product-gallery", "g-sku-selector", "g-quantity-stepper", "g-price-display", "g-commerce-cart-item", "g-cart", "g-mini-cart", "g-cart-summary", "g-commerce-checkout", "g-checkout-steps", "g-address-selector", "g-address-card", "g-shipping-method", "g-pickup-selector", "g-coupon", "g-promotion-list", "g-invoice-information", "g-payment-method", "g-payment-sheet", "g-payment-result", "g-commerce-order-summary", "g-commerce-order-timeline", "g-order-detail", "g-subscription-plan", "g-pricing-comparison", "g-commerce-usage-meter", "g-billing-history", "g-refund-status", "g-tax-summary", "g-commerce-container", "g-product-card-badge", "g-product-list-item", "g-product-gallery-thumb", "g-product-detail-summary", "g-price-current", "g-stock-status", "g-sku-group", "g-sku-option", "g-quantity-button", "g-cart-item-media", "g-cart-empty", "g-mini-cart-footer", "g-cart-summary-total", "g-checkout-section", "g-checkout-sidebar", "g-checkout-mobile-actions", "g-checkout-step-marker", "g-address-main", "g-shipping-option", "g-pickup-option", "g-coupon-status", "g-promotion-item", "g-invoice-fields", "g-payment-option", "g-payment-sheet-total", "g-payment-result-icon", "g-order-summary-total", "g-order-timeline-item", "g-order-detail-section", "g-plan-price-value", "g-usage-meter-track", "g-billing-history-item", "g-refund-status-progress", "g-tax-summary-row", "data-g-quantity-stepper", "data-g-sku-selector", "data-g-cart", "data-g-coupon", "data-g-saved-choice", "data-g-carousel", "data-g-dropdown"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing commerce and payment marker: ${marker}`);
}
if (!docs.includes('id="mobile-compositions"')) errors.push("docs.html missing dedicated mobile-specific documentation #mobile-compositions");
for (const marker of ["g-mobile-safe-shell", "g-mobile-app-bar", "g-mobile-bottom-navigation", "g-mobile-bottom-sheet", "g-mobile-action-sheet", "g-mobile-pull-refresh", "g-mobile-infinite-load", "g-mobile-swipe-actions", "g-mobile-swipe-tabs", "g-mobile-category-view", "g-mobile-filter-sheet", "g-mobile-purchase-bar", "g-mobile-search", "g-mobile-picker", "g-mobile-wheel-picker", "g-mobile-fab", "g-mobile-fullscreen-dialog", "g-mobile-keyboard-avoidance", "g-mobile-gesture-hint", "g-mobile-offline-banner", "g-mobile-segmented-control", "g-mobile-feed", "g-mobile-card-carousel", "g-mobile-form", "g-mobile-auth", "g-mobile-checkout", "g-mobile-media-viewer", "g-mobile-keyboard-toolbar", "g-mobile-selection-mode", "g-mobile-snackbar", "g-mobile-permission-prompt", "g-mobile-state", "g-mobile-safe-content", "g-mobile-app-bar-title", "g-mobile-bottom-navigation-item", "g-mobile-sheet-panel", "g-mobile-sheet-handle", "g-mobile-pull-refresh-indicator", "g-mobile-swipe-actions-track", "g-mobile-category-grid", "g-mobile-purchase-actions", "g-mobile-search-field", "g-mobile-wheel-column", "g-mobile-media-viewer-stage", "g-mobile-permission-actions", "data-g-mobile-sheet", "data-g-mobile-sheet-open", "data-g-pull-refresh", "data-g-infinite-load", "data-g-swipe-actions", "data-g-wheel-picker"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing mobile-specific marker: ${marker}`);
}
if (!docs.includes('id="desktop-compositions"')) errors.push("docs.html missing dedicated desktop-specific documentation #desktop-compositions");
for (const marker of ["g-native-titlebar", "g-desktop-window-controls", "g-desktop-menubar", "g-desktop-activity-bar", "g-desktop-dock-panel", "g-desktop-split-pane", "g-desktop-inspector-panel", "g-desktop-status-bar", "g-desktop-command-palette", "g-shortcut-recorder", "g-desktop-context-menu", "g-desktop-document-tabs", "g-desktop-drag-region", "g-window-loading", "g-update-available", "g-desktop-permission-request", "g-native-file-picker", "g-tray-menu", "g-multi-window-placeholder", "g-desktop-workspace", "g-desktop-window-switcher", "g-recent-documents", "g-desktop-toolbar", "g-desktop-bottom-panel", "g-background-task-center", "g-desktop-notification-center", "g-sync-status", "g-update-progress", "g-crash-recovery", "g-single-instance-notice", "g-deep-link-handler", "g-about-dialog", "g-native-titlebar-title", "g-desktop-window-button", "g-desktop-panel-header", "g-desktop-command-item", "g-shortcut-recorder-control", "g-desktop-menu-item", "g-desktop-document-tab", "g-desktop-no-drag", "g-native-file-picker-value", "g-desktop-window-item", "g-background-task", "g-desktop-notification", "g-sync-status-dot", "data-g-shortcut-recorder", "data-g-desktop-tabs", "data-g-native-file-picker", "data-g-window-switcher", "data-g-split-pane", "data-g-command-palette", "data-g-context-menu", "data-g-roving-nav"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing desktop-specific marker: ${marker}`);
}
if (!docs.includes('id="ai-compositions"')) errors.push("docs.html missing dedicated AI-specific documentation #ai-compositions");
for (const marker of ["g-ai-shell", "g-conversation-list", "g-chat", "g-message", "g-composer", "g-attachment", "g-prompt-starter", "g-prompt-library", "g-ai-command-menu", "g-model-selector", "g-thinking", "g-streaming-response", "g-tool-call", "g-approval", "g-agent-status", "g-plan", "g-agent-board", "g-agent-handoff", "g-sources", "g-artifact-layout", "g-artifact-panel", "g-file-tree", "g-version-list", "g-generation-grid", "g-generation-placeholder", "g-ai-context-manager", "g-ai-usage-panel", "g-voice-state", "g-permission-scope", "g-privacy-notice", "g-ai-safety-notice", "g-ai-feedback", "g-ai-sidebar-header", "g-chat-list", "g-message-avatar", "g-message-body", "g-composer-input", "g-composer-toolbar", "g-prompt-suggestions", "g-prompt-suggestion", "g-ai-command-item", "g-model-selector-menu", "g-thinking-content", "g-streaming-response-body", "g-tool-call-progress", "g-approval-scope", "g-agent-card", "g-agent-handoff-main", "g-source-list", "g-artifact-toolbar", "g-artifact-tabs", "g-file-tree-item", "g-version", "g-generation-card", "g-ai-memory-item", "g-ai-usage-grid", "g-voice-bar", "g-permission-scope-list", "g-ai-safety-actions", "g-ai-feedback-option", "data-g-ai-composer", "data-g-prompt-fill", "data-g-prompt-value", "data-g-ai-approval", "data-g-ai-feedback", "data-g-dropdown", "data-g-accordion", "data-g-tabs", "data-g-tree"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing AI-specific marker: ${marker}`);
}
if (!docs.includes('id="solution-compositions"')) errors.push("docs.html missing dedicated complete-page solution documentation #solution-compositions");
for (const marker of ["g-product-landing", "g-corporate-home", "g-personal-home", "g-portfolio-page", "g-blog-index", "g-article-page", "g-docs-portal", "g-help-center-page", "g-search-results-page", "g-contact-page", "g-pricing-page", "g-dashboard-overview", "g-admin-list-page", "g-record-detail-page", "g-settings-center", "g-user-center", "g-notification-center-page", "g-onboarding-flow", "g-crm-workspace", "g-project-workspace", "g-support-center", "g-approval-center", "g-knowledge-base", "g-learning-portal", "g-event-portal", "g-booking-portal", "g-healthcare-portal", "g-finance-portal", "g-public-service-portal", "g-marketplace-page", "g-community-page", "g-status-center-page", "g-solution-container", "g-solution-header", "g-solution-section", "g-solution-grid", "g-solution-card", "g-solution-shell", "g-solution-rail", "g-solution-main", "g-solution-aside", "g-solution-list", "g-solution-item", "g-solution-meta", "g-solution-stat", "g-solution-toolbar", "g-solution-empty"]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing complete-page solution marker: ${marker}`);
}
for (const marker of ["setupCssCatalog", "metadataRows(component", "metadataRows(recipe", "renderPublicApi", "publicApiUrl", "behaviorContracts", "eventContracts", "detailKeys", "dataAttributes.behaviors", "dataAttributes.selectors", "dataAttributes.configuration", "dataAttributes.managedState", "utility.selector", "module.classes", "manifest.behaviors", "restoreHashTarget", "scrollIntoView"]) {
  if (!siteJs.includes(marker)) errors.push(`site.js missing documentation renderer marker: ${marker}`);
}
for (const href of ["gardener.manifest.json", "gardener.utilities.json", "gardener.recipes.json", "gardener.capabilities.json", "gardener.public-api.json", "gardener.builds.json", "gardener.performance.json", "gardener.compatibility.json", "components.schema.json", "recipes.schema.json", "capabilities.schema.json", "utilities.schema.json", "manifest.schema.json", "public-api.schema.json", "builds.schema.json", "custom-build.schema.json", "performance-budgets.schema.json", "performance-report.schema.json", "compatibility.schema.json"]) {
  if (!docs.includes(href)) errors.push(`docs.html missing raw catalog link: ${href}`);
}

if (catalog.totals.classes !== semanticClasses.size + utilityClasses.size) errors.push("CSS catalog total class count is inconsistent");
if (manifest.components.length !== new Set(manifest.components.map((item) => item.name)).size) errors.push("Duplicate component names in manifest");
if (recipes.recipes.length !== new Set(recipes.recipes.map((item) => item.id)).size) errors.push("Duplicate recipe ids in manifest");
if (!docs.includes(`全部 ${publicApi.javascript.behaviors.length} 种行为`)) errors.push("docs.html behavior contract count is not synchronized");
if (!docs.includes(`全部 ${publicApi.javascript.events.length} 种事件`)) errors.push("docs.html event contract count is not synchronized");
if (!docs.includes(`全部 ${publicApi.javascript.moduleExports.length} 个模块导出`)) errors.push("docs.html module export count is not synchronized");
if (!docs.includes("运行时测试门禁（0.4.0 起）") || !docs.includes("npm run test:runtime") || !docs.includes("全部 72 种行为") || !docs.includes("双向比对真实实例成员")) errors.push("docs.html missing the runtime unit and DOM lifecycle test contract");
for (const marker of ["npm run test:schema", "Ajv 2020-12", "48 个标准验证用例", "十一套 Schema", "未知嵌套字段", "缺失嵌套必填字段", "JavaScript 标识符", "SHA-256 格式", "基线回归状态", "兼容别名", "模块种类/参数/签名"]) {
  if (!docsText.includes(marker)) errors.push(`docs.html missing deep JSON Schema/public API contract marker: ${marker}`);
}
for (const marker of ["2.1.0 自动化测试矩阵", "test:build", "test:types", "verify:compatibility", "verify:package", "test:html", "test:browser", "test:browser:firefox", "test:browser:all", "test:mobile", "test:a11y", "test:e2e", "Desktop Chromium + WebKit", "Desktop Firefox", "Pixel 7 Chromium + iPhone 13 WebKit", "Chromium + Axe", "WCAG 2 A/AA", "全部 21 个示例", "52 个移动用例", "不按 impact", "44px 触控目标", "Reduced Motion", "Forced Colors", "152 个真实浏览器用例", "24 个 HTML 结构用例", "311 个默认自动化用例"]) {
  if (!docsText.includes(marker)) errors.push(`docs.html missing 2.1.0 release/browser/mobile/accessibility test marker: ${marker}`);
}
for (const marker of ["Stable 2.1.0", "48 个标准 Schema 用例", "10 个构建专项用例", "152 个真实浏览器用例", "24 个 HTML", "桌面多浏览器", "Pixel 7", "iPhone 13", "全量覆盖 21 个示例", "全部自动违规归零", "Axe WCAG", "5 个平台档案", "28 个稳定组件包", "506 个组件归属映射", "SHA-256/SRI", "可复现构建", "TypeScript 类型", "跨版本兼容基线", "1,145", "Gardenerim v2.1.0"]) {
  if (!homePage.includes(marker)) errors.push(`index.html missing 2.1.0 quality/build marker: ${marker}`);
}
for (const marker of ["`2.1.0` Stable 公共 API", "1,145 项兼容基线", "5 个平台档案", "28 个组件包", "506 个真实组件归属", "42 个正式产物", "90 个运行时与 DOM 生命周期测试", "真实浏览器与移动端矩阵", "24 个 HTML 结构用例", "52 个配方"]) {
  if (!homeReadme.includes(marker)) errors.push(`README.md missing synchronized 2.1.0 inventory marker: ${marker}`);
}
if (!docs.includes('id="targeted-builds"')) errors.push("docs.html missing dedicated 2.1.0 release-build documentation #targeted-builds");
for (const marker of ["5 个平台档案", "28 个稳定组件包", "506 个组件到一个或多个真实所属包", "./component/*.css", "build:platform", "build:custom", "--components", "--packs", "--no-utilities", "独立轻量入口继承 desktop CSS", "esbuild", "Source Map", "SHA-256", "SRI", "verify:reproducible", "字节级可复现", "稳定 MIT banner", `${performance.regressions.baselineVersion} 实测结果为紧邻基线`, "raw 增长不超过 2%", "gzip level 9", "Brotli quality 11", "raw、gzip、Brotli", "npm pack --dry-run", "42 个正式压缩产物", "test:build", "10 个构建", "TypeScript", "Compatibility Schema", "Node.js &gt;=18.18", "Publint", "Provenance", "packed 2,050,000 B", "unpacked 16,500,000 B", `最多 ${performance.package.limits.files} 个文件`]) {
  if (!docsText.includes(marker)) errors.push(`docs.html missing 2.1.0 release-build/performance marker: ${marker}`);
}
if (builds.platforms.length !== 5) errors.push("Build documentation source does not expose exactly 5 platform profiles");
if (builds.componentPacks.length !== 28) errors.push("Build documentation source does not expose exactly 28 component packs");
if (Object.keys(builds.componentOwnership).length !== manifest.components.length) errors.push("Build component ownership is not synchronized with the component manifest");
if (performance.status !== "passed" || Object.keys(performance.artifacts).length !== 42 || !performance.package.pass) errors.push("Performance report is missing, incomplete, or failing");
if (Object.keys(builds.artifactIntegrity || {}).length !== 42 || builds.reproducibility?.deterministic !== true) errors.push("Build integrity or reproducibility documentation source is incomplete");
if (performance.regressions?.baselineVersion !== "2.0.0" || performance.regressions?.pass !== true || Object.keys(performance.regressions?.artifacts || {}).length !== 42) errors.push("Performance baseline regression report is missing, incomplete, or failing");
for (const platform of ["web", "mobile", "desktop", "tauri", "electron"]) {
  const profile = builds.platforms.find(({ name }) => name === platform);
  if (profile?.minCss !== `platforms/gardener.${platform}.min.css`) errors.push(`Build documentation source is missing an independent ${platform} CSS entrypoint`);
}
const compatibilityContractCount = Object.values(compatibility.baseline || {}).reduce((sum, values) => sum + values.length, 0);
if (compatibility.version !== "2.1.0" || compatibility.baselineVersion !== "0.9.0" || compatibility.policy?.stage !== "stable" || compatibility.baseline.componentNames.length !== manifest.components.length || compatibilityContractCount !== 1145) errors.push("Compatibility baseline is missing, stale, or incomplete");
if (JSON.stringify(compatibility.baseline.packageEntrypoints) !== JSON.stringify(Object.keys(packageManifest.exports))) errors.push("Stable compatibility baseline does not cover every package export in order");
if (performance.compression?.gzipLevel !== 9 || performance.compression?.brotliQuality !== 11) errors.push("Performance report compression settings are missing or inconsistent");
for (const count of [publicApi.javascript.dataAttributes.behaviors.length, publicApi.javascript.dataAttributes.selectors.length, publicApi.javascript.dataAttributes.configuration.length, publicApi.javascript.dataAttributes.managedState.length]) {
  if (!docsText.includes(`${count} 个`)) errors.push(`docs.html runtime data attribute count is not synchronized (${count})`);
}

if (!docs.includes('id="vue"') || !docs.includes('id="vue-component-catalog"')) errors.push("docs.html missing the complete Vue project documentation and catalog host");
if (!siteJs.includes("setupVueCatalog") || !siteJs.includes("packages/vue/metadata/public-api.json") || !siteJs.includes("packages/vue/dist/catalog.json")) errors.push("site.js does not hydrate the Vue component catalog from canonical metadata");
if (vuePublicApi.version !== "2.1.0" || vuePublicApi.status !== "stable" || vuePublicApi.cssVersion !== packageManifest.version) errors.push("Vue 2.1.0 stable metadata is missing or does not match Gardenerim CSS");
if (vueCatalog.version !== vuePublicApi.version || vueCatalog.components.length !== vuePublicApi.components || vuePublicApi.componentExports.length !== vuePublicApi.components) errors.push("Vue component counts are not synchronized");
if (vueCompatibility.baseline.componentNames.length !== vueCatalog.components.length || JSON.stringify(vueCompatibility.baseline.componentNames) !== JSON.stringify(vueCatalog.components.map(({ name }) => name))) errors.push("Vue compatibility baseline does not cover every catalog component in order");
if (JSON.stringify(vuePublicApi.packageEntrypoints) !== JSON.stringify(Object.keys(vuePackageManifest.exports)) || JSON.stringify(vueCompatibility.baseline.packageEntrypoints) !== JSON.stringify(vuePublicApi.packageEntrypoints)) errors.push("Vue documentation source does not cover the complete package export map");
if (vuePublicApi.moduleExports.length !== 546 || vuePublicApi.typeExports.length !== 21 || vuePublicApi.packageEntrypoints.length !== 30 || vuePublicApi.composables.length !== 8 || vuePublicApi.componentProps.length !== 8 || vuePublicApi.themeAxes.length !== 10) errors.push("Vue public API inventory is incomplete");
if (vuePublicApi.componentExports.length !== new Set(vuePublicApi.componentExports).size || vueCatalog.components.length !== new Set(vueCatalog.components.map(({ name }) => name)).size) errors.push("Vue public component identifiers are not unique");
for (const marker of [...vuePublicApi.composables, ...vuePublicApi.componentProps, ...vuePublicApi.componentInstanceMembers, ...vuePublicApi.themeAxes, ...vuePublicApi.pluginOptions, vuePublicApi.directive, vuePublicApi.provider]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing Vue public API marker: ${marker}`);
}
for (const entrypoint of vuePublicApi.packageEntrypoints) {
  if (!docs.includes(entrypoint)) errors.push(`docs.html missing Vue package entrypoint: ${entrypoint}`);
}
for (const marker of ["2.1.0 Stable", "全部 506 个 Vue 组件", `${vuePublicApi.moduleExports.length} 个根运行时导出`, "21 个 TypeScript 类型导出", "30 个公共包入口", "28 个组件 CSS 包", `${bytes(vuePerformance.metrics.raw)} B raw`, `${bytes(vuePerformance.metrics.gzip)} B gzip`, `${bytes(vuePerformance.metrics.brotli)} B Brotli`, "3,894 B", "91", "295,992 B packed", "3,859,549 B unpacked", "SSR", "Hydration", "npm run release:verify"]) {
  if (!docsText.includes(marker)) errors.push(`docs.html missing Vue 2.1.0 documentation marker: ${marker}`);
}
for (const marker of ["Official Vue 3 bindings", "@gardenerim/vue", "506 个组件", "72 种 DOM", `${vuePublicApi.moduleExports.length} runtime exports`, "30 entrypoints", "28 CSS packs", "Vue 3.4+", "./docs.html#vue"]) {
  if (!homePage.includes(marker)) errors.push(`index.html missing Vue project introduction marker: ${marker}`);
}
for (const marker of ["@gardenerim/vue 2.1.0", "506 个 Vue 组件", `${vuePublicApi.moduleExports.length} 个根运行时导出`, "30 个公共包入口", "28 个组件 CSS 包", "Vue 公共 API", "Vue 组件目录"]) {
  if (!homeReadme.includes(marker)) errors.push(`README.md missing Vue documentation inventory marker: ${marker}`);
}
if (vuePerformance.status !== "passed" || Object.values(vuePerformance.metrics).some((value) => !Number.isInteger(value) || value <= 0)) errors.push("Vue documented performance budget is stale or failing");

if (!docs.includes('id="react"') || !docs.includes('id="react-component-catalog"')) errors.push("docs.html missing the complete React project documentation and catalog host");
if (!siteJs.includes("setupReactCatalog") || !siteJs.includes("setupFrameworkCatalog") || !siteJs.includes("packages/react/metadata/public-api.json") || !siteJs.includes("packages/react/dist/catalog.json")) errors.push("site.js does not hydrate the React component catalog from canonical metadata");
if (reactPublicApi.version !== "2.1.0" || reactPublicApi.status !== "stable" || reactPublicApi.cssVersion !== packageManifest.version) errors.push("React 2.1.0 stable metadata is missing or does not match Gardenerim CSS");
if (reactCatalog.version !== reactPublicApi.version || reactCatalog.components.length !== reactPublicApi.components || reactPublicApi.componentExports.length !== reactPublicApi.components) errors.push("React component counts are not synchronized");
if (reactCompatibility.baseline.componentNames.length !== reactCatalog.components.length || JSON.stringify(reactCompatibility.baseline.componentNames) !== JSON.stringify(reactCatalog.components.map(({ name }) => name))) errors.push("React compatibility baseline does not cover every catalog component in order");
if (JSON.stringify(reactPublicApi.packageEntrypoints) !== JSON.stringify(Object.keys(reactPackageManifest.exports)) || JSON.stringify(reactCompatibility.baseline.packageEntrypoints) !== JSON.stringify(reactPublicApi.packageEntrypoints)) errors.push("React documentation source does not cover the complete package export map");
if (reactPublicApi.moduleExports.length !== 546 || reactPublicApi.typeExports.length !== 22 || reactPublicApi.packageEntrypoints.length !== 30 || reactPublicApi.hooks.length !== 8 || reactPublicApi.componentProps.length !== 10 || reactPublicApi.themeAxes.length !== 10) errors.push("React public API inventory is incomplete");
if (reactPublicApi.componentExports.length !== new Set(reactPublicApi.componentExports).size || reactCatalog.components.length !== new Set(reactCatalog.components.map(({ name }) => name)).size) errors.push("React public component identifiers are not unique");
for (const marker of [...reactPublicApi.hooks, ...reactPublicApi.componentProps, ...reactPublicApi.componentHandleMembers, ...reactPublicApi.themeAxes, ...reactPublicApi.typeExports, reactPublicApi.provider]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing React public API marker: ${marker}`);
}
for (const marker of reactPublicApi.moduleExports.filter((name) => !reactPublicApi.componentExports.includes(name))) {
  if (!docs.includes(marker)) errors.push(`docs.html missing React non-component runtime export: ${marker}`);
}
for (const entrypoint of reactPublicApi.packageEntrypoints) {
  if (!docs.includes(entrypoint)) errors.push(`docs.html missing React package entrypoint: ${entrypoint}`);
}
for (const marker of ["2.1.0 Stable", "全部 506 个 React 组件", `${reactPublicApi.moduleExports.length} 个根运行时导出`, "22 个 TypeScript 类型导出", "30 个公共包入口", "28 个组件 CSS 包", `${bytes(reactPerformance.metrics.raw)} B raw`, `${bytes(reactPerformance.metrics.gzip)} B gzip`, `${bytes(reactPerformance.metrics.brotli)} B Brotli`, "2,685 B", "91", "273,601 B packed", "2,563,603 B unpacked", "SSR", "Hydration", "StrictMode", "npm run release:verify"]) {
  if (!docsText.includes(marker)) errors.push(`docs.html missing React 2.1.0 documentation marker: ${marker}`);
}
for (const marker of ["Official React bindings", "@gardenerim/react", "506 个 CSS", "72 种 DOM", `${reactPublicApi.moduleExports.length} runtime exports`, "30 entrypoints", "28 CSS packs", "React 18.3–19.x", "./docs.html#react"]) {
  if (!homePage.includes(marker)) errors.push(`index.html missing React project introduction marker: ${marker}`);
}
for (const marker of ["@gardenerim/react 2.1.0", "506 个 React 组件", `${reactPublicApi.moduleExports.length} 个根运行时导出`, "22 个类型导出", "30 个公共包入口", "React 公共 API", "React 组件目录"]) {
  if (!homeReadme.includes(marker)) errors.push(`README.md missing React documentation inventory marker: ${marker}`);
}
if (reactPerformance.status !== "passed" || Object.values(reactPerformance.metrics).some((value) => !Number.isInteger(value) || value <= 0)) errors.push("React documented performance budget is stale or failing");

if (!docs.includes('id="angular"') || !docs.includes('id="angular-component-catalog"')) errors.push("docs.html missing the complete AngularJS project documentation and catalog host");
if (!siteJs.includes("setupAngularCatalog") || !siteJs.includes("packages/angularjs/metadata/public-api.json") || !siteJs.includes("packages/angularjs/dist/catalog.json") || !siteJs.includes('packageName: "@gardenerim/angularjs"')) errors.push("site.js does not hydrate the AngularJS component catalog from canonical metadata");
if (angularPublicApi.version !== "2.1.0" || angularPublicApi.status !== "stable" || angularPublicApi.cssVersion !== packageManifest.version || angularPublicApi.angularjs !== angularPackageManifest.peerDependencies.angular) errors.push("AngularJS 2.1.0 stable metadata is missing or does not match Gardenerim CSS/package support");
if (angularCatalog.version !== angularPublicApi.version || angularCatalog.components.length !== angularPublicApi.components || angularPublicApi.componentExports.length !== angularPublicApi.components) errors.push("AngularJS component counts are not synchronized");
if (angularCompatibility.baseline.angularjs !== angularPublicApi.angularjs || angularCompatibility.baseline.componentNames.length !== angularCatalog.components.length || JSON.stringify(angularCompatibility.baseline.componentNames) !== JSON.stringify(angularCatalog.components.map(({ name }) => name))) errors.push("AngularJS compatibility baseline does not cover the supported version and every catalog component in order");
if (JSON.stringify(angularPublicApi.packageEntrypoints) !== JSON.stringify(Object.keys(angularPackageManifest.exports)) || JSON.stringify(angularCompatibility.baseline.packageEntrypoints) !== JSON.stringify(angularPublicApi.packageEntrypoints)) errors.push("AngularJS documentation source does not cover the complete package export map");
if (angularPublicApi.moduleExports.length !== 542 || angularPublicApi.typeExports.length !== 24 || angularPublicApi.packageEntrypoints.length !== 30 || angularPublicApi.services.length !== 3 || angularPublicApi.directives.length !== 2 || angularPublicApi.componentAttributes.length !== 8 || angularPublicApi.componentHandleMembers.length !== 4 || angularPublicApi.themeAxes.length !== 10) errors.push("AngularJS public API inventory is incomplete");
if (angularPublicApi.componentExports.length !== new Set(angularPublicApi.componentExports).size || angularCatalog.components.length !== new Set(angularCatalog.components.map(({ name }) => name)).size) errors.push("AngularJS public component identifiers are not unique");
for (const marker of [...angularPublicApi.services, ...angularPublicApi.directives, ...angularPublicApi.componentAttributes, ...angularPublicApi.componentHandleMembers, ...angularPublicApi.themeAxes, ...angularPublicApi.typeExports, angularPublicApi.moduleFactory]) {
  if (!docs.includes(marker)) errors.push(`docs.html missing AngularJS public API marker: ${marker}`);
}
for (const marker of angularPublicApi.moduleExports.filter((name) => !angularPublicApi.componentExports.includes(name))) {
  if (!docs.includes(marker)) errors.push(`docs.html missing AngularJS non-component runtime export: ${marker}`);
}
for (const entrypoint of angularPublicApi.packageEntrypoints) {
  if (!docs.includes(entrypoint)) errors.push(`docs.html missing AngularJS package entrypoint: ${entrypoint}`);
}
for (const marker of ["2.1.0 Stable", "全部 506 个 AngularJS 组件", `${angularPublicApi.moduleExports.length} 个根运行时导出`, "24 个 TypeScript 类型导出", "30 个公共包入口", "28 个组件 CSS 包代理", `${bytes(angularPerformance.metrics.raw)} B raw`, `${bytes(angularPerformance.metrics.gzip)} B gzip`, `${bytes(angularPerformance.metrics.brotli)} B Brotli`, "4,519 B", "87 个文件", "99 个文件", "335,530 B packed", "3,059,384 B unpacked", "AngularJS 1.8.2 / 1.8.3", "17 项运行时/契约测试", "20 项五引擎与移动端浏览器集成测试", "Axe WCAG A/AA", "peer dependency", "AngularJS 安全基线", "npm run release:verify"]) {
  if (!docsText.includes(marker)) errors.push(`docs.html missing AngularJS 2.1.0 documentation marker: ${marker}`);
}
for (const marker of ["Official AngularJS bindings", "@gardenerim/angularjs", "506 个 CSS", "72 种 DOM", `${angularPublicApi.moduleExports.length} runtime exports`, "30 entrypoints", "28 CSS packs", "AngularJS 1.8.2–1.8.3", "./docs.html#angular"]) {
  if (!homePage.includes(marker)) errors.push(`index.html missing AngularJS project introduction marker: ${marker}`);
}
for (const marker of ["@gardenerim/angularjs 2.1.0", "506 个 AngularJS 组件", `${angularPublicApi.moduleExports.length} 个根运行时导出`, "24 个类型导出", "30 个公共包入口", "AngularJS 公共 API", "AngularJS 组件目录", "EOL 安全基线"]) {
  if (!homeReadme.includes(marker)) errors.push(`README.md missing AngularJS documentation inventory marker: ${marker}`);
}
if (angularPerformance.status !== "passed" || Object.values(angularPerformance.metrics).some((value) => !Number.isInteger(value) || value <= 0)) errors.push("AngularJS documented performance budget is stale or failing");

if (!docs.includes('id="blazor"') || !docs.includes('id="blazor-component-catalog"')) errors.push("docs.html missing the complete Blazor project documentation and catalog host");
if (!siteJs.includes("setupBlazorCatalog") || !siteJs.includes("packages/blazor/metadata/public-api.json") || !siteJs.includes("packages/blazor/metadata/components.json") || !siteJs.includes('packageName: "Gardenerim.Blazor"')) errors.push("site.js does not hydrate the Blazor component catalog from canonical metadata");
if (blazorPublicApi.version !== "2.1.0" || blazorPublicApi.status !== "stable" || blazorPublicApi.cssVersion !== packageManifest.version || blazorPublicApi.targetFramework !== "net10.0" || JSON.stringify(blazorPublicApi.compatibleFrameworks) !== JSON.stringify(["net10.0", "net11.0"])) errors.push("Blazor 2.1.0 stable metadata is missing or does not match Gardenerim CSS/.NET support");
if (blazorCatalog.version !== blazorPublicApi.version || blazorCatalog.components.length !== blazorPublicApi.components || blazorPublicApi.componentTypes.length !== blazorPublicApi.components || JSON.stringify(blazorPublicApi.componentNames) !== JSON.stringify(blazorCatalog.components.map(({ name }) => name)) || JSON.stringify(blazorPublicApi.componentTypes) !== JSON.stringify(blazorCatalog.components.map(({ componentType }) => componentType))) errors.push("Blazor component names, types and counts are not synchronized");
if (JSON.stringify(blazorCompatibility.baseline.componentNames) !== JSON.stringify(blazorPublicApi.componentNames) || JSON.stringify(blazorCompatibility.baseline.componentTypes) !== JSON.stringify(blazorPublicApi.componentTypes) || JSON.stringify(blazorCompatibility.baseline.staticAssets) !== JSON.stringify(blazorPublicApi.staticAssets)) errors.push("Blazor compatibility baseline does not cover all components and static assets");
if (blazorPublicApi.behaviors !== 72 || blazorPublicApi.behaviorNames.length !== 72 || blazorPublicApi.behaviorContracts.length !== 72 || blazorPublicApi.events !== 79 || blazorPublicApi.eventNames.length !== 79 || blazorPublicApi.eventContracts.length !== 79 || blazorPublicApi.guardEvents.length !== 7 || blazorPublicApi.frameworkTypes.length !== 31 || blazorPublicApi.services.length !== 6 || blazorPublicApi.componentParameters.length !== 20 || blazorPublicApi.componentHandleMembers.length !== 6 || blazorPublicApi.themeAxes.length !== 10 || blazorPublicApi.staticAssets.length !== 45) errors.push("Blazor public API inventory is incomplete");
if (blazorPublicApi.componentTypes.length !== new Set(blazorPublicApi.componentTypes).size || blazorCatalog.components.length !== new Set(blazorCatalog.components.map(({ name }) => name)).size) errors.push("Blazor public component identifiers are not unique");
for (const marker of [...blazorPublicApi.frameworkTypes, ...blazorPublicApi.services, ...blazorPublicApi.componentParameters, ...blazorPublicApi.componentHandleMembers, ...blazorPublicApi.themeAxes]) {
  const encoded = marker.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  if (!docs.includes(marker) && !docs.includes(encoded)) errors.push(`docs.html missing Blazor public API marker: ${marker}`);
}
for (const marker of ["2.1.0 Stable", "全部 506 个 Blazor 组件", "72 个行为", "79 个事件", `${blazorPublicApi.frameworkTypes.length} 个框架类型`, "20 个参数", "6 个实例成员", `${blazorPublicApi.services.length} 个作用域服务`, `${blazorPublicApi.staticAssets.length} 个静态资源`, "42 个颜色主题", "net10.0", "net11.0", "Razor Class Library", "Interactive Server", "Interactive WebAssembly", "GardenerimField&lt;TValue&gt;", "GardenerimRuntimeCatalog", "7 个必须", "Source Map", `${bytes(blazorPerformance.assembly.bytes)} B`, `${bytes(blazorPerformance.staticAssets.bytes)} B`, `${bytes(blazorPerformance.entrypoints.css.gzipBytes)} B`, `${bytes(blazorPerformance.entrypoints.runtime.gzipBytes)} B`, `${bytes(blazorPerformance.entrypoints.blazor.gzipBytes)} B`, "1.27 MiB", `${bytes(blazorPerformance.package.budget)} B`, "Chromium、Firefox、WebKit", "Axe WCAG A/AA", "npm run release:verify", "npm run test:net11"]) {
  if (!docsText.includes(marker)) errors.push(`docs.html missing Blazor 2.1.0 documentation marker: ${marker}`);
}
for (const marker of ["Official Blazor RCL", "Gardenerim.Blazor", "506 个 CSS", "72 种 DOM", "79 种事件", "506 components", "72 behaviors", "79 events", `${blazorPublicApi.staticAssets.length} static assets`, ".NET 10 / 11", "./docs.html#blazor"]) {
  if (!homePage.includes(marker)) errors.push(`index.html missing Blazor project introduction marker: ${marker}`);
}
for (const marker of ["Gardenerim.Blazor 2.1.0", "506 个 Razor 组件目录", "72 个 DOM 行为", "79 个运行时事件", `${blazorPublicApi.frameworkTypes.length} 个框架类型`, "20 个共同参数", "6 个组件句柄成员", `${blazorPublicApi.services.length} 个服务`, `${blazorPublicApi.staticAssets.length} 个静态资源`, "Blazor 公共 API"]) {
  if (!homeReadme.includes(marker)) errors.push(`README.md missing Blazor documentation inventory marker: ${marker}`);
}
if (blazorPerformance.version !== "2.1.0" || !blazorPerformance.package || blazorPerformance.package.budget !== 6000000 || blazorPerformance.package.bytes <= 0 || blazorPerformance.package.bytes > blazorPerformance.package.budget || blazorPerformance.staticAssets.files !== blazorPublicApi.staticAssets.length) errors.push("Blazor documented performance report is stale or failing");

for (const marker of ["initI18n", "setLocale", "translateElement", "translateTemplate", "formatNumber", "gardener.locale", "data-site-language"]) {
  if (!siteJs.includes(marker) && !(await readFile(resolve(home, "assets/i18n.js"), "utf8")).includes(marker)) errors.push(`Website multilingual runtime missing marker: ${marker}`);
}
for (const marker of ["简体中文", "English", "日本語", "한국어", "Español", "Français", "Deutsch", "hreflang", "<html lang>", "assets/i18n/", "build-i18n.mjs", "只读取本站 JSON"]) {
  if (!homeReadme.includes(marker)) errors.push(`README.md missing multilingual contract marker: ${marker}`);
}

if (errors.length) throw new Error(`Gardenerim documentation coverage check failed:\n- ${[...new Set(errors)].join("\n- ")}`);
console.log(`Documentation coverage passed: ${sourceFiles.length} CSS modules, ${catalog.totals.classes} classes (${utilityClasses.size} utilities + ${semanticClasses.size} semantic), ${catalog.totals.customProperties} tokens, ${manifest.components.length} CSS components, ${manifest.behaviors.length} behaviors, ${recipes.recipes.length} recipes, ${vuePublicApi.componentExports.length} Vue components, ${reactPublicApi.componentExports.length} React components, ${angularPublicApi.componentExports.length} AngularJS components, ${blazorPublicApi.componentTypes.length} Blazor components.`);
