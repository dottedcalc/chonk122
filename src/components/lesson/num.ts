// Writes a number with a true minus sign, matching the lesson prose.
export const num = (n: number) => (n < 0 ? `−${-n}` : `${n}`);
