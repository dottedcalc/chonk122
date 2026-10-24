// A pastel highlight in the course map colour of its big idea, numbered as in src/lib/concepts.ts.
export function Hi({ c = 1, children }: { c?: 1 | 2 | 3 | 4 | 5; children: React.ReactNode }) {
  return <mark className={`hi c${c}`}>{children}</mark>;
}
