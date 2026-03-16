import dbConnect from "@/app/lib/database";
import HistoryAmavin from "@/app/lib/models/HistoryAmavin";
import HistoryKiyos from "@/app/lib/models/HistoryKiyos";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const historyKiyos = await HistoryKiyos.find();
  const historyAmavin = await HistoryAmavin.find();

  const data = { historyKiyos, historyAmavin };

  return NextResponse.json(data);
}
