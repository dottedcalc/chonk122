"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { saveLessonPage } from "@/app/lectures/actions";

export type PlayerPage = { title: string; minutes: number; body: React.ReactNode };

// Shows one lesson page at a time, with Back/Next buttons, the arrow keys and a progress bar.
// The page number lives in the URL hash so a reload or shared link opens the same page.
// Signed-in students resume where they left off, and each page they reach is saved.
export function LessonPlayer({
  n,
  title,
  pages,
  saving = false,
  resumeAt = 1,
}: {
  n: number;
  title: string;
  pages: PlayerPage[];
  saving?: boolean;
  resumeAt?: number;
}) {
  const [k, setK] = useState(0);
  const head = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const last = pages.length - 1;

  useEffect(() => {
    const p = Number.parseInt(window.location.hash.slice(1), 10);
    if (p >= 1 && p <= pages.length) setK(p - 1);
    else if (resumeAt > 1 && resumeAt <= pages.length) setK(resumeAt - 1);
  }, [pages.length, resumeAt]);

  useEffect(() => {
    if (saving) saveLessonPage(n, k + 1).catch(() => {});
  }, [saving, n, k]);

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next > last) return;
      moved.current = true;
      setK(next);
      window.history.replaceState(null, "", `#${next + 1}`);
    },
    [last],
  );

  // After Back or Next, move focus to the new heading so keyboard and screen reader users start at the top.
  useEffect(() => {
    if (moved.current) head.current?.focus();
  }, [k]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") go(k + 1);
      else if (e.key === "ArrowLeft") go(k - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [k, go]);

  const page = pages[k];

  return (
    <div className="lp">
      <div className="lp-top">
        <p className="lp-kicker">
          Lecture {n} · {title}
        </p>
        <div className="lp-progress">
          <div
            className="lp-bar"
            role="progressbar"
            aria-label="Lesson progress"
            aria-valuemin={1}
            aria-valuemax={pages.length}
            aria-valuenow={k + 1}
          >
            <span style={{ width: `${((k + 1) / pages.length) * 100}%` }} />
          </div>
          {/* A circle split in half: this page on top, the number of pages below. */}
          <div className="lp-dial" role="img" aria-label={`Page ${k + 1} of ${pages.length}`}>
            <span className="lp-dial-top">{k + 1}</span>
            <span className="lp-dial-bottom">{pages.length}</span>
          </div>
        </div>
      </div>

      <article className="cm-box lp-page" key={k}>
        <h1 ref={head} tabIndex={-1}>
          {page.title}
        </h1>
        {page.body}
      </article>

      <nav className="lp-nav" aria-label="Lesson pages">
        <button type="button" onClick={() => go(k - 1)} disabled={k === 0}>
          ← Back
        </button>
        {k < last ? (
          <button type="button" onClick={() => go(k + 1)}>
            Next →
          </button>
        ) : (
          <Link href="/lectures" className="button">
            All lectures →
          </Link>
        )}
      </nav>
    </div>
  );
}
