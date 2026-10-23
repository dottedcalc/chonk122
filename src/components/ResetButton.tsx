"use client";

import { useState, useTransition } from "react";
import { resetLecture } from "@/app/lectures/actions";
import { resetExercises } from "@/app/exercises/actions";

const kinds = {
  lecture: { label: "Reset lecture", ask: "Clear your lesson progress and exercises in Lecture", run: resetLecture },
  exercises: { label: "Reset exercises", ask: "Clear your exercise answers in Lecture", run: resetExercises },
};

// Asks once before clearing a lecture's progress or just its exercises.
export function ResetButton({ n, kind }: { n: number; kind: keyof typeof kinds }) {
  const [asking, setAsking] = useState(false);
  const [pending, start] = useTransition();
  const { label, ask, run } = kinds[kind];

  if (!asking) {
    return (
      <button type="button" className="link lc-reset" onClick={() => setAsking(true)}>
        {label}
      </button>
    );
  }
  return (
    <p className="lc-confirm">
      {ask} {n}?{" "}
      <button type="button" className="small-btn" disabled={pending}
        onClick={() => start(async () => { await run(n); setAsking(false); })}>
        {pending ? "Clearing…" : "Yes, reset"}
      </button>{" "}
      <button type="button" className="link" onClick={() => setAsking(false)}>
        Cancel
      </button>
    </p>
  );
}
