import { Wobble } from "./Wobble";
import { PoseMark, poseAngles, type Pose } from "./poses";
import { LookWords, honkLooks, honkShirt, type HonkOutfit, type Look } from "./outfits";

// Honk: the grey goose plush in an "I ♥ 15-122" shirt.
export function Honk({
  className,
  title = "Honk!",
  decorative = false,
  pose = "stand",
  flip = false,
  outfit = "love",
}: {
  className?: string;
  title?: string;
  decorative?: boolean;
  pose?: Pose;
  // Face right instead of left. The shirt's lettering stays readable.
  flip?: boolean;
  // A costume from the 15-122 staff page.
  outfit?: HonkOutfit;
}) {
  const a = poseAngles[pose];
  const look: Look = honkLooks[outfit];
  const lettered = !look.shirt && !look.bare;
  const tilt = `rotate(${a.head} 110 120)`;
  return (
    <svg
      className={className}
      viewBox="0 0 220 260"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title })}
    >
      <defs>
        <Wobble id="honk-wobble" />
        <clipPath id="honk-shirt-clip">
          <path d={honkShirt} />
        </clipPath>
      </defs>
      <g transform={flip ? "translate(220 0) scale(-1 1)" : undefined}>
        <g
          filter="url(#honk-wobble)"
          stroke="var(--ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {look.back}

          {/* wings poking out of the sleeves */}
          <g transform={`rotate(${a.front} 72 150)`}>
            <path d="M70 140C48 150 30 168 24 188C40 191 58 180 74 166Z" fill="var(--honk)" />
            <path d="M24 188C29 177 37 170 46 168C43 178 36 185 24 188Z" fill="var(--goose)" />
          </g>
          <g transform={`rotate(${a.back} 149 150)`}>
            <path d="M150 140C172 150 192 168 197 187C181 190 164 179 148 166Z" fill="var(--honk)" />
            <path d="M197 187C192 176 184 170 175 168C178 178 186 185 197 187Z" fill="var(--goose)" />
          </g>

          {/* feet */}
          <path d="M82 224C75 234 69 241 77 244C86 246 97 244 101 237C98 231 92 227 82 224Z" fill="var(--beak)" />
          <path
            d="M124 227C121 236 124 244 134 245C144 246 151 240 147 233C141 229 133 227 124 227Z"
            fill="var(--beak)"
          />

          {/* neck and head */}
          <g transform={tilt}>
            <path
              d="M96 120C92 102 88 90 86 77C71 70 69 41 91 28C110 15 137 25 137 48C138 64 127 74 121 83C118 97 122 108 128 121Z"
              fill="var(--honk)"
            />
            <path d="M100 26C104 18 110 14 118 16" fill="none" strokeWidth="2.5" />
          </g>

          {/* shirt, or a costume */}
          <path d={honkShirt} fill={look.bare ? "var(--honk)" : (look.shirt ?? "var(--shirt)")} />
          {!look.bare && <path d="M93 120C102 130 117 131 128 120" fill="none" strokeWidth="3" />}
          {look.body}
          {look.collar}

          {/* beak and face */}
          <g transform={tilt}>
            <path d="M88 52C74 50 58 55 51 62C59 69 77 71 90 64C93 60 92 55 88 52Z" fill="var(--beak)" />
            <path d="M55 62C66 63 78 62 89 59" fill="none" strokeWidth="2.5" />
            {look.head}
          </g>
        </g>
        <g transform={tilt}>
          {!look.noEye && (
            <>
              <circle cx="105" cy="45" r="4.5" fill="var(--ink)" />
              <circle cx="106.5" cy="43.5" r="1.5" fill="#fff" />
            </>
          )}
          <ellipse cx="116" cy="60" rx="6" ry="3.5" fill="var(--blush)" />
        </g>
        {look.front && (
          <g
            filter="url(#honk-wobble)"
            stroke="var(--ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {look.front}
          </g>
        )}
      </g>
      {lettered && (
        <>
          <path
            transform="translate(118 158) rotate(-6)"
            d="M0 10C-14 0-12-12 0-6C12-12 14 0 0 10Z"
            fill="var(--heart)"
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text x="96" y="167" className="svg-hand" fontSize="22" textAnchor="middle" fill="var(--ink)">
            I
          </text>
          <text x="111" y="200" className="svg-hand" fontSize="20" textAnchor="middle" fill="var(--ink)">
            15-122
          </text>
        </>
      )}
      <LookWords look={look} flip={flip} width={220} />
      <PoseMark pose={pose} x={flip ? 50 : 170} y={30} size={1.3} />
    </svg>
  );
}
