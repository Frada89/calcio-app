import { LEAGUES } from "@/lib/config";

const FD = "https://api.football-data.org/v4";
let cache = new Map();
const CACHE_MS = 5 * 60 * 1000;

async function fdFetch(endpoint) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) throw new Error("FOOTBALL_DATA_API_KEY mancante. Aggiungi la variabile su Vercel.");
  try {
    const res = await fetch(`${FD}${endpoint}`, {
      headers: { "X-Auth-Token": apiKey },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`[standings] ${err.message}`);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("league") || "seriea";
  const cacheKey = `standings-${leagueId}`;

  if (cache.has(cacheKey)) {
    const entry = cache.get(cacheKey);
    if (Date.now() - entry.time < CACHE_MS) {
      return Response.json({ ...entry.data, cached: true });
    }
  }

  try {
    const league = LEAGUES.find((l) => l.id === leagueId);
    if (!league?.footballData) {
      return Response.json({ standings: [], error: "Lega non supportata" });
    }
    const data = await fdFetch(`/competitions/${league.footballData}/standings`);
    if (!data?.standings?.length) {
      return Response.json({ standings: [], error: "Classifica non disponibile" });
    }
    const totalTable = data.standings.find((s) => s.type === "TOTAL") || data.standings[0];
    const standings = (totalTable.table || []).map((row, i) => ({
      pos: row.position || i + 1,
      team: row.team?.shortName || row.team?.name,
      badge: row.team?.crest,
      played: row.playedGames || 0,
      wins: row.won || 0,
      draws: row.draw || 0,
      losses: row.lost || 0,
      gf: row.goalsFor || 0,
      ga: row.goalsAgainst || 0,
      gd: row.goalDifference || 0,
      points: row.points || 0,
      form: row.form || "",
    }));
    const result = { standings, season: data.season?.startDate?.slice(0, 4) };
    cache.set(cacheKey, { data: result, time: Date.now() });
    return Response.json({ ...result, cached: false });
  } catch (err) {
    return Response.json({ error: err.message, standings: [] }, { status: 500 });
  }
}
