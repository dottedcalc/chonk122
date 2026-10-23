"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  gradeAttempt,
  resetExercises,
  revealAnswer,
  startRound,
  type Grade,
  type Round,
} from "@/app/exercises/actions";

const grades: { g: Grade; label: string }[] = [
  { g: "got", label: "Got it" },
  { g: "partly", label: "Partly" },
  { g: "missed", label: "Missed it" },
];

const points: Record<Grade, number> = { got: 1, partly: 0.5, missed: 0 };

// One round of up to four questions, shown one at a time: question, reveal, self-grade.
export function ExercisePlayer({ n }: { n: number }) {
  const [round, setRound] = useState<Round | null>(null);
  const [k, setK] = useState(0);
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();

  const load = useCallback(() => {
    start(async () => {
      const r = await startRound(n);
      setFailed(!r);
      setRound(r);
      const next = r?.items.findIndex((i) => !i.grade) ?? -1;
      setK(next < 0 ? 0 : next);
    });
  }, [n]);

  useEffect(load, [load]);

  if (failed) {
    return (
      <div className="cm-box ex-card">
        <p>Chonk couldn&apos;t fetch your questions. Check your connection and try again.</p>
        <button type="button" onClick={load} disabled={pending}>
          Try again
        </button>
      </div>
    );
  }
  if (!round) return <div className="cm-box ex-card">Loading questions…</div>;

  if (round.items.length === 0) {
    if (round.round === 0) return <div className="cm-box ex-card">No exercises for this lecture yet. Check back soon!</div>;
    return <Finished n={n} onReset={load} />;
  }

  const item = round.items[k];
  const done = round.items.every((i) => i.grade);
  const score = round.items.reduce((s, i) => s + (i.grade ? points[i.grade] : 0), 0);

  function reveal() {
    start(async () => {
      const url = await revealAnswer(item.id);
      if (!url) return setFailed(true);
      setRound((r) => r && { ...r, items: r.items.map((i) => (i.id === item.id ? { ...i, answer: url } : i)) });
    });
  }

  function grade(g: Grade) {
    start(async () => {
      if (!(await gradeAttempt(item.id, g))) return setFailed(true);
      const items = round!.items.map((i) => (i.id === item.id ? { ...i, grade: g } : i));
      setRound({ ...round!, items });
      const next = items.findIndex((i) => !i.grade);
      if (next >= 0) setK(next);
    });
  }

  return (
    <div className="ex">
      <div className="ex-steps" role="tablist" aria-label={`Round ${round.round} questions`}>
        {round.items.map((i, j) => (
          <button
            key={i.id}
            type="button"
            role="tab"
            aria-selected={j === k}
            className={`ex-step${i.grade ? ` ${i.grade}` : ""}`}
            onClick={() => setK(j)}
          >
            {j + 1}
          </button>
        ))}
        <span className="muted ex-round">Round {round.round}</span>
      </div>

      <article className="cm-box ex-card" key={item.id}>
        <h2>Question {k + 1}</h2>
        {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links, not static assets */}
        <img className="ex-img" src={item.question} alt={item.alt || `Question ${k + 1}`} />

        {item.answer === null ? (
          <button type="button" onClick={reveal} disabled={pending}>
            {pending ? "Revealing…" : "Reveal answer"}
          </button>
        ) : (
          <>
            <h3>Answer</h3>
            {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links, not static assets */}
            <img className="ex-img" src={item.answer} alt={`Answer to question ${k + 1}`} />
            <p className="ex-ask">{item.grade ? "Your grade" : "How did you do?"}</p>
            <div className="ex-grades">
              {grades.map(({ g, label }) => (
                <button
                  key={g}
                  type="button"
                  className={`opt ex-grade ${g}`}
                  aria-pressed={item.grade === g}
                  disabled={pending || item.grade !== null}
                  onClick={() => grade(g)}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </article>

      {done && (
        <div className="cm-box ex-card ex-done">
          <p>
            Round {round.round} done! You got <b>{score}</b> out of {round.items.length}.
          </p>
          <button type="button" onClick={load} disabled={pending}>
            {pending ? "Loading…" : "Next round →"}
          </button>
        </div>
      )}
    </div>
  );
}

function Finished({ n, onReset }: { n: number; onReset: () => void }) {
  const [asking, setAsking] = useState(false);
  const [pending, start] = useTransition();
  return (
    <div className="cm-box ex-card ex-done">
      <p>
        <b>You&apos;ve done every question for this lecture.</b> Nice work!
      </p>
      {asking ? (
        <p>
          Clear your answers and start the pool again?{" "}
          <button type="button" className="small-btn" disabled={pending}
            onClick={() => start(async () => { await resetExercises(n); onReset(); })}>
            {pending ? "Clearing…" : "Yes, reset"}
          </button>{" "}
          <button type="button" className="link" onClick={() => setAsking(false)}>
            Cancel
          </button>
        </p>
      ) : (
        <button type="button" className="link" onClick={() => setAsking(true)}>
          Reset exercises
        </button>
      )}
    </div>
  );
}
