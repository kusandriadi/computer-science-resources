# Generative AI Engineering

**Learn to build AI-powered applications from foundation to production**

---

## Course Overview

This course transforms students from AI users into AI engineers. Starting from how Large Language Models actually work under the hood, students progressively build increasingly sophisticated AI applications — from simple chatbots to multi-agent systems with persistent memory, retrieval-augmented generation, and production-grade safety guardrails. The curriculum is designed around what the industry actually needs in 2026: not just prompt engineering, but full-stack AI engineering including reasoning models, agentic systems, edge deployment, and LLM observability.

This course is the second semester of a two-part program. **Machine Learning** (Semester 1) is the prerequisite.

---

## Prerequisites

- Machine Learning (Semester 1) or equivalent
- Python proficiency
- Basic understanding of APIs and web development

### Self-Check: Am I Ready?

Before starting this course, make sure you can:
- [ ] Write a Python script that reads a file and processes its contents
- [ ] Install a Python package using `pip install`
- [ ] Explain what a trained ML model does (takes input, makes a prediction)
- [ ] Use a terminal/command line to navigate folders and run scripts
- [ ] Understand what JSON looks like (key-value pairs like `{"name": "Alice", "age": 25}`)

If you can't check all boxes, don't worry! Week 0 covers these foundations.

## Tools & Technologies

Anthropic SDK, OpenAI SDK, Ollama, LangChain, LangGraph, CrewAI, ChromaDB, Hugging Face (Transformers, TRL, PEFT), Docker, GitHub Copilot, Claude Code, LangSmith/Langfuse, NeMo Guardrails

---

## Weekly Schedule

---

### Week 0: Getting Ready for GenAI

*Welcome! This week gets you comfortable with the tools you'll use every day in this course — no prior experience needed.*

**Topics:**
- API basics: what is an API (a way for programs to talk to each other), how to call one, JSON format
- Terminal/command line basics: navigating folders, running Python scripts
- Environment setup: Python virtual environments, pip install
- Your first API call: calling the Claude/GPT API with a simple prompt
- What is a "model"? A simple mental model before diving deep

**What You'll Build:**
- Set up your development environment from scratch (Python, virtual environment, API keys)
- Make your first API call to an AI model and get a response
- Build a tiny script that sends a question to an AI and prints the answer

---

### Week 1: The AI Landscape

**Topics:**
- The evolution of AI: rule-based systems → machine learning → deep learning → large language models
- AI classification: Artificial Narrow Intelligence (ANI) → Artificial General Intelligence (AGI) → Artificial Super Intelligence (ASI)
- Where we are today: what LLMs can and cannot do, hype vs reality
- The Transformer architecture overview: why it changed everything (building on Week 12 of ML)
- Key players in the AI ecosystem: OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek
- The open-source vs closed-source debate
- Career landscape: what does an AI engineer do vs ML engineer vs data scientist

**What You'll Build:**
- Map where we are today in the AI timeline
- Create a comparative analysis of current LLM capabilities and limitations
- Identify real-world use cases that are genuinely solved by LLMs vs overhyped claims

---

### Week 2: How LLMs Work

**Topics:**
- Tokenization (breaking text into small pieces the AI can read): how text becomes numbers (BPE, SentencePiece, tiktoken)
- The attention mechanism in depth: self-attention, multi-head attention, positional encoding
- The generation pipeline: how an LLM produces text token by token
- Decoding strategies (how the AI picks the next word): greedy, beam search, top-k, top-p (nucleus sampling), temperature
- Context windows (the maximum amount of text the AI can "see" at once): what they are, why they matter, current limits
- Standard LLMs vs Reasoning Models:
  - Reasoning models: OpenAI o1/o3/o4-mini, DeepSeek R1, Claude thinking mode
  - How reasoning models work: chain-of-thought at inference time, "thinking tokens"
  - Test-time compute scaling: spending more compute at inference instead of training
  - Reinforcement Learning from Verifiable Rewards (RLVR): how reasoning is trained
    - Building on RL foundations from ML course (Week 15): PPO, reward models, policy optimization
    - Verifiable rewards: math has correct answers, code has test cases — no human labeling needed
    - How chain-of-thought emerges: the model discovers that "thinking step by step" gets higher rewards
    - GRPO (Group Relative Policy Optimization): DeepSeek R1's approach — sample multiple outputs, rank them, use relative ranking as reward
  - When to use standard LLMs vs reasoning models: cost, latency, accuracy tradeoffs
- How LLMs are aligned — the RL connection (prerequisite: ML Week 15):
  - RLHF pipeline recap: SFT → reward model → PPO optimization
  - DPO (Direct Preference Optimization): skipping the reward model
  - Constitutional AI (Anthropic): self-supervised alignment
  - Why alignment matters: the difference between a helpful assistant and a harmful one

**What You'll Build:**
- Explore the internals of GPT, Claude, and LLaMA through interactive experiments
- Visualize tokenization across different models and languages
- Compare standard model vs reasoning model outputs on the same complex problems
- Measure the cost/latency/accuracy tradeoffs between model types

---

### Week 3: LLM Ecosystem & Setup

**Topics:**
- Cloud API providers: OpenAI, Anthropic, Google Vertex AI, Azure OpenAI
  - Pricing models, rate limits, SLAs
  - API authentication, SDKs, streaming responses
- Local models with Ollama: running LLMs on your own hardware
- Open-source ecosystem:
  - LLaMA 3 (Meta): the foundation of open-source LLMs
  - Mistral/Mixtral: efficient European models
  - Qwen (Alibaba): strong multilingual capabilities
  - DeepSeek: competitive open-source from China, including DeepSeek R1 reasoning model
- Small Language Models (SLMs) — the rising trend:
  - What are SLMs: models under 10B parameters optimized for specific tasks
  - Key SLMs: Microsoft Phi-4, Google Gemma 3, Mistral 7B, Qwen 2.5 3B
  - SLM vs LLM trade-offs: cost, latency, privacy, accuracy, customizability
  - When to use SLMs: edge deployment, on-device inference, domain-specific tasks
  - Gartner prediction: SLMs will be used 3x more than LLMs by 2027
- Cost comparison framework: token pricing, self-hosting economics, total cost of ownership

**What You'll Build:**
- Set up Ollama locally and download multiple models
- Run the same task on a cloud LLM, a local LLM, and an SLM — compare quality, speed, and cost
- Build a simple model router that picks the best model based on task complexity

---

### Week 4: Prompt Engineering

**Topics:**
- Why prompt engineering matters: the difference between good and bad prompts
- Core techniques:
  - Zero-shot: asking without examples
  - Few-shot: teaching by example
  - Chain-of-Thought (CoT): step-by-step reasoning
  - ReAct (Reasoning + Acting): combining thought and action
- System prompts: setting behavior, personality, constraints
- Structured output: getting JSON, XML, or specific formats reliably
- Prompt chaining: breaking complex tasks into sequential prompts
- Prompt templates and libraries: reusable, parameterized prompts
- AI coding assistants as a daily tool:
  - GitHub Copilot: inline code completion, chat
  - Claude Code: terminal-based agentic coding
  - Cursor: AI-native IDE
  - How to write effective prompts for code generation
  - When AI coding assistants help vs when they mislead

**What You'll Build:**
- Build a reusable prompt library for common tasks (summarization, extraction, classification)
- Use AI coding assistants for a development workflow: write code, debug, refactor
- Create a prompt evaluation framework: measure which prompts produce the best results

---

### Week 5: Memory & Session Management

**Topics:**
- The context window problem: LLMs are stateless — they forget everything between calls
- Conversation history management:
  - Sliding window: keep the last N messages
  - Summarization: compress old messages into summaries
  - Token counting and budget management
- Context window strategies for long conversations:
  - When to truncate vs summarize vs retrieve
  - Handling multi-turn conversations without losing critical context
- Long-term memory:
  - Why short-term context isn't enough for persistent applications
  - Storing user preferences, facts, and interaction history across sessions
  - Memory types: episodic (what happened), semantic (what was learned), procedural (how to do things)
- Session state persistence:
  - Storing and restoring conversation state
  - Database-backed sessions
  - Handling concurrent users
- Memory frameworks:
  - Mem0: automatic memory extraction and retrieval
  - Zep: long-term memory for AI assistants
  - Custom memory implementations with vector stores

**What You'll Build:**
- Build a chatbot with persistent memory across sessions
- Implement a memory system that remembers user preferences and past interactions
- Compare different context window strategies: measure what's lost and retained

---

### Week 6: Embeddings & Vector Databases

**Topics:**
- What are embeddings (turning words, sentences, or images into lists of numbers the AI understands): representing text (and images, audio) as dense vectors
- How embedding models work: sentence-transformers, OpenAI embeddings, Cohere embeddings
- Similarity metrics (ways to measure how "close" two pieces of text are in meaning): cosine similarity, dot product, Euclidean distance
- Vector databases:
  - Why traditional databases can't do similarity search efficiently
  - ChromaDB: lightweight, easy to start
  - Pinecone, Weaviate, Qdrant, Milvus: production-grade options
  - Indexing strategies (ways to organize data so searches are fast): HNSW, IVF, PQ — tradeoffs between speed and accuracy
- Chunking strategies: how to split documents for optimal retrieval
  - Fixed-size chunks, sentence-based, semantic chunking, recursive splitting
  - Chunk size vs retrieval quality tradeoffs
- Metadata filtering: combining vector search with traditional filters

**What You'll Build:**
- Build a vector store from a document collection using ChromaDB
- Implement semantic search: find relevant passages from natural language queries
- Experiment with different chunking strategies and measure retrieval quality

---

### Week 7: Midterm Exam

Covers Weeks 1-6: AI landscape, LLM internals, reasoning models, ecosystem setup, prompt engineering, memory management, embeddings, and vector databases.

---

### Week 8: RAG Fundamentals

**Topics:**
- What is RAG (Retrieval-Augmented Generation — letting the AI look up information before answering): giving LLMs access to external knowledge
- Why RAG matters: reducing hallucination (when AI confidently makes things up), keeping information current, domain-specific answers
- The RAG pipeline:
  1. Document ingestion: loading PDFs, web pages, databases
  2. Chunking and embedding: preparing documents for retrieval
  3. Storage: indexing in a vector database
  4. Retrieval: finding relevant chunks for a given query
  5. Generation: combining retrieved context with the LLM prompt
  6. Response: presenting the answer with source citations
- RAG vs fine-tuning: when to use which approach
- Common RAG failures: wrong chunks retrieved, context window overflow, hallucination despite retrieval
- Document loaders: PDF, DOCX, HTML, CSV, databases
- Citation and source tracking: proving where answers come from

**What You'll Build:**
- Build a complete RAG pipeline: upload documents, ask questions, get accurate answers with citations
- Test with different document types and measure answer quality
- Identify and fix common RAG failure modes

---

### Week 9: Advanced RAG

**Topics:**
- Limitations of basic RAG: the "naive retrieval" problem
- Agentic RAG — RAG with decision-making:
  - The agent decides what to retrieve, when, and how
  - Query planning: breaking complex questions into sub-queries
  - Iterative retrieval: retrieving, reading, then retrieving more based on what was found
  - Self-reflection: the agent evaluates whether retrieved information is sufficient
  - Multi-source routing: choosing between different knowledge bases
- Knowledge Graphs for structured retrieval:
  - What knowledge graphs add that vector search alone can't: relationships, hierarchy, context
  - LightRAG: lightweight knowledge graph integration with RAG
  - GraphRAG (Microsoft): building knowledge graphs from documents automatically
  - Hybrid approach: combining vector search + knowledge graph traversal
- Advanced retrieval techniques:
  - Hybrid search: combining dense (vector) + sparse (BM25/keyword) retrieval
  - Re-ranking: using a cross-encoder to re-score retrieved results
  - Query expansion: reformulating queries for better retrieval
  - Contextual compression: extracting only the relevant parts from retrieved chunks
- Evaluation with RAGAS framework:
  - Faithfulness: does the answer match the retrieved context?
  - Answer relevance: does the answer address the question?
  - Context precision: are the retrieved chunks actually relevant?
  - Context recall: did we retrieve all the necessary information?
- Hallucination detection and mitigation strategies

**What You'll Build:**
- Build an Agentic RAG system that plans retrieval strategies autonomously
- Integrate a knowledge graph for structured information retrieval
- Set up RAGAS evaluation and measure the quality of your RAG pipeline
- Compare naive RAG vs agentic RAG vs knowledge graph-enhanced RAG on the same dataset

---

### Week 10: AI Agents & Tool Use

**Topics:**
- What are AI agents: LLMs that can take actions in the real world
- From chatbots to agents: the paradigm shift
- Function calling / tool use (letting the AI use external tools like calculators, web search, or databases):
  - How LLMs call external functions: the API contract
  - Defining tools with JSON schemas (describing what each tool does in a structured format)
  - Tool execution and response handling
  - Error handling and retry strategies
- Agent architectures:
  - ReAct pattern: Reasoning + Acting in a loop
  - Plan-and-Execute: plan all steps first, then execute
  - Reflection: agent critiques and improves its own output
- Agent frameworks:
  - LangChain: the foundational framework, tools and chains
  - LangGraph: stateful, graph-based agent workflows with cycles and branching
  - CrewAI: role-based multi-agent collaboration
- Single-agent vs multi-agent architecture:
  - When one agent is enough vs when you need a team
  - Specialization: each agent has a specific role and toolset
  - Coordination patterns: sequential, parallel, hierarchical
- Swarm pattern (OpenAI Swarm):
  - Lightweight multi-agent orchestration
  - Handoff between agents: when and how agents pass tasks to each other
  - Self-organizing agent teams
- Agent orchestration:
  - Managing state across agent interactions
  - Shared memory and communication between agents
  - Human-in-the-loop: when to ask for human confirmation

**What You'll Build:**
- Build a single agent with tool use: web search, calculator, code execution
- Scale to a multi-agent system: a "team" of specialized agents collaborating on a complex task
- Implement the Swarm pattern: agents that hand off tasks to each other dynamically

---

### Week 11: Plugins, Skills, MCP & A2A

**Topics:**
- The AI plugin ecosystem:
  - What plugins are: extending LLM capabilities with external services
  - Plugin design patterns: authentication, data flow, error handling
  - OpenAI plugins (legacy), ChatGPT actions, Claude tools
- Reusable skills design:
  - Skills as composable, testable units of AI capability
  - Skill libraries: building a catalog of reusable AI capabilities
  - Skill chaining: combining multiple skills into complex workflows
- Model Context Protocol (MCP) — Anthropic:
  - What MCP is: a standardized protocol for connecting AI models to external tools and data
  - MCP architecture: hosts, clients, servers
  - Building MCP servers: exposing your APIs, databases, and tools to AI models
  - MCP in production: security, authentication, rate limiting
  - MCP adoption: now part of the Linux Foundation, supported across the industry
- Agent-to-Agent Protocol (A2A) — Google:
  - What A2A is: a standard for agents to communicate with each other
  - Agent Cards: how agents advertise their capabilities
  - Task lifecycle: send, receive, negotiate, complete
  - A2A vs MCP: complementary protocols (MCP = model-to-tool, A2A = agent-to-agent)
- Multi-agent orchestration patterns:
  - Hub-and-spoke: central coordinator delegates to specialists
  - Peer-to-peer: agents communicate directly
  - Marketplace: agents discover and hire other agents
- Inter-agent communication:
  - Message formats and protocols
  - Shared state and context passing
  - Conflict resolution when agents disagree

**What You'll Build:**
- Build a custom MCP server that exposes a real API to AI models
- Design a multi-agent workflow where agents communicate via A2A protocol
- Create a skill library with composable, reusable AI capabilities
- Orchestrate a complex task across multiple agents with different specializations

---

### Week 12: Fine-Tuning & Model Customization

**Topics:**
- Why fine-tune: when prompting and RAG aren't enough
- Fine-tuning vs RAG vs prompt engineering — decision framework:
  - RAG: for adding knowledge (facts, documents)
  - Fine-tuning: for changing behavior (style, format, domain expertise)
  - Prompt engineering: for guiding existing capabilities
- Parameter-Efficient Fine-Tuning (PEFT):
  - Full fine-tuning: expensive, requires all parameters
  - LoRA (Low-Rank Adaptation — training a small "patch" instead of the whole model): training small adapter matrices instead of full weights
  - QLoRA: LoRA with quantization (shrinking the model's memory footprint) — fine-tune large models on consumer hardware
  - Adapter layers, prefix tuning, prompt tuning
- Knowledge distillation (teacher → student):
  - What it is: training a smaller model to mimic a larger model's behavior
  - Why it matters: getting GPT-4 quality in a model you can run locally
  - Distillation pipeline: generate training data from teacher, train student model
  - Evaluation: measuring how much knowledge transfers
- Fine-tuning SLMs for domain-specific tasks:
  - Why SLMs are ideal for fine-tuning: faster training, lower cost, easier deployment
  - Domain adaptation: legal, medical, financial, technical domains
  - Task-specific fine-tuning: classification, extraction, summarization
- Synthetic data generation for training:
  - Why synthetic data: real data is expensive, scarce, or privacy-restricted
  - Using LLMs to generate training data for smaller models
  - Quality control: filtering, deduplication, diversity checks
  - Seed data amplification: turning 100 examples into 10,000
- Dataset preparation and curation:
  - Data formatting: instruction-response pairs, chat format
  - Data quality: cleaning, deduplication, balanced representation
  - Train/validation split strategies for fine-tuning
- Evaluation after fine-tuning:
  - Benchmark comparison: before vs after
  - Domain-specific evaluation metrics
  - Regression testing: making sure fine-tuning didn't break general capabilities
- Alignment fine-tuning via RL (building on ML Week 15):
  - RLHF in practice: when and why to use preference-based alignment after SFT
  - DPO for practitioners: creating preference datasets and training with the TRL library
  - Safety alignment: using Constitutional AI principles to reduce harmful outputs
  - The full fine-tuning pipeline: SFT → DPO/RLHF → evaluation → deployment
- Alignment fine-tuning — making models safer and more helpful:
  - RLHF in practice: when you need to align a fine-tuned model to user preferences
  - DPO (Direct Preference Optimization): practical alternative — no reward model needed
    - How DPO works: directly optimize the model using preference pairs (chosen vs rejected)
    - DPO dataset format: pairs of (prompt, good_response, bad_response)
    - Tools: Hugging Face TRL library for DPO training
  - When to use alignment tuning: customer-facing chatbots, safety-critical applications

**What You'll Build:**
- Generate synthetic training data using a large model (teacher)
- Fine-tune an open-source SLM (e.g., Mistral 7B or Phi-4) using QLoRA
- Evaluate the fine-tuned model against the base model on domain-specific tasks
- Compare the fine-tuned SLM against a prompted LLM: quality, cost, latency
- Apply DPO alignment on a fine-tuned model using preference pairs (chosen vs rejected responses)
- Experiment with DPO: create preference pairs and align a model's behavior

---

### Week 13: Evaluation, Testing & Safety

**Topics:**
- Red teaming (intentionally trying to break your AI to find weaknesses):
  - What it is: adversarial testing to find vulnerabilities
  - Common attack vectors: prompt injection (tricking the AI with hidden instructions), jailbreaking (bypassing safety filters), data extraction
  - How to run a red teaming exercise systematically
  - Automated red teaming tools
- Prompt injection defense:
  - Direct injection: malicious instructions in user input
  - Indirect injection: malicious instructions hidden in retrieved documents
  - Defense strategies: input sanitization, output validation, instruction hierarchy
- LLM Observability tools — monitoring AI in production:
  - LangSmith: tracing, evaluation, and monitoring for LangChain applications
  - Langfuse: open-source LLM observability — traces, scores, analytics
  - Portkey: AI gateway with observability, caching, and routing
  - Arize Phoenix: LLM evaluation, tracing, and experimentation
  - What to monitor: latency, token usage, cost, error rates, user satisfaction
- OpenTelemetry for LLM tracing:
  - Extending standard observability to AI workloads
  - Distributed tracing across agent workflows
  - Custom spans for retrieval, generation, tool execution
- Guardrails frameworks — enforcing safety at runtime:
  - NVIDIA NeMo Guardrails: programmable safety rails for LLM applications
    - Input rails: filter dangerous user inputs
    - Output rails: validate and filter model responses
    - Topical rails: keep conversations on-topic
    - Custom actions and flows
  - Guardrails AI: validation framework for LLM outputs
    - Validators: type checking, toxicity, PII detection, hallucination
    - Structured output enforcement
  - Building a layered safety system: input → processing → output validation
- Responsible AI in practice:
  - Bias in LLMs: how training data creates bias, how to detect and mitigate
  - Fairness considerations in AI applications
  - Transparency: disclosing AI use to end users
- AI regulation awareness:
  - EU AI Act: risk categories, compliance requirements
  - Emerging global standards: US, China, Southeast Asia
  - What AI engineers need to know about regulation
- AI governance:
  - Organizational AI policies
  - Model cards and documentation
  - Incident response: what to do when AI goes wrong

**What You'll Build:**
- Run a structured red teaming exercise against your AI application
- Set up an LLM observability pipeline with Langfuse: traces, cost tracking, quality scores
- Implement production guardrails with NeMo Guardrails: input filtering, output validation
- Create a safety test suite that runs automatically before deployment

---

### Week 14: Deployment, LLMOps & The Road Ahead

**Topics:**
- Production deployment:
  - API design for AI applications: streaming, async, batch
  - Containerization with Docker (packaging your app so it runs the same way everywhere): packaging AI applications
  - Scaling strategies: horizontal scaling, load balancing, queue-based processing
  - Caching: semantic caching, exact match caching, cache invalidation
- Monitoring and maintenance:
  - Production metrics: latency P50/P95/P99, error rates, token usage
  - Cost optimization: model routing, prompt optimization, caching, batching
  - A/B testing AI features: measuring impact on user satisfaction
- Cloud basics for AI engineers:
  - AWS Bedrock, Google Vertex AI, Azure OpenAI: managed AI services
  - GPU instances: when you need your own compute
  - Serverless inference: pay-per-request model serving
- Edge AI and on-device deployment:
  - Why edge matters: privacy (data never leaves device), latency, offline capability, cost
  - Running SLMs on mobile: Apple Core ML, Android NNAPI
  - IoT and embedded AI: running inference on resource-constrained devices
  - Model optimization for edge: quantization (INT8, INT4), pruning, ONNX Runtime
  - Use cases: smart assistants, real-time translation, on-device coding assistants
- Multimodal AI overview:
  - Vision-language models: GPT-4V, Claude vision, Gemini — understanding images + text
  - Image generation: DALL-E, Stable Diffusion, Midjourney — creating images from text
  - Audio and speech: Whisper (speech-to-text), TTS models, voice cloning
  - Video understanding and generation: emerging frontier
  - Building multimodal pipelines: combining vision + language + audio
- The road ahead — trajectory toward the future:
  - AGI: what it would mean, how close are we, what are the remaining challenges
  - ASI: theoretical implications, alignment problem
  - AI alignment and safety: ensuring AI systems do what we want
  - The evolving role of AI engineers: from prompt engineers to AI system architects
  - How to stay relevant: continuous learning, building a portfolio, contributing to open source
  - The human-AI collaboration paradigm: AI as a tool, not a replacement

**What You'll Build:**
- Deploy an AI application to production with Docker and basic monitoring
- Optimize for cost: implement caching and model routing
- Explore edge deployment: run an SLM on a local device
- Experiment with multimodal APIs: vision + text, speech + text
- Create a personal roadmap for your AI engineering career

---

### Week 15: Capstone Demo

**Format:**
- Students present their end-to-end AI application to the class
- Requirements:
  - A working AI application that solves a real problem
  - Uses at least 3 major concepts from the course (e.g., RAG + agents + guardrails)
  - Deployed or deployable with documentation
  - Evaluation results: how good is it, and how do you know?
  - Responsible AI considerations documented
- Peer review and instructor feedback
- Portfolio-ready project with documentation and code repository

---

### Week 16: Final Exam

Comprehensive exam covering all course material: LLM internals, reasoning models, prompt engineering, memory management, RAG, agents, MCP/A2A, fine-tuning, safety, observability, deployment, and the broader AI landscape.

---

## Learning Outcomes

By the end of this course, students will be able to:

1. Understand how LLMs and reasoning models work under the hood, not just how to use them
2. Set up and work with cloud APIs, local models, and Small Language Models (SLMs) for edge deployment
3. Design effective prompts and leverage AI coding assistants for development workflow
4. Build RAG systems including Agentic RAG and Knowledge Graph-enhanced retrieval
5. Create AI agents capable of real-world actions through tool use and multi-agent orchestration
6. Build and deploy MCP servers and implement A2A protocol for inter-agent communication
7. Fine-tune and distill models for domain-specific needs, including synthetic data generation
8. Evaluate AI systems using observability tools and implement production guardrails
9. Deploy and maintain AI applications in production and on edge devices with cost optimization
10. Work with multimodal AI including vision-language models and audio processing
11. Apply responsible AI principles, understand AI governance, and navigate the regulatory landscape
12. Articulate the current state of AI, the trajectory toward AGI/ASI, and the implications for engineers and society

---

## Program Outcomes (Combined with Machine Learning)

Students completing both semesters will graduate with a comprehensive skill set that is competitive in the global AI job market:

| Competency | Coverage |
|---|---|
| ML Fundamentals | Supervised & unsupervised learning, neural networks, model evaluation |
| Mathematics for AI | Linear algebra, calculus, probability, statistics, optimization — taught contextually |
| LLM & Generative AI | Transformer architecture, reasoning models (o1/o3, DeepSeek R1), tokenization, prompt engineering, fine-tuning, knowledge distillation, SLMs |
| RAG & Knowledge Systems | Embeddings, vector databases, Agentic RAG, Knowledge Graphs (LightRAG, GraphRAG), evaluation |
| AI Agents & Orchestration | Tool use, function calling, Swarm pattern, MCP, A2A protocol, multi-agent systems, plugins, skills |
| Production Engineering | API deployment, LLM observability (LangSmith, Langfuse), cost optimization, cloud basics, Edge AI, on-device deployment, MLOps, AI coding assistants |
| Safety & Responsibility | Bias detection, prompt injection defense, guardrails frameworks (NeMo Guardrails), AI regulation, Explainable AI (XAI), AI governance |
| Multimodal AI | Vision-language models, image generation, audio/speech processing, multimodal pipelines |
| AI Landscape & Future | ANI/AGI/ASI understanding, AI alignment, trajectory awareness, career positioning |
| Professional Workflow | Git, experiment tracking, collaborative development, business impact measurement |
