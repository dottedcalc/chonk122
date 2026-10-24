// Two columns side by side, such as text beside a comic or a widget, that stack into one at phone width.
// lead makes the first column wider.
export function Cols({ children, lead = false }: { children: [React.ReactNode, React.ReactNode]; lead?: boolean }) {
  return (
    <div className={`cols${lead ? " lead" : ""}`}>
      <div className="col">{children[0]}</div>
      <div className="col">{children[1]}</div>
    </div>
  );
}
