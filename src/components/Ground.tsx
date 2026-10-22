import { Wobble } from "./Wobble";

// A grassy hill for the geese to stand on.
export function Ground({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 90" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <Wobble id="ground-wobble" scale={4} />
      </defs>
      <g
        filter="url(#ground-wobble)"
        stroke="var(--ink)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 86C40 44 150 24 300 22C450 20 560 42 592 86Z" fill="var(--green)" />
        <path
          d="M90 60C92 54 94 50 98 46M100 60C100 54 102 50 104 48M480 56C482 50 484 46 488 42M490 58C490 52 492 48 494 46M300 70C302 64 304 60 308 56"
          fill="none"
          stroke="var(--green-dark)"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}
