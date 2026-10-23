import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Honk } from "@/components/Honk";
import { Chonk } from "@/components/Chonk";
import { Ground } from "@/components/Ground";
import { notFoundMetadata } from "@/lib/notFoundMetadata";

export const metadata = notFoundMetadata;

const src = `//@requires 0 <= i && i < \\length(pages);
page p = pages[404];`;

export default function NotFound() {
  return (
    <main className="container">
      <SiteHeader />
      <section className="nf">
        <div className="nf-text">
          <p className="nf-code">404</p>
          <h1>This page is out of bounds</h1>
          <p>Chonk searched every index and Honk! checked under the couch. It isn&apos;t here.</p>
          <pre className="code nf-snip" aria-label="A contract that fails for index 404">
            <code>
              {src.split("\n").map((line, i) => (
                <span key={i} className={`code-line${i === 0 ? " contract" : " hi"}`}>
                  {line}
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
          <div className="cta">
            <Link href="/" className="button">
              Take me home
            </Link>
            <Link href="/lectures" className="button alt">
              All lectures
            </Link>
          </div>
        </div>
        <div className="nf-art">
          <Ground className="ground" />
          <div className="duo nf-duo">
            <Honk className="honk" pose="shrug" decorative />
            <Chonk className="chonk" outfit="detective" pose="point" decorative />
          </div>
        </div>
      </section>
    </main>
  );
}
