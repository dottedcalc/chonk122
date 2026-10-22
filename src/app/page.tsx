import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Honk } from "@/components/Honk";
import { Chonk } from "@/components/Chonk";
import { Ground } from "@/components/Ground";
import { HonkButton } from "@/components/HonkButton";
import { chonkLines, honkLines } from "@/components/mascotLines";
import { ContractDoodle, EggDoodle, PointerDoodle, TreeDoodle } from "@/components/Doodles";

const topics = [
  { title: "Contracts", blurb: "Prove your loops do what you think they do.", Doodle: ContractDoodle },
  { title: "Pointers & memory", blurb: "Watch the heap change as code runs.", Doodle: PointerDoodle },
  { title: "Data structures", blurb: "Stacks, queues, hash tables, BSTs and more.", Doodle: TreeDoodle },
  { title: "C0 → C", blurb: "From safe training wheels to real systems code.", Doodle: EggDoodle },
];

export default function Home() {
  return (
    <main className="container">
      <SiteHeader />

      <section className="hero">
        <div className="hero-text">
          <p className="course-name">Principles of Imperative Computation</p>
          <h1>
            CS122, but made <span className="squiggle">chonky.</span>
          </h1>
        </div>
        <div className="hero-art">
          <Ground className="ground" />
          <div className="duo">
            <HonkButton name="Honk" lines={honkLines}>
              <Honk className="honk" />
            </HonkButton>
            <HonkButton name="Chonk" lines={chonkLines}>
              <Chonk className="chonk" />
            </HonkButton>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">What you&apos;ll poke at</h2>
        <div className="grid">
          {topics.map(({ title, blurb, Doodle }) => (
            <div key={title} className="card">
              <div className="doodle">
                <Doodle />
              </div>
              <h3>{title}</h3>
              <p>{blurb}</p>
            </div>
          ))}
        </div>
        <p className="more">
          <Link href="/concepts" className="button small">
            See how all 26 lectures connect →
          </Link>
        </p>
      </section>

      <section className="meet">
        <h2 className="section-title">Meet the course staff (the fluffy ones)</h2>
        <div className="meet-grid">
          <div className="meet-card">
            <Honk className="meet-art" />
            <div>
              <h3>Honk</h3>
              <p className="tag">Mascot</p>
              <p>Small, grey and loyal to 15-122. Has never once violated a loop invariant.</p>
            </div>
          </div>
          <div className="meet-card">
            <Chonk className="meet-art" />
            <div>
              <h3>Chonk</h3>
              <p className="tag">Mascot&apos;s buddy</p>
              <p>Human-sized, extremely fluffy and mostly legs. Allocates generously, frees eventually.</p>
            </div>
          </div>
        </div>
        <p className="hint muted">Psst: click the geese up top.</p>
      </section>
    </main>
  );
}
