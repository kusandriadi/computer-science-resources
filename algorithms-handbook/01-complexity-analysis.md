# Module 01: Complexity Analysis

## Introduction

Every programmer can write code that works. The difference between a competent engineer and an exceptional one often comes down to understanding *how well* their code works -- how it behaves as the input grows, how much memory it consumes, and whether it will still be usable when the dataset doubles, or grows by a factor of a million.

Complexity analysis is the mathematical framework for answering these questions. It gives us a language to describe algorithm performance that is independent of hardware, programming language, and implementation details. Mastering this framework is the single most important prerequisite for everything else in this handbook.

---

## Why We Need Complexity Analysis

Consider two sorting algorithms. Algorithm A takes 0.5 seconds to sort 1,000 elements. Algorithm B takes 0.8 seconds. Which is faster?

The naive answer is A. But what if A is $O(n^2)$ and B is $O(n \log n)$? At $n = 1{,}000{,}000$:
- A takes roughly $0.5 \times (1000)^2 = 500{,}000$ seconds (about 5.8 days)
- B takes roughly $0.8 \times \frac{1{,}000{,}000 \times 20}{1{,}000 \times 10} = 1{,}600$ seconds (about 27 minutes)

Constant factors matter, but **growth rate dominates** at scale. Complexity analysis captures growth rate.

---

## Asymptotic Notation

### Big-O: Upper Bound

$f(n) = O(g(n))$ means there exist positive constants $c$ and $n_0$ such that:

$$0 \leq f(n) \leq c \cdot g(n) \quad \text{for all } n \geq n_0$$

**Intuition:** $f$ grows *no faster than* $g$. Big-O gives an **upper bound** on growth.

**Example:** $3n^2 + 5n + 7 = O(n^2)$. Choose $c = 15$ and $n_0 = 1$: for all $n \geq 1$, $3n^2 + 5n + 7 \leq 15n^2$.

#### Formal Big-O Proof Examples

To rigorously prove $f(n) = O(g(n))$, you must exhibit specific constants $c > 0$ and $n_0 \geq 1$ such that $f(n) \leq c \cdot g(n)$ for all $n \geq n_0$.

**Proof 1: Show that $n^2 + 2n + 1 = O(n^2)$.**

We need to find $c$ and $n_0$ such that $n^2 + 2n + 1 \leq c \cdot n^2$ for all $n \geq n_0$.

For $n \geq 1$:
- $2n \leq 2n^2$ (since $n \leq n^2$ when $n \geq 1$)
- $1 \leq n^2$ (since $n \geq 1$)

Therefore: $n^2 + 2n + 1 \leq n^2 + 2n^2 + n^2 = 4n^2$.

Choose $c = 4$ and $n_0 = 1$. For all $n \geq 1$: $n^2 + 2n + 1 \leq 4n^2$. $\blacksquare$

**Proof 2: Show that $5n^3 + 20n^2 + 10 = O(n^3)$.**

We need $5n^3 + 20n^2 + 10 \leq c \cdot n^3$ for all $n \geq n_0$.

For $n \geq 1$:
- $20n^2 \leq 20n^3$ (since $n^2 \leq n^3$ when $n \geq 1$)
- $10 \leq 10n^3$ (since $1 \leq n^3$ when $n \geq 1$)

Therefore: $5n^3 + 20n^2 + 10 \leq 5n^3 + 20n^3 + 10n^3 = 35n^3$.

Choose $c = 35$ and $n_0 = 1$. For all $n \geq 1$: $5n^3 + 20n^2 + 10 \leq 35n^3$. $\blacksquare$

**Proof 3 (non-example): Show that $n^3 \neq O(n^2)$.**

Suppose for contradiction that $n^3 \leq c \cdot n^2$ for some $c > 0$ and all $n \geq n_0$. Then dividing both sides by $n^2$ gives $n \leq c$ for all $n \geq n_0$, which is impossible since $n$ can be arbitrarily large. $\blacksquare$

### Big-Omega ($\Omega$): Lower Bound

$f(n) = \Omega(g(n))$ means there exist positive constants $c$ and $n_0$ such that:

$$0 \leq c \cdot g(n) \leq f(n) \quad \text{for all } n \geq n_0$$

**Intuition:** $f$ grows *at least as fast as* $g$. Big-$\Omega$ gives a **lower bound** on growth.

**Example:** $3n^2 + 5n + 7 = \Omega(n^2)$. Choose $c = 3$ and $n_0 = 1$.

### Big-Theta ($\Theta$): Tight Bound

$f(n) = \Theta(g(n))$ if and only if $f(n) = O(g(n))$ **and** $f(n) = \Omega(g(n))$.

**Intuition:** $f$ grows *at the same rate as* $g$. Big-$\Theta$ is a **tight bound**.

**Example:** $3n^2 + 5n + 7 = \Theta(n^2)$.

### Little-o and Little-$\omega$ (Non-Tight Bounds)

While Big-O and Big-$\Omega$ allow the possibility of equality (i.e., $f$ could grow at the same rate as $g$), little-o and little-$\omega$ are **strict** bounds that exclude equality.

**Little-o (strict upper bound):**

$f(n) = o(g(n))$ means $f$ grows **strictly slower** than $g$. Formally:

$$\lim_{n \to \infty} \frac{f(n)}{g(n)} = 0$$

Equivalently: for **every** constant $c > 0$, there exists $n_0$ such that $f(n) < c \cdot g(n)$ for all $n \geq n_0$.

Note the key difference from Big-O: Big-O requires that **some** $c$ works; little-o requires that **every** $c$ works (no matter how small).

**Examples of little-o:**
- $n = o(n^2)$: $\lim_{n \to \infty} \frac{n}{n^2} = \lim_{n \to \infty} \frac{1}{n} = 0$ -- true.
- $n^2 = o(n^3)$: $\lim_{n \to \infty} \frac{n^2}{n^3} = \lim_{n \to \infty} \frac{1}{n} = 0$ -- true.
- $n^2 \neq o(n^2)$: $\lim_{n \to \infty} \frac{n^2}{n^2} = 1 \neq 0$ -- false. (The bound is not strict.)
- $100n = o(n^2)$: $\lim_{n \to \infty} \frac{100n}{n^2} = \lim_{n \to \infty} \frac{100}{n} = 0$ -- true. Constants don't save you.

**Little-$\omega$ (strict lower bound):**

$f(n) = \omega(g(n))$ means $f$ grows **strictly faster** than $g$. Formally:

$$\lim_{n \to \infty} \frac{f(n)}{g(n)} = \infty$$

This is the inverse of little-o: $f(n) = \omega(g(n))$ if and only if $g(n) = o(f(n))$.

**Examples of little-$\omega$:**
- $n^2 = \omega(n)$: $\lim_{n \to \infty} \frac{n^2}{n} = \lim_{n \to \infty} n = \infty$ -- true.
- $n^3 = \omega(n^2)$: $\lim_{n \to \infty} \frac{n^3}{n^2} = \lim_{n \to \infty} n = \infty$ -- true.
- $n^2 \neq \omega(n^2)$: $\lim_{n \to \infty} \frac{n^2}{n^2} = 1 \neq \infty$ -- false.

**Relationship summary:**

| Notation | Analogy | Meaning |
|----------|---------|---------|
| $f = O(g)$ | $f \leq g$ | $f$ grows no faster than $g$ |
| $f = \Omega(g)$ | $f \geq g$ | $f$ grows no slower than $g$ |
| $f = \Theta(g)$ | $f = g$ | $f$ grows at the same rate as $g$ |
| $f = o(g)$ | $f < g$ | $f$ grows strictly slower than $g$ |
| $f = \omega(g)$ | $f > g$ | $f$ grows strictly faster than $g$ |

### Common Mistake

Big-O is an **upper bound**, not a tight bound. Saying "this algorithm is $O(n^2)$" is technically true even if it runs in $O(n)$. In practice, we almost always mean the **tightest** Big-O we can prove. When precision matters, use $\Theta$.

---

## Big-O Rules

These rules allow you to simplify and combine Big-O expressions systematically.

### Rule 1: Drop Constants

Constant factors are irrelevant in Big-O: $O(c \cdot f(n)) = O(f(n))$ for any constant $c > 0$.

**Example:** $O(5n) = O(n)$, $O(100n^2) = O(n^2)$.

### Rule 2: Drop Lower-Order Terms

When summing terms, only the dominant (fastest-growing) term matters.

**Example:** $O(n^2 + n) = O(n^2)$, $O(n^3 + 1000n^2 + 5000) = O(n^3)$.

### Rule 3: Sum Rule

$$O(f(n)) + O(g(n)) = O(\max(f(n), g(n)))$$

If you perform two operations sequentially, the total complexity is dominated by the slower one.

**Example:** An $O(n)$ loop followed by an $O(n^2)$ loop gives $O(n) + O(n^2) = O(n^2)$.

### Rule 4: Product Rule

$$O(f(n)) \cdot O(g(n)) = O(f(n) \cdot g(n))$$

If an $O(f(n))$ operation is performed inside an $O(g(n))$ loop, the total is their product.

**Example:** An $O(\log n)$ operation inside an $O(n)$ loop gives $O(n) \cdot O(\log n) = O(n \log n)$.

### Rule 5: Transitivity

If $f(n) = O(g(n))$ and $g(n) = O(h(n))$, then $f(n) = O(h(n))$.

**Example:** $n = O(n^2)$ and $n^2 = O(n^3)$, therefore $n = O(n^3)$.

### Rule 6: Polynomial Rule

If $f(n)$ is a polynomial of degree $k$ (i.e., $f(n) = a_k n^k + a_{k-1} n^{k-1} + \ldots + a_0$), then $f(n) = O(n^k)$.

**Example:** $3n^4 + 7n^3 + 2n + 9 = O(n^4)$.

**Proof sketch:** Each lower-order term $a_i n^i \leq a_i n^k$ for $n \geq 1$ and $i \leq k$. So $f(n) \leq (|a_k| + |a_{k-1}| + \ldots + |a_0|) \cdot n^k$.

### Rule 7: Logarithm Bases Don't Matter

$O(\log_a n) = O(\log_b n)$ for any constants $a, b > 1$, because $\log_a n = \frac{\log_b n}{\log_b a}$ and $\frac{1}{\log_b a}$ is a constant.

**Example:** $O(\log_2 n) = O(\log_{10} n) = O(\ln n) = O(\log n)$.

---

## Common Complexity Classes

Listed from fastest to slowest growth:

| Class | Name | Example |
|-------|------|---------|
| $O(1)$ | Constant | Array access by index, hash table lookup (amortized) |
| $O(\log n)$ | Logarithmic | Binary search |
| $O(\sqrt{n})$ | Square root | Trial division primality test |
| $O(n)$ | Linear | Linear search, single traversal |
| $O(n \log n)$ | Linearithmic | Merge sort, efficient comparison sorts |
| $O(n^2)$ | Quadratic | Bubble sort, nested loops |
| $O(n^3)$ | Cubic | Floyd-Warshall, naive matrix multiplication |
| $O(2^n)$ | Exponential | Brute-force subset enumeration |
| $O(n!)$ | Factorial | Brute-force permutation enumeration |

### Growth Rate Comparison

For $n = 1{,}000{,}000$ (one million), assuming one operation per nanosecond:

| $f(n)$ | Value | Time |
|--------|-------|------|
| $\log_2 n$ | ~20 | 20 ns |
| $n$ | $10^6$ | 1 ms |
| $n \log n$ | ~$2 \times 10^7$ | 20 ms |
| $n^2$ | $10^{12}$ | ~17 minutes |
| $n^3$ | $10^{18}$ | ~31.7 years |
| $2^n$ | $10^{301{,}029}$ | Longer than the age of the universe |

### Real-World Analogies

These analogies help build intuition for how each complexity class "feels" in practice:

| Class | Analogy | Why |
|-------|---------|-----|
| $O(1)$ | Looking up a word on a specific page number | You go directly to the page -- the size of the book doesn't matter. |
| $O(\log n)$ | Finding a word in a dictionary by flipping to the middle | Each flip eliminates half the remaining pages. A 1,000-page dictionary takes about 10 flips. |
| $O(n)$ | Reading every page in a book | You must look at each page once. Doubling the book length doubles your reading time. |
| $O(n \log n)$ | Sorting a deck of cards efficiently | Merge sort: split the deck, sort each half, merge. More work than one pass, but far less than comparing everything. |
| $O(n^2)$ | Comparing every person in a room with every other person | With 10 people that's 45 handshakes. With 100 people it's 4,950. Growth is quadratic. |
| $O(2^n)$ | Trying every combination of $n$ on/off switches | Each switch doubles the possibilities. 10 switches = 1,024 combinations. 30 switches = over 1 billion. |
| $O(n!)$ | Trying every arrangement of $n$ books on a shelf | 10 books = 3,628,800 arrangements. 20 books = more arrangements than atoms in the human body. |

### Important Algorithm Complexities

Beyond the common complexity classes above, it is useful to know the complexities of several celebrated algorithms:

| Algorithm | Time Complexity | Notes |
|-----------|----------------|-------|
| Fast Fourier Transform (FFT) | $O(n \log n)$ | Transforms between time and frequency domains; basis for signal processing |
| Karatsuba Multiplication | $O(n^{1.585})$ | Faster than schoolbook $O(n^2)$ multiplication for large integers |
| Strassen Matrix Multiplication | $O(n^{2.807})$ | Faster than naive $O(n^3)$; practical for large matrices |
| Euclid's GCD Algorithm | $O(\log(\min(a,b)))$ | Number of steps bounded by Fibonacci sequence growth |
| Gaussian Elimination | $O(n^3)$ | Solving $n$ linear equations in $n$ unknowns |
| Dijkstra's Shortest Path | $O((V + E) \log V)$ | With a binary heap; $O(V^2)$ with a simple array |
| Binary Exponentiation | $O(\log n)$ | Computing $a^n$ by repeated squaring |

---

## Time Complexity

Time complexity counts the number of **fundamental operations** (comparisons, assignments, arithmetic) as a function of input size $n$.

### How to Analyze Code

#### Rule 1: Sequential Statements Add

```java
int a = arr[0];           // O(1)
int b = arr[arr.length-1]; // O(1)
int sum = a + b;           // O(1)
// Total: O(1) + O(1) + O(1) = O(1)
```

#### Rule 2: Loops Multiply

```java
// O(n)
for (int i = 0; i < n; i++) {
    System.out.println(i);  // O(1)
}
// Total: n * O(1) = O(n)
```

#### Rule 3: Nested Loops Multiply

```java
// O(n^2)
for (int i = 0; i < n; i++) {        // n iterations
    for (int j = 0; j < n; j++) {    // n iterations each
        System.out.println(i + j);   // O(1)
    }
}
// Total: n * n * O(1) = O(n^2)
```

#### Rule 4: Consecutive Blocks Take the Maximum

```java
// Block 1: O(n)
for (int i = 0; i < n; i++) {
    doSomething(i);
}

// Block 2: O(n^2)
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        doSomethingElse(i, j);
    }
}
// Total: O(n) + O(n^2) = O(n^2)
```

#### Rule 5: Conditional Statements Take the Worst Case

```java
if (condition) {
    // O(n) block
    for (int i = 0; i < n; i++) { ... }
} else {
    // O(n^2) block
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) { ... }
    }
}
// Worst case: O(n^2)
```

#### Rule 6: Logarithmic Loops

```java
// O(log n)
int i = 1;
while (i < n) {
    System.out.println(i);
    i *= 2;  // doubles each iteration
}
// Iterations: log_2(n)
```

```java
// Also O(log n)
for (int i = n; i > 0; i /= 2) {
    System.out.println(i);
}
```

### Step-by-Step Loop Analysis Examples

The following examples demonstrate a systematic approach to analyzing loop complexity. For each, we identify the loop structure, count iterations, and determine the total work.

#### Example A: Single Loop -- $O(n)$

```java
public static int sumArray(int[] arr) {
    int sum = 0;                        // O(1)
    for (int i = 0; i < arr.length; i++) {  // Loop runs n times
        sum += arr[i];                  // O(1) per iteration
    }
    return sum;                         // O(1)
}
```

**Analysis:**
- Step 1: The loop variable `i` starts at 0 and increments by 1 each iteration.
- Step 2: The loop terminates when `i >= n`, so it runs exactly $n$ times.
- Step 3: Each iteration performs $O(1)$ work (one addition, one array access).
- Step 4: Total = $n \times O(1) = O(n)$.

#### Example B: Nested Loops -- $O(n^2)$

```java
public static void printPairs(int n) {
    for (int i = 0; i < n; i++) {           // Outer: n iterations
        for (int j = 0; j < n; j++) {       // Inner: n iterations each
            System.out.println(i + ", " + j); // O(1)
        }
    }
}
```

**Analysis:**
- Step 1: The outer loop runs $n$ times.
- Step 2: For **each** outer iteration, the inner loop runs $n$ times.
- Step 3: Body work per inner iteration: $O(1)$.
- Step 4: Total = $n \times n \times O(1) = O(n^2)$.

#### Example C: Consecutive Loops -- $O(n) + O(n^2) = O(n^2)$

```java
public static void consecutiveWork(int[] arr) {
    // Block 1: single loop
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {  // O(n)
        if (arr[i] > max) max = arr[i];
    }

    // Block 2: nested loop
    for (int i = 0; i < arr.length; i++) {       // O(n^2)
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] == max) {
                System.out.println(i + ", " + j);
            }
        }
    }
}
```

**Analysis:**
- Step 1: Block 1 is a single loop running $n$ times: $O(n)$.
- Step 2: Block 2 is a nested loop. The inner loop runs $(n-1) + (n-2) + \ldots + 0 = \frac{n(n-1)}{2}$ times total: $O(n^2)$.
- Step 3: By the Sum Rule, $O(n) + O(n^2) = O(\max(n, n^2)) = O(n^2)$.

#### Example D: Logarithmic Loop ($i \mathrel{*}= 2$) -- $O(\log n)$

```java
public static int countDoublings(int n) {
    int count = 0;
    for (int i = 1; i < n; i *= 2) {  // i doubles each iteration
        count++;
    }
    return count;
}
```

**Analysis:**
- Step 1: The loop variable `i` takes values $1, 2, 4, 8, 16, \ldots$
- Step 2: After $k$ iterations, $i = 2^k$. The loop stops when $2^k \geq n$, i.e., $k \geq \log_2 n$.
- Step 3: Number of iterations = $\lfloor \log_2 n \rfloor + 1 = O(\log n)$.
- Step 4: Each iteration is $O(1)$, so total = $O(\log n)$.

#### Example E: Loop within Log Loop -- $O(n \log n)$

```java
public static void logLinearWork(int n) {
    for (int i = 1; i < n; i *= 2) {       // Outer: O(log n) iterations
        for (int j = 0; j < n; j++) {       // Inner: O(n) iterations each
            System.out.println(i + ", " + j); // O(1)
        }
    }
}
```

**Analysis:**
- Step 1: The outer loop doubles `i` each time, running $O(\log n)$ times (as shown in Example D).
- Step 2: For each outer iteration, the inner loop runs exactly $n$ times.
- Step 3: Body work: $O(1)$ per inner iteration.
- Step 4: By the Product Rule: $O(\log n) \times O(n) = O(n \log n)$.

### Tricky Examples

**Example 1: Dependent inner loop**

```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++) {
        // O(1) work
    }
}
```

Total operations: $0 + 1 + 2 + \ldots + (n-1) = \frac{n(n-1)}{2} = O(n^2)$.

**Example 2: Two different variables**

```java
for (int i = 0; i < a; i++) {
    for (int j = 0; j < b; j++) {
        // O(1) work
    }
}
```

This is $O(a \cdot b)$, **not** $O(n^2)$. Don't assume both loops use the same bound.

**Example 3: Log-linear**

```java
for (int i = 0; i < n; i++) {         // O(n)
    for (int j = 1; j < n; j *= 2) {  // O(log n)
        // O(1) work
    }
}
// Total: O(n log n)
```

**Example 4: Sieve-like pattern**

```java
for (int i = 1; i <= n; i++) {
    for (int j = i; j <= n; j += i) {
        // O(1) work
    }
}
```

Inner loop runs $\lfloor n/i \rfloor$ times. Total: $\sum_{i=1}^{n} \lfloor n/i \rfloor \approx n \ln n = O(n \log n)$. This is the harmonic series pattern.

---

## Space Complexity

Space complexity measures the **additional memory** an algorithm uses as a function of input size, excluding the input itself (unless stated otherwise).

### Examples

```java
// O(1) space -- constant extra memory
public static int sum(int[] arr) {
    int total = 0;
    for (int x : arr) {
        total += x;
    }
    return total;
}
```

```java
// O(n) space -- creates new array
public static int[] reversed(int[] arr) {
    int[] result = new int[arr.length];
    for (int i = 0; i < arr.length; i++) {
        result[i] = arr[arr.length - 1 - i];
    }
    return result;
}
```

```java
// O(n) space due to recursion stack
public static int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
    // Call stack depth: n
}
```

```java
// O(n^2) space -- 2D matrix
public static int[][] createMatrix(int n) {
    int[][] matrix = new int[n][n];
    return matrix;
}
```

### Space-Time Tradeoffs

One of the most fundamental tradeoffs in algorithm design is between time and space. The core idea: **using more memory can reduce computation time, and using less memory often requires more computation**.

**Why the tradeoff exists:** If you precompute and store results, you avoid recomputing them later (trading space for time). If you refuse to store anything extra, you may need to recompute or re-scan data repeatedly (saving space but spending time).

#### Example 1: Duplicate Detection

```java
// O(n^2) time, O(1) space -- check all pairs
public static boolean hasDuplicate(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) return true;
        }
    }
    return false;
}

// O(n) time, O(n) space -- use a hash set
public static boolean hasDuplicateFast(int[] arr) {
    Set<Integer> seen = new HashSet<>();
    for (int x : arr) {
        if (!seen.add(x)) return true;
    }
    return false;
}
```

The hash set version uses $O(n)$ extra memory to store previously seen elements, but this investment buys $O(1)$ lookup per element, reducing total time from $O(n^2)$ to $O(n)$.

#### Example 2: Lookup Table vs. Linear Search

```java
// Approach A: Array -- O(1) space overhead, O(n) search time
// Searching for a student by ID in an unsorted array
public static String findStudentLinear(int[] ids, String[] names, int targetId) {
    for (int i = 0; i < ids.length; i++) {
        if (ids[i] == targetId) return names[i];
    }
    return null; // not found
}

// Approach B: HashMap -- O(n) space overhead, O(1) average search time
// Precompute a lookup table
public static Map<Integer, String> buildLookup(int[] ids, String[] names) {
    Map<Integer, String> map = new HashMap<>();
    for (int i = 0; i < ids.length; i++) {
        map.put(ids[i], names[i]);
    }
    return map; // Each subsequent lookup is O(1)
}
```

If you search once, the linear scan is fine. If you search $m$ times, the array approach costs $O(mn)$ total while the hash map approach costs $O(n)$ to build + $O(m)$ for all queries = $O(n + m)$ total.

#### Example 3: Fibonacci -- Memoization

```java
// O(2^n) time, O(n) space (call stack) -- no memoization
public static long fibSlow(int n) {
    if (n <= 1) return n;
    return fibSlow(n - 1) + fibSlow(n - 2);
}

// O(n) time, O(n) space (call stack + memo array) -- with memoization
public static long fibFast(int n) {
    long[] memo = new long[n + 1];
    Arrays.fill(memo, -1);
    return fibHelper(n, memo);
}

private static long fibHelper(int n, long[] memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fibHelper(n - 1, memo) + fibHelper(n - 2, memo);
    return memo[n];
}
```

The memo array uses $O(n)$ extra space but reduces exponential time to linear time -- one of the most dramatic space-time tradeoffs in practice.

#### Common Tradeoff Patterns

| Pattern | Time | Space | Example |
|---------|------|-------|---------|
| Brute force search | High | Low | Linear search in array |
| Hash-based lookup | Low | High | HashMap for $O(1)$ lookups |
| Precomputed table | Low (queries) | High | Prefix sum array |
| Memoization / DP | Reduced | Increased | Fibonacci with cache |
| Compression | Higher (decode) | Lower (storage) | Compressed data structures |

---

## Best Case, Worst Case, Average Case

### Definitions

- **Best case:** The input that causes the algorithm to perform the fewest operations.
- **Worst case:** The input that causes the most operations. This is what Big-O typically describes.
- **Average case:** The expected number of operations over all possible inputs (requires a probability distribution).

### Example: Linear Search

```java
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
```

- **Best case:** $O(1)$ -- target is the first element.
- **Worst case:** $O(n)$ -- target is the last element or absent.
- **Average case:** $O(n)$ -- assuming target is equally likely to be at any position (or absent), expected comparisons $\approx n/2$.

### Example: Quicksort

- **Best case:** $O(n \log n)$ -- pivot always splits the array in half.
- **Worst case:** $O(n^2)$ -- pivot is always the smallest or largest element (already sorted input with naive pivot choice).
- **Average case:** $O(n \log n)$ -- over random permutations.

---

## Amortized Analysis

Amortized analysis determines the **average cost per operation** over a worst-case sequence of operations. This is different from average-case analysis (which averages over inputs).

### Motivating Example: Dynamic Array (ArrayList)

When an `ArrayList` is full and you add an element, it doubles its capacity and copies all elements. This single operation is $O(n)$. But most insertions are $O(1)$.

**Analysis:** Starting from an empty array of capacity 1:
- Insert elements 1 through $n$.
- Resizing occurs at sizes 1, 2, 4, 8, ..., up to $n$.
- Total copy cost: $1 + 2 + 4 + 8 + \ldots + n \leq 2n$.
- Total cost for $n$ insertions: $n$ (for the insertions themselves) + $2n$ (for copies) = $3n$.
- **Amortized cost per insertion:** $3n / n = O(1)$.

#### Push() Doubling Table (Step-by-Step)

The following table traces what happens when we push elements one at a time into a dynamic array starting with capacity 1. The "Cost" column shows the actual work for each push (1 for the insertion itself, plus the number of elements copied if a resize occurs):

| Push # | Size Before | Capacity Before | Resize? | Copy Cost | Total Cost | Capacity After |
|--------|-------------|-----------------|---------|-----------|------------|----------------|
| 1 | 0 | 1 | No | 0 | 1 | 1 |
| 2 | 1 | 1 | Yes (1->2) | 1 | 2 | 2 |
| 3 | 2 | 2 | Yes (2->4) | 2 | 3 | 4 |
| 4 | 3 | 4 | No | 0 | 1 | 4 |
| 5 | 4 | 4 | Yes (4->8) | 4 | 5 | 8 |
| 6 | 5 | 8 | No | 0 | 1 | 8 |
| 7 | 6 | 8 | No | 0 | 1 | 8 |
| 8 | 7 | 8 | No | 0 | 1 | 8 |
| 9 | 8 | 8 | Yes (8->16) | 8 | 9 | 16 |
| 10--16 | 9--15 | 16 | No | 0 | 1 each | 16 |
| 17 | 16 | 16 | Yes (16->32) | 16 | 17 | 32 |

After 17 pushes, total cost = $(1) + (2) + (3) + (1) + (5) + (1) + (1) + (1) + (9) + 7 \times (1) + (17) = 48$.

Amortized cost per push = $48 / 17 \approx 2.82 = O(1)$.

In general, after $n$ pushes the total cost is at most $3n$, giving an amortized cost of $O(1)$ per push.

#### Java ArrayList in Practice

Java's `ArrayList` uses a growth factor of approximately 1.5x (not 2x), implemented as `newCapacity = oldCapacity + (oldCapacity >> 1)`. The amortized $O(1)$ analysis still holds -- the constant factor is slightly different but the asymptotic result is the same.

### The Aggregate Method

Sum up the total cost of $n$ operations and divide by $n$.

```java
public class DynamicArray {
    private int[] data;
    private int size;
    private int capacity;

    public DynamicArray() {
        capacity = 1;
        data = new int[capacity];
        size = 0;
    }

    // Amortized O(1) per insertion
    public void add(int value) {
        if (size == capacity) {
            capacity *= 2;
            int[] newData = new int[capacity];
            System.arraycopy(data, 0, newData, 0, size);
            data = newData;
            // This resize is O(n), but happens rarely
        }
        data[size++] = value;
    }

    public int get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        return data[index];
    }

    public int size() {
        return size;
    }
}
```

### The Accounting Method (Banker's Method)

Assign an "amortized cost" to each operation. Some operations are "overcharged" (they pay more than their actual cost), and the excess is stored as credit. Expensive operations use this credit.

For the dynamic array:
- Charge each insertion 3 units (instead of the actual 1 unit for most insertions).
- 1 unit pays for the insertion itself.
- 2 units are saved as credit.
- When a resize happens (doubling from $k$ to $2k$), we need to copy $k$ elements. The $k/2$ insertions since the last resize each saved 2 credits, providing $k$ credits total -- exactly enough to pay for the copy.

### The Potential Method

Define a potential function $\Phi$ that maps the state of the data structure to a non-negative number. The amortized cost of operation $i$ is:

$$\hat{c}_i = c_i + \Phi(D_i) - \Phi(D_{i-1})$$

For the dynamic array, let $\Phi = 2 \cdot \text{size} - \text{capacity}$.

- Normal insertion: actual cost 1, $\Phi$ increases by 2, amortized cost = $1 + 2 = 3$.
- Resize (size $k$, capacity doubles from $k$ to $2k$): actual cost $k + 1$, $\Phi$ changes from $2k - k = k$ to $2(k+1) - 2k = 2$, amortized cost = $(k+1) + (2 - k) = 3$.

Every operation has amortized cost 3 = $O(1)$.

---

## Analyzing Recursive Algorithms

### Recurrence Relations

Recursive algorithms produce recurrence relations. For example, merge sort:

$$T(n) = 2T(n/2) + O(n)$$

This says: to sort $n$ elements, sort two halves ($2T(n/2)$) and merge ($O(n)$).

### Solving Recurrences

**Method 1: Substitution (Guess and Verify)**

Guess $T(n) = O(n \log n)$ for merge sort. Prove by induction:
- Assume $T(k) \leq ck \log k$ for $k < n$.
- $T(n) = 2T(n/2) + dn \leq 2c(n/2)\log(n/2) + dn = cn(\log n - 1) + dn = cn\log n - cn + dn$.
- This is $\leq cn\log n$ when $c \geq d$.

**Method 2: Recursion Tree**

Draw the tree of recursive calls. At each level, sum the work:
- Level 0: $O(n)$
- Level 1: $2 \times O(n/2) = O(n)$
- Level 2: $4 \times O(n/4) = O(n)$
- ...
- Level $\log n$: $n \times O(1) = O(n)$

Total: $O(n) \times \log n$ levels = $O(n \log n)$.

**Method 3: Master Theorem** (covered in detail in Module 05)

For recurrences of the form $T(n) = aT(n/b) + O(n^d)$:
- If $d < \log_b a$: $T(n) = O(n^{\log_b a})$
- If $d = \log_b a$: $T(n) = O(n^d \log n)$
- If $d > \log_b a$: $T(n) = O(n^d)$

Merge sort: $a=2, b=2, d=1$. Since $d = \log_2 2 = 1$, $T(n) = O(n \log n)$.

---

## Practical Complexity Analysis in Java

### Example: Two Sum Problem

```java
// Approach 1: Brute force -- O(n^2) time, O(1) space
public static int[] twoSumBrute(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[]{i, j};
            }
        }
    }
    return new int[]{};
}

// Approach 2: Hash map -- O(n) time, O(n) space
public static int[] twoSumHash(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}
```

**Analysis of Approach 2:**
- The `for` loop runs $n$ times.
- `map.containsKey()` and `map.put()` are each $O(1)$ amortized (hash table operations).
- Total: $O(n)$ time.
- The hash map stores up to $n$ entries: $O(n)$ space.

### Example: Matrix Multiplication

```java
// O(n^3) time, O(n^2) space (for result matrix)
public static int[][] multiply(int[][] A, int[][] B) {
    int n = A.length;
    int[][] C = new int[n][n];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
}
```

Three nested loops, each running $n$ times: $O(n^3)$.

### Example: Binary Search

```java
// O(log n) time, O(1) space
public static int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;  // avoids overflow
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

Each iteration halves the search space. Starting from $n$, after $k$ iterations the space is $n / 2^k$. We stop when $n / 2^k = 1$, so $k = \log_2 n$.

### Example: Finding All Subsets (Power Set)

```java
// O(2^n * n) time, O(2^n * n) space
public static List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    result.add(new ArrayList<>());

    for (int num : nums) {
        int size = result.size();
        for (int i = 0; i < size; i++) {
            List<Integer> subset = new ArrayList<>(result.get(i));
            subset.add(num);
            result.add(subset);
        }
    }
    return result;
}
```

There are $2^n$ subsets, each of average size $n/2$. Total output size: $O(n \cdot 2^n)$.

---

## Common Pitfalls

### Pitfall 1: Ignoring Hidden Costs

```java
// This is NOT O(n) -- string concatenation creates new strings
String s = "";
for (int i = 0; i < n; i++) {
    s += "a";  // Each += copies the entire string
}
// Actual complexity: O(n^2)

// Fix: use StringBuilder -- O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append("a");
}
String s = sb.toString();
```

### Pitfall 2: Assuming Hash Operations Are Always O(1)

Hash table operations are $O(1)$ **amortized** and **average case**. In the worst case (all keys hash to the same bucket), lookup is $O(n)$. Java 8+ mitigates this for `HashMap` by using balanced trees for long chains, giving worst-case $O(\log n)$ per operation.

### Pitfall 3: Confusing Input Size with Input Value

```java
// Is this O(n)?
public static boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}
```

This is $O(\sqrt{n})$ where $n$ is the **value** of the input. But if we measure complexity in terms of the number of **bits** $b = \log_2 n$ needed to represent the input, then $n = 2^b$ and the algorithm is $O(2^{b/2})$ -- exponential in the input size!

### Pitfall 4: Forgetting Recursive Space

```java
// O(n) space due to call stack, not O(1)!
public static int sum(int[] arr, int i) {
    if (i == arr.length) return 0;
    return arr[i] + sum(arr, i + 1);
}
```

---

## When to Use "Inefficient" Algorithms

Big-O notation describes asymptotic behavior as $n \to \infty$, but in practice $n$ is finite and often small. There are legitimate reasons to choose an algorithm with a worse Big-O class.

### Small Input Sizes

For small $n$, constant factors and overhead dominate. An $O(n^2)$ algorithm with small constants can outperform an $O(n \log n)$ algorithm with large constants when $n$ is small.

```java
// For n < 50, insertion sort (O(n^2)) beats merge sort (O(n log n))
// because insertion sort has lower overhead: no recursive calls,
// no temporary array allocation, and excellent cache locality.
// This is why Timsort uses insertion sort for small subarrays.
```

### Exponential Is Fine for Tiny Inputs

An $O(2^n)$ algorithm is perfectly acceptable when $n \leq 20$:
- $2^{10} = 1{,}024$ -- microseconds on modern hardware
- $2^{15} = 32{,}768$ -- still nearly instant
- $2^{20} = 1{,}048{,}576$ -- about a million operations, under a second

Many constraint satisfaction and combinatorial problems in competitive programming use exponential algorithms with $n \leq 20$ as a deliberate constraint.

### Constant Factors and Cache Performance

Two $O(n)$ algorithms can differ by orders of magnitude in wall-clock time due to:
- **Cache locality:** Sequential array access is much faster than pointer-chasing through a linked list, even though both are $O(n)$.
- **Branch prediction:** Predictable branching patterns run faster on modern CPUs.
- **Memory allocation overhead:** An algorithm that allocates many small objects (e.g., tree nodes) may be slower than one using a flat array.

### Simplicity and Correctness

A simpler $O(n^2)$ algorithm may be preferable to a complex $O(n \log n)$ one when:
- The code is easier to understand, test, and maintain.
- The problem size is known to be small.
- Development time is constrained and correctness matters more than speed.

### Practical Decision Framework

| Input Size $n$ | Acceptable Complexities |
|----------------|------------------------|
| $n \leq 10$ | $O(n!)$, $O(2^n)$ |
| $n \leq 20$ | $O(2^n)$, $O(n \cdot 2^n)$ |
| $n \leq 500$ | $O(n^3)$ |
| $n \leq 5{,}000$ | $O(n^2)$ |
| $n \leq 10^6$ | $O(n \log n)$ |
| $n \leq 10^8$ | $O(n)$ |
| $n > 10^8$ | $O(\log n)$, $O(1)$ |

These are rough guidelines assuming approximately $10^8$ operations per second.

---

## Historical Milestones in Complexity Analysis

Understanding the history of asymptotic analysis helps appreciate why we have the notation and techniques we do today.

| Year | Milestone | Contributor |
|------|-----------|-------------|
| 1894 | Introduced Big-O notation for describing asymptotic behavior of functions | Paul Bachmann, in *Die Analytische Zahlentheorie* |
| 1909 | Popularized Big-O in number theory and introduced little-o | Edmund Landau |
| 1960s | Formalized algorithmic complexity as a field of study | Hartmanis & Stearns (1965 Turing Award for computational complexity) |
| 1975 | Pioneered amortized analysis for data structures (union-find) | Robert Tarjan |
| 1976 | Systematized Big-O, Big-$\Omega$, Big-$\Theta$ notation for algorithm analysis | Donald Knuth, in "Big Omicron and Big Omega and Big Theta" |
| 1985 | Formalized the accounting and potential methods for amortized analysis | Tarjan, in *Amortized Computational Complexity* |

Knuth's 1976 paper is particularly important: he argued that computer scientists should use $\Theta$ for tight bounds and $\Omega$ for lower bounds (correcting inconsistent usage), establishing the conventions we use today.

---

## Summary Table

| Concept | What It Describes |
|---------|-------------------|
| Big-O | Upper bound on growth rate |
| Big-$\Omega$ | Lower bound on growth rate |
| Big-$\Theta$ | Tight bound on growth rate |
| Time complexity | Operations as a function of input size |
| Space complexity | Extra memory as a function of input size |
| Best case | Minimum operations for any input |
| Worst case | Maximum operations for any input |
| Average case | Expected operations over input distribution |
| Amortized | Average cost per operation over a sequence |

---

## Quiz

**Q1.** Rank the following in order of growth rate from slowest to fastest: $O(n!)$, $O(n^2)$, $O(2^n)$, $O(n \log n)$, $O(1)$, $O(\log n)$, $O(n)$.

**A1.** $O(1) < O(\log n) < O(n) < O(n \log n) < O(n^2) < O(2^n) < O(n!)$.

---

**Q2.** What is the time complexity of the following code?

```java
for (int i = 1; i <= n; i *= 3) {
    for (int j = 0; j < n; j++) {
        // O(1) work
    }
}
```

**A2.** The outer loop runs $\log_3 n$ times (since $i$ triples each iteration). The inner loop runs $n$ times for each outer iteration. Total: $O(n \log n)$.

---

**Q3.** Explain why `ArrayList.add()` is said to be $O(1)$ amortized even though a single call can take $O(n)$ time.

**A3.** Resizing (which costs $O(n)$) happens only when the array is full, and capacity doubles each time. Over $n$ insertions, the total cost of all resizes is at most $2n$ (a geometric series). Adding the $n$ basic insertions gives a total cost of $3n$, so the average (amortized) cost per insertion is $3n/n = O(1)$.

---

**Q4.** What is the space complexity of a recursive Fibonacci implementation `fib(n)` that uses no memoization?

**A4.** $O(n)$. Although the total number of calls is $O(2^n)$, the maximum depth of the call stack at any point is $n$ (the leftmost branch), and Java's call stack only holds the current chain of calls.

---

**Q5.** Is the following statement true or false? "$5n^2 + 3n = O(n^3)$"

**A5.** True. Big-O is an upper bound. $5n^2 + 3n$ is bounded above by $cn^3$ for some constant $c$ and sufficiently large $n$. However, while technically correct, this is not a tight bound. The tight bound is $\Theta(n^2)$.

---

**Q6.** Analyze the time complexity of this code:

```java
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j += i + 1) {
        // O(1) work
    }
}
```

**A6.** For each $i$, the inner loop runs $\lceil n / (i+1) \rceil$ times. The total is $\sum_{i=0}^{n-1} \frac{n}{i+1} = n \sum_{k=1}^{n} \frac{1}{k} = O(n \log n)$ (harmonic series).

---

**Q7.** A function processes an $n \times n$ matrix row by row. For each row, it performs a binary search on that row (assume each row is sorted). What is the overall time complexity?

**A7.** There are $n$ rows, and binary search on a row of length $n$ takes $O(\log n)$. Total: $O(n \log n)$.

---

**Q8.** What is the difference between average-case analysis and amortized analysis?

**A8.** Average-case analysis computes the expected cost of a single operation averaged over all possible inputs (requires a probability distribution on inputs). Amortized analysis computes the average cost per operation over a worst-case sequence of operations (no probability assumptions; it considers how expensive operations are "paid for" by cheaper ones in the same sequence).

---

**Q9.** Prove formally that $2n^2 + 3n + 5 = O(n^2)$ by finding specific values of $c$ and $n_0$.

**A9.** For $n \geq 1$: $3n \leq 3n^2$ and $5 \leq 5n^2$. So $2n^2 + 3n + 5 \leq 2n^2 + 3n^2 + 5n^2 = 10n^2$. Choose $c = 10$ and $n_0 = 1$.

---

**Q10.** True or false: $n^2 = o(n^2)$. Explain.

**A10.** False. $\lim_{n \to \infty} \frac{n^2}{n^2} = 1 \neq 0$. Little-o requires the limit to be 0, meaning $f$ must grow *strictly slower* than $g$. Since $n^2$ grows at exactly the same rate as $n^2$, we have $n^2 = \Theta(n^2)$ but $n^2 \neq o(n^2)$.

---

**Q11.** Using the Sum Rule and Product Rule, what is the time complexity of the following code?

```java
for (int i = 0; i < n; i++) {          // Block A
    System.out.println(i);
}
for (int i = 1; i < n; i *= 2) {       // Block B
    for (int j = 0; j < n; j++) {
        System.out.println(i + j);
    }
}
```

**A11.** Block A: $O(n)$. Block B: the outer loop runs $O(\log n)$ times and the inner loop runs $O(n)$ times, so by the Product Rule, Block B is $O(n \log n)$. By the Sum Rule: $O(n) + O(n \log n) = O(\max(n, n \log n)) = O(n \log n)$.

---

**Q12.** A hash table provides $O(1)$ average lookup but uses $O(n)$ space. A sorted array provides $O(\log n)$ lookup with $O(n)$ space. Under what circumstances would you prefer the sorted array?

**A12.** You might prefer a sorted array when: (1) memory is constrained and the hash table's overhead per entry (load factor, pointers, bucket arrays) is significant; (2) you need range queries or ordered iteration, which hash tables cannot provide; (3) worst-case guarantees matter (hash tables can degrade to $O(n)$ per lookup with poor hash functions); (4) the data is static (no insertions/deletions) and you want cache-friendly sequential access.

---

**Q13.** An algorithm takes $O(n^3)$ time. Is it practical for $n = 100$? For $n = 100{,}000$? Justify with approximate operation counts.

**A13.** For $n = 100$: $100^3 = 10^6$ operations -- easily done in milliseconds. Perfectly practical. For $n = 100{,}000$: $100{,}000^3 = 10^{15}$ operations. At $10^8$ operations per second, this would take about $10^7$ seconds, or roughly 115 days. Not practical.
