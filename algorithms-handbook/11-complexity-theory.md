# Module 11: Complexity Theory

## Introduction

Complexity theory asks a fundamental question: **what can and cannot be computed efficiently?** While the previous modules taught you how to design efficient algorithms, this module explores the limits of what efficient algorithms can achieve. Understanding these limits is essential -- it prevents you from wasting time searching for a polynomial-time algorithm for a problem that likely has none, and it guides you toward approximation and heuristic approaches when exact solutions are infeasible.

---

## Decision Problems and Complexity Classes

### Decision Problems

A **decision problem** is one with a yes/no answer. Examples:
- "Is there a path from $s$ to $t$ in graph $G$?"
- "Is there a subset of $S$ that sums to $k$?"
- "Does this boolean formula have a satisfying assignment?"

Every optimization problem can be converted to a decision version. Instead of "find the shortest path," ask "is there a path of length $\leq k$?"

### The Class P

$P$ is the set of decision problems solvable by a **deterministic Turing machine** in polynomial time, i.e., $O(n^k)$ for some constant $k$.

**Intuition:** Problems in $P$ are "efficiently solvable."

**Examples of problems in P:**
- Sorting ($O(n \log n)$)
- Shortest path (Dijkstra: $O((V+E) \log V)$)
- Minimum spanning tree ($O(E \log E)$)
- 2-SAT ($O(n + m)$)
- Maximum bipartite matching ($O(V \cdot E)$)
- Primality testing (AKS: $O(n^6)$, Miller-Rabin: probabilistic $O(k \cdot n^2)$)
- Linear programming (ellipsoid method, interior point methods)

### The Class NP

$NP$ is the set of decision problems where a "yes" answer can be **verified** in polynomial time given a certificate (proof).

**Intuition:** Problems where solutions are hard to find but easy to check.

**Formal definition:** A problem is in $NP$ if there exists a polynomial-time verifier $V$ such that:
- If the answer is "yes," there exists a certificate $c$ of polynomial size such that $V(x, c)$ accepts.
- If the answer is "no," no certificate causes $V$ to accept.

**Examples of problems in NP:**
- SAT: Given a boolean formula, is there a satisfying assignment? (Certificate: the assignment. Verification: evaluate the formula.)
- Hamiltonian Path: Does graph $G$ have a path visiting every vertex exactly once? (Certificate: the path. Verification: check it visits all vertices and uses valid edges.)
- Subset Sum: Is there a subset of $S$ that sums to $k$? (Certificate: the subset. Verification: sum the elements.)
- Graph Coloring: Can graph $G$ be colored with $k$ colors? (Certificate: the coloring. Verification: check each edge has differently-colored endpoints.)

### P vs. NP

The most important open question in computer science:

$$P \stackrel{?}{=} NP$$

**If $P = NP$:** Every problem whose solution can be efficiently verified can also be efficiently solved. Cryptography as we know it would collapse. Mathematical proof discovery could be automated.

**If $P \neq NP$:** There exist problems that are fundamentally harder to solve than to verify. This is the widely believed conjecture, but no proof exists.

**Current status (as of early 2026):** Unresolved. It is one of the seven Millennium Prize Problems ($1 million reward for a solution).

### Key Relationship

$$P \subseteq NP$$

This is obvious: if a problem can be solved in polynomial time, it can certainly be verified in polynomial time (just solve it and compare).

---

## NP-Completeness

### Polynomial Reductions

A **polynomial-time reduction** from problem $A$ to problem $B$ (written $A \leq_p B$) is a polynomial-time computable function $f$ such that:

$$x \in A \iff f(x) \in B$$

**Intuition:** "$B$ is at least as hard as $A$." If we can solve $B$ in polynomial time, we can solve $A$ in polynomial time (by first transforming the input, then solving $B$).

### NP-Complete

A problem $L$ is **NP-Complete** if:
1. $L \in NP$ (solutions can be verified in polynomial time).
2. Every problem in $NP$ can be reduced to $L$ in polynomial time ($L$ is NP-Hard).

**Intuition:** NP-Complete problems are the "hardest" problems in NP. If any one of them can be solved in polynomial time, then $P = NP$.

### NP-Hard

A problem is **NP-Hard** if every problem in $NP$ can be reduced to it in polynomial time, but the problem itself is **not necessarily in NP**.

**Relationship:** NP-Complete = NP-Hard $\cap$ NP.

**Example of NP-Hard but not NP-Complete:** The Halting Problem (undecidable, not in NP). The optimization version of TSP ("find the shortest tour") is NP-Hard but not in NP (it's not a decision problem; verifying optimality requires checking all tours).

### Venn Diagram

```
+--------------------------------------------+
|                    NP-Hard                  |
|   +--------------------------------------+ |
|   |                NP                    | |
|   |   +----------------------------+    | |
|   |   |       NP-Complete          |    | |
|   |   |  (SAT, TSP-decision,       |    | |
|   |   |   3-coloring, etc.)        |    | |
|   |   +----------------------------+    | |
|   |                                      | |
|   |   +------------+                    | |
|   |   |     P      |                    | |
|   |   | (sorting,  |  (assuming P!=NP)  | |
|   |   | shortest   |                    | |
|   |   |  path)     |                    | |
|   |   +------------+                    | |
|   +--------------------------------------+ |
|   Halting Problem (NP-Hard, not in NP)      |
+--------------------------------------------+
```

---

## The Cook-Levin Theorem

**Theorem (Cook, 1971; Levin, 1973):** SAT (the Boolean Satisfiability Problem) is NP-Complete.

This was the first problem proven NP-Complete. The proof constructs a polynomial reduction from any NP problem to SAT by encoding the computation of a non-deterministic Turing machine as a Boolean formula.

**Significance:** Once one NP-Complete problem is established, others can be proven NP-Complete by reducing from SAT (or from any known NP-Complete problem).

**Proof strategy for NP-Completeness of a new problem $L$:**
1. Show $L \in NP$ (give a polynomial-time verifier).
2. Show a known NP-Complete problem $L'$ reduces to $L$ ($L' \leq_p L$).

---

## Classic NP-Complete Problems

### 1. SAT (Boolean Satisfiability)

**Problem:** Given a Boolean formula in conjunctive normal form (CNF), is there an assignment of variables that makes it true?

**Example:** $(x_1 \lor \neg x_2) \land (\neg x_1 \lor x_2 \lor x_3)$

- 3-SAT: Each clause has exactly 3 literals. Still NP-Complete.
- 2-SAT: Each clause has exactly 2 literals. Solvable in polynomial time! (Reduction to SCC on implication graph.)

```java
// Brute-force SAT solver (exponential)
public static boolean solveSAT(int[][] clauses, int numVars) {
    return trySAT(clauses, numVars, new boolean[numVars + 1], 1);
}

private static boolean trySAT(int[][] clauses, int numVars,
        boolean[] assignment, int var) {
    if (var > numVars) {
        return evaluateCNF(clauses, assignment);
    }
    assignment[var] = true;
    if (trySAT(clauses, numVars, assignment, var + 1)) return true;
    assignment[var] = false;
    return trySAT(clauses, numVars, assignment, var + 1);
}

private static boolean evaluateCNF(int[][] clauses, boolean[] assignment) {
    for (int[] clause : clauses) {
        boolean satisfied = false;
        for (int literal : clause) {
            boolean val = assignment[Math.abs(literal)];
            if (literal > 0 && val || literal < 0 && !val) {
                satisfied = true;
                break;
            }
        }
        if (!satisfied) return false;
    }
    return true;
}
```

**Time:** $O(2^n \cdot m)$ where $n$ = variables, $m$ = clauses.

Modern SAT solvers (e.g., MiniSat, CryptoMiniSat) use DPLL with conflict-driven clause learning (CDCL) and solve many practical instances with millions of variables.

### 2. Traveling Salesman Problem (TSP)

**Decision version:** Given a weighted graph and bound $k$, is there a tour visiting all vertices with total weight $\leq k$?

**NP-Complete** (the optimization version is NP-Hard).

The DP solution (Held-Karp algorithm) runs in $O(2^n \cdot n^2)$ -- exponential, but much better than $O(n!)$. See Module 06 for the bitmask DP implementation.

### 3. Graph Coloring

**Problem:** Given a graph $G$ and integer $k$, can the vertices be colored with $k$ colors such that no two adjacent vertices share a color?

- $k = 2$: Polynomial (check bipartiteness via BFS/DFS).
- $k \geq 3$: NP-Complete.

```java
// Brute-force graph coloring
public static boolean canColor(List<List<Integer>> adj, int k) {
    int V = adj.size();
    int[] color = new int[V];
    return colorGraph(adj, color, k, 0);
}

private static boolean colorGraph(List<List<Integer>> adj, int[] color,
        int k, int v) {
    if (v == adj.size()) return true;
    for (int c = 1; c <= k; c++) {
        if (isSafe(adj, color, v, c)) {
            color[v] = c;
            if (colorGraph(adj, color, k, v + 1)) return true;
            color[v] = 0;
        }
    }
    return false;
}

private static boolean isSafe(List<List<Integer>> adj, int[] color,
        int v, int c) {
    for (int u : adj.get(v)) {
        if (color[u] == c) return false;
    }
    return true;
}
```

### 4. Subset Sum

**Problem:** Given a set $S$ of integers and a target $t$, is there a subset of $S$ that sums to $t$?

**NP-Complete.** Has a pseudo-polynomial DP solution in $O(n \cdot t)$ (see Module 06, similar to knapsack).

```java
public static boolean subsetSum(int[] nums, int target) {
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;

    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];
}
```

### 5. Vertex Cover

**Problem:** Given a graph $G$ and integer $k$, is there a set of $\leq k$ vertices that covers every edge?

NP-Complete. Has a simple 2-approximation algorithm.

### 6. Clique

**Problem:** Given a graph $G$ and integer $k$, does $G$ contain a complete subgraph of size $k$?

NP-Complete.

---

## Reduction Chain

The classic chain of reductions establishing NP-Completeness:

$$\text{SAT} \leq_p \text{3-SAT} \leq_p \text{Clique} \leq_p \text{Vertex Cover} \leq_p \text{Set Cover}$$

$$\text{3-SAT} \leq_p \text{3-Coloring}$$

$$\text{3-SAT} \leq_p \text{Subset Sum} \leq_p \text{Knapsack} \leq_p \text{Partition}$$

$$\text{Hamiltonian Cycle} \leq_p \text{TSP}$$

Each reduction transforms instances of the source problem into instances of the target problem in polynomial time.

---

## Approximation Algorithms

When a problem is NP-Hard, we seek algorithms that find near-optimal solutions efficiently.

### Approximation Ratio

An algorithm has approximation ratio $\rho$ if for every instance:

$$\frac{\text{ALG}(I)}{\text{OPT}(I)} \leq \rho \quad \text{(for minimization)}$$

$$\frac{\text{OPT}(I)}{\text{ALG}(I)} \leq \rho \quad \text{(for maximization)}$$

### Example: Vertex Cover (2-Approximation)

```java
public static Set<Integer> approxVertexCover(List<List<Integer>> adj) {
    int V = adj.size();
    Set<Integer> cover = new HashSet<>();
    boolean[][] edgeUsed = new boolean[V][V];

    for (int u = 0; u < V; u++) {
        for (int v : adj.get(u)) {
            if (!edgeUsed[u][v] && !cover.contains(u) && !cover.contains(v)) {
                cover.add(u);
                cover.add(v);
                edgeUsed[u][v] = edgeUsed[v][u] = true;
            }
        }
    }
    return cover;
}
```

**Guarantee:** The cover size is at most $2 \times \text{OPT}$. Every edge picked contributes 2 vertices, but at least one of them must be in any optimal cover.

### Example: TSP (Christofides' Algorithm)

For metric TSP (triangle inequality holds): 1.5-approximation.

1. Find MST.
2. Find minimum-weight perfect matching on odd-degree vertices.
3. Combine to form an Eulerian graph.
4. Find Eulerian tour.
5. Shortcut to Hamiltonian tour.

### Approximation Hardness

Some problems cannot be approximated below certain ratios unless $P = NP$:
- Set Cover: Cannot be approximated better than $\ln n$ factor unless $P = NP$.
- General TSP (without triangle inequality): Cannot be approximated within any polynomial factor unless $P = NP$.
- MAX-3SAT: Has a simple $7/8$-approximation (random assignment), and this is essentially tight.

---

## Heuristics and Metaheuristics

When even approximation guarantees are insufficient or hard to achieve, heuristics provide practical solutions without formal guarantees.

### Local Search

Start with a feasible solution and iteratively improve it by making small changes ("local moves"):

```java
// 2-opt heuristic for TSP
public static void twoOpt(int[] tour, int[][] dist) {
    boolean improved = true;
    while (improved) {
        improved = false;
        for (int i = 0; i < tour.length - 1; i++) {
            for (int j = i + 2; j < tour.length; j++) {
                int delta = dist[tour[i]][tour[j]] + dist[tour[i+1]][tour[(j+1) % tour.length]]
                          - dist[tour[i]][tour[i+1]] - dist[tour[j]][tour[(j+1) % tour.length]];
                if (delta < 0) {
                    // Reverse the segment between i+1 and j
                    reverse(tour, i + 1, j);
                    improved = true;
                }
            }
        }
    }
}

private static void reverse(int[] arr, int i, int j) {
    while (i < j) {
        int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        i++; j--;
    }
}
```

### Simulated Annealing

Accept worse solutions with a probability that decreases over time ("temperature"). This helps escape local optima.

### Genetic Algorithms

Maintain a population of solutions. Use selection, crossover, and mutation to evolve better solutions over generations.

---

## Practical Implications

### What To Do When You Face an NP-Hard Problem

1. **Is the input small?** Exponential algorithms may be fast enough ($2^{20} \approx 10^6$).
2. **Is there a special structure?** Some NP-Hard problems have polynomial algorithms for special cases (e.g., graph coloring on trees, TSP on planar graphs).
3. **Is an approximate solution acceptable?** Use an approximation algorithm with provable guarantees.
4. **Can you use heuristics?** Local search, simulated annealing, or genetic algorithms often work well in practice.
5. **Can you use a SAT/ILP solver?** Modern solvers handle surprisingly large instances.
6. **Fixed-parameter tractability?** Some problems are polynomial when a specific parameter is fixed (e.g., Vertex Cover in $O(2^k \cdot n)$ for cover size $k$).

---

## Quiz

**Q1.** Define the complexity classes P and NP.

**A1.** $P$ is the set of decision problems solvable by a deterministic Turing machine in polynomial time. $NP$ is the set of decision problems where a "yes" answer can be verified in polynomial time given a polynomial-size certificate.

---

**Q2.** What is the relationship between P, NP, NP-Complete, and NP-Hard?

**A2.** $P \subseteq NP$. NP-Complete problems are the hardest problems in NP: they are in NP and every NP problem reduces to them. NP-Hard problems are at least as hard as NP-Complete problems but need not be in NP. NP-Complete = NP $\cap$ NP-Hard. If any NP-Complete problem is in P, then P = NP.

---

**Q3.** Explain what a polynomial-time reduction is and how it is used to prove NP-Completeness.

**A3.** A polynomial reduction from $A$ to $B$ ($A \leq_p B$) is a polynomial-time function $f$ such that $x$ is a yes-instance of $A$ if and only if $f(x)$ is a yes-instance of $B$. To prove $B$ is NP-Complete: (1) show $B \in NP$, and (2) reduce a known NP-Complete problem $A$ to $B$, showing $A \leq_p B$.

---

**Q4.** Why is 2-SAT in P while 3-SAT is NP-Complete?

**A4.** 2-SAT can be solved in $O(n + m)$ time by modeling implications as a directed graph and finding strongly connected components (if a variable and its negation are in the same SCC, the formula is unsatisfiable). 3-SAT has no known polynomial algorithm; adding just one more literal per clause dramatically increases combinatorial complexity.

---

**Q5.** What is the significance of the Cook-Levin Theorem?

**A5.** It established SAT as the first NP-Complete problem by showing that any problem in NP can be reduced to SAT in polynomial time. This foundational result enables proving other problems NP-Complete through chains of reductions from SAT.

---

**Q6.** A problem has a pseudo-polynomial time algorithm. What does this mean, and can such a problem still be NP-Complete?

**A6.** A pseudo-polynomial algorithm runs in time polynomial in the *numeric value* of the input, not in the *size* (number of bits) of the input. For example, Subset Sum has an $O(n \cdot t)$ DP algorithm, where $t$ is the target value. This is pseudo-polynomial because $t$ can be exponential in the number of bits needed to represent it. Yes, Subset Sum is NP-Complete (it is NP-Complete in the strong sense if the values are encoded in unary; in binary encoding, the pseudo-polynomial algorithm is exponential in input size). Such problems are called "weakly NP-Complete."

---

**Q7.** You discover that your problem can be reduced to TSP. What are your options for solving it practically?

**A7.** (1) If the instance is small (e.g., $n \leq 20$), use the Held-Karp bitmask DP algorithm ($O(2^n n^2)$). (2) If the triangle inequality holds, use Christofides' 1.5-approximation algorithm. (3) Apply heuristics like 2-opt local search, simulated annealing, or genetic algorithms. (4) Use an ILP solver. (5) Check for special structure that might allow a polynomial algorithm.

---

**Q8.** What is an approximation ratio, and give an example of a problem with a known approximation algorithm?

**A8.** The approximation ratio $\rho$ bounds how far the algorithm's solution can be from optimal: $\text{ALG}(I) / \text{OPT}(I) \leq \rho$ for minimization. Example: Vertex Cover has a 2-approximation algorithm that picks both endpoints of maximal matching edges. The result is at most twice the size of the optimal vertex cover.
