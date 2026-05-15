# Appendix D — API vs Self-Hosted Open-Source: Tradeoffs

When you have a real workload, the first architectural decision is: hit a frontier API (Claude, GPT, Gemini), or run an open-weights model on your own infrastructure (possibly customized to your data)? This appendix is a structured way to think about it, plus the vocabulary you need to talk about customization without confusing yourself.

## D.1 The terminology you actually need

People throw around "training", "fine-tuning", "fine-tune on our data" loosely. Here's what each means precisely.

### The training spectrum

Order from cheapest+lightest to heaviest:

**Prompting / In-context learning** — no weight changes. You send examples in the prompt; the model adapts within that one call. Free, instant, reversible. Always try first.

**Retrieval-Augmented Generation (RAG)** — no weight changes. You fetch relevant docs and put them in the prompt. The model "knows" your data without being trained on it. Covered in Module 6.

**Supervised Fine-Tuning (SFT)** — weight changes. You have a dataset of `(input, desired_output)` pairs. You train the model to produce those outputs. The most common form of "fine-tuning" — when someone says "we fine-tuned a model on our data" they almost always mean SFT. Module 3.

**Instruction Tuning** — a specific kind of SFT where the inputs are instructions and outputs are responses. Makes a base model into an assistant. Conceptually identical mechanism to SFT.

**Continued Pre-Training (CPT)** / **Domain-Adaptive Pre-Training (DAPT)** — weight changes. You have a corpus of *unlabeled text* (your documents, codebase, papers). You keep the next-token-prediction objective and continue training on that corpus. Useful when you have lots of domain text and the model is unfamiliar with your domain's vocabulary/conventions. Module 2 §2.7.

**Preference Optimization** (DPO, RLHF, GRPO) — weight changes. You have preference data (`A is better than B`) or a reward signal. You shape model outputs toward what you prefer. Comes after SFT, not instead. Module 3.

**Pre-Training from scratch** — weight changes from random init. Hundreds of millions of dollars for frontier scale. Almost never the right answer for application work.

### How you fine-tune (orthogonal to what)

**Full fine-tuning** — update all parameters. Expensive, can cause catastrophic forgetting. Use only when needed.

**PEFT (Parameter-Efficient Fine-Tuning)** — update a small number of parameters; freeze the rest. Family of methods:
- **LoRA** — add low-rank adapters to attention/FFN matrices.
- **QLoRA** — LoRA on a quantized base model. Lets you fine-tune 70B+ on a single GPU.
- **DoRA, PiSSA, OLoRA** — refinements.
- **Adapters** — small bottleneck layers inserted into the model.
- **Prefix / Prompt Tuning** — train soft prompts; weights stay frozen.

PEFT is the default in 2026. Full fine-tuning is reserved for when LoRA isn't enough.

### So: "use open-source LLM and train it on our data" — what is that?

Most common, in order of likelihood:
1. **SFT with LoRA** (you have labeled examples; want the model to behave a specific way)
2. **CPT** (you have lots of domain text; want the model to absorb domain knowledge)
3. **SFT then DPO** (you have labels and preferences; want both behavior and quality shaping)

Less common but valid:
4. **CPT then SFT** (lots of domain text *and* labeled examples — train both stages)
5. **Full fine-tuning** (when LoRA quality is insufficient and you have the compute)

Important: in many cases the right answer is **none of the above** — prompting + RAG covers it. Don't fine-tune without first proving prompting/RAG isn't enough.

## D.2 API vs self-hosted: the axes that matter

A direct comparison along the dimensions that actually drive decisions.

### Cost

**API** costs scale per-token. Variable with usage; zero capex. Concrete economics (mid-2026 order of magnitude — verify current pricing):

- Frontier API output: ~$5–$20 per million tokens
- Mid-tier API output: ~$1–$5 per million tokens
- Small API output: ~$0.1–$1 per million tokens
- Hosted open model (Together, Fireworks, DeepInfra, etc.): ~$0.3–$1 per million tokens for Llama-70B-class
- Self-hosted on rented GPU: dominated by GPU-hours; varies wildly with batch size

**Self-hosted** is fixed-cost-heavy. An H100 at ~$2–$3/hour produces, at high batch size on a 70B model, roughly hundreds to a couple thousand output tokens/sec. So order-of-magnitude $0.5–$2 per million tokens *if you saturate the GPU*. If you don't, you pay the same hourly rate for idle capacity.

**The crossover** is mostly about utilization. APIs win at low volume (you pay per token, no idle cost). Self-hosting wins at high, steady volume (you amortize the GPU over enough requests). The break-even in practice:

- **< ~10M tokens/day**: API almost always cheaper.
- **10M–500M tokens/day**: depends on workload patterns and model size. Hosted open models often best.
- **> 500M tokens/day, steady**: self-hosting usually wins, sometimes by 5–10×.
- **Bursty workloads**: APIs win regardless of total volume (you don't pay for idle GPUs at 3am).

Be careful with cost projections — they often miss: load testing/dev environments, retry traffic, eval rollouts, prefix caching benefits (APIs cache; self-hosted vLLM caches; both materially change effective cost), and rate-limit-driven re-architecting.

### Quality

**Frontier APIs (Claude, GPT, Gemini)** lead on:
- Hardest reasoning tasks (frontier math, complex coding, long-form analysis)
- Agentic reliability (long tool-use sequences, recovery from errors)
- Following nuanced instructions and respecting subtle constraints
- Multimodal capabilities (state-of-the-art vision, voice, video)
- "Just works" defaults — sensible refusals, helpful tone, etc.

**Open models** can match or beat APIs on:
- Specific narrow tasks after fine-tuning (classification, structured extraction, your domain's jargon)
- Tasks where the model just needs to be "good enough" and cost dominates
- Things where strong open models (Llama 4, Qwen3, DeepSeek-V3/R1) are close to frontier
- Tasks where you've already tried APIs and have data to fine-tune on

The capability gap between best closed and best open has been narrowing for two years and continues to. In 2026, the *general* gap is small (a few percent on most benchmarks); the gap on *frontier reasoning and agentic work* remains meaningful.

### Latency

**APIs**:
- TTFT ~200ms–1s depending on provider and region
- TPOT ~10–80ms per token depending on model size
- Subject to provider load (occasional spikes)
- Limited control over latency tuning

**Self-hosted**:
- TTFT controlled by your prefill design; can be very fast for short prompts
- TPOT controlled by your serving stack (vLLM, SGLang, TensorRT-LLM) and hardware
- Predictable; you own the queue
- Can be optimized for specific patterns (e.g. very long prefix caching for your system prompt)

For latency-critical applications, self-hosting can be faster *and* more predictable. For typical chat/agent workloads, APIs are fast enough.

### Privacy and data control

**APIs**:
- Your data leaves your infrastructure.
- Most providers offer zero-data-retention (ZDR) modes; verify and contract them.
- Compliance regimes (HIPAA, EU AI Act, GDPR, finance regs) often need explicit BAAs or DPAs.
- Even with ZDR, regional data residency matters (EU data must stay in EU, etc.).

**Self-hosted**:
- Data stays on your hardware (or your cloud's, under your account).
- Full audit trail.
- No third-party processor in the chain.
- Required for some sensitive workloads (intelligence, certain healthcare, certain finance, some government).

If "your data must not leave your network" is a hard requirement, self-hosting is the answer. If it's a soft requirement, APIs with ZDR are usually acceptable.

### Customization

This is where the choice often goes wrong.

**APIs offer**:
- System prompts and prompt engineering (free, instant)
- Prompt caching (cheap, big wins for stable system prompts)
- Structured outputs / function calling (good)
- Sometimes: API-level fine-tuning (limited; you submit data and the provider trains a private variant — quality and cost vary)

**Self-hosted offers**:
- Full SFT / CPT / DPO / preference optimization on your data
- LoRA adapters you can swap per use-case
- Choice of base model (size, language coverage, license)
- Tokenizer changes if needed
- Architectural changes (long-context extension, quantization, etc.)
- Total control of the inference path

**The honest assessment**: most teams overestimate how much customization they need. Prompt engineering + RAG + tool use cover 80% of "we need to customize" cases. Fine-tuning genuinely helps when you need: specific output formats the model can't reliably produce; latency-critical inference at scale (small fine-tuned model > large prompted model); domain-language familiarity beyond what RAG provides; or behavior changes prompting can't enforce.

### Reliability and uptime

**APIs**: provider's SLA. Usually 99.9%+. When the provider has an outage, you have an outage. Multi-provider routing is possible but adds complexity.

**Self-hosted**: your SLA. Whatever you build for it. Can be more reliable if you invest in HA infrastructure, often less reliable if you don't.

### Maintenance burden

**APIs**: provider handles upgrades, security patches, infrastructure. You handle integration code. Low ongoing cost.

**Self-hosted**: you handle everything. New model releases, CUDA driver updates, hardware failures, scaling, monitoring, security patches. Real ongoing engineering cost — usually 0.5–2 FTE for a serious deployment, depending on scale and reliability requirements.

This is the most-underestimated factor in self-hosting decisions. The model is the easy part; the infrastructure around it is the long-term cost.

### Capability ceiling

**APIs**: you get whatever the provider gives you, on their release schedule. New capabilities (better reasoning, longer context, new modalities) arrive when the provider ships them.

**Self-hosted**: you're constrained by the best open weights available. As of 2026, that's quite good but typically lags frontier APIs by 6–12 months on the hardest tasks.

For a product whose value depends on being at the frontier, APIs win. For a product where "very good" is enough, self-hosted is usually fine.

### Vendor lock-in

**APIs**: meaningful lock-in. Switching from Claude to GPT (or vice versa) usually requires prompt rework; behaviors differ. Mitigate with an abstraction layer.

**Self-hosted**: less lock-in to a vendor; more lock-in to your own infra. You're free to swap base models (and routinely should — Llama → Qwen → DeepSeek improvements come fast). But your inference stack, fine-tuned adapters, and evaluation infrastructure are sticky.

## D.3 A decision framework

A practical sequence of questions:

**1. Have you tried the simplest API + good prompting?**
If not, do that first. Most "we need to self-host" problems disappear here. Budget a week.

**2. Does the problem need RAG?**
If yes, build it on the API first. RAG quality is mostly about retrieval, not the LLM.

**3. Are you hitting cost or rate-limit walls?**
If you're using >$10k/month in API spend or hitting rate limits, the economics of self-hosting start to make sense.

**4. Are there hard privacy/compliance requirements?**
If yes, the answer is self-host (or use a private deployment from the provider — Azure OpenAI, AWS Bedrock, Anthropic on AWS/GCP, etc., which is a hybrid).

**5. Have you proven that fine-tuning would help?**
If you can't run an ablation showing fine-tuning > prompting on your task, don't self-host for the customization reason. You're just adopting maintenance burden.

**6. Do you have the team to operate ML infrastructure?**
Self-hosting needs people who can debug CUDA, tune vLLM, monitor GPUs, and handle incidents. If you don't have them, factor that hire into the decision.

**7. Is the workload steady or bursty?**
Bursty workloads strongly favor APIs. Steady high-volume workloads favor self-hosting.

The honest default for most teams is: **API for production, locally-run open models for experimentation and fine-tuning research, hybrid for specific workloads where self-hosting wins decisively.**

## D.4 Hybrid approaches

Few production systems are 100% one or the other. Common hybrids:

**Tiered routing**: small/cheap model handles easy queries; large frontier model handles hard ones. Implemented as a router (rule-based or learned). Easily 5–10× cost reduction.

**Frontier for hard, self-hosted for cheap**: route by query difficulty/value. Customer support routine queries to your fine-tuned 8B; complex escalations to Claude.

**Private deployment of closed models**: Azure OpenAI, AWS Bedrock, GCP Vertex AI all offer hosted instances of (some) closed models inside your cloud account with stronger privacy guarantees. Hybrid of "API" and "self-hosted" — you don't manage GPUs but the data stays in your VPC.

**Embeddings hybrid**: use a cheap self-hosted embedding model + API generation. Embeddings are called orders of magnitude more than generation; self-hosting them is often a clear win.

**Distillation**: use a frontier API to generate training data; SFT a smaller open model on it. The student model is yours to deploy cheaply; the teacher was only needed at training time. Increasingly common pattern.

**Fall-back chains**: try a cheap model first; if it can't confidently answer (low confidence, refusal, validation failure), escalate. Combines cost savings with reliability.

## D.5 Migration patterns

Going **API → self-hosted**:
1. Build an evaluation set on your task using your current API setup. Measure quality.
2. Pick an open model that approaches your API model on your eval. Run inference (Ollama, vLLM).
3. If quality gap is small: fine-tune to close it. If large: pick a bigger open model or stay on API.
4. Build serving infrastructure. Run in parallel with API. Gradual traffic shift.
5. Cut over when your self-hosted error rate ≤ API error rate.

Going **self-hosted → API**:
1. Cost-benefit analysis. Often self-hosting is cheaper in $/token but more expensive in $/feature once you account for operational cost.
2. Identify the workloads where API would suffice. Move those first.
3. Keep self-hosted for the workloads where it wins decisively (privacy, specialty, high steady volume).

**Switching open models** (Llama → Qwen → DeepSeek as new ones arrive):
1. Maintain evals decoupled from the model.
2. Re-run when a new model lands. Quality gains are usually free.
3. Re-run fine-tuning on the new base. LoRA adapters typically don't transfer; SFT data does.

## D.6 Common mistakes

A non-exhaustive list of decisions that look right and aren't:

**"We'll save money by self-hosting"** — without doing the math. Often false at low volume; often true at high steady volume. Always compute it.

**"We need to fine-tune"** — without trying prompting and RAG first. Most "fine-tuning need" is actually "we haven't iterated on the prompt".

**"We need to self-host for privacy"** — without checking ZDR options. Some industries genuinely need self-hosting; many treat it as the only option when private API deployments would satisfy the actual compliance requirement.

**"We trained a model on our data"** — without an evaluation showing it's better than the un-trained baseline. Always evaluate. SFT can silently degrade general capabilities.

**"We'll use the open SOTA"** — chasing the leaderboard instead of choosing a stable, well-supported model. Pick a model with a good ecosystem (active community, vLLM/TensorRT support, documented fine-tuning recipes). Saves you future pain.

**"We'll just use the API forever, no need to plan"** — without an abstraction layer or any ability to switch. Lock-in is real even when you don't think about it. Build a thin interface that lets you swap providers/models.

## D.7 A worked decision: three small companies

Three plausible scenarios, three different right answers:

**Company A — early-stage SaaS startup, customer support chatbot, ~1M tokens/day, no PII**.
Answer: API (Claude/GPT) + RAG over your help center. Total cost ~$10/day. No team for ML infra. Iterate on prompts. Revisit in 6 months.

**Company B — established e-commerce, product description generation, ~100M tokens/day, internal use**.
Answer: hosted open model (Together/Fireworks) for ~$50–$100/day, or self-hosted 70B if you have an ML team. Fine-tune on your existing high-quality descriptions. Big quality and cost win over generic API.

**Company C — healthcare provider, clinical note summarization, ~5M tokens/day, hard PII constraints**.
Answer: self-hosted open model (Llama or a healthcare-specialized variant) inside your HIPAA-compliant infrastructure. Fine-tune on de-identified clinical data. Compliance cost is the driver, not LLM cost.

There's no single answer. The framework gives you the questions; your specifics give you the answer.

## D.8 Further reading

- *Patterns for Building LLM-based Systems & Products* — Eugene Yan
- *Generative AI in the Enterprise* — practical decision content from Andreessen Horowitz, others
- Pricing pages of major API providers (verify current numbers; this appendix's numbers are illustrative)
- Cost analysis posts from teams who've made the switch publicly (Notion, Replit, Cursor have written about model choice)
- Hugging Face's *Open LLM Leaderboard* and *LMSys Chatbot Arena* for current open-model quality
