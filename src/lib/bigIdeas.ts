import { lectures, type IdeaId } from "@/lib/concepts";

// The five big ideas of 15-122, drawn from the syllabus learning objectives
// (computational thinking, programming skills, algorithms and data structures).
// Each of the course map's 12 smaller ideas belongs to exactly one.
export type BigIdeaId = "correct" | "efficient" | "strategy" | "abstract" | "c";

export type BigIdea = { id: BigIdeaId; name: string; blurb: string; ideas: IdeaId[] };

export const bigIdeas: BigIdea[] = [
  {
    id: "correct",
    name: "Contracts and correctness",
    blurb: "Contracts, loop invariants and proofs that code is safe and does what it claims.",
    ideas: ["con", "inv"],
  },
  {
    id: "efficient",
    name: "Complexity and efficiency",
    blurb: "Big-O, and worst-case, average-case and amortized analysis.",
    ideas: ["cost"],
  },
  {
    id: "strategy",
    name: "Algorithmic strategies",
    blurb: "Order, divide and conquer, and randomness, in searching, sorting, hashing and graphs.",
    ideas: ["ord", "dc", "rand"],
  },
  {
    id: "abstract",
    name: "Abstraction and interfaces",
    blurb: "Specifications versus implementations, interfaces, and data structure invariants.",
    ideas: ["abs", "trade"],
  },
  {
    id: "c",
    name: "Programming in C0 and C",
    blurb: "Integers as bits, pointers and memory, undefined behavior, and compiling and testing.",
    ideas: ["rep", "mem", "safe", "run"],
  },
];

// Lectures that teach each big idea, from the course map's idea tags.
export const lecturesFor = (b: BigIdea) =>
  lectures.filter((l) => l.ideas.some((i) => b.ideas.includes(i))).map((l) => l.n);

// Five levels, from just started to mastered.
export const levels = ["Egg", "Hatchling", "Gosling", "Goose", "Chonk"] as const;
export const levelOf = (score: number) => levels[Math.min(4, Math.floor(score / 20))];
