# Opencode Run Analysis

## Summary

| Implementation | Duration (ms) | Tokens | Cost |
|---------------|--------------|--------|------|
| implementation/analyze-runs/openrouter-mistralai-devstral-2512/opencode-export | 348.443 | 288.419 | $0.1649 |
| implementation/analyze-runs/openrouter-mistralai-mistral-medium-3-5/opencode-export | 649.939 | 2.596.629 | $3.9851 |
| implementation/analyze-runs/openrouter-moonshotai-kimi-k2.6/opencode-export | 481.941 | 116.168 | $0.1140 |
| implementation/analyze-runs/openrouter-openai-gpt-5.4-high/opencode-export | 189.467 | 34.732 | $0.2720 |
| implementation/analyze-runs/openrouter-openai-gpt-5.4-medium/opencode-export | 124.194 | 29.430 | $0.1865 |
| implementation/analyze-runs/openrouter-openai-gpt-5.5-high/opencode-export | 220.352 | 43.139 | $0.6889 |
| implementation/analyze-runs/openrouter-openai-gpt-5.5-low/opencode-export | 286.157 | 100.299 | $0.6532 |
| implementation/analyze-runs/openrouter-openai-gpt-5.5-medium/opencode-export | 113.960 | 48.759 | $0.4409 |
| implementation/modify-jazz-chords-app/openrouter-mistralai-devstral-2512/opencode-export | 102.223 | 144.337 | $0.0643 |
| implementation/modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5/opencode-export | 70.353 | 160.462 | $0.2749 |
| implementation/modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6/opencode-export | 230.672 | 103.569 | $0.1018 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-high/opencode-export | 230.713 | 59.400 | $0.4135 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium/opencode-export | 151.348 | 44.718 | $0.2879 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-high/opencode-export | 460.690 | 125.835 | $1.0880 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-low/opencode-export | 150.453 | 50.166 | $0.5601 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium/opencode-export | 244.415 | 114.279 | $0.9076 |
| implementation/nextjs-app/openrouter-mistralai-devstral-2512/opencode-export | 646.024 | 368.747 | $0.2272 |
| implementation/nextjs-app/openrouter-mistralai-mistral-medium-3-5/opencode-export | 1.097.676 | 3.607.140 | $5.5325 |
| implementation/nextjs-app/openrouter-moonshotai-kimi-k2.6/opencode-export | 4.440.289 | 383.408 | $5.5085 |
| implementation/nextjs-app/openrouter-openai-gpt-5.4-high/opencode-export | 799.010 | 114.791 | $1.2322 |
| implementation/nextjs-app/openrouter-openai-gpt-5.4-medium/opencode-export | 702.982 | 112.811 | $1.0866 |
| implementation/nextjs-app/openrouter-openai-gpt-5.5-high/opencode-export | 873.000 | 280.294 | $2.8304 |
| implementation/nextjs-app/openrouter-openai-gpt-5.5-low/opencode-export | 843.758 | 129.970 | $2.0779 |
| implementation/nextjs-app/openrouter-openai-gpt-5.5-medium/opencode-export | 790.461 | 164.641 | $2.0231 |

## implementation/analyze-runs/openrouter-mistralai-devstral-2512/opencode-export

- **Total Duration**: 348443 ms
- **Total Tokens**: 288419
- **Cost**: $0.1649

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 780 | 978234 | 12 |
| read | 346 | 838924 | 13 |
| grep | 209 | 809707 | 2 |
| edit | 77 | 865976 | 11 |
| write | 66 | 927312 | 4 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/analyze-runs/openrouter-mistralai-mistral-medium-3-5/opencode-export

- **Total Duration**: 649939 ms
- **Total Tokens**: 2596629
- **Cost**: $3.9851

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 763 | 2652840 | 18 |
| read | 347 | 2642585 | 16 |
| glob | 282 | 2652840 | 2 |
| grep | 150 | 2141686 | 2 |
| write | 84 | 2566105 | 4 |
| edit | 68 | 2351456 | 14 |
| todowrite | 22 | 2662801 | 4 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/analyze-runs/openrouter-moonshotai-kimi-k2.6/opencode-export

- **Total Duration**: 481941 ms
- **Total Tokens**: 116168
- **Cost**: $0.1140

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 168 | 80530 | 5 |
| glob | 95 | 76043 | 1 |
| write | 47 | 45644 | 3 |
| read | 30 | 89494 | 2 |
| todowrite | 10 | 80530 | 2 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/analyze-runs/openrouter-openai-gpt-5.4-high/opencode-export

- **Total Duration**: 189467 ms
- **Total Tokens**: 34732
- **Cost**: $0.2720

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 178 | 120479 | 2 |
| read | 176 | 173019 | 5 |
| glob | 88 | 173019 | 1 |
| apply_patch | 40 | 144240 | 2 |
| todowrite | 28 | 181756 | 3 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/analyze-runs/openrouter-openai-gpt-5.4-medium/opencode-export

- **Total Duration**: 124194 ms
- **Total Tokens**: 29430
- **Cost**: $0.1865

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| glob | 214 | 73867 | 1 |
| bash | 91 | 73867 | 2 |
| grep | 75 | 70911 | 1 |
| read | 55 | 73867 | 3 |
| apply_patch | 35 | 66133 | 1 |
| todowrite | 18 | 82413 | 3 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/analyze-runs/openrouter-openai-gpt-5.5-high/opencode-export

- **Total Duration**: 220352 ms
- **Total Tokens**: 43139
- **Cost**: $0.6889

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| read | 826 | 386111 | 8 |
| bash | 565 | 286179 | 5 |
| grep | 490 | 381612 | 3 |
| glob | 266 | 390470 | 3 |
| apply_patch | 50 | 313613 | 2 |
| todowrite | 20 | 398963 | 3 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/analyze-runs/openrouter-openai-gpt-5.5-low/opencode-export

- **Total Duration**: 286157 ms
- **Total Tokens**: 100299
- **Cost**: $0.6532

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| glob | 456 | 122140 | 4 |
| read | 232 | 117866 | 5 |
| grep | 226 | 113383 | 2 |
| bash | 59 | 47100 | 1 |
| apply_patch | 19 | 84514 | 1 |
| todowrite | 18 | 100412 | 3 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/analyze-runs/openrouter-openai-gpt-5.5-medium/opencode-export

- **Total Duration**: 113960 ms
- **Total Tokens**: 48759
- **Cost**: $0.4409

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| read | 157 | 132937 | 4 |
| grep | 96 | 119536 | 1 |
| glob | 87 | 132937 | 2 |
| bash | 87 | 63528 | 2 |
| apply_patch | 28 | 96301 | 1 |
| todowrite | 17 | 141431 | 3 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/modify-jazz-chords-app/openrouter-mistralai-devstral-2512/opencode-export

- **Total Duration**: 102223 ms
- **Total Tokens**: 144337
- **Cost**: $0.0643

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 1954 | 184911 | 1 |
| read | 222 | 165442 | 6 |
| glob | 200 | 175195 | 2 |
| write | 15 | 29379 | 1 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5/opencode-export

- **Total Duration**: 70353 ms
- **Total Tokens**: 160462
- **Cost**: $0.2749

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 1419 | 87627 | 1 |
| read | 454 | 67895 | 9 |
| glob | 86 | 77810 | 1 |
| write | 23 | 31199 | 1 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6/opencode-export

- **Total Duration**: 230672 ms
- **Total Tokens**: 103569
- **Cost**: $0.1018

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| read | 270 | 71115 | 10 |
| glob | 194 | 68172 | 2 |
| skill | 85 | 54884 | 1 |
| bash | 36 | 79782 | 2 |
| write | 13 | 30188 | 1 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-high/opencode-export

- **Total Duration**: 230713 ms
- **Total Tokens**: 59400
- **Cost**: $0.4135

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| read | 695 | 271180 | 21 |
| glob | 322 | 274111 | 3 |
| grep | 237 | 254384 | 2 |
| skill | 145 | 266063 | 2 |
| todowrite | 27 | 282647 | 4 |
| apply_patch | 22 | 191174 | 1 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium/opencode-export

- **Total Duration**: 151348 ms
- **Total Tokens**: 44718
- **Cost**: $0.2879

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| read | 549 | 186435 | 15 |
| grep | 408 | 190785 | 3 |
| glob | 285 | 190785 | 3 |
| bash | 35 | 149588 | 1 |
| apply_patch | 17 | 117450 | 1 |
| todowrite | 11 | 199222 | 2 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-high/opencode-export

- **Total Duration**: 460690 ms
- **Total Tokens**: 125835
- **Cost**: $1.0880

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 121864 | 342902 | 4 |
| read | 791 | 379034 | 21 |
| glob | 489 | 381938 | 4 |
| grep | 189 | 260125 | 1 |
| skill | 149 | 282767 | 2 |
| todowrite | 32 | 390429 | 5 |
| apply_patch | 10 | 198287 | 1 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-low/opencode-export

- **Total Duration**: 150453 ms
- **Total Tokens**: 50166
- **Cost**: $0.5601

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| read | 621 | 237070 | 17 |
| glob | 364 | 239943 | 4 |
| skill | 128 | 197850 | 2 |
| grep | 92 | 239943 | 1 |
| todowrite | 21 | 248313 | 4 |
| apply_patch | 10 | 133951 | 1 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium/opencode-export

- **Total Duration**: 244415 ms
- **Total Tokens**: 114279
- **Cost**: $0.9076

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 2060 | 269462 | 2 |
| read | 1014 | 305133 | 18 |
| glob | 767 | 308017 | 7 |
| grep | 177 | 211496 | 1 |
| skill | 146 | 248194 | 2 |
| todowrite | 23 | 316450 | 5 |
| apply_patch | 9 | 174831 | 1 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/nextjs-app/openrouter-mistralai-devstral-2512/opencode-export

- **Total Duration**: 646024 ms
- **Total Tokens**: 368747
- **Cost**: $0.2272

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 38777 | 1860077 | 38 |
| write | 261 | 1895310 | 19 |
| todowrite | 64 | 1916762 | 13 |
| edit | 34 | 1589060 | 7 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/nextjs-app/openrouter-mistralai-mistral-medium-3-5/opencode-export

- **Total Duration**: 1097676 ms
- **Total Tokens**: 3607140
- **Cost**: $5.5325

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 16151 | 3843752 | 50 |
| write | 351 | 3774524 | 29 |
| read | 166 | 3838018 | 8 |
| skill | 83 | 3485343 | 1 |
| edit | 54 | 3826058 | 11 |
| todowrite | 11 | 3865151 | 2 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/nextjs-app/openrouter-moonshotai-kimi-k2.6/opencode-export

- **Total Duration**: 4440289 ms
- **Total Tokens**: 383408
- **Cost**: $5.5085

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 42878 | 20207802 | 113 |
| read | 692 | 20227328 | 37 |
| write | 641 | 20206529 | 45 |
| glob | 507 | 16112333 | 7 |
| webfetch | 419 | 18847057 | 2 |
| skill | 152 | 20217567 | 2 |
| edit | 128 | 19985359 | 23 |
| grep | 73 | 5539020 | 1 |
| todowrite | 26 | 20236728 | 5 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/nextjs-app/openrouter-openai-gpt-5.4-high/opencode-export

- **Total Duration**: 799010 ms
- **Total Tokens**: 114791
- **Cost**: $1.2322

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 12508 | 1718283 | 23 |
| grep | 4121 | 176057 | 8 |
| webfetch | 1600 | 1691524 | 7 |
| glob | 355 | 74353 | 3 |
| read | 228 | 1718283 | 9 |
| apply_patch | 214 | 1661919 | 7 |
| todowrite | 30 | 1727386 | 4 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/nextjs-app/openrouter-openai-gpt-5.4-medium/opencode-export

- **Total Duration**: 702982 ms
- **Total Tokens**: 112811
- **Cost**: $1.0866

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 10240 | 1618213 | 35 |
| grep | 4936 | 1245317 | 7 |
| glob | 439 | 1618213 | 6 |
| apply_patch | 225 | 1529934 | 9 |
| read | 150 | 1451832 | 11 |
| todowrite | 36 | 1627584 | 6 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/nextjs-app/openrouter-openai-gpt-5.5-high/opencode-export

- **Total Duration**: 873000 ms
- **Total Tokens**: 280294
- **Cost**: $2.8304

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 16341 | 1954241 | 32 |
| grep | 583 | 1202889 | 6 |
| glob | 458 | 1957631 | 5 |
| read | 270 | 1797632 | 17 |
| apply_patch | 186 | 1894838 | 8 |
| skill | 82 | 1966686 | 1 |
| todowrite | 27 | 1943939 | 5 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/nextjs-app/openrouter-openai-gpt-5.5-low/opencode-export

- **Total Duration**: 843758 ms
- **Total Tokens**: 129970
- **Cost**: $2.0779

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 15860 | 2266131 | 33 |
| glob | 640 | 2266131 | 5 |
| grep | 620 | 1699506 | 6 |
| apply_patch | 279 | 2218940 | 12 |
| read | 144 | 2078511 | 8 |
| todowrite | 32 | 2274989 | 6 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*

## implementation/nextjs-app/openrouter-openai-gpt-5.5-medium/opencode-export

- **Total Duration**: 790461 ms
- **Total Tokens**: 164641
- **Cost**: $2.0231

### Tool Breakdown

| Tool | Duration (ms) | Tokens | Count |
|------|--------------|--------|-------|
| bash | 11868 | 1587292 | 30 |
| glob | 478 | 1609336 | 5 |
| grep | 390 | 1090208 | 2 |
| read | 186 | 1606242 | 11 |
| apply_patch | 163 | 1538165 | 6 |
| skill | 58 | 1596845 | 1 |
| todowrite | 33 | 1618300 | 5 |

*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*
