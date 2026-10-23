import Link from "next/link";
import { Chonk } from "@/components/Chonk";
import type { Lock } from "@/lib/access";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "America/New_York" });

// Shown in place of gated content. It never receives the content itself.
export function Locked({ n, lock }: { n: number; lock: Lock }) {
  return (
    <div className="login-card narrow locked">
      <Chonk className="login-chonk" />
      <h1>Lecture {n} is locked</h1>
      {lock.reason === "signin" && (
        <>
          <p>Sign in with your school&apos;s Microsoft account to open it and save your progress.</p>
          <Link href="/login" className="button">
            Sign in
          </Link>
        </>
      )}
      {lock.reason === "cmu" && (
        <p>Lectures 1 to 3 are open to everyone. The rest are for CMU students.</p>
      )}
      {lock.reason === "date" && (
        <p>
          {lock.unlockAt ? `It opens on ${formatDate(lock.unlockAt)}.` : "It isn't open yet. Check back soon!"}
        </p>
      )}
    </div>
  );
}
