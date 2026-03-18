// next.js
import { NextResponse } from "next/server";
// dal
import { getNews } from "@/app/lib/dal";
// settings
import { apiResponeOptions } from "@/app/lib/config";
// type
import { NewsData } from "@/app/lib/definitions";

export async function GET() {
  try {
    const news = await getNews();
    if (!news) throw new Error("Server error while fetching");

    // remove unecessary field for UI
    const structuredNews = news.map((n: NewsData) => {
      const { lastModifiedUserId, ...others } = n;
      return { ...others };
    });

    return NextResponse.json(structuredNews, apiResponeOptions);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : err },
      { status: 500 },
    );
  }
}
