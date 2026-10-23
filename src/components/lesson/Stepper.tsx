"use client";

import { useState } from "react";
import { Code } from "./Code";

export type Step = {
  line: number;
  vars: Record<string, string | number>;
  note?: string;
  checks?: { label: string; value: string; ok: boolean }[];
};

// Steps through precomputed states of a run, marking the current line and showing the variables.
export function Stepper({ src, sets }: { src: string; sets: { label: string; steps: Step[] }[] }) {
  const [s, setS] = useState(0);
  const [k, setK] = useState(0);
  const steps = sets[s].steps;
  const step = steps[k];

  return (
    <div className="stepper">
      {sets.length > 1 && (
        <div className="ver-tabs" role="group" aria-label="Inputs">
          {sets.map((set, i) => (
            <button
              key={i}
              type="button"
              className="opt small"
              aria-pressed={s === i}
              onClick={() => {
                setS(i);
                setK(0);
              }}
            >
              {set.label}
            </button>
          ))}
        </div>
      )}
      <div className="step-grid">
        <Code src={src} hi={[step.line]} />
        <div className="step-state" aria-live="polite">
          <p className="step-count muted">
            Step {k + 1} of {steps.length} · line {step.line}
          </p>
          <table className="vars">
            <tbody>
              {Object.entries(step.vars).map(([name, v]) => (
                <tr key={name}>
                  <th scope="row">
                    <code>{name}</code>
                  </th>
                  <td>
                    <code>{v}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {step.checks?.map((c) => (
            <p key={c.label} className={`check ${c.ok ? "good" : "bad"}`}>
              <code>{c.label}</code>
              <br />
              <code>{c.value}</code> {c.ok ? "✓" : "✗"}
            </p>
          ))}
          {step.note && <p className="step-note">{step.note}</p>}
        </div>
      </div>
      <div className="step-ctrl">
        <button type="button" className="small-btn" onClick={() => setK(k - 1)} disabled={k === 0}>
          ◂ Step back
        </button>
        <button type="button" className="small-btn" onClick={() => setK(k + 1)} disabled={k === steps.length - 1}>
          Step ▸
        </button>
      </div>
    </div>
  );
}
