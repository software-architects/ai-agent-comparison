# opencode Run Analysis

Analyzed **25** export files across **3** task groups.

## Summary

| Task Group | Model | Duration | Input Tokens | Output Tokens | Reasoning Tokens | Total Tokens | Cost ($) |
|---|---|---|---|---|---|---|---|
| analyze-runs | openrouter-deepseek-deepseek-v4-pro | 11.68 min | 21.072 | 6.832 | 5.096 | 33.000 | 0.0212 |
| analyze-runs | openrouter-mistralai-devstral-2512 | 5.81 min | 275.752 | 12.667 | 0 | 288.419 | 0.1649 |
| analyze-runs | openrouter-mistralai-mistral-medium-3-5 | 10.83 min | 2.581.596 | 15.033 | 0 | 2.596.629 | 3.9851 |
| analyze-runs | openrouter-moonshotai-kimi-k2.6 | 8.03 min | 107.566 | 3.030 | 5.572 | 116.168 | 0.1140 |
| analyze-runs | openrouter-openai-gpt-5.4-high | 3.16 min | 23.860 | 5.037 | 5.835 | 34.732 | 0.2720 |
| analyze-runs | openrouter-openai-gpt-5.4-medium | 2.07 min | 22.320 | 4.819 | 2.291 | 29.430 | 0.1865 |
| analyze-runs | openrouter-openai-gpt-5.5-high | 3.67 min | 33.049 | 6.026 | 4.064 | 43.139 | 0.6889 |
| analyze-runs | openrouter-openai-gpt-5.5-low | 4.77 min | 95.798 | 4.192 | 309 | 100.299 | 0.6532 |
| analyze-runs | openrouter-openai-gpt-5.5-medium | 1.90 min | 43.383 | 4.359 | 1.017 | 48.759 | 0.4409 |
| modify-jazz-chords-app | openrouter-mistralai-devstral-2512 | 1.70 min | 141.958 | 2.379 | 0 | 144.337 | 0.0643 |
| modify-jazz-chords-app | openrouter-mistralai-mistral-medium-3-5 | 1.17 min | 154.765 | 5.697 | 0 | 160.462 | 0.2749 |
| modify-jazz-chords-app | openrouter-moonshotai-kimi-k2.6 | 3.84 min | 97.852 | 4.520 | 1.197 | 103.569 | 0.1018 |
| modify-jazz-chords-app | openrouter-openai-gpt-5.4-high | 3.85 min | 45.810 | 6.530 | 7.060 | 59.400 | 0.4135 |
| modify-jazz-chords-app | openrouter-openai-gpt-5.4-medium | 2.52 min | 36.144 | 6.112 | 2.462 | 44.718 | 0.2879 |
| modify-jazz-chords-app | openrouter-openai-gpt-5.5-high | 7.68 min | 114.680 | 9.281 | 1.874 | 125.835 | 1.0880 |
| modify-jazz-chords-app | openrouter-openai-gpt-5.5-low | 2.51 min | 43.275 | 6.701 | 190 | 50.166 | 0.5601 |
| modify-jazz-chords-app | openrouter-openai-gpt-5.5-medium | 4.07 min | 106.792 | 6.976 | 511 | 114.279 | 0.9076 |
| nextjs-app | openrouter-mistralai-devstral-2512 | 10.77 min | 358.779 | 9.968 | 0 | 368.747 | 0.2272 |
| nextjs-app | openrouter-mistralai-mistral-medium-3-5 | 18.29 min | 3.586.840 | 20.300 | 0 | 3.607.140 | 5.5325 |
| nextjs-app | openrouter-moonshotai-kimi-k2.6 | 74.00 min | 318.661 | 24.745 | 40.002 | 383.408 | 5.5085 |
| nextjs-app | openrouter-openai-gpt-5.4-high | 13.32 min | 82.835 | 12.664 | 19.292 | 114.791 | 1.2322 |
| nextjs-app | openrouter-openai-gpt-5.4-medium | 11.72 min | 88.381 | 13.927 | 10.503 | 112.811 | 1.0866 |
| nextjs-app | openrouter-openai-gpt-5.5 | 14.55 min | 258.618 | 12.771 | 8.905 | 280.294 | 2.8304 |
| nextjs-app | openrouter-openai-gpt-5.5-low | 14.06 min | 117.188 | 10.557 | 2.225 | 129.970 | 2.0779 |
| nextjs-app | openrouter-openai-gpt-5.5-medium | 13.17 min | 146.986 | 11.814 | 5.841 | 164.641 | 2.0231 |

---

## analyze-runs

### openrouter-deepseek-deepseek-v4-pro

**Summary:** Duration: 11.68 min, Tokens: 21.072 in / 6.832 out / 5.096 reasoning (33.000 total), Cost: $0.0212

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| task | 1 | 3.42 min | 3.42 min | 10.062 | 10.062 |
| bash | 10 | 326 ms | 33 ms | 263.718 | 26.372 |
| write | 3 | 38 ms | 13 ms | 34.912 | 11.637 |
| read | 3 | 31 ms | 10 ms | 67.429 | 22.476 |
| todowrite | 3 | 15 ms | 5 ms | 63.542 | 21.181 |
| edit | 1 | 5 ms | 5 ms | 30.381 | 30.381 |

### openrouter-mistralai-devstral-2512

**Summary:** Duration: 5.81 min, Tokens: 275.752 in / 12.667 out / 0 reasoning (288.419 total), Cost: $0.1649

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 12 | 780 ms | 65 ms | 221.193 | 18.433 |
| read | 13 | 346 ms | 27 ms | 347.756 | 26.750 |
| grep | 2 | 209 ms | 105 ms | 37.479 | 18.740 |
| edit | 11 | 77 ms | 7 ms | 298.451 | 27.132 |
| write | 4 | 66 ms | 17 ms | 73.355 | 18.339 |

### openrouter-mistralai-mistral-medium-3-5

**Summary:** Duration: 10.83 min, Tokens: 2.581.596 in / 15.033 out / 0 reasoning (2.596.629 total), Cost: $3.9851

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 18 | 763 ms | 42 ms | 851.537 | 47.308 |
| read | 16 | 347 ms | 22 ms | 721.789 | 45.112 |
| glob | 2 | 282 ms | 141 ms | 10.255 | 5.127 |
| grep | 2 | 150 ms | 75 ms | 91.868 | 45.934 |
| write | 4 | 84 ms | 21 ms | 127.174 | 31.794 |
| edit | 14 | 68 ms | 5 ms | 740.480 | 52.891 |
| todowrite | 4 | 22 ms | 6 ms | 147.949 | 36.987 |

### openrouter-moonshotai-kimi-k2.6

**Summary:** Duration: 8.03 min, Tokens: 107.566 in / 3.030 out / 5.572 reasoning (116.168 total), Cost: $0.1140

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 5 | 168 ms | 34 ms | 56.708 | 11.342 |
| glob | 1 | 95 ms | 95 ms | 9.210 | 9.210 |
| write | 3 | 47 ms | 16 ms | 19.986 | 6.662 |
| read | 2 | 30 ms | 15 ms | 16.914 | 8.457 |
| todowrite | 2 | 10 ms | 5 ms | 12.437 | 6.218 |

### openrouter-openai-gpt-5.4-high

**Summary:** Duration: 3.16 min, Tokens: 23.860 in / 5.037 out / 5.835 reasoning (34.732 total), Cost: $0.2720

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 2 | 178 ms | 89 ms | 52.155 | 26.078 |
| read | 5 | 176 ms | 35 ms | 38.618 | 7.724 |
| glob | 1 | 88 ms | 88 ms | 4.484 | 4.484 |
| apply_patch | 2 | 40 ms | 20 ms | 51.592 | 25.796 |
| todowrite | 3 | 28 ms | 9 ms | 56.458 | 18.819 |

### openrouter-openai-gpt-5.4-medium

**Summary:** Duration: 2.07 min, Tokens: 22.320 in / 4.819 out / 2.291 reasoning (29.430 total), Cost: $0.1865

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| glob | 1 | 214 ms | 214 ms | 2.957 | 2.957 |
| bash | 2 | 91 ms | 46 ms | 21.999 | 10.999 |
| grep | 1 | 75 ms | 75 ms | 4.778 | 4.778 |
| read | 3 | 55 ms | 18 ms | 17.404 | 5.801 |
| apply_patch | 1 | 35 ms | 35 ms | 18.575 | 18.575 |
| todowrite | 3 | 18 ms | 6 ms | 37.062 | 12.354 |

### openrouter-openai-gpt-5.5-high

**Summary:** Duration: 3.67 min, Tokens: 33.049 in / 6.026 out / 4.064 reasoning (43.139 total), Cost: $0.6889

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| read | 8 | 826 ms | 103 ms | 155.907 | 19.488 |
| bash | 5 | 565 ms | 113 ms | 108.076 | 21.615 |
| grep | 3 | 490 ms | 163 ms | 15.745 | 5.248 |
| glob | 3 | 266 ms | 89 ms | 43.518 | 14.506 |
| apply_patch | 2 | 50 ms | 25 ms | 59.559 | 29.780 |
| todowrite | 3 | 20 ms | 7 ms | 66.584 | 22.195 |

### openrouter-openai-gpt-5.5-low

**Summary:** Duration: 4.77 min, Tokens: 95.798 in / 4.192 out / 309 reasoning (100.299 total), Cost: $0.6532

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| glob | 4 | 456 ms | 114 ms | 21.536 | 5.384 |
| read | 5 | 232 ms | 46 ms | 29.183 | 5.837 |
| grep | 2 | 226 ms | 113 ms | 12.219 | 6.110 |
| bash | 1 | 59 ms | 59 ms | 19.151 | 19.151 |
| apply_patch | 1 | 19 ms | 19 ms | 18.496 | 18.496 |
| todowrite | 3 | 18 ms | 6 ms | 56.271 | 18.757 |

### openrouter-openai-gpt-5.5-medium

**Summary:** Duration: 1.90 min, Tokens: 43.383 in / 4.359 out / 1.017 reasoning (48.759 total), Cost: $0.4409

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| read | 4 | 157 ms | 39 ms | 33.715 | 8.429 |
| grep | 1 | 96 ms | 96 ms | 11.420 | 11.420 |
| glob | 2 | 87 ms | 44 ms | 12.862 | 6.431 |
| bash | 2 | 87 ms | 44 ms | 35.437 | 17.719 |
| apply_patch | 1 | 28 ms | 28 ms | 16.306 | 16.306 |
| todowrite | 3 | 17 ms | 6 ms | 44.553 | 14.851 |

---

## modify-jazz-chords-app

### openrouter-mistralai-devstral-2512

**Summary:** Duration: 1.70 min, Tokens: 141.958 in / 2.379 out / 0 reasoning (144.337 total), Cost: $0.0643

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 1 | 1.95 s | 1.95 s | 9.716 | 9.716 |
| read | 6 | 222 ms | 37 ms | 119.384 | 19.897 |
| glob | 2 | 200 ms | 100 ms | 26.432 | 13.216 |
| write | 1 | 15 ms | 15 ms | 29.379 | 29.379 |

### openrouter-mistralai-mistral-medium-3-5

**Summary:** Duration: 1.17 min, Tokens: 154.765 in / 5.697 out / 0 reasoning (160.462 total), Cost: $0.2749

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 1 | 1.42 s | 1.42 s | 9.817 | 9.817 |
| read | 9 | 454 ms | 50 ms | 78.112 | 8.679 |
| glob | 1 | 86 ms | 86 ms | 9.915 | 9.915 |
| write | 1 | 23 ms | 23 ms | 31.199 | 31.199 |

### openrouter-moonshotai-kimi-k2.6

**Summary:** Duration: 3.84 min, Tokens: 97.852 in / 4.520 out / 1.197 reasoning (103.569 total), Cost: $0.1018

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| read | 10 | 270 ms | 27 ms | 37.888 | 3.789 |
| glob | 2 | 194 ms | 97 ms | 10.306 | 5.153 |
| skill | 1 | 85 ms | 85 ms | 24.696 | 24.696 |
| bash | 2 | 36 ms | 18 ms | 11.609 | 5.805 |
| write | 1 | 13 ms | 13 ms | 30.188 | 30.188 |

### openrouter-openai-gpt-5.4-high

**Summary:** Duration: 3.85 min, Tokens: 45.810 in / 6.530 out / 7.060 reasoning (59.400 total), Cost: $0.4135

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| read | 21 | 695 ms | 33 ms | 156.255 | 7.441 |
| glob | 3 | 322 ms | 107 ms | 8.793 | 2.931 |
| grep | 2 | 237 ms | 119 ms | 14.469 | 7.234 |
| skill | 2 | 145 ms | 73 ms | 16.985 | 8.493 |
| todowrite | 4 | 27 ms | 7 ms | 145.982 | 36.496 |
| apply_patch | 1 | 22 ms | 22 ms | 46.777 | 46.777 |

### openrouter-openai-gpt-5.4-medium

**Summary:** Duration: 2.52 min, Tokens: 36.144 in / 6.112 out / 2.462 reasoning (44.718 total), Cost: $0.2879

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| read | 15 | 549 ms | 37 ms | 125.393 | 8.360 |
| grep | 3 | 408 ms | 136 ms | 19.951 | 6.650 |
| glob | 3 | 285 ms | 95 ms | 14.038 | 4.679 |
| bash | 1 | 35 ms | 35 ms | 32.138 | 32.138 |
| apply_patch | 1 | 17 ms | 17 ms | 38.133 | 38.133 |
| todowrite | 2 | 11 ms | 6 ms | 49.486 | 24.743 |

### openrouter-openai-gpt-5.5-high

**Summary:** Duration: 7.68 min, Tokens: 114.680 in / 9.281 out / 1.874 reasoning (125.835 total), Cost: $1.0880

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 4 | 2.03 min | 30.47 s | 70.229 | 17.557 |
| read | 21 | 791 ms | 38 ms | 159.632 | 7.602 |
| glob | 4 | 489 ms | 122 ms | 11.700 | 2.925 |
| grep | 1 | 189 ms | 189 ms | 2.990 | 2.990 |
| skill | 2 | 149 ms | 75 ms | 28.415 | 14.208 |
| todowrite | 5 | 32 ms | 6 ms | 132.639 | 26.528 |
| apply_patch | 1 | 10 ms | 10 ms | 38.752 | 38.752 |

### openrouter-openai-gpt-5.5-low

**Summary:** Duration: 2.51 min, Tokens: 43.275 in / 6.701 out / 190 reasoning (50.166 total), Cost: $0.5601

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| read | 17 | 621 ms | 37 ms | 102.395 | 6.023 |
| glob | 4 | 364 ms | 91 ms | 18.236 | 4.559 |
| skill | 2 | 128 ms | 64 ms | 28.887 | 14.444 |
| grep | 1 | 92 ms | 92 ms | 2.873 | 2.873 |
| todowrite | 4 | 21 ms | 5 ms | 104.167 | 26.042 |
| apply_patch | 1 | 10 ms | 10 ms | 33.102 | 33.102 |

### openrouter-openai-gpt-5.5-medium

**Summary:** Duration: 4.07 min, Tokens: 106.792 in / 6.976 out / 511 reasoning (114.279 total), Cost: $0.9076

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 2 | 2.06 s | 1.03 s | 45.091 | 22.546 |
| read | 18 | 1.01 s | 56 ms | 123.442 | 6.858 |
| glob | 7 | 767 ms | 110 ms | 18.486 | 2.641 |
| grep | 1 | 177 ms | 177 ms | 6.819 | 6.819 |
| skill | 2 | 146 ms | 73 ms | 30.179 | 15.090 |
| todowrite | 5 | 23 ms | 5 ms | 117.755 | 23.551 |
| apply_patch | 1 | 9 ms | 9 ms | 34.356 | 34.356 |

---

## nextjs-app

### openrouter-mistralai-devstral-2512

**Summary:** Duration: 10.77 min, Tokens: 358.779 in / 9.968 out / 0 reasoning (368.747 total), Cost: $0.2272

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 38 | 38.78 s | 1.02 s | 1.116.556 | 29.383 |
| write | 19 | 261 ms | 14 ms | 346.211 | 18.222 |
| todowrite | 13 | 64 ms | 5 ms | 249.549 | 19.196 |
| edit | 7 | 34 ms | 5 ms | 204.446 | 29.207 |

### openrouter-mistralai-mistral-medium-3-5

**Summary:** Duration: 18.29 min, Tokens: 3.586.840 in / 20.300 out / 0 reasoning (3.607.140 total), Cost: $5.5325

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 50 | 16.15 s | 323 ms | 2.174.643 | 43.493 |
| write | 29 | 351 ms | 12 ms | 696.686 | 24.024 |
| read | 8 | 166 ms | 21 ms | 393.997 | 49.250 |
| skill | 1 | 83 ms | 83 ms | 18.017 | 18.017 |
| edit | 11 | 54 ms | 5 ms | 566.142 | 51.467 |
| todowrite | 2 | 11 ms | 6 ms | 21.399 | 10.700 |

### openrouter-moonshotai-kimi-k2.6

**Summary:** Duration: 74.00 min, Tokens: 318.661 in / 24.745 out / 40.002 reasoning (383.408 total), Cost: $5.5085

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 113 | 42.88 s | 379 ms | 10.467.635 | 92.634 |
| read | 37 | 692 ms | 19 ms | 3.820.071 | 103.245 |
| write | 45 | 641 ms | 14 ms | 1.950.635 | 43.347 |
| glob | 7 | 507 ms | 72 ms | 1.036.941 | 148.134 |
| webfetch | 2 | 419 ms | 210 ms | 105.455 | 52.728 |
| skill | 2 | 152 ms | 76 ms | 161.247 | 80.624 |
| edit | 23 | 128 ms | 6 ms | 2.484.531 | 108.023 |
| grep | 1 | 73 ms | 73 ms | 162.543 | 162.543 |
| todowrite | 5 | 26 ms | 5 ms | 393.682 | 78.736 |

### openrouter-openai-gpt-5.4-high

**Summary:** Duration: 13.32 min, Tokens: 82.835 in / 12.664 out / 19.292 reasoning (114.791 total), Cost: $1.2322

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 23 | 12.51 s | 544 ms | 1.027.956 | 44.694 |
| grep | 8 | 4.12 s | 515 ms | 250.042 | 31.255 |
| webfetch | 7 | 1.60 s | 229 ms | 68.482 | 9.783 |
| glob | 3 | 355 ms | 118 ms | 88.780 | 29.593 |
| read | 9 | 228 ms | 25 ms | 164.017 | 18.224 |
| apply_patch | 7 | 214 ms | 31 ms | 456.322 | 65.189 |
| todowrite | 4 | 30 ms | 8 ms | 147.765 | 36.941 |

### openrouter-openai-gpt-5.4-medium

**Summary:** Duration: 11.72 min, Tokens: 88.381 in / 13.927 out / 10.503 reasoning (112.811 total), Cost: $1.0866

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 35 | 10.24 s | 293 ms | 875.362 | 25.010 |
| grep | 7 | 4.94 s | 705 ms | 200.974 | 28.711 |
| glob | 6 | 439 ms | 73 ms | 70.782 | 11.797 |
| apply_patch | 9 | 225 ms | 25 ms | 351.058 | 39.006 |
| read | 11 | 150 ms | 14 ms | 310.966 | 28.270 |
| todowrite | 6 | 36 ms | 6 ms | 203.440 | 33.907 |

### openrouter-openai-gpt-5.5

**Summary:** Duration: 14.55 min, Tokens: 258.618 in / 12.771 out / 8.905 reasoning (280.294 total), Cost: $2.8304

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 32 | 16.34 s | 511 ms | 986.133 | 30.817 |
| grep | 6 | 583 ms | 97 ms | 206.226 | 34.371 |
| glob | 5 | 458 ms | 92 ms | 68.875 | 13.775 |
| read | 17 | 270 ms | 16 ms | 386.398 | 22.729 |
| apply_patch | 8 | 186 ms | 23 ms | 272.802 | 34.100 |
| skill | 1 | 82 ms | 82 ms | 9.055 | 9.055 |
| todowrite | 5 | 27 ms | 5 ms | 124.885 | 24.977 |

### openrouter-openai-gpt-5.5-low

**Summary:** Duration: 14.06 min, Tokens: 117.188 in / 10.557 out / 2.225 reasoning (129.970 total), Cost: $2.0779

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 33 | 15.86 s | 481 ms | 1.132.266 | 34.311 |
| glob | 5 | 640 ms | 128 ms | 118.795 | 23.759 |
| grep | 6 | 620 ms | 103 ms | 229.326 | 38.221 |
| apply_patch | 12 | 279 ms | 23 ms | 415.718 | 34.643 |
| read | 8 | 144 ms | 18 ms | 242.384 | 30.298 |
| todowrite | 6 | 32 ms | 5 ms | 141.070 | 23.512 |

### openrouter-openai-gpt-5.5-medium

**Summary:** Duration: 13.17 min, Tokens: 146.986 in / 11.814 out / 5.841 reasoning (164.641 total), Cost: $2.0231

**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)

| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |
|---|---|---|---|---|---|
| bash | 30 | 11.87 s | 396 ms | 889.940 | 29.665 |
| glob | 5 | 478 ms | 96 ms | 68.085 | 13.617 |
| grep | 2 | 390 ms | 195 ms | 72.003 | 36.002 |
| read | 11 | 186 ms | 17 ms | 295.691 | 26.881 |
| apply_patch | 6 | 163 ms | 27 ms | 187.794 | 31.299 |
| skill | 1 | 58 ms | 58 ms | 9.553 | 9.553 |
| todowrite | 5 | 33 ms | 7 ms | 113.138 | 22.628 |
