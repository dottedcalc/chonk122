"use client";

import { useEffect, useState } from "react";
import { Honk } from "./Honk";
import { Wobble } from "./Wobble";

const lines = [
  "Honk! is diving into the question pool",
  "Fishing out four fresh questions",
  "Checking every precondition",
  "Drying them off for you",
];

// Question cards bob up out of the pool and fly off, one after another.
function Pool() {
  return (
    <svg className="fetch-pool" viewBox="0 0 240 150" aria-hidden="true">
      <defs>
        <Wobble id="pool-wobble" scale={3} />
        <clipPath id="pool-surface">
          <rect x="-200" y="-400" width="640" height="518" />
        </clipPath>
      </defs>
      <g filter="url(#pool-wobble)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <g clipPath="url(#pool-surface)">
          {[0, 1, 2].map((i) => (
            <g key={i} className="fetch-card" style={{ animationDelay: `${i * 0.8}s` }}>
              <rect x="96" y="70" width="48" height="58" rx="5" fill="#fffdf6" />
              <text x="120" y="112" fontSize="34" className="svg-hand" fill="var(--green)" stroke="none" textAnchor="middle">
                ?
              </text>
            </g>
          ))}
        </g>
        <path d="M12 118C12 98 228 98 228 118C228 140 12 140 12 118Z" fill="#9fd3f2" />
        <path d="M44 120C60 114 76 126 92 120M136 124C152 118 168 130 184 124" fill="none" stroke="#fffdf6" strokeWidth="3" />
      </g>
    </svg>
  );
}

// The fun waiting screen for exercises, used while the page and the round load.
export function Fetching() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % lines.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="cm-box fetch" role="status">
      <div className="fetch-art">
        <Honk className="fetch-honk" outfit="shore" pose="point" decorative />
        <Pool />
      </div>
      <p className="fetch-line" key={i}>
        {lines[i]}
        <span className="fetch-dots" aria-hidden="true">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  );
}
