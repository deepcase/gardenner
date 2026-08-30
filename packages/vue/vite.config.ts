import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  root: "examples",
  resolve: {
    alias: [{ find: /^@gardener\/vue$/u, replacement: fileURLToPath(new URL("./src/index.ts", import.meta.url)) }],
  },
  build: {
    outDir: "../example-dist",
    emptyOutDir: true,
  },
});
