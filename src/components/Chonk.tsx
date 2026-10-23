import { Wobble } from "./Wobble";

// Big webbed plush foot, drawn from the ankle down so it fans out toward the viewer.
const foot =
  "M-9 0C-20 10-32 22-34 34Q-26 41-17 36Q-8 44 0 37Q8 44 17 36Q26 41 34 34C32 22 20 10 9 0Z";

// Puffy outlines: soft bumps so the edges read as a stuffed toy.
const body =
  "M140 120Q159.6 112.5 175.6 125.5Q196.5 124.5 206.8 141.5Q226.6 147.1 230.1 166Q246.2 177.5 242.4 196Q253 212 242.4 228Q246.2 246.5 230.1 257.7Q226.6 275.6 206.8 279.6Q196.5 293.6 175.6 290.4Q159.6 300.2 140 293Q120.4 300.2 104.4 290.4Q83.5 293.6 73.2 279.6Q53.4 275.6 49.9 257.7Q33.8 246.5 37.6 228Q27 212 37.6 196Q33.8 177.5 49.9 166Q53.4 147.1 73.2 141.5Q83.5 124.5 104.4 125.5Q120.4 112.5 140 120Z";
const head =
  "M150 28Q164.5 23.8 175 34.2Q189.6 37.2 193.3 51Q204.1 60.5 200 74Q204.1 87.5 193.3 97Q189.6 110.8 175 113.8Q164.5 124.2 150 120Q135.5 124.2 125 113.8Q110.4 110.8 106.7 97Q95.9 87.5 100 74Q95.9 60.5 106.7 51Q110.4 37.2 125 34.2Q135.5 23.8 150 28Z";

// Chonk: Honk's human-sized buddy, a big round stuffed goose who sits with his feet dangling.
export function Chonk({ className, title = "Chonk" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="12 6 260 374" role="img" aria-label={title}>
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
        {/* short stuffed legs and big webbed feet, dangling */}
        <path d="M98 276C96 290 95 304 94 318L116 320C116 306 117 292 120 278Z" fill="var(--beak)" />
        <path d="M160 278C163 292 164 306 164 320L186 318C185 304 184 290 182 276Z" fill="var(--beak)" />
        <g transform="translate(100 316) rotate(10) scale(1.3)">
          <path d={foot} fill="var(--beak)" />
          <path d="M0 5L-16 34M0 5L16 34" fill="none" strokeWidth="2" />
        </g>
        <g transform="translate(180 316) rotate(-10) scale(1.3)">
          <path d={foot} fill="var(--beak)" />
          <path d="M0 5L-16 34M0 5L16 34" fill="none" strokeWidth="2" />
        </g>

        {/* round stuffed body and stubby wings */}
        <path d={body} fill="var(--goose)" />
        <path d="M58 158C34 166 24 196 28 226C30 246 40 258 52 254C62 236 70 200 68 170Z" fill="var(--goose)" />
        <path d="M222 158C246 166 256 196 252 226C250 246 240 258 228 254C218 236 210 200 212 170Z" fill="var(--goose)" />

        <g fill="none" strokeWidth="2.2">
          {/* seam stitches and a little fluff */}
          <path d="M140 150C136 190 136 236 140 282" strokeDasharray="5 8" />
          <path d="M98 196c4-5 11-3 11 3M168 236c4-5 11-3 11 3M182 172c4-5 11-3 11 3" />
        </g>

        {/* thick stuffed neck */}
        <path d="M122 104C119 112 115 119 108 124L186 122C180 118 176 112 174 104Z" fill="var(--goose)" stroke="none" />
        <path d="M122 104C119 112 115 119 108 124M174 104C176 112 180 118 186 122" fill="none" />

        {/* big round head */}
        <path d={head} fill="var(--goose)" />
        <path d="M146 27C143 17 149 10 156 13M157 26C160 18 167 17 170 22" fill="none" strokeWidth="2.5" />

        {/* soft plush beak */}
        <path d="M112 60C92 58 70 66 60 80C55 91 66 98 81 96C97 94 111 88 117 80C121 72 119 63 112 60Z" fill="var(--beak)" />
        <path d="M64 87C80 85 98 81 115 75" fill="none" strokeWidth="2.2" />
      </g>
      <circle cx="138" cy="60" r="6" fill="var(--ink)" />
      <circle cx="140" cy="58" r="2" fill="#fff" />
      <ellipse cx="156" cy="84" rx="9" ry="5" fill="var(--blush)" />
    </svg>
  );
}
