import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
await Promise.all([
  rm(resolve(root, "dist"), { recursive: true, force: true }),
  rm(resolve(root, "src", "generated"), { recursive: true, force: true }),
  rm(resolve(root, "example-dist"), { recursive: true, force: true }),
]);
