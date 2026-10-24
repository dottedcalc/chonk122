# Lecture 1 (Contracts): lesson notes

Source: Fall 2026 Lecture 1 notes, "Contracts" (Pfenning and Cervesato), plus your interview answers.

## Learning objectives

| # | Objective | Weight |
|---|-----------|--------|
| O1 | Without a specification there is no standard for "safe" or "correct". Preconditions (`//@requires`) are the caller's obligation and give safety. Postconditions (`//@ensures`) are the function's promise and give correctness. Specification is separate from implementation. | 4 |
| O2 | Point-to reasoning: every step cites a specific line or a math fact. Know what may be cited (preconditions, loop guard, negated guard after the loop, loop invariants, postconditions of called functions, assignments still in effect) and what may not (an earlier iteration's body, a called function's body, facts made stale by a reassignment). Operational reasoning fails because we cannot track every value or count iterations. | 6 |
| O3 | Loop invariant proofs: INIT, PRES and EXIT. The loop is abstracted to one arbitrary iteration, so PRES reasons about primed values (`chonk_left'`, `goose_share'`) only. | 6 |
| O4 | Informal termination (TERM) with the course's template: a quantity that strictly decreases, a bound it never passes, and the guard failing at the bound. | 2 |
| O5 | Why bother: modular reasoning scales to complex code, and invariants explain *why* an imperative loop works. Later invariants (order, representation, ...) build on this. | 2 |
| O6 | C0 contract syntax and dynamic checking with `-d`. | 1 |

## Page plan (14 pages, about 25 minutes)

| # | Page idea | Interactive | Time |
|---|-----------|-------------|------|
| 1 | Chonk finds a mystery function `f(chonk, geese)` with no comments. | Pick inputs, press Run, fill an output table. The pattern looks like integer division. | 2 min |
| 2 | `f(2, 0)` returns 2. Is that a bug? We can't say without a spec. | Predict "bug / not a bug / can't tell", then reveal. Chonk gives the plan, written as contracts for `chonk_share`. | 1.5 min |
| 3 | Preconditions: the caller's job, giving safety. | Blame game: for each call, decide whether the caller or the function broke the deal. | 2 min |
| 4 | Postconditions: the function's promise, giving correctness. | Toggle a contract on and off and see which bad results it catches. | 1.5 min |
| 5 | Contracts in C0 and checking them with `-d`. | Run with and without `-d` and compare outputs for a bad call. | 1.5 min |
| 6 | Operational reasoning breaks down on loops. | Stepper on a large `y`. Predict how many iterations run. Honk loses track. | 2 min |
| 7 | A loop invariant is a fact true at the start of every iteration. | Stepper showing both invariants of `chonk_share` checked before each guard check. | 2 min |
| 8 | Point-to reasoning: what you may and may not cite. | Sort cards into "can cite" and "can't cite". | 2 min |
| 9 | INIT. | Build the proof by clicking the lines each step points to. | 1.5 min |
| 10 | PRES: one arbitrary iteration, tracking changes with primes. (Your "common confusion".) | Justify each step for `chonk_left'` and `goose_share'` by citing lines. | 2 min |
| 11 | EXIT: invariant plus negated guard gives the postcondition. | Click to assemble the chain of citations. | 1.5 min |
| 12 | TERM with the course template. | Fill in the template's three blanks. | 1.5 min |
| 13 | Spot the bad step in a longer proof, on a new goose-named loop. | Click the step that cites something it can't (a stale fact or an old iteration). | 2 min |
| 14 | Why bother: modularity, and where invariants come back. | Before/after toggle, plus forward links to Searching arrays (4), Binary search (6), Quicksort (7), data structure invariants in Stacks and queues (9) onward, and Restoring invariants (26). | 1.5 min |

The "aha" I'm aiming for (my reading of your notes): **a loop invariant lets you prove a loop correct by reasoning about one arbitrary iteration, never the whole run.**

## Changes after review of the plan

- The user asked for an original, relevant function instead of the lecture's `POW`/fast power example. Every page now uses `chonk_share(chonk, geese)`, which shares `chonk` crumbs among `geese` geese (integer division by repeated subtraction). Page 13 uses a second original function, `total_honks(geese)`.
- Proof parts are named INIT, PRES, EXIT and TERM, as in the Fall 2026 notes.
- Quiz questions: deferred. The user will decide after the lesson is reviewed.

## Interview answers (from the user, lightly condensed)

- Without a specification there is no standard for whether code is safe or correct. Preconditions give safety and are the caller's job. Postconditions give correctness and are the function's job.
- Point-to proofs let us know a program is correct and what it does, by citing specific lines or math. Operational reasoning fails because we can't keep track of values or how many times loops run.
- Proof types are INIT, PRES, EXIT ("return") and TERM. TERM is informal and follows a template.
- How to write proofs, what may and may not be cited, and how the loop is abstracted so each proof looks at one iteration.
- Common confusion: longer proofs, and tracking changes in PRES.
- Why bother: modular reasoning, which looks like overkill now but matters in complex code. Loop invariants show what a loop keeps and why the program works step by step, which is what imperative computing is. Later lectures add many more invariants (order, data structure, ...).
- "Aha" (confirmed): a loop invariant lets you prove a loop by reasoning about one arbitrary iteration, never the whole run.

## Sources

- Fall 2026 Lecture 1 notes, "Contracts" (Pfenning and Cervesato), https://www.cs.cmu.edu/~15122/handouts/lectures/01-contracts.pdf, for terms (precondition, postcondition, loop invariant, point-to reasoning, operational reasoning, INIT/PRES/EXIT/TERM), the citation rules and the termination template.

## How outputs were verified

`cc0` is not available in the build container, and the course site's tarball host is blocked, so each output was checked with an equivalent C program compiled with `gcc`:

- `f`/`chonk_share` on (12, 3), (14, 3), (2, 5), (100, 7), (-7, 2), (23, 5), (1000, 7), (6, 3), (7, 3): returns 4, 4, 0, 14, 0, 4, 142, 2, 2. The loop body runs 142 times for (1000, 7).
- `f(10, 0)` never stops (the program cut it off after 100000 iterations).
- Guard `chonk_left > geese`: (6, 3) returns 1 and fails the second ensures, (7, 3) returns 2 and passes. Guard `chonk_left > 0`: (6, 3) returns 2 and passes, (7, 3) returns 3 and fails the first ensures. Under `-d`, (7, 3) stops earlier, at the guard check where `chonk_left` is -2, because `//@loop_invariant chonk_left >= 0` fails before the function returns.
- Both loop invariants of `chonk_share` were asserted at every guard check, and both postconditions at return, for all 0 <= chonk < 300 and 1 <= geese < 40. The result also equals `chonk / geese` there.
- `total_honks` was asserted against its invariant and postcondition for every 0 <= geese <= 1000.
- `-7 / 2 == -3` in C0 (division truncates toward zero), by the C0 reference.
- The `-d` page describes behaviour in words (the run stops at the failing `@requires`) instead of quoting `cc0`'s exact error text, which could not be run here.
- The steppers compute their states in `trace()` in the lesson file, using the same code as above.

## Revisions after the first review

- Page 1 now opens with the motivation (can we trust code someone else wrote, and what do safe and correct mean) before the mystery function.
- Pages have short titles and at most 100 words of prose, and every interactive asks at most 4 questions per page. Long proofs (INIT, PRES, EXIT) show some steps as given so the reader answers 4.
- Honk and Chonk stand on the page in comic poses (wave, think, point, oops, cheer) with speech bubbles, facing each other, on most pages.
- The big ideas of this lecture (Contracts, Invariants) get a strong highlight in their course map colour the first time they appear on a page.
- All prose was proofread against the reword-exam-paper guidelines (no colons, semicolons or em dashes in sentences, complete sentences, questions asked directly).
- Page 1 runs only four calls: (12, 3), (14, 3), (-7, 2) and (10, 0). The checked outputs above still apply.

## Student walkthrough (subagent) and fixes

A subagent walked through all 14 pages as a student and checked the wording rules. It confirmed every output and answer key. The fixes applied were these.

- Page 1 says what the `chonk` and `geese` parameters mean. Page 2 says that f is renamed to `chonk_share`, and its leftover sentence no longer uses "ensures" before page 4 defines it.
- Page 3's comic blames the caller of `chonk_share(10, 0)` (f has no precondition), and the third row is about a buggy version.
- Page 4's loop listings keep the invariant lines, so they are numbered 8 to 14 like the full listing. Run outputs are full sentences.
- Page 5 runs `cc0 test.c0 && ./a.out` with and without `-d`, since `cc0` only compiles.
- "Iteration" (the course term) is defined on page 6 and replaces "round" everywhere.
- PRES now assumes that the loop guard is true, and step 6 cites steps 2, 4 and 5. TERM gets a plain definition and an extra distractor option. Page 13 names the loop invariant. Page 14 defines modular reasoning, and its explanation no longer claims that only postconditions can be cited.
- The page counter is a split circle (current page over total) to the right of the progress bar.
- Mascots are drawn at three sizes across the comic beats.

## Food for thought boxes

Optional purple boxes, folded shut, that don't count toward the 100 word limit. They focus on the why behind language and design choices, connections between ideas, and generalizations and facts that are useful later in the course.

- Page 5, why contracts are off by default. C's `assert` is removed by `-DNDEBUG` (C standard, `<assert.h>`).
- Page 10, INIT and PRES as induction on the number of iterations.
- Page 12, the TERM argument generalizes to recursion, and no tool can do it in general (Turing's halting problem, 1936).
