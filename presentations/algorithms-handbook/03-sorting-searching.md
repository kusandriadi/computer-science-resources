---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 03: Sorting and Searching

**Why this matters:** Sorting and searching are the most fundamental operations in CS. Understanding their trade-offs -- stability, speed, space, adaptivity -- is essential for every engineer.

---

# Real-World Motivation

- **Database queries** rely on sorted indexes for fast lookup
- **Search engines** sort billions of results by relevance
- **GPS navigation** searches for shortest paths through millions of intersections

**Lower bound:** Any comparison-based sort needs at least Omega(n log n) comparisons in the worst case.

---

# Comparison Sort Lower Bound

Why O(n log n) is the floor for comparison sorts:

- n! possible permutations of n elements
- Decision tree with n! leaves has height >= log2(n!)
- log2(n!) = Omega(n log n) by Stirling's approximation

**Merge sort and heapsort are asymptotically optimal.**

Non-comparison sorts (counting, radix, bucket) can break this barrier.

---

# Simple Sorts: Bubble, Selection, Insertion

| Algorithm | Best | Avg | Worst | Space | Stable |
|-----------|------|-----|-------|-------|--------|
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion | **O(n)** | O(n^2) | O(n^2) | O(1) | Yes |

**Insertion sort wins for:**
- Small arrays (n < 50)
- Nearly sorted data (adaptive!)
- Used as base case in Timsort

---

# Merge Sort

**Divide, sort halves, merge.** Guaranteed O(n log n).

```java
void mergeSort(int[] a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
}
```

| Property | Value |
|----------|-------|
| Time (all cases) | O(n log n) |
| Space | O(n) |
| Stable | **Yes** |

**Best for:** Linked lists, guaranteed performance, stability needed.

---

# Quicksort

**Choose pivot, partition, recurse.** Fastest in practice.

```java
void quickSort(int[] a, int lo, int hi) {
    if (lo < hi) {
        int p = partition(a, lo, hi);
        quickSort(a, lo, p - 1);
        quickSort(a, p + 1, hi);
    }
}
```

| Property | Value |
|----------|-------|
| Time (avg) | O(n log n) |
| Time (worst) | O(n^2) -- bad pivots |
| Space | O(log n) |
| Stable | **No** |

**Java's `Arrays.sort(int[])` uses dual-pivot quicksort.**

---

# Heapsort

Build max-heap, repeatedly extract max.

| Property | Value |
|----------|-------|
| Time (all cases) | O(n log n) |
| Space | **O(1)** |
| Stable | No |

**Guaranteed O(n log n) + O(1) space** -- best of both worlds asymptotically.

Slower than quicksort in practice (poor cache locality). Used as fallback in introsort.

---

# Timsort: The Industry Standard

Hybrid: merge sort + insertion sort. Exploits existing runs.

- Detects natural sorted subsequences ("runs")
- Short runs extended with insertion sort (n < 32)
- Runs merged with merge sort

| Property | Value |
|----------|-------|
| Time (best) | **O(n)** -- already sorted! |
| Time (worst) | O(n log n) |
| Space | O(n) |
| Stable | **Yes** |

**Java's `Arrays.sort(Object[])` and `Collections.sort()`** use Timsort.

---

# Non-Comparison Sorts

| Algorithm | Time | Space | When to Use |
|-----------|------|-------|-------------|
| Counting Sort | O(n + k) | O(n + k) | Integer keys, small range k |
| Radix Sort | O(d * n) | O(n + b) | Fixed-width integers |
| Bucket Sort | O(n + k) avg | O(n + k) | Uniform distribution |

```java
// Radix sort: process 8 bits at a time
// 32-bit ints => 4 passes => O(4n) = O(n)
for (int exp = 1; max/exp > 0; exp *= 10)
    countingSortByDigit(arr, exp);
```

---

# Sorting Algorithm Comparison Table

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Timsort | O(n) | O(n log n) | O(n log n) | O(n) | Yes |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(n+k) | Yes |
| Radix | O(dn) | O(dn) | O(dn) | O(n+b) | Yes |

---

# Binary Search

**Prerequisite:** Sorted array. O(log n) time, O(1) space.

```java
int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

Each iteration halves the search space. Stops after log2(n) steps.

---

# Binary Search Variants

**First occurrence (leftmost):**
```java
if (arr[mid] == target) {
    result = mid; hi = mid - 1; // keep looking left
}
```

**Lower bound (first element >= target):**
```java
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
}
```

**Binary search on answer:** Find min x such that f(x) is true (monotonic predicate).

---

# Interpolation Search

Estimates position using linear interpolation instead of always checking middle.

| Property | Value |
|----------|-------|
| Best | O(1) |
| Average (uniform) | **O(log log n)** |
| Worst (skewed) | O(n) |

Faster than binary search for uniformly distributed data, but binary search is more reliable in general.

---

# Choosing a Sort

| Scenario | Best Algorithm |
|----------|----------------|
| Small array (n < 50) | Insertion sort |
| General purpose (objects) | Timsort (Arrays.sort) |
| General purpose (primitives) | Dual-pivot quicksort |
| Need stability | Merge sort / Timsort |
| Memory constrained | Heapsort (O(1) space) |
| Integer keys, small range | Counting sort |
| Fixed-width integers | Radix sort |
| Linked list | Merge sort |

---

# Stability Matters

A sort is **stable** if equal elements keep their original order.

```java
// Sort students by grade, then stable-sort by name
// Students with same name stay sorted by grade
people.sort(Comparator.comparing(Person::getLastName)
                       .thenComparing(Person::getFirstName));
```

**Stable:** Merge, Insertion, Counting, Timsort
**Unstable:** Quick, Heap, Selection

---

# Quiz

1. **What is the theoretical lower bound for comparison sorts?**

2. **You have 10M 32-bit integers. Which sort?**

3. **Is quicksort stable? Is merge sort stable? Why?**

4. **What is lowerBound({1,3,3,3,5,7}, 3)?**

---

# Quiz Answers

1. **Omega(n log n)** -- decision tree with n! leaves has height >= log2(n!)

2. **Radix sort** (base 256, 4 passes, O(4n) = O(n)). Or Java's Arrays.sort.

3. **Quicksort: No** (partition swaps equal keys past each other). **Merge sort: Yes** (equal elements from left subarray placed first).

4. **1** -- first element >= 3 is at index 1.
