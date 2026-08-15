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

- `artifacts/web` — the public website, a 1:1 copy of wasatchpeds.net. See its README.
  - `src/index.ts` — Express server and routes
  - `src/render/*.ts` — the HTML templates (document shell, header, footer, providers, search)
  - `src/content/*.html` — page bodies, verbatim from the live site
  - `src/document/*.html` — each page's verbatim `<head>` and trailing scripts
  - `src/data/{pages,providers,searchIndex,nav}.ts` — generated route table and records
  - `public/wp-content/**`, `public/wp-includes/**` — vendored theme CSS/JS, jQuery, fonts and media
  - `tools/sync-from-live.py` — re-pulls all of the above from wasatchpeds.net
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

## Product

Wasatch Pediatrics — pediatric healthcare web platform.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `artifacts/web/src/data/*.ts`, `src/content/` and `src/document/` are generated — change
  them through `tools/sync-from-live.py`, not by hand.
- Analytics tags are stripped by the sync on purpose, so a copy never reports into
  production analytics.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
