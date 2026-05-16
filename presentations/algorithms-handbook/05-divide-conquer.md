---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 05: Divide and Conquer

**Why this matters:** Divide and conquer is the engine behind merge sort, quicksort, binary search, and many other fundamental algorithms. It naturally leads to efficient recursive solutions.

---

# Real-World Motivation

**Searching a phone book:** Don't read every page. Open to the middle, decide which half your name is in, repeat.

**Sorting a deck of cards:** Split the deck, sort each half, merge them together.

**The pattern:** Break the problem in half, solve each half, combine results.

---

# The Three Steps

1. **Divide** the problem into smaller subproblems of the same type
2. **Conquer** by solving subproblems recursively (or directly if small)
3. **Combine** subproblem solutions into the original solution

```java
Result solve(Problem p) {
    if (isBaseCase(p)) return solveDirectly(p);
    Problem[] subs = divide(p);
    Result[] subResults = new Result[subs.length];
    for (int i = 0; i < subs.length; i++)
        subResults[i] = solve(subs[i]);
    return combine(subResults);
}
```

---

# Merge Sort: The Quintessential Example

```java
void mergeSort(int[] a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);       // sort left
    mergeSort(a, m + 1, r);   // sort right
    merge(a, l, m, r);        // combine
}
```

**Recurrence:** T(n) = 2T(n/2) + O(n)

Each level does O(n) work, log(n) levels => **O(n log n)**
**Space:** O(n) for temporary arrays

---

# Counting Inversions via Merge Sort

An **inversion** is a pair (i, j) where i < j but arr[i] > arr[j].

During merge: when right element is placed before left elements, count inversions.

```java
// When R[j] < L[i], ALL remaining L elements
// form inversions with R[j]
inversions += L.length - i;
```

**Time:** O(n log n) -- same as merge sort
**Application:** Measure how "unsorted" data is, collaborative filtering.

---

# Quicksort Analysis

**Best case:** Balanced partitions
T(n) = 2T(n/2) + O(n) = **O(n log n)**

**Worst case:** Min/max always chosen as pivot
T(n) = T(n-1) + O(n) = **O(n^2)**

**Mitigations:**
- Randomized pivot selection
- Median-of-three
- Three-way partition (Dutch National Flag) for duplicates

**In practice:** Fastest comparison sort due to cache locality.

---

# Quickselect: k-th Smallest in O(n)

Only recurse on **one side** (the side containing k).

```java
int quickSelect(int[] a, int lo, int hi, int k) {
    if (lo == hi) return a[lo];
    int p = partition(a, lo, hi);
    if (k == p) return a[k];
    else if (k < p) return quickSelect(a, lo, p-1, k);
    else return quickSelect(a, p+1, hi, k);
}
```

**Average:** O(n) -- geometric series (n + n/2 + n/4 + ...)
**Worst:** O(n^2) -- mitigated by random pivots

---

# Closest Pair of Points

**Problem:** Find closest pair among n points in 2D plane.

1. Sort by x-coordinate
2. Split into left/right halves
3. Recurse on each half, get delta = min(dL, dR)
4. Check strip within delta of dividing line (at most 7 neighbors per point)

**Recurrence:** T(n) = 2T(n/2) + O(n) = **O(n log n)**

Brute force is O(n^2). D&C gives a significant speedup.

---

# Karatsuba Multiplication

Multiply two n-digit numbers faster than O(n^2).

Split: x = x1 * 10^(n/2) + x0, y = y1 * 10^(n/2) + y0

**Trick:** Compute z2 = x1*y1, z0 = x0*y0,
z1 = (x1+x0)(y1+y0) - z2 - z0

**Only 3 multiplications instead of 4!**

**Recurrence:** T(n) = 3T(n/2) + O(n)
**Result:** O(n^(log2 3)) ~ **O(n^1.585)**

---

# The Master Theorem

For T(n) = aT(n/b) + O(n^d):

| Case | Condition | Result |
|------|-----------|--------|
| 1 (bottom-heavy) | d < log_b(a) | O(n^(log_b a)) |
| 2 (balanced) | d = log_b(a) | O(n^d log n) |
| 3 (top-heavy) | d > log_b(a) | O(n^d) |

**Key question:** Is more work at the TOP (root) or BOTTOM (leaves)?

---

# Master Theorem: Worked Examples

| Algorithm | a | b | d | Case | Result |
|-----------|---|---|---|------|--------|
| Merge Sort | 2 | 2 | 1 | d = log_2(2) = 1 | O(n log n) |
| Binary Search | 1 | 2 | 0 | d = log_2(1) = 0 | O(log n) |
| Karatsuba | 3 | 2 | 1 | d < log_2(3)~1.58 | O(n^1.585) |
| Strassen | 7 | 2 | 2 | d < log_2(7)~2.81 | O(n^2.807) |
| T(n) = 4T(n/2) + n^3 | 4 | 2 | 3 | d > log_2(4)=2 | O(n^3) |

---

# Exponentiation by Squaring

Compute x^n in O(log n) multiplications:

```java
long power(long base, int exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1)
            result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}
```

**T(n) = T(n/2) + O(1) = O(log n)**

---

# Maximum Subarray (D&C Approach)

Max subarray either lies entirely in left half, right half, or **crosses the middle**.

```java
int maxCrossing(int[] a, int lo, int mid, int hi) {
    // Extend left from mid, extend right from mid+1
    // Return sum of best left + best right extension
}
```

**Time:** T(n) = 2T(n/2) + O(n) = **O(n log n)**

Note: Kadane's algorithm solves this in O(n) with DP, but D&C illustrates the paradigm.

---

# When to Apply D&C

D&C works well when:
- Problem breaks into **independent** subproblems
- Subproblems are the **same type** as original
- Combining solutions is **efficient**
- Base case is **trivial**

**D&C vs DP:** D&C has independent subproblems; DP has overlapping ones.

---

# Quiz

1. **State the three steps of divide and conquer.**
2. **Apply Master Theorem to T(n) = 9T(n/3) + O(n^2).**
3. **Why does Karatsuba use 3 multiplications instead of 4?**
4. **Why is quicksort often preferred over merge sort in practice?**

---

# Quiz Answers

1. **Divide** into smaller subproblems, **Conquer** recursively, **Combine** solutions.

2. a=9, b=3, d=2. log_3(9) = 2 = d. Case 2 => **O(n^2 log n)**

3. Computes (x1+x0)(y1+y0) = x1y1 + x1y0 + x0y1 + x0y0, then subtracts already-known x1y1 and x0y0 to get x1y0 + x0y1 with **one multiplication** instead of two.

4. Better **cache performance** (contiguous memory), lower constants, in-place (O(log n) stack), O(n^2) worst case easily avoided with random pivots.
