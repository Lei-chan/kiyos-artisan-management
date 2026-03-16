import { CLIENT_URL } from "@/app/lib/config";
import dbConnect from "@/app/lib/database";
import {
  HistoryContent,
  HistoryData,
  ImageData,
  RegisterHistoryContent,
  RegisterHistoryImage,
} from "@/app/lib/definitions";
import HistoryAmavin from "@/app/lib/models/HistoryAmavin";
import HistoryKiyos from "@/app/lib/models/HistoryKiyos";
import { NextResponse } from "next/server";

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
            return { name: img.name, data: img.buffer.toString("base64") };
          }),
        };
      }),
    };
  });

export async function GET() {
  try {
    await dbConnect();

    const historyKiyos = await HistoryKiyos.find().lean();
    const historyAmavin = await HistoryAmavin.find().lean();

    const historyKiyosWithBase64 = convertHistoryDataWithBase64(historyKiyos);
    const historyAmavinWithBase64 = convertHistoryDataWithBase64(historyAmavin);

    const data = {
      historyKiyos: historyKiyosWithBase64,
      historyAmavin: historyAmavinWithBase64,
    };

    return NextResponse.json(data, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
