---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 04: Recursion and Backtracking

**Why this matters:** Recursion lets you express complex problems as simpler versions of themselves. Backtracking extends this into a systematic search strategy for combinatorial problems.

---

# Real-World Motivation

**Russian nesting dolls:** Each doll contains a smaller version of itself. Open the big one, find a smaller one, open that, find an even smaller one... until you reach the tiniest.

**Solving a maze:** Walk forward until dead end. Backtrack to last fork. Try another path. Repeat until exit found.

These are recursion and backtracking in everyday life.

---

# The Structure of Recursion

Every recursive function has two parts:

1. **Base case** -- trivial, solved directly
2. **Recursive case** -- calls itself with smaller input

```java
long factorial(int n) {
    if (n <= 1) return 1;        // base case
    return n * factorial(n - 1); // recursive case
}
```

**The Leap of Faith:** Trust that the recursive call correctly solves the smaller problem. Your job: handle the base case and combine.

---

# Call Stack Visualization

```
factorial(4)
  -> 4 * factorial(3)
       -> 3 * factorial(2)
            -> 2 * factorial(1)
                 -> returns 1          (base)
            -> returns 2
       -> returns 6
  -> returns 24
```

Stack grows to depth 4, then unwinds.

**Stack overflow risk:** Java default stack ~512KB-1MB.
**Mitigations:** Convert to iteration, increase with `-Xss4m`, use explicit stack.

---

# Naive Fibonacci -- The Cautionary Tale

```java
long fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);  // O(2^n)!
}
```

fib(3) is computed twice, fib(2) three times...

- **Time:** O(2^n) -- exponential tree of calls
- **Space:** O(n) -- max stack depth (leftmost branch)

The fix: **memoization** (cache results).

---

# Memoization: Bridge to DP

```java
long fibMemo(int n, long[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
    return memo[n];
}
```

Each subproblem solved **exactly once**.

| | Before | After |
|---|--------|-------|
| Time | O(2^n) | **O(n)** |
| Space | O(n) | O(n) |

This is **top-down dynamic programming**.

---

# Common Recursion Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| Linear | Process one, recurse on rest | Reverse string |
| Binary | Split in two, recurse each | Binary search |
| Multiple | Multiple calls per level | Generate binary strings |
| Tail | Recursive call is last op | Factorial with accumulator |

```java
// Tail recursion -- easily converts to loop
long factTail(int n, long acc) {
    if (n <= 1) return acc;
    return factTail(n - 1, n * acc);
}
```

---

# Backtracking: The Paradigm

**Systematic exploration:** Build solutions incrementally, abandon dead ends.

```java
void backtrack(State state, List<Solution> results) {
    if (isComplete(state)) {
        results.add(state.toSolution());
        return;
    }
    for (Choice choice : getChoices(state)) {
        if (isValid(state, choice)) {
            applyChoice(state, choice);   // choose
            backtrack(state, results);     // explore
            undoChoice(state, choice);     // un-choose
        }
    }
}
```

---

# Permutations

Generate all orderings of n distinct integers.

```java
void permute(int[] nums, boolean[] used,
             List<Integer> curr, List<List<Integer>> res) {
    if (curr.size() == nums.length) {
        res.add(new ArrayList<>(curr));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; curr.add(nums[i]);
        permute(nums, used, curr, res);
        curr.remove(curr.size()-1); used[i] = false;
    }
}
```

**Time:** O(n! * n) | **Space:** O(n)

---

# Combinations and Subsets

**Combinations** -- choose k from n:
```java
// Start from 'start' to avoid duplicates
for (int i = start; i <= n-(k-curr.size())+1; i++) {
    curr.add(i);
    combine(n, k, i+1, curr, res);
    curr.remove(curr.size()-1);
}
```
**Time:** O(C(n,k) * k)

**Subsets** -- every partial state is valid:
```java
results.add(new ArrayList<>(current)); // add first!
for (int i = start; i < nums.length; i++) { ... }
```
**Time:** O(2^n * n)

---

# N-Queens Problem

Place n queens on n x n board, no two attacking each other.

```java
// Track conflicts with sets
Set<Integer> cols, diag1, diag2;
// row - col identifies main diagonals
// row + col identifies anti-diagonals
```

- Try each column for current row
- Check if column, diag1, diag2 are free
- Place queen, recurse, then **backtrack**

**n=4:** 2 solutions | **n=8:** 92 solutions

**Time:** Upper bound O(n!), much less with pruning.

---

# Sudoku Solver

```java
boolean solve(char[][] board) {
    for (int r = 0; r < 9; r++)
        for (int c = 0; c < 9; c++) {
            if (board[r][c] != '.') continue;
            for (char n = '1'; n <= '9'; n++) {
                if (isValid(board, r, c, n)) {
                    board[r][c] = n;
                    if (solve(board)) return true;
                    board[r][c] = '.'; // backtrack!
                }
            }
            return false; // no valid digit
        }
    return true; // all filled
}
```

**Key:** Return false immediately if no digit works => triggers backtracking.

---

# Recursion vs Iteration

| Recursion | Iteration |
|-----------|-----------|
| Mirrors problem structure naturally | Better for simple loops |
| Tree/graph traversal, backtracking | Performance-critical inner loops |
| More readable for branching | Avoids stack overflow |

**Every recursive algorithm can be converted to iterative** using an explicit stack.

```java
// Iterative DFS
Deque<Integer> stack = new ArrayDeque<>();
stack.push(start);
while (!stack.isEmpty()) {
    int node = stack.pop(); ...
}
```

---

# Constraint Propagation

Combine backtracking with immediate consequence propagation:

- **Sudoku:** When placing a number, eliminate it from row/column/box candidates
- **N-Queens:** The cols/diag1/diag2 sets ARE constraint propagation

This transforms brute-force into informed search, reducing search space by orders of magnitude.

---

# Quiz

1. **What are the two essential parts of every recursive function?**

2. **Time and space of naive recursive Fibonacci?**

3. **In the backtracking template, why is "undo choice" necessary?**

4. **Time complexity of generating all permutations of n elements?**

---

# Quiz Answers

1. **Base case** (terminating condition) and **recursive case** (calls itself with smaller input).

2. **Time: O(2^n)**, Space: O(n) (max stack depth).

3. **Restores state** so other choices at the same level can be explored. Without it, previous choices accumulate and produce incorrect results.

4. **O(n! * n)** -- n! permutations, each takes O(n) to copy.
