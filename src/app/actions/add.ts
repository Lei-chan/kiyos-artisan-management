"use server";
import { FormState, MyError } from "../lib/definitions";
import { handleErrors } from "../lib/helper";
import ManagerZod from "../lib/validators/Manager";
import Manager from "../lib/models/Manager";
import dbConnect from "../lib/database";
import bcrypt from "bcrypt";
import { verifySession } from "../lib/dal";

const verifyKey = (key: string) => {
  const verified = key === process.env.SECRET_KEY;

  if (!verified) {
    const err = new Error("Unauthorized") as MyError;
    err.status = 401;
    throw err;
  }
};

export default async function add(formState: FormState, formData: FormData) {
  const { isAuth, userId } = await verifySession();
  try {
    // verify if user is allowed to add
    await dbConnect();
    const manager = await Manager.findById(userId).select("isAllowedToAdd");
    if (!manager) return handleErrors("notFound");
    if (!manager.isAllowedToAdd) return handleErrors("unauthorized");

    // verify if key is correct key
    verifyKey(String(formData.get("key")).trim());

    const { password, ...others } = {
      username: String(formData.get("username")).trim(),
      password: String(formData.get("password")).trim(),
      isAllowedToAdd: false,
    };

    const result = ManagerZod.safeParse({ password, ...others });

    if (!result.success)
      return handleErrors("zodError", undefined, result.error);

    // hash password
    const hashedPassword = await bcrypt.hash(password as string, 10);

    // create manager
    await Manager.create({
      password: hashedPassword,
      ...others,
    });

    return { message: "管理者が追加されました" };
  } catch (err: unknown) {
    return handleErrors("others", err);
  }
}
