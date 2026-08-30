import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: ".",
  publicDir: false,
  build: { outDir: "example-dist", emptyOutDir: true, rollupOptions: { input: resolve(import.meta.dirname, "examples/index.html") } },
  server: { host: "127.0.0.1", port: 4182, strictPort: true },
});
