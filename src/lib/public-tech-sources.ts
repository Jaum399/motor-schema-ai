export type PublicTechImage = {
  src: string;
  title: string;
  source: string;
  sourceUrl?: string | null;
};

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
  photoGallery: PublicTechImage[];
};

async function safeFetchJson(url: string, extraHeaders: Record<string, string> = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "motor-schema-ai/1.0",
        ...extraHeaders,
      },
      signal: AbortSignal.timeout(3500),
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

async function fetchWikipediaGallery(queries: string[]): Promise<PublicTechImage[]> {
  const uniqueQueries = Array.from(new Set(queries.filter(Boolean))).slice(0, 3);
  const requests = uniqueQueries.flatMap((query, index) => {
    const languages = index === 0 ? ["pt", "en"] : ["en"];
    return languages.map(async (language) => {
      const payload = await safeFetchJson(
        `https://${language}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=4&prop=pageimages|info&piprop=original|thumbnail&pithumbsize=1600&inprop=url&format=json&origin=*`
      );

      const pages = Object.values((payload?.query?.pages || {}) as Record<string, any>);
      return pages
        .map((page) => ({
          src: page?.original?.source || page?.thumbnail?.source || "",
          title: page?.title || query,
          source: `Wikipedia ${language.toUpperCase()}`,
          sourceUrl: page?.fullurl || null,
        }))
        .filter((item) => Boolean(item.src));
    });
  });

  const resolved = await Promise.all(requests);
  return resolved.flat().slice(0, 6);
}

async function fetchWikimediaImages(term: string): Promise<PublicTechImage[]> {
  const payload = await safeFetchJson(
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(`${term} truck bus engine`)}&gsrlimit=6&prop=pageimages|info&piprop=original|thumbnail&pithumbsize=1600&inprop=url&format=json&origin=*`
  );

  const pages = Object.values((payload?.query?.pages || {}) as Record<string, any>);

  return pages
    .map((page) => ({
      src: page?.original?.source || page?.thumbnail?.source || "",
      title: page?.title || term,
      source: "Wikimedia Commons",
      sourceUrl: page?.fullurl || null,
    }))
    .filter((item) => Boolean(item.src))
    .slice(0, 4);
}

async function fetchPexelsImages(term: string): Promise<PublicTechImage[]> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    return [];
  }

  const payload = await safeFetchJson(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(`${term} diesel engine`)}&per_page=4&orientation=landscape`,
    { Authorization: apiKey }
  );

  return (payload?.photos || [])
    .map((photo: any) => ({
      src: photo?.src?.large2x || photo?.src?.large || photo?.src?.original || "",
      title: photo?.alt || term,
      source: "Pexels",
      sourceUrl: photo?.url || null,
    }))
    .filter((item: PublicTechImage) => Boolean(item.src))
    .slice(0, 4);
}

function scoreReferenceImage(image: PublicTechImage) {
  const text = `${image.title} ${image.src}`.toLowerCase();
  let score = 0;

  if (/(engine|diesel|truck|bus|cargo|stralis|daily|cursor|scania|iveco|cummins|mercedes|volvo|mwm)/.test(text)) {
    score += 4;
  }

  if (/(logo|emblem|headquarter|headquarters|flag|company)/.test(text)) {
    score -= 5;
  }

  if (/\.(jpg|jpeg|webp)/.test(text)) {
    score += 1;
  }

  if (/\.png/.test(text)) {
    score -= 1;
  }

  return score;
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
  const imageQueries = [
    [brand, model].filter(Boolean).join(" "),
    [brand, "truck"].filter(Boolean).join(" "),
    [brand, "engine"].filter(Boolean).join(" "),
    [model, "engine"].filter(Boolean).join(" "),
    [engine, "diesel"].filter(Boolean).join(" "),
  ].filter(Boolean);

  const [modelHints, wiki, duckAnswer, wikipediaGallery, wikimediaImages, pexelsImages] = await Promise.all([
    fetchModelHints(brand),
    fetchWikipediaSummary(searchTerm),
    fetchDuckAnswer(searchTerm),
    fetchWikipediaGallery(imageQueries),
    fetchWikimediaImages(searchTerm),
    fetchPexelsImages(searchTerm),
  ]);

  const photoGallery = [
    wiki?.image
      ? {
          src: wiki.image,
          title: wiki.title,
          source: "Wikipedia",
          sourceUrl: wiki.url || null,
        }
      : null,
    ...wikipediaGallery,
    ...wikimediaImages,
    ...pexelsImages,
  ].filter((item): item is PublicTechImage => Boolean(item?.src));

  const uniqueGallery = photoGallery
    .filter((item, index, array) => array.findIndex((entry) => entry.src === item.src) === index)
    .sort((a, b) => scoreReferenceImage(b) - scoreReferenceImage(a));

  const sourceList = ["Base técnica interna", "NHTSA", "Wikipedia", "Wikimedia Commons", "DuckDuckGo"];
  if (pexelsImages.length) {
    sourceList.push("Pexels");
  }
  sourceList.push("Gemini opcional");

  return {
    modelHints,
    wiki,
    duckAnswer,
    sourceList,
    sourceLabel: sourceList.join(" + "),
    photoGallery: uniqueGallery.slice(0, 6),
  };
}
