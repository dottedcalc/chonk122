import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { bigIdeas, lecturesFor, levelOf } from "@/lib/bigIdeas";
import { lectures } from "@/lib/concepts";
import { lessonNumbers } from "@/lib/lessons/available";
import { getTier } from "@/lib/access";
import { getExerciseSummary, getLectureAccess, getLectureScores } from "@/lib/progress";

export const metadata: Metadata = {
  title: "Your progress · chonk122",
  description: "How far you've got with the five big ideas of 15-122.",
};

export const dynamic = "force-dynamic";

const pct = (x: number) => `${Math.round(100 * x)}%`;

function Bar({ score, label }: { score: number; label: string }) {
  return (
    <div className="pg-bar" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>
      <span style={{ width: `${score}%` }} />
    </div>
  );
}

// Proficiency per big idea, then per lecture. Signed-in students only.
export default async function ProgressPage() {
  const tier = await getTier();
  if (tier === "audit") {
    return (
      <main className="container">
        <SiteHeader />
        <header className="cm-head">
          <h1>Your progress</h1>
          <p className="lede">
            <Link href="/login">Sign in</Link> to save your lessons and exercises and see how you&apos;re doing across the
            five big ideas.
          </p>
        </header>
      </main>
    );
  }

  const [access, pools] = await Promise.all([getLectureAccess(), getExerciseSummary()]);
  const scores = await getLectureScores((n) => ({
    lesson: lessonNumbers.includes(n) && Boolean(access.get(n)?.lesson),
    pool: pools.get(n)?.pool ?? 0,
  }));

  return (
    <main className="container">
      <SiteHeader />
      <header className="cm-head">
        <h1>Your progress</h1>
        <p className="lede">
          Each lecture scores 0 to 100. Reading its lesson counts for a quarter and its exercises for three quarters,
          with harder and newer questions worth more. A big idea averages the open lectures that teach it.
        </p>
      </header>

      <section className="cm-section">
        <h2 className="section-title">Five big ideas</h2>
        <ul className="pg-ideas">
          {bigIdeas.map((b) => {
            const open = lecturesFor(b).filter((n) => scores.has(n));
            const score = open.length
              ? Math.round(open.reduce((s, n) => s + scores.get(n)!.score, 0) / open.length)
              : null;
            return (
              <li key={b.id} className="cm-box pg-idea">
                <div className="pg-idea-head">
                  <h3>{b.name}</h3>
                  {score !== null && (
                    <p className="pg-score">
                      <b>{score}</b> <span className="level">{levelOf(score)}</span>
                    </p>
                  )}
                </div>
                <p className="pg-blurb">{b.blurb}</p>
                {score === null ? (
                  <p>No open lectures teach this yet.</p>
                ) : (
                  <Bar score={score} label={`${b.name}, ${score} of 100`} />
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="cm-section">
        <h2 className="section-title">By lecture</h2>
        {scores.size === 0 ? (
          <p>Open a lesson to get started.</p>
        ) : (
          <table className="pg-table">
            <thead>
              <tr>
                <th scope="col">Lecture</th>
                <th scope="col">Lesson</th>
                <th scope="col">Exercises</th>
                <th scope="col">Score</th>
              </tr>
            </thead>
            <tbody>
              {[...scores].map(([n, s]) => (
                <tr key={n}>
                  <th scope="row">
                    L{n} {lectures[n - 1].title}
                  </th>
                  <td>{s.lesson === null ? <span className="muted">none yet</span> : pct(s.lesson)}</td>
                  <td>{s.exercises === null ? <span className="muted">none yet</span> : pct(s.exercises)}</td>
                  <td className="pg-cell">
                    <Bar score={s.score} label={`Lecture ${n}, ${s.score} of 100`} />
                    <b>{s.score}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p className="more">
        <Link href="/lectures" className="button small">
          Back to lectures →
        </Link>
      </p>
    </main>
  );
}
