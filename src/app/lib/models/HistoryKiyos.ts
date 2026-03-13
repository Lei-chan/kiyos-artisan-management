import mongoose from "mongoose";

const HistoryKiyosSchema = new mongoose.Schema(
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

export default mongoose.models.HistoryKiyos ||
  mongoose.model("HistoryKiyos", HistoryKiyosSchema);
