# Appendix A — Practical Toolkit

A consolidated map of the tooling you actually use to do LLM work. Organized by stage of the stack, with opinionated picks at each layer.

## Programming languages

**Python** is the lingua franca. ~95% of LLM work happens in Python: data pipelines, training, fine-tuning, evaluation, agent frameworks, RAG, notebooks. If you only learn one, learn this.

**Rust** is rising fast in the inference and tooling layer:
- `tokenizers` (Hugging Face) — the canonical fast BPE library, Rust under Python bindings.
- `candle` (Hugging Face) — minimal PyTorch-like ML framework in Rust.
- `mistral.rs` — fast inference server.
- `text-generation-inference` (TGI) — production inference, partly Rust.
Reach for Rust when you need low-latency serving, embedded inference, or wire-protocol code.

**C++ / CUDA** for kernel writing and high-performance inference:
- `llama.cpp` — the most influential CPU/edge inference engine; ggml/gguf format.
- Writing custom CUDA / Triton kernels for FlashAttention-style optimizations.
- TensorRT-LLM internals.

**TypeScript / JavaScript** for the application layer:
- Frontends and full-stack agents (Next.js, Vercel AI SDK).
- Browser-based inference (Transformers.js, WebLLM).
- MCP servers and clients.

**Go** shows up in inference servers (Ollama is Go around llama.cpp) and infrastructure.

Practical recommendation: **Python first and primary**. Add TypeScript when you build a product. Touch Rust/CUDA only if you're doing systems work or kernel optimization.

## Core ML libraries

**PyTorch** is the default. Almost all open research and most production training. Eager-mode first, with `torch.compile` for performance.

**JAX** is the alternative, dominant inside Google and a chunk of frontier labs. Functional, XLA-compiled, strong on TPUs. Worth knowing if you work at a JAX shop; otherwise PyTorch is enough.

**Hugging Face stack** (Python, sits on top of PyTorch/JAX/TF):
- `transformers` — model definitions, tokenizers, generation, training. The de facto reference.
- `tokenizers` — fast BPE / WordPiece / Unigram.
- `datasets` — streaming, sharded, memory-mapped data loading.
- `accelerate` — abstraction over DDP/FSDP/DeepSpeed.
- `peft` — LoRA / QLoRA / adapter methods.
- `trl` — SFT, DPO, GRPO, PPO trainers.
- `evaluate` — eval metrics.

If you're starting fresh: install `transformers`, `datasets`, `accelerate`, `peft`, `trl`. That covers 80% of training-time needs.

## Training and fine-tuning frameworks

Building on PyTorch + HF:

- **TRL** (Hugging Face) — SFTTrainer, DPOTrainer, GRPOTrainer, RewardTrainer. The most accessible RLHF/DPO/GRPO implementations.
- **Axolotl** — config-driven fine-tuning. Defines runs in YAML; handles QLoRA, FSDP, flash-attn, deepspeed. Pragmatic and fast to iterate.
- **LLaMA-Factory** — similar to Axolotl, broader model coverage, has a WebUI.
- **Unsloth** — memory-efficient fine-tuning with custom Triton kernels. Often 2× faster, half the memory.
- **torchtune** (PyTorch native) — opinionated recipes, clean code, good for learning.
- **Megatron-LM / Megatron-Core** (NVIDIA) — production pre-training at scale. Tensor + pipeline + sequence parallelism.
- **DeepSpeed** (Microsoft) — ZeRO, training optimizations.
- **NeMo** (NVIDIA) — end-to-end training framework on top of Megatron.
- **Levanter / Marin** (JAX) — clean scalable training in JAX.

Quick picks:
- Fine-tuning a small model on a single GPU: **Unsloth** or **Axolotl** with QLoRA.
- Multi-GPU SFT/DPO: **TRL** + **accelerate** (FSDP), or **Axolotl**.
- Pre-training research at 1B–70B scale: **torchtune** or build on TRL/accelerate.
- Frontier-scale pre-training: **Megatron-Core** or in-house.

## Inference and serving

**Production servers** (Python + native backends):
- **vLLM** — PagedAttention, continuous batching, prefix caching, speculative decoding. Default open-source choice for self-hosted GPU inference.
- **SGLang** — fast, with first-class structured output, RadixAttention prefix sharing. Strong for agentic / tool-heavy workloads.
- **TensorRT-LLM** (NVIDIA) — best raw NVIDIA performance, more setup complexity.
- **Text Generation Inference (TGI)** — Hugging Face's server. Battle-tested, easy to deploy.
- **LMDeploy** (Shanghai AI Lab) — strong on Chinese-origin models, TurboMind backend.

**Local / edge inference**:
- **llama.cpp** — C++ inference; runs on CPU, GPU, Apple Silicon, mobile. GGUF model format.
- **Ollama** — wrapper over llama.cpp with one-line model management. The easiest way to run local models. (Detailed in Appendix B.)
- **MLX** (Apple) — Apple Silicon native. Fast on M-series chips.
- **LM Studio** — desktop app (GUI) over llama.cpp. Good for non-engineers.
- **Jan**, **Open WebUI** — open-source chat UIs over local backends.

**Embedded / mobile**:
- **ExecuTorch** (PyTorch mobile) — on-device PyTorch.
- **MediaPipe LLM Inference** (Google) — Android / iOS / web.

Quick picks:
- Serving a model to your team / app: **vLLM** or **SGLang**.
- Running models on your laptop: **Ollama** (CLI) or **LM Studio** (GUI).
- iOS/macOS apps: **MLX** or llama.cpp via Swift bindings.

## Quantization tools

- **bitsandbytes** — INT8/INT4 quantization integrated with Hugging Face. Easy QLoRA.
- **AutoGPTQ / GPTQModel** — GPTQ implementations.
- **AutoAWQ** — AWQ.
- **llama.cpp quants** — GGUF Q2_K through Q8_0; produces files for Ollama/llama.cpp.
- **AutoRound** (Intel) — competitive accuracy at INT4.

For most users: produce GGUF for local serving, use bitsandbytes during QLoRA training, use AWQ or GPTQ for vLLM serving.

## RAG: retrieval, embeddings, vector stores, frameworks

**Embedding models** (open):
- **BGE family** (BAAI) — `bge-m3`, `bge-large-en-v1.5`. Strong baselines.
- **E5 family** (Microsoft).
- **Nomic Embed**, **GTE**, **Jina** — competitive alternatives.
- **mxbai-embed-large** — popular small/medium choice.

**Embedding APIs**:
- OpenAI `text-embedding-3-large` / `-small`
- Cohere Embed v3
- Voyage AI (often top of leaderboards)

Pick by **MTEB leaderboard** for the relevant language and task, but also test on your own data.

**Vector stores**:

| Store | Hosting | Notes |
|-------|---------|-------|
| **FAISS** | Library | Facebook; in-process, no server. Best for static indexes. |
| **pgvector** | Postgres | Just SQL. Most boring + most flexible choice. |
| **Qdrant** | Self / cloud | Rust, strong filtering, gRPC. |
| **Weaviate** | Self / cloud | Hybrid search built in. |
| **Milvus** | Self / cloud | Scale-out; complex to operate. |
| **Chroma** | Library / server | Easiest dev experience; good for prototypes. |
| **LanceDB** | Library | Columnar, embedded; multimodal-friendly. |
| **Pinecone** | Cloud only | Managed; pay-per-use. |
| **Turbopuffer** | Cloud only | S3-backed, cheap at scale. |
| **Vespa** | Self / cloud | Mature, full search engine. |

**Hybrid search** (vector + BM25 / lexical):
- **Elasticsearch / OpenSearch** for BM25 + dense.
- **Tantivy** (Rust), `bm25s` (Python) for embeddable lexical.
- Reciprocal Rank Fusion (RRF) to combine.

**Rerankers** (cross-encoders, big quality lift):
- BGE Reranker (`bge-reranker-large`, `bge-reranker-v2-m3`).
- Cohere Rerank.
- Voyage Rerank.
- Jina Reranker.

**RAG frameworks**:
- **LlamaIndex** — most RAG-focused; rich connectors, indexing strategies, evaluation.
- **LangChain** — broader (RAG + agents + chains). Large surface area; can be over-engineered for simple cases.
- **Haystack** (deepset) — pipeline-oriented, production-friendly.
- **DSPy** — *programs* not prompts; compiles prompt strategies against metrics. Different paradigm; powerful for serious RAG/agent optimization.

Quick picks:
- Prototype RAG over your docs: **LlamaIndex** + **Chroma** or **pgvector** + a BGE embedder + a reranker.
- Production at scale: **pgvector** or **Qdrant** + **vLLM** + your own thin orchestration code.
- When you outgrow framework magic: roll your own retrieval pipeline; it's ~200 lines.

## Agent frameworks

The space is volatile (2026) — frameworks come and go. Current state:

- **LangGraph** (LangChain) — graph-based agent orchestration. Probably the most production-ready agent framework.
- **CrewAI** — multi-agent collaboration; role-based.
- **AutoGen** (Microsoft) — multi-agent conversations.
- **LlamaIndex AgentWorkflow** — agent layer atop LlamaIndex's retrieval.
- **Claude Agent SDK / Codex SDK** — opinionated agent stacks from foundation labs.
- **smolagents** (Hugging Face) — minimal, code-first agents.
- **Mastra** — TypeScript-first agent framework.
- **Vercel AI SDK** — TS-first; ergonomic for full-stack apps.

**Honest take**: most agent "frameworks" are thin abstractions over a tool-calling loop. For anything beyond a simple prototype, you'll end up either heavily customizing the framework or replacing it with your own ~500-line orchestrator. Read *Building Effective Agents* (Anthropic) before choosing. Start with the simplest thing that works.

**Tool / protocol layer**:
- **MCP (Model Context Protocol)** — open standard for tool servers, supported by Anthropic, OpenAI, Google, and others. If you're building tools, expose them as MCP servers.
- **OpenAPI / JSON schema** for ad-hoc tools.

## Evaluation and observability

**Eval frameworks**:
- **Inspect** (UK AISI) — modern, opinionated, strong for safety/capability evals.
- **lm-evaluation-harness** (EleutherAI) — large-scale benchmark coverage; what's used to produce published numbers.
- **OpenAI Evals** — original framework; less active now.
- **Promptfoo** — config-driven prompt comparison; great for iterating in CI.
- **DeepEval** — pytest-style LLM tests.
- **Ragas** — RAG-specific metrics (faithfulness, context precision/recall).

**Observability / tracing**:
- **Langfuse** — open-source LLM observability; self-hostable. Strong default.
- **Phoenix / Arize** — tracing + eval; OpenInference standard.
- **Helicone** — proxy-based logging; minimal setup.
- **LangSmith** (LangChain) — tracing for LangChain users.
- **Datadog LLM Observability** — if you're already on Datadog.

Standards: **OpenTelemetry** + **OpenInference** are converging as the trace format; pick a vendor that speaks them.

## Notebooks, experiment tracking, infrastructure

- **Jupyter / VS Code / Cursor / Claude Code** — interactive development.
- **Weights & Biases** — experiment tracking, sweeps, artifacts. The industry default.
- **MLflow** — open-source alternative; less LLM-specific.
- **Modal**, **Beam**, **RunPod**, **Together**, **Replicate** — serverless GPU / hosted training.
- **SkyPilot** — multi-cloud GPU orchestration.

## Data tooling

- **Hugging Face Datasets** — load and stream.
- **datatrove** (HF) — large-scale data processing pipelines (FineWeb was built with this).
- **Nemo Curator** (NVIDIA) — data curation at scale.
- **Lilac** — data exploration / curation UI.
- **Argilla** — human labeling for SFT / preferences.
- **Label Studio** — generic labeling.

## Putting it together: starter stacks

**Solo learner, on a laptop**:
- Ollama for running local models
- Python + Hugging Face Transformers for code
- Unsloth + QLoRA for fine-tuning experiments
- A Jupyter notebook for everything

**Small team building a product**:
- Frontier API (Claude/GPT/Gemini) + Ollama-served local model for cheap tasks
- LlamaIndex or your own retrieval over pgvector
- Langfuse for tracing
- Promptfoo or Inspect for evals in CI
- TypeScript app with Vercel AI SDK, Python services for ML

**Research lab**:
- PyTorch + torchtune or in-house training stack
- vLLM or SGLang for serving / eval rollouts
- Weights & Biases for tracking
- Inspect or lm-eval-harness for benchmarks

**Frontier-scale training**:
- Megatron-Core or in-house JAX/PyTorch stack
- Custom data pipeline (datatrove-style)
- Internal eval infrastructure
- Custom inference stack tuned to specific hardware

## What to ignore

A few things that look essential but rarely are:

- **Vector store benchmarks**. Use whichever is cheapest/easiest; correctness comes from retrieval *strategy*, not the store.
- **Most "agent frameworks"**. Code your own orchestration when you understand the problem. Frameworks are useful when you don't.
- **Benchmark leaderboards** in isolation. Test on your own data.
- **The newest paper-of-the-week**. Wait two weeks; the important ones survive.
- **Endless prompt engineering**. Once you've iterated on a small eval set, move on.

Pick boring, well-supported tools. Save your novelty budget for the problem you're actually trying to solve.
