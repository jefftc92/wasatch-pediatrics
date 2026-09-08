/**
 * Which commit this server is running.
 *
 * Stamped into every page and served at /__build, so "is the thing I am looking
 * at actually the latest code?" can be answered in one request rather than
 * inferred. The Replit workspace does not pull on merge, and an autoscale
 * deployment serves whatever was last published, so a page and the repository
 * can disagree for entirely mundane reasons.
 */

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function readBuildId(): string {
  // Set this in any environment where the build is detached from a checkout.
  const fromEnv = process.env.BUILD_ID ?? process.env.GIT_COMMIT;
  if (fromEnv) return fromEnv.trim().slice(0, 12);

  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
      cwd: join(here, ".."),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    // No git available — a packaged deployment, most likely.
    return "unknown";
  }
}

export const buildId = readBuildId();

export const buildMeta = `<meta name="x-build" content="${buildId}" />`;

/**
 * This project's stylesheet and script, stamped with the build id.
 *
 * The version string is the point: `public/` is served with an hour of cache,
 * so after a deploy a browser would happily keep yesterday's site.css against
 * today's markup — which renders the floating button as a bare anchor and its
 * icon as a 300px black rectangle. Changing the URL each build makes that
 * impossible.
 */
export const siteAssets = [
  `<link rel='stylesheet' id='site-css' href='/assets/site.css?v=${buildId}' media='all' />`,
  `<script id="site-js" src="/assets/site.js?v=${buildId}" defer></script>`,
  /*
   * What every page looks like with scripting off.
   *
   * The theme's `.page-load` is a fixed white sheet at z-index 9999 that only
   * jQuery ever takes down, so without script the whole site is a blank screen
   * with a complete DOM behind it. The stylesheet that sizes it belongs to the
   * vendored theme and is never edited; this is our own rule, from our own
   * head, and `<noscript>` in `<head>` is the one place a stylesheet may be
   * conditioned on scripting without a media query no old phone supports.
   *
   * The symptom index's search box is the same problem in miniature: an input
   * that filters nothing without script. It hides here and the `<noscript>`
   * paragraph beside it in the markup takes its place. The box is not shipped
   * `hidden` and revealed by JS, which is the pattern elsewhere, because that
   * would need a reserved height to avoid a jump and the height is exactly what
   * finding 5 was spending.
   */
  `<noscript><style>.page-load{display:none!important}.sym-find{display:none}</style></noscript>`,
].join("\n");

/**
 * Google Maps configuration, from the environment.
 *
 * The key is restricted per-referrer in the Google Cloud console rather than
 * kept secret — it ships in the page, as every Maps JS key does. Without one
 * the locations page still renders every office, its address, its phone number
 * and everything it offers; the map is the part that does not draw, and it says
 * so rather than leaving a grey box.
 *
 * `GOOGLE_MAPS_MAP_ID` is optional. With one the map uses AdvancedMarkerElement,
 * which is the supported marker going forward; without one it falls back to the
 * classic Marker, which needs nothing but the key.
 */
export const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY ?? "";
export const googleMapsId = process.env.GOOGLE_MAPS_MAP_ID ?? "";
