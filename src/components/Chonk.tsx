import { Wobble } from "./Wobble";
import { PoseMark, poseAngles, type Pose } from "./poses";
import { LookWords, chonkBody, chonkLooks, type ChonkOutfit, type Look } from "./outfits";

// Big webbed plush foot, drawn from the ankle down so it fans out toward the viewer.
const foot = "M-9 0C-20 10-32 22-34 34Q-26 41-17 36Q-8 44 0 37Q8 44 17 36Q26 41 34 34C32 22 20 10 9 0Z";

// Puffy outlines: soft bumps so the edges read as a stuffed toy.
const body = chonkBody;
const head =
  "M150 28Q164.5 23.8 175 34.2Q189.6 37.2 193.3 51Q204.1 60.5 200 74Q204.1 87.5 193.3 97Q189.6 110.8 175 113.8Q164.5 124.2 150 120Q135.5 124.2 125 113.8Q110.4 110.8 106.7 97Q95.9 87.5 100 74Q95.9 60.5 106.7 51Q110.4 37.2 125 34.2Q135.5 23.8 150 28Z";

// Chonk: Honk's human-sized buddy, a tall, round stuffed goose a little greyed with age.
export function Chonk({
  className,
  title = "Chonk",
  decorative = false,
  pose = "stand",
  flip = false,
  outfit = "plain",
}: {
  className?: string;
  title?: string;
  decorative?: boolean;
  pose?: Pose;
  // Face right instead of left.
  flip?: boolean;
  outfit?: ChonkOutfit;
}) {
  const a = poseAngles[pose];
  const look: Look = chonkLooks[outfit];
  const tilt = `rotate(${a.head} 148 146)`;
  return (
    <svg
      className={className}
      viewBox="12 6 260 422"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title })}
    >
      <defs>
        <Wobble id="chonk-wobble" />
        <clipPath id="chonk-body-clip">
          <path d={body} />
        </clipPath>
      </defs>
      <g transform={flip ? "translate(284 0) scale(-1 1)" : undefined}>
        <g
          filter="url(#chonk-wobble)"
          stroke="var(--ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {look.back}

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
          {look.body}
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
          {look.collar}
          <g transform={tilt}>{look.head}</g>
        </g>
        <g transform={tilt}>
          {!look.noEye && (
            <>
              <circle cx="138" cy="60" r="6" fill="var(--ink)" />
              <circle cx="140" cy="58" r="2" fill="#fff" />
            </>
          )}
          <ellipse cx="156" cy="84" rx="9" ry="5" fill="var(--blush)" />
        </g>
        {look.front && (
          <g
            filter="url(#chonk-wobble)"
            stroke="var(--ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {look.front}
          </g>
        )}
      </g>
      <LookWords look={look} flip={flip} width={284} />
      <PoseMark pose={pose} x={flip ? 60 : 224} y={34} size={1.8} />
    </svg>
  );
}
