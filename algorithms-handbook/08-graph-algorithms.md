# Module 08: Graph Algorithms

## Introduction

Graphs model relationships: social networks, road maps, dependency chains, web links, molecular structures, and countless other domains. A graph $G = (V, E)$ consists of vertices $V$ and edges $E$. Graph algorithms are among the most versatile tools in computer science.

This module covers the essential graph algorithms that every engineer should know, from basic traversals to shortest paths, minimum spanning trees, topological sorting, and strongly connected components.

---

## Graph Representations

### Adjacency List

```java
public class Graph {
    private final int V;
    private final List<List<int[]>> adj; // int[]{neighbor, weight}

    public Graph(int V) {
        this.V = V;
        adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
    }

    public void addEdge(int u, int v, int w) {
        adj.get(u).add(new int[]{v, w});
    }

    public void addUndirectedEdge(int u, int v, int w) {
        adj.get(u).add(new int[]{v, w});
        adj.get(v).add(new int[]{u, w});
    }

    public List<int[]> neighbors(int u) { return adj.get(u); }
    public int vertices() { return V; }
}
```

**Space:** $O(V + E)$. Best for sparse graphs.

### Adjacency Matrix

```java
int[][] matrix = new int[V][V]; // 0 or weight
```

**Space:** $O(V^2)$. Best for dense graphs or when $O(1)$ edge lookups are needed.

### Edge List

```java
List<int[]> edges = new ArrayList<>(); // int[]{u, v, weight}
```

**Space:** $O(E)$. Used in Kruskal's algorithm.

---

## Breadth-First Search (BFS)

BFS explores vertices layer by layer, visiting all vertices at distance $k$ before any at distance $k+1$.

```java
public static int[] bfs(List<List<Integer>> adj, int source) {
    int V = adj.size();
    int[] dist = new int[V];
    Arrays.fill(dist, -1);
    dist[source] = 0;

    Queue<Integer> queue = new LinkedList<>();
    queue.offer(source);

    while (!queue.isEmpty()) {
        int u = queue.poll();
        for (int v : adj.get(u)) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                queue.offer(v);
            }
        }
    }
    return dist; // dist[v] = shortest distance from source, or -1 if unreachable
}
```

### BFS with Path Reconstruction

```java
public static List<Integer> bfsPath(List<List<Integer>> adj, int source, int target) {
    int V = adj.size();
    int[] parent = new int[V];
    Arrays.fill(parent, -1);
    parent[source] = source;

    Queue<Integer> queue = new LinkedList<>();
    queue.offer(source);

    while (!queue.isEmpty()) {
        int u = queue.poll();
        if (u == target) break;
        for (int v : adj.get(u)) {
            if (parent[v] == -1) {
                parent[v] = u;
                queue.offer(v);
            }
        }
    }

    if (parent[target] == -1) return Collections.emptyList(); // unreachable

    List<Integer> path = new ArrayList<>();
    for (int v = target; v != source; v = parent[v]) {
        path.add(v);
    }
    path.add(source);
    Collections.reverse(path);
    return path;
}
```

**Time:** $O(V + E)$. **Space:** $O(V)$.

**Applications:** Shortest path in unweighted graphs, connected components, level-order traversal, bipartiteness checking.

---

## Depth-First Search (DFS)

DFS explores as deep as possible along each branch before backtracking.

### Recursive DFS

```java
public static void dfs(List<List<Integer>> adj, int u, boolean[] visited) {
    visited[u] = true;
    System.out.print(u + " ");
    for (int v : adj.get(u)) {
        if (!visited[v]) {
            dfs(adj, v, visited);
        }
    }
}
```

### Iterative DFS

```java
public static void dfsIterative(List<List<Integer>> adj, int source) {
    boolean[] visited = new boolean[adj.size()];
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(source);

    while (!stack.isEmpty()) {
        int u = stack.pop();
        if (visited[u]) continue;
        visited[u] = true;
        System.out.print(u + " ");
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                stack.push(v);
            }
        }
    }
}
```

**Time:** $O(V + E)$. **Space:** $O(V)$.

### DFS Edge Classification

During DFS on a directed graph, edges are classified as:
- **Tree edges:** Part of the DFS tree.
- **Back edges:** Point to an ancestor (indicate a **cycle**).
- **Forward edges:** Point to a descendant (not a tree edge).
- **Cross edges:** Point to a vertex in a different subtree.

### Cycle Detection

**Undirected graph:** A back edge (edge to a visited vertex that is not the parent) indicates a cycle.

```java
public static boolean hasCycleUndirected(List<List<Integer>> adj) {
    int V = adj.size();
    boolean[] visited = new boolean[V];
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            if (dfsCycleUndirected(adj, i, -1, visited)) return true;
        }
    }
    return false;
}

private static boolean dfsCycleUndirected(List<List<Integer>> adj,
        int u, int parent, boolean[] visited) {
    visited[u] = true;
    for (int v : adj.get(u)) {
        if (!visited[v]) {
            if (dfsCycleUndirected(adj, v, u, visited)) return true;
        } else if (v != parent) {
            return true; // back edge found
        }
    }
    return false;
}
```

**Directed graph:** A back edge (edge to a vertex currently on the recursion stack) indicates a cycle.

```java
public static boolean hasCycleDirected(List<List<Integer>> adj) {
    int V = adj.size();
    int[] state = new int[V]; // 0=unvisited, 1=in-progress, 2=done

    for (int i = 0; i < V; i++) {
        if (state[i] == 0) {
            if (dfsCycleDirected(adj, i, state)) return true;
        }
    }
    return false;
}

private static boolean dfsCycleDirected(List<List<Integer>> adj,
        int u, int[] state) {
    state[u] = 1; // in progress
    for (int v : adj.get(u)) {
        if (state[v] == 1) return true;  // back edge: cycle!
        if (state[v] == 0 && dfsCycleDirected(adj, v, state)) return true;
    }
    state[u] = 2; // done
    return false;
}
```

---

## Shortest Path Algorithms

### Dijkstra's Algorithm

Finds shortest paths from a source to all vertices in a graph with **non-negative** edge weights.

**Strategy:** Greedily process the unvisited vertex with the smallest known distance.

```java
public static int[] dijkstra(List<List<int[]>> adj, int source) {
    int V = adj.size();
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[source] = 0;

    // {distance, vertex}
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, source});

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], u = curr[1];

        if (d > dist[u]) continue; // outdated entry

        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}
```

**Time:** $O((V + E) \log V)$ with a binary heap. $O(V^2)$ with a simple array (better for dense graphs).
**Space:** $O(V)$.

**Limitation:** Does NOT work with negative edge weights.

### Bellman-Ford Algorithm

Finds shortest paths from a source to all vertices. Handles **negative edge weights** and detects **negative weight cycles**.

```java
public static int[] bellmanFord(int V, int[][] edges, int source) {
    // edges[i] = {u, v, weight}
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[source] = 0;

    // Relax all edges V-1 times
    for (int i = 0; i < V - 1; i++) {
        boolean updated = false;
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = true;
            }
        }
        if (!updated) break; // early termination
    }

    // Check for negative weight cycles
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
            throw new RuntimeException("Negative weight cycle detected");
        }
    }

    return dist;
}
```

**Time:** $O(VE)$. **Space:** $O(V)$.

### Floyd-Warshall Algorithm

Finds shortest paths between **all pairs** of vertices. Handles negative weights (but not negative cycles).

```java
public static int[][] floydWarshall(int[][] graph) {
    int V = graph.length;
    int[][] dist = new int[V][V];

    // Initialize
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            dist[i][j] = graph[i][j]; // INF for no edge, 0 for i==j
        }
    }

    // DP: consider each vertex as intermediate
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != Integer.MAX_VALUE
                        && dist[k][j] != Integer.MAX_VALUE) {
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
    return dist;
}
```

**Time:** $O(V^3)$. **Space:** $O(V^2)$.

### Shortest Path Algorithm Comparison

| Algorithm | Weights | Negative? | Scope | Time |
|-----------|---------|-----------|-------|------|
| BFS | Unweighted | N/A | Single source | $O(V+E)$ |
| Dijkstra | Non-negative | No | Single source | $O((V+E)\log V)$ |
| Bellman-Ford | Any | Yes (detects cycles) | Single source | $O(VE)$ |
| Floyd-Warshall | Any | Yes (no cycles) | All pairs | $O(V^3)$ |

---

## Minimum Spanning Tree (MST)

### Kruskal's Algorithm

Sort edges by weight. Greedily add the cheapest edge that doesn't create a cycle (using Union-Find).

```java
public static List<int[]> kruskal(int V, int[][] edges) {
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);

    int[] parent = new int[V];
    int[] rank = new int[V];
    for (int i = 0; i < V; i++) parent[i] = i;

    List<int[]> mst = new ArrayList<>();

    for (int[] edge : edges) {
        int rootU = find(parent, edge[0]);
        int rootV = find(parent, edge[1]);
        if (rootU != rootV) {
            mst.add(edge);
            union(parent, rank, rootU, rootV);
            if (mst.size() == V - 1) break;
        }
    }
    return mst;
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

**Time:** $O(E \log E)$ (dominated by sorting). **Space:** $O(V)$.

### Prim's Algorithm

Start from any vertex. Greedily add the cheapest edge connecting the MST to a non-MST vertex.

```java
public static int prim(List<List<int[]>> adj) {
    int V = adj.size();
    boolean[] inMST = new boolean[V];
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);

    pq.offer(new int[]{0, 0}); // {vertex, weight}
    int totalWeight = 0;
    int edgesAdded = 0;

    while (!pq.isEmpty() && edgesAdded < V) {
        int[] curr = pq.poll();
        int u = curr[0], w = curr[1];

        if (inMST[u]) continue;
        inMST[u] = true;
        totalWeight += w;
        edgesAdded++;

        for (int[] edge : adj.get(u)) {
            int v = edge[0], weight = edge[1];
            if (!inMST[v]) {
                pq.offer(new int[]{v, weight});
            }
        }
    }
    return totalWeight;
}
```

**Time:** $O((V + E) \log V)$ with binary heap. **Space:** $O(V)$.

### Kruskal vs. Prim

| Aspect | Kruskal | Prim |
|--------|---------|------|
| Graph type | Edge list | Adjacency list |
| Best for | Sparse graphs | Dense graphs |
| Data structure | Union-Find | Priority Queue |
| Time | $O(E \log E)$ | $O((V+E) \log V)$ |

---

## Topological Sort

A **topological ordering** of a directed acyclic graph (DAG) is a linear ordering of vertices such that for every directed edge $(u, v)$, vertex $u$ comes before $v$.

### Kahn's Algorithm (BFS-based)

```java
public static List<Integer> topologicalSortKahn(List<List<Integer>> adj) {
    int V = adj.size();
    int[] inDegree = new int[V];

    for (int u = 0; u < V; u++) {
        for (int v : adj.get(u)) {
            inDegree[v]++;
        }
    }

    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < V; i++) {
        if (inDegree[i] == 0) queue.offer(i);
    }

    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order.add(u);
        for (int v : adj.get(u)) {
            if (--inDegree[v] == 0) {
                queue.offer(v);
            }
        }
    }

    if (order.size() != V) {
        throw new RuntimeException("Graph has a cycle -- no topological order exists");
    }
    return order;
}
```

### DFS-based Topological Sort

```java
public static List<Integer> topologicalSortDFS(List<List<Integer>> adj) {
    int V = adj.size();
    boolean[] visited = new boolean[V];
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            dfsTopoSort(adj, i, visited, stack);
        }
    }

    return new ArrayList<>(stack);
}

private static void dfsTopoSort(List<List<Integer>> adj, int u,
        boolean[] visited, Deque<Integer> stack) {
    visited[u] = true;
    for (int v : adj.get(u)) {
        if (!visited[v]) {
            dfsTopoSort(adj, v, visited, stack);
        }
    }
    stack.push(u); // add to front after all descendants processed
}
```

**Time:** $O(V + E)$. **Space:** $O(V)$.

**Applications:** Build systems (make, Maven, Gradle), course prerequisites, task scheduling, dependency resolution.

---

## Strongly Connected Components (SCC)

A **strongly connected component** is a maximal set of vertices such that every vertex is reachable from every other vertex in the set (in a directed graph).

### Kosaraju's Algorithm

1. Perform DFS on the original graph, recording finish order.
2. Transpose the graph (reverse all edges).
3. Process vertices in reverse finish order using DFS on the transposed graph. Each DFS tree is an SCC.

```java
public static List<List<Integer>> kosaraju(List<List<Integer>> adj) {
    int V = adj.size();

    // Step 1: DFS on original graph, record finish order
    boolean[] visited = new boolean[V];
    Deque<Integer> finishOrder = new ArrayDeque<>();
    for (int i = 0; i < V; i++) {
        if (!visited[i]) dfsFinish(adj, i, visited, finishOrder);
    }

    // Step 2: Transpose the graph
    List<List<Integer>> transposed = new ArrayList<>();
    for (int i = 0; i < V; i++) transposed.add(new ArrayList<>());
    for (int u = 0; u < V; u++) {
        for (int v : adj.get(u)) {
            transposed.get(v).add(u);
        }
    }

    // Step 3: DFS on transposed graph in reverse finish order
    Arrays.fill(visited, false);
    List<List<Integer>> sccs = new ArrayList<>();
    while (!finishOrder.isEmpty()) {
        int u = finishOrder.pop();
        if (!visited[u]) {
            List<Integer> scc = new ArrayList<>();
            dfsCollect(transposed, u, visited, scc);
            sccs.add(scc);
        }
    }
    return sccs;
}

private static void dfsFinish(List<List<Integer>> adj, int u,
        boolean[] visited, Deque<Integer> stack) {
    visited[u] = true;
    for (int v : adj.get(u)) {
        if (!visited[v]) dfsFinish(adj, v, visited, stack);
    }
    stack.push(u);
}

private static void dfsCollect(List<List<Integer>> adj, int u,
        boolean[] visited, List<Integer> scc) {
    visited[u] = true;
    scc.add(u);
    for (int v : adj.get(u)) {
        if (!visited[v]) dfsCollect(adj, v, visited, scc);
    }
}
```

**Time:** $O(V + E)$. **Space:** $O(V)$.

### Tarjan's Algorithm

Uses a single DFS pass with a stack and "low-link" values.

```java
public class TarjanSCC {
    private int index = 0;
    private int[] ids, low;
    private boolean[] onStack;
    private Deque<Integer> stack = new ArrayDeque<>();
    private List<List<Integer>> sccs = new ArrayList<>();

    public List<List<Integer>> findSCCs(List<List<Integer>> adj) {
        int V = adj.size();
        ids = new int[V];
        low = new int[V];
        onStack = new boolean[V];
        Arrays.fill(ids, -1);

        for (int i = 0; i < V; i++) {
            if (ids[i] == -1) strongConnect(adj, i);
        }
        return sccs;
    }

    private void strongConnect(List<List<Integer>> adj, int u) {
        ids[u] = low[u] = index++;
        stack.push(u);
        onStack[u] = true;

        for (int v : adj.get(u)) {
            if (ids[v] == -1) {
                strongConnect(adj, v);
                low[u] = Math.min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = Math.min(low[u], ids[v]);
            }
        }

        // If u is a root of an SCC
        if (low[u] == ids[u]) {
            List<Integer> scc = new ArrayList<>();
            int v;
            do {
                v = stack.pop();
                onStack[v] = false;
                scc.add(v);
            } while (v != u);
            sccs.add(scc);
        }
    }
}
```

**Time:** $O(V + E)$. **Space:** $O(V)$.

---

## Quiz

**Q1.** What is the time complexity of BFS and DFS on a graph with $V$ vertices and $E$ edges?

**A1.** Both are $O(V + E)$. Each vertex is visited once, and each edge is examined once (or twice for undirected graphs).

---

**Q2.** Why can Dijkstra's algorithm fail with negative edge weights?

**A2.** Dijkstra's relies on the assumption that once a vertex is "finalized" (removed from the priority queue), its shortest distance is known. With negative edges, a path through a negative edge discovered later could provide a shorter path to an already-finalized vertex, violating this assumption.

---

**Q3.** What is the difference between Kruskal's and Prim's algorithms for finding MST?

**A3.** Kruskal's sorts all edges by weight and greedily adds the cheapest non-cycle-forming edge (using Union-Find). Prim's grows the MST from a starting vertex by always adding the cheapest edge connecting the MST to a non-MST vertex (using a priority queue). Kruskal's is better for sparse graphs; Prim's is better for dense graphs.

---

**Q4.** Can a directed graph have a topological ordering if it contains a cycle?

**A4.** No. Topological ordering requires that for every edge $(u,v)$, $u$ comes before $v$. A cycle $u \to v \to \ldots \to u$ would require $u$ before $v$ and $v$ before $u$, which is a contradiction. Topological sort only exists for DAGs.

---

**Q5.** What shortest path algorithm would you use for a graph with negative edge weights but no negative cycles?

**A5.** Bellman-Ford for single-source shortest paths ($O(VE)$), or Floyd-Warshall for all-pairs shortest paths ($O(V^3)$).

---

**Q6.** How does Kosaraju's algorithm identify strongly connected components?

**A6.** (1) Perform DFS on the original graph and record vertices in order of decreasing finish time. (2) Transpose the graph (reverse all edges). (3) Process vertices in the recorded order using DFS on the transposed graph. Each DFS tree in step 3 is a strongly connected component.

---

**Q7.** In Tarjan's SCC algorithm, what does the "low-link" value represent?

**A7.** The low-link value `low[u]` is the smallest index (discovery time) reachable from `u` by following DFS tree edges and at most one back edge. A vertex `u` is the root of an SCC if `low[u] == ids[u]`, meaning no vertex in its subtree can reach a vertex discovered earlier.

---

**Q8.** You need to find the shortest path between all pairs of vertices in a dense graph with 500 vertices and non-negative weights. Which algorithm do you choose?

**A8.** Floyd-Warshall at $O(V^3) = O(500^3) = 1.25 \times 10^8$ operations, which is feasible. Alternatively, running Dijkstra from each vertex gives $O(V \cdot (V + E) \log V)$, which is roughly $O(V^3 \log V)$ for dense graphs -- slightly slower. For dense graphs, Floyd-Warshall's simplicity and lower constant factor make it the practical choice.
