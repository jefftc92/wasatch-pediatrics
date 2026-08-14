# Wasatch Pediatrics website

A 1:1 copy of the live site at https://wasatchpeds.net, rebuilt as a React + Vite
app so we have a codebase to build on. Every route, every page body, the theme's
styling and its animations are reproduced; nothing has been redesigned.

```
pnpm --filter @workspace/web run dev        # http://localhost:5173
pnpm --filter @workspace/web run build      # static build into dist/
pnpm --filter @workspace/web run typecheck
```

## How the copy is put together

The live site is WordPress running a hand-written theme (`wp-content/themes/wasatch`).
Rather than re-implement its CSS, the copy vendors it:

| Piece                                             | Where it lives                          | Notes                                                                       |
| ------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------- |
| Theme stylesheet, Bootstrap 5, WordPress core CSS | `public/wp-content/**`                  | Byte-for-byte copies, linked from `index.html` in the original order        |
| Fonts, icons, photos, PDFs                        | `public/wp-content/{themes,uploads}/**` | Kept at their original URLs so copied markup resolves unchanged             |
| Page bodies                                       | `src/content/*.html`                    | Exactly the markup the live site renders between `</header>` and `<footer>` |
| Route table                                       | `src/data/pages.ts`                     | Route → content file, `<title>`, meta description, `<body>` class           |
| Providers                                         | `src/data/providers.ts`                 | 72 profiles as structured records                                           |
| Search index                                      | `src/data/searchIndex.ts`               | Powers `/?s=…`, which WordPress handles server-side                         |

Header, footer, the provider directory, search and the 404 page are real React
components. Everything else renders its stored HTML, so the copied pages stay
identical to the source while still being routed and animated by the app.

### Animations

`script.js` on the live site is jQuery. Its behaviour is ported, not
approximated:

- `src/lib/animate.ts` — jQuery's `slideToggle`/`fadeIn`/`fadeOut`, including its
  named durations (`fast` = 200ms, `slow` = 600ms) and `swing` easing.
- `src/lib/carousel.ts` — the Bootstrap 5 carousel, reproducing the class
  sequence (`carousel-item-next`/`-start`) that drives the CSS transition, the
  5s autoplay and pause-on-hover.
- `src/lib/themeInteractions.ts` — delegated handlers for the accordions, FAQ
  rows, tab panels and the hover "bounce" on buttons.
- `Header.tsx` — the mobile burger, the sliding sub-menus and the expanding
  search field.

The port was verified against the original by driving both with a headless
browser: page height, rendered text, `<title>`, image loading, the expanded
heights of every accordion, and the carousel's intermediate classes all match on
all 140 routes at 390px, 768px and 1440px.

### WordPress body classes

WordPress stamps classes such as `single-providers` or `page-id-105` onto
`<body>`, and the theme's CSS keys off them (`.single-providers .btn` restyles
buttons on provider profiles). Each route re-applies its original class list via
`src/lib/useBodyClass.ts`.

## Re-syncing from the live site

While the WordPress site is still the source of truth, pull its changes down with:

```
python3 tools/sync-from-live.py              # mirror + regenerate everything
python3 tools/sync-from-live.py --no-fetch   # regenerate from the local cache
```

It re-mirrors every page in the sitemap (plus blog pagination and posts), rewrites
`src/content/`, regenerates the data modules, and downloads any new media. HTML is
cached in `.sync-cache/` (gitignored). Review `git diff` before committing.

## Deployment note

This is a client-routed single-page app, so the host must serve `index.html` for
unknown paths (`vite preview` and the dev server already do). Two things worth
deciding before this replaces the WordPress site: server-side rendering or
prerendering for SEO, since the marketing pages currently render client-side, and
where the media should live long-term — `public/wp-content/` is a straight copy of
the WordPress uploads folder.
