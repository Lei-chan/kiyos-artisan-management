import { CLIENT_URL } from "@/app/lib/config";
import dbConnect from "@/app/lib/database";
import { HistoryContent, HistoryData } from "@/app/lib/definitions";
import HistoryAmavin from "@/app/lib/models/HistoryAmavin";
import HistoryKiyos from "@/app/lib/models/HistoryKiyos";
import { NextRequest, NextResponse } from "next/server";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": CLIENT_URL,
//   "Access-Control-Allow-Methods": "GET,OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type",
// };

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

const convertHistoryDataWithBase64 = (data: HistoryData[]) =>
  data.map((d) => {
    return {
      ...d,
      contents: d.contents.map((con: HistoryContent) => {
        return {
          ...con,
          images: con.images.map((img) => {
            return {
              name: img.name,
              data: Buffer.from(img.buffer).toString("base64"),
            };
          }),
        };
      }),
    };
  });

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");
    const year = searchParams.get("year");

    if (!type || !year) throw new Error("type and year are required");

    await dbConnect();

    const option = { year: parseInt(year) };

    const historyData =
      type === "kiyos"
        ? await HistoryKiyos.find(option).lean().exec()
        : await HistoryAmavin.find(option).lean().exec();

    const historyDataWithBase64 = convertHistoryDataWithBase64(historyData);

    const data = {
      history: historyDataWithBase64,
    };

    return NextResponse.json(data, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : err },
      { status: 500 },
    );
  }
}
