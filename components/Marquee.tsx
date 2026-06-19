"use client";

const ITEMS = [
  "Méridien 01",
  "Limited to 300",
  "Swiss Automatic",
  "Calibre AE-01",
  "38mm Steel",
  "Sapphire Crystal",
  "42-Hour Reserve",
];

function Row() {
  return (
    <div className="marquee__row" aria-hidden="true">
      {ITEMS.map((t, i) => (
        <span key={i} className="marquee__item serif italic">
          {t}
          <span className="marquee__diamond">✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="marquee-wrap">
      <div className={`marquee ${reverse ? "marquee--rev" : ""}`}>
        <Row />
        <Row />
      </div>
    </div>
  );
}
