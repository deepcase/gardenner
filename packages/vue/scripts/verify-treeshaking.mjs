import { build } from "esbuild";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const bundle = async (entrypoint) => {
  const result = await build({
    stdin: { contents: `import { GButton } from ${JSON.stringify(entrypoint)}; console.log(GButton);`, resolveDir: root, sourcefile: "tree-shake-entry.js" },
    bundle: true,
    write: false,
    minify: true,
    format: "esm",
    platform: "browser",
    target: ["es2020"],
    external: ["vue", "@gardenerim/css", "@gardenerim/css/*"],
    legalComments: "none",
  });
  return result.outputFiles[0].contents.length;
};

const componentsBytes = await bundle("./dist/generated/components.js");
const rootBytes = await bundle("./dist/index.js");
const maximum = 20000;
if (componentsBytes > maximum || rootBytes > maximum) throw new Error(`tree-shaken GButton exceeds ${maximum} bytes: components=${componentsBytes}, root=${rootBytes}`);
console.log(`Tree-shaking passed: GButton is ${componentsBytes} B from components and ${rootBytes} B from the root entrypoint.`);
