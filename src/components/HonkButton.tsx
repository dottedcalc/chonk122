"use client";

import { useState } from "react";

// Wraps a mascot so clicking it says one of its lines, never the same one twice in a row.
export function HonkButton({
  name,
  lines,
  children,
}: {
  name: string;
  lines: string[];
  children: React.ReactNode;
}) {
  const [line, setLine] = useState<number | null>(null);
  const [clicks, setClicks] = useState(0);

  function onClick() {
    let next = Math.floor(Math.random() * lines.length);
    if (lines.length > 1 && next === line) next = (next + 1) % lines.length;
    setLine(next);
    setClicks(clicks + 1);
  }

  return (
    <button type="button" className="mascot" onClick={onClick} aria-label={`Poke ${name}`}>
      {line !== null && (
        <span key={clicks} className="bubble" role="status">
          {lines[line]}
        </span>
      )}
      {children}
    </button>
  );
}
