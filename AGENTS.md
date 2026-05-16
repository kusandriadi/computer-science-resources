# AGENTS.md

Detailed guidelines for AI agents working on this repository. Read this before making any changes.

---

## 1. Repository Overview

This is a multi-handbook collection of computer science learning materials, deployed as a static website at [cs.kusandriadi.com](https://cs.kusandriadi.com). Five handbooks, each aimed at a specific audience, plus a full PWA-enabled website that renders the markdown live from GitHub.

The repository serves *very different* readers — kids learning to think computationally, undergrads learning GANs, working ML engineers studying LLMs. The single most important rule: **every piece of writing must match its target audience.** Style, vocabulary, depth, and analogies all shift per handbook.

---

## 2. Top-Level Structure

```
cs/
├── ai-engineering-syllabus/           # Handbook 1 — 7 courses, 16 weeks each
├── llm-handbook/                      # Handbook 2 — 17 chapters + 7 appendices
├── algorithms-handbook/               # Handbook 3 — 15 modules with Java
├── computational-thinking-handbook/   # Handbook 4 — Bahasa Indonesia, for kids
├── gan-handbook/                      # Handbook 5 — GANs, undergrad level
├── presentations/                     # Marp-rendered HTML slide decks per handbook
├── css/styles.css                     # Website styles (theme, cards, viewer, FABs)
├── js/app.js                          # Handbook registry + viewer logic
├── icons/                             # PWA icons (SVG)
├── index.html                         # Website entry — handbook cards + module viewer
├── manifest.json                      # PWA manifest
├── sw.js                              # PWA service worker
├── AGENTS.md                          # This file
├── LICENSE                            # MIT
└── README.md                          # Public-facing project README
```

---

## 3. The Five Handbooks

| Directory | Language | Audience | Tone | Code |
|---|---|---|---|---|
| `ai-engineering-syllabus/` | English | University students sem. 1–4, IT and non-IT | Friendly, encouraging teacher | None (syllabus only) |
| `llm-handbook/` | English | ML engineers, researchers, practitioners | Knowledgeable colleague explaining over coffee | Python |
| `algorithms-handbook/` | English | CS students and engineers | Engaging teacher with real-world hooks | Java |
| `computational-thinking-handbook/` | **Bahasa Indonesia** | Elementary kids (grades 1–6, ages 6–12) | Fun, energetic, unplugged | None (no computer) |
| `gan-handbook/` | English | Undergraduate CS students (year 1–2) | Patient mentor, explains every symbol | PyTorch |

---

## 4. Per-Handbook Style Guides

### 4.1 `ai-engineering-syllabus/`

**Audience.** University students who may have *no* prior IT background. English is likely a second language. Many come from general high school.

**Rules.**
- Every technical term explained the first time it appears. Either inline ("API (a way for programs to talk to each other)") or in parentheses.
- Course overviews start with a relatable question or everyday scenario, not a buzzword list.
- Every course has a **Week 0 crash course** for students who need to catch up. Week 0 covers prerequisites and gentle on-ramps.
- Each course has a **"Self-Check: Am I Ready?"** checklist after the prerequisites.
- Avoid marketing language: "comprehensive," "cutting-edge," "industry-leading," "robust," "state-of-the-art." Just be clear.
- "Why this matters" motivations appear before technical weeks.
- Weekly structure: Topics → What You'll Build → (optional) Why This Matters.

**Naming.** `01-data-science-ai-for-business/syllabus.md`, etc. Folders are kebab-case-descriptive; the actual content file inside is `syllabus.md`.

### 4.2 `llm-handbook/`

**Audience.** ML engineers and researchers. They know loss functions, SGD, backprop, basic deep learning. They may be new to LLMs specifically.

**Rules.**
- Pattern: **intuition → example → formal definition → code.**
- One-sentence bridges before dense sections: "Here's the key insight..." or "Before the math, build intuition first..."
- Reference papers by author and year: "Vaswani et al. 2017."
- Math in LaTeX (`$...$` and `$$...$$`).
- Code in **Python** (PyTorch / Hugging Face by default).
- End each module with: **Key papers**, **Exercises**, **Further reading**.
- Use "modern" to mean state of the art as of early 2026.
- Conversational but technically precise. Like explaining to a smart colleague, not lecturing.
- It's OK to cite specific tools (tiktoken, AutoTokenizer, vLLM, etc.) and recommend defaults.

### 4.3 `algorithms-handbook/`

**Audience.** CS students and software engineers studying algorithms and data structures.

**Rules.**
- **All code in Java.** No Python, no pseudocode-only. Java is mandatory.
- Each module **must end with a Quiz section** (5–8 questions with answers).
- Start each module with a **real-world motivation**: Google Maps for graphs, Netflix for sorting, GPS for shortest path.
- Explain the "why" before the "how." Students should understand the problem before seeing the solution.
- Code is commented. Each line's purpose should be clear without the surrounding paragraph.
- Math uses LaTeX. Big-O notation everywhere is fair game.
- Module structure: real-world hook → intuition → formal problem → algorithm → complexity → Java code → variations → quiz.

### 4.4 `computational-thinking-handbook/`

**Audience.** Elementary school children, grades 1–6, ages 6–12, in Indonesia.

**Rules.**
- **ALL content in Bahasa Indonesia.** This is mandatory. No English content body except for technical loanwords.
- Write for a 10-year-old. If a 10-year-old wouldn't understand a sentence, rewrite it.
- Technical terms stay in English but get an Indonesian gloss: "**Decomposition** (memecah masalah besar jadi bagian kecil)".
- Analogies from daily Indonesian life: cooking (nasi goreng), cleaning your room, playing games (bermain congklak), going to school.
- Every module (01–07) **must end with a quiz/challenge and answer key** in Indonesian.
- Activities must be **unplugged** (no computer required).
- Encouraging language: "Kamu hebat!", "Siap untuk tantangan?", "Yuk coba sesuatu yang keren!", "Wah, keren banget!".
- Avoid formal/stiff Indonesian. Use casual, kid-friendly Indonesian.
- Module 09 (Untuk Guru dan Orang Tua) targets adults — keep it warm but professional.

### 4.5 `gan-handbook/`

**Audience.** Undergraduate CS students, year 1–2. They know basic calculus, basic linear algebra, and PyTorch.

**Rules.**
- **Every math symbol gets a "what this means" gloss the first time it appears.** Use a markdown table to enumerate symbols when an equation has many parts:

  ```markdown
  | Symbol | What it means |
  |---|---|
  | $\min_G$ | "Pick G's weights to make this number small." |
  | $D(x)$ | The Discriminator's probability that $x$ is real. |
  ```

- After every equation, write a **"Plain English version"** paragraph that restates it without notation.
- Code snippets are **PyTorch**, kept **≤50 lines** per snippet (with two exceptions: Module 8 ships a full ~250-line trainer; the FID evaluation script is also longer).
- Use the pattern: **intuition → math → code → diagnostic / failure mode.**
- Cover *what goes wrong* explicitly. Mode collapse, vanishing gradient, capacity imbalance, non-convergence — every module touching training should mention how to diagnose its failure modes.
- End each module with **Key papers** and **Exercises**.
- Use "modern" to mean state of the art as of early 2026.
- The end-to-end module (`08-end-to-end.md`) is the practical capstone. Code there must actually run.

**Special pattern unique to GAN handbook: hybrid module.** Module 7 (`07-vs-diffusion.md`) explicitly contrasts the handbook's topic with the competing approach (diffusion). Other handbooks may borrow this pattern.

---

## 5. Code Conventions Per Handbook

| Handbook | Language | Style |
|---|---|---|
| `ai-engineering-syllabus/` | None | Syllabus only, no code in the syllabus file itself |
| `llm-handbook/` | **Python** (PyTorch, HF Transformers) | Short snippets, modern API, real library names |
| `algorithms-handbook/` | **Java** (no exceptions) | Commented, idiomatic, Java 17+ |
| `computational-thinking-handbook/` | None | Unplugged activities, no computer required |
| `gan-handbook/` | **PyTorch** | Snippets ≤50 lines; Module 8 has the runnable trainer |

When agents add code to any handbook, **match the existing language and style**. Do not introduce a new language without a clear reason.

---

## 6. Math Notation Conventions

- Math uses LaTeX: `$inline$` for inline, `$$display$$` for display.
- The website renders LaTeX via **KaTeX** (loaded in `index.html`). Most syntax works; some `\begin{...}` blocks may not.
- **LLM handbook** — explain notation inline when introducing it.
- **GAN handbook** — explain notation in a dedicated table after each equation. This is the most demanding style and the gold standard for accessibility.
- **Algorithms handbook** — explain notation for Big-O, summations, recursion; assume basic linear algebra.
- **Computational Thinking handbook** — no formal math notation. Use words.

---

## 7. Website Infrastructure

The repository is also a static website. The runtime stack is intentionally simple — vanilla HTML/CSS/JS, no build step.

### 7.1 `index.html`

The single-page entry. Three views switched by JS:

- **Home** — `.header` + `.handbooks-grid` (a card per handbook).
- **Module list** — `#module-viewer` (after clicking a handbook).
- **Content** — `#content-viewer` (after clicking a module, renders markdown).

Theme toggle at top. Floating action buttons at bottom-left.

### 7.2 `js/app.js`

The brain. Three responsibilities:

1. **Handbook registry** — the `handbooks` object at the top of the file. Each handbook has:
   ```js
   'handbook-key': {
     title: 'Display Title',
     modules: [
       { file: 'README.md', name: 'Display Name', meta: true },
       { file: '01-foo.md', name: 'Foo' },
       { file: '11-appendix-A-toolkit.md', name: 'Toolkit', label: 'A' },
     ]
   }
   ```

2. **Module slot rendering.** Each module's slot label is derived from its registry entry:
   - If `meta: true` → slot label is `~` (tilde). Used for README, Learning Plan, Why GANs Exist, etc.
   - Else if `label: '...'` → slot label is the explicit string (used for appendices, e.g. `A`, `B`).
   - Else → slot label is `01`, `02`, ... auto-incremented across non-meta modules.

3. **Content loading.** Fetches the markdown from `https://raw.githubusercontent.com/kusandriadi/cs/main/<handbook-key>/<file>`, parses it with `marked`, and renders LaTeX with KaTeX.

### 7.3 `css/styles.css`

Theme variables at the top (light/dark via `[data-theme="..."]`). Card grid, viewer styles, KaTeX overrides, floating action buttons. No build step — edit and reload.

### 7.4 `manifest.json` and `sw.js`

PWA support. Installable from Chrome/Edge. Cached assets in `sw.js` for offline use. **Bump the cache version string in `sw.js` whenever the site logic changes** or users will be stuck on a stale version.

### 7.5 `icons/`

PWA icons in SVG. Two sizes (192, 512). If you change the brand mark, update both.

---

## 8. Handbook Registry — Adding a Module or Handbook

### 8.1 Adding a new module to an existing handbook

1. Create the markdown file in the appropriate directory (e.g. `gan-handbook/13-new-module.md`).
2. Add an entry to `js/app.js` in the right handbook's `modules` array, in reading order.
3. Decide:
   - **Numbered chapter?** Just `{ file: '...', name: 'Title' }`.
   - **Meta / guide doc?** Add `meta: true`.
   - **Appendix or labeled entry?** Add `label: 'A'`.
4. The `name` field should *not* include the slot number — the renderer adds it. So:
   - Right: `{ file: '02-pretraining.md', name: 'Pre-training' }`
   - Wrong: `{ file: '02-pretraining.md', name: '02. Pre-training' }` (duplicates the slot)
5. Update the handbook's own `README.md` reading order to mention the new file.

### 8.2 Adding a new handbook (full checklist)

1. **Decide the audience and tone before writing.** Document them in this AGENTS.md as a new subsection of §4.
2. Create the directory: `new-topic-handbook/`.
3. Write `README.md` with reading order, audience, prerequisites.
4. Number files sequentially: `00-overview.md`, `01-foo.md`, ..., appendix files at the end.
5. Use the conventions from §6 (math) and §5 (code) appropriate to the language.
6. Register the handbook in `js/app.js`:
   ```js
   'new-topic-handbook': {
     title: 'New Topic Handbook',
     modules: [ ... ]
   }
   ```
7. Add a card to `index.html` inside `.handbooks-grid`. Pick a representative emoji (the icon is HTML entity, e.g. `&#127912;` for 🎨).
8. Update the root `README.md`:
   - Add a row to the topics table.
   - Add the directory to the structure tree.
   - Add to "How to Use" if relevant.
   - Add to "Recommended Textbooks" if there is a canonical book.
9. Update **this** `AGENTS.md`:
   - Add a row to §3 (the five handbooks table).
   - Add a subsection in §4 with the full style guide.
   - Update §5 (code conventions table).
10. (Optional) Render presentation slides via Marp into `presentations/<handbook-name>/`.
11. Bump `sw.js` cache version if you changed any non-handbook files.

### 8.3 Slot numbering — the design intent

The slot system was designed to allow:
- Meta docs (README, Learning Plan, overviews) to render as `~`.
- Numbered chapters to render as `01`, `02`, ..., auto-incrementing.
- Appendices to render with explicit letters (`A`, `B`, ...).

**Critical:** Do not put chapter numbers in the `name` field. The slot is the chapter number. If you do, you get visible duplicates like "01 01. Foundations" — which was a real bug we fixed.

---

## 9. Common Patterns Across Handbooks

### 9.1 `README.md` per handbook

Every handbook has a `README.md` that includes:
- One-line description.
- Audience.
- Read-in-this-order list.
- (Optional) suggested paths by role.
- How to use.
- Conventions.

### 9.2 Learning plan files

LLM and GAN handbooks include a learning plan with three paces (e.g. sprint / standard / deep). When adding one to a new handbook, follow the same three-track structure with concrete day-by-day or week-by-week assignments.

### 9.3 Essential reading files

Tier 1 / Tier 2 / Tier 3 paper lists with brief annotations. Tier 1 is "must read." Tier 3 is "read only if going deep into a sub-area."

### 9.4 Math notation explanation (GAN-style)

The GAN handbook's pattern is the most accessible. When introducing a complex equation:

```markdown
$$\min_G \max_D \; V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + ...$$

**Notation.**

| Symbol | What it means |
|---|---|
| $V(D, G)$ | The "value function." A single number that depends on both networks. |
| $\min_G$ | "Pick G's weights to make this number small." |
...

**Plain-English version:**

> "Pick G to minimize, and D to maximize, the following: ..."
```

Use this pattern when targeting undergrad readers or whenever notation is dense.

### 9.5 Worked-example pattern

In code-heavy modules, show a snippet then explain what each block does. Snippets ≤50 lines unless the snippet IS the lesson (Module 8 trainer in GAN handbook, ≤300 lines).

### 9.6 "What goes wrong" sections

Especially in technical handbooks (LLM, GAN), include failure mode discussions. For GAN handbook this is mandatory in any module that touches training. For LLM handbook it's encouraged.

---

## 10. KaTeX, Markdown, and Rendering Caveats

- KaTeX renders most LaTeX. **Avoid** `\begin{align}` and other AMSmath environments — use `$$ ... $$` directly with line breaks.
- `marked` renders the markdown. GFM tables, code blocks (with language tags), and inline HTML all work.
- Code blocks should have a language tag (` ```python `, ` ```java `, ` ```bash `) so the future syntax-highlighting upgrade works.
- Do not embed images via raw HTML `<img>` unless necessary. Use `![alt](url)` so future link rewriting is easier.

---

## 11. Presentations

`presentations/<handbook-name>/` contains Marp-rendered HTML slide decks corresponding to each module's markdown. They are generated from the `.md` files in the same folder. When you add a new module **and** want slides:

1. Add a Marp directive at the top of the module file (or in a copy).
2. Render with: `marp <file>.md --html --allow-local-files`.
3. Output goes alongside the source as `<file>.html`.

We do not currently auto-generate slides for the GAN handbook. Add only if explicitly requested.

---

## 12. Anti-Patterns To Avoid

- ❌ AI-sounding sentences: "This module provides a comprehensive overview of...", "Let's delve into...", "It is important to note that..." — rewrite to sound human.
- ❌ Mixing languages in the CT handbook. **CT handbook content body is Bahasa Indonesia only.** English loanwords are OK in technical terms with Indonesian gloss.
- ❌ Adding chapter numbers in `name` fields in `js/app.js`. The slot label IS the number.
- ❌ Using `nn.Linear` toy code in the GAN handbook when the lesson requires conv layers. Match the complexity to the lesson.
- ❌ Generic "Conclusion" sections that repeat what was already said. Each module should end with concrete artifacts (key papers, exercises, quiz) not bromides.
- ❌ Marketing language ("powerful," "robust," "industry-leading"). Be specific instead.
- ❌ Skipping the "what goes wrong" discussion in GAN training modules.
- ❌ Embedding emojis in handbook content files (the user does not want emojis added unless they already exist in the file or the user explicitly requests).
- ❌ Breaking the slot numbering by mixing `meta: true`, `label: '...'`, and plain entries randomly. Use the conventions in §8.

---

## 13. Quality Checklist (Before Committing)

- [ ] Content language matches the target audience (no jargon for kids, no oversimplification for professionals).
- [ ] Every new technical term is explained when first used.
- [ ] Every module has a clear "why this matters" motivation up front.
- [ ] Code is commented and runnable.
- [ ] Math notation is explained, GAN-table style for dense equations.
- [ ] No AI-sounding sentences.
- [ ] No emojis sneaked into content files.
- [ ] `js/app.js` registry updated (if new module or handbook).
- [ ] `index.html` card added (if new handbook).
- [ ] Root `README.md` updated (if new handbook).
- [ ] This `AGENTS.md` updated (if new handbook).
- [ ] PWA cache version in `sw.js` bumped (if site logic changed).
- [ ] Slot labels look correct in the rendered module list. No "01 01. Foo" duplicates.
- [ ] KaTeX renders cleanly on the website (no `\begin{align}` traps).

---

## 14. Quick Reference: Where to Edit What

| Goal | File(s) |
|---|---|
| Add a new chapter to an existing handbook | `<handbook>/NN-foo.md`, `js/app.js` (registry), `<handbook>/README.md` |
| Add a new handbook | New directory, `js/app.js`, `index.html`, root `README.md`, `AGENTS.md` |
| Fix a typo in a chapter | The single `.md` file |
| Change the website theme | `css/styles.css` (CSS variables at top) |
| Change navigation behavior | `js/app.js` |
| Change PWA install metadata | `manifest.json` |
| Force fresh load for all users | Bump cache version in `sw.js` |
| Update math notation explanation | The `.md` file (don't touch KaTeX in HTML) |
| Add a slide deck | Marp on the source `.md`, output to `presentations/<handbook>/...` |

---

## 15. Project Identity

This project is owned by **Kus Andriadi**. Public site: [cs.kusandriadi.com](https://cs.kusandriadi.com). License: MIT.

The voice across the handbooks is unified by one belief: **a real person, writing for a specific reader, beats a generic textbook.** Every change should preserve that.
