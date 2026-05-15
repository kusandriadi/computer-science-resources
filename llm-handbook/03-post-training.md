# Module 3 — Post-training

Here is the thing about a freshly pre-trained model: it is like a brilliant but unfiltered intern. It has absorbed an enormous amount of knowledge, but it has no idea how to be helpful. Ask it a question and it might continue with another question, paste HTML, or write something offensive -- because that is what "the internet" looks like, and predicting the internet is all it was trained to do.

Post-training is where you teach it manners. This is the transformation from "next-token predictor on the internet" to "useful assistant," and it is where most of the visible character of a model is forged.

## Learning goals

- Explain why pre-training alone produces an unhelpful, unsafe model
- Implement supervised fine-tuning (SFT) on a chat dataset
- Derive the PPO objective used in RLHF
- Derive DPO from the RLHF objective and explain when each is preferred
- Understand RLAIF, Constitutional AI, and recent alignment methods

## 3.1 Why post-training?

A pre-trained base model predicts what *would come next on the internet*. Ask "How do I make pasta?" and a base model might continue with another question, an advertisement, or HTML markup, depending on which web pages are statistically most likely. It is not trying to help you.

Post-training molds the base model into:

1. **Instruction-following**: respond to user requests in the requested form.
2. **Helpful, harmless, honest** (Askell et al. 2021): the canonical alignment triad.
3. **Tool-using / agentic**: call APIs, write structured outputs.
4. **Specialized**: domain-tuned (medical, legal, coding).

The standard pipeline is roughly:
1. **SFT** on curated demonstrations.
2. **Preference optimization** (RLHF, DPO, or variants) on preference data.
3. **Targeted further training** for specific behaviors (refusals, tool use, reasoning).

Steps 2–3 are sometimes iterated multiple times.

## 3.2 Supervised fine-tuning (SFT)

Same loss as pre-training (next-token cross-entropy), but on curated `(prompt, response)` pairs formatted as chat:

```
<|im_start|>user
How do I make pasta?<|im_end|>
<|im_start|>assistant
Boil water...<|im_end|>
```

Loss is usually masked to only the assistant turns — you don't want the model to memorize how to write user messages.

**Data quality dominates**. A few thousand carefully curated examples often outperform hundreds of thousands of mediocre ones (LIMA, Zhou et al. 2023). Modern recipes use a few hundred thousand to a few million examples drawn from a mix of human-written, model-generated (and human-edited), and synthetic data.

**Hyperparameters**: 1–3 epochs, LR around $1\text{e-}5$ to $5\text{e-}5$, low or no weight decay, short warmup. Over-training catastrophically degrades the model.

**Risks**:
- **Catastrophic forgetting** — losing capabilities present in the base model. Mitigated by mixing in pre-training data.
- **Hallucination** — SFT teaches the model that the right move is to confidently produce an answer in the SFT format, even when it doesn't know. This is partly why RLHF/DPO are needed.

### Try it: Fine-tune with SFT in 20 lines

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from trl import SFTTrainer
from datasets import load_dataset

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B")
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B")
dataset = load_dataset("tatsu-lab/alpaca", split="train[:1000]")

def format_prompt(example):
    return {"text": f"### Instruction:\n{example['instruction']}\n\n### Response:\n{example['output']}"}

dataset = dataset.map(format_prompt)
trainer = SFTTrainer(
    model=model, train_dataset=dataset, tokenizer=tokenizer,
    args=TrainingArguments(output_dir="./sft-output", num_train_epochs=1, per_device_train_batch_size=4),
    dataset_text_field="text", max_seq_length=512,
)
trainer.train()
```

## 3.3 Reinforcement learning from human feedback (RLHF)

SFT teaches the model what a good response *looks like*, but it does not teach the model to *choose* a good response over a mediocre one. That is what RLHF does: it gives the model a sense of "better" and "worse" by learning from human preferences.

A concrete example: ask the model "Explain quantum entanglement." SFT might produce a correct but jargon-heavy answer. RLHF, trained on human preferences, learns that the same model should produce a clear, well-structured answer -- because that is what humans consistently preferred during training.

The standard RLHF recipe (Ouyang et al. 2022, InstructGPT):

**Step 1 — collect preferences**. For each prompt $x$, sample multiple responses from an SFT model. A human ranks them. Pairs become $(x, y_w, y_l)$ — preferred and dispreferred.

**Step 2 — train a reward model (RM)**. A copy of the SFT model with a scalar head, trained on:

$$\mathcal{L}_{RM} = -\mathbb{E}_{(x, y_w, y_l)} \big[\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))\big]$$

This is the **Bradley-Terry** likelihood: the RM learns a scalar reward $r_\phi(x, y)$ such that preferred completions get higher scores.

**Step 3 — RL fine-tuning**. Maximize expected reward minus a KL penalty against the SFT model:

$$\max_\theta\ \mathbb{E}_{x \sim D,\ y \sim \pi_\theta(\cdot|x)} \big[r_\phi(x, y)\big] - \beta\ \mathrm{KL}\!\big[\pi_\theta(\cdot|x) \,\|\, \pi_{\text{ref}}(\cdot|x)\big]$$

The KL penalty prevents the policy from drifting too far from the SFT model — without it, the policy will find adversarial completions that score high on the RM but are gibberish. The algorithm of choice has historically been **PPO** (Proximal Policy Optimization, Schulman et al. 2017), though many teams now use simpler alternatives.

**Why PPO works** here: trust-region updates (via the clipped surrogate objective) prevent destructive large updates in the high-variance LM setting. The token-level credit assignment problem is real — a sentence-level reward must be attributed to each token, usually via a learned value function and GAE.

**Practical pain points of PPO**:
- Compute-expensive: needs 4 model copies in memory (policy, reference, reward, value).
- Hyperparameter-sensitive (KL coefficient, clip range, value loss weight).
- Reward hacking: policy finds and exploits RM blind spots.
- Reward overoptimization (Gao et al. 2022): true preference plateaus and then declines as RM score keeps climbing.

## 3.4 Direct Preference Optimization (DPO)

RLHF works, but it is complex -- four models in memory, sensitive hyperparameters, reward hacking. DPO (Rafailov et al. 2023) is a remarkable shortcut. It shows that the RLHF objective has a *closed-form optimal policy* in terms of the reward and reference policy:

$$\pi^*(y|x) = \frac{1}{Z(x)}\, \pi_{\text{ref}}(y|x)\, \exp\!\left(\frac{1}{\beta} r(x, y)\right)$$

Inverting: $r(x, y) = \beta \log \frac{\pi^*(y|x)}{\pi_{\text{ref}}(y|x)} + \beta \log Z(x)$.

Substitute into the Bradley-Terry RM loss. The $\log Z(x)$ cancels in the pairwise difference. You get:

$$\mathcal{L}_{DPO} = -\mathbb{E}_{(x, y_w, y_l)}\!\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]$$

That is a supervised loss directly on the policy. No reward model, no RL loop, no value function. You train it the same way you would train SFT -- just with a different loss function. The elegance here is real: all the complexity of RLHF collapses into a single, stable training objective.

**When DPO wins**: simpler infra, more stable, almost no hyperparameter tuning beyond $\beta$. Strong default for small-scale post-training.

**When RLHF (PPO/GRPO) wins**:
- On-policy data is crucial (the model learns from its own current generations).
- You have a high-quality reward signal (verifier, code execution, math grader) — this is the regime where modern reasoning models live.
- You can afford the compute.

**DPO variants** -- the field has not stopped at vanilla DPO. Each variant below addresses a specific limitation: IPO (fixes a length-bias issue), KTO (works with single ratings instead of pairwise comparisons -- useful when you only have thumbs-up/thumbs-down data), ORPO (combines SFT and preferences in one step), SimPO (length-normalized, reference-free). These trade off simplicity and quality differently; pick by empirical results on your task, not by which paper is newest.

### Try it: DPO loss function

```python
import torch
import torch.nn.functional as F

def dpo_loss(policy_chosen_logps, policy_rejected_logps,
             ref_chosen_logps, ref_rejected_logps, beta=0.1):
    chosen_rewards = beta * (policy_chosen_logps - ref_chosen_logps)
    rejected_rewards = beta * (policy_rejected_logps - ref_rejected_logps)
    loss = -F.logsigmoid(chosen_rewards - rejected_rewards).mean()
    return loss

# The elegance: no reward model needed, just log-probabilities
```

## 3.5 RLAIF and Constitutional AI

**RLAIF** (Bai et al. 2022, Lee et al. 2023): replace human labelers with a strong LLM. The LLM judges which of two completions is better, given a rubric. Massively reduces data cost. Quality depends on the judge and the rubric.

**Constitutional AI** (Anthropic, Bai et al. 2022b): a particular RLAIF recipe with two stages.

1. **SL-CAI**: the model self-critiques and revises its own responses to a list of principles (the "constitution"). The revised responses become an SFT dataset.
2. **RL-CAI**: an AI evaluator scores pairs of responses against the principles. The resulting preferences train a reward model and then a PPO policy.

The constitution makes values explicit and auditable. Modern alignment work increasingly uses some form of AI feedback for scalable oversight.

## 3.6 RL with verifiable rewards: the reasoning regime

This section describes arguably the most exciting result in post-training from the last two years. The key insight: for tasks where correctness is checkable -- math problems with known answers, code with unit tests, formal proofs -- you do not need a learned reward model at all. The verifier *is* the reward. Did the code pass the test? Did the math answer match? That binary signal turns out to be enough to teach a model to reason.

**GRPO** (Group Relative Policy Optimization, DeepSeek-Math/R1 2024–2025): sample $G$ responses per prompt, compute the reward for each, use the group mean as a baseline. Drops the value function entirely. Simpler than PPO and works well when rewards are dense enough.

**RLOO** (REINFORCE Leave-One-Out): similar baseline trick, also dropping the value function. Strong simple baseline (Ahmadian et al. 2024).

This regime produced the recent wave of reasoning-focused models (o1, DeepSeek-R1 family, etc.). The model is trained to produce long chains of thought, and the verifier rewards correctness on the final answer. The model learns to plan, backtrack, and verify on its own — and these behaviors generalize beyond the training tasks. This is the most exciting result in post-training of the last two years.

## 3.7 Safety and refusal training

The model must refuse some requests (CSAM, bioweapon synthesis, etc.) and engage thoughtfully with others (medical questions, security research). Training for this is genuinely hard:

- Over-refusal: refusing benign requests that pattern-match to harmful ones.
- Under-refusal: complying with disguised harmful requests.
- Jailbreaks: adversarial prompts that bypass refusals.

Standard approaches: refusal-augmented SFT data, harmlessness preference data, red-teaming pipelines, evaluation against adversarial benchmarks. Constitutional AI explicitly trades off harmlessness and helpfulness using rated principles.

## 3.8 Practical recipe (modern, 2026)

A reasonable open-source post-training pipeline for a base model:

1. **SFT** on ~100k–1M curated examples (mix of human-written, model-generated, and synthetic). 1–2 epochs.
2. **Preference data collection**: sample from SFT model; label with stronger judge (RLAIF) or humans.
3. **DPO** (or a variant) on preferences. 1 epoch, $\beta \approx 0.1$.
4. **Optional RL-with-verifiers** on math/code/reasoning, using GRPO.
5. **Targeted training** for tool use, structured outputs, refusals.
6. Iterate steps 2–5.

Evaluate continuously (Module 7) — capability and safety regressions are easy to miss.

## Key papers

- Christiano et al. 2017 — *Deep RL from Human Preferences*. The origin.
- Ouyang et al. 2022 — *InstructGPT*. The canonical RLHF recipe.
- Bai et al. 2022 — *Training a Helpful and Harmless Assistant with RLHF*.
- Bai et al. 2022b — *Constitutional AI*.
- Rafailov et al. 2023 — *DPO*.
- DeepSeek-AI 2024 — *DeepSeekMath* (GRPO).
- DeepSeek-AI 2025 — *DeepSeek-R1*. RL-with-verifiable-rewards at scale.

## Exercises

1. SFT a small base model (e.g. Pythia-1B) on ~10k OpenAssistant conversations. Compare to the base model on MT-Bench.
2. Implement DPO from scratch in PyTorch. Train on UltraFeedback. Compare to SFT-only baseline.
3. Derive the DPO loss from the RLHF objective on paper. Confirm the partition function cancellation.
4. Train a tiny reward model on preference data. Use it to rerank N=8 samples at inference and measure quality improvement (best-of-N is a useful baseline that doesn't need RL).

## Further reading

- *RLHF: Reinforcement Learning from Human Feedback* — Lambert's book/notes.
- *Secrets of RLHF in Large Language Models* — Zheng et al. survey.
- *Alignment Faking in Large Language Models* (Anthropic 2024). What can go wrong even when training looks fine.
- Hugging Face TRL library — practical implementations of SFT, DPO, GRPO, etc.
