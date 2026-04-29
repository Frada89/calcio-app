import Parser from "rss-parser";
import { FEEDS, classify } from "@/lib/config";

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; CalcioApp/1.0)" },
});

let cache = { data: null, time: 0 };
const CACHE_MS = 60 * 1000;

async function fetchFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).map((item) => {
      const description = (item.contentSnippet || item.summary || item.content || "")
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 220);
      const article = {
        id: `${source.id}-${item.link || item.guid}`,
        title: item.title || "",
        link: item.link || "",
        description,
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
