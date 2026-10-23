"use client";

import { useState } from "react";

const W = 8;

function Row({ v, label, name, onFlip }: { v: number; label: React.ReactNode; name?: string; onFlip?: (b: number) => void }) {
  return (
    <div className="bo-row">
      <span className="bo-label">{label}</span>
      <span className="bo-bits">
        {Array.from({ length: W }, (_, i) => {
          const b = W - 1 - i;
          const one = ((v >> b) & 1) === 1;
          return onFlip ? (
            <button
              key={b}
              type="button"
              className={`dg tiny${one ? " on" : ""}`}
              aria-label={`${name}, bit ${b}, now ${one ? 1 : 0}`}
              onClick={() => onFlip(b)}
            >
              {one ? 1 : 0}
            </button>
          ) : (
            <span key={b} className={`dg tiny out${one ? " on" : ""}`}>
              {one ? 1 : 0}
            </span>
          );
        })}
      </span>
    </div>
  );
}

// Two 8-bit patterns the reader can poke, and what &, |, ^ and ~ make of them, position by position.
export function BitOps({ a: a0 = 0b11001010, b: b0 = 0b10100110 }: { a?: number; b?: number }) {
  const [a, setA] = useState(a0);
  const [b, setB] = useState(b0);
  const mask = (1 << W) - 1;

  return (
    <div className="bitops">
      <p className="bo-cap">An 8-bit example</p>
      <Row v={a} name="a" label={<code>a</code>} onFlip={(k) => setA(a ^ (1 << k))} />
      <Row v={b} name="b" label={<code>b</code>} onFlip={(k) => setB(b ^ (1 << k))} />
      <hr />
      <div className="bitops" aria-live="polite">
      <Row v={a & b} label={<code>a &amp; b</code>} />
      <Row v={a | b} label={<code>a | b</code>} />
      <Row v={a ^ b} label={<code>a ^ b</code>} />
      <Row v={~a & mask} label={<code>~a</code>} />
      </div>
    </div>
  );
}
