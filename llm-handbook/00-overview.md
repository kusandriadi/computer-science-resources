# LLM Learning Curriculum — Foundations to Frontier

A structured path from "what is a transformer" to "I can read a frontier-model paper and reproduce the core ideas." Calibrated for both research depth and production work.

## Who this is for

- ML engineers and researchers who want a coherent, modern reference
- Practitioners who already use LLMs but want to understand the internals
- People moving from adjacent ML areas (vision, RL, classical NLP) into LLMs

## Prerequisites

- **Math**: linear algebra (matrix mult, eigendecomposition), probability (KL divergence, conditional probability), multivariable calculus (gradients, chain rule).
- **ML**: loss functions, SGD, backprop, regularization. Knowing one prior architecture (CNN, RNN) helps.
- **Programming**: Python, NumPy, PyTorch (or JAX). You should be comfortable writing a training loop.

If any of these are shaky: Goodfellow et al. *Deep Learning* (Ch. 2–6) covers the math; Karpathy's "Neural Networks: Zero to Hero" covers the engineering.

## Module map

| # | Module | Focus |
|---|--------|-------|
| 1 | Foundations | Tokens, embeddings, attention, transformer block |
| 2 | Pre-training | Data, scaling laws, optimizers, distributed training |
| 3 | Post-training | SFT, RLHF, DPO, RLAIF, constitutional methods |
| 4 | Inference | Sampling, KV cache, quantization, speculative decoding |
| 5 | Architectures | MoE, long context, multimodal, hybrid models |
| 6 | Reasoning & agents | CoT, test-time compute, tool use, RAG |
| 7 | Evaluation | Benchmarks, eval design, interpretability, red-teaming |
| 8 | Production | Building with LLMs, fine-tuning workflows, cost, observability |
| 9 | Reading list | Consolidated tiered paper list across all modules |
| 10 | Learning plan | Step-by-step plan with 3 pace tracks (sprint / standard / deep) |
| 11 | Appendix A — Toolkit | Languages and frameworks across the stack |
| 12 | Appendix B — Open-source & local | Open model families, Ollama, 2-week hands-on plan |
| 13 | Appendix C — Agent engineering | Tool design, skills, MCP, planning patterns |
| 14 | Appendix D — API vs self-hosted | Cost, customization terminology, decision framework |
| 15 | Appendix E — Hardware | GPU selection (H100/H200/B200/L40S/AMD), sizing, cost economics |
| 16 | Appendix F — Enterprise cases | Tax, HR, legal, finance, compliance — architectures and regulations |
| 17 | Appendix G — Security | Prompt injection, data leakage, tool abuse, OWASP LLM Top 10 |

Each module is roughly 30–90 minutes of reading plus the same again on exercises and papers. Linear order recommended for a first pass; the modules are also independently useful as references.

**A practical tip**: do Appendix B (local setup) in parallel with Module 1. Having models actually running on your machine while learning the theory is a huge accelerator.

## How to use this

Three modes:

1. **Self-study**: one module per week with all listed papers. Whole curriculum in ~2 months part-time.
2. **Onboarding** (e.g. a new hire on an LLM team): modules 1, 2, 4, 8 first, then the rest as needed.
3. **Reference**: jump directly to the module you need. Each module is standalone.

Suggested companion projects:
- **After Module 1**: build a minimal GPT (~200 lines) that trains on Shakespeare.
- **After Module 3**: fine-tune a small open model (e.g. Qwen-3B) with SFT then DPO on a preference dataset.
- **After Module 6**: build a tool-using agent that solves a class of math/code problems with RAG over a corpus you control.

## Conventions

- Math uses LaTeX (`$...$`). Most viewers (GitHub, Obsidian, VS Code + extension) render it.
- "Modern" means the state of the art as of early 2026. Where standards have shifted recently, both old and new are noted.
- Each module ends with **Key papers** (the canonical references), **Exercises** (hands-on), and **Further reading** (deeper dives).

## Reading discipline

Don't just read. For each paper:
1. Read the abstract and conclusion. Predict the method.
2. Read the method. Sketch the algorithm on paper.
3. Read the results. Note what you'd want to ablate.
4. Implement the smallest version that works.

Step 4 is what separates working knowledge from familiarity.
