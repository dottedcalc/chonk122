// Comic poses for Honk and Chonk. Each pose turns the wings about the shoulders and tilts the head;
// some add a small mark over the head.
export type Pose = "stand" | "wave" | "think" | "point" | "oops" | "cheer" | "shrug" | "dance" | "love";

// Degrees to turn the [front, back] wing and the head. The geese face left, so the front wing is on the left.
export const poseAngles: Record<Pose, { front: number; back: number; head: number }> = {
  stand: { front: 0, back: 0, head: 0 },
  wave: { front: 0, back: -115, head: -4 },
  think: { front: 110, back: 0, head: 8 },
  point: { front: 50, back: 0, head: -4 },
  oops: { front: 95, back: -95, head: 6 },
  cheer: { front: 120, back: -120, head: -8 },
  shrug: { front: 35, back: -35, head: 10 },
  dance: { front: 115, back: 25, head: -10 },
  love: { front: -25, back: 25, head: 6 },
};

// A "?" for thinking, a sweat drop and "!" for oops, sparkles for cheering, "..." for shrugging, music notes for
// dancing and a heart for love, drawn at (x, y).
export function PoseMark({ pose, x, y, size = 1 }: { pose: Pose; x: number; y: number; size?: number }) {
  const ink = { stroke: "var(--edge)", strokeWidth: 3, strokeLinecap: "round" as const, fill: "none" };
  if (pose === "think")
    return (
      <text x={x} y={y} fontSize={40 * size} className="svg-hand" fill="var(--edge)" textAnchor="middle">
        ?
      </text>
    );
  if (pose === "oops")
    return (
      <g transform={`translate(${x} ${y}) scale(${size})`}>
        <text x="0" y="0" fontSize="40" className="svg-hand" fill="var(--heart)" textAnchor="middle">
          !
        </text>
        <path
          d="M22 -30C16 -20 14 -14 18 -10C22 -7 27 -10 26 -16C25 -21 23 -25 22 -30Z"
          fill="#9fd3f2"
          stroke="var(--ink)"
          strokeWidth="2"
        />
      </g>
    );
  if (pose === "cheer")
    return (
      <g transform={`translate(${x} ${y}) scale(${size})`} {...ink}>
        <path d="M-18 -26V-10M-26 -18H-10" />
        <path d="M14 -34V-22M8 -28H20" />
        <path d="M24 -8V2M19 -3H29" />
      </g>
    );
  if (pose === "shrug")
    return (
      <text x={x} y={y} fontSize={34 * size} className="svg-hand" fill="var(--edge)" textAnchor="middle">
        ...
      </text>
    );
  if (pose === "dance")
    return (
      <g transform={`translate(${x} ${y}) scale(${size})`} {...ink}>
        <path d="M-8 -6V-28L10 -32V-10" />
        <ellipse cx="-12" cy="-6" rx="5" ry="4" fill="var(--edge)" />
        <ellipse cx="6" cy="-10" rx="5" ry="4" fill="var(--edge)" />
      </g>
    );
  if (pose === "love")
    return (
      <path
        transform={`translate(${x} ${y - 12 * size}) scale(${size * 1.4})`}
        d="M0 10C-14 0-12-12 0-6C12-12 14 0 0 10Z"
        fill="var(--heart)"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    );
  return null;
}
