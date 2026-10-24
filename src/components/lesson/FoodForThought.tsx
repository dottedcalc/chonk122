// An optional purple box, folded shut until the reader opens it, for the why behind a design choice,
// a connection to another lecture or a cool fact. Its words don't count toward the page's limit.
export function FoodForThought({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="fft">
      <summary>
        <span className="fft-tag">Food for thought</span> <span className="fft-title">{title}</span>
      </summary>
      <div className="fft-body">{children}</div>
    </details>
  );
}
