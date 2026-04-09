# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Intospection** is a personal portfolio website for ericzuo.ca. It has three separate npm projects plus a scripts directory:
- `web/` — Vite + React 19 SPA (the site UI)
- `api/` — Express 5 + Prisma + PostgreSQL backend
- `worker/` — Cloudflare Worker that syncs artifacts from Notion to KV and serves them via REST
- `scripts/` — One-off utilities (Notion sync to local JSON)

## Commands

### Web frontend (`web/`)
```bash
npm run dev       # Dev server at http://localhost:5173
npm run build     # tsc + vite build
npm run lint      # ESLint
npm run preview   # Preview production build
npm run prettier  # Format with Prettier
```

### API backend (`api/`)
```bash
npm run dev       # tsx watch mode at http://localhost:3001
npm run build     # prisma generate + tsc
npm run start     # Run compiled JS
npm run prettier  # Format with Prettier
```

### Cloudflare Worker (`worker/`)
```bash
npm run dev       # wrangler dev (local worker)
npm run deploy    # wrangler deploy
```

### Scripts (`scripts/`)
```bash
npm run sync:notion   # Pull artifacts from Notion API → web/src/data/artifacts.json
```
Requires `NOTION_API_KEY` and `NOTION_DATABASE_ID` env vars (via `scripts/.env`).

### Database
```bash
cd api && npx prisma migrate deploy   # Apply migrations
cd api && npx prisma migrate dev      # Create + apply new migration in dev
```

## Architecture

### Frontend (`web/`)

React Router SPA with four routes:
- `/` — Home/intro
- `/artifacts` — Consumed content (books, articles, etc.) with tag filtering and internalization scores
- `/experiences` — Work and life experiences
- `/writing` — Blog/essays

**Path aliases** (configured in `vite.config.ts`):
- `@components` → `src/components/`
- `@pages` → `src/pages/`
- `@assets` → `src/assets/`
- `@data` → `src/data/`
- `@hooks` → `src/hooks/`

Content data lives in `src/data/` — `artifacts.json` is generated from Notion (via `scripts/sync-notion.ts` or the worker), while experiences and writing are hardcoded. The only live API call from the frontend is the mailing list subscription.

Notable UI components: command palette (Ctrl/Cmd+K), custom cursor canvas.

### Backend (`api/`)

Minimal Express server with all routes in `src/index.ts` (no separate route files). Database schema has a single `MailingList` model (id, unique email, createdAt). Prisma client is imported from `src/generated/prisma/client.js` (generated output lives in the repo). CORS allows `localhost:5173` in dev and `ericzuo.ca` in production.

Endpoints:
- `GET /api/health`
- `POST /api/mailing-list`

### Cloudflare Worker (`worker/`)

Serves artifact data from KV storage and syncs from Notion on a cron schedule (every 15 minutes). Two endpoints:
- `GET /artifacts` — returns cached artifacts from KV
- `POST /sync` — triggers manual Notion sync

Uses `ARTIFACTS_KV` (KV namespace), `NOTION_API_KEY`, and `NOTION_DATABASE_ID` bindings. CORS allows the same origins as the API.

### Data flow for artifacts

Notion database → `worker` (cron every 15 min, writes to Cloudflare KV) → frontend fetches from worker.
Alternatively: Notion → `scripts/sync-notion.ts` → `web/src/data/artifacts.json` (static build-time data).

### Environment

The API requires `api/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
```

The worker requires Cloudflare secrets: `NOTION_API_KEY`, `NOTION_DATABASE_ID`.

The sync script requires `scripts/.env`:
```env
NOTION_API_KEY="..."
NOTION_DATABASE_ID="..."
```
