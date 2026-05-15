# Essential Reading and Resources

A consolidated, curated reading list. The "Tier 1" papers in each section are non-negotiable; the rest are excellent further reading.

## Architecture and foundations

**Tier 1**
- Vaswani et al. 2017 — *Attention is All You Need*
- Radford et al. 2019 — *GPT-2 (Language Models are Unsupervised Multitask Learners)*
- Touvron et al. 2023 — *LLaMA*
- Su et al. 2021 — *RoFormer (RoPE)*
- Shazeer 2020 — *GLU Variants Improve Transformer*

**Further**
- Dosovitskiy et al. 2020 — *ViT*
- Devlin et al. 2018 — *BERT*
- Raffel et al. 2020 — *T5*
- Phuong & Hutter 2022 — *Formal Algorithms for Transformers*

## Scaling and training

**Tier 1**
- Kaplan et al. 2020 — *Scaling Laws for Neural Language Models*
- Hoffmann et al. 2022 — *Chinchilla*
- Rajbhandari et al. 2020 — *ZeRO*
- Loshchilov & Hutter 2017 — *AdamW*
- *The Llama 3 Herd of Models* (Meta 2024)
- *DeepSeek-V3 Technical Report* (DeepSeek 2024)

**Further**
- Brown et al. 2020 — *GPT-3*
- Narayanan et al. 2021 — *Megatron-LM*
- McCandlish et al. 2018 — *Empirical Model of Large-Batch Training*
- Penedo et al. 2024 — *FineWeb*
- Hoffmann et al. 2022 — Chinchilla appendix on data-mixing scaling laws

## Post-training and alignment

**Tier 1**
- Christiano et al. 2017 — *Deep RL from Human Preferences*
- Ouyang et al. 2022 — *InstructGPT*
- Bai et al. 2022 — *Anthropic HH*
- Bai et al. 2022 — *Constitutional AI*
- Rafailov et al. 2023 — *DPO*
- DeepSeek-AI 2025 — *DeepSeek-R1*

**Further**
- Askell et al. 2021 — *A General Language Assistant as a Laboratory for Alignment*
- Stiennon et al. 2020 — *Learning to Summarize with Human Feedback*
- Gao et al. 2022 — *Scaling Laws for Reward Model Overoptimization*
- Lee et al. 2023 — *RLAIF*
- Schulman et al. 2017 — *PPO*
- Ahmadian et al. 2024 — *Back to Basics: Revisiting REINFORCE for RLHF*
- Anthropic 2024 — *Alignment Faking in Large Language Models*

## Inference and efficiency

**Tier 1**
- Dao et al. 2022 — *FlashAttention*
- Dao 2023 — *FlashAttention-2*
- Kwon et al. 2023 — *vLLM / PagedAttention*
- Leviathan et al. 2023 — *Speculative Decoding*
- Frantar et al. 2022 — *GPTQ*

**Further**
- Pope et al. 2022 — *Efficiently Scaling Transformer Inference*
- Lin et al. 2023 — *AWQ*
- Xiao et al. 2022 — *SmoothQuant*
- Cai et al. 2024 — *Medusa*
- Li et al. 2024 — *EAGLE*
- Shah et al. 2024 — *FlashAttention-3*

## Mixture of experts

**Tier 1**
- Shazeer et al. 2017 — *Outrageously Large Neural Networks*
- Fedus et al. 2021 — *Switch Transformer*
- Jiang et al. 2024 — *Mixtral 8x7B*
- DeepSeek-AI 2024 — *DeepSeekMoE*

**Further**
- Lepikhin et al. 2020 — *GShard*
- Du et al. 2022 — *GLaM*

## Long context

**Tier 1**
- Chen et al. 2023 — *Position Interpolation*
- Peng et al. 2023 — *YaRN*
- Liu et al. 2023 — *Ring Attention*
- Liu et al. 2023 — *Lost in the Middle*

**Further**
- Press et al. 2022 — *ALiBi*
- Beltagy et al. 2020 — *Longformer*
- Hsieh et al. 2024 — *RULER*

## Reasoning and test-time compute

**Tier 1**
- Wei et al. 2022 — *Chain-of-Thought*
- Wang et al. 2022 — *Self-Consistency*
- Snell et al. 2024 — *Scaling LLM Test-Time Compute*
- OpenAI 2024 — *Learning to Reason with LLMs (o1)*

**Further**
- Kojima et al. 2022 — *Large Language Models are Zero-Shot Reasoners*
- Yao et al. 2023 — *Tree of Thoughts*
- Lightman et al. 2023 — *Let's Verify Step by Step*
- Hendrycks et al. 2021 — *MATH*

## Tools, agents, and RAG

**Tier 1**
- Yao et al. 2023 — *ReAct*
- Lewis et al. 2020 — *RAG*
- Anthropic 2024 — *Building Effective Agents*

**Further**
- Schick et al. 2023 — *Toolformer*
- Shinn et al. 2023 — *Reflexion*
- Jimenez et al. 2024 — *SWE-bench*
- Khattab et al. 2024 — *DSPy*

## Multimodal

**Tier 1**
- Radford et al. 2021 — *CLIP*
- Alayrac et al. 2022 — *Flamingo*
- Liu et al. 2023 — *LLaVA*

**Further**
- Li et al. 2023 — *BLIP-2*
- Chameleon Team 2024 — *Chameleon* (early-fusion)

## Alternative architectures

**Tier 1**
- Gu & Dao 2023 — *Mamba*
- Lieber et al. 2024 — *Jamba*

**Further**
- Gu et al. 2021 — *S4*
- Peng et al. 2023 — *RWKV*
- Sun et al. 2023 — *RetNet*

## Interpretability

**Tier 1**
- Elhage et al. 2021 — *A Mathematical Framework for Transformer Circuits*
- Olsson et al. 2022 — *In-context Learning and Induction Heads*
- Bricken et al. 2023 — *Towards Monosemanticity*
- Templeton et al. 2024 — *Scaling Monosemanticity*

**Further**
- Wang et al. 2022 — *Interpretability in the Wild (IOI)*
- Conmy et al. 2023 — *ACDC* (automated circuit discovery)

## Evaluation and safety

**Tier 1**
- Liang et al. 2022 — *HELM*
- Zheng et al. 2023 — *Judging LLM-as-a-Judge*
- Perez et al. 2022 — *Red Teaming Language Models with Language Models*

**Further**
- Hendrycks et al. 2021 — *MMLU*
- Rein et al. 2023 — *GPQA*
- Jimenez et al. 2024 — *SWE-bench Verified*
- Anil et al. 2024 — *Many-shot Jailbreaking*

## Books and long-form

- Goodfellow, Bengio, Courville — *Deep Learning* (foundation math)
- Murphy — *Probabilistic Machine Learning* (broad and current)
- Bishop & Bishop 2024 — *Deep Learning: Foundations and Concepts*
- Lambert — *RLHF Book* (online, free, actively updated)
- Raschka 2024 — *Build a Large Language Model (From Scratch)* (hands-on guide to building a GPT-like model from scratch in PyTorch; covers tokenization, attention, training, fine-tuning — best practical companion to the theoretical modules)
- Jurafsky & Martin — *Speech and Language Processing* (3rd ed. draft, free online; the definitive NLP textbook covering everything from n-grams to transformers — essential foundation for anyone working with language models)
- Tunstall, von Werra, Wolf 2022 — *Natural Language Processing with Transformers* (O'Reilly; practical Hugging Face guide covering text classification, NER, QA, summarization, generation, and model deployment)
- Huyen 2022 — *Designing Machine Learning Systems* (O'Reilly; production ML systems design: data engineering, feature engineering, model deployment, monitoring, and iteration — essential for Module 8)
- Alammar & Grootendorst 2024 — *Hands-On Large Language Models* (O'Reilly; practical guide with visual explanations covering text embeddings, semantic search, text generation, and multimodal models)
- Huyen 2025 — *AI Engineering* (O'Reilly; building AI applications with foundation models — covers prompt engineering, RAG, agents, fine-tuning, and evaluation in production settings)
- Zhang, Lipton, Li, Smola — *Dive into Deep Learning* (free, interactive: d2l.ai; Chapter 11 covers Attention and Transformers in detail with runnable code — excellent hands-on complement to the architecture papers)
- Stanford CS224N lecture notes (free; covers NLP foundations — word vectors, sequence models, attention, pretraining — relevant background for LLM internals)

## Where to follow ongoing work

- **arXiv** — `cs.CL`, `cs.LG`, `stat.ML`. Filter ruthlessly.
- **Blogs**: Lilian Weng, Sebastian Raschka, Eugene Yan, Simon Willison, Chip Huyen, Jay Alammar.
- **Lab blogs**: Anthropic (anthropic.com/news), OpenAI, DeepMind, Meta AI, Mistral, DeepSeek.
- **transformer-circuits.pub** — Anthropic interpretability.
- **Conferences**: NeurIPS, ICML, ICLR, ACL, EMNLP. Most-cited "best paper" lists are signal.
- **Twitter/X** — useful for breaking results, terrible for considered judgment. Calibrate accordingly.

## A reading discipline

Reading is necessary but not sufficient. For every important paper:

1. Read abstract + conclusion. Predict the method.
2. Read the method. Sketch the algorithm on paper.
3. Read the results. Note what you would ablate.
4. Implement the smallest version that works.

Step 4 is the difference between knowing about LLMs and knowing LLMs.
