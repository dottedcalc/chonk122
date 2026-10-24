"use client";

import { useState } from "react";
import { num } from "./num";

// An array with lo and hi handles. It reads out the segment name[lo, hi), from lo included to hi excluded,
// and says when the segment is empty or makes no sense.
export function Segment({ name, cells, lo: lo0 = 1, hi: hi0 = 4 }: { name: string; cells: number[]; lo?: number; hi?: number }) {
  const n = cells.length;
  const [lo, setLo] = useState(lo0);
  const [hi, setHi] = useState(hi0);
  const seg = `${name}[${lo}, ${hi})`;
  let out: React.ReactNode;
  if (lo > hi) out = `${seg} makes no sense, since lo is bigger than hi.`;
  else if (lo === hi) out = `${seg} is empty.`;
  else
    out = `${seg} holds ${cells
      .slice(lo, hi)
      .map((c) => num(c))
      .join(", ")}.`;

  return (
    <div className="ai">
      <div className="ai-cells" aria-hidden="true">
        {cells.map((c, j) => (
          <span key={j} className={`ai-cell${j >= lo && j < hi ? " seg" : ""}`}>
            <span className="mem-i">{j}</span>
            <code>{num(c)}</code>
          </span>
        ))}
      </div>
      <label className="sh-k">
        <span>
          <code>lo</code> = {lo}
        </span>
        <input type="range" aria-label="lo" min={0} max={n} value={lo} onChange={(e) => setLo(Number(e.target.value))} />
      </label>
      <label className="sh-k">
        <span>
          <code>hi</code> = {hi}
        </span>
        <input type="range" aria-label="hi" min={0} max={n} value={hi} onChange={(e) => setHi(Number(e.target.value))} />
      </label>
      <p className={`ai-out${lo > hi ? " bad" : ""}`} aria-live="polite">
        {out}
      </p>
    </div>
  );
}
