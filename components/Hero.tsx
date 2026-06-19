"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Watch from "./Watch";
import { Reveal, Words } from "./anim";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const spring = { stiffness: 110, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(my, (v) => -v * 11), spring);
  const rotateY = useSpring(useTransform(mx, (v) => v * 15), spring);
  const x = useSpring(useTransform(mx, (v) => v * 22), spring);
  const y = useSpring(useTransform(my, (v) => v * 22), spring);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) / r.width);
    my.set((e.clientY - (r.top + r.height / 2)) / r.height);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="top"
      className="hero"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <div className="wrap hero__top">
        <span className="label">Limited Edition</span>
        <span className="label">N° 001 — 300</span>
      </div>

      <div className="hero__stage" style={{ perspective: "1300px" }}>
        <motion.div
          className="hero__watch watch-glow"
          style={{ rotateX, rotateY, x, y, transformStyle: "preserve-3d" }}
        >
          <div className="hero__float">
            <Watch className="hero__svg" />
          </div>
        </motion.div>
      </div>

      <div className="wrap hero__headline">
        <h1 className="display hero__title">
          <Words text="The Méridien" delay={0.15} />{" "}
          <span className="gold italic">
            <Words text="01" delay={0.55} />
          </span>
        </h1>
        <Reveal delay={0.8} className="hero__sub">
          <p>
            A Swiss automatic timepiece — conceived in light,
            <br /> numbered to three hundred.
          </p>
        </Reveal>
      </div>

      <div className="wrap hero__foot">
        <span className="label hero__scroll">
          <span className="hero__scrollline" /> Scroll to explore
        </span>
        <span className="label">46°12′ N · Genève</span>
      </div>
    </section>
  );
}
