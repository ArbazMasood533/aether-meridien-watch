import { Reveal, Words } from "./anim";

const SPECS: [string, string][] = [
  ["Case", "38 mm · polished steel"],
  ["Thickness", "8.9 mm"],
  ["Crystal", "Double-domed sapphire, anti-reflective"],
  ["Dial", "Soleil-brushed, applied gold indices"],
  ["Water resistance", "50 metres"],
  ["Strap", "Hand-stitched alligator · steel deployant"],
  ["Caseback", "Exhibition sapphire"],
  ["Edition", "300 numbered pieces"],
];

export default function Specs() {
  return (
    <section className="section specs" id="specs">
      <div className="wrap">
        <div className="specs__head">
          <Reveal>
            <span className="label label-gold">The Reference</span>
          </Reveal>
          <h2 className="display specs__title">
            <Words text="Specification" />
          </h2>
        </div>

        <div className="specs__grid">
          {SPECS.map(([k, v], i) => (
            <Reveal key={k} delay={(i % 2) * 0.08} className="spec">
              <span className="label">{k}</span>
              <span className="spec__val serif">{v}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
