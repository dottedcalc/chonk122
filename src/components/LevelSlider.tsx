"use client";

import { useState, useTransition } from "react";
import { setLevel, type Level } from "@/app/exercises/actions";

const stops: { level: Level; name: string }[] = [
  { level: null, name: "Auto" },
  { level: 1, name: "Easy" },
  { level: 2, name: "Medium" },
  { level: 3, name: "Hard" },
];

// Lets the student pick their exercise level, with a short note on how levels work.
export function LevelSlider({ n, initial }: { n: number; initial: Level }) {
  const [i, setI] = useState(stops.findIndex((s) => s.level === initial));
  const [saved, setSaved] = useState<"idle" | "saved" | "failed">("idle");
  const [pending, start] = useTransition();

  function pick(next: number) {
    setI(next);
    start(async () => setSaved((await setLevel(n, stops[next].level)) ? "saved" : "failed"));
  }

  return (
    <section className="cm-box ex-level" aria-labelledby="ex-level-label">
      <div className="ex-level-row">
        <label id="ex-level-label" htmlFor="ex-level">
          Level: <b>{stops[i].name}</b>
        </label>
        <input
          id="ex-level"
          type="range"
          min={0}
          max={3}
          step={1}
          value={i}
          aria-valuetext={stops[i].name}
          onChange={(e) => pick(Number(e.target.value))}
        />
      </div>
      <div className="ex-level-ticks" aria-hidden="true">
        {stops.map((s) => (
          <span key={s.name}>{s.name}</span>
        ))}
      </div>
      <p className="muted" aria-live="polite">
        {pending
          ? "Saving…"
          : saved === "failed"
            ? "That didn't save. Try again."
            : saved === "saved"
              ? "Saved. Your next round uses this level."
              : null}
      </p>
      <details className="ex-how">
        <summary>How levels work</summary>
        <p>Auto picks the level for you. It moves up after a strong round and down after a weak one.</p>
        <p>Easy, Medium and Hard keep you at the level you choose.</p>
        <p>A new level starts with your next round. Harder questions count more toward your score.</p>
      </details>
    </section>
  );
}
