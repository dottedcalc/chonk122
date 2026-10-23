import Link from "next/link";
import { connection } from "next/server";
import { SiteHeader } from "@/components/SiteHeader";
import { Honk } from "@/components/Honk";
import { Chonk } from "@/components/Chonk";
import { Ground } from "@/components/Ground";
import { HonkButton } from "@/components/HonkButton";
import { chonkLines, honkLines } from "@/components/mascotLines";
import { chonkLooks, honkLooks, type ChonkOutfit, type HonkOutfit } from "@/components/outfits";

function pick<T extends string>(looks: Record<T, unknown>): T {
  const keys = Object.keys(looks) as T[];
  return keys[Math.floor(Math.random() * keys.length)];
}

// Like the 15-122 staff page, Honk! (and now Chonk) wear a different costume on every visit.
async function DressedHonk() {
  await connection();
  const outfit = pick<HonkOutfit>(honkLooks);
  return <Honk className="meet-art" outfit={outfit} title={`Honk! dressed as ${honkLooks[outfit].name}`} />;
}

async function DressedChonk() {
  await connection();
  const outfit = pick<ChonkOutfit>(chonkLooks);
  return <Chonk className="meet-art" outfit={outfit} title={`Chonk dressed as ${chonkLooks[outfit].name}`} />;
}

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
          <div className="cta">
            <Link href="/lectures" className="button go">
              Wooo! Let&apos;s get started!
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="stage">
            <Ground className="ground" />
            <div className="duo">
              <HonkButton name="Honk!" lines={honkLines}>
                <Honk className="honk" />
              </HonkButton>
              <HonkButton name="Chonk" lines={chonkLines}>
                <Chonk className="chonk" />
              </HonkButton>
            </div>
          </div>
          <p className="cta-map">
            <Link href="/concepts" className="button alt">
              Five concepts
            </Link>
          </p>
        </div>
      </section>

      <section className="meet">
        <h2 className="section-title">Meet your guides</h2>
        <div className="meet-grid">
          <div className="meet-card">
            <DressedHonk />
            <div>
              <h3>Honk!</h3>
              <p className="tag">Mascot</p>
              <p>A small grey goose who loves contracts and has never once broken a loop invariant.</p>
            </div>
          </div>
          <div className="meet-card">
            <DressedChonk />
            <div>
              <h3>Chonk</h3>
              <p className="tag">Honk!&apos;s best friend</p>
              <p>A human-sized stuffed goose who is round, squishy and very huggable. Allocates memory generously and always frees it.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
