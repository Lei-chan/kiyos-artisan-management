import * as z from "zod";
import { MyError } from "./definitions";

const isMyError = (err: unknown): err is MyError => err instanceof Error;

export const handleErrors = (
  type: "notFound" | "zodError" | "unauthorized" | "others",
  err?: unknown,
  zodError?: z.ZodError,
) => {
  if (type === "notFound") {
    console.error("User not found", err || "");
    return { error: { message: "User not found", status: 404 } };
  }

  if (type === "zodError" && zodError) {
    const fieldErrors = z.prettifyError(zodError);

    return { error: { message: fieldErrors, status: 400 } };
  }

  if (type === "unauthorized")
    return { error: { message: "Unauthorized", status: 403 } };

  if (isMyError(err)) {
    console.error("Error", err);
    return {
      error: {
        message: err.message || "Unexpected Error",
        status: err?.status || 500,
      },
    };
  }

  console.error("Unexpected Error");
  return {
    error: { message: "Unexpected Error", status: 500 },
  };
};
