"use client";

import { useEffect, useState } from "react";
import { Magnetic } from "./anim";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="wrap nav__inner">
        <a href="#top" className="nav__brand serif" data-cursor>
          AETHER
        </a>
        <nav className="nav__links">
          <a href="#movement" className="label nav__link">
            Movement
          </a>
          <a href="#specs" className="label nav__link">
            Specification
          </a>
          <a href="#showcase" className="label nav__link">
            The Edition
          </a>
        </nav>
        <Magnetic>
          <a href="#reserve" className="btn nav__cta">
            Reserve
          </a>
        </Magnetic>
      </div>
    </header>
  );
}
