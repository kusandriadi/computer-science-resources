---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 13: Essential Reading

**Why this matters:** No single resource is sufficient to master algorithms. This curated guide covers the best books, courses, and platforms -- and how to use each one effectively.

---

# Real-World Motivation

You've finished this handbook. Now what?

- Need formal proofs? => CLRS
- Want Java implementations? => Sedgewick & Wayne
- Preparing for interviews? => CTCI + LeetCode
- Starting competitive programming? => Laaksonen + CSES

The right resource at the right time accelerates learning dramatically.

---

# Tier 1: Primary Textbooks

| Book | Best For | Key Feature |
|------|----------|-------------|
| **CLRS** (Cormen et al.) | Deep theory, reference | Comprehensive, rigorous, 4th ed. |
| **Sedgewick & Wayne** | Java programmers | All code in Java, free Coursera course |
| **Skiena** (Algorithm Design Manual) | Practitioners | War stories, problem catalog |
| **Jeff Erickson** (free online) | Self-learners | Excellent DP and graph chapters |
| **Weiss** (DS&A in Java) | Java university courses | Clean Java implementations |

**Most important for this handbook:** Sedgewick & Wayne (Java-aligned).

---

# How to Use CLRS

Do NOT read cover to cover.

**Use it as a reference:**
- Want formal proof of Dijkstra? Chapter 24.
- Red-black tree operations? Chapter 13.
- NP-Completeness? Chapter 34.

**Key chapters:** 1-4 (Foundations), 6-9 (Sorting), 15 (DP), 16 (Greedy), 22-26 (Graphs), 34 (NP-Completeness).

---

# Tier 2: Interview Preparation

| Book | Difficulty | Problems |
|------|-----------|----------|
| **Cracking the Coding Interview** (McDowell) | Medium | 189 problems + interview advice |
| **Elements of Programming Interviews in Java** (Aziz et al.) | Hard | 300+ problems, study plans |

**CTCI:** Start here. Work through by topic, weakest areas first.
**EPI:** Level up after CTCI. Harder problems, better Java code.

Both pair well with LeetCode practice.

---

# Tier 2: Competitive Programming

| Book | Best For | Key Feature |
|------|----------|-------------|
| **Competitive Programming** (Halim) | ICPC/IOI prep | Vast coverage, UVa references |
| **Guide to CP** (Laaksonen) | Beginners to CP | Concise, pairs with CSES |

**Start with Laaksonen + CSES Problem Set**, then move to Halim for advanced topics.

---

# Tier 3: Supplementary

| Book | Best For |
|------|----------|
| **Kleinberg & Tardos** | Rigorous proof techniques, network flows |
| **Grokking Algorithms** (Bhargava) | Complete beginners, visual learners |
| **Programming Pearls** (Bentley) | Sharpening practical thinking |
| **Algorithms Illuminated** (Roughgarden) | Stanford lectures companion |
| **Art of Computer Programming** (Knuth) | Reference, theoretical depth |
| **Discrete Mathematics** (Rosen) | Filling math prerequisites |

---

# Online Courses (Free)

| Course | Platform | Notes |
|--------|----------|-------|
| Algorithms I & II | Coursera | Sedgewick, Java, excellent |
| Intro to Algorithms | MIT OCW | CLRS-based, Leiserson & Demaine |
| CS 161 | Stanford YouTube | Roughgarden, great theory |
| DS & Algorithms | Khan Academy | Very beginner-friendly |

**Recommendation:** Start with Sedgewick's Coursera (Java + auto-graded assignments).

---

# Practice Platforms

| Platform | Best For | Difficulty |
|----------|----------|-----------|
| **LeetCode** | Interview prep | Easy to Hard |
| **Codeforces** | Competitive programming | Div 2A to Div 1E |
| **CSES** | Structured topic practice | Progressive |
| **HackerRank** | Beginners, structured tracks | Easy to Medium |
| **AtCoder** | High-quality CP problems | ABC to AGC |
| **Project Euler** | Math + algorithms | Varies |

---

# Curated Problem Lists

| List | Count | Best For |
|------|-------|----------|
| **Blind 75** | 75 | Quick interview coverage |
| **NeetCode 150** | 150 | Expanded Blind 75 |
| **LeetCode Top Interview** | ~150 | Most frequent at top companies |
| **Striver's SDE Sheet** | 191 | Popular in India |

**Start with Blind 75**, expand to NeetCode 150, then tackle additional problems by weak areas.

---

# How to Study Effectively

**Feynman Technique:**
Study -> Explain in simple terms -> Find gaps -> Fill gaps -> Repeat

**Spaced Repetition:**
Solve today -> Revisit in 1 day -> 3 days -> 7 days -> 30 days

**Deliberate Practice:**
Focus on problems JUST BEYOND your current skill. After failing, study the solution, then re-solve from scratch.

**Active Reading:**
Implement BEFORE looking at book's code. Do exercises, not just examples.

---

# Interview Prep Study Plan (8 weeks)

| Week | Focus |
|------|-------|
| 1 | Arrays, Strings, Hash Maps |
| 2 | Two Pointers, Sliding Window |
| 3 | Stacks, Queues, Linked Lists |
| 4 | Trees, BST, BFS, DFS |
| 5 | Graph Algorithms |
| 6 | Dynamic Programming |
| 7 | Backtracking, Greedy |
| 8 | Mock Interviews, Review |

---

# Competitive Programming Plan (16 weeks)

| Weeks | Focus | Platform |
|-------|-------|----------|
| 1-2 | I/O, Basic Data Structures | CSES Introductory |
| 3-4 | Complete Search, Greedy | Codeforces Div 2 A-B |
| 5-7 | DP (all types) | CSES DP section |
| 8-10 | Graphs (all algorithms) | CSES Graph section |
| 11-12 | Strings, Math | CSES Strings/Math |
| 13-14 | Segment Trees, Flows | Advanced topics |
| 15-16 | Contest Practice | Weekly Codeforces |

---

# Quiz

1. **Which textbook for a Java programmer who learns by implementation?**
2. **Difference between CLRS and Skiena?**
3. **Best platform for structured, topic-by-topic practice?**
4. **What is the Blind 75?**

---

# Quiz Answers

1. **"Algorithms" by Sedgewick & Wayne** -- all Java, free Coursera course, excellent visualizations.

2. **CLRS:** Comprehensive, formal, proof-heavy reference. **Skiena:** Practical, readable, war stories + problem catalog. CLRS for proofs, Skiena for intuition.

3. **CSES Problem Set** (cses.fi) -- organized by topic with increasing difficulty.

4. Curated list of **75 LeetCode problems** covering most common interview patterns. Created by a former Facebook engineer. Best for efficient interview prep.
