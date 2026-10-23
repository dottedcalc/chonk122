import { Honk } from "@/components/Honk";
import { Chonk } from "@/components/Chonk";

export type Panel = { who: "honk" | "chonk"; say: React.ReactNode };

// A strip of comic panels: each mascot says one line in a speech bubble.
export function Comic({ panels }: { panels: Panel[] }) {
  return (
    <div className="comic">
      {panels.map((p, i) => (
        <figure key={i} className={`comic-panel ${p.who}`}>
          {p.who === "honk" ? <Honk className="comic-art" /> : <Chonk className="comic-art" />}
          <figcaption className="comic-say">{p.say}</figcaption>
        </figure>
      ))}
    </div>
  );
}
