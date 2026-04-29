// ============================================
// FONTI: TUTTE ITALIANE
// ============================================
export const FEEDS = [
  { id: "skycalcio", name: "Sky Calcio", url: "https://sport.sky.it/rss/calcio.xml", color: "#0072CE", accent: "SKY", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "skymercato", name: "Sky Mercato", url: "https://sport.sky.it/rss/calciomercato.xml", color: "#0072CE", accent: "SKY", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "gazzetta", name: "Gazzetta", url: "https://www.gazzetta.it/rss/calcio.xml", color: "#E91D5C", accent: "GDS", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "gazzettamercato", name: "Gazzetta Mercato", url: "https://www.gazzetta.it/rss/calciomercato.xml", color: "#E91D5C", accent: "GDS", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "corsport", name: "Corriere Sport", url: "https://www.corrieredellosport.it/rss/calcio", color: "#00853E", accent: "CDS", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "corsportmercato", name: "CDS Mercato", url: "https://www.corrieredellosport.it/rss/calciomercato", color: "#00853E", accent: "CDS", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "tuttosport", name: "Tuttosport", url: "https://www.tuttosport.com/rss/calciomercato", color: "#FFCC00", accent: "TS", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "ansa", name: "ANSA Calcio", url: "https://www.ansa.it/sito/notizie/sport/calcio/calcio_rss.xml", color: "#1A1A1A", accent: "ANSA", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "calciomercato", name: "Calciomercato.com", url: "https://www.calciomercato.com/rss", color: "#D32F2F", accent: "CM", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "tmw", name: "TMW", url: "https://www.tuttomercatoweb.com/rss", color: "#0D47A1", accent: "TMW", leagues: ["seriea", "premier", "liga", "bundes", "ligue1", "ucl"] },
  { id: "tmwpremier", name: "TMW Premier", url: "https://www.tuttomercatoweb.com/premier-league/rss", color: "#0D47A1", accent: "TMW-EN", leagues: ["premier"] },
  { id: "tmwliga", name: "TMW Liga", url: "https://www.tuttomercatoweb.com/liga/rss", color: "#0D47A1", accent: "TMW-ES", leagues: ["liga"] },
  { id: "tmwbundes", name: "TMW Bundes", url: "https://www.tuttomercatoweb.com/bundesliga/rss", color: "#0D47A1", accent: "TMW-DE", leagues: ["bundes"] },
  { id: "tmwligue1", name: "TMW Ligue 1", url: "https://www.tuttomercatoweb.com/ligue-1/rss", color: "#0D47A1", accent: "TMW-FR", leagues: ["ligue1"] },
];

// ============================================
// FEED FANTACALCIO
// ============================================
export const FANTA_FEEDS = [
  { id: "sosfanta", name: "SOS Fanta", url: "https://www.sosfanta.com/feed/", color: "#E91D5C", accent: "SOS" },
  { id: "fantacalcio", name: "Fantacalcio.it", url: "https://www.fantacalcio.it/rss/news.xml", color: "#0072CE", accent: "FCIT" },
  { id: "fantamaster", name: "FantaMaster", url: "https://www.fantamaster.it/feed/", color: "#FF6B00", accent: "FM" },
  { id: "tmwfanta", name: "TMW Fanta", url: "https://www.tuttomercatoweb.com/fantanews/rss", color: "#0D47A1", accent: "TMW-F" },
];

export const FANTA_LINKS = [
  { name: "Fantacalcio.it", url: "https://www.fantacalcio.it", desc: "Quotazioni, voti, probabili", color: "#0072CE" },
  { name: "SOS Fanta", url: "https://www.sosfanta.com", desc: "Consigli e formazioni", color: "#E91D5C" },
  { name: "FantaMaster", url: "https://www.fantamaster.it", desc: "Statistiche e analisi", color: "#FF6B00" },
  { name: "Probabili Form.", url: "https://www.fantacalcio.it/probabili-formazioni-serie-a", desc: "Probabili formazioni Serie A", color: "#00853E" },
  { name: "Voti Live", url: "https://www.fantacalcio.it/voti-fantacalcio-serie-a", desc: "Voti e fantavoti live", color: "#D32F2F" },
  { name: "Indisponibili", url: "https://www.fantacalcio.it/indisponibili-serie-a", desc: "Squalificati e infortunati", color: "#8E1F2F" },
  { name: "Calendario", url: "https://www.fantacalcio.it/calendario-serie-a", desc: "Calendario Serie A", color: "#1B2842" },
  { name: "Top Player", url: "https://www.fantacalcio.it/top-player-fantacalcio", desc: "I migliori per ruolo", color: "#FFD700" },
];

// ============================================
// RADIO LIVE — apre il sito ufficiale
// ============================================
export const RADIOS = [
  { id: "sportiva", name: "Radio Sportiva", desc: "La radio nazionale del calcio", site: "https://www.radiosportiva.com/streaming", color: "#E91D5C" },
  { id: "raisport", name: "Rai Radio Sport", desc: "RAI - Sport e attualità", site: "https://www.raiplaysound.it/dirette/rairadiosport", color: "#0072CE" },
  { id: "tmwradio", name: "TMW Radio", desc: "Tutto Mercato Web Radio", site: "https://www.tmwradio.com/diretta", color: "#0D47A1" },
  { id: "centrosuono", name: "Centro Suono Sport", desc: "La voce del tifoso romano", site: "https://www.centrosuonosport.it", color: "#FFD700" },
  { id: "kissrosa", name: "Kiss Kiss Napoli", desc: "La radio del Napoli", site: "https://www.radiokisskissnapoli.it/diretta-2/", color: "#0F75BC" },
  { id: "rmc", name: "RMC Sport", desc: "Radio Monte Carlo Sport", site: "https://www.radiomontecarlo.net/sezioni/2090/sport", color: "#000000" },
];

// ============================================
// PODCAST CALCIO ITALIANI — embed Spotify
// ============================================
export const PODCASTS = [
  {
    id: "skyunplugged",
    name: "Sky Calcio Unplugged",
    author: "Sky Sport · Lisa Offside, Di Marzio, Borghi",
    desc: "Il talk del weekend tra Serie A, coppe e fantacalcio",
    spotifyId: "1l0uDqW9q8sDvVlFAV6Hpf",
    color: "#0072CE",
    badge: "Sky",
  },
  {
    id: "skymercato",
    name: "Sky Calciomercato",
    author: "Sky Sport",
    desc: "L'edizione di calciomercato di Sky Sport 24",
    spotifyId: "7tUAIFi7lGQOOIYJp0eUEG",
    color: "#0072CE",
    badge: "Sky",
  },
  {
    id: "lariserva",
    name: "La Riserva",
    author: "Fenomeno · Atturo, Manusia, Conte",
    desc: "L'attualità del calcio raccontata con leggerezza e competenza",
    spotifyId: "1OixKemHxllz2VqQ2L86Yi",
    color: "#FF6B00",
    badge: "Top",
  },
  {
    id: "pendolino",
    name: "Pendolino",
    author: "Fenomeno · Ultimo Uomo",
    desc: "Calciomercato vivace e irriverente",
    spotifyId: "57S9Oz4lpyrFrfX5yYTEgY",
    color: "#E91D5C",
    badge: "Mercato",
  },
  {
    id: "calcioconta",
    name: "Il Calcio che Conta",
    author: "Storia del calcio",
    desc: "Storia del calcio: partite e azioni che hanno cambiato lo sport",
    spotifyId: "23kGqlSgzjmKdyVnDzNPeV",
    color: "#1B2842",
    badge: "Storia",
  },
  {
    id: "calciogiuoco",
    name: "Il Calcio non è un Giuoco",
    author: "DMTC Sport · Bacconi, Caputi",
    desc: "Calcio analitico: tattica, dati, intelligenza artificiale",
    spotifyId: "3UDOd2igdF8VSYpnrRbNMJ",
    color: "#00853E",
    badge: "Tattica",
  },
  {
    id: "calciothesquad",
    name: "CALCIO.",
    author: "The Squad",
    desc: "Tattica, tecnica, cose di campo da chi il calcio lo vive",
    spotifyId: "2gom39VXuXoj0ecFbYfkVa",
    color: "#592C82",
    badge: "Tecnica",
  },
];

// ============================================
// LEGHE
// ============================================
export const LEAGUES = [
  { id: "all", name: "Tutti", color: "#0A0A0A", icon: "✦", footballData: null },
  { id: "seriea", name: "Serie A", color: "#008FD7", icon: "🇮🇹", footballData: "SA" },
  { id: "premier", name: "Premier", color: "#3D195B", icon: "🏴", footballData: "PL" },
  { id: "liga", name: "La Liga", color: "#EE8707", icon: "🇪🇸", footballData: "PD" },
  { id: "bundes", name: "Bundesliga", color: "#D20515", icon: "🇩🇪", footballData: "BL1" },
  { id: "ligue1", name: "Ligue 1", color: "#091C3E", icon: "🇫🇷", footballData: "FL1" },
  { id: "ucl", name: "Champions", color: "#00164E", icon: "★", footballData: "CL" },
];

// ============================================
// SQUADRE
// ============================================
export const TEAMS = {
  inter: { name: "Inter", league: "seriea", color: "#0068A8", keywords: ["inter ", "nerazzurr", "interisti", "biscione"] },
  milan: { name: "Milan", league: "seriea", color: "#FB090B", keywords: ["milan ", "rossoner", "diavolo", "milanisti"] },
  juventus: { name: "Juventus", league: "seriea", color: "#000000", keywords: ["juventus", "juve ", "bianconer", "vecchia signora"] },
  napoli: { name: "Napoli", league: "seriea", color: "#0F75BC", keywords: ["napoli", "partenope"] },
  roma: { name: "Roma", league: "seriea", color: "#8E1F2F", keywords: ["roma ", "giallorosso", "giallorossi", "as roma"] },
  lazio: { name: "Lazio", league: "seriea", color: "#87CEEB", keywords: ["lazio", "biancocelest", "aquile"] },
  atalanta: { name: "Atalanta", league: "seriea", color: "#1B2842", keywords: ["atalanta", "dea", "bergamasch"] },
  fiorentina: { name: "Fiorentina", league: "seriea", color: "#592C82", keywords: ["fiorentina", "viola"] },
  bologna: { name: "Bologna", league: "seriea", color: "#9B1B30", keywords: ["bologna", "rossoblù", "felsineo"] },
  torino: { name: "Torino", league: "seriea", color: "#8E1B0F", keywords: ["torino", "granata", "toro "] },
  genoa: { name: "Genoa", league: "seriea", color: "#C8102E", keywords: ["genoa", "grifone"] },
  como: { name: "Como", league: "seriea", color: "#0067B1", keywords: ["como ", "lariani"] },
  udinese: { name: "Udinese", league: "seriea", color: "#000000", keywords: ["udinese", "friulan"] },
  cagliari: { name: "Cagliari", league: "seriea", color: "#A50012", keywords: ["cagliari"] },
  parma: { name: "Parma", league: "seriea", color: "#FFD700", keywords: ["parma", "ducali", "crociati"] },
  verona: { name: "Verona", league: "seriea", color: "#0E2C40", keywords: ["verona", "hellas", "scaliger"] },
  lecce: { name: "Lecce", league: "seriea", color: "#FFFF00", keywords: ["lecce", "salentini"] },
  pisa: { name: "Pisa", league: "seriea", color: "#0066CC", keywords: ["pisa "] },
  cremonese: { name: "Cremonese", league: "seriea", color: "#A50026", keywords: ["cremonese", "grigiorossi"] },
  sassuolo: { name: "Sassuolo", league: "seriea", color: "#00A551", keywords: ["sassuolo", "neroverdi"] },
  mancity: { name: "Man City", league: "premier", color: "#6CABDD", keywords: ["manchester city", "man city", "city ", "citizens"] },
  manutd: { name: "Man United", league: "premier", color: "#DA291C", keywords: ["manchester united", "man united", "man utd", "red devils"] },
  liverpool: { name: "Liverpool", league: "premier", color: "#C8102E", keywords: ["liverpool", "anfield"] },
  arsenal: { name: "Arsenal", league: "premier", color: "#EF0107", keywords: ["arsenal", "gunners"] },
  chelsea: { name: "Chelsea", league: "premier", color: "#034694", keywords: ["chelsea"] },
  tottenham: { name: "Tottenham", league: "premier", color: "#132257", keywords: ["tottenham", "spurs"] },
  newcastle: { name: "Newcastle", league: "premier", color: "#241F20", keywords: ["newcastle", "magpies"] },
  astonvilla: { name: "Aston Villa", league: "premier", color: "#670E36", keywords: ["aston villa", "villa "] },
  westham: { name: "West Ham", league: "premier", color: "#7A263A", keywords: ["west ham", "hammers"] },
  everton: { name: "Everton", league: "premier", color: "#003399", keywords: ["everton", "toffees"] },
  realmadrid: { name: "Real Madrid", league: "liga", color: "#FFFFFF", keywords: ["real madrid", "merengues", "blancos"] },
  barcelona: { name: "Barcelona", league: "liga", color: "#A50044", keywords: ["barcelona", "barça", "barca ", "blaugrana", "culés"] },
  atletico: { name: "Atlético", league: "liga", color: "#CB3524", keywords: ["atlético", "atletico madrid", "colchoneros"] },
  athletic: { name: "Athletic", league: "liga", color: "#EE2523", keywords: ["athletic bilbao", "athletic club"] },
  sevilla: { name: "Sevilla", league: "liga", color: "#D00027", keywords: ["sevilla", "siviglia"] },
  villarreal: { name: "Villarreal", league: "liga", color: "#FFE667", keywords: ["villarreal", "submarino"] },
  realsociedad: { name: "Real Sociedad", league: "liga", color: "#143C8B", keywords: ["real sociedad"] },
  betis: { name: "Real Betis", league: "liga", color: "#00954C", keywords: ["betis", "verdiblancos"] },
  bayern: { name: "Bayern", league: "bundes", color: "#DC052D", keywords: ["bayern monaco", "bayern münchen", "bayern munich", "fc bayern"] },
  dortmund: { name: "Dortmund", league: "bundes", color: "#FDE100", keywords: ["dortmund", "borussia dortmund", "bvb"] },
  leverkusen: { name: "Leverkusen", league: "bundes", color: "#E32219", keywords: ["leverkusen", "bayer 04", "werkself"] },
  leipzig: { name: "Leipzig", league: "bundes", color: "#DD0741", keywords: ["lipsia", "leipzig", "rb leipzig"] },
  frankfurt: { name: "Eintracht", league: "bundes", color: "#E1000F", keywords: ["francoforte", "frankfurt", "eintracht"] },
  stuttgart: { name: "Stuttgart", league: "bundes", color: "#E32219", keywords: ["stoccarda", "stuttgart", "vfb"] },
  psg: { name: "PSG", league: "ligue1", color: "#004170", keywords: ["psg", "paris saint", "paris sg", "parigini"] },
  marseille: { name: "Marsiglia", league: "ligue1", color: "#2FAEE0", keywords: ["marsiglia", "marseille", "olympique de marseille", "om "] },
  monaco: { name: "Monaco", league: "ligue1", color: "#E51B23", keywords: ["monaco ", "monégasques", "principato"] },
  lyon: { name: "Lione", league: "ligue1", color: "#DA001A", keywords: ["lione", "lyon", "olympique lyonnais", "ol "] },
  lille: { name: "Lille", league: "ligue1", color: "#E01E13", keywords: ["lille", "losc", "dogues"] },
  nice: { name: "Nizza", league: "ligue1", color: "#E30613", keywords: ["nizza", "nice", "ogc nice"] },
};

export const LIGHT_BG = ["#FFFFFF", "#FFFF00", "#FFD700", "#FFE667", "#FDE100", "#FFCC00"];
export const isLight = (c) => LIGHT_BG.includes(c);

export function classify(article) {
  const hay = `${article.title} ${article.description}`.toLowerCase();
  const teams = [];
  const leagues = new Set();
  for (const [id, team] of Object.entries(TEAMS)) {
    if (team.keywords.some((kw) => hay.includes(kw.toLowerCase()))) {
      teams.push(id);
      leagues.add(team.league);
    }
  }
  if (hay.match(/serie a|seria a/)) leagues.add("seriea");
  if (hay.match(/premier league|premier inglese/)) leagues.add("premier");
  if (hay.match(/la liga|laliga|liga spagnola/)) leagues.add("liga");
  if (hay.match(/bundesliga/)) leagues.add("bundes");
  if (hay.match(/ligue 1|ligue1/)) leagues.add("ligue1");
  if (hay.match(/champions league|champions|uefa champions/)) leagues.add("ucl");
  return { teams, leagues: Array.from(leagues) };
}
