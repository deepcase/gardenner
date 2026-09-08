import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(root, "..", "..");
const metadata = JSON.parse(await readFile(join(root, "metadata/components.json"), "utf8"));
const builds = JSON.parse(await readFile(join(root, "dist/gardener.builds.json"), "utf8"));
const css = await readFile(join(root, "dist/gardener.css"), "utf8");
const outputJson = join(repositoryRoot, "docs/release-2.2/component-quality.json");
const outputMarkdown = join(repositoryRoot, "docs/release-2.2/component-quality.md");

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/gu)].map((match) => ({
  selector: match[1].trim(),
  declarations: match[2].trim(),
})).filter(({ selector }) => !selector.startsWith("@"));

const compositionCategories = new Set(["ai", "auth", "commerce", "communication", "content", "cms", "desktop", "enterprise", "help", "marketing", "solution", "workflow"]);
const passiveNames = /^(divider|spinner|skeleton|empty|status|progress|kpi|stat|metric|legend|storage|privacy|cost|price|tax|about|crash|update-progress)/u;
const selectionNames = /(select|picker|tabs?|menu|navigation|choice|radio|checkbox|tree|pagination|stepper|wizard|carousel|gallery|calendar|transfer|sort|filter|view)/u;
const overlayNames = /(dialog|drawer|popover|tooltip|sheet|modal|menu|toast|notification|lightbox|palette|tour)/u;
const atomicInteractiveNames = /^(button|input|textarea|select|checkbox-radio|switch|range-color|rating)$/u;
const selectionBehaviors = new Set(["saved-choice", "picker", "tabs", "tree", "carousel", "transfer", "row-select", "data-view", "column-toggle", "table-density", "cascader"]);
const overlayBehaviors = new Set(["dropdown", "popover", "tooltip", "dialog", "mobile-sheet", "context-menu", "command-palette"]);
const severityRank = { none: 4, small: 3, medium: 2, large: 1, critical: 0 };
const hasGlobalFocusFallback = /:focus-visible\s*\{[^}]*outline/iu.test(css);

function includesAny(value, signals) {
  return signals.some((signal) => value.includes(signal));
}

function mediaMentions(signatures) {
  return signatures.some((signature) => new RegExp(`@media[\\s\\S]{0,12000}${escape(signature)}(?:[^a-z0-9_-]|$)`, "iu").test(css));
}

function audit(component) {
  const signatures = builds.componentSignatures[component.name] || [component.selector].filter(Boolean);
  const partSignatures = (component.parts || []).map((part) => `.${part}`);
  const evidenceSignatures = [...new Set([...signatures, ...partSignatures])];
  const related = rules.filter(({ selector }) => evidenceSignatures.some((signature) => selector.includes(signature)));
  const selectors = related.map(({ selector }) => selector).join("\n");
  const declarations = related.map(({ declarations }) => declarations).join("\n");
  const variants = component.variants || [];
  const states = component.states || [];
  const parts = component.parts || [];
  const behaviors = component.behaviors || [];
  const interactive = component.type === "interactive" || behaviors.length > 0 || atomicInteractiveNames.test(component.name);
  const composition = compositionCategories.has(component.category) || includesAny(component.name, ["composition", "workspace", "shell", "portal", "center", "page"]);
  const structural = composition || partSignatures.length > 0 || (component.type === "interactive" && behaviors.length > 0);
  const dataIntensive = new Set(["ai", "cms", "commerce", "communication", "content", "dashboard", "data", "enterprise", "mobile", "navigation", "solution"]).has(component.category)
    && /(^|-)(table|grid|list|matrix|tree|manager|feed|audit-log|kanban|chart|heatmap|map|timeline|agenda)(-|$)|search-results/u.test(component.name)
    && !/(density|sort|toggle|detail|fullscreen-dialog)$/u.test(component.name);
  const hasFocus = includesAny(selectors, [":focus", ":focus-visible", ":focus-within"]);
  const hasPointer = includesAny(selectors, [":hover", ":active"]);
  const hasDisabled = includesAny(selectors, [":disabled", "aria-disabled", ".is-disabled", ":has(input:disabled)"]);
  const hasSelection = includesAny(selectors, ["aria-selected", "aria-checked", ":checked", "aria-current", ".is-selected", ".is-active", "aria-pressed"]);
  const hasLoading = includesAny(`${selectors}\n${declarations}`, ["is-loading", "aria-busy", "skeleton", "spinner", "progress"]);
  const hasEmpty = includesAny(`${selectors}\n${declarations}`, ["is-empty", "empty", "no-data"]);
  const hasResponsive = mediaMentions(evidenceSignatures);
  const hasSemantic = includesAny(`${selectors}\n${declarations}`, ["success", "warning", "danger", "error", "info", "state-color"]);
  const declaresDisabled = states.includes("disabled");
  const declaresPointerState = states.some((state) => ["hover", "pressed"].includes(state));
  const declaresSelectionState = states.some((state) => ["selected", "checked", "current"].includes(state)) || (states.includes("active") && selectionNames.test(component.name));
  const selectionBehavior = behaviors.some((behavior) => selectionBehaviors.has(behavior));
  const overlayBehavior = behaviors.some((behavior) => overlayBehaviors.has(behavior));
  const observations = [];
  let severity = "none";
  const add = (level, message) => {
    observations.push({ level, message });
    if (severityRank[level] < severityRank[severity]) severity = level;
  };
  if (!related.length) add("critical", "No emitted selector rule was found for the component signatures.");
  else if (related.length < 2 && !passiveNames.test(component.name) && !structural) add("large", "Only one emitted rule and no documented parts or behavior contract were found.");
  if (atomicInteractiveNames.test(component.name) && !hasFocus) add("large", "Atomic interactive component has no component-specific focus selector.");
  else if (interactive && !hasFocus && !hasGlobalFocusFallback) add("large", "Interactive component is not covered by a focus-visible fallback.");
  if (declaresDisabled && !hasDisabled) add("medium", "Component declares a disabled state but has no matching selector.");
  if (declaresPointerState && !hasPointer && !component.name.includes("input")) add("medium", "Component declares hover/active feedback but has no matching selector.");
  if ((declaresSelectionState || selectionBehavior) && !hasSelection) add("medium", "Declared selection/current state is not visible in component selectors.");
  if (overlayBehavior && !includesAny(selectors, ["aria-expanded", "is-open", "is-active", "hidden", "data-state"])) add("medium", "Overlay behavior does not expose a component-specific open or closed selector.");
  if (composition && component.platforms?.includes("mobile") && !hasResponsive) add("medium", "Composition has no signature-specific responsive rule.");
  if (dataIntensive && !hasLoading && !hasEmpty) add("small", "Data-heavy component does not expose component-specific loading or empty styling.");
  if (!variants.length && atomicInteractiveNames.test(component.name)) add("small", "Atomic component metadata exposes no visual variants.");
  if (!states.length && interactive && !behaviors.length) add("small", "Interactive component has neither explicit states nor a runtime behavior contract.");

  const score = Math.max(0, Math.min(100,
    (related.length ? 28 : 0) +
    Math.min(16, related.length * 2) +
    (variants.length || composition ? 10 : 4) +
    (states.length || !interactive ? 10 : 3) +
    (parts.length || behaviors.length || related.length >= 4 ? 8 : 3) +
    (!interactive || hasFocus || hasGlobalFocusFallback ? 8 : 0) +
    (!interactive || hasDisabled ? 6 : 0) +
    (!interactive || hasPointer ? 5 : 0) +
    (!composition || !component.platforms?.includes("mobile") || hasResponsive ? 5 : 0) +
    (hasSemantic || !states.some((state) => ["success", "warning", "danger", "error", "info"].includes(state)) ? 4 : 0)
  ));
  return {
    name: component.name,
    category: component.category,
    selector: component.selector,
    signatures,
    partSignatures,
    score,
    benchmarkGap: severityRank[severity] <= 1 ? "large" : severity === "medium" ? "medium" : severity === "small" ? "small" : "none",
    evidence: {
      rules: related.length,
      variants: variants.length,
      states: states.length,
      parts: parts.length,
      behaviors: behaviors.length,
      focus: hasFocus,
      inheritedFocus: interactive && !hasFocus && hasGlobalFocusFallback,
      hoverOrActive: hasPointer,
      disabled: hasDisabled,
      selection: hasSelection,
      loading: hasLoading,
      empty: hasEmpty,
      semantic: hasSemantic,
      responsive: hasResponsive,
    },
    observations,
  };
}

const components = metadata.components.map(audit).sort((left, right) => left.category.localeCompare(right.category) || left.name.localeCompare(right.name));
const counts = Object.fromEntries(["none", "small", "medium", "large"].map((gap) => [gap, components.filter((component) => component.benchmarkGap === gap).length]));
const byCategory = Object.fromEntries([...new Set(components.map(({ category }) => category))].sort().map((category) => {
  const group = components.filter((component) => component.category === category);
  return [category, {
    components: group.length,
    averageScore: Math.round(group.reduce((sum, component) => sum + component.score, 0) / group.length),
    large: group.filter(({ benchmarkGap }) => benchmarkGap === "large").length,
    medium: group.filter(({ benchmarkGap }) => benchmarkGap === "medium").length,
  }];
}));
const report = {
  schemaVersion: 1,
  version: builds.version,
  model: "Gardenerim component quality audit v1",
  benchmark: {
    references: ["Arco Design Vue", "Ant Design", "Element Plus"],
    dimensions: ["visual rules", "variants", "states", "parts/behaviors", "focus", "pointer feedback", "disabled", "selection/open", "loading/empty", "semantic feedback", "responsive behavior"],
    note: "A score is auditable evidence coverage, not a claim that subjective design is globally optimal.",
  },
  summary: {
    components: components.length,
    averageScore: Math.round(components.reduce((sum, component) => sum + component.score, 0) / components.length),
    gaps: counts,
    byCategory,
  },
  components,
};

const rows = components.map((component) => `| ${component.name} | ${component.category} | ${component.score} | ${component.benchmarkGap} | ${component.observations.map(({ message }) => message).join(" ") || "No structural gap detected by the audit model."} |`);
const markdown = `# Gardenerim 2.2.0 component-by-component quality audit

This deterministic report checks every published component against the same evidence model. It deliberately does not equate “CSS exists” with “the component is optimal”. Subjective visual review and browser testing remain required after this gate.

## Summary

- Components: ${report.summary.components}
- Average evidence score: ${report.summary.averageScore}/100
- Large gaps: ${counts.large}
- Medium gaps: ${counts.medium}
- Small gaps: ${counts.small}
- No detected structural gap: ${counts.none}

## Per-component results

| Component | Category | Score | Benchmark gap | Evidence gap |
| --- | --- | ---: | --- | --- |
${rows.join("\n")}
`;

if (process.argv.includes("--check")) {
  const currentJson = await readFile(outputJson, "utf8").catch(() => "");
  const currentMarkdown = await readFile(outputMarkdown, "utf8").catch(() => "");
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  if (currentJson !== nextJson || currentMarkdown !== markdown) throw new Error("Component quality audit is stale; run npm run audit:quality.");
} else {
  await writeFile(outputJson, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(outputMarkdown, markdown);
}

if (counts.large) throw new Error(`Component quality audit found ${counts.large} large benchmark gap(s).`);
console.log(`Component quality audit: ${components.length} components, average ${report.summary.averageScore}/100, ${counts.medium} medium and ${counts.small} small gap(s).`);
