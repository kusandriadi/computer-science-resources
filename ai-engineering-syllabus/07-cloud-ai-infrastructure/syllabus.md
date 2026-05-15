# Cloud & AI Infrastructure

**Design, deploy, and scale AI systems in the cloud and at the edge**

---

## Course Overview

You've trained a machine learning model. It works great on your laptop. Now what? How do you make it available to thousands of users? How do you keep it running reliably? How do you stop the cloud bill from exploding?

That's what this course is about. You'll learn to take AI models out of Jupyter notebooks and into the real world. We'll cover containers, cloud platforms, deployment, monitoring, security, and cost optimization. These are the skills that turn a data scientist into someone who can actually ship AI products.

---

## Prerequisites

- Machine Learning (Semester 2) — model training, evaluation, deployment basics
- Generative AI Engineering (Semester 3) recommended
- Basic command line / terminal familiarity

### Self-Check: Am I Ready?

Before starting this course, make sure you can:
- [ ] Open a terminal/command line and navigate to a folder
- [ ] Run a Python script from the command line (`python my_script.py`)
- [ ] Explain what a "server" is in simple terms (a computer that provides services to other computers)
- [ ] Understand what "deploying a model" means (making it available for others to use)
- [ ] Create and activate a Python virtual environment

If you can't check all boxes, don't worry! Week 0 covers these foundations.

## Tools & Technologies

Docker, Kubernetes, Helm, AWS (SageMaker, Bedrock, Lambda), GCP (Vertex AI, Cloud Run, GKE), Azure (ML Studio, OpenAI Service), Terraform, GitHub Actions, MLflow, FastAPI, NVIDIA Triton, vLLM, Kubeflow, Ray, Prometheus, Grafana

---

## Weekly Schedule

---

### Week 0: Computer Basics for Cloud

*Welcome! This week covers the fundamentals you'll need before diving into cloud infrastructure. Think of it as learning to drive before building a car.*

**Topics:**
- What is a server? Cloud vs local computing (simple analogy: renting a powerful computer over the internet instead of buying one)
- Terminal/command line basics: navigating folders, creating files, running scripts
- What is Linux? Basic commands: `ls` (list files), `cd` (change directory), `mkdir` (make folder), `cat` (show file contents)
- What is a container? (analogy: a shipping container — same box runs the same way everywhere, no matter the ship)

**What You'll Build:**
- Practice essential terminal commands in a guided exercise
- Connect to a remote server (or cloud instance) for the first time via SSH
- Run a simple Python script on a remote machine

---

### Week 1: AI Infrastructure Fundamentals

**Topics:**
- What is AI infrastructure and why it matters
- The AI compute stack: CPU (general processor) vs GPU (graphics processor, great for parallel AI tasks) vs TPU (Google's custom AI chip) vs custom accelerators (Apple Neural Engine, AWS Inferentia)
- GPU deep dive: CUDA cores, tensor cores, GPU memory (VRAM), NVIDIA GPU generations (A100, H100, H200, B200)
- Linux essentials for AI engineers: shell commands, file system, processes, permissions, environment variables
- Development environment setup: SSH, tmux, conda/venv, Jupyter on remote machines
- The cloud computing paradigm: IaaS (rent raw servers), PaaS (rent a platform to build on), SaaS (use ready-made software) — what AI engineers need
- Introduction to the three major clouds: AWS, GCP, Azure — their AI/ML service landscape

**What You'll Build:**
- Set up a GPU-enabled cloud instance on AWS and GCP
- Run a model training job on a cloud GPU and monitor resource utilization
- Compare GPU performance and cost across cloud providers

---

### Week 2: Containerization with Docker

**Topics:**
- Why containers matter for AI: reproducibility (works the same everywhere), portability, isolation, dependency management
- Docker fundamentals: images (blueprints), containers (running instances), Dockerfile (recipe to build an image), docker-compose (running multiple containers together)
- Building AI containers:
  - Python ML containers with GPU support
  - Multi-stage builds: reducing image size
  - NVIDIA Container Toolkit: GPU access inside containers
- Docker best practices for AI:
  - Layer caching: speeding up builds
  - Requirements management: pinning versions
  - Health checks and resource limits
- Container registries: Docker Hub, AWS ECR, GCP Artifact Registry
- Docker Compose for multi-service AI applications: model server + API + database

**What You'll Build:**
- Containerize a complete ML inference pipeline with Docker
- Build a multi-service application with Docker Compose: API + model server + vector database
- Push images to a container registry and pull on a different machine

---

### Week 3: Kubernetes for AI Workloads

*Why this matters: Docker runs one container. Kubernetes runs thousands of containers and keeps them healthy automatically. If you're deploying AI at any real scale, you'll need Kubernetes.*

**Topics:**
- Why Kubernetes (an open-source system for managing containers at scale — think of it as a container traffic controller): orchestrating containers at scale
- Kubernetes architecture — the key pieces:
  - Control plane (the brain)
  - Nodes (worker machines)
  - Pods (smallest unit, usually one container)
  - Services and deployments
- Core concepts for AI:
  - Pods: the smallest deployable unit
  - Deployments: managing replicas and rolling updates
  - Services: exposing AI models (ClusterIP, LoadBalancer, Ingress)
  - ConfigMaps and Secrets: managing configuration
  - Persistent Volumes: storing model artifacts and data
- GPU scheduling in Kubernetes: NVIDIA device plugin, resource requests/limits
- Autoscaling AI workloads — making your system grow and shrink automatically:
  - Horizontal Pod Autoscaler (HPA): scaling based on CPU/memory/custom metrics
  - Vertical Pod Autoscaler (VPA): right-sizing pod resources
  - KEDA: event-driven autoscaling for AI inference
- Managed Kubernetes: EKS (AWS), GKE (GCP), AKS (Azure)
- Helm charts: packaging and deploying AI applications

**What You'll Build:**
- Deploy a model serving application on Kubernetes with GPU scheduling
- Set up autoscaling based on inference request rate
- Package the deployment as a Helm chart for reusable deployment

---

### Week 4: Cloud AI Services — Managed ML Platforms

**Topics:**
- AWS AI/ML services:
  - SageMaker: end-to-end ML platform (training, tuning, deployment)
  - Bedrock: managed foundation model access (Claude, LLaMA, Mistral)
  - Lambda + API Gateway: serverless inference
- Google Cloud AI:
  - Vertex AI: unified ML platform with AutoML and custom training
  - Cloud TPUs: Google's custom AI accelerators
  - Cloud Run: serverless container deployment
- Azure AI:
  - Azure ML Studio: experiment tracking, pipelines, deployment
  - Azure OpenAI Service: managed GPT-4, DALL-E access
  - Azure Functions: serverless compute
- Choosing a platform: cost, features, ecosystem, lock-in considerations
- Multi-cloud strategy: why and how to avoid vendor lock-in
- Serverless AI inference: Lambda/Cloud Functions/Azure Functions for ML — cold starts, limitations, use cases

**What You'll Build:**
- Deploy the same model on AWS SageMaker, GCP Vertex AI, and Azure ML
- Build a serverless inference endpoint using AWS Lambda + API Gateway
- Compare cost, latency, and developer experience across platforms

---

### Week 5: Infrastructure as Code & CI/CD for ML

*Why this matters: Clicking through cloud consoles to set up servers is slow and error-prone. This week teaches you how to define your entire infrastructure in code — so it's repeatable, reviewable, and automated.*

**Topics:**
- Infrastructure as Code (IaC — defining your servers and services in code files instead of clicking through web consoles):
  - Terraform: declarative infrastructure provisioning across clouds (describe what you want, and it builds it)
  - Writing Terraform modules for AI infrastructure: GPU instances, networking, storage
  - State management: remote state, locking, workspaces
- CI/CD for machine learning (Continuous Integration/Continuous Deployment — automatically testing and deploying your code):
  - Why ML needs different CI/CD: data dependencies, model versioning, training pipelines
  - GitHub Actions: automating model training, testing, and deployment
  - GitOps with ArgoCD: declarative deployments to Kubernetes
- ML pipeline automation:
  - Training pipelines: trigger → data prep → train → evaluate → register → deploy
  - Data validation: Great Expectations, schema validation
  - Model validation: automated quality gates before deployment
- Version control for ML:
  - Model registry: MLflow Model Registry, SageMaker Model Registry
  - Data versioning: DVC (Data Version Control)
  - Experiment tracking: MLflow, Weights & Biases

**What You'll Build:**
- Write Terraform modules to provision AI infrastructure (GPU instances + storage)
- Build a CI/CD pipeline with GitHub Actions: code change → test → train → evaluate → deploy
- Set up model registry with automated quality gates

---

### Week 6: Model Serving & Inference Optimization

**Topics:**
- Model serving architectures:
  - Online serving: real-time, low-latency inference
  - Batch serving: high-throughput, scheduled inference
  - Streaming serving: processing data in real-time
- Serving frameworks:
  - FastAPI: lightweight, Python-native serving
  - NVIDIA Triton Inference Server: production-grade, multi-model, multi-framework
  - TorchServe: PyTorch-optimized serving
  - vLLM: optimized LLM serving with PagedAttention
  - TGI (Text Generation Inference): Hugging Face's LLM serving solution
- Inference optimization:
  - Quantization: FP16, INT8, INT4 — serving smaller, faster models
  - Batching: dynamic batching, continuous batching for LLMs
  - Caching: semantic caching, KV-cache optimization
  - Speculative decoding (using a small fast model to draft, then a big model to verify — speeds up generation)
- Model routing: sending requests to the right model based on complexity, cost, or latency
- A/B testing and canary deployments for models

**What You'll Build:**
- Deploy a model with Triton Inference Server with dynamic batching
- Set up vLLM for optimized LLM serving
- Implement A/B testing between two model versions

---

### Week 7: Midterm Exam

Covers Weeks 1-6: cloud fundamentals, Docker, Kubernetes, cloud AI services, IaC, CI/CD, model serving.

---

### Week 8: Distributed Training

*Why this matters: Modern AI models are too large to train on a single GPU. This week teaches you how to spread training across multiple GPUs and even multiple machines.*

**Topics:**
- Why distributed training: models and datasets are too large for a single GPU
- Data parallelism (each GPU trains on different data, then they share what they learned):
  - DistributedDataParallel (DDP): same model, different data shards on each GPU
  - Gradient synchronization: AllReduce, Ring-AllReduce (ways GPUs share their learning)
- Model parallelism (splitting a model that's too big for one GPU across multiple GPUs):
  - Tensor parallelism: splitting layers across GPUs
  - Pipeline parallelism: splitting model stages across GPUs
  - Sequence parallelism: distributing along the sequence dimension
- Fully Sharded Data Parallel (FSDP): PyTorch's approach to ZeRO-style sharding
- DeepSpeed: Microsoft's distributed training library (ZeRO stages 1, 2, 3)
- Ray Train: distributed training with Ray
- Multi-node training: training across multiple machines with high-speed interconnects
- Practical considerations: communication overhead, batch size scaling, learning rate adjustment
- GPU cluster design: networking (NVLink, InfiniBand), storage (NFS, parallel file systems)

**What You'll Build:**
- Train a model with DDP across multiple GPUs
- Set up FSDP for memory-efficient training of a large model
- Compare DDP vs FSDP vs DeepSpeed on training speed and memory usage

---

### Week 9: ML Pipelines & Workflow Orchestration

*Why this matters: Running a model once in a notebook is easy. Running it automatically, reliably, every day, with fresh data? That requires a pipeline. This is what separates experiments from real products.*

**Topics:**
- ML pipeline architecture: modular, reproducible, automated workflows
- Workflow orchestration tools:
  - Kubeflow Pipelines: Kubernetes-native ML workflows
  - Apache Airflow: general-purpose workflow orchestration (widely used for data + ML)
  - Prefect: modern Python-native orchestration
  - Argo Workflows: Kubernetes-native, container-based workflows
- Pipeline components:
  - Data ingestion and validation
  - Feature engineering and transformation
  - Model training and hyperparameter tuning
  - Model evaluation and comparison
  - Model registration and deployment
  - Monitoring and retraining triggers
- Feature stores: centralized feature management (Feast, Tecton)
- Metadata tracking: lineage from data to model to prediction

**What You'll Build:**
- Build an end-to-end ML pipeline with Kubeflow Pipelines
- Implement automated retraining triggered by data drift detection
- Set up a feature store for shared feature management

---

### Week 10: Monitoring, Observability & Alerting

*Why this matters: AI models don't just "break" like normal software. They silently get worse over time as the world changes around them. This week teaches you how to catch problems before your users do.*

**Topics:**
- Why monitoring AI is different from monitoring software: drift, degradation, fairness shifts
- Infrastructure monitoring:
  - Prometheus: metrics collection for Kubernetes and GPU workloads
  - Grafana: dashboarding and visualization
  - GPU monitoring: nvidia-smi, DCGM (Data Center GPU Manager)
- Model monitoring:
  - Data drift (when real-world data starts looking different from what the model was trained on): detecting changes in input distribution (Evidently, NannyML)
  - Concept drift (when the relationship between inputs and correct answers changes over time)
  - Performance monitoring: accuracy degradation, latency changes, error rate spikes
- LLM-specific observability:
  - Token usage and cost tracking
  - Latency percentiles (P50, P95, P99)
  - Quality monitoring: automated evaluation, user feedback
  - LangSmith, Langfuse, Arize: LLM observability platforms
- OpenTelemetry for AI: extending standard observability to ML workloads
- Alerting: PagerDuty, OpsGenie — when to wake someone up
- Incident response: what to do when an AI system fails in production

**What You'll Build:**
- Set up Prometheus + Grafana monitoring for a Kubernetes-deployed model
- Implement data drift detection with automated alerts
- Build an LLM cost and quality dashboard with Langfuse

---

### Week 11: Security for AI Systems

*Why this matters: AI systems face unique security threats. Someone could steal your model, poison your training data, or trick your system with crafted inputs. This week covers how to defend against all of these.*

**Topics:**
- AI-specific security threats:
  - Model theft: protecting model IP through API, model watermarking
  - Training data extraction: preventing models from leaking sensitive data
  - Adversarial inputs: protecting against malicious inputs in production
  - Supply chain attacks: poisoned models, malicious dependencies
- Infrastructure security:
  - Network security: VPCs, security groups, private endpoints
  - Identity and Access Management (IAM): least-privilege access to ML resources
  - Secrets management: API keys, model credentials (HashiCorp Vault, AWS Secrets Manager)
  - Container security: image scanning, runtime protection
- Data security:
  - Encryption at rest and in transit
  - Data access controls and audit logging
  - PII detection and redaction in ML pipelines
- Compliance:
  - SOC 2 for AI systems
  - HIPAA for healthcare AI
  - PCI DSS for financial AI
  - EU AI Act technical requirements

**What You'll Build:**
- Implement a secure AI deployment: private endpoints, IAM roles, encrypted storage
- Set up PII detection and redaction in an ML pipeline
- Create a security audit checklist for an AI system

---

### Week 12: Cost Optimization & FinOps for AI

*Why this matters: A single GPU can cost $3+/hour. A training run can cost thousands of dollars. If you don't learn to optimize costs, your AI project might succeed technically but fail financially.*

**Topics:**
- The cost problem: AI infrastructure is expensive — GPU compute, storage, API calls, data transfer
- FinOps for AI (Financial Operations — managing and optimizing cloud spending): applied to AI workloads
  - Cost visibility: tagging, allocation, chargeback
  - Cost optimization: right-sizing, spot instances, reserved capacity
  - Cost governance: budgets, alerts, approval workflows
- Training cost optimization:
  - Spot/preemptible instances: 60-90% savings with checkpointing
  - Mixed precision training: faster training = less cost
  - Efficient architectures: smaller models, distillation
  - Hyperparameter optimization: smart search instead of brute force
- Inference cost optimization — where most production costs go:
  - Model routing: use expensive models for hard queries, cheap models for easy ones
  - Caching: avoid re-computing answers you've already given
  - Batching: process multiple requests together
  - Scale-to-zero: serverless inference when traffic is low
  - Quantization: serve smaller models at lower cost
- LLM cost optimization — this adds up fast:
  - Token optimization: shorter prompts, structured outputs
  - Model selection: SLM vs LLM based on task complexity
  - Caching LLM responses: semantic similarity matching
- Cloud cost comparison: AWS vs GCP vs Azure pricing for AI workloads
- Total Cost of Ownership (TCO): cloud vs on-premises vs hybrid

**What You'll Build:**
- Implement a model router that optimizes cost vs quality
- Build a cost dashboard tracking compute, storage, and API costs
- Create a cost optimization plan for an AI application

---

### Week 13: Edge AI & Hybrid Architectures

**Topics:**
- Why edge: latency, privacy, cost, offline capability, bandwidth constraints
- Edge deployment platforms:
  - NVIDIA Jetson: GPU-powered edge AI (AGX Orin, Nano)
  - Intel OpenVINO: optimized inference for Intel hardware
  - Apple Core ML / Neural Engine: iOS and macOS
  - TensorFlow Lite / ONNX Runtime Mobile: Android and IoT
  - AWS IoT Greengrass: cloud-managed edge AI
- Model optimization for edge:
  - Quantization: INT8, INT4, binary
  - Pruning and sparsity
  - Knowledge distillation
  - ONNX Runtime: cross-platform optimized inference
- Running SLMs on edge:
  - Small Language Models on mobile devices
  - On-device inference for privacy-sensitive applications
  - llama.cpp, MLC LLM: running LLMs on consumer hardware
- Edge-cloud hybrid architecture:
  - Split inference: lightweight model on edge, full model in cloud
  - Edge preprocessing + cloud analysis
  - Federated learning (training AI across many devices without collecting data in one place)
- IoT + AI: smart sensors, predictive maintenance, industrial applications
- 5G + Edge AI: low-latency distributed AI applications

**What You'll Build:**
- Deploy a model on an edge device (Jetson Nano or mobile simulator)
- Build an edge-cloud hybrid pipeline: fast inference on edge, fallback to cloud
- Benchmark model performance across edge deployment platforms

---

### Week 14: Capstone — Production AI System Architecture

**Topics:**
- System design for production AI:
  - Requirements gathering: latency, throughput, availability, cost constraints
  - Architecture design: monolith vs microservices, sync vs async
  - Technology selection: cloud services, frameworks, serving infrastructure
  - Scaling strategy: horizontal, vertical, autoscaling policies
  - Disaster recovery: backup, failover, multi-region deployment
- The capstone combines everything: containers, orchestration, CI/CD, monitoring, security, cost optimization

**What You'll Build:**
- Design and present a complete production AI system architecture:
  - Architecture diagram and technology choices
  - Deployment strategy with CI/CD
  - Monitoring and alerting plan
  - Security assessment
  - Cost estimate and optimization strategy
  - Edge/hybrid components if applicable

---

### Week 15: Capstone Demo

Students present their production AI system architecture and demo. Peer review and instructor feedback.

---

### Week 16: Final Exam

Comprehensive exam covering all course material.

---

## Learning Outcomes

By the end of this course, students will be able to:

1. Containerize and orchestrate AI applications with Docker and Kubernetes
2. Deploy AI workloads on major cloud platforms (AWS, GCP, Azure) and compare their offerings
3. Provision AI infrastructure with Terraform and automate deployments with CI/CD
4. Serve models in production using Triton, vLLM, and FastAPI with proper optimization
5. Set up distributed training across multiple GPUs with DDP, FSDP, and DeepSpeed
6. Build automated ML pipelines with orchestration tools (Kubeflow, Airflow)
7. Monitor AI systems: infrastructure metrics, data/concept drift, LLM observability
8. Implement security best practices for AI systems: IAM, encryption, PII protection
9. Optimize AI costs using FinOps practices: model routing, caching, spot instances, scale-to-zero
10. Deploy AI on edge devices and design edge-cloud hybrid architectures
11. Design end-to-end production AI system architectures with reliability, scalability, and cost efficiency
