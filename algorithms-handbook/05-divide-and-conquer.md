# Module 05: Divide and Conquer

## Introduction

Divide and conquer is one of the most powerful algorithmic paradigms. The idea is simple and elegant:

1. **Divide** the problem into smaller subproblems of the same type.
2. **Conquer** the subproblems by solving them recursively. If they are small enough, solve them directly.
3. **Combine** the solutions of the subproblems to form the solution to the original problem.

This paradigm naturally leads to recursive algorithms whose runtime can be analyzed using recurrence relations. It is the engine behind merge sort, quicksort, binary search, and many other fundamental algorithms.

---

## The Paradigm

### When to Apply

Divide and conquer works well when:

- The problem can be broken into independent subproblems (unlike dynamic programming, where subproblems overlap).
- Subproblems are of the same type as the original.
- Combining solutions is efficient.
- The base case is trivial.

### General Structure

```java
public static Result solve(Problem p) {
    if (isBasCase(p)) {
        return solveDirectly(p);
    }

    Problem[] subproblems = divide(p);

    Result[] subresults = new Result[subproblems.length];
    for (int i = 0; i < subproblems.length; i++) {
        subresults[i] = solve(subproblems[i]);
    }

    return combine(subresults);
}
```

---

## Merge Sort: A Deep Dive

Merge sort is the quintessential divide-and-conquer algorithm.

### Algorithm

1. **Divide:** Split the array into two halves.
2. **Conquer:** Recursively sort each half.
3. **Combine:** Merge the two sorted halves into one sorted array.

### Implementation

```java
public static void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return; // base case: 0 or 1 element

    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);        // sort left half
    mergeSort(arr, mid + 1, right);   // sort right half
    merge(arr, left, mid, right);     // combine
}

private static void merge(int[] arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int[] L = new int[n1];
    int[] R = new int[n2];
    System.arraycopy(arr, left, L, 0, n1);
    System.arraycopy(arr, mid + 1, R, 0, n2);

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
```

### Analysis

**Recurrence:** $T(n) = 2T(n/2) + O(n)$

**Recursion tree:**
- Level 0: 1 problem of size $n$, total work $O(n)$
- Level 1: 2 problems of size $n/2$, total work $O(n)$
- Level 2: 4 problems of size $n/4$, total work $O(n)$
- ...
- Level $k$: $2^k$ problems of size $n/2^k$, total work $O(n)$
- ...
- Level $\log_2 n$: $n$ problems of size 1, total work $O(n)$

**Total:** $O(n)$ per level $\times$ $\log_2 n$ levels = $O(n \log n)$.

**Space:** $O(n)$ for temporary arrays + $O(\log n)$ for recursion stack = $O(n)$.

### Counting Inversions

An **inversion** is a pair $(i, j)$ with $i < j$ and $arr[i] > arr[j]$. Counting inversions measures how "unsorted" an array is. A modified merge sort counts inversions in $O(n \log n)$:

```java
public static long countInversions(int[] arr, int left, int right) {
    if (left >= right) return 0;

    int mid = left + (right - left) / 2;
    long count = 0;
    count += countInversions(arr, left, mid);
    count += countInversions(arr, mid + 1, right);
    count += mergeAndCount(arr, left, mid, right);
    return count;
}

private static long mergeAndCount(int[] arr, int left, int mid, int right) {
    int[] L = Arrays.copyOfRange(arr, left, mid + 1);
    int[] R = Arrays.copyOfRange(arr, mid + 1, right + 1);

    int i = 0, j = 0, k = left;
    long inversions = 0;

    while (i < L.length && j < R.length) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            // L[i] > R[j]: all remaining elements in L are inversions with R[j]
            inversions += L.length - i;
            arr[k++] = R[j++];
        }
    }
    while (i < L.length) arr[k++] = L[i++];
    while (j < R.length) arr[k++] = R[j++];

    return inversions;
}
```

---

## Quicksort: Detailed Analysis

### Algorithm

1. **Divide:** Choose a pivot and partition the array so elements $\leq$ pivot are on the left and elements $>$ pivot are on the right.
2. **Conquer:** Recursively sort the left and right partitions.
3. **Combine:** No work needed (array is sorted in-place).

### Three-Way Partition (Dutch National Flag)

Handles duplicate elements efficiently:

```java
public static void quickSort3Way(int[] arr, int lo, int hi) {
    if (lo >= hi) return;

    int lt = lo, gt = hi;
    int pivot = arr[lo];
    int i = lo + 1;

    while (i <= gt) {
        if (arr[i] < pivot) {
            swap(arr, lt++, i++);
        } else if (arr[i] > pivot) {
            swap(arr, i, gt--);
        } else {
            i++;
        }
    }

    // arr[lo..lt-1] < pivot = arr[lt..gt] < arr[gt+1..hi]
    quickSort3Way(arr, lo, lt - 1);
    quickSort3Way(arr, gt + 1, hi);
}

private static void swap(int[] arr, int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```

### Analysis

**Best case:** Pivot always splits the array in half.
$$T(n) = 2T(n/2) + O(n) = O(n \log n)$$

**Worst case:** Pivot is always the min or max (e.g., sorted input with first-element pivot).
$$T(n) = T(n-1) + O(n) = O(n^2)$$

**Average case:** Over all possible permutations:
$$T(n) = O(n \log n)$$

The average case can be proven by noting that the expected partition ratio is not always 50/50 but is "good enough" on average.

### Median-of-Three Pivot

Reduces the probability of worst-case behavior:

```java
private static int medianOfThree(int[] arr, int lo, int hi) {
    int mid = lo + (hi - lo) / 2;
    if (arr[lo] > arr[mid]) swap(arr, lo, mid);
    if (arr[lo] > arr[hi]) swap(arr, lo, hi);
    if (arr[mid] > arr[hi]) swap(arr, mid, hi);
    swap(arr, mid, hi - 1); // place pivot at hi - 1
    return arr[hi - 1];
}
```

### Quickselect: Finding the k-th Smallest Element

A variant of quicksort that finds the $k$-th smallest element in $O(n)$ average time:

```java
public static int quickSelect(int[] arr, int lo, int hi, int k) {
    if (lo == hi) return arr[lo];

    int pivotIndex = randomizedPartition(arr, lo, hi);

    if (k == pivotIndex) {
        return arr[k];
    } else if (k < pivotIndex) {
        return quickSelect(arr, lo, pivotIndex - 1, k);
    } else {
        return quickSelect(arr, pivotIndex + 1, hi, k);
    }
}

private static int randomizedPartition(int[] arr, int lo, int hi) {
    int randomIndex = lo + new Random().nextInt(hi - lo + 1);
    swap(arr, randomIndex, hi);
    int pivot = arr[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            swap(arr, ++i, j);
        }
    }
    swap(arr, i + 1, hi);
    return i + 1;
}
```

**Average time:** $O(n)$ (only recurse on one side).
**Worst time:** $O(n^2)$ (same issue as quicksort; mitigated by random pivots).

---

## Closest Pair of Points

**Problem:** Given $n$ points in the 2D plane, find the pair with the smallest Euclidean distance.

**Brute force:** $O(n^2)$ -- check all pairs.

**Divide and conquer:** $O(n \log n)$.

### Algorithm

1. Sort points by x-coordinate.
2. Divide into left and right halves by the median x-coordinate.
3. Recursively find the closest pair in each half. Let $\delta = \min(\delta_L, \delta_R)$.
4. Check pairs that span the dividing line: only consider points within distance $\delta$ of the line, sorted by y-coordinate. The key insight is that for each point, there are at most 7 points in the "strip" that could be closer.

### Implementation

```java
public class ClosestPair {
    public static double closestPair(int[][] points) {
        // Sort by x-coordinate
        int[][] sortedByX = points.clone();
        Arrays.sort(sortedByX, (a, b) -> a[0] - b[0]);
        return closestPairRec(sortedByX, 0, sortedByX.length - 1);
    }

    private static double closestPairRec(int[][] pts, int lo, int hi) {
        if (hi - lo < 3) {
            return bruteForce(pts, lo, hi);
        }

        int mid = lo + (hi - lo) / 2;
        int midX = pts[mid][0];

        double dLeft = closestPairRec(pts, lo, mid);
        double dRight = closestPairRec(pts, mid + 1, hi);
        double delta = Math.min(dLeft, dRight);

        // Build strip of points within delta of midX
        List<int[]> strip = new ArrayList<>();
        for (int i = lo; i <= hi; i++) {
            if (Math.abs(pts[i][0] - midX) < delta) {
                strip.add(pts[i]);
            }
        }

        // Sort strip by y-coordinate
        strip.sort((a, b) -> a[1] - b[1]);

        // Check each point against the next few (at most 7) in the strip
        for (int i = 0; i < strip.size(); i++) {
            for (int j = i + 1; j < strip.size()
                    && (strip.get(j)[1] - strip.get(i)[1]) < delta; j++) {
                double d = dist(strip.get(i), strip.get(j));
                delta = Math.min(delta, d);
            }
        }

        return delta;
    }

    private static double bruteForce(int[][] pts, int lo, int hi) {
        double minDist = Double.MAX_VALUE;
        for (int i = lo; i <= hi; i++) {
            for (int j = i + 1; j <= hi; j++) {
                minDist = Math.min(minDist, dist(pts[i], pts[j]));
            }
        }
        return minDist;
    }

    private static double dist(int[] a, int[] b) {
        long dx = a[0] - b[0];
        long dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    }
}
```

**Recurrence:** $T(n) = 2T(n/2) + O(n \log n)$ (due to sorting the strip).
This gives $T(n) = O(n \log^2 n)$.

With a more careful implementation (pre-sorting by y and maintaining sorted order during merge), the combine step is $O(n)$, giving $T(n) = 2T(n/2) + O(n) = O(n \log n)$.

---

## Karatsuba Multiplication

**Problem:** Multiply two $n$-digit numbers faster than the grade-school $O(n^2)$ algorithm.

**Idea:** Split each number into two halves:
- $x = x_1 \cdot 10^{n/2} + x_0$
- $y = y_1 \cdot 10^{n/2} + y_0$

**Naive approach:** $xy = x_1 y_1 \cdot 10^n + (x_1 y_0 + x_0 y_1) \cdot 10^{n/2} + x_0 y_0$ -- requires 4 multiplications.

**Karatsuba's trick:** Compute $z_2 = x_1 y_1$, $z_0 = x_0 y_0$, and $z_1 = (x_1 + x_0)(y_1 + y_0) - z_2 - z_0$. Then $xy = z_2 \cdot 10^n + z_1 \cdot 10^{n/2} + z_0$ -- only **3** multiplications.

### Implementation

```java
import java.math.BigInteger;

public class Karatsuba {
    public static BigInteger multiply(BigInteger x, BigInteger y) {
        int n = Math.max(x.bitLength(), y.bitLength());

        // Base case: small enough for direct multiplication
        if (n <= 64) {
            return x.multiply(y);
        }

        int half = n / 2;

        // Split: x = x1 * 2^half + x0, y = y1 * 2^half + y0
        BigInteger x1 = x.shiftRight(half);
        BigInteger x0 = x.subtract(x1.shiftLeft(half));
        BigInteger y1 = y.shiftRight(half);
        BigInteger y0 = y.subtract(y1.shiftLeft(half));

        // Three recursive multiplications
        BigInteger z2 = multiply(x1, y1);
        BigInteger z0 = multiply(x0, y0);
        BigInteger z1 = multiply(x1.add(x0), y1.add(y0))
                         .subtract(z2).subtract(z0);

        // Combine: z2 * 2^(2*half) + z1 * 2^half + z0
        return z2.shiftLeft(2 * half)
                 .add(z1.shiftLeft(half))
                 .add(z0);
    }
}
```

### Analysis

**Recurrence:** $T(n) = 3T(n/2) + O(n)$

By the Master Theorem: $a=3, b=2, d=1$. Since $\log_2 3 \approx 1.585 > 1 = d$:

$$T(n) = O(n^{\log_2 3}) \approx O(n^{1.585})$$

This is a significant improvement over $O(n^2)$ for large numbers. Modern variants (Toom-Cook, FFT-based multiplication) achieve even better bounds.

---

## The Master Theorem

The Master Theorem provides a direct way to solve recurrences of the form:

$$T(n) = aT(n/b) + O(n^d)$$

where $a \geq 1$ (number of subproblems), $b > 1$ (factor by which the problem size shrinks), and $d \geq 0$ (exponent of the work done outside recursion).

### The Three Cases

**Case 1:** $d < \log_b a$ (recursion dominates)
$$T(n) = O(n^{\log_b a})$$

**Case 2:** $d = \log_b a$ (balanced)
$$T(n) = O(n^d \log n)$$

**Case 3:** $d > \log_b a$ (combine step dominates)
$$T(n) = O(n^d)$$

### Intuition

- $a$ subproblems of size $n/b$ means the recursion tree has $\log_b n$ levels.
- At level $k$, there are $a^k$ subproblems, each of size $n/b^k$.
- Work at level $k$: $a^k \cdot O((n/b^k)^d) = O(n^d \cdot (a/b^d)^k)$.
- The ratio $a/b^d$ determines which level dominates:
  - $a/b^d > 1$ (Case 1): bottom levels dominate $\Rightarrow$ driven by leaf count.
  - $a/b^d = 1$ (Case 2): all levels contribute equally $\Rightarrow$ multiply by $\log n$.
  - $a/b^d < 1$ (Case 3): top level dominates $\Rightarrow$ driven by root work.

**How to read this:** The Master Theorem looks scary but it's just asking one question: "At each level of recursion, is more work happening at the TOP (splitting/combining), or at the BOTTOM (base cases)?"
- Case 1: Bottom-heavy — leaf work dominates
- Case 2: Balanced — same work at every level
- Case 3: Top-heavy — root work dominates

### Worked Examples

**Example 1: Merge Sort** -- $T(n) = 2T(n/2) + O(n)$
- $a=2, b=2, d=1$
- $\log_b a = \log_2 2 = 1 = d$ (Case 2)
- $T(n) = O(n \log n)$

**Example 2: Binary Search** -- $T(n) = T(n/2) + O(1)$
- $a=1, b=2, d=0$
- $\log_b a = \log_2 1 = 0 = d$ (Case 2)
- $T(n) = O(\log n)$

**Example 3: Karatsuba** -- $T(n) = 3T(n/2) + O(n)$
- $a=3, b=2, d=1$
- $\log_b a = \log_2 3 \approx 1.585 > 1 = d$ (Case 1)
- $T(n) = O(n^{\log_2 3}) \approx O(n^{1.585})$

**Example 4: Strassen's Matrix Multiplication** -- $T(n) = 7T(n/2) + O(n^2)$
- $a=7, b=2, d=2$
- $\log_b a = \log_2 7 \approx 2.807 > 2 = d$ (Case 1)
- $T(n) = O(n^{\log_2 7}) \approx O(n^{2.807})$

**Example 5:** $T(n) = 4T(n/2) + O(n^3)$
- $a=4, b=2, d=3$
- $\log_b a = \log_2 4 = 2 < 3 = d$ (Case 3)
- $T(n) = O(n^3)$

**Example 6:** $T(n) = 2T(n/2) + O(n \log n)$
- This does NOT fit the standard Master Theorem form (the non-recursive term is $O(n \log n)$, not $O(n^d)$).
- Extended version: $T(n) = O(n \log^2 n)$.

### Limitations

The Master Theorem does not apply when:
- Subproblems have unequal sizes (e.g., $T(n) = T(n/3) + T(2n/3) + O(n)$).
- The non-recursive term is not polynomial (e.g., $O(n \log n)$).
- $a < 1$ or $b \leq 1$.

For such cases, use the recursion tree method or the Akra-Bazzi theorem.

---

## Other Divide-and-Conquer Algorithms

### Maximum Subarray (Kadane's vs. D&C)

The maximum subarray problem can be solved by divide and conquer in $O(n \log n)$:

```java
public static int maxSubArrayDC(int[] arr, int lo, int hi) {
    if (lo == hi) return arr[lo];

    int mid = lo + (hi - lo) / 2;

    int leftMax = maxSubArrayDC(arr, lo, mid);
    int rightMax = maxSubArrayDC(arr, mid + 1, hi);
    int crossMax = maxCrossingSubarray(arr, lo, mid, hi);

    return Math.max(Math.max(leftMax, rightMax), crossMax);
}

private static int maxCrossingSubarray(int[] arr, int lo, int mid, int hi) {
    int leftSum = Integer.MIN_VALUE, sum = 0;
    for (int i = mid; i >= lo; i--) {
        sum += arr[i];
        leftSum = Math.max(leftSum, sum);
    }

    int rightSum = Integer.MIN_VALUE;
    sum = 0;
    for (int i = mid + 1; i <= hi; i++) {
        sum += arr[i];
        rightSum = Math.max(rightSum, sum);
    }

    return leftSum + rightSum;
}
```

Note: Kadane's algorithm solves this in $O(n)$ using dynamic programming, but the D&C approach illustrates the paradigm well.

### Exponentiation by Squaring

Compute $x^n$ in $O(\log n)$ multiplications:

```java
public static long power(long base, int exp, long mod) {
    if (exp == 0) return 1;
    if (exp % 2 == 0) {
        long half = power(base, exp / 2, mod);
        return (half * half) % mod;
    } else {
        return (base * power(base, exp - 1, mod)) % mod;
    }
}

// Iterative version (more practical)
public static long powerIterative(long base, int exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) {
            result = (result * base) % mod;
        }
        exp >>= 1;
        base = (base * base) % mod;
    }
    return result;
}
```

**Recurrence:** $T(n) = T(n/2) + O(1) = O(\log n)$.

---

## Quiz

**Q1.** State the three steps of the divide-and-conquer paradigm.

**A1.** (1) **Divide** the problem into smaller subproblems of the same type. (2) **Conquer** the subproblems by solving them recursively (or directly if small enough). (3) **Combine** the subproblem solutions to form the solution to the original problem.

---

**Q2.** Apply the Master Theorem to $T(n) = 9T(n/3) + O(n^2)$.

**A2.** $a = 9, b = 3, d = 2$. $\log_b a = \log_3 9 = 2 = d$. This is Case 2, so $T(n) = O(n^2 \log n)$.

---

**Q3.** Why does Karatsuba multiplication use only 3 recursive multiplications instead of the expected 4?

**A3.** Instead of computing $x_1 y_0$ and $x_0 y_1$ separately (2 multiplications), Karatsuba computes $(x_1 + x_0)(y_1 + y_0) = x_1 y_1 + x_1 y_0 + x_0 y_1 + x_0 y_0$, then subtracts the already-computed $x_1 y_1$ and $x_0 y_0$ to obtain $x_1 y_0 + x_0 y_1$ using a single multiplication plus additions. This reduces 4 multiplications to 3.

---

**Q4.** What is the time complexity of the closest pair of points algorithm (optimized version)?

**A4.** $O(n \log n)$. The recurrence is $T(n) = 2T(n/2) + O(n)$ when the merge step (strip processing) is implemented efficiently.

---

**Q5.** Merge sort is guaranteed $O(n \log n)$ while quicksort has a worst case of $O(n^2)$. Why is quicksort often preferred in practice?

**A5.** Quicksort has better cache performance (accesses contiguous memory, unlike merge sort which copies to temporary arrays), lower constant factors, is in-place ($O(\log n)$ stack space vs. $O(n)$ for merge sort), and the $O(n^2)$ worst case is easily avoided with randomized pivots or median-of-three.

---

**Q6.** Apply the Master Theorem to $T(n) = T(n/2) + O(n)$.

**A6.** $a = 1, b = 2, d = 1$. $\log_b a = \log_2 1 = 0 < 1 = d$. This is Case 3, so $T(n) = O(n)$.

---

**Q7.** How can merge sort be modified to count the number of inversions in an array?

**A7.** During the merge step, when an element from the right subarray is placed before elements from the left subarray, all remaining elements in the left subarray form inversions with it. If the left subarray has elements $L[i..n_1-1]$ remaining when $R[j]$ is chosen, that contributes $n_1 - i$ inversions. The total inversion count is the sum of inversions from the left recursive call, the right recursive call, and the merge step.

---

**Q8.** Compute $3^{13}$ using exponentiation by squaring. How many multiplications are needed?

**A8.** $3^{13} = 3 \cdot 3^{12} = 3 \cdot (3^6)^2 = 3 \cdot (3^3)^4 = 3 \cdot (3 \cdot 3^2)^4$. Step by step: $3^1 = 3$ (0 mults), $3^2 = 9$ (1), $3^3 = 27$ (2), $3^6 = 729$ (3), $3^{12} = 531441$ (4), $3^{13} = 1594323$ (5). Total: 5 multiplications (vs. 12 with naive repeated multiplication). In general, $O(\log n)$ multiplications.
