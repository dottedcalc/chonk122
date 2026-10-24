import Link from "next/link";
import { ArrayIndex } from "@/components/lesson/ArrayIndex";
import { Big } from "@/components/lesson/Big";
import { Code } from "@/components/lesson/Code";
import { Comic } from "@/components/lesson/Comic";
import { FoodForThought } from "@/components/lesson/FoodForThought";
import { GooseVars } from "@/components/lesson/GooseVars";
import { Hi } from "@/components/lesson/Hi";
import { MemDiagram, MemDraw, MemStepper } from "@/components/lesson/Mem";
import { Pick } from "@/components/lesson/Pick";
import { ProofTable } from "@/components/lesson/ProofTable";
import { Reveal } from "@/components/lesson/Reveal";
import { Rows } from "@/components/lesson/Rows";
import { RunTable } from "@/components/lesson/RunTable";
import type { Lesson } from "./types";

// Lecture 3, Arrays. Every output below was checked with gcc or by tracing; see docs/lessons/03-notes.md.

const twice = `int honk_twice(int honk) {
  int goose = honk * 2;
  return goose;
}

int main() {
  int chonk = 5;
  int honk = honk_twice(chonk + 1);
  return honk;
}`;

const arrayOps = `alloc_array(t, n)
//@requires n >= 0;
//@ensures \\length(\\result) == n;

A[i]
//@requires 0 <= i && i < \\length(A);`;

const sum = `int goose_sum(int[] geese, int n)
//@requires n == \\length(geese);
{
  int chonk = 0;
  for (int i = 0; i < \\length(geese); i++) {
    chonk += geese[i];
  }
  return chonk;
}`;

const alias = `int[] honk = alloc_array(int, 3);
int[] chonk = honk;
chonk[0] = 7;
int[] goose = alloc_array(int, 3);
goose[0] = 7;`;

const garbage = `int[] honk = alloc_array(int, 3);
int[] chonk = honk;
honk = alloc_array(int, 2);
chonk = honk;`;

const reset = `void honk_reset(int[] geese, int n, int chonk)
//@requires n == \\length(geese) && n > 0;
{
  geese[0] = chonk + 1;
  chonk = 0;
  geese = alloc_array(int, n);
  geese[0] = 99;
}

int main() {
  int[] honk = alloc_array(int, 2);
  int goose = 8;
  honk_reset(honk, 2, goose);
  return 0;
}`;

const draw = `int main() {
  int[] honk = alloc_array(int, 3);
  int[] chonk = alloc_array(int, 3);
  int[] goose = honk;
  honk[1] = 4;
  goose[2] = 6;
  goose = chonk;
  goose[0] = 2;
  return 0;
}`;

const reverseAlias = `int[] goose_reverse(int[] honk, int n)
//@requires n == \\length(honk);
{
  int[] chonk = honk;
  for (int i = 0; i < n; i++) {
    chonk[i] = honk[n - 1 - i];
  }
  return chonk;
}`;

const reverseNew = `int[] goose_reverse(int[] honk, int n)
//@requires n == \\length(honk);
{
  int[] chonk = alloc_array(int, n);
  for (int i = 0; i < n; i++) {
    chonk[i] = honk[n - 1 - i];
  }
  return chonk;
}`;

const reverseInv = `int[] goose_reverse(int[] honk, int n)
//@requires n == \\length(honk);
{
  int[] chonk = alloc_array(int, n);
  for (int i = 0; i < n; i++)
  //@loop_invariant 0 <= i;
  {
    chonk[i] = honk[n - 1 - i];
  }
  return chonk;
}`;

const caller = `int main() {
  int[] honk = alloc_array(int, 3);
  int[] chonk = goose_reverse(honk, 3);
  int[] goose = goose_reverse(chonk, 3);
  return 0;
}`;

const kinds = ["an int", "a bool", "a char", "a string"];
const defaults = ["0", "false", "'\\0'", '""'];
// Why each default is wrong for an array of another type.
const notDefault = (t: number) => defaults.map((d, j) => (j === t ? undefined : `${d} is ${kinds[j]}, but this array holds ${kinds[t].replace(/^an? /, "")}s.`));

const laterNames = ["Searching arrays", "Binary search", "Quicksort", "Unbounded arrays"];
const laterMiss = (k: number) => laterNames.map((m, j) => (j === k ? undefined : `${m} fits another row better.`));

export const arrays: Lesson = {
  n: 3,
  title: "Arrays",
  pages: [
    {
      title: "One variable per goose?",
      minutes: 1.5,
      body: (
        <>
          <p>
            In <Link href="/lessons/2">Lecture 2</Link>, one int held one number. Now Chonk wants to weigh every goose
            in the flock and add up the weights. Can each goose get its own variable?
          </p>
          <Comic
            panels={[
              {
                who: "chonk",
                outfit: "chef",
                size: "l",
                pose: "think",
                say: (
                  <>
                    <code>goose1</code>, <code>goose2</code>, <code>goose3</code>…
                  </>
                ),
              },
              { who: "honk", outfit: "drink", size: "s", pose: "oops", say: "What if a hundred geese show up?" },
            ]}
          />
          <p className="task">Slide the size of the flock, then switch versions.</p>
          <GooseVars />
          <Pick
            question="Chonk only learns the number of geese, n, once the program runs. Which version still works?"
            options={["One variable per goose", "One array", "Both"]}
            answer={1}
            wrong={[
              "We fix the variables when we write the code, so they can't grow to fit n.",
              "",
              "One variable per goose needs to know n when we write the code.",
            ]}
            explain={
              <>
                An <b>array</b> holds as many values as we ask for while the program runs.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "What is an array?",
      minutes: 1.5,
      body: (
        <>
          <ul>
            <li>
              For any type t, <code>t[]</code> is the type of arrays whose elements have type t, such as{" "}
              <code>int[]</code>, <code>string[]</code> or even <code>char[][]</code>.
            </li>
            <li>
              <code>alloc_array(t, n)</code> makes a new array of n elements. Its <b>length</b> is n, and the length
              never changes.
            </li>
            <li>
              Elements are numbered from 0, so <code>geese[0]</code> is the first one.
            </li>
          </ul>
          <Comic panels={[{ who: "honk", outfit: "umpire", size: "m", pose: "point", say: "Goose number zero, step up!" }]} />
          <p className="task">
            Slide <code>i</code> along <code>geese</code> and read each element.
          </p>
          <ArrayIndex name="geese" cells={[12, 9, 15, 7, 11]} />
          <Rows
            options={["0", "4", "5"]}
            rows={[
              {
                prompt: (
                  <>
                    <code>geese</code> has length 5, so its last element has index
                  </>
                ),
                answer: 1,
                why: "Five elements numbered from 0 end at 4.",
                miss: ["0 is the index of the first element.", undefined, "That would be a sixth element."],
              },
              {
                prompt: (
                  <>
                    <code>alloc_array(int, 0)</code> makes an array with this many elements
                  </>
                ),
                answer: 0,
                why: "Arrays can have length 0.",
                miss: [undefined, "The second argument is the length, and here it's 0.", "The second argument is the length, and here it's 0."],
              },
            ]}
          />
          <FoodForThought title="Why start counting at 0?">
            <p>
              An index is an offset, how far an element sits from the start. So element i lives at the array&apos;s
              address plus i times the size of one element, and the first one is 0 steps in. Ranges like{" "}
              <code>0 &lt;= i &amp;&amp; i &lt; n</code> also work out neatly, since they hold exactly n values and an
              empty range is just n = 0. You&apos;ll write <code>lo</code> and <code>hi</code> bounds this way all
              through <Link href="/lectures#l6">Binary search</Link>.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Where variables live",
      minutes: 2,
      body: (
        <>
          <p>
            Before we store an array, where do ordinary variables live? C0 keeps them in <Big c={2}>local memory</Big>.
            Each function call gets its own <b>frame</b> that holds its variables. A function can only use the
            variables in its own frame, and when it returns, its frame is <b>decommissioned</b>, which means it goes
            away.
          </p>
          <Comic
            panels={[
              {
                who: "chonk",
                outfit: "sleepy",
                size: "s",
                pose: "shrug",
                say: (
                  <>
                    Two variables named <code>honk</code>?
                  </>
                ),
              },
              { who: "honk", outfit: "butterfly", size: "l", pose: "wave", say: "Let's step through and see." },
            ]}
          />
          <Code src={twice} label="honk_twice and main" />
          <Pick
            question={
              <>
                While line 2 runs, which variables can <code>honk_twice</code> use?
              </>
            }
            options={[
              <span key="a">
                <code>honk</code> and <code>goose</code>
              </span>,
              <span key="b">
                <code>honk</code>, <code>goose</code> and <code>chonk</code>
              </span>,
              "Every variable in memory",
            ]}
            answer={0}
            wrong={[
              "",
              "chonk lives in the frame for main, and a function only sees its own frame.",
              "A function only sees the variables in its own frame.",
            ]}
            explain={
              <>
                Its <code>honk</code> is a different variable from the one in <code>main</code>, even with the same
                name. Recursive calls work the same way, with a new frame for each call.
              </>
            }
          />
          <Reveal label="Step through it">
          <MemStepper
            src={twice}
            label="honk_twice and main, step by step"
            steps={[
              { line: 7, frames: [{ fn: "main", active: true, vars: [{ name: "chonk", value: 5 }] }], arrays: [] },
              {
                line: 1,
                note: "The call adds a new frame, and it becomes the active one.",
                frames: [
                  { fn: "main", vars: [{ name: "chonk", value: 5 }] },
                  { fn: "honk_twice", active: true, vars: [{ name: "honk", value: 6 }] },
                ],
                arrays: [],
              },
              {
                line: 2,
                frames: [
                  { fn: "main", vars: [{ name: "chonk", value: 5 }] },
                  {
                    fn: "honk_twice",
                    active: true,
                    vars: [
                      { name: "honk", value: 6 },
                      { name: "goose", value: 12 },
                    ],
                  },
                ],
                arrays: [],
              },
              {
                line: 3,
                note: "The call returns 12, and its frame is decommissioned.",
                frames: [
                  { fn: "main", active: true, vars: [{ name: "chonk", value: 5 }] },
                  {
                    fn: "honk_twice",
                    gone: true,
                    vars: [
                      { name: "honk", value: 6 },
                      { name: "goose", value: 12 },
                    ],
                  },
                ],
                arrays: [],
              },
              {
                line: 8,
                frames: [
                  {
                    fn: "main",
                    active: true,
                    vars: [
                      { name: "chonk", value: 5 },
                      { name: "honk", value: 12 },
                    ],
                  },
                ],
                arrays: [],
              },
            ]}
          />
          </Reveal>
        </>
      ),
    },
    {
      title: "Too big for one variable",
      minutes: 2,
      body: (
        <>
          <p>
            Back to arrays. In <Link href="/lessons/2">Lecture 2</Link>, an int was one word, a fixed number of bits.
            A variable holds one small value like that, so a hundred ints can&apos;t fit in it!
          </p>
          <p>
            So <code>alloc_array</code> puts the array in <Big c={2}>allocated memory</Big>, a separate part of memory.
            Let&apos;s try it in <b>coin</b>, the C0 interpreter.
          </p>
          <p className="task">Run each line.</p>
          <RunTable
            runs={[
              { call: <code>int[] geese = alloc_array(int, 4);</code>, out: <code>geese is 0xF5A2C0 (int[] with 4 elements)</code> },
              { call: <code>geese[1] = 7;</code>, out: <code>geese[1] is 7 (int)</code> },
            ]}
          />
          <Reveal label="Show the memory">
            <MemDiagram
              state={{
                frames: [{ fn: "main", active: true, vars: [{ name: "geese", to: "A" }] }],
                arrays: [{ id: "A", cells: ["", 7, "", ""] }],
              }}
            />
          </Reveal>
          <Comic
            panels={[
              {
                who: "honk",
                outfit: "inclass",
                size: "m",
                pose: "think",
                say: (
                  <>
                    So is <code>geese</code> the array?
                  </>
                ),
              },
              { who: "chonk", outfit: "detective", size: "s", pose: "point", say: "And what's that hex number?" },
            ]}
          />
          <p className="task">What does each one hold?</p>
          <Rows
            options={["An address", "An int"]}
            rows={[
              {
                prompt: <code>geese</code>,
                answer: 0,
                why: (
                  <>
                    It holds the array&apos;s <b>address</b>, which says where the array is in allocated memory. We draw it
                    as an arrow.
                  </>
                ),
                miss: [undefined, "geese has type int[], so it can't hold an int."],
              },
              {
                prompt: <code>geese[1]</code>,
                answer: 1,
                why: "It follows the address and reads element 1, which is 7.",
                miss: ["Indexing follows the address to the array and reads one element."],
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Addresses aren't numbers",
      minutes: 1.5,
      body: (
        <>
          <p>
            When coin printed <code>geese</code>, it showed the address <code>0xF5A2C0</code>. Can we use that like a
            number?
          </p>
          <p>
            No. Addresses can change from run to run, and C0 never lets a program compute with them. If{" "}
            <code>geese + 1</code> were allowed, it could point into memory that isn&apos;t part of the array. So in
            our pictures <Hi c={2}>we draw addresses as arrows</Hi>.
          </p>
          <Comic panels={[{ who: "chonk", outfit: "wizard", size: "m", pose: "stand", say: "An arrow tells us where. That's all." }]} />
          <p className="task">
            Say <code>int[] geese = alloc_array(int, 4);</code> already ran. Does each line compile?
          </p>
          <Rows
            options={["Compiles", "Doesn't compile"]}
            rows={[
              {
                prompt: <code>int honk = geese[1] + 1;</code>,
                answer: 0,
                why: "geese[1] is an int, so adding 1 is fine.",
                miss: [undefined, "geese[1] is an int, so adding 1 is fine."],
              },
              {
                prompt: <code>int[] chonk = geese + 1;</code>,
                answer: 1,
                why: "+ needs two ints, and geese is an int[].",
                miss: ["+ needs two ints, and geese is an int[]."],
              },
              {
                prompt: <code>int honk = geese;</code>,
                answer: 1,
                why: "An int[] can't be stored in an int.",
                miss: ["An int[] can't be stored in an int."],
              },
              {
                prompt: <code>int[] chonk = geese;</code>,
                answer: 0,
                why: "Both are int[], so chonk gets a copy of the address.",
                miss: [undefined, "Both sides have type int[], so the types match."],
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Default values",
      minutes: 1.5,
      body: (
        <>
          <p>
            What&apos;s in the elements of a new array before we set them?{" "}
            <code>alloc_array</code> fills every element with its type&apos;s <b>default value</b>. Still, code is
            clearer when it doesn&apos;t rely on defaults, so a reader can tell which starting values matter.
          </p>
          <FoodForThought title="What does C put in a new array?">
            <p>
              Whatever was there before. C&apos;s <code>malloc</code> doesn&apos;t clear the memory it hands out, so a
              new array can hold leftover bits from earlier code. A bug that reads them can act differently on every
              run. C0 always fills in default values, so every run starts the same.
            </p>
          </FoodForThought>
          <Comic
            panels={[
              { who: "honk", outfit: "berry", size: "s", pose: "shrug", say: "Blank boxes?" },
              { who: "chonk", outfit: "cozy", size: "xl", pose: "stand", say: "Never blank in C0." },
            ]}
          />
          <p className="task">Predict element 0 of each new array.</p>
          <Rows
            options={defaults}
            rows={[
              { prompt: <code>alloc_array(int, 3)</code>, answer: 0, why: "The default int is 0.", miss: notDefault(0) },
              { prompt: <code>alloc_array(bool, 3)</code>, answer: 1, why: "The default bool is false.", miss: notDefault(1) },
              {
                prompt: <code>alloc_array(char, 3)</code>,
                answer: 2,
                why: "The default char is '\\0', the null character.",
                miss: notDefault(2),
              },
              {
                prompt: <code>alloc_array(string, 3)</code>,
                answer: 3,
                why: 'The default string is "", the empty string.',
                miss: notDefault(3),
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Out of bounds",
      minutes: 1.5,
      body: (
        <>
          <p>
            <code>geese</code> has elements 0 to 4. So what happens if we ask for <code>geese[5]</code>, or{" "}
            <code>geese[-1]</code>?
          </p>
          <Comic panels={[{ who: "honk", outfit: "frankenstein", size: "l", pose: "think", say: "Let's poke past the end." }]} />
          <p className="task">
            Slide <code>i</code> past either end.
          </p>
          <ArrayIndex name="geese" cells={[12, 9, 15, 7, 11]} min={-2} max={6} start={4} />
          <Pick
            question={
              <>
                What does C0 do when it runs <code>geese[5] = 3;</code>?
              </>
            }
            options={["It stops with an error", "It writes 3 just past the end", "It makes the array longer"]}
            answer={0}
            wrong={["", "C0 checks every access, so it never touches memory past the end.", "An array's length never changes."]}
            explain={
              <>
                There is no element 5, so C0 stops with an error. Reading or writing out of bounds is a{" "}
                <Big c={1}>safety</Big> violation, just like dividing by 0 in <Link href="/lessons/2">Lecture 2</Link>.
                C0 checks every access.
              </>
            }
          />
          <FoodForThought title="What happens in C?">
            <p>
              C doesn&apos;t store array lengths, so it can&apos;t check bounds. Reading or writing out of bounds in C
              is <b>undefined behavior</b>. The program may crash or quietly read or overwrite other memory, which
              attackers use in <b>buffer overflow</b> attacks. Java and Rust check every access, like C0, so a bad
              index can never touch memory outside the array.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Contracts for arrays",
      minutes: 2,
      body: (
        <>
          <p>
            To avoid those errors, array operations come with contracts, like the functions in{" "}
            <Link href="/lessons/1">Lecture 1</Link>. When we use them, <Big c={1}>safety</Big> means proving their
            preconditions hold.
          </p>
          <Code src={arrayOps} label="Contracts of the array operations" />
          <p>
            <code>\length(A)</code> is the length of A, but <Hi c={1}>only contracts may use it</Hi>.
          </p>
          <FoodForThought title="Why only contracts?">
            <p>
              C0 stores each array&apos;s length so it can check bounds. C doesn&apos;t store it at all, and C0 code is
              meant to carry over to C. So C0 keeps the length out of ordinary code, and passing n along with the
              array, as <code>goose_sum</code> does, is the habit you&apos;ll need in C.
            </p>
          </FoodForThought>
          <Comic
            panels={[
              { who: "honk", outfit: "irish", size: "xs", pose: "think", say: "Then how does a function know the length?" },
              { who: "chonk", outfit: "tidy", size: "m", pose: "point", say: "Let's look at an example." },
            ]}
          />
          <Code src={sum} label="goose_sum" />
          <Pick
            question="Which line doesn't compile?"
            options={["Line 2", "Line 5", "Line 6"]}
            answer={1}
            wrong={["Line 2 is a contract, so it may use \\length.", "", "geese[i] is an ordinary array access."]}
            explain={
              <>
                Line 5 uses <code>\length</code> in code, outside any contract.
                <Pick
            question={
              <>
                Which loop guard should line 5 use instead?
              </>
            }
            options={[<code key="a">i &lt; n</code>, <code key="b">i &lt;= n</code>, <code key="c">i &lt; n - 1</code>]}
            answer={0}
            wrong={[
              "",
              <>
                When <code>i</code> is n, <code>geese[i]</code> is one past the end.
              </>,
              <>
                That skips the last element, <code>geese[n-1]</code>.
              </>,
            ]}
            explain={<>Line 2 says n is the length, so every <code>geese[i]</code> stays in bounds.</>}
                />
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Two names, one array",
      minutes: 2,
      body: (
        <>
          <p>
            Page 5 showed that assigning one array variable to another compiles. What does it do?
          </p>
          <Comic
            panels={[
              {
                who: "honk",
                outfit: "valentine",
                size: "m",
                pose: "think",
                say: (
                  <>
                    Does <code>chonk</code> get its own copy?
                  </>
                ),
              },
              { who: "chonk", outfit: "party", size: "m", pose: "shrug", say: "Let's find out." },
            ]}
          />
          <Code src={alias.split("\n").slice(0, 3).join("\n")} label="Copying an array variable" />
          <Pick
            question={
              <>
                After these lines, what is <code>honk[0]</code>?
              </>
            }
            options={["0", "7"]}
            answer={1}
            wrong={["No second array was ever made."]}
            explain={
              <>
                Line 2 copies the address, so <code>honk</code> and <code>chonk</code> point to the same array. They
                are <Big c={2}>aliases</Big>, and a change through one shows through the other.
                <MemStepper
                  src={alias}
                  label="Aliases"
                  steps={[
                    { line: 1, frames: [{ fn: "main", active: true, vars: [{ name: "honk", to: "A" }] }], arrays: [{ id: "A", cells: [0, 0, 0] }] },
                    {
                      line: 2,
                      frames: [{ fn: "main", active: true, vars: [{ name: "honk", to: "A" }, { name: "chonk", to: "A" }] }],
                      arrays: [{ id: "A", cells: [0, 0, 0] }],
                    },
                    {
                      line: 3,
                      frames: [{ fn: "main", active: true, vars: [{ name: "honk", to: "A" }, { name: "chonk", to: "A" }] }],
                      arrays: [{ id: "A", cells: [7, 0, 0], hot: [0] }],
                    },
                    {
                      line: 4,
                      frames: [
                        {
                          fn: "main",
                          active: true,
                          vars: [
                            { name: "honk", to: "A" },
                            { name: "chonk", to: "A" },
                            { name: "goose", to: "B" },
                          ],
                        },
                      ],
                      arrays: [
                        { id: "A", cells: [7, 0, 0] },
                        { id: "B", cells: [0, 0, 0] },
                      ],
                    },
                    {
                      line: 5,
                      frames: [
                        {
                          fn: "main",
                          active: true,
                          vars: [
                            { name: "honk", to: "A" },
                            { name: "chonk", to: "A" },
                            { name: "goose", to: "B" },
                          ],
                        },
                      ],
                      arrays: [
                        { id: "A", cells: [7, 0, 0] },
                        { id: "B", cells: [7, 0, 0], hot: [0] },
                      ],
                    },
                  ]}
                />
              </>
            }
          />
          <p>
            Then <code>int[] goose = alloc_array(int, 3);</code> and <code>goose[0] = 7;</code> run. What does{" "}
            <code>==</code> say about these arrays?
          </p>
          <Rows
            options={["true", "false"]}
            rows={[
              {
                prompt: <code>honk == chonk</code>,
                answer: 0,
                why: "On arrays, == compares addresses, and these two hold the same address.",
                miss: [undefined, "They hold the same address, so == is true."],
              },
              {
                prompt: <code>honk == goose</code>,
                answer: 1,
                why: "On arrays, == compares addresses, and these are two different arrays.",
                miss: ["The elements match, but == compares addresses, and these are two arrays."],
              },
            ]}
          />
          <FoodForThought title="Aliases are everywhere">
            <p>
              Whether assigning shares or copies depends on the type. An array variable holds an address, so copying
              it makes both names lead to the same array. When structs and pointers arrive, as in{" "}
              <Link href="/lectures#l10">Linked lists</Link>, a pointer holds an address too, and copying it makes an
              alias the same way. An int or bool variable holds the value itself, so copying it gives a separate copy
              that changes on its own.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Garbage collection",
      minutes: 1.5,
      body: (
        <>
          <p>Aliases share an array. So what happens to an array once nothing points to it?</p>
          <Comic panels={[{ who: "chonk", outfit: "builder", size: "l", pose: "point", say: "Follow every arrow." }]} />
          <Code src={garbage} label="Moving arrows" />
          <Pick
            question="After line 4, which array can no variable reach?"
            options={["The first array, with 3 elements", "The second array, with 2 elements", "Neither"]}
            answer={0}
            wrong={["", "honk and chonk both point to it.", "Check where honk and chonk point after line 4."]}
            explain={
              <>
                After line 4, nothing points to the first array, so it is <b>garbage</b>. In{" "}
                <Big c={2}>allocated memory</Big>, C0&apos;s <b>garbage collector</b>{" "}
                eventually reclaims garbage, whenever C0 decides to. Local memory is never garbage collected, since
                frames are decommissioned instead.
                <MemStepper
                  src={garbage}
                  label="Garbage"
                  steps={[
                    { line: 1, frames: [{ fn: "main", active: true, vars: [{ name: "honk", to: "A" }] }], arrays: [{ id: "A", cells: [0, 0, 0] }] },
                    {
                      line: 2,
                      frames: [{ fn: "main", active: true, vars: [{ name: "honk", to: "A" }, { name: "chonk", to: "A" }] }],
                      arrays: [{ id: "A", cells: [0, 0, 0] }],
                    },
                    {
                      line: 3,
                      frames: [{ fn: "main", active: true, vars: [{ name: "honk", to: "B" }, { name: "chonk", to: "A" }] }],
                      arrays: [
                        { id: "A", cells: [0, 0, 0] },
                        { id: "B", cells: [0, 0] },
                      ],
                    },
                    {
                      line: 4,
                      frames: [{ fn: "main", active: true, vars: [{ name: "honk", to: "B" }, { name: "chonk", to: "B" }] }],
                      arrays: [
                        { id: "A", cells: [0, 0, 0], gone: true },
                        { id: "B", cells: [0, 0] },
                      ],
                    },
                  ]}
                />
              </>
            }
          />
          <FoodForThought title="Garbage means unreachable">
            <p>
              A garbage collector looks for arrays that no chain of arrows from a variable can reach. Nothing can ever
              use them again, so reclaiming them is safe. Java, Python and JavaScript also collect garbage for you. C
              has none, so in <Link href="/lectures#l18">C&apos;s memory model</Link> you&apos;ll free memory yourself,
              and freeing too early or twice becomes a new kind of bug.
            </p>
          </FoodForThought>
        </>
      ),
    },
    {
      title: "Arrays as arguments",
      minutes: 2,
      body: (
        <>
          <p>
            Assigning an array copies its address. Passing an array to a function does the same, so the parameter and
            the argument are <Big c={2}>aliases</Big>.
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "shore", size: "s", pose: "think", say: "Can a function change my array?" },
              { who: "chonk", outfit: "reader", size: "l", pose: "point", say: "Follow the addresses." },
            ]}
          />
          <Code src={reset} label="honk_reset and main" />
          <p className="task">After line 13, what is each value?</p>
          <Rows
            options={["0", "8", "9", "99"]}
            rows={[
              {
                prompt: <code>honk[0]</code>,
                answer: 2,
                why: "On line 4, geese and honk were aliases, so main sees the 9.",
                miss: [
                  "Line 4 wrote to the shared array before line 6 pointed geese at a new one.",
                  "8 is the value of goose, but line 4 stored chonk + 1.",
                  undefined,
                  "Line 6 pointed geese at a new array first, so the 99 went there.",
                ],
              },
              {
                prompt: <code>goose</code>,
                answer: 1,
                why: "chonk got a copy of goose, so line 5 changed only the copy.",
                miss: [
                  "Line 5 set chonk, which is a copy in the frame for honk_reset.",
                  undefined,
                  "goose is an int, so honk_reset got a copy of it.",
                  "goose is an int, and nothing in main changes it.",
                ],
              },
            ]}
          />
          <Reveal label="Show the memory">
            <p>
              <Hi c={2}>A function can only affect its caller by returning a value or by changing shared allocated memory.</Hi>
            </p>
            <MemStepper
              src={reset}
              label="honk_reset and main, step by step"
              steps={[
                {
                  line: 12,
                  frames: [{ fn: "main", active: true, vars: [{ name: "honk", to: "A" }, { name: "goose", value: 8 }] }],
                  arrays: [{ id: "A", cells: [0, 0] }],
                },
                {
                  line: 4,
                  frames: [
                    { fn: "main", vars: [{ name: "honk", to: "A" }, { name: "goose", value: 8 }] },
                    {
                      fn: "honk_reset",
                      active: true,
                      vars: [
                        { name: "geese", to: "A" },
                        { name: "n", value: 2 },
                        { name: "chonk", value: 8 },
                      ],
                    },
                  ],
                  arrays: [{ id: "A", cells: [9, 0], hot: [0] }],
                },
                {
                  line: 5,
                  frames: [
                    { fn: "main", vars: [{ name: "honk", to: "A" }, { name: "goose", value: 8 }] },
                    {
                      fn: "honk_reset",
                      active: true,
                      vars: [
                        { name: "geese", to: "A" },
                        { name: "n", value: 2 },
                        { name: "chonk", value: 0 },
                      ],
                    },
                  ],
                  arrays: [{ id: "A", cells: [9, 0] }],
                },
                {
                  line: 6,
                  frames: [
                    { fn: "main", vars: [{ name: "honk", to: "A" }, { name: "goose", value: 8 }] },
                    {
                      fn: "honk_reset",
                      active: true,
                      vars: [
                        { name: "geese", to: "B" },
                        { name: "n", value: 2 },
                        { name: "chonk", value: 0 },
                      ],
                    },
                  ],
                  arrays: [
                    { id: "A", cells: [9, 0] },
                    { id: "B", cells: [0, 0] },
                  ],
                },
                {
                  line: 7,
                  frames: [
                    { fn: "main", vars: [{ name: "honk", to: "A" }, { name: "goose", value: 8 }] },
                    {
                      fn: "honk_reset",
                      active: true,
                      vars: [
                        { name: "geese", to: "B" },
                        { name: "n", value: 2 },
                        { name: "chonk", value: 0 },
                      ],
                    },
                  ],
                  arrays: [
                    { id: "A", cells: [9, 0] },
                    { id: "B", cells: [99, 0], hot: [0] },
                  ],
                },
                {
                  line: 13,
                  note: "honk_reset returns, so its frame is decommissioned and array B becomes garbage.",
                  frames: [
                    { fn: "main", active: true, vars: [{ name: "honk", to: "A" }, { name: "goose", value: 8 }] },
                    {
                      fn: "honk_reset",
                      gone: true,
                      vars: [
                        { name: "geese", to: "B" },
                        { name: "n", value: 2 },
                        { name: "chonk", value: 0 },
                      ],
                    },
                  ],
                  arrays: [
                    { id: "A", cells: [9, 0] },
                    { id: "B", cells: [99, 0], gone: true },
                  ],
                },
              ]}
            />
          </Reveal>
        </>
      ),
    },
    {
      title: "Drawing memory",
      minutes: 2,
      body: (
        <>
          <p>
            Checkins often ask you to draw <Big c={2}>memory</Big> like this, so let&apos;s practice. Line 2 makes array
            A and line 3 makes array B.
          </p>
          <Code src={draw} label="A short main" />
          <Comic panels={[{ who: "honk", outfit: "pumpkin", size: "xl", pose: "point", say: "Track each arrow line by line." }]} />
          <p className="task">Draw each arrow as it is on line 9.</p>
          <MemDraw
            frame="main"
            arrays={[
              { id: "A", cells: ["?", "?", "?"] },
              { id: "B", cells: ["?", "?", "?"] },
            ]}
            vars={[
              { name: "honk", answer: "A", why: "Only line 2 assigns honk.", miss: { B: "Only line 2 assigns honk." } },
              { name: "chonk", answer: "B", why: "Only line 3 assigns chonk.", miss: { A: "No line after line 3 assigns chonk." } },
              { name: "goose", answer: "B", why: "Line 7 copied the address in chonk.", miss: { A: "goose starts out pointing to A, but line 7 assigns it again." } },
            ]}
          />
          <Rows
            options={["0, 4, 6", "2, 4, 6", "0, 4, 0"]}
            rows={[
              {
                prompt: "On line 9, array A holds",
                answer: 0,
                why: "Lines 5 and 6 write to A through honk and goose. By line 8, goose points to B.",
                miss: [undefined, "Line 7 moved goose to B, so line 8 writes to B.", "goose still pointed to A on line 6."],
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Reversing an array",
      minutes: 1.5,
      body: (
        <>
          <p>
            Now let&apos;s write a function of our own. Chonk wants <code>goose_reverse</code> to return a new array
            holding the elements of <code>honk</code> in reverse order.
          </p>
          <Comic
            panels={[
              { who: "chonk", outfit: "hero", size: "s", pose: "cheer", say: "Reversing is easy!" },
              { who: "honk", outfit: "clown", size: "m", pose: "think", say: "Is it, though?" },
            ]}
          />
          <Code src={reverseAlias} label="goose_reverse, first try" />
          <p className="task">
            <code>honk</code> holds 1 2 3 4. Run it.
          </p>
          <RunTable
            runs={[
              {
                call: <code>goose_reverse(honk, 4)</code>,
                out: (
                  <>
                    returns 4 3 3 4, and <code>honk</code> now holds 4 3 3 4 too
                  </>
                ),
                ok: false,
              },
            ]}
          />
          <Pick
            question="What went wrong?"
            options={[
              <span key="a">
                Writes to <code>chonk</code> change <code>honk</code>
              </span>,
              <span key="b">
                <code>honk[n - 1 - i]</code> goes out of bounds
              </span>,
              "The loop runs one time too many",
            ]}
            answer={0}
            wrong={["", "Here n is 4, so the index goes from 3 down to 0, all in bounds.", "i goes from 0 to 3, once per element."]}
            explain={
              <>
                Line 4 makes <code>chonk</code> an alias of <code>honk</code>, so by the time i is 2, the loop reads
                elements it already overwrote. Line 4 has to make a new array instead.
                <Code src={reverseNew} label="goose_reverse, fixed" hi={[4]} />
                <RunTable
                  runs={[
                    {
                      call: <code>goose_reverse(honk, 4)</code>,
                      out: (
                        <>
                          returns 4 3 2 1, and <code>honk</code> still holds 1 2 3 4
                        </>
                      ),
                      ok: true,
                    },
                  ]}
                />
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Is every access safe?",
      minutes: 2,
      body: (
        <>
          <p>
            <code>goose_reverse</code> works now. But is <code>honk[n - 1 - i]</code> on line 8 always in bounds?
          </p>
          <Comic panels={[{ who: "honk", outfit: "pilgrim", size: "m", pose: "shrug", say: "i starts at 0 and goes up, so it's fine. Right?" }]} />
          <p>
            That&apos;s <b>operational reasoning</b>, tracing how the code runs, with no line to point to. So we state
            it as the loop invariant on line 6 and prove it next. Then <Big c={1}>point-to reasoning</Big>, which
            justifies each fact by pointing to a line, can cite line 6.
          </p>
          <Code src={reverseInv} label="goose_reverse with a loop invariant" />
          <p className="task">
            Prove that <code>honk[n - 1 - i]</code> is safe. Fill in each blank.
          </p>
          <ProofTable
            options={["Line 2", "Line 5", "Line 6", "Math on step 1", "Math on step 3", "Steps 4 and 5"]}
            claims={[
              <code key="a">0 &lt;= n - 1 - i</code>,
              <code key="b">n - 1 - i &lt; n</code>,
              <code key="c">n - 1 - i &lt; \length(honk)</code>,
              <code key="d">0 &lt; n - 1 - i</code>,
              <code key="e">n - 1 - i &lt;= \length(honk)</code>,
            ]}
            rows={[
              {
                claim: <code>i &lt; n</code>,
                answer: 1,
                why: "The loop guard is true inside the body.",
                miss: [
                  "Line 2 says n is the length, nothing about i.",
                  undefined,
                  "Line 6 gives a lower bound on i.",
                  "This is the first step, so there is no earlier step to use.",
                  "This is the first step, so there is no earlier step to use.",
                  "This is the first step, so there is no earlier step to use.",
                ],
              },
              { claim: <code>0 &lt;= n - 1 - i</code>, answer: 3, given: true },
              { claim: <code>0 &lt;= i</code>, answer: 2, given: true },
              {
                claim: <code>n - 1 - i &lt; n</code>,
                claimAnswer: 1,
                answer: 4,
                why: (
                  <>
                    Since <code>i &gt;= 0</code>, the index is at most <code>n - 1</code>.
                  </>
                ),
                miss: [
                  "That's step 2.",
                  undefined,
                  "We need n first, then step 5 swaps in the length.",
                  <>
                    That&apos;s false when <code>i</code> is <code>n - 1</code>.
                  </>,
                  "We need n first, then step 5 swaps in the length.",
                ],
              },
              {
                claim: <code>n == \length(honk)</code>,
                answer: 0,
                why: "The precondition, and neither n nor honk changes.",
                miss: [
                  undefined,
                  "Line 5 is the loop. The length comes from the precondition.",
                  "Line 6 is about i.",
                  "Step 1 is about i, and this step is about n.",
                  "Step 3 is about i, and this step is about n.",
                  "A step can't cite itself.",
                ],
              },
              {
                claim: <code>n - 1 - i &lt; \length(honk)</code>,
                claimAnswer: 2,
                answer: 5,
                why: "Step 5 lets us replace n with the length.",
                miss: [
                  "That's step 2.",
                  "That's step 4, which uses n.",
                  undefined,
                  <>
                    That&apos;s false when <code>i</code> is <code>n - 1</code>.
                  </>,
                  "<= isn't enough, since an index equal to the length is out of bounds.",
                ],
              },
            ]}
          />
          <p>
            <code>chonk[i]</code> is safe too, by lines 5 and 6 and the postcondition of <code>alloc_array</code>.
          </p>
        </>
      ),
    },
    {
      title: "Proving the invariant",
      minutes: 2,
      body: (
        <>
          <p>
            Step 3 pointed to line 6, so now we owe a proof that the <Big c={1}>loop invariant</Big> is true. As in{" "}
            <Link href="/lessons/1">Lecture 1</Link>, we show INIT, that it holds before the first check, and PRES,
            that one iteration keeps it true. We write <code>i&apos;</code> for the value
            of i after one more iteration.
          </p>
          <Comic
            panels={[
              {
                who: "honk",
                outfit: "fence",
                size: "xs",
                pose: "oops",
                say: (
                  <>
                    Can <code>i + 1</code> overflow?
                  </>
                ),
              },
              { who: "chonk", outfit: "winter", size: "m", pose: "think", say: "Let's prove it can't." },
            ]}
          />
          <Code src={reverseInv} label="goose_reverse with a loop invariant" hi={[5, 6]} />
          <p className="task">Fill in each blank.</p>
          <ProofTable
            options={["Line 5", "Assumption", "Math on step 1", "Math on step 4", "Steps 3, 5 and 6"]}
            claims={[
              <code key="a">0 &lt;= i</code>,
              <code key="b">i &lt; n</code>,
              <code key="c">i&apos; == i + 1</code>,
              <code key="d">i &lt;= n</code>,
              <code key="e">i&apos; == i</code>,
              <code key="f">0 &lt; i</code>,
            ]}
            rows={[
              {
                group: "INIT",
                claim: <code>i == 0</code>,
                answer: 0,
                why: "The loop starts i at 0.",
                miss: [
                  undefined,
                  "INIT has nothing to assume yet.",
                  "This is the first step, so there is no earlier step to use.",
                  "This is the first step, so there is no earlier step to use.",
                  "This is the first step, so there is no earlier step to use.",
                ],
              },
              { claim: <code>0 &lt;= i</code>, answer: 2, given: true },
              { group: "PRES", claim: <code>0 &lt;= i</code>, answer: 1, given: true },
              {
                claim: <code>i &lt; n</code>,
                claimAnswer: 1,
                answer: 0,
                why: "The guard was true, or the body wouldn't run.",
                miss: [
                  "That's step 3.",
                  undefined,
                  "That's about the value after the iteration.",
                  "That's weaker than what the guard says.",
                  "i++ changes i, so i' isn't i.",
                  "That's not what the guard says.",
                ],
              },
              {
                claim: <code>i != int_max()</code>,
                answer: 3,
                why: (
                  <>
                    <code>n &lt;= int_max()</code>, and i is less than n, so <code>i + 1</code> can&apos;t overflow.
                  </>
                ),
                miss: [
                  "Line 5 doesn't mention int_max().",
                  "We can't assume it. We have to prove it.",
                  "Step 1 belongs to INIT.",
                  undefined,
                  "Step 6 comes after this one.",
                ],
              },
              {
                claim: <code>i&apos; == i + 1</code>,
                claimAnswer: 2,
                answer: 0,
                why: "The i++ on line 5 makes the new value.",
                miss: [
                  "That's step 3.",
                  "That's step 4.",
                  undefined,
                  "That's about i, but line 5 also says how i changes.",
                  "i++ adds 1, so i' isn't i.",
                  "That's about i, but line 5 also says how i changes.",
                ],
              },
              { claim: <code>0 &lt;= i&apos;</code>, answer: 4, given: true },
            ]}
          />
        </>
      ),
    },
    {
      title: "Callers see contracts",
      minutes: 1.5,
      body: (
        <>
          <p>
            Inside, <code>goose_reverse</code> is safe. Now let&apos;s check a caller.
          </p>
          <Code src={caller} label="Calling goose_reverse twice" />
          <p>
            Line 4 needs <code>3 == \length(chonk)</code>. Reading the code of <code>goose_reverse</code> would tell
            us, but that&apos;s operational reasoning again.{" "}
            <Hi c={1}>A caller may only point to the contracts of the functions it calls.</Hi>
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "thanksgiving", size: "s", pose: "think", say: "Can't I just peek at the code?" },
              { who: "chonk", outfit: "grad", size: "m", pose: "shrug", say: "Only the contract counts." },
            ]}
          />
          <Pick
            question={
              <>
                Which postcondition should <code>goose_reverse</code> add?
              </>
            }
            options={[
              <code key="a">{"//@ensures \\length(\\result) == n;"}</code>,
              <code key="b">{"//@ensures \\length(honk) == n;"}</code>,
              <code key="c">{"//@ensures \\result != honk;"}</code>,
            ]}
            answer={0}
            wrong={["", "That's already the precondition, and it says nothing about the result.", "It's true, but it says nothing about the length."]}
            explain={
              <>
                <code>\length(\result) == n</code> holds, since <code>goose_reverse</code> returns the{" "}
                <code>chonk</code> it allocated with length n. Now the caller can point to it.
                <ProofTable
                  options={[
                    "Line 2 and the postcondition of alloc_array",
                    "Line 3 and the postcondition of goose_reverse",
                    "Reading the loop in goose_reverse",
                  ]}
                  claims={[
                    <code key="a">\length(chonk) == 3</code>,
                    <code key="b">\length(honk) == 3</code>,
                    <code key="c">chonk == honk</code>,
                  ]}
                  rows={[
                    {
                      group: "Line 3 is safe",
                      claim: <code>\length(honk) == 3</code>,
                      claimAnswer: 1,
                      answer: 0,
                      why: "alloc_array promises the new array has length 3.",
                      miss: ["That's about chonk, which line 3 hasn't made yet.", undefined, "goose_reverse returns a new array, and its contracts don't say chonk == honk."],
                    },
                    {
                      group: "Line 4 is safe",
                      claim: <code>\length(chonk) == 3</code>,
                      answer: 1,
                      why: "goose_reverse promises a result of length n, which is 3.",
                      miss: [
                        "chonk comes from the call to goose_reverse on line 3.",
                        undefined,
                        "That's operational reasoning. A caller can only use contracts.",
                      ],
                    },
                  ]}
                />
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Arrays in later lectures",
      minutes: 1.5,
      body: (
        <>
          <Comic
            panels={[
              { who: "honk", outfit: "rockstar", size: "xl", pose: "cheer", say: "An array variable is just an arrow!" },
              { who: "chonk", outfit: "plain", size: "m", pose: "love", say: "So watch where it points, and prove every index." },
            ]}
          />
          <p>
            Most of the first half of the course uses arrays, and looping over them leads to loop invariants and
            sorting.
          </p>
          <p className="task">Match each idea to its lecture.</p>
          <Rows
            options={["Searching arrays", "Binary search", "Quicksort", "Unbounded arrays"]}
            rows={[
              { prompt: "Check each element for a value", answer: 0, why: <><Link href="/lectures#l4">Searching arrays</Link>, Lecture 4.</>, miss: laterMiss(0) },
              { prompt: "Use the order of a sorted array to skip most elements", answer: 1, why: <><Link href="/lectures#l6">Binary search</Link>, Lecture 6.</>, miss: laterMiss(1) },
              { prompt: "Sort by splitting an array around a pivot", answer: 2, why: <><Link href="/lectures#l7">Quicksort</Link>, Lecture 7.</>, miss: laterMiss(2) },
              { prompt: "Grow a full array by copying it", answer: 3, why: <><Link href="/lectures#l11">Unbounded arrays</Link>, Lecture 11.</>, miss: laterMiss(3) },
            ]}
          />
          <ul>
            <li>
              <Link href="/lectures#l9">Stacks and queues</Link> hold a worklist, the items a program still has to
              process.
            </li>
            <li>
              <Link href="/lectures#l12">Hashing</Link> stores a hash table in an array.
            </li>
            <li>
              <Link href="/lectures#l18">C&apos;s memory model</Link> has no bounds checks and no garbage collector.
            </li>
          </ul>
        </>
      ),
    },
  ],
};
