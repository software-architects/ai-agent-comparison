# Opencode Run Comparison

Generated: 2026-05-20T12:15:55.188Z
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
| analyze-runs/openrouter-openai-gpt-5.4-medium | 124,194 | 125,686 | $0.186514 |
| analyze-runs/openrouter-openai-gpt-5.5-high | 220,352 | 484,995 | $0.688873 |
| analyze-runs/openrouter-openai-gpt-5.5-low | 286,157 | 178,635 | $0.653188 |
| analyze-runs/openrouter-openai-gpt-5.5-medium | 113,960 | 174,199 | $0.440915 |
| modify-jazz-chords-app/openrouter-mistralai-devstral-2512 | 102,223 | 214,321 | $0.064341 |
| modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5 | 70,353 | 160,462 | $0.274875 |
| modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6 | 230,672 | 145,249 | $0.101804 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.4-high | 230,713 | 439,944 | $0.413511 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium | 151,348 | 320,430 | $0.287898 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.5-high | 460,690 | 485,771 | $1.088018 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.5-low | 150,453 | 324,086 | $0.560065 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium | 244,415 | 412,263 | $0.907562 |
| nextjs-app/openrouter-mistralai-devstral-2512 | 646,024 | 1,962,283 | $0.227189 |
| nextjs-app/openrouter-mistralai-mistral-medium-3-5 | 1,097,676 | 3,870,884 | $5.532510 |
| nextjs-app/openrouter-moonshotai-kimi-k2.6 | 4,440,289 | 20,583,152 | $5.508526 |
| nextjs-app/openrouter-openai-gpt-5.4-high | 799,010 | 2,297,831 | $1.232187 |
| nextjs-app/openrouter-openai-gpt-5.4-medium | 702,982 | 2,109,483 | $1.086570 |
| nextjs-app/openrouter-openai-gpt-5.5-high | 873,000 | 2,054,374 | $2.830410 |
| nextjs-app/openrouter-openai-gpt-5.5-low | 843,758 | 2,346,930 | $2.077880 |
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

## analyze-runs/openrouter-openai-gpt-5.4-medium

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.4-medium/opencode-export.json`
- Model: `openrouter / openai/gpt-5.4 / medium`
- Duration: 124,194 ms
- Total tokens: 125,686
- Cost: $0.186514
- Tool calls: 11

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| glob | 1 | 214 | 2,956.67 |
| bash | 2 | 91 | 21,998.67 |
| grep | 1 | 75 | 4,778 |
| read | 3 | 55 | 17,404.17 |
| apply_patch | 1 | 35 | 18,575 |
| todowrite | 3 | 18 | 37,061.50 |

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

## modify-jazz-chords-app/openrouter-mistralai-devstral-2512

- Transcript: `implementation/modify-jazz-chords-app/openrouter-mistralai-devstral-2512/opencode-export.json`
- Model: `openrouter / mistralai/devstral-2512 / default`
- Duration: 102,223 ms
- Total tokens: 214,321
- Cost: $0.064341
- Tool calls: 10

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 1 | 1,954 | 9,716 |
| read | 6 | 222 | 119,384 |
| glob | 2 | 200 | 26,432 |
| write | 1 | 15 | 29,379 |

## modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5

- Transcript: `implementation/modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`
- Model: `openrouter / mistralai/mistral-medium-3-5 / default`
- Duration: 70,353 ms
- Total tokens: 160,462
- Cost: $0.274875
- Tool calls: 12

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 1 | 1,419 | 9,817 |
| read | 9 | 454 | 78,112 |
| glob | 1 | 86 | 9,915 |
| write | 1 | 23 | 31,199 |

## modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6

- Transcript: `implementation/modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6/opencode-export.json`
- Model: `openrouter / moonshotai/kimi-k2.6 / default`
- Duration: 230,672 ms
- Total tokens: 145,249
- Cost: $0.101804
- Tool calls: 16

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| read | 10 | 270 | 37,887.67 |
| glob | 2 | 194 | 10,306 |
| skill | 1 | 85 | 24,696 |
| bash | 2 | 36 | 11,609.33 |
| write | 1 | 13 | 30,188 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.4-high

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-high/opencode-export.json`
- Model: `openrouter / openai/gpt-5.4 / high`
- Duration: 230,713 ms
- Total tokens: 439,944
- Cost: $0.413511
- Tool calls: 33

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| read | 21 | 695 | 156,255.33 |
| glob | 3 | 322 | 8,793 |
| grep | 2 | 237 | 14,468.67 |
| skill | 2 | 145 | 16,985 |
| todowrite | 4 | 27 | 145,982 |
| apply_patch | 1 | 22 | 46,777 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium/opencode-export.json`
- Model: `openrouter / openai/gpt-5.4 / medium`
- Duration: 151,348 ms
- Total tokens: 320,430
- Cost: $0.287898
- Tool calls: 25

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| read | 15 | 549 | 125,392.83 |
| grep | 3 | 408 | 19,950.67 |
| glob | 3 | 285 | 14,037.50 |
| bash | 1 | 35 | 32,138 |
| apply_patch | 1 | 17 | 38,133 |
| todowrite | 2 | 11 | 49,486 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.5-high

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-high/opencode-export.json`
- Model: `openrouter / openai/gpt-5.5 / high`
- Duration: 460,690 ms
- Total tokens: 485,771
- Cost: $1.088018
- Tool calls: 38

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 4 | 121,864 | 70,229 |
| read | 21 | 791 | 159,632 |
| glob | 4 | 489 | 11,700 |
| grep | 1 | 189 | 2,990 |
| skill | 2 | 149 | 28,415 |
| todowrite | 5 | 32 | 132,639 |
| apply_patch | 1 | 10 | 38,752 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.5-low

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-low/opencode-export.json`
- Model: `openrouter / openai/gpt-5.5 / low`
- Duration: 150,453 ms
- Total tokens: 324,086
- Cost: $0.560065
- Tool calls: 29

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| read | 17 | 621 | 102,395.33 |
| glob | 4 | 364 | 18,236 |
| skill | 2 | 128 | 28,887 |
| grep | 1 | 92 | 2,872.67 |
| todowrite | 4 | 21 | 104,167 |
| apply_patch | 1 | 10 | 33,102 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium/opencode-export.json`
- Model: `openrouter / openai/gpt-5.5 / medium`
- Duration: 244,415 ms
- Total tokens: 412,263
- Cost: $0.907562
- Tool calls: 36

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 2 | 2,060 | 45,091 |
| read | 18 | 1,014 | 123,442 |
| glob | 7 | 767 | 18,486 |
| grep | 1 | 177 | 6,819 |
| skill | 2 | 146 | 30,179 |
| todowrite | 5 | 23 | 117,755 |
| apply_patch | 1 | 9 | 34,356 |

## nextjs-app/openrouter-mistralai-devstral-2512

- Transcript: `implementation/nextjs-app/openrouter-mistralai-devstral-2512/opencode-export.json`
- Model: `openrouter / mistralai/devstral-2512 / default`
- Duration: 646,024 ms
- Total tokens: 1,962,283
- Cost: $0.227189
- Tool calls: 77

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 38 | 38,777 | 1,116,556 |
| write | 19 | 261 | 346,211 |
| todowrite | 13 | 64 | 249,549 |
| edit | 7 | 34 | 204,446 |

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

## nextjs-app/openrouter-moonshotai-kimi-k2.6

- Transcript: `implementation/nextjs-app/openrouter-moonshotai-kimi-k2.6/opencode-export.json`
- Model: `openrouter / moonshotai/kimi-k2.6 / default`
- Duration: 4,440,289 ms
- Total tokens: 20,583,152
- Cost: $5.508526
- Tool calls: 235

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 113 | 42,878 | 10,467,635 |
| read | 37 | 692 | 3,820,071 |
| write | 45 | 641 | 1,950,635 |
| glob | 7 | 507 | 1,036,941 |
| webfetch | 2 | 419 | 105,455 |
| skill | 2 | 152 | 161,247 |
| edit | 23 | 128 | 2,484,531 |
| grep | 1 | 73 | 162,543 |
| todowrite | 5 | 26 | 393,682 |

## nextjs-app/openrouter-openai-gpt-5.4-high

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.4-high/opencode-export.json`
- Model: `openrouter / openai/gpt-5.4 / high`
- Duration: 799,010 ms
- Total tokens: 2,297,831
- Cost: $1.232187
- Tool calls: 61

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 23 | 12,508 | 1,027,955.67 |
| grep | 8 | 4,121 | 250,042 |
| webfetch | 7 | 1,600 | 68,482.33 |
| glob | 3 | 355 | 88,780 |
| read | 9 | 228 | 164,017 |
| apply_patch | 7 | 214 | 456,322 |
| todowrite | 4 | 30 | 147,765 |

## nextjs-app/openrouter-openai-gpt-5.4-medium

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.4-medium/opencode-export.json`
- Model: `openrouter / openai/gpt-5.4 / medium`
- Duration: 702,982 ms
- Total tokens: 2,109,483
- Cost: $1.086570
- Tool calls: 74

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 35 | 10,240 | 875,361.50 |
| grep | 7 | 4,936 | 200,974 |
| glob | 6 | 439 | 70,781.50 |
| apply_patch | 9 | 225 | 351,058 |
| read | 11 | 150 | 310,966 |
| todowrite | 6 | 36 | 203,440 |

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

## nextjs-app/openrouter-openai-gpt-5.5-low

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-low/opencode-export.json`
- Model: `openrouter / openai/gpt-5.5 / low`
- Duration: 843,758 ms
- Total tokens: 2,346,930
- Cost: $2.077880
- Tool calls: 70

| Tool | Calls | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: |
| bash | 33 | 15,860 | 1,132,266 |
| glob | 5 | 640 | 118,795 |
| grep | 6 | 620 | 229,326 |
| apply_patch | 12 | 279 | 415,718 |
| read | 8 | 144 | 242,384 |
| todowrite | 6 | 32 | 141,070 |

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
