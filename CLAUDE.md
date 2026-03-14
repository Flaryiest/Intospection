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
npm run build      # Compile TypeScript to dist/
npm run prettier   # Format all files with Prettier
```

**Status:** Web is active; API is a skeleton project with no endpoints implemented yet.

## Project Structure

This is a monorepo with two independent workspaces:
- `web/` — React SPA (frontend)
- `api/` — Node.js backend (skeleton, not yet implemented)

Each has its own `package.json`, `tsconfig.json`, and build pipeline.

## Architecture

Personal portfolio for Eric Zuo.

**Web (frontend):** React 19, React Router 7, TypeScript 5.9, Vite 7, CSS Modules.

**API (backend):** Node.js with Express.js (v5), TypeScript 5.9, ESM modules. Currently a skeleton project with no endpoints implemented.

**Web entry flow:** `index.html` → `main.tsx` (mounts `<RouterProvider>`) → `Router.tsx` (defines routes) → page components.

**Web routing:** All routes (`/`, `/artifacts`, `/experiences`, `/writing`) nest under `Layout.tsx`, which renders `<Navbar>`, `<Outlet>`, and `<Footer>` in a flex column. The `Artifacts`, `Experiences`, and `Writing` pages are currently empty placeholder stubs. Currently, the frontend is a static SPA with no backend API integration.

**Export conventions:** `Home` uses a named export (`export function Home`); all other pages and components use default exports.

**Footer:** Contains unimplemented placeholder buttons for an appearance toggle and a Ctrl+K search — not yet functional.

**Path aliases** (configured in both `vite.config.ts` and `tsconfig.app.json`):
- `@components` → `src/components`
- `@pages` → `src/pages`
- `@assets` → `src/assets`

**Styling conventions:**
- CSS Modules (`.module.css`) for component-scoped styles
- Global resets and base styles in `src/index.css` (includes Meyer reset)
- Primary font: Playfair Display (serif); loaded via Google Fonts in `index.html`
- Background: `#f5f5f5`

**Code style** (Prettier config):
- 4-space indent, single quotes, no semicolons, trailing commas where valid (ES5)
