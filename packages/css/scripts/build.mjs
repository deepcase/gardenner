import { mkdir, readFile, writeFile, copyFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { themes, defaultTheme } from "../config/themes.mjs";
import {
  categoryFallbackPacks,
  componentPacks,
  coreFiles,
  platformProfiles,
} from "../config/builds.mjs";
import {
  byteMetrics,
  compression,
  contentIntegrity,
  inlineCss,
  minifier,
  minifyCss,
  minifyJavaScript,
  unique,
  writeMinifiedPair,
} from "./lib/build-tools.mjs";
import { adapterTypes, runtimeTypes } from "./lib/generate-types.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(projectRoot, "src");
const generatedRoot = join(sourceRoot, "generated");
const distRoot = join(projectRoot, "dist");
const { version } = JSON.parse(await readFile(join(projectRoot, "package.json"), "utf8"));

const banner = `/* Gardener v${version} | MIT License | gardener.css */\n`;

function shadeLightness(_base, shade) {
  return { 50: 97, 100: 93, 200: 84, 300: 72, 400: 60, 500: 50, 600: 41, 700: 33, 800: 25, 900: 18, 950: 11 }[shade];
}

function hslToRgb(hue, saturation, lightness) {
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n) => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const channel = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [channel(0), channel(8), channel(4)];
}

function luminance(rgb) {
  const linear = rgb.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(left, right) {
  const high = Math.max(left, right);
  const low = Math.min(left, right);
  return (high + 0.05) / (low + 0.05);
}

function readableForeground(theme, shade) {
  const saturation = Math.max(0, theme.saturation - (shade <= 100 ? 12 : 0));
  const background = luminance(hslToRgb(theme.hue, saturation, shadeLightness(theme.lightness, shade)));
  const darkContrast = contrast(background, 0);
  const lightContrast = contrast(background, 1);
  const bestContrast = Math.max(darkContrast, lightContrast);
  if (bestContrast < 4.5) throw new Error(`Theme ${theme.name} shade ${shade} cannot meet WCAG AA text contrast (${bestContrast.toFixed(2)}).`);
  return darkContrast >= lightContrast ? "#000000" : "#ffffff";
}

function primaryTextShade(theme, mode) {
  const softSaturation = Math.max(0, theme.saturation - 12);
  const background = mode === "dark"
    ? luminance([12 / 255, 17 / 255, 27 / 255])
    : luminance(hslToRgb(theme.hue, softSaturation, shadeLightness(theme.lightness, 100)));
  const candidates = mode === "dark" ? [400, 300, 200, 100, 50] : [600, 700, 800, 900, 950];
  const minimum = mode === "dark" ? 5 : 4.5;
  const shade = candidates.find((candidate) => {
    const saturation = Math.max(0, theme.saturation - (candidate <= 100 ? 12 : 0));
    return contrast(luminance(hslToRgb(theme.hue, saturation, shadeLightness(theme.lightness, candidate))), background) >= minimum;
  });
  if (!shade) throw new Error(`Theme ${theme.name} has no WCAG AA primary text shade for ${mode} mode.`);
  return shade;
}

function generateThemes() {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const blocks = themes.map((theme) => {
    const selector = theme.name === defaultTheme
      ? `:root, [data-g-theme="${theme.name}"]`
      : `[data-g-theme="${theme.name}"]`;
    const values = shades.map((shade) => {
      const saturation = Math.max(0, theme.saturation - (shade <= 100 ? 12 : 0));
      return `  --g-primary-${shade}: hsl(${theme.hue} ${saturation}% ${shadeLightness(theme.lightness, shade)}%);`;
    });
    return `${selector} {\n${values.join("\n")}\n  --g-on-primary-light: ${readableForeground(theme, 600)};\n  --g-on-primary-dark: ${readableForeground(theme, 400)};\n  --g-primary-text-light: var(--g-primary-${primaryTextShade(theme, "light")});\n  --g-primary-text-dark: var(--g-primary-${primaryTextShade(theme, "dark")});\n  --g-color-primary: var(--g-primary-600);\n  --g-color-primary-text: var(--g-primary-text-light);\n  --g-color-primary-hover: var(--g-primary-700);\n  --g-color-primary-active: var(--g-primary-800);\n  --g-color-primary-soft: var(--g-primary-100);\n  --g-color-on-primary: var(--g-on-primary-light);\n  --g-color-on-primary-soft: var(--g-primary-900);\n  --g-focus-ring: color-mix(in srgb, var(--g-primary-500) 32%, transparent);\n}`;
  });

  blocks.push(`[data-g-mode="dark"] {\n  color-scheme: dark;\n  --g-color-primary: var(--g-primary-400);\n  --g-color-primary-text: var(--g-primary-text-dark);\n  --g-color-primary-hover: var(--g-primary-300);\n  --g-color-primary-active: var(--g-primary-200);\n  --g-color-primary-soft: color-mix(in srgb, var(--g-primary-500) 18%, transparent);\n  --g-color-on-primary: var(--g-on-primary-dark);\n  --g-color-on-primary-soft: var(--g-primary-200);\n}`);
  blocks.push(`[data-g-mode="light"] { color-scheme: light; }`);
  blocks.push(`[data-g-mode="high-contrast"] {\n  color-scheme: light;\n  --g-border-width: 2px;\n  --g-color-canvas: #fff;\n  --g-color-surface: #fff;\n  --g-color-surface-raised: #fff;\n  --g-color-surface-subtle: #f2f2f2;\n  --g-color-text: #000;\n  --g-color-text-muted: #222;\n  --g-color-border: #000;\n  --g-color-border-strong: #000;\n  --g-color-primary: #0037a6;\n  --g-color-primary-text: #0037a6;\n  --g-color-primary-hover: #001f66;\n  --g-color-on-primary: #fff;\n  --g-focus-ring-width: 4px;\n}`);
  blocks.push(`@media (prefers-color-scheme: dark) {\n  :root:not([data-g-mode]), [data-g-mode="system"] {\n    color-scheme: dark;\n    --g-color-primary: var(--g-primary-400);\n    --g-color-primary-text: var(--g-primary-text-dark);\n    --g-color-primary-hover: var(--g-primary-300);\n    --g-color-primary-active: var(--g-primary-200);\n    --g-color-primary-soft: color-mix(in srgb, var(--g-primary-500) 18%, transparent);\n    --g-color-on-primary: var(--g-on-primary-dark);\n    --g-color-on-primary-soft: var(--g-primary-200);\n  }\n}`);
  return `@layer gardener.tokens {\n${blocks.join("\n\n")}\n}\n`;
}

const spaces = {
  0: "0", px: "1px", 0.5: "0.125rem", 1: "0.25rem", 1.5: "0.375rem",
  2: "0.5rem", 2.5: "0.625rem", 3: "0.75rem", 3.5: "0.875rem", 4: "1rem",
  5: "1.25rem", 6: "1.5rem", 7: "1.75rem", 8: "2rem", 9: "2.25rem",
  10: "2.5rem", 12: "3rem", 14: "3.5rem", 16: "4rem", 20: "5rem",
  24: "6rem", 28: "7rem", 32: "8rem", 40: "10rem", 48: "12rem",
  56: "14rem", 64: "16rem", 80: "20rem", 96: "24rem"
};

const cssStep = (step) => step.replace(".", "_");
const spaceVariable = (step) => `var(--g-space-${cssStep(step)})`;

function generateScales() {
  const values = Object.entries(spaces).map(([step, value]) => {
    if (value === "0") return `  --g-space-${cssStep(step)}: 0;`;
    return `  --g-space-${cssStep(step)}: calc(${value} * var(--g-density-factor, 1));`;
  });
  return `@layer gardener.tokens {\n:root {\n${values.join("\n")}\n}\n}\n`;
}

const utilityRule = (name, body) => `.${name}{${body}}`;
const breakpoints = [["sm", 480], ["md", 768], ["lg", 1024], ["xl", 1280], ["2xl", 1536]];

function gridPlacementRules(prefix = "g-") {
  const rules = [
    `.${prefix}col{grid-column:1/-1;min-inline-size:0}`,
    `.${prefix}col-auto{grid-column:auto;min-inline-size:0}`,
    `.${prefix}col-fill{grid-column:1/-1;min-inline-size:0}`,
    `.${prefix}col-full{grid-column:1/-1;min-inline-size:0}`,
    `.${prefix}col-hidden{display:none}`,
    `.${prefix}col-visible{display:revert}`,
    `.${prefix}offset-0{grid-column-start:auto}`,
    `.${prefix}col-start-auto{grid-column-start:auto}`,
    `.${prefix}col-end-auto{grid-column-end:auto}`
  ];
  for (let index = 1; index <= 24; index += 1) {
    rules.push(`.${prefix}col-${index}{grid-column:span ${index}/span ${index};min-inline-size:0}`);
    rules.push(`.${prefix}col-fill-from-${index}{grid-column:${index}/-1;min-inline-size:0}`);
  }
  for (let index = 1; index <= 23; index += 1) rules.push(`.${prefix}offset-${index}{grid-column-start:${index + 1}}`);
  for (let line = 1; line <= 25; line += 1) {
    rules.push(`.${prefix}col-start-${line}{grid-column-start:${line}}`);
    rules.push(`.${prefix}col-end-${line}{grid-column-end:${line}}`);
  }
  return rules;
}

function gridGutterRules(prefix = "g-") {
  const steps = ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12"];
  return steps.flatMap((step) => [
    `.${prefix}gutter-${step}{--g-grid-gutter-x:${spaceVariable(step)};--g-grid-gutter-y:${spaceVariable(step)}}`,
    `.${prefix}gutter-x-${step}{--g-grid-gutter-x:${spaceVariable(step)}}`,
    `.${prefix}gutter-y-${step}{--g-grid-gutter-y:${spaceVariable(step)}}`
  ]);
}

function generateGrid() {
  const base = [
    `:where(.g-row,.g-grid-24,.g-grid-12){--g-grid-columns:24;--g-grid-gutter-x:var(--g-space-4);--g-grid-gutter-y:var(--g-space-4);display:grid;grid-template-columns:repeat(var(--g-grid-columns),minmax(0,1fr));column-gap:var(--g-grid-gutter-x);row-gap:var(--g-grid-gutter-y);align-items:stretch;min-inline-size:0}`,
    `.g-grid-12{--g-grid-columns:12}`,
    `:where(.g-row,.g-grid-24,.g-grid-12)>*{min-inline-size:0}`,
    `.g-row-dense{grid-auto-flow:row dense}`,
    `.g-row-no-gutter{--g-grid-gutter-x:0;--g-grid-gutter-y:0}`,
    `.g-row-top{align-items:start}`,
    `.g-row-middle{align-items:center}`,
    `.g-row-bottom{align-items:end}`,
    `.g-row-stretch{align-items:stretch}`,
    `.g-col-self-start{align-self:start}`,
    `.g-col-self-center{align-self:center}`,
    `.g-col-self-end{align-self:end}`,
    `.g-col-self-stretch{align-self:stretch}`,
    `.g-grid-container{container-name:g-grid;container-type:inline-size}`,
    ...gridPlacementRules(),
    ...gridGutterRules()
  ];
  const responsive = breakpoints.map(([name, width]) => `@media (min-width:${width}px){${[
    ...gridPlacementRules(`g-${name}-`),
    ...gridGutterRules(`g-${name}-`)
  ].join("")}}`);
  const containerBreakpoints = [["sm", 480], ["md", 768], ["lg", 1024]].map(([name, width]) => `@container g-grid (min-width:${width}px){${gridPlacementRules(`g-cq-${name}-`).join("")}}`);
  const print = `@media print{${gridPlacementRules("g-print-").join("")}:where(.g-row,.g-grid-24,.g-grid-12){--g-grid-gutter-x:var(--g-space-3);--g-grid-gutter-y:var(--g-space-3)}.g-print-grid-12{--g-grid-columns:12}.g-print-grid-24{--g-grid-columns:24}}`;
  const subgrid = `@supports (grid-template-columns:subgrid){.g-subgrid-cols{display:grid;grid-template-columns:subgrid}.g-subgrid-rows{display:grid;grid-template-rows:subgrid}.g-subgrid{display:grid;grid-template-columns:subgrid;grid-template-rows:subgrid}}`;
  return `@layer gardener.components {\n${[...base, ...responsive, ...containerBreakpoints, print, subgrid].join("\n")}\n}\n`;
}

function spacingUtilities(prefix = "g-") {
  const axes = {
    m: ["margin"], mx: ["margin-inline"], my: ["margin-block"], mt: ["margin-top"],
    mr: ["margin-right"], mb: ["margin-bottom"], ml: ["margin-left"], ms: ["margin-inline-start"], me: ["margin-inline-end"],
    p: ["padding"], px: ["padding-inline"], py: ["padding-block"], pt: ["padding-top"],
    pr: ["padding-right"], pb: ["padding-bottom"], pl: ["padding-left"], ps: ["padding-inline-start"], pe: ["padding-inline-end"],
    gap: ["gap"], "gap-x": ["column-gap"], "gap-y": ["row-gap"]
  };
  const rules = [];
  for (const [key, properties] of Object.entries(axes)) {
    for (const [step] of Object.entries(spaces)) {
      rules.push(utilityRule(`${prefix}${key}-${cssStep(step)}`, properties.map((prop) => `${prop}:${spaceVariable(step)}`).join(";")));
      if (key.startsWith("m") && step !== "0" && step !== "px") {
        rules.push(utilityRule(`${prefix}neg-${key}-${cssStep(step)}`, properties.map((prop) => `${prop}:calc(-1 * ${spaceVariable(step)})`).join(";")));
      }
    }
  }
  rules.push(utilityRule(`${prefix}m-auto`, "margin:auto"));
  rules.push(utilityRule(`${prefix}mx-auto`, "margin-inline:auto"));
  rules.push(utilityRule(`${prefix}my-auto`, "margin-block:auto"));
  rules.push(utilityRule(`${prefix}mt-auto`, "margin-top:auto"));
  rules.push(utilityRule(`${prefix}mr-auto`, "margin-right:auto"));
  rules.push(utilityRule(`${prefix}mb-auto`, "margin-bottom:auto"));
  rules.push(utilityRule(`${prefix}ml-auto`, "margin-left:auto"));
  rules.push(utilityRule(`${prefix}ms-auto`, "margin-inline-start:auto"));
  rules.push(utilityRule(`${prefix}me-auto`, "margin-inline-end:auto"));
  return rules;
}

function dimensionUtilities(prefix = "g-") {
  const rules = [];
  for (const [step] of Object.entries(spaces)) {
    const name = cssStep(step);
    const value = spaceVariable(step);
    rules.push(utilityRule(`${prefix}w-${name}`, `width:${value}`));
    rules.push(utilityRule(`${prefix}h-${name}`, `height:${value}`));
    rules.push(utilityRule(`${prefix}min-w-${name}`, `min-width:${value}`));
    rules.push(utilityRule(`${prefix}min-h-${name}`, `min-height:${value}`));
    rules.push(utilityRule(`${prefix}max-w-${name}`, `max-width:${value}`));
    rules.push(utilityRule(`${prefix}max-h-${name}`, `max-height:${value}`));
  }
  const fractions = { "1of2": "50%", "1of3": "33.333333%", "2of3": "66.666667%", "1of4": "25%", "2of4": "50%", "3of4": "75%", "1of5": "20%", "2of5": "40%", "3of5": "60%", "4of5": "80%", "1of6": "16.666667%", "5of6": "83.333333%" };
  for (const [name, value] of Object.entries(fractions)) {
    rules.push(utilityRule(`${prefix}w-${name}`, `width:${value}`));
    rules.push(utilityRule(`${prefix}h-${name}`, `height:${value}`));
    rules.push(utilityRule(`${prefix}basis-${name}`, `flex-basis:${value}`));
  }
  rules.push(utilityRule(`${prefix}basis-auto`, "flex-basis:auto"));
  rules.push(utilityRule(`${prefix}basis-full`, "flex-basis:100%"));
  return rules;
}

function insetUtilities(prefix = "g-") {
  const axes = {
    inset: ["inset"], "inset-x": ["inset-inline"], "inset-y": ["inset-block"],
    top: ["top"], right: ["right"], bottom: ["bottom"], left: ["left"],
    start: ["inset-inline-start"], end: ["inset-inline-end"]
  };
  const rules = [];
  for (const [name, properties] of Object.entries(axes)) {
    for (const [step] of Object.entries(spaces)) {
      rules.push(utilityRule(`${prefix}${name}-${cssStep(step)}`, properties.map((property) => `${property}:${spaceVariable(step)}`).join(";")));
      if (step !== "0" && step !== "px") rules.push(utilityRule(`${prefix}neg-${name}-${cssStep(step)}`, properties.map((property) => `${property}:calc(-1 * ${spaceVariable(step)})`).join(";")));
    }
    rules.push(utilityRule(`${prefix}${name}-auto`, properties.map((property) => `${property}:auto`).join(";")));
  }
  return rules;
}

function staticUtilities(prefix = "g-") {
  const transform = "translate(var(--g-translate-x,0),var(--g-translate-y,0)) rotate(var(--g-rotate,0)) skewX(var(--g-skew-x,0)) skewY(var(--g-skew-y,0)) scaleX(var(--g-scale-x,1)) scaleY(var(--g-scale-y,1))";
  const map = {
    block: "display:block", inline: "display:inline", "inline-block": "display:inline-block", hidden: "display:none",
    flex: "display:flex", "inline-flex": "display:inline-flex", grid: "display:grid", "inline-grid": "display:inline-grid",
    contents: "display:contents", "flow-root": "display:flow-root", visible: "visibility:visible", invisible: "visibility:hidden", collapse: "visibility:collapse",
    "box-border": "box-sizing:border-box", "box-content": "box-sizing:content-box", isolate: "isolation:isolate",
    "float-start": "float:inline-start", "float-end": "float:inline-end", "float-none": "float:none", "clear-both": "clear:both",
    relative: "position:relative", absolute: "position:absolute", fixed: "position:fixed", sticky: "position:sticky",
    "flex-row": "flex-direction:row", "flex-row-reverse": "flex-direction:row-reverse", "flex-col": "flex-direction:column", "flex-col-reverse": "flex-direction:column-reverse", "flex-wrap": "flex-wrap:wrap", "flex-nowrap": "flex-wrap:nowrap",
    "flex-1": "flex:1 1 0%", "flex-auto": "flex:1 1 auto", "flex-initial": "flex:0 1 auto", "flex-none": "flex:none", grow: "flex-grow:1", "grow-0": "flex-grow:0", shrink: "flex-shrink:1", "shrink-0": "flex-shrink:0",
    "items-start": "align-items:flex-start", "items-center": "align-items:center", "items-end": "align-items:flex-end", "items-stretch": "align-items:stretch",
    "justify-start": "justify-content:flex-start", "justify-center": "justify-content:center", "justify-end": "justify-content:flex-end", "justify-between": "justify-content:space-between", "justify-around": "justify-content:space-around", "justify-evenly": "justify-content:space-evenly",
    "content-start": "align-content:flex-start", "content-center": "align-content:center", "content-end": "align-content:flex-end", "content-between": "align-content:space-between", "content-stretch": "align-content:stretch",
    "place-items-start": "place-items:start", "place-items-center": "place-items:center", "place-items-end": "place-items:end", "place-content-center": "place-content:center",
    "self-start": "align-self:flex-start", "self-center": "align-self:center", "self-end": "align-self:flex-end", "self-stretch": "align-self:stretch",
    "overflow-auto": "overflow:auto", "overflow-hidden": "overflow:hidden", "overflow-visible": "overflow:visible", "overflow-scroll": "overflow:scroll",
    "overflow-x-auto": "overflow-x:auto", "overflow-y-auto": "overflow-y:auto", "overscroll-none": "overscroll-behavior:none", "overscroll-contain": "overscroll-behavior:contain", "scroll-smooth": "scroll-behavior:smooth",
    "snap-x": "scroll-snap-type:x mandatory", "snap-y": "scroll-snap-type:y mandatory", "snap-start": "scroll-snap-align:start", "snap-center": "scroll-snap-align:center",
    "w-full": "width:100%", "w-auto": "width:auto", "w-screen": "width:100vw", "max-w-full": "max-width:100%", "max-w-reading": "max-width:var(--g-reading-max)", "max-w-content": "max-width:var(--g-content-max)",
    "h-full": "height:100%", "h-auto": "height:auto", "h-screen": "height:100vh", "h-svh": "height:100svh", "h-lvh": "height:100lvh", "h-dvh": "height:100dvh", "min-h-screen": "min-height:100vh", "min-h-svh": "min-height:100svh", "min-h-dvh": "min-height:100dvh",
    "text-left": "text-align:left", "text-center": "text-align:center", "text-right": "text-align:right", "text-justify": "text-align:justify",
    "font-sans": "font-family:var(--g-font-sans)", "font-serif": "font-family:var(--g-font-serif)", "font-mono": "font-family:var(--g-font-mono)", "font-normal": "font-weight:400", "font-medium": "font-weight:500", "font-semibold": "font-weight:600", "font-bold": "font-weight:700",
    italic: "font-style:italic", "not-italic": "font-style:normal", uppercase: "text-transform:uppercase", lowercase: "text-transform:lowercase", capitalize: "text-transform:capitalize", "normal-case": "text-transform:none",
    underline: "text-decoration-line:underline", "line-through": "text-decoration-line:line-through", "no-underline": "text-decoration-line:none",
    truncate: "overflow:hidden;text-overflow:ellipsis;white-space:nowrap", "whitespace-normal": "white-space:normal", "whitespace-nowrap": "white-space:nowrap", "whitespace-pre": "white-space:pre", "whitespace-pre-wrap": "white-space:pre-wrap", "break-words": "overflow-wrap:break-word", "break-all": "word-break:break-all",
    "leading-none": "line-height:1", "leading-tight": "line-height:var(--g-line-height-tight)", "leading-normal": "line-height:var(--g-line-height-normal)", "leading-relaxed": "line-height:var(--g-line-height-relaxed)",
    "tracking-tight": "letter-spacing:-.025em", "tracking-normal": "letter-spacing:0", "tracking-wide": "letter-spacing:.025em",
    "text-primary": "color:var(--g-color-primary-text)", "text-body": "color:var(--g-color-text)", "text-muted": "color:var(--g-color-text-muted)", "text-subtle": "color:var(--g-color-text-subtle)", "text-danger": "color:var(--g-color-danger)", "text-success": "color:var(--g-color-success)", "text-warning": "color:var(--g-color-warning)", "text-info": "color:var(--g-color-info)",
    "bg-primary": "background:var(--g-color-primary);color:var(--g-color-on-primary)", "bg-surface": "background:var(--g-color-surface)", "bg-subtle": "background:var(--g-color-surface-subtle)", "bg-transparent": "background:transparent",
    "bg-success": "background:var(--g-color-success-soft);color:var(--g-color-success)", "bg-warning": "background:var(--g-color-warning-soft);color:var(--g-color-warning)", "bg-danger": "background:var(--g-color-danger-soft);color:var(--g-color-danger)", "bg-info": "background:var(--g-color-info-soft);color:var(--g-color-info)",
    border: "border:var(--g-border-width) solid var(--g-color-border)", "border-0": "border:0", "border-t": "border-top:var(--g-border-width) solid var(--g-color-border)", "border-r": "border-right:var(--g-border-width) solid var(--g-color-border)", "border-b": "border-bottom:var(--g-border-width) solid var(--g-color-border)", "border-l": "border-left:var(--g-border-width) solid var(--g-color-border)", "border-x": "border-inline:var(--g-border-width) solid var(--g-color-border)", "border-y": "border-block:var(--g-border-width) solid var(--g-color-border)", "border-primary": "border-color:var(--g-color-primary)", "border-strong": "border-color:var(--g-color-border-strong)", "border-danger": "border-color:var(--g-color-danger)", "border-dashed": "border-style:dashed", "border-dotted": "border-style:dotted",
    "rounded-none": "border-radius:0", rounded: "border-radius:var(--g-radius-md)", "rounded-sm": "border-radius:var(--g-radius-sm)", "rounded-lg": "border-radius:var(--g-radius-lg)", "rounded-xl": "border-radius:var(--g-radius-xl)", "rounded-full": "border-radius:9999px",
    "shadow-none": "box-shadow:none", "shadow-sm": "box-shadow:var(--g-shadow-sm)", shadow: "box-shadow:var(--g-shadow-md)", "shadow-lg": "box-shadow:var(--g-shadow-lg)",
    "opacity-0": "opacity:0", "opacity-25": "opacity:.25", "opacity-50": "opacity:.5", "opacity-75": "opacity:.75", "opacity-100": "opacity:1",
    "cursor-pointer": "cursor:pointer", "cursor-default": "cursor:default", "cursor-move": "cursor:move", "cursor-grab": "cursor:grab", "cursor-wait": "cursor:wait", "cursor-not-allowed": "cursor:not-allowed", "select-none": "user-select:none", "select-text": "user-select:text", "select-all": "user-select:all", "pointer-events-none": "pointer-events:none", "pointer-events-auto": "pointer-events:auto",
    "touch-none": "touch-action:none", "touch-pan-x": "touch-action:pan-x", "touch-pan-y": "touch-action:pan-y", "resize": "resize:both", "resize-x": "resize:horizontal", "resize-y": "resize:vertical", "resize-none": "resize:none",
    "list-none": "list-style-type:none", "list-disc": "list-style-type:disc", "list-decimal": "list-style-type:decimal", "list-inside": "list-style-position:inside",
    "table-auto": "table-layout:auto", "table-fixed": "table-layout:fixed", "border-collapse": "border-collapse:collapse", "border-separate": "border-collapse:separate",
    "transition-none": "transition-property:none", transition: "transition:all var(--g-duration-normal) var(--g-ease-standard)", "transition-colors": "transition:color var(--g-duration-fast),background-color var(--g-duration-fast),border-color var(--g-duration-fast)", "transition-transform": "transition:transform var(--g-duration-normal) var(--g-ease-standard)",
    transform: `transform:${transform}`, "scale-95": `--g-scale-x:.95;--g-scale-y:.95;transform:${transform}`, "scale-100": `--g-scale-x:1;--g-scale-y:1;transform:${transform}`, "rotate-45": `--g-rotate:45deg;transform:${transform}`, "rotate-90": `--g-rotate:90deg;transform:${transform}`, "rotate-180": `--g-rotate:180deg;transform:${transform}`,
    grayscale: "filter:grayscale(1)", "grayscale-0": "filter:grayscale(0)", blur: "filter:blur(8px)", "backdrop-blur": "backdrop-filter:blur(12px)",
    "sr-only": "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0",
    "not-sr-only": "position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal",
    "aspect-square": "aspect-ratio:1", "aspect-video": "aspect-ratio:16/9", "aspect-photo": "aspect-ratio:4/3", "object-cover": "object-fit:cover", "object-contain": "object-fit:contain", "object-center": "object-position:center", "object-top": "object-position:top", "appearance-none": "appearance:none",
    "cq-container": "container-type:inline-size", "cq-size-container": "container-type:size", "cq-name-main": "container-name:g-main", "break-inside-avoid": "break-inside:avoid", "break-before-page": "break-before:page"
  };
  const rules = Object.entries(map).map(([name, body]) => utilityRule(`${prefix}${name}`, body));
  for (let i = 1; i <= 12; i += 1) {
    rules.push(utilityRule(`${prefix}grid-cols-${i}`, `grid-template-columns:repeat(${i},minmax(0,1fr))`));
    rules.push(utilityRule(`${prefix}col-span-${i}`, `grid-column:span ${i}/span ${i}`));
    rules.push(utilityRule(`${prefix}grid-rows-${i}`, `grid-template-rows:repeat(${i},minmax(0,1fr))`));
    rules.push(utilityRule(`${prefix}row-span-${i}`, `grid-row:span ${i}/span ${i}`));
  }
  rules.push(utilityRule(`${prefix}grid-flow-row`, "grid-auto-flow:row"));
  rules.push(utilityRule(`${prefix}grid-flow-col`, "grid-auto-flow:column"));
  rules.push(utilityRule(`${prefix}grid-flow-dense`, "grid-auto-flow:dense"));
  for (const width of [1, 2, 3, 4, 8]) rules.push(utilityRule(`${prefix}border-${width}`, `border-width:${width}px`));
  const fontSizes = { xs: ".75rem", sm: ".875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" };
  for (const [name, value] of Object.entries(fontSizes)) rules.push(utilityRule(`${prefix}text-${name}`, `font-size:${value}`));
  for (let i = 1; i <= 6; i += 1) rules.push(utilityRule(`${prefix}line-clamp-${i}`, `display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:${i}`));
  for (let i = 0; i <= 24; i += 1) rules.push(utilityRule(`${prefix}order-${i}`, `order:${i}`));
  for (const z of [0, 10, 20, 30, 40, 50]) rules.push(utilityRule(`${prefix}z-${z}`, `z-index:${z}`));
  return rules;
}

function stateUtilities() {
  return [
    ".g-hover-bg-primary:hover{background:var(--g-color-primary);color:var(--g-color-on-primary)}",
    ".g-hover-bg-subtle:hover{background:var(--g-color-surface-subtle)}",
    ".g-hover-text-primary:hover{color:var(--g-color-primary-text)}",
    ".g-focus-ring:focus-visible{outline:2px solid var(--g-color-primary);outline-offset:2px;box-shadow:0 0 0 var(--g-focus-ring-width) var(--g-focus-ring)}",
    ".g-active-scale:active{transform:scale(.98)}",
    ".g-disabled-opacity:disabled,.g-disabled-opacity[aria-disabled=\"true\"]{opacity:.55}",
    ".g-group:hover .g-group-hover-visible{visibility:visible;opacity:1}",
    ".g-peer:checked~.g-peer-checked-visible{display:block}",
    ".g-rtl-only{display:none}[dir=\"rtl\"] .g-rtl-only{display:revert}.g-ltr-only{display:revert}[dir=\"rtl\"] .g-ltr-only{display:none}",
    "[data-g-mode=\"dark\"] .g-dark-hidden{display:none}[data-g-mode=\"dark\"] .g-dark-block{display:block}",
    ":is([data-g-platform=\"desktop\"],[data-g-platform=\"tauri\"],[data-g-platform=\"electron\"]) .g-desktop-only{display:revert}[data-g-platform=\"web\"] .g-web-only{display:revert}[data-g-platform=\"mobile\"] .g-mobile-only{display:revert}",
    "@media (hover:hover){.g-hover-capable-block{display:block}}",
    "@media (pointer:coarse){.g-touch-only{display:revert}.g-pointer-fine-only{display:none}}",
    "@media (orientation:landscape){.g-landscape-flex{display:flex}.g-landscape-hidden{display:none}}",
    "@media (prefers-reduced-motion:no-preference){.g-motion-safe-transition{transition:all var(--g-duration-normal) var(--g-ease-standard)}}",
    "@media print{.g-print-hidden{display:none!important}.g-print-block{display:block!important}.g-print-break-before{break-before:page}}",
    "@container (min-width:20rem){.g-cq-sm-flex{display:flex}.g-cq-sm-grid{display:grid}.g-cq-sm-hidden{display:none}}",
    "@container (min-width:30rem){.g-cq-md-flex{display:flex}.g-cq-md-grid{display:grid}.g-cq-md-hidden{display:none}}",
    "@container (min-width:48rem){.g-cq-lg-flex{display:flex}.g-cq-lg-grid{display:grid}.g-cq-lg-hidden{display:none}}",
    "@container g-main (min-width:64rem){.g-cq-xl-flex{display:flex}.g-cq-xl-grid{display:grid}.g-cq-xl-hidden{display:none}}"
  ];
}

function assertUniqueUtilityRules(rules) {
  const names = rules.map((rule) => rule.match(/^\.([a-zA-Z0-9_-]+)\{/u)?.[1]).filter(Boolean);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  if (duplicates.length) throw new Error(`Duplicate utility selectors: ${[...new Set(duplicates)].join(", ")}`);
}

function generateUtilities() {
  const base = [...staticUtilities(), ...spacingUtilities(), ...dimensionUtilities(), ...insetUtilities(), ...stateUtilities()];
  assertUniqueUtilityRules(base);
  const responsive = breakpoints.map(([name, width]) => {
    const rules = [...staticUtilities(`g-${name}-`), ...spacingUtilities(`g-${name}-`), ...dimensionUtilities(`g-${name}-`), ...insetUtilities(`g-${name}-`)];
    assertUniqueUtilityRules(rules);
    return `@media (min-width:${width}px){${rules.join("")}}`;
  });
  const css = `@layer gardener.utilities {\n${base.join("\n")}\n${responsive.join("\n")}\n}\n`;
  return css;
}

function createUtilityManifest(css) {
  const utilities = [];
  const seen = new Set();
  const matchingBrace = (opening) => {
    let depth = 0;
    let quote = "";
    for (let index = opening; index < css.length; index += 1) {
      const character = css[index];
      if (quote) {
        if (character === "\\") index += 1;
        else if (character === quote) quote = "";
        continue;
      }
      if (character === '"' || character === "'") quote = character;
      else if (character === "{") depth += 1;
      else if (character === "}" && --depth === 0) return index;
    }
    return css.length - 1;
  };
  const walk = (start, end, conditions = []) => {
    let cursor = start;
    while (cursor < end) {
      while (cursor < end && /\s|;/.test(css[cursor])) cursor += 1;
      const opening = css.indexOf("{", cursor);
      if (opening < 0 || opening >= end) break;
      const prelude = css.slice(cursor, opening).trim();
      const closing = matchingBrace(opening);
      if (/^@(layer|supports|container|scope)\b/i.test(prelude)) walk(opening + 1, closing, conditions);
      else if (/^@media\b/i.test(prelude)) walk(opening + 1, closing, [...conditions, prelude.replace(/^@media\s*/i, "")]);
      else if (prelude && !prelude.startsWith("@")) {
        const classNames = [...prelude.matchAll(/\.((?:\\.|[\w-])+)/g)]
          .map((match) => match[1].replaceAll("\\/", "/").replaceAll("\\:", ":"))
          .filter((name) => name.startsWith("g-"));
        for (const className of classNames) {
          if (seen.has(className)) continue;
          seen.add(className);
          utilities.push({
            class: className,
            selector: prelude,
            declarations: css.slice(opening + 1, closing).split(";").map((item) => item.trim()).filter(Boolean),
            condition: conditions.length ? conditions.join(" and ") : null
          });
        }
      }
      cursor = closing + 1;
    }
  };
  walk(0, css.length);
  return { $schema: "../metadata/utilities.schema.json", schemaVersion: 2, classPrefix: "g-", count: utilities.length, utilities };
}

async function bundle(name, files, { emitUnminified = true, sourceMap = true } = {}) {
  const parts = [];
  for (const file of files) parts.push(await inlineCss(join(sourceRoot, file)));
  const css = `${banner}${parts.join("\n")}`;
  const outputPath = join(distRoot, name);
  await mkdir(dirname(outputPath), { recursive: true });
  if (emitUnminified) await writeFile(outputPath, css);
  const minifiedPath = outputPath.replace(/\.css$/u, ".min.css");
  await writeMinifiedPair(
    minifiedPath,
    await minifyCss(css, name, version),
    "css",
    { sourceMap },
  );
  return css;
}

await mkdir(generatedRoot, { recursive: true });
await mkdir(distRoot, { recursive: true });
await rm(join(distRoot, "components"), { recursive: true, force: true });
await rm(join(distRoot, "platforms"), { recursive: true, force: true });
const scalesCss = generateScales();
const themesCss = generateThemes();
const gridCss = generateGrid();
const utilitiesCss = generateUtilities();
await writeFile(join(generatedRoot, "scales.css"), scalesCss);
await writeFile(join(generatedRoot, "themes.css"), themesCss);
await writeFile(join(generatedRoot, "grid.css"), gridCss);
await writeFile(join(generatedRoot, "utilities.css"), utilitiesCss);

const componentFiles = Object.entries(componentPacks)
  .filter(([name]) => !name.startsWith("ai"))
  .flatMap(([, files]) => files);
await bundle("gardener.core.css", coreFiles);
await bundle("gardener.themes.css", ["layers.css", "tokens/tokens.css", "generated/scales.css", "generated/themes.css", "themes/axes.css"]);
await bundle("gardener.utilities.css", ["layers.css", "generated/utilities.css"]);
await bundle("gardener.components.css", ["layers.css", ...componentFiles]);
await bundle("gardener.ai.css", ["layers.css", "components/ai.css", "components/ai-extended.css", "components/ai-compositions.css"]);
const fullCss = await bundle("gardener.css", ["gardener.css"]);
for (const [name, files] of Object.entries(componentPacks)) {
  await bundle(`components/${name}.css`, ["layers.css", ...files], {
    emitUnminified: false,
    sourceMap: false,
  });
}
const emittedPlatformProfiles = Object.keys(platformProfiles);
for (const [profileName, profile] of Object.entries(platformProfiles)) {
  if (profile.baseCssProfile) {
    const source = `${banner}@import "./gardener.${profile.baseCssProfile}.min.css";\n`;
    const output = join(distRoot, `platforms/gardener.${profileName}.min.css`);
    await writeMinifiedPair(output, await minifyCss(source, `gardener.${profileName}.css`, version), "css", { sourceMap: false });
    continue;
  }
  const files = profile.packs.flatMap((pack) => componentPacks[pack]);
  await bundle(`platforms/gardener.${profileName}.css`, [
    ...coreFiles,
    ...files,
    "generated/utilities.css",
  ], { emitUnminified: false, sourceMap: false });
}
const runtime = await readFile(join(sourceRoot, "js/index.js"), "utf8");
const runtimeRegistry = runtime.match(/\[\s*\["dialog"[\s\S]*?\]\s*\.forEach\(\(\[name, factory\]\)/)?.[0] || "";
const registeredBehaviors = [...runtimeRegistry.matchAll(/\["([a-z-]+)"\s*,/g)].map((match) => match[1]);
await copyFile(join(sourceRoot, "js/index.js"), join(distRoot, "gardener.runtime.js"));
await copyFile(join(sourceRoot, "js/tauri-adapter.js"), join(distRoot, "gardener.tauri.js"));
await copyFile(join(sourceRoot, "js/electron-adapter.js"), join(distRoot, "gardener.electron.js"));
for (const [sourceName, outputName] of [
  ["index.js", "gardener.runtime.min.js"],
  ["tauri-adapter.js", "gardener.tauri.min.js"],
  ["electron-adapter.js", "gardener.electron.min.js"],
]) {
  const source = await readFile(join(sourceRoot, "js", sourceName), "utf8");
  await writeMinifiedPair(
    join(distRoot, outputName),
    await minifyJavaScript(source, sourceName, version),
    "js",
  );
}

const metadata = JSON.parse(await readFile(join(projectRoot, "metadata/components.json"), "utf8"));
const recipeMetadata = JSON.parse(await readFile(join(projectRoot, "metadata/recipes.json"), "utf8"));
const capabilityMetadata = JSON.parse(await readFile(join(projectRoot, "metadata/capabilities.json"), "utf8"));
const publicApiMetadata = JSON.parse(await readFile(join(projectRoot, "metadata/public-api.json"), "utf8"));
const compatibilityMetadata = JSON.parse(await readFile(join(projectRoot, "metadata/compatibility.json"), "utf8"));
await writeFile(join(distRoot, "gardener.d.ts"), runtimeTypes(publicApiMetadata, version));
for (const adapter of publicApiMetadata.javascript.adapters) {
  await writeFile(join(distRoot, `gardener.${adapter.name}.d.ts`), adapterTypes(adapter.name, adapter.export));
}
const packSources = Object.fromEntries(await Promise.all(
  Object.entries(componentPacks).map(async ([name, files]) => [
    name,
    (await Promise.all(files.map((file) => inlineCss(join(sourceRoot, file))))).join("\n"),
  ]),
));
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const signatureExists = (source, signature) => {
  if (signature.startsWith(".")) return new RegExp(`${escapeRegex(signature)}(?![A-Za-z0-9_-])`, "u").test(source);
  const attribute = signature.slice(1, -1);
  return new RegExp(`\\[${escapeRegex(attribute)}(?![A-Za-z0-9-])`, "u").test(source);
};
const signaturesFor = (component) => unique(
  [component.cssSelector, component.selector, `.g-${component.name}`]
    .filter(Boolean)
    .flatMap((selector) => [
      ...[...selector.matchAll(/\.g-[A-Za-z0-9_-]+/g)].map((match) => match[0]),
      ...[...selector.matchAll(/\[(data-g-[A-Za-z0-9-]+)/g)].map((match) => `[${match[1]}]`),
    ]),
);
const componentSignatures = Object.fromEntries(metadata.components.map((component) => [component.name, signaturesFor(component)]));
const componentOwnership = Object.fromEntries(metadata.components.map((component) => {
  const signatures = componentSignatures[component.name];
  const fallbacks = categoryFallbackPacks[component.category] || [];
  let packs = Object.keys(componentPacks).filter((pack) => signatures.some((signature) => signatureExists(packSources[pack], signature)));
  if (!packs.length) packs = fallbacks;
  if (!packs.length) throw new Error(`No component pack ownership for ${component.name}`);
  return [component.name, packs];
}));
const manifest = {
  $schema: "../metadata/manifest.schema.json",
  schemaVersion: 3,
  name: "Gardener",
  version,
  classPrefix: "g-",
  defaultTheme,
  themes: themes.map((theme) => theme.name),
  modes: ["light", "dark", "system", "high-contrast"],
  axes: {
    neutral: ["cool", "warm", "gray", "ink", "cream", "blueprint", "paper"],
    typography: ["system", "corporate", "humanist", "editorial", "technical", "geometric", "rounded", "classic", "compact", "cjk"],
    shape: ["sharp", "small", "medium", "soft", "round"],
    density: ["compact", "standard", "comfortable", "touch"],
    elevation: ["flat", "bordered", "layered", "floating"],
    motion: ["none", "calm", "standard", "quick"],
    platform: ["web", "mobile", "desktop", "tauri", "electron"],
    os: ["windows", "macos", "linux"]
  },
  breakpoints: { sm: 480, md: 768, lg: 1024, xl: 1280, "2xl": 1536 },
  grid: capabilityMetadata.capabilities.find((capability) => capability.id === "layout.grid"),
  regions: capabilityMetadata.capabilities.find((capability) => capability.id === "layout.regions"),
  primitives: capabilityMetadata.capabilities.find((capability) => capability.id === "layout.primitives"),
  pageComponents: capabilityMetadata.capabilities.find((capability) => capability.id === "component.page"),
  helpComponents: capabilityMetadata.capabilities.find((capability) => capability.id === "component.help"),
  formCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.form-compositions"),
  navigationCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.navigation-compositions"),
  dataCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.data-compositions"),
  selectionCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.selection-compositions"),
  contentCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.content-compositions"),
  authCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.auth-compositions"),
  commerceCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.commerce-compositions"),
  mobileCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.mobile-compositions"),
  desktopCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.desktop-compositions"),
  aiCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.ai-compositions"),
  solutionCompositions: capabilityMetadata.capabilities.find((capability) => capability.id === "component.solution-compositions"),
  behaviors: registeredBehaviors,
  runtimeBehaviors: registeredBehaviors,
  components: metadata.components,
  requiredStateMatrix: metadata.requiredStateMatrix,
  requiredEnvironmentMatrix: metadata.requiredEnvironmentMatrix,
  compositionAliases: metadata.compositionAliases,
  recipes: recipeMetadata.recipes
};
await writeFile(join(distRoot, "gardener.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(join(distRoot, "gardener.utilities.json"), `${JSON.stringify(createUtilityManifest(utilitiesCss), null, 2)}\n`);
await writeFile(join(distRoot, "gardener.recipes.json"), `${JSON.stringify({ ...recipeMetadata, $schema: "../metadata/recipes.schema.json" }, null, 2)}\n`);
await writeFile(join(distRoot, "gardener.capabilities.json"), `${JSON.stringify({ ...capabilityMetadata, $schema: "../metadata/capabilities.schema.json" }, null, 2)}\n`);
await writeFile(join(distRoot, "gardener.public-api.json"), `${JSON.stringify({ ...publicApiMetadata, $schema: "../metadata/public-api.schema.json" }, null, 2)}\n`);
await writeFile(join(distRoot, "gardener.compatibility.json"), `${JSON.stringify({ ...compatibilityMetadata, $schema: "../metadata/compatibility.schema.json" }, null, 2)}\n`);

const artifactFiles = [
  "gardener.min.css",
  "gardener.core.min.css",
  "gardener.themes.min.css",
  "gardener.utilities.min.css",
  "gardener.components.min.css",
  "gardener.ai.min.css",
  "gardener.runtime.min.js",
  "gardener.tauri.min.js",
  "gardener.electron.min.js",
  ...emittedPlatformProfiles.map((name) => `platforms/gardener.${name}.min.css`),
  ...Object.keys(componentPacks).map((name) => `components/${name}.min.css`),
];
const artifactMetrics = {};
const artifactIntegrity = {};
for (const file of artifactFiles) {
  const content = await readFile(join(distRoot, file));
  artifactMetrics[file] = byteMetrics(content);
  artifactIntegrity[file] = contentIntegrity(content);
}

const buildsManifest = {
  $schema: "../metadata/builds.schema.json",
  schemaVersion: 1,
  version,
  reproducibility: {
    deterministic: true,
    integrityAlgorithm: "sha256",
    verificationCommand: "npm run verify:reproducible",
  },
  minifier,
  compression,
  componentSelection: {
    granularity: "owning-pack",
    dependencyPolicy: "include-pack-peers",
    runtimePolicy: "full-runtime",
    command: "npm run build:custom -- --components button,card,dialog --out dist/custom/ui",
  },
  platforms: Object.entries(platformProfiles).map(([name, profile]) => ({
    name,
    cssProfile: profile.cssProfile,
    cssDependencies: profile.baseCssProfile ? [`platforms/gardener.${profile.baseCssProfile}.min.css`] : [],
    css: null,
    minCss: `platforms/gardener.${profile.cssProfile}.min.css`,
    runtime: "gardener.runtime.min.js",
    adapters: profile.adapters.map((adapter) => `gardener.${adapter}.min.js`),
    packs: profile.packs,
    platforms: profile.platforms,
    components: metadata.components
      .filter((component) => componentOwnership[component.name].some((pack) => profile.packs.includes(pack)))
      .map(({ name }) => name),
    metrics: artifactMetrics[`platforms/gardener.${name}.min.css`],
  })),
  componentPacks: await Promise.all(Object.entries(componentPacks).map(async ([name, files]) => ({
    name,
    files,
    css: null,
    minCss: `components/${name}.min.css`,
    components: Object.entries(componentOwnership).filter(([, packs]) => packs.includes(name)).map(([component]) => component),
    metrics: artifactMetrics[`components/${name}.min.css`],
  }))),
  componentSignatures,
  componentOwnership,
  artifacts: artifactMetrics,
  artifactIntegrity,
};
await writeFile(join(distRoot, "gardener.builds.json"), `${JSON.stringify(buildsManifest, null, 2)}\n`);

console.log(`Gardener built: ${themes.length} themes, ${manifest.components.length} components, ${Object.keys(componentPacks).length} component packs, ${Object.keys(platformProfiles).length} platform profiles.`);
