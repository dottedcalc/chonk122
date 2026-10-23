// A strong marker highlight for one of the course's big ideas, used the first time it appears on a page.
// It is plain text, not a link, so it is styled with no border or shadow.
// The colour follows its category on the course map: 1 reasoning, 2 algorithms, 3 systems.
export function Big({ c = 1, children }: { c?: 1 | 2 | 3; children: React.ReactNode }) {
  return <strong className={`big c${c}`}>{children}</strong>;
}
