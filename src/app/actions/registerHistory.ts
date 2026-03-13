"use server";
import { FormState } from "../lib/definitions";
import { handleErrors } from "../lib/helper";
import sharp from "sharp";

export async function registerHistory(
  formState: FormState,
  data: {
    type: "kiyos" | "amavin";
    data: { formData: FormData; year: number; month: number };
  },
) {
  try {
    console.log(data.data);
    // const formDataArr = [...data.data];

    // const images =
    // for (const [key, value] of data.data)

    // const image1 = data.data.get("");
  } catch (err: unknown) {
    return handleErrors("others", err);
  }
}
