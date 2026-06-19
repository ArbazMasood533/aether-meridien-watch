# AETHER — Méridien 01

A cinematic, editorial product-launch microsite for a **fictional luxury watch maison**, built as a full-stack showcase piece.

The Méridien 01 is presented as a numbered limited edition of **300 pieces**. The site pairs a restrained, "minimal-luxury" editorial design with a **real reservation backend**: every reservation is written to a database, assigned the next sequential piece number, and reflected live in the on-page counter and recent-reservations ticker.

> This is a concept / portfolio project. The maison, the timepiece, and the prices are invented.

---

## Highlights

**Design & motion (frontend)**
- Hero timepiece drawn entirely in **SVG** — soleil dial, dauphine hands, applied gold indices, sapphire-glass reflection — with hands that track your **real local time** (smoothly sweeping seconds).
- Mouse-parallax tilt on the hero watch, kinetic word-by-word headline reveals, a bespoke gold cursor, film-grain overlay, and an infinite kinetic marquee.
- **Lenis** smooth scrolling, scroll-triggered reveals, and a pinned scroll sequence where the watch scales/rotates while captions cross-fade (**Framer Motion** `useScroll`).
- A disciplined editorial design system: warm near-black, champagne gold, **Cormorant Garamond** display serif over a quiet grotesque, hairlines, generous negative space. Fully responsive; respects `prefers-reduced-motion`.

**Reservation system (backend)**
- **SQLite** (`better-sqlite3`) persisted to `data/aether.db`, seeded on first run.
- `POST /api/reserve` validates input, prevents duplicate emails, and **atomically assigns the next piece number** (transaction-safe), or reports `soldout`.
- `GET /api/stats` returns live `remaining` / `reserved` counts plus the most recent (privacy-masked) reservations.
- `POST /api/waitlist` captures interest once the edition closes.

## Stack

Next.js 16 (App Router, Route Handlers) · React 19 · TypeScript · Tailwind v4 · Framer Motion · Lenis · better-sqlite3

## Getting started

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. The SQLite database is created and seeded automatically on the first API request (≈147 pieces pre-reserved, so the counter reads as live).

> ⚠️ The watch ticking, counter tween, parallax, and cursor are `requestAnimationFrame`-driven — open the page in a **visible** browser tab to see them (background tabs pause animation frames).

### Reset the edition

Delete the local database and restart the dev server to re-seed from scratch:

```bash
rm -rf data/        # PowerShell: Remove-Item -Recurse -Force data
```

## Project structure

```
app/
  layout.tsx            # fonts + global providers (smooth scroll, cursor, grain)
  page.tsx              # composes the sections
  globals.css           # the full design system
  api/
    reserve/route.ts    # POST — reserve a numbered piece
    stats/route.ts      # GET  — live counts + recent reservations
    waitlist/route.ts   # POST — join the waitlist
components/
  Watch.tsx             # the live SVG timepiece
  Hero.tsx  Showcase.tsx  Reserve.tsx  …  # sections
  anim.tsx              # Reveal / Words / Magnetic motion primitives
lib/
  db.ts                 # SQLite schema, seed, and queries
```

## Deploying

Deploys to any Node host. On Vercel, note that the bundled SQLite file is ephemeral — for production persistence, point `lib/db.ts` at a managed database (e.g. Turso/libSQL or Postgres); the data-access functions are the only thing that would change.

---

Designed & developed by **Arbaz Masood**.
