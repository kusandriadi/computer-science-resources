---
marp: true
theme: default
paginate: true
header: 'LLM Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 2 -- Pre-training

**Pre-training is where a model acquires almost everything it knows.** You take a randomly initialized neural network, show it trillions of tokens, and what comes out can translate, code, reason, and follow instructions -- all from a single objective: predict the next token.

---

# Why This Matters

- Pre-training accounts for the vast majority of a model's knowledge and capabilities
- Scaling laws let you **predict** how good a model will be before spending millions to train it
- Data quality decisions during pre-training have outsized impact on everything downstream
- Understanding distributed training is essential for working at scale

---

# 2.1 The Objective: Next-Token Prediction

$$\mathcal{L} = -\sum_{i=1}^{n-1} \log p_\theta(t_{i+1} \mid t_{\leq i})$$

**How to read this:**
- For each position $i$, predict the next token $t_{i+1}$
- Given all tokens up to and including position $i$
- Minimize the negative log-probability (cross-entropy)
- Sum over the entire sequence

**The astonishing result:** this single objective, at sufficient scale, produces models that can translate, summarize, code, and reason. Predicting the next token requires modeling the world the language refers to.

---

# Multi-Token Prediction

Standard: predict 1 token ahead. **Multi-token prediction** (Gloeckle et al. 2024): predict next $k$ tokens simultaneously using $k$ independent output heads sharing the same trunk.

Three compounding benefits:
- **Better representations** -- predicting further ahead forces longer-range structure encoding
- **Improved downstream quality** -- consistent gains on code and reasoning benchmarks
- **Faster inference** -- extra heads as built-in draft for speculative decoding

Adopted by Qwen-3 and other 2024-2025 models. Becoming a standard pre-training ingredient.

---

# 2.2 Data: Sources and Scale

Frontier corpora: **tens of trillions** of tokens. Composition matters more than raw volume.

| Source | Notes |
|--------|-------|
| Web crawl (Common Crawl, FineWeb) | Bulk -- huge scale but noisy |
| Books and papers | Higher quality, limited scale |
| Code (GitHub, The Stack v2) | Improves reasoning even on non-code tasks |
| Math corpora | Proof corpora, math web pages |
| Curated multilingual | Language-specific quality |
| **Synthetic data** | Increasingly large fraction (Phi family, post-LLaMA-3) |

---

# Data Quality Filtering

Where teams spend enormous effort:

- Language ID, perplexity filtering with a small reference model
- Heuristics: line length, repetition ratio, special-character ratio
- **Deduplication**: MinHash + LSH (document), suffix-array (substring)
- Toxicity and PII filters
- **Quality classifiers** (FineWeb-Edu, DCLM) -- small model trained to recognize "high-quality educational content" -- often >2x compute-equivalent gains
- **Mixing**: tuned during training, often with curriculum (diverse early, high-quality late)

---

# Try It: Inspect Training Data

```python
from datasets import load_dataset

ds = load_dataset("allenai/c4", "en", split="train", streaming=True)
sample = next(iter(ds))
print(f"Text length: {len(sample['text'])} chars")
print(f"First 200 chars:\n{sample['text'][:200]}")
```

---

# 2.3 Scaling Laws

Loss as a function of compute, data, and parameters follows a **power law**. Performance is predictable.

**Kaplan et al. 2020** (OpenAI): optimal allocation favors more parameters than data.

**Chinchilla** (Hoffmann et al. 2022): parameters $N$ and data $D$ should scale equally:

$$D^* \approx 20 \cdot N$$

~20 tokens per parameter. A 70B model should train on ~1.4T tokens.

---

# Post-Chinchilla Reality

**Inference cost matters.** If you serve the model billions of times, **over-train** smaller models on more data.

- GPT-3: 175B params, 300B tokens -- massively undertrained by Chinchilla rule
- Chinchilla: 70B params, 1.4T tokens -- beat GPT-3
- **LLaMA-3 8B**: 15T tokens (~1875 tokens/param) -- modern norm

> New rule of thumb: "Train smaller models on more data than Chinchilla suggests, because inference dominates total cost."

---

# Practical Scaling Law Use

1. Train a sweep of small models (50M-500M params) at compute-optimal points
2. Fit a power law to validation loss vs. compute
3. Extrapolate to predict loss of your target run before launching
4. Use extrapolation to set the data mix (different mixes have different scaling exponents)

---

# Try It: Estimate Model Size

```python
def estimate_params(vocab_size, d_model, n_layers, n_heads):
    """Rough parameter count for a transformer."""
    embedding = vocab_size * d_model
    per_layer = 4 * d_model**2 + 4 * d_model**2  # attn + FFN
    total = embedding + n_layers * per_layer + embedding
    return total

print(f"GPT-2: {estimate_params(50257, 768, 12, 12):,} params")
print(f"Llama-3 8B: {estimate_params(128256, 4096, 32, 32):,} params")
```

---

# 2.4 Optimizer and Hyperparameters

- **Optimizer**: AdamW is standard. Muon gaining adoption for matrix-shaped parameters
- **LR schedule**: linear warmup (1-5% of steps) then cosine decay or WSD
- **Peak LR**: ~$1\text{e-}4$ to $3\text{e-}4$ for 7B-70B models
- **Batch size**: millions of tokens; critical batch size limits parallelism gains
- **Weight decay**: 0.1 (AdamW standard)
- **Gradient clipping**: 1.0 norm clipping (universal)
- **Precision**: bf16 activations, fp32 master weights, fp8 for some matmuls (newer runs)

---

# 2.5 Distributed Training

**The problem:** A single 80 GB H100 cannot fit a 7B+ model with optimizer states and activations. Even if it could, training would take years.

Four orthogonal parallelism dimensions:

| Strategy | What it does | When to use |
|----------|-------------|-------------|
| **Data Parallelism (DP)** | Each rank has full model; different data | Model fits on one GPU |
| **ZeRO / FSDP** | Shard optimizer/gradients/params across ranks | Model barely fits |
| **Tensor Parallelism (TP)** | Shard individual matrix multiplies | Within a node (NVLink) |
| **Pipeline Parallelism (PP)** | Split layers across devices | Across nodes |

---

# Distributed Training at Scale

- **Sequence/Context Parallelism**: shard the sequence dimension (Ring Attention). Needed for very long contexts.
- **Expert Parallelism**: for MoE models, shard experts across devices.

**Combined example:** A 405B model might use TP=8 within a node, PP=8 across 8 nodes, and DP/FSDP on top, on hundreds of nodes.

---

# 2.6 Training Stability

Loss spikes are routine in large runs. Common interventions:

- Skip the problematic batch and reduce LR briefly
- Clamp activations (z-loss on logits)
- Check for bad data (NaNs, encoding errors)
- Embedding LR multipliers (often 0.1x of main LR)
- Log everything: per-layer gradient norms, activation stats, expert routing entropy
- Automated recovery from checkpoints

---

# 2.7 Continued Pre-training and Annealing

**Annealing**: in the final few percent of training, switch to higher-quality data mix and decay LR aggressively. Disproportionate quality gains.

**Continued pre-training**: take a pre-trained model and continue on a different mix -- long-context data, domain-specific corpora, new languages. Cheaper than from-scratch; preserves general capabilities.

---

# Key Papers

| Paper | Contribution |
|-------|-------------|
| Kaplan et al. 2020 | *Scaling Laws for Neural Language Models* |
| Hoffmann et al. 2022 | *Chinchilla* -- compute-optimal training |
| Rajbhandari et al. 2020 | *ZeRO* -- memory-efficient distributed training |
| Narayanan et al. 2021 | *Megatron-LM* -- tensor parallelism |
| Penedo et al. 2024 | *FineWeb* -- data curation at scale |

---

# Exercises

1. Train a sequence of small GPTs (1M-64M params) at Chinchilla-optimal compute. Fit a power law to validation loss vs. compute.
2. Run training with and without document-level deduplication. Compare validation loss curves.
3. Implement a minimal FSDP from scratch in PyTorch on 2 GPUs. Verify equivalence.
4. Continue pre-training a public model for 1B tokens on a domain (e.g. medical papers). Measure perplexity on in-domain and general data.
