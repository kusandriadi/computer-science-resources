# AI Ethics, Governance & Explainability

**Build AI that is fair, transparent, accountable, and trustworthy**

---

## Course Overview

What happens when an AI denies someone a loan — and nobody can explain why? What happens when a hiring algorithm quietly discriminates against certain groups? These aren't hypothetical questions. They're happening right now.

This course is about making sure AI systems are fair, transparent, and accountable. You'll learn to audit models for bias, explain AI decisions to non-technical people, and navigate the new laws that govern AI (like the EU AI Act, which fully applies in August 2026). This is not a "theory only" course. Every topic is grounded in real case studies, real tools, and real regulatory requirements.

---

## Prerequisites

- Machine Learning (Semester 2) — understanding of model training and evaluation
- Generative AI Engineering (Semester 3) recommended

### Self-Check: Am I Ready?

Before starting this course, make sure you can:
- [ ] Explain what an AI/ML model does (it learns patterns from data to make decisions or predictions)
- [ ] Give one example of AI being used in everyday life (e.g., recommendation systems, voice assistants)
- [ ] Understand what "training data" is and why it matters
- [ ] Describe what "bias" means in everyday language (unfair preference for or against something)
- [ ] Read a news article about technology and summarize the key points

If you can't check all boxes, don't worry! Week 0 covers these foundations.

## Tools & Technologies

SHAP, LIME, AIF360 (IBM Fairness Toolkit), Fairlearn (Microsoft), What-If Tool (Google), NeMo Guardrails, Guardrails AI, LangSmith/Langfuse, Model Cards Toolkit

---

## Weekly Schedule

---

### Week 0: Why Ethics in AI Matters

*Welcome! This week sets the stage with real stories about AI going wrong — and why you, as a future AI practitioner, should care.*

**Topics:**
- Real-world AI failures that made headlines (brief case studies: biased hiring tools, wrongful arrests from face recognition, chatbots gone rogue)
- What is bias? Simple everyday examples (e.g., a search engine showing different results for different groups)
- Quick overview: what AI can and cannot do (setting realistic expectations)
- No coding needed for this course's first few weeks — we start with ideas, not code

**What You'll Build:**
- Find and discuss one recent news article about an AI failure or controversy
- Write a short reflection: "What could go wrong if AI is used for [topic you care about]?"

---

### Week 1: Why AI Ethics Matters — Now More Than Ever

**Topics:**
- The urgency: AI is making decisions about hiring, lending, healthcare, criminal justice, and education
- Historical failures: Amazon's biased hiring AI, COMPAS recidivism prediction, Google Photos image labeling
- The trust problem: 95% of AI investments show zero return (MIT 2026) — ethics failures are business failures
- Key ethical principles:
  - Beneficence (do good)
  - Non-maleficence (do no harm)
  - Autonomy (respect human choice)
  - Justice (be fair)
  - Explicability (be transparent and explainable)
- Stakeholder analysis: who is affected by an AI system? (users, subjects, society, environment)
- The ethical AI engineer: responsibility doesn't end at model accuracy
- Philosophy crash course — frameworks for thinking about right and wrong:
  - Utilitarianism: greatest good for the greatest number
  - Deontology: follow the rules regardless of outcome
  - Virtue ethics: what would a good person do?

**What You'll Build:**
- Analyze 3 real-world AI failure case studies and identify ethical violations
- Create a stakeholder impact assessment for an AI system

---

### Week 2: Bias in AI — Where It Comes From and How to Find It

**Topics:**
- Types of bias in AI systems — and there are more than you'd expect:
  - Data bias (problems in the data itself):
    - Sampling bias (your data doesn't represent everyone)
    - Historical bias (past unfairness baked into data)
    - Representation bias (some groups are missing or underrepresented)
    - Measurement bias (the way you collect data introduces errors)
    - Label bias (the labels themselves reflect human prejudice)
  - Algorithmic bias: the model amplifies data bias, uses proxy variables, or creates feedback loops
  - Deployment bias: how context changes fairness properties
- Fairness definitions (and why they can conflict):
  - Demographic parity (equal approval rates across groups): equal positive prediction rates across groups
  - Equalized odds (equal accuracy across groups): equal true positive and false positive rates
  - Individual fairness: similar individuals should receive similar outcomes
  - Counterfactual fairness: would the decision change if the sensitive attribute (e.g., gender, race) changed?
  - The impossibility theorem: you can't satisfy all fairness metrics simultaneously (a key insight!)
- Intersectionality (how biases combine): bias across combined attributes (race × gender × age)
- Measuring bias: disparate impact ratio, statistical parity difference, equalized odds difference

**What You'll Build:**
- Audit a real model for bias using IBM AIF360 and Microsoft Fairlearn
- Measure bias across multiple fairness metrics and document the tradeoffs
- Create a bias audit report with findings and mitigation recommendations

---

### Week 3: Bias Mitigation — Making AI More Fair

*Why this matters: Finding bias is important, but fixing it is what actually helps people. This week gives you practical techniques to make AI systems fairer.*

**Topics:**
- Pre-processing techniques (fix the data before training): reweighting, resampling, disparate impact remover, data augmentation
- In-processing techniques (fix during training): adversarial debiasing, prejudice remover, fairness constraints
- Post-processing techniques (fix after training): calibrated equalized odds, reject option classification, threshold adjustment
- The tradeoff: accuracy vs fairness — is some accuracy loss acceptable for fairness?
- Fairness in generative AI: bias in LLMs, image generation stereotypes, representation in training data
- Bias in embeddings: word2vec gender bias, visual stereotype amplification
- Testing for bias in LLMs: red-teaming for discriminatory outputs
- Continuous monitoring: bias can drift as data and populations change

**What You'll Build:**
- Apply pre-processing, in-processing, and post-processing debiasing to the same model and compare results
- Red-team an LLM for biased responses across demographics
- Design a continuous bias monitoring pipeline

---

### Week 4: Explainable AI (XAI) — Opening the Black Box

**Topics:**
- Why explainability matters: trust, debugging, regulatory compliance, scientific understanding
- Interpretable models vs post-hoc explanations:
  - Interpretable by design: linear regression, decision trees, rule-based systems, GAMs
  - Post-hoc explanation methods: applied to any model after training
- SHAP (SHapley Additive exPlanations — a way to see which features most influenced a prediction):
  - Game theory foundation: Shapley values — fairly measuring each feature's contribution
  - TreeSHAP, KernelSHAP, DeepSHAP — variants for different model types
  - SHAP visualizations: summary plots, dependence plots, force plots, waterfall plots
- LIME (Local Interpretable Model-agnostic Explanations — explaining individual predictions by testing small changes):
  - Perturbing inputs (slightly changing the input to see what happens) and fitting local linear models
  - Explaining individual predictions
  - LIME for text, images, and tabular data
- Other XAI methods:
  - Counterfactual explanations: "your loan would have been approved if your income was $X higher"
  - Integrated Gradients: attribution for neural networks
  - Attention visualization: where is the model "looking"?
  - Concept-based explanations: TCAV (Testing with Concept Activation Vectors)

**What You'll Build:**
- Generate SHAP explanations for a classification model and analyze feature contributions
- Create LIME explanations for text, image, and tabular predictions
- Build counterfactual explanations for a lending model

---

### Week 5: Explainability for LLMs and Generative AI

**Topics:**
- The unique challenge: LLMs are the largest "black boxes" ever built
- Prompt-based explanations: asking the model to explain its reasoning (chain-of-thought)
- Attention analysis: which tokens influence which outputs?
- Mechanistic interpretability (looking inside the model to understand how it "thinks"): understanding internal representations (probing, circuit analysis)
- Hallucination as an explainability problem: why does the model confidently state falsehoods?
- Explainability in RAG systems: citation, source attribution, confidence scores
- LLM Observability as explainability:
  - LangSmith, Langfuse: tracing the decision path of AI agents
  - Arize Phoenix: debugging retrieval quality and generation accuracy
  - OpenTelemetry for AI: distributed tracing across agent workflows
- Explainability requirements in the EU AI Act: what the law requires

**What You'll Build:**
- Set up an LLM observability pipeline with Langfuse: trace prompts, retrievals, and generations
- Analyze attention patterns in a Transformer model
- Build an explainable RAG system with source citations and confidence scores

---

### Week 6: AI Safety — Attacks, Defenses & Guardrails

*Why this matters: People will try to break your AI. They'll trick it, manipulate it, and use it in ways you never intended. This week teaches you how to defend against these attacks.*

**Topics:**
- Adversarial attacks on ML models:
  - Evasion attacks: fooling classifiers with imperceptible perturbations (FGSM, PGD)
  - Poisoning attacks: corrupting training data
  - Backdoor attacks: hidden triggers in models
  - Model stealing: extracting model parameters through API queries
- LLM-specific attacks:
  - Direct prompt injection: manipulating model behavior through user input
  - Indirect prompt injection: hidden instructions in retrieved documents
  - Jailbreaking: bypassing safety filters
  - Data extraction: extracting training data from models
- Defense strategies:
  - Input validation and sanitization
  - Output filtering and validation
  - Instruction hierarchy: system prompts > user input
  - Adversarial training: training on adversarial examples
- Guardrails frameworks:
  - NVIDIA NeMo Guardrails: programmable input/output/topical rails
  - Guardrails AI: validators for structure, toxicity, PII, hallucination
  - Building layered safety: input → processing → output validation
- Red teaming: systematic adversarial testing of AI systems

**What You'll Build:**
- Generate adversarial examples against an image classifier
- Implement NeMo Guardrails for an LLM application
- Conduct a structured red-team exercise against an AI chatbot

---

### Week 7: Midterm Exam

Covers Weeks 1-6: bias, fairness, XAI (SHAP, LIME), LLM explainability, adversarial attacks, and guardrails.

---

### Week 8: The Global AI Regulatory Landscape

*Why this matters: AI regulation is no longer "coming someday." The EU AI Act applies in 2026, with real penalties for non-compliance. As an AI engineer, you need to know the rules.*

**Topics:**
- EU AI Act — the world's first comprehensive AI regulation:
  - Risk classification: unacceptable, high-risk, limited risk, minimal risk
  - Prohibited AI practices: social scoring, emotion recognition in workplaces, mass surveillance
  - High-risk AI obligations: risk assessments, documentation, human oversight, transparency
  - GPAI (General Purpose AI) model obligations: training data transparency, copyright compliance
  - AI-generated content labeling requirements
  - Timeline: prohibitions (Feb 2025) → GPAI rules (Aug 2025) → full application (Aug 2026) → high-risk embedded (Aug 2027)
  - Penalties: up to €35M or 7% of global annual turnover
- Global regulatory approaches:
  - United States: executive orders, sector-specific approach, NIST AI Risk Management Framework
  - United Kingdom: pro-innovation, regulator-led approach (no single AI law yet as of 2026)
  - China: comprehensive AI regulations, algorithmic transparency requirements
  - Southeast Asia: emerging frameworks (Singapore's Model AI Governance, Indonesia's draft AI regulation)
  - The "Brussels Effect": how EU regulations influence global standards
- Industry-specific regulations: healthcare (FDA AI/ML), finance (SR 11-7), autonomous vehicles

**What You'll Build:**
- Classify 10 AI systems according to the EU AI Act risk categories
- Write a compliance assessment for a high-risk AI application
- Map the regulatory requirements for an AI product deployed globally

---

### Week 9: AI Governance in Practice

**Topics:**
- What is AI governance: the organizational framework for responsible AI development and deployment. Think of it as the rules and processes an organization follows to use AI responsibly
- AI governance frameworks:
  - NIST AI Risk Management Framework (RMF): Map, Measure, Manage, Govern
  - ISO/IEC 42001: AI Management System standard
  - Gartner AI TRiSM: AI Trust, Risk, and Security Management
  - OECD AI Principles
- Building an AI governance program — the practical steps:
  - AI inventory: catalog all AI systems in your organization
  - Risk assessment: evaluate each system's risk level
  - Roles and responsibilities: AI ethics board, AI officer, model owners
  - Policies and procedures: development guidelines, approval processes, incident response
- Documentation requirements:
  - Model cards: standardized model documentation (purpose, limitations, performance, fairness)
  - Data sheets for datasets: documenting data provenance, composition, collection process
  - AI impact assessments: evaluating societal impact before deployment
- Governance automation: tools for monitoring, auditing, and reporting at scale (ModelOp, Credo AI)
- The Chief AI Officer role: emerging leadership in AI governance

**What You'll Build:**
- Create a model card for an AI system following best practices
- Design an AI governance framework for a fictional organization
- Write an AI impact assessment for a high-risk application

---

### Week 10: Privacy, Data Rights & Consent

*Why this matters: AI models are trained on data, and that data often comes from real people. This week covers how to protect privacy while still building useful AI systems.*

**Topics:**
- Privacy in the age of AI: how AI amplifies privacy risks
- GDPR and AI:
  - Right to explanation: when automated decisions significantly affect individuals
  - Right to be forgotten: implications for trained models
  - Data minimization: only collect what's necessary
  - Purpose limitation: don't reuse data for undisclosed purposes
  - Data Protection Impact Assessments (DPIAs) for AI
- Privacy-preserving AI techniques:
  - Differential privacy (adding carefully calibrated noise so no individual's data can be identified)
  - Federated learning (training AI on data spread across many devices, without collecting it in one place)
  - Homomorphic encryption (running calculations on encrypted data without ever decrypting it)
  - Synthetic data generation: creating privacy-safe training data
- Data rights for AI training: the EU AI Act's training data transparency requirements
- Copyright and AI: the evolving legal landscape for AI-generated content
- Consent in AI: meaningful consent for data collection and AI-based decision-making
- Indonesia's PDP Law: Personal Data Protection implications for AI development

**What You'll Build:**
- Implement differential privacy in a model training pipeline
- Design a privacy-preserving AI architecture using federated learning concepts
- Write a DPIA for an AI application processing personal data

---

### Week 11: Responsible Generative AI

*Why this matters: Generative AI can create text, images, and video that look completely real. This power comes with serious risks — from misinformation to copyright violations. This week teaches you how to handle them.*

**Topics:**
- Unique challenges of generative AI: hallucination, deepfakes, misinformation, copyright infringement
- Content authenticity:
  - AI-generated content labeling (EU AI Act requirement)
  - C2PA (Coalition for Content Provenance and Authenticity): digital watermarking (invisible marks proving where content came from)
  - Deepfake detection: technical approaches and limitations
- Misinformation and manipulation:
  - AI-generated text detection: current methods and their limitations
  - Election integrity: preventing AI-enabled disinformation
  - Synthetic media policies across platforms
- Copyright and intellectual property:
  - Training data copyright disputes (NYT v. OpenAI, Getty v. Stability AI)
  - Who owns AI-generated content?
  - Copyright opt-out mechanisms and the EU AI Act
- Environmental impact of AI:
  - Energy consumption of training and inference
  - Carbon footprint of large models
  - Strategies for sustainable AI: efficient architectures, green computing
- Responsible use policies: terms of service, acceptable use policies, content moderation

**What You'll Build:**
- Build a simple AI-generated content detection system
- Write a responsible AI use policy for a generative AI product
- Calculate the carbon footprint of training and deploying a model

---

### Week 12: AI & Society — High-Stakes Domains

**Topics:**
- AI in healthcare:
  - Diagnostic AI: radiology, pathology, dermatology
  - FDA regulatory pathway for AI/ML medical devices
  - Challenges: data quality, generalization, clinician trust, liability
- AI in criminal justice:
  - Predictive policing: effectiveness claims vs discrimination evidence
  - Risk assessment tools: COMPAS and its critics
  - Facial recognition in law enforcement: bans and restrictions
- AI in finance:
  - Credit scoring: algorithmic fairness in lending
  - Algorithmic trading: market manipulation risks
  - Anti-money laundering AI: regulatory expectations
- AI in education:
  - AI tutoring and personalized learning
  - Academic integrity: AI-generated content and plagiarism
  - Surveillance concerns: proctoring AI, behavioral monitoring
- AI in employment:
  - Automated resume screening: bias risks (EU AI Act classifies as high-risk)
  - Worker surveillance: productivity monitoring, emotion detection
  - Gig economy algorithms: algorithmic management and worker rights
- The displacement question: how AI changes the labor market

**What You'll Build:**
- Deep case study analysis: pick one domain and assess the ethical implications of AI deployment
- Design an ethical framework for AI in your chosen domain
- Present findings and recommendations to the class

---

### Week 13: The Future of Responsible AI

**Topics:**
- AI alignment: ensuring AI systems do what humans intend
  - The alignment problem: specification, robustness, assurance
  - Reward hacking: when AI optimizes the metric but not the intent
  - Constitutional AI: teaching AI values through principles
- AI consciousness and moral status: philosophical questions as AI becomes more capable
- AGI safety: what happens when AI systems become generally intelligent?
  - Existential risk arguments and counter-arguments
  - Alignment research: current approaches and open problems
- The AI governance gap: technology moves faster than regulation
- Open source vs closed source: implications for safety and access
- Global AI cooperation: is international coordination possible?
- The role of AI engineers in shaping the future: you are not just building tools. You are building the future

**What You'll Build:**
- Write a position paper on an open question in AI ethics (e.g., "Should AI have rights?", "Is open-source AI safer?", "Can we align AGI?")
- Participate in a structured debate on a contentious AI policy issue

---

### Week 14: Capstone — Building an Ethical AI System

**Topics:**
- Putting it all together: building an AI system with ethics, governance, and explainability baked in from the start
- Requirements: fairness audit, explainability implementation, governance documentation, regulatory compliance assessment

**What You'll Build:**
- Build an AI application with:
  - Bias auditing and mitigation
  - SHAP/LIME explainability
  - Guardrails implementation
  - Model card and documentation
  - Regulatory compliance checklist (EU AI Act)
  - Privacy impact assessment

---

### Week 15: Capstone Demo

Students present their ethical AI system. Peer review, instructor feedback, and class discussion on remaining challenges.

---

### Week 16: Final Exam

Comprehensive exam covering all course material. Topics include bias, fairness, XAI, safety, regulation, governance, privacy, responsible AI, and societal impact.

---

## Learning Outcomes

By the end of this course, students will be able to:

1. Identify and measure bias in AI systems using multiple fairness metrics
2. Apply pre-processing, in-processing, and post-processing debiasing techniques
3. Implement XAI methods (SHAP, LIME, counterfactuals) for any model type
4. Set up LLM observability and tracing pipelines for explainability
5. Conduct red-team exercises and implement safety guardrails (NeMo, Guardrails AI)
6. Navigate the EU AI Act and global regulatory landscape for AI compliance
7. Design and implement AI governance frameworks for organizations
8. Apply privacy-preserving techniques: differential privacy, federated learning, synthetic data
9. Evaluate the ethical implications of AI in high-stakes domains
10. Document AI systems responsibly: model cards, data sheets, impact assessments
11. Articulate informed positions on open questions in AI ethics, alignment, and governance
