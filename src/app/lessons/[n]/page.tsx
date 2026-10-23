import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { Locked } from "@/components/Locked";
import { checkAccess, getTier } from "@/lib/access";
import { lectures } from "@/lib/concepts";
import { getLessonProgress } from "@/lib/progress";
import { getLesson } from "@/lib/lessons";
import { notFoundMetadata } from "@/lib/notFoundMetadata";

type Params = Promise<{ n: string }>;

// Rendered per request so gated lessons never exist as prebuilt HTML.
export const dynamic = "force-dynamic";

const getLecture = (n: number) => lectures.find((l) => l.n === n);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lecture = getLecture(Number((await params).n));
  if (!lecture) return notFoundMetadata;
  // An open lecture with no lesson yet renders the 404 page, so it takes the 404 title too.
  if (!getLesson(lecture.n) && !(await checkAccess(lecture.n, "lesson"))) return notFoundMetadata;
  return {
    title: `Lecture ${lecture.n}, ${lecture.title} · chonk122`,
    description: `An interactive look back at 15-122 Lecture ${lecture.n}, ${lecture.title}.`,
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const lecture = getLecture(Number((await params).n));
  if (!lecture) notFound();

  // Check access before looking for the lesson, so a locked lecture says it is locked instead of missing.
  const lock = await checkAccess(lecture.n, "lesson");
  if (lock) {
    return (
      <main className="container lesson">
        <SiteHeader />
        <Locked n={lecture.n} lock={lock} />
      </main>
    );
  }

  const lesson = getLesson(lecture.n);
  if (!lesson) notFound();
  const saving = (await getTier()) !== "audit";
  const progress = saving ? (await getLessonProgress()).get(lesson.n) : undefined;
  return (
    <main className="container lesson">
      <SiteHeader />
      <LessonPlayer
        n={lesson.n}
        title={lesson.title}
        pages={lesson.pages}
        saving={saving}
        resumeAt={progress && !progress.completed ? progress.pagesRead : 1}
      />
    </main>
  );
}
