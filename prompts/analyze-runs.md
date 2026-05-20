# Analyze opencode runs

I'm comparing how different AI coding agents implement the same prompt. Each run leaves an `opencode-export.json` transcript somewhere under `implementation/`. I'd like a script that reads all of them and produces one report comparing the runs.

Please write it in TypeScript and run it with `tsx`. Keep it simple — just the Node standard library. Put `analyze.ts`, `package.json` and `tsconfig.json` in the current folder and don't touch anything else in the repo.

The script should find every `opencode-export.json` under `implementation/`, ignoring `node_modules`. The repo root is the first parent folder that contains an `implementation/` directory — the script may be nested a few levels deep, so don't hardcode the path.

For each transcript, work out:

- the total duration (`info.time.updated - info.time.created`, in ms) and total tokens (`info.tokens`), and
- a per-tool breakdown of time and tokens.

Each tool call is a part with `type: "tool"` in `messages[].parts[]`, and its duration is `state.time.end - state.time.start`. Tokens aren't recorded per tool though — they're per step (`step-finish` parts carry `tokens.total`), so just split each step's tokens evenly across the tool calls in that step and mention in the report that it's an approximation.

Write a single Markdown report in the script's own folder that compares all the runs, with one section per implementation subfolder — a summary table up top (duration, tokens, cost per run), then the per-tool details for each. Don't write anything into the folders you're analyzing. Print a short summary to the console too.

After creating the script also run it.
