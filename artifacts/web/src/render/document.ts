import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderHeader, type MenuState } from "./header.ts";
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
};

/**
 * This project's own stylesheet, added to every copied page's head. It sits
 * outside public/wp-content/ so the vendored theme stays a byte-for-byte copy,
 * and it loads after style.css so it can override the theme.
 */
const SITE_CSS = `<link rel='stylesheet' id='site-css' href='/assets/site.css' media='all' />`;

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
}: DocumentOptions): string {
  return `<!doctype html>
<html lang="en-US">
<head>
${documentHead(slug)}
${SITE_CSS}
</head>
<body class="${bodyClass}">
${renderHeader(menu)}
${content}
${renderFooter()}
${documentTail(slug)}
</body>
</html>
`;
}
