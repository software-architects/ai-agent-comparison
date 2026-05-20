# Add Two Numbers — Requirements

A minimal demo application: a library that sums two numbers and renders a visualization of the addition, consumed by a single Next.js page. Two projects in one pnpm workspace.

---

## 1. Tech Stack

* **Package manager:** pnpm with pnpm workspaces (define in `pnpm-workspace.yaml`)
* **Language:** TypeScript with strict type checking (`strict: true`)
* **Lint + format:** Biome.js (no ESLint, no Prettier)
* **Type check:** `tsc --noEmit`
* **Unit + component tests:** Vitest (uses Vite under the hood), with `@testing-library/react` for component tests
* **End-to-end tests:** Playwright (web app only)
* **Web framework:** Next.js latest stable, App Router. Consult the `next-devtools` MCP server for current best practices before scaffolding.
* **Library docs lookups during implementation:** use `ctx7` (Context7), not training data
* **Dependency policy:** latest stable version of every package; `pnpm outdated` must report nothing out of date
* **Quality bar:** every step (`lint`, `format`, `typecheck`, `test`, `e2e`) must run warning-free and error-free

---

## 2. Workspace Layout

```
/                          repo root
  pnpm-workspace.yaml
  package.json             root scripts
  biome.json               shared Biome config
  tsconfig.base.json       shared strict TS config
  packages/
    lib/                   business logic + React component
  apps/
    web/                   Next.js app
```

Root `package.json` scripts:

| Script | Behavior |
|---|---|
| `pnpm lint` | Biome lint across the workspace |
| `pnpm format` | Biome format (write mode) across the workspace |
| `pnpm typecheck` | `tsc --noEmit` in every project |
| `pnpm test` | Vitest in `packages/lib` |
| `pnpm e2e` | Playwright in `apps/web` |
| `pnpm dev` | Next.js dev server in `apps/web` |

---

## 3. `packages/lib`

The library exports both the business logic and the React component. `apps/web` imports from this package only.

**Package name:** `@add-demo/lib`. `apps/web` declares the dependency as `"@add-demo/lib": "workspace:*"` in its `package.json` so pnpm resolves it through the workspace.

### Business logic

* `add(a: number, b: number): number` — returns `a + b`. Pure function, no surprises.

### React component

* `<AdditionVisualizer />` — a self-contained component with **no required props**.
* The component file must start with the `"use client"` directive — it uses `useState` and `onChange`, so under the Next.js App Router it must be a Client Component even though it lives in the shared library.
* Behavior:
  * Owns its own state for the two operands. Initial values: `0` and `0`.
  * Renders each operand inside a bordered box, where **the box itself is an editable `<input type="number">`** styled as a box (not a separate input + read-only box).
  * Renders a visible `+` between the two operand boxes.
  * Renders a visible `=` after the second operand box.
  * Renders a **read-only** result box showing the live sum.
  * The result is computed by calling the library's own `add` function — do **not** reimplement addition inline.
* **Accessible names (required, so tests can locate elements deterministically):**
  * First operand input: `aria-label="First operand"`
  * Second operand input: `aria-label="Second operand"`
  * Result box: `aria-label="Result"` (use `<output>` or a `<div role="status">` so it has an accessible role; or, if rendered as a disabled `<input>`, the same `aria-label` works)
* Visual structure (required): `[ a ] + [ b ] = [ result ]`. Exact CSS/styling is at the implementer's discretion, but the three boxes + `+` + `=` layout is mandatory.
* The component must update the result live as the user types in either operand box.
* Negative numbers and zero are supported.
* **Empty input behavior:** if the user clears an operand box, the input may visually display nothing, but the underlying state for that operand is `0` so the result remains a valid number (never `NaN`, never blank).

### Tests (Vitest)

**Unit tests for `add`:**

* `add(2, 3) === 5`
* `add(-2, 3) === 1`
* `add(0, 0) === 0`
* `add(-5, -5) === -10`

**Component tests for `<AdditionVisualizer />` (via `@testing-library/react`):**

Locate elements via their accessible names (`getByRole('spinbutton', { name: 'First operand' })`, `getByLabelText('Result')`, etc.) — do not rely on positional selectors or `data-testid`.

* Renders without throwing.
* Shows the initial state correctly (two operand boxes with `0`, a `+`, an `=`, and a result box showing `0`).
* Typing into the first operand box updates the result. Example: change first box to `7`, second box remains `0`, assert result shows `7`.
* Typing into the second operand box updates the result. Example: change second box to `5`, assert result becomes `7 + 5 = 12` (or whatever the combined value is).
* Handles negative numbers: change first box to `-3`, second to `5`, assert result shows `2`.
* Empty input: clear the first operand box, set the second to `4`, assert the result shows `4` (empty operand treated as `0`, never `NaN`).

---

## 4. `apps/web`

Next.js latest stable with the App Router. Biome-configured (no ESLint).

### Page

* Single route at `/`:
  * Heading: **"Add Two Numbers"**
  * Renders `<AdditionVisualizer />` (imported from `@add-demo/lib`) directly.
* No page-level state. No separate inputs above or below the visualizer. The page is essentially a heading and the component.

### Test (Playwright E2E)

* Open `/`.
* Locate the two operand inputs via their accessible names — `page.getByLabel('First operand')` and `page.getByLabel('Second operand')`.
* Type `7` into the first operand, `5` into the second.
* Assert `page.getByLabel('Result')` displays `12`.
* Change one of the operands (e.g. set the first to `10`) and assert the result updates to `15`.

---

## 5. Conventions

* **`apps/web` contains no math logic and no addition-related component code.** Both `add` and `<AdditionVisualizer />` live in `packages/lib` and are imported.
* **TypeScript:** shared `tsconfig.base.json` at the root with `"strict": true`. Each project has its own `tsconfig.json` that extends the base.
* **Biome:** shared `biome.json` at the root. Each project either uses the root config directly or extends it.
* **No unused dependencies.** No dead code. No commented-out code.

---

## 6. Acceptance Criteria

* `pnpm install` at the repo root succeeds with no warnings.
* `pnpm outdated` reports no out-of-date dependencies.
* `pnpm lint && pnpm format && pnpm typecheck && pnpm test && pnpm e2e` all succeed cleanly.
* `pnpm dev` serves `http://localhost:3000`. The page shows the "Add Two Numbers" heading and the visualizer. Typing into either operand box updates the result live.
* All Vitest unit tests for `add` pass.
* All Vitest component tests for `<AdditionVisualizer />` pass.
* The Playwright E2E test passes.
* `apps/web` contains zero references to addition logic — every `+` operator related to the demo is in `packages/lib`.
