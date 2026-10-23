import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Locked } from "@/components/Locked";
import { ExercisePlayer } from "@/components/ExercisePlayer";
import { checkAccess } from "@/lib/access";
import { lectures } from "@/lib/concepts";

type Params = Promise<{ n: string }>;

export const dynamic = "force-dynamic";

const getLecture = (n: number) => lectures.find((l) => l.n === n);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lecture = getLecture(Number((await params).n));
  return lecture ? { title: `Lecture ${lecture.n} exercises · chonk122` } : {};
}

export default async function ExercisesPage({ params }: { params: Params }) {
  const lecture = getLecture(Number((await params).n));
  if (!lecture) notFound();

  const lock = await checkAccess(lecture.n, "exercises");
  return (
    <main className="container lesson">
      <SiteHeader />
      {lock ? (
        <Locked n={lecture.n} lock={lock} />
      ) : (
        <>
          <header className="ex-head">
            <p className="lp-kicker">
              Lecture {lecture.n} · {lecture.title}
            </p>
            <h1>Exercises</h1>
            <p>
              Four questions a round. Work each one out, reveal the answer, then say how you did. Questions never repeat.
            </p>
          </header>
          <ExercisePlayer n={lecture.n} />
          <p className="ex-back">
            <Link href="/lectures">← All lectures</Link>
          </p>
        </>
      )}
    </main>
  );
}
