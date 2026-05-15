# Module 6 — Reasoning and Agents

The biggest capability shift of 2024–2025 was the maturation of "test-time compute" — letting the model think for many tokens before answering — and the parallel rise of competent agents. This module covers the conceptual and practical landscape.

## Learning goals

- Understand chain-of-thought and its empirical regularities
- Explain test-time compute scaling and the o1/R1 paradigm
- Build a tool-using LLM and reason about failure modes
- Design a retrieval-augmented generation (RAG) system
- Evaluate agents and reason about their reliability

## 6.1 Chain of thought

**Chain-of-thought** (CoT, Wei et al. 2022): prompt the model to produce intermediate reasoning steps before the final answer. On many tasks (math, multi-step reasoning, code) this dramatically improves accuracy.

The simplest form is zero-shot: append "Let's think step by step." (Kojima et al. 2022). Few-shot CoT shows worked examples. Both improve over direct answering on hard tasks for sufficiently large models.

**Why does CoT help?** Two complementary explanations:

1. **Adaptive compute.** A transformer's per-token compute is fixed. Writing out reasoning tokens lets the model spend more compute on a hard problem — each token is another layered forward pass conditioned on the full context.
2. **Better-formed search.** The model can decompose, plan, and verify. Errors that would be made silently in one shot become visible (and sometimes self-corrected) in writing.

Modern models behave as if they were partially CoT-trained — they sometimes produce reasoning even when not asked. Some products separate the visible response from a hidden "thinking" block.

## 6.2 Self-consistency, best-of-N, and majority voting

If you sample $N$ CoT responses and take the majority answer (Wang et al. 2022, "self-consistency"), accuracy goes up sharply on tasks with checkable structure. This was the first widely-used demonstration that test-time compute scales capability.

Generalizations:
- **Best-of-N**: sample $N$, score each with a reward/verifier model, return the best.
- **Process reward models (PRMs)**: score *each step* of a CoT, not just the final answer. Used to filter or weight steps.
- **Tree search**: branch the reasoning, score branches with a PRM or verifier, expand the best. ToT (Yao et al. 2023), MCTS variants.

**Compute-accuracy curves**: across these methods, accuracy increases predictably with test-time FLOPs. Snell et al. 2024 and others showed this can substitute for pre-training scale on some tasks.

## 6.3 Reasoning models (o1, R1, and successors)

**The o1 paradigm** (OpenAI 2024): train the model with RL such that producing long, exploratory chains of thought is the reliable way to maximize reward. The model learns, on its own, to plan, branch, verify, and backtrack — within the chain-of-thought itself.

**DeepSeek-R1** (DeepSeek-AI 2025) is the open canonical example. Key recipe:

1. Start from a strong base.
2. Run RL with verifiable rewards (math problems with known answers, code with tests). Use GRPO (Module 3) — no learned reward model required.
3. The model learns long-form CoT entirely from the RL signal. No CoT demonstrations are needed; reasoning behavior emerges.
4. The resulting "thinking" generalizes beyond the training distribution to other reasoning-heavy tasks.

This is genuinely surprising. The training signal (final-answer correctness) does not directly reward the structure of the reasoning, yet the structure emerges because it improves accuracy. The implication: capabilities that "feel" cognitively complex can emerge from simple RL pressure if the model is large enough and the rewards are clean enough.

**Practical caveats**:
- Reasoning models are slow (long CoTs at inference). Routing strategies (short answer vs. think) matter for products.
- They sometimes over-think simple questions.
- The CoT is not a faithful explanation of the answer. It's a process used to produce the answer, but it can be reconstructed post-hoc or contain reasoning the model doesn't actually use. Treat it as useful but not literal.

## 6.4 Tool use

A tool-using LLM emits a structured call (function name, arguments) when it decides a tool is needed. The runtime executes the tool and feeds the result back as another turn. Common tools: web search, code execution, calculators, file system, databases, custom APIs.

**Mechanics**:
- Tools are described in the prompt (name, description, JSON schema for arguments).
- The model produces a tool call in a structured format. Modern models are post-trained for this; you don't need few-shot examples.
- The runtime parses, validates, executes, and inserts the result.
- The model can call more tools or produce a final answer.

**Failure modes**:
- **Hallucinated tool names or arguments.** Mitigate with constrained decoding to the tool schema.
- **Loop**: the model keeps calling the same tool with the same args. Set hard turn limits.
- **Skipping**: model refuses to use a tool that would help. Often a prompt issue.
- **Over-eager**: model calls a tool when it could answer directly.
- **Result misinterpretation**: tool returned correct data, model summarized incorrectly.

**MCP (Model Context Protocol)** (Anthropic 2024): an open standard for tool servers. Servers expose tools, resources, and prompts; any compatible client can connect. Reduces N-to-M integration work.

## 6.5 Agents

An "agent" is a system where an LLM iteratively chooses actions (tool calls, sub-tasks) toward a goal, observing results between steps. Examples: code-writing agents (Devin-style, Aider, Claude Code), browsing agents, research agents.

**Design patterns** (Anthropic's *Building Effective Agents* is a good reference):

- **Augmented LLM**: LLM + tools + memory. Foundation of everything else.
- **Workflows** (deterministic): chains, routers, parallelization, orchestrator-worker. Predictable; less powerful.
- **Agents** (autonomous): the LLM controls the loop. More flexible; harder to verify.

Practical principles:

- **Start simple**. A workflow is usually enough. Reach for autonomy only when you genuinely need the LLM to plan.
- **Tight feedback loops**. Agents that can run code and see the result, or call a verifier, are vastly more reliable than those that can't.
- **Human checkpoints** for irreversible or expensive actions.
- **Observability is non-negotiable**. Log every model call, tool call, and intermediate decision. Most agent debugging is forensic.
- **Limit state**. Long agent trajectories accumulate errors; periodic summarization or compaction helps.

**Coding agents** are the breakout application — they have natural reward (tests pass / lint clean / human approves), tight feedback loops (re-run tests), and a structured environment (the file system, version control). SWE-bench and its successors track progress; the leaderboard moves quickly.

## 6.6 Retrieval-augmented generation (RAG)

RAG: augment the LLM with retrieval over an external corpus. Used when you need to ground in knowledge the model doesn't have (private docs, fresh data, citations).

**Standard pipeline**:

1. **Chunk** the corpus (paragraphs, sliding windows, semantic chunks).
2. **Embed** each chunk with a text embedding model (BGE, E5, OpenAI/Cohere/Voyage, etc.).
3. **Index** in a vector store (FAISS, ScaNN, Pinecone, pgvector, etc.).
4. At query time, **embed** the query, **retrieve** top-$k$ chunks by similarity.
5. **Construct prompt**: query + retrieved chunks + instructions.
6. **Generate** answer with citations.

Many systems also include **lexical (BM25)** search and fuse with vector results (hybrid retrieval) — usually beats vector-only.

**Where RAG goes wrong**:
- **Chunking** loses cross-chunk structure. Mitigate with hierarchical chunks, summaries, parent-document retrieval.
- **Query/document gap**: user queries are short, docs are long. Use HyDE (hypothetical doc embeddings) or query rewriting.
- **Reranking**: cross-encoder rerankers on top of top-$k$ retrieval dramatically improve quality at modest cost.
- **Hallucination on grounded context**: model still invents citations or contradicts the context. Mitigate with structured citation requirements and grounded eval.
- **Stale index**: changes in corpus must propagate. Plan for it.

**Long-context vs. RAG**: as context windows hit 1M+ tokens, "just put everything in context" becomes possible. But it's expensive and effective-context-length is shorter than nominal. The 2026 consensus: RAG is still the right primary architecture for large corpora; long context is complementary for synthesizing across retrieved chunks.

**Agentic RAG**: the LLM decides what to search for, refines queries, and iterates. Substantially better than single-shot retrieval on hard questions.

## 6.7 Evaluating reasoning and agent systems

This deserves its own emphasis (Module 7 covers eval generally, but agent eval is uniquely hard):

- **End-to-end task success** (e.g. SWE-bench, WebArena, GAIA). The gold standard, but expensive and slow.
- **Step-wise correctness**: did each tool call make sense given the state?
- **Trajectory analysis**: replay logs; cluster failure modes.
- **Counterfactual probing**: would the agent recover from a wrong intermediate result?
- **Calibration**: when the agent says "I'm done", is it actually done?

Don't trust agent benchmarks naively — task contamination, brittle scaffolding differences, and reward hacking on the eval itself are all common.

## Key papers

- Wei et al. 2022 — *Chain-of-Thought*.
- Kojima et al. 2022 — *Large Language Models are Zero-Shot Reasoners*.
- Wang et al. 2022 — *Self-Consistency*.
- Yao et al. 2023 — *Tree of Thoughts*.
- Snell et al. 2024 — *Scaling LLM Test-Time Compute*.
- OpenAI 2024 — *Learning to Reason with LLMs (o1)*.
- DeepSeek-AI 2025 — *DeepSeek-R1*.
- Lewis et al. 2020 — *Retrieval-Augmented Generation*.
- Anthropic 2024 — *Building Effective Agents* (blog post / engineering guide).
- Yao et al. 2023 — *ReAct*.

## Exercises

1. Take a math benchmark (GSM8K or MATH). Compare base, direct, CoT, and self-consistency (N=10). Plot accuracy vs N.
2. Build a minimal tool-using agent with two tools: Python execution and web search. Solve a small set of fact-finding tasks.
3. Build a RAG system over a corpus you care about (papers, codebase). Measure answer correctness, citation correctness, latency.
4. Train a small reasoning model: SFT a small base on a few thousand CoT solutions, then GRPO on math problems with checkable answers. Measure accuracy improvement.

## Further reading

- *Reasoning with Language Models: A Survey* (Huang & Chang).
- *Let's Verify Step by Step* (OpenAI, process reward models).
- *Lost in the Middle: How Language Models Use Long Contexts* (Liu et al. 2023).
- LangChain, LlamaIndex, and DSPy source code for production RAG/agent patterns.
- Cursor, Aider, and Claude Code product write-ups — agent design lessons from real deployments.
