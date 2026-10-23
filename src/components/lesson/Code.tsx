// A numbered C0 listing. Contract lines (//@) are tinted, and lines in `hi` are marked.
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
        {src.split("\n").map((line, i) => {
          const n = i + start;
          const cls = ["code-line"];
          if (line.trim().startsWith("//@")) cls.push("contract");
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
