import { NextResponse } from "next/server";
import {
  buildSearchSuggestions,
  searchEngineCatalog,
  type SearchParams,
} from "@/data/engines";
import { generateAiBlueprint } from "@/lib/ai-schema";
import { fetchPublicTechnicalData } from "@/lib/public-tech-sources";
import { connectToDatabase } from "@/lib/mongodb";
import { SearchRecord } from "@/models/SearchRecord";

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

  const publicTechData = await fetchPublicTechnicalData({
    brand: bestMatch?.brand || filters.brand,
    engine: bestMatch?.engineCode || filters.engine,
    model: bestMatch?.model || filters.model,
  });

  const schemaImageUrl = `/api/diagram?id=${encodeURIComponent(bestMatch?.id || "custom")}&brand=${encodeURIComponent(
    bestMatch?.brand || filters.brand || "Motor"
  )}&model=${encodeURIComponent(bestMatch?.model || filters.model || "Esquema")}&engine=${encodeURIComponent(
    bestMatch?.engineCode || filters.engine || "Diesel"
  )}&mode=ai&layout=${encodeURIComponent(aiBlueprint.layoutHint || publicTechData.profile.layoutHint)}&theme=${encodeURIComponent(publicTechData.profile.visualTheme)}`;

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
      ...publicTechData,
      sourceLabel:
        aiBlueprint.provider === "gemini"
          ? "Gemini + Base técnica + NHTSA + Wikipedia + Wikimedia Commons + DuckDuckGo"
          : publicTechData.sourceLabel,
    },
    storageMode,
    generatedAt: new Date().toISOString(),
  });
}
