import { Honk } from "@/components/Honk";
import { Chonk } from "@/components/Chonk";
import type { Pose } from "@/components/poses";
import type { ChonkOutfit, HonkOutfit } from "@/components/outfits";

// size draws a mascot closer (l) or farther away (s), like panels in a comic, from xs to xl. outfit dresses the mascot in a costume.
export type Panel = { say: React.ReactNode; pose?: Pose; size?: "xs" | "s" | "m" | "l" | "xl" } & (
  | { who: "honk"; outfit?: HonkOutfit }
  | { who: "chonk"; outfit?: ChonkOutfit }
);

// Honk and Chonk standing on the page with speech bubbles, like a comic strip.
// Two mascots face each other. One mascot faces its bubble.
export function Comic({ panels }: { panels: Panel[] }) {
  const solo = panels.length === 1;
  return (
    <div className={`comic${solo ? " solo" : ""}`}>
      {panels.map((p, i) => {
        const flip = solo || i < panels.length / 2;
        const art =
          p.who === "honk" ? (
            <Honk className="comic-art" pose={p.pose} flip={flip} outfit={p.outfit} />
          ) : (
            <Chonk className="comic-art" pose={p.pose} flip={flip} outfit={p.outfit} />
          );
        return (
          <figure key={i} className={`beat ${p.who} size-${p.size ?? "m"}`}>
            {art}
            <figcaption className="comic-say">{p.say}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
