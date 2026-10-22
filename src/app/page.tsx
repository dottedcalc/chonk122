import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

const topics = [
  { title: "Contracts", blurb: "Prove your loops do what you think they do." },
  { title: "Pointers & memory", blurb: "Watch the heap change as code runs." },
  { title: "Data structures", blurb: "Stacks, queues, hash tables, BSTs and more." },
  { title: "C0 → C", blurb: "From safe training wheels to real systems code." },
];

export default async function Home() {
  let email: string | undefined;
  if (supabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email;
  }

  return (
    <main className="container">
      <header className="nav">
        <span className="logo">chonk122</span>
        {email ? (
          <form action="/auth/signout" method="post">
            <span className="muted">{email}</span>{" "}
            <button type="submit" className="link">
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/login">Sign in</Link>
        )}
      </header>

      <section className="hero">
        <h1>15-122, but make it chonky.</h1>
        <p>
          Interactive explainers for CMU&apos;s Principles of Imperative
          Computation. Coming soon.
        </p>
      </section>

      <section className="grid">
        {topics.map((t) => (
          <div key={t.title} className="card">
            <h2>{t.title}</h2>
            <p>{t.blurb}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
