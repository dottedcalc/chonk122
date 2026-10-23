import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ConceptMap } from "@/components/ConceptMap";

export const metadata: Metadata = {
  title: "Five Big Ideas to Get an A in 15-122 · chonk122",
  description: "The five big ideas of 15-122, what you need to know for each, and which lectures teach them.",
};

export default function ConceptsPage() {
  return (
    <main className="container">
      <SiteHeader />
      <header className="cm-head">
        <h1>
          Five Big Ideas to Get an A in <span className="nowrap">15-122</span>
        </h1>
      </header>
      <ConceptMap />
    </main>
  );
}
