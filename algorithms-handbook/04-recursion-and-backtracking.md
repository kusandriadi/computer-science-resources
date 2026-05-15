# Module 04: Recursion and Backtracking

## Introduction

Recursion is one of the most powerful ideas in computer science -- and also one of the most confusing when you first encounter it. So before we get into the formal details, let's build some intuition.

Have you ever stood between two mirrors and seen your reflection repeat into infinity? Or opened a set of Russian nesting dolls, where each doll contains a smaller version of itself? That's the essence of recursion: **a problem that contains a smaller copy of itself**. To solve the big problem, you solve the smaller version first. To solve that one, you solve an even smaller version. And so on, until you reach a version so tiny that the answer is obvious.

Recursion allows us to express complex problems as simpler versions of themselves, mirroring the mathematical technique of induction. Backtracking extends recursion into a systematic search strategy: explore possibilities, and if a path leads to a dead end, undo the last choice and try the next option.

This module covers recursive thinking from the ground up, visualizes the call stack, introduces memoization as a bridge to dynamic programming, and presents the backtracking paradigm with classic problems.

---

## Recursion Fundamentals

### The Structure of Recursion

Every recursive function has two parts:

1. **Base case(s):** The trivial case(s) that can be solved directly without further recursion.
2. **Recursive case:** The problem is broken into smaller subproblems, and the function calls itself.

```java
// Classic example: factorial
// n! = n * (n-1)!
// 0! = 1 (base case)
public static long factorial(int n) {
    if (n <= 1) return 1;       // base case
    return n * factorial(n - 1); // recursive case
}
```

### Thinking Recursively

The key insight is the **leap of faith**: assume the recursive call correctly solves the smaller subproblem. Your job is only to:

1. Define what "smaller" means.
2. Handle the base case.
3. Combine the result of the recursive call with the current level's work.

**Example: Sum of an array**

```java
public static int sum(int[] arr, int index) {
    if (index == arr.length) return 0;                // base case
    return arr[index] + sum(arr, index + 1);          // recursive case
}
```

The leap of faith: `sum(arr, index + 1)` correctly returns the sum of elements from `index + 1` to the end. We add `arr[index]` to get the sum from `index` to the end.

---

## Call Stack Visualization

Understanding the call stack is crucial for debugging and analyzing recursive code.

### Example: `factorial(4)`

```
factorial(4)
  -> 4 * factorial(3)
       -> 3 * factorial(2)
            -> 2 * factorial(1)
                 -> returns 1          (base case)
            -> returns 2 * 1 = 2
       -> returns 3 * 2 = 6
  -> returns 4 * 6 = 24
```

The call stack grows to depth 4 (one frame per call), then unwinds as each call returns.

### Stack Overflow

Each recursive call consumes stack space. Java's default stack size is typically 512 KB to 1 MB. Deep recursion (e.g., `factorial(100000)`) will cause a `StackOverflowError`.

**Mitigation strategies:**
- Convert to iteration (tail recursion optimization is not guaranteed in Java).
- Increase stack size: `java -Xss4m MyProgram`.
- Use explicit stack data structures.

### Example: Fibonacci (Naive)

```java
public static long fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

**Call tree for `fib(5)`:**

```
                    fib(5)
                   /      \
              fib(4)       fib(3)
             /     \       /    \
          fib(3)  fib(2) fib(2) fib(1)
          /   \    / \    / \
       fib(2) fib(1) fib(0) fib(1) fib(0)
       / \
    fib(1) fib(0)
```

This is **horribly inefficient**: $O(2^n)$ time because subproblems are recomputed. `fib(3)` is computed twice, `fib(2)` three times, etc.

**Maximum call stack depth:** $O(n)$ (the leftmost branch).

---

## Common Recursion Patterns

### Pattern 1: Linear Recursion

Process one element, recurse on the rest.

```java
// Reverse a string
public static String reverse(String s) {
    if (s.isEmpty()) return s;
    return reverse(s.substring(1)) + s.charAt(0);
}
```

### Pattern 2: Binary Recursion

Split the problem in two, recurse on each half.

```java
// Binary search (recursive)
public static int binarySearch(int[] arr, int target, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearch(arr, target, mid + 1, hi);
    return binarySearch(arr, target, lo, mid - 1);
}
```

### Pattern 3: Multiple Recursion

Make multiple recursive calls at each level.

```java
// Generate all binary strings of length n
public static void generateBinaryStrings(int n, String current) {
    if (current.length() == n) {
        System.out.println(current);
        return;
    }
    generateBinaryStrings(n, current + "0");
    generateBinaryStrings(n, current + "1");
}
```

### Pattern 4: Tail Recursion

The recursive call is the last operation. Can theoretically be optimized to iteration (Java does not guarantee this, but the pattern is useful for manual conversion).

```java
// Tail-recursive factorial
public static long factorialTail(int n, long accumulator) {
    if (n <= 1) return accumulator;
    return factorialTail(n - 1, n * accumulator);
}
// Call: factorialTail(5, 1)

// Equivalent iterative version
public static long factorialIterative(int n) {
    long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
```

---

## Memoization: Bridge to Dynamic Programming

Memoization caches the results of expensive function calls so that repeated calls with the same arguments return the cached result.

### Memoized Fibonacci

```java
public static long fibMemo(int n, long[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];     // return cached result
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

// Usage:
// long[] memo = new long[n + 1];
// long result = fibMemo(n, memo);
```

**Before memoization:** $O(2^n)$ time, $O(n)$ space (stack).
**After memoization:** $O(n)$ time, $O(n)$ space (memo array + stack).

Each subproblem is solved exactly once. This is the essence of **top-down dynamic programming** (covered in depth in Module 06).

### Using a HashMap for Memoization

When parameters are not simple integers, use a `Map`:

```java
private static Map<String, Integer> cache = new HashMap<>();

public static int solve(int a, int b) {
    String key = a + "," + b;
    if (cache.containsKey(key)) return cache.get(key);
    // ... compute result ...
    int result = /* some computation */;
    cache.put(key, result);
    return result;
}
```

---

## Backtracking

### The Paradigm

Imagine you are solving a maze. You walk forward until you hit a dead end. Then you go back to the last fork, choose a different path, and try again. You keep doing this until you find the exit (or exhaust all options).

That is backtracking: a systematic way to explore all potential solutions by building them incrementally and abandoning ("backtracking from") partial solutions that cannot lead to a valid complete solution.

### General Template

Almost every backtracking problem follows the same pattern. Here is the general template:

```java
public static void backtrack(State state, List<Solution> results) {
    if (isComplete(state)) {
        results.add(state.toSolution());
        return;
    }

    for (Choice choice : getChoices(state)) {
        if (isValid(state, choice)) {
            applyChoice(state, choice);         // make the choice
            backtrack(state, results);           // explore further
            undoChoice(state, choice);           // undo (backtrack)
        }
    }
}
```

Key elements:
1. **State:** The current partial solution.
2. **Choices:** What can be added to the state.
3. **Constraints:** Which choices are valid (pruning).
4. **Goal:** When the state represents a complete solution.

---

### Problem 1: Permutations

Generate all permutations of a set of distinct integers.

```java
public static List<List<Integer>> permutations(int[] nums) {
    List<List<Integer>> results = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrackPermutations(nums, used, new ArrayList<>(), results);
    return results;
}

private static void backtrackPermutations(int[] nums, boolean[] used,
        List<Integer> current, List<List<Integer>> results) {
    if (current.size() == nums.length) {
        results.add(new ArrayList<>(current));  // copy!
        return;
    }

    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;                  // prune
        used[i] = true;                         // choose
        current.add(nums[i]);
        backtrackPermutations(nums, used, current, results);  // explore
        current.remove(current.size() - 1);     // unchoose
        used[i] = false;
    }
}
```

**Time complexity:** $O(n! \cdot n)$ -- there are $n!$ permutations, each of length $n$.

**Space complexity:** $O(n)$ for the recursion stack and `used` array (not counting output).

---

### Problem 2: Combinations

Choose $k$ elements from $\{1, 2, \ldots, n\}$.

```java
public static List<List<Integer>> combinations(int n, int k) {
    List<List<Integer>> results = new ArrayList<>();
    backtrackCombinations(n, k, 1, new ArrayList<>(), results);
    return results;
}

private static void backtrackCombinations(int n, int k, int start,
        List<Integer> current, List<List<Integer>> results) {
    if (current.size() == k) {
        results.add(new ArrayList<>(current));
        return;
    }

    // Pruning: need (k - current.size()) more elements,
    // so don't start beyond n - (k - current.size()) + 1
    for (int i = start; i <= n - (k - current.size()) + 1; i++) {
        current.add(i);
        backtrackCombinations(n, k, i + 1, current, results);
        current.remove(current.size() - 1);
    }
}
```

**Time complexity:** $O(\binom{n}{k} \cdot k)$.

---

### Problem 3: Subsets (Power Set)

Generate all subsets of a set of distinct integers.

```java
public static List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> results = new ArrayList<>();
    backtrackSubsets(nums, 0, new ArrayList<>(), results);
    return results;
}

private static void backtrackSubsets(int[] nums, int start,
        List<Integer> current, List<List<Integer>> results) {
    results.add(new ArrayList<>(current));  // every partial state is a valid subset

    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);
        backtrackSubsets(nums, i + 1, current, results);
        current.remove(current.size() - 1);
    }
}
```

**Time complexity:** $O(2^n \cdot n)$.

---

### Problem 4: N-Queens

Place $n$ queens on an $n \times n$ chessboard such that no two queens attack each other (no two share a row, column, or diagonal).

```java
public static List<List<String>> solveNQueens(int n) {
    List<List<String>> results = new ArrayList<>();
    int[] queens = new int[n]; // queens[row] = column
    Arrays.fill(queens, -1);
    Set<Integer> cols = new HashSet<>();
    Set<Integer> diag1 = new HashSet<>(); // row - col
    Set<Integer> diag2 = new HashSet<>(); // row + col
    backtrackQueens(n, 0, queens, cols, diag1, diag2, results);
    return results;
}

private static void backtrackQueens(int n, int row, int[] queens,
        Set<Integer> cols, Set<Integer> diag1, Set<Integer> diag2,
        List<List<String>> results) {
    if (row == n) {
        results.add(buildBoard(queens, n));
        return;
    }

    for (int col = 0; col < n; col++) {
        if (cols.contains(col) || diag1.contains(row - col)
                || diag2.contains(row + col)) {
            continue; // conflict -- prune
        }

        queens[row] = col;
        cols.add(col);
        diag1.add(row - col);
        diag2.add(row + col);

        backtrackQueens(n, row + 1, queens, cols, diag1, diag2, results);

        queens[row] = -1;
        cols.remove(col);
        diag1.remove(row - col);
        diag2.remove(row + col);
    }
}

private static List<String> buildBoard(int[] queens, int n) {
    List<String> board = new ArrayList<>();
    for (int row = 0; row < n; row++) {
        char[] line = new char[n];
        Arrays.fill(line, '.');
        line[queens[row]] = 'Q';
        board.add(new String(line));
    }
    return board;
}
```

**How it works:**
- Place queens row by row.
- For each row, try each column.
- Check if the column, main diagonal ($\text{row} - \text{col}$), and anti-diagonal ($\text{row} + \text{col}$) are free.
- If valid, place the queen and recurse. On return, remove the queen (backtrack).

**Time complexity:** Upper bound is $O(n!)$. With pruning, the actual number of explored states is much smaller.

**N-Queens count:**
- $n=4$: 2 solutions
- $n=8$: 92 solutions
- $n=12$: 14,200 solutions

---

### Problem 5: Sudoku Solver

Fill a $9 \times 9$ grid so that each row, column, and $3 \times 3$ box contains digits 1--9 exactly once.

```java
public static boolean solveSudoku(char[][] board) {
    for (int row = 0; row < 9; row++) {
        for (int col = 0; col < 9; col++) {
            if (board[row][col] != '.') continue;

            for (char num = '1'; num <= '9'; num++) {
                if (isValidPlacement(board, row, col, num)) {
                    board[row][col] = num;

                    if (solveSudoku(board)) return true;

                    board[row][col] = '.'; // backtrack
                }
            }
            return false; // no valid number for this cell
        }
    }
    return true; // all cells filled
}

private static boolean isValidPlacement(char[][] board, int row, int col, char num) {
    for (int i = 0; i < 9; i++) {
        // Check row
        if (board[row][i] == num) return false;
        // Check column
        if (board[i][col] == num) return false;
        // Check 3x3 box
        int boxRow = 3 * (row / 3) + i / 3;
        int boxCol = 3 * (col / 3) + i % 3;
        if (board[boxRow][boxCol] == num) return false;
    }
    return true;
}
```

**Optimization ideas:**
- Use bitmasks for rows, columns, and boxes to check validity in $O(1)$.
- Choose the cell with the fewest candidates first (Constraint Propagation / MRV heuristic).

---

## Recursion vs. Iteration

Every recursive algorithm can be converted to an iterative one (and vice versa). The recursive call stack can be simulated with an explicit stack.

### Example: Iterative DFS with Explicit Stack

```java
public static void iterativeDFS(int[][] graph, int start) {
    boolean[] visited = new boolean[graph.length];
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(start);

    while (!stack.isEmpty()) {
        int node = stack.pop();
        if (visited[node]) continue;
        visited[node] = true;
        System.out.print(node + " ");

        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                stack.push(neighbor);
            }
        }
    }
}
```

### When to Use Each

| Recursion | Iteration |
|-----------|-----------|
| Naturally mirrors problem structure | Better for simple loops |
| Tree/graph traversal | Performance-critical inner loops |
| Backtracking, divide and conquer | Avoiding stack overflow |
| More readable for complex branching | Lower overhead (no function calls) |

---

## Advanced: Constraint Propagation

Backtracking can be combined with **constraint propagation** to prune the search space more aggressively. When a choice is made, immediately propagate its consequences:

- In Sudoku: when a number is placed, eliminate it from the candidates of all cells in the same row, column, and box.
- In N-Queens: the sets `cols`, `diag1`, `diag2` are a form of constraint propagation.

This transforms brute-force backtracking into a more informed search, often reducing the search space by orders of magnitude.

---

## Quiz

**Q1.** What are the two essential components of every recursive function?

**A1.** A base case (the terminating condition that returns a result without further recursion) and a recursive case (the function calls itself with a smaller or simpler input, moving toward the base case).

---

**Q2.** What is the time and space complexity of the naive recursive Fibonacci implementation `fib(n)`?

**A2.** Time: $O(2^n)$ (exponential, due to recomputing overlapping subproblems). Space: $O(n)$ (maximum depth of the call stack).

---

**Q3.** How does memoization improve the recursive Fibonacci? What are the new complexities?

**A3.** Memoization caches the result of each `fib(k)` so it is computed only once. Time: $O(n)$ (each of the $n$ subproblems is solved once). Space: $O(n)$ (memo array plus call stack).

---

**Q4.** In the backtracking template, what is the purpose of the "undo choice" step?

**A4.** It restores the state to what it was before the choice was made, allowing the algorithm to explore other choices at the same level. Without undoing, the state would accumulate all previous choices and produce incorrect results.

---

**Q5.** In the N-Queens solution, why do we use `row - col` and `row + col` to track diagonals?

**A5.** On a main diagonal (top-left to bottom-right), all cells have the same value of $\text{row} - \text{col}$. On an anti-diagonal (top-right to bottom-left), all cells have the same value of $\text{row} + \text{col}$. Two queens conflict on a diagonal if and only if they share one of these values.

---

**Q6.** What is the time complexity of generating all permutations of $n$ elements?

**A6.** $O(n! \cdot n)$. There are $n!$ permutations, and generating each one (copying it to the result list) takes $O(n)$ time.

---

**Q7.** Convert the following recursive function to an iterative one:

```java
public static void printDescending(int n) {
    if (n <= 0) return;
    System.out.println(n);
    printDescending(n - 1);
}
```

**A7.**
```java
public static void printDescending(int n) {
    for (int i = n; i > 0; i--) {
        System.out.println(i);
    }
}
```
This is a case of tail recursion, which converts directly to a loop.

---

**Q8.** Why does the Sudoku solver return `false` immediately after trying all digits 1--9 for an empty cell without finding a valid one?

**A8.** If no digit can be validly placed in the current empty cell, then the partial solution built so far is invalid. Returning `false` triggers backtracking: the caller will undo its most recent choice and try the next option. This is the core mechanism of backtracking -- pruning dead-end branches early rather than continuing to fill cells that will inevitably lead to contradiction.
