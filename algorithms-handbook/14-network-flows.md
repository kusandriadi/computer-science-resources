# Module 14: Network Flows

## Introduction

Network flow is one of the most powerful and elegant frameworks in combinatorial optimization. The core question is deceptively simple: given a directed graph where each edge has a capacity, how much "flow" can be pushed from a source vertex to a sink vertex without exceeding any edge's capacity?

This simple abstraction models an extraordinary range of real-world problems: transportation logistics, communication bandwidth, bipartite matching, project scheduling, image segmentation, baseball elimination, and many more. The deep connection between maximum flows and minimum cuts (the Max-Flow Min-Cut Theorem) is one of the most important results in theoretical computer science and operations research.

This module covers the theoretical foundations of network flow, the classical Ford-Fulkerson method and its Edmonds-Karp variant, the Max-Flow Min-Cut Theorem with proof, Dinic's algorithm for improved performance, and a survey of applications that demonstrate why network flow is an indispensable tool for any serious algorithm designer.

**References:** CLRS Chapter 26, Jeff Erickson Chapters 10--11, Sedgewick *Algorithms* (4th edition, Chapter 6).

---

## Flow Networks

A **flow network** is a directed graph $G = (V, E)$ with the following properties:

1. **Capacity function:** Each edge $(u, v) \in E$ has a non-negative capacity $c(u, v) \geq 0$. If $(u, v) \notin E$, then $c(u, v) = 0$.
2. **Source:** A distinguished vertex $s \in V$ with no incoming edges (or at least, net flow leaves $s$).
3. **Sink:** A distinguished vertex $t \in V$ with no outgoing edges (or at least, net flow enters $t$).

A **flow** in $G$ is a function $f: V \times V \to \mathbb{R}$ satisfying:

### Capacity Constraint

For all $u, v \in V$:

$$0 \leq f(u, v) \leq c(u, v)$$

The flow on an edge cannot exceed its capacity, and flow is non-negative.

### Flow Conservation

For all $u \in V \setminus \{s, t\}$:

$$\sum_{v \in V} f(v, u) = \sum_{v \in V} f(u, v)$$

At every vertex except the source and sink, the total incoming flow equals the total outgoing flow. What flows in must flow out -- nothing is created or destroyed at intermediate vertices.

### Value of a Flow

The **value** of a flow $f$, denoted $|f|$, is the total net flow leaving the source:

$$|f| = \sum_{v \in V} f(s, v) - \sum_{v \in V} f(v, s)$$

By flow conservation, this equals the total net flow entering the sink.

### Example

Consider a simple flow network with vertices $\{s, a, b, t\}$ and edges:

```
s --[10]--> a --[8]--> t
s --[5]---> b --[7]--> t
a --[3]---> b
```

One valid flow: $f(s,a)=8$, $f(s,b)=5$, $f(a,t)=5$, $f(a,b)=3$, $f(b,t)=7$ (value is 8 + 5 = 13, which also equals 5 + 7 = 12 -- we need to be careful to check conservation). Let us verify: at vertex $a$, inflow is 8, outflow is 5 + 3 = 8. At vertex $b$, inflow is 5 + 3 = 8, but outflow capacity is only 7. So the maximum is constrained. A valid flow might be $f(s,a)=8$, $f(s,b)=4$, $f(a,t)=5$, $f(a,b)=3$, $f(b,t)=7$: inflow at $a$ = 8, outflow at $a$ = 8; inflow at $b$ = 4 + 3 = 7, outflow at $b$ = 7. Flow value = 8 + 4 = 12.

The **maximum flow problem** asks: what is the largest possible value $|f|$ over all valid flows?

---

## Residual Graphs and Augmenting Paths

The key insight behind all max-flow algorithms is the concept of the **residual graph**.

### Residual Graph

Given a flow network $G$ and a flow $f$, the **residual graph** $G_f$ is defined on the same vertex set $V$ with edges:

- **Forward edge** $(u, v)$ with residual capacity $c_f(u, v) = c(u, v) - f(u, v)$, if $c(u, v) - f(u, v) > 0$. This represents unused capacity.
- **Backward edge** $(v, u)$ with residual capacity $c_f(v, u) = f(u, v)$, if $f(u, v) > 0$. This represents the ability to "undo" flow already sent.

Backward edges are crucial: they allow the algorithm to correct earlier mistakes by rerouting flow.

### Augmenting Path

An **augmenting path** is a simple path from $s$ to $t$ in the residual graph $G_f$. The **bottleneck capacity** of an augmenting path is the minimum residual capacity along the path:

$$\text{bottleneck}(p) = \min_{(u,v) \in p} c_f(u, v)$$

We can increase the flow value by the bottleneck amount by sending flow along this path. For forward edges on the path, we increase flow; for backward edges, we decrease flow on the original edge.

---

## Ford-Fulkerson Method

The Ford-Fulkerson method is a general algorithmic framework for computing maximum flow. It is a "method" rather than an "algorithm" because it does not specify how to find augmenting paths.

### Algorithm

```
FORD-FULKERSON(G, s, t):
    Initialize f(u,v) = 0 for all (u,v)
    While there exists an augmenting path p from s to t in G_f:
        bottleneck = min residual capacity along p
        For each edge (u,v) in p:
            If (u,v) is a forward edge:
                f(u,v) += bottleneck
            Else:  // (u,v) is a backward edge
                f(v,u) -= bottleneck
    Return f
```

### Correctness

The method terminates when no augmenting path exists in the residual graph. The Max-Flow Min-Cut Theorem (proved below) guarantees that when no augmenting path exists, the current flow is a maximum flow.

### Complexity Concerns

If augmenting paths are chosen arbitrarily and capacities are irrational, Ford-Fulkerson may not terminate. With integer capacities, each iteration increases the flow by at least 1, so the method terminates in at most $|f^*|$ iterations (where $f^*$ is the max flow value). Each iteration involves a graph traversal ($O(E)$), giving $O(E \cdot |f^*|)$ total time. This can be very slow if $|f^*|$ is large.

The solution: choose augmenting paths carefully.

---

## Edmonds-Karp Algorithm (BFS-Based Ford-Fulkerson)

The **Edmonds-Karp algorithm** is the Ford-Fulkerson method with one crucial refinement: always choose the **shortest augmenting path** (fewest edges), found via BFS.

This simple change guarantees $O(VE^2)$ time regardless of capacities.

### Why $O(VE^2)$?

**Key lemma:** In the Edmonds-Karp algorithm, the shortest-path distance from $s$ to any vertex $v$ in the residual graph is monotonically non-decreasing over successive augmentations.

**Consequence:** Each edge can be "critical" (the bottleneck on an augmenting path) at most $O(V)$ times. Since there are $O(E)$ edges, the total number of augmenting paths is $O(VE)$. Each BFS takes $O(E)$ time. Total: $O(VE^2)$.

This is a strongly polynomial bound -- it depends only on the graph structure, not on the capacity values.

### Full Java Implementation

```java
import java.util.*;

public class EdmondsKarp {
    private int[][] capacity;
    private int[][] flow;
    private int V;

    public EdmondsKarp(int V) {
        this.V = V;
        capacity = new int[V][V];
        flow = new int[V][V];
    }

    public void addEdge(int u, int v, int cap) {
        capacity[u][v] += cap; // += handles multiple edges between same pair
    }

    /**
     * Computes maximum flow from source s to sink t.
     * Returns the value of the maximum flow.
     */
    public int maxFlow(int s, int t) {
        int totalFlow = 0;

        while (true) {
            // BFS to find shortest augmenting path
            int[] parent = new int[V];
            Arrays.fill(parent, -1);
            parent[s] = s;

            Queue<Integer> queue = new LinkedList<>();
            queue.offer(s);

            while (!queue.isEmpty() && parent[t] == -1) {
                int u = queue.poll();
                for (int v = 0; v < V; v++) {
                    if (parent[v] == -1 && residualCapacity(u, v) > 0) {
                        parent[v] = u;
                        queue.offer(v);
                    }
                }
            }

            // No augmenting path found -- we have max flow
            if (parent[t] == -1) break;

            // Find bottleneck capacity along the path
            int bottleneck = Integer.MAX_VALUE;
            int v = t;
            while (v != s) {
                int u = parent[v];
                bottleneck = Math.min(bottleneck, residualCapacity(u, v));
                v = u;
            }

            // Update flow along the path
            v = t;
            while (v != s) {
                int u = parent[v];
                flow[u][v] += bottleneck;
                flow[v][u] -= bottleneck;
                v = u;
            }

            totalFlow += bottleneck;
        }

        return totalFlow;
    }

    private int residualCapacity(int u, int v) {
        return capacity[u][v] - flow[u][v];
    }

    // Utility: find which vertices are reachable from s in the residual graph
    // after max flow has been computed. Used to identify the min cut.
    public boolean[] minCutReachable(int s) {
        boolean[] visited = new boolean[V];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(s);
        visited[s] = true;

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v = 0; v < V; v++) {
                if (!visited[v] && residualCapacity(u, v) > 0) {
                    visited[v] = true;
                    queue.offer(v);
                }
            }
        }
        return visited;
    }

    public static void main(String[] args) {
        EdmondsKarp ek = new EdmondsKarp(6);

        // Example graph (vertices: 0=s, 5=t)
        ek.addEdge(0, 1, 16);
        ek.addEdge(0, 2, 13);
        ek.addEdge(1, 2, 4);
        ek.addEdge(1, 3, 12);
        ek.addEdge(2, 1, 10);
        ek.addEdge(2, 4, 14);
        ek.addEdge(3, 2, 9);
        ek.addEdge(3, 5, 20);
        ek.addEdge(4, 3, 7);
        ek.addEdge(4, 5, 4);

        int maxFlow = ek.maxFlow(0, 5);
        System.out.println("Maximum flow: " + maxFlow); // Expected: 23

        // Find min cut
        boolean[] reachable = ek.minCutReachable(0);
        System.out.println("Min cut edges:");
        for (int u = 0; u < 6; u++) {
            for (int v = 0; v < 6; v++) {
                if (reachable[u] && !reachable[v] && ek.capacity[u][v] > 0) {
                    System.out.println("  " + u + " -> " + v
                        + " (capacity " + ek.capacity[u][v] + ")");
                }
            }
        }
    }
}
```

**Time complexity:** $O(VE^2)$. Each BFS is $O(V + E) = O(E)$ (since the graph is connected). At most $O(VE)$ augmentations are performed.

**Space complexity:** $O(V^2)$ for the capacity and flow matrices. For sparse graphs, an adjacency list representation reduces this to $O(V + E)$.

### Adjacency List Variant

For sparse graphs, the adjacency matrix representation wastes space. Here is a more memory-efficient implementation using adjacency lists:

```java
import java.util.*;

public class EdmondsKarpAdjList {
    private int V;
    private List<List<Integer>> adj;
    private int[] capacity; // edge capacities stored in flat array
    private int[] flow;     // edge flows stored in flat array
    private int[] to;       // destination of each edge
    private int edgeCount;
    private int[] head;     // head[u] = index of first edge from u in linked list
    private int[] next;     // next edge in adjacency list

    // Simpler alternative: use a list of edge objects
    static final int MAXE = 200000;

    private int[][] edges; // edges[i] = {from, to, cap, flow}
    private List<List<Integer>> graph;
    private int numEdges;

    public EdmondsKarpAdjList(int V) {
        this.V = V;
        this.numEdges = 0;
        graph = new ArrayList<>();
        for (int i = 0; i < V; i++) graph.add(new ArrayList<>());
        edges = new int[MAXE][4]; // {from, to, cap, flow}
    }

    public void addEdge(int from, int to, int cap) {
        // Forward edge
        edges[numEdges] = new int[]{from, to, cap, 0};
        graph.get(from).add(numEdges);
        numEdges++;
        // Reverse edge (capacity 0)
        edges[numEdges] = new int[]{to, from, 0, 0};
        graph.get(to).add(numEdges);
        numEdges++;
    }

    public int maxFlow(int s, int t) {
        int totalFlow = 0;
        while (true) {
            int[] parent = new int[V];
            int[] parentEdge = new int[V];
            Arrays.fill(parent, -1);
            parent[s] = s;

            Queue<Integer> queue = new LinkedList<>();
            queue.offer(s);

            while (!queue.isEmpty() && parent[t] == -1) {
                int u = queue.poll();
                for (int eid : graph.get(u)) {
                    int v = edges[eid][1];
                    int residual = edges[eid][2] - edges[eid][3];
                    if (parent[v] == -1 && residual > 0) {
                        parent[v] = u;
                        parentEdge[v] = eid;
                        queue.offer(v);
                    }
                }
            }

            if (parent[t] == -1) break;

            int bottleneck = Integer.MAX_VALUE;
            int v = t;
            while (v != s) {
                int eid = parentEdge[v];
                bottleneck = Math.min(bottleneck, edges[eid][2] - edges[eid][3]);
                v = parent[v];
            }

            v = t;
            while (v != s) {
                int eid = parentEdge[v];
                edges[eid][3] += bottleneck;
                edges[eid ^ 1][3] -= bottleneck; // reverse edge is eid XOR 1
                v = parent[v];
            }

            totalFlow += bottleneck;
        }
        return totalFlow;
    }
}
```

The key trick is that forward edge $i$ and its reverse edge $i+1$ are stored consecutively, so `eid ^ 1` flips between them. This is the standard competitive programming technique for network flow.

---

## Max-Flow Min-Cut Theorem

The Max-Flow Min-Cut Theorem is one of the foundational results in combinatorial optimization. It connects two seemingly different problems: maximizing flow and minimizing cuts.

### Cuts

An **$s$-$t$ cut** $(S, T)$ is a partition of the vertex set $V$ into two disjoint sets $S$ and $T = V \setminus S$ such that $s \in S$ and $t \in T$.

The **capacity** of a cut $(S, T)$ is:

$$c(S, T) = \sum_{u \in S} \sum_{v \in T} c(u, v)$$

This is the sum of capacities of all edges crossing from $S$ to $T$. Note that edges from $T$ to $S$ are **not** counted.

A **minimum cut** is an $s$-$t$ cut with the smallest capacity.

### Statement of the Theorem

The following three conditions are equivalent:

1. $f$ is a maximum flow in $G$.
2. The residual graph $G_f$ contains no augmenting path from $s$ to $t$.
3. $|f| = c(S, T)$ for some $s$-$t$ cut $(S, T)$.

**Consequence:** The value of the maximum flow equals the capacity of the minimum cut.

$$\max_f |f| = \min_{(S,T)} c(S, T)$$

### Proof Sketch

**(1) implies (2):** If there were an augmenting path, we could increase the flow, contradicting maximality.

**(2) implies (3):** If there is no augmenting path, let $S$ be the set of vertices reachable from $s$ in the residual graph $G_f$, and $T = V \setminus S$. Since $t$ is not reachable, $t \in T$. For every edge $(u, v)$ with $u \in S, v \in T$, we must have $f(u, v) = c(u, v)$ (otherwise $v$ would be reachable, contradicting $v \in T$). For every edge $(v, u)$ with $v \in T, u \in S$, we must have $f(v, u) = 0$ (otherwise the backward edge would make $v$ reachable). Therefore:

$$|f| = \sum_{u \in S, v \in T} f(u, v) - \sum_{v \in T, u \in S} f(v, u) = \sum_{u \in S, v \in T} c(u, v) - 0 = c(S, T)$$

**(3) implies (1):** For any flow $f$ and any cut $(S, T)$, $|f| \leq c(S, T)$ (the flow through the cut cannot exceed its capacity). If $|f| = c(S, T)$, the flow must be maximum (no flow can exceed any cut's capacity).

### Finding the Minimum Cut

After computing max flow with Edmonds-Karp (or any Ford-Fulkerson variant):

1. Perform BFS/DFS from $s$ in the residual graph $G_f$.
2. Let $S$ = set of reachable vertices, $T$ = unreachable vertices.
3. The min-cut edges are all original edges $(u, v)$ with $u \in S$ and $v \in T$.

This is implemented in the `minCutReachable` method in the Java code above.

### Practical Example

Consider a network of pipes between a water source ($s$) and a city ($t$). Each pipe has a maximum throughput (capacity). The max flow tells you the maximum water delivery rate. The min cut identifies the bottleneck -- the cheapest set of pipes whose removal would disconnect the supply entirely. Upgrading these pipes gives the best return on investment.

---

## Applications of Network Flow

Network flow is remarkable for the diversity of problems it solves. The key skill is recognizing when a problem can be modeled as a flow network.

### 1. Bipartite Matching

**Problem:** Given a bipartite graph with left vertices $L$ and right vertices $R$, find the maximum matching -- the largest set of edges with no shared endpoints.

**Reduction to max flow:**

1. Create a source $s$ and sink $t$.
2. Add edge $(s, u)$ with capacity 1 for each $u \in L$.
3. Add edge $(v, t)$ with capacity 1 for each $v \in R$.
4. For each edge $(u, v)$ in the bipartite graph, add edge $(u, v)$ with capacity 1.
5. Maximum flow = maximum matching size.

```java
public static int maxBipartiteMatching(int L, int R, List<int[]> edges) {
    int V = L + R + 2;
    int s = 0, t = V - 1;
    // Left vertices: 1..L, Right vertices: L+1..L+R
    EdmondsKarp ek = new EdmondsKarp(V);

    for (int i = 1; i <= L; i++) ek.addEdge(s, i, 1);
    for (int j = 1; j <= R; j++) ek.addEdge(L + j, t, 1);
    for (int[] e : edges) ek.addEdge(e[0], L + e[1], 1);

    return ek.maxFlow(s, t);
}
```

**Correctness:** The unit capacities from $s$ and to $t$ ensure each left/right vertex is matched at most once. Integer capacities guarantee integer flows, which correspond to matchings.

**Time:** $O(V E)$ using Edmonds-Karp on the bipartite flow network. Specialized algorithms like Hopcroft-Karp achieve $O(E\sqrt{V})$.

**Example:** Assigning $n$ workers to $n$ jobs where each worker is qualified for a subset of jobs. Maximum matching gives the maximum number of workers that can be assigned simultaneously.

### 2. Maximum Edge-Disjoint Paths

**Problem:** Given a directed graph and two vertices $s$ and $t$, find the maximum number of edge-disjoint paths from $s$ to $t$ (paths sharing no edges).

**Reduction:** Assign capacity 1 to every edge. The maximum flow equals the maximum number of edge-disjoint paths.

**Why it works:** Each unit of flow uses a distinct path from $s$ to $t$, and since each edge has capacity 1, no edge is used by more than one path (with integer flow). This is a direct consequence of Menger's theorem.

For **vertex-disjoint paths** (paths sharing no intermediate vertices), split each vertex $v$ (except $s$ and $t$) into $v_{in}$ and $v_{out}$ connected by an edge of capacity 1. Replace each original edge $(u, v)$ with $(u_{out}, v_{in})$.

### 3. Project Selection / Closure Problem

**Problem:** You have $n$ projects. Project $i$ has profit $p_i$ (can be negative -- representing cost). Some projects have prerequisites: if you select project $i$, you must also select project $j$. Find the subset of projects that maximizes total profit.

**Reduction to min cut:**

1. Create source $s$ and sink $t$.
2. For each project $i$ with $p_i > 0$: add edge $(s, i)$ with capacity $p_i$.
3. For each project $i$ with $p_i < 0$: add edge $(i, t)$ with capacity $|p_i|$.
4. For each prerequisite "project $i$ requires project $j$": add edge $(i, j)$ with capacity $\infty$.
5. Optimal profit = $\sum_{p_i > 0} p_i$ - (min cut value).

The min cut partitions projects into selected ($S$ side) and rejected ($T$ side). Cutting an edge from $s$ means forgoing a profitable project. Cutting an edge to $t$ means accepting a costly project. Infinite-capacity prerequisite edges ensure that if you select a project, all its prerequisites are also selected.

### 4. Image Segmentation

In computer vision, an image can be segmented into foreground and background by modeling pixels as vertices in a flow network. Each pixel has a "foreground affinity" (capacity from source) and "background affinity" (capacity to sink). Neighboring pixels that are similar have high-capacity edges between them (penalizing segmentation boundaries between similar pixels). The minimum cut separates foreground from background while minimizing the total penalty.

This is a practical application of min cut that appears in medical imaging, photo editing, and video processing.

### 5. Baseball Elimination

**Problem:** Given the current standings in a baseball league -- wins, losses, and remaining games for each team -- determine whether a given team $x$ has been mathematically eliminated.

**Reduction (from Schwartz, 1966):**

Suppose team $x$ can finish with at most $w_x + r_x$ wins (current wins plus remaining games). For each pair of other teams $(i, j)$ with $g_{ij}$ games remaining against each other:

1. Create a source $s$, a sink $t$, and vertices for each game-pair and each team.
2. Edge $(s, \text{game}_{ij})$ with capacity $g_{ij}$ -- representing the games to be played.
3. Edges from $\text{game}_{ij}$ to team $i$ and team $j$, each with capacity $\infty$ -- one of the two teams must win each game.
4. Edge from team $i$ to $t$ with capacity $w_x + r_x - w_i$ -- team $i$ can win at most this many more games without surpassing $x$'s best case. If $w_x + r_x - w_i < 0$, team $x$ is trivially eliminated.

Team $x$ is eliminated if and only if the max flow is less than the total remaining games (among the other teams). If the flow saturates all edges from $s$, then there exists a valid outcome where no team surpasses $x$. If not, $x$ is eliminated.

---

## Dinic's Algorithm

Dinic's algorithm (also spelled Dinitz) improves upon Edmonds-Karp by using the concept of **blocking flows** in **level graphs**.

### Level Graph

Given the residual graph $G_f$, construct a level graph by assigning each vertex a level equal to its BFS distance from $s$. An edge $(u, v)$ is included in the level graph only if $\text{level}(v) = \text{level}(u) + 1$. The level graph contains only edges that make progress toward $t$.

### Blocking Flow

A flow in the level graph is **blocking** if every path from $s$ to $t$ in the level graph has at least one saturated edge (an edge whose flow equals its capacity). A blocking flow is not necessarily a maximum flow in the level graph -- it just ensures no more flow can be pushed along level-graph paths.

### Algorithm

```
DINIC(G, s, t):
    Initialize f = 0
    While BFS finds a path from s to t in G_f:
        Construct level graph L from G_f
        While there exists a blocking flow g in L:
            f = f + g
            Update G_f
    Return f
```

### Complexity

- **Number of phases:** At most $O(V)$. Each phase increases the shortest path length from $s$ to $t$ in the residual graph by at least 1.
- **Blocking flow computation:** Using DFS with the "current arc" optimization, each blocking flow takes $O(VE)$ time.
- **Total:** $O(V^2 E)$.

**Special cases:**
- For unit-capacity graphs: $O(E\sqrt{V})$.
- For bipartite matching: $O(E\sqrt{V})$ -- matching Hopcroft-Karp.

### Java Implementation

```java
import java.util.*;

public class Dinic {
    private static final int INF = Integer.MAX_VALUE;

    private int V;
    private int[][] edges;   // {from, to, cap, flow}
    private List<List<Integer>> graph;
    private int numEdges;
    private int[] level;     // BFS level
    private int[] iter;      // current arc for DFS

    public Dinic(int V) {
        this.V = V;
        this.numEdges = 0;
        graph = new ArrayList<>();
        for (int i = 0; i < V; i++) graph.add(new ArrayList<>());
        edges = new int[200000][4];
    }

    public void addEdge(int from, int to, int cap) {
        edges[numEdges] = new int[]{from, to, cap, 0};
        graph.get(from).add(numEdges);
        numEdges++;
        edges[numEdges] = new int[]{to, from, 0, 0};
        graph.get(to).add(numEdges);
        numEdges++;
    }

    // BFS to build level graph
    private boolean bfs(int s, int t) {
        level = new int[V];
        Arrays.fill(level, -1);
        level[s] = 0;
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(s);

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int eid : graph.get(u)) {
                int v = edges[eid][1];
                int residual = edges[eid][2] - edges[eid][3];
                if (level[v] == -1 && residual > 0) {
                    level[v] = level[u] + 1;
                    queue.offer(v);
                }
            }
        }
        return level[t] != -1;
    }

    // DFS to find blocking flow with current-arc optimization
    private int dfs(int u, int t, int pushed) {
        if (u == t) return pushed;
        List<Integer> adj = graph.get(u);

        for (; iter[u] < adj.size(); iter[u]++) {
            int eid = adj.get(iter[u]);
            int v = edges[eid][1];
            int residual = edges[eid][2] - edges[eid][3];

            if (level[v] != level[u] + 1 || residual <= 0) continue;

            int d = dfs(v, t, Math.min(pushed, residual));
            if (d > 0) {
                edges[eid][3] += d;
                edges[eid ^ 1][3] -= d;
                return d;
            }
        }
        return 0;
    }

    public int maxFlow(int s, int t) {
        int totalFlow = 0;

        while (bfs(s, t)) {
            iter = new int[V];
            int pushed;
            while ((pushed = dfs(s, t, INF)) > 0) {
                totalFlow += pushed;
            }
        }
        return totalFlow;
    }

    public static void main(String[] args) {
        Dinic dinic = new Dinic(6);

        dinic.addEdge(0, 1, 16);
        dinic.addEdge(0, 2, 13);
        dinic.addEdge(1, 2, 4);
        dinic.addEdge(1, 3, 12);
        dinic.addEdge(2, 1, 10);
        dinic.addEdge(2, 4, 14);
        dinic.addEdge(3, 2, 9);
        dinic.addEdge(3, 5, 20);
        dinic.addEdge(4, 3, 7);
        dinic.addEdge(4, 5, 4);

        System.out.println("Maximum flow: " + dinic.maxFlow(0, 5)); // Expected: 23
    }
}
```

**When to use Dinic's over Edmonds-Karp:** Dinic's $O(V^2 E)$ is generally faster in practice than Edmonds-Karp's $O(VE^2)$, especially for sparse graphs where $V \ll E$ does not hold. For unit-capacity graphs (bipartite matching, edge-disjoint paths), Dinic's $O(E\sqrt{V})$ bound is particularly attractive. In competitive programming, Dinic's is the standard choice for max-flow problems.

---

## Min-Cost Max-Flow

Sometimes we care not just about maximizing flow, but about doing so at minimum cost.

### Problem Definition

Each edge $(u, v)$ has a capacity $c(u, v)$ and a cost $w(u, v)$ per unit of flow. The total cost of a flow $f$ is:

$$\text{cost}(f) = \sum_{(u, v) \in E} f(u, v) \cdot w(u, v)$$

The **min-cost max-flow** problem asks for a maximum flow with the minimum possible total cost.

### Approach: Successive Shortest Paths

The standard approach replaces BFS in Edmonds-Karp with a shortest path algorithm:

1. In the residual graph, assign cost $w(u, v)$ to forward edges and $-w(u, v)$ to backward edges.
2. Find the shortest (minimum cost) augmenting path from $s$ to $t$ using Bellman-Ford (or SPFA).
3. Augment flow along this path.
4. Repeat until no augmenting path exists.

This produces a max flow with minimum total cost. The negative costs on backward edges are handled correctly by Bellman-Ford (which supports negative weights).

**Complexity:** $O(V E \cdot |f^*|)$ with Bellman-Ford, or $O(V^2 E \cdot |f^*|)$ in the worst case. Johnson's algorithm with potentials can reduce the shortest path computation to Dijkstra time after the first iteration.

### When Is Min-Cost Max-Flow Needed?

- **Assignment problems:** Assign workers to jobs to minimize total cost (weighted bipartite matching).
- **Transportation problems:** Route goods through a network minimizing shipping costs.
- **Minimum-weight bipartite matching:** Find a perfect matching in a weighted bipartite graph with minimum total weight.

For detailed implementations and optimizations, see Ahuja, Magnanti, and Orlin, *Network Flows: Theory, Algorithms, and Applications* (1993).

---

## Complexity Summary

| Algorithm | Time Complexity | Notes |
|-----------|----------------|-------|
| Ford-Fulkerson (DFS) | $O(E \cdot \|f^*\|)$ | Depends on max flow value; bad for large capacities |
| Edmonds-Karp (BFS) | $O(VE^2)$ | Strongly polynomial; practical for moderate graphs |
| Dinic's | $O(V^2 E)$ | Faster in practice; $O(E\sqrt{V})$ for unit capacities |
| Push-Relabel | $O(V^2 E)$ or $O(V^3)$ | Best for dense graphs; not covered in detail here |
| Min-Cost Max-Flow | $O(VE \cdot \|f^*\|)$ | With Bellman-Ford / SPFA |

**Space:** $O(V^2)$ for adjacency matrix, $O(V + E)$ for adjacency list representations.

---

## Practical Advice

1. **Use Dinic's as your default.** It handles most competitive programming and real-world problems efficiently.

2. **Watch for modeling errors.** The hardest part of network flow is building the correct graph. Draw it out before coding.

3. **Undirected edges:** For an undirected edge $(u, v)$ with capacity $c$, add two directed edges: $(u, v)$ with capacity $c$ and $(v, u)$ with capacity $c$. When using the edge-pair trick (`eid ^ 1`), add both as "forward" edges, each with its own reverse.

4. **Multiple sources/sinks:** Create a super-source $S$ connected to all sources and a super-sink $T$ connected to all sinks, with appropriate capacities.

5. **Vertex capacities:** To enforce a capacity on a vertex $v$, split it into $v_{in}$ and $v_{out}$ with an edge $(v_{in}, v_{out})$ of the desired capacity. Redirect all incoming edges to $v_{in}$ and all outgoing edges from $v_{out}$.

6. **Lower bounds on flow:** If an edge must carry at least $l(u,v)$ units of flow, the modeling requires a transformation to reduce to a standard max-flow instance (see Ahuja et al. for details).

7. **Integer flows:** If all capacities are integers, every Ford-Fulkerson variant produces an integer maximum flow. This is critical for applications like matching where fractional solutions are meaningless.

---

## Quiz

**Q1.** What are the two constraints that a valid flow must satisfy in a flow network?

**A1.** (1) **Capacity constraint:** For every edge $(u, v)$, the flow $f(u, v)$ must satisfy $0 \leq f(u, v) \leq c(u, v)$. (2) **Flow conservation:** For every vertex except the source and sink, the total incoming flow must equal the total outgoing flow.

---

**Q2.** What is a residual graph, and why are backward edges important?

**A2.** The residual graph $G_f$ represents the remaining capacity for flow adjustment. For each edge $(u, v)$ with flow $f(u, v)$, the residual graph has a forward edge with capacity $c(u, v) - f(u, v)$ (unused capacity) and a backward edge $(v, u)$ with capacity $f(u, v)$ (flow that can be "undone"). Backward edges are essential because they allow the algorithm to reroute flow -- correcting suboptimal choices made in earlier iterations -- which is necessary for reaching the maximum flow.

---

**Q3.** State the Max-Flow Min-Cut Theorem. How do you find the minimum cut after computing a maximum flow?

**A3.** The Max-Flow Min-Cut Theorem states that the value of the maximum flow from $s$ to $t$ equals the capacity of the minimum $s$-$t$ cut. To find the min cut: after computing max flow, perform BFS/DFS from $s$ in the residual graph. Let $S$ = reachable vertices, $T$ = unreachable vertices. The min-cut edges are all original edges $(u, v)$ where $u \in S$ and $v \in T$. These edges are fully saturated (flow equals capacity).

---

**Q4.** What distinguishes the Edmonds-Karp algorithm from the general Ford-Fulkerson method, and what is the resulting time complexity?

**A4.** Edmonds-Karp always selects the shortest augmenting path (by number of edges) using BFS, whereas Ford-Fulkerson allows any method for finding augmenting paths. This guarantees that the number of augmentations is $O(VE)$, each taking $O(E)$ time via BFS, for a total of $O(VE^2)$. This is a strongly polynomial bound independent of capacity values.

---

**Q5.** Describe how to reduce the maximum bipartite matching problem to a max-flow problem.

**A5.** Given a bipartite graph with left vertices $L$ and right vertices $R$: (1) Create a source $s$ and sink $t$. (2) Add edges from $s$ to each left vertex with capacity 1. (3) Add edges from each right vertex to $t$ with capacity 1. (4) Add edges from left to right vertices (as in the original bipartite graph) with capacity 1. The value of the maximum flow equals the size of the maximum matching. The integer flow on the bipartite edges identifies the matched pairs.

---

**Q6.** Explain why Dinic's algorithm achieves a better time complexity than Edmonds-Karp. What is the key structural idea?

**A6.** Dinic's algorithm uses level graphs (constructed via BFS) and finds blocking flows in each phase. A blocking flow saturates at least one edge on every $s$-$t$ path in the level graph, which is more aggressive than Edmonds-Karp's single augmenting path per BFS. Each phase increases the shortest-path distance from $s$ to $t$ by at least 1, so there are at most $O(V)$ phases. Each phase finds a blocking flow in $O(VE)$ using DFS with the current-arc optimization. Total: $O(V^2 E)$, which improves over Edmonds-Karp's $O(VE^2)$ particularly when $E$ is large.

---

**Q7.** A baseball league has 4 teams. Team A has 90 wins and 5 remaining games. Team B has 88 wins and 7 remaining games. Can team A be eliminated even though it is currently in first place? What concept from network flow would you use to determine this?

**A7.** Yes, it is possible. If the remaining schedule forces other teams to accumulate enough wins to all surpass A's best possible record (90 + 5 = 95 wins), then A is eliminated. The baseball elimination reduction builds a flow network: game-pair nodes connect to team nodes, which connect to the sink with capacities based on $w_A + r_A - w_i$. If the max flow from the source does not saturate all game-pair edges, team A is mathematically eliminated. The min-cut side of the theorem identifies the subset of teams responsible for the elimination.

---

**Q8.** When would you use min-cost max-flow instead of standard max-flow?

**A8.** Min-cost max-flow is used when edges have both capacities and per-unit costs, and the goal is to find a maximum flow that minimizes total cost. Typical applications include: assigning workers to jobs at minimum total salary (weighted bipartite matching), routing goods through a transportation network at minimum shipping cost, and any problem where multiple flow routings are possible and you need the cheapest one. Standard max-flow ignores costs and only maximizes throughput.
