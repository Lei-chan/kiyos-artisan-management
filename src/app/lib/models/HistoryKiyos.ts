import mongoose from "mongoose";

const HistoryKiyosSchema = new mongoose.Schema(
  {
    year: Number,
    month: Number,
    contents: [
      {
        images: [{ buffer: Buffer, name: String }],
        sentence: { en: [String], ja: [String] },
      },
    ],
    lastModifiedUserId: String,
  },
  { timestamps: true },
);

export default mongoose.models.HistoryKiyos ||
  mongoose.model("HistoryKiyos", HistoryKiyosSchema);
