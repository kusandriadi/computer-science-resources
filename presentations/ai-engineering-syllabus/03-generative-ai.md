---
marp: true
theme: default
paginate: true
header: 'AI Engineering Syllabus'
footer: 'cs.kusandriadi.com'
---

# Generative AI Engineering

**Learn to build AI-powered applications from foundation to production**

- Audience: Students who completed Machine Learning (Semester 1)
- From "cool chatbot" to real applications people can rely on
- Second semester of a two-part program

---

# Course Overview

- You've used ChatGPT or Claude -- now learn to build something like that yourself
- Start by understanding how large language models actually work
- Build your way up: simple chatbots to AI agents that use tools and work together
- Cover RAG, agents, fine-tuning, safety, and deployment
- By the end, build, test, and deploy AI-powered applications for the real world

---

# Prerequisites & Self-Check

**Prerequisites:** Machine Learning (Semester 1), Python proficiency, basic API knowledge

**Can you:**
- [ ] Write a Python script that reads a file and processes contents?
- [ ] Install a Python package using `pip install`?
- [ ] Explain what a trained ML model does?
- [ ] Navigate folders and run scripts from the terminal?
- [ ] Understand what JSON looks like?

If not, Week 0 has you covered!

---

# Tools & Technologies

- **LLM SDKs:** Anthropic SDK, OpenAI SDK, Ollama
- **Frameworks:** LangChain, LangGraph, CrewAI
- **Data:** ChromaDB, Hugging Face (Transformers, TRL, PEFT)
- **Ops:** Docker, LangSmith/Langfuse, NeMo Guardrails
- **Dev Tools:** GitHub Copilot, Claude Code

---

# Week 0: Getting Ready for GenAI

*Getting comfortable with the tools you'll use every day -- no prior experience needed.*

- API basics: what is an API (a way for programs to talk to each other), JSON format
- Terminal/command line basics: navigating folders, running Python scripts
- Environment setup: virtual environments, pip install
- Your first API call: calling the Claude/GPT API with a simple prompt

**What You'll Build:**
- Set up your development environment from scratch
- Make your first API call to an AI model and get a response

---

# Week 1: The AI Landscape

- The evolution: rule-based systems, ML, deep learning, large language models
- AI classification: ANI (Narrow), AGI (General), ASI (Super Intelligence)
- Where we are today: what LLMs can and cannot do, hype vs reality
- Key players: OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek
- Open-source vs closed-source debate
- Career landscape: AI engineer vs ML engineer vs data scientist

**What You'll Build:**
- Map the current AI timeline and compare LLM capabilities vs overhyped claims

---

# Week 2: How LLMs Work

*If you want to build with AI, you need to understand what's happening inside.*

- Tokenization (breaking text into pieces): BPE, SentencePiece, tiktoken
- Attention mechanism: self-attention, multi-head attention, positional encoding
- Decoding strategies (how AI picks the next word): greedy, beam search, top-k, top-p, temperature
- Standard LLMs vs Reasoning Models (o1/o3, DeepSeek R1, Claude thinking mode)
- RLVR (Reinforcement Learning from Verifiable Rewards): how reasoning is trained

**What You'll Build:**
- Visualize tokenization across models and languages
- Compare standard vs reasoning model outputs on complex problems

---

# Week 3: LLM Ecosystem & Setup

- Cloud APIs: OpenAI, Anthropic, Google Vertex AI, Azure OpenAI (pricing, rate limits, SLAs)
- Local models with Ollama: running LLMs on your own hardware
- Open-source: LLaMA 3, Mistral/Mixtral, Qwen, DeepSeek
- Small Language Models (SLMs): Phi-4, Gemma 3, Mistral 7B -- under 10B parameters
- SLM vs LLM tradeoffs: cost, latency, privacy, accuracy
- Gartner predicts SLMs will be used 3x more than LLMs by 2027

**What You'll Build:**
- Set up Ollama locally, compare cloud LLM vs local LLM vs SLM on the same task
- Build a model router that picks the best model based on task complexity

---

# Week 4: Prompt Engineering

- Core techniques: zero-shot, few-shot, Chain-of-Thought (CoT), ReAct
- System prompts: setting behavior, personality, constraints
- Structured output: getting JSON, XML reliably
- Prompt chaining: breaking complex tasks into sequential prompts
- AI coding assistants: GitHub Copilot, Claude Code, Cursor
- When AI coding assistants help vs when they mislead

**What You'll Build:**
- Build a reusable prompt library (summarization, extraction, classification)
- Create a prompt evaluation framework to measure which prompts work best

---

# Week 5: Memory & Session Management

*By default, LLMs have no memory. Every conversation starts from scratch.*

- The context window problem: LLMs are stateless
- Conversation history: sliding window, summarization, token budget management
- Long-term memory: episodic (what happened), semantic (what was learned), procedural (how to do things)
- Session persistence: database-backed sessions, handling concurrent users
- Memory frameworks: Mem0, Zep, custom implementations with vector stores

**What You'll Build:**
- Build a chatbot with persistent memory across sessions
- Compare different context window strategies: measure what's lost and retained

---

# Week 6: Embeddings & Vector Databases

- Embeddings (turning text into lists of numbers): sentence-transformers, OpenAI embeddings
- Similarity metrics: cosine similarity, dot product, Euclidean distance
- Vector databases: ChromaDB (lightweight), Pinecone, Weaviate, Qdrant (production)
- Indexing strategies: HNSW, IVF, PQ -- tradeoffs between speed and accuracy
- Chunking strategies: fixed-size, sentence-based, semantic, recursive splitting

**What You'll Build:**
- Build a vector store from a document collection using ChromaDB
- Implement semantic search with different chunking strategies

---

# Week 7: Midterm Exam

- Covers Weeks 1-6
- AI landscape and LLM internals
- Reasoning models and ecosystem setup
- Prompt engineering
- Memory management
- Embeddings and vector databases

---

# Week 8: RAG Fundamentals

- RAG (Retrieval-Augmented Generation): letting the AI look up information before answering
- Why RAG: reducing hallucination (when AI confidently makes things up), keeping info current
- The RAG pipeline: ingest, chunk, embed, store, retrieve, generate, respond with citations
- RAG vs fine-tuning: when to use which approach
- Common RAG failures: wrong chunks, context overflow, hallucination despite retrieval

**What You'll Build:**
- Build a complete RAG pipeline: upload documents, ask questions, get answers with citations
- Identify and fix common RAG failure modes

---

# Week 9: Advanced RAG

*Basic RAG gets you 70%. These techniques get you to 90%+.*

- Agentic RAG: the agent decides what, when, and how to retrieve
- Knowledge Graphs: LightRAG, GraphRAG (Microsoft) -- structured retrieval
- Advanced retrieval: hybrid search (dense + sparse), re-ranking, query expansion
- Evaluation with RAGAS: faithfulness, relevance, context precision, context recall
- Hallucination detection and mitigation strategies

**What You'll Build:**
- Build an Agentic RAG system with autonomous retrieval planning
- Compare naive RAG vs agentic RAG vs knowledge graph-enhanced RAG

---

# Week 10: AI Agents & Tool Use

- AI agents: LLMs that can take actions in the real world
- Function calling / tool use (letting AI use calculators, web search, databases)
- Agent architectures: ReAct, Plan-and-Execute, Reflection
- Frameworks: LangChain, LangGraph, CrewAI
- Swarm pattern (OpenAI): lightweight multi-agent orchestration with handoffs
- Human-in-the-loop: when to ask for human confirmation

**What You'll Build:**
- Build a single agent with tool use: web search, calculator, code execution
- Scale to a multi-agent system: a "team" of specialized agents

---

# Week 11: Plugins, Skills, MCP & A2A

*Giving AI the ability to connect with the outside world -- and with other AI agents.*

- Model Context Protocol (MCP -- Anthropic): standardized protocol for AI-to-tool connections
- Agent-to-Agent Protocol (A2A -- Google): standard for agents to communicate
- MCP vs A2A: complementary (MCP = model-to-tool, A2A = agent-to-agent)
- Reusable skills: composable, testable units of AI capability
- Multi-agent orchestration: hub-and-spoke, peer-to-peer, marketplace

**What You'll Build:**
- Build a custom MCP server exposing a real API to AI models
- Design a multi-agent workflow with A2A protocol

---

# Week 12: Fine-Tuning & Model Customization

*Sometimes prompts and RAG aren't enough. You need the model to behave differently.*

- Fine-tuning vs RAG vs prompting: decision framework
- LoRA (Low-Rank Adaptation -- training a small "patch" instead of the whole model)
- QLoRA: fine-tune large models on consumer hardware
- Knowledge distillation: training smaller models to mimic larger ones
- Synthetic data generation: using LLMs to create training data
- DPO (Direct Preference Optimization): alignment without a reward model

**What You'll Build:**
- Fine-tune an SLM (e.g., Mistral 7B) using QLoRA
- Apply DPO alignment using preference pairs

---

# Week 13: Evaluation, Testing & Safety

*Before you ship, you need to know how it fails.*

- Red teaming: prompt injection (hidden instructions), jailbreaking, data extraction
- LLM Observability: LangSmith, Langfuse, Portkey, Arize Phoenix
- Guardrails: NeMo Guardrails (input/output/topical rails), Guardrails AI (validators)
- Responsible AI: bias in LLMs, fairness, transparency
- AI regulation: EU AI Act risk categories, emerging global standards

**What You'll Build:**
- Run a structured red-teaming exercise against your AI application
- Set up LLM observability with Langfuse and implement NeMo Guardrails

---

# Week 14: Deployment, LLMOps & The Road Ahead

- Production deployment: Docker, scaling, caching (semantic + exact match)
- Monitoring: latency P50/P95/P99, error rates, token usage, cost optimization
- Edge AI: running SLMs on mobile (Core ML, NNAPI), quantization (INT8, INT4)
- Multimodal AI: vision-language (GPT-4V, Claude), image generation, audio (Whisper, TTS)
- The road ahead: AGI/ASI trajectory, AI alignment, the evolving role of AI engineers

**What You'll Build:**
- Deploy an AI application to production with Docker and monitoring
- Explore edge deployment and multimodal APIs

---

# Week 15: Capstone Demo

- Students present an end-to-end AI application
- **Requirements:**
  - Solves a real problem
  - Uses at least 3 major course concepts (e.g., RAG + agents + guardrails)
  - Deployed or deployable with documentation
  - Evaluation results and responsible AI considerations
- Peer review and instructor feedback

---

# Week 16: Final Exam

- Comprehensive exam covering all course material:
  - LLM internals and reasoning models
  - Prompt engineering and memory management
  - RAG, agents, MCP/A2A
  - Fine-tuning and safety
  - Observability and deployment

---

# Recommended Resources

- **Build a Large Language Model (From Scratch)** -- Sebastian Raschka
- **Hands-On Large Language Models** -- Jay Alammar & Maarten Grootendorst
- **Designing Machine Learning Systems** -- Chip Huyen
- **LangChain Documentation** -- langchain.dev
- **Anthropic Documentation** -- docs.anthropic.com
