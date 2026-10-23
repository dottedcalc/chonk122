"use client";

import { Fragment, useState } from "react";

export type ProofRow = {
  claim: React.ReactNode;
  // The index of the right justification in options.
  answer: number;
  why?: React.ReactNode;
  // Shown already filled in, so a long proof can ask about only some of its steps.
  given?: boolean;
  // When set, the statement is the blank and this is the index of the right statement in claims.
  // The justification is then shown filled in.
  claimAnswer?: number;
  // Starts a new labelled part of the proof, such as the steps for one loop invariant.
  group?: string;
};

type Chip = { kind: "claim" | "why"; j: number };

// A point-to proof as a table of steps, statements and justifications. Some rows leave the statement
// blank and some leave the justification blank. The reader drags a card from the bank into each blank,
// or taps a card and then taps the blank. A wrong card can be replaced, and the reason appears once
// the step is right.
export function ProofTable({
  options,
  claims = [],
  rows,
}: {
  options: string[];
  claims?: React.ReactNode[];
  rows: ProofRow[];
}) {
  const kindOf = (r: ProofRow) => (r.claimAnswer !== undefined ? "claim" : "why");
  const rightOf = (r: ProofRow) => (r.claimAnswer !== undefined ? r.claimAnswer : r.answer);
  const [placed, setPlaced] = useState<(Chip | null)[]>(() => rows.map(() => null));
  const [held, setHeld] = useState<Chip | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const isRight = (i: number) => {
    const c = placed[i];
    return c !== null && c.kind === kindOf(rows[i]) && c.j === rightOf(rows[i]);
  };
  const asked = rows.filter((r) => !r.given).length;
  const done = rows.filter((r, i) => !r.given && isRight(i)).length;
  const label = (c: Chip) => (c.kind === "claim" ? claims[c.j] : options[c.j]);
  const text = (c: Chip) => (c.kind === "claim" ? `statement ${c.j + 1}` : options[c.j]);

  function place(i: number, c: Chip) {
    if (isRight(i)) return;
    setPlaced(placed.map((x, k) => (k === i ? c : x)));
    setHeld(null);
  }

  function chips(kind: "claim" | "why", items: React.ReactNode[], name: string) {
    return (
      <div className="proof-bank" role="group" aria-label={name}>
        <span className="proof-bank-name">{name}</span>
        {items.map((o, j) => {
          const on = held?.kind === kind && held.j === j;
          return (
            <button
              key={j}
              type="button"
              draggable
              className={`proof-chip${kind === "claim" ? " claim" : ""}`}
              aria-pressed={on}
              onClick={() => setHeld(on ? null : { kind, j })}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", `${kind}:${j}`);
                e.dataTransfer.effectAllowed = "copy";
                setHeld({ kind, j });
              }}
              onDragEnd={() => setOver(null)}
            >
              {o}
            </button>
          );
        })}
      </div>
    );
  }

  function slot(i: number) {
    const c = placed[i];
    const right = isRight(i);
    return (
      <button
        type="button"
        className={`proof-slot${over === i ? " over" : ""}${right ? " right" : c !== null ? " wrong" : ""}`}
        aria-label={`${kindOf(rows[i]) === "claim" ? "Statement" : "Justification"} for step ${i + 1}${c !== null ? `, now ${text(c)}` : ", empty"}`}
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
          const [kind, j] = e.dataTransfer.getData("text/plain").split(":");
          if ((kind === "claim" || kind === "why") && j !== undefined) place(i, { kind, j: Number(j) });
        }}
      >
        {c !== null ? label(c) : "\u00a0"}
        {right ? " ✓" : c !== null ? " ✗" : ""}
      </button>
    );
  }

  return (
    <div className="proof">
      {claims.length > 0 && chips("claim", claims, "Statements")}
      {chips("why", options, "Justifications")}
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
            const blankClaim = !r.given && kindOf(r) === "claim";
            const blankWhy = !r.given && kindOf(r) === "why";
            const right = isRight(i);
            return (
              <Fragment key={i}>
                {r.group && (
                  <tr className="proof-group">
                    <th scope="colgroup" colSpan={3}>
                      {r.group}
                    </th>
                  </tr>
                )}
                <tr className={right ? "right" : ""}>
                  <td className="proof-n">{i + 1}</td>
                  <td className="proof-claim">
                    {blankClaim ? slot(i) : r.claim}
                    {!r.given && right && r.why && <span className="proof-why">✓ {r.why}</span>}
                  </td>
                  <td className="proof-j">
                    {blankWhy ? slot(i) : <span className="proof-given">{options[r.answer]}</span>}
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
  wrong = [],
}: {
  rows: { claim: React.ReactNode; by: React.ReactNode }[];
  answer: number;
  explain: React.ReactNode;
  // Why each wrong step is not the answer, indexed by step.
  wrong?: React.ReactNode[];
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
                <b>Not quite.</b> {wrong[picked] ?? "That step is fine."} Try another.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
