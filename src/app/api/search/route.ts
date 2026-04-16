import { NextResponse } from "next/server";
import {
  buildSearchSuggestions,
  createAiAssemblySummary,
  searchEngineCatalog,
  type SearchParams,
} from "@/data/engines";
import { connectToDatabase } from "@/lib/mongodb";
import { SearchRecord } from "@/models/SearchRecord";

async function safeFetchJson(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "motor-schema-ai/1.0",
      },
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

async function fetchVinDecode(chassis?: string) {
  if (!chassis || chassis.trim().length < 6) {
    return null;
  }

  const payload = await safeFetchJson(
    `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(chassis)}?format=json`
  );

  return payload?.Results?.[0] || null;
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters: SearchParams = {
    brand: searchParams.get("brand") || "",
    model: searchParams.get("model") || "",
    engine: searchParams.get("engine") || "",
    chassis: searchParams.get("chassis") || "",
  };

  if (!filters.brand && !filters.engine) {
    return NextResponse.json(
      { error: "Informe ao menos a marca ou o motor." },
      { status: 400 }
    );
  }

  const results = searchEngineCatalog(filters);
  const bestMatch = results[0] || null;
  const referenceTerm = [bestMatch?.brand || filters.brand, bestMatch?.model || filters.model]
    .filter(Boolean)
    .join(" ");

  const [, modelHints, wiki] = await Promise.all([
    fetchVinDecode(filters.chassis),
    fetchModelHints(filters.brand),
    fetchWikipediaSummary(referenceTerm || filters.brand || filters.engine || "motor diesel"),
  ]);

  const schemaImageUrl = `/api/diagram?id=${encodeURIComponent(bestMatch?.id || "custom")}&brand=${encodeURIComponent(
    bestMatch?.brand || filters.brand || "Motor"
  )}&model=${encodeURIComponent(bestMatch?.model || filters.model || "Esquema")}&engine=${encodeURIComponent(
    bestMatch?.engineCode || filters.engine || "Diesel"
  )}`;

  let storageMode: "mongodb" | "demo" = "demo";

  try {
    const db = await connectToDatabase();
    if (db) {
      await SearchRecord.create({
        brand: filters.brand,
        model: filters.model,
        engine: filters.engine,
        chassis: filters.chassis,
        matchedEngineId: bestMatch?.id || null,
        schemaImageUrl,
      });
      storageMode = "mongodb";
    }
  } catch {
    storageMode = "demo";
  }

  return NextResponse.json({
    query: filters,
    results,
    aiSummary: createAiAssemblySummary(bestMatch, null),
    suggestions: buildSearchSuggestions(results, filters),
    schemaImageUrl,
    publicData: {
      modelHints,
      wiki,
      sourceLabel: "NHTSA + Wikipedia",
    },
    storageMode,
    generatedAt: new Date().toISOString(),
  });
}
