"use client";

import { useRef, useState } from "react";

export type Run = { call: React.ReactNode; out: React.ReactNode; ok?: boolean };

// Precomputed runs: each row reveals its output when the reader presses Run.
export function RunTable({ runs, label = "Run" }: { runs: Run[]; label?: string }) {
  const [shown, setShown] = useState<boolean[]>(() => runs.map(() => false));
  const focusNext = useRef<number | null>(null);

  return (
    <div className="runs">
      {runs.map((r, i) => (
        <div key={i} className="run-row">
          <span className="run-call">{r.call}</span>
          {shown[i] ? (
            <output
              tabIndex={-1}
              ref={(el) => {
                // Keep keyboard users in place, since the Run button they pressed is gone.
                if (el && focusNext.current === i) {
                  focusNext.current = null;
                  el.focus({ preventScroll: true });
                }
              }}
              className={`run-out${r.ok === true ? " good" : r.ok === false ? " bad" : ""}`}>
              {r.ok === true && "✓ "}
              {r.ok === false && "✗ "}
              {r.out}
            </output>
          ) : (
            <button type="button" className="small-btn" onClick={() => {
                focusNext.current = i;
                setShown(shown.map((s, j) => s || j === i));
              }}>
              {label} ▸
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
