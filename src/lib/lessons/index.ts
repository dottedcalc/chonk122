// Lesson content is gated per viewer, so it must never be bundled into client code.
import "server-only";
import type { Lesson } from "./types";
import { contracts } from "./01-contracts";
import { ints } from "./02-ints";
import { arrays } from "./03-arrays";
import { search } from "./04-search";

const lessons: Lesson[] = [contracts, ints, arrays, search];

export function getLesson(n: number): Lesson | undefined {
  return lessons.find((l) => l.n === n);
}

export const allLessons = lessons;
