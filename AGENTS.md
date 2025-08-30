# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable React components (PascalCase files).
- `src/lib`: Domain logic:
  - `agents/` (BaseAgent + concrete agents, registry)
  - `simulation/`, `auth/`, `email/`, `utils/`
  - `supabase/` (client, server helpers, `migrations*.sql`, `seed.ts`)
- `src/hooks`: React hooks (`useXxx` naming).
- `src/types`: Shared TypeScript types.
- `public/`: Static assets.
- `database/migrations`: SQL migrations for infra use.
- `playwright-mcp/`: Browser automation and E2E harness.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js locally on `http://localhost:1010`.
- `npm run build`: Production build.
- `npm start`: Serve the built app.
- `npm run lint`: ESLint (Next.js core-web-vitals).
- `npm run type-check`: TypeScript type checking.
- Setup/diagnostics (examples): `node setup-db.js`, `node test-auth-simple.js`.
- Playwright: `npm test` (or `npm run test:headed`, `npm run test:ui`) runs the suite in `playwright-mcp/`.

## Coding Style & Naming Conventions
- TypeScript, 2-space indent, no semicolons, single quotes, width 100.
- Prettier: see `.prettierrc` (Tailwind class sorting via `prettier-plugin-tailwindcss`).
- ESLint: Next.js presets in `eslint.config.mjs`.
- Components/files: React components in `PascalCase.tsx`; hooks `useXxx.ts`; utilities `camelCase.ts`.
- TailwindCSS via PostCSS (`postcss.config.mjs`). Prefer utility-first styles.

## Testing Guidelines
- No Jest suite yet. Use Node-based scripts in repo root (e.g., `node test-authentication-now.js`).
- E2E/automation lives in `playwright-mcp/` (`tests/` + `playwright.config.ts`).
- Name ad-hoc scripts `test-*.js` and keep them idempotent; place screenshots/artifacts under a `test-results/` folder.

## Commit & Pull Request Guidelines
- Commit messages: imperative, concise subject (≤72 chars). Example: `Fix artifact loading error in dashboard`.
- PRs: describe what/why, link issues, include UI screenshots for visual changes, and list any schema/migration steps.
- Required checks: run `npm run lint` and `npm run type-check`; include relevant updates to README/GETTING_STARTED if behavior changes.

## Security & Configuration Tips
- Use `.env.local` for secrets; never commit credentials. See `MCP_SETUP.md` and `EMAIL_SETUP.md`.
- Supabase: review `src/lib/supabase/*` and `database/migrations` before changing schemas; run setup via `node setup-db.js` when needed.
