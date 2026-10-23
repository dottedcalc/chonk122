import type { Lesson } from "./types";
import { contracts } from "./01-contracts";

const lessons: Lesson[] = [contracts];

export function getLesson(n: number): Lesson | undefined {
  return lessons.find((l) => l.n === n);
}

export const allLessons = lessons;
