import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ConceptMap } from "@/components/ConceptMap";
import { bigIdeas, lecturesFor } from "@/lib/bigIdeas";
import { lessonNumbers } from "@/lib/lessons/available";
import { getTier } from "@/lib/access";
import { getExerciseSummary, getLectureAccess, getLectureScores, type LectureScore } from "@/lib/progress";

export const metadata: Metadata = {
  title: "Five concepts to Ace CS122 · chonk122",
  description: "The five big ideas of 15-122, what you need to know for each, and your progress on them.",
};

export const dynamic = "force-dynamic";

// The course map and, for signed-in students, their proficiency in each big idea and lecture.
export default async function ConceptsPage() {
  const tier = await getTier();
  let scores: Map<number, LectureScore> | null = null;
  if (tier !== "audit") {
    const [access, pools] = await Promise.all([getLectureAccess(), getExerciseSummary()]);
    scores = await getLectureScores((n) => ({
      lesson: lessonNumbers.includes(n) && Boolean(access.get(n)?.lesson),
      pool: pools.get(n)?.pool ?? 0,
    }));
  }

  // A big idea averages every lecture that teaches it, counting unopened ones as 0.
  const ideaScores = scores
    ? Object.fromEntries(
        bigIdeas.map((b) => {
          const all = lecturesFor(b);
          return [b.id, Math.round(all.reduce((s, n) => s + (scores.get(n)?.score ?? 0), 0) / all.length)];
        }),
      )
    : null;

  return (
    <main className="container">
      <SiteHeader />
      <header className="cm-head">
        <h1>
          Five concepts to Ace <span className="nowrap">CS122</span>
        </h1>
      </header>
      <ConceptMap scores={ideaScores} />
    </main>
  );
}
