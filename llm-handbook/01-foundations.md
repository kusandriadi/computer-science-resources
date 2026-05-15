# Module 1 — Foundations

Everything else in this curriculum sits on top of this module. If you only have time for one module, make it this one. The ideas here -- tokens, embeddings, attention, the transformer block -- are the vocabulary the entire field thinks in.

## Learning goals

By the end of this module you can:

- Explain why we use subword tokenization and tokenize text with `tiktoken`
- Compute attention by hand on a 3-token example
- Trace a full forward pass through a decoder block
- Implement a minimal GPT (≤300 lines) that trains on character-level data

## 1.1 Tokenization

Before an LLM sees your text, it has to chop it into pieces. The question is: what kind of pieces? Individual characters? Whole words? The answer is neither, and the reason is practical.

Characters explode sequence length (transformers are $O(n^2)$ in attention, so longer sequences get expensive fast). Whole words explode vocabulary and choke on out-of-vocabulary words. **Subword tokenization** balances both -- it splits text into chunks that are bigger than characters but smaller than words, adapting to what appears frequently in the training data.

Three common algorithms:

- **BPE** (Byte-Pair Encoding, Sennrich et al. 2016). Start with characters; iteratively merge the most frequent adjacent pair into a new token. GPT, LLaMA, and most modern decoders use *byte-level* BPE on UTF-8 bytes, so any string is representable (no `<UNK>`).
- **WordPiece** (used by BERT). Similar to BPE but merges based on likelihood gain rather than raw frequency.
- **Unigram / SentencePiece** (Kudo 2018). Starts with a large vocab and prunes; works on raw bytes, no pre-tokenization needed.

Practical notes:

- **Token economy matters**. English prose is ~0.75 words/token. Code, math, and non-Latin scripts are denser (more tokens per byte). Tokenization choices materially affect compute cost and effective context length.
- **Numbers** are a known pain point. Older tokenizers split numbers inconsistently ("1234" might be `1234` or `1`, `234`); modern tokenizers (LLaMA-3, GPT-4o) often digit-by-digit or grouped consistently to help arithmetic.
- **`tiktoken`** is the fast reference implementation. `cl100k_base` is GPT-3.5/4; `o200k_base` is GPT-4o-era.

```python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")
enc.encode("hello world")          # [15339, 1917]
enc.encode(" hello world")         # different — leading space changes the first token
```

### Try it: Tokenization in practice

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-8B")
text = "Hello, how are you doing today?"
tokens = tokenizer.encode(text)
decoded = [tokenizer.decode([t]) for t in tokens]
print(f"Text: {text}")
print(f"Tokens: {tokens}")
print(f"Decoded: {decoded}")
print(f"Token count: {len(tokens)}")
```

## 1.2 Embeddings and positional information

Now that we have token IDs, the model needs to turn them into something it can do math on. Each token ID gets mapped to a vector -- a list of numbers that represents the token's "meaning" in a high-dimensional space. Concretely, this is a lookup in an embedding matrix $E \in \mathbb{R}^{V \times d}$, where $V$ is vocab size and $d$ is the model dimension. The output projection (logits) is often **tied** to $E^\top$ to save parameters.

Here's a puzzle: without position information, the model sees "the dog bit the man" and "the man bit the dog" as the same thing -- just a bag of words. Obviously that's wrong. We need to tell the model which word comes first, second, third. That's what positional encoding does.

More precisely, pure self-attention is permutation-equivariant. If you shuffle the tokens, you get shuffled outputs -- the model has no idea what order the words came in. So we need to inject positional information. Options:

- **Sinusoidal absolute** (original 2017 paper) — fixed sin/cos at different frequencies.
- **Learned absolute** — a position embedding matrix $P \in \mathbb{R}^{L \times d}$ added to token embeddings. Used by GPT-2. Doesn't extrapolate past $L$.
- **Relative** (Shaw, T5) — biases attention scores by token distance.
- **RoPE** (Rotary Position Embedding, Su et al. 2021) — rotates Q/K vectors in 2D subspaces by an angle proportional to position. The dot product $\langle Q_i, K_j \rangle$ then depends on $i - j$ naturally. Used by LLaMA, Mistral, Qwen, DeepSeek, and most modern decoders.
- **ALiBi** (Press et al. 2022) — adds a linear penalty $-m \cdot (i - j)$ to attention logits. No learned positional params; extrapolates well.

RoPE dominates today because of its clean mathematical form and decent length extrapolation when combined with scaling tricks (Module 5).

## 1.3 Attention

Attention is the core mechanism that makes transformers work, and it is worth building intuition before looking at the math.

Think of it this way: when you read a sentence like "The cat sat on the mat because **it** was tired," your brain instantly knows "it" refers to "the cat." You are selectively paying attention to the relevant earlier word. Attention in a transformer does the same thing -- each token gets to look at every other token and decide how much to "focus on" each one. High attention weight means "this other token is important for understanding me."

Concretely, each token produces three vectors: a **Query** ("what am I looking for?"), a **Key** ("what do I contain?"), and a **Value** ("what information do I provide if selected?"). The model computes how well each Query matches each Key, and uses those scores to take a weighted combination of Values.

Now the math. Scaled dot-product attention:

$$\text{Attn}(Q, K, V) = \text{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}}\right) V$$

**How to read this formula:**
- $Q$ (Query) — "what am I looking for?" — the current token's question
- $K$ (Key) — "what do I contain?" — each other token's label
- $V$ (Value) — "what information do I provide?" — the actual content to retrieve
- $QK^T$ — multiply queries by keys (transposed) to get similarity scores
- $\sqrt{d_k}$ — divide by square root of key dimension to prevent scores from getting too large
- $\text{softmax}(...)$ — turn scores into probabilities (0 to 1, summing to 1)
- $...V$ — multiply probabilities by values to get the weighted combination

**In one sentence:** "For each token, compute how much attention to pay to every other token, then take a weighted average of their values."

The $\sqrt{d_k}$ scaling prevents softmax saturation as $d_k$ grows. Without it, large dot products would push softmax into a regime where gradients nearly vanish.

**Multi-head**: project $Q, K, V$ into $h$ different subspaces in parallel, apply attention, concat, project out. Each head can specialize (some attend locally, some track syntax, some copy-and-paste, etc.).

For decoders, a **causal mask** sets logits at $(i, j)$ to $-\infty$ for $j > i$, so token $i$ only attends to tokens $\leq i$. This is what enables next-token prediction.

Modern attention variants reduce memory and compute, especially the cost of the KV cache at inference. This matters a lot in practice -- the KV cache is often the bottleneck that limits how many users you can serve at once (Module 4 goes deep on this):

- **MHA** — original multi-head. $h$ Q heads, $h$ K heads, $h$ V heads.
- **MQA** (Shazeer 2019) — $h$ Q heads, 1 K head, 1 V head. ~10× smaller KV cache, modest quality loss.
- **GQA** (Ainslie et al. 2023) — group K/V heads. LLaMA-2 70B uses 8 KV heads for 64 Q heads. Best practical tradeoff for dense models.
- **MLA** (Multi-head Latent Attention, DeepSeek-V2) — compress K/V to a low-rank latent, decompress when needed. Aggressive KV savings.

### Try it: Attention in 10 lines

```python
import torch
import torch.nn.functional as F

def attention(Q, K, V):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / d_k**0.5
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V), weights

# Try it
Q = K = V = torch.randn(1, 4, 8)  # batch=1, seq=4, dim=8
output, weights = attention(Q, K, V)
print(f"Attention weights:\n{weights[0]}")  # Each row sums to 1
```

## 1.4 The transformer block

Now we can zoom out and see how attention fits into the bigger picture. A transformer is just a stack of identical blocks, and each block is surprisingly simple. Here is a modern decoder block (pre-norm, the dominant style):

```
h = x + Attn(RMSNorm(x))
y = h + FFN(RMSNorm(h))
```

Three things to know:

**RMSNorm** has largely replaced LayerNorm (Zhang & Sennrich 2019). Just divides by the RMS of the activation; no mean-centering. Cheaper and works as well.

$$\text{RMSNorm}(x) = \frac{x}{\sqrt{\frac{1}{d}\sum_i x_i^2 + \epsilon}} \odot \gamma$$

**FFN** is typically a **SwiGLU**:

$$\text{FFN}(x) = W_3 \big(\text{SiLU}(W_1 x) \odot (W_2 x)\big)$$

where $\text{SiLU}(x) = x \cdot \sigma(x)$. The gated version (Shazeer 2020) consistently outperforms plain ReLU/GELU MLPs. Hidden dim is often $\approx \tfrac{8}{3} d$ when using SwiGLU to keep total params comparable to a $4d$ vanilla MLP.

**Residual stream**. The Anthropic "transformer circuits" framing is useful: each block reads from and writes to a shared residual stream. The stream is the dominant flow of information; attention and FFN are corrections applied to it. This perspective is essential later for interpretability.

### Try it: Load and inspect a real model

```python
from transformers import AutoModel

model = AutoModel.from_pretrained("gpt2")
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")
print(f"Layers: {model.config.n_layer}")
print(f"Heads: {model.config.n_head}")
print(f"Hidden dim: {model.config.n_embd}")
```

## 1.5 Decoder-only vs. encoder-decoder

- **Decoder-only** (GPT, LLaMA, Mistral, Qwen, Claude). Causal mask, autoregressive. Predicts the next token given all previous tokens. Dominant paradigm for generation.
- **Encoder-only** (BERT, RoBERTa). Bidirectional attention, masked LM objective. Great for representations and classification; can't generate.
- **Encoder-decoder** (T5, BART, original Transformer). Encoder reads input; decoder generates output cross-attending to encoder. Still used in translation and some seq2seq tasks.

Modern frontier LLMs are decoder-only. The simplicity (one stack, one objective) and the empirical scaling have won.

## 1.6 Putting it together: a forward pass

Let's trace what actually happens when you feed a sentence into the model, start to finish. For a sequence of $n$ tokens $t_1, \ldots, t_n$:

1. **Embed**: $x_i = E[t_i] \in \mathbb{R}^d$ (and add position if not using RoPE).
2. **Stack of $L$ blocks**, each doing pre-norm → attention → residual → pre-norm → FFN → residual.
3. **Final RMSNorm** on the residual stream.
4. **Project to vocab**: $\text{logits}_i = x_i^{(L)} E^\top \in \mathbb{R}^V$ (weight-tied).
5. **Loss**: cross-entropy against $t_{i+1}$ at each position $i$.

The whole model is one differentiable function. You train by gradient descent on the cross-entropy loss.

## Key papers

- Vaswani et al. 2017 — *Attention is All You Need*. The foundational paper.
- Radford et al. 2018, 2019 — *GPT-1 / GPT-2*. Decoder-only LM at scale.
- Devlin et al. 2018 — *BERT*. For the encoder side.
- Su et al. 2021 — *RoFormer (RoPE)*.
- Shazeer 2020 — *GLU Variants*. Why SwiGLU.
- Ainslie et al. 2023 — *GQA*.

## Exercises

1. Implement scaled dot-product attention in PyTorch in under 10 lines. Verify gradient flow on a tiny example.
2. Build a single-block transformer with $d = 64$, train it to copy a 10-token sequence. Watch the attention map develop a diagonal.
3. Compare BPE tokenization of an English paragraph, a Python function, and a paragraph of Mandarin. Plot tokens-per-byte for each.
4. Implement RoPE. Verify that rotating both $Q$ and $K$ by the same position gives the same attention score (relative-only property).

## Further reading

- Karpathy's *Let's build GPT from scratch* (YouTube + nanoGPT repo).
- Phuong & Hutter 2022 — *Formal Algorithms for Transformers*. Precise pseudocode.
- Anthropic's *A Mathematical Framework for Transformer Circuits* (transformer-circuits.pub). Essential perspective.
- Lilian Weng's blog post *The Transformer Family v2* — comprehensive variant survey.
