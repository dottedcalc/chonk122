import { Wobble } from "./Wobble";
import { PoseMark, poseAngles, type Pose } from "./poses";

// Big webbed plush foot, drawn from the ankle down so it fans out toward the viewer.
const foot = "M-9 0C-20 10-32 22-34 34Q-26 41-17 36Q-8 44 0 37Q8 44 17 36Q26 41 34 34C32 22 20 10 9 0Z";

// Puffy outlines: soft bumps so the edges read as a stuffed toy.
const body =
  "M140 142Q157.7 134.4 172.1 147.3Q191.3 145.8 201.1 162.6Q219.9 167.3 224.1 186.5Q240.7 196.9 238.9 216.6Q251.6 231.7 244 250Q251.6 268.3 238.9 283.3Q240.7 302.8 224.1 312.6Q219.9 330.2 201.1 332.9Q191.3 346.4 172.1 342.6Q157.7 352.4 140 345Q122.3 352.4 107.9 342.6Q88.7 346.4 78.9 332.9Q60.1 330.2 55.9 312.6Q39.3 302.8 41.1 283.3Q28.4 268.3 36 250Q28.4 231.7 41.1 216.6Q39.3 196.9 55.9 186.5Q60.1 167.3 78.9 162.6Q88.7 145.8 107.9 147.3Q122.3 134.4 140 142Z";
const head =
  "M150 28Q164.5 23.8 175 34.2Q189.6 37.2 193.3 51Q204.1 60.5 200 74Q204.1 87.5 193.3 97Q189.6 110.8 175 113.8Q164.5 124.2 150 120Q135.5 124.2 125 113.8Q110.4 110.8 106.7 97Q95.9 87.5 100 74Q95.9 60.5 106.7 51Q110.4 37.2 125 34.2Q135.5 23.8 150 28Z";

// Chonk: Honk's human-sized buddy, a tall, round stuffed goose a little greyed with age.
export function Chonk({
  className,
  title = "Chonk",
  pose = "stand",
  flip = false,
}: {
  className?: string;
  title?: string;
  pose?: Pose;
  // Face right instead of left.
  flip?: boolean;
}) {
  const a = poseAngles[pose];
  const tilt = `rotate(${a.head} 148 146)`;
  return (
    <svg className={className} viewBox="12 6 260 422" role="img" aria-label={title}>
      <defs>
        <Wobble id="chonk-wobble" />
      </defs>
      <g transform={flip ? "translate(284 0) scale(-1 1)" : undefined}>
        <g
          filter="url(#chonk-wobble)"
          stroke="var(--ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* short stuffed legs and big webbed feet, dangling */}
          <path d="M98 322C96 336 95 350 94 364L116 366C116 352 117 338 120 324Z" fill="var(--beak)" />
          <path d="M160 324C163 338 164 352 164 366L186 364C185 350 184 336 182 322Z" fill="var(--beak)" />
          <g transform="translate(100 362) rotate(10) scale(1.3)">
            <path d={foot} fill="var(--beak)" />
            <path d="M0 5L-16 34M0 5L16 34" fill="none" strokeWidth="2" />
          </g>
          <g transform="translate(180 362) rotate(-10) scale(1.3)">
            <path d={foot} fill="var(--beak)" />
            <path d="M0 5L-16 34M0 5L16 34" fill="none" strokeWidth="2" />
          </g>

          {/* round stuffed body and stubby wings */}
          <path d={body} fill="var(--chonk)" />
          <path
            transform={`rotate(${a.front} 74 204)`}
            d="M58 176C34 186 22 222 26 256C28 280 40 294 52 290C62 268 70 226 68 190Z"
            fill="var(--chonk)"
          />
          <path
            transform={`rotate(${a.back} 206 204)`}
            d="M222 176C246 186 258 222 254 256C252 280 240 294 228 290C218 268 210 226 212 190Z"
            fill="var(--chonk)"
          />

          <g fill="none" strokeWidth="2.2">
            {/* seam stitches and a little fluff */}
            <path d="M140 172C136 220 136 280 140 330" strokeDasharray="5 8" />
            <path d="M98 220c4-5 11-3 11 3M168 270c4-5 11-3 11 3M182 196c4-5 11-3 11 3M96 300c4-5 11-3 11 3" />
          </g>

          <g transform={tilt}>
            {/* thick stuffed neck */}
            <path
              d="M122 104C118 120 114 134 106 148L188 146C180 134 176 120 174 104Z"
              fill="var(--chonk)"
              stroke="none"
            />
            <path d="M122 104C118 120 114 134 106 148M174 104C176 120 180 134 188 146" fill="none" />

            {/* big round head */}
            <path d={head} fill="var(--chonk)" />
            <path d="M146 27C143 17 149 10 156 13M157 26C160 18 167 17 170 22" fill="none" strokeWidth="2.5" />

            {/* soft plush beak */}
            <path
              d="M112 60C92 58 70 66 60 80C55 91 66 98 81 96C97 94 111 88 117 80C121 72 119 63 112 60Z"
              fill="var(--beak)"
            />
            <path d="M64 87C80 85 98 81 115 75" fill="none" strokeWidth="2.2" />
          </g>
        </g>
        <g transform={tilt}>
          <circle cx="138" cy="60" r="6" fill="var(--ink)" />
          <circle cx="140" cy="58" r="2" fill="#fff" />
          <ellipse cx="156" cy="84" rx="9" ry="5" fill="var(--blush)" />
        </g>
      </g>
      <PoseMark pose={pose} x={flip ? 60 : 224} y={34} size={1.8} />
    </svg>
  );
}
