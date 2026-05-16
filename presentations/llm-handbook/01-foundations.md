---
marp: true
theme: default
paginate: true
header: 'LLM Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 1 -- Foundations

**Everything else sits on top of this module.** If you only have time for one module, make it this one. The ideas here -- tokens, embeddings, attention, the transformer block -- are the vocabulary the entire field thinks in.

---

# Why This Matters

- Every frontier LLM (GPT, Claude, LLaMA, Gemini) is a transformer under the hood
- Understanding these foundations lets you reason about cost, speed, and capability
- Without this vocabulary, research papers, model cards, and engineering tradeoffs are opaque
- This is the shared language of the entire field -- from research to production

---

# 1.1 Tokenization: Chopping Text into Pieces

- Characters explode sequence length (attention is $O(n^2)$)
- Whole words explode vocabulary and choke on unseen words
- **Subword tokenization** balances both -- chunks bigger than characters, smaller than words
- Three algorithms: **BPE** (GPT, LLaMA), **WordPiece** (BERT), **Unigram/SentencePiece**
- Token economy matters: English ~0.75 words/token; code and math are denser

---

# Try It: Tokenization

```python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")
enc.encode("hello world")          # [15339, 1917]
enc.encode(" hello world")         # different -- leading space changes first token

from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-8B")
tokens = tokenizer.encode("Hello, how are you doing today?")
decoded = [tokenizer.decode([t]) for t in tokens]
print(f"Token count: {len(tokens)}")
print(f"Decoded: {decoded}")
```

---

# 1.2 Embeddings and Positional Information

- Each token ID maps to a vector via an embedding matrix $E \in \mathbb{R}^{V \times d}$
- **Without position info**: "the dog bit the man" = "the man bit the dog" (just a bag of words)
- Pure self-attention is **permutation-equivariant** -- we must inject position

**Positional encoding options:**
- Sinusoidal absolute (original 2017 paper)
- Learned absolute (GPT-2) -- doesn't extrapolate past training length
- **RoPE** (Su et al. 2021) -- rotates Q/K vectors; dominates today
- **ALiBi** -- linear penalty on distance; no learned params

---

# How RoPE Works (Intuition)

- Rotates Q and K vectors in 2D subspaces by an angle proportional to position
- The dot product $\langle Q_i, K_j \rangle$ naturally depends on relative distance $i - j$
- Clean mathematical form + decent length extrapolation with scaling tricks
- Used by: LLaMA, Mistral, Qwen, DeepSeek, and most modern decoders

---

# 1.3 Attention: The Core Mechanism

**Analogy:** "The cat sat on the mat because **it** was tired" -- your brain instantly knows "it" = "the cat." Attention does the same thing: each token looks at every other token and decides how much to focus on each one.

- Each token produces three vectors:
  - **Query** -- "what am I looking for?"
  - **Key** -- "what do I contain?"
  - **Value** -- "what information do I provide if selected?"

---

# The Attention Formula

$$\text{Attn}(Q, K, V) = \text{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}}\right) V$$

**How to read this:**
- $QK^\top$ -- multiply queries by keys to get similarity scores
- $\sqrt{d_k}$ -- divide by sqrt of key dimension to prevent scores getting too large
- $\text{softmax}(\ldots)$ -- turn scores into probabilities (0 to 1, sum to 1)
- $\ldots V$ -- multiply probabilities by values to get weighted combination

**In one sentence:** "For each token, compute how much attention to pay to every other token, then take a weighted average of their values."

---

# Multi-Head Attention and Variants

- **Multi-head**: project Q, K, V into $h$ subspaces; each head can specialize
- **Causal mask**: token $i$ only attends to tokens $\leq i$ (enables next-token prediction)

| Variant | Q heads | K/V heads | KV cache size |
|---------|---------|-----------|---------------|
| **MHA** (original) | $h$ | $h$ | baseline |
| **MQA** (Shazeer 2019) | $h$ | 1 | ~10x smaller |
| **GQA** (Ainslie 2023) | $h$ | grouped | best tradeoff |
| **MLA** (DeepSeek-V2) | $h$ | low-rank latent | aggressive savings |

---

# Try It: Attention in 10 Lines

```python
import torch
import torch.nn.functional as F

def attention(Q, K, V):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / d_k**0.5
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V), weights

Q = K = V = torch.randn(1, 4, 8)  # batch=1, seq=4, dim=8
output, weights = attention(Q, K, V)
print(f"Attention weights:\n{weights[0]}")  # Each row sums to 1
```

---

# 1.4 The Transformer Block

A modern decoder block (pre-norm style) is surprisingly simple:

```
h = x + Attn(RMSNorm(x))
y = h + FFN(RMSNorm(h))
```

- **RMSNorm** replaced LayerNorm -- just divides by RMS, no mean-centering, cheaper
- **FFN** is typically **SwiGLU**: $\text{FFN}(x) = W_3 \big(\text{SiLU}(W_1 x) \odot (W_2 x)\big)$
- **Residual stream**: each block reads from and writes to a shared stream (Anthropic "transformer circuits" framing)

---

# RMSNorm Formula

$$\text{RMSNorm}(x) = \frac{x}{\sqrt{\frac{1}{d}\sum_i x_i^2 + \epsilon}} \odot \gamma$$

**How to read this:**
- Compute the root-mean-square of the input vector
- Divide each element by it (normalize)
- Multiply by a learned scale $\gamma$
- No mean-centering (unlike LayerNorm) -- simpler, cheaper, works as well

---

# Try It: Inspect a Real Model

```python
from transformers import AutoModel

model = AutoModel.from_pretrained("gpt2")
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")
print(f"Layers: {model.config.n_layer}")
print(f"Heads: {model.config.n_head}")
print(f"Hidden dim: {model.config.n_embd}")
```

GPT-2 Small: ~124M parameters, 12 layers, 12 heads, 768-dim hidden

---

# 1.5 Decoder-Only vs. Encoder-Decoder

| Architecture | Examples | Attention | Use Case |
|-------------|----------|-----------|----------|
| **Decoder-only** | GPT, LLaMA, Claude | Causal (left-to-right) | Generation (dominant) |
| **Encoder-only** | BERT, RoBERTa | Bidirectional | Representations, classification |
| **Encoder-decoder** | T5, BART | Cross-attention | Translation, seq2seq |

Modern frontier LLMs are **decoder-only**. The simplicity (one stack, one objective) and empirical scaling have won.

---

# 1.6 A Full Forward Pass

For tokens $t_1, \ldots, t_n$:

1. **Embed**: $x_i = E[t_i] \in \mathbb{R}^d$ (add position if not using RoPE)
2. **Stack of $L$ blocks**: pre-norm, attention, residual, pre-norm, FFN, residual
3. **Final RMSNorm** on the residual stream
4. **Project to vocab**: $\text{logits}_i = x_i^{(L)} E^\top \in \mathbb{R}^V$ (weight-tied)
5. **Loss**: cross-entropy against $t_{i+1}$ at each position

The whole model is one differentiable function trained by gradient descent.

---

# Key Papers

| Paper | Contribution |
|-------|-------------|
| Vaswani et al. 2017 | *Attention is All You Need* -- the foundation |
| Radford et al. 2018/2019 | *GPT-1/GPT-2* -- decoder-only LM at scale |
| Devlin et al. 2018 | *BERT* -- encoder side |
| Su et al. 2021 | *RoFormer (RoPE)* -- rotary positions |
| Shazeer 2020 | *GLU Variants* -- why SwiGLU |
| Ainslie et al. 2023 | *GQA* -- grouped KV heads |

---

# Exercises

1. Implement scaled dot-product attention in PyTorch (<10 lines). Verify gradient flow on a tiny example.
2. Build a single-block transformer ($d=64$), train it to copy a 10-token sequence. Watch the attention map develop a diagonal.
3. Compare BPE tokenization of English, Python code, and Mandarin. Plot tokens-per-byte for each.
4. Implement RoPE. Verify that rotating both Q and K by the same position gives the same attention score (relative-only property).

---

# Further Reading

- Karpathy's *Let's build GPT from scratch* (YouTube + nanoGPT repo)
- Phuong & Hutter 2022 -- *Formal Algorithms for Transformers*
- Anthropic's *A Mathematical Framework for Transformer Circuits*
- Lilian Weng's *The Transformer Family v2*
