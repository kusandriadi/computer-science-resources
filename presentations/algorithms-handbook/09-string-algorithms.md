---
marp: true
theme: default
paginate: true
header: 'Algorithms Handbook'
footer: 'cs.kusandriadi.com'
---

# Module 09: String Algorithms

**Why this matters:** Text search, DNA analysis, compiler design, data compression, and web crawling all depend on efficient string algorithms. Naive O(nm) approaches become unacceptable at scale.

---

# Real-World Motivation

- **Search engines:** Find patterns in billions of web pages
- **Bioinformatics:** Match DNA sequences (alphabet of 4: A, C, G, T)
- **Plagiarism detection:** Find matching text across documents
- **IDE features:** Find/replace, autocomplete, syntax highlighting

**Problem:** Given text T (length n) and pattern P (length m), find all occurrences of P in T.

---

# Brute Force Pattern Matching

```java
for (int i = 0; i <= n - m; i++) {
    int j = 0;
    while (j < m && text.charAt(i+j) == pattern.charAt(j))
        j++;
    if (j == m) matches.add(i);
}
```

**Time:** O(nm) worst case (e.g., text="aaaaaa", pattern="aab")
**Average:** Near O(n) for random text (mismatches happen fast)

Can we do better? **Yes -- KMP, Boyer-Moore, Rabin-Karp.**

---

# KMP: Knuth-Morris-Pratt

**Key insight:** Never re-examine a text character. When mismatch occurs, the **failure function** tells how far to shift.

Failure function pi[i] = longest proper prefix of P[0..i] that is also a suffix.

```
Pattern: A B A B A C
pi:      0 0 1 2 3 0
```

pi[4]=3 means "ABABA" has prefix "ABA" matching suffix "ABA".

**Time:** O(n + m) | **Space:** O(m)

---

# KMP Search

```java
int[] pi = computeFailure(pattern);
int q = 0; // characters matched
for (int i = 0; i < n; i++) {
    while (q > 0 && pattern.charAt(q) != text.charAt(i))
        q = pi[q - 1]; // fall back
    if (pattern.charAt(q) == text.charAt(i))
        q++;
    if (q == m) {
        matches.add(i - m + 1);
        q = pi[q - 1]; // look for next match
    }
}
```

Each text character examined at most twice. **Guaranteed O(n + m).**

---

# Boyer-Moore Algorithm

Compares pattern **right-to-left**. Uses two heuristics to skip text.

**Bad Character Rule:** On mismatch, shift pattern to align the mismatched text character with its rightmost occurrence in pattern.

**Best case:** O(n/m) -- skips m characters at a time!

| Criterion | Boyer-Moore | KMP |
|-----------|-------------|-----|
| Best case | **O(n/m)** | O(n) |
| Worst case | O(nm)* | **O(n)** |
| Large alphabets | **Excellent** | No benefit |
| Small alphabets | Less effective | **Strong** |

*O(n) with full good suffix rule.

---

# Rabin-Karp: Hash-Based Search

Compare hash values instead of characters. Verify only on hash match.

**Rolling hash** updates in O(1) when window slides:
H(i+1) = (H(i) - T[i] * b^(m-1)) * b + T[i+m]

```java
for (int i = 0; i <= n - m; i++) {
    if (patHash == textHash)
        if (verify(text, i, pattern)) matches.add(i);
    // Slide window: O(1) hash update
}
```

**Time:** O(n + m) average, O(nm) worst case
**Advantage:** Easily extended to multiple patterns and 2D matching.

---

# Tries (Prefix Trees)

Store a set of strings. O(m) per operation, independent of set size.

```java
void insert(String word) {
    Node curr = root;
    for (char c : word.toCharArray()) {
        if (curr.children[c-'a'] == null)
            curr.children[c-'a'] = new Node();
        curr = curr.children[c-'a'];
    }
    curr.isEnd = true;
}
```

**Use for:** Autocomplete, spell checking, prefix counting, IP routing.
**Space:** O(total chars * alphabet size). Compressed tries reduce this.

---

# Suffix Arrays

Sorted array of all suffixes of a string. Space-efficient alternative to suffix trees.

```
String: "banana"
Suffixes sorted: a, ana, anana, banana, na, nana
Suffix Array:    [5, 3, 1, 0, 4, 2]
```

**Construction:** O(n log^2 n) simple, O(n log n) with radix sort, O(n) with SA-IS.
**Pattern search:** Binary search in O(m log n).

---

# String Hashing

Convert strings to numbers for O(1) comparisons.

**Polynomial hash:** H(s) = sum of s[i] * p^i mod M

**Prefix hash array:** Extract hash of any substring in O(1) after O(n) preprocessing.

**Collision avoidance:** Use double hashing (two independent hash functions). Collision probability drops to ~1/M^2.

**Applications:** Rabin-Karp, duplicate substring detection, palindrome checks.

---

# Edit Distance (Recap)

Minimum operations (insert, delete, replace) to transform s into t.

```java
if (s.charAt(i-1) == t.charAt(j-1))
    dp[i][j] = dp[i-1][j-1];
else
    dp[i][j] = 1 + min(dp[i-1][j-1],  // replace
                        dp[i-1][j],     // delete
                        dp[i][j-1]);    // insert
```

**Time:** O(mn) | **Space:** O(mn), reducible to O(min(m,n))

---

# Longest Common Substring

Unlike LCS (subsequence), characters must be **contiguous**.

```java
if (s.charAt(i-1) == t.charAt(j-1))
    dp[i][j] = dp[i-1][j-1] + 1;
// else dp[i][j] = 0 (reset!)
```

**Key difference from LCS:** Reset to 0 on mismatch instead of taking max of neighbors.

**Time:** O(mn)

---

# Algorithm Comparison Table

| Algorithm | Preprocess | Search | Multiple? |
|-----------|-----------|--------|-----------|
| Brute Force | None | O(nm) | No |
| KMP | O(m) | **O(n)** | No |
| Boyer-Moore | O(m + \|S\|) | **O(n/m)** best | No |
| Rabin-Karp | O(m) | O(n) avg | **Yes** |
| Trie | O(total len) | O(m) | **Yes** |
| Suffix Array | O(n log n) | O(m log n) | **Yes** |

**Rule of thumb:** Boyer-Moore for English text, KMP for worst-case guarantees, Rabin-Karp for multi-pattern.

---

# Quiz

1. **KMP time complexity and why it improves on brute force?**
2. **How does Rabin-Karp's rolling hash update in O(1)?**
3. **What is a suffix array's advantage over a suffix tree?**
4. **Difference between longest common subsequence and substring?**

---

# Quiz Answers

1. **O(n + m).** Never re-examines a text character; failure function determines shift on mismatch.

2. Remove outgoing char (T[i] * b^(m-1)), multiply by base b (shift positions), add incoming char T[i+m]. All O(1) with precomputed powers.

3. **O(n) space** (just an integer array) vs O(n) with large constants for suffix trees. More cache-friendly, simpler to implement.

4. **Subsequence:** chars need not be contiguous ("ace" in "abcde"). **Substring:** must be contiguous ("bcd" in "abcde"). Different DP recurrences.
