"use server";
import { redirect } from "next/navigation";
import dbConnect from "../lib/database";
import { FormState } from "../lib/definitions";
import { handleErrors } from "../lib/helper";
import Manager from "../lib/models/Manager";
import { createSession } from "../lib/session";
import bcrypt from "bcrypt";

export async function login(formState: FormState, formData: FormData) {
  try {
    const { username, password } = {
      username: String(formData.get("username")).trim(),
      password: String(formData.get("password")),
    };

    await dbConnect();
    const manager = await Manager.findOne({ username }).select("password");
    if (!manager) return handleErrors("notFound");

    // compare password
    const isValidPassword = await bcrypt.compare(password, manager.password);

    if (!isValidPassword) return handleErrors("unauthorized");

    await createSession(manager._id);
  } catch (err: unknown) {
    return handleErrors("others", err);
  }

  // redirect to dashboard
  redirect("/dashboard");
}
