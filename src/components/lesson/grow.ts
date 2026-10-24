// Cost functions shared by the growth widgets, looked up by name so lesson pages can pass plain strings.
export const costs: Record<string, (n: number) => number> = {
  "1": () => 1,
  "log n": (n) => Math.log2(Math.max(n, 1)),
  n: (n) => n,
  "n log n": (n) => n * Math.log2(Math.max(n, 1)),
  "n²": (n) => n * n,
  "2ⁿ": (n) => 2 ** n,
  "n!": (n) => {
    let f = 1;
    for (let k = 2; k <= n; k++) f *= k;
    return f;
  },
  "4n + 7": (n) => 4 * n + 7,
  "20n + 50": (n) => 20 * n + 50,
};

const sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";

// A count of steps, short enough to read, with big ones as a power of ten.
export function steps(v: number) {
  if (v < 1e6) return Number.isInteger(v) ? v.toLocaleString("en-US") : v.toFixed(1);
  let e = Math.floor(Math.log10(v));
  let m = Math.round((v / 10 ** e) * 10) / 10;
  if (m >= 10) {
    m = 1;
    e += 1;
  }
  return `${m.toFixed(1)} × 10${[...String(e)].map((c) => sup[Number(c)]).join("")}`;
}
