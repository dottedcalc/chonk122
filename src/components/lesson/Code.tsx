// A numbered C0 listing. Contract lines (//@ and /*@ ... @*/ blocks) are tinted, and lines in `hi` are marked.
// Whether line i sits inside a /*@ ... @*/ contract block.
function inBlock(lines: string[], i: number) {
  for (let j = i; j >= 0; j--) {
    if (j < i && lines[j].includes("@*/")) return false;
    if (lines[j].trim().startsWith("/*@")) return true;
  }
  return false;
}

export function Code({
  src,
  start = 1,
  hi = [],
  label,
}: {
  src: string;
  start?: number;
  hi?: number[];
  label?: string;
}) {
  return (
    <pre className="code" aria-label={label} tabIndex={0}>
      <code>
        {src.split("\n").map((line, i, lines) => {
          const n = i + start;
          const cls = ["code-line"];
          if (line.trim().startsWith("//@") || inBlock(lines, i)) cls.push("contract");
          if (hi.includes(n)) cls.push("hi");
          return (
            <span key={i} className={cls.join(" ")}>
              <span className="code-n" aria-hidden="true">
                {n}
              </span>
              {line || " "}
              {"\n"}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
