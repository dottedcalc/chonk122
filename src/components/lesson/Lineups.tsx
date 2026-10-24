"use client";

import { useState } from "react";

// n! as exact digits, then written short as a power of ten once it is long.
function fact(n: number) {
  let f = BigInt(1);
  for (let k = 2; k <= n; k++) f *= BigInt(k);
  return f.toString();
}

function short(d: string): React.ReactNode {
  if (d.length <= 9) return Number(d).toLocaleString("en-US");
  // Round to two significant figures, which can carry into the next power of ten.
  let m = Math.round(Number(d.slice(0, 3)) / 10) / 10;
  let e = d.length - 1;
  if (m >= 10) {
    m = 1;
    e += 1;
  }
  return (
    <>
      about {m.toFixed(1)} × 10<sup>{e}</sup>
    </>
  );
}

// A slider for how many geese stand in line, with how many lineups there are, n!, against the
// roughly 10^80 atoms in the observable universe.
export function Lineups({ max = 200, start = 4 }: { max?: number; start?: number }) {
  const [n, setN] = useState(start);
  const d = fact(n);
  // 10^80 has 81 digits, so n! has passed it once it has more.
  const past = d.length > 81;

  return (
    <div className="ai">
      <label className="sh-k">
        <span>
          {n} {n === 1 ? "goose" : "geese"}
        </span>
        <input type="range" aria-label="Number of geese" min={1} max={max} value={n} onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <p className={`ai-out${past ? " bad" : ""}`} aria-live="polite">
        {short(d)} {d === "1" ? "lineup" : "lineups"}
        {past ? ", more than the atoms in the observable universe." : "."}
      </p>
    </div>
  );
}
