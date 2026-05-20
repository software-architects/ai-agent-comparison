# OpenCode Runs Report

Generated: 2026-05-20T09:24:10.802Z

Tool token counts are approximate. OpenCode records tokens per step, not per tool call, so each step's `tokens.total` was split evenly across the tool calls in that step.

## Summary

| Run | Duration (ms) | Tokens | Cost |
| --- | ---: | ---: | ---: |
| analyze-runs/openrouter-mistralai-devstral-2512 | 348,443 | 1,019,395 | $0.164874 |
| analyze-runs/openrouter-mistralai-mistral-medium-3-5 | 649,939 | 2,755,813 | $3.985142 |
| analyze-runs/openrouter-moonshotai-kimi-k2.6 | 481,941 | 137,879 | $0.113972 |
| analyze-runs/openrouter-openai-gpt-5.5-high | 220,352 | 484,995 | $0.688873 |
| analyze-runs/openrouter-openai-gpt-5.5-medium | 113,960 | 174,199 | $0.440915 |
| nextjs-app/openrouter-openai-gpt-5.5-high | 873,000 | 2,054,374 | $2.83041 |
| nextjs-app/openrouter-openai-gpt-5.5-medium | 790,461 | 1,681,697 | $2.023108 |

## analyze-runs/openrouter-mistralai-devstral-2512

Transcript: `implementation/analyze-runs/openrouter-mistralai-devstral-2512/opencode-export.json`

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 12 | 780 | 221,193 |
| read | 13 | 346 | 347,756 |
| grep | 2 | 209 | 37,479 |
| edit | 11 | 77 | 298,451 |
| write | 4 | 66 | 73,355 |

## analyze-runs/openrouter-mistralai-mistral-medium-3-5

Transcript: `implementation/analyze-runs/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 18 | 763 | 851,537 |
| read | 16 | 347 | 721,789 |
| glob | 2 | 282 | 10,255 |
| grep | 2 | 150 | 91,868 |
| write | 4 | 84 | 127,174 |
| edit | 14 | 68 | 740,480 |
| todowrite | 4 | 22 | 147,949 |

## analyze-runs/openrouter-moonshotai-kimi-k2.6

Transcript: `implementation/analyze-runs/openrouter-moonshotai-kimi-k2.6/opencode-export.json`

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 5 | 168 | 56,708 |
| glob | 1 | 95 | 9,210 |
| write | 3 | 47 | 19,986 |
| read | 2 | 30 | 16,914 |
| todowrite | 2 | 10 | 12,437 |

## analyze-runs/openrouter-openai-gpt-5.5-high

Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-high/opencode-export.json`

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| read | 8 | 826 | 155,907 |
| bash | 5 | 565 | 108,076 |
| grep | 3 | 490 | 15,745 |
| glob | 3 | 266 | 43,518 |
| apply_patch | 2 | 50 | 59,559 |
| todowrite | 3 | 20 | 66,584 |

## analyze-runs/openrouter-openai-gpt-5.5-medium

Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-medium/opencode-export.json`

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| read | 4 | 157 | 33,715 |
| grep | 1 | 96 | 11,420 |
| glob | 2 | 87 | 12,862 |
| bash | 2 | 87 | 35,437 |
| apply_patch | 1 | 28 | 16,306 |
| todowrite | 3 | 17 | 44,553 |

## nextjs-app/openrouter-openai-gpt-5.5-high

Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-high/opencode-export.json`

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 32 | 16,341 | 986,133 |
| grep | 6 | 583 | 206,226 |
| glob | 5 | 458 | 68,875 |
| read | 17 | 270 | 386,398 |
| apply_patch | 8 | 186 | 272,802 |
| skill | 1 | 82 | 9,055 |
| todowrite | 5 | 27 | 124,885 |

## nextjs-app/openrouter-openai-gpt-5.5-medium

Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-medium/opencode-export.json`

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 30 | 11,868 | 889,940 |
| glob | 5 | 478 | 68,085 |
| grep | 2 | 390 | 72,003 |
| read | 11 | 186 | 295,691 |
| apply_patch | 6 | 163 | 187,794 |
| skill | 1 | 58 | 9,553 |
| todowrite | 5 | 33 | 113,138 |
