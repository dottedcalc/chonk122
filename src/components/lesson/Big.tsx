// A strong marker highlight for one of the course's big ideas, used the first time it appears on a page.
// It is plain text, not a link, so it is styled with no border or shadow.
// The colour follows its category on the course map, numbered as in src/lib/concepts.ts.
export function Big({ c = 1, children }: { c?: 1 | 2 | 3 | 4 | 5; children: React.ReactNode }) {
  return <strong className={`big c${c}`}>{children}</strong>;
}
