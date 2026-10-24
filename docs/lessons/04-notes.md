# Lecture 4 (Searching arrays): lesson notes

Sources: Fall 2026 Lecture 4 notes, "Search" (Pfenning), https://www.cs.cmu.edu/~15122/handouts/lectures/04-linsearch.pdf, and the Fall 2026 Lecture 4 review slides, "Searching Arrays", https://www.cs.cmu.edu/~15122/handouts/slides/review/04-linsearch.pdf, plus your interview answers. The notes' exercises and sample solutions were not used.

## Interview answers

- This is the first of four lectures whose main skill is deliberate programming. Students should be able to reason about their code, come up with suitable contracts for loops, prove them correct, and use them to guide their own modular code and edge cases.
- Motivation is a real-world scenario where we need to find one element in an array, such as a game console or the student with ID 5.
- Linear search seems simple, just iterate. First we make it safe (no out of bounds access). Then we ask whether we can prove it correct. An adversary could return -1 on every input, which is a contract exploit.
- To fix it we need two tools. Array intervals are written [lo, hi), which lets us state conditions on parts of an array. And we need a specification function for "not in", which we write ourselves, so students need to know how to write them. Then we find a stronger loop invariant and prove it correct, especially PRES, with point-to reasoning.
- Contracts can't stop someone from deliberately sabotaging the data, so choosing the right test cases matters.
- After this lecture, students should be able to write correct specification functions and loop invariants for simple array loops they haven't seen (under 20 lines, no order or sorting). The difficulty rises through the deliberate programming unit.

Decisions agreed with you: the course writes "not in" as `!is_in(...)`, so the lesson uses `is_in`. Searching a sorted array (in the notes but not the slides) is left for Lecture 6. No quiz in the lesson.

## Learning objectives

| # | Objective | Weight |
|---|-----------|--------|
| O1 | Deliberate programming. Write code by reasoning, with contracts that guide the code and its edge cases. | 4 |
| O2 | Make `A[i]` provably safe in linear search (`n == \length(A)`, `0 <= i`). Background from Lecture 3. | 2 |
| O3 | Postconditions a caller can use. -1 for "not found", `\result` in bounds, and `&&` short-circuiting so the contract itself is safe. | 4 |
| O4 | Contract exploits. Correct (postconditions hold whenever preconditions hold) is different from doing what we expect. | 6 |
| O5 | Array segments A[lo, hi) and writing specification functions such as `is_in`. | 6 |
| O6 | Strengthen the loop invariant to `!is_in(x, A, 0, i)` and prove both returns correct with point-to reasoning (INIT, PRES, EXIT, `i <= n`, scope). | 6 |
| O7 | Contracts can't stop every exploit, so test. `assert` versus `//@assert`, edge cases, stress tests, no tests of what the contract leaves open. | 4 |

Big ideas for the ultra highlight: **contract**, **contract exploit**, **specification function** and **loop invariant** in the contracts colour (category 1), and **deliberate programming** in the abstraction colour (category 4). `Big` and `Hi` now accept categories 4 and 5 to match the course map.

## Page plan (18 pages, about 32 minutes)

| # | Page | Interactive | Time |
|---|------|-------------|------|
| 1 | Where is goose 5? | Turn over roster slots to find ID 5, then ID 12, which isn't there | 1.5 min |
| 2 | Safety first | Why the first try doesn't compile, then which contracts make `geese[i]` safe | 1.5 min |
| 3 | What if it isn't there? | Return -1, then what `k` is for a found and a missing honk | 1.5 min |
| 4 | Promises to the caller | Run a buggy search against two orders of the postcondition, then why the bounds go first | 2 min |
| 5 | A contract exploit | Run `return -1;`, then "correct?" and "does it do what we want?" | 1.5 min |
| 6 | Array segments | Slide lo and hi, then how many elements geese[lo, hi) holds | 1.5 min |
| 7 | Specification functions | Match each case of x ∈ A[lo, hi) to its line of `is_in` | 2 min |
| 8 | Write your own | Fill the two blanks of `all_pos_geese`, then run it | 2 min |
| 9 | Closing the loophole | Run the exploit against the stronger postcondition, then whether `is_in` meets its precondition there | 1.5 min |
| 10 | Proving the found case | Proof table, 3 justifications and 2 statements | 2 min |
| 11 | What do we know so far? | Pick the candidate loop invariant, then step the loop with geese[0, i) shaded | 1.5 min |
| 12 | Proving the new invariant | INIT and PRES proof table, 3 justifications and 2 statements | 2 min |
| 13 | When the loop ends | EXIT proof table (2 and 2), then why `//@assert i == n;` doesn't compile | 2 min |
| 14 | Sneakier exploits | Two exploits that change geese, predict whether `-d` stops one, then run both | 1.5 min |
| 15 | Testing | `assert` versus `//@assert`, then which test catches which exploit | 2 min |
| 16 | Good tests | Edge case or not, then spot the test that depends on which duplicate is returned | 2 min |
| 17 | Your turn | Fill the postcondition and both loop invariants of a new `goose_last` | 2 min |
| 18 | Where search goes next | Match ideas to Big-O, Binary search and Quicksort | 1.5 min |

## How outputs were checked

There is no `cc0` or `coin` in the build container, and the course site's downloads are blocked from it, so every output was checked with gcc on a C translation where arrays carry their length and every access and contract is checked, as with `-d`, and by tracing.

- `goose_search` on geese holding 3 8 5 1 returns 2 for 5, 1 for 8, 0 for 3, 3 for 1 and -1 for every other value, and -1 on an empty array. No contract or loop invariant fails.
- The bug that returns n: for honk 6 it returns 4. With the bounds first, the postcondition is false, so the @ensures fails. With the element first, evaluating `geese[4]` goes out of bounds first. The error text follows coin's format from the Lecture 3 slides.
- `return -1;` passes the weak postcondition for honk 5. With the stronger postcondition it fails for honk 5 and passes for honk 6.
- Exploit A on 3 8 5 1 with honk 6 returns 3 and leaves 3 8 5 6. Exploit B with honk 5 returns -1 and leaves 3 8 6 1. Neither fails any contract or loop invariant. Exploit B stays safe at int_max, since C0 wraps.
- Tests on a fresh 4 9 5. `goose_search(5) == 2` passes the real code and Exploit A and fails Exploit B. `goose_search(7) == -1` fails Exploit A and passes B. `goose_search(4) == 0` fails both.
- `all_pos_geese` on 2 7 −1 gives true on [0, 2), false on [0, 3) and true on [1, 1). With `false` as the base case, [0, 2) gives false. With `||`, [0, 3) gives true.
- `goose_last` with the given contracts returns the last match (for 5 2 5 9 1, 2 for 5 and -1 for 3) and passes every check. `0 <= i && i < n` fails at once on an empty array and at exit when honk is missing. `!is_in(honk, geese, 0, i)` fails at INIT for 5 7 and honk 5. `!is_in(honk, geese, i, n)` fails at INIT for 5 and honk 5.
- The compile error on page 13 follows the slides, where `//@assert i == n;` after the loop is a compile error since `i` is out of scope.

All code is original and goose named. `is_in` is reprinted exactly as the course defines it, since later lectures reuse it. The search itself is the lecture's topic, so `goose_search` follows the same algorithm with new names, inputs and exploits. The lecture's own exploits (`A[i] = x;` and `A[i] = x + 1;`) and tests are not reused.

## Food for thought boxes

- Page 3, why -1. Java's `indexOf` and Python's `str.find` return -1, and Python's `list.index` raises `ValueError` (Java and Python documentation). C0 has no exceptions (C0 reference).
- Page 8, all versus any. An empty segment makes "every element" true and "some element" false, and `!is_in` says every element differs. `is_sorted` returns in Binary search (Lecture 6 uses `is_sorted` in its preconditions).
- Page 13, loop variables elsewhere. C (C99 on), C++ and Java scope a variable declared in a for header to the loop, and Python keeps its loop variable afterwards (language references).
- Page 14, promising not to change an array. Dafny's `old` and `modifies`, ACSL's `\old` and `assigns`, and Rust's shared references (language references). The slides say C0 can't state this and other languages can.
