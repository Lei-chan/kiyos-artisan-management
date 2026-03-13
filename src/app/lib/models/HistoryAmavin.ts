import mongoose from "mongoose";

const HistoryAmavinSchema = new mongoose.Schema(
  {
    year: Number,
    month: Number,
    contents: [
      {
        images: [{ buffer: Buffer, name: { en: String, ja: String } }],
        sentence: { en: [String], ja: [String] },
      },
    ],
    lastModifiedUserId: String,
  },
  { timestamps: true },
);

export default mongoose.models.HistoryAmavin ||
  mongoose.model("HistoryAmavin", HistoryAmavinSchema);
