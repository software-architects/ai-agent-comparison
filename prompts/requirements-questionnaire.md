# Questionnaire Application — Requirements

A desktop web application and CLI for creating, versioning, and answering questionnaires. Anonymous answer submission. Three projects in one pnpm workspace: a library (business logic + data access), a Next.js 16 web app, and a Commander.js CLI.

This document is the single source of truth for implementation. It is organized as a reference spec, not in execution order — but the suggested build order is: §1 → §2 → §3 → §4 → §5 → §6 → §7 → §8.

---

## 0. Conventions

### `AGENTS.md`

Create `AGENTS.md` at the repo root. It is the conventions file for AI coding agents and humans alike. It must contain:

* **Quality Assurance steps** — the canonical sequence to run after any change, in this order:
  1. `pnpm lint` (Biome lint)
  2. `pnpm format` (Biome format, write mode)
  3. `pnpm typecheck` (tsc --noEmit across all projects)
  4. `pnpm test` (Vitest across all projects)
  5. `pnpm e2e` (Playwright against the web app)
* **Spelling rule** — the correct spelling is **`questionnaire`** (two n's). Use it consistently in all identifiers, table names, file names, env var defaults, and prose. The earlier draft of these requirements used `questionaire` — that typo is fixed throughout this spec.
* **Pointer to `docs/project-architecture.md`** (see §3) with a note: *this documentation must be updated whenever there are significant changes to project structure or architecture; document only non-obvious things, never things that are self-evident from the code.*
* **Pointer to this requirements file** (`prompts/requirements.md`).

Every section below that says "follow the QA steps in AGENTS.md" means: run the five commands above and fix anything they report.

---

## 1. Workspace & Project Structure

### Tooling

* **Package manager:** pnpm (use `pnpm` for all scripts, not `npm` or `yarn`)
* **Workspace manager:** pnpm workspaces (define in `pnpm-workspace.yaml`)
* **TypeScript** with strict type checking (`strict: true`)
* **Biome.js** for linting and formatting (no ESLint, no Prettier)
* **`tsc`** for type checking
* **Vitest** for unit and integration testing
* **Playwright** for end-to-end testing (web app only)
* **Font Awesome** free icons
* Use the **latest stable version** of every dependency. Verify with `pnpm outdated` after install.

### Layout

```
/                          repo root
  pnpm-workspace.yaml
  package.json             root scripts (lint, format, typecheck, test, e2e, dev, cli)
  biome.json               shared Biome config
  tsconfig.base.json       shared strict TS config
  AGENTS.md
  docs/
    project-architecture.md
  prompts/
    requirements.md        (this file)
  packages/
    lib/                   business logic + data access (no UI)
  apps/
    web/                   Next.js 16 app (App Router)
    cli/                   Commander.js console app
  data/                    SQLite DB file lives here by default (gitignored)
```

Root `package.json` scripts (pnpm-recursive where applicable):

| Script | Behavior |
|---|---|
| `pnpm lint` | Biome lint across the workspace |
| `pnpm format` | Biome format (write mode) across the workspace |
| `pnpm typecheck` | `tsc --noEmit` in every project |
| `pnpm test` | Vitest, recursively across `packages/lib`, `apps/web`, and `apps/cli`. |
| `pnpm e2e` | Playwright in `apps/web` |
| `pnpm dev` | Next.js dev server in `apps/web` |
| `pnpm cli -- <args>` | Run the CLI in `apps/cli` |
| `pnpm db:generate` | Drizzle migration generation (see §2) |
| `pnpm db:migrate` | Apply migrations to the configured SQLite file |
| `pnpm db:seed` | Seed the configured SQLite file with the demo questionnaires defined in §2 |

### `packages/lib`

* Exports business logic and the data access layer. **All Drizzle code, schema, migrations, and DB-touching functions live here — never in `apps/web` or `apps/cli`.**
* Exported surface is defined by §2 (`getDb`, `createTestDb`, `getDbStatus`) and §4 (questionnaire DAL functions and error classes).

### `apps/web`

* Next.js 16 with the App Router. Consult the `next-devtools` MCP server for current Next.js 16 best practices before scaffolding.
* Configured with Biome (no ESLint).
* Home page (`app/page.tsx`) is a **Server Component** that displays:
  * "Questionnaire App" as the page heading
  * The result of `getDbStatus()` (see §2) — e.g. "DB status: 42" — as a small diagnostic line
* Disable Font Awesome's auto CSS injection and import the styles in the root layout to prevent the icon flash on load.
* Vitest is configured here for unit tests covering Server Actions and any form/helper utilities (mock the DAL, or use `createTestDb()` from `packages/lib` for tests that need real DB behavior).
* Add a Playwright E2E test for the home page that asserts the heading and the "DB status: 42" text are both present.

### `apps/cli`

* Commander.js CLI implementing the commands defined in §7.
* Vitest is configured here for unit tests covering command handlers — argument parsing, JSON file input, DAL invocation, stdout/stderr formatting, exit codes. Mock the DAL, or use `createTestDb()` from `packages/lib` for tests that need real DB behavior.

### Acceptance Criteria

* `pnpm install` succeeds at the repo root with no errors.
* `pnpm outdated` reports no out-of-date dependencies.
* `pnpm lint && pnpm format && pnpm typecheck && pnpm test && pnpm e2e` all succeed.
* `pnpm cli -- ping` prints the DB health-check result.
* `pnpm dev` serves the "Questionnaire App" heading + DB status page on `http://localhost:3000`.

---

## 2. Database Infrastructure (Drizzle + SQLite)

This section sets up the database plumbing. The actual domain schema is defined in §4.

### Driver & Configuration

* **Drizzle ORM** with **`better-sqlite3`** as the driver.
* DB file location is configurable via environment, read in this precedence order: process env > `.env.local` (dev only) > defaults.
  * `DB_FOLDER` — absolute path to the folder containing the DB file. Default: `<repo-root>/data`.
  * `DB_NAME` — DB file name. Default: `questionnaire.db`.
* The `data/` folder and any `*.db` files must be in `.gitignore`.
* In-memory mode for tests: when `DB_NAME` is `:memory:`, use SQLite's in-memory engine. All integration tests use this mode.

### Migrations

* Drizzle migration files live in `packages/lib/drizzle/migrations`.
* `pnpm db:generate` generates a new migration from the current schema.
* `pnpm db:migrate` applies all pending migrations to the configured DB file (creating it if missing).
* `getDb()` (see below) applies pending migrations automatically on first call in development. In production, migrations are applied only via `pnpm db:migrate`. Tests do not use `getDb()` — they use `createTestDb()`, which handles schema setup independently.

### Seed Data

A `pnpm db:seed` script in `packages/lib` populates the configured SQLite file with two demo questionnaires using the `createQuestionnaire` DAL function (see §4). Intended to be run once after `pnpm db:migrate` on a fresh DB so the app has something to show on first launch.

**Behavior:** The script first counts existing questionnaires (including soft-deleted). If the count is non-zero, it prints `DB already contains questionnaires — skipping seed.` and exits 0. Otherwise it inserts the two demo questionnaires below and prints a one-line summary (`Seeded 2 questionnaires.`).

**Demo questionnaires:**

1. **"Pineapple on Pizza: A National Inquiry"** — 6 questions
   1. Boolean, required — *"Pineapple belongs on pizza."*
   2. Likert 1–5, required — *"How strongly do you feel about your answer?"* (low: *"I could go either way"*, high: *"I would die on this hill"*)
   3. Text, required — *"In one sentence, defend your position."*
   4. Likert 1–7, optional — *"Rate your tolerance for other unconventional toppings (anchovies, jalapeños on mango, etc.)."* (low: *"purist"*, high: *"send me the weirdest pizza you have"*)
   5. Boolean, optional — *"Have you ever lied to a friend about liking their pizza choice?"*
   6. Text, optional — *"What pizza topping would you ban if you could ban one?"*

2. **"Standup Survival Survey"** — 6 questions
   1. Boolean, required — *"Did you actually do what you said you'd do yesterday?"*
   2. Likert 1–5, required — *"How awake were you during this standup?"* (low: *"still asleep"*, high: *"dangerously caffeinated"*)
   3. Text, required — *"In 10 words or fewer, what blocked you today (excuses accepted)."*
   4. Boolean, optional — *"Did anyone say 'circle back' or 'sync offline'?"*
   5. Likert 1–4, optional — *"Rate this meeting's necessity."* (low: *"could've been an email"*, high: *"vital to civilization"*)
   6. Text, optional — *"Suggest a better time slot, but make it petty."*

Together these two seeds exercise Likert upper bounds of 4, 5, and 7 — useful coverage for visually verifying that the configurable Likert widget renders correctly across the supported range.

### Data Access Layer — exported from `packages/lib`

| Function | Signature | Behavior |
|---|---|---|
| `getDb()` | `() => DrizzleDatabase` | Returns a Drizzle client bound to the configured SQLite file. Singleton per process in dev/prod. Not intended for tests — use `createTestDb()` instead. |
| `createTestDb()` | `() => DrizzleDatabase` | Returns a **fresh** in-memory Drizzle client with the schema applied (via Drizzle `push` or by running migrations against `:memory:`). Independent of the singleton. Intended to be called in Vitest `beforeEach` / `beforeAll` so each test (or test file) gets isolated state. |
| `getDbStatus()` | `() => Promise<{ result: number }>` | Executes `SELECT 42 AS result`. Health-check probe. Operates on whichever client is active (singleton or test). |

(The questionnaire CRUD functions are defined in §4.)

### Web Integration

* `app/page.tsx` (Server Component) calls `getDbStatus()` and renders the result. No client-side fetching.

### Test Coverage

* Vitest integration test in `packages/lib` exercising `getDbStatus()` against an in-memory DB.

### Acceptance Criteria

* `pnpm db:generate` produces a migration file when the schema changes.
* `pnpm db:migrate` creates `data/questionnaire.db` and applies all migrations.
* `pnpm db:seed` on a fresh DB inserts the two demo questionnaires; re-running it on a non-empty DB exits cleanly without duplicating data.
* Home page shows "DB status: 42".
* Playwright E2E asserts the DB status text on the home page.

---

## 3. Project Documentation

* Create `docs/project-architecture.md` (and the `docs/` folder if missing).
* Document only **non-obvious** facts — things that would cost a future agent at least one tool call to discover. Examples worth documenting: the in-memory DB convention, the migration auto-apply behavior, the Server Component vs Server Action split, the JSON file formats consumed by the CLI.
* Do **not** document things that are self-evident from the code (file structure, function signatures already in TypeScript, framework defaults).
* `AGENTS.md` must reference this file and remind the agent to update it on significant structural changes.

---

## 4. Questionnaire Domain — Schema, DAL, Validation

This is the core domain model.

### Domain Rules

* A **questionnaire** has a title and a list of **questions**.
* Question types:
  * `text` — free-form string answer
  * `boolean` — yes/no answer
  * `likert` — integer scale answer, starting at 1
    * Configurable `upperBound` (inclusive), constrained to `3 ≤ upperBound ≤ 10`
    * Configurable string labels for the lowest value (`lowLabel`, e.g. "not at all familiar") and the highest value (`highLabel`, e.g. "expert")
* Each question's answer is either **required** or **optional**.
* Questionnaires are **versioned**. Editing a questionnaire always creates a new version with the full question list replaced — no partial updates. The version number is a 1-based integer that monotonically increases per questionnaire.
* Deletion is **soft delete**: a `deleted_at` timestamp is set on the questionnaire row. Soft-deleted questionnaires are excluded from default list/get queries; they can be retrieved explicitly via an `includeDeleted` flag. Their versions and answers are preserved for history. New answer submissions to a soft-deleted questionnaire are rejected.
* **Submitting answers** posts the full answer set for a specific version in one operation. The set is validated atomically: either every answer is accepted and persisted, or the whole submission is rejected.
* Submissions are **anonymous** — no user identity, no auth. Each submission has only `submitted_at` and a link to the version it answered.

### Schema (SQLite via Drizzle)

```
questionnaire
  id                INTEGER PK AUTOINCREMENT
  title             TEXT NOT NULL
  created_at        INTEGER NOT NULL                  (unix ms)
  deleted_at        INTEGER NULL                      (unix ms; NULL = active)

questionnaire_version
  id                INTEGER PK AUTOINCREMENT
  questionnaire_id  INTEGER NOT NULL FK → questionnaire(id)
  version_number    INTEGER NOT NULL                  (1-based, per-questionnaire)
  created_at        INTEGER NOT NULL
  UNIQUE(questionnaire_id, version_number)

question
  id                INTEGER PK AUTOINCREMENT
  version_id        INTEGER NOT NULL FK → questionnaire_version(id)
  order_index       INTEGER NOT NULL                  (0-based ordering within a version)
  type              TEXT NOT NULL                     ('text' | 'boolean' | 'likert')
  text              TEXT NOT NULL
  required          INTEGER NOT NULL                  (0 or 1)
  likert_upper_bound INTEGER NULL                     (required when type='likert')
  likert_low_label  TEXT NULL                         (required when type='likert')
  likert_high_label TEXT NULL                         (required when type='likert')
  UNIQUE(version_id, order_index)

answer_submission
  id                INTEGER PK AUTOINCREMENT
  version_id        INTEGER NOT NULL FK → questionnaire_version(id)
  submitted_at      INTEGER NOT NULL

answer
  id                INTEGER PK AUTOINCREMENT
  submission_id     INTEGER NOT NULL FK → answer_submission(id)
  question_id       INTEGER NOT NULL FK → question(id)
  value_text        TEXT NULL
  value_boolean     INTEGER NULL                      (0 or 1)
  value_int         INTEGER NULL
  UNIQUE(submission_id, question_id)
```

Cross-column invariants enforced in application code (SQLite CHECK is awkward for these):

* For each question: if `type = 'likert'`, all three `likert_*` columns are non-null; otherwise all three are null.
* For each answer: exactly one of `value_text` / `value_boolean` / `value_int` is non-null, matching the question's type.

### TypeScript Types

```ts
export type QuestionInput =
  | { type: 'text';    text: string; required: boolean }
  | { type: 'boolean'; text: string; required: boolean }
  | { type: 'likert';  text: string; required: boolean;
      upperBound: number; lowLabel: string; highLabel: string };

export type AnswerInput =
  | { questionId: number; type: 'text';    value: string }
  | { questionId: number; type: 'boolean'; value: boolean }
  | { questionId: number; type: 'likert';  value: number };

export type QuestionnaireSummary = {
  id: number; title: string;
  currentVersionNumber: number;
  createdAt: number; deletedAt: number | null;
};

export type QuestionnaireWithQuestions = QuestionnaireSummary & {
  versionId: number;
  versionNumber: number;
  questions: (QuestionInput & { id: number; orderIndex: number })[];
};

export type AnswerSubmissionWithAnswers = {
  id: number; versionId: number; versionNumber: number;
  submittedAt: number;
  answers: (AnswerInput & { id: number })[];
};
```

### Data Access Layer — exported from `packages/lib`

| Function | Signature | Notes |
|---|---|---|
| `createQuestionnaire` | `(input: { title: string; questions: QuestionInput[] }) => Promise<{ id: number; versionId: number; versionNumber: 1 }>` | Creates the questionnaire row + version 1 + its questions in one transaction. `questions` must be non-empty. |
| `updateQuestionnaire` | `(id: number, input: { title?: string; questions: QuestionInput[] }) => Promise<{ versionId: number; versionNumber: number }>` | Creates a new version (`previous + 1`) with the new question list. Optionally updates the title. Throws `QuestionnaireDeletedError` if the questionnaire is soft-deleted; throws `QuestionnaireNotFoundError` if `id` does not exist. |
| `softDeleteQuestionnaire` | `(id: number) => Promise<void>` | Sets `deleted_at = now`. Idempotent (re-deletion is a no-op). |
| `listQuestionnaires` | `(opts?: { includeDeleted?: boolean }) => Promise<QuestionnaireSummary[]>` | Excludes deleted by default. Returns the latest version number for each. Ordered by `created_at` desc. |
| `getQuestionnaire` | `(id: number, opts?: { versionNumber?: number; includeDeleted?: boolean }) => Promise<QuestionnaireWithQuestions \| null>` | Returns the latest version by default, or the requested `versionNumber` if specified. Returns `null` if the questionnaire does not exist, is deleted and `includeDeleted` is false, or the requested `versionNumber` does not exist for this questionnaire. |
| `submitAnswers` | `(versionId: number, answers: AnswerInput[]) => Promise<{ submissionId: number }>` | Validates (see below), then persists submission + answers in one transaction. Throws one of the typed errors in the validation table, including `VersionNotFoundError` if `versionId` does not exist and `QuestionnaireDeletedError` if the underlying questionnaire is soft-deleted. |
| `listAnswerSubmissions` | `(questionnaireId: number) => Promise<AnswerSubmissionWithAnswers[]>` | Returns all submissions across all versions of this questionnaire, ordered by `submitted_at` asc. Each submission carries its `versionNumber` so callers can group by version. Soft-deleted questionnaires still return their historical submissions (data is preserved); returns `[]` if `questionnaireId` does not exist. |

### `submitAnswers` Validation Rules

Validation runs before any writes. On the first failure, throw a typed error and abort — no partial persistence.

| Condition | Error |
|---|---|
| `versionId` does not exist | `VersionNotFoundError` |
| Underlying questionnaire is soft-deleted | `QuestionnaireDeletedError` |
| An answer's `questionId` is not part of this version | `UnknownQuestionError` |
| Two answers share the same `questionId` | `DuplicateAnswerError` |
| Answer `type` does not match the question's `type` | `TypeMismatchError` |
| Likert `value` is not an integer in `[1, upperBound]` | `LikertOutOfRangeError` |
| A `required` question has no answer (or has a `text` answer with empty/whitespace-only string) | `MissingRequiredAnswerError` |

Optional questions with no submitted answer are allowed (no row is written).

Validation error classes specific to `submitAnswers` (`UnknownQuestionError`, `DuplicateAnswerError`, `TypeMismatchError`, `LikertOutOfRangeError`, `MissingRequiredAnswerError`, `VersionNotFoundError`) extend a common `SubmitAnswersError` base. `QuestionnaireDeletedError` and `QuestionnaireNotFoundError` are shared across `submitAnswers` and `updateQuestionnaire` and extend a separate `QuestionnaireError` base — define them once and reuse. All error classes carry enough context (question id, version id, etc.) to be rendered usefully by the web and CLI.

### Test Scenario (Vitest, in-memory SQLite)

Cover the scenario from the original prompt plus the listed failure cases.

**Happy path:**

1. `createQuestionnaire("Customer Feedback Q2", [Text required, Boolean required, Likert(1–4) required, Text optional, Boolean optional])` — assert version 1 is created with all 5 questions.
2. `updateQuestionnaire(id, { questions: [<5 existing, tweaked text>, Boolean optional] })` — assert version 2 is created with 6 questions and `versionNumber === 2`.
3. `submitAnswers(version1Id, <5 answers covering all required>)` — assert success.
4. `submitAnswers(version2Id, <6 answers>)` — assert success.
5. `listAnswerSubmissions(id)` — assert both submissions are returned, ordered by `submitted_at`, with correct `versionNumber` on each.

**Failure cases (each is a separate test):**

* Missing required answer → `MissingRequiredAnswerError`
* Required text answer present but empty/whitespace → `MissingRequiredAnswerError`
* Answer for an unknown `questionId` → `UnknownQuestionError`
* Two answers for the same `questionId` → `DuplicateAnswerError`
* `text` answer submitted for a `boolean` question → `TypeMismatchError`
* Likert value `0`, `upperBound + 1`, or non-integer → `LikertOutOfRangeError`
* Submitting to a non-existent `versionId` → `VersionNotFoundError`
* Submitting to a version of a soft-deleted questionnaire → `QuestionnaireDeletedError`
* `updateQuestionnaire` on a soft-deleted questionnaire → `QuestionnaireDeletedError`
* `createQuestionnaire` with empty `questions` array → throws (assertion-style error is fine, no need for a typed class)
* `createQuestionnaire` with a likert question whose `upperBound < 3` or `> 10` → throws

### Acceptance Criteria

* Schema migrations generated and applied.
* All DAL functions exported from `packages/lib` with the signatures above.
* All happy-path and failure-case tests pass.
* QA steps in AGENTS.md all green.

---

## 5. UI Shell

The visual chrome that hosts all pages in §6. Read the `frontend-design` skill for guidelines.

### Layout

* **Desktop only.** No responsive breakpoints, no hamburger menu, no mobile-specific layouts.
* **Content area** max width `1280px`, centered horizontally.
* **Top navigation bar** — full width, single level, no dropdowns, no nested menus.
* Nav links (active route is visually distinct via color, underline, or background):
  * "Questionnaires" → `/questionnaires` — icon `faClipboardList`
  * "About" → `/about` — icon `faCircleInfo` (the About page may be a static placeholder)
* Subtle bottom border or shadow under the nav to separate it from content.

### Visual Design

* Pick a professional, modern color theme — explicitly **not** the Next.js default purple/black. Use a coherent palette (one primary, one accent, neutrals).
* Define the palette as CSS custom properties in global styles so it can be tweaked in one place.
* Use a clean sans-serif Google Font (e.g. Inter, Manrope, IBM Plex Sans). Import via the standard Next.js font helper (`next/font/google`).

### Acceptance Criteria

* Nav renders on every page with the correct active state.
* Playwright smoke test: visit `/`, `/questionnaires`, `/about`; assert nav is present and the active link matches the route.
* QA steps in AGENTS.md all green.

---

## 6. UI Pages (Web App)

All read operations use **Server Components** calling DAL functions directly. All write operations use **Server Actions** that wrap DAL functions and handle redirect/revalidate. No client-side data fetching, no global state library.

For forms with dynamic question lists (`/questionnaires/new`, `/questionnaires/[id]/edit`, `/questionnaires/[id]/take`), use a Client Component for the interactive form widget; submission goes through a Server Action.

**No authentication.** All routes are publicly accessible — this is a demo. Anyone can create, edit, and soft-delete questionnaires; submissions carry no submitter identity. Do not add auth gates, admin tokens, or env-var flags around the CRUD routes.

### Routes

| Route | Type | Description |
|---|---|---|
| `/` | Server Component | "Questionnaire App" heading + DB status line (from §1/§2). |
| `/about` | Server Component | Static placeholder ("About this app"). |
| `/questionnaires` | Server Component | Table: title, current version number, created date, number of submissions, actions (View / Edit / Take / Delete). Calls `listQuestionnaires()`. Excludes deleted. |
| `/questionnaires/new` | Server Component shell + Client form | Form to create a questionnaire: title input, dynamic list of questions (add/remove, reorder up/down, pick type, set required, configure Likert fields). Submits to a Server Action that calls `createQuestionnaire()` and redirects to `/questionnaires/[id]`. |
| `/questionnaires/[id]` | Server Component | View page: title, current version number, list of questions (read-only). Buttons: "Take this questionnaire", "Edit", "View submissions", "Delete". `getQuestionnaire(id)`. |
| `/questionnaires/[id]/edit` | Server Component shell + Client form | Same form widget as `new`, prefilled from the latest version. On submit, calls `updateQuestionnaire(id, ...)` → creates a new version → redirects to `/questionnaires/[id]`. |
| `/questionnaires/[id]/take` | Server Component shell + Client form | Renders one input per question of the **latest** version (with proper widget per type: `<textarea>` for text, radio yes/no for boolean, radio scale 1..N with low/high labels for Likert). Required questions are marked visually. Submits to a Server Action that calls `submitAnswers(latestVersionId, ...)` and redirects to a "Thanks for your submission" confirmation. Server-side validation errors are surfaced inline. |
| `/questionnaires/[id]/submissions` | Server Component | List of all submissions for this questionnaire (across all versions), each expandable to show the answers grouped by question. `listAnswerSubmissions(id)`. |

### Delete

"Delete" on the list page or detail page calls a Server Action wrapping `softDeleteQuestionnaire(id)`. Show a confirm dialog (`window.confirm` is fine — no custom modal required). After delete, redirect to `/questionnaires`.

### Acceptance Criteria

* All seven routes render.
* Create, edit, delete, and submit flows all work end-to-end against a real SQLite file.
* Playwright E2E covering: create → take → list submissions for one questionnaire.
* QA steps in AGENTS.md all green.

---

## 7. CLI Commands

Commander.js CLI in `apps/cli`. All commands that return data write **JSON to stdout** so they're easy to pipe. Errors go to stderr; exit code 0 on success, 1 on failure.

| Command | Arguments | Behavior |
|---|---|---|
| `ping` | — | Calls `getDbStatus()`. Prints `OK: 42` to stdout. |
| `list-questionnaires` | `[--include-deleted]` | Calls `listQuestionnaires`. Prints JSON array of `QuestionnaireSummary`. |
| `get-questionnaire` | `<id> [--version N]` | Calls `getQuestionnaire`. Prints JSON of `QuestionnaireWithQuestions` (or exits 1 if not found). |
| `create-questionnaire` | `--file <path>` | Reads a JSON file matching `{ title: string; questions: QuestionInput[] }`, calls `createQuestionnaire`, prints the result JSON. |
| `update-questionnaire` | `<id> --file <path>` | Reads a JSON file matching `{ title?: string; questions: QuestionInput[] }`, calls `updateQuestionnaire`, prints the result JSON. |
| `delete-questionnaire` | `<id>` | Calls `softDeleteQuestionnaire`. Prints `OK`. |
| `submit-answers` | `<questionnaire-id> --file <path>` | Looks up the latest version of the questionnaire, reads a JSON file `{ answers: AnswerInput[] }`, calls `submitAnswers(latestVersionId, answers)`, prints `{ submissionId }`. Errors from validation are printed to stderr with a clear message and exit code 1. |
| `list-answers` | `<questionnaire-id>` | Calls `listAnswerSubmissions`. Prints JSON array of `AnswerSubmissionWithAnswers`. |

Invocation:

```
pnpm cli -- ping
pnpm cli -- list-questionnaires
pnpm cli -- create-questionnaire --file ./examples/customer-feedback.json
pnpm cli -- submit-answers 1 --file ./examples/answers.json
```

### Skill File

Add a skill at `./.agents/skills/questionnaire-cli/SKILL.md`:

* **Name:** `questionnaire-cli`
* **Description:** "Use this skill to interact with the Questionnaire CLI."
* Document how to invoke the CLI with `pnpm` and list every command above with an example command line.
* Include an example JSON file for `create-questionnaire` and one for `submit-answers`.

### Acceptance Criteria

* All commands listed above work end-to-end against a real SQLite file.
* `pnpm cli -- ping` returns `OK: 42`.
* Skill file exists and matches the actual command surface.

---

## 8. Cross-Cutting Acceptance Criteria

* `AGENTS.md` exists and documents the QA steps, the spelling rule, and the doc pointers.
* `docs/project-architecture.md` exists and covers only non-obvious facts.
* `pnpm install`, `pnpm outdated`, `pnpm lint`, `pnpm format`, `pnpm typecheck`, `pnpm test`, `pnpm e2e` all succeed cleanly.
* No file uses the misspelling `questionaire`. All identifiers use `questionnaire`.
* `apps/web` and `apps/cli` contain **zero** Drizzle imports and **zero** direct SQLite access — all DB work goes through `packages/lib`.
* The web app's home page shows "DB status: 42" and the Playwright suite proves it.
* The full questionnaire lifecycle (create → take → list submissions) works both via the UI and via the CLI.
