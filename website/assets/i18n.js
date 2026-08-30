const localeDefinitions = Object.freeze({
  "zh-CN": { label: "简体中文", htmlLang: "zh-CN", numberLocale: "zh-CN" },
  en: { label: "English", htmlLang: "en", numberLocale: "en" },
  ja: { label: "日本語", htmlLang: "ja", numberLocale: "ja" },
  ko: { label: "한국어", htmlLang: "ko", numberLocale: "ko" },
  es: { label: "Español", htmlLang: "es", numberLocale: "es" },
  fr: { label: "Français", htmlLang: "fr", numberLocale: "fr" },
  de: { label: "Deutsch", htmlLang: "de", numberLocale: "de" },
});

const sourceLocale = "zh-CN";
const defaultLocale = "en";
const textSources = new WeakMap();
const attributeSources = new WeakMap();
const translatedAttributes = ["aria-label", "placeholder", "title", "alt"];
let activeLocale = sourceLocale;
let messages = {};
let observer;

const normalizeLocale = (value) => {
  const locale = String(value || "").trim().toLowerCase();
  if (locale === "zh" || locale.startsWith("zh-")) return sourceLocale;
  return Object.keys(localeDefinitions).find((item) => item.toLowerCase() === locale) ||
    Object.keys(localeDefinitions).find((item) => locale.startsWith(`${item.toLowerCase()}-`)) ||
    sourceLocale;
};

const localizedPageUrl = (locale) => {
  const targetLocale = normalizeLocale(locale);
  const url = new URL(location.href);
  const segments = url.pathname.split("/");
  // Directory-style entry URLs such as /website/ still publish concrete
  // locale pages. Normalize them before inserting the locale so static hosts
  // receive /website/en/index.html instead of the non-file /website/en/.
  if (!segments.at(-1)) segments[segments.length - 1] = "index.html";
  const parent = decodeURIComponent(segments.at(-2) || "");
  if (Object.hasOwn(localeDefinitions, parent)) segments.splice(-2, 1);
  segments.splice(-1, 0, targetLocale);
  url.pathname = segments.join("/");
  url.search = "";
  return url;
};

const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();
const translateValue = (source) => messages[normalizeText(source)] || source;
const shouldIgnore = (node) => node.parentElement?.closest("code, pre, script, style, [data-i18n-ignore]");

function translateTextNode(node) {
  if (shouldIgnore(node)) return;
  if (!textSources.has(node)) textSources.set(node, node.nodeValue || "");
  const source = textSources.get(node);
  const normalized = normalizeText(source);
  if (!normalized) return;
  const translated = messages[normalized];
  if (!translated) {
    node.nodeValue = source;
    return;
  }
  const leading = source.match(/^\s*/)?.[0] || "";
  const trailing = source.match(/\s*$/)?.[0] || "";
  node.nodeValue = `${leading}${translated}${trailing}`;
}

function translateAttributes(element) {
  if (element.closest("[data-i18n-ignore]")) return;
  let sources = attributeSources.get(element);
  if (!sources) {
    sources = new Map();
    attributeSources.set(element, sources);
  }
  for (const name of translatedAttributes) {
    if (!element.hasAttribute(name)) continue;
    if (!sources.has(name)) sources.set(name, element.getAttribute(name));
    element.setAttribute(name, translateValue(sources.get(name)));
  }
}

export function translateElement(root = document.body) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
  if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
    else translateAttributes(node);
  }
}

async function loadMessages(locale) {
  if (locale === sourceLocale) return {};
  const response = await fetch(new URL(`./i18n/${locale}.json`, import.meta.url));
  if (!response.ok) throw new Error(`Unable to load locale ${locale}: ${response.status}`);
  return response.json();
}

function updateMetadata(locale) {
  const definition = localeDefinitions[locale];
  document.documentElement.lang = definition.htmlLang;
  document.documentElement.dataset.locale = locale;
  document.title = translateValue(document.documentElement.dataset.i18nTitle || document.title);
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    if (!description.dataset.i18nSource) description.dataset.i18nSource = description.content;
    description.content = translateValue(description.dataset.i18nSource);
  }
  document.querySelectorAll("[data-site-language]").forEach((select) => {
    select.value = locale;
    select.setAttribute("aria-label", translateValue("选择语言"));
  });
}

export async function setLocale(value, { updateUrl = true } = {}) {
  const locale = normalizeLocale(value);
  messages = await loadMessages(locale);
  activeLocale = locale;
  translateElement(document.body);
  updateMetadata(locale);
  localStorage.setItem("gardener.locale", locale);
  if (updateUrl) {
    const url = new URL(location.href);
    if (locale === sourceLocale) url.searchParams.delete("lang");
    else url.searchParams.set("lang", locale);
    history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }
  window.dispatchEvent(new CustomEvent("gardener:localechange", { detail: { locale } }));
}

export const getLocale = () => activeLocale;
export const formatNumber = (value) => Number(value).toLocaleString(localeDefinitions[activeLocale].numberLocale);
export const translate = (source) => translateValue(source);
export const translateTemplate = (source, values) => {
  let result = translateValue(source);
  for (const [key, value] of Object.entries(values)) result = result.replaceAll(`{${key}}`, String(value));
  return result;
};

export async function initI18n() {
  if (!document.documentElement.dataset.i18nTitle) document.documentElement.dataset.i18nTitle = document.title;
  const queryLocale = new URL(location.href).searchParams.get("lang");
  if (queryLocale) {
    const locale = normalizeLocale(queryLocale);
    localStorage.setItem("gardener.locale", locale);
    location.replace(localizedPageUrl(locale).href);
    return null;
  }
  if (!document.documentElement.dataset.locale) {
    location.replace(localizedPageUrl(defaultLocale).href);
    return null;
  }
  const requested = document.documentElement.dataset.locale ||
    document.documentElement.lang || sourceLocale;
  try {
    await setLocale(requested, { updateUrl: false });
  } catch (error) {
    console.warn(error);
    await setLocale(sourceLocale, { updateUrl: false });
  }
  document.querySelectorAll("[data-site-language]").forEach((select) => {
    select.addEventListener("change", () => {
      const locale = normalizeLocale(select.value);
      localStorage.setItem("gardener.locale", locale);
      location.assign(localizedPageUrl(locale).href);
    });
  });
  observer = new MutationObserver((records) => {
    for (const record of records) for (const node of record.addedNodes) translateElement(node);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return activeLocale;
}

export { localeDefinitions };
