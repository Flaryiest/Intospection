# Intospection

Personal website project with a React frontend (`web`) and an Express + Prisma backend (`api`).

## What each part does

- `web`: Vite + React app for the site UI (home, artifacts, experiences, writing).
- `api`: Express server with Prisma/Postgres for backend endpoints.
	- `GET /api/health`: health check.
	- `POST /api/mailing-list`: saves an email to the mailing list.

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

Web runs on `http://localhost:5173` and calls the local API at `http://localhost:3001` in development.