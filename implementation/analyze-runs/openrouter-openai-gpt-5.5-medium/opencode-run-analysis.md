# Opencode Run Analysis

Generated: 2026-05-20T12:16:00.490Z

Tool token counts are approximate. Opencode records tokens per step, not per tool call, so this report splits each step's `step-finish.tokens.total` evenly across the tool calls in that step.

## Summary

| Run | Duration | Duration (ms) | Tokens | Cost |
| --- | ---: | ---: | ---: | ---: |
| analyze-runs/openrouter-mistralai-devstral-2512 | 5m 48s | 348,443 | 1,019,395 | $0.1649 |
| analyze-runs/openrouter-mistralai-mistral-medium-3-5 | 10m 50s | 649,939 | 2,755,813 | $3.9851 |
| analyze-runs/openrouter-moonshotai-kimi-k2.6 | 8m 2s | 481,941 | 137,879 | $0.1140 |
| analyze-runs/openrouter-openai-gpt-5.4-high | 3m 9s | 189,467 | 231,852 | $0.2720 |
| analyze-runs/openrouter-openai-gpt-5.4-medium | 2m 4s | 124,194 | 125,686 | $0.1865 |
| analyze-runs/openrouter-openai-gpt-5.5-high | 3m 40s | 220,352 | 484,995 | $0.6889 |
| analyze-runs/openrouter-openai-gpt-5.5-low | 4m 46s | 286,157 | 178,635 | $0.6532 |
| analyze-runs/openrouter-openai-gpt-5.5-medium | 1m 54s | 113,960 | 174,199 | $0.4409 |
| modify-jazz-chords-app/openrouter-mistralai-devstral-2512 | 1m 42s | 102,223 | 214,321 | $0.0643 |
| modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5 | 1m 10s | 70,353 | 160,462 | $0.2749 |
| modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6 | 3m 51s | 230,672 | 145,249 | $0.1018 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.4-high | 3m 51s | 230,713 | 439,944 | $0.4135 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium | 2m 31s | 151,348 | 320,430 | $0.2879 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.5-high | 7m 41s | 460,690 | 485,771 | $1.0880 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.5-low | 2m 30s | 150,453 | 324,086 | $0.5601 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium | 4m 4s | 244,415 | 412,263 | $0.9076 |
| nextjs-app/openrouter-mistralai-devstral-2512 | 10m 46s | 646,024 | 1,962,283 | $0.2272 |
| nextjs-app/openrouter-mistralai-mistral-medium-3-5 | 18m 18s | 1,097,676 | 3,870,884 | $5.5325 |
| nextjs-app/openrouter-moonshotai-kimi-k2.6 | 74m 0s | 4,440,289 | 20,583,152 | $5.5085 |
| nextjs-app/openrouter-openai-gpt-5.4-high | 13m 19s | 799,010 | 2,297,831 | $1.2322 |
| nextjs-app/openrouter-openai-gpt-5.4-medium | 11m 43s | 702,982 | 2,109,483 | $1.0866 |
| nextjs-app/openrouter-openai-gpt-5.5-high | 14m 33s | 873,000 | 2,054,374 | $2.8304 |
| nextjs-app/openrouter-openai-gpt-5.5-low | 14m 4s | 843,758 | 2,346,930 | $2.0779 |
| nextjs-app/openrouter-openai-gpt-5.5-medium | 13m 10s | 790,461 | 1,681,697 | $2.0231 |

## analyze-runs/openrouter-mistralai-devstral-2512

Transcript: `implementation/analyze-runs/openrouter-mistralai-devstral-2512/opencode-export.json`

Duration: 5m 48s (348,443 ms)

Tokens: 1,019,395

Cost: $0.1649

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 12 | 780 ms | 780 | 221,193 |
| read | 13 | 346 ms | 346 | 347,756 |
| grep | 2 | 209 ms | 209 | 37,479 |
| edit | 11 | 77 ms | 77 | 298,451 |
| write | 4 | 66 ms | 66 | 73,355 |

## analyze-runs/openrouter-mistralai-mistral-medium-3-5

Transcript: `implementation/analyze-runs/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`

Duration: 10m 50s (649,939 ms)

Tokens: 2,755,813

Cost: $3.9851

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 18 | 763 ms | 763 | 851,537 |
| read | 16 | 347 ms | 347 | 721,789 |
| glob | 2 | 282 ms | 282 | 10,255 |
| grep | 2 | 150 ms | 150 | 91,868 |
| write | 4 | 84 ms | 84 | 127,174 |
| edit | 14 | 68 ms | 68 | 740,480 |
| todowrite | 4 | 22 ms | 22 | 147,949 |

## analyze-runs/openrouter-moonshotai-kimi-k2.6

Transcript: `implementation/analyze-runs/openrouter-moonshotai-kimi-k2.6/opencode-export.json`

Duration: 8m 2s (481,941 ms)

Tokens: 137,879

Cost: $0.1140

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 5 | 168 ms | 168 | 56,708 |
| glob | 1 | 95 ms | 95 | 9,210 |
| write | 3 | 47 ms | 47 | 19,986 |
| read | 2 | 30 ms | 30 | 16,914 |
| todowrite | 2 | 10 ms | 10 | 12,437 |

## analyze-runs/openrouter-openai-gpt-5.4-high

Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.4-high/opencode-export.json`

Duration: 3m 9s (189,467 ms)

Tokens: 231,852

Cost: $0.2720

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 2 | 178 ms | 178 | 52,155 |
| read | 5 | 176 ms | 176 | 38,618 |
| glob | 1 | 88 ms | 88 | 4,484 |
| apply_patch | 2 | 40 ms | 40 | 51,592 |
| todowrite | 3 | 28 ms | 28 | 56,458 |

## analyze-runs/openrouter-openai-gpt-5.4-medium

Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.4-medium/opencode-export.json`

Duration: 2m 4s (124,194 ms)

Tokens: 125,686

Cost: $0.1865

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| glob | 1 | 214 ms | 214 | 2,957 |
| bash | 2 | 91 ms | 91 | 21,999 |
| grep | 1 | 75 ms | 75 | 4,778 |
| read | 3 | 55 ms | 55 | 17,404 |
| apply_patch | 1 | 35 ms | 35 | 18,575 |
| todowrite | 3 | 18 ms | 18 | 37,062 |

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

## analyze-runs/openrouter-openai-gpt-5.5-low

Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-low/opencode-export.json`

Duration: 4m 46s (286,157 ms)

Tokens: 178,635

Cost: $0.6532

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| glob | 4 | 456 ms | 456 | 21,536 |
| read | 5 | 232 ms | 232 | 29,183 |
| grep | 2 | 226 ms | 226 | 12,219 |
| bash | 1 | 59 ms | 59 | 19,151 |
| apply_patch | 1 | 19 ms | 19 | 18,496 |
| todowrite | 3 | 18 ms | 18 | 56,271 |

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

## modify-jazz-chords-app/openrouter-mistralai-devstral-2512

Transcript: `implementation/modify-jazz-chords-app/openrouter-mistralai-devstral-2512/opencode-export.json`

Duration: 1m 42s (102,223 ms)

Tokens: 214,321

Cost: $0.0643

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 1 | 2s | 1,954 | 9,716 |
| read | 6 | 222 ms | 222 | 119,384 |
| glob | 2 | 200 ms | 200 | 26,432 |
| write | 1 | 15 ms | 15 | 29,379 |

## modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5

Transcript: `implementation/modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`

Duration: 1m 10s (70,353 ms)

Tokens: 160,462

Cost: $0.2749

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 1 | 1s | 1,419 | 9,817 |
| read | 9 | 454 ms | 454 | 78,112 |
| glob | 1 | 86 ms | 86 | 9,915 |
| write | 1 | 23 ms | 23 | 31,199 |

## modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6

Transcript: `implementation/modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6/opencode-export.json`

Duration: 3m 51s (230,672 ms)

Tokens: 145,249

Cost: $0.1018

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| read | 10 | 270 ms | 270 | 37,888 |
| glob | 2 | 194 ms | 194 | 10,306 |
| skill | 1 | 85 ms | 85 | 24,696 |
| bash | 2 | 36 ms | 36 | 11,609 |
| write | 1 | 13 ms | 13 | 30,188 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.4-high

Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-high/opencode-export.json`

Duration: 3m 51s (230,713 ms)

Tokens: 439,944

Cost: $0.4135

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| read | 21 | 695 ms | 695 | 156,255 |
| glob | 3 | 322 ms | 322 | 8,793 |
| grep | 2 | 237 ms | 237 | 14,469 |
| skill | 2 | 145 ms | 145 | 16,985 |
| todowrite | 4 | 27 ms | 27 | 145,982 |
| apply_patch | 1 | 22 ms | 22 | 46,777 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium

Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium/opencode-export.json`

Duration: 2m 31s (151,348 ms)

Tokens: 320,430

Cost: $0.2879

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| read | 15 | 549 ms | 549 | 125,393 |
| grep | 3 | 408 ms | 408 | 19,951 |
| glob | 3 | 285 ms | 285 | 14,038 |
| bash | 1 | 35 ms | 35 | 32,138 |
| apply_patch | 1 | 17 ms | 17 | 38,133 |
| todowrite | 2 | 11 ms | 11 | 49,486 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.5-high

Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-high/opencode-export.json`

Duration: 7m 41s (460,690 ms)

Tokens: 485,771

Cost: $1.0880

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 4 | 2m 2s | 121,864 | 70,229 |
| read | 21 | 791 ms | 791 | 159,632 |
| glob | 4 | 489 ms | 489 | 11,700 |
| grep | 1 | 189 ms | 189 | 2,990 |
| skill | 2 | 149 ms | 149 | 28,415 |
| todowrite | 5 | 32 ms | 32 | 132,639 |
| apply_patch | 1 | 10 ms | 10 | 38,752 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.5-low

Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-low/opencode-export.json`

Duration: 2m 30s (150,453 ms)

Tokens: 324,086

Cost: $0.5601

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| read | 17 | 621 ms | 621 | 102,395 |
| glob | 4 | 364 ms | 364 | 18,236 |
| skill | 2 | 128 ms | 128 | 28,887 |
| grep | 1 | 92 ms | 92 | 2,873 |
| todowrite | 4 | 21 ms | 21 | 104,167 |
| apply_patch | 1 | 10 ms | 10 | 33,102 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium

Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium/opencode-export.json`

Duration: 4m 4s (244,415 ms)

Tokens: 412,263

Cost: $0.9076

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 2 | 2s | 2,060 | 45,091 |
| read | 18 | 1s | 1,014 | 123,442 |
| glob | 7 | 767 ms | 767 | 18,486 |
| grep | 1 | 177 ms | 177 | 6,819 |
| skill | 2 | 146 ms | 146 | 30,179 |
| todowrite | 5 | 23 ms | 23 | 117,755 |
| apply_patch | 1 | 9 ms | 9 | 34,356 |

## nextjs-app/openrouter-mistralai-devstral-2512

Transcript: `implementation/nextjs-app/openrouter-mistralai-devstral-2512/opencode-export.json`

Duration: 10m 46s (646,024 ms)

Tokens: 1,962,283

Cost: $0.2272

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 38 | 39s | 38,777 | 1,116,556 |
| write | 19 | 261 ms | 261 | 346,211 |
| todowrite | 13 | 64 ms | 64 | 249,549 |
| edit | 7 | 34 ms | 34 | 204,446 |

## nextjs-app/openrouter-mistralai-mistral-medium-3-5

Transcript: `implementation/nextjs-app/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`

Duration: 18m 18s (1,097,676 ms)

Tokens: 3,870,884

Cost: $5.5325

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 50 | 16s | 16,151 | 2,174,643 |
| write | 29 | 351 ms | 351 | 696,686 |
| read | 8 | 166 ms | 166 | 393,997 |
| skill | 1 | 83 ms | 83 | 18,017 |
| edit | 11 | 54 ms | 54 | 566,142 |
| todowrite | 2 | 11 ms | 11 | 21,399 |

## nextjs-app/openrouter-moonshotai-kimi-k2.6

Transcript: `implementation/nextjs-app/openrouter-moonshotai-kimi-k2.6/opencode-export.json`

Duration: 74m 0s (4,440,289 ms)

Tokens: 20,583,152

Cost: $5.5085

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 113 | 43s | 42,878 | 10,467,635 |
| read | 37 | 692 ms | 692 | 3,820,071 |
| write | 45 | 641 ms | 641 | 1,950,635 |
| glob | 7 | 507 ms | 507 | 1,036,941 |
| webfetch | 2 | 419 ms | 419 | 105,455 |
| skill | 2 | 152 ms | 152 | 161,247 |
| edit | 23 | 128 ms | 128 | 2,484,531 |
| grep | 1 | 73 ms | 73 | 162,543 |
| todowrite | 5 | 26 ms | 26 | 393,682 |

## nextjs-app/openrouter-openai-gpt-5.4-high

Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.4-high/opencode-export.json`

Duration: 13m 19s (799,010 ms)

Tokens: 2,297,831

Cost: $1.2322

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 23 | 13s | 12,508 | 1,027,956 |
| grep | 8 | 4s | 4,121 | 250,042 |
| webfetch | 7 | 2s | 1,600 | 68,482 |
| glob | 3 | 355 ms | 355 | 88,780 |
| read | 9 | 228 ms | 228 | 164,017 |
| apply_patch | 7 | 214 ms | 214 | 456,322 |
| todowrite | 4 | 30 ms | 30 | 147,765 |

## nextjs-app/openrouter-openai-gpt-5.4-medium

Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.4-medium/opencode-export.json`

Duration: 11m 43s (702,982 ms)

Tokens: 2,109,483

Cost: $1.0866

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 35 | 10s | 10,240 | 875,362 |
| grep | 7 | 5s | 4,936 | 200,974 |
| glob | 6 | 439 ms | 439 | 70,782 |
| apply_patch | 9 | 225 ms | 225 | 351,058 |
| read | 11 | 150 ms | 150 | 310,966 |
| todowrite | 6 | 36 ms | 36 | 203,440 |

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

## nextjs-app/openrouter-openai-gpt-5.5-low

Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-low/opencode-export.json`

Duration: 14m 4s (843,758 ms)

Tokens: 2,346,930

Cost: $2.0779

| Tool | Calls | Time | Time (ms) | Approx. tokens |
| --- | ---: | ---: | ---: | ---: |
| bash | 33 | 16s | 15,860 | 1,132,266 |
| glob | 5 | 640 ms | 640 | 118,795 |
| grep | 6 | 620 ms | 620 | 229,326 |
| apply_patch | 12 | 279 ms | 279 | 415,718 |
| read | 8 | 144 ms | 144 | 242,384 |
| todowrite | 6 | 32 ms | 32 | 141,070 |

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
