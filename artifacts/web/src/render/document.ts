import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderHeader,
  type MenuState,
  type SectionNav,
} from "./header.ts";
import { buildMeta, siteAssets } from "../build.ts";
import { renderFooter } from "./footer.ts";

const here = dirname(fileURLToPath(import.meta.url));
const DOCUMENTS = join(here, "..", "document");
const CONTENT = join(here, "..", "content");

const cache = new Map<string, string>();

function readOnce(path: string): string {
  const cached = cache.get(path);
  if (cached !== undefined) return cached;
  const body = readFileSync(path, "utf8");
  cache.set(path, body);
  return body;
}

/** The `<head>` the live site serves for this page, stored verbatim. */
export function documentHead(slug: string): string {
  return readOnce(join(DOCUMENTS, `${slug}.head.html`));
}

/** The theme's scripts, which the live site prints after `</footer>`. */
export function documentTail(slug: string): string {
  return readOnce(join(DOCUMENTS, `${slug}.tail.html`));
}

/** A page body, exactly as the live site renders it inside the chrome. */
export function pageContent(slug: string): string {
  return readOnce(join(CONTENT, `${slug}.html`));
}

export function documentBodyClass(slug: string): string {
  return readOnce(join(DOCUMENTS, `${slug}.bodyclass.txt`)).trim();
}

export type DocumentOptions = {
  /** Which stored `<head>`/tail pair to use. */
  slug: string;
  bodyClass: string;
  menu: MenuState;
  /** Markup that sits between the header and the footer. */
  content: string;
  /**
   * The section this page belongs to, for the two pillars whose landing page is
   * copied from the live site — they are served through here rather than as
   * generated pages, and should carry the same chrome as the rest of the tree.
   */
  section?: SectionNav;
};

/**
 * This project's own stylesheet and script, added to every copied page's head,
 * alongside the build stamp. Both belong on copied pages as well as generated
 * ones, because both carry chrome shared by every page: the services panel and
 * the floating scheduling button in the CSS, the menu behaviour in the JS.
 */
const SITE_ASSETS = [siteAssets, buildMeta].join("\n");

/**
 * Assembles a full page the same way the WordPress theme does: the page's own
 * head, then the shared header, the page body, the shared footer, and the
 * theme's scripts.
 */
export function renderDocument({
  slug,
  bodyClass,
  menu,
  content,
  section,
}: DocumentOptions): string {
  return `<!doctype html>
<html lang="en-US">
<head>
${documentHead(slug)}
${SITE_ASSETS}
</head>
<body class="${bodyClass}">
${renderHeader(menu, section)}
${content}
${renderFooter()}
${documentTail(slug)}
</body>
</html>
`;
}
