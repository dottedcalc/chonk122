// A circular proficiency meter from 0 to 100, with the score (and an optional caption) in the middle.
export function Ring({ score, label, size = 64, caption }: { score: number; label: string; size?: number; caption?: string }) {
  const r = 15.9155; // circumference of 100, so the dash length is the score
  return (
    <svg
      className="ring"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
    >
      <circle className="ring-track" cx="18" cy="18" r={r} />
      {score > 0 && <circle className="ring-fill" cx="18" cy="18" r={r} strokeDasharray={`${score} ${100 - score}`} />}
      <text x="18" y={caption ? 15.5 : 18} className="ring-num">
        {score}
      </text>
      {caption && (
        <text x="18" y="23.5" className="ring-cap">
          {caption}
        </text>
      )}
    </svg>
  );
}
