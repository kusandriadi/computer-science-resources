---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 10: Advanced Topics

**Why this matters:** These advanced techniques -- bit manipulation, sliding window, monotonic stacks, Union-Find, segment trees -- fill the gaps left by foundational modules and separate good programmers from excellent ones.

---

# Real-World Motivation

- **Feature flags** use bitmasks to toggle features efficiently
- **Network monitoring** uses sliding windows for throughput analysis
- **Social network merges** use Union-Find for account deduplication
- **Database range queries** use segment trees for fast aggregation

Each technique solves an entire class of problems.

---

# Bit Manipulation: Essentials

```java
// Power of 2?
boolean isPow2 = (n > 0) && (n & (n-1)) == 0;
// Lowest set bit
int lowest = n & (-n);
// Clear lowest set bit
n = n & (n - 1);
// Count set bits
int count = Integer.bitCount(n);
// Check/set/clear/toggle bit i
boolean isSet = (n & (1 << i)) != 0;
n |= (1 << i);   // set
n &= ~(1 << i);  // clear
n ^= (1 << i);   // toggle
```

---

# Bit Trick: Single Number

Every element appears twice except one. Find it.

```java
int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums)
        result ^= num;  // XOR cancels pairs
    return result;
}
```

**Time:** O(n) | **Space:** O(1)

XOR properties: a ^ a = 0, a ^ 0 = a, commutative + associative.

---

# Sliding Window: Fixed Size

```java
// Max sum subarray of size k
int windowSum = 0;
for (int i = 0; i < k; i++) windowSum += arr[i];
int maxSum = windowSum;
for (int i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // slide
    maxSum = Math.max(maxSum, windowSum);
}
```

**Time:** O(n) | **Space:** O(1)

---

# Sliding Window: Variable Size

```java
// Min length subarray with sum >= target
int left = 0, sum = 0, minLen = INF;
for (int right = 0; right < n; right++) {
    sum += nums[right];
    while (sum >= target) {
        minLen = min(minLen, right - left + 1);
        sum -= nums[left++];
    }
}
```

**Time:** O(n) -- each element added/removed at most once.

Also: longest substring without repeating chars, minimum window substring.

---

# Two Pointers Technique

```java
// Two sum on sorted array
int left = 0, right = n - 1;
while (left < right) {
    int sum = arr[left] + arr[right];
    if (sum == target) return new int[]{left, right};
    if (sum < target) left++;
    else right--;
}
```

**Time:** O(n) | **Space:** O(1)

Also: Three Sum O(n^2), Container With Most Water O(n).

---

# Monotonic Stack: Next Greater Element

```java
int[] nextGreater(int[] arr) {
    int[] result = new int[arr.length];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < arr.length; i++) {
        while (!stack.isEmpty() && arr[stack.peek()] < arr[i])
            result[stack.pop()] = arr[i];
        stack.push(i);
    }
    return result;
}
```

**Time:** O(n) -- each element pushed/popped at most once.

Also: Largest rectangle in histogram, stock span.

---

# Sliding Window Maximum (Monotonic Deque)

```java
Deque<Integer> deque = new ArrayDeque<>();
for (int i = 0; i < n; i++) {
    while (!deque.isEmpty() && deque.peekFirst() <= i-k)
        deque.pollFirst();         // remove out of window
    while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i])
        deque.pollLast();          // remove smaller
    deque.offerLast(i);
    if (i >= k-1)
        result[i-k+1] = nums[deque.peekFirst()];
}
```

**Time:** O(n) | **Space:** O(k)

---

# Union-Find (Disjoint Set Union)

```java
int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]); // path compression
    return parent[x];
}
boolean union(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx == ry) return false;
    if (rank[rx] < rank[ry]) parent[rx] = ry;
    else if (rank[rx] > rank[ry]) parent[ry] = rx;
    else { parent[ry] = rx; rank[rx]++; }
    return true;
}
```

**Amortized O(alpha(n))** per operation -- effectively O(1).

---

# Segment Tree: Range Queries + Point Updates

```java
// Build: O(n), Query: O(log n), Update: O(log n)
int query(int node, int lo, int hi, int l, int r) {
    if (r < lo || hi < l) return 0;       // out of range
    if (l <= lo && hi <= r) return tree[node]; // fully in
    int mid = (lo + hi) / 2;
    return query(2*node, lo, mid, l, r)
         + query(2*node+1, mid+1, hi, l, r);
}
```

**Lazy propagation** enables O(log n) **range updates** too.

**Space:** O(4n)

---

# Fenwick Tree (Binary Indexed Tree)

Simpler alternative for prefix sums + point updates.

```java
void update(int i, int val) {
    for (; i <= n; i += i & (-i)) bit[i] += val;
}
int prefixSum(int i) {
    int sum = 0;
    for (; i > 0; i -= i & (-i)) sum += bit[i];
    return sum;
}
```

**Time:** O(log n) per operation | **Space:** O(n+1)

Key insight: `i & (-i)` = lowest set bit of i.

---

# Fenwick vs Segment Tree

| Feature | Fenwick | Segment Tree |
|---------|---------|--------------|
| Implementation | Very simple | More complex |
| Space | n + 1 | 4n |
| Point update | O(log n) | O(log n) |
| Prefix query | O(log n) | O(log n) |
| Range update | Needs modification | Lazy propagation |
| Min/Max queries | **Not directly** | **Yes** |

Use Fenwick for prefix sums. Use segment tree for complex operations.

---

# Fibonacci Heap (Theoretical)

| Operation | Fibonacci Heap | Binary Heap |
|-----------|---------------|-------------|
| Insert | **O(1)** | O(log n) |
| Find-min | O(1) | O(1) |
| Extract-min | O(log n) | O(log n) |
| **Decrease-key** | **O(1)** | O(log n) |
| Merge | **O(1)** | O(n) |

O(1) decrease-key improves Dijkstra from O((V+E) log V) to **O(V log V + E)**.

Rarely used in practice (large constants), but theoretically important.

---

# Quiz

1. **What does `n & (n-1)` compute?**
2. **Why is the sliding window "min subarray with sum >= target" O(n)?**
3. **Amortized time of Union-Find with path compression + union by rank?**
4. **When use Fenwick tree vs segment tree?**

---

# Quiz Answers

1. **Clears the lowest set bit.** If result is 0, n is a power of 2.

2. Each element is added (right pointer) at most once and removed (left pointer) at most once. Inner while loop total increments of left <= n. Total: O(n).

3. **O(alpha(n))** where alpha is inverse Ackermann -- effectively O(1) for all practical inputs (alpha(n) <= 4 for n <= 10^80).

4. **Fenwick:** Only need prefix sums + point updates. Simpler, less memory. **Segment tree:** Need range updates, range min/max, or complex operations.
