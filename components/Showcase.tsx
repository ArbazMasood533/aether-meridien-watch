"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Watch from "./Watch";

const CAPTIONS: [string, string][] = [
  ["38mm, in steel", "A case thinned to 8.9mm — it slips beneath a cuff and vanishes."],
  ["Sapphire, twice over", "Double-domed crystal above. An exhibition caseback below."],
  ["Closed at three hundred", "Each piece numbered and engraved. Then the reference is retired."],
];

export default function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.08]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-7, 7]);
  const fillW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const o0 = useTransform(scrollYProgress, [0.0, 0.1, 0.3, 0.38], [0, 1, 1, 0]);
  const o1 = useTransform(scrollYProgress, [0.36, 0.46, 0.62, 0.7], [0, 1, 1, 0]);
  const o2 = useTransform(scrollYProgress, [0.68, 0.78, 1, 1], [0, 1, 1, 1]);
  const opacities = [o0, o1, o2];

  return (
    <section className="showcase" id="showcase" ref={ref}>
      <div className="showcase__sticky">
        <div className="wrap showcase__stage">
          <motion.div
            className="showcase__watch watch-glow"
            style={{ scale, rotate }}
          >
            <Watch className="showcase__svg" showText={false} />
          </motion.div>

          <div className="showcase__captions">
            <span className="label label-gold">III — The Object</span>
            <div className="showcase__capwrap">
              {CAPTIONS.map(([t, d], i) => (
                <motion.div
                  key={i}
                  className="caption"
                  style={{ opacity: opacities[i] }}
                >
                  <h3 className="display caption__title">{t}</h3>
                  <p className="intro__body">{d}</p>
                </motion.div>
              ))}
            </div>
            <div className="showcase__bar">
              <motion.span style={{ width: fillW }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
