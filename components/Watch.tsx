"use client";

import { useEffect, useRef } from "react";

/**
 * The Méridien 01 — an analog timepiece drawn entirely in SVG.
 * Hour / minute / second hands track the viewer's real local time via rAF,
 * with a smoothly sweeping seconds hand. No images, no canvas: crisp at any size.
 */
export default function Watch({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  const hourRef = useRef<SVGGElement>(null);
  const minuteRef = useRef<SVGGElement>(null);
  const secondRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      const set = (el: SVGGElement | null, deg: number) => {
        if (el) el.setAttribute("transform", `rotate(${deg} 200 200)`);
      };
      set(hourRef.current, h * 30);
      set(minuteRef.current, m * 6);
      set(secondRef.current, s * 6);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 60-minute track (skip positions occupied by an applied hour index)
  const minuteTicks = Array.from({ length: 60 }, (_, i) => i).filter(
    (i) => i % 5 !== 0
  );
  // soleil brushing — fine radial lines catching light from the center
  const soleil = Array.from({ length: 90 }, (_, i) => i * 4);
  const hours = Array.from({ length: 12 }, (_, i) => i);

  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      role="img"
      aria-label="The Méridien 01, displaying your current local time"
      style={{ width: "100%", height: "auto", overflow: "visible" }}
    >
      <defs>
        <radialGradient id="ae-dial" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#1e1e23" />
          <stop offset="62%" stopColor="#141417" />
          <stop offset="100%" stopColor="#080809" />
        </radialGradient>
        <linearGradient id="ae-case" x1="12%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%" stopColor="#8c7142" />
          <stop offset="28%" stopColor="#e6cd95" />
          <stop offset="52%" stopColor="#b89a5e" />
          <stop offset="74%" stopColor="#f0d9a2" />
          <stop offset="100%" stopColor="#7d6238" />
        </linearGradient>
        <linearGradient id="ae-hand" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0d9a2" />
          <stop offset="100%" stopColor="#b3925a" />
        </linearGradient>
        <radialGradient id="ae-glass" cx="34%" cy="28%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <clipPath id="ae-dialclip">
          <circle cx="200" cy="200" r="178" />
        </clipPath>
      </defs>

      {/* case */}
      <circle cx="200" cy="200" r="196" fill="url(#ae-case)" />
      <circle cx="200" cy="200" r="188" fill="#070708" />
      <circle cx="200" cy="200" r="182" fill="url(#ae-dial)" />

      {/* soleil brushing */}
      <g clipPath="url(#ae-dialclip)" opacity="0.5">
        {soleil.map((deg) => (
          <line
            key={`sol-${deg}`}
            x1="200"
            y1="200"
            x2="200"
            y2="24"
            stroke="rgba(236,230,218,0.05)"
            strokeWidth="0.6"
            transform={`rotate(${deg} 200 200)`}
          />
        ))}
      </g>

      {/* minute track */}
      {minuteTicks.map((i) => (
        <line
          key={`min-${i}`}
          x1="200"
          y1="32"
          x2="200"
          y2="37"
          stroke="rgba(236,230,218,0.45)"
          strokeWidth="0.8"
          transform={`rotate(${i * 6} 200 200)`}
        />
      ))}

      {/* applied hour indices (double baton at 12) */}
      {hours.map((h) =>
        h === 0 ? (
          <g key="idx-12" transform="rotate(0 200 200)">
            <rect x="193.5" y="40" width="3" height="20" rx="1.2" fill="url(#ae-hand)" />
            <rect x="203.5" y="40" width="3" height="20" rx="1.2" fill="url(#ae-hand)" />
          </g>
        ) : (
          <rect
            key={`idx-${h}`}
            x="198"
            y="40"
            width="4"
            height="20"
            rx="1.5"
            fill="url(#ae-hand)"
            transform={`rotate(${h * 30} 200 200)`}
          />
        )
      )}

      {/* dial text */}
      {showText && (
        <g
          fill="rgba(236,230,218,0.78)"
          fontFamily="var(--font-serif)"
          textAnchor="middle"
        >
          <text x="200" y="128" fontSize="20" letterSpacing="5" fill="#d8be86">
            AETHER
          </text>
          <text
            x="200"
            y="146"
            fontSize="8.5"
            letterSpacing="4"
            fontFamily="var(--font-sans)"
          >
            MÉRIDIEN
          </text>
          <text
            x="200"
            y="270"
            fontSize="8"
            letterSpacing="3.5"
            fontFamily="var(--font-sans)"
            fill="rgba(236,230,218,0.55)"
          >
            AUTOMATIQUE
          </text>
          <text
            x="200"
            y="300"
            fontSize="7"
            letterSpacing="3"
            fontFamily="var(--font-sans)"
            fill="rgba(236,230,218,0.4)"
          >
            GENÈVE · SWISS MADE
          </text>
        </g>
      )}

      {/* hands */}
      <g ref={hourRef}>
        <polygon points="200,112 205,168 200,210 195,168" fill="url(#ae-hand)" />
        <rect x="198.5" y="200" width="3" height="20" rx="1.5" fill="url(#ae-hand)" />
      </g>
      <g ref={minuteRef}>
        <polygon points="200,74 203.5,170 200,212 196.5,170" fill="url(#ae-hand)" />
        <rect x="199" y="200" width="2" height="24" rx="1" fill="url(#ae-hand)" />
      </g>
      <g ref={secondRef}>
        <line x1="200" y1="232" x2="200" y2="70" stroke="#e6cd95" strokeWidth="1.4" />
        <circle cx="200" cy="200" r="4.5" fill="#e6cd95" />
        <circle cx="200" cy="86" r="2.4" fill="#e6cd95" />
      </g>

      {/* center cap */}
      <circle cx="200" cy="200" r="6" fill="#3a3a3f" />
      <circle cx="200" cy="200" r="2.2" fill="#0a0a0c" />

      {/* glass reflection */}
      <circle
        cx="200"
        cy="200"
        r="182"
        fill="url(#ae-glass)"
        style={{ pointerEvents: "none" }}
      />
    </svg>
  );
}
