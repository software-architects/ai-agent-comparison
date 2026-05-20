# AI Coding Agent Comparison

A comparison of how different AI models (run via OpenRouter through opencode) implemented
three tasks. Each run left an `opencode-export.json` transcript plus its produced artifacts
under `implementation/<task>/<model>/`.

- **Date:** 2026-05-20
- **Tasks:** see [`prompts/`](prompts/)
  - `analyze-runs` — write a TypeScript/`tsx` script that summarizes opencode transcripts
  - `modify-jazz-chords-app` — write a **plan only** for adding named, saved configurations to an Angular app
  - `nextjs-app` — scaffold a pnpm-workspace Next.js skeleton (lib + web + console) meeting a strict quality bar
- **Models:** Mistral `devstral-2512`, Mistral `mistral-medium-3-5`, Moonshot `kimi-k2.6`,
  OpenAI `gpt-5.4-high`, `gpt-5.4-medium`, `gpt-5.5-high`, `gpt-5.5-low`, `gpt-5.5-medium`

Grades are A–F based on how completely and correctly each output meets its prompt's
requirements, judged from static inspection of the produced files (scripts/plans/code were
read, not executed).

---

## Coverage / completeness

| Model | analyze-runs | jazz plan | nextjs-app |
|---|:---:|:---:|:---:|
| mistral-devstral-2512 | ✅ | ✅ | ✅ |
| mistral-medium-3-5 | ✅ | ✅ | ✅ |
| moonshot-kimi-k2.6 | ✅ | ✅ | ✅ |
| openai-gpt-5.4-high | ✅ | ✅ * | ✅ |
| openai-gpt-5.4-medium | ✅ | ✅ * | ✅ |
| openai-gpt-5.5-high | ✅ | ✅ | ✅ |
| openai-gpt-5.5-low | ✅ | ✅ | ✅ |
| openai-gpt-5.5-medium | ✅ | ✅ | ✅ |

\* **Misfiled-then-corrected:** the gpt-5.4-high and gpt-5.4-medium jazz runs shared the
gpt-5.5-medium working directory and originally wrote their plans *into*
`openrouter-openai-gpt-5.5-medium/`. The transcripts confirm authorship
(`SAVE_NAMED_CONFIGURATIONS_PLAN.md` ← gpt-5.4-high; `NAMED_CONFIGURATIONS_IMPLEMENTATION_PLAN.md`
← gpt-5.4-medium). These have been moved to their correct folders. A consequence: gpt-5.5-medium
did **not** produce three competing plans — it produced exactly one
(`SAVED_CONFIGURATIONS_PLAN.md`); the other two were cross-contamination.

**All runs are now present** — every model has been run on all three tasks.

---

## Task 1 — `analyze-runs` (TypeScript script + Markdown report)

All 8 models produced a working `analyze.ts` (Node stdlib only) and a populated report.
**Notably, none hardcoded the repo root** — the anticipated common failure didn't happen; all
implemented a correct dynamic walk-up to the folder containing `implementation/`. The real
differentiators were the per-step token-split math and report quality.

| Model | Grade | Key findings |
|---|:---:|---|
| openai-gpt-5.4-high | **A** | Most rigorous: correct math + explicitly surfaces *unattributed* step tokens; forced `en-US` formatting; strong defensive guards. |
| openai-gpt-5.4-medium | **A** | Correct; robust recursive token sum handling nested token bags; clean `en-US` output. |
| openai-gpt-5.5-high | **A** | Richest per-run detail (input/output/cache breakdown, avg tool time, unassigned tokens); deps pinned to `"latest"`. |
| moonshot-kimi-k2.6 | **A-** | Correct math and the only report covering *all* runs grouped by subfolder; numbers use de-DE locale (`348.443` reads like a decimal). |
| openai-gpt-5.5-medium | **A-** | Cleanest step handling (resets on step-start *and* step-finish); best human-readable durations. |
| openai-gpt-5.5-low | **A-** | Concise, correct, well-formatted; no standout extras. |
| mistral-medium-3-5 | **B-** | Correct math + proper subfolder grouping, but bare/ambiguous cost formatting and a latent root-walk edge case. |
| mistral-devstral-2512 | **D** | Real algorithmic bug: each step's tokens are added to *every* tool in the run, so per-tool tokens exceed run totals (bash ≈ 978k vs. 288k total); also fabricates cost. |

> Note: the *number* of transcripts in each report differs because models ran at different
> times (more `opencode-export.json` files existed later in the day) — a timing artifact, not a
> discovery bug.

---

## Task 2 — `modify-jazz-chords-app` (PLAN only)

The ask was a single, detailed Markdown plan grounded in the real Angular repo — **not** an
implementation. Repo facts were verified: `PlayerComponent` persists six flat `localStorage`
keys; `mode` values `'R'`/`'WC'`/`'5'`/`'-5'` are stored as strings; the `Custom` exercise text
is separate; key ratings are nested in `KeysConfiguration`.

| Model | Grade | Key findings |
|---|:---:|---|
| openai-gpt-5.5-high | **A** | Single, deeply grounded plan; caught a real bug (`setCustomExercise()` doesn't persist); correct apply-ordering + SSR guard. |
| openai-gpt-5.4-high | **A** | Grounded (cites real keys, `configuration.ts`, `Custom`, `documentation.component.ts`); versioned single-envelope store; detailed apply ordering (stop playback → restore custom text → deep-copy keys), dirty-state, 4-row UI, tests. |
| moonshot-kimi-k2.6 | **A-** | Equally complete with the best ASCII UI mockups; only weak spot is a risky auto-save-into-preset default. |
| openai-gpt-5.4-medium | **A-** | Grounded; explicitly warns against the auto-save footgun (good judgment); two-key structure, migration, name-dialog, scope-boundary section. Minor: types `mode` as `…\|number` (loses string `5`/`-5`). |
| openai-gpt-5.5-low | **A-** | Among the most thorough: grounded in real methods/signals, single clean file, Goals/Non-Goals, detailed apply-ordering with fallbacks, edge cases (incl. quota), UX copy, non-destructive migration. Same `mode: …\|number` typing nit as gpt-5.4-medium. |
| openai-gpt-5.5-medium | **A-** | One clean, grounded plan: versioned store with `current` + `saved` + `activeSavedConfigurationId`, migration from legacy keys, deliberate explicit-load UX, full edge-case list. *(Revised up after the misfiling correction.)* |
| mistral-medium-3-5 | **C+** | Overstepped into near-complete implementation code; has a syntax-error method name (`save CurrentAsNew`) and stray untranslated Chinese text. |
| mistral-devstral-2512 | **C** | Correctly plan-only but thinnest data model (no versioning/active-id), no migration strategy, weak custom-exercise/load handling. |

---

## Task 3 — `nextjs-app` (pnpm-workspace skeleton — hardest task)

Required: pnpm workspace (`packages/lib`, `apps/web`, `apps/console`), TS strict, **Biome only**
(no ESLint/Prettier), **Vitest browser mode** for the React component test, Playwright e2e,
Next.js App Router, latest deps — and **zero addition logic in `apps/web`** (every `+` lives in
`packages/lib`). All 7 correctly kept the arithmetic in the lib. The big separators were Vitest
**browser mode** and how the lib is wired into the app.

| Model | Grade | ~Criteria | Key findings |
|---|:---:|:---:|---|
| openai-gpt-5.5-high | **A** | ~8/8 | Cleanest source-export + `transpilePackages` wiring; genuine browser component test; no committed build cruft. |
| openai-gpt-5.4-high | **A** | ~8/8 | Best logic separation (dedicated `visualization.ts` in lib); `vitest-browser-react` test; has an `outdated` script. |
| openai-gpt-5.4-medium | **A-** | ~8/8 | Complete; deliberate `minimumReleaseAgeExclude` to satisfy the "outdated" constraint; RTL `fireEvent` in browser mode is fine. |
| openai-gpt-5.5-medium | **A-** | ~8/8 | Clean; only nit is RTL deps hoisted from root rather than declared in `apps/web`. |
| openai-gpt-5.5-low | **A-** | ~7.5/8 | Correct browser mode + clean source-export/`transpilePackages` wiring; no `+` leak into `apps/web`; coherent Next 16 / React 19. Held back only by blanket `"latest"` specifiers and a couple of committed build artifacts (no `.gitignore`). |
| moonshot-kimi-k2.6 | **B+** | ~7/8 | Real browser tests (+ a console test), but lib exports compiled `dist` (build-order coupling, no `transpilePackages`) and commits dist artifacts; `lint` script mutates. |
| mistral-medium-3-5 | **C** | ~5/8 | Uses **jsdom**, not Vitest browser mode (hard-requirement miss); Next 16 + React 18 mismatch endangers install/typecheck/outdated. |
| mistral-devstral-2512 | **D** | ~3/8 | Multiple structural breaks: nested workspace inside `apps/web`, wrong `biome` package + v1 schema, no Playwright config, empty web devDeps, jsdom, dist-only lib with no `transpilePackages`. |

---

## Overall

**Per-task grades** (GPA: A=4.0, A-=3.7, B+=3.3, B-=2.7, C+=2.3, C=2.0, D=1.0):

| Model | analyze-runs | jazz plan | nextjs-app | Avg (delivered) |
|---|:---:|:---:|:---:|:---:|
| openai-gpt-5.5-high | A | A | A | **4.0** |
| openai-gpt-5.4-high | A | A | A | **4.0** |
| openai-gpt-5.4-medium | A | A- | A- | **3.8** |
| openai-gpt-5.5-medium | A- | A- | A- | **3.7** |
| openai-gpt-5.5-low | A- | A- | A- | **3.7** |
| moonshot-kimi-k2.6 | A- | A- | B+ | **3.57** |
| mistral-medium-3-5 | B- | C+ | C | **2.33** |
| mistral-devstral-2512 | D | C | D | **1.33** |

### Takeaways

1. **The OpenAI family dominates.** `gpt-5.5-high` and `gpt-5.4-high` are essentially flawless
   across all three tasks; `gpt-5.4-medium` and `gpt-5.5-medium` are close behind.
2. **`kimi-k2.6` is the strongest non-OpenAI model** — consistently good, the most complete
   analyze-runs report, and the best UI mockups in the jazz plan.
3. **Mistral models lag.** `mistral-medium-3-5` repeatedly misses hard requirements (jsdom vs.
   Vitest browser mode, overstepping "plan only") with polish issues; `devstral-2512` is the
   clear bottom, the only model with a real algorithmic bug (Task 1) and a structurally broken
   skeleton (Task 3).
4. **Cross-cutting style:** OpenAI runs forced `en-US` number formatting and used clean
   source-export/`transpilePackages` wiring; Mistral and Kimi relied on locale defaults and
   compiled-`dist` exports.

### Caveats

- Outputs were assessed by reading files, not by running `pnpm install/build/test/e2e` or
  executing the scripts. "~N/8 criteria" for nextjs-app is a static-analysis estimate.
- `gpt-5.4-high` / `gpt-5.4-medium` jazz plans were relocated from the gpt-5.5-medium folder
  (see Coverage note); attribution was confirmed from the transcripts.
- All 8 models have now been evaluated on all three tasks; no runs remain outstanding.
