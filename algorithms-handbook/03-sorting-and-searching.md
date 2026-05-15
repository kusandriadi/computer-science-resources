# Module 03: Sorting and Searching

## Introduction

Sorting and searching are among the most fundamental operations in computer science. Sorting transforms unstructured data into ordered data, enabling efficient search, merging, and analysis. Searching locates specific elements within data. These operations appear everywhere -- in databases, operating systems, compilers, networking, and virtually every application that processes data.

Understanding sorting algorithms deeply means understanding trade-offs: stability vs. speed, comparison-based vs. non-comparison, in-place vs. extra memory, best-case vs. worst-case behavior.

---

## Comparison-Based Sorting

### Lower Bound for Comparison Sorts

Any comparison-based sorting algorithm must make at least $\Omega(n \log n)$ comparisons in the worst case. This follows from the decision tree model: there are $n!$ permutations, and a binary tree with $n!$ leaves has height at least $\log_2(n!) = \Omega(n \log n)$.

This means algorithms like merge sort and heapsort are **asymptotically optimal** for comparison-based sorting.

---

### Bubble Sort

**Idea:** Repeatedly walk through the array, swapping adjacent elements that are out of order. After each pass, the largest unsorted element "bubbles" to its correct position.

```java
public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break; // optimization: already sorted
    }
}
```

| Property | Value |
|----------|-------|
| Time (best) | $O(n)$ -- already sorted, with early termination |
| Time (average) | $O(n^2)$ |
| Time (worst) | $O(n^2)$ |
| Space | $O(1)$ |
| Stable | Yes |
| In-place | Yes |

**Verdict:** Rarely used in practice. Useful pedagogically and for nearly-sorted data with the `swapped` optimization.

---

### Selection Sort

**Idea:** Find the minimum element in the unsorted portion and swap it with the first unsorted element.

```java
public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}
```

| Property | Value |
|----------|-------|
| Time (all cases) | $O(n^2)$ |
| Space | $O(1)$ |
| Stable | No (can be made stable with linked list) |
| In-place | Yes |

**Verdict:** Makes the minimum number of swaps ($O(n)$), which can matter when writes are expensive. Otherwise, not competitive.

---

### Insertion Sort

**Idea:** Build the sorted array one element at a time. Take the next unsorted element and insert it into its correct position in the sorted portion.

```java
public static void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

| Property | Value |
|----------|-------|
| Time (best) | $O(n)$ -- already sorted |
| Time (average) | $O(n^2)$ |
| Time (worst) | $O(n^2)$ -- reverse sorted |
| Space | $O(1)$ |
| Stable | Yes |
| In-place | Yes |
| Adaptive | Yes -- faster on nearly sorted data |

**Verdict:** Excellent for small arrays or nearly sorted data. Used as the base case in hybrid sorts (e.g., Timsort uses insertion sort for runs $\leq$ 32--64 elements).

---

### Merge Sort

**Idea:** Divide the array in half, recursively sort each half, then merge the two sorted halves.

```java
public static void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;

    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
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
        if (L[i] <= R[j]) {  // <= ensures stability
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

// Convenience wrapper
public static void mergeSort(int[] arr) {
    mergeSort(arr, 0, arr.length - 1);
}
```

| Property | Value |
|----------|-------|
| Time (all cases) | $O(n \log n)$ |
| Space | $O(n)$ -- for temporary arrays |
| Stable | Yes |
| In-place | No |

**Verdict:** Guaranteed $O(n \log n)$, stable, and predictable. The go-to sort for linked lists (where it can be done in-place). Drawback: requires $O(n)$ extra space for arrays.

---

### Shell Sort

**Idea:** A generalization of insertion sort that allows exchanging elements far apart. It works by sorting elements at a specific gap interval, then progressively reducing the gap until it becomes 1 (at which point it becomes a standard insertion sort, but on nearly-sorted data).

The key insight: insertion sort is very efficient on nearly-sorted data ($O(n)$ best case). By pre-sorting with larger gaps, Shell Sort ensures the final insertion sort pass has very little work to do.

```java
public static void shellSort(int[] arr) {
    int n = arr.length;

    // Start with a large gap and reduce it
    // Using the Knuth gap sequence: 1, 4, 13, 40, 121, ...
    int gap = 1;
    while (gap < n / 3) {
        gap = gap * 3 + 1;
    }

    while (gap >= 1) {
        // Perform gapped insertion sort
        for (int i = gap; i < n; i++) {
            int key = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > key) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = key;
        }
        gap /= 3;
    }
}
```

| Property | Value |
|----------|-------|
| Time (best) | $O(n \log n)$ -- depends on gap sequence |
| Time (average) | $O(n^{3/2})$ to $O(n \log^2 n)$ -- depends on gap sequence |
| Time (worst) | $O(n^{3/2})$ (Knuth), $O(n \log^2 n)$ (Pratt) |
| Space | $O(1)$ |
| Stable | No |
| In-place | Yes |

The complexity depends heavily on the gap sequence. The Knuth sequence ($1, 4, 13, 40, \ldots$) gives $O(n^{3/2})$ worst case. Sedgewick's sequence gives empirically better results. The exact average-case complexity is still an open problem in computer science.

**Verdict:** Shell Sort is a practical choice when you need an in-place sort with better-than-quadratic performance and simpler implementation than merge sort or quicksort. It is used in the `uClibc` library and some embedded systems.

---

### Quicksort

**Idea:** Choose a pivot, partition the array so that elements less than the pivot come before it and elements greater come after, then recursively sort the partitions.

```java
public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

// Lomuto partition scheme
private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high]; // last element as pivot
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}

// Hoare partition scheme (more efficient, fewer swaps)
private static int hoarePartition(int[] arr, int low, int high) {
    int pivot = arr[low + (high - low) / 2];
    int i = low - 1, j = high + 1;
    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        if (i >= j) return j;
        swap(arr, i, j);
    }
}

private static void swap(int[] arr, int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

public static void quickSort(int[] arr) {
    quickSort(arr, 0, arr.length - 1);
}
```

**Randomized quicksort** (avoids worst case on sorted input):

```java
private static int randomizedPartition(int[] arr, int low, int high) {
    int randomIndex = low + new Random().nextInt(high - low + 1);
    swap(arr, randomIndex, high);
    return partition(arr, low, high);
}
```

| Property | Value |
|----------|-------|
| Time (best) | $O(n \log n)$ |
| Time (average) | $O(n \log n)$ |
| Time (worst) | $O(n^2)$ -- poor pivot choices |
| Space | $O(\log n)$ -- recursion stack |
| Stable | No |
| In-place | Yes |

**Verdict:** Fastest comparison sort in practice due to cache locality and low constant factors. Java's `Arrays.sort()` for primitives uses a dual-pivot quicksort variant (introduced in Java 7).

---

### Heapsort

**Idea:** Build a max-heap from the array, then repeatedly extract the maximum element and place it at the end.

```java
public static void heapSort(int[] arr) {
    int n = arr.length;

    // Build max-heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        // Move current root (max) to end
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        // Heapify the reduced heap
        heapify(arr, i, 0);
    }
}

private static void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}
```

| Property | Value |
|----------|-------|
| Time (all cases) | $O(n \log n)$ |
| Space | $O(1)$ |
| Stable | No |
| In-place | Yes |

**Verdict:** Guaranteed $O(n \log n)$ with $O(1)$ extra space -- the best of both worlds. However, it has poor cache locality (jumping around the array during heapify), so it is slower than quicksort in practice despite the same asymptotic complexity. Used as a fallback in introsort when quicksort degrades.

---

### Tree Sort

**Idea:** Insert all elements into a binary search tree (BST), then perform an in-order traversal to retrieve them in sorted order. Using a self-balancing BST (like AVL or Red-Black tree) guarantees $O(n \log n)$ worst-case performance.

```java
public static int[] treeSort(int[] arr) {
    TreeMap<Integer, Integer> tree = new TreeMap<>(); // Red-Black tree
    // Count occurrences to handle duplicates
    for (int x : arr) {
        tree.merge(x, 1, Integer::sum);
    }

    // In-order traversal (TreeMap iterates in sorted key order)
    int[] sorted = new int[arr.length];
    int idx = 0;
    for (Map.Entry<Integer, Integer> entry : tree.entrySet()) {
        for (int i = 0; i < entry.getValue(); i++) {
            sorted[idx++] = entry.getKey();
        }
    }
    return sorted;
}
```

A manual implementation using a BST:

```java
public static int[] treeSortManual(int[] arr) {
    // Simple BST node allowing duplicates via count
    class Node {
        int key, count;
        Node left, right;
        Node(int key) { this.key = key; this.count = 1; }
    }

    // Insert into BST
    Node root = null;
    for (int x : arr) {
        if (root == null) {
            root = new Node(x);
            continue;
        }
        Node cur = root;
        while (true) {
            if (x == cur.key) { cur.count++; break; }
            else if (x < cur.key) {
                if (cur.left == null) { cur.left = new Node(x); break; }
                cur = cur.left;
            } else {
                if (cur.right == null) { cur.right = new Node(x); break; }
                cur = cur.right;
            }
        }
    }

    // In-order traversal to extract sorted elements
    int[] sorted = new int[arr.length];
    int[] idx = {0};
    java.util.function.Consumer<Node> inOrder = new java.util.function.Consumer<>() {
        public void accept(Node node) {
            if (node == null) return;
            accept(node.left);
            for (int i = 0; i < node.count; i++) sorted[idx[0]++] = node.key;
            accept(node.right);
        }
    };
    inOrder.accept(root);
    return sorted;
}
```

| Property | Value |
|----------|-------|
| Time (best) | $O(n \log n)$ |
| Time (average) | $O(n \log n)$ |
| Time (worst) | $O(n^2)$ with unbalanced BST, $O(n \log n)$ with balanced BST |
| Space | $O(n)$ -- for the tree nodes |
| Stable | No (standard BST), Yes (with careful implementation) |
| In-place | No |

**Verdict:** Tree sort is conceptually elegant and produces a useful side effect -- a BST that supports future dynamic insertions, deletions, and searches. However, the $O(n)$ extra space for tree nodes and poor cache locality make it impractical compared to merge sort or quicksort for pure sorting. Use when you need both sorted output and an ongoing dynamic data structure.

---

### Timsort

**Idea:** Timsort is a hybrid sorting algorithm combining merge sort and insertion sort, designed by Tim Peters in 2002 for Python. It exploits the fact that real-world data often contains existing ordered subsequences ("runs"). Java uses Timsort for `Arrays.sort(Object[])` and `Collections.sort()`.

**How it works:**
1. Scan the array for natural "runs" (ascending or descending subsequences).
2. If a run is shorter than a minimum run length (typically 32--64), extend it using insertion sort.
3. Push runs onto a stack and merge them using a merge policy that maintains balance (similar to merge sort, but merging adjacent runs).

The following is a simplified Timsort implementation demonstrating the core concepts:

```java
public class Timsort {
    private static final int MIN_RUN = 32;

    public static void timSort(int[] arr) {
        int n = arr.length;

        // Step 1: Sort small runs using insertion sort
        for (int i = 0; i < n; i += MIN_RUN) {
            insertionSort(arr, i, Math.min(i + MIN_RUN - 1, n - 1));
        }

        // Step 2: Merge runs, doubling the merge size each pass
        for (int size = MIN_RUN; size < n; size *= 2) {
            for (int left = 0; left < n; left += 2 * size) {
                int mid = Math.min(left + size - 1, n - 1);
                int right = Math.min(left + 2 * size - 1, n - 1);
                if (mid < right) {
                    merge(arr, left, mid, right);
                }
            }
        }
    }

    private static void insertionSort(int[] arr, int left, int right) {
        for (int i = left + 1; i <= right; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= left && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int[] leftArr = new int[n1];
        int[] rightArr = new int[n2];

        System.arraycopy(arr, left, leftArr, 0, n1);
        System.arraycopy(arr, mid + 1, rightArr, 0, n2);

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (leftArr[i] <= rightArr[j]) { // <= for stability
                arr[k++] = leftArr[i++];
            } else {
                arr[k++] = rightArr[j++];
            }
        }
        while (i < n1) arr[k++] = leftArr[i++];
        while (j < n2) arr[k++] = rightArr[j++];
    }
}
```

**What makes real Timsort faster than plain merge sort:**
- **Natural run detection:** Scans for pre-existing sorted subsequences (ascending or strictly descending, which it reverses). Real data often has long runs, reducing the number of merges needed.
- **Galloping mode:** During merge, if one side consistently "wins," Timsort switches to a binary search (galloping) to find the correct position in bulk, reducing comparisons.
- **Merge stack invariant:** Runs on a stack satisfy invariants that ensure balanced merging, preventing pathological merge patterns.

| Property | Value |
|----------|-------|
| Time (best) | $O(n)$ -- when data is already sorted (one natural run) |
| Time (average) | $O(n \log n)$ |
| Time (worst) | $O(n \log n)$ |
| Space | $O(n)$ |
| Stable | Yes |
| Adaptive | Yes -- exploits existing order in the data |

**Verdict:** Timsort is the industry standard for sorting objects in Java (since Java 7) and lists in Python (since Python 2.3). Its adaptive nature makes it significantly faster than pure merge sort on real-world data, which often has partially sorted regions. It is the best general-purpose stable sort available.

---

## Non-Comparison Sorting

These algorithms break the $O(n \log n)$ barrier by exploiting the structure of the input (e.g., integer keys within a known range).

### Counting Sort

**Idea:** Count occurrences of each value, then reconstruct the sorted array.

```java
// Assumes values in arr are in range [0, maxVal]
public static int[] countingSort(int[] arr, int maxVal) {
    int[] count = new int[maxVal + 1];
    for (int x : arr) {
        count[x]++;
    }

    // Prefix sum for stable sort
    for (int i = 1; i <= maxVal; i++) {
        count[i] += count[i - 1];
    }

    int[] output = new int[arr.length];
    // Traverse backwards for stability
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    return output;
}
```

| Property | Value |
|----------|-------|
| Time | $O(n + k)$ where $k$ = range of values |
| Space | $O(n + k)$ |
| Stable | Yes |
| In-place | No |

**Verdict:** Extremely fast when $k = O(n)$. Not suitable when the range is much larger than $n$.

---

### Radix Sort

**Idea:** Sort by each digit, from least significant to most significant, using a stable sort (typically counting sort) as a subroutine.

```java
public static void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().orElse(0);

    // Sort by each digit position
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}

private static void countingSortByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n];
    int[] count = new int[10]; // digits 0-9

    for (int x : arr) {
        int digit = (x / exp) % 10;
        count[digit]++;
    }

    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }

    System.arraycopy(output, 0, arr, 0, n);
}
```

| Property | Value |
|----------|-------|
| Time | $O(d \cdot (n + b))$ where $d$ = number of digits, $b$ = base |
| Space | $O(n + b)$ |
| Stable | Yes |
| In-place | No |

For $n$ integers with $d$ digits in base $b$: if $d$ and $b$ are constants (e.g., 32-bit integers, base 256), then radix sort is $O(n)$.

**Verdict:** Very fast for fixed-width integers. Used in practice for sorting large datasets of integers or strings of fixed length.

---

### Bucket Sort

**Idea:** Distribute elements into a number of "buckets" based on their value range, sort each bucket individually (using insertion sort or another sort), then concatenate the sorted buckets. Works best when input is uniformly distributed over a known range.

```java
public static void bucketSort(float[] arr) {
    int n = arr.length;
    if (n <= 1) return;

    // Create n empty buckets
    @SuppressWarnings("unchecked")
    List<Float>[] buckets = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        buckets[i] = new ArrayList<>();
    }

    // Distribute elements into buckets
    // Assumes values are in [0, 1)
    for (float x : arr) {
        int bucketIdx = (int) (x * n);
        if (bucketIdx == n) bucketIdx = n - 1; // handle edge case x == 1.0
        buckets[bucketIdx].add(x);
    }

    // Sort individual buckets (insertion sort is efficient for small buckets)
    for (List<Float> bucket : buckets) {
        Collections.sort(bucket); // uses Timsort internally
    }

    // Concatenate all buckets
    int idx = 0;
    for (List<Float> bucket : buckets) {
        for (float x : bucket) {
            arr[idx++] = x;
        }
    }
}

// General-purpose bucket sort for integers in a known range
public static void bucketSortIntegers(int[] arr, int minVal, int maxVal) {
    int n = arr.length;
    int bucketCount = (int) Math.sqrt(n) + 1;
    double range = (double) (maxVal - minVal + 1) / bucketCount;

    @SuppressWarnings("unchecked")
    List<Integer>[] buckets = new ArrayList[bucketCount];
    for (int i = 0; i < bucketCount; i++) {
        buckets[i] = new ArrayList<>();
    }

    for (int x : arr) {
        int bucketIdx = (int) ((x - minVal) / range);
        if (bucketIdx == bucketCount) bucketIdx = bucketCount - 1;
        buckets[bucketIdx].add(x);
    }

    int idx = 0;
    for (List<Integer> bucket : buckets) {
        Collections.sort(bucket);
        for (int x : bucket) {
            arr[idx++] = x;
        }
    }
}
```

| Property | Value |
|----------|-------|
| Time (best) | $O(n + k)$ -- uniform distribution, $k$ = number of buckets |
| Time (average) | $O(n + k)$ -- when data is uniformly distributed |
| Time (worst) | $O(n^2)$ -- all elements in one bucket, sorted with insertion sort |
| Space | $O(n + k)$ |
| Stable | Yes (if the sort within each bucket is stable) |
| In-place | No |

**Verdict:** Bucket sort achieves linear time when the input is uniformly distributed and the number of buckets is proportional to $n$. It is used for sorting floating-point numbers, distributing work in parallel sorting algorithms, and as a building block for radix sort. Not suitable when the distribution is highly skewed (all elements land in a few buckets).

---

## Sorting Algorithm Comparison

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes |
| Selection Sort | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | No |
| Insertion Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes |
| Shell Sort | $O(n \log n)$ | $O(n^{3/2})$ | $O(n^{3/2})$* | $O(1)$ | No |
| Merge Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes |
| Quicksort | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | No |
| Heapsort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | No |
| Tree Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$** | $O(n)$ | No |
| Timsort | $O(n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes |
| Counting Sort | $O(n+k)$ | $O(n+k)$ | $O(n+k)$ | $O(n+k)$ | Yes |
| Radix Sort | $O(dn)$ | $O(dn)$ | $O(dn)$ | $O(n+b)$ | Yes |
| Bucket Sort | $O(n+k)$ | $O(n+k)$ | $O(n^2)$ | $O(n+k)$ | Yes |

\* Knuth gap sequence; $O(n \log^2 n)$ with Pratt gap sequence.
\*\* $O(n \log n)$ worst case with a self-balancing BST (AVL, Red-Black).

### Java's Built-In Sorting

- `Arrays.sort(int[])`: Dual-pivot quicksort (unstable), $O(n \log n)$ average.
- `Arrays.sort(Object[])`: Timsort (stable, hybrid merge sort + insertion sort), $O(n \log n)$.
- `Collections.sort(List)`: Also Timsort.

---

## Searching Algorithms

### Linear Search

```java
// O(n) time, O(1) space
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
```

Simple but slow. Use when data is unsorted and small, or when a single search doesn't justify sorting.

---

### Binary Search

**Prerequisite:** Array must be sorted.

**Idea:** Compare the target to the middle element. Eliminate half the search space each step.

```java
// O(log n) time, O(1) space
public static int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2; // prevents overflow
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return -1; // not found
}
```

### Binary Search Variants

**Find first occurrence (leftmost):**

```java
public static int firstOccurrence(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1, result = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) {
            result = mid;
            hi = mid - 1; // keep searching left
        } else if (arr[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return result;
}
```

**Find last occurrence (rightmost):**

```java
public static int lastOccurrence(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1, result = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) {
            result = mid;
            lo = mid + 1; // keep searching right
        } else if (arr[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return result;
}
```

**Find insertion point (lower bound):**

```java
// Returns the index of the first element >= target
public static int lowerBound(int[] arr, int target) {
    int lo = 0, hi = arr.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
}
```

**Binary search on answer (search over a monotonic function):**

```java
// Find the minimum x such that f(x) is true
// Assumes f is monotonic: false, false, ..., false, true, true, ..., true
public static int binarySearchOnAnswer(int lo, int hi) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (feasible(mid)) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return lo;
}
```

This pattern applies to problems like "find the minimum capacity to ship packages within D days" or "find the smallest value of k such that...".

| Property | Value |
|----------|-------|
| Time | $O(\log n)$ |
| Space | $O(1)$ iterative, $O(\log n)$ recursive |
| Prerequisite | Sorted array (or monotonic predicate) |

---

### Interpolation Search

**Idea:** Instead of always checking the middle, estimate the position using linear interpolation based on the target's value relative to the endpoints.

```java
public static int interpolationSearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;

    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        if (lo == hi) {
            if (arr[lo] == target) return lo;
            return -1;
        }

        // Estimate position
        int pos = lo + (int)(((long)(target - arr[lo]) * (hi - lo))
                             / (arr[hi] - arr[lo]));

        if (arr[pos] == target) {
            return pos;
        } else if (arr[pos] < target) {
            lo = pos + 1;
        } else {
            hi = pos - 1;
        }
    }
    return -1;
}
```

| Property | Value |
|----------|-------|
| Time (best) | $O(1)$ |
| Time (average) | $O(\log \log n)$ -- for uniformly distributed data |
| Time (worst) | $O(n)$ -- for non-uniform distribution |
| Space | $O(1)$ |

**Verdict:** Faster than binary search for uniformly distributed data but degrades badly otherwise. In practice, binary search is preferred for its reliability.

---

## Practical Considerations

### Stability

A sort is **stable** if elements with equal keys retain their original relative order. This matters when sorting by multiple criteria:

```java
// Sort students by grade (primary) then by name (secondary)
// If we sort by name first, then stable-sort by grade,
// students with the same grade remain sorted by name.
```

### Adaptive Sorting

An **adaptive** sort runs faster on nearly sorted data. Insertion sort is adaptive ($O(n)$ for nearly sorted). Timsort exploits existing "runs" of sorted data.

### Choosing a Sort

1. **Small arrays ($n < 50$):** Insertion sort (low overhead, cache-friendly).
2. **General purpose:** Use Java's built-in `Arrays.sort()` (Timsort for objects, dual-pivot quicksort for primitives).
3. **Need stability:** Merge sort or Timsort.
4. **Memory constrained:** Quicksort (in-place) or heapsort ($O(1)$ extra space, $O(n \log n)$ guaranteed).
5. **Integer keys in known range:** Counting sort or radix sort.
6. **Linked list:** Merge sort (no random access needed).

---

## Complete Example: Sorting Benchmarks

```java
import java.util.*;

public class SortBenchmark {
    public static void main(String[] args) {
        int n = 100_000;
        int[] original = new Random(42).ints(n, 0, 1_000_000).toArray();

        // Benchmark insertion sort
        int[] copy1 = original.clone();
        long start = System.nanoTime();
        insertionSort(copy1);
        long elapsed = System.nanoTime() - start;
        System.out.printf("Insertion Sort: %d ms%n", elapsed / 1_000_000);

        // Benchmark merge sort
        int[] copy2 = original.clone();
        start = System.nanoTime();
        mergeSort(copy2, 0, copy2.length - 1);
        elapsed = System.nanoTime() - start;
        System.out.printf("Merge Sort:     %d ms%n", elapsed / 1_000_000);

        // Benchmark quicksort
        int[] copy3 = original.clone();
        start = System.nanoTime();
        quickSort(copy3, 0, copy3.length - 1);
        elapsed = System.nanoTime() - start;
        System.out.printf("Quick Sort:     %d ms%n", elapsed / 1_000_000);

        // Benchmark Arrays.sort
        int[] copy4 = original.clone();
        start = System.nanoTime();
        Arrays.sort(copy4);
        elapsed = System.nanoTime() - start;
        System.out.printf("Arrays.sort:    %d ms%n", elapsed / 1_000_000);

        // Verify all produce same result
        System.out.println("All equal: " +
            Arrays.equals(copy1, copy2) &&
            Arrays.equals(copy2, copy3) &&
            Arrays.equals(copy3, copy4));
    }

    // insertionSort, mergeSort, quickSort methods as defined above...
}
```

---

## Quiz

**Q1.** What is the theoretical lower bound for comparison-based sorting, and why?

**A1.** $\Omega(n \log n)$. Any comparison-based sort can be modeled as a decision tree. With $n!$ possible orderings, the tree must have at least $n!$ leaves, so its height is at least $\log_2(n!) = \Omega(n \log n)$ (by Stirling's approximation).

---

**Q2.** Is quicksort stable? Is merge sort stable? Explain why each answer is what it is.

**A2.** Quicksort is not stable because the partition step can swap elements with equal keys past each other. Merge sort is stable because during the merge step, when two elements are equal, the element from the left subarray is placed first, preserving the original order.

---

**Q3.** You have an array of 10 million 32-bit integers. Which sorting algorithm would you use, and why?

**A3.** Radix sort with base 256 (processing 8 bits at a time). It would make 4 passes over the data, each pass being $O(n)$, for a total of $O(4n) = O(n)$. Alternatively, Java's `Arrays.sort()` (dual-pivot quicksort) would be efficient at $O(n \log n)$ with excellent cache performance.

---

**Q4.** Write the recurrence relation for merge sort and solve it.

**A4.** $T(n) = 2T(n/2) + O(n)$, with $T(1) = O(1)$. By the Master Theorem (case 2, where $a=2$, $b=2$, $d=1$, and $d = \log_b a$), $T(n) = O(n \log n)$.

---

**Q5.** What is the key difference between binary search and interpolation search? When does interpolation search outperform binary search?

**A5.** Binary search always probes the middle element, while interpolation search estimates the position based on the target's value relative to the endpoints (linear interpolation). Interpolation search achieves $O(\log \log n)$ average time when data is uniformly distributed, but degrades to $O(n)$ for skewed distributions. Binary search is always $O(\log n)$ regardless of distribution.

---

**Q6.** What is the output of `lowerBound(new int[]{1, 3, 3, 3, 5, 7}, 3)`?

**A6.** `1`. The `lowerBound` function returns the index of the first element $\geq$ the target. The first `3` is at index 1.

---

**Q7.** You need to sort a list of `Person` objects first by last name, then by first name (for ties). You only have access to a comparison-based sort. How do you do it?

**A7.** Two approaches: (1) Use a single comparator that compares last name first, then first name:
```java
people.sort(Comparator.comparing(Person::getLastName)
                       .thenComparing(Person::getFirstName));
```
(2) Sort by first name first, then stable-sort by last name. Since Timsort (used by `Collections.sort`) is stable, the first-name order is preserved within equal last names.

---

**Q8.** Why is insertion sort used as the base case in many hybrid sorting algorithms (like Timsort)?

**A8.** For small subarrays (typically $n < 32$--$64$), insertion sort outperforms merge sort and quicksort due to lower constant factors: no recursive call overhead, minimal bookkeeping, excellent cache locality (accesses adjacent memory), and it is adaptive (very fast on nearly-sorted data, which is common in subarrays during a divide-and-conquer sort).

---

**Q9.** How does Timsort achieve $O(n)$ best-case time on already-sorted data, when the comparison-sort lower bound is $O(n \log n)$?

**A9.** The $O(n \log n)$ lower bound applies to worst-case behavior. For already-sorted data, Timsort detects a single natural run of length $n$ in one scan ($O(n)$ comparisons). Since there is only one run, no merging is needed. This does not violate the lower bound because the lower bound is about the worst case over all inputs, not a specific favorable input.

---

**Q10.** What is the key difference between bucket sort and counting sort? When would you prefer one over the other?

**A10.** Counting sort works with discrete integer keys in a known range $[0, k]$ and uses an array of size $k+1$ to count occurrences. Bucket sort works with any comparable data (including floating-point numbers) and distributes elements into ranges ("buckets"), sorting each bucket separately. Prefer counting sort for small-range integers (e.g., ages 0--150, ASCII characters). Prefer bucket sort for floating-point data or when the range is large but data is uniformly distributed.

---

**Q11.** Shell Sort uses a gap sequence that shrinks to 1. Why is the final gap-1 pass (which is just insertion sort) efficient, even though insertion sort is $O(n^2)$?

**A11.** The earlier passes with larger gaps partially sort the array. By the time the gap shrinks to 1, the array is nearly sorted. Insertion sort is adaptive -- on nearly-sorted data, elements only need to move a short distance, so each insertion is close to $O(1)$. The total work for the final pass is $O(n)$ or close to it, because the larger-gap passes already established approximate order.

---

**Q12.** You are sorting 10 million records where each record has a floating-point "score" uniformly distributed in $[0, 1)$. What sorting algorithm would you use and why?

**A12.** Bucket sort with $n$ or $\sqrt{n}$ buckets. Since the data is uniformly distributed, elements will be evenly distributed across buckets, giving approximately constant elements per bucket. Sorting each bucket (with insertion sort or Timsort) takes $O(1)$ per bucket on average. Total: $O(n)$. This beats comparison-based sorts which require $O(n \log n)$.

---

## Comprehensive Sorting Complexity Cheat Sheet

The table below provides a complete reference for all sorting algorithms covered in this module, including time complexities for all cases, space complexity, and key properties.

### Comparison-Based Sorts

| Algorithm | Best | Average | Worst | Space | Stable | In-Place | Adaptive | Method |
|-----------|------|---------|-------|-------|--------|----------|----------|--------|
| Bubble Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Yes | Yes | Exchanging |
| Selection Sort | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | No | Yes | No | Selection |
| Insertion Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Yes | Yes | Insertion |
| Shell Sort | $O(n \log n)$ | $O(n^{3/2})$ | $O(n^{3/2})$ | $O(1)$ | No | Yes | Yes | Insertion |
| Merge Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes | No | No | Merging |
| Quicksort | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | No | Yes | No | Partitioning |
| Heapsort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | No | Yes | No | Selection |
| Tree Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$* | $O(n)$ | No | No | No | Insertion |
| Timsort | $O(n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes | No | Yes | Hybrid |

\* $O(n \log n)$ worst case with a self-balancing BST.

### Non-Comparison Sorts

| Algorithm | Best | Average | Worst | Space | Stable | When to Use |
|-----------|------|---------|-------|-------|--------|-------------|
| Counting Sort | $O(n + k)$ | $O(n + k)$ | $O(n + k)$ | $O(n + k)$ | Yes | Integer keys, small range $k$ |
| Radix Sort | $O(dn)$ | $O(dn)$ | $O(dn)$ | $O(n + b)$ | Yes | Fixed-width integers/strings |
| Bucket Sort | $O(n + k)$ | $O(n + k)$ | $O(n^2)$ | $O(n + k)$ | Yes | Uniform distribution |

$k$ = range of values (counting/bucket), $d$ = number of digits, $b$ = base (radix).

### When to Use Which Sort

| Scenario | Recommended Algorithm | Why |
|----------|----------------------|-----|
| Small array ($n < 50$) | Insertion Sort | Lowest overhead, cache-friendly |
| General purpose (objects) | Timsort (`Arrays.sort(Object[])`) | Stable, adaptive, $O(n \log n)$ |
| General purpose (primitives) | Dual-pivot Quicksort (`Arrays.sort(int[])`) | Fast in practice, in-place |
| Need guaranteed $O(n \log n)$ | Merge Sort or Heapsort | No quadratic worst case |
| Memory constrained | Heapsort | $O(1)$ extra space, $O(n \log n)$ |
| Nearly sorted data | Timsort or Insertion Sort | Both are adaptive |
| Integer keys, small range | Counting Sort | $O(n + k)$ time |
| Fixed-width integers | Radix Sort | $O(dn)$ effectively linear |
| Uniformly distributed floats | Bucket Sort | $O(n)$ expected |
| Linked list | Merge Sort | No random access needed |
| Need stable sort | Merge Sort, Timsort, Counting Sort | Preserve relative order |
| Parallel sorting | Merge Sort (parallel variant) | Natural divide-and-conquer |
