"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { getLesson } from "@/lib/lessons";

// Server actions are public endpoints: check every argument, and let row-level security
// decide whose rows and which lectures may be written.

// Records that the student reached `page` (1-based) of lecture n. Progress only moves forward.
export async function saveLessonPage(n: number, page: number) {
  const lesson = getLesson(n);
  if (!supabaseConfigured || !lesson || !Number.isInteger(page)) return;
  const pageCount = lesson.pages.length;
  if (page < 1 || page > pageCount) return;

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;

  const { data: row } = await supabase
    .from("lesson_progress")
    .select("pages_read, completed_at")
    .eq("lecture", n)
    .maybeSingle();
  const pagesRead = Math.min(Math.max(row?.pages_read ?? 0, page), pageCount);
  if (row && row.pages_read >= pagesRead) return;

  await supabase.from("lesson_progress").upsert({
    user_id: auth.user.id,
    lecture: n,
    pages_read: pagesRead,
    page_count: pageCount,
    completed_at: row?.completed_at ?? (pagesRead === pageCount ? new Date().toISOString() : null),
    updated_at: new Date().toISOString(),
  });
}

// Clears the student's progress in lecture n. The exercises PR adds its attempts here too.
export async function resetLecture(n: number) {
  if (!supabaseConfigured || !Number.isInteger(n) || n < 1 || n > 26) return;
  const supabase = await createClient();
  await supabase.from("lesson_progress").delete().eq("lecture", n);
  revalidatePath("/lectures");
}
