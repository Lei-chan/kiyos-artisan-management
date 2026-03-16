"use server";
import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt, deleteSession } from "./session";
import { redirect } from "next/navigation";
import dbConnect from "./database";
import HistoryKiyos from "./models/HistoryKiyos";
import HistoryAmavin from "./models/HistoryAmavin";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) redirect("/");

  return { isAuth: true, userId: session.userId };
});

export const getHistoryForDate = cache(
  async (type: "kiyos" | "amavin", year: number, month: number) => {
    try {
      await dbConnect();
      let data;

      if (type === "kiyos") data = await HistoryKiyos.findOne({ year, month });

      if (type === "amavin")
        data = await HistoryAmavin.findOne({ year, month });

      return !data ? {} : JSON.parse(JSON.stringify(data));
    } catch (err: unknown) {
      console.error("Error", err);
      return null;
    }
  },
);

export const logout = cache(async () => {
  await deleteSession();
  redirect("/");
});
