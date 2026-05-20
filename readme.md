# ai-comparison

A workspace for comparing how different AI coding agents implement the same requirements. Each run gets a folder under `implementation\<prompt>\<name>\`, generated non-interactively by `opencode` from a prompt doc in `prompts\` (e.g. `prompts\nextjs-app.md`).

## Repo layout

```
prompts\          The prompt docs handed to each model (one .md per prompt)
implementation\   Output, grouped as <prompt>\<model> per run
scripts\          Automation
  execute-prompt.ps1
```

## Prerequisites

- **Windows PowerShell 5.1+** (Windows 11 default works — no `pwsh` install needed)
- **opencode CLI** on `PATH` (https://opencode.ai). The script auto-discovers the underlying `.exe` even if `Get-Command` resolves to a `.ps1` or `.cmd` shim
- Whatever providers `opencode` is configured against (OpenRouter, direct Anthropic/OpenAI keys, etc.) — list yours with `opencode models`

## `scripts\execute-prompt.ps1`

Runs `opencode` non-interactively against a prompt doc in `prompts\` inside a per-model folder, hard-caps spend at a EUR budget by streaming the JSON event log and killing the process when the cap is hit, then exports the full session transcript as JSON. The prompt file is chosen with `-Prompt`, which also names the `implementation\<prompt>\` group the output lands in.

### Quick start

```powershell
cd C:\Users\KarinHuber\source\repos\ai-comparison

# Pick a small/cheap model and a tiny cap to verify the kill path
.\scripts\execute-prompt.ps1 `
    -Model openrouter/anthropic/claude-haiku-4.5 `
    -Prompt nextjs-app `
    -MaxCostEur 0.05 `
    -FolderName _test-cost-kill

# Real run for the comparison
.\scripts\execute-prompt.ps1 -Model openrouter/openai/gpt-5.5            -Prompt nextjs-app
.\scripts\execute-prompt.ps1 -Model openrouter/anthropic/claude-opus-4.7 -Prompt nextjs-app

# Crank up the model's reasoning effort (provider-specific values)
.\scripts\execute-prompt.ps1 `
    -Model openrouter/anthropic/claude-opus-4.7 `
    -Prompt nextjs-app `
    -ReasoningEffort high `
    -FolderName claude-opus-4.7-high
```

### Parameters

| Parameter                               | Type   | Default                           | Purpose                                                                                                                                                                                        |
| --------------------------------------- | ------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-Model` _(required)_                   | string | —                                 | The full opencode model spec, e.g. `openrouter/openai/gpt-5.5`. Passed verbatim to `opencode run --model`. Find valid values with `opencode models`.                                           |
| `-Prompt` _(required)_                  | string | —                                 | Base name of the prompt doc in `prompts\`, e.g. `nextjs-app` for `prompts\nextjs-app.md` (a trailing `.md` is tolerated). Also names the `implementation\<prompt>\` group the output lands in. |
| `-FolderName`                           | string | derived from `-Model` (`/` → `-`) | Sub-folder under `implementation\<prompt>\` to create. Override to keep short names like `gpt-5.5` instead of `openrouter-openai-gpt-5.5`.                                                     |
| `-MaxCostEur`                           | double | `5`                               | Hard cap. The opencode process is killed the moment cumulative spend reaches this many EUR.                                                                                                    |
| `-UsdPerEur`                            | double | `1.10`                            | USD→EUR conversion factor. opencode reports cost in USD; we convert for the cap. Adjust when the rate drifts noticeably.                                                                       |
| `-ReasoningEffort` _(alias `-Variant`)_ | string | _(unset)_                         | Forwarded to `opencode run --variant`. Selects a provider-specific reasoning-effort variant of the model. See [Reasoning effort](#reasoning-effort--variant) below.                            |
| `-Force`                                | switch | off                               | Required to re-run into a non-empty existing folder. Without it, the script refuses to overwrite.                                                                                              |

### What it produces

```
implementation\<Prompt>\<FolderName>\
  ...                          everything opencode scaffolded
  opencode-export.json         full session transcript (messages, tool calls, costs)
```

### How the cost cap works

opencode has no native budget flag. The script runs `opencode run --format json`, which emits one JSON event per line. For each `step_finish` event it sums `part.cost` (USD). When the cumulative total reaches `MaxCostEur × UsdPerEur`, the script calls `taskkill /F /T /PID <pid>` to kill the opencode process tree, then proceeds to export.

Caveats:

- The cap is checked **between** steps, so the actual final cost can overshoot a little — by however much the in-flight step costs at the moment we receive its `step_finish`.
- The USD→EUR rate is a static parameter. If you care about EUR precision, override `-UsdPerEur` with the day's rate.
- A run that's killed for cost still produces a valid `opencode-export.json` and exits `0` (the cap was respected — that's a successful outcome).

### Reasoning effort / `--variant`

When `-ReasoningEffort` (alias `-Variant`) is supplied, the script appends `--variant <value>` to the underlying `opencode run` call. From `opencode run --help`:

> `--variant` model variant (provider-specific reasoning effort, e.g., **high**, **max**, **minimal**)

Accepted values are **provider-specific** — opencode forwards the string to the provider as-is, so the model itself decides what's valid. Common values in practice:

| Provider                             | Typical values                            |
| ------------------------------------ | ----------------------------------------- |
| Anthropic (Claude extended thinking) | `minimal`, `low`, `medium`, `high`, `max` |
| OpenAI (o-series / GPT-5 reasoning)  | `minimal`, `low`, `medium`, `high`        |
| Google (Gemini thinking)             | `low`, `medium`, `high`                   |

If the provider rejects the value you pass, opencode surfaces the upstream error — run again with `--print-logs` (or check `opencode-export.json`) for the full message. Omit `-ReasoningEffort` entirely to let opencode use the model's default.

### Finding the right `-Model` value

opencode addresses models as `provider/model`. The provider prefix depends on how _your_ opencode is configured. For an OpenRouter-based install, models look like `openrouter/anthropic/claude-opus-4.7`. List everything yours knows about:

```powershell
opencode models
opencode models | Select-String 'gpt-5'        # filter
opencode models | Select-String 'claude-opus'
```

If you pass a model opencode can't resolve, it prints an `UnknownError` with a "Did you mean…" hint — copy the suggested form into `-Model` and re-run.

### Exit codes

| Code     | Meaning                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------- |
| `0`      | Clean completion, or killed for cost (still considered success)                                 |
| `0`      | Run produced no session ID (something failed before the first event) — script warns and exits 0 |
| non-zero | `opencode run` itself exited non-zero for a non-cost reason                                     |

## Troubleshooting

**`'pwsh' is not recognized`**
The script no longer requires `pwsh`. Use plain `powershell` or just `.\scripts\execute-prompt.ps1`.

**`'.\scripts\execute-prompt.ps1' is not recognized`**
Your shell isn't in the repo root. Either `cd C:\Users\KarinHuber\source\repos\ai-comparison` first or invoke with an absolute path.

**`...cannot be loaded because running scripts is disabled on this system`**
Execution policy is blocking. Either set policy once with `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, or bypass per-run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\execute-prompt.ps1 -Model openrouter/openai/gpt-5.5 -Prompt nextjs-app
```

**`The specified executable is not a valid application for this OS platform`**
This was the error when `Get-Command opencode` returned a `.ps1` shim. The current script auto-resolves to the real `.exe` (parsing the npm `.cmd` shim if needed) and falls back to `cmd /s /c` wrapping. If you still see this, paste the output of `(Get-Command opencode -All).Source` so the resolver can be extended.

**`Model not found: <x>` or `Model not found: <x>/.`**
You passed a model identifier that doesn't exist in your opencode provider config. Run `opencode models` and copy a valid full identifier (including the provider prefix) into `-Model`.

**Run finished with no `opencode-export.json`**
The script only exports if it captured a `sessionID` from the event stream. If opencode failed before emitting any event (e.g. provider auth failure), there's no session to export — check the stderr output above the summary block for the underlying cause.
