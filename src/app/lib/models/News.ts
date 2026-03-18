import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    date: String,
    type: String,
    content: {
      title: { en: String, ja: String },
      sentence: { en: [String], ja: [String] },
      link: String,
    },
    lastModifiedUserId: String,
  },
  { timestamps: true },
);

export default mongoose.models.News || mongoose.model("News", NewsSchema);
