import { LEAGUES } from "@/lib/config";

const FD = "https://api.football-data.org/v4";
let cache = new Map();
const CACHE_MS = 10 * 60 * 1000;

async function fdFetch(endpoint) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) throw new Error("FOOTBALL_DATA_API_KEY mancante.");
  try {
    const res = await fetch(`${FD}${endpoint}`, {
      headers: { "X-Auth-Token": apiKey },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`[scorers] ${err.message}`);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("league") || "seriea";
  const cacheKey = `scorers-${leagueId}`;

  if (cache.has(cacheKey)) {
    const entry = cache.get(cacheKey);
    if (Date.now() - entry.time < CACHE_MS) {
      return Response.json({ ...entry.data, cached: true });
    }
  }

  try {
    const league = LEAGUES.find((l) => l.id === leagueId);
    if (!league?.footballData) {
      return Response.json({ scorers: [], error: "Lega non supportata" });
    }
    const data = await fdFetch(`/competitions/${league.footballData}/scorers?limit=15`);
    if (!data?.scorers?.length) {
      return Response.json({ scorers: [], error: "Classifica marcatori non disponibile" });
    }
    const scorers = data.scorers.map((s, i) => ({
      pos: i + 1,
      player: s.player?.name || "—",
      team: s.team?.shortName || s.team?.name || "—",
      teamId: s.team?.id,
      teamBadge: s.team?.crest,
      goals: s.goals || 0,
      assists: s.assists || 0,
      penalties: s.penalties || 0,
      playedMatches: s.playedMatches || 0,
      nationality: s.player?.nationality,
    }));
    const result = { scorers };
    cache.set(cacheKey, { data: result, time: Date.now() });
    return Response.json({ ...result, cached: false });
  } catch (err) {
    return Response.json({ error: err.message, scorers: [] }, { status: 500 });
  }
}
