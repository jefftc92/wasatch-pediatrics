# Wasatch Pediatrics website

A 1:1 copy of the live site at https://wasatchpeds.net, rebuilt as a plain
Node.js server that renders HTML. Every route, every page body, the theme's
styling and its scripts are reproduced; nothing has been redesigned, and there is
no front-end framework — pages are assembled as HTML strings on the server and
sent as complete documents.

```
pnpm --filter @workspace/web run dev        # http://localhost:5000
pnpm --filter @workspace/web run start
pnpm --filter @workspace/web run typecheck
```

TypeScript runs directly on Node (native type stripping) — there is no build
step and no bundler.

## How the copy is put together

The live site is WordPress running a hand-written theme
(`wp-content/themes/wasatch`). Rather than re-implement it, the copy vendors it:

| Piece                                     | Where it lives                                  | Notes                                                                       |
| ----------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Theme CSS and JS, Bootstrap, jQuery       | `public/wp-content/**`, `public/wp-includes/**` | Byte-for-byte copies, served at their original URLs                         |
| Fonts, icons, photos, PDFs                | `public/wp-content/**`                          | Original paths, so copied markup resolves unchanged                         |
| Each page's `<head>` and trailing scripts | `src/document/*.html`                           | Verbatim, so canonical/Open Graph/JSON-LD metadata is preserved             |
| Page bodies                               | `src/content/*.html`                            | Exactly the markup the live site renders between `</header>` and `<footer>` |
| Route table                               | `src/data/pages.ts`                             | Route → files, `<body>` class, per-route menu state                         |
| Providers                                 | `src/data/providers.ts`                         | 72 profiles as typed records                                                |
| Search index                              | `src/data/searchIndex.ts`                       | Powers `/?s=…`                                                              |

`src/render/` holds the templates: `document.ts` assembles the page, `header.ts`
and `footer.ts` are the shared chrome, and `providers.ts` / `search.ts` render
the two sections that are generated rather than stored. Those are the seams to
build on — editing the header template changes every page.

### Animations

Nothing is re-implemented: the theme's own `script.js`, jQuery, jquery-migrate
and Bootstrap are vendored and loaded exactly as the live site loads them, so the
carousel, accordions, tabs, mobile nav, expanding search and button hover are the
original code running unchanged.

### WordPress behaviour that had to be reproduced

- **`<body>` classes.** WordPress stamps classes like `single-providers` or
  `page-id-105` onto `<body>` and the theme's CSS keys off them
  (`.single-providers .btn` restyles buttons on provider profiles).
- **Menu state.** The current page's menu item gets extra classes and
  `aria-current="page"` — and a page can appear in the menu twice (Dentistry &
  Orthodontics sits under both Locations and Services).
- **The provider filter.** The theme posts to `/wp-admin/admin-ajax.php` with
  `action=myfilter`; the server answers that route with the same grid markup, so
  the original filter script works untouched.
- **Trailing slashes.** `/about` redirects to `/about/`, as WordPress does.

## Verification

Compared automatically against the live site, mirrored and served locally so both
sides face identical network conditions. The real Adobe and Google webfonts are
fetched and replayed to both, so typography is exercised rather than falling back.

- **Pixel-identical on all 140 routes at 1440px** — full-page screenshots, zero
  differing pixels.
- **Pixel-identical at 390px** on 20 routes covering every template (home, the
  content pages, blog index and pagination, category archive, location, provider
  archive and profile, blog post).
- The served HTML is **token-for-token identical** to the live document on 113 of
  140 routes. The remaining 27 are blog posts, where the live theme emits a stray
  `</div>` after `</html>`; browsers parse both to the same DOM.
- Interactive parity: accordion heights, carousel classes and autoplay, tab
  panels, mobile nav, nav hover, button bounce, search field expansion.
- The provider filter returns the same sets as the live AJAX endpoint for every
  location and category value.
- The theme stylesheet, Bootstrap and all six LemonYellowSun webfont files are
  byte-identical to the live ones (verified by re-download and compare).

## Known differences

- **Analytics are not copied.** Google Tag Manager and Analytics tags are
  stripped by the sync so a copy never reports into production analytics.
- **Search is re-implemented.** WordPress searches its database; this indexes the
  stored page text and link targets. Live results come back on top in the same
  order, but template-built pages can match here where WordPress finds nothing in
  `post_content`.
- **The `/comments/` form has no backend.** The Gravity Forms markup and scripts
  are copied and render correctly, but there is nowhere for a submission to go.
- **Canonical and Open Graph URLs still point at wasatchpeds.net**, since that is
  still the live site. Asset URLs are rewritten to this server; these are not.
- **montserrat is served by Adobe Fonts**, not self-hosted, and Adobe web projects
  carry a domain allowlist. Add the production domain to that project before
  cutover or the body font can fall back to system sans.

## PR previews

Every pull request that touches this artifact gets a browsable copy published to
GitHub Pages at `/pr-<number>/`, and the workflow comments the link on the PR
(`.github/workflows/pr-preview.yml`). Closing the PR removes its directory.

Pages cannot run a server, so the preview is a prerendered build:

```
pnpm --filter @workspace/web run prerender -- --out dist --base /repo/pr-1
```

`tools/prerender.ts` writes every route to a static file using the same
templates the server uses, prefixes root-absolute URLs with `--base` (Pages
serves previews from a subdirectory), and adds `tools/static-preview.js`, which
reimplements the provider filter and the site search in the browser from JSON
built at the same time. Media is published once at `/shared/` via
`--asset-base` + `--skip-assets`, so each preview directory is ~6MB rather than
~118MB.

The preview is therefore deliberately _not_ byte-identical to the live site —
the base rewriting alone changes every URL. The server remains the reference for
the fidelity checks above.

## Re-syncing from the live site

While WordPress is still the source of truth, pull its changes down with:

```
python3 tools/sync-from-live.py              # mirror + regenerate everything
python3 tools/sync-from-live.py --no-fetch   # regenerate from the local cache
```

It re-mirrors every page in the sitemap (plus blog pagination and posts),
rewrites `src/content/` and `src/document/`, regenerates the data modules, and
downloads any new media. HTML is cached in `.sync-cache/` (gitignored). Review
`git diff` before committing.
