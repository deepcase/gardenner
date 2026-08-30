import { rm } from "node:fs/promises";
import { resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
for (const name of ["dist", "example-dist"]) {
  const target = resolve(root, name);
  if (!target.startsWith(`${root}${sep}`)) throw new Error(`Unsafe clean target: ${target}`);
  await rm(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
