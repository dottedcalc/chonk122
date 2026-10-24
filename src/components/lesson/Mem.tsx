"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Code } from "./Code";

// A variable in a frame. `to` names the array its address points at, drawn as an arrow.
export type MemVar = { name: string; value?: string | number; to?: string };
export type MemFrame = { fn: string; vars: MemVar[]; active?: boolean; gone?: boolean };
// gone marks an array no variable can reach, waiting for the garbage collector.
export type MemArray = { id: string; cells: (string | number)[]; gone?: boolean; hot?: number[] };
export type MemState = { frames: MemFrame[]; arrays: MemArray[] };

type Arrow = { d: string; gone: boolean };

// The course's memory picture: frames in local memory on the left, arrays in allocated memory on the
// right, and an arrow from each variable that holds an array's address to that array.
// Arrows are measured from the boxes, so they follow the layout at every width.
export function MemDiagram({ state, pick }: { state: MemState; pick?: (v: string) => React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const head = `mem-head-${useId().replace(/:/g, "")}`;

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    function draw() {
      if (!el) return;
      const base = el.getBoundingClientRect();
      const out: Arrow[] = [];
      el.querySelectorAll<HTMLElement>("[data-to]").forEach((dot) => {
        const target = el.querySelector<HTMLElement>(`[data-arr="${dot.dataset.to}"]`);
        if (!target) return;
        const a = dot.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        if (a.width === 0 || b.width === 0) return;
        const x1 = a.left + a.width / 2 - base.left;
        const y1 = a.top + a.height / 2 - base.top;
        let d: string;
        if (b.left - base.left > x1 + 20) {
          // The array is to the right, so enter its left edge.
          const x2 = b.left - base.left - 3;
          const y2 = Math.min(Math.max(y1, b.top - base.top + 12), b.bottom - base.top - 12);
          const mid = (x1 + x2) / 2;
          d = `M ${x1} ${y1} C ${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
        } else {
          // Stacked on a narrow screen, so run along the right margin, clear of the frames, and enter the array's right edge.
          const xr = base.width - 6 - out.length * 9;
          const x2 = b.right - base.left + 3;
          const y2 = (b.top + b.bottom) / 2 - base.top + (out.length % 3) * 6 - 6;
          d = `M ${x1} ${y1} L ${xr} ${y1} L ${xr} ${y2} L ${x2} ${y2}`;
        }
        out.push({ d, gone: target.dataset.gone === "1" });
      });
      setArrows(out);
    }
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    return () => ro.disconnect();
  }, [state]);

  const label = (id: string) => `array ${id}`;

  return (
    <div className="mem" ref={box}>
      <div className="mem-col">
        <p className="mem-head">Local memory</p>
        {state.frames.map((f, i) => (
          <div key={i} className={`mem-frame${f.active ? " active" : ""}${f.gone ? " gone" : ""}`}>
            <p className="mem-fn">
              <code>{f.fn}</code>
              {f.gone ? " · decommissioned" : f.active ? " · active" : ""}
            </p>
            {f.vars.length > 0 && (
              <table className="mem-vars">
                <tbody>
                  {f.vars.map((v) => (
                    <tr key={v.name}>
                      <th scope="row">
                        <code>{v.name}</code>
                      </th>
                      <td>
                        {v.to !== undefined ? (
                          <>
                            <span className="mem-dot" data-to={f.gone ? undefined : v.to} aria-hidden="true" />
                            <span className="sr-only">points to {label(v.to)}</span>
                          </>
                        ) : pick ? (
                          pick(v.name)
                        ) : (
                          <code>{v.value ?? "?"}</code>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
      {state.arrays.length > 0 && (
      <div className="mem-col">
        <p className="mem-head">Allocated memory</p>
        {state.arrays.map((a) => (
          <div key={a.id} className={`mem-arr${a.gone ? " gone" : ""}`}>
            <span className="mem-tag">{a.gone ? `${a.id} · garbage` : a.id}</span>
            <div className="mem-cells" data-arr={a.id} data-gone={a.gone ? "1" : "0"} aria-label={label(a.id)}>
              {a.cells.length === 0 && <span className="mem-empty">empty</span>}
              {a.cells.map((c, j) => (
                <span key={j} className={`mem-cell${a.hot?.includes(j) ? " hot" : ""}`}>
                  <span className="mem-i" aria-hidden="true">
                    {j}
                  </span>
                  <code>{c}</code>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}
      <svg className="mem-arrows" aria-hidden="true">
        <defs>
          <marker id={head} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="mem-head-tip" />
          </marker>
        </defs>
        {arrows.map((a, i) => (
          <path key={i} d={a.d} className={`mem-arrow${a.gone ? " gone" : ""}`} markerEnd={`url(#${head})`} />
        ))}
      </svg>
    </div>
  );
}

export type MemStep = MemState & { line: number; note?: React.ReactNode };

// Steps through a short program, marking the current line and redrawing memory after it runs.
export function MemStepper({ src, steps, label }: { src: string; steps: MemStep[]; label?: string }) {
  const [k, setK] = useState(0);
  const step = steps[k];
  return (
    <div className="stepper">
      <Code src={src} hi={[step.line]} label={label} />
      {/* The buttons sit above the diagram, which changes height from step to step, so they never move. */}
      <div className="step-ctrl">
        <button type="button" className="small-btn" onClick={() => k > 0 && setK(k - 1)} aria-disabled={k === 0}>
          ◂ Step back
        </button>
        <button
          type="button"
          className="small-btn"
          onClick={() => k < steps.length - 1 && setK(k + 1)}
          aria-disabled={k === steps.length - 1}
        >
          Step ▸
        </button>
      </div>
      <div aria-live="polite" className="mem-step">
        <p className="step-count">
          Step {k + 1} of {steps.length} · line {step.line}
        </p>
        {step.note && <p className="step-note">{step.note}</p>}
        <MemDiagram state={step} />
      </div>
    </div>
  );
}

// The reader draws the arrows. Each variable picks the array it points to, and a right pick draws its arrow.
export function MemDraw({
  frame,
  vars,
  arrays,
}: {
  frame: string;
  vars: { name: string; answer: string; miss?: Record<string, React.ReactNode>; why?: React.ReactNode }[];
  arrays: MemArray[];
}) {
  const [picks, setPicks] = useState<(string | null)[]>(() => vars.map(() => null));
  const state: MemState = {
    frames: [
      {
        fn: frame,
        active: true,
        vars: vars.map((v, i) => (picks[i] === v.answer ? { name: v.name, to: v.answer } : { name: v.name })),
      },
    ],
    arrays,
  };
  const done = vars.filter((v, i) => picks[i] === v.answer).length;

  return (
    <div className="mem-draw">
      <MemDiagram
        state={state}
        pick={(name) => {
          const i = vars.findIndex((v) => v.name === name);
          return (
            <span className="row-opts" role="group" aria-label={`Where ${name} points`}>
              {arrays.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`opt small${picks[i] === a.id ? " wrong" : ""}`}
                  aria-pressed={picks[i] === a.id}
                  onClick={() => setPicks(picks.map((p, j) => (j === i ? a.id : p)))}
                >
                  {a.id}
                </button>
              ))}
            </span>
          );
        }}
      />
      <div className="mem-draw-why" aria-live="polite">
        {vars.map((v, i) => {
          const p = picks[i];
          if (p === null) return null;
          return (
            <p key={v.name} className={p === v.answer ? "good" : "bad"}>
              <code>{v.name}</code> {p === v.answer ? <>✓ {v.why}</> : <>✗ Not quite. {v.miss?.[p]} Try another.</>}
            </p>
          );
        })}
      </div>
      <p className="rows-done">
        {done} of {vars.length} arrows drawn{done === vars.length ? ". Nice!" : ""}
      </p>
    </div>
  );
}
