"use server";
// database
import dbConnect from "../lib/database";
import HistoryKiyos from "../lib/models/HistoryKiyos";
import HistoryAmavin from "../lib/models/HistoryAmavin";
// validator
import History from "../lib/validators/History";
// dal
import { verifySession } from "../lib/dal";
// methods
import { convertContentsToSendDatabase, handleErrors } from "../lib/helper";
// types
import { FormState, Group, RegisterHistoryData } from "../lib/definitions";

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

    return { message: "この月のHistoryが登録されました" };
  } catch (err: unknown) {
    return handleErrors("others", err);
  }
}

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
