# Opencode Run Analysis

Generated: 2026-05-20T08:52:09.903Z

Tool token counts are approximate. Opencode records tokens per step, not per tool call, so this report splits each step's `step-finish.tokens.total` evenly across the tool calls in that step.

## Summary

| Run | Duration | Duration (ms) | Tokens | Cost |
| --- | ---: | ---: | ---: | ---: |
| analyze-runs/openrouter-openai-gpt-5.5-high | 3m 40s | 220,352 | 484,995 | $0.6889 |
| analyze-runs/openrouter-openai-gpt-5.5-medium | 1m 54s | 113,960 | 174,199 | $0.4409 |
| nextjs-app/openrouter-openai-gpt-5.5-high | 14m 33s | 873,000 | 2,054,374 | $2.8304 |
| nextjs-app/openrouter-openai-gpt-5.5-medium | 13m 10s | 790,461 | 1,681,697 | $2.0231 |

## analyze-runs/openrouter-openai-gpt-5.5-high

Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-high/opencode-export.json`

Duration: 3m 40s (220,352 ms)

Tokens: 484,995

Cost: $0.6889

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| read | 8 | 826 ms | 826 | 155,907 |
| bash | 5 | 565 ms | 565 | 108,076 |
| grep | 3 | 490 ms | 490 | 15,745 |
| glob | 3 | 266 ms | 266 | 43,518 |
| apply_patch | 2 | 50 ms | 50 | 59,559 |
| todowrite | 3 | 20 ms | 20 | 66,584 |

## analyze-runs/openrouter-openai-gpt-5.5-medium

Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-medium/opencode-export.json`

Duration: 1m 54s (113,960 ms)

Tokens: 174,199

Cost: $0.4409

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| read | 4 | 157 ms | 157 | 33,715 |
| grep | 1 | 96 ms | 96 | 11,420 |
| bash | 2 | 87 ms | 87 | 35,437 |
| glob | 2 | 87 ms | 87 | 12,862 |
| apply_patch | 1 | 28 ms | 28 | 16,306 |
| todowrite | 3 | 17 ms | 17 | 44,553 |

## nextjs-app/openrouter-openai-gpt-5.5-high

Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-high/opencode-export.json`

Duration: 14m 33s (873,000 ms)

Tokens: 2,054,374

Cost: $2.8304

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 32 | 16s | 16,341 | 986,133 |
| grep | 6 | 583 ms | 583 | 206,226 |
| glob | 5 | 458 ms | 458 | 68,875 |
| read | 17 | 270 ms | 270 | 386,398 |
| apply_patch | 8 | 186 ms | 186 | 272,802 |
| skill | 1 | 82 ms | 82 | 9,055 |
| todowrite | 5 | 27 ms | 27 | 124,885 |

## nextjs-app/openrouter-openai-gpt-5.5-medium

Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-medium/opencode-export.json`

Duration: 13m 10s (790,461 ms)

Tokens: 1,681,697

Cost: $2.0231

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 30 | 12s | 11,868 | 889,940 |
| glob | 5 | 478 ms | 478 | 68,085 |
| grep | 2 | 390 ms | 390 | 72,003 |
| read | 11 | 186 ms | 186 | 295,691 |
| apply_patch | 6 | 163 ms | 163 | 187,794 |
| skill | 1 | 58 ms | 58 | 9,553 |
| todowrite | 5 | 33 ms | 33 | 113,138 |
