# Opencode Runs Analysis

*Note: Tool tokens are approximated by splitting each step's tokens evenly across its tool calls.*

## Summary

| Run | Model | Duration (ms) | Total Tokens | Cost |
|-----|-------|---------------|--------------|------|
| implementation/analyze-runs/openrouter-moonshotai-kimi-k2.6 | moonshotai/kimi-k2.6 (default) | 481941 | 137879 | 0.1140 |
| implementation/analyze-runs/openrouter-openai-gpt-5.5-high | openai/gpt-5.5 (high) | 220352 | 484995 | 0.6889 |
| implementation/analyze-runs/openrouter-openai-gpt-5.5-medium | openai/gpt-5.5 (medium) | 113960 | 174199 | 0.4409 |
| implementation/nextjs-app/openrouter-openai-gpt-5.5 | openai/gpt-5.5 (high) | 873000 | 2054374 | 2.8304 |
| implementation/nextjs-app/openrouter-openai-gpt-5.5-medium | openai/gpt-5.5 (medium) | 790461 | 1681697 | 2.0231 |

## analyze-runs

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

## nextjs-app

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
