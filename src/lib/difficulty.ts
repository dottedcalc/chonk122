// How hard each lecture is, from 1 (blue) to 5 (red). Placeholders until the course staff rate them.
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export const difficulty: Record<number, Difficulty> = {
  1: 2, 2: 2, 3: 1, 4: 2, 5: 3, 6: 3, 7: 4, 8: 2, 9: 2, 10: 3, 11: 4, 12: 3, 13: 3,
  14: 4, 15: 3, 16: 5, 17: 3, 18: 4, 19: 4, 20: 4, 21: 3, 22: 3, 23: 4, 24: 4, 25: 4, 26: 5,
};

export const difficultyName: Record<Difficulty, string> = {
  1: "Gentle",
  2: "Steady",
  3: "Medium",
  4: "Tough",
  5: "Hardest",
};
