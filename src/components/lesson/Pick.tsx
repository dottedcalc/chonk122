"use client";

import { useState } from "react";

// Predict, then reveal: the reader picks one option and sees the answer and why.
export function Pick({
  question,
  options,
  answer,
  explain,
}: {
  question: React.ReactNode;
  options: React.ReactNode[];
  answer: number;
  explain: React.ReactNode;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="pick">
      <p className="pick-q">{question}</p>
      <div className="pick-opts">
        {options.map((o, i) => {
          let cls = "opt";
          if (picked !== null && i === answer) cls += " right";
          else if (picked === i) cls += " wrong";
          return (
            <button
              key={i}
              type="button"
              className={cls}
              aria-pressed={picked === i}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
            >
              {o}
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {picked !== null && (
          <div className="pick-why">
            <b>{picked === answer ? "Yes!" : "Not quite."}</b> {explain}{" "}
            <button type="button" className="link" onClick={() => setPicked(null)}>
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
