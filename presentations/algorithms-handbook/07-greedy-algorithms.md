---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 07: Greedy Algorithms

**Why this matters:** Greedy algorithms are simple, fast, and elegant. When they work, they beat DP on both simplicity and speed. The challenge is knowing WHEN they work.

---

# Real-World Motivation

**Making change:** For 67 cents with US coins {25, 10, 5, 1}, you instinctively pick the largest coin first: 25+25+10+5+1+1 = 6 coins.

That instinct IS the greedy approach: always pick what looks best right now, never reconsider.

**But:** With coins {1, 3, 4} and amount 6: greedy gives 4+1+1=3 coins. Optimal is 3+3=**2 coins**. Greedy fails!

---

# Two Key Properties

**1. Greedy Choice Property:**
Making the locally optimal choice leads to a globally optimal solution.

**2. Optimal Substructure:**
After making a greedy choice, the remaining problem is a smaller instance of the same type.

**Proof technique: Exchange Argument**
- Take any optimal solution that differs from greedy
- Show you can swap in the greedy choice without making it worse

---

# Activity Selection

**Problem:** Max non-overlapping activities.
**Greedy:** Always pick the activity that **finishes earliest**.

```java
Arrays.sort(activities, (a, b) -> a[1] - b[1]);
int lastFinish = -1;
for (int[] act : activities) {
    if (act[0] >= lastFinish) {
        selected.add(act);
        lastFinish = act[1];
    }
}
```

**Time:** O(n log n) | **Space:** O(1)

**Why it works:** Earliest finish leaves most room for remaining activities.

---

# Activity Selection: Common Mistakes

**Earliest START time:** Does NOT work.
- Activities: {(0,100), (1,2), (3,4)}
- Earliest start picks (0,100) => 1 activity
- Earliest finish picks (1,2), (3,4) => **2 activities**

**Shortest duration:** Does NOT work either.
- Short activities can overlap in problematic ways.

**Only earliest FINISH time is correct** (provable by exchange argument).

---

# Huffman Coding

**Problem:** Construct prefix-free binary code minimizing total encoding length.

**Greedy:** Repeatedly merge two lowest-frequency nodes.

```java
PriorityQueue<Node> pq = new PriorityQueue<>();
// Insert all characters with frequencies
while (pq.size() > 1) {
    Node left = pq.poll();
    Node right = pq.poll();
    pq.offer(new Node(left.freq + right.freq,
                       left, right));
}
```

**Time:** O(n log n) | **Space:** O(n)

Low-frequency chars get longest codes (deepest in tree).

---

# Fractional Knapsack

**Problem:** Maximize value with capacity W. Can take fractions!

**Greedy:** Sort by value/weight ratio descending. Take greedily.

```java
Arrays.sort(items, by value/weight ratio DESC);
for (Item item : items) {
    if (remaining >= item.weight)
        take entire item;
    else
        take fraction: remaining / item.weight;
}
```

**Time:** O(n log n)

**Works here but NOT for 0/1 knapsack** (can't take fractions => may leave wasted capacity).

---

# Minimum Spanning Tree (Preview)

**Kruskal's:** Sort edges by weight, greedily add cheapest non-cycle-forming edge.
**Prim's:** Grow MST by always adding cheapest edge to a non-MST vertex.

Both proven correct by the **cut property:** for any cut, the minimum-weight crossing edge is in some MST.

| Algorithm | Best For | Data Structure | Time |
|-----------|----------|---------------|------|
| Kruskal | Sparse graphs | Union-Find | O(E log E) |
| Prim | Dense graphs | Priority Queue | O((V+E) log V) |

---

# Job Scheduling

**Minimize total completion time:** Sort by processing time (Shortest Job First).

**Minimize maximum lateness:** Sort by deadline (Earliest Deadline First).

```java
// Earliest Deadline First
Arrays.sort(jobs, by deadline);
int maxLateness = 0, time = 0;
for (Job j : jobs) {
    time += j.processing;
    maxLateness = max(maxLateness, time - j.deadline);
}
```

---

# Interval Partitioning (Min Rooms)

**Problem:** Given n lectures with start/end times, find minimum rooms needed.

```java
int[] starts = sortedStarts;
int[] ends = sortedEnds;
int rooms = 0, maxRooms = 0, i = 0, j = 0;
while (i < n) {
    if (starts[i] < ends[j]) {
        rooms++; i++;
    } else {
        rooms--; j++;
    }
    maxRooms = max(maxRooms, rooms);
}
```

**Time:** O(n log n)

---

# Greedy vs Dynamic Programming

| Aspect | Greedy | DP |
|--------|--------|----|
| Strategy | Local optimum | All options |
| Backtracking | Never | Implicitly |
| Correctness | Exchange argument | Induction |
| Efficiency | O(n) or O(n log n) | O(n^2), O(nW), etc. |
| Applicability | Limited | General |

**Rule:** If greedy seems to work, try to prove it. If you can't prove it, use DP.

---

# Proving Greedy Correct

**Exchange Argument:**
1. Assume optimal solution O* differs from greedy G
2. Find first point of difference
3. Show modifying O* to match G doesn't worsen it
4. Repeat until O* = G

**Greedy Stays Ahead:**
Show that after each step, greedy is at least as good as any other solution.

---

# Quiz

1. **What two properties are required for greedy to be optimal?**
2. **Why does greedy work for fractional but NOT 0/1 knapsack?**
3. **Coins {1, 3, 4}, amount 6: greedy vs optimal?**
4. **Time complexity of building a Huffman tree for n characters?**

---

# Quiz Answers

1. **Greedy choice property** + **Optimal substructure**

2. Fractional: highest ratio always maximizes value per unit, no wasted capacity. 0/1: taking a high-ratio item may leave capacity that a different combo fills better.

3. Greedy: 4+1+1 = **3 coins**. Optimal: 3+3 = **2 coins**. Greedy fails!

4. **O(n log n)** -- n insertions O(n log n), plus n-1 iterations each with 2 extracts + 1 insert O(log n) each.
