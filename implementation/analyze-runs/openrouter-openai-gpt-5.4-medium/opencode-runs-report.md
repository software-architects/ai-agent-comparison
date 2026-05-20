# Opencode Run Comparison

Generated: 2026-05-20T09:27:29.856Z
Repo root: `C:/Users/KarinHuber/source/repos/ai-agent-comparison`
Scanned: `implementation`

Notes:
- Run token totals are calculated by summing all numeric values in `info.tokens`, since the export stores a breakdown rather than a single scalar total.
- Per-tool token counts are approximate: each `step-finish.tokens.total` value is split evenly across the tool calls that occurred in that step.
- `node_modules` directories are skipped while scanning.

## Summary

| Run | Duration (ms) | Tokens | Cost |
| --- | ---: | ---: | ---: |
| analyze-runs/openrouter-mistralai-devstral-2512 | 348,443 | 1,019,395 | $0.164874 |
| analyze-runs/openrouter-mistralai-mistral-medium-3-5 | 649,939 | 2,755,813 | $3.985142 |
| analyze-runs/openrouter-moonshotai-kimi-k2.6 | 481,941 | 137,879 | $0.113972 |
| analyze-runs/openrouter-openai-gpt-5.4-high | 189,467 | 231,852 | $0.272010 |
| analyze-runs/openrouter-openai-gpt-5.5-high | 220,352 | 484,995 | $0.688873 |
| analyze-runs/openrouter-openai-gpt-5.5-low | 286,157 | 178,635 | $0.653188 |
| analyze-runs/openrouter-openai-gpt-5.5-medium | 113,960 | 174,199 | $0.440915 |
| nextjs-app/openrouter-mistralai-mistral-medium-3-5 | 1,097,676 | 3,870,884 | $5.532510 |
| nextjs-app/openrouter-openai-gpt-5.5-high | 873,000 | 2,054,374 | $2.830410 |
| nextjs-app/openrouter-openai-gpt-5.5-medium | 790,461 | 1,681,697 | $2.023108 |

## analyze-runs/openrouter-mistralai-devstral-2512

- Transcript: `implementation/analyze-runs/openrouter-mistralai-devstral-2512/opencode-export.json`
- Model: `openrouter / mistralai/devstral-2512 / default`
- Duration: 348,443 ms
- Total tokens: 1,019,395
- Cost: $0.164874
- Tool calls: 42

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 12 | 780 | 221,193 |
| read | 13 | 346 | 347,756 |
| grep | 2 | 209 | 37,479 |
| edit | 11 | 77 | 298,451 |
| write | 4 | 66 | 73,355 |

## analyze-runs/openrouter-mistralai-mistral-medium-3-5

- Transcript: `implementation/analyze-runs/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`
- Model: `openrouter / mistralai/mistral-medium-3-5 / default`
- Duration: 649,939 ms
- Total tokens: 2,755,813
- Cost: $3.985142
- Tool calls: 60

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 18 | 763 | 851,536.50 |
| read | 16 | 347 | 721,789 |
| glob | 2 | 282 | 10,254.50 |
| grep | 2 | 150 | 91,868 |
| write | 4 | 84 | 127,174 |
| edit | 14 | 68 | 740,480 |
| todowrite | 4 | 22 | 147,949 |

## analyze-runs/openrouter-moonshotai-kimi-k2.6

- Transcript: `implementation/analyze-runs/openrouter-moonshotai-kimi-k2.6/opencode-export.json`
- Model: `openrouter / moonshotai/kimi-k2.6 / default`
- Duration: 481,941 ms
- Total tokens: 137,879
- Cost: $0.113972
- Tool calls: 13

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 5 | 168 | 56,708 |
| glob | 1 | 95 | 9,210 |
| write | 3 | 47 | 19,986 |
| read | 2 | 30 | 16,913.50 |
| todowrite | 2 | 10 | 12,436.50 |

## analyze-runs/openrouter-openai-gpt-5.4-high

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.4-high/opencode-export.json`
- Model: `openrouter / openai/gpt-5.4 / high`
- Duration: 189,467 ms
- Total tokens: 231,852
- Cost: $0.272010
- Tool calls: 13

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 2 | 178 | 52,155 |
| read | 5 | 176 | 38,617.50 |
| glob | 1 | 88 | 4,483.50 |
| apply_patch | 2 | 40 | 51,592 |
| todowrite | 3 | 28 | 56,458 |

## analyze-runs/openrouter-openai-gpt-5.5-high

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-high/opencode-export.json`
- Model: `openrouter / openai/gpt-5.5 / high`
- Duration: 220,352 ms
- Total tokens: 484,995
- Cost: $0.688873
- Tool calls: 24

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| read | 8 | 826 | 155,906.50 |
| bash | 5 | 565 | 108,075.50 |
| grep | 3 | 490 | 15,745 |
| glob | 3 | 266 | 43,518 |
| apply_patch | 2 | 50 | 59,559 |
| todowrite | 3 | 20 | 66,584 |

## analyze-runs/openrouter-openai-gpt-5.5-low

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-low/opencode-export.json`
- Model: `openrouter / openai/gpt-5.5 / low`
- Duration: 286,157 ms
- Total tokens: 178,635
- Cost: $0.653188
- Tool calls: 16

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| glob | 4 | 456 | 21,535.67 |
| read | 5 | 232 | 29,183.33 |
| grep | 2 | 226 | 12,219 |
| bash | 1 | 59 | 19,151 |
| apply_patch | 1 | 19 | 18,496 |
| todowrite | 3 | 18 | 56,271 |

## analyze-runs/openrouter-openai-gpt-5.5-medium

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-medium/opencode-export.json`
- Model: `openrouter / openai/gpt-5.5 / medium`
- Duration: 113,960 ms
- Total tokens: 174,199
- Cost: $0.440915
- Tool calls: 13

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| read | 4 | 157 | 33,714.50 |
| grep | 1 | 96 | 11,420 |
| bash | 2 | 87 | 35,437 |
| glob | 2 | 87 | 12,861.50 |
| apply_patch | 1 | 28 | 16,306 |
| todowrite | 3 | 17 | 44,553 |

## nextjs-app/openrouter-mistralai-mistral-medium-3-5

- Transcript: `implementation/nextjs-app/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`
- Model: `openrouter / mistralai/mistral-medium-3-5 / default`
- Duration: 1,097,676 ms
- Total tokens: 3,870,884
- Cost: $5.532510
- Tool calls: 101

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 50 | 16,151 | 2,174,643 |
| write | 29 | 351 | 696,686 |
| read | 8 | 166 | 393,997 |
| skill | 1 | 83 | 18,017 |
| edit | 11 | 54 | 566,142 |
| todowrite | 2 | 11 | 21,399 |

## nextjs-app/openrouter-openai-gpt-5.5-high

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-high/opencode-export.json`
- Model: `openrouter / openai/gpt-5.5 / high`
- Duration: 873,000 ms
- Total tokens: 2,054,374
- Cost: $2.830410
- Tool calls: 74

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 32 | 16,341 | 986,132.67 |
| grep | 6 | 583 | 206,226 |
| glob | 5 | 458 | 68,875 |
| read | 17 | 270 | 386,398.33 |
| apply_patch | 8 | 186 | 272,802 |
| skill | 1 | 82 | 9,055 |
| todowrite | 5 | 27 | 124,885 |

## nextjs-app/openrouter-openai-gpt-5.5-medium

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-medium/opencode-export.json`
- Model: `openrouter / openai/gpt-5.5 / medium`
- Duration: 790,461 ms
- Total tokens: 1,681,697
- Cost: $2.023108
- Tool calls: 60

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 30 | 11,868 | 889,940 |
| glob | 5 | 478 | 68,085 |
| grep | 2 | 390 | 72,003 |
| read | 11 | 186 | 295,691 |
| apply_patch | 6 | 163 | 187,794 |
| skill | 1 | 58 | 9,553 |
| todowrite | 5 | 33 | 113,138 |
