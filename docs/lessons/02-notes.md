# Lecture 2 (Ints): lesson notes

Sources: Fall 2026 Lecture 2 notes, "Ints" (Pfenning), https://www.cs.cmu.edu/~15122/handouts/lectures/02-ints.pdf, and the Fall 2026 Lecture 2 slides, https://www.cs.cmu.edu/~15122/handouts/slides/review/02-ints.pdf, plus your interview answers.

## What changed after reading the slides

- The slides teach with a **4-bit computer** and a **16-position circle** (addition steps clockwise, subtraction counterclockwise). The lesson uses the same 4-bit circle, then scales up to 32 bits.
- Your "we need order" point matches the slides' **"what should 1110 print as, 14 or −2?"** and their three requirements for picking a range (successive bit values give successive numbers, 0 is included, about half are negative). Unsigned meets the first two, two's complement meets all three. That becomes page 7.
- Added the slides' **reading rule** (the sign bit is worth −2^(k−1)) and **sign extension**, which is also the motivation for right shift.
- Added the slides' point that **`+`, `-`, `*` need no special cases but `<`, `>` do**, since `x + 1 > x` can be false.
- Safety. The slides give `x/y` and `x%y` the preconditions `//@requires y != 0;` and `//@requires !(x == int_min() && y == -1);`. The lesson explains the second one by its true answer, 2^31, which is outside the range, and the chip raises an error instead of wrapping.
- Shifts. Added the slides' `//@requires 0 <= k && k < 32;`, the rule "never mix arithmetic and bitwise operations" with its three exceptions (`-x == ~x + 1`, `x << k` is `x * 2^k`, `x >> k` divides by 2^k rounding toward −∞), and the sign extension bug where you must **mask after shifting**. That bug gets its own page (16) since shifts are hard.
- Your connections are now on pages 5 and 17. An int stores one number in binary, C0 has no floats because they break the laws of arithmetic, and Lecture 3 arrays naturally hold many ints.
- Bit pattern example is **Unix file permissions**, as you chose. Exercise questions go to a separate thread.

## Learning objectives

| # | Objective | Weight |
|---|-----------|--------|
| O1 | Numbers can be written many ways. Place value makes operations easy. Computers use binary because chips have two voltages. Converting binary, hex and decimal, `0x` literals, and `int2hex` from `<util>` (C0 always prints in decimal). | 1 |
| O2 | An int is one 32-bit machine word, so only 2^32 values fit and overflow is inevitable, even in intermediate results. Raising an error breaks laws like n + (n − n) = (n + n) − n, so C0 uses modular arithmetic mod 2^32, where the laws for `+`, `-`, `*` still hold. C0 has no floats because they break these laws. | 4 |
| O3 | Two's complement. Negatives are additive inverses. On the circle, addition steps clockwise. Choosing what each word means (successive values, includes 0, about half negative) gives the range `int_min()` to `int_max()`, the sign bit, the reading rule, −x = ~x + 1 and sign extension. | 6 |
| O4 | Operations. `+`, `-`, `*` need no special cases, but comparisons do. Division rounds toward 0, (x/y)*y + x%y == x and 0 ≤ \|x%y\| < \|y\|. `x/y` and `x%y` require `y != 0` and `!(x == int_min() && y == -1)`. | 4 |
| O5 | Ints as bit patterns. `&`, `\|`, `^`, `~` act bit by bit, and masks clear, set, toggle and isolate bits. Never mix arithmetic and bitwise operations. | 4 |
| O6 | Shifts. `x << k` drops the left bits and fills with 0, which is x * 2^k. `x >> k` copies the sign bit, which keeps halving correct for negatives (rounding toward −∞). `0 <= k && k < 32` is required. Mask after shifting. | 4 |

Big ideas for the ultra highlight: **Data representation** (course map idea), **modular arithmetic** and **two's complement**.

## Page plan (17 pages, about 30 minutes, before review)

| # | Page idea | Interactive | Time |
|---|-----------|-------------|------|
| 1 | Motivation. Chonk counts geese with `int chonk = int_max();` then adds one more goose. Ints are not math integers, so what is an int? | Predict what `printint(chonk + 1)` prints, then Run. | 1.5 min |
| 2 | Many ways to write seven (7, VII, a tally). Place value makes adding easy. Binary because chips have two voltages. | Base dial (2, 10, 16). Poke digits and watch the value. | 1.5 min |
| 3 | Binary, hex and decimal (brief). One hex digit is 4 bits, `0x` in C0, coin prints decimal, `int2hex`. | Bit flipper. Hit two target numbers and read off the hex. | 1.5 min |
| 4 | A fixed number of bits means overflow is inevitable. Error or keep going? | 4-bit counter. Vote, then see why erroring breaks n + (n − n) = (n + n) − n (with a one-line Ariane 5 note). | 2 min |
| 5 | Modular arithmetic. Dropping the overflow bits computes mod 16, or mod 2^32 in C0. The laws still hold. C0 has no floats because floats break them. | Step 12 + 9 clockwise around the 4-bit circle and watch it land on 5. | 2 min |
| 6 | Negatives as additive inverses. Subtraction steps counterclockwise. | Find the y that makes 3 + y land on 0, then compute 5 − 7 on the circle. | 1.5 min |
| 7 | What should 1110 print as? (Your common confusion.) Choose a range that keeps order, includes 0 and is about half negative. | Drag the cut on the circle. Try unsigned, a bad cut and two's complement, and see which requirements each meets. The leftmost bit becomes the sign bit. | 2 min |
| 8 | Reading and writing two's complement. The sign bit is worth −2^(k−1), −x = ~x + 1, sign extension, then 32 bits with `int_min()` and `int_max()`. | Click bits to read a value, then predict `-int_min()` and `~0`. | 2 min |
| 9 | Exactly when an operation overflows (often tested in checkins). It overflows when its mathematical result is outside `int_min()` to `int_max()`. Adding two numbers of opposite signs never overflows. Adding two of the same sign overflows exactly when the result's sign bit flips. For `chonk > 0`, `honk + chonk` overflows exactly when `honk > int_max() - chonk`, a test that cannot overflow itself. The two special cases behave differently. `-int_min()` overflows and quietly wraps around to `int_min()`, but `int_min() / -1` is a safety violation like dividing by 0 (explained on page 11). This is also why `honk + 1 > honk` can be false, so comparisons need care while `+`, `-`, `*` don't. | Overflow or not? Decide for 3 expressions (such as `int_max() + int_min()`, `-int_min()`, `int_min() - 1`), then pick which of two checks safely tests for overflow before it happens. | 2 min |
| 10 | Division rounds toward 0 and `%` fills the gap. | Predict `7/2`, `-7/2`, `-7%2`, `7%-2` and check each with (x/y)*y + x%y == x. | 2 min |
| 11 | Safety. `y != 0` and `!(x == int_min() && y == -1)`, because no int satisfies the rules. Links back to Lecture 1 preconditions. | Spot the unsafe calls to a new `goose_split`, then pick its `//@requires`. | 2 min |
| 12 | Ints as bit patterns. One int holds the 9 Unix permission bits (read, write, run for owner, group and others). Never mix arithmetic and bitwise operations. | Click permission boxes and watch the int in binary and hex. | 1.5 min |
| 13 | `&`, `\|`, `^`, `~` bit by bit, and masks. | Truth table toggles, then apply each operator to a permission int to test, grant, toggle and revoke. | 2 min |
| 14 | Left shift. Drop the left bits, fill with 0, x * 2^k, build masks with `1 << k`, and `0 <= k && k < 32`. | Shift stepper with a slider for k. k = 32 shows the error. | 1.5 min |
| 15 | Right shift copies the sign bit. Motivation, we want `>>` to halve negatives, as sign extension keeps a value the same. (Students often get this wrong.) | Toggle "fill with 0" and "copy sign bit" on `-6 >> 1`. One gives a huge positive, the other −3. Then compare `-7 >> 1` with `-7 / 2`. | 2 min |
| 16 | Mask after shifting. A new `honk_top_byte` returns the wrong answer for a negative int. | Spot the bug, then press Run on the fixed version. | 1.5 min |
| 17 | Where ints come back. One int stores one number in binary, Lecture 3 arrays hold many ints, C0 has no floats. | Before/after toggle on `(lo + hi) / 2` overflowing, with links to Arrays (3), Binary search (6), Hashing (12), Types in C (19) and Virtual machines (20). | 2 min |

All code is original and goose-named. C0 library interfaces such as `int_min()`, `int_max()`, `int2hex` and `printint` are reprinted as they are. Comics use a different outfit on each page, with mixed poses and sizes.

The "aha" I'm aiming for: **an int is 32 bits on a circle, and two's complement, modular arithmetic and the bit operations are ways of reading and moving around that same circle.**

## Interview answers (from the user, lightly condensed)

- Many ways to represent numbers. Place value makes operations easier. Computers use binary for hardware reasons (brief).
- Converting between binary, hex and decimal (brief, not very important).
- Ints have a fixed size, so overflow is inevitable. Should we raise an error or allow overflow with modular arithmetic?
- Two's complement is very important. Students get confused by the circle diagram and its motivation and direction. We need order, so negatives run from `int_min()` to −1 and non-negatives from 0 to `int_max()` (follow the notes).
- Subtraction comes from addition, multiplication is repeated addition, and division and modulus are defined in specific ways in C0. Explain why dividing by 0 or `int_min()` by −1 is a safety violation.
- Ints can be viewed as 32 bits to store states efficiently. Use an original example, not ARGB (chosen, Unix file permissions).
- AND/OR/XOR on one page, shifts on another. Students often get right shift wrong, so motivate why it copies the sign bit for negatives.
- Add the exact criteria for overflow, since checkins test it.
- Connections. An int stores one number in binary, C0 has no floats, and Lecture 3 naturally deals with more than one int.
- Code and examples are original, but fixed C0 interfaces (`int_min()`, `int_max()`, `int2hex`, `printint`) may be reprinted.
- Exercise questions are handled in a separate thread.

## How outputs were verified

`cc0` and `coin` are not available in the build container, so every output was checked with an equivalent C program compiled with `gcc`, using 32-bit `int32_t` and casts through `uint32_t` for wrapping (C0's modular semantics). Results:

- `int_max() + 1` is −2147483648.
- `0x1F` is 31, and `int2hex(255)` is `"000000FF"` (format from the Fall 2026 slides, which show `int2hex(0xC0FFEE)` as `"00C0FFEE"`).
- 4-bit sums by hand: 12 + 9 mod 16 = 5, 12 + 12 = 24 needs 5 bits, inverses 3 and 13, 1 and 15, 4 and 12, and 5 − 7 = 14 mod 16.
- 1101 in 4-bit two's complement is −3, and 111101 in 6 bits is −3.
- `~0` is −1, `~5 + 1` is −5, `int_max() + 1` and `-int_min()` are both `int_min()`.
- `int_max() + int_min()` is −1, `int_min() - 1` is `int_max()`.
- `7/2` is 3, `-7/2` is −3, `-7%2` is −1, `7%-2` is 1.
- `int_min() / 2` is −1073741824. `int_min() / -1` traps (SIGFPE) on x86, and the Fall 2026 slides give `!(x == int_min() && y == -1)` as a precondition of `/` and `%`.
- Permissions `rw-r--r--` is `0x1A4`, `rwxr-xr-x` is `0x1ED`, `rwx------` is `0x1C0`.
- `0x1A4 & 0x080` is `0x080`, `| 0x012` is `0x1B6`, `^ 0x049` is `0x1ED`, `& ~0x038` is `0x184`.
- `3 << 4` is 48, `1 << 8` is 256, `int_max() << 1` is −2.
- `-6 >> 1` is −3, `-1 >> 5` is −1, `-7 >> 1` is −4, `7 >> 1` is 3, and a zero-filling shift of −6 by 1 gives 2147483645.
- `0x12345678 >> 24` is 18, `0xF0000000 >> 24` and `(0xF0000000 & 0xFF000000) >> 24` are both −16, and `(0xF0000000 >> 24) & 0xFF` is 240.
- With `lo` = 1 and `hi` = `int_max()`, `(lo + hi) / 2` is −1073741824 and `lo + (hi - lo) / 2` is 1073741824.
- The widgets (`Digits`, `Wheel`, `Perms`, `BitOps`, `Shifter`) compute their values live with JavaScript's 32-bit integer operators, which match C0 for `&`, `|`, `^`, `~`, `<<` and `>>`.

## Added after the plan

- Page 10, "Proving no overflow". The user asked for point-to proofs of no overflow to be covered briefly, since harder checkin items sometimes ask for them. It proves that `honk + chonk` in a new `honk_add` cannot overflow, citing the two preconditions. The lesson is now 18 pages, about 32 minutes.

## Student walkthrough (subagent) and fixes

A fresh subagent walked through all 17 pages as a student, tried every interactive and checked the wording rules. It confirmed every answer and output with gcc. Fixes applied:

- Spoilers removed. The fixed `honk_top_byte` now appears only after the reader picks. The right shift prose no longer states `-7 >> 1`, and the presets no longer show the answers. The overflow page asks about `chonk < 0` instead of repeating its bullet. The cut page asks which cut meets every goal before explaining two's complement. The comics on the inverse and division pages no longer give answers. The middle-of-range runs no longer say the result in their labels.
- Bit patterns and `1` in titles and speech bubbles are in code font, since the handwriting font draws 1 like I. The cut page title no longer has bits in it.
- The arrow keys no longer turn the page while a lesson button has focus, and every page stays mounted so answers survive moving between pages (`LessonPlayer`). This also applies to Lecture 1.
- Phone overflow on the bit widgets fixed down to 320 px wide. The shift slider is taller.
- Forward links go to new anchors on the lectures page (`/lectures#lN`), since the course map has no per-lecture anchors. Lecture 1's forward links had the same problem and were fixed too.
- Widgets print negatives with a true minus sign. The step counter on page 5 stops at the goal. "Try again" hides after a right answer.
- Wording and accuracy. Defined word, `<util>`, data representation and bit k. Named associativity. The overflow question now asks what C0 does. Division safety says the division breaks a precondition of `/`, and C0 stops with an error. `~` flips all 32 bits. A reason is given for never mixing arithmetic and bitwise operations, and left shift is called out as an exception. Arrays hold "many values, such as many ints". Signed overflow in C is called undefined. The C0VM is explained. Two titles were made clearer.

Declined, with reasons:

- Comic bubble fragments stay, since the lesson guide allows fragments in comic captions.
- Focus after pressing Run, and the handwriting digits in the page counter, are site-wide behaviours shared with Lecture 1, so they are left for a separate change.
- `honk` = 12 on the 4-bit page stays, since two's complement has not been introduced yet at that point.

## Second walkthrough (fresh subagent) and fixes

A second subagent walked all 18 pages and confirmed every answer with gcc, with no sideways page scroll and no copy-rule breaks. Fixes applied:

- (Superseded when main changed `Pick` in another thread. A pick is now one try, and a wrong pick says why that option is wrong before the explanation. Lecture 2 gives a reason for each wrong option.)
- The cut page has no live checks, its goals are stated in full, and the cuts are named A, B and C.
- Hints that answered later questions were removed (bubbles on pages 5, 8 and 15, the permissions target that matched page 14, the left shift preset). Page 17 is retitled "Taking the top byte".
- Page 4 scopes wrapping to + and *, and page 12 contrasts division with them. Page 14 uses distractors with the same operator so the masks are tested, and the bit widget says it is an 8-bit example. Page 10 step 2 cites "Line 3 and step 1". Version tabs keep revealed runs.
- Declined. Comic fragments stay (allowed by the guide). The wheel on page 6 stays unsigned, since negatives are named there and placed on the circle on page 7.

## Proof tables

The user made it a rule that point-to proofs are real tables. Page 10's proof is a `ProofTable` (step, statement, justification), where the reader drags a card into each blank or taps a card and then a blank. About half the blanks in each proof ask for the statement (from a bank with plausible wrong statements, such as `chonk_left' >= geese` in PRES) and the rest ask for the justification. Lecture 1's INIT, PRES and EXIT proofs use the same table, and its "spot the bad step" page is a `SpotStep` table with a Flag button per step.
