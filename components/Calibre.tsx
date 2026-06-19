import { Reveal, Words } from "./anim";

const MOVEMENT: [string, string][] = [
  ["Calibre", "AE-01 · Automatic"],
  ["Frequency", "28,800 vph — 4 Hz"],
  ["Power reserve", "42 hours"],
  ["Jewels", "21"],
  ["Finishing", "Côtes de Genève, hand-bevelled"],
  ["Rotor", "22k gold, bidirectional"],
];

export default function Calibre() {
  return (
    <section className="section calibre" id="movement">
      {/* slow-turning guilloché motif */}
      <svg className="calibre__motif" viewBox="0 0 200 200" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={20 + i * 18}
            fill="none"
            stroke="rgba(198,168,107,0.5)"
            strokeWidth="0.4"
          />
        ))}
        {Array.from({ length: 72 }, (_, i) => (
          <line
            key={i}
            x1="100"
            y1="6"
            x2="100"
            y2="14"
            stroke="rgba(198,168,107,0.6)"
            strokeWidth="0.5"
            transform={`rotate(${i * 5} 100 100)`}
          />
        ))}
      </svg>

      <div className="wrap calibre__grid">
        <div className="calibre__lead">
          <Reveal>
            <span className="label label-gold">II — The Calibre</span>
          </Reveal>
          <h2 className="display calibre__title">
            <Words text="Movement you feel," />{" "}
            <span className="italic gold">
              <Words text="never hear." delay={0.2} />
            </span>
          </h2>
          <Reveal delay={0.1}>
            <p className="intro__body">
              Beneath the dial sits the AE-01 — an in-house automatic wound by a
              gold rotor, beating at four hertz. It is assembled, regulated and
              signed by hand, then sealed beneath sapphire so you may watch it
              breathe.
            </p>
          </Reveal>
        </div>

        <div className="calibre__specs">
          {MOVEMENT.map(([k, v], i) => (
            <Reveal key={k} delay={i * 0.06} className="specrow">
              <span className="label">{k}</span>
              <span className="specrow__val serif">{v}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
