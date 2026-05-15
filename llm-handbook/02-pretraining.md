# Module 2 — Pre-training

## Learning goals

- Understand the next-token-prediction objective and why it works
- Read and apply scaling laws (Kaplan, Chinchilla, beyond)
- Describe the standard pre-training data pipeline and quality filters
- Explain ZeRO, FSDP, tensor parallelism, pipeline parallelism, and when each applies
- Pick reasonable hyperparameters for a new pre-training run

## 2.1 The objective

Given a corpus of token sequences, minimize the average cross-entropy of the next token:

$$\mathcal{L} = -\sum_{i=1}^{n-1} \log p_\theta(t_{i+1} \mid t_{\leq i})$$

That's it. The astonishing thing is that this single objective, at sufficient scale, produces models that can translate, summarize, code, reason, and follow instructions. Why? Because predicting the next token requires modeling the joint distribution of language, which requires modeling the world the language refers to (the "Janus" perspective — language is a low-bandwidth projection of a high-bandwidth process).

A related framing: **compression**. A perfect next-token predictor minimum-description-length-compresses the training data. Hutter and others have argued that compression and intelligence are deeply linked.

### Multi-token prediction

Standard next-token prediction trains the model to predict one token ahead. **Multi-token prediction** generalizes this: predict the next $k$ tokens simultaneously using $k$ independent output heads that share the same trunk (Gloeckle et al. 2024, Meta). Each head $i$ is trained to minimize $-\log p_\theta(t_{j+i} \mid t_{\leq j})$.

Why bother? Three benefits compound:
- **Better sample efficiency and representations.** Predicting further ahead forces internal representations to encode longer-range structure; the gradient signal from later tokens teaches the trunk things that one-step-ahead loss misses.
- **Improved downstream quality.** Meta reports consistent gains on code and reasoning benchmarks, especially at smaller model sizes, without extra data or compute at inference.
- **Faster inference.** The extra heads can propose multiple tokens in a single forward pass, functioning as a built-in draft mechanism for speculative decoding (see Module 4, §4.5). Qwen-3 and other 2024–2025 models adopt this for both quality and speed.

The overhead during training is modest — the auxiliary heads add parameters and FLOPs but the shared trunk computation is unchanged. Multi-token prediction is becoming a standard ingredient in modern pre-training recipes.

## 2.2 Data

Frontier pre-training corpora are tens of trillions of tokens. Composition matters more than raw volume past a point.

**Sources**:
- Web crawl (Common Crawl, FineWeb, RefinedWeb, DCLM). The bulk.
- Books and academic papers.
- Code (GitHub, The Stack v2). Improves reasoning even on non-code tasks.
- Math (proof corpora, math web pages).
- Curated multilingual data.
- Synthetic data — increasingly large fraction in 2024–2026 models (e.g. Phi family, post-LLaMA-3 work).

**Quality filtering** is where teams spend enormous effort:
- Language ID, perplexity filtering with a small reference model.
- Heuristics: line length, repetition ratio, special-character ratio, "lorem ipsum" markers.
- Deduplication: MinHash + LSH at the document level; suffix-array dedup at the substring level.
- Toxicity and PII filters.
- **Quality classifiers** (FineWeb-Edu, DCLM-Baseline) using a small model trained to recognize "high-quality educational content" — large gains, often >2× compute-equivalent.

**Mixing**. The mix of sources is tuned during training, often with a curriculum: more diverse early, more high-quality and code/math late ("annealing"). DoReMi and follow-ups learn the mix.

**Tokenization considerations** (revisit Module 1): the tokenizer is part of pre-training. Changing it later requires retraining the embedding layer or worse.

## 2.3 Scaling laws

The single most important empirical result in modern LLMs: loss as a function of compute, data, and parameters follows a power law.

**Kaplan et al. 2020** (OpenAI): for fixed compute, optimal allocation favors more parameters than data. Implied: keep growing models.

**Chinchilla** (Hoffmann et al. 2022, DeepMind): re-did the experiments more carefully and found that for compute-optimal training, parameters $N$ and data $D$ should scale roughly equally:

$$D^* \approx 20 \cdot N$$

i.e. ~20 tokens per parameter. A 70B model should train on ~1.4T tokens. GPT-3 (175B, 300B tokens) was massively undertrained by this rule. Chinchilla (70B, 1.4T tokens) beat it.

**Post-Chinchilla reality**: inference cost matters too. If you'll serve the model billions of times, it's worth **over-training** smaller models on more data — they're cheaper at inference and only modestly worse than the Chinchilla-optimal point. LLaMA-3 8B trained on 15T tokens (~1875 tokens/param) is the modern norm. The new rule of thumb is "train smaller models on more data than Chinchilla suggests, because inference dominates total cost."

**Practical scaling-law use**:
1. Train a sweep of small models (e.g. 50M–500M params) at compute-optimal points.
2. Fit a power law to validation loss vs compute.
3. Extrapolate to predict the loss of your target run before launching it.
4. Use the extrapolation to set the data mix (different mixes have different scaling exponents — pick the one with best slope).

## 2.4 Optimizer and hyperparameters

**Optimizer**: AdamW is still standard. Recent work on Lion, Sophia, Shampoo, and Muon (Keller Jordan, 2024) shows promise; Muon in particular is gaining adoption for the matrix-shaped parameters with reported wall-clock speedups.

**Learning rate schedule**:
- Linear warmup (typically 1–5% of steps).
- Cosine decay to ~10% of peak, OR
- WSD: warmup, stable, decay. Allows continuing training without recomputing the schedule.

**Peak LR**: a common heuristic is $\text{LR} \propto 1/\sqrt{d_{\text{model}}}$. For modern 7B–70B models, peak LRs are in $1\text{e-}4$ to $3\text{e-}4$.

**Batch size**: scaled with model size and data. Critical batch size (McCandlish et al.) — past this, parallelism gives diminishing returns. Modern runs use millions of tokens per batch.

**Weight decay**: 0.1 is standard for AdamW.

**Gradient clipping**: 1.0 norm clipping is universal; helps with rare loss spikes.

**Initialization**: scaled init based on layer count to keep residual stream variance ~constant.

**Precision**: bf16 for activations, fp32 master weights, fp32 optimizer states. Newer runs use fp8 for some matmuls (DeepSeek-V3, NVIDIA Hopper/Blackwell).

## 2.5 Distributed training

Single GPU pre-training stops working past ~7B params (model + optimizer + activations exceed 80GB). Modern pre-training spans hundreds to tens of thousands of GPUs. Four orthogonal parallelism dimensions:

**Data parallelism (DP)**: each rank has a full model copy; different ranks see different micro-batches; gradients are all-reduced. Simple. Scales until model doesn't fit.

**ZeRO / FSDP** (Rajbhandari et al.; PyTorch FSDP): shard optimizer states (ZeRO-1), gradients (ZeRO-2), and parameters (ZeRO-3 / FSDP) across DP ranks. Each rank only holds $1/N$ of params. Communicates parameter shards on demand. Lets you train ~10× larger models with same memory.

**Tensor parallelism (TP)** (Megatron-LM): shard individual matrix multiplies across GPUs. E.g. split the FFN's $W_1$ along the columns and $W_2$ along the rows. Communication every layer. Use within a node (NVLink bandwidth); rarely across nodes.

**Pipeline parallelism (PP)**: split layers across devices; pass activations forward, gradients backward. Introduces "bubbles" (idle time at start/end of step). Mitigated by 1F1B scheduling, interleaved pipeline. Use across nodes when needed.

**Sequence/context parallelism**: shard the sequence dimension (Ring Attention, DeepSpeed-Ulysses). Needed for very long contexts.

**Expert parallelism**: for MoE (Module 5), shard experts across devices.

Combined: a 405B model might use TP=8 within a node, PP=8 across 8 nodes, and DP/FSDP on top, on hundreds of nodes. The choice trades compute, memory, and communication.

## 2.6 Practical training stability

Loss spikes are routine in large runs. Common interventions:
- Skip the problematic batch and reduce LR briefly.
- Clamp activations (z-loss on logits to prevent runaway magnitudes).
- Check for bad data (NaNs, encoding errors).
- LayerNorm/RMSNorm placement variants.
- Embedding LR multipliers (often 0.1× of main LR).

Modern runs log everything (per-layer gradient norms, activation stats, expert routing entropy if MoE) and have automated recovery from checkpoints.

## 2.7 Continued pre-training and annealing

Two important post-pretraining-but-pre-fine-tuning steps:

**Annealing**: in the final few percent of training, switch to a higher-quality data mix (more code, math, curated text) and decay the learning rate aggressively. Disproportionate quality gains.

**Mid-training / continued pre-training**: take a pre-trained model and continue training on a different mix — long-context data, domain-specific corpora, or new languages. Cheaper than from-scratch; preserves general capabilities.

## Key papers

- Kaplan et al. 2020 — *Scaling Laws for Neural Language Models*.
- Hoffmann et al. 2022 — *Training Compute-Optimal Large Language Models (Chinchilla)*.
- Rajbhandari et al. 2020 — *ZeRO*.
- Narayanan et al. 2021 — *Megatron-LM (tensor parallel)*.
- Loshchilov & Hutter 2017 — *Decoupled Weight Decay (AdamW)*.
- Penedo et al. 2024 — *FineWeb*. Data curation at scale.
- DeepSeek-V3 technical report (2024) — modern reference architecture and training recipe.

## Exercises

1. Train a sequence of small GPTs (1M, 4M, 16M, 64M params) at Chinchilla-optimal compute. Fit a power law to validation loss vs compute. How far does the extrapolation hold?
2. Run the same training with and without document-level deduplication. Compare validation loss curves.
3. Implement a minimal FSDP from scratch in PyTorch on 2 GPUs (or simulate). Verify equivalence to single-GPU training.
4. Take a publicly available pre-trained model and continue training for 1B tokens on a domain (e.g. medical papers). Measure perplexity on in-domain and general data.

## Further reading

- *The Llama 3 Herd of Models* (Meta 2024). Most detailed open description of a frontier run.
- *DeepSeek-V3 Technical Report*. State-of-the-art training stability and efficiency.
- Karpathy's *llm.c*. Pre-training a small GPT in raw C/CUDA.
- *The Pile* and *FineWeb* papers for the data side.
