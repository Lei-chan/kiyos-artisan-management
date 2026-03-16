import * as z from "zod";
import {
  ImageData,
  MyError,
  RegisterHistoryContent,
  RegisterHistoryImage,
} from "./definitions";
import Resizer from "react-image-file-resizer";

const isMyError = (err: unknown): err is MyError => err instanceof Error;

export const handleErrors = (
  type: "notFound" | "zodError" | "unauthorized" | "others",
  err?: unknown,
  zodError?: z.ZodError,
) => {
  if (type === "notFound") {
    console.error("User not found", err || "");
    return { error: { message: "管理者が見つかりません", status: 404 } };
  }

  if (type === "zodError" && zodError) {
    const fieldErrors = z.prettifyError(zodError);

    return { error: { message: fieldErrors, status: 400 } };
  }

  if (type === "unauthorized")
    return { error: { message: "認証に失敗しました", status: 403 } };

  if (isMyError(err)) {
    console.error("Error", err);
    return {
      error: {
        message: err.message || "予期せぬエラーが発生しました",
        status: err?.status || 500,
      },
    };
  }

  console.error("Unexpected Error");
  return {
    error: { message: "予期せぬエラーが発生しました", status: 500 },
  };
};

export const wait = (seconds: number = 3) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const convertBufferToBlob = (buffer: Buffer) => {
  const nodeJsBuffer = Buffer.from(buffer);
  return new Blob([nodeJsBuffer]);
};

export const convertDatabaseImagesToFiles = (images: ImageData[]) => {
  const files = images.map((img) => {
    const blob = convertBufferToBlob(img.buffer);
    return new File([blob], img.name, { type: blob.type });
  });
  return files;
};

// resize image to 500 x 400, convert it to webp, send data as arrayBuffer
const resizeImage = async (files: (File | undefined)[]) => {
  try {
    const fileNames = files.map((file) => file?.name);

    const resizedFiles = (await Promise.all(
      files.map((file) =>
        file && file.size
          ? new Promise((resolve) => {
              Resizer.imageFileResizer(
                file,
                500,
                400,
                "WEBP",
                100,
                0,
                (uri) => resolve(uri),
                "file",
              );
            })
          : undefined,
      ),
    )) as (File | undefined)[];

    const arrayBuffers = await Promise.all(
      resizedFiles.map((file) => (file?.size ? file.arrayBuffer() : undefined)),
    );

    return arrayBuffers.map((arrBuf, i) =>
      arrBuf ? { name: fileNames[i], arrayBuffer: arrayBuffers[i] } : undefined,
    );
  } catch (err) {
    throw err;
  }
};

// return contents with images of arrayBuffer data
export const getContentsFromData = async (
  formData: FormData,
  images: (File | undefined)[][],
) => {
  try {
    const flattenedFormDataArr = [...formData].flat();
    const sentenceJa = flattenedFormDataArr.filter((data) =>
      String(data).includes("sentenceJa"),
    );

    // filtered out undefined
    const contentsImages = await Promise.all(
      images.map((imgs) => resizeImage(imgs)),
    );

    // const contentsImages = await Promise.all(
    //   sentenceJa.map((_, i) => {
    //     const images = formData.getAll(`image${i + 1}`) as File[];
    //     return resizeImage(images);
    //   }),
    // );

    const structuredContents = sentenceJa.map((sentenceName, i) => {
      return {
        // remove undefined from images
        images: contentsImages[i].filter(
          (image) => image,
        ) as RegisterHistoryImage[],
        sentence: {
          ja: String(formData.get(String(sentenceName))).split("\n"),
          en: String(formData.get(`sentenceEn${i + 1}`)).split("\n"),
        },
      };
    });

    return structuredContents;
  } catch (err) {
    throw err;
  }
};

export const convertContentsToSendDatabase = (
  contents: RegisterHistoryContent[],
) =>
  contents.map((con) => {
    return {
      images: con.images.map((img) => {
        return { name: img.name, buffer: Buffer.from(img.arrayBuffer) };
      }),
      sentence: con.sentence,
    };
  });
