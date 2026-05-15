# Module 06: Dynamic Programming

## Introduction

Dynamic programming (DP) is arguably the most important algorithmic technique for solving optimization problems. It applies when a problem has **overlapping subproblems** (the same subproblem is solved multiple times) and **optimal substructure** (an optimal solution can be constructed from optimal solutions to subproblems).

DP transforms exponential brute-force solutions into polynomial ones by caching subproblem results. If recursion is about breaking problems apart, DP is about putting them back together efficiently.

Many engineers find DP intimidating. The key is a systematic approach: define the state, write the recurrence, decide on top-down or bottom-up, and handle the base cases.

---

## Top-Down vs. Bottom-Up

### Top-Down (Memoization)

Start with the original problem, recurse into subproblems, and cache results.

```java
// Fibonacci: top-down with memoization
public static long fib(int n, long[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
}
```

**Pros:** Natural to write (mirrors the recurrence directly), only computes needed subproblems.
**Cons:** Recursive call overhead, risk of stack overflow for deep recursion.

### Bottom-Up (Tabulation)

Fill a table iteratively, starting from the smallest subproblems.

```java
// Fibonacci: bottom-up tabulation
public static long fib(int n) {
    if (n <= 1) return n;
    long[] dp = new long[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

**Pros:** No recursion overhead, no stack overflow risk, often faster in practice.
**Cons:** Must compute all subproblems (even unnecessary ones), requires careful ordering.

### Space Optimization

When the DP state only depends on a few previous states, we can reduce space:

```java
// Fibonacci: O(1) space
public static long fib(int n) {
    if (n <= 1) return n;
    long prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        long curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

---

## The DP Framework

For any DP problem, work through these steps:

1. **Define the state:** What does $dp[i]$ (or $dp[i][j]$) represent?
2. **Write the recurrence (transition):** How does $dp[i]$ relate to smaller subproblems?
3. **Identify base cases:** What are the trivial states?
4. **Determine the computation order:** Which subproblems must be solved first?
5. **Extract the answer:** Where in the table is the final answer?
6. **(Optional) Optimize space:** Can we reduce the table dimensions?

---

## Classic DP Problems

### 1. 0/1 Knapsack

**Problem:** Given $n$ items with weights $w[i]$ and values $v[i]$, and a knapsack of capacity $W$, maximize the total value without exceeding capacity. Each item can be taken at most once.

**State:** $dp[i][j]$ = maximum value using items $0..i-1$ with capacity $j$.

**Recurrence:**
$$dp[i][j] = \begin{cases} dp[i-1][j] & \text{if } w[i-1] > j \text{ (can't take item)} \\ \max(dp[i-1][j],\; dp[i-1][j - w[i-1]] + v[i-1]) & \text{otherwise} \end{cases}$$

```java
public static int knapsack01(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= capacity; j++) {
            dp[i][j] = dp[i - 1][j]; // don't take item i
            if (weights[i - 1] <= j) {
                dp[i][j] = Math.max(dp[i][j],
                    dp[i - 1][j - weights[i - 1]] + values[i - 1]);
            }
        }
    }
    return dp[n][capacity];
}
```

**Time:** $O(nW)$. **Space:** $O(nW)$, optimizable to $O(W)$.

**Space-optimized version (1D array):**

```java
public static int knapsack01Optimized(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[] dp = new int[capacity + 1];

    for (int i = 0; i < n; i++) {
        // Iterate backwards to avoid using updated values
        for (int j = capacity; j >= weights[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
```

Note: iterating $j$ **backwards** is critical for 0/1 knapsack (ensures each item is used at most once).

---

### 2. Unbounded Knapsack

**Problem:** Same as 0/1 knapsack, but each item can be used unlimited times.

**State:** $dp[j]$ = maximum value with capacity $j$.

**Recurrence:** $dp[j] = \max_{w[i] \leq j}(dp[j - w[i]] + v[i])$

```java
public static int knapsackUnbounded(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];

    for (int j = 1; j <= capacity; j++) {
        for (int i = 0; i < weights.length; i++) {
            if (weights[i] <= j) {
                dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
            }
        }
    }
    return dp[capacity];
}
```

**Time:** $O(nW)$. **Space:** $O(W)$.

The key difference from 0/1: iterate $j$ **forwards** (allowing re-use of items).

---

### 3. Longest Common Subsequence (LCS)

**Problem:** Given two strings $s$ and $t$, find the length of their longest common subsequence.

**State:** $dp[i][j]$ = length of LCS of $s[0..i-1]$ and $t[0..j-1]$.

**Recurrence:**
$$dp[i][j] = \begin{cases} dp[i-1][j-1] + 1 & \text{if } s[i-1] = t[j-1] \\ \max(dp[i-1][j],\; dp[i][j-1]) & \text{otherwise} \end{cases}$$

```java
public static int longestCommonSubsequence(String s, String t) {
    int m = s.length(), n = t.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}
```

**Reconstructing the LCS:**

```java
public static String reconstructLCS(String s, String t, int[][] dp) {
    StringBuilder sb = new StringBuilder();
    int i = s.length(), j = t.length();
    while (i > 0 && j > 0) {
        if (s.charAt(i - 1) == t.charAt(j - 1)) {
            sb.append(s.charAt(i - 1));
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return sb.reverse().toString();
}
```

**Time:** $O(mn)$. **Space:** $O(mn)$, optimizable to $O(\min(m, n))$ if only the length is needed.

---

### 4. Longest Increasing Subsequence (LIS)

**Problem:** Find the length of the longest strictly increasing subsequence.

**DP approach ($O(n^2)$):**

```java
public static int lisDP(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);

    int maxLen = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    return maxLen;
}
```

**Binary search approach ($O(n \log n)$):**

Maintain a list `tails` where `tails[i]` is the smallest ending element of all increasing subsequences of length $i+1$.

```java
public static int lisBinarySearch(int[] nums) {
    List<Integer> tails = new ArrayList<>();

    for (int num : nums) {
        int pos = Collections.binarySearch(tails, num);
        if (pos < 0) pos = -(pos + 1); // insertion point

        if (pos == tails.size()) {
            tails.add(num);
        } else {
            tails.set(pos, num);
        }
    }
    return tails.size();
}
```

**Time:** $O(n \log n)$. **Space:** $O(n)$.

---

### 5. Coin Change

**Problem:** Given coins of denominations $c[0], c[1], \ldots, c[k-1]$ (unlimited supply), find the minimum number of coins to make amount $n$.

**State:** $dp[j]$ = minimum coins to make amount $j$.

**Recurrence:** $dp[j] = \min_{c[i] \leq j}(dp[j - c[i]] + 1)$

```java
public static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // sentinel "infinity"
    dp[0] = 0;

    for (int j = 1; j <= amount; j++) {
        for (int coin : coins) {
            if (coin <= j) {
                dp[j] = Math.min(dp[j], dp[j - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

**Time:** $O(n \cdot k)$. **Space:** $O(n)$.

**Counting the number of ways:**

```java
public static int coinChangeWays(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;

    for (int coin : coins) {           // iterate coins in outer loop
        for (int j = coin; j <= amount; j++) {
            dp[j] += dp[j - coin];
        }
    }
    return dp[amount];
}
```

Note: iterating coins in the outer loop counts **combinations** (order doesn't matter). Iterating amounts in the outer loop would count **permutations**.

---

### 6. Edit Distance (Levenshtein Distance)

**Problem:** Find the minimum number of operations (insert, delete, replace) to transform string $s$ into string $t$.

**State:** $dp[i][j]$ = edit distance between $s[0..i-1]$ and $t[0..j-1]$.

**Recurrence:**
$$dp[i][j] = \begin{cases} dp[i-1][j-1] & \text{if } s[i-1] = t[j-1] \\ 1 + \min(dp[i-1][j],\; dp[i][j-1],\; dp[i-1][j-1]) & \text{otherwise} \end{cases}$$

Where the three operations correspond to:
- $dp[i-1][j] + 1$: delete from $s$
- $dp[i][j-1] + 1$: insert into $s$
- $dp[i-1][j-1] + 1$: replace in $s$

```java
public static int editDistance(String s, String t) {
    int m = s.length(), n = t.length();
    int[][] dp = new int[m + 1][n + 1];

    // Base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i; // delete all from s
    for (int j = 0; j <= n; j++) dp[0][j] = j; // insert all from t

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                                Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
    }
    return dp[m][n];
}
```

**Time:** $O(mn)$. **Space:** $O(mn)$, optimizable to $O(\min(m, n))$.

---

### 7. Matrix Chain Multiplication

**Problem:** Given matrices $A_1, A_2, \ldots, A_n$ with dimensions $p_0 \times p_1, p_1 \times p_2, \ldots, p_{n-1} \times p_n$, find the parenthesization that minimizes the total number of scalar multiplications.

**State:** $dp[i][j]$ = minimum cost to multiply matrices $A_i$ through $A_j$.

**Recurrence:**
$$dp[i][j] = \min_{i \leq k < j}(dp[i][k] + dp[k+1][j] + p_{i-1} \cdot p_k \cdot p_j)$$

```java
public static int matrixChainMultiplication(int[] p) {
    int n = p.length - 1; // number of matrices
    int[][] dp = new int[n + 1][n + 1];

    // length = 1: single matrix, cost = 0 (already initialized)

    for (int len = 2; len <= n; len++) {           // chain length
        for (int i = 1; i <= n - len + 1; i++) {   // start
            int j = i + len - 1;                    // end
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {           // split point
                int cost = dp[i][k] + dp[k + 1][j]
                         + p[i - 1] * p[k] * p[j];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    return dp[1][n];
}
```

**Time:** $O(n^3)$. **Space:** $O(n^2)$.

---

## DP on Strings: Summary Pattern

Many string DP problems follow this pattern:

```java
int[][] dp = new int[m + 1][n + 1];
// Initialize base cases: dp[0][j] and dp[i][0]

for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        if (s.charAt(i-1) == t.charAt(j-1)) {
            dp[i][j] = dp[i-1][j-1] + /* match bonus */;
        } else {
            dp[i][j] = /* combine dp[i-1][j], dp[i][j-1], dp[i-1][j-1] */;
        }
    }
}
```

This template covers LCS, edit distance, longest common substring, and many variants.

---

## Recognizing DP Problems

Look for these signals:

1. **"Find the minimum/maximum..."** -- optimization problems.
2. **"How many ways..."** -- counting problems.
3. **"Is it possible to..."** -- feasibility problems.
4. **Overlapping subproblems:** The same smaller problem is solved multiple times.
5. **Optimal substructure:** The optimal solution contains optimal solutions to subproblems.
6. **Can you define a recurrence?** If yes, DP likely applies.

### DP vs. Greedy

| DP | Greedy |
|----|--------|
| Considers all options at each step | Makes the locally optimal choice |
| Guarantees global optimum | Only guarantees optimum if greedy choice property holds |
| Usually $O(n^2)$ or $O(nW)$ | Usually $O(n \log n)$ or $O(n)$ |
| More general | Faster when applicable |

### DP vs. Divide and Conquer

| DP | Divide and Conquer |
|----|-------------------|
| Overlapping subproblems | Independent subproblems |
| Uses memoization/tabulation | Pure recursion |
| Fibonacci, knapsack, LCS | Merge sort, quicksort, binary search |

---

## Advanced: Bitmask DP

For problems involving subsets of a small set ($n \leq 20$), represent subsets as bitmasks:

```java
// Traveling Salesman Problem (TSP): visit all n cities, minimize cost
// dp[mask][i] = minimum cost to visit cities in 'mask', ending at city i
public static int tsp(int[][] dist) {
    int n = dist.length;
    int[][] dp = new int[1 << n][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE / 2);
    dp[1][0] = 0; // start at city 0

    for (int mask = 1; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if ((mask & (1 << u)) == 0) continue;
            if (dp[mask][u] == Integer.MAX_VALUE / 2) continue;

            for (int v = 0; v < n; v++) {
                if ((mask & (1 << v)) != 0) continue;
                int newMask = mask | (1 << v);
                dp[newMask][v] = Math.min(dp[newMask][v],
                                          dp[mask][u] + dist[u][v]);
            }
        }
    }

    int fullMask = (1 << n) - 1;
    int ans = Integer.MAX_VALUE;
    for (int u = 0; u < n; u++) {
        ans = Math.min(ans, dp[fullMask][u] + dist[u][0]);
    }
    return ans;
}
```

**Time:** $O(2^n \cdot n^2)$. **Space:** $O(2^n \cdot n)$.

This is exponential, but far better than the brute-force $O(n!)$ for the TSP.

---

## Quiz

**Q1.** What two properties must a problem have for dynamic programming to be applicable?

**A1.** (1) **Overlapping subproblems:** The same subproblems recur multiple times. (2) **Optimal substructure:** An optimal solution to the problem contains optimal solutions to its subproblems.

---

**Q2.** In the 0/1 knapsack space-optimized solution, why do we iterate the capacity $j$ backwards (from $W$ down to $w[i]$)?

**A2.** Iterating backwards ensures that when computing $dp[j]$, the value $dp[j - w[i]]$ still reflects the state from the previous item (row $i-1$). If we iterated forwards, $dp[j - w[i]]$ might already be updated with the current item, allowing the same item to be used multiple times (which is the unbounded knapsack, not 0/1).

---

**Q3.** What is the time complexity of the $O(n \log n)$ LIS algorithm, and how does it work?

**A3.** Time: $O(n \log n)$. It maintains a list `tails` where `tails[k]` is the smallest possible ending element of an increasing subsequence of length $k+1$. For each new element, binary search finds where it fits in `tails`. If it extends the longest subsequence, append it; otherwise, replace the first element in `tails` that is $\geq$ the new element. The length of `tails` at the end is the LIS length.

---

**Q4.** For the coin change problem with coins $\{1, 5, 10, 25\}$ and amount 30, what does $dp[30]$ represent?

**A4.** $dp[30]$ represents the minimum number of coins needed to make an amount of 30. The answer is 2 (one 5-cent coin and one 25-cent coin).

---

**Q5.** What is the difference between counting combinations and counting permutations in the coin change "number of ways" problem?

**A5.** The difference lies in the loop ordering. Iterating coins in the outer loop and amounts in the inner loop counts **combinations** (e.g., {1,5} and {5,1} are the same way). Iterating amounts in the outer loop and coins in the inner loop counts **permutations** (e.g., {1,5} and {5,1} are different).

---

**Q6.** Compute the edit distance between "kitten" and "sitting".

**A6.** The edit distance is 3:
1. kitten -> sitten (replace 'k' with 's')
2. sitten -> sittin (replace 'e' with 'i')
3. sittin -> sitting (insert 'g')

---

**Q7.** What is the time complexity of the matrix chain multiplication DP solution?

**A7.** $O(n^3)$, where $n$ is the number of matrices. The three nested loops iterate over chain length, starting position, and split point.

---

**Q8.** Explain why the naive recursive Fibonacci has $O(2^n)$ time but the memoized version has $O(n)$ time.

**A8.** The naive version recomputes the same subproblems repeatedly. The call tree has $O(2^n)$ nodes because each call branches into two. With memoization, each subproblem $fib(k)$ for $k = 0, 1, \ldots, n$ is computed exactly once (subsequent calls return the cached value in $O(1)$). There are $n+1$ subproblems, each taking $O(1)$ work beyond the recursive calls, giving $O(n)$ total.
