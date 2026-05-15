# Learning Plan — Step by Step

A concrete roadmap through the curriculum. Three tracks depending on how much time you have. Each phase has a fixed deliverable (so you know you're done) and a self-check (so you know you understood).

## Choose your track

| Track | Total time | Weekly commitment | For who |
|-------|-----------|-------------------|---------|
| **Sprint** | 5 weeks | full-time (~40 hr/wk) | Practitioners who need to ship; minimal theory. |
| **Standard** | 14 weeks | part-time (~10 hr/wk) | The recommended default. Balanced theory + practice. |
| **Deep** | 7 months | part-time (~10 hr/wk) | Research-grade. All exercises, all key papers, multiple reimplementations. |

The phases below are the same for all three tracks — only the depth and pace change. Sprint skips most papers and all but the core exercises; Standard does everything in each phase; Deep adds reimplementations and the "further reading" lists.

## The flow at a glance

```
Phase 0  Setup                    (1–2 days)        ← Appendix B
Phase 1  Foundations              (theory + nanoGPT) ← Module 1
Phase 2  Train at scale           (data + scaling)   ← Module 2
Phase 3  Post-training            (SFT, DPO, RLHF)   ← Module 3
Phase 4  Inference & serving      (KV cache, quant)  ← Module 4
Phase 5  Advanced architectures   (MoE, long ctx)    ← Module 5
Phase 6  Reasoning & agents       (CoT, tools, RAG)  ← Module 6
Phase 7  Evaluation               (benchmarks, interp) ← Module 7
Phase 8  Production               (build a real thing) ← Module 8 + Appendix A
```

Each phase builds on the prior. Don't skip forward unless you can answer the phase's self-check.

---

## Phase 0 — Setup (1–2 days)

**Goal**: have a working environment, run a model end-to-end, prove your hardware works.

**Steps**:
1. Install Ollama (Appendix B §B.4). `ollama run llama3.2` and chat for 5 minutes.
2. Set up a Python environment (Python 3.11+ recommended). `uv` or `conda`.
3. Install the core stack: `pip install torch transformers datasets accelerate peft trl jupyter`.
4. Pull two more models: a small one (`qwen3:4b`) and a reasoning one (`deepseek-r1:8b`). Compare answers on a math problem.
5. Hit Ollama's OpenAI-compatible API from Python (Appendix B §B.4).
6. Clone reference repos to read alongside your work:
   - `karpathy/nanoGPT`
   - `karpathy/build-nanogpt`
   - `huggingface/transformers` (for source-diving later)
   - `vllm-project/vllm`

**Deliverable**: a Jupyter notebook that calls a local Ollama model, prints a response, and counts tokens with `tiktoken`.

**Self-check**: Can you switch between three different local models with one line of code? Can you explain to a colleague why local inference is slower than API inference at batch=1?

---

## Phase 1 — Foundations (Module 1)

**Time**: Sprint 3 days · Standard 1.5 weeks · Deep 3 weeks.

**Read**: Module 1 (Foundations) end to end.

**Watch**: Karpathy *Let's build GPT from scratch* (~2 hours). This is non-negotiable. It's the highest-leverage 2 hours of video in this whole field.

**Implement**:
- Scaled dot-product attention from scratch.
- A single transformer block (RMSNorm + multi-head attention + SwiGLU FFN + residuals).
- A complete tiny GPT (~200 lines) and train it on Shakespeare or `tinystories`.

**Papers to read** (Standard+):
- Vaswani et al. 2017 — *Attention is All You Need*
- Radford et al. 2019 — *GPT-2*
- Su et al. 2021 — *RoPE*

**Deliverable**: a `tiny-gpt.py` that:
- Trains on a small text corpus.
- Generates plausible continuations.
- Uses RoPE (not learned positional embeddings) and SwiGLU (not vanilla MLP).

**Self-check**:
- Can you compute attention by hand on a 3-token sequence?
- Can you draw the data flow through one transformer block from memory?
- What's the parameter count of your tiny GPT, and where do the parameters live (embeddings vs attention vs FFN)?

If you can't answer these — **don't move on**. The whole rest of the curriculum assumes this is muscle memory.

---

## Phase 2 — Training at scale (Module 2)

**Time**: Sprint 3 days · Standard 1.5 weeks · Deep 3 weeks.

**Read**: Module 2 (Pre-training) end to end.

**Implement**:
- Fit a power law to your tiny-GPT runs: train 4 sizes (1M, 4M, 16M, 64M params), plot loss vs compute, fit $L = a \cdot C^{-b}$.
- Run the same model twice on the same data with and without document-level deduplication. Compare loss curves.
- *(Standard+)* Implement a minimal FSDP-style parameter sharding by hand on 2 GPUs (or simulate by sharding on CPU).

**Papers** (Standard+):
- Kaplan et al. 2020 — *Scaling Laws*
- Hoffmann et al. 2022 — *Chinchilla*
- *Llama 3* technical report (skim Sections 3–4)
- *DeepSeek-V3* technical report (skim)

**Deliverable**: a notebook with your scaling-law fit and a written one-page summary explaining (a) what Chinchilla showed, (b) why modern recipes over-train past it, and (c) what compute you'd budget to reach a target loss.

**Self-check**:
- For a 13B model, how many tokens should you train it on under (a) Chinchilla-optimal, (b) modern over-training? Roughly how many H100-hours is that?
- What's the difference between ZeRO-1, ZeRO-2, ZeRO-3 (FSDP)? When would you reach for tensor parallelism vs FSDP?

---

## Phase 3 — Post-training (Module 3)

**Time**: Sprint 4 days · Standard 2 weeks · Deep 4 weeks.

This is where things get *visible* — your model starts behaving like an assistant.

**Read**: Module 3 (Post-training) end to end.

**Implement**:
- Run SFT on a small base model (`Qwen3-4B-Base` or similar) with Unsloth + QLoRA on ~10k OpenAssistant or Alpaca examples. Compare to base on MT-Bench-style prompts.
- Run DPO from `trl` on UltraFeedback. Compare to your SFT-only model.
- *(Standard+)* Derive the DPO loss from the RLHF objective on paper. Confirm the partition function cancels.
- *(Deep)* Implement a tiny GRPO loop on a math task with verifiable rewards.

**Papers** (Standard+):
- Ouyang et al. 2022 — *InstructGPT*
- Bai et al. 2022 — *Constitutional AI*
- Rafailov et al. 2023 — *DPO*
- DeepSeek-AI 2025 — *DeepSeek-R1*

**Deliverable**: three versions of the same base model — base, +SFT, +SFT+DPO — and a side-by-side eval showing the progression.

**Self-check**:
- Why does pure SFT often *increase* hallucination relative to the base model?
- Walk through the DPO derivation: what does the closed-form optimal policy look like, and why does the partition function cancel in the pairwise loss?
- When would you choose PPO/GRPO over DPO?

---

## Phase 4 — Inference and serving (Module 4)

**Time**: Sprint 2 days · Standard 1 week · Deep 2 weeks.

**Read**: Module 4 (Inference) end to end.

**Implement**:
- Sampling: greedy, top-k, top-p, min-p from scratch. Visualize the distributions.
- KV cache: implement it from scratch in a tiny model. Benchmark cached vs uncached generation.
- Quantization: convert one of your models to INT8 (bitsandbytes) and Q4_K_M GGUF (llama.cpp). Measure perplexity change.
- Serve your SFT/DPO model from Phase 3 with vLLM. Measure TTFT, TPOT, throughput vs batch size.
- *(Standard+)* Implement speculative decoding with a small draft + your model. Measure speedup.

**Papers** (Standard+):
- Dao et al. 2022 — *FlashAttention*
- Kwon et al. 2023 — *vLLM*
- Leviathan et al. 2023 — *Speculative Decoding*

**Deliverable**: a single chart showing throughput-vs-batch-size for your model at FP16, INT8, and INT4, served with vLLM.

**Self-check**:
- Why is decode memory-bandwidth-bound and prefill compute-bound? What follows from that for serving design?
- Roughly: what's the per-token decode latency of a 7B model on an H100 in fp16? How does that change at batch 64?

---

## Phase 5 — Advanced architectures (Module 5)

**Time**: Sprint 2 days · Standard 1 week · Deep 2 weeks.

**Read**: Module 5 (Architectures) end to end.

**Implement**:
- A minimal MoE FFN with top-2 routing and a load-balancing auxiliary loss. Compare against a parameter-matched dense baseline on tiny scale.
- Extend a 4k-context model to 16k with YaRN; evaluate on needle-in-haystack.
- *(Standard+)* A minimal Mamba block. Train on a copy task. Find where attention beats it.
- *(Deep)* A small LLaVA-style vision-language stack: ViT encoder + projector + frozen LLM, trained on COCO captions.

**Papers** (Standard+):
- Jiang et al. 2024 — *Mixtral*
- DeepSeek-AI 2024 — *DeepSeekMoE / V3*
- Peng et al. 2023 — *YaRN*
- Liu et al. 2023 — *LLaVA*
- Gu & Dao 2023 — *Mamba* (Deep only)

**Deliverable**: a notebook comparing your dense vs MoE tiny models on equal FLOPs and equal params.

**Self-check**:
- Why does fine-grained MoE (many small experts) outperform coarse-grained (few large experts) at equal compute?
- What's the difference between length extrapolation and length adaptation? Why does YaRN need both?

---

## Phase 6 — Reasoning, agents, and RAG (Module 6)

**Time**: Sprint 1 week · Standard 4 weeks · Deep 8 weeks.

This is the longest phase, and deliberately so. The three sub-areas (RAG, agents, reasoning) are complementary, not alternatives — modern systems combine all three. Do them sequentially in the order below; each builds intuition for the next.

**Read first**: Module 6 (Reasoning & agents) end to end. Also read *Building Effective Agents* (Anthropic) before designing anything.

### 6A — RAG (first, ~1 week standard)

Start here because retrieval is the most concrete and the eval signals are clearest.

**Implement**: a real RAG system over a corpus you care about (your notes, a documentation site, a paper collection — pick something you'll actually query).
- LlamaIndex or your own ~200 lines (try the latter first; the abstractions are clearer when you've built them).
- pgvector or Chroma for the vector store.
- BGE embeddings (`bge-m3` or `bge-large-en-v1.5`).
- BGE reranker on top of top-50 → top-5.
- Hybrid search: vector + BM25, fused with reciprocal rank fusion.
- Hand-write 50 evaluation questions with known answers.
- Measure: retrieval accuracy (was the right chunk in top-k?), answer correctness, citation accuracy.

**Sub-deliverable**: a working RAG that beats a no-retrieval baseline by a meaningful margin on your eval set, with the gap measured per-question.

**Sub-check**: For 3 questions your system got wrong, which stage failed — retrieval, reranking, or generation?

### 6B — Agents (second, ~1.5 weeks standard)

Once retrieval is solid, add action. The hardest thing about agents is reliability, which is also the most useful thing to learn.

**Read first**: Appendix C (Agent Engineering) end to end. Module 6 gives you the concepts; Appendix C gives you the engineering primitives — tool design, skills, MCP, planning patterns, error recovery.

**Implement**: a tool-using agent that solves a class of problems.
- Start with the simplest possible loop: model → tool call → result → model. ~100 lines of your own code. Don't reach for a framework yet.
- Two tools minimum: Python execution (a sandbox you control) + one other (web search, file read, your RAG from 6A as a tool, etc.).
- 20 hand-built problems with known correct outcomes.
- Track per-step: tool choice, arguments, success, latency.
- *Then* try smolagents and LangGraph and compare to your hand-rolled version. You'll have opinions now.

**Variations to try once the basic loop works**:
- Add memory: a summary of prior turns when the context gets long (compaction — see Appendix C §C.5).
- Add planning: a "make a plan first" turn before tool use (see C.4 for patterns).
- Add a critic: a second LLM call that reviews the agent's output before returning.
- Write a **skill** (C.7) for a domain you care about and load it into your agent. Compare against the same agent without the skill.
- Build a **MCP server** (C.8) exposing one of your tools. Connect it to Claude Desktop or Cursor; use it for real work for a day.

**Sub-deliverable**: an agent with at least 70% success rate on your 20 problems, plus a documented failure taxonomy (which classes of failure occur, how often, why).

**Sub-check**: What's the difference between a workflow and an agent in your system? When does each pattern win?

### 6C — Reasoning models (third, ~1.5 weeks standard)

The newest of the three, and the one that most stretches the rest of the curriculum (it leans on Phase 3 RL knowledge).

**Implement**: train a small reasoner.
- Start from a strong small base (`Qwen3-4B-Base` or `Llama-3.2-3B-Base`).
- SFT on a few thousand CoT examples from a math/reasoning dataset (NuminaMath, MATH train split, or distilled traces from R1/o1-style models).
- GRPO on math problems with verifiable answers (GSM8K train, MATH train). Use the verifiable-reward setup from Module 3.
- Measure GSM8K and MATH accuracy at: base, +SFT, +SFT+GRPO. Plot the progression.
- *(Standard+)* Try self-consistency / majority voting on top of each variant. Plot accuracy vs N samples.

**Sub-deliverable**: three reasoner variants and a chart showing how each improvement step and each test-time-compute setting moves the needle.

**Sub-check**: Walk through one of your model's generated reasoning traces. Is the reasoning faithful (does it correspond to what the model actually computed) or is it post-hoc rationalization?

### 6D — Combine them

The payoff: integrate the three. A retrieval-augmented agent that uses a reasoning model as its core.

**Implement**: take your agent from 6B, swap the model for your reasoner from 6C, and let it use your RAG from 6A as a tool. Run it on a harder problem set — multi-step questions that need both retrieval and computation. Compare against each component alone.

**Final deliverable** for Phase 6: a single working system that demonstrably benefits from all three improvements (retrieval, tools, reasoning), with an eval set showing the ablation.

**Papers** (Standard+):
- Wei et al. 2022 — *Chain-of-Thought*
- Kojima et al. 2022 — *Zero-Shot CoT*
- Wang et al. 2022 — *Self-Consistency*
- Snell et al. 2024 — *Scaling Test-Time Compute*
- OpenAI 2024 — *Learning to Reason with LLMs (o1)*
- DeepSeek-AI 2025 — *DeepSeek-R1*
- Yao et al. 2023 — *ReAct*
- Lewis et al. 2020 — *RAG*
- Anthropic — *Building Effective Agents*

**Phase self-check**:
- Why does CoT help, mechanistically? What does test-time compute "buy" you?
- For each of your three sub-systems, what are the top-3 failure modes and how would you address each?
- Where is each technique (RAG / tools / reasoning) the *right* tool, and where would another do better?

---

## Phase 7 — Evaluation and interpretability (Module 7)

**Time**: Sprint 2 days · Standard 1 week · Deep 3 weeks.

**Read**: Module 7 (Evaluation) end to end.

**Implement**:
- Take your Phase 6 system. Build a proper eval pipeline with Inspect or Promptfoo. Compute confidence intervals.
- Run your prompt with 3 reformulations. Measure variance. Compare to model-to-model differences.
- Build a small LLM-as-judge for your task. Calibrate against 10 hand-labeled examples.
- *(Deep)* Train a small sparse autoencoder on a tiny model's residual stream. Inspect features.

**Papers** (Standard+):
- Liang et al. 2022 — *HELM*
- Zheng et al. 2023 — *LLM-as-Judge*
- Olsson et al. 2022 — *Induction Heads*
- Bricken et al. 2023 — *Towards Monosemanticity* (Deep)

**Deliverable**: a CI-style eval script that runs on every change to your prompts/model and reports a quality number with error bars.

**Self-check**:
- Pick a published "X model beats Y by 3 points on MMLU" claim. List five reasons it could be misleading.
- For your system, what's the gap between "the model can do this" and "the model does this on real inputs"?

---

## Phase 8 — Production (Module 8 + Appendix A)

**Time**: Sprint 3 days · Standard 1.5 weeks · Deep 4 weeks.

**Read**: Module 8 (Production) + Appendix A (Toolkit) end to end.

**Implement** — turn the Phase 6 system into something you'd actually deploy:
- Add Langfuse or Phoenix tracing. Look at real traces.
- Add prompt caching. Measure cost difference.
- Add input/output validation, schema-checked structured outputs.
- Build a route table: small model for easy queries, large for hard ones.
- Add a regression-test pipeline (Phase 7's evals running on every change).
- Document the system. Pretend a new engineer joins tomorrow.

**Deliverable**: a deployable artifact (Docker / repo / spec) plus a one-page architecture doc covering: data flow, models used, retrieval/tool config, observability, cost per request, known failure modes.

**Self-check**:
- For your system, give a back-of-envelope for: $/request, p50 latency, p95 latency, failure rate.
- Where are the next three improvements that would most improve user experience? Why those?

---

## Habits to keep through every phase

A few patterns that separate people who learn this well from people who skim it:

**Read failure traces, not aggregate metrics.** Every project will give you opportunities to read raw outputs. Always take them. Aggregate numbers tell you what; traces tell you why.

**Implement before you read.** When you encounter a new method (DPO, GQA, YaRN, etc.), try to implement the simplest version *before* reading the paper carefully. Coming back to the paper after a failed attempt makes the paper 5× more legible.

**Maintain a "questions notebook".** Things you don't understand, papers cited but not read, mysterious benchmark numbers. Revisit weekly. Most resolve naturally; a few become your next research project.

**Keep your eval set forever.** From Phase 1 onwards, accumulate the 100–300 examples you actually care about. Every model, every prompt, every change gets run against them. This is the single highest-leverage artifact you'll build.

**Don't optimize without measuring.** You will be tempted to refactor your tokenizer, swap your embedding model, switch frameworks. Each of these may or may not help. Measure first.

**Re-read Module 1 every two months.** The fundamentals are how everything else is named and described. Your understanding deepens; the same words mean more.

---

## Common deviations

The plan is linear, but reality isn't. Some defensible deviations:

- **If you'll only build products** (not train models): do Phases 0, 1, 4, 6, 7, 8. Skim 2, 3, 5. You can come back.
- **If you're a researcher in a specific subfield**: depth on Module 1 + your subfield's module. Skim the rest for context.
- **If you're stuck on a phase for >2 weeks**: it's almost always a Module 1 gap. Re-watch Karpathy. Re-implement attention. Move on.
- **If something new and big drops** (new model, new paradigm): pause and read the technical report. The field rewards being current. Resume the plan after.

---

## What "done" means

You've finished this curriculum when:

- You can read a new frontier-model paper and identify what's novel within an hour.
- You can take a new task and choose the right combination of prompting, RAG, fine-tuning, and architecture without consulting a table.
- You can debug a misbehaving LLM system by reading traces and forming testable hypotheses.
- You can explain any sentence in this curriculum to a colleague without re-reading the source.

That's the bar. It's reachable in 3 months part-time if you stay honest with the self-checks. Good luck.
