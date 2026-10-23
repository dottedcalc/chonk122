import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ConceptMap } from "@/components/ConceptMap";

export const metadata: Metadata = {
  title: "How the ideas of 15-122 connect · chonk122",
  description: "Lectures 1 to 26 in three parts, and where each big idea of 15-122 appears.",
};

export default function ConceptsPage() {
  return (
    <main className="container">
      <SiteHeader />
      <header className="cm-head">
        <h1>
          How the ideas of <span className="nowrap">15-122</span> connect
        </h1>
        <p className="lede">
          The course builds on five big ideas. Each one below lists what you need to know, and you
          can tap any idea to see which lectures teach it.
        </p>
      </header>
      <ConceptMap />
    </main>
  );
}
