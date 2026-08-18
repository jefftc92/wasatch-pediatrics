# Wasatch Pediatrics

A web project for Wasatch Pediatrics, wired to GitHub for version control.

## Run & Operate

- `pnpm --filter @workspace/web run dev` — run the website (port 5000)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Website: Node.js + Express 5, server-rendered HTML, no front-end framework (`artifacts/web`)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/web` — the public website: a copy of wasatchpeds.net with the services
  section restructured on top of it. See its README.
  - `src/index.ts` — Express server and routes
  - `src/render/*.ts` — the HTML templates (document shell, header, footer, providers,
    search, services, and `generated.ts` for pages the live site does not have)
  - `src/content/*.html` — page bodies, verbatim from the live site — **generated**
  - `src/document/*.html` — each page's verbatim `<head>` and trailing scripts — **generated**
  - `src/data/{pages,providers,searchIndex,nav}.ts` — generated route table and records
  - `src/data/services.ts` — **hand-written**: the service registry (pillars, services,
    topics). The menu, the hub pages, the service and topic pages and their search
    entries are all built from it
  - `src/authored/` — **hand-written**: page bodies we wrote, plus the `<head>`/tail
    templates for generated pages
  - `public/assets/` — **hand-written**: this project's own CSS and JS, loaded after the
    theme's on every page
  - `public/wp-content/**`, `public/wp-includes/**` — vendored theme CSS/JS, jQuery, fonts and media
  - `tools/sync-from-live.py` — re-pulls the generated parts from wasatchpeds.net
  - `tools/prerender.ts` — writes every route to static files for the PR preview
- `artifacts/api-server` — Express API
- `lib/db` — Drizzle schema; `lib/api-spec` — OpenAPI contract

## Architecture decisions

- The website copy vendors the original WordPress theme's CSS and JS instead of
  re-implementing them, so the copy is visually and behaviourally exact and any future
  restyling is a deliberate step.
- Pages are assembled server-side from stored HTML (`src/content`, `src/document`) plus
  shared header/footer templates. Full documents go over the wire, so metadata and SEO
  match the WordPress original.
- Only the provider directory and search are generated rather than stored, since they
  are data-driven; the theme's AJAX filter endpoint is reimplemented at its original
  `/wp-admin/admin-ajax.php` path so the original script works untouched.
- WordPress `<body>` classes and per-route menu state are reproduced because the theme's
  CSS depends on them.
- TypeScript runs directly on Node via native type stripping — no bundler, no build step.
- Services are the one part deliberately not a copy. Four pillars, a two-level menu
  (the four pillars plus a handful of popular services), `/services/` as a filterable
  index of everything, and depth below a service handled on the page — topics as cards,
  plus a section nav under the header — rather than by a third level of dropdown.
- Scheduling lives in the site header, so it is on every page at every width.
- Nothing this project writes goes anywhere the sync empties, and the vendored theme
  under `public/wp-content/` stays a byte-for-byte copy: our CSS and JS live in
  `public/assets/`, our copy in `src/authored/`, the registry in `src/data/services.ts`.

## Product

Wasatch Pediatrics — pediatric healthcare web platform.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `tools/sync-from-live.py` **empties `artifacts/web/src/content/` and `src/document/`
  on every run** and regenerates `src/data/{pages,providers,searchIndex,nav}.ts`. Never
  hand-edit those.
- `src/data/services.ts`, `src/authored/` and `public/assets/` are hand-written and the
  sync does not touch them. Editing them by hand is the intended way to change services,
  our copy, or our styling.
- Analytics tags are stripped by the sync on purpose, so a copy never reports into
  production analytics.
- Merging a PR on GitHub does not update this workspace — `scripts/post-merge.sh` only
  installs dependencies. Run `git pull` here before checking whether a merged change is
  present, and restart the dev server afterwards.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
