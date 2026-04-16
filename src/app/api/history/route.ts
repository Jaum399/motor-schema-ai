import { NextResponse } from "next/server";
import { engineCatalog } from "@/data/engines";
import { connectToDatabase } from "@/lib/mongodb";
import { SearchRecord } from "@/models/SearchRecord";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (db) {
      const history = await SearchRecord.find({}, null, { sort: { createdAt: -1 }, limit: 6 }).lean();
      return NextResponse.json({ items: history, storageMode: "mongodb" });
    }
  } catch {
    // fallback para demo
  }

  return NextResponse.json({
    storageMode: "demo",
    items: engineCatalog.slice(0, 4).map((item, index) => ({
      _id: item.id,
      brand: item.brand,
      model: item.model,
      engine: item.engineCode,
      chassis: `DEMO-${index + 1}`,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    })),
  });
}
