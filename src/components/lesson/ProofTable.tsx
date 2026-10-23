"use client";

import { Fragment, useState } from "react";

export type ProofRow = {
  claim: React.ReactNode;
  // The index of the right justification in options.
  answer: number;
  why?: React.ReactNode;
  // Shown already justified, so a long proof can ask about only some of its steps.
  given?: boolean;
  // Starts a new labelled part of the proof, such as the steps for one loop invariant.
  group?: string;
};

// A point-to proof as a table of steps, statements and justifications.
// The reader drags a justification into each empty cell, or taps one and then taps the cell.
// A wrong choice can be replaced, and the reason appears once the step is right.
export function ProofTable({ options, rows }: { options: string[]; rows: ProofRow[] }) {
  const [placed, setPlaced] = useState<(number | null)[]>(() => rows.map((r) => (r.given ? r.answer : null)));
  const [held, setHeld] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const asked = rows.filter((r) => !r.given).length;
  const done = rows.filter((r, i) => !r.given && placed[i] === r.answer).length;

  function place(i: number, j: number) {
    if (placed[i] === rows[i].answer) return;
    setPlaced(placed.map((x, k) => (k === i ? j : x)));
    setHeld(null);
  }

  return (
    <div className="proof">
      <div className="proof-bank" role="group" aria-label="Justifications">
        {options.map((o, j) => (
          <button
            key={j}
            type="button"
            draggable
            className="proof-chip"
            aria-pressed={held === j}
            onClick={() => setHeld(held === j ? null : j)}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", String(j));
              e.dataTransfer.effectAllowed = "copy";
              setHeld(j);
            }}
            onDragEnd={() => setOver(null)}
          >
            {o}
          </button>
        ))}
      </div>
      <table className="proof-table">
        <thead>
          <tr>
            <th scope="col">Step</th>
            <th scope="col">Statement</th>
            <th scope="col">Justification</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const p = placed[i];
            const right = p === r.answer;
            return (
              <Fragment key={i}>
                {r.group && (
                  <tr className="proof-group">
                    <th scope="colgroup" colSpan={3}>
                      {r.group}
                    </th>
                  </tr>
                )}
                <tr className={right ? "right" : p !== null ? "wrong" : ""}>
                  <td className="proof-n">{i + 1}</td>
                  <td className="proof-claim">
                    {r.claim}
                    {!r.given && right && r.why && <span className="proof-why">✓ {r.why}</span>}
                  </td>
                  <td className="proof-j">
                    {r.given ? (
                      <span className="proof-given">{options[r.answer]}</span>
                    ) : (
                      <button
                        type="button"
                        className={`proof-slot${over === i ? " over" : ""}${right ? " right" : p !== null ? " wrong" : ""}`}
                        aria-label={`Justification for step ${i + 1}${p !== null ? `, now ${options[p]}` : ", empty"}`}
                        disabled={right}
                        onClick={() => held !== null && place(i, held)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setOver(i);
                        }}
                        onDragLeave={() => setOver(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setOver(null);
                          const j = Number(e.dataTransfer.getData("text/plain"));
                          if (!Number.isNaN(j)) place(i, j);
                        }}
                      >
                        {p !== null ? options[p] : " "}
                        {right ? " ✓" : p !== null ? " ✗" : ""}
                      </button>
                    )}
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <p className="rows-done" aria-live="polite">
        {done} of {asked} done{done === asked ? ". Nice!" : ""}
      </p>
    </div>
  );
}

// A finished point-to proof as a table. The reader selects the first step whose justification is wrong.
export function SpotStep({
  rows,
  answer,
  explain,
}: {
  rows: { claim: React.ReactNode; by: React.ReactNode }[];
  answer: number;
  explain: React.ReactNode;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const right = picked === answer;

  return (
    <div className="proof">
      <table className="proof-table">
        <thead>
          <tr>
            <th scope="col">Step</th>
            <th scope="col">Statement</th>
            <th scope="col">Justification</th>
            <th scope="col">Wrong?</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={picked === i && right ? "flagged" : ""}>
              <td className="proof-n">{i + 1}</td>
              <td className="proof-claim">{r.claim}</td>
              <td className="proof-j">
                <span className="proof-given">{r.by}</span>
              </td>
              <td className="proof-flag">
                <button
                  type="button"
                  className={`opt small${picked === i ? (right ? " right" : " wrong") : ""}`}
                  aria-pressed={picked === i}
                  aria-label={`Step ${i + 1} is the first wrong step`}
                  disabled={right}
                  onClick={() => setPicked(i)}
                >
                  {picked === i ? (right ? "✓" : "✗") : "Flag"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div aria-live="polite">
        {picked !== null && (
          <p className="pick-why">
            {right ? (
              <>
                <b>Yes!</b> {explain}
              </>
            ) : (
              <>
                <b>Not quite.</b> That step is fine. Try another.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
