"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal, Words, Magnetic } from "./anim";

type Stats = {
  total: number;
  reserved: number;
  remaining: number;
  recent: { pieceNumber: number; name: string; at: string }[];
};

type Status = "idle" | "loading" | "done" | "soldout" | "error";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "moments ago";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

/** Tween a displayed integer toward `target`, starting from `initial` on mount. */
function useTween(target: number, initial: number, duration = 1500): number {
  const [val, setVal] = useState(initial);
  const raf = useRef(0);
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const from = val;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);
  return val;
}

function Counter({ remaining, total }: { remaining: number; total: number }) {
  // Count down from the full edition to what's left — reads as scarcity, never "sold out".
  const n = useTween(remaining, total);
  return (
    <div className="counter">
      <span className="counter__num display">
        {String(n).padStart(3, "0")}
      </span>
      <span className="counter__slash display">/ {total}</span>
    </div>
  );
}

export default function Reserve() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{ pieceNumber: number; already: boolean } | null>(null);
  const [err, setErr] = useState("");
  const [wlEmail, setWlEmail] = useState("");
  const [wlDone, setWlDone] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/stats", { cache: "no-store" });
      setStats(await r.json());
    } catch {
      /* ignore — counter simply stays hidden */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErr("");
    try {
      const r = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const d = await r.json();
      if (d.ok) {
        setResult({ pieceNumber: d.pieceNumber, already: d.already });
        setStatus("done");
        load();
      } else if (d.code === "soldout") {
        setStatus("soldout");
      } else {
        setErr(d.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErr("Network error — please try again.");
      setStatus("error");
    }
  };

  const joinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: wlEmail }),
      });
      setWlDone(true);
    } catch {
      /* ignore */
    }
  };

  const pct = stats ? Math.round((stats.reserved / stats.total) * 100) : 0;

  return (
    <section className="section reserve" id="reserve">
      <div className="wrap reserve__grid">
        {/* ---- left: the scarcity panel ---- */}
        <div className="reserve__lead">
          <Reveal>
            <span className="label label-gold">IV — Acquisition</span>
          </Reveal>
          <h2 className="display reserve__title">
            <Words text="Reserve your" />{" "}
            <span className="italic gold">
              <Words text="number." delay={0.2} />
            </span>
          </h2>

          {stats && (
            <>
              <div className="reserve__counterwrap">
                <Counter remaining={stats.remaining} total={stats.total} />
                <span className="label reserve__remaining">Pieces remaining</span>
              </div>
              <div className="meter reserve__meter">
                <span style={{ width: `${pct}%` }} />
              </div>
              <div className="reserve__meta">
                <span className="label">{stats.reserved} reserved</span>
                <span className="serif reserve__price">CHF 14,500</span>
              </div>

              {stats.recent.length > 0 && (
                <ul className="reserve__recent">
                  {stats.recent.slice(0, 4).map((r) => (
                    <li key={r.pieceNumber} className="recent">
                      <span className="recent__no gold serif">
                        N°{String(r.pieceNumber).padStart(3, "0")}
                      </span>
                      <span className="recent__name">{r.name}</span>
                      <span className="recent__time label">{timeAgo(r.at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* ---- right: the form / outcome ---- */}
        <div className="reserve__panel">
          {status === "done" && result ? (
            <Reveal className="outcome">
              <span className="outcome__seal serif">
                N°{String(result.pieceNumber).padStart(3, "0")}
              </span>
              <h3 className="display outcome__title">
                {result.already ? "Already yours." : "Reserved."}
              </h3>
              <p className="intro__body">
                {result.already
                  ? `Our records show you already hold piece N°${String(
                      result.pieceNumber
                    ).padStart(3, "0")} of ${stats?.total ?? 300}.`
                  : `You hold piece N°${String(result.pieceNumber).padStart(
                      3,
                      "0"
                    )} of ${stats?.total ?? 300}. A private confirmation will follow by email.`}
              </p>
            </Reveal>
          ) : status === "soldout" ? (
            <div className="outcome">
              <h3 className="display outcome__title">The edition is closed.</h3>
              <p className="intro__body">
                All three hundred pieces are spoken for. Join the waitlist and
                you will be the first contacted should a reservation be released.
              </p>
              {wlDone ? (
                <p className="gold serif reserve__wldone">
                  You&rsquo;re on the list. Thank you.
                </p>
              ) : (
                <form className="reserve__wl" onSubmit={joinWaitlist}>
                  <div className="field">
                    <input
                      id="wl"
                      type="email"
                      placeholder="Email"
                      value={wlEmail}
                      onChange={(e) => setWlEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="wl">Email address</label>
                  </div>
                  <button className="btn btn-solid" type="submit">
                    Join waitlist
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form className="reserve__form" onSubmit={submit}>
              <p className="label reserve__formlabel">
                Secure your piece — no payment today
              </p>
              <div className="field">
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="name">Full name</label>
              </div>
              <div className="field">
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">Email address</label>
              </div>

              {err && <p className="reserve__err">{err}</p>}

              <Magnetic className="reserve__magnet">
                <button
                  className="btn btn-solid reserve__submit"
                  type="submit"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Reserving…" : "Reserve my piece"}
                </button>
              </Magnetic>
              <p className="reserve__fine">
                Reservation holds your number for 14 days. Fully refundable.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
