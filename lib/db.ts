/**
 * AETHER — reservation data layer (SQLite via better-sqlite3).
 *
 * Server-only. Only import this from Route Handlers / server code — it loads a
 * native module and must never reach the client bundle.
 *
 * The Méridien 01 is a numbered limited edition of 300. Reserving a piece
 * atomically assigns the next sequential number and persists it to disk, so the
 * "remaining" counter on the page reflects real state in the database.
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export const TOTAL_PIECES = 300;
/** How many pieces are already spoken for when the DB is first created. */
const SEED_RESERVED = 147;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ReservationRow = {
  id: number;
  piece_number: number;
  name: string;
  email: string;
  created_at: string;
};

// Cache the connection across hot-reloads in dev so we don't reopen / reseed.
const globalForDb = globalThis as unknown as { __aetherDb?: Database.Database };

function createConnection(): Database.Database {
  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });

  const db = new Database(path.join(dataDir, "aether.db"));
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      piece_number INTEGER NOT NULL UNIQUE,
      name         TEXT    NOT NULL,
      email        TEXT    NOT NULL UNIQUE,
      created_at   TEXT    NOT NULL
    );
    CREATE TABLE IF NOT EXISTS waitlist (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT    NOT NULL UNIQUE,
      created_at TEXT    NOT NULL
    );
  `);

  seedIfEmpty(db);
  return db;
}

function seedIfEmpty(db: Database.Database) {
  const { c } = db.prepare("SELECT COUNT(*) AS c FROM reservations").get() as {
    c: number;
  };
  if (c > 0) return;

  const firsts = [
    "Sofia", "Liam", "Noëmi", "Hugo", "Aria", "Mateo", "Clara", "Theo",
    "Yuki", "Anaïs", "Viktor", "Lena", "Rashid", "Émile", "Mira", "Jonas",
    "Isolde", "Felix", "Nadia", "Caspar", "Béatrice", "Oscar", "Lucia", "Henri",
  ];
  const lasts = [
    "Lindqvist", "Moreau", "Tanaka", "Visconti", "Berger", "Almeida", "Novak",
    "Haddad", "Strand", "Lefèvre", "Köhler", "Romano", "Vasquez", "Brandt",
    "Okonkwo", "Dubois", "Ferraro", "Aaltonen", "Marchetti", "Sólyom",
  ];

  const insert = db.prepare(
    "INSERT INTO reservations (piece_number, name, email, created_at) VALUES (?, ?, ?, ?)"
  );
  const now = Date.now();
  const tx = db.transaction(() => {
    for (let i = 1; i <= SEED_RESERVED; i++) {
      const f = firsts[(i * 7) % firsts.length];
      const l = lasts[(i * 13) % lasts.length];
      const email = `${f}.${l}.${i}@example.com`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, ""); // strip combining accents
      // Spread reservations back over the past ~7 weeks so the ticker reads as live.
      const createdAt = new Date(
        now - (SEED_RESERVED - i) * (7 * 60 + (i % 53)) * 60 * 1000
      ).toISOString();
      insert.run(i, `${f} ${l}`, email, createdAt);
    }
  });
  tx();
}

function getDb(): Database.Database {
  if (!globalForDb.__aetherDb) globalForDb.__aetherDb = createConnection();
  return globalForDb.__aetherDb;
}

function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function reservedCount(db: Database.Database): number {
  return (db.prepare("SELECT COUNT(*) AS c FROM reservations").get() as { c: number })
    .c;
}

export type Stats = {
  total: number;
  reserved: number;
  remaining: number;
  recent: { pieceNumber: number; name: string; at: string }[];
};

export function getStats(): Stats {
  const db = getDb();
  const reserved = reservedCount(db);
  const recent = db
    .prepare(
      "SELECT piece_number, name, created_at FROM reservations ORDER BY piece_number DESC LIMIT 6"
    )
    .all() as Pick<ReservationRow, "piece_number" | "name" | "created_at">[];

  return {
    total: TOTAL_PIECES,
    reserved,
    remaining: Math.max(0, TOTAL_PIECES - reserved),
    recent: recent.map((r) => ({
      pieceNumber: r.piece_number,
      name: maskName(r.name),
      at: r.created_at,
    })),
  };
}

export type ReserveResult =
  | {
      ok: true;
      pieceNumber: number;
      already: boolean;
      remaining: number;
      total: number;
    }
  | { ok: false; error: string; code: "invalid" | "soldout" };

export function reservePiece(nameRaw: unknown, emailRaw: unknown): ReserveResult {
  const db = getDb();
  const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
  const email =
    typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";

  if (name.length < 2 || !EMAIL_RE.test(email)) {
    return {
      ok: false,
      code: "invalid",
      error: "Please enter your full name and a valid email address.",
    };
  }

  const existing = db
    .prepare("SELECT piece_number FROM reservations WHERE email = ?")
    .get(email) as { piece_number: number } | undefined;
  if (existing) {
    return {
      ok: true,
      pieceNumber: existing.piece_number,
      already: true,
      remaining: Math.max(0, TOTAL_PIECES - reservedCount(db)),
      total: TOTAL_PIECES,
    };
  }

  // Assign the next number atomically so concurrent requests can't collide.
  const assign = db.transaction((): number | null => {
    const { m } = db
      .prepare("SELECT COALESCE(MAX(piece_number), 0) AS m FROM reservations")
      .get() as { m: number };
    if (m >= TOTAL_PIECES) return null;
    const next = m + 1;
    db.prepare(
      "INSERT INTO reservations (piece_number, name, email, created_at) VALUES (?, ?, ?, ?)"
    ).run(next, name, email, new Date().toISOString());
    return next;
  });

  const next = assign();
  if (next === null) {
    return {
      ok: false,
      code: "soldout",
      error: "Every piece in the edition has been reserved.",
    };
  }

  return {
    ok: true,
    pieceNumber: next,
    already: false,
    remaining: Math.max(0, TOTAL_PIECES - reservedCount(db)),
    total: TOTAL_PIECES,
  };
}

export function joinWaitlist(emailRaw: unknown): { ok: boolean; error?: string } {
  const db = getDb();
  const email =
    typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  db.prepare(
    "INSERT OR IGNORE INTO waitlist (email, created_at) VALUES (?, ?)"
  ).run(email, new Date().toISOString());
  return { ok: true };
}
