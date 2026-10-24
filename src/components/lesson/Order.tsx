"use client";

import { useEffect, useRef, useState } from "react";

// Put items in order by moving them up and down, then check. Each item out of place says why,
// from the lesson's own reasons, and the reader can keep moving until the order is right.
export function Order({
  items,
  start,
  why,
  first,
  last,
}: {
  // Items in the right order.
  items: React.ReactNode[];
  // The order to show at first, as indices into items.
  start: number[];
  // Why item k belongs where it does, shown when it is out of place.
  why: React.ReactNode[];
  first: string;
  last: string;
}) {
  const [order, setOrder] = useState(start);
  const [checked, setChecked] = useState(false);
  // After a move, focus follows the moved item so keyboard users can keep moving it.
  const [focus, setFocus] = useState<{ k: number; d: number } | null>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!focus) return;
    const btn = list.current?.querySelector<HTMLButtonElement>(`[data-k="${focus.k}"][data-d="${focus.d}"]`);
    (btn && !btn.disabled ? btn : list.current?.querySelector<HTMLButtonElement>(`[data-k="${focus.k}"]:not(:disabled)`))?.focus();
  }, [focus, order]);
  const right = order.every((k, i) => k === i);

  function move(i: number, d: number) {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setChecked(false);
    setFocus({ k: order[i], d });
  }

  const wrongAt = order.findIndex((k, i) => k !== i);

  return (
    <div className="order">
      <p className="order-end">{first}</p>
      <ol className="order-list" ref={list}>
        {order.map((k, i) => (
          <li key={k} className={checked ? (k === i ? "right" : "wrong") : ""}>
            <span className="order-item">{items[k]}</span>
            <span className="order-btns">
              <button type="button" className="small-btn" aria-label="Move up" data-k={k} data-d={-1} disabled={i === 0 || (checked && right)} onClick={() => move(i, -1)}>
                ▲
              </button>
              <button
                type="button"
                className="small-btn"
                aria-label="Move down"
                data-k={k}
                data-d={1}
                disabled={i === order.length - 1 || (checked && right)}
                onClick={() => move(i, 1)}
              >
                ▼
              </button>
            </span>
          </li>
        ))}
      </ol>
      <p className="order-end">{last}</p>
      <div className="order-check">
        {!(checked && right) && (
          <button type="button" className="small-btn" onClick={() => setChecked(true)}>
            Check ▸
          </button>
        )}
      </div>
      <p className={`order-why${checked && right ? " good" : ""}`} aria-live="polite">
        {checked && (right ? <>✓ That&apos;s the order. Nice!</> : <>
              ✗ {order.filter((k, i) => k === i).length} of {order.length} are in place. {why[order[wrongAt]]} Keep moving.
            </>)}
      </p>
    </div>
  );
}
