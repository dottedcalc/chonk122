import Link from "next/link";
import { Big } from "@/components/lesson/Big";
import { Code } from "@/components/lesson/Code";
import { Cols } from "@/components/lesson/Cols";
import { Comic } from "@/components/lesson/Comic";
import { FoodForThought } from "@/components/lesson/FoodForThought";
import { Hi } from "@/components/lesson/Hi";
import { LookFor } from "@/components/lesson/LookFor";
import { Pick } from "@/components/lesson/Pick";
import { ProofTable } from "@/components/lesson/ProofTable";
import { Rows } from "@/components/lesson/Rows";
import { RunTable } from "@/components/lesson/RunTable";
import { Segment } from "@/components/lesson/Segment";
import { Stepper, type Step } from "@/components/lesson/Stepper";
import { Versions } from "@/components/lesson/Versions";
import type { Lesson } from "./types";

// Lecture 4, Searching arrays. Every output below was checked with gcc or by tracing; see docs/lessons/04-notes.md.

const first = `int goose_search(int honk, int[] geese, int n) {
  for (int i = 0; i < n; i++) {
    if (geese[i] == honk) return i;
  }
}`;

const safe = `int goose_search(int honk, int[] geese, int n)
//@requires n == \\length(geese);
{
  for (int i = 0; i < n; i++)
  //@loop_invariant 0 <= i;
  {
    if (geese[i] == honk) return i;
  }
  return -1;
}`;

const caller = `int k = goose_search(honk, geese, 4);
if (k != -1) {
  geese[k] = 0;
}`;

const head = `int goose_search(int honk, int[] geese, int n)
//@requires n == \\length(geese);`;

const boundsFirst = `${head}
/*@ensures \\result == -1
        || (0 <= \\result && \\result < n && geese[\\result] == honk); @*/`;

const elementFirst = `${head}
/*@ensures \\result == -1
        || (geese[\\result] == honk && 0 <= \\result && \\result < n); @*/`;

const returnsN = `{
  for (int i = 0; i < n; i++)
  //@loop_invariant 0 <= i;
  {
    if (geese[i] == honk) return i;
  }
  return n;
}`;

const exploit = `${boundsFirst}
{
  return -1;
}`;

const strong = `${head}
/*@ensures (\\result == -1 && !is_in(honk, geese, 0, n))
        || (0 <= \\result && \\result < n && geese[\\result] == honk); @*/`;

const isIn = `bool is_in(int x, int[] A, int lo, int hi)
//@requires 0 <= lo && lo <= hi && hi <= \\length(A);
{
  if (lo == hi) return false;
  return A[lo] == x || is_in(x, A, lo+1, hi);
}`;

const allPos = `bool all_pos_geese(int[] geese, int lo, int hi)
//@requires 0 <= lo && lo <= hi && hi <= \\length(geese);
{
  if (lo == hi) return __1__;
  return geese[lo] > 0 __2__ all_pos_geese(geese, lo + 1, hi);
}`;

const strongExploit = `${strong}
{
  return -1;
}`;

const final = `${strong}
{
  for (int i = 0; i < n; i++)
  //@loop_invariant 0 <= i && i <= n;
  //@loop_invariant !is_in(honk, geese, 0, i);
  {
    if (geese[i] == honk) return i;
  }
  return -1;
}`;

const scopeEnd = `  {
    if (geese[i] == honk) return i;
  }
  //@assert i == n;
  return -1;
}`;

const exploitA = `${strong}
{
  if (n == 0) return -1;
  geese[n - 1] = honk;
  return n - 1;
}`;

const exploitB = `${strong}
{
  for (int i = 0; i < n; i++)
  //@loop_invariant 0 <= i && i <= n;
  //@loop_invariant !is_in(honk, geese, 0, i);
  {
    if (geese[i] == honk) geese[i] = honk + 1;
  }
  return -1;
}`;

const test = `int main() {
  int[] geese = alloc_array(int, 3);
  geese[0] = 4;
  geese[1] = 9;
  geese[2] = 5;
  assert(goose_search(5, geese, 3) == 2);
  return 0;
}`;

const last = `int goose_last(int honk, int[] geese, int n)
//@requires n == \\length(geese);
/*@ensures (\\result == -1 && !is_in(honk, geese, 0, n))
        || (0 <= \\result && \\result < n && geese[\\result] == honk
            && __1__); @*/
{
  for (int i = n - 1; i >= 0; i--)
  //@loop_invariant __2__;
  //@loop_invariant __3__;
  {
    if (geese[i] == honk) return i;
  }
  return -1;
}`;

const flock = [3, 8, 5, 1];
const inv = (ok = true) => [{ label: "!is_in(honk, geese, 0, i)", value: ok ? "true" : "false", ok }];

// The loop of goose_search on 3 8 5 1, stopping at each loop invariant check and each test on line 10.
function walk(honk: number): Step[] {
  const steps: Step[] = [];
  for (let i = 0; i <= flock.length; i++) {
    steps.push({ line: 8, vars: { honk, i }, seg: [0, i], checks: inv() });
    if (i === flock.length) break;
    const hit = flock[i] === honk;
    steps.push({
      line: 10,
      vars: { honk, i },
      seg: [0, i],
      at: i,
      note: hit ? `geese[${i}] is ${honk}, so we return ${i}.` : `geese[${i}] is ${flock[i]}, not ${honk}, so we keep going.`,
    });
    if (hit) return steps;
  }
  steps[steps.length - 1].note = "The loop guard i < n is false now.";
  steps.push({ line: 12, vars: { honk, i: 4 }, seg: [0, 4], note: "We looked at every slot, so honk isn't in geese[0, 4)." });
  return steps;
}

const tests = ["Exploit A only", "Exploit B only", "Both"];

const laterNames = ["Big-O", "Binary search", "Quicksort"];
const laterMiss = (k: number) => laterNames.map((m, j) => (j === k ? undefined : `${m} fits another row better.`));

export const search: Lesson = {
  n: 4,
  title: "Searching arrays",
  pages: [
    {
      title: "Where is goose 5?",
      minutes: 1.5,
      body: (
        <>
          <p>
            Chonk keeps the goose club&apos;s roster in an array of goose IDs. Today Chonk needs the goose with ID 5.
            Can you find it?
          </p>
          <Comic
            panels={[
              { who: "chonk", outfit: "detective", size: "l", pose: "think", say: "Goose 5, where are you?" },
              { who: "honk", outfit: "love", size: "s", pose: "point", say: "Just look in every slot!" },
            ]}
          />
          <p className="task">Tap slots to look inside.</p>
          <LookFor name="roster" cells={[8, 3, 11, 5, 14, 2, 9, 6]} targets={[5, 12]} />
          <p>
            That&apos;s <b>linear search</b>, checking each element in turn. It sounds too simple to get wrong. But how
            would we <Hi c={1}>know</Hi> our code is right for every roster, and not just this one? That&apos;s what
            this lecture is about.
          </p>
        </>
      ),
    },
    {
      title: "Safety first",
      minutes: 1.5,
      body: (
        <>
          <p>Here&apos;s a first try at linear search in C0. It returns the index where it finds honk.</p>
          <Code src={first} label="goose_search, first try" />
          <Comic panels={[{ who: "honk", outfit: "umpire", size: "m", pose: "point", say: "Two problems. Can you spot them?" }]} />
          <Pick
            question="Why doesn't it compile?"
            options={["Nothing is returned after the loop", "geese[i] might be out of bounds", "i is never declared"]}
            answer={0}
            wrong={[
              "",
              "That's a safety problem, and the compiler doesn't catch it. Contracts do.",
              "Line 2 declares i in the for loop.",
            ]}
            explain="When honk isn't in geese, the loop ends and the function has nothing to return. We'll fix that on the next page."
          />
          <Pick
            question={
              <>
                Which contracts let us prove <code>geese[i]</code> is safe, as in{" "}
                <Link href="/lessons/3">Lecture 3</Link>?
              </>
            }
            options={[
              <code key="a">n == \length(geese)</code>,
              <span key="b">
                <code>n == \length(geese)</code> and <code>0 &lt;= i</code>
              </span>,
              <span key="c">
                <code>n &gt;= 0</code> and <code>0 &lt;= i</code>
              </span>,
            ]}
            answer={1}
            wrong={[
              <span key="a">
                The guard gives <code>i &lt; n</code>, but nothing we can point to says <code>0 &lt;= i</code>.
              </span>,
              "",
              <span key="c">
                If geese has length 3 and n is 5, then <code>geese[3]</code> is out of bounds.
              </span>,
            ]}
            explain={
              <>
                The precondition says n is the length, and the loop invariant <code>0 &lt;= i</code> gives the lower
                bound. With <code>i &lt; n</code> from the guard, every access is in bounds.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "What if it isn't there?",
      minutes: 1.5,
      body: (
        <>
          <p>
            So what should we return when honk isn&apos;t in geese? Every index is at least 0, so we return{" "}
            <code>-1</code>, which can&apos;t be mistaken for an index.
          </p>
          <Code src={safe} label="goose_search, safe" hi={[9]} />
          <Comic
            panels={[
              { who: "chonk", outfit: "reader", size: "s", pose: "shrug", say: "So how do I use the answer?" },
              { who: "honk", outfit: "shore", size: "m", pose: "think", say: "Check for -1 first!" },
            ]}
          />
          <Code src={caller} label="A caller of goose_search" />
          <p className="task">
            geese holds 3 8 5 1. What is <code>k</code>?
          </p>
          <Rows
            options={["0", "2", "-1"]}
            rows={[
              {
                prompt: <>When honk is 5</>,
                answer: 1,
                why: "geese[2] is 5, so the caller sets geese[2] to 0.",
                miss: ["geese[0] is 3, not 5.", undefined, "5 is in geese, at index 2."],
              },
              {
                prompt: <>When honk is 6</>,
                answer: 2,
                why: "6 isn't in geese, so the caller skips the if and changes nothing.",
                miss: ["geese[0] is 3, and 6 is nowhere in geese.", "geese[2] is 5, not 6.", undefined],
              },
            ]}
          />
          <FoodForThought title="Why -1?">
            <p>
              A value that means &quot;not found&quot; must never be a real answer. Indices start at 0, so any negative
              number works, and -1 is the usual pick. Java&apos;s <code>indexOf</code> and Python&apos;s{" "}
              <code>str.find</code> also return -1 when they find nothing. Python&apos;s <code>list.index</code> raises
              an error instead, which C0 can&apos;t do, since it has no exceptions.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Promises to the caller",
      minutes: 2,
      body: (
        <>
          <p>
            The caller can&apos;t read our code, so how does it know -1 can come back, or that{" "}
            <code>geese[k]</code> is safe? We put it in a postcondition, a <Big c={1}>contract</Big> the caller can
            point to.
          </p>
          <Comic panels={[{ who: "honk", outfit: "inclass", size: "l", pose: "think", say: "Does the order inside the && matter?" }]} />
          <p className="task">
            Say a bug makes the function return n instead of -1. Run it with <code>-d</code> on each version.
          </p>
          <Versions
            label="Order of the postcondition"
            tabs={[
              {
                label: "Bounds first",
                body: (
                  <>
                    <Code src={`${boundsFirst}\n${returnsN}`} label="Bounds checked first" hi={[4]} />
                    <RunTable
                      runs={[
                        {
                          call: <code>goose_search(6, geese, 4)</code>,
                          out: "The run stops because the @ensures on line 3 fails.",
                          ok: false,
                        },
                      ]}
                    />
                  </>
                ),
              },
              {
                label: "Element first",
                body: (
                  <>
                    <Code src={`${elementFirst}\n${returnsN}`} label="Element checked first" hi={[4]} />
                    <RunTable
                      runs={[
                        {
                          call: <code>goose_search(6, geese, 4)</code>,
                          out: <code>Error: accessing element 4 in 4-element array</code>,
                          ok: false,
                        },
                      ]}
                    />
                  </>
                ),
              },
            ]}
          />
          <Pick
            question={
              <>
                Why is <code>geese[\result]</code> safe in the bounds first version?
              </>
            }
            options={[
              <span key="a">
                <code>&amp;&amp;</code> skips it once <code>\result &lt; n</code> is false
              </span>,
              <span key="b">
                <code>\result</code> is always less than n
              </span>,
              "Contracts never go out of bounds",
            ]}
            answer={0}
            wrong={["", "The buggy version returns n, which is 4 here.", "The element first version just did."]}
            explain={
              <>
                This is <b>short-circuiting</b>. If the left side of <code>&amp;&amp;</code> is false, C0 never
                evaluates the right side. <code>||</code> skips its right side when the left is true.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "A contract exploit",
      minutes: 1.5,
      body: (
        <>
          <p>
            A function is <b>correct</b> when its postconditions hold whenever its preconditions hold. Honk wrote a
            very short goose_search. Is it correct?
          </p>
          <Code src={exploit} label="A very short goose_search" hi={[6]} />
          <Comic
            panels={[
              { who: "chonk", outfit: "wizard", size: "m", pose: "oops", say: "That can't be right!" },
              { who: "honk", outfit: "frankenstein", size: "xl", pose: "dance", say: "Every contract passes!" },
            ]}
          />
          <RunTable
            runs={[{ call: <code>goose_search(5, geese, 4)</code>, out: "returns -1, and every contract passes" }]}
          />
          <Rows
            options={["Yes", "No"]}
            rows={[
              {
                prompt: "Is it correct?",
                answer: 0,
                why: "The postcondition allows -1 for any input, so it always holds.",
                miss: [undefined, "Check the postcondition. \\result == -1 makes it true on every input."],
              },
              {
                prompt: "Does it do what we want?",
                answer: 1,
                why: "geese holds 3 8 5 1, so 5 is at index 2, but it says -1.",
                miss: ["It never looks at geese, so it can't find 5 at index 2."],
              },
            ]}
          />
          <p>
            Code that is correct but doesn&apos;t do what we want is a <Big c={1}>contract exploit</Big>. It means{" "}
            <Hi c={1}>our postcondition is too weak</Hi>.
          </p>
        </>
      ),
    },
    {
      title: "Array segments",
      minutes: 1.5,
      body: (
        <>
          <p>
            To rule that out, the postcondition must say &quot;-1 only when honk isn&apos;t in geese&quot;. First we
            need a way to talk about part of an array.
          </p>
          <Cols lead>
            <ul>
              <li>
                geese[lo, hi) is the <b>array segment</b> from index lo included to index hi excluded.
              </li>
              <li>It makes sense only when 0 ≤ lo ≤ hi ≤ the length of geese.</li>
            </ul>
            <Comic
              panels={[
                { who: "honk", outfit: "fence", size: "xs", pose: "think", say: "Why leave hi out?" },
                { who: "chonk", outfit: "builder", size: "m", pose: "point", say: "Try it and see." },
              ]}
            />
          </Cols>
          <p className="task">Slide lo and hi.</p>
          <Segment name="geese" cells={[7, 3, 12, 5, 8]} />
          <Rows
            options={["hi − lo", "hi − lo + 1", "hi − lo − 1"]}
            rows={[
              {
                prompt: "geese[lo, hi) holds this many elements",
                answer: 0,
                why: "So geese[3, 3) is empty, and geese[0, n) is the whole array when n is the length.",
                miss: [undefined, "That would include geese[hi]. geese[1, 4) holds 3 elements.", "geese[1, 4) holds 3 elements, not 2."],
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Specification functions",
      minutes: 2,
      body: (
        <>
          <p>
            To use &quot;honk is in geese[lo, hi)&quot; in a contract, we write a <Big c={1}>specification
            function</Big>, code that copies the math so closely it&apos;s obviously correct. These are meant for
            contracts, often recursive and usually without postconditions. The course&apos;s <code>is_in</code> is
            one.
          </p>
          <Code src={isIn} label="is_in" />
          <Comic
            panels={[
              { who: "chonk", outfit: "chef", size: "m", pose: "point", say: "One line per case of the math." },
              { who: "honk", outfit: "pilgrim", size: "s", pose: "think", say: "Which case is which?" },
            ]}
          />
          <p className="task">Match each case of x ∈ A[lo, hi) to its code.</p>
          <Rows
            options={["Line 4", "Line 5, left of ||", "Line 5, right of ||"]}
            rows={[
              {
                prompt: "It's false when lo = hi",
                answer: 0,
                why: "An empty segment holds nothing.",
                miss: [undefined, "That part checks A[lo], which only exists when lo < hi.", "That part recurses, but this case stops."],
              },
              {
                prompt: "It's true when lo < hi and A[lo] = x",
                answer: 1,
                why: "x is the first element of the segment.",
                miss: ["Line 4 handles the empty segment.", undefined, "The recursive call looks past A[lo]."],
              },
              {
                prompt: "Otherwise, it's x ∈ A[lo + 1, hi)",
                answer: 2,
                why: "If A[lo] isn't x, look in the rest of the segment.",
                miss: ["Line 4 handles the empty segment.", "That part checks A[lo] itself.", undefined],
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Write your own",
      minutes: 2,
      body: (
        <>
          <p>
            <code>is_in</code> came from the course, but you&apos;ll often write your own{" "}
            <Big c={1}>specification functions</Big>. Let&apos;s write one that is true when every goose weight in
            geese[lo, hi) is positive.
          </p>
          <Comic panels={[{ who: "honk", outfit: "karaoke", size: "l", pose: "cheer", say: "Same shape as is_in. Two blanks to fill!" }]} />
          <Code src={allPos} label="all_pos_geese, with two blanks" hi={[4, 5]} />
          <Rows
            options={["true", "false", "&&", "||"]}
            rows={[
              {
                prompt: "Blank 1",
                answer: 0,
                why: "An empty segment has no goose that breaks the rule.",
                miss: [
                  undefined,
                  "Every call ends at an empty segment, so the function would always be false, even for geese holding just 2.",
                  "Blank 1 is a return value, so it's true or false.",
                  "Blank 1 is a return value, so it's true or false.",
                ],
              },
              {
                prompt: "Blank 2",
                answer: 2,
                why: "The first goose must be positive and so must the rest.",
                miss: [
                  "Blank 2 joins two bools, so it's && or ||.",
                  "Blank 2 joins two bools, so it's && or ||.",
                  undefined,
                  "With ||, geese holding 2 and −1 would count, since 2 > 0 is enough.",
                ],
              },
            ]}
          />
          <p className="task">geese holds 2 7 −1. Run it.</p>
          <RunTable
            runs={[
              { call: <code>all_pos_geese(geese, 0, 2)</code>, out: "true" },
              { call: <code>all_pos_geese(geese, 0, 3)</code>, out: "false" },
              { call: <code>all_pos_geese(geese, 1, 1)</code>, out: "true" },
            ]}
          />
          <FoodForThought title="All versus any">
            <p>
              <code>is_in</code> asks whether some element matches, so an empty segment gives false. A function about
              every element, like this one, gives true on an empty segment, since nothing there breaks the rule. The
              two mirror each other, and <code>!is_in(x, A, lo, hi)</code> says every element differs from x. Later
              segment functions such as <code>is_sorted</code> in <Link href="/lectures#l6">Binary search</Link>{" "}
              follow the same pattern.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Closing the loophole",
      minutes: 1.5,
      body: (
        <>
          <p>
            Back to Honk&apos;s exploit. We add <code>!is_in(honk, geese, 0, n)</code> to the -1 case, so -1 now
            really means &quot;not there&quot;.
          </p>
          <Code src={strongExploit} label="The exploit against the stronger postcondition" hi={[3]} />
          <Comic
            panels={[
              { who: "chonk", outfit: "hero", size: "xl", pose: "cheer", say: "Try that again, Honk." },
              { who: "honk", outfit: "berry", size: "s", pose: "oops", say: "Uh oh." },
            ]}
          />
          <p className="task">
            geese holds 3 8 5 1. Run with <code>-d</code>.
          </p>
          <RunTable
            runs={[
              { call: <code>goose_search(5, geese, 4)</code>, out: "The run stops because the @ensures on line 3 fails.", ok: false },
              { call: <code>goose_search(6, geese, 4)</code>, out: "returns -1, and every contract passes", ok: true },
            ]}
          />
          <Pick
            question={
              <>
                Does <code>is_in(honk, geese, 0, n)</code> meet its own precondition?
              </>
            }
            options={["Yes, always", "Only when n > 0", "No, n might be negative"]}
            answer={0}
            wrong={["", "is_in allows lo == hi, the empty segment.", "Line 2 says n is a length, and lengths are never negative."]}
            explain={
              <>
                It needs <code>0 &lt;= 0 &amp;&amp; 0 &lt;= n &amp;&amp; n &lt;= \length(geese)</code>, and line 2
                gives all of that.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Proving the found case",
      minutes: 2,
      body: (
        <>
          <p>
            Here is the real goose_search with the stronger postcondition. Is it correct? It has two returns, and the
            postcondition is an <code>||</code>, so <Hi c={1}>each return must make one side true</Hi>. First, the
            return on line 10.
          </p>
          <Code src={final} label="goose_search, final version" hi={[10]} />
          <Comic
            panels={[
              { who: "honk", outfit: "diva", size: "m", pose: "think", say: "We just found it, so it's easy. Right?" },
            ]}
          />
          <p className="task">
            Prove <code>0 &lt;= \result &amp;&amp; \result &lt; n &amp;&amp; geese[\result] == honk</code>. Fill in
            each blank.
          </p>
          <ProofTable
            options={["Line 6", "Line 7", "Line 10", "Steps 1 to 4"]}
            claims={[
              <code key="a">0 &lt;= i</code>,
              <code key="b">geese[i] == honk</code>,
              <code key="c">i &lt;= n</code>,
              <code key="d">geese[i] != honk</code>,
            ]}
            rows={[
              {
                claim: <code>\result == i</code>,
                answer: 2,
                why: "Line 10 returns i.",
                miss: ["Line 6 makes i, but doesn't return it.", "Line 7 is a loop invariant about i.", undefined, "This is the first step."],
              },
              {
                claim: <code>0 &lt;= i</code>,
                claimAnswer: 0,
                answer: 1,
                why: "The loop invariant is true at the start of each iteration.",
                miss: [undefined, "That's step 4.", "That's also from line 7, but this step needs the lower bound.", "Line 10 only returns when geese[i] == honk."],
              },
              {
                claim: <code>i &lt; n</code>,
                answer: 0,
                why: "The loop guard is true inside the body.",
                miss: [undefined, "Line 7 only gives i <= n, which allows i == n.", "Line 10 says nothing about n.", "Steps 1 to 4 come later."],
              },
              {
                claim: <code>geese[i] == honk</code>,
                claimAnswer: 1,
                answer: 2,
                why: "We only return on line 10 when the test is true.",
                miss: ["That's step 2.", undefined, "That's a loop invariant, not what line 10 tests.", "Then line 10 wouldn't return."],
              },
              {
                claim: <code>0 &lt;= \result &amp;&amp; \result &lt; n &amp;&amp; geese[\result] == honk</code>,
                answer: 3,
                why: "Swap \\result for i using step 1, then use steps 2, 3 and 4.",
                miss: ["Line 6 alone doesn't say what's returned.", "Line 7 alone doesn't say what's returned.", "Line 10 alone doesn't give the bounds.", undefined],
              },
            ]}
          />
          <p>
            We never needed EXIT, the step that uses the loop invariant after the loop ends. When we return from
            inside the loop, the loop invariant isn&apos;t checked again.
          </p>
        </>
      ),
    },
    {
      title: "What do we know so far?",
      minutes: 1.5,
      body: (
        <>
          <p>
            Now the return on line 12. It must show <code>!is_in(honk, geese, 0, n)</code>, and no single line says
            that. So what do we know each time the loop comes around?
          </p>
          <Cols>
            <p>
              Every slot before i, we looked at and didn&apos;t find honk. That&apos;s true on every iteration, which
              makes it a candidate <Big c={1}>loop invariant</Big>.
            </p>
            <Comic
              panels={[
                { who: "chonk", outfit: "sleepy", size: "s", pose: "think", say: "Everything behind us is checked." },
                { who: "honk", outfit: "takeoff", size: "l", pose: "point", say: "So say it as a contract!" },
              ]}
            />
          </Cols>
          <Pick
            question="Which loop invariant says that?"
            options={[
              <code key="a">!is_in(honk, geese, 0, i)</code>,
              <code key="b">!is_in(honk, geese, 0, n)</code>,
              <code key="c">geese[i] != honk</code>,
            ]}
            answer={0}
            wrong={[
              "",
              "That says honk is nowhere in geese, which is false when honk is 5 and geese holds 3 8 5 1.",
              "That's one slot, and the one we haven't checked yet. It's false at index 2 when honk is 5.",
            ]}
            explain={
              <>
                It covers geese[0, i), the part we&apos;ve looked at. Step through and watch it grow.
                <Stepper
                  src={final}
                  sets={[
                    { label: "honk is 6", steps: walk(6), array: { name: "geese", cells: flock } },
                    { label: "honk is 5", steps: walk(5), array: { name: "geese", cells: flock } },
                  ]}
                />
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Proving the new invariant",
      minutes: 2,
      body: (
        <>
          <p>
            Before we can point to line 8, we have to prove it&apos;s a <Big c={1}>loop invariant</Big>. INIT shows
            it holds before the first check, and PRES shows one iteration keeps it true. We write i&apos; for i after
            one more iteration.
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "irish", size: "m", pose: "shrug", say: "What if line 10 returns?" },
              { who: "chonk", outfit: "grad", size: "m", pose: "point", say: "Then there's no next check to worry about." },
            ]}
          />
          <p className="task">Fill in each blank.</p>
          <ProofTable
            options={["Line 6", "Line 10", "Assumption", "Definition of is_in", "Math on steps 1 and 2", "Math on steps 5 and 7"]}
            claims={[
              <code key="a">!is_in(honk, geese, 0, 0)</code>,
              <code key="b">geese[i] != honk</code>,
              <code key="c">is_in(honk, geese, 0, 0)</code>,
              <code key="d">geese[i] == honk</code>,
            ]}
            rows={[
              {
                group: "INIT",
                claim: <code>i == 0</code>,
                answer: 0,
                why: "The loop starts i at 0.",
                miss: [undefined, "Line 10 is inside the loop body.", "INIT has nothing to assume yet.", "is_in says nothing about i.", "This is the first step.", "This is the first step."],
              },
              {
                claim: <code>!is_in(honk, geese, 0, 0)</code>,
                claimAnswer: 0,
                answer: 3,
                why: "geese[0, 0) is empty, so is_in returns false.",
                miss: [undefined, "That's about the loop body, which hasn't run yet.", "Line 4 of is_in returns false for an empty segment.", "That's about the loop body, which hasn't run yet."],
              },
              { claim: <code>!is_in(honk, geese, 0, i)</code>, answer: 4, given: true },
              { group: "PRES", claim: <code>!is_in(honk, geese, 0, i)</code>, answer: 2, given: true },
              {
                claim: <code>i&apos; == i + 1</code>,
                answer: 0,
                why: "The i++ on line 6 makes the new value.",
                miss: [undefined, "Line 10 doesn't change i.", "We assume the invariant, not how i changes.", "is_in says nothing about i.", "Steps 1 and 2 belong to INIT.", "Step 5 can't cite itself."],
              },
              {
                claim: <code>geese[i] != honk</code>,
                claimAnswer: 1,
                answer: 1,
                why: "If geese[i] were honk, line 10 would have returned, and we'd never check the invariant again.",
                miss: ["That's step 2, for INIT.", undefined, "That's false, since an empty segment holds nothing.", "Then line 10 returns, and there's nothing to preserve."],
              },
              {
                claim: <code>!is_in(honk, geese, 0, i + 1)</code>,
                answer: 3,
                why: "honk isn't in geese[0, i) by step 4, and it isn't geese[i] by step 6.",
                miss: ["Line 6 is about i, not what's in geese.", "Line 10 gives step 6, but we need step 4 too.", "This step needs a reason, not an assumption.", undefined, "Steps 1 and 2 belong to INIT.", "Step 7 can't cite itself."],
              },
              { claim: <code>!is_in(honk, geese, 0, i&apos;)</code>, answer: 5, given: true },
            ]}
          />
        </>
      ),
    },
    {
      title: "When the loop ends",
      minutes: 2,
      body: (
        <>
          <p>
            Last step. When the loop exits, line 8 gives <code>!is_in(honk, geese, 0, i)</code>, but we want n, not i.
            That&apos;s why line 7 also says <code>i &lt;= n</code>.
          </p>
          <Comic panels={[{ who: "chonk", outfit: "winter", size: "l", pose: "oops", say: "Without i <= n, i could have run past n!" }]} />
          <p className="task">Fill in each blank.</p>
          <ProofTable
            options={["Line 6", "Line 7", "Line 8", "Math on steps 2 and 3", "Math on steps 1 and 4"]}
            claims={[<code key="a">i &gt;= n</code>, <code key="b">i == n</code>, <code key="c">i &lt; n</code>, <code key="d">i &lt;= n</code>]}
            rows={[
              {
                group: "EXIT",
                claim: <code>!is_in(honk, geese, 0, i)</code>,
                answer: 2,
                why: "Loop invariants hold when the loop exits.",
                miss: ["Line 6 is the loop guard.", "Line 7 is about the bounds of i.", undefined, "This is the first step.", "This is the first step."],
              },
              {
                claim: <code>i &gt;= n</code>,
                claimAnswer: 0,
                answer: 0,
                why: "The loop only exits when the guard i < n is false.",
                miss: [undefined, "That's step 4, which needs more.", "That's the guard when it's true. Here it's false.", "That comes from line 7, not line 6."],
              },
              { claim: <code>i &lt;= n</code>, answer: 1, given: true },
              {
                claim: <code>i == n</code>,
                claimAnswer: 1,
                answer: 3,
                why: "i >= n and i <= n together give i == n.",
                miss: ["That's step 2.", undefined, "The guard is false when the loop exits.", "That's step 3."],
              },
              {
                claim: <code>!is_in(honk, geese, 0, n)</code>,
                answer: 4,
                why: "Swap n for i in step 1, using step 4.",
                miss: ["Line 6 is the loop guard.", "Line 7 gives step 3.", "Line 8 says 0 to i, and we still need i == n.", "Steps 2 and 3 give step 4.", undefined],
              },
            ]}
          />
          <p>Why not record step 4 in the code, right after the loop?</p>
          <Code src={scopeEnd} label="An assert after the loop" start={9} hi={[12]} />
          <Pick
            question="Why doesn't line 12 compile?"
            options={["i only exists inside the for loop", "//@assert can't use ==", "i might not equal n there"]}
            answer={0}
            wrong={["", "Contracts use == all the time, like n == \\length(geese) on line 2.", "We just proved i == n. The trouble is the name i itself."]}
            explain="A variable declared in a for loop goes out of scope when the loop ends. So the proof step stays on paper."
          />
          <FoodForThought title="Loop variables elsewhere">
            <p>
              C, Java and C++ also limit a variable declared in a for loop header to the loop. Python keeps its loop
              variable after the loop ends, holding its last value. C0 follows C here, and you&apos;ll write the same
              loops in C from <Link href="/lectures#l18">C&apos;s memory model</Link> on.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Sneakier exploits",
      minutes: 1.5,
      body: (
        <>
          <p>
            We proved goose_search correct. But a caller only sees the contracts. Could other code meet them and still
            be wrong? Honk has two more tries.
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "clown", size: "xl", pose: "dance", say: "What if I change the array?" },
              { who: "chonk", outfit: "tidy", size: "s", pose: "oops", say: "You wouldn't!" },
            ]}
          />
          <Versions
            label="Exploits"
            tabs={[
              { label: "Exploit A", body: <Code src={exploitA} label="Exploit A" hi={[7, 8]} /> },
              { label: "Exploit B", body: <Code src={exploitB} label="Exploit B" hi={[10]} /> },
            ]}
          />
          <Pick
            question={
              <>
                geese holds 3 8 5 1. Under <code>-d</code>, which check stops Exploit B on{" "}
                <code>goose_search(5, geese, 4)</code>?
              </>
            }
            options={["The loop invariant on line 8", "The @ensures on line 3", "None"]}
            answer={2}
            wrong={[
              "Each time geese[i] was honk, the body changed it, so honk still isn't in geese[0, i).",
              "After the loop, no slot holds 5, so the -1 case holds.",
              "",
            ]}
            explain={
              <>
                Both exploits pass every contract by changing geese.
                <RunTable
                  runs={[
                    { call: <>Exploit A, <code>goose_search(6, geese, 4)</code></>, out: "returns 3, and geese now holds 3 8 5 6" },
                    { call: <>Exploit B, <code>goose_search(5, geese, 4)</code></>, out: "returns -1, and geese now holds 3 8 6 1" },
                  ]}
                />
              </>
            }
          />
          <FoodForThought title="Promising not to change an array">
            <p>
              A C0 postcondition only sees the array as it is at the end, so it can&apos;t compare with the array
              before the call. Other languages can. Dafny has <code>old</code> and <code>modifies</code>, and ACSL, a
              contract language for C, has <code>\old</code> and <code>assigns</code>. Rust lets a function take an
              array it may only read.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Testing",
      minutes: 2,
      body: (
        <>
          <p>
            Contracts can&apos;t catch everything, so we also write <b>unit tests</b>, calls with inputs we chose and
            results we already know. A test uses <code>assert</code>, which stops the program when its argument is
            false.
          </p>
          <Code src={test} label="A test of goose_search" hi={[6]} />
          <Rows
            options={["assert", "//@assert", "Both"]}
            rows={[
              { prompt: "Runs even without -d", answer: 0, why: "assert is ordinary code, not a contract.", miss: [undefined, "//@assert is a contract, so it only runs with -d.", "//@assert is a contract, so it only runs with -d."] },
              { prompt: "May use \\length", answer: 1, why: "Only contracts may use \\length.", miss: ["assert is ordinary code, so \\length isn't allowed.", undefined, "assert is ordinary code, so \\length isn't allowed."] },
            ]}
          />
          <Comic panels={[{ who: "chonk", outfit: "party", size: "m", pose: "point", say: "Which test catches which exploit?" }]} />
          <p className="task">Each test starts from a new geese holding 4 9 5.</p>
          <Rows
            options={tests}
            rows={[
              {
                prompt: <code>assert(goose_search(5, geese, 3) == 2);</code>,
                answer: 1,
                why: "Exploit A writes 5 into geese[2] and returns 2, so it passes. Exploit B returns -1.",
                miss: [undefined, undefined, "Exploit A returns 2 here, since 5 is already in the last slot."],
              },
              {
                prompt: <code>assert(goose_search(7, geese, 3) == -1);</code>,
                answer: 0,
                why: "Exploit A returns 2. Exploit B finds no 7 and returns -1, so it passes.",
                miss: [undefined, "Exploit B returns -1 here, which is right.", "Exploit B returns -1 here, which is right."],
              },
              {
                prompt: <code>assert(goose_search(4, geese, 3) == 0);</code>,
                answer: 2,
                why: "Exploit A returns 2 and Exploit B returns -1.",
                miss: ["Exploit B returns -1, not 0.", "Exploit A returns 2, not 0.", undefined],
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Good tests",
      minutes: 2,
      body: (
        <>
          <p>
            The first test missed Exploit A because 5 sat in the last slot. So test <b>edge cases</b>, inputs at the
            ends of what&apos;s allowed. Add a few <b>stress tests</b> too, such as a million geese checked in a loop.
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "valentine", size: "s", pose: "think", say: "Which inputs are edge cases?" },
              { who: "chonk", outfit: "cozy", size: "l", pose: "stand", say: "Think about the ends." },
            ]}
          />
          <Rows
            options={["Edge case", "Not an edge case"]}
            rows={[
              { prompt: "honk is geese[0]", answer: 0, why: "The first element is one end of the array.", miss: [undefined, "The first slot is an end, where off-by-one bugs hide."] },
              { prompt: "geese has length 0", answer: 0, why: "The empty array is the smallest input.", miss: [undefined, "Length 0 is the smallest array there is."] },
              { prompt: "honk is in the middle of 9 geese", answer: 1, why: "The middle is the most ordinary case.", miss: ["The middle isn't near either end."] },
            ]}
          />
          <Pick
            question="One of these tests is bad. Which?"
            options={[
              <span key="a">
                geese holds 5 5, <code>assert(goose_search(5, geese, 2) == 0);</code>
              </span>,
              <span key="b">
                geese is empty, <code>assert(goose_search(5, geese, 0) == -1);</code>
              </span>,
              <span key="c">
                geese holds 3 8, <code>assert(goose_search(8, geese, 2) == 1);</code>
              </span>,
            ]}
            answer={0}
            wrong={["", "An empty geese must give -1. That's a good edge case.", "8 is only at index 1, so 1 is the only right answer."]}
            explain={
              <>
                The postcondition allows 0 or 1 here, so a correct search that returns the last match fails this
                test. <Hi c={1}>Only test what the contracts promise.</Hi>
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Your turn",
      minutes: 2,
      body: (
        <>
          <p>
            Now let&apos;s do <Big c={4}>deliberate programming</Big> from scratch, writing the contracts first and
            letting them guide the code. <code>goose_last</code> returns the last index where honk appears, so it
            searches from the back.
          </p>
          <Comic panels={[{ who: "honk", outfit: "butterfly", size: "m", pose: "wave", say: "Three blanks. You've got this!" }]} />
          <Code src={last} label="goose_last, with three blanks" hi={[5, 8, 9]} />
          <Pick
            question="Which fills blank 1, so the result is the last match?"
            options={[
              <code key="a">!is_in(honk, geese, \result + 1, n)</code>,
              <code key="b">!is_in(honk, geese, 0, \result)</code>,
              <code key="c">is_in(honk, geese, \result, n)</code>,
            ]}
            answer={0}
            wrong={[
              "",
              "That says no earlier slot matches, which is the first match. For geese holding 5 2 5 and honk 5, it rejects the right answer 2.",
              "That's always true once geese[\\result] == honk, so returning 0 for geese holding 5 2 5 would pass.",
            ]}
            explain="No slot after the result holds honk."
          />
          <Pick
            question="Which fills blank 2, the bounds on i?"
            options={[<code key="a">-1 &lt;= i &amp;&amp; i &lt; n</code>, <code key="b">0 &lt;= i &amp;&amp; i &lt; n</code>, <code key="c">0 &lt;= i &amp;&amp; i &lt;= n</code>]}
            answer={0}
            wrong={[
              "",
              "The loop exits with i == -1, and the invariant is checked then. With an empty geese, i starts at -1 and the check fails at once.",
              "With an empty geese, i starts at -1, so 0 <= i fails at once.",
            ]}
            explain="i starts at n - 1 and the loop exits at -1, so these are the bounds that always hold."
          />
          <Pick
            question="Which fills blank 3, what we know so far?"
            options={[<code key="a">!is_in(honk, geese, i + 1, n)</code>, <code key="b">!is_in(honk, geese, 0, i)</code>, <code key="c">!is_in(honk, geese, i, n)</code>]}
            answer={0}
            wrong={[
              "",
              "That's the part we haven't checked. For geese holding 5 7 and honk 5, i starts at 1 and 5 is in geese[0, 1), so the check fails at once.",
              "geese[i] isn't checked yet. For geese holding 5 and honk 5, i starts at 0 and 5 is in geese[0, 1), so the check fails at once.",
            ]}
            explain={
              <>
                We&apos;ve checked everything after i. At exit, i is -1, so it becomes{" "}
                <code>!is_in(honk, geese, 0, n)</code>, just what the -1 case needs.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Where search goes next",
      minutes: 1.5,
      body: (
        <>
          <Comic
            panels={[
              { who: "honk", outfit: "rockstar", size: "xl", pose: "cheer", say: "A weak promise can be kept by doing nothing!" },
              { who: "chonk", outfit: "plain", size: "m", pose: "love", say: "So say what you mean, prove it, and test the rest." },
            ]}
          />
          <p>
            This was the first of four lectures on <Big c={4}>deliberate programming</Big>, and each one asks a bit
            more of your contracts and proofs.
          </p>
          <p className="task">Match each idea to its lecture.</p>
          <Rows
            options={laterNames}
            rows={[
              { prompt: "Count how the work of goose_search grows with n", answer: 0, why: <><Link href="/lectures#l5">Big-O</Link>, Lecture 5.</>, miss: laterMiss(0) },
              { prompt: "Keep the same postcondition, but use a sorted array to skip most of it", answer: 1, why: <><Link href="/lectures#l6">Binary search</Link>, Lecture 6.</>, miss: laterMiss(1) },
              { prompt: "Prove a sort correct with segment specification functions", answer: 2, why: <><Link href="/lectures#l7">Quicksort</Link>, Lecture 7.</>, miss: laterMiss(2) },
            ]}
          />
        </>
      ),
    },
  ],
};
