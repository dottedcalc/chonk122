# Lecture 3 (Arrays): lesson notes

Sources: Fall 2026 Lecture 3 notes, "Arrays" (Pfenning, Platzer), https://www.cs.cmu.edu/~15122/handouts/lectures/03-arrays.pdf, the Fall 2026 Lecture 3 slides, https://www.cs.cmu.edu/~15122/handouts/slides/review/03-arrays.pdf, and the C0 reference (default values, `==` on arrays, `\length`), plus your interview answers. The notes' exercises and sample solutions were not used.

## Interview answers

- Why arrays matter. To store a group of ints or strings, array indices are the natural choice. Looping over arrays gives rise to invariants, order and worklist functions, which are the foundation of much of the first half of the course.
- C0's memory model. Variables live in local memory, and each function has its own frame. Frames are decommissioned when functions return. C0 never lets us manage addresses directly, because they could be misused (`int[] a; int new_ad = a + 1` fails to compile).
- Arrays can have any fixed length, so they are allocated in the heap with `int[] a = alloc_array(int, length);`. Common confusion: `a` has type `int[]` and stores the address, while `a[1]`, `a[2]` store the values. Stack and heap are an abstraction of the memory model.
- `alloc_array` sets each element to its default value (0 for int, `'\0'` for char, and so on). C0 stores the length, but `\length` is only available in contracts, because languages like C don't store it at all. Accessing out of bounds is a safety violation, just as you can't read memory that isn't yours. In C the system can output anything that happens to be stored there.
- Point-to proofs and loop invariants prove array accesses safe.
- Memory diagrams draw arrows to arrays (aliasing), with the handouts' local memory and allocated memory labels. Checkins and quizzes often ask students to draw and read them.
- C0 has garbage collection. Arrays no variable stores are removed, though not necessarily right away. C has no garbage collection, so this is a safety feature C0 gives us.

## Learning objectives

| # | Objective | Weight |
|---|-----------|--------|
| O1 | Why arrays. `t[]` holds a fixed number of values of one type `t` (any type, even arrays), indexed from 0. Looping over them leads to invariants, order and worklists. | 2 |
| O2 | Local memory. Each call gets a frame, a function can only use the variables in its own frame, and the frame is decommissioned on return. | 4 |
| O3 | Allocated memory. A variable holds one word, so `alloc_array` returns an address, `geese` holds that address and `geese[1]` holds a value. Addresses can't be used as numbers. Elements start at default values. | 6 |
| O4 | Aliasing and diagrams. Assigning an array, passing it or returning it copies the address. Writes through one alias are seen through the other, `==` compares addresses, and a real copy needs a new `alloc_array`. Draw and read diagrams with arrows. | 6 |
| O5 | Safety and contracts. `alloc_array` requires `n >= 0` and ensures `\length(\result) == n`. `A[i]` requires `0 <= i && i < \length(A)`. `\length` is only for contracts. Out of bounds is an error in C0 and undefined in C. | 4 |
| O6 | Proving accesses safe with point-to reasoning. Turn operational facts into loop invariants and postconditions, then prove INIT and PRES. | 6 |
| O7 | Garbage collection reclaims unreachable arrays in allocated memory, eventually. C has none. | 1 |

Big ideas for the ultra highlight: **memory** (local memory, allocated memory, aliases) in the data and memory colour, and **safety**, **point-to reasoning** and **loop invariant** in the contracts colour.

## Page plan (17 pages, about 30 minutes)

| # | Page | Interactive | Time |
|---|------|-------------|------|
| 1 | One variable per goose? | Flock slider, variables against one array, then a pick on which version works when n is only known at run time | 1.5 min |
| 2 | What is an array? | Index slider over `geese`, two rows on the last index and length 0 | 1.5 min |
| 3 | Where variables live | Pick on what `honk_twice` can see, then a frame stepper | 2 min |
| 4 | Too big for one variable | coin runs, a memory diagram, then address or int for `geese` and `geese[1]` | 2 min |
| 5 | Addresses aren't numbers | Does each line compile (4 rows) | 1.5 min |
| 6 | Default values | Predict element 0 for int, bool, char, string | 1.5 min |
| 7 | Out of bounds | Index slider past both ends with coin's errors, then a pick on what C does | 1.5 min |
| 8 | Contracts for arrays | Which line of `goose_sum` doesn't compile, and which loop guard to use | 2 min |
| 9 | Two names, one array | Predict `honk[0]`, step the aliases, then two `==` rows | 2 min |
| 10 | Garbage collection | Which array is unreachable, then a stepper that marks it garbage | 1.5 min |
| 11 | Arrays as arguments | What lines 14 and 15 print, then a stepper behind "Show the memory" | 2 min |
| 12 | Drawing memory | Draw three arrows (one to A, two to B), then pick what array A holds | 2 min |
| 13 | Reversing an array | Run the aliasing `goose_reverse`, pick what went wrong, then run the fix | 1.5 min |
| 14 | Is every access safe? | Proof table for `honk[n - 1 - i]`, two statements and two justifications | 2 min |
| 15 | Proving the invariant | INIT and PRES proof table, two statements and two justifications | 2 min |
| 16 | Callers see contracts | Pick the postcondition, then a two-step proof table | 1.5 min |
| 17 | Arrays in later lectures | Match four ideas to lectures, with links | 1.5 min |

## How outputs were checked

There is no `cc0` or `coin` in the build container, so outputs were checked with gcc on C translations of each program (arrays as `calloc` blocks, so aliasing and zero defaults behave as in C0), and by tracing.

- `honk_twice(chonk + 1)` with `chonk` = 5 returns 12.
- `honk_reset` prints 9 for `honk[0]` and 8 for `goose`.
- The drawing program leaves `honk` pointing to array A, which holds 0, 4, 6, and `chonk` and `goose` pointing to array B, which holds 2, 0, 0.
- The aliasing `goose_reverse` on 1 2 3 4 returns 4 3 3 4 and leaves the caller's array as 4 3 3 4. The fixed version returns 4 3 2 1 and leaves 1 2 3 4.
- Aliases compare `==` true, and a second array with equal elements compares false (C0 reference, comparisons of `t[]` are comparisons of references).
- Default values are 0, false, `'\0'` and `""` (C0 reference). coin's messages `geese is 0x... (int[] with 4 elements)`, `geese[1] is 7 (int)`, `Error: accessing element 5 in 5-element array` and `Error: accessing negative element in 5-element array` follow the format in the Fall 2026 slides and notes. The address `0xF5A2C0` is made up, as addresses change between runs.
- Compile errors on page 5 and page 8 follow the C0 reference. `+` needs ints, `int[]` and `int` don't mix, and `\length` may only appear in contracts.

All code is original. `alloc_array` and the array access contracts are reprinted as the course gives them.

## Student walkthrough (subagent) and fixes

A fresh subagent walked all 17 pages at desktop and phone widths in both themes, by mouse and keyboard, and visited as a guest. It found the C0 correct throughout, no sideways scroll and no console errors. Fixes applied:

- Nothing moves under the pointer. Stepper buttons now sit above the memory diagram. Rows reserve space for every wrong-answer reason. Proof tables explain the latest card below the table instead of inside a cell. The arrow drawing rows keep their height.
- Every wrong card in a proof table now has a reason, and a card of the wrong kind says which bank to use. Feedback after a wrong pick names the right answer first (pages 10 and 16).
- Give-aways removed. Page 3 shows its code first and hides the stepper behind "Step through it". Page 4 asks before it says what the variable holds, and its diagram waits behind "Show the memory". Page 9 no longer states how == works before the rows. Page 13 is retitled "Reversing an array" and its options are even. Page 14 asks to prove that `honk[n - 1 - i]` is safe without listing the goals. Page 16 no longer names the postcondition.
- Focus stays on the button after answering, since answered buttons are now aria-disabled instead of disabled, so the arrow keys no longer jump pages afterward. This applies to every lesson.
- Accuracy. Page 4 no longer says an array variable is the size of an int. The `chonk[i]` note cites lines 5 and 6 as well. A mismatched reason on page 15 is fixed.
- Page 12 now draws one arrow to A and two to B. Page 7 asks what C does. Page 17's binary search prompt no longer repeats the lecture name.
- Wording. Defined coin, decommissioned, point-to reasoning, INIT and PRES. Removed "carry" and "talks to" metaphors, padding lines and the "not the elements" contrast. Code in feedback is in code font. Slider labels added and a plural fixed.

Declined, with reasons:

- Rows on page 6 can be matched by type. Knowing each type's default is the point, and the reasons teach it.
- `weigh` and `n` on page 1 stay undefined, since the page is about the shape of the code.
- The site header name and the tab title differ site-wide, which is outside this lesson.

## Second walkthrough (fresh subagent) and fixes

A second subagent walked all 17 pages and confirmed every output with gcc, with no sideways scroll, no console errors and no copy-rule breaks. Fixes applied:

- Give-aways removed. Page 8's second question now appears only after the first is answered, and Chonk's bubble no longer hints at the fix. Page 9 shows the `goose` lines without saying "also starts with 7". Page 11's takeaway sits behind "Show the memory". Two wrong-answer reasons on page 15 no longer name other answers, and page 17's reasons no longer describe the other rows.
- Keyboard focus moves to the output after Run, to the revealed content after a reveal button, and to the next variable after a right arrow on page 12.
- Picks no longer widen when an explanation with code opens, so options don't rewrap on a phone.
- Page 7 says reading or writing out of bounds in C is undefined behavior and may crash. Page 11 asks for the values after line 13 instead of using `printint`, which would need `#use <conio>`. Page 1 names n in its question.
- Smaller wording fixes on pages 6, 9, 10, 16 and 17, including one "X, not Y" contrast and the undefined "worklist".

Declined, with reasons:

- Page 2's slider shows the indices, which is the point of the page. The row on the last index checks the link to the length.
- Page 12 has only two arrays, but with one arrow to A and two to B the student has to trace each variable.
- An unknown hash like #99 opening page 1 is shared player behaviour, left for a separate change.

## Food for thought boxes

Optional purple boxes, folded shut, that don't count toward the 100 word limit. They focus on the why behind language and design choices, connections between ideas, and generalizations and facts that are useful later in the course.

Content about C moved into boxes, since it isn't examinable in Lecture 3.

- Page 2, an index is an offset (address plus i times the element size), and half-open ranges hold exactly n values, as in binary search's `lo` and `hi`.
- Page 6, C's `malloc` doesn't clear memory, so C0's defaults keep runs repeatable.
- Page 7, why C0 checks every access. C's out of bounds is undefined behavior and enables buffer overflows. Java, Python and Rust check bounds. The question about C became this box, and a C0-only question replaced it.
- Page 8, why only contracts may use `\length`. The C reasoning moved here from the page text.
- Page 9, aliasing generalizes to pointers and structs (Lectures 8 to 10).
- Page 10, garbage means unreachable. Java, Python and JavaScript collect garbage, C doesn't. The C sentence moved here from the answer explanation.
- A student walkthrough subagent checked the first version of every box and found no factual errors.
