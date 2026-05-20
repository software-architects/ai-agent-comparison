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

## Executive summary

Across all three tasks, **OpenAI's models clearly led the field.** `gpt-5.5-high` and
`gpt-5.4-high` delivered essentially flawless work on every task (top grade throughout), with
`gpt-5.4-medium`, `gpt-5.5-medium`, and `gpt-5.5-low` close behind. **`kimi-k2.6` was the strongest
non-OpenAI model** — consistently solid and the most thorough on two of the three tasks. The
**Mistral models trailed**: `mistral-medium-3-5` repeatedly missed hard requirements, and
`devstral-2512` was the weakest overall, the only model to ship a genuinely broken result (an
algorithmic bug in one task and a non-functional project skeleton in another).

**Quality, speed, and cost did not move together**, which matters for tool selection. The
top-quality OpenAI runs were also among the fastest and most economical (≈$1.50–$4.60 of API spend
per model across all three tasks). By contrast, the lower-quality runs were often the expensive
ones: `mistral-medium-3-5` cost the most (\~$9.79) while finishing mid-pack on quality, and
`kimi-k2.6` spent \~74 minutes and 20M+ tokens on a single task. Cheapest is not safest either —
`devstral-2512` was the least expensive (\~$0.46) but produced the lowest-quality output.

**Bottom line:** for this style of work, the OpenAI `gpt-5.4`/`gpt-5.5` family offers the best
combination of quality, speed, and cost and is the recommended default; `kimi-k2.6` is a credible
alternative where an OpenAI model isn't available. One reliability caveat worth noting: even a
"working" deliverable can contain subtle correctness bugs (devstral's token-counting script ran
without errors but produced wrong numbers), so outputs still warrant review before they are
trusted.

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
| mistral-devstral-2512 | **D** | Two token defects (see note below): (1) per-tool bug — each step's tokens are added to *every* tool in the run, so per-tool tokens exceed run totals (bash ≈ 978k vs. 288k total); (2) total-tokens bug — sums only `input + output + reasoning` and **omits cache tokens**, so totals are far too low and disagree with all 7 other tools. Also fabricates cost. |

> Note: the *number* of transcripts in each report differs because models ran at different
> times (more `opencode-export.json` files existed later in the day) — a timing artifact, not a
> discovery bug.
>
> **Cross-report re-run (all 8 scripts re-executed against the same 24 transcripts, verified
> against ground truth computed from the raw JSON):**
> - **Duration, cost, per-tool call counts and per-tool time — all 8 agree exactly** (totals:
>   14,248,520 ms, $30.721942 over 24 runs). These are deterministic from `info.time`/`info.cost`.
> - **Total tokens — 7 of 8 agree at 44,517,614** (`info.tokens` summed *including* `cache.read`/
>   `cache.write`, which matches ground truth). **devstral is the lone outlier at 9,222,143**
>   because it excludes cache tokens. Example, run `analyze-runs/gpt-5.5-high`: seven reports say
>   **484,995**, devstral says **43,139** (= input+output+reasoning only).
> - **devstral's per-tool token column is also wrong** — it shows each tool with a near-total
>   figure (e.g. `bash 978,234`, `write 927,312`) that exceeds the run's own 288,419 total.
> - The root cause is `info.tokens` being a breakdown object rather than a scalar "total"; 7 tools
>   summed all components, devstral summed a subset. Cosmetic: kimi and devstral print de-DE-locale
>   numbers (`484.995`); mistral-medium prints no thousands separators.

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

---

## Measured run statistics

Measured directly from the 24 `opencode-export.json` transcripts (ground truth). Tokens include
cache reads/writes; durations from `info.time`, cost from `info.cost`. (devstral's own report
under-counts tokens — see the Task 1 note — but the figures below are the authoritative values.)
For the full per-tool breakdown of every run, see the gpt-5.4-high report:
[`implementation/analyze-runs/openrouter-openai-gpt-5.4-high/report.md`](implementation/analyze-runs/openrouter-openai-gpt-5.4-high/report.md).

### Per-run statistics

| Task | Model | Duration | Duration (ms) | Tokens | Tool calls | Cost (USD) |
|---|---|---:|---:|---:|---:|---:|
| analyze-runs | mistral-devstral-2512 | 5m 48s | 348,443 | 1,019,395 | 42 | $0.164874 |
| analyze-runs | mistral-medium-3-5 | 10m 49s | 649,939 | 2,755,813 | 60 | $3.985142 |
| analyze-runs | moonshot-kimi-k2.6 | 8m 01s | 481,941 | 137,879 | 13 | $0.113972 |
| analyze-runs | openai-gpt-5.4-high | 3m 09s | 189,467 | 231,852 | 13 | $0.272010 |
| analyze-runs | openai-gpt-5.4-medium | 2m 04s | 124,194 | 125,686 | 11 | $0.186514 |
| analyze-runs | openai-gpt-5.5-high | 3m 40s | 220,352 | 484,995 | 24 | $0.688873 |
| analyze-runs | openai-gpt-5.5-low | 4m 46s | 286,157 | 178,635 | 16 | $0.653188 |
| analyze-runs | openai-gpt-5.5-medium | 1m 53s | 113,960 | 174,199 | 13 | $0.440915 |
| modify-jazz-chords-app | mistral-devstral-2512 | 1m 42s | 102,223 | 214,321 | 10 | $0.064341 |
| modify-jazz-chords-app | mistral-medium-3-5 | 1m 10s | 70,353 | 160,462 | 12 | $0.274875 |
| modify-jazz-chords-app | moonshot-kimi-k2.6 | 3m 50s | 230,672 | 145,249 | 16 | $0.101804 |
| modify-jazz-chords-app | openai-gpt-5.4-high | 3m 50s | 230,713 | 439,944 | 33 | $0.413511 |
| modify-jazz-chords-app | openai-gpt-5.4-medium | 2m 31s | 151,348 | 320,430 | 25 | $0.287898 |
| modify-jazz-chords-app | openai-gpt-5.5-high | 7m 40s | 460,690 | 485,771 | 38 | $1.088018 |
| modify-jazz-chords-app | openai-gpt-5.5-low | 2m 30s | 150,453 | 324,086 | 29 | $0.560065 |
| modify-jazz-chords-app | openai-gpt-5.5-medium | 4m 04s | 244,415 | 412,263 | 36 | $0.907562 |
| nextjs-app | mistral-devstral-2512 | 10m 46s | 646,024 | 1,962,283 | 77 | $0.227189 |
| nextjs-app | mistral-medium-3-5 | 18m 17s | 1,097,676 | 3,870,884 | 101 | $5.532510 |
| nextjs-app | moonshot-kimi-k2.6 | 74m 00s | 4,440,289 | 20,583,152 | 235 | $5.508526 |
| nextjs-app | openai-gpt-5.4-high | 13m 19s | 799,010 | 2,297,831 | 61 | $1.232187 |
| nextjs-app | openai-gpt-5.4-medium | 11m 42s | 702,982 | 2,109,483 | 74 | $1.086570 |
| nextjs-app | openai-gpt-5.5-high | 14m 33s | 873,000 | 2,054,374 | 74 | $2.830410 |
| nextjs-app | openai-gpt-5.5-low | 14m 03s | 843,758 | 2,346,930 | 70 | $2.077880 |
| nextjs-app | openai-gpt-5.5-medium | 13m 10s | 790,461 | 1,681,697 | 60 | $2.023108 |
| **All (24)** | | **237m 28s** | **14,248,520** | **44,517,614** | **1,143** | **$30.721942** |

### Per-model totals (across all 3 tasks)

| Model | Duration | Tokens | Tool calls | Cost (USD) |
|---|---:|---:|---:|---:|
| mistral-devstral-2512 | 18m 16s | 3,195,999 | 129 | $0.456403 |
| mistral-medium-3-5 | 30m 17s | 6,787,159 | 173 | $9.792526 |
| moonshot-kimi-k2.6 | 85m 52s | 20,866,280 | 264 | $5.724302 |
| openai-gpt-5.4-high | 20m 19s | 2,969,627 | 107 | $1.917709 |
| openai-gpt-5.4-medium | 16m 18s | 2,555,599 | 110 | $1.560982 |
| openai-gpt-5.5-high | 25m 54s | 3,025,140 | 136 | $4.607301 |
| openai-gpt-5.5-low | 21m 20s | 2,849,651 | 115 | $3.291133 |
| openai-gpt-5.5-medium | 19m 08s | 2,268,159 | 109 | $3.371585 |

> kimi-k2.6's nextjs-app run is a major outlier — 74 min, 20.6M tokens, 235 tool calls — far above
> every other run. Note also that cost doesn't track tokens: devstral is the cheapest overall
> ($0.46) despite ~3.2M tokens, while mistral-medium-3-5 is the most expensive ($9.79).
