# Module 7 — Evaluation, Interpretability, and Safety

Let's be blunt: most benchmark numbers you see on Twitter or in model announcements are misleading. Not necessarily wrong, but presented in ways that overstate real-world differences. What you can't measure, you can't improve -- but what you measure badly, you improve in the wrong direction. This module is about reading and producing trustworthy evals, which is one of the most underrated skills in ML engineering.

## Learning goals

- Read benchmark numbers skeptically and explain common ways they mislead
- Design a task-specific eval that actually correlates with what you care about
- Understand the basic toolkit of mechanistic interpretability
- Explain red-teaming and the major failure modes it targets

## 7.1 The taxonomy of evals

Three useful axes:

- **Capability vs. behavior**. Capability = can the model do X (translate, prove, reason)? Behavior = does the model do X (refuse, hedge, comply, format)?
- **Reference-based vs. reference-free**. Compare to a ground truth answer vs. score with a rubric/judge/verifier.
- **Static vs. dynamic**. Fixed dataset vs. adversarial/sampled-at-runtime.

Most public benchmarks are static, reference-based capability tests. Most production needs are dynamic, reference-free behavior tests.

## 7.2 Canonical benchmarks (and what they actually measure)

Before diving into the list, a word of context: benchmarks exist because we need *some* way to compare models, but every benchmark is a simplification. The ones below are what you will see on model cards and leaderboards. For each, it helps to know not just what it tests but where it breaks down.

**General knowledge / reasoning**
- **MMLU / MMLU-Pro**: multiple-choice across 57 academic subjects. Saturated at the top; MMLU-Pro is a harder rebuild.
- **GPQA Diamond**: graduate-level science MCQ; hard for humans. Robust signal of frontier capability.
- **HLE (Humanity's Last Exam)**: explicitly designed to be hard for frontier models.
- **BIG-Bench Hard / BBH**: a curated subset of BIG-Bench tasks that resisted scaling.

**Math**
- **GSM8K**: grade-school word problems. Saturated at frontier.
- **MATH**: competition problems. Saturated by reasoning models.
- **AIME / Olympiad-level**: now the meaningful tier.
- **PutnamBench**: lean-formalized competition problems.

**Code**
- **HumanEval / MBPP**: small programs from docstrings. Saturated.
- **SWE-bench / SWE-bench Verified**: real GitHub issues from popular Python repos. Currently a meaningful signal for coding agents.
- **LiveCodeBench**: contest problems, refreshed regularly to fight contamination.

**Long context**
- **Needle in a Haystack**: trivial retrieval; necessary but not sufficient.
- **RULER**: structured long-context tasks.
- **Loong, LongBench-v2**: multi-document reasoning.

**Agents**
- **WebArena**, **VisualWebArena**: realistic web navigation tasks.
- **GAIA**: general AI assistant tasks.
- **τ-bench**: customer service / tool use.

**Multimodal**
- **MMMU**: multi-discipline images + text.
- **MathVista**, **ChartQA**: visual reasoning.

**Safety**
- **HarmBench**, **AdvBench**: adversarial prompts.
- **ToxiGen**, **RealToxicityPrompts**: toxicity.
- **TruthfulQA**: common misconceptions.

## 7.3 How benchmarks mislead

This section is arguably the most important in the entire module. Read every benchmark number assuming at least one of the following is happening, until you can rule them out.

**Contamination.** The eval is in the training data, directly or in close paraphrase. Modern web corpora include the answers to every popular benchmark. Mitigations: held-out splits, recently-created benchmarks (LiveCodeBench), formal contamination checks (n-gram overlap, perplexity-on-canary).

**Prompt sensitivity.** Numbers move 5–15 points with prompt tweaks, system prompts, few-shot example selection. The "best" prompt is often tuned per model. Always check whether comparisons used the same prompt or per-model best.

**Format-bound results.** MCQ scores reflect the model's ability to produce "A/B/C/D" as much as its underlying knowledge. Score the underlying answer when possible; use logprob-based scoring on tokens.

**Cherry-picked subsets.** "X% on coding" might mean X% on a curated 50-problem subset where the model does well.

**Self-consistency / extended thinking inflation.** A "94% MATH" number may come from majority voting with N=64 samples — a different (and much more expensive) operation than greedy decoding.

**Pass@k inflation.** Pass@1 is what users see; pass@10 or pass@100 inflates scores dramatically and rarely transfers to single-shot use.

**Judge bias.** When LLM-as-judge is used (MT-Bench, AlpacaEval), the judge's biases (length, style, similar-model preference) are baked in. Calibrate against human ratings.

**Reward / benchmark overfitting.** Models post-trained on data resembling the benchmark show inflated numbers without proportional capability gains.

## 7.4 Designing your own eval

For a real task, public benchmarks are at best a noisy proxy. Build your own.

A reasonable starting recipe:

1. **Collect ~100–500 real or realistic inputs** from your actual use case. Sample broadly across user types and edge cases. This is the most valuable artifact in your eval stack.
2. **Decide the scoring method**. For each task type:
   - Exact / fuzzy match if there's a clear right answer.
   - Unit tests / verifiers for code or math.
   - LLM-as-judge with a rubric for free-form output. Calibrate the judge against human ratings on a sample.
   - Human eval for subjective quality; needed at least sometimes.
3. **Compute confidence intervals**. With 100 examples and a binary metric, ±5 percentage points is typical noise. Report it.
4. **Run on multiple models, multiple seeds**. Most regressions are within noise of multiple seeds.
5. **Make it easy to look at outputs**. Aggregate scores hide everything. Tools like Inspect, Promptfoo, langfuse make this tractable.
6. **Versioning**. Eval datasets evolve. Tag versions; don't compare scores across versions silently.

**The biggest mistake** in eval design is not looking at outputs. Always read a sample of failures by hand. You'll discover the metric is measuring something other than what you wanted within ten examples.

## 7.5 Interpretability

Interpretability tries to understand *how* the model produces an output — the internal computation, not just the output statistics. Two broad camps:

**Mechanistic interpretability** ("mech interp") aims to reverse-engineer specific algorithms implemented inside the network. Active research areas as of 2026:

- **Circuits**: small subgraphs of attention heads and MLP neurons that implement a single computation. Indirect Object Identification, Induction Heads, etc.
- **Features**: directions in activation space corresponding to interpretable concepts. **Sparse autoencoders** (SAEs) trained on residual stream activations find tens of thousands of "monosemantic" features. Scaling SAEs to frontier models is an active program at Anthropic, OpenAI, DeepMind, and others.
- **Transcoders, cross-coders**: extensions that disentangle MLPs and let features be tracked across layers / model versions.
- **Causal interventions**: patching activations from one input into another (activation patching, attribution patching) to localize which components matter.

**Concept-level / probing methods** (older but still useful):

- Linear probes on hidden states to detect when the model "knows" some property.
- Steering: add a feature direction to the residual stream to make the model behave differently. Used both for capability (instruction following) and safety (refusal probes).

**Why it matters for safety**: black-box behavioral testing has limits — a model can pass every behavioral test and still have learned a different goal. Interpretability is the only credible path to verifying internal alignment as opposed to surface compliance. Realistically, interpretability is still pre-paradigmatic, but the field has advanced rapidly.

## 7.6 Red-teaming and adversarial robustness

A red team tries to elicit bad behavior — both for security and for alignment.

**Jailbreaking** is the canonical adversarial-prompt category:
- **Role-play exploits**: "Pretend you're DAN..."
- **Encoding tricks**: base64, leetspeak, low-resource languages.
- **Prompt injection** (the agent-era favorite): malicious instructions hidden in retrieved content or tool outputs.
- **Multi-turn manipulation**: gradual norm shifts across a conversation.
- **Persona / hypothetical framing**: "in a story...", "for educational purposes...".

**Automated red-teaming**: use an attacker LLM to generate jailbreak attempts; evaluate with a judge. Beats human red-teams on coverage; misses some categories humans find.

**Adversarial training**: fine-tune on successful jailbreaks with corrected responses. Reduces specific attacks but can degrade general behavior and is often not robust to new attack families.

**Capability evals for dangerous knowledge** (bio, cyber, chem, nuclear). Frontier labs run these against new models before release. The threshold isn't "the model knows nothing about X" — it's "the model doesn't provide meaningful uplift to a malicious actor relative to existing resources."

**Sycophancy, deception, situational awareness**: subtler concerns measured by behavioral evals (does the model tell users what they want to hear? does it behave differently when it thinks it's being evaluated?). These are early-stage research areas.

## 7.7 The honest summary

For a new model:

- Run a portfolio of public benchmarks (with awareness of contamination).
- Run task-specific evals that match what you'll deploy.
- Look at failures by hand.
- Compute confidence intervals; don't over-interpret 1-point differences.
- Run safety and red-team evals.
- Track regressions across model versions.

For research: publish per-task numbers, prompts, eval code, seeds, and confidence intervals. The field is healthier when results are reproducible.

## Key papers and resources

- Liang et al. 2022 — *HELM*. Holistic eval framework.
- Zheng et al. 2023 — *MT-Bench / LLM-as-Judge*.
- Olsson et al. 2022 — *In-context Learning and Induction Heads*.
- Wang et al. 2022 — *Interpretability in the Wild* (IOI circuit).
- Bricken et al. 2023; Templeton et al. 2024 — *Towards Monosemanticity / Scaling Monosemanticity*. SAEs.
- Perez et al. 2022 — *Red Teaming Language Models with Language Models*.
- Anil et al. 2024 — *Many-shot Jailbreaking*.

## Exercises

1. Take a benchmark you care about. Run a model with three different prompt formats; measure variance. How does it compare to model-to-model differences?
2. Build a tiny LLM-as-judge eval for a task you have ~50 prompts for. Calibrate against 5 human-labeled examples. Iterate the rubric until judge-human agreement is acceptable.
3. Train a sparse autoencoder on a small model's residual stream activations. Inspect the top features; identify a few interpretable ones.
4. Pick a jailbreak family from a public dataset (e.g. HarmBench). Reproduce a few examples. Try mitigations.

## Further reading

- *A Holistic Approach to Undesired Content Detection* (OpenAI) — practical content moderation.
- *Inspect* (UK AISI) and *Eleuther LM-Eval-Harness* — eval frameworks.
- Anthropic's interpretability papers and blog posts (transformer-circuits.pub).
- *The Curse of Recursion: Training on Generated Data Makes Models Forget* — important context for benchmark contamination.
