import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth sign-ins land here with a one-time code.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/login?error=1`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/login?error=1`);

  // Any school account may sign in. What it unlocks is decided in the database by
  // public.access_tier(), which checks the Microsoft tenant rather than the email.
  return NextResponse.redirect(`${origin}/`);
}
