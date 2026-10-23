"use client";

import { useState } from "react";

export type Run = { call: React.ReactNode; out: React.ReactNode; ok?: boolean };

// Precomputed runs: each row reveals its output when the reader presses Run.
export function RunTable({ runs, label = "Run" }: { runs: Run[]; label?: string }) {
  const [shown, setShown] = useState<boolean[]>(() => runs.map(() => false));

  return (
    <div className="runs">
      {runs.map((r, i) => (
        <div key={i} className="run-row">
          <span className="run-call">{r.call}</span>
          {shown[i] ? (
            <output className={`run-out${r.ok === true ? " good" : r.ok === false ? " bad" : ""}`}>
              {r.ok === true && "✓ "}
              {r.ok === false && "✗ "}
              {r.out}
            </output>
          ) : (
            <button type="button" className="small-btn" onClick={() => setShown(shown.map((s, j) => s || j === i))}>
              {label} ▸
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
