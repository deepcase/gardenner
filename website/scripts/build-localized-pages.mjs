import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const website = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["zh-CN", "en", "ja", "ko", "es", "fr", "de"];
const nativeLanguageNames = Object.freeze({
  "zh-CN": "简体中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
});
const pages = ["index.html", "docs.html"];
const checkOnly = process.argv.includes("--check");
const codeTags = new Set(["code", "pre"]);
const hardIgnoredTags = new Set(["script", "style"]);
const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const decodeEntities = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ");
const normalize = (value) => decodeEntities(value).replace(/\s+/g, " ").trim();
const escapeText = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const escapeAttribute = (value) =>
  escapeText(value).replaceAll('"', "&quot;");

function translateText(value, dictionary) {
  const translated = dictionary[normalize(value)];
  if (!translated) return value;
  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  return `${leading}${escapeText(translated)}${trailing}`;
}

const codeFragmentPattern = /[\p{Script=Han}](?:[\p{Script=Han}\p{L}\p{N} \t、，。；：！？（）《》【】“”‘’·/+.,:%]*[\p{Script=Han}\p{L}\p{N}）】”？！。%])?/gu;

function translateCodeText(value, dictionary) {
  return value.replace(codeFragmentPattern, (fragment) => {
    const translated = dictionary[normalize(fragment)];
    return translated ? escapeText(translated) : fragment;
  });
}

function translateTag(tag, dictionary, ignored) {
  if (ignored) return tag;
  let result = tag.replace(
    /\b(aria-label|placeholder|title|alt|data-g-label|data-g-file-name|value)="([^"]*)"/gi,
    (attribute, name, value) => {
      if (name.toLowerCase() === "value" && !/[\p{Script=Han}]/u.test(value))
        return attribute;
      const translated = dictionary[normalize(value)];
      return translated
        ? `${name}="${escapeAttribute(translated)}"`
        : attribute;
    },
  );
  if (/^<meta\b/i.test(result) && /\bname="description"/i.test(result)) {
    result = result.replace(/\bcontent="([^"]*)"/i, (attribute, value) => {
      const translated = dictionary[normalize(value)];
      return translated
        ? `content="${escapeAttribute(translated)}"`
        : attribute;
    });
  }
  return result;
}

function translateHtml(source, dictionary) {
  const tokens =
    source.match(/<!--[\s\S]*?-->|<!doctype[^>]*>|<[^>]*>|[^<]+/gi) || [];
  const stack = [];
  return tokens
    .map((token) => {
      if (!token.startsWith("<")) {
        const mode = stack.at(-1)?.mode || "normal";
        if (mode === "code") return translateCodeText(token, dictionary);
        return mode === "ignored" ? token : translateText(token, dictionary);
      }
      if (/^<!--|^<!doctype/i.test(token)) return token;
      const closing = token.match(/^<\/\s*([\w:-]+)/);
      if (closing) {
        const name = closing[1].toLowerCase();
        const index = stack.map((item) => item.name).lastIndexOf(name);
        if (index >= 0) stack.splice(index);
        return token;
      }
      const opening = token.match(/^<\s*([\w:-]+)/);
      if (!opening) return token;
      const name = opening[1].toLowerCase();
      const parentMode = stack.at(-1)?.mode || "normal";
      const explicitlyIgnored = /\bdata-i18n-ignore(?:\s|=|>)/i.test(token);
      const mode =
        parentMode === "ignored" || explicitlyIgnored || hardIgnoredTags.has(name)
          ? "ignored"
          : parentMode === "code" || codeTags.has(name)
            ? "code"
            : "normal";
      const translated = translateTag(token, dictionary, mode !== "normal");
      if (!voidTags.has(name) && !/\/\s*>$/.test(token))
        stack.push({ name, mode });
      return translated;
    })
    .join("");
}

function setLocaleMetadata(html, locale) {
  return html.replace(/<html\b[^>]*>/i, (tag) => {
    let result = tag.replace(/\blang="[^"]*"/i, `lang="${locale}"`);
    if (/\bdata-locale=/i.test(result))
      result = result.replace(
        /\bdata-locale="[^"]*"/i,
        `data-locale="${locale}"`,
      );
    else result = result.replace(/>$/, ` data-locale="${locale}">`);
    return result;
  });
}

function setSelectedLanguage(html, locale) {
  return html.replace(/<option\b[^>]*\bvalue="[^"]+"[^>]*>/gi, (tag) => {
    const value = tag.match(/\bvalue="([^"]+)"/i)?.[1];
    const withoutSelected = tag.replace(/\s+selected(?:="[^"]*")?/gi, "");
    return value === locale
      ? withoutSelected.replace(/>$/, " selected>")
      : withoutSelected;
  });
}

function rewriteResources(html) {
  return html
    .replace(/\b(href|src)="\.\.\//gi, '$1="../../')
    .replace(/\b(href|src)="\.\/assets\//gi, '$1="../assets/');
}

function seoLinks(page, locale) {
  const alternates = locales
    .map(
      (item) =>
        `    <link rel="alternate" hreflang="${item}" href="../${item}/${page}" />`,
    )
    .join("\n");
  return `    <link rel="canonical" href="./${page}" />\n${alternates}\n    <link rel="alternate" hreflang="x-default" href="../${page}" />`;
}

function replaceSeoLinks(html, page, locale) {
  const withoutSeo = html.replace(
    /^\s*<link rel="(?:canonical|alternate)"[^>]*\/>\r?\n/gim,
    "",
  );
  return withoutSeo.replace(
    /(\s*<link rel="icon"[^>]*\/>)/i,
    `$1\n${seoLinks(page, locale)}`,
  );
}

function validateLocalizedPage(html, page, locale) {
  const failures = [];
  if (/(?:\[|【)\s*G\d{6}\s*(?:\]|】)/.test(html))
    failures.push("translation batch marker");
  if (
    locale === "ja" &&
    /[这们为还没让该对从业务页组载软发现录览类择标签须复圆础层统钮宽边网档]/.test(html)
  )
    failures.push("untranslated Simplified Chinese");
  if (!new RegExp(`<html\\b[^>]*\\blang="${locale}"`, "i").test(html))
    failures.push("html lang");
  if (!new RegExp(`<html\\b[^>]*\\bdata-locale="${locale}"`, "i").test(html))
    failures.push("data-locale");
  if (!html.includes(`<link rel="canonical" href="./${page}" />`))
    failures.push("canonical");
  for (const alternate of [...locales, "x-default"]) {
    if (!html.includes(`hreflang="${alternate}"`))
      failures.push(`hreflang ${alternate}`);
  }
  if (!new RegExp(`<option\\b[^>]*value="${locale}"[^>]*selected`, "i").test(html))
    failures.push("selected language");
  if (!/<select\b[^>]*data-site-language[^>]*translate="no"/i.test(html))
    failures.push("non-translatable language selector");
  for (const [optionLocale, nativeName] of Object.entries(nativeLanguageNames)) {
    const option = html.match(
      new RegExp(`<option\\b[^>]*value="${optionLocale}"[^>]*>([^<]+)</option>`, "i"),
    );
    if (
      !option ||
      normalize(option[1]) !== nativeName ||
      !new RegExp(`\\blang="${optionLocale}"`, "i").test(option[0]) ||
      !/\btranslate="no"/i.test(option[0])
    )
      failures.push(`native language name ${optionLocale}`);
  }
  if (/\?lang=/.test(html)) failures.push("legacy language query");
  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push("title");
  if (!/<meta\b[^>]*name="description"[^>]*content="[^"]+"/i.test(html))
    failures.push("description");
  if (failures.length)
    throw new Error(`${locale}/${page}: invalid localized page (${failures.join(", ")})`);
}

async function dictionaryFor(locale) {
  if (locale === "zh-CN") return {};
  return JSON.parse(
    await readFile(resolve(website, "assets/i18n", `${locale}.json`), "utf8"),
  );
}

let stale = 0;
for (const locale of locales) {
  const dictionary = await dictionaryFor(locale);
  for (const page of pages) {
    const source = await readFile(resolve(website, page), "utf8");
    let localized = translateHtml(source, dictionary);
    localized = setLocaleMetadata(localized, locale);
    localized = setSelectedLanguage(localized, locale);
    localized = rewriteResources(localized);
    localized = replaceSeoLinks(localized, page, locale);
    validateLocalizedPage(localized, page, locale);
    const output = resolve(website, locale, page);
    if (checkOnly) {
      const current = await readFile(output, "utf8").catch(() => "");
      if (current !== localized) {
        console.error(`${locale}/${page} is missing or stale`);
        stale += 1;
      }
    } else {
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, localized);
    }
  }
}

if (stale) process.exitCode = 1;
else
  console.log(
    `${checkOnly ? "Verified" : "Built"} ${locales.length * pages.length} localized pages across ${locales.length} locales.`,
  );
