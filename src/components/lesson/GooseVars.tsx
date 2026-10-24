"use client";

import { useState } from "react";
import { Code } from "./Code";

const loop = `int[] geese = alloc_array(int, n);
for (int i = 0; i < n; i++) {
  geese[i] = weigh(i + 1);
}
int chonk = 0;
for (int i = 0; i < n; i++) {
  chonk += geese[i];
}`;

// One variable per goose against one array. The slider grows the flock, and only one listing grows with it.
export function GooseVars({ max = 100 }: { max?: number }) {
  const [n, setN] = useState(3);
  const [arr, setArr] = useState(false);

  const shown = Math.min(n, 4);
  const lines: string[] = [];
  for (let i = 1; i <= shown; i++) lines.push(`int goose${i} = weigh(${i});`);
  if (n > shown) lines.push(`// ... ${n - shown} more lines like these ...`);
  const terms = n <= 4 ? Array.from({ length: n }, (_, i) => `goose${i + 1}`).join(" + ") : `goose1 + goose2 + ... + goose${n}`;
  lines.push(`int chonk = ${terms};`);

  return (
    <div className="gv">
      <label className="sh-k">
        <span>
          {n} {n === 1 ? "goose" : "geese"}
        </span>
        <input type="range" min={1} max={max} value={n} onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <div className="ver-tabs" role="group" aria-label="Version">
        <button type="button" className="opt small" aria-pressed={!arr} onClick={() => setArr(false)}>
          One variable per goose
        </button>
        <button type="button" className="opt small" aria-pressed={arr} onClick={() => setArr(true)}>
          One array
        </button>
      </div>
      {arr ? <Code src={loop} label="One array" /> : <Code src={lines.join("\n")} label="One variable per goose" />}
      <p className="gv-count">
        {arr ? "8 lines, however many geese there are" : `${n + 1} lines for ${n} ${n === 1 ? "goose" : "geese"}`}
      </p>
    </div>
  );
}
