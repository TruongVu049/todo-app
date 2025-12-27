# Copilot / AI Agent Instructions — todo-list-app

Purpose: concise, action-oriented guidance so an AI agent is productive quickly in this repo.

Quick start

- Use Yarn (1.22+) and Node 20+.
- Common commands:
  - `yarn install`
  - `yarn dev` (Vite dev server on port 3000)
  - `yarn build` (runs `tsc` then `vite build`)
  - `yarn preview`
  - `yarn lint` (ESLint over `src`)
  - `yarn check-types` (TypeScript type check)

Key architectural points

- Single-page React app with Vite. Entry: `src/main.tsx` -> `src/app/index.tsx`.
- Routing: uses React Router v7 with lazy routes. See `src/app/router.tsx` — add routes via lazy imports to keep chunking.
- App-level providers: `src/app/provider.tsx` wraps app with Suspense fallback, `ErrorBoundary` and `Helmet`.
- Query layer: `@tanstack/react-query` QueryClient is provided at app root (`src/app/index.tsx`).

Conventions & patterns to follow

- Files under `src/components` follow a component-per-folder pattern (e.g. `components/ui/button`). Export entrypoints via index files where present.
- UI styling:
  - Tailwind (v4) + custom theme in `src/index.css`.
  - `cn()` util (`src/utils/cn.ts`) merges `clsx` + `tailwind-merge`.
  - Variant-driven styles use `class-variance-authority` (see `src/components/ui/button/button.tsx`).
- Forms: prefer `react-hook-form` + `zod` with `zodResolver` (see `src/components/ui/form/form.tsx`).
- Aliases: TypeScript paths map `@/*` -> `src/*` (`tsconfig.json`); Vite resolves them with `vite-tsconfig-paths`.

Environment & runtime notes

- Environment variables must use `VITE_APP_` prefix. `src/config/env.ts` reads and validates:
  - `VITE_APP_API_URL` (required)
  - `VITE_APP_ENABLE_API_MOCKING` (optional, 'true'|'false')
  - `VITE_APP_APP_URL` / `VITE_APP_APP_MOCK_API_PORT` (optional defaults)
- Missing/invalid env vars cause startup errors. When testing locally, prefer `VITE_APP_...` variables in `.env` files or your shell.

Build / CI gotchas

- `build` script runs `tsc` first; types must pass. Use `yarn check-types` to reproduce locally.
- Husky pre-commit hook (`.husky/pre-commit`) references `apps/*` subfolders from a monorepo template. This may be stale — adjust the hook to run `lint-staged` at repo root if it fails in this repo.
- `lint-staged` config runs `bash -c 'yarn check-types'` for staged TS changes — on Windows you may need Git Bash or adapt to a cross-platform invocation.

When adding work

- Update `src/app/router.tsx` using the lazy pattern for new routes.
- Add new env vars to `src/config/env.ts` if they are required by runtime; validate with zod and include defaults if possible.
- Keep UI primitives in `src/components/ui` and share utilities in `src/utils`.
- Run `yarn lint` and `yarn check-types` before committing.

Examples (explicit)

- Add a route: follow the lazy import used in `createAppRouter()` in `src/app/router.tsx`.
- Add a validated form: use `Form` from `src/components/ui/form/form.tsx` with a `zod` schema and `onSubmit` handler.

Todo module (Week 1 exercise) ✅

- Location: `src/features/todos`
- Key files:
  - `src/features/todos/api.ts` — thin wrapper over the REST API (uses `env.API_URL`, defaults to `https://dummyjson.com`).
  - `src/features/todos/hooks.ts` — TanStack Query hooks: `useTodos`, `useCreateTodo`, `useUpdateTodo`, `useDeleteTodo`. Hooks implement optimistic updates via `onMutate`/`onError`/`onSettled` and use `TODOS_QUERY_KEY = ['todos']`.
  - `src/features/todos/TodoContainer.tsx` — container that composes UI, shows loading/error/empty states and dialogs.
  - `src/features/todos/components/` — `TodoList`, `TodoItem`, `TodoForm`, `EmptyState`.
  - `src/app/routes/todos/page.tsx` — page entry wired into router (lazy loaded).
- Patterns & examples:
  - Use `TODOS_QUERY_KEY` for cache keys and `queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })` to refresh.
  - Prefer optimistic updates for snappy UX; see `hooks.ts` for examples of `onMutate` rollback handling.
  - Use existing UI primitives: `Dialog` + `ConfirmationDialog` for create/edit/delete flows and `Form` + `zod` for validated forms.
- Local dev note: `VITE_APP_API_URL` now defaults to `https://dummyjson.com` if not provided so `yarn dev` works out of the box.
  - To enable a local persistent mock (stores todos in browser localStorage), set `VITE_APP_ENABLE_API_MOCKING=true`. This intercepts `src/features/todos/api.ts` calls and uses a `localStorage`-backed mock so create/update/delete persist across reloads.

If something is unclear

- Ask for missing environment values or CI expectations.
- If a pre-commit hook fails because of the `apps/*` references, confirm whether this repo is a single-app or part of a monorepo and adjust `.husky/pre-commit` accordingly.

Notes for future AI edits

- Prefer minimal, scoped PRs that include `yarn check-types` and `yarn lint` outputs.
- When modifying build or CI hooks, add a short note in the PR explaining why (e.g., cross-platform fix for Windows).

---

If you'd like, I can open a PR with this file, or tweak any section — tell me what to change.
