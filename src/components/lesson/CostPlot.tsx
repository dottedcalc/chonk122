"use client";

import { useState } from "react";
import { costs, steps } from "./grow";

const W = 320;
const H = 200;
const P = 28;

function path(f: (n: number) => number, max: number, top: number) {
  const pts: string[] = [];
  for (let k = 0; k <= 80; k++) {
    const n = (max * k) / 80;
    const y = Math.min(f(n), top * 1.05);
    pts.push(`${(P + (n / max) * (W - P - 6)).toFixed(1)},${(H - P - (y / top) * (H - P - 8)).toFixed(1)}`);
  }
  return `M${pts.join("L")}`;
}

function Axes({ max, label }: { max: number; label: string }) {
  return (
    <>
      <path className="plot-axis" d={`M${P},8 V${H - P} H${W - 4}`} />
      <text className="plot-t" x={W - 6} y={H - 8} textAnchor="end">
        {label} = {max}
      </text>
      <text className="plot-t" x={P - 4} y={H - 8} textAnchor="end">
        0
      </text>
    </>
  );
}

// Two cost functions on one graph, with a slider for how far along n to look, and a toggle that runs
// the second one on a machine that is ten times faster.
export function Crossover({ f, g, fName, gName, max = 400 }: { f: string; g: string; fName: string; gName: string; max?: number }) {
  const [m, setM] = useState(20);
  const [fast, setFast] = useState(false);
  const F = costs[f];
  const G0 = costs[g];
  const G = (n: number) => (fast ? G0(n) / 10 : G0(n));
  const top = Math.max(F(m), G(m), 1);
  const better = F(m) <= G(m) ? fName : gName;

  return (
    <div className="plot">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Steps for ${fName} and ${gName} from n = 0 to ${m}`}>
        <Axes max={m} label="n" />
        <path className="plot-line c1" d={path(F, m, top)} />
        <path className="plot-line c2" d={path(G, m, top)} />
      </svg>
      <ul className="plot-key">
        <li className="c1">
          {fName}, <code>{f}</code> steps
        </li>
        <li className="c2">
          {gName}, <code>{g}</code> steps{fast ? " on a machine ten times faster" : ""}
        </li>
      </ul>
      <label className="sh-k">
        <span>
          up to <code>n</code> = {m}
        </span>
        <input type="range" aria-label="Largest n shown" min={5} max={max} value={m} onChange={(e) => setM(Number(e.target.value))} />
      </label>
      <label className="plot-toggle">
        <input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} /> Run {gName} on a machine ten
        times faster
      </label>
      <p className="ai-out" aria-live="polite">
        At n = {m}, {fName} takes {steps(F(m))} steps and {gName} takes {steps(Math.round(G(m)))}, so {better} wins.
      </p>
    </div>
  );
}

// The Big-O definition to play with. Sliders for c and n0 show f and c·g, shade the region n ≥ n0,
// and say whether f(n) ≤ c·g(n) holds there, naming the first n where it fails.
export function BigODef({ f, g, max = 40 }: { f: string; g: string; max?: number }) {
  const [c, setC] = useState(2);
  const [n0, setN0] = useState(0);
  const F = costs[f];
  const G = (n: number) => c * costs[g](n);
  // Check far past the graph, so a bound that fails only for large n is caught.
  let fail = -1;
  for (let n = n0; n <= 100000; n++) {
    if (F(n) > G(n) + 1e-9) {
      fail = n;
      break;
    }
  }
  const top = Math.max(F(max), G(max), 1);
  const x0 = P + (Math.min(n0, max) / max) * (W - P - 6);
  const gText = g === "n" ? `${c}n` : `${c} × ${g}`;

  return (
    <div className="plot">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${f} and ${gText} from n = 0 to ${max}, with n0 = ${n0}`}>
        <rect className="plot-zone" x={x0} y={8} width={Math.max(0, W - 6 - x0)} height={H - P - 8} />
        <Axes max={max} label="n" />
        <path className="plot-line c1" d={path(F, max, top)} />
        <path className="plot-line c2" d={path(G, max, top)} />
      </svg>
      <ul className="plot-key">
        <li className="c1">
          f(n) = <code>{f}</code>
        </li>
        <li className="c2">
          c · g(n) = <code>{gText}</code>
        </li>
      </ul>
      <label className="sh-k">
        <span>
          <code>c</code> = {c}
        </span>
        <input type="range" aria-label="c" min={0.5} max={10} step={0.5} value={c} onChange={(e) => setC(Number(e.target.value))} />
      </label>
      <label className="sh-k">
        <span>
          <code>n₀</code> = {n0}
        </span>
        <input type="range" aria-label="n0" min={0} max={30} value={n0} onChange={(e) => setN0(Number(e.target.value))} />
      </label>
      <p className={`ai-out${fail === -1 ? " good" : " bad"}`} aria-live="polite">
        {fail === -1 ? (
          <>
            ✓ f(n) ≤ {gText} for every n ≥ {n0}, so these c and n₀ work.
          </>
        ) : (
          <>
            ✗ At n = {fail}, f(n) is {steps(F(fail))} but {gText} is {steps(G(fail))}.
          </>
        )}
      </p>
    </div>
  );
}
