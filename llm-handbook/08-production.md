# Module 8 — Production

Here is what actually works, from teams that have shipped. Most production LLM systems fail not because the model is bad, but because everything *around* the model is weak: the prompts are vague, the retrieval is sloppy, there is no evaluation pipeline, nobody is watching the logs, and costs are out of control. This module is the engineering checklist for avoiding those failures.

## Learning goals

- Build a production LLM feature from scratch with appropriate scaffolding
- Choose between prompting, RAG, fine-tuning, and training from scratch
- Reason about cost, latency, and reliability in a real system
- Set up observability and a continuous evaluation loop

## 8.1 The build / fine-tune / train decision

For a new use case, default to the cheapest thing that works:

1. **Prompt a frontier model.** Cheapest, fastest. Usually 60–80% of the quality you need.
2. **Add retrieval.** When you need grounding in private/fresh data.
3. **Add tools.** When you need actions or computation.
4. **Optimize prompts and scaffolding.** Often gets you another large chunk of quality with no model changes.
5. **Fine-tune a smaller model** (or the same model). When latency or cost matters and you have data.
6. **Continued pre-training.** When you have a lot of domain data and tokens diverge significantly from web.
7. **Train from scratch.** Almost never the right answer for product work.

Most teams over-rotate toward fine-tuning. Most quality gains are upstream of model weights.

## 8.2 Prompting in production

A few principles that survive contact with reality:

**Be specific, structured, and unambiguous.** "Summarize this" produces a different output from "Produce a 3-bullet summary highlighting decisions, owners, and deadlines."

**Show examples** (few-shot). One or two examples of the input-output pattern is worth pages of instructions. For complex outputs, examples beat schemas alone.

**Decompose hard tasks.** A long task with many sub-decisions is often better as a chain or workflow than a single prompt. The orchestrator can be deterministic; only the leaves need the LLM.

**Use structured output.** JSON schemas with constrained decoding (Module 4) are dramatically more reliable than free-form text. Most providers support tool/function schemas; use them.

**Put critical instructions at the start and end** — models attend strongly to both.

**Separate concerns.** System prompt for invariants (role, format, refusals), user message for the task, assistant prefix for nudging output structure.

**Don't reason in production prompts** if you don't have to. CoT is a model capability, not a prompting trick — modern instruct/reasoning models will reason on their own. Verbose "let's think step by step" templates often hurt latency without helping quality.

**Iterate on real examples.** Keep a notebook of representative inputs (the same ~50–200 from your eval set). Every prompt change is tested against them.

### Try it: Structured output with Anthropic

```python
import anthropic
import json

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=500,
    system="You are a data extraction assistant. Always respond with valid JSON.",
    messages=[{
        "role": "user",
        "content": """Extract structured data from this text:
        "John Smith, aged 34, works at Google as a senior engineer since 2019."

        Return JSON with: name, age, company, title, start_year"""
    }]
)

data = json.loads(response.content[0].text)
print(json.dumps(data, indent=2))
```

## 8.3 When and how to fine-tune

Fine-tuning makes sense when:

- You need a behavior the base model can't reliably produce after good prompting.
- You need to compress a large model's quality into a smaller, cheaper one (distillation).
- You need a stable, versioned model with known properties.
- You have several thousand high-quality examples (or can synthesize them).

Modern fine-tuning toolkit:

- **LoRA** (Hu et al. 2021) and **QLoRA** (Dettmers et al. 2023): low-rank adapters. Train a tiny number of parameters; merge at inference (LoRA) or keep separate (multi-adapter). Default first choice.
- **Full fine-tuning**: when LoRA isn't enough. More compute, more risk of forgetting.
- **DoRA, PiSSA, OLoRA**: variants improving LoRA quality.
- **DPO / preference fine-tuning** (Module 3): when SFT alone doesn't capture nuanced preferences.

**Data quality dominates everything**:
- A few thousand carefully curated examples often beat tens of thousands of noisy ones.
- Diverse examples > many duplicates.
- Mix in some "negative" or refusal examples to avoid drift.
- For instruction-following, mix in some general data to prevent catastrophic forgetting.

**Hyperparameters** (LoRA on a 7B–70B model, rough defaults):
- rank 16–64
- α = 2 × rank
- LR 1e-4 to 3e-4
- 1–3 epochs
- dropout 0.0–0.05
- target modules: at least Q, K, V, O; often all linear layers

**Evaluation discipline**: never trust a fine-tuned model until you've evaluated it on both task data and general capability. SFT silently breaks unrelated abilities.

### Try it: LoRA fine-tuning setup

```python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B")

lora_config = LoraConfig(
    r=16,                    # rank — higher = more capacity, more memory
    lora_alpha=32,           # scaling factor
    target_modules=["q_proj", "v_proj"],  # which layers to adapt
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: ~0.5% of total — that's the magic of LoRA
```

## 8.4 RAG in production

Module 6 covers RAG conceptually. In production, the pieces that matter:

- **Embedding model**: start with a strong general one (BGE-M3, E5-large, OpenAI text-embedding-3, Voyage, Cohere). Fine-tune later if specific.
- **Hybrid search**: vector + BM25. Almost always beats either alone. Use reciprocal rank fusion to combine.
- **Reranker**: cross-encoder on top-50 → top-5. Big quality lift, manageable cost.
- **Chunking strategy**: experiment. Markdown / semantic chunks beat fixed-size for most documents.
- **Metadata**: tag chunks with source, date, section. Filter by metadata before similarity search.
- **Update path**: how does a new document get indexed? How is stale data removed? Plan this from day one.
- **Citations**: always have the model cite. Verify citations in eval.
- **Eval**: hold out questions and measure both retrieval (was the right chunk retrieved?) and generation (was the answer correct given the chunk?).

**Common failure mode**: the retrieval works but the generation ignores the context and answers from priors. Mitigate with explicit prompting ("Answer based only on the provided context...") and grounding evals.

## 8.5 Latency and cost

Three numbers to know about every model and route:

- **$/input token** and **$/output token**
- **TTFT** at your prompt length (Module 4)
- **TPOT** for your output length

**Common cost reductions**:
- Use a smaller model. Most tasks don't need the frontier; a strong open 7B–32B or a "small" frontier model is often plenty.
- Cache aggressively. Frontier APIs offer prompt caching; for shared system prompts and few-shot examples, this can cut input cost 5–10×.
- Batch where possible. Async APIs for non-interactive workloads (50% discount on most providers).
- Reduce output tokens. A summary instead of a transcript. Structured outputs are denser than prose.
- Route by difficulty. Small model first; escalate to large on detected hard cases.

**Latency tactics**:
- Stream the output. Users perceive responses as faster the moment they see the first token.
- Parallelize tool calls when independent.
- Pre-compute / cache anything that doesn't depend on the user's input.
- Use a small model for "router" decisions; only call the big model when needed.
- Choose a provider with regional endpoints near your users.

## 8.6 Reliability and safety in production

**Input validation**: limit prompt length, reject malformed inputs, sanitize file uploads. Treat user input as untrusted (prompt injection is real).

**Output validation**: schema-check structured outputs; rerun with feedback if invalid. Confirm citations resolve. Refuse to expose tool outputs to other tools without checking.

**Rate limits and quotas**: per-user, per-org. Cost runaway is a common failure mode.

**Content moderation**: classifier on input and output for clearly unacceptable content. Don't rely only on the model's own refusals.

**Prompt injection defense** (especially for agents): treat retrieved content as data, not instructions. Use a separate moderator model to check tool outputs. Constrain tool capabilities (read-only by default, human approval for destructive actions).

**Confidential / private data**: be explicit about what flows to which provider. Many APIs offer zero-data-retention modes; use them. Consider self-hosting for sensitive workloads.

## 8.7 Observability and continuous evaluation

This is the single biggest difference between teams that ship reliable LLM products and teams that don't. If you take one thing from this module, let it be this: log everything and look at the logs.

**Log everything**:
- Every prompt, response, tool call, tool result, latency, cost, model version.
- User feedback signals: thumbs up/down, edits, abandonment.
- Errors and timeouts.

**Pipeline**:
1. Logs → trace store (Langfuse, Arize, Datadog LLM, Phoenix, Helicone, custom).
2. Continuous sampling → eval harness on every model/prompt change.
3. Production examples → labeling queue → training/eval data.
4. Dashboards on quality, latency, cost, and refusal rate.

**Regressions**: when you change a prompt, model, or scaffolding component, run the change against your eval set first. Production canaries with quick rollback are essential.

**Incident postmortems**: include trace IDs. The trace will usually tell you exactly which step failed.

### Try it: Simple LLM observability

```python
import time
import json

class LLMLogger:
    """Minimal observability wrapper."""
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
            "cost_usd": self._estimate_cost(response),
        }
        self.logs.append(log)
        print(f"[LLM] {log['model']} | {log['input_tokens']}→{log['output_tokens']} tokens | {log['latency_ms']}ms")
        return response

    def _estimate_cost(self, response):
        # Simplified cost estimation
        return round((response.usage.input_tokens * 3 + response.usage.output_tokens * 15) / 1_000_000, 4)

# Usage
logger = LLMLogger()
# response = logger.call(client, model="claude-sonnet-4-20250514", max_tokens=100, messages=[...])
```

## 8.8 A reasonable starting stack (2026)

A practical first iteration of an LLM product:

- **Model**: a frontier API (Claude, GPT, Gemini) for quality OR a strong open model (LLaMA, Qwen, DeepSeek) for control/cost.
- **Inference server**: vLLM or SGLang if self-hosted.
- **Orchestration**: simple Python first; LangChain / LlamaIndex / DSPy / your own when complexity demands it.
- **Vector store**: pgvector, Qdrant, or LanceDB for self-hosted; Pinecone / Turbopuffer for managed.
- **Tracing**: Langfuse, Phoenix, or built-in provider tracing.
- **Evals**: Promptfoo, Inspect, or a Jupyter notebook with confidence intervals.
- **CI**: eval suite runs on every PR that touches prompts or model config.

Defer complexity. Add components when you have evidence you need them, not by default.

## 8.9 Process recommendations

A few things that consistently distinguish successful teams:

- **Looking at data.** Every team I've seen succeed reads outputs daily. Every team that fails relies entirely on aggregate metrics.
- **Tight loops.** From "I have an idea" to "I've tested it on 50 examples" should be minutes.
- **Versioning prompts and configs like code.** They are code.
- **Capability vs. behavior eval separation.** Don't conflate "the model can" with "the model does."
- **Plan for model upgrades.** Your prompts and evals should still work when the model changes underneath you (and they should automatically improve).
- **Cost discipline from day one.** A 10× cost overrun is usually 5 obvious things you didn't optimize, not 1 deep architectural problem.

## Key papers / references

- Hu et al. 2021 — *LoRA*.
- Dettmers et al. 2023 — *QLoRA*.
- *Building Effective Agents* — Anthropic engineering guide.
- *Prompt Engineering Guide* — Anthropic docs.
- *The Twelve-Factor App* — old but relevant; LLM products need analogous discipline.

## Exercises

1. Build a small product feature (e.g. a Q&A bot over your own docs). Track latency, cost, and a quality metric across three iterations.
2. Fine-tune a 7B model with QLoRA on a task you care about. Compare to the frontier model on the same task at 10× lower cost.
3. Add prompt caching and measure the cost / latency change on a workload with a long system prompt.
4. Build a continuous eval pipeline: a CI job that runs your eval set on every prompt change and posts results.

## Further reading

- *Patterns for Building LLM-based Systems & Products* — Eugene Yan's reference essay.
- *Generative AI Handbook* — Sayash Kapoor, others.
- *Prompt Report* — empirical prompt-engineering survey.
- Public engineering blogs from teams running LLMs at scale (Anthropic, OpenAI, Cursor, Notion, Linear, etc.).
