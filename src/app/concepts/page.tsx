import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ConceptMap } from "@/components/ConceptMap";
import { Ring } from "@/components/Ring";
import { bigIdeas, lecturesFor, levelOf } from "@/lib/bigIdeas";
import { lectures } from "@/lib/concepts";
import { lessonNumbers } from "@/lib/lessons/available";
import { getTier } from "@/lib/access";
import { getExerciseSummary, getLectureAccess, getLectureScores, type LectureScore } from "@/lib/progress";

export const metadata: Metadata = {
  title: "Five things you need to know to Ace CS122 · chonk122",
  description: "The five big ideas of 15-122, what you need to know for each, and your progress on them.",
};

export const dynamic = "force-dynamic";

const pct = (x: number) => `${Math.round(100 * x)}%`;

// The course map and, for signed-in students, their proficiency in each big idea and lecture.
export default async function ConceptsPage() {
  const tier = await getTier();
  let scores: Map<number, LectureScore> | null = null;
  if (tier !== "audit") {
    const [access, pools] = await Promise.all([getLectureAccess(), getExerciseSummary()]);
    scores = await getLectureScores((n) => ({
      lesson: lessonNumbers.includes(n) && Boolean(access.get(n)?.lesson),
      pool: pools.get(n)?.pool ?? 0,
    }));
  }

  // A big idea averages the open lectures that teach it.
  const ideaScores = scores
    ? Object.fromEntries(
        bigIdeas.map((b) => {
          const open = lecturesFor(b).filter((n) => scores.has(n));
          const score = open.length
            ? Math.round(open.reduce((s, n) => s + scores.get(n)!.score, 0) / open.length)
            : null;
          return [b.id, score];
        }),
      )
    : null;

  return (
    <main className="container">
      <SiteHeader />
      <header className="cm-head">
        <h1>
          Five things you need to know to Ace <span className="nowrap">CS122</span>
        </h1>
      </header>
      <ConceptMap scores={ideaScores} />

      <section className="cm-section" id="progress">
        <h2 className="section-title">Your progress</h2>
        {!scores ? (
          <p>
            <Link href="/login">Sign in</Link> to save your lessons and exercises and see how you&apos;re doing in each big
            idea.
          </p>
        ) : (
          <>
            <p>
              Each lecture scores 0 to 100. Reading its lesson counts for a quarter and its exercises for three quarters,
              with harder and newer questions worth more. A big idea averages the open lectures that teach it.
            </p>
            {scores.size === 0 ? (
              <p>Open a lesson to get started.</p>
            ) : (
              <ul className="pg-lectures">
                {[...scores].map(([n, s]) => (
                  <li key={n} className="cm-box pg-lec">
                    <Ring score={s.score} label={`Lecture ${n}, ${s.score} of 100`} size={56} />
                    <div>
                      <b>
                        L{n} {lectures[n - 1].title}
                      </b>
                      <p>
                        {levelOf(s.score)} · lesson {s.lesson === null ? "not started" : pct(s.lesson)} · exercises{" "}
                        {s.exercises === null ? "not started" : pct(s.exercises)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </main>
  );
}
