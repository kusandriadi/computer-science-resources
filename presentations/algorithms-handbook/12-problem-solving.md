---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 12: Problem-Solving Patterns

**Why this matters:** Knowing algorithms is necessary but not sufficient. The real skill is recognizing WHICH technique to apply to a new problem. This module is a meta-guide for pattern recognition.

---

# Real-World Motivation

You see a new problem in an interview. You have 30 minutes. You know 10+ algorithms. **Which one applies?**

The answer is almost always in the **constraints** and **problem structure.** Learn to read the signals, and the right technique reveals itself.

---

# The Problem-Solving Framework

1. **Understand:** Read twice. Identify input/output. Work examples by hand.
2. **Classify:** Graph? String? Array? Optimization? Counting?
3. **Identify technique:** Use constraints + problem type.
4. **Implement:** Write clean code.
5. **Test:** Trace examples. Check edge cases.

---

# Constraint-Based Technique Selection

| Input Size n | Target Complexity | Likely Techniques |
|--------------|-------------------|-------------------|
| n <= 10 | O(n!) or O(2^n * n) | Brute force, backtracking |
| n <= 20 | O(2^n) | Bitmask DP, meet in the middle |
| n <= 500 | O(n^3) | Floyd-Warshall, interval DP |
| n <= 5,000 | O(n^2) | DP, two pointers |
| n <= 10^5 | O(n log n) | Sorting, binary search, seg tree |
| n <= 10^6 | O(n) | Linear scan, sliding window, hashing |
| n <= 10^9 | O(log n) | Binary search on answer, math |

---

# Pattern 1: Sliding Window

**Signals:** "longest/shortest subarray/substring with property," contiguous elements, sums/counts/frequencies.

```java
int left = 0;
for (int right = 0; right < n; right++) {
    // expand: add arr[right]
    while (windowInvalid()) {
        // shrink: remove arr[left]
        left++;
    }
    // update answer
}
```

**Examples:** Longest substring without repeating, min window substring, max sum of size k.

---

# Pattern 2: Two Pointers

**Signals:** Sorted array, find pair/triplet with sum, remove duplicates, merge sorted arrays.

**Examples:**
- Two sum (sorted): O(n)
- Three sum: O(n^2)
- Container with most water: O(n)
- Remove duplicates: O(n)

Both pointers move toward each other or in the same direction.

---

# Pattern 3: Binary Search

**Signals:** Sorted array OR monotonic predicate, "find min/max that satisfies condition," O(log n) needed.

**Key insight:** Binary search works on ANY monotonic function, not just sorted arrays!

```java
// Binary search on answer
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
}
```

**Examples:** Ship packages in D days, split array largest sum, Koko eating bananas.

---

# Pattern 4: BFS / DFS

**When BFS:** Shortest path (unweighted), level-order, minimum steps.
**When DFS:** Connectivity, cycles, topological sort, backtracking on grids.

**Examples:**
- Number of islands (DFS/BFS on grid)
- Word ladder (BFS)
- Course schedule (topological sort)
- Clone graph (DFS/BFS)

---

# Pattern 5: Dynamic Programming

**Signals:** "min/max...", "how many ways...", "is it possible...", overlapping subproblems.

| Category | State | Example |
|----------|-------|---------|
| 1D | dp[i] | Climbing stairs, house robber |
| 2D | dp[i][j] | LCS, edit distance, knapsack |
| Interval | dp[i][j] on range | Matrix chain, burst balloons |
| Bitmask | dp[mask] | TSP, assignment |
| Tree | dp[node] | Tree diameter |

---

# Pattern 6: Greedy

**Signals:** "minimum/maximum number of...", interval scheduling, natural "sort and process."

**Verification:** Try to find a counterexample. If you can't, try to prove via exchange argument.

**Examples:** Activity selection, Huffman coding, fractional knapsack, min rooms.

---

# Patterns 7-10: Quick Reference

| Pattern | Signals |
|---------|---------|
| **Union-Find** | Connected components, dynamic edge additions, "same group?" |
| **Monotonic Stack** | Next greater/smaller element, largest rectangle, stock span |
| **Backtracking** | "Generate all...", constraint satisfaction, small n |
| **Topological Sort** | DAG, task ordering, dependencies, course schedule |

---

# The UMPIRE Interview Framework

1. **U**nderstand: Clarify problem, edge cases, constraints
2. **M**atch: Map to known patterns and data structures
3. **P**lan: State algorithm, time, space before coding
4. **I**mplement: Clean, modular code
5. **R**eview: Trace example, check off-by-one, null checks
6. **E**valuate: Trade-offs, optimizations, follow-ups

---

# Problem-to-Technique Quick Reference

| Problem Type | First Technique |
|-------------|-----------------|
| "Find pair summing to target" | Two pointers or hash map |
| "Longest subarray with property" | Sliding window |
| "Min X to achieve Y" | Binary search on answer |
| "Number of ways" | DP or combinatorics |
| "Generate all..." | Backtracking |
| "Shortest path" | BFS or Dijkstra |
| "Connected components" | BFS/DFS or Union-Find |
| "Task ordering" | Topological sort |
| "Next greater element" | Monotonic stack |
| "Range sum with updates" | Fenwick or segment tree |

---

# Interview Time Management

| Time | Activity |
|------|----------|
| 0-5 min | Understand, ask questions |
| 5-10 min | Discuss approach, state complexity |
| 10-30 min | Implement |
| 30-35 min | Test with examples, fix bugs |
| 35-45 min | Optimize, discuss follow-ups |

**Common mistakes:** Jumping to code too fast, ignoring edge cases, off-by-one errors, not analyzing complexity.

---

# Practice Roadmap

| Phase | Weeks | Focus |
|-------|-------|-------|
| Foundations | 1-4 | Arrays, strings, sorting, binary search, hash maps |
| Core | 5-10 | Recursion, BFS/DFS, basic DP, two pointers, sliding window |
| Advanced | 11-16 | Graphs, advanced DP, greedy, segment trees, union-find |
| Mastery | Ongoing | Weekly contests, hard problems, revisit old problems |

**Daily:** 1 easy (15 min) + 1-2 medium (60 min) + study (30 min) + review (15 min).

---

# Quiz

1. **n <= 18 items, maximize value with weight <= W. Which technique?**
2. **"Longest substring without repeating characters" -- which pattern?**
3. **How to decide between BFS and DFS for a graph problem?**
4. **n <= 10^6 -- which complexities are acceptable?**

---

# Quiz Answers

1. **Bitmask DP** or brute-force enumeration of all 2^18 = 262,144 subsets.

2. **Sliding window** (variable size with hash map tracking last seen positions).

3. **BFS** for shortest path (unweighted), minimum steps, level-order. **DFS** for connectivity, cycles, topological sort, path exploration.

4. **O(n) and O(n log n)** are fine. O(n sqrt(n)) ~ 10^9 is borderline. O(n^2) = 10^12 is too slow.
