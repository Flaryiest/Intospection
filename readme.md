# Intospection

Personal website project with a React frontend (`web`), an Express + Prisma backend (`api`), a Cloudflare Worker (`worker`), and utility scripts (`scripts`).

## What each part does

- `web`: Vite + React app for the site UI (home, artifacts, experiences, writing).
- `api`: Express server with Prisma/Postgres for backend endpoints.
	- `GET /api/health`: health check.
	- `POST /api/mailing-list`: saves an email to the mailing list.
- `worker`: Cloudflare Worker that syncs artifacts and articles from Notion into KV every 15 minutes and serves them.
	- `GET /artifacts`: cached artifacts.
	- `GET /articles`: cached article summaries.
	- `GET /articles/:slug`: full article HTML.
	- `POST /sync`: manual Notion sync.
- `scripts`: one-off utilities.
	- `npm run sync:notion`: snapshots the Notion artifacts database to `web/src/data/artifacts.json` for local dev.

## Run locally (simple)

Prerequisites:

- Node.js 20+ and npm
- A Postgres database (local or hosted)

### 1) Start the API

Open a terminal at the repo root and run:

```bash
cd api
npm install
```

Create `api/.env` with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
```

Then run:

```bash
npx prisma migrate deploy
npm run dev
```

API runs on `http://localhost:3001`.

### 2) Start the web app

Open a second terminal at the repo root and run:

```bash
cd web
npm install
npm run dev
```

Web runs on `http://localhost:5173` and calls the local API at `http://localhost:3001` in development. In dev the site reads artifacts/articles from local JSON in `web/src/data/` — the worker is only used by production builds.

### Optional: worker and scripts

- `worker`: `cd worker && npm install && npm run dev` (requires Cloudflare KV bindings and Notion secrets — see `worker/wrangler.jsonc`). Deploy with `npm run deploy`.
- `scripts`: `cd scripts && npm install && npm run sync:notion` (requires `scripts/.env` with `NOTION_API_KEY` and `NOTION_DATABASE_ID`, see `scripts/.env.example`).