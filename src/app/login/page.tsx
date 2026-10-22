"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="container narrow">
      <Link href="/" className="back">
        ← chonk122
      </Link>
      <h1>Sign in</h1>
      {!supabaseConfigured ? (
        <p className="muted">Sign-in isn&apos;t switched on yet. Check back soon!</p>
      ) : status === "sent" ? (
        <p>Check {email} for a sign-in link. 🪿</p>
      ) : (
        <form onSubmit={sendLink} className="login">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@andrew.cmu.edu"
          />
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Email me a link"}
          </button>
          {status === "error" && (
            <p className="error">That didn&apos;t work. Try again in a minute.</p>
          )}
        </form>
      )}
    </main>
  );
}
