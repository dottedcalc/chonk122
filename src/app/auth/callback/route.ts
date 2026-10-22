import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedDomains = ["andrew.cmu.edu", "cmu.edu"];

// OAuth sign-ins land here with a one-time code.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/login?error=1`);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/login?error=1`);

  // Only CMU accounts may sign in, even if the Microsoft app accepts others.
  const domain = data.user.email?.split("@")[1]?.toLowerCase();
  if (!domain || !allowedDomains.includes(domain)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=domain`);
  }
  return NextResponse.redirect(`${origin}/`);
}
