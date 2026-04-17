import { NextResponse } from "next/server";
import {
  buildSearchSuggestions,
  createAiAssemblySummary,
  searchEngineCatalog,
  type SearchParams,
} from "@/data/engines";
import { fetchPublicTechnicalData } from "@/lib/public-tech-sources";
import { connectToDatabase } from "@/lib/mongodb";
import { SearchRecord } from "@/models/SearchRecord";

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

  const publicTechData = await fetchPublicTechnicalData({
    brand: bestMatch?.brand || filters.brand,
    engine: bestMatch?.engineCode || filters.engine,
    model: bestMatch?.model || filters.model || referenceTerm,
  });

  const schemaImageUrl = `/api/diagram?id=${encodeURIComponent(bestMatch?.id || "custom")}&brand=${encodeURIComponent(
    bestMatch?.brand || filters.brand || "Motor"
  )}&model=${encodeURIComponent(bestMatch?.model || filters.model || "Esquema")}&engine=${encodeURIComponent(
    bestMatch?.engineCode || filters.engine || "Diesel"
  )}&layout=${encodeURIComponent(publicTechData.profile.layoutHint)}&theme=${encodeURIComponent(publicTechData.profile.visualTheme)}`;

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
    publicData: publicTechData,
    storageMode,
    generatedAt: new Date().toISOString(),
  });
}
