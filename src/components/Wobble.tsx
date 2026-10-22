// Roughens SVG edges so the drawings look hand-inked instead of geometric.
export function Wobble({ id, scale = 3 }: { id: string; scale?: number }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" />
      <feDisplacementMap in="SourceGraphic" scale={scale} />
    </filter>
  );
}
