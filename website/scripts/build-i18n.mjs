import { readFile, mkdir } from "node:fs/promises";
import { writeFile } from "../../scripts/fs-retry.mjs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const home = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(home, "assets/i18n");
const locales = ["en", "ja", "ko", "es", "fr", "de"];
const translateMissing = process.argv.includes("--translate");
const repairOnly = process.argv.includes("--repair");
const codeTags = new Set(["code", "pre"]);
const hardIgnoredTags = new Set(["script", "style"]);
const voidTags = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
  "meta", "param", "source", "track", "wbr",
]);
const manualMessages = [
  "选择语言", "打开导航", "关闭导航", "已复制", "代码示例", "通用行为", "使用 {theme} 主题",
  "detail: 无字段", "可取消流程守卫", "显示 {shown} / {total} 个组件",
  "显示 {shown} / {total} 个 {framework} 组件 · {package} {version}",
  "没有匹配的组件。", "没有匹配的 {framework} 组件。",
  "共 {total} 个工具类；输入至少两个字符开始搜索。",
  "匹配 {matches} 项；显示 {shown} / {matches} 项。", "没有匹配的工具类。",
  "语义类", "选择器", "状态钩子", "数据属性", "关键帧",
  "本模块不声明可检索的公开项。", "没有匹配的 CSS 接口。",
];
const seededTranslations = {
  en: { "使用 {theme} 主题": "Use the {theme} theme" },
  ja: {
    "使用 {theme} 主题": "{theme} テーマを使用",
    "能力": "機能",
    "Blazor": "Blazor",
    "Blazor 项目": "Blazor プロジェクト",
    "Chromium + Axe": "Chromium + Axe",
    "DOM": "DOM",
    "Gardenerim": "Gardenerim",
    "Gardenerim Agent": "Gardenerim Agent",
    "Gardenerim AngularJS 项目": "Gardenerim AngularJS プロジェクト",
    "Gardenerim Blazor 项目": "Gardenerim Blazor プロジェクト",
    "Gardenerim Fast": "Gardenerim Fast",
    "Gardenerim React 项目": "Gardenerim React プロジェクト",
    "gardener / workspace / overview": "gardener / workspace / overview",
    "React": "React",
    "Tauri / Electron": "Tauri / Electron",
    "Tauri / Electron 适配": "Tauri / Electron 対応",
    "Tauri / Electron 适配器契约": "Tauri / Electron アダプター契約",
    "Tauri / Electron 宿主契约": "Tauri / Electron ホスト契約",
    "Tauri 与 Electron 入口相互隔离，均返回带": "Tauri と Electron のエントリポイントは互いに分離され、どちらも",
    "Electron 使用": "Electron では",
    "包入口可在服务端安全导入，全部 506 个组件均经过逐项 SSR，行为只在 Effect 生命周期内初始化；服务端标记 Hydration 不产生 recoverable error，并兼容 StrictMode。Tauri 与 Electron 分别使用": "パッケージのエントリポイントはサーバー側でも安全に import でき、506 個すべてのコンポーネントについて個別に SSR を検証しています。ビヘイビアは Effect のライフサイクル内でのみ初期化されます。サーバーで生成したマークアップの Hydration では recoverable error が発生せず、StrictMode にも対応します。Tauri と Electron はそれぞれ",
    "Vue": "Vue",
    "当前门禁包含 17 项运行时/契约测试、3 项 Schema 测试、20 项五引擎与移动端浏览器集成测试，以及 1 项 Axe WCAG A/AA 自动审计。完整": "現在のゲートには、17 件のランタイム／契約テスト、3 件の Schema テスト、5 エンジンとモバイルブラウザを対象とした 20 件の統合テスト、および Axe による WCAG A/AA 自動監査 1 件が含まれます。",
    "Axe 门禁阻断所选 WCAG A/AA 规则检测到的全部违规，不按 impact 降级放行，并输出规则、节点选择器、HTML 与修复摘要。自动化不能代替人工屏幕阅读器测试；正式产品仍应使用 NVDA / JAWS / VoiceOver 完成关键任务走查。": "Axe ゲートは、対象の WCAG A/AA ルールで検出されたすべての違反を impact に関係なくブロックし、ルール、ノードセレクター、HTML、修正概要を出力します。自動化は人によるスクリーンリーダーテストの代わりにはならないため、正式製品では NVDA / JAWS / VoiceOver を使って重要な操作を確認する必要があります。",
    "Release 构建为 0 警告、0 错误；506 个组件全部经过真实静态 SSR。浏览器矩阵覆盖 Chromium、Firefox、WebKit、桌面与移动视口、键盘和 Axe WCAG A/AA；CI 强制 Firefox。 NuGet 使用隔离缓存真实发布消费应用，并验证静态 Web Assets endpoint manifest；另有独立 .NET 11 Preview 包消费者。程序集实测 344,576 B，44 个静态资源共 7,701,545 B，CSS gzip 139,263 B，runtime gzip 29,289 B，Blazor bridge gzip 2,055 B，nupkg 约 1.22 MiB、低于 6,000,000 B 硬上限；全部低于硬预算且 DLL/XML 可复现。": "リリースビルドは警告 0 件、エラー 0 件で、506 個のコンポーネントすべてが実際の静的 SSR テストに合格しています。ブラウザマトリクスは Chromium、Firefox、WebKit、デスクトップ／モバイルのビューポート、キーボード操作、Axe による WCAG A/AA 監査を対象とし、CI では Firefox を必須としています。NuGet では分離キャッシュを使ってコンシューマーアプリを実際に publish し、Static Web Assets の endpoint manifest を検証します。さらに、独立した .NET 11 Preview パッケージコンシューマーも用意しています。実測値は、アセンブリ 344,576 B、静的アセット 43 ファイルで合計 7,701,545 B、CSS gzip 139,263 B、runtime gzip 29,289 B、Blazor bridge gzip 2,055 B です。nupkg は約 1.22 MiB で、6,000,000 B の厳格な上限を下回っています。DLL/XML の再現性も確認済みです。",
  },
  ko: { "使用 {theme} 主题": "{theme} 테마 사용" },
  es: { "使用 {theme} 主题": "Usar el tema {theme}" },
  fr: { "使用 {theme} 主题": "Utiliser le thème {theme}" },
  de: { "使用 {theme} 主题": "Theme {theme} verwenden" },
};

const decodeEntities = (value) => value
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&apos;", "'")
  .replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&nbsp;", " ");
const normalize = (value) => decodeEntities(value).replace(/\s+/g, " ").trim();
const codeFragmentPattern = /[\p{Script=Han}](?:[\p{Script=Han}\p{L}\p{N} \t、，。；：！？（）《》【】“”‘’·/+.,:%]*[\p{Script=Han}\p{L}\p{N}）】”？！。%])?/gu;
const extractCodeFragments = (value) => [...value.matchAll(codeFragmentPattern)].map((match) => normalize(match[0]));

function extract(html) {
  const tokens = html.match(/<!--[\s\S]*?-->|<!doctype[^>]*>|<[^>]*>|[^<]+/gi) || [];
  const stack = [];
  const values = [];
  for (const token of tokens) {
    if (!token.startsWith("<")) {
      const mode = stack.at(-1)?.mode || "normal";
      if (mode === "normal") values.push(normalize(token));
      else if (mode === "code") values.push(...extractCodeFragments(token));
      continue;
    }
    if (/^<!--|^<!doctype/i.test(token)) continue;
    const closing = token.match(/^<\/\s*([\w:-]+)/);
    if (closing) {
      const name = closing[1].toLowerCase();
      const index = stack.map((item) => item.name).lastIndexOf(name);
      if (index >= 0) stack.splice(index);
      continue;
    }
    const opening = token.match(/^<\s*([\w:-]+)/);
    if (!opening) continue;
    const name = opening[1].toLowerCase();
    const parentMode = stack.at(-1)?.mode || "normal";
    const explicitlyIgnored = /\bdata-i18n-ignore(?:\s|=|>)/i.test(token);
    const mode =
      parentMode === "ignored" || explicitlyIgnored || hardIgnoredTags.has(name)
        ? "ignored"
        : parentMode === "code" || codeTags.has(name)
          ? "code"
          : "normal";
    if (mode === "normal") {
      for (const match of token.matchAll(/\b(aria-label|placeholder|title|alt|data-g-label|data-g-file-name|value)="([^"]+)"/gi)) {
        if (match[1].toLowerCase() !== "value" || /[\p{Script=Han}]/u.test(match[2])) values.push(normalize(match[2]));
      }
      if (name === "meta" && /\bname="description"/i.test(token)) {
        const description = token.match(/\bcontent="([^"]+)"/i);
        if (description) values.push(normalize(description[1]));
      }
    }
    if (!voidTags.has(name) && !/\/\s*>$/.test(token)) stack.push({ name, mode });
  }
  return values.filter((value) => value && /[\p{L}\p{Script=Han}]/u.test(value));
}

const pages = await Promise.all(["index.html", "docs.html"].map((file) => readFile(resolve(home, file), "utf8")));
const messages = [...new Set([...pages.flatMap(extract), ...manualMessages])].sort((left, right) => left.localeCompare(right, "zh-CN"));
await mkdir(output, { recursive: true });

const delay = (milliseconds) => new Promise((accept) => setTimeout(accept, milliseconds));
const protectPlaceholders = (value) => value.replace(/\{([a-z]+)\}/gi, "ZXQ$1QXZ");
const restorePlaceholders = (value) => value.replace(/ZXQ([a-z]+)QXZ/gi, "{$1}");
async function requestTranslation(text, locale, attempt = 0) {
  const body = new URLSearchParams({ client: "gtx", sl: "zh-CN", tl: locale, dt: "t", q: protectPlaceholders(text) });
  const response = await fetch("https://translate.googleapis.com/translate_a/single", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  });
  if ((!response.ok || response.status === 429) && attempt < 8) {
    await delay(Math.min(30000, 3000 * (attempt + 1)));
    return requestTranslation(text, locale, attempt + 1);
  }
  if (!response.ok) throw new Error(`Translation request failed for ${locale}: ${response.status}`);
  const payload = await response.json();
  return restorePlaceholders(payload[0].map((segment) => segment[0]).join(""));
}

async function translateBatch(entries, locale) {
  const input = entries.map(([id, source]) => `[G${id}] ${source}`).join("\n");
  const result = await requestTranslation(input, locale);
  const translated = new Map();
  // Google Translate sometimes localizes square brackets to 【】. Accept both
  // forms so one translated item cannot absorb the following batch marker.
  const marker = String.raw`(?:\[|【)\s*G(\d{6})\s*(?:\]|】)`;
  const pattern = new RegExp(`${marker}\\s*([\\s\\S]*?)(?=\\n?${marker}|$)`, "g");
  for (const match of result.matchAll(pattern)) translated.set(match[1], match[2].trim());
  return translated;
}

const untranslatedJapaneseChinese = /[这们为还没让该对从业务页组载软发现录览类择标签须复圆础层统钮宽边网档]/;
const unacceptableJapanese = /(?:Ax WCAG|ハードバジェット|真の静的 SSR|ビルドを解放|CIはFirefoxを操作)/;
const protectedJapaneseLiterals = ["Gardenerim", "gardener", "Vue", "React", "Blazor", "AngularJS", "Tauri", "Electron", "Axe", "WCAG", "Chromium", "Firefox", "WebKit", "NuGet"];
const losesProtectedJapaneseLiteral = (value, source, locale) =>
  locale === "ja" && protectedJapaneseLiterals.some((literal) =>
    source.split(literal).length > String(value).split(literal).length,
  );
const isCorruptedTranslation = (value, source = "", locale = "") =>
  /(?:\[|【)\s*G\d{6}\s*(?:\]|】)/.test(value) ||
  /[\r\n]/.test(value) ||
  (locale === "ja" && (untranslatedJapaneseChinese.test(value) || unacceptableJapanese.test(value))) ||
  losesProtectedJapaneseLiteral(value, source, locale) ||
  (locale !== "ja" && value === source && /[\p{Script=Han}]/u.test(source));

for (const locale of locales) {
  const path = resolve(output, `${locale}.json`);
  let dictionary = {};
  try { dictionary = JSON.parse(await readFile(path, "utf8")); } catch { }
  Object.assign(dictionary, seededTranslations[locale]);
  for (const source of messages) {
    if (dictionary[source] && isCorruptedTranslation(dictionary[source], source, locale))
      delete dictionary[source];
    const placeholders = [...source.matchAll(/\{([a-z]+)\}/gi)].map((match) => match[0]);
    const targetPlaceholders = [...String(dictionary[source] || "").matchAll(/\{[^}]+\}/g)];
    if (placeholders.length && placeholders.length === targetPlaceholders.length) {
      let index = 0;
      dictionary[source] = dictionary[source].replace(/\{[^}]+\}/g, () => placeholders[index++]);
    }
    if (placeholders.some((placeholder) => !dictionary[source]?.includes(placeholder))) delete dictionary[source];
  }
  const missing = messages.filter((source) => !dictionary[source]);
  if (missing.length && !translateMissing) throw new Error(`${locale}: ${missing.length} messages missing: ${missing.join(" | ")}; add translations or run with --translate`);
  if (translateMissing) {
    let batch = [];
    let size = 0;
    const batches = [];
    for (const source of missing) {
      const entry = [String(messages.indexOf(source)).padStart(6, "0"), source];
      if (batch.length && size + source.length > 3000) { batches.push(batch); batch = []; size = 0; }
      batch.push(entry); size += source.length + 12;
    }
    if (batch.length) batches.push(batch);
    for (const [index, entries] of batches.entries()) {
      const translated = await translateBatch(entries, locale);
      for (const [id, source] of entries) {
        const candidate = translated.get(id);
        dictionary[source] = candidate && !isCorruptedTranslation(candidate, source, locale)
          ? candidate
          : await requestTranslation(source, locale);
      }
      process.stdout.write(`${locale}: ${index + 1}/${batches.length}\r`);
      await delay(120);
    }
  }
  const invalid = messages.filter((source) =>
    isCorruptedTranslation(dictionary[source], source, locale),
  );
  if (invalid.length)
    throw new Error(`${locale}: ${invalid.length} corrupted translations (${invalid.slice(0, 5).join(" | ")})`);
  const ordered = Object.fromEntries(messages.map((source) => [source, dictionary[source]]));
  const jsonSource = `${JSON.stringify(ordered, null, 2)}\n`;
  const scriptSource = `window.GardenerimFileI18nDictionaries = window.GardenerimFileI18nDictionaries || Object.create(null);\nwindow.GardenerimFileI18nDictionaries[${JSON.stringify(locale)}] = Object.freeze(${JSON.stringify(ordered, null, 2)});\n`;
  const scriptPath = resolve(output, `${locale}.js`);
  if (translateMissing || repairOnly) {
    await writeFile(path, jsonSource);
    await writeFile(scriptPath, scriptSource);
  } else {
    const existingScript = await readFile(scriptPath, "utf8").catch(() => "");
    if (existingScript !== scriptSource) throw new Error(`${locale}.js is stale`);
  }
  console.log(`${locale}: ${messages.length} messages`);
}

const manifest = { version: 1, sourceLocale: "zh-CN", locales: ["zh-CN", ...locales], messages: messages.length };
if (translateMissing || repairOnly) {
  await writeFile(resolve(output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
} else {
  const existing = JSON.parse(await readFile(resolve(output, "manifest.json"), "utf8"));
  if (JSON.stringify(existing) !== JSON.stringify(manifest)) throw new Error("i18n manifest is stale");
}
