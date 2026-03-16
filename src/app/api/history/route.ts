import { CLIENT_URL } from "@/app/lib/config";
import dbConnect from "@/app/lib/database";
import HistoryAmavin from "@/app/lib/models/HistoryAmavin";
import HistoryKiyos from "@/app/lib/models/HistoryKiyos";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": CLIENT_URL,
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  await dbConnect();

  const historyKiyos = await HistoryKiyos.find();
  const historyAmavin = await HistoryAmavin.find();

  const data = { historyKiyos, historyAmavin };

  return NextResponse.json(data, {
    headers: corsHeaders,
  });
}
