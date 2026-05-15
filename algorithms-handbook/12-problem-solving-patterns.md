# Module 12: Problem-Solving Patterns

## Introduction

Knowing algorithms is necessary but not sufficient. The real skill is recognizing *which* algorithm or technique to apply to a new problem. This module is a meta-guide: how to read a problem statement, identify patterns, and map them to the right approach. It covers common interview patterns, competitive programming strategies, and a practice roadmap.

---

## The Problem-Solving Framework

### Step 1: Understand the Problem

- Read the problem statement **twice**.
- Identify the **input** (type, size, constraints) and **output** (what exactly to return).
- Work through the **examples** by hand.
- Ask: What are the **edge cases**? (empty input, single element, all identical, maximum values, negative numbers)

### Step 2: Classify the Problem

Ask these questions in order:

1. **Is it a graph problem?** (Nodes/edges, connectivity, paths, cycles, trees)
2. **Is it a string problem?** (Pattern matching, substrings, palindromes, character counting)
3. **Is it an array/sequence problem?** (Subarrays, subsequences, intervals, sorting)
4. **Does it involve optimization?** (Minimize/maximize something)
5. **Does it involve counting?** (Number of ways, paths, combinations)
6. **Does it involve a yes/no feasibility check?**

### Step 3: Identify the Technique

Based on constraints and problem type, narrow down the technique.

### Step 4: Implement and Test

Write clean code. Test with examples and edge cases. Analyze complexity.

---

## Constraint-Based Technique Selection

The input size often dictates the acceptable time complexity:

| Input Size $n$ | Target Complexity | Likely Techniques |
|-----------------|-------------------|-------------------|
| $n \leq 10$ | $O(n!)$ or $O(2^n \cdot n)$ | Brute force, backtracking, bitmask DP |
| $n \leq 20$ | $O(2^n)$ | Bitmask DP, meet in the middle |
| $n \leq 500$ | $O(n^3)$ | Floyd-Warshall, DP on intervals |
| $n \leq 5{,}000$ | $O(n^2)$ | DP, two pointers, nested loops |
| $n \leq 10^5$ | $O(n \log n)$ | Sorting, binary search, segment tree, merge sort |
| $n \leq 10^6$ | $O(n)$ or $O(n \log n)$ | Linear scan, two pointers, sliding window, hashing |
| $n \leq 10^9$ | $O(\log n)$ or $O(\sqrt{n})$ | Binary search on answer, math |

---

## Pattern Recognition Guide

### Pattern 1: Sliding Window

**Signals:**
- "Find the longest/shortest subarray/substring satisfying some condition"
- Contiguous elements, window of variable or fixed size
- Condition involves sums, counts, distinct elements, or character frequencies

**Examples:**
- Longest substring without repeating characters
- Minimum window substring
- Maximum sum subarray of size $k$
- Smallest subarray with sum $\geq$ target

**Template:**

```java
int left = 0;
for (int right = 0; right < n; right++) {
    // Expand window: add arr[right] to window state
    while (windowInvalid()) {
        // Shrink window: remove arr[left] from window state
        left++;
    }
    // Update answer
}
```

### Pattern 2: Two Pointers

**Signals:**
- Sorted array
- "Find pair/triplet with certain sum"
- "Remove duplicates"
- "Merge two sorted arrays"
- "Partition array"

**Examples:**
- Two sum (sorted)
- Three sum
- Container with most water
- Remove duplicates from sorted array
- Merge two sorted arrays

### Pattern 3: Binary Search

**Signals:**
- Sorted array or **monotonic predicate** ("is it possible to achieve X with parameter $k$?")
- "Find minimum/maximum value that satisfies a condition"
- $O(\log n)$ is needed

**Key insight:** Binary search applies not just to sorted arrays but to any monotonic function. If $f(x)$ transitions from `false` to `true` (or vice versa), binary search finds the transition point.

**Examples:**
- Search in sorted array
- Find first/last occurrence
- Minimum capacity to ship packages in $D$ days
- Split array largest sum
- Koko eating bananas

### Pattern 4: BFS / DFS

**Signals:**
- Graph or grid problems
- "Shortest path" (BFS for unweighted)
- "Connected components" or "reachability"
- "Number of islands"
- Tree traversals

**When to use which:**
- **BFS:** Shortest path (unweighted), level-order traversal, minimum steps
- **DFS:** Connectivity, cycle detection, topological sort, path finding, backtracking on grids

### Pattern 5: Dynamic Programming

**Signals:**
- "Find the minimum/maximum..."
- "How many ways..."
- "Is it possible to..."
- Overlapping subproblems (recursive solution recomputes the same states)
- Problem can be decomposed into stages with a clear state transition

**Common DP categories:**

| Category | State | Example |
|----------|-------|---------|
| 1D | $dp[i]$ | Climbing stairs, house robber |
| 2D | $dp[i][j]$ | LCS, edit distance, knapsack |
| Interval | $dp[i][j]$ on range | Matrix chain, burst balloons |
| Bitmask | $dp[\text{mask}]$ | TSP, assignment problem |
| On trees | $dp[\text{node}]$ | Tree diameter, tree DP |
| On digits | $dp[\text{pos}][\text{tight}]$ | Count numbers with property |

### Pattern 6: Greedy

**Signals:**
- "Minimum number of..." or "Maximum number of..."
- Interval scheduling or selection
- Problem has a natural "sort and process" structure
- Greedy choice property can be argued

**Verification:** If a greedy approach seems to work, try to find a counterexample. If you can't, try to prove correctness via exchange argument.

### Pattern 7: Union-Find

**Signals:**
- "Connected components" (especially dynamic: edges added over time)
- "Are two elements in the same group?"
- Kruskal's MST
- Accounts merging

### Pattern 8: Monotonic Stack / Queue

**Signals:**
- "Next greater/smaller element"
- "Largest rectangle in histogram"
- "Sliding window maximum/minimum"
- "Stock span"

### Pattern 9: Backtracking

**Signals:**
- "Generate all..." (permutations, combinations, subsets, valid parentheses)
- "Find all solutions"
- Constraint satisfaction (N-Queens, Sudoku)
- Small input size ($n \leq 15$--$20$)

### Pattern 10: Topological Sort

**Signals:**
- Directed acyclic graph (DAG)
- "Order tasks respecting dependencies"
- "Course schedule"
- "Build order"

---

## Interview Problem Solving

### The UMPIRE Framework

1. **U**nderstand: Clarify the problem. Ask about edge cases, constraints, and expected output format.
2. **M**atch: Match the problem to known patterns and data structures.
3. **P**lan: Outline your approach before coding. State the algorithm, time complexity, and space complexity.
4. **I**mplement: Write clean, modular code.
5. **R**eview: Trace through an example. Check for off-by-one errors, null checks, and edge cases.
6. **E**valuate: Discuss trade-offs. Can you optimize? What if the constraints change?

### Common Interview Problem Categories

**Arrays and Strings:**
- Two sum, three sum
- Maximum subarray (Kadane's)
- Product of array except self
- Trapping rain water
- Rotate array

**Linked Lists:**
- Reverse a linked list
- Detect cycle (Floyd's tortoise and hare)
- Merge two sorted lists
- Find middle node

**Trees:**
- Invert binary tree
- Validate BST
- Lowest common ancestor
- Level-order traversal
- Serialize/deserialize

**Graphs:**
- Number of islands (BFS/DFS on grid)
- Clone graph
- Course schedule (topological sort)
- Word ladder (BFS)

**Dynamic Programming:**
- Climbing stairs
- Coin change
- Longest increasing subsequence
- Word break
- Edit distance

**Design:**
- LRU Cache (HashMap + doubly linked list)
- Min Stack
- Trie (prefix tree)

### Time Management in Interviews

- **0--5 min:** Understand the problem, ask questions.
- **5--10 min:** Discuss approach, state complexity.
- **10--30 min:** Implement.
- **30--35 min:** Test with examples, fix bugs.
- **35--45 min:** Optimize, discuss follow-ups.

### Common Mistakes

1. **Jumping to code too fast.** Plan first.
2. **Not considering edge cases.** Empty input, single element, duplicates, negatives, overflow.
3. **Off-by-one errors.** Especially in binary search, sliding window, and DP indices.
4. **Using the wrong data structure.** HashMap vs. TreeMap, ArrayList vs. LinkedList.
5. **Not analyzing complexity.** Always state time and space complexity.
6. **Overcomplicating the solution.** Start with brute force, then optimize.

---

## Competitive Programming Strategies

### Speed Tips

1. **Template:** Have a ready-made template with I/O setup, common imports.
2. **Know your library:** Java's `Arrays.sort`, `Collections`, `PriorityQueue`, `TreeMap`, `BitSet`.
3. **Fast I/O:**

```java
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        StringTokenizer st;

        int n = Integer.parseInt(br.readLine().trim());
        st = new StringTokenizer(br.readLine());
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = Integer.parseInt(st.nextToken());
        }

        // ... solve ...

        System.out.print(sb);
    }
}
```

4. **Pre-compute:** Factorials, primes (sieve), prefix sums.
5. **Avoid creating objects in tight loops:** Reuse arrays; avoid `ArrayList` when `int[]` suffices.

### Contest Strategy

1. **Read all problems first.** Identify easy, medium, and hard.
2. **Solve easy problems fast.** Build momentum, secure points.
3. **Spend time thinking before coding.** A clear plan avoids debugging.
4. **Use brute force to verify.** Write a brute-force solution and check against your optimized one on random inputs.
5. **Don't get stuck.** If a problem takes more than 30--40 minutes without progress, move on.

### Common Competitive Programming Topics (Priority Order)

1. Data structures (arrays, stacks, queues, heaps, segment trees, Fenwick trees)
2. Graph algorithms (BFS, DFS, shortest paths, MST, flows)
3. Dynamic programming (all types)
4. Number theory (GCD, modular arithmetic, sieve, modular exponentiation)
5. String algorithms (KMP, hashing, trie)
6. Geometry (convex hull, line intersection -- less common but appears)
7. Combinatorics (counting, inclusion-exclusion)

---

## Practice Roadmap

### Phase 1: Foundations (Weeks 1--4)

- Master: Arrays, strings, sorting, binary search, hash maps
- Practice: 50 easy problems on LeetCode
- Focus: Clean code, correct complexity analysis

### Phase 2: Core Techniques (Weeks 5--10)

- Master: Recursion, backtracking, BFS/DFS, basic DP, two pointers, sliding window
- Practice: 50 medium problems (mix of topics)
- Focus: Pattern recognition, optimal solutions

### Phase 3: Advanced (Weeks 11--16)

- Master: Graph algorithms, advanced DP, greedy proofs, segment trees, union-find
- Practice: 50 medium and 20 hard problems
- Focus: Hard problems, multiple approaches, optimizations

### Phase 4: Mastery (Ongoing)

- Weekly contests (LeetCode, Codeforces, AtCoder)
- Virtual contests for time pressure practice
- Revisit and resolve problems you previously struggled with
- Study editorial solutions for problems you couldn't solve

### Daily Practice Routine

1. **Warm-up (15 min):** Solve 1 easy problem.
2. **Main practice (60 min):** Solve 1--2 medium problems.
3. **Study (30 min):** Read a new topic or study an editorial.
4. **Review (15 min):** Revisit a problem from a week ago (spaced repetition).

---

## Problem-to-Technique Quick Reference

| Problem Type | First Technique to Try |
|-------------|------------------------|
| "Find pair summing to target" | Two pointers (sorted) or hash map |
| "Longest/shortest subarray with property" | Sliding window |
| "Minimum X to achieve Y" | Binary search on answer |
| "Number of ways" | DP (or math/combinatorics) |
| "Generate all..." | Backtracking |
| "Shortest path" | BFS (unweighted) or Dijkstra (weighted) |
| "Connected components" | BFS/DFS or Union-Find |
| "Task ordering with dependencies" | Topological sort |
| "Next greater element" | Monotonic stack |
| "Range sum with updates" | Fenwick tree or segment tree |
| "Is it possible to partition/form X" | DP (subset/knapsack) |
| "Minimum number of intervals to cover" | Greedy (sort by endpoint) |
| "Pattern in string" | KMP, Rabin-Karp, or Trie |

---

## Quiz

**Q1.** You are given an array of positive integers and a target sum. You need to find the minimum length subarray with sum at least equal to the target. What technique do you use?

**A1.** Sliding window (variable size). Expand the right pointer to increase the sum, and shrink from the left when the sum meets or exceeds the target, tracking the minimum window size.

---

**Q2.** A problem asks: "Given $n \leq 18$ items with weights and values, find the maximum value subset with weight $\leq W$." The constraint $n \leq 18$ suggests which technique?

**A2.** Bitmask DP or brute-force enumeration of all $2^{18} = 262{,}144$ subsets. This is small enough for exponential approaches. Bitmask DP with states representing subsets and transitions adding one item at a time would work efficiently.

---

**Q3.** You need to determine if a course schedule is achievable given prerequisite pairs. What algorithm do you use?

**A3.** Model the courses and prerequisites as a directed graph and perform topological sort (Kahn's algorithm or DFS-based). If the topological sort includes all courses, the schedule is achievable. If a cycle is detected, it is not.

---

**Q4.** What is the UMPIRE framework, and why is it useful in interviews?

**A4.** UMPIRE stands for Understand, Match, Plan, Implement, Review, Evaluate. It provides a structured approach to problem-solving in interviews, ensuring you don't skip critical steps (like understanding the problem fully before coding) and that you discuss trade-offs and optimizations.

---

**Q5.** You are given a sorted array and need to find the first position where a value could be inserted. What technique do you use?

**A5.** Binary search (lower bound variant). The `lowerBound` function returns the index of the first element $\geq$ the target value. Time: $O(\log n)$.

---

**Q6.** A problem says: "Find the minimum number of meeting rooms required." What pattern does this match?

**A6.** Interval problem -- specifically, interval partitioning. Sort events (starts and ends), use a sweep line approach: increment a counter at each start, decrement at each end, and track the maximum. Alternatively, use a min-heap to track room end times.

---

**Q7.** How do you decide between BFS and DFS for a graph problem?

**A7.** Use **BFS** when you need shortest path in unweighted graphs, level-by-level processing, or minimum steps/moves. Use **DFS** when you need to explore all paths, detect cycles, perform topological sort, find connected/strongly connected components, or solve problems with backtracking.

---

**Q8.** You are told $n \leq 10^6$. Which of the following complexities are acceptable: $O(n)$, $O(n \log n)$, $O(n \sqrt{n})$, $O(n^2)$?

**A8.** $O(n)$ and $O(n \log n)$ are acceptable (about $10^6$ and $2 \times 10^7$ operations respectively). $O(n \sqrt{n}) \approx 10^9$ is borderline (may work with a small constant but risky). $O(n^2) = 10^{12}$ is far too slow.
