"use server";
// database
import dbConnect from "../lib/database";
import News from "../lib/models/News";
// zod validation
import NewsValidator from "../lib/validators/News";
// dal
import { verifySession } from "../lib/dal";
// method
import { handleErrors } from "../lib/helper";
// type
import { FormState, NewsData } from "../lib/definitions";

export async function createUpdateNews(formState: FormState, data: NewsData) {
  const { isAuth, userId } = await verifySession();
  try {
    const { _id, ...others } = data;
    const dataWithUserId = { ...others, lastModifiedUserId: userId };

    const result = NewsValidator.safeParse(dataWithUserId);

    if (!result.success)
      return handleErrors("zodError", undefined, result.error);

    await dbConnect();

    let newData;

    if (_id) newData = await News.findByIdAndUpdate(_id, result.data);

    if (!_id) newData = await News.create(result.data);

    console.log(newData);

    return { message: "お知らせの登録が完了しました" };
  } catch (err: unknown) {
    return handleErrors("others", err);
  }
}
