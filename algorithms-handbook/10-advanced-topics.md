# Module 10: Advanced Topics

## Introduction

This module covers a collection of advanced algorithmic techniques and data structures that appear frequently in competitive programming and technical interviews. Each topic is a powerful tool in its own right, and together they fill the gaps left by the foundational modules. Mastering these techniques often separates good programmers from excellent ones.

---

## Bit Manipulation Tricks

### Foundations

Integers are stored as sequences of bits. Java uses 32-bit `int` and 64-bit `long`. The bit operators are:

| Operator | Symbol | Example |
|----------|--------|---------|
| AND | `&` | `5 & 3 = 1` (101 & 011 = 001) |
| OR | `\|` | `5 \| 3 = 7` (101 \| 011 = 111) |
| XOR | `^` | `5 ^ 3 = 6` (101 ^ 011 = 110) |
| NOT | `~` | `~5 = -6` (inverts all bits) |
| Left shift | `<<` | `5 << 1 = 10` (1010) |
| Right shift | `>>` | `5 >> 1 = 2` (10) |
| Unsigned right shift | `>>>` | Same as `>>` for positive numbers |

### Essential Tricks

```java
// Check if n is a power of 2
boolean isPowerOfTwo = (n > 0) && (n & (n - 1)) == 0;

// Get the lowest set bit
int lowestBit = n & (-n);

// Clear the lowest set bit
n = n & (n - 1);

// Count set bits (population count)
int bitCount = Integer.bitCount(n); // built-in

// Manual popcount
public static int popcount(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1); // clear lowest set bit
        count++;
    }
    return count;
}

// Check if bit i is set
boolean isSet = (n & (1 << i)) != 0;

// Set bit i
n |= (1 << i);

// Clear bit i
n &= ~(1 << i);

// Toggle bit i
n ^= (1 << i);

// Get all subsets of a bitmask
public static void subsets(int mask) {
    for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
        System.out.println(Integer.toBinaryString(sub));
    }
    // Don't forget the empty subset (0)
}

// Swap without temporary variable
a ^= b;
b ^= a;
a ^= b;
```

### Practical Example: Single Number

Find the element that appears exactly once when all others appear twice:

```java
public static int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num; // XOR cancels pairs
    }
    return result;
}
```

**Time:** $O(n)$. **Space:** $O(1)$.

### Bitmask DP Revisited

Represent subsets of $n$ elements (where $n \leq 20$) as integers from $0$ to $2^n - 1$:

```java
// Count minimum number of groups to cover all elements
// where each group must be a valid subset
public static int minGroups(int n, boolean[] validSubset) {
    int total = 1 << n;
    int[] dp = new int[total];
    Arrays.fill(dp, n + 1);
    dp[0] = 0;

    for (int mask = 1; mask < total; mask++) {
        // Enumerate all submasks of mask
        for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
            if (validSubset[sub]) {
                dp[mask] = Math.min(dp[mask], dp[mask ^ sub] + 1);
            }
        }
    }
    return dp[total - 1];
}
```

---

## Sliding Window Technique

The sliding window maintains a window (subarray/substring) that expands or contracts as it moves through the array, avoiding redundant computation.

### Fixed-Size Window

```java
// Maximum sum subarray of size k
public static int maxSumWindow(int[] arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];

    int maxSum = windowSum;
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k]; // slide: add right, remove left
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
```

**Time:** $O(n)$. **Space:** $O(1)$.

### Variable-Size Window (Two Pointers)

```java
// Minimum length subarray with sum >= target
public static int minSubarrayLen(int target, int[] nums) {
    int left = 0, sum = 0, minLen = Integer.MAX_VALUE;

    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];

        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}
```

**Time:** $O(n)$ -- each element is added and removed at most once.

### Longest Substring Without Repeating Characters

```java
public static int longestUniqueSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int maxLen = 0, left = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
            left = lastSeen.get(c) + 1;
        }
        lastSeen.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

### Minimum Window Substring

Find the smallest substring of $s$ containing all characters of $t$:

```java
public static String minWindow(String s, String t) {
    if (s.isEmpty() || t.isEmpty()) return "";

    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);

    int required = need.size(); // unique chars needed
    int formed = 0;
    Map<Character, Integer> window = new HashMap<>();

    int left = 0, minLen = Integer.MAX_VALUE, minStart = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        window.merge(c, 1, Integer::sum);
        if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) {
            formed++;
        }

        while (formed == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            char leftChar = s.charAt(left);
            window.merge(leftChar, -1, Integer::sum);
            if (need.containsKey(leftChar)
                    && window.get(leftChar) < need.get(leftChar)) {
                formed--;
            }
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
}
```

**Time:** $O(|s| + |t|)$. **Space:** $O(|\Sigma|)$ where $\Sigma$ is the character set.

---

## Two Pointers Technique

Two pointers move through a sorted array (or from both ends) to efficiently find pairs or subarrays.

### Two Sum (Sorted Array)

```java
public static int[] twoSumSorted(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}
```

**Time:** $O(n)$. **Space:** $O(1)$.

### Three Sum

```java
public static List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();

    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue; // skip duplicates
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}
```

**Time:** $O(n^2)$. **Space:** $O(1)$ extra.

### Container With Most Water

```java
public static int maxArea(int[] height) {
    int left = 0, right = height.length - 1, maxArea = 0;
    while (left < right) {
        int area = Math.min(height[left], height[right]) * (right - left);
        maxArea = Math.max(maxArea, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxArea;
}
```

---

## Monotonic Stack / Queue

### Monotonic Stack

A stack that maintains elements in sorted order (either increasing or decreasing). Used to find the next greater/smaller element efficiently.

### Next Greater Element

```java
public static int[] nextGreaterElement(int[] arr) {
    int n = arr.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && arr[stack.peek()] < arr[i]) {
            result[stack.pop()] = arr[i];
        }
        stack.push(i);
    }
    return result;
}
```

**Time:** $O(n)$ -- each element is pushed and popped at most once.

### Largest Rectangle in Histogram

```java
public static int largestRectangleArea(int[] heights) {
    Deque<Integer> stack = new ArrayDeque<>();
    int maxArea = 0;
    int n = heights.length;

    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        while (!stack.isEmpty() && heights[stack.peek()] > h) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    return maxArea;
}
```

**Time:** $O(n)$. **Space:** $O(n)$.

### Monotonic Deque: Sliding Window Maximum

```java
public static int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> deque = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        // Remove elements outside the window
        while (!deque.isEmpty() && deque.peekFirst() <= i - k) {
            deque.pollFirst();
        }
        // Remove smaller elements (they can never be the max)
        while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
            deque.pollLast();
        }
        deque.offerLast(i);

        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.peekFirst()];
        }
    }
    return result;
}
```

**Time:** $O(n)$. **Space:** $O(k)$.

---

## Union-Find (Disjoint Set Union)

Union-Find maintains a collection of disjoint sets and supports two operations: `find` (which set does an element belong to?) and `union` (merge two sets).

### Optimized Implementation

```java
public class UnionFind {
    private int[] parent;
    private int[] rank;
    private int components;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        components = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    // Path compression: O(alpha(n)) amortized
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // path compression
        }
        return parent[x];
    }

    // Union by rank: O(alpha(n)) amortized
    public boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false; // already in same set

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        components--;
        return true;
    }

    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }

    public int components() { return components; }
}
```

With both path compression and union by rank, operations run in $O(\alpha(n))$ amortized time, where $\alpha$ is the inverse Ackermann function -- effectively $O(1)$ for all practical purposes.

**Applications:** Kruskal's MST, connected components, cycle detection in undirected graphs, percolation problems, accounts merging.

### Example: Number of Connected Components

```java
public static int countComponents(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] edge : edges) {
        uf.union(edge[0], edge[1]);
    }
    return uf.components();
}
```

---

## Segment Trees

A segment tree supports range queries and point/range updates in $O(\log n)$ time.

### Implementation (Range Sum Query with Point Updates)

```java
public class SegmentTree {
    private int[] tree;
    private int n;

    public SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        build(arr, 1, 0, n - 1);
    }

    private void build(int[] arr, int node, int lo, int hi) {
        if (lo == hi) {
            tree[node] = arr[lo];
            return;
        }
        int mid = (lo + hi) / 2;
        build(arr, 2 * node, lo, mid);
        build(arr, 2 * node + 1, mid + 1, hi);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    // Update arr[idx] = val
    public void update(int idx, int val) {
        update(1, 0, n - 1, idx, val);
    }

    private void update(int node, int lo, int hi, int idx, int val) {
        if (lo == hi) {
            tree[node] = val;
            return;
        }
        int mid = (lo + hi) / 2;
        if (idx <= mid) update(2 * node, lo, mid, idx, val);
        else update(2 * node + 1, mid + 1, hi, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    // Query sum of arr[l..r]
    public int query(int l, int r) {
        return query(1, 0, n - 1, l, r);
    }

    private int query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0; // out of range
        if (l <= lo && hi <= r) return tree[node]; // fully in range
        int mid = (lo + hi) / 2;
        return query(2 * node, lo, mid, l, r)
             + query(2 * node + 1, mid + 1, hi, l, r);
    }
}
```

**Time:** $O(n)$ build, $O(\log n)$ query, $O(\log n)$ update.
**Space:** $O(n)$.

### Lazy Propagation (Range Updates)

For range updates (e.g., add $val$ to all elements in $[l, r]$), lazy propagation defers updates to children until needed:

```java
public class LazySegTree {
    private long[] tree, lazy;
    private int n;

    public LazySegTree(int[] arr) {
        n = arr.length;
        tree = new long[4 * n];
        lazy = new long[4 * n];
        build(arr, 1, 0, n - 1);
    }

    private void build(int[] arr, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = arr[lo]; return; }
        int mid = (lo + hi) / 2;
        build(arr, 2 * node, lo, mid);
        build(arr, 2 * node + 1, mid + 1, hi);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    private void pushDown(int node, int lo, int hi) {
        if (lazy[node] != 0) {
            int mid = (lo + hi) / 2;
            apply(2 * node, lo, mid, lazy[node]);
            apply(2 * node + 1, mid + 1, hi, lazy[node]);
            lazy[node] = 0;
        }
    }

    private void apply(int node, int lo, int hi, long val) {
        tree[node] += val * (hi - lo + 1);
        lazy[node] += val;
    }

    // Add val to all elements in [l, r]
    public void rangeUpdate(int l, int r, long val) {
        rangeUpdate(1, 0, n - 1, l, r, val);
    }

    private void rangeUpdate(int node, int lo, int hi, int l, int r, long val) {
        if (r < lo || hi < l) return;
        if (l <= lo && hi <= r) { apply(node, lo, hi, val); return; }
        pushDown(node, lo, hi);
        int mid = (lo + hi) / 2;
        rangeUpdate(2 * node, lo, mid, l, r, val);
        rangeUpdate(2 * node + 1, mid + 1, hi, l, r, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public long query(int l, int r) {
        return query(1, 0, n - 1, l, r);
    }

    private long query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return tree[node];
        pushDown(node, lo, hi);
        int mid = (lo + hi) / 2;
        return query(2 * node, lo, mid, l, r)
             + query(2 * node + 1, mid + 1, hi, l, r);
    }
}
```

---

## Binary Indexed Tree (Fenwick Tree)

A Fenwick tree supports prefix sum queries and point updates in $O(\log n)$ with a simpler implementation than segment trees.

```java
public class FenwickTree {
    private int[] bit;
    private int n;

    public FenwickTree(int n) {
        this.n = n;
        bit = new int[n + 1]; // 1-indexed
    }

    // Build from array in O(n)
    public FenwickTree(int[] arr) {
        this(arr.length);
        for (int i = 0; i < arr.length; i++) {
            update(i + 1, arr[i]);
        }
    }

    // Add val to position i (1-indexed)
    public void update(int i, int val) {
        for (; i <= n; i += i & (-i)) {
            bit[i] += val;
        }
    }

    // Prefix sum [1, i]
    public int prefixSum(int i) {
        int sum = 0;
        for (; i > 0; i -= i & (-i)) {
            sum += bit[i];
        }
        return sum;
    }

    // Range sum [l, r] (1-indexed)
    public int rangeSum(int l, int r) {
        return prefixSum(r) - prefixSum(l - 1);
    }
}
```

**Time:** $O(\log n)$ per operation. **Space:** $O(n)$.

**Key insight:** `i & (-i)` gives the lowest set bit of $i$, which determines the range of indices each tree node is responsible for.

### Fenwick vs. Segment Tree

| Feature | Fenwick Tree | Segment Tree |
|---------|-------------|--------------|
| Implementation | Very simple | More complex |
| Space | $n + 1$ | $4n$ |
| Point update | $O(\log n)$ | $O(\log n)$ |
| Prefix query | $O(\log n)$ | $O(\log n)$ |
| Range update | Needs modification | Lazy propagation |
| Range query (arbitrary) | Via prefix difference | Native |
| Min/Max queries | Not directly | Yes |

Use Fenwick trees when you only need prefix sums and point updates. Use segment trees when you need range updates, range min/max, or more complex operations.

---

## Fibonacci Heap

A **Fibonacci heap** is a collection of heap-ordered trees with remarkably efficient amortized costs. It was designed specifically to speed up graph algorithms that perform many decrease-key operations.

### Structure

- A collection of min-heap-ordered trees (each node's key $\leq$ its children's keys).
- A pointer to the minimum node.
- Trees are not necessarily binomial -- their shapes are maintained lazily, which is the source of the amortized efficiency.

### Amortized Complexities

| Operation | Fibonacci Heap | Binary Heap |
|-----------|---------------|-------------|
| Insert | $O(1)$ | $O(\log n)$ |
| Find-min | $O(1)$ | $O(1)$ |
| Extract-min | $O(\log n)$ | $O(\log n)$ |
| Decrease-key | $O(1)$ | $O(\log n)$ |
| Merge | $O(1)$ | $O(n)$ |
| Delete | $O(\log n)$ | $O(\log n)$ |

The $O(1)$ amortized decrease-key is the critical advantage. Insert and merge are also $O(1)$ because they simply add trees to the collection without restructuring.

### Why It Matters

The $O(1)$ decrease-key directly improves two important graph algorithms:

- **Dijkstra's algorithm:** From $O((V + E) \log V)$ with a binary heap to $O(V \log V + E)$ with a Fibonacci heap. For dense graphs ($E \approx V^2$), this is a significant improvement.
- **Prim's MST algorithm:** Same improvement from $O((V + E) \log V)$ to $O(V \log V + E)$.

### Java Interface (Key Idea)

A full Fibonacci heap implementation is complex (~200 lines) due to cascading cuts and tree consolidation. The interface captures the essential operations:

```java
public class FibonacciHeap<K extends Comparable<K>> {

    private static class Node<K> {
        K key;
        Node<K> parent, child, left, right;
        int degree;
        boolean marked; // has lost a child since becoming a child itself
    }

    private Node<K> min;
    private int size;

    // O(1): create a new single-node tree and add to root list
    public Node<K> insert(K key) {
        Node<K> node = new Node<>();
        node.key = key;
        node.left = node.right = node; // circular list
        addToRootList(node);
        if (min == null || key.compareTo(min.key) < 0) min = node;
        size++;
        return node; // caller keeps handle for decrease-key
    }

    // O(1): concatenate root lists, update min
    public void merge(FibonacciHeap<K> other) {
        if (other.min == null) return;
        concatenateRootLists(this.min, other.min);
        if (this.min == null || other.min.key.compareTo(this.min.key) < 0) {
            this.min = other.min;
        }
        this.size += other.size;
    }

    // O(log n) amortized: remove min, consolidate trees by degree
    public K extractMin() { /* ... consolidation logic ... */ return null; }

    // O(1) amortized: cut node from parent, cascading cuts if needed
    public void decreaseKey(Node<K> node, K newKey) { /* ... */ }

    private void addToRootList(Node<K> node) { /* ... */ }
    private void concatenateRootLists(Node<K> a, Node<K> b) { /* ... */ }
}
```

The key implementation details omitted above are:
- **Consolidation** (in `extractMin`): merge root-list trees until no two trees have the same degree, similar to binary addition.
- **Cascading cuts** (in `decreaseKey`): if a non-root node loses a second child, cut it from its parent and move it to the root list. This maintains the logarithmic bound on tree sizes.

### Practical Considerations

Fibonacci heaps have large constant factors and complex code, so they rarely outperform binary heaps for small or moderate inputs. They are primarily of theoretical importance -- they prove that Dijkstra and Prim can achieve $O(V \log V + E)$. In practice, binary heaps or pairing heaps are often preferred.

---

## Quiz

**Q1.** What does `n & (n - 1)` compute, and why is it useful?

**A1.** It clears the lowest set bit of $n$. If the result is 0, $n$ is a power of 2 (since powers of 2 have exactly one set bit). It's also used in an efficient popcount: repeatedly apply `n = n & (n-1)` and count iterations until $n = 0$.

---

**Q2.** Explain why the sliding window technique for "minimum length subarray with sum >= target" runs in $O(n)$ despite having a nested loop.

**A2.** Although there is a `while` loop inside the `for` loop, each element is added to the window at most once (when `right` advances) and removed at most once (when `left` advances). The total number of `left` increments across all iterations is at most $n$. So the inner loop executes at most $n$ times total, giving $O(n)$ overall.

---

**Q3.** In the monotonic stack approach for "next greater element," why is the time complexity $O(n)$?

**A3.** Each of the $n$ elements is pushed onto the stack exactly once and popped at most once. The total number of push and pop operations is at most $2n$, so the algorithm runs in $O(n)$.

---

**Q4.** What is the amortized time complexity of `find` and `union` operations in a Union-Find with path compression and union by rank?

**A4.** $O(\alpha(n))$ amortized per operation, where $\alpha$ is the inverse Ackermann function. For all practical input sizes (up to $10^{80}$), $\alpha(n) \leq 4$, so it is effectively $O(1)$.

---

**Q5.** When would you use a Fenwick tree instead of a segment tree?

**A5.** When you only need point updates and prefix sum (or range sum) queries, and don't need range updates or min/max queries. Fenwick trees are simpler to implement, use less memory ($n+1$ vs. $4n$), and have smaller constant factors. For more complex operations (range updates, range min/max), a segment tree is necessary.

---

**Q6.** Solve the following using bit manipulation: Given an array where every element appears exactly three times except one element that appears once, find the single element.

**A6.** Count the number of set bits at each position across all elements modulo 3. The remaining bits form the unique element:
```java
public static int singleNumber(int[] nums) {
    int result = 0;
    for (int bit = 0; bit < 32; bit++) {
        int sum = 0;
        for (int num : nums) {
            sum += (num >> bit) & 1;
        }
        if (sum % 3 != 0) {
            result |= (1 << bit);
        }
    }
    return result;
}
```
Time: $O(32n) = O(n)$. Space: $O(1)$.

---

**Q7.** What is the key idea behind lazy propagation in segment trees?

**A7.** Instead of immediately propagating range updates to all affected leaf nodes ($O(n)$), lazy propagation stores pending updates at internal nodes and only pushes them down to children when those children are actually accessed by a query or update. This ensures both range updates and queries run in $O(\log n)$.

---

**Q8.** Given the array `[2, 1, 5, 6, 2, 3]`, what is the largest rectangle in the histogram?

**A8.** The largest rectangle has area 10, formed by heights 5 and 6 (columns at indices 2 and 3): $\min(5, 6) \times 2 = 10$. The monotonic stack algorithm processes each bar, and when bar 2 (height 2) is encountered after bars 5 and 6, it pops them and calculates the rectangle areas.
