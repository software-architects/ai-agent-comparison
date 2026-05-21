# OpenCode Run Comparison Report

Generated: 2026-05-20T12:53:15.883Z

## analyze-runs

### Summary

| # | Run | Model | Duration | Tokens | Cost |
| - | --- | ----- | -------- | ------ | ---- |
| 1 | openrouter-openai-gpt-5.5-medium | openai/gpt-5.5 | 1m 54s | 48.8K | $0.4409 |
| 2 | openrouter-openai-gpt-5.4-medium | openai/gpt-5.4 | 2m 4s | 29.4K | $0.1865 |
| 3 | openrouter-openai-gpt-5.4-high | openai/gpt-5.4 | 3m 9s | 34.7K | $0.2720 |
| 4 | openrouter-openai-gpt-5.5-high | openai/gpt-5.5 | 3m 40s | 43.1K | $0.6889 |
| 5 | openrouter-openai-gpt-5.5-low | openai/gpt-5.5 | 4m 46s | 100.3K | $0.6532 |
| 6 | openrouter-mistralai-devstral-2512 | mistralai/devstral-2512 | 5m 48s | 288.4K | $0.1649 |
| 7 | openrouter-moonshotai-kimi-k2.6 | moonshotai/kimi-k2.6 | 8m 2s | 116.2K | $0.1140 |
| 8 | openrouter-mistralai-mistral-medium-3-5 | mistralai/mistral-medium-3-5 | 10m 50s | 2.6M | $3.9851 |

### openrouter-openai-gpt-5.5-medium

> Model: openai/gpt-5.5 | Total duration: 1m 54s | Total tokens: 48.8K | Cost: $0.4409
> Tool time: 0.5s | Approx. tool tokens: 47.8K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| read | 4 | 0.2s | 33.3% | 21.4K |
| grep | 1 | 0.1s | 20.3% | 3.2K |
| glob | 2 | 0.1s | 18.4% | 573 |
| bash | 2 | 0.1s | 18.4% | 3.2K |
| apply_patch | 1 | 0.0s | 5.9% | 5.0K |
| todowrite | 3 | 0.0s | 3.6% | 14.3K |

### openrouter-openai-gpt-5.4-medium

> Model: openai/gpt-5.4 | Total duration: 2m 4s | Total tokens: 29.4K | Cost: $0.1865
> Tool time: 0.5s | Approx. tool tokens: 25.5K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| glob | 1 | 0.2s | 43.9% | 226 |
| bash | 2 | 0.1s | 18.6% | 580 |
| grep | 1 | 0.1s | 15.4% | 490 |
| read | 3 | 0.1s | 11.3% | 977 |
| apply_patch | 1 | 0.0s | 7.2% | 9.4K |
| todowrite | 3 | 0.0s | 3.7% | 13.8K |

### openrouter-openai-gpt-5.4-high

> Model: openai/gpt-5.4 | Total duration: 3m 9s | Total tokens: 34.7K | Cost: $0.2720
> Tool time: 0.5s | Approx. tool tokens: 34.2K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 2 | 0.2s | 34.9% | 4.5K |
| read | 5 | 0.2s | 34.5% | 1.6K |
| glob | 1 | 0.1s | 17.3% | 195 |
| apply_patch | 2 | 0.0s | 7.8% | 8.5K |
| todowrite | 3 | 0.0s | 5.5% | 19.5K |

### openrouter-openai-gpt-5.5-high

> Model: openai/gpt-5.5 | Total duration: 3m 40s | Total tokens: 43.1K | Cost: $0.6889
> Tool time: 2.2s | Approx. tool tokens: 42.3K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| read | 8 | 0.8s | 37.3% | 12.3K |
| bash | 5 | 0.6s | 25.5% | 8.5K |
| grep | 3 | 0.5s | 22.1% | 7.0K |
| glob | 3 | 0.3s | 12.0% | 2.0K |
| apply_patch | 2 | 0.1s | 2.3% | 7.8K |
| todowrite | 3 | 0.0s | 0.9% | 4.6K |

### openrouter-openai-gpt-5.5-low

> Model: openai/gpt-5.5 | Total duration: 4m 46s | Total tokens: 100.3K | Cost: $0.6532
> Tool time: 1.0s | Approx. tool tokens: 78.5K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| glob | 4 | 0.5s | 45.1% | 11.0K |
| read | 5 | 0.2s | 23.0% | 3.9K |
| grep | 2 | 0.2s | 22.4% | 12.2K |
| bash | 1 | 0.1s | 5.8% | 19.2K |
| apply_patch | 1 | 0.0s | 1.9% | 18.5K |
| todowrite | 3 | 0.0s | 1.8% | 13.8K |

### openrouter-mistralai-devstral-2512

> Model: mistralai/devstral-2512 | Total duration: 5m 48s | Total tokens: 288.4K | Cost: $0.1649
> Tool time: 1.5s | Approx. tool tokens: 273.7K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 12 | 0.8s | 52.8% | 70.3K |
| read | 13 | 0.3s | 23.4% | 75.4K |
| grep | 2 | 0.2s | 14.1% | 11.1K |
| edit | 11 | 0.1s | 5.2% | 102.6K |
| write | 4 | 0.1s | 4.5% | 14.3K |

### openrouter-moonshotai-kimi-k2.6

> Model: moonshotai/kimi-k2.6 | Total duration: 8m 2s | Total tokens: 116.2K | Cost: $0.1140
> Tool time: 0.3s | Approx. tool tokens: 93.6K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 5 | 0.2s | 48.0% | 56.6K |
| glob | 1 | 0.1s | 27.1% | 442 |
| write | 3 | 0.0s | 13.4% | 20.0K |
| read | 2 | 0.0s | 8.6% | 10.5K |
| todowrite | 2 | 0.0s | 2.9% | 6.0K |

### openrouter-mistralai-mistral-medium-3-5

> Model: mistralai/mistral-medium-3-5 | Total duration: 10m 50s | Total tokens: 2.6M | Cost: $3.9851
> Tool time: 1.7s | Approx. tool tokens: 2.5M (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 18 | 0.8s | 44.5% | 807.2K |
| read | 16 | 0.3s | 20.2% | 675.1K |
| glob | 2 | 0.3s | 16.4% | 9.3K |
| grep | 2 | 0.1s | 8.7% | 91.9K |
| write | 4 | 0.1s | 4.9% | 125.4K |
| edit | 14 | 0.1s | 4.0% | 676.8K |
| todowrite | 4 | 0.0s | 1.3% | 146.1K |

---

## modify-jazz-chords-app

### Summary

| # | Run | Model | Duration | Tokens | Cost |
| - | --- | ----- | -------- | ------ | ---- |
| 1 | openrouter-mistralai-mistral-medium-3-5 | mistralai/mistral-medium-3-5 | 1m 10s | 160.5K | $0.2749 |
| 2 | openrouter-mistralai-devstral-2512 | mistralai/devstral-2512 | 1m 42s | 144.3K | $0.0643 |
| 3 | openrouter-openai-gpt-5.5-low | openai/gpt-5.5 | 2m 30s | 50.2K | $0.5601 |
| 4 | openrouter-openai-gpt-5.4-medium | openai/gpt-5.4 | 2m 31s | 44.7K | $0.2879 |
| 5 | openrouter-moonshotai-kimi-k2.6 | moonshotai/kimi-k2.6 | 3m 51s | 103.6K | $0.1018 |
| 6 | openrouter-openai-gpt-5.4-high | openai/gpt-5.4 | 3m 51s | 59.4K | $0.4135 |
| 7 | openrouter-openai-gpt-5.5-medium | openai/gpt-5.5 | 4m 4s | 114.3K | $0.9076 |
| 8 | openrouter-openai-gpt-5.5-high | openai/gpt-5.5 | 7m 41s | 125.8K | $1.0880 |

### openrouter-mistralai-mistral-medium-3-5

> Model: mistralai/mistral-medium-3-5 | Total duration: 1m 10s | Total tokens: 160.5K | Cost: $0.2749
> Tool time: 2.0s | Approx. tool tokens: 129.0K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 1 | 1.4s | 71.6% | 9.8K |
| read | 9 | 0.5s | 22.9% | 78.1K |
| glob | 1 | 0.1s | 4.3% | 9.9K |
| write | 1 | 0.0s | 1.2% | 31.2K |

### openrouter-mistralai-devstral-2512

> Model: mistralai/devstral-2512 | Total duration: 1m 42s | Total tokens: 144.3K | Cost: $0.0643
> Tool time: 2.4s | Approx. tool tokens: 124.7K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 1 | 2.0s | 81.7% | 7.9K |
| read | 6 | 0.2s | 9.3% | 84.4K |
| glob | 2 | 0.2s | 8.4% | 22.8K |
| write | 1 | 0.0s | 0.6% | 9.5K |

### openrouter-openai-gpt-5.5-low

> Model: openai/gpt-5.5 | Total duration: 2m 30s | Total tokens: 50.2K | Cost: $0.5601
> Tool time: 1.2s | Approx. tool tokens: 49.5K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| read | 17 | 0.6s | 50.2% | 8.5K |
| glob | 4 | 0.4s | 29.4% | 1.5K |
| skill | 2 | 0.1s | 10.4% | 15.6K |
| grep | 1 | 0.1s | 7.4% | 312 |
| todowrite | 4 | 0.0s | 1.7% | 18.2K |
| apply_patch | 1 | 0.0s | 0.8% | 5.5K |

### openrouter-openai-gpt-5.4-medium

> Model: openai/gpt-5.4 | Total duration: 2m 31s | Total tokens: 44.7K | Cost: $0.2879
> Tool time: 1.3s | Approx. tool tokens: 44.2K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| read | 15 | 0.5s | 42.1% | 19.7K |
| grep | 3 | 0.4s | 31.3% | 3.7K |
| glob | 3 | 0.3s | 21.8% | 1.4K |
| bash | 1 | 0.0s | 2.7% | 1.9K |
| apply_patch | 1 | 0.0s | 1.3% | 6.1K |
| todowrite | 2 | 0.0s | 0.8% | 11.3K |

### openrouter-moonshotai-kimi-k2.6

> Model: moonshotai/kimi-k2.6 | Total duration: 3m 51s | Total tokens: 103.6K | Cost: $0.1018
> Tool time: 0.6s | Approx. tool tokens: 73.0K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| read | 10 | 0.3s | 45.2% | 29.2K |
| glob | 2 | 0.2s | 32.4% | 1.8K |
| skill | 1 | 0.1s | 14.2% | 24.7K |
| bash | 2 | 0.0s | 6.0% | 11.6K |
| write | 1 | 0.0s | 2.2% | 5.8K |

### openrouter-openai-gpt-5.4-high

> Model: openai/gpt-5.4 | Total duration: 3m 51s | Total tokens: 59.4K | Cost: $0.4135
> Tool time: 1.4s | Approx. tool tokens: 58.9K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| read | 21 | 0.7s | 48.0% | 22.1K |
| glob | 3 | 0.3s | 22.2% | 729 |
| grep | 2 | 0.2s | 16.4% | 4.0K |
| skill | 2 | 0.1s | 10.0% | 2.0K |
| todowrite | 4 | 0.0s | 1.9% | 22.7K |
| apply_patch | 1 | 0.0s | 1.5% | 7.4K |

### openrouter-openai-gpt-5.5-medium

> Model: openai/gpt-5.5 | Total duration: 4m 4s | Total tokens: 114.3K | Cost: $0.9076
> Tool time: 4.2s | Approx. tool tokens: 113.5K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 2 | 2.1s | 49.1% | 2.1K |
| read | 18 | 1.0s | 24.2% | 33.1K |
| glob | 7 | 0.8s | 18.3% | 2.1K |
| grep | 1 | 0.2s | 4.2% | 2.5K |
| skill | 2 | 0.1s | 3.5% | 7.1K |
| todowrite | 5 | 0.0s | 0.5% | 61.4K |
| apply_patch | 1 | 0.0s | 0.2% | 5.2K |

### openrouter-openai-gpt-5.5-high

> Model: openai/gpt-5.5 | Total duration: 7m 41s | Total tokens: 125.8K | Cost: $1.0880
> Tool time: 2m 4s | Approx. tool tokens: 125.4K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 4 | 2m 2s | 98.7% | 12.9K |
| read | 21 | 0.8s | 0.6% | 49.5K |
| glob | 4 | 0.5s | 0.4% | 11.7K |
| grep | 1 | 0.2s | 0.2% | 3.0K |
| skill | 2 | 0.1s | 0.1% | 18.2K |
| todowrite | 5 | 0.0s | 0.0% | 22.0K |
| apply_patch | 1 | 0.0s | 0.0% | 8.0K |

---

## nextjs-app

### Summary

| # | Run | Model | Duration | Tokens | Cost |
| - | --- | ----- | -------- | ------ | ---- |
| 1 | openrouter-mistralai-devstral-2512 | mistralai/devstral-2512 | 10m 46s | 368.7K | $0.2272 |
| 2 | openrouter-openai-gpt-5.4-medium | openai/gpt-5.4 | 11m 43s | 112.8K | $1.0866 |
| 3 | openrouter-openai-gpt-5.5-medium | openai/gpt-5.5 | 13m 10s | 164.6K | $2.0231 |
| 4 | openrouter-openai-gpt-5.4-high | openai/gpt-5.4 | 13m 19s | 114.8K | $1.2322 |
| 5 | openrouter-openai-gpt-5.5-low | openai/gpt-5.5 | 14m 4s | 130.0K | $2.0779 |
| 6 | openrouter-openai-gpt-5.5-high | openai/gpt-5.5 | 14m 33s | 280.3K | $2.8304 |
| 7 | openrouter-mistralai-mistral-medium-3-5 | mistralai/mistral-medium-3-5 | 18m 18s | 3.6M | $5.5325 |
| 8 | openrouter-moonshotai-kimi-k2.6 | moonshotai/kimi-k2.6 | 74m 0s | 383.4K | $5.5085 |

### openrouter-mistralai-devstral-2512

> Model: mistralai/devstral-2512 | Total duration: 10m 46s | Total tokens: 368.7K | Cost: $0.2272
> Tool time: 39.1s | Approx. tool tokens: 365.1K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 38 | 38.8s | 99.1% | 146.6K |
| write | 19 | 0.3s | 0.7% | 103.5K |
| todowrite | 13 | 0.1s | 0.2% | 70.7K |
| edit | 7 | 0.0s | 0.1% | 44.3K |

### openrouter-openai-gpt-5.4-medium

> Model: openai/gpt-5.4 | Total duration: 11m 43s | Total tokens: 112.8K | Cost: $1.0866
> Tool time: 16.0s | Approx. tool tokens: 111.6K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 35 | 10.2s | 63.9% | 21.2K |
| grep | 7 | 4.9s | 30.8% | 46.0K |
| glob | 6 | 0.4s | 2.7% | 2.9K |
| apply_patch | 9 | 0.2s | 1.4% | 19.5K |
| read | 11 | 0.1s | 0.9% | 8.0K |
| todowrite | 6 | 0.0s | 0.2% | 14.0K |

### openrouter-openai-gpt-5.5-medium

> Model: openai/gpt-5.5 | Total duration: 13m 10s | Total tokens: 164.6K | Cost: $2.0231
> Tool time: 13.2s | Approx. tool tokens: 163.2K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 30 | 11.9s | 90.1% | 60.0K |
| glob | 5 | 0.5s | 3.6% | 2.5K |
| grep | 2 | 0.4s | 3.0% | 1.9K |
| read | 11 | 0.2s | 1.4% | 38.7K |
| apply_patch | 6 | 0.2s | 1.2% | 30.1K |
| skill | 1 | 0.1s | 0.4% | 9.6K |
| todowrite | 5 | 0.0s | 0.3% | 20.5K |

### openrouter-openai-gpt-5.4-high

> Model: openai/gpt-5.4 | Total duration: 13m 19s | Total tokens: 114.8K | Cost: $1.2322
> Tool time: 19.1s | Approx. tool tokens: 109.5K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 23 | 12.5s | 65.6% | 17.7K |
| grep | 8 | 4.1s | 21.6% | 18.4K |
| webfetch | 7 | 1.6s | 8.4% | 24.6K |
| glob | 3 | 0.4s | 1.9% | 714 |
| read | 9 | 0.2s | 1.2% | 1.7K |
| apply_patch | 7 | 0.2s | 1.1% | 22.3K |
| todowrite | 4 | 0.0s | 0.2% | 24.1K |

### openrouter-openai-gpt-5.5-low

> Model: openai/gpt-5.5 | Total duration: 14m 4s | Total tokens: 130.0K | Cost: $2.0779
> Tool time: 17.6s | Approx. tool tokens: 129.2K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 33 | 15.9s | 90.2% | 50.9K |
| glob | 5 | 0.6s | 3.6% | 4.1K |
| grep | 6 | 0.6s | 3.5% | 5.1K |
| apply_patch | 12 | 0.3s | 1.6% | 39.4K |
| read | 8 | 0.1s | 0.8% | 11.0K |
| todowrite | 6 | 0.0s | 0.2% | 18.7K |

### openrouter-openai-gpt-5.5-high

> Model: openai/gpt-5.5 | Total duration: 14m 33s | Total tokens: 280.3K | Cost: $2.8304
> Tool time: 17.9s | Approx. tool tokens: 280.3K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 32 | 16.3s | 91.1% | 116.6K |
| grep | 6 | 0.6s | 3.2% | 31.6K |
| glob | 5 | 0.5s | 2.6% | 38.2K |
| read | 17 | 0.3s | 1.5% | 11.3K |
| apply_patch | 8 | 0.2s | 1.0% | 30.1K |
| skill | 1 | 0.1s | 0.5% | 9.1K |
| todowrite | 5 | 0.0s | 0.2% | 43.5K |

### openrouter-mistralai-mistral-medium-3-5

> Model: mistralai/mistral-medium-3-5 | Total duration: 18m 18s | Total tokens: 3.6M | Cost: $5.5325
> Tool time: 16.8s | Approx. tool tokens: 3.6M (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 50 | 16.2s | 96.0% | 2.1M |
| write | 29 | 0.4s | 2.1% | 585.1K |
| read | 8 | 0.2s | 1.0% | 329.1K |
| skill | 1 | 0.1s | 0.5% | 16.1K |
| edit | 11 | 0.1s | 0.3% | 536.8K |
| todowrite | 2 | 0.0s | 0.1% | 21.4K |

### openrouter-moonshotai-kimi-k2.6

> Model: moonshotai/kimi-k2.6 | Total duration: 74m 0s | Total tokens: 383.4K | Cost: $5.5085
> Tool time: 45.5s | Approx. tool tokens: 383.4K (tokens are split evenly across tool calls within each step — an approximation)

| Tool | Calls | Duration | Duration % | Approx. Tokens |
| ---- | ----- | -------- | ---------- | -------------- |
| bash | 113 | 42.9s | 94.2% | 175.1K |
| read | 37 | 0.7s | 1.5% | 56.3K |
| write | 45 | 0.6s | 1.4% | 86.5K |
| glob | 7 | 0.5s | 1.1% | 3.7K |
| webfetch | 2 | 0.4s | 0.9% | 1.3K |
| skill | 2 | 0.2s | 0.3% | 11.9K |
| edit | 23 | 0.1s | 0.3% | 29.7K |
| grep | 1 | 0.1s | 0.2% | 751 |
| todowrite | 5 | 0.0s | 0.1% | 18.1K |

---
