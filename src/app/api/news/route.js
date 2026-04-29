import Parser from "rss-parser";
import { FEEDS, classify } from "@/lib/config";

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; CalcioApp/1.0)" },
});

let cache = { data: null, time: 0 };
const CACHE_MS = 60 * 1000;

// Decodifica entità HTML comuni (&quot; &#39; &amp; &ugrave; ecc.)
function decodeEntities(text) {
  if (!text) return "";
  return text
    // Numeriche decimali: &#39; &#8217; ecc.
    .replace(/&#(\d+);/g, (_, code) => {
      try { return String.fromCodePoint(parseInt(code, 10)); }
      catch { return ""; }
    })
    // Numeriche esadecimali: &#x27; ecc.
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
      try { return String.fromCodePoint(parseInt(code, 16)); }
      catch { return ""; }
    })
    // Nominali più comuni
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&euro;/g, "€")
    .replace(/&pound;/g, "£")
    // Vocali accentate italiane
    .replace(/&agrave;/g, "à").replace(/&Agrave;/g, "À")
    .replace(/&egrave;/g, "è").replace(/&Egrave;/g, "È")
    .replace(/&eacute;/g, "é").replace(/&Eacute;/g, "É")
    .replace(/&igrave;/g, "ì").replace(/&Igrave;/g, "Ì")
    .replace(/&ograve;/g, "ò").replace(/&Ograve;/g, "Ò")
    .replace(/&ugrave;/g, "ù").replace(/&Ugrave;/g, "Ù")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&ccedil;/g, "ç")
    // &amp; PER ULTIMO (altrimenti rompe le altre entità)
    .replace(/&amp;/g, "&");
}

function cleanText(raw) {
  if (!raw) return "";
  // 1. Strip HTML tags
  let text = raw.replace(/<[^>]*>/g, "").trim();
  // 2. Decodifica entità (eseguita due volte per casi tipo &amp;quot;)
  text = decodeEntities(text);
  text = decodeEntities(text);
  // 3. Normalizza spazi multipli
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

async function fetchFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).map((item) => {
      const cleanTitle = cleanText(item.title || "");
      const cleanDesc = cleanText(item.contentSnippet || item.summary || item.content || "").slice(0, 220);

      const article = {
        id: `${source.id}-${item.link || item.guid}`,
        title: cleanTitle,
        link: item.link || "",
        description: cleanDesc,
        pubDate: item.isoDate || item.pubDate || new Date().toISOString(),
        source: { id: source.id, name: source.name, color: source.color, accent: source.accent },
      };
      const { teams, leagues } = classify(article);
      const allLeagues = new Set([...leagues, ...(source.leagues || [])]);
      if (source.leagues?.length === 1) {
        article.leagues = [source.leagues[0]];
      } else {
        article.leagues = Array.from(allLeagues);
      }
      article.teams = teams;
      return article;
    });
  } catch (err) {
    console.error(`[news] ${source.id}: ${err.message}`);
    return [];
  }
}

export async function GET() {
  if (cache.data && Date.now() - cache.time < CACHE_MS) {
    return Response.json({ articles: cache.data, cached: true });
  }
  try {
    const results = await Promise.all(FEEDS.map(fetchFeed));
    const all = results.flat();
    const seen = new Map();
    all.forEach((a) => {
      const key = a.title.slice(0, 60).toLowerCase();
      const existing = seen.get(key);
      if (!existing || new Date(existing.pubDate) < new Date(a.pubDate)) {
        seen.set(key, a);
      }
    });
    const unique = Array.from(seen.values())
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 250);
    cache = { data: unique, time: Date.now() };
    return Response.json({ articles: unique, cached: false });
  } catch (err) {
    return Response.json({ error: err.message, articles: [] }, { status: 500 });
  }
}
