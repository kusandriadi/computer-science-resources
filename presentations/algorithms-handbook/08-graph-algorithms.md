---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 08: Graph Algorithms

**Why this matters:** Graphs model relationships everywhere -- social networks, road maps, web links, course prerequisites, molecular structures. Graph algorithms are essential tools for every engineer.

---

# Real-World Motivation

- **Google Maps:** Shortest route through millions of intersections (Dijkstra)
- **Social networks:** Shortest chain of connections (BFS)
- **Course prerequisites:** Valid ordering to take courses (topological sort)
- **Internet routing:** Maximum bandwidth paths (network flow)

A graph is simply: **vertices** (things) connected by **edges** (relationships).

---

# Graph Representations

| Operation | Adj. List | Adj. Matrix |
|-----------|-----------|-------------|
| Space | O(V + E) | O(V^2) |
| Add edge | O(1) | O(1) |
| Check edge | O(deg(u)) | **O(1)** |
| Iterate neighbors | O(deg(u)) | O(V) |

**Rule of thumb:**
- Adjacency list for **sparse** graphs (E << V^2)
- Adjacency matrix for **dense** graphs (E ~ V^2)

---

# Breadth-First Search (BFS)

Explores layer by layer. Like ripples in a pond.

```java
Queue<Integer> queue = new LinkedList<>();
queue.offer(source); dist[source] = 0;
while (!queue.isEmpty()) {
    int u = queue.poll();
    for (int v : adj.get(u)) {
        if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            queue.offer(v);
        }
    }
}
```

**Time:** O(V + E) | **Space:** O(V)
**Use for:** Shortest path (unweighted), connected components, bipartiteness.

---

# Depth-First Search (DFS)

Goes as deep as possible before backtracking. Like exploring a maze.

```java
void dfs(int u, boolean[] visited) {
    visited[u] = true;
    for (int v : adj.get(u))
        if (!visited[v]) dfs(v, visited);
}
```

**Time:** O(V + E) | **Space:** O(V)

**Edge classification (directed):**
- **Back edge** => **cycle detected**
- Tree, forward, cross edges

---

# Cycle Detection

**Undirected:** Back edge to visited non-parent vertex.

**Directed:** Back edge to vertex currently on recursion stack.

```java
// Directed cycle detection
int[] state = new int[V]; // 0=unvisited, 1=in-progress, 2=done
boolean dfs(int u) {
    state[u] = 1;
    for (int v : adj.get(u)) {
        if (state[v] == 1) return true;  // cycle!
        if (state[v] == 0 && dfs(v)) return true;
    }
    state[u] = 2; return false;
}
```

---

# Dijkstra's Algorithm

Shortest paths from source. **Non-negative weights only.**

```java
PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0]-b[0]);
pq.offer(new int[]{0, source});
while (!pq.isEmpty()) {
    int[] curr = pq.poll();
    int d = curr[0], u = curr[1];
    if (d > dist[u]) continue;
    for (int[] edge : adj.get(u)) {
        if (dist[u] + edge[1] < dist[edge[0]]) {
            dist[edge[0]] = dist[u] + edge[1];
            pq.offer(new int[]{dist[edge[0]], edge[0]});
        }
    }
}
```

**Time:** O((V+E) log V) | **Space:** O(V)

---

# Bellman-Ford Algorithm

Handles **negative edge weights**. Detects **negative cycles**.

```java
// Relax all edges V-1 times
for (int i = 0; i < V-1; i++)
    for (int[] edge : edges) {
        if (dist[edge[0]] + edge[2] < dist[edge[1]])
            dist[edge[1]] = dist[edge[0]] + edge[2];
    }
// One more pass: if anything improves => neg cycle
```

**Time:** O(VE) | **Space:** O(V)

---

# Floyd-Warshall: All-Pairs Shortest Paths

```java
for (int k = 0; k < V; k++)
    for (int i = 0; i < V; i++)
        for (int j = 0; j < V; j++)
            dist[i][j] = min(dist[i][j],
                             dist[i][k] + dist[k][j]);
```

**Time:** O(V^3) | **Space:** O(V^2)

Handles negative weights (no negative cycles). Simple and effective for moderate V.

---

# Shortest Path Algorithm Comparison

| Algorithm | Weights | Negative? | Scope | Time |
|-----------|---------|-----------|-------|------|
| BFS | Unweighted | N/A | Single source | O(V+E) |
| Dijkstra | Non-negative | **No** | Single source | O((V+E) log V) |
| Bellman-Ford | Any | **Yes** | Single source | O(VE) |
| Floyd-Warshall | Any | Yes (no neg cycles) | **All pairs** | O(V^3) |

---

# Kruskal's MST

Sort edges, greedily add cheapest non-cycle-forming edge.

```java
Arrays.sort(edges, by weight);
for (int[] edge : edges) {
    if (find(edge[0]) != find(edge[1])) {
        union(edge[0], edge[1]);
        mst.add(edge);
    }
}
```

**Time:** O(E log E) | Uses Union-Find.

---

# Prim's MST

Grow MST from a vertex. Always add cheapest edge to non-MST vertex.

```java
PriorityQueue<int[]> pq; // {vertex, weight}
pq.offer(new int[]{0, 0});
while (!pq.isEmpty()) {
    int[] curr = pq.poll();
    if (inMST[curr[0]]) continue;
    inMST[curr[0]] = true;
    totalWeight += curr[1];
    // Add neighbors to PQ
}
```

**Time:** O((V+E) log V) | **Kruskal: sparse, Prim: dense.**

---

# Topological Sort

Linear ordering of DAG vertices respecting edge directions.

**Kahn's (BFS):** Process vertices with in-degree 0 first.
**DFS:** Add vertex to front after all descendants processed.

```java
// Kahn's: if result.size() != V => cycle!
Queue<Integer> queue = new LinkedList<>();
for (int i = 0; i < V; i++)
    if (inDegree[i] == 0) queue.offer(i);
```

**Time:** O(V + E)
**Applications:** Build systems, course prerequisites, task scheduling.

---

# Strongly Connected Components

**SCC:** Group of vertices where every vertex is reachable from every other.

**Kosaraju's Algorithm:**
1. DFS on original graph, record finish order
2. Transpose graph (reverse edges)
3. DFS in reverse finish order on transposed graph

**Tarjan's Algorithm:**
- Single DFS pass with "low-link" values
- Root of SCC: low[u] == ids[u]

**Time:** O(V + E) for both.

---

# Quiz

1. **Time complexity of BFS and DFS?**
2. **Why can Dijkstra fail with negative edges?**
3. **Can a directed graph with a cycle have a topological ordering?**
4. **Which shortest path algorithm for negative weights, no negative cycles, all pairs?**

---

# Quiz Answers

1. Both **O(V + E)**.

2. Once a vertex is finalized, Dijkstra assumes its distance is optimal. A negative edge discovered later could provide a shorter path, violating this assumption.

3. **No.** A cycle u->v->...->u requires u before v AND v before u -- contradiction.

4. **Floyd-Warshall** -- O(V^3), handles negative weights, computes all pairs.
