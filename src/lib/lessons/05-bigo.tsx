import Link from "next/link";
import { Big } from "@/components/lesson/Big";
import { Code } from "@/components/lesson/Code";
import { Cols } from "@/components/lesson/Cols";
import { Comic } from "@/components/lesson/Comic";
import { BigODef, Crossover } from "@/components/lesson/CostPlot";
import { FoodForThought } from "@/components/lesson/FoodForThought";
import { Hi } from "@/components/lesson/Hi";
import { Lineups } from "@/components/lesson/Lineups";
import { Order } from "@/components/lesson/Order";
import { Pick } from "@/components/lesson/Pick";
import { ProofTable } from "@/components/lesson/ProofTable";
import { Race } from "@/components/lesson/Race";
import { Rows } from "@/components/lesson/Rows";
import { RunTable } from "@/components/lesson/RunTable";
import { Stepper, type Step } from "@/components/lesson/Stepper";
import { SwapSort } from "@/components/lesson/SwapSort";
import { Versions } from "@/components/lesson/Versions";
import type { Lesson } from "./types";

// Lecture 5, Big-O and selection sort. Every output below was checked with gcc or by tracing; see docs/lessons/05-notes.md.

const loud = `int first_loud_goose(int[] geese, int n)
//@requires n == \\length(geese);
{
  for (int i = 0; i < n; i++) {
    if (geese[i] > 100) return i;
  }
  return -1;
}`;

const pairs = `int honk_pairs(int[] geese, int n)
//@requires n == \\length(geese);
{
  int honks = 0;
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      if (geese[i] < geese[j]) honks++;
    }
  }
  return honks;
}`;

const firstFive = `int first_five(int[] geese, int n)
//@requires n == \\length(geese) && n >= 5;
{
  int goose_total = 0;
  for (int i = 0; i < 5; i++) {
    goose_total += geese[i];
  }
  return goose_total;
}`;

const halvings = `int halvings(int honk)
//@requires honk >= 1;
{
  int halves = 0;
  while (honk > 1) {
    honk = honk / 2;
    halves++;
  }
  return halves;
}`;

const twoFlocks = `int loud_in_both(int[] geese, int n, int[] goslings, int m)
//@requires n == \\length(geese) && m == \\length(goslings);
{
  int loud_geese = 0;
  for (int i = 0; i < n; i++) {
    if (geese[i] > 100) loud_geese++;
  }
  for (int j = 0; j < m; j++) {
    if (goslings[j] > 100) loud_geese++;
  }
  return loud_geese;
}`;

const shorter = `int count_shorter(int honk, int[] geese, int n)
//@requires n == \\length(geese);
//@requires is_sorted(geese, 0, n);
{
  for (int i = 0; i < n; i++) {
    if (geese[i] >= honk) return i;
  }
  return n;
}`;

// Reprinted from the course's arrayutil.c0 interface, as the course gives it.
const arrayutil = `/* is_sorted: A[lo,hi) SORTED */
bool is_sorted(int[] A, int lo, int hi)
/*@requires 0 <= lo  && lo <= hi && hi <= \\length(A); @*/ ;

/* lt_seg: x < A[lo,hi) */
bool lt_seg(int x, int[] A, int lo, int hi)
/*@requires 0 <= lo && lo <= hi && hi <= \\length(A); @*/ ;

/* le_seg: x <= A[lo,hi) */
bool le_seg(int x, int[] A, int lo, int hi)
/*@requires 0 <= lo && lo <= hi && hi <= \\length(A); @*/ ;

/* ge_seg: x >= A[lo,hi) */
bool ge_seg(int x, int[] A, int lo, int hi)
/*@requires 0 <= lo && lo <= hi && hi <= \\length(A); @*/ ;

/* le_segs: A[lo1,hi1) <= B[lo2,hi2) */
bool le_segs(int[] A, int lo1, int hi1, int[] B, int lo2, int hi2)
/*@requires 0 <= lo1 && lo1 <= hi1 && hi1 <= \\length(A); @*/
/*@requires 0 <= lo2 && lo2 <= hi2 && hi2 <= \\length(B); @*/ ;

/* swap(A, i, j) has the effect of switching A[i] and A[j] */
void swap(int[] A, int i, int j)
/*@ requires 0 <= i && i < \\length(A) && 0 <= j && j < \\length(A); @*/ ;`;

const tallest = `int tallest_goose(int[] geese, int lo, int hi)
//@requires 0 <= lo && lo < hi && hi <= \\length(geese);
//@ensures lo <= \\result && \\result < hi;
//@ensures ge_seg(geese[\\result], geese, lo, hi);
  ;`;

const sort = `void goose_sort(int[] geese, int lo, int hi)
//@requires 0 <= lo && lo <= hi && hi <= \\length(geese);
//@ensures is_sorted(geese, lo, hi);
{
  for (int i = hi; lo < i; i--)
  //@loop_invariant lo <= i && i <= hi;
  //@loop_invariant is_sorted(geese, i, hi);
  //@loop_invariant le_segs(geese, lo, i, geese, i, hi);
  {
    int tallest = tallest_goose(geese, lo, i);
    swap(geese, tallest, i - 1);
  }
}`;

const sortBlanks = sort.replace("tallest_goose(geese, lo, i)", "tallest_goose(geese, __1__)").replace("swap(geese, tallest, i - 1)", "swap(geese, tallest, __2__)");

const taller = `int first_taller(int honk, int[] geese, int n)
//@requires n == \\length(geese);
//@requires is_sorted(geese, 0, n);
/*@ensures 0 <= \\result && \\result <= n
        && __1__ && lt_seg(honk, geese, \\result, n); @*/
{
  int i = 0;
  while (i < n && geese[i] <= honk)
  //@loop_invariant 0 <= i && i <= n;
  //@loop_invariant __2__;
  {
    i++;
  }
  return i;
}`;

// The flock that goose_sort sorts on pages 13 to 15, and every round of it, as traced in the notes.
const flock = [4, 8, 1, 6, 3, 7];

const sortedSeg = (a: number[], lo: number, hi: number) => a.slice(lo, hi).every((x, k, s) => k === 0 || s[k - 1] <= x);
const leSegs = (a: number[], lo1: number, hi1: number, lo2: number, hi2: number) =>
  a.slice(lo1, hi1).every((x) => a.slice(lo2, hi2).every((y) => x <= y));
const tf = (b: boolean) => (b ? "true" : "false");

function rounds() {
  const out: { i: number; before: number[]; t: number; after: number[] }[] = [];
  const a = [...flock];
  for (let i = a.length; 0 < i; i--) {
    let t = 0;
    for (let j = 1; j < i; j++) if (a[j] > a[t]) t = j;
    const before = [...a];
    [a[t], a[i - 1]] = [a[i - 1], a[t]];
    out.push({ i, before, t, after: [...a] });
  }
  return out;
}

function sortSteps(): Step[] {
  const hi = flock.length;
  const steps: Step[] = [];
  const top = (a: number[], i: number): Step => ({
    line: 6,
    vars: { lo: 0, hi, i },
    cells: a,
    seg: [i, hi],
    checks: [
      { label: "lo <= i && i <= hi", value: tf(0 <= i && i <= hi), ok: 0 <= i && i <= hi },
      { label: "is_sorted(geese, i, hi)", value: tf(sortedSeg(a, i, hi)), ok: sortedSeg(a, i, hi) },
      { label: "le_segs(geese, lo, i, geese, i, hi)", value: tf(leSegs(a, 0, i, i, hi)), ok: leSegs(a, 0, i, i, hi) },
    ],
  });
  for (const r of rounds()) {
    steps.push(top(r.before, r.i));
    steps.push({
      line: 10,
      vars: { lo: 0, hi, i: r.i, tallest: r.t },
      cells: r.before,
      seg: [r.i, hi],
      at: r.t,
      note: `The tallest goose in geese[0, ${r.i}) is ${r.before[r.t]}, at index ${r.t}.`,
    });
    steps.push({
      line: 11,
      vars: { lo: 0, hi, i: r.i, tallest: r.t },
      cells: r.after,
      seg: [r.i - 1, hi],
      at: r.i - 1,
      note:
        r.t === r.i - 1
          ? `It's already at index ${r.i - 1}, so swap leaves geese as it is.`
          : `swap moves it to index ${r.i - 1}. Now geese holds ${r.after.join(" ")}.`,
    });
  }
  const done = rounds().at(-1)!.after;
  steps.push(top(done, 0));
  steps.push({ line: 5, vars: { lo: 0, hi, i: 0 }, cells: done, seg: [0, hi], note: "The guard lo < i is false, so the loop is over and geese is sorted." });
  return steps;
}

const laterNames = ["Binary search", "Quicksort", "Unbounded arrays"];
const laterWhat = [
  "Binary search searches a sorted array. It doesn't sort, and it has no rare slow step.",
  "Quicksort sorts an array. It doesn't search, and it has no rare slow step to spread out.",
  "Unbounded arrays spread out the cost of growing. They don't search or sort.",
];
const laterMiss = (k: number) => laterNames.map((_, j) => (j === k ? undefined : laterWhat[j]));

const cell = (v: number, k: number, sorted: boolean) => (
  <span key={k} className={`ai-cell${sorted ? " seg" : ""}`}>
    <span className="mem-i">{k}</span>
    <code>{v}</code>
  </span>
);

function Picture() {
  const rs = rounds();
  const shown = [rs[0].before, rs[1].before, rs[2].before];
  return (
    <div className="rows">
      {shown.map((a, r) => (
        <div key={r} className="ai">
          <p className="rows-group">Top of round {r + 1}, i is {6 - r}</p>
          <div className="ai-cells" role="img" aria-label={`geese holds ${a.join(", ")}, and geese[${6 - r}, 6) is sorted`}>
            {a.map((v, k) => cell(v, k, k >= 6 - r))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const bigO: Lesson = {
  n: 5,
  title: "Big-O",
  pages: [
    {
      title: "Every lineup",
      minutes: 1.5,
      body: (
        <>
          <p>
            Chonk wants a club photo with the geese lined up by height. Chonk&apos;s plan is to try every lineup until
            one is sorted. That always works. But is it a good plan?
          </p>
          <Comic
            panels={[
              { who: "chonk", outfit: "party", size: "l", pose: "point", say: "Try every lineup. Easy!" },
              { who: "honk", outfit: "takeoff", size: "s", pose: "think", say: "How many lineups is that?" },
            ]}
          />
          <Pick
            question="The observable universe has about 10⁸⁰ atoms. How many geese does it take to have more lineups than that?"
            options={["About 2000", "About 60", "About 300"]}
            answer={1}
            wrong={["It happens far sooner. Slide to 59 and look.", "", "It happens far sooner. Slide to 59 and look."]}
            explain="59 geese have about 1.4 × 10⁸⁰ lineups, and 200 geese have about 7.9 × 10³⁷⁴. A correct plan can still be hopeless, so this lecture measures how cost grows."
            after={<Lineups />}
          />
        </>
      ),
    },
    {
      title: "How long is long?",
      minutes: 1.5,
      body: (
        <>
          <p>
            So how do we measure cost? The first idea is to time the code. We ran the same search through a million
            geese three times, timing 200 searches each run.
          </p>
          <RunTable
            runs={[
              { call: <code>time ./a.out 1000000</code>, out: "0.17 seconds" },
              { call: <code>time ./a.out 1000000</code>, out: "0.20 seconds" },
              { call: <code>time ./a.out 1000000</code>, out: "0.22 seconds" },
            ]}
          />
          <Comic panels={[{ who: "honk", outfit: "drink", size: "m", pose: "shrug", say: "Same code, three different times?" }]} />
          <Pick
            question="Why not use seconds as our measure of cost?"
            options={["The input changed between runs", "Seconds depend on the machine and what else it is doing", "The code has a bug"]}
            answer={1}
            wrong={[
              "Each run searched the same million geese.",
              "",
              "The code is the same and gives the same answer each time. Only the time changes.",
            ]}
            explain="A faster laptop or a busy one changes the seconds without changing the code. We want a measure of the algorithm itself."
          />
          <FoodForThought title="Seconds still tell us something">
            <p>
              On the same machine, 2 million geese took 0.40 seconds and 4 million took 0.84. Doubling n about doubles
              the time. That pattern, and not the seconds themselves, is what we want to capture. It shows up on any
              machine, which is why counting steps works.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Count the steps",
      minutes: 2,
      body: (
        <>
          <p>
            So let&apos;s count <b>steps</b>, the simple operations the code does, instead of seconds. How many steps
            does <code>first_loud_goose</code> take on n geese when no goose is loud?
          </p>
          <Cols lead>
            <Code src={loud} label="first_loud_goose" />
            <Comic panels={[{ who: "chonk", outfit: "builder", size: "m", pose: "point", say: "Count every line, every time it runs." }]} />
          </Cols>
          <p className="task">How many times does each part run?</p>
          <Rows
            options={["1", "n", "n + 1"]}
            rows={[
              { prompt: <code>int i = 0</code>, answer: 0, why: "It runs once, before the loop.", miss: [undefined, "It sets i up once, before any iteration.", "It sets i up once, before any iteration."] },
              {
                prompt: <code>i &lt; n</code>,
                answer: 2,
                why: "It passes n times, then fails once more to end the loop.",
                miss: ["The guard runs before every iteration.", "Count the last check too, the one that fails and ends the loop.", undefined],
              },
              { prompt: <code>geese[i] &gt; 100</code>, answer: 1, why: "It runs once per iteration.", miss: ["It runs in every iteration.", undefined, "The body runs n times, not n + 1."] },
              { prompt: <code>i++</code>, answer: 1, why: "It runs at the end of each iteration.", miss: ["It runs in every iteration.", undefined, "The body runs n times, not n + 1."] },
              { prompt: <code>return -1</code>, answer: 0, why: "It runs once, after the loop.", miss: [undefined, "It is after the loop, so it runs once.", "It is after the loop, so it runs once."] },
            ]}
            after={
              <p>
                That&apos;s 1 + (n + 1) + n + n + 1 = 3n + 3 steps. A step really costs some constant time, so we
                write the <b>cost function</b> as T(n) = an + b for some constants a and b.
              </p>
            }
          />
        </>
      ),
    },
    {
      title: "The worst case",
      minutes: 1.5,
      body: (
        <>
          <p>
            We assumed no goose was loud. But <code>first_loud_goose</code> can return early, so the count depends on
            what is in <code>geese</code>. The <b>worst case</b> is the input of size n that takes the most steps.
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "karaoke", size: "xl", pose: "cheer", say: "HONK! I'm the loud one!" },
              { who: "chonk", outfit: "sleepy", size: "s", pose: "think", say: "Then the search stops at you." },
            ]}
          />
          <p className="task">Run each flock of 4 geese. Each return counts as a step.</p>
          <RunTable
            runs={[
              { call: <code>120 5 7 9</code>, out: "returns 0 after 4 steps" },
              { call: <code>5 120 7 9</code>, out: "returns 1 after 7 steps" },
              { call: <code>5 7 9 120</code>, out: "returns 3 after 13 steps" },
              { call: <code>5 7 9 8</code>, out: "returns -1 after 15 steps" },
            ]}
          />
          <Pick
            question="Which flock of size n makes it work hardest?"
            options={["A loud goose at index 0", "A loud goose in the middle", "No loud goose at all"]}
            answer={2}
            wrong={["That stops after 4 steps, the fewest.", "That stops halfway, so it does about half the work.", ""]}
            explain={
              <>
                With no loud goose, it checks every slot, 3n + 3 steps. We count the <Hi c={2}>worst case</Hi>, so
                our count is a promise for every input of size n.
              </>
            }
          />
          <FoodForThought title="Why not the average case?">
            <p>
              An average needs to know how often each input shows up. Is a loud goose usually near the front? We
              rarely know, so the course uses the worst case unless it says otherwise. Quicksort in Lecture 7 is a
              place where the average case matters, since it chooses its pivots at random.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Only big inputs matter",
      minutes: 1.5,
      body: (
        <>
          <p>
            Now we have a cost function. How do we compare two of them? Honk&apos;s plan takes 20n + 50 steps, and
            Chonk&apos;s takes n².
          </p>
          <Crossover f="20n + 50" g="n²" fName="Honk's plan" gName="Chonk's plan" />
          <Comic panels={[{ who: "chonk", outfit: "winter", size: "l", pose: "oops", say: "Mine wins for small n!" }]} />
          <Pick
            question="Which plan would you pick for a million geese?"
            options={["Chonk's plan", "Honk's plan", "Either, they're about the same"]}
            answer={1}
            wrong={["At a million, n² is 10¹² steps, and 20n + 50 is about 2 × 10⁷.", "", "They differ by a factor of about 50,000 at a million."]}
            explain="Even on a machine ten times faster, Chonk's plan falls behind from n = 203. Small inputs are fast either way, so we compare costs only for large n, and we ignore constant factors, since a faster machine just changes them."
          />
          <FoodForThought title="Constants still matter in practice">
            <p>
              Big-O ignores constants, but real code still feels them. Python&apos;s built-in sort uses insertion
              sort, an O(n²) method, on short stretches of a list, because for a few dozen items its small constant
              beats faster methods. Big-O picks the right algorithm for large n, and timing tunes it for small n.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Big-O",
      minutes: 2,
      body: (
        <>
          <p>
            <Big c={2}>Big-O</Big> makes that precise. For cost functions f and g, f ∈ O(g) if there is a real number <b>c</b> &gt; 0 and a natural number{" "}
            <b>n₀</b> such that f(n) ≤ c · g(n) for every n ≥ n₀.
          </p>
          <p>So c scales g, and n₀ says where &quot;large&quot; starts.</p>
          <p className="task">Find c and n₀ for 4n + 7. Can you for n²?</p>
          <Versions
            label="Functions"
            tabs={[
              { label: <>4n + 7 and n</>, body: <BigODef f="4n + 7" g="n" /> },
              { label: <>n² and n</>, body: <BigODef f="n²" g="n" /> },
            ]}
          />
          <Comic panels={[{ who: "honk", outfit: "valentine", size: "s", pose: "love", say: "c stretches the dashed line." }]} />
          <Pick
            question="Is n² ∈ O(n)?"
            options={["Yes, with a big c", "No", "Yes, with a big n₀"]}
            answer={1}
            wrong={["For c = 100, n² is bigger than 100n at n = 101.", "", "A bigger n₀ only looks further along, where n² is even further ahead."]}
            explain="Whatever c we choose, n² passes c · n for every n > c. O(g) is the set of functions that eventually stay under some multiple of g. Proving bounds rigorously is for 15-251, so in this course we reason about them informally."
          />
          <FoodForThought title="Big-O is an upper bound">
            <p>
              f ∈ O(g) says f grows no faster than g. Big-Θ also says it grows no slower, so f ∈ Θ(g) means f and g
              grow alike. The notes point out that Θ is often what we really mean, but computer scientists usually
              say O and give the tightest bound, as this course does.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Simplest and tightest",
      minutes: 2,
      body: (
        <>
          <p>
            Many sets describe the same cost, so which one do we write? A <Big c={2}>complexity class</Big> is a set
            O(g) for a simple g, such as O(n). We write it in <Hi c={2}>simplest and tightest form</Hi>. Keep the
            fastest-growing term, drop the rest and drop its constant.
          </p>
          <Comic panels={[{ who: "chonk", outfit: "tidy", size: "m", pose: "stand", say: "Tidy it up!" }]} />
          <p className="task">Give each cost function its class.</p>
          <Rows
            options={["O(1)", "O(log n)", "O(n²)", "O(2ⁿ)"]}
            rows={[
              { prompt: <>5n² + 3n + 83</>, answer: 2, why: "n² grows fastest, so 3n + 83 stops mattering.", miss: ["It grows with n.", "n² grows much faster than log n.", undefined, "There's no n in an exponent."] },
              { prompt: <>1000</>, answer: 0, why: "It never changes with n, so it's constant.", miss: [undefined, "1000 doesn't grow with n.", "1000 doesn't grow with n.", "1000 doesn't grow with n."] },
              { prompt: <>7 · 2ⁿ + n³</>, answer: 3, why: "2ⁿ eventually beats any power of n.", miss: ["It grows with n.", "It grows far faster than log n.", "At n = 20, 7 · 2ⁿ is already over 7 million, but n² is 400.", undefined] },
              { prompt: <>3 log₂ n + 10</>, answer: 1, why: "We drop the 3, the 10 and the base.", miss: ["It grows with n, slowly.", undefined, "log n grows much slower than n².", "log n grows much slower than 2ⁿ."] },
            ]}
          />
          <Pick
            question="Honk says the search on page 3 is O(n²). Is that right?"
            options={["No, it's O(n)", "Yes, and it's the tightest", "Yes, but it's not the tightest"]}
            answer={2}
            wrong={["3n + 3 ≤ n² once n ≥ 4, so it really is in O(n²).", "O(n) is smaller and still holds, so O(n²) isn't tightest.", ""]}
            explain="Every linear function is in O(n²), so it's true, but O(n) says more. When asked for the cost, give the tightest class."
          />
          <FoodForThought title="Why we drop the log base">
            <p>
              log_b n = log₂ n / log₂ b, and log₂ b is a constant. So changing the base only scales by a constant,
              which Big-O ignores, and O(log₂ n) = O(log₁₀ n). That&apos;s why the course writes O(log n) with no
              base.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "The class race",
      minutes: 2,
      body: (
        <>
          <p>So how different are the classes? Make a guess first, then check it with the race below.</p>
          <Comic
            panels={[
              { who: "honk", outfit: "diva", size: "m", pose: "dance", say: "Constant time never slows down!" },
              { who: "chonk", outfit: "hero", size: "xl", pose: "cheer", say: "And factorial is Chonk's photo plan!" },
            ]}
          />
          <p className="task">Order the classes from slowest growing to fastest growing.</p>
          <Order
            first="Slowest growing"
            last="Fastest growing"
            items={["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)", "O(n!)"]}
            start={[4, 1, 6, 2, 0, 5, 3]}
            why={[
              "O(1) never grows, so it's the slowest.",
              "At n = 64, log n is only 6, below n.",
              "At n = 64, n is 64, between log n and n log n.",
              "At n = 64, n log n is 384, between n and n².",
              "At n = 64, n² is 4096, far below 2ⁿ.",
              "At n = 64, 2ⁿ is about 1.8 × 10¹⁹, below n! at 1.3 × 10⁸⁹.",
              "n! multiplies by bigger and bigger numbers, so it grows fastest of all.",
            ]}
          />
          <p className="task">Press Play and watch the steps grow.</p>
          <Race />
        </>
      ),
    },
    {
      title: "More than one size",
      minutes: 1.5,
      body: (
        <>
          <p>
            Some inputs have more than one size. A goose photo is w pixels wide and h pixels high, so its cost can
            depend on both.
          </p>
          <Comic panels={[{ who: "honk", outfit: "pilgrim", size: "s", pose: "wave", say: "Say cheese!" }]} />
          <p className="task">What does each photo task cost?</p>
          <Rows
            options={["O(w)", "O(w + h)", "O(wh)"]}
            rows={[
              { prompt: "Brighten every pixel", answer: 2, why: "There are w × h pixels, and each one changes.", miss: ["That's only one row of pixels.", "That's about the border, but every pixel inside changes too."] },
              { prompt: "Draw a frame around the edge", answer: 1, why: "The edge has about 2w + 2h pixels.", miss: ["The frame has a left and a right side too, each h pixels.", undefined, "Only the edge changes, not the pixels inside."] },
              { prompt: "Darken the top row", answer: 0, why: "One row has w pixels.", miss: [undefined, "The sides aren't part of the top row.", "Only one row changes."] },
            ]}
          />
          <p>
            With two sizes, f(w, h) ∈ O(g(w, h)) if one c works for every w ≥ w₀ and h ≥ h₀.
          </p>
        </>
      ),
    },
    {
      title: "Tally it yourself",
      minutes: 2,
      body: (
        <>
          <p>
            Now we can skip writing T(n). For each line we note its cost and how many times it runs, then add up and
            keep the biggest term. A short reason is all you need.
          </p>
          <Comic panels={[{ who: "chonk", outfit: "detective", size: "s", pose: "think", say: "Look at the loops first." }]} />
          <Versions
            label="Functions"
            tabs={[
              {
                label: "honk_pairs",
                body: (
                  <>
                    <Code src={pairs} label="honk_pairs" />
                    <Pick
                      question="What does honk_pairs cost?"
                      options={["O(n)", "O(n²)", "O(2n)"]}
                      answer={1}
                      wrong={["The inner loop runs n times for each of the n outer iterations.", "", "That isn't in simplest form, and two nested loops multiply rather than add."]}
                      explain="The inner body runs n × n times and costs O(1) each time, so O(n²)."
                    />
                  </>
                ),
              },
              {
                label: "first_five",
                body: (
                  <>
                    <Code src={firstFive} label="first_five" />
                    <Pick
                      question="What does first_five cost?"
                      options={["O(1)", "O(n)", "O(5)"]}
                      answer={0}
                      wrong={["", "The loop runs 5 times whatever n is.", "That's the same set as O(1), but O(1) is the simplest form."]}
                      explain="The loop always runs 5 times, so the cost never grows with n."
                    />
                  </>
                ),
              },
              {
                label: "halvings",
                body: (
                  <>
                    <Code src={halvings} label="halvings" />
                    <Pick
                      question="What does halvings cost, in terms of honk?"
                      options={["O(honk)", "O(1)", "O(log honk)"]}
                      answer={2}
                      wrong={["honk halves each time, so for honk = 1024 the loop runs only 10 times.", "A bigger honk takes more iterations, such as 10 for 1024 and 20 for about a million.", ""]}
                      explain="Halving reaches 1 after about log₂ honk iterations, each O(1). Here the size is a value, honk, not an array length."
                    />
                  </>
                ),
              },
              {
                label: "loud_in_both",
                body: (
                  <>
                    <Code src={twoFlocks} label="loud_in_both" />
                    <Pick
                      question="What does loud_in_both cost?"
                      options={["O(n + m)", "O(nm)", "O(n)"]}
                      answer={0}
                      wrong={["", "The loops run one after the other, so their counts add.", "If m is much bigger than n, the second loop costs more than O(n)."]}
                      explain="n iterations and then m more, each O(1), so O(n + m)."
                    />
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Does order help?",
      minutes: 1.5,
      body: (
        <>
          <p>
            We can now tally linear search too. It is O(n), and on an unsorted array no search does better. But a{" "}
            <Big c={2}>sorted</Big> array does. <code>count_shorter</code> counts the geese shorter than{" "}
            <code>honk</code>, and it stops at the first goose that isn&apos;t.
          </p>
          <Code src={shorter} label="count_shorter" />
          <p className="task">
            <code>geese</code> holds 2 4 4 7 9. Run each call.
          </p>
          <RunTable
            runs={[
              { call: <code>count_shorter(1, geese, 5)</code>, out: "returns 0 after 1 iteration" },
              { call: <code>count_shorter(4, geese, 5)</code>, out: "returns 1 after 2 iterations" },
              { call: <code>count_shorter(10, geese, 5)</code>, out: "returns 5 after 5 iterations" },
            ]}
          />
          <Comic panels={[{ who: "honk", outfit: "fence", size: "m", pose: "shrug", say: "Stopping early sounds faster..." }]} />
          <Pick
            question="What is its worst case cost?"
            options={["O(log n)", "O(1)", "O(n)"]}
            answer={2}
            wrong={["It still steps one slot at a time.", "When honk is taller than every goose, it checks all n.", ""]}
            explain={
              <>
                Stopping early helps some inputs, but the worst case is still O(n). Order makes it possible to do
                much better, and <Link href="/lectures#l6">Binary search</Link> in Lecture 6 does. First we need
                sorted arrays, so let&apos;s sort.
              </>
            }
          />
          <FoodForThought title="No search beats O(n) on an unsorted array">
            <p>
              Suppose a search on an unsorted array skips some slot. Then the goose we want could be in exactly that
              slot, and the search would miss it. So every correct search of an unsorted array looks at all n slots
              in the worst case. That&apos;s a fact about the problem, not just one algorithm.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Saying order with arrayutil",
      minutes: 2,
      body: (
        <>
          <p>
            To reason about sorting, our contracts must say things like &quot;everything here is at most everything
            there&quot;. Writing those <Big c={1}>specification functions</Big>, functions we call in contracts, would be long, so
            the course gives us a library, <b>arrayutil</b>.
          </p>
          <Code src={arrayutil} label="Part of the arrayutil interface" />
          <p>
            We only read the <b>interface</b>, its names and contracts, and never its code. Using a function through
            its interface is <Big c={4}>abstraction</Big>.
          </p>
          <p className="task">Which function says each fact?</p>
          <Rows
            options={["is_sorted", "lt_seg", "ge_seg", "le_segs"]}
            rows={[
              { prompt: <>honk &lt; geese[lo, hi)</>, answer: 1, why: "lt_seg says honk is less than every goose in the segment.", miss: ["is_sorted takes no honk.", undefined, "ge_seg says greater than or equal.", "le_segs compares two segments."] },
              { prompt: <>geese[0, i) ≤ geese[i, n)</>, answer: 3, why: "le_segs compares every goose in one segment with every goose in the other.", miss: ["is_sorted looks at one segment.", "lt_seg compares one value with a segment.", "ge_seg compares one value with a segment.", undefined] },
              { prompt: <>honk ≥ geese[0, i)</>, answer: 2, why: "ge_seg says honk is at least every goose there.", miss: ["is_sorted takes no honk.", "lt_seg says less than.", undefined, "le_segs compares two segments."] },
              { prompt: <>geese[lo, hi) is sorted</>, answer: 0, why: "is_sorted says each goose is at most the next.", miss: [undefined, "lt_seg compares one value with a segment.", "ge_seg compares one value with a segment.", "le_segs compares two segments."] },
            ]}
          />
          <Pick
            question={
              <>
                <code>geese</code> holds 2 4 4 7 9. What does <code>lt_seg(3, geese, 2, 2)</code> return?
              </>
            }
            options={["false", "true", "It breaks its precondition"]}
            answer={1}
            wrong={["geese[2, 2) is empty, so there is no goose that 3 fails to be less than.", "", "0 <= 2, 2 <= 2 and 2 <= 5 all hold."]}
            explain="Every fact about all the geese in an empty segment is true. We'll lean on that in our proofs."
          />
        </>
      ),
    },
    {
      title: "Sorting by hand",
      minutes: 1.5,
      body: (
        <>
          <p>
            Let&apos;s sort Chonk&apos;s geese without trying every lineup. A <b>sort</b> must end with the geese in
            order, and with the same geese we started with. If we only ever <b>swap</b> two geese, nobody is lost or
            copied.
          </p>
          <Comic
            panels={[
              { who: "chonk", outfit: "grad", size: "m", pose: "wave", say: "Tallest to the back, every round!" },
              { who: "honk", outfit: "irish", size: "xs", pose: "stand", say: "I'll wait at the front." },
            ]}
          />
          <SwapSort cells={flock} />
          <p>
            This is <b>selection sort</b>. Each round selects the tallest goose left and swaps it to the back of
            the unsorted part. The lecture moves the shortest to the front instead, and ours is its mirror image.
          </p>
          <FoodForThought title="Why only swap?">
            <p>
              The result must be a <b>permutation</b> of the input, the same geese in some order. A swap keeps that
              true by itself, so we never have to prove it. That matters because, as in Lecture 4, C0 contracts
              can&apos;t compare an array with its old contents, so <code>@ensures</code> can&apos;t say it for us.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Draw the picture",
      minutes: 2,
      body: (
        <>
          <p>
            Now let&apos;s write it by <Big c={4}>deliberate programming</Big>, letting what must be true guide the
            code. A round is one iteration of the loop, so we ask what is true at the top of every round. Here are the first three rounds on the same geese, with the
            sorted part shaded.
          </p>
          <Cols>
            <Picture />
            <Comic panels={[{ who: "honk", outfit: "berry", size: "l", pose: "think", say: "What stays true every time?" }]} />
          </Cols>
          <p className="task">At the top of every round, is this true?</p>
          <Rows
            options={["Always", "Not always"]}
            rows={[
              { prompt: <>geese[i, hi) is sorted</>, answer: 0, why: "The shaded part is sorted in every picture.", miss: [undefined, "Check each shaded part. Empty, then 8, then 7 8 are all sorted."] },
              { prompt: <>geese[lo, i) is sorted</>, answer: 1, why: "In round 2, geese[0, 5) is 4 7 1 6 3.", miss: ["In round 2, geese[0, 5) is 4 7 1 6 3, which isn't sorted."] },
              { prompt: <>geese[lo, i) ≤ geese[i, hi)</>, answer: 0, why: "Each round took the tallest, so nobody left is taller than the sorted geese.", miss: [undefined, "In round 3, every goose in 4 3 1 6 is at most every goose in 7 8."] },
              { prompt: <>lo ≤ i ≤ hi</>, answer: 0, why: "i starts at hi and stops at lo.", miss: [undefined, "i counts down from hi to lo and no further."] },
            ]}
            after={
              <p>
                These three facts are our <Big c={1}>loop invariants</Big>. In arrayutil they read{" "}
                <code>lo &lt;= i &amp;&amp; i &lt;= hi</code>, <code>is_sorted(geese, i, hi)</code> and{" "}
                <code>le_segs(geese, lo, i, geese, i, hi)</code>.
              </p>
            }
          />
        </>
      ),
    },
    {
      title: "Code from the invariants",
      minutes: 2,
      body: (
        <>
          <p>
            With the invariants written down, the code nearly writes itself. Our helper{" "}
            <code>tallest_goose</code> is given by its contracts.
          </p>
          <Code src={tallest} label="tallest_goose, its contracts" />
          <Code src={sortBlanks} label="goose_sort, with two blanks" hi={[10, 11]} />
          <Comic panels={[{ who: "chonk", outfit: "wizard", size: "s", pose: "point", say: "Which part is still unsorted?" }]} />
          <Pick
            question="What fills blank 1?"
            options={[<code key="a">lo, hi</code>, <code key="b">i, hi</code>, <code key="c">lo, i</code>]}
            answer={2}
            wrong={[
              "geese[lo, hi) includes the sorted part, so the second round would find 8 again.",
              "geese[i, hi) is the sorted part. In round 1 it's empty, which breaks lo < hi in the precondition.",
              "",
            ]}
            explain="The unsorted part is geese[lo, i), and the guard lo < i means it's never empty."
            after={
              <Pick
                question="What fills blank 2?"
                options={[<code key="a">i</code>, <code key="b">i - 1</code>, <code key="c">hi - 1</code>]}
                answer={1}
                wrong={["In round 1 on 4 8 1 6 3 7, i is 6, which is out of bounds for swap.", "", "That spot is already sorted after round 1, so round 2 would undo it."]}
                explain="geese[i − 1] is the last slot of the unsorted part, so the tallest goose goes there."
                after={
                  <>
                    <p className="task">Now step through the finished code on 4 8 1 6 3 7.</p>
                    <Stepper src={sort} sets={[{ label: "4 8 1 6 3 7", steps: sortSteps(), array: { name: "geese", cells: flock } }]} />
                  </>
                }
              />
            }
          />
        </>
      ),
    },
    {
      title: "Is it safe?",
      minutes: 2,
      body: (
        <>
          <p>
            The stepper showed one run. Now let&apos;s use point-to reasoning to prove the calls on lines 10 and 11 meet
            their preconditions every time, as in <Link href="/lectures#l3">Lecture 3</Link>.
          </p>
          <Code src={sort} label="goose_sort" />
          <Comic panels={[{ who: "honk", outfit: "clown", size: "m", pose: "oops", say: "What if i − 1 is negative?" }]} />
          <ProofTable
            options={["Line 2", "Line 5", "Line 6", "Math on step 3 and line 2", "Math on steps 1 and 2", "Math on step 4"]}
            claims={[<code key="a">i &lt;= \length(geese)</code>, <code key="b">0 &lt;= i</code>, <code key="c">lo &lt; i</code>, <code key="d">i &lt; hi</code>]}
            rows={[
              {
                group: "Line 10, the call to tallest_goose",
                claim: <code>0 &lt;= lo</code>,
                answer: 0,
                why: "The precondition says 0 <= lo.",
                miss: [undefined, "The guard on line 5 is about lo and i.", "Line 6 bounds i, not lo.", "That's about i.", "This is the first step.", "There's no step 4 yet."],
              },
              {
                claim: <code>lo &lt; i</code>,
                claimAnswer: 2,
                answer: 1,
                why: "The loop guard is true inside the body.",
                miss: ["That's step 4, the upper bound.", "That's true, but line 10 needs lo < i.", undefined, "i starts at hi, so i < hi fails in round 1."],
              },
              {
                claim: <code>i &lt;= hi</code>,
                answer: 2,
                why: "The first loop invariant holds at the start of each iteration.",
                miss: ["Line 2 is about lo and hi, not i.", "The guard is lo < i, about the lower end.", undefined, "This step comes before step 4.", "Steps 1 and 2 are about lo.", "Step 4 is built from this step, so it can't justify it."],
              },
              {
                claim: <code>i &lt;= \length(geese)</code>,
                claimAnswer: 0,
                answer: 3,
                why: "i <= hi and hi <= \\length(geese).",
                miss: [undefined, "0 <= i is a lower bound, but line 10 needs the upper one here.", "That's step 2.", "i equals hi in round 1, so i < hi isn't true."],
              },
              {
                group: "Line 11, the call to swap",
                claim: <code>0 &lt;= i - 1</code>,
                answer: 4,
                why: "0 <= lo and lo < i, so lo <= i − 1 and 0 <= i − 1.",
                miss: ["Line 2 alone says nothing about i.", "The guard gives lo < i, but we also need 0 <= lo.", "Line 6 gives lo <= i, which allows i − 1 = lo − 1.", "Those are upper bounds.", undefined, "Step 4 is an upper bound."],
              },
              { claim: <code>i - 1 &lt; \length(geese)</code>, answer: 5, given: true },
            ]}
            after={
              <Pick
                question={
                  <>
                    And <code>tallest</code>? What says <code>lo &lt;= tallest &amp;&amp; tallest &lt; i</code>?
                  </>
                }
                options={["The loop invariant on line 6", "The postcondition of tallest_goose", "The guard on line 5"]}
                answer={1}
                wrong={["Line 6 is about i, not tallest.", "", "The guard is about i, not tallest."]}
                explain="Its @ensures says lo <= \result && \result < hi, and we called it with i as hi. With steps 1 and 4, swap's precondition holds."
              />
            }
          />
        </>
      ),
    },
    {
      title: "Start and finish",
      minutes: 2,
      body: (
        <>
          <p>
            Safe, but is it right? Let&apos;s show the invariants hold at the start, INIT, and that they give the
            postcondition when the loop ends, EXIT.
          </p>
          <Code src={sort} label="goose_sort" />
          <Comic panels={[{ who: "chonk", outfit: "reader", size: "m", pose: "think", say: "Safe isn't the same as sorted." }]} />
          <ProofTable
            options={["Line 2", "Line 5, i = hi", "Line 5, negated guard", "Line 6", "Math on steps 1 and 2", "Empty segment", "Math on steps 6 and 7", "Line 7 and step 8"]}
            claims={[<code key="a">i == lo</code>, <code key="b">is_sorted(geese, hi, hi)</code>, <code key="c">lo &lt;= hi</code>, <code key="d">is_sorted(geese, lo, lo)</code>]}
            rows={[
              {
                group: "INIT",
                claim: <code>i == hi</code>,
                answer: 1,
                why: "The loop starts i at hi.",
                miss: ["Line 2 doesn't set i.", undefined, "The guard isn't false at the start.", "Line 6 is what we're proving.", "This is the first step.", "This is about i, not a segment.", "Those steps are for EXIT.", "That's EXIT's last step."],
              },
              {
                claim: <code>lo &lt;= hi</code>,
                claimAnswer: 2,
                answer: 0,
                why: "The precondition says lo <= hi.",
                miss: ["That's for EXIT.", "That's geese[hi, hi), step 4.", undefined, "That segment isn't one our invariants mention."],
              },
              { claim: <code>lo &lt;= i &amp;&amp; i &lt;= hi</code>, answer: 4, given: true },
              {
                claim: <code>is_sorted(geese, hi, hi)</code>,
                claimAnswer: 1,
                answer: 5,
                why: "geese[hi, hi) is empty, so it's sorted.",
                miss: ["That's for EXIT.", undefined, "That's step 2.", "Line 7 with i = hi needs geese[hi, hi), not geese[lo, lo)."],
              },
              {
                claim: <code>le_segs(geese, lo, hi, geese, hi, hi)</code>,
                answer: 5,
                why: "geese[hi, hi) is empty, so every goose in geese[lo, hi) is at most every goose in it.",
                miss: ["Line 2 says nothing about le_segs.", "Line 5 sets i, but why is the fact true?", "The guard isn't false at the start.", "Line 6 is about i.", "Steps 1 and 2 are about bounds.", undefined, "Those steps are for EXIT.", "That's for EXIT."],
              },
              {
                group: "EXIT",
                claim: <code>i &lt;= lo</code>,
                answer: 2,
                why: "The loop ends when lo < i is false.",
                miss: ["Line 2 says nothing about i.", "That's how i starts, not how the loop ends.", undefined, "Line 6 gives lo <= i, the other direction.", "Those steps are for INIT.", "This is about i, not a segment.", "Step 6 can't cite itself.", "That's the last step."],
              },
              { claim: <code>lo &lt;= i</code>, answer: 3, given: true },
              {
                claim: <code>i == lo</code>,
                claimAnswer: 0,
                answer: 6,
                why: "i <= lo and lo <= i.",
                miss: [undefined, "That's for INIT.", "That's for INIT.", "We need a fact about i here."],
              },
              {
                claim: <code>is_sorted(geese, lo, hi)</code>,
                answer: 7,
                why: "Line 7 says geese[i, hi) is sorted, and i is lo.",
                miss: ["The precondition doesn't say geese is sorted.", "That's for INIT.", "The guard gives step 6, not sortedness.", "Line 6 is about i.", "Those steps are for INIT.", "geese[lo, hi) isn't empty in general.", "Steps 6 and 7 give step 8.", undefined],
              },
            ]}
          />
          <p>
            The loop also ends, since i goes down by 1 each round and stops at lo. EXIT never needed line 8, so why
            is it there? The next page shows we can&apos;t keep line 7 true without it.
          </p>
        </>
      ),
    },
    {
      title: "Keeping it sorted",
      minutes: 2,
      body: (
        <>
          <p>
            Now <b>PRES</b>, showing each round keeps the invariants true. We assume them at the top of a round,
            with i&apos; for the new i, and show <code>is_sorted(geese, i&apos;, hi)</code>. The bounds on line 6 work as in Lecture 3.
          </p>
          <Code src={sort} label="goose_sort" />
          <Comic panels={[{ who: "honk", outfit: "thanksgiving", size: "s", pose: "point", say: "Watch where the tallest goose lands." }]} />
          <ProofTable
            options={["Line 5, i--", "Assumption, line 7", "Assumption, line 8", "Postcondition of tallest_goose, line 10", "Line 11 and step 4", "Math on steps 3 and 5", "Math on steps 2, 5 and 6", "Math on steps 1 and 7"]}
            claims={[
              <code key="a">is_sorted(geese, i - 1, hi)</code>,
              <code key="b">le_segs(geese, lo, i, geese, i, hi)</code>,
              <span key="c">swap only moved geese inside geese[lo, i)</span>,
              <code key="d">is_sorted(geese, lo, i)</code>,
            ]}
            rows={[
              {
                claim: <code>i&apos; == i - 1</code>,
                answer: 0,
                why: "The i-- on line 5 makes the new value.",
                miss: [undefined, "We assume the invariants, not how i changes.", "We assume the invariants, not how i changes.", "Line 10 doesn't change i.", "Line 11 doesn't change i.", "Steps 3 and 5 are about geese.", "Those steps come later.", "Step 7 comes later."],
              },
              { claim: <code>is_sorted(geese, i, hi)</code>, answer: 1, given: true },
              {
                claim: <code>le_segs(geese, lo, i, geese, i, hi)</code>,
                claimAnswer: 1,
                answer: 2,
                why: "We assume line 8 at the top of the round, before the swap.",
                miss: ["That's what we want to show, step 7.", undefined, "This is the step that explains the swap, step 5.", "geese[lo, i) isn't sorted in general, as page 14 showed."],
              },
              {
                claim: <code>lo &lt;= tallest &amp;&amp; tallest &lt; i</code>,
                answer: 3,
                why: "tallest_goose promises an index in geese[lo, i).",
                miss: ["Line 5 is about i.", "Line 7 says nothing about tallest.", "Line 8 says nothing about tallest.", undefined, "Step 4 can't cite itself.", "Steps 3 and 5 are about geese.", "Those steps come later.", "Step 7 comes later."],
              },
              {
                claim: <span>swap only moved geese inside geese[lo, i)</span>,
                claimAnswer: 2,
                answer: 4,
                why: "It swapped slots tallest and i − 1, both below i, so geese[i, hi) is unchanged.",
                miss: ["That's step 7.", "That's step 3.", undefined, "geese[lo, i) isn't sorted in general."],
              },
              {
                claim: <code>le_seg(geese[i - 1], geese, i, hi)</code>,
                answer: 5,
                why: "geese[i − 1] came from geese[lo, i), and by step 3 it is at most every goose in geese[i, hi), which step 5 says is unchanged.",
                miss: ["Line 5 is about i.", "Line 7 is about geese[i, hi) alone.", "Line 8 was about the geese before the swap, so we need step 5 too.", "That's about geese[lo, i), not geese[i, hi).", "Step 5 says what moved, not how tall it is.", undefined, "Step 6 can't cite itself.", "Steps 1 and 7 come after."],
              },
              {
                claim: <code>is_sorted(geese, i - 1, hi)</code>,
                claimAnswer: 0,
                answer: 6,
                why: "geese[i, hi) is still sorted, and geese[i − 1] is at most all of it.",
                miss: [undefined, "That's step 3.", "That's step 5.", "That's the unsorted part."],
              },
              { claim: <code>is_sorted(geese, i&apos;, hi)</code>, answer: 7, given: true },
            ]}
          />
          <p>
            Step 3 is line 8. Without it, the goose swapped to <code>i - 1</code> could be taller than the sorted
            geese.
          </p>
        </>
      ),
    },
    {
      title: "Keeping the order",
      minutes: 2,
      body: (
        <>
          <p>
            Last proof. PRES for line 8 shows <code>le_segs(geese, lo, i&apos;, geese, i&apos;, hi)</code>, so the
            geese left over are no taller than the sorted ones.
          </p>
          <Code src={sort} label="goose_sort" />
          <Comic panels={[{ who: "chonk", outfit: "cozy", size: "l", pose: "love", say: "Last one, then it's proved!" }]} />
          <ProofTable
            options={["Postcondition of tallest_goose, line 10", "Line 11", "Assumption, line 8", "Math on steps 1 and 2", "Math on steps 2 and 4", "Math on steps 3 and 5", "Math on step 6 and line 5"]}
            claims={[
              <code key="a">le_segs(geese, lo, i - 1, geese, i, hi)</code>,
              <code key="b">ge_seg(geese[i - 1], geese, lo, i - 1)</code>,
              <code key="c">le_seg(geese[i - 1], geese, lo, i - 1)</code>,
              <code key="d">le_segs(geese, lo, i, geese, i - 1, hi)</code>,
            ]}
            rows={[
              {
                claim: <code>ge_seg(geese[tallest], geese, lo, i)</code>,
                answer: 0,
                why: "tallest_goose promises the goose at tallest is at least every goose in geese[lo, i).",
                miss: [undefined, "This is before the swap.", "Line 8 compares two segments, not one goose.", "This is the first step.", "This is the first step.", "This is the first step.", "This is the first step."],
              },
              { claim: <span>after line 11, geese[i − 1] is that tallest goose, and geese[lo, i) holds the same geese</span>, answer: 1, given: true },
              {
                claim: <code>ge_seg(geese[i - 1], geese, lo, i - 1)</code>,
                claimAnswer: 1,
                answer: 3,
                why: "The tallest goose is now at i − 1, and it's at least every goose before it.",
                miss: ["That's step 5.", undefined, "That says geese[i − 1] is at most the others, but it's the tallest.", "That's not what we need. Look at step 6."],
              },
              {
                claim: <code>le_segs(geese, lo, i, geese, i, hi)</code>,
                answer: 2,
                why: "We assume line 8 at the top of the round.",
                miss: ["tallest_goose says nothing about geese[i, hi).", "Line 11 changes geese, but this held before it.", undefined, "Steps 1 and 2 are about the tallest goose.", "Step 4 can't cite itself.", "Steps 3 and 5 come later.", "Step 6 comes later."],
              },
              {
                claim: <code>le_segs(geese, lo, i - 1, geese, i, hi)</code>,
                claimAnswer: 0,
                answer: 4,
                why: "geese[lo, i) holds the same geese after the swap, so geese[lo, i − 1) is still at most geese[i, hi).",
                miss: [undefined, "That's step 3.", "That says geese[i − 1] is at most the others, which is false.", "That's close to step 7, but we haven't got there yet."],
              },
              {
                claim: <code>le_segs(geese, lo, i - 1, geese, i - 1, hi)</code>,
                answer: 5,
                why: "geese[lo, i − 1) is at most geese[i − 1] by step 3, and at most geese[i, hi) by step 5.",
                miss: ["That's about one goose, step 1.", "Line 11 alone doesn't compare segments.", "Line 8 is about i, not i − 1.", "Those steps give step 3.", "Those steps give step 5.", undefined, "Step 7 comes after."],
              },
              { claim: <code>le_segs(geese, lo, i&apos;, geese, i&apos;, hi)</code>, answer: 6, given: true },
            ]}
          />
          <p>
            Every invariant holds at INIT and is preserved, the loop ends, and EXIT gives the postcondition. Since
            it only swaps, it keeps the same geese too. So <code>goose_sort</code> is correct.
          </p>
        </>
      ),
    },
    {
      title: "What does it cost?",
      minutes: 2,
      body: (
        <>
          <p>
            We proved it&apos;s correct. Now how fast is it? Let n = hi − lo, and say{" "}
            <code>tallest_goose(geese, lo, i)</code> scans geese[lo, i) once, making i − lo − 1 comparisons. swap is
            O(1).
          </p>
          <Comic panels={[{ who: "honk", outfit: "piada", size: "m", pose: "think", say: "Add up every round." }]} />
          <Pick
            question="How many comparisons do all the rounds make together?"
            options={["n", "(n − 1) + (n − 2) + … + 0", "n · log n"]}
            answer={1}
            wrong={["Each round does a whole scan, not one comparison.", "", "Each round scans one fewer goose, so the counts go down by 1, not by half."]}
            explain="The rounds scan n, n − 1, …, 1 geese, so they make n − 1, n − 2, …, 0 comparisons. That adds up to n(n − 1)/2."
          />
          <p className="task">Run each flock size.</p>
          <RunTable
            runs={[
              { call: <>n = 1000</>, out: "499,500 comparisons" },
              { call: <>n = 2000</>, out: "1,999,000 comparisons" },
              { call: <>n = 4000</>, out: "7,998,000 comparisons" },
            ]}
          />
          <Pick
            question="So goose_sort is O(___)?"
            options={["O(n), one loop over n", "O(n²), the n rounds scan about n/2 geese on average", "O(n log n), the scans get shorter"]}
            answer={1}
            wrong={["Each of the n rounds calls tallest_goose, which loops too.", "", "They get shorter by 1 each time, so on average a scan is still about n/2."]}
            explain={
              <>
                n(n − 1)/2 = n²/2 − n/2, which is O(n²). Doubling n about quadruples the work, as the table shows.
                Selection sort is <Hi c={2}>quadratic</Hi>.
              </>
            }
          />
          <FoodForThought title="Doubling tells you the class">
            <p>
              If code is O(n), doubling n roughly doubles its time. O(n²) roughly quadruples it, and O(n³) multiplies
              it by about 8. So timing a program at n and 2n is a quick check of your Big-O. The notes time selection
              sort this way and find ratios close to 4.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Your turn",
      minutes: 2,
      body: (
        <>
          <p>
            Now try <Big c={4}>deliberate programming</Big> on a function of your own. <code>first_taller</code>{" "}
            returns the index of the first goose taller than <code>honk</code> in a sorted array.
          </p>
          <Code src={taller} label="first_taller, with two blanks" hi={[5, 10]} />
          <Comic panels={[{ who: "honk", outfit: "rockstar", size: "l", pose: "wave", say: "Use arrayutil. You've got this!" }]} />
          <Pick
            question="What fills blank 1, so the result is the index of the first goose taller than honk?"
            options={[<code key="a">is_sorted(geese, 0, \result)</code>, <code key="b">lt_seg(honk, geese, 0, \result)</code>, <code key="c">ge_seg(honk, geese, 0, \result)</code>]}
            answer={2}
            wrong={[
              "That's always true for a sorted array. For geese holding 2 4 4 7 9 and honk 4, returning 5 would pass, though 7 at index 3 is taller.",
              "That says every goose before the result is taller. For 2 4 4 7 9 and honk 4, it rejects the right answer 3.",
              "",
            ]}
            explain="No goose before the result is taller than honk, and every goose from the result on is."
          />
          <Pick
            question="What fills blank 2?"
            options={[<code key="a">ge_seg(honk, geese, 0, i)</code>, <code key="b">lt_seg(honk, geese, i, n)</code>, <code key="c">ge_seg(honk, geese, 0, n)</code>]}
            answer={0}
            wrong={["", "That's the part we haven't looked at. For 2 4 4 7 9 and honk 4, it fails at once, since 2 isn't taller than 4.", "That says no goose at all is taller. For 2 4 4 7 9 and honk 4, it fails at once."]}
            explain="We've looked at geese[0, i), and none of them was taller. When the loop stops, either i == n or geese[i] > honk, and sortedness then gives the lt_seg half."
          />
          <Pick
            question="What does first_taller cost, and why?"
            options={["O(log n), the array is sorted", "O(1), it often stops early", "O(n), at most n iterations of O(1) work"]}
            answer={2}
            wrong={["Being sorted doesn't help here, since it still steps one slot at a time.", "For a honk taller than every goose, it checks all n.", ""]}
            explain="In the worst case honk is at least every goose, so the loop runs n times, each O(1)."
          />
        </>
      ),
    },
    {
      title: "Where this goes next",
      minutes: 1.5,
      body: (
        <>
          <p>
            We counted steps up to constants to see which algorithm wins as inputs grow, and we proved a sort
            correct with arrayutil and <Big c={1}>loop invariants</Big>. This was the second of four lectures on{" "}
            <Big c={4}>deliberate programming</Big>.
          </p>
          <Comic
            panels={[
              { who: "chonk", outfit: "plain", size: "xl", pose: "cheer", say: "Correct and quadratic!" },
              { who: "honk", outfit: "love", size: "m", pose: "dance", say: "And order is what lets us do better." },
            ]}
          />
          <p className="task">Match each idea to its lecture.</p>
          <Rows
            options={laterNames}
            rows={[
              { prompt: "Sort faster than O(n²) by splitting the array in two", answer: 1, why: <><Link href="/lectures#l7">Quicksort</Link>, Lecture 7, sorts with divide and conquer.</>, miss: laterMiss(1) },
              { prompt: "Use a sorted array to search in O(log n)", answer: 0, why: <><Link href="/lectures#l6">Binary search</Link>, Lecture 6, halves the segment each time.</>, miss: laterMiss(0) },
              { prompt: "Spread the cost of a rare slow step over many fast ones", answer: 2, why: <><Link href="/lectures#l11">Unbounded arrays</Link>, Lecture 11, use amortized cost.</>, miss: laterMiss(2) },
            ]}
          />
        </>
      ),
    },
  ],
};
