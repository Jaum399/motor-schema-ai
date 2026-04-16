import { Schema, model, models } from "mongoose";

const SearchRecordSchema = new Schema(
  {
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    engine: { type: String, trim: true },
    chassis: { type: String, trim: true },
    matchedEngineId: { type: String, trim: true },
    schemaImageUrl: { type: String, trim: true },
    source: { type: String, default: "public-api" },
  },
  {
    timestamps: true,
  }
);

export const SearchRecord = models.SearchRecord || model("SearchRecord", SearchRecordSchema);
