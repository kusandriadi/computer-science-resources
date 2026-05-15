# Appendix E — Hardware for Production LLM

How to choose GPUs (and other accelerators) for serving LLMs in production. Covers the actual current options, cost economics, and the decision framework — not theoretical max FLOPS.

## E.1 The shortlist

NVIDIA dominates production LLM inference in 2026. The relevant SKUs:

### Datacenter NVIDIA

| GPU | Memory | Memory BW | FP16 perf | Power | Approx street/cloud price | Best for |
|-----|--------|-----------|-----------|-------|---------------------------|----------|
| **H100 SXM** | 80GB HBM3 | 3.35 TB/s | 989 TFLOPS | 700W | ~$2–4/hr cloud | 30B–70B production, training |
| **H100 PCIe** | 80GB HBM3 | 2 TB/s | 756 TFLOPS | 350W | ~$2/hr cloud | Single-server deployment |
| **H200** | 141GB HBM3e | 4.8 TB/s | 989 TFLOPS | 700W | ~$3–5/hr cloud | 70B+ on single GPU, long context |
| **B200** | 192GB HBM3e | 8 TB/s | ~2× H100 | 1000W | ~$5–8/hr cloud | New frontier deployments |
| **B100** | 192GB HBM3e | 8 TB/s | ~1.8× H100 | 700W | similar | Lower-power Blackwell |
| **GB200 NVL** | 384GB unified | massive | ~2.5× H100 | rack | very high | Frontier MoE serving |
| **A100 80GB** | 80GB HBM2e | 2 TB/s | 312 TFLOPS | 400W | ~$1–2/hr cloud | Established workloads, cost-sensitive |
| **A100 40GB** | 40GB HBM2 | 1.5 TB/s | 312 TFLOPS | 400W | ~$0.8–1.5/hr | Budget, 13B-class models |
| **L40S** | 48GB GDDR6 | 864 GB/s | 362 TFLOPS | 350W | ~$1/hr cloud | Mid-tier serving, 13B–30B |
| **L4** | 24GB GDDR6 | 300 GB/s | 121 TFLOPS | 72W | ~$0.5/hr | Small models, embeddings |
| **A10/A10G** | 24GB GDDR6 | 600 GB/s | 125 TFLOPS | 150W | ~$0.5/hr | Small models, AWS workhorse |

Prices fluctuate; treat as illustrative. Real prices depend on commitment, region, provider, and time.

### NVIDIA "prosumer" / workstation

Sometimes used in production by smaller teams:

| GPU | Memory | Memory BW | Notes |
|-----|--------|-----------|-------|
| RTX 6000 Ada | 48GB | 960 GB/s | Workstation, no NVLink, datacenter-license-OK |
| RTX 5090 | 32GB | 1.8 TB/s | Consumer license — check terms before production |
| RTX 4090 | 24GB | 1 TB/s | Consumer license; popular for dev/local |

**Important**: NVIDIA's EULA historically restricts datacenter use of GeForce (consumer) cards. RTX 6000 Ada and similar workstation cards are explicitly licensed for datacenter use. For production deployments, this is worth verifying with legal.

### AMD

| GPU | Memory | Memory BW | Notes |
|-----|--------|-----------|-------|
| **MI300X** | 192GB HBM3 | 5.3 TB/s | Best memory-per-GPU. Strong for 70B+ on fewer GPUs. ROCm software matured significantly through 2025. |
| **MI325X** | 256GB HBM3e | 6 TB/s | Larger memory variant. |

AMD is now a credible alternative for LLM inference. vLLM, SGLang, llama.cpp, and PyTorch all support ROCm. The catch: ecosystem is still smaller, some optimization libraries lag, and newer techniques (custom kernels, fp8) arrive on CUDA first. For mature inference workloads it's fine; for cutting-edge research, CUDA remains the default.

### Intel and others

Intel Gaudi 2/3, AWS Trainium/Inferentia, Google TPU v5/v6 — all viable in their respective ecosystems. TPUs in particular are excellent if you're already on GCP/JAX. The vast majority of production LLM deployments still use NVIDIA; alternatives win in specific cost or vertical-integration scenarios.

### Apple Silicon

Not for production serving but worth mentioning: M2/M3/M4 Max and Ultra are excellent for local development. An M3 Max with 128GB or M4 Ultra with 192GB unified memory can comfortably run a 70B in INT4 at decent speed. Used for dev, demos, and on-device — not for serving multi-user workloads.

## E.2 Sizing the right GPU for your model

The first question is whether the model **fits**. Approximate weight memory:

| Params | bf16 | INT8 | INT4 (Q4_K_M) |
|--------|------|------|---------------|
| 7B     | 14 GB | 7 GB | 4 GB |
| 13B    | 26 GB | 13 GB | 8 GB |
| 32B    | 64 GB | 32 GB | 18 GB |
| 70B    | 140 GB | 70 GB | 40 GB |
| 235B (Qwen3 MoE) | ~470 GB | ~235 GB | ~120 GB |
| 671B (DeepSeek-V3) | ~1.3 TB | ~670 GB | ~330 GB |

Add **KV cache** memory. With GQA (8 KV heads on 70B), at bf16 the cache is roughly:
- ~1.3 MB per token for 70B-class
- ~150 KB per token for 7B-class

For 8K context, 70B needs ~10GB per concurrent request's KV cache. For 128K context, ~160GB per request — which is why long context drives hardware decisions hard.

Add **activations** during inference (small, but ~1–5 GB), and **overhead** for the runtime (~1–2 GB).

**Practical sizing rule**: target your model + KV cache for expected concurrency to use **≤80%** of GPU memory. Leaves headroom for spikes.

### Examples

**7B at bf16, serving up to 16 concurrent users at 8K context**:
- Weights: 14 GB
- KV cache: ~150 KB × 8K × 16 = ~20 GB
- Total: ~36 GB → A10 (24GB) too small; L40S (48GB) or A100 40GB fine.

**70B at bf16, single user**:
- Weights: 140 GB
- KV cache: ~10 GB
- Total: ~150 GB → needs 2× 80GB or 1× H200 (141GB, tight). 2× H100 is comfortable.

**70B at INT4, serving heavy concurrency**:
- Weights: 40 GB
- KV cache for many users: 30–50 GB
- Total fits comfortably on a single H100/H200.

This is why quantization isn't just about cost — it's often about fitting on cheaper hardware at all.

## E.3 What determines actual throughput

Latency and throughput are decided by:

**Memory bandwidth** dominates decode. At batch 1, decode TPOT ≈ model_size_in_bytes / memory_bandwidth. So:
- 70B bf16 on H100 (3.35 TB/s): theoretical ~24 ms/token, real ~35–45 ms/token.
- 70B INT4 on H100: theoretical ~12 ms/token, real ~15–20 ms/token.
- Same model on A100 (2 TB/s): ~60% of H100's decode rate.

**Compute** dominates prefill. H100's FP16 throughput is ~3× A100 at the same memory cost — prefill latency drops accordingly.

**Batch size** unlocks compute. At batch 32–64 on a 70B model, you're approaching compute-bound and overall throughput (tokens/sec across all users) is 30–50× batch 1. This is why API providers price aggressively — they amortize a single GPU across many users.

**Interconnect** matters for multi-GPU. NVLink (900 GB/s on H100) is critical for tensor parallelism. PCIe-only (64 GB/s) makes TP infeasible — you'd need pipeline parallelism instead. When buying a server, NVLink presence is a non-negotiable for serving 70B+ across GPUs.

## E.4 Cost economics

Cost-per-token is what actually matters. Rough order-of-magnitude on H100 with vLLM, well-tuned:

| Model | Tokens/sec at batch=1 | Tokens/sec at batch=32 | Approx $/M output tokens at high util |
|-------|----------------------|------------------------|---------------------------------------|
| 7B bf16 | ~150 | ~3000 | $0.15–0.30 |
| 70B bf16 | ~25 | ~500 | $1.50–3.00 |
| 70B INT4 | ~70 | ~1500 | $0.40–0.80 |

Compare to API pricing for similar-tier models:
- 70B-class hosted: $0.50–1.00/M output tokens
- Frontier APIs: $5–20/M output tokens

So self-hosting a 70B at high utilization beats hosted-open-model pricing slightly and beats frontier API by 5–20×. **But** this assumes you actually hit high utilization. At 10% utilization (idle GPUs), self-hosted becomes more expensive than API.

**Utilization is the entire game.** A team that runs at 80% utilization saves money self-hosting; a team at 15% utilization burns it.

## E.5 Where to actually buy GPU time

Three categories:

**Hyperscalers** (AWS, GCP, Azure):
- Most expensive on-demand, but committed pricing competitive.
- Best for: integration with existing cloud workloads, compliance (HIPAA, FedRAMP, SOC2), global regions.
- AWS: P5 (H100), P5e (H200), G6 (L40S), G5 (A10G).
- GCP: A3 Mega (H100), A3 Ultra (H200), G2 (L4).
- Azure: ND H100 v5, ND H200 v5.

**GPU-specialist clouds** (CoreWeave, Lambda Labs, Crusoe, Voltage Park, Nebius):
- Cheaper than hyperscalers by ~30–50%.
- Better availability for new hardware (B200 ships here first).
- Best for: serious training/inference, no need for full cloud stack.

**Serverless / per-token providers** (Together AI, Fireworks, DeepInfra, Anyscale, Replicate, Modal):
- Pay per token or per second. No GPU management.
- Best for: prototyping, bursty workloads, can't justify dedicated GPU.
- Pricing is often great for popular open models (Llama, Qwen).

**Aggregators / spot markets** (Runpod, Vast.ai, SF Compute):
- Cheapest GPU-hours. Reliability varies.
- Best for: experiments, fine-tuning runs, batch inference where interruption is OK.
- Not great for: production serving.

For most teams, the migration path is: prototype on serverless (Together/Modal) → fine-tune on Lambda/Runpod → production on hyperscaler with reserved capacity or GPU-specialist cloud.

## E.6 Inference stack on your hardware

What to run on the GPU once you have it:

**vLLM** — strong default. PagedAttention, continuous batching, prefix caching, speculative decoding. Best-supported open inference engine. Works on NVIDIA and AMD.

**SGLang** — competitive with vLLM, often faster for agentic/structured workloads. RadixAttention shares prefixes across requests aggressively.

**TensorRT-LLM** — NVIDIA's optimized engine. Highest raw performance on NVIDIA. Heavier setup; produces compiled engines specific to your model and GPU.

**llama.cpp / Ollama** — for smaller deployments or mixed CPU/GPU. Excellent on Apple Silicon and consumer GPUs.

**LMDeploy** (TurboMind) — strong performer especially for Chinese-origin models.

For a fresh production deployment, start with vLLM. Move to TensorRT-LLM if you need the last 20–30% performance and can absorb the operational complexity.

## E.7 Pragmatic recommendations by scale

**Small team, < 1M tokens/day production traffic**:
- Don't self-host. Use Together AI, Fireworks, or a frontier API.
- Develop locally on a 4090 or Apple Silicon for fine-tuning experiments.

**Medium, 1–100M tokens/day, steady workload**:
- 1–2 H100 80GB on Lambda or CoreWeave.
- vLLM + a 13B–70B model (depending on quality needs).
- Monitor utilization weekly. If <30%, go back to API.

**Larger, 100M–1B tokens/day**:
- 4–16 H100s, or transition to H200 for fewer-GPU 70B serving.
- Reserved or committed pricing. Negotiate.
- Production-grade stack: vLLM/TensorRT-LLM, autoscaling, multi-region.

**Frontier-scale, >1B tokens/day or training**:
- B200/H200 clusters. Direct relationship with hyperscaler or GPU-specialist.
- Custom inference stack often justified.
- Hardware procurement becomes a 6+ month lead-time problem.

## E.8 Things people get wrong

- **Buying GPUs without modeling utilization.** Reservations are committed money. Make sure your traffic justifies them.
- **Optimizing the wrong dimension.** Prefill optimization doesn't help if you're decode-bound, and vice versa.
- **Choosing fp16 when INT8 would work.** Quantization is often free quality, big cost savings. Always measure.
- **Single-region deployments for global users.** Latency penalty across continents is significant.
- **Not budgeting for KV cache.** Long-context support without KV memory planning kills throughput.
- **Skipping load tests.** Real traffic patterns reveal bottlenecks (cold start, autoscaler lag, queue buildup) that synthetic benchmarks miss.

## E.9 Quick decision tree

```
Workload size?
├── Tiny (< 1M tok/day) → API/serverless. Don't self-host.
├── Small (1–10M tok/day) → Hosted open model (Together/Fireworks).
├── Medium (10–500M tok/day) → 1–4 H100 or H200, vLLM. Self-hosted.
└── Large (500M+ tok/day) → Cluster of H100/H200/B200. Negotiate.

Privacy hard requirement?
└── Yes → Self-hosted, regardless of size. Smallest viable is L40S or A100.

Model size?
├── 7B–13B → A10/L40S sufficient
├── 30B → A100 80GB / L40S (quantized)
├── 70B → H100 (2×), H200 (1×), or quantized on A100 80GB
└── 200B+ → H100/H200 cluster, or B200 single-node

New deployment in 2026?
└── Default to H200 (141GB) for 70B+ workloads. Single-GPU 70B serving is a game-changer for operational simplicity.
```
