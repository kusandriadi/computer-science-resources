# 🤖 AI Engineering Curriculum

**A comprehensive, industry-aligned AI education program — updated for 2026**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Last Updated](https://img.shields.io/badge/Updated-February%202026-green.svg)](#)
[![Courses](https://img.shields.io/badge/Courses-7-orange.svg)](#courses)

---

## Overview

This repository contains a complete AI Engineering curriculum designed to take students from zero programming experience to production-ready AI engineers. The program spans **7 courses across 4 semesters (112 weeks)**, covering everything from data analysis fundamentals to cutting-edge multi-agent systems, computer vision, and cloud-scale AI infrastructure.

Every course is aligned with **February 2026 industry trends**, including reasoning models (o1/o3, DeepSeek R1), small language models (SLMs), agentic AI, the EU AI Act, LLM observability, and edge deployment.

### Who is this for?

- 🎓 **Universities** designing or updating AI/CS programs
- 👨‍🏫 **Educators** looking for structured, up-to-date AI teaching materials
- 🎯 **Self-learners** who want a clear roadmap from beginner to AI engineer
- 🏢 **Organizations** building internal AI training programs

---

## Program Structure

```
Semester 1        Semester 2        Semester 3           Semester 4
───────────       ───────────       ───────────          ───────────

┌───────────┐    ┌───────────┐    ┌───────────────┐    ┌──────────────────┐
│   Data     │    │  Machine  │    │  Generative   │    │   AI Ethics,     │
│  Science   │───▶│ Learning  │───▶│     AI        │    │   Governance &   │
│ & AI for   │    │           │    │ Engineering   │    │  Explainability  │
│ Business   │    │           │    │               │    │                  │
└───────────┘    └───────────┘    └───────┬───────┘    └──────────────────┘
  Foundation        Core             Core │               Elective
                                         │
                                         ├────────────  ┌──────────────────┐
                                         │              │   Deep Learning  │
                                         │              │      & NLP       │
                                         │              └──────────────────┘
                                         │                Elective
                                         │
                                         ├────────────  ┌──────────────────┐
                                         │              │   Computer       │
                                         │              │   Vision         │
                                         │              └──────────────────┘
                                         │                Elective
                                         │
                                         └────────────  ┌──────────────────┐
                                                        │   Cloud & AI     │
                                                        │  Infrastructure  │
                                                        └──────────────────┘
                                                          Elective
```

### Recommended Pathway

| Semester | Course | Type | Focus |
|----------|--------|------|-------|
| **1** | [Data Science & AI for Business](#01-data-science--ai-for-business) | Foundation | Data analysis, SQL, visualization, business framing |
| **2** | [Machine Learning](#02-machine-learning) | Core | Algorithms, math foundations, model evaluation, deployment |
| **3** | [Generative AI Engineering](#03-generative-ai-engineering) | Core | LLMs, RAG, agents, MCP, fine-tuning, production AI |
| **3–4** | [Deep Learning & NLP](#04-deep-learning--nlp) | Elective | CNNs, Transformers, NLP, GANs, diffusion models |
| **3–4** | [Computer Vision](#05-computer-vision) | Elective | Detection, segmentation, 3D vision, foundation models |
| **4** | [AI Ethics, Governance & Explainability](#06-ai-ethics-governance--explainability) | Elective | Bias, fairness, XAI, regulation, AI safety |
| **4** | [Cloud & AI Infrastructure](#07-cloud--ai-infrastructure) | Elective | Docker, Kubernetes, MLOps, distributed training, edge AI |

> **Note:** The first 3 courses (Semesters 1–3) form the **core track** that all students complete. Semesters 3–4 electives allow specialization based on career interest.

---

## Courses

### 01. Data Science & AI for Business
**Transform data into decisions, translate business problems into AI solutions**

📁 [`01-data-science-ai-for-business/syllabus.md`](01-data-science-ai-for-business/syllabus.md)

| Detail | |
|--------|---|
| **Duration** | 16 weeks |
| **Difficulty** | ⭐⭐ Beginner-Friendly |
| **Prerequisites** | Basic computer literacy |
| **Key Topics** | Python, Pandas, SQL, EDA, data visualization, statistics, A/B testing, predictive analytics, Streamlit, AI product management, data ethics |
| **Tools** | Python, Pandas, NumPy, SQL, Matplotlib, Seaborn, Plotly, Power BI/Tableau, Streamlit, Git |

---

### 02. Machine Learning
**Understand the theory, master the math, build the models**

📁 [`02-machine-learning/syllabus.md`](02-machine-learning/syllabus.md)

| Detail | |
|--------|---|
| **Duration** | 16 weeks |
| **Difficulty** | ⭐⭐⭐ Intermediate |
| **Prerequisites** | Data Science & AI for Business (or Python proficiency) |
| **Key Topics** | Supervised/unsupervised learning, regression, classification, tree-based models, neural networks, Transformers intro, XAI (SHAP, LIME), MLflow, production deployment |
| **Tools** | Python, NumPy, Pandas, Matplotlib, scikit-learn, PyTorch, FastAPI, Git, MLflow |
| **Math** | Linear algebra, calculus, probability, statistics, optimization — taught contextually ("just-in-time") |

---

### 03. Generative AI Engineering
**Learn to build AI-powered applications from foundation to production**

📁 [`03-generative-ai-engineering/syllabus.md`](03-generative-ai-engineering/syllabus.md)

| Detail | |
|--------|---|
| **Duration** | 16 weeks |
| **Difficulty** | ⭐⭐⭐ Intermediate |
| **Prerequisites** | Machine Learning |
| **Key Topics** | LLM internals, reasoning models (o1/o3, DeepSeek R1), SLMs, prompt engineering, memory management, RAG, Agentic RAG, Knowledge Graphs, AI agents, Swarm pattern, MCP, A2A, fine-tuning (LoRA/QLoRA), knowledge distillation, synthetic data, LLM observability, guardrails, edge AI, multimodal AI |
| **Tools** | Anthropic SDK, OpenAI SDK, Ollama, LangChain, LangGraph, CrewAI, ChromaDB, Hugging Face, Docker, GitHub Copilot, Claude Code, LangSmith/Langfuse, NeMo Guardrails |

---

### 04. Deep Learning & NLP
**Master neural architectures from CNNs to Diffusion Models**

📁 [`04-deep-learning-nlp/syllabus.md`](04-deep-learning-nlp/syllabus.md)

| Detail | |
|--------|---|
| **Duration** | 16 weeks |
| **Difficulty** | ⭐⭐⭐⭐ Advanced |
| **Prerequisites** | Machine Learning (neural networks, PyTorch basics) |
| **Key Topics** | CNN architectures (ResNet, EfficientNet, ConvNeXt), RNN/LSTM, Transformers deep dive, BERT/GPT/T5 family, Hugging Face ecosystem, transfer learning, LoRA, NLP applications (NER, QA, summarization), speech/audio (Whisper), GANs, VAEs, diffusion models, Vision Transformers, CLIP, SAM, model optimization |
| **Tools** | PyTorch, Hugging Face Transformers, torchvision, torchaudio, TensorBoard, Weights & Biases, ONNX |

---

### 05. Computer Vision
**Teach machines to see — from image classification to 3D understanding**

📁 [`05-computer-vision/syllabus.md`](05-computer-vision/syllabus.md)

| Detail | |
|--------|---|
| **Duration** | 16 weeks |
| **Difficulty** | ⭐⭐⭐⭐ Advanced |
| **Prerequisites** | Machine Learning (Deep Learning & NLP recommended) |
| **Key Topics** | Classical CV (OpenCV), image classification, object detection (YOLO, DETR, Grounding DINO), segmentation (U-Net, SAM 3), face analysis, video understanding, 3D vision (depth estimation, NeRF, Gaussian Splatting), OCR, foundation models (CLIP, DINO), generative vision (Stable Diffusion, ControlNet), edge deployment |
| **Tools** | PyTorch, OpenCV, Ultralytics (YOLO), Hugging Face, Roboflow, Detectron2, SAM, ONNX Runtime |

---

### 06. AI Ethics, Governance & Explainability
**Build AI that is fair, transparent, accountable, and trustworthy**

📁 [`06-ai-ethics-governance-explainability/syllabus.md`](06-ai-ethics-governance-explainability/syllabus.md)

| Detail | |
|--------|---|
| **Duration** | 16 weeks |
| **Difficulty** | ⭐⭐⭐ Intermediate |
| **Prerequisites** | Machine Learning (GenAI Engineering recommended) |
| **Key Topics** | AI bias (detection & mitigation), fairness metrics, SHAP, LIME, counterfactual explanations, LLM observability, adversarial attacks, prompt injection defense, NeMo Guardrails, EU AI Act, NIST AI RMF, ISO 42001, AI governance frameworks, privacy (differential privacy, federated learning), responsible generative AI, AI alignment, high-stakes domain analysis |
| **Tools** | SHAP, LIME, IBM AIF360, Microsoft Fairlearn, NeMo Guardrails, Guardrails AI, LangSmith/Langfuse |

---

### 07. Cloud & AI Infrastructure
**Design, deploy, and scale AI systems in the cloud and at the edge**

📁 [`07-cloud-ai-infrastructure/syllabus.md`](07-cloud-ai-infrastructure/syllabus.md)

| Detail | |
|--------|---|
| **Duration** | 16 weeks |
| **Difficulty** | ⭐⭐⭐⭐ Advanced |
| **Prerequisites** | Machine Learning (GenAI Engineering recommended) |
| **Key Topics** | GPU fundamentals, Docker, Kubernetes, cloud AI services (AWS SageMaker, GCP Vertex AI, Azure ML), Terraform, CI/CD for ML, model serving (Triton, vLLM), distributed training (DDP, FSDP, DeepSpeed), ML pipelines (Kubeflow, Airflow), monitoring (Prometheus, Grafana), AI security, FinOps, edge AI deployment |
| **Tools** | Docker, Kubernetes, Helm, AWS/GCP/Azure, Terraform, GitHub Actions, MLflow, FastAPI, NVIDIA Triton, vLLM, Kubeflow, Prometheus, Grafana |

---

## Key 2026 Industry Trends Covered

This curriculum was designed and validated against the latest industry developments as of February 2026:

| Trend | Where It's Covered |
|-------|-------------------|
| Reasoning Models (o1/o3, DeepSeek R1) | GenAI Engineering (Wk 2) |
| Small Language Models (SLMs) | GenAI Engineering (Wk 3, 12, 14) |
| Multi-Agent Systems / Swarm | GenAI Engineering (Wk 10, 11) |
| Model Context Protocol (MCP) | GenAI Engineering (Wk 11) |
| Agent-to-Agent Protocol (A2A) | GenAI Engineering (Wk 11) |
| Agentic RAG | GenAI Engineering (Wk 9) |
| Knowledge Graphs (GraphRAG, LightRAG) | GenAI Engineering (Wk 9) |
| AI Coding Assistants (Copilot, Claude Code) | GenAI Engineering (Wk 4) |
| Diffusion Transformers (DiT) | Deep Learning & NLP (Wk 12) |
| Vision Foundation Models (SAM 3, CLIP, DINO) | Computer Vision (Wk 5, 11) |
| EU AI Act (fully applicable Aug 2026) | AI Ethics (Wk 8), GenAI (Wk 13) |
| LLM Observability (LangSmith, Langfuse) | GenAI (Wk 13), Ethics (Wk 5), Cloud (Wk 10) |
| Guardrails Frameworks (NeMo) | GenAI (Wk 13), Ethics (Wk 6) |
| Explainable AI (SHAP, LIME) | ML (Wk 13), Ethics (Wk 4-5) |
| Edge AI / On-Device Deployment | GenAI (Wk 14), CV (Wk 13), Cloud (Wk 13) |
| FinOps for AI | Cloud & AI Infrastructure (Wk 12) |
| Distributed Training (FSDP, DeepSpeed) | Cloud & AI Infrastructure (Wk 8) |
| Kubernetes for AI | Cloud & AI Infrastructure (Wk 3) |

---

## Program Outcomes

Graduates completing the full program will be able to:

| Competency | Coverage |
|---|---|
| **Data & Analytics** | EDA, SQL, visualization, dashboards, statistical analysis, business communication |
| **ML Fundamentals** | Supervised/unsupervised learning, neural networks, model evaluation, feature engineering |
| **Mathematics for AI** | Linear algebra, calculus, probability, statistics, optimization — taught contextually |
| **LLM & Generative AI** | Transformers, reasoning models, tokenization, prompt engineering, fine-tuning, distillation, SLMs |
| **RAG & Knowledge Systems** | Embeddings, vector databases, Agentic RAG, Knowledge Graphs, evaluation |
| **AI Agents & Orchestration** | Tool use, function calling, Swarm pattern, MCP, A2A, multi-agent systems |
| **Deep Learning** | CNNs, RNNs, Transformers, GANs, VAEs, Diffusion Models, Vision Transformers |
| **NLP** | Text classification, NER, QA, summarization, translation, multilingual NLP |
| **Computer Vision** | Detection, segmentation, face analysis, video understanding, 3D vision, OCR |
| **Production Engineering** | Docker, Kubernetes, CI/CD, model serving, distributed training, MLOps, cloud services |
| **Safety & Responsibility** | Bias detection, XAI, guardrails, AI regulation, governance, privacy |
| **Edge & Multimodal AI** | On-device deployment, vision-language models, speech, multimodal pipelines |

---

## Recommended Textbooks

Each course has recommended textbooks and resources to complement the syllabus.

### Course 01: Data Science & AI for Business
- **"Python for Data Analysis"** by Wes McKinney (3rd Ed, 2022) — Pandas creator's guide to data manipulation
- **"Storytelling with Data"** by Cole Nussbaumer Knaflic — Data visualization best practices
- **"Naked Statistics"** by Charles Wheelan — Accessible introduction to statistics
- **"Data Science for Business"** by Foster Provost & Tom Fawcett — Connecting data science to business decisions

### Course 02: Machine Learning
- **"Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow"** by Aurélien Géron (3rd Ed, 2022) — The practical ML bible
- **"An Introduction to Statistical Learning (ISLR)"** by James, Witten, Hastie, Tibshirani (2nd Ed, 2021, free online) — Accessible statistical learning
- **"The Hundred-Page Machine Learning Book"** by Andriy Burkov — Concise ML overview
- **"Pattern Recognition and Machine Learning"** by Christopher Bishop — Deeper mathematical foundations
- **"Mathematics for Machine Learning"** by Deisenroth, Faisal, Ong (free online: mml-book.github.io) — Essential math foundations
- **"Dive into Deep Learning"** by Zhang, Lipton, Li, Smola (free online: d2l.ai) — Interactive, code-first ML and deep learning with runnable examples

### Course 03: Generative AI Engineering
- **"Build a Large Language Model (From Scratch)"** by Sebastian Raschka (2024) — Build GPT from scratch in PyTorch
- **"AI Engineering"** by Chip Huyen (2025) — Building applications with foundation models
- **"Natural Language Processing with Transformers"** by Tunstall, von Werra, Wolf (2022) — Practical Hugging Face guide
- **"Hands-On Large Language Models"** by Jay Alammar & Maarten Grootendorst (2024) — Visual, practical LLM guide
- **"Prompt Engineering for Generative AI"** by James Phoenix & Mike Taylor (2024) — Systematic prompt engineering

### Course 04: Deep Learning & NLP
- **"Deep Learning"** by Goodfellow, Bengio, Courville (free online: deeplearningbook.org) — The deep learning textbook
- **"Speech and Language Processing"** by Jurafsky & Martin (3rd Ed draft, free online: web.stanford.edu/~jurafsky/slp3/) — Definitive NLP textbook, free online draft
- **"Dive into Deep Learning"** by Zhang, Lipton, Li, Smola (free online: d2l.ai) — Interactive, code-first approach; primary free resource for this course

### Course 05: Computer Vision
- **"Computer Vision: Algorithms and Applications"** by Richard Szeliski (2nd Ed, 2022, free online) — Comprehensive CV textbook
- **"Deep Learning for Vision Systems"** by Mohamed Elgendy (2020) — Practical CV with deep learning
- **"Programming Computer Vision with Python"** by Jan Erik Solem — Hands-on CV with Python and OpenCV
- **"Multiple View Geometry in Computer Vision"** by Hartley & Zisserman — For 3D vision (advanced)

### Course 06: AI Ethics, Governance & Explainability
- **"Weapons of Math Destruction"** by Cathy O'Neil — How algorithms can reinforce inequality
- **"Atlas of AI"** by Kate Crawford — Political and social implications of AI
- **"Interpretable Machine Learning"** by Christoph Molnar (free online) — Practical XAI techniques
- **"The Alignment Problem"** by Brian Christian — AI alignment challenges
- **"Artificial Intelligence: A Guide for Thinking Humans"** by Melanie Mitchell — Balanced perspective on AI capabilities

### Course 07: Cloud & AI Infrastructure
- **"Designing Machine Learning Systems"** by Chip Huyen (2022) — Production ML systems design
- **"Kubernetes in Action"** by Marko Lukša (2nd Ed, 2024) — Comprehensive Kubernetes guide
- **"Designing Data-Intensive Applications"** by Martin Kleppmann — Distributed systems fundamentals
- **"Machine Learning Engineering"** by Andriy Burkov (free online) — ML engineering practices
- **"Infrastructure as Code"** by Kief Morris (2nd Ed, 2020) — Terraform and cloud infrastructure

---

## How to Use This Repository

### For Educators
Each course folder contains a detailed `syllabus.md` with:
- Weekly breakdown with specific topics and sub-topics
- "What You'll Build" section for each week (hands-on projects)
- Learning outcomes aligned with industry expectations
- Prerequisites and recommended tools

Feel free to adapt the content to your institution's needs, adjust the difficulty level, or combine/split courses as needed.

### For Self-Learners
Follow the recommended pathway (Semester 1 → 2 → 3, then electives). Each week's topics and projects can guide your self-study. Pair this curriculum with:
- Online courses (Coursera, fast.ai, Hugging Face courses)
- Official documentation for each tool
- Hands-on projects and Kaggle competitions

### For Organizations
Use this as a framework for internal AI training programs. The modular structure allows you to pick specific courses based on team needs (e.g., engineers might skip Course 01 and start with Course 02).

---

## Contributing

Contributions are welcome! If you'd like to:
- Fix errors or update outdated information
- Add course materials (notebooks, slides, exercises)
- Translate to other languages
- Add new elective courses

Please open an issue or submit a pull request.

---

## License

This curriculum is released under the [MIT License](LICENSE). You are free to use, modify, and distribute this material for educational purposes.

---

## Acknowledgments

- Curriculum designed and validated against February 2026 industry trends
- Informed by curricula from Stanford CS229/CS231n/CS224n, MIT, fast.ai, DeepLearning.AI, and Hugging Face
- Industry trends validated through MIT Sloan Management Review, Gartner, Coursera, and Roboflow research

---

<p align="center">
  <i>Built with ❤️ for the AI education community</i>
</p>
