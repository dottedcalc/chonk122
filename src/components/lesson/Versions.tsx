"use client";

import { useState } from "react";

// Tabs for comparing versions of the same code side by side, one at a time.
export function Versions({
  tabs,
  label,
}: {
  tabs: { label: React.ReactNode; body: React.ReactNode }[];
  label: string;
}) {
  const [k, setK] = useState(0);

  return (
    <div className="versions">
      <div className="ver-tabs" role="group" aria-label={label}>
        {tabs.map((t, i) => (
          <button key={i} type="button" className="opt small" aria-pressed={k === i} onClick={() => setK(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="ver-body" key={k}>
        {tabs[k].body}
      </div>
    </div>
  );
}
