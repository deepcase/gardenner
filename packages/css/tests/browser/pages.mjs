import { readdirSync } from 'node:fs';
// Release examples are discovered from the same directory as the HTML gate.
// New galleries must enter every browser, mobile and accessibility project.
export const examplePages = readdirSync(new URL('../../examples/', import.meta.url))
  .filter(name => name.endsWith('.html')).sort();

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
  page.on("requestfailed", (request) => {
    const reason=request.failure()?.errorText||"failed";
    // Native PDF handoff can interrupt iframe navigation in headless engines.
    // The content-lab transport test independently verifies MIME, bytes and ranges.
    if(new URL(request.url()).pathname.endsWith('/examples/content-assets/sample.pdf') && request.resourceType()==='document' && ['net::ERR_ABORTED','Frame load interrupted'].includes(reason))return;
    failures.push(`request: ${request.url()} (${reason})`);
  });
  return failures;
}

// Windows WebKit lacks these native video decoders. Accept only cancellation
// of a source belonging to a failed player with a visible, accessible error.
// HTTP transport and actual playback in Chromium/Firefox are tested separately.
export async function contentMediaFailures(page, failures, browserName) {
  if (browserName !== 'webkit') return failures;
  const rejectedSources = await page.locator('video[data-g-content-failed="true"], [data-g-media-options] video').evaluateAll(players => players.flatMap(player => {
    const alert = player.closest('[data-g-content], [data-g-media-options]')?.querySelector('[role="alert"]');
    if (player.networkState !== 3 || !alert?.textContent?.trim() || !alert.getClientRects().length) return [];
    return [player.currentSrc, player.src, ...[...player.querySelectorAll('source')].map(source => source.src)].filter(Boolean);
  }));
  return failures.filter(failure => !rejectedSources.some(url => failure === `request: ${url} (Load request cancelled)`));
}
