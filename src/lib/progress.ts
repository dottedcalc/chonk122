import "server-only";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

export type LessonProgress = { pagesRead: number; pageCount: number; completed: boolean };
export type LectureAccess = { lesson: boolean; exercises: boolean; cmuUnlockAt: string | null };

// The signed-in student's lesson progress, by lecture. Empty when signed out.
export async function getLessonProgress(): Promise<Map<number, LessonProgress>> {
  const out = new Map<number, LessonProgress>();
  if (!supabaseConfigured) return out;
  const supabase = await createClient();
  const { data } = await supabase.from("lesson_progress").select("lecture, pages_read, page_count, completed_at");
  for (const r of data ?? []) {
    out.set(r.lecture, { pagesRead: r.pages_read, pageCount: r.page_count, completed: r.completed_at !== null });
  }
  return out;
}

// What the viewer may open in each lecture. Falls back to the public Lecture 1 lesson.
export async function getLectureAccess(): Promise<Map<number, LectureAccess>> {
  const out = new Map<number, LectureAccess>([[1, { lesson: true, exercises: false, cmuUnlockAt: null }]]);
  if (!supabaseConfigured) return out;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("lecture_access");
  if (error || !data) return out;
  for (const r of data as { lecture: number; lesson: boolean; exercises: boolean; cmu_unlock_at: string | null }[]) {
    out.set(r.lecture, { lesson: r.lesson, exercises: r.exercises, cmuUnlockAt: r.cmu_unlock_at });
  }
  return out;
}

export type ExerciseSummary = { graded: number; pool: number; finished: boolean };

// Questions graded and pool size per lecture the viewer may practise. Empty when signed out.
export async function getExerciseSummary(): Promise<Map<number, ExerciseSummary>> {
  const out = new Map<number, ExerciseSummary>();
  if (!supabaseConfigured) return out;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("exercise_summary");
  if (error || !data) return out;
  for (const r of data as { lecture: number; graded: number; pool: number; finished: boolean }[]) {
    out.set(r.lecture, { graded: r.graded, pool: r.pool, finished: r.finished });
  }
  return out;
}

// Lecture proficiency, 0 to 100: 25% lesson pages read and 75% exercise mastery. Mastery
// earns full weight after 8 graded questions, so one lucky round can't max it out. A lecture
// with no exercise pool yet is scored on its lesson alone. Null when there is nothing to score.
export const EXERCISES_FOR_FULL_CREDIT = 8;

export type LectureScore = { score: number; lesson: number | null; exercises: number | null };

export async function getLectureScores(available: (n: number) => { lesson: boolean; pool: number }) {
  const out = new Map<number, LectureScore>();
  if (!supabaseConfigured) return out;
  const supabase = await createClient();
  const [lessons, { data }] = await Promise.all([getLessonProgress(), supabase.rpc("exercise_scores")]);
  const ex = new Map(
    ((data ?? []) as { lecture: number; graded: number; mastery: number }[]).map((r) => [r.lecture, r]),
  );

  for (let n = 1; n <= 26; n++) {
    const { lesson: hasLesson, pool } = available(n);
    if (!hasLesson && pool === 0) continue;
    const p = lessons.get(n);
    const lesson = p ? p.pagesRead / p.pageCount : 0;
    const e = ex.get(n);
    const exercises = e ? Number(e.mastery) * Math.min(1, e.graded / Math.min(pool || 1, EXERCISES_FOR_FULL_CREDIT)) : 0;

    const score = !hasLesson ? exercises : pool === 0 ? lesson : 0.25 * lesson + 0.75 * exercises;
    out.set(n, { score: Math.round(100 * score), lesson: hasLesson ? lesson : null, exercises: pool === 0 ? null : exercises });
  }
  return out;
}
