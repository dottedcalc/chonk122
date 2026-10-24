"use client";

import { useEffect, useRef, useState } from "react";
import { costs, steps } from "./grow";

const classes = ["1", "log n", "n", "n log n", "n²", "2ⁿ", "n!"];
const names = ["Constant", "Logarithmic", "Linear", "n log n", "Quadratic", "Exponential", "Factorial"];

// How many steps each complexity class takes as n grows, as bars on one scale.
// Play runs n up to the top, and a bar that leaves the chart says so.
export function Race({ max = 64 }: { max?: number }) {
  const [n, setN] = useState(4);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const cap = max * max;

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(max);
      setPlaying(false);
      return;
    }
    timer.current = window.setInterval(() => {
      setN((m) => {
        if (m >= max) {
          setPlaying(false);
          return m;
        }
        return m + 1;
      });
    }, 90);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [playing, max]);

  return (
    <div className="race">
      <div className="race-ctrl">
        <label className="sh-k">
          <span>
            <code>n</code> = {n}
          </span>
          <input
            type="range"
            aria-label="n"
            min={1}
            max={max}
            value={n}
            onChange={(e) => {
              setPlaying(false);
              setN(Number(e.target.value));
            }}
          />
        </label>
        <button
          type="button"
          className="small-btn"
          onClick={() => {
            if (playing) setPlaying(false);
            else {
              if (n >= max) setN(1);
              setPlaying(true);
            }
          }}
        >
          {playing ? "Pause ▮▮" : "Play ▸"}
        </button>
      </div>
      <table className="race-table">
        <tbody>
          {classes.map((c, i) => {
            const v = costs[c](n);
            const over = v > cap;
            return (
              <tr key={c}>
                <th scope="row">
                  O({c})
                  <span className="race-name">{names[i]}</span>
                </th>
                <td className="race-bar-cell">
                  <span className={`race-bar c${(i % 3) + 1}${over ? " over" : ""}`} style={{ width: `${Math.max(1, Math.min(1, v / cap) * 100)}%` }} />
                </td>
                <td className="race-v">
                  {steps(v)}
                  {over ? " ▸ off the chart" : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
