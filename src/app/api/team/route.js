// ============================================
// API TEAM — Strategia ibrida:
// - football-data.org per le partite (illimitato)
// - api-football.com per info squadra + rosa (limite 100/giorno)
// Cache aggressiva sulla rosa per non sprecare le chiamate.
// ============================================

const FD = "https://api.football-data.org/v4";
const AF = "https://v3.football.api-sports.io";

// Cache separate
let matchesCache = new Map();
let teamInfoCache = new Map();
const MATCHES_CACHE_MS = 5 * 60 * 1000;       // 5 minuti per le partite
const TEAM_INFO_CACHE_MS = 60 * 60 * 1000;    // 1 ORA per info+rosa (per risparmiare chiamate API-Football)

// =================== FOOTBALL-DATA.ORG ===================
async function fdFetch(endpoint) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`${FD}${endpoint}`, {
      headers: { "X-Auth-Token": apiKey },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error(`[team-fd] ${endpoint}: HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[team-fd] ${err.message}`);
    return null;
  }
}

function normalizeMatchFD(m) {
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
    matchday: m.matchday,
    league: m.competition?.name,
  };
}

function computeForm(matches, teamId) {
  const finished = matches
    .filter((m) => m.status === "FINISHED")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  return finished.map((m) => {
    const isHome = m.homeId === teamId;
    const myScore = isHome ? m.homeScore : m.awayScore;
    const oppScore = isHome ? m.awayScore : m.homeScore;
    if (myScore == null || oppScore == null) return { result: "—", match: m };
    if (myScore > oppScore) return { result: "V", match: m };
    if (myScore < oppScore) return { result: "P", match: m };
    return { result: "N", match: m };
  });
}

async function getMatches(teamId) {
  const cacheKey = `m-${teamId}`;
  if (matchesCache.has(cacheKey)) {
    const entry = matchesCache.get(cacheKey);
    if (Date.now() - entry.time < MATCHES_CACHE_MS) return entry.data;
  }

  const today = new Date();
  const from = new Date(today.getTime() - 60 * 86400000).toISOString().split("T")[0];
  const to = new Date(today.getTime() + 60 * 86400000).toISOString().split("T")[0];
  const matchesData = await fdFetch(`/teams/${teamId}/matches?dateFrom=${from}&dateTo=${to}`);

  const allMatches = (matchesData?.matches || []).map(normalizeMatchFD);
  const past = allMatches
    .filter((m) => m.status === "FINISHED")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  const upcoming = allMatches
    .filter((m) => ["SCHEDULED", "TIMED"].includes(m.status))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);
  const form = computeForm(allMatches, parseInt(teamId));

  const data = { past, upcoming, form };
  matchesCache.set(cacheKey, { data, time: Date.now() });
  return data;
}

// =================== API-FOOTBALL ===================
async function afFetch(endpoint) {
  const apiKey = process.env.APIFOOTBALL_KEY;
  if (!apiKey) {
    console.error("[team-af] APIFOOTBALL_KEY mancante");
    return null;
  }
  try {
    const res = await fetch(`${AF}${endpoint}`, {
      headers: { "x-apisports-key": apiKey },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`[team-af] ${endpoint}: HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[team-af] errors:`, data.errors);
    }
    return data;
  } catch (err) {
    console.error(`[team-af] ${err.message}`);
    return null;
  }
}

// Mappa nomi/ID football-data → API-Football
// Per ora cerchiamo per nome — semplice ma efficace
async function findApiFootballTeamId(teamName) {
  const data = await afFetch(`/teams?search=${encodeURIComponent(teamName)}`);
  if (!data?.response?.length) return null;
  // Prendi il primo risultato (migliore match)
  return data.response[0].team?.id;
}

function groupSquadByPosition(players) {
  const groups = {
    Portieri: [],
    Difensori: [],
    Centrocampisti: [],
    Attaccanti: [],
  };
  players.forEach((entry) => {
    const p = entry.player || entry; // gestisce entrambe le strutture
    const pos = (p.position || "").toLowerCase();
    const player = {
      id: p.id,
      name: p.name,
      shirtNumber: p.number || p.shirtNumber,
      nationality: p.nationality,
      dateOfBirth: p.birth?.date || p.dateOfBirth,
      position: p.position,
      photo: p.photo,
      age: p.age,
    };
    if (pos === "goalkeeper" || pos.includes("goalkeeper")) groups.Portieri.push(player);
    else if (pos === "defender" || pos.includes("defender") || pos.includes("defence") || pos.includes("back")) groups.Difensori.push(player);
    else if (pos === "midfielder" || pos.includes("midfield")) groups.Centrocampisti.push(player);
    else if (pos === "attacker" || pos.includes("attacker") || pos.includes("forward") || pos.includes("striker") || pos.includes("winger")) groups.Attaccanti.push(player);
  });
  Object.values(groups).forEach((arr) => {
    arr.sort((a, b) => {
      if (a.shirtNumber && b.shirtNumber) return a.shirtNumber - b.shirtNumber;
      if (a.shirtNumber) return -1;
      if (b.shirtNumber) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
  });
  return groups;
}

async function getTeamInfo(teamId, teamNameHint) {
  const cacheKey = `t-${teamId}`;
  if (teamInfoCache.has(cacheKey)) {
    const entry = teamInfoCache.get(cacheKey);
    if (Date.now() - entry.time < TEAM_INFO_CACHE_MS) return entry.data;
  }

  // 1) Info base dalla football-data (nome esatto, stemma)
  const fdInfo = await fdFetch(`/teams/${teamId}`);
  const teamName = fdInfo?.name || teamNameHint;

  // 2) Trova team su API-Football
  let afTeamId = null;
  let afInfo = null;
  let squad = { Portieri: [], Difensori: [], Centrocampisti: [], Attaccanti: [] };

  if (teamName) {
    afTeamId = await findApiFootballTeamId(teamName);

    if (afTeamId) {
      // Info dettagliate
      const teamData = await afFetch(`/teams?id=${afTeamId}`);
      const teamInfo = teamData?.response?.[0];
      if (teamInfo) {
        afInfo = {
          name: teamInfo.team?.name,
          founded: teamInfo.team?.founded,
          logo: teamInfo.team?.logo,
          country: teamInfo.team?.country,
          venueName: teamInfo.venue?.name,
          venueCity: teamInfo.venue?.city,
          venueCapacity: teamInfo.venue?.capacity,
          venueImage: teamInfo.venue?.image,
        };
      }

      // Rosa giocatori
      const squadData = await afFetch(`/players/squads?team=${afTeamId}`);
      const players = squadData?.response?.[0]?.players || [];
      squad = groupSquadByPosition(players);
    }
  }

  // Combina info: priorità API-Football ma fallback su football-data
  const info = {
    id: teamId,
    name: fdInfo?.name || afInfo?.name || teamName || "—",
    shortName: fdInfo?.shortName || fdInfo?.name,
    tla: fdInfo?.tla,
    crest: fdInfo?.crest || afInfo?.logo,
    founded: afInfo?.founded || fdInfo?.founded || null,
    venue: afInfo?.venueName || fdInfo?.venue || null,
    venueCity: afInfo?.venueCity || (fdInfo?.address ? fdInfo.address.split(",")[0] : null),
    venueCapacity: afInfo?.venueCapacity,
    address: fdInfo?.address,
    clubColors: fdInfo?.clubColors,
    website: fdInfo?.website,
    coach: fdInfo?.coach ? {
      name: fdInfo.coach.name,
      nationality: fdInfo.coach.nationality,
    } : null,
    competitions: (fdInfo?.runningCompetitions || []).map((c) => ({
      name: c.name,
      emblem: c.emblem,
    })),
  };

  const data = { info, squad };
  teamInfoCache.set(cacheKey, { data, time: Date.now() });
  return data;
}

// =================== HANDLER ===================
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("id");
  if (!teamId) {
    return Response.json({ error: "ID squadra mancante" }, { status: 400 });
  }

  try {
    // Carica in parallelo: matches da football-data, info+rosa da API-Football
    const [matches, teamInfo] = await Promise.all([
      getMatches(teamId),
      getTeamInfo(teamId),
    ]);

    return Response.json({
      info: teamInfo.info,
      squad: teamInfo.squad,
      past: matches.past,
      upcoming: matches.upcoming,
      form: matches.form,
    });
  } catch (err) {
    console.error("[team] error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
