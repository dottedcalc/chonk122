import { Wobble } from "./Wobble";

const foot =
  "M0 0C-10 4-22 14-25 23C-17 23-12 19-8 23C-2 27 2 23 6 26C12 29 18 25 23 22C19 12 10 4 0 0Z";

// Chonk: Honk's big white buddy with long dangly orange legs.
export function Chonk({ className, title = "Chonk" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 260 300" role="img" aria-label={title}>
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
        {/* dangly legs and webbed feet */}
        <path d="M98 214C96 232 92 248 88 262L99 264C103 250 107 234 110 216Z" fill="var(--beak)" />
        <path d="M160 214C164 232 170 248 176 261L188 258C182 246 176 230 172 214Z" fill="var(--beak)" />
        <g transform="translate(93 262) rotate(8)">
          <path d={foot} fill="var(--beak)" />
          <path d="M0 3L-9 22M0 3L4 25" fill="none" strokeWidth="2" />
        </g>
        <g transform="translate(182 259) rotate(-14) scale(-1 1)">
          <path d={foot} fill="var(--beak)" />
          <path d="M0 3L-9 22M0 3L4 25" fill="none" strokeWidth="2" />
        </g>

        {/* big round body */}
        <path
          d="M50 150C40 110 70 84 110 86C150 84 200 96 214 140C226 180 210 214 170 222C130 230 80 228 60 206C44 190 46 170 50 150Z"
          fill="var(--goose)"
        />
        <path d="M70 130C52 140 46 168 58 186C70 178 77 158 75 138Z" fill="var(--goose)" />

        {/* neck and head */}
        <path
          d="M98 104C91 82 86 63 92 46C100 22 141 18 153 41C161 57 151 72 141 80C136 92 138 104 145 112"
          fill="var(--goose)"
        />
      </g>
      {/* hides the neck seam so the neck flows into the body */}
      <ellipse cx="121" cy="110" rx="24" ry="11" fill="var(--goose)" />
      <g
        filter="url(#chonk-wobble)"
        stroke="var(--ink)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* wing with feather marks */}
        <path d="M160 120C196 124 214 160 200 190C186 196 170 180 162 166C156 150 154 132 160 120Z" fill="var(--goose)" />
        <path d="M172 150C180 158 186 166 190 176M168 136C176 142 182 148 186 156" strokeWidth="2.2" />
        {/* belly fluff */}
        <path d="M92 196C104 204 124 206 140 200M100 182C106 186 112 187 118 185" strokeWidth="2.2" />
        {/* beak */}
        <path d="M104 50C88 54 72 66 65 81C80 83 98 75 111 64C115 58 111 52 104 50Z" fill="var(--beak)" />
        <path d="M70 79C82 72 94 66 106 60" strokeWidth="2.2" />
      </g>
      <circle cx="128" cy="42" r="5" fill="var(--ink)" />
      <circle cx="129.7" cy="40.3" r="1.7" fill="#fff" />
      <ellipse cx="139" cy="58" rx="7" ry="4" fill="var(--blush)" />
    </svg>
  );
}
