/**
 * Document shell for pages this project authors rather than copies.
 *
 * The copied pages keep the `<head>` WordPress served for them, stored verbatim
 * in `src/document/`. Pages that do not exist on the live site have no such
 * head, so they get one built from `src/authored/head.html`: the same fonts,
 * stylesheets and scripts the theme needs, plus metadata and breadcrumb schema
 * generated from the page itself.
 *
 * `src/authored/` is deliberately outside `src/content/` and `src/document/`,
 * which `tools/sync-from-live.py` empties on every run.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderFooter } from "./footer.ts";
import { renderHeader, type MenuState } from "./header.ts";
import { buildMeta, siteAssets } from "../build.ts";

const here = dirname(fileURLToPath(import.meta.url));
const AUTHORED = join(here, "..", "authored");

const cache = new Map<string, string>();

function readOnce(name: string): string {
  const cached = cache.get(name);
  if (cached !== undefined) return cached;
  const body = readFileSync(join(AUTHORED, name), "utf8");
  cache.set(name, body);
  return body;
}

/** A body stored in `src/authored/`, written by us rather than by WordPress. */
export function authoredBody(name: string): string {
  return readOnce(`${name}.html`);
}

/** Canonical URLs still point at the live domain, as the copied pages do. */
export const SITE = "https://wasatchpeds.net";

export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type Crumb = { name: string; href?: string };

export type GeneratedPage = {
  title: string;
  description: string;
  /** Root-relative path, with the trailing slash WordPress canonicalises to. */
  route: string;
  bodyClass: string;
  menu: MenuState;
  /** Home is implied; pass the rest of the trail, ending with this page. */
  breadcrumbs: Crumb[];
  content: string;
};

function schema(page: GeneratedPage): string {
  const url = SITE + page.route;
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...page.breadcrumbs];

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: page.title,
        isPartOf: { "@id": `${SITE}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        description: page.description,
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: trail.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          ...(crumb.href ? { item: SITE + crumb.href } : {}),
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: `${SITE}/`,
        name: "Wasatch Pediatrics",
        inLanguage: "en-US",
      },
    ],
  });
}

/** Assembles a page the theme never had, in the shape the theme expects. */
export function renderGeneratedDocument(page: GeneratedPage): string {
  const head = readOnce("head.html")
    .replaceAll("{{TITLE}}", escapeAttribute(page.title))
    .replaceAll("{{DESCRIPTION}}", escapeAttribute(page.description))
    .replaceAll("{{CANONICAL}}", SITE + page.route)
    .replace("{{JSONLD}}", schema(page))
    .replace("{{SITE_ASSETS}}", siteAssets);

  return `<!doctype html>
<html lang="en-US">
<head>
${head}
${buildMeta}
</head>
<body class="${page.bodyClass}">
${renderHeader(page.menu)}
${page.content}
${renderFooter()}
${readOnce("tail.html")}
</body>
</html>
`;
}

/** The trail rendered above the page title, matching the schema above. */
export function renderBreadcrumbs(crumbs: Crumb[]): string {
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...crumbs];
  const items = trail
    .map((crumb) =>
      crumb.href
        ? `<li><a href="${crumb.href}">${escapeAttribute(crumb.name)}</a></li>`
        : `<li aria-current="page">${escapeAttribute(crumb.name)}</li>`,
    )
    .join("");
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}
