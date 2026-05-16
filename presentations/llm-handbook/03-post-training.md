---
marp: true
theme: default
paginate: true
header: 'LLM Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 3 -- Post-training

**The intern analogy:** A freshly pre-trained model is like a brilliant but unfiltered intern. It has absorbed enormous knowledge, but it has no idea how to be helpful. Post-training is where you teach it manners -- the transformation from "next-token predictor on the internet" to "useful assistant."

---

# Why This Matters

- Pre-training alone produces a model that predicts what the internet looks like, not one that helps you
- Post-training is where the visible character of a model is forged (helpfulness, safety, style)
- Understanding RLHF/DPO is essential to grasp how modern assistants behave
- The RL-with-verifiable-rewards paradigm produced the wave of reasoning models (o1, R1)

---

# 3.1 Why Post-training?

Ask a base model "How do I make pasta?" and it might:
- Continue with another question
- Paste HTML markup
- Write something offensive

Post-training molds the base model into:
1. **Instruction-following**: respond in the requested form
2. **Helpful, harmless, honest** (Askell et al. 2021)
3. **Tool-using / agentic**: call APIs, structured outputs
4. **Specialized**: domain-tuned (medical, legal, coding)

---

# The Post-training Pipeline

```
Base Model --> SFT --> Preference Optimization --> Targeted Training
                         (RLHF / DPO)           (tool use, refusals,
                                                   reasoning)
```

Steps 2-3 are often iterated multiple times.

---

# 3.2 Supervised Fine-Tuning (SFT)

Same loss as pre-training (next-token cross-entropy), but on curated `(prompt, response)` pairs.

- Loss is **masked to assistant turns only**
- **Data quality dominates**: a few thousand curated examples > hundreds of thousands of mediocre ones (LIMA, Zhou et al. 2023)
- Hyperparameters: 1-3 epochs, LR ~1e-5 to 5e-5

**Risks:**
- **Catastrophic forgetting** -- losing base model capabilities
- **Hallucination** -- SFT teaches confident answer production even when uncertain

---

# Try It: SFT in 20 Lines

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from trl import SFTTrainer
from datasets import load_dataset

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B")
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B")
dataset = load_dataset("tatsu-lab/alpaca", split="train[:1000]")

def format_prompt(example):
    return {"text": f"### Instruction:\n{example['instruction']}\n\n"
                    f"### Response:\n{example['output']}"}

dataset = dataset.map(format_prompt)
trainer = SFTTrainer(
    model=model, train_dataset=dataset, tokenizer=tokenizer,
    args=TrainingArguments(output_dir="./sft", num_train_epochs=1,
                           per_device_train_batch_size=4),
    dataset_text_field="text", max_seq_length=512)
trainer.train()
```

---

# 3.3 RLHF: The Concept

SFT teaches what a good response *looks like*, but not how to *choose* good over mediocre.

**RLHF** gives the model a sense of "better" and "worse" by learning from human preferences.

**Three steps** (InstructGPT, Ouyang et al. 2022):
1. Collect preference pairs $(x, y_w, y_l)$ -- preferred and dispreferred
2. Train a reward model (RM)
3. RL fine-tuning with KL penalty

---

# Step 2: The Reward Model

$$\mathcal{L}_{RM} = -\mathbb{E}_{(x, y_w, y_l)} \big[\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))\big]$$

**How to read this:** Bradley-Terry likelihood. The RM learns a scalar reward $r_\phi(x, y)$ such that preferred completions get higher scores.

# Step 3: RL Fine-tuning

$$\max_\theta\ \mathbb{E}_{x, y \sim \pi_\theta} \big[r_\phi(x, y)\big] - \beta\ \mathrm{KL}\!\big[\pi_\theta \,\|\, \pi_{\text{ref}}\big]$$

The KL penalty prevents drift to adversarial gibberish that scores high on the RM.

---

# RLHF Pain Points

- **Compute-expensive**: needs 4 model copies (policy, reference, reward, value)
- **Hyperparameter-sensitive**: KL coefficient, clip range, value loss weight
- **Reward hacking**: policy exploits RM blind spots
- **Reward overoptimization**: true preference plateaus then declines as RM score keeps climbing

---

# 3.4 DPO: A Remarkable Shortcut

**DPO** (Rafailov et al. 2023) shows the RLHF objective has a closed-form optimal policy:

$$\mathcal{L}_{DPO} = -\mathbb{E}\!\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]$$

**How to read this:**
- $\log \frac{\pi_\theta(y|x)}{\pi_{ref}(y|x)}$ -- how much more/less likely our model makes response $y$ vs. reference
- Make the winning response more likely, losing response less likely
- No reward model, no RL loop, no value function -- just a supervised loss

---

# DPO vs. RLHF: When Each Wins

| DPO wins when... | RLHF (PPO/GRPO) wins when... |
|-------------------|-------------------------------|
| Simpler infra needed | On-policy data is crucial |
| Stable, minimal hyperparameters | High-quality reward signal (verifier, code tests) |
| Small-scale post-training | You can afford the compute |
| Default first choice | Modern reasoning model regime |

**DPO variants:** IPO, KTO, ORPO, SimPO -- each addresses a specific limitation.

---

# Try It: DPO Loss Function

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

---

# 3.5 RLAIF and Constitutional AI

**RLAIF** (Bai et al. 2022): replace human labelers with a strong LLM judge. Massively reduces data cost.

**Constitutional AI** (Anthropic):
1. **SL-CAI**: model self-critiques and revises against a list of principles (the "constitution")
2. **RL-CAI**: AI evaluator scores response pairs against principles, trains RM + PPO policy

The constitution makes values **explicit and auditable**.

---

# 3.6 RL with Verifiable Rewards: The Reasoning Regime

The most exciting result in post-training from the last two years:

For tasks where correctness is **checkable** (math with known answers, code with unit tests):
- No learned reward model needed -- the **verifier is the reward**
- Binary signal: did the code pass? Did the math answer match?

**GRPO** (DeepSeek-Math/R1): sample $G$ responses per prompt, use group mean as baseline. Drops the value function entirely.

> This produced the wave of reasoning models (o1, DeepSeek-R1). The model learns to plan, backtrack, and verify on its own.

---

# 3.7 Safety and Refusal Training

- **Over-refusal**: refusing benign requests that pattern-match to harmful ones
- **Under-refusal**: complying with disguised harmful requests
- **Jailbreaks**: adversarial prompts that bypass refusals

Approaches: refusal-augmented SFT data, harmlessness preference data, red-teaming, adversarial benchmarks, Constitutional AI.

---

# 3.8 Modern Post-training Recipe (2026)

1. **SFT** on ~100k-1M curated examples. 1-2 epochs.
2. **Preference data collection**: sample from SFT model; label with stronger judge (RLAIF) or humans.
3. **DPO** (or variant) on preferences. 1 epoch, $\beta \approx 0.1$.
4. **Optional RL-with-verifiers** on math/code/reasoning (GRPO).
5. **Targeted training** for tool use, structured outputs, refusals.
6. **Iterate** steps 2-5.

---

# Key Papers

| Paper | Contribution |
|-------|-------------|
| Ouyang et al. 2022 | *InstructGPT* -- canonical RLHF recipe |
| Bai et al. 2022b | *Constitutional AI* |
| Rafailov et al. 2023 | *DPO* -- preference optimization without RL |
| DeepSeek-AI 2024 | *DeepSeekMath (GRPO)* |
| DeepSeek-AI 2025 | *DeepSeek-R1* -- RL-with-verifiable-rewards at scale |

---

# Exercises

1. SFT a small base model (Pythia-1B) on ~10k OpenAssistant conversations. Compare to the base model on MT-Bench.
2. Implement DPO from scratch in PyTorch. Train on UltraFeedback. Compare to SFT-only.
3. Derive the DPO loss from the RLHF objective on paper. Confirm the partition function cancellation.
4. Train a tiny reward model on preference data. Use it to rerank N=8 samples (best-of-N baseline).
