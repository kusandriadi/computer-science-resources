# LLM Learning Curriculum

A complete curriculum covering Large Language Models from foundations to production. ~36k words across 19 files. Designed for both research depth and practical work.

## Read in this order

### Start here
- `00-overview.md` — What this curriculum is, prerequisites, how to use it.

### Core modules (linear)
- `01-foundations.md` — Tokens, embeddings, attention, transformer blocks.
- `02-pretraining.md` — Data pipelines, scaling laws, distributed training.
- `03-post-training.md` — SFT, RLHF, DPO, GRPO, Constitutional AI.
- `04-inference.md` — KV cache, quantization, speculative decoding, serving.
- `05-architectures.md` — MoE, long context, multimodal, state-space models.
- `06-reasoning-agents.md` — CoT, test-time compute, tools, RAG.
- `07-evaluation.md` — Benchmarks, eval design, interpretability, red-teaming.
- `08-production.md` — Building real systems, fine-tuning workflows, observability.

### Reference and planning
- `09-essential-reading.md` — Tiered paper list across all modules.
- `10-learning-plan.md` — Step-by-step plan with 3 pace tracks (sprint / standard / deep).

### Appendices (read as needed)
- `11-appendix-A-toolkit.md` — Languages and frameworks across the stack.
- `12-appendix-B-opensource-and-local.md` — Open model families, Ollama, local setup.
- `13-appendix-C-agent-engineering.md` — Tool design, skills, MCP, planning patterns.
- `14-appendix-D-api-vs-selfhosted.md` — Cost, customization, decision framework.
- `15-appendix-E-hardware.md` — GPU selection, sizing, cost economics.
- `16-appendix-F-enterprise-cases.md` — Tax, HR, legal, finance use cases.
- `17-appendix-G-security.md` — Prompt injection, data leakage, OWASP LLM Top 10.

## Suggested paths by role

**ML researcher**: 00 → 01 → 02 → 03 → 05 → 07 → 09 → 10 (Deep track) → appendices as needed.

**ML engineer building products**: 00 → 01 → 06 → 08 → 13 → 14 → 11 → 04 → 12 → 15 → 17.

**Tech lead / decision maker**: 00 → 08 → 14 → 15 → 16 → 17 → relevant modules for depth.

**Enterprise practitioner (tax/HR/legal/finance)**: 00 → 16 (your domain) → 06 → 08 → 17 → 13.

**Solo learner from scratch**: 00 → 12 (set up Ollama first) → 01 in parallel → linear through modules.

## How to use

The curriculum supports three modes:
1. **Self-study** — one module per week, all papers, full exercises. ~14 weeks part-time.
2. **Onboarding** — modules 1, 2, 4, 8 + appendix B for new ML engineers; expand as needed.
3. **Reference** — jump to any file directly. Each is independently useful.

Conventions: math uses LaTeX (`$...$`), most viewers render it. "Modern" means the state of the art as of early 2026. Each module ends with key papers, exercises, and further reading.

Read with discipline — for every important paper:
1. Read abstract and conclusion. Predict the method.
2. Read the method. Sketch the algorithm.
3. Read results. Note what you'd ablate.
4. Implement the smallest version that works.

Step 4 separates working knowledge from familiarity.
