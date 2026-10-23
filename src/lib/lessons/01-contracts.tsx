import Link from "next/link";
import { Code } from "@/components/lesson/Code";
import { Comic } from "@/components/lesson/Comic";
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
      note: `Loop guard: ${left} >= ${geese} is ${go}.${go ? "" : " The loop stops."}`,
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
      title: "A function with no instructions",
      minutes: 2,
      body: (
        <>
          <Comic
            panels={[
              { who: "chonk", say: "I found this in my old files. I think it shares out crumbs?" },
              { who: "honk", say: "Honk! Let's run it and find out." },
            ]}
          />
          <p>
            Here is the whole function. It has no comments and no <b>contracts</b>. Run it on a few inputs and look for
            a pattern.
          </p>
          <Code src={mystery} label="The mystery function f" />
          <RunTable
            runs={[
              { call: <code>f(12, 3)</code>, out: "returns 4" },
              { call: <code>f(14, 3)</code>, out: "returns 4" },
              { call: <code>f(2, 5)</code>, out: "returns 0" },
              { call: <code>f(100, 7)</code>, out: "returns 14" },
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
                It matches integer division on most inputs. Two calls don&apos;t fit. In C0, <code>-7 / 2</code> is{" "}
                <code>-3</code>, and <code>f(10, 0)</code> never returns.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Correct compared to what?",
      minutes: 1.5,
      body: (
        <>
          <p>
            Is <code>f(-7, 2)</code> returning 0 a bug? Without a <b>specification</b>,{" "}
            <Hi>there is no standard for whether code is safe or correct</Hi>.
          </p>
          <Pick
            question={
              <>
                <code>f(-7, 2)</code> returns 0. Is that a bug?
              </>
            }
            options={["Yes, f is broken", "No, 0 is fine", "We can't tell yet"]}
            answer={2}
            explain="Whether 0 is wrong depends on what f promised, and so far it promises nothing."
          />
          <p>
            Chonk explains the plan. The function shares <code>chonk</code> crumbs among <code>geese</code> geese, and
            each goose gets as many crumbs as possible. In C0 we write that plan as <b>contracts</b>.
          </p>
          <Code src={spec} label="The contracts for chonk_share" />
          <ul>
            <li>
              <code>chonk - \result * geese</code> is the number of crumbs left over.
            </li>
            <li>The two ensures lines say the leftover is at least 0 and too small to give every goose one more.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Preconditions are the caller's job",
      minutes: 2,
      body: (
        <>
          <p>
            A <b>precondition</b> (<code>{"//@requires"}</code>) says which inputs are allowed.{" "}
            <Hi>The caller must make it true</Hi> before calling. In return the function can count on it, which keeps
            the function <b>safe</b> to run. Here, <code>geese &gt; 0</code> is what lets the loop finish.
          </p>
          <p className="task">Whose fault is each of these?</p>
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
                why: (
                  <>
                    <code>geese &gt; 0</code> is false, so the caller broke the precondition.
                  </>
                ),
              },
              {
                prompt: (
                  <>
                    <code>chonk_share(-7, 2)</code> returns 0.
                  </>
                ),
                answer: 0,
                why: (
                  <>
                    <code>chonk &gt;= 0</code> is false. The function owes nothing on this input.
                  </>
                ),
              },
              {
                prompt: (
                  <>
                    <code>chonk_share(6, 3)</code> returns 1.
                  </>
                ),
                answer: 1,
                why: "Both preconditions hold, so the answer must be right. With 1 crumb each, 3 are left, enough to give every goose another.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Postconditions are the function's promise",
      minutes: 1.5,
      body: (
        <>
          <p>
            A <b>postcondition</b> (<code>{"//@ensures"}</code>) describes the result. Whenever the preconditions held,{" "}
            <Hi>the function must make its postconditions true</Hi> when it returns. That is what <b>correct</b> means.
          </p>
          <p className="task">Try three versions of the loop guard. Each one passes one test.</p>
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
                        { call: <code>chonk_share(6, 3)</code>, out: "returns 2, ensures holds", ok: true },
                        { call: <code>chonk_share(7, 3)</code>, out: "returns 2, ensures holds", ok: true },
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
                              returns 1. 3 crumbs are left, and <code>3 &lt; 3</code> is false.
                            </>
                          ),
                          ok: false,
                        },
                        { call: <code>chonk_share(7, 3)</code>, out: "returns 2, ensures holds", ok: true },
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
                        { call: <code>chonk_share(6, 3)</code>, out: "returns 2, ensures holds", ok: true },
                        {
                          call: <code>chonk_share(7, 3)</code>,
                          out: (
                            <>
                              returns 3. <code>7 - 3 * 3</code> is -2, and <code>0 &lt;= -2</code> is false.
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
          <p>A single passing test proved nothing about the two broken versions.</p>
        </>
      ),
    },
    {
      title: "Checking contracts with -d",
      minutes: 1.5,
      body: (
        <>
          <p>
            Contracts are comments that start with <code>{"//@"}</code>. Plain <code>cc0</code> ignores them. Compile
            with <code>-d</code> and C0 checks each one as the code runs, stopping at the first that fails.
          </p>
          <p className="task">
            A test file calls <code>chonk_share(10, 0)</code>. Run it both ways.
          </p>
          <RunTable
            runs={[
              { call: <code>cc0</code>, out: "Nothing is printed. The loop runs forever." },
              {
                call: <code>cc0 -d</code>,
                out: "Stops at once. The @requires on line 2 fails, so the caller is to blame.",
              },
            ]}
          />
          <p>
            <Hi>
              <code>-d</code> only checks the inputs you actually run.
            </Hi>{" "}
            To know the code works on <b>every</b> allowed input, we need a proof.
          </p>
        </>
      ),
    },
    {
      title: "Tracing every step gets out of hand",
      minutes: 2,
      body: (
        <>
          <p>
            Following code line by line is <b>operational reasoning</b>. Step through one call.
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
            explain="1000 is 142 * 7 + 6. Tracing it means 142 rounds, and it tells us nothing about any other input."
          />
          <Comic
            panels={[
              { who: "honk", say: "Round 97... chonk_left is 321... wait, which round was I on?" },
              { who: "chonk", say: "We need a way to reason without counting rounds." },
            ]}
          />
        </>
      ),
    },
    {
      title: "One fact that every round keeps",
      minutes: 2,
      body: (
        <>
          <p>
            A <b>loop invariant</b> is a fact that is <Hi>true just before every check of the loop guard</Hi>, including
            the last check, when the loop stops. Watch both invariants of <code>chonk_share</code>.
          </p>
          <Stepper
            src={share}
            sets={[
              { label: "(23, 5)", steps: trace(23, 5, true) },
              { label: "(6, 3)", steps: trace(6, 3, true) },
              { label: "(2, 5)", steps: trace(2, 5, true) },
            ]}
          />
          <p>
            Each round changes <code>chonk_left</code> and <code>goose_share</code>, but crumbs handed out plus crumbs
            left always add up to all the crumbs.
          </p>
        </>
      ),
    },
    {
      title: "Point-to reasoning: cite the line",
      minutes: 2,
      body: (
        <>
          <p>
            In <b>point-to reasoning</b>, every fact is justified by pointing to a specific line or to math.{" "}
            <Hi>A line can be cited only while nothing has changed its fact</Hi>.
          </p>
          <Code src={share} hi={[12]} />
          <p className="task">We are inside the loop body, just before line 12. Can we cite each fact?</p>
          <Rows
            options={["Can cite", "Can't cite"]}
            rows={[
              {
                prompt: <code>chonk_left &gt;= geese</code>,
                answer: 0,
                why: "Line 8. Inside the loop body, the loop guard is true.",
              },
              {
                prompt: <code>geese &gt; 0</code>,
                answer: 0,
                why: "Line 2, the precondition. Nothing changes geese.",
              },
              {
                prompt: <code>goose_share * geese + chonk_left == chonk</code>,
                answer: 0,
                why: "Line 10. Loop invariants hold at the start of the body.",
              },
              {
                prompt: <code>chonk_left == chonk</code>,
                answer: 1,
                why: "Line 7 set it, but earlier rounds may have changed chonk_left since.",
              },
              {
                prompt: (
                  <>
                    <code>chonk_left</code> was 13 last round
                  </>
                ),
                answer: 1,
                why: "Facts about earlier rounds can be cited only through a loop invariant.",
              },
              { prompt: <code>0 * geese == 0</code>, answer: 0, why: "Math." },
            ]}
          />
        </>
      ),
    },
    {
      title: "INIT: true before the first check",
      minutes: 1.5,
      body: (
        <>
          <p>
            <b>INIT</b> shows that each loop invariant is true before the loop guard is checked for the first time. Only
            lines 1 to 7 have run.
          </p>
          <Code src={share} hi={[6, 7, 9, 10]} />
          <p className="task">Pick the justification for each step.</p>
          <Rows
            numbered
            options={["line 2", "line 6", "line 7", "math on earlier steps"]}
            rows={[
              {
                group: "Line 9: chonk_left >= 0",
                prompt: <code>chonk_left == chonk</code>,
                answer: 2,
                why: "The assignment on line 7.",
              },
              { prompt: <code>chonk &gt;= 0</code>, answer: 0, why: "The precondition on line 2." },
              { prompt: <code>chonk_left &gt;= 0</code>, answer: 3, why: "Math on steps 1 and 2." },
              {
                group: "Line 10: goose_share * geese + chonk_left == chonk",
                prompt: <code>goose_share == 0</code>,
                answer: 1,
                why: "The assignment on line 6.",
              },
              {
                prompt: <code>goose_share * geese + chonk_left == 0 * geese + chonk == chonk</code>,
                answer: 3,
                why: "Math on steps 1 and 4.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "PRES: one arbitrary round",
      minutes: 2,
      body: (
        <>
          <p>
            <b>PRES</b> shows that if the invariants hold at the start of a round, they hold again at its end. We never
            say which round, so <Hi>one arbitrary round stands for all of them</Hi>. New values get a prime, as in{" "}
            <code>chonk_left&apos;</code>.
          </p>
          <Peek />
          <Comic
            panels={[
              { who: "honk", say: "chonk_left' >= geese, by line 8!" },
              { who: "chonk", say: "Line 8 is about chonk_left before line 12 shrank it." },
            ]}
          />
          <Rows
            numbered
            options={["line 8", "line 10", "line 12", "line 13", "math on earlier steps"]}
            rows={[
              {
                group: "Line 9 again",
                prompt: <code>chonk_left &gt;= geese</code>,
                answer: 0,
                why: "The loop guard is true inside the body.",
              },
              {
                prompt: <code>chonk_left&apos; == chonk_left - geese</code>,
                answer: 2,
                why: "The assignment on line 12.",
              },
              { prompt: <code>chonk_left&apos; &gt;= 0</code>, answer: 4, why: "Math on steps 1 and 2." },
              {
                group: "Line 10 again",
                prompt: <code>goose_share * geese + chonk_left == chonk</code>,
                answer: 1,
                why: "The loop invariant holds at the start of the round.",
              },
              {
                prompt: <code>goose_share&apos; == goose_share + 1</code>,
                answer: 3,
                why: "The assignment on line 13.",
              },
              {
                prompt: <code>goose_share&apos; * geese + chonk_left&apos; == chonk</code>,
                answer: 4,
                why: "(goose_share + 1) * geese + chonk_left - geese simplifies to the left side of step 4.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "EXIT: invariants plus a false guard",
      minutes: 1.5,
      body: (
        <>
          <p>
            When the loop stops, the loop guard is false and the invariants still hold. <b>EXIT</b> uses{" "}
            <Hi>the invariants and the negated guard to prove the postconditions</Hi>. Line 15 returns{" "}
            <code>goose_share</code>, so <code>\result</code> is <code>goose_share</code>.
          </p>
          <Peek />
          <Rows
            numbered
            options={["line 8, negated", "line 9", "line 10", "math on earlier steps"]}
            rows={[
              { prompt: <code>chonk_left &lt; geese</code>, answer: 0, why: "After the loop, the guard is false." },
              { prompt: <code>chonk_left &gt;= 0</code>, answer: 1, why: "A loop invariant." },
              { prompt: <code>goose_share * geese + chonk_left == chonk</code>, answer: 2, why: "A loop invariant." },
              {
                prompt: <code>0 &lt;= chonk - goose_share * geese</code>,
                answer: 3,
                why: "Math on steps 2 and 3. This proves line 3.",
              },
              {
                prompt: <code>chonk - goose_share * geese &lt; geese</code>,
                answer: 3,
                why: "Math on steps 1 and 3. This proves line 4.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "TERM: the loop must stop",
      minutes: 1.5,
      body: (
        <>
          <p>
            <b>TERM</b> argues that the loop runs only finitely many times. It is the one proof that may talk about
            every round, so <Hi>it is informal and follows a template</Hi>. Fill in the blanks.
          </p>
          <Peek />
          <Rows
            options={["chonk_left", "goose_share", "0", "the loop guard"]}
            rows={[
              {
                prompt: "On every round, ___ strictly decreases.",
                answer: 0,
                why: "Line 12 subtracts geese, and geese > 0 by line 2.",
              },
              { prompt: "It can never go below ___.", answer: 2, why: "The loop invariant on line 9." },
              {
                prompt: "So it can't decrease forever, and ___ eventually becomes false.",
                answer: 3,
                why: "Once chonk_left < geese, the loop stops.",
              },
            ]}
          />
          <p>
            This is where <code>geese &gt; 0</code> matters. In <code>f(10, 0)</code>, <code>chonk_left</code> never
            decreases, so the loop never stops.
          </p>
        </>
      ),
    },
    {
      title: "Spot the bad step",
      minutes: 2,
      body: (
        <>
          <p>
            Geese stand in a line, and goose number k honks k times. <code>total_honks</code> adds up every honk.
          </p>
          <Code src={honks} hi={[11, 12]} />
          <p>Honk wrote this PRES proof for the invariant on line 9.</p>
          <Pick
            question="Click the first step that is wrong."
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
                4. <code>honks&apos; == goose&apos; * (goose&apos; + 1) / 2</code> by math on 1, 2, 3
              </span>,
            ]}
            answer={2}
            explain={
              <>
                Line 12 runs after line 11, so it adds the new value. The right step is{" "}
                <code>honks&apos; == honks + goose&apos;</code>, and then the math in step 4 works.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Why prove things this way?",
      minutes: 1.5,
      body: (
        <>
          <p>
            Point-to proofs feel like a lot for one short loop. They pay off as code grows, because{" "}
            <Hi>each piece is checked on its own</Hi>. This is <b>modular</b> reasoning, and loop invariants also say
            why a loop works.
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
            explain="After a call, only the postconditions can be cited. The loop belongs to chonk_share."
          />
          <p>Invariants come back all semester.</p>
          <ul>
            <li>
              Loops over arrays in <Link href="/concepts#l4">Searching arrays</Link>,{" "}
              <Link href="/concepts#l6">Binary search</Link> and <Link href="/concepts#l7">Quicksort</Link>.
            </li>
            <li>
              <b>Data structure invariants</b> from <Link href="/concepts#l9">Stacks and queues</Link> onward.
            </li>
            <li>
              Putting them back after a change in <Link href="/concepts#l26">Restoring invariants</Link>.
            </li>
          </ul>
          <Comic
            panels={[
              { who: "chonk", say: "So the crumbs always add up." },
              { who: "honk", say: "And now we can prove it. Honk!" },
            ]}
          />
        </>
      ),
    },
  ],
};
