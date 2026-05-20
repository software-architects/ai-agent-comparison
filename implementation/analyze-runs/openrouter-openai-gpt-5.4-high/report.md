# Opencode Run Comparison

Generated from 7 transcripts under `implementation/`.
Repo root: `C:/Users/KarinHuber/source/repos/ai-agent-comparison`.
Token totals are computed from `info.tokens` as `input + output + reasoning + cache.read + cache.write` because the export stores components instead of a top-level `total`.
Per-tool tokens are approximate: each `step-finish.tokens.total` is split evenly across the tool calls in that step, and tokens from steps without tool calls stay unattributed.

## Summary

| Implementation | Duration | Tokens | Cost |
| --- | ---: | ---: | ---: |
| analyze-runs/openrouter-mistralai-devstral-2512 | 348,443 ms | 1,019,395 | $0.164874 |
| analyze-runs/openrouter-mistralai-mistral-medium-3-5 | 649,939 ms | 2,755,813 | $3.9851 |
| analyze-runs/openrouter-moonshotai-kimi-k2.6 | 481,941 ms | 137,879 | $0.113972 |
| analyze-runs/openrouter-openai-gpt-5.5-high | 220,352 ms | 484,995 | $0.688873 |
| analyze-runs/openrouter-openai-gpt-5.5-medium | 113,960 ms | 174,199 | $0.440915 |
| nextjs-app/openrouter-openai-gpt-5.5-high | 873,000 ms | 2,054,374 | $2.8304 |
| nextjs-app/openrouter-openai-gpt-5.5-medium | 790,461 ms | 1,681,697 | $2.0231 |

## analyze-runs/openrouter-mistralai-devstral-2512

- Transcript: `implementation/analyze-runs/openrouter-mistralai-devstral-2512/opencode-export.json`
- Model: `mistralai/devstral-2512`
- Total duration: 348,443 ms
- Total tokens: 1,019,395
- Cost: $0.164874
- Total tool time: 1,478 ms
- Tool-attributed tokens: 978,234
- Unattributed step tokens: 41,161

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 12 | 780 ms | 221,193 |
| read | 13 | 346 ms | 347,756 |
| grep | 2 | 209 ms | 37,479 |
| edit | 11 | 77 ms | 298,451 |
| write | 4 | 66 ms | 73,355 |

## analyze-runs/openrouter-mistralai-mistral-medium-3-5

- Transcript: `implementation/analyze-runs/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`
- Model: `mistralai/mistral-medium-3-5`
- Total duration: 649,939 ms
- Total tokens: 2,755,813
- Cost: $3.9851
- Total tool time: 1,716 ms
- Tool-attributed tokens: 2,691,051
- Unattributed step tokens: 64,762

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 18 | 763 ms | 851,536.5 |
| read | 16 | 347 ms | 721,789 |
| glob | 2 | 282 ms | 10,254.5 |
| grep | 2 | 150 ms | 91,868 |
| write | 4 | 84 ms | 127,174 |
| edit | 14 | 68 ms | 740,480 |
| todowrite | 4 | 22 ms | 147,949 |

## analyze-runs/openrouter-moonshotai-kimi-k2.6

- Transcript: `implementation/analyze-runs/openrouter-moonshotai-kimi-k2.6/opencode-export.json`
- Model: `moonshotai/kimi-k2.6`
- Total duration: 481,941 ms
- Total tokens: 137,879
- Cost: $0.113972
- Total tool time: 350 ms
- Tool-attributed tokens: 115,254
- Unattributed step tokens: 22,625

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 5 | 168 ms | 56,708 |
| glob | 1 | 95 ms | 9,210 |
| write | 3 | 47 ms | 19,986 |
| read | 2 | 30 ms | 16,913.5 |
| todowrite | 2 | 10 ms | 12,436.5 |

## analyze-runs/openrouter-openai-gpt-5.5-high

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-high/opencode-export.json`
- Model: `openai/gpt-5.5 (high)`
- Total duration: 220,352 ms
- Total tokens: 484,995
- Cost: $0.688873
- Total tool time: 2,217 ms
- Tool-attributed tokens: 449,388
- Unattributed step tokens: 35,607

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| read | 8 | 826 ms | 155,906.5 |
| bash | 5 | 565 ms | 108,075.5 |
| grep | 3 | 490 ms | 15,745 |
| glob | 3 | 266 ms | 43,518 |
| apply_patch | 2 | 50 ms | 59,559 |
| todowrite | 3 | 20 ms | 66,584 |

## analyze-runs/openrouter-openai-gpt-5.5-medium

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-medium/opencode-export.json`
- Model: `openai/gpt-5.5 (medium)`
- Total duration: 113,960 ms
- Total tokens: 174,199
- Cost: $0.440915
- Total tool time: 472 ms
- Tool-attributed tokens: 154,292
- Unattributed step tokens: 19,907

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| read | 4 | 157 ms | 33,714.5 |
| grep | 1 | 96 ms | 11,420 |
| bash | 2 | 87 ms | 35,437 |
| glob | 2 | 87 ms | 12,861.5 |
| apply_patch | 1 | 28 ms | 16,306 |
| todowrite | 3 | 17 ms | 44,553 |

## nextjs-app/openrouter-openai-gpt-5.5-high

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-high/opencode-export.json`
- Model: `openai/gpt-5.5 (high)`
- Total duration: 873,000 ms
- Total tokens: 2,054,374
- Cost: $2.8304
- Total tool time: 17,947 ms
- Tool-attributed tokens: 2,054,374
- Unattributed step tokens: 0

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 32 | 16,341 ms | 986,132.67 |
| grep | 6 | 583 ms | 206,226 |
| glob | 5 | 458 ms | 68,875 |
| read | 17 | 270 ms | 386,398.33 |
| apply_patch | 8 | 186 ms | 272,802 |
| skill | 1 | 82 ms | 9,055 |
| todowrite | 5 | 27 ms | 124,885 |

## nextjs-app/openrouter-openai-gpt-5.5-medium

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-medium/opencode-export.json`
- Model: `openai/gpt-5.5 (medium)`
- Total duration: 790,461 ms
- Total tokens: 1,681,697
- Cost: $2.0231
- Total tool time: 13,176 ms
- Tool-attributed tokens: 1,636,204
- Unattributed step tokens: 45,493

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 30 | 11,868 ms | 889,940 |
| glob | 5 | 478 ms | 68,085 |
| grep | 2 | 390 ms | 72,003 |
| read | 11 | 186 ms | 295,691 |
| apply_patch | 6 | 163 ms | 187,794 |
| skill | 1 | 58 ms | 9,553 |
| todowrite | 5 | 33 ms | 113,138 |
