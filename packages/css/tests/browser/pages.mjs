export const examplePages = [
  "ai-compositions.html",
  "auth-compositions.html",
  "auth.html",
  "cms-desktop.html",
  "commerce-compositions.html",
  "content-compositions.html",
  "data-compositions.html",
  "desktop-compositions.html",
  "form-compositions.html",
  "grid.html",
  "help-system.html",
  "mobile-category.html",
  "mobile-compositions.html",
  "navigation-compositions.html",
  "page-components.html",
  "primitives.html",
  "regions.html",
  "runtime-lab.html",
  "selection-compositions.html",
  "showcase.html",
  "solution-compositions.html",
];

// Every release example must remain consumable from a mobile viewport. This is
// deliberately the full inventory rather than a curated subset: desktop and
// dashboard compositions still need a contained small-screen fallback.
export const mobilePages = [...examplePages];

export const exampleUrl = (name) => `/examples/${name}`;

export const websitePages = [
  { name: "website/index.html", url: "http://127.0.0.1:4188/website/" },
  { name: "website/docs.html", url: "http://127.0.0.1:4188/website/docs.html" },
];

export const releasePages = [
  ...examplePages.map((name) => ({
    name: `examples/${name}`,
    url: exampleUrl(name),
  })),
  ...websitePages,
];

export function collectPageFailures(page) {
  const failures = [];
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) =>
    failures.push(
      `request: ${request.url()} (${request.failure()?.errorText || "failed"})`,
    ),
  );
  return failures;
}
