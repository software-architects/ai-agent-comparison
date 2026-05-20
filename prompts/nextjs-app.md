# Next.js Application Skeleton

I am building a Next.js application consisting of shared logic, APIs and UI. You task is to setup the application skeleton. We do not add any logic yet, just demo logic to check plumbing (e.g. build, lint, tests, etc.). So let's start with a minimal application: a library that sums two numbers and renders a visualization of the addition, consumed by a single Next.js page. Two projects in one pnpm workspace.

## Tech Stack

- **Package manager:** pnpm with pnpm workspaces, add scripts for common project related tasks like linting, testing, starting, etc.
- **Language:** TypeScript with strict type checking
- **Lint + format:** Biome.js (no ESLint, no Prettier)
- **Type check with tsc**
- **Unit + component tests:** Vitest with Vitest browser for React component tests
- **End-to-end tests:** Playwright (web app only)
- **Web framework:** Next.js latest stable, App Router. Consult the `next-devtools` MCP server for current best practices before scaffolding.
- **Library docs lookups during implementation:** use `ctx7` (Context7), not training data
- **Dependency policy:** latest stable version of every package; `pnpm outdated` must report nothing out of date
- **Quality bar:** every step (`lint`, `format`, `typecheck`, `test`, `e2e`) must run warning-free and error-free

## Workspace Layout

- Put business logic (without any UI aspects) into `packages/lib`
- Put web app into `apps/web`
- Put console app into `apps/console`

## Functional requirements

- In the lib, add a `math` module with a test `add` function that adds two numbers
  - Add a unit test for the function to see if vitest works
- In the console app, reference the lib, call `add` and print result to see if using shared logic works
- In the web app, add a single React client component where the user can enter two numbers and `add` is used to calculate result
  - Add a component test to see if vitest React component tests work in the browser
  - Add an e2e test with Playwright to see if e2e works

## Acceptance Criteria

- `pnpm install` at the repo root succeeds with no warnings.
- `pnpm outdated` reports no out-of-date dependencies.
- `pnpm lint && pnpm format && pnpm typecheck && pnpm test && pnpm e2e` all succeed cleanly.
- `pnpm dev` serves `http://localhost:3000`. The page shows the "Add Two Numbers" heading and the visualizer. Typing into either operand box updates the result live.
- All Vitest unit tests for `add` pass.
- All Vitest component tests for `<AdditionVisualizer />` pass.
- The Playwright E2E test passes.
- `apps/web` contains zero references to addition logic — every `+` operator related to the demo is in `packages/lib`.
