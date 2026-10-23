import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { Honk } from "@/components/Honk";

// Logo, page links and the sign-in state, shared by every page.
export async function SiteHeader() {
  let email: string | undefined;
  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email;
  }

  return (
    <header className="nav">
      <Link href="/" className="logo">
        <Honk className="logo-honk" decorative />
        CS122 Guide
      </Link>
      <nav className="nav-links">
        <Link href="/lectures" className="nav-link">
          Lectures
        </Link>
        <Link href="/concepts" className="nav-link">
          Course map
        </Link>
        {email ? (
          <form action="/auth/signout" method="post" className="who">
            <span className="muted">{email}</span>
            <button type="submit" className="link">
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/login" className="button small">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
