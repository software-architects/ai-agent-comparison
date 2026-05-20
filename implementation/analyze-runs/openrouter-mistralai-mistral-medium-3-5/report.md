# Opencode Runs Analysis

*Note: Tool tokens are approximated by splitting each step's tokens evenly across its tool calls.*

## Summary

| Run | Model | Duration (ms) | Total Tokens | Cost |
|-----|-------|---------------|--------------|------|
| implementation/analyze-runs/openrouter-mistralai-devstral-2512 | mistralai/devstral-2512 (default) | 348443 | 1019395 | 0.1649 |
| implementation/analyze-runs/openrouter-mistralai-mistral-medium-3-5 | mistralai/mistral-medium-3-5 (default) | 649939 | 2755813 | 3.9851 |
| implementation/analyze-runs/openrouter-moonshotai-kimi-k2.6 | moonshotai/kimi-k2.6 (default) | 481941 | 137879 | 0.1140 |
| implementation/analyze-runs/openrouter-openai-gpt-5.4-high | openai/gpt-5.4 (high) | 189467 | 231852 | 0.2720 |
| implementation/analyze-runs/openrouter-openai-gpt-5.4-medium | openai/gpt-5.4 (medium) | 124194 | 125686 | 0.1865 |
| implementation/analyze-runs/openrouter-openai-gpt-5.5-high | openai/gpt-5.5 (high) | 220352 | 484995 | 0.6889 |
| implementation/analyze-runs/openrouter-openai-gpt-5.5-low | openai/gpt-5.5 (low) | 286157 | 178635 | 0.6532 |
| implementation/analyze-runs/openrouter-openai-gpt-5.5-medium | openai/gpt-5.5 (medium) | 113960 | 174199 | 0.4409 |
| implementation/modify-jazz-chords-app/openrouter-mistralai-devstral-2512 | mistralai/devstral-2512 (default) | 102223 | 214321 | 0.0643 |
| implementation/modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5 | mistralai/mistral-medium-3-5 (default) | 70353 | 160462 | 0.2749 |
| implementation/modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6 | moonshotai/kimi-k2.6 (default) | 230672 | 145249 | 0.1018 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-high | openai/gpt-5.4 (high) | 230713 | 439944 | 0.4135 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium | openai/gpt-5.4 (medium) | 151348 | 320430 | 0.2879 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-high | openai/gpt-5.5 (high) | 460690 | 485771 | 1.0880 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-low | openai/gpt-5.5 (low) | 150453 | 324086 | 0.5601 |
| implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium | openai/gpt-5.5 (medium) | 244415 | 412263 | 0.9076 |
| implementation/nextjs-app/openrouter-mistralai-devstral-2512 | mistralai/devstral-2512 (default) | 646024 | 1962283 | 0.2272 |
| implementation/nextjs-app/openrouter-mistralai-mistral-medium-3-5 | mistralai/mistral-medium-3-5 (default) | 1097676 | 3870884 | 5.5325 |
| implementation/nextjs-app/openrouter-moonshotai-kimi-k2.6 | moonshotai/kimi-k2.6 (default) | 4440289 | 20583152 | 5.5085 |
| implementation/nextjs-app/openrouter-openai-gpt-5.4-high | openai/gpt-5.4 (high) | 799010 | 2297831 | 1.2322 |
| implementation/nextjs-app/openrouter-openai-gpt-5.4-medium | openai/gpt-5.4 (medium) | 702982 | 2109483 | 1.0866 |
| implementation/nextjs-app/openrouter-openai-gpt-5.5 | openai/gpt-5.5 (high) | 873000 | 2054374 | 2.8304 |
| implementation/nextjs-app/openrouter-openai-gpt-5.5-low | openai/gpt-5.5 (low) | 843758 | 2346930 | 2.0779 |
| implementation/nextjs-app/openrouter-openai-gpt-5.5-medium | openai/gpt-5.5 (medium) | 790461 | 1681697 | 2.0231 |

## analyze-runs

### implementation/analyze-runs/openrouter-mistralai-devstral-2512

- **Model:** mistralai/devstral-2512 (default)
- **Duration:** 348443 ms
- **Total Tokens:** 1019395
- **Cost:** 0.1649

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 12 | 780 | 221193 |
| read | 13 | 346 | 347756 |
| grep | 2 | 209 | 37479 |
| edit | 11 | 77 | 298451 |
| write | 4 | 66 | 73355 |

### implementation/analyze-runs/openrouter-mistralai-mistral-medium-3-5

- **Model:** mistralai/mistral-medium-3-5 (default)
- **Duration:** 649939 ms
- **Total Tokens:** 2755813
- **Cost:** 3.9851

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 18 | 763 | 851537 |
| read | 16 | 347 | 721789 |
| glob | 2 | 282 | 10255 |
| grep | 2 | 150 | 91868 |
| write | 4 | 84 | 127174 |
| edit | 14 | 68 | 740480 |
| todowrite | 4 | 22 | 147949 |

### implementation/analyze-runs/openrouter-moonshotai-kimi-k2.6

- **Model:** moonshotai/kimi-k2.6 (default)
- **Duration:** 481941 ms
- **Total Tokens:** 137879
- **Cost:** 0.1140

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 5 | 168 | 56708 |
| glob | 1 | 95 | 9210 |
| write | 3 | 47 | 19986 |
| read | 2 | 30 | 16914 |
| todowrite | 2 | 10 | 12437 |

### implementation/analyze-runs/openrouter-openai-gpt-5.4-high

- **Model:** openai/gpt-5.4 (high)
- **Duration:** 189467 ms
- **Total Tokens:** 231852
- **Cost:** 0.2720

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 2 | 178 | 52155 |
| read | 5 | 176 | 38618 |
| glob | 1 | 88 | 4484 |
| apply_patch | 2 | 40 | 51592 |
| todowrite | 3 | 28 | 56458 |

### implementation/analyze-runs/openrouter-openai-gpt-5.4-medium

- **Model:** openai/gpt-5.4 (medium)
- **Duration:** 124194 ms
- **Total Tokens:** 125686
- **Cost:** 0.1865

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| glob | 1 | 214 | 2957 |
| bash | 2 | 91 | 21999 |
| grep | 1 | 75 | 4778 |
| read | 3 | 55 | 17404 |
| apply_patch | 1 | 35 | 18575 |
| todowrite | 3 | 18 | 37062 |

### implementation/analyze-runs/openrouter-openai-gpt-5.5-high

- **Model:** openai/gpt-5.5 (high)
- **Duration:** 220352 ms
- **Total Tokens:** 484995
- **Cost:** 0.6889

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| read | 8 | 826 | 155907 |
| bash | 5 | 565 | 108076 |
| grep | 3 | 490 | 15745 |
| glob | 3 | 266 | 43518 |
| apply_patch | 2 | 50 | 59559 |
| todowrite | 3 | 20 | 66584 |

### implementation/analyze-runs/openrouter-openai-gpt-5.5-low

- **Model:** openai/gpt-5.5 (low)
- **Duration:** 286157 ms
- **Total Tokens:** 178635
- **Cost:** 0.6532

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| glob | 4 | 456 | 21536 |
| read | 5 | 232 | 29183 |
| grep | 2 | 226 | 12219 |
| bash | 1 | 59 | 19151 |
| apply_patch | 1 | 19 | 18496 |
| todowrite | 3 | 18 | 56271 |

### implementation/analyze-runs/openrouter-openai-gpt-5.5-medium

- **Model:** openai/gpt-5.5 (medium)
- **Duration:** 113960 ms
- **Total Tokens:** 174199
- **Cost:** 0.4409

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| read | 4 | 157 | 33715 |
| grep | 1 | 96 | 11420 |
| glob | 2 | 87 | 12862 |
| bash | 2 | 87 | 35437 |
| apply_patch | 1 | 28 | 16306 |
| todowrite | 3 | 17 | 44553 |

## modify-jazz-chords-app

### implementation/modify-jazz-chords-app/openrouter-mistralai-devstral-2512

- **Model:** mistralai/devstral-2512 (default)
- **Duration:** 102223 ms
- **Total Tokens:** 214321
- **Cost:** 0.0643

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 1 | 1954 | 9716 |
| read | 6 | 222 | 119384 |
| glob | 2 | 200 | 26432 |
| write | 1 | 15 | 29379 |

### implementation/modify-jazz-chords-app/openrouter-mistralai-mistral-medium-3-5

- **Model:** mistralai/mistral-medium-3-5 (default)
- **Duration:** 70353 ms
- **Total Tokens:** 160462
- **Cost:** 0.2749

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 1 | 1419 | 9817 |
| read | 9 | 454 | 78112 |
| glob | 1 | 86 | 9915 |
| write | 1 | 23 | 31199 |

### implementation/modify-jazz-chords-app/openrouter-moonshotai-kimi-k2.6

- **Model:** moonshotai/kimi-k2.6 (default)
- **Duration:** 230672 ms
- **Total Tokens:** 145249
- **Cost:** 0.1018

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| read | 10 | 270 | 37888 |
| glob | 2 | 194 | 10306 |
| skill | 1 | 85 | 24696 |
| bash | 2 | 36 | 11609 |
| write | 1 | 13 | 30188 |

### implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-high

- **Model:** openai/gpt-5.4 (high)
- **Duration:** 230713 ms
- **Total Tokens:** 439944
- **Cost:** 0.4135

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| read | 21 | 695 | 156255 |
| glob | 3 | 322 | 8793 |
| grep | 2 | 237 | 14469 |
| skill | 2 | 145 | 16985 |
| todowrite | 4 | 27 | 145982 |
| apply_patch | 1 | 22 | 46777 |

### implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.4-medium

- **Model:** openai/gpt-5.4 (medium)
- **Duration:** 151348 ms
- **Total Tokens:** 320430
- **Cost:** 0.2879

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| read | 15 | 549 | 125393 |
| grep | 3 | 408 | 19951 |
| glob | 3 | 285 | 14038 |
| bash | 1 | 35 | 32138 |
| apply_patch | 1 | 17 | 38133 |
| todowrite | 2 | 11 | 49486 |

### implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-high

- **Model:** openai/gpt-5.5 (high)
- **Duration:** 460690 ms
- **Total Tokens:** 485771
- **Cost:** 1.0880

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 4 | 121864 | 70229 |
| read | 21 | 791 | 159632 |
| glob | 4 | 489 | 11700 |
| grep | 1 | 189 | 2990 |
| skill | 2 | 149 | 28415 |
| todowrite | 5 | 32 | 132639 |
| apply_patch | 1 | 10 | 38752 |

### implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-low

- **Model:** openai/gpt-5.5 (low)
- **Duration:** 150453 ms
- **Total Tokens:** 324086
- **Cost:** 0.5601

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| read | 17 | 621 | 102395 |
| glob | 4 | 364 | 18236 |
| skill | 2 | 128 | 28887 |
| grep | 1 | 92 | 2873 |
| todowrite | 4 | 21 | 104167 |
| apply_patch | 1 | 10 | 33102 |

### implementation/modify-jazz-chords-app/openrouter-openai-gpt-5.5-medium

- **Model:** openai/gpt-5.5 (medium)
- **Duration:** 244415 ms
- **Total Tokens:** 412263
- **Cost:** 0.9076

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 2 | 2060 | 45091 |
| read | 18 | 1014 | 123442 |
| glob | 7 | 767 | 18486 |
| grep | 1 | 177 | 6819 |
| skill | 2 | 146 | 30179 |
| todowrite | 5 | 23 | 117755 |
| apply_patch | 1 | 9 | 34356 |

## nextjs-app

### implementation/nextjs-app/openrouter-mistralai-devstral-2512

- **Model:** mistralai/devstral-2512 (default)
- **Duration:** 646024 ms
- **Total Tokens:** 1962283
- **Cost:** 0.2272

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 38 | 38777 | 1116556 |
| write | 19 | 261 | 346211 |
| todowrite | 13 | 64 | 249549 |
| edit | 7 | 34 | 204446 |

### implementation/nextjs-app/openrouter-mistralai-mistral-medium-3-5

- **Model:** mistralai/mistral-medium-3-5 (default)
- **Duration:** 1097676 ms
- **Total Tokens:** 3870884
- **Cost:** 5.5325

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 50 | 16151 | 2174643 |
| write | 29 | 351 | 696686 |
| read | 8 | 166 | 393997 |
| skill | 1 | 83 | 18017 |
| edit | 11 | 54 | 566142 |
| todowrite | 2 | 11 | 21399 |

### implementation/nextjs-app/openrouter-moonshotai-kimi-k2.6

- **Model:** moonshotai/kimi-k2.6 (default)
- **Duration:** 4440289 ms
- **Total Tokens:** 20583152
- **Cost:** 5.5085

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 113 | 42878 | 10467635 |
| read | 37 | 692 | 3820071 |
| write | 45 | 641 | 1950635 |
| glob | 7 | 507 | 1036941 |
| webfetch | 2 | 419 | 105455 |
| skill | 2 | 152 | 161247 |
| edit | 23 | 128 | 2484531 |
| grep | 1 | 73 | 162543 |
| todowrite | 5 | 26 | 393682 |

### implementation/nextjs-app/openrouter-openai-gpt-5.4-high

- **Model:** openai/gpt-5.4 (high)
- **Duration:** 799010 ms
- **Total Tokens:** 2297831
- **Cost:** 1.2322

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 23 | 12508 | 1027956 |
| grep | 8 | 4121 | 250042 |
| webfetch | 7 | 1600 | 68482 |
| glob | 3 | 355 | 88780 |
| read | 9 | 228 | 164017 |
| apply_patch | 7 | 214 | 456322 |
| todowrite | 4 | 30 | 147765 |

### implementation/nextjs-app/openrouter-openai-gpt-5.4-medium

- **Model:** openai/gpt-5.4 (medium)
- **Duration:** 702982 ms
- **Total Tokens:** 2109483
- **Cost:** 1.0866

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 35 | 10240 | 875362 |
| grep | 7 | 4936 | 200974 |
| glob | 6 | 439 | 70782 |
| apply_patch | 9 | 225 | 351058 |
| read | 11 | 150 | 310966 |
| todowrite | 6 | 36 | 203440 |

### implementation/nextjs-app/openrouter-openai-gpt-5.5

- **Model:** openai/gpt-5.5 (high)
- **Duration:** 873000 ms
- **Total Tokens:** 2054374
- **Cost:** 2.8304

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 32 | 16341 | 986133 |
| grep | 6 | 583 | 206226 |
| glob | 5 | 458 | 68875 |
| read | 17 | 270 | 386398 |
| apply_patch | 8 | 186 | 272802 |
| skill | 1 | 82 | 9055 |
| todowrite | 5 | 27 | 124885 |

### implementation/nextjs-app/openrouter-openai-gpt-5.5-low

- **Model:** openai/gpt-5.5 (low)
- **Duration:** 843758 ms
- **Total Tokens:** 2346930
- **Cost:** 2.0779

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 33 | 15860 | 1132266 |
| glob | 5 | 640 | 118795 |
| grep | 6 | 620 | 229326 |
| apply_patch | 12 | 279 | 415718 |
| read | 8 | 144 | 242384 |
| todowrite | 6 | 32 | 141070 |

### implementation/nextjs-app/openrouter-openai-gpt-5.5-medium

- **Model:** openai/gpt-5.5 (medium)
- **Duration:** 790461 ms
- **Total Tokens:** 1681697
- **Cost:** 2.0231

#### Tool Breakdown

| Tool | Calls | Total Time (ms) | Approx Tokens |
|------|-------|-----------------|---------------|
| bash | 30 | 11868 | 889940 |
| glob | 5 | 478 | 68085 |
| grep | 2 | 390 | 72003 |
| read | 11 | 186 | 295691 |
| apply_patch | 6 | 163 | 187794 |
| skill | 1 | 58 | 9553 |
| todowrite | 5 | 33 | 113138 |
