"use client";

import { useState } from "react";

// Holds back something that would give an answer away until the reader asks for it.
export function Reveal({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return open ? (
    <div className="reveal">{children}</div>
  ) : (
    <div>
      <button type="button" className="small-btn" onClick={() => setOpen(true)}>
        {label} ▸
      </button>
    </div>
  );
}
