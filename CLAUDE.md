# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Intospection** is a personal portfolio website. It has two separate npm projects:
- `web/` — Vite + React 19 SPA (the site UI)
- `api/` — Express 5 + Prisma + PostgreSQL backend

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

### Database
```bash
cd api && npx prisma migrate deploy   # Apply migrations
cd api && npx prisma migrate dev      # Create + apply new migration in dev
```

## Architecture

### Frontend (`web/`)

React Router SPA with four routes:
- `/` — Home/intro
- `/artifacts` — Consumed content (books, articles, etc.) with tag filtering and enjoyment/importance scores
- `/experiences` — Work and life experiences
- `/writing` — Blog/essays

**Path aliases** (configured in `vite.config.ts`):
- `@components` → `src/components/`
- `@pages` → `src/pages/`
- `@assets` → `src/assets/`
- `@data` → `src/data/`

Content (artifacts, experiences, writing) is static data hardcoded in `src/data/`. The only live API calls are for the mailing list subscription.

Notable UI components: command palette (Ctrl/Cmd+K), custom cursor canvas.

### Backend (`api/`)

Minimal Express server. Database schema has a single `MailingList` model (id, unique email, createdAt). CORS is configured for `localhost` in dev and `ericzuo.ca` in production.

Endpoints:
- `GET /api/health`
- `POST /api/mailing-list`

### Environment

The API requires `api/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
```
