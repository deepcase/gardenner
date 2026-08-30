import Gardener from "../../packages/css/dist/gardener.runtime.js";
import { formatNumber, initI18n, translate, translateTemplate } from "./i18n.js";

if (!window.GardenerFileI18nActive && (await initI18n()) === null) {
  // Keep the source page dormant while location.replace() loads its
  // locale-specific SEO page. Continuing would start requests that WebKit
  // reports as access-control failures when the navigation cancels them.
  await new Promise(() => {});
}

const manifestUrl = new URL(
  "../../packages/css/dist/gardener.manifest.json",
  import.meta.url,
);
const utilitiesUrl = new URL(
  "../../packages/css/dist/gardener.utilities.json",
  import.meta.url,
);
const recipesUrl = new URL(
  "../../packages/css/dist/gardener.recipes.json",
  import.meta.url,
);
const publicApiUrl = new URL(
  "../../packages/css/dist/gardener.public-api.json",
  import.meta.url,
);
const cssCatalogUrl = new URL("./css-catalog.json", import.meta.url);
const vuePublicApiUrl = new URL(
  "../../packages/vue/metadata/public-api.json",
  import.meta.url,
);
const vueCatalogUrl = new URL("../../packages/vue/dist/catalog.json", import.meta.url);
const reactPublicApiUrl = new URL(
  "../../packages/react/metadata/public-api.json",
  import.meta.url,
);
const reactCatalogUrl = new URL(
  "../../packages/react/dist/catalog.json",
  import.meta.url,
);
const angularPublicApiUrl = new URL(
  "../../packages/angularjs/metadata/public-api.json",
  import.meta.url,
);
const angularCatalogUrl = new URL(
  "../../packages/angularjs/dist/catalog.json",
  import.meta.url,
);
const blazorPublicApiUrl = new URL(
  "../../packages/blazor/metadata/public-api.json",
  import.meta.url,
);
const blazorCatalogUrl = new URL(
  "../../packages/blazor/metadata/components.json",
  import.meta.url,
);
const root = document.documentElement;
window.Gardener = Gardener;

const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character],
  );
const debounce = (callback, delay = 100) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), delay);
  };
};

async function readJson(url) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function setupMobileMenu() {
  const button = document.querySelector("[data-site-menu]");
  const menu = document.querySelector("#site-menu");
  if (!button || !menu) return;
  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("site-menu-open", open);
    if (!open)
      menu.querySelectorAll(".site-nav-dropdown[open]").forEach((dropdown) => {
        dropdown.open = false;
      });
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", translate(open ? "关闭导航" : "打开导航"));
    button.textContent = open ? "×" : "☰";
  };
  button.addEventListener("click", () =>
    setOpen(button.getAttribute("aria-expanded") !== "true"),
  );
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      button.focus();
    }
  });
  window
    .matchMedia("(min-width: 75.001rem)")
    .addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
}

function setupNavDropdowns() {
  const dropdowns = [...document.querySelectorAll(".site-nav-dropdown")];
  if (!dropdowns.length) return;
  const closeAll = (except) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== except) dropdown.open = false;
    });
  };
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("toggle", () => {
      if (dropdown.open) closeAll(dropdown);
    });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-nav-dropdown")) closeAll();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openDropdown = dropdowns.find((dropdown) => dropdown.open);
    if (!openDropdown) return;
    openDropdown.open = false;
    openDropdown.querySelector("summary")?.focus();
  });
}

function setupCopyFeedback() {
  document.addEventListener("gardener:copy", (event) => {
    const button = event.target.closest("[data-g-copy]");
    if (!button) return;
    const previous = button.textContent;
    button.textContent = translate("已复制");
    window.setTimeout(() => {
      if (button.isConnected) button.textContent = previous;
    }, 1400);
  });
}

function setupScrollableCode() {
  document.querySelectorAll("pre.site-code").forEach((code) => {
    if (!code.hasAttribute("tabindex")) code.tabIndex = 0;
    if (!code.hasAttribute("role")) code.setAttribute("role", "region");
    if (
      !code.hasAttribute("aria-label") &&
      !code.hasAttribute("aria-labelledby")
    )
      code.setAttribute("aria-label", translate("代码示例"));
  });
}

function themeColor(name) {
  const previous = root.dataset.gTheme;
  root.dataset.gTheme = name;
  const color = getComputedStyle(root)
    .getPropertyValue("--g-color-primary")
    .trim();
  root.dataset.gTheme = previous || "garden";
  return color;
}

function renderLandingThemes(themes) {
  const container = document.querySelector("#theme-swatches");
  const label = document.querySelector("#theme-name");
  if (!container) return;
  const fragment = document.createDocumentFragment();
  themes.forEach((theme) => {
    const button = document.createElement("button");
    button.className = "site-swatch";
    button.type = "button";
    button.style.setProperty("--swatch", themeColor(theme));
    button.setAttribute("aria-label", translateTemplate("使用 {theme} 主题", { theme }));
    button.setAttribute("aria-pressed", String(theme === root.dataset.gTheme));
    button.addEventListener("click", () => {
      root.dataset.gTheme = theme;
      label.textContent = theme;
      container
        .querySelectorAll(".site-swatch")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
    });
    fragment.append(button);
  });
  container.replaceChildren(fragment);
}

function renderDocThemes(themes) {
  const container = document.querySelector("#docs-theme-grid");
  if (!container) return;
  const original = root.dataset.gTheme;
  const fragment = document.createDocumentFragment();
  themes.forEach((theme) => {
    const item = document.createElement("span");
    item.className = "docs-theme";
    item.style.setProperty("--theme-color", themeColor(theme));
    item.textContent = theme;
    fragment.append(item);
  });
  root.dataset.gTheme = original;
  container.replaceChildren(fragment);
}

function renderRuntime(behaviors, components) {
  const container = document.querySelector("#runtime-grid");
  if (!container) return;
  container.innerHTML = behaviors
    .map((name) => {
      const owners = components
        .filter((component) => component.behaviors?.includes(name))
        .map((component) => component.name);
      return `<div class="docs-runtime-item"><code>data-g-${escapeHtml(name)}</code><small>${escapeHtml(owners.length ? owners.join("、") : translate("通用行为"))}</small></div>`;
    })
    .join("");
}

function renderPublicApi(api) {
  const summary = document.querySelector("#public-api-meta");
  const modules = document.querySelector("#public-module-grid");
  const behaviors = document.querySelector("#public-behavior-grid");
  const events = document.querySelector("#public-event-grid");
  const selectorAttributes = document.querySelector(
    "#public-selector-attribute-grid",
  );
  const configurationAttributes = document.querySelector(
    "#public-configuration-attribute-grid",
  );
  const managedAttributes = document.querySelector(
    "#public-managed-attribute-grid",
  );
  const adapters = document.querySelector("#public-adapter-grid");
  const attributeCount =
    api.javascript.dataAttributes.behaviors.length +
    api.javascript.dataAttributes.selectors.length +
    api.javascript.dataAttributes.configuration.length;
  if (summary)
    summary.textContent = `Contract ${api.contractVersion} · ${api.javascript.moduleExports.length} 个模块导出 · ${api.javascript.behaviorContracts.length} 个行为实例契约 · ${api.javascript.events.length} 种事件 · ${attributeCount} 个作者可用属性 · ${api.javascript.adapters.length} 个桌面适配器`;
  if (modules)
    modules.innerHTML = api.javascript.moduleContracts
      .map(
        (item) =>
          `<div class="docs-runtime-item"><code>${escapeHtml(item.name)}</code><small>${escapeHtml(item.signature)}</small></div>`,
      )
      .join("");
  if (behaviors)
    behaviors.innerHTML = api.javascript.behaviorContracts
      .map(
        (item) =>
          `<div class="docs-runtime-item"><code>${escapeHtml(item.attribute)}</code><small>${escapeHtml(item.instanceMembers.join(" · "))}</small></div>`,
      )
      .join("");
  if (events)
    events.innerHTML = api.javascript.eventContracts
      .map((item) => {
        const payload = item.detailKeys.length
          ? `detail: ${item.detailKeys.join(" · ")}`
          : "detail: 无字段";
        const flags = item.guard
          ? " · 可取消流程守卫"
          : " · bubbles · cancelable";
        return `<div class="docs-runtime-item"><code>gardener:${escapeHtml(item.name)}</code><small>${escapeHtml(payload + flags)}</small></div>`;
      })
      .join("");
  const renderAttributes = (container, names) => {
    if (container)
      container.innerHTML = names
        .map(
          (name) =>
            `<div class="docs-runtime-item"><code>${escapeHtml(name)}</code></div>`,
        )
        .join("");
  };
  renderAttributes(selectorAttributes, api.javascript.dataAttributes.selectors);
  renderAttributes(
    configurationAttributes,
    api.javascript.dataAttributes.configuration,
  );
  renderAttributes(
    managedAttributes,
    api.javascript.dataAttributes.managedState,
  );
  if (adapters)
    adapters.innerHTML = api.javascript.adapters
      .map(
        (item) =>
          `<div class="docs-runtime-item"><code>${escapeHtml(item.entrypoint)} · ${escapeHtml(item.export)}</code><small>actions: ${escapeHtml(item.actions.join(" · "))}<br>instance: ${escapeHtml(item.instanceMembers.join(" · "))}</small></div>`,
      )
      .join("");
}

function componentSearchText(component) {
  return JSON.stringify(component).toLocaleLowerCase();
}

function metadataRows(record, excluded = []) {
  return Object.entries(record)
    .filter(([key]) => !excluded.includes(key))
    .map(([key, value]) => {
      const display = Array.isArray(value)
        ? value.join(" · ")
        : typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
      return `<div class="docs-metadata-row"><dt>${escapeHtml(key)}</dt><dd><code>${escapeHtml(display)}</code></dd></div>`;
    })
    .join("");
}

function setupComponentCatalog(components) {
  const container = document.querySelector("#component-catalog");
  const search = document.querySelector("#component-search");
  const category = document.querySelector("#component-category");
  const meta = document.querySelector("#component-meta");
  if (!container || !search || !category || !meta) return;
  [...new Set(components.map((component) => component.category))]
    .sort()
    .forEach((name) => category.add(new Option(name, name)));
  const render = () => {
    const query = search.value.trim().toLocaleLowerCase();
    const categoryValue = category.value;
    const matches = components.filter(
      (component) =>
        (!categoryValue || component.category === categoryValue) &&
        (!query || componentSearchText(component).includes(query)),
    );
    meta.textContent = translateTemplate("显示 {shown} / {total} 个组件", { shown: formatNumber(matches.length), total: formatNumber(components.length) });
    if (!matches.length) {
      container.innerHTML =
        `<div class="docs-catalog-empty">${escapeHtml(translate("没有匹配的组件。"))}</div>`;
      return;
    }
    container.innerHTML = matches
      .map(
        (component) =>
          `<details class="docs-detail-card"><summary><span><strong>${escapeHtml(component.name)}</strong><small>${escapeHtml(component.category)} · ${escapeHtml(component.type)}</small></span><code>${escapeHtml(component.cssSelector || component.selector)}</code></summary><dl class="docs-metadata">${metadataRows(component, ["name", "category"])}</dl></details>`,
      )
      .join("");
  };
  search.addEventListener("input", debounce(render));
  category.addEventListener("change", render);
  render();
}

function setupFrameworkCatalog(api, catalog, framework, options = {}) {
  const id = options.id || framework.toLocaleLowerCase();
  const packageName = options.packageName || `@gardenerim/${id}`;
  const container = document.querySelector(`#${id}-component-catalog`);
  const search = document.querySelector(`#${id}-component-search`);
  const category = document.querySelector(`#${id}-component-category`);
  const meta = document.querySelector(`#${id}-component-meta`);
  if (!container || !search || !category || !meta) return;

  const components = catalog.components.map((component, index) => ({
    ...component,
    exportName: options.componentName?.(component, index) || api.componentExports[index],
  }));
  [...new Set(components.map((component) => component.category))]
    .sort()
    .forEach((name) => category.add(new Option(name, name)));

  const render = () => {
    const query = search.value.trim().toLocaleLowerCase();
    const categoryValue = category.value;
    const matches = components.filter(
      (component) =>
        (!categoryValue || component.category === categoryValue) &&
        (!query || componentSearchText(component).includes(query)),
    );
    meta.textContent = translateTemplate("显示 {shown} / {total} 个 {framework} 组件 · {package} {version}", { shown: formatNumber(matches.length), total: formatNumber(components.length), framework, package: packageName, version: api.version });
    if (!matches.length) {
      container.innerHTML =
        `<div class="docs-catalog-empty">${escapeHtml(translateTemplate("没有匹配的 {framework} 组件。", { framework }))}</div>`;
      return;
    }
    container.innerHTML = matches
      .map(
        (component) =>
          `<details class="docs-detail-card"><summary><span><strong>${escapeHtml(component.exportName)}</strong><small>${escapeHtml(component.name)} · ${escapeHtml(component.category)} · ${escapeHtml(component.type || component.kind)}</small></span><code>${escapeHtml(options.usage?.(component) || `import { ${component.exportName} } from &quot;${packageName}&quot;`)}</code></summary><dl class="docs-metadata">${metadataRows(component, ["exportName"])}</dl></details>`,
      )
      .join("");
  };
  search.addEventListener("input", debounce(render));
  category.addEventListener("change", render);
  render();
}

function setupVueCatalog(api, catalog) {
  setupFrameworkCatalog(api, catalog, "Vue");
}

function setupReactCatalog(api, catalog) {
  setupFrameworkCatalog(api, catalog, "React");
}

function setupAngularCatalog(api, catalog) {
  setupFrameworkCatalog(api, catalog, "AngularJS", {
    id: "angular",
    packageName: "@gardenerim/angularjs",
  });
}

function setupBlazorCatalog(api, catalog) {
  setupFrameworkCatalog(api, catalog, "Blazor", {
    id: "blazor",
    packageName: "Gardener.Blazor",
    componentName: (component) => component.componentType,
    usage: (component) => `<${component.componentType}>…</${component.componentType}>`,
  });
}

function setupUtilityCatalog(data) {
  const container = document.querySelector("#utility-catalog");
  const search = document.querySelector("#utility-search");
  const meta = document.querySelector("#utility-meta");
  const more = document.querySelector("#utility-more");
  if (!container || !search || !meta || !more) return;
  let limit = 100;
  const render = () => {
    const query = search.value.trim().toLocaleLowerCase();
    if (query.length < 2) {
      meta.textContent = translateTemplate("共 {total} 个工具类；输入至少两个字符开始搜索。", { total: formatNumber(data.count) });
      container.innerHTML = "";
      more.hidden = true;
      return;
    }
    const matches = data.utilities.filter((utility) =>
      [
        utility.class,
        utility.selector,
        ...(utility.declarations || []),
        utility.condition,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
    );
    const shown = matches.slice(0, limit);
    meta.textContent = translateTemplate("匹配 {matches} 项；显示 {shown} / {matches} 项。", { matches: formatNumber(matches.length), shown: formatNumber(shown.length) });
    if (!shown.length) {
      container.innerHTML =
        `<div class="docs-catalog-empty">${escapeHtml(translate("没有匹配的工具类。"))}</div>`;
      more.hidden = true;
      return;
    }
    container.innerHTML = shown
      .map(
        (utility) =>
          `<article class="docs-catalog-item"><strong>.${escapeHtml(utility.class)}</strong><code>${escapeHtml((utility.declarations || []).join("; "))}<br><small>${escapeHtml(utility.selector || `.${utility.class}`)}</small></code><small>${escapeHtml(utility.condition || "all viewports")}</small></article>`,
      )
      .join("");
    more.hidden = shown.length >= matches.length;
  };
  search.addEventListener(
    "input",
    debounce(() => {
      limit = 100;
      render();
    }),
  );
  more.addEventListener("click", () => {
    limit += 100;
    render();
  });
  render();
}

function renderRecipes(recipes) {
  const container = document.querySelector("#recipe-catalog");
  if (!container) return;
  container.innerHTML = recipes
    .map(
      (recipe) =>
        `<details class="docs-detail-card"><summary><span><strong>${escapeHtml(recipe.name)}</strong><small>${escapeHtml(recipe.id)} · ${escapeHtml(recipe.category)}</small></span><code>${escapeHtml(recipe.root)}</code></summary><dl class="docs-metadata">${metadataRows(recipe, ["name"])}</dl></details>`,
    )
    .join("");
}

function setupCssCatalog(data) {
  const container = document.querySelector("#css-api-catalog");
  const search = document.querySelector("#css-api-search");
  const kind = document.querySelector("#css-api-kind");
  const meta = document.querySelector("#css-api-meta");
  const more = document.querySelector("#css-api-more");
  const modules = document.querySelector("#css-module-catalog");
  if (!container || !search || !kind || !meta || !more || !modules) return;
  const datasets = {
    class: data.classes,
    selector: data.selectors,
    token: data.customProperties,
    state: data.stateHooks,
    attribute: data.dataAttributes,
    keyframe: data.keyframes,
  };
  const labels = {
    class: translate("语义类"),
    selector: translate("选择器"),
    token: "Token",
    state: translate("状态钩子"),
    attribute: translate("数据属性"),
    keyframe: translate("关键帧"),
  };
  document.querySelector("#css-stat-modules").textContent =
    data.totals.modules.toLocaleString("zh-CN");
  document.querySelector("#css-stat-classes").textContent =
    data.totals.classes.toLocaleString("zh-CN");
  document.querySelector("#css-stat-selectors").textContent =
    data.totals.rules.toLocaleString("zh-CN");
  document.querySelector("#css-stat-tokens").textContent =
    data.totals.customProperties.toLocaleString("zh-CN");
  let limit = 100;
  const render = () => {
    const query = search.value.trim().toLocaleLowerCase();
    const items = datasets[kind.value] || [];
    const matches = items.filter((item) =>
      JSON.stringify(item).toLocaleLowerCase().includes(query),
    );
    const shown = matches.slice(0, limit);
    meta.textContent = `${labels[kind.value]}共 ${items.length.toLocaleString("zh-CN")} 项；当前显示 ${shown.length.toLocaleString("zh-CN")} / ${matches.length.toLocaleString("zh-CN")} 项。`;
    container.innerHTML = shown.length
      ? shown
          .map((item) => {
            const extra = item.selectors || item.contexts || item.values || [];
            const prefix =
              kind.value === "class"
                ? "."
                : kind.value === "attribute"
                  ? "["
                  : "";
            const suffix = kind.value === "attribute" ? "]" : "";
            return `<article class="docs-catalog-item"><strong><code>${escapeHtml(prefix + item.name + suffix)}</code></strong><span>${escapeHtml(item.sources.join(" · "))}</span><small>${escapeHtml(extra.slice(0, 4).join(" · ") || "—")}</small></article>`;
          })
          .join("")
      : `<div class="docs-catalog-empty">${escapeHtml(translate("没有匹配的 CSS 接口。"))}</div>`;
    more.hidden = shown.length >= matches.length;
  };
  const resetRender = () => {
    limit = 100;
    render();
  };
  search.addEventListener("input", debounce(resetRender));
  kind.addEventListener("change", resetRender);
  more.addEventListener("click", () => {
    limit += 100;
    render();
  });
  modules.innerHTML = data.modules
    .map((module) => {
      const lists = [
        ["语义类", module.classes],
        ["状态钩子", module.stateHooks],
        ["Token", module.customProperties],
        ["数据属性", module.dataAttributes],
        ["关键帧", module.keyframes],
      ]
        .filter(([, values]) => values?.length)
        .map(
          ([label, values]) =>
            `<div class="docs-module-group"><strong>${label}</strong><p>${values.map((value) => `<code>${escapeHtml(value)}</code>`).join(" ")}</p></div>`,
        )
        .join("");
      const utilityLink = module.externalCatalog
        ? `<p><a href="../${escapeHtml(module.externalCatalog)}">打开全部 ${module.classCount.toLocaleString("zh-CN")} 个工具类的 JSON 清单</a></p>`
        : "";
      return `<details class="docs-module"><summary><code>${escapeHtml(module.file)}</code><small>${module.rules.toLocaleString("zh-CN")} rules · ${module.classCount.toLocaleString("zh-CN")} classes · ${(module.bytes / 1024).toFixed(1)} KiB</small></summary>${utilityLink}${lists || "<p>本模块不声明可检索的公开项。</p>"}</details>`;
    })
    .join("");
  render();
}

function setupSearchClear() {
  document.querySelectorAll("[data-clear-search]").forEach((button) =>
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.clearSearch);
      if (!input) return;
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    }),
  );
}

function setActiveDocsSection(id) {
  if (!id) return;
  document.querySelectorAll(".docs-sidebar-link").forEach((link) =>
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`),
  );
  const select = document.querySelector("#docs-jump");
  if (select?.querySelector(`option[value="#${CSS.escape(id)}"]`)) {
    select.value = `#${id}`;
  }
}

function setupDocsNavigation() {
  const select = document.querySelector("#docs-jump");
  select?.addEventListener("change", () => {
    location.hash = select.value;
  });
  const links = [...document.querySelectorAll(".docs-sidebar-link")];
  const sections = [...document.querySelectorAll(".docs-section")];
  if (!links.length || !sections.length || !("IntersectionObserver" in window))
    return;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      setActiveDocsSection(visible.target.id);
    },
    { rootMargin: "-20% 0px -70%", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
}

async function hydrateCatalogs() {
  const needsManifest = document.querySelector(
    "#theme-swatches, #docs-theme-grid, #component-catalog, #runtime-grid",
  );
  if (needsManifest) {
    try {
      const manifest = await readJson(manifestUrl);
      renderLandingThemes(manifest.themes);
      renderDocThemes(manifest.themes);
      renderRuntime(manifest.behaviors, manifest.components);
      setupComponentCatalog(manifest.components);
    } catch (error) {
      document
        .querySelectorAll(
          "#theme-swatches, #docs-theme-grid, #component-catalog, #runtime-grid",
        )
        .forEach((container) => {
          if (container)
            container.innerHTML = `<div class="docs-catalog-empty">能力清单加载失败：${escapeHtml(error.message)}</div>`;
        });
    }
  }
  if (document.querySelector("#utility-catalog")) {
    try {
      setupUtilityCatalog(await readJson(utilitiesUrl));
    } catch (error) {
      document.querySelector("#utility-meta").textContent =
        `工具类清单加载失败：${error.message}`;
    }
  }
  if (document.querySelector("#recipe-catalog")) {
    try {
      renderRecipes((await readJson(recipesUrl)).recipes);
    } catch (error) {
      document.querySelector("#recipe-catalog").innerHTML =
        `<div class="docs-catalog-empty">配方清单加载失败：${escapeHtml(error.message)}</div>`;
    }
  }
  if (document.querySelector("#public-api")) {
    try {
      renderPublicApi(await readJson(publicApiUrl));
    } catch (error) {
      document.querySelector("#public-api-meta").textContent =
        `公共 API 清单加载失败：${error.message}`;
    }
  }
  if (document.querySelector("#css-api-catalog")) {
    try {
      setupCssCatalog(await readJson(cssCatalogUrl));
    } catch (error) {
      document.querySelector("#css-api-meta").textContent =
        `CSS 索引加载失败：${error.message}`;
    }
  }
  if (document.querySelector("#vue-component-catalog")) {
    try {
      const [api, catalog] = await Promise.all([
        readJson(vuePublicApiUrl),
        readJson(vueCatalogUrl),
      ]);
      setupVueCatalog(api, catalog);
    } catch (error) {
      document.querySelector("#vue-component-meta").textContent =
        `Vue 组件清单加载失败：${error.message}`;
      document.querySelector("#vue-component-catalog").innerHTML =
        `<div class="docs-catalog-empty">Vue 组件清单加载失败：${escapeHtml(error.message)}</div>`;
    }
  }
  if (document.querySelector("#react-component-catalog")) {
    try {
      const [api, catalog] = await Promise.all([
        readJson(reactPublicApiUrl),
        readJson(reactCatalogUrl),
      ]);
      setupReactCatalog(api, catalog);
    } catch (error) {
      document.querySelector("#react-component-meta").textContent =
        `React 组件清单加载失败：${error.message}`;
      document.querySelector("#react-component-catalog").innerHTML =
        `<div class="docs-catalog-empty">React 组件清单加载失败：${escapeHtml(error.message)}</div>`;
    }
  }
  if (document.querySelector("#angular-component-catalog")) {
    try {
      const [api, catalog] = await Promise.all([
        readJson(angularPublicApiUrl),
        readJson(angularCatalogUrl),
      ]);
      setupAngularCatalog(api, catalog);
    } catch (error) {
      document.querySelector("#angular-component-meta").textContent =
        `AngularJS 组件清单加载失败：${error.message}`;
      document.querySelector("#angular-component-catalog").innerHTML =
        `<div class="docs-catalog-empty">AngularJS 组件清单加载失败：${escapeHtml(error.message)}</div>`;
    }
  }
  if (document.querySelector("#blazor-component-catalog")) {
    try {
      const [api, catalog] = await Promise.all([
        readJson(blazorPublicApiUrl),
        readJson(blazorCatalogUrl),
      ]);
      setupBlazorCatalog(api, catalog);
    } catch (error) {
      document.querySelector("#blazor-component-meta").textContent =
        `Blazor 组件清单加载失败：${error.message}`;
      document.querySelector("#blazor-component-catalog").innerHTML =
        `<div class="docs-catalog-empty">Blazor 组件清单加载失败：${escapeHtml(error.message)}</div>`;
    }
  }
}

function restoreHashTarget() {
  if (!location.hash) return;
  let id;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(id);
  if (!target) return;
  setActiveDocsSection(id);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => target.scrollIntoView({ block: "start" })),
  );
}

setupMobileMenu();
setupNavDropdowns();
setupCopyFeedback();
setupScrollableCode();
setupSearchClear();
setupDocsNavigation();
await hydrateCatalogs();
restoreHashTarget();
