# Module 09: String Algorithms

## Introduction

Strings are one of the most common data types in programming. Text search, DNA sequence analysis, compiler design, data compression, and web crawling all rely on efficient string algorithms. Naive approaches often hit $O(nm)$ walls that become unacceptable at scale. This module covers the essential algorithms for string pattern matching, searching, and analysis.

---

## Pattern Matching

### Problem Statement

Given a text $T$ of length $n$ and a pattern $P$ of length $m$, find all occurrences of $P$ in $T$.

### Brute Force

```java
public static List<Integer> bruteForceSearch(String text, String pattern) {
    List<Integer> matches = new ArrayList<>();
    int n = text.length(), m = pattern.length();

    for (int i = 0; i <= n - m; i++) {
        int j = 0;
        while (j < m && text.charAt(i + j) == pattern.charAt(j)) {
            j++;
        }
        if (j == m) {
            matches.add(i);
        }
    }
    return matches;
}
```

**Time:** $O(nm)$ worst case (e.g., text = "aaaaaa", pattern = "aab"). **Space:** $O(1)$ extra.

In practice, for average-case random text and short patterns, brute force performs near $O(n)$ because mismatches occur quickly.

---

### KMP (Knuth-Morris-Pratt) Algorithm

KMP avoids re-examining characters by precomputing a **failure function** (also called the prefix function or partial match table). When a mismatch occurs, the failure function tells us how far to shift the pattern without missing potential matches.

#### The Failure Function

$\pi[i]$ = length of the longest proper prefix of $P[0..i]$ that is also a suffix of $P[0..i]$.

Example: For pattern "ABABAC":
```
Index:  0  1  2  3  4  5
Char:   A  B  A  B  A  C
pi:     0  0  1  2  3  0
```

- $\pi[2] = 1$: "ABA" has prefix "A" that matches suffix "A".
- $\pi[4] = 3$: "ABABA" has prefix "ABA" that matches suffix "ABA".

#### Building the Failure Function

```java
private static int[] computeFailure(String pattern) {
    int m = pattern.length();
    int[] pi = new int[m];
    pi[0] = 0;
    int k = 0; // length of current match

    for (int i = 1; i < m; i++) {
        while (k > 0 && pattern.charAt(k) != pattern.charAt(i)) {
            k = pi[k - 1]; // fall back
        }
        if (pattern.charAt(k) == pattern.charAt(i)) {
            k++;
        }
        pi[i] = k;
    }
    return pi;
}
```

#### KMP Search

```java
public static List<Integer> kmpSearch(String text, String pattern) {
    List<Integer> matches = new ArrayList<>();
    int n = text.length(), m = pattern.length();
    if (m == 0) return matches;

    int[] pi = computeFailure(pattern);
    int q = 0; // number of characters matched

    for (int i = 0; i < n; i++) {
        while (q > 0 && pattern.charAt(q) != text.charAt(i)) {
            q = pi[q - 1]; // fall back
        }
        if (pattern.charAt(q) == text.charAt(i)) {
            q++;
        }
        if (q == m) {
            matches.add(i - m + 1);
            q = pi[q - 1]; // look for next match
        }
    }
    return matches;
}
```

**Time:** $O(n + m)$ -- each character of the text is examined at most twice (once in the forward scan, at most once in the fallback). The failure function is built in $O(m)$.

**Space:** $O(m)$ for the failure function.

#### Why KMP Works

When a mismatch occurs at position $j$ in the pattern after matching $j$ characters, the failure function tells us the longest prefix of the pattern that is also a suffix of the matched portion. We can shift the pattern to align this prefix with the suffix, skipping positions that cannot possibly match.

---

### Rabin-Karp Algorithm

Rabin-Karp uses **hashing** to quickly filter candidate positions. Instead of comparing characters, it compares hash values. Only when hashes match does it verify character by character.

#### Rolling Hash

A polynomial hash that can be updated in $O(1)$ when the window slides:

$$H(s[i..i+m-1]) = \sum_{j=0}^{m-1} s[i+j] \cdot b^{m-1-j} \mod p$$

When the window slides from position $i$ to $i+1$:

$$H_{i+1} = (H_i - s[i] \cdot b^{m-1}) \cdot b + s[i+m] \mod p$$

```java
public static List<Integer> rabinKarp(String text, String pattern) {
    List<Integer> matches = new ArrayList<>();
    int n = text.length(), m = pattern.length();
    if (m > n) return matches;

    long BASE = 256;
    long MOD = 1_000_000_007;

    // Compute BASE^(m-1) % MOD
    long highPow = 1;
    for (int i = 0; i < m - 1; i++) {
        highPow = (highPow * BASE) % MOD;
    }

    // Compute hash of pattern and first window
    long patHash = 0, textHash = 0;
    for (int i = 0; i < m; i++) {
        patHash = (patHash * BASE + pattern.charAt(i)) % MOD;
        textHash = (textHash * BASE + text.charAt(i)) % MOD;
    }

    for (int i = 0; i <= n - m; i++) {
        if (patHash == textHash) {
            // Verify character by character (handle hash collision)
            if (text.substring(i, i + m).equals(pattern)) {
                matches.add(i);
            }
        }

        // Slide window
        if (i < n - m) {
            textHash = ((textHash - text.charAt(i) * highPow % MOD + MOD)
                        * BASE + text.charAt(i + m)) % MOD;
        }
    }
    return matches;
}
```

**Time:** $O(n + m)$ average, $O(nm)$ worst case (many hash collisions). Using multiple hash functions or a large prime reduces collision probability.

**Space:** $O(1)$ extra (not counting output).

**Advantages over KMP:**
- Simpler to implement for multiple pattern search.
- Easily extended to 2D pattern matching.
- Can search for multiple patterns simultaneously.

---

## Tries for Strings

Tries (prefix trees) store a set of strings and support efficient prefix operations.

```java
public class Trie {
    private static class Node {
        Node[] children = new Node[26];
        boolean isEnd;
        int count; // number of words with this prefix
    }

    private final Node root = new Node();

    public void insert(String word) {
        Node curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) {
                curr.children[idx] = new Node();
            }
            curr = curr.children[idx];
            curr.count++;
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        Node node = traverse(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return traverse(prefix) != null;
    }

    public int countPrefix(String prefix) {
        Node node = traverse(prefix);
        return node == null ? 0 : node.count;
    }

    private Node traverse(String s) {
        Node curr = root;
        for (char c : s.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return null;
            curr = curr.children[idx];
        }
        return curr;
    }

    // Collect all words with given prefix
    public List<String> autocomplete(String prefix) {
        List<String> results = new ArrayList<>();
        Node node = traverse(prefix);
        if (node != null) {
            dfsCollect(node, new StringBuilder(prefix), results);
        }
        return results;
    }

    private void dfsCollect(Node node, StringBuilder sb, List<String> results) {
        if (node.isEnd) results.add(sb.toString());
        for (int i = 0; i < 26; i++) {
            if (node.children[i] != null) {
                sb.append((char)('a' + i));
                dfsCollect(node.children[i], sb, results);
                sb.deleteCharAt(sb.length() - 1);
            }
        }
    }
}
```

**Time:** $O(m)$ per operation where $m$ is the string length.
**Space:** $O(\text{total characters} \times \text{alphabet size})$.

---

## Suffix Arrays (Introduction)

A **suffix array** is a sorted array of all suffixes of a string. It provides a space-efficient alternative to suffix trees for many string problems.

For string "banana":
```
Suffixes:        Sorted:          Suffix Array:
0: banana        5: a             [5, 3, 1, 0, 4, 2]
1: anana         3: ana
2: nana          1: anana
3: ana           0: banana
4: na            4: na
5: a             2: nana
```

### Construction (Simple O(n log^2 n))

```java
public static int[] buildSuffixArray(String s) {
    int n = s.length();
    Integer[] sa = new Integer[n];
    for (int i = 0; i < n; i++) sa[i] = i;

    // Sort by first character
    Arrays.sort(sa, (a, b) -> s.charAt(a) - s.charAt(b));

    int[] rank = new int[n];
    rank[sa[0]] = 0;
    for (int i = 1; i < n; i++) {
        rank[sa[i]] = rank[sa[i - 1]];
        if (s.charAt(sa[i]) != s.charAt(sa[i - 1])) rank[sa[i]]++;
    }

    for (int k = 1; k < n; k *= 2) {
        final int kk = k;
        final int[] r = rank.clone();
        Comparator<Integer> cmp = (a, b) -> {
            if (r[a] != r[b]) return r[a] - r[b];
            int ra = a + kk < n ? r[a + kk] : -1;
            int rb = b + kk < n ? r[b + kk] : -1;
            return ra - rb;
        };
        Arrays.sort(sa, cmp);

        rank[sa[0]] = 0;
        for (int i = 1; i < n; i++) {
            rank[sa[i]] = rank[sa[i - 1]];
            if (cmp.compare(sa[i], sa[i - 1]) != 0) rank[sa[i]]++;
        }
        if (rank[sa[n - 1]] == n - 1) break; // all ranks unique
    }

    int[] result = new int[n];
    for (int i = 0; i < n; i++) result[i] = sa[i];
    return result;
}
```

**Time:** $O(n \log^2 n)$ (can be improved to $O(n \log n)$ with radix sort, or $O(n)$ with SA-IS algorithm).

### Pattern Search Using Suffix Array

Binary search on the suffix array to find all occurrences of a pattern in $O(m \log n)$:

```java
public static int[] searchPattern(String text, int[] sa, String pattern) {
    int n = text.length(), m = pattern.length();

    // Find lower bound
    int lo = 0, hi = n - 1, first = n;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        String suffix = text.substring(sa[mid], Math.min(sa[mid] + m, n));
        if (suffix.compareTo(pattern) >= 0) {
            first = mid;
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }

    // Find upper bound
    lo = 0; hi = n - 1;
    int last = -1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        String suffix = text.substring(sa[mid], Math.min(sa[mid] + m, n));
        if (suffix.compareTo(pattern) <= 0) {
            last = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }

    if (first > last) return new int[0]; // not found
    int[] positions = new int[last - first + 1];
    for (int i = first; i <= last; i++) positions[i - first] = sa[i];
    return positions;
}
```

---

## Edit Distance (Levenshtein Distance)

Covered in Module 06 (Dynamic Programming), but included here for completeness as a core string algorithm.

```java
public static int editDistance(String s, String t) {
    int m = s.length(), n = t.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                                Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
    }
    return dp[m][n];
}
```

**Time:** $O(mn)$. **Space:** $O(mn)$, reducible to $O(\min(m,n))$.

---

## Longest Common Substring

Unlike longest common *subsequence* (characters need not be contiguous), the longest common *substring* requires contiguity.

### DP Approach

```java
public static String longestCommonSubstring(String s, String t) {
    int m = s.length(), n = t.length();
    int[][] dp = new int[m + 1][n + 1];
    int maxLen = 0, endIdx = 0;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if (dp[i][j] > maxLen) {
                    maxLen = dp[i][j];
                    endIdx = i;
                }
            }
            // else dp[i][j] = 0 (already initialized)
        }
    }
    return s.substring(endIdx - maxLen, endIdx);
}
```

**Time:** $O(mn)$. **Space:** $O(mn)$, reducible to $O(\min(m,n))$.

### Binary Search + Rolling Hash Approach

For better performance on long strings, combine binary search on the answer length with rolling hash to check if a common substring of that length exists. This achieves $O((m+n) \log \min(m,n))$ expected time.

---

## String Hashing

String hashing converts a string to a numeric value, enabling $O(1)$ average-case comparisons after $O(m)$ preprocessing.

### Polynomial Hash

$$H(s) = \sum_{i=0}^{m-1} s[i] \cdot p^i \mod M$$

where $p$ is a prime base (e.g., 31 or 37) and $M$ is a large prime modulus.

### Prefix Hash Array

Precompute prefix hashes to extract the hash of any substring in $O(1)$:

```java
public class StringHasher {
    private final long[] prefixHash;
    private final long[] powBase;
    private final long MOD = 1_000_000_007;
    private final long BASE = 31;

    public StringHasher(String s) {
        int n = s.length();
        prefixHash = new long[n + 1];
        powBase = new long[n + 1];

        powBase[0] = 1;
        for (int i = 1; i <= n; i++) {
            powBase[i] = (powBase[i - 1] * BASE) % MOD;
        }

        for (int i = 0; i < n; i++) {
            prefixHash[i + 1] = (prefixHash[i] + (s.charAt(i) - 'a' + 1) * powBase[i]) % MOD;
        }
    }

    // Hash of s[l..r] (0-indexed, inclusive)
    public long getHash(int l, int r) {
        long hash = (prefixHash[r + 1] - prefixHash[l] + MOD) % MOD;
        hash = (hash * modInverse(powBase[l], MOD)) % MOD;
        return hash;
    }

    private long modInverse(long a, long mod) {
        return modPow(a, mod - 2, mod);
    }

    private long modPow(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * base % mod;
            exp >>= 1;
            base = base * base % mod;
        }
        return result;
    }
}
```

**Applications:** Comparing substrings in $O(1)$ (after $O(n)$ preprocessing), finding duplicate substrings, Rabin-Karp search, longest palindromic substring.

**Collision avoidance:** Use double hashing (two independent hash functions) to reduce collision probability to approximately $1/M^2$.

---

## Algorithm Comparison

| Algorithm | Preprocessing | Search | Space | Multiple Patterns |
|-----------|--------------|--------|-------|-------------------|
| Brute Force | None | $O(nm)$ | $O(1)$ | No |
| KMP | $O(m)$ | $O(n)$ | $O(m)$ | No |
| Rabin-Karp | $O(m)$ | $O(n)$ avg | $O(1)$ | Yes |
| Trie | $O(\text{total length})$ | $O(m)$ | $O(\text{total} \times |\Sigma|)$ | Yes |
| Suffix Array | $O(n \log n)$ | $O(m \log n)$ | $O(n)$ | Yes |
| Aho-Corasick* | $O(\text{total pattern length})$ | $O(n + \text{matches})$ | $O(\text{total} \times |\Sigma|)$ | Yes |

*Aho-Corasick is not covered in this module but is the standard algorithm for multi-pattern matching.

---

## Quiz

**Q1.** What is the time complexity of the KMP algorithm, and why is it an improvement over brute force?

**A1.** KMP runs in $O(n + m)$, where $n$ is the text length and $m$ is the pattern length. It improves on brute force ($O(nm)$ worst case) by never re-examining a text character. When a mismatch occurs, the failure function determines how far to shift the pattern, skipping positions that are guaranteed not to match.

---

**Q2.** Explain the purpose of the failure function (prefix function) in KMP.

**A2.** For each position $i$ in the pattern, $\pi[i]$ gives the length of the longest proper prefix of $P[0..i]$ that is also a suffix of $P[0..i]$. When a mismatch occurs at position $j$ in the pattern, instead of restarting from the beginning, KMP shifts the pattern so that the $\pi[j-1]$ characters already matched can be reused. This avoids redundant comparisons.

---

**Q3.** How does the Rabin-Karp rolling hash update in $O(1)$ when the window slides?

**A3.** When the window moves from position $i$ to $i+1$, the new hash is computed by: (1) subtracting the contribution of the outgoing character $T[i]$ (multiplied by $b^{m-1}$), (2) multiplying by the base $b$ (shifting all positions), and (3) adding the incoming character $T[i+m]$. All operations are $O(1)$ with precomputed powers.

---

**Q4.** What is the worst-case time complexity of Rabin-Karp, and when does it occur?

**A4.** $O(nm)$, which occurs when every window has a hash collision with the pattern hash, requiring character-by-character verification each time. This is pathological (e.g., all characters the same) and extremely rare with a good hash function and large modulus.

---

**Q5.** What is a suffix array, and what advantage does it have over a suffix tree?

**A5.** A suffix array is a sorted array of all suffixes of a string (represented by their starting indices). It uses $O(n)$ space (just an array of integers), compared to $O(n)$ space for suffix trees but with much larger constant factors. Suffix arrays are more cache-friendly and simpler to implement, while supporting similar operations (pattern search in $O(m \log n)$, LCP queries with an auxiliary array).

---

**Q6.** Given text "abcabcabc" and pattern "abcabc", trace through the KMP search showing where the failure function avoids redundant work.

**A6.** Pattern "abcabc" has failure function $\pi = [0, 0, 0, 1, 2, 3, 0]$ (correction: length 7 for 7-char pattern). Matching: we match all 7 characters of "abcabc" starting at index 0 -- match found! To find the next match, we set $q = \pi[6] = 0$ (actually $\pi[6-1] = \pi[5] = 3$), so we know the first 3 characters ("abc") already match at position 3. We continue from character index 3 in the pattern at text position 7, avoiding re-scanning text positions 3-6.

---

**Q7.** Why is double hashing recommended when using string hashing for comparisons?

**A7.** A single hash function with modulus $M$ has a collision probability of approximately $1/M$ for two random strings. With double hashing (two independent hash functions), the collision probability drops to approximately $1/M^2$. For $M \approx 10^9$, this makes false positives negligibly rare, effectively allowing $O(1)$ string comparison.

---

**Q8.** What is the difference between the longest common subsequence and the longest common substring?

**A8.** A **subsequence** can skip characters (elements need not be contiguous); e.g., "ace" is a subsequence of "abcde". A **substring** must be contiguous; e.g., "bcd" is a substring of "abcde". For strings "abcde" and "aecbd": the LCS (subsequence) is "acd" (length 3), while the longest common substring is "b" or "c" (length 1). The DP recurrences differ: for LCS, when characters don't match, we take $\max(dp[i-1][j], dp[i][j-1])$; for longest common substring, we reset to 0.
