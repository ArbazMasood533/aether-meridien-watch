import { Reveal, Words } from "./anim";

export default function Philosophy() {
  return (
    <section className="section intro" id="intro">
      <div className="wrap">
        <Reveal>
          <span className="label label-gold">I — The Idea</span>
        </Reveal>

        <h2 className="display intro__statement">
          <Words text="Time is the only luxury that cannot be" />{" "}
          <span className="gold italic">
            <Words text="manufactured" delay={0.2} />
          </span>{" "}
          <Words text="— only measured, and only once." delay={0.3} />
        </h2>

        <div className="intro__grid">
          <Reveal>
            <span className="label">Maison Aether</span>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="intro__body">
              We began with a refusal: that a watch should shout. The Méridien 01
              is an exercise in restraint — a dial stripped to its essential
              geometry, a case thinned to the edge of possibility, a movement you
              feel rather than hear. Every piece is finished by a single
              watchmaker and engraved with its number in the edition. When the
              three-hundredth leaves Genève, the reference is closed. Forever.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
