"use client";

import { useState } from "react";

// Selection sort by hand, tallest to the back. Each round the reader taps the tallest goose in the
// unsorted part, and it swaps with the last unsorted slot. A wrong tap says which goose is taller.
export function SwapSort({ cells }: { cells: number[] }) {
  const [a, setA] = useState(cells);
  const [i, setI] = useState(cells.length);
  const [msg, setMsg] = useState<React.ReactNode>(null);
  const [bad, setBad] = useState(false);
  const [swaps, setSwaps] = useState(0);
  const done = i <= 1;

  function tap(k: number) {
    if (done || k >= i) return;
    let t = 0;
    for (let j = 1; j < i; j++) if (a[j] > a[t]) t = j;
    if (a[k] < a[t]) {
      setBad(true);
      setMsg(
        <>
          ✗ The goose at index {k} is {a[k]} tall, but the one at index {t} is {a[t]}. Try another.
        </>,
      );
      return;
    }
    const next = [...a];
    [next[k], next[i - 1]] = [next[i - 1], next[k]];
    setA(next);
    setI(i - 1);
    setSwaps(swaps + 1);
    setBad(false);
    setMsg(
      k === i - 1 ? (
        <>✓ It&apos;s already at the back of the unsorted part, so it swaps with itself.</>
      ) : (
        <>
          ✓ Swapped index {k} with index {i - 1}.
        </>
      ),
    );
  }

  return (
    <div className="lf">
      <div className="lf-cells" role="group" aria-label="Geese by height">
        {a.map((c, k) => (
          <button
            key={k}
            type="button"
            className={`ai-cell lf-cell open${k >= i || done ? " sorted" : ""}`}
            aria-label={`Index ${k}, height ${c}${k >= i || done ? ", sorted" : ""}`}
            aria-disabled={k >= i || done}
            onClick={() => tap(k)}
          >
            <span className="mem-i">{k}</span>
            <code>{c}</code>
          </button>
        ))}
      </div>
      <p className={`lf-status${bad ? " bad" : ""}`} aria-live="polite">
        {done ? `Sorted, with ${swaps} swaps and the same geese as before.` : msg ?? "Round 1. Tap the tallest goose that isn't sorted yet."}
      </p>
      <div className="lf-next">
        {(done || swaps > 0) && (
          <button
            type="button"
            className="small-btn"
            onClick={() => {
              setA(cells);
              setI(cells.length);
              setSwaps(0);
              setMsg(null);
              setBad(false);
            }}
          >
            Start over ▸
          </button>
        )}
      </div>
    </div>
  );
}
