---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 14: Network Flows

**Why this matters:** Network flow models an astonishing range of problems -- transportation, bandwidth, bipartite matching, image segmentation, baseball elimination. The Max-Flow Min-Cut Theorem is a foundational result in optimization.

---

# Real-World Motivation

**Water pipes:** A network connects a reservoir to a city. Each pipe has a max throughput. What is the maximum water delivery rate?

Replace water with:
- **Internet traffic** => bandwidth optimization
- **Cars** => highway congestion analysis
- **Goods** => shipping logistics

Same math solves all of them.

---

# Flow Networks: Definitions

A **flow network** G = (V, E) with:
- **Capacity** c(u,v) >= 0 on each edge
- **Source** s (flow originates)
- **Sink** t (flow terminates)

A **flow** f must satisfy:
1. **Capacity constraint:** 0 <= f(u,v) <= c(u,v)
2. **Flow conservation:** At every non-source/sink vertex, flow in = flow out

**Value |f|** = total net flow leaving source = total entering sink.

---

# Residual Graphs

Given flow f, the **residual graph** G_f has:
- **Forward edges:** unused capacity c(u,v) - f(u,v)
- **Backward edges:** flow that can be "undone" f(u,v)

**Backward edges are crucial:** They allow the algorithm to correct earlier suboptimal decisions by rerouting flow.

An **augmenting path** = path from s to t in G_f.
**Bottleneck** = minimum residual capacity along the path.

---

# Ford-Fulkerson Method

```
Initialize f = 0 on all edges
While augmenting path p exists in G_f:
    bottleneck = min residual capacity on p
    For each edge on p:
        Forward edge: f(u,v) += bottleneck
        Backward edge: f(v,u) -= bottleneck
Return f
```

Terminates when no augmenting path exists.
**Correctness:** Max-Flow Min-Cut Theorem guarantees this is optimal.

**Time:** O(E * |f*|) -- can be slow with large capacities.

---

# Edmonds-Karp Algorithm

Ford-Fulkerson + **BFS for shortest augmenting path**.

```java
while (true) {
    // BFS to find shortest path s->t in G_f
    if (no path) break;
    // Find bottleneck along path
    // Update flow along path
    totalFlow += bottleneck;
}
```

**Time:** O(V * E^2) -- strongly polynomial, independent of capacities.

**Why:** Shortest-path distance from s to v never decreases. Each edge is critical at most O(V) times. Total augmentations: O(VE).

---

# Max-Flow Min-Cut Theorem

**An s-t cut** (S, T) partitions vertices: s in S, t in T.
**Capacity** of cut = sum of edge capacities from S to T.

**Theorem:** max flow = min cut capacity.

Three equivalent conditions:
1. f is a maximum flow
2. No augmenting path exists in G_f
3. |f| = capacity of some s-t cut

**Finding min cut:** After max flow, BFS from s in G_f. Reachable = S, unreachable = T. Cut edges: S to T in original graph.

---

# Application: Bipartite Matching

**Problem:** Maximum matching in a bipartite graph.

**Reduction:**
1. Source s -> each left vertex (capacity 1)
2. Each right vertex -> sink t (capacity 1)
3. Bipartite edges with capacity 1

**Max flow = max matching size.**

```java
for (int i = 1; i <= L; i++) addEdge(s, i, 1);
for (int j = 1; j <= R; j++) addEdge(L+j, t, 1);
for (int[] e : edges) addEdge(e[0], L+e[1], 1);
```

**Time:** O(VE) with Edmonds-Karp, O(E * sqrt(V)) with Dinic's.

---

# Application: Edge-Disjoint Paths

**Problem:** Maximum number of edge-disjoint paths from s to t.

**Reduction:** Set all edge capacities to 1. Max flow = number of edge-disjoint paths.

**Vertex-disjoint paths:** Split each vertex v into v_in and v_out connected by capacity-1 edge. Redirect incoming edges to v_in, outgoing from v_out.

---

# Application: Project Selection

**Problem:** Projects with profits (positive or negative) and prerequisites. Maximize total profit.

**Reduction to min cut:**
- s -> positive-profit projects (capacity = profit)
- Negative-profit projects -> t (capacity = |cost|)
- Prerequisite edges with capacity infinity

**Optimal profit = sum of positive profits - min cut value.**

---

# Dinic's Algorithm

Faster than Edmonds-Karp. Uses **level graphs** and **blocking flows**.

1. BFS to build level graph (edges only go to next level)
2. Find blocking flow using DFS with current-arc optimization
3. Repeat until no path exists

**Time:** O(V^2 * E)
**Unit capacity:** O(E * sqrt(V)) -- matches Hopcroft-Karp!

```java
while (bfs(s, t)) {          // build level graph
    iter = new int[V];        // reset current arcs
    while ((pushed = dfs(s, t, INF)) > 0)
        totalFlow += pushed;  // find blocking flows
}
```

---

# Dinic's: Key Implementation Trick

Forward edge i and reverse edge i+1 stored consecutively:

```java
void addEdge(int from, int to, int cap) {
    edges[numEdges] = {from, to, cap, 0}; // forward
    graph.get(from).add(numEdges++);
    edges[numEdges] = {to, from, 0, 0};   // reverse
    graph.get(to).add(numEdges++);
}
// Access reverse of edge i: edges[i ^ 1]
```

`eid ^ 1` flips between forward and reverse. Standard CP technique.

---

# Min-Cost Max-Flow

Each edge has capacity AND cost per unit. Find max flow with minimum total cost.

**Approach:** Replace BFS with shortest path (Bellman-Ford):
1. Find min-cost augmenting path using Bellman-Ford
2. Augment flow along this path
3. Repeat

**Applications:**
- Weighted bipartite matching (min-cost assignment)
- Transportation problems
- Minimum-weight perfect matching

---

# Complexity Summary

| Algorithm | Time | Notes |
|-----------|------|-------|
| Ford-Fulkerson (DFS) | O(E * \|f*\|) | Depends on max flow value |
| Edmonds-Karp (BFS) | O(V * E^2) | Strongly polynomial |
| Dinic's | O(V^2 * E) | Standard choice for CP |
| Dinic's (unit cap) | O(E * sqrt(V)) | Bipartite matching |
| Min-Cost Max-Flow | O(V * E * \|f*\|) | With Bellman-Ford |

---

# Practical Modeling Tips

1. **Undirected edges:** Add two directed edges, each with capacity c
2. **Multiple sources/sinks:** Add super-source/super-sink
3. **Vertex capacities:** Split vertex into v_in and v_out
4. **Lower bounds on flow:** Transform to standard max-flow (advanced)
5. **Integer capacities => integer flows** (important for matching)

**The hardest part is building the correct graph.** Draw it before coding.

---

# Application: Baseball Elimination

Can team X still win the league?

**Reduction:** For each pair of other teams (i,j) with g_ij games remaining:
- Source -> game_ij node (capacity g_ij)
- game_ij -> team_i and team_j (capacity infinity)
- team_i -> sink (capacity = X's best case wins - team_i's wins)

**X eliminated iff max flow < total remaining games.**

---

# Quiz

1. **What two constraints must a valid flow satisfy?**
2. **What is a residual graph and why are backward edges important?**
3. **State the Max-Flow Min-Cut Theorem.**
4. **How to reduce bipartite matching to max flow?**

---

# Quiz Answers

1. **Capacity constraint:** 0 <= f(u,v) <= c(u,v). **Flow conservation:** At non-source/sink vertices, total in = total out.

2. Residual graph shows remaining adjustment capacity. Forward edges: unused capacity. **Backward edges** allow rerouting flow -- correcting suboptimal earlier choices.

3. **Max flow value = min cut capacity.** Equivalently: f is max flow iff no augmenting path exists iff |f| equals some cut's capacity.

4. Source -> left vertices (cap 1), right vertices -> sink (cap 1), bipartite edges (cap 1). Max flow = max matching.
