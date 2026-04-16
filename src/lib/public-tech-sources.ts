export type PublicTechData = {
  modelHints: string[];
  wiki: {
    title: string;
    extract: string;
    image?: string | null;
    url?: string | null;
  } | null;
  duckAnswer: string | null;
  sourceLabel: string;
  sourceList: string[];
};

async function safeFetchJson(url: string) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "motor-schema-ai/1.0" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

async function fetchModelHints(brand?: string) {
  if (!brand) {
    return [] as string[];
  }

  const payload = await safeFetchJson(
    `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(brand)}?format=json`
  );

  return (payload?.Results || [])
    .map((item: { Model_Name?: string }) => item.Model_Name)
    .filter(Boolean)
    .slice(0, 8);
}

async function fetchWikipediaSummary(term: string) {
  const languages = ["pt", "en"];

  for (const language of languages) {
    const payload = await safeFetchJson(
      `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`
    );

    if (payload?.extract) {
      return {
        title: payload.title,
        extract: payload.extract,
        image: payload.thumbnail?.source || null,
        url: payload.content_urls?.desktop?.page || null,
      };
    }
  }

  return null;
}

async function fetchDuckAnswer(term: string) {
  const payload = await safeFetchJson(
    `https://api.duckduckgo.com/?q=${encodeURIComponent(term)}&format=json&no_html=1&skip_disambig=1`
  );

  return payload?.AbstractText || payload?.Answer || null;
}

export async function fetchPublicTechnicalData({
  brand,
  engine,
  model,
}: {
  brand?: string;
  engine?: string;
  model?: string;
}): Promise<PublicTechData> {
  const searchTerm = [brand, model, engine].filter(Boolean).join(" ") || "motor diesel";

  const [modelHints, wiki, duckAnswer] = await Promise.all([
    fetchModelHints(brand),
    fetchWikipediaSummary(searchTerm),
    fetchDuckAnswer(searchTerm),
  ]);

  return {
    modelHints,
    wiki,
    duckAnswer,
    sourceList: ["Base técnica interna", "NHTSA", "Wikipedia", "DuckDuckGo", "Gemini opcional"],
    sourceLabel: "Base técnica interna + NHTSA + Wikipedia + DuckDuckGo + Gemini opcional",
  };
}
