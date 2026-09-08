export const coreFiles = [
  "layers.css",
  "tokens/tokens.css",
  "generated/scales.css",
  "generated/themes.css",
  "themes/axes.css",
  "reset/reset.css",
  "base/base.css",
];

export const utilityFiles = ["layers.css", "generated/utilities.css"];

export const componentPacks = {
  layouts: ["components/foundation.css", "layouts/layouts.css", "layouts/enhanced.css", "layouts/variants.css"],
  regions: ["layouts/regions.css"],
  primitives: ["layouts/primitives.css"],
  grid: ["generated/grid.css"],
  basic: ["components/basic.css", "components/foundation.css"],
  forms: ["components/forms.css", "components/foundation.css"],
  "form-compositions": ["components/form-compositions.css"],
  navigation: ["components/navigation.css"],
  "navigation-compositions": ["components/navigation-compositions.css"],
  feedback: ["components/feedback.css", "components/overlay.css", "components/disclosure.css"],
  data: ["components/foundation.css", "components/data.css", "components/data-variants.css", "components/data-display.css", "components/dashboard.css", "components/dashboard-variants.css"],
  "data-compositions": ["components/data-compositions.css"],
  "selection-compositions": ["components/selection-compositions.css", "components/interaction.css", "components/interaction-variants.css"],
  "content-compositions": ["components/content-compositions.css", "components/content-runtime.css", "components/content-variants.css", "components/communication-enhanced.css", "components/communication-variants.css"],
  "auth-compositions": ["components/auth-compositions.css", "components/auth-enhanced.css", "components/auth-variants.css"],
  "commerce-compositions": ["components/commerce-compositions.css", "components/commerce-enhanced.css", "components/commerce-variants.css"],
  "mobile-compositions": ["components/mobile-compositions.css", "components/mobile-enhanced.css", "components/mobile-variants.css"],
  extended: ["components/extended.css", "components/media-enhanced.css", "components/media-variants.css"],
  page: ["components/page.css"],
  help: ["components/help.css", "components/help-enhanced.css", "components/help-variants.css"],
  recipes: ["components/recipes.css", "components/cms-enhanced.css", "components/cms-variants.css", "components/marketing-enhanced.css", "components/marketing-variants.css", "components/enterprise-enhanced.css", "components/enterprise-variants.css"],
  desktop: ["components/desktop.css"],
  "desktop-compositions": ["components/desktop-compositions.css", "components/desktop-enhanced.css", "components/desktop-variants.css"],
  "solution-compositions": ["components/solution-compositions.css", "components/solution-enhanced.css"],
  catalog: ["components/catalog.css", "components/workflow-enhanced.css", "components/workflow-variants.css", "components/legal-enhanced.css", "components/legal-variants.css"],
  ai: ["components/ai.css", "components/ai-enhanced.css", "components/ai-variants.css"],
  "ai-extended": ["components/ai-extended.css"],
  "ai-compositions": ["components/ai-compositions.css"],
};

export const genericPacks = Object.keys(componentPacks).filter(
  (name) => !["mobile-compositions", "desktop", "desktop-compositions"].includes(name),
);

export const platformProfiles = {
  web: {
    cssProfile: "web",
    packs: genericPacks,
    adapters: [],
    platforms: ["web", "tablet", "print", "pwa"],
  },
  mobile: {
    cssProfile: "mobile",
    packs: [...genericPacks, "mobile-compositions"],
    adapters: [],
    platforms: ["web", "mobile", "tablet", "print", "pwa"],
  },
  desktop: {
    cssProfile: "desktop",
    packs: [...genericPacks, "desktop", "desktop-compositions"],
    adapters: [],
    platforms: ["web", "desktop", "desktop-webview", "print", "pwa"],
  },
  tauri: {
    cssProfile: "tauri",
    baseCssProfile: "desktop",
    packs: [...genericPacks, "desktop", "desktop-compositions"],
    adapters: ["tauri"],
    platforms: ["desktop", "desktop-webview", "tauri", "print"],
  },
  electron: {
    cssProfile: "electron",
    baseCssProfile: "desktop",
    packs: [...genericPacks, "desktop", "desktop-compositions"],
    adapters: ["electron"],
    platforms: ["desktop", "desktop-webview", "electron", "print"],
  },
};

export const categoryFallbackPacks = {
  basic: ["basic"],
  feedback: ["feedback"],
  form: ["forms", "form-compositions"],
  navigation: ["navigation", "navigation-compositions"],
  overlay: ["extended"],
  disclosure: ["feedback"],
  data: ["data", "data-compositions"],
  dashboard: ["data", "data-compositions"],
  interaction: ["extended"],
  content: ["content-compositions"],
  layout: ["layouts", "regions", "primitives", "grid"],
  help: ["help"],
  ai: ["ai", "ai-extended", "ai-compositions"],
  media: ["content-compositions"],
  commerce: ["commerce-compositions"],
  auth: ["auth-compositions"],
  mobile: ["mobile-compositions"],
  cms: ["recipes", "content-compositions"],
  marketing: ["recipes"],
  enterprise: ["recipes"],
  desktop: ["desktop", "desktop-compositions"],
  workflow: ["catalog"],
  communication: ["content-compositions"],
  legal: ["catalog"],
  solution: ["solution-compositions"],
};

export const browserTargets = ["chrome100", "firefox100", "safari15.4"];
