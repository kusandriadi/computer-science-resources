---
marp: true
theme: default
paginate: true
header: 'LLM Handbook'
footer: 'cs.kusandriadi.com'
---

# Appendices Overview

**A summary of all 7 appendices** from the LLM Handbook -- practical toolkit, open-source models, agent engineering, API vs. self-hosted tradeoffs, hardware, enterprise use cases, and security.

---

<!-- _header: 'Appendix A -- Practical Toolkit' -->

# Appendix A: Practical Toolkit

**Opinionated picks to cut through the noise.** What people actually use at each layer of the stack.

- **Python** is the lingua franca (~95% of LLM work). Add TypeScript for products, Rust/CUDA for systems work.
- **PyTorch** is the default ML framework (JAX inside Google/TPU shops)
- **Hugging Face stack**: transformers, datasets, accelerate, peft, trl -- covers 80% of training needs
- **Pick boring, well-supported tools.** Save novelty budget for your actual problem.

---

<!-- _header: 'Appendix A -- Practical Toolkit' -->

# Toolkit Quick Picks

| Task | Recommended Tools |
|------|-------------------|
| **Fine-tuning (single GPU)** | Unsloth or Axolotl with QLoRA |
| **Multi-GPU SFT/DPO** | TRL + accelerate (FSDP), or Axolotl |
| **Inference serving** | vLLM or SGLang |
| **Local inference** | Ollama (CLI) or LM Studio (GUI) |
| **RAG prototype** | LlamaIndex + Chroma + BGE embedder + reranker |
| **Production RAG** | pgvector or Qdrant + vLLM + thin orchestration |
| **Agent framework** | Start with ~500 lines of your own code; LangGraph for complex orchestration |
| **Eval** | Inspect (UK AISI) or Promptfoo |
| **Observability** | Langfuse (open-source, self-hostable) |

---

<!-- _header: 'Appendix A -- Practical Toolkit' -->

# What to Ignore

- **Vector store benchmarks** -- correctness comes from retrieval *strategy*, not the store
- **Most "agent frameworks"** -- code your own when you understand the problem
- **Benchmark leaderboards** in isolation -- test on your own data
- **The newest paper-of-the-week** -- wait two weeks; the important ones survive
- **Endless prompt engineering** -- once iterated on a small eval set, move on

---

<!-- _header: 'Appendix B -- Open Source & Local' -->

# Appendix B: Open Source LLMs and Local Setup

**You cannot truly understand LLMs by only calling APIs.** Run them yourself, poke at them, break them, fine-tune them.

**Why open source matters:**
- Inspection: run profilers, look at weights, study internals
- Fine-tuning: full control over post-training
- Cost: marginal hardware cost, not per-token API pricing
- Privacy/sovereignty: data stays on your hardware
- No deprecation: model weights never disappear

---

<!-- _header: 'Appendix B -- Open Source & Local' -->

# Open Model Families (2026)

| Family | Strengths | License |
|--------|-----------|---------|
| **Meta Llama** (3.x, 4) | Strong general, massive ecosystem | Custom (commercial OK) |
| **Qwen** (Alibaba) | Multilingual, competitive English, MoE | Apache 2.0 |
| **DeepSeek** (V3, R1) | Frontier-competitive open, reasoning | MIT-style |
| **Mistral** (7B, Mixtral) | Early influential open models | Apache 2.0 (most) |
| **Gemma** (Google) | Lightweight, punches above weight | Permissive |
| **Phi** (Microsoft) | Strong reasoning per parameter | MIT |
| **OLMo** (Allen AI) | Fully open: weights, data, code, logs | Open |

---

<!-- _header: 'Appendix B -- Open Source & Local' -->

# Getting Started Locally with Ollama

```bash
ollama run llama3.2          # Download and chat
ollama pull qwen3:14b        # Download a specific model
ollama run deepseek-r1:8b    # Interactive chat with reasoning model
```

**OpenAI-compatible API** (works with LangChain, LlamaIndex, DSPy):
```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
resp = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Hello"}])
print(resp.choices[0].message.content)
```

Hardware: 8 GB GPU = up to 7B at Q4; 24 GB GPU (4090) = up to 30B at Q4.

---

<!-- _header: 'Appendix C -- Agent Engineering' -->

# Appendix C: Agent Engineering

**If Module 6 is "what" and "why" of agents, this is the "how."** Tool design, state management, error recovery, MCP, skills.

**The core loop** (every agent is this):
```python
while not done:
    response = model.call(messages, tools=available_tools)
    if response.has_tool_calls:
        for call in response.tool_calls:
            result = execute_tool(call)
            messages.append(tool_result(result))
    else:
        return response.text
```

A 100-line implementation is genuinely sufficient for most use cases.

---

<!-- _header: 'Appendix C -- Agent Engineering' -->

# Agent Engineering: Key Principles

**Tool design** is the highest-leverage agent engineering skill:
- Make tools do one thing; return useful errors
- Descriptions are mini-prompts -- include when to use and when NOT to use
- Read-only tools are free; write tools need confirmation gates

**MCP (Model Context Protocol):**
- Open standard for tool servers (Anthropic, OpenAI, Google)
- Eliminates N x M integration problem: any client connects to any server
- Exposes tools, resources, and prompts via standard verbs

**Skills:** load-on-demand expertise packages. Index always loaded; content loaded when relevant.

---

<!-- _header: 'Appendix C -- Agent Engineering' -->

# Agent Patterns and Pitfalls

**Planning patterns** (least to most structured):
- Reactive/ReAct -- step-by-step reasoning between tool calls
- Plan-then-execute (adaptive) -- explicit plan, revised as new info arrives
- Orchestrator-worker -- top-level decomposes, sub-agents specialize

**What doesn't work yet (2026):**
- Fully autonomous multi-day agents without checkpoints
- Massive tool counts (>50 tools causes poor selection)
- Agents designing their own tools mid-run
- Rigid plans that don't adapt on contact with reality

---

<!-- _header: 'Appendix D -- API vs Self-Hosted' -->

# Appendix D: API vs Self-Hosted Tradeoffs

**One of the first decisions every team gets wrong at least once.** The answer depends on volume, privacy requirements, team, and budget.

**Cost crossover:**
- < ~10M tokens/day: API almost always cheaper
- 10M-500M tokens/day: depends on patterns; hosted open models often best
- > 500M tokens/day, steady: self-hosting wins, sometimes by 5-10x
- Bursty workloads: APIs win regardless of volume

> **Most teams overestimate how much customization they need.** Prompt engineering + RAG + tools cover 80% of "we need to customize" cases.

---

<!-- _header: 'Appendix D -- API vs Self-Hosted' -->

# API vs Self-Hosted: Decision Framework

1. Have you tried the simplest API + good prompting? (Do this first)
2. Does the problem need RAG? (Build it on the API first)
3. Are you hitting cost or rate-limit walls? (Economics of self-hosting start to make sense)
4. Hard privacy/compliance requirements? (Self-host, or use private deployments)
5. Have you proven fine-tuning would help? (Don't self-host for customization without evidence)
6. Do you have the team to operate ML infrastructure? (0.5-2 FTE for serious deployment)
7. Is the workload steady or bursty? (Bursty = APIs; steady high-volume = self-host)

**Default:** API for production, open models for experimentation, hybrid for specific wins.

---

<!-- _header: 'Appendix E -- Hardware' -->

# Appendix E: Hardware for Production LLMs

**Picking the right GPU** seems straightforward but is full of traps.

| GPU | Memory | Best for |
|-----|--------|----------|
| **H100 SXM** | 80 GB HBM3 | 30B-70B production, training |
| **H200** | 141 GB HBM3e | 70B+ on single GPU, long context |
| **B200** | 192 GB HBM3e | New frontier deployments |
| **A100 80GB** | 80 GB HBM2e | Cost-sensitive workloads |
| **L40S** | 48 GB GDDR6 | Mid-tier 13B-30B serving |
| **MI300X** (AMD) | 192 GB HBM3 | Best memory-per-GPU for 70B+ |

---

<!-- _header: 'Appendix E -- Hardware' -->

# Hardware: What Determines Throughput

- **Memory bandwidth** dominates decode: TPOT = model_bytes / bandwidth
- **Compute** dominates prefill: H100 is ~3x A100
- **Batch size** unlocks compute: batch 64 gives ~30-50x throughput vs. batch 1
- **Interconnect** (NVLink) is non-negotiable for multi-GPU 70B+ serving

**Utilization is the entire game.** 80% utilization saves money; 15% utilization burns it.

**Quick decision:** < 1M tok/day = API; 10-500M = 1-4 H100s with vLLM; 500M+ = cluster with reserved pricing.

---

<!-- _header: 'Appendix F -- Enterprise Use Cases' -->

# Appendix F: Enterprise LLM Use Cases

**Every domain thinks its LLM needs are unique. They are not.** Almost every successful enterprise deployment follows the same pattern:

1. Document corpus -- ingested, chunked, indexed
2. RAG layer retrieves relevant context per query
3. LLM with tight prompt synthesizes answer constrained to retrieved content
4. Citation requirement -- every claim links to source
5. Human-in-the-loop for consequential output
6. Audit trail -- every query and response logged
7. Eval set from real user questions, scored regularly

---

<!-- _header: 'Appendix F -- Enterprise Use Cases' -->

# Enterprise Domains Covered

| Domain | What works | Critical risk |
|--------|-----------|---------------|
| **Tax** | Q&A grounded in tax code, draft documents | Wrong answer = penalties, malpractice |
| **HR** | Policy Q&A, job descriptions, onboarding | Bias risk, protected categories, EU AI Act |
| **Legal** | Contract analysis, redlining, research | Hallucinated citations caused real court sanctions |
| **Finance** | Variance commentary, journal drafts | SOX controls, MNPI handling |
| **Compliance** | Regulatory scanning, policy Q&A | Regulator explainability requirements |
| **Customer Ops** | Tier-1 Q&A, agent assist, ticket summarization | Bad bot = churn |
| **Software Eng** | Code completion, review, docs, onboarding | IP/license, secrets in code |
| **Sales** | Lead research, email drafts, RFP support | Spam risk, GDPR |

---

<!-- _header: 'Appendix F -- Enterprise Use Cases' -->

# Enterprise Build Sequence

**Week 1-2:** Discovery -- identify actual user, watch them work, build 30-50 example queries
**Week 3-4:** Baseline RAG -- ingest 5 most important documents, frontier API, measure correctness
**Week 5-8:** Refinement -- chunking, retrieval, reranking, prompting, citations, pilot with 3-5 users
**Week 9-12:** Hardening -- access controls, audit logging, security review, cost tuning
**Week 13+:** Production -- single team first, 4-6 weeks feedback before expanding

> Build the eval before the system. 30-50 hand-curated queries with known good answers is the single highest-leverage thing you can do.

---

<!-- _header: 'Appendix G -- Security' -->

# Appendix G: LLM Security

**If you build anything that lets an LLM interact with the real world, you need this.** LLM applications introduce attack surfaces that classical web security does not cover.

**The defining mental model:** LLMs cannot distinguish instructions from data. Anything the model sees might influence its behavior.

**The foundational threat: Prompt Injection**
- **Direct**: user types "ignore prior instructions..."
- **Indirect** (more dangerous): malicious instructions embedded in emails, web pages, PDFs, tool outputs the LLM processes

---

<!-- _header: 'Appendix G -- Security' -->

# Security: Key Defenses

**No silver bullet exists.** Layer defenses:

1. Treat retrieved/fetched content as **data, not instructions**
2. **Limit tool capabilities** (least privilege) -- bounded blast radius
3. **Human approval gates** for sensitive actions
4. **Separate planning from execution** -- execution enforces constraints
5. **Output filtering** -- scan for sensitive content before exposure
6. **Dual LLM pattern** -- one handles reasoning (no untrusted content), another processes untrusted data (no actions)
7. **Allowlists, not denylists** -- for URLs, tools, data access
8. **Rate-limit and monitor** for anomalous tool usage

---

<!-- _header: 'Appendix G -- Security' -->

# Security Checklist (Abbreviated)

- [ ] Retrieved content framed as data, not instructions
- [ ] Tools have least-privilege scope
- [ ] Destructive actions require user confirmation
- [ ] System prompt not assumed secret
- [ ] Per-user/tenant retrieval ACLs at retrieval time
- [ ] Code execution sandboxed
- [ ] Per-user token quotas and max-tokens per response
- [ ] Dependencies pinned and scanned; model downloads hash-verified
- [ ] Every model and tool call logged for audit
- [ ] Incident response plan for jailbreaks and security events

> Most production attacks are *not* sophisticated. They're variations of well-known patterns against systems that haven't implemented basic mitigations.

---

# Summary: The 7 Appendices

| Appendix | Core takeaway |
|----------|---------------|
| **A -- Toolkit** | Pick boring tools; save novelty for your actual problem |
| **B -- Open Source & Local** | Run models yourself to build real intuition |
| **C -- Agent Engineering** | Tool design is the highest-leverage agent skill |
| **D -- API vs Self-Hosted** | Default to API; self-host only with evidence it wins |
| **E -- Hardware** | Utilization is the entire game; size GPU to your batch |
| **F -- Enterprise Cases** | Same RAG+citations+human-loop pattern fits most domains |
| **G -- Security** | LLMs can't distinguish instructions from data; layer defenses |
