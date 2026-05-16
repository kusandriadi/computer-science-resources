---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 02: Data Structures

**Why this matters:** The choice of data structure often determines whether your algorithm runs in O(n) or O(n^2). Picking the right one is one of the most impactful decisions you make as a programmer.

---

# Real-World Motivation

Imagine a library with no organization -- finding a book means checking every single one.

Now add shelves by subject, an index catalog, and a Dewey Decimal system. **Same books, radically different access time.**

Data structures are the organizational systems for your data.

---

# Arrays and ArrayList

```java
int[] arr = new int[10];     // O(1) access
arr[0] = 42;
ArrayList<Integer> list = new ArrayList<>();
list.add(42);                // amortized O(1)
list.get(0);                 // O(1)
list.remove(0);              // O(n) -- shifts!
```

| Operation | Array | ArrayList |
|-----------|-------|-----------|
| Access by index | O(1) | O(1) |
| Search (unsorted) | O(n) | O(n) |
| Insert at end | N/A | Amortized O(1) |
| Insert at index | N/A | O(n) |

---

# Linked Lists

Each node stores data + pointer to next node.

| Operation | Singly | Doubly |
|-----------|--------|--------|
| Access by index | O(n) | O(n) |
| Insert at head | **O(1)** | **O(1)** |
| Insert at tail | O(n)* | **O(1)** |
| Delete at head | **O(1)** | **O(1)** |
| Search | O(n) | O(n) |

*O(1) with tail pointer

**Use when:** Frequent insert/delete at known positions, no random access needed.

---

# Stacks (LIFO)

**Last-In, First-Out.** Push, pop, peek all O(1).

```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(42);   // O(1)
stack.pop();      // O(1)
stack.peek();     // O(1)
```

**Applications:**
- Parentheses matching
- DFS (iterative)
- Undo/redo
- Monotonic stack (next greater element)

Prefer `ArrayDeque` over legacy `java.util.Stack`.

---

# Queues (FIFO)

**First-In, First-Out.** Enqueue, dequeue, peek all O(1).

```java
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(42);  // O(1)
queue.poll();     // O(1)
queue.peek();     // O(1)
```

**Applications:**
- BFS traversal
- Task scheduling
- Buffer management

**Variants:** Deque (both ends), Priority Queue (covered under Heaps).

---

# Hash Tables

Map keys to values via hash function. O(1) average operations.

```java
Map<String, Integer> map = new HashMap<>();
map.put("hello", 1);        // O(1) avg
map.get("hello");            // O(1) avg
map.containsKey("hello");   // O(1) avg
```

| Operation | Average | Worst |
|-----------|---------|-------|
| Put/Get/Delete | O(1) | O(n)* |

*Java 8+ degrades to O(log n) worst case with tree-based buckets.

**Collision resolution:** Separate chaining or open addressing (linear probing).

---

# Heaps (Priority Queues)

Complete binary tree with heap property: parent <= children (min-heap).

```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap =
    new PriorityQueue<>(Collections.reverseOrder());
minHeap.offer(5);   // O(log n)
minHeap.poll();     // O(log n) -- extract min
minHeap.peek();     // O(1)
```

| Operation | Time |
|-----------|------|
| Insert | O(log n) |
| Extract min/max | O(log n) |
| Peek | O(1) |
| **Build heap** | **O(n)** |

---

# Binary Search Tree (BST)

Left < root < right. All operations O(h) where h = height.

```java
// Insert, search, delete: O(h)
// Balanced: h = O(log n)
// Degenerate: h = O(n) -- linked list!
```

**In-order traversal produces sorted output.**

**Problem:** Unbalanced BSTs degenerate to O(n).
**Solution:** Self-balancing trees (AVL, Red-Black).

---

# Balanced BSTs: AVL vs Red-Black

| Property | AVL Tree | Red-Black Tree |
|----------|----------|----------------|
| Balance | Height diff <= 1 | Color-based rules |
| Height | <= 1.44 log(n+2) | <= 2 log(n+1) |
| Lookup | Faster (stricter balance) | Slightly slower |
| Insert/Delete | More rotations | Fewer rotations |
| Java impl | -- | TreeMap, TreeSet |

**In practice:** Use Java's `TreeMap`/`TreeSet` (Red-Black trees).

---

# Tries (Prefix Trees)

Each node = one character. Paths from root = prefixes. O(m) per operation.

```java
trie.insert("apple");   // O(5)
trie.search("apple");   // O(5) -> true
trie.startsWith("app"); // O(3) -> true
```

**Use for:** Autocomplete, spell checking, IP routing, dictionary storage.

**Space:** Can be high (26 children per node for lowercase). Compressed tries mitigate this.

---

# B-Trees

Multi-key nodes optimized for disk-based storage. Height = O(log_t n).

- A B-Tree with t=512 and 1M keys has height <= 3
- **3 disk reads** to find any key

| Operation | Time | Disk Reads |
|-----------|------|------------|
| Search | O(log n) | O(log_t n) |
| Insert | O(log n) | O(log_t n) |
| Delete | O(log n) | O(log_t n) |

**Used in:** MySQL, PostgreSQL, NTFS, ext4, HFS+

---

# Skip Lists

Probabilistic layered linked lists. O(log n) average search/insert/delete.

- Bottom layer: all elements (sorted linked list)
- Each higher layer: random subset (~half)
- "Express lanes" for faster traversal

**Used in:** Redis sorted sets, LevelDB, Java's `ConcurrentSkipListMap`.

Simpler than balanced BSTs, easier to make lock-free/concurrent.

---

# Graph Representations

| Operation | Adj. List | Adj. Matrix |
|-----------|-----------|-------------|
| Space | O(V + E) | O(V^2) |
| Add edge | O(1) | O(1) |
| Check edge | O(deg(u)) | **O(1)** |
| Iterate neighbors | O(deg(u)) | O(V) |

```java
// Adjacency list -- sparse graphs
List<List<Integer>> adj = new ArrayList<>();
// Adjacency matrix -- dense graphs
boolean[][] matrix = new boolean[V][V];
```

**Rule:** Lists for sparse (E << V^2), matrices for dense.

---

# Choosing the Right Data Structure

| Need | Best Choice | Why |
|------|-------------|-----|
| Fast index access | ArrayList | O(1) random access |
| Fast insert/delete at ends | ArrayDeque | O(1) amortized |
| Fast lookup by key | HashMap | O(1) average |
| Sorted order + lookup | TreeMap | O(log n), sorted iteration |
| Fast min/max retrieval | PriorityQueue | O(1) peek, O(log n) extract |
| Prefix string ops | Trie | O(m) per operation |
| LIFO | Stack (ArrayDeque) | O(1) push/pop |
| FIFO | Queue (ArrayDeque) | O(1) enqueue/dequeue |

---

# Comprehensive Complexity Cheat Sheet

| Structure | Search (Avg) | Insert (Avg) | Delete (Avg) | Space |
|-----------|-------------|-------------|-------------|-------|
| Array/ArrayList | O(n) | O(1)* | O(n) | O(n) |
| LinkedList | O(n) | O(1)** | O(1)** | O(n) |
| HashMap | O(1) | O(1) | O(1) | O(n) |
| TreeMap (RB) | O(log n) | O(log n) | O(log n) | O(n) |
| Binary Heap | O(n) | O(log n) | O(log n) | O(n) |
| Trie | O(m) | O(m) | O(m) | O(n*m) |

*end, **known position

---

# Quiz

1. **What is the time complexity of inserting at position 0 in an ArrayList of size n?**

2. **What is the key difference between a min-heap and a BST?**

3. **When should you use an adjacency matrix instead of an adjacency list?**

4. **Why does building a heap take O(n) not O(n log n)?**

---

# Quiz Answers

1. **O(n)** -- all elements must shift right by one.

2. Heap: parent <= children, no left/right ordering. Efficient min extraction O(log n) but search O(n). BST: left < root < right. Efficient search O(log n) if balanced.

3. Dense graphs (E ~ V^2), O(1) edge checks, algorithms like Floyd-Warshall.

4. Bottom-up heapify: most nodes near bottom sift down ~0 levels. Sum of h/2^h converges to O(n).
