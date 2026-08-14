# Wasatch Pediatrics

A web project for Wasatch Pediatrics, wired to GitHub for version control.

## Run & Operate

- `pnpm --filter @workspace/web run dev` — run the website (port 5173)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Website: React 19 + Vite 7 + wouter (`artifacts/web`)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/web` — the public website, a 1:1 copy of wasatchpeds.net. See its README.
  - `src/content/*.html` — page bodies, verbatim from the live site
  - `src/data/{pages,providers,searchIndex}.ts` — generated route table and records
  - `public/wp-content/**` — vendored theme CSS, fonts and media at their original paths
  - `tools/sync-from-live.py` — re-pulls all of the above from wasatchpeds.net
- `artifacts/api-server` — Express API
- `lib/db` — Drizzle schema; `lib/api-spec` — OpenAPI contract

## Architecture decisions

- The website copy vendors the original WordPress theme's CSS instead of re-implementing
  it, so the copy is visually exact and future restyling is a deliberate step.
- Page bodies are stored as HTML and rendered into the React tree; only the chrome,
  provider directory and search are components. This keeps the copy faithful while
  giving us somewhere to build.
- The theme's jQuery animations are ported by hand (`artifacts/web/src/lib/`) rather than
  by shipping jQuery — matching durations, easing and Bootstrap's carousel classes.
- WordPress `<body>` classes are re-applied per route because the theme's CSS depends on them.

## Product

Wasatch Pediatrics — pediatric healthcare web platform.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `artifacts/web/src/data/*.ts` and `src/content/` are generated — change them through
  `tools/sync-from-live.py`, not by hand.
- The website is client-routed; any host must fall back to `index.html` for unknown paths.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
