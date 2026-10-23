"use client";

import { useState } from "react";
import { num } from "./num";

export type Preset = { label: string; value: number };

const hex = (v: number) => "0x" + (v >>> 0).toString(16).toUpperCase().padStart(8, "0");

// One 32-bit int drawn as bits in groups of four. Bits in `fresh` are the ones a shift just filled in.
function Bits32({ v, fresh = [], label }: { v: number; fresh?: number[]; label: string }) {
  return (
    <div className="b32" role="img" aria-label={`${label}, ${hex(v)}`}>
      {Array.from({ length: 8 }, (_, g) => (
        <span key={g} className="b32-nib">
          {Array.from({ length: 4 }, (_, i) => {
            const b = 31 - (g * 4 + i);
            const one = ((v >>> b) & 1) === 1;
            return (
              <span key={b} className={`b32-bit${one ? " on" : ""}${fresh.includes(b) ? " fresh" : ""}`}>
                {one ? 1 : 0}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}

// Shift a 32-bit int left or right by k. For a right shift the reader can compare copying the sign bit,
// which is what C0 does, with filling in zeros.
export function Shifter({ dir, presets }: { dir: "left" | "right"; presets: Preset[] }) {
  const [p, setP] = useState(0);
  const [k, setK] = useState(1);
  const [copy, setCopy] = useState(true);
  const x = presets[p].value;
  const safe = k >= 0 && k < 32;
  const op = dir === "left" ? "<<" : ">>";

  let r = 0;
  if (safe) r = dir === "left" ? x << k : copy ? x >> k : x >>> k;
  const fresh = Array.from({ length: k }, (_, i) => (dir === "left" ? i : 31 - i));

  return (
    <div className="shifter">
      <div className="ver-tabs" role="group" aria-label="Value to shift">
        {presets.map((pr, i) => (
          <button key={i} type="button" className="opt small" aria-pressed={p === i} onClick={() => setP(i)}>
            {pr.label}
          </button>
        ))}
      </div>
      {dir === "right" && (
        <div className="ver-tabs" role="group" aria-label="New bits on the left">
          <button type="button" className="opt small" aria-pressed={copy} onClick={() => setCopy(true)}>
            Copy the sign bit
          </button>
          <button type="button" className="opt small" aria-pressed={!copy} onClick={() => setCopy(false)}>
            Fill with 0
          </button>
        </div>
      )}
      <label className="sh-k">
        <span>
          k = <b>{k}</b>
        </span>
        <input type="range" min={0} max={32} value={k} onChange={(e) => setK(Number(e.target.value))} />
      </label>
      <Bits32 v={x} label={`x is ${x}`} />
      <p className="sh-out" aria-live="polite">
        <code>x</code> is <b>{num(x)}</b>
      </p>
      {safe ? (
        <>
          <Bits32 v={r | 0} fresh={fresh} label={`x ${op} ${k} is ${r | 0}`} />
          <p className="sh-out" aria-live="polite">
            <code>
              x {op} {k}
            </code>{" "}
            is <b>{num(r | 0)}</b>
            {dir === "right" && !copy && " if we fill with 0, but C0 copies the sign bit"}
          </p>
        </>
      ) : (
        <p className="sh-out bad" aria-live="polite">
          <b>Unsafe.</b> C0 requires <code>0 &lt;= k &amp;&amp; k &lt; 32</code>, so <code>x {op} 32</code> is an error.
        </p>
      )}
    </div>
  );
}
