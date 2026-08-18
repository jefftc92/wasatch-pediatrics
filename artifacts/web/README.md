# Wasatch Pediatrics website

A copy of the live site at https://wasatchpeds.net, rebuilt as a plain Node.js
server that renders HTML, with the services section restructured on top of it.
Every route, every page body, the theme's styling and its scripts are
reproduced; there is no front-end framework — pages are assembled as HTML
strings on the server and sent as complete documents.

The copy is the base layer and stays faithful to WordPress. What this project
adds sits beside it, in files the re-sync cannot touch: see
[Services](#services) below for the one part of the site that has been
restructured, and [Verification](#verification) for exactly what now differs
from the live site.

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
| Service registry                          | `src/data/services.ts`                          | Written here, not copied — the source for the menu, hubs and service pages  |
| Copy we author                            | `src/authored/`                                 | Bodies, head and tail for pages the live site does not have                 |
| Our own CSS                               | `public/assets/site.css`                        | Loaded after the theme's stylesheet on every page                           |

`src/render/` holds the templates: `document.ts` assembles a copied page,
`generated.ts` assembles one we wrote, `header.ts` and `footer.ts` are the
shared chrome, and `providers.ts` / `search.ts` / `services.ts` render the
sections that are generated rather than stored. Those are the seams to build on
— editing the header template changes every page.

`tools/sync-from-live.py` empties `src/content/` and `src/document/` on every
run, so nothing we write goes in either. Authored copy lives in
`src/authored/`, and our stylesheet lives in `public/assets/` rather than inside
the vendored theme.

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

## Services

The live site files everything the practice does under one Services menu with
three entries, while the twenty actual services are documented only inside the
eight location pages — which is where they had drifted apart (Draper omitted
Immunizations; two offices listed behavioral health with no behavioral health
provider assigned).

`src/data/services.ts` replaces that with one registry: four pillars, nineteen
services, and for each service the offices that offer it and the provider
category that staffs it. Everything downstream is generated from it, so adding a
service adds its menu entry, its card on the pillar hub, its page, and its
search entry at once.

| Pillar                   | Landing page               | Services                                                                                                                                                                                 |
| ------------------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Medical Care             | `/services/`               | Well Child Checkups, Same-Day Sick Visits, After Hours Care, Immunizations, Newborn Hospital Care, Lab Tests & Screenings, Ear Piercing, Medical Home Coordination, In-Office Procedures |
| Behavioral Health        | `/behavioral-health/`      | Consultation & Screening, Therapy, Medication Management, Psychological & Autism Testing                                                                                                 |
| Nutrition & Lactation    | `/nutrition/`              | Dietitian Consultation, Lactation Consultation, Community Classes                                                                                                                        |
| Dentistry & Orthodontics | `/dentistry-orthodontics/` | Pediatric Dentistry, Orthodontics, Dental Emergencies                                                                                                                                    |

Each pillar is a real clinical grouping, so nothing sits under a heading it does
not belong to — ear piercing is medical care performed in a medical office, not
dentistry, even though both involve a chair and a bit of nerve.

**The menu.** Services is a four-column panel built from the registry
(`src/render/header.ts`). It is still a `.sub-menu`, so the theme's own
`script.js` opens it: hover on desktop, tap on mobile, no change to the vendored
script. The lists inside are `.mega-list` rather than nested `.sub-menu`s for
the same reason — the theme's mobile handler slides every descendant
`.sub-menu`, and a second level would fight it. On a phone the panel collapses
to one stacked column with each pillar name as a group heading, inside the
burger menu the theme already had.

**The pages.** `/behavioral-health/` and `/dentistry-orthodontics/` keep the
landing page copied from the live site and gain an index of their services
below it, so none of that copy is lost. `/services/` and `/nutrition/` are
rendered in full: `/services/` replaces the copied page whose three tab sections
now live on the service pages under it, and `/nutrition/` is new. Every service
page carries the practice's own words where they exist, the offices that offer
it, the providers who staff it, and links across to the rest of the pillar.

**Still to confirm with the practice.** The office-by-office `locations` lists
are transcribed from the live location pages, drift included; the schedule
button on every service page points at `/contact-us/` rather than the
location-specific Phreesia link; and the services without copy on the live site
carry standing text that should be replaced.

## Verification

### The copy, against the live site

Compared automatically against the live site, mirrored and served locally so both
sides face identical network conditions. The real Adobe and Google webfonts are
fetched and replayed to both, so typography is exercised rather than falling back.
These results describe the copy before the services layer was added:

- **Pixel-identical on all 140 routes at 1440px** — full-page screenshots, zero
  differing pixels.
- **Pixel-identical at 390px** on 20 routes covering every template (home, the
  content pages, blog index and pagination, category archive, location, provider
  archive and profile, blog post).
- The served HTML was **token-for-token identical** to the live document on 113 of
  140 routes. The remaining 27 are blog posts, where the live theme emits a stray
  `</div>` after `</html>`; browsers parse both to the same DOM.
- Interactive parity: accordion heights, carousel classes and autoplay, tab
  panels, mobile nav, nav hover, button bounce, search field expansion.
- The provider filter returns the same sets as the live AJAX endpoint for every
  location and category value.
- The theme stylesheet, Bootstrap and all six LemonYellowSun webfont files are
  byte-identical to the live ones (verified by re-download and compare).

### The services layer, against the copy

Every copied route was rendered before and after the change and diffed. Of the
140 routes, **137 differ only by the added stylesheet link and the Services menu
panel** — no page body moved. The three that differ further are the pillar
landing pages, deliberately: `/behavioral-health/` and `/dentistry-orthodontics/`
gain their service index, and `/services/` is replaced by the generated hub.

Because every page now carries `site.css` in its head, no route is
byte-identical to the live document any more. Nothing else about the copy
changed.

## Known differences

- **The services section is deliberately not a copy.** See
  [Services](#services); `/services/` and `/nutrition/` and the nineteen service
  pages under the four pillars do not exist on the live site in this form.
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
  The pages we author follow the same convention, so their canonicals name URLs
  that will not resolve until this replaces the live site.
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
