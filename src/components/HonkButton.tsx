"use client";

import { useState } from "react";

const honks = ["HONK!", "honk?", "HONK HONK", "assert(chonky);", "//@requires snacks"];

// Wraps a mascot so clicking it makes it honk.
export function HonkButton({ name, children }: { name: string; children: React.ReactNode }) {
  const [honk, setHonk] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  function onClick() {
    setHonk(honks[count % honks.length]);
    setCount(count + 1);
  }

  return (
    <button type="button" className="mascot" onClick={onClick} aria-label={`Poke ${name}`}>
      {honk && (
        <span key={count} className="bubble" role="status">
          {honk}
        </span>
      )}
      {children}
    </button>
  );
}
