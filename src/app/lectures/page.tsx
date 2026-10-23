import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ResetButton } from "@/components/ResetButton";
import { LectureArt } from "@/components/LectureArt";
import { lectures, parts } from "@/lib/concepts";
import { difficulty, difficultyName } from "@/lib/difficulty";
import { lessonNumbers } from "@/lib/lessons/available";
import { getTier, type Tier } from "@/lib/access";
import { levelOf } from "@/lib/bigIdeas";
import {
  getExerciseSummary,
  getLectureAccess,
  getLectureScores,
  getLessonProgress,
  type ExerciseSummary,
  type LectureAccess,
  type LectureScore,
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
      You&apos;re auditing, so only Lecture 1 is open. <Link href="/login">Sign in</Link> to save your progress and unlock more.
    </>
  ),
  guest: <>Lectures 1 to 3 are open with your account. The rest are for CMU students.</>,
  cmu: <>Every lecture is open to you as it&apos;s released.</>,
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" });

function Status({ n, access, progress }: { n: number; access?: LectureAccess; progress?: LessonProgress }) {
  if (!lessonNumbers.includes(n)) return null;
  if (!access?.lesson) {
    const when = access?.cmuUnlockAt && new Date(access.cmuUnlockAt) > new Date() ? formatDate(access.cmuUnlockAt) : null;
    return when ? <p className="lc-status">Opens {when}</p> : null;
  }
  if (!progress) return <p className="lc-status">Not started</p>;
  if (progress.completed) return <p className="lc-status">✓ Lesson done</p>;
  return (
    <p className="lc-status">
      <b>{progress.pagesRead}</b> of <b>{progress.pageCount}</b> pages
    </p>
  );
}

// The lecture's proficiency score from 0 to 100, as on the progress page.
function Proficiency({ n, score }: { n: number; score?: LectureScore }) {
  if (!score) return null;
  return (
    <div className="lc-prof">
      <p>
        Proficiency <b>{score.score}</b>
        <span className="level">{levelOf(score.score)}</span>
      </p>
      <div className="pg-bar" role="meter" aria-label={`Lecture ${n} proficiency`}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={score.score}>
        <span style={{ width: `${score.score}%` }} />
      </div>
    </div>
  );
}

// Big buttons into the lesson and its exercises.
function Actions({ n, open, progress, summary }: { n: number; open: boolean; progress?: LessonProgress; summary?: ExerciseSummary }) {
  if (!open && !summary) return null;
  const lesson = !progress ? "Start lesson" : progress.completed ? "Review lesson" : "Continue lesson";
  return (
    <div className="lc-actions">
      {open && (
        <Link href={`/lessons/${n}`} className="button small">
          {lesson} →
        </Link>
      )}
      {summary && (
        <Link href={`/exercises/${n}`} className="button small lc-ex-btn">
          Exercises{" "}
          <span className="lc-ex-count">{summary.finished ? "· all done" : `· ${summary.graded}/${summary.pool}`}</span>
        </Link>
      )}
    </div>
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
  const scores = await getLectureScores((n) => ({
    lesson: lessonNumbers.includes(n) && Boolean(access.get(n)?.lesson),
    pool: exercises.get(n)?.pool ?? 0,
  }));

  return (
    <main className="container">
      <SiteHeader />
      <header className="cm-head">
        <h1>Lectures</h1>
        <p className="lede">
          {banner[tier]} {tier !== "audit" && <Link href="/progress">See your progress →</Link>}
        </p>
      </header>

      {parts.map((part) => (
        <section key={part.name} className="cm-section">
          <h2 className="section-title">{part.name}</h2>
          <ol className="lc-grid">
            {lectures
              .filter((l) => l.n >= part.from && l.n <= part.to)
              .map((l) => {
                const d = difficulty[l.n];
                const open = lessonNumbers.includes(l.n) && Boolean(access.get(l.n)?.lesson);
                const p = progress.get(l.n);
                // Gray and locked until it has a lesson or exercises the student can open.
                const closed = !open && !exercises.get(l.n);
                return (
                  <li key={l.n} className={`lc-card cm-box${closed ? " lc-closed" : ""}`} style={{ "--d": `var(--d${d})` } as React.CSSProperties}>
                    <LectureArt n={l.n} locked={closed} />
                    <div className="lc-body">
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
                    <Proficiency n={l.n} score={scores.get(l.n)} />
                    <Actions n={l.n} open={open} progress={p} summary={exercises.get(l.n)} />
                    <div className="lc-resets">
                      {(p || exercises.get(l.n)?.graded) && <ResetButton n={l.n} kind="lecture" />}
                      {exercises.get(l.n)?.graded ? <ResetButton n={l.n} kind="exercises" /> : null}
                    </div>
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
