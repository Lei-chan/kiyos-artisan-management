import mongoose from "mongoose";

const HistoryKiyosSchema = new mongoose.Schema(
  {
    year: String,
    month: String,
    contents: [
      {
        images: [{ buffer: Buffer, name: { en: String, ja: String } }],
        sentence: { en: String, ja: String },
      },
    ],
    lastModifiedUserId: String,
  },
  { timestamps: true },
);

export default mongoose.models.HistoryKiyos ||
  mongoose.model("HistoryKiyos", HistoryKiyosSchema);