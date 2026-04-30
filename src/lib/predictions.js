// ============================================
// ALGORITMO PRONOSTICI v1
// Genera pronostici basati su:
// - Posizione in classifica
// - Forma recente (V/N/P ultime 5)
// - Fattore casa
// ============================================

/**
 * Calcola la "forza" di una squadra (0-100)
 * @param {Object} stats - {position, totalTeams, points, form}
 * @returns {number} forza 0-100
 */
function teamStrength(stats) {
  const { position = 10, totalTeams = 20, points = 0, form = "" } = stats;

  // 1. Forza basata sulla posizione (1° = 100, ultimo = 0)
  const posScore = ((totalTeams - position + 1) / totalTeams) * 100;

  // 2. Forza basata sulla forma (V=3, N=1, P=0, max 15 punti = 100%)
  let formScore = 50; // default
  if (form && form.length > 0) {
    const formChars = form.toUpperCase().split("").slice(-5); // ultime 5
    const formPoints = formChars.reduce((sum, c) => {
      if (c === "W" || c === "V") return sum + 3;
      if (c === "D" || c === "N") return sum + 1;
      return sum;
    }, 0);
    const maxPoints = formChars.length * 3;
    formScore = maxPoints > 0 ? (formPoints / maxPoints) * 100 : 50;
  }

  // Mix: 60% classifica, 40% forma
  return posScore * 0.6 + formScore * 0.4;
}

/**
 * Genera pronostico per una partita
 * @param {Object} homeStats - statistiche squadra di casa
 * @param {Object} awayStats - statistiche squadra in trasferta
 * @returns {Object} { result: '1'|'X'|'2', score: '2-1', confidence: 0-100, label: 'Inter favorita' }
 */
export function predictMatch(homeStats, awayStats) {
  const HOME_BONUS = 8; // fattore casa: ~8 punti di vantaggio

  const homeStr = teamStrength(homeStats) + HOME_BONUS;
  const awayStr = teamStrength(awayStats);

  const diff = homeStr - awayStr;
  const homeName = homeStats.name || "Casa";
  const awayName = awayStats.name || "Ospite";

  let result, label, score, confidence;

  if (diff > 18) {
    result = "1";
    label = `${homeName} nettamente favorita`;
    score = "2-0";
    confidence = Math.min(80, 50 + diff);
  } else if (diff > 8) {
    result = "1";
    label = `${homeName} favorita`;
    score = "2-1";
    confidence = Math.min(70, 45 + diff);
  } else if (diff > -8) {
    // Equilibrato → pareggio o 1X
    if (diff > 0) {
      result = "1X";
      label = "Equilibrio, leggero vantaggio casa";
      score = "1-1";
      confidence = 45;
    } else {
      result = "X2";
      label = "Equilibrio, leggero vantaggio ospite";
      score = "1-1";
      confidence = 45;
    }
  } else if (diff > -18) {
    result = "2";
    label = `${awayName} favorita`;
    score = "1-2";
    confidence = Math.min(70, 45 + Math.abs(diff));
  } else {
    result = "2";
    label = `${awayName} nettamente favorita`;
    score = "0-2";
    confidence = Math.min(80, 50 + Math.abs(diff));
  }

  return {
    result,
    label,
    score,
    confidence: Math.round(confidence),
    homeStrength: Math.round(homeStr),
    awayStrength: Math.round(awayStr),
  };
}

/**
 * Helper: cerca le statistiche di una squadra dalla classifica
 */
export function getTeamStats(teamId, teamName, standings) {
  if (!standings || standings.length === 0) {
    return { name: teamName, position: 10, totalTeams: 20, points: 0, form: "" };
  }

  const row = standings.find(
    (s) => s.teamId === teamId || s.team === teamName ||
    (teamName && s.team && (s.team.includes(teamName) || teamName.includes(s.team)))
  );

  if (!row) {
    return { name: teamName, position: standings.length, totalTeams: standings.length, points: 0, form: "" };
  }

  return {
    name: teamName,
    position: row.pos || 10,
    totalTeams: standings.length,
    points: row.points || 0,
    form: row.form || "",
  };
}

/**
 * Genera testo per condivisione
 */
export function buildShareText(matchday, predictions) {
  const lines = [
    `⚽ Pronostici Il Pallone — Giornata ${matchday}`,
    `📅 ${new Date().toLocaleDateString("it-IT")}`,
    "",
  ];
  predictions.forEach((p) => {
    const arrow = p.result === "1" ? "→ 1" : p.result === "2" ? "→ 2" : `→ ${p.result}`;
    lines.push(`${p.home} - ${p.away}  ${arrow}  (${p.score})`);
  });
  lines.push("", "Generato da https://calcio-app.vercel.app");
  return lines.join("\n");
}
