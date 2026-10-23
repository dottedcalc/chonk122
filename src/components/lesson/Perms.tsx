"use client";

import { useState } from "react";

const who = ["Owner", "Group", "Others"];
const what = ["r", "w", "x"];

export type PermTarget = { label: React.ReactNode; value: number };

// Unix-style file permissions as 9 bits of one int, read, write and execute for owner, group and others.
// Bit 8 is the owner's read bit and bit 0 is the others' execute bit.
export function Perms({ start = 0, targets = [] }: { start?: number; targets?: PermTarget[] }) {
  const [v, setV] = useState(start);
  const [hit, setHit] = useState<boolean[]>(() => targets.map((t) => t.value === start));
  const bit = (row: number, col: number) => 8 - (row * 3 + col);
  const on = (b: number) => ((v >> b) & 1) === 1;

  function flip(b: number) {
    const next = v ^ (1 << b);
    setV(next);
    setHit(hit.map((h, i) => h || targets[i].value === next));
  }

  const letters = Array.from({ length: 9 }, (_, i) => (on(8 - i) ? what[i % 3] : "-")).join("");

  return (
    <div className="perms">
      <table className="perm-grid">
        <thead>
          <tr>
            <td />
            <th scope="col">read</th>
            <th scope="col">write</th>
            <th scope="col">execute</th>
          </tr>
        </thead>
        <tbody>
          {who.map((w, row) => (
            <tr key={w}>
              <th scope="row">{w}</th>
              {what.map((x, col) => {
                const b = bit(row, col);
                return (
                  <td key={x}>
                    <button
                      type="button"
                      className={`dg small${on(b) ? " on" : ""}`}
                      aria-pressed={on(b)}
                      aria-label={`${w} ${["read", "write", "execute"][col]}, bit ${b}`}
                      onClick={() => flip(b)}
                    >
                      {on(b) ? x : "-"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="perm-read" aria-live="polite">
        <p>
          <code>{letters}</code>
        </p>
        <p>
          binary <code>{v.toString(2).padStart(9, "0")}</code>
        </p>
        <p>
          int <code>0x{v.toString(16).toUpperCase().padStart(3, "0")}</code> · <code>{v}</code>
        </p>
      </div>
      {targets.length > 0 && (
        <ul className="dg-targets">
          {targets.map((t, i) => (
            <li key={i} className={hit[i] ? "got" : ""}>
              {hit[i] ? "✓ " : "○ "}
              {t.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
