(() => {
  const parameters = new URLSearchParams(location.search);
  if (
    location.protocol !== "file:" &&
    !parameters.has("file-i18n-test")
  )
    return;

  window.GardenerimFileI18nActive = true;

  const localeDefinitions = Object.freeze({
    "zh-CN": { htmlLang: "zh-CN", numberLocale: "zh-CN" },
    en: { htmlLang: "en", numberLocale: "en" },
    ja: { htmlLang: "ja", numberLocale: "ja" },
    ko: { htmlLang: "ko", numberLocale: "ko" },
    es: { htmlLang: "es", numberLocale: "es" },
    fr: { htmlLang: "fr", numberLocale: "fr" },
    de: { htmlLang: "de", numberLocale: "de" },
  });
  const sourceLocale = "zh-CN";
  const translatedAttributes = ["aria-label", "placeholder", "title", "alt"];
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  const loaderUrl = new URL(document.currentScript.src);
  let activeLocale = sourceLocale;
  let messages = {};

  const normalizeLocale = (value) => {
    const locale = String(value || "").trim().toLowerCase();
    if (locale === "zh" || locale.startsWith("zh-")) return sourceLocale;
    return (
      Object.keys(localeDefinitions).find(
        (item) => item.toLowerCase() === locale,
      ) ||
      Object.keys(localeDefinitions).find((item) =>
        locale.startsWith(`${item.toLowerCase()}-`),
      ) ||
      sourceLocale
    );
  };
  const localizedPageUrl = (locale) => {
    const targetLocale = normalizeLocale(locale);
    const url = new URL(location.href);
    const segments = url.pathname.split("/");
    const parent = decodeURIComponent(segments.at(-2) || "");
    if (Object.hasOwn(localeDefinitions, parent)) segments.splice(-2, 1);
    segments.splice(-1, 0, targetLocale);
    url.pathname = segments.join("/");
    url.search = "";
    return url;
  };
  const normalizeText = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  const translateValue = (source) => messages[normalizeText(source)] || source;
  const shouldIgnore = (node) =>
    node.parentElement?.closest(
      "code, pre, script, style, [data-i18n-ignore]",
    );

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
    translatedAttributes.forEach((name) => {
      if (!element.hasAttribute(name)) return;
      if (!sources.has(name)) sources.set(name, element.getAttribute(name));
      element.setAttribute(name, translateValue(sources.get(name)));
    });
  }

  function translateElement(root = document.body) {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (
      root.nodeType !== Node.ELEMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_NODE
    )
      return;
    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    );
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else translateAttributes(node);
    }
  }

  async function loadMessages(locale) {
    if (locale === sourceLocale) return {};
    const dictionaries = (window.GardenerimFileI18nDictionaries ||= {});
    if (dictionaries[locale]) return dictionaries[locale];
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL(`./i18n/${locale}.js`, loaderUrl).href;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error(`Unable to load locale ${locale}`));
      document.head.append(script);
    });
    if (!dictionaries[locale])
      throw new Error(`Locale ${locale} did not register its messages`);
    return dictionaries[locale];
  }

  function updateMetadata(locale) {
    const definition = localeDefinitions[locale];
    document.documentElement.lang = definition.htmlLang;
    document.documentElement.dataset.locale = locale;
    document.title = translateValue(
      document.documentElement.dataset.i18nTitle || document.title,
    );
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      if (!description.dataset.i18nSource)
        description.dataset.i18nSource = description.content;
      description.content = translateValue(description.dataset.i18nSource);
    }
    document.querySelectorAll("[data-site-language]").forEach((select) => {
      select.value = locale;
      select.setAttribute("aria-label", translateValue("选择语言"));
    });
  }

  async function setLocale(value, { updateUrl = true } = {}) {
    const locale = normalizeLocale(value);
    messages = await loadMessages(locale);
    activeLocale = locale;
    translateElement(document.body);
    updateMetadata(locale);
    try {
      localStorage.setItem("gardener.locale", locale);
    } catch {}
    if (updateUrl) {
      const url = new URL(location.href);
      if (locale === sourceLocale) url.searchParams.delete("lang");
      else url.searchParams.set("lang", locale);
      try {
        history.replaceState(null, "", url.href);
      } catch {}
    }
  }

  async function initialize() {
    if (!document.documentElement.dataset.i18nTitle)
      document.documentElement.dataset.i18nTitle = document.title;
    let storedLocale;
    try {
      storedLocale = localStorage.getItem("gardener.locale");
    } catch {}
    const queryLocale = parameters.get("lang");
    if (queryLocale && !parameters.has("file-i18n-test")) {
      const locale = normalizeLocale(queryLocale);
      try {
        localStorage.setItem("gardener.locale", locale);
      } catch {}
      location.replace(localizedPageUrl(locale).href);
      return;
    }
    const requested =
      document.documentElement.dataset.locale ||
      document.documentElement.lang ||
      storedLocale ||
      sourceLocale;
    try {
      await setLocale(requested, { updateUrl: false });
    } catch (error) {
      console.error(error);
      await setLocale(sourceLocale, { updateUrl: false });
    }
    document.querySelectorAll("[data-site-language]").forEach((select) => {
      select.addEventListener("change", async () => {
        const locale = normalizeLocale(select.value);
        if (!parameters.has("file-i18n-test")) {
          try {
            localStorage.setItem("gardener.locale", locale);
          } catch {}
          location.assign(localizedPageUrl(locale).href);
          return;
        }
        try {
          await setLocale(locale);
        } catch (error) {
          console.error(error);
          document
            .querySelectorAll("[data-site-language]")
            .forEach((item) => (item.value = activeLocale));
        }
      });
    });
    const observer = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => translateElement(node)),
      );
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  initialize();
})();
