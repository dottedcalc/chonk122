# Lecture 5 (Big-O): lesson notes

Sources: Fall 2026 Lecture 5 notes, "Sorting" (Pfenning, Simmons), https://www.cs.cmu.edu/~15122/handouts/lectures/05-bigo.pdf, the Fall 2026 Lecture 5 review slides, "Complexity", https://www.cs.cmu.edu/~15122/handouts/slides/review/05-bigo.pdf, and the `arrayutil.c0` interface from the lecture code, https://www.cs.cmu.edu/~15122/handouts/code/05-bigo.tgz, plus your interview answers. The notes' exercises and sample solutions were not used.

## Interview answers

- The first half of the lecture is Big-O and the second half is selection sort.
- Computing resources aren't infinite. A very hard goose problem could be solved by a factorial algorithm that tries every permutation, but by n = 200 that passes the number of atoms in the observable universe.
- Wall-clock time changes from machine to machine because hardware differs, and each instruction costs some constant amount, which doesn't matter here. So we ignore constants. Small inputs don't matter either, since the difference is negligible.
- The formal definition of Big-O comes next, briefly, for one and several variables, then the complexity classes in tightest form, constant, log, linear, quadratic, exponential and factorial, with animations.
- Complexity relates to order. Linear search is O(n), but in a sorted array the smallest element is first, and next lecture searches faster. This lecture's focus is sorting.
- Selection sort selects the right element for each position with a linear search. Proving it needs specification functions about order, and the arrayutil library provides them through its interface. That's abstraction, so we skip trivial details.
- Prove INIT and PRES, and reason informally that the worst case is O(n²).
- This is the second of four lectures on deliberate programming. Students should reason about complexity informally (rigorous Big-O proofs belong to 15-251), writing O(___) with a line or two of reasoning. They should appreciate how order relates to complexity, and use deliberate programming, invariants and proofs to write elementary programs under 25 lines that use order and arrayutil, and deduce their cost with some scaffolding.
- Later message. As in Lecture 4, checkins and exercises can test deliberate programming on functions the lecture never shows, though the lecture won't cover it again. The lesson ends with a "Your turn" page for that reason.

Decisions agreed with you: the lesson builds selection sort from the other end, moving the tallest goose to the back each round, so its code is original (`goose_sort` and `tallest_goose`), while the algorithm, arrayutil and the proof steps match the lecture. No quiz in the lesson.

## Learning objectives

| # | Objective | Weight |
|---|-----------|--------|
| O1 | Why we measure cost by counting steps in the worst case, ignoring constants and small inputs, instead of by wall-clock time. | 4 |
| O2 | The Big-O definition, briefly, with c and n₀, for one and several variables. | 2 |
| O3 | Complexity classes in simplest and tightest form, and how they grow, from constant to factorial. | 4 |
| O4 | Informally give the Big-O of short code by tallying each line's cost and count, with one or two lines of reasoning. | 6 |
| O5 | Order and complexity. A sorted array helps, and arrayutil's specification functions let us say order facts through an interface (abstraction). | 4 |
| O6 | Selection sort by deliberate programming. Invariants from pictures, safety of the calls, and INIT, PRES and EXIT as point-to proofs. | 6 |
| O7 | Selection sort is O(n²), by summing the inner loop's work, and doubling n roughly quadruples the steps. | 4 |

Big ideas for the ultra highlight: **Big-O** and **complexity class** (Complexity and trade offs), **specification functions** and **loop invariant** (contracts colour), and **deliberate programming**.

Big ideas for the ultra highlight: **Big-O**, **complexity class** and **sorted** in the algorithms colour (category 2), **specification functions** and **loop invariants** in the contracts colour (category 1), and **deliberate programming** and **abstraction** in category 4.

## Page plan (22 pages, about 39 minutes, a long lecture)

| # | Page | Interactive | Time |
|---|------|-------------|------|
| 1 | Motivation. Chonk wants the geese lined up by height for a photo, and tries every lineup until one is sorted. Fine for 4 geese, but n! lineups for n geese. | Slider for n with the lineup count, then predict the n where it passes the atoms in the observable universe (about 10⁸⁰, passed at n = 59, so n = 200 is hopeless). | 1.5 min |
| 2 | How long is "long"? Timing the same program gives different seconds on each run and each machine. | Press Run three times on a timing demo and see the times change, then pick what wall-clock time depends on. | 1.5 min |
| 3 | Count steps instead. A short original search, `first_loud_goose`, tallied line by line, including the loop guard running n + 1 times. | Tap each line to set how many times it runs, and the total builds to 3n + 2. | 2 min |
| 4 | Worst case. The early return means the count depends on the array, so we count the slowest input of each size. | Pick inputs and see their step counts, then choose the worst case. | 1.5 min |
| 5 | Ignore constants and small inputs. One machine is twice as fast, and one function is worse only for tiny n. | Graph with a slider for n and a "faster machine" toggle, then a question on which function is better. | 1.5 min |
| 6 | The Big-O definition, briefly. | Drag c and n₀ on a plot until 4n + 7 stays under c·n, plus one case where no c works (n² and n). | 2 min |
| 7 | Simplest and tightest. Drop lower terms and constants, no log base, and true but loose bounds. | Pick the simplest and tightest class for four cost functions, with feedback. | 2 min |
| 8 | The complexity class race, constant, log, linear, n log n, quadratic, exponential and factorial. | Animated growth with a slider for n, then order the classes by dragging. | 2 min |
| 9 | Several variables. A goose photo w by h pixels, brighten it in O(wh), frame it in O(w + h). | Predict the class of three photo tasks. | 1.5 min |
| 10 | Tallying code on your own. Nested loops, a loop with a constant bound and a halving loop. | Four short functions, write O(___) by picking a class, and see the line by line tally. | 2 min |
| 11 | Order helps. In a sorted roster we can stop at the first goose taller than the one we want, but the worst case is still O(n). | Run the early exit search and find the input that makes it slowest. Forward link to Lecture 6. | 1.5 min |
| 12 | Saying order facts with arrayutil. Math notation and its function, and using an interface without reading its code (abstraction). | Match five math facts to arrayutil calls, including an empty segment. | 2 min |
| 13 | Sorting by hand. Sorted, and still the same geese (a permutation), so we only swap. | Sort six geese with swaps only, by moving the tallest to the back each round. | 1.5 min |
| 14 | Draw the picture. What is true at the top of every round. | Stepper through rounds shading the sorted part, then pick the three loop invariants. | 2 min |
| 15 | Write the code from the invariants. Loop bounds, the `tallest_goose` call and the swap indices. | Build `goose_sort` from code pieces, then Run it with `-d`. | 2 min |
| 16 | Is it safe? The preconditions of `tallest_goose` and `swap`. | Proof table, half statements and half justifications. | 2 min |
| 17 | INIT and EXIT, with empty segments, and EXIT doesn't need the third invariant. | Proof table. | 2 min |
| 18 | PRES for `is_sorted(geese, i, hi)`, which needs the third invariant. | Proof table. | 2 min |
| 19 | PRES for `le_segs`, and why the swap only moves geese inside geese[lo, i). | Proof table. | 2 min |
| 20 | What does it cost? Sum the work of `tallest_goose` to n(n − 1)/2, so O(n²), and doubling n about quadruples the comparisons. | Pick the sum, Run comparison counts for n = 1000, 2000, 4000, then write O(___) with a one line reason. | 2 min |
| 21 | Your turn. A new function, `first_taller`, on a sorted array, since checkins and exercises test deliberate programming on functions the lecture never shows. | Fill its postcondition and loop invariant with arrayutil, then give its O(___) and the reason. | 2 min |
| 22 | Where this goes next. Lecture 6 (O(log n) search), Lecture 7 (faster sorts) and Lecture 11 (amortized cost). | Match each idea to its lecture. | 1.5 min |

## How outputs were checked

There is no `cc0` in the build container, so every output was checked with gcc on a C translation where arrays carry their length, every access is bounds checked, and every contract and loop invariant is checked as with `-d`, using C copies of the arrayutil functions as the course writes them. The rest was checked by tracing.

- Page 1. 59! is about 1.39 × 10⁸⁰ and 58! about 2.35 × 10⁷⁸, so 59 geese is the first count past 10⁸⁰ atoms. 200! is about 7.9 × 10³⁷⁴. Checked with exact BigInt arithmetic, which the widget also uses.
- Page 2. Real timings from this container, gcc -O0, a search through 1,000,000 geese with no loud goose, 200 times. Three runs took 0.17, 0.20 and 0.22 seconds. 2,000,000 took 0.40 and 4,000,000 took 0.84.
- Pages 3 and 4. `first_loud_goose` step counts, counting `i = 0`, every guard test, every `if`, every `i++` and the return. 120 5 7 9 returns 0 after 4 steps, 5 120 7 9 returns 1 after 7, 5 7 9 120 returns 3 after 13, and 5 7 9 8 returns -1 after 15, which is 3n + 3 for n = 4.
- Page 5. n² > 20n + 50 first at n = 23 (529 > 510), and n²/10 > 20n + 50 first at n = 203. At n = 1,000,000, n² is 10¹² and 20n + 50 about 2 × 10⁷.
- Page 6. 4n + 7 ≤ c·n for all n ≥ n₀ exactly when c > 4 and (c − 4)n₀ ≥ 7 with n₀ ≥ 1. n² > c·n for every n > c.
- Page 7. 3n + 3 ≤ n² from n = 4 (15 ≤ 16), not at n = 3. 7 · 2²⁰ = 7,340,032.
- Page 8. At n = 64, log₂ n = 6, n log₂ n = 384, n² = 4096, 2ⁿ ≈ 1.8 × 10¹⁹ and n! ≈ 1.3 × 10⁸⁹.
- Page 10. `halvings(1024)` loops 10 times, and about a million (2²⁰) loops 20 times. The other three by counting loop iterations.
- Page 11. `count_shorter` on 2 4 4 7 9 returns 0 after 1 iteration for 1, 1 after 2 for 4, 4 after 5 for 8 and 5 after 5 for 10.
- Page 12. `lt_seg(3, geese, 2, 2)` returns true, since arrayutil's base case returns true when lo == hi.
- Pages 13 to 15. `goose_sort` on 4 8 1 6 3 7, traced by the C copy. Round by round (i, tallest, result) is (6, 1, 4 7 1 6 3 8), (5, 1, 4 3 1 6 7 8), (4, 3, unchanged), (3, 0, 1 3 4 6 7 8), (2, 1, unchanged), (1, 0, unchanged), with 15 comparisons and every loop invariant true at every check. In round 2, geese[0, 5) is 4 7 1 6 3, which is not sorted. The stepper computes its states with the same algorithm in TypeScript, and they match this trace.
- Page 15 blanks. `tallest_goose(geese, i, hi)` breaks `lo < hi` in round 1, since i == hi. `swap(geese, tallest, i)` is out of bounds in round 1, since i == hi == \length(geese).
- Page 20. Comparisons for random arrays of n = 4, 8, 16, 1000, 2000 and 4000 are 6, 28, 120, 499,500, 1,999,000 and 7,998,000, which is n(n − 1)/2 every time.
- Page 21. `first_taller` with the given contracts returns 0, 3, 4 and 5 for honk 1, 4, 8 and 10 on 2 4 4 7 9, and 0 on an empty array, with every check passing. With `is_sorted(geese, 0, \result)` in blank 1, returning 5 for honk 4 passes. With `lt_seg(honk, geese, 0, \result)`, the right answer 3 fails. Blank 2 options `lt_seg(honk, geese, i, n)` and `ge_seg(honk, geese, 0, n)` both fail at INIT for honk 4.

All code is original and goose named. The arrayutil interface on page 12 is reprinted exactly as the course gives it (a subset). The lecture's `sort`, `find_min` and sorted linear search are not reused. `goose_sort` runs selection sort from the other end, and `count_shorter`, `first_loud_goose` and the page 10 functions are new.

## Proof tables

- Page 16, safety of lines 10 and 11. 3 justifications and 2 statements blank, then a follow-up on `tallest`.
- Page 17, INIT and EXIT. 4 justifications and 3 statements blank.
- Page 18, PRES for `is_sorted(geese, i, hi)`. 3 and 3.
- Page 19, PRES for `le_segs(geese, lo, i, geese, i, hi)`. 3 justifications and 2 statements.

The lecture's own PRES proofs work on `A[lo, i)` from the left. These run from the right with `ge_seg` for the tallest goose, so the steps differ.

## Food for thought boxes

- Page 2, seconds still tell us something. Our own timings, where doubling n about doubled the time.
- Page 4, why not the average case. The notes say average case depends on the input distribution, which we often don't know. The course map says random pivots make quicksort fast on average (Lecture 7).
- Page 5, constants still matter. CPython's list sort uses binary insertion sort to build short runs of up to 64 elements (CPython `Objects/listsort.txt`).
- Page 6, Big-O is an upper bound. The notes say Big-Θ is frequently what we want, while computer scientists talk in Big-O, and the course asks for the tightest bound.
- Page 7, why we drop the log base. log_b n = log₂ n / log₂ b, from the notes.
- Page 11, no search beats O(n) on an unsorted array. The slides say no algorithm has better complexity for searching a generic array. The skipped slot argument is the standard adversary argument.
- Page 13, why only swap. The notes say a sort that only swaps is guaranteed to return a permutation, and the Lecture 4 slides say C0 contracts can't state that an array is unchanged.
- Page 20, doubling tells you the class. The notes' empirical validation section, where doubling n gave time ratios near 4 for selection sort.
