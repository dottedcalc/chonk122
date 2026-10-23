// A pastel highlight in the course map colour of its big idea: 1 reasoning, 2 algorithms, 3 systems.
export function Hi({ c = 1, children }: { c?: 1 | 2 | 3; children: React.ReactNode }) {
  return <mark className={`hi c${c}`}>{children}</mark>;
}
