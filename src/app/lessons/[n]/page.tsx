import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { allLessons, getLesson } from "@/lib/lessons";

type Params = Promise<{ n: string }>;

export function generateStaticParams() {
  return allLessons.map((l) => ({ n: String(l.n) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lesson = getLesson(Number((await params).n));
  if (!lesson) return {};
  return {
    title: `Lecture ${lesson.n}: ${lesson.title} · chonk122`,
    description: `An interactive look back at 15-122 Lecture ${lesson.n}, ${lesson.title}.`,
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const lesson = getLesson(Number((await params).n));
  if (!lesson) notFound();

  return (
    <main className="container lesson">
      <SiteHeader />
      <LessonPlayer n={lesson.n} title={lesson.title} pages={lesson.pages} />
    </main>
  );
}
