"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, User, ExternalLink, Shirt, Users } from "lucide-react";

function formatMatchDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" }) +
      ` · ${d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`;
  } catch { return iso; }
}

function age(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

const FORM_COLORS = { V: "#10B981", N: "#F59E0B", P: "#EF4444", "—": "#999" };

export default function TeamPage({ params }) {
  const id = params?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/team?id=${id}`);
        const d = await res.json();
        if (d.error) { setError(d.error); return; }
        setData(d);
      } catch (e) {
        setError("Errore caricamento");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen w-full" style={{ background: "#F4EFE6", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <BackHeader />
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="space-y-3">
            <div className="h-32 animate-pulse" style={{ background: "#E5DCC8" }} />
            {[1,2,3,4].map((i) => <div key={i} className="h-16 animate-pulse" style={{ background: "#E5DCC8" }} />)}
          </div>
          <p className="text-center text-sm mt-6" style={{ color: "#666" }}>Caricamento rosa giocatori in corso…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen w-full" style={{ background: "#F4EFE6", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <BackHeader />
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Squadra non trovata</p>
          <p className="text-sm" style={{ color: "#666" }}>{error || "Dati non disponibili"}</p>
          <Link href="/" className="inline-block mt-4 px-4 py-2 text-[11px] uppercase tracking-widest font-bold" style={{ background: "#E91D5C", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
            Torna alla home
          </Link>
        </div>
      </div>
    );
  }

  const info = data.info || {};
  const squad = data.squad || {};
  const past = data.past || [];
  const upcoming = data.upcoming || [];
  const form = data.form || [];
  const totalPlayers = Object.values(squad).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  return (
    <div className="min-h-screen w-full" style={{ background: "#F4EFE6", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <BackHeader />

      <div className="relative" style={{ background: "#0A0A0A" }}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {info.crest && (
              <div className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center p-3" style={{ background: "#F4EFE6" }}>
                <img src={info.crest} alt="" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="flex-1 min-w-0 text-white">
              <h1 className="text-2xl sm:text-4xl font-black leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.02em" }}>
                {info.name || "—"}
              </h1>
              {info.tla && (
                <span className="inline-block mt-1 text-[10px] uppercase tracking-[0.3em] font-bold px-2 py-0.5" style={{ background: "#E91D5C", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
                  {info.tla}
                </span>
              )}
              {info.coach?.name && (
                <div className="mt-2 flex items-center gap-1.5 text-sm" style={{ color: "#ccc", fontFamily: "system-ui, sans-serif" }}>
                  <User size={12} />
                  <span>{info.coach.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <InfoCell icon={<Calendar size={12} />} label="Fondato" value={info.founded || "—"} />
          <InfoCell icon={<MapPin size={12} />} label="Stadio" value={info.venue || "—"} />
          <InfoCell icon={<MapPin size={12} />} label="Città" value={info.venueCity || "—"} />
          <InfoCell icon={<Users size={12} />} label="Rosa" value={`${totalPlayers} giocatori`} />
        </div>

        {info.competitions && info.competitions.length > 0 && (
          <div className="mb-6">
            <SectionTitle label="Competizioni" accent="#0072CE" />
            <div className="flex flex-wrap gap-2">
              {info.competitions.map((c, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5" style={{ background: "#FFFFFF", border: "1px solid #D4C9B0" }}>
                  {c.emblem && <img src={c.emblem} alt="" className="w-4 h-4 object-contain" />}
                  <span className="text-[12px] font-bold" style={{ fontFamily: "system-ui, sans-serif" }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {form.length > 0 && (
          <div className="mb-6">
            <SectionTitle label="Forma" accent="#E91D5C" />
            <div className="flex items-center gap-1.5">
              {form.map((f, i) => (
                <div key={i} className="w-9 h-9 flex items-center justify-center font-black text-sm" style={{ background: FORM_COLORS[f.result] || "#999", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
                  {f.result}
                </div>
              ))}
              <span className="ml-3 text-[10px] uppercase tracking-widest" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
                ultime {form.length} partite
              </span>
            </div>
          </div>
        )}

        {upcoming.length > 0 && (
          <div className="mb-6">
            <SectionTitle label="Prossime Partite" accent="#0072CE" count={upcoming.length} />
            <div className="space-y-2">
              {upcoming.map((m) => <SmallMatchCard key={m.id} match={m} state="upcoming" />)}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div className="mb-6">
            <SectionTitle label="Ultime Partite" accent="#0A0A0A" count={past.length} />
            <div className="space-y-2">
              {past.map((m) => <SmallMatchCard key={m.id} match={m} state="finished" />)}
            </div>
          </div>
        )}

        {totalPlayers > 0 ? (
          <>
            <SectionTitle label={`Rosa · ${totalPlayers} giocatori`} accent="#E91D5C" />
            {Object.entries(squad).map(([role, players]) => {
              if (!players || players.length === 0) return null;
              return (
                <div key={role} className="mb-5">
                  <h3 className="text-[11px] uppercase tracking-[0.3em] font-black mb-2 px-2 py-1" style={{ background: "#0A0A0A", color: "#F4EFE6", display: "inline-block", fontFamily: "system-ui, sans-serif" }}>
                    {role} · {players.length}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {players.map((p) => <PlayerRow key={p.id} player={p} />)}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <SectionTitle label="Rosa" accent="#E91D5C" />
            <p className="text-sm py-3 text-center" style={{ color: "#666", fontStyle: "italic" }}>
              Rosa non disponibile. Riprova tra qualche minuto.
            </p>
          </>
        )}

        {info.website && (
          <div className="mt-8 text-center">
            <a href={info.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-widest font-bold" style={{ background: "#0A0A0A", color: "#F4EFE6", fontFamily: "system-ui, sans-serif" }}>
              <ExternalLink size={12} />
              Sito ufficiale
            </a>
          </div>
        )}
      </main>

      <footer className="relative z-10 max-w-5xl mx-auto px-4 py-8 mt-8 border-t-2" style={{ borderColor: "#0A0A0A" }}>
        <p className="text-[10px] uppercase tracking-[0.3em] text-center" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
          ✦ Partite: Football-Data.org · Rose: API-Football ✦
        </p>
      </footer>
    </div>
  );
}

function BackHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-4" style={{ background: "#0A0A0A", borderColor: "#E91D5C" }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold transition active:scale-95" style={{ background: "#222", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
          <ArrowLeft size={12} />
          <span>Indietro</span>
        </Link>
        <h1 className="text-xl font-black" style={{ color: "#F4EFE6", fontFamily: "'Playfair Display', Georgia, serif" }}>
          Il <span style={{ color: "#E91D5C", fontStyle: "italic" }}>Pallone</span>
        </h1>
        <div className="w-[80px]" />
      </div>
    </header>
  );
}

function SectionTitle({ label, accent, count }) {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="h-[3px] w-8" style={{ background: accent }} />
      <span className="text-[11px] uppercase tracking-[0.3em] font-black" style={{ fontFamily: "system-ui, sans-serif", color: "#0A0A0A" }}>
        {label}{count !== undefined && count > 0 && <span className="ml-2 opacity-50">{count}</span>}
      </span>
      <div className="h-px flex-1" style={{ background: "#D4C9B0" }} />
    </div>
  );
}

function InfoCell({ icon, label, value }) {
  return (
    <div className="p-3" style={{ background: "#FFFFFF", border: "1px solid #D4C9B0" }}>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest mb-1" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm font-bold truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{value}</div>
    </div>
  );
}

function SmallMatchCard({ match, state }) {
  const showScore = state === "finished";
  return (
    <div className="block" style={{ background: "#FFFFFF", border: "1px solid #D4C9B0" }}>
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
            {formatMatchDate(match.date)}
          </span>
          {match.matchday && (
            <span className="text-[9px] uppercase tracking-widest" style={{ color: "#999", fontFamily: "system-ui, sans-serif" }}>
              Giornata {match.matchday}
            </span>
          )}
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex items-center gap-1.5 min-w-0 justify-end">
            <span className="font-bold text-sm truncate text-right" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{match.home}</span>
            {match.homeBadge && <img src={match.homeBadge} alt="" className="w-4 h-4 object-contain flex-shrink-0" />}
          </div>
          {showScore ? (
            <div className="font-black text-base tabular-nums px-2" style={{ fontFamily: "system-ui, sans-serif" }}>
              {match.homeScore ?? 0} - {match.awayScore ?? 0}
            </div>
          ) : (
            <div className="text-[10px] uppercase tracking-widest font-bold px-2" style={{ color: "#888", fontFamily: "system-ui, sans-serif" }}>vs</div>
          )}
          <div className="flex items-center gap-1.5 min-w-0">
            {match.awayBadge && <img src={match.awayBadge} alt="" className="w-4 h-4 object-contain flex-shrink-0" />}
            <span className="font-bold text-sm truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{match.away}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerRow({ player }) {
  const playerAge = player.age || age(player.dateOfBirth);
  return (
    <div className="flex items-center gap-3 p-2.5" style={{ background: "#FFFFFF", border: "1px solid #D4C9B0" }}>
      {player.photo ? (
        <img src={player.photo} alt="" className="flex-shrink-0 w-10 h-10 object-cover rounded-full" loading="lazy" />
      ) : (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#E5DCC8" }}>
          <User size={16} style={{ color: "#666" }} />
        </div>
      )}
      <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center font-black text-xs" style={{ background: player.shirtNumber ? "#0A0A0A" : "transparent", color: player.shirtNumber ? "#F4EFE6" : "#999", fontFamily: "system-ui, sans-serif" }}>
        {player.shirtNumber || "—"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{player.name}</div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
          {player.nationality && <span>{player.nationality}</span>}
          {playerAge && <span className="opacity-60">· {playerAge} anni</span>}
        </div>
      </div>
    </div>
  );
}
