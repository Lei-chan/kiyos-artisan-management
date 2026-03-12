import * as z from "zod";

const StringForLanguage = z.object({
  en: z.string().trim(),
  ja: z.string().trim(),
});

const History = z.object({
  year: z.string(),
  month: z.string(),
  contents: z.array(
    z.object({
      images: z.array(
        z.object({
          buffer: z.instanceof(Buffer),
          name: StringForLanguage,
        }),
      ),
      sentence: StringForLanguage,
    }),
  ),
  lastModifiedUserId: z.string(),
});

export default History;
