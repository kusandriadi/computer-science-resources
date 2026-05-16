---
marp: true
theme: default
paginate: true
header: 'LLM Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 8 -- Production

**Here is what actually works, from teams that have shipped.** Most production LLM systems fail not because the model is bad, but because everything around the model is weak: vague prompts, sloppy retrieval, no eval pipeline, nobody watching logs, costs out of control.

---

# Why This Matters

- The gap between "demo" and "product" is almost entirely engineering, not model quality
- Most quality gains are upstream of model weights (prompting, scaffolding, retrieval)
- Observability is the single biggest differentiator between teams that ship reliably and those that don't
- Cost discipline from day one prevents 10x overruns

---

# 8.1 The Build / Fine-tune / Train Decision

Default to the cheapest thing that works:

1. **Prompt a frontier model** -- cheapest, fastest, usually 60-80% of needed quality
2. **Add retrieval** -- when grounding in private/fresh data is needed
3. **Add tools** -- when actions or computation are needed
4. **Optimize prompts and scaffolding** -- often another large quality chunk
5. **Fine-tune a smaller model** -- when latency/cost matters and you have data
6. **Continued pre-training** -- when domain tokens diverge significantly from web
7. **Train from scratch** -- almost never the right answer for product work

> Most teams over-rotate toward fine-tuning. Most quality gains are upstream of model weights.

---

# 8.2 Prompting in Production

Principles that survive contact with reality:

- **Be specific, structured, unambiguous**: "Produce a 3-bullet summary highlighting decisions, owners, and deadlines" not "Summarize this"
- **Show examples** (few-shot): one or two examples are worth pages of instructions
- **Decompose hard tasks**: chain or workflow > single prompt for complex tasks
- **Use structured output**: JSON schemas with constrained decoding are dramatically more reliable
- **Put critical instructions at start and end** -- models attend strongly to both
- **Iterate on real examples**: test every prompt change against ~50-200 representative inputs

---

# Try It: Structured Output

```python
import anthropic, json

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-20250514", max_tokens=500,
    system="You are a data extraction assistant. Always respond "
           "with valid JSON.",
    messages=[{"role": "user",
        "content": 'Extract structured data from: "John Smith, '
                   'aged 34, works at Google as a senior engineer '
                   'since 2019." Return JSON with: name, age, '
                   'company, title, start_year'}])

data = json.loads(response.content[0].text)
print(json.dumps(data, indent=2))
```

---

# 8.3 When and How to Fine-tune

Fine-tuning makes sense when:
- You need a behavior the base model can't reliably produce after good prompting
- You need to compress a large model's quality into a smaller, cheaper one (distillation)
- You need a stable, versioned model with known properties
- You have several thousand high-quality examples

**Default first choice: LoRA / QLoRA** (low-rank adapters, train ~0.5% of parameters)

---

# Fine-tuning: Practical Defaults

**LoRA hyperparameters** (7B-70B model):
- Rank: 16-64
- alpha = 2 x rank
- LR: 1e-4 to 3e-4
- Epochs: 1-3
- Target modules: at least Q, K, V, O; often all linear layers

**Data quality dominates everything:**
- Few thousand curated examples > tens of thousands of noisy ones
- Mix in refusal/negative examples to avoid drift
- Mix in general data to prevent catastrophic forgetting

---

# Try It: LoRA Setup

```python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B")
lora_config = LoraConfig(
    r=16,                    # rank
    lora_alpha=32,           # scaling factor
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: ~0.5% of total
```

---

# 8.4 RAG in Production

The pieces that matter in production:

- **Embedding model**: start with BGE-M3, E5-large, or OpenAI text-embedding-3
- **Hybrid search**: vector + BM25, fused with reciprocal rank fusion (almost always beats either alone)
- **Reranker**: cross-encoder on top-50 to top-5 -- big quality lift
- **Chunking strategy**: experiment; markdown/semantic chunks beat fixed-size
- **Metadata**: tag chunks with source, date, section; filter before similarity search
- **Update path**: plan how new documents get indexed and stale data removed from day one
- **Citations**: always require them; verify in eval

---

# 8.5 Latency and Cost

Three numbers to know about every model and route:
- **$/input token** and **$/output token**
- **TTFT** at your prompt length
- **TPOT** for your output length

**Cost reductions:**
- Use a smaller model (most tasks don't need frontier)
- Cache aggressively (prompt caching = 5-10x input cost savings)
- Batch where possible (async APIs = 50% discount)
- Reduce output tokens (structured outputs are denser than prose)
- **Route by difficulty**: small model first, escalate to large on hard cases

---

# Latency Tactics

- **Stream the output** -- users perceive faster responses on first token
- **Parallelize tool calls** when independent
- **Pre-compute / cache** anything that doesn't depend on user input
- **Use a small model for routing** decisions; big model only when needed
- **Choose a provider with regional endpoints** near your users

---

# 8.6 Reliability and Safety in Production

- **Input validation**: limit prompt length, reject malformed inputs, sanitize uploads
- **Output validation**: schema-check structured outputs; confirm citations resolve
- **Rate limits and quotas**: per-user, per-org (cost runaway is a common failure)
- **Content moderation**: classifier on input and output (don't rely only on model refusals)
- **Prompt injection defense**: treat retrieved content as data, not instructions; constrain tool capabilities; human approval for destructive actions

---

# 8.7 Observability and Continuous Evaluation

**If you take one thing from this module:** log everything and look at the logs.

**Log everything:**
- Every prompt, response, tool call, tool result, latency, cost, model version
- User feedback signals: thumbs up/down, edits, abandonment
- Errors and timeouts

**Pipeline:**
1. Logs to trace store (Langfuse, Arize, Phoenix, Helicone)
2. Continuous sampling to eval harness on every model/prompt change
3. Production examples to labeling queue to training/eval data
4. Dashboards on quality, latency, cost, refusal rate

---

# Try It: Simple Observability

```python
import time, json

class LLMLogger:
    def __init__(self):
        self.logs = []

    def call(self, client, **kwargs):
        start = time.time()
        response = client.messages.create(**kwargs)
        latency = time.time() - start
        log = {
            "model": kwargs.get("model"),
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
            "latency_ms": round(latency * 1000),
        }
        self.logs.append(log)
        print(f"[LLM] {log['model']} | "
              f"{log['input_tokens']}->{log['output_tokens']} tok | "
              f"{log['latency_ms']}ms")
        return response
```

---

# 8.8 A Reasonable Starting Stack (2026)

| Layer | Choice |
|-------|--------|
| **Model** | Frontier API (Claude/GPT/Gemini) or strong open (LLaMA/Qwen/DeepSeek) |
| **Inference** | vLLM or SGLang (if self-hosted) |
| **Orchestration** | Simple Python first; LangChain/LlamaIndex when complexity demands |
| **Vector store** | pgvector, Qdrant, or LanceDB |
| **Tracing** | Langfuse, Phoenix, or provider tracing |
| **Evals** | Promptfoo, Inspect, or Jupyter with confidence intervals |
| **CI** | Eval suite on every PR touching prompts or model config |

Defer complexity. Add components when you have evidence you need them.

---

# 8.9 Process Recommendations

Things that consistently distinguish successful teams:

- **Looking at data** -- every successful team reads outputs daily
- **Tight loops** -- from idea to tested on 50 examples in minutes
- **Versioning prompts and configs like code** -- they are code
- **Capability vs. behavior eval separation** -- don't conflate "can" with "does"
- **Plan for model upgrades** -- prompts and evals should work when the model changes
- **Cost discipline from day one** -- 10x overrun is usually 5 obvious things not optimized

---

# Key Papers / References

| Paper | Contribution |
|-------|-------------|
| Hu et al. 2021 | *LoRA* |
| Dettmers et al. 2023 | *QLoRA* |
| Anthropic | *Building Effective Agents* |
| Anthropic | *Prompt Engineering Guide* |

---

# Exercises

1. Build a small product feature (Q&A bot over your docs). Track latency, cost, and quality across three iterations.
2. Fine-tune a 7B model with QLoRA on your task. Compare to frontier model at 10x lower cost.
3. Add prompt caching and measure cost/latency change on a workload with a long system prompt.
4. Build a continuous eval pipeline: CI job running your eval set on every prompt change.
