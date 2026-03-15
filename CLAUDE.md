# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Web** (React frontend) — Run from `web/` directory:

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run prettier   # Format all files with Prettier
npm run preview    # Preview production build
```

**API** (Node/Express backend) — Run from `api/` directory:

```bash
npm run dev        # Watch mode (tsx watch src/index.ts)
npm run build      # prisma generate + tsc (outputs to dist/)
npm run start      # Run compiled server
npm run prettier   # Format all files with Prettier
```

## Architecture

Personal portfolio for Eric Zuo. Monorepo with two independent workspaces (`web/`, `api/`), each with its own `package.json`, `tsconfig.json`, and build pipeline.

**Web (frontend):** React 19, React Router 7, TypeScript 5.9, Vite 7, CSS Modules.

**API (backend):** Node.js with Express.js v5, TypeScript 5.9, ESM modules, Prisma ORM with PostgreSQL. Requires `DATABASE_URL` env variable. Runs on port 3001. Implemented endpoints:
- `POST /api/mailing-list` — saves email to DB
- `GET /api/health`

**Web entry flow:** `index.html` → `main.tsx` (mounts `<RouterProvider>`) → `Router.tsx` (defines routes) → page components.

**Web routing:** All routes (`/`, `/artifacts`, `/experiences`, `/writing`) nest under `Layout.tsx`, which renders `<Navbar>`, `<Outlet>`, and `<Footer>`. The `Artifacts`, `Experiences`, and `Writing` pages are currently empty placeholder stubs. The frontend is currently static with no backend API integration.

**Path aliases** (configured in both `vite.config.ts` and `tsconfig.app.json`):
- `@components` → `src/components`
- `@pages` → `src/pages`
- `@assets` → `src/assets`

**Styling:** CSS Modules (`.module.css`) for component-scoped styles; global resets and base styles in `src/index.css` (Meyer reset). Primary font: Playfair Display (serif) via Google Fonts. Background: `#f5f5f5`.

**Export conventions:** `Home` uses a named export (`export function Home`); all other pages and components use default exports.

**Footer:** Contains unimplemented placeholder buttons for an appearance toggle and a Ctrl+K search.

**Code style** (Prettier config): 4-space indent, single quotes, no semicolons, trailing commas where valid (ES5).
