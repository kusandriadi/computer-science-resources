# Module 4 — Inference

Pre-training is where the capital goes; inference is where the operating cost lives. A frontier model's lifetime inference compute exceeds its training compute by orders of magnitude. Understanding inference is essential for both research (test-time compute scales capability) and production (latency and cost determine viability).

## Learning goals

- Implement and tune common sampling strategies
- Explain the KV cache and the prefill/decode split
- Implement INT8/INT4 quantization and reason about accuracy tradeoffs
- Understand speculative decoding and when it helps
- Reason about latency, throughput, and cost in a serving system

## 4.1 What inference actually does

Autoregressive decoding has two distinct phases:

**Prefill**: the user's prompt is processed in parallel. All $n$ prompt tokens are forwarded through the model in a single pass. Compute-bound; dominated by matrix multiplies. Latency scales roughly linearly with prompt length.

**Decode**: tokens are generated one at a time. Each token requires a full forward pass through all layers, but only for one new query position (attending to all previous keys/values). **Memory-bandwidth-bound**: each step reads the entire model weights from HBM but does relatively little compute per byte.

This split has huge implications. Prefill is easy to make fast (lots of arithmetic intensity); decode is fundamentally limited by how quickly you can move weights from memory to compute. Most "inference optimization" work targets decode.

## 4.2 The KV cache

To generate token $i+1$, attention needs keys and values for all positions $\leq i$. Recomputing these from scratch at each step would be $O(n^2)$ in tokens. Instead, we cache:

- After each forward pass at position $i$, append the new $K_i$ and $V_i$ to a per-layer cache.
- Subsequent decode steps only compute new K/V for the latest token and read cached K/V from previous tokens.

**Memory cost** of the KV cache, per request:

$$\text{KV bytes} = 2 \cdot L \cdot n \cdot h_{kv} \cdot d_{head} \cdot \text{bytes per element}$$

For LLaMA-3 70B with bf16, ~1.3 MB per token, ~10 GB at 8k context. Per request. This is often the bottleneck for batch size.

Mitigations:
- **GQA / MQA / MLA**: fewer KV heads → smaller cache. (Module 1)
- **Cache quantization**: store K/V in INT8 or INT4. Decent quality preservation.
- **PagedAttention** (vLLM, Kwon et al. 2023): allocate KV in fixed-size blocks like virtual memory pages. Eliminates fragmentation; enables high batch sizes.
- **Prefix caching**: reuse KV across requests that share a prefix (e.g. system prompt). Big win for chat applications.
- **Eviction**: for very long contexts, drop or compress old tokens (sliding window, H2O, SnapKV).

## 4.3 Sampling strategies

Given the next-token distribution $p(t)$, how do we pick?

- **Greedy** ($\arg\max$): deterministic; tends to repeat itself; bad for creative tasks.
- **Temperature**: divide logits by $T$ before softmax. $T = 0$ → greedy, $T = 1$ → original distribution, $T > 1$ → flatter (more random).
- **Top-k**: keep only the $k$ highest-probability tokens, renormalize, sample.
- **Top-p (nucleus, Holtzman et al. 2019)**: keep the smallest set of tokens whose cumulative probability $\geq p$. Adapts to distribution shape.
- **Min-p**: keep tokens with probability $\geq p \cdot p_{\max}$. Robust to temperature scaling.
- **Repetition penalty**: down-weight already-generated tokens to combat loops.
- **Frequency / presence penalty** (OpenAI-style): like repetition penalty but with explicit linear penalty terms.

Modern defaults: temperature 0.7–1.0 with top-p 0.9 or min-p 0.05. For reasoning models, often temperature 0.6–1.0 to allow diverse traces.

**Constrained decoding**: restrict sampling to tokens that match a grammar (JSON, SQL, regex). Implementations: Outlines, lm-format-enforcer, llama.cpp grammars. Useful for structured outputs and tool calls.

## 4.4 Quantization

Storing/computing weights in lower precision. Critical for fitting models on smaller hardware and for memory-bandwidth-bound decode.

**Weight precisions**:
- **bf16** (16 bits): default training/inference precision. Same range as fp32, less mantissa.
- **fp16**: smaller range, occasionally overflows.
- **fp8** (E4M3, E5M2): supported on Hopper/Blackwell; common in DeepSeek-V3-style training.
- **INT8**: 8-bit integers. Works well with calibration.
- **INT4**: 4-bit. Quality loss noticeable but often acceptable.
- **INT2 / 1.58-bit**: experimental (BitNet); promising but not mainstream yet.

**Methods**:
- **Round-to-nearest (RTN)**: simplest; just round weights. Decent for INT8, bad for INT4.
- **GPTQ** (Frantar et al. 2022): per-column quantization with second-order error compensation. Strong INT4 baseline.
- **AWQ** (Lin et al. 2023): identifies salient weight channels (those activated by high-magnitude inputs) and protects their precision.
- **SmoothQuant**: rescales activations and weights to make both quantization-friendly.
- **QAT** (Quantization-Aware Training): fine-tune with simulated quantization. Best quality at the cost of compute.

Practical rule: INT8 weights are usually free in quality. INT4 weights with GPTQ/AWQ lose ~1–2% on most evals, sometimes more on math/coding. KV cache INT8 is usually safe; INT4 KV is more aggressive.

**Activation quantization** matters too. Weight-only quantization saves memory bandwidth but not compute; weight+activation quantization (W8A8) uses INT8 matmul kernels on Hopper for real speedup.

## 4.5 Speculative decoding

Decode is bandwidth-bound: you spend most of your time reading weights, not computing. **Speculative decoding** (Leviathan et al., Chen et al. 2023) exploits this.

Idea: use a small **draft model** to propose $k$ tokens cheaply. Verify all $k$ in parallel with one forward pass of the **target model** (large model verifies as easily as it generates one token). Keep all draft tokens that the target would have produced; the rest are rejected.

If the draft model agrees with the target $\alpha$ fraction of the time, you get roughly $1 + k\alpha$ target tokens per target forward pass instead of 1. For typical setups $\alpha \approx 0.7$, yielding ~2–3× speedup with no quality loss (it's mathematically equivalent to sampling from the target).

**Variants**:
- **Self-speculation**: use a subset of the target's own layers as the draft. No separate model needed.
- **Medusa** (Cai et al. 2024): add extra prediction heads to the target model that predict the next several tokens.
- **EAGLE / EAGLE-2** (Li et al. 2024): a small autoregressive head over the target's hidden states. Currently best-in-class.
- **Lookahead decoding**: draft by finding repeating patterns; no extra model.

## 4.6 Batching and serving

Inference servers (vLLM, TensorRT-LLM, SGLang) optimize for throughput across many concurrent requests.

**Continuous batching** (a.k.a. iteration-level batching, in-flight batching): instead of batching at the request level (wait for all to finish), batch at the token level. As one request finishes, a new one slots in. Massively improves GPU utilization.

**Chunked prefill**: split long prefills into chunks and interleave with decode steps. Prevents head-of-line blocking.

**Prefix caching**: many requests share a prefix (system prompt). Cache and share the KV.

### Disaggregated (prefill-decode) inference

As noted above, prefill is compute-bound while decode is memory-bandwidth-bound. They want fundamentally different hardware profiles — prefill benefits from raw FLOPS and high batch sizes, decode benefits from high memory bandwidth and large KV-cache capacity. **Disaggregated inference** separates the two phases onto different machine pools so each can be provisioned and optimized independently.

The flow: a prefill cluster processes incoming prompts, materializes the KV cache, then transfers it to a decode cluster that generates tokens autoregressively. Key systems include **DistServe** (Zhong et al. 2024) and **Splitwise** (Patel et al. 2024), both of which demonstrate significant throughput and latency improvements over monolithic serving under production-like workloads.

Benefits: the prefill pool can run at very high utilization without slowing decode latency, and the decode pool can be sized for its memory-bandwidth needs rather than over-provisioned for prefill compute. This improves overall GPU utilization and lowers per-token cost at scale.

Trade-offs: the architecture adds orchestration complexity and requires fast inter-node KV-cache transfer (the cache can be gigabytes per request for long contexts). Network bandwidth between the two pools becomes a new bottleneck. Disaggregation pays off most in **high-throughput production settings** with mixed workloads (varying prompt lengths, bursty traffic) — at small scale, monolithic serving with continuous batching is simpler and sufficient.

## 4.7 Cost and latency reasoning

Two latency metrics matter:

- **TTFT** (time to first token): dominated by prefill. Scales with prompt length.
- **TPOT** (time per output token): dominated by decode. Constant per-token under fixed batch.

Per-token decode latency is approximately:

$$\text{TPOT} \approx \frac{\text{model size in bytes}}{\text{memory bandwidth}}$$

For LLaMA-3 70B in bf16 (140 GB) on an H100 (3.35 TB/s): ~40 ms/token at batch=1. Real numbers are higher due to KV cache reads and overheads.

Throughput improves super-linearly with batch size up to the compute-bound regime (~32–128 depending on model). Past that, you're compute-bound on decode and gains taper.

**Cost intuition**: an H100 at $2/hour produces ~25 token/s for a 70B model at batch 1, ~800 token/s at batch 64. So large-batch serving is ~30× cheaper per token than batch-1 — explaining why APIs are vastly cheaper than self-hosted batch-1 deployments.

## Key papers

- Holtzman et al. 2019 — *Nucleus Sampling*.
- Kwon et al. 2023 — *vLLM / PagedAttention*.
- Leviathan et al. 2023; Chen et al. 2023 — *Speculative decoding*.
- Frantar et al. 2022 — *GPTQ*.
- Lin et al. 2023 — *AWQ*.
- Dao et al. 2022 — *FlashAttention*.
- Dao 2023 — *FlashAttention-2*.
- Shah et al. 2024 — *FlashAttention-3*.

## Exercises

1. Implement greedy, top-k, top-p, and min-p sampling from scratch. Compare outputs at temperature 0.7.
2. Implement a KV cache. Compare wall-clock time of cached vs. uncached generation on a 1k-token completion.
3. Quantize a small open model to INT8 with RTN and INT4 with GPTQ. Measure perplexity change on WikiText.
4. Implement speculative decoding with a small draft model (1B) and a large target (7B). Measure speedup as a function of $k$.

## Further reading

- *Efficient Memory Management for Large Language Model Serving with PagedAttention* (vLLM paper).
- Pope et al. 2022 — *Efficiently Scaling Transformer Inference*. Google's playbook.
- Horace He's *Making Deep Learning Go Brrrr from First Principles* — the most important blog post on compute vs memory bandwidth.
- The vLLM, SGLang, and TensorRT-LLM source code.
