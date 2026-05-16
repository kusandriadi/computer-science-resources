---
marp: true
theme: default
paginate: true
header: 'AI Engineering Syllabus'
footer: 'cs.kusandriadi.com'
---

# AI Ethics, Governance & Explainability

**Build AI that is fair, transparent, accountable, and trustworthy**

- Audience: Students who completed Machine Learning
- Generative AI Engineering recommended
- Grounded in real case studies, real tools, and real regulatory requirements

---

# Course Overview

- What happens when an AI denies someone a loan and nobody can explain why?
- What happens when a hiring algorithm quietly discriminates?
- These aren't hypothetical -- they're happening right now
- Learn to audit models for bias, explain decisions, and navigate AI laws
- The EU AI Act fully applies in August 2026, with real penalties for non-compliance

---

# Prerequisites & Self-Check

**Prerequisites:** Machine Learning (model training and evaluation)

**Can you:**
- [ ] Explain what an AI/ML model does?
- [ ] Give one example of AI used in everyday life?
- [ ] Understand what "training data" is and why it matters?
- [ ] Describe what "bias" means in everyday language?
- [ ] Read a tech news article and summarize key points?

If not, Week 0 has you covered!

---

# Tools & Technologies

- **Explainability:** SHAP, LIME
- **Fairness:** AIF360 (IBM), Fairlearn (Microsoft), What-If Tool (Google)
- **Safety:** NeMo Guardrails, Guardrails AI
- **Observability:** LangSmith, Langfuse
- **Documentation:** Model Cards Toolkit

---

# Week 0: Why Ethics in AI Matters

*Real stories about AI going wrong -- and why you should care.*

- Real-world AI failures: biased hiring tools, wrongful arrests from face recognition, chatbots gone rogue
- What is bias? Simple everyday examples
- Quick overview: what AI can and cannot do (setting realistic expectations)
- No coding needed for the first few weeks -- we start with ideas

**What You'll Build:**
- Find and discuss a recent news article about an AI failure
- Write a reflection: "What could go wrong if AI is used for [topic you care about]?"

---

# Week 1: Why AI Ethics Matters -- Now More Than Ever

- The urgency: AI decides on hiring, lending, healthcare, criminal justice, education
- Historical failures: Amazon's biased hiring AI, COMPAS recidivism, Google Photos labeling
- The trust problem: 95% of AI investments show zero return -- ethics failures are business failures
- Key principles: beneficence, non-maleficence, autonomy, justice, explicability
- Philosophy: utilitarianism, deontology, virtue ethics

**What You'll Build:**
- Analyze 3 real-world AI failure case studies and identify ethical violations
- Create a stakeholder impact assessment for an AI system

---

# Week 2: Bias in AI -- Where It Comes From

- **Data bias:** sampling, historical, representation, measurement, label bias
- **Algorithmic bias:** amplification, proxy variables, feedback loops
- **Deployment bias:** context changes fairness properties
- Fairness definitions: demographic parity, equalized odds, individual fairness, counterfactual fairness
- The impossibility theorem: you can't satisfy all fairness metrics simultaneously

**What You'll Build:**
- Audit a real model for bias using IBM AIF360 and Microsoft Fairlearn
- Create a bias audit report with findings and mitigation recommendations

---

# Week 3: Bias Mitigation -- Making AI More Fair

*Finding bias is important, but fixing it is what actually helps people.*

- Pre-processing (fix the data): reweighting, resampling, disparate impact remover
- In-processing (fix during training): adversarial debiasing, fairness constraints
- Post-processing (fix after training): calibrated equalized odds, threshold adjustment
- The tradeoff: accuracy vs fairness -- is some accuracy loss acceptable?
- Bias in generative AI: LLM bias, image stereotypes, embedding bias (word2vec)

**What You'll Build:**
- Apply all three debiasing approaches to the same model and compare
- Red-team an LLM for biased responses across demographics

---

# Week 4: Explainable AI (XAI) -- Opening the Black Box

- Why explainability matters: trust, debugging, regulatory compliance
- SHAP (SHapley Additive exPlanations -- which features most influenced a prediction)
  - Game theory foundation, TreeSHAP, KernelSHAP, DeepSHAP
- LIME (Local Interpretable Model-agnostic Explanations -- explaining individual predictions)
  - Perturbing inputs, fitting local linear models
- Counterfactual explanations: "your loan would have been approved if..."
- Concept-based explanations: TCAV (Testing with Concept Activation Vectors)

**What You'll Build:**
- Generate SHAP and LIME explanations for text, image, and tabular data
- Build counterfactual explanations for a lending model

---

# Week 5: Explainability for LLMs and Generative AI

- The unique challenge: LLMs are the largest "black boxes" ever built
- Prompt-based explanations: asking the model to explain (chain-of-thought)
- Attention analysis: which tokens influence which outputs?
- Mechanistic interpretability (looking inside the model to understand how it "thinks")
- LLM Observability: LangSmith, Langfuse, Arize Phoenix, OpenTelemetry for AI
- Explainability requirements in the EU AI Act

**What You'll Build:**
- Set up LLM observability with Langfuse: trace prompts, retrievals, generations
- Build an explainable RAG system with source citations and confidence scores

---

# Week 6: AI Safety -- Attacks, Defenses & Guardrails

*People will try to break your AI. This week teaches you how to defend against it.*

- Adversarial attacks: evasion (FGSM, PGD), poisoning, backdoor, model stealing
- LLM attacks: direct/indirect prompt injection, jailbreaking, data extraction
- Defense strategies: input validation, output filtering, instruction hierarchy
- Guardrails: NeMo Guardrails (input/output/topical rails), Guardrails AI (validators)
- Red teaming: systematic adversarial testing of AI systems

**What You'll Build:**
- Generate adversarial examples against an image classifier
- Implement NeMo Guardrails and conduct a structured red-team exercise

---

# Week 7: Midterm Exam

- Covers Weeks 1-6
- Bias and fairness (definitions, metrics, mitigation)
- Explainable AI (SHAP, LIME, counterfactuals)
- LLM explainability and observability
- Adversarial attacks and guardrails
- Red teaming

---

# Week 8: The Global AI Regulatory Landscape

*The EU AI Act applies in 2026 with real penalties. You need to know the rules.*

- **EU AI Act:** risk classification (unacceptable, high, limited, minimal risk)
  - Prohibited practices: social scoring, emotion recognition in workplaces, mass surveillance
  - Penalties: up to 35M EUR or 7% of global annual turnover
- **Global approaches:** US (NIST RMF), UK (pro-innovation), China (comprehensive), Southeast Asia
- The "Brussels Effect": how EU regulations influence global standards
- Industry-specific: healthcare (FDA), finance (SR 11-7), autonomous vehicles

**What You'll Build:**
- Classify 10 AI systems according to EU AI Act risk categories
- Write a compliance assessment for a high-risk AI application

---

# Week 9: AI Governance in Practice

- AI governance: organizational framework for responsible AI development
- Frameworks: NIST AI RMF (Map, Measure, Manage, Govern), ISO/IEC 42001, OECD AI Principles
- Building a program: AI inventory, risk assessment, roles (AI ethics board, AI officer)
- Documentation: model cards, data sheets, AI impact assessments
- Governance automation: tools for monitoring, auditing, reporting at scale

**What You'll Build:**
- Create a model card following best practices
- Design an AI governance framework for a fictional organization

---

# Week 10: Privacy, Data Rights & Consent

*AI models are trained on data from real people. How do we protect privacy?*

- GDPR and AI: right to explanation, right to be forgotten, data minimization
- Privacy-preserving techniques:
  - Differential privacy (adding noise so individuals can't be identified)
  - Federated learning (training across devices without collecting data centrally)
  - Homomorphic encryption (computing on encrypted data)
- Copyright and AI: the evolving legal landscape
- Indonesia's PDP Law and implications for AI

**What You'll Build:**
- Implement differential privacy in a model training pipeline
- Write a DPIA (Data Protection Impact Assessment) for an AI application

---

# Week 11: Responsible Generative AI

*Generative AI creates text, images, and video that look real. This power carries serious risks.*

- Content authenticity: C2PA digital watermarking, AI-generated content labeling (EU requirement)
- Deepfake detection: technical approaches and limitations
- Misinformation: AI-generated text detection, election integrity
- Copyright disputes: NYT v. OpenAI, Getty v. Stability AI, who owns AI-generated content?
- Environmental impact: energy consumption, carbon footprint, strategies for sustainable AI

**What You'll Build:**
- Build an AI-generated content detection system
- Calculate the carbon footprint of training and deploying a model

---

# Week 12: AI & Society -- High-Stakes Domains

- **Healthcare:** diagnostic AI, FDA pathway, clinician trust, liability
- **Criminal justice:** predictive policing, COMPAS, facial recognition bans
- **Finance:** credit scoring fairness, algorithmic trading, anti-money laundering
- **Education:** AI tutoring, academic integrity, surveillance concerns
- **Employment:** automated resume screening (EU high-risk), worker surveillance
- The displacement question: how AI changes the labor market

**What You'll Build:**
- Deep case study: assess ethical implications of AI in your chosen domain
- Design an ethical framework and present findings

---

# Week 13: The Future of Responsible AI

- AI alignment: ensuring AI does what humans intend
  - The alignment problem, reward hacking, Constitutional AI
- AI consciousness and moral status: philosophical questions
- AGI safety: existential risk arguments and counter-arguments
- The governance gap: technology moves faster than regulation
- Open source vs closed source: implications for safety and access
- Your role: you are not just building tools, you are building the future

**What You'll Build:**
- Write a position paper on an open question in AI ethics
- Participate in a structured debate on a contentious AI policy issue

---

# Week 14: Capstone -- Building an Ethical AI System

- Putting it all together: ethics, governance, and explainability baked in from the start
- **Requirements for the system you'll build:**
  - Bias auditing and mitigation
  - SHAP/LIME explainability
  - Guardrails implementation
  - Model card and documentation
  - EU AI Act compliance checklist
  - Privacy impact assessment

---

# Week 15: Capstone Demo

- Students present their ethical AI system
- Peer review, instructor feedback
- Class discussion on remaining challenges in AI ethics

---

# Week 16: Final Exam

- Comprehensive exam covering all material:
  - Bias, fairness, and mitigation
  - XAI (SHAP, LIME) and LLM explainability
  - AI safety, attacks, and guardrails
  - Regulation (EU AI Act) and governance
  - Privacy, responsible generative AI, and societal impact

---

# Recommended Resources

- **Weapons of Math Destruction** -- Cathy O'Neil
- **Atlas of AI** -- Kate Crawford
- **Interpretable Machine Learning** -- Christoph Molnar (free online)
- **The Alignment Problem** -- Brian Christian
- **AI Ethics** -- Mark Coeckelbergh
