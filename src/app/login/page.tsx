"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";
import { Chonk } from "@/components/Chonk";

const errors: Record<string, string> = {
  "1": "Sign-in didn't finish. Try again in a minute.",
};

function LoginForm() {
  const error = useSearchParams().get("error");
  const [loading, setLoading] = useState(false);

  async function signInWithCmu() {
    setLoading(true);
    // CMU accounts live in Microsoft Entra ID; Supabase calls this provider "azure".
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "email",
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setLoading(false);
  }

  if (!supabaseConfigured) {
    return <p>Sign-in isn&apos;t switched on yet. Check back soon!</p>;
  }

  return (
    <div className="login">
      <button type="button" onClick={signInWithCmu} disabled={loading}>
        {loading ? "Redirecting…" : "Azure (Andrew ID or other)"}
      </button>
      {error && <p className="error">{errors[error] ?? errors["1"]}</p>}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="container narrow">
      <Link href="/" className="back">
        ← CS122 Guide
      </Link>
      <div className="login-card">
        <Chonk className="login-chonk" />
        <h1>Login</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
