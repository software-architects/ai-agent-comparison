# Opencode Run Comparison

Generated from 24 transcripts under `implementation/`.
Repo root: `C:/Users/KarinHuber/source/repos/ai-agent-comparison`.
Token totals are computed from `info.tokens` as `input + output + reasoning + cache.read + cache.write` because the export stores components instead of a top-level `total`.
Per-tool tokens are approximate: each `step-finish.tokens.total` is split evenly across the tool calls in that step, and tokens from steps without tool calls stay unattributed.

## Summary

| Implementation | Duration | Tokens | Cost |
| --- | ---: | ---: | ---: |
| analyze-runs/openrouter-mistralai-devstral-2512 | 348,443 ms | 1,019,395 | $0.164874 |
| analyze-runs/openrouter-mistralai-mistral-medium-3-5 | 649,939 ms | 2,755,813 | $3.9851 |
| analyze-runs/openrouter-moonshotai-kimi-k2.6 | 481,941 ms | 137,879 | $0.113972 |
| analyze-runs/openrouter-openai-gpt-5.4-high | 189,467 ms | 231,852 | $0.272010 |
| analyze-runs/openrouter-openai-gpt-5.4-medium | 124,194 ms | 125,686 | $0.186514 |
| analyze-runs/openrouter-openai-gpt-5.5-high | 220,352 ms | 484,995 | $0.688873 |
| analyze-runs/openrouter-openai-gpt-5.5-low | 286,157 ms | 178,635 | $0.653188 |
| analyze-runs/openrouter-openai-gpt-5.5-medium | 113,960 ms | 174,199 | $0.440915 |
| modify-jazz-chords-app/openrouter-mistralai-devstral-2512 | 102,223 ms | 214,321 | $0.064341 |
| modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5 | 70,353 ms | 160,462 | $0.274875 |
| modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6 | 230,672 ms | 145,249 | $0.101804 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.4-high | 230,713 ms | 439,944 | $0.413511 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium | 151,348 ms | 320,430 | $0.287898 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.5-high | 460,690 ms | 485,771 | $1.0880 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.5-low | 150,453 ms | 324,086 | $0.560065 |
| modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium | 244,415 ms | 412,263 | $0.907562 |
| nextjs-app/openrouter-mistralai-devstral-2512 | 646,024 ms | 1,962,283 | $0.227189 |
| nextjs-app/openrouter-mistralai-mistral-medium-3-5 | 1,097,676 ms | 3,870,884 | $5.5325 |
| nextjs-app/openrouter-moonshotai-kimi-k2.6 | 4,440,289 ms | 20,583,152 | $5.5085 |
| nextjs-app/openrouter-openai-gpt-5.4-high | 799,010 ms | 2,297,831 | $1.2322 |
| nextjs-app/openrouter-openai-gpt-5.4-medium | 702,982 ms | 2,109,483 | $1.0866 |
| nextjs-app/openrouter-openai-gpt-5.5-high | 873,000 ms | 2,054,374 | $2.8304 |
| nextjs-app/openrouter-openai-gpt-5.5-low | 843,758 ms | 2,346,930 | $2.0779 |
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

## analyze-runs/openrouter-openai-gpt-5.4-high

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.4-high/opencode-export.json`
- Model: `openai/gpt-5.4 (high)`
- Total duration: 189,467 ms
- Total tokens: 231,852
- Cost: $0.272010
- Total tool time: 510 ms
- Tool-attributed tokens: 203,306
- Unattributed step tokens: 28,546

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 2 | 178 ms | 52,155 |
| read | 5 | 176 ms | 38,617.5 |
| glob | 1 | 88 ms | 4,483.5 |
| apply_patch | 2 | 40 ms | 51,592 |
| todowrite | 3 | 28 ms | 56,458 |

## analyze-runs/openrouter-openai-gpt-5.4-medium

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.4-medium/opencode-export.json`
- Model: `openai/gpt-5.4 (medium)`
- Total duration: 124,194 ms
- Total tokens: 125,686
- Cost: $0.186514
- Total tool time: 488 ms
- Tool-attributed tokens: 102,774
- Unattributed step tokens: 22,912

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| glob | 1 | 214 ms | 2,956.67 |
| bash | 2 | 91 ms | 21,998.67 |
| grep | 1 | 75 ms | 4,778 |
| read | 3 | 55 ms | 17,404.17 |
| apply_patch | 1 | 35 ms | 18,575 |
| todowrite | 3 | 18 ms | 37,061.5 |

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

## analyze-runs/openrouter-openai-gpt-5.5-low

- Transcript: `implementation/analyze-runs/openrouter-openai-gpt-5.5-low/opencode-export.json`
- Model: `openai/gpt-5.5 (low)`
- Total duration: 286,157 ms
- Total tokens: 178,635
- Cost: $0.653188
- Total tool time: 1,010 ms
- Tool-attributed tokens: 156,856
- Unattributed step tokens: 21,779

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| glob | 4 | 456 ms | 21,535.67 |
| read | 5 | 232 ms | 29,183.33 |
| grep | 2 | 226 ms | 12,219 |
| bash | 1 | 59 ms | 19,151 |
| apply_patch | 1 | 19 ms | 18,496 |
| todowrite | 3 | 18 ms | 56,271 |

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

## modify-jazz-chords-app/openrouter-mistralai-devstral-2512

- Transcript: `implementation/modify-jazz-chords-app/openrouter-mistralai-devstral-2512/opencode-export.json`
- Model: `mistralai/devstral-2512`
- Total duration: 102,223 ms
- Total tokens: 214,321
- Cost: $0.064341
- Total tool time: 2,391 ms
- Tool-attributed tokens: 184,911
- Unattributed step tokens: 29,410

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 1 | 1,954 ms | 9,716 |
| read | 6 | 222 ms | 119,384 |
| glob | 2 | 200 ms | 26,432 |
| write | 1 | 15 ms | 29,379 |

## modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5

- Transcript: `implementation/modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`
- Model: `mistralai/mistral-medium-3-5`
- Total duration: 70,353 ms
- Total tokens: 160,462
- Cost: $0.274875
- Total tool time: 1,982 ms
- Tool-attributed tokens: 129,043
- Unattributed step tokens: 31,419

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 1 | 1,419 ms | 9,817 |
| read | 9 | 454 ms | 78,112 |
| glob | 1 | 86 ms | 9,915 |
| write | 1 | 23 ms | 31,199 |

## modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6

- Transcript: `implementation/modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6/opencode-export.json`
- Model: `moonshotai/kimi-k2.6`
- Total duration: 230,672 ms
- Total tokens: 145,249
- Cost: $0.101804
- Total tool time: 598 ms
- Tool-attributed tokens: 114,687
- Unattributed step tokens: 30,524

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| read | 10 | 270 ms | 37,887.67 |
| glob | 2 | 194 ms | 10,306 |
| skill | 1 | 85 ms | 24,696 |
| bash | 2 | 36 ms | 11,609.33 |
| write | 1 | 13 ms | 30,188 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.4-high

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-high/opencode-export.json`
- Model: `openai/gpt-5.4 (high)`
- Total duration: 230,713 ms
- Total tokens: 439,944
- Cost: $0.413511
- Total tool time: 1,448 ms
- Tool-attributed tokens: 389,261
- Unattributed step tokens: 50,683

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| read | 21 | 695 ms | 156,255.33 |
| glob | 3 | 322 ms | 8,793 |
| grep | 2 | 237 ms | 14,468.67 |
| skill | 2 | 145 ms | 16,985 |
| todowrite | 4 | 27 ms | 145,982 |
| apply_patch | 1 | 22 ms | 46,777 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium/opencode-export.json`
- Model: `openai/gpt-5.4 (medium)`
- Total duration: 151,348 ms
- Total tokens: 320,430
- Cost: $0.287898
- Total tool time: 1,305 ms
- Tool-attributed tokens: 279,138
- Unattributed step tokens: 41,292

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| read | 15 | 549 ms | 125,392.83 |
| grep | 3 | 408 ms | 19,950.67 |
| glob | 3 | 285 ms | 14,037.5 |
| bash | 1 | 35 ms | 32,138 |
| apply_patch | 1 | 17 ms | 38,133 |
| todowrite | 2 | 11 ms | 49,486 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.5-high

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-high/opencode-export.json`
- Model: `openai/gpt-5.5 (high)`
- Total duration: 460,690 ms
- Total tokens: 485,771
- Cost: $1.0880
- Total tool time: 123,524 ms
- Tool-attributed tokens: 444,357
- Unattributed step tokens: 41,414

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 4 | 121,864 ms | 70,229 |
| read | 21 | 791 ms | 159,632 |
| glob | 4 | 489 ms | 11,700 |
| grep | 1 | 189 ms | 2,990 |
| skill | 2 | 149 ms | 28,415 |
| todowrite | 5 | 32 ms | 132,639 |
| apply_patch | 1 | 10 ms | 38,752 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.5-low

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-low/opencode-export.json`
- Model: `openai/gpt-5.5 (low)`
- Total duration: 150,453 ms
- Total tokens: 324,086
- Cost: $0.560065
- Total tool time: 1,236 ms
- Tool-attributed tokens: 289,660
- Unattributed step tokens: 34,426

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| read | 17 | 621 ms | 102,395.33 |
| glob | 4 | 364 ms | 18,236 |
| skill | 2 | 128 ms | 28,887 |
| grep | 1 | 92 ms | 2,872.67 |
| todowrite | 4 | 21 ms | 104,167 |
| apply_patch | 1 | 10 ms | 33,102 |

## modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium

- Transcript: `implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium/opencode-export.json`
- Model: `openai/gpt-5.5 (medium)`
- Total duration: 244,415 ms
- Total tokens: 412,263
- Cost: $0.907562
- Total tool time: 4,196 ms
- Tool-attributed tokens: 376,128
- Unattributed step tokens: 36,135

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 2 | 2,060 ms | 45,091 |
| read | 18 | 1,014 ms | 123,442 |
| glob | 7 | 767 ms | 18,486 |
| grep | 1 | 177 ms | 6,819 |
| skill | 2 | 146 ms | 30,179 |
| todowrite | 5 | 23 ms | 117,755 |
| apply_patch | 1 | 9 ms | 34,356 |

## nextjs-app/openrouter-mistralai-devstral-2512

- Transcript: `implementation/nextjs-app/openrouter-mistralai-devstral-2512/opencode-export.json`
- Model: `mistralai/devstral-2512`
- Total duration: 646,024 ms
- Total tokens: 1,962,283
- Cost: $0.227189
- Total tool time: 39,136 ms
- Tool-attributed tokens: 1,916,762
- Unattributed step tokens: 45,521

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 38 | 38,777 ms | 1,116,556 |
| write | 19 | 261 ms | 346,211 |
| todowrite | 13 | 64 ms | 249,549 |
| edit | 7 | 34 ms | 204,446 |

## nextjs-app/openrouter-mistralai-mistral-medium-3-5

- Transcript: `implementation/nextjs-app/openrouter-mistralai-mistral-medium-3-5/opencode-export.json`
- Model: `mistralai/mistral-medium-3-5`
- Total duration: 1,097,676 ms
- Total tokens: 3,870,884
- Cost: $5.5325
- Total tool time: 16,816 ms
- Tool-attributed tokens: 3,870,884
- Unattributed step tokens: 0

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 50 | 16,151 ms | 2,174,643 |
| write | 29 | 351 ms | 696,686 |
| read | 8 | 166 ms | 393,997 |
| skill | 1 | 83 ms | 18,017 |
| edit | 11 | 54 ms | 566,142 |
| todowrite | 2 | 11 ms | 21,399 |

## nextjs-app/openrouter-moonshotai-kimi-k2.6

- Transcript: `implementation/nextjs-app/openrouter-moonshotai-kimi-k2.6/opencode-export.json`
- Model: `moonshotai/kimi-k2.6`
- Total duration: 4,440,289 ms
- Total tokens: 20,583,152
- Cost: $5.5085
- Total tool time: 45,516 ms
- Tool-attributed tokens: 20,582,740
- Unattributed step tokens: 0

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 113 | 42,878 ms | 10,467,635 |
| read | 37 | 692 ms | 3,820,071 |
| write | 45 | 641 ms | 1,950,635 |
| glob | 7 | 507 ms | 1,036,941 |
| webfetch | 2 | 419 ms | 105,455 |
| skill | 2 | 152 ms | 161,247 |
| edit | 23 | 128 ms | 2,484,531 |
| grep | 1 | 73 ms | 162,543 |
| todowrite | 5 | 26 ms | 393,682 |

## nextjs-app/openrouter-openai-gpt-5.4-high

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.4-high/opencode-export.json`
- Model: `openai/gpt-5.4 (high)`
- Total duration: 799,010 ms
- Total tokens: 2,297,831
- Cost: $1.2322
- Total tool time: 19,056 ms
- Tool-attributed tokens: 2,203,364
- Unattributed step tokens: 94,467

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 23 | 12,508 ms | 1,027,955.67 |
| grep | 8 | 4,121 ms | 250,042 |
| webfetch | 7 | 1,600 ms | 68,482.33 |
| glob | 3 | 355 ms | 88,780 |
| read | 9 | 228 ms | 164,017 |
| apply_patch | 7 | 214 ms | 456,322 |
| todowrite | 4 | 30 ms | 147,765 |

## nextjs-app/openrouter-openai-gpt-5.4-medium

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.4-medium/opencode-export.json`
- Model: `openai/gpt-5.4 (medium)`
- Total duration: 702,982 ms
- Total tokens: 2,109,483
- Cost: $1.0866
- Total tool time: 16,026 ms
- Tool-attributed tokens: 2,012,581
- Unattributed step tokens: 96,902

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 35 | 10,240 ms | 875,361.5 |
| grep | 7 | 4,936 ms | 200,974 |
| glob | 6 | 439 ms | 70,781.5 |
| apply_patch | 9 | 225 ms | 351,058 |
| read | 11 | 150 ms | 310,966 |
| todowrite | 6 | 36 ms | 203,440 |

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

## nextjs-app/openrouter-openai-gpt-5.5-low

- Transcript: `implementation/nextjs-app/openrouter-openai-gpt-5.5-low/opencode-export.json`
- Model: `openai/gpt-5.5 (low)`
- Total duration: 843,758 ms
- Total tokens: 2,346,930
- Cost: $2.0779
- Total tool time: 17,575 ms
- Tool-attributed tokens: 2,279,559
- Unattributed step tokens: 67,371

| Tool | Calls | Duration | Approx tokens |
| --- | ---: | ---: | ---: |
| bash | 33 | 15,860 ms | 1,132,266 |
| glob | 5 | 640 ms | 118,795 |
| grep | 6 | 620 ms | 229,326 |
| apply_patch | 12 | 279 ms | 415,718 |
| read | 8 | 144 ms | 242,384 |
| todowrite | 6 | 32 ms | 141,070 |

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
