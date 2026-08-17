/**
 * Renders every route to static files, for hosts that cannot run the server
 * (the GitHub Pages PR preview).
 *
 *   node tools/prerender.ts --out dist --base /repo/pr-12
 *
 * The output is the same HTML the server sends, with two adjustments:
 *
 *  - root-absolute URLs are prefixed with `--base`, since Pages serves previews
 *    from a subdirectory rather than the domain root;
 *  - a small script is added that reimplements the provider filter and the site
 *    search in the browser, because both are server routes.
 *
 * The server remains the source of truth for fidelity; the prerendered output is
 * for previewing only, and the base rewriting means it is intentionally not
 * byte-identical to the live site.
 */

import {
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { contentPages } from "../src/data/pages.ts";
import {
  providerBySlug,
  providers,
  providersArchiveBodyClass,
  providersArchiveMenuClasses,
  providersArchiveMenuCurrentIds,
} from "../src/data/providers.ts";
import { searchIndex } from "../src/data/searchIndex.ts";
import {
  documentBodyClass,
  pageContent,
  renderDocument,
} from "../src/render/document.ts";
import { NO_MENU_STATE } from "../src/render/header.ts";
import {
  renderProviderCard,
  renderProviderProfile,
  renderProvidersArchive,
} from "../src/render/providers.ts";
import { renderSearchResults } from "../src/render/search.ts";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..");

function arg(name: string, fallback = ""): string {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : (process.argv[index + 1] ?? fallback);
}

const out = resolve(arg("out", join(ROOT, "dist")));
// Trailing slashes would double up when prefixed onto "/wp-content/…".
const base = arg("base").replace(/\/$/, "");
// Media can be published once and shared by every preview, which keeps each
// preview directory to a couple of megabytes of HTML.
const assetBase = arg("asset-base", base).replace(/\/$/, "");
const skipAssets = process.argv.includes("--skip-assets");
// Publish just the media, for the directory that every preview shares.
const assetsOnly = process.argv.includes("--assets-only");

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Prefixes root-absolute URLs so the page works from a subdirectory. */
function applyBase(html: string): string {
  if (!base) return html;
  // WordPress emits both quote styles, so match either.
  return (
    html
      .replace(/(\b(?:href|src|action)=(["']))\/(?!\/)/g, `$1${base}/`)
      .replace(
        /(\bsrcset=(["']))([^"']+)\2/g,
        (_m, prefix: string, quote: string, value: string) => {
          const rewritten = value
            .split(",")
            .map((part) => part.trim().replace(/^\/(?!\/)/, `${base}/`))
            .join(", ");
          return `${prefix}${rewritten}${quote}`;
        },
      )
      .replace(/url\((['"]?)\/(?!\/)/g, `url($1${base}/`)
      // Media lives at the shared asset base; this also catches URLs in inline
      // JSON (the emoji settings block) rather than attributes.
      .replace(
        new RegExp(
          `(["'(])${escapeForRegExp(base)}/(wp-content|wp-includes)/`,
          "g",
        ),
        `$1${assetBase}/$2/`,
      )
      .replace(/(["'(])\/(wp-content|wp-includes)\//g, `$1${assetBase}/$2/`)
  );
}

// Written without the base prefix; applyBase adds it along with everything else.
const ENHANCE = '<script src="/static-preview.js" defer></script>\n';

function write(route: string, html: string) {
  const target =
    route === "/404" ? join(out, "404.html") : join(out, route, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    applyBase(html.replace("</body>", `${ENHANCE}</body>`)),
  );
}

console.log(
  `prerendering into ${out}${base ? ` (base ${base}` : ""}${
    base ? `, assets ${assetBase || "/"})` : ""
  }`,
);

// Assets first: the theme CSS/JS, fonts and media, at their original paths.
mkdirSync(out, { recursive: true });
if (!skipAssets) cpSync(join(ROOT, "public"), out, { recursive: true });

// Stylesheets reference images as root-absolute url(/wp-content/…), which needs
// the same prefix as the markup when the site is served from a subdirectory.
if (assetBase && !skipAssets) {
  for (const sheet of readdirSync(out, { recursive: true, encoding: "utf8" })) {
    if (!sheet.endsWith(".css")) continue;
    const file = join(out, sheet);
    const css = readFileSync(file, "utf8");
    const rebased = css.replace(/url\((['"]?)\/(?!\/)/g, `url($1${assetBase}/`);
    if (rebased !== css) writeFileSync(file, rebased);
  }
}

if (assetsOnly) {
  console.log("assets only — no pages written");
  process.exit(0);
}

for (const page of contentPages) {
  write(
    page.route,
    renderDocument({
      slug: page.slug,
      bodyClass: page.bodyClass,
      menu: { classes: page.menuClasses, currentIds: page.menuCurrentIds },
      content: pageContent(page.slug),
    }),
  );
}

write(
  "/providers/",
  renderDocument({
    slug: "providers",
    bodyClass: providersArchiveBodyClass,
    menu: {
      classes: providersArchiveMenuClasses,
      currentIds: providersArchiveMenuCurrentIds,
    },
    content: renderProvidersArchive(),
  }),
);

for (const provider of providerBySlug.values()) {
  write(
    `/providers/${provider.slug}/`,
    renderDocument({
      slug: `providers__${provider.slug}`,
      bodyClass: provider.bodyClass,
      menu: {
        classes: provider.menuClasses,
        currentIds: provider.menuCurrentIds,
      },
      content: renderProviderProfile(provider),
    }),
  );
}

// Pages serves 404.html for unknown paths.
write(
  "/404",
  renderDocument({
    slug: "404",
    bodyClass: documentBodyClass("404"),
    menu: NO_MENU_STATE,
    content: pageContent("404"),
  }),
);

// The search page is rendered client-side from this shell plus the index below.
write(
  "/search/",
  renderDocument({
    slug: "search",
    bodyClass: documentBodyClass("search"),
    menu: NO_MENU_STATE,
    content: renderSearchResults("", []),
  }),
);

// Data for the client-side filter: each card's markup is generated by the same
// function the server uses, so the filtered grid matches exactly.
writeFileSync(
  join(out, "providers-index.json"),
  JSON.stringify(
    providers.map((provider) => ({
      html: applyBase(renderProviderCard(provider)),
      locationIds: provider.locationIds,
      categoryIds: provider.categoryIds,
      gender: provider.gender,
    })),
  ),
);

writeFileSync(
  join(out, "search-index.json"),
  JSON.stringify(
    searchIndex.map((entry) => ({
      route: base + entry.route,
      title: entry.title,
      type: entry.type,
      // Thumbnails are media, so they come from the shared asset directory.
      image: entry.image ? assetBase + entry.image : "",
      date: entry.date,
      category: entry.category,
      excerpt: entry.excerpt,
      text: entry.text,
      links: entry.links,
    })),
  ),
);

writeFileSync(
  join(out, "static-preview.js"),
  readFileSync(join(here, "static-preview.js"), "utf8").replace(
    "__BASE__",
    base,
  ),
);

// Pages would otherwise run the output through Jekyll and drop wp-* folders.
writeFileSync(join(out, ".nojekyll"), "");

console.log(
  `wrote ${contentPages.length + providers.length + 3} pages (+ assets)`,
);
