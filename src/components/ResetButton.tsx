"use client";

import { useState, useTransition } from "react";
import { resetLecture } from "@/app/lectures/actions";

// Asks once before clearing a lecture's progress.
export function ResetButton({ n }: { n: number }) {
  const [asking, setAsking] = useState(false);
  const [pending, start] = useTransition();

  if (!asking) {
    return (
      <button type="button" className="link lc-reset" onClick={() => setAsking(true)}>
        Reset
      </button>
    );
  }
  return (
    <p className="lc-confirm">
      Clear your progress in Lecture {n}?{" "}
      <button type="button" className="small-btn" disabled={pending}
        onClick={() => start(async () => { await resetLecture(n); setAsking(false); })}>
        {pending ? "Clearing…" : "Yes, reset"}
      </button>{" "}
      <button type="button" className="link" onClick={() => setAsking(false)}>
        Cancel
      </button>
    </p>
  );
}
