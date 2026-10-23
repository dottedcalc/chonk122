"use client";

import { useState } from "react";
import { num } from "./num";

const DIGITS = "0123456789ABCDEF";
const baseName: Record<number, string> = { 2: "Binary", 10: "Decimal", 16: "Hex" };

// A goal for the reader. With base set, it counts only when written in that base.
export type Target = { label: React.ReactNode; value: number; base?: number };

// A number written with place value. Each digit is a button that counts up in the chosen base.
// With signed, the leftmost bit weighs minus its usual weight, as in two's complement.
export function Digits({
  bases = [2],
  width = 4,
  signed = false,
  hex = false,
  targets = [],
  start = 0,
}: {
  bases?: number[];
  width?: number;
  signed?: boolean;
  hex?: boolean;
  targets?: Target[];
  start?: number;
}) {
  const [base, setBase] = useState(bases[0]);
  const [ds, setDs] = useState<number[]>(() => toDigits(start, bases[0], width));
  const [hit, setHit] = useState<boolean[]>(() => targets.map(() => false));

  const weight = (i: number) => {
    const w = base ** (width - 1 - i);
    return signed && i === 0 ? -w : w;
  };
  const value = ds.reduce((sum, d, i) => sum + d * weight(i), 0);
  const unsigned = ds.reduce((sum, d) => sum * base + d, 0);
  const met = (t: Target) => value === t.value && (t.base === undefined || t.base === base);

  function change(next: number[]) {
    setDs(next);
    const v = next.reduce((sum, d, i) => sum + d * weight(i), 0);
    setHit(hit.map((h, i) => h || (v === targets[i].value && (targets[i].base ?? base) === base)));
  }

  return (
    <div className="digits">
      {bases.length > 1 && (
        <div className="ver-tabs" role="group" aria-label="Base">
          {bases.map((b) => (
            <button
              key={b}
              type="button"
              className="opt small"
              aria-pressed={base === b}
              onClick={() => {
                setBase(b);
                setDs(Array(width).fill(0));
              }}
            >
              {baseName[b] ?? `Base ${b}`}
            </button>
          ))}
        </div>
      )}
      <div className="dg-row" style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 3.2rem))` }}>
        {ds.map((d, i) => (
          <div key={i} className="dg-cell">
            <button
              type="button"
              className={`dg${base === 2 && d === 1 ? " on" : ""}${signed && i === 0 ? " sign" : ""}`}
              aria-label={`Digit worth ${weight(i)}, now ${DIGITS[d]}`}
              onClick={() => change(ds.map((x, j) => (j === i ? (x + 1) % base : x)))}
            >
              {DIGITS[d]}
            </button>
            <span className="dg-w">{num(weight(i))}</span>
          </div>
        ))}
      </div>
      <p className="dg-sum" aria-live="polite">
        {ds
          .map((d, i) => ({ d, w: weight(i) }))
          .filter((t) => t.d !== 0)
          .map((t) => {
            const w = t.w < 0 ? `(−${-t.w})` : `${t.w}`;
            return t.d === 1 ? w : `${t.d} × ${w}`;
          })
          .join(" + ") || "0"}{" "}
        = <b>{num(value)}</b>
        {hex && (
          <>
            {" "}
            · hex <code>0x{unsigned.toString(16).toUpperCase()}</code>
          </>
        )}
      </p>
      {targets.length > 0 && (
        <ul className="dg-targets">
          {targets.map((t, i) => (
            <li key={i} className={hit[i] || met(t) ? "got" : ""}>
              {hit[i] || met(t) ? "✓ " : "○ "}
              {t.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function toDigits(n: number, base: number, width: number) {
  const out: number[] = [];
  for (let i = 0; i < width; i++) {
    out.unshift(n % base);
    n = Math.floor(n / base);
  }
  return out;
}
