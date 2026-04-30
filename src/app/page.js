"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  RefreshCw, Clock, ExternalLink, Zap, Wifi, WifiOff,
  Search, X, Trophy, Users, Newspaper, Activity, BarChart3, Target,
  Calendar, Gamepad2, Radio, Headphones
} from "lucide-react";
import { LEAGUES, TEAMS, isLight, FANTA_LINKS, RADIOS, PODCASTS } from "@/lib/config";

// =================== BANNER ADSTERRA ===================
function AdBanner({ size }) {
  const ref = useRef(null);
  const loaded = useRef(false);

  const configs = {
    header: {
      key: "d1914ab2decc8ba22cf0f25a2657456f",
      width: 468,
      height: 60,
    },
    rectangle: {
      key: "e7fa008dae6b0fa2fbfaeb7adae5a514",
      width: 300,
      height: 250,
    },
  };
  const cfg = configs[size] || configs.header;

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;

    const container = ref.current;
    container.innerHTML = "";

    const optScript = document.createElement("script");
    optScript.type = "text/javascript";
    optScript.innerHTML = `
      atOptions = {
        'key' : '${cfg.key}',
        'format' : 'iframe',
        'height' : ${cfg.height},
        'width' : ${cfg.width},
        'params' : {}
      };
    `;
    container.appendChild(optScript);

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = `https://www.highperformanceformat.com/${cfg.key}/invoke.js`;
    invokeScript.async = true;
    container.appendChild(invokeScript);
  }, [cfg.key, cfg.width, cfg.height]);

  return (
    <div className="my-4 flex justify-center" aria-label="Pubblicità">
      <div
        ref={ref}
        style={{
          width: `${cfg.width}px`,
          height: `${cfg.height}px`,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

// =================== CONTATORE VISITE ===================
function VisitCounter() {
  const [count, setCount] = useState(null);
  const incrementedRef = useRef(false);

  useEffect(() => {
    if (incrementedRef.current) return;
    incrementedRef.current = true;

    async function loadAndIncrement() {
      try {
        // Verifica se già visitato oggi (sessionStorage)
        const today = new Date().toISOString().split("T")[0];
        const lastVisit = sessionStorage.getItem("ilpallone_visit_date");

        let url;
        if (lastVisit === today) {
          // Solo lettura, niente incremento
          url = "https://countapi.mileshilliard.com/api/v1/get/ilpallone_calcio_app_2026";
        } else {
          // Incrementa e salva la data
          url = "https://countapi.mileshilliard.com/api/v1/hit/ilpallone_calcio_app_2026";
          sessionStorage.setItem("ilpallone_visit_date", today);
        }

        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const value = parseInt(data.value, 10);
        if (!isNaN(value)) setCount(value);
      } catch (err) {
        // Silenzioso: se il servizio è offline, il contatore semplicemente non appare
      }
    }

    loadAndIncrement();
  }, []);

  if (count === null) return null;

  return (
    <div className="mb-3 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest font-bold" style={{ color: "#0A0A0A", fontFamily: "system-ui, sans-serif" }}>
      <Users size={12} style={{ color: "#E91D5C" }} />
      <span>
        <span style={{ color: "#E91D5C", fontWeight: 900 }}>{count.toLocaleString("it-IT")}</span>
        {" "}tifos{count === 1 ? "o è passato" : "i sono passati"} da qui
      </span>
    </div>
  );
}

function timeAgo(input) {
  const d = input instanceof Date ? input : new Date(input);
  if (!d || isNaN(d.getTime())) return "—";
  const s = Math.floor((new Date() - d) / 1000);
  if (s < 60) return "ora";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const dd = Math.floor(h / 24);
  return dd < 7 ? `${dd}g` : d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

function formatMatchDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" }) +
      ` · ${d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`;
  } catch { return iso; }
}

function groupByMatchday(matches) {
  const groups = {};
  matches.forEach((m) => {
    const key = m.matchday ? `Giornata ${m.matchday}` : "Altre";
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return Object.entries(groups);
}

export default function Home() {
  const [tab, setTab] = useState("news");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [newCount, setNewCount] = useState(0);
  const [online, setOnline] = useState(true);
  const [liveMatches, setLiveMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState(null);
  const [standings, setStandings] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);
  const [fantaArticles, setFantaArticles] = useState([]);
  const [fantaLoading, setFantaLoading] = useState(false);
  const [activePodcast, setActivePodcast] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(120);
  const knownIdsRef = useRef(new Set());
  const REFRESH_INTERVAL = 120;

  async function loadNews(isInitial = false) {
    setNewsLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      const all = data.articles || [];
      if (all.length === 0) { setOnline(false); return; }
      setOnline(true);
      let freshCount = 0;
      if (!isInitial && knownIdsRef.current.size > 0) {
        all.forEach((a) => { if (!knownIdsRef.current.has(a.id)) freshCount++; });
      }
      knownIdsRef.current = new Set(all.map((a) => a.id));
      setArticles(all);
      setLastUpdate(new Date());
      if (freshCount > 0) {
        setNewCount(freshCount);
        setTimeout(() => setNewCount(0), 6000);
      }
    } catch { setOnline(false); }
    finally { setNewsLoading(false); setCountdown(REFRESH_INTERVAL); }
  }

  async function loadMatches() {
    setMatchesLoading(true);
    setMatchesError(null);
    try {
      const target = leagueFilter === "all" ? "seriea" : leagueFilter;
      const res = await fetch(`/api/matches?league=${target}`);
      const data = await res.json();
      if (data.error) setMatchesError(data.error);
      setLiveMatches(data.live || []);
      setPastMatches(data.past || []);
      setUpcomingMatches(data.upcoming || []);
    } catch { setMatchesError("Errore caricamento partite"); }
    finally { setMatchesLoading(false); }
  }

  async function loadTable() {
    if (leagueFilter === "all") {
      setStandings([]); setScorers([]); return;
    }
    setTableLoading(true);
    setTableError(null);
    try {
      const [s1, s2] = await Promise.all([
        fetch(`/api/standings?league=${leagueFilter}`).then((r) => r.json()),
        fetch(`/api/scorers?league=${leagueFilter}`).then((r) => r.json()),
      ]);
      if (s1.error) setTableError(s1.error);
      setStandings(s1.standings || []);
      setScorers(s2.scorers || []);
    } catch { setTableError("Errore caricamento"); }
    finally { setTableLoading(false); }
  }

  async function loadFanta() {
    setFantaLoading(true);
    try {
      const res = await fetch("/api/fanta");
      const data = await res.json();
      setFantaArticles(data.articles || []);
    } catch {} finally { setFantaLoading(false); }
  }

  useEffect(() => { loadNews(true); }, []);

  useEffect(() => {
    if (tab === "live" || tab === "calendar") loadMatches();
    else if (tab === "table") loadTable();
    else if (tab === "fanta") loadFanta();
  }, [tab, leagueFilter]);

  useEffect(() => {
    if (!autoRefresh) return;
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (tab === "news") loadNews(false);
          else if (tab === "live") loadMatches();
          return REFRESH_INTERVAL;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [autoRefresh, tab]);

  function handleManualRefresh() {
    if (tab === "news") loadNews(false);
    else if (tab === "live" || tab === "calendar") loadMatches();
    else if (tab === "table") loadTable();
    else if (tab === "fanta") loadFanta();
    setCountdown(REFRESH_INTERVAL);
  }

  const leagueCounts = useMemo(() => {
    const counts = { all: articles.length };
    LEAGUES.forEach((l) => { if (l.id !== "all") counts[l.id] = 0; });
    articles.forEach((a) => { a.leagues?.forEach((l) => { counts[l] = (counts[l] || 0) + 1; }); });
    return counts;
  }, [articles]);

  const teamsForLeague = useMemo(() => {
    return Object.entries(TEAMS)
      .filter(([, t]) => leagueFilter === "all" || t.league === leagueFilter)
      .map(([id, t]) => ({ id, ...t, count: articles.filter((a) => a.teams?.includes(id)).length }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [leagueFilter, articles]);

  const filteredNews = useMemo(() => {
    let f = articles;
    if (leagueFilter !== "all") f = f.filter((a) => a.leagues?.includes(leagueFilter));
    if (teamFilter) f = f.filter((a) => a.teams?.includes(teamFilter));
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      f = f.filter((a) => a.title.toLowerCase().includes(q) || (a.description || "").toLowerCase().includes(q));
    }
    return f;
  }, [articles, leagueFilter, teamFilter, search]);

  const activeLeague = LEAGUES.find((l) => l.id === leagueFilter);
  const isLoading = newsLoading || matchesLoading || tableLoading || fantaLoading;
  const showLeagueFilter = !["fanta", "radio", "podcast"].includes(tab);

  const TABS = [
    { id: "news", label: "Notizie", icon: Newspaper },
    { id: "live", label: "Risultati", icon: Activity },
    { id: "calendar", label: "Calendario", icon: Calendar },
    { id: "table", label: "Classifica", icon: BarChart3 },
    { id: "fanta", label: "Fanta", icon: Gamepad2 },
    { id: "radio", label: "Radio", icon: Radio },
    { id: "podcast", label: "Podcast", icon: Headphones },
  ];

  return (
    <div className="min-h-screen w-full" style={{ background: "#F4EFE6", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <header className="sticky top-0 z-40 border-b-4" style={{ background: "#0A0A0A", borderColor: activeLeague.color === "#0A0A0A" ? "#E91D5C" : activeLeague.color }}>
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-2 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none" style={{ color: "#F4EFE6", fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.02em" }}>
                Il <span style={{ color: "#E91D5C", fontStyle: "italic" }}>Pallone</span>
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] hidden sm:inline" style={{ color: "#888" }}>Edizione Live</span>
            </div>
            <div className="flex items-center gap-1.5">
              {online ? <Wifi size={14} style={{ color: "#4ADE80" }} /> : <WifiOff size={14} style={{ color: "#FB923C" }} />}
              {tab === "news" && (
                <button onClick={() => setSearchOpen((v) => !v)} className="p-1.5 transition active:scale-95" style={{ background: searchOpen ? "#E91D5C" : "#222", color: "#fff" }}>
                  {searchOpen ? <X size={14} /> : <Search size={14} />}
                </button>
              )}
              <button onClick={handleManualRefresh} disabled={isLoading} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold transition active:scale-95" style={{ background: "#E91D5C", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Agg</span>
              </button>
            </div>
          </div>
          {searchOpen && tab === "news" && (
            <div className="mt-2.5">
              <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca giocatore, allenatore…" className="w-full px-3 py-2 text-sm outline-none" style={{ background: "#1F1F1F", color: "#F4EFE6", border: "1px solid #444", fontFamily: "system-ui, sans-serif" }} />
            </div>
          )}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: "#888", fontFamily: "system-ui, sans-serif" }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: online ? "#4ADE80" : "#FB923C" }} />
              <span>{lastUpdate ? `Agg. ${timeAgo(lastUpdate)} fa` : "Caricamento…"}</span>
            </div>
            <button onClick={() => setAutoRefresh((v) => !v)} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5" style={{ color: autoRefresh ? "#4ADE80" : "#888", fontFamily: "system-ui, sans-serif" }}>
              <Zap size={11} />
              {autoRefresh ? `${countdown}s` : "OFF"}
            </button>
          </div>
        </div>
        {newCount > 0 && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-lg z-50" style={{ background: "#4ADE80", color: "#0A0A0A", fontFamily: "system-ui, sans-serif", animation: "slideDown 0.4s ease" }}>
            ✦ {newCount} {newCount === 1 ? "nuova" : "nuove"}
          </div>
        )}
      </header>

      <div className="sticky z-30" style={{ top: searchOpen && tab === "news" ? "138px" : "94px", background: "#0A0A0A" }}>
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] uppercase tracking-widest font-bold transition relative min-w-[70px]" style={{ color: active ? "#F4EFE6" : "#666", fontFamily: "system-ui, sans-serif" }}>
                <Icon size={12} />
                <span>{t.label}</span>
                {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px]" style={{ background: "#E91D5C" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {showLeagueFilter && (
        <div className="sticky z-20 backdrop-blur-md" style={{ top: searchOpen && tab === "news" ? "180px" : "136px", background: "rgba(244, 239, 230, 0.92)", borderBottom: "1px solid #D4C9B0" }}>
          <div className="max-w-5xl mx-auto px-4 py-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              <Trophy size={11} style={{ color: "#666" }} className="mr-1" />
              {LEAGUES.map((l) => (
                <button key={l.id} onClick={() => { setLeagueFilter(l.id); setTeamFilter(null); }} className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold transition active:scale-95 flex items-center gap-1" style={{ background: leagueFilter === l.id ? l.color : "transparent", color: leagueFilter === l.id ? (isLight(l.color) ? "#000" : "#fff") : "#0A0A0A", border: `1.5px solid ${leagueFilter === l.id ? l.color : "#0A0A0A"}`, fontFamily: "system-ui, sans-serif" }}>
                  <span>{l.icon}</span>
                  <span>{l.name}</span>
                  {tab === "news" && leagueCounts[l.id] > 0 && <span className="opacity-70 text-[9px]">{leagueCounts[l.id]}</span>}
                </button>
              ))}
            </div>
          </div>
          {tab === "news" && teamsForLeague.length > 0 && (
            <div className="max-w-5xl mx-auto px-4 py-2 overflow-x-auto" style={{ borderTop: "1px solid #E5DCC8" }}>
              <div className="flex items-center gap-1.5 min-w-max">
                <Users size={11} style={{ color: "#666" }} className="mr-1" />
                <button onClick={() => setTeamFilter(null)} className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold transition active:scale-95" style={{ background: !teamFilter ? "#0A0A0A" : "transparent", color: !teamFilter ? "#F4EFE6" : "#666", border: `1px solid ${!teamFilter ? "#0A0A0A" : "#999"}`, fontFamily: "system-ui, sans-serif" }}>
                  Tutte
                </button>
                {teamsForLeague.map((t) => (
                  <button key={t.id} onClick={() => setTeamFilter(t.id === teamFilter ? null : t.id)} className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold transition active:scale-95 flex items-center gap-1" style={{ background: teamFilter === t.id ? t.color : "transparent", color: teamFilter === t.id ? (isLight(t.color) ? "#000" : "#fff") : "#0A0A0A", border: `1px solid ${teamFilter === t.id ? t.color : "#999"}`, fontFamily: "system-ui, sans-serif" }}>
                    <span>{t.name}</span>
                    <span className="opacity-60 text-[9px]">{t.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-5">
        <AdBanner size="header" />

        {tab === "news" && <NewsTab loading={newsLoading} articles={filteredNews} search={search} />}
        {tab === "live" && <LiveTab loading={matchesLoading} live={liveMatches} past={pastMatches} activeLeague={activeLeague} error={matchesError} />}
        {tab === "calendar" && <CalendarTab loading={matchesLoading} upcoming={upcomingMatches} activeLeague={activeLeague} error={matchesError} />}
        {tab === "table" && <TableTab loading={tableLoading} standings={standings} scorers={scorers} leagueFilter={leagueFilter} error={tableError} />}
        {tab === "fanta" && <FantaTab loading={fantaLoading} articles={fantaArticles} />}
        {tab === "radio" && <RadioTab />}
        {tab === "podcast" && <PodcastTab activePodcast={activePodcast} setActivePodcast={setActivePodcast} />}

        <AdBanner size="rectangle" />
      </main>

      <footer className="relative z-10 max-w-5xl mx-auto px-4 py-8 mt-8 border-t-2" style={{ borderColor: "#0A0A0A" }}>
        <VisitCounter />
        <p className="text-[10px] uppercase tracking-[0.3em] text-center" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
          ✦ News: Sky · Gazzetta · CDS · Tuttosport · ANSA · CM · TMW ✦<br />
          ✦ Risultati & Tabelle: Football-Data.org ✦<br />
          ✦ Tap su una squadra per vedere rosa, partite e statistiche ✦
        </p>
      </footer>
    </div>
  );
}

function NewsTab({ loading, articles, search }) {
  if (loading && articles.length === 0) {
    return <div className="space-y-4">{[1,2,3,4].map((i) => <div key={i} className="h-28 animate-pulse" style={{ background: "#E5DCC8", animationDelay: `${i*0.1}s` }} />)}</div>;
  }
  if (articles.length === 0) {
    return <div className="py-20 text-center"><p className="text-2xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Nessuna notizia</p><p className="text-sm mt-2" style={{ color: "#666" }}>{search ? `per "${search}"` : "Prova a cambiare filtri"}</p></div>;
  }
  return (
    <>
      {articles[0] && <NewsCard article={articles[0]} isLead />}
      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1" style={{ background: "#0A0A0A" }} />
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ fontFamily: "system-ui, sans-serif" }}>Cronaca</span>
        <div className="h-px flex-1" style={{ background: "#0A0A0A" }} />
      </div>
      <div>{articles.slice(1).map((a) => <NewsCard key={a.id} article={a} />)}</div>
    </>
  );
}

function LiveTab({ loading, live, past, activeLeague, error }) {
  if (loading && live.length === 0 && past.length === 0) {
    return <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-24 animate-pulse" style={{ background: "#E5DCC8" }} />)}</div>;
  }
  if (error) return <ServiceError msg={error} />;
  return (
    <>
      <SectionTitle label="In Corso" accent="#E91D5C" count={live.length} />
      {live.length === 0 ? (
        <p className="text-sm py-3" style={{ color: "#666", fontStyle: "italic" }}>Nessuna partita in corso al momento.</p>
      ) : (
        <div className="space-y-3 mb-7">
          {live.map((m) => <MatchCard key={m.id} match={m} state="live" />)}
        </div>
      )}
      <SectionTitle label={`Risultati · ${activeLeague.name === "Tutti" ? "Serie A" : activeLeague.name}`} accent="#0A0A0A" count={past.length} />
      {past.length === 0 ? (
        <p className="text-sm py-3" style={{ color: "#666", fontStyle: "italic" }}>Nessun risultato disponibile.</p>
      ) : (
        <div className="space-y-3">
          {past.map((m) => <MatchCard key={m.id} match={m} state="finished" />)}
        </div>
      )}
    </>
  );
}

function CalendarTab({ loading, upcoming, activeLeague, error }) {
  if (loading && upcoming.length === 0) {
    return <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-24 animate-pulse" style={{ background: "#E5DCC8" }} />)}</div>;
  }
  if (error) return <ServiceError msg={error} />;
  if (upcoming.length === 0) {
    return <p className="text-center py-12 text-sm" style={{ color: "#666" }}>Nessuna partita programmata.</p>;
  }
  const groups = groupByMatchday(upcoming);
  return (
    <>
      <SectionTitle label={`Calendario · ${activeLeague.name === "Tutti" ? "Serie A" : activeLeague.name}`} accent="#0072CE" count={upcoming.length} />
      {groups.map(([title, matches]) => (
        <div key={title} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] uppercase tracking-[0.3em] font-black px-3 py-1" style={{ background: "#0A0A0A", color: "#F4EFE6", fontFamily: "system-ui, sans-serif" }}>{title}</span>
            <div className="h-px flex-1" style={{ background: "#D4C9B0" }} />
          </div>
          <div className="space-y-2">
            {matches.map((m) => <MatchCard key={m.id} match={m} state="upcoming" />)}
          </div>
        </div>
      ))}
    </>
  );
}

function TableTab({ loading, standings, scorers, leagueFilter, error }) {
  if (leagueFilter === "all") {
    return <div className="py-12 text-center"><p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem" }}>Seleziona un campionato qui sopra</p></div>;
  }
  if (loading) return <div className="space-y-2">{[...Array(8)].map((_, i) => <div key={i} className="h-10 animate-pulse" style={{ background: "#E5DCC8" }} />)}</div>;
  if (error) return <ServiceError msg={error} />;
  if (standings.length === 0) return <p className="text-center py-12 text-sm" style={{ color: "#666" }}>Classifica non disponibile.</p>;

  return (
    <>
      <SectionTitle label="Classifica" accent="#0A0A0A" />
      <p className="text-[11px] mb-3" style={{ color: "#666", fontStyle: "italic" }}>💡 Tap sul nome di una squadra per vederne dettagli</p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="text-[10px] uppercase tracking-widest" style={{ background: "#0A0A0A", color: "#F4EFE6", fontFamily: "system-ui, sans-serif" }}>
              <th className="py-2 px-2 text-left">#</th>
              <th className="py-2 px-2 text-left">Squadra</th>
              <th className="py-2 px-1 text-center">G</th>
              <th className="py-2 px-1 text-center hidden sm:table-cell">V</th>
              <th className="py-2 px-1 text-center hidden sm:table-cell">N</th>
              <th className="py-2 px-1 text-center hidden sm:table-cell">P</th>
              <th className="py-2 px-1 text-center hidden md:table-cell">GF</th>
              <th className="py-2 px-1 text-center hidden md:table-cell">GS</th>
              <th className="py-2 px-1 text-center">DR</th>
              <th className="py-2 px-2 text-center font-black">PT</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => {
              const pos = row.pos || i + 1;
              let rowAccent = "transparent";
              if (pos <= 4) rowAccent = "#0072CE22";
              else if (pos <= 6) rowAccent = "#FF8C0022";
              else if (pos === 7) rowAccent = "#00853E22";
              else if (pos >= standings.length - 2) rowAccent = "#E91D5C22";
              const TeamCell = row.teamId ? Link : "div";
              const teamProps = row.teamId ? { href: `/team/${row.teamId}` } : {};
              return (
                <tr key={i} style={{ background: rowAccent, borderBottom: "1px solid #D4C9B0" }}>
                  <td className="py-2 px-2 font-black text-[11px]" style={{ fontFamily: "system-ui, sans-serif" }}>{pos}</td>
                  <td className="py-2 px-2 font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    <TeamCell {...teamProps} className={row.teamId ? "flex items-center gap-2 hover:underline decoration-1 underline-offset-2" : "flex items-center gap-2"}>
                      {row.badge && <img src={row.badge} alt="" className="w-5 h-5 object-contain" loading="lazy" />}
                      <span className="truncate">{row.team}</span>
                    </TeamCell>
                  </td>
                  <td className="py-2 px-1 text-center text-[12px]" style={{ fontFamily: "system-ui, sans-serif" }}>{row.played}</td>
                  <td className="py-2 px-1 text-center text-[12px] hidden sm:table-cell" style={{ fontFamily: "system-ui, sans-serif" }}>{row.wins}</td>
                  <td className="py-2 px-1 text-center text-[12px] hidden sm:table-cell" style={{ fontFamily: "system-ui, sans-serif" }}>{row.draws}</td>
                  <td className="py-2 px-1 text-center text-[12px] hidden sm:table-cell" style={{ fontFamily: "system-ui, sans-serif" }}>{row.losses}</td>
                  <td className="py-2 px-1 text-center text-[12px] hidden md:table-cell" style={{ fontFamily: "system-ui, sans-serif" }}>{row.gf}</td>
                  <td className="py-2 px-1 text-center text-[12px] hidden md:table-cell" style={{ fontFamily: "system-ui, sans-serif" }}>{row.ga}</td>
                  <td className="py-2 px-1 text-center text-[12px]" style={{ fontFamily: "system-ui, sans-serif" }}>{row.gd > 0 ? "+" : ""}{row.gd}</td>
                  <td className="py-2 px-2 text-center font-black text-base" style={{ fontFamily: "system-ui, sans-serif" }}>{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-widest" style={{ fontFamily: "system-ui, sans-serif", color: "#666" }}>
          <Legend color="#0072CE" label="Champions" />
          <Legend color="#FF8C00" label="Europa" />
          <Legend color="#00853E" label="Conference" />
          <Legend color="#E91D5C" label="Retrocessione" />
        </div>
      </div>

      {scorers.length > 0 && (
        <>
          <SectionTitle label="Capocannonieri" accent="#E91D5C" />
          <div className="space-y-2">
            {scorers.map((s, i) => {
              const TeamWrap = s.teamId ? Link : "div";
              const teamProps = s.teamId ? { href: `/team/${s.teamId}` } : {};
              return (
                <div key={i} className="flex items-center gap-3 p-3" style={{ background: "#FFFFFF", border: "1px solid #D4C9B0" }}>
                  <div className="w-9 h-9 flex items-center justify-center font-black text-sm" style={{ background: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#0A0A0A", color: i < 3 ? "#000" : "#fff", fontFamily: "system-ui, sans-serif" }}>
                    {s.pos}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{s.player}</div>
                    <TeamWrap {...teamProps} className={s.teamId ? "flex items-center gap-1.5 text-[11px] uppercase tracking-wider hover:underline decoration-1 underline-offset-2" : "flex items-center gap-1.5 text-[11px] uppercase tracking-wider"} style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
                      {s.teamBadge && <img src={s.teamBadge} alt="" className="w-3 h-3 object-contain" />}
                      <span>{s.team}</span>
                      {s.assists > 0 && <span className="opacity-60">· {s.assists} ass.</span>}
                    </TeamWrap>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target size={14} style={{ color: "#E91D5C" }} />
                    <span className="font-black text-xl tabular-nums" style={{ fontFamily: "system-ui, sans-serif" }}>{s.goals}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function FantaTab({ loading, articles }) {
  return (
    <>
      <SectionTitle label="Strumenti Fanta" accent="#E91D5C" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-7">
        {FANTA_LINKS.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="block p-3 transition hover:translate-y-[-2px]" style={{ background: "#FFFFFF", border: `2px solid ${link.color}` }}>
            <div className="text-[11px] font-black uppercase tracking-widest mb-0.5" style={{ color: link.color, fontFamily: "system-ui, sans-serif" }}>{link.name}</div>
            <div className="text-[11px]" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>{link.desc}</div>
          </a>
        ))}
      </div>
      <SectionTitle label="Notizie Fanta" accent="#0072CE" count={articles.length} />
      {loading && articles.length === 0 && (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse" style={{ background: "#E5DCC8" }} />)}</div>
      )}
      {!loading && articles.length === 0 && (
        <p className="text-center py-8 text-sm" style={{ color: "#666" }}>Nessuna notizia disponibile.</p>
      )}
      <div>{articles.map((a) => <NewsCard key={a.id} article={a} />)}</div>
    </>
  );
}

function RadioTab() {
  return (
    <>
      <SectionTitle label="Radio Live" accent="#E91D5C" />
      <p className="text-sm mb-6" style={{ color: "#3A3A3A", fontFamily: "Georgia, serif" }}>
        Tocca una radio per aprire la diretta sul sito ufficiale.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RADIOS.map((radio) => (
          <a key={radio.id} href={radio.site} target="_blank" rel="noopener noreferrer" className="block transition active:scale-[0.98] hover:translate-y-[-2px]" style={{ background: "#FFFFFF", border: `2px solid ${radio.color}` }}>
            <div className="flex items-center gap-3 p-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: radio.color, color: isLight(radio.color) ? "#000" : "#fff" }}>
                <Radio size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-lg leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{radio.name}</div>
                <div className="text-[11px] uppercase tracking-wider mt-0.5" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>{radio.desc}</div>
              </div>
              <ExternalLink size={16} style={{ color: "#999" }} className="flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

function PodcastTab({ activePodcast, setActivePodcast }) {
  return (
    <>
      <SectionTitle label="Podcast Calcio" accent="#1ED760" count={PODCASTS.length} />
      <p className="text-sm mb-6" style={{ color: "#3A3A3A", fontFamily: "Georgia, serif" }}>
        I migliori podcast italiani sul calcio. Tocca uno per ascoltarlo direttamente in app.
      </p>
      {activePodcast && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.3em] font-black" style={{ fontFamily: "system-ui, sans-serif" }}>▶ In ascolto</span>
            <button onClick={() => setActivePodcast(null)} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
              <X size={12} /> Chiudi
            </button>
          </div>
          <iframe src={`https://open.spotify.com/embed/show/${activePodcast.spotifyId}?utm_source=generator&theme=0`} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style={{ border: "none" }} />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PODCASTS.map((p) => {
          const isActive = activePodcast?.id === p.id;
          return (
            <button key={p.id} onClick={() => setActivePodcast(isActive ? null : p)} className="text-left transition active:scale-[0.98] hover:translate-y-[-2px]" style={{ background: "#FFFFFF", border: `2px solid ${isActive ? "#1ED760" : p.color}` }}>
              <div className="flex items-start gap-3 p-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: p.color, color: isLight(p.color) ? "#000" : "#fff" }}>
                  <Headphones size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-black text-base leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{p.name}</span>
                    {p.badge && (
                      <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5" style={{ background: p.color, color: isLight(p.color) ? "#000" : "#fff", fontFamily: "system-ui, sans-serif" }}>{p.badge}</span>
                    )}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#888", fontFamily: "system-ui, sans-serif" }}>{p.author}</div>
                  <div className="text-[12px] leading-snug" style={{ color: "#3A3A3A", fontFamily: "Georgia, serif" }}>{p.desc}</div>
                  {isActive && (
                    <div className="text-[10px] uppercase tracking-widest font-bold mt-1.5" style={{ color: "#1ED760", fontFamily: "system-ui, sans-serif" }}>▶ in ascolto</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function SectionTitle({ label, accent, count }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-[3px] w-8" style={{ background: accent }} />
      <span className="text-[11px] uppercase tracking-[0.3em] font-black" style={{ fontFamily: "system-ui, sans-serif", color: "#0A0A0A" }}>
        {label}{count !== undefined && count > 0 && <span className="ml-2 opacity-50">{count}</span>}
      </span>
      <div className="h-px flex-1" style={{ background: "#D4C9B0" }} />
    </div>
  );
}

function Legend({ color, label }) {
  return <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3" style={{ background: color + "22", border: `1px solid ${color}` }} />{label}</span>;
}

function ServiceError({ msg }) {
  return (
    <div className="py-10 text-center">
      <p className="text-base mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Servizio non disponibile</p>
      <p className="text-sm" style={{ color: "#666" }}>{msg}</p>
      <p className="text-[11px] mt-3" style={{ color: "#999" }}>Verifica che FOOTBALL_DATA_API_KEY sia impostata su Vercel.</p>
    </div>
  );
}

function NewsCard({ article, isLead }) {
  if (isLead) {
    return (
      <a href={article.link} target="_blank" rel="noopener noreferrer" className="block mb-7 group">
        <article className="border-l-[6px] pl-5 py-3 transition hover:translate-x-1" style={{ borderColor: article.source.color }}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5" style={{ background: article.source.color, color: "#fff", fontFamily: "system-ui, sans-serif" }}>{article.source.accent}</span>
            {article.teams?.slice(0, 2).map((tid) => {
              const t = TEAMS[tid];
              return <span key={tid} className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5" style={{ background: t.color, color: isLight(t.color) ? "#000" : "#fff", fontFamily: "system-ui, sans-serif" }}>{t.name}</span>;
            })}
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#E91D5C", fontFamily: "system-ui, sans-serif" }}>◆ Apertura</span>
          </div>
          <h2 className="text-2xl sm:text-3xl leading-[1.1] font-black mb-2 group-hover:underline decoration-2 underline-offset-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0A0A0A" }}>{article.title}</h2>
          {article.description && <p className="text-sm leading-relaxed mb-3" style={{ color: "#3A3A3A" }}>{article.description}…</p>}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
            <Clock size={10} />
            <span>{timeAgo(article.pubDate)} fa</span>
            <ExternalLink size={10} className="ml-auto" />
          </div>
        </article>
      </a>
    );
  }
  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer" className="block group border-b py-3.5 transition hover:pl-2" style={{ borderColor: "#D4C9B0" }}>
      <article>
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5" style={{ background: article.source.color, color: "#fff", fontFamily: "system-ui, sans-serif" }}>{article.source.accent}</span>
          {article.teams?.slice(0, 3).map((tid) => {
            const t = TEAMS[tid];
            return <span key={tid} className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5" style={{ background: t.color, color: isLight(t.color) ? "#000" : "#fff", fontFamily: "system-ui, sans-serif" }}>{t.name}</span>;
          })}
          <span className="text-[10px] uppercase tracking-widest ml-auto" style={{ color: "#888", fontFamily: "system-ui, sans-serif" }}>{timeAgo(article.pubDate)}</span>
        </div>
        <h3 className="text-base sm:text-lg leading-[1.2] font-bold group-hover:underline decoration-1 underline-offset-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0A0A0A" }}>{article.title}</h3>
        {article.description && <p className="text-[13px] leading-relaxed mt-1 line-clamp-2" style={{ color: "#555" }}>{article.description}…</p>}
      </article>
    </a>
  );
}

function MatchCard({ match, state }) {
  const showScore = state === "live" || state === "finished";
  const homeScorers = (match.scorers || []).filter((s) => s.team === "home");
  const awayScorers = (match.scorers || []).filter((s) => s.team === "away");
  return (
    <div className="overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #D4C9B0" }}>
      <div className="flex items-center justify-between px-3 py-1.5" style={{ background: state === "live" ? "#E91D5C" : "#F4EFE6" }}>
        {state === "live" ? (
          <div className="flex items-center gap-1.5 live-indicator">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
            <span className="text-[10px] uppercase tracking-widest font-black" style={{ color: "#fff", fontFamily: "system-ui, sans-serif" }}>
              LIVE {match.minute && `· ${match.minute}'`}
            </span>
          </div>
        ) : (
          <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
            {formatMatchDate(match.date)}
          </span>
        )}
        {match.scorers && match.scorers.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold" style={{ color: state === "live" ? "#fff" : "#666", fontFamily: "system-ui, sans-serif" }}>
            <Target size={10} />
            {match.scorers.length}
          </span>
        )}
      </div>
      <div className="px-3 py-2.5 space-y-2">
        <TeamRow team={match.home} teamId={match.homeId} badge={match.homeBadge} score={match.homeScore} showScore={showScore} scorers={homeScorers} state={state} />
        <TeamRow team={match.away} teamId={match.awayId} badge={match.awayBadge} score={match.awayScore} showScore={showScore} scorers={awayScorers} state={state} />
      </div>
    </div>
  );
}

function TeamRow({ team, teamId, badge, score, showScore, scorers, state }) {
  const TeamWrap = teamId ? Link : "div";
  const teamProps = teamId ? { href: `/team/${teamId}` } : {};
  return (
    <div>
      <div className="flex items-center gap-2">
        {badge && <img src={badge} alt="" className="w-5 h-5 object-contain" loading="lazy" />}
        <TeamWrap {...teamProps} className={teamId ? "flex-1 font-bold text-base truncate hover:underline decoration-1 underline-offset-2" : "flex-1 font-bold text-base truncate"} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{team}</TeamWrap>
        {showScore ? (
          <span className="font-black text-xl tabular-nums" style={{ fontFamily: "system-ui, sans-serif", color: state === "live" ? "#E91D5C" : "#0A0A0A", minWidth: "1.5rem", textAlign: "right" }}>
            {score ?? 0}
          </span>
        ) : <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#888", fontFamily: "system-ui, sans-serif" }}>vs</span>}
      </div>
      {scorers && scorers.length > 0 && (
        <div className="ml-7 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]" style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
          {scorers.map((s, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="text-[8px]">⚽</span>
              <span>{s.player}</span>
              {s.minute && <span className="opacity-60">{s.minute}</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
