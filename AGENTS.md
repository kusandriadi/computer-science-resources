# AGENTS.md

Guidelines for AI agents working on this repository.

## Repository Overview

This is a collection of computer science learning materials. Each topic lives in its own directory with numbered markdown files. The repository serves four distinct audiences, and every piece of writing must match its target reader.

## Structure

| Directory | Target Audience | Tone & Style |
|-----------|----------------|--------------|
| `ai-engineering-syllabus/` | University students, semesters 1–4, from both IT and non-IT backgrounds | Friendly, encouraging teacher. Jargon is always explained in parentheses or in context. Every course has a Week 0 crash course for students with no prior experience. Self-check checklists help students assess readiness. "Why this matters" motivations appear before technical weeks. |
| `llm-handbook/` | ML engineers, researchers, and working professionals | Knowledgeable colleague — technically precise but conversational. Like explaining over coffee, not lecturing from a podium. Intuitive analogies before formal math. Paper references are expected and welcome. |
| `algorithms-handbook/` | CS students and software engineers | Engaging teacher. Real-world examples and intuition come BEFORE formal definitions and code. Every algorithm is explained step-by-step with Java implementations. Every module ends with a quiz. |
| `computational-thinking-handbook/` | Elementary school students, grades 1–6 (ages 6–12) | Fun, energetic, encouraging. Simple English with short sentences. No jargon. Real-life analogies (cooking, LEGO, games, school). All activities are "unplugged" (no computer required). The tone should make a 10-year-old excited to learn, not bored. |

## Audience-Specific Guidelines

### AI Engineering Syllabus
- Students may have NO prior IT background (coming from general high school, not computer science).
- English is likely their second language.
- Every technical term must be explained the first time it appears.
- Course overviews should start with a relatable question or everyday scenario, not a list of buzzwords.
- Week 0 exists for every course (02–07) to provide a foundation crash course.
- Each course has a "Self-Check: Am I Ready?" checklist after the prerequisites section.
- Avoid marketing language ("comprehensive", "cutting-edge", "industry-leading"). Just be clear and helpful.

### LLM Handbook
- Readers are technically competent but may be new to LLMs specifically.
- Assume familiarity with ML basics (loss functions, SGD, backprop).
- Do NOT assume familiarity with LLM-specific concepts (attention, tokenization, RLHF) — explain these from scratch.
- Use the pattern: **intuition → example → formal definition → code**.
- Reference papers by author and year (e.g., "Vaswani et al. 2017").
- When introducing a dense section, add a one-sentence bridge: "Here's the key insight..." or "Before the math, let's build intuition..."

### Algorithms Handbook
- All code examples must be in **Java**.
- Every module must end with a **Quiz** section (5–8 questions with answers).
- Start each module with a real-world motivation (e.g., Google Maps for graph algorithms, Netflix for sorting).
- Explain the "why" before the "how". Students should understand the problem before seeing the solution.
- Add comments to code. A student should understand what each line does without reading the surrounding text.

### Computational Thinking Handbook
- Write for a 10-year-old. If a 10-year-old wouldn't understand a sentence, rewrite it.
- Use analogies from everyday life: cooking, cleaning your room, playing games, going to school.
- Every module (01–07) must end with a quiz/challenge and answer key.
- Activities must be doable without a computer ("unplugged").
- Use encouraging language: "You're doing great!", "Ready for a challenge?", "Let's try something cool!"
- Avoid: "In this module, we will explore..." Use instead: "Let's discover..."
- Module 09 (For Teachers and Parents) targets adults — keep it professional but warm.

## Conventions

- Each topic has a `README.md` with module overview and reading order.
- Files are numbered sequentially: `00-overview.md`, `01-topic.md`, etc.
- Code examples: **Java** in algorithms-handbook, **Python** in llm-handbook.
- Math uses LaTeX notation (`$...$`).
- No emojis in content files unless the file already uses them.

## When Adding New Topics

1. Create a new directory with a descriptive kebab-case name (e.g., `database-fundamentals/`).
2. Define the target audience and tone BEFORE writing.
3. Add `README.md` with module list and reading order.
4. Number files sequentially starting from `00-overview.md`.
5. Update the root `README.md` topics table.
6. Update this `AGENTS.md` file with the new topic's audience and style guidelines.
7. Ensure every module has real-world motivation and humanized language.

## Quality Checklist

Before committing changes, verify:

- [ ] Language matches the target audience (no jargon for kids, no oversimplification for professionals).
- [ ] Every technical term is explained before or when it is first used.
- [ ] Every module has a clear "why this matters" motivation.
- [ ] Code examples are commented and readable.
- [ ] No sentences that sound robotic or AI-generated ("This module provides a comprehensive overview of...").
- [ ] Tone is consistent within each handbook.
