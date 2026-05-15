# Module 5 — Architectures

The basic transformer from Module 1 is powerful, but it is not the final word. Real frontier models push beyond it in three directions: making models bigger without proportionally increasing compute (MoE), handling much longer inputs (long context), and processing images, audio, and video alongside text (multimodal). This module covers each of those extensions and what is changing at the architectural level.

## Learning goals

- Implement a Mixture-of-Experts (MoE) layer with top-k routing
- Explain RoPE extension methods (NTK-aware, YaRN, etc.) and their tradeoffs
- Describe how vision transformers and vision-language models work
- Understand state-space models (Mamba) and where they fit alongside transformers

## 5.1 Mixture of Experts

Think of it like a hospital. A dense transformer is a single general practitioner who handles every patient, no matter the condition. A Mixture of Experts (MoE) model is a hospital with many specialists -- each patient (token) gets routed to the relevant specialist, and only that specialist does the work. The hospital has far more total medical knowledge than a single GP, but any given patient only uses a fraction of it.

Concretely: a dense transformer activates all parameters for every token. MoE makes the FFN sparse -- each token is routed to a small subset of $E$ expert FFNs.

**Mechanics**:
- A gating network produces a score $g(x) \in \mathbb{R}^E$ per token.
- The top-$k$ experts (usually $k = 1$ or $2$) are selected; their outputs are weighted by softmax of the top-$k$ scores.
- Each token sees only $k$ experts. Total params grow with $E$; active params (and compute) grow only with $k$.

Modern MoE designs (Mixtral, DeepSeek-V3, Qwen-MoE) have 30B–700B total parameters with 4B–40B active. Roughly equivalent compute to a 4B–40B dense model, but with capability closer to the total size.

**Routing matters and is hard**:
- **Load balance**: without intervention, the router collapses to one expert. Auxiliary load-balancing losses (Switch Transformer) push uniform usage. DeepSeek-V3 introduced an *auxiliary-loss-free* approach via per-expert biases.
- **Capacity**: each expert handles at most $C \cdot N/E$ tokens per batch ($C$ is the capacity factor, typically 1.25). Overflow tokens are dropped.
- **Expert parallelism**: experts are sharded across devices. All-to-all communication every MoE layer dominates the cost at scale.

**Fine-grained experts** (DeepSeek-V2/V3): use many small experts ($E = 64$–$256$) with top-$k = 6$–$8$, plus shared experts that all tokens always see. Better than fewer large experts at equal compute.

**When MoE wins**: more capacity per training FLOP and per active-parameter FLOP. Excellent for serving (fast inference per token).

**When it loses**: poor batch-1 latency (memory bandwidth still pays for all experts that any token in the batch uses). Harder to train stably. Routing is brittle. Distillation from MoE to dense is sometimes done for deployment.

## 5.2 Long context

Why does long context matter practically? Consider the difference between a model that can see 4,000 tokens (about 3 pages of text) and one that can see 1 million tokens (an entire codebase, or a shelf of books). Long context turns LLMs from tools that answer questions about a paragraph into tools that reason over entire documents, repositories, and databases.

But it is not free. The vanilla transformer attention is $O(n^2)$ in both compute and memory. Pre-trained models also typically cannot extrapolate past the training context length. Two problems, sometimes addressed together.

### Length extrapolation with RoPE

RoPE rotates Q/K pairs by an angle $\theta_i \cdot m$ at position $m$, where $\theta_i = 10000^{-2i/d}$. To extend the context:

- **Position Interpolation** (Chen et al. 2023, Meta): scale positions to fit within the trained range. Simple, works with minimal fine-tuning.
- **NTK-aware scaling** (bloc97 2023): scale RoPE base rather than positions. Better extrapolation in low-fine-tuning regimes.
- **YaRN** (Peng et al. 2023): combines NTK-by-parts with attention temperature correction. Currently the dominant choice.
- **LongRoPE / dynamic methods**: data-driven extension to 128k+ contexts.

Most frontier models extend with a mixture of fine-tuning on long documents and one of these scaling tricks.

### Sub-quadratic attention

For really long contexts (millions of tokens), $O(n^2)$ is prohibitive. Approaches:

- **Sparse attention**: each token attends to a subset (Longformer, BigBird — local windows + global tokens; Sparse Transformer; DeepSeek's NSA).
- **Linear attention**: replace softmax with a kernel that factors as $\phi(Q)\phi(K)^\top V$, reducing to $O(n)$. Performer, Linear Attention. Quality historically lags.
- **State-space models** (next section): $O(n)$ via recurrence.
- **Hybrid**: alternate full attention and linear / SSM layers. Jamba, Zamba, recent hybrids. Often the best practical tradeoff.

### Engineering for long context

- **FlashAttention** (Dao et al. 2022) and FlashAttention-2/3: tile the attention computation to keep it in fast SRAM. Same answers, much faster, dramatically less memory. Universal in modern training.
- **Ring Attention** (Liu et al. 2023): shard the sequence across devices; pass K/V chunks around a ring. Enables training and inference at multi-million-token contexts.
- **Sequence parallelism** (DeepSpeed-Ulysses): similar idea with all-to-all primitives.

### Long context is not free, even with infinite compute

Models reliably *use* the entire context only with deliberate training. Common pathologies:

- **Lost in the middle** (Liu et al. 2023): models attend to the start and end, missing middle content.
- **Effective context length < advertised**. The Needle-in-a-Haystack and RULER benchmarks measure this.
- Most genuine improvement comes from long-context post-training data (multi-document QA, long-doc summarization, code with many files).

## 5.3 Multimodal models

The simplest multimodal LLM design:

1. Encode each modality (image, audio, video) into a sequence of tokens or embeddings.
2. Project into the LLM's embedding space.
3. Concatenate with text tokens and feed to the LLM.

For images, this typically means:
- **ViT encoder** (Dosovitskiy et al. 2020): split an image into patches (e.g. 14×14 pixels), linearly project each to a token, run a transformer encoder.
- **Projection** (linear or small MLP) from encoder dim to LLM dim. Sometimes a "resampler" reduces token count (Q-Former in BLIP-2, Perceiver Resampler in Flamingo).
- Concatenate with the text prompt.

Modern vision-language models (LLaVA, GPT-4V, Claude, Gemini, Qwen-VL):

- Train in two or three stages: (1) align the projector while freezing both encoders; (2) full fine-tune with image-text pairs; (3) instruction-tune on visual instruction data.
- Often handle multiple image resolutions by tiling or dynamic resolution (AnyRes, NaViT).

**Video** adds a temporal axis. Either treat as a sequence of frame-tokens (compute-heavy) or use a spatio-temporal encoder.

**Native multimodal** (Gemini, Chameleon, GPT-4o approach): train the LLM from scratch on interleaved text and image tokens, often with a unified tokenizer (e.g. VQ-VAE for images). Stronger cross-modal reasoning; harder to scale.

**Audio**: similar architecture (Whisper for speech-to-text encoders, then projection). Generative speech models add an audio decoder (e.g. SoundStream/SoundStorm-style).

## 5.4 State-space models (SSMs) and hybrids

The key question here is: can we get something close to the transformer's quality without paying its $O(n^2)$ cost? The transformer's quadratic scaling and ever-growing KV cache are real problems at long context lengths, which inspired a re-examination of recurrent architectures with modern tricks.

**S4 / S5 / Mamba** (Gu, Dao et al. 2021–2023). A linear time-invariant state-space model:

$$h_t = A h_{t-1} + B x_t, \qquad y_t = C h_t$$

with $A$ structured so the convolution kernel can be computed efficiently. **Mamba** (Gu & Dao 2023) makes $A, B, C$ input-dependent (selective state space). This recovers much of attention's expressiveness with $O(n)$ scaling and a constant-size cache (the hidden state).

**Strengths**: linear-time inference, no KV cache (constant memory), competitive on language at small/medium scales.

**Weaknesses**: in-context recall (e.g. retrieving exact strings from earlier in the context) is weaker than attention. Hence:

**Hybrids** are the practical answer. Most modern long-context models (Jamba, Zamba, Falcon-H1, Granite-H, etc.) alternate attention and SSM/recurrent layers — full attention for recall, SSM for cheap long-range mixing. The empirical sweet spot.

**Other recurrent revivals**: RWKV (recurrent FFN-flavored), RetNet (retention), xLSTM. The space is active; the broad conclusion in 2026 is that pure-attention is no longer obviously optimal but isn't going anywhere either.

## 5.5 Other architectural improvements

A few more concepts worth knowing:

- **Sliding-window attention** (Mistral, Longformer): each token attends to a window of $w$ recent tokens. Combined with full attention occasionally, gives effective long range at near-linear cost.
- **Hyena, RWKV-variants**: long-convolutional alternatives to attention.
- **Diff transformers**: subtract two attention maps to suppress noise (Microsoft, 2024).
- **Mixture-of-Depths**: dynamically skip layers per token. Inspired by MoE.
- **Latent attention (MLA)**: covered in Module 1.

## Key papers

- Shazeer et al. 2017 — *Outrageously Large Neural Networks (Sparse MoE)*.
- Fedus et al. 2021 — *Switch Transformer*.
- Jiang et al. 2024 — *Mixtral of Experts*.
- DeepSeek-AI 2024 — *DeepSeekMoE / DeepSeek-V3*.
- Dao et al. 2022 — *FlashAttention*.
- Liu et al. 2023 — *Ring Attention*.
- Peng et al. 2023 — *YaRN*.
- Dosovitskiy et al. 2020 — *ViT*.
- Liu et al. 2023 — *LLaVA*.
- Gu & Dao 2023 — *Mamba*.
- Lieber et al. 2024 — *Jamba*. Attention/SSM hybrid.

## Exercises

1. Implement a top-2 MoE FFN with a load-balancing auxiliary loss. Train a small MoE LM and compare with a parameter-matched dense baseline.
2. Take a 4k-context model and extend it to 16k with YaRN. Evaluate on a needle-in-haystack benchmark.
3. Fine-tune a small vision-language model: freeze a ViT and an LLM, train a linear projector on COCO captions. Measure caption quality.
4. Implement a minimal Mamba block and train on a copy-task benchmark to see where attention beats it and vice versa.

## Further reading

- *A Survey on Mixture of Experts in Large Language Models* (Cai et al. 2024).
- *Long Context LLMs Struggle with Long In-context Learning* — sober assessment.
- *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*.
- *Chameleon: Mixed-Modal Early-Fusion Foundation Models* (Meta 2024).
