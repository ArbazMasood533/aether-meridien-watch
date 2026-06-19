import { Reveal } from "./anim";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <Reveal className="footer__top">
          <a href="#top" className="footer__brand display">
            Aether
          </a>
          <div className="footer__cols">
            <div className="footer__col">
              <span className="label">The Watch</span>
              <a href="#movement" className="footer__link">The Calibre</a>
              <a href="#specs" className="footer__link">Specification</a>
              <a href="#showcase" className="footer__link">The Edition</a>
            </div>
            <div className="footer__col">
              <span className="label">Maison</span>
              <span className="footer__link">Atelier, Genève</span>
              <span className="footer__link">concierge@aether.watch</span>
              <span className="footer__link">+41 22 000 00 00</span>
            </div>
            <div className="footer__col">
              <span className="label">Reserve</span>
              <a href="#reserve" className="footer__link">Secure a number</a>
              <span className="footer__link">300 pieces only</span>
            </div>
          </div>
        </Reveal>

        <div className="hairline" />

        <div className="footer__bottom">
          <span className="label">
            © MMXXV Maison Aether — a concept edition
          </span>
          <span className="label">Designed &amp; developed by Arbaz Masood</span>
        </div>
      </div>
    </footer>
  );
}
