"use client";

import { useEffect, useRef, useState } from "react";

// Holds back something that would give an answer away until the reader asks for it.
export function Reveal({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // The button the reader pressed is gone, so focus moves to what it revealed.
  useEffect(() => {
    if (open) box.current?.focus({ preventScroll: true });
  }, [open]);

  return open ? (
    <div className="reveal" tabIndex={-1} ref={box}>
      {children}
    </div>
  ) : (
    <div>
      <button type="button" className="small-btn" onClick={() => setOpen(true)}>
        {label} ▸
      </button>
    </div>
  );
}
