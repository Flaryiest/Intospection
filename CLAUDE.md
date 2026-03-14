# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `web/` directory:

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run prettier   # Format all files with Prettier
npm run preview    # Preview production build
```

No test suite is configured yet.

## Architecture

Personal portfolio SPA for Eric Zuo. Stack: React 19, React Router 7, TypeScript 5.9, Vite 7, CSS Modules.

**Entry flow:** `index.html` → `main.tsx` (mounts `<RouterProvider>`) → `Router.tsx` (defines routes) → page components.

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
