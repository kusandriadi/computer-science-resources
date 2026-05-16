# Computer Science Resources

A curated collection of computer science learning materials — from fundamentals to frontier topics. Every handbook is written in clear, humanized English and designed to be accessible to its target audience.

**Website:** [cs.kusandriadi.com](https://cs.kusandriadi.com)

---

## Topics

| # | Topic | Audience | Description |
|---|-------|----------|-------------|
| 1 | [AI Engineering Syllabus](ai-engineering-syllabus/) | University students (semester 1–4), IT and non-IT backgrounds | A complete AI/ML education program — 7 courses across 4 semesters covering data science, machine learning, generative AI, deep learning, computer vision, AI ethics, and cloud infrastructure. Written in a friendly, encouraging tone with Week 0 crash courses and self-check checklists so students from any background can follow along. |
| 2 | [LLM Handbook](llm-handbook/) | ML engineers, researchers, and practitioners | A deep-dive reference on Large Language Models — from transformer foundations and pre-training to inference optimization, reasoning, agents, and production systems. Technically precise but written like a knowledgeable colleague explaining over coffee, not a dry textbook. |
| 3 | [Algorithms Handbook](algorithms-handbook/) | CS students and engineers | Algorithms and data structures — complexity analysis, sorting, graphs, dynamic programming, network flows, and more. All code examples in Java. Every module starts with real-world intuition before formal definitions, and ends with a quiz. |
| 4 | [Computational Thinking Handbook](computational-thinking-handbook/) | Elementary school students (grades 1–6, ages 6–12) | Learn to think like a problem solver — no computer needed! Covers decomposition, pattern recognition, abstraction, algorithm design, logical thinking, and debugging through fun analogies (cooking, LEGO, games) and unplugged activities. **Written entirely in Bahasa Indonesia** with simple, energetic language that Indonesian kids can understand. |
| 5 | [GAN Handbook](gan-handbook/) | Undergraduate CS students (year 1–2) | Generative Adversarial Networks and their famous descendants — DCGAN, WGAN, StyleGAN, CycleGAN, Pix2Pix, Real-ESRGAN, HiFi-GAN, and the diffusion-era hybrids. Every equation is unpacked symbol by symbol; code snippets are PyTorch; Module 8 ships a runnable DCGAN trainer. |

---

## Repository Structure

```
computer-science-resources/
├── ai-engineering-syllabus/           # 7 courses (16 weeks each), Week 0 included
├── llm-handbook/                      # 17 chapters + 7 appendices
├── algorithms-handbook/               # 15 modules with Java examples and quizzes
├── computational-thinking-handbook/   # 10 modules + activities for young learners
├── gan-handbook/                      # 9 modules + 2 appendices + runnable trainer
├── index.html, js/, css/, icons/      # Static website (cs.kusandriadi.com)
├── manifest.json, sw.js               # PWA support
├── AGENTS.md                          # Detailed guidelines for AI agents
├── LICENSE
└── README.md
```

---

## Design Principles

- **Humanized language** — Every handbook is written to feel like a real person teaching, not an AI or textbook. Jargon is always explained before it is used.
- **Audience-appropriate** — The AI syllabus speaks to university freshmen; the CT handbook speaks to 8-year-olds; the LLM handbook speaks to working engineers. Each one respects its reader.
- **Practical first** — Real-world examples and "why this matters" context before theory and formulas.
- **Self-contained** — Each topic can be read independently. No external accounts or paid tools required to learn.

---

## How to Use

- **University students** — Start with the AI Engineering Syllabus. Follow semester 1 through 4. Each course has a Week 0 crash course if you need to catch up.
- **Elementary school students & teachers** — Start with the Computational Thinking Handbook. No computer needed. Follow modules 01 through 07, then try the fun activities in module 08.
- **ML engineers & researchers** — Jump into the LLM Handbook or Algorithms Handbook. Read linearly for a structured path, or use any module as a standalone reference.
- **Undergrads curious about generative AI** — Start with the GAN Handbook. Module 0 explains why GANs exist; Module 8 gives you a runnable DCGAN you can train on a laptop GPU.
- **Educators** — Adapt any material for your classes. The AI syllabus includes weekly breakdowns, projects, and recommended textbooks. The CT handbook includes a full teacher guide (module 09).

---

## Recommended Textbooks

Each handbook references authoritative books. Highlights:

| Topic | Key Books |
|-------|-----------|
| Algorithms | CLRS (4th Ed), Sedgewick & Wayne (Java), Skiena, Jeff Erickson (free) |
| Machine Learning | Hands-On ML (Géron), ISLR (free), d2l.ai (free) |
| LLMs | Build a Large Language Model from Scratch (Raschka), Deep Learning (Goodfellow), Jurafsky & Martin (free) |
| Generative AI | AI Engineering (Chip Huyen), NLP with Transformers (Tunstall) |
| GANs (Generative Adversarial Networks) | *GANs in Action* (Langr & Bok), *Generative Deep Learning* (Foster, 2nd Ed) — covers GANs, VAEs, diffusion, *Deep Learning* (Goodfellow et al.) ch. 20 |
| Computer Vision | Szeliski (free), Deep Learning for Vision Systems |
| AI Ethics | Weapons of Math Destruction (O'Neil), Interpretable ML (Molnar, free) |
| Computational Thinking | CS Unplugged (free), Hello Ruby (Liukas), Mindstorms (Papert) |

Full reading lists are inside each handbook.

---

## Contributing

Contributions are welcome. Please open an issue or submit a pull request if you want to:
- Fix errors or improve explanations
- Add new topics or modules
- Translate materials to other languages

---

## License

[MIT](LICENSE)
