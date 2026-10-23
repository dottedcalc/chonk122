import { Wobble } from "./Wobble";
import { Honk } from "./Honk";
import { Chonk } from "./Chonk";
import type { Pose } from "./poses";
import type { ChonkOutfit, HonkOutfit } from "./outfits";

// One small scene per lecture for the lectures page: an ink doodle of the topic, with Honk or Chonk in a costume.

const ink = {
  stroke: "var(--edge)",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const thin = { fill: "none", strokeWidth: 2 };
const gold = "#f5c542";
const sky = "#9fd3f2";
const pink = "#f4a3c8";
const mint = "#9be37a";

// Hand-lettered label centered on (x, y).
function T({
  x,
  y,
  s = 14,
  fill = "var(--edge)",
  children,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
  children: React.ReactNode;
}) {
  return (
    <text x={x} y={y} fontSize={s} className="svg-hand" textAnchor="middle" fill={fill} stroke="none">
      {children}
    </text>
  );
}

// A line from (x1, y1) to (x2, y2) with an arrowhead at the end.
function Arrow({ x1, y1, x2, y2, bend = 0 }: { x1: number; y1: number; x2: number; y2: number; bend?: number }) {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  const h = (d: number) => `${x2 - 7 * Math.cos(a + d)} ${y2 - 7 * Math.sin(a + d)}`;
  return (
    <path d={`M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}M${h(0.5)}L${x2} ${y2}L${h(-0.5)}`} fill="none" strokeWidth="2.5" />
  );
}

// A row of array cells starting at (x, y), with optional labels and fills.
function Cells({
  x,
  y,
  w = 16,
  h = 18,
  labels,
  fills,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  labels: (string | number)[];
  fills?: (string | undefined)[];
}) {
  return (
    <g>
      {labels.map((l, i) => (
        <g key={i}>
          <rect x={x + i * w} y={y} width={w} height={h} fill={fills?.[i] ?? "var(--goose)"} strokeWidth="2.5" />
          <T x={x + i * w + w / 2} y={y + h - 5} s={12} fill="var(--ink)">
            {l}
          </T>
        </g>
      ))}
    </g>
  );
}

// A tree node at (x, y).
function Node({
  x,
  y,
  r = 8,
  fill = "var(--goose)",
  label,
}: {
  x: number;
  y: number;
  r?: number;
  fill?: string;
  label?: string | number;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} strokeWidth="2.5" />
      {label !== undefined && (
        <T x={x} y={y + 4} s={11} fill="var(--ink)">
          {label}
        </T>
      )}
    </g>
  );
}

const edges = (pairs: [number, number, number, number][], extra?: React.SVGProps<SVGPathElement>) => (
  <path d={pairs.map(([a, b, c, d]) => `M${a} ${b}L${c} ${d}`).join("")} fill="none" strokeWidth="2.5" {...extra} />
);

type Scene = { doodle: React.ReactNode; pose?: Pose } & (
  | { who: "honk"; outfit?: HonkOutfit }
  | { who: "chonk"; outfit?: ChonkOutfit }
);

const scenes: Record<number, Scene> = {
  1: {
    who: "honk",
    pose: "point",
    doodle: (
      <>
        <path d="M14 10C36 8 60 9 80 11C79 40 80 70 82 92C60 95 36 94 13 91C15 66 15 36 14 10Z" fill="var(--goose)" />
        <T x={47} y={30} s={12} fill="var(--ink)">
          {"//@requires"}
        </T>
        <T x={47} y={48} s={12} fill="var(--ink)">
          {"//@ensures"}
        </T>
        <path d="M30 70C34 75 37 78 40 80C46 70 54 63 64 58" fill="none" stroke="var(--green)" strokeWidth="5" />
      </>
    ),
  },
  2: {
    who: "chonk",
    outfit: "builder",
    pose: "think",
    doodle: (
      <>
        <Cells x={6} y={14} w={13} labels={[0, 1, 1, 1, 1, 1, 1, 1]} fills={[pink]} />
        <T x={58} y={52} s={14}>
          + 1
        </T>
        <Cells x={6} y={60} w={13} labels={[1, 0, 0, 0, 0, 0, 0, 0]} fills={[pink]} />
        <path d="M110 30C122 40 122 66 110 76" fill="none" strokeWidth="2.5" />
        <path d="M104 74L110 76L108 70" fill="none" strokeWidth="2.5" />
        <T x={60} y={96} s={12}>
          127 → -128
        </T>
      </>
    ),
  },
  3: {
    who: "honk",
    outfit: "inclass",
    doodle: (
      <>
        <Cells x={8} y={40} w={20} h={22} labels={[3, 1, 4, 1, 5]} fills={[undefined, undefined, gold]} />
        {[0, 1, 2, 3, 4].map((i) => (
          <T key={i} x={18 + i * 20} y={78} s={11}>
            {i}
          </T>
        ))}
        <T x={58} y={28} s={14}>
          A[2] == 4
        </T>
      </>
    ),
  },
  4: {
    who: "chonk",
    outfit: "detective",
    doodle: (
      <>
        <Cells x={6} y={44} w={18} h={22} labels={[7, 2, 9, 4, 6, 8]} fills={[undefined, undefined, undefined, mint]} />
        <circle cx="69" cy="40" r="17" fill={sky} fillOpacity="0.35" strokeWidth="4" />
        <path d="M81 52L96 68" fill="none" strokeWidth="6" />
        <T x={40} y={24} s={13}>
          find 4
        </T>
      </>
    ),
  },
  5: {
    who: "honk",
    outfit: "takeoff",
    pose: "cheer",
    doodle: (
      <>
        <path d="M14 8V90H112" fill="none" />
        <path d="M16 88C40 86 70 70 90 14" fill="none" stroke="var(--heart)" strokeWidth="3" />
        <path d="M16 88C50 82 80 66 110 50" fill="none" stroke="var(--beak)" strokeWidth="3" />
        <path d="M16 88C50 84 80 82 110 80" fill="none" stroke="var(--green)" strokeWidth="3" />
        <T x={92} y={12} s={11}>
          n²
        </T>
        <T x={106} y={44} s={11}>
          n
        </T>
        <T x={100} y={74} s={11}>
          log n
        </T>
      </>
    ),
  },
  6: {
    who: "chonk",
    outfit: "reader",
    doodle: (
      <>
        <Cells
          x={6}
          y={46}
          w={14}
          h={20}
          labels={[1, 3, 4, 6, 8, 9, 11, 15]}
          fills={[undefined, undefined, undefined, undefined, gold]}
        />
        <path d="M6 38V32H118V38M62 32V24" fill="none" strokeWidth="2.5" />
        <path d="M62 80V86H118V80" fill="none" strokeWidth="2.5" stroke="var(--green)" />
        <T x={62} y={18} s={12}>
          lo · mid · hi
        </T>
      </>
    ),
  },
  7: {
    who: "honk",
    outfit: "umpire",
    doodle: (
      <>
        {[30, 18, 44, 12, 56, 36, 64].map((h, i) => (
          <rect
            key={i}
            x={8 + i * 15}
            y={86 - h}
            width="11"
            height={h}
            fill={i === 3 ? "var(--beak)" : i < 3 ? sky : mint}
            strokeWidth="2.5"
          />
        ))}
        <T x={58} y={14} s={12}>
          pivot
        </T>
        <path d="M58 18L53 64" fill="none" strokeWidth="2" strokeDasharray="3 4" />
      </>
    ),
  },
  8: {
    who: "chonk",
    outfit: "reader",
    pose: "point",
    doodle: (
      <>
        <rect x="12" y="72" width="90" height="16" rx="2" fill={sky} />
        <rect x="20" y="56" width="76" height="16" rx="2" fill={pink} />
        <rect x="14" y="40" width="84" height="16" rx="2" fill={mint} />
        <rect x="24" y="24" width="68" height="16" rx="2" fill={gold} />
        <T x={57} y={36} s={11} fill="var(--ink)">
          interface
        </T>
        <T x={56} y={68} s={11} fill="var(--ink)">
          implementation
        </T>
      </>
    ),
  },
  9: {
    who: "honk",
    outfit: "drink",
    doodle: (
      <>
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx="30" cy={80 - i * 14} rx="22" ry="6" fill={[sky, pink, gold][i]} strokeWidth="2.5" />
        ))}
        <Arrow x1={30} y1={14} x2={30} y2={40} />
        <T x={30} y={98} s={12}>
          stack
        </T>
        <Cells x={62} y={60} w={14} labels={["a", "b", "c"]} />
        <Arrow x1={108} y1={52} x2={110} y2={68} bend={0} />
        <T x={84} y={98} s={12}>
          queue
        </T>
      </>
    ),
  },
  10: {
    who: "chonk",
    outfit: "tidy",
    doodle: (
      <>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={6 + i * 38} y="40" width="18" height="20" fill="var(--goose)" strokeWidth="2.5" />
            <rect
              x={24 + i * 38}
              y="40"
              width="10"
              height="20"
              fill={i === 2 ? "var(--paper-dot)" : gold}
              strokeWidth="2.5"
            />
            <T x={15 + i * 38} y={55} s={12} fill="var(--ink)">
              {[3, 1, 4][i]}
            </T>
          </g>
        ))}
        <Arrow x1={29} y1={50} x2={44} y2={50} />
        <Arrow x1={67} y1={50} x2={82} y2={50} />
        <T x={100} y={78} s={11}>
          NULL
        </T>
      </>
    ),
  },
  11: {
    who: "honk",
    outfit: "pumpkin",
    pose: "oops",
    doodle: (
      <>
        <Cells x={10} y={22} w={14} labels={[1, 2, 3, 4]} fills={[mint, mint, mint, mint]} />
        <Arrow x1={40} y1={46} x2={40} y2={62} />
        <Cells x={10} y={66} w={14} labels={[1, 2, 3, 4, 5, "", "", ""]} fills={[mint, mint, mint, mint, gold]} />
        <T x={86} y={36} s={12}>
          full!
        </T>
        <T x={66} y={100} s={12}>
          double it
        </T>
      </>
    ),
  },
  12: {
    who: "chonk",
    outfit: "chef",
    doodle: (
      <>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${8 + i * 27} 64L${12 + i * 27} 90H${28 + i * 27}L${32 + i * 27} 64Z`}
            fill={[sky, pink, mint, gold][i]}
            strokeWidth="2.5"
          />
        ))}
        <T x={58} y={22} s={13}>
          {'hash("goose")'}
        </T>
        <Arrow x1={58} y1={28} x2={74} y2={58} bend={-0.2} />
      </>
    ),
  },
  13: {
    who: "honk",
    outfit: "piada",
    doodle: (
      <>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path
              d={`M10 ${18 + i * 26}H46L54 ${28 + i * 26}L46 ${38 + i * 26}H10Z`}
              fill={[gold, pink, sky][i]}
              strokeWidth="2.5"
            />
            <T x={30} y={33 + i * 26} s={12} fill="var(--ink)">
              {["honk", "chonk", "egg"][i]}
            </T>
            <Arrow x1={58} y1={28 + i * 26} x2={76} y2={28 + i * 26} />
            <T x={92} y={33 + i * 26} s={13}>
              {[1, 2, 0][i]}
            </T>
          </g>
        ))}
      </>
    ),
  },
  14: {
    who: "chonk",
    outfit: "wizard",
    doodle: (
      <>
        <path d="M18 34H96V88H18Z" fill="var(--goose)" />
        <path d="M18 34L36 20H114L96 34ZM96 34L114 20V74L96 88Z" fill="var(--paper-dot)" strokeWidth="2.5" />
        <T x={57} y={66} s={16} fill="var(--ink)">
          void*
        </T>
      </>
    ),
  },
  15: {
    who: "honk",
    outfit: "berry",
    doodle: (
      <>
        {edges([
          [60, 18, 32, 46],
          [60, 18, 88, 46],
          [32, 46, 16, 76],
          [32, 46, 46, 76],
          [88, 46, 102, 76],
        ])}
        <Node x={60} y={18} r={10} fill="var(--green)" label={8} />
        <Node x={32} y={46} r={10} label={3} />
        <Node x={88} y={46} r={10} label={10} />
        <Node x={16} y={76} r={10} fill={gold} label={1} />
        <Node x={46} y={76} r={10} fill={gold} label={6} />
        <Node x={102} y={76} r={10} fill={gold} label={14} />
      </>
    ),
  },
  16: {
    who: "chonk",
    outfit: "grad",
    pose: "cheer",
    doodle: (
      <>
        <path d="M60 92L60 60M30 60H90" fill="none" strokeWidth="3" />
        <path d="M52 92H68" fill="none" />
        {edges([
          [30, 22, 18, 44],
          [30, 22, 42, 44],
          [90, 22, 78, 44],
          [90, 22, 102, 44],
          [30, 52, 30, 60],
          [90, 52, 90, 60],
        ])}
        <Node x={30} y={22} r={8} fill={mint} />
        <Node x={18} y={46} r={7} />
        <Node x={42} y={46} r={7} />
        <Node x={90} y={22} r={8} fill={mint} />
        <Node x={78} y={46} r={7} />
        <Node x={102} y={46} r={7} />
      </>
    ),
  },
  17: {
    who: "honk",
    outfit: "butterfly",
    pose: "wave",
    doodle: (
      <>
        <path d="M42 22C56 22 64 40 65 56C66 74 56 86 42 87C28 86 18 74 19 56C20 40 28 22 42 22Z" fill="var(--goose)" />
        <path d="M20 56C26 50 30 58 35 52C40 46 44 56 49 50C54 45 58 54 64 52" fill="none" strokeWidth="2.5" />
        <T x={42} y={76} s={16} fill="var(--ink)">
          C0
        </T>
        <Arrow x1={72} y1={56} x2={90} y2={56} />
        <T x={104} y={62} s={22}>
          C
        </T>
      </>
    ),
  },
  18: {
    who: "chonk",
    outfit: "cozy",
    doodle: (
      <>
        <rect x="10" y="12" width="44" height="78" fill="var(--goose)" />
        <rect x="10" y="12" width="44" height="18" fill={sky} strokeWidth="2.5" />
        <rect x="10" y="30" width="44" height="18" fill={sky} strokeWidth="2.5" />
        <T x={32} y={104} s={11}>
          stack
        </T>
        <rect x="66" y="16" width="26" height="18" fill={pink} strokeWidth="2.5" />
        <rect x="74" y="50" width="34" height="18" fill={gold} strokeWidth="2.5" />
        <T x={88} y={104} s={11}>
          heap
        </T>
        <Arrow x1={40} y1={39} x2={64} y2={26} />
        <Arrow x1={40} y1={22} x2={72} y2={58} bend={0.2} />
      </>
    ),
  },
  19: {
    who: "honk",
    outfit: "frankenstein",
    pose: "think",
    doodle: (
      <>
        <rect x="10" y="20" width="20" height="20" fill={gold} strokeWidth="2.5" />
        <T x={20} y={56} s={11}>
          char
        </T>
        <rect x="40" y="20" width="70" height="20" fill={sky} strokeWidth="2.5" />
        <path d="M57.5 20V40M75 20V40M92.5 20V40" {...thin} />
        <T x={75} y={56} s={11}>
          int: 4 bytes
        </T>
        <rect x="10" y="68" width="100" height="20" fill={pink} strokeWidth="2.5" />
        <T x={60} y={83} s={11} fill="var(--ink)">
          size_t
        </T>
      </>
    ),
  },
  20: {
    who: "chonk",
    outfit: "hero",
    doodle: (
      <>
        <rect x="24" y="22" width="64" height="58" rx="6" fill="#3b3f46" />
        <rect x="34" y="32" width="44" height="38" fill="#1d2a22" strokeWidth="2" />
        <path d="M40 44H60M44 52H70M40 60H56" fill="none" stroke="#7cc576" strokeWidth="3" />
        <path
          d="M32 22V12M48 22V12M64 22V12M80 22V12M32 80V90M48 80V90M64 80V90M80 80V90M24 36H14M24 52H14M24 66H14M88 36H98M88 52H98M88 66H98"
          fill="none"
          strokeWidth="2.5"
        />
      </>
    ),
  },
  21: {
    who: "honk",
    outfit: "irish",
    doodle: (
      <>
        {edges([
          [20, 20, 56, 30],
          [20, 20, 30, 62],
          [56, 30, 30, 62],
          [56, 30, 70, 76],
        ])}
        <Node x={20} y={20} fill={gold} label="A" />
        <Node x={56} y={30} fill={pink} label="B" />
        <Node x={30} y={62} fill={sky} label="C" />
        <Node x={70} y={76} fill={mint} label="D" />
        <T x={102} y={30} s={11}>
          A: B C
        </T>
        <T x={102} y={46} s={11}>
          B: A C D
        </T>
      </>
    ),
  },
  22: {
    who: "chonk",
    outfit: "winter",
    pose: "point",
    doodle: (
      <>
        {edges([
          [16, 50, 46, 22],
          [16, 50, 46, 78],
          [46, 22, 80, 22],
          [46, 78, 80, 50],
          [80, 22, 106, 50],
          [80, 50, 106, 50],
        ])}
        {edges(
          [
            [16, 50, 46, 22],
            [46, 22, 80, 22],
            [80, 22, 106, 50],
          ],
          { stroke: "var(--beak)", strokeWidth: 5 },
        )}
        <Node x={16} y={50} fill="var(--green)" />
        <Node x={46} y={22} />
        <Node x={46} y={78} />
        <Node x={80} y={22} />
        <Node x={80} y={50} />
        <Node x={106} y={50} fill="var(--heart)" />
      </>
    ),
  },
  23: {
    who: "honk",
    outfit: "pilgrim",
    doodle: (
      <>
        {edges(
          [
            [20, 24, 60, 18],
            [20, 24, 30, 70],
            [60, 18, 96, 34],
            [30, 70, 74, 80],
            [96, 34, 74, 80],
          ],
          { strokeDasharray: "4 5" },
        )}
        {edges(
          [
            [20, 24, 60, 18],
            [20, 24, 30, 70],
            [60, 18, 96, 34],
            [96, 34, 74, 80],
          ],
          { stroke: "var(--green)", strokeWidth: 5 },
        )}
        <Node x={20} y={24} fill={mint} />
        <Node x={60} y={18} fill={mint} />
        <Node x={96} y={34} fill={mint} />
        <Node x={30} y={70} fill={mint} />
        <Node x={74} y={80} fill={mint} />
      </>
    ),
  },
  24: {
    who: "chonk",
    outfit: "party",
    pose: "dance",
    doodle: (
      <>
        {edges([
          [30, 26, 16, 58],
          [30, 26, 44, 58],
          [86, 34, 86, 66],
        ])}
        <Node x={30} y={26} fill={pink} />
        <Node x={16} y={58} fill={pink} />
        <Node x={44} y={58} fill={pink} />
        <Node x={86} y={34} fill={sky} />
        <Node x={86} y={66} fill={sky} />
        <Arrow x1={78} y1={30} x2={42} y2={22} bend={0.25} />
        <T x={60} y={92} s={13}>
          union!
        </T>
      </>
    ),
  },
  25: {
    who: "honk",
    outfit: "diva",
    doodle: (
      <>
        {edges([
          [60, 18, 34, 46],
          [60, 18, 86, 46],
          [34, 46, 20, 76],
          [34, 46, 48, 76],
          [86, 46, 100, 76],
        ])}
        <Node x={60} y={18} r={10} fill={gold} label={1} />
        <Node x={34} y={46} r={10} label={4} />
        <Node x={86} y={46} r={10} label={2} />
        <Node x={20} y={76} r={10} label={9} />
        <Node x={48} y={76} r={10} label={7} />
        <Node x={100} y={76} r={10} label={5} />
      </>
    ),
  },
  26: {
    who: "chonk",
    outfit: "sleepy",
    doodle: (
      <>
        {edges([
          [60, 20, 34, 50],
          [60, 20, 86, 50],
          [34, 50, 20, 80],
        ])}
        <Node x={60} y={20} r={10} fill={pink} label={9} />
        <Node x={34} y={50} r={10} fill={mint} label={3} />
        <Node x={86} y={50} r={10} label={6} />
        <Node x={20} y={80} r={10} label={8} />
        <path d="M74 18C86 22 92 34 88 42" fill="none" strokeWidth="2.5" />
        <path d="M84 36L88 42L92 36" fill="none" strokeWidth="2.5" />
        <T x={104} y={20} s={13}>
          swap
        </T>
      </>
    ),
  },
};

export function LectureArt({ n }: { n: number }) {
  const s = scenes[n];
  if (!s) return null;
  return (
    <div className="lc-art" aria-hidden="true">
      <svg viewBox="0 0 120 106" className="lc-doodle" {...ink}>
        <defs>
          <Wobble id={`lc-wobble-${n}`} scale={2} />
        </defs>
        <g filter={`url(#lc-wobble-${n})`}>{s.doodle}</g>
      </svg>
      {s.who === "honk" ? (
        <Honk className="lc-mascot" decorative outfit={s.outfit} pose={s.pose} flip />
      ) : (
        <Chonk className="lc-mascot lc-chonk" decorative outfit={s.outfit} pose={s.pose} flip />
      )}
    </div>
  );
}
