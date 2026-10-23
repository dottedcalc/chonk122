"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import {
  categories,
  lectures,
  parts,
  type Category,
  type Idea,
  type IdeaId,
} from "@/lib/concepts";
import { lessonNumbers } from "@/lib/lessons/available";
import { levelOf } from "@/lib/bigIdeas";
import { Ring } from "@/components/Ring";

const ideas: Record<IdeaId, Idea & { cat: Category }> = Object.fromEntries(
  categories.flatMap((cat) => cat.ideas.map((idea) => [idea.id, { ...idea, cat }])),
) as Record<IdeaId, Idea & { cat: Category }>;

// Each category draws in its own colour, read by the CSS as --k (strong) and --ks (soft).
const tint = (cat: Category) =>
  ({ "--k": `var(--c${cat.id})`, "--ks": `var(--c${cat.id}-soft)` }) as React.CSSProperties;

const lname = (n: number) => `L${n} ${lectures[n - 1].title}`;

// Tapping an idea fades every lecture without it; tapping a dot in the chart shows that lecture.
// scores maps each big idea to its proficiency, or is null when nobody is signed in.
export function ConceptMap({ scores }: { scores: Record<number, number | null> | null }) {
  const [filter, setFilter] = useState<IdeaId | null>(null);
  const [sel, setSel] = useState<[IdeaId, number] | null>(null);
  const hits = filter ? lectures.filter((l) => l.ideas.includes(filter)).length : 0;

  return (
    <>
      <section className="cm-section">
        <h2 className="section-title">Five big ideas</h2>
        <div className="cm-cats">
          {categories.map((cat) => (
            <div key={cat.id} className="cm-box cm-cat" style={tint(cat)}>
              <div className="cm-cat-head">
                <h3>{cat.name}</h3>
                {scores && (
                  <div className="cm-prof">
                    <Ring score={scores[cat.id] ?? 0} label={`${cat.name}, ${scores[cat.id] ?? 0} of 100`} size={56} />
                    <span className="level">{scores[cat.id] === null ? "Not started" : levelOf(scores[cat.id]!)}</span>
                  </div>
                )}
              </div>
              <div className="cm-subs">
                {cat.ideas.map((idea) => (
                  <button
                    key={idea.id}
                    type="button"
                    className="cm-sub"
                    aria-pressed={filter === idea.id}
                    onClick={() => setFilter(filter === idea.id ? null : idea.id)}
                  >
                    {idea.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="cm-filterbar" aria-live="polite">
          {filter && (
            <>
              <span>
                <b>{ideas[filter].name}</b> appears in {hits} of 26 lectures.
              </span>
              <button type="button" className="cm-chip" onClick={() => setFilter(null)}>
                Show all
              </button>
            </>
          )}
        </div>
      </section>

      <section className="cm-section">
        <h2 className="section-title">What you need to know</h2>
        <div className="cm-parts">
          {categories.map((cat) => (
            <div key={cat.id} className="cm-box cm-part cm-know" style={tint(cat)}>
              <h3>{cat.name}</h3>
              <p className="cm-eu">
                <b>Enduring understanding.</b> {cat.question}
              </p>
              <ol className="cm-specs">
                {cat.specifics.map((html, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="cm-section">
        <h2 className="section-title">Idea threads</h2>
        <div className="cm-box cm-scroller">
          <div className={`cm-grid${filter ? " filtering" : ""}`}>
            <div className="cm-rowlab" />
            {lectures.map((l) => {
              const part = parts.find((p) => l.n >= p.from && l.n <= p.to)!;
              return <div key={l.n} className={`cm-band ${part.band}`} title={part.name} />;
            })}
            <div className="cm-rowlab cm-colgap" />
            {lectures.map((l) => (
              <div key={l.n} className="cm-colhead">
                {l.n}
              </div>
            ))}
            {categories.map((cat) => (
              <Fragment key={cat.id}>
                <div className="cm-rowlab cm-cathead" style={{ ...tint(cat), color: "var(--k)" }}>
                  {cat.name}
                </div>
                {cat.ideas.map((idea) => {
                  const hit = filter === idea.id ? " hit" : "";
                  return (
                    <Fragment key={idea.id}>
                      <div className={`cm-rowlab cm-idea${hit}`}>{idea.name}</div>
                      {lectures.map((l) => (
                        <div key={l.n} className={`cm-cell cm-idea${hit}`}>
                          {l.ideas.includes(idea.id) && (
                            <button
                              type="button"
                              className={`cm-dot${sel?.[0] === idea.id && sel[1] === l.n ? " sel" : ""}`}
                              style={tint(cat)}
                              aria-label={`${idea.name} in ${lname(l.n)}`}
                              onClick={() => setSel([idea.id, l.n])}
                            />
                          )}
                        </div>
                      ))}
                    </Fragment>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
        <div aria-live="polite">
          {sel && (
            <div className="cm-box cm-detail">
              <b className="cm-h">{lname(sel[1])}</b> ·{" "}
              <span style={{ ...tint(ideas[sel[0]].cat), color: "var(--k)", fontWeight: 800 }}>
                {ideas[sel[0]].name}
              </span>
              {lessonNumbers.includes(sel[1]) && (
                <>
                  <br />
                  <Link href={`/lessons/${sel[1]}`} className="cm-lesson">
                    Open the lesson →
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
