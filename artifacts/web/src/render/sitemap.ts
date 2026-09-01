/**
 * The sitemap and robots file.
 *
 * The whole point of building this site as server-rendered HTML rather than as
 * an app was that the content should be indexable, and it was shipping with
 * neither of the two files a crawler looks for first. Both are generated from
 * the same registries the pages come from, so a service or a provider added to
 * the data appears here with nothing else edited.
 */

import { contentPages } from "../data/pages.ts";
import { providers } from "../data/providers.ts";
import { SITE } from "./generated.ts";
import { serviceRoutes } from "./services.ts";
import { symptomRoutes } from "./symptoms.ts";
import { LOCATIONS_HREF } from "./locations.ts";
import { RESOURCES_HREF } from "./resources.ts";

/**
 * Every route worth indexing, in the order a reader would meet them: the home
 * page, the pages the site is organised around, then the copied pages and the
 * provider profiles.
 *
 * Search results and the build id are not pages. Neither is /404.
 */
export function siteRoutes(): string[] {
  const seen = new Set<string>();
  const routes: string[] = [];

  const add = (route: string) => {
    if (route === "/404" || seen.has(route)) return;
    seen.add(route);
    routes.push(route);
  };

  add("/");
  for (const page of [...serviceRoutes(), ...symptomRoutes()]) add(page.route);
  add(LOCATIONS_HREF);
  add(RESOURCES_HREF);
  add("/providers/");
  for (const provider of providers) add(`/providers/${provider.slug}/`);
  for (const page of contentPages) add(page.route);

  return routes;
}

/** `<urlset>` over every route, with the same origin the canonicals use. */
export function sitemapXml(): string {
  const urls = siteRoutes()
    .map((route) => `\t<url><loc>${SITE}${route}</loc></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/** Everything is public; the only thing worth saying is where the sitemap is. */
export function robotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
}
