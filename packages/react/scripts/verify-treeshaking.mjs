import { build } from "esbuild";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const budget = JSON.parse(await readFile(resolve(root, "config", "performance-budgets.json"), "utf8"));
const bundle = async (entrypoint) => (await build({
  stdin: { contents: `import { GButton } from ${JSON.stringify(entrypoint)}; console.log(GButton);`, resolveDir: root, sourcefile: "tree-shake-entry.js" },
  bundle: true, write: false, minify: true, format: "esm", platform: "browser", target: ["es2020"],
  external: ["react", "react-dom", "@gardenerim/css", "@gardenerim/css/*"], legalComments: "none",
})).outputFiles[0].contents.length;
const componentsBytes = await bundle("./dist/generated/components.js");
const rootBytes = await bundle("./dist/index.js");
if (componentsBytes > budget.treeShaken.bytes || rootBytes > budget.treeShaken.bytes) throw new Error(`tree-shaken GButton exceeds budget: components=${componentsBytes}, root=${rootBytes}`);
console.log(`Tree-shaking passed: GButton is ${componentsBytes} B from components and ${rootBytes} B from the root entrypoint.`);
