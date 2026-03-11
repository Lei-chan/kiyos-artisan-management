"use server";
import dbConnect from "../lib/database";
import { FormState } from "../lib/definitions";
import { handleErrors } from "../lib/helper";
import Manager from "../lib/models/Manager";
import { createSession } from "../lib/session";

export async function login(formState: FormState, formData: FormData) {
  try {
    const data = {
      username: String(formData.get("username")).trim(),
      password: String(formData.get("password")),
    };

    await dbConnect();
    const manager = await Manager.findOne({ username: data.username });
    if (!manager) return handleErrors("notFound");

    await createSession(manager._id);
    return { message: "認証に成功しました" };
  } catch (err: unknown) {
    return handleErrors("others", err);
  }
}
