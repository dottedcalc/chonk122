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
