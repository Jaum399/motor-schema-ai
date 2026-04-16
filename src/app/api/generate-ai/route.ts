import { NextResponse } from "next/server";
import {
  buildSearchSuggestions,
  searchEngineCatalog,
  type SearchParams,
} from "@/data/engines";
import { generateAiBlueprint } from "@/lib/ai-schema";
import { connectToDatabase } from "@/lib/mongodb";
import { SearchRecord } from "@/models/SearchRecord";

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
  const payload = await safeFetchJson(
    `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`
  );

  if (payload?.extract) {
    return {
      title: payload.title,
      extract: payload.extract,
      image: payload.thumbnail?.source || null,
      url: payload.content_urls?.desktop?.page || null,
    };
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters: SearchParams = {
    brand: searchParams.get("brand") || "",
    engine: searchParams.get("engine") || "",
    model: searchParams.get("model") || "",
  };

  if (!filters.brand && !filters.engine) {
    return NextResponse.json({ error: "Informe ao menos a marca ou o motor." }, { status: 400 });
  }

  const results = searchEngineCatalog(filters);
  const bestMatch = results[0] || null;
  const aiBlueprint = await generateAiBlueprint({
    record: bestMatch,
    brand: filters.brand,
    engine: filters.engine,
  });

  const [modelHints, wiki] = await Promise.all([
    fetchModelHints(filters.brand),
    fetchWikipediaSummary([bestMatch?.brand || filters.brand, bestMatch?.model || filters.engine].filter(Boolean).join(" ")),
  ]);

  const schemaImageUrl = `/api/diagram?id=${encodeURIComponent(bestMatch?.id || "custom")}&brand=${encodeURIComponent(
    bestMatch?.brand || filters.brand || "Motor"
  )}&model=${encodeURIComponent(bestMatch?.model || filters.model || "Esquema")}&engine=${encodeURIComponent(
    bestMatch?.engineCode || filters.engine || "Diesel"
  )}&mode=ai`;

  let storageMode: "mongodb" | "demo" = "demo";
  try {
    const db = await connectToDatabase();
    if (db) {
      await SearchRecord.create({
        brand: filters.brand,
        model: bestMatch?.model || filters.model,
        engine: filters.engine,
        matchedEngineId: bestMatch?.id || null,
        schemaImageUrl,
        source: aiBlueprint.provider,
      });
      storageMode = "mongodb";
    }
  } catch {
    storageMode = "demo";
  }

  return NextResponse.json({
    query: filters,
    results,
    aiSummary: aiBlueprint.narrative,
    aiProvider: aiBlueprint.provider,
    aiBlueprint,
    suggestions: buildSearchSuggestions(results, filters),
    schemaImageUrl,
    publicData: {
      modelHints,
      wiki,
      sourceLabel: aiBlueprint.provider === "gemini" ? "Gemini + NHTSA + Wikipedia" : "IA local + NHTSA + Wikipedia",
    },
    storageMode,
    generatedAt: new Date().toISOString(),
  });
}
