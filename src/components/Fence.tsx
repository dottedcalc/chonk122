import { Wobble } from "./Wobble";

// The painted CMU Fence, in its 15-122 colours.
export function Fence({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 160" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <Wobble id="fence-wobble" scale={4} />
      </defs>
      <g filter="url(#fence-wobble)" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round">
        <path
          d="M14 156C10 112 12 72 16 44C20 22 56 20 62 42C120 47 190 44 236 40C240 18 281 16 288 38C360 45 440 42 500 40C506 18 548 16 552 40C620 45 700 42 748 38C754 18 791 20 788 46C790 80 788 120 786 156Z"
          fill="var(--fence)"
        />
        {/* the long white goose painted along the top rail */}
        <path
          d="M40 58C150 52 250 59 318 54C334 44 356 48 358 60C356 72 336 76 318 69C250 73 150 70 40 74C34 70 34 62 40 58Z"
          fill="var(--goose)"
        />
        <path d="M357 56C366 57 374 60 378 63C372 66 364 66 357 65Z" fill="var(--beak)" strokeWidth="2.5" />
      </g>
      <circle cx="343" cy="57" r="2.6" fill="var(--ink)" />
      <text x="190" y="128" className="svg-hand" fontSize="46" textAnchor="middle" fill="var(--cream)" letterSpacing="8">
        15-122
      </text>
      <path
        d="M470 96C460 86 462 76 470 80C478 76 480 86 470 96Z"
        fill="var(--heart)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
    </svg>
  );
}
