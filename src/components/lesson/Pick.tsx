"use client";

import { useState } from "react";

// Predict, then reveal: the reader picks one option and sees the answer and why.
// A wrong pick also says what is wrong with that option, when the lesson gives a reason.
export function Pick({
  question,
  options,
  answer,
  explain,
  wrong = [],
  after,
}: {
  question: React.ReactNode;
  options: React.ReactNode[];
  answer: number;
  explain: React.ReactNode;
  wrong?: React.ReactNode[];
  // Shown once the reader has picked, for a follow-up that would give the answer away.
  after?: React.ReactNode;
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
              aria-disabled={picked !== null}
              onClick={() => picked === null && setPicked(i)}
            >
              {o}
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {picked !== null && (
          <div className="pick-why">
            {picked === answer ? (
              <b>Yes!</b>
            ) : (
              <>
                <b>Not quite.</b> {wrong[picked]}
              </>
            )}{" "}
            {explain}
          </div>
        )}
      </div>
      {after && picked !== null && <div className="rows-after">{after}</div>}
    </div>
  );
}
