import { access, readFile } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const required = [
  "gardener.css", "gardener.min.css", "gardener.core.css", "gardener.themes.css",
  "gardener.utilities.css", "gardener.components.css", "gardener.ai.css",
  "gardener.runtime.js", "gardener.runtime.min.js", "gardener.tauri.js", "gardener.electron.js",
  "gardener.manifest.json", "gardener.utilities.json", "gardener.recipes.json", "gardener.capabilities.json", "gardener.public-api.json"
];

for (const file of required) await access(join(dist, file));

const manifest = JSON.parse(await readFile(join(dist, "gardener.manifest.json"), "utf8"));
if (manifest.themes.length < 36) throw new Error(`Expected at least 36 themes, found ${manifest.themes.length}.`);
if (!manifest.components.length) throw new Error("Component metadata is empty.");
if (new Set(manifest.themes).size !== manifest.themes.length) throw new Error("Theme names must be unique.");
if (new Set(manifest.components.map(({ name }) => name)).size !== manifest.components.length) throw new Error("Component names must be unique.");

const requiredCategories = ["basic", "form", "navigation", "feedback", "overlay", "data", "layout", "dashboard", "media", "interaction", "commerce", "ai", "auth", "mobile", "cms", "marketing", "enterprise", "desktop", "workflow", "communication", "legal", "solution"];
const categories = new Set(manifest.components.map(({ category }) => category));
for (const category of requiredCategories) {
  if (!categories.has(category)) throw new Error(`Missing component category: ${category}`);
}

for (const mode of ["light", "dark", "system", "high-contrast"]) {
  if (!manifest.modes.includes(mode)) throw new Error(`Missing display mode: ${mode}`);
}

const css = await readFile(join(dist, "gardener.css"), "utf8");
for (const marker of [".g-btn", ".g-input", ".g-dialog", ".g-chat", ".g-dashboard", ".g-md-flex", ".g-auth-shell", ".g-mobile-category", ".g-cms-shell", ".g-desktop-shell", ".g-product-detail", ".g-permission-matrix"]) {
  if (!css.includes(marker)) throw new Error(`Missing CSS marker: ${marker}`);
}

const capabilities = JSON.parse(await readFile(join(dist, "gardener.capabilities.json"), "utf8"));
const gridCapability = capabilities.capabilities.find(({ id }) => id === "layout.grid");
const regionCapability = capabilities.capabilities.find(({ id }) => id === "layout.regions");
const primitiveCapability = capabilities.capabilities.find(({ id }) => id === "layout.primitives");
const pageCapability = capabilities.capabilities.find(({ id }) => id === "component.page");
const helpCapability = capabilities.capabilities.find(({ id }) => id === "component.help");
const formCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.form-compositions");
const navigationCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.navigation-compositions");
const dataCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.data-compositions");
const selectionCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.selection-compositions");
const contentCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.content-compositions");
const authCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.auth-compositions");
const commerceCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.commerce-compositions");
const mobileCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.mobile-compositions");
const desktopCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.desktop-compositions");
const aiCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.ai-compositions");
const solutionCompositionCapability = capabilities.capabilities.find(({ id }) => id === "component.solution-compositions");
if (!gridCapability || gridCapability.status !== "implemented") throw new Error("The complete grid capability is not registered as implemented.");
for (const marker of [".g-row", ".g-grid-24", ".g-grid-12", ".g-col", ".g-col-auto", ".g-col-fill", ".g-col-full", ".g-row-no-gutter", ".g-grid-container", ".g-subgrid", ".g-print-col-24"]) {
  if (!css.includes(marker)) throw new Error(`Missing grid system marker: ${marker}`);
}
for (let index = 1; index <= 24; index += 1) {
  for (const prefix of ["g-col-", "g-sm-col-", "g-md-col-", "g-lg-col-", "g-xl-col-", "g-2xl-col-", "g-print-col-"]) {
    if (!css.includes(`.${prefix}${index}`)) throw new Error(`Incomplete grid column matrix: .${prefix}${index}`);
  }
  for (const prefix of ["g-col-fill-from-", "g-md-col-fill-from-", "g-print-col-fill-from-"]) {
    if (!css.includes(`.${prefix}${index}`)) throw new Error(`Incomplete deterministic fill matrix: .${prefix}${index}`);
  }
}
for (let index = 0; index <= 23; index += 1) {
  for (const prefix of ["g-offset-", "g-md-offset-"]) if (!css.includes(`.${prefix}${index}`)) throw new Error(`Incomplete grid offset matrix: .${prefix}${index}`);
}
for (const marker of [".g-cq-sm-col-24", ".g-cq-md-col-24", ".g-cq-lg-col-24", ".g-order-24", ".g-2xl-order-24"]) {
  if (!css.includes(marker)) throw new Error(`Missing advanced grid capability: ${marker}`);
}
if (JSON.stringify(manifest.grid) !== JSON.stringify(gridCapability)) throw new Error("Grid capability is not synchronized with the main manifest.");
if (!regionCapability || regionCapability.status !== "implemented") throw new Error("The traditional region layout capability is not registered as implemented.");
for (const marker of regionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing region layout root: ${marker}`);
}
for (const marker of [".g-region-top", ".g-region-start", ".g-region-main", ".g-region-end", ".g-region-bottom", ".g-master", ".g-detail", ".g-region-list", ".g-region-inspector", ".g-dock-main", ".g-region-container", ".g-fixed-header-bar", ".g-fixed-sidebar", ".g-sticky-aside", ".g-workspace-main", ".g-mobile-layout-content", ".g-dock-layout.is-start-collapsed"]) {
  if (!css.includes(marker)) throw new Error(`Missing region layout contract: ${marker}`);
}
if (regionCapability.patterns.length !== 16) throw new Error(`Expected 16 registered region patterns, found ${regionCapability.patterns.length}.`);
if (JSON.stringify(manifest.regions) !== JSON.stringify(regionCapability)) throw new Error("Region capability is not synchronized with the main manifest.");
if (!primitiveCapability || primitiveCapability.status !== "implemented") throw new Error("The classic layout primitives capability is not registered as implemented.");
if (primitiveCapability.patterns.length !== 22) throw new Error(`Expected 22 registered classic layout primitives, found ${primitiveCapability.patterns.length}.`);
for (const marker of primitiveCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing classic layout primitive: ${marker}`);
}
for (const marker of [".g-stack.is-split", ".g-center.is-intrinsic", ".g-sidebar-pattern", ".g-cover-center", ".g-media-object-media", ".g-media-object-body", ".g-media-object-action", ".g-grid-auto", ".g-imposter-container", ".g-overlay-base", ".g-overlay-layer", ".g-bento-wide", ".g-bento-full", ".g-bento-tall", ".g-bento-featured", ".g-aspect-square", ".g-aspect-portrait", ".g-aspect-landscape", ".g-aspect-video", ".g-aspect-cinema", ".g-scroll-snap-item", ".g-layout-container"]) {
  if (!css.includes(marker)) throw new Error(`Missing classic layout primitive contract: ${marker}`);
}
if (JSON.stringify(manifest.primitives) !== JSON.stringify(primitiveCapability)) throw new Error("Classic layout primitives capability is not synchronized with the main manifest.");
if (!pageCapability || pageCapability.status !== "implemented") throw new Error("The page-level public component capability is not registered as implemented.");
if (pageCapability.patterns.length !== 23) throw new Error(`Expected 23 registered page-level component patterns, found ${pageCapability.patterns.length}.`);
for (const marker of pageCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing page-level component: ${marker}`);
}
for (const marker of [".g-page-header-main", ".g-page-header-title", ".g-page-header-actions", ".g-section-header-main", ".g-subheader-title", ".g-toolbar-start", ".g-toolbar-center", ".g-toolbar-end", ".g-toolbar-separator", ".g-action-bar-main", ".g-status-bar-section", ".g-command-bar-group", ".g-command-bar-item", ".g-context-bar-content", ".g-context-bar-actions", ".g-filter-bar-main", ".g-filter-bar-actions", ".g-bulk-action-count", ".g-bulk-action-actions", ".g-footer-bar-actions", ".g-divider-text", ".g-page-loading-content", ".g-page-state-content", ".g-page-state-code", ".g-page-state-actions", ".g-page-component-container"]) {
  if (!css.includes(marker)) throw new Error(`Missing page-level component contract: ${marker}`);
}
if (JSON.stringify(manifest.pageComponents) !== JSON.stringify(pageCapability)) throw new Error("Page-level component capability is not synchronized with the main manifest.");
if (!helpCapability || helpCapability.status !== "implemented") throw new Error("The Tip and help system capability is not registered as implemented.");
if (helpCapability.patterns.length !== 28) throw new Error(`Expected 28 registered Tip and help patterns, found ${helpCapability.patterns.length}.`);
for (const marker of helpCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing Tip and help component: ${marker}`);
}
for (const marker of [".g-tooltip-title", ".g-tooltip-description", ".g-help-popover-header", ".g-help-popover-body", ".g-callout-content", ".g-guidance-do", ".g-guidance-dont", ".g-shortcut-item", ".g-help-card-title", ".g-help-panel-body", ".g-help-center-title", ".g-help-search", ".g-help-topic", ".g-faq-question", ".g-contextual-help-content", ".g-coach-mark-actions", ".g-tour-step", ".g-tour-actions", ".g-hotspot-label", ".g-feature-hint-title", ".g-whats-new-item", ".g-help-checklist-item", ".g-troubleshooting-step", ".g-help-feedback-actions"] ) {
  if (!css.includes(marker)) throw new Error(`Missing Tip and help system contract: ${marker}`);
}
if (!manifest.behaviors.includes("tour")) throw new Error("Guided tour behavior is not registered.");
if (JSON.stringify(manifest.helpComponents) !== JSON.stringify(helpCapability)) throw new Error("Tip and help capability is not synchronized with the main manifest.");
if (!formCompositionCapability || formCompositionCapability.status !== "implemented") throw new Error("The traditional form composition capability is not registered as implemented.");
if (formCompositionCapability.patterns.length !== 37) throw new Error(`Expected 37 registered traditional form composition patterns, found ${formCompositionCapability.patterns.length}.`);
for (const marker of formCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing traditional form composition: ${marker}`);
}
for (const marker of [".g-form-section-header", ".g-field-header", ".g-field-meta", ".g-fieldset-legend", ".g-field-span-full", ".g-form-container", ".g-input-affix-start", ".g-search-field-action", ".g-password-field-action", ".g-clearable-field-action", ".g-character-count", ".g-validation-message", ".g-validation-summary-list", ".g-switch-row-content", ".g-choice-card", ".g-address-line", ".g-range-separator", ".g-range-field-output", ".g-file-field-name", ".g-repeatable-list", ".g-repeatable-item", ".g-form-progress-value", ".g-form-review-row", ".g-consent-group-title"]) {
  if (!css.includes(marker)) throw new Error(`Missing traditional form composition contract: ${marker}`);
}
for (const behavior of ["password-toggle", "clear-input", "character-count", "conditional-field", "repeatable-field"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`Traditional form behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.formCompositions) !== JSON.stringify(formCompositionCapability)) throw new Error("Traditional form composition capability is not synchronized with the main manifest.");
if (!navigationCompositionCapability || navigationCompositionCapability.status !== "implemented") throw new Error("The traditional navigation composition capability is not registered as implemented.");
if (navigationCompositionCapability.patterns.length !== 38) throw new Error(`Expected 38 registered traditional navigation composition patterns, found ${navigationCompositionCapability.patterns.length}.`);
for (const marker of navigationCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing traditional navigation composition: ${marker}`);
}
for (const marker of [".g-nav-group", ".g-nav-group-title", ".g-nav-item", ".g-nav-icon", ".g-nav-label", ".g-nav-badge", ".g-navbar-start", ".g-navbar-center", ".g-navbar-end", ".g-navbar-toggle", ".g-primary-nav-link", ".g-utility-nav-link", ".g-subnav-link", ".g-collapsible-nav-header", ".g-collapsible-nav-body", ".g-nav-rail-item", ".g-context-menu", ".g-tree-nav-group", ".g-tree-nav-row", ".g-tree-nav-toggle", ".g-vertical-tab-list", ".g-vertical-tab", ".g-vertical-tab-panel", ".g-pill-nav-link", ".g-scrollspy-link", ".g-cursor-pagination-info", ".g-load-more-status", ".g-wizard-nav-steps", ".g-wizard-nav-step", ".g-prev-next-link", ".g-skip-nav-link", ".g-mobile-top-nav-title", ".g-bottom-nav-item", ".g-mobile-tab-item", ".g-drawer-nav-header", ".g-drawer-nav-body", ".g-command-nav-item", ".g-quick-nav-item", ".g-locale-nav-trigger", ".g-account-nav-trigger", ".g-nav-container"]) {
  if (!css.includes(marker)) throw new Error(`Missing traditional navigation composition contract: ${marker}`);
}
for (const behavior of ["dropdown", "tabs", "tree", "command-palette", "nav-toggle", "roving-nav", "context-menu", "scrollspy", "jump-nav"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`Traditional navigation behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.navigationCompositions) !== JSON.stringify(navigationCompositionCapability)) throw new Error("Traditional navigation composition capability is not synchronized with the main manifest.");
if (!dataCompositionCapability || dataCompositionCapability.status !== "implemented") throw new Error("The data display and operation composition capability is not registered as implemented.");
if (dataCompositionCapability.patterns.length !== 48) throw new Error(`Expected 48 registered data display and operation patterns, found ${dataCompositionCapability.patterns.length}.`);
for (const marker of dataCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing data display and operation composition: ${marker}`);
}
for (const marker of [".g-data-title", ".g-data-number", ".g-responsive-table", ".g-table-cell-sticky-start", ".g-table-sort-indicator", ".g-editable-grid-row", ".g-editable-grid-cell", ".g-tree-table-toggle", ".g-table-group-row", ".g-expandable-table-detail", ".g-table-detail-content", ".g-row-disclosure", ".g-key-value-row", ".g-record-detail-header", ".g-media-list-item", ".g-dense-list-item", ".g-audit-log-date", ".g-metric-card-value", ".g-sparkline-bar", ".g-progress-stat-track", ".g-data-legend-item", ".g-ranking-item", ".g-status-summary-item", ".g-data-matrix-grid", ".g-heatmap-cell", ".g-data-toolbar-start", ".g-column-chooser-item", ".g-saved-view", ".g-export-option", ".g-data-state-visual", ".g-data-view-button", ".g-selection-summary-count", ".g-table-density-button", ".g-filter-summary-chip", ".g-sort-rule", ".g-data-inspector-body", ".g-data-container"]) {
  if (!css.includes(marker)) throw new Error(`Missing data display and operation contract: ${marker}`);
}
for (const behavior of ["data-grid", "tree", "table-sort", "row-select", "row-disclosure", "column-toggle", "data-filter", "data-view"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`Data display and operation behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.dataCompositions) !== JSON.stringify(dataCompositionCapability)) throw new Error("Data display and operation capability is not synchronized with the main manifest.");
if (!selectionCompositionCapability || selectionCompositionCapability.status !== "implemented") throw new Error("The selection and batch-operation capability is not registered as implemented.");
if (selectionCompositionCapability.patterns.length !== 32) throw new Error(`Expected 32 registered selection and batch-operation patterns, found ${selectionCompositionCapability.patterns.length}.`);
for (const marker of selectionCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing selection and batch-operation composition: ${marker}`);
}
for (const marker of [".g-selection-container", ".g-selection-control-meta", ".g-selection-scope-header", ".g-selection-scope-list", ".g-selection-item", ".g-batch-toolbar-summary", ".g-batch-toolbar-actions", ".g-transfer-pane", ".g-transfer-header", ".g-transfer-list", ".g-transfer-option", ".g-transfer-actions", ".g-picker-control", ".g-picker-input", ".g-picker-value", ".g-picker-panel", ".g-picker-results", ".g-picker-option", ".g-picker-avatar", ".g-media-picker-thumb", ".g-icon-picker-grid", ".g-icon-picker-item", ".g-color-picker-swatches", ".g-color-swatch", ".g-cascader-path", ".g-cascader-columns", ".g-cascader-option", ".g-range-picker-fields", ".g-range-picker-presets", ".g-saved-filter", ".g-builder-list", ".g-builder-rule", ".g-group-rule", ".g-bulk-confirmation-actions", ".g-bulk-progress-list"]) {
  if (!css.includes(marker)) throw new Error(`Missing selection and batch-operation contract: ${marker}`);
}
for (const behavior of ["row-select", "transfer", "picker", "cascader", "saved-choice", "builder-list", "column-toggle"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`Selection and batch-operation behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.selectionCompositions) !== JSON.stringify(selectionCompositionCapability)) throw new Error("Selection and batch-operation capability is not synchronized with the main manifest.");
if (!contentCompositionCapability || contentCompositionCapability.status !== "implemented") throw new Error("The file and content system capability is not registered as implemented.");
if (contentCompositionCapability.patterns.length !== 32) throw new Error(`Expected 32 registered file and content patterns, found ${contentCompositionCapability.patterns.length}.`);
for (const marker of contentCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing file and content composition: ${marker}`);
}
for (const marker of [".g-content-container", ".g-file-drop-icon", ".g-file-row", ".g-upload-item", ".g-upload-progress-bar", ".g-chunk-map", ".g-file-card-grid", ".g-folder-tree-item", ".g-file-browser-header", ".g-file-browser-main", ".g-file-preview-stage", ".g-media-item", ".g-media-thumb", ".g-media-details-preview", ".g-image-tools", ".g-image-stage", ".g-crop-frame", ".g-annotation-pin", ".g-viewer-toolbar", ".g-viewer-thumbnails", ".g-document-page", ".g-video-stage", ".g-media-controls", ".g-audio-art", ".g-code-editor-body", ".g-editor-surface", ".g-markdown-source", ".g-block", ".g-content-outline-item", ".g-find-replace-row", ".g-comment-body", ".g-revision-panels", ".g-diff-line-add", ".g-version-item", ".g-file-property", ".g-storage-track", ".g-autosave-dot"]) {
  if (!css.includes(marker)) throw new Error(`Missing file and content system contract: ${marker}`);
}
for (const behavior of ["dropzone", "upload-manager", "file-browser", "editor-shell", "revision-compare", "autosave"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`File and content behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.contentCompositions) !== JSON.stringify(contentCompositionCapability)) throw new Error("File and content capability is not synchronized with the main manifest.");
if (!authCompositionCapability || authCompositionCapability.status !== "implemented") throw new Error("The authentication and account capability is not registered as implemented.");
if (authCompositionCapability.patterns.length !== 32) throw new Error(`Expected 32 registered authentication and account patterns, found ${authCompositionCapability.patterns.length}.`);
for (const marker of authCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing authentication and account composition: ${marker}`);
}
for (const marker of [".g-auth-container", ".g-auth-panel", ".g-auth-split-aside", ".g-auth-split-main", ".g-auth-brand-row", ".g-auth-provider", ".g-auth-notice", ".g-auth-user", ".g-auth-choice", ".g-otp-cell", ".g-password-strength-meter", ".g-password-rule", ".g-auth-timer", ".g-passkey-graphic", ".g-qr-login-layout", ".g-qr-code", ".g-invitation-details", ".g-lock-screen-panel", ".g-session-expired-panel", ".g-identity-switcher-menu", ".g-security-section", ".g-device-item", ".g-login-event", ".g-security-alert-actions", ".g-recovery-code", ".g-connected-account", ".g-auth-consent-scope", ".g-auth-result-icon"]) {
  if (!css.includes(marker)) throw new Error(`Missing authentication and account contract: ${marker}`);
}
for (const behavior of ["password-toggle", "saved-choice", "dropdown", "copy", "dialog", "otp-input", "password-strength", "auth-timer"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`Authentication and account behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.authCompositions) !== JSON.stringify(authCompositionCapability)) throw new Error("Authentication and account capability is not synchronized with the main manifest.");
if (!commerceCompositionCapability || commerceCompositionCapability.status !== "implemented") throw new Error("The commerce and payment capability is not registered as implemented.");
if (commerceCompositionCapability.patterns.length !== 32) throw new Error(`Expected 32 registered commerce and payment patterns, found ${commerceCompositionCapability.patterns.length}.`);
for (const marker of commerceCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing commerce and payment composition: ${marker}`);
}
for (const marker of [".g-commerce-container", ".g-product-card-badge", ".g-product-list-item", ".g-product-gallery-thumb", ".g-product-detail-summary", ".g-price-current", ".g-stock-status", ".g-sku-group", ".g-sku-option", ".g-quantity-button", ".g-cart-item-media", ".g-cart-empty", ".g-mini-cart-footer", ".g-cart-summary-total", ".g-checkout-section", ".g-checkout-sidebar", ".g-checkout-mobile-actions", ".g-checkout-step-marker", ".g-address-main", ".g-shipping-option", ".g-pickup-option", ".g-coupon-status", ".g-promotion-item", ".g-invoice-fields", ".g-payment-option", ".g-payment-sheet-total", ".g-payment-result-icon", ".g-order-summary-total", ".g-order-timeline-item", ".g-order-detail-section", ".g-plan-price-value", ".g-usage-meter-track", ".g-billing-history-item", ".g-refund-status-progress", ".g-tax-summary-row"]) {
  if (!css.includes(marker)) throw new Error(`Missing commerce and payment contract: ${marker}`);
}
for (const behavior of ["quantity-stepper", "sku-selector", "cart", "coupon", "saved-choice", "carousel", "dropdown"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`Commerce and payment behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.commerceCompositions) !== JSON.stringify(commerceCompositionCapability)) throw new Error("Commerce and payment capability is not synchronized with the main manifest.");
if (!mobileCompositionCapability || mobileCompositionCapability.status !== "implemented") throw new Error("The mobile-specific capability is not registered as implemented.");
if (mobileCompositionCapability.patterns.length !== 32) throw new Error(`Expected 32 registered mobile-specific patterns, found ${mobileCompositionCapability.patterns.length}.`);
for (const marker of mobileCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing mobile-specific composition: ${marker}`);
}
for (const marker of [".g-mobile-safe-content", ".g-mobile-app-bar-title", ".g-mobile-bottom-navigation-item", ".g-mobile-sheet-panel", ".g-mobile-sheet-handle", ".g-mobile-pull-refresh-indicator", ".g-mobile-swipe-actions-track", ".g-mobile-category-grid", ".g-mobile-purchase-actions", ".g-mobile-search-field", ".g-mobile-wheel-column", ".g-mobile-keyboard-toolbar", ".g-mobile-media-viewer-stage", ".g-mobile-permission-actions", "env(safe-area-inset-bottom)", "100dvh", "@media (hover: none)"]) {
  if (!css.includes(marker)) throw new Error(`Missing mobile-specific contract: ${marker}`);
}
for (const behavior of ["mobile-sheet", "pull-refresh", "infinite-load", "swipe-actions", "wheel-picker", "tabs", "saved-choice", "dialog", "toast"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`Mobile-specific behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.mobileCompositions) !== JSON.stringify(mobileCompositionCapability)) throw new Error("Mobile-specific capability is not synchronized with the main manifest.");
if (!desktopCompositionCapability || desktopCompositionCapability.status !== "implemented") throw new Error("The desktop-specific capability is not registered as implemented.");
if (desktopCompositionCapability.patterns.length !== 32) throw new Error(`Expected 32 registered desktop-specific patterns, found ${desktopCompositionCapability.patterns.length}.`);
for (const marker of desktopCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing desktop-specific composition: ${marker}`);
}
for (const marker of [".g-native-titlebar-title", ".g-desktop-window-button", ".g-desktop-menubar-item", ".g-desktop-activity-item", ".g-desktop-panel-header", ".g-desktop-panel-body", ".g-split-panel", ".g-split-handle", ".g-desktop-status-item", ".g-desktop-command-panel", ".g-desktop-command-item", ".g-shortcut-recorder-control", ".g-desktop-menu-item", ".g-desktop-document-tab", ".g-desktop-no-drag", ".g-window-loading-progress", ".g-desktop-notice-main", ".g-native-file-picker-value", ".g-desktop-window-switcher-panel", ".g-desktop-window-item", ".g-recent-document", ".g-desktop-toolbar-group", ".g-background-task", ".g-desktop-notification", ".g-sync-status-dot", ".g-update-progress-track", ".g-desktop-state-actions", "app-region: drag", "@container g-desktop-workspace", "@media (forced-colors: active)"]) {
  if (!css.includes(marker)) throw new Error(`Missing desktop-specific contract: ${marker}`);
}
for (const behavior of ["shortcut-recorder", "desktop-tabs", "native-file-picker", "window-switcher", "split-pane", "command-palette", "context-menu", "roving-nav", "nav-toggle", "dropdown", "dialog"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`Desktop-specific behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.desktopCompositions) !== JSON.stringify(desktopCompositionCapability)) throw new Error("Desktop-specific capability is not synchronized with the main manifest.");
if (!aiCompositionCapability || aiCompositionCapability.status !== "implemented") throw new Error("The AI-specific capability is not registered as implemented.");
if (aiCompositionCapability.patterns.length !== 32) throw new Error(`Expected 32 registered AI-specific patterns, found ${aiCompositionCapability.patterns.length}.`);
for (const marker of aiCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing AI-specific composition: ${marker}`);
}
for (const marker of [".g-ai-sidebar-header", ".g-chat-list", ".g-message-avatar", ".g-message-body", ".g-composer-input", ".g-composer-toolbar", ".g-prompt-suggestions", ".g-prompt-suggestion", ".g-ai-command-item", ".g-model-selector-menu", ".g-thinking-content", ".g-streaming-response-body", ".g-tool-call-progress", ".g-approval-scope", ".g-agent-card", ".g-agent-handoff-main", ".g-source-list", ".g-artifact-toolbar", ".g-artifact-tabs", ".g-file-tree-item", ".g-version", ".g-generation-card", ".g-ai-memory-item", ".g-ai-usage-grid", ".g-voice-bar", ".g-permission-scope-list", ".g-ai-safety-actions", ".g-ai-feedback-option", "@container g-ai-shell", "env(safe-area-inset-bottom)"]) {
  if (!css.includes(marker)) throw new Error(`Missing AI-specific contract: ${marker}`);
}
for (const behavior of ["ai-composer", "prompt-fill", "ai-approval", "ai-feedback", "dropdown", "accordion", "roving-nav", "tabs", "tree"]) {
  if (!manifest.behaviors.includes(behavior)) throw new Error(`AI-specific behavior is not registered: ${behavior}`);
}
if (JSON.stringify(manifest.aiCompositions) !== JSON.stringify(aiCompositionCapability)) throw new Error("AI-specific capability is not synchronized with the main manifest.");
if (!solutionCompositionCapability || solutionCompositionCapability.status !== "implemented") throw new Error("The complete-page solution capability is not registered as implemented.");
if (solutionCompositionCapability.patterns.length !== 32) throw new Error(`Expected 32 registered complete-page solution patterns, found ${solutionCompositionCapability.patterns.length}.`);
for (const marker of solutionCompositionCapability.rootSelectors) {
  if (!css.includes(marker)) throw new Error(`Missing complete-page solution composition: ${marker}`);
}
for (const marker of [".g-solution-container", ".g-solution-header", ".g-solution-section", ".g-solution-grid", ".g-solution-card", ".g-solution-shell", ".g-solution-rail", ".g-solution-main", ".g-landing-hero", ".g-article-page-layout", ".g-docs-layout", ".g-search-results-layout", ".g-dashboard-metrics", ".g-record-detail-layout", ".g-onboarding-progress", ".g-crm-layout", ".g-project-board", ".g-support-thread", ".g-knowledge-layout", ".g-course-grid", ".g-booking-layout", ".g-healthcare-layout", ".g-finance-layout", ".g-public-service-layout", ".g-marketplace-grid", ".g-community-feed", ".g-status-services", "@container g-solution", "@media print"]) {
  if (!css.includes(marker)) throw new Error(`Missing complete-page solution contract: ${marker}`);
}
if (JSON.stringify(manifest.solutionCompositions) !== JSON.stringify(solutionCompositionCapability)) throw new Error("Complete-page solution capability is not synchronized with the main manifest.");

for (const theme of manifest.themes) {
  if (theme !== manifest.defaultTheme && !css.includes(`[data-g-theme="${theme}"]`)) throw new Error(`Theme CSS missing: ${theme}`);
}

const openBraces = [...css].filter((character) => character === "{").length;
const closeBraces = [...css].filter((character) => character === "}").length;
if (openBraces !== closeBraces) throw new Error(`Unbalanced CSS braces: ${openBraces} opening, ${closeBraces} closing.`);

const tokenSource = await readFile(join(root, "src/tokens/tokens.css"), "utf8");
if (!tokenSource.includes("--g-radius-md: 0.25rem")) throw new Error("The default radius must remain the small 4px radius unless intentionally revised.");

const utilityManifest = JSON.parse(await readFile(join(dist, "gardener.utilities.json"), "utf8"));
const utilityNames = utilityManifest.utilities.map((utility) => utility.class);
if (utilityManifest.count !== utilityNames.length || new Set(utilityNames).size !== utilityNames.length) throw new Error("Utility manifest contains duplicate classes.");
if (utilityNames.some((name) => name.startsWith("g--"))) throw new Error("Legacy ambiguous negative utility naming remains.");
const utilitySource = await readFile(join(root, "src/generated/utilities.css"), "utf8");
const normalizeUtilityName = (name) => name.replaceAll("\\/", "/").replaceAll("\\:", ":");
const utilityCssNames = new Set([...utilitySource.matchAll(/\.((?:\\.|[\w-])+)/g)].map((match) => normalizeUtilityName(match[1])).filter((name) => name.startsWith("g-")));
const utilityManifestNames = new Set(utilityNames);
const missingUtilityMetadata = [...utilityCssNames].filter((name) => !utilityManifestNames.has(name));
const missingUtilityCss = [...utilityManifestNames].filter((name) => !utilityCssNames.has(name));
if (missingUtilityMetadata.length || missingUtilityCss.length) throw new Error(`Utility CSS/manifest mismatch. Missing metadata: ${missingUtilityMetadata.join(", ") || "none"}; missing CSS: ${missingUtilityCss.join(", ") || "none"}.`);
const runtimeSource = await readFile(join(dist, "gardener.runtime.js"), "utf8");
for (const component of manifest.components.filter(({ type }) => type === "interactive")) {
  if (!component.behaviors?.length && !component.adapters?.length) throw new Error(`Interactive component lacks behavior or adapter metadata: ${component.name}`);
  for (const behavior of component.behaviors || []) {
    if (!runtimeSource.includes(`["${behavior}"`)) throw new Error(`Behavior is not registered for interactive component: ${component.name} (${behavior})`);
  }
  for (const adapter of component.adapters || []) {
    if (!["tauri", "electron"].includes(adapter)) throw new Error(`Unknown platform adapter for interactive component: ${component.name} (${adapter})`);
  }
}
for (const component of manifest.components.filter(({ selector }) => selector.startsWith("."))) {
  if (!css.includes(component.selector)) throw new Error(`Component selector has no CSS implementation: ${component.name} (${component.selector})`);
}
for (const component of manifest.components.filter(({ cssSelector }) => cssSelector)) {
  if (!css.includes(component.cssSelector)) throw new Error(`Component cssSelector has no CSS implementation: ${component.name} (${component.cssSelector})`);
}
const componentNames = new Set(manifest.components.map(({ name }) => name));
for (const [alias, target] of Object.entries(manifest.compositionAliases || {})) {
  if (!componentNames.has(target)) throw new Error(`Composition alias ${alias} points to missing component ${target}.`);
}
const solutionRecipes = manifest.recipes.filter(({ id }) => id.startsWith("solution."));
if (solutionRecipes.length !== 32) throw new Error(`Expected 32 complete-page solution recipes, found ${solutionRecipes.length}.`);
for (const recipe of solutionRecipes) {
  if (!solutionCompositionCapability.rootSelectors.includes(recipe.root)) throw new Error(`Solution recipe root is not registered: ${recipe.id} (${recipe.root}).`);
  for (const behavior of recipe.behaviors || []) if (!manifest.behaviors.includes(behavior)) throw new Error(`Solution recipe uses an unknown behavior: ${recipe.id} (${behavior}).`);
}
if (manifest.recipes.length < 52) throw new Error(`Expected at least 52 composed recipes, found ${manifest.recipes.length}.`);

console.log(`Checks passed: ${manifest.themes.length} themes and ${manifest.components.length} component definitions.`);
