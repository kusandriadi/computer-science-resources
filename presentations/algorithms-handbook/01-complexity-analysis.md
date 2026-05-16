---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 01: Complexity Analysis

**Why this matters:** Complexity analysis is the universal language for describing algorithm performance -- independent of hardware, language, and implementation.

---

# Real-World Motivation

Two sorting algorithms on 1,000 elements: A takes 0.5s, B takes 0.8s. A looks faster.

At **n = 1,000,000**:
- A is O(n^2): ~5.8 **days**
- B is O(n log n): ~27 **minutes**

**Growth rate dominates at scale.** Constant factors are noise.

---

# How to Read Big-O Notation

| Notation | Say it as | Meaning |
|----------|-----------|---------|
| O(1) | "constant time" | Same speed regardless of input |
| O(log n) | "log n" | Halving the problem each step |
| O(n) | "linear" | Touch each item once |
| O(n log n) | "n log n" | Slightly worse than linear |
| O(n^2) | "n squared" | Every pair of items |
| O(2^n) | "two to the n" | Doubles with each new item |
| O(n!) | "n factorial" | Every possible arrangement |

---

# Big-O: Upper Bound

f(n) = O(g(n)) means f grows **no faster than** g.

- There exist constants c > 0 and n0 such that f(n) <= c * g(n) for all n >= n0
- **Example:** 3n^2 + 5n + 7 = O(n^2). Choose c=15, n0=1

```java
// This loop is O(n)
for (int i = 0; i < n; i++) {
    doWork(i);  // O(1)
}
```

**Time:** O(n) | **Space:** O(1)

---

# Big-Omega and Big-Theta

| Notation | Analogy | Meaning |
|----------|---------|---------|
| f = O(g) | f <= g | f grows no faster than g |
| f = Omega(g) | f >= g | f grows no slower than g |
| f = Theta(g) | f = g | f grows at the same rate as g |
| f = o(g) | f < g | f grows strictly slower than g |
| f = omega(g) | f > g | f grows strictly faster than g |

**Theta = tight bound (both upper AND lower)**

---

# Big-O Rules

1. **Drop constants:** O(5n) = O(n)
2. **Drop lower-order terms:** O(n^2 + n) = O(n^2)
3. **Sum rule:** O(f) + O(g) = O(max(f, g))
4. **Product rule:** O(f) * O(g) = O(f * g)
5. **Log bases don't matter:** O(log2 n) = O(log10 n)

---

# Common Complexity Classes

| Class | Name | Example | n=10^6 at 1ns/op |
|-------|------|---------|-------------------|
| O(1) | Constant | Array access | 1 ns |
| O(log n) | Logarithmic | Binary search | 20 ns |
| O(n) | Linear | Single pass | 1 ms |
| O(n log n) | Linearithmic | Merge sort | 20 ms |
| O(n^2) | Quadratic | Nested loops | ~17 min |
| O(n^3) | Cubic | Floyd-Warshall | ~31.7 years |
| O(2^n) | Exponential | Subset enum | Heat death |

---

# Real-World Analogies

| Class | Analogy |
|-------|---------|
| O(1) | Looking up a word by page number |
| O(log n) | Finding a word in a dictionary (flip to middle) |
| O(n) | Reading every page of a book |
| O(n^2) | Everyone in a room shakes hands with everyone else |
| O(2^n) | Every combination of n on/off switches |
| O(n!) | Every arrangement of n books on a shelf |

---

# Analyzing Code: Key Rules

```java
// Rule: Nested loops MULTIPLY
for (int i = 0; i < n; i++) {       // n
    for (int j = 0; j < n; j++) {   // * n
        doWork(i, j);               // * O(1)
    }
}
// Total: O(n^2)
```

```java
// Rule: Consecutive blocks take the MAX
blockA(); // O(n)
blockB(); // O(n^2)
// Total: O(n^2)
```

---

# Logarithmic Loops

```java
// O(log n) -- i doubles each iteration
for (int i = 1; i < n; i *= 2) {
    doWork(i);
}
// After k steps: i = 2^k, stops when 2^k >= n
// So k = log2(n)
```

```java
// O(n log n) -- log loop inside linear loop
for (int i = 0; i < n; i++) {
    for (int j = 1; j < n; j *= 2) {
        doWork(i, j);
    }
}
```

---

# Tricky Example: Dependent Inner Loop

```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++) {
        // O(1) work
    }
}
```

Total: 0 + 1 + 2 + ... + (n-1) = **n(n-1)/2 = O(n^2)**

```java
// Two DIFFERENT variables -- NOT O(n^2)!
for (int i = 0; i < a; i++) {
    for (int j = 0; j < b; j++) { }
}
// This is O(a * b)
```

---

# Space Complexity

Measures **additional memory** as a function of input size.

```java
int sum(int[] arr) {        // O(1) space
    int total = 0;
    for (int x : arr) total += x;
    return total;
}
```

```java
int factorial(int n) {      // O(n) space (stack!)
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

---

# Space-Time Tradeoff: Duplicate Detection

```java
// O(n^2) time, O(1) space -- brute force
for (int i = 0; i < n; i++)
    for (int j = i+1; j < n; j++)
        if (arr[i] == arr[j]) return true;
```

```java
// O(n) time, O(n) space -- hash set
Set<Integer> seen = new HashSet<>();
for (int x : arr)
    if (!seen.add(x)) return true;
```

**More memory => less computation (and vice versa)**

---

# Best / Worst / Average Case

**Linear Search example:**
- **Best:** O(1) -- target is first element
- **Worst:** O(n) -- target is last or absent
- **Average:** O(n) -- expected ~n/2 comparisons

**Quicksort:**
- **Best:** O(n log n) -- balanced partitions
- **Worst:** O(n^2) -- already sorted + bad pivot
- **Average:** O(n log n)

Big-O usually describes the **worst case**.

---

# Amortized Analysis: ArrayList

Most insertions are O(1). Occasionally, resize copies all n elements: O(n).

| Push # | Resize? | Cost |
|--------|---------|------|
| 1 | No | 1 |
| 2 | Yes (1->2) | 2 |
| 3 | Yes (2->4) | 3 |
| 4 | No | 1 |
| 5 | Yes (4->8) | 5 |

After n pushes, total cost <= 3n. **Amortized O(1) per push.**

---

# Analyzing Recursive Algorithms

**Merge sort recurrence:** T(n) = 2T(n/2) + O(n)

**Recursion tree:**
- Level 0: O(n) work
- Level 1: 2 * O(n/2) = O(n)
- Level k: O(n) at every level
- Depth: log2(n) levels

**Total: O(n) * log(n) = O(n log n)**

---

# Master Theorem (Quick Reference)

For T(n) = aT(n/b) + O(n^d):

| Condition | Result |
|-----------|--------|
| d < log_b(a) | T(n) = O(n^(log_b a)) |
| d = log_b(a) | T(n) = O(n^d log n) |
| d > log_b(a) | T(n) = O(n^d) |

**Examples:**
- Merge sort: a=2, b=2, d=1 => d = log_2(2) => **O(n log n)**
- Binary search: a=1, b=2, d=0 => d = log_2(1) => **O(log n)**

---

# Common Pitfalls

```java
// PITFALL: String concatenation is O(n^2)!
String s = "";
for (int i = 0; i < n; i++)
    s += "a";  // copies entire string each time
// FIX: Use StringBuilder -- O(n)
```

- Hash table ops are O(1) **amortized average**, not always
- Recursive space: don't forget the call stack!
- Input size vs input value: isPrime(n) is O(sqrt(n)) in value but exponential in bits

---

# Practical Decision Framework

| Input Size n | Acceptable Complexities |
|--------------|------------------------|
| n <= 10 | O(n!), O(2^n) |
| n <= 20 | O(2^n), O(n * 2^n) |
| n <= 500 | O(n^3) |
| n <= 5,000 | O(n^2) |
| n <= 10^6 | O(n log n) |
| n <= 10^8 | O(n) |
| n > 10^8 | O(log n), O(1) |

Assumes ~10^8 operations per second.

---

# Quiz

1. **Rank from slowest to fastest growth:**
   O(n!), O(n^2), O(2^n), O(n log n), O(1), O(log n), O(n)

2. **What is the time complexity of this code?**
   ```java
   for (int i = 1; i <= n; i *= 3)
       for (int j = 0; j < n; j++) { }
   ```

3. **Why is ArrayList.add() amortized O(1) even though a single call can be O(n)?**

4. **True or false: 5n^2 + 3n = O(n^3)?**

---

# Quiz Answers

1. O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)

2. Outer: O(log3 n), Inner: O(n) => **O(n log n)**

3. Resizing doubles capacity; total copy cost over n inserts <= 2n. Total cost = 3n, so amortized = 3n/n = **O(1)**

4. **True** -- Big-O is an upper bound. But the tight bound is Theta(n^2).
