import { Wobble } from "./Wobble";

const foot =
  "M0 0C-10 4-22 14-25 23C-17 23-12 19-8 23C-2 27 2 23 6 26C12 29 18 25 23 22C19 12 10 4 0 0Z";

// Puffy outlines: each bump is its own curve so the edges read as fluff.
const body =
  "M214.1 240.5Q226.2 255.9 212.6 270.1Q220.3 284.7 207.6 295.3Q210.8 314 192.4 318Q191.2 335.3 173.9 334Q163.8 348.5 146.6 344.1Q137.4 356.5 124.4 348.3Q107.9 361.4 94.8 345Q75.5 352.5 69.4 332.7Q53 332.7 52.8 316.2Q34.4 314.7 37 296.4Q20.4 285.1 30.5 267.7Q15.3 255.4 27.9 240.5Q17.5 221.8 35.9 211Q33.1 193.6 49.3 186.6Q45.8 169.6 62.7 165.4Q63.8 149 80.3 148.9Q84.9 132.3 101.9 135.1Q111.5 127 121.8 134.3Q132.1 122.3 143.6 133.2Q160.7 128.9 165 146Q181.5 147.1 180.5 163.6Q197 169.4 195.4 186.8Q211.4 194.4 208.7 211.9Q222.1 224.2 214.1 240.5Z";
const leftWing =
  "M44 168Q26 176.2 26 196Q9.6 210.8 16 232Q1.3 249.2 14 268Q7.6 286.6 22 300Q24 311.9 36 312Q48 304.3 48 290Q63.3 272.9 54 252Q72.8 232.6 58 210Q67.2 194.3 56 180Q54.4 169.6 44 168Z";
const rightWing =
  "M198 168Q218.1 174.9 216 196Q234.5 210 227 232Q238.9 249.1 230 268Q234.7 286.2 222 300Q220 311.8 208 312Q194.8 304.9 196 290Q179.9 273.1 190 252Q176.2 232.1 186 210Q176.7 194.3 188 180Q189.2 170.8 198 168Z";

// Chonk: Honk's human-sized buddy, tall and fluffy with long dangly orange legs.
export function Chonk({ className, title = "Chonk" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="-8 0 254 450" role="img" aria-label={title}>
      <defs>
        <Wobble id="chonk-wobble" />
      </defs>
      <g
        filter="url(#chonk-wobble)"
        stroke="var(--ink)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* long dangly legs and webbed feet */}
        <path d="M100 336C98 366 95 394 92 418L104 420C108 396 110 366 113 338Z" fill="var(--beak)" />
        <path d="M139 338C143 366 148 394 152 418L164 415C160 393 156 364 152 336Z" fill="var(--beak)" />
        <g transform="translate(98 418) rotate(6)">
          <path d={foot} fill="var(--beak)" />
          <path d="M0 3L-9 22M0 3L4 25" fill="none" strokeWidth="2" />
        </g>
        <g transform="translate(158 416) rotate(-10) scale(-1 1)">
          <path d={foot} fill="var(--beak)" />
          <path d="M0 3L-9 22M0 3L4 25" fill="none" strokeWidth="2" />
        </g>

        {/* long neck and head */}
        <path
          d="M96 152C92 124 94 100 100 82C88 70 86 44 102 30C116 16 146 18 156 38C164 54 156 70 146 78C148 100 152 124 156 152Z"
          fill="var(--goose)"
        />
        <path d="M118 21C116 13 120 7 126 9M127 20C129 13 135 11 139 15" fill="none" strokeWidth="2.5" />

        {/* fluffy body and droopy wings */}
        <path d={body} fill="var(--goose)" />
        <path d={leftWing} fill="var(--goose)" />
        <path d={rightWing} fill="var(--goose)" />

        <g fill="none" strokeWidth="2.2">
          {/* fluff curls */}
          <path d="M92 214c4-5 11-3 11 3M138 250c4-5 11-3 11 3M100 290c4-5 11-3 11 3M150 312c4-5 11-3 11 3M118 176c4-5 11-3 11 3" />
          <path d="M28 236c5 4 10 4 14 0M208 236c5 4 10 4 14 0M30 274c5 4 10 4 14 0M204 274c5 4 10 4 14 0" />
        </g>

        {/* beak */}
        <path d="M104 46C88 48 72 58 64 70C78 74 96 68 108 60C112 54 110 48 104 46Z" fill="var(--beak)" />
        <path d="M69 69C82 63 94 58 106 54" fill="none" strokeWidth="2.2" />
      </g>
      <circle cx="127" cy="40" r="5" fill="var(--ink)" />
      <circle cx="128.7" cy="38.3" r="1.7" fill="#fff" />
      <ellipse cx="139" cy="57" rx="7" ry="4" fill="var(--blush)" />
    </svg>
  );
}
