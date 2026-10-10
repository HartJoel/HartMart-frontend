# HartMart Frontend

The UI for HartMart, a multi-vendor marketplace. A standalone React +

pages expect a HartMart API to talk to once wired up.

## Stack

React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS v4,
Framer Motion.

## Getting started

```bash
npm install
cp .env.example .env.local   # set VITE_API_URL once the backend is available
npm run dev                  # http://localhost:5173
```

Other scripts:

| Command | Purpose |
| --- | --- |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript check, no emit |

### Environment

Copy `.env.example` to `.env.local` and set `VITE_API_URL` to the
backend's origin (no trailing path). Leave it empty to make requests
same-origin — useful behind a reverse proxy that routes `/api` to the
backend. Vite only exposes variables prefixed `VITE_`, and inlines them
into the bundle at build time.

### HTTPS locally

The dev server runs over HTTPS via `@vitejs/plugin-basic-ssl` (a
self-signed cert, generated automatically — no setup needed). Your
browser will warn on first visit; proceed past it to continue.

## Project structure

- `src/app/` — router, layouts (storefront, vendor, admin shells), providers
- `src/features/<feature>/` — domain code: `pages/`, `components/`, `api.ts`
- `src/components/` — shared design-system primitives
- `src/lib/` — shared utilities (`cn`, `format`, API client, mock data)
- `src/types/` — TypeScript types mirroring API response shapes
- `docs/` — API documentation, frontend blueprint, original screen prompts
- `claude/skills/` — design skills used for UI work

See `AGENTS.md` for the fuller structure breakdown and code-quality
conventions, and `docs/HartMart-Frontend-Blueprint.md` for the route map
and per-page data hooks.

## Docker

Build and run the production image:

```bash
docker build -t hartmart-frontend --build-arg VITE_API_URL=https://api.example.com .
docker run -p 8080:80 hartmart-frontend
```

Or with Compose (reads `VITE_API_URL` from your shell/`.env`):

```bash
docker compose up --build
```

The image is a two-stage build — `node:22-alpine` compiles the Vite
build, then `nginx:1.27-alpine` serves the static output (`nginx.conf`
includes the History-API fallback React Router needs, plus long-lived
caching for hashed assets). Since `VITE_API_URL` is inlined at build
time, it's passed as a build arg, not a container runtime env var —
rebuild the image to point at a different backend.
