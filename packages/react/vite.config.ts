import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: "examples",
  resolve: {
    alias: [{ find: /^@gardener\/react$/u, replacement: fileURLToPath(new URL("./src/index.ts", import.meta.url)) }],
  },
  build: { outDir: "../example-dist", emptyOutDir: true },
});
