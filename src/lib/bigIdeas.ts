import { categories, lectures, type IdeaId } from "@/lib/concepts";

// The five big ideas of 15-122 are the course map's five categories,
// and each of its smaller ideas belongs to exactly one.
export type BigIdea = { id: number; name: string; blurb: string; ideas: IdeaId[] };

export const bigIdeas: BigIdea[] = categories.map((c) => ({
  id: c.id,
  name: c.name,
  blurb: c.question,
  ideas: c.ideas.map((i) => i.id),
}));

// Lectures that teach each big idea, from the course map's idea tags.
export const lecturesFor = (b: BigIdea) =>
  lectures.filter((l) => l.ideas.some((i) => b.ideas.includes(i))).map((l) => l.n);

// Five levels, from just started to mastered.
export const levels = ["Egg", "Hatchling", "Gosling", "Goose", "Chonk"] as const;
export const levelOf = (score: number) => levels[Math.min(4, Math.floor(score / 20))];
