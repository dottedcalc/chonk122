import Link from "next/link";
import { Big } from "@/components/lesson/Big";
import { BitOps } from "@/components/lesson/BitOps";
import { Code } from "@/components/lesson/Code";
import { Comic } from "@/components/lesson/Comic";
import { Digits } from "@/components/lesson/Digits";
import { Hi } from "@/components/lesson/Hi";
import { Perms } from "@/components/lesson/Perms";
import { Pick } from "@/components/lesson/Pick";
import { ProofTable } from "@/components/lesson/ProofTable";
import { Rows } from "@/components/lesson/Rows";
import { RunTable } from "@/components/lesson/RunTable";
import { Shifter } from "@/components/lesson/Shifter";
import { Versions } from "@/components/lesson/Versions";
import { Wheel } from "@/components/lesson/Wheel";
import type { Lesson } from "./types";

// Lecture 2, Ints. Every output below was checked with gcc; see docs/lessons/02-notes.md.

const INT_MIN = -2147483648;

const oneMore = `#use <util>

int chonk = int_max();
printint(chonk);
println("");
printint(chonk + 1);`;

const add = `int honk_add(int honk, int chonk)
//@requires chonk > 0;
//@requires honk <= int_max() - chonk;
{
  return honk + chonk;
}`;

const split = `int goose_split(int honk, int geese) {
  return honk / geese;
}`;

const topByte = `int honk_top_byte(int goose)
//@ensures 0 <= \\result && \\result <= 255;
{
  return goose >> 24;
}`;

const topByteFixed = `int honk_top_byte(int goose)
//@ensures 0 <= \\result && \\result <= 255;
{
  return (goose >> 24) & 0xFF;
}`;

export const ints: Lesson = {
  n: 2,
  title: "Ints",
  pages: [
    {
      title: "Is an int a number?",
      minutes: 1.5,
      body: (
        <>
          <p>
            In math, adding 1 always gives a bigger number. Chonk counts geese in an <code>int</code>, and the count has
            reached the biggest int there is, <code>int_max()</code> from the <code>&lt;util&gt;</code> library.
          </p>
          <Comic
            panels={[
              { who: "chonk", outfit: "detective", size: "xl", pose: "think", say: "One more goose. Easy, right?" },
              { who: "honk", outfit: "takeoff", size: "xs", pose: "oops", say: "Uh oh." },
            ]}
          />
          <Code src={oneMore} label="Counting one more goose" />
          <Pick
            question={
              <>
                What does the second <code>printint</code> print?
              </>
            }
            options={["2147483648", "An error", "-2147483648"]}
            answer={2}
            explain={
              <>
                The first line prints 2147483647 and the second prints −2147483648. One more goose made the count
                negative. This lesson shows what an int really is, so results like this make sense.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Many ways to write seven",
      minutes: 1.5,
      body: (
        <>
          <Comic
            panels={[
              { who: "honk", outfit: "karaoke", size: "m", pose: "wave", say: "7, VII, sept, seven!" },
              { who: "chonk", outfit: "reader", size: "s", pose: "stand", say: "Same seven, different spelling." },
            ]}
          />
          <p>
            In <b>place value</b>, each digit is multiplied by a power of the <b>base</b>, set by its position. Adding
            then works position by position, with carries. Computers use base 2, or <b>binary</b>, because their chips
            hold two voltage levels. A binary digit is a <b>bit</b>.
          </p>
          <p className="task">Write each number.</p>
          <Digits
            bases={[10, 2]}
            width={4}
            targets={[
              { label: "Seven in decimal", value: 7, base: 10 },
              { label: "Seven in binary", value: 7, base: 2 },
              { label: "Twelve in binary", value: 12, base: 2 },
            ]}
          />
        </>
      ),
    },
    {
      title: "Binary, hex and decimal",
      minutes: 1.5,
      body: (
        <>
          <p>
            <b>Hexadecimal</b>, or hex, is base 16, with digits 0 to 9 and A to F. One hex digit stands for exactly 4
            bits, so hex is a short way to write long bit patterns. In C0, a hex number starts with <code>0x</code>.
          </p>
          <Comic panels={[{ who: "chonk", outfit: "wizard", size: "s", pose: "point", say: "Read the bits four at a time." }]} />
          <p className="task">Flip bits to make each number.</p>
          <Digits
            bases={[2]}
            width={8}
            hex
            targets={[
              { label: "37", value: 37 },
              { label: "0xB2", value: 0xb2 },
            ]}
          />
          <p>
            C0 always prints in decimal. The function <code>int2hex</code> from <code>&lt;util&gt;</code> shows an int
            in hex.
          </p>
          <RunTable
            runs={[
              { call: <code>printint(0x1F)</code>, out: "prints 31" },
              { call: <code>int2hex(255)</code>, out: 'returns "000000FF"' },
            ]}
          />
        </>
      ),
    },
    {
      title: "Too big for four bits",
      minutes: 2,
      body: (
        <>
          <p>
            A <b>word</b> is the fixed number of bits a computer works on at once, and an int is one word, 32 bits in
            C0. To keep examples small, picture a 4-bit computer, whose words can hold only 16 different patterns. <b>Overflow</b>{" "}
            happens when a result needs more bits than a word has. It can happen to intermediate results too.
          </p>
          <Comic
            panels={[
              {
                who: "honk",
                outfit: "pilgrim",
                size: "l",
                pose: "oops",
                say: (
                  <>
                    Adding 1 to <code>1111</code> needs five bits!
                  </>
                ),
              },
              { who: "chonk", outfit: "builder", size: "s", pose: "think", say: "So where does the extra bit go?" },
            ]}
          />
          <p className="task">
            Suppose overflow stopped the program with an error. With <code>honk</code> set to 12 on a 4-bit computer that reads its bits as 0 to 15,
            run both.
          </p>
          <RunTable
            runs={[
              { call: <code>honk + (honk - honk)</code>, out: "returns 12" },
              { call: <code>(honk + honk) - honk</code>, out: "error, because 12 + 12 needs 5 bits" },
            ]}
          />
          <Pick
            question="What does C0 do when + or * overflows?"
            options={["It stops with an error", "It drops the extra bits and keeps going"]}
            answer={1}
            explain={
              <>
                C0 keeps going. With errors, the two runs show associativity failing, so moving parentheses could break a
                program.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Wrapping around",
      minutes: 2,
      body: (
        <>
          <p>
            Dropping the fifth bit subtracts 16, so a 4-bit computer keeps the remainder mod 16. This is{" "}
            <Big c={2}>modular arithmetic</Big>. Picture the 16 patterns on a circle, where adding 1 steps clockwise.
          </p>
          <p className="task">Add 12 + 9 by stepping around the circle.</p>
          <Wheel goal={{ from: 12, by: 9 }} />
          <p>
            C0 works mod 2<sup>32</sup>. <Hi c={2}>The laws of <code>+</code> and <code>*</code> still hold</Hi>, such
            as commutativity and distributivity, so we can reason about sums and products as in math. C0 has no floats,
            because floating point numbers break some of these laws.
          </p>
          <Comic
            panels={[
              {
                who: "chonk",
                outfit: "winter",
                size: "m",
                pose: "cheer",
                say: "C0's circle has 2³² spots!",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Negatives are inverses",
      minutes: 1.5,
      body: (
        <>
          <p>
            In math, −x is the number that gives 0 when added to x. On the circle, the <b>additive inverse</b> of x is
            the y where x + y lands on 0. Subtraction steps counterclockwise.
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "clown", size: "s", pose: "shrug", say: "So where do negatives live?" },
              { who: "chonk", outfit: "tidy", size: "l", pose: "point", say: "Count back from zero and see." },
            ]}
          />
          <p className="task">Use the circle to answer each one.</p>
          <Wheel start={3} />
          <Rows
            options={["12", "13", "14", "15"]}
            rows={[
              { prompt: <>3 + y lands on 0, so y is</>, answer: 1, why: "3 + 13 is 16, which is 0 mod 16." },
              { prompt: <>1 + y lands on 0, so y is</>, answer: 3, why: "1 + 15 is 16, so −1 shares a spot with 15." },
              { prompt: <>4 + y lands on 0, so y is</>, answer: 0, why: "4 + 12 is 16." },
              {
                prompt: (
                  <>
                    <code>5 - 7</code> lands on
                  </>
                ),
                answer: 2,
                why: "Seven steps back from 5 reaches 14, and −2 is 14 mod 16.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "What does a pattern mean?",
      minutes: 2,
      body: (
        <>
          <p>
            Each spot on the circle stands for many numbers. 1110 stands for 14, but also for −2, 30 and every other
            number equal to 14 mod 16. To print an int or compare two, C0 must pick one meaning for each pattern. We want
            the numbers to run in order around the circle with a single jump, 0 to be included, about half to be
            negative, and the leftmost bit to tell the sign.
          </p>
          <Comic
            panels={[
              {
                who: "honk",
                outfit: "frankenstein",
                size: "m",
                pose: "think",
                say: (
                  <>
                    Is <code>1110</code> fourteen or minus two?
                  </>
                ),
              },
              { who: "chonk", outfit: "sleepy", size: "xs", pose: "shrug", say: "It depends where we cut." },
            ]}
          />
          <Wheel
            cuts={[
              { label: "Cut A", low: 0 },
              { label: "Cut B", low: -12 },
              { label: "Cut C", low: -8 },
            ]}
          />
          <Pick
            question="Which cut meets every goal?"
            options={["Cut A", "Cut B", "Cut C"]}
            answer={2}
            explain={
              <>
                Cut C reads −8 to 7, and its one jump is from 7 to −8. This choice is{" "}
                <Big c={2}>two&apos;s complement</Big>, and its leftmost bit is the <b>sign bit</b>. Cut A, reading 0 to
                15, is called <b>unsigned</b>. C0&apos;s ints use two&apos;s complement.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Reading two's complement",
      minutes: 2,
      body: (
        <>
          <p>
            In <Big c={2}>two&apos;s complement</Big>, the sign bit of a k-bit word is worth −2<sup>k−1</sup>. So 1101 is
            −8 + 4 + 1 = −3.
          </p>
          <Digits bases={[2]} width={4} signed start={0b1101} />
          <ul>
            <li>
              To negate, flip every bit and add 1, so <code>-x == ~x + 1</code>.
            </li>
            <li>
              <b>Sign extension</b> copies the sign bit to fill a longer word without changing the value. −3 is 1101 in 4
              bits and 111101 in 6 bits.
            </li>
            <li>
              In C0, <code>int_min()</code> is −2<sup>31</sup> = −2147483648 and <code>int_max()</code> is 2
              <sup>31</sup> − 1 = 2147483647.
            </li>
          </ul>
          <Comic
            panels={[
              {
                who: "honk",
                outfit: "inclass",
                size: "xs",
                pose: "point",
                say: "Here the sign bit is worth −8.",
              },
            ]}
          />
          <p className="task">What does each expression evaluate to?</p>
          <Rows
            options={["-1", "-6", "int_min()", "int_max()"]}
            rows={[
              { prompt: <code>~0</code>, answer: 0, why: "Flipping all 32 zeros gives all ones, which is −1." },
              { prompt: <code>~5</code>, answer: 1, why: "Since -x == ~x + 1, ~5 is −5 − 1." },
              {
                prompt: <code>int_max() + 1</code>,
                answer: 2,
                why: "Plus 1 from the largest int crosses the cut to the smallest.",
              },
              {
                prompt: <code>-int_min()</code>,
                answer: 2,
                why: "2147483648 is out of range, so it wraps back to int_min().",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "When does it overflow?",
      minutes: 2,
      body: (
        <>
          <p>
            An operation <b>overflows</b> when its mathematical result is outside <code>int_min()</code> to{" "}
            <code>int_max()</code>. For addition,
          </p>
          <ul>
            <li>adding numbers of opposite signs never overflows,</li>
            <li>
              adding two positives overflows exactly when the result is negative, and adding two negatives overflows
              exactly when the result is 0 or more,
            </li>
            <li>
              for <code>chonk &gt; 0</code>, <code>honk + chonk</code> overflows exactly when{" "}
              <code>honk &gt; int_max() - chonk</code>, a test that cannot overflow itself.
            </li>
          </ul>
          <p>
            <Hi c={2}>
              So <code>honk + 1 &gt; honk</code> can be false
            </Hi>
            , and comparisons need extra care.
          </p>
          <Comic panels={[{ who: "honk", outfit: "umpire", size: "m", pose: "point", say: "Out of range means overflow!" }]} />
          <p className="task">Does each expression overflow?</p>
          <Rows
            options={["Overflows", "No overflow"]}
            rows={[
              { prompt: <code>int_max() + int_min()</code>, answer: 1, why: "The signs are opposite, and the result is −1." },
              { prompt: <code>int_min() - 1</code>, answer: 0, why: "The result is below int_min(), so it wraps to int_max()." },
              { prompt: <code>int_min() + int_min()</code>, answer: 0, why: "Two negatives give 0, which is not negative." },
            ]}
          />
          <Pick
            question={
              <>
                For <code>chonk &lt; 0</code>, which test is true exactly when <code>honk + chonk</code> overflows?
              </>
            }
            options={[
              <code key="a">honk + chonk &lt; int_min()</code>,
              <code key="b">honk &lt; int_min() - chonk</code>,
              <code key="c">honk &gt; int_max() - chonk</code>,
            ]}
            answer={1}
            explain={
              <>
                Adding a negative can only go below <code>int_min()</code>. No int is less than <code>int_min()</code>,
                so the first test is always false. With <code>chonk &lt; 0</code>, <code>int_min() - chonk</code> is
                in range.
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Proving no overflow",
      minutes: 1.5,
      body: (
        <>
          <p>
            To prove that an expression never overflows, show that its mathematical result stays between{" "}
            <code>int_min()</code> and <code>int_max()</code>. Each step cites a line or an earlier step, just like the{" "}
            <Link href="/lessons/1">Lecture 1</Link> point-to proofs.
          </p>
          <Comic panels={[{ who: "honk", outfit: "pumpkin", size: "s", pose: "think", say: "Prove it, don't just test it." }]} />
          <Code src={add} label="honk_add" />
          <p className="task">Justify each step.</p>
          <ProofTable
            options={["Line 2", "Line 3 and step 1", "Steps 2 and 3"]}
            rows={[
              {
                claim: <><code>int_max() - chonk</code> on line 3 does not overflow</>,
                answer: 0,
                why: "chonk > 0, so the result is between 0 and int_max().",
              },
              {
                claim: <><code>honk + chonk &lt;= int_max()</code></>,
                answer: 1,
                why: "Add chonk to both sides of line 3, which holds as math because of step 1.",
              },
              {
                claim: <><code>honk + chonk &gt; int_min()</code></>,
                answer: 0,
                why: "Every int is at least int_min(), and chonk > 0 makes the sum bigger.",
              },
              {
                claim: <><code>honk + chonk</code> on line 5 does not overflow</>,
                answer: 2,
                why: "The mathematical result is in range.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Division rounds toward 0",
      minutes: 2,
      body: (
        <>
          <p>
            Integers don&apos;t always divide evenly, so C0 pairs <code>x / y</code> with the <b>modulus</b>{" "}
            <code>x % y</code>. They follow two rules.
          </p>
          <ul>
            <li>
              <code>(x / y) * y + x % y == x</code>
            </li>
            <li>The modulus is smaller in size than y, so 0 ≤ |x % y| &lt; |y|.</li>
          </ul>
          <p>
            <Hi c={2}>In C0, division rounds toward 0</Hi>, so a nonzero modulus takes the sign of x.
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "piada", size: "m", pose: "think", say: "Does −3.5 round up or down?" },
              { who: "chonk", outfit: "chef", size: "s", pose: "point", say: "C0 has a rule for that." },
            ]}
          />
          <p className="task">What does each expression evaluate to?</p>
          <Rows
            options={["3", "-3", "1", "-1"]}
            rows={[
              { prompt: <code>7 / 2</code>, answer: 0, why: "3.5 rounds toward 0." },
              { prompt: <code>-7 / 2</code>, answer: 1, why: "−3.5 rounds toward 0." },
              { prompt: <code>-7 % 2</code>, answer: 3, why: "(−3) × 2 + (−1) is −7." },
              { prompt: <code>7 % -2</code>, answer: 2, why: "(−3) × (−2) + 1 is 7." },
            ]}
          />
        </>
      ),
    },
    {
      title: "Unsafe division",
      minutes: 2,
      body: (
        <>
          <p>
            Like the functions in <Link href="/lessons/1">Lecture 1</Link>, division has preconditions, and{" "}
            <code>x % y</code> has the same ones.
          </p>
          <Code src={"//@requires y != 0;\n//@requires !(x == int_min() && y == -1);"} label="The preconditions of x / y" />
          <p>
            Dividing by 0 has no answer. The mathematical value of <code>int_min() / -1</code> is 2<sup>31</sup>, one
            more than <code>int_max()</code>. <Hi>Unlike + and *, which wrap, this division stops the program with an error</Hi>, so this
            division is unsafe.
          </p>
          <Comic
            panels={[
              { who: "chonk", outfit: "hero", size: "l", pose: "stand", say: "Check the divisor first!" },
              {
                who: "honk",
                outfit: "fence",
                size: "xs",
                pose: "oops",
                say: (
                  <>
                    Even when it&apos;s <code>-1</code>?
                  </>
                ),
              },
            ]}
          />
          <Code src={split} label="goose_split" />
          <p className="task">Is each call safe?</p>
          <Rows
            options={["Safe", "Unsafe"]}
            rows={[
              { prompt: <code>goose_split(7, -1)</code>, answer: 0, why: "It returns −7." },
              {
                prompt: <code>goose_split(int_min(), -1)</code>,
                answer: 1,
                why: "The division on line 2 breaks the second precondition of /.",
              },
              { prompt: <code>goose_split(int_min(), 2)</code>, answer: 0, why: "It returns −1073741824." },
              {
                prompt: <code>goose_split(0, 0)</code>,
                answer: 1,
                why: "The division on line 2 breaks the first precondition of /.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "An int as bits",
      minutes: 1.5,
      body: (
        <>
          <p>
            An int does not have to mean a number. Its 32 bits can hold any <b>bit pattern</b> that fits. Choosing how
            bits stand for information is <Big c={2}>data representation</Big>. Unix systems store a file&apos;s
            permissions in one int, with a bit each for whether the owner, the group and everyone else may read, write
            or execute it.
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "shore", size: "s", pose: "wave", say: "Can I read Chonk's diary?" },
              { who: "chonk", outfit: "grad", size: "m", pose: "shrug", say: "Only if your read bit is on." },
            ]}
          />
          <p className="task">Set the permissions to each pattern.</p>
          <Perms
            start={0x1a4}
            targets={[
              { label: <code>rw-rw-r--</code>, value: 0x1b4 },
              { label: <code>rwx------</code>, value: 0x1c0 },
            ]}
          />
          <p>
            We write bit patterns in hex. Adding or multiplying two permission patterns means nothing, so{" "}
            <Hi c={2}>we never mix arithmetic and bitwise operations</Hi> on the same value.
          </p>
        </>
      ),
    },
    {
      title: "And, or, xor, not",
      minutes: 2,
      body: (
        <>
          <p>
            The <b>bitwise operations</b> work on each bit position separately. A <b>mask</b> is a pattern that picks
            out the bits to work on.
          </p>
          <ul>
            <li>
              <code>&amp;</code> gives 1 where both bits are 1, so it keeps the bits a mask selects.
            </li>
            <li>
              <code>|</code> gives 1 where either bit is 1, so it sets bits.
            </li>
            <li>
              <code>^</code> gives 1 where the bits differ, so it flips bits.
            </li>
            <li>
              <code>~</code> flips every bit, all 32 of them in C0.
            </li>
          </ul>
          <BitOps />
          <Comic panels={[{ who: "honk", outfit: "valentine", size: "xs", pose: "love", say: "Xor twice and it flips back!" }]} />
          <p className="task">
            <code>goose</code> holds <code>rw-r--r--</code>, or <code>0x1A4</code>. Pick the expression for each job.
          </p>
          <Rows
            options={["goose & 0x080", "goose & 0x100", "goose | 0x012", "goose | 0x024", "goose ^ 0x049", "goose & ~0x038"]}
            rows={[
              {
                prompt: "Test whether the owner may write",
                answer: 0,
                why: "It gives 0x080, which is nonzero, so the owner may write.",
              },
              { prompt: "Let the group and others write", answer: 2, why: "It gives 0x1B6, or rw-rw-rw-." },
              { prompt: "Flip all three execute bits", answer: 4, why: "It gives 0x1ED, or rwxr-xr-x." },
              { prompt: "Take away all group permissions", answer: 5, why: "It gives 0x184, or rw----r--." },
            ]}
          />
        </>
      ),
    },
    {
      title: "Left shift",
      minutes: 1.5,
      body: (
        <>
          <p>
            <code>&amp;</code>, <code>|</code>, <code>^</code> and <code>~</code> can&apos;t move bits to new positions,
            but <b>shifts</b> can. <code>x &lt;&lt; k</code> drops the k leftmost bits and fills k zeros on the right.
            Each step left doubles, so{" "}
            <Hi c={2}>
              <code>x &lt;&lt; k</code> is <code>x</code> times 2<sup>k</sup>
            </Hi>
            , mod 2<sup>32</sup>. This is one of the few places where bitwise and arithmetic meet. The value k must
            satisfy <code>0 &lt;= k &amp;&amp; k &lt; 32</code>.
          </p>
          <Shifter
            dir="left"
            presets={[
              { label: "5", value: 5 },
              { label: "0x1A4", value: 0x1a4 },
              { label: "-1", value: -1 },
            ]}
          />
          <Comic
            panels={[
              {
                who: "chonk",
                outfit: "cozy",
                size: "l",
                pose: "point",
                say: "Bit k is the bit worth 2 to the k, counting from the right.",
              },
            ]}
          />
          <p className="task">What does each expression evaluate to?</p>
          <Rows
            options={["48", "256", "-2"]}
            rows={[
              { prompt: <code>3 &lt;&lt; 4</code>, answer: 0, why: "3 × 16 is 48." },
              { prompt: <code>1 &lt;&lt; 8</code>, answer: 1, why: "That's 0x100, the owner's read bit." },
              {
                prompt: <code>int_max() &lt;&lt; 1</code>,
                answer: 2,
                why: "The top 0 falls off and a 0 fills in, giving 111…10.",
              },
            ]}
          />
        </>
      ),
    },
    {
      title: "Right shift",
      minutes: 2,
      body: (
        <>
          <p>
            Left shift doubles, so we want <code>x &gt;&gt; 1</code> to halve, for negative numbers too. Halving −6
            should give −3. So <code>x &gt;&gt; k</code> <Hi c={2}>copies the sign bit into the k new bits</Hi>, the
            same sign extension that keeps a value unchanged in a longer word.
          </p>
          <Comic
            panels={[
              { who: "honk", outfit: "diva", size: "l", pose: "oops", say: "I filled with zeros and −6 became huge!" },
              { who: "chonk", outfit: "party", size: "xs", pose: "point", say: "Copy the sign bit instead." },
            ]}
          />
          <Shifter
            dir="right"
            presets={[
              { label: "-6", value: -6 },
              { label: "0x1A4", value: 0x1a4 },
              { label: "int_min()", value: INT_MIN },
            ]}
          />
          <p>
            When the halving is not exact, <code>&gt;&gt;</code> rounds toward −∞, unlike <code>/</code>.
          </p>
          <p className="task">What does each expression evaluate to?</p>
          <Rows
            options={["-5", "-4", "-1", "3"]}
            rows={[
              { prompt: <code>-10 &gt;&gt; 1</code>, answer: 0, why: "Half of −10 is −5." },
              { prompt: <code>-7 &gt;&gt; 1</code>, answer: 1, why: "−3.5 rounds down to −4, while -7 / 2 is −3." },
              { prompt: <code>-1 &gt;&gt; 5</code>, answer: 2, why: "All ones stay all ones." },
              { prompt: <code>7 &gt;&gt; 1</code>, answer: 3, why: "The sign bit is 0, so zeros fill in." },
            ]}
          />
        </>
      ),
    },
    {
      title: "Taking the top byte",
      minutes: 1.5,
      body: (
        <>
          <p>
            <code>honk_top_byte</code> should return the top 8 bits of an int, as a number from 0 to 255.
          </p>
          <Comic panels={[{ who: "honk", outfit: "irish", size: "m", pose: "think", say: "Will it work for every int?" }]} />
          <Code src={topByte} label="honk_top_byte" />
          <RunTable
            runs={[
              { call: <code>honk_top_byte(0x12345678)</code>, out: "returns 18, which is 0x12", ok: true },
              { call: <code>honk_top_byte(0xF0000000)</code>, out: "returns −16, so the postcondition fails", ok: false },
            ]}
          />
          <Pick
            question="Which return statement fixes it?"
            options={[
              <code key="a">return (goose &amp; 0xFF000000) &gt;&gt; 24;</code>,
              <code key="b">return (goose &gt;&gt; 24) &amp; 0xFF;</code>,
            ]}
            answer={1}
            explain={
              <>
                The first one still copies the sign bit and returns −16. <Hi c={2}>Mask after shifting</Hi> to clear the
                copied bits.
                <Code src={topByteFixed} label="honk_top_byte, fixed" />
                <RunTable
                  runs={[{ call: <code>honk_top_byte(0xF0000000)</code>, out: "returns 240, which is 0xF0", ok: true }]}
                />
              </>
            }
          />
        </>
      ),
    },
    {
      title: "Ints in later lectures",
      minutes: 2,
      body: (
        <>
          <Comic
            panels={[
              { who: "honk", outfit: "rockstar", size: "xl", pose: "cheer", say: "An int is just bits on a circle!" },
              { who: "chonk", outfit: "plain", size: "m", pose: "love", say: "We choose to read them as a number or as bits." },
            ]}
          />
          <p>
            Read as a number, an int stores a single value in binary. C0 has no floats, so all of its arithmetic uses ints. In Lecture 3,{" "}
            <Link href="/lectures#l3">Arrays</Link> hold many values side by side, such as many ints.
          </p>
          <p className="task">
            Compare two ways to find the middle of <code>lo</code> = 1 and <code>hi</code> = <code>int_max()</code>.
          </p>
          <Versions
            label="Two ways to find the middle"
            tabs={[
              {
                label: <code>(lo + hi) / 2</code>,
                body: (
                  <RunTable
                    runs={[{ call: <code>(lo + hi) / 2</code>, out: "is −1073741824, because lo + hi overflows", ok: false }]}
                  />
                ),
              },
              {
                label: <code>lo + (hi - lo) / 2</code>,
                body: <RunTable runs={[{ call: <code>lo + (hi - lo) / 2</code>, out: "is 1073741824", ok: true }]} />,
              },
            ]}
          />
          <ul>
            <li>
              <Link href="/lectures#l6">Binary search</Link> finds the middle the safe way.
            </li>
            <li>
              <Link href="/lectures#l12">Hashing</Link> lets multiplication overflow on purpose to mix bits.
            </li>
            <li>
              <Link href="/lectures#l19">Types in C</Link> shows that signed overflow is undefined in C.
            </li>
            <li>
              <Link href="/lectures#l20">Virtual machines</Link> builds the C0VM, a program that runs C0 code, including
              these int operations.
            </li>
          </ul>
        </>
      ),
    },
  ],
};
