"use client";

import { useState } from "react";
import { num } from "./num";

// An array with an index the reader slides along. With min below 0 or max past the end,
// it shows the error coin gives for an access out of bounds.
export function ArrayIndex({
  name,
  type = "int",
  cells,
  min = 0,
  max,
  start = 0,
}: {
  name: string;
  type?: string;
  cells: (number | string)[];
  min?: number;
  max?: number;
  start?: number;
}) {
  const n = cells.length;
  const hi = max ?? n - 1;
  const [i, setI] = useState(start);
  const inside = i >= 0 && i < n;
  const out = inside
    ? `${cells[i]} (${type})`
    : i < 0
      ? `Error: accessing negative element in ${n}-element array`
      : `Error: accessing element ${i} in ${n}-element array`;

  return (
    <div className="ai">
      <div className="ai-cells" aria-hidden="true">
        {Array.from({ length: hi - min + 1 }, (_, k) => k + min).map((j) => {
          const real = j >= 0 && j < n;
          return (
            <span key={j} className={`ai-cell${real ? "" : " off"}${j === i ? " at" : ""}`}>
              <span className="mem-i">{num(j)}</span>
              <code>{real ? cells[j] : ""}</code>
            </span>
          );
        })}
      </div>
      <label className="sh-k">
        <span>
          <code>i</code> = {num(i)}
        </span>
        <input type="range" aria-label="Index i" min={min} max={hi} value={i} onChange={(e) => setI(Number(e.target.value))} />
      </label>
      <p className={`ai-out${inside ? "" : " bad"}`} aria-live="polite">
        <code>
          --&gt; {name}[{i}];
        </code>
        <br />
        <code>{out}</code>
      </p>
    </div>
  );
}
