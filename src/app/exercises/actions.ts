"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

// Server actions are public endpoints, so every argument is checked here, and the database
// functions check the caller's access again. Storage paths stay on the server: the browser
// only ever gets short-lived signed links.

export type Grade = "got" | "partly" | "missed";
export type Item = { id: string; position: number; question: string; alt: string; answer: string | null; grade: Grade | null };
export type Round = { round: number; finished: boolean; items: Item[] };

const LINK_SECONDS = 15 * 60;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const okLecture = (n: number) => Number.isInteger(n) && n >= 1 && n <= 26;

async function sign(supabase: Awaited<ReturnType<typeof createClient>>, paths: string[]) {
  if (paths.length === 0) return new Map<string, string>();
  const { data } = await supabase.storage.from("exercises").createSignedUrls(paths, LINK_SECONDS);
  return new Map((data ?? []).flatMap((d) => (d.path && d.signedUrl ? [[d.path, d.signedUrl] as const] : [])));
}

type Row = {
  round: number;
  finished: boolean;
  attempt_id: string | null;
  position: number | null;
  question_path: string | null;
  alt: string | null;
  answer_path: string | null;
  grade: Grade | null;
};

// Resumes the open round or serves the next one.
export async function startRound(n: number): Promise<Round | null> {
  if (!supabaseConfigured || !okLecture(n)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("start_round", { lecture: n });
  if (error || !data) return null;
  const rows = (data as Row[]).filter((r) => r.attempt_id && r.question_path);
  const links = await sign(supabase, rows.flatMap((r) => [r.question_path!, ...(r.answer_path ? [r.answer_path] : [])]));
  return {
    round: (data as Row[])[0]?.round ?? 0,
    finished: (data as Row[])[0]?.finished ?? true,
    items: rows.map((r) => ({
      id: r.attempt_id!,
      position: r.position!,
      question: links.get(r.question_path!) ?? "",
      alt: r.alt ?? "",
      answer: r.answer_path ? (links.get(r.answer_path) ?? "") : null,
      grade: r.grade,
    })),
  };
}

export async function revealAnswer(attemptId: string): Promise<string | null> {
  if (!supabaseConfigured || !uuid.test(attemptId)) return null;
  const supabase = await createClient();
  const { data: path, error } = await supabase.rpc("reveal_answer", { attempt: attemptId });
  if (error || typeof path !== "string") return null;
  return (await sign(supabase, [path])).get(path) ?? null;
}

export async function gradeAttempt(attemptId: string, grade: Grade): Promise<boolean> {
  if (!supabaseConfigured || !uuid.test(attemptId) || !["got", "partly", "missed"].includes(grade)) return false;
  const supabase = await createClient();
  const { error } = await supabase.rpc("grade_attempt", { attempt: attemptId, grade });
  return !error;
}

export async function resetExercises(n: number) {
  if (!supabaseConfigured || !okLecture(n)) return;
  const supabase = await createClient();
  await supabase.rpc("reset_exercises", { lecture: n });
  revalidatePath("/lectures");
}
