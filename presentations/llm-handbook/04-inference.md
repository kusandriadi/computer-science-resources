---
marp: true
theme: default
paginate: true
header: 'LLM Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 4 -- Inference

**You train a model once, but you run inference millions of times.** A frontier model's lifetime inference compute exceeds its training compute by orders of magnitude. Every millisecond saved per token compounds across every request from every user.

---

# Why This Matters

- Inference cost and latency determine whether your system is viable at all
- Understanding the prefill/decode split is essential for performance reasoning
- Quantization can cut costs 2-4x with minimal quality loss
- Speculative decoding offers free speedups -- mathematically equivalent output, faster

---

# 4.1 Two Phases of Inference

**Prefill**: process the user's prompt in parallel
- All $n$ tokens forwarded in a single pass
- **Compute-bound** -- dominated by matrix multiplies
- Scales roughly linearly with prompt length

**Decode**: generate tokens one at a time
- Each token requires a full forward pass for one new position
- **Memory-bandwidth-bound** -- reads entire model weights but does little compute per byte
- Most "inference optimization" targets this phase

---

# 4.2 The KV Cache

**Intuition:** When generating token 100, the model attends to all 99 previous tokens. Recomputing K/V vectors from scratch each step would be wasteful -- they don't change.

**Solution:** Cache K and V vectors per layer, append each step.

$$\text{KV bytes} = 2 \cdot L \cdot n \cdot h_{kv} \cdot d_{head} \cdot \text{bytes per element}$$

**How to read this:** x2 for K and V, x$L$ layers, x$n$ tokens, x KV heads x head dim.

For LLaMA-3 70B (bf16): ~1.3 MB per token, ~10 GB at 8k context. **Per request.** Often the bottleneck for batch size.

---

# KV Cache Mitigations

| Strategy | How it works |
|----------|-------------|
| **GQA / MQA / MLA** | Fewer KV heads = smaller cache |
| **Cache quantization** | Store K/V in INT8 or INT4 |
| **PagedAttention** (vLLM) | Allocate KV in fixed-size blocks like virtual memory pages |
| **Prefix caching** | Reuse KV across requests sharing a prefix (system prompt) |
| **Eviction** | Drop/compress old tokens (sliding window, H2O, SnapKV) |

---

# Try It: KV Cache Speedup

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import time

model = AutoModelForCausalLM.from_pretrained("gpt2")
tokenizer = AutoTokenizer.from_pretrained("gpt2")
input_ids = tokenizer.encode("The quick brown fox", return_tensors="pt")

start = time.time()
model.generate(input_ids, max_new_tokens=50, use_cache=False)
no_cache_time = time.time() - start

start = time.time()
model.generate(input_ids, max_new_tokens=50, use_cache=True)
cache_time = time.time() - start

print(f"Without cache: {no_cache_time:.2f}s | With cache: {cache_time:.2f}s")
print(f"Speedup: {no_cache_time/cache_time:.1f}x")
```

---

# 4.3 Sampling Strategies

Given next-token distribution $p(t)$, how do we pick?

| Strategy | Description |
|----------|-------------|
| **Greedy** | $\arg\max$ -- deterministic, tends to repeat |
| **Temperature** | Divide logits by $T$ before softmax. $T=0$ = greedy, $T>1$ = flatter |
| **Top-k** | Keep $k$ highest-probability tokens, renormalize, sample |
| **Top-p (nucleus)** | Smallest set with cumulative prob $\geq p$; adapts to distribution shape |
| **Min-p** | Keep tokens with prob $\geq p \cdot p_{\max}$; robust to temperature |
| **Repetition penalty** | Down-weight already-generated tokens |

Modern defaults: temperature 0.7-1.0 with top-p 0.9 or min-p 0.05.

---

# Constrained Decoding

Restrict sampling to tokens matching a grammar (JSON, SQL, regex).

- Implementations: **Outlines**, **lm-format-enforcer**, **llama.cpp grammars**
- Essential for structured outputs and tool calls
- Guarantees valid output format without retries

---

# 4.4 Quantization

**Idea:** Store weights in fewer bits. INT8 = half the memory of bf16; INT4 = quarter.

Decode speed is almost entirely limited by how fast you move weights from memory to GPU cores. Fewer bits = faster movement = faster inference.

| Precision | Bits | Quality impact |
|-----------|------|---------------|
| bf16 | 16 | Baseline |
| INT8 | 8 | Usually free in quality |
| INT4 | 4 | ~1-2% loss on most evals |
| INT2 / 1.58-bit | 2 | Experimental (BitNet) |

---

# Quantization Methods

| Method | Approach |
|--------|----------|
| **RTN** (Round-to-nearest) | Simplest; decent for INT8, bad for INT4 |
| **GPTQ** (Frantar et al. 2022) | Per-column with second-order error compensation |
| **AWQ** (Lin et al. 2023) | Protects salient weight channels |
| **SmoothQuant** | Rescales activations and weights jointly |
| **QAT** | Fine-tune with simulated quantization (best quality) |

**Weight+activation quantization** (W8A8) uses INT8 matmul kernels for real speedup, not just memory savings.

---

# Try It: Quantize and Compare

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
import torch

model_fp = AutoModelForCausalLM.from_pretrained("gpt2")
fp_size = sum(p.numel() * p.element_size() for p in model_fp.parameters())

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True, bnb_4bit_compute_dtype=torch.float16)
model_4bit = AutoModelForCausalLM.from_pretrained(
    "gpt2", quantization_config=bnb_config)

print(f"FP32 size: {fp_size / 1e6:.1f} MB")
print(f"4-bit: ~{fp_size / 1e6 / 8:.1f} MB (estimated)")
```

---

# 4.5 Speculative Decoding

**Insight:** During decode, the GPU has spare compute capacity. Use it to verify multiple tokens at once.

1. Small **draft model** proposes $k$ tokens cheaply
2. Large **target model** verifies all $k$ in one forward pass
3. Keep tokens the target would have produced; reject the rest

If draft agrees with target $\alpha$ fraction of the time: ~$1 + k\alpha$ tokens per forward pass instead of 1. Typically **2-3x speedup** with **no quality loss** (mathematically equivalent).

---

# Speculative Decoding Variants

| Variant | Approach |
|---------|----------|
| **Self-speculation** | Use subset of target's own layers as draft |
| **Medusa** (Cai et al. 2024) | Extra prediction heads on target model |
| **EAGLE / EAGLE-2** (Li et al. 2024) | Autoregressive head over target's hidden states (best-in-class) |
| **Lookahead decoding** | Draft from repeating patterns; no extra model |

---

# 4.6 Batching and Serving

**Continuous batching**: batch at the token level, not request level. As one request finishes, a new one slots in. Massively improves GPU utilization.

**Chunked prefill**: split long prefills into chunks, interleave with decode steps. Prevents head-of-line blocking.

**Disaggregated inference**: separate prefill and decode onto different machine pools (DistServe, Splitwise). Each optimized for its resource profile -- prefill wants FLOPS, decode wants bandwidth.

---

# 4.7 Cost and Latency Reasoning

Two metrics that matter:
- **TTFT** (time to first token): dominated by prefill, scales with prompt length
- **TPOT** (time per output token): dominated by decode, roughly constant

$$\text{TPOT} \approx \frac{\text{model size in bytes}}{\text{memory bandwidth}}$$

**Cost intuition:** H100 at $2/hr produces ~25 tok/s for 70B at batch 1, ~800 tok/s at batch 64. Large-batch serving is **~30x cheaper per token** than batch-1.

---

# Key Papers

| Paper | Contribution |
|-------|-------------|
| Holtzman et al. 2019 | *Nucleus Sampling* |
| Kwon et al. 2023 | *vLLM / PagedAttention* |
| Leviathan et al. 2023 | *Speculative decoding* |
| Frantar et al. 2022 | *GPTQ* |
| Lin et al. 2023 | *AWQ* |
| Dao et al. 2022/2023 | *FlashAttention 1 & 2* |

---

# Exercises

1. Implement greedy, top-k, top-p, and min-p sampling from scratch. Compare outputs at temperature 0.7.
2. Implement a KV cache. Compare wall-clock time of cached vs. uncached generation on 1k tokens.
3. Quantize a model to INT8 (RTN) and INT4 (GPTQ). Measure perplexity change on WikiText.
4. Implement speculative decoding with a 1B draft and 7B target. Measure speedup as a function of $k$.
