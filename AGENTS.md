# AGENTS.md

Guidelines for AI agents working on this repository.

## Repository Overview

This is a collection of computer science learning materials. Each topic lives in its own directory with numbered markdown files.

## Structure

- `ai-engineering-syllabus/` — University-style AI/ML course syllabi (7 courses, 4 semesters)
- `llm-handbook/` — Deep-dive LLM reference (foundations to production)
- `algorithms-handbook/` — Algorithms & data structures handbook with Java code examples
- `computational-thinking-handbook/` — Computational thinking for elementary school students

## Conventions

- Each topic has a `README.md` with module overview and reading order
- Files are numbered sequentially: `00-overview.md`, `01-topic.md`, etc.
- Code examples in `algorithms-handbook/` use **Java**
- Code examples in `llm-handbook/` use **Python**
- `computational-thinking-handbook/` uses no code — only simple pseudocode and analogies
- Math uses LaTeX notation (`$...$`)
- Each module in `algorithms-handbook/` ends with a **Quiz** section

## Writing Style

- **ai-engineering-syllabus**: Formal, structured weekly schedule with topics, tools, and "What You'll Build" sections
- **llm-handbook**: Technical, research-oriented, references papers, aimed at ML engineers
- **algorithms-handbook**: Educational, step-by-step explanations, Java implementations, aimed at CS students and engineers
- **computational-thinking-handbook**: Simple English, fun tone, real-life analogies, aimed at children ages 6-12

## When Adding New Topics

1. Create a new directory with a descriptive kebab-case name (e.g., `database-fundamentals/`)
2. Add `README.md` with module list and reading order
3. Number files sequentially starting from `00-overview.md`
4. Update the root `README.md` topics table
5. Match the writing style to the target audience
