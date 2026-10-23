// Costumes for Honk and Chonk. Honk's come from the photos on the 15-122 staff page, which shows a new one on
// every refresh. Chonk's are new. Each look is a few layers that the mascot draws in order.

// Honk's shirt, also used to clip stripes to it.
export const honkShirt =
  "M72 122C87 113 136 113 150 124C162 132 168 146 171 160C159 165 152 161 149 156C154 180 158 206 156 224C130 233 94 233 66 224C64 206 68 180 72 156C68 160 60 165 49 160C54 146 60 132 72 122Z";

// Chonk's puffy body, also used to clip the safety vest to it.
export const chonkBody =
  "M140 142Q157.7 134.4 172.1 147.3Q191.3 145.8 201.1 162.6Q219.9 167.3 224.1 186.5Q240.7 196.9 238.9 216.6Q251.6 231.7 244 250Q251.6 268.3 238.9 283.3Q240.7 302.8 224.1 312.6Q219.9 330.2 201.1 332.9Q191.3 346.4 172.1 342.6Q157.7 352.4 140 345Q122.3 352.4 107.9 342.6Q88.7 346.4 78.9 332.9Q60.1 330.2 55.9 312.6Q39.3 302.8 41.1 283.3Q28.4 268.3 36 250Q28.4 231.7 41.1 216.6Q39.3 196.9 55.9 186.5Q60.1 167.3 78.9 162.6Q88.7 145.8 107.9 147.3Q122.3 134.4 140 142Z";

export type Look = {
  name: string;
  // Fill for Honk's shirt. Leave it out to keep the grey "I ♥ 15-122" shirt and its lettering.
  shirt?: string;
  // Honk wears no shirt at all.
  bare?: boolean;
  // Hide the eye, for sunglasses and sleepy eyes (draw the replacement in head).
  noEye?: boolean;
  back?: React.ReactNode; // behind everything
  body?: React.ReactNode; // on the shirt or body
  collar?: React.ReactNode; // on top of the neck
  head?: React.ReactNode; // turns with the head
  front?: React.ReactNode; // held in front
  // Hand-lettered words, kept readable when the mascot is flipped.
  words?: { x: number; y: number; text: string; size?: number; fill?: string }[];
};

const gold = "#f5c542";
const purple = "#8a5cc2";
const lilac = "#c9a8ec";
const green = "#3f9a4f";
const black = "#2e2f2c";
const sky = "#9fd3f2";
const thin = { fill: "none", strokeWidth: 2 };

// A four-point sparkle star centered on (x, y).
function star(x: number, y: number, r: number) {
  const k = r * 0.32;
  return `M${x} ${y - r}L${x + k} ${y - k}L${x + r} ${y}L${x + k} ${y + k}L${x} ${y + r}L${x - k} ${y + k}L${x - r} ${y}L${x - k} ${y - k}Z`;
}

// A small rubber duck sitting at (x, y), facing left.
function Duck({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} strokeWidth="2.2">
      <path d="M-10 0C-12 -10 2 -12 6 -6C10 -9 14 -8 13 -4C14 4 6 8 -2 8C-8 8 -10 4 -10 0Z" fill={gold} />
      <circle cx="-6" cy="-12" r="6.5" fill={gold} />
      <path d="M-12 -12L-18 -10L-12 -8Z" fill="var(--beak)" />
    </g>
  );
}

// Honk's purple bug hood with two antennae, worn as a butterfly, at karaoke and at the Fence.
const hood = (
  <>
    <path
      d="M84 50C80 30 96 16 114 18C132 20 142 36 138 54C136 64 130 72 124 77C126 60 122 40 108 34C98 32 88 40 84 50Z"
      fill={purple}
    />
    <path d="M104 21C100 12 93 8 86 8M119 21C125 12 132 8 140 8" fill="none" strokeWidth="2.5" />
    <circle cx="85" cy="8" r="4.5" fill={purple} />
    <circle cx="141" cy="8" r="4.5" fill={purple} />
  </>
);

const ribbon = (
  <>
    <path d="M110 124L95 116L97 133ZM110 124L125 116L123 133Z" fill={lilac} strokeWidth="2.5" />
    <path d="M108 126L100 146M112 126L120 146" fill="none" stroke={lilac} strokeWidth="3" />
  </>
);

// Rainbow clown wig, also worn by the rockstar.
const wig = (
  <g strokeWidth="2.5">
    <circle cx="136" cy="42" r="9" fill="#a77bd6" />
    <circle cx="131" cy="27" r="10" fill={sky} />
    <circle cx="119" cy="17" r="10" fill="#7ccf6a" />
    <circle cx="104" cy="17" r="10" fill={gold} />
    <circle cx="92" cy="27" r="10" fill="var(--heart)" />
  </g>
);

const pilgrimHat = (
  <>
    <path d="M92 28L96 3L126 3L130 28Z" fill={black} />
    <path d="M93 20L129 20L130 27L92 27Z" fill="#6b4a2f" strokeWidth="2.5" />
    <rect x="104" y="18" width="14" height="11" fill="none" stroke={gold} strokeWidth="3" />
    <path d="M78 30C90 22 130 22 142 30C130 36 90 36 78 30Z" fill={black} />
  </>
);

const whiteCollar = (
  <path d="M76 124C90 118 132 118 146 124L140 142C128 136 120 134 111 140C102 134 94 136 82 142Z" fill="var(--goose)" />
);

function Leaf({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`} strokeWidth="2">
      <path d="M0 -10C7 -5 7 4 0 10C-7 4 -7 -5 0 -10Z" fill={fill} />
      <path d="M0 -8V12" fill="none" />
    </g>
  );
}

// Strings of pearls for the diva, following the neckline.
const pearls = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10;
  return { x: 86 + 50 * t, y: 122 + 22 * Math.sin(Math.PI * t) };
});

export const honkLooks = {
  love: { name: "I ♥ 15-122" },
  butterfly: {
    name: "Butterfly",
    shirt: purple,
    back: (
      <g strokeWidth="3">
        <path d="M148 140C160 104 206 98 210 126C214 150 186 162 154 160Z" fill="#f4a3c8" />
        <path d="M156 146C166 122 196 118 198 134C200 148 182 154 160 154Z" fill={gold} strokeWidth="2" />
        <path d="M150 166C178 160 202 176 196 196C190 214 164 206 150 186Z" fill="#9be37a" />
        <path d="M156 172C174 170 188 180 184 192C180 202 166 196 158 184Z" fill={sky} strokeWidth="2" />
      </g>
    ),
    head: hood,
  },
  irish: {
    name: "Leprechaun",
    shirt: green,
    body: <path d="M110 124L95 116L97 133ZM110 124L125 116L123 133Z" fill="#a7d86d" strokeWidth="2.5" />,
    head: (
      <>
        <path
          d="M86 62C88 75 96 85 108 87C118 88 126 82 129 73C122 78 114 76 110 70C104 72 94 70 90 64Z"
          fill="#e0742f"
          strokeWidth="2.5"
        />
        <path d="M93 28L96 6L126 6L128 27Z" fill={green} />
        <path d="M93 21L127 21L127.5 27C116 29 102 29 93 27Z" fill={black} strokeWidth="2.5" />
        <rect x="105" y="20" width="10" height="8" fill={gold} strokeWidth="2" />
        <path d="M80 30C90 24 128 22 138 28C134 34 86 36 80 30Z" fill={green} />
      </>
    ),
    front: (
      <g strokeWidth="2.5">
        <circle cx="147" cy="196" r="5" fill={gold} />
        <circle cx="158" cy="192" r="5" fill={gold} />
        <circle cx="168" cy="197" r="5" fill={gold} />
        <path d="M136 200C136 222 144 232 156 232C168 232 176 222 176 200Z" fill={black} />
        <ellipse cx="156" cy="200" rx="21" ry="5" fill={black} />
      </g>
    ),
  },
  berry: {
    name: "Strawberry",
    shirt: "#e0473f",
    body: (
      <>
        <g fill="#f7d154" strokeWidth="1.5">
          {[
            [88, 152],
            [112, 146],
            [136, 154],
            [80, 182],
            [104, 176],
            [128, 180],
            [150, 188],
            [92, 207],
            [118, 206],
            [142, 212],
          ].map(([x, y]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="2.5" ry="4" />
          ))}
        </g>
        <path
          d="M70 128L84 141L88 124L100 139L110 122L120 139L132 124L136 141L152 128L146 118C130 110 92 110 76 118Z"
          fill="#4caf50"
        />
      </>
    ),
    head: (
      <>
        <path d="M109 17L111 6" fill="none" />
        <path d="M90 30L96 18L104 26L110 14L116 26L124 18L130 30C116 35 102 35 90 30Z" fill="#4caf50" />
      </>
    ),
  },
  pumpkin: {
    name: "Pumpkin",
    shirt: "#f7a23c",
    body: (
      <>
        <path d="M92 124C84 160 84 200 92 230M130 124C138 160 138 200 130 230" {...thin} />
        <g fill="#5a3412" strokeWidth="2">
          <path d="M86 162L97 146L104 163Z" />
          <path d="M118 163L125 146L136 162Z" />
          <path d="M82 184L93 191L100 183L109 194L117 183L124 191L138 183C133 206 88 208 82 184Z" />
        </g>
      </>
    ),
    head: (
      <>
        <path d="M106 21L107 9L114 9L113 21Z" fill="#4caf50" strokeWidth="2.5" />
        <path d="M90 30C88 18 132 16 132 30C120 36 102 36 90 30Z" fill="#f7a23c" />
        <path d="M104 22C102 26 102 30 104 34M118 22C120 26 120 30 118 34" {...thin} />
      </>
    ),
  },
  pilgrim: {
    name: "Pilgrim",
    shirt: "#3d4560",
    back: (
      <>
        <Leaf x={28} y={92} r={-30} fill="#e0742f" />
        <Leaf x={190} y={78} r={40} fill="#d94a3a" />
        <Leaf x={20} y={150} r={60} fill={gold} />
        <Leaf x={200} y={210} r={-50} fill="#e0742f" />
      </>
    ),
    body: whiteCollar,
    head: pilgrimHat,
  },
  thanksgiving: {
    name: "Thanksgiving",
    shirt: "#6b4a2f",
    body: (
      <>
        {whiteCollar}
        <path d="M67 190C96 197 126 197 155 190L156 203C126 210 96 210 66 203Z" fill={black} strokeWidth="2.5" />
        <rect x="100" y="190" width="21" height="16" fill="none" stroke={gold} strokeWidth="3" />
      </>
    ),
    head: pilgrimHat,
    front: (
      <g strokeWidth="2.5">
        <ellipse cx="44" cy="216" rx="27" ry="7" fill="var(--goose)" />
        <path d="M24 212C24 200 64 200 64 212C58 216 30 216 24 212Z" fill="#d98b3a" />
        <path d="M28 206C34 202 54 202 60 206" {...thin} />
      </g>
    ),
  },
  shore: {
    name: "Day at the shore",
    back: (
      <>
        <circle cx="30" cy="24" r="11" fill={gold} strokeWidth="2.5" />
        <path d="M30 4V8M30 40V44M10 24H14M46 24H50M16 10L19 13M44 10L41 13" {...thin} />
        <path d="M150 208C160 202 170 214 180 208S200 214 210 208" fill="none" stroke={sky} strokeWidth="3" />
        <path d="M0 238C40 224 180 224 220 238L220 258L0 258Z" fill="#ecd59a" strokeWidth="2.5" />
        <path d="M34 240L190 234L198 252L24 256Z" fill="var(--goose)" />
        <path d="M30 248L194 242" fill="none" stroke={sky} strokeWidth="5" />
      </>
    ),
    head: (
      <g strokeWidth="2.5">
        <path d="M92 25C100 21 114 21 124 25" fill="none" />
        <ellipse cx="99" cy="25" rx="7" ry="4.5" fill={black} />
        <ellipse cx="117" cy="24" rx="7" ry="4.5" fill={black} />
      </g>
    ),
  },
  piada: {
    name: "Dinner out",
    shirt: green,
    body: (
      <>
        <path d="M96 128L111 152L126 128L127 224C116 228 106 228 95 224Z" fill="#a7d86d" strokeWidth="2.5" />
        <path d="M110 124L97 117L98 132ZM110 124L123 117L122 132Z" fill="#1f6a2e" strokeWidth="2.5" />
      </>
    ),
    collar: (
      <>
        <path d="M120 126L127 148L137 144L130 122Z" fill="#e0742f" strokeWidth="2.5" />
        <path d="M86 110C100 120 122 120 134 110L136 122C122 132 98 132 84 122Z" fill="#e0742f" strokeWidth="2.5" />
      </>
    ),
    head: (
      <>
        <path d="M88 32C86 14 132 12 134 30Z" fill={green} />
        <path d="M80 32C94 26 128 26 142 30C130 38 94 38 80 32Z" fill={green} />
      </>
    ),
    front: (
      <g strokeWidth="2.5">
        <path d="M180 206L186 176M183 177L181 168M187 178L188 169" fill="none" />
        <path d="M134 204C134 230 182 230 182 204Z" fill="var(--goose)" />
        <path
          d="M140 204C144 194 148 210 152 199C156 190 160 208 164 197C168 190 172 204 177 201"
          fill="none"
          stroke="#e8b84a"
          strokeWidth="3.5"
        />
        <ellipse cx="158" cy="204" rx="24" ry="5" fill="none" />
      </g>
    ),
  },
  clown: {
    name: "Clown",
    shirt: "#5bb5e8",
    body: (
      <>
        <g strokeWidth="2.5">
          <rect x="78" y="150" width="20" height="20" fill="#7ccf6a" transform="rotate(-8 88 160)" />
          <rect x="124" y="176" width="20" height="20" fill={gold} transform="rotate(6 134 186)" />
          <rect x="92" y="198" width="18" height="18" fill="var(--heart)" transform="rotate(4 101 207)" />
        </g>
        <g strokeWidth="2.5">
          {[gold, "var(--heart)", "#7ccf6a", gold, "var(--heart)", "#7ccf6a"].map((fill, i) => (
            <circle key={i} cx={81 + i * 12} cy={122 + (i % 2) * 2} r="7.5" fill={fill} />
          ))}
        </g>
      </>
    ),
    head: (
      <>
        {wig}
        <circle cx="53" cy="61" r="7.5" fill="var(--heart)" strokeWidth="2.5" />
      </>
    ),
  },
  umpire: {
    name: "Umpire",
    shirt: "var(--goose)",
    body: (
      <>
        <g clipPath="url(#honk-shirt-clip)" stroke="none" fill={black}>
          {[70, 92, 114, 136, 158].map((x) => (
            <rect key={x} x={x} y="110" width="11" height="130" />
          ))}
        </g>
        <path d={honkShirt} fill="none" />
        <path
          d="M95 121C98 138 104 148 108 157M126 121C124 138 118 148 113 157"
          fill="none"
          stroke="#4caf50"
          strokeWidth="3"
        />
        <rect x="102" y="155" width="17" height="10" rx="3" fill="var(--shirt)" strokeWidth="2.5" />
      </>
    ),
    head: (
      <>
        <path d="M84 36C82 18 104 10 120 16C132 20 138 32 136 40C120 36 100 36 84 36Z" fill={black} />
        <path d="M88 36C74 34 62 36 58 40C66 45 80 45 92 42Z" fill={black} />
        <circle cx="110" cy="14" r="2.5" fill={black} strokeWidth="2" />
      </>
    ),
  },
  frankenstein: {
    name: "Frankenstein",
    shirt: "#3c3f3a",
    body: (
      <g fill="#8a8d88" strokeWidth="2.5">
        <path d="M92 120L104 172L84 150L72 124Z" />
        <path d="M130 120L118 172L138 150L150 124Z" />
      </g>
    ),
    head: (
      <>
        <g fill="var(--shirt)" strokeWidth="2.5">
          <rect x="79" y="84" width="9" height="8" />
          <rect x="120" y="86" width="9" height="8" />
        </g>
        <path
          d="M86 37L84 22L92 26L96 13L102 24L108 11L114 24L120 13L124 26L132 20L135 39C120 33 100 33 86 37Z"
          fill="#7cc576"
        />
        <path d="M113 42L127 46M116 40L114 46M122 42L120 48" fill="none" strokeWidth="2" />
      </>
    ),
  },
  drink: {
    name: "Pumpkin spice",
    shirt: "#ee8a2c",
    body: <path d="M84 126L88 142M98 121L100 138M112 121V138M126 121L124 138M138 126L134 142" {...thin} />,
    head: (
      <>
        <path d="M104 22L93 14L93 30ZM104 22L115 14L115 30Z" fill="#4caf50" strokeWidth="2.5" />
        <circle cx="104" cy="22" r="3.5" fill="#4caf50" strokeWidth="2" />
      </>
    ),
    front: (
      <g strokeWidth="2.5">
        <path d="M170 168L180 140" fill="none" strokeWidth="4" />
        <path d="M150 168L182 168L178 222L154 222Z" fill="#f4ebdd" />
        <path d="M151.5 182L180.5 182L178 222L154 222Z" fill="#c69c6d" />
        <ellipse cx="166" cy="168" rx="18" ry="4" fill="var(--goose)" />
        <path
          d="M24 228C18 220 26 210 34 214C40 206 52 210 50 220C56 226 50 236 40 234C34 240 22 236 24 228Z"
          fill="#e08a36"
        />
        <path d="M32 222L34 220M40 226L42 224M36 230L38 228" fill="none" stroke="#4caf50" />
      </g>
    ),
  },
  inclass: {
    name: "In lecture",
    bare: true,
    front: (
      <g strokeWidth="3">
        <rect x="58" y="166" width="106" height="58" rx="4" fill="#3b3f46" />
        <rect x="65" y="173" width="92" height="44" fill="#1d2a22" strokeWidth="2" />
        <path d="M72 183H98M80 193H120M80 203H108M72 211H90" fill="none" stroke="#7cc576" strokeWidth="3" />
        <path d="M102 183H118M112 203H140" fill="none" stroke="var(--beak)" strokeWidth="3" />
        <path d="M48 224L174 224L184 234L38 234Z" fill="var(--shirt)" />
      </g>
    ),
  },
  karaoke: {
    name: "Karaoke night",
    shirt: purple,
    back: (
      <g stroke="var(--edge)">
        <path d="M24 34V14L42 10V30" fill="none" strokeWidth="2.5" />
        <ellipse cx="20" cy="34" rx="5" ry="4" fill="var(--edge)" />
        <ellipse cx="38" cy="30" rx="5" ry="4" fill="var(--edge)" />
        <path d="M190 74V56" fill="none" strokeWidth="2.5" />
        <ellipse cx="186" cy="75" rx="5" ry="4" fill="var(--edge)" />
      </g>
    ),
    body: ribbon,
    head: hood,
    front: (
      <g>
        <path d="M72 98L90 150" fill="none" strokeWidth="8" />
        <circle cx="68" cy="88" r="11" fill={black} />
        <path d="M60 84L76 92M62 92L74 82" fill="none" stroke="#777" strokeWidth="1.5" />
      </g>
    ),
  },
  diva: {
    name: "Diva",
    shirt: black,
    noEye: true,
    body: (
      <g fill="var(--goose)" strokeWidth="1.8">
        {pearls.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.6" />
        ))}
      </g>
    ),
    head: (
      <>
        <path d="M90 27L94 13L100 22L108 6L116 22L122 13L126 27Z" fill="#dfe3e8" strokeWidth="2.5" />
        <circle cx="108" cy="13" r="2.5" fill="#f4a3c8" strokeWidth="1.5" />
        <path d="M86 42C88 35 116 35 121 42C121 51 113 55 104 54C94 53 86 49 86 42Z" fill="#1d1d1d" />
        <path d="M121 42L136 45" fill="none" strokeWidth="3" />
        <path d="M94 41L100 39" fill="none" stroke="#fff" strokeWidth="2" />
      </>
    ),
  },
  takeoff: {
    name: "Takeoff",
    shirt: "var(--goose)",
    back: (
      <g strokeWidth="3">
        <rect x="150" y="38" width="58" height="80" rx="27" fill="#d8ebf8" />
        <path
          d="M162 92C162 84 172 82 176 86C180 78 194 80 194 90C200 92 198 100 192 100L166 100C160 100 158 94 162 92Z"
          fill="#fff"
          strokeWidth="2"
        />
      </g>
    ),
    body: (
      <g fill="#7a5233" strokeWidth="3">
        <path d="M72 122C80 118 90 118 96 120L104 229C90 229 76 227 66 224C64 206 68 180 72 156Z" />
        <path d="M150 124C142 118 132 118 126 120L118 229C132 229 146 227 156 224C158 206 154 180 150 156Z" />
      </g>
    ),
    head: (
      <>
        <path d="M89 27C88 12 132 10 133 27Z" fill={black} />
        <path d="M76 28C92 22 128 22 144 28C128 35 92 35 76 28Z" fill={black} />
      </>
    ),
  },
  fence: {
    name: "At the Fence",
    shirt: purple,
    back: (
      <g strokeWidth="2.5">
        {["#f4a3c8", gold, sky, "#9be37a", "#f4a3c8", gold, sky, "#9be37a", "#f4a3c8", gold].map((fill, i) => {
          const x = i * 22;
          return <path key={i} d={`M${x + 1} 240V162L${x + 11} 152L${x + 21} 162V240Z`} fill={fill} />;
        })}
      </g>
    ),
    body: ribbon,
    head: hood,
  },
  valentine: {
    name: "Valentine",
    shirt: black,
    back: (
      <>
        <path d="M78 120C62 160 42 200 30 238L194 238C182 200 162 160 146 120Z" fill="#c8322b" />
        <Duck x={30} y={244} />
        <Duck x={196} y={244} />
      </>
    ),
    body: (
      <g fill="var(--heart)" strokeWidth="1.5">
        {[
          [86, 150],
          [138, 146],
          [80, 206],
          [146, 210],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} transform={`translate(${x} ${y})`} d="M0 5C-7 0-6-6 0-3C6-6 7 0 0 5Z" />
        ))}
      </g>
    ),
    head: (
      <>
        <path d="M86 34C84 16 104 10 118 14C132 18 140 30 136 42C120 36 100 34 86 34Z" fill={black} />
        <circle cx="116" cy="12" r="5" fill="var(--heart)" strokeWidth="2.5" />
      </>
    ),
    front: <path transform="translate(111 186)" d="M0 26C-34 2-30-26 0-12C30-26 34 2 0 26Z" fill="var(--heart)" />,
    words: [{ x: 111, y: 186, text: "be mine", size: 13, fill: "#fff" }],
  },
  rockstar: {
    name: "Rockstar",
    shirt: "var(--goose)",
    collar: (
      <g strokeWidth="2.5">
        <path d="M88 112C100 121 122 121 134 112L136 124C122 133 98 133 84 124Z" fill="#f4a3c8" />
        <path d="M96 118L94 128M110 120V130M124 118L126 128" fill="none" stroke={sky} strokeWidth="4" />
      </g>
    ),
    head: wig,
    front: (
      <g transform="translate(56 204) rotate(-25)" strokeWidth="2.5">
        <rect x="46" y="-4" width="62" height="8" fill="#6b4a2f" />
        <rect x="106" y="-7" width="14" height="14" rx="2" fill="#6b4a2f" />
        <path d="M2 0C2 -19 26 -19 27 -9C31 -15 47 -14 47 0C47 14 31 15 27 9C26 19 2 19 2 0Z" fill="#c98a4b" />
        <circle cx="30" cy="0" r="5" fill={black} strokeWidth="2" />
        <path d="M12 -2H118M12 2H118" fill="none" stroke="#eee" strokeWidth="1" />
      </g>
    ),
  },
} satisfies Record<string, Look>;

export type HonkOutfit = keyof typeof honkLooks;

export const chonkLooks = {
  plain: { name: "Just Chonk" },
  sleepy: {
    name: "Nap time",
    noEye: true,
    head: (
      <>
        <path
          d="M106 46C108 24 128 12 152 12C178 12 196 24 200 46C212 54 220 66 224 82C220 86 212 84 210 78C206 66 202 58 198 54Z"
          fill="#7aa6d8"
        />
        <path d="M106 44C132 36 170 36 198 44L200 55C172 47 132 47 104 55Z" fill="var(--goose)" />
        <circle cx="222" cy="86" r="9" fill="var(--goose)" />
        <path d="M129 60Q138 69 147 60" fill="none" strokeWidth="3.5" />
      </>
    ),
    front: (
      <g>
        <path
          d="M84 238C80 222 92 214 104 216L176 216C190 214 200 224 196 240L196 290C200 304 188 312 176 310L104 310C90 312 80 302 84 290Z"
          fill="#cfe3f7"
        />
        <path d="M92 222L100 230M188 222L180 230M92 304L100 296M188 304L180 296" {...thin} />
      </g>
    ),
    words: [
      { x: 214, y: 46, text: "z", size: 26, fill: "var(--edge)" },
      { x: 236, y: 26, text: "Z", size: 34, fill: "var(--edge)" },
    ],
  },
  chef: {
    name: "Chef",
    body: (
      <>
        <path d="M108 198L120 150M172 198L162 150" fill="none" strokeWidth="2.5" />
        <path d="M100 196C126 190 154 190 180 196L190 332C160 344 120 344 90 332Z" fill="var(--goose)" />
        <path d="M120 270H160V292C150 298 130 298 120 292Z" fill="none" strokeWidth="2.5" />
      </>
    ),
    head: (
      <>
        <path
          d="M120 36C106 32 106 16 120 16C122 8 136 6 142 12C148 4 164 6 166 14C180 10 192 24 182 36Z"
          fill="var(--goose)"
        />
        <path d="M118 52C138 46 164 46 184 52L182 34L120 34Z" fill="var(--goose)" />
        <path d="M140 36L138 48M162 36L164 48" {...thin} />
      </>
    ),
    front: (
      <g transform="rotate(18 64 250)">
        <rect x="60" y="214" width="8" height="90" rx="4" fill="#c58b52" />
        <ellipse cx="64" cy="204" rx="13" ry="18" fill="#d9a066" />
      </g>
    ),
  },
  grad: {
    name: "Graduation day",
    head: (
      <>
        <path d="M118 40C128 30 174 30 184 40L182 52C170 44 132 44 120 52Z" fill={black} />
        <path d="M96 34L152 16L208 30L152 48Z" fill={black} />
        <path d="M152 32C176 34 196 36 204 40L206 64" fill="none" stroke={gold} strokeWidth="3.5" />
        <path d="M201 62L211 62L213 78L199 78Z" fill={gold} strokeWidth="2.5" />
        <circle cx="152" cy="32" r="3.5" fill={gold} strokeWidth="2" />
      </>
    ),
    front: (
      <g transform="rotate(-32 66 262)">
        <rect x="24" y="252" width="84" height="20" rx="10" fill="var(--goose)" />
        <ellipse cx="104" cy="262" rx="5" ry="10" fill="var(--goose)" strokeWidth="2.5" />
        <rect x="60" y="249" width="11" height="26" fill="var(--heart)" strokeWidth="2.5" />
      </g>
    ),
  },
  wizard: {
    name: "Wizard",
    back: (
      <g fill={gold} strokeWidth="2">
        <path d={star(36, 92, 10)} />
        <path d={star(248, 128, 8)} />
      </g>
    ),
    head: (
      <>
        <path d="M114 44C124 30 140 16 158 10C176 4 196 4 214 12C202 14 192 22 188 44Z" fill="#3a4fa0" />
        <ellipse cx="152" cy="46" rx="56" ry="9" fill="#3a4fa0" />
        <g fill={gold} strokeWidth="2">
          <path d={star(148, 30, 7)} />
          <path d={star(176, 22, 6)} />
          <path d={star(172, 37, 4)} />
        </g>
      </>
    ),
    front: (
      <g>
        <path d="M40 300L84 222" fill="none" strokeWidth="6" />
        <path d={star(87, 216, 14)} fill={gold} strokeWidth="2.5" />
        <path d="M100 196L106 190M70 198L64 192M104 226L112 228" fill="none" strokeWidth="2.5" />
      </g>
    ),
  },
  winter: {
    name: "Pittsburgh winter",
    back: (
      <g fill="none" stroke={sky} strokeWidth="2.5">
        {[
          [30, 50],
          [246, 116],
          [36, 176],
          [254, 296],
          [26, 336],
        ].map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d={`M${x} ${y - 8}V${y + 8}M${x - 7} ${y - 4}L${x + 7} ${y + 4}M${x - 7} ${y + 4}L${x + 7} ${y - 4}`}
          />
        ))}
      </g>
    ),
    collar: (
      <>
        <path d="M160 152L150 222L174 224L180 152Z" fill="#d9483b" />
        <path d="M152 224L150 234M158 225V235M166 225V235M172 224L174 234" {...thin} />
        <path d="M104 128C128 142 170 142 192 128L196 148C170 164 126 164 100 148Z" fill="#d9483b" />
        <path
          d="M122 140L120 156M141 144V160M160 144V160M178 140L180 156"
          fill="none"
          stroke="var(--goose)"
          strokeWidth="4"
        />
      </>
    ),
    head: (
      <>
        <path d="M106 50C104 28 126 16 152 16C178 16 200 28 198 50Z" fill="#d9483b" />
        <path d="M130 22V44M152 18V42M174 22V44" {...thin} />
        <path d="M102 46C132 40 170 40 202 46L202 58C170 52 132 52 102 58Z" fill="var(--goose)" />
        <circle cx="152" cy="17" r="9" fill="var(--goose)" />
      </>
    ),
  },
  detective: {
    name: "Bug hunter",
    head: (
      <>
        <path d="M108 46C96 44 84 48 80 54C90 58 104 56 112 52Z" fill="#b08a5a" />
        <path d="M196 46C206 46 214 52 216 58C206 60 198 56 194 52Z" fill="#b08a5a" />
        <path d="M106 50C104 26 128 16 152 16C178 16 200 28 198 50Z" fill="#b08a5a" />
        <path
          d="M122 22L130 50M141 17L146 48M162 17L160 48M182 24L176 50M107 36C130 30 176 30 199 36"
          fill="none"
          stroke="#6b4a2f"
          strokeWidth="1.8"
        />
      </>
    ),
    front: (
      <g>
        <path d="M82 244L106 278" fill="none" strokeWidth="11" />
        <path d="M82 244L106 278" fill="none" stroke="#7a5233" strokeWidth="5" />
        <circle cx="64" cy="224" r="25" fill="#e3f3fb" strokeWidth="5" />
        <g strokeWidth="2">
          <path d="M58 218L54 212M70 218L74 212" fill="none" />
          <circle cx="64" cy="230" r="8" fill="var(--heart)" />
          <path d="M64 222V238" fill="none" />
          <circle cx="64" cy="221" r="4" fill={black} />
        </g>
      </g>
    ),
  },
  builder: {
    name: "Data structure builder",
    body: (
      <>
        <g clipPath="url(#chonk-body-clip)" stroke="none">
          <path d="M20 140H116L112 360H20ZM264 140H164L168 360H264Z" fill="#f28c28" />
          <path d="M20 248H114M166 248H264" stroke="#e8edf0" strokeWidth="9" />
        </g>
        <path d="M116 150L112 345M164 150L168 345" fill="none" strokeWidth="2.5" />
        <path d={chonkBody} fill="none" />
      </>
    ),
    head: (
      <>
        <path d="M106 48C104 24 128 14 152 14C178 14 200 26 198 48Z" fill={gold} />
        <path d="M152 14V46M136 16C130 26 128 38 130 46M168 16C174 26 176 38 174 46" {...thin} />
        <path d="M96 48C130 42 176 42 208 50L208 57C176 51 130 51 96 55Z" fill={gold} />
      </>
    ),
    front: (
      <g strokeWidth="3">
        <rect x="18" y="340" width="34" height="32" fill="#7ccf6a" />
        <rect x="54" y="340" width="34" height="32" fill={sky} />
        <rect x="36" y="306" width="34" height="32" fill="#f4a3c8" />
      </g>
    ),
    words: [
      { x: 35, y: 364, text: "2", size: 20 },
      { x: 71, y: 364, text: "3", size: 20 },
      { x: 53, y: 330, text: "1", size: 20 },
    ],
  },
  party: {
    name: "Party goose",
    back: (
      <g stroke="none">
        <rect x="40" y="80" width="8" height="5" fill="var(--heart)" transform="rotate(30 44 82)" />
        <rect x="236" y="100" width="8" height="5" fill={gold} transform="rotate(-20 240 102)" />
        <rect x="248" y="176" width="8" height="5" fill={sky} transform="rotate(50 252 178)" />
        <rect x="24" y="340" width="8" height="5" fill="#7ccf6a" transform="rotate(-40 28 342)" />
        <rect x="250" y="360" width="8" height="5" fill="#f4a3c8" transform="rotate(15 254 362)" />
      </g>
    ),
    head: (
      <>
        <path d="M128 42L178 38L162 10Z" fill={sky} />
        <g fill="var(--heart)" strokeWidth="1.5">
          <circle cx="150" cy="34" r="3" />
          <circle cx="164" cy="28" r="3" />
          <circle cx="160" cy="20" r="2.5" />
        </g>
        <circle cx="162" cy="11" r="5" fill={gold} strokeWidth="2.5" />
      </>
    ),
    front: (
      <g>
        <path d="M46 174C40 200 54 230 44 284" fill="none" strokeWidth="2" />
        <path d="M41 174L51 174L46 167Z" fill="var(--heart)" strokeWidth="2" />
        <ellipse cx="46" cy="144" rx="22" ry="26" fill="var(--heart)" />
        <path d="M36 132C38 126 42 124 46 124" fill="none" stroke="#fff" strokeWidth="3" />
      </g>
    ),
  },
  reader: {
    name: "Reading the handout",
    head: (
      <>
        <circle cx="138" cy="61" r="13" fill="none" strokeWidth="3" />
        <path d="M151 62L178 67" fill="none" strokeWidth="3" />
      </>
    ),
    front: (
      <g>
        <path
          d="M84 230L84 294C106 284 126 286 140 296C154 286 174 284 196 294L196 230"
          fill="none"
          stroke="var(--green)"
          strokeWidth="5"
        />
        <path
          d="M86 226C106 216 126 218 140 228C154 218 174 216 194 226L194 288C174 278 154 280 140 290C126 280 106 278 86 288Z"
          fill="var(--goose)"
        />
        <path d="M140 228V290" fill="none" strokeWidth="2.5" />
        <path
          d="M98 252C110 248 120 249 130 254M98 264C110 260 120 261 130 266M150 252C160 247 170 246 182 250M150 264C160 259 170 258 182 262"
          fill="none"
          stroke="#9a9a9a"
          strokeWidth="2.5"
        />
      </g>
    ),
    words: [{ x: 114, y: 244, text: "C0", size: 15, fill: "var(--green)" }],
  },
  hero: {
    name: "Super Chonk",
    back: <path d="M178 146C222 168 266 232 270 340C240 350 210 340 196 326Z" fill="#e0473f" />,
    body: <circle cx="140" cy="232" r="27" fill={gold} />,
    head: (
      <>
        <path d="M114 52C126 44 160 44 172 52L170 68C158 62 128 62 116 68Z" fill="#2f6fb3" />
        <path d="M171 54L192 48L188 62Z" fill="#2f6fb3" strokeWidth="2.5" />
      </>
    ),
    words: [{ x: 140, y: 254, text: "*", size: 52 }],
  },
  tidy: {
    name: "Garbage collector",
    back: (
      <g fill="#ddd8c6" strokeWidth="2">
        <circle cx="186" cy="404" r="7" />
        <circle cx="200" cy="398" r="5" />
      </g>
    ),
    head: (
      <>
        <path d="M196 44L214 36L210 50ZM196 48L212 60L200 60Z" fill="#2f6fb3" strokeWidth="2.5" />
        <path d="M106 50C104 26 128 16 152 16C178 16 200 28 198 50C172 42 132 42 106 50Z" fill="#2f6fb3" />
        <g fill="var(--goose)" strokeWidth="1.5">
          <circle cx="132" cy="28" r="3" />
          <circle cx="156" cy="24" r="3" />
          <circle cx="178" cy="32" r="3" />
          <circle cx="146" cy="38" r="3" />
        </g>
      </>
    ),
    front: (
      <g>
        <path d="M38 190L100 318" fill="none" strokeWidth="9" />
        <path d="M38 190L100 318" fill="none" stroke="#b07a45" strokeWidth="4" />
        <path d="M86 310L112 298L136 350C124 362 102 366 86 360Z" fill="#e8c35a" />
        <path d="M100 318L104 356M110 312L120 352" {...thin} />
      </g>
    ),
    words: [
      { x: 226, y: 392, text: "0", size: 16, fill: "var(--edge)" },
      { x: 246, y: 384, text: "1", size: 14, fill: "var(--edge)" },
    ],
  },
  cozy: {
    name: "Late-night coffee",
    head: (
      <>
        <path d="M112 66C108 30 130 14 156 14C182 14 202 32 198 70" fill="none" strokeWidth="10" />
        <path d="M112 66C108 30 130 14 156 14C182 14 202 32 198 70" fill="none" stroke="var(--green)" strokeWidth="4" />
        <ellipse cx="178" cy="82" rx="13" ry="18" fill="var(--green)" />
      </>
    ),
    front: (
      <g>
        <path d="M74 230C68 220 80 214 74 204M90 230C84 220 96 214 90 204" fill="none" strokeWidth="2.5" />
        <path d="M102 252C118 250 120 276 100 278" fill="none" strokeWidth="5" />
        <path d="M60 240L106 240L102 292C100 300 66 300 64 292Z" fill="var(--goose)" />
        <ellipse cx="83" cy="240" rx="23" ry="5" fill="#8a5a35" />
        <path
          transform="translate(83 266)"
          d="M0 8C-11 0-10-10 0-5C10-10 11 0 0 8Z"
          fill="var(--heart)"
          strokeWidth="2"
        />
      </g>
    ),
  },
} satisfies Record<string, Look>;

export type ChonkOutfit = keyof typeof chonkLooks;

// Hand-lettered words in a look, mirrored into place (but not backwards) when the mascot is flipped.
export function LookWords({ look, flip, width }: { look: Look; flip: boolean; width: number }) {
  return (
    <>
      {look.words?.map((w, i) => (
        <text
          key={i}
          x={flip ? width - w.x : w.x}
          y={w.y}
          fontSize={w.size ?? 20}
          className="svg-hand"
          textAnchor="middle"
          fill={w.fill ?? "var(--ink)"}
        >
          {w.text}
        </text>
      ))}
    </>
  );
}
