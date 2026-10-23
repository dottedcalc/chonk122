import { SiteHeader } from "@/components/SiteHeader";
import { Fetching } from "@/components/Fetching";

export default function Loading() {
  return (
    <main className="container lesson">
      <SiteHeader />
      <header className="ex-head">
        <h1>Exercises</h1>
      </header>
      <Fetching />
    </main>
  );
}
