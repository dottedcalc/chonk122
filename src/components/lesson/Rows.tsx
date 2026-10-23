"use client";

import { Fragment, useState } from "react";

export type Row = {
  prompt: React.ReactNode;
  answer: number;
  why?: React.ReactNode;
  // Starts a new labelled group of rows, such as the steps for one loop invariant.
  group?: string;
};

// A run of small choices that share one set of options: blame a caller, sort a fact, justify a proof step.
// A wrong pick can be retried, and the reason appears once the row is right.
export function Rows({ options, rows, numbered = false }: { options: string[]; rows: Row[]; numbered?: boolean }) {
  const [picks, setPicks] = useState<(number | null)[]>(() => rows.map(() => null));
  const done = rows.filter((r, i) => picks[i] === r.answer).length;

  return (
    <div className="rows">
      {rows.map((r, i) => {
        const p = picks[i];
        const right = p === r.answer;
        return (
          <Fragment key={i}>
            {r.group && <p className="rows-group">{r.group}</p>}
            <div className={`row${right ? " right" : ""}`}>
              <div className="row-prompt">
                {numbered && <span className="row-n">{i + 1}.</span>}
                {r.prompt}
              </div>
              <div className="row-opts" role="group" aria-label={`Choices for row ${i + 1}`}>
                {options.map((o, j) => (
                  <button
                    key={j}
                    type="button"
                    className={`opt small${p === j ? (right ? " right" : " wrong") : ""}`}
                    aria-pressed={p === j}
                    disabled={right}
                    onClick={() => setPicks(picks.map((x, k) => (k === i ? j : x)))}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <div className="row-why" aria-live="polite">
                {right ? r.why && <span>✓ {r.why}</span> : p !== null && <span>✗ Not quite. Try another.</span>}
              </div>
            </div>
          </Fragment>
        );
      })}
      <p className="rows-done muted">
        {done} of {rows.length} done{done === rows.length ? ". Nice!" : ""}
      </p>
    </div>
  );
}
