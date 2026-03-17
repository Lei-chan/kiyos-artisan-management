// next.js
import { NextRequest, NextResponse } from "next/server";
// database
import dbConnect from "@/app/lib/database";
import HistoryAmavin from "@/app/lib/models/HistoryAmavin";
import HistoryKiyos from "@/app/lib/models/HistoryKiyos";
// settings
import { CLIENT_URL } from "@/app/lib/config";
// types
import { HistoryContent, HistoryData } from "@/app/lib/definitions";

const responeOptions = {
  headers: { "Access-Control-Allow-Origin": "*" },
};

const convertHistoryDataForSearch = (
  type: "kiyos" | "amavin",
  data: HistoryData[],
) =>
  data.map((d) => {
    return {
      type,
      year: d.year,
      month: d.month,
      sentence: d.contents.map((con) => con.sentence),
    };
  });

const convertHistoryDataWithBase64 = (data: HistoryData[]) =>
  data.map((d) => {
    return {
      year: d.year,
      month: d.month,
      contents: d.contents.map((con: HistoryContent) => {
        return {
          ...con,
          images: con.images.map((img) => {
            return {
              name: img.name,
              data: img.buffer.toString("base64"),
            };
          }),
        };
      }),
    };
  });

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    // 'history' or 'search'
    const page = searchParams.get("page");
    // empty for page 'search', 'kiyos', or 'amavin' for page 'history
    const type = searchParams.get("type");
    // empty for page 'search', some year for page 'history'
    const year = searchParams.get("year");

    if (page !== "history" && page !== "search")
      throw new Error('Page type must be "history" or "search"');
    if (page === "history" && (!type || !year))
      throw new Error("type and year are required");

    await dbConnect();

    if (page === "search") {
      const historyKioys = await HistoryKiyos.find().lean();
      const historyAmavin = await HistoryAmavin.find().lean();
      const historyKiyosForSearch = convertHistoryDataForSearch(
        "kiyos",
        historyKioys,
      );
      const historyAmavinForSearch = convertHistoryDataForSearch(
        "amavin",
        historyAmavin,
      );
      return NextResponse.json(
        [...historyKiyosForSearch, ...historyAmavinForSearch],
        responeOptions,
      );
    }

    const option = { year: parseInt(year as string) };
    const historyData =
      type === "kiyos"
        ? await HistoryKiyos.find(option).lean().exec()
        : await HistoryAmavin.find(option).lean().exec();

    const historyDataWithBase64 = convertHistoryDataWithBase64(historyData);

    return NextResponse.json(historyDataWithBase64, responeOptions);
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : err },
      { status: 500 },
    );
  }
}
