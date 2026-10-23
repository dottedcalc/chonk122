// A strong highlight for one of the course's big ideas, used the first time it appears on a page.
// The colour follows its category on the course map: 1 reasoning, 2 algorithms, 3 systems.
export function Big({ c = 1, children }: { c?: 1 | 2 | 3; children: React.ReactNode }) {
  return <strong className={`big c${c}`}>{children}</strong>;
}
