---
marp: true
theme: default
paginate: true
header: 'LLM Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 7 -- Evaluation, Interpretability, and Safety

**Most benchmark numbers you see are misleading.** Not necessarily wrong, but presented in ways that overstate real-world differences. What you can't measure, you can't improve -- but what you measure badly, you improve in the wrong direction.

---

# Why This Matters

- Trustworthy evaluation is one of the most underrated skills in ML engineering
- Public benchmarks are at best noisy proxies for your production needs
- Interpretability is the only credible path to verifying internal alignment
- Red-teaming finds failure modes before your users do

---

# 7.1 The Taxonomy of Evals

Three axes to classify any evaluation:

| Axis | Options |
|------|---------|
| **Capability vs. Behavior** | Can the model do X? vs. Does it do X? |
| **Reference-based vs. Reference-free** | Compare to ground truth vs. score with rubric/judge |
| **Static vs. Dynamic** | Fixed dataset vs. adversarial/runtime-sampled |

Most public benchmarks: static, reference-based capability tests.
Most production needs: dynamic, reference-free behavior tests.

---

# 7.2 Canonical Benchmarks

**General knowledge / reasoning:**
- **MMLU / MMLU-Pro**: 57 academic subjects (MCQ). Saturated at top; Pro is harder.
- **GPQA Diamond**: graduate-level science MCQ; hard for humans.
- **HLE (Humanity's Last Exam)**: designed to be hard for frontier models.

**Math:**
- **GSM8K**: grade-school word problems (saturated at frontier)
- **MATH**: competition problems (saturated by reasoning models)
- **AIME / Olympiad-level**: now the meaningful tier

---

# More Benchmarks

**Code:**
- **HumanEval / MBPP**: small programs from docstrings (saturated)
- **SWE-bench Verified**: real GitHub issues -- meaningful for coding agents
- **LiveCodeBench**: refreshed regularly to fight contamination

**Long context:** Needle-in-Haystack, RULER, LongBench-v2

**Agents:** WebArena, GAIA, tau-bench

**Safety:** HarmBench, AdvBench, ToxiGen, TruthfulQA

---

# 7.3 How Benchmarks Mislead

Read every benchmark number assuming at least one of these is happening:

- **Contamination** -- eval is in the training data (directly or in paraphrase)
- **Prompt sensitivity** -- numbers move 5-15 points with prompt tweaks
- **Format-bound results** -- MCQ scores reflect ability to produce A/B/C/D
- **Cherry-picked subsets** -- "X% on coding" on a curated 50-problem subset
- **Self-consistency inflation** -- "94% MATH" with N=64 majority voting (expensive!)
- **Pass@k inflation** -- pass@10 or pass@100 inflates dramatically
- **Judge bias** -- LLM-as-judge bakes in length, style, and similar-model preferences
- **Benchmark overfitting** -- post-training on benchmark-like data

---

# 7.4 Designing Your Own Eval

A reasonable starting recipe:

1. **Collect ~100-500 real inputs** from your actual use case
2. **Decide scoring**: exact/fuzzy match, unit tests, LLM-as-judge with rubric, human eval
3. **Compute confidence intervals** (~100 examples + binary metric = +/-5 pp noise)
4. **Run on multiple models, multiple seeds**
5. **Make it easy to look at outputs** (Inspect, Promptfoo, langfuse)
6. **Version everything** -- don't compare scores across versions silently

> **The biggest mistake:** not looking at outputs. Read a sample of failures by hand. You'll discover the metric measures something other than what you wanted.

---

# 7.5 Mechanistic Interpretability

**Goal:** Reverse-engineer specific algorithms inside the network.

- **Circuits**: small subgraphs implementing a single computation (Indirect Object Identification, Induction Heads)
- **Features**: directions in activation space corresponding to interpretable concepts
- **Sparse autoencoders (SAEs)**: find tens of thousands of "monosemantic" features in the residual stream
- **Causal interventions**: activation patching to localize which components matter

---

# Interpretability: Why It Matters for Safety

- **Linear probes** detect when the model "knows" some property
- **Steering**: add a feature direction to the residual stream to change behavior
- A model can pass every behavioral test and still have learned a different goal
- Interpretability is the only credible path to verifying **internal alignment** vs. surface compliance

> Still pre-paradigmatic, but advancing rapidly (Anthropic, OpenAI, DeepMind programs on SAEs at frontier scale).

---

# 7.6 Red-Teaming and Adversarial Robustness

**Jailbreaking** categories:
- **Role-play exploits**: "Pretend you're DAN..."
- **Encoding tricks**: base64, leetspeak, low-resource languages
- **Prompt injection**: malicious instructions in retrieved content or tool outputs
- **Multi-turn manipulation**: gradual norm shifts across a conversation
- **Persona / hypothetical framing**: "in a story...", "for educational purposes..."

**Automated red-teaming**: attacker LLM generates jailbreaks; evaluate with judge. Beats humans on coverage.

---

# Capability Evals and Subtle Concerns

**Dangerous knowledge evals** (bio, cyber, chem, nuclear):
- Frontier labs run these before release
- Threshold: does the model provide meaningful uplift to malicious actors beyond existing resources?

**Subtler concerns:**
- **Sycophancy**: telling users what they want to hear
- **Deception**: behaving differently when it thinks it's being evaluated
- **Situational awareness**: early-stage research areas

---

# 7.7 The Honest Summary

For a new model:
1. Run a portfolio of public benchmarks (with contamination awareness)
2. Run task-specific evals matching your deployment
3. Look at failures by hand
4. Compute confidence intervals; don't over-interpret 1-point differences
5. Run safety and red-team evals
6. Track regressions across model versions

For research: publish per-task numbers, prompts, eval code, seeds, and confidence intervals.

---

# Key Papers

| Paper | Contribution |
|-------|-------------|
| Liang et al. 2022 | *HELM* -- holistic eval framework |
| Zheng et al. 2023 | *MT-Bench / LLM-as-Judge* |
| Olsson et al. 2022 | *Induction Heads* |
| Bricken et al. 2023 | *Towards Monosemanticity (SAEs)* |
| Templeton et al. 2024 | *Scaling Monosemanticity* |
| Perez et al. 2022 | *Red Teaming LMs with LMs* |

---

# Exercises

1. Run a model with three different prompt formats on a benchmark you care about. Measure variance vs. model-to-model differences.
2. Build a tiny LLM-as-judge eval for a task with ~50 prompts. Calibrate against 5 human-labeled examples.
3. Train a sparse autoencoder on a small model's residual stream activations. Identify interpretable features.
4. Reproduce a few jailbreak examples from HarmBench. Try mitigations.
