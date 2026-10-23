import "server-only";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

// Who is viewing, as decided by public.access_tier() in supabase/migrations.
export type Tier = "audit" | "guest" | "cmu";
export type Part = "lesson" | "exercises";

export type Lock = { reason: "signin" | "cmu" | "date"; unlockAt?: string };

// The one rule that needs no database: anyone may read the Lecture 1 lesson.
function isPublic(n: number, part: Part) {
  return n === 1 && part === "lesson";
}

export async function getTier(): Promise<Tier> {
  if (!supabaseConfigured) return "audit";
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("access_tier");
  if (error || (data !== "guest" && data !== "cmu")) return "audit";
  return data;
}

// Returns null when the viewer may open this part of lecture n, or why it is locked.
// Fails closed: if the database can't answer, only the public lesson opens.
export async function checkAccess(n: number, part: Part): Promise<Lock | null> {
  if (isPublic(n, part)) return null;
  if (!supabaseConfigured) return { reason: "signin" };

  const supabase = await createClient();
  const { data: ok, error } = await supabase.rpc("can_access", { lecture: n, part });
  if (!error && ok === true) return null;

  const tier = await getTier();
  if (tier === "audit") return { reason: "signin" };
  if (tier === "guest") return { reason: "cmu" };
  const { data: unlock } = await supabase
    .from("lecture_unlocks")
    .select("cmu_unlock_at")
    .eq("n", n)
    .maybeSingle();
  return { reason: "date", unlockAt: unlock?.cmu_unlock_at };
}
