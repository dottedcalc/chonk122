"use client";

import { useId, useState } from "react";
import { num } from "./num";

const bits = (p: number) => p.toString(2).padStart(4, "0");

export type Cut = { label: string; low: number };

// The 16 bit patterns of a 4-bit computer around a circle, with 0000 at the top.
// Adding 1 steps clockwise. Each cut chooses the lowest number, which fixes what every pattern means.
export function Wheel({
  start = 0,
  goal,
  cuts = [{ label: "0 to 15", low: 0 }],
}: {
  start?: number;
  // A sum to step out, such as 12 + 9, shown as a count of steps taken.
  goal?: { from: number; by: number };
  cuts?: Cut[];
}) {
  const head = `wheel-head-${useId().replace(/:/g, "")}`;
  const [at, setAt] = useState(goal ? goal.from : start);
  const [moved, setMoved] = useState(0);
  const [c, setC] = useState(0);
  const low = cuts[c].low;
  const read = (p: number) => ((((p - low) % 16) + 16) % 16) + low;

  const R = 112;
  const pos = (p: number, r: number) => {
    const a = ((p * 22.5 - 90) * Math.PI) / 180;
    return [150 + r * Math.cos(a), 150 + r * Math.sin(a)];
  };
  // The cut sits between the pattern for low - 1 and the pattern for low.
  const cutAt = (((low % 16) + 16) % 16) - 0.5;
  const [c1x, c1y] = pos(cutAt, 70);
  const [c2x, c2y] = pos(cutAt, 146);

  const step = (d: number) => {
    setAt((at + d + 16) % 16);
    setMoved(moved + d);
  };

  return (
    <div className="wheel">
      {cuts.length > 1 && (
        <div className="ver-tabs" role="group" aria-label="Where to cut the circle">
          {cuts.map((ct, i) => (
            <button key={i} type="button" className="opt small" aria-pressed={c === i} onClick={() => setC(i)}>
              {ct.label}
            </button>
          ))}
        </div>
      )}
      <div className="wheel-body">
        <svg viewBox="0 0 300 300" className="wheel-svg" role="img" aria-label={`Circle of 4-bit patterns. The marker is on ${bits(at)}, read as ${num(read(at))}.`}>
          <circle cx="150" cy="150" r={R} className="wheel-ring" />
          {Array.from({ length: 16 }, (_, p) => {
            const [x, y] = pos(p, R);
            const [tx, ty] = pos(p, R - 40);
            const v = read(p);
            return (
              <g key={p} className={`wheel-spot${p === at ? " at" : ""}${v < 0 ? " neg" : ""}`}>
                <circle cx={x} cy={y} r="19" />
                <text x={x} y={y + 1} className="wheel-val">
                  {num(v)}
                </text>
                <text x={tx} y={ty + 1} className="wheel-bits">
                  {bits(p)}
                </text>
              </g>
            );
          })}
          <line x1={c1x} y1={c1y} x2={c2x} y2={c2y} className="wheel-cut" />
          <path d="M150 64 a 86 86 0 0 1 60 25" className="wheel-arrow" markerEnd={`url(#${head})`} />
          <defs>
            <marker id={head} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" className="wheel-head" />
            </marker>
          </defs>
          <text x="150" y="146" className="wheel-mid">
            {bits(at)}
          </text>
          <text x="150" y="172" className="wheel-mid big">
            {num(read(at))}
          </text>
        </svg>
        <div className="wheel-side">
          <div className="step-ctrl">
            <button type="button" className="small-btn" onClick={() => step(-1)} disabled={!!goal && moved === 0}>
              − 1
            </button>
            <button type="button" className="small-btn" onClick={() => step(1)} disabled={!!goal && moved === goal.by}>
              + 1
            </button>
            <button
              type="button"
              className="small-btn"
              onClick={() => {
                setAt(goal ? goal.from : start);
                setMoved(0);
              }}
            >
              Reset
            </button>
          </div>
          <p aria-live="polite">
            {goal ? (
              moved === goal.by ? (
                <b>
                  {goal.from} + {goal.by} lands on {read(at)}, because {goal.from + goal.by} mod 16 is{" "}
                  {(goal.from + goal.by) % 16}.
                </b>
              ) : (
                <>
                  Steps taken {moved} of {goal.by}
                </>
              )
            ) : (
              <>
                The marker is on <code>{bits(at)}</code>, read as <b>{num(read(at))}</b>, after {Math.abs(moved)} {Math.abs(moved) === 1 ? "step" : "steps"}
                {moved < 0 ? " back" : ""}.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
