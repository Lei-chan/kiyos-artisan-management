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

    if (_id) await News.findByIdAndUpdate(_id, result.data);

    if (!_id) await News.create(result.data);

    return { message: "お知らせの登録が完了しました" };
  } catch (err: unknown) {
    return handleErrors("others", err);
  }
}

export async function deleteNews(formState: FormState, id: string) {
  await verifySession();
  try {
    console.log(id);
    await dbConnect();
    const deletedNews = await News.findByIdAndDelete(id);
    console.log(deletedNews);

    return { message: "お知らせが削除されました" };
  } catch (err: unknown) {
    return handleErrors("others", err);
  }
}
