---
marp: true
theme: default
paginate: true
header: 'AI Engineering Syllabus'
footer: 'cs.kusandriadi.com'
---

# Cloud & AI Infrastructure

**Design, deploy, and scale AI systems in the cloud and at the edge**

- Audience: Students who completed ML, GenAI Engineering recommended
- Basic command line / terminal familiarity expected
- The skills that turn a data scientist into someone who can ship AI products

---

# Course Overview

- You've trained a model. It works on your laptop. Now what?
- How do you serve it to thousands of users? Keep it running reliably?
- How do you stop the cloud bill from exploding?
- Covers containers, cloud platforms, deployment, monitoring, security, cost optimization
- Take AI models out of Jupyter notebooks and into the real world

---

# Prerequisites & Self-Check

**Prerequisites:** Machine Learning, GenAI Engineering recommended, terminal familiarity

**Can you:**
- [ ] Open a terminal and navigate to a folder?
- [ ] Run a Python script from the command line?
- [ ] Explain what a "server" is (a computer that serves other computers)?
- [ ] Understand what "deploying a model" means?
- [ ] Create and activate a Python virtual environment?

If not, Week 0 has you covered!

---

# Tools & Technologies

- **Containers:** Docker, Kubernetes, Helm
- **Cloud:** AWS (SageMaker, Bedrock), GCP (Vertex AI, GKE), Azure (ML Studio)
- **IaC/CI:** Terraform, GitHub Actions
- **Serving:** FastAPI, NVIDIA Triton, vLLM
- **Orchestration:** Kubeflow, Ray
- **Monitoring:** Prometheus, Grafana, MLflow

---

# Week 0: Computer Basics for Cloud

*Learn to drive before building a car.*

- What is a server? Cloud vs local (renting a powerful computer over the internet)
- Terminal/command line basics: navigating folders, creating files, running scripts
- Linux basics: `ls`, `cd`, `mkdir`, `cat`
- What is a container? (like a shipping container -- same box runs everywhere)

**What You'll Build:**
- Practice essential terminal commands
- Connect to a remote server via SSH for the first time
- Run a simple Python script on a remote machine

---

# Week 1: AI Infrastructure Fundamentals

- What is AI infrastructure and why it matters
- The compute stack: CPU vs GPU vs TPU vs custom accelerators (Inferentia, Neural Engine)
- GPU deep dive: CUDA cores, tensor cores, VRAM, NVIDIA generations (A100, H100, B200)
- Linux essentials: shell commands, file system, processes, permissions
- Cloud paradigm: IaaS (rent servers), PaaS (rent platform), SaaS (use software)
- The three major clouds: AWS, GCP, Azure -- AI/ML service landscape

**What You'll Build:**
- Set up GPU-enabled cloud instances on AWS and GCP
- Compare GPU performance and cost across providers

---

# Week 2: Containerization with Docker

- Why containers: reproducibility (works the same everywhere), portability, isolation
- Docker fundamentals: images (blueprints), containers (running instances), Dockerfile (recipe)
- Building AI containers: GPU support, NVIDIA Container Toolkit, multi-stage builds
- Best practices: layer caching, version pinning, health checks
- Docker Compose: multi-service AI apps (model server + API + database)
- Container registries: Docker Hub, AWS ECR, GCP Artifact Registry

**What You'll Build:**
- Containerize a complete ML inference pipeline
- Build a multi-service app with Docker Compose

---

# Week 3: Kubernetes for AI Workloads

*Docker runs one container. Kubernetes runs thousands and keeps them healthy automatically.*

- Kubernetes (container traffic controller): pods, deployments, services
- Core concepts: ConfigMaps, Secrets, Persistent Volumes
- GPU scheduling: NVIDIA device plugin, resource requests/limits
- Autoscaling: HPA (horizontal), VPA (vertical), KEDA (event-driven)
- Managed K8s: EKS (AWS), GKE (GCP), AKS (Azure)
- Helm charts: packaging and deploying AI applications

**What You'll Build:**
- Deploy a model on Kubernetes with GPU scheduling
- Set up autoscaling based on inference request rate

---

# Week 4: Cloud AI Services -- Managed ML Platforms

- **AWS:** SageMaker (end-to-end ML), Bedrock (foundation models), Lambda (serverless)
- **GCP:** Vertex AI (unified ML + AutoML), Cloud TPUs, Cloud Run (serverless containers)
- **Azure:** ML Studio, Azure OpenAI Service (managed GPT-4), Azure Functions
- Choosing a platform: cost, features, ecosystem, lock-in
- Multi-cloud strategy: avoiding vendor lock-in
- Serverless AI: cold starts, limitations, use cases

**What You'll Build:**
- Deploy the same model on SageMaker, Vertex AI, and Azure ML
- Build a serverless inference endpoint with AWS Lambda

---

# Week 5: Infrastructure as Code & CI/CD for ML

*Clicking through cloud consoles is slow and error-prone. Define infrastructure in code.*

- Terraform (describe what you want, it builds it): modules, state management
- CI/CD for ML: data dependencies, model versioning, training pipelines
- GitHub Actions: automating training, testing, deployment
- ML pipeline automation: trigger, data prep, train, evaluate, register, deploy
- Version control: MLflow Model Registry, DVC (Data Version Control)

**What You'll Build:**
- Write Terraform modules for GPU instances + storage
- Build a CI/CD pipeline: code change, test, train, evaluate, deploy

---

# Week 6: Model Serving & Inference Optimization

- Serving architectures: online (real-time), batch (scheduled), streaming
- Frameworks: FastAPI (lightweight), Triton (production-grade, multi-model), vLLM (LLM-optimized)
- Inference optimization: quantization, dynamic batching, caching
- Speculative decoding (small model drafts, big model verifies -- speeds up generation)
- Model routing: right model for right request based on complexity/cost
- A/B testing and canary deployments for models

**What You'll Build:**
- Deploy with Triton Inference Server and dynamic batching
- Set up vLLM for optimized LLM serving
- Implement A/B testing between two model versions

---

# Week 7: Midterm Exam

- Covers Weeks 1-6
- Cloud fundamentals and compute stack
- Docker and Kubernetes
- Cloud AI services (AWS, GCP, Azure)
- Infrastructure as Code and CI/CD
- Model serving and inference optimization

---

# Week 8: Distributed Training

*Modern AI models are too large for a single GPU.*

- Data parallelism (each GPU trains on different data, then shares learning): DDP, AllReduce
- Model parallelism (splitting a model across GPUs): tensor, pipeline, sequence
- FSDP (Fully Sharded Data Parallel): PyTorch's ZeRO-style sharding
- DeepSpeed: Microsoft's library (ZeRO stages 1, 2, 3)
- Multi-node training: high-speed interconnects (NVLink, InfiniBand)
- Practical: communication overhead, batch size scaling, learning rate adjustment

**What You'll Build:**
- Train a model with DDP across multiple GPUs
- Compare DDP vs FSDP vs DeepSpeed on speed and memory

---

# Week 9: ML Pipelines & Workflow Orchestration

*Running a model once is easy. Running it automatically, reliably, every day? That's a pipeline.*

- ML pipeline architecture: modular, reproducible, automated
- Orchestration: Kubeflow Pipelines, Apache Airflow, Prefect, Argo Workflows
- Pipeline components: ingestion, validation, feature engineering, training, evaluation, deployment
- Feature stores: centralized feature management (Feast, Tecton)
- Metadata tracking: lineage from data to model to prediction

**What You'll Build:**
- Build an end-to-end ML pipeline with Kubeflow Pipelines
- Implement automated retraining triggered by data drift

---

# Week 10: Monitoring, Observability & Alerting

*AI models don't "break" like software. They silently get worse as the world changes.*

- Infrastructure monitoring: Prometheus (metrics), Grafana (dashboards), GPU monitoring (DCGM)
- Model monitoring: data drift (input distribution changes), concept drift (relationship changes)
- LLM observability: token usage, latency percentiles, quality monitoring
- Platforms: LangSmith, Langfuse, Arize; OpenTelemetry for AI
- Alerting: PagerDuty, OpsGenie; incident response when AI fails

**What You'll Build:**
- Set up Prometheus + Grafana for a Kubernetes-deployed model
- Implement drift detection with automated alerts

---

# Week 11: Security for AI Systems

*AI faces unique threats: model theft, data poisoning, adversarial inputs, supply chain attacks.*

- AI-specific threats: model theft, training data extraction, adversarial inputs, supply chain
- Infrastructure security: VPCs, security groups, private endpoints
- IAM (Identity and Access Management): least-privilege access
- Secrets management: HashiCorp Vault, AWS Secrets Manager
- Data security: encryption, access controls, PII detection/redaction
- Compliance: SOC 2, HIPAA, PCI DSS, EU AI Act

**What You'll Build:**
- Implement secure deployment: private endpoints, IAM roles, encryption
- Set up PII detection and redaction in an ML pipeline

---

# Week 12: Cost Optimization & FinOps for AI

*A single GPU costs $3+/hour. If you don't optimize, AI succeeds technically but fails financially.*

- FinOps for AI (Financial Operations -- managing cloud spending): tagging, allocation, budgets
- Training cost optimization: spot instances (60-90% savings), mixed precision, distillation
- Inference cost optimization: model routing, caching, batching, scale-to-zero, quantization
- LLM cost optimization: token optimization, SLM vs LLM routing, semantic caching
- Cloud cost comparison: AWS vs GCP vs Azure for AI workloads
- TCO (Total Cost of Ownership): cloud vs on-premises vs hybrid

**What You'll Build:**
- Implement a model router optimizing cost vs quality
- Build a cost dashboard tracking compute, storage, and API costs

---

# Week 13: Edge AI & Hybrid Architectures

- Why edge: latency, privacy, cost, offline capability, bandwidth constraints
- Edge platforms: NVIDIA Jetson, Intel OpenVINO, Apple Core ML, TF Lite, ONNX Runtime Mobile
- Model optimization for edge: quantization (INT8, INT4), pruning, distillation
- Running SLMs on edge: llama.cpp, MLC LLM on consumer hardware
- Edge-cloud hybrid: lightweight on edge, full model in cloud, federated learning
- IoT + AI and 5G + Edge AI applications

**What You'll Build:**
- Deploy a model on an edge device (Jetson Nano or mobile simulator)
- Build an edge-cloud hybrid pipeline with edge inference and cloud fallback

---

# Week 14: Capstone -- Production AI System Architecture

- System design: requirements, architecture (monolith vs microservices), technology selection
- Scaling strategy: horizontal, vertical, autoscaling policies
- Disaster recovery: backup, failover, multi-region deployment
- Combines everything: containers, orchestration, CI/CD, monitoring, security, cost

**What You'll Build:**
- Design a complete production AI system architecture with:
  - Architecture diagram and technology choices
  - CI/CD deployment strategy
  - Monitoring/alerting plan, security assessment, cost estimate

---

# Week 15: Capstone Demo

- Students present their production AI system architecture and demo
- Peer review and instructor feedback
- Evaluation on design decisions, scalability, cost efficiency

---

# Week 16: Final Exam

- Comprehensive exam covering all material:
  - Docker, Kubernetes, and cloud platforms
  - IaC, CI/CD, model serving
  - Distributed training and ML pipelines
  - Monitoring, security, and cost optimization
  - Edge AI and system architecture

---

# Recommended Resources

- **Designing Machine Learning Systems** -- Chip Huyen
- **Kubernetes Up & Running** -- Brendan Burns et al.
- **Docker Deep Dive** -- Nigel Poulton
- **Terraform: Up & Running** -- Yevgeniy Brikman
- **Cloud Native DevOps with Kubernetes** -- Justin Domingus & John Arundel
