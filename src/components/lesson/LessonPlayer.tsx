"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { saveLessonPage } from "@/app/lectures/actions";

export type PlayerPage = { title: string; minutes: number; body: React.ReactNode };

// The zero-based page in the URL hash, or null when the hash names no page.
function fromHash(count: number): number | null {
  const p = Number.parseInt(window.location.hash.slice(1), 10);
  return p >= 1 && p <= count ? p - 1 : null;
}

// Shows one lesson page at a time, with Back/Next buttons, the arrow keys and a progress bar.
// The page number lives in the URL hash so a reload or shared link opens the same page,
// and each move adds a history entry so the browser Back button steps back a page.
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

  // Opens the page in the hash, or else the resume page, and writes it back so the address always matches.
  useEffect(() => {
    let start = fromHash(pages.length);
    if (start === null) start = resumeAt > 1 && resumeAt <= pages.length ? resumeAt - 1 : 0;
    setK(start);
    window.history.replaceState(null, "", `#${start + 1}`);
  }, [pages.length, resumeAt]);

  // The browser Back and Forward buttons and hand-edited hashes change the address, so follow it.
  useEffect(() => {
    function onNav() {
      moved.current = true;
      const at = fromHash(pages.length);
      setK(at ?? 0);
      // A hash that names no page opens page 1, so the address says so too.
      if (at === null) window.history.replaceState(null, "", "#1");
    }
    window.addEventListener("popstate", onNav);
    window.addEventListener("hashchange", onNav);
    return () => {
      window.removeEventListener("popstate", onNav);
      window.removeEventListener("hashchange", onNav);
    };
  }, [pages.length]);

  useEffect(() => {
    if (saving) saveLessonPage(n, k + 1).catch(() => {});
  }, [saving, n, k]);

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next > last) return;
      moved.current = true;
      setK(next);
      window.history.pushState(null, "", `#${next + 1}`);
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
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable], .lp-page button, .code")) return;
      if (e.key === "ArrowRight") go(k + 1);
      else if (e.key === "ArrowLeft") go(k - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [k, go]);

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

      {/* Every page stays mounted, so answers survive a trip to another page and back. */}
      {pages.map((pg, i) => (
        <article key={i} className="cm-box lp-page" hidden={i !== k}>
          <h1 ref={i === k ? head : undefined} tabIndex={-1}>
            {pg.title}
          </h1>
          {pg.body}
        </article>
      ))}

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
