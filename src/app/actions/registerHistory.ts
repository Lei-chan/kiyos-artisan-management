"use server";
import { verifySession } from "../lib/dal";
import { FormState, Group, RegisterHistoryData } from "../lib/definitions";
import { convertContentsToSendDatabase, handleErrors } from "../lib/helper";
import History from "../lib/validators/History";
import dbConnect from "../lib/database";
import HistoryKiyos from "../lib/models/HistoryKiyos";
import HistoryAmavin from "../lib/models/HistoryAmavin";

// resize image to 500 x 400, convert it to webp, and return as buffer
// const resizeImage = async (files: File[]) => {
//   try {
//     if (!files.length) return;

//     const fileNames = files.map((file) => file.name);
//     const arrayBuffers = await Promise.all(
//       files.map((file) => (file.size ? file.arrayBuffer() : undefined)),
//     );

//     const buffers = await Promise.all(
//       arrayBuffers.map((buffer) =>
//         buffer
//           ? sharp(buffer)
//               .resize(500, 400, { fit: "inside" })
//               .toFormat("webp")
//               .toBuffer()
//           : undefined,
//       ),
//     );

//     return buffers.map((buffer, i) =>
//       buffer ? { name: fileNames[i], buffer } : undefined,
//     );
//   } catch (err) {
//     throw err;
//   }
// };

// const getContentsFromFormData = async (formData: FormData) => {
//   try {
//     const flattenedFormDataArr = [...formData].flat();
//     const sentenceJa = flattenedFormDataArr.filter((data) =>
//       String(data).includes("sentenceJa"),
//     );

//     const contentsImages = await Promise.all(
//       sentenceJa.map((_, i) => {
//         const images = formData.getAll(`image${i + 1}`) as File[];
//         return resizeImage(images);
//       }),
//     );

//     const structuredContents = await Promise.all(
//       sentenceJa.map((sentenceName, i) => {
//         return {
//           // remove undefined from images
//           images: contentsImages[i]?.filter((image) => image),
//           sentence: {
//             ja: String(formData.get(String(sentenceName))).split("\n"),
//             en: String(formData.get(`sentenceEn${i + 1}`)).split("\n"),
//           },
//         };
//       }),
//     );

//     return structuredContents;
//   } catch (err) {
//     throw err;
//   }
// };

export async function createUpdateHistory(
  formState: FormState,
  data: RegisterHistoryData,
) {
  const { isAuth, userId } = await verifySession();
  try {
    const { _id, contents, year, month } = data.data;

    const contentsWithBufferImages = convertContentsToSendDatabase(contents);

    const dataToSendServer = {
      year,
      month,
      contents: contentsWithBufferImages,
      lastModifiedUserId: userId,
    };

    const result = History.safeParse(dataToSendServer);
    if (!result.success)
      return handleErrors("zodError", undefined, result.error);

    // // let history;
    await dbConnect();
    // if no _id (meaning the history is not registered yet) => create
    if (!_id)
      data.type === "kiyos"
        ? await HistoryKiyos.create(dataToSendServer)
        : await HistoryAmavin.create(dataToSendServer);

    // if _id (meaning the history has already been registered) => update
    if (_id)
      data.type === "kiyos"
        ? await HistoryKiyos.findByIdAndUpdate(_id, dataToSendServer)
        : await HistoryAmavin.findByIdAndUpdate(_id, dataToSendServer);

    // // console.log(history);

    return { message: "この月のHistoryが登録されました" };
  } catch (err: unknown) {
    return handleErrors("others", err);
  }
}

// export async function updateHistory(
//   formState: FormState,
//   data: RegisterHistoryData,
// ) {
//   try {
//     console.log("updateHistory", data);
//   } catch (err: unknown) {
//     return handleErrors("others", err);
//   }
// }

export async function deleteHistory(type: Group, id: string) {
  try {
    await dbConnect();

    type === "kiyos"
      ? await HistoryKiyos.findByIdAndDelete(id)
      : await HistoryAmavin.findByIdAndDelete(id);

    return "History deleted successfully!";
  } catch (err) {
    console.error("Error", err);
  }
}
