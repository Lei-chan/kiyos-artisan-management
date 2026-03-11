"use server";
import { FormState, MyError } from "../lib/definitions";
import { handleErrors } from "../lib/helper";
import ManagerZod from "../lib/validators/Manager";
import Manager from "../lib/models/Manager";
import dbConnect from "../lib/database";
import bcrypt from "bcrypt";

const verifyKey = (key: string) => {
  const verified = key === process.env.SECRET_KEY;

  if (!verified) {
    const err = new Error("Unauthorized") as MyError;
    err.status = 401;
    throw err;
  }
};

export default async function add(formState: FormState, formData: FormData) {
  try {
    verifyKey(String(formData.get("key")).trim());

    const data = {
      username: String(formData.get("username")).trim(),
      password: String(formData.get("password")).trim(),
    };

    const result = ManagerZod.safeParse(data);

    if (!result.success)
      return handleErrors("zodError", undefined, result.error);

    // hash password
    const hashedPassword = await bcrypt.hash(data.password as string, 10);

    await dbConnect();
    await Manager.create({ username: data.username, password: hashedPassword });

    return { message: "管理者が追加されました" };
  } catch (err: unknown) {
    return handleErrors("others", err);
  }
}
