---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 11: Complexity Theory

**Why this matters:** Understanding the limits of efficient computation prevents you from wasting time searching for a polynomial algorithm that likely doesn't exist, and guides you toward approximation and heuristics.

---

# Real-World Motivation

Your boss asks you to find the optimal delivery route visiting 50 cities. You spend weeks trying to write an efficient algorithm. You can't.

**The reason:** It's the Traveling Salesman Problem -- NP-Hard. No one has found a polynomial algorithm in 50+ years. Knowing this upfront saves you weeks and redirects you to approximation algorithms.

---

# The Class P

**P** = problems solvable in **polynomial time** O(n^k).

"Efficiently solvable" problems:
- Sorting: O(n log n)
- Shortest path (Dijkstra): O((V+E) log V)
- MST: O(E log E)
- 2-SAT: O(n + m)
- Primality testing: polynomial (AKS)

---

# The Class NP

**NP** = problems where "yes" answers can be **verified** in polynomial time.

"Hard to find, easy to check":
- **SAT:** Given a formula, is there a satisfying assignment?
  Certificate: the assignment. Verify: evaluate.
- **Hamiltonian Path:** Does a path visit every vertex?
  Certificate: the path. Verify: check it.
- **Subset Sum:** Does a subset sum to k?
  Certificate: the subset. Verify: sum.

**Key:** P is a subset of NP. (If solvable, then verifiable.)

---

# P vs NP: The Million-Dollar Question

Does P = NP?

**If P = NP:** Every problem you can check fast, you can solve fast. Cryptography collapses. Proofs could be found automatically.

**If P != NP:** Some problems are fundamentally harder to solve than to verify. This is the widely believed conjecture.

**Status:** Unresolved. One of the 7 Millennium Prize Problems ($1M reward).

---

# NP-Completeness

A problem is **NP-Complete** if:
1. It's in NP (solutions verifiable in poly time)
2. Every NP problem reduces to it in poly time (NP-Hard)

**NP-Complete = hardest problems in NP**

If ANY NP-Complete problem is solved in polynomial time => P = NP.

**NP-Hard:** At least as hard as NP-Complete, but not necessarily in NP.
Example: Halting Problem (undecidable), optimization TSP.

---

# Venn Diagram of Complexity Classes

```
+------------------------------------------+
|                 NP-Hard                   |
|   +------------------------------------+ |
|   |              NP                    | |
|   |   +------------------------+       | |
|   |   |    NP-Complete         |       | |
|   |   | SAT, TSP, 3-Coloring  |       | |
|   |   +------------------------+       | |
|   |   +--------+                       | |
|   |   |   P    | sorting, shortest     | |
|   |   |        | path, MST             | |
|   |   +--------+   (assuming P != NP)  | |
|   +------------------------------------+ |
|   Halting Problem (NP-Hard, not in NP)    |
+------------------------------------------+
```

---

# The Cook-Levin Theorem

**SAT is NP-Complete** (Cook 1971, Levin 1973).

First-ever NP-Complete problem. Proof: encode any NP computation as a Boolean formula.

**To prove a new problem L is NP-Complete:**
1. Show L is in NP (give a polynomial verifier)
2. Reduce a known NP-Complete problem to L

---

# Classic NP-Complete Problems

| Problem | Description |
|---------|-------------|
| SAT / 3-SAT | Satisfy a Boolean formula |
| TSP (decision) | Tour of weight <= k? |
| Graph Coloring (k>=3) | Color vertices with k colors? |
| Subset Sum | Subset summing to target? |
| Vertex Cover | k vertices covering all edges? |
| Clique | Complete subgraph of size k? |
| Hamiltonian Cycle | Cycle visiting all vertices? |

**Note:** 2-SAT is in P! 2-coloring (bipartiteness) is in P!

---

# Reduction Chain

SAT -> 3-SAT -> Clique -> Vertex Cover -> Set Cover
3-SAT -> 3-Coloring
3-SAT -> Subset Sum -> Knapsack -> Partition
Hamiltonian Cycle -> TSP

Each arrow is a polynomial reduction proving NP-Completeness.

---

# Approximation Algorithms

When optimal is NP-Hard, find **near-optimal** solutions efficiently.

**Approximation ratio rho:** ALG(I) / OPT(I) <= rho (minimization)

**Vertex Cover (2-approximation):**
Pick both endpoints of maximal matching edges. At most 2x optimal.

**Christofides' TSP (1.5-approximation):**
MST + minimum matching on odd-degree vertices.

**MAX-3SAT (7/8-approximation):**
Random assignment satisfies 7/8 of clauses in expectation!

---

# What To Do When Facing NP-Hard

1. **Input small?** Exponential may work (2^20 ~ 10^6)
2. **Special structure?** Polynomial for trees, planar graphs, etc.
3. **Approximate?** Use proven approximation algorithms
4. **Heuristic?** Local search, simulated annealing, genetic algorithms
5. **SAT/ILP solver?** Modern solvers handle large instances
6. **Fixed-parameter tractable?** Vertex Cover in O(2^k * n)

---

# Heuristics: 2-Opt for TSP

```java
void twoOpt(int[] tour, int[][] dist) {
    boolean improved = true;
    while (improved) {
        improved = false;
        for (int i = 0; i < n-1; i++)
            for (int j = i+2; j < n; j++) {
                if (swapImproves(tour, dist, i, j)) {
                    reverse(tour, i+1, j);
                    improved = true;
                }
            }
    }
}
```

No guarantee of optimality, but often produces good solutions quickly.

---

# Pseudo-Polynomial Time

**Subset Sum** has O(n * t) DP solution where t = target value.

This is **pseudo-polynomial**: polynomial in numeric value, but t can be exponential in input bits.

Such problems are "weakly NP-Complete."

```java
boolean[] dp = new boolean[target + 1];
dp[0] = true;
for (int num : nums)
    for (int j = target; j >= num; j--)
        dp[j] = dp[j] || dp[j - num];
```

---

# Quiz

1. **Define P and NP.**
2. **What is the relationship between P, NP, NP-Complete, NP-Hard?**
3. **Why is 2-SAT in P but 3-SAT is NP-Complete?**
4. **What is an approximation ratio? Give an example.**

---

# Quiz Answers

1. **P:** Decision problems solvable in polynomial time. **NP:** Decision problems where "yes" answers verifiable in polynomial time with a certificate.

2. P is a subset of NP. NP-Complete = NP intersect NP-Hard (hardest in NP). NP-Hard: at least as hard as NP-Complete, not necessarily in NP.

3. **2-SAT:** Reducible to SCC on implication graph, O(n+m). **3-SAT:** One extra literal per clause dramatically increases complexity. No known poly algorithm.

4. Ratio rho bounds how far from optimal. **Vertex Cover 2-approx:** greedily pick matching edges' endpoints. Result at most 2x optimal size.
