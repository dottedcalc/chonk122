"use client";

import { useState } from "react";
import { num } from "./num";

// A row of face down slots. The reader turns them over one at a time to find each target in turn,
// and the count of looks shows how much work a search by hand takes, found or not.
export function LookFor({ name, cells, targets }: { name: string; cells: number[]; targets: number[] }) {
  const [r, setR] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(() => cells.map(() => false));
  const t = targets[r];
  const looks = seen.filter(Boolean).length;
  const at = cells.findIndex((c, i) => seen[i] && c === t);
  const done = at !== -1 || looks === cells.length;
  const last = r === targets.length - 1;

  let status = `Find the goose with ID ${num(t)}.`;
  if (at !== -1) status = `Found ID ${num(t)} at index ${at} after ${looks} ${looks === 1 ? "look" : "looks"}.`;
  else if (done) status = `You looked at all ${cells.length} slots, so ID ${num(t)} isn't in ${name}.`;

  return (
    <div className="lf">
      <div className="lf-cells" role="group" aria-label={`Slots of ${name}`}>
        {cells.map((c, i) => (
          <button
            key={i}
            type="button"
            className={`ai-cell lf-cell${seen[i] ? " open" : ""}${i === at ? " at" : ""}`}
            aria-label={seen[i] ? `Index ${i} holds ${num(c)}` : `Look at index ${i}`}
            aria-disabled={seen[i] || done}
            onClick={() => !seen[i] && !done && setSeen(seen.map((s, j) => s || j === i))}
          >
            <span className="mem-i">{i}</span>
            <code>{seen[i] ? num(c) : "?"}</code>
          </button>
        ))}
      </div>
      <p className="lf-status" aria-live="polite">
        {status}
      </p>
      <div className="lf-next">
        {done && !last && (
          <button
            type="button"
            className="small-btn"
            onClick={() => {
              setR(r + 1);
              setSeen(cells.map(() => false));
            }}
          >
            Next ID ▸
          </button>
        )}
      </div>
    </div>
  );
}
