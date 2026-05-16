---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 06: Dynamic Programming

**Why this matters:** DP transforms exponential brute-force solutions into polynomial ones by caching subproblem results. It is the most important technique for optimization and counting problems.

---

# Real-World Motivation

**GPS navigation:** Finding the shortest route through a city reuses shortest paths to intermediate intersections -- you don't recompute the path from scratch for each destination.

**Spell check:** Edit distance between two words builds on edit distances of their prefixes.

DP = **remembering answers to subproblems** so you never solve the same one twice.

---

# Two Properties Required for DP

1. **Overlapping Subproblems:** The same subproblem is solved multiple times
   - Fibonacci: fib(3) computed twice in fib(5)

2. **Optimal Substructure:** Optimal solution contains optimal solutions to subproblems
   - Shortest path: subpath of shortest path is also shortest

If your problem has both, DP applies.

---

# Top-Down vs Bottom-Up

**Top-Down (Memoization):** Recurse + cache
```java
long fib(int n, long[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = fib(n-1, memo) + fib(n-2, memo);
}
```

**Bottom-Up (Tabulation):** Fill table iteratively
```java
long fib(int n) {
    long[] dp = new long[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
```

---

# The DP Framework

For any DP problem, follow these steps:

1. **Define the state:** What does dp[i] represent?
2. **Write the recurrence:** How does dp[i] relate to smaller states?
3. **Identify base cases:** What are the trivial states?
4. **Determine computation order:** Which states must be computed first?
5. **Extract the answer:** Where is the final answer?
6. **Optimize space** (optional): Can you reduce dimensions?

---

# 0/1 Knapsack

**Problem:** n items with weights w[i] and values v[i], capacity W. Maximize value.

**State:** dp[i][j] = max value using items 0..i-1 with capacity j

```java
for (int i = 1; i <= n; i++)
    for (int j = 0; j <= W; j++) {
        dp[i][j] = dp[i-1][j];  // skip item
        if (w[i-1] <= j)
            dp[i][j] = Math.max(dp[i][j],
                dp[i-1][j-w[i-1]] + v[i-1]); // take
    }
```

**Time:** O(nW) | **Space:** O(nW), optimizable to O(W)
**Key:** Iterate j **backwards** in 1D version (each item used at most once).

---

# Longest Common Subsequence (LCS)

**State:** dp[i][j] = LCS length of s[0..i-1] and t[0..j-1]

```java
if (s.charAt(i-1) == t.charAt(j-1))
    dp[i][j] = dp[i-1][j-1] + 1;
else
    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
```

**Time:** O(mn) | **Space:** O(mn)

**Reconstruction:** Trace back through the table following the choices made.

---

# Longest Increasing Subsequence (LIS)

**O(n^2) DP:**
```java
dp[i] = 1; // every element is a LIS of length 1
for (int j = 0; j < i; j++)
    if (nums[j] < nums[i])
        dp[i] = Math.max(dp[i], dp[j] + 1);
```

**O(n log n) with binary search:**
Maintain `tails[]` where tails[k] = smallest ending element of LIS of length k+1. Binary search for each new element.

---

# Coin Change

**Min coins to make amount n:**
```java
dp[0] = 0;
for (int j = 1; j <= amount; j++)
    for (int coin : coins)
        if (coin <= j)
            dp[j] = Math.min(dp[j], dp[j-coin] + 1);
```

**Count number of ways:**
```java
dp[0] = 1;
for (int coin : coins)        // coins OUTER
    for (int j = coin; j <= amount; j++)
        dp[j] += dp[j - coin];
```

Coins outer = **combinations**. Amounts outer = **permutations**.

---

# Edit Distance (Levenshtein)

**State:** dp[i][j] = min edits to transform s[0..i-1] to t[0..j-1]

```java
if (s.charAt(i-1) == t.charAt(j-1))
    dp[i][j] = dp[i-1][j-1];     // no edit
else
    dp[i][j] = 1 + min(
        dp[i-1][j-1],  // replace
        dp[i-1][j],    // delete
        dp[i][j-1]);   // insert
```

**Time:** O(mn) | **Space:** O(mn), optimizable to O(min(m,n))

"kitten" -> "sitting" = 3 edits

---

# Matrix Chain Multiplication

**State:** dp[i][j] = min cost to multiply matrices A_i through A_j

```java
for (int len = 2; len <= n; len++)
    for (int i = 1; i <= n-len+1; i++) {
        int j = i + len - 1;
        dp[i][j] = INF;
        for (int k = i; k < j; k++)
            dp[i][j] = min(dp[i][j],
                dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]);
    }
```

**Time:** O(n^3) | **Space:** O(n^2)

---

# DP on Strings: Common Pattern

```java
int[][] dp = new int[m + 1][n + 1];
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        if (s.charAt(i-1) == t.charAt(j-1))
            dp[i][j] = dp[i-1][j-1] + /* bonus */;
        else
            dp[i][j] = /* combine neighbors */;
```

This template covers: LCS, edit distance, longest common substring, and many variants.

---

# Bitmask DP: TSP Example

For problems with subsets of small sets (n <= 20):

```java
// dp[mask][i] = min cost to visit cities in mask,
//               ending at city i
for (int mask = 1; mask < (1 << n); mask++)
    for (int u = 0; u < n; u++)
        for (int v = 0; v < n; v++)
            if (!(mask & (1 << v)))
                dp[mask|(1<<v)][v] = min(...,
                    dp[mask][u] + dist[u][v]);
```

**Time:** O(2^n * n^2) -- exponential but much better than O(n!)

---

# Recognizing DP Problems

| Signal | Example |
|--------|---------|
| "Find the minimum/maximum..." | Knapsack, shortest path |
| "How many ways..." | Coin change ways, climbing stairs |
| "Is it possible to..." | Subset sum, word break |
| Overlapping subproblems | Fibonacci, grid paths |
| Optimal substructure | Shortest path contains shortest subpaths |

**DP vs Greedy:** DP considers all options; Greedy commits locally.
**DP vs D&C:** DP has overlapping subproblems; D&C has independent ones.

---

# Space Optimization

When dp[i] only depends on dp[i-1], use two rows or rolling variables:

```java
// Fibonacci: O(1) space
long prev2 = 0, prev1 = 1;
for (int i = 2; i <= n; i++) {
    long curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
}
```

0/1 Knapsack: 2D -> 1D array (iterate j backwards).

---

# Quiz

1. **What two properties must a problem have for DP?**
2. **In 0/1 knapsack (1D), why iterate capacity backwards?**
3. **Edit distance of "kitten" and "sitting"?**
4. **Naive recursive Fibonacci: O(2^n). Memoized: O(n). Why?**

---

# Quiz Answers

1. **Overlapping subproblems** + **Optimal substructure**

2. Backwards ensures dp[j - w[i]] reflects the previous item's state, preventing the same item from being used multiple times.

3. **3:** kitten -> sitten (replace k/s) -> sittin (replace e/i) -> sitting (insert g)

4. Memoization ensures each of n+1 subproblems is computed exactly once, each in O(1). Total: O(n).
