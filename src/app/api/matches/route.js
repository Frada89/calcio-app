import { LEAGUES } from "@/lib/config";

const FD = "https://api.football-data.org/v4";
let cache = new Map();
const CACHE_MS = 60 * 1000;

async function fdFetch(endpoint) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) throw new Error("FOOTBALL_DATA_API_KEY mancante. Aggiungi la variabile su Vercel.");
  try {
    const res = await fetch(`${FD}${endpoint}`, {
      headers: { "X-Auth-Token": apiKey },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`[matches] ${endpoint}: HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[matches] ${endpoint}: ${err.message}`);
    return null;
  }
}

function normalizeMatch(m) {
  const goals = (m.goals || []).map((g) => ({
    player: g.scorer?.name || "—",
    minute: g.minute ? `${g.minute}'` : "",
    team: m.homeTeam?.id === g.team?.id ? "home" : "away",
    type: g.type || "REGULAR",
  }));
  return {
    id: m.id,
    home: m.homeTeam?.shortName || m.homeTeam?.name || "—",
    homeId: m.homeTeam?.id,
    homeBadge: m.homeTeam?.crest,
    away: m.awayTeam?.shortName || m.awayTeam?.name || "—",
    awayId: m.awayTeam?.id,
    awayBadge: m.awayTeam?.crest,
    homeScore: m.score?.fullTime?.home ?? null,
    awayScore: m.score?.fullTime?.away ?? null,
    date: m.utcDate,
    status: m.status,
    minute: m.minute,
    matchday: m.matchday,
    league: m.competition?.name,
    scorers: goals,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("league") || "seriea";
  const cacheKey = `matches-${leagueId}`;

  if (cache.has(cacheKey)) {
    const entry = cache.get(cacheKey);
    if (Date.now() - entry.time < CACHE_MS) {
      return Response.json({ ...entry.data, cached: true });
    }
  }

  try {
    const league = LEAGUES.find((l) => l.id === leagueId);
    const compId = league?.footballData || "SA";

    const today = new Date();
    const from = new Date(today.getTime() - 10 * 86400000).toISOString().split("T")[0];
    const to = new Date(today.getTime() + 30 * 86400000).toISOString().split("T")[0];

    const data = await fdFetch(`/competitions/${compId}/matches?dateFrom=${from}&dateTo=${to}`);
    if (!data?.matches) {
      return Response.json({ live: [], past: [], upcoming: [], error: "Nessun dato" });
    }

    const matches = data.matches.map(normalizeMatch);
    const now = Date.now();
    const live = matches.filter((m) => ["LIVE", "IN_PLAY", "PAUSED"].includes(m.status));
    const past = matches
      .filter((m) => m.status === "FINISHED")
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15);
    const upcoming = matches
      .filter((m) => ["SCHEDULED", "TIMED"].includes(m.status) && new Date(m.date).getTime() > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 30);

    const result = { live, past, upcoming };
    cache.set(cacheKey, { data: result, time: Date.now() });
    return Response.json({ ...result, cached: false });
  } catch (err) {
    return Response.json({ error: err.message, live: [], past: [], upcoming: [] }, { status: 500 });
  }
}
