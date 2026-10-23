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

const ideas: Record<IdeaId, Idea & { cat: Category }> = Object.fromEntries(
  categories.flatMap((cat) => cat.ideas.map((idea) => [idea.id, { ...idea, cat }])),
) as Record<IdeaId, Idea & { cat: Category }>;

// Each category draws in its own colour, read by the CSS as --k (strong) and --ks (soft).
const tint = (cat: Category) =>
  ({ "--k": `var(--c${cat.id})`, "--ks": `var(--c${cat.id}-soft)` }) as React.CSSProperties;

const lname = (n: number) => `L${n} ${lectures[n - 1].title}`;

// Tapping an idea fades every lecture without it; tapping a dot in the chart shows that lecture.
export function ConceptMap() {
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
              <h3>{cat.name}</h3>
              <p className="cm-q">{cat.question}</p>
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
        <h2 className="section-title">The course in three parts</h2>
        <div className="cm-parts">
          {parts.map((part) => (
            <div key={part.name} className="cm-box cm-part">
              <h3>{part.name}</h3>
              <div className={`cm-lrows${filter ? " filtering" : ""}`}>
                {lectures.slice(part.from - 1, part.to).map((l) => (
                  <div key={l.n} id={`l${l.n}`} className={`cm-lrow${filter && l.ideas.includes(filter) ? " hit" : ""}`}>
                    <span className="cm-n">{l.n}</span>
                    <span className="cm-t">{l.title}</span>
                    <span className="cm-s">
                      <span dangerouslySetInnerHTML={{ __html: l.summary }} />
                      {lessonNumbers.includes(l.n) && (
                        <>
                          {" "}
                          <Link href={`/lessons/${l.n}`} className="cm-lesson">
                            Open the lesson →
                          </Link>
                        </>
                      )}
                    </span>
                    <span className="cm-tags">
                      {l.ideas.map((id) => (
                        <i key={id} title={ideas[id].name} style={tint(ideas[id].cat)} />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
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
        <div className="cm-box cm-detail" aria-live="polite">
          {sel ? (
            <>
              <b className="cm-h">{lname(sel[1])}</b> ·{" "}
              <span style={{ ...tint(ideas[sel[0]].cat), color: "var(--k)", fontWeight: 800 }}>
                {ideas[sel[0]].name}
              </span>
              <br />
              <span dangerouslySetInnerHTML={{ __html: lectures[sel[1] - 1].summary }} />
            </>
          ) : (
            <span className="muted">Tap a dot to read that lecture&apos;s summary.</span>
          )}
        </div>
      </section>
    </>
  );
}
