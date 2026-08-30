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
  layouts: ["layouts/layouts.css"],
  regions: ["layouts/regions.css"],
  primitives: ["layouts/primitives.css"],
  grid: ["generated/grid.css"],
  basic: ["components/basic.css"],
  forms: ["components/forms.css"],
  "form-compositions": ["components/form-compositions.css"],
  navigation: ["components/navigation.css"],
  "navigation-compositions": ["components/navigation-compositions.css"],
  feedback: ["components/feedback.css"],
  data: ["components/data.css"],
  "data-compositions": ["components/data-compositions.css"],
  "selection-compositions": ["components/selection-compositions.css"],
  "content-compositions": ["components/content-compositions.css"],
  "auth-compositions": ["components/auth-compositions.css"],
  "commerce-compositions": ["components/commerce-compositions.css"],
  "mobile-compositions": ["components/mobile-compositions.css"],
  extended: ["components/extended.css"],
  page: ["components/page.css"],
  help: ["components/help.css"],
  recipes: ["components/recipes.css"],
  desktop: ["components/desktop.css"],
  "desktop-compositions": ["components/desktop-compositions.css"],
  "solution-compositions": ["components/solution-compositions.css"],
  catalog: ["components/catalog.css"],
  ai: ["components/ai.css"],
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
  disclosure: ["extended"],
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
  cms: ["content-compositions", "desktop-compositions"],
  marketing: ["solution-compositions"],
  enterprise: ["solution-compositions"],
  desktop: ["desktop", "desktop-compositions"],
  workflow: ["data-compositions", "selection-compositions"],
  communication: ["content-compositions"],
  legal: ["content-compositions"],
  solution: ["solution-compositions"],
};

export const browserTargets = ["chrome100", "firefox100", "safari15.4"];
