# CineGear / RentFlow

Equipment rental management SPA for film/cinema gear rental companies.

## Tech Stack

- **React 18** + **TypeScript** + **Vite** (SWC)
- **React Router v6** with `HashRouter` (required for GitHub Pages)
- **TanStack Query v5** for server state
- **Tailwind CSS v3** + **shadcn/ui** (Radix UI primitives)
- **Framer Motion** for animations
- **react-hook-form** + **zod** for forms
- **Vitest** + **Testing Library** for unit tests
- **Playwright** for e2e tests

## Commands

```bash
npm run dev        # Dev server on port 8080
npm run build      # Production build
npm run build:dev  # Development build
npm run lint       # ESLint
npm run test       # Vitest (run once)
npm run test:watch # Vitest (watch mode)
```

## Architecture

All data lives in **localStorage** — there is no backend. The app is fully client-side.

- `src/contexts/AuthContext.tsx` — auth + multi-tenant user management (localStorage keys prefixed `rentflow_`)
- `src/contexts/AppDataContext.tsx` — all app state (equipment, reservations, quotes, clients, kits, contracts, financials)
- `src/data/mock-data.ts` — data types, initial/seed data, analytics helpers
- `src/pages/` — one file per route
- `src/components/` — shared components; `src/components/ui/` for shadcn primitives
- `src/lib/` — utilities (activityLog, etc.)

## Routing

Uses `HashRouter` for GitHub Pages compatibility. Both English and Portuguese route aliases exist (e.g. `/inventory` and `/inventario` both work). The Vite `base` is `/CineGear/`.

## Path Alias

`@/` maps to `src/`.

## Storage Keys

Legacy keys use `cinegear_` prefix; current keys use `rentflow_` prefix. Both are migrated automatically on load.

## Demo Tenant

Tenant ID `TENANT-DEMO`, seeded with mock data. Default demo credentials are defined in `AuthContext.tsx`.
