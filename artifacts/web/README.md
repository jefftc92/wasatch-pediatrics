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

Both versions were compared automatically, with the live site mirrored and served
locally so network conditions were identical on both sides:

- The served HTML is **token-for-token identical** to the live document on 107 of
  140 routes. The other 33 are blog posts, where the live theme emits a stray
  `</div>` after `</html>`; browsers parse both to the same DOM.
- A headless browser found matching page height, rendered text, `<title>` and
  image loading on all 140 routes at 390px, 768px and 1440px.
- Accordion heights, carousel classes and autoplay, tab panels, mobile nav,
  nav hover, button bounce and the search field expansion all match.
- The provider filter returns the same sets as the live AJAX endpoint for every
  location and category value.

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
