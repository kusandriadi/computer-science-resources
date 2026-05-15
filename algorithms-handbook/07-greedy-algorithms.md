# Module 07: Greedy Algorithms

## Introduction

A greedy algorithm builds a solution piece by piece, always choosing the option that looks best at the current moment, without reconsidering previous choices. Unlike dynamic programming, which explores all possibilities, a greedy algorithm commits to each local decision and never backtracks.

The appeal is obvious: greedy algorithms are typically simple, fast, and elegant. The challenge is proving they work. A greedy algorithm is correct only when the **greedy choice property** holds -- making the locally optimal choice at each step leads to the globally optimal solution.

When it works, greedy beats DP on both simplicity and speed. When it doesn't work, it gives wrong answers. Recognizing when greedy applies is one of the most important skills in algorithm design.

---

## Key Properties

### Greedy Choice Property

At each step, a locally optimal choice can be made that is consistent with some globally optimal solution. In other words, we never need to reconsider a greedy choice.

**How to prove it:** Show that any optimal solution can be modified (without worsening it) to include the greedy choice. This is typically done by an **exchange argument**: take an optimal solution that doesn't make the greedy choice, swap in the greedy choice, and show the result is no worse.

### Optimal Substructure

After making a greedy choice, the remaining problem is a smaller instance of the same type. The optimal solution to the original problem contains an optimal solution to the subproblem.

This property is shared with dynamic programming. The distinguishing feature of greedy is that you only need to solve **one** subproblem (the one left after the greedy choice), not all of them.

---

## Activity Selection Problem

**Problem:** Given $n$ activities with start times $s[i]$ and finish times $f[i]$, select the maximum number of non-overlapping activities.

**Greedy strategy:** Always select the activity that finishes earliest (among those that don't conflict with already selected activities).

**Why it works:** The earliest-finishing activity leaves the most room for remaining activities. By exchange argument, any optimal solution can replace its first activity with the earliest-finishing one without reducing the count.

```java
public static List<int[]> activitySelection(int[][] activities) {
    // Sort by finish time
    Arrays.sort(activities, (a, b) -> a[1] - b[1]);

    List<int[]> selected = new ArrayList<>();
    int lastFinish = -1;

    for (int[] activity : activities) {
        if (activity[0] >= lastFinish) {
            selected.add(activity);
            lastFinish = activity[1];
        }
    }
    return selected;
}

// Usage:
// int[][] activities = {{1,4}, {3,5}, {0,6}, {5,7}, {3,9}, {5,9}, {6,10}, {8,11}, {8,12}, {2,14}, {12,16}};
// activitySelection(activities) selects activities finishing at 4, 7, 11, 16
```

**Time:** $O(n \log n)$ (dominated by sorting). **Space:** $O(1)$ extra (not counting output).

### Common Mistakes

Greedy by **earliest start time** does NOT work (a long activity starting early blocks many shorter ones). Greedy by **shortest duration** does NOT work (short activities can overlap in problematic ways).

---

## Huffman Coding

**Problem:** Given characters with frequencies, construct a prefix-free binary code that minimizes the total encoding length.

**Greedy strategy:** Repeatedly merge the two nodes with the lowest frequency.

### How It Works

1. Create a leaf node for each character with its frequency.
2. Insert all nodes into a min-heap (priority queue).
3. While there is more than one node:
   a. Extract the two nodes with the smallest frequencies.
   b. Create a new internal node with these two as children, frequency = sum of children.
   c. Insert the new node back into the heap.
4. The remaining node is the root of the Huffman tree.

```java
public class HuffmanCoding {
    static class Node implements Comparable<Node> {
        char ch;
        int freq;
        Node left, right;

        Node(char ch, int freq) {
            this.ch = ch;
            this.freq = freq;
        }

        Node(int freq, Node left, Node right) {
            this.ch = '\0';
            this.freq = freq;
            this.left = left;
            this.right = right;
        }

        public int compareTo(Node other) {
            return this.freq - other.freq;
        }

        boolean isLeaf() {
            return left == null && right == null;
        }
    }

    public static Node buildHuffmanTree(char[] chars, int[] freqs) {
        PriorityQueue<Node> pq = new PriorityQueue<>();
        for (int i = 0; i < chars.length; i++) {
            pq.offer(new Node(chars[i], freqs[i]));
        }

        while (pq.size() > 1) {
            Node left = pq.poll();
            Node right = pq.poll();
            Node parent = new Node(left.freq + right.freq, left, right);
            pq.offer(parent);
        }

        return pq.poll();
    }

    public static Map<Character, String> buildCodeTable(Node root) {
        Map<Character, String> codes = new HashMap<>();
        buildCodeTableRec(root, "", codes);
        return codes;
    }

    private static void buildCodeTableRec(Node node, String code,
            Map<Character, String> codes) {
        if (node == null) return;
        if (node.isLeaf()) {
            codes.put(node.ch, code.isEmpty() ? "0" : code);
            return;
        }
        buildCodeTableRec(node.left, code + "0", codes);
        buildCodeTableRec(node.right, code + "1", codes);
    }

    public static String encode(String text, Map<Character, String> codes) {
        StringBuilder sb = new StringBuilder();
        for (char c : text.toCharArray()) {
            sb.append(codes.get(c));
        }
        return sb.toString();
    }

    public static String decode(String encoded, Node root) {
        StringBuilder sb = new StringBuilder();
        Node current = root;
        for (char bit : encoded.toCharArray()) {
            current = (bit == '0') ? current.left : current.right;
            if (current.isLeaf()) {
                sb.append(current.ch);
                current = root;
            }
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        char[] chars = {'a', 'b', 'c', 'd', 'e', 'f'};
        int[] freqs = {5, 9, 12, 13, 16, 45};

        Node root = buildHuffmanTree(chars, freqs);
        Map<Character, String> codes = buildCodeTable(root);

        System.out.println("Huffman Codes:");
        for (var entry : codes.entrySet()) {
            System.out.printf("  %c: %s%n", entry.getKey(), entry.getValue());
        }

        String text = "abcdef";
        String encoded = encode(text, codes);
        String decoded = decode(encoded, root);
        System.out.println("Encoded: " + encoded);
        System.out.println("Decoded: " + decoded);
    }
}
```

**Time:** $O(n \log n)$ for $n$ characters. **Space:** $O(n)$.

**Why greedy works:** Merging the two lowest-frequency nodes first means they end up deepest in the tree (longest codes). Since they are the least frequent, this minimizes the weighted path length (total bits). This can be proven by an exchange argument.

---

## Fractional Knapsack

**Problem:** Given $n$ items with weights $w[i]$ and values $v[i]$, and a knapsack of capacity $W$, maximize value. Unlike 0/1 knapsack, you can take fractions of items.

**Greedy strategy:** Sort items by value-to-weight ratio $v[i]/w[i]$ in decreasing order. Take as much as possible of the highest-ratio item, then the next, and so on.

```java
public static double fractionalKnapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    Integer[] indices = new Integer[n];
    for (int i = 0; i < n; i++) indices[i] = i;

    // Sort by value/weight ratio descending
    Arrays.sort(indices, (a, b) ->
        Double.compare((double) values[b] / weights[b],
                       (double) values[a] / weights[a]));

    double totalValue = 0;
    int remaining = capacity;

    for (int idx : indices) {
        if (remaining <= 0) break;

        if (weights[idx] <= remaining) {
            // Take entire item
            totalValue += values[idx];
            remaining -= weights[idx];
        } else {
            // Take fraction
            totalValue += (double) values[idx] * remaining / weights[idx];
            remaining = 0;
        }
    }
    return totalValue;
}
```

**Time:** $O(n \log n)$. **Space:** $O(n)$ for sorting.

**Why greedy works here but not for 0/1 knapsack:** Fractional knapsack allows splitting items, so taking the highest-ratio item always maximizes value per unit weight. In 0/1 knapsack, taking a high-ratio item may leave wasted capacity that a different combination would fill better.

---

## Minimum Spanning Tree (Introduction)

A **minimum spanning tree (MST)** of a weighted, connected, undirected graph is a spanning tree with the minimum total edge weight. MST algorithms are greedy and are covered in depth in Module 08 (Graph Algorithms). Here is a brief preview:

### Kruskal's Algorithm

**Greedy choice:** Always add the cheapest edge that doesn't create a cycle.

```java
public static int kruskal(int n, int[][] edges) {
    // edges[i] = {u, v, weight}
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);

    int[] parent = new int[n];
    int[] rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;

    int mstWeight = 0;
    int edgesUsed = 0;

    for (int[] edge : edges) {
        if (edgesUsed == n - 1) break;
        int u = find(parent, edge[0]);
        int v = find(parent, edge[1]);
        if (u != v) {
            union(parent, rank, u, v);
            mstWeight += edge[2];
            edgesUsed++;
        }
    }
    return mstWeight;
}

private static int find(int[] parent, int x) {
    if (parent[x] != x) parent[x] = find(parent, parent[x]);
    return parent[x];
}

private static void union(int[] parent, int[] rank, int x, int y) {
    if (rank[x] < rank[y]) { int t = x; x = y; y = t; }
    parent[y] = x;
    if (rank[x] == rank[y]) rank[x]++;
}
```

### Prim's Algorithm

**Greedy choice:** Always add the cheapest edge connecting the MST to a non-MST vertex.

Both algorithms are proven correct by the **cut property:** for any cut of the graph, the minimum-weight edge crossing the cut is in some MST.

---

## Job Scheduling

### Minimizing Total Completion Time

**Problem:** Given $n$ jobs with processing times $p[i]$, schedule them on a single machine to minimize total completion time (sum of completion times).

**Greedy:** Sort by processing time (Shortest Job First / SJF).

```java
public static int minimizeTotalCompletion(int[] processingTimes) {
    Arrays.sort(processingTimes);
    int totalCompletion = 0;
    int currentTime = 0;
    for (int p : processingTimes) {
        currentTime += p;
        totalCompletion += currentTime;
    }
    return totalCompletion;
}
```

### Minimizing Maximum Lateness

**Problem:** Given jobs with processing times $p[i]$ and deadlines $d[i]$, schedule to minimize the maximum lateness $\max_i(\text{completion}_i - d_i)$.

**Greedy:** Sort by deadline (Earliest Deadline First / EDF).

```java
public static int minimizeMaxLateness(int[] processing, int[] deadlines) {
    int n = processing.length;
    Integer[] indices = new Integer[n];
    for (int i = 0; i < n; i++) indices[i] = i;
    Arrays.sort(indices, (a, b) -> deadlines[a] - deadlines[b]);

    int maxLateness = 0;
    int currentTime = 0;
    for (int idx : indices) {
        currentTime += processing[idx];
        int lateness = currentTime - deadlines[idx];
        maxLateness = Math.max(maxLateness, lateness);
    }
    return maxLateness;
}
```

---

## Greedy vs. Dynamic Programming: Detailed Comparison

| Aspect | Greedy | DP |
|--------|--------|----|
| Strategy | Local optimum at each step | Consider all options, pick best |
| Backtracking | Never | Implicitly (via memoization) |
| Proof of correctness | Exchange argument / greedy stays ahead | Induction on subproblem structure |
| Efficiency | Usually $O(n)$ or $O(n \log n)$ | Usually $O(n^2)$, $O(nW)$, etc. |
| Applicability | Limited (needs greedy choice property) | General (any optimal substructure + overlap) |

### Example: Coin Change

With US denominations $\{1, 5, 10, 25\}$, greedy works:
- For 36 cents: 25 + 10 + 1 = 3 coins (optimal).

With arbitrary denominations, greedy fails:
- Coins $\{1, 3, 4\}$, amount 6: Greedy gives $4 + 1 + 1 = 3$ coins, but optimal is $3 + 3 = 2$ coins.

**Rule:** If greedy seems to work, try to prove it (exchange argument). If you can't prove it, use DP.

---

## More Greedy Examples

### Interval Partitioning (Minimum Rooms)

**Problem:** Given $n$ lectures with start/end times, find the minimum number of rooms needed.

```java
public static int minRooms(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n];
    int[] ends = new int[n];
    for (int i = 0; i < n; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }
    Arrays.sort(starts);
    Arrays.sort(ends);

    int rooms = 0, maxRooms = 0;
    int i = 0, j = 0;
    while (i < n) {
        if (starts[i] < ends[j]) {
            rooms++;
            i++;
        } else {
            rooms--;
            j++;
        }
        maxRooms = Math.max(maxRooms, rooms);
    }
    return maxRooms;
}
```

### Assign Cookies

**Problem:** Given children with greed factors $g[i]$ and cookies with sizes $s[j]$, assign each cookie to at most one child (a child is satisfied if $s[j] \geq g[i]$). Maximize the number of satisfied children.

```java
public static int assignCookies(int[] children, int[] cookies) {
    Arrays.sort(children);
    Arrays.sort(cookies);

    int child = 0, cookie = 0;
    while (child < children.length && cookie < cookies.length) {
        if (cookies[cookie] >= children[child]) {
            child++; // this child is satisfied
        }
        cookie++; // move to next cookie either way
    }
    return child;
}
```

**Greedy strategy:** Sort both arrays. Try to satisfy the least greedy child with the smallest sufficient cookie.

---

## Proving Greedy Algorithms Correct

### The Exchange Argument

1. Assume there exists an optimal solution $O^*$ that differs from the greedy solution $G$.
2. Find the first point where they differ.
3. Show that modifying $O^*$ to match $G$ at that point does not worsen the solution.
4. Repeat until $O^*$ matches $G$, proving $G$ is also optimal.

### The "Greedy Stays Ahead" Argument

Show that after each step, the greedy solution is at least as good as any other solution at the same step. Since this holds at every step, it holds at the final step.

---

## Quiz

**Q1.** What are the two properties required for a greedy algorithm to produce an optimal solution?

**A1.** (1) **Greedy choice property:** A locally optimal choice is consistent with a globally optimal solution. (2) **Optimal substructure:** After making a greedy choice, the remaining problem is a smaller instance of the same type.

---

**Q2.** In the activity selection problem, why does selecting the activity with the earliest finish time work, but selecting the one with the earliest start time does not?

**A2.** Earliest finish time leaves the maximum remaining time for other activities, which is key to maximizing the count. Earliest start time might select a very long activity that blocks many shorter ones. For example, activities {(0,100), (1,2), (3,4)}: earliest start picks (0,100) and gets 1 activity, but earliest finish picks (1,2) and (3,4) for 2 activities.

---

**Q3.** Why does the greedy approach work for fractional knapsack but NOT for 0/1 knapsack?

**A3.** Fractional knapsack allows taking any fraction of an item, so the highest value-per-weight item always contributes maximum value per unit capacity, with no "wasted" space. In 0/1 knapsack, taking a high-ratio item may leave a capacity remainder that cannot be optimally filled, making it necessary to explore combinations (which is what DP does).

---

**Q4.** What is the time complexity of building a Huffman tree for $n$ characters?

**A4.** $O(n \log n)$. Inserting $n$ nodes into the priority queue takes $O(n \log n)$. The main loop runs $n - 1$ times, each iteration extracting two nodes and inserting one ($O(\log n)$ per operation), for another $O(n \log n)$ total.

---

**Q5.** Given coins {1, 5, 10, 25}, use the greedy algorithm to make change for 67 cents. How many coins are used? Is this optimal?

**A5.** Greedy: 25 + 25 + 10 + 5 + 1 + 1 = 6 coins (two 25s, one 10, one 5, two 1s). Yes, this is optimal for US denominations, where the greedy algorithm always produces the minimum number of coins.

---

**Q6.** Describe the exchange argument for proving the activity selection greedy algorithm is correct.

**A6.** Let $O^*$ be an optimal solution and $G$ be the greedy solution. If the first activity in $O^*$ is not the earliest-finishing activity $a_1$, replace it with $a_1$. Since $a_1$ finishes no later than the replaced activity, all other activities in $O^*$ are still compatible. The modified $O^*$ has the same size and now agrees with $G$ on the first choice. Repeating this argument for subsequent choices shows $G$ is optimal.

---

**Q7.** You need to minimize the maximum lateness of $n$ jobs on a single machine. Each job has a processing time and a deadline. What greedy strategy do you use?

**A7.** Sort jobs by deadline (Earliest Deadline First). Process them in that order. This minimizes the maximum lateness because delaying a job with an earlier deadline in favor of one with a later deadline can only increase the maximum lateness (provable by exchange argument).

---

**Q8.** A problem asks: "Find the minimum number of coins to make amount $n$ using denominations {1, 3, 4}." Should you use greedy or DP? Justify your answer.

**A8.** Use DP. Greedy fails for these denominations. For $n = 6$: greedy picks $4 + 1 + 1 = 3$ coins, but optimal is $3 + 3 = 2$ coins. The greedy choice property does not hold for arbitrary coin denominations. DP considers all possibilities and guarantees the optimal answer.
