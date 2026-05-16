---
marp: true
theme: default
paginate: true
header: 'LLM Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 6 -- Reasoning and Agents

**The biggest capability shift of 2024-2025:** the maturation of "test-time compute" -- letting the model think for many tokens before answering -- and the parallel rise of competent agents.

---

# Why This Matters

- Chain-of-thought dramatically improves accuracy on hard tasks
- Reasoning models (o1, R1) represent a qualitative leap in capability
- Agents (coding assistants, research bots) are the breakout LLM application
- RAG is the single most common architecture for production LLM apps

---

# 6.1 Chain of Thought (CoT)

**Concrete example:** "Roger has 5 tennis balls. He buys 2 cans of 3 balls each. How many does he have now?"

Without CoT: model blurts out a number (sometimes wrong).
With CoT: "Roger starts with 5. He buys 2 x 3 = 6 balls. Total = 5 + 6 = 11."

**Why CoT helps:**
1. **Adaptive compute** -- each token is another forward pass conditioned on full context
2. **Better-formed search** -- decompose, plan, verify; errors become visible and self-correctable

---

# CoT Variants

- **Zero-shot**: append "Let's think step by step." (Kojima et al. 2022)
- **Few-shot CoT**: show worked examples in the prompt
- Both improve over direct answering on hard tasks for sufficiently large models
- Modern models sometimes produce reasoning even when not asked

---

# Try It: Direct vs. CoT

```python
import anthropic
client = anthropic.Anthropic()
question = ("Roger has 5 tennis balls. He buys 2 cans of 3 balls "
            "each. How many does he have now?")

direct = client.messages.create(
    model="claude-sonnet-4-20250514", max_tokens=100,
    messages=[{"role": "user",
               "content": f"Answer with just the number: {question}"}])

cot = client.messages.create(
    model="claude-sonnet-4-20250514", max_tokens=300,
    messages=[{"role": "user",
               "content": f"Think step by step: {question}"}])

print(f"Direct: {direct.content[0].text}")
print(f"CoT: {cot.content[0].text}")
```

---

# 6.2 Self-Consistency and Best-of-N

Sample $N$ CoT responses, take the **majority answer** (Wang et al. 2022). Accuracy goes up sharply.

**Generalizations:**
- **Best-of-N**: sample N, score with reward/verifier model, return the best
- **Process reward models (PRMs)**: score each step of CoT, not just final answer
- **Tree search**: branch reasoning, score branches, expand best (ToT, MCTS)

> Accuracy increases predictably with test-time FLOPs. Can substitute for pre-training scale on some tasks.

---

# 6.3 Reasoning Models (o1, R1)

**The o1 paradigm** (OpenAI 2024): train with RL so that long, exploratory CoT is the path to maximizing reward. The model learns to plan, branch, verify, and backtrack within the chain-of-thought.

**DeepSeek-R1** (open canonical example):
1. Start from a strong base
2. RL with verifiable rewards (math answers, code tests) using GRPO
3. Model learns long-form CoT entirely from RL signal -- no CoT demonstrations needed
4. Reasoning **generalizes** beyond training distribution

> Genuinely surprising: the structure of reasoning emerges from simple RL pressure.

---

# Reasoning Models: Practical Caveats

- **Slow** -- long CoTs at inference. Routing strategies (short vs. think) matter
- Sometimes **over-think** simple questions
- CoT is **not a faithful explanation** -- it's a process for producing the answer, possibly reconstructed post-hoc
- Treat it as useful but not literal

---

# 6.4 Tool Use

An LLM emits a structured call (function name, arguments) when it decides a tool is needed.

**Mechanics:**
- Tools described in prompt (name, description, JSON schema)
- Model produces tool call in structured format
- Runtime parses, validates, executes, inserts result
- Model can call more tools or produce final answer

**Failure modes:**
- Hallucinated tool names/arguments
- Infinite loops (same tool, same args)
- Skipping helpful tools or over-eager calling
- Result misinterpretation

---

# Try It: Minimal Tool-Using Agent

```python
import anthropic
client = anthropic.Anthropic()
tools = [{"name": "calculate",
          "description": "Evaluate a math expression",
          "input_schema": {"type": "object",
              "properties": {"expression": {"type": "string"}},
              "required": ["expression"]}}]

def run_tool(name, input):
    if name == "calculate":
        return str(eval(input["expression"]))

response = client.messages.create(
    model="claude-sonnet-4-20250514", max_tokens=1024, tools=tools,
    messages=[{"role": "user",
               "content": "What is 1847 * 293 + 17?"}])

for block in response.content:
    if block.type == "tool_use":
        result = run_tool(block.name, block.input)
        print(f"Tool: {block.name}({block.input}) = {result}")
```

---

# 6.5 Agents

An agent = LLM in a loop: observe, decide, act, observe, repeat.

**Examples:** Claude Code, Cursor, browsing agents, research agents, customer service bots.

**Design patterns** (Anthropic's *Building Effective Agents*):
- **Augmented LLM**: LLM + tools + memory
- **Workflows** (deterministic): chains, routers, parallelization
- **Agents** (autonomous): LLM controls the loop

---

# Agent Principles

- **Start simple** -- a workflow is usually enough; reach for autonomy only when needed
- **Tight feedback loops** -- agents that run code and see results are vastly more reliable
- **Human checkpoints** for irreversible or expensive actions
- **Observability is non-negotiable** -- log every model call, tool call, intermediate decision
- **Limit state** -- long trajectories accumulate errors; periodic summarization helps

**Coding agents** are the breakout application -- natural reward (tests pass), tight feedback loops (re-run tests), structured environment (file system, git).

---

# 6.6 RAG (Retrieval-Augmented Generation)

The **single most common architecture** for production LLM applications.

**Pipeline:**
1. **Chunk** the corpus (paragraphs, sliding windows, semantic chunks)
2. **Embed** each chunk with a text embedding model
3. **Index** in a vector store (FAISS, pgvector, Pinecone)
4. At query time: **embed** query, **retrieve** top-$k$ chunks
5. **Construct prompt**: query + retrieved chunks + instructions
6. **Generate** answer with citations

---

# RAG: What Goes Wrong

- **Chunking** loses cross-chunk structure -- use hierarchical chunks, summaries
- **Query/document gap** -- use HyDE or query rewriting
- **Need reranking** -- cross-encoder on top-$k$ dramatically improves quality
- **Hallucination on grounded context** -- model invents citations or contradicts context
- **Stale index** -- plan for corpus changes from day one

**Long-context vs. RAG:** RAG is still the right primary architecture for large corpora; long context is complementary for synthesizing across retrieved chunks.

---

# Try It: RAG in 20 Lines

```python
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

loader = TextLoader("your_document.txt")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma.from_documents(chunks, embeddings)

query = "What is the main topic?"
results = vectorstore.similarity_search(query, k=3)
context = "\n".join([r.page_content for r in results])
print(f"Retrieved {len(results)} chunks")
```

---

# 6.7 Evaluating Reasoning and Agents

- **End-to-end task success** (SWE-bench, WebArena, GAIA) -- gold standard but expensive
- **Step-wise correctness**: did each tool call make sense given the state?
- **Trajectory analysis**: replay logs; cluster failure modes
- **Counterfactual probing**: would the agent recover from a wrong intermediate?
- **Calibration**: when the agent says "I'm done", is it actually done?

> Don't trust agent benchmarks naively -- task contamination, brittle scaffolding, and reward hacking are common.

---

# Key Papers

| Paper | Contribution |
|-------|-------------|
| Wei et al. 2022 | *Chain-of-Thought* |
| Wang et al. 2022 | *Self-Consistency* |
| Yao et al. 2023 | *Tree of Thoughts* |
| Snell et al. 2024 | *Scaling LLM Test-Time Compute* |
| DeepSeek-AI 2025 | *DeepSeek-R1* |
| Lewis et al. 2020 | *Retrieval-Augmented Generation* |
| Anthropic 2024 | *Building Effective Agents* |

---

# Exercises

1. Compare base, direct, CoT, and self-consistency (N=10) on GSM8K or MATH. Plot accuracy vs. N.
2. Build a minimal tool-using agent with Python execution and web search. Solve fact-finding tasks.
3. Build a RAG system over your own corpus. Measure answer correctness, citation correctness, latency.
4. Train a small reasoning model: SFT on CoT solutions, then GRPO on math problems with checkable answers.
