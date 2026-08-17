import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { contentPageByRoute } from "./data/pages.ts";
import {
  providerBySlug,
  providersArchiveBodyClass,
  providersArchiveMenuClasses,
  providersArchiveMenuCurrentIds,
} from "./data/providers.ts";
import {
  documentBodyClass,
  pageContent,
  renderDocument,
} from "./render/document.ts";
import { NO_MENU_STATE } from "./render/header.ts";
import {
  filterProviders,
  renderProviderCards,
  renderProviderProfile,
  renderProvidersArchive,
} from "./render/providers.ts";
import { renderSearchResults, searchSite } from "./render/search.ts";

const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(here, "..", "public");
const port = Number(process.env.PORT ?? 5000);

export const app = express();

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false }));

// The theme's stylesheet, scripts, fonts and media, at their original paths.
app.use(
  express.static(PUBLIC, {
    maxAge: "1h",
    // Anything unknown under these prefixes is a missing asset, not a page.
    fallthrough: true,
  }),
);

/**
 * The provider filter posts here, exactly as it does on the live site, and gets
 * back the replacement grid markup.
 */
app.post("/wp-admin/admin-ajax.php", (request, response) => {
  const body = request.body as Record<string, string | undefined>;
  if (body.action !== "myfilter") {
    response.status(400).send("0");
    return;
  }

  const matches = filterProviders({
    location: body.locationfilter,
    gender: body.genderfilter,
    category: body.credentialsfilter,
  });
  response.type("html").send(renderProviderCards(matches));
});

app.get("/providers{/}", (request, response) => {
  if (!request.path.endsWith("/")) {
    response.redirect(301, `${request.path}/`);
    return;
  }

  response.type("html").send(
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
});

app.get("/providers/:slug{/}", (request, response, next) => {
  const provider = providerBySlug.get(request.params.slug);
  if (!provider) {
    next();
    return;
  }

  if (!request.path.endsWith("/")) {
    response.redirect(301, `${request.path}/`);
    return;
  }

  response.type("html").send(
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
});

app.get("/", (request, response, next) => {
  const term = request.query.s;
  if (typeof term !== "string") {
    next();
    return;
  }

  response.type("html").send(
    renderDocument({
      slug: "search",
      bodyClass: documentBodyClass("search"),
      menu: NO_MENU_STATE,
      content: renderSearchResults(term, searchSite(term)),
    }),
  );
});

// Every page copied from the live site, served from its stored markup.
app.get("/{*path}", (request, response, next) => {
  const route = withTrailingSlash(request.path);
  const page = contentPageByRoute.get(route);
  if (!page) {
    next();
    return;
  }

  // WordPress canonicalises to the trailing-slash form.
  if (route !== request.path) {
    response.redirect(
      301,
      route + (request.url.slice(request.path.length) || ""),
    );
    return;
  }

  response.type("html").send(
    renderDocument({
      slug: page.slug,
      bodyClass: page.bodyClass,
      menu: { classes: page.menuClasses, currentIds: page.menuCurrentIds },
      content: pageContent(page.slug),
    }),
  );
});

// WordPress serves every page with a trailing slash; redirect the bare form so
// links written either way resolve.
app.use((request, response, next) => {
  if (request.method !== "GET" || request.path.endsWith("/")) {
    next();
    return;
  }
  const candidate = `${request.path}/`;
  if (
    contentPageByRoute.has(candidate) ||
    /^\/providers\/[^/]+\/$/.test(candidate)
  ) {
    response.redirect(301, candidate);
    return;
  }
  next();
});

app.use((_request, response) => {
  response
    .status(404)
    .type("html")
    .send(
      renderDocument({
        slug: "404",
        bodyClass: documentBodyClass("404"),
        menu: NO_MENU_STATE,
        content: pageContent("404"),
      }),
    );
});

function withTrailingSlash(path: string): string {
  if (path === "" || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

if (process.env.NODE_ENV !== "test") {
  app.listen(port, "0.0.0.0", () => {
    console.log(
      `Wasatch Pediatrics site listening on http://localhost:${port}`,
    );
  });
}
