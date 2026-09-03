import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)), "packages", "angularjs");
const command = process.platform === "win32"
  ? [process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", "npm audit --json"]]
  : ["npm", ["audit", "--json"]];
const result = spawnSync(command[0], command[1], { cwd: root, encoding: "utf8" });
if (result.error || !result.stdout?.trim()) {
  console.error(result.error?.message || result.stderr || "npm audit produced no report");
  process.exit(1);
}
let report;
try {
  report = JSON.parse(result.stdout || "{}");
} catch {
  console.error(result.stdout || result.stderr || "npm audit returned unreadable output");
  process.exit(1);
}

if (report.auditReportVersion !== 2 || !report.metadata?.vulnerabilities) {
  console.error("npm audit did not return the expected v2 vulnerability report");
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities ?? {};
const unexpected = Object.entries(vulnerabilities).filter(([name, finding]) =>
  name !== "angular" || finding.severity !== "high" || finding.fixAvailable !== false
);
if (unexpected.length) {
  console.error(`Unexpected AngularJS workspace vulnerabilities: ${unexpected.map(([name]) => name).join(", ")}`);
  process.exit(1);
}
if (!vulnerabilities.angular) {
  console.log("AngularJS audit is clean; remove the legacy exception when retiring the adapter.");
  process.exit(0);
}

const advisories = vulnerabilities.angular.via.filter((item) => typeof item === "object").map((item) => item.url);
console.warn(`Accepted upstream AngularJS EOL risk only (${advisories.length} advisories, no fix available).`);
for (const advisory of advisories) console.warn(`- ${advisory}`);
