# Module 02: Data Structures

## Introduction

An algorithm without data structures is like an engine without a chassis. Data structures determine how information is organized, accessed, and modified. The choice of data structure often determines the complexity class of your algorithm. A problem that is $O(n^2)$ with an array might become $O(n \log n)$ with a balanced BST or $O(n)$ with a hash table.

This module covers the foundational data structures that every engineer must know: arrays, linked lists, stacks, queues, hash tables, heaps, trees, tries, and graphs. For each, we discuss the operations it supports, their complexities, Java implementations, and when to reach for it.

---

## Arrays

### Concept

An array is a contiguous block of memory storing elements of the same type, accessed by integer index in $O(1)$ time.

### Java Built-In

```java
int[] arr = new int[10];          // fixed-size array
arr[0] = 42;                     // O(1) access
int val = arr[0];                 // O(1) read

// Dynamic array
ArrayList<Integer> list = new ArrayList<>();
list.add(42);                     // amortized O(1)
list.get(0);                      // O(1)
list.remove(0);                   // O(n) -- shifts elements
```

### Complexity Summary

| Operation | Static Array | ArrayList |
|-----------|-------------|-----------|
| Access by index | $O(1)$ | $O(1)$ |
| Search (unsorted) | $O(n)$ | $O(n)$ |
| Insert at end | N/A (fixed) | Amortized $O(1)$ |
| Insert at index | N/A | $O(n)$ |
| Delete at index | N/A | $O(n)$ |

### When to Use

Use arrays when you need fast random access, know the size in advance (or can tolerate amortized resizing), and primarily access/modify elements rather than inserting/deleting in the middle.

---

## Linked Lists

### Concept

A linked list stores elements in nodes, where each node contains data and a reference (pointer) to the next node. In a **doubly linked list**, each node also points to the previous node.

### Java Implementation

```java
public class SinglyLinkedList<T> {
    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data) {
            this.data = data;
        }
    }

    private Node<T> head;
    private int size;

    public SinglyLinkedList() {
        head = null;
        size = 0;
    }

    // O(1) -- insert at head
    public void addFirst(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = head;
        head = newNode;
        size++;
    }

    // O(n) -- insert at tail (no tail pointer)
    public void addLast(T data) {
        Node<T> newNode = new Node<>(data);
        if (head == null) {
            head = newNode;
        } else {
            Node<T> current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
        size++;
    }

    // O(1) -- remove from head
    public T removeFirst() {
        if (head == null) throw new NoSuchElementException();
        T data = head.data;
        head = head.next;
        size--;
        return data;
    }

    // O(n) -- search
    public boolean contains(T data) {
        Node<T> current = head;
        while (current != null) {
            if (Objects.equals(current.data, data)) return true;
            current = current.next;
        }
        return false;
    }

    // O(n) -- access by index
    public T get(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
        Node<T> current = head;
        for (int i = 0; i < index; i++) {
            current = current.next;
        }
        return current.data;
    }

    public int size() { return size; }
}
```

### Complexity Summary

| Operation | Singly Linked | Doubly Linked |
|-----------|--------------|---------------|
| Access by index | $O(n)$ | $O(n)$ |
| Insert at head | $O(1)$ | $O(1)$ |
| Insert at tail | $O(n)$ or $O(1)$* | $O(1)$ |
| Delete at head | $O(1)$ | $O(1)$ |
| Delete given node | $O(n)$ | $O(1)$ |
| Search | $O(n)$ | $O(n)$ |

*$O(1)$ if a tail pointer is maintained.

### When to Use

Use linked lists when you need frequent insertions/deletions at the beginning (or at known positions) and don't need random access. Java's `LinkedList` is a doubly linked list implementing both `List` and `Deque`.

---

## Skip List

### Concept

A **skip list** is a probabilistic data structure that layers multiple sorted linked lists on top of each other to achieve $O(\log n)$ average-case search, insertion, and deletion. It provides the same asymptotic performance as balanced BSTs but is simpler to implement and reason about.

Each element exists in the bottom-level list. With probability $p$ (typically $\frac{1}{2}$), an element is also promoted to the next level. This creates an "express lane" hierarchy: the top levels have few elements (enabling large jumps), and the bottom level has all elements.

### Java Implementation

```java
public class SkipList {
    private static final int MAX_LEVEL = 16;
    private static final double PROBABILITY = 0.5;

    private static class Node {
        int key;
        Node[] forward; // forward[i] = next node at level i

        Node(int key, int level) {
            this.key = key;
            this.forward = new Node[level + 1];
        }
    }

    private final Node header;
    private int level; // current max level in use
    private final Random random = new Random();

    public SkipList() {
        header = new Node(Integer.MIN_VALUE, MAX_LEVEL);
        level = 0;
    }

    private int randomLevel() {
        int lvl = 0;
        while (lvl < MAX_LEVEL && random.nextDouble() < PROBABILITY) {
            lvl++;
        }
        return lvl;
    }

    // O(log n) average
    public boolean search(int key) {
        Node current = header;
        // Start at the highest level and work down
        for (int i = level; i >= 0; i--) {
            while (current.forward[i] != null && current.forward[i].key < key) {
                current = current.forward[i];
            }
        }
        current = current.forward[0];
        return current != null && current.key == key;
    }

    // O(log n) average
    public void insert(int key) {
        Node[] update = new Node[MAX_LEVEL + 1];
        Node current = header;

        // Find position at each level
        for (int i = level; i >= 0; i--) {
            while (current.forward[i] != null && current.forward[i].key < key) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        current = current.forward[0];

        if (current != null && current.key == key) {
            return; // duplicate key
        }

        int newLevel = randomLevel();
        if (newLevel > level) {
            for (int i = level + 1; i <= newLevel; i++) {
                update[i] = header;
            }
            level = newLevel;
        }

        Node newNode = new Node(key, newLevel);
        for (int i = 0; i <= newLevel; i++) {
            newNode.forward[i] = update[i].forward[i];
            update[i].forward[i] = newNode;
        }
    }

    // O(log n) average
    public boolean delete(int key) {
        Node[] update = new Node[MAX_LEVEL + 1];
        Node current = header;

        for (int i = level; i >= 0; i--) {
            while (current.forward[i] != null && current.forward[i].key < key) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        current = current.forward[0];

        if (current == null || current.key != key) {
            return false; // key not found
        }

        for (int i = 0; i <= level; i++) {
            if (update[i].forward[i] != current) break;
            update[i].forward[i] = current.forward[i];
        }

        while (level > 0 && header.forward[level] == null) {
            level--;
        }
        return true;
    }
}
```

### Complexity

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Search | $O(\log n)$ | $O(n)$ |
| Insert | $O(\log n)$ | $O(n)$ |
| Delete | $O(\log n)$ | $O(n)$ |
| Space | $O(n)$ | $O(n \log n)$ |

The worst case occurs with extremely unlikely random level choices (all elements promoted to maximum level). In expectation, space usage is $O(n)$ since each element has an average of $1/(1-p) = 2$ forward pointers (with $p = 0.5$).

### When to Use

Skip lists are used when you need a sorted data structure with $O(\log n)$ operations but want simpler implementation than balanced BSTs. They are used in Redis (sorted sets), LevelDB / RocksDB (in-memory index), and Apache Lucene. They also support efficient concurrent access (lock-free skip lists) and are a good choice when lock-free data structures are needed.

---

## Stacks

### Concept

A **stack** is a Last-In-First-Out (LIFO) data structure supporting `push`, `pop`, and `peek` in $O(1)$.

### Java Implementation

```java
public class ArrayStack<T> {
    private Object[] data;
    private int top;

    public ArrayStack(int capacity) {
        data = new Object[capacity];
        top = -1;
    }

    public void push(T item) {
        if (top == data.length - 1) {
            data = Arrays.copyOf(data, data.length * 2);
        }
        data[++top] = item;
    }

    @SuppressWarnings("unchecked")
    public T pop() {
        if (isEmpty()) throw new EmptyStackException();
        T item = (T) data[top];
        data[top--] = null; // help GC
        return item;
    }

    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) throw new EmptyStackException();
        return (T) data[top];
    }

    public boolean isEmpty() { return top == -1; }
    public int size() { return top + 1; }
}
```

In practice, use `Deque<Integer> stack = new ArrayDeque<>()` (preferred over `java.util.Stack` which is synchronized and legacy).

### Applications

- Expression evaluation and parsing (parentheses matching, postfix evaluation)
- DFS (iterative implementation)
- Undo/redo functionality
- Call stack simulation
- Monotonic stack problems (next greater element)

---

## Queues

### Concept

A **queue** is a First-In-First-Out (FIFO) data structure supporting `enqueue`, `dequeue`, and `peek` in $O(1)$.

### Java Implementation (Circular Array)

```java
public class CircularQueue<T> {
    private Object[] data;
    private int front, rear, size;

    public CircularQueue(int capacity) {
        data = new Object[capacity];
        front = 0;
        rear = -1;
        size = 0;
    }

    public void enqueue(T item) {
        if (size == data.length) {
            resize(data.length * 2);
        }
        rear = (rear + 1) % data.length;
        data[rear] = item;
        size++;
    }

    @SuppressWarnings("unchecked")
    public T dequeue() {
        if (isEmpty()) throw new NoSuchElementException();
        T item = (T) data[front];
        data[front] = null;
        front = (front + 1) % data.length;
        size--;
        return item;
    }

    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) throw new NoSuchElementException();
        return (T) data[front];
    }

    public boolean isEmpty() { return size == 0; }
    public int size() { return size; }

    private void resize(int newCapacity) {
        Object[] newData = new Object[newCapacity];
        for (int i = 0; i < size; i++) {
            newData[i] = data[(front + i) % data.length];
        }
        data = newData;
        front = 0;
        rear = size - 1;
    }
}
```

In practice, use `Queue<Integer> queue = new ArrayDeque<>()` or `Queue<Integer> queue = new LinkedList<>()`.

### Variants

- **Deque (Double-Ended Queue):** Insert/remove from both ends in $O(1)$. Java: `ArrayDeque`.
- **Priority Queue:** Dequeue returns the highest-priority element. Covered under Heaps below.

### Applications

- BFS traversal
- Task scheduling
- Buffer management
- Producer-consumer patterns

---

## Hash Tables

### Concept

A hash table maps keys to values using a **hash function** that converts keys to array indices. With a good hash function and proper collision handling, operations are $O(1)$ average.

### Collision Resolution

**Separate Chaining:** Each bucket holds a linked list (or balanced tree in Java 8+ for long chains).

**Open Addressing (Linear Probing):**

```java
public class LinearProbingHashMap<K, V> {
    private static final int INITIAL_CAPACITY = 16;
    private static final double LOAD_FACTOR = 0.75;

    private K[] keys;
    private V[] values;
    private int size;
    private int capacity;

    @SuppressWarnings("unchecked")
    public LinearProbingHashMap() {
        capacity = INITIAL_CAPACITY;
        keys = (K[]) new Object[capacity];
        values = (V[]) new Object[capacity];
        size = 0;
    }

    private int hash(K key) {
        return (key.hashCode() & 0x7fffffff) % capacity;
    }

    public void put(K key, V value) {
        if (size >= capacity * LOAD_FACTOR) resize(capacity * 2);
        int i = hash(key);
        while (keys[i] != null) {
            if (keys[i].equals(key)) {
                values[i] = value; // update existing
                return;
            }
            i = (i + 1) % capacity;
        }
        keys[i] = key;
        values[i] = value;
        size++;
    }

    public V get(K key) {
        int i = hash(key);
        while (keys[i] != null) {
            if (keys[i].equals(key)) return values[i];
            i = (i + 1) % capacity;
        }
        return null;
    }

    public boolean containsKey(K key) {
        int i = hash(key);
        while (keys[i] != null) {
            if (keys[i].equals(key)) return true;
            i = (i + 1) % capacity;
        }
        return false;
    }

    @SuppressWarnings("unchecked")
    private void resize(int newCapacity) {
        K[] oldKeys = keys;
        V[] oldValues = values;
        capacity = newCapacity;
        keys = (K[]) new Object[capacity];
        values = (V[]) new Object[capacity];
        size = 0;
        for (int i = 0; i < oldKeys.length; i++) {
            if (oldKeys[i] != null) {
                put(oldKeys[i], oldValues[i]);
            }
        }
    }

    public int size() { return size; }
}
```

### Complexity

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Put | $O(1)$ | $O(n)$ |
| Get | $O(1)$ | $O(n)$ |
| Delete | $O(1)$ | $O(n)$ |
| containsKey | $O(1)$ | $O(n)$ |

Worst case occurs with many collisions. Java's `HashMap` uses separate chaining and degrades to $O(\log n)$ worst case per operation (tree-based buckets since Java 8).

### When to Use

Use hash tables when you need fast average-case lookup, insertion, and deletion by key. They are the workhorse data structure for frequency counting, caching, deduplication, and index-building.

---

## Heaps (Priority Queues)

### Concept

A **binary heap** is a complete binary tree satisfying the **heap property**:
- **Min-heap:** Every parent $\leq$ its children. Root is the minimum.
- **Max-heap:** Every parent $\geq$ its children. Root is the maximum.

Stored as an array where for index $i$ (0-indexed):
- Parent: $(i - 1) / 2$
- Left child: $2i + 1$
- Right child: $2i + 2$

### Java Implementation (Min-Heap)

```java
public class MinHeap {
    private int[] data;
    private int size;

    public MinHeap(int capacity) {
        data = new int[capacity];
        size = 0;
    }

    // O(log n)
    public void insert(int val) {
        if (size == data.length) {
            data = Arrays.copyOf(data, data.length * 2);
        }
        data[size] = val;
        siftUp(size);
        size++;
    }

    // O(log n)
    public int extractMin() {
        if (size == 0) throw new NoSuchElementException();
        int min = data[0];
        data[0] = data[--size];
        siftDown(0);
        return min;
    }

    // O(1)
    public int peekMin() {
        if (size == 0) throw new NoSuchElementException();
        return data[0];
    }

    private void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data[i] < data[parent]) {
                swap(i, parent);
                i = parent;
            } else {
                break;
            }
        }
    }

    private void siftDown(int i) {
        while (2 * i + 1 < size) {
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            int smallest = i;
            if (left < size && data[left] < data[smallest]) smallest = left;
            if (right < size && data[right] < data[smallest]) smallest = right;
            if (smallest != i) {
                swap(i, smallest);
                i = smallest;
            } else {
                break;
            }
        }
    }

    private void swap(int i, int j) {
        int temp = data[i];
        data[i] = data[j];
        data[j] = temp;
    }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }
}
```

### Building a Heap in O(n)

The **heapify** procedure builds a heap from an unsorted array in $O(n)$ (not $O(n \log n)$) by calling `siftDown` from the last non-leaf to the root:

```java
public static void buildMinHeap(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) {
        siftDown(arr, n, i);
    }
}
```

The $O(n)$ bound comes from the fact that most nodes are near the bottom and sift down only a short distance.

### Java Built-In

```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
minHeap.offer(5);    // insert
minHeap.poll();      // extract min
minHeap.peek();      // view min
```

### Complexity

| Operation | Time |
|-----------|------|
| Insert | $O(\log n)$ |
| Extract min/max | $O(\log n)$ |
| Peek min/max | $O(1)$ |
| Build heap | $O(n)$ |

### When to Use

Use heaps when you need to repeatedly find/remove the minimum or maximum element. Common applications: Dijkstra's algorithm, median maintenance, top-K problems, merge K sorted lists.

---

## Trees

### Binary Search Tree (BST)

A BST is a binary tree where for every node: all values in the left subtree are less, and all values in the right subtree are greater.

```java
public class BST {
    private static class Node {
        int key;
        Node left, right;
        Node(int key) { this.key = key; }
    }

    private Node root;

    // O(h) where h is height
    public void insert(int key) {
        root = insertRec(root, key);
    }

    private Node insertRec(Node node, int key) {
        if (node == null) return new Node(key);
        if (key < node.key) node.left = insertRec(node.left, key);
        else if (key > node.key) node.right = insertRec(node.right, key);
        return node; // duplicate keys ignored
    }

    // O(h)
    public boolean search(int key) {
        return searchRec(root, key);
    }

    private boolean searchRec(Node node, int key) {
        if (node == null) return false;
        if (key == node.key) return true;
        if (key < node.key) return searchRec(node.left, key);
        return searchRec(node.right, key);
    }

    // O(h)
    public void delete(int key) {
        root = deleteRec(root, key);
    }

    private Node deleteRec(Node node, int key) {
        if (node == null) return null;
        if (key < node.key) {
            node.left = deleteRec(node.left, key);
        } else if (key > node.key) {
            node.right = deleteRec(node.right, key);
        } else {
            // Node found
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            // Two children: replace with in-order successor
            Node successor = findMin(node.right);
            node.key = successor.key;
            node.right = deleteRec(node.right, successor.key);
        }
        return node;
    }

    private Node findMin(Node node) {
        while (node.left != null) node = node.left;
        return node;
    }

    // In-order traversal: produces sorted output
    public void inOrder() {
        inOrderRec(root);
        System.out.println();
    }

    private void inOrderRec(Node node) {
        if (node == null) return;
        inOrderRec(node.left);
        System.out.print(node.key + " ");
        inOrderRec(node.right);
    }
}
```

**Problem:** An unbalanced BST degenerates into a linked list with $h = O(n)$.

### AVL Tree

An AVL tree is a self-balancing BST where the heights of left and right subtrees of every node differ by at most 1. Balancing is achieved through **rotations**.

```java
public class AVLTree {
    private static class Node {
        int key, height;
        Node left, right;
        Node(int key) {
            this.key = key;
            this.height = 1;
        }
    }

    private Node root;

    private int height(Node n) { return n == null ? 0 : n.height; }

    private int balanceFactor(Node n) {
        return n == null ? 0 : height(n.left) - height(n.right);
    }

    private void updateHeight(Node n) {
        n.height = 1 + Math.max(height(n.left), height(n.right));
    }

    private Node rotateRight(Node y) {
        Node x = y.left;
        Node T = x.right;
        x.right = y;
        y.left = T;
        updateHeight(y);
        updateHeight(x);
        return x;
    }

    private Node rotateLeft(Node x) {
        Node y = x.right;
        Node T = y.left;
        y.left = x;
        x.right = T;
        updateHeight(x);
        updateHeight(y);
        return y;
    }

    private Node balance(Node node) {
        updateHeight(node);
        int bf = balanceFactor(node);

        if (bf > 1) { // left-heavy
            if (balanceFactor(node.left) < 0) {
                node.left = rotateLeft(node.left); // left-right case
            }
            return rotateRight(node); // left-left case
        }
        if (bf < -1) { // right-heavy
            if (balanceFactor(node.right) > 0) {
                node.right = rotateRight(node.right); // right-left case
            }
            return rotateLeft(node); // right-right case
        }
        return node;
    }

    public void insert(int key) {
        root = insertRec(root, key);
    }

    private Node insertRec(Node node, int key) {
        if (node == null) return new Node(key);
        if (key < node.key) node.left = insertRec(node.left, key);
        else if (key > node.key) node.right = insertRec(node.right, key);
        else return node;
        return balance(node);
    }

    public boolean search(int key) {
        Node cur = root;
        while (cur != null) {
            if (key == cur.key) return true;
            cur = key < cur.key ? cur.left : cur.right;
        }
        return false;
    }
}
```

### Red-Black Tree

A Red-Black tree is another self-balancing BST with the following properties:
1. Every node is red or black.
2. The root is black.
3. Every leaf (NIL) is black.
4. Red nodes cannot have red children.
5. All paths from a node to its descendant leaves have the same number of black nodes.

These constraints ensure the tree height is at most $2 \log_2(n+1)$. Java's `TreeMap` and `TreeSet` use Red-Black trees internally.

**Comparison:**
- AVL trees are more strictly balanced (height $\leq 1.44 \log_2(n+2)$), giving faster lookups.
- Red-Black trees have faster insertions/deletions on average (fewer rotations).
- In practice, use Java's `TreeMap`/`TreeSet` rather than implementing from scratch.

### Splay Tree

A **splay tree** is a self-adjusting BST that moves recently accessed elements to the root through a process called **splaying**. It has no balance condition like AVL or Red-Black trees; instead, it restructures itself on every access to improve future access times.

**Key property:** All operations (search, insert, delete) have $O(\log n)$ **amortized** time, though individual operations can be $O(n)$ in the worst case. Splay trees are optimal for workloads with temporal locality (frequently accessed elements are near the root).

```java
public class SplayTree {
    private static class Node {
        int key;
        Node left, right, parent;
        Node(int key) { this.key = key; }
    }

    private Node root;

    // Zig rotation (right rotation)
    private void rotateRight(Node x) {
        Node y = x.parent;
        y.left = x.right;
        if (x.right != null) x.right.parent = y;
        x.parent = y.parent;
        if (y.parent == null) {
            root = x;
        } else if (y == y.parent.left) {
            y.parent.left = x;
        } else {
            y.parent.right = x;
        }
        x.right = y;
        y.parent = x;
    }

    // Zag rotation (left rotation)
    private void rotateLeft(Node x) {
        Node y = x.parent;
        y.right = x.left;
        if (x.left != null) x.left.parent = y;
        x.parent = y.parent;
        if (y.parent == null) {
            root = x;
        } else if (y == y.parent.left) {
            y.parent.left = x;
        } else {
            y.parent.right = x;
        }
        x.left = y;
        y.parent = x;
    }

    // Splay node x to the root
    private void splay(Node x) {
        while (x.parent != null) {
            Node parent = x.parent;
            Node grandparent = parent.parent;

            if (grandparent == null) {
                // Zig or Zag
                if (x == parent.left) rotateRight(x);
                else rotateLeft(x);
            } else if (x == parent.left && parent == grandparent.left) {
                // Zig-Zig
                rotateRight(parent);
                rotateRight(x);
            } else if (x == parent.right && parent == grandparent.right) {
                // Zag-Zag
                rotateLeft(parent);
                rotateLeft(x);
            } else if (x == parent.right && parent == grandparent.left) {
                // Zig-Zag
                rotateLeft(x);
                rotateRight(x);
            } else {
                // Zag-Zig
                rotateRight(x);
                rotateLeft(x);
            }
        }
    }

    // O(log n) amortized
    public boolean search(int key) {
        Node node = root;
        Node last = null;
        while (node != null) {
            last = node;
            if (key == node.key) {
                splay(node);
                return true;
            } else if (key < node.key) {
                node = node.left;
            } else {
                node = node.right;
            }
        }
        if (last != null) splay(last);
        return false;
    }

    // O(log n) amortized
    public void insert(int key) {
        if (root == null) {
            root = new Node(key);
            return;
        }
        Node node = root;
        Node parent = null;
        while (node != null) {
            parent = node;
            if (key < node.key) node = node.left;
            else if (key > node.key) node = node.right;
            else { splay(node); return; } // duplicate
        }
        Node newNode = new Node(key);
        newNode.parent = parent;
        if (key < parent.key) parent.left = newNode;
        else parent.right = newNode;
        splay(newNode);
    }
}
```

| Operation | Amortized | Worst Case |
|-----------|-----------|------------|
| Search | $O(\log n)$ | $O(n)$ |
| Insert | $O(\log n)$ | $O(n)$ |
| Delete | $O(\log n)$ | $O(n)$ |

**When to Use:** Splay trees are ideal when access patterns exhibit locality (e.g., caching, recent-access-biased workloads). They also have the **dynamic optimality conjecture**: they may be as fast as any BST on any access sequence. They are used in Windows NT kernel memory management and some garbage collectors.

---

### KD Tree (K-Dimensional Tree)

A **KD tree** is a space-partitioning data structure for organizing points in $k$-dimensional space. It generalizes binary search trees to multiple dimensions by cycling through dimensions at each level of the tree.

**Key property:** Efficient for nearest neighbor search and range queries in low-dimensional spaces ($k \leq 20$). Average-case operations are $O(\log n)$, but worst case can degenerate to $O(n)$.

```java
public class KDTree {
    private static final int K = 2; // 2D tree

    private static class Node {
        double[] point;
        Node left, right;

        Node(double[] point) {
            this.point = point.clone();
        }
    }

    private Node root;

    public void insert(double[] point) {
        root = insertRec(root, point, 0);
    }

    private Node insertRec(Node node, double[] point, int depth) {
        if (node == null) return new Node(point);

        int axis = depth % K; // alternate splitting axis
        if (point[axis] < node.point[axis]) {
            node.left = insertRec(node.left, point, depth + 1);
        } else {
            node.right = insertRec(node.right, point, depth + 1);
        }
        return node;
    }

    // Nearest neighbor search
    private Node best;
    private double bestDist;

    public double[] nearestNeighbor(double[] target) {
        best = null;
        bestDist = Double.MAX_VALUE;
        nearestRec(root, target, 0);
        return best == null ? null : best.point;
    }

    private void nearestRec(Node node, double[] target, int depth) {
        if (node == null) return;

        double dist = distance(node.point, target);
        if (dist < bestDist) {
            bestDist = dist;
            best = node;
        }

        int axis = depth % K;
        double diff = target[axis] - node.point[axis];

        // Search the side of the splitting plane that contains the target first
        Node first = diff < 0 ? node.left : node.right;
        Node second = diff < 0 ? node.right : node.left;

        nearestRec(first, target, depth + 1);

        // Only search the other side if it could contain a closer point
        if (diff * diff < bestDist) {
            nearestRec(second, target, depth + 1);
        }
    }

    private double distance(double[] a, double[] b) {
        double sum = 0;
        for (int i = 0; i < K; i++) {
            sum += (a[i] - b[i]) * (a[i] - b[i]);
        }
        return sum; // squared distance (avoids sqrt for comparison)
    }

    // Range search: find all points within a rectangular region
    public List<double[]> rangeSearch(double[] low, double[] high) {
        List<double[]> result = new ArrayList<>();
        rangeRec(root, low, high, 0, result);
        return result;
    }

    private void rangeRec(Node node, double[] low, double[] high,
                          int depth, List<double[]> result) {
        if (node == null) return;

        boolean inRange = true;
        for (int i = 0; i < K; i++) {
            if (node.point[i] < low[i] || node.point[i] > high[i]) {
                inRange = false;
                break;
            }
        }
        if (inRange) result.add(node.point);

        int axis = depth % K;
        if (low[axis] <= node.point[axis]) {
            rangeRec(node.left, low, high, depth + 1, result);
        }
        if (high[axis] >= node.point[axis]) {
            rangeRec(node.right, low, high, depth + 1, result);
        }
    }
}
```

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Insert | $O(\log n)$ | $O(n)$ |
| Nearest Neighbor | $O(\log n)$ | $O(n)$ |
| Range Search | $O(\sqrt{n} + m)$ | $O(n)$ |

($m$ = number of points reported in range search)

**When to Use:** KD trees are ideal for spatial queries in low dimensions: nearest neighbor search in 2D/3D (computer graphics, GIS), collision detection in games, and machine learning (k-nearest neighbors algorithm). Performance degrades significantly for $k > 20$ (the "curse of dimensionality").

---

### Tree Traversals

```java
// Pre-order: root, left, right
public static void preOrder(Node node) {
    if (node == null) return;
    System.out.print(node.key + " ");
    preOrder(node.left);
    preOrder(node.right);
}

// In-order: left, root, right (sorted for BST)
public static void inOrder(Node node) {
    if (node == null) return;
    inOrder(node.left);
    System.out.print(node.key + " ");
    inOrder(node.right);
}

// Post-order: left, right, root
public static void postOrder(Node node) {
    if (node == null) return;
    postOrder(node.left);
    postOrder(node.right);
    System.out.print(node.key + " ");
}

// Level-order (BFS)
public static void levelOrder(Node root) {
    if (root == null) return;
    Queue<Node> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        Node node = queue.poll();
        System.out.print(node.key + " ");
        if (node.left != null) queue.offer(node.left);
        if (node.right != null) queue.offer(node.right);
    }
}
```

---

## Tries (Prefix Trees)

### Concept

A trie is a tree-like data structure for storing strings. Each node represents a character, and paths from the root represent prefixes. Lookup time is $O(m)$ where $m$ is the string length, independent of the number of stored strings.

### Java Implementation

```java
public class Trie {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26]; // lowercase a-z
        boolean isEndOfWord;
    }

    private final TrieNode root = new TrieNode();

    // O(m) where m = word.length()
    public void insert(String word) {
        TrieNode current = root;
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (current.children[index] == null) {
                current.children[index] = new TrieNode();
            }
            current = current.children[index];
        }
        current.isEndOfWord = true;
    }

    // O(m)
    public boolean search(String word) {
        TrieNode node = findNode(word);
        return node != null && node.isEndOfWord;
    }

    // O(m)
    public boolean startsWith(String prefix) {
        return findNode(prefix) != null;
    }

    private TrieNode findNode(String s) {
        TrieNode current = root;
        for (char c : s.toCharArray()) {
            int index = c - 'a';
            if (current.children[index] == null) return null;
            current = current.children[index];
        }
        return current;
    }
}
```

### When to Use

Tries excel at prefix-based operations: autocomplete, spell checking, IP routing tables, and dictionary storage. Space usage can be high (each node has up to 26 children pointers for lowercase English), but compressed tries (radix trees / Patricia tries) mitigate this.

---

## B-Tree

### Concept

A **B-Tree** of order $m$ (also called minimum degree $t$) is a self-balancing tree data structure optimized for systems that read and write large blocks of data, such as databases and filesystems. Unlike binary trees, each node can contain multiple keys and have multiple children.

**B-Tree properties (minimum degree $t \geq 2$):**
1. Every node has at most $2t - 1$ keys and $2t$ children.
2. Every non-root node has at least $t - 1$ keys.
3. The root has at least 1 key (if the tree is non-empty).
4. All leaves are at the same depth.
5. Keys within each node are sorted.

**Why B-Trees matter:** In disk-based storage, the bottleneck is the number of disk reads, not CPU operations. A B-Tree with $t = 512$ and a million keys has height $\leq 3$, meaning any key can be found with at most 3 disk reads.

### Java Implementation

```java
public class BTree {
    private static final int T = 3; // minimum degree

    private static class Node {
        int[] keys = new int[2 * T - 1];
        Node[] children = new Node[2 * T];
        int numKeys = 0;
        boolean leaf = true;
    }

    private Node root;

    public BTree() {
        root = new Node();
    }

    // O(log n)
    public boolean search(int key) {
        return search(root, key);
    }

    private boolean search(Node node, int key) {
        int i = 0;
        while (i < node.numKeys && key > node.keys[i]) {
            i++;
        }
        if (i < node.numKeys && key == node.keys[i]) {
            return true;
        }
        if (node.leaf) {
            return false;
        }
        return search(node.children[i], key);
    }

    // O(log n)
    public void insert(int key) {
        Node r = root;
        if (r.numKeys == 2 * T - 1) {
            // Root is full, split it
            Node s = new Node();
            s.leaf = false;
            s.children[0] = r;
            splitChild(s, 0, r);
            root = s;
            insertNonFull(s, key);
        } else {
            insertNonFull(r, key);
        }
    }

    private void insertNonFull(Node node, int key) {
        int i = node.numKeys - 1;
        if (node.leaf) {
            // Shift keys to make room and insert
            while (i >= 0 && key < node.keys[i]) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            node.keys[i + 1] = key;
            node.numKeys++;
        } else {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            i++;
            if (node.children[i].numKeys == 2 * T - 1) {
                splitChild(node, i, node.children[i]);
                if (key > node.keys[i]) {
                    i++;
                }
            }
            insertNonFull(node.children[i], key);
        }
    }

    private void splitChild(Node parent, int index, Node fullChild) {
        Node newChild = new Node();
        newChild.leaf = fullChild.leaf;
        newChild.numKeys = T - 1;

        // Copy upper half of keys to new child
        for (int j = 0; j < T - 1; j++) {
            newChild.keys[j] = fullChild.keys[j + T];
        }
        if (!fullChild.leaf) {
            for (int j = 0; j < T; j++) {
                newChild.children[j] = fullChild.children[j + T];
            }
        }
        fullChild.numKeys = T - 1;

        // Shift parent's children and keys to make room
        for (int j = parent.numKeys; j > index; j--) {
            parent.children[j + 1] = parent.children[j];
        }
        parent.children[index + 1] = newChild;

        for (int j = parent.numKeys - 1; j >= index; j--) {
            parent.keys[j + 1] = parent.keys[j];
        }
        parent.keys[index] = fullChild.keys[T - 1];
        parent.numKeys++;
    }

    // In-order traversal
    public void traverse() {
        traverse(root);
        System.out.println();
    }

    private void traverse(Node node) {
        int i;
        for (i = 0; i < node.numKeys; i++) {
            if (!node.leaf) {
                traverse(node.children[i]);
            }
            System.out.print(node.keys[i] + " ");
        }
        if (!node.leaf) {
            traverse(node.children[i]);
        }
    }
}
```

### Complexity

| Operation | Time | Disk Reads |
|-----------|------|------------|
| Search | $O(\log n)$ | $O(\log_t n)$ |
| Insert | $O(\log n)$ | $O(\log_t n)$ |
| Delete | $O(\log n)$ | $O(\log_t n)$ |
| Space | $O(n)$ | -- |

The height of a B-Tree with $n$ keys and minimum degree $t$ is at most $\log_t \frac{n+1}{2}$, which means very few levels even for massive datasets.

### B-Tree Variants

- **B+ Tree:** All keys stored in leaves; internal nodes only hold routing keys. Leaves form a linked list for efficient range queries. Used in most database indexes (MySQL InnoDB, PostgreSQL).
- **B* Tree:** Requires nodes to be at least $\frac{2}{3}$ full (instead of $\frac{1}{2}$), improving space utilization.

### When to Use

B-Trees are used in virtually all disk-based storage systems: database indexes (MySQL, PostgreSQL, Oracle), filesystems (NTFS, ext4, HFS+), and key-value stores. Use a B-Tree when data doesn't fit in memory and you need to minimize disk I/O.

---

## Graphs

### Representations

#### Adjacency List

```java
public class GraphAdjList {
    private final int V;
    private final List<List<Integer>> adj;

    public GraphAdjList(int V) {
        this.V = V;
        adj = new ArrayList<>();
        for (int i = 0; i < V; i++) {
            adj.add(new ArrayList<>());
        }
    }

    // O(1)
    public void addEdge(int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u); // remove for directed graph
    }

    // O(degree(u))
    public List<Integer> neighbors(int u) {
        return adj.get(u);
    }

    // O(degree(u))
    public boolean hasEdge(int u, int v) {
        return adj.get(u).contains(v);
    }

    public int vertices() { return V; }
}
```

**Space:** $O(V + E)$, where $V$ = vertices, $E$ = edges.

#### Adjacency Matrix

```java
public class GraphAdjMatrix {
    private final int V;
    private final boolean[][] matrix;

    public GraphAdjMatrix(int V) {
        this.V = V;
        matrix = new boolean[V][V];
    }

    // O(1)
    public void addEdge(int u, int v) {
        matrix[u][v] = true;
        matrix[v][u] = true; // remove for directed graph
    }

    // O(1)
    public boolean hasEdge(int u, int v) {
        return matrix[u][v];
    }

    // O(V)
    public List<Integer> neighbors(int u) {
        List<Integer> result = new ArrayList<>();
        for (int v = 0; v < V; v++) {
            if (matrix[u][v]) result.add(v);
        }
        return result;
    }

    public int vertices() { return V; }
}
```

**Space:** $O(V^2)$.

### Comparison

| Operation | Adj. List | Adj. Matrix |
|-----------|-----------|-------------|
| Space | $O(V + E)$ | $O(V^2)$ |
| Add edge | $O(1)$ | $O(1)$ |
| Check edge | $O(\deg(u))$ | $O(1)$ |
| Iterate neighbors | $O(\deg(u))$ | $O(V)$ |
| Add vertex | $O(1)$ | $O(V^2)$ (rebuild) |

**Rule of thumb:** Use adjacency lists for sparse graphs ($E \ll V^2$), adjacency matrices for dense graphs ($E \approx V^2$).

### Weighted Graph with Adjacency List

```java
public class WeightedGraph {
    private final int V;
    private final List<List<int[]>> adj; // int[]{neighbor, weight}

    public WeightedGraph(int V) {
        this.V = V;
        adj = new ArrayList<>();
        for (int i = 0; i < V; i++) {
            adj.add(new ArrayList<>());
        }
    }

    public void addEdge(int u, int v, int weight) {
        adj.get(u).add(new int[]{v, weight});
        adj.get(v).add(new int[]{u, weight}); // remove for directed
    }

    public List<int[]> neighbors(int u) {
        return adj.get(u);
    }
}
```

---

## Choosing the Right Data Structure

| Need | Best Choice | Why |
|------|-------------|-----|
| Fast access by index | Array / ArrayList | $O(1)$ random access |
| Fast insertion/deletion at ends | Deque (ArrayDeque) | $O(1)$ amortized |
| Fast insertion/deletion anywhere | Linked List | $O(1)$ if node reference known |
| Fast lookup by key | HashMap | $O(1)$ average |
| Sorted key order + lookup | TreeMap (Red-Black Tree) | $O(\log n)$ all ops, sorted iteration |
| Fast min/max retrieval | PriorityQueue (Heap) | $O(1)$ peek, $O(\log n)$ extract |
| Prefix-based string operations | Trie | $O(m)$ per operation |
| Modeling relationships | Graph (adj. list/matrix) | Depends on density |
| LIFO access | Stack (ArrayDeque) | $O(1)$ push/pop |
| FIFO access | Queue (ArrayDeque) | $O(1)$ enqueue/dequeue |
| Need both sorted order and fast lookup | TreeSet / TreeMap | $O(\log n)$ balanced BST |
| Counting occurrences | HashMap<T, Integer> | $O(1)$ average per update |

---

## Quiz

**Q1.** What is the time complexity of inserting an element at position $k$ in an `ArrayList` of size $n$?

**A1.** $O(n - k)$, which is $O(n)$ in the worst case (inserting at position 0). Elements after position $k$ must be shifted right by one.

---

**Q2.** Why is `ArrayDeque` preferred over `java.util.Stack` for stack operations in modern Java?

**A2.** `java.util.Stack` extends `Vector`, which is synchronized (unnecessary overhead for single-threaded use) and allows random access (violating the stack abstraction). `ArrayDeque` is unsynchronized, faster, and properly restricts the interface to stack operations via `push`, `pop`, and `peek`.

---

**Q3.** A hash table has $n$ entries and uses separate chaining. If the hash function distributes keys uniformly, what is the expected length of each chain when the load factor is $\alpha = n / m$ (where $m$ is the number of buckets)?

**A3.** The expected chain length is $\alpha$. Operations take $O(1 + \alpha)$ expected time. To keep this $O(1)$, we maintain $\alpha \leq$ some constant (Java's `HashMap` uses 0.75 by default) and resize when exceeded.

---

**Q4.** What is the key difference between a min-heap and a BST?

**A4.** In a min-heap, each parent is smaller than its children, but there is no ordering between siblings or between left and right subtrees. In a BST, the left subtree contains smaller values and the right subtree contains larger values. A heap supports efficient min extraction ($O(\log n)$) but not efficient search ($O(n)$); a BST supports efficient search ($O(\log n)$ if balanced) but min extraction requires walking to the leftmost node ($O(\log n)$ if balanced, $O(n)$ if not).

---

**Q5.** You need to check whether a word exists in a dictionary of 100,000 words. Which data structure would you use, and why?

**A5.** A `HashSet<String>` provides $O(m)$ average-case lookup where $m$ is the word length (time to compute the hash). If you also need prefix queries ("do any words start with 'pre'?"), use a Trie instead.

---

**Q6.** When should you use an adjacency matrix instead of an adjacency list?

**A6.** Use an adjacency matrix when the graph is dense ($E \approx V^2$), when you need $O(1)$ edge existence checks, or when implementing algorithms like Floyd-Warshall that iterate over all vertex pairs. For sparse graphs, adjacency lists are more space-efficient ($O(V + E)$ vs. $O(V^2)$).

---

**Q7.** Why does building a heap from an array take $O(n)$ time rather than $O(n \log n)$?

**A7.** The bottom-up `heapify` approach calls `siftDown` starting from the last non-leaf. Nodes at the bottom (half the nodes) sift down 0 levels, nodes one level up sift down at most 1 level, and so on. The total work is $\sum_{h=0}^{\lfloor\log n\rfloor} \lceil n / 2^{h+1}\rceil \cdot h$, which sums to $O(n)$ (by the formula for the sum of $h / 2^h$).

---

**Q8.** What are the four standard tree traversal orders, and which one produces sorted output for a BST?

**A8.** Pre-order (root, left, right), in-order (left, root, right), post-order (left, right, root), and level-order (BFS, level by level). **In-order** traversal produces sorted output for a BST.

---

**Q9.** What advantage does a skip list have over a balanced BST like a Red-Black Tree?

**A9.** Skip lists are simpler to implement (no rotation logic), easier to make concurrent/lock-free, and have comparable average-case performance ($O(\log n)$). However, their $O(\log n)$ bound is probabilistic (expected), whereas balanced BSTs provide worst-case $O(\log n)$ guarantees. Skip lists are preferred in concurrent systems (e.g., Redis, Java's `ConcurrentSkipListMap`).

---

**Q10.** Why are B-Trees preferred over binary search trees for database indexes?

**A10.** B-Trees minimize disk I/O by storing many keys per node (high branching factor), which means the tree height is very small. A B-Tree with minimum degree 512 and 1 billion keys has height $\leq 4$, so any key lookup requires at most 4 disk reads. A balanced BST with 1 billion keys has height $\approx 30$, requiring 30 disk reads. Since disk reads are orders of magnitude slower than memory access, B-Trees dramatically outperform BSTs for on-disk data.

---

**Q11.** In what scenario would a splay tree outperform an AVL tree, and why?

**A11.** When access patterns have strong locality -- i.e., a small subset of elements is accessed much more frequently than others. A splay tree moves recently accessed elements to the root, so repeated accesses to the same elements become $O(1)$ after the first access. An AVL tree, being rigidly balanced, always takes $O(\log n)$ regardless of access patterns. Splay trees are also better when the working set changes over time, as they adapt automatically.

---

**Q12.** When would you use a KD tree instead of a hash table for spatial data?

**A12.** A hash table can only answer exact point queries efficiently ($O(1)$). A KD tree supports spatial queries that hash tables cannot: nearest neighbor search ("find the closest point to $(3.5, 7.2)$"), range queries ("find all points in this rectangle"), and k-nearest neighbor queries. Use a KD tree when you need geometric/spatial queries in low-dimensional spaces ($k \leq 20$).

---

## Comprehensive Complexity Cheat Sheet

The following table summarizes the time complexity of common operations for all major data structures covered in this module. "Avg" = average case, "Worst" = worst case.

### Linear Data Structures

| Data Structure | Access (Avg) | Search (Avg) | Insert (Avg) | Delete (Avg) | Access (Worst) | Search (Worst) | Insert (Worst) | Delete (Worst) | Space |
|----------------|-------------|-------------|-------------|-------------|---------------|---------------|---------------|---------------|-------|
| Array | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| ArrayList | $O(1)$ | $O(n)$ | $O(1)$* | $O(n)$ | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| Singly Linked List | $O(n)$ | $O(n)$ | $O(1)$** | $O(1)$** | $O(n)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ |
| Doubly Linked List | $O(n)$ | $O(n)$ | $O(1)$** | $O(1)$** | $O(n)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ |
| Stack (ArrayDeque) | $O(n)$ | $O(n)$ | $O(1)$* | $O(1)$* | $O(n)$ | $O(n)$ | $O(n)$ | $O(1)$ | $O(n)$ |
| Queue (ArrayDeque) | $O(n)$ | $O(n)$ | $O(1)$* | $O(1)$* | $O(n)$ | $O(n)$ | $O(n)$ | $O(1)$ | $O(n)$ |
| Skip List | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |

\* Amortized. \*\* At known position (head/tail).

### Hash-Based Structures

| Data Structure | Access | Search (Avg) | Insert (Avg) | Delete (Avg) | Search (Worst) | Insert (Worst) | Delete (Worst) | Space |
|----------------|--------|-------------|-------------|-------------|---------------|---------------|---------------|-------|
| HashMap | N/A | $O(1)$ | $O(1)$ | $O(1)$ | $O(n)$* | $O(n)$ | $O(n)$ | $O(n)$ |
| HashSet | N/A | $O(1)$ | $O(1)$ | $O(1)$ | $O(n)$* | $O(n)$ | $O(n)$ | $O(n)$ |
| LinkedHashMap | N/A | $O(1)$ | $O(1)$ | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |

\* Java 8+ HashMap degrades to $O(\log n)$ worst case due to tree-based buckets.

### Tree-Based Structures

| Data Structure | Access | Search (Avg) | Insert (Avg) | Delete (Avg) | Search (Worst) | Insert (Worst) | Delete (Worst) | Space |
|----------------|--------|-------------|-------------|-------------|---------------|---------------|---------------|-------|
| BST (unbalanced) | N/A | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| AVL Tree | N/A | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ |
| Red-Black Tree | N/A | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ |
| Splay Tree | N/A | $O(\log n)$* | $O(\log n)$* | $O(\log n)$* | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| B-Tree | N/A | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ |
| KD Tree | N/A | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| Trie | N/A | $O(m)$ | $O(m)$ | $O(m)$ | $O(m)$ | $O(m)$ | $O(m)$ | $O(n \cdot m)$ |

\* Amortized. $m$ = key length for Trie.

### Heap-Based Structures

| Data Structure | Find Min/Max | Insert (Avg) | Delete Min/Max | Search | Build | Space |
|----------------|-------------|-------------|----------------|--------|-------|-------|
| Binary Heap | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| Fibonacci Heap | $O(1)$ | $O(1)$* | $O(\log n)$* | $O(n)$ | $O(n)$ | $O(n)$ |

\* Amortized.

### Graph Representations

| Representation | Space | Add Edge | Check Edge | Iterate Neighbors |
|----------------|-------|----------|------------|-------------------|
| Adjacency List | $O(V + E)$ | $O(1)$ | $O(\deg(v))$ | $O(\deg(v))$ |
| Adjacency Matrix | $O(V^2)$ | $O(1)$ | $O(1)$ | $O(V)$ |

### Java Collections Quick Reference

| Java Class | Underlying Structure | Key Operations Complexity |
|------------|---------------------|--------------------------|
| `ArrayList` | Dynamic array | get/set: $O(1)$, add (end): amortized $O(1)$, add/remove (middle): $O(n)$ |
| `LinkedList` | Doubly linked list | get: $O(n)$, add/remove (ends): $O(1)$, add/remove (middle): $O(n)$ search + $O(1)$ splice |
| `ArrayDeque` | Circular array | push/pop/offer/poll: amortized $O(1)$ |
| `HashMap` | Hash table (separate chaining) | get/put/remove: $O(1)$ avg, $O(\log n)$ worst (Java 8+) |
| `TreeMap` | Red-Black Tree | get/put/remove: $O(\log n)$, sorted iteration |
| `HashSet` | HashMap-backed | add/remove/contains: $O(1)$ avg |
| `TreeSet` | TreeMap-backed | add/remove/contains: $O(\log n)$, sorted iteration |
| `PriorityQueue` | Binary heap | offer/poll: $O(\log n)$, peek: $O(1)$ |
| `ConcurrentSkipListMap` | Skip list | get/put/remove: $O(\log n)$ avg, thread-safe |
