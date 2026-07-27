import "server-only";

export type RenewableNewsItem = {
  title: string;
  href: string;
  source: string;
  category: string;
  publishedAt: string;
  score: number;
};

type Feed = {
  name: string;
  url: string;
};

const FEEDS: Feed[] = [
  {
    name: "pv magazine",
    url: "https://www.pv-magazine.com/feed/",
  },
  {
    name: "Energy-Storage.news",
    url: "https://www.energy-storage.news/feed/",
  },
];

const PRIORITY_KEYWORDS: Array<[string, number, string]> = [
  ["utility-scale", 12, "UTILITY SOLAR"],
  ["battery energy storage", 12, "BESS"],
  ["energy storage", 11, "STORAGE"],
  ["bess", 11, "BESS"],
  ["grid connection", 11, "GRID"],
  ["transmission", 10, "GRID"],
  ["solar", 9, "SOLAR"],
  ["photovoltaic", 9, "SOLAR"],
  ["permitting", 8, "PERMITTING"],
  ["ppa", 8, "MARKETS"],
  ["auction", 8, "MARKETS"],
  ["project finance", 8, "FINANCE"],
  ["merger", 7, "M&A"],
  ["acquisition", 7, "M&A"],
  ["inverter", 5, "TECHNOLOGY"],
  ["module", 5, "TECHNOLOGY"],
  ["battery", 5, "STORAGE"],
  ["renewable", 4, "RENEWABLES"],
];

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"),
  );
  return match ? decodeXml(match[1]) : "";
}

function getPriority(title: string) {
  const normalizedTitle = title.toLowerCase();
  const matches = PRIORITY_KEYWORDS.filter(([keyword]) =>
    normalizedTitle.includes(keyword),
  );
  if (!matches.length) {
    return { score: 0, category: "RENEWABLES" };
  }
  const [, score, category] = matches.sort((a, b) => b[1] - a[1])[0];
  return { score, category };
}

function parseFeed(xml: string, source: string): RenewableNewsItem[] {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return blocks.flatMap((block) => {
    const title = extractTag(block, "title");
    const href = extractTag(block, "link");
    const publishedAt = extractTag(block, "pubDate");
    if (!title || !href || !href.startsWith("http")) return [];

    const priority = getPriority(title);
    if (priority.score === 0) return [];

    return [
      {
        title,
        href,
        source,
        category: priority.category,
        publishedAt,
        score: priority.score,
      },
    ];
  });
}

async function fetchFeed(feed: Feed) {
  try {
    const response = await fetch(feed.url, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "SolarDev.ai Renewables Live/1.0",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    return parseFeed(await response.text(), feed.name);
  } catch {
    return [];
  }
}

export async function getRenewableNews(): Promise<RenewableNewsItem[]> {
  const results = (await Promise.all(FEEDS.map(fetchFeed))).flat();
  const unique = new Map<string, RenewableNewsItem>();

  for (const item of results) {
    const key = item.title.toLowerCase().replace(/\W+/g, " ").trim();
    if (!unique.has(key)) unique.set(key, item);
  }

  return [...unique.values()]
    .sort((a, b) => {
      const dateDifference =
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      return b.score - a.score || dateDifference;
    })
    .slice(0, 8);
}
