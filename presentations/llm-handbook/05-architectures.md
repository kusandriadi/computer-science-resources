---
marp: true
theme: default
paginate: true
header: 'LLM Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 5 -- Architectures

**Beyond the basic transformer.** Real frontier models push in three directions: making models bigger without proportionally increasing compute (MoE), handling much longer inputs (long context), and processing images, audio, and video alongside text (multimodal).

---

# Why This Matters

- MoE lets you build models with more knowledge at the same inference cost
- Long context transforms LLMs from paragraph-level to codebase-level tools
- Multimodal is the path to general-purpose AI systems
- SSM/hybrid architectures may eventually replace pure attention for some workloads

---

# 5.1 Mixture of Experts (MoE)

**The hospital analogy:** A dense transformer is a single GP who handles every patient. An MoE model is a hospital with many specialists -- each patient (token) is routed to the relevant specialist, and only that specialist does the work.

- A gating network scores $g(x) \in \mathbb{R}^E$ per token
- Top-$k$ experts selected (usually $k=1$ or $2$)
- Total params grow with $E$; active params grow only with $k$
- Example: Mixtral, DeepSeek-V3 -- 30B-700B total, 4B-40B active

---

# MoE: Routing Challenges

**Router collapse**: the gating network sends everything to one expert, wasting capacity.

- **Load-balancing losses** (Switch Transformer) push uniform usage
- **DeepSeek-V3**: auxiliary-loss-free approach via per-expert biases
- **Capacity factor** $C$: each expert handles at most $C \cdot N/E$ tokens; overflow is dropped
- **Expert parallelism**: shard experts across devices; all-to-all communication dominates cost

**Fine-grained experts** (DeepSeek-V2/V3): many small experts ($E=64$-$256$) with top-$k=6$-$8$, plus shared experts all tokens always see. Better than fewer large experts.

---

# MoE: When It Wins and Loses

**Wins:**
- More capacity per training FLOP
- Excellent for serving (fast inference per token)
- Best throughput-to-capability ratio

**Loses:**
- Poor batch-1 latency (memory bandwidth pays for all expert weights)
- Harder to train stably
- Routing is brittle
- Distillation from MoE to dense sometimes done for deployment

---

# 5.2 Long Context: Why It Matters

The difference between 4K tokens (~3 pages) and 1M tokens (an entire codebase):

- Long context turns LLMs from paragraph tools into document/repository tools
- But vanilla attention is $O(n^2)$ in compute and memory
- Pre-trained models cannot extrapolate past training context length

**Two problems:** efficiency and extrapolation.

---

# RoPE Extension Methods

RoPE rotates Q/K by angle $\theta_i \cdot m$ at position $m$. To extend context:

| Method | Approach |
|--------|----------|
| **Position Interpolation** (Chen et al. 2023) | Scale positions to fit trained range |
| **NTK-aware scaling** (bloc97 2023) | Scale RoPE base instead of positions |
| **YaRN** (Peng et al. 2023) | NTK-by-parts + attention temperature correction (dominant) |
| **LongRoPE** | Data-driven extension to 128k+ |

Most frontier models combine fine-tuning on long documents with one of these tricks.

---

# Sub-Quadratic Attention

For millions of tokens, $O(n^2)$ is prohibitive:

- **Sparse attention** (Longformer, BigBird, DeepSeek NSA): attend to a subset
- **Linear attention** (Performer): factor as $\phi(Q)\phi(K)^\top V$, reducing to $O(n)$
- **State-space models**: $O(n)$ via recurrence
- **Hybrid**: alternate full attention and linear/SSM layers (Jamba, Zamba) -- often best practical tradeoff

**Engineering:** FlashAttention tiles computation to stay in fast SRAM. Ring Attention shards the sequence across devices for multi-million-token contexts.

---

# Long Context Pathologies

Models don't reliably *use* the entire context without deliberate training:

- **Lost in the middle** (Liu et al. 2023): models attend to start and end, missing middle
- **Effective context < advertised**: Needle-in-a-Haystack and RULER benchmarks measure this
- Improvement comes from **long-context post-training data** (multi-doc QA, long-doc summarization, multi-file code)

---

# 5.3 Multimodal Models

The simplest design:
1. Encode each modality (image, audio, video) into embeddings
2. Project into the LLM's embedding space
3. Concatenate with text tokens and feed to the LLM

**For images:**
- **ViT encoder**: split image into patches, project each to a token, run transformer encoder
- **Projection** (linear or MLP) from encoder dim to LLM dim
- Train in stages: align projector (frozen encoders), full fine-tune, instruction-tune

---

# Multimodal Architectures

| Type | Examples | Approach |
|------|----------|----------|
| **Adapter-based** | LLaVA, Qwen-VL | ViT + projector + LLM |
| **Native multimodal** | Gemini, Chameleon | Train from scratch on interleaved text + image tokens |
| **Audio** | Whisper-based | Speech encoder + projection |
| **Video** | Frame-sequence | Treat as sequence of frame-tokens |

**Native multimodal** (unified tokenizer, e.g. VQ-VAE for images) gives stronger cross-modal reasoning but is harder to scale.

---

# 5.4 State-Space Models (SSMs) and Hybrids

**Question:** Can we get transformer quality without $O(n^2)$ cost?

$$h_t = A h_{t-1} + B x_t, \qquad y_t = C h_t$$

**Mamba** (Gu & Dao 2023): makes $A, B, C$ input-dependent (selective state space). Recovers much of attention's expressiveness with $O(n)$ scaling and constant-size cache.

**Strengths:** Linear-time inference, no KV cache (constant memory)
**Weakness:** In-context recall (retrieving exact strings) is weaker than attention

---

# Hybrid Architectures: The Practical Answer

Most modern long-context models alternate attention and SSM/recurrent layers:
- **Full attention** for recall (finding exact information)
- **SSM** for cheap long-range mixing

Examples: Jamba, Zamba, Falcon-H1, Granite-H

Other recurrent revivals: RWKV, RetNet, xLSTM

> 2026 conclusion: pure-attention is no longer obviously optimal but isn't going anywhere either.

---

# 5.5 Other Architectural Improvements

- **Sliding-window attention** (Mistral): attend to $w$ recent tokens + occasional full attention
- **Diff transformers**: subtract two attention maps to suppress noise (Microsoft 2024)
- **Mixture-of-Depths**: dynamically skip layers per token
- **MLA (Multi-head Latent Attention)**: compress K/V to low-rank latent (Module 1)

---

# Key Papers

| Paper | Contribution |
|-------|-------------|
| Shazeer et al. 2017 | *Sparse MoE* -- the original |
| Fedus et al. 2021 | *Switch Transformer* |
| Jiang et al. 2024 | *Mixtral of Experts* |
| DeepSeek-AI 2024 | *DeepSeek-V3* -- fine-grained MoE |
| Dao et al. 2022 | *FlashAttention* |
| Peng et al. 2023 | *YaRN* |
| Gu & Dao 2023 | *Mamba* |
| Lieber et al. 2024 | *Jamba* -- attention/SSM hybrid |

---

# Exercises

1. Implement a top-2 MoE FFN with load-balancing auxiliary loss. Compare with a parameter-matched dense baseline.
2. Take a 4k-context model and extend it to 16k with YaRN. Evaluate on needle-in-a-haystack.
3. Fine-tune a small vision-language model: freeze a ViT and an LLM, train a linear projector on COCO captions.
4. Implement a minimal Mamba block and train on a copy-task to see where attention beats it and vice versa.
