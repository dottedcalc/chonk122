import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ResetButton } from "@/components/ResetButton";
import { lectures, parts } from "@/lib/concepts";
import { difficulty, difficultyName } from "@/lib/difficulty";
import { lessonNumbers } from "@/lib/lessons/available";
import { getTier, type Tier } from "@/lib/access";
import {
  getExerciseSummary,
  getLectureAccess,
  getLessonProgress,
  type ExerciseSummary,
  type LectureAccess,
  type LessonProgress,
} from "@/lib/progress";

export const metadata: Metadata = {
  title: "Lectures · chonk122",
  description: "Every 15-122 lecture with its lesson, difficulty and your progress.",
};

export const dynamic = "force-dynamic";

const banner: Record<Tier, React.ReactNode> = {
  audit: (
    <>
      You&apos;re auditing: Lecture 1 is open. <Link href="/login">Sign in</Link> to save your progress and unlock more.
    </>
  ),
  guest: <>Lectures 1 to 3 are open with your account. The rest are for CMU students.</>,
  cmu: <>Every lecture is open to you as it&apos;s released.</>,
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" });

function Status({ n, access, progress }: { n: number; access?: LectureAccess; progress?: LessonProgress }) {
  if (!lessonNumbers.includes(n)) return <p className="lc-status muted">Lesson coming soon</p>;
  if (!access?.lesson) {
    const when = access?.cmuUnlockAt && new Date(access.cmuUnlockAt) > new Date() ? formatDate(access.cmuUnlockAt) : null;
    return <p className="lc-status muted">🔒 {when ? `Opens ${when}` : "Locked"}</p>;
  }
  if (!progress) return <p className="lc-status muted">Not started</p>;
  if (progress.completed) return <p className="lc-status">✓ Lesson done</p>;
  return (
    <div className="lc-status">
      <div className="lc-bar" role="progressbar" aria-label={`Lecture ${n} lesson progress`}
        aria-valuemin={0} aria-valuemax={progress.pageCount} aria-valuenow={progress.pagesRead}>
        <span style={{ width: `${(progress.pagesRead / progress.pageCount) * 100}%` }} />
      </div>
      <span className="muted">
        {progress.pagesRead} of {progress.pageCount} pages
      </span>
    </div>
  );
}

function Exercises({ n, summary }: { n: number; summary?: ExerciseSummary }) {
  if (!summary) return null;
  return (
    <p className="lc-ex">
      <Link href={`/exercises/${n}`}>Exercises</Link>{" "}
      <span className="muted">
        {summary.finished ? "· all done" : `· ${summary.graded} of ${summary.pool} done`}
      </span>
    </p>
  );
}

// The full list of lectures and where the student is in each. The course map stays a short summary.
export default async function LecturesPage() {
  const [tier, access, progress, exercises] = await Promise.all([
    getTier(),
    getLectureAccess(),
    getLessonProgress(),
    getExerciseSummary(),
  ]);

  return (
    <main className="container">
      <SiteHeader />
      <header className="cm-head">
        <h1>Lectures</h1>
        <p className="lede muted">{banner[tier]}</p>
      </header>

      {parts.map((part) => (
        <section key={part.name} className="cm-section">
          <h2 className="section-title">{part.name}</h2>
          <ol className="lc-grid">
            {lectures
              .filter((l) => l.n >= part.from && l.n <= part.to)
              .map((l) => {
                const d = difficulty[l.n];
                const open = lessonNumbers.includes(l.n) && access.get(l.n)?.lesson;
                const p = progress.get(l.n);
                return (
                  <li key={l.n} className={`lc-card cm-box${open ? "" : " lc-closed"}`} style={{ "--d": `var(--d${d})` } as React.CSSProperties}>
                    <p className="lc-num">Lecture {l.n}</p>
                    <h3>{open ? <Link href={`/lessons/${l.n}`}>{l.title}</Link> : l.title}</h3>
                    <p className="lc-diff" aria-label={`Difficulty ${d} of 5, ${difficultyName[d]}`}>
                      <span className="lc-pips" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className={i <= d ? "on" : ""} />
                        ))}
                      </span>
                      {difficultyName[d]}
                    </p>
                    <Status n={l.n} access={access.get(l.n)} progress={p} />
                    <Exercises n={l.n} summary={exercises.get(l.n)} />
                    <div className="lc-resets">
                      {(p || exercises.get(l.n)?.graded) && <ResetButton n={l.n} kind="lecture" />}
                      {exercises.get(l.n)?.graded ? <ResetButton n={l.n} kind="exercises" /> : null}
                    </div>
                  </li>
                );
              })}
          </ol>
        </section>
      ))}
    </main>
  );
}
