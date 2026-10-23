import Link from "next/link";
import { Code } from "@/components/lesson/Code";
import { Comic } from "@/components/lesson/Comic";
import { Big } from "@/components/lesson/Big";
import { Hi } from "@/components/lesson/Hi";
import { Pick } from "@/components/lesson/Pick";
import { Rows } from "@/components/lesson/Rows";
import { RunTable } from "@/components/lesson/RunTable";
import { Stepper, type Step } from "@/components/lesson/Stepper";
import { Versions } from "@/components/lesson/Versions";
import type { Lesson } from "./types";

// Lecture 1, Contracts. Every output below was checked with gcc; see docs/lessons/01-notes.md.

const mystery = `int f(int chonk, int geese) {
  int goose_share = 0;
  int chonk_left = chonk;
  while (chonk_left >= geese) {
    chonk_left = chonk_left - geese;
    goose_share = goose_share + 1;
  }
  return goose_share;
}`;

const spec = `int chonk_share(int chonk, int geese)
//@requires chonk >= 0 && geese > 0;
//@ensures 0 <= chonk - \\result * geese;
//@ensures chonk - \\result * geese < geese;`;

const share = `int chonk_share(int chonk, int geese)
//@requires chonk >= 0 && geese > 0;
//@ensures 0 <= chonk - \\result * geese;
//@ensures chonk - \\result * geese < geese;
{
  int goose_share = 0;
  int chonk_left = chonk;
  while (chonk_left >= geese)
  //@loop_invariant chonk_left >= 0;
  //@loop_invariant goose_share * geese + chonk_left == chonk;
  {
    chonk_left = chonk_left - geese;
    goose_share = goose_share + 1;
  }
  return goose_share;
}`;

const honks = `int total_honks(int geese)
//@requires 0 <= geese && geese <= 1000;
//@ensures \\result == geese * (geese + 1) / 2;
{
  int honks = 0;
  int goose = 0;
  while (goose < geese)
  //@loop_invariant 0 <= goose && goose <= geese;
  //@loop_invariant honks == goose * (goose + 1) / 2;
  {
    goose = goose + 1;
    honks = honks + goose;
  }
  return honks;
}`;

// The full listing, folded away on pages whose proofs cite its line numbers.
function Peek() {
  return (
    <details className="peek">
      <summary>Show chonk_share with line numbers</summary>
      <Code src={share} />
    </details>
  );
}

// The loop of chonk_share with a different guard on line 8, for comparing versions.
const loopWith = (guard: string) => `  while (${guard})
  {
    chonk_left = chonk_left - geese;
    goose_share = goose_share + 1;
  }`;

// Runs chonk_share and records each line it reaches (or only the loop guard checks, with both invariants).
function trace(chonk: number, geese: number, guardOnly: boolean): Step[] {
  const steps: Step[] = [];
  let left = chonk;
  let gs = 0;
  const vars = (l: string | number, g: string | number) => ({ chonk, geese, chonk_left: l, goose_share: g });
  const invariants = () => [
    { label: "chonk_left >= 0", value: `${left} >= 0`, ok: left >= 0 },
    {
      label: "goose_share * geese + chonk_left == chonk",
      value: `${gs} * ${geese} + ${left} == ${chonk}`,
      ok: gs * geese + left === chonk,
    },
  ];
  if (!guardOnly) {
    steps.push({ line: 6, vars: vars("–", 0) });
    steps.push({ line: 7, vars: vars(left, gs) });
  }
  for (;;) {
    const go = left >= geese;
    steps.push({
      line: 8,
      vars: vars(left, gs),
      note: `The loop guard ${left} >= ${geese} is ${go}.${go ? "" : " The loop stops."}`,
      ...(guardOnly ? { checks: invariants() } : {}),
    });
    if (!go) break;
    left -= geese;
    if (!guardOnly) steps.push({ line: 12, vars: vars(left, gs) });
    gs += 1;
    if (!guardOnly) steps.push({ line: 13, vars: vars(left, gs) });
  }
  steps.push({ line: 15, vars: vars(left, gs), note: `Returns ${gs}.` });
  return steps;
}

export const contracts: Lesson = {
  n: 1,
  title: "Contracts",
  pages: [
    {
      title: "A mystery function",
      minutes: 2,
      body: (
        <>
          <p>
            Every program relies on functions that someone else wrote. Before we use one, we want to know two things. Is
            it <b>safe</b>, meaning it runs without errors? Is it <b>correct</b>, meaning it returns the right answer?
          </p>
          <Comic
            panels={[
              { who: "chonk", pose: "point", say: "This old function should share my crumbs among the geese." },
              { who: "honk", pose: "think", say: "Can we trust it? Let's test it first." },
            ]}
          />
          <p className="task">Run f on a few inputs and look for a pattern.</p>
          <Code src={mystery} label="The mystery function f" />
          <RunTable
            runs={[
              { call: <code>f(12, 3)</code>, out: "returns 4" },
              { call: <code>f(14, 3)</code>, out: "returns 4" },
              { call: <code>f(-7, 2)</code>, out: "returns 0" },
              { call: <code>f(10, 0)</code>, out: "never returns, because the loop runs forever" },
            ]}
          />
          <Pick
            question="What does f seem to compute?"
            options={[
              <code key="a">chonk - geese</code>,
              <code key="b">chonk / geese</code>,
              <code key="c">chonk % geese</code>,
            ]}
            answer={1}
            explain={
              <>
                It matches integer division on most inputs. In C0, <code>-7 / 2</code> is <code>-3</code>, and{" "}
                <code>f(10, 0)</code> never returns.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Writing a specification",
      minutes: 1.5,
      body: (
        <>
          <p>
            A <b>specification</b> says what a function must do.{" "}
            <Hi>Without one, there is no standard for safe or correct.</Hi>
          </p>
          <Pick
            question={
              <>
                <code>f(-7, 2)</code> returns 0. Is that a bug?
              </>
            }
            options={["Yes, f is broken", "No, 0 is fine", "We can't tell yet"]}
            answer={2}
            explain="That depends on what f promises, and so far it promises nothing."
          />
          <p>
            Chonk wants each of the <code>geese</code> geese to get as many of the <code>chonk</code> crumbs as
            possible. C0 states this plan as <Big>contracts</Big>, which are comments starting with <code>{"//@"}</code>{" "}
            that describe what must be true.
          </p>
          <Code src={spec} label="The contracts for chonk_share" />
          <p>
            The expression <code>chonk - \result * geese</code> counts the leftover crumbs. The ensures lines say at
            least 0 are left, and too few to give every goose one more.
          </p>
        </>
      ),
    },
    {
      title: "Preconditions",
      minutes: 2,
      body: (
        <>
          <p>
            A <b>precondition</b> is a <Big>contract</Big> (<code>{"//@requires"}</code>) that states what must be true
            when a function is called. <Hi>The caller must make it true.</Hi> The function can then rely on it, which
            keeps the function safe.
          </p>
          <p className="task">Who is at fault in each case?</p>
          <Rows
            options={["The caller", "chonk_share"]}
            rows={[
              {
                prompt: (
                  <>
                    <code>chonk_share(10, 0)</code> runs forever.
                  </>
                ),
                answer: 0,
                why: "The call breaks the precondition geese > 0.",
              },
              {
                prompt: (
                  <>
                    <code>chonk_share(-7, 2)</code> returns 0.
                  </>
                ),
                answer: 0,
                why: "The call breaks the precondition chonk >= 0.",
              },
              {
                prompt: (
                  <>
                    <code>chonk_share(6, 3)</code> returns 1.
                  </>
                ),
                answer: 1,
                why: "The preconditions hold, so the function must be right. Three crumbs are left, enough for one more each.",
              },
            ]}
          />
          <Comic panels={[{ who: "honk", pose: "oops", say: "So calling f(10, 0) was our mistake!" }]} />
        </>
      ),
    },
    {
      title: "Postconditions",
      minutes: 1.5,
      body: (
        <>
          <p>
            A <b>postcondition</b> is a <Big>contract</Big> (<code>{"//@ensures"}</code>) that states what must be true
            when a function returns. If the preconditions held, <Hi>the function must make its postconditions true.</Hi>{" "}
            That is what correct means.
          </p>
          <p className="task">
            Two of these loop guards are wrong, yet each passes one test. Run both tests on every version.
          </p>
          <Versions
            label="Loop guard versions"
            tabs={[
              {
                label: <code>chonk_left &gt;= geese</code>,
                body: (
                  <>
                    <Code src={loopWith("chonk_left >= geese")} start={8} hi={[8]} />
                    <RunTable
                      runs={[
                        { call: <code>chonk_share(6, 3)</code>, out: "returns 2, and ensures holds", ok: true },
                        { call: <code>chonk_share(7, 3)</code>, out: "returns 2, and ensures holds", ok: true },
                      ]}
                    />
                  </>
                ),
              },
              {
                label: <code>chonk_left &gt; geese</code>,
                body: (
                  <>
                    <Code src={loopWith("chonk_left > geese")} start={8} hi={[8]} />
                    <RunTable
                      runs={[
                        {
                          call: <code>chonk_share(6, 3)</code>,
                          out: (
                            <>
                              returns 1. Three crumbs are left, and <code>3 &lt; 3</code> is false.
                            </>
                          ),
                          ok: false,
                        },
                        { call: <code>chonk_share(7, 3)</code>, out: "returns 2, and ensures holds", ok: true },
                      ]}
                    />
                  </>
                ),
              },
              {
                label: <code>chonk_left &gt; 0</code>,
                body: (
                  <>
                    <Code src={loopWith("chonk_left > 0")} start={8} hi={[8]} />
                    <RunTable
                      runs={[
                        { call: <code>chonk_share(6, 3)</code>, out: "returns 2, and ensures holds", ok: true },
                        {
                          call: <code>chonk_share(7, 3)</code>,
                          out: (
                            <>
                              returns 3. The leftover <code>7 - 3 * 3</code> is -2, and <code>0 &lt;= -2</code> is
                              false.
                            </>
                          ),
                          ok: false,
                        },
                      ]}
                    />
                  </>
                ),
              },
            ]}
          />
          <Comic
            panels={[
              { who: "chonk", pose: "think", say: "One passing test told us nothing about the broken versions." },
            ]}
          />
        </>
      ),
    },
    {
      title: "Checking contracts with -d",
      minutes: 1.5,
      body: (
        <>
          <p>
            C0 ignores <Big>contracts</Big> unless you compile with the <code>-d</code> flag. With <code>-d</code>, it
            checks each contract as the code runs and stops at the first one that fails.
          </p>
          <p className="task">
            A test calls <code>chonk_share(10, 0)</code>. Run it both ways.
          </p>
          <RunTable
            runs={[
              { call: <code>cc0</code>, out: "Nothing is printed, because the loop runs forever." },
              {
                call: <code>cc0 -d</code>,
                out: "The run stops at once because the @requires on line 2 fails.",
              },
            ]}
          />
          <p>
            <Hi>
              The <code>-d</code> flag only checks the inputs you run.
            </Hi>{" "}
            To know the code works on every allowed input, we need a <b>proof</b>, which is an argument that covers all
            of them.
          </p>
          <Comic panels={[{ who: "honk", pose: "think", say: "So how do we prove it for every input?" }]} />
        </>
      ),
    },
    {
      title: "Operational reasoning",
      minutes: 2,
      body: (
        <>
          <p>
            Following code line by line to see what it does is <b>operational reasoning</b>. Step through one call.
          </p>
          <Stepper src={share} sets={[{ label: "chonk_share(23, 5)", steps: trace(23, 5, false) }]} />
          <Pick
            question={
              <>
                How many times does the loop body run for <code>chonk_share(1000, 7)</code>?
              </>
            }
            options={["7", "142", "143", "1000"]}
            answer={1}
            explain="The answer is 142 because 1000 is 142 * 7 + 6. Tracing that tells us nothing about other inputs."
          />
          <Comic
            panels={[
              { who: "honk", pose: "oops", say: "Round 97... which round was I on?" },
              { who: "chonk", pose: "think", say: "We need a way to reason without counting rounds." },
            ]}
          />
        </>
      ),
    },
    {
      title: "Loop invariants",
      minutes: 2,
      body: (
        <>
          <p>
            A <Big>loop invariant</Big> is a fact that is <Hi>true just before every check of the loop guard</Hi>,
            including the final check, when the loop stops. Watch both invariants of <code>chonk_share</code> as it
            runs.
          </p>
          <Stepper
            src={share}
            sets={[
              { label: "(23, 5)", steps: trace(23, 5, true) },
              { label: "(6, 3)", steps: trace(6, 3, true) },
              { label: "(2, 5)", steps: trace(2, 5, true) },
            ]}
          />
          <Comic
            panels={[
              { who: "chonk", pose: "cheer", say: "Crumbs handed out plus crumbs left always make all the crumbs!" },
            ]}
          />
        </>
      ),
    },
    {
      title: "Point-to reasoning",
      minutes: 2,
      body: (
        <>
          <p>
            In <b>point-to reasoning</b>, we justify every fact by pointing to a line of code or to math.{" "}
            <Hi>A line can be cited only while nothing has changed its fact.</Hi>
          </p>
          <Code src={share} hi={[12]} />
          <p className="task">We are inside the loop body, just before line 12. Which facts can we cite?</p>
          <Rows
            options={["Can cite", "Can't cite"]}
            rows={[
              {
                prompt: <code>chonk_left &gt;= geese</code>,
                answer: 0,
                why: "Line 8 can be cited because the loop guard is true inside the body.",
              },
              {
                prompt: <code>goose_share * geese + chonk_left == chonk</code>,
                answer: 0,
                why: "Line 10 can be cited because invariants hold at the start of the body.",
              },
              {
                prompt: <code>chonk_left == chonk</code>,
                answer: 1,
                why: "Line 7 set this, but an earlier round may have changed chonk_left.",
              },
              {
                prompt: (
                  <>
                    <code>chonk_left</code> was 13 in the previous round.
                  </>
                ),
                answer: 1,
                why: "Facts about earlier rounds can be cited only through a loop invariant.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Proving INIT",
      minutes: 1.5,
      body: (
        <>
          <p>
            <b>INIT</b> shows that each <Big>loop invariant</Big> holds before the loop guard is checked for the first
            time. Only lines 1 to 7 have run at that point.
          </p>
          <Code src={share} hi={[6, 7, 9, 10]} />
          <p className="task">Choose the justification for each step.</p>
          <Rows
            numbered
            options={["line 2", "line 6", "line 7", "math on earlier steps"]}
            rows={[
              {
                group: "Line 9 holds.",
                prompt: <code>chonk_left == chonk</code>,
                answer: 2,
                why: "This is the assignment on line 7.",
              },
              { prompt: <code>chonk &gt;= 0</code>, answer: 0, why: "This is the precondition on line 2." },
              { prompt: <code>chonk_left &gt;= 0</code>, answer: 3, why: "This follows from steps 1 and 2." },
              {
                group: "Line 10 holds.",
                prompt: <code>goose_share == 0</code>,
                answer: 1,
                given: true,
                why: "This is the assignment on line 6.",
              },
              {
                prompt: <code>goose_share * geese + chonk_left == 0 * geese + chonk == chonk</code>,
                answer: 3,
                why: "This follows from steps 1 and 4.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Proving PRES",
      minutes: 2,
      body: (
        <>
          <p>
            <b>PRES</b> shows that if the <Big>invariants</Big> hold at the start of a round, they hold again at its
            end. <Hi>One arbitrary round stands for every round.</Hi> A prime marks a value after the round, as in{" "}
            <code>chonk_left&apos;</code>.
          </p>
          <Peek />
          <Comic
            panels={[
              { who: "honk", pose: "point", say: "chonk_left' >= geese, by line 8!" },
              { who: "chonk", pose: "think", say: "Line 8 is about chonk_left before line 12 shrank it." },
            ]}
          />
          <Rows
            numbered
            options={["line 8", "line 10", "line 12", "line 13", "math on earlier steps"]}
            rows={[
              {
                group: "Line 9 still holds.",
                prompt: <code>chonk_left &gt;= geese</code>,
                answer: 0,
                given: true,
                why: "The loop guard is true inside the body.",
              },
              {
                prompt: <code>chonk_left&apos; == chonk_left - geese</code>,
                answer: 2,
                why: "This is the assignment on line 12.",
              },
              { prompt: <code>chonk_left&apos; &gt;= 0</code>, answer: 4, why: "This follows from steps 1 and 2." },
              {
                group: "Line 10 still holds.",
                prompt: <code>goose_share * geese + chonk_left == chonk</code>,
                answer: 1,
                given: true,
                why: "The invariant holds at the start of the round.",
              },
              {
                prompt: <code>goose_share&apos; == goose_share + 1</code>,
                answer: 3,
                why: "This is the assignment on line 13.",
              },
              {
                prompt: <code>goose_share&apos; * geese + chonk_left&apos; == chonk</code>,
                answer: 4,
                why: "Substituting steps 2 and 5 gives the left side of step 4.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Proving EXIT",
      minutes: 1.5,
      body: (
        <>
          <p>
            When the loop stops, its guard is false and the <Big>invariants</Big> still hold. <b>EXIT</b> uses{" "}
            <Hi>the invariants and the negated guard</Hi> to prove the postconditions. Line 15 returns{" "}
            <code>goose_share</code>, so <code>\result</code> equals <code>goose_share</code>.
          </p>
          <Peek />
          <Rows
            numbered
            options={["line 8, negated", "line 9", "line 10", "math on earlier steps"]}
            rows={[
              { prompt: <code>chonk_left &lt; geese</code>, answer: 0, why: "The loop guard is false after the loop." },
              { prompt: <code>chonk_left &gt;= 0</code>, answer: 1, why: "This is a loop invariant." },
              {
                prompt: <code>goose_share * geese + chonk_left == chonk</code>,
                answer: 2,
                given: true,
                why: "This is a loop invariant.",
              },
              {
                prompt: <code>0 &lt;= chonk - goose_share * geese</code>,
                answer: 3,
                why: "This follows from steps 2 and 3, and it proves line 3.",
              },
              {
                prompt: <code>chonk - goose_share * geese &lt; geese</code>,
                answer: 3,
                why: "This follows from steps 1 and 3, and it proves line 4.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Proving TERM",
      minutes: 1.5,
      body: (
        <>
          <p>
            <b>TERM</b> shows that the loop runs only finitely many times. It is the one proof that may talk about every
            round, so <Hi>it is informal and follows a template.</Hi>
          </p>
          <Peek />
          <p className="task">Fill in the blanks.</p>
          <Rows
            options={["chonk_left", "goose_share", "0", "the loop guard"]}
            rows={[
              {
                prompt: "On every round, ___ strictly decreases.",
                answer: 0,
                why: "Line 12 subtracts geese, and geese > 0 by line 2.",
              },
              { prompt: "It can never go below ___.", answer: 2, why: "This is the loop invariant on line 9." },
              {
                prompt: "So it cannot decrease forever, and ___ eventually becomes false.",
                answer: 3,
                why: "The loop stops once chonk_left < geese.",
              },
            ]}
          />
          <p>
            This is why <code>geese &gt; 0</code> matters. In <code>f(10, 0)</code>, <code>chonk_left</code> never
            decreases.
          </p>
        </>
      ),
    },
    {
      title: "Spotting a bad proof step",
      minutes: 2,
      body: (
        <>
          <p>
            Geese stand in a line, and goose number k honks k times. The function <code>total_honks</code> counts all
            the honks.
          </p>
          <Code src={honks} hi={[11, 12]} />
          <Comic
            panels={[
              { who: "honk", pose: "cheer", say: "I proved PRES for line 9!" },
              { who: "chonk", pose: "think", say: "Let's check each step." },
            ]}
          />
          <Pick
            question="Which step is the first one that is wrong?"
            options={[
              <span key="1">
                1. <code>honks == goose * (goose + 1) / 2</code> by line 9
              </span>,
              <span key="2">
                2. <code>goose&apos; == goose + 1</code> by line 11
              </span>,
              <span key="3">
                3. <code>honks&apos; == honks + goose</code> by line 12
              </span>,
              <span key="4">
                4. <code>honks&apos; == goose&apos; * (goose&apos; + 1) / 2</code> by math on 1, 2 and 3
              </span>,
            ]}
            answer={2}
            explain={
              <>
                Line 12 runs after line 11, so it adds the new value. The correct step is{" "}
                <code>honks&apos; == honks + goose&apos;</code>, and then the math in step 4 works.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Why point-to proofs pay off",
      minutes: 1.5,
      body: (
        <>
          <p>
            Point-to proofs feel heavy for one short loop. They pay off as code grows, because{" "}
            <Hi>each function is checked on its own.</Hi> This is called <b>modular</b> reasoning.
          </p>
          <Pick
            question={
              <>
                Some code knows <code>honk &gt;= 0</code> and calls <code>chonk_share(honk, 4)</code>. What can it cite
                about the result?
              </>
            }
            options={["The loop ran honk / 4 times", "Lines 3 and 4, the postconditions", "chonk_left ended below 4"]}
            answer={1}
            explain="After a call, only the postconditions can be cited."
          />
          <p>
            <Big>Invariants</Big> come back throughout the course.
          </p>
          <ul>
            <li>
              Loops over arrays rely on them in <Link href="/concepts#l4">Searching arrays</Link>,{" "}
              <Link href="/concepts#l6">Binary search</Link> and <Link href="/concepts#l7">Quicksort</Link>.
            </li>
            <li>
              Starting with <Link href="/concepts#l9">Stacks and queues</Link>, each data structure has invariants it
              must always keep.
            </li>
            <li>
              <Link href="/concepts#l26">Restoring invariants</Link> shows how to repair them after a change.
            </li>
          </ul>
          <Comic
            panels={[
              { who: "chonk", pose: "wave", say: "So the crumbs always add up." },
              { who: "honk", pose: "cheer", say: "And now we can prove it!" },
            ]}
          />
        </>
      ),
    },
  ],
};
